angular.module('agil.controladores')
    .controller('controladorProformas', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage, Paginator, $timeout,
        blockUI, ClasesTipo, socket, ObtenerCambioMoneda, ClientesNit, Proformas, FiltroProformas, ActividadEmpresa, ActividadServicio, ActividadesEmpresa,
        ServiciosEmpresa, Proforma, ProformaInfo, Clientes, fechasProforma, eliminarProforma, ListaSucursalesActividadesDosificacionEmpresa, DosificacionesDisponibles,
        Sucursales, ListaSucursalesUsuario, ListaHistorialActividad, ImprimirSalida, ConfiguracionesFacturasProformas, ProformasFacturadas) {

        $scope.usuario = JSON.parse($localStorage.usuario);


        $scope.modalConfiguracionActividadesServicios = 'modalConfiguracionActividadesServicios'
        $scope.wizardConfiguracionActividadesServicios = 'modal-wizard-panel-container'
        $scope.modalConfiguracionActividades = 'modalConfiguracionActividades'
        $scope.wizardConfiguracionActividades = 'modal-wizard-panel-container-actividad'
        $scope.dialogProformaEdicion = 'proforma-edicion'
        $scope.dialogClientesProforma = 'dialog-cliente-proforma'
        $scope.dialogmodalFechas = 'modalFechas'
        $scope.dialogBusquedaServicio = 'dialog-Busqueda-servicio-proforma'
        $scope.dialogDosificacionesDisponibles = 'dialog-dosificaciones-disponibles'
        $scope.confirmarDosificacion = 'dialog-dosificar-actividad'

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsProformas($scope.modalConfiguracionActividadesServicios, $scope.wizardConfiguracionActividadesServicios, $scope.dialogProformaEdicion,
                $scope.dialogClientesProforma, $scope.modalConfiguracionActividades, $scope.wizardConfiguracionActividades, $scope.dialogmodalFechas,
                $scope.dialogBusquedaServicio, $scope.dialogDosificacionesDisponibles, $scope.confirmarDosificacion);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.modalConfiguracionActividadesServicios);
            $scope.eliminarPopup($scope.dialogProformaEdicion);
            $scope.eliminarPopup($scope.modalConfiguracionActividades);
            $scope.eliminarPopup($scope.dialogClientesProforma);
            $scope.eliminarPopup($scope.dialogmodalFechas);
            $scope.eliminarPopup($scope.dialogBusquedaServicio)
            $scope.eliminarPopup($scope.dialogDosificacionesDisponibles)
            $scope.eliminarPopup($scope.confirmarDosificacion)
        })

        $scope.calcularTotalProformas = function () {
            $scope.totalProformas = 0
            var hoy = new Date();
            var dolarActual = { ufv: "--", dolar: "--" }
            $scope.totalProformasDolar = 0
            var promesa = ObtenerCambioMoneda(new Date())
            promesa.then(function (res) {
                $scope.totalProformas = 0
                for (var i = 0; i < $scope.proformas.length; i++) {
                    $scope.totalProformas += $scope.proformas[i].totalImporteBs
                    $scope.totalProformasDolar = $scope.totalProformas / res.monedaCambio.dolar
                }
            }, function (err) {
                $scope.mostrarMensaje('Hubo un problema al recuperar el cambio de dolar para ' + hoy.toLocaleDateString)
            })
        }

        $scope.obtenerHistorialActividad = function (actividad) {
            if (actividad.id !== undefined) {
                var prom = ListaHistorialActividad(actividad.actividad.id, actividad.id_sucursal)
                prom.then(function (res) {
                    $scope.historialActividad = res.historial
                })
            }
        }

        $scope.verificarBloqueoServicios = function () {
            if (($scope.proformaFechas !== undefined)) {
                if ($scope.proformaFechas.ver !== undefined) {
                    return true
                } else {
                    return false
                }

            } else {
                return false
            }
        }
        $scope.eliminar = function (proforma) {
            blockUI.start()
            proforma.eliminado = true
            eliminarProforma.save({ id: proforma.id }, proforma, function (res) {
                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.mostrarMensaje(res.mensaje)
                    });
                }, 500);

                $scope.proformas.splice($scope.proformas.indexOf(proforma), 1)
                blockUI.stop()
            }, function (err) {
                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)
                    });
                }, 500);
                blockUI.stop()
            })
        }
        $scope.editar = function (proforma, ver) {
            var dfecha = new Date(proforma.fecha_factura)
            if (proforma.fecha_factura !== null && proforma.fecha_factura !== undefined) {
                if (Object.prototype.toString.call(dfecha) === "[object Date]") {
                    // it is a date
                    if (isNaN(dfecha.getTime())) {  // d.valueOf() could also work
                        // date is not valid
                        $scope.mostrarMensaje('Hay un problema con la fecha de la factura. Se bloqueará la edición de esta proforma.')
                        return
                    }
                    else {
                        // date is valid
                        $scope.mostrarMensaje('Esta proforma no se puede editar, ya fué facturada.')
                        return
                    }
                }
            }
            blockUI.start()
            var dat = new Date(proforma.fecha_proforma)
            $scope.obtenerCambioMonedaProforma(dat)
            var prom = ProformaInfo(proforma.id, proforma.actividadEconomica.id)
            prom.then(function (proformaE) {
                $scope.proforma = proformaE.proforma
                $scope.proforma.sucursal = proformaE.proforma.sucursal
                $scope.obtenerActividadesSucursal($scope.proforma.sucursal.id)
                $scope.proforma.actividadEconomica = proformaE.proforma.actividadEconomica
                $scope.obtenerServiciosActividadEmpresaPrincipal($scope.proforma.actividadEconomica)
                if (ver !== undefined) {
                    $scope.proforma.ver = true
                }
                if (proformaE.mensaje !== undefined) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.mostrarMensaje(proformaE.mensaje)
                        });
                    }, 500);

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
                    // $scope.obtenerServiciosActividadEmpresaPrincipal($scope.proforma.actividadEconomica)
                }
                blockUI.stop()
            }, function (err) {
                $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)
                blockUI.stop()
            })
            $scope.detalleProforma = undefined
            $scope.abrirdialogProformaEdicion($scope.proforma)
        }
        $scope.ver = function (proforma) {
            $scope.proforma = proforma
            $scope.proforma.ver = true
            $scope.editar($scope.proforma, true)
        }

        $scope.mostarMensajeConfirmacionEliminacionActividad = function (actividad) {
            $scope.abrirPopupConfirmacionEliminacion($scope.eliminarDetalleActividadEmpresa, actividad)
        }

        $scope.imprimirFactura = function (proforma) {
            if (proforma.fecha_factura == null) {
                $scope.mostrarMensaje('La proforma aún no ha sido facturada.')
                return
            }
            blockUI.start()
            var paraFacturar = [proforma]
            var datosProformas = []
            var prom = ProformasFacturadas($scope.usuario.id_empresa, proforma.factura)
            prom.then(function (res) {
                datosProformas = res.datosProformas
                var movimiento = {}
                var promConfigFact = ConfiguracionesFacturasProformas($scope.usuario.id_empresa)
                promConfigFact.then(function (configuracionFactura) {
                    var promMov = ClasesTipo('MOVEGR')
                    promMov.then(function (dato) {
                        dato.clases.map(function (clase) {
                            if (clase.nombre == "FACTURACIÓN" && clase.nombre_corto == "FACT") {
                                movimiento = clase
                            }
                        })
                        var promesa = ClasesTipo("TIPA");
                        promesa.then(function (entidad) {
                            $scope.tiposPago = entidad.clases;
                            // if (i === paraFacturar.length - 1) {
                            $scope.facturaProformas = {}
                            $scope.facturaProformas.configuracion = configuracionFactura.configuracion
                            $scope.facturaProformas.movimiento = movimiento
                            $scope.facturaProformas.cliente = datosProformas[0].cliente
                            $scope.facturaProformas.autorizacion = datosProformas[0].autorizacion
                            $scope.facturaProformas.factura = datosProformas[0].factura
                            $scope.facturaProformas.codigo_control = datosProformas[0].codigo_control
                            $scope.facturaProformas.fecha = new Date(datosProformas[0].fecha_factura)
                            $scope.facturaProformas.fecha_limite_emision = new Date(datosProformas[0].fecha_limite_emision)
                            // $scope.facturaProformas.actividadEconomica = datosProformas[0].actividadEconomica
                            $scope.facturaProformas.actividad = datosProformas[0].actividadEconomica
                            $scope.facturaProformas.sucursal = datosProformas[0].sucursal
                            $scope.facturaProformas.detallesVenta = []
                            $scope.facturaProformas.detalle = ""
                            $scope.facturaProformas.totalImporteBs = datosProformas[0].totalImporteBs
                            $scope.facturaProformas.importe = datosProformas[0].importe
                            $scope.facturaProformas.fecha_factura = new Date(datosProformas[0].fecha_factura).toLocaleDateString()
                            $scope.facturaProformas.fechaTexto = new Date($scope.facturaProformas.fecha).toLocaleDateString()
                            $scope.facturaProformas.periodo_mes = datosProformas[0].mes
                            $scope.facturaProformas.periodo_anio = datosProformas[0].anio
                            $scope.facturaProformas.datosProformas = datosProformas
                            $scope.facturaProformas.descripcion = ""
                            $scope.facturaProformas.movimiento = movimiento
                            $scope.facturaProformas.id_movimiento = $scope.facturaProformas.movimiento.id
                            $scope.facturaProformas.id_tipo_pago = $scope.tiposPago[0].id
                            $scope.facturaProformas.tipoPago = $scope.tiposPago[1]
                            $scope.obtenerTipoEgreso($scope.facturaProformas.movimiento)
                            $scope.esContado = false
                            $scope.facturaProformas.usar_servicios = true
                            $scope.facturaProformas.id_usuario = $scope.usuario.id
                            $scope.facturaProformas.fecha = datosProformas[0].fecha
                            $scope.facturaProformas.id_empresa = $scope.usuario.id_empresa
                            $scope.facturaProformas.datosProformas.forEach(function (proforma, i) {
                                $scope.facturaProformas.descripcion += proforma.detalle + ". "
                                // $scope.facturaProformas.totalImporteBs += proforma.totalImporteBs
                                $scope.facturaProformas.importe = 0
                                $scope.facturaProformas.total = 0
                                // $scope.facturaProformas.importeLiteral = ConvertirALiteral($scope.facturaProformas.totalImporteBs.toFixed(2));
                                // $scope.facturaProformas.numero_literal = $scope.facturaProformas.importeLiteral
                                var promesa = ObtenerCambioMoneda(proforma.fecha_proforma)
                                var tcProforma = { ufv: "--", dolar: "--" }
                                promesa.then(function (dato) {
                                    if (dato.monedaCambio) {
                                        tcProforma = { ufv: dato.monedaCambio.ufv, dolar: dato.monedaCambio.dolar };
                                    }
                                    proforma.tc = tcProforma
                                    // proforma.importe = proforma.importeTotalBs
                                    proforma.detallesProformas.map(function (det, y) {
                                        $scope.facturaProformas.importe += det.precio_unitario * det.cantidad
                                        $scope.facturaProformas.detallesVenta.push(det)
                                        $scope.facturaProformas.total = $scope.facturaProformas.importe
                                        $scope.facturaProformas.importeLiteral = ConvertirALiteral($scope.facturaProformas.importe.toFixed(2));
                                        $scope.facturaProformas.numero_literal = $scope.facturaProformas.importeLiteral
                                        det.tc = proforma.tc
                                        det.total = det.importe * det.cantidad
                                        if (y === proforma.detallesProformas.length - 1) {
                                            // Array.prototype.push.apply($scope.facturaProformas.detallesVenta, proforma.detallesProformas);
                                            if (i == $scope.facturaProformas.datosProformas.length - 1) {
                                                if ($scope.checkResourceImg($scope.usuario.empresa.imagen, $scope.usuario.empresa.imageLoaded)) {
                                                    convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                                                        $scope.usuario.empresa.imagen = imagenEmpresa
                                                        $scope.usuario.empresa.imageLoaded = true
                                                        ImprimirSalida("FACT", $scope.facturaProformas, false, $scope.usuario)
                                                    })
                                                } else {
                                                    $scope.mostrarMensaje('Existe un problema con la imagen, no se incluira en la impresión.')
                                                    $timeout(function () {
                                                        ImprimirSalida("FACT", $scope.facturaProformas, false, $scope.usuario)
                                                    }, 1500)
                                                }
                                                // convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                                                //     $scope.usuario.empresa.imagen = imagenEmpresa
                                                //     ImprimirSalida("FACT", $scope.facturaProformas, false, $scope.usuario)
                                                // })


                                            }
                                            $scope.dolarActual = $scope.obtenerCambioDolarActual()
                                        }
                                    })
                                    // blockUI.stop()
                                })
                            });
                            blockUI.stop()
                            // }
                            // paraFacturar.map(function (proforma, i) {
                            //     var prom = ProformaInfo(proforma.id, proforma.id_actividad)
                            //     prom.then(function (porformaConsultada) {
                            //         datosProformas.push(porformaConsultada.proforma)

                            //     }, function (err) {
                            //         $scope.mostrarMensaje(err.message)
                            //         blockUI.stop()
                            //     })
                            // })
                        });

                    })
                })
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.eliminarDetalleActividadEmpresa = function (actividad) {
            if (actividad.id !== undefined) {
                actividad.eliminado = true
            } else {
                $scope.actividadesSucursal.splice($scope.actividadesSucursal.indexOf(actividad), 1)
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

        $scope.editarServicio = function (servicio) {
            servicio.editado = true
            $scope.nActividad.actividadEconomica.actividad = servicio.actividad
            $scope.nActividad.servicio = servicio

        }
        $scope.modificarProformaPrecioUnitarioServicio = function (detalle) {
            if (detalle.editarPrecio === undefined) {
                detalle.editarPrecio = true
            } else {
                detalle.editarPrecio = undefined
            }
        }
        $scope.actualizarPeriodo = function (date) {
            var fecha = new Date($scope.convertirFecha(date))
            $scope.obtenerCambioMonedaProforma(fecha)
            $scope.proforma.periodo_mes.id = fecha.getMonth()
            $scope.proforma.periodo_anio.id = fecha.getFullYear()
        }
        $scope.buscarCliente = function (query) {
            if (query != "" && query != undefined) {
                var promesa = ClientesNit($scope.usuario.id_empresa, query);
                return promesa;
            }
        }

        $scope.establecerCliente = function (cliente) {
            $scope.proforma.cliente = cliente;
        }

        $scope.enfocar = function (elemento) {
            $timeout(function () {
                $("#" + elemento).focus();
            }, 0);
        }

        $scope.inicio = function () {
            $scope.actividadesSucursal = []
            $scope.nActividad = {}
            $scope.proforma = {}
            $scope.configuracionActividadServicio = []
            $scope.servicios = []
            $scope.detalleProforma = {}
            $scope.detallesProformas = []
            $scope.obtenerClientes()
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.filtro = { empresa: $scope.usuario.empresa.id, mes: 0, anio: 0, sucursal: 0, actividadEconomica: 0, servicio: 0, monto: 0, razon: 0, usuario: "", pagina: 1, items_pagina: 10, busqueda: 0, numero: 0 }
            $scope.meses = [{ id: 0, nombre: "Enero" }, { id: 1, nombre: "Febrero" }, { id: 2, nombre: "Marzo" }, { id: 3, nombre: "Abril" }, { id: 4, nombre: "Mayo" }, { id: 5, nombre: "Junio" }, { id: 6, nombre: "Julio" }, { id: 7, nombre: "Agosto" },
            { id: 8, nombre: "Septiembre" }, { id: 9, nombre: "Octubre" }, { id: 10, nombre: "Noviembre" }, { id: 11, nombre: "Diciembre" }];
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

        $scope.verificarFechaRecepcion = function (fecha_recepcion) {
            if (fecha_recepcion !== null && fecha_recepcion !== undefined) {
                return false
            } else {
                return true
            }
        }

        $scope.verificarFechaProformaOk = function (fecha_proforma_ok) {
            if (fecha_proforma_ok !== null && fecha_proforma_ok !== undefined) {
                return false
            } else {
                return true
            }
        }

        $scope.verificarFechaFactura = function (fecha_factura) {
            if (fecha_factura !== null && fecha_factura !== undefined) {
                return false
            } else {
                return true
            }
        }

        $scope.actualizarFechas = function (proforma) {
            blockUI.start()
            if (proforma !== undefined) {
                proforma.fecha_recepcion = (proforma.fecha_recepcion instanceof Date) ? proforma.fecha_recepcion : (proforma.fecha_recepcion === null) ? null : new Date($scope.convertirFecha(proforma.fecha_recepcion))
                proforma.fecha_proforma_ok = (proforma.fecha_proforma_ok instanceof Date) ? proforma.fecha_proforma_ok : (proforma.fecha_proforma_ok === null) ? null : new Date($scope.convertirFecha(proforma.fecha_proforma_ok))
                proforma.fecha_factura = (proforma.fecha_factura instanceof Date) ? proforma.fecha_factura : (proforma.fecha_factura === null) ? null : new Date($scope.convertirFecha(proforma.fecha_factura))
                proforma.fecha_cobro = (proforma.fecha_cobro instanceof Date) ? proforma.fecha_cobro : (proforma.fecha_cobro === null) ? null : new Date($scope.convertirFecha(proforma.fecha_cobro))
                fechasProforma.save({ id: proforma.id }, proforma, function (res) {
                    $scope.proforma = undefined
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrardialogmodalFechas()
                    $scope.recargarItemsTabla()
                    blockUI.stop()
                }, function (err) {
                    $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)
                    blockUI.stop()
                })
            }
        }

        $scope.sinFuncionalidad = function () {
            $scope.mostrarMensaje('Sin funcionalidad')
        }

        $scope.agregardetalleProforma = function (detalleProforma) {
            if (detalleProforma.id_servicio !== undefined) {
                $scope.proforma.totalImporteBs = 0
                $scope.proforma.totalImporteSus = 0
                var ser = { servicio: detalleProforma }
                $scope.detallesProformas.push(detalleProforma)
                $scope.detalleProforma = {}
                $scope.detallesProformas.forEach(function (detalle) {
                    if (!detalle.eliminado) {
                        $scope.proforma.totalImporteBs += detalle.importe
                        $scope.proforma.totalImporteSus += detalle.importeSus
                    }
                });
                $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
                $scope.modificarProformaPrecioUnitarioServicio(detalleProforma)
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
            var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
            $scope.actividadesDosificaciones = sucursal.actividadesDosificaciones;
            $scope.actividadesSucursal = [];
            $scope.actividadesDosificaciones.map(function (actividad) {
                if (actividad.dosificacion) {
                    if (!actividad.expirado && !actividad.dosificacion.expirado) {
                        $scope.actividadesSucursal.push(actividad.actividad)
                    } else {
                        $scope.dosificacionesExpiradas = true
                    }
                }
            })
        }

        $scope.obtenerActividadesGral = function () {
            $scope.actividades = [];
            var promesa = ClasesTipo('ACTCOM')
            promesa.then(function (actividades) {
                $scope.actividades = actividades.clases
            })
        }

        $scope.obtenerPaginador = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "fecha";
            $scope.paginator.direccion = "asc";
            $scope.filtro = { empresa: $scope.usuario.empresa.id, mes: 0, anio: 0, sucursal: 0, actividadEconomica: 0, servicio: 0, monto: 0, razon: 0, usuario: 0, numero: 0 }
            $scope.paginator.filter = $scope.filtro
            $scope.paginator.callBack = $scope.obtenerProformas;
            $scope.paginator.getSearch("", $scope.filtro, null);
            $scope.filtro = { empresa: $scope.usuario.empresa.id, mes: "", anio: "", sucursal: "", actividadEconomica: "", servicio: "", monto: "", razon: "", usuario: "", numero: "" }
            blockUI.stop();
        }

        $scope.guardarConfiguracionActividadServicios = function (actividadServicios) {
            var button = $('#siguiente').text().trim();
            if (button != "Siguiente") {
                blockUI.start()
                $scope.nActividad = {}
                var toDrop = []
                var nuevosServicios = actividadServicios.map(function (_, i) {
                    if (_.id === undefined || _.eliminado || _.editado !== undefined) {
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
                        $scope.obtenerSucursales();
                        blockUI.stop()
                        $scope.cerrarConfiguracionActividadesServicios()
                    }, function (err) {
                        $scope.mostrarMensaje(err.stack)
                        blockUI.stop()
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
                    return promesa;
                } else {
                    if ($scope.proforma !== undefined) {
                        if ($scope.proforma.actividadEconomica !== undefined) {
                            $scope.mostrarMensaje('No hay servicios en la actividad seleccionada: "' + $scope.proforma.actividadEconomica.nombre + '"')
                        }
                    }
                }
            }
        }

        $scope.establecerservicio = function (servico, modal) {
            $scope.detalleProforma = { id_servicio: servico.id, cantidad: 1, servicio: servico, precio_unitario: servico.precio, actividad_id: servico.actividad.id, actividad: servico.actividad }
            $scope.detalleProforma.importe = $scope.detalleProforma.precio_unitario * $scope.detalleProforma.cantidad
            if ($scope.moneda !== undefined) {
                if ($scope.moneda.dolar !== null && $scope.moneda.dolar !== "--") {
                    $scope.detalleProforma.precioSus = $scope.detalleProforma.precio_unitario / $scope.moneda.dolar

                    $scope.detalleProforma.importeSus = $scope.detalleProforma.precio_unitario / $scope.moneda.dolar * $scope.detalleProforma.cantidad
                }
            }
            $scope.enfocar('cantidad');
            if (modal !== undefined) {
                $scope.cerrarBusquedaServiciosProforma()
            }
        }

        $scope.calcularImporte = function (sus) {
            if (sus === undefined) {
                $scope.detalleProforma.importe = $scope.detalleProforma.precio_unitario * $scope.detalleProforma.cantidad
                if ($scope.moneda !== undefined) {
                    if ($scope.moneda.dolar !== null && $scope.moneda.dolar !== "--") {
                        $scope.detalleProforma.precioSus = $scope.detalleProforma.precio_unitario / $scope.moneda.dolar
                        $scope.detalleProforma.importeSus = $scope.detalleProforma.precio_unitario / $scope.moneda.dolar * $scope.detalleProforma.cantidad
                    }
                }
            } else {
                $scope.detalleProforma.importeSus = $scope.detalleProforma.precioSus * $scope.detalleProforma.cantidad
                if ($scope.moneda !== undefined) {
                    if ($scope.moneda.dolar !== null && $scope.moneda.dolar !== "--") {
                        $scope.detalleProforma.precio_unitario = $scope.detalleProforma.precioSus * $scope.moneda.dolar
                        $scope.detalleProforma.importe = $scope.detalleProforma.precioSus * $scope.moneda.dolar * $scope.detalleProforma.cantidad
                    }
                }
            }
        }

        $scope.eliminarDetalleActividadEmpresa

        $scope.agregarDetalleActividadServicio = function (actividadServicio) {
            if (actividadServicio !== undefined && actividadServicio !== null) {
                var err = false
                if (actividadServicio.actividadEconomica === undefined || actividadServicio.actividadEconomica === null) {
                    err = true
                }
                if (actividadServicio.servicio === undefined && actividadServicio.servicio === null) {
                    err = true
                } else {
                    if (actividadServicio.servicio.codigo === undefined || actividadServicio.servicio.nombre === undefined || actividadServicio.servicio.precio === undefined) {
                        err = true
                    } else if (actividadServicio.servicio.codigo === "" || actividadServicio.servicio.nombre === "" || actividadServicio.servicio.precio === "") {
                        err = true
                    }
                }
                if (actividadServicio.actividadEconomica.dosificacion === undefined || actividadServicio.actividadEconomica.dosificacion === null) {
                    err = true
                    errDos = true
                }
                if (!err) {
                    var check = $scope.buscarservicio(actividadServicio.servicio.nombre)
                    if (check !== undefined) {
                        if (check.length < 1) {
                            if (actividadServicio.actividadEconomica.dosificacion) {

                            } else {

                            }
                            if ((actividadServicio.actividadEconomica.dosificacion.id !== undefined && actividadServicio.actividadEconomica.dosificacion.id !== null)) {
                                var service = { id: actividadServicio.id, actividad: actividadServicio.actividadEconomica.actividad, codigo: actividadServicio.servicio.codigo, nombre: actividadServicio.servicio.nombre, precio: actividadServicio.servicio.precio }
                                $scope.configuracionActividadServicio.push(service)
                                $scope.nActividad.servicio = undefined
                            } else {
                                $scope.mostrarMensaje('La actividad seleccionada no tiene dosificación activa, por favor asigne una dosificación para poder continuar.')
                            }
                        } else {
                            if (actividadServicio.servicio.id === undefined) {
                                var encontrado = false
                                check.map(function (ser) {
                                    if (ser.nombre === actividadServicio.servicio.nombre) {
                                        encontrado = true
                                        $scope.mostrarMensaje('El servicio ya fue asignado a esta actividad')                                       
                                    }
                                    if (ser.codigo === actividadServicio.servicio.codigo) {
                                        encontrado = true
                                        $scope.mostrarMensaje('El codigo del servicio ya esta en uso o listo para ser asignado.')
                                    }
                                })
                                if (!encontrado) {
                                    if ((actividadServicio.actividadEconomica.dosificacion.id !== undefined && actividadServicio.actividadEconomica.dosificacion.id !== null)) {
                                        var service = { id: actividadServicio.id, actividad: actividadServicio.actividadEconomica.actividad, codigo: actividadServicio.servicio.codigo, nombre: actividadServicio.servicio.nombre, precio: actividadServicio.servicio.precio }
                                        $scope.configuracionActividadServicio.push(service)
                                        $scope.nActividad.servicio = undefined
                                    } else {
                                        $scope.mostrarMensaje('La actividad seleccionada no tiene dosificación activa, por favor asigne una dosificación para poder continuar.')
                                    }
                                }
                            } else {
                                $scope.nActividad.servicio = undefined
                            }
                        }
                    } else {
                        if ((actividadServicio.actividadEconomica.dosificacion.id !== undefined && actividadServicio.actividadEconomica.dosificacion.id !== null)) {
                            var service = { id: actividadServicio.id, actividad: actividadServicio.actividadEconomica.actividad, codigo: actividadServicio.servicio.codigo, nombre: actividadServicio.servicio.nombre, precio: actividadServicio.servicio.precio }
                            $scope.configuracionActividadServicio.push(service)
                            $scope.nActividad.servicio = undefined
                        } else {
                            $scope.mostrarMensaje('La actividad seleccionada no tiene dosificación activa, por favor asigne una dosificación para poder continuar.')
                        }
                    }
                } else {
                    if (errDos) {
                        $scope.mostrarMensaje('La actividad seleccionada no tiene dosificación activa, por favor asigne una dosificación para poder continuar.')                        
                    } else {
                        $scope.mostrarMensaje('Revise los datos e intente nuevamente.')                        
                    }

                }
            }
        }

        $scope.filtrarClientes = function (query) {
            $scope.clientesProcesados = $filter('filter')($scope.clientes, query);
        }

        $scope.filtrarServicios = function (query) {
            if ($scope.filser) {
                $scope.serviciosProcesados = $filter('filter')($scope.filser, query);
            } else {
                $scope.serviciosProcesados = $filter('filter')($scope.configuracionActividadServicio, query);
            }
        }

        $scope.guardarConfiguracionActividadEconomicas = function () {
            blockUI.start()
            if ($scope.actividadesDosificaciones.length > 0) {
                var toDrop = []
                var nuevasActividades = $scope.actividadesDosificaciones.map(function (_, i) {
                    if ((_.id === undefined || _.eliminado || (_.id_dosificacion == null && (_.dosificacion == undefined || _.dosificacion == null)) || _.editar) && _.expirado == false) {
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
                        if (res.hasErr === undefined) {
                            $scope.obtenerSucursales()
                            $scope.mostrarMensaje(res.mensaje)
                            $scope.actividadesDosificaciones = []
                            var prom = ActividadesEmpresa($scope.usuario.empresa.id)
                            prom.then(function (activities) {
                                $scope.actividadesEmpresa = activities.actividades
                                if (activities.mensaje !== undefined) {
                                    $scope.mostrarMensaje(activities.mensaje)                                    
                                }
                                blockUI.stop()
                                $scope.cerrarConfiguracionActividades()
                                // $scope.obtenerActividadesSucursal(sucursalActividades.id)

                            }).catch(function (err) {
                                $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)                                
                                blockUI.stop()
                                $scope.cerrarConfiguracionActividades()

                            })
                        } else {
                            $scope.mostrarMensaje(res.mensaje)                            
                            blockUI.stop()
                        }
                    }, function (err) {
                        blockUI.stop()
                        $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)                        
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

        $scope.obtenerServiciosActividadEmpresaPrincipal = function (actividad, op) {
            if (actividad == undefined) {
                $scope.serviciosProcesados = []
                return
            }
            if (actividad.id !== undefined) {
                var prom = ServiciosEmpresa($scope.usuario.empresa.id, actividad.id)
                prom.then(function (services) {
                    if (op !== undefined) {
                        $scope.filser = services.servicios
                        $scope.serviciosProcesados = services.servicios
                    } else {
                        $scope.configuracionActividadServicio = services.servicios
                        $scope.serviciosProcesados = services.servicios
                    }
                    if (services.mensaje !== undefined) {
                        $scope.mostrarMensaje(services.mensaje)                       
                    }
                }, function (err) {
                    $scope.mostrarMensaje(err.message)
                })
            }
        }

        $scope.showInActivities = function (actividad) {
            if (actividad.expirado || actividad.eliminado || actividad.dosificacion.expirado) {
                return false
            } else {
                return true
            }
        }

        $scope.obtenerSucursales = function () {
            blockUI.start();
            var promesa = ListaSucursalesUsuario($scope.usuario.id);
            promesa.then(function (sucursales) {
                $scope.sucursales = sucursales.sucursales.map(function (_) {
                    return _.sucursal
                })
                blockUI.stop();
            }, function (err) {
                $scope.mostrarMensaje(err.stack !== undefined ? err.stack : err.message ? err.message : 'No se recibio respuesta del servidor')                
            })
        }

        $scope.dosificarSucursalActividad = function () {
            $scope.cerrarconfirmarDosificacion()
            if ($scope.actividadesDosificaciones.length > 0) {
                var encontrado = false
                var salir = false
                var indx = 0
                while (salir == false) {
                    if ($scope.actividadesDosificaciones[indx].dosificacion !== undefined) {
                        if ($scope.actividadesDosificaciones[indx].dosificacion !== null) {
                            if ($scope.actividadesDosificaciones[indx].dosificacion.id == $scope.paraDosificar.id) {
                                encontrado = true
                                salir = true
                            }
                        }
                    }
                    if (indx < $scope.actividadesDosificaciones.length - 1) {
                        indx += 1
                    } else {
                        salir = true
                    }
                }
                if (!encontrado) {
                    $scope.actividadADosificar.dosificacionAnterior = $scope.actividadADosificar.dosificacion !== undefined || $scope.actividadADosificar.dosificacion !== null ? $scope.actividadADosificar.dosificacion : null
                    $scope.actividadesDosificaciones[$scope.actividadesDosificaciones.indexOf($scope.actividadADosificar)].dosificacion = $scope.paraDosificar
                    $scope.actividadADosificar.editar = true
                    $scope.actividadADosificar = undefined
                    $scope.cerrardialogDosificacionesDisponibles()
                } else {
                    $scope.mostrarMensaje('Hubo un problema, la dosificacion esta en lista para ser asignada!')                   
                }
            }
        }

        $scope.agregarDetalleActividadEmpresa = function (sucursal, actividad) {
            if (actividad.id !== undefined) {
                if ($scope.actividadesDosificaciones.length > 0) {
                    var encontrado = false
                    var salir = false
                    var indx = 0
                    while (salir == false) {
                        if ($scope.actividadesDosificaciones[indx].actividad.nombre === actividad.nombre && !$scope.actividadesDosificaciones[indx].expirado) {
                            encontrado = true
                            salir = true
                        } else {
                            if (indx >= $scope.actividadesDosificaciones.length - 1) {
                                salir = true
                            } else {
                                indx += 1
                            }
                        }
                    }
                    if (!encontrado) {
                        var act = { actividad: actividad, sucursal: sucursal, expirado: false }
                        $scope.actividadesDosificaciones.push(act)
                    } else {
                        $scope.mostrarMensaje('La actividad "' + actividad.nombre + '" ya esta en la lista de esta sucursal "' + sucursal.nombre + '".')                       
                    }
                } else {
                    var act = { actividad: actividad, sucursal: sucursal, expirado: false }
                    $scope.actividadesDosificaciones.push(act)
                }
            }
        }

        $scope.obtenerDosificaciones = function () {
            var promesa = DosificacionesDisponibles($scope.usuario.id_empresa);
            promesa.then(function (dosificaciones) {
                $scope.dosificaciones = dosificaciones;
            });
        }

        $scope.abrirBusquedaServiciosProforma = function () {
            $scope.abrirPopup($scope.dialogBusquedaServicio)
        }

        $scope.cerrarBusquedaServiciosProforma = function () {
            $scope.cerrarPopup($scope.dialogBusquedaServicio)
        }

        $scope.abrirconfirmarDosificacion = function (dosificacion) {
            $scope.paraDosificar = dosificacion
            $scope.abrirPopup($scope.confirmarDosificacion)
        }

        $scope.cerrarconfirmarDosificacion = function () {
            $scope.cerrarPopup($scope.confirmarDosificacion)
        }

        $scope.abrirdialogDosificacionesDisponibles = function (actividad) {
            $scope.obtenerDosificaciones()
            $scope.actividadADosificar = actividad
            $scope.abrirPopup($scope.dialogDosificacionesDisponibles)
        }

        $scope.cerrardialogDosificacionesDisponibles = function () {
            $scope.dosificaciones = undefined
            $scope.actividadADosificar = undefined
            $scope.cerrarPopup($scope.dialogDosificacionesDisponibles)
        }

        $scope.eliminarDetalleProforma = function (detalle) {
            if (detalle.id !== undefined) {
                detalle.eliminado = true
            } else {
                $scope.detallesProformas.splice($scope.detallesProformas.indexOf(detalle), 1)
            }
            $scope.recalcularImportesProforma()
        }

        $scope.recalcularImportesProforma = function () {
            var importBs = 0
            $scope.detallesProformas.map(function (detalle) {
                if (!detalle.eliminado) {
                    importBs += detalle.precio_unitario * detalle.cantidad
                    detalle.importe = detalle.precio_unitario * detalle.cantidad
                }
            })
            $scope.proforma.totalImporteBs = importBs
            $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
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

        $scope.seleccionarcliente = function (client) {
            $scope.proforma.cliente = client
            $scope.cerrardialogClientesProforma()
        }

        $scope.obtenerClientes = function () {
            var prom = Clientes($scope.usuario.id_empresa);
            prom.then(function (cls) {
                $scope.clientes = cls
                $scope.clientesProcesados = cls
            }, function (err) {
                $scope.mostrarMensaje(err.message)                
            })
        }

        $scope.filtrarProformasOperaciones = function (filtro, _, __) {
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
            // for (var key in filtro) {
            //     if (filtro[key] === "" || filtro[key] === null) {
            //         filtro[key] = 0
            //     }
            // }
            if (_ === undefined || !_) {
                $scope.obtenerProformas()
                // $scope.recargarItemsTabla()
            } else {
                return filtro
            }
        }

        $scope.obtenerProformas = function () {
            blockUI.start()
            $scope.filtro = $scope.filtrarProformasOperaciones($scope.filtro, true)
            $scope.paginator.filter = $scope.filtro
            var prom = FiltroProformas($scope.paginator)
            prom.then(function (res) {
                $scope.proformas = res.proformas
                $scope.paginator.setPages(res.count)
                if (res.mensaje !== undefined) {
                    $scope.mostrarMensaje(res.mensaje)
                }
                $scope.filtro = $scope.filtrarProformasOperaciones($scope.filtro, true, true)
                // $scope.filtro = { empresa: $scope.usuario.empresa.id, mes: "", anio: "", sucursal: "", actividad: "", servicio: "", monto: "", razon: "", usuario: "", numero: "" }
                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.totalProformas = 0
                        $scope.totalProformasDolar = 0
                        $scope.calcularTotalProformas()
                    })
                }, 1000)

            }, function (err) {
                $scope.mostrarMensaje(err.data)
            })
            blockUI.stop()
        }

        $scope.guardarProforma = function (valid, proforma) {
            blockUI.start()
            var filtro = { id_empresa: $scope.usuario.empresa.id, mes: 0, anio: 0, sucursal: 0, actividad: 0, servicio: 0, monto: 0, razon: 0, usuario: $scope.usuario.id, pagina: 1, items_pagina: 10, busqueda: 0, numero: 0, id_opcion: 0 }
            if (valid && $scope.detallesProformas.length > 0) {
                if (proforma.id !== undefined) {
                    proforma.detallesProformas = $scope.detallesProformas
                    proforma.usuarioProforma = $scope.usuario
                    proforma.id_empresa = $scope.usuario.empresa.id
                    proforma.fecha_proforma = new Date($scope.convertirFecha(proforma.fecha_proforma))
                    proforma.movimiento = 'PFR'
                    Proforma.update({ id: proforma.id }, proforma, function (res) {
                        $scope.mostrarMensaje(res.mensaje)                        
                        if (res.hasError === undefined) {
                            $scope.cerrardialogProformaEdicion()
                        } else {
                            $scope.proforma = res.proforma
                            proforma.fecha_proforma = new Date($scope.convertirFecha(proforma.fecha_proforma))
                        }
                        blockUI.stop()
                    }, function (err) {
                        $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)
                        proforma.fecha_proforma = $scope.fechaATexto(proforma.fecha_proforma)
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
                            $scope.proforma = res.proforma
                            proforma.fecha_proforma = $scope.fechaATexto(proforma.fecha_proforma)
                        }
                        blockUI.stop()
                    }, function (err) {
                        $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)
                        blockUI.stop()
                    })
                }
            } else {
                $scope.mostrarMensaje('Falta algún dato requerido. Por favor revise el formulario.')
                blockUI.stop()
            }
        }

        $scope.fechaATexto = function (fecha) {
            fech = new Date(fecha)
            fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
            return fecha
        }

        $scope.abrirdialogProformaEdicion = function (proforma) {
            // $scope.obtenerSucursales()
            // $scope.ocultarMensajesValidacion();
            if (proforma !== undefined) {
                $scope.detalleProforma = undefined

            } else {
                $scope.proforma.sucursal = $scope.sucursales[0]
                // $scope.proforma = { sucursal: $scope.sucursales[0], fecha_proforma: new Date(), periodo_mes: { id: new Date().getMonth() }, periodo_anio: { id: new Date().getFullYear() } }
                $scope.proforma.fecha_proforma = new Date().toLocaleDateString()
                $scope.proforma.periodo_mes = { id: new Date().getMonth() }
                $scope.proforma.periodo_anio = { id: new Date().getFullYear() }
                $scope.obtenerCambioMonedaProforma(new Date())
                $scope.detalleProforma = undefined
                $scope.obtenerActividadesSucursal($scope.proforma.sucursal.id)
            }
            $scope.detalleProforma = {}
            $scope.abrirPopup($scope.dialogProformaEdicion);
        }

        $scope.cerrardialogProformaEdicion = function () {
            $scope.proforma.ver = undefined
            $scope.filtrarProformasOperaciones($scope.filtro)
            $scope.detallesProformas = []
            $scope.proforma = {}
            $scope.configuracionActividadServicio = []
            $scope.actividadesSucursal = []
            $scope.obtenerProformas()

            $scope.cerrarPopup($scope.dialogProformaEdicion);
        }

        $scope.abrirConfiguracionActividadesServicios = function () {
            $scope.obtenerSucursales()
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.abrirPopup($scope.modalConfiguracionActividadesServicios);
        }

        $scope.abrirdialogClientesProforma = function () {

            $scope.abrirPopup($scope.dialogClientesProforma);
        }

        $scope.cerrardialogClientesProforma = function () {
            $scope.cerrarPopup($scope.dialogClientesProforma);
        }

        $scope.obtenerActividadesEmpresa = function (idEmpresa) {

            var prom = ListaSucursalesActividadesDosificacionEmpresa(idEmpresa)
            var toDrop = []
            prom.then(function (actividades) {
                $scope.actividadesEmpresaSinRepeticion = []
                $scope.actividadesEmpresa = actividades.actividades
                $scope.actividadesEmpresa.map(function (act) {
                    var encontrado = false
                    if ($scope.actividadesEmpresaSinRepeticion.length == 0) {
                        $scope.actividadesEmpresaSinRepeticion.push(act)
                    }
                    if ($scope.actividadesEmpresaSinRepeticion.some(function (activi, i) { return activi.actividad.id === act.actividad.id })) {
                        // $scope.actividadesEmpresaSinRepeticion.push(act)
                    } else {
                        $scope.actividadesEmpresaSinRepeticion.push(act)
                    }
                })
            }, function (err) {
                $scope.mostrarMensaje(err.stack !== undefined ? err.stack : err.message)
            })
        }

        $scope.obtenerActividadesDosificadasEmpresa = function (idEmpresa) {
            var prom = ListaSucursalesActividadesDosificacionEmpresa(idEmpresa)
            var toDrop = []
            prom.then(function (actividades) {
                $scope.actividadesDosificadosEmpresa = actividades.actividades
            }, function (err) {
                $scope.mostrarMensaje(err.stack !== undefined ? err.stack : err.message)
            })
        }

        $scope.abrirConfiguracionActividades = function () {
            $scope.obtenerSucursales()
            $scope.obtenerActividadesGral()
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.abrirPopup($scope.modalConfiguracionActividades);
        }

        $scope.cerrarConfiguracionActividades = function () {
            $scope.sucursalActividades = undefined
            $scope.actividadEconomicaEmpresa = undefined
            $scope.actividadesSucursal = []
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.recargarItemsTabla()            
            $scope.cerrarPopup($scope.modalConfiguracionActividades);
        }

        $scope.abrirdialogmodalFechas = function (proforma, opcion) {
            $scope.proformaFechas = proforma
            $scope.abrirPopup($scope.dialogmodalFechas);
            if ($scope.proformaFechas.fecha_recepcion !== null) {
                var fec = new Date($scope.proformaFechas.fecha_recepcion).toLocaleDateString()
                $scope.proformaFechas.fecha_recepcion = (fec === 'Invalid Date') ? new Date($scope.convertirFecha($scope.proformaFechas.fecha_recepcion)).toLocaleDateString() : fec
            }
            if ($scope.proformaFechas.fecha_factura !== null) {
                var fec = new Date($scope.proformaFechas.fecha_factura).toLocaleDateString()
                $scope.proformaFechas.fecha_factura = (fec === 'Invalid Date') ? new Date($scope.convertirFecha($scope.proformaFechas.fecha_factura)).toLocaleDateString() : fec
            }
            if ($scope.proformaFechas.fecha_proforma_ok !== null) {
                var fec = new Date($scope.proformaFechas.fecha_proforma_ok).toLocaleDateString()
                $scope.proformaFechas.fecha_proforma_ok = (fec === 'Invalid Date') ? new Date($scope.convertirFecha($scope.proformaFechas.fecha_proforma_ok)).toLocaleDateString() : fec
            }
            if ($scope.proformaFechas.fecha_cobro !== null) {
                $scope.proformaFechas.fecha_cobro = (fec === 'Invalid Date') ? new Date($scope.convertirFecha($scope.proformaFechas.fecha_cobro)).toLocaleDateString() : fec
            }
        }

        $scope.cerrardialogmodalFechas = function () {
            $scope.proformaFechas = undefined
            $scope.recargarItemsTabla()
            $scope.cerrarPopup($scope.dialogmodalFechas);
        }

        $scope.cerrarConfiguracionActividadesServicios = function () {
            $scope.nActividad = {}
            $scope.configuracionActividadServicio = []
            $scope.recargarItemsTabla()
            $scope.cerrarPopup($scope.modalConfiguracionActividadesServicios);
        }

        $scope.showInHist = function (actOne, actTwo) {
            if (actOne.id_actividad == actTwo.id_actividad && actOne.expirado) {
                return true
            } else {
                return false
            }

        }

        $scope.PopoverConfiguracionActividad = {
            templateUrl: 'PopoverConfiguracionActividad.html',
            title: 'MEnu',
            isOpen: false
        };

        $scope.PopoverConfiguracionActividadhistorial = {
            templateUrl: 'PopoverConfiguracionActividadhistorial.html',
            title: 'Historial dosificacion actividad',
            isOpen: false
        };

        $scope.impresiones = {
            templateUrl: 'impresiones.html',
            title: 'Opcion de impresion',
            isOpen: false
        };

        $scope.imprimir = function (proforma, opcionImpresion) {
            blockUI.start();
            var prom = ProformaInfo(proforma.id, proforma.actividadEconomica.id)
            prom.then(function (proformaE) {
                $scope.proforma = proformaE.proforma
                if (proformaE.mensaje !== undefined || proformaE.proforma == null || proformaE.proforma == undefined) {
                    if ((proformaE.proforma == null || proformaE.proforma == undefined) && proformaE.mensaje == undefined) {
                        $scope.mostrarMensaje('No se encuentra la información requerida')                        
                    } else {
                        $scope.mostrarMensaje(proformaE.mensaje)                        
                    }

                } else {
                    $scope.proforma.fecha_proforma = $scope.fechaATexto(new Date($scope.proforma.fecha_proforma))
                    var dat = new Date($scope.convertirFecha($scope.proforma.fecha_proforma))
                    var promesa = ObtenerCambioMoneda(dat)
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
                        convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {

                            var imagen = imagenEmpresa;
                            if (opcionImpresion == 0) {
                                $scope.imprimirSinDetalle($scope.proforma, imagen)
                            }
                            if (opcionImpresion == 1) {
                                $scope.imprimirConDetalle($scope.proforma, imagen)
                            }
                            if (opcionImpresion == 2) {
                                $scope.imprimirMixto($scope.proforma, imagen)
                            }
                        });

                        blockUI.stop()

                    }, function (err) {
                        $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)                        
                        blockUI.stop()
                    })
                }
            }, function (err) {
                $scope.mostrarMensaje(err.message === undefined ? err.stack : err.message)                
                blockUI.stop()
            })
        }

        $scope.imprimirMixto = function (proforma, imagen) {

            var importeTotal = 0
            var cantidadTotal = 0
            $scope.proforma = proforma
            var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false }); //{compress: false},

            var separacionExtra = 50
            var stream = doc.pipe(blobStream());
            var fechaActual = new Date();
            var x = 80
            doc.font('Helvetica', 8);
            var y = 115 + 80 + separacionExtra, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma, imagen);
            var extraDetalle = 0
            var extraServ = 0
            for (var i = 0; i <= $scope.proforma.detallesProformas.length && items <= itemsPorPagina; i++) {
                doc.font('Helvetica', 8);
                if (i == 0) {
                    doc.text(($scope.proforma.detalle), 150, y - 2, { width: 260 });
                    var divisor = $scope.proforma.detalle !== null ? $scope.proforma.detalle.length : 0
                    extraDetalle = Math.ceil(divisor / 260) * 20
                } else {
                    doc.text($scope.proforma.detallesProformas[i - 1].cantidad, 70, y - 2);
                    doc.text($scope.proforma.detallesProformas[i - 1].servicio.nombre, 150, y - 2, { width: 260 });
                    doc.text($scope.number_format($scope.proforma.detallesProformas[i - 1].precio_unitario, 2), 440, y - 2);
                    doc.text($scope.number_format($scope.proforma.detallesProformas[i - 1].importe, 2), 510, y - 2);
                }

                y = y + 20 + extraDetalle;
                importeTotal += (i === 1) ? $scope.proforma.importe : 0
                cantidadTotal += (i === 1) ? $scope.proforma.cantidad : 0
                items++;
                extraDetalle = 0
                extraServ = 0
                if (items > itemsPorPagina || (y > 700)) {
                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 115 + 80 + separacionExtra;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma, imagen);
                }
            }
            doc.rect(40, 705, 540, 15).stroke(); // cuadro literal bolivianos
            doc.rect(40, 725, 540, 15).stroke(); // cuadro total dolares
            $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
            doc.text('Son : ' + ($scope.proforma.importeLiteral), 58, 710);
            doc.text($scope.number_format($scope.proforma.totalImporteBs, 2), 510, 710);
            doc.rect(41, 725, 538, 14).fill("silver", "#000")
                .fill('black')
            doc.text('Son : ' + $scope.number_format($scope.proforma.totalImporteBs / $scope.moneda.dolar, 2) + '  Dólares x ' + $scope.moneda.dolar, 58, 730);
            // doc.text("Nota: La aprobación de la proforma deberá realizarse dentro de los próximos 7 días a partir de la fecha de recepción",0, 750,{ align: "center" })
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();
        }

        $scope.imprimirConDetalle = function (proforma, imagen) {

            var importeTotal = 0
            var cantidadTotal = 0
            $scope.proforma = proforma
            var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false }); //{compress: false},
            var separacionExtra = 50
            var stream = doc.pipe(blobStream());
            var fechaActual = new Date();
            var x = 80
            doc.font('Helvetica', 8);
            var y = 115 + 80 + separacionExtra, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma, imagen);
            var extraServ = 0
            for (var i = 0; i < $scope.proforma.detallesProformas.length && items <= itemsPorPagina; i++) {
                doc.font('Helvetica', 8);

                doc.text($scope.proforma.detallesProformas[i].cantidad, 70, y - 2);
                doc.text($scope.proforma.detallesProformas[i].servicio.nombre, 150, y - 2, { width: 260 });
                doc.text($scope.number_format($scope.proforma.detallesProformas[i].precio_unitario, 2), 440, y - 2);
                doc.text($scope.number_format($scope.proforma.detallesProformas[i].importe, 2), 510, y - 2);

                if ($scope.proforma.detallesProformas[i].servicio.nombre.length > 260) {
                    extraServ = Math.ceil($scope.proforma.detallesProformas[i].servicio.nombre.length / 260) * 10
                }

                y = y + 20 + extraServ;
                importeTotal += (i === 1) ? $scope.proforma.importe : 0
                cantidadTotal += (i === 1) ? $scope.proforma.cantidad : 0
                items++;
                extraServ = 0
                if (items > itemsPorPagina || y > 700) {
                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 115 + 80 + separacionExtra;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma, imagen);
                }
            }
            doc.rect(40, 705, 540, 15).stroke(); // cuadro literal bolivianos
            doc.rect(40, 725, 540, 15).stroke(); // cuadro total dolares
            $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
            doc.text('Son : ' + ($scope.proforma.importeLiteral), 58, 710);
            doc.text($scope.number_format($scope.proforma.totalImporteBs, 2), 510, 710);
            doc.rect(41, 725, 538, 14).fill("silver", "#000")
                .fill('black')
            doc.text('Son : ' + $scope.number_format($scope.proforma.totalImporteBs / $scope.moneda.dolar, 2) + '  Dólares x ' + $scope.moneda.dolar, 58, 730);
            // doc.text("Nota: La aprobación de la proforma deberá realizarse dentro de los próximos 7 días a partir de la fecha de recepción",0, 750,{ align: "center" })
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();
        }

        $scope.imprimirSinDetalle = function (proforma, imagen) {

            var importeTotal = 0
            var cantidadTotal = 0
            $scope.proforma = proforma
            var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false });//[612, 792] {compress: false},
            var separacionExtra = 50
            var stream = doc.pipe(blobStream());
            var fechaActual = new Date();
            var x = 80
            doc.font('Helvetica', 8);
            var y = 195 + separacionExtra, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas, $scope.proforma, imagen);
            doc.font('Helvetica', 8);
            var cant = 0
            $scope.proforma.detallesProformas.map(function (_) {
                cant += _.cantidad
            })
            doc.text(1, 70, y - 2);
            doc.text(($scope.proforma.detalle), 150, y - 2, { width: 260 });
            extraDetalle = Math.ceil($scope.proforma.detalle.length / 260) * 20
            doc.text($scope.number_format($scope.proforma.totalImporteBs, 2), 440, y - 2);
            doc.text($scope.number_format($scope.proforma.totalImporteBs, 2), 510, y - 2)
            y = y + 20 + extraDetalle;
            $scope.proforma.importeLiteral = ConvertirALiteral($scope.proforma.totalImporteBs.toFixed(2));
            doc.rect(40, 705, 540, 15).stroke(); // cuadro literal bolivianos
            doc.rect(40, 725, 540, 15).stroke(); // cuadro total dolares
            doc.text('Son : ' + ($scope.proforma.importeLiteral), 58, 710);
            doc.text($scope.number_format($scope.proforma.totalImporteBs, 2), 510, 710);
            doc.rect(41, 725, 538, 14).fill("silver", "#000")
                .fill('black')
            doc.text('Son : ' + $scope.number_format($scope.proforma.totalImporteBs / $scope.moneda.dolar, 2) + '  Dólares x ' + $scope.moneda.dolar, 58, 730);

            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();
        }

        $scope.dibujarCabeceraPDFImpresion = function (doc, pagina, totalPaginas, proforma, imagen) {
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
            doc.image(imagen, 40, 30, { fit: [100, 100] }); //{ fit: [200, 72] } { fit: [100, 72] }
            doc.text($scope.usuario.empresa.telefono1, 80, 60 + separacionExtra);
            doc.text($scope.usuario.empresa.direccion + ' Santa Cruz', 40, 70 + separacionExtra, { width: 90 });
            doc.text('Santa Cruz,     ', 65, 115 + separacionExtra, { lineBreak: false }).font('Helvetica-Bold', 10).text(fecha.split('/')[0], { lineBreak: false }).font('Helvetica', 10).text('   de   ', { lineBreak: false }).font('Helvetica-Bold', 10).text($scope.meses[new Date($scope.convertirFecha(fecha)).getMonth()].nombre, { lineBreak: false }).font('Helvetica', 10).text('   de   ', { lineBreak: false }).font('Helvetica-Bold', 10).text(fecha.split('/')[2])
            doc.font('Helvetica-Bold', 8);
            doc.font('Helvetica', 8);
            doc.font('Helvetica-Bold', 14);
            doc.text("N°", 380, 60, { align: "center" });
            doc.text(proforma.correlativo, 510, 60);
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
            doc.text(proforma.cliente.razon_social, 100, 143 + separacionExtra);

            doc.text(proforma.cliente.nit, 500, 145 + separacionExtra);
            doc.rect(40, 110 + separacionExtra, 540, 20).stroke();
            doc.rect(40, 135 + separacionExtra, 540, 20).stroke();
            doc.rect(40, 210, 540, 490).stroke(); //235
            doc.rect(120, 210, 0, 490).stroke(); //cant | det
            doc.rect(430, 210, 0, 490).stroke();// det| punit
            doc.rect(490, 210, 0, 490).stroke(); // punit | import
            doc.text("Nota: La aprobación de la proforma deberá realizarse dentro de los próximos 7 días a partir de la fecha de recepción", 0, 750, { align: "center" })
        }
        $scope.inicio()
    })