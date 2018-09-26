angular.module('agil.controladores')

    .controller('controladorComensalesEmpresa', ['ObtenerImagen', '$scope', '$timeout', '$localStorage', '$filter', '$location', 'blockUI', 'Clientes', 'ClientesNit', 'GuardarAlias', 'ObtenerAlias', 'GuardarGerencias',
        'ObtenerGerencias', 'GuardarComensales', 'ObtenerComensales', 'GuardarComidas', 'ObtenerComidas', 'GuardarPrecioComidas', 'ObtenerPrecioComidas', 'GuardarHistorialExcel', 'GuardarComensalesExcel',
        'ObtenerHistorial', 'GuardarEmpresasExcel', 'GuardarGerenciasExcel', 'GuardarComidasExcel', 'GuardarPreciosExcel', 'Paginator', 'BusquedaComensales', 'ObtenerReporteComedor', 'ObtenerCambioMoneda',
        'ObtenerReporteEmpresa', 'ObtenerReporteComensal', 'ObtenerAlertasMarcacion', 'EditarAlertasMarcacion', 'ObtenerHistorialDocumentos', 'ObtenerDocumento', function (ObtenerImagen, $scope, $timeout, $localStorage, $filter, $location, blockUI, Clientes, ClientesNit, GuardarAlias, ObtenerAlias, GuardarGerencias,
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

            $scope.imagenEmpresa;
            var imgDelay = ObtenerImagen($scope.usuario.empresa.imagen);
            imgDelay.then(function (img) {
                $scope.imagenEmpresa = img
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })

            $scope.$on('$viewContentLoaded', function () {
                // if (redirectProformas) {
                //     $timeout(function () {
                //         $location.path('/proformas')
                //         // blockUI.stop()
                //     }, 5000)
                //     return
                // }
                ejecutarScriptsComensales($scope.modalEdicionAlias, $scope.modalEdicionGerencias, $scope.modalEdicionComensales, $scope.modalEdicionComidas, $scope.modalEdicionPrecios,
                    $scope.dialogClienteEmpresa, $scope.busquedaComensalesEmpresa, $scope.dialogAlertasMarcaciones, $scope.dialogHistorialDocumentos);
                // resaltarPestaña($location.path().substring(1));
                // $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
                // $scope.obtenerColumnasAplicacion()
            });

            $scope.$on('$routeChangeStart', function (next, current) {
                // if (!redirectProformas) {
                $scope.eliminarPopup($scope.modalEdicionAlias);
                $scope.eliminarPopup($scope.modalEdicionGerencias);
                $scope.eliminarPopup($scope.modalEdicionComensales);
                $scope.eliminarPopup($scope.modalEdicionComidas);
                $scope.eliminarPopup($scope.modalEdicionPrecios);
                $scope.eliminarPopup($scope.dialogClienteEmpresa);
                $scope.eliminarPopup($scope.busquedaComensalesEmpresa);
                $scope.eliminarPopup($scope.dialogAlertasMarcaciones);
                $scope.eliminarPopup($scope.dialogHistorialDocumentos);
                // }
            });

            // convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
            //     if (imagenEmpresa.length > 0 && imagenEmpresa !== "error") {
            //         $scope.imagenEmpresa = imagenEmpresa;
            //     } else {
            //         convertUrlToBase64Image("img/agilsoftware.png", function (imagenEmpresa) {
            //             if (imagenEmpresa.length > 0 && imagenEmpresa !== "error") {
            //                 $scope.mostrarMensaje('No se encuentra la imagen de la empresa.')
            //                 $scope.imagenEmpresa = imagenEmpresa;
            //             } else {
            //                 $scope.mostrarMensaje('No se encuentra imagenen de la empresa.')
            //             }
            //         })
            //     }
            // })

            $scope.inicio = function () {
                // blockUI.start()
                $scope.activeModal = 0
                $scope.obtenerClientes()
                if ($scope.empresaExternaSeleccionada) {
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
                    $scope.obtenerComidas()
                    $scope.obtenerGerencias()
                    $scope.obtenerHistoriales()
                    $scope.obtenerComensales()
                    setTimeout(function () {
                        aplicarDatePickers();
                    }, 200);
                }
                blockUI.stop()
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
                blockUI.start()
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
                    blockUI.stop()
                }).catch(function (err) {
                    blockUI.stop()
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                })
            }

            $scope.obtenerClientes = function () {
                blockUI.start()
                var prom = Clientes($scope.usuario.id_empresa);
                prom.then(function (cls) {
                    $scope.clientes = cls
                    $scope.clientesProcesados = cls
                    blockUI.stop()
                }).catch(function (err) {
                    blockUI.stop()
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                })
            }

            $scope.establecerCliente = function (cliente) {
                switch ($scope.activeModal) {
                    case 0:
                        if (!$scope.filtroComensales) {
                            $scope.filtroComensales = {}
                        }
                        if (!$scope.empresaExternaSeleccionada) {
                            $scope.empresaExternaSeleccionada = Object.assign({}, cliente)
                            $scope.inicio()
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
                        $scope.clienteEmpresaComidas.verTodos
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
                        if (!$scope.empresaExternaSeleccionada) {
                            $scope.empresaExternaSeleccionada = Object.assign({}, cliente)
                            $scope.inicio()
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
                        $scope.clienteEmpresaComidas.verTodos = false
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
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            }
            $scope.verTodasLasComidas = function () {
                if (!$scope.clienteEmpresaComidas) {
                    $scope.clienteEmpresaComidas = {}
                    $scope.clienteEmpresaComidas.verTodos = false
                } else if (!$scope.clienteEmpresaComidas.verTodos) {
                    $scope.clienteEmpresaComidas.verTodos = true
                } else {
                    $scope.clienteEmpresaComidas.verTodos = false
                }
                $scope.obtenerComidas()
            }


            $scope.obtenerComidas = function (empresa) {
                blockUI.start()
                var prom;
                if (!$scope.clienteEmpresaComidas) {
                    $scope.clienteEmpresaComidas = {}
                    $scope.clienteEmpresaComidas.verTodos = false
                }
                if (empresa) {
                    prom = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaComidas.empresaCliente.id)
                } else if ($scope.clienteEmpresaComidas.verTodos) {
                    prom = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, 0)
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
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            }

            $scope.obtenerHistoriales = function (filtrar) {
                blockUI.start()
                $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true)
                $scope.paginator.filter = $scope.filtroComensales
                var prom = ObtenerHistorial($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id, $scope.paginator)
                prom.then(function (res) {
                    $scope.filtroComensales = $scope.filtrarHistorial($scope.filtroComensales, true, true)
                    if (res.hasErr) {
                        res.mostrarMensaje(res.mensaje)
                    } else {
                        $scope.historialesComedor = res.historial.map(function (hist) {
                            hist.fecha_texto = hist.fecha.split('T')[0].split('-').reverse().join('/') + ' ' + hist.fecha.split('T')[1].split('.')[0]
                            hist.fecha = new Date(hist.fecha)
                            return hist
                        })
                        $scope.paginator.setPages(res.paginas)
                    }
                    blockUI.stop()
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            }

            $scope.obtenerAlertas = function (filtrar) {
                blockUI.start()
                var prom = ObtenerAlertasMarcacion($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
                prom.then(function (res) {
                    if (res.hasErr) {
                        res.mostrarMensaje(res.mensaje)
                    } else {
                        $scope.alertaMarcaciones = res.alertas
                        $scope.Marcaciones = res.alertas
                        for (var index = 0; index < $scope.alertaMarcaciones.length; index++) {
                            $scope.alertaMarcaciones[index].marcacionesFaltantes = []
                            for (var _index = 0; _index < $scope.alertaMarcaciones[index].marcaciones.length; _index++) {
                                var conteoIndex = -1
                                if ($scope.alertaMarcaciones[index].marcacionesFaltantes.some(function (dato) {
                                    conteoIndex += 1
                                    if (dato.fecha.split('T')[0] === $scope.alertaMarcaciones[index].marcaciones[_index].fecha.split('T')[0].split('-').reverse().join('/')) {
                                        return true
                                    }
                                    return false
                                })) {
                                    if ($scope.alertaMarcaciones[index].marcacionesFaltantes[conteoIndex].id_comida) {
                                        var comida = $scope.listaComidasclienteEmpresa.find(function (food) {
                                            return food.id === $scope.alertaMarcaciones[index].marcaciones[_index].id_comida//$scope.alertaMarcaciones[index].marcacionesFaltantes[conteoIndex].id_comida
                                        })
                                        if (comida) {
                                            if (comida.nombre.toLowerCase() === 'desayuno') {
                                                $scope.alertaMarcaciones[index].marcacionesFaltantes[conteoIndex].desayuno.cantidad += 1
                                            }
                                            if (comida.nombre.toLowerCase() === 'almuerzo') {
                                                $scope.alertaMarcaciones[index].marcacionesFaltantes[conteoIndex].almuerzo.cantidad += 1
                                            }
                                            if (comida.nombre.toLowerCase() === 'cena') {
                                                $scope.alertaMarcaciones[index].marcacionesFaltantes[conteoIndex].cena.cantidad += 1
                                            }
                                        } else {
                                            $scope.alertaMarcaciones[index].marcacionesFaltantes[conteoIndex].fuera_horario += 1
                                        }
                                    } else {
                                        $scope.alertaMarcaciones[index].marcacionesFaltantes[conteoIndex].fuera_horario += 1
                                    }
                                } else {
                                    var chingadera = { cantidad: 0, id_comida: $scope.alertaMarcaciones[index].marcaciones[_index].id_comida }
                                    var combo = { id_comida: $scope.alertaMarcaciones[index].marcaciones[_index].id_comida, fecha: $scope.alertaMarcaciones[index].marcaciones[_index].fecha.split('T')[0].split('-').reverse().join('/'), desayuno: Object.assign({}, chingadera), almuerzo: Object.assign({}, chingadera), cena: Object.assign({}, chingadera), fuera_horario: 0, gerencia: { id: $scope.alertaMarcaciones[index].marcaciones[_index].id_gerencia } }
                                    var comida = $scope.listaComidasclienteEmpresa.find(function (food) {
                                        return food.id === $scope.alertaMarcaciones[index].marcaciones[_index].id_comida
                                    })
                                    if (comida) {
                                        if (comida.nombre.toLowerCase() === 'desayuno') {
                                            combo.desayuno.cantidad += 1
                                        }
                                        if (comida.nombre.toLowerCase() === 'almuerzo') {
                                            combo.almuerzo.cantidad += 1
                                        }
                                        if (comida.nombre.toLowerCase() === 'cena') {
                                            combo.cena.cantidad += 1
                                        }
                                    } else {
                                        combo.fuera_horario += 1
                                    }
                                    $scope.alertaMarcaciones[index].marcacionesFaltantes.push(combo)
                                }
                            }
                        }
                        var marcasFaltantes = []
                        for (var index = 0; index < $scope.alertaMarcaciones.length; index++) {
                            for (var _index = 0; _index < $scope.alertaMarcaciones[index].marcacionesFaltantes.length; _index++) {
                                var desayuno = $scope.listaComidasclienteEmpresa.find(function (food) {
                                    return food.nombre.toLowerCase() === 'desayuno'
                                })
                                var almuerzo = $scope.listaComidasclienteEmpresa.find(function (food) {
                                    return food.nombre.toLowerCase() === 'almuerzo'
                                })
                                var cena = $scope.listaComidasclienteEmpresa.find(function (food) {
                                    return food.nombre.toLowerCase() === 'cena'
                                })

                                if ($scope.alertaMarcaciones[index].marcacionesFaltantes[_index].desayuno.cantidad === 0) {
                                    var marcacion = {
                                        // habilitado: true,
                                        comida: desayuno,
                                        fecha: $scope.alertaMarcaciones[index].marcacionesFaltantes[_index].fecha,
                                        gerencia: $scope.alertaMarcaciones[index].marcacionesFaltantes[_index].gerencia,
                                        comensal: {
                                            id: $scope.alertaMarcaciones[index].id,
                                            nombre: $scope.alertaMarcaciones[index].nombre,
                                            id_cliente: $scope.alertaMarcaciones[index].id_cliente,
                                            id_empresa: $scope.alertaMarcaciones[index].id_empresa,
                                            tarjeta: $scope.alertaMarcaciones[index].tarjeta,
                                            tipo: $scope.alertaMarcaciones[index].tipo
                                        }
                                    }
                                    marcasFaltantes.push(marcacion)
                                }
                                if ($scope.alertaMarcaciones[index].marcacionesFaltantes[_index].almuerzo.cantidad === 0) {
                                    var marcacion = {
                                        // habilitado: true,
                                        comida: almuerzo,
                                        fecha: $scope.alertaMarcaciones[index].marcacionesFaltantes[_index].fecha,
                                        gerencia: $scope.alertaMarcaciones[index].marcacionesFaltantes[_index].gerencia,
                                        comensal: {
                                            id: $scope.alertaMarcaciones[index].id,
                                            nombre: $scope.alertaMarcaciones[index].nombre,
                                            id_cliente: $scope.alertaMarcaciones[index].id_cliente,
                                            id_empresa: $scope.alertaMarcaciones[index].id_empresa,
                                            tarjeta: $scope.alertaMarcaciones[index].tarjeta,
                                            tipo: $scope.alertaMarcaciones[index].tipo
                                        }
                                    }
                                    marcasFaltantes.push(marcacion)
                                }
                                if ($scope.alertaMarcaciones[index].marcacionesFaltantes[_index].cena.cantidad === 0) {
                                    var marcacion = {
                                        // habilitado: true,
                                        comida: cena,
                                        fecha: $scope.alertaMarcaciones[index].marcacionesFaltantes[_index].fecha,
                                        gerencia: $scope.alertaMarcaciones[index].marcacionesFaltantes[_index].gerencia,
                                        comensal: {
                                            id: $scope.alertaMarcaciones[index].id,
                                            nombre: $scope.alertaMarcaciones[index].nombre,
                                            id_cliente: $scope.alertaMarcaciones[index].id_cliente,
                                            id_empresa: $scope.alertaMarcaciones[index].id_empresa,
                                            tarjeta: $scope.alertaMarcaciones[index].tarjeta,
                                            tipo: $scope.alertaMarcaciones[index].tipo
                                        }
                                    }
                                    marcasFaltantes.push(marcacion)
                                }
                            }
                        }
                        $scope.alertaMarcaciones = marcasFaltantes
                        blockUI.stop()
                    }
                    blockUI.stop()
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
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
                    if ((parseInt(horas[0])) < 12) {
                        horas[0] = (parseInt(horas[0]) + 12) + ''
                    }
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                            var diffSec = ((new Date(fcomensal)) - (new Date(fdato))) / 1000
                            if (diffSec < 0) {
                                diffSec *= -1
                            }
                            // var hrs = ~~(diff / 3600);
                            // var mins = ~~((diff % 3600) / 60);
                            // var secs = diff % 60;
                            if (!(dato.tarjeta === comensal.tarjeta && dato.nombre === comensal.nombre && diffSec < 1800)) {
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                if (marca === 1) {
                    comensal.habilitado = true
                } else if (marca === 2) {
                    comensal.habilitado = false
                }
                var prom = EditarAlertasMarcacion($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id, comensal)
                prom.then(function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    if (!res.hasErr) {
                        comensal.id = res.marcacion.id
                        comensal.fecha = res.marcacion.fecha.split('T')[0].split('-').reverse().join('/')
                        // $scope.obtenerAlertas()
                    }
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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

            $scope.generarHistorialPDF = function (documento) {
                var prom = ObtenerDocumento($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id, documento)
                prom.then(function (res) {
                    var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
                    var stream = doc.pipe(blobStream());
                    var y = 190
                    var itemsPorPagina = 20
                    var items = 0
                    var pagina = 1
                    var cubeX = 70
                    var totalPaginas = Math.ceil(1 / itemsPorPagina);
                    if ($scope.imagenEmpresa) {
                        doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
                    }
                    //cabecera
                    doc.font('Helvetica-Bold', 10);
                    doc.text('DOCUMENTO : ', cubeX + 150 + 29, 90 + 7, { width: 200 })
                    doc.text(documento.documento, cubeX + 150 + 29, 110 + 7, { width: 200 })//Nombre fecha documento
                    doc.text('Fecha : ' + documento.fecha.split('-').reverse().join('/'), cubeX + 150 + 29, 130 + 7, { width: 200 })//Nombre fecha documento
                    doc.font('Helvetica-Bold', 8);
                    doc.font('Helvetica', 8).fill('black')
                    doc.text('Tarjeta', cubeX + 3, 170 + 7);
                    doc.text('Nombre', cubeX + 65, 170 + 7)
                    doc.text('Fecha Hora', cubeX + 200 + 29, 170 + 7)
                    doc.text('Lectora', cubeX + 80 + 240 + 9, 170 + 7)
                    doc.text('Name', cubeX + 80 + 335 + 9, 170 + 7)
                    doc.rect(cubeX, 170 + 3, 50, 20).stroke()//tarjeta
                    doc.rect(cubeX, 170 + 3, 215, 20).stroke()//nombre
                    doc.rect(cubeX + 215, 170 + 3, 95, 20).stroke()//fecha
                    doc.rect(cubeX + 310, 170 + 3, 90, 20).stroke()//identificador
                    doc.rect(cubeX + 400, 170 + 3, 100, 20).stroke()//empresa
                    ///
                    for (var i = 0; i < res.documento.length; i++) {
                        // columns.push(res.documento[index].tarjeta)
                        // columns.push(res.documento[index].comensal.nombre)
                        // columns.push(res.documento[index].fecha.split('T')[0].split('-').reverse().join('/') + ' ' + res.documento[index].fecha.split('T')[1].split('.')[0])
                        // columns.push(res.documento[index].identificador_equipo)
                        // columns.push(res.documento[index].empresaCliente.alias[0].nombre)
                        doc.font('Helvetica', 8);
                        doc.font('Helvetica', 8).fill('black')
                        doc.text(res.documento[i].tarjeta, cubeX + 3, y + 7);
                        doc.text(res.documento[i].comensal.nombre, cubeX + 55, y + 7)
                        doc.text(res.documento[i].fecha.split('T')[0].split('-').reverse().join('/') + ' ' + res.documento[i].fecha.split('T')[1].split('.')[0], cubeX + 195 + 29, y + 7)
                        doc.font('Helvetica', 6);
                        doc.text(res.documento[i].identificador_equipo, cubeX + 63 + 240 + 9, y + 7, { width: 85 })
                        doc.font('Helvetica', 7);
                        doc.text(res.documento[i].empresaCliente.alias[0].nombre, cubeX + 80 + 315 + 9, y + 7)
                        doc.font('Helvetica', 8);
                        doc.rect(cubeX, y + 3, 50, 20).stroke()//tarjeta
                        doc.rect(cubeX, y + 3, 215, 20).stroke()//nombre
                        doc.rect(cubeX + 215, y + 3, 95, 20).stroke()//fecha
                        doc.rect(cubeX + 310, y + 3, 90, 20).stroke()//identificador
                        doc.rect(cubeX + 400, y + 3, 100, 20).stroke()//empresa
                        y = y + 20;
                        items++;
                        if (items > itemsPorPagina || (y > 700)) {
                            doc.addPage({ size: [612, 792], margin: 10 });
                            y = 190;
                            items = 0;
                            pagina = pagina + 1;
                            if ($scope.imagenEmpresa) {
                                doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
                            }
                            //cabecera
                            doc.font('Helvetica-Bold', 10);
                            doc.text(documento.documento + ' ' + documento.fecha, cubeX + 150 + 29, 110 + 7, { width: 200 })//Nombre fecha documento
                            doc.font('Helvetica-Bold', 8);
                            doc.font('Helvetica', 8).fill('black')
                            doc.text('Tarjeta', cubeX + 3, 170 + 7);
                            doc.text('Nombre', cubeX + 65, 170 + 7)
                            doc.text('Fecha Hora', cubeX + 200 + 29, 170 + 7)
                            doc.text('Lectora', cubeX + 80 + 240 + 9, 170 + 7)
                            doc.text('Name', cubeX + 80 + 335 + 9, 170 + 7)
                            doc.rect(cubeX, 170 + 3, 50, 20).stroke()//tarjeta
                            doc.rect(cubeX, 170 + 3, 215, 20).stroke()//nombre
                            doc.rect(cubeX + 215, 170 + 3, 95, 20).stroke()//fecha
                            doc.rect(cubeX + 310, 170 + 3, 90, 20).stroke()//identificador
                            doc.rect(cubeX + 400, 170 + 3, 100, 20).stroke()//empresa
                            ///

                        }
                    }
                    // doc.rect(cubeX, y + 3, 150, 20).stroke()
                    // doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
                    // doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
                    // doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
                    // doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
                    y = y + 20;
                    doc.end();
                    stream.on('finish', function () {
                        var fileURL = stream.toBlobURL('application/pdf');
                        window.open(fileURL, '_blank', 'location=no');
                    });
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
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
                    for (var index = 0; index < res.documento.length; index++) {
                        var columns = []
                        columns.push(res.documento[index].tarjeta)
                        columns.push(res.documento[index].comensal.nombre)
                        columns.push(res.documento[index].fecha.split('T')[0].split('-').reverse().join('/') + ' ' + res.documento[index].fecha.split('T')[1].split('.')[0])
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
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
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
                            if (comidasEmpresa.length === 0) {
                                $scope.mostrarMensaje('El listado de comidas para esta empresa esta vacio, no se puede generar el reporte')
                                return
                            }
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
                                for (var index = 0; index < res.reporte.length; index++) {
                                    var reporteGerencias = []
                                    if (res.reporte[index].historial.length > 0) {
                                        for (var _index = 0; _index < res.reporte[index].historial.length; _index++) {
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
                                }
                                if (excel) {
                                    for (var _index = 0; _index < reportesGerencias.length; _index++) {
                                        var repo = reportesGerencias[_index]
                                        $scope.imprimirReporteComedorExcel(repo, repo[0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar, res.periodo)
                                    }
                                } else {
                                    for (var _index = 0; _index < reportesGerencias.length; _index++) {
                                        $scope.imprimirReporteComedor(reportesGerencias[_index], reportesGerencias[_index][0].gerencia, cabecera, comidasEmpresa, tipoCambioDollar, res.periodo)
                                    }
                                }
                                blockUI.stop();
                            })
                        })
                    })
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
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
                                    $scope.imprimirReporteEmpresaEXCEL(res.reporte, res.gerencia, cabecera, comidasEmpresa, tipoCambioDollar, res.periodo)
                                } else {
                                    $scope.imprimirReporteEmpresa(res.reporte, res.gerencia, cabecera, comidasEmpresa, tipoCambioDollar, res.periodo)
                                }
                                blockUI.stop();
                            })
                        })
                    })
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            }

            $scope.reportePDFAlertasMarcaciones = function (excel, matriz) {
                if (matriz) {
                    var promComidas = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.id ? $scope.filtroComensales.empresaCliente.id : $scope.empresaExternaSeleccionada.id : $scope.empresaExternaSeleccionada.id)
                    promComidas.then(function (comidas) {
                        var comidasEmpresa = comidas.lista
                        var cabecera = []
                        comidasEmpresa.forEach(function (comida) {
                            cabecera.push(comida.nombre.toUpperCase())
                        })
                        cabecera.unshift('empleado'.toUpperCase())
                        cabecera.unshift('empresa'.toUpperCase())
                        cabecera.push('Total general'.toUpperCase())
                        if ($scope.alertaMarcaciones.length > 0) {
                            $scope.alertaMarcaciones.reverse()
                            var alertasVerificadas = []
                            var alertas = []
                            var index = 0
                            while ($scope.alertaMarcaciones.length > 0) {
                                var conteoIndex = -1
                                var alerta = $scope.alertaMarcaciones.pop()
                                if (alertas.some(function (dato) {
                                    conteoIndex += 1
                                    if (dato.fecha === alerta.fecha) {
                                        return true;
                                    }
                                    return false;
                                })) {
                                    alertas[conteoIndex].alertas.push(alerta)
                                    alertasVerificadas.push(alerta)
                                } else {
                                    alertasVerificadas.push(alerta)
                                    var _alerta = { fecha: alerta.fecha, alertas: [alerta] }
                                    alertas.push(_alerta)
                                }
                                index += 1
                            }
                            $scope.alertaMarcaciones = alertasVerificadas
                            if (excel) {
                                $scope.imprimirAlertaMarcacionesMatriz(alertas, null, cabecera, comidasEmpresa)
                            } else {
                                $scope.imprimirAlertaMarcaciones(alertas, null, cabecera, comidasEmpresa)
                            }
                        }
                    }).catch(function (err) {
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.stack !== undefined && err.stack !== null) ? err.stack : 'Se perdió la conexión.'
                        $scope.mostrarMensaje(msg)
                        blockUI.stop()
                    })
                } else {
                    if ($scope.alertaMarcaciones.length > 0) {
                        if (excel) {
                            $scope.imprimirAlertaMarcacionesMatriz($scope.alertaMarcaciones)
                        } else {
                            $scope.imprimirAlertaMarcacionesLista($scope.alertaMarcaciones)
                        }
                    }
                }
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
                                for (var index = 0; index < res.reporte.length; index++) {
                                    var reporteFechasPorComensal = []
                                    for (var _index = 0; _index < res.reporte[index].historial.length; _index++) {
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
                                for (var _index = 0; _index < res.reporte.length; _index++) {
                                    if (excel) {
                                        $scope.imprimirReporteComensalEXCEL(res.reporte[_index], null, cabecera, comidasEmpresa, tipoCambioDollar, res.periodo)
                                    } else {
                                        $scope.imprimirReporteComensal(res.reporte[_index], null, cabecera, comidasEmpresa, tipoCambioDollar, res.periodo)
                                    }

                                }
                                blockUI.stop();
                            })
                        })
                    })
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            }

            $scope.imprimirAlertaMarcacionesLista = function (reporte) {
                var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
                var stream = doc.pipe(blobStream());
                var y = 135
                var itemsPorPagina = 10
                var items = 0
                var xSeparacion = 0
                var pagina = 1
                var cubeX = 70
                var periodo = reporte[0].fecha + " al " + reporte[reporte.length - 1].fecha
                var totalPaginas = Math.ceil(reporte.length / itemsPorPagina);
                $scope.cabeceraReporteAlertasMarcacionesLista(doc, $scope.usuario.empresa.razon_social, periodo, pagina, totalPaginas);
                for (var i = 0; i < reporte.length; i++) {
                    doc.text((i + 1), 70, y + 5);
                    doc.text(reporte[i].comensal.nombre, 120, y + 5);
                    doc.text(reporte[i].fecha, 320, y + 5);
                    doc.text(reporte[i].comida.nombre, 400, y + 5);
                    doc.text(reporte[i].habilitado === true ? 'Marcado' : reporte[i].habilitado === false ? 'Descartado' : 'Pendiente', 500, y + 5);
                    doc.rect(60, y, 500, 20).stroke()
                    // doc.text((i + 1), 60, y);
                    // doc.rect(60, y, 400, 20).stroke()
                    // doc.text(reporte[i].comensal.nombre, 60 + 60, y);
                    // doc.text(reporte[i].fecha, 60 + 60, y);
                    // doc.text(reporte[i].comida.nombre, 60 + 60 + 60, y);
                    // doc.text(reporte[i].habilitado === true ? 'Marcado' : reporte[i].habilitado === false ? 'Descartado' : 'Pendiente', 60 + 60 + 60 + 60, y);
                    y += 20
                    if (items > itemsPorPagina || (y > 700)) {
                        doc.addPage({ size: [612, 792], margin: 10 });
                        y = 115 + 80;
                        items = 0;
                        pagina = pagina + 1;
                        $scope.cabeceraReporteAlertasMarcacionesMatriz(doc, $scope.usuario.empresa.razon_social, periodo, pagina, totalPaginas);
                    }
                }
                y += 20
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
            }

            $scope.imprimirAlertaMarcacionesMatriz = function (reporte, gerencia, cabecera, comidasEmpresa) {
                if (reporte.length > 0) {
                    var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
                    var stream = doc.pipe(blobStream());
                    var y = 150
                    var itemsPorPagina = 10
                    var items = 0
                    var xSeparacion = 0
                    var pagina = 1
                    var cubeX = 70
                    var totalPaginas = Math.ceil(1 / itemsPorPagina);
                    if ($scope.Marcaciones.length > 0) {

                    }
                    $scope.cabeceraReporteAlertasMarcacionesMatriz(doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
                    for (var i = 0; i < reporte.length; i++) {
                        for (var index = 0; index < reporte[i].alertas.length; index++) {
                            // var total_comensal = 0
                            doc.font('Helvetica', 8);
                            // total_general_desayuno += reporte[i].desayuno.cantidad
                            // total_general_almuerzo += reporte[i].almuerzo.cantidad
                            // total_general_cena += reporte[i].cena.cantidad
                            // total_comensal = reporte[i].desayuno.cantidad + reporte[i].almuerzo.cantidad + reporte[i].cena.cantidad
                            // total_desayunos += reporte[i].desayuno.cantidad
                            // total_almuerzos += reporte[i].almuerzo.cantidad
                            // total_cenas += reporte[i].cena.cantidad
                            // xSeparacion = 0
                            doc.font('Helvetica', 6).fill('black')
                            doc.text(reporte[i].alertas[index].comida.empresaCliente.razon_social, cubeX - 20, y + 7);
                            doc.text(reporte[i].alertas[index].comensal.nombre, cubeX + 20, y + 7)
                            if (reporte[i].alertas[index].comida.nombre.toLowerCase() === "desayuno") {
                                doc.font('Helvetica', 8).fill('red');
                                doc.text(reporte[i].alertas[index].comida.nombre, cubeX + 65 + 95 + 9, y + 7).fill('black');
                                doc.rect(cubeX + 310, y + 3, 80, 20).stroke('red');
                            }
                            if (reporte[i].alertas[index].comida.nombre.toLowerCase() === "almuerzo") {
                                doc.font('Helvetica', 8).fill('black');
                                doc.text('Falta2', cubeX + 80 + 175 + 9, y + 7).fill('black');
                                doc.rect(cubeX + 230, y + 3, 80, 20).stroke('black');
                            }
                            if (reporte[i].alertas[index].comida.nombre.toLowerCase() === "cena") {
                                doc.font('Helvetica', 8).fill('black');
                                doc.text('Falta3', cubeX + 80 + 255 + 9, y + 7).fill('black');
                            }
                            doc.text(reporte[i].alertas[index].comida.nombre, cubeX + 165 + 175 + 9, y + 7)
                            // doc.text(reporte[i].alertas[index].cena.cantidad, cubeX + 80 + 255 + 9, y + 7)
                            // doc.text(total_comensal, cubeX + 80 + 335 + 9, y + 7)
                            // total_fueraHorario += reporte[i].fueraHorario
                            doc.rect(cubeX - 20, y + 3, 170, 20).stroke()
                            doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
                            doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
                            doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
                            doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
                            doc.rect(cubeX - 20, y + 3, 80, 20).stroke() // y ? 130 + 3 + 20
                            doc.rect(cubeX + 60, y + 3, 90, 20).stroke()

                            y = y + 20;
                            items++;
                            if (items > itemsPorPagina || (y > 700)) {
                                doc.addPage({ size: [612, 792], margin: 10 });
                                y = 115 + 80;
                                items = 0;
                                pagina = pagina + 1;
                                $scope.cabeceraReporteAlertasMarcacionesMatriz(doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase());
                            }
                        }
                    }
                    doc.text("Total general", cubeX - 20 + 6, y + 7);
                    // doc.text(total_general_desayuno, cubeX + 80 + 95 + 9, y + 7)
                    // doc.text(total_general_almuerzo, cubeX + 80 + 175 + 9, y + 7)
                    // doc.text(total_general_cena, cubeX + 80 + 255 + 9, y + 7)
                    // doc.text((total_general_desayuno + total_general_almuerzo + total_general_cena), cubeX + 80 + 335 + 9, y + 7)
                    doc.rect(cubeX - 20, y + 3, 170, 20).stroke()
                    doc.rect(cubeX + 150, y + 3, 80, 20).stroke()
                    doc.rect(cubeX + 230, y + 3, 80, 20).stroke()
                    doc.rect(cubeX + 310, y + 3, 80, 20).stroke()
                    doc.rect(cubeX + 390, y + 3, 110, 20).stroke()
                    // if (total_fueraHorario > 0) {
                    //     doc.text("No contabilizados (fuera de horario):", cubeX + 80 + 320, y + 7 + 20)
                    //     doc.text("Cant.: " + total_fueraHorario, cubeX + 80 + 335 + 12, y + 7 + 40)
                    // }
                    y = y + 20;
                    doc.end();
                    stream.on('finish', function () {
                        var fileURL = stream.toBlobURL('application/pdf');
                        window.open(fileURL, '_blank', 'location=no');
                    });
                } else {
                    $scope.mostrarMensaje('No hay datos.')
                }
            }

            $scope.imprimirReporteComedorExcel = function (reporte, gerencia, cabecera, comidasEmpresa, dollar, periodo) {
                var reporte = reporte
                var gerencia = gerencia
                var cabecera = cabecera
                var comidasEmpresa = comidasEmpresa
                var dollar = dollar
                var data = [[""], [""], [("REPORTES DE COMEDOR " + gerencia.nombre.toUpperCase() + ' ' + reporte[0].empresaCliente.razon_social.toUpperCase())], [""], cabecera]
                var total_desayunos = 0;
                var total_almuerzos = 0;
                var total_cenas = 0;
                for (var i = 0; i < reporte.length; i++) {
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
                for (var i = 0; i < reporte.length; i++) {
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

            $scope.imprimirReporteComensalEXCEL = function (reporte, gerencia, cabecera, comidasEmpresa, dollar, periodo) {
                var reporte = reporte
                var gerencia = gerencia
                var cabecera = cabecera
                var comidasEmpresa = comidasEmpresa
                var dollar = dollar
                var data = [["REPORTE POR PERSONA"], ["EMPLEADO", reporte.nombre], ["EMPRESA", reporte.reporte[0].empresaCliente.razon_social], ["GERENCIA", ""], ["PERIODO", reporte.fecha], cabecera]
                var total_general_desayuno = 0
                var total_general_almuerzo = 0
                var total_general_cena = 0
                var total_desayunos = 0;
                var total_almuerzos = 0;
                var total_cenas = 0;
                for (var i = 0; i < reporte.reporte.length; i++) {
                    var total_comensal = 0
                    total_general_desayuno += reporte.reporte[i].desayuno
                    total_general_almuerzo += reporte.reporte[i].almuerzo
                    total_general_cena += reporte.reporte[i].cena
                    total_comensal = reporte.reporte[i].desayuno + reporte.reporte[i].almuerzo + reporte.reporte[i].cena
                    total_desayunos += reporte.reporte[i].desayuno
                    total_almuerzos += reporte.reporte[i].almuerzo
                    total_cenas += reporte.reporte[i].cena
                    var columns = []

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
                var columns = ["TOTAL General", total_general_desayuno, total_general_almuerzo, total_general_cena, (total_general_desayuno + total_general_almuerzo + total_general_cena)]
                // data.push(columns)
                // columns = [total_general_desayuno]
                // data.push(columns)
                // columns = [total_general_almuerzo]
                // data.push(columns)
                // columns = [total_general_cena]
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
                // for (var i = 0; i < reporte.reporte.length; i++) {
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

            $scope.imprimirReporteComedor = function (reporte, gerencia, cabecera, comidasEmpresa, dollar, periodo) {
                var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
                var stream = doc.pipe(blobStream());
                var y = 170
                var itemsPorPagina = 20
                var inicio_periodo;
                var final_periodo;
                if (periodo[0]) {
                    inicio_periodo = periodo[0].split('T')[0]
                }
                if (periodo[1]) {
                    final_periodo = periodo[1].split('T')[0]
                }
                // var periodo_ = 
                var items = 0
                var xSeparacion = 0
                var pagina = 1
                var cubeX = 100
                var totalPaginas = Math.ceil(1 / itemsPorPagina);
                $scope.cabeceraReporteComedor(reporte, doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase(), inicio_periodo, final_periodo);
                var total_desayunos = 0
                var total_almuerzos = 0
                var total_cenas = 0
                for (var i = 0; i < reporte.length; i++) {
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
                        y = 170;
                        items = 0;
                        pagina = pagina + 1;
                        $scope.cabeceraReporteComedor(reporte, doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, reporte[i].gerencia ? reporte[i].gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase(), inicio_periodo, final_periodo);
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
                doc.text($scope.number_format(precio_total_desayunos, 2), cubeX + 95 + 9, y + 7 + 20)
                doc.text($scope.number_format(precio_total_almuerzos, 2), cubeX + 175 + 9, y + 7 + 20)
                doc.text($scope.number_format(precio_total_cenas, 2), cubeX + 255 + 9, y + 7 + 20)
                doc.text($scope.number_format((precio_total_desayunos + precio_total_almuerzos + precio_total_cenas), 2), cubeX + 175 + 9, y + 7 + 40)
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
                doc.text(('T.C. ' + dollar + '       Bs ' + ($scope.number_format(((precio_total_desayunos + precio_total_almuerzos + precio_total_cenas) * dollar), 2))), cubeX + 15 + 9 + 240, y + 7 + 90)
                doc.text((comidasEmpresa[0].nombre.toLowerCase() === 'desayuno' ? $scope.number_format(comidasEmpresa[0].precio[0].precio, 2) : comidasEmpresa[1].nombre.toLowerCase() === 'desayuno' ? $scope.number_format(comidasEmpresa[1].precio[0].precio, 2) : comidasEmpresa[2].nombre.toLowerCase() === 'desayuno' ? $scope.number_format(comidasEmpresa[2].precio[0].precio, 2) : 'ERROR'), cubeX + 15 + 9 + 80, y + 7 + 70)
                doc.text((comidasEmpresa[0].nombre.toLowerCase() === 'almuerzo' ? $scope.number_format(comidasEmpresa[0].precio[0].precio, 2) : comidasEmpresa[1].nombre.toLowerCase() === 'almuerzo' ? $scope.number_format(comidasEmpresa[1].precio[0].precio, 2) : comidasEmpresa[2].nombre.toLowerCase() === 'almuerzo' ? $scope.number_format(comidasEmpresa[2].precio[0].precio, 2) : 'ERROR'), cubeX + 15 + 9 + 80, y + 7 + 90)
                doc.text((comidasEmpresa[0].nombre.toLowerCase() === 'cena' ? $scope.number_format(comidasEmpresa[0].precio[0].precio, 2) : comidasEmpresa[1].nombre.toLowerCase() === 'cena' ? $scope.number_format(comidasEmpresa[1].precio[0].precio, 2) : comidasEmpresa[2].nombre.toLowerCase() === 'cena' ? $scope.number_format(comidasEmpresa[2].precio[0].precio, 2) : 'ERROR'), cubeX + 15 + 9 + 80, y + 7 + 110)
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

            $scope.imprimirReporteEmpresa = function (reporte, gerencia, cabecera, comidasEmpresa, dollar, periodo) {
                var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
                var stream = doc.pipe(blobStream());
                var y = 190
                var itemsPorPagina = 20
                var items = 0
                var xSeparacion = 0
                var inicio_periodo;
                var final_periodo;
                if (periodo[0]) {
                    inicio_periodo = periodo[0].split('T')[0]
                }
                if (periodo[1]) {
                    final_periodo = periodo[1].split('T')[0]
                }
                var pagina = 1
                var cubeX = 70
                var totalPaginas = Math.ceil(1 / itemsPorPagina);
                $scope.cabeceraReporteEmpresa(reporte, doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase(), inicio_periodo, final_periodo);
                var total_general_desayuno = 0
                var total_general_almuerzo = 0
                var total_general_cena = 0
                var total_desayunos = 0
                var total_almuerzos = 0
                var total_cenas = 0
                var total_fueraHorario = 0
                for (var i = 0; i < reporte.length; i++) {
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
                        y = 190;
                        items = 0;
                        pagina = pagina + 1;
                        $scope.cabeceraReporteEmpresa(reporte, doc, pagina, totalPaginas, cabecera, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase(), inicio_periodo, final_periodo);
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

            $scope.imprimirReporteComensal = function (reporte, gerencia, cabecera, comidasEmpresa, dollar, periodo) {
                var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
                var stream = doc.pipe(blobStream());
                var y = 190
                var itemsPorPagina = 10
                var items = 0
                var xSeparacion = 0
                var pagina = 1
                var cubeX = 70
                var inicio_periodo;
                var final_periodo;
                if (periodo[0]) {
                    inicio_periodo = periodo[0].split('T')[0]
                }
                if (periodo[1]) {
                    final_periodo = periodo[1].split('T')[0]
                }
                var totalPaginas = Math.ceil(1 / itemsPorPagina);
                $scope.cabeceraReporteComensal(reporte.reporte, doc, pagina, totalPaginas, reporte, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase(), inicio_periodo, final_periodo);
                var total_general_desayuno = 0
                var total_general_almuerzo = 0
                var total_general_cena = 0
                var total_desayunos = 0
                var total_almuerzos = 0
                var total_cenas = 0
                for (var i = 0; i < reporte.reporte.length; i++) {
                    if (reporte.reporte[i].cena > 0) {
                        doc.font('Helvetica', 8).fill('black');
                        doc.text(reporte.reporte[i].cena, cubeX + 80 + 95 + 9, y + 7).fill('black');
                        doc.rect(cubeX + 310, y + 3, 80, 20).stroke('black');
                    }
                    if (reporte.reporte[i].almuerzo > 0) {
                        doc.font('Helvetica', 8).fill('black');
                        doc.text(reporte.reporte[i].almuerzo, cubeX + 80 + 175 + 9, y + 7).fill('black');
                        doc.rect(cubeX + 230, y + 3, 80, 20).stroke('black');
                    }
                    if (reporte.reporte[i].desayuno > 0) {
                        doc.font('Helvetica', 8).fill('black');
                        doc.text(reporte.reporte[i].desayuno, cubeX + 80 + 255 + 9, y + 7).fill('black');
                        doc.rect(cubeX + 150, y + 3, 80, 20).stroke('black');
                    }
                    var total_comensal = 0
                    doc.font('Helvetica', 8).fill('black');
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
                    doc.rect(cubeX, y + 3, 150, 20).stroke('black');
                    doc.rect(cubeX + 390, y + 3, 110, 20).stroke('black');
                    doc.text($scope.formatoFechaPDF(reporte.reporte[i].fecha), cubeX + 8, y + 7).fill('black');
                    doc.text(total_comensal, cubeX + 80 + 335 + 9, y + 7).fill('black');
                    if (reporte.reporte[i].cena === 0) {
                        doc.font('Helvetica', 8).fill('red');
                        doc.text('Falta', cubeX + 80 + 95 + 9, y + 7).fill('red');
                        doc.rect(cubeX + 310, y + 3, 80, 20).stroke('red');
                    }
                    if (reporte.reporte[i].almuerzo === 0) {
                        doc.font('Helvetica', 8).fill('red');
                        doc.text('Falta', cubeX + 80 + 175 + 9, y + 7).fill('red');
                        doc.rect(cubeX + 230, y + 3, 80, 20).stroke('red');
                    }
                    if (reporte.reporte[i].desayuno === 0) {
                        doc.font('Helvetica', 8).fill('red');
                        doc.text('Falta', cubeX + 80 + 255 + 9, y + 7).fill('red');
                        doc.rect(cubeX + 150, y + 3, 80, 20).stroke('red');
                    }
                    y = y + 20;
                    items++;
                    if (items > itemsPorPagina || (y > 700)) {
                        doc.addPage({ size: [612, 792], margin: 10 });
                        y = 190;
                        items = 0;
                        pagina = pagina + 1;
                        $scope.cabeceraReporteComensal(reporte.reporte, doc, pagina, totalPaginas, reporte, $scope.filtroComensales.empresaCliente ? $scope.filtroComensales.empresaCliente.razon_social ? $scope.filtroComensales.empresaCliente.razon_social : $scope.empresaExternaSeleccionada.razon_social : $scope.empresaExternaSeleccionada.razon_social, gerencia ? gerencia.nombre.toUpperCase() : 'Sin asignación.'.toUpperCase(), inicio_periodo, final_periodo);
                    }
                }
                doc.font('Helvetica', 8).fill('black');
                doc.text("Total general".toLocaleUpperCase(), cubeX + 6, y + 7).fill('black');
                doc.text(total_general_desayuno, cubeX + 80 + 95 + 9, y + 7).fill('black');
                doc.text(total_general_almuerzo, cubeX + 80 + 175 + 9, y + 7).fill('black');
                doc.text(total_general_cena, cubeX + 80 + 255 + 9, y + 7).fill('black');
                doc.text((total_general_desayuno + total_general_almuerzo + total_general_cena), cubeX + 80 + 335 + 9, y + 7).fill('black');
                doc.rect(cubeX, y + 3, 150, 20).stroke('black');
                doc.rect(cubeX + 150, y + 3, 80, 20).stroke('black');
                doc.rect(cubeX + 230, y + 3, 80, 20).stroke('black');
                doc.rect(cubeX + 310, y + 3, 80, 20).stroke('black');
                doc.rect(cubeX + 390, y + 3, 110, 20).stroke('black');
                y = y + 20;
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
            }

            $scope.cabeceraReporteComedor = function (reporte, doc, pagina, totalPaginas, cabecera, empresa, comedor, inicio_periodo, final_periodo) {
                var y = 150;
                var xSeparacion = 0
                var cubeX = 100
                var fecha_impresion = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()

                var inicial = new Date(inicio_periodo)
                var finalo = new Date(final_periodo)
                var dif = Math.floor(Math.abs(finalo - inicial) / 36e5);//(((finalo.getTime() - inicial.getTime()) / 1000) /60) /60
                var hoy = new Date()
                var fecha_inicial_reporte = new Date(reporte[0].fecha)
                var fecha_final_reporte = new Date(reporte[reporte.length - 1].fecha)
                // doc.rect(40, 40, 40, 40).fillAndStroke("silver", "#000");
                doc.font('Helvetica-Bold', 12)
                    .fill('black')
                doc.text("REPORTES DE COMEDOR " + comedor.toUpperCase() + ' ' + empresa.toUpperCase(), 150, 80, { width: 300, align: "center" });
                if (inicio_periodo && final_periodo) {
                    doc.text("PERIODO " + (dif < 745 ? $scope.meses[inicial.getMonth() + 1].nombre.toUpperCase() + '/' + inicial.getFullYear() : $scope.meses[inicial.getMonth() + 1].nombre.toUpperCase() + '/' + inicial.getFullYear() + ' A ' + $scope.meses[finalo.getMonth()].nombre.toUpperCase() + '/' + finalo.getFullYear()), 150, 120, { width: 300, align: "center" });
                } else if (!inicio_periodo && final_periodo) {
                    doc.text("PERIODO " + $scope.meses[fecha_inicial_reporte.getMonth()].nombre.toUpperCase() + '/' + finalo.getFullYear(), 150, 120, { width: 300, align: "center" });
                } else {
                    doc.text("PERIODO " + $scope.meses[fecha_inicial_reporte.getMonth()].nombre.toUpperCase() + '/' + fecha_inicial_reporte.getFullYear() + ' A ' + $scope.meses[fecha_final_reporte.getMonth()].nombre.toUpperCase() + '/' + fecha_final_reporte.getFullYear(), 150, 120, { width: 300, align: "center" });
                }

                doc.font('Helvetica-Bold', 8);
                cabecera.forEach(function (dato) {
                    doc.rect(cubeX + xSeparacion, y, 80, 20).stroke()
                    doc.text(dato, cubeX + xSeparacion + 9, y + 7);
                    xSeparacion += 80
                })
                doc.rect(cubeX + 130, y + 500, 130, 0).stroke()
                doc.text('Encargado', cubeX + 146 + 26, y + 510)
                doc.font('Helvetica', 8);
                if ($scope.imagenEmpresa) {
                    doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
                }
            }

            $scope.cabeceraReporteAlertasMarcacionesLista = function (doc, empresa, periodo, pagina, totalPaginas) {
                var y = 150;
                var x = 100
                var xSeparacion = 0
                var cubeX = 70
                doc.font('Helvetica', 6)
                    .fill('black')
                doc.text('Pag. ' + (pagina + ' de ' + totalPaginas), 560, 40);
                doc.font('Helvetica-Bold', 12)
                    .fill('black')
                doc.text(empresa.toLocaleUpperCase(), 260, 60);
                doc.font('Helvetica-Bold', 8);
                // doc.text(empresa.razon_social.toLocaleUpperCase(), 260, 60);
                doc.text("Cochambamba - Bolivia", 255, 80);
                doc.font('Helvetica-Bold', 8);
                doc.text("Del " + periodo, 255, 100);
                doc.text("Nro.", 70, 120);
                doc.text("comensal", 120, 120);
                doc.text("fecha", 320, 120);
                doc.text("Comida", 400, 120);
                doc.text("Estado", 500, 120);
                doc.rect(60, 115, 500, 20).stroke()

                // doc.text("ALMUERZO", 350 - 30, 140);
                // doc.text("CENA", 430 - 30, 140);
                // doc.text("TOTAL GENERAL", 510 - 30, 140);
                // doc.rect(cubeX - 20, 113, 170, 20).stroke()
                // doc.rect(cubeX + 150, 113, 350, 20).stroke()
                // // doc.rect(cubeX, 93, 150, 20).stroke()
                // // doc.rect(cubeX, 113, 150, 20).stroke()
                // // doc.rect(cubeX, 133, 150, 20).stroke()
                // // doc.rect(cubeX + 150, 73, 350, 20).stroke()
                // // doc.rect(cubeX + 150, 93, 350, 20).stroke()
                // // doc.rect(cubeX + 150, 113, 350, 20).stroke()
                // doc.rect(cubeX - 20, 133, 80, 20).stroke()
                // doc.rect(cubeX + 60, 133, 90, 20).stroke()
                // // doc.rect(cubeX + 50, 133, 80, 20).stroke()
                // doc.rect(cubeX + 150, 133, 80, 20).stroke()
                // doc.rect(cubeX + 230, 133, 80, 20).stroke()
                // doc.rect(cubeX + 310, 133, 80, 20).stroke()
                // doc.rect(cubeX + 390, 133, 110, 20).stroke()
                // doc.font('Helvetica', 8);
                if ($scope.imagenEmpresa) {
                    doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
                }
            }

            $scope.cabeceraReporteAlertasMarcacionesMatriz = function (doc, empresa, totalPaginas, cabecera, empresa, comedor) {
                var y = 150;
                var x = 100
                var xSeparacion = 0
                var cubeX = 70
                doc.font('Helvetica-Bold', 12)
                    .fill('black')
                doc.font('Helvetica-Bold', 8);
                doc.text("Alerta no Marcaciones".toLocaleUpperCase(), 260, 80);
                doc.text("Fecha", 60, 120);
                doc.text("Empresa", 60, 140);
                doc.text("Empleado", 134, 140);
                doc.text("DESAYUNO", 270 - 30, 140);
                doc.text("ALMUERZO", 350 - 30, 140);
                doc.text("CENA", 430 - 30, 140);
                doc.text("TOTAL GENERAL", 510 - 30, 140);
                doc.rect(cubeX - 20, 113, 170, 20).stroke()
                doc.rect(cubeX + 150, 113, 350, 20).stroke()
                // doc.rect(cubeX, 93, 150, 20).stroke()
                // doc.rect(cubeX, 113, 150, 20).stroke()
                // doc.rect(cubeX, 133, 150, 20).stroke()
                // doc.rect(cubeX + 150, 73, 350, 20).stroke()
                // doc.rect(cubeX + 150, 93, 350, 20).stroke()
                // doc.rect(cubeX + 150, 113, 350, 20).stroke()
                doc.rect(cubeX - 20, 133, 80, 20).stroke()
                doc.rect(cubeX + 60, 133, 90, 20).stroke()
                // doc.rect(cubeX + 50, 133, 80, 20).stroke()
                doc.rect(cubeX + 150, 133, 80, 20).stroke()
                doc.rect(cubeX + 230, 133, 80, 20).stroke()
                doc.rect(cubeX + 310, 133, 80, 20).stroke()
                doc.rect(cubeX + 390, 133, 110, 20).stroke()
                doc.font('Helvetica', 8);
                if ($scope.imagenEmpresa) {
                    doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
                }
            }

            $scope.cabeceraReporteEmpresa = function (reporte, doc, pagina, totalPaginas, cabecera, empresa, comedor, inicio_periodo, final_periodo) {
                var y = 40;
                var x = 100
                var xSeparacion = 0
                var cubeX = 70
                doc.font('Helvetica-Bold', 12)
                    .fill('black')
                doc.font('Helvetica-Bold', 8);
                doc.text("Empresa", 124, 80 + y);
                doc.text(empresa, 300, 80 + y);
                doc.text("Gerencia", 124, 100 + y);
                var fecha_impresion = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()

                var inicial = new Date(inicio_periodo)
                var finalo = new Date(final_periodo)
                var dif = Math.floor(Math.abs(finalo - inicial) / 36e5);//(((finalo.getTime() - inicial.getTime()) / 1000) /60) /60
                var hoy = new Date()
                var fecha_inicial_reporte = new Date(reporte[0].historial[0].fecha)
                var fecha_final_reporte = new Date(reporte[0].historial[reporte[0].historial.length - 1].fecha)
                if (comedor) {
                    doc.text(comedor.toUpperCase() === 'SIN ASIGNACIÓN.' ? 'TODAS' : comedor.toUpperCase(), 300, 100 + y);
                } else {
                    doc.text("TODAS", 300, 80 + y);
                }
                if (inicio_periodo && final_periodo) {
                    doc.text((dif < 745 ? $scope.meses[inicial.getMonth() + 1].nombre.toUpperCase() + '/' + inicial.getFullYear() : $scope.meses[inicial.getMonth() + 1].nombre.toUpperCase() + '/' + inicial.getFullYear() + ' A ' + $scope.meses[finalo.getMonth()].nombre.toUpperCase() + '/' + finalo.getFullYear()), 200, 120 + y, { width: 300, align: "center" });
                } else if (!inicio_periodo && final_periodo) {
                    doc.text($scope.meses[fecha_inicial_reporte.getMonth()].nombre.toUpperCase() + '/' + finalo.getFullYear(), 200, 120 + y, { width: 300, align: "center" });
                } else {
                    doc.text($scope.meses[fecha_inicial_reporte.getMonth()].nombre.toUpperCase() + '/' + fecha_inicial_reporte.getFullYear() + ' A ' + $scope.meses[fecha_final_reporte.getMonth()].nombre.toUpperCase() + '/' + fecha_final_reporte.getFullYear(), 200, 120 + y, { width: 300, align: "center" });
                }
                // doc.text("Periodo ", 300, 100+y);
                doc.text("Periodo", 124, 120 + y);
                doc.text("Empleado", 124, 140 + y);
                doc.text("DESAYUNO", 270 - 30, 140 + y);
                doc.text("ALMUERZO", 350 - 30, 140 + y);
                doc.text("CENA", 430 - 30, 140 + y);
                doc.text("TOTAL GENERAL", 510 - 30, 140 + y);
                doc.rect(cubeX, 73 + y, 150, 20).stroke()
                doc.rect(cubeX, 93 + y, 150, 20).stroke()
                doc.rect(cubeX, 113 + y, 150, 20).stroke()
                doc.rect(cubeX, 133 + y, 150, 20).stroke()
                doc.rect(cubeX + 150, 73 + y, 350, 20).stroke()
                doc.rect(cubeX + 150, 93 + y, 350, 20).stroke()
                doc.rect(cubeX + 150, 113 + y, 350, 20).stroke()
                doc.rect(cubeX + 150, 133 + y, 80, 20).stroke()
                doc.rect(cubeX + 230, 133 + y, 80, 20).stroke()
                doc.rect(cubeX + 310, 133 + y, 80, 20).stroke()
                doc.rect(cubeX + 390, 133 + y, 110, 20).stroke()
                doc.font('Helvetica', 8);
                if ($scope.imagenEmpresa) {
                    doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
                }
            }

            $scope.cabeceraReporteComensal = function (reporte, doc, pagina, totalPaginas, reporte, empresa, comedor, inicio_periodo, final_periodo) {
                var y = 40;
                var x = 100
                var xSeparacion = 0
                var cubeX = 70
                var fecha_impresion = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
                var inicial = new Date(inicio_periodo)
                var finalo = new Date(final_periodo)
                var dif = Math.floor(Math.abs(finalo - inicial) / 36e5);//(((finalo.getTime() - inicial.getTime()) / 1000) /60) /60
                var hoy = new Date()
                doc.font('Helvetica-Bold', 8)
                    .fill('black')
                var fecha_inicial_reporte = new Date(reporte.reporte[0].fecha)
                var fecha_final_reporte = new Date(reporte.reporte[reporte.reporte.length - 1].fecha)
                if (inicio_periodo && final_periodo) {
                    doc.text((dif < 745 ? $scope.meses[inicial.getMonth() + 1].nombre.toUpperCase() + '/' + inicial.getFullYear() : $scope.meses[inicial.getMonth() + 1].nombre.toUpperCase() + '/' + inicial.getFullYear() + ' A ' + $scope.meses[finalo.getMonth()].nombre.toUpperCase() + '/' + finalo.getFullYear()), 200, 120 + y, { width: 300, align: "center" });
                } else if (!inicio_periodo && final_periodo) {
                    doc.text($scope.meses[fecha_inicial_reporte.getMonth()].nombre.toUpperCase() + '/' + finalo.getFullYear(), 200, 120 + y, { width: 300, align: "center" });
                } else {
                    doc.text($scope.meses[fecha_inicial_reporte.getMonth()].nombre.toUpperCase() + '/' + fecha_inicial_reporte.getFullYear() + ' A ' + $scope.meses[fecha_final_reporte.getMonth()].nombre.toUpperCase() + '/' + fecha_final_reporte.getFullYear(), 200, 120 + y, { width: 300, align: "center" });
                }
                doc.font('Helvetica-Bold', 8);
                doc.text("Empleado", 124, 80 + y);
                doc.text(reporte.nombre.toUpperCase(), 300, 80 + y);
                doc.text(empresa, 300, 100 + y);
                doc.text("Empresa", 124, 100 + y);
                doc.text("Periodo", 124, 120 + y);
                doc.text("Empleado", 124, 140 + y);
                doc.text("DESAYUNO", 240, 140 + y);
                doc.text("ALMUERZO", 320, 140 + y);
                doc.text("CENA", 410, 140 + y);
                doc.text("TOTAL GENERAL", 490, 140 + y);
                doc.rect(cubeX, 73 + y, 150, 20).stroke()
                doc.rect(cubeX, 93 + y, 150, 20).stroke()
                doc.rect(cubeX, 113 + y, 150, 20).stroke()
                doc.rect(cubeX, 133 + y, 150, 20).stroke()
                doc.rect(cubeX + 150, 73 + y, 350, 20).stroke()
                doc.rect(cubeX + 150, 93 + y, 350, 20).stroke()
                doc.rect(cubeX + 150, 113 + y, 350, 20).stroke()
                doc.rect(cubeX + 150, 133 + y, 80, 20).stroke()
                doc.rect(cubeX + 230, 133 + y, 80, 20).stroke()
                doc.rect(cubeX + 310, 133 + y, 80, 20).stroke()
                doc.rect(cubeX + 390, 133 + y, 110, 20).stroke()
                doc.font('Helvetica', 8);
                if ($scope.imagenEmpresa) {
                    doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
                }
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
                $scope.activeModal = 2
                $scope.clienteEmpresaEdicionGerencias = {}
                $scope.clienteEmpresaEdicionGerencias.empresaCliente = Object.assign({}, $scope.empresaExternaSeleccionada)
                $scope.obtenerGerencias()
                $scope.abrirPopup($scope.modalEdicionGerencias);
            }
            $scope.cerrarModalEdicionGerencias = function () {
                $scope.activeModal = 0
                $scope.clienteEmpresaEdicionGerencias = {}
                $scope.cerrarPopup($scope.modalEdicionGerencias);
            }

            $scope.abrirModalEdicionComensales = function () {
                $scope.activeModal = 3
                $scope.clienteEmpresaEdicionComensales = {}
                $scope.clienteEmpresaEdicionComensales.empresaCliente = Object.assign({}, $scope.empresaExternaSeleccionada)
                $scope.obtenerGerencias()
                $scope.obtenerComensales()
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
                $scope.clienteEmpresaComidas.verTodos = false
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
                //             $scope.activeModal = 0
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
        }]);