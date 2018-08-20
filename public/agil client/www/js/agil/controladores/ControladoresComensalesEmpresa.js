angular.module('agil.controladores')

    .controller('controladorComensalesEmpresa', function ($scope, $timeout, $localStorage, $location, blockUI, Clientes, ClientesNit, GuardarAlias, ObtenerAlias, GuardarGerencias, ObtenerGerencias, GuardarComensales, ObtenerComensales, GuardarComidas, ObtenerComidas, GuardarPrecioComidas, ObtenerPrecioComidas, GuardarHistorialExcel, GuardarComensalesExcel, ObtenerHistorial) {

        $scope.modalEdicionAlias = 'modalAliasEmpresasCliente'
        $scope.modalEdicionGerencias = 'modalGerenciaEmpresasCliente'
        $scope.modalEdicionComensales = 'modalComensalesEmpresasCliente'
        $scope.modalEdicionComidas = 'modalComidasEmpresasCliente'
        $scope.modalEdicionPrecios = 'modalPreciosComidasEmpresasCliente'
        $scope.dialogClienteEmpresa = 'dialog-cliente-empresa'
        var redirectProformas;

        // listaAliasclientesEmpresas
        // listaGerenciasClienteEmpresa

        $scope.$on('$viewContentLoaded', function () {
            if (redirectProformas) {
                $timeout(function () {
                    $location.path('/proformas')
                    // blockUI.stop()
                }, 5000)
                return
            }
            ejecutarScriptsComensales($scope.modalEdicionAlias, $scope.modalEdicionGerencias, $scope.modalEdicionComensales, $scope.modalEdicionComidas, $scope.modalEdicionPrecios, $scope.dialogClienteEmpresa);
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
            }
        });

        $scope.inicio = function () {
            blockUI.start()
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
            $scope.listaAliasclientesEmpresa = []
            $scope.listaComensalesclienteEmpresa = []
            $scope.listaGerenciasClienteEmpresa = []
            $scope.listaComidasclienteEmpresa = []
            $scope.listaPrecioComidasclienteEmpresa = []
            $scope.obtenerClientes()
            $scope.obtenerGerencias()
            $scope.obtenerHistoriales()
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

        $scope.filtrarClientes = function (query) {
            $scope.clientesProcesados = $filter('filter')($scope.clientes, query);
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
                    break;
                case 3:
                    if (!$scope.clienteEmpresaEdicionComensales) {
                        $scope.clienteEmpresaEdicionComensales = {}
                    }
                    $scope.clienteEmpresaEdicionComensales.empresaCliente = Object.assign({}, cliente)
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
                    break;
                default:
                    $scope.mostrarMensaje('Ocurrio un error al asignar')
            }
        }

        $scope.seleccionarcliente = function (cliente) {
            switch ($scope.activeModal) {
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
                    break;
                case 3:
                    if (!$scope.clienteEmpresaEdicionComensales) {
                        $scope.clienteEmpresaEdicionComensales = {}
                    }
                    $scope.clienteEmpresaEdicionComensales.empresaCliente = Object.assign({}, cliente)
                    break;
                case 4:
                    if (!$scope.clienteEmpresaComidas) {
                        $scope.clienteEmpresaComidas = {}
                    }
                    $scope.clienteEmpresaComidas.empresaCliente = Object.assign({}, cliente)
                    break;
                case 5:
                    if (!$scope.clienteEmpresaPreciosComidas) {
                        $scope.clienteEmpresaPreciosComidas = {}
                    }
                    $scope.clienteEmpresaPreciosComidas.empresaCliente = Object.assign({}, cliente)
                    $scope.obtenerComidas(true)
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
                prom = ObtenerGerencias($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaEdicionComensales.empresaCliente.id )
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
                prom = ObtenerComensales($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaEdicionComensales.empresaCliente.id )
            } else {
                prom = ObtenerComensales($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
            }
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.listaComensalesclienteEmpresa = res.lista
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
                prom = ObtenerComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaPreciosComidas.empresaCliente.id )
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
                prom = ObtenerPrecioComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.clienteEmpresaPreciosComidas.empresaCliente.id )
            } else {
                prom = ObtenerPrecioComidas($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
            }
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.listaPreciosComidasclienteEmpresa = res.lista
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.obtenerHistoriales = function () {
            var prom = ObtenerHistorial($scope.usuario.id_empresa, $scope.usuario.id, $scope.empresaExternaSeleccionada.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    res.mostrarMensaje(res.mensaje)
                } else {
                    $scope.historialesComedor = res.historial
                }
            })
        }

        $scope.subirExcelHistorial = function (event) {
            blockUI.start();
            var files = event.target.files;
            var i, f;
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
                        Historial.push(comensal);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    blockUI.stop();
                    $scope.guardarHistorialExcel(Historial);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.subirExcelComensales = function (event) {
            blockUI.start();
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
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
                    $scope.guardarComensalesExcel(comensales);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.extraerFechaExcel = function (datoFecha) {
            var horas = datoFecha.split(' ')[datoFecha.split(' ').length -1]
            var fecha = datoFecha.split(' ')[0].split('/').reverse()
            if (horas.indexOf('AM')>0) {
                horas = horas.split('A')[0].split(':')
            } else if(horas.indexOf('PM')>0){
                horas = horas.split('P')[0].split(':')
                horas[0] = (parseInt(horas[0])+12) + ''
            }
            var fechaCompleta = new Date(fecha[0], fecha[2] -1, fecha[1], horas[0], horas[1], horas[2])
            return fechaCompleta
        }

        $scope.guardarComensalesExcel = function (comensales) {
            if (comensales.length > 0) {
                var prom = GuardarComensalesExcel($scope.usuario.id_empresa, comensales, $scope.usuario.id)
                prom.then(function (res) {
                    $scope.obtenerComensales()
                    if (!res.hasErr) {
                        if (res.mensajes) {
                            $scope.mostrarMensaje(res.mensaje + res.mensajes)
                        }else{
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    }else{
                        $scope.mostrarMensaje(res.mensajes)
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            }else{
                $scope.mostrarMensaje('Sin cambios.')
            }
        }

        $scope.guardarHistorialExcel = function (Historial) {
            var datos = []
            if (Historial.length > 0) {
                Historial.forEach(function (comensal) {
                    if (!datos.some(function(dato){
                        var fdato = $scope.extraerFechaExcel(dato.fecha_hora)
                        var fcomensal = $scope.extraerFechaExcel(comensal.fecha_hora)
                        dato.fecha = $scope.extraerFechaExcel(dato.fecha_hora)
                        if(!dato.fecha){
                           console.log(dato)
                        }
                        var diffSec = (fcomensal - fdato) / 1000
                        if (diffSec < 0) {
                            diffSec *= -1
                        }
                        // var hrs = ~~(diff / 3600);
                        // var mins = ~~((diff % 3600) / 60);
                        // var secs = diff % 60;
                        if (!(dato.tarjeta === comensal.tarjeta && dato.nombre === comensal.nombre && diffSec > 60)) {
                            return false
                        } else {
                            return true
                        }
                    })) {
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
                        }else{
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    }else{
                        $scope.mostrarMensaje(res.mensajes)
                    }
                }).catch(function (err) {
                    var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })
            }else{
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
            }else{
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
                }else{
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
            }else{
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
            }else{
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
                }else{
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
                        comida.inicio = new Date(0,0,0,comida.inicio.getHours(),comida.inicio.getMinutes(),0).toLocaleTimeString('es-ES')
                        comida.final = new Date(0,0,0,comida.final.getHours(),comida.final.getMinutes(),0).toLocaleTimeString('es-ES')
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
            }else{
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
            }else{
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

        $scope.abrirModalEdicionAlias = function () {
            $scope.obtenerAliasEmpresa()
            $scope.activeModal = 1
            $scope.abrirPopup($scope.modalEdicionAlias);
        }
        $scope.cerrarModalEdicionAlias = function () {
            $scope.clienteEmpresaAsignacionAlias = {}
            // $scope.listaAliasclientesEmpresa = []
            $scope.cerrarPopup($scope.modalEdicionAlias);
        }
        $scope.abrirModalEdicionGerencias = function () {
            $scope.obtenerGerencias()
            $scope.activeModal = 2
            $scope.abrirPopup($scope.modalEdicionGerencias);
        }
        $scope.cerrarModalEdicionGerencias = function () {
            $scope.clienteEmpresaEdicionGerencias = {}
            $scope.cerrarPopup($scope.modalEdicionGerencias);
        }
        $scope.abrirModalEdicionComensales = function () {
            $scope.obtenerGerencias()
            $scope.obtenerComensales()
            $scope.activeModal = 3
            $scope.abrirPopup($scope.modalEdicionComensales);
        }
        $scope.cerrarModalEdicionComensales = function () {
            $scope.clienteEmpresaEdicionComensales = {}
            $scope.cerrarPopup($scope.modalEdicionComensales);
        }
        $scope.abrirModalEdicionComidas = function () {
            $scope.obtenerComidas()
            $scope.activeModal = 4
            $scope.abrirPopup($scope.modalEdicionComidas);
        }
        $scope.cerrarModalEdicionComidas = function () {
            $scope.clienteEmpresaComidas = {}
            $scope.cerrarPopup($scope.modalEdicionComidas);
        }
        $scope.abrirModalEdicionPrecios = function () {
            $scope.activeModal = 5
            $scope.obtenerComidas()
            $scope.abrirPopup($scope.modalEdicionPrecios);
        }
        $scope.cerrarModalEdicionPrecios = function () {
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
            $scope.cerrarPopup($scope.dialogClienteEmpresa);
        }

        $scope.inicio()
    });