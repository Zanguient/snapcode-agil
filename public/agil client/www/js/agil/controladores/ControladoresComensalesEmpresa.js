angular.module('agil.controladores')

    .controller('controladorComensalesEmpresa', function ($scope, $timeout, $localStorage, $filter, $location, blockUI, Clientes, ClientesNit, GuardarAlias, ObtenerAlias, GuardarGerencias,
        ObtenerGerencias, GuardarComensales, ObtenerComensales, GuardarComidas, ObtenerComidas, GuardarPrecioComidas, ObtenerPrecioComidas, GuardarHistorialExcel, GuardarComensalesExcel,
        ObtenerHistorial, GuardarEmpresasExcel, GuardarGerenciasExcel, GuardarComidasExcel, GuardarPreciosExcel, Paginator, BusquedaComensales, ObtenerReporteComedor, ObtenerCambioMoneda,
        ObtenerReporteEmpresa, ObtenerReporteComensal, ObtenerAlertasMarcacion, EditarAlertasMarcacion, ObtenerHistorialDocumentos, ObtenerDocumento) {

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.modalEdicionAlias = 'modalAliasEmpresasCliente'
        $scope.modalEdicionGerencias = 'modalGerenciaEmpresasCliente'
        $scope.modalEdicionComensales = 'modalComensalesEmpresasCliente'
        $scope.modalEdicionComidas = 'modalComidasEmpresasCliente'
        $scope.modalEdicionPrecios = 'modalPreciosComidasEmpresasCliente'
        $scope.dialogClienteEmpresa = 'dialog-cliente-empresa'
        $scope.busquedaComensalesEmpresa = 'dialog-comensales-empresa'
        $scope.dialogAlertasMarcaciones = 'dialog-alerta-marcaciones'
        $scope.dialogHistorialDocumentos = 'dialog-historial-documentos'
        var redirectProformas;
        $scope.imagenEmpresa;
        $scope.$on('$viewContentLoaded', function () {
            if (redirectProformas) {
                $timeout(function () {
                    $location.path('/proformas')
                    // blockUI.stop()
                }, 5000)
                return
            }
            ejecutarScriptsComensales($scope.modalEdicionAlias, $scope.modalEdicionGerencias, $scope.modalEdicionComensales, $scope.modalEdicionComidas, $scope.modalEdicionPrecios,
                $scope.dialogClienteEmpresa, $scope.busquedaComensalesEmpresa, $scope.dialogAlertasMarcaciones, $scope.dialogHistorialDocumentos);
            // resaltarPestaña($location.path().substring(1));
            // $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            // $scope.obtenerColumnasAplicacion()
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            if (!redirectProformas) {
                $scope.eliminarPopup($scope.modalEdicionAlias);
                $scope.eliminarPopup($scope.modalEdicionGerencias);
                $scope.eliminarPopup($scope.modalEdicionComensales);
                $scope.eliminarPopup($scope.modalEdicionComidas);
                $scope.eliminarPopup($scope.modalEdicionPrecios);
                $scope.eliminarPopup($scope.dialogClienteEmpresa);
                $scope.eliminarPopup($scope.busquedaComensalesEmpresa);
                $scope.eliminarPopup($scope.dialogAlertasMarcaciones);
                $scope.eliminarPopup($scope.dialogHistorialDocumentos);
            }
        });

        convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
            if (imagenEmpresa.length > 0 && imagenEmpresa !== "error") {
                $scope.imagenEmpresa = imagenEmpresa;
            } else {
                convertUrlToBase64Image("img/agilsoftware.png", function (imagenEmpresa) {
                    if (imagenEmpresa.length > 0 && imagenEmpresa !== "error") {
                        $scope.mostrarMensaje('No se encuentra la imagen de la empresa.')
                        $scope.imagenEmpresa = imagenEmpresa;
                    } else {
                        $scope.mostrarMensaje('No se encuentra imagenen de la empresa.')
                    }
                })
            }
        })

        $scope.inicio = function () {
            blockUI.start()
            $scope.activeModal = 0
            if ($scope.empresaExternaSeleccionada) {
                if (!$scope.empresaExternaSeleccionada.id) {
                    redirectProformas = true
                    return
                } else {
                    redirectProformas = false
                    blockUI.stop()
                }
            } else {
                redirectProformas = true
                return
            }
            var empresa = Object.assign({}, $scope.empresaExternaSeleccionada)
            $scope.filtroComensales = { desde: "", hasta: "", empresaCliente: empresa, id_usuario: "", id_cliente: "", mes: "", anio: "", gerencia: "", comida: "", comensal: "" }
            $scope.reportes = [{ id: 1, nombre: 'Reporte Comedor' }, { id: 2, nombre: 'Empresa' }, { id: 3, nombre: 'Por comensal' }]
            $scope.obtenerPaginador()
            $scope.listaAliasclientesEmpresa = []
            $scope.listaComensalesclienteEmpresa = []
            $scope.listaGerenciasClienteEmpresa = []
            $scope.listaComidasclienteEmpresa = []
            $scope.listaPrecioComidasclienteEmpresa = []
            $scope.alertaMarcaciones = []
            $scope.historialesDocumentos = []
            $scope.obtenerClientes()
            $scope.obtenerComidas()
            $scope.obtenerGerencias()
            $scope.obtenerHistoriales()
            $scope.obtenerComensales()
        }

        $scope.PopoverConfiguracionComensales = {
            templateUrl: 'PopoverConfiguracionComensales.html',
            title: 'Menu',
            isOpen: false
        };

        $scope.buscarCliente = function (query) {
            if (query != "" && query != undefined) {
                var promesa = ClientesNit($scope.usuario.id_empresa, query);
                return promesa;
            }
        }

        $scope.buscarComensales = function (query) {
            if (query != "" && query != undefined) {
                var promesa = BusquedaComensales($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id, query);
                return promesa;
            }
        }

        $scope.filtrarClientes = function (query) {
            $scope.clientesProcesados = $filter('filter')($scope.clientes, query);
        }

        $scope.filtrarComensales = function (query) {
            $scope.comensalesProcesados = $filter('filter')($scope.comensalesBusqueda, query);
        }

        $scope.obtenerHistorialDocumentos = function () {
            $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true)
            $scope.paginator.filter = $scope.filtroComensales
            var prom = ObtenerHistorialDocumentos($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id, $scope.paginator)
            prom.then(function (res) {
                $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true, true)
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.historialesDocumentos = res.documentos
                }
            })
        }

        $scope.obtenerClientes = function () {
            var prom = Clientes($scope.usuario.id_empresa);
            prom.then(function (cls) {
                $scope.clientes = cls
                $scope.clientesProcesados = cls
            }).catch(function (err) {
                blockUI.stop()
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
            })
        }

        $scope.establecerCliente = function (cliente) {
            switch ($scope.activeModal) {
                case 0:
                    if (!$scope.filtroComensales) {
                        $scope.filtroComensales = {}
                    }
                    $scope.filtroComensales.empresaCliente = Object.assign({}, cliente)
                    break;
                case 1:
                    if (!$scope.clienteEmpresaAsignacionAlias) {
                        $scope.clienteEmpresaAsignacionAlias = {}
                    }
                    $scope.clienteEmpresaAsignacionAlias.empresaCliente = Object.assign({}, cliente)
                    break;
                case 2:
                    if (!$scope.clienteEmpresaEdicionGerencias) {
                        $scope.clienteEmpresaEdicionGerencias = {}
                    }
                    $scope.clienteEmpresaEdicionGerencias.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerGerencias(true)
                    break;
                case 3:
                    if (!$scope.clienteEmpresaEdicionComensales) {
                        $scope.clienteEmpresaEdicionComensales = {}
                    }
                    $scope.clienteEmpresaEdicionComensales.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerComensales(true)
                    break;
                case 4:
                    if (!$scope.clienteEmpresaComidas) {
                        $scope.clienteEmpresaComidas = {}
                    }
                    $scope.clienteEmpresaComidas.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerComidas(true)
                    break;
                case 5:
                    if (!$scope.clienteEmpresaPreciosComidas) {
                        $scope.clienteEmpresaPreciosComidas = {}
                    }
                    $scope.clienteEmpresaPreciosComidas.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerPrecioComidas(true)
                    break;
                default:
                    $scope.mostrarMensaje('Ocurrio un error al asignar')
            }
        }

        $scope.establecerComensal = function (comensal, modal) {
            $scope.filtroComensales.comensal = Object.assign({}, comensal)
            if (modal) {
                $scope.cerrardialogBusquedaComensales()
            }
        }

        $scope.seleccionarcliente = function (cliente) {
            switch ($scope.activeModal) {
                case 0:
                    if (!$scope.filtroComensales) {
                        $scope.filtroComensales = {}
                    }
                    $scope.filtroComensales.empresaCliente = Object.assign({}, cliente)
                    break;
                case 1:
                    if (!$scope.clienteEmpresaAsignacionAlias) {
                        $scope.clienteEmpresaAsignacionAlias = {}
                    }
                    $scope.clienteEmpresaAsignacionAlias.empresaCliente = Object.assign({}, cliente)
                    break;
                case 2:
                    if (!$scope.clienteEmpresaEdicionGerencias) {
                        $scope.clienteEmpresaEdicionGerencias = {}
                    }
                    $scope.clienteEmpresaEdicionGerencias.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerGerencias(true)
                    break;
                case 3:
                    if (!$scope.clienteEmpresaEdicionComensales) {
                        $scope.clienteEmpresaEdicionComensales = {}
                    }
                    $scope.clienteEmpresaEdicionComensales.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerComensales(true)
                    break;
                case 4:
                    if (!$scope.clienteEmpresaComidas) {
                        $scope.clienteEmpresaComidas = {}
                    }
                    $scope.clienteEmpresaComidas.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerComidas(true)
                    break;
                case 5:
                    if (!$scope.clienteEmpresaPreciosComidas) {
                        $scope.clienteEmpresaPreciosComidas = {}
                    }
                    $scope.clienteEmpresaPreciosComidas.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerPrecioComidas(true)
                    break;
                default:
                    $scope.mostrarMensaje('Ocurrio un error al asignar')
            }
            $scope.cerrardialogClientesComensales()
        }

        $scope.obtenerAliasEmpresa = function () {
            blockUI.start()
            var prom = ObtenerAlias($scope.usuario.id_empresa, $scope.usuario.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.listaAliasclientesEmpresa = res.lista
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.obtenerGerencias = function (empresa) {
            blockUI.start()
            var prom;
            if (empresa) {
                prom = ObtenerGerencias($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaEdicionGerencias.empresaCliente.id)
            } else {
                prom = ObtenerGerencias($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
            }
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.listaGerenciasClienteEmpresa = res.lista
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.obtenerComensales = function (empresa) {
            blockUI.start()
            var prom;
            if (empresa) {
                prom = ObtenerComensales($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaEdicionComensales.empresaCliente.id)
            } else {
                prom = ObtenerComensales($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
            }
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.listaComensalesclienteEmpresa = res.lista
                    $scope.comensalesBusqueda = res.lista
                    $scope.comensalesProcesados = res.lista
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.obtenerComidas = function (empresa) {
            blockUI.start()
            var prom;
            if (empresa) {
                prom = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaComidas.empresaCliente.id)
            } else {
                prom = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
            }
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.listaComidasclienteEmpresa = res.lista
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.obtenerPrecioComidas = function (empresa) {
            blockUI.start()
            var prom;
            if (empresa) {
                prom = ObtenerPrecioComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaPreciosComidas.empresaCliente.id)
            } else {
                prom = ObtenerPrecioComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
            }
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.listaPrecioComidasclienteEmpresa = res.lista
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.obtenerHistoriales = function (filtrar) {
            $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true)
            $scope.paginator.filter = $scope.filtroComensales
            var prom = ObtenerHistorial($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id, $scope.paginator)
            prom.then(function (res) {
                $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true, true)
                if (res.hasErr) {
                    res.mostrarMensaje(res.mensaje)
                } else {
                    $scope.historialesComedor = res.historial.map(function (hist) {
                        hist.fecha = new Date(hist.fecha)
                        return hist
                    })
                    $scope.paginator.setPages(res.paginas)
                }
            })
        }

        $scope.obtenerAlertas = function (filtrar) {
            var prom = ObtenerAlertasMarcacion($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    res.mostrarMensaje(res.mensaje)
                } else {
                    $scope.alertaMarcaciones = res
                    $scope.alertaMarcaciones.marcacionesFaltantes = []
                    for (let index = 0; index < $scope.alertaMarcaciones.length; index++) {
                        var conteoIndex = -1
                                    if (reporteGerencias.some(function (dato) {
                                        conteoIndex += 1
                                        if (dato.gerencia.nombre === res.reporte[index].nombre && dato.fecha.split('T')[0] === res.reporte[index].historial[_index].fecha.split('T')[0]) {
                                            return true
                                        }
                                        return false
                                    })) {
                                        if (res.reporte[index].historial[_index].comida) {
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'desayuno') {
                                                reporteGerencias[conteoIndex].desayuno.cantidad += 1
                                                reporteGerencias[conteoIndex].desayuno.total += res.reporte[index].historial[_index].precio
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'almuerzo') {
                                                reporteGerencias[conteoIndex].almuerzo.cantidad += 1
                                                reporteGerencias[conteoIndex].almuerzo.total += res.reporte[index].historial[_index].precio
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'cena') {
                                                reporteGerencias[conteoIndex].cena.cantidad += 1
                                                reporteGerencias[conteoIndex].cena.total += res.reporte[index].historial[_index].precio
                                            }
                                        } else {
                                            reporteGerencias[conteoIndex].fuera_horario += 1
                                        }
                                        
                                    } else {
                                        var chingadera = { cantidad: 0, total: 0 }
                                        var combo = { empresaCliente: res.reporte[index].historial[_index].empresaCliente, gerencia: { id: res.reporte[index].id, nombre: res.reporte[index].nombre, codigo: res.reporte[index].codigo, id_cliente: res.reporte[index].id_cliente, id_empresa: res.reporte[index].id_empresa }, fecha: res.reporte[index].historial[_index].fecha.split('T')[0], desayuno: Object.assign({}, chingadera), almuerzo: Object.assign({}, chingadera), cena: Object.assign({}, chingadera), fuera_horario: 0 }
                                        if (res.reporte[index].historial[_index].comida) {
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'desayuno') {
                                                combo.desayuno.cantidad += 1
                                                combo.desayuno.total += res.reporte[index].historial[_index].precio
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'almuerzo') {
                                                combo.almuerzo.cantidad += 1
                                                combo.almuerzo.total += res.reporte[index].historial[_index].precio
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'cena') {
                                                combo.cena.cantidad += 1
                                                combo.cena.total += res.reporte[index].historial[_index].precio
                                            }
                                        } else {
                                            combo.observacion = 'Fuera de horario, no se puede contabilizar.'
                                        }
                                        reporteGerencias.push(combo)
                                    }
                    }
                }
            })
        }

        $scope.obtenerPaginador = function () {
            $scope.paginator = Paginator()
            $scope.paginator.column = "fecha"
            $scope.paginator.direccion = "asc"
            $scope.paginator.callBack = $scope.obtenerHistoriales
            // $scope.paginator.getSearch("")
        }

        $scope.filtrarHistorial = function (filtro, _, __) {
            if (__ !== undefined) {
                for (var key in filtro) {
                    if (filtro[key] == 0) {
                        filtro[key] = ""
                    }
                }
            } else {
                for (var key in filtro) {
                    if (filtro[key] === "" || filtro[key] === null) {
                        filtro[key] = 0
                    }
                }
            }
            if (_ === undefined || !_) {
                $scope.obtenerHistoriales(true)
            } else {
                return filtro
            }
        }

        $scope.subirExcelHistorial = function (event) {
            // blockUI.start();
            var files = event.target.files;
            var i, f;
            if (!files) {
                blockUI.stop();
                return
            }
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var Historial = [];
                    do {
                        var comensal = {};
                        comensal.tarjeta = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        comensal.nombre = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        comensal.fecha_hora = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                        comensal.lectora = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
                        comensal.alias = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
                        comensal.documento = name
                        Historial.push(comensal);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    // blockUI.stop();
                    angular.element($('fileUpload-Historial').val(null)).triggerHandler('change');
                    // $('fileUpload-Historial').val(null)
                    $scope.guardarHistorialExcel(Historial);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.subirExcelComensales = function (event) {
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    blockUI.start();
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var comensales = [];
                    do {
                        var comensal = {};
                        comensal.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        comensal.tarjeta = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        comensal.nombre = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                        comensal.empresaCliente = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
                        comensal.gerencia = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
                        comensal.tipo = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
                        comensales.push(comensal);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    blockUI.stop();
                    angular.element($('fileUploadComensales').val(null)).triggerHandler('change');
                    // $('fileUploadComensales').val(null)
                    $scope.guardarComensalesExcel(comensales);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.subirExcelEmpresas = function (event) {
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    blockUI.start();
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var empresas = [];
                    do {
                        var empresa = {};
                        empresa.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        empresa.empresaCliente = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        empresa.nombre = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                        empresas.push(empresa);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    blockUI.stop();
                    angular.element($('fileUpload-Empresas').val(null)).triggerHandler('change');
                    // $('fileUpload-Empresas').val(null)
                    $scope.guardarEmpresasExcel(empresas);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.subirExcelGerencias = function (event) {
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    blockUI.start();
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var gerencias = [];
                    do {
                        var gerencia = {};
                        gerencia.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        gerencia.empresaCliente = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        gerencia.nombre = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                        gerencia.lectora = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
                        gerencias.push(gerencia);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    blockUI.stop();
                    angular.element($('fileUpload-Gerencias').val(null)).triggerHandler('change');
                    $scope.guardarGerenciasExcel(gerencias);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.subirExcelComidas = function (event) {
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    blockUI.start();
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var comidas = [];
                    do {
                        var comida = {};
                        comida.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        comida.nombre = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        comida.inicio = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].w.toString() : null;
                        comida.final = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].w.toString() : null;
                        comida.empresaCliente = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
                        comidas.push(comida);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    blockUI.stop();
                    angular.element($('fileUpload-Comidas').val('')).triggerHandler('change');
                    // $('fileUpload-Comidas').val(null)
                    $scope.guardarComidasExcel(comidas);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.subirExcelPrecios = function (event) {
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    blockUI.start();
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var precios = [];
                    do {
                        var precio = {};
                        precio.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        precio.nombre = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        precio.empresaCliente = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                        precio.precio = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
                        precios.push(precio);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    blockUI.stop();
                    angular.element($('fileUpload-Precios').val('')).triggerHandler('change');
                    // $('fileUpload-Comidas').val(null)
                    $scope.guardarPreciosExcel(precios);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.extraerFechaExcel = function (datoFecha) {
            var horas = datoFecha.split(' ')[datoFecha.split(' ').length - 1]
            var fecha = datoFecha.split(' ')[0].split('/').reverse()
            if (horas.indexOf('AM') > 0) {
                horas = horas.split('A')[0].split(':')
            } else if (horas.indexOf('PM') > 0) {
                horas = horas.split('P')[0].split(':')
                horas[0] = (parseInt(horas[0]) + 12) + ''
            }
            var fecha_texto = fecha[0] + '-' + (fecha[2].length == 2 ? fecha[2] : '0' + fecha[2]) + '-' + (fecha[1].length == 2 ? fecha[1] : '0' + fecha[1]) + 'T' + (horas[0].length == 2 ? horas[0] : '0' + horas[0]) + ':' + (horas[1].length == 2 ? horas[1] : '0' + horas[1]) + ':' + (horas[2].length == 2 ? horas[2] : '0' + horas[2]) + '.000Z'
            var fechaCompleta = new Date(fecha[0], fecha[2] - 1, fecha[1], (horas[0].length == 2 ? horas[0] : '0' + horas[0]), (horas[1].length == 2 ? horas[1] : '0' + horas[1]), (horas[2].length == 2 ? horas[2] : '0' + horas[2]))
            return fechaCompleta, fecha_texto
        }

        $scope.guardarComensalesExcel = function (comensales) {
            if (comensales.length > 0) {
                var prom = GuardarComensalesExcel($scope.usuario.id_empresa, comensales, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.obtenerComensales()
                    if (!res.hasErr) {
                        if (res.mensajes) {
                            $scope.mostrarMensaje(res.mensaje + res.mensajes)
                        } else {
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    } else {
                        $scope.mostrarMensaje(res.mensajes)
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.guardarPreciosExcel = function (precios) {
            if (precios.length > 0) {
                var prom = GuardarPreciosExcel($scope.usuario.id_empresa, precios, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.obtenerPrecioComidas()
                    if (!res.hasErr) {
                        if (res.mensajes) {
                            $scope.mostrarMensaje(res.mensaje + res.mensajes)
                        } else {
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    } else {
                        $scope.mostrarMensaje(res.mensajes)
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.guardarHistorialExcel = function (Historial) {
            var datos = []
            if (Historial.length > 0) {
                Historial.forEach(function (comensal) {
                    if (!datos.some(function (dato) {
                        var _;
                        var fdato = $scope.extraerFechaExcel(dato.fecha_hora)
                        var fcomensal = $scope.extraerFechaExcel(comensal.fecha_hora)
                        _, dato.fecha = $scope.extraerFechaExcel(dato.fecha_hora)
                        if (!dato.fecha) {
                            console.log(dato)
                        }
                        var diffSec = (fcomensal - fdato) / 1000
                        if (diffSec < 0) {
                            diffSec *= -1
                        }
                        // var hrs = ~~(diff / 3600);
                        // var mins = ~~((diff % 3600) / 60);
                        // var secs = diff % 60;
                        if (!(dato.tarjeta === comensal.tarjeta && dato.nombre === comensal.nombre && diffSec < 100)) {
                            return false
                        } else {
                            return true
                        }
                    })) {
                        if (datos.length === 0) {
                            var _;
                            _, comensal.fecha = $scope.extraerFechaExcel(comensal.fecha_hora)
                        }
                        datos.push(comensal)
                    }
                })
            }
            if (datos.length > 0) {
                var prom = GuardarHistorialExcel($scope.usuario.id_empresa, datos, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.obtenerHistoriales()
                    if (!res.hasErr) {
                        $scope.obtenerAliasEmpresa()
                        if (res.mensajes) {
                            $scope.mostrarMensaje(res.mensaje + res.mensajes)
                        } else {
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    } else {
                        $scope.mostrarMensaje(res.mensajes)
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.guardarGerenciasExcel = function (gerencias) {
            if (gerencias.length > 0) {
                var prom = GuardarGerenciasExcel($scope.usuario.id_empresa, gerencias, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.obtenerGerencias()
                    if (!res.hasErr) {
                        if (res.mensajes) {
                            $scope.mostrarMensaje(res.mensaje + res.mensajes)
                        } else {
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    } else {
                        $scope.mostrarMensaje(res.mensajes)
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.guardarEmpresasExcel = function (empresas) {
            if (empresas.length > 0) {
                var prom = GuardarEmpresasExcel($scope.usuario.id_empresa, empresas, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.obtenerAliasEmpresa()
                    if (!res.hasErr) {
                        if (res.mensajes) {
                            $scope.mostrarMensaje(res.mensaje + res.mensajes)
                        } else {
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    } else {
                        $scope.mostrarMensaje(res.mensajes)
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.guardarComidasExcel = function (comidas) {
            if (comidas.length > 0) {
                var prom = GuardarComidasExcel($scope.usuario.id_empresa, comidas, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.obtenerComidas()
                    if (!res.hasErr) {
                        if (res.mensajes) {
                            $scope.mostrarMensaje(res.mensaje + res.mensajes)
                        } else {
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    } else {
                        $scope.mostrarMensaje(res.mensajes)
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.guardarAliasClienteEmpresa = function () {
            var datos = []
            if ($scope.listaAliasclientesEmpresa.length > 0) {
                $scope.listaAliasclientesEmpresa.forEach(function (alias) {
                    if (alias.nuevo || alias.eliminado || alias.editado) {
                        datos.push(alias)
                    }
                })
            }
            if (datos.length > 0) {
                var prom = GuardarAlias($scope.usuario.id_empresa, datos, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    if (!res.hasErr) {
                        $scope.obtenerAliasEmpresa()
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.agregarAliasClienteEmpresa = function (alias) {
            var extramsg = ''
            if (!$scope.listaAliasclientesEmpresa.some(function (data) {
                if (data.codigo) {
                    if (data.codigo === alias.codigo) {
                        extramsg += 'Código: ' + data.codigo + ' ya fué asigando. No se puede duplicar.'
                        return true
                    }
                } else {
                    extramsg += 'Código: Vacio'
                    return true
                }
                if (data.empresaCliente) {
                    if (data.empresaCliente.id === alias.empresaCliente.id) {
                        extramsg += 'Empresa: ' + data.empresaCliente.razon_social + ' ya fué asigando. No se puede duplicar.'
                        return true
                    }
                } else {
                    extramsg += 'Empresa: Vacio'
                    return true
                }
                if (data.nombre) {
                    if (data.nombre === alias.nombre) {
                        extramsg += 'Alias: ' + data.nombre + ' ya fué asigando. No se puede duplicar.'
                        return true
                    }
                } else {
                    extramsg += 'Alias: Vacio'
                    return true
                }
            })) {
                var obj = Object.assign({}, alias)
                obj.nuevo = true
                $scope.listaAliasclientesEmpresa.push(obj)
            } else {
                $scope.mostrarMensaje(extramsg)
            }
        }

        $scope.guardarGerenciasClienteEmpresa = function (clienteEmpresaEdicionGerencias) {
            var datos = []
            if ($scope.listaGerenciasClienteEmpresa.length > 0) {
                $scope.listaGerenciasClienteEmpresa.forEach(function (gerencia) {
                    if (gerencia.nuevo || gerencia.eliminado || gerencia.editado) {
                        datos.push(gerencia)
                    }
                })
            }
            if (datos.length > 0) {
                var prom = GuardarGerencias($scope.usuario.id_empresa, datos, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    if (!res.hasErr) {
                        $scope.obtenerGerencias()
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.agregarGerenciaClienteEmpresa = function (gerencia) {
            var extramsg = ''
            if (!$scope.listaGerenciasClienteEmpresa.some(function (data) {
                if ((data.codigo == gerencia.codigo && data.empresaCliente.id == gerencia.empresaCliente.id && data.nombre === gerencia.nombre) || (data.codigo == gerencia.codigo && data.empresaCliente.id == gerencia.empresaCliente.id) || (data.empresaCliente.id == gerencia.empresaCliente.id && data.nombre === gerencia.nombre)) {
                    extramsg += 'Código y/o nombre'
                    return true
                }
                return false
            })) {
                var obj = Object.assign({}, gerencia)
                obj.nuevo = true
                $scope.listaGerenciasClienteEmpresa.push(obj)
            } else {
                $scope.mostrarMensaje(extramsg + ' ya fué asigando. No se puede duplicar.')
            }
        }

        $scope.guardarComensalesClienteEmpresa = function () {
            var datos = []
            if ($scope.listaComensalesclienteEmpresa.length > 0) {
                $scope.listaComensalesclienteEmpresa.forEach(function (comensal) {
                    if (comensal.nuevo || comensal.eliminado || comensal.editado) {
                        datos.push(comensal)
                    }
                })
            }
            if (datos.length > 0) {
                var prom = GuardarComensales($scope.usuario.id_empresa, datos, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    if (!res.hasErr) {
                        $scope.obtenerComensales()
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.agregarComensalClienteEmpresa = function (comensal) {
            var extramsg = ''
            if (!$scope.listaComensalesclienteEmpresa.some(function (data) {
                if (data.codigo) {
                    if (data.codigo === comensal.codigo) {
                        extramsg += 'Código: ' + data.codigo + ' ya fué asigando. No se puede duplicar.'
                        return true
                    }
                } else {
                    extramsg += 'Código: Vacio'
                    return true
                }
                if (data.empresaCliente) {
                    if (data.empresaCliente.id !== null && data.empresaCliente.id !== undefined) {
                    }
                } else {
                    extramsg += 'Empresa: Vacio'
                    return true
                }
                if (data.nombre) {
                    if (data.nombre === comensal.nombre && data.tarjeta === comensal.tarjeta) {
                        extramsg += 'comensal y tarjeta' + data.nombre + ' ya fué asigando. No se puede duplicar.'
                        return true
                    }
                } else {
                    extramsg += 'comensal: Vacio'
                    return true
                }
                return false
            })) {
                var obj = Object.assign({}, comensal)
                obj.nuevo = true
                $scope.listaComensalesclienteEmpresa.push(obj)
            } else {
                $scope.mostrarMensaje(extramsg)
            }
        }

        $scope.guardarComidasEmpresasCliente = function () {
            var datos = []
            if ($scope.listaComidasclienteEmpresa.length > 0) {
                $scope.listaComidasclienteEmpresa.forEach(function (comida) {
                    if (comida.nuevo || comida.eliminado || comida.editado) {
                        comida.inicio = new Date(0, 0, 0, comida.inicio.getHours(), comida.inicio.getMinutes(), 0).toLocaleTimeString('es-ES')
                        comida.final = new Date(0, 0, 0, comida.final.getHours(), comida.final.getMinutes(), 0).toLocaleTimeString('es-ES')
                        datos.push(comida)
                    }
                })
            }
            if (datos.length > 0) {
                var prom = GuardarComidas($scope.usuario.id_empresa, datos, $scope.usuario.id, 0)
                prom.then(function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    if (!res.hasErr) {
                        $scope.obtenerComidas()
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.agregarComidaClienteEmpresa = function (comida) {
            var extramsg = ''
            if (!$scope.listaComidasclienteEmpresa.some(function (data) {
                if ((data.codigo == comida.codigo && data.empresaCliente.id == comida.empresaCliente.id && data.nombre === comida.nombre) || (data.codigo == comida.codigo && data.empresaCliente.id == comida.empresaCliente.id) || (data.empresaCliente.id == comida.empresaCliente.id && data.nombre === comida.nombre)) {
                    extramsg += 'Código y/o nombre'
                    return true
                }
                return false
            })) {
                var obj = Object.assign({}, comida)
                obj.nuevo = true
                $scope.listaComidasclienteEmpresa.push(obj)
            } else {
                $scope.mostrarMensaje(extramsg + ' ya fué asigando. No se puede duplicar.')
            }
        }

        $scope.guardarPreciosComidasEmpresasCliente = function () {
            var datos = []
            if ($scope.listaPrecioComidasclienteEmpresa.length > 0) {
                $scope.listaPrecioComidasclienteEmpresa.forEach(function (precio) {
                    if (precio.nuevo || precio.eliminado || precio.editado) {
                        datos.push(precio)
                    }
                })
            }
            if (datos.length > 0) {
                var prom = GuardarPrecioComidas($scope.usuario.id_empresa, datos, $scope.usuario.id, 0)
                prom.then(function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    if (!res.hasErr) {
                        $scope.obtenerPrecioComidas()
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            } else {
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.agregarPrecioComida = function (clienteEmpresaPreciosComidas) {
            var extramsg = ''
            if (!$scope.listaPrecioComidasclienteEmpresa.some(function (data) {
                if ((data.codigo == clienteEmpresaPreciosComidas.codigo && data.empresaCliente.id == clienteEmpresaPreciosComidas.empresaCliente.id && data.comida.id === clienteEmpresaPreciosComidas.comida.id) || (data.codigo == clienteEmpresaPreciosComidas.codigo && data.empresaCliente.id == clienteEmpresaPreciosComidas.empresaCliente.id)) {
                    extramsg += 'Código y/o nombre'
                    return true
                }
                return false
            })) {
                var obj = Object.assign({}, clienteEmpresaPreciosComidas)
                obj.nuevo = true
                obj.id_comida = obj.comida.id
                $scope.listaPrecioComidasclienteEmpresa.push(obj)
            } else {
                $scope.mostrarMensaje(extramsg + ' ya fué asigando. No se puede duplicar.')
            }
        }

        $scope.agregarMarcacion = function (comensal, marca) {
            var prom = EditarAlertasMarcacion($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id, comensal, marca)
            prom.then(function (res) {
                $scope.mostrarMensaje(res.mensaje)
                if (!res.hasErr) {
                    $scope.obtenerAlertas()
                }
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.eliminarAsignacionaliasClienteEmpresa = function (alias) {
            $scope.listaAliasclientesEmpresa[$scope.listaAliasclientesEmpresa.indexOf(alias)].eliminado = true
        }

        $scope.eliminarAsignaciongerenciaClienteEmpresa = function (gerencia) {
            $scope.listaGerenciasClienteEmpresa[$scope.listaGerenciasClienteEmpresa.indexOf(gerencia)].eliminado = true
        }

        $scope.eliminarAsignacioncomensalClienteEmpresa = function (comensal) {
            $scope.listaComensalesclienteEmpresa[$scope.listaComensalesclienteEmpresa.indexOf(comensal)].eliminado = true
        }

        $scope.eliminarAsignacioncomidaClienteEmpresa = function (comida) {
            $scope.listaComidasclienteEmpresa[$scope.listaComidasclienteEmpresa.indexOf(comida)].eliminado = true
        }

        $scope.eliminarAsignacionprecioComidaClienteEmpresa = function (precioComida) {
            $scope.listaPrecioComidasclienteEmpresa[$scope.listaPrecioComidasclienteEmpresa.indexOf(precioComida)].eliminado = true
        }

        $scope.generarHistorialExcel = function (documento) {
            var prom = ObtenerDocumento($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id, documento)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                    return
                }
                var cabecera = ['TARJETA', 'EMPLEADO', 'FECHA / HORA', 'lectora', 'NAME']
                var data = [cabecera]
                for (let index = 0; index < res.documento.length; index++) {
                    var columns = []
                    columns.push(res.documento[index].tarjeta)
                    columns.push(res.documento[index].comensal.nombre)
                    columns.push(res.documento[index].fecha.split('T')[0].split('-').reverse().join('/') + ' ' + res.documento[index].fecha.split('T')[1].split('.')[0] )
                    columns.push(res.documento[index].identificador_equipo)
                    columns.push(res.documento[index].empresaCliente.alias[0].nombre)
                    data.push(columns)
                }
                var ws_name = "SheetJS";
                var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
                var wscols = [
                    { wch: 20 },
                    { wch: 19 },
                    { wch: 20 },
                    { wch: 16 },
                    { wch: 25 },
                    { wch: 15 },
                    { wch: 25 },
                    { wch: 25 },
                    { wch: 25 },
                    { wch: 8 },
                    { wch: 12 }
                ];
                ws['!cols'] = wscols;
                ws['!rows'] = [{ hpx: 28, level: 3 }];
                // ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 4 }, e: { r: 1, c: 4 } }, { s: { r: 3, c: 4 }, e: { r: 3, c: 4 } }, { s: { r: (3 + data.length), c: 0 }, e: { r: (3 + data.length), c: 1 } }]
                /* add worksheet to workbook */
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), res.documento[0].documento);
            })
        }

        $scope.generarReportePDF = function () {
            if (!$scope.filtroComensales.generar) {
                $scope.mostrarMensaje('Seleccione un tipo de reporte.')
                return
            }
            if ($scope.filtroComensales.generar === 1) {
                $scope.reportePDFComedor()
            } else if ($scope.filtroComensales.generar === 2) {
                $scope.reportePDFEmpresa()
            } else if ($scope.filtroComensales.generar === 3) {
                $scope.reportePDFComensal()
            } else {
                $scope.mostrarMensaje('Existe un problema con la identificación del reporte.')
            }
        }

        $scope.generarReporteEXCEL = function () {
            if (!$scope.filtroComensales.generar) {
                $scope.mostrarMensaje('Seleccione un tipo de reporte.')
                return
            }
            if ($scope.filtroComensales.generar === 1) {
                $scope.reportePDFComedor(true)
            } else if ($scope.filtroComensales.generar === 2) {
                $scope.reportePDFEmpresa(true)
            } else if ($scope.filtroComensales.generar === 3) {
                $scope.reportePDFComensal(true)
            } else {
                $scope.mostrarMensaje('Existe un problema con la identificación del reporte.')
            }
        }

        $scope.reportePDFComedor = function (excel) {
            var reporte = [];
            var tipoCambioDollar = 0
            var promesa = ObtenerCambioMoneda(new Date())
            promesa.then(function (res) {
                tipoCambioDollar = res.monedaCambio.dolar
                $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true)
                $scope.paginator.filter = $scope.filtroComensales
                var promGer = ObtenerGerencias($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id)
                promGer.then(function (res) {
                    $scope.listaGerenciasClienteEmpresa = res.lista
                    var promComidas = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id)
                    promComidas.then(function (comidas) {
                        var comidasEmpresa = comidas.lista
                        var cabecera = []
                        comidasEmpresa.forEach(function (comida) {
                            cabecera.push(comida.nombre.toUpperCase())
                        })
                        cabecera.unshift('fecha'.toUpperCase())
                        cabecera.push('observación'.toUpperCase())
                        var promHistorial = ObtenerReporteComedor($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id, $scope.paginator)
                        promHistorial.then(function (res) {
                            $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true, true)
                            if (res.hasErr) {
                                $scope.mostrarMensaje(res.mensaje)
                                return
                            }
                            var reportesGerencias = []
                            for (let index = 0; index < res.reporte.length; index++) {
                                var reporteGerencias = []
                                for (let _index = 0; _index < res.reporte[index].historial.length; _index++) {
                                    var conteoIndex = -1
                                    if (reporteGerencias.some(function (dato) {
                                        conteoIndex += 1
                                        if (dato.gerencia.nombre === res.reporte[index].nombre && dato.fecha.split('T')[0] === res.reporte[index].historial[_index].fecha.split('T')[0]) {
                                            return true
                                        }
                                        return false
                                    })) {
                                        if (res.reporte[index].historial[_index].comida) {
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'desayuno') {
                                                reporteGerencias[conteoIndex].desayuno.cantidad += 1
                                                reporteGerencias[conteoIndex].desayuno.total += res.reporte[index].historial[_index].precio
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'almuerzo') {
                                                reporteGerencias[conteoIndex].almuerzo.cantidad += 1
                                                reporteGerencias[conteoIndex].almuerzo.total += res.reporte[index].historial[_index].precio
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'cena') {
                                                reporteGerencias[conteoIndex].cena.cantidad += 1
                                                reporteGerencias[conteoIndex].cena.total += res.reporte[index].historial[_index].precio
                                            }
                                        } else {
                                            reporteGerencias[conteoIndex].fuera_horario += 1
                                        }
                                        
                                    } else {
                                        var chingadera = { cantidad: 0, total: 0 }
                                        var combo = { empresaCliente: res.reporte[index].historial[_index].empresaCliente, gerencia: { id: res.reporte[index].id, nombre: res.reporte[index].nombre, codigo: res.reporte[index].codigo, id_cliente: res.reporte[index].id_cliente, id_empresa: res.reporte[index].id_empresa }, fecha: res.reporte[index].historial[_index].fecha.split('T')[0], desayuno: Object.assign({}, chingadera), almuerzo: Object.assign({}, chingadera), cena: Object.assign({}, chingadera), fuera_horario: 0 }
                                        if (res.reporte[index].historial[_index].comida) {
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'desayuno') {
                                                combo.desayuno.cantidad += 1
                                                combo.desayuno.total += res.reporte[index].historial[_index].precio
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'almuerzo') {
                                                combo.almuerzo.cantidad += 1
                                                combo.almuerzo.total += res.reporte[index].historial[_index].precio
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'cena') {
                                                combo.cena.cantidad += 1
                                                combo.cena.total += res.reporte[index].historial[_index].precio
                                            }
                                        } else {
                                            combo.observacion = 'Fuera de horario, no se puede contabilizar.'
                                        }
                                        reporteGerencias.push(combo)
                                    }
                                    if (_index === (res.reporte[index].historial.length - 1)) {
                                        reportesGerencias.push(reporteGerencias)
                                    }
                                }

                            }
                            if (excel) {
                                for (let _index = 0; _index < reportesGerencias.length - 1; _index++) {
                                    const repo = reportesGerencias[_index]
                                    // if (excel) {
                                    // (function (i) {
                                    $scope.imprimirReporteComedorExcel(repo, repo[0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar)
                                    // }, _index)//reportesGerencias[_index], reportesGerencias[_index][0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar)
                                    // $scope.imprimirReporteComedorExcel(reportesGerencias[_index], reportesGerencias[_index][0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar)                                        
                                    // },)
                                    // } else {
                                    //     $scope.imprimirReporteComedor(reportesGerencias[_index], reportesGerencias[_index][0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar)
                                    // }
                                }
                            } else {
                                for (let _index = 0; _index < reportesGerencias.length - 1; _index++) {
                                    // const repo = reportesGerencias[_index]
                                    // if (excel) {
                                    // (function (i) {
                                    // $scope.imprimirReporteComedorExcel(repo, repo[0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar) 
                                    // }, _index)//reportesGerencias[_index], reportesGerencias[_index][0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar)
                                    // $scope.imprimirReporteComedorExcel(reportesGerencias[_index], reportesGerencias[_index][0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar)                                        
                                    // },)
                                    // } else {
                                    $scope.imprimirReporteComedor(reportesGerencias[_index], reportesGerencias[_index][0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar)

                                }
                            }
                            blockUI.stop();
                        })
                    })
                })
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.reportePDFEmpresa = function (excel) {
            var reporte = [];
            var tipoCambioDollar = 0
            var promesa = ObtenerCambioMoneda(new Date())
            promesa.then(function (res) {
                tipoCambioDollar = res.monedaCambio.dolar
                $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true)
                $scope.paginator.filter = $scope.filtroComensales
                var promGer = ObtenerGerencias($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id)
                promGer.then(function (res) {
                    $scope.listaGerenciasClienteEmpresa = res.lista
                    var promComidas = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id)
                    promComidas.then(function (comidas) {
                        var comidasEmpresa = comidas.lista
                        var cabecera = []
                        comidasEmpresa.forEach(function (comida) {
                            cabecera.push(comida.nombre.toUpperCase())
                        })
                        cabecera.unshift('Empleado'.toUpperCase())
                        cabecera.push('Total general'.toUpperCase())
                        var promHistorial = ObtenerReporteEmpresa($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id, $scope.paginator)
                        promHistorial.then(function (res) {
                            $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true, true)
                            if (res.hasErr) {
                                $scope.mostrarMensaje(res.mensaje)
                                return
                            }
                            var reportesEmpresas = []
                            res.reporte.forEach(function (comensal) {
                                var reporteEmpresas = []
                                comensal.desayuno = { cantidad: 0, total: 0 }
                                comensal.almuerzo = { cantidad: 0, total: 0 }
                                comensal.cena = { cantidad: 0, total: 0 }
                                comensal.fueraHorario = 0
                                comensal.historial.forEach(function (historial) {
                                    if (historial.comida) {
                                        if (historial.comida.nombre.toLowerCase() === 'desayuno') {
                                            comensal.desayuno.cantidad += 1
                                        }
                                        if (historial.comida.nombre.toLowerCase() === 'almuerzo') {
                                            comensal.almuerzo.cantidad += 1
                                        }
                                        if (historial.comida.nombre.toLowerCase() === 'cena') {
                                            comensal.cena.cantidad += 1
                                        }
                                    } else {
                                        comensal.fueraHorario += 1
                                    }
                                })

                            })
                            if (excel) {
                                $scope.imprimirReporteEmpresaEXCEL(res.reporte, null, cabecera, comidasEmpresa, tipoCambioDollar)
                            } else {
                                $scope.imprimirReporteEmpresa(res.reporte, null, cabecera, comidasEmpresa, tipoCambioDollar)
                            }
                            blockUI.stop();
                        })
                    })
                })
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.reportePDFComensal = function (excel) {
            var reporte = [];
            var tipoCambioDollar = 0
            var promesa = ObtenerCambioMoneda(new Date())
            promesa.then(function (res) {
                tipoCambioDollar = res.monedaCambio.dolar
                $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true)
                $scope.paginator.filter = $scope.filtroComensales
                var promGer = ObtenerGerencias($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id)
                promGer.then(function (res) {
                    $scope.listaGerenciasClienteEmpresa = res.lista
                    var promComidas = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id)
                    promComidas.then(function (comidas) {
                        var comidasEmpresa = comidas.lista
                        var cabecera = []
                        comidasEmpresa.forEach(function (comida) {
                            cabecera.push(comida.nombre.toUpperCase())
                        })
                        cabecera.unshift('FECHA'.toUpperCase())
                        cabecera.push('Total general'.toUpperCase())
                        var promHistorial = ObtenerReporteComensal($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id, $scope.paginator)
                        promHistorial.then(function (res) {
                            $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true, true)
                            if (res.hasErr) {
                                $scope.mostrarMensaje(res.mensaje)
                                return
                            }
                            var reportesGerencias = []
                            for (let index = 0; index < res.reporte.length; index++) {
                                var reporteFechasPorComensal = []
                                for (let _index = 0; _index < res.reporte[index].historial.length; _index++) {
                                    var conteoIndex = -1
                                    if (reporteFechasPorComensal.some(function (dato) {
                                        conteoIndex += 1
                                        if (dato.fecha.split('T')[0] === res.reporte[index].historial[_index].fecha.split('T')[0]) {
                                            return true
                                        }
                                        return false
                                    })) {
                                        if (res.reporte[index].historial[_index].comida) {
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'desayuno') {
                                                reporteFechasPorComensal[conteoIndex].desayuno += 1
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'almuerzo') {
                                                reporteFechasPorComensal[conteoIndex].almuerzo += 1
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'cena') {
                                                reporteFechasPorComensal[conteoIndex].cena += 1
                                            }
                                        } else {
                                            reporteFechasPorComensal[conteoIndex].fueraHorario += 1
                                        }
                                    } else {
                                        var historialFecha = { fecha: res.reporte[index].historial[_index].fecha, desayuno: 0, almuerzo: 0, cena: 0, fueraHorario: 0, empresaCliente: res.reporte[index].historial[_index].empresaCliente }
                                        if (res.reporte[index].historial[_index].comida) {
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'desayuno') {
                                                historialFecha.desayuno += 1
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'almuerzo') {
                                                historialFecha.almuerzo += 1
                                            }
                                            if (res.reporte[index].historial[_index].comida.nombre.toLowerCase() === 'cena') {
                                                historialFecha.cena += 1
                                            }
                                        } else {
                                            historialFecha.observacion = 'Fuera de horario, no se puede contabilizar.'
                                        }
                                        reporteFechasPorComensal.push(historialFecha)
                                    }
                                }
                                res.reporte[index].reporte = reporteFechasPorComensal
                            }
                            for (let _index = 0; _index < res.reporte.length; _index++) {
                                if (excel) {
                                    $scope.imprimirReporteComensalEXCEL(res.reporte[_index], null, cabecera, comidasEmpresa, tipoCambioDollar)
                                } else {
                                    $scope.imprimirReporteComensal(res.reporte[_index], null, cabecera, comidasEmpresa, tipoCambioDollar)
                                }

                            }
                            blockUI.stop();
                        })
                    })
                })
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.imprimirReporteComedorExcel = function (reporte, gerencia, cabecera, comidasEmpresa, dollar) {
            var reporte = reporte
            var gerencia = gerencia
            var cabecera = cabecera
            var comidasEmpresa = comidasEmpresa
            var dollar = dollar
            var data = [[""], [""], [("REPORTES DE COMEDOR " + gerencia.nombre.toUpperCase() + ' ' + reporte[0].empresaCliente.razon_social.toUpperCase())], [""], cabecera]
            var total_desayunos = 0;
            var total_almuerzos = 0;
            var total_cenas = 0;
            for (let i = 0; i < reporte.length; i++) {
                var columns = []
                columns.push(reporte[i].fecha)
                if (reporte[i].desayuno.cantidad > 0) {
                    columns.push(reporte[i].desayuno.cantidad)
                    total_desayunos += reporte[i].desayuno.cantidad
                } else {
                    columns.push("")
                }
                if (reporte[i].almuerzo.cantidad > 0) {
                    columns.push(reporte[i].almuerzo.cantidad)
                    total_almuerzos += reporte[i].almuerzo.cantidad
                } else {
                    columns.push("")
                }
                if (reporte[i].cena.cantidad > 0) {
                    columns.push(reporte[i].cena.cantidad)
                    total_cenas += reporte[i].cena.cantidad
                } else {
                    columns.push("")
                }
                if (reporte[i].observacion) {
                    columns.push(reporte[i].observacion)
                }
                data.push(columns)
            }
            data.push([""])
            var columns = ["TOTAL ==>", total_desayunos, total_almuerzos, total_cenas]
            data.push(columns)
            columns = ["TOTAL $us. ==>", (total_desayunos * dollar), (total_almuerzos * dollar), (total_cenas * dollar)]
            data.push(columns)
            columns = ["TOTAL General $us. ==>", "", ((total_desayunos * dollar) + (total_almuerzos * dollar) + (total_cenas * dollar))]
            data.push(columns)
            var ws_name = "SheetJS";
            var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
            var wscols = [
                { wch: 20 },
                { wch: 19 },
                { wch: 20 },
                { wch: 16 },
                { wch: 25 },
                { wch: 15 },
                { wch: 25 },
                { wch: 25 },
                { wch: 25 },
                { wch: 8 },
                { wch: 12 }
            ];
            ws['!cols'] = wscols;
            ws['!rows'] = [{ hpx: 28, level: 3 }];
            ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 4 }, e: { r: 1, c: 4 } }, { s: { r: 3, c: 4 }, e: { r: 3, c: 4 } }, { s: { r: (3 + data.length), c: 0 }, e: { r: (3 + data.length), c: 1 } }]
            /* add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE GERENCIA " + gerencia.nombre.toUpperCase() + ".xlsx");
            blockUI.stop();
        }

        $scope.imprimirReporteEmpresaEXCEL = function (reporte, gerencia, cabecera, comidasEmpresa, dollar) {
            var reporte = reporte
            var gerencia = gerencia
            var cabecera = cabecera
            var comidasEmpresa = comidasEmpresa
            var dollar = dollar
            var data = [["Reporte EMPRESA VS PERIODO"], ["EMPRESA", reporte[0].historial[0].empresaCliente.razon_social], ["GERENCIA", ""], ["PERIODO", reporte.fecha], cabecera]
            var total_general_desayuno = 0
            var total_general_almuerzo = 0
            var total_general_cena = 0
            var total_totales = 0
            var total_desayunos = 0;
            var total_almuerzos = 0;
            var total_cenas = 0;
            for (let i = 0; i < reporte.length; i++) {
                var total_comensal = 0
                total_general_desayuno += reporte[i].desayuno.cantidad
                total_general_almuerzo += reporte[i].almuerzo.cantidad
                total_general_cena += reporte[i].cena.cantidad
                total_comensal = reporte[i].desayuno.cantidad + reporte[i].almuerzo.cantidad + reporte[i].cena.cantidad
                total_desayunos += reporte[i].desayuno.cantidad
                total_almuerzos += reporte[i].almuerzo.cantidad
                total_cenas += reporte[i].cena.cantidad
                var columns = []
                columns.push(reporte[i].nombre)
                columns.push(reporte[i].desayuno.cantidad)
                columns.push(reporte[i].almuerzo.cantidad)
                columns.push(reporte[i].cena.cantidad)
                total_totales += total_comensal
                columns.push(total_comensal)
                data.push(columns)
            }
            var columns = ["TOTAL General", total_general_desayuno, total_general_almuerzo, total_general_cena, (total_general_desayuno + total_general_almuerzo + total_general_cena)]
            data.push(columns)
            var ws_name = "SheetJS";
            var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
            var wscols = [
                { wch: 20 },
                { wch: 19 },
                { wch: 20 },
                { wch: 16 },
                { wch: 25 },
                { wch: 15 },
                { wch: 25 },
                { wch: 25 },
                { wch: 25 },
                { wch: 8 },
                { wch: 12 }
            ];
            ws['!cols'] = wscols;
            ws['!rows'] = [{ hpx: 28, level: 3 }];
            ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 4 }, e: { r: 1, c: 4 } }, { s: { r: 3, c: 4 }, e: { r: 3, c: 4 } }, { s: { r: (3 + data.length), c: 0 }, e: { r: (3 + data.length), c: 1 } }]
            /* add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE EMPRESA " + reporte[0].historial[0].empresaCliente.razon_social.toUpperCase() + ".xlsx");
            blockUI.stop();
        }

        $scope.imprimirReporteComensalEXCEL = function (reporte, gerencia, cabecera, comidasEmpresa, dollar) {
            let reporte = reporte
            let gerencia = gerencia
            let cabecera = cabecera
            let comidasEmpresa = comidasEmpresa
            let dollar = dollar
            let data = [["REPORTE POR PERSONA"], ["EMPLEADO", reporte.nombre], ["EMPRESA", reporte.reporte[0].empresaCliente.razon_social], ["GERENCIA", ""], ["PERIODO", reporte.fecha], cabecera]
            let total_general_desayuno = 0
            let total_general_almuerzo = 0
            let total_general_cena = 0
            let total_desayunos = 0;
            let total_almuerzos = 0;
            let total_cenas = 0;
            for (let i = 0; i < reporte.reporte.length; i++) {
                let total_comensal = 0
                total_general_desayuno += reporte.reporte[i].desayuno
                total_general_almuerzo += reporte.reporte[i].almuerzo
                total_general_cena += reporte.reporte[i].cena
                total_comensal = reporte.reporte[i].desayuno + reporte.reporte[i].almuerzo + reporte.reporte[i].cena
                total_desayunos += reporte.reporte[i].desayuno
                total_almuerzos += reporte.reporte[i].almuerzo
                total_cenas += reporte.reporte[i].cena
                let columns = []

                columns.push(reporte.reporte[i].fecha.split('T')[0])
                columns.push(reporte.reporte[i].desayuno)
                columns.push(reporte.reporte[i].almuerzo)
                columns.push(reporte.reporte[i].cena)
                // columns.push(reporte.reporte[i].observacion)
                columns.push(total_comensal)
                // if (reporte[i].desayuno.cantidad > 0) {
                //     // doc.text(reporte[i].fecha, cubeX + 9, y + 7);
                //     // doc.text(reporte[i].desayuno.cantidad, cubeX + 95 + 9, y + 7)
                //     columns.push(reporte[i].desayuno.cantidad)
                //     total_desayunos += reporte[i].desayuno.cantidad
                // }else{
                //     columns.push("")
                // }
                // if (reporte[i].almuerzo.cantidad > 0) {
                //     columns.push(reporte[i].almuerzo.cantidad)
                //     total_almuerzos += reporte[i].almuerzo.cantidad
                // }else{
                //     columns.push("")
                // }
                // if (reporte[i].cena.cantidad > 0) {
                //     columns.push(reporte[i].cena.cantidad)
                //     total_cenas += reporte[i].cena.cantidad
                // }else{
                //     columns.push("")
                // }
                // if (reporte[i].observacion) {
                //     columns.push(reporte[i].observacion)
                // }
                data.push(columns)
            }
            // data.push([""])
            let columns = ["TOTAL General", total_general_desayuno, total_general_almuerzo, total_general_cena, (total_general_desayuno + total_general_almuerzo + total_general_cena)]
            // data.push(columns)
            // columns = [total_general_desayuno]
            // data.push(columns)
            // columns = [total_general_almuerzo]
            // data.push(columns)
            // columns = [total_general_cena]
            data.push(columns)
            let ws_name = "SheetJS";
            let wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
            let wscols = [
                { wch: 20 },
                { wch: 19 },
                { wch: 20 },
                { wch: 16 },
                { wch: 25 },
                { wch: 15 },
                { wch: 25 },
                { wch: 25 },
                { wch: 25 },
                { wch: 8 },
                { wch: 12 }
            ];
            ws['!cols'] = wscols;
            ws['!rows'] = [{ hpx: 28, level: 3 }];
            ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, { s: { r: 1, c: 4 }, e: { r: 1, c: 4 } }, { s: { r: 3, c: 4 }, e: { r: 3, c: 4 } }, { s: { r: (3 + data.length), c: 0 }, e: { r: (3 + data.length), c: 1 } }]
            /* add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE COMENSAL " + reporte.nombre.toUpperCase() + ".xlsx");
            blockUI.stop();
            // var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
            // var stream = doc.pipe(blobStream());
            // var y = 150
            // var itemsPorPagina = 10
            // var items = 0
            // var xSeparacion = 0
            // var pagina = 1
            // var cubeX = 70
            // var totalPaginas = Math.ceil(1 / itemsPorPagina);
            // $scope.cabeceraReporteComensal(doc, pagina, totalPaginas, reporte, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
            // var total_general_desayuno = 0
            // var total_general_almuerzo = 0
            // var total_general_cena = 0
            // var total_desayunos = 0
            // var total_almuerzos = 0
            // var total_cenas = 0
            // for (let i = 0; i < reporte.reporte.length; i++) {
            //     var total_comensal = 0
            //     doc.font('Helvetica', 8);

            //     // cabecera.forEach(function (dato) {
            //     //     doc.rect(cubeX + xSeparacion, y, 80, 20).stroke()
            //     //     xSeparacion += 80
            //     // })
            //     total_general_desayuno += reporte.reporte[i].desayuno
            //     total_general_almuerzo += reporte.reporte[i].almuerzo
            //     total_general_cena += reporte.reporte[i].cena
            //     total_comensal = reporte.reporte[i].desayuno + reporte.reporte[i].almuerzo + reporte.reporte[i].cena
            //     total_desayunos += reporte.reporte[i].desayuno
            //     total_almuerzos += reporte.reporte[i].almuerzo
            //     total_cenas += reporte.reporte[i].cena
            //     xSeparacion = 0
            //     var fecha
            //     doc.font('Helvetica', 8).fill('black')
            //     doc.text($scope.formatoFechaPDF(reporte.reporte[i].fecha), cubeX + 8, y + 7);
            //     doc.text(reporte.reporte[i].desayuno, cubeX + 80 + 95 + 9, y + 7)
            //     doc.text(reporte.reporte[i].almuerzo, cubeX + 80 + 175 + 9, y + 7)
            //     doc.text(reporte.reporte[i].cena, cubeX + 80 + 255 + 9, y + 7)
            //     doc.text(total_comensal, cubeX + 80 + 335 + 9, y + 7)

            //     doc.rect(cubeX, y + 3, 150, 20).stroke()
            //     doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
            //     doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
            //     doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
            //     doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
            //     y = y + 20;
            //     items++;
            //     if (items > itemsPorPagina || (y > 700)) {
            //         doc.addPage({ size: [612, 792], margin: 10 });
            //         y = 115 + 80;
            //         items = 0;
            //         pagina = pagina + 1;
            //         $scope.cabeceraReporteComensal(doc, pagina, totalPaginas, reporte, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
            //     }
            // }
            // doc.text("Total general", cubeX + 6, y + 7);
            // doc.text(total_general_desayuno, cubeX + 80 + 95 + 9, y + 7)
            // doc.text(total_general_almuerzo, cubeX + 80 + 175 + 9, y + 7)
            // doc.text(total_general_cena, cubeX + 80 + 255 + 9, y + 7)
            // doc.text((total_general_desayuno + total_general_almuerzo + total_general_cena), cubeX + 80 + 335 + 9, y + 7)
            // doc.rect(cubeX, y + 3, 150, 20).stroke()
            // doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
            // doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
            // doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
            // doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
            // y = y + 20;

            // doc.end();
            // stream.on('finish', function () {
            //     var fileURL = stream.toBlobURL('application/pdf');
            //     window.open(fileURL, '_blank', 'location=no');
            // });
        }

        $scope.imprimirReporteComedor = function (reporte, gerencia, cabecera, comidasEmpresa, dollar) {
            var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
            var stream = doc.pipe(blobStream());
            var y = 170
            var itemsPorPagina = 10
            var items = 0
            var xSeparacion = 0
            var pagina = 1
            var cubeX = 100
            var totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.cabeceraReporteComedor(doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
            var total_desayunos = 0
            var total_almuerzos = 0
            var total_cenas = 0
            for (let i = 0; i < reporte.length; i++) {
                cabecera.forEach(function (dato) {
                    doc.rect(cubeX + xSeparacion, y, 80, 20).stroke()
                    xSeparacion += 80
                })
                xSeparacion = 0
                doc.font('Helvetica', 8);
                if (reporte[i].desayuno.cantidad > 0) {
                    doc.text(reporte[i].fecha, cubeX + 9, y + 7);
                    doc.text(reporte[i].desayuno.cantidad, cubeX + 95 + 9, y + 7)
                    total_desayunos += reporte[i].desayuno.cantidad
                }
                if (reporte[i].almuerzo.cantidad > 0) {
                    doc.text(reporte[i].fecha, cubeX + 9, y + 7);
                    doc.text(reporte[i].almuerzo.cantidad, cubeX + 175 + 9, y + 7)
                    total_almuerzos += reporte[i].almuerzo.cantidad
                }
                if (reporte[i].cena.cantidad > 0) {
                    doc.text(reporte[i].fecha, cubeX + 9, y + 7);
                    doc.text(reporte[i].cena.cantidad, cubeX + 255 + 9, y + 7)
                    total_cenas += reporte[i].cena.cantidad
                }
                if (reporte[i].observacion) {
                    doc.text(reporte[i].fecha, cubeX + 9, y + 7);
                    doc.text(reporte[i].observacion, cubeX + 312 + 9, y + 3, { width: 80 })
                }
                y = y + 20;
                items++;
                if (items > itemsPorPagina || (y > 700)) {
                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 115 + 80;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.cabeceraReporteComedor(doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, reporte[i].gerencia ? reporte[i].gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
                }
            }
            doc.rect(cubeX, y, 80, 20).stroke()
            doc.rect(cubeX + 80, y, 80, 20).stroke()
            doc.rect(cubeX + 160, y, 80, 20).stroke()
            doc.rect(cubeX + 240, y, 80, 20).stroke()
            doc.rect(cubeX + 320, y, 80, 20).stroke()
            y = y + 20;
            var precio_total_desayunos = total_desayunos * (comidasEmpresa[0].nombre.toLowerCase() === 'desayuno' ? comidasEmpresa[0].precio[0].precio : comidasEmpresa[1].nombre.toLowerCase() === 'desayuno' ? comidasEmpresa[1].precio[0].precio : comidasEmpresa[2].nombre.toLowerCase() === 'desayuno' ? comidasEmpresa[2].precio[0].precio : 'ERROR')
            var precio_total_almuerzos = total_almuerzos * (comidasEmpresa[0].nombre.toLowerCase() === 'almuerzo' ? comidasEmpresa[0].precio[0].precio : comidasEmpresa[1].nombre.toLowerCase() === 'almuerzo' ? comidasEmpresa[1].precio[0].precio : comidasEmpresa[2].nombre.toLowerCase() === 'almuerzo' ? comidasEmpresa[2].precio[0].precio : 'ERROR')
            var precio_total_cenas = total_cenas * (comidasEmpresa[0].nombre.toLowerCase() === 'cena' ? comidasEmpresa[0].precio[0].precio : comidasEmpresa[1].nombre.toLowerCase() === 'cena' ? comidasEmpresa[1].precio[0].precio : comidasEmpresa[2].nombre.toLowerCase() === 'cena' ? comidasEmpresa[2].precio[0].precio : 'ERROR')
            doc.text('Total.-', cubeX + 15 + 9, y + 7)
            doc.text('Total $us.-', cubeX + 15 + 9, y + 7 + 20)
            doc.text('Total General $us.-', cubeX + 15 + 9, y + 7 + 40)
            doc.rect(cubeX + 80, y, 80, 20).stroke()
            doc.text(total_desayunos, cubeX + 95 + 9, y + 7)
            doc.rect(cubeX + 160, y, 80, 20).stroke()
            doc.text(total_almuerzos, cubeX + 175 + 9, y + 7)
            doc.rect(cubeX + 240, y, 80, 20).stroke()
            doc.text(total_cenas, cubeX + 255 + 9, y + 7)
            doc.rect(cubeX + 80, y + 20, 80, 20).stroke()
            doc.rect(cubeX + 160, y + 20, 80, 20).stroke()
            doc.rect(cubeX + 240, y + 20, 80, 20).stroke()
            doc.rect(cubeX + 160, y + 40, 80, 20).stroke()
            doc.text(precio_total_desayunos, cubeX + 95 + 9, y + 7 + 20)
            doc.text(precio_total_almuerzos, cubeX + 175 + 9, y + 7 + 20)
            doc.text(precio_total_cenas, cubeX + 255 + 9, y + 7 + 20)
            doc.text((precio_total_desayunos + precio_total_almuerzos + precio_total_cenas), cubeX + 175 + 9, y + 7 + 40)
            doc.rect(cubeX, y + 70, 80, 20).fill("yellow")
            doc.rect(cubeX, y + 90, 80, 20).fill("yellow")
            doc.rect(cubeX, y + 110, 80, 20).fill("yellow")
            doc.rect(cubeX + 80, y + 70, 80, 20).fill("yellow")
            doc.rect(cubeX + 80, y + 90, 80, 20).fill("yellow")
            doc.rect(cubeX + 80, y + 110, 80, 20).fill("yellow")
            doc.rect(cubeX + 240, y + 90, 160, 20).fill("yellow")
            doc.rect(cubeX, y + 70, 80, 20).stroke()
            doc.rect(cubeX, y + 90, 80, 20).stroke()
            doc.rect(cubeX, y + 110, 80, 20).stroke()
            doc.rect(cubeX + 80, y + 70, 80, 20).stroke()
            doc.rect(cubeX + 80, y + 90, 80, 20).stroke()
            doc.rect(cubeX + 80, y + 110, 80, 20).stroke()
                .fill("black")
            doc.text('Desayuno.-', cubeX + 15 + 9, y + 7 + 70)
            doc.text('almuerzo.-', cubeX + 15 + 9, y + 7 + 90)
            doc.text('Cena.-', cubeX + 15 + 9, y + 7 + 110)
            doc.rect(cubeX + 240, y + 90, 160, 20).stroke()
            doc.text(('T.C. ' + dollar + '       Bs ' + ((precio_total_desayunos + precio_total_almuerzos + precio_total_cenas) * dollar).toFixed(2)), cubeX + 15 + 9 + 240, y + 7 + 90)
            doc.text((comidasEmpresa[0].nombre.toLowerCase() === 'desayuno' ? comidasEmpresa[0].precio[0].precio : comidasEmpresa[1].nombre.toLowerCase() === 'desayuno' ? comidasEmpresa[1].precio[0].precio : comidasEmpresa[2].nombre.toLowerCase() === 'desayuno' ? comidasEmpresa[2].precio[0].precio : 'ERROR'), cubeX + 15 + 9 + 80, y + 7 + 70)
            doc.text((comidasEmpresa[0].nombre.toLowerCase() === 'almuerzo' ? comidasEmpresa[0].precio[0].precio : comidasEmpresa[1].nombre.toLowerCase() === 'almuerzo' ? comidasEmpresa[1].precio[0].precio : comidasEmpresa[2].nombre.toLowerCase() === 'almuerzo' ? comidasEmpresa[2].precio[0].precio : 'ERROR'), cubeX + 15 + 9 + 80, y + 7 + 90)
            doc.text((comidasEmpresa[0].nombre.toLowerCase() === 'cena' ? comidasEmpresa[0].precio[0].precio : comidasEmpresa[1].nombre.toLowerCase() === 'cena' ? comidasEmpresa[1].precio[0].precio : comidasEmpresa[2].nombre.toLowerCase() === 'cena' ? comidasEmpresa[2].precio[0].precio : 'ERROR'), cubeX + 15 + 9 + 80, y + 7 + 110)
            var literal = ConvertirALiteral((precio_total_desayunos + precio_total_almuerzos + precio_total_cenas).toFixed(2))
            literal = literal.split('BOLIVIANOS')[0]
            doc.text('Son: ' + literal + ' Dólares Americanos', cubeX + 15 + 9, y + 7 + 130)
            // doc.rect(cubeX + 130, y + 460, 110, 0).stroke()
            // doc.text('Encargado', cubeX + 146 + 10, y + 455)
            doc.end();

            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
        }

        $scope.imprimirReporteEmpresa = function (reporte, gerencia, cabecera, comidasEmpresa, dollar) {
            var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
            var stream = doc.pipe(blobStream());
            var y = 150
            var itemsPorPagina = 10
            var items = 0
            var xSeparacion = 0
            var pagina = 1
            var cubeX = 70
            var totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.cabeceraReporteEmpresa(doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
            var total_general_desayuno = 0
            var total_general_almuerzo = 0
            var total_general_cena = 0
            var total_desayunos = 0
            var total_almuerzos = 0
            var total_cenas = 0
            var total_fueraHorario = 0
            for (let i = 0; i < reporte.length; i++) {
                var total_comensal = 0
                doc.font('Helvetica', 8);
                total_general_desayuno += reporte[i].desayuno.cantidad
                total_general_almuerzo += reporte[i].almuerzo.cantidad
                total_general_cena += reporte[i].cena.cantidad
                total_comensal = reporte[i].desayuno.cantidad + reporte[i].almuerzo.cantidad + reporte[i].cena.cantidad
                total_desayunos += reporte[i].desayuno.cantidad
                total_almuerzos += reporte[i].almuerzo.cantidad
                total_cenas += reporte[i].cena.cantidad
                xSeparacion = 0
                doc.font('Helvetica', 8).fill('black')
                doc.text(reporte[i].nombre, cubeX + 3, y + 7);
                doc.text(reporte[i].desayuno.cantidad, cubeX + 80 + 95 + 9, y + 7)
                doc.text(reporte[i].almuerzo.cantidad, cubeX + 80 + 175 + 9, y + 7)
                doc.text(reporte[i].cena.cantidad, cubeX + 80 + 255 + 9, y + 7)
                doc.text(total_comensal, cubeX + 80 + 335 + 9, y + 7)
                total_fueraHorario += reporte[i].fueraHorario
                doc.rect(cubeX, y + 3, 150, 20).stroke()
                doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
                doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
                doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
                doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
                y = y + 20;
                items++;
                if (items > itemsPorPagina || (y > 700)) {
                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 115 + 80;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.cabeceraReporteEmpresa(doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
                }
            }
            doc.text("Total general", cubeX + 6, y + 7);
            doc.text(total_general_desayuno, cubeX + 80 + 95 + 9, y + 7)
            doc.text(total_general_almuerzo, cubeX + 80 + 175 + 9, y + 7)
            doc.text(total_general_cena, cubeX + 80 + 255 + 9, y + 7)
            doc.text((total_general_desayuno + total_general_almuerzo + total_general_cena), cubeX + 80 + 335 + 9, y + 7)
            doc.rect(cubeX, y + 3, 150, 20).stroke()
            doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
            doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
            doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
            doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
            if (total_fueraHorario > 0) {
                doc.text("No contabilizados (fuera de horario):", cubeX + 80 + 320, y + 7 + 20)
                doc.text("Cant.: " + total_fueraHorario, cubeX + 80 + 335 + 12, y + 7 + 40)
            }
            y = y + 20;
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
        }

        $scope.formatoFechaPDF = function (fecha) {
            var MyDate = new Date(fecha);
            var MyDateString;
            MyDate.setDate(MyDate.getDate());
            MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/' + MyDate.getFullYear();
            return MyDateString
        }

        $scope.imprimirReporteComensal = function (reporte, gerencia, cabecera, comidasEmpresa, dollar) {
            var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
            var stream = doc.pipe(blobStream());
            var y = 150
            var itemsPorPagina = 10
            var items = 0
            var xSeparacion = 0
            var pagina = 1
            var cubeX = 70
            var totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.cabeceraReporteComensal(doc, pagina, totalPaginas, reporte, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
            var total_general_desayuno = 0
            var total_general_almuerzo = 0
            var total_general_cena = 0
            var total_desayunos = 0
            var total_almuerzos = 0
            var total_cenas = 0
            for (let i = 0; i < reporte.reporte.length; i++) {
                var total_comensal = 0
                doc.font('Helvetica', 8);

                // cabecera.forEach(function (dato) {
                //     doc.rect(cubeX + xSeparacion, y, 80, 20).stroke()
                //     xSeparacion += 80
                // })
                total_general_desayuno += reporte.reporte[i].desayuno
                total_general_almuerzo += reporte.reporte[i].almuerzo
                total_general_cena += reporte.reporte[i].cena
                total_comensal = reporte.reporte[i].desayuno + reporte.reporte[i].almuerzo + reporte.reporte[i].cena
                total_desayunos += reporte.reporte[i].desayuno
                total_almuerzos += reporte.reporte[i].almuerzo
                total_cenas += reporte.reporte[i].cena
                xSeparacion = 0
                var fecha
                doc.font('Helvetica', 8).fill('black')
                doc.text($scope.formatoFechaPDF(reporte.reporte[i].fecha), cubeX + 8, y + 7);
                doc.text(reporte.reporte[i].desayuno, cubeX + 80 + 95 + 9, y + 7)
                doc.text(reporte.reporte[i].almuerzo, cubeX + 80 + 175 + 9, y + 7)
                doc.text(reporte.reporte[i].cena, cubeX + 80 + 255 + 9, y + 7)
                doc.text(total_comensal, cubeX + 80 + 335 + 9, y + 7)

                doc.rect(cubeX, y + 3, 150, 20).stroke()
                doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
                doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
                doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
                doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
                y = y + 20;
                items++;
                if (items > itemsPorPagina || (y > 700)) {
                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 115 + 80;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.cabeceraReporteComensal(doc, pagina, totalPaginas, reporte, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
                }
            }
            doc.text("Total general", cubeX + 6, y + 7);
            doc.text(total_general_desayuno, cubeX + 80 + 95 + 9, y + 7)
            doc.text(total_general_almuerzo, cubeX + 80 + 175 + 9, y + 7)
            doc.text(total_general_cena, cubeX + 80 + 255 + 9, y + 7)
            doc.text((total_general_desayuno + total_general_almuerzo + total_general_cena), cubeX + 80 + 335 + 9, y + 7)
            doc.rect(cubeX, y + 3, 150, 20).stroke()
            doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
            doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
            doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
            doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
            y = y + 20;

            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
        }

        $scope.cabeceraReporteComedor = function (doc, pagina, totalPaginas, cabecera, empresa, comedor) {
            var y = 150;
            var xSeparacion = 0
            var cubeX = 100
            var fecha_impresion = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            // doc.rect(40, 40, 40, 40).fillAndStroke("silver", "#000");
            doc.font('Helvetica-Bold', 12)
                .fill('black')
            doc.text("REPORTES DE COMEDOR " + comedor.toUpperCase() + ' ' + empresa.toUpperCase(), 150, 80, { width: 300, align: "center" });
            doc.font('Helvetica-Bold', 8);
            cabecera.forEach(function (dato) {
                doc.rect(cubeX + xSeparacion, y, 80, 20).stroke()
                doc.text(dato, cubeX + xSeparacion + 9, y + 7);
                xSeparacion += 80
            })
            doc.rect(cubeX + 130, y + 460, 130, 0).stroke()
            doc.text('Encargado', cubeX + 146 + 26, y + 490)
            doc.font('Helvetica', 8);
            if ($scope.imagenEmpresa) {
                doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
            }
        }

        $scope.cabeceraReporteEmpresa = function (doc, pagina, totalPaginas, cabecera, empresa, comedor) {
            var y = 150;
            var x = 100
            var xSeparacion = 0
            var cubeX = 70
            doc.font('Helvetica-Bold', 12)
                .fill('black')
            doc.font('Helvetica-Bold', 8);
            doc.text("Empresa", 124, 80);
            doc.text(empresa, 300, 80);
            doc.text("Gerencia", 124, 100);
            doc.text("Periodo", 124, 120);
            doc.text("Empleado", 124, 140);
            doc.text("DESAYUNO", 270 - 30, 140);
            doc.text("ALMUERZO", 350 - 30, 140);
            doc.text("CENA", 430 - 30, 140);
            doc.text("TOTAL GENERAL", 510 - 30, 140);
            doc.rect(cubeX, 73, 150, 20).stroke()
            doc.rect(cubeX, 93, 150, 20).stroke()
            doc.rect(cubeX, 113, 150, 20).stroke()
            doc.rect(cubeX, 133, 150, 20).stroke()
            doc.rect(cubeX + 150, 73, 350, 20).stroke()
            doc.rect(cubeX + 150, 93, 350, 20).stroke()
            doc.rect(cubeX + 150, 113, 350, 20).stroke()
            doc.rect(cubeX + 150, 133, 80, 20).stroke()
            doc.rect(cubeX + 230, 133, 80, 20).stroke()
            doc.rect(cubeX + 310, 133, 80, 20).stroke()
            doc.rect(cubeX + 390, 133, 110, 20).stroke()
            doc.font('Helvetica', 8);
            if ($scope.imagenEmpresa) {
                doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
            }
        }

        $scope.cabeceraReporteComensal = function (doc, pagina, totalPaginas, reporte, empresa, comedor) {
            var y = 150;
            var x = 100
            var xSeparacion = 0
            var cubeX = 70
            doc.font('Helvetica-Bold', 12)
                .fill('black')
            doc.font('Helvetica-Bold', 8);
            doc.text("Empleado", 124, 80);
            doc.text(reporte.nombre, 300, 80);
            doc.text(empresa, 300, 100);
            doc.text("Empresa", 124, 100);
            doc.text("Periodo", 124, 120);
            doc.text("Empleado", 124, 140);
            doc.text("DESAYUNO", 240, 140);
            doc.text("ALMUERZO", 320, 140);
            doc.text("CENA", 410, 140);
            doc.text("TOTAL GENERAL", 490, 140);
            doc.rect(cubeX, 73, 150, 20).stroke()
            doc.rect(cubeX, 93, 150, 20).stroke()
            doc.rect(cubeX, 113, 150, 20).stroke()
            doc.rect(cubeX, 133, 150, 20).stroke()
            doc.rect(cubeX + 150, 73, 350, 20).stroke()
            doc.rect(cubeX + 150, 93, 350, 20).stroke()
            doc.rect(cubeX + 150, 113, 350, 20).stroke()
            doc.rect(cubeX + 150, 133, 80, 20).stroke()
            doc.rect(cubeX + 230, 133, 80, 20).stroke()
            doc.rect(cubeX + 310, 133, 80, 20).stroke()
            doc.rect(cubeX + 390, 133, 110, 20).stroke()
            doc.font('Helvetica', 8);
            if ($scope.imagenEmpresa) {
                doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
            }
        }

        $scope.cabeceraReportePorComensal = function () {

        }

        $scope.abrirModalEdicionAlias = function () {
            $scope.clienteEmpresaAsignacionAlias = {}
            $scope.clienteEmpresaAsignacionAlias.empresaCliente = Object.assign({}, $scope.empresaExternaSeleccionada)
            $scope.clienteEmpresaEdicionGerencias
            $scope.obtenerAliasEmpresa()
            $scope.activeModal = 1
            $scope.abrirPopup($scope.modalEdicionAlias);
        }

        $scope.cerrarModalEdicionAlias = function () {
            $scope.activeModal = 0
            $scope.clienteEmpresaAsignacionAlias = {}
            // $scope.listaAliasclientesEmpresa = []
            $scope.cerrarPopup($scope.modalEdicionAlias);
        }

        $scope.abrirModalEdicionGerencias = function () {
            $scope.clienteEmpresaEdicionGerencias = {}
            $scope.clienteEmpresaEdicionGerencias.empresaCliente = Object.assign({}, $scope.empresaExternaSeleccionada)
            $scope.obtenerGerencias()
            $scope.activeModal = 2
            $scope.abrirPopup($scope.modalEdicionGerencias);
        }
        $scope.cerrarModalEdicionGerencias = function () {
            $scope.activeModal = 0
            $scope.clienteEmpresaEdicionGerencias = {}
            $scope.cerrarPopup($scope.modalEdicionGerencias);
        }

        $scope.abrirModalEdicionComensales = function () {
            $scope.clienteEmpresaEdicionComensales = {}
            $scope.clienteEmpresaEdicionComensales.empresaCliente = Object.assign({}, $scope.empresaExternaSeleccionada)
            $scope.obtenerGerencias()
            $scope.obtenerComensales()
            $scope.activeModal = 3
            $scope.abrirPopup($scope.modalEdicionComensales);
        }

        $scope.cerrarModalEdicionComensales = function () {
            $scope.activeModal = 0
            $scope.clienteEmpresaEdicionComensales = {}
            $scope.cerrarPopup($scope.modalEdicionComensales);
        }

        $scope.abrirModalEdicionComidas = function () {
            $scope.clienteEmpresaComidas = {}
            $scope.clienteEmpresaComidas.empresaCliente = Object.assign({}, $scope.empresaExternaSeleccionada)
            $scope.obtenerComidas()
            $scope.activeModal = 4
            $scope.abrirPopup($scope.modalEdicionComidas);
        }

        $scope.cerrarModalEdicionComidas = function () {
            $scope.clienteEmpresaComidas = {}
            $scope.activeModal = 0
            $scope.cerrarPopup($scope.modalEdicionComidas);
        }

        $scope.abrirModalEdicionPrecios = function () {
            $scope.clienteEmpresaPreciosComidas = {}
            $scope.clienteEmpresaPreciosComidas.empresaCliente = Object.assign({}, $scope.empresaExternaSeleccionada)
            $scope.activeModal = 5
            $scope.obtenerPrecioComidas()
            $scope.abrirPopup($scope.modalEdicionPrecios);
        }

        $scope.cerrarModalEdicionPrecios = function () {
            $scope.activeModal = 0
            $scope.clienteEmpresaPreciosComidas = {}
            $scope.cerrarPopup($scope.modalEdicionPrecios);
        }

        $scope.buscarCliente = function (query) {
            if (query != "" && query != undefined) {
                var promesa = ClientesNit($scope.usuario.id_empresa, query);
                return promesa;
            }
        }

        $scope.abrirdialogClientesComensales = function () {
            $scope.abrirPopup($scope.dialogClienteEmpresa);
        }

        $scope.cerrardialogClientesComensales = function () {
            $scope.activeModal = 0
            $scope.cerrarPopup($scope.dialogClienteEmpresa);
        }

        $scope.abrirdialogBusquedaComensales = function () {
            $scope.activeModal = 0
            $scope.abrirPopup($scope.busquedaComensalesEmpresa);
        }

        $scope.cerrardialogBusquedaComensales = function () {
            $scope.activeModal = 0
            $scope.cerrarPopup($scope.busquedaComensalesEmpresa);
        }

        $scope.abrirdialogAlertaMarcaciones = function () {
            $scope.activeModal = 0
            $scope.obtenerAlertas()
            $scope.abrirPopup($scope.dialogAlertasMarcaciones);
        }

        $scope.cerrardialogAlertaMarcaciones = function () {
            $scope.activeModal = 0
            $scope.alertaMarcaciones = []
            $scope.cerrarPopup($scope.dialogAlertasMarcaciones);
        }

        $scope.abrirdialogHistorialDocumentos = function () {
            $scope.activeModal = 0
            $scope.obtenerHistorialDocumentos()
            $scope.abrirPopup($scope.dialogHistorialDocumentos);
        }

        $scope.cerrardialogHistorialDocumentos = function () {
            $scope.activeModal = 0
            $scope.historialesDocumentos = []
            $scope.cerrarPopup($scope.dialogHistorialDocumentos);
        }
        $scope.inicio()
    });