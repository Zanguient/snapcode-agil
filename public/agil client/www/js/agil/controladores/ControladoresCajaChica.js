angular.module('agil.controladores')

    .controller('ControladorCajaChica',['$scope', '$localStorage', '$location', '$templateCache', '$route', 'blockUI',
        'ClasesTipoEmpresa', 'ClasesTipo', 'GuardarSolicitudCajaChica', 'GuardarConceptoMovimientoCajaChica',
        'ObtenerConceptoMovimientoCajaChica', 'SolicitudesCajaPaginador', 'SolicitudesCajaChicaPaginador', 'ObtenerTodoPersonal', '$filter', 'Paginator', 'VerificarUsuarioEmpresa',
        'NuevoComprobante', 'ConfiguracionCompraVista', 'ConfiguracionesCuentasEmpresa', 'ConfiguracionCompraVistaDatos', 'ProveedoresNit', 'GuardarCajaChica', 'ListaProductosEmpresaUsuario', 'VerificarUsuarioEmpresaCaja', 'IngresosCajaPaginador', 'ObtenerDatosCierreCaja', 'CierreCajaCPaginador',
        'FieldViewer', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
        ClasesTipoEmpresa, ClasesTipo, GuardarSolicitudCajaChica, GuardarConceptoMovimientoCajaChica,
        ObtenerConceptoMovimientoCajaChica, SolicitudesCajaPaginador, SolicitudesCajaChicaPaginador, ObtenerTodoPersonal, $filter, Paginator, VerificarUsuarioEmpresa,
        NuevoComprobante, ConfiguracionCompraVista, ConfiguracionesCuentasEmpresa, ConfiguracionCompraVistaDatos, ProveedoresNit, GuardarCajaChica, ListaProductosEmpresaUsuario, VerificarUsuarioEmpresaCaja, IngresosCajaPaginador, ObtenerDatosCierreCaja, CierreCajaCPaginador,
        FieldViewer) {


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
        $scope.idModalRegistroDesembolsoCajaChica = 'dialog-registro-desembolso-caja-chica'
        $scope.idModalServicios = 'dialog-servicios'
        $scope.idModalRegistroAnticipoCajaChica = 'dialog-registro-anticipo-caja-chica'
        $scope.inicio = function () {
            $scope.sucursales = $scope.obtenerSucursales();
            $scope.sucursalPrincipal = $scope.usuario.sucursalesUsuario[0].sucursal
            $scope.obtenerTiposMovimiento()
            $scope.obtenerConceptosMovimiento()
            $scope.obtenerTiposEstados()
            $scope.obtenerListaSolicitudes()
            $scope.obtenerMovimientosIngreso()
            $scope.obtenerTiposDePago()
            $scope.obtenerCentrosDeCosto()
            $scope.obtenerConfiguracionCompraVista()
            $scope.obtenerconfiuracionCuentas()
            $scope.obtenerServicios()
            $scope.ConceptosMovimiento = []
            $scope.tipoFiltro = "TODOS"
            $scope.verificacionDatos = true
        }


        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsCajaChicas($scope.idModalSolicitudCajaChica, $scope.idModalConceptosMovimiento, $scope.idModalEliminarSolicitud, $scope.idModalVerificarAutorizacion,
                $scope.idModalRegistroCajaChica, $scope.idModalKardexCajaChica, $scope.idModalIngresosCajaChica, $scope.idModalRegistroIngresoCajaChica, $scope.idModalHistorialCierreCajaChica,
                $scope.idModalRegistroDesembolsoCajaChica, $scope.idModalServicios, $scope.idModalRegistroAnticipoCajaChica);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion()
            blockUI.stop();
        });
        $scope.obtenerColumnasAplicacion = function () {
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuario.id_empresa,
                configuracion: {
                    usuario_solicitante: { value: "usuario_solicitante", show: true },
                    fecha: { value: "fecha", show: true },
                    beneficiario: { value: "Beneficiario", show: true },
                    autorizador: { value: "Autorizador", show: true },
                    verificador: { value: "Verificador", show: true },
                    movimiento: { value: "Movimiento", show: true },
                    concepto: { value: "Concepto", show: true },
                    detalle: { value: "Detalle", show: true },
                    estado: { value: "Estado", show: true },
                    monto: { value: "Monto", show: true },

                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
        }
        /* $scope.abrirModalSolicitudCajaChica = function (verOEditar) {
            if (verOEditar == undefined) {
                $scope.solicitud = { fecha: new Date() }
            }
            $scope.filtrarPersonal()
            $scope.abrirPopup($scope.idModalSolicitudCajaChica);
        }
        $scope.cerrarModalSolicitudCajaChica = function () {
            $scope.cerrarPopup($scope.idModalSolicitudCajaChica);
        }*/
        $scope.abrirModalConceptosMovimiento = function () {
            $scope.clase = { edit: false }
            $scope.abrirPopup($scope.idModalConceptosMovimiento);
        }
        $scope.cerrarModalConceptosMovimiento = function () {
            $scope.cerrarPopup($scope.idModalConceptosMovimiento);
        }
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
                $scope.solicitud = datos
                if (edicion) {
                    if (hijo) {
                        $scope.cajaChica = Object.assign({}, hijo)
                        $scope.cajaChica.compra = Object.assign({}, hijo.compra)
                        $scope.cajaChica.solicitud = Object.assign({}, datos)
                        $scope.cajaChica.solicitud.cajasChicas[0].saldo += $scope.cajaChica.compra.total
                        $scope.cajaChica.verDatosCompra = true
                        $scope.cajaChica.descuentoGasolina = false
                        if ($scope.cajaChica.fecha.length > 10) $scope.cajaChica.fecha = $scope.fechaATexto($scope.cajaChica.fecha)
                        $scope.cajaChica.compra.fechaTexto = $scope.fechaATexto(hijo.compra.fecha)
                    } else {
                        $scope.cajaChica = Object.assign({}, datos.cajasChicas[0])
                        $scope.cajaChica.compra = Object.assign({}, datos.cajasChicas[0].compra)
                        $scope.cajaChica.solicitud = Object.assign({}, datos)
                        $scope.cajaChica.solicitud.cajasChicas[0].saldo += $scope.cajaChica.compra.total
                        $scope.cajaChica.verDatosCompra = true
                        $scope.cajaChica.descuentoGasolina = false
                        if ($scope.cajaChica.fecha.length > 10) $scope.cajaChica.fecha = $scope.fechaATexto($scope.cajaChica.fecha)
                        $scope.cajaChica.compra.fechaTexto = $scope.fechaATexto(datos.cajasChicas[0].compra.fecha)
                    }
                    if ($scope.cajaChica.compra.movimiento == undefined) {
                        $scope.cajaChica.compra.movimiento = { clase: {} }
                        $scope.cajaChica.compra.movimiento.clase = $scope.cajaChica.compra.tipoMovimiento
                    }
                    if ($scope.cajaChica.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES || $scope.cajaChica.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
                        $scope.configuracionCompraVista.mostrar_it_retencion = true
                        $scope.configuracionCompraVista.mostrar_iue = true
                        $scope.configuracionCompraVista.mostrar_pagado = true
                    } else {
                        $scope.configuracionCompraVista.mostrar_it_retencion = false
                        $scope.configuracionCompraVista.mostrar_iue = false
                        $scope.configuracionCompraVista.mostrar_pagado = false
                    }
                    // $scope.cambiarTipoPago($scope.cajaChica.compra.tipoPago);
                } else {
                    if (datos.cajasChicas.length > 0) {
                        var total = 0
                    } else {
                        var total = 0
                    }
                    $scope.cajaChica = {
                        fecha: $scope.fechaATexto(new Date()),
                        concepto: datos.concepto,
                        detalle: datos.detalle,
                        compra: {
                            sucursal: $scope.sucursalPrincipal,
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
            $scope.detalleCompra = { producto: {}, servicio: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
            $scope.cargarCentroCosto($scope.detalleCompra)
            $scope.abrirPopup($scope.idModalRegistroCajaChica);
        }
        $scope.cargarCentroCosto = function (detalleCompra) {
            $scope.centrosCosto.forEach(function (dato, index, array) {
                if (dato.nombre == $scope.cajaChica.concepto.nombre) {
                    detalleCompra.centroCosto = dato
                } else {
                    detalleCompra.centroCosto.nombre = $scope.cajaChica.concepto.nombre
                }
            })
        }
        $scope.abrirModalRegistroIngresoCajaChica = function (datos, ver) {
            if (datos) {
                $scope.cajaChica = datos
                $scope.cajaChica.fecha = $scope.fechaATexto(new Date(datos.fecha))
                $scope.cajaChica.total = datos.monto
                $scope.cajaChica.sucursal = $scope.sucursalPrincipal
            } else {
                $scope.cajaChica = {
                    fecha: $scope.fechaATexto(new Date()),
                    solicitud: null, verDatosCompra: false, descuentoGasolina: false, sucursal: $scope.sucursalPrincipal
                }
            }
            if (ver) {
                $scope.cajaChica.ver = true
            }


            $scope.abrirPopup($scope.idModalRegistroIngresoCajaChica);
        }
        $scope.abrirModalRegistroAnticipoCajaChica = function (datos, ver) {

            if (datos) {
                $scope.cajaChica = {}
                $scope.cajaChica.solicitud = datos
                $scope.cajaChica.concepto = datos.concepto
                $scope.cajaChica.detalle = datos.detalle
                $scope.cajaChica.fecha = $scope.fechaATexto(new Date(datos.fecha))
                $scope.cajaChica.total = datos.monto
                $scope.cajaChica.sucursal = $scope.sucursalPrincipal
            } else {
                $scope.cajaChica = {
                    fecha: $scope.fechaATexto(new Date()),
                    solicitud: null, verDatosCompra: false, descuentoGasolina: false, sucursal: $scope.sucursalPrincipal
                }
            }
            if (ver) {
                $scope.cajaChica.ver = true
            }

            $scope.cajaChica.Desembolso = true
            $scope.cajaChica.Anticipo = true
            $scope.abrirPopup($scope.idModalRegistroAnticipoCajaChica);
        }
        $scope.cerrarModalRegistroAnticipoCajaChica = function () {

            $scope.cerrarPopup($scope.idModalRegistroAnticipoCajaChica);
        }
        $scope.cerrarModalRegistroIngresoCajaChica = function () {

            $scope.cerrarPopup($scope.idModalRegistroIngresoCajaChica);
        }

        $scope.abrirModalRegistroDesembolsoCajaChica = function (datos, ver, edit) {

            if (edit) {
                $scope.cajaChica = Object.assign({}, datos.cajasChicas[0])
                $scope.cajaChica.solicitud = Object.assign({}, datos)
                $scope.cajaChica.fecha = $scope.fechaATexto(new Date($scope.cajaChica.fecha))
                $scope.cajaChica.total = datos.cajasChicas[0].monto
                $scope.cajaChica.Desembolso = true
                $scope.cajaChica.sucursal = $scope.sucursalPrincipal
            } else {
                $scope.cajaChica = { solicitud: datos, sucursal: $scope.sucursalPrincipal }
                $scope.cajaChica.fecha = $scope.fechaATexto(new Date(datos.fecha))
                $scope.cajaChica.total = datos.monto
                $scope.cajaChica.detalle = datos.detalle
                $scope.cajaChica.concepto = datos.concepto
                $scope.cajaChica.Desembolso = true
            }
            if (ver) {
                $scope.cajaChica.ver = true
            }


            $scope.abrirPopup($scope.idModalRegistroDesembolsoCajaChica);
        }
        $scope.cerrarModalRegistroDesembolsoCajaChica = function () {

            $scope.cerrarPopup($scope.idModalRegistroDesembolsoCajaChica);
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
        /* $scope.guardarSolicitudCajaChica = function () {
            $scope.solicitud.usuario = $scope.usuario
            $scope.tiposEstados.forEach(function (tipo, index, array) {
                if ($scope.usuario.autorizacion_caja_chica) {
                    if (tipo.nombre === $scope.diccionario.CC_ESTADO_AUTORIZADO) {
                        $scope.solicitud.estado = tipo
                    }
                } else {
                    if (tipo.nombre === $scope.diccionario.CC_ESTADO_PENDIENTE) {
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
                $scope.filtro.id_sucursal = $scope.sucursalPrincipal.id
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
                    id_usuario_no_autorizado: ($scope.usuario.encargado_caja_chica) ? "" : ($scope.usuario.encargado_rendicion_caja_chica) ? "" : $scope.usuario.id,
                    id_sucursal: $scope.sucursalPrincipal.id,
                    rendiciones: ($scope.usuario.encargado_rendicion_caja_chica) ? 1 : "",
                }
            }

            $scope.paginator.callBack = $scope.listaSolicitudesCajaChica;
            $scope.paginator.getSearch("", $scope.filtro, null);


        }
        $scope.listaSolicitudesCajaChica = function () {
            blockUI.start()
            var promesa = SolicitudesCajaChicaPaginador($scope.paginator)
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
                id_sucursal: $scope.sucursalPrincipal.id
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
                id_sucursal: $scope.sucursalPrincipal.id
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
                if (tipo.nombre === $scope.diccionario.CC_ESTADO_ANULADO) {
                    $scope.solicitud.estado = tipo
                }
                if (index === (array.length - 1)) {
                    $scope.solicitud.eliminado = true
                    $scope.solicitud.autorizador = $scope.usuario.id
                    var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                    promesa.then(function (dato) {
                        $scope.obtenerListaSolicitudes()
                        $scope.cerrarModalEliminarSolicitud()
                        $scope.mostrarMensaje(dato.mensaje)
                    })
                }

            });
        }

        $scope.verificarPerimisoAutorizacion = function (cuenta) {
            cuenta.nombre_usuario = $scope.usuario.nombre_usuario
            var promesa = VerificarUsuarioEmpresaCaja($scope.usuario.id_empresa, cuenta)
            promesa.then(function (dato) {

                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    /*  cuenta.abierto= cuenta.abierto; */
                    if ($scope.tipoDatosPermiso == "autorizacion") {
                        $scope.tiposEstados.forEach(function (tipo, index, array) {
                            if (tipo.nombre === $scope.diccionario.CC_ESTADO_AUTORIZADO) {
                                $scope.solicitud.estado = tipo
                            }
                            if (index === (array.length - 1)) {
                                $scope.solicitud.autorizador = $scope.usuario.id
                                var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                                promesa.then(function (dato2) {
                                    $scope.obtenerListaSolicitudes()
                                    $scope.cerrarModalVerificarAutorizacion()
                                    $scope.mostrarMensaje(dato2.mensaje)
                                })
                            }

                        });
                    }
                } else {
                    $scope.cerrarModalVerificarAutorizacion()
                    $scope.mostrarMensaje(dato.message)
                }
            })
        }
        $scope.verDatosCompra = function () {
            $scope.cajaChica.compra.fechaTexto = $scope.fechaATexto(new Date())
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
                $scope.cajaChica.compra.excento = ($scope.cajaChica.solicitud.monto * 30) / 100
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
                if ($scope.cajaChica.Desembolso) {
                    $scope.cajaChica.fecha = new Date($scope.convertirFecha($scope.cajaChica.fecha))
                    var tiempoActual = new Date();
                    $scope.cajaChica.fecha.setHours(tiempoActual.getHours())
                    $scope.cajaChica.fecha.setMinutes(tiempoActual.getMinutes())
                    $scope.cajaChica.fecha.setSeconds(tiempoActual.getSeconds())
                    $scope.tiposEstados.forEach(function (tipo, index, array) {
                        if ($scope.cajaChica.Anticipo) {
                            if (tipo.nombre === $scope.diccionario.CC_ESTADO_PROCESADO) {
                                $scope.cajaChica.solicitud.estado = tipo
                            }
                        } else {
                            if (tipo.nombre === $scope.diccionario.CC_ESTADO_DESEMBOLSADO) {
                                $scope.cajaChica.solicitud.estado = tipo
                            }
                        }
                        if (index === (array.length - 1)) {
                            var promesa = GuardarCajaChica($scope.cajaChica, $scope.usuario.id_empresa)
                            promesa.then(function (dato) {
                                blockUI.stop()
                                $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud, dato.cajaChica)
                                $scope.obtenerListaSolicitudes()
                                $scope.mostrarMensaje(dato.mensaje)
                                if ($scope.cajaChica.Anticipo) {
                                    $scope.cerrarModalRegistroAnticipoCajaChica()
                                } else {
                                    $scope.cerrarModalRegistroDesembolsoCajaChica()
                                }


                            })
                        }
                    })
                } else {


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
                                    if (tipo.nombre === $scope.diccionario.CC_ESTADO_PROCESADO) {
                                        $scope.cajaChica.solicitud.estado = tipo
                                    }
                                    if (index === (array.length - 1)) {
                                        var promesa = GuardarCajaChica($scope.cajaChica, $scope.usuario.id_empresa)
                                        promesa.then(function (dato) {
                                            blockUI.stop()
                                            $scope.obtenerListaSolicitudes()
                                            $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud, dato.cajaChica, true)
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
                                    $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud, dato.cajaChica, true)
                                    $scope.cerrarModalRegistroCajaChica()
                                })
                            }
                        } else {
                            $scope.tiposEstados.forEach(function (tipo, index, array) {
                                if (tipo.nombre === $scope.diccionario.CC_ESTADO_PROCESADO) {
                                    $scope.cajaChica.solicitud.estado = tipo
                                }
                                if (index === (array.length - 1)) {
                                    var promesa = GuardarCajaChica($scope.cajaChica, $scope.usuario.id_empresa)
                                    promesa.then(function (dato) {
                                        blockUI.stop()
                                        $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud, dato.cajaChica)
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
                            $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud, dato.cajaChica)
                            $scope.mostrarMensaje(dato.mensaje)
                            $scope.cerrarModalRegistroCajaChica()
                        })
                    }
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
                    $scope.generarPdfBoletaCajaChica($scope.cajaChica.solicitud, dato.cajaChica)
                    $scope.obtenerListaIngresos()
                    $scope.obtenerListaSolicitudes()
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
            var promesa = ObtenerDatosCierreCaja($scope.usuario.id_empresa, fecha, $scope.totalRlCaja, $scope.sucursalPrincipal.id)
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
            var y = 120, itemsPorPagina = 19, items = 0, pagina = 1, totalPaginas = Math.ceil(datos.detalleCierreCaja.length / itemsPorPagina);
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

                if (caja.concepto.concepto.nombre == "INGRESO") {
                    doc.text("" + number_format(caja.monto, 2) + ".-", 490, y);
                    saldo += caja.monto
                } else {
                    doc.text("(" + number_format(caja.monto, 2) + ".-)", 490, y);
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
            doc.rect(350, y + 25, 200, 0).dash(1, { space: 5 }).stroke();
            doc.text("Encargado Caja Chica", 350, y + 30, { width: 200, align: "center" });
            doc.text($scope.usuario.persona.nombre_completo, 350, y + 40, { width: 200, align: "center" });

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

        $scope.generarPdfBoletaCajaChica = function (solicitud, caja, kardex) {

            convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                var imagen = imagenEmpresa;
                var doc = new PDFDocument({ size: 'letter', margin: 10 });
                var stream = doc.pipe(blobStream());
                // draw some text
                var totalCosto = 0;
                var y = 45;
                $scope.dibujarPDFBoletaCajaChica(doc, solicitud, caja, y, imagen, kardex);

                y += 370
                doc.rect(0, y - 35, 650, 0).dash(2, { space: 5 }).stroke()
                $scope.dibujarPDFBoletaCajaChica(doc, solicitud, caja, y, imagen, kardex);


                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });

            });
        }
        $scope.dibujarPDFBoletaCajaChica = function (doc, solicitud, caja, y, imagen, kardex) {
            doc.font('Helvetica-Bold', 12);
            doc.image(imagen, 30, y - 20, { fit: [80, 80] });
            if (caja.concepto.concepto.nombre != "INGRESO") {
                if (!kardex) {
                    doc.text("SALIDA CAJA CHICA", 0, y + 20, { align: "center" });
                } else {
                    doc.text("RENDICIÓN FONDOS CAJA CHICA", 0, y + 20, { align: "center" });
                }

            } else {

                doc.text("INGRESO CAJA CHICA", 0, y + 20, { align: "center" });

            }

            doc.font('Helvetica-Bold', 8);
            doc.text(caja.sucursal.nombre, 0, y + 30, { align: "center" });
            doc.text("Nro. " + caja.numero_correlativo, 0, y + 40, { align: "center" });
            doc.rect(465, y, 90, 20).dash(0, { space: 0 }).stroke()
            doc.rect(435, y, 30, 20).dash(0, { space: 0 }).stroke()
            doc.rect(465, y + 20, 90, 20).dash(0, { space: 0 }).stroke()
            doc.rect(435, y + 20, 30, 20).dash(0, { space: 0 }).stroke()
            doc.text("Bs.", 445, y + 10);
            if (caja.id_padre) {
                doc.text(caja.pagado.toFixed(2), 485, y + 10);
            } else {
                doc.text(caja.monto.toFixed(2), 485, y + 10);
            }

            doc.text("$us.", 445, y + 30);
            doc.font('Helvetica', 8);
            doc.text("Fecha en texto", 45, y + 65);
            if (solicitud) {
                var nombre = solicitud.solicitante.persona.nombre_completo
            } else {
                var nombre = $scope.usuario.empresa.razon_social
            }
            doc.text("Recibí de .: " + nombre, 45, y + 80);
            if (caja.id_padre) {
                doc.text("La suma de .: " + ConvertirALiteral(caja.pagado.toFixed(2)), 45, y + 95);
            } else {
                doc.text("La suma de .: " + ConvertirALiteral(caja.monto.toFixed(2)), 45, y + 95);
            }


            if (caja.concepto.concepto.nombre != "INGRESO") {
                doc.text("Bajo el concepto de: " + caja.concepto.nombre, 45, y + 110);
                y += 15
            }
            doc.text("Por concepto de:", 45, y + 110);
            doc.font('Helvetica-Bold', 8);
            doc.text("DETALLE", 200, y + 125);
            doc.text(caja.detalle, 55, y + 155, { width: 410 });
            doc.text("IMPORTE", 485, y + 125);
            doc.font('Helvetica', 8);
            if (caja.id_padre) {
                doc.text(caja.pagado.toFixed(2), 485, y + 155);
            } else {
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
            if (caja.concepto.concepto.nombre == "INGRESO") {
                doc.text("Autorizado", 45, y + 295, { width: 150, align: "center" });
                doc.rect(250, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
                doc.text("Entregue Conforme", 225, y + 295, { width: 150, align: "center" });
                doc.rect(450, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
                doc.text($scope.usuario.persona.nombre_completo, 425, y + 285, { width: 150, align: "center" });
                doc.text("Recibí Conforme", 425, y + 295, { width: 150, align: "center" });
            } else {
                doc.text(solicitud.usuario.persona.nombre_completo, 45, y + 285, { width: 150, align: "center" });
                doc.text("Autorizado", 45, y + 295, { width: 150, align: "center" });
                doc.rect(250, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
                doc.text(solicitud.solicitante.persona.nombre_completo, 225, y + 285, { width: 150, align: "center" });
                doc.text("Recibí Conforme", 225, y + 295, { width: 150, align: "center" });
                doc.rect(450, y + 275, 100, 0).dash(2, { space: 5 }).stroke()
                doc.text($scope.usuario.persona.nombre_completo, 425, y + 285, { width: 150, align: "center" });
                doc.text("Entregue Conforme", 425, y + 295, { width: 150, align: "center" });
            }

            var fechaActual = new Date()
            doc.text("Usuario.: " + $scope.usuario.nombre_usuario + " Hora.: " + fechaActual.getHours() + ":" + fechaActual.getMinutes() + " imp.: " + $scope.fechaATexto(fechaActual), 425, y + 310, { width: 150, align: "center" });
        }

        $scope.dibujarCuerpoPDFBoletaCajaChica = function (doc, solicitud, caja, y) {
            /*  doc.rect(30, y - 10, 555, 20).stroke(); */

        }
        $scope.verificarProducto = function (detalleCompra) {

            if ($scope.cajaChica.compra.movimiento.clase != undefined) {
                if ($scope.cajaChica.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
                    detalleCompra.descuento = 0
                    detalleCompra.ice = 0
                    detalleCompra.recargo = 0
                    detalleCompra.excento = 0
                    $scope.configuracionCompraVista.mostrar_it_retencion = true
                    $scope.configuracionCompraVista.mostrar_iue = true
                    $scope.configuracionCompraVista.mostrar_pagado = true
                    $scope.agregarDetalleCompra(detalleCompra);
                } else {
                    $scope.agregarDetalleCompra(detalleCompra);
                }
            } else {
                $scope.agregarDetalleCompra(detalleCompra);
            }

        }

        $scope.verificarServicio = function (detalleCompra) {

            if (detalleCompra.servicio.id) {
                if ($scope.cajaChica.compra.movimiento.clase != undefined) {
                    if ($scope.cajaChica.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
                        detalleCompra.descuento = 0
                        detalleCompra.ice = 0
                        detalleCompra.recargo = 0
                        detalleCompra.excento = 0
                        $scope.configuracionCompraVista.mostrar_it_retencion = true
                        $scope.configuracionCompraVista.mostrar_iue = true
                        $scope.configuracionCompraVista.mostrar_pagado = true
                        $scope.agregarDetalleCompraServicio(detalleCompra);
                    } else {
                        $scope.agregarDetalleCompraServicio(detalleCompra);
                    }
                } else {
                    $scope.agregarDetalleCompraServicio(detalleCompra);
                }
                $scope.verificarCamposDetalleCompra(detalleCompra, true)
            } else {
                $scope.mostrarMensaje("El producto no se encuentra en el catalogo")
            }


        }
        $scope.agregarDetalleCompra = function (detalleCompra) {
            if (detalleCompra.producto.nombre.id) {
                detalleCompra.producto = detalleCompra.producto.nombre;
            }
            if (detalleCompra.centroCosto.nombre.id) {
                detalleCompra.centroCosto = detalleCompra.centroCosto.nombre;
            } else {
                if (detalleCompra.centroCosto.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
                    var centroCostoAlmacen = $.grep($scope.centrosCosto, function (e) { return e.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN; })[0];
                    detalleCompra.centroCosto = centroCostoAlmacen;
                }
            }
            if (detalleCompra.fechaVencimientoTexto) {
                detalleCompra.fecha_vencimiento = new Date($scope.convertirFecha(detalleCompra.fechaVencimientoTexto));
            }
            if ($scope.cajaChica.compra.descuento_general) {
                detalleCompra.descuento = $scope.cajaChica.compra.descuento
                detalleCompra.ice = $scope.cajaChica.compra.ice
                detalleCompra.recargo = $scope.cajaChica.compra.recargo
                detalleCompra.excento = $scope.cajaChica.compra.excento
            }


            $scope.cajaChica.compra.detallesCompra.push(detalleCompra);
            $scope.sumarTotal();
            $scope.sumarTotalImporte();
            if ($scope.cajaChica.compra.descuento_general) {
                $scope.calcularImporteGeneral();
            }
            if ($scope.cajaChica.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
                $scope.calcularSaldo();
            }
            $scope.detalleCompra = { producto: {}, servicio: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
            $scope.cargarCentroCosto($scope.detalleCompra)

        }
        $scope.agregarDetalleCompraServicio = function (detalleCompra) {

            $scope.cajaChica.compra.detallesCompra.push(detalleCompra);
            $scope.sumarTotal();
            $scope.sumarTotalImporte();
            if ($scope.cajaChica.compra.descuento_general) {
                $scope.calcularImporteGeneral();
            }
            if ($scope.cajaChica.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
                $scope.calcularSaldo();
            }
            $scope.detalleCompra = { producto: {}, servicio: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
            $scope.cargarCentroCosto($scope.detalleCompra)

        }
        $scope.obtenerConfiguracionCompraVista = function () {
            blockUI.start();
            var promise = ConfiguracionCompraVistaDatos($scope.usuario.id_empresa);
            promise.then(function (configuracion) {
                $scope.configuracionCompraVista = configuracion;
                blockUI.stop();
            });
        }
        $scope.guardarConfiguracionCompraVista = function () {
            ConfiguracionCompraVista.update({ id_empresa: $scope.usuario.id_empresa }, $scope.configuracionCompraVista, function (res) {

            });
        }
        $scope.eliminarDetalleCompra = function (detalleCompra) {
            if ($scope.cajaChica.compra.id) {
                detalleCompra.eliminado = true;
            } else {
                $scope.cajaChica.compra.detallesCompra.splice($scope.cajaChica.compra.detallesCompra.indexOf(detalleCompra), 1);
            }
            $scope.sumarTotal();
            $scope.sumarTotalImporte();
            if ($scope.cajaChica.compra.descuento_general) {
                $scope.calcularImporteGeneral();
            }
            if ($scope.cajaChica.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
                $scope.calcularSaldo();
            }
        }

        $scope.sumarTotalImporte = function () {
            var sumaImporte = 0;
            for (var i = 0; i < $scope.cajaChica.compra.detallesCompra.length; i++) {
                if (!$scope.cajaChica.compra.detallesCompra[i].eliminado) {
                    sumaImporte = sumaImporte + $scope.cajaChica.compra.detallesCompra[i].importe;
                }
            }
            $scope.cajaChica.compra.importe = Math.round((sumaImporte) * 1000) / 1000;
        }

        $scope.sumarTotal = function () {
            var sumaTotal = 0;
            for (var i = 0; i < $scope.cajaChica.compra.detallesCompra.length; i++) {
                if (!$scope.cajaChica.compra.detallesCompra[i].eliminado) {
                    sumaTotal = sumaTotal + $scope.cajaChica.compra.detallesCompra[i].total;
                }
            }
            $scope.cajaChica.compra.total = Math.round((sumaTotal) * 1000) / 1000;
        }

        $scope.calcularSaldo = function () {
            $scope.cajaChica.compra.saldo = $scope.cajaChica.compra.total - $scope.cajaChica.compra.a_cuenta;
        }

        $scope.calcularImporteGeneral = function () {
            var descuento, recargo;
            if ($scope.cajaChica.compra.tipo_descuento) {
                descuento = $scope.cajaChica.compra.importe * ($scope.cajaChica.compra.descuento / 100);
            } else {
                descuento = $scope.cajaChica.compra.descuento;
            }
            if ($scope.cajaChica.compra.tipo_recargo) {
                recargo = $scope.cajaChica.compra.importe * ($scope.cajaChica.compra.recargo / 100);
            } else {
                recargo = $scope.cajaChica.compra.recargo;
            }
            $scope.cajaChica.compra.total = Math.round(($scope.cajaChica.compra.importe - descuento + recargo - $scope.cajaChica.compra.ice - $scope.cajaChica.compra.excento) * 1000) / 1000;
        }
        $scope.eliminarDetalleCompra = function (detalleCompra) {
            if ($scope.cajaChica.compra.id) {
                detalleCompra.eliminado = true;
            } else {
                $scope.cajaChica.compra.detallesCompra.splice($scope.cajaChica.compra.detallesCompra.indexOf(detalleCompra), 1);
            }
            $scope.sumarTotal();
            $scope.sumarTotalImporte();
            if ($scope.cajaChica.compra.descuento_general) {
                $scope.calcularImporteGeneral();
            }
            if ($scope.cajaChica.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
                $scope.calcularSaldo();
            }
        }

        $scope.cambiarTipoPago = function (tipoPago) {
            var tipoPago = $.grep($scope.tiposPago, function (e) { return e.id == tipoPago.id; })[0];
            $scope.esContado = tipoPago.nombre_corto == 'CONT' ? true : false;
            $scope.cajaChica.compra.id_tipo_pago = tipoPago.id;
            if (!$scope.esContado) {
                $scope.calcularSaldo();
            }

        }
        $scope.buscarProducto = function (query) {
            if (query != "" && query != undefined && $scope.busquedaProductoHabilidato) {
                var promesa = ListaProductosEmpresaUsuario($scope.usuario.id_empresa, query, $scope.usuario.id, $scope.compra.almacen.id);
                return promesa;
            }
        };
        $scope.establecerProducto = function (producto) {

            producto.tipoProducto = producto['tipoProducto'] == null ? { id: producto['tipoProducto.id'], nombre: producto['tipoProducto.nombre'], nombre_corto: producto['tipoProducto.nombre_corto'] } : producto.tipoProducto;
            var centroCostos = $scope.detalleCompra.centroCosto;
            // === para colocar el costo unitario de inventario == 
            $scope.precio_inventario;
            if (producto.inventarios.length > 0) {
                $scope.precio_inventario = producto.inventarios.pop().costo_unitario + " Bs";

            } else {
                $scope.precio_inventario = "Sin histórico";
            }

            $scope.detalleCompra = {
                centroCosto: centroCostos, producto: producto, precio_unitario: producto.precio_unitario,
                cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: (producto.descuento > 0 ? true : false), tipo_recargo: false
            };

            $scope.cerrarPopup($scope.idModalInventario);
            $scope.enfocar('cantidad');

        }

        $scope.calcularImporte = function () {
            $scope.detalleCompra.importe = Math.round(($scope.detalleCompra.cantidad * $scope.detalleCompra.costo_unitario) * 1000) / 1000;
            var descuento, recargo;
            if ($scope.cajaChica.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
                if ($scope.cajaChica.compra.tipo_retencion) {

                    $scope.detalleCompra.total = $scope.detalleCompra.importe
                    $scope.detalleCompra.importe = ($scope.detalleCompra.total * ($scope.plantilla.retencionBienesGasto.it.porsentaje + $scope.plantilla.retencionBienesGasto.iue.porsentaje) / (100 - ($scope.plantilla.retencionBienesGasto.it.porsentaje + $scope.plantilla.retencionBienesGasto.iue.porsentaje))) + $scope.detalleCompra.total
                    $scope.detalleCompra.it = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.it.porsentaje) / 100
                    $scope.detalleCompra.iue = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.iue.porsentaje) / 100
                    //$scope.detalleCompra.total =($scope.detalleCompra.importe *$scope.plantilla.retencionBienesGasto.gasto.porsentaje)/100

                } else {

                    $scope.detalleCompra.it = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.it.porsentaje) / 100
                    $scope.detalleCompra.iue = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.iue.porsentaje) / 100
                    $scope.detalleCompra.total = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.gasto.porsentaje) / 100


                }
                /* $scope.detalleCompra.total = $scope.detalleCompra.importe */
            } else if ($scope.cajaChica.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_IMPORTACION) {
                $scope.detalleCompra.total = $scope.detalleCompra.importe
            } else if ($scope.cajaChica.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
                if ($scope.cajaChica.compra.tipo_retencion) {

                    $scope.detalleCompra.total = $scope.detalleCompra.importe
                    $scope.detalleCompra.importe = ($scope.detalleCompra.total * ($scope.plantilla.retencionServicios.it.porsentaje + $scope.plantilla.retencionServicios.iue.porsentaje) / (100 - ($scope.plantilla.retencionServicios.it.porsentaje + $scope.plantilla.retencionServicios.iue.porsentaje))) + $scope.detalleCompra.total
                    $scope.detalleCompra.it = ($scope.detalleCompra.importe * $scope.plantilla.retencionServicios.it.porsentaje) / 100
                    $scope.detalleCompra.iue = ($scope.detalleCompra.importe * $scope.plantilla.retencionServicios.iue.porsentaje) / 100

                } else {

                    $scope.detalleCompra.it = ($scope.detalleCompra.importe * $scope.plantilla.retencionServicios.it.porsentaje) / 100
                    $scope.detalleCompra.iue = ($scope.detalleCompra.importe * $scope.plantilla.retencionServicios.iue.porsentaje) / 100
                    $scope.detalleCompra.total = ($scope.detalleCompra.importe * $scope.plantilla.retencionServicios.servicio.porsentaje) / 100


                }
            } else {
                if (!$scope.cajaChica.compra.descuento_general) {
                    if ($scope.detalleCompra.tipo_descuento) {
                        descuento = $scope.detalleCompra.importe * ($scope.detalleCompra.descuento / 100);
                    } else {
                        descuento = $scope.detalleCompra.descuento;
                    }
                    if ($scope.detalleCompra.tipo_recargo) {
                        recargo = $scope.detalleCompra.importe * ($scope.detalleCompra.recargo / 100);
                    } else {
                        recargo = $scope.detalleCompra.recargo;
                    }

                    $scope.detalleCompra.total = $scope.detalleCompra.importe - descuento + recargo - $scope.detalleCompra.ice - $scope.detalleCompra.excento;
                } else {
                    if ($scope.cajaChica.compra.tipo_descuento) {
                        descuento = $scope.detalleCompra.importe * ($scope.cajaChica.compra.descuento / 100);
                    } else {
                        descuento = $scope.cajaChica.compra.descuento;
                    }
                    if ($scope.cajaChica.compra.tipo_recargo) {
                        recargo = $scope.detalleCompra.importe * ($scope.cajaChica.compra.recargo / 100);
                    } else {
                        recargo = $scope.cajaChica.compra.recargo;
                    }

                    $scope.detalleCompra.total = $scope.detalleCompra.importe - descuento + recargo - $scope.cajaChica.compra.ice - $scope.cajaChica.compra.excento;
                }
            }
            importe = ($scope.cajaChica.compra.importe) ? $scope.cajaChica.compra.importe : 0
            $scope.totalRestante = $scope.cajaChica.solicitud.monto - importe
            if ($scope.cajaChica.solicitud) {
                if ($scope.detalleCompra.importe > $scope.totalRestante) {
                    $scope.detalleCompra.importe = NaN
                    $scope.ErrorImporte = true
                } else {
                    $scope.ErrorImporte = false
                }
            }
        }

        $scope.calcularImporteDetalleEdicion = function (detalleCompra) {
            detalleCompra.importe = Math.round((detalleCompra.cantidad * detalleCompra.costo_unitario) * 1000) / 1000;
            var descuento, recargo;
            if (detalleCompra.tipo_descuento) {
                descuento = detalleCompra.importe * (detalleCompra.descuento / 100);
            } else {
                descuento = detalleCompra.descuento;
            }
            if (detalleCompra.tipo_recargo) {
                recargo = detalleCompra.importe * (detalleCompra.recargo / 100);
            } else {
                recargo = detalleCompra.recargo;
            }
            detalleCompra.total = detalleCompra.importe - descuento + recargo - detalleCompra.ice - detalleCompra.excento;
            $scope.sumarTotal();
            $scope.sumarTotalImporte();
            if ($scope.cajaChica.compra.descuento_general) {
                $scope.calcularImporteGeneral();
            }
            if ($scope.cajaChica.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
                $scope.calcularSaldo();
            }
        }

        $scope.sumarMonto = function (compras) {
            var suma = 0;
            for (var i = 0; i < compras.length; i++) {
                suma = suma + compras[i].total;

            }
            return Math.round(suma * 100) / 100;
        }

        $scope.obtenerCentrosDeCosto = function () {
            blockUI.start();
            var promesa = ClasesTipo("CCO");
            promesa.then(function (entidad) {
                $scope.centrosCosto = entidad.clases;
                if ($scope.usuario.empresa.usar_funciones_erp) {
                    var ids = []
                    $scope.centrosCosto.forEach(function (dato, index, array) {
                        if (dato.nombre_corto == "ALM") {

                        } else if (dato.nombre_corto == "VR") { } else {
                            ids.push(index)
                        }

                    })
                    ids.reverse().forEach(function (dato, index, array) {
                        $scope.centrosCosto.splice(dato, 1)
                    })
                }
                blockUI.stop();
            });
        }

        $scope.obtenerconfiuracionCuentas = function () {
            var promesa = ConfiguracionesCuentasEmpresa($scope.usuario.id_empresa);
            var a = false;
            $scope.plantilla = { retencionServicios: { it: {}, iue: {}, servicio: {} }, retencionBienesGasto: { it: {}, iue: {}, gasto: {} }, retencionBienes: { it: {}, iue: {}, almacen: {} }, egreso: { ivacf: {}, cajaBanco: {} }, ingreso: { ivadf: {}, it: {}, itPorPagar: {}, cajaBanco: {} } }
            promesa.then(function (entidad) {

                entidad.lista.forEach(function (lista) {
                    if ($scope.diccionario.IVA_DF == lista.nombre) {
                        $scope.plantilla.ingreso.ivadf = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IT == lista.nombre) {
                        $scope.plantilla.ingreso.it = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IT_POR_PAGAR == lista.nombre) {
                        $scope.plantilla.ingreso.itPorPagar = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.CAJA_BANCOS == lista.nombre) {
                        $scope.plantilla.ingreso.cajaBanco = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IVA_CF == lista.nombre) {
                        $scope.plantilla.egreso.ivacf = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.CAJA_BANCOS == lista.nombre) {
                        $scope.plantilla.egreso.cajaBanco = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IT_RETENCION_BIEN == lista.nombre) {
                        $scope.plantilla.retencionBienes.it = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IUE_RETENCION_BIEN == lista.nombre) {
                        $scope.plantilla.retencionBienes.iue = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.CUENTA_ALMACEN_RETENCION_BIEN == lista.nombre) {
                        $scope.plantilla.retencionBienes.almacen = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IT_RETENCION_BIEN_GASTO == lista.nombre) {
                        $scope.plantilla.retencionBienesGasto.it = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IUE_RETENCION_BIEN_GASTO == lista.nombre) {
                        $scope.plantilla.retencionBienesGasto.iue = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.CUENTA_GASTO_RETENCION_BIEN == lista.nombre) {
                        $scope.plantilla.retencionBienesGasto.gasto = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IT_RETENCION_SERVICIO == lista.nombre) {
                        $scope.plantilla.retencionServicios.it = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.IUE_RETENCION_SERVICIO == lista.nombre) {
                        $scope.plantilla.retencionServicios.iue = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                    if ($scope.diccionario.CUENTA_RETENCION_SERVICIO == lista.nombre) {
                        $scope.plantilla.retencionServicios.servicio = { porsentaje: parseFloat(lista.valor), cuenta: lista.cuenta }
                    }
                }, this);
            })
        }

        $scope.obtenerServicios = function () {
            blockUI.start();
            var promesa = ClasesTipoEmpresa("SERVICIOS_COMPRA", $scope.usuario.id_empresa);
            promesa.then(function (entidad) {
                $scope.datosServicios = entidad
                blockUI.stop();
            });
        }

        $scope.abrirDialogServicios = function (tipo) {
            $scope.tipo_edicion = tipo;
            $scope.clase = {};
            $scope.abrirPopup($scope.idModalServicios);
        }

        $scope.cerrarDialogServicios = function () {
            $scope.cerrarPopup($scope.idModalServicios);
        }
        $scope.agregarConceptoEdicion = function (clase) {
            if (clase.nombre && clase.nombre_corto) {
                if ($scope.tipo_edicion.clases.indexOf(clase) == -1) {
                    $scope.tipo_edicion.clases.push(clase);
                }
                $scope.clase = {}
            }
        }
        $scope.modificarConceptoEdicion = function (clase) {
            $scope.clase = clase;
        }

        $scope.removerConceptoEdicion = function (clase) {
            clase.eliminado = true;
        }
        $scope.guardarConceptoEdicion = function (tipo) {
            blockUI.start();
            Tipos.update({ id_tipo: tipo.id }, tipo, function (res) {
                var promesa = ClasesTipo(tipo.nombre_corto);
                promesa.then(function (entidad) {
                    tipo = entidad
                    blockUI.stop();
                    $scope.cerrarDialogServicios();
                    $scope.mostrarMensaje('Guardado Exitosamente!');
                });
            });
        }

        $scope.establecerServicioSeleccionado = function (clase) {
            $scope.establecerServicio(clase)
            $scope.cerrarDialogServicios()
        }
        $scope.establecerServicio = function (producto) {
            producto.tipoProducto = producto['tipoProducto'] == null ? { id: producto['tipoProducto.id'], nombre: producto['tipoProducto.nombre'], nombre_corto: producto['tipoProducto.nombre_corto'] } : producto.tipoProducto;
            var centroCostos = $scope.detalleCompra.centroCosto;
            $scope.detalleCompra = {
                centroCosto: null, servicio: producto, precio_unitario: producto.precio_unitario,
                cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false
            };
            $scope.cerrarPopup($scope.idModalInventario);
            $scope.enfocar('cantidad');

        }
        $scope.verificarCamposDetalleCompra = function (detalle, servicio) {
            if (servicio) {
                $scope.verificacionDatos = false
                $scope.verificacionDatos = (detalle.servicio.nombre) ? false : true
                if ($scope.verificacionDatos == false) {
                    $scope.verificacionDatos = (detalle.cantidad >= 1) ? false : true
                    if ($scope.verificacionDatos == false) {
                        $scope.verificacionDatos = (detalle.costo_unitario >= 0.0001) ? false : true
                    }
                }
            } else {
                $scope.verificacionDatos = false
                $scope.verificacionDatos = (detalle.producto.nombre) ? false : true
                if ($scope.verificacionDatos == false) {
                    $scope.verificacionDatos = (detalle.cantidad >= 1) ? false : true
                    if ($scope.verificacionDatos == false) {
                        $scope.verificacionDatos = (detalle.costo_unitario >= 0.0001) ? false : true
                    }
                }
            }

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
            $scope.eliminarPopup($scope.idModalRegistroDesembolsoCajaChica)
            $scope.eliminarPopup($scope.idModalServicios)
            $scope.eliminarPopup($scope.idModalRegistroAnticipoCajaChica)
        });

        $scope.inicio();
    }])














    .controller('ControladorSolicitudCajaChica',['$scope', '$localStorage', '$location', '$templateCache', '$route', 'blockUI',
        'ClasesTipoEmpresa', 'ClasesTipo', 'GuardarSolicitudCajaChica', 'GuardarConceptoMovimientoCajaChica',
        'ObtenerConceptoMovimientoCajaChica', 'VerificarUsuarioEmpresaCaja', 'SolicitudesCajaPaginador', 'ObtenerTodoPersonal', '$filter', 'Paginator', 'VerificarUsuarioEmpresa', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
        ClasesTipoEmpresa, ClasesTipo, GuardarSolicitudCajaChica, GuardarConceptoMovimientoCajaChica,
        ObtenerConceptoMovimientoCajaChica, VerificarUsuarioEmpresaCaja, SolicitudesCajaPaginador, ObtenerTodoPersonal, $filter, Paginator, VerificarUsuarioEmpresa) {


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
                    $scope.solicitud.autorizador = $scope.usuario.id
                    if (tipo.nombre === $scope.diccionario.CC_ESTADO_AUTORIZADO) {
                        $scope.solicitud.estado = tipo
                    }
                } else {
                    if (tipo.nombre === $scope.diccionario.CC_ESTADO_PENDIENTE) {
                        $scope.solicitud.estado = tipo
                    }

                }
                if (index === (array.length - 1)) {
                    var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                    promesa.then(function (dato) {
                        $scope.obtenerListaSolicitudes()
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
                id_usuario_no_autorizado: ($scope.usuario.autorizacion_caja_chica) ? "" : $scope.usuario.id
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
            if ($scope.usuario.persona.id == datos.usuario.persona.id) {
                $scope.solicitud = datos
                $scope.abrirModalSolicitudCajaChica(true)
            }
        }
        $scope.eliminarSolicitud = function () {
            $scope.tiposEstados.forEach(function (tipo, index, array) {
                if (tipo.nombre === $scope.diccionario.CC_ESTADO_ANULADO) {
                    $scope.solicitud.estado = tipo
                }
                if (index === (array.length - 1)) {
                    $scope.solicitud.eliminado = true
                    var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                    promesa.then(function (dato) {
                        $scope.obtenerListaSolicitudes()
                        $scope.cerrarModalEliminarSolicitud()
                        $scope.mostrarMensaje(dato.mensaje)
                    })
                }

            });
        }

        $scope.verificarPerimisoAutorizacion = function (cuenta) {
            cuenta.nombre_usuario = $scope.usuario.nombre_usuario
            var promesa = VerificarUsuarioEmpresaCaja($scope.usuario.id_empresa, cuenta)
            promesa.then(function (dato) {
                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    /*  cuenta.abierto= cuenta.abierto; */
                    if ($scope.tipoDatosPermiso == "autorizacion") {
                        $scope.tiposEstados.forEach(function (tipo, index, array) {
                            if (tipo.nombre === $scope.diccionario.CC_ESTADO_AUTORIZADO) {
                                $scope.solicitud.estado = tipo
                            }
                            if (index === (array.length - 1)) {
                                $scope.solicitud.autorizador = $scope.usuario.id
                                var promesa = GuardarSolicitudCajaChica($scope.solicitud)
                                promesa.then(function (dato) {
                                    $scope.cerrarModalVerificarAutorizacion()
                                    $scope.mostrarMensaje(dato.mensaje)
                                })
                            }

                        });
                    }
                } else {
                    $scope.cerrarModalVerificarAutorizacion()
                    $scope.mostrarMensaje(dato.message)
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
    }]);



