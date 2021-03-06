angular.module('agil.controladores', ['agil.servicios', 'blockUI'])

    .controller('ControladorPrincipal', ['$scope', '$sce', '$rootScope', '$route', '$templateCache', '$location', '$window', '$localStorage', 'Sesion', '$timeout',
        'blockUI', 'UsuarioSucursalesAutenticacion', 'VencimientosProductosEmpresa', 'VencimientosCreditosEmpresa',
        'VencimientosDeudasEmpresa', 'VentaEmpresaDatos', 'ClienteVencimientoCredito', 'socket', '$http', 'Tipos',
        'ProveedorVencimientoCredito', 'Venta', 'ClasesTipo', 'Compra', 'Producto', 'DatosVenta', 'DatosCompra',
        'ImprimirSalida', 'Diccionario', 'VentasComprobantesEmpresa', 'ComprasComprobantesEmpresa', 'LibroMayorCuenta', 'Paginator', 'ComprobanteRevisarPaginador', 'AsignarComprobanteFavorito', 'ListaCuentasComprobanteContabilidad', 'NuevoComprobanteContabilidad', 'NuevoComprobante', 'ComprasComprobante',
        'ConfiguracionesCuentasEmpresa', 'ContabilidadCambioMoneda', 'ObtenerCambioMoneda', 'AsignarCuentaCiente', 'AsignarCuentaProveedor',
        'GtmTransportistas', 'GtmEstibajes', 'GtmGrupoEstibajes', 'ListasCuentasAuxiliares', 'GtmDetallesDespachoAlerta', '$interval', 'GuardarGtmDetalleDespachoAlerta', 'GtmDetalleDespacho', 'VerificarCorrelativosSucursale',
        'ReiniciarCorrelativoSucursales', 'ClasesTipoEmpresa', 'alertasProformasLista', 'UltimaFechaTipoComprobante', 'FacturaProforma', 'ListaDetallesProformasAFacturar', 'ProformasInfo', 'FacturarProformas', 'ImprimirPdfAlertaDespacho',
        'ExportarExelAlarmasDespachos', 'VencimientoDosificaciones', 'EmpresaDatosInicio', 'VerificacionMensualActivos', 'ProductosPaginador', 'Pedidos', 'ClientesNit', 'GetCliente', 'ClientePedido', 'ClientePedidoRazonSocial', 'ClientePedidoDestino',
        '$filter', 'ObtenerAlertasCajaChica', 'GuardarVerificadorSolicitud', 'PagosVentaCreditos', 'CompraDatosCredito', function ($scope, $sce, $rootScope, $route, $templateCache, $location, $window, $localStorage, Sesion, $timeout,
            blockUI, UsuarioSucursalesAutenticacion, VencimientosProductosEmpresa, VencimientosCreditosEmpresa,
            VencimientosDeudasEmpresa, VentaEmpresaDatos, ClienteVencimientoCredito, socket, $http, Tipos,
            ProveedorVencimientoCredito, Venta, ClasesTipo, Compra, Producto, DatosVenta, DatosCompra,
            ImprimirSalida, Diccionario, VentasComprobantesEmpresa, ComprasComprobantesEmpresa, LibroMayorCuenta, Paginator, ComprobanteRevisarPaginador, AsignarComprobanteFavorito, ListaCuentasComprobanteContabilidad, NuevoComprobanteContabilidad, NuevoComprobante, ComprasComprobante,
            ConfiguracionesCuentasEmpresa, ContabilidadCambioMoneda, ObtenerCambioMoneda, AsignarCuentaCiente, AsignarCuentaProveedor,
            GtmTransportistas, GtmEstibajes, GtmGrupoEstibajes, ListasCuentasAuxiliares, GtmDetallesDespachoAlerta, $interval, GuardarGtmDetalleDespachoAlerta, GtmDetalleDespacho, VerificarCorrelativosSucursale,
            ReiniciarCorrelativoSucursales, ClasesTipoEmpresa, alertasProformasLista, UltimaFechaTipoComprobante, FacturaProforma, ListaDetallesProformasAFacturar, ProformasInfo, FacturarProformas, ImprimirPdfAlertaDespacho,
            ExportarExelAlarmasDespachos, VencimientoDosificaciones, EmpresaDatosInicio, VerificacionMensualActivos, ProductosPaginador, Pedidos, ClientesNit, GetCliente, ClientePedido, ClientePedidoRazonSocial, ClientePedidoDestino,
            $filter, ObtenerAlertasCajaChica, GuardarVerificadorSolicitud, PagosVentaCreditos, CompraDatosCredito) {
            $scope.idModalTablaVencimientoProductos = "tabla-vencimiento-productos";
            $scope.idModalTablaDespachos = "tabla-gtm-despachos";
            $scope.idModalTablaAsignacionDespacho = "tabla-gtm-asignacion-despachos";
            $scope.idModalTablaVencimientoCreditos = "tabla-vencimiento-creditos";
            $scope.idModalTablaVencimientoDeudas = "tabla-vencimiento-deudas";
            $scope.idModalTablaVentasPendientes = "tabla-ventas-pendientes";
            $scope.idModalTablaComprasPendientes = "tabla-compras-pendientes";
            $scope.idModalTablaBancosPendientes = "tabla-bancos-pendientes";
            $scope.idModalTablaOtrosPendientes = "tabla-otros-pendientes";
            $scope.idModalPagoP = 'dialog-pago-credito';
            $scope.idModalPagoDeuda = 'dialog-pago-deuda';
            $scope.idmodalActualizarCreditoCliente = "dialog-actualizar-credito";
            $scope.idmodalActualizarCreditoDeuda = "dialog-actualizar-deudas";
            $scope.idModalDescuento = "dialog-edicion-descuento";
            $scope.idModalInicioSesion = "popup-inicio-sesion";
            $scope.idModalNuevoPedido = "modal-nuevo-pedido";
            $scope.idModalDatosProducto = "modal-dato-producto";
            $scope.idModalNuevoClientePedido = "modal-nuevo-cliente-pedido";
            $scope.idModalNuevaRazonCliente = "modal-nueva-razon-cliente";
            $scope.idModalNuevoDestino = "modal-nuevo-destino";
            $scope.idModalVerificacionCajaChica = "tabla-verificacion-caja-chica"
            //nuevo comprobante
            $scope.idModalWizardComprobanteEdicion = 'modal-wizard-comprobante-edicion';
            $scope.idPopupQr = 'modal-wizard-comprobante-edicions';
            $scope.IdModalOpcionesQr = 'modal-opciones-qr';
            $scope.IdModalRegistrarComprobante = 'modal-registrar';
            $scope.IdModalRevisarComprobante = 'modal-revisar';
            $scope.IdModalLibroMayor = 'modal-libro-contable';
            $scope.IdModalAsignarCuenta = 'dialog-asignar-cuenta';
            //fin nuevo comprobante
            $scope.IdModalEliminarProductoVencido = "eliminar-producto-vencido"
            $scope.diccionario = Diccionario;
            //proformas facturacion
            $scope.dialogAlertasProformas = 'dialog-alertas-proforma'
            $scope.facturarProformas = 'proforma-facturacion'
            $scope.mensajeConfirmacionComprobante = 'comprobante-mensaje-confirmacion'
            $scope.idModalTablaComprasPendientes = "tabla-compras-pendientes";
            $scope.ModalMensajePago = "Modal-Mensaje-Pago";

            $scope.$on('$viewContentLoaded', function () {
                ejecutarScriptsInicio($scope.idModalTablaVencimientoProductos, $scope.idModalTablaVencimientoCreditos, $scope.idModalTablaVencimientoDeudas, $scope.idModalPagoP,
                    $scope.idmodalActualizarCreditoCliente, $scope.idmodalActualizarCreditoDeuda, $scope.idModalPagoDeuda, $scope.idModalDescuento, $scope.idModalTablaVentasPendientes,
                    $scope.idModalTablaComprasPendientes, $scope.idModalTablaBancosPendientes, $scope.idModalTablaOtrosPendientes, $scope.idModalInicioSesion,
                    $scope.idModalWizardComprobanteEdicion, $scope.IdModalOpcionesQr, $scope.IdModalRegistrarComprobante, $scope.IdModalRevisarComprobante, $scope.IdModalLibroMayor, $scope.IdModalAsignarCuenta,
                    $scope.idModalTablaDespachos, $scope.idModalTablaAsignacionDespacho, $scope.IdModalEliminarProductoVencido, $scope.dialogAlertasProformas, $scope.facturarProformas, $scope.mensajeConfirmacionComprobante,
                    $scope.idModalNuevoPedido, $scope.idModalDatosProducto, $scope.idModalNuevoClientePedido, $scope.idModalNuevaRazonCliente, $scope.idModalNuevoDestino, $scope.idModalVerificacionCajaChica,
                    $scope.ModalMensajePago);

                $scope.inicio();
                blockUI.stop();
            });
            //modal comprobante nuevo
            $scope.$on('$routeChangeStart', function (next, current) {
                /* $scope.eliminarPopup($scope.idPopupQr);
                 $scope.eliminarPopup($scope.IdModalRegistrarComprobante);
                 $scope.eliminarPopup($scope.IdModalRevisarComprobante);
                 $scope.eliminarPopup($scope.idModalWizardComprobanteEdicion);
                 $scope.eliminarPopup($scope.IdModalLibroMayor);
                 $scope.eliminarPopup($scope.IdModalOpcionesQr);
                 $scope.eliminarPopup($scope.IdModalAsignarCuenta); 
                 $scope.eliminarPopup($scope.ModalMensajePago);*/
            });

            $scope.obtenerSucursales = function () {
                var sucursales = [];
                for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
                    sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
                }
                return sucursales;
            }




            //modal nuevo comprobante
            $scope.validarGuardadoDeComprobante = function (form, nuevoComprobante, form2) {
                var mensaje = "cuenta "
                var CuentasSinGuardar = false
                var cont = 0
                nuevoComprobante.asientosContables.forEach(function (asiento, index, array) {
                    if (asiento.debe_bs == 0 && asiento.haber_bs == 0) {
                        asiento.eliminado = true
                        if (index != (array.length - 1)) {
                            mensaje += asiento.cuenta.codigo + '-' + asiento.cuenta.nombre + ". "
                            CuentasSinGuardar = true
                            cont++
                        }
                    }
                    if (index == (array.length - 1)) {
                        if (CuentasSinGuardar == false) {
                            $scope.AgregarComprobante(form, nuevoComprobante, form2)
                        } else {
                            if (cont == 1) {

                                var mensaje2 = "la " + mensaje + " es un cuenta sin monto en el debe o el haber si continua se eliminara"
                                $scope.AbrirMensajeConfirmacionComprobante(mensaje2, form, form2)
                            } else {
                                var mensaje2 = "las " + mensaje + " son cuentas sin monto en el debe o el haber si continua se eliminaran"
                                $scope.AbrirMensajeConfirmacionComprobante(mensaje2, form, form2)
                            }
                        }
                    }
                })
            }


            $scope.buscarProductos = function () {
                blockUI.start();
                $scope.paginator.filter = $scope.grupo !== undefined ? $scope.grupo : { id: 0 }
                $scope.paginator.itemsPerPage = 15;
                var promesa = ProductosPaginador($scope.usuario.id_empresa, $scope.paginator, $scope.usuario.id);
                promesa.then(function (dato) {
                    if (dato.hasErr) {
                        $scope.mostrarMensaje(dato.mensaje)
                    } else {
                        $scope.paginator.setPages(dato.paginas);
                        $scope.productos = dato.productos;
                    }

                    setTimeout(function () {
                        aplicarSwiper(4, 3, true, 2);
                    }, 1000);
                    blockUI.stop();
                }).catch(function (err) {
                    var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor."
                    $scope.mostrarMensaje(memo)
                    blockUI.stop();
                })
            }

            $scope.obtenerProductos = function () {
                $scope.paginator = Paginator();
                $scope.paginator.column = "nombre";
                $scope.paginator.filter = $scope.grupo
                $scope.paginator.callBack = $scope.buscarProductos;
                $scope.paginator.getSearch("", null, null);
            }

            $scope.AbrirProducto = function (producto) {
                console.log("elproductos es: ", producto);
                $scope.Datoproducto = producto;
                $scope.Datoproducto.cantidad = 1;
                $scope.Datoproducto.transporte = 0;
                $scope.Datoproducto.totalTransporte = 0;
                // la ventana ===
                $scope.abrirPopup($scope.idModalDatosProducto);
            }

            $scope.calcularTransporte = function () {
                $scope.Datoproducto.totalTransporte = Math.round(($scope.Datoproducto.cantidad * $scope.Datoproducto.transporte) * 1000) / 1000;
            }

            $scope.cerrarDatoProducto = function () {
                $scope.cerrarPopup($scope.idModalDatosProducto)
            }

            $scope.agregarDetallePedido = function (producto) {
                //console.log("producto sssssssssss ", producto);
                var detallePedido;
                $scope.cantidadInventario = 0;

                detallePedido = {
                    producto: producto,
                    id_producto: producto.id,
                    cantidad: producto.cantidad,
                    precio_unitario: producto.precio_unitario,
                    total: producto.cantidad * producto.precio_unitario,
                    servicio_transporte: producto.transporte,
                    latitud: 0,
                    longitud: 0,
                };


                $scope.pedido.detalles_despacho.push(detallePedido);

                $scope.cerrarDatoProducto();

                $scope.sumarTotalPedido();

            }

            $scope.sumarTotalPedido = function () {
                var sumaTotal = 0;
                for (var i = 0; i < $scope.pedido.detalles_despacho.length; i++) {
                    sumaTotal = sumaTotal + $scope.pedido.detalles_despacho[i].total;
                }
                $scope.pedido.totalPedido = Math.round((sumaTotal) * 1000) / 1000;
            }

            $scope.eliminarDetallePedido = function (detallePedido) {
                $scope.pedido.detalles_despacho.splice($scope.pedido.detalles_despacho.indexOf(detallePedido), 1);
                $scope.sumarTotalPedido();
            }

            $scope.buscarCliente = function (query) {
                if (query != "" && query != undefined) {
                    var promesa = ClientesNit($scope.usuario.id_empresa, query);
                    return promesa;
                }
            };
            $scope.habilitarDatos = true;
            $scope.establecerCliente = function (cliente) {
                $scope.pedido.cliente = cliente;

                var promesa = GetCliente(cliente.id);
                promesa.then(function (dato) {
                    console.log("los datos cliente", dato);
                    $scope.pedido.clientes_razon = dato.clientes_razon;
                    $scope.pedido.destinos = dato.cliente_destinos;
                    $scope.habilitarDatos = false;
                    blockUI.stop();
                });
                // $scope.enfocar('razon_social');
                // $scope.capturarInteraccion();
            }

            $scope.obtenerNit = function (razon) {
                $scope.pedido.cliente_nit = razon.nit;
            }

            $scope.obtenerDireccion = function (d) {
                console.log("su destino ", d);
                $scope.pedido.destino_direccion = d.destino.direccion;
            }


            $scope.guardarPedido = function (valido, pedido) {
                console.log("llegooooo a pedido guardar ", pedido);
                if (valido) {
                    $scope.ocultarMensajesValidacion();
                    var tiempoActual = new Date();
                    pedido.fecha = pedido.fechaTexto;

                    pedido.id_cliente = pedido.cliente.id;
                    pedido.id_destino = pedido.cliente_destino.id_destino;
                    pedido.id_cliente_razon = pedido.cliente_razon.id;
                    //venta.receptor=(venta.receptor!=undefined && venta.receptor!=null)?venta.receptor:((venta.receptor==undefined || venta.receptor==null)?(venta.textoVendedor!=""?{nombre_completo:venta.textoVendedor}:null):venta.receptor);
                    blockUI.start();

                    pedido.$save(function (res) {
                        if (res.hasError) {
                            blockUI.stop();
                            // $scope.crearNuevaVenta(res);
                            $scope.mostrarMensaje(res.message);
                        } else {
                            blockUI.stop();
                            $scope.cerrarNuevoPedido();
                            $scope.verificarDespachos($scope.usuario.id_empresa);

                            // $scope.crearNuevaVenta(res);
                            $scope.mostrarMensaje('Venta registrada exitosamente!');
                        }
                    }, function (error) {
                        blockUI.stop();
                        $scope.cerrarNuevoPedido();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                        // $scope.recargarItemsTabla();
                    });

                }
            }


            $scope.AbrirNuevoPedido = function (mensaje) {
                // alert("llegooooo");
                $scope.obtenerProductos();
                var fechaActual = new Date();

                $scope.pedido = new Pedidos({
                    id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, fechaTexto: "",
                    detalles_despacho: []
                });
                $scope.pedido.fechaTexto = (fechaActual.getDate() + 1) + "/" + ("0" + (fechaActual.getMonth() + 1)).slice(-2) + "/" + fechaActual.getFullYear();

                $scope.abrirPopup($scope.idModalNuevoPedido);
                $scope.pedido.totalPedido = 0;

                $scope.enfocar("razon_social");
            }

            $scope.enfocar = function (elemento) {
                $timeout(function () {
                    $("#" + elemento).focus();
                }, 0);
            }

            $scope.cerrarNuevoPedido = function () {
                $scope.cerrarPopup($scope.idModalNuevoPedido);
            }

            $scope.AbrirMensajeConfirmacionComprobante = function (mensaje, form, form2) {
                $scope.mensajeConfirmacion = mensaje
                $scope.formUno = form
                $scope.formDos = form2
                $scope.abrirPopup($scope.mensajeConfirmacionComprobante)
            }
            $scope.cerrarMensajeConfirmacionComprobante = function () {
                $scope.cerrarPopup($scope.mensajeConfirmacionComprobante)
            }
            $scope.ConfirmarGuardarComprobante = function (form, nuevoComprobante, form2) {
                var tamaño = nuevoComprobante.asientosContables.length - 1
                var ComprobantesEliminar = []
                /* for (var i = tamaño; i >= 0; i--) {
                    var asiento = nuevoComprobante.asientosContables[i]
                    if (asiento.debe_bs == 0 && asiento.haber_bs == 0) {
                        ComprobantesElinados.push(asiento)
                        $scope.nuevoComprobante.asientosContables.splice(i, 1)
                    }
                    if (i == 0) { */
                $scope.cerrarMensajeConfirmacionComprobante()
                $scope.AgregarComprobante(form, nuevoComprobante, form2)
                /*    }

               } */
            }

            $scope.asignarEmpresaExterna = function (clienteEmpresa) {
                $scope.empresaExternaSeleccionada = clienteEmpresa
                $location.path('/comensales')
            }

            $scope.fecha_excel_angular = function (fecha_desde_excel) {
                var fecha_minima_angular_indice_excel_1970 = 25569 - 1 //fecha minima angular. el -1 es para ajustar que el resultado da 1 anterior a la fecha real.
                var fecha_excel = new Date(1 / 1 / 1970)
                var diferencia_de_fecha = fecha_desde_excel - fecha_minima_angular_indice_excel_1970
                return fecha_excel.setTime(fecha_excel.getTime() + diferencia_de_fecha * 86400000)
            }
            $scope.AgregarComprobante = function (form, nuevoComprobante, form2) {
                if ($scope.moneda.dolar != "--") {
                    if (nuevoComprobante.fecha) {
                        if ($scope.totales.debe_bs == $scope.totales.haber_bs && $scope.totales.debe_bs > 0 && $scope.totales.haber_bs > 0) {
                            var listaAsientosComprobante = []
                            nuevoComprobante.asientosContables.forEach(function (asiento, index, array) {
                                if (asiento.eliminado == false) {
                                    listaAsientosComprobante.push(asiento)
                                }
                                if (index === (array.length - 1)) {
                                    if (listaAsientosComprobante.length >= 2) {

                                        if (form != null) {
                                            if (!nuevoComprobante.fecha) {
                                                form.fecha.$error.required = true
                                            } else {
                                                form.fecha.$error.required = false
                                            }
                                            if (!nuevoComprobante.gloza) {
                                                form.gloza.$error.required = true
                                            } else {
                                                form.gloza.$error.required = false
                                            }
                                            if (nuevoComprobante.asientosContables.length <= 0) {
                                                form.asientos.$error.detalleAsiento = true
                                            } else {
                                                form.asientos.$error.detalleAsiento = false
                                            }
                                            if (!form.asientos.$error.detalleAsiento && !form.gloza.$error.required && !form.fecha.$error.required) {
                                                $scope.stopGuardadoAutomaticoComprobante()
                                                NuevoComprobante($scope.mostrarMensaje, null, null, $scope.usuario, null, null, null, $scope.convertirFecha, $scope.cerrarNuevoComprobante, $scope.nuevoComprobante, null, $scope.verificarVentasComprobantes, $scope.verificarComprasComprobantes, $scope.recargarItemsTabla, $scope.number_format)
                                            }
                                        } else {
                                            if (form2) {
                                                $scope.stopGuardadoAutomaticoComprobante()
                                                NuevoComprobante($scope.mostrarMensaje, null, null, $scope.usuario, null, null, null, $scope.convertirFecha, $scope.cerrarNuevoComprobante, $scope.nuevoComprobante, null, $scope.verificarVentasComprobantes, $scope.verificarComprasComprobantes, $scope.recargarItemsTabla, $scope.number_format)
                                                $scope.totales = undefined
                                            }
                                        }
                                    } else {
                                        $scope.mostrarMensaje("El comprobante debe tener mas de 2 cuentas para guardar")
                                    }
                                }
                            });


                        } else {
                            $scope.mostrarMensaje("La suma total del DEBE y HABER deben ser iguales y mayores a 0")
                        }
                    } else {

                    }
                } else {
                    $scope.mostrarMensaje("Datos nulos en bimonetario importar cambio moneda dolar y ufv para guardar")
                }
            }
            $scope.$watch('nuevoComprobante.fecha', function () {
                var date = new Date()
                if ($scope.nuevoComprobante) {
                    if (!$scope.nuevoComprobante.fecha) {
                        $scope.nuevoComprobante.fecha = $scope.fechaATexto(date)
                    }
                }
            }, true);

            $scope.ActivarDesactivarCopiaGlosa = function (comprobante) {
                if (comprobante.copia_glosa == true) {
                    comprobante.copia_glosa == false
                } else {
                    comprobante.copia_glosa == true
                }
            }
            $scope.obtenerCambioMoneda = function (venta, compra, comprobante, view) {
                var fecha = new Date()
                var promesa = ObtenerCambioMoneda(fecha)
                promesa.then(function (dato) {
                    console.log(dato)
                    if (dato.monedaCambio) {
                        $scope.moneda = dato.monedaCambio;

                    }
                    var oForm = document.getElementById('formNuevoComprobante');
                    shortcut.add("Ctrl+shift+G", function () {
                        if ($scope.nuevoComprobante.asientosContables.length >= 2) {
                            $localStorage.nuevoComprobante = $scope.nuevoComprobante
                            $scope.ComprobanteGuardado = $localStorage.nuevoComprobante
                            $scope.mostrarMensaje("comproban guardado en almacenamiento local Satisfactoriamente")
                        }
                    })
                    shortcut.add("Ctrl+G", function () {
                        if ($scope.moneda.dolar != "--") {
                            if ($scope.nuevoComprobante.asientosContables.length >= 2) {
                                if ($scope.nuevoComprobante.asientosContables[0].cuenta) {
                                    if ($scope.nuevoComprobante.asientosContables[0].cuenta.id) {
                                        if ($scope.totales.debe_bs == $scope.totales.haber_bs) {
                                            $scope.AgregarComprobante(null, $scope.nuevoComprobante, oForm)

                                        } else {
                                            $scope.mostrarMensaje("La suma total del DEBE y HABER deben ser iguales")
                                        }
                                    } else {
                                        $scope.mostrarMensaje("Ingresar asientos contables al comprobante")
                                    }
                                } else {
                                    $scope.mostrarMensaje("Ingresar asientos contables al comprobante")
                                }
                            } else {
                                $scope.mostrarMensaje("Ingresar minimo 2 asientos contables al comprobante")
                            }
                        } else {
                            $scope.mostrarMensaje("Datos nulos en bimonetario importar cambio moneda dolar y ufv para guardar")
                        }
                    });

                    $scope.alertasComprobantes = $scope.ventasComprobantes.length + $scope.comprasComprobantes.length
                    var fecha = $scope.fechaATexto(new Date())
                    if ($scope.moneda) {
                        console.log($scope.ventas)
                        var datee = new Date()
                        $scope.nuevoComprobante = { fechaActual: datee, copia_glosa: true, fecha: fecha, id_usuario: $scope.usuario.id, asientosContables: [], eliminado: 0, abierto: 0, importe: 0, id_venta: "", id_compra: "", id_sucursal: $scope.sucursales[0], tipoComprobante: $scope.tiposComprobantes[0], tipoCambio: $scope.moneda };
                        $scope.ultimaFechaTipoComprobante($scope.nuevoComprobante)
                        if (view) {
                            $scope.pararAutoGuardado()
                        } else {
                            $scope.guardadoAutomaticoComprobante()
                        }
                        $scope.cuentaActual = {}
                        $scope.obtenerListarCuentasAuxiliares()
                        $scope.ObtenerPlantillaIngresoEgreso(venta, compra, comprobante, view);

                        $scope.obtenerGestiones()
                        if (venta == null && compra == null && comprobante == null) {
                            $scope.verComprobante = false
                            $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                        }
                        //$scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                    } else {
                        $scope.mostrarMensaje("cargar cambio de ivb y dolar")
                    }
                })
            }

            $scope.guardadoAutomaticoComprobante = function () {
                $scope.GuardadoAutomaticoComprobante;
                // Don't start a new fight if we are already fighting
                $scope.GuardadoAutomaticoComprobante = $interval(function () {
                    if ($scope.nuevoComprobante.asientosContables.length > 2) {
                        $localStorage.nuevoComprobante = $scope.nuevoComprobante
                        $scope.ComprobanteGuardado = $localStorage.nuevoComprobante
                        console.log($localStorage.nuevoComprobante)
                    }
                }, 300000);
            };
            $scope.pararAutoGuardado = function () {
                $interval.cancel($scope.GuardadoAutomaticoComprobante);
            }
            $scope.stopGuardadoAutomaticoComprobante = function () {
                $interval.cancel($scope.GuardadoAutomaticoComprobante);
                $window.localStorage.removeItem('ngStorage-nuevoComprobante');
                /* $localStorage.$reset({
                    usuario: local.usuario,
                    token: local.token
                }); */
                $localStorage.nuevoComprobante = undefined
                $scope.GuardadoAutomaticoComprobante = undefined;
                $scope.ComprobanteGuardado = undefined
            };
            $scope.obtenerCambioMoneda2 = function (fechaMoneda) {
                if (fechaMoneda.length == 10) {
                    var fecha = new Date(convertirFecha(fechaMoneda))
                    var promesa = ObtenerCambioMoneda(fecha)
                    promesa.then(function (dato) {
                        console.log(dato)
                        if (dato.monedaCambio) {
                            $scope.moneda = dato.monedaCambio;

                        } else {
                            $scope.moneda = { ufv: "--", dolar: "--" }
                        }
                        if ($scope.nuevoComprobante) {
                            if ($scope.nuevoComprobante.asientosContables.length > 0) {
                                $scope.nuevoComprobante.asientosContables.forEach(function (asiento, index, array) {
                                    $scope.ComvertirDebeEnDolar(asiento)
                                    $scope.ComvertirHaberEnDolar(asiento)
                                    if (index === (array.length - 1)) {
                                        $scope.cal($scope.nuevoComprobante.asientosContables)
                                    }
                                });
                            }
                        }
                    })
                } else {
                    console.log("faltan datos")
                }
            }
            $scope.crearNuevoComprobante = function (venta, compra, comprobante, view) {
                $scope.htmlTooltip = $sce.trustAsHtml('Acciones Rapidas<br>Ctrl+G=Guardar<br>Ctrl+shift+G=GuardadoRapido');
                $scope.obtenerCambioMoneda(venta, compra, comprobante, view);
            }

            $scope.subirExcelUfvDolar = function (event) {
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
                        var mes = [];
                        do {
                            var dia = {};
                            var fecha_vencimiento = null;
                            if (worksheet['A' + row] != undefined && worksheet['A' + row] != "") {
                                if (typeof worksheet['A' + row].v === 'number') {
                                    if (worksheet['A' + row].v % 1 === 0) {
                                        fecha_vencimiento = new Date((worksheet['A' + row].v - (25567 + 1)) * 86400 * 1000);
                                    }
                                } else {
                                    fecha_vencimiento = new Date($scope.convertirFecha(worksheet['A' + row].v));
                                }
                            }
                            dia.ufb = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                            dia.dolar = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                            dia.fecha = fecha_vencimiento;
                            mes.push(dia);
                            row++;
                            i++;
                        } while (worksheet['A' + row] != undefined);
                        console.log(mes)
                        $scope.guardarCambioMoneda(mes);
                        blockUI.stop();
                    };
                    reader.readAsBinaryString(f);
                }

            }
            $scope.guardarCambioMoneda = function (mes) {
                ContabilidadCambioMoneda.save(mes, function (dato) {
                    $scope.mostrarMensaje(dato.message)
                    if ($scope.moneda.dolar == "--") {
                        if ($scope.nuevoComprobante.fecha) {
                            $scope.obtenerCambioMoneda2($scope.nuevoComprobante.fecha)
                        } else {
                            var fecha = new Date()
                            $scope.obtenerCambioMoneda2(fecha)
                        }

                    }
                })
            }
            $scope.opcionBimonetario = false;
            $scope.VerBimonetario = function (asientos) {
                for (var i = 0; i < asientos.length; i++) {
                    var element = asientos[i];
                    if (element.debe_bs) {
                        $scope.ComvertirDebeEnDolar(element, false)
                    } else {
                        $scope.ComvertirHaberEnDolar(element, false)
                    }
                }
                console.log($scope.opcionBimonetario)
                if ($scope.opcionBimonetario != true) {
                    $scope.opcionBimonetario = false;
                } else {
                    $scope.opcionBimonetario = true;
                }
            }

            $scope.cal = function (asientos) {
                $scope.totales = { debe_bs: 0, debe_sus: 0, haber_bs: 0, haber_sus: 0 }
                asientos.forEach(function (asiento, index, array) {
                    if (asiento.eliminado != true) {
                        if (asiento.debe_bs != "") {
                            $scope.totales.debe_bs = $scope.totales.debe_bs + asiento.debe_bs
                        } else {
                            asiento.debe_bs = 0;
                            $scope.totales.debe_bs = $scope.totales.debe_bs + asiento.debe_bs
                        }
                        if (asiento.debe_sus != "") {
                            $scope.totales.debe_sus = $scope.totales.debe_sus + asiento.debe_sus
                        } else {
                            asiento.debe_sus = 0;
                            $scope.totales.debe_sus = $scope.totales.debe_sus + asiento.debe_sus
                        }
                        if (asiento.haber_bs != "") {
                            $scope.totales.haber_bs = $scope.totales.haber_bs + asiento.haber_bs
                        } else {
                            asiento.haber_bs = 0
                            $scope.totales.haber_bs = $scope.totales.haber_bs + asiento.haber_bs
                        }
                        if (asiento.haber_sus != "") {
                            $scope.totales.haber_sus = $scope.totales.haber_sus + asiento.haber_sus
                        } else {
                            asiento.haber_sus = 0
                            $scope.totales.haber_sus = $scope.totales.haber_sus + asiento.haber_sus
                        }
                    }
                    if (index === array.length - 1) {
                        $scope.totales.haber_bs = Math.round($scope.totales.haber_bs * 10000) / 10000
                        $scope.totales.debe_sus = Math.round($scope.totales.debe_sus * 1000) / 1000
                        $scope.totales.debe_bs = Math.round($scope.totales.debe_bs * 10000) / 10000
                        $scope.totales.haber_sus = Math.round($scope.totales.haber_sus * 1000) / 1000
                    }

                }, this);
            }
            $scope.ObtenerPlantillaIngresoEgreso = function (venta, compra, comprobante, view) {
                $scope.verComprobante = false
                var promesa = ConfiguracionesCuentasEmpresa($scope.usuario.id_empresa);
                var a = false;
                promesa.then(function (entidad) {
                    $scope.ListaConfiguaracionCuenta = entidad.lista;
                    console.log(entidad.lista)
                    if (venta instanceof Array) {
                        venta.forEach(function (venta2, index, array) {
                            if (venta2.check) {
                                if (venta2.cliente.clienteCuenta != null) {
                                    $scope.nuevoComprobante.id_venta = venta2.id
                                    var cuenta = venta2.cliente.clienteCuenta.cuenta
                                    console.log(venta2)
                                    console.log($scope.ListaConfiguaracionCuenta)
                                    $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta) {
                                        if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_ING) {
                                            if (configuracionCuenta.nombre == "IT" || configuracionCuenta.nombre == "CAJA/BANCOS") {
                                                var asiento = { id_venta: venta2.id, cuenta: configuracionCuenta.cuenta, debe_bs: venta2.total * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((venta2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                                $scope.nuevoComprobante.asientosContables.push(asiento);
                                            } else if (configuracionCuenta.nombre == "IVA DF" || configuracionCuenta.nombre == "IT POR PAGAR") {
                                                var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: venta2.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((venta2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                                $scope.nuevoComprobante.asientosContables.push(asiento);
                                            }
                                            if ($scope.nuevoComprobante.asientosContables.length == 2) {
                                                var asiento = { cuenta: cuenta, debe_bs: "", haber_bs: venta2.total * (87 / 100), debe_sus: "", haber_sus: Math.round(((venta2.total * 87 / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                                $scope.nuevoComprobante.asientosContables.push(asiento);
                                            }
                                        }
                                    }, this);

                                } else {
                                    a = true
                                    index = array.length - 1
                                    if (index === array.length - 1) {
                                        $scope.mostrarMensaje("asignar Cuenta")
                                    }
                                }
                            }
                            if (index === array.length - 1) {
                                if (a != true) {
                                    $scope.cal($scope.nuevoComprobante.asientosContables)
                                    $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                                }
                            }
                        }, this);
                        console.log(venta)
                    } else if (venta != null) {
                        if (venta.cliente.clienteCuenta != null) {
                            $scope.nuevoComprobante.id_venta = venta.id
                            var cuenta = venta.cliente.clienteCuenta.cuenta
                            console.log(venta)
                            console.log($scope.ListaConfiguaracionCuenta)
                            $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta, index, array) {
                                if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_ING) {

                                    if (configuracionCuenta.nombre == "IT" || configuracionCuenta.nombre == "CAJA/BANCOS") {
                                        var asiento = { id_venta: venta.id, cuenta: configuracionCuenta.cuenta, debe_bs: venta.total * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((venta.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    } else if (configuracionCuenta.nombre == "IVA DF" || configuracionCuenta.nombre == "IT POR PAGAR") {
                                        var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: venta.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((venta.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    }
                                    if ($scope.nuevoComprobante.asientosContables.length == 2) {
                                        var asiento = { cuenta: cuenta, debe_bs: "", haber_bs: venta.total * (87 / 100), debe_sus: "", haber_sus: Math.round(((venta.total * 87 / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    }
                                }
                                if (index === array.length - 1) {
                                    $scope.cal($scope.nuevoComprobante.asientosContables)
                                    $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                                }
                            }, this);

                        } else {
                            $scope.abrirCuentaClienteProvedor(venta.cliente, null);
                            $scope.mostrarMensaje("asignar Cuenta")

                        }

                    }
                    if (compra instanceof Array) {
                        compra.forEach(function (compra2, index, array) {
                            if (compra2.check) {
                                if (compra2.movimiento == undefined) {
                                    compra2.movimiento = { clase: compra2.tipoMovimiento }
                                }
                                $scope.nuevoComprobante.id_compra = compra2.id
                                if (compra2.proveedor.proveedorCuenta != null) {
                                    var cuenta = compra2.proveedor.proveedorCuenta.cuenta

                                    if (compra2.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_IMPORTACION || compra2.movimiento.clase.nombre == $scope.diccionario.MOVING_DIARIO) {
                                        var asiento = { id_compra: compra2.id, cuenta: cuenta, debe_bs: compra2.total * (87 / 100), haber_bs: "", debe_sus: Math.round(((compra2.total * (87 / 100)) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                        var asiento2 = {}
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                        $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta) {
                                            if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_EGR) {
                                                if (configuracionCuenta.nombre == "CAJA/BANCOS") {
                                                    asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra2.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                                } else {
                                                    var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: compra2.total * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((compra2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                                    $scope.nuevoComprobante.asientosContables.push(asiento);
                                                }
                                                if ($scope.nuevoComprobante.asientosContables.length == 2) { $scope.nuevoComprobante.asientosContables.push(asiento2); }
                                            }

                                        }, this);
                                    } else if (compra2.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_COMPRA_SIN_FACTURA) {
                                        var asiento = { cuenta: cuenta, debe_bs: "", haber_bs: compra2.total, debe_sus: "", haber_sus: Math.round(((compra2.total) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    } else if (compra2.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
                                        var asiento = { id_compra: compra2.id, cuenta: cuenta, debe_bs: compra2.total, haber_bs: "", debe_sus: Math.round(((compra2.total * (87 / 100)) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                        var asiento2 = {}
                                        var tiposCompras = { alm: 0, gasto: 0 }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);

                                        $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta, index, array) {
                                            if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_ING) {

                                                if (configuracionCuenta.nombre == 'CUENTA RETENCION SERVICIO' || configuracionCuenta.nombre == 'IT RETENCION SERVICIO' || configuracionCuenta.nombre == "IUE RETENCION SERVICIO") {
                                                    asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra2.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                                    $scope.nuevoComprobante.asientosContables.push(asiento2)
                                                }

                                            }
                                            if (index === array.length - 1) {
                                                $scope.cal($scope.nuevoComprobante.asientosContables)
                                                $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                                            }
                                        }, this);

                                    } else if (compra2.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
                                        var asiento = { id_compra: compra2.id, cuenta: cuenta, debe_bs: compra2.total, haber_bs: "", debe_sus: Math.round(((compra2.total * (87 / 100)) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                        var asiento2 = {}
                                        var tiposCompras = { alm: 0, gasto: 0 }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                        compra2.detallesCompra.forEach(function (dato, index, array) {
                                            if (dato.centroCosto.nombre_corto == "ALM") {
                                                tiposCompras.alm++
                                            } else if (dato.centroCosto.nombre_corto != "ALM") {
                                                tiposCompras.gasto++
                                            }
                                            if (index === (array.length - 1)) {
                                                $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta, index, array) {
                                                    if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_ING) {
                                                        if (tiposCompras.gasto >= 0 && tiposCompras.alm > 0) {
                                                            if (configuracionCuenta.nombre == 'CUENTA ALMACEN RETENCION BIEN' || configuracionCuenta.nombre == 'IT RETENCION BIEN ALMACEN' || configuracionCuenta.nombre == "IUE RETENCION BIEN ALMACEN") {
                                                                asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra2.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                                                $scope.nuevoComprobante.asientosContables.push(asiento2)
                                                            }
                                                        } else if (tiposCompras.gasto > 0 && tiposCompras.alm == 0) {
                                                            if (configuracionCuenta.nombre == 'CUENTA GASTO RETENCION BIEN' || configuracionCuenta.nombre == 'IT RETENCION BIEN GASTO' || configuracionCuenta.nombre == "IUE RETENCION BIEN GASTO") {
                                                                asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra2.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                                                $scope.nuevoComprobante.asientosContables.push(asiento2)
                                                            }
                                                        }
                                                    }
                                                    if (index === array.length - 1) {
                                                        $scope.cal($scope.nuevoComprobante.asientosContables)
                                                        $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                                                    }
                                                }, this);
                                            }
                                        })


                                    }
                                } else {
                                    a = true
                                    index = array.length - 1
                                    if (index === array.length - 1) {
                                        $scope.mostrarMensaje("asignar Cuenta")
                                    }
                                }
                            }
                            if (index === array.length - 1) {
                                if (a != true) {

                                    $scope.cal($scope.nuevoComprobante.asientosContables)

                                    $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                                }
                            }
                        }, this);
                        console.log(venta)
                    } else if (compra != null) {
                        if (compra.proveedor.proveedorCuenta != null) {
                            $scope.nuevoComprobante.id_compra = compra.id
                            var cuenta = compra.proveedor.proveedorCuenta.cuenta
                            if (compra.movimiento == undefined) {
                                compra.movimiento = { clase: compra.tipoMovimiento }
                            }
                            if (compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_IMPORTACION || compra.movimiento.clase.nombre == $scope.diccionario.MOVING_DIARIO) {
                                var asiento = { id_compra: compra.id, cuenta: cuenta, debe_bs: compra.total * (87 / 100), haber_bs: "", debe_sus: Math.round(((compra.total * (87 / 100)) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                var asiento2 = {}
                                $scope.nuevoComprobante.asientosContables.push(asiento);
                                $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta, index, array) {
                                    if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_EGR) {
                                        if (configuracionCuenta.nombre == "CAJA/BANCOS") {
                                            asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                        } else if (configuracionCuenta.nombre == "IVA CF") {
                                            var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: compra.total * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((compra.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                            $scope.nuevoComprobante.asientosContables.push(asiento);
                                        }
                                        if ($scope.nuevoComprobante.asientosContables.length == 2) { $scope.nuevoComprobante.asientosContables.push(asiento2); }
                                    }
                                    if (index === array.length - 1) {
                                        $scope.cal($scope.nuevoComprobante.asientosContables)
                                        $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                                    }
                                }, this);
                            } else if (compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
                                var asiento = { id_compra: compra.id, cuenta: cuenta, debe_bs: compra.total, haber_bs: "", debe_sus: Math.round(((compra.total * (87 / 100)) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                var asiento2 = {}
                                var tiposCompras = { alm: 0, gasto: 0 }
                                $scope.nuevoComprobante.asientosContables.push(asiento);

                                $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta, index, array) {
                                    if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_ING) {

                                        if (configuracionCuenta.nombre == 'CUENTA RETENCION SERVICIO' || configuracionCuenta.nombre == 'IT RETENCION SERVICIO' || configuracionCuenta.nombre == "IUE RETENCION SERVICIO") {
                                            asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                            $scope.nuevoComprobante.asientosContables.push(asiento2)
                                        }

                                    }
                                    if (index === array.length - 1) {
                                        $scope.cal($scope.nuevoComprobante.asientosContables)
                                        $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                                    }
                                }, this);

                            } else if (compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
                                var asiento = { id_compra: compra.id, cuenta: cuenta, debe_bs: compra.total, haber_bs: "", debe_sus: Math.round(((compra.total * (87 / 100)) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: false, activo: true, isOpen: false }
                                var asiento2 = {}
                                var tiposCompras = { alm: 0, gasto: 0 }
                                $scope.nuevoComprobante.asientosContables.push(asiento);
                                compra.detallesCompra.forEach(function (dato, index, array) {
                                    if (dato.centroCosto.nombre_corto == "ALM") {
                                        tiposCompras.alm++
                                    } else if (dato.centroCosto.nombre_corto != "ALM") {
                                        tiposCompras.gasto++
                                    }
                                    if (index === (array.length - 1)) {
                                        $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta, index, array) {
                                            if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_ING) {
                                                if (tiposCompras.gasto >= 0 && tiposCompras.alm > 0) {
                                                    if (configuracionCuenta.nombre == 'CUENTA ALMACEN RETENCION BIEN' || configuracionCuenta.nombre == 'IT RETENCION BIEN ALMACEN' || configuracionCuenta.nombre == "IUE RETENCION BIEN ALMACEN") {
                                                        asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                                        $scope.nuevoComprobante.asientosContables.push(asiento2)
                                                    }
                                                } else if (tiposCompras.gasto > 0 && tiposCompras.alm == 0) {
                                                    if (configuracionCuenta.nombre == 'CUENTA GASTO RETENCION BIEN' || configuracionCuenta.nombre == 'IT RETENCION BIEN GASTO' || configuracionCuenta.nombre == "IUE RETENCION BIEN GASTO") {
                                                        asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                                        $scope.nuevoComprobante.asientosContables.push(asiento2)
                                                    }
                                                }
                                            }
                                            if (index === array.length - 1) {
                                                $scope.cal($scope.nuevoComprobante.asientosContables)
                                                $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                                            }
                                        }, this);
                                    }
                                })


                            } else if (compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_COMPRA_SIN_FACTURA) {
                                var asiento = { cuenta: cuenta, debe_bs: "", haber_bs: compra.total, debe_sus: "", haber_sus: Math.round(((compra.total) / $scope.moneda.dolar) * 10000) / 10000, eliminado: false, activo: true, isOpen: false }
                                $scope.nuevoComprobante.asientosContables.push(asiento);
                                $scope.cal($scope.nuevoComprobante.asientosContables)
                                $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                            }
                        } else {
                            $scope.mostrarMensaje("asignar Cuenta")
                            $scope.abrirCuentaClienteProvedor(null, compra.proveedor);
                        }

                    }
                    if (comprobante != null) {
                        $scope.nuevoComprobante = comprobante;

                        if (comprobante.sucursal) {
                            $scope.nuevoComprobante.id_sucursal = comprobante.sucursal
                        }
                        if (comprobante.fecha.length == 10) {
                            var fecha = comprobante.fecha
                            $scope.nuevoComprobante.fecha = fecha
                        } else {
                            var fecha = new Date(comprobante.fecha)
                            $scope.nuevoComprobante.fecha = $scope.fechaATexto(fecha)
                        }
                        $scope.totales = { debe_bs: 0, debe_sus: 0, haber_bs: 0, haber_sus: 0 }
                        $scope.cal($scope.nuevoComprobante.asientosContables)
                        /* $scope.nuevoComprobante.asientosContables.forEach(function (asiento, index, array) {
                            $scope.totales.debe_bs += asiento.debe_bs
                            $scope.totales.haber_bs += asiento.haber_bs
                            $scope.totales.debe_sus += asiento.debe_sus
                            $scope.totales.haber_sus += asiento.haber_sus
                            if (index === (array.length - 1)) {
                                $scope.totales.haber_bs = Math.round($scope.totales.haber_bs * 10000) / 10000
                                $scope.totales.debe_sus = Math.round($scope.totales.debe_sus * 1000) / 1000
                                $scope.totales.debe_bs = Math.round($scope.totales.debe_bs * 10000) / 10000
                                $scope.totales.haber_sus = Math.round($scope.totales.haber_sus * 1000) / 1000
    
                            }
                        }, this); */
                        if (view) {
                            $scope.verComprobante = true
                        }

                        $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
                        /* comprobante.comprobante.forEach(function (comprobante2) {
                            var cuenta = comprobante2.cuentas
                            var asiento = { id: cuenta.id, cuenta: cuenta, debe_bs: cuenta.debe * 87 / 100, haber_bs: "", debe_sus: Math.round(((cuenta.debe * 87 / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
                            $scope.nuevoComprobante.asientosContables.push(asiento);
                            $scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta) {
                                if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_EGR) {
                                    if (configuracionCuenta.nombre == "CAJA/BANCOS") {
                                        var asiento = { id: cuenta.id, cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: cuenta.debe * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((cuenta.debe * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    } else {
                                        var asiento = { id: cuenta.id, cuenta: configuracionCuenta.cuenta, debe_bs: cuenta.debe * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((cuenta.debe * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    }
                                }else{
                                    if (configuracionCuenta.nombre == "IT" || configuracionCuenta.nombre == "CAJA/BANCOS") {
                                        var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: cuenta.debe * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((cuenta.debe * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    } else {
                                        var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: cuenta.debe * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((cuenta.debe * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    }
                                    if ($scope.nuevoComprobante.asientosContables.length == 2) {
                                        var asiento = { cuenta: cuenta, debe_bs: "", haber_bs: cuenta.debe * (87 / 100), debe_sus: "", haber_sus: Math.round(((cuenta.debe * 87 / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
                                        $scope.nuevoComprobante.asientosContables.push(asiento);
                                    }
                                }
                            }, this); 
                            $scope.nuevoComprobante.AsientosActuales = $scope.nuevoComprobante.asientosContables.length;
                        }, this); */
                    }

                    blockUI.stop();
                });
            }

            $scope.reiniciarCorrelativoComprobantes = function () {
                var fechaActual = new Date()
                var sucursalesParaActualizar = []
                if ($scope.usuario.id_empresa) {
                    var promesa = VerificarCorrelativosSucursale($scope.usuario.id_empresa)
                    promesa.then(function (sucursales) {
                        sucursales.forEach(function (sucursal, index, array) {
                            if (sucursal.fecha_reinicio_correlativo) {
                                var fechaAnterior = new Date(sucursal.fecha_reinicio_correlativo)
                                var fechaAnteriorMes = fechaAnterior.getMonth()
                                var fechaActualMes = fechaActual.getMonth()
                                if (fechaAnteriorMes != fechaActualMes || fechaAnteriorMes < fechaActualMes) {

                                    sucursalesParaActualizar.push(sucursal)
                                    if (index === (sucursales.length - 1)) {
                                        var fecha_reinicio_correlativo = new Date()
                                        fecha_reinicio_correlativo.setDate(1)
                                        var datos = { sucursales: sucursalesParaActualizar, fecha: fecha_reinicio_correlativo }
                                        var promesa = ReiniciarCorrelativoSucursales(datos)
                                        promesa.then(function (dato) {
                                            $scope.mostrarMensaje(dato.message)
                                        })
                                    }
                                } else if (fechaAnteriorMes == 11 && fechaActualMes == 0) {
                                    sucursalesParaActualizar.push(sucursal)
                                    if (index === (array.length - 1)) {
                                        var fecha_reinicio_correlativo = new Date()
                                        fecha_reinicio_correlativo.setDate(1)
                                        var datos = { sucursales: sucursalesParaActualizar, fecha: fecha_reinicio_correlativo }
                                        var promesa = ReiniciarCorrelativoSucursales(datos)
                                        promesa.then(function (dato) {
                                            $scope.mostrarMensaje(dato.message)
                                        })
                                    }
                                }
                            } else {
                                if (index === (array.length - 1)) {
                                    var fecha_reinicio_correlativo = new Date()
                                    fecha_reinicio_correlativo.setDate(1)
                                    var datos = { sucursales: sucursalesParaActualizar, fecha: fecha_reinicio_correlativo }
                                    if (sucursalesParaActualizar.length > 0) {
                                        var promesa = ReiniciarCorrelativoSucursales(datos)
                                        promesa.then(function (dato) {
                                            $scope.mostrarMensaje(dato.message)
                                        })
                                    }
                                }
                            }
                        });
                    })
                }
            }

            $scope.ComvertirDebeEnDolar = function (asiento, dato) {
                asiento.debe_sus = Math.round((asiento.debe_bs / $scope.moneda.dolar) * 10000) / 10000;
                if (asiento.cuenta.cuentaAux) {
                    asiento.cuenta.cuentaAux.debe = asiento.debe_bs;
                    asiento.cuenta.cuentaAux.haber = asiento.haber_bs;
                    if (asiento.debe_bs >= asiento.haber_bs) {
                        asiento.cuenta.cuentaAux.saldo = asiento.debe_bs - asiento.haber_bs;
                    } else {
                        asiento.cuenta.cuentaAux.saldo = asiento.haber_bs - asiento.debe_bs;
                    }
                }
                console.log(asiento.cuenta.cuentaAux)
            }
            $scope.ComvertirHaberEnDolar = function (asiento) {
                asiento.haber_sus = Math.round((asiento.haber_bs / $scope.moneda.dolar) * 10000) / 10000;
                if (asiento.cuenta.cuentaAux) {
                    asiento.cuenta.cuentaAux.debe = asiento.debe_bs;
                    asiento.cuenta.cuentaAux.haber = asiento.haber_bs;
                    if (asiento.debe_bs >= asiento.haber_bs) {
                        asiento.cuenta.cuentaAux.saldo = asiento.debe_bs - asiento.haber_bs;
                    } else {
                        asiento.cuenta.cuentaAux.saldo = asiento.haber_bs - asiento.debe_bs;
                    }
                }
            }
            $scope.ComvertirDebeEnBolivianos = function (asiento) {
                asiento.debe_bs = Math.round((asiento.debe_sus * $scope.moneda.dolar) * 10000) / 10000;
                if (asiento.cuenta.cuentaAux) {
                    asiento.cuenta.cuentaAux.debe = asiento.debe_bs;
                    asiento.cuenta.cuentaAux.haber = asiento.haber_bs;
                    if (asiento.debe_bs >= asiento.haber_bs) {
                        asiento.cuenta.cuentaAux.saldo = asiento.debe_bs - asiento.haber_bs;
                    } else {
                        asiento.cuenta.cuentaAux.saldo = asiento.haber_bs - asiento.debe_bs;
                    }
                }
            }
            $scope.ComvertirHaberEnBolivianos = function (asiento) {
                asiento.haber_bs = Math.round((asiento.haber_sus * $scope.moneda.dolar) * 10000) / 10000;
                if (asiento.cuenta.cuentaAux) {
                    asiento.cuenta.cuentaAux.debe = asiento.debe_bs;
                    asiento.cuenta.cuentaAux.haber = asiento.haber_bs;
                    if (asiento.debe_bs >= asiento.haber_bs) {
                        asiento.cuenta.cuentaAux.saldo = asiento.debe_bs - asiento.haber_bs;
                    } else {
                        asiento.cuenta.cuentaAux.saldo = asiento.haber_bs - asiento.debe_bs;
                    }
                }
            }
            $scope.obtenerTiposComprobante = function () {
                blockUI.start();
                var promesa = ClasesTipo("TCMC");
                promesa.then(function (entidad) {
                    $scope.tiposComprobantes = entidad.clases;
                    blockUI.stop();
                });
            }
            $scope.guardarComprasComprobante = function () {
                $scope.ocultarMensajesValidacion();
                $scope.DatosCodigoQr.forEach(function (element) {
                    element.fecha = new Date($scope.convertirFecha(element.fecha));
                }, this);
                blockUI.start();
                ComprasComprobante.save($scope.DatosCodigoQr, function (dato) {
                    blockUI.stop();
                    $scope.mostrarMensaje(dato.mensaje);
                    $scope.DatosCodigoQr = [];
                }, function (error) {
                    blockUI.stop();
                    $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');

                });

            }
            $scope.verificarCuenta = function (formularioAsignarCuenta, cuenta) {
                if (cuenta.id) {
                    formularioAsignarCuenta.asig.$error.cuenta = false
                    $scope.error = null
                } else {
                    formularioAsignarCuenta.asig.$error.cuenta = true
                    $scope.error = "asd"
                }
            }
            $scope.AsignarCuentaClienteProvedor = function (formularioAsignarCuenta) {
                if ($scope.datos.cuenta.id) {
                    formularioAsignarCuenta.asig.$error.cuenta = false
                    $scope.datos.$save(function (data) {
                        $scope.mostrarMensaje(data.menssage)
                        $scope.cerrarCuentaClienteProvedor()
                        $scope.verificarVentasComprobantes($scope.usuario.id_empresa)
                        $scope.verificarComprasComprobantes($scope.usuario.id_empresa)
                    })
                } else {

                    formularioAsignarCuenta.asignarCuenta.$error.cuenta = true
                    $scope.error = "asd"
                }
            }
            $scope.cerrarNuevoComprobante = function () {
                shortcut.remove("Ctrl+G", function () {

                });
                $scope.pararAutoGuardado()
                $scope.cerrarPopup($scope.idModalWizardComprobanteEdicion);
                $scope.totales = undefined
            };
            //modal qr
            $scope.abrirModalOpcionesQr = function () {
                $scope.abrirPopup($scope.IdModalOpcionesQr);
            }
            $scope.cerrarModalOpcionesQr = function () {
                $scope.cerrarPopup($scope.IdModalOpcionesQr);
            }
            //modal asignar cuenta
            $scope.abrirCuentaClienteProvedor = function (cliente, proveedor) {
                if (cliente) {
                    $scope.datos = new AsignarCuentaCiente({ id_cliente: cliente.id, cuenta: "" })
                } else {
                    $scope.datos = new AsignarCuentaProveedor({ id_proveedor: proveedor.id, cuenta: "" })
                }
                $scope.abrirPopup($scope.IdModalAsignarCuenta);
            }
            $scope.cerrarCuentaClienteProvedor = function () {
                $scope.cuenta = ""
                $scope.cerrarPopup($scope.IdModalAsignarCuenta);
            }

            //modal registrar
            $scope.abrirModalRegistrarComprobante = function () {
                $scope.abrirPopup($scope.IdModalRegistrarComprobante)
            }
            $scope.cerrarModalRegComprobante = function () {
                $scope.cerrarPopup($scope.IdModalRegistrarComprobante);
            }

            //modal revisar
            $scope.abrirModalRevisarComprobante = function () {

                $scope.ObtenerComprobantesRevision()
                $scope.abrirPopup($scope.IdModalRevisarComprobante)
            }
            $scope.ObtenerComprobantesRevision = function () {
                $scope.paginatorPrincipal = $scope.paginator;
                $scope.paginator = Paginator();
                $scope.paginator.column = "numero";
                $scope.paginator.callBack = $scope.obtenerListaRevision;
                $scope.filtro = { empresa: $scope.usuario.id_empresa, inicio: 0, fin: 0, texto_busqueda: 0 };
                if ($scope.filtro.inicio != null) {
                    $scope.paginator.getSearch("", $scope.filtro);
                    $scope.filtro.inicio = ""
                    $scope.filtro.fin = ""
                }
            }

            $scope.asignarComprobanteFavorito = function (idComprobante) {
                NuevoComprobante($scope.mostrarMensaje, $scope.paginator, $scope.filtro, null, idComprobante)
            }

            $scope.obtenerListaRevision = function () {
                blockUI.start();
                var promise = NuevoComprobante(null, $scope.paginator, $scope.filtro, null, null, null, true, $scope.convertirFecha)
                promise.then(function (data) {
                    $scope.paginator.setPages(data.paginas);
                    $scope.comprobantesRevision = data.comprobantes;
                    blockUI.stop();
                });
            }

            $scope.BuscarPorFechaLibrosMayores = function (asiento, inicio, fin) {
                var datosLibro = { asiento: asiento, fechaInicio: new Date($scope.convertirFecha(inicio)), fechaFin: new Date($scope.convertirFecha(fin)) }
                var promesa = NuevoComprobante(null, null, null, null, null, datosLibro)
                promesa.then(function (entidad) {
                    $scope.DatosLibroMayor = entidad;
                });
            }
            $scope.cerrarModalLibrosMayores = function () {
                $scope.cerrarPopup($scope.IdModalLibroMayor);
            }
            $scope.cerrarModalRevisarComprobante = function () {
                if ($scope.paginatorPrincipal != null) {
                    $scope.paginator = Paginator()
                    $scope.paginator = $scope.paginatorPrincipal;
                    $scope.paginator.column = "numero";
                    $scope.paginator.callBack = $scope.obtenerLista;
                }
                $scope.cerrarPopup($scope.IdModalRevisarComprobante);
            }

            //modal Libros mayores
            $scope.abrirModalLibrosMayores = function (asiento) {
                $scope.asiento = asiento
                var asientos = asiento;
                if (asiento.cuenta) {
                    asientos = asiento.cuenta

                } else {
                    asientos = asiento
                }
                var datosLibro = { asiento: asientos, fechaInicio: 0, fechaFin: 0 }
                var promesa = NuevoComprobante(null, null, null, null, null, datosLibro)
                promesa.then(function (entidad) {
                    $scope.DatosLibroMayor = entidad;
                    var saldo=0
                    $scope.DatosLibroMayor.cuenta.forEach(function (cuenta, index, array) {
                        if (asiento.clasificacion.saldo.nombre == "DEUDOR-DEBE" || asiento.clasificacion.saldo.nombre == "AMBAS-DEBE Y HABER") {
                            if (index == 0) {
                                cuenta.saldo_bs=   cuenta.debe_bs-cuenta.haber_bs 
                                saldo= cuenta.saldo_bs
                            } else {
                                cuenta.saldo_bs=saldo+ cuenta.debe_bs-cuenta.haber_bs                              
                            }

                        } else if (asiento.clasificacion.saldo.nombre == "ACREEDOR-HABER") {
                            if (index == 0) {
                                cuenta.saldo_bs=   cuenta.haber_bs-cuenta.debe_bs 
                                saldo= cuenta.saldo_bs
                            } else {
                                cuenta.saldo_bs=saldo+cuenta.haber_bs-cuenta.debe_bs                              
                            }
                        }
                        
                    })
                    $scope.abrirPopup($scope.IdModalLibroMayor)
                });
            }
            $scope.obtenerGestiones = function () {
                blockUI.start();
                var promesa = ClasesTipo("GTN");
                promesa.then(function (entidad) {
                    $scope.gestiones = entidad.clases;
                    blockUI.stop();
                });
            }
            $scope.buscarCuentas = function (query) {

                return NuevoComprobante($scope.mostrarMensaje, null, null, $scope.usuario, null, null, null, null, null, null, query)
            }
            $scope.eliminarDatosQr = function (dato) {
                $scope.DatosCodigoQr[dato].eliminado = true;
            }

            $scope.DatosCodigoQr = [];
            $scope.cont2 = 1
            $scope.disparo = true;
            $scope.verificarFechaQr = function (DatoQr, index) {
                var data = new Date();
                var data2 = new Date($scope.convertirFecha(DatoQr.fecha))
                var valido = ""
                if (data.getTime() < data2.getTime()) {
                    valido = true
                } else {
                    valido = false
                }
                $scope.DatosCodigoQr[index].valido = valido;
            }
            $scope.eliminarAsiento = function (asiento, index) {
                if (asiento.id) {
                    asiento.eliminado = true
                    $scope.cal($scope.nuevoComprobante.asientosContables)
                } else {
                    $scope.nuevoComprobante.asientosContables.splice(index, 1)
                    $scope.cal($scope.nuevoComprobante.asientosContables)
                }

            }
            $scope.abrirCuentasAxiliares = function (asiento) {
                asiento.activo = true
                if (asiento.cuenta.tipoAuxiliar.nombre == "CLIENTE") {
                    $scope.listaCuentasAuxiliares = $scope.listaCuentasAuxiliaresClientes;
                }
                if (asiento.cuenta.tipoAuxiliar.nombre == "EMPLEADO") {
                    $scope.listaCuentasAuxiliares = $scope.listaCuentasAuxiliaresEmpleado;
                }
                if (asiento.cuenta.tipoAuxiliar.nombre == "PROVEEDOR") {
                    $scope.listaCuentasAuxiliares = $scope.listaCuentasAuxiliaresProveedor;
                }
            }
            $scope.establecerCuentaActual2 = function (asiento) {
                var cuenta = asiento.cuenta
                var debe = 0, haber = 0;
                $scope.cuentaActual = { id: cuenta.id, nombre: cuenta.nombre, debe: cuenta.debe, haber: cuenta.haber, saldo: cuenta.saldo };

            }
            $scope.inputDebebs = function (asiento) {
                asiento.debe_bs = (asiento.debe_bs == 0) ? "" : asiento.debe_bs
            }
            $scope.inputDebeSus = function (asiento) {
                asiento.debe_sus = (asiento.debe_sus == 0) ? "" : asiento.debe_sus
            }
            $scope.inputhaberbs2 = function (asiento) {
                asiento.haber_bs = (asiento.haber_bs == 0) ? "" : asiento.haber_bs
            }
            $scope.inputHaberSus = function (asiento) {
                asiento.haber_sus = (asiento.haber_sus == 0) ? "" : asiento.haber_sus
            }
            $scope.obtenerListarCuentasAuxiliares = function () {
                var promesa = ListasCuentasAuxiliares($scope.usuario.id_empresa, 'CLIENTE')
                promesa.then(function (datos) {
                    $scope.listaCuentasAuxiliaresClientes = datos;
                    if (datos[0].es_empleado) {
                        $scope.listaCuentasAuxiliaresClientes.forEach(function (cuentaAux, index, array) {
                            cuentaAux.razon_social = cuentaAux.persona.nombre_completo
                        });
                    }
                })
                var promesa2 = ListasCuentasAuxiliares($scope.usuario.id_empresa, 'PROVEEDOR')
                promesa2.then(function (datos) {
                    $scope.listaCuentasAuxiliaresProveedor = datos;
                    if (datos[0].es_empleado) {
                        $scope.listaCuentasAuxiliaresProveedor.forEach(function (cuentaAux, index, array) {
                            cuentaAux.razon_social = cuentaAux.persona.nombre_completo
                        });
                    }
                })
                var promesa3 = ListasCuentasAuxiliares($scope.usuario.id_empresa, 'EMPLEADO')
                promesa3.then(function (datos) {
                    $scope.listaCuentasAuxiliaresEmpleado = datos;
                    if (datos[0].es_empleado) {
                        $scope.listaCuentasAuxiliaresEmpleado.forEach(function (cuentaAux, index, array) {
                            cuentaAux.razon_social = cuentaAux.persona.nombre_completo
                        });
                    }
                })
            }
            $scope.establecerCuentaActual = function (asiento, index) {
                quitarScrollInputNumber()
                /* var cuenta = asiento.cuenta
                var debe = 0, haber = 0;
                $scope.cuentaActual = { id: cuenta.id, nombre: cuenta.nombre, debe: cuenta.debe, haber: cuenta.haber, saldo: cuenta.saldo }; */
                if (asiento.cuenta.id) {
                    $scope.nuevoComprobante.asientosContables[index].debe_bs = 0
                    $scope.nuevoComprobante.asientosContables[index].haber_bs = 0
                    $scope.nuevoComprobante.asientosContables[index].debe_sus = 0
                    $scope.nuevoComprobante.asientosContables[index].haber_sus = 0
                    $scope.listaCuentasAuxiliares = {}
                    if (asiento.cuenta.tipoAuxiliar) {
                        asiento.isOpen = true;
                        if (asiento.cuenta.tipoAuxiliar.nombre == "CLIENTE") {
                            $scope.listaCuentasAuxiliares = $scope.listaCuentasAuxiliaresClientes;
                        }
                        if (asiento.cuenta.tipoAuxiliar.nombre == "EMPLEADO") {
                            $scope.listaCuentasAuxiliares = $scope.listaCuentasAuxiliaresEmpleado;
                        }
                        if (asiento.cuenta.tipoAuxiliar.nombre == "PROVEEDOR") {
                            $scope.listaCuentasAuxiliares = $scope.listaCuentasAuxiliaresProveedor;
                        }


                    } else {
                        asiento.isOpen = false;
                    }
                    if ($scope.nuevoComprobante.copia_glosa) {
                        asiento.glosa = $scope.nuevoComprobante.gloza
                        $scope.agregarAsiento()
                    }
                } else {
                    asiento.isOpen = false;
                }
            }
            $scope.selecionarCuentaAxiliar = function (asiento) {
                console.log(asiento)
                asiento.isOpen = false;
            }
            $scope.agregarDatosQr = function (evento, Dato) {
                if (evento.which === 13) {
                    $scope.cont2++;
                    datos = Dato;//$scope.cont2+"|999999999|9999999999999|17/10/2017|90|90|43|19999|0|0|0|0"
                    var DatosCodigoQr = datos.split(' ');
                    var data = new Date();
                    var data2 = new Date($scope.convertirFecha(DatosCodigoQr[3]))
                    var valido = ""
                    if (data.getTime() < data2.getTime()) {
                        valido = true
                    } else {
                        valido = false
                    }

                    var DatosRecopiladosCodigoQr = { nit: DatosCodigoQr[0], id_usuario: $scope.usuario.id, id_tipo_pago: null, tipoPago: null, detallesCompra: [], descuento_general: false, factura: DatosCodigoQr[1], autorizacion: DatosCodigoQr[2], fecha: DatosCodigoQr[3], total: DatosCodigoQr[4], total2: DatosCodigoQr[5], codigo_control: DatosCodigoQr[6], cliente_nit: DatosCodigoQr[7], ice: DatosCodigoQr[8], numero_grav: 0, sujeto_cf: 0, tipo_recargo: false, descuento: 0, recargo: 0, ice: 0, excento: 0, eliminado: false, valido: valido, lector: true }
                    $scope.DatosCodigoQr.push(DatosRecopiladosCodigoQr)
                    console.log($scope.DatosCodigoQr)
                    var DatosRecopiladosCodigoQr = null;
                    Dato = "";
                }
            }

            $scope.agregarAsientoANuevoComprobante = function (datos) {
                /* 	for (var index = 0; index < datos.asientosContables.length; index++) {
                        var asiento = { cuenta: datos.asientosContables[index].cuentas, debe_bs: datos.asientosContables[index].debe_bs, haber_bs: datos.asientosContables[index].haber_bs, debe_sus: datos.asientosContables[index].debe_sus, haber_sus: datos.asientosContables[index].haber_sus, eliminado: 0, activo: true } */
                //$scope.nuevoComprobante.asientosContables = datos.asientosContables
                datos.asientosContables.forEach(function name(asiento, index, array) {
                    $scope.nuevoComprobante.asientosContables.push(asiento)
                    if (index === (array.length - 1)) {
                        $scope.cal($scope.nuevoComprobante.asientosContables)
                    }
                });
                $scope.nuevoComprobante.tipoComprobante = datos.tipoComprobante
                $scope.mostrarMensaje("datos copiados correctamente")
                /* if (index === datos.comprobante.length - 1) { */

                /* } */

                /* } */
            }
            $scope.agregarAsiento = function () {
                if ($scope.nuevoComprobante.asientosContables.length == 0) {
                    var asiento = { glosa: "", cuenta: "", debe_bs: "", haber_bs: "", debe_sus: "", haber_sus: "", eliminado: false, activo: true, isOpen: false }
                    $scope.nuevoComprobante.asientosContables.push(asiento)
                } else {
                    if ($scope.nuevoComprobante.asientosContables[($scope.nuevoComprobante.asientosContables.length - 1)].cuenta && $scope.nuevoComprobante.asientosContables[($scope.nuevoComprobante.asientosContables.length - 1)].cuenta.id != undefined) {
                        var asiento = { glosa: "", cuenta: "", debe_bs: "", haber_bs: "", debe_sus: "", haber_sus: "", eliminado: false, activo: true, isOpen: false }
                        $scope.nuevoComprobante.asientosContables.push(asiento)
                    }
                }
            }
            $scope.agregarPrimerAsiento = function (comprobante) {
                if (comprobante.gloza) {
                    if (comprobante.asientosContables.length == 0) {
                        var asiento = { glosa: "", cuenta: "", debe_bs: "", haber_bs: "", debe_sus: "", haber_sus: "", eliminado: false, activo: true, isOpen: false }
                        $scope.nuevoComprobante.asientosContables.push(asiento)

                    }
                } else {
                    if (comprobante.asientosContables.length == 1) {
                        $scope.nuevoComprobante.asientosContables.splice(0)

                    }
                }

            }
            $scope.ultimaFechaTipoComprobante = function (comprobante) {
                var promesa = UltimaFechaTipoComprobante($scope.usuario.id_empresa, comprobante.tipoComprobante.id)
                promesa.then(function (data) {
                    var fecha = $scope.fechaATexto(new Date(data.comprobante.fecha))
                    comprobante.fecha = fecha
                    console.log(data)
                })
            }
            $scope.agregarNuevoAsiento = function (asiento, index) {
                if (asiento.glosa) {
                    if (asiento.glosa.length == 1) {
                        if ($scope.nuevoComprobante.asientosContables[index + 1]) {

                        } else {
                            var asiento = { glosa: "", cuenta: "", debe_bs: "", haber_bs: "", debe_sus: "", haber_sus: "", eliminado: false, activo: true, isOpen: false }
                            $scope.nuevoComprobante.asientosContables.push(asiento)
                            console.log(comprobante.asientosContables)
                        }
                    }
                } else {
                    if ($scope.nuevoComprobante.asientosContables[index + 1].cuenta) {

                    } else {
                        $scope.nuevoComprobante.asientosContables.splice(index + 1)
                        console.log(comprobante.asientosContables)
                    }

                }

            }

            $scope.agregarNuevoItem = function () {
                var DatosRecopiladosCodigoQr = { nit: "", factura: "", autorizacion: "", fecha: "", total: "", total2: "", codigo_control: "", cliente: "", ice: "", numero_grav: "", sujeto_cf: "", desc: "", eliminado: false, valido: null, lector: false }
                $scope.DatosCodigoQr.push(DatosRecopiladosCodigoQr)

            }
            //fin modal comprobante nuevo
            $scope.ocultarFormularioInicioSesion = function () {
                $scope.cerrarPopup($scope.idModalInicioSesion);
            }

            $scope.buscarAplicacion = function (aplicaciones, url) {
                var aplicaciones = $.grep(aplicaciones, function (e) { return e.aplicacion.url == url; });
                $scope.aplicacion = aplicaciones[0];
            }

            $scope.recargarItemsTabla = function () {
                var currentPageTemplate = $route.current.templateUrl;
                $templateCache.remove(currentPageTemplate);
                $route.reload();
            }

            $scope.cargarPagina = function () {
                $scope.generarMenus($scope.usuario);
                $scope.vencimientoTotal = 0; console.log($scope.usuario);
                if ($scope.usuario.empresa) {
                    $scope.verificarActivosFijos()
                    $scope.actualizarVencimientoDosificaciones()
                    $scope.obtenerCentroCostos();
                    $scope.obtenerMovimientoEgresoBaja();
                    $scope.obtenerEstadosPagoDespachos()
                    $scope.obtenerTiposComprobante();
                    $scope.reiniciarCorrelativoComprobantes()
                    if (screen.width > 960) {
                        $('.modal-rh-nuevo').addClass('modal-dialog');
                    } else {
                        $('.modal-rh-nuevo').removeClass('modal-dialog');
                    }
                    $scope.sucursales = $scope.obtenerSucursales();


                    /* if ($scope.usuario.empresa.usar_vencimientos) {
                        $scope.verificarVencimientosProductos($scope.usuario.id_empresa);
                        $scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
                        $scope.verificarVencimientosDeudas($scope.usuario.id_empresa);
                    }
                    $scope.verificarDespachos($scope.usuario.id_empresa);
                    if ($scope.usuario.empresa.usar_contabilidad) {
                        $scope.verificarVentasComprobantes($scope.usuario.id_empresa)
                        $scope.verificarComprasComprobantes($scope.usuario.id_empresa)
                    } */
                    //para obtener las alertas de algun nuevo modulo
                    // ingresar el consumo del servicio en VerificarNotificaciones
                    $scope.verificarNotificaciones()
                    /* if ($scope.usuario.empresa.usar_proformas) {
                        $scope.verificarAlertasProformas($scope.usuario.id_empresa)
                    } */
                }
                $scope.ocultarFormularioInicioSesion();
            }

            $scope.PopoverSubMenus = {
                templateUrl: 'PopoverSubMenus.html',
                title: 'Sub Menus',
                isOpen: false
            };

            $scope.actualizarVencimientoDosificaciones = function () {
                var prom = VencimientoDosificaciones($scope.usuario.id_empresa)
                prom.then(function (res) {
                    if (res.stack) {
                        $scope.mostrarMensaje(res.stack)
                    }
                })
            }

            $scope.verificarAlertasProformas = function (idEmpresa) {
                $scope.alertasProformas = []
                if ($scope.filtroAlertasProformas === undefined) {
                    $scope.filtroAlertasProformas = { mes: "", anio: "", razon_social: "", proforma: "" }
                }
                $scope.filtroAlertasProformas = $scope.filtrarFiltroProformas($scope.filtroAlertasProformas, true)
                var prom = alertasProformasLista(idEmpresa, $scope.filtroAlertasProformas)
                $scope.filtroAlertasProformas = $scope.filtrarFiltroProformas($scope.filtroAlertasProformas, true, true)
                prom.then(function (proformas) {
                    if (!proformas.hasErr) {
                        $scope.alertasProformas = proformas.proformas
                        $scope.vencimientoTotal += $scope.alertasProformas.length
                    }
                }).catch(function (err) {
                    $scope.mostrarMensaje(err.data !== undefined ? err.data : err.message)
                })

            }
            $scope.verificarNotificaciones = function () {
                /* $scope.verificarNotifiacion = $interval(function () { */
                $scope.vencimientoTotal = 0
                if ($scope.usuario.empresa.usar_proformas) {
                    if ($scope.usuario.id_empresa) {
                        $scope.verificarAlertasProformas($scope.usuario.id_empresa)
                    }
                }
                if ($scope.usuario.empresa) {
                    if ($scope.usuario.empresa.usar_vencimientos) {
                        $scope.verificarVencimientosProductos($scope.usuario.id_empresa);
                        $scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
                        $scope.verificarVencimientosDeudas($scope.usuario.id_empresa);

                    }
                    $scope.verificarDespachos($scope.usuario.id_empresa);
                    if ($scope.usuario.empresa.usar_contabilidad) {
                        $scope.verificarVentasComprobantes($scope.usuario.id_empresa)
                        $scope.verificarComprasComprobantes($scope.usuario.id_empresa)
                    }
                    if ($scope.usuario.encargado_verificacion_caja_chica) {
                        $scope.verificarAlertasCajaChica()

                    }
                    /* $scope.verificarNotificaciones() */
                }
                if ($scope.usuario.empresa.usar_proformas) {
                    $scope.verificarAlertasProformas($scope.usuario.id_empresa)
                }
                /* 	console.log("cargando notificaciones")
                }, 100000); */
            }
            $scope.pararverificarNotificaciones = function () {
                $interval.cancel($scope.verificarNotifiacion);
            }
            $scope.iniciarSesion = function (usuario) {
                blockUI.start();
                /*var captchResponse = $('#g-recaptcha-response').val();
                if(captchResponse.length == 0 ){
                    $scope.error='Utiliza el Captcha del sitio!';
                    blockUI.stop();
                }else{*/
                Sesion.iniciarSesion(usuario, function (res) {
                    if (res.type == false) {
                        $scope.error = res.data;
                        if (res.mensaje !== undefined) {
                            $scope.mostrarMensaje(res.mensaje)
                        }
                    } else {
                        $scope.usuario = res.data;
                        $localStorage.token = res.data.token;
                        $scope.token = $localStorage.token;
                        if (res.data.id_empresa) {
                            var promesa = UsuarioSucursalesAutenticacion(res.data.id);
                            promesa.then(function (usuarioSucursales) {
                                promesa = EmpresaDatosInicio(res.data.id_empresa);
                                promesa.then(function (empresa) {
                                    res.data.empresa = empresa[0];
                                    res.data.sucursalesUsuario = usuarioSucursales;
                                    $localStorage.usuario = JSON.stringify(res.data);
                                    $scope.cargarPagina();
                                });
                            });
                        } else {
                            $localStorage.usuario = JSON.stringify(res.data);
                            $scope.cargarPagina();
                        }
                        document.title = 'AGIL - ' + $scope.usuario.nombre_usuario;
                    }
                    blockUI.stop();
                }, function (data, status, headers, config) {

                });
                //}
            };

            $scope.generarMenus = function (usuario) {
                $scope.aplicaciones = [];

                for (var i = 0; i < usuario.rolesUsuario.length; i++) {
                    for (var j = 0; j < usuario.rolesUsuario[i].rol.aplicacionesRol.length; j++) {
                        usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion.url = usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion.url.replace("?", usuario.persona.id + "");
                        if (usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion.id_padre == null) {
                            var app = usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion;
                            app.subaplicaciones = [];
                            var bandera = false
                            if (usuario.empresa) {
                                if (usuario.empresa.aplicacionesEmpresa.length > 0) {
                                    for (var d = 0; d < usuario.empresa.aplicacionesEmpresa.length; d++) {
                                        var element = usuario.empresa.aplicacionesEmpresa[d];
                                        if (element) {
                                            if (element.id_aplicacion == app.id) {
                                                bandera = true
                                                d = usuario.empresa.aplicacionesEmpresa.length
                                            }
                                        }

                                    }
                                    if (bandera) {
                                        for (var k = 0; k < usuario.aplicacionesUsuario.length; k++) {
                                            var element = usuario.aplicacionesUsuario[k];
                                            if (element.aplicacion.titulo == app.titulo)
                                                if (element.puede_ver) {
                                                    $scope.aplicaciones.push(app);
                                                }

                                        }
                                    }
                                } else {
                                    for (var k = 0; k < usuario.aplicacionesUsuario.length; k++) {
                                        var element = usuario.aplicacionesUsuario[k];
                                        if (element.aplicacion.titulo == app.titulo)
                                            if (element.puede_ver) {
                                                $scope.aplicaciones.push(app);
                                            }

                                    }
                                }
                            } else {
                                $scope.aplicaciones.push(app);
                            }
                        }
                    }
                }

                for (var i = 0; i < usuario.rolesUsuario.length; i++) {
                    for (var j = 0; j < usuario.rolesUsuario[i].rol.aplicacionesRol.length; j++) {
                        for (var z = 0; z < $scope.aplicaciones.length; z++) {
                            if (usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion.id_padre == $scope.aplicaciones[z].id) {
                                var app2 = usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion;

                                var bandera = false
                                if (usuario.empresa) {
                                    if (usuario.empresa.aplicacionesEmpresa.length > 0) {
                                        for (var d = 0; d < usuario.empresa.aplicacionesEmpresa.length; d++) {
                                            var element = usuario.empresa.aplicacionesEmpresa[d];
                                            if (element) {
                                                if (element.id_aplicacion == app2.id) {
                                                    bandera = true
                                                    d = usuario.empresa.aplicacionesEmpresa.length
                                                }
                                            }
                                        }
                                        if (bandera) {
                                            for (var k = 0; k < usuario.aplicacionesUsuario.length; k++) {
                                                var element = usuario.aplicacionesUsuario[k];
                                                if (element.aplicacion.titulo == app2.titulo)
                                                    if (element.puede_ver) {
                                                        $scope.aplicaciones[z].subaplicaciones.push(app2);
                                                    }

                                            }
                                        }
                                    } else {
                                        for (var k = 0; k < usuario.aplicacionesUsuario.length; k++) {
                                            var element = usuario.aplicacionesUsuario[k];
                                            if (element.aplicacion.titulo == app2.titulo)
                                                if (element.puede_ver) {
                                                    $scope.aplicaciones[z].subaplicaciones.push(app2);
                                                }

                                        }
                                    }
                                } else {
                                    $scope.aplicaciones[z].subaplicaciones.push(app2);
                                }
                            }
                        }
                    }
                }
            }


            $scope.OcultarMenu = function () {

                if ($scope.ocultarMenu == true) {
                    $scope.ocultarMenu = false;
                } else {
                    $scope.ocultarMenu = true;
                }
            }

            $scope.abrirm = function () {
                $('#modal-wizard-comprobante-edicion').modal('show');
            }

            $scope.ValidarForm = function (form, steps, button) {
                ValidarForm(form, steps, button)
            }

            $scope.verificarComprasComprobantes = function (idEmpresa) {
                var promesa = ComprasComprobantesEmpresa(idEmpresa);
                promesa.then(function (dato) {
                    $scope.comprasComprobantes = dato.compras;
                    $scope.vencimientoTotal = $scope.vencimientoTotal + $scope.comprasComprobantes.length;
                });
            }

            $scope.verificarVentasComprobantes = function (idEmpresa) {
                var promesa = VentasComprobantesEmpresa(idEmpresa);
                promesa.then(function (dato) {
                    $scope.ventasComprobantes = dato.ventas;
                    $scope.vencimientoTotal = $scope.vencimientoTotal + $scope.ventasComprobantes.length;
                    // console.log(dato.ventas)
                });
            }

            $scope.verificarVencimientosProductos = function (idEmpresa) {
                //blockUI.start();
                var promesa = VencimientosProductosEmpresa(idEmpresa);
                promesa.then(function (vencimientosProductos) {
                    $scope.vencimientoTotal = $scope.vencimientoTotal + vencimientosProductos.length;
                    $scope.vencimientosProductos = vencimientosProductos;
                    //blockUI.stop();
                });
            }
            $scope.verificarAlertasCajaChica = function (filtro2) {
                //blockUI.start();
                if (filtro2) {
                    var filtro = filtro2
                } else {
                    var filtro = { id_empresa: $scope.usuario.id_empresa, historico: false, mes: "", anio: "" }
                }
                var promesa = ObtenerAlertasCajaChica(filtro, $scope.usuario.id);
                promesa.then(function (dato) {

                    $scope.alertasCajaChica = dato;
                    $scope.vencimientoTotal = $scope.vencimientoTotal + $scope.alertasCajaChica.length;
                    //blockUI.stop();
                });
            }

            $scope.verificarVencimientosCreditos = function (idEmpresa) {
                //blockUI.start();
                var promesa = VencimientosCreditosEmpresa(idEmpresa);
                promesa.then(function (vencimientosCreditos) {

                    for (var i = 0; i < vencimientosCreditos.length; i++) {
                        var fecha = new Date(vencimientosCreditos[i].fecha);
                        vencimientosCreditos[i].fecha_vencimiento = $scope.sumaFecha(vencimientosCreditos[i].dias_credito, fecha);
                        for (var j = 0; j < vencimientosCreditos[i].ventaReprogramacionPagos.length; j++) {
                            if (vencimientosCreditos[i].ventaReprogramacionPagos[j].activo) {
                                vencimientosCreditos[i].fecha_anterior = vencimientosCreditos[i].ventaReprogramacionPagos[j].fecha_anterior
                            }
                        }

                    }
                    $scope.vencimientoTotal = $scope.vencimientoTotal + vencimientosCreditos.length;
                    $scope.vencimientosCreditos = vencimientosCreditos;
                    //blockUI.stop();
                });
            }


            $scope.verificarVencimientosDeudas = function (idEmpresa) {
                //blockUI.start();
                var promesa = VencimientosDeudasEmpresa(idEmpresa);
                promesa.then(function (vencimientosDeudas) {
                    for (var i = 0; i < vencimientosDeudas.length; i++) {
                        var fecha = new Date(vencimientosDeudas[i].fecha);
                        vencimientosDeudas[i].fecha_vencimiento = $scope.sumaFecha(vencimientosDeudas[i].dias_credito, fecha);
                        for (var j = 0; j < vencimientosDeudas[i].compraReprogramacionPagos.length; j++) {
                            if (vencimientosDeudas[i].compraReprogramacionPagos[j].activo) {
                                vencimientosDeudas[i].fecha_anterior = vencimientosDeudas[i].compraReprogramacionPagos[j].fecha_anterior
                            }
                        }
                    }
                    $scope.vencimientoTotal = $scope.vencimientoTotal + vencimientosDeudas.length;
                    $scope.vencimientosDeudas = vencimientosDeudas;
                    //blockUI.stop();
                });
            }

            $scope.obtenerAlmacenes = function (idSucursal) {
                $scope.almacenes = [];
                var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
                $scope.almacenes = sucursal.almacenes;
            }
            $scope.despachoSortColumn = function (propertyName, tipo) {
                $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                $scope.propertyName = propertyName;
                $scope.propertyNameTipo = tipo;
            }
            $scope.verificarDespachos = function (idEmpresa) {
                //blockUI.start();
                var filtro = { inicio: 0, fin: 0, razon_social: 0, empleado: 0, inicio2: 0, fin2: 0 }
                var promesa = GtmTransportistas(idEmpresa);
                promesa.then(function (transportistas) {
                    $scope.gtm_transportistas = transportistas;
                    promesa = GtmEstibajes(idEmpresa);
                    promesa.then(function (estibajes) {
                        $scope.gtm_estibajes = estibajes;
                        promesa = GtmGrupoEstibajes(idEmpresa);
                        promesa.then(function (grupoEstibajes) {
                            $scope.gtm_grupo_estibajes = grupoEstibajes;
                            promesa = GtmDetallesDespachoAlerta(idEmpresa, filtro);
                            promesa.then(function (detallesDespacho) {
                                $scope.gtm_detalles_despacho = detallesDespacho;
                                $scope.vencimientoTotal = $scope.vencimientoTotal + detallesDespacho.length;
                                $scope.gtm_detalles_despacho_seleccionados = [];
                                $scope.gtm_detalles_despacho.forEach(function (despacho, index, array) {
                                    despacho.cantidad_despacho2 = despacho.saldo
                                    despacho.saldo2 = 0
                                });
                            });
                        });
                    });
                });
            }

            $scope.removerDetalleDespachoAlerta = function (detalle_despacho) {
                detalle_despacho = new GtmDetalleDespacho(detalle_despacho);
                detalle_despacho.$delete(function (res) {
                    $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.gtm_detalles_despacho_seleccionados.length;
                    $scope.verificarDespachos($scope.usuario.id_empresa);
                    $scope.mostrarMensaje(res.mensaje);
                });
            }

            /* 	$scope.calcularTotalCarga=function(transportista){
                    var totalCantidadCarga=0;
                    for(var i=0;i<$scope.gtm_detalles_despacho_seleccionados.length;i++){
                        if($scope.gtm_detalles_despacho_seleccionados[i].id_transportista==transportista.id){
                            totalCantidadCarga=totalCantidadCarga+$scope.gtm_detalles_despacho_seleccionados[i].cantidad;
                        }
                    }
                    return totalCantidadCarga;
                }
         */
            $scope.cambiarSeleccionDetallesDespacho = function (seleccion) {
                $scope.gtm_detalles_despacho_seleccionados = [];
                for (var i = 0; i < $scope.gtm_detalles_despacho.length; i++) {
                    $scope.gtm_detalles_despacho[i].seleccionado = seleccion;
                    if ($scope.gtm_detalles_despacho[i].seleccionado) {
                        $scope.gtm_detalles_despacho_seleccionados.push($scope.gtm_detalles_despacho[i]);
                    }
                }
            }

            $scope.calcularTotalCantidad = function () {
                var totalCantidadDespacho = 0;
                if ($scope.gtm_detalles_despacho_seleccionados != undefined) {
                    for (var i = 0; i < $scope.gtm_detalles_despacho_seleccionados.length; i++) {
                        totalCantidadDespacho = totalCantidadDespacho + $scope.gtm_detalles_despacho_seleccionados[i].cantidad;
                    }
                }
                return totalCantidadDespacho;
            }

            $scope.cambiarSeleccionDetalleDespacho = function (gtm_detalle_despacho) {
                if (gtm_detalle_despacho.seleccionado) {
                    $scope.gtm_detalles_despacho_seleccionados.push(gtm_detalle_despacho);
                    if ($scope.gtm_detalles_despacho_seleccionados.length == $scope.gtm_detalles_despacho.length) {
                        $scope.detalles_despacho_seleccionados = true;
                    }
                } else {
                    $scope.gtm_detalles_despacho_seleccionados.splice($scope.gtm_detalles_despacho_seleccionados.indexOf(gtm_detalle_despacho), 1);
                    $scope.detalles_despacho_seleccionados = false;
                }
            }

            $scope.guardarDespachos = function (id_almacen_despacho, id_sucursal_despacho, fecha) {
                blockUI.start();

                GuardarGtmDetalleDespachoAlerta.update({ id_empresa: $scope.usuario.id_empresa, fecha: fecha }, { detalles_despacho: $scope.gtm_detalles_despacho_seleccionados, id_almacen: id_almacen_despacho, id_sucursal: id_sucursal_despacho }, function (res) {


                    blockUI.stop();
                    /* $scope.cerrarListaDespachos(); */
                    if (res.hasError) {
                        $scope.mostrarMensaje(res.mensaje);
                    } else {
                        $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.gtm_detalles_despacho_seleccionados.length;
                        $scope.verificarDespachos($scope.usuario.id_empresa);
                        $scope.mostrarMensaje(res.mensaje);
                        /* $scope.recargarItemsTabla()					 */
                    }


                })
            }

            $scope.calcularSaldoDespacho = function (gtm_detalle_despacho) {
                gtm_detalle_despacho.saldo2 = gtm_detalle_despacho.cantidad - (gtm_detalle_despacho.cantidad_despacho + gtm_detalle_despacho.cantidad_despacho2);
            }

            $scope.calcularSaldoFacturaProforma = function (facturaProforma) {
                $scope.facturaProformas.saldo = facturaProforma.importe - facturaProforma.a_cuenta
            }

            $scope.establecerDespacho = function (asignacion) {
                for (var i = 0; i < $scope.gtm_detalles_despacho_seleccionados.length; i++) {
                    $scope.gtm_detalles_despacho_seleccionados[i].id_estibaje = asignacion.id_estibaje;
                    $scope.gtm_detalles_despacho_seleccionados[i].id_grupo_estibaje = asignacion.id_grupo_estibaje;
                    $scope.gtm_detalles_despacho_seleccionados[i].id_transportista = asignacion.id_transportista;

                }
                var fecha = new Date($scope.convertirFecha(asignacion.fecha))
                $scope.guardarDespachos($scope.id_almacen_despacho, $scope.id_sucursal_despacho, fecha)
                $scope.cerrarAsignacionDespacho();
            }

            $scope.abrirAsignacionDespacho = function (model, form, sucursal, almacen) {
                if (form.$valid) {
                    $scope.id_almacen_despacho = almacen
                    $scope.id_sucursal_despacho = sucursal
                    $scope.id_sucursal_despacho = sucursal
                    if (model) {
                        $scope.gtm_detalles_despacho_seleccionados = []
                        $scope.gtm_detalles_despacho_seleccionados.push(model);
                        $scope.abrirPopup($scope.idModalTablaAsignacionDespacho);
                    } else {
                        $scope.abrirPopup($scope.idModalTablaAsignacionDespacho);
                    }
                } else {
                    $scope.errorDespacho = true
                }
            }

            $scope.cerrarAsignacionDespacho = function () {
                $scope.cerrarPopup($scope.idModalTablaAsignacionDespacho);
            }
            $scope.abrirEliminarProductoVencido = function () {
                $scope.abrirPopup($scope.IdModalEliminarProductoVencido);
            }
            $scope.cerrarEliminarProductoVencido = function () {
                $scope.cerrarPopup($scope.IdModalEliminarProductoVencido);
            }

            $scope.ActualizarFechaCreditosCliente = function (venta, fechaCredito) {

                venta.fecha = new Date(venta.fecha)
                console.log("fecha anterior " + venta.fecha)
                console.log("fecha reprogramada " + fechaCredito)
                var datos = {}
                fechaReprogramacion = new Date($scope.convertirFecha(fechaCredito)).getTime();
                fechaInicioVenta = new Date($scope.convertirFecha(venta.fecha.getDate() + "/" + (venta.fecha.getMonth() + 1) + "/" + venta.fecha.getFullYear())).getTime();
                var diff = fechaReprogramacion - fechaInicioVenta;
                var diferencia = diff / (1000 * 60 * 60 * 24);
                console.log(diferencia)
                datos.dias_credito = diferencia
                datos.fecha_reprogramacion = new Date($scope.convertirFecha(fechaCredito));
                datos.fecha_anterior = new Date($scope.convertirFecha(venta.fecha_vencimiento.getDate() + "/" + (venta.fecha_vencimiento.getMonth() + 1) + "/" + venta.fecha_vencimiento.getFullYear()));
                console.log(datos)
                ClienteVencimientoCredito.update({ id: venta.id }, datos, function (res) {
                    $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosCreditos.length;
                    $scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
                    $scope.cerrarActualizarFechaCreditos();
                    $scope.mostrarMensaje("¡Actualizado Satisfactoriamente!");
                });
            }

            $scope.ActualizarFechaCreditosDeudas = function (compra, fechaDeuda) {
                compra.fecha = new Date(compra.fecha)
                console.log("fecha anterior " + compra.fecha)
                console.log("fecha reprogramada " + fechaDeuda)
                var datos = {}
                fechaReprogramacion = new Date($scope.convertirFecha(fechaDeuda)).getTime();
                fechaInicioCompra = new Date($scope.convertirFecha(compra.fecha.getDate() + "/" + (compra.fecha.getMonth() + 1) + "/" + compra.fecha.getFullYear())).getTime();
                var diff = fechaReprogramacion - fechaInicioCompra;
                var diferencia = diff / (1000 * 60 * 60 * 24);
                console.log(diferencia)
                datos.dias_credito = diferencia
                datos.fecha_reprogramacion = new Date($scope.convertirFecha(fechaDeuda));
                datos.fecha_anterior = new Date($scope.convertirFecha(compra.fecha_vencimiento.getDate() + "/" + (compra.fecha_vencimiento.getMonth() + 1) + "/" + compra.fecha_vencimiento.getFullYear()));
                console.log(datos)
                ProveedorVencimientoCredito.update({ id: compra.id }, datos, function (res) {
                    $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosDeudas.length;
                    $scope.verificarVencimientosDeudas($scope.usuario.id_empresa);
                    $scope.cerrarActualizarFechaDeudas();
                    $scope.mostrarMensaje("¡Actualizado Satisfactoriamente!");
                });
            }
            $scope.obtenerMovimientoEgresoBaja = function () {
                blockUI.start();
                var promesa = ClasesTipo("MOVEGR");
                promesa.then(function (entidad) {
                    $scope.movimientoEgresoBaja = $.grep(entidad.clases, function (e) { return e.nombre_corto == $scope.diccionario.EGRE_BAJA; })[0];
                    blockUI.stop();
                });
            }
            $scope.obtenerEstadosPagoDespachos = function () {
                blockUI.start();
                var promesa = ClasesTipo("ES_DESP_PAGO");
                promesa.then(function (entidad) {
                    $scope.estadosDespacho = entidad.clases
                    blockUI.stop();
                });
            }

            $scope.abrirVentanaBaja = function (inventario) {
                var inventarios = []; inventarios.push(inventario);
                $scope.bajaInventario = new Venta({
                    id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id,
                    detallesVenta: [], detallesVentaNoConsolidadas: [],
                    importe: (inventario.producto.precio_unitario * inventario.cantidad),
                    total: (inventario.producto.precio_unitario * inventario.cantidad)
                });
                $scope.bajaInventario.sucursal = inventario.almacen.sucursal;
                $scope.bajaInventario.almacen = inventario.almacen;
                $scope.bajaInventario.movimiento = $scope.movimientoEgresoBaja;
                var fechaActual = new Date();
                $scope.bajaInventario.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
                $scope.bajaInventario.detallesVenta.push({
                    producto: inventario.producto, cantidad: inventario.cantidad,
                    importe: (inventario.producto.precio_unitario * inventario.cantidad),
                    total: (inventario.producto.precio_unitario * inventario.cantidad),
                    costos: inventarios, inventario: inventario,
                    descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false
                });
                $scope.abrirEliminarProductoVencido()
            }

            $scope.cerrarVentanaBajaProducto = function () {
                $scope.bajaInventario = null;
            }

            $scope.abrirListaDespachos = function () {
                $scope.PopoverInfoDespacho = {
                    templateUrl: 'PopoverInfoDespacho.html',
                    title: 'informacion',
                    isOpen: false
                };
                $scope.filtroDes = { inicio: "", fin: "", inicio2: "", fin2: "", razon_social: "", empleado: "", verTransporte: false }
                $scope.abrirPopup($scope.idModalTablaDespachos);
            }
            $scope.filtrarDetalleDespachos = function (filtro) {
                if (filtro.inicio) {
                    filtro.inicio2 = new Date($scope.convertirFecha(filtro.inicio))
                } else {
                    filtro.inicio2 = 0
                }
                if (filtro.fin) {
                    filtro.fin2 = new Date($scope.convertirFecha(filtro.fin))
                } else {
                    filtro.fin2 = 0
                }
                promesa = GtmDetallesDespachoAlerta($scope.usuario.id_empresa, filtro);
                promesa.then(function (detallesDespacho) {
                    $scope.gtm_detalles_despacho = detallesDespacho;
                    $scope.gtm_detalles_despacho_seleccionados = [];

                    $scope.gtm_detalles_despacho.forEach(function (despacho, index, array) {
                        despacho.cantidad_despacho2 = despacho.saldo
                        despacho.saldo2 = 0
                    });
                });

            }
            $scope.imprimirPdfDespachosALerta = function () {
                ImprimirPdfAlertaDespacho($scope.gtm_detalles_despacho_seleccionados, $scope.filtroDes, $scope.usuario, $scope.convertirFecha)
            }
            $scope.imprimirExelDespachosALerta = function () {
                ExportarExelAlarmasDespachos($scope.gtm_detalles_despacho_seleccionados, $scope.filtroDes, $scope.usuario)
            }
            $scope.verificarLimiteCredito = function (ventaActual) {

                if (ventaActual.cliente && ventaActual.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
                    var promesa = VerificarLimiteCredito(ventaActual)

                    promesa.then(function (dato) {
                        var PrimeraVenta = dato.ventas.slice(0)
                        var FechaActual = new Date()
                        var totalsaldo = 0
                        var mensaje = { uno: "", dos: "" }

                        dato.ventas.forEach(function (venta, index, array) {
                            totalsaldo += venta.saldo
                            console.log(totalsaldo)
                            if (totalsaldo >= ventaActual.cliente.linea_credito) {
                                mensaje.uno = "exedio el limite de la linea de credito"

                            }
                            if (index == (array.length - 1)) {
                                var fechaVenta = new Date(PrimeraVenta.fecha)
                                var dato = $scope.diferenciaEntreDiasEnDias(fechaVenta, FechaActual)
                                if (dato > ventaActual.cliente.plazo_credito) {
                                    mensaje.dos = "exedio el limide de dias de credito"

                                    if (ventaActual.cliente.bloquear_limite_credito == true) {
                                        $scope.mostrarMensaje(mensaje.uno + " " + mensaje.dos + " no puede realizar mas compras")
                                        $scope.blockerVenta = false
                                    } else {
                                        $scope.mostrarMensaje(mensaje.uno + " " + mensaje.dos + ", pero puede seguir consumiendo")
                                        $scope.blockerVenta = true
                                    }
                                } else {
                                    if (ventaActual.cliente.bloquear_limite_credito == true) {
                                        $scope.mostrarMensaje(mensaje.uno + " " + mensaje.dos + " no puede realizar mas compras")
                                        $scope.blockerVenta = false
                                    } else {
                                        $scope.mostrarMensaje(mensaje.uno + " " + mensaje.dos + ", pero puede seguir consumiendo")
                                        $scope.blockerVenta = true
                                    }

                                }
                            }
                        });
                    })
                } else {
                    $scope.blockerVenta = true
                }
            }

            $scope.obtenerMovimientosEgreso = function () {
                blockUI.start();
                var promesa = ClasesTipo("MOVEGR");
                promesa.then(function (entidad) {
                    $scope.movimientosEgreso = entidad.clases;
                    blockUI.stop();
                });
            }

            $scope.verificarSeleccionProformas = function () {
                $scope.obtenerMovimientosEgreso()
                $scope.obtenerTiposDePago()
                var paraFacturar = []
                if ($scope.alertasProformas.length > 0) {
                    var id_actividad = $scope.alertasProformas[0].actividad
                    $scope.alertasProformas.forEach(function (_, i) {
                        if (_.seleccionada) {
                            paraFacturar.push(_)
                        }
                        if (i === $scope.alertasProformas.length - 1) {
                            $scope.generarFacturaciondeProformas(paraFacturar)
                        }
                    })
                }
            }
            $scope.abrirListaVencimientoProformas = function (alreadyOpen) {
                // $scope.obtenerMeses()
                if ($scope.filtroAlertasProformas === undefined) {
                    $scope.filtroAlertasProformas = { mes: "", anio: "", razon_social: "", proforma: "" }
                }
                $scope.filtroAlertasProformas = $scope.filtrarFiltroProformas($scope.filtroAlertasProformas, true)
                var prom = alertasProformasLista($scope.usuario.empresa.id, $scope.filtroAlertasProformas)
                prom.then(function (proformas) {
                    $scope.filtroAlertasProformas = $scope.filtrarFiltroProformas($scope.filtroAlertasProformas, true, true)
                    $scope.alertasProformas = proformas.proformas
                    $scope.alertasProformas.forEach(function (_) {
                        var dolores = 0
                        var promesa = ObtenerCambioMoneda(_.fecha_proforma)
                        promesa.then(function (dato) {
                            if (dato.monedaCambio) {
                                dolores = dato.monedaCambio.dolar;
                            } else {
                                $scope.mostrarMensaje('La fecha ' + _.fecha_proforma + ' no tiene datos del tipo de cambio de dolar.')
                            }
                            _.totalSus = _.totalImporteBs / dolores
                            if (alreadyOpen === undefined) {
                                $scope.abrirPopup($scope.dialogAlertasProformas)
                            }
                        })
                    })
                }).catch(function (err) {
                    var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                    $scope.mostrarMensaje(msg)
                    blockUI.stop()
                })

            }
            $scope.filtrarFiltroProformas = function (filtro, _, __) {
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
                    // $scope.obtenerHistoriales(true)
                } else {
                    return filtro
                }
            }

            $scope.obtenerTipoEgreso = function (movimiento) {
                var nombre_corto = movimiento.nombre_corto;
                $scope.tipoEgreso = nombre_corto;
            }

            $scope.generarFacturaciondeProformas = function (listaProformas) {
                var men = ''
                var actividadComparar = {}
                var clienteComparar = {}
                var noMismaActividad = []
                var noMismoCliente = []
                var textCli = ''
                var paraFacturar = []
                var proformaNoOk = []
                if (listaProformas.length > 0) {
                    actividadComparar = listaProformas[0].actividadEconomica.id
                    clienteComparar = listaProformas[0].cliente.id
                    listaProformas.forEach(function (pro) {
                        if (actividadComparar == pro.actividadEconomica.id && clienteComparar == pro.cliente.id) {
                            if (pro.fecha_proforma_ok !== null) {
                                men += pro.id + ', '
                                paraFacturar.push(pro)
                            } else {
                                proformaNoOk.push(pro)
                            }
                        } else {
                            noMismaActividad.push(pro)
                        }
                        if (clienteComparar == pro.cliente.id) {

                        } else {
                            noMismoCliente.push(pro)
                        }
                    })
                    if (noMismaActividad.length > 0) {
                        var text = "La(s) actividad(es) "
                        noMismaActividad.forEach(function (act, i) {
                            if (i === noMismaActividad.length - 1) {
                                text += act.actividadEconomica.nombre
                            } else {
                                text += act.actividadEconomica.nombre + ", "
                            }
                        })
                        if (noMismoCliente.length > 0) {
                            textCli = ' | '
                            textCli += " La(s) razón(es) social(es) "
                            noMismoCliente.forEach(function (cli, i) {
                                if (i === noMismoCliente.length - 1) {
                                    textCli += cli.cliente.razon_social
                                } else {
                                    textCli += cli.cliente.razon_social + ", "
                                }
                            })
                            textCli += " no pertenecen al mismo cliente " + listaProformas[0].cliente.razon_social + "  "
                        }

                        text += " no pertenecen a la misma actividad de " + listaProformas[0].actividadEconomica.nombre + "  "
                        $scope.mostrarMensaje(text + textCli)
                    } else {
                        if (paraFacturar.length > 0) {
                            $scope.abrirFacturaProformas(paraFacturar)
                            $scope.cerrarListaVencimientoProformas()
                        } else {
                            $scope.mostrarMensaje('Una o mas proformas seleccionada(s) no esta lista para facturar. total:' + proformaNoOk.length)
                        }
                    }
                } else {
                    $scope.mostrarMensaje('Seleccione como mínimo 1 proforma a facturar, seleccionadas: ' + listaProformas.length)
                }
            }
            $scope.obtenerTiposDePago = function () {
                blockUI.start();
                var promesa = ClasesTipo("TIPA");
                promesa.then(function (entidad) {
                    $scope.tiposPago = entidad.clases;
                    blockUI.stop();
                });
            }
            $scope.cambiarTipoPago = function (venta) {
                var tipoPagoO = venta.tipoPago
                var tipoPago = $.grep($scope.tiposPago, function (e) { return e.id == tipoPagoO.id; })[0];
                $scope.esContado = tipoPago.nombre_corto == 'CONT' ? true : false;
                if (venta.cliente.usar_limite_credito == true) {
                    $scope.verificarLimiteCredito(venta)
                }
            }
            $scope.generarFacturaProformas = function (valid, factura) {
                blockUI.start()
                if (valid) {
                    // Venta.save({})
                    var prom = FacturaProforma($scope.usuario.empresa.id, factura)
                    prom.then(function (res) {
                        if (res.hasError === undefined) {
                            var imgDelay = ObtenerImagen($scope.usuario.empresa.imagen)
                            imgDelay.then(function (img) {
                                ImprimirSalida("FACT", res.factura, false, $scope.usuario)
                                $scope.mostrarMensaje(res.mensaje)
                                $scope.cerrarFacturaProformas()
                                $scope.recargarItemsTabla()
                            })
                            // if ($scope.checkResourceImg($scope.usuario.empresa.imagen, $scope.usuario.empresa.imageLoaded)) {
                            // 	convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                            // 		$scope.usuario.empresa.imagen = imagenEmpresa
                            // 		$scope.usuario.empresa.imageLoaded = true
                            // 		ImprimirSalida("FACT", res.factura, false, $scope.usuario)
                            // 	})
                            // } else {
                            // 	$scope.mostrarMensaje('Existe un problema con la imagen, no se incluira en la impresión.')
                            // 	$timeout(function () {
                            // 		ImprimirSalida("FACT", res.factura, false, $scope.usuario, )
                            // 	}, 1500)
                            // }
                            // ImprimirSalida("FACT", res.factura, false, $scope.usuario)

                        } else {
                            $scope.mostrarMensaje(res.mensaje)
                        }
                        blockUI.stop()
                    }).catch(function (err) {
                        var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                        $scope.mostrarMensaje(msg)
                        blockUI.stop()
                    })
                } else {
                    $scope.mostrarMensaje('Faltan datos')
                    blockUI.stop()
                }
            }
            $scope.cerrarFacturaProformas = function (paraFacturar) {
                $scope.facturaProformas = undefined
                $scope.cerrarPopup($scope.facturarProformas);
            }
            $scope.obtenerCambioDolarActual = function () {
                var hoy = new Date();
                var dolarActual = { ufv: "--", dolar: "--" }
                var promesa = ObtenerCambioMoneda(new Date())
                promesa.then(function (res) {
                    dolarActual = { ufv: res.monedaCambio.ufv, dolar: res.monedaCambio.dolar }
                    return dolarActual
                }, function (err) {
                    $scope.mostrarMensaje('Hubo un problema al recuperar el cambio de dolar para ' + hoy.toLocaleDateString())
                    return dolarActual
                })

            }
            $scope.abrirFacturaProformas = function (paraFacturar) {
                blockUI.start()
                var datosProformas = []
                var promMov = ClasesTipo('MOVEGR')
                var movimiento = {}
                promMov.then(function (dato) {
                    dato.clases.forEach(function (clase) {
                        if (clase.nombre == "FACTURACIÓN" && clase.nombre_corto == "FACT") {
                            movimiento = clase
                        }
                    })
                    var fact = []
                    paraFacturar.forEach(function (proforma, i) {
                        fact.push(proforma.id)
                    })
                    var prom = ProformasInfo(fact.join(','))
                    prom.then(function (datosProformas) {
                        if (datosProformas.hasErr) {
                            $scope.mostrarMensaje(datosProformas.mensaje)
                            blockUI.stop()
                            return
                        }
                        // datosProformas.push(porformaConsultada.proforma)
                        $scope.facturaProformas = {}
                        $scope.facturaProformas.movimiento = movimiento
                        $scope.facturaProformas.cliente = datosProformas.proformas[0].cliente
                        // $scope.facturaProformas.actividadEconomica = datosProformas.proformas[0].actividadEconomica
                        var continuar = false
                        $scope.facturaProformas.actividad = datosProformas.proformas[0].actividadEconomica
                        datosProformas.proformas[0].sucursal.actividadesDosificaciones.forEach(function (dosificacion, k) {
                            if (dosificacion.id_actividad == $scope.facturaProformas.actividad.id && !dosificacion.expirado && !dosificacion.dosificacion.expirado) {
                                $scope.facturaProformas.sucursal = Object.assign({}, datosProformas.proformas[0].sucursal)
                                $scope.facturaProformas.sucursal.actividadesDosificaciones = Object.assign([], dosificacion)
                            }
                            if (k == datosProformas.proformas[0].sucursal.actividadesDosificaciones.length - 1) {
                                if ($scope.facturaProformas.sucursal !== undefined) {
                                    continuar = true
                                }
                            }
                        })
                        if (!continuar) {
                            blockUI.stop()
                            $scope.mostrarMensaje('Existe un problema con la dosificación actual. No se puede continuar con la facturación')
                            return
                        }
                        // $scope.facturaProformas.sucursal = datosProformas.proformas[0].sucursal
                        $scope.facturaProformas.detallesVenta = []
                        $scope.facturaProformas.detalle = ""
                        $scope.facturaProformas.totalImporteBs = 0
                        $scope.facturaProformas.totalImporteSus = 0
                        $scope.facturaProformas.importe = 0
                        $scope.facturaProformas.fecha_factura = new Date().toLocaleDateString()
                        $scope.facturaProformas.fechaTexto = new Date().toLocaleDateString()
                        $scope.facturaProformas.periodo_mes = { id: new Date().getMonth() }
                        $scope.facturaProformas.periodo_anio = { id: new Date().getFullYear() }
                        $scope.facturaProformas.datosProformas = datosProformas.proformas
                        $scope.facturaProformas.descripcion = ""
                        $scope.facturaProformas.movimiento = $scope.movimientosEgreso[0]
                        $scope.facturaProformas.id_movimiento = $scope.facturaProformas.movimiento.id
                        $scope.facturaProformas.id_tipo_pago = $scope.tiposPago[0].id
                        $scope.facturaProformas.tipoPago = $scope.tiposPago[1]
                        // $scope.obtenerTipoEgreso($scope.facturaProformas.movimiento)
                        $scope.esContado = false
                        $scope.facturaProformas.usar_servicios = true
                        $scope.facturaProformas.id_usuario = $scope.usuario.id
                        $scope.facturaProformas.fecha = new Date()
                        $scope.facturaProformas.detallesVentaNoConsolidadas = []
                        $scope.facturaProformas.id_empresa = $scope.usuario.id_empresa
                        $scope.facturaProformas.datosProformas.forEach(function (proforma, y) {
                            $scope.facturaProformas.descripcion += proforma.detalle + ". "
                            $scope.facturaProformas.totalImporteBs += proforma.totalImporteBs
                            $scope.facturaProformas.importe = $scope.facturaProformas.totalImporteBs
                            $scope.facturaProformas.total = $scope.facturaProformas.importe
                            $scope.facturaProformas.importeLiteral = ConvertirALiteral($scope.facturaProformas.totalImporteBs.toFixed(2));
                            $scope.facturaProformas.totalImporteSus = $scope.facturaProformas.totalImporteBs / proforma.tc.dolar
                            proforma.importe = proforma.importeTotalBs
                            proforma.detallesProformas.forEach(function (det, c) {
                                det.tc = proforma.tc
                                if (c === proforma.detallesProformas.length - 1) {
                                    Array.prototype.push.apply($scope.facturaProformas.detallesVenta, proforma.detallesProformas);
                                }
                                if (y === $scope.facturaProformas.datosProformas.length - 1 && c === proforma.detallesProformas.length - 1) {
                                    $scope.mostrarMensaje('Por favor espere...')
                                    $timeout(function () {
                                        $scope.abrirPopup($scope.facturarProformas)
                                    }, (5000))

                                }
                            })
                            // promesa.then(function (dato) {
                            // 	if (dato.monedaCambio) {
                            // 		tcProforma = { ufv: dato.monedaCambio.ufv, dolar: dato.monedaCambio.dolar };
                            // 	}
                            // 	proforma.tc = tcProforma
                            // 	$scope.facturaProformas.totalImporteSus = $scope.facturaProformas.totalImporteBs / tcProforma.dolar
                            // 	proforma.importe = proforma.importeTotalBs
                            // 	proforma.detallesProformas.forEach(function (det, y) {
                            // 		det.tc = proforma.tc
                            // 		if (y === proforma.detallesProformas.length - 1) {
                            // 			$scope.mostrarMensaje('Por favor espere...')
                            // 			Array.prototype.push.apply($scope.facturaProformas.detallesVenta, proforma.detallesProformas);
                            // 			$timeout(function () {
                            // 				$scope.abrirPopup($scope.facturarProformas)
                            // 			}, (5000))

                            // 		}
                            // 	})
                            // }).catch(function (err) {
                            // 	$scope.mostrarMensaje(err.data)
                            // 	blockUI.stop()
                            // })
                            $scope.dolarActual = $scope.obtenerCambioDolarActual()
                        });
                        blockUI.stop()

                    }).catch(function (err) {
                        var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null && err.data !== "") ? err.data : 'Error: Se perdio la conexión.'
                        $scope.mostrarMensaje(mensaje)
                        blockUI.stop()
                    })
                })
            }

            $scope.checkResourceImg = function (url, alreadyCheck) {
                var req = new XMLHttpRequest();
                var urli = url.split('.')
                if (urli.length == 4) {
                    return false
                } else if (urli.length == 2) {
                    return true
                } else {
                    if (alreadyCheck) {
                        return true
                    } else {
                        return false
                    }
                }
                // req.open('HEAD', host, true);
                // req.send();
                // if (req.status === 404) {
                //     return true;
                // }
                // if (req.status === 403) {
                //     return false;
                // }
            };
            // $scope.imprimirFacturaProforma = function (factura) {

            // }

            $scope.imprimirVenta = function (venta) {
                var promesa = DatosVenta(venta.id, $scope.usuario.id_empresa);
                promesa.then(function (datos) {
                    var ventaConsultada = datos.venta;
                    ventaConsultada.configuracion = datos.configuracion;
                    ventaConsultada.sucursal = datos.sucursal;
                    ventaConsultada.numero_literal = datos.numero_literal;
                    var fecha = new Date(ventaConsultada.fecha);
                    ventaConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
                    ImprimirSalida(ventaConsultada.movimiento.clase.nombre_corto, ventaConsultada, false, $scope.usuario);
                });
            }


            $scope.abrirListaVencimientoProductos = function () {
                $scope.abrirPopup($scope.idModalTablaVencimientoProductos);
            }
            $scope.cerrarListaVencimientoProformas = function () {
                $scope.filtroAlertasProformas = { mes: "", anio: "", razon_social: "", proforma: "" }
                $scope.cerrarPopup($scope.dialogAlertasProformas);
            }
            $scope.cerrarListaDespachos = function () {
                $scope.cerrarPopup($scope.idModalTablaDespachos);
            }

            $scope.cerrarListaVencimientoProductos = function () {
                $scope.cerrarPopup($scope.idModalTablaVencimientoProductos);
            }
            //modal compras pendientes
            $scope.abrirModalComprasPendientes = function () {
                $scope.abrirPopup($scope.idModalTablaComprasPendientes)
            }
            $scope.cerrarModalComprasPendientes = function () {
                $scope.cerrarPopup($scope.idModalTablaComprasPendientes);
            }
            //modal bancos pendientes
            $scope.abrirModalBancosPendientes = function () {
                $scope.abrirPopup($scope.idModalTablaBancosPendientes)
            }
            $scope.cerrarModalBancosPendientes = function () {
                $scope.cerrarPopup($scope.idModalTablaBancosPendientes);
            }
            //modal otros pendientes
            $scope.abrirModalBancosPendientes = function () {
                $scope.abrirPopup($scope.idModalTablaOtrosPendientes)
            }
            $scope.cerrarModalBancosPendientes = function () {
                $scope.cerrarPopup($scope.idModalTablaOtrosPendientes);
            }
            $scope.abrirListaVencimientoCreditos = function () {

                $scope.abrirPopup($scope.idModalTablaVencimientoCreditos);
            }

            $scope.cerrarListaVencimientoCreditos = function () {
                $scope.cerrarPopup($scope.idModalTablaVencimientoCreditos);
            }
            $scope.abrirActualizarFechaCreditos = function (venta) {
                $scope.venta = venta;
                $scope.abrirPopup($scope.idmodalActualizarCreditoCliente);
            }
            $scope.cerrarActualizarFechaCreditos = function () {
                $scope.cerrarPopup($scope.idmodalActualizarCreditoCliente);
            }
            $scope.abrirActualizarFechaDeudas = function (compra) {
                $scope.compra = compra;
                $scope.abrirPopup($scope.idmodalActualizarCreditoDeuda);
            }
            $scope.cerrarActualizarFechaDeudas = function () {
                $scope.cerrarPopup($scope.idmodalActualizarCreditoDeuda);
            }
            $scope.abrirListaVencimientoDeudas = function () {
                $scope.abrirPopup($scope.idModalTablaVencimientoDeudas);
            }

            $scope.cerrarListaVencimientoDeudas = function () {
                $scope.cerrarPopup($scope.idModalTablaVencimientoDeudas);
            }
            $scope.abrirListaVentasPendientes = function () {
                $scope.abrirPopup($scope.idModalTablaVentasPendientes);
            }

            $scope.cerrarListaVentasPendientes = function () {
                $scope.cerrarPopup($scope.idModalTablaVentasPendientes);
            }
            $scope.imprimirListaVencimientoProductos = function (vencimientosProductos) {
                blockUI.start();
                console.log(vencimientosProductos);
                var doc = new PDFDocument({ size: 'letter', margin: 10 });
                var stream = doc.pipe(blobStream());
                // draw some text
                var saldoFisico = 0;
                var saldoValuado = 0;

                var y = 140, itemsPorPagina = 30, items = 0, pagina = 1, totalPaginas = Math.ceil(vencimientosProductos.length / itemsPorPagina);
                $scope.dibujarCabeceraPDFVencimientoProductos(doc, 1, totalPaginas, vencimientosProductos);
                for (var i = 0; i < vencimientosProductos.length && items <= itemsPorPagina; i++) {

                    doc.rect(30, y - 10, 555, 20).stroke();
                    doc.font('Helvetica', 7);
                    if (vencimientosProductos[i].producto.codigo == null) {
                        doc.text("", 40, y);
                    } else {
                        doc.text(vencimientosProductos[i].producto.codigo, 40, y);
                    }
                    //
                    doc.text(vencimientosProductos[i].producto.nombre, 120, y - 6, { width: 140 });
                    vencimientosProductos[i].fecha_vencimiento = new Date(vencimientosProductos[i].fecha_vencimiento);
                    doc.text(vencimientosProductos[i].producto.unidad_medida, 260, y, { width: 50 });
                    doc.text(vencimientosProductos[i].almacen.sucursal.nombre, 305, y - 6, { width: 60 });
                    doc.text(vencimientosProductos[i].almacen.nombre, 375, y - 6, { width: 60 });
                    doc.text(vencimientosProductos[i].fecha_vencimiento.getDate() + "/" + (vencimientosProductos[i].fecha_vencimiento.getMonth() + 1) + "/" + vencimientosProductos[i].fecha_vencimiento.getFullYear(), 445, y, { width: 50 });
                    doc.text(vencimientosProductos[i].lote, 490, y, { width: 50 });
                    doc.text(vencimientosProductos[i].cantidad, 540, y, { width: 50 });
                    doc.text(vencimientosProductos[i].producto.descuento + "%", 560, y, { width: 50 });
                    y = y + 20;
                    items++;

                    if (items == itemsPorPagina) {
                        doc.addPage({ margin: 0, bufferPages: true });
                        y = 140;
                        items = 0;
                        pagina = pagina + 1;

                        $scope.dibujarCabeceraPDFVencimientoProductos(doc, pagina, totalPaginas, vencimientosProductos);

                        doc.font('Helvetica', 7);
                    }
                }
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
                blockUI.stop();

            }

            $scope.dibujarCabeceraPDFVencimientoProductos = function (doc, pagina, totalPaginas, vencimientosProductos) {
                var fechaActual = new Date();
                var min = fechaActual.getMinutes();
                if (min < 10) {
                    min = "0" + min;
                }
                doc.font('Helvetica-Bold', 10);
                doc.text($scope.usuario.empresa.razon_social, 0, 35, { align: "center" });
                doc.font('Helvetica', 8);
                doc.text("COCHABAMBA - BOLIVIA", 0, 50, { align: "center" });
                doc.font('Helvetica-Bold', 10);
                doc.text("LISTA DE VENCIMIENTOS PRODUCTOS", 0, 65, { align: "center" });
                doc.rect(210, 75, 180, 0);
                doc.font('Helvetica-Bold', 7);
                doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
                doc.rect(30, 100, 555, 30).stroke();
                doc.font('Helvetica-Bold', 8);
                doc.text("Codigo", 45, 110);
                doc.text("Productos", 120, 110, { width: 50 });
                doc.text("Unid. de Medida", 260, 110, { width: 40 });
                doc.text("Sucursal", 310, 110, { width: 60 });
                doc.text("Almacen", 370, 110, { width: 60 });
                doc.text("Venc.", 440, 110, { width: 60 });
                doc.text("Lote", 490, 110, { width: 50 });
                doc.text("Cant.", 530, 110, { width: 50 });
                doc.text("Desc.", 550, 110, { width: 50 });
                doc.font('Helvetica', 7);
                doc.text("usuario : " + $scope.usuario.nombre_usuario, 475, 740);
                doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 475, 750);
            }
            $scope.imprimirListaVencimientoCreditos = function (vencimientosCreditos) {
                blockUI.start();

                var doc = new PDFDocument({ size: 'letter', margin: 10 });
                var stream = doc.pipe(blobStream());
                // draw some text
                var saldoFisico = 0;
                var saldoValuado = 0;

                var y = 140, itemsPorPagina = 30, items = 0, pagina = 1, totalPaginas = Math.ceil(vencimientosCreditos.length / itemsPorPagina);
                $scope.dibujarCabeceraPDFVencimientoCreditos(doc, 1, totalPaginas, vencimientosCreditos);
                for (var i = 0; i < vencimientosCreditos.length && items <= itemsPorPagina; i++) {

                    doc.rect(30, y - 10, 555, 20).stroke();
                    doc.font('Helvetica', 8);
                    if (vencimientosCreditos[i].cliente.codigo == null) {
                        doc.text("", 45, y, { width: 50 });
                    } else {
                        doc.text(vencimientosCreditos[i].cliente.codigo, 45, y, { width: 50 });
                    }
                    doc.text(vencimientosCreditos[i].cliente.razon_social, 100, y);
                    if (vencimientosCreditos[i].factura == null) {
                        doc.text("Proforma", 280, y);
                    } else {
                        doc.text("Factura Nro. " + vencimientosCreditos[i].factura, 280, y);
                    }
                    vencimientosCreditos[i].fecha = new Date(vencimientosCreditos[i].fecha);
                    doc.text(vencimientosCreditos[i].fecha.getDate() + "/" + (vencimientosCreditos[i].fecha.getMonth() + 1) + "/" + vencimientosCreditos[i].fecha.getFullYear(), 400, y, { width: 50 });
                    doc.text(vencimientosCreditos[i].saldo, 500, y, { width: 50, align: "right" });
                    y = y + 20;
                    items++;

                    if (items == itemsPorPagina) {
                        doc.addPage({ margin: 0, bufferPages: true });
                        y = 140;
                        items = 0;
                        pagina = pagina + 1;

                        $scope.dibujarCabeceraPDFVencimientoCreditos(doc, pagina, totalPaginas, vencimientosCreditos);

                        doc.font('Helvetica', 8);
                    }
                }
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
                blockUI.stop();

            }

            $scope.dibujarCabeceraPDFVencimientoCreditos = function (doc, pagina, totalPaginas, vencimientosCreditos) {
                var fechaActual = new Date();
                var min = fechaActual.getMinutes();
                if (min < 10) {
                    min = "0" + min;
                }
                doc.font('Helvetica-Bold', 10);
                doc.text($scope.usuario.empresa.razon_social, 0, 35, { align: "center" });
                doc.font('Helvetica', 8);
                doc.text("COCHABAMBA - BOLIVIA", 0, 50, { align: "center" });
                doc.font('Helvetica-Bold', 10);
                doc.text("LISTA DE VENCIMIENTOS CLIENTE", 0, 65, { align: "center" });
                doc.rect(210, 75, 180, 0);
                doc.font('Helvetica-Bold', 8);
                doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
                doc.rect(30, 100, 555, 30).stroke();
                doc.font('Helvetica-Bold', 8);
                doc.text("Codigo", 45, 110);
                doc.text("Cliente", 100, 110, { width: 50 });
                doc.text("Detalle", 280, 110, { width: 60 });
                doc.text("Vencimiento", 400, 110, { width: 50 });
                doc.text("monto", 525, 110, { width: 50 });
                doc.font('Helvetica', 7);
                doc.text("usuario : " + $scope.usuario.nombre_usuario, 475, 740);
                doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 475, 750);
            }
            $scope.imprimirListaVencimientoDeudas = function (vencimientosDeudas) {
                blockUI.start();

                var doc = new PDFDocument({ size: 'letter', margin: 10 });
                var stream = doc.pipe(blobStream());
                // draw some text
                var saldoFisico = 0;
                var saldoValuado = 0;

                var y = 140, itemsPorPagina = 30, items = 0, pagina = 1, totalPaginas = Math.ceil(vencimientosDeudas.length / itemsPorPagina);
                $scope.dibujarCabeceraPDFVencimientoDeudas(doc, 1, totalPaginas, vencimientosDeudas);
                for (var i = 0; i < vencimientosDeudas.length && items <= itemsPorPagina; i++) {
                    doc.rect(30, y - 10, 555, 20).stroke();
                    doc.font('Helvetica', 8);
                    if (vencimientosDeudas[i].proveedor.codigo == null) {
                        doc.text("", 45, y, { width: 50 });
                    } else {
                        doc.text(vencimientosDeudas[i].proveedor.codigo, 45, y, { width: 50 });
                    }
                    doc.text(vencimientosDeudas[i].proveedor.razon_social, 100, y);
                    if (vencimientosDeudas[i].factura == null) {
                        doc.text("Proforma", 280, y);
                    } else {
                        doc.text("Factura Nro. " + vencimientosDeudas[i].factura, 280, y);
                    }
                    vencimientosDeudas[i].fecha = new Date(vencimientosDeudas[i].fecha);
                    doc.text(vencimientosDeudas[i].fecha.getDate() + "/" + (vencimientosDeudas[i].fecha.getMonth() + 1) + "/" + vencimientosDeudas[i].fecha.getFullYear(), 400, y, { width: 50 });
                    doc.text(vencimientosDeudas[i].saldo, 500, y, { width: 50, align: "right" });
                    y = y + 20;
                    items++;

                    if (items == itemsPorPagina) {
                        doc.addPage({ margin: 0, bufferPages: true });
                        y = 140;
                        items = 0;
                        pagina = pagina + 1;

                        $scope.dibujarCabeceraPDFVencimientoDeudas(doc, pagina, totalPaginas, vencimientosDeudas);

                        doc.font('Helvetica', 8);
                    }
                }
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
                blockUI.stop();

            }
            $scope.dibujarCabeceraPDFVencimientoDeudas = function (doc, pagina, totalPaginas, vencimientosDeudas) {
                var fechaActual = new Date();
                var min = fechaActual.getMinutes();
                if (min < 10) {
                    min = "0" + min;
                }
                doc.font('Helvetica-Bold', 10);
                doc.text($scope.usuario.empresa.razon_social, 0, 35, { align: "center" });
                doc.font('Helvetica', 8);
                doc.text("COCHABAMBA - BOLIVIA", 0, 50, { align: "center" });
                doc.font('Helvetica-Bold', 10);
                doc.text("LISTA DE VENCIMIENTOS PROVEEDORES", 0, 65, { align: "center" });
                doc.rect(210, 75, 180, 0);
                doc.font('Helvetica-Bold', 8);
                doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
                doc.rect(30, 100, 555, 30).stroke();
                doc.font('Helvetica-Bold', 8);
                doc.text("Codigo", 45, 110);
                doc.text("Proveedor", 100, 110, { width: 50 });
                doc.text("Detalle", 280, 110, { width: 60 });
                doc.text("Vencimiento", 400, 110, { width: 50 });
                doc.text("monto", 525, 110, { width: 50 });
                doc.font('Helvetica', 7);
                doc.text("usuario : " + $scope.usuario.nombre_usuario, 475, 740);
                doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 475, 750);
            }

            $scope.abrirPopupPagoCreditos = function (venta) {
                $scope.venta = venta;

                $scope.pago = null;
                $scope.abrirPopup($scope.idModalPagoP);
            }

            $scope.cerrarPopupPagoCredito = function () {
                $scope.cerrarPopup($scope.idModalPagoP);
            }

            $scope.abrirPopupPagoDeudas = function (compra) {
                $scope.compra = compra;
                $scope.pago = null;
                $scope.abrirPopup($scope.idModalPagoDeuda);
            }

            $scope.cerrarPopupPagoDeuda = function () {
                $scope.cerrarPopup($scope.idModalPagoDeuda);
            }


            $scope.realizarPago = function (idVenta, pago, UsuarioIdEmpresa) {
                var restante = 0;
                var saldo = $scope.venta.saldo;
                restante = saldo - $scope.pago;
                if (restante < 0) {
                    restante = restante;
                } else if (restante >= 0) {
                    restante = 0;
                }

                blockUI.start();
                var promesa = PagosVentaCreditos(idVenta, UsuarioIdEmpresa, { pago: pago, id_usuario_cajero: $scope.usuario.id, saldoRestante: restante });
                promesa.then(function (data) {
                    $scope.mostrarMensaje(data.mensaje);
                    $scope.cerrarPopup($scope.ModalMensajePago);
                    $scope.cerrarPopup($scope.idModalPagoP);

                    $scope.imprimirReciboVencimientoCredito(data, data.venta, pago);
                    $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosCreditos.length;
                    $scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
                    blockUI.stop();
                    /*blockUI.start();
                    VentaEmpresaDatos.update({ id: $scope.venta.id, id_empresa: $scope.usuario.id_empresa }, { pago: pago, id_usuario_cajero: $scope.usuario.id }, function(data) {
                    $scope.mostrarMensaje(data.mensaje);
                    $scope.cerrarPopup($scope.idModalPagoP);
                    $scope.imprimirReciboVencimientoCredito(data, data.venta, pago);
                    $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosCreditos.length;
                    $scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
                    blockUI.stop();
                }, function(error) {
                    $scope.mostrarMensaje(error);
                    $scope.cerrarPopup($scope.idModalPagoP);
                    $scope.obtenerVentas();
                    blockUI.stop();
                });*/
                })
            }

            $scope.mensaje = function (value) {
                $scope.accion = value;
                if ($scope.accion == true) {
                    $scope.realizarPago($scope.venta.id, $scope.pago, $scope.usuario.id);
                } else {
                    $scope.cerrarPopup($scope.ModalMensajePago);
                }
            }

            $scope.efectuarPagoVencimientoCredito = function (pago) {

                var tipoPago = $scope.usuario.empresa.usar_pago_anticipado;
                $scope.pago = pago;
                if (tipoPago == true) {
                    //usar pagos anticipados
                    if (pago <= $scope.venta.saldo) {
                        $scope.realizarPago($scope.venta.id, pago, $scope.usuario.id_empresa);
                    } else {
                        $scope.abrirPopup($scope.ModalMensajePago);
                    }
                } else {
                    //no usar pagos anticipados
                    if (pago <= $scope.venta.saldo) {
                        $scope.realizarPago($scope.venta.id, pago, $scope.usuario.id);
                    } else {
                        $scope.mostrarMensaje("El cobro excede el monto a cobrar");
                    }
                }
            }

            $scope.realizarPagoDeuda = function (idCompra, pago, idUsuario) {
                var restante = 0;
                var saldo = $scope.compra.saldo;
                restante = saldo - $scope.pago;
                if (restante < 0) {
                    restante = restante;
                } else if (restante >= 0) {
                    restante = 0;
                }
                blockUI.start();
                var promesa = CompraDatosCredito(idCompra, { pago: pago, id_usuario_cajero: idUsuario, saldoRestante: restante });
                promesa.then(function (data) {
                    $scope.mostrarMensaje(data.mensaje);
                    $scope.cerrarPopup($scope.ModalMensajePago);
                    $scope.cerrarPopup($scope.idModalPagoDeuda);
                    $scope.imprimirReciboVencimientoDeuda(data, data.compra, pago);
                    $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosDeudas.length;
                    $scope.verificarVencimientosDeudas($scope.usuario.id_empresa);
                    blockUI.stop();
                })
            }

            $scope.efectuarPagoVencimientoDeuda = function (pago) {
                var tipoPago = $scope.usuario.empresa.usar_pago_anticipado;
                $scope.pago = pago;
                if (tipoPago == true) {
                    //usar pagos anticipados
                    if (pago <= $scope.compra.saldo) {
                        $scope.realizarPagoDeuda($scope.compra.id, pago, $scope.usuario.id);
                    } else {
                        $scope.abrirPopup($scope.ModalMensajePago);
                    }
                } else {
                    //no usar pagos anticipados
                    if (pago <= $scope.compra.saldo) {
                        $scope.realizarPagoDeuda($scope.compra.id, pago, $scope.usuario.id);
                    } else {
                        $scope.mostrarMensaje("El cobro excede el monto a cobrar");
                    }
                }
                /* blockUI.start();
                 Compra.update({ id: $scope.compra.id }, { pago: pago, id_usuario_cajero: $scope.usuario.id }, function(data) {
                     $scope.mostrarMensaje(data.mensaje);
                     $scope.cerrarPopup($scope.idModalPagoDeuda);
                     $scope.imprimirReciboVencimientoDeuda(data, data.compra, pago);
                     $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosDeudas.length;
                     $scope.verificarVencimientosDeudas($scope.usuario.id_empresa);
                     blockUI.stop();
                 }, function(error) {
                     $scope.mostrarMensaje(error);
                     $scope.cerrarPopup($scope.idModalPagoDeuda);
                     $scope.obtenerCompras();
                     blockUI.stop();
                 });*/
            }

            $scope.imprimirReciboVencimientoCredito = function (data, venta, pago, usar_venta_enviada) {
                if (usar_venta_enviada) {
                    $scope.venta = venta
                }
                blockUI.start();
                var doc = new PDFDocument({ size: [227, 353], margin: 10 });
                var stream = doc.pipe(blobStream());
                doc.moveDown(2);
                doc.font('Helvetica-Bold', 8);
                doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                doc.font('Helvetica', 7);
                doc.text(venta.almacen.sucursal.nombre.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                doc.text(venta.almacen.sucursal.direccion.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                var telefono = (venta.almacen.sucursal.telefono1 != null ? venta.almacen.sucursal.telefono1 : "") +
                    (venta.almacen.sucursal.telefono2 != null ? "-" + venta.almacen.sucursal.telefono2 : "") +
                    (venta.almacen.sucursal.telefono3 != null ? "-" + venta.almacen.sucursal.telefono3 : "");
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
                doc.text(venta.almacen.sucursal.nota_recibo_correlativo, { align: 'center' });
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
                doc.text("He recibido de : " + $scope.venta.cliente.razon_social, { align: 'left' });
                doc.moveDown(0.4);
                doc.text("---------------------------------------------------------------------------------", { align: 'center' });
                doc.moveDown(0.2);
                doc.text("       CONCEPTO                                   ", { align: 'left' });
                doc.moveDown(0.2);
                doc.text("---------------------------------------------------------------------------------", { align: 'center' });
                doc.moveDown(0.4);
                venta.fecha = new Date(venta.fecha);
                doc.text("Fecha: " + venta.fecha.getDate() + "/" + (venta.fecha.getMonth() + 1) + "/" + venta.fecha.getFullYear(), 15, 210);
                var textoFact = $scope.venta.movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ? "Factura nro. " + $scope.venta.factura : "Proforma nro. " + $scope.venta.factura;
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
                $scope.venta = undefined
            }
            // $scope.imprimirReciboVencimientoCredito = function (data, venta, pago) {
            // 	blockUI.start();
            // 	var doc = new PDFDocument({ size: [227, 353], margin: 10, compress: false });
            // 	var stream = doc.pipe(blobStream());
            // 	doc.moveDown(2);
            // 	doc.font('Helvetica-Bold', 8);
            // 	doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
            // 	doc.moveDown(0.4);
            // 	doc.font('Helvetica', 7);
            // 	doc.text((venta.almacen !== undefined)?venta.almacen.sucursal.nombre.toUpperCase():(venta.sucursal !== undefined) ? venta.sucursal.nombre.toUpperCase(): 'ERROR', { align: 'center' });
            // 	doc.moveDown(0.4);
            // 	doc.text((venta.almacen !== undefined)?venta.almacen.sucursal.direccion.toUpperCase():(venta.sucursal !== undefined) ? venta.sucursal.direccion.toUpperCase(): 'ERROR', { align: 'center' });
            // 	doc.moveDown(0.4);
            // 	var telefono = (venta.almacen !== undefined)? (venta.almacen.sucursal.telefono1 != null ? venta.almacen.sucursal.telefono1 : "") +
            // 		(venta.almacen.sucursal.telefono2 != null ? "-" + venta.almacen.sucursal.telefono2 : "") +
            // 		(venta.almacen.sucursal.telefono3 != null ? "-" + venta.almacen.sucursal.telefono3 : ""):(venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
            // 		(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
            // 		(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "")
            // 	doc.text("TELF.: " + telefono, { align: 'center' });
            // 	doc.moveDown(0.4);
            // 	doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
            // 	doc.moveDown(0.5);
            // 	doc.font('Helvetica-Bold', 8);
            // 	doc.text("RECIBO", { align: 'center' });
            // 	doc.font('Helvetica', 7);
            // 	doc.moveDown(0.4);
            // 	doc.text("------------------------------------", { align: 'center' });
            // 	doc.moveDown(0.4);
            // 	doc.text((venta.almacen !== undefined) ? venta.almacen.sucursal.nota_recibo_correlativo : venta.sucursal.nota_recibo_correlativo, { align: 'center' });
            // 	//doc.text("NIT: "+$scope.usuario.empresa.nit,{align:'center'});

            // 	//doc.text("FACTURA No: "+venta.factura,{align:'center'});
            // 	doc.moveDown(0.4);
            // 	//doc.text("AUTORIZACIÓN No: "+venta.autorizacion,{align:'center'});
            // 	doc.moveDown(0.4);
            // 	doc.text("------------------------------------", { align: 'center' });
            // 	doc.moveDown(0.4);
            // 	//doc.text(venta.actividad.nombre,{align:'center'});
            // 	doc.moveDown(0.6);
            // 	var date = new Date();
            // 	doc.text("FECHA : " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), { align: 'left' });
            // 	doc.moveDown(0.4);
            // 	doc.text("He recibido de : " + ($scope.venta !== undefined) ? $scope.venta.cliente.razon_social : (venta.cliente) ? venta.cliente.razon_social : '', { align: 'left' });
            // 	doc.moveDown(0.4);
            // 	doc.text("---------------------------------------------------------------------------------", { align: 'center' });
            // 	doc.moveDown(0.2);
            // 	doc.text("       CONCEPTO                                   ", { align: 'left' });
            // 	doc.moveDown(0.2);
            // 	doc.text("---------------------------------------------------------------------------------", { align: 'center' });
            // 	doc.moveDown(0.4);
            // 	venta.fecha = new Date(venta.fecha);
            // 	doc.text("Fecha: " + venta.fecha.getDate() + "/" + (venta.fecha.getMonth() + 1) + "/" + venta.fecha.getFullYear(), 15, 210);
            // 	if ($scope.venta !== undefined) {
            // 		var textoFact = $scope.venta.movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ? "Factura nro. " + $scope.venta.factura : "Proforma nro. " + $scope.venta.factura;
            // 	} else {
            // 		var textoFact = venta.movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ? "Factura nro. " + $scope.venta.factura : "Proforma nro. " + $scope.venta.factura;	
            // 	}
            // 	doc.text(textoFact, 105, 210, { width: 100 });
            // 	doc.text("Saldo Bs " + (venta.saldo - pago) + ".-", 105, 220, { width: 100 });
            // 	doc.text("Bs " + pago + ".-", 170, 210, { width: 100 });

            // 	doc.text("--------------", 10, 230, { align: 'right' });
            // 	//oc.text("--------------------",{align:'right'});
            // 	doc.moveDown(0.3);
            // 	doc.text("TOTAL Bs.              " + pago.toFixed(2), { align: 'right' });
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.text("SON: " + data.pago, { align: 'left' });
            // 	doc.moveDown(0.6);

            // 	doc.moveDown(0.4);

            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);
            // 	doc.moveDown(0.4);

            // 	doc.text("-------------------------                       -------------------------", { align: 'center' });
            // 	doc.text("ENTREGUE CONFORME            RECIBI CONFORME", { align: 'center' });
            // 	doc.end();
            // 	stream.on('finish', function () {
            // 		var fileURL = stream.toBlobURL('application/pdf');
            // 		window.open(fileURL, '_blank', 'location=no');
            // 	});
            // 	blockUI.stop();
            // }

            $scope.imprimirReciboVencimientoDeuda = function (data, compra, pago) {
                blockUI.start();
                var doc = new PDFDocument({ size: [227, 353], margin: 10 });
                var stream = doc.pipe(blobStream());
                doc.moveDown(2);
                doc.font('Helvetica-Bold', 8);
                doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                doc.font('Helvetica', 7);
                doc.text(compra.almacen.sucursal.nombre.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                doc.text(compra.almacen.sucursal.direccion.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                var telefono = (compra.almacen.sucursal.telefono1 != null ? compra.almacen.sucursal.telefono1 : "") +
                    (compra.almacen.sucursal.telefono2 != null ? "-" + compra.almacen.sucursal.telefono2 : "") +
                    (compra.almacen.sucursal.telefono3 != null ? "-" + compra.almacen.sucursal.telefono3 : "");
                doc.text("TELF.: " + telefono, { align: 'center' });
                doc.moveDown(0.4);
                doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
                doc.moveDown(0.5);
                doc.font('Helvetica-Bold', 8);
                doc.text("PAGO", { align: 'center' });
                doc.font('Helvetica', 7);
                doc.moveDown(0.4);
                doc.text("------------------------------------", { align: 'center' });
                doc.moveDown(0.4);
                //doc.text("NIT: "+$scope.usuario.empresa.nit,{align:'center'});
                doc.moveDown(0.4);
                doc.text(compra.almacen.sucursal.nota_recibo_correlativo, { align: 'center' });
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
                doc.text("Pagado a : " + $scope.compra.proveedor.razon_social, { align: 'left' });
                doc.moveDown(0.4);
                doc.text("---------------------------------------------------------------------------------", { align: 'center' });
                doc.moveDown(0.2);
                doc.text("       CONCEPTO                                   ", { align: 'left' });
                doc.moveDown(0.2);
                doc.text("---------------------------------------------------------------------------------", { align: 'center' });
                doc.moveDown(0.4);
                compra.fecha = new Date(compra.fecha);
                doc.text("Fecha: " + compra.fecha.getDate() + "/" + (compra.fecha.getMonth() + 1) + "/" + compra.fecha.getFullYear(), 15, 210);
                var textoFact = $scope.compra.factura;
                doc.text(textoFact, 105, 210, { width: 100 });
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

            $scope.abrirVentanaDescuento = function (inventario) {
                $scope.productoVenc = inventario.producto;
                $scope.abrirPopup($scope.idModalDescuento);
            }

            $scope.guardarDecuento = function (productoVenc) {
                Producto.update({ idProducto: productoVenc.id }, productoVenc, function (res) {
                    $scope.cerrarVentanaDescuento();
                    $scope.mostrarMensaje('Actualizado Exitosamente!');
                });
            }

            $scope.cerrarVentanaDescuento = function () {
                $scope.cerrarPopup($scope.idModalDescuento);
            }

            $scope.guardarBaja = function (bajaInventario) {
                bajaInventario.fecha = new Date($scope.convertirFecha(bajaInventario.fechaTexto));
                blockUI.start();
                var movimiento = bajaInventario.movimiento.nombre_corto;
                bajaInventario.$save(function (res) {
                    $scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosProductos.length;
                    $scope.verificarVencimientosProductos($scope.usuario.id_empresa);
                    blockUI.stop();
                    $scope.bajaInventario = null;
                    $scope.mostrarMensaje('Baja registrada exitosamente!');
                    $scope.cerrarEliminarProductoVencido()
                    ImprimirSalida(movimiento, bajaInventario, true, $scope.usuario);
                }, function (error) {
                    blockUI.stop();
                    $scope.bajaInventario = null;
                    $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                    $scope.cerrarEliminarProductoVencido()
                });
            }

            $scope.mostrarMensaje = function (mensaje) {
                $scope.mensaje = mensaje;
                var dialog = $("#mensaje").removeClass('hide').dialog({
                    modal: true,
                    title_html: true,
                    width: "40%",
                    height: 190,
                    appendTo: "body" // evita que el dialog aparesca detras. ???.. parece funcionar!
                });
            }

            $scope.cerrarConfirmacion = function () {
                $("#mensaje").dialog('close');
            }

            $scope.abrirPopupConfirmacionEliminacion = function (funcionEliminacion, dataParam) {
                var dialog = $("#confirmacion-eliminacion").removeClass('hide').dialog({
                    modal: true,
                    title_html: true,
                    width: "40%",
                    height: 190,
                    appendTo: "body" // evita que el dialog aparesca detras. ???.. parece funcionar!
                });
                $scope.funcionEliminacion = funcionEliminacion;
                $scope.dataParam = dataParam;
            }

            $scope.cerrarConfirmacionEliminacion = function () {
                $("#confirmacion-eliminacion").dialog('close');
            }

            $scope.accionarEliminacion = function () {
                $scope.funcionEliminacion($scope.dataParam);
                $scope.cerrarConfirmacionEliminacion();
            }

            $scope.cerrarSesion = function () {
                Sesion.cerrarSesion(function () {
                    $scope.user = {};
                    $location.path("/");
                    $window.location.reload();
                    $scope.token = $localStorage.token;
                    $scope.usuario = $localStorage.usuario;
                    $scope.abrirPopup($scope.idModalInicioSesion);
                }, function () {
                    alert("Failed to logout!");
                });
            }

            $scope.crearPopup = function (idPopup, idImagen) {
                crearPopup(idPopup, idImagen);
            }

            $scope.abrirPopup = function (idPopup) {
                abrirPopup(idPopup);
            }

            $scope.cerrarPopup = function (idPopup) {
                ocultarPopup(idPopup);
            }

            $scope.eliminarPopup = function (idPopup) {
                eliminarPopup(idPopup);
            }
            $scope.number_format = function (numero, decimal) {
                return number_format(numero, decimal)
            }
            $scope.convertirFecha = function (fecha) {
                return convertirFecha(fecha);
            }
            $scope.sumaFecha = function (dias, fecha) {
                return sumaFecha(dias, fecha);
            }

            $scope.aplicarTabla = function (idTabla, columnas) {
                setTimeout(function () {
                    ejecutarScriptsTabla(idTabla, columnas);
                }, 2000);
            }

            $scope.ocultarMensajesValidacion = function () {
                $(".ketchup-error").css('display', 'none');
            }

            $scope.obtenerDiaActual = function () {
                var diaActual = new Date().getDay();
                var res;
                if (diaActual == 0) {
                    res = $scope.diccionario.DIA_DOMINGO;
                } else if (diaActual == 1) {
                    res = $scope.diccionario.DIA_LUNES;
                } else if (diaActual == 2) {
                    res = $scope.diccionario.DIA_MARTES;
                } else if (diaActual == 3) {
                    res = $scope.diccionario.DIA_MIERCOLES;
                } else if (diaActual == 4) {
                    res = $scope.diccionario.DIA_JUEVES;
                } else if (diaActual == 5) {
                    res = $scope.diccionario.DIA_VIERNES;
                } else if (diaActual == 6) {
                    res = $scope.diccionario.DIA_SABADO;
                }
                return res;
            }
            $scope.verificarDescuentos = function (detalles) {
                var existe = false;
                for (var i = 0; i < detalles.length; i++) {
                    if (detalles[i].descuento > 0 || detalles[i].recargo > 0 || detalles[i].ice > 0 || detalles[i].excento > 0) {
                        existe = true;
                    }
                }
                return existe;
            }

            $scope.imprimirVenta = function (venta) {
                var promesa = DatosVenta(venta.id, $scope.usuario.id_empresa);
                promesa.then(function (datos) {
                    var ventaConsultada = datos.venta;
                    ventaConsultada.configuracion = datos.configuracion;
                    ventaConsultada.sucursal = datos.sucursal;
                    ventaConsultada.numero_literal = datos.numero_literal;
                    var fecha = new Date(ventaConsultada.fecha);
                    ventaConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
                    ImprimirSalida(ventaConsultada.movimiento.clase.nombre_corto, ventaConsultada, false, $scope.usuario);
                });
            }

            $scope.imprimirCompra = function (compra) {
                var promesa = DatosCompra(compra.id, $scope.usuario.id_empresa);
                promesa.then(function (datos) {
                    var compraConsultada = datos.compra;
                    compraConsultada.configuracion = datos.configuracion;
                    compraConsultada.sucursal = datos.sucursal;
                    compraConsultada.numero_literal = datos.numero_literal;
                    var fecha = new Date(compraConsultada.fecha);
                    compraConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();


                    $scope.imprimirFacturaRolloCompra(compraConsultada);

                });
            }

            $scope.loadData = function () {
                // $http.get('recursos/data.json').success(function(data) {
                //     $scope.menu_items = data.menu_items;
                //     $scope.skin = data.skin;
                //     $scope.app_name = data.app_name;
                //     $scope.paragrahp_1 = data.paragrahp_1;
                //     $scope.paragrahp_2 = data.paragrahp_2;
                //     $scope.username_label = data.username_label;
                //     $scope.password_label = data.password_label;
                //     $scope.missing_password_label = data.missing_password_label;
                // });
                $scope.menu_items = [{ "nombre": "Noticias Mundiales", "enlace": "http://www.bbc.com/mundo" },
                { "nombre": "Los Tiempos", "enlace": "http://www.lostiempos.com/" },
                { "nombre": "yahoo", "enlace": "https://login.yahoo.com/?.src=ym&.intl=us&.lang=en-US&.done=https%3a//mail.yahoo.com" },
                { "nombre": "google.com", "enlace": "https://www.google.com/" },
                { "nombre": "facebook.com", "enlace": "https://www.facebook.com/" },
                { "nombre": "hotmail.com", "enlace": "https://login.live.com/" },
                { "nombre": "youtube.com", "enlace": "https://www.youtube.com/?hl=es&gl=ES" }];
                $scope.skin = "no-skin";
                $scope.app_name = "AGIL";
                $scope.paragrahp_1 = "Somos una empresa que cuenta con un amplio portafolio de Soluciones, Especializadas porque sabemos que tu negocio tiene necesidades propias, bien sean a nivel Administrativo Comercial Industrial, Educativo y de Servicios";
                $scope.paragrahp_2 = "Contamos con un equipo multidiciplinario comprometido a generar proyectos con resultados optimos dando siempre lo mejor de cada talento";
                $scope.username_label = "Usuario";
                $scope.password_label = "Contraseña";
                $scope.missing_password_label = "¿Olvidaste tu contraseña?";
            }


            $scope.imprimirFacturaRolloCompra = function (compra) {
                var alto;
                if (compra.detallesCompra.length <= 2) {
                    alto = 570;
                } else {
                    alto = 570 + (20 * (compra.detallesCompra.length - 2))
                }
                papel = [227, alto];
                var doc = new PDFDocument({ size: papel, margin: 10 });
                var stream = doc.pipe(blobStream());


                doc.moveDown(2);
                doc.font('Helvetica-Bold', 8);
                doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                doc.font('Helvetica', 7);
                doc.text(compra.almacen.sucursal.nombre.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                doc.text(compra.almacen.sucursal.direccion.toUpperCase(), { align: 'center' });
                doc.moveDown(0.4);
                var telefono = (compra.almacen.sucursal.telefono1 != null ? compra.almacen.sucursal.telefono1 : "") +
                    (compra.almacen.sucursal.telefono2 != null ? "-" + compra.almacen.sucursal.telefono2 : "") +
                    (compra.almacen.sucursal.telefono3 != null ? "-" + compra.almacen.sucursal.telefono3 : "");
                doc.text("TELF.: " + telefono, { align: 'center' });
                doc.moveDown(0.4);
                doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
                doc.moveDown(0.5);
                doc.font('Helvetica-Bold', 8);
                doc.text("NORMAL", { align: 'center' });
                doc.font('Helvetica', 7);
                doc.moveDown(0.4);
                doc.text("------------------------------------", { align: 'center' });
                doc.moveDown(0.4);
                doc.text("Nro.  " + compra.factura, { align: 'center' });
                doc.moveDown(0.4);
                doc.text("------------------------------------", { align: 'center' });
                doc.moveDown(0.4);
                doc.text(compra.tipoPago.nombre_corto, { align: 'center' });
                doc.moveDown(0.4);
                doc.text("------------------------------------", { align: 'center' });
                doc.moveDown(0.6);
                doc.text("FECHA : " + compra.fechaTexto, { align: 'left' });
                doc.moveDown(0.4);
                doc.text("SEÑOR(ES) : " + compra.proveedor.razon_social, { align: 'left' });
                doc.moveDown(0.4);
                doc.text("NIT/CI : " + compra.proveedor.nit, { align: 'left' });
                doc.moveDown(0.4);
                doc.text("---------------------------------------------------------------------------------", { align: 'center' });
                doc.moveDown(0.2);
                doc.text("CANT   CONCEPTO                                   P. UNIT.    SUBTOTAL", { align: 'left' });
                doc.moveDown(0.2);
                doc.text("---------------------------------------------------------------------------------", { align: 'center' });
                doc.moveDown(0.4);
                var y = doc.y, sumaDescuento = 0, sumaRecargo = 0, sumaIce = 0, sumaExcento = 0;
                for (var i = 0; i < compra.detallesCompra.length; i++) {
                    doc.text(compra.detallesCompra[i].cantidad, 15, y);
                    doc.text(compra.detallesCompra[i].producto.nombre, 35, y, { width: 100 });

                    doc.text(compra.detallesCompra[i].costo_unitario.toFixed(2), 145, y);
                    doc.text(compra.detallesCompra[i].importe.toFixed(2), 180, y);
                    sumaDescuento = sumaDescuento + (compra.detallesCompra[i].tipo_descuento ? (compra.detallesCompra[i].importe * (compra.detallesCompra[i].descuento / 100)) : compra.detallesCompra[i].descuento);
                    sumaRecargo = sumaRecargo + (compra.detallesCompra[i].tipo_recargo ? (compra.detallesCompra[i].importe * (compra.detallesCompra[i].recargo / 100)) : compra.detallesCompra[i].recargo);
                    sumaIce = sumaIce + compra.detallesCompra[i].ice;
                    sumaExcento = sumaExcento + compra.detallesCompra[i].excento;
                    y = y + 20;
                }
                doc.text("--------------", 10, y, { align: 'right' });
                //oc.text("--------------------",{align:'right'});
                doc.moveDown(0.4);
                doc.text("IMPORTE TOTAL Bs.              " + compra.importe.toFixed(2), { align: 'right' });
                doc.moveDown(0.3);
                if (sumaDescuento > 0) {
                    doc.text("DESCUENTO Bs.              " + sumaDescuento.toFixed(2), { align: 'right' });
                }
                doc.moveDown(0.3);
                if (sumaRecargo > 0) {
                    doc.text("RECARGO Bs.              " + sumaRecargo.toFixed(2), { align: 'right' });
                }
                doc.moveDown(0.3);
                if (sumaIce > 0) {
                    doc.text("ICE Bs.              " + sumaIce.toFixed(2), { align: 'right' });
                }
                doc.moveDown(0.3);
                if (sumaExcento > 0) {
                    doc.text("EXCENTO Bs.              " + sumaExcento.toFixed(2), { align: 'right' });
                }
                doc.moveDown(0.3);
                doc.text("TOTAL Bs.              " + compra.total.toFixed(2), { align: 'right' });
                doc.moveDown(0.4);
                doc.moveDown(0.4);
                doc.text("SON: " + compra.numero_literal, { align: 'left' });
                doc.moveDown(0.6);
                var fechaActual = new Date();
                var min = fechaActual.getMinutes();
                if (min < 10) {
                    min = "0" + min;
                }
                doc.text("usuario : " + $scope.usuario.nombre_usuario, 0, y + 205, { align: 'right' });
                doc.moveDown(0.4);
                doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 10, y + 215, { align: 'right' });
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
                blockUI.stop();
            }





            $scope.PopoverCuentasAxiliares = {
                templateUrl: 'PopoverCuentasAxiliares.html',
                title: 'Cuentas Axiliares',
                isOpen: false
            };
            $scope.obtenerCentroCostos = function () {
                blockUI.start();
                if ($scope.usuario.id_empresa) {
                    var promesa = ClasesTipoEmpresa("CENCOS", $scope.usuario.id_empresa);
                    promesa.then(function (entidad) {
                        $scope.centrosDeCostos = entidad.clases
                        $scope.llenarCampamentos($scope.centrosDeCostos)
                        blockUI.stop();
                    });
                } else {
                    blockUI.stop();
                }
            }
            $scope.llenarCampamentos = function (campamentos) {
                $scope.campamento = [];
                if (campamentos) {
                    for (var i = 0; i < campamentos.length; i++) {
                        var campamento = {
                            nombre: campamentos[i].nombre,
                            maker: "",
                            ticked: false,
                            id: campamentos[i].id
                        }
                        $scope.campamento.push(campamento);
                    }
                }

            }

            $scope.obtenerMeses = function () { }

            $scope.meses = [{ id: 0, nombre: "Enero" }, { id: 1, nombre: "Febrero" }, { id: 2, nombre: "Marzo" }, { id: 3, nombre: "Abril" }, { id: 4, nombre: "Mayo" }, { id: 5, nombre: "Junio" }, { id: 6, nombre: "Julio" }, { id: 7, nombre: "Agosto" },
            { id: 8, nombre: "Septiembre" }, { id: 9, nombre: "Octubre" }, { id: 10, nombre: "Noviembre" }, { id: 11, nombre: "Diciembre" }];

            $scope.mesesFiltro = [{ id: 1, nombre: "Enero" }, { id: 2, nombre: "Febrero" }, { id: 3, nombre: "Marzo" }, { id: 4, nombre: "Abril" }, { id: 5, nombre: "Mayo" }, { id: 6, nombre: "Junio" }, { id: 7, nombre: "Julio" }, { id: 8, nombre: "Agosto" },
            { id: 9, nombre: "Septiembre" }, { id: 10, nombre: "Octubre" }, { id: 11, nombre: "Noviembre" }, { id: 12, nombre: "Diciembre" }];

            var actual_year_diference = (new Date().getFullYear() - 1980)

            $scope.anios = Array.apply(null, Array(actual_year_diference + 1)).map(function (_, i) {
                var start_year = 1980
                var year = { id: start_year + i, nombre: start_year + i }
                return year
            })
            $scope.anios.reverse()

            $scope.fechaATexto = function (fecha) {
                fech = new Date(fecha)
                var valor = (fech.getMonth() + 1)
                if (valor < 10) {
                    valor = "0" + valor
                }
                var valor2 = fech.getDate()
                if (valor2 < 10) {
                    valor2 = "0" + valor2
                }
                fecha = valor2 + "/" + valor + "/" + fech.getFullYear();
                return fecha
                // $scope.fechaAplicacionVacuna = new Date(convertirFecha(fecha))
            }
            $scope.SumarDiasMesesAñosfecha = function (fecha, intervalo, dma, simbolo) {
                return editar_fecha(fecha, intervalo, dma, simbolo)
            }

            Date.prototype.getWeekNumber = function () {
                var d = new Date(+this);  //Creamos un nuevo Date con la fecha de "this".
                d.setHours(0, 0, 0, 0);   //Nos aseguramos de limpiar la hora.
                d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Recorremos los días para asegurarnos de estar "dentro de la semana"
                //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
                return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
            };

            $scope.verificarActivosFijos = function () {
                if ($scope.usuario.empresa.usar_funciones_erp) {
                    blockUI.start()
                    var prom = VerificacionMensualActivos($scope.usuario.id_empresa)
                    prom.then(function (res) {
                        if (res.hasErr) {
                            $timeout(function () {
                                $scope.mostrarMensaje('Error al verificar los activos fijos para actualizar: ' + res.mensaje)
                            }, 5000)

                        } else {
                            blockUI.stop()
                            //$scope.mostrarMensaje(res.mensaje)
                        }
                        blockUI.stop()
                    }).catch(function (err) {
                        var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null && err.data !== "") ? err.data : 'Error: Se perdio la conexión.'
                        $scope.mostrarMensaje(mensaje)
                        blockUI.stop()
                    })
                }
            }

            // $scope.actualizarActivosFijos = function () {

            // }

            $scope.nuevoClientePedido = function () {
                $scope.pedidocliente = new ClientePedido({ id_empresa: $scope.usuario.id_empresa });
                $scope.abrirPopup($scope.idModalNuevoClientePedido);
            }

            $scope.cerrarClientePedido = function () {
                $scope.cerrarPopup($scope.idModalNuevoClientePedido)
            }

            $scope.guardarClientePedido = function (valido, pedidocliente) {
                pedidocliente.telefono = pedidocliente.telefono.toString();
                if (valido) {
                    blockUI.start();

                    pedidocliente.$save(function (res) {
                        if (res.hasError) {
                            blockUI.stop();
                            $scope.mostrarMensaje(res.message);
                        } else {
                            blockUI.stop();
                            $scope.cerrarClientePedido();
                            $scope.establecerCliente(res);
                            $scope.mostrarMensaje('Cliente registrado exitosamente!');
                        }
                    }, function (error) {
                        blockUI.stop();
                        $scope.cerrarClientePedido();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                    });

                }
            }



            $scope.nuevaRazonCliente = function (id_cliente) {
                $scope.clienteRS = new ClientePedidoRazonSocial({ id_cliente: id_cliente });
                $scope.abrirPopup($scope.idModalNuevaRazonCliente);
            }

            $scope.cerrarRazonCliente = function () {
                $scope.cerrarPopup($scope.idModalNuevaRazonCliente);
            }

            $scope.guardarClienteRazonSocial = function (valido, clienteRS) {
                if (valido) {
                    blockUI.start();

                    clienteRS.$save(function (res) {
                        if (res.hasError) {
                            blockUI.stop();
                            $scope.mostrarMensaje(res.message);
                        } else {
                            blockUI.stop();
                            $scope.cerrarRazonCliente();
                            $scope.pedido.cliente_nit = res.nit;
                            $scope.establecerDatosCliente(res.id_cliente);
                            $scope.pedido.cliente_razon = res;
                            $scope.mostrarMensaje('Cliente registrado exitosamente!');
                        }
                    }, function (error) {
                        blockUI.stop();
                        $scope.cerrarRazonCliente();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                    });

                }
            }

            $scope.nuevoDestino = function (id_cliente) {
                $scope.clienteDestino = new ClientePedidoDestino({ id_cliente: id_cliente, id_empresa: $scope.usuario.id_empres });
                $scope.abrirPopup($scope.idModalNuevoDestino);
            }

            $scope.cerrarNuevoDestino = function () {
                $scope.cerrarPopup($scope.idModalNuevoDestino);
            }
            $scope.abrirModalVerificacionCajaChica = function () {
                $scope.obtenerGestiones()
                $scope.solicitudesSeleccionadas = []
                $scope.filtroVerificacionCajaChica = { id_empresa: $scope.usuario.id_empresa, historico: false, mes: "", anio: "" }
                $scope.abrirPopup($scope.idModalVerificacionCajaChica);
            }

            $scope.cerrarModalVerificacionCajaChica = function () {
                $scope.cerrarPopup($scope.idModalVerificacionCajaChica);
            }

            $scope.establecerDatosCliente = function (clienteid, destinoid) {
                var promesa = GetCliente(clienteid);
                promesa.then(function (dato) {
                    $scope.pedido.clientes_razon = dato.clientes_razon;
                    $scope.pedido.destinos = dato.cliente_destinos;

                    if (destinoid) {
                        var destinoF = $filter('filter')($scope.pedido.destinos, { id: destinoid }, true)[0];
                        $scope.pedido.cliente_destino = destinoF;
                        $scope.obtenerDireccion(destinoF);
                    }

                    blockUI.stop();
                });
            }

            $scope.guardarClienteDestino = function (valido, clienteDestino) {
                if (valido) {
                    blockUI.start();

                    clienteDestino.$save(function (res) {
                        if (res.hasError) {
                            blockUI.stop();
                            $scope.mostrarMensaje(res.message);
                        } else {
                            blockUI.stop();
                            $scope.cerrarNuevoDestino();
                            $scope.establecerDatosCliente(res.id_cliente, res.id);
                            $scope.pedido.cliente_destino = res;

                            $scope.mostrarMensaje('Destino registrado exitosamente!');
                        }
                    }, function (error) {
                        blockUI.stop();
                        $scope.cerrarNuevoDestino();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                    });

                }
            }

            $scope.guardarVerificadorSolicitudes = function (solicitud) {
                if (solicitud) {
                    if (solicitud.select) {
                        var datos = { solicitudes: $scope.solicitudesSeleccionadas, id_verificador: $scope.usuario.id }
                        var promesa = GuardarVerificadorSolicitud($scope.usuario.id_empresa, datos)
                        promesa.then(function (dato) {
                            $scope.mostrarMensaje(dato.mensaje)
                            $scope.verificarAlertasCajaChica()
                            $scope.solicitudesSeleccionadas = []
                        })
                    }
                } else {
                    if ($scope.solicitudesSeleccionadas.length > 0) {
                        var datos = { solicitudes: $scope.solicitudesSeleccionadas, id_verificador: $scope.usuario.id }
                        var promesa = GuardarVerificadorSolicitud($scope.usuario.id_empresa, datos)
                        promesa.then(function (dato) {
                            $scope.mostrarMensaje(dato.mensaje)
                            $scope.verificarAlertasCajaChica()
                            $scope.solicitudesSeleccionadas = []
                        })
                    }
                }
            }
            $scope.seleccionarSolicitudesAVerificar = function (solicitud) {
                if (solicitud.select == false) {
                    solicitud.select = false
                    $scope.solicitudesSeleccionadas.splice($scope.solicitudesSeleccionadas.indexOf(solicitud))
                } else {
                    solicitud.select = true
                    $scope.solicitudesSeleccionadas.push(solicitud)

                }
            }
            $scope.inicio = function () {
                $scope.loadData();
                $rootScope.abs = $window.Math.abs;
                if ($localStorage.usuario) {
                    $scope.usuario = JSON.parse($localStorage.usuario);
                    $scope.ComprobanteGuardado = $localStorage.nuevoComprobante
                    // console.log($scope.ComprobanteGuardado)
                    // console.log($scope.usuario)
                    if (!$scope.aplicaciones) {
                        $scope.cargarPagina();
                    }
                } else {
                    $scope.abrirPopup($scope.idModalInicioSesion);
                }

                $scope.ocultarMenu = true;
            }

            $scope.capitalizar = function (texto) {
                return texto.replace(/(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])([a-záéíóúüñ])/g, c => c.toUpperCase());
            }
        }]);