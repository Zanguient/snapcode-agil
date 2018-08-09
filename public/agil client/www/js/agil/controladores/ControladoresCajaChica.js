angular.module('agil.controladores')

    .controller('ControladorCajaChica', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
        ClasesTipoEmpresa, ClasesTipo, GuardarSolicitudCajaChica, GuardarConceptoMovimientoCajaChica,
        ObtenerConceptoMovimientoCajaChica, SolicitudesCajaPaginador, ObtenerTodoPersonal, $filter, Paginator, VerificarUsuarioEmpresa,
        NuevoComprobante, ProveedoresNit, GuardarCajaChica, IngresosCajaPaginador, ObtenerDatosCierreCaja, CierreCajaCPaginador) {


        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalSolicitudCajaChica = 'dialog-solicitud'
        $scope.idModalConceptosMovimiento = 'dialog-conceptos-movimiento'
        $scope.idModalEliminarSolicitud = 'dialog-eliminar-solicitud'
        $scope.idModalVerificarAutorizacion = 'modal-verificar-autorizacion'
        $scope.idModalRegistroCajaChica = 'dialog-registro-caja-chica'
        $scope.idModalKardexCajaChica = 'dialog-kardex-caja-chica'
        $scope.idModalIngresosCajaChica = 'dialog-kardex-ingresos'
        $scope.idModalRegistroIngresoCajaChica = 'dialog-registro-ingreso-caja-chica'
        $scope.idModalHistorialCierreCajaChica = 'dialog-kardex-cierre-caja-chica'
        $scope.inicio = function () {
            $scope.obtenerTiposMovimiento()
            $scope.obtenerConceptosMovimiento()
            $scope.obtenerTiposEstados()
            $scope.obtenerListaSolicitudes()
            $scope.obtenerMovimientosIngreso()
            $scope.obtenerTiposDePago()
            $scope.sucursales = $scope.obtenerSucursales();
            $scope.ConceptosMovimiento = []
            $scope.tipoFiltro = "TODOS"
        }


        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsCajaChicas($scope.idModalSolicitudCajaChica, $scope.idModalConceptosMovimiento, $scope.idModalEliminarSolicitud, $scope.idModalVerificarAutorizacion,
                $scope.idModalRegistroCajaChica, $scope.idModalKardexCajaChica, $scope.idModalIngresosCajaChica, $scope.idModalRegistroIngresoCajaChica, $scope.idModalHistorialCierreCajaChica);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            blockUI.stop();
        });

        /* $scope.abrirModalSolicitudCajaChica = function (verOEditar) {
            if (verOEditar == undefined) {
                $scope.solicitud = { fecha: new Date() }
            }
            $scope.filtrarPersonal()
            $scope.abrirPopup($scope.idModalSolicitudCajaChica);
        }
        $scope.cerrarModalSolicitudCajaChica = function () {
            $scope.cerrarPopup($scope.idModalSolicitudCajaChica);
        }
        $scope.abrirModalConceptosMovimiento = function () {
            $scope.clase = { edit: false }
            $scope.abrirPopup($scope.idModalConceptosMovimiento);
        }
        $scope.cerrarModalConceptosMovimiento = function () {
            $scope.cerrarPopup($scope.idModalConceptosMovimiento);
        } */
        $scope.abrirModalKardexCajaChica = function (datos) {
            $scope.solicitud = datos
            $scope.abrirPopup($scope.idModalKardexCajaChica);
        }
        $scope.cerrarModalKardexCajaChica = function () {
            $scope.cerrarPopup($scope.idModalKardexCajaChica);
        }
        $scope.abrirModalIngresosCajaChica = function () {
            $scope.obtenerListaIngresos()
            $scope.abrirPopup($scope.idModalIngresosCajaChica);
        }
        $scope.cerrarModalIngresosCajaChica = function () {
            $scope.cerrarPopup($scope.idModalIngresosCajaChica);
        }
        $scope.abrirModalHistorialCierreCajaChica = function () {
            $scope.obtenerListaCierresCajaChica()
            $scope.abrirPopup($scope.idModalHistorialCierreCajaChica);
        }
        $scope.cerrarModalHistorialCierreCajaChica = function () {
            $scope.cerrarPopup($scope.idModalHistorialCierreCajaChica);
        }
        $scope.abrirModalEliminarSolicitud = function (datos) {
            $scope.solicitud = datos
            $scope.abrirPopup($scope.idModalEliminarSolicitud);
        }
        $scope.cerrarModalEliminarSolicitud = function () {
            $scope.cerrarPopup($scope.idModalEliminarSolicitud);
        }

        $scope.abrirModalRegistroCajaChica = function (datos, edicion, ver, hijo) {
            if (datos) {
                if (edicion) {
                    if (hijo) {
                        $scope.cajaChica = Object.assign({}, hijo)
                        $scope.cajaChica.compra = Object.assign({}, hijo.compra)                       
                        $scope.cajaChica.solicitud = Object.assign({}, datos)
                        $scope.cajaChica.solicitud.cajasChicas[0].saldo+=$scope.cajaChica.compra.total                       
                        $scope.cajaChica.verDatosCompra = true
                        $scope.cajaChica.descuentoGasolina = false
                        if ($scope.cajaChica.fecha.length > 10) $scope.cajaChica.fecha = $scope.fechaATexto($scope.cajaChica.fecha)
                        $scope.cajaChica.compra.fechaTexto = $scope.fechaATexto(hijo.compra.fecha)
                    } else {
                        $scope.cajaChica = Object.assign({}, datos.cajasChicas[0])
                        $scope.cajaChica.compra = Object.assign({}, datos.cajasChicas[0].compra)                     
                        $scope.cajaChica.solicitud = Object.assign({}, datos)
                        $scope.cajaChica.solicitud.cajasChicas[0].saldo+=$scope.cajaChica.compra.total          
                        $scope.cajaChica.verDatosCompra = true
                        $scope.cajaChica.descuentoGasolina = false
                        if ($scope.cajaChica.fecha.length > 10) $scope.cajaChica.fecha = $scope.fechaATexto($scope.cajaChica.fecha)
                        $scope.cajaChica.compra.fechaTexto = $scope.fechaATexto(datos.cajasChicas[0].compra.fecha)
                    }

                } else {
                    if (datos.cajasChicas.length > 0) {
                        var total = 0
                    } else {
                        var total = datos.monto
                    }
                    $scope.cajaChica = {
                        fecha: $scope.fechaATexto(new Date()),
                        compra: {
                            fecha: $scope.fechaATexto(new Date()),
                            generado_por_pedido: false,
                            usar_producto: true, movimiento: { clase: {} }, tipo_retencion: true,
                            total: total, id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, proveedor: {}, id_tipo_pago: $scope.tiposPago[0].id, tipoPago: $scope.tiposPago[0],
                            detallesCompra: [], descuento_general: false, tipo_descuento: false, codigo_control: 0, autorizacion: 0,
                            tipo_recargo: false, descuento: 0, recargo: 0, ice: 0, excento: 0
                        }, solicitud: datos, verDatosCompra: false, descuentoGasolina: false
                    }
                }
                if (ver) {
                    $scope.cajaChica.ver = true
                    $scope.cajaChica.verDatosCompra = true
                } else {
                    $scope.cajaChica.ver = false
                }
            } else {

                if (hijo) {
                    $scope.cajaChica = Object.assign({}, hijo)
                    $scope.cajaChica.compra = Object.assign({}, hijo.compra)
                    $scope.cajaChica.solicitud = null
                    $scope.cajaChica.verDatosCompra = true
                    $scope.cajaChica.descuentoGasolina = false
                    if ($scope.cajaChica.fecha.length > 10) $scope.cajaChica.fecha = $scope.fechaATexto($scope.cajaChica.fecha)
                    $scope.cajaChica.compra.fechaTexto = $scope.fechaATexto(hijo.compra.fecha)
                } else {
                    $scope.cajaChica = {
                        fecha: $scope.fechaATexto(new Date()),
                        compra: {
                            fecha: $scope.fechaATexto(new Date()),
                            generado_por_pedido: false,
                            usar_producto: true, movimiento: { clase: {} }, tipo_retencion: true,
                            total: "", id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, proveedor: {}, id_tipo_pago: $scope.tiposPago[0].id, tipoPago: $scope.tiposPago[0],
                            detallesCompra: [], descuento_general: false, tipo_descuento: false, codigo_control: 0, autorizacion: 0,
                            tipo_recargo: false, descuento: 0, recargo: 0, ice: 0, excento: 0
                        }, solicitud: null, verDatosCompra: false, descuentoGasolina: false
                    }
                }
                if (ver) {
                    $scope.cajaChica.ver = true
                    $scope.cajaChica.verDatosCompra = true
                } else {
                    $scope.cajaChica.ver = false
                }
            }
            $scope.abrirPopup($scope.idModalRegistroCajaChica);
        }
        $scope.abrirModalRegistroIngresoCajaChica = function (datos, ver) {
            if (datos) {
                $scope.cajaChica = datos
                $scope.cajaChica.fecha = $scope.fechaATexto(new Date(datos.fecha))
                $scope.cajaChica.total = datos.monto
            } else {
                $scope.cajaChica = {
                    fecha: $scope.fechaATexto(new Date()),
                    solicitud: null, verDatosCompra: false, descuentoGasolina: false
                }
            }
            if (ver) {
                $scope.cajaChica.ver = true
            }


            $scope.abrirPopup($scope.idModalRegistroIngresoCajaChica);
        }
        $scope.cerrarModalRegistroIngresoCajaChica = function () {

            $scope.cerrarPopup($scope.idModalRegistroIngresoCajaChica);
        }
        $scope.obtenerTiposDePago = function () {
            blockUI.start();
            var promesa = ClasesTipo("TIPA");
            promesa.then(function (entidad) {
                $scope.tiposPago = entidad.clases;
                blockUI.stop();
            });
        }

        $scope.cerrarModalRegistroCajaChica = function () {

            $scope.cerrarPopup($scope.idModalRegistroCajaChica);
        }
        $scope.abrirModalVerificarAutorizacion = function (dato) {
            $scope.solicitud = dato
            $scope.tipoDatosPermiso = "autorizacion"
            $scope.abrirPopup($scope.idModalVerificarAutorizacion);
        }
        $scope.cerrarModalVerificarAutorizacion = function () {

            $scope.cerrarPopup($scope.idModalVerificarAutorizacion);
        }


        $scope.obtenerTiposMovimiento = function () {
            var promesa = ClasesTipo('CM_CCH')
            promesa.then(function (dato) {
                $scope.tiposMovimientos = dato
            })
        }
        $scope.obtenerTiposEstados = function () {
            var promesa = ClasesTipo('ES_CCH')
            promesa.then(function (dato) {
                $scope.tiposEstados = dato.clases
            })
        }
        $scope.obtenerConceptosMovimiento = function () {
            var promesa = ObtenerConceptoMovimientoCajaChica($scope.usuario.id_empresa)
            promesa.then(function (dato) {
                $scope.ConceptosMovimiento = dato
                /*  $scope.cerrarModalConceptosMovimiento() */
            })

        }
        /* $scope.AgregarConceptosMovimientoCajaChica = function (clase) {
            clase.habilitado = true
            if (!clase.edit) {
                $scope.ConceptosMovimiento.push(clase)
            } else {
                $scope.clase = { edit: false }
            }
        }
        $scope.editarConceptoMovimientoCajaChica = function (clase) {
            clase.edit = true
            $scope.clase = clase
        }
        $scope.cancelarEdicionConcepotMovimientoCajaChica = function (clase) {
            $scope.clase = { edit: false }
        } */

        /*   $scope.guardarConceptoMovimientoCajaChica = function () {
              var promesa = GuardarConceptoMovimientoCajaChica($scope.usuario.id_empresa, $scope.ConceptosMovimiento)
              promesa.then(function (dato) {
                  $scope.obtenerConceptosMovimiento()
                  $scope.mostrarMensaje(dato.mensaje)
              })
          } */
        /* $scope.guardarSolicitudCajaChica = function () {
            $scope.solicitud.usuario = $scope.usuario
            $scope.tiposEstados.forEach(function (tipo, index, array) {
                if ($scope.usuario.autorizacion_caja_chica) {
                    if (tipo.nombre === 'AUTORIZADO') {
                        $scope.solicitud.estado = tipo
                    }
                } else {
                    if (tipo.nombre === 'PENDIENTE') {
                        $scope.solicitud.estado = tipo
                    }

                }
                if (index === (array.length - 1)) {
                    
                    var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                    promesa.then(function (dato) {
                        $scope.cerrarModalSolicitudCajaChica()
                        $scope.mostrarMensaje(dato.mensaje)
                    })
                }

            });

        } */
        /* $scope.buscarPersonal = function (query) {
            if (query != "" && query != undefined) {
                var promesa = $filter('filter')($scope.todoPersonal, query);
                return promesa;
            }
        }
 */
        /* $scope.filtrarPersonal = function (query) {
            if ($scope.todoPersonal !== undefined) {
                $scope.personalProcesado = $filter('filter')($scope.todoPersonal, query);
            } else {
                var prom = ObtenerTodoPersonal($scope.usuario.empresa.id)
                prom.then(function (personal) {
                    $scope.todoPersonal = personal.personal
                    $scope.personalProcesado = personal.personal
                    if (personal.mensaje !== undefined) {
                        $scope.mostrarMensaje(personal.mensaje)
                    }
                }, function (err) {
                    $scope.mostrarMensaje("Se perdió la conexión.")
                })
            }
        } */
        /* $scope.establecerPersonal = function (personal) {

            var personalSeleccionado = { id: personal.id, persona: { nombre_completo: personal.persona.nombre_completo } }

        } */
        $scope.obtenerListaSolicitudes = function (filtro) {
            $scope.paginator = Paginator();
            $scope.paginator.column = "id";
            $scope.paginator.direccion = "asc";
            $scope.paginator.itemsPerPage = 10;
            if (filtro) {
                $scope.filtro = filtro
            } else {
                $scope.filtro = {
                    empresa: $scope.usuario.id_empresa,
                    inicio: "",
                    fin: "",
                    solicitante: "",
                    usuario: "",
                    estado: "",
                    concepto: "",
                    movimiento: "",
                    id_usuario_no_autorizado:($scope.usuario.autorizacion_caja_chica)?"":$scope.usuario.id
                }
            }

            $scope.paginator.callBack = $scope.listaSolicitudesCajaChica;
            $scope.paginator.getSearch("", $scope.filtro, null);


        }
        $scope.listaSolicitudesCajaChica = function () {
            blockUI.start()
            var promesa = SolicitudesCajaPaginador($scope.paginator)
            promesa.then(function (datos) {
                blockUI.stop()
                $scope.totalRlCaja = datos.totalRlCaja
                $scope.totalCaja = datos.total
                $scope.paginator.setPages(datos.paginas);
                $scope.solicitudesCajaChica = datos.solicitudes
            })
        }
        $scope.obtenerListaIngresos = function () {
            $scope.paginator = Paginator();
            $scope.paginator.column = "id";
            $scope.paginator.direccion = "asc";
            $scope.paginator.itemsPerPage = 10;
            $scope.filtro2 = {
                empresa: $scope.usuario.id_empresa,
                inicio: "",
                fin: "",
            }
            $scope.paginator.callBack = $scope.listaIngresosCajaChica;
            $scope.paginator.getSearch("", $scope.filtro2, null);


        }
        $scope.listaIngresosCajaChica = function () {
            blockUI.start()
            var promesa = IngresosCajaPaginador($scope.paginator)
            promesa.then(function (datos) {
                blockUI.stop()
                $scope.paginator.setPages(datos.paginas);
                $scope.IngresosCajaChica = datos.ingresos
            })
        }
        $scope.obtenerListaCierresCajaChica = function () {
            $scope.paginator = Paginator();
            $scope.paginator.column = "id";
            $scope.paginator.direccion = "asc";
            $scope.paginator.itemsPerPage = 10;
            $scope.filtro2 = {
                empresa: $scope.usuario.id_empresa,
                inicio: "",
                fin: "",
            }
            $scope.paginator.callBack = $scope.listaCierresCajaChica;
            $scope.paginator.getSearch("", $scope.filtro2, null);


        }
        $scope.listaCierresCajaChica = function () {
            blockUI.start()
            var promesa = CierreCajaCPaginador($scope.paginator)
            promesa.then(function (datos) {
                blockUI.stop()
                $scope.paginator.setPages(datos.paginas);
                datos.cierreCaja.forEach(function (dato, index, array) {
                    dato.saldo_final = dato.saldo_inicial
                    dato.detalleCierreCaja.forEach(function (detalle) {
                        if (detalle.concepto.concepto.nombre == "INGRESO") {
                            dato.saldo_final += detalle.monto
                        } else {
                            dato.saldo_final -= detalle.monto
                        }
                    })
                    if (index == (array.length - 1)) {
                        $scope.cierresCajaChica = datos.cierreCaja
                    }
                })

            })
        }

        /*  $scope.verSolicitudCajaChica = function (datos) {
             $scope.solicitud = datos
             $scope.solicitud.ver = true
             $scope.abrirModalSolicitudCajaChica(true)
         }
         $scope.editarSolicitudCajaChica = function (datos) {
             $scope.solicitud = datos
             $scope.abrirModalSolicitudCajaChica(true)
         } */
        $scope.eliminarSolicitud = function () {
            $scope.tiposEstados.forEach(function (tipo, index, array) {
                if (tipo.nombre === 'ANULADO') {
                    $scope.solicitud.estado = tipo
                }
                if (index === (array.length - 1)) {
                    $scope.solicitud.eliminado = true
                    var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                    promesa.then(function (dato) {
                        $scope.cerrarModalEliminarSolicitud()
                        $scope.mostrarMensaje(dato.mensaje)
                    })
                }

            });
        }

        $scope.verificarPerimisoAutorizacion = function (cuenta) {
            cuenta.nombre_usuario = $scope.usuario.nombre_usuario
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {

                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    /*  cuenta.abierto= cuenta.abierto; */
                    if ($scope.tipoDatosPermiso == "autorizacion") {
                        $scope.tiposEstados.forEach(function (tipo, index, array) {
                            if (tipo.nombre === 'AUTORIZADO') {
                                $scope.solicitud.estado = tipo
                            }
                            if (index === (array.length - 1)) {
                                var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                                promesa.then(function (dato) {
                                    $scope.cerrarModalVerificarAutorizacion()
                                    $scope.mostrarMensaje(dato.mensaje)
                                })
                            }

                        });
                    }
                }
            })
        }
        $scope.verDatosCompra = function () {
            $scope.cajaChica.verDatosCompra = ($scope.cajaChica.verDatosCompra) ? false : true
        }
        $scope.obtenerMovimientosIngreso = function (compra) {
            blockUI.start();
            var promesa = ClasesTipo("MOVING");
            promesa.then(function (entidad) {
                $scope.movimientosIngreso = entidad.clases;
                var arreglo = []
                $scope.movimientosIngreso.forEach(function (mov, index, array) {
                    if (mov.nombre === $scope.diccionario.MOVING_INVENTARIO_INICIAL ||
                        mov.nombre === $scope.diccionario.MOVING_POR_TRASPASO ||
                        mov.nombre === $scope.diccionario.MOVING_POR_DEVOLUCION || mov.nombre === $scope.diccionario.MOVING_POR_AJUSTE) {
                        arreglo.push(index)
                    }

                });
                arreglo.reverse().forEach(function (dato) {
                    $scope.movimientosIngreso.splice(dato, 1)
                })

                blockUI.stop();
            });
        }
        $scope.buscarCuentasCajaChica = function (query) {

            return NuevoComprobante($scope.mostrarMensaje, null, null, $scope.usuario, null, null, null, null, null, null, query)
        }
        $scope.buscarProveedor = function (query) {
            if (query != "" && query != undefined) {
                var promesa = ProveedoresNit($scope.usuario.id_empresa, query);
                return promesa;
            }
        };

        $scope.establecerProveedor = function (proveedor) {
            $scope.cajaChica.compra.proveedor = proveedor;
        }
        $scope.interceptarTecla = function (keyEvent, elemento, esEnfocar) {
            if (keyEvent.which === 13) {
                if (esEnfocar) {
                    $scope.enfocar(elemento);
                } else {
                    $timeout(function () {
                        $('#' + elemento).trigger('click');
                    }, 0);
                }
            }
        }
        $scope.obtenerSucursales = function () {
            var sucursales = [];
            for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
                sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
            }
            return sucursales;
        }
        $scope.obtenerAlmacenes = function (idSucursal) {
            $scope.almacenes = [];
            var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
            $scope.almacenes = sucursal.almacenes;
            if ($scope.cajaChica.compra.id == undefined) {
                $scope.cajaChica.compra.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : null;
            }
        }

        $scope.verificarMomivmiento = function (compra) {
            if (compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
                compra.usar_producto = false
            } else if (compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
                compra.usar_producto = true
            } else if (compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_IMPORTACION) {
                compra.factura = 0
                compra.autorizacion = 3
                compra.codigo_control = 0
                compra.descuento_general = false
                compra.usar_producto = true
            }
        }
        $scope.generarDescuentoGasolina = function () {
            $scope.cajaChica.descuentoGasolina = ($scope.cajaChica.descuentoGasolina) ? false : true
            if ($scope.cajaChica.descuentoGasolina) {
                $scope.cajaChica.compra.descuento_general = true
                $scope.cajaChica.compra.descuento = 0
                $scope.cajaChica.compra.recargo = 0
                $scope.cajaChica.compra.ice = 0
                $scope.cajaChica.compra.excento = ($scope.cajaChica.compra.total * 30) / 100
            } else {
                $scope.cajaChica.compra.descuento_general = false
                $scope.cajaChica.compra.descuento = 0
                $scope.cajaChica.compra.recargo = 0
                $scope.cajaChica.compra.ice = 0
                $scope.cajaChica.compra.excento = 0
            }
        }
        $scope.guardarCajaChica = function () {
            blockUI.start()
            if ($scope.cajaChica.solicitud) {
                $scope.cajaChica.fecha = new Date($scope.convertirFecha($scope.cajaChica.fecha))
                $scope.cajaChica.compra.fecha = new Date($scope.convertirFecha($scope.cajaChica.compra.fechaTexto))
                var tiempoActual = new Date();
                $scope.cajaChica.compra.fecha.setHours(tiempoActual.getHours())
                $scope.cajaChica.compra.fecha.setMinutes(tiempoActual.getMinutes())
                $scope.cajaChica.compra.fecha.setSeconds(tiempoActual.getSeconds())
                $scope.cajaChica.fecha.setHours(tiempoActual.getHours())
                $scope.cajaChica.fecha.setMinutes(tiempoActual.getMinutes())
                $scope.cajaChica.fecha.setSeconds(tiempoActual.getSeconds())
                if ($scope.cajaChica.solicitud != null) {
                    if ($scope.cajaChica.solicitud.concepto.concepto.nombre == "KARDEX") {
                        if ($scope.cajaChica.solicitud.cajasChicas.length > 0) {
                            var varlorcomparar = $scope.cajaChica.solicitud.cajasChicas[0].saldo
                        } else {
                            var varlorcomparar = -1
                        }
                        if ($scope.cajaChica.compra.total == varlorcomparar) {
                            $scope.tiposEstados.forEach(function (tipo, index, array) {
                                if (tipo.nombre === 'PROCESADO') {
                                    $scope.cajaChica.solicitud.estado = tipo
                                }
                                if (index === (array.length - 1)) {
                                    var promesa = GuardarCajaChica($scope.cajaChica, $scope.usuario.id_empresa)
                                    promesa.then(function (dato) {
                                        blockUI.stop()
                                        $scope.obtenerListaSolicitudes()
                                        $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud,dato.cajaChica)
                                        $scope.mostrarMensaje(dato.mensaje)
                                        $scope.cerrarModalRegistroCajaChica()
                                    })
                                }

                            });
                        } else {
                            var promesa = GuardarCajaChica($scope.cajaChica, $scope.usuario.id_empresa)
                            promesa.then(function (dato) {
                                blockUI.stop()
                                $scope.obtenerListaSolicitudes()
                                $scope.mostrarMensaje(dato.mensaje)
                                $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud,dato.cajaChica)
                                $scope.cerrarModalRegistroCajaChica()
                            })
                        }
                    } else {
                        $scope.tiposEstados.forEach(function (tipo, index, array) {
                            if (tipo.nombre === 'PROCESADO') {
                                $scope.cajaChica.solicitud.estado = tipo
                            }
                            if (index === (array.length - 1)) {
                                var promesa = GuardarCajaChica($scope.cajaChica, $scope.usuario.id_empresa)
                                promesa.then(function (dato) {
                                    blockUI.stop()
                                    $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud,dato.cajaChica)
                                    $scope.obtenerListaSolicitudes()
                                    $scope.mostrarMensaje(dato.mensaje)
                                    $scope.cerrarModalRegistroCajaChica()
                                })
                            }

                        });
                    }

                } else {
                    var promesa = GuardarCajaChica($scope.cajaChica, $scope.usuario.id_empresa)
                    promesa.then(function (dato) {
                        blockUI.stop()
                        $scope.obtenerListaSolicitudes()
                        $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud,dato.cajaChica)
                        $scope.mostrarMensaje(dato.mensaje)
                        $scope.cerrarModalRegistroCajaChica()
                    })
                }
            } else {
                $scope.cajaChica.fecha = new Date($scope.convertirFecha($scope.cajaChica.fecha))
                var tiempoActual = new Date();
                $scope.cajaChica.fecha.setHours(tiempoActual.getHours())
                $scope.cajaChica.fecha.setMinutes(tiempoActual.getMinutes())
                $scope.cajaChica.fecha.setSeconds(tiempoActual.getSeconds())
                var promesa = GuardarCajaChica($scope.cajaChica, $scope.usuario.id_empresa)
                promesa.then(function (dato) {
                    blockUI.stop()
                    $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud,dato.cajaChica)
                    $scope.obtenerListaIngresos()
                    $scope.mostrarMensaje(dato.mensaje)
                    $scope.cerrarModalRegistroIngresoCajaChica()
                })
            }
        }
        $scope.filterPorTipo = function (dato, filtro) {
            $scope.tipoFiltro = dato
            if (dato == "TODOS") {
                filtro.movimiento = 0
                $scope.paginator.getSearch($scope.paginator.search, filtro, null)
            } else {
                $scope.tiposMovimientos.clases.forEach(function (movimiento, index, array) {
                    if (movimiento.nombre == dato) {
                        filtro.movimiento = movimiento.id
                    }
                    if (index === (array.length - 1)) {
                        $scope.paginator.getSearch($scope.paginator.search, filtro, null)
                    }
                })
            }
        }


        $scope.obtenerDatosCierreCaja = function () {
            blockUI.start()
            var fecha = new Date()
            var promesa = ObtenerDatosCierreCaja($scope.usuario.id_empresa, fecha, $scope.totalRlCaja)
            promesa.then(function (dato) {
                blockUI.stop()
                var datos = dato.cierreCaja
                $scope.generarPdfCajaChica(datos)
            })
        }


        $scope.generarPdfCajaChica = function (datos) {
            blockUI.start();
          
            var doc = new PDFDocument({ size: 'letter', margin: 10 });
            var stream = doc.pipe(blobStream());
            // draw some text
            var totalCosto = 0;
            var y = 120, itemsPorPagina = 33, items = 0, pagina = 1, totalPaginas = Math.ceil(datos.detalleCierreCaja.length / itemsPorPagina);
            $scope.dibujarCabeceraPDFCajaChica(doc, 1, totalPaginas, datos);
            doc.font('Helvetica', 8);
            var saldo = datos.saldo_inicial
            for (var i = 0; i < datos.detalleCierreCaja.length && items <= itemsPorPagina; i++) {
                var caja = datos.detalleCierreCaja[i]
                doc.rect(30, y - 10, 555, 30).stroke();
                doc.text(caja.id, 45, y);
                doc.text($scope.fechaATexto(new Date(caja.fecha)), 85, y);
                if (caja.solicitud) doc.text(caja.solicitud.solicitante.persona.nombre_completo, 150, y, { width: 120 });
                doc.text(caja.concepto.nombre, 270, y, { width: 150 });
                if (caja.compra) doc.text(caja.compra.factura, 430, y);
                doc.text("(" + number_format(caja.monto, 2) + ".-)", 490, y);
                if (caja.concepto.concepto.nombre == "INGRESO") {
                    saldo += caja.monto
                } else {
                    saldo -= caja.monto
                }
                doc.text(saldo.toFixed(2) + ".-", 540, y);
                y = y + 30;
                items++;

                if (items == itemsPorPagina) {
                    doc.addPage({ margin: 0, bufferPages: true });
                    y = 120;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.dibujarCabeceraPDFCajaChica(doc, pagina, totalPaginas, datos);
                    doc.font('Helvetica', 8);
                }
            }
            /*  doc.rect(30, y - 10, 555, 20).stroke();
             doc.font('Helvetica-Bold', 8);
             doc.text("Total General", 350, y);
             doc.text(totalCosto, 446, y, { width: 50, align: "right" }); */
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();

        }
        $scope.dibujarCabeceraPDFCajaChica = function (doc, pagina, totalPaginas, datos) {
            doc.font('Helvetica-Bold', 12);
            doc.text("CIERRE CAJA CHICA", 0, 25, { align: "center" }); +
                doc.font('Helvetica', 8);
            doc.text("DEL " + $scope.fechaATexto(datos.inicio) + " AL " + $scope.fechaATexto(datos.fin), 0, 35, { align: "center" });
            doc.font('Helvetica-Bold', 8);
            doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
            /* doc.rect(30, 50, 555, 30).stroke(); */
            doc.font('Helvetica-Bold', 8);
            doc.text("Saldo Inicial : bs. " + number_format(datos.saldo_inicial, 2) + ".-", 45, 60);
            doc.font('Helvetica', 8);
            /*  doc.text(proveedor.razon_social, 140, 60); */
            doc.rect(30, 80, 555, 30).stroke();
            doc.font('Helvetica-Bold', 8);
            doc.text("N°", 45, 90);
            doc.text("Fecha", 85, 90, { width: 50 });
            doc.text("Nombre", 150, 90, { width: 60 });
            doc.text("Gasto", 270, 90, { width: 50 });
            doc.text("N° factura", 430, 90, { width: 50 });
            doc.text("Monto", 490, 90, { width: 50 });
            doc.text("Saldo", 540, 90, { width: 50 });
            doc.font('Helvetica', 8);
        }

        $scope.generarPdfBoletaCajaChica = function (solicitud, caja) {
          
            convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                var imagen = imagenEmpresa;
            var doc = new PDFDocument({ size: 'letter', margin: 10 });
            var stream = doc.pipe(blobStream());
            // draw some text
            var totalCosto = 0;
            var y = 45;
            $scope.dibujarPDFBoletaCajaChica(doc, solicitud, caja, y,imagen);
            
            y += 370
            doc.rect(0, y-35, 650, 0).dash(2, { space: 5 }).stroke()
            $scope.dibujarPDFBoletaCajaChica(doc, solicitud, caja, y,imagen);
           

            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            
        });
        }
        $scope.dibujarPDFBoletaCajaChica = function (doc, solicitud, caja, y,imagen) {
            doc.font('Helvetica-Bold', 12);
            doc.image(imagen, 30, y-20, { fit: [80, 80] });
            if(caja.concepto.concepto.nombre!="INGRESO"){
                doc.text("SALIDA CAJA CHICA", 0, y + 20, { align: "center" });                
            }else{
                doc.text("INGRESO CAJA CHICA", 0, y + 20, { align: "center" });
            }
            
            doc.font('Helvetica-Bold', 8);
            doc.text(caja.sucursal.nombre, 0, y + 30, { align: "center" });
            doc.text("Nro. "+caja.numero_correlativo, 0, y + 40, { align: "center" });
            doc.rect(465, y, 90, 20).dash(0, { space: 0 }).stroke()
            doc.rect(435, y,30, 20).dash(0, { space: 0 }).stroke()
            doc.rect(465, y + 20, 90, 20).dash(0, { space: 0 }).stroke()
            doc.rect(435, y + 20, 30, 20).dash(0, { space: 0 }).stroke()
            doc.text("Bs.", 445, y + 10);
            if(caja.id_padre){
                doc.text(caja.pagado.toFixed(2) , 485, y + 10);
            }else{
                doc.text(caja.monto.toFixed(2) , 485, y + 10);
            }
           
            doc.text("$us.", 445, y + 30);
            doc.font('Helvetica', 8);
            doc.text("Fecha en texto", 45, y + 65);
            if(solicitud){
                var nombre=solicitud.solicitante.persona.nombre_completo
            }else{
                var nombre=$scope.usuario.empresa.razon_social
            }
            doc.text("Recibí de .: " +nombre, 45, y + 80);
            if(caja.id_padre){
                doc.text("La suma de .: "+ConvertirALiteral(caja.pagado.toFixed(2)), 45, y + 95);
            }else{
                doc.text("La suma de .: "+ConvertirALiteral(caja.monto.toFixed(2)), 45, y + 95);
            }
           
           
            if(caja.concepto.concepto.nombre!="INGRESO"){
                doc.text("Bajo el concepto de: "+caja.concepto.nombre, 45, y + 110);
                y+=15
            }
            doc.text("Por concepto de:", 45, y + 110);
            doc.font('Helvetica-Bold', 8);
            doc.text("DETALLE", 200, y + 125);
            doc.text(caja.detalle, 55, y + 155,{width:410});
            doc.text("IMPORTE", 485, y + 125);
            doc.font('Helvetica', 8);
            if(caja.id_padre){
                doc.text(caja.pagado.toFixed(2), 485, y + 155);
            }else{
                doc.text(caja.monto.toFixed(2), 485, y + 155);
            }
           
            
            doc.font('Helvetica', 8);
            doc.rect(45, y + 120, 420, 20).dash(0, { space: 0 }).stroke().stroke();
            doc.rect(45, y + 140, 420, 60).dash(0, { space: 0 }).stroke().stroke();
            doc.rect(465, y + 120, 90, 20).dash(0, { space: 0 }).stroke().stroke();
            doc.rect(465, y + 140, 90, 60).dash(0, { space: 0 }).stroke().stroke();
            doc.font('Helvetica', 6);
            doc.rect(70, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
           // doc.text(solicitud.usuario.persona.nombre_completo, 45, y + 285,{width:150,align: "center"});
           if(caja.concepto.concepto.nombre=="INGRESO"){
            doc.text("Autorizado", 45, y + 295,{width:150,align: "center"});
            doc.rect(250, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
            doc.text("Entregue Conforme", 225, y + 295,{width:150,align: "center"});
            doc.rect(450, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
            doc.text($scope.usuario.persona.nombre_completo, 425, y + 285,{width:150,align: "center"});
            doc.text("Recibí Conforme", 425, y + 295,{width:150,align: "center"});
           }else{
            doc.text(solicitud.usuario.persona.nombre_completo, 45, y + 285,{width:150,align: "center"});
            doc.text("Autorizado", 45, y + 295,{width:150,align: "center"});
            doc.rect(250, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
            doc.text(solicitud.solicitante.persona.nombre_completo, 225, y + 285,{width:150,align: "center"});
            doc.text("Recibí Conforme", 225, y + 295,{width:150,align: "center"});
            doc.rect(450, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
            doc.text($scope.usuario.persona.nombre_completo, 425, y + 285,{width:150,align: "center"});
            doc.text("Entregue Conforme", 425, y + 295,{width:150,align: "center"});
           }
           
           var fechaActual=new Date()
            doc.text("Usuario.: "+$scope.usuario.nombre_usuario+" Hora.: "+fechaActual.getHours()+":"+fechaActual.getMinutes()+" imp.: "+$scope.fechaATexto(fechaActual), 425, y + 310,{width:150,align: "center"});
        }

        $scope.dibujarCuerpoPDFBoletaCajaChica = function (doc, solicitud, caja, y) {
            /*  doc.rect(30, y - 10, 555, 20).stroke(); */

        }
        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalSolicitudCajaChica);
            $scope.eliminarPopup($scope.idModalConceptosMovimiento)
            $scope.eliminarPopup($scope.idModalEliminarSolicitud)
            $scope.eliminarPopup($scope.idModalVerificarAutorizacion)
            $scope.eliminarPopup($scope.idModalRegistroCajaChica)
            $scope.eliminarPopup($scope.idModalKardexCajaChica)
            $scope.eliminarPopup($scope.idModalIngresosCajaChica)
            $scope.eliminarPopup($scope.idModalHistorialCierreCajaChica)
            $scope.eliminarPopup($scope.idModalRegistroIngresoCajaChica)
        });

        $scope.inicio();
    })














    .controller('ControladorSolicitudCajaChica', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
        ClasesTipoEmpresa, ClasesTipo, GuardarSolicitudCajaChica, GuardarConceptoMovimientoCajaChica,
        ObtenerConceptoMovimientoCajaChica, SolicitudesCajaPaginador, ObtenerTodoPersonal, $filter, Paginator, VerificarUsuarioEmpresa) {


        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalSolicitudCajaChica = 'dialog-solicitud'
        $scope.idModalConceptosMovimiento = 'dialog-conceptos-movimiento'
        $scope.idModalEliminarSolicitud = 'dialog-eliminar-solicitud'
        $scope.idModalVerificarAutorizacion = 'modal-verificar-autorizacion'

        $scope.inicio = function () {
            $scope.obtenerTiposMovimiento()
            $scope.obtenerConceptosMovimiento()
            $scope.obtenerTiposEstados()
            $scope.obtenerListaSolicitudes()
            $scope.ConceptosMovimiento = []
        }


        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsSolicitudCajaChicas($scope.idModalSolicitudCajaChica, $scope.idModalConceptosMovimiento, $scope.idModalEliminarSolicitud, $scope.idModalVerificarAutorizacion);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            blockUI.stop();
        });

        $scope.abrirModalSolicitudCajaChica = function (verOEditar) {
            if (verOEditar == undefined) {
                $scope.solicitud = { fecha: new Date() }
            }
            $scope.filtrarPersonal()
            $scope.abrirPopup($scope.idModalSolicitudCajaChica);
        }
        $scope.cerrarModalSolicitudCajaChica = function () {

            $scope.cerrarPopup($scope.idModalSolicitudCajaChica);
        }
        $scope.abrirModalConceptosMovimiento = function () {
            $scope.clase = { edit: false }
            $scope.abrirPopup($scope.idModalConceptosMovimiento);
        }
        $scope.cerrarModalConceptosMovimiento = function () {

            $scope.cerrarPopup($scope.idModalConceptosMovimiento);
        }
        $scope.abrirModalEliminarSolicitud = function (datos) {
            $scope.solicitud = datos
            $scope.abrirPopup($scope.idModalEliminarSolicitud);
        }
        $scope.cerrarModalEliminarSolicitud = function () {

            $scope.cerrarPopup($scope.idModalEliminarSolicitud);
        }
        $scope.abrirModalVerificarAutorizacion = function (dato) {
            $scope.solicitud = dato
            $scope.tipoDatosPermiso = "autorizacion"
            $scope.abrirPopup($scope.idModalVerificarAutorizacion);
        }
        $scope.cerrarModalVerificarAutorizacion = function () {

            $scope.cerrarPopup($scope.idModalVerificarAutorizacion);
        }


        $scope.obtenerTiposMovimiento = function () {
            var promesa = ClasesTipo('CM_CCH')
            promesa.then(function (dato) {
                $scope.tiposMovimientos = dato
            })
        }
        $scope.obtenerTiposEstados = function () {
            var promesa = ClasesTipo('ES_CCH')
            promesa.then(function (dato) {
                $scope.tiposEstados = dato.clases
            })
        }
        $scope.obtenerConceptosMovimiento = function () {
            var promesa = ObtenerConceptoMovimientoCajaChica($scope.usuario.id_empresa)
            promesa.then(function (dato) {
                $scope.ConceptosMovimiento = dato

                $scope.cerrarModalConceptosMovimiento()
            })

        }
        $scope.AgregarConceptosMovimientoCajaChica = function (clase) {
            clase.habilitado = true
            if (!clase.edit) {
                $scope.ConceptosMovimiento.push(clase)
            } else {
                $scope.clase = { edit: false }
            }
        }
        $scope.editarConceptoMovimientoCajaChica = function (clase) {
            clase.edit = true
            $scope.clase = clase
        }
        $scope.cancelarEdicionConcepotMovimientoCajaChica = function (clase) {
            $scope.clase = { edit: false }
        }

        $scope.guardarConceptoMovimientoCajaChica = function () {
            var promesa = GuardarConceptoMovimientoCajaChica($scope.usuario.id_empresa, $scope.ConceptosMovimiento)
            promesa.then(function (dato) {
                $scope.obtenerConceptosMovimiento()
                $scope.mostrarMensaje(dato.mensaje)
            })
        }
        $scope.guardarSolicitudCajaChica = function () {
            $scope.solicitud.usuario = $scope.usuario
            $scope.tiposEstados.forEach(function (tipo, index, array) {
                if ($scope.usuario.autorizacion_caja_chica) {
                    if (tipo.nombre === 'AUTORIZADO') {
                        $scope.solicitud.estado = tipo
                    }
                } else {
                    if (tipo.nombre === 'PENDIENTE') {
                        $scope.solicitud.estado = tipo
                    }

                }
                if (index === (array.length - 1)) {
                    var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                    promesa.then(function (dato) {
                        $scope.cerrarModalSolicitudCajaChica()
                        $scope.mostrarMensaje(dato.mensaje)
                    })
                }

            });

        }
        $scope.buscarPersonal = function (query) {
            if (query != "" && query != undefined) {
                var promesa = $filter('filter')($scope.todoPersonal, query);
                return promesa;
            }
        }

        $scope.filtrarPersonal = function (query) {
            if ($scope.todoPersonal !== undefined) {
                $scope.personalProcesado = $filter('filter')($scope.todoPersonal, query);
            } else {
                var prom = ObtenerTodoPersonal($scope.usuario.empresa.id)
                prom.then(function (personal) {
                    $scope.todoPersonal = personal.personal
                    $scope.personalProcesado = personal.personal
                    if (personal.mensaje !== undefined) {
                        $scope.mostrarMensaje(personal.mensaje)
                    }
                }, function (err) {
                    $scope.mostrarMensaje("Se perdió la conexión.")
                })
            }
        }
        $scope.establecerPersonal = function (personal) {

            var personalSeleccionado = { id: personal.id, persona: { nombre_completo: personal.persona.nombre_completo } }

        }
        $scope.obtenerListaSolicitudes = function () {
            $scope.paginator = Paginator();
            $scope.paginator.column = "id";
            $scope.paginator.direccion = "asc";
            $scope.paginator.itemsPerPage = 10;
            $scope.filtro = {
                empresa: $scope.usuario.id_empresa,
                inicio: "",
                fin: "",
                solicitante: "",
                usuario: "",
                estado: "",
                concepto: "",
                movimiento: "",
                id_usuario_no_autorizado:($scope.usuario.autorizacion_caja_chica)?"":$scope.usuario.id
            }
            $scope.paginator.callBack = $scope.listaSolicitudesCajaChica;
            $scope.paginator.getSearch("", $scope.filtro, null);


        }
        $scope.listaSolicitudesCajaChica = function () {
            blockUI.start()
            var promesa = SolicitudesCajaPaginador($scope.paginator)
            promesa.then(function (datos) {
                blockUI.stop()
                $scope.paginator.setPages(datos.paginas);
                $scope.solicitudesCajaChica = datos.solicitudes
            })
        }
        $scope.verSolicitudCajaChica = function (datos) {
            $scope.solicitud = datos
            $scope.solicitud.ver = true
            $scope.abrirModalSolicitudCajaChica(true)
        }
        $scope.editarSolicitudCajaChica = function (datos) {
            $scope.solicitud = datos
            $scope.abrirModalSolicitudCajaChica(true)
        }
        $scope.eliminarSolicitud = function () {
            $scope.tiposEstados.forEach(function (tipo, index, array) {
                if (tipo.nombre === 'ANULADO') {
                    $scope.solicitud.estado = tipo
                }
                if (index === (array.length - 1)) {
                    $scope.solicitud.eliminado = true
                    var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                    promesa.then(function (dato) {
                        $scope.cerrarModalEliminarSolicitud()
                        $scope.mostrarMensaje(dato.mensaje)
                    })
                }

            });
        }

        $scope.verificarPerimisoAutorizacion = function (cuenta) {
            cuenta.nombre_usuario = $scope.usuario.nombre_usuario
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {

                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    /*  cuenta.abierto= cuenta.abierto; */
                    if ($scope.tipoDatosPermiso == "autorizacion") {
                        $scope.tiposEstados.forEach(function (tipo, index, array) {
                            if (tipo.nombre === 'AUTORIZADO') {
                                $scope.solicitud.estado = tipo
                            }
                            if (index === (array.length - 1)) {
                                var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                                promesa.then(function (dato) {
                                    $scope.cerrarModalVerificarAutorizacion()
                                    $scope.mostrarMensaje(dato.mensaje)
                                })
                            }

                        });
                    }
                }
            })
        }

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalSolicitudCajaChica);
            $scope.eliminarPopup($scope.idModalConceptosMovimiento)
            $scope.eliminarPopup($scope.idModalEliminarSolicitud)
            $scope.eliminarPopup($scope.idModalVerificarAutorizacion)
        });

        $scope.inicio();
    });



