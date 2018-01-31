angular.module('agil.controladores')
    .controller('controladorProformas', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage, Paginator, $timeout,
        blockUI, ClasesTipo, socket, ObtenerCambioMoneda, ClientesNit, Proformas, FiltroProformas, ActividadEmpresa, ActividadServicio, ActividadesEmpresa,
        ServiciosEmpresa, Proforma, ProformaInfo, Clientes, fechasProforma,eliminarProforma) {

        $scope.usuario = JSON.parse($localStorage.usuario);


        $scope.modalConfiguracionActividadesServicios = 'modalConfiguracionActividadesServicios'
        $scope.wizardConfiguracionActividadesServicios = 'modal-wizard-panel-container'
        $scope.modalConfiguracionActividades = 'modalConfiguracionActividades'
        $scope.wizardConfiguracionActividades = 'modal-wizard-panel-container-actividad'
        $scope.dialogProformaEdicion = 'proforma-edicion'
        $scope.dialogClientesProforma = 'dialog-cliente-proforma'
        $scope.dialogmodalFechas = 'modalFechas'
        
        $scope.$on('$viewContentLoaded', function () {
            ejecutarScriptsProformas($scope.modalConfiguracionActividadesServicios, $scope.wizardConfiguracionActividadesServicios, $scope.dialogProformaEdicion,
                $scope.dialogClientesProforma, $scope.modalConfiguracionActividades, $scope.wizardConfiguracionActividades, $scope.dialogmodalFechas);

        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.modalConfiguracionActividadesServicios);
            $scope.eliminarPopup($scope.dialogProformaEdicion);
            $scope.eliminarPopup($scope.dialogClientesProforma);
            $scope.eliminarPopup($scope.dialogmodalFechas);
        })
        $scope.eliminar= function(proforma){
            blockUI.start()
            proforma.eliminado = true
            eliminarProforma.save({id:proforma.id},proforma,function (res) {
                $scope.mostrarMensaje(res.mensaje)
                blockUI.stop()
            },function(err) {
                $scope.mostrarMensaje(err.message === undefined ? err.data : err.message)
                blockUI.stop()
            })
        }
        $scope.editar = function (proforma,ver) {
            blockUI.start()
            var dat = new Date(proforma.fecha_proforma)
            $scope.obtenerCambioMonedaProforma(dat)
            var prom = ProformaInfo(proforma.id)
            prom.then(function (proformaE) {
                $scope.proforma = proformaE.proforma
                if(ver!==undefined){
                    $scope.proforma.ver = true
                }
                if (proformaE.mensaje !== undefined) {
                    $scope.mostrarMensaje(proformaE.mensaje)
                } else {
                    $scope.proforma.fecha_proforma = $scope.fechaATexto(new Date($scope.proforma.fecha_proforma))
                    var dat = new Date($scope.convertirFecha($scope.proforma.fecha_proforma))
                    $scope.obtenerCambioMonedaProforma(dat)
                    var dolores = $scope.moneda.dolar
                    $scope.proforma.periodo_mes = { id: $scope.proforma.periodo_mes }
                    $scope.proforma.periodo_anio = { id: $scope.proforma.periodo_anio }

                    $scope.detallesProformas = $scope.proforma.detallesProformas
                    $scope.detallesProformas.map(function (det, i) {
                        $scope.detalleProforma = det
                        $scope.calcularImporte()
                        $scope.detalleProforma = undefined
                    })
                    $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
                    $scope.obtenerServiciosActividadEmpresa($scope.proforma.actividadEconomica)
                }
                blockUI.stop()
            }, function (err) {
                $scope.mostrarMensaje(err.message === undefined ? err.data : err.message)
                blockUI.stop()
            })
            $scope.detalleProforma = undefined
            $scope.abrirdialogProformaEdicion($scope.proforma)
        }
        $scope.ver = function(proforma) {
            $scope.proforma = proforma
            $scope.proforma.ver = true
            $scope.editar($scope.proforma,true)
            // $scope.abrirdialogProformaEdic/ion($scope.proforma)S
        }

        $scope.eliminarDetalleActividadEmpresa = function (actividad) {
            if (actividad.id !== undefined) {
                actividad.eliminado = true
            } else {
                $scope.actividadesEmpresa.splice($scope.actividadesEmpresa.indexOf(actividad), 1)
            }
            $scope.cerrarConfirmacionEliminacion();
        }
        $scope.getFecha = function () {
            if ($scope.proforma !== undefined) {
                return new Date($scope.proforma.fecha)
            } else {
                return new Date()
            }
        }

        $scope.actualizarPeriodo = function (date) {
            var fecha = new Date($scope.convertirFecha(date))
            $scope.obtenerCambioMonedaProforma(fecha)
            $scope.proforma.periodo_mes.id = fecha.getMonth() + 1
            $scope.proforma.periodo_anio.id = fecha.getFullYear()
        }
        $scope.buscarCliente = function (query) {
            if (query != "" && query != undefined) {
                var promesa = ClientesNit($scope.usuario.id_empresa, query);
                return promesa;
            }
        };
        $scope.establecerCliente = function (cliente) {
            $scope.proforma.clienteProforma = cliente;
            /*   $scope.enfocar('razon_social');
              $scope.capturarInteraccion(); */
        }
        $scope.enfocar = function (elemento) {
            $timeout(function () {
                $("#" + elemento).focus();
            }, 0);
        }
        $scope.filtrarProformasOperaciones = function (filtro,_) {
            for (var key in filtro) {
                if (filtro[key] === "" || filtro[key] === null) {
                    filtro[key] = 0
                }
            }
            
            if(_===undefined){
                $scope.obtenerProformas()
            }else{
                return filtro
            }
            
        }
        $scope.inicio = function () {
            $scope.actividadesEmpresa = []
            $scope.nActividad = {}
            $scope.proforma = {}
            $scope.configuracionActividadServicio = []
            $scope.servicios = []
            $scope.detalleProforma = {}
            $scope.detallesProformas = []
            $scope.obtenerClientes()
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.filtro = { empresa: $scope.usuario.empresa.id, mes: 0, anio: 0, sucursal: 0, actividadEconomica: 0, servicio: 0, monto: 0, razon: 0, usuario: "", pagina: 1, items_pagina: 10, busqueda: 0, numero: 0 }
            $scope.meses = [{ id: 1, nombre: "Enero" }, { id: 2, nombre: "Febrero" }, { id: 3, nombre: "Marzo" }, { id: 4, nombre: "Abril" }, { id: 5, nombre: "Mayo" }, { id: 6, nombre: "Junio" }, { id: 7, nombre: "Julio" }, { id: 8, nombre: "Agosto" },
            { id: 9, nombre: "Septiembre" }, { id: 10, nombre: "Octubre" }, { id: 11, nombre: "Noviembre" }, { id: 12, nombre: "Diciembre" }];

            var actual_year_diference = (new Date().getFullYear() - 1980)
            $scope.anios = Array.apply(null, Array(actual_year_diference + 1)).map(function (_, i) {
                var start_year = 1980
                var year = { id: start_year + i, nombre: start_year + i }
                return year
            })

            $scope.proformas = []
            $scope.sucursalesUsuario = "";
            for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
                $scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
                if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
                    $scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
                }
            }
            $scope.obtenerPaginador()
            $scope.obtenerCentroCosto()
        }

        $scope.actualizarFechas = function (proforma) {
            blockUI.start()
            if (proforma !== undefined) {
                proforma.fecha_recepcion = (proforma.fecha_recepcion instanceof Date) ? proforma.fecha_recepcion : (proforma.fecha_recepcion === null) ? null : new Date($scope.convertirFecha(proforma.fecha_recepcion))
                proforma.fecha_proforma_ok = (proforma.fecha_proforma_ok instanceof Date) ? proforma.fecha_proforma_ok : (proforma.fecha_proforma_ok === null) ? null : new Date($scope.convertirFecha(proforma.fecha_proforma_ok))
                proforma.fecha_factura = (proforma.fecha_factura instanceof Date) ? proforma.fecha_factura : (proforma.fecha_factura === null) ? null : new Date($scope.convertirFecha(proforma.fecha_factura))
                proforma.fecha_cobro = (proforma.fecha_cobro instanceof Date) ? proforma.fecha_cobro : (proforma.fecha_cobro === null) ? null : new Date($scope.convertirFecha(proforma.fecha_cobro))
                fechasProforma.save({ id: proforma.id }, proforma, function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrardialogmodalFechas()
                    blockUI.stop()
                }, function (err) {
                    $scope.mostrarMensaje(err.message === undefined ? err.data : err.message)
                    blockUI.stop()
                })
            }
        }

        // $scope.fechaCobroPop = {
        //     templateUrl: 'fechaCobro.html',
        //     title: 'Cuentas Axiliares',
        //     isOpen: false
        // };

        // $scope.modificarFechaCobro = function (proforma) {
        //     proforma.fecha_cobro = new Date()
        // }

        $scope.sinFuncionalidad = function (proforma) {
            // proforma.fecha_recepcion = new Date()
            $scope.mostrarMensaje('Sin funcionalidad')
        }

        $scope.agregardetalleProforma = function (detalleProforma) {
            $scope.proforma.totalImporteBs = 0
            $scope.proforma.totalImporteSus = 0
            var ser = { servicio: detalleProforma }
            $scope.detallesProformas.push(detalleProforma)
            $scope.detalleProforma = {}
            $scope.detallesProformas.forEach(function (proforma) {
                $scope.proforma.totalImporteBs += proforma.importeBs
                $scope.proforma.totalImporteSus += proforma.importeSus
            });
            $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
            if ($scope.detalleProforma.length > 0) {

            }
        }

        $scope.obtenerCambioMonedaProforma = function (fechaMoneda) {
            var promesa = ObtenerCambioMoneda(fechaMoneda)
            promesa.then(function (dato) {
                if (dato.monedaCambio) {
                    $scope.moneda = dato.monedaCambio;
                    if ($scope.detalleProforma !== undefined) {
                        $scope.calcularImporte()
                    }
                } else {
                    $scope.moneda = { ufv: "--", dolar: "--" }
                    $scope.mostrarMensaje('La fecha ' + $scope.proforma.fecha_proforma + ' no tiene datos del tipo de cambio de dolar. El tipo de cambio de dolar no afecta la información de la proforma y puede continuar sin problema.')
                }

            })
        }

        $scope.obtenerCentroCosto = function () {
            var promesa = ClasesTipo('CENCOS')
            promesa.then(function (dato) {
                $scope.centroCostos = dato.clases
            })
        }

        $scope.obtenerActividadesSucursal = function (idSucursal) {
            $scope.actividadesSucursal = [];
            // var promesa = ClasesTipo('ACTCOM')
            var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
            $scope.actividadesDosificaciones = sucursal.actividadesDosificaciones;
            // $scope.actividades=[];
            for (var i = 0; i < $scope.actividadesDosificaciones.length; i++) {
                $scope.actividadesSucursal.push($scope.actividadesDosificaciones[i].actividad);
            }
            // $scope.filtro.actividad = $scope.actividades.length == 1 ? $scope.actividades[0] : null;
        }

        $scope.obtenerActividades = function () {
            $scope.actividades = [];
            var promesa = ClasesTipo('ACTCOM')
            promesa.then(function (actividades) {
                $scope.actividades = actividades.clases
            })
            // var sucursal=$.grep($scope.sucursales, function(e){return e.id == idSucursal;})[0];
            // $scope.actividadesDosificaciones=sucursal.actividadesDosificaciones;
            // $scope.actividades=[];
            // for(var i=0;i<$scope.actividadesDosificaciones.length;i++){
            //     $scope.actividades.push($scope.actividadesDosificaciones[i].actividad);
            // }
            // $scope.filtro.actividad=$scope.actividades.length==1?$scope.actividades[0]:null;
        }

        $scope.obtenerPaginador = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "fecha";
            $scope.paginator.direccion = "asc";
            $scope.filtro = { empresa: $scope.usuario.empresa.id, mes: 0, anio: 0, sucursal: 0, actividadEconomica: 0, servicio: 0, monto: 0, razon: 0, usuario: 0,numero: 0 }
            $scope.paginator.filter = $scope.filtro
            $scope.paginator.callBack = $scope.obtenerProformas;
            $scope.paginator.getSearch("", $scope.filtro, null);
            $scope.filtro = { empresa: $scope.usuario.empresa.id, mes: "", anio: "", sucursal: "", actividadEconomica: "", servicio: "", monto: "", razon: "", usuario: "", numero:"" }
            blockUI.stop();
        }

        $scope.guardarConfiguracionActividadServicios = function (actividadServicios) {
            var button = $('#siguiente').text().trim();
            if (button != "Siguiente") {
                blockUI.start()
                $scope.nActividad = {}
                var toDrop = []
                var nuevosServicios = actividadServicios.map(function (_, i) {
                    if (_.id === undefined || _.eliminado) {
                        return _
                    } else {
                        toDrop.push(i)
                    }
                })
                toDrop.reverse().forEach(function (_) {
                    nuevosServicios.splice(_, 1)
                });

                if (nuevosServicios.length > 0) {
                    ActividadServicio.save({ id_empresa: $scope.usuario.empresa.id, id_actividad: 0 }, nuevosServicios, function (res) {
                        $scope.mostrarMensaje(res.mensaje)
                        blockUI.stop()
                        $scope.cerrarConfiguracionActividadesServicios()
                    }, function (err) {
                        $scope.mostrarMensaje(err.data)
                        blockUI.stop()
                        $scope.cerrarConfiguracionActividadesServicios()
                    })
                } else {
                    blockUI.stop()
                    $scope.cerrarConfiguracionActividadesServicios()
                }
            }
        }

        $scope.buscarservicio = function (query) {
            if (query != "" && query != undefined) {
                if ($scope.configuracionActividadServicio.length > 0) {
                    var promesa = $filter('filter')($scope.configuracionActividadServicio, query);
                    console.log(promesa)
                    return promesa;
                } else {
                    if ($scope.proforma !== undefined) {
                        if ($scope.proforma.actividadEconomica !== undefined) {
                            $scope.mostrarMensaje('No hay servicios en la actividad seleccionada: "' + $scope.proforma.actividadEconomica.claseActividad.nombre + '"')
                        }
                    }
                }
            }
        }

        $scope.establecerservicio = function (servico) {
            $scope.detalleProforma = { id_servicio: servico.id, cantidad: 1, servicio: servico, precio_unitario: servico.precio, actividad_id: servico.actividad.id, actividad: servico.actividad }
            $scope.detalleProforma.importeBs = $scope.detalleProforma.precio_unitario * $scope.detalleProforma.cantidad
            if ($scope.moneda !== undefined) {
                if ($scope.moneda.dolar !== null && $scope.moneda.dolar !== "--") {
                    $scope.detalleProforma.precioSus = $scope.detalleProforma.precio_unitario / $scope.moneda.dolar

                    $scope.detalleProforma.importeSus = $scope.detalleProforma.precio_unitario / $scope.moneda.dolar * $scope.detalleProforma.cantidad
                }
            }
            $scope.enfocar('cantidad');
        }

        $scope.calcularImporte = function () {
            $scope.detalleProforma.importeBs = $scope.detalleProforma.precio_unitario * $scope.detalleProforma.cantidad
            if ($scope.moneda !== undefined) {
                if ($scope.moneda.dolar !== null && $scope.moneda.dolar !== "--") {
                    $scope.detalleProforma.precioSus = $scope.detalleProforma.precio_unitario / $scope.moneda.dolar

                    $scope.detalleProforma.importeSus = $scope.detalleProforma.precio_unitario / $scope.moneda.dolar * $scope.detalleProforma.cantidad
                }
            }
        }

        $scope.agregarDetalleActividadServicio = function (actividadServicio) {
            if (actividadServicio !== undefined) {
                var err = false
                if (actividadServicio.actividadEconomica === undefined) {
                    err = true
                }
                if (actividadServicio.servicio === undefined) {
                    err = true
                } else {
                    if (actividadServicio.servicio.codigo === undefined || actividadServicio.servicio.nombre === undefined || actividadServicio.servicio.precio === undefined) {
                        err = true
                    } else if (actividadServicio.servicio.codigo === "" || actividadServicio.servicio.nombre === "" || actividadServicio.servicio.precio === "") {
                        err = true
                    }
                }
                if (!err) {
                    var check = $scope.buscarservicio(actividadServicio.servicio.nombre)
                    if (check !== undefined) {
                        if (check.length < 1) {
                            var service = { id: actividadServicio.id, actividad: actividadServicio.actividadEconomica, codigo: actividadServicio.servicio.codigo, nombre: actividadServicio.servicio.nombre, precio: actividadServicio.servicio.precio }
                            $scope.configuracionActividadServicio.push(service)
                        } else {
                            var encontrado = false
                            check.map(function (ser) {
                                if (ser.nombre === actividadServicio.servicio.nombre) {
                                    encontrado = true
                                    $scope.mostrarMensaje('El servicio ya fue asignado a esta actividad')
                                }
                                if (ser.codigo === actividadServicio.servicio.codigo) {
                                    encontrado = true
                                    $scope.mostrarMensaje('El codigo del servicio ya esta en uso')
                                }
                            })
                            if (!encontrado) {
                                var service = { id: actividadServicio.id, actividad: actividadServicio.actividadEconomica, codigo: actividadServicio.servicio.codigo, nombre: actividadServicio.servicio.nombre, precio: actividadServicio.servicio.precio }
                                $scope.configuracionActividadServicio.push(service)
                            }
                        }
                    } else {
                        var service = { id: actividadServicio.id, actividad: actividadServicio.actividadEconomica, codigo: actividadServicio.servicio.codigo, nombre: actividadServicio.servicio.nombre, precio: actividadServicio.servicio.precio }
                        $scope.configuracionActividadServicio.push(service)
                    }
                } else {
                    $scope.mostrarMensaje('Revise los datos e intente de nuevo.')
                }
            }
        }
        $scope.filtrarClientes = function (query) {
            $scope.clientesProcesados = $filter('filter')($scope.clientes, query);
            // setTimeout(function () {
            // 	aplicarSwiper(4, 3, true, 2);
            // }, 5);
        }
        $scope.guardarConfiguracionActividadEconomicas = function () {
            blockUI.start()
            if ($scope.actividadesEmpresa.length > 0) {
                var toDrop = []
                var nuevasActividades = $scope.actividadesEmpresa.map(function (_, i) {
                    if (_.id === undefined || _.eliminado) {
                        return _
                    } else {
                        toDrop.push(i)
                    }
                })
                toDrop.reverse().forEach(function (_) {
                    nuevasActividades.splice(_, 1)
                });
                if (nuevasActividades.length > 0) {
                    ActividadEmpresa.save({ id_empresa: $scope.usuario.empresa.id }, nuevasActividades, function (res) {
                        $scope.mostrarMensaje(res.mensaje)
                        $scope.actividadesEmpresa = undefined
                        var prom = ActividadesEmpresa($scope.usuario.empresa.id)
                        prom.then(function (activities) {
                            $scope.actividadesEmpresa = activities.actividades
                            console.log($scope.actividadesEmpresa)
                            if (activities.mensaje !== undefined) {
                                $scope.mostrarMensaje(activities.mensaje)
                            }
                            blockUI.stop()
                            $scope.cerrarConfiguracionActividades()
                        }).catch(function (err) {
                            $scope.mostrarMensaje(err.message === undefined ? err.data : err.message)
                            blockUI.stop()
                            $scope.cerrarConfiguracionActividades()
                        })
                    }, function (err) {
                        blockUI.stop()
                        $scope.mostrarMensaje(err.data)
                        $scope.cerrarConfiguracionActividades()
                    })
                } else {
                    blockUI.stop()
                    $scope.cerrarConfiguracionActividades()
                }
            } else {
                blockUI.stop()
                $scope.mostrarMensaje('Ingrese al menos 1 actividad para guardar.')
            }
        }

        $scope.obtenerServiciosActividadEmpresa = function (actividad,op) {
            if (actividad.id !== undefined) {
                var prom = ServiciosEmpresa($scope.usuario.empresa.id, actividad.id)
                prom.then(function (services) {
                    if (op!==undefined) {
                        $scope.filser = services.servicios
                    }else{
                        $scope.configuracionActividadServicio = services.servicios
                    }
                    if (services.mensaje !== undefined) {
                        $scope.mostrarMensaje(services.mensaje)
                    }
                }, function (err) {
                    $scope.mostrarMensaje(err.data)
                })
            }
        }

        $scope.agregarDetalleActividadEmpresa = function (actividad) {
            if (actividad.id !== undefined) {
                var act = { claseActividad: actividad, id_empresa: $scope.usuario.empresa.id }
                $scope.actividadesEmpresa.push(act)
            }

        }

        $scope.eliminarDetalleConfiguracion = function (servicio) {
            if (servicio.id !== undefined) {
                servicio.eliminado = true
            } else {
                $scope.configuracionActividadServicio.splice($scope.configuracionActividadServicio.indexOf(servicio), 1)
            }
            $scope.cerrarConfirmacionEliminacion();
        }

        $scope.buscarCliente = function (query) {
            if (query != "" && query != undefined) {
                var promesa = ClientesNit($scope.usuario.id_empresa, query);
                return promesa;
            }
        }
        $scope.seleccionarClienteProforma = function (client) {
            $scope.proforma.clienteProforma = client
        }
        $scope.obtenerClientes = function () {
            var prom = Clientes($scope.usuario.id_empresa);
            prom.then(function (cls) {
                $scope.clientes = cls
                $scope.clientesProcesados = cls
            }, function (err) {
                $scope.mostrarMensaje(err.message)
            })

            // $scope.clientesProcesados = $scope.clientes
        }
        $scope.obtenerProformas = function () {
            blockUI.start()
            $scope.filtro = $scope.filtrarProformasOperaciones($scope.filtro,true)
            $scope.paginator.filter = $scope.filtro
            var prom = FiltroProformas($scope.paginator)
            prom.then(function (res) {
                $scope.proformas = res.proformas
                $scope.paginator.setPages(res.count)
                if (res.mensaje !== undefined) {
                    $scope.mostrarMensaje(res.mensaje)
                }
                $scope.filtro = { empresa: $scope.usuario.empresa.id, mes: "", anio: "", sucursal: "", actividad: "", servicio: "", monto: "", razon: "", usuario: "", numero:""}
            }, function (err) {
                $scope.mostrarMensaje(err.data)
            })
            blockUI.stop()
        }
        $scope.guardarProforma = function (valid, proforma) {
            blockUI.start()
            var filtro = { id_empresa: $scope.usuario.empresa.id, mes: 0, anio: 0, sucursal: 0, actividad: 0, servicio: 0, monto: 0, razon: 0, usuario: $scope.usuario.id, pagina: 1, items_pagina: 10, busqueda: 0, numero:0 }
            if (valid) {
                if (proforma.id !== undefined) {
                    proforma.detallesProformas = $scope.detallesProformas
                    proforma.usuarioProforma = $scope.usuario
                    proforma.id_empresa = $scope.usuario.empresa.id
                    proforma.fecha_proforma = new Date($scope.convertirFecha(proforma.fecha_proforma))
                    Proforma.update({ id: proforma.id }, proforma, function (res) {
                        $scope.mostrarMensaje(res.mensaje)
                        if (res.hasErr === undefined) {
                            $scope.cerrardialogProformaEdicion()
                        } else {
                            proforma.fecha_proforma = $scope.fechaATexto(proforma.fecha_proforma)
                        }

                        blockUI.stop()
                    }, function (err) {
                        $scope.mostrarMensaje(err.message === undefined ? err.data : err.message)
                        blockUI.stop()
                    })
                } else {
                    proforma.id_empresa = $scope.usuario.empresa.id
                    proforma.detallesProformas = $scope.detallesProformas
                    proforma.usuarioProforma = $scope.usuario
                    proforma.fecha_proforma = new Date($scope.convertirFecha(proforma.fecha_proforma))
                    Proformas.save(filtro, proforma, function (res) {
                        $scope.mostrarMensaje(res.mensaje)
                        if (res.hasErr === undefined) {
                            $scope.cerrardialogProformaEdicion()
                        } else {
                            proforma.fecha_proforma = $scope.fechaATexto(proforma.fecha_proforma)
                        }
                        blockUI.stop()
                    }, function (err) {
                        $scope.mostrarMensaje(err.message === undefined ? err.data : err.message)
                        blockUI.stop()
                    })
                }
            } else {
                $scope.mostrarMensaje('Falta rellenar algún campo requerido.')
                blockUI.stop()
            }

        }
        $scope.fechaATexto = function (fecha) {
            fech = new Date(fecha)
            fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
            return fecha
        }

        $scope.abrirdialogProformaEdicion = function (proforma) {

            if (proforma !== undefined) {
                $scope.detalleProforma = undefined
            } else {
                $scope.proforma = { sucursalProforma: $scope.sucursales[0], fecha_proforma: new Date(), periodo_mes: { id: new Date().getMonth() + 1 }, periodo_anio: { id: new Date().getFullYear() } }
                $scope.proforma.fecha_proforma = new Date().toLocaleDateString()
                $scope.obtenerCambioMonedaProforma(new Date())
                $scope.detalleProforma = undefined
            }
            $scope.detalleProforma = {}
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.abrirPopup($scope.dialogProformaEdicion);
        }

        $scope.cerrardialogProformaEdicion = function () {
            // $scope.nActividad = {}
            // $scope.configuracionActividadServicio = []
            $scope.proforma.ver = undefined
            $scope.filtrarProformasOperaciones($scope.filtro)
            $scope.detallesProformas = []
            $scope.proforma = {}
            $scope.obtenerProformas()
            $scope.cerrarPopup($scope.dialogProformaEdicion);
        }

        $scope.abrirConfiguracionActividadesServicios = function () {
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.abrirPopup($scope.modalConfiguracionActividadesServicios);
        }

        $scope.abrirdialogClientesProforma = function () {

            $scope.abrirPopup($scope.dialogClientesProforma);
        }

        $scope.cerrardialogClientesProforma = function () {
            // $scope.nActividad = {}
            // $scope.configuracionActividadServicio = []
            $scope.cerrarPopup($scope.dialogClientesProforma);
        }

        $scope.obtenerActividadesEmpresa = function (idEmpresa) {
            var prom = ActividadesEmpresa(idEmpresa)
            var toDrop = []
            prom.then(function (actividades) {
                $scope.actividadesEmpresa = actividades.actividades
                if ($scope.actividades !== undefined) {
                    $scope.actividades.map(function (act, i) {
                        $scope.actividadesEmpresa.map(function (_) {
                            if (act.id == _.claseActividad.id) {
                                toDrop.push(i)
                            }
                        })
                        toDrop.forEach(function (_, i) {
                            $scope.actividades.splice(i, 1)
                        });
                    })
                }
            }, function (err) {
                $scope.mostrarMensaje(err.data)
            })
        }

        $scope.abrirConfiguracionActividades = function () {
            $scope.obtenerActividades()
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.abrirPopup($scope.modalConfiguracionActividades);
        }

        $scope.cerrarConfiguracionActividades = function () {
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.cerrarPopup($scope.modalConfiguracionActividades);
        }
        $scope.abrirdialogmodalFechas = function (proforma, opcion) {
            $scope.proforma = proforma
            $scope.abrirPopup($scope.dialogmodalFechas);
            if ($scope.proforma.fecha_recepcion !== null) {
                var fec = new Date($scope.proforma.fecha_recepcion).toLocaleDateString()
                $scope.proforma.fecha_recepcion = (fec === 'Invalid Date')?new Date($scope.convertirFecha($scope.proforma.fecha_recepcion)).toLocaleDateString():fec
            }
            if ($scope.proforma.fecha_factura !== null) {
                var fec = new Date($scope.proforma.fecha_factura).toLocaleDateString()
                $scope.proforma.fecha_factura = (fec === 'Invalid Date')?new Date($scope.convertirFecha($scope.proforma.fecha_factura)).toLocaleDateString():fec
            }
            if ($scope.proforma.fecha_proforma_ok !== null) {
                var fec = new Date($scope.proforma.fecha_proforma_ok).toLocaleDateString()
                $scope.proforma.fecha_proforma_ok =(fec === 'Invalid Date')?new Date($scope.convertirFecha($scope.proforma.fecha_proforma_ok)).toLocaleDateString():fec
            }
            if ($scope.proforma.fecha_cobro !== null) {
                $scope.proforma.fecha_cobro = (fec === 'Invalid Date')?new Date($scope.convertirFecha($scope.proforma.fecha_cobro)).toLocaleDateString():fec
            }
            
        }

        $scope.cerrardialogmodalFechas = function () {
            $scope.cerrarPopup($scope.dialogmodalFechas);
        }
        $scope.cerrarConfiguracionActividadesServicios = function () {
            $scope.nActividad = {}
            $scope.configuracionActividadServicio = []
            $scope.cerrarPopup($scope.modalConfiguracionActividadesServicios);
        }
        $scope.PopoverConfiguracionActividad = {
            templateUrl: 'PopoverConfiguracionActividad.html',
            title: 'Cuentas Axiliares',
            isOpen: false
        };
        $scope.impresiones = {
            templateUrl: 'impresiones.html',
            title: 'Cuentas Axiliares',
            isOpen: false
        };
        $scope.imprimir = function (proforma, opcionImpresion) {
            blockUI.start();
            var prom = ProformaInfo(proforma.id)
            prom.then(function (proformaE) {
                $scope.proforma = proformaE.proforma
                if (proformaE.mensaje !== undefined) {
                    $scope.mostrarMensaje(proformaE.mensaje)
                } else {
                    $scope.proforma.fecha_proforma = $scope.fechaATexto(new Date($scope.proforma.fecha_proforma))
                    var dat = new Date($scope.convertirFecha($scope.proforma.fecha_proforma))
                    $scope.obtenerCambioMonedaProforma(dat)

                }
                if (opcionImpresion == 0) {
                    $scope.imprimirSinDetalle($scope.proforma)
                }
                if (opcionImpresion == 1) {
                    $scope.imprimirConDetalle($scope.proforma)
                }
                if (opcionImpresion == 2) {
                    $scope.imprimirMixto($scope.proforma)
                }
                blockUI.stop()
            }, function (err) {
                $scope.mostrarMensaje(err.message === undefined ? err.data : err.message)
                blockUI.stop()
            })
        }
        $scope.imprimirMixto = function (proforma) {

            var importeTotal = 0
            var cantidadTotal = 0
            $scope.proforma = proforma
            var doc = new PDFDocument({ size: [612, 792], margin: 10 });
            var img = convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                return imagenEmpresa;
            });

            // if ($scope.usuario.empresa.imagen.length > 100) {
            //     doc.image(img, 60, 60, { width: 50, height: 50 });
            // } else {
            //     doc.image(img, 60, 60);  ///{ width: 40 }
            // }
            var separacionExtra = 50



            var stream = doc.pipe(blobStream());
            var fechaActual = new Date();
            var x = 80
            doc.font('Helvetica', 8);
            var y = 115 + 80 + separacionExtra, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma);
            var extraDetalle = 0
            var extraServ = 0
            for (var i = 0; i <= $scope.proforma.detallesProformas.length && items <= itemsPorPagina; i++) {
                doc.font('Helvetica', 8);
                if (i == 0) {
                    doc.text(($scope.proforma.detalle), 150, y - 2, { width: 260 });
                    extraDetalle = Math.ceil($scope.proforma.detalle.length / 260) * 20
                } else {
                    doc.text($scope.proforma.detallesProformas[i - 1].cantidad, 70, y - 2);
                    doc.text($scope.proforma.detallesProformas[i - 1].servicio.nombre, 150, y - 2, { width: 260 });
                    doc.text($scope.number_format($scope.proforma.detallesProformas[i - 1].precio_unitario, 2), 440, y - 2);
                    doc.text($scope.number_format($scope.proforma.detallesProformas[i - 1].importeBs, 2), 510, y - 2);
                    // doc.rect(40, y + 10, 540, 0).stroke();
                }

                y = y + 20 + extraDetalle;
                importeTotal += (i === 1) ? $scope.proforma.importeBs : 0
                cantidadTotal += (i === 1) ? $scope.proforma.cantidad : 0
                items++;
                extraDetalle = 0
                extraServ = 0
                if (items > itemsPorPagina || y > 730) {
                    // doc.rect(40, 105 + 80, 540, y - 115 - 80).stroke();
                    // doc.rect(40, 105 + 80, 540, y - 115 - 70).stroke();
                    // doc.rect(x + 40, x+separacionExtra + 80, 0, y - 90 - 70).stroke();
                    // doc.rect(x + 350, x + 80, 0, y - 90 - 70).stroke();
                    // doc.rect(x + 410, x + 80, 0, y - 90 - 70).stroke();
                    doc.rect(40, 105 + 80 + separacionExtra, 540, y - 160 - separacionExtra - 25).stroke();//|_|
                    doc.rect(x + 40, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); //cant | det
                    doc.rect(x + 350, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke();// det| punit
                    doc.rect(x + 410, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); // punit | import
                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 115 + 80 + separacionExtra;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma);
                }
            }

            doc.rect(40, 105 + 80 + separacionExtra, 540, y - 160 - separacionExtra - 25).stroke();//|_|
            doc.rect(x + 40, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); //cant | det
            doc.rect(x + 350, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke();// det| punit
            doc.rect(x + 410, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); // punit | import

            doc.rect(x - 40, y + 10, 540, 25).stroke(); // cuadro literal
            $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
            doc.text('Son : ' + ($scope.proforma.importeLiteral), 58, y + 20);
            doc.text($scope.number_format($scope.proforma.totalImporteBs, 2), 510, y + 20);
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();

        }
        $scope.imprimirConDetalle = function (proforma) {

            var importeTotal = 0
            var cantidadTotal = 0
            $scope.proforma = proforma
            var doc = new PDFDocument({ size: [612, 792], margin: 10 });
            var img = convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                return imagenEmpresa;
            });
            var separacionExtra = 50

            // if ($scope.usuario.empresa.imagen.length > 100) {
            //     doc.image(img, 60, 60, { width: 50, height: 50 });
            // } else {
            //     doc.image(img, 60, 60);  ///{ width: 40 }
            // }



            var stream = doc.pipe(blobStream());
            var fechaActual = new Date();
            var x = 80
            doc.font('Helvetica', 8);
            var y = 115 + 80 + separacionExtra, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma);
            var extraServ = 0
            for (var i = 0; i < $scope.proforma.detallesProformas.length && items <= itemsPorPagina; i++) {
                doc.font('Helvetica', 8);
                // if (i ==0) {
                //     doc.text(($scope.proforma.detalle), 150, y-2, { width: 260 });
                // }else{

                doc.text($scope.proforma.detallesProformas[i].cantidad, 70, y - 2);
                doc.text($scope.proforma.detallesProformas[i].servicio.nombre, 150, y - 2, { width: 260 });
                doc.text($scope.number_format($scope.proforma.detallesProformas[i].precio_unitario, 2), 440, y - 2);
                doc.text($scope.number_format($scope.proforma.detallesProformas[i].importeBs, 2), 510, y - 2);
                // doc.rect(40, y + 10, 540, 0).stroke();
                // }
                if ($scope.proforma.detallesProformas[i].servicio.nombre.length > 260) {
                    extraServ = Math.ceil($scope.proforma.detallesProformas[i].servicio.nombre.length / 260) * 10
                }

                y = y + 20 + extraServ;
                importeTotal += (i === 1) ? $scope.proforma.importeBs : 0
                cantidadTotal += (i === 1) ? $scope.proforma.cantidad : 0
                items++;
                extraServ = 0
                if (items > itemsPorPagina || y > 700) {
                    // doc.rect(40, 105 + 80, 540, y - 115 - 80).stroke();
                    // doc.rect(40, 105 + 80, 540, y - 115 - 70).stroke();
                    // doc.rect(x + 40, x + 80, 0, y - 90 - 70).stroke();
                    // doc.rect(x + 350, x + 80, 0, y - 90 - 70).stroke();
                    // doc.rect(x + 410, x + 80, 0, y - 90 - 70).stroke();
                    doc.rect(40, 105 + 80 + separacionExtra, 540, y - 160 - separacionExtra - 25).stroke();
                    doc.rect(x + 40, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); //cant | det
                    doc.rect(x + 350, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke();// det| punit
                    doc.rect(x + 410, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke();
                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 115 + 80 + separacionExtra;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma);
                }
            }

            doc.rect(40, 105 + 80 + separacionExtra, 540, y - 160 - separacionExtra - 25).stroke();
            doc.rect(x + 40, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); //cant | det
            doc.rect(x + 350, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke();// det| punit
            doc.rect(x + 410, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); // punit | import
            doc.rect(x - 40, y + 10, 540, 25).stroke(); // cuadro literal
            $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
            doc.text('Son : ' + ($scope.proforma.importeLiteral), 58, y + 20);
            doc.text($scope.number_format($scope.proforma.totalImporteBs, 2), 510, y + 20);
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();

        }
        $scope.imprimirSinDetalle = function (proforma) {

            var importeTotal = 0
            var cantidadTotal = 0
            $scope.proforma = proforma
            var doc = new PDFDocument({ size: [612, 792], margin: 10 });
            var img = convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                return imagenEmpresa;
            });

            // if ($scope.usuario.empresa.imagen.length > 100) {
            //     doc.image(img, 60, 60, { width: 50, height: 50 });
            // } else {
            //     doc.image(img, 60, 60);  ///{ width: 40 }
            // }


            var separacionExtra = 50
            var stream = doc.pipe(blobStream());
            var fechaActual = new Date();
            var x = 80
            doc.font('Helvetica', 8);
            var y = 195 + separacionExtra, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma);

            // for (var i = 0; i < $scope.proforma.detallesProformas.length - 1 && items <= itemsPorPagina; i++) {
            doc.font('Helvetica', 8);
            var cant = 0
            $scope.proforma.detallesProformas.map(function (_) {
                cant += _.cantidad
            })
            doc.text(cant, 70, y - 2);
            doc.text(($scope.proforma.detalle), 150, y - 2, { width: 260 });
            extraDetalle = Math.ceil($scope.proforma.detalle.length / 260) * 20
            doc.text($scope.number_format($scope.proforma.detallesProformas[0].precio_unitario, 2), 440, y - 2);
            doc.text($scope.number_format($scope.proforma.detallesProformas[0].importeBs * cant, 2), 510, y - 2)
            // doc.rect(40, y + 20, 540, 0).stroke();
            y = y + 20 + extraDetalle;

            doc.rect(40, 105 + 80 + separacionExtra, 540, y - 160 - separacionExtra - 25).stroke();
            doc.rect(x + 40, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); //cant | det
            doc.rect(x + 350, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke();// det| punit
            doc.rect(x + 410, x + 80 + separacionExtra, 0, y - 160 - separacionExtra).stroke(); // punit | import
            doc.rect(x - 40, y + 10, 540, 25).stroke(); // cuadro literal
            $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
            doc.text('Son : ' + ($scope.proforma.importeLiteral), 58, y + 20);
            doc.text($scope.number_format($scope.proforma.totalImporteBs, 2), 510, y + 20);
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();

        }

        $scope.dibujarCabeceraPDFImpresion = function (doc, pagina, totalPaginas, proforma) {
            var yCabecera = 80;
            var yEspacio = 10;
            var separacionExtra = 50
            var fecha = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            doc.rect(40, 80 + 80 + separacionExtra, 540, 25).fillAndStroke("silver", "#000");
            doc.font('Helvetica-Bold', 12)
                .fill('black')
            doc.text("PROFORMA", 0, 80 + separacionExtra, { align: "center" });
            doc.font('Helvetica-Bold', 8);
            doc.font('Helvetica', 8);
            doc.font('Helvetica-Bold', 8);
            doc.font('Helvetica', 8);
            doc.text($scope.usuario.empresa.telefono1, 80, 60 + separacionExtra);
            doc.text($scope.usuario.empresa.direccion + ' Santa Cruz', 40, 70 + separacionExtra, { width: 90 });
            // doc.text(, 40, 80 + separacionExtra,{ width: 90 });

            doc.text('Santa Cruz,     ', 65, 115 + separacionExtra, { lineBreak: false }).font('Helvetica-Bold', 10).text(fecha.split('/')[0], { lineBreak: false }).font('Helvetica', 10).text('   de   ', { lineBreak: false }).font('Helvetica-Bold', 10).text($scope.meses[new Date($scope.convertirFecha(fecha)).getMonth()].nombre, { lineBreak: false }).font('Helvetica', 10).text('   de   ', { lineBreak: false }).font('Helvetica-Bold', 10).text(fecha.split('/')[2])
            doc.font('Helvetica-Bold', 8);
            doc.font('Helvetica', 8);
            doc.font('Helvetica-Bold', 14);
            doc.text("N°", 380, 60, { align: "center" });
            doc.text(proforma.id, 510, 60);
            doc.rect(40, 80 + 80 + separacionExtra, 540, 25).stroke()
                .fill('silver')
            doc.rect(0, 0, 0, 0).stroke()
                .fill('black')
            doc.font('Helvetica-Bold', 8);
            doc.text("CANTIDAD", 55, 90 + yCabecera + separacionExtra);
            doc.text("DETALLE", 200, 90 + yCabecera + separacionExtra);
            doc.text("P.UNIT", 440, 90 + yCabecera + separacionExtra);
            doc.text("IMPORTE BS", 510, 90 + yCabecera + separacionExtra);
            doc.text("Señor (es):", 50, 143 + separacionExtra);
            doc.text("CI/NIT:", 440, 145 + separacionExtra);
            doc.text("Teléfono:", 40, 60 + separacionExtra);
            doc.font('Helvetica', 8);
            doc.text(proforma.clienteProforma.razon_social, 100, 143 + separacionExtra);
            // doc.text(" ", 120, 100);
            // doc.text(proforma.clienteProforma.razon_social, 100, 110);
            doc.text(proforma.clienteProforma.nit, 500, 145 + separacionExtra);
            // doc.text(proforma.clienteProforma.telefono1, 240, 120);
            // doc.text(proforma.clienteProforma.direccion, 80, 130);
            doc.rect(40, 110 + separacionExtra, 540, 20).stroke();
            doc.rect(40, 135 + separacionExtra, 540, 20).stroke();
        }
        $scope.inicio()
    })