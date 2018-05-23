angular.module('agil.controladores')

    .controller('controladorTransacciones', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, ObtenerTodoPersonal, TransaccionBancoPaginador, $timeout,
        Paginator, ListaBancos, ClasesTipo, TransaccionIngresoBanco, FieldViewer, TransaccionEgresoBanco, TransaccionSeguimientoBanco, TransaccionSeguimientoEstado, TransaccionRevisionEstado,
        SaldoCuenta, SaldoDisponibleCuenta, SaldoProformas) {

        $scope.modalNuevoIngreso = 'modal-wizard-nuevo-ingreso'
        $scope.modalNuevoEgreso = 'modal-wizard-nuevo-egreso'
        $scope.modalSeguimiento = 'modal-wizard-seguimiento'
        $scope.modalRevision = 'modal-wizard-revision'
        $scope.modalVencimientoCreditos = 'tabla-vencimiento-creditos-transaciones'
        $scope.modalVerIngreso = 'modal-wizard-ver-ingreso'
        $scope.modalVerEgreso = 'modal-wizard-ver-egreso'

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsTransacciones($scope.modalNuevoIngreso, $scope.modalNuevoEgreso, $scope.modalSeguimiento, $scope.modalRevision, $scope.modalVencimientoCreditos,
                $scope.modalVerIngreso, $scope.modalVerEgreso);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion()
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.modalNuevoIngreso);
            $scope.eliminarPopup($scope.modalNuevoEgreso);
            $scope.eliminarPopup($scope.modalSeguimiento);
            $scope.eliminarPopup($scope.modalRevision);
            $scope.eliminarPopup($scope.modalVencimientoCreditos);
        });

        $scope.inicio = function () {
            var hoy = new Date()
            $scope.filtro = { empresa: $scope.usuario.empresa.id, desde: hoy.setDate(hoy.getDate() - 7), hasta: new Date().toLocaleDateString(), cuenta: 0, nombre: 0, concepto: 0, ref_doc: 0, tipo_doc: 0, estado: 0 }
            $scope.filtro.desde = new Date($scope.filtro.desde).toLocaleDateString()
            $scope.obtenerCuentas()
            $scope.obtenerConceptosTransaccion()
            $scope.obtenerTiposDocumentos()
            $scope.obtenerEstadosTransaccion()
            //$scope.obtenerSaldoInicial()
            $timeout(function () {
                $scope.obtenerVencimientos()
            }, 5000)

            $scope.fondosDisponibles = 0
            $scope.ingresosEnTransito = 0
            $scope.egresosEnTransito = 0
            $scope.saldoInicial = 0
            $scope.saldoFinal = 0
            $scope.saldoPignorado = 0
            $scope.fecha_hoy = new Date().toLocaleDateString()
            var prom = ObtenerTodoPersonal($scope.usuario.id_empresa)
            prom.then(function (res) {
                $scope.empleados = res.personal
                $scope.obtenerTransacciones()
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
            })
        }

        $scope.obtenerConceptosTransaccion = function () {
            blockUI.start();
            var promesa = ClasesTipo("CONTRAN");
            promesa.then(function (entidad) {
                $scope.conceptosTransaccion = entidad.clases;
                $scope.conceptosTransaccion.forEach(concepto => {
                    if (concepto.nombre_corto === 'CTRANS') {
                        $scope.TRAN_COBRO = concepto
                    }
                    if (concepto.nombre_corto === 'PTRANS') {
                        $scope.TRAN_PAGO = concepto
                    }
                    if (concepto.nombre_corto == 'SAL_INICIAL') {
                        $scope.SALDO_INICIAL = concepto
                    }
                });
                blockUI.stop();
            });
        }

        $scope.obtenerVencimientos = function () {
            $scope.vencimientosCobros = []
            $scope.verificarVencimientosCreditos($scope.usuario.id_empresa)
            var prom = SaldoProformas($scope.usuario.id_empresa)
            prom.then(function (res) {
                var proformas = []
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    res.proformas.forEach(element => {
                        var proforma = { id: element.id, factura: element.factura, total: element.monto, cliente: { razon_social: element.razon_social }, a_cuenta: element.a_cuenta, saldo: element.saldo, es_proforma: true }
                        proformas.push(proforma)
                    });

                    Array.prototype.push.apply($scope.vencimientosCobros, proformas)
                }
                Array.prototype.push.apply($scope.vencimientosCobros, $scope.vencimientosCreditos)
                // Array.prototype.push.apply($scope.vencimientosCobros, $scope.alertasProformas)

            }).catch(function (err) {

            })

            console.log($scope.vencimientosCobros)

        }

        $scope.obtenerTiposDocumentos = function () {
            blockUI.start();
            var promesa = ClasesTipo("TDC");
            promesa.then(function (entidad) {
                $scope.tiposDocumentos = entidad.clases;
                blockUI.stop();
            });
        }

        $scope.obtenerSaldoInicial = function () {
            $scope.saldoInicial = 0
            var prom = SaldoCuenta($scope.usuario.id_empresa, $scope.cuentaSeleccionada.id, $scope.filtro.desde, $scope.filtro.hasta)
            prom.then(function (res) {
                $scope.saldoInicial = res.cuenta[0].saldo
            }).catch(function (err) {
                var msg = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
            })
        }

        $scope.showSelecccionCliente = function (ingreso) {
            if (ingreso === undefined || ingreso === null) {
                return true
            }
            if (ingreso.concepto !== undefined && ingreso.concepto !== null) {
                if (ingreso.concepto.id !== undefined) {
                    if (ingreso.concepto.id === $scope.SALDO_INICIAL.id) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    if (ingreso.concepto === $scope.SALDO_INICIAL.id) {
                        return false
                    } else {
                        return true
                    }
                }
            } else {
                return true
            }

        }

        $scope.obtenerEstadosTransaccion = function () {
            blockUI.start();
            var promesa = ClasesTipo("ESTRANS");
            promesa.then(function (entidad) {
                $scope.estadosTransaccion = entidad.clases;
                entidad.clases.map(function (clase) {
                    if (clase.nombre_corto == 'CONFIRMADO') {
                        $scope.CONFIRMADO = clase
                    }
                    if (clase.nombre_corto == 'EN_TRANSITO') {
                        $scope.EN_TRANSITO = clase
                    }
                })
                blockUI.stop();
            });
        }

        $scope.seleccionarCuenta = function (cuentaBanco) {
            $scope.cuentaSeleccionada = undefined
            $scope.bancos.forEach(cuenta => {
                if (cuenta.id === cuentaBanco.id) {
                    $scope.cuentaSeleccionada = cuenta
                    $scope.filtro.cuenta = $scope.cuentaSeleccionada
                }
            });
        }

        $scope.obtenerCuentas = function () {
            var prom = ListaBancos($scope.usuario.id_empresa)
            prom.then(function (res) {
                $scope.bancos = res
                $scope.cuentaSeleccionada = $scope.bancos[0]
                $scope.filtro.cuenta = $scope.cuentaSeleccionada
            })
        }

        $scope.calcularIngresosTransito = function () {
            $scope.ingresosEnTransito = 0
            $scope.transacciones.forEach(transaccion => {
                if (transaccion.haber !== null && transaccion.id_estado === $scope.EN_TRANSITO.id) {
                    $scope.ingresosEnTransito += transaccion.haber
                }
            });
        }

        $scope.calcularEgresosTransito = function () {
            $scope.egresosEnTransito = 0
            $scope.transacciones.forEach(transaccion => {
                if (transaccion.debe !== null && transaccion.id_estado === $scope.EN_TRANSITO.id) {
                    $scope.egresosEnTransito += transaccion.debe
                }
            });
        }

        $scope.calcularFondosDisponibles = function () {
            $scope.fondosDisponibles = 0
            var prom = SaldoDisponibleCuenta($scope.usuario.id_empresa, $scope.cuentaSeleccionada.id, 0, 0)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                }
                $scope.fondosDisponibles = res.saldo
                $scope.calcularIngresosTransito()
                $scope.calcularEgresosTransito()
                $scope.calcularSaldoPignorado()
                $scope.calcularSaldoFinal()
                var prom = SaldoCuenta($scope.usuario.id_empresa, $scope.cuentaSeleccionada.id, $scope.filtro.desde, $scope.filtro.hasta)
                prom.then(function (res) {
                    $scope.saldoInicial = res.cuenta[0].saldo
                })
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
            // $scope.bancos.forEach(cuenta => {
            //     if (cuenta.saldo !== null && transaccion.id_estado === $scope.EN_TRANSITO.id) {
            //         $scope.fondosDisponibles += cuenta.saldo
            //     }

            // });
        }

        $scope.calcularSaldoFinal = function () {
            $scope.saldoFinal = $scope.fondosDisponibles + $scope.ingresosEnTransito - $scope.egresosEnTransito
            // $scope.transacciones.forEach(transaccion => {
            //     if (transaccion.debe !== null) {
            //         $scope.saldoFinal -= transaccion.debe
            //     }
            //     if(transaccion.haber !== null){
            //         $scope.saldoFinal += transaccion.haber
            //     }
            // });
        }

        $scope.calcularSaldoPignorado = function () {
            $scope.saldoPignorado = 0
            $scope.transacciones.forEach(transaccion => {
                if (transaccion.debe !== null && transaccion.id_estado === $scope.EN_TRANSITO.id) {
                    $scope.saldoPignorado -= transaccion.debe
                }
                if (transaccion.haber !== null && transaccion.id_estado === $scope.EN_TRANSITO.id) {
                    $scope.saldoPignorado += transaccion.haber
                }
            });
        }

        $scope.obtenerColumnasAplicacion = function () {
            blockUI.start();
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuario.id_empresa,
                configuracion: {
                    numero: { value: "N°", show: true },
                    fecha: { value: "Fecha", show: true },
                    banco: { value: "Banco", show: true },
                    detalle: { value: "Detalle", show: true },
                    nombre: { value: "Nombre completo", show: true },
                    concepto: { value: "Concepto", show: true },
                    observaciones: { value: "Observaciones", show: true },
                    ref_doc: { value: "Ref./Doc.", show: true },
                    tipo_doc: { value: "tipo Documento", show: true },
                    debe: { value: "Debe", show: true },
                    haber: { value: "Haber", show: true },
                    saldo: { value: "Saldo", show: true },
                    estado: { value: "estado", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
            blockUI.stop();
        }

        $scope.obtenerSaldoCuenta = function () {
            var prom = SaldoCuenta($scope.usuario.id_empresa, $scope.filtro.cuenta, new Date())
            var recived = false
            prom.then(function (res) {
                recived = true
                $scope.saldoInicial = res.transaccion.saldo
            })
            $timeout(function () {
                if (recived) {
                    blockUI.stop()
                } else {
                    blockUI.stop()
                    $scope.mostrarMensaje('La respuesta esta tardando mas de lo normal')
                }
            }, 5000)
        }

        $scope.filtrarTransacciones = function (filtro, _, __) {
            if (__ !== undefined) {
                for (var key in filtro) {
                    if (filtro[key] == 0) {
                        filtro[key] = ""
                    }
                }
            } else {
                for (var key in filtro) {
                    if (filtro[key] === "" || filtro[key] === null || filtro[key] === undefined) {
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
                $scope.buscarTransacciones()
                // $scope.recargarItemsTabla()
            } else {
                return filtro
            }
        }

        $scope.obtenerTransacciones = function () {
            // $scope.filtro = { empresa: $scope.usuario.empresa.id, desde: 0, hasta: 0, cuenta: 0, nombre: 0, concepto: 0, ref_doc: 0, tipo_doc: 0, estado: 0 }
            $scope.paginator = Paginator()
            $scope.paginator.column = "fecha"
            $scope.paginator.direccion = "asc"
            $scope.paginator.callBack = $scope.buscarTransacciones
            $scope.paginator.getSearch("")
        }

        $scope.buscarTransacciones = function () {
            blockUI.start()
            if ($scope.filtro.cuenta === 0) {
                $scope.filtro.cuenta = $scope.cuentaSeleccionada
            }
            // $scope.saldoPrevio = $scope.saldoInicial
            $scope.filtro = $scope.filtrarTransacciones($scope.filtro, true)
            $scope.paginator.filter = $scope.filtro
            var prom = TransaccionBancoPaginador($scope.usuario.id_empresa, $scope.paginator)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.transacciones = res.transacciones
                    $scope.transacciones.forEach(transaccion => {
                        $scope.verificarSeguimiento(transaccion)
                    });
                    $scope.paginator.setPages(res.paginas)

                    $scope.calcularFondosDisponibles()
                    $scope.obtenerSaldoInicial()
                    $scope.obtenerVencimientos()
                }

                blockUI.stop()
            })

            // $scope.transacciones = [
            //     {
            //         fecha: '1/1/2018',
            //         cuenta: {
            //             nombre: 'Mercantil',
            //             numero: 31423
            //         },
            //         detalle: 'Pago Embol',
            //         cliente: {
            //             persona: {
            //                 nombre: 'Juan Perez'
            //             }
            //         },
            //         concepto: {
            //             nombre: 'Pago'
            //         },
            //         observaciones: 'Ninguna',
            //         ref_doc: '465046',
            //         tipo: {
            //             nombre: 'Cheque'
            //         },
            //         Debe: '', haber: '1656',
            //         saldo: '6516',
            //         estado: {
            //             nombre: 'Tránsito'
            //         },
            //         seguimiento: {
            //             proveedor: false,
            //             entregado_por: { persona: { nombre: 'Alberto' } }
            //         }
            //     },
            //     {
            //         fecha: '2/2/2018',
            //         banco: {
            //             nombre: 'Mercantil'
            //         },
            //         detalle: 'Cobro/ Exos s.r.l.',
            //         cliente: {
            //             persona: {
            //                 nombre: 'David Campos'
            //             }
            //         },
            //         concepto: {
            //             nombre: 'Cobro'
            //         },
            //         observaciones: 'Ninguna',
            //         ref_doc: '465046',
            //         tipo: {
            //             nombre: 'Cheque'
            //         },
            //         Debe: '', haber: '1656',
            //         saldo: '6516',
            //         estado: {
            //             nombre: 'Tránsito'
            //         },
            //         seguimiento: {
            //             proveedor: false,
            //             entregado_por: { persona: { nombre: 'Alberto' } }
            //         }
            //     }
            // ]
            $scope.filtro = $scope.filtrarTransacciones($scope.filtro, true, true)
        }

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.crearNuevoIngreso = function () {
            $scope.abrirModalNuevoIngreso()
        }

        $scope.crearNuevoEgreso = function () {
            $scope.abrirModalNuevoEgreso()
        }

        $scope.seguimiento = function (transaccion) {
            // $scope.mostrarMensaje(new Date().getWeekNumber())
            $scope.transaccion = transaccion
            $scope.abrirModalSeguimiento()
        }

        $scope.guardarSeguimiento = function (transaccion) {
            blockUI.start()
            if (transaccion.seguimientos[0].id_entregado !== null) {
                if (transaccion.seguimientos[0].id_entregado !== transaccion.seguimientos[0].entregado_por.id) {
                    $scope.mostrarMensaje('No se permiten cambios!')
                    blockUI.stop()
                    return
                } else {
                    if (transaccion.seguimientos[0].id_devuelto !== null && !transaccion.seguimientos[0].proveedor) {
                        if (transaccion.seguimientos[0].id_devuelto !== transaccion.seguimientos[0].devuelto_a.id) {
                            $scope.mostrarMensaje('No se permiten cambios!')
                            blockUI.stop()
                            return
                        }
                    } else if (transaccion.seguimientos[0].fecha_devolucion === null && (!transaccion.seguimientos[0].proveedor && (transaccion.seguimientos[0].devuelto_a !== 0 && transaccion.seguimientos[0].devuelto_a !== undefined && transaccion.seguimientos[0].devuelto_a !== null))) {
                        transaccion.seguimientos[0].fecha_devolucion = new Date()
                        transaccion.seguimientos[0].id_devuelto = transaccion.seguimientos[0].devuelto_a.id
                    }
                }
            } else if (transaccion.seguimientos[0].fecha_entrega === null) {
                transaccion.seguimientos[0].fecha_entrega = new Date()
                transaccion.seguimientos[0].id_entregado = transaccion.seguimientos[0].entregado_por.id
            }

            var prom = TransaccionSeguimientoBanco($scope.usuario.id_empresa, transaccion.seguimientos[0], $scope.usuario.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrarModalSeguimiento()
                    $scope.verificarSeguimiento(transaccion)
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.verificarSeguimiento = function (transaccion) {
            if (transaccion.seguimientos.length > 0) {
                if (transaccion.seguimientos[0].entregado_por === null && transaccion.seguimientos[0].devuelto_a === null && !transaccion.seguimientos[0].proveedor) {
                    transaccion.seguimientos[0].black = true
                    transaccion.seguimientos[0].yellow = undefined
                    transaccion.seguimientos[0].green = undefined
                }
                if (transaccion.seguimientos[0].entregado_por !== null && transaccion.seguimientos[0].devuelto_a === null && !transaccion.seguimientos[0].proveedor) {
                    transaccion.seguimientos[0].black = undefined
                    transaccion.seguimientos[0].yellow = true
                    transaccion.seguimientos[0].green = undefined
                }
                if (transaccion.seguimientos[0].entregado_por !== null && transaccion.seguimientos[0].devuelto_a !== null && !transaccion.seguimientos[0].proveedor) {
                    transaccion.seguimientos[0].black = undefined
                    transaccion.seguimientos[0].yellow = undefined
                    transaccion.seguimientos[0].green = true
                }
                if (transaccion.seguimientos[0].entregado_por === null && transaccion.seguimientos[0].devuelto_a === null && transaccion.seguimientos[0].proveedor) {
                    transaccion.seguimientos[0].black = true
                    transaccion.seguimientos[0].yellow = undefined
                    transaccion.seguimientos[0].green = undefined
                }
                if (transaccion.seguimientos[0].entregado_por !== null && transaccion.seguimientos[0].devuelto_a === null && transaccion.seguimientos[0].proveedor) {
                    transaccion.seguimientos[0].black = undefined
                    transaccion.seguimientos[0].yellow = undefined
                    transaccion.seguimientos[0].green = true
                }
            }
        }

        $scope.calcularSaldo = function () {
            // var saldo = $scope.saldoPrevio
            // $scope.saldos = $scope.transacciones.map(function (transaccion) {
            //     if (transaccion.debe !== null && transaccion.debe !== undefined) {
            //         $scope.saldoPrevio, transaccion.saldo = $scope.saldoPrevio + transaccion.debe
            //     }
            //     if (transaccion.haber !== null && transaccion.haber !== undefined) {
            //         $scope.saldoPrevio, transaccion.saldo = $scope.saldoPrevio - transaccion.haber
            //     }
            //     if (transaccion.saldo == null || transaccion.saldo == undefined) {
            //         $scope.transaccion.saldo = 'ERROR'
            //     } else {
            //         $scope.saldoPrevio = transaccion.saldo
            //     }
            //     $scope.verificarSeguimiento(transaccion)
            // })
        }

        $scope.verificarConcepto = function (ingreso) {
            if ($scope.SALDO_INICIAL.id === ingreso.concepto) {
                ingreso.venta = undefined
                ingreso.detalle = 'Ingreso apertura.'

            }
        }

        $scope.guardarRevision = function () {
            blockUI.start()
            $scope.transaccion.cerrado = true
            var prom = TransaccionRevisionEstado($scope.usuario.id_empresa, $scope.usuario.id, $scope.transaccion.id)
            prom.then(function (res) {
                blockUI.stop()
                $scope.mostrarMensaje(res.mensaje)
                $scope.cerrarModalRevision()
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                blockUI.stop()
            })
        }

        $scope.guardarIngreso = function (ingreso) {
            blockUI.start()
            ingreso.fecha = new Date($scope.convertirFecha(ingreso.fecha))
            var prom = TransaccionIngresoBanco($scope.usuario.id_empresa, ingreso, $scope.usuario.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    ingreso.fecha = new Date(ingreso.fecha).toLocaleDateString()
                    $scope.mostrarMensaje(res.mensaje)

                } else {
                    $scope.mostrarMensaje(res.mensaje)
                    ingreso.venta.saldo -= ingreso.haber
                    if (ingreso.venta.es_proforma) {
                        if (ingreso.concepto !== $scope.SALDO_INICIAL.id) {
                            var pago = {pago: ConvertirALiteral(ingreso.haber.toFixed(2))}
                            $scope.imprimirReciboVencimientoCreditoProforma(pago, res.venta, ingreso.haber);
                        }
                       
                    } else {
                        if (ingreso.concepto !== $scope.SALDO_INICIAL.id) {
                            var pago = {pago: ConvertirALiteral(ingreso.haber.toFixed(2))}
                            $scope.imprimirReciboVencimientoCredito(pago, res.venta, ingreso.haber, true);
                        }
                    }
                    // 
                    // if (ingreso.concepto !== $scope.SALDO_INICIAL.id) {
                    //     $scope.imprimirReciboVencimientoCredito(pago, res.venta, ingreso.haber);
                    //     $scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
                    // }
                    $scope.verificarVencimientosCreditos($scope.usuario.id_empresa);

                    // $scope.recargarItemsTabla()
                    $scope.filtrarTransacciones($scope.filtro)
                    // ingreso.fecha = ingreso.fecha.toLocaleDateString()
                    $scope.cerrarModalNuevoIngreso()
                    $scope.obtenerVencimientos()
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                ingreso.fecha = new Date(ingreso.fecha).toLocaleDateString()
                blockUI.stop()
            })
        }

        $scope.guardarEgreso = function (egreso) {
            blockUI.start()
            egreso.fecha = new Date($scope.convertirFecha(egreso.fecha))
            // egreso.haber = 0
            // egreso.debe = egreso.monto
            var prom = TransaccionEgresoBanco($scope.usuario.id_empresa, egreso, $scope.usuario.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                    egreso.fecha = egreso.fecha.toLocaleDateString()
                } else {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.verificarVencimientosDeudas($scope.usuario.id_empresa);
                    // $scope.recargarItemsTabla()
                    $scope.filtrarTransacciones($scope.filtro)
                    $scope.cerrarModalNuevoEgreso()
                }
                blockUI.stop()
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
                egreso.fecha = egreso.fecha.toLocaleDateString()
                blockUI.stop()
            })
        }

        $scope.imprimirReciboVencimientoCreditoProforma = function (data, venta, pago) {

			blockUI.start();
			var doc = new PDFDocument({ size: [227, 353], margin: 10 });
			var stream = doc.pipe(blobStream());
			doc.moveDown(2);
			doc.font('Helvetica-Bold', 8);
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.font('Helvetica', 7);
			doc.text(venta.sucursal.nombre.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.text(venta.sucursal.direccion.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
				(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
				(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
			doc.text("TELF.: " + telefono, { align: 'center' });
			doc.moveDown(0.4);
			doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
			doc.moveDown(0.5);
			doc.font('Helvetica-Bold', 8);
			doc.text("RECIBO", { align: 'center' });
			doc.font('Helvetica', 7);
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			doc.text(venta.sucursal.nota_recibo_correlativo, { align: 'center' });
			//doc.text("NIT: "+$scope.usuario.empresa.nit,{align:'center'});

			//doc.text("FACTURA No: "+venta.factura,{align:'center'});
			doc.moveDown(0.4);
			//doc.text("AUTORIZACIÓN No: "+venta.autorizacion,{align:'center'});
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			//doc.text(venta.actividad.nombre,{align:'center'});
			doc.moveDown(0.6);
			var date = new Date();
			doc.text("FECHA : " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), { align: 'left' });
			doc.moveDown(0.4);
			doc.text("He recibido de : " + venta.cliente.razon_social, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.2);
			doc.text("                                        CONCEPTO                                   ", { align: 'left' });
			doc.moveDown(0.2);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			venta.fecha = new Date(venta.fecha);
			doc.text("Fecha: " + venta.fecha.getDate() + "/" + (venta.fecha.getMonth() + 1) + "/" + venta.fecha.getFullYear(), 15, 210);
			var textoFact = venta.factura
			doc.text(textoFact, 105, 210, { width: 100 });
			doc.text("Saldo Bs " + (venta.saldo - pago) + ".-", 105, 220, { width: 100 });
			doc.text("Bs " + pago + ".-", 170, 210, { width: 100 });

			doc.text("--------------", 10, 230, { align: 'right' });
			//oc.text("--------------------",{align:'right'});
			doc.moveDown(0.3);
			doc.text("TOTAL Bs.              " + pago.toFixed(2), { align: 'right' });
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.text("SON: " + data.pago, { align: 'left' });
			doc.moveDown(0.6);

			doc.moveDown(0.4);

			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);

			doc.text("-------------------------                       -------------------------", { align: 'center' });
			doc.text("ENTREGUE CONFORME            RECIBI CONFORME", { align: 'center' });
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}

        // $scope.seleccionarCredito = function (venta) {
        //     $scope.ingreso.cliente
        // }

        $scope.estadoConfirmado = function (transaccion) {
            blockUI.start()
            var err = true
            if (transaccion.seguimientos[0].id_entregado !== null && ((transaccion.seguimientos[0].id_devuelto !== null && !transaccion.seguimientos[0].proveedor) || (transaccion.seguimientos[0].id_devuelto === null && transaccion.seguimientos[0].proveedor))) {
                $scope.estadosTransaccion.map(function (estado, i) {
                    if (estado.nombre == "CONFIRMADO") {
                        transaccion.estado = estado
                        err = false
                    }
                })
                if (err) {
                    blockUI.stop()
                    $scope.mostrarMensaje('Hubo un error al confirmar el estado')
                    return
                } else {
                    var prom = TransaccionSeguimientoEstado($scope.usuario.id_empresa, transaccion.estado.id, $scope.usuario.id, transaccion.id)
                    prom.then(function (res) {
                        if (res.hasErr) {
                            $scope.mostrarMensaje(res.mensaje)
                        } else {
                            transaccion.estado.confirmado = true
                            $scope.filtrarTransacciones($scope.filtro)
                            // $scope.recargarItemsTabla()
                            $scope.mostrarMensaje(res.mensaje)
                        }
                        blockUI.stop()
                    }).catch(function (err) {
                        blockUI.stop()
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                        $scope.mostrarMensaje(msg)
                    })
                }
            } else {
                blockUI.stop()
                $scope.mostrarMensaje('No se puede confirmar el estado de la transacción, no existe información de seguimiento o esta inclompleta.')
            }
        }

        $scope.abrirModalNuevoIngreso = function () {
            $scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
            $scope.ingreso = {}
            $scope.ingreso.fecha = new Date().toLocaleDateString()
            $scope.abrirPopup($scope.modalNuevoIngreso)
        }

        $scope.abrirModalVerIngreso = function (ingreso) {
            $scope.ingreso = ingreso
            $scope.ingreso.fecha = new Date($scope.ingreso.fecha).toLocaleDateString()
            $scope.abrirPopup($scope.modalVerIngreso)
        }

        $scope.cerrarModalNuevoIngreso = function () {
            $scope.ingreso = undefined
            $scope.cerrarPopup($scope.modalNuevoIngreso)
        }

        $scope.cerrarModalVerIngreso = function () {
            $scope.ingreso = undefined
            $scope.cerrarPopup($scope.modalVerIngreso)
        }

        $scope.abrirModalNuevoEgreso = function () {
            $scope.egreso = {}
            $scope.egreso.fecha = new Date().toLocaleDateString()
            $scope.abrirPopup($scope.modalNuevoEgreso)
        }

        $scope.cerrarModalNuevoEgreso = function () {
            $scope.egreso = undefined
            $scope.cerrarPopup($scope.modalNuevoEgreso)
        }

        $scope.abrirModalVerEgreso = function (egreso) {
            $scope.egreso = egreso
            $scope.egreso.fecha = new Date().toLocaleDateString()
            $scope.abrirPopup($scope.modalVerEgreso)
        }

        $scope.cerrarModalVerEgreso = function () {
            $scope.egreso = undefined
            $scope.cerrarPopup($scope.modalVerEgreso)
        }

        $scope.abrirModalSeguimiento = function () {
            $scope.abrirPopup($scope.modalSeguimiento)
        }

        $scope.cerrarModalSeguimiento = function () {
            $scope.transaccion = undefined
            $scope.cerrarPopup($scope.modalSeguimiento)
        }

        $scope.obtenerSaldoDiaAnterior = function () {
            var hoy = new Date()
            var prom = obtenerSaldoCuenta($scope.usuario.id_empresa)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                } else {

                }
            })
        }

        $scope.abrirModalRevision = function (transaccion) {
            var prom = ClasesTipo('ESTRANS')
            var erro = true
            prom.then(function (res) {
                res.clases.map(function (clase, i) {
                    if (transaccion.id_estado == clase.id && clase.nombre === 'CONFIRMADO') {
                        erro = false
                    }
                    if (i === res.clases.length - 1) {
                        if (!erro) {
                            $scope.transaccion = transaccion
                            $scope.abrirPopup($scope.modalRevision)
                        } else {
                            $scope.mostrarMensaje('La transaccion no se puede cerrar, aún no ha sido confirmada.')
                        }
                    }
                })
            }).catch(function (err) {
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
            })

        }

        $scope.cerrarModalRevision = function () {
            $scope.transaccion = undefined
            $scope.cerrarPopup($scope.modalRevision)
        }

        $scope.abrirModalVencimientoCreditos = function () {
            // var promesa = VencimientosCreditosEmpresa(idEmpresa);
            // promesa.then(function (vencimientosCreditos) {
            //     for (var i = 0; i < vencimientosCreditos.length; i++) {
            //         var fecha = new Date(vencimientosCreditos[i].fecha);
            //         vencimientosCreditos[i].fecha_vencimiento = $scope.sumaFecha(vencimientosCreditos[i].dias_credito, fecha);
            //         for (var j = 0; j < vencimientosCreditos[i].ventaReprogramacionPagos.length; j++) {
            //             if (vencimientosCreditos[i].ventaReprogramacionPagos[j].activo) {
            //                 vencimientosCreditos[i].fecha_anterior = vencimientosCreditos[i].ventaReprogramacionPagos[j].fecha_anterior
            //             }
            //         }
            //     }
            //     $scope.vencimientoTotal = $scope.vencimientoTotal + vencimientosCreditos.length;
            //     $scope.vencimientosCreditosTransacciones = vencimientosCreditos;
            // });
            $scope.abrirPopup($scope.modalVencimientoCreditos)
        }

        $scope.establecerConceptoIngreso = function (ingreso) {
            ingreso.detalle = 'Cobro Factura N° ' + ingreso.venta.factura
            ingreso.factura = ingreso.venta.factura
            ingreso.haber = ingreso.venta.saldo
        }

        $scope.establecerConceptoEgreso = function (egreso) {
            egreso.detalle = 'Pago Factura N° ' + egreso.compra.factura
            egreso.factura = egreso.compra.factura
            egreso.debe = egreso.compra.saldo
        }

        $scope.cerrarModalVencimientoCreditos = function () {
            $scope.transaccion = undefined
            $scope.cerrarPopup($scope.modalVencimientoCreditos)
        }
        $scope.inicio()
    });