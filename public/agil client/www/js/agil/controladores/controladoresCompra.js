angular.module('agil.controladores')

	.controller('ControladorCompras', ['$scope', '$localStorage', '$location', '$templateCache', '$route', 'blockUI', 'DatosCompra', '$timeout',
		'Compra', 'Compras', 'Proveedores', 'ProveedoresNit', 'ListaProductosEmpresaUsuario', 'ClasesTipo', 'CompraDatos',
		'ConfiguracionCompraVistaDatos', 'ConfiguracionCompraVista', 'ConfiguracionesCuentasEmpresa', 'ClasesTipoEmpresa', 'Tipos', 'SaveCompra', 'ListaCompraPedidosEmpresa', 'EliminarPedidoEmpresa', 'EliminarDetallePedidoEmpresa',
		'CompraDatosCredito', 'Paginator', 'GuardarImportacionComprasIngresoDiario', 'GuardarImportacionPagosCompras', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, DatosCompra, $timeout,
			Compra, Compras, Proveedores, ProveedoresNit, ListaProductosEmpresaUsuario, ClasesTipo, CompraDatos,
			ConfiguracionCompraVistaDatos, ConfiguracionCompraVista, ConfiguracionesCuentasEmpresa, ClasesTipoEmpresa, Tipos, SaveCompra, ListaCompraPedidosEmpresa, EliminarPedidoEmpresa,
			EliminarDetallePedidoEmpresa, CompraDatosCredito, Paginator, GuardarImportacionComprasIngresoDiario, GuardarImportacionPagosCompras) {
			blockUI.start();

			$scope.usuario = JSON.parse($localStorage.usuario);
			$scope.list == []
			$scope.itemsPerPageCompra = 10
			$scope.idModalPago = 'dialog-pago';
			$scope.idModalWizardCompraEdicion = 'modal-wizard-compra-edicion';
			$scope.idModalWizardCompraVista = 'modal-wizard-compra-vista';
			$scope.idModalEliminarCompra = 'dialog-eliminar-compra';
			$scope.idModalContenedorCompraEdicion = 'modal-wizard-container-compra-edicion';
			$scope.idModalContenedorCompraVista = 'modal-wizard-container-compra-vista';
			$scope.idInputCompletar = 'nit';
			$scope.idModalServicios = 'dialog-servicios'
			$scope.idModalPedidos = 'dialog-pedidos'
			$scope.idModalDetallePedidos = 'dialog-detalle-pedidos'
			$scope.idModalEliminarPedido = 'dialog-eliminar-pedido'
			$scope.idModalEliminarProductoPedido = 'dialog-eliminar-producto-pedido',
				$scope.ModalMensajePago = 'Modal-Mensaje-Pago';

			$scope.url = restServer + '/proveedores/empresa/' + $scope.usuario.id_empresa + '/texto/';

			$scope.$on('$viewContentLoaded', function () {
				resaltarPestaña($location.path().substring(1));
				ejecutarScriptsCompra($scope.idModalWizardCompraEdicion, $scope.idModalWizardCompraVista,
					$scope.idModalEliminarCompra, $scope.idModalContenedorCompraEdicion,
					$scope.idModalContenedorCompraVista, $scope.idInputCompletar, $scope.url, $scope.idModalPago, $scope.idModalServicios, $scope.idModalPedidos, $scope.idModalDetallePedidos,
					$scope.idModalEliminarPedido, $scope.idModalEliminarProductoPedido, $scope.ModalMensajePago);
				$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
				$('#formularioCompra').ketchup({
					validateEvents: 'blur focus keyup change submit'
				});
				blockUI.stop();
			});


			$scope.inicio = function () {

				$scope.esContado = true;
				$scope.obtenerProveedores();
				$scope.obtenerTiposDePago();
				$scope.obtenerConfiguracionCompraVista();
				$scope.obtenerCentrosDeCosto();
				$scope.sucursales = $scope.obtenerSucursales();
				$scope.obtenerCompras();

				$scope.busquedaProductoHabilidato = false;
				if ($scope.usuario.empresa.usar_funciones_erp) {

					$scope.obtenerconfiuracionCuentas()
				}
				$scope.obtenerMovimientosIngreso()
				$scope.detalleCompra = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
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

			$scope.obtenerTiposDePago = function () {
				blockUI.start();
				var promesa = ClasesTipo("TIPA");
				promesa.then(function (entidad) {
					$scope.tiposPago = entidad.clases;
					blockUI.stop();
				});
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

			$scope.obtenerProveedores = function () {
				var promesa = Proveedores($scope.usuario.id_empresa);
				promesa.then(function (proveedores) {
					for (var i = 0; i < proveedores.length; i++) {
						proveedores[i].nit = proveedores[i].nit.toString();
					}
					$scope.proveedores = proveedores;
				});
			}

			$scope.modificarCompra = function (compra) {
				var promesa = CompraDatos(compra.id);
				promesa.then(function (compraConsultada) {
					if (compraConsultada.observacion != "") {
						compraConsultada.usarObservacion = true
					}
					$scope.compra = compraConsultada;
					$scope.compra.fecha = new Date($scope.compra.fecha);
					$scope.compra.fechaTexto = $scope.compra.fecha.getDate() + "/" + ($scope.compra.fecha.getMonth() + 1) + "/" + $scope.compra.fecha.getFullYear();
					if ($scope.compra.sucursal == undefined) {
						$scope.compra.sucursal = compraConsultada.almacen.sucursal;
					}
					if ($scope.compra.movimiento == undefined) {
						$scope.compra.movimiento = { clase: {} }
						$scope.compra.movimiento.clase = $scope.compra.tipoMovimiento
					}
					if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES || $scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
						$scope.configuracionCompraVista.mostrar_it_retencion = true
						$scope.configuracionCompraVista.mostrar_iue = true
						$scope.configuracionCompraVista.mostrar_pagado = true
					} else {
						$scope.configuracionCompraVista.mostrar_it_retencion = false
						$scope.configuracionCompraVista.mostrar_iue = false
						$scope.configuracionCompraVista.mostrar_pagado = false
					}
					$scope.obtenerAlmacenes($scope.compra.sucursal.id);
					$scope.cambiarTipoPago($scope.compra.tipoPago);
					if ($scope.usuario.empresa.usar_vencimientos) {
						if ($scope.compra.usar_producto) {
							$scope.aplicarFechaTextoDetalleCompra($scope.compra);
						}
					}
					$scope.abrirPopup($scope.idModalWizardCompraEdicion);
				});
			}

			$scope.aplicarFechaTextoDetalleCompra = function (compra) {
				for (var i = 0; i < compra.detallesCompra.length; i++) {
					if (compra.detallesCompra[i].centroCosto.nombre_corto == "ALM") {
						compra.detallesCompra[i].inventario.fecha_vencimiento = new Date(compra.detallesCompra[i].inventario.fecha_vencimiento);
						compra.detallesCompra[i].inventario.fechaVencimientoTexto = compra.detallesCompra[i].inventario.fecha_vencimiento.getDate() + "/" + (compra.detallesCompra[i].inventario.fecha_vencimiento.getMonth() + 1) + "/" + compra.detallesCompra[i].inventario.fecha_vencimiento.getFullYear();
					}

				}
			}

			$scope.buscarProveedor = function (query) {
				if (query != "" && query != undefined) {
					var promesa = ProveedoresNit($scope.usuario.id_empresa, query);
					return promesa;
				}
			};

			$scope.establecerProveedor = function (proveedor) {
				$scope.compra.proveedor = proveedor;
			}

			$scope.buscarProducto = function (query) {
				if (query != "" && query != undefined && $scope.busquedaProductoHabilidato) {
					var promesa = ListaProductosEmpresaUsuario($scope.usuario.id_empresa, query, $scope.usuario.id, $scope.compra.almacen.id);
					return promesa;
				}
			};

			$scope.verificarProducto = function (detalleCompra) {
				if (detalleCompra.centroCosto.nombre.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
					if (detalleCompra.producto.id) {
						if ($scope.compra.movimiento.clase != undefined) {
							if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
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

					} else {
						$scope.mostrarMensaje("El producto no se encuentra en el catalogo")
					}
				} else {
					if ($scope.compra.movimiento.clase != undefined) {
						if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
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
			}
			$scope.verificarServicio = function (detalleCompra) {

				if (detalleCompra.servicio.id) {
					if ($scope.compra.movimiento.clase != undefined) {
						if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
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

				$scope.compra.detallesCompra.push(detalleCompra);
				$scope.sumarTotal();
				$scope.sumarTotalImporte();
				if ($scope.compra.descuento_general) {
					$scope.calcularImporteGeneral();
				}
				if ($scope.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
					$scope.calcularSaldo();
				} else {
					$scope.compra.a_cuenta = null
					$scope.compra.saldo = null
					$scope.compra.dias_credito = null
				}
				$scope.detalleCompra = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
				$scope.enfocar('centro_costo');
			}

			$scope.establecerLote = function name(lote) {
				$scope.detalleCompra.lote = lote
				$scope.agregarDetalleCompraMasiva($scope.detalleCompra)
				return [lote]
			}
			$scope.agregarDetalleCompraMasiva = function (detalleCompra) {
				if ($scope.usuario.empresa.ver_costos_dolares) {
					if (detalleCompra && detalleCompra.costo_unitario_dolares && detalleCompra.cantidad) {
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
						$scope.sumarTotal();
						$scope.sumarTotalImporte();
						// var noKeyDuplicado = Object.assign({ detalleCompra })
						var noKeyDuplicado = { producto: detalleCompra.producto, centroCosto: detalleCompra.centroCosto, cantidad: detalleCompra.cantidad, costo_unitario_dolares: detalleCompra.costo_unitario_dolares ,importe_dolares:detalleCompra.importe_dolares, precio_unitario_dolares: detalleCompra.precio_unitario_dolares, total_dolares: detalleCompra.total_dolares, descuento: detalleCompra.descuento, recargo: detalleCompra.recargo, ice: detalleCompra.ice, excento: 0, tipo_descuento: detalleCompra.tipo_descuento, tipo_recargo: detalleCompra.tipo_recargo, lote: detalleCompra.lote }
						if (!$scope.compra.detallesCompra.some(function (detalle) {
							return detalle.lote == detalleCompra.lote
						})) {
							$scope.compra.detallesCompra.push(noKeyDuplicado);
						}
						// $scope.compra.detallesCompra.push(noKeyDuplicado);
						// $scope.sumarTotal();
						// $scope.sumarTotalImporte();
						$scope.sumarTotal();
						$scope.sumarTotalImporte();
						if ($scope.compra.descuento_general) {
							$scope.calcularImporteGeneral();
						}
						if ($scope.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
							$scope.calcularSaldo();
						} else {
							$scope.compra.a_cuenta = null
							$scope.compra.saldo = null
							$scope.compra.dias_credito = null
						}
						// $scope.enfocar('lote_masivo');
					} else {
						$scope.mostrarMensaje('Faltan datos de costo unitario o cantidad.')
	
					}
				} else {
					if (detalleCompra && detalleCompra.costo_unitario && detalleCompra.cantidad) {
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
						// var noKeyDuplicado = Object.assign({ detalleCompra })
						var noKeyDuplicado = { producto: detalleCompra.producto, centroCosto: detalleCompra.centroCosto, cantidad: detalleCompra.cantidad, costo_unitario: detalleCompra.costo_unitario, descuento: detalleCompra.descuento, recargo: detalleCompra.recargo, ice: detalleCompra.ice, excento: 0, tipo_descuento: detalleCompra.tipo_descuento, tipo_recargo: detalleCompra.tipo_recargo, lote: detalleCompra.lote }
						if (!$scope.compra.detallesCompra.some(function (detalle) {
							return detalle.lote == detalleCompra.lote
						})) {
							$scope.compra.detallesCompra.push(noKeyDuplicado);
						}
						// $scope.compra.detallesCompra.push(noKeyDuplicado);
						$scope.sumarTotal();
						$scope.sumarTotalImporte();
						if ($scope.compra.descuento_general) {
							$scope.calcularImporteGeneral();
						}
						if ($scope.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
							$scope.calcularSaldo();
						} else {
							$scope.compra.a_cuenta = null
							$scope.compra.saldo = null
							$scope.compra.dias_credito = null
						}
						// $scope.enfocar('lote_masivo');
					} else {
						$scope.mostrarMensaje('Faltan datos de costo unitario o cantidad.')
	
					}
				}
				
				$timeout(function () {
					$scope.enfocar('lote_masivo');
				}, 200)

				// $scope.detalleCompra = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }

			}
			$scope.agregarDetalleCompraServicio = function (detalleCompra) {

				$scope.compra.detallesCompra.push(detalleCompra);
				$scope.sumarTotal();
				$scope.sumarTotalImporte();
				if ($scope.compra.descuento_general) {
					$scope.calcularImporteGeneral();
				}
				if ($scope.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
					$scope.calcularSaldo();
				} else {
					$scope.compra.a_cuenta = null
					$scope.compra.saldo = null
					$scope.compra.dias_credito = null
				}
				$scope.detalleCompra = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
				$scope.enfocar('centro_costo');
			}
			$scope.eliminarDetalleCompra = function (detalleCompra) {
				if ($scope.compra.id) {
					detalleCompra.eliminado = true;
				} else {
					$scope.compra.detallesCompra.splice($scope.compra.detallesCompra.indexOf(detalleCompra), 1);
				}
				$scope.sumarTotal();
				$scope.sumarTotalImporte();
				if ($scope.compra.descuento_general) {
					$scope.calcularImporteGeneral();
				}
				if ($scope.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
					$scope.calcularSaldo();
				} else {
					$scope.compra.a_cuenta = null
					$scope.compra.saldo = null
					$scope.compra.dias_credito = null
				}
			}

			$scope.cambiarTipoPago = function (tipoPago) {
				var tipoPago = $.grep($scope.tiposPago, function (e) { return e.id == tipoPago.id; })[0];
				$scope.esContado = tipoPago.nombre_corto == 'CONT' ? true : false;
				$scope.compra.id_tipo_pago = tipoPago.id;
				if (!$scope.esContado) {
					$scope.calcularSaldo();
				} else {
					$scope.compra.a_cuenta = null
					$scope.compra.saldo = null
					$scope.compra.dias_credito = null
				}

			}

			$scope.recalcular = function () {
				$scope.calcularImporteGeneral();
				$scope.calcularImporte();
			}

			$scope.calcularImporteGeneral = function () {
				var descuento, recargo;
				if ($scope.usuario.empresa.ver_costos_dolares) {
					if ($scope.compra.tipo_descuento) {
						descuento = $scope.compra.importe_dolares * ($scope.compra.descuento / 100);
					} else {
						descuento = $scope.compra.descuento;
					}
					if ($scope.compra.tipo_recargo) {
						recargo = $scope.compra.importe_dolares * ($scope.compra.recargo / 100);
					} else {
						recargo = $scope.compra.recargo;
					}
					$scope.compra.total_dolares = Math.round(($scope.compra.importe - descuento + recargo - $scope.compra.ice - $scope.compra.excento) * 1000) / 1000;
				} else {
					if ($scope.compra.tipo_descuento) {
						descuento = $scope.compra.importe * ($scope.compra.descuento / 100);
					} else {
						descuento = $scope.compra.descuento;
					}
					if ($scope.compra.tipo_recargo) {
						recargo = $scope.compra.importe * ($scope.compra.recargo / 100);
					} else {
						recargo = $scope.compra.recargo;
					}
					$scope.compra.total = Math.round(($scope.compra.importe - descuento + recargo - $scope.compra.ice - $scope.compra.excento) * 1000) / 1000;
				}
				
			}
			$scope.calcularImportePedido = function (detalleCompra) {
				detalleCompra.importe = Math.round((detalleCompra.cantidad * detalleCompra.costo_unitario) * 1000) / 1000;
				var descuento, recargo;
				if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
					if ($scope.compra.tipo_retencion) {
						if (detalleCompra.centroCosto.nombre.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
							detalleCompra.total = detalleCompra.importe
							detalleCompra.importe = (detalleCompra.total * ($scope.plantilla.retencionBienes.it.porsentaje + $scope.plantilla.retencionBienes.iue.porsentaje) / (100 - ($scope.plantilla.retencionBienes.it.porsentaje + $scope.plantilla.retencionBienes.iue.porsentaje))) + detalleCompra.total
							detalleCompra.it = (detalleCompra.importe * $scope.plantilla.retencionBienes.it.porsentaje) / 100
							detalleCompra.iue = (detalleCompra.importe * $scope.plantilla.retencionBienes.iue.porsentaje) / 100
						} else {
							detalleCompra.total = detalleCompra.importe
							detalleCompra.importe = (detalleCompra.total * ($scope.plantilla.retencionBienesGasto.it.porsentaje + $scope.plantilla.retencionBienesGasto.iue.porsentaje) / (100 - ($scope.plantilla.retencionBienesGasto.it.porsentaje + $scope.plantilla.retencionBienesGasto.iue.porsentaje))) + detalleCompra.total
							detalleCompra.it = (detalleCompra.importe * $scope.plantilla.retencionBienesGasto.it.porsentaje) / 100
							detalleCompra.iue = (detalleCompra.importe * $scope.plantilla.retencionBienesGasto.iue.porsentaje) / 100
							//detalleCompra.total =(detalleCompra.importe *$scope.plantilla.retencionBienesGasto.gasto.porsentaje)/100
						}
					} else {
						if (detalleCompra.centroCosto.nombre.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
							detalleCompra.it = (detalleCompra.importe * $scope.plantilla.retencionBienes.it.porsentaje) / 100
							detalleCompra.iue = (detalleCompra.importe * $scope.plantilla.retencionBienes.iue.porsentaje) / 100
							detalleCompra.total = (detalleCompra.importe * $scope.plantilla.retencionBienes.almacen.porsentaje) / 100
						} else {
							detalleCompra.it = (detalleCompra.importe * $scope.plantilla.retencionBienesGasto.it.porsentaje) / 100
							detalleCompra.iue = (detalleCompra.importe * $scope.plantilla.retencionBienesGasto.iue.porsentaje) / 100
							detalleCompra.total = (detalleCompra.importe * $scope.plantilla.retencionBienesGasto.gasto.porsentaje) / 100
						}

					}
					/* detalleCompra.total = detalleCompra.importe */
				} else if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_IMPORTACION) {
					detalleCompra.total = detalleCompra.importe
				} else if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
					if ($scope.compra.tipo_retencion) {

						detalleCompra.total = detalleCompra.importe
						detalleCompra.importe = (detalleCompra.total * ($scope.plantilla.retencionServicios.it.porsentaje + $scope.plantilla.retencionServicios.iue.porsentaje) / (100 - ($scope.plantilla.retencionServicios.it.porsentaje + $scope.plantilla.retencionServicios.iue.porsentaje))) + detalleCompra.total
						detalleCompra.it = (detalleCompra.importe * $scope.plantilla.retencionServicios.it.porsentaje) / 100
						detalleCompra.iue = (detalleCompra.importe * $scope.plantilla.retencionServicios.iue.porsentaje) / 100

					} else {

						detalleCompra.it = (detalleCompra.importe * $scope.plantilla.retencionServicios.it.porsentaje) / 100
						detalleCompra.iue = (detalleCompra.importe * $scope.plantilla.retencionServicios.iue.porsentaje) / 100
						detalleCompra.total = (detalleCompra.importe * $scope.plantilla.retencionServicios.servicio.porsentaje) / 100


					}
				} else {
					if (!$scope.compra.descuento_general) {
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
					} else {
						if ($scope.compra.tipo_descuento) {
							descuento = detalleCompra.importe * ($scope.compra.descuento / 100);
						} else {
							descuento = $scope.compra.descuento;
						}
						if ($scope.compra.tipo_recargo) {
							recargo = detalleCompra.importe * ($scope.compra.recargo / 100);
						} else {
							recargo = $scope.compra.recargo;
						}

						detalleCompra.total = detalleCompra.importe - descuento + recargo - $scope.compra.ice - $scope.compra.excento;
					}
				}
			}
			$scope.calcularImporte = function () {				
				var descuento, recargo, impTotal;
				if ($scope.usuario.empresa.ver_costos_dolares) {
					$scope.detalleCompra.importe_dolares = Math.round(($scope.detalleCompra.cantidad * $scope.detalleCompra.costo_unitario_dolares) * 1000) / 1000;
					if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
						if ($scope.compra.tipo_retencion) {
							if ($scope.detalleCompra.centroCosto.nombre.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
								$scope.detalleCompra.total_dolares = $scope.detalleCompra.importe_dolares
								$scope.detalleCompra.importe_dolares = ($scope.detalleCompra.total_dolares * ($scope.plantilla.retencionBienes.it.porsentaje + $scope.plantilla.retencionBienes.iue.porsentaje) / (100 - ($scope.plantilla.retencionBienes.it.porsentaje + $scope.plantilla.retencionBienes.iue.porsentaje))) + $scope.detalleCompra.total_dolares
								$scope.detalleCompra.it = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienes.it.porsentaje) / 100
								$scope.detalleCompra.iue = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienes.iue.porsentaje) / 100
							} else {
								$scope.detalleCompra.total_dolares = $scope.detalleCompra.importe_dolares
								$scope.detalleCompra.importe_dolares = ($scope.detalleCompra.total_dolares * ($scope.plantilla.retencionBienesGasto.it.porsentaje + $scope.plantilla.retencionBienesGasto.iue.porsentaje) / (100 - ($scope.plantilla.retencionBienesGasto.it.porsentaje + $scope.plantilla.retencionBienesGasto.iue.porsentaje))) + $scope.detalleCompra.total_dolares
								$scope.detalleCompra.it = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienesGasto.it.porsentaje) / 100
								$scope.detalleCompra.iue = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienesGasto.iue.porsentaje) / 100
								//$scope.detalleCompra.total_dolares =($scope.detalleCompra.importe_dolares *$scope.plantilla.retencionBienesGasto.gasto.porsentaje)/100
							}
						} else {
							if ($scope.detalleCompra.centroCosto.nombre.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
								$scope.detalleCompra.it = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienes.it.porsentaje) / 100
								$scope.detalleCompra.iue = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienes.iue.porsentaje) / 100
								$scope.detalleCompra.total_dolares = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienes.almacen.porsentaje) / 100
							} else {
								$scope.detalleCompra.it = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienesGasto.it.porsentaje) / 100
								$scope.detalleCompra.iue = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienesGasto.iue.porsentaje) / 100
								$scope.detalleCompra.total_dolares = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionBienesGasto.gasto.porsentaje) / 100
							}
	
						}
						/* $scope.detalleCompra.total_dolares = $scope.detalleCompra.importe_dolares */
					} else if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_IMPORTACION) {
						$scope.detalleCompra.total_dolares = $scope.detalleCompra.importe_dolares
					} else if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
						if ($scope.compra.tipo_retencion) {
	
							$scope.detalleCompra.total_dolares = $scope.detalleCompra.importe_dolares
							$scope.detalleCompra.importe_dolares = ($scope.detalleCompra.total_dolares * ($scope.plantilla.retencionServicios.it.porsentaje + $scope.plantilla.retencionServicios.iue.porsentaje) / (100 - ($scope.plantilla.retencionServicios.it.porsentaje + $scope.plantilla.retencionServicios.iue.porsentaje))) + $scope.detalleCompra.total_dolares
							$scope.detalleCompra.it = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionServicios.it.porsentaje) / 100
							$scope.detalleCompra.iue = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionServicios.iue.porsentaje) / 100
	
						} else {
	
							$scope.detalleCompra.it = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionServicios.it.porsentaje) / 100
							$scope.detalleCompra.iue = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionServicios.iue.porsentaje) / 100
							$scope.detalleCompra.total_dolares = ($scope.detalleCompra.importe_dolares * $scope.plantilla.retencionServicios.servicio.porsentaje) / 100
	
	
						}
					} else {
						if (!$scope.compra.descuento_general) {
							if ($scope.detalleCompra.tipo_descuento) {
								descuento = $scope.detalleCompra.importe_dolares * ($scope.detalleCompra.descuento / 100);
							} else {
								descuento = $scope.detalleCompra.descuento;
							}
							if ($scope.detalleCompra.tipo_recargo) {
								recargo = $scope.detalleCompra.importe_dolares * ($scope.detalleCompra.recargo / 100);
							} else {
								recargo = $scope.detalleCompra.recargo;
							}
	
							$scope.detalleCompra.total_dolares = $scope.detalleCompra.importe_dolares - descuento + recargo - $scope.detalleCompra.ice - $scope.detalleCompra.excento;
						} else {
	
	
							if ($scope.compra.tipo_descuento) {
								descuento = $scope.detalleCompra.importe_dolares * ($scope.compra.descuento / 100);
							} else {
								if ($scope.compra.detallesCompra.length == 0) {
									descuento = $scope.compra.descuento;
									$scope.cambioDescuento = descuento;
									$scope.impTotal = 0;
								} else {
									$scope.impTotal = $scope.compra.importe_dolares + $scope.detalleCompra.importe_dolares;
									descuento = ($scope.detalleCompra.importe_dolares / $scope.impTotal) * $scope.compra.descuento;
									$scope.cambioDescuento = descuento;
	
									if ($scope.compra.tipo_recargo) {
										recargo = $scope.detalleCompra.importe_dolares * ($scope.compra.recargo / 100);
									} else {
										recargo = $scope.compra.recargo;
									}
									$scope.compra.detallesCompra.forEach(function (dato) {
										dato.descuento = (dato.importe_dolares / $scope.impTotal) * $scope.compra.descuento;
										dato.total_dolares = dato.importe_dolares - dato.descuento + recargo - $scope.compra.ice - $scope.compra.excento;
										$scope.cambioDescuento = dato.descuento;
									})
	
								}
	
							}
							if ($scope.compra.tipo_recargo) {
								recargo = $scope.detalleCompra.importe_dolares * ($scope.compra.recargo / 100);
							} else {
								recargo = $scope.compra.recargo;
							}
							$scope.detalleCompra.descuento = descuento;
							$scope.detalleCompra.total_dolares = $scope.detalleCompra.importe_dolares - descuento + recargo - $scope.compra.ice - $scope.compra.excento;
						}
					}
				} else {
					$scope.detalleCompra.importe = Math.round(($scope.detalleCompra.cantidad * $scope.detalleCompra.costo_unitario) * 1000) / 1000;
					if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_BIENES) {
						if ($scope.compra.tipo_retencion) {
							if ($scope.detalleCompra.centroCosto.nombre.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
								$scope.detalleCompra.total = $scope.detalleCompra.importe
								$scope.detalleCompra.importe = ($scope.detalleCompra.total * ($scope.plantilla.retencionBienes.it.porsentaje + $scope.plantilla.retencionBienes.iue.porsentaje) / (100 - ($scope.plantilla.retencionBienes.it.porsentaje + $scope.plantilla.retencionBienes.iue.porsentaje))) + $scope.detalleCompra.total
								$scope.detalleCompra.it = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienes.it.porsentaje) / 100
								$scope.detalleCompra.iue = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienes.iue.porsentaje) / 100
							} else {
								$scope.detalleCompra.total = $scope.detalleCompra.importe
								$scope.detalleCompra.importe = ($scope.detalleCompra.total * ($scope.plantilla.retencionBienesGasto.it.porsentaje + $scope.plantilla.retencionBienesGasto.iue.porsentaje) / (100 - ($scope.plantilla.retencionBienesGasto.it.porsentaje + $scope.plantilla.retencionBienesGasto.iue.porsentaje))) + $scope.detalleCompra.total
								$scope.detalleCompra.it = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.it.porsentaje) / 100
								$scope.detalleCompra.iue = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.iue.porsentaje) / 100
								//$scope.detalleCompra.total =($scope.detalleCompra.importe *$scope.plantilla.retencionBienesGasto.gasto.porsentaje)/100
							}
						} else {
							if ($scope.detalleCompra.centroCosto.nombre.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
								$scope.detalleCompra.it = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienes.it.porsentaje) / 100
								$scope.detalleCompra.iue = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienes.iue.porsentaje) / 100
								$scope.detalleCompra.total = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienes.almacen.porsentaje) / 100
							} else {
								$scope.detalleCompra.it = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.it.porsentaje) / 100
								$scope.detalleCompra.iue = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.iue.porsentaje) / 100
								$scope.detalleCompra.total = ($scope.detalleCompra.importe * $scope.plantilla.retencionBienesGasto.gasto.porsentaje) / 100
							}
	
						}
						/* $scope.detalleCompra.total = $scope.detalleCompra.importe */
					} else if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_IMPORTACION) {
						$scope.detalleCompra.total = $scope.detalleCompra.importe
					} else if ($scope.compra.movimiento.clase.nombre == $scope.diccionario.MOVING_POR_RETENCION_SERVICIOS) {
						if ($scope.compra.tipo_retencion) {
	
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
						if (!$scope.compra.descuento_general) {
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
	
	
							if ($scope.compra.tipo_descuento) {
								descuento = $scope.detalleCompra.importe * ($scope.compra.descuento / 100);
							} else {
								if ($scope.compra.detallesCompra.length == 0) {
									descuento = $scope.compra.descuento;
									$scope.cambioDescuento = descuento;
									$scope.impTotal = 0;
								} else {
									$scope.impTotal = $scope.compra.importe + $scope.detalleCompra.importe;
									descuento = ($scope.detalleCompra.importe / $scope.impTotal) * $scope.compra.descuento;
									$scope.cambioDescuento = descuento;
	
									if ($scope.compra.tipo_recargo) {
										recargo = $scope.detalleCompra.importe * ($scope.compra.recargo / 100);
									} else {
										recargo = $scope.compra.recargo;
									}
									$scope.compra.detallesCompra.forEach(function (dato) {
										dato.descuento = (dato.importe / $scope.impTotal) * $scope.compra.descuento;
										dato.total = dato.importe - dato.descuento + recargo - $scope.compra.ice - $scope.compra.excento;
										$scope.cambioDescuento = dato.descuento;
									})
	
								}
	
							}
							if ($scope.compra.tipo_recargo) {
								recargo = $scope.detalleCompra.importe * ($scope.compra.recargo / 100);
							} else {
								recargo = $scope.compra.recargo;
							}
							$scope.detalleCompra.descuento = descuento;
							$scope.detalleCompra.total = $scope.detalleCompra.importe - descuento + recargo - $scope.compra.ice - $scope.compra.excento;
						}
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
				if ($scope.compra.descuento_general) {
					$scope.calcularImporteGeneral();
				}
				if ($scope.compra.tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
					$scope.calcularSaldo();
				} else {
					$scope.compra.a_cuenta = null
					$scope.compra.saldo = null
					$scope.compra.dias_credito = null
				}
			}

			$scope.sumarMonto = function (compras) {
				var suma = 0;
				for (var i = 0; i < compras.length; i++) {
					suma = suma + compras[i].total;

				}
				return Math.round(suma * 100) / 100;
			}

			$scope.sumarTotalImporte = function () {
				var sumaImporte = 0;
				for (var i = 0; i < $scope.compra.detallesCompra.length; i++) {
					if (!$scope.compra.detallesCompra[i].eliminado) {
						if ($scope.usuario.empresa.ver_costos_dolares) {
							sumaImporte = sumaImporte + $scope.compra.detallesCompra[i].importe_dolares;
							$scope.compra.importe_dolares = Math.round((sumaImporte) * 1000) / 1000;
						}else{
							sumaImporte = sumaImporte + $scope.compra.detallesCompra[i].importe;
							$scope.compra.importe = Math.round((sumaImporte) * 1000) / 1000;
						}
					}
				}
			}

			$scope.sumarTotal = function () {
				if ($scope.usuario.empresa.ver_costos_dolares) {
					var sumaTotal = 0;
					for (var i = 0; i < $scope.compra.detallesCompra.length; i++) {
						if (!$scope.compra.detallesCompra[i].eliminado) {
							sumaTotal = sumaTotal + $scope.compra.detallesCompra[i].total_dolares;
						}
					}
					$scope.compra.total_dolares = Math.round((sumaTotal) * 1000) / 1000;
				} else {
					var sumaTotal = 0;
					for (var i = 0; i < $scope.compra.detallesCompra.length; i++) {
						if (!$scope.compra.detallesCompra[i].eliminado) {
							sumaTotal = sumaTotal + $scope.compra.detallesCompra[i].total;
						}
					}
					$scope.compra.total = Math.round((sumaTotal) * 1000) / 1000;
				}

			}

			$scope.calcularSaldo = function () {
				$scope.compra.saldo = $scope.compra.total - $scope.compra.a_cuenta;
			}

			$scope.obtenerSucursales = function () {
				var sucursales = [];
				for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
					sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
				}
				return sucursales;
			}

			$scope.mostrarDescuentos = function () {
				var style = $(".des-datos").css("display");
				if (style == "none") {
					$(".des-datos").css("display", "");
				} else {
					$(".des-datos").css("display", "none");
				}
			}

			$scope.enfocar = function (elemento) {
				$timeout(function () {
					$("#" + elemento).focus();
				}, 0);
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
			$scope.obtenerAlmacenes = function (idSucursal) {
				$scope.almacenes = [];
				var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
				$scope.almacenes = sucursal.almacenes;
				if ($scope.compra.id == undefined) {
					$scope.compra.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : null;
				}
			}

			$scope.formatearCodigoControl = function (codigo) {
				var codigoFormateado = "";
				for (var i = 0; i < codigo.length; i++) {
					if (i % 2 == 0) {
						codigoFormateado = codigoFormateado + codigo.substring(i, i + 2);
						if (codigo.length - i > 2) {
							codigoFormateado = codigoFormateado + "-"
						}
					}
				}
				return codigoFormateado;
			}

			$scope.obtenerCompras = function () {
				$scope.sucursalesUsuario = "";
				for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
					$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
					if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
						$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
					}
				}
				var currentDate = new Date();
				var currentDateString = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
				$scope.filtrarCompras($scope.sucursalesUsuario, currentDateString, currentDateString);
			}

			$scope.filtrarCompras = function (sucursalesUsuario, inicio, fin, razon_social, nit, monto, tipo_pago, sucursal, usuario, tipo) {
				razon_social = (razon_social == "" || razon_social == undefined) ? 0 : razon_social;
				nit = (nit == null || nit == undefined) ? 0 : nit;
				monto = (monto == null || monto == undefined) ? 0 : monto;
				tipo_pago = (tipo_pago == undefined) ? 0 : tipo_pago;
				tipo = (tipo == undefined) ? 0 : tipo;
				sucursal = (sucursal == null || sucursal == undefined) ? 0 : sucursal;
				var roles = $.grep($scope.usuario.rolesUsuario, function (e) { return e.rol.nombre == $scope.diccionario.ROL_ADMINISTRADOR; });
				usuario = roles.length > 0 ? ((usuario == "" || usuario == undefined) ? 0 : usuario) : $scope.usuario.nombre_usuario;
				blockUI.start();
				inicio = new Date($scope.convertirFecha(inicio));
				fin = new Date($scope.convertirFecha(fin));

				var promesa = Compras(sucursalesUsuario, inicio, fin, razon_social, nit, monto, tipo_pago, sucursal, usuario, $scope.usuario.id, tipo);
				promesa.then(function (compras) {
					$scope.compras = compras;
					$scope.list = compras
					//$scope.compras = compras.detalle;
					//$scope.paginator.setPages(compras.paginas);

					blockUI.stop();
				});
				/*$scope.paginator = Paginator();
				$scope.paginator.column = "fecha";
				$scope.paginator.direccion = "asc";
				$scope.filtroDetallesProducto = {
					idsSucursales: sucursalesUsuario,
					inicio: inicio,
					fin: fin,
					razon_social: razon_social,
					nit: nit,
					monto: monto,
					tipo_compra:tipo_pago,
					sucursal: sucursal, 
					usuario: usuario, 
					id_usuario: $scope.usuario.id, 
					tipo: tipo 
	
				}
				$scope.paginator.callBack = $scope.paginadorCompras;
				$scope.paginator.getSearch("", $scope.filtroDetallesProducto, null);*/
			}

			$scope.paginadorCompras = function () {
				blockUI.start();

				var promesa = Compras($scope.paginator);
				promesa.then(function (compras) {
					//$scope.compras = compras;
					$scope.compras = compras.detalle;
					$scope.list = compras
					$scope.paginator.setPages(compras.paginas);

					blockUI.stop();
				});
			}

			$scope.abrirPopupPago = function (compra) {
				$scope.compra = compra;
				$scope.pago = null;
				$scope.abrirPopup($scope.idModalPago);
			}

			$scope.cerrarPopupPago = function () {
				$scope.cerrarPopup($scope.idModalPago);
			}

			$scope.abrirDialogServicios = function (tipo) {
				$scope.tipo_edicion = tipo;
				$scope.clase = {};
				$scope.abrirPopup($scope.idModalServicios);
			}

			$scope.cerrarDialogServicios = function () {
				$scope.cerrarPopup($scope.idModalServicios);
			}
			$scope.abrirDialogPedidos = function () {
				$scope.obtenerPedidosEmpresa()
				$scope.abrirPopup($scope.idModalPedidos);
			}

			$scope.cerrarDialogPedidos = function () {
				$scope.cerrarPopup($scope.idModalPedidos);
			}
			$scope.abrirDialogDetallePedidos = function (pedido) {
				$scope.pedido = pedido
				$scope.cerrarDialogPedidos()
				$scope.obtenerAlmacenes(pedido.sucursal.id)
				$scope.compra.proveedor = pedido.proveedor
				$scope.compra.almacen = pedido.almacen
				$scope.compra.sucursal = pedido.sucursal
				$scope.pedido.detallesPedido.forEach(function (detalle) {
					var costoDetalleAnterior = 0
					if (detalle.producto.inventarios.length > 0) {
						costoDetalleAnterior = detalle.producto.inventarios[detalle.producto.inventarios.length - 1].costo_unitario ? detalle.producto.inventarios[detalle.producto.inventarios.length - 1].costo_unitario : 0;
					}
					detalle.producto.costoanterior = costoDetalleAnterior
					$scope.establecerProductoPedido(detalle, detalle.producto, costoDetalleAnterior)

				})
				$scope.abrirPopup($scope.idModalDetallePedidos);
			}
			$scope.guardarDetalleCompraDePedido = function (detallePedido) {
				$scope.compra.generado_por_pedido = true
				$scope.compra.pedido = $scope.pedido
				detallePedido.forEach(function (detalle) {
					if (detalle.eliminado != true) {
						$scope.verificarProducto(detalle.detalleCompra)
					}
				})
				$scope.cerrarDialogDetallePedidos()
			}

			$scope.establecerProductoPedido = function (detalle, producto, costo) {
				producto.tipoProducto = producto['tipoProducto'] == null ? { id: producto['tipoProducto.id'], nombre: producto['tipoProducto.nombre'], nombre_corto: producto['tipoProducto.nombre_corto'] } : producto.tipoProducto;
				var centroCostos = {}
				$scope.centrosCosto.forEach(function (centro, index, array) {
					if (centro.nombre_corto == "ALM") {
						centroCostos = centro;
					}
					if (index === (array.length - 1)) {
						detalle.detalleCompra = {
							centroCosto: centroCostos, producto: producto, costo_unitario: costo,
							cantidad: 1, descuento: producto.descuento, recargo: 0, ice: 0, excento: 0, tipo_descuento: (producto.descuento > 0 ? true : false), tipo_recargo: false
						};
					}
				})

				$scope.cerrarPopup($scope.idModalInventario);
				$scope.enfocar('cantidad');

			}
			$scope.cerrarDialogDetallePedidos = function () {
				$scope.cerrarPopup($scope.idModalDetallePedidos);
			}
			$scope.cerrarDialogEliminarPedido = function () {
				$scope.cerrarPopup($scope.idModalEliminarPedido);
			}
			$scope.abrirDialogEliminarPedido = function (pedido) {
				$scope.pedido = pedido
				$scope.abrirPopup($scope.idModalEliminarPedido);
			}
			$scope.cerrarDialogEliminarDetallePedido = function () {
				$scope.cerrarPopup($scope.idModalEliminarProductoPedido);
			}
			$scope.abrirDialogEliminarDetallePedido = function (detalle) {
				$scope.detalle = detalle
				$scope.abrirPopup($scope.idModalEliminarProductoPedido);
			}

			$scope.obtenerPedidosEmpresa = function () {
				var promesa = ListaCompraPedidosEmpresa($scope.usuario.id_empresa)
				promesa.then(function (dato) {
					$scope.pedidos = dato.pedidos
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

			$scope.realizarPago = function (idCompra, pago, idUsuario) {
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
					$scope.cerrarPopup($scope.idModalPago);
					$scope.obtenerCompras();

					if (restante < 0) {
						$scope.imprimirRecibo(data, data.compra, saldo, restante);
						$scope.imprimirReciboAnticipo(data.anticipo);
					} else {
						$scope.imprimirRecibo(data, data.compra, pago, restante);
					}
					blockUI.stop();
				})
				/*Compra.update({ id: idCompra }, { pago: pago, id_usuario_cajero: idUsuario,saldoRestante:restante }, function (data) {			
				//Compra.update({ id: $scope.compra.id }, { pago: pago, id_usuario_cajero: $scope.usuario.id }, function (data) {
					$scope.mostrarMensaje(data.mensaje);
					$scope.cerrarPopup($scope.idModalPago);
					$scope.obtenerCompras();
					$scope.imprimirRecibo(data, data.compra, pago);
					blockUI.stop();
				}, function (error) {
					$scope.mostrarMensaje(error);
					$scope.cerrarPopup($scope.idModalPago);
					$scope.obtenerCompras();
					blockUI.stop();
				});*/
			}

			$scope.mensaje = function (value) {
				$scope.accion = value;
				if ($scope.accion == true) {
					$scope.realizarPago($scope.compra.id, $scope.pago, $scope.usuario.id);
				} else {
					$scope.cerrarPopup($scope.ModalMensajePago);
				}
			}

			$scope.efectuarPago = function (pago) {
				var tipoPago = $scope.usuario.empresa.usar_pago_anticipado;
				$scope.pago = pago;
				if (tipoPago == true) {
					//usar pagos anticipados
					if (pago <= $scope.compra.saldo) {
						$scope.realizarPago($scope.compra.id, pago, $scope.usuario.id);
					} else {
						$scope.abrirPopup($scope.ModalMensajePago);
					}
				} else {
					//no usar pagos anticipados
					if (pago <= $scope.compra.saldo) {
						$scope.realizarPago($scope.compra.id, pago, $scope.usuario.id);
					} else {
						$scope.mostrarMensaje("El cobro excede el monto a cobrar");
					}
				}
			}

			$scope.imprimirRecibo = function (data, compra, pago, anticipo) {
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

				var textoFact = "Doc. Nro " + $scope.compra.factura;
				doc.text(textoFact, 105, 210, { width: 100 });

				doc.text("Bs " + pago + ".-", 170, 210, { width: 100 });


				//doc.text("Saldo " + (compra.saldo-pago) + ".-", 170, 220, { width: 100 });

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

			$scope.imprimirReciboAnticipo = function (anticipo) {
				blockUI.start();
				var doc = new PDFDocument({ compress: false, size: [227, 353], margin: 10 });
				var stream = doc.pipe(blobStream());
				doc.moveDown(2);
				doc.font('Helvetica-Bold', 8);
				doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.font('Helvetica', 7);
				doc.text(anticipo.sucursal.nombre.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.text(anticipo.sucursal.direccion.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				var telefono = (anticipo.sucursal.telefono1 != null ? anticipo.sucursal.telefono1 : "") +
					(anticipo.sucursal.telefono2 != null ? "-" + anticipo.sucursal.telefono2 : "") +
					(anticipo.sucursal.telefono3 != null ? "-" + anticipo.sucursal.telefono3 : "");
				doc.text("TELF.: " + telefono, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
				doc.moveDown(0.5);
				doc.font('Helvetica-Bold', 8);
				doc.text("ANTICIPO", { align: 'center' });
				doc.font('Helvetica', 7);
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				doc.text(anticipo.numero_correlativo_anticipo, { align: 'center' });
				//doc.text("NIT: "+$scope.usuario.empresa.nit,{align:'center'});

				//doc.text("FACTURA No: "+anticipo.factura,{align:'center'});
				doc.moveDown(0.4);
				//doc.text("AUTORIZACIÓN No: "+anticipo.autorizacion,{align:'center'});
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				//doc.text(anticipo.actividad.nombre,{align:'center'});
				doc.moveDown(0.6);
				var date = new Date();
				doc.text("FECHA : " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), { align: 'left' });
				doc.moveDown(0.4);
				doc.text("He recibido de : " + anticipo.proveedor.razon_social, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("---------------------------------------------------------------------------------", { align: 'center' });
				doc.moveDown(0.2);
				doc.text("       CONCEPTO                                   ", { align: 'left' });
				doc.moveDown(0.2);

				doc.text("---------------------------------------------------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				anticipo.fecha = new Date(anticipo.fecha);
				doc.text("Fecha: " + anticipo.fecha.getDate() + "/" + (anticipo.fecha.getMonth() + 1) + "/" + anticipo.fecha.getFullYear(), 15, 210);
				//var textoFact = $scope.anticipo.movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ? "Factura nro. " + $scope.anticipo.factura : "Proforma nro. " + $scope.anticipo.factura;
				//doc.text(textoFact, 105, 210, { width: 100 });
				/* if (anticipo >= 0) {
					doc.text("Saldo Bs " + ((anticipo.saldo - pago)*-1) + ".-", 105, 220, { width: 100 });
				}else{
					doc.text("Saldo Bs " +"0" + ".-", 105, 220, { width: 100 });
				} */
				doc.text("Anticipo", 105, 210, { width: 100 });
				doc.moveDown(0.2);
				doc.text("Bs " + anticipo.monto_anticipo.toFixed(2) + ".-", 170, 210, { width: 100 });

				doc.text("--------------", 10, 230, { align: 'right' });
				//oc.text("--------------------",{align:'right'});
				doc.moveDown(0.3);
				doc.text("TOTAL Bs.              " + anticipo.monto_anticipo.toFixed(2), { align: 'right' });
				doc.moveDown(0.4);
				doc.moveDown(0.4);
				doc.text(ConvertirALiteral(anticipo.monto_anticipo.toFixed(2)), { align: 'left' });
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
				doc.moveDown(0.4);
				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.text("  Usuario : " + $scope.usuario.nombre_usuario + " -- Fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min + "  ", { align: 'center' });
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			}

			$scope.establecerCentroCosto = function (centroCosto) {
				console.log(centroCosto);
				var centroCostoAnalizado = centroCosto.nombre ? centroCosto.nombre : centroCosto;
				if (centroCostoAnalizado == $scope.diccionario.CENTRO_COSTO_ALMACEN) {
					$scope.busquedaProductoHabilidato = true;

				} else {
					$scope.busquedaProductoHabilidato = false;
				}
			}

			$scope.crearNuevaCompra = function () {
				$scope.obtenerServicios()
				$scope.verDescuento = false
				$scope.compra = new Compra({
					generado_por_pedido: false,
					usar_producto: true, movimiento: { clase: {} }, tipo_retencion: true,
					id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, proveedor: {}, id_tipo_pago: $scope.tiposPago[0].id, tipoPago: $scope.tiposPago[0],
					detallesCompra: [], descuento_general: false, tipo_descuento: false, codigo_control: 0, autorizacion: 0,
					tipo_recargo: false, descuento: 0, recargo: 0, ice: 0, excento: 0, carga_masiva_serie: false
				});

				$scope.cambiarTipoPago($scope.tiposPago[0]);

				if ($scope.usuario.empresa.usar_funciones_erp) {
					$scope.compra.movimiento.clase = $scope.movimientosIngreso[0]
				}
				$scope.compra.sucursal = $scope.sucursales.length == 1 ? $scope.sucursales[0] : null;
				if ($scope.compra.sucursal) {
					$scope.obtenerAlmacenes($scope.compra.sucursal.id);
				}

				var fechaActual = new Date();
				$scope.compra.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
				$scope.abrirPopup($scope.idModalWizardCompraEdicion);
				$scope.enfocar('nit');
			}

			$scope.verCompra = function (compra) {
				$scope.compra = compra;
				$scope.carga_masiva_serie = false
				$scope.abrirPopup($scope.idModalWizardCompraVista);
			}

			$scope.cerrarPopupVista = function () {
				$scope.cerrarPopup($scope.idModalWizardCompraVista);
			}

			$scope.cerrarPopupEdicion = function () {
				$scope.ocultarMensajesValidacion();
				$scope.cerrarPopup($scope.idModalWizardCompraEdicion);
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

			$scope.dibujarCabeceraImpresionCompra = function (doc, compra, pagina, totalPaginas, existenDescuentos) {
				if ($scope.usuario.empresa.imagen.length > 100) { doc.image($scope.usuario.empresa.imagen, 60, 50, { width: 50, height: 50 }); }
				doc.font('Helvetica-Bold', 8);
				doc.text($scope.usuario.empresa.razon_social.toUpperCase(), 60, 105);
				doc.font('Helvetica', 7);
				doc.text(compra.sucursal.nombre.toUpperCase(), 60, 113);
				doc.text(compra.sucursal.direccion.toUpperCase(), 60, 121);
				var telefono = (compra.sucursal.telefono1 != null ? compra.sucursal.telefono1 : "") +
					(compra.sucursal.telefono2 != null ? "-" + compra.sucursal.telefono2 : "") +
					(compra.sucursal.telefono3 != null ? "-" + compra.sucursal.telefono3 : "");
				doc.text("TELF.: " + telefono, 60, 129);
				doc.text("COCHABAMBA - BOLIVIA", 60, 137);

				doc.font('Helvetica-Bold', 16);
				doc.text("NOTA DE COMPRA", 150, 50);
				doc.font('Helvetica-Bold', 8);
				//doc.text(compra.actividad.nombre,380,105,{width:200});

				doc.rect(380, 50, 190, 50).stroke();
				doc.text("NIT : ", 390, 60);
				doc.text("FACTURA No : ", 390, 70);
				doc.text("AUTORIZACIÓN No : ", 390, 80);

				doc.text($scope.usuario.empresa.nit, 500, 60);
				doc.text(compra.factura, 500, 70);
				doc.text(compra.autorizacion, 500, 80);

				doc.rect(50, 150, 540, 50).stroke();
				doc.text("FECHA : ", 60, 165);
				doc.text("SEÑOR(ES) : ", 60, 175);
				doc.text("NIT : ", 360, 165);

				doc.text(compra.fechaTexto, 120, 165);
				doc.text(compra.proveedor.razon_social, 120, 175);
				doc.text(compra.proveedor.nit, 400, 165);

				doc.rect(50, 200, 540, 25).stroke();
				doc.rect(50, 225, 540, 792 - 118 - 225).stroke();

				if (existenDescuentos) {
					if ($scope.usuario.empresa.usar_vencimientos) {
						doc.font('Helvetica-Bold', 7);
						doc.text("CODIGO", 55, 210);
						doc.text("CANT.", 105, 210);
						doc.text("UNID.", 135, 210);
						doc.text("DETALLE", 170, 210);
						doc.text("P. UNIT.", 280, 210);
						doc.text("IMPORTE", 315, 210);
						doc.text("DESC.", 365, 210);
						doc.text("REC.", 395, 210);
						doc.text("ICE", 425, 210);
						doc.text("EXC.", 455, 210);
						doc.text("F. VENC.", 485, 210, { width: 50 });
						doc.text("LOTE", 525, 210);
						doc.text("TOTAL", 555, 210);
					} else {
						doc.font('Helvetica-Bold', 8);
						doc.text("CODIGO", 55, 210);
						doc.text("CANT.", 105, 210);
						doc.text("UNID.", 135, 210);
						doc.text("DETALLE", 170, 210);
						doc.text("P. UNIT.", 300, 210);
						doc.text("IMPORTE", 335, 210);
						doc.text("DESC.", 385, 210);
						doc.text("REC.", 420, 210);
						doc.text("ICE", 455, 210);
						doc.text("EXC.", 490, 210);
						doc.text("TOTAL", 520, 210);
					}
				} else {
					doc.font('Helvetica-Bold', 8);
					doc.text("CODIGO", 55, 210);
					doc.text("CANT.", 135, 210);
					doc.text("UNID.", 165, 210);
					if ($scope.usuario.empresa.usar_vencimientos) {
						doc.text("DETALLE", 210, 210);
						doc.text("FECHA VENC.", 400, 205, { width: 50 });
						doc.text("LOTE", 450, 210);
					} else {
						doc.text("DETALLE", 210, 210);
					}
					doc.text("P.UNIT.", 495, 210);
					doc.text("TOTAL", 540, 210);
				}
				doc.font('Helvetica', 6);
				var currentDate = new Date();
				doc.text("Usuario: " + $scope.usuario.nombre_usuario + "   " + "Fecha:" + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 50, 750);
			}

			$scope.imprimirCompra = function (compra) {
				var promesa = DatosCompra(compra.id, $scope.usuario.id_empresa);
				promesa.then(function (datos) {
					compra = datos.compra;
					compra.sucursal = datos.sucursal;
					if ($scope.usuario.empresa.ver_costos_dolares) {
						compra.numero_literal = ConvertirALiteral(compra.total_dolares.toFixed(2), 'Dolares Americanos');
					} else {
						compra.numero_literal = datos.numero_literal;
					}

					compra.fecha = new Date(compra.fecha);
					compra.fechaTexto = compra.fecha.getDate() + "/" + (compra.fecha.getMonth() + 1) + "/" + compra.fecha.getFullYear();
					compra.configuracion = datos.configuracion;
					var doc = new PDFDocument({ size: [612, 792], margin: 10 });
					var stream = doc.pipe(blobStream());
					// draw some text

					var y = 240, totalAray = 0, itemsPorPagina = 15, items = 0, pagina = 1, totalPaginas = Math.ceil(compra.detallesCompra.length / itemsPorPagina);
					var existenDescuentos = $scope.verificarDescuentos(compra.detallesCompra);
					$scope.dibujarCabeceraImpresionCompra(doc, compra, pagina, totalPaginas, existenDescuentos);

					var y = 240;
					for (var i = 0; i < compra.detallesCompra.length; i++) {
						if ($scope.usuario.empresa.ver_costos_dolares) {
							if (existenDescuentos) {

								if ($scope.usuario.empresa.usar_vencimientos) {
									doc.font('Helvetica', 7);
									var longitudCaracteres = compra.detallesCompra[i].producto.codigo.length;
									var yDesc = (longitudCaracteres <= 11) ? y : ((longitudCaracteres > 11 && longitudCaracteres <= 22) ? y - 4 : y - 11);
									if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.codigo, 55, yDesc, { width: 50 });
									doc.text(compra.detallesCompra[i].cantidad, 110, y);
									if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.unidad_medida, 135, y);
	
									if (compra.detallesCompra[i].producto) {
										doc.text(compra.detallesCompra[i].producto.nombre, 170, y, { width: 130 });
									} else {
										doc.text(compra.detallesCompra[i].servicio.nombre, 170, y, { width: 130 });
									}
	
									doc.text(compra.detallesCompra[i].costo_unitario_dolares.toFixed(2), 280, y);
									doc.text(compra.detallesCompra[i].importe_dolares.toFixed(2), 315, y);
									doc.text(compra.descuento_general ? compra.tipo_descuento ? "%" : "Bs" : compra.detallesVenta[i].tipo_descuento ? "%" : "Bs", 365, y - 10);
									doc.text(compra.detallesCompra[i].descuento.toFixed(2), 365, y);
									doc.text(compra.descuento_general ? compra.tipo_recargo ? "%" : "Bs" : compra.detallesVenta[i].tipo_recargo ? "%" : "Bs", 395, y - 10);
									doc.text(compra.detallesCompra[i].recargo.toFixed(2), 395, y);
									doc.text(compra.detallesCompra[i].ice.toFixed(2), 425, y);
									doc.text(compra.detallesCompra[i].excento.toFixed(2), 455, y);
									doc.text(compra.detallesCompra[i].total_dolares.toFixed(2), 555, y);
	
									if (compra.detallesCompra[i].inventario) {
										compra.detallesCompra[i].inventario.fecha_vencimiento = new Date(compra.detallesCompra[i].inventario.fecha_vencimiento);
										compra.detallesCompra[i].inventario.fechaVencimientoTexto = compra.detallesCompra[i].inventario.fecha_vencimiento.getDate() + "/" + (compra.detallesCompra[i].inventario.fecha_vencimiento.getMonth() + 1) + "/" + compra.detallesCompra[i].inventario.fecha_vencimiento.getYear();
										doc.text(compra.detallesCompra[i].inventario.fechaVencimientoTexto, 485, y);
										doc.text((compra.detallesCompra[i].inventario.lote) ? compra.detallesCompra[i].inventario.lote : "", 525, y);
									}
								} else {
									doc.font('Helvetica', 8);
									var longitudCaracteres = compra.detallesCompra[i].producto.codigo.length;
									var yDesc = (longitudCaracteres <= 11) ? y : ((longitudCaracteres > 11 && longitudCaracteres <= 22) ? y - 4 : y - 11);
									if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.codigo, 55, yDesc, { width: 70 });
									doc.text(compra.detallesCompra[i].cantidad, 110, y);
									if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.unidad_medida, 135, y);
	
									if (compra.detallesCompra[i].producto) {
										doc.text(compra.detallesCompra[i].producto.nombre, 170, y - 6, { width: 130 });
									} else {
										doc.text(compra.detallesCompra[i].servicio.nombre, 170, y - 6, { width: 130 });
									}
	
									doc.text(compra.detallesCompra[i].costo_unitario_dolares.toFixed(2), 300, y);
									doc.text(compra.detallesCompra[i].importe_dolares.toFixed(2), 335, y);
	
									doc.text(compra.descuento_general ? compra.tipo_descuento ? "%" : "Bs" : compra.detallesVenta[i].tipo_descuento ? "%" : "Bs", 385, y - 10);
									doc.text(compra.detallesCompra[i].descuento.toFixed(2), 385, y);
									doc.text(compra.descuento_general ? compra.tipo_recargo ? "%" : "Bs" : compra.detallesVenta[i].tipo_recargo ? "%" : "Bs", 420, y - 10);
									doc.text(compra.detallesCompra[i].recargo.toFixed(2), 420, y);
									doc.text(compra.detallesCompra[i].ice.toFixed(2), 455, y);
									doc.text(compra.detallesCompra[i].excento.toFixed(2), 490, y);
									doc.text(compra.detallesCompra[i].total_dolares.toFixed(2), 520, y);
								}
							} else {
								doc.font('Helvetica', 8);
								if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.codigo, 55, y, { width: 70 });
								doc.text(compra.detallesCompra[i].cantidad, 140, y);
								if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.unidad_medida, 160, y);
								if (compra.detallesCompra[i].producto) {
									var longitudCaracteres = compra.detallesCompra[i].producto.nombre.length;
									var yDesc = (longitudCaracteres <= 45) ? y : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? y - 4 : y - 11);
								} else {
									var longitudCaracteres = compra.detallesCompra[i].servicio.nombre.length;
									var yDesc = (longitudCaracteres <= 45) ? y : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? y - 4 : y - 11);
								}
								if ($scope.usuario.empresa.usar_vencimientos) {
									if (compra.detallesCompra[i].inventario) {
										compra.detallesCompra[i].inventario.fecha_vencimiento = new Date(compra.detallesCompra[i].inventario.fecha_vencimiento);
										compra.detallesCompra[i].inventario.fechaVencimientoTexto = compra.detallesCompra[i].inventario.fecha_vencimiento.getDate() + "/" + (compra.detallesCompra[i].inventario.fecha_vencimiento.getMonth() + 1) + "/" + compra.detallesCompra[i].inventario.fecha_vencimiento.getFullYear();
										doc.text(compra.detallesCompra[i].inventario.fechaVencimientoTexto, 400, y);
										doc.text(compra.detallesCompra[i].inventario.lote, 460, y);
									}
									if (compra.detallesCompra[i].producto) {
										doc.text(compra.detallesCompra[i].producto.nombre, 210, yDesc - 11.5, { width: 185 });
									} else {
										doc.text(compra.detallesCompra[i].servicio.nombre, 210, yDesc - 11.5, { width: 185 });
									}
								} else {
									if (compra.detallesCompra[i].producto) {
										doc.text(compra.detallesCompra[i].producto.nombre, 210, yDesc - 11.5, { width: 225 });
									} else {
										doc.text(compra.detallesCompra[i].servicio.nombre, 210, yDesc - 11.5, { width: 185 });
									}
								}
								doc.text(compra.detallesCompra[i].costo_unitario_dolares.toFixed(2), 500, y);
								doc.text(compra.detallesCompra[i].total_dolares.toFixed(2), 540, y);
							}
						} else {
							if (existenDescuentos) {
								if ($scope.usuario.empresa.usar_vencimientos) {
									doc.font('Helvetica', 7);
									var longitudCaracteres = compra.detallesCompra[i].producto.codigo.length;
									var yDesc = (longitudCaracteres <= 11) ? y : ((longitudCaracteres > 11 && longitudCaracteres <= 22) ? y - 4 : y - 11);
									if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.codigo, 55, yDesc, { width: 50 });
									doc.text(compra.detallesCompra[i].cantidad, 110, y);
									if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.unidad_medida, 135, y);
	
									if (compra.detallesCompra[i].producto) {
										doc.text(compra.detallesCompra[i].producto.nombre, 170, y, { width: 130 });
									} else {
										doc.text(compra.detallesCompra[i].servicio.nombre, 170, y, { width: 130 });
									}
	
									doc.text(compra.detallesCompra[i].costo_unitario.toFixed(2), 280, y);
									doc.text(compra.detallesCompra[i].importe.toFixed(2), 315, y);
									doc.text(compra.descuento_general ? compra.tipo_descuento ? "%" : "Bs" : compra.detallesVenta[i].tipo_descuento ? "%" : "Bs", 365, y - 10);
									doc.text(compra.detallesCompra[i].descuento.toFixed(2), 365, y);
									doc.text(compra.descuento_general ? compra.tipo_recargo ? "%" : "Bs" : compra.detallesVenta[i].tipo_recargo ? "%" : "Bs", 395, y - 10);
									doc.text(compra.detallesCompra[i].recargo.toFixed(2), 395, y);
									doc.text(compra.detallesCompra[i].ice.toFixed(2), 425, y);
									doc.text(compra.detallesCompra[i].excento.toFixed(2), 455, y);
									doc.text(compra.detallesCompra[i].total.toFixed(2), 555, y);
	
									if (compra.detallesCompra[i].inventario) {
										compra.detallesCompra[i].inventario.fecha_vencimiento = new Date(compra.detallesCompra[i].inventario.fecha_vencimiento);
										compra.detallesCompra[i].inventario.fechaVencimientoTexto = compra.detallesCompra[i].inventario.fecha_vencimiento.getDate() + "/" + (compra.detallesCompra[i].inventario.fecha_vencimiento.getMonth() + 1) + "/" + compra.detallesCompra[i].inventario.fecha_vencimiento.getYear();
										doc.text(compra.detallesCompra[i].inventario.fechaVencimientoTexto, 485, y);
										doc.text((compra.detallesCompra[i].inventario.lote) ? compra.detallesCompra[i].inventario.lote : "", 525, y);
									}
								} else {
									doc.font('Helvetica', 8);
									var longitudCaracteres = compra.detallesCompra[i].producto.codigo.length;
									var yDesc = (longitudCaracteres <= 11) ? y : ((longitudCaracteres > 11 && longitudCaracteres <= 22) ? y - 4 : y - 11);
									if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.codigo, 55, yDesc, { width: 70 });
									doc.text(compra.detallesCompra[i].cantidad, 110, y);
									if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.unidad_medida, 135, y);
	
									if (compra.detallesCompra[i].producto) {
										doc.text(compra.detallesCompra[i].producto.nombre, 170, y - 6, { width: 130 });
									} else {
										doc.text(compra.detallesCompra[i].servicio.nombre, 170, y - 6, { width: 130 });
									}
	
									doc.text(compra.detallesCompra[i].costo_unitario.toFixed(2), 300, y);
									doc.text(compra.detallesCompra[i].importe.toFixed(2), 335, y);
	
									doc.text(compra.descuento_general ? compra.tipo_descuento ? "%" : "Bs" : compra.detallesVenta[i].tipo_descuento ? "%" : "Bs", 385, y - 10);
									doc.text(compra.detallesCompra[i].descuento.toFixed(2), 385, y);
									doc.text(compra.descuento_general ? compra.tipo_recargo ? "%" : "Bs" : compra.detallesVenta[i].tipo_recargo ? "%" : "Bs", 420, y - 10);
									doc.text(compra.detallesCompra[i].recargo.toFixed(2), 420, y);
									doc.text(compra.detallesCompra[i].ice.toFixed(2), 455, y);
									doc.text(compra.detallesCompra[i].excento.toFixed(2), 490, y);
									doc.text(compra.detallesCompra[i].total.toFixed(2), 520, y);
								}
							} else {
								doc.font('Helvetica', 8);
								if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.codigo, 55, y, { width: 70 });
								doc.text(compra.detallesCompra[i].cantidad, 140, y);
								if (compra.detallesCompra[i].producto) doc.text(compra.detallesCompra[i].producto.unidad_medida, 160, y);
								if (compra.detallesCompra[i].producto) {
									var longitudCaracteres = compra.detallesCompra[i].producto.nombre.length;
									var yDesc = (longitudCaracteres <= 45) ? y : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? y - 4 : y - 11);
								} else {
									var longitudCaracteres = compra.detallesCompra[i].servicio.nombre.length;
									var yDesc = (longitudCaracteres <= 45) ? y : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? y - 4 : y - 11);
								}
								if ($scope.usuario.empresa.usar_vencimientos) {
									if (compra.detallesCompra[i].inventario) {
										compra.detallesCompra[i].inventario.fecha_vencimiento = new Date(compra.detallesCompra[i].inventario.fecha_vencimiento);
										compra.detallesCompra[i].inventario.fechaVencimientoTexto = compra.detallesCompra[i].inventario.fecha_vencimiento.getDate() + "/" + (compra.detallesCompra[i].inventario.fecha_vencimiento.getMonth() + 1) + "/" + compra.detallesCompra[i].inventario.fecha_vencimiento.getFullYear();
										doc.text(compra.detallesCompra[i].inventario.fechaVencimientoTexto, 400, y);
										doc.text(compra.detallesCompra[i].inventario.lote, 460, y);
									}
									if (compra.detallesCompra[i].producto) {
										doc.text(compra.detallesCompra[i].producto.nombre, 210, yDesc - 11.5, { width: 185 });
									} else {
										doc.text(compra.detallesCompra[i].servicio.nombre, 210, yDesc - 11.5, { width: 185 });
									}
								} else {
									if (compra.detallesCompra[i].producto) {
										doc.text(compra.detallesCompra[i].producto.nombre, 210, yDesc - 11.5, { width: 225 });
									} else {
										doc.text(compra.detallesCompra[i].servicio.nombre, 210, yDesc - 11.5, { width: 185 });
									}
								}
								doc.text(compra.detallesCompra[i].costo_unitario.toFixed(2), 500, y);
								doc.text(compra.detallesCompra[i].total.toFixed(2), 540, y);
							}
						}
						

						doc.rect(50, y - 15, 540, 30).stroke();

						y = y + 30;

						items++;

						if (items == itemsPorPagina) {
							totalAray = totalAray + items;
							if (totalAray != compra.detallesCompra.length) {
								/* var currentDate=new Date();
								doc.text("Usuario: "+$scope.usuario.nombre_usuario,50,y);
								doc.text("Usuario: "+$scope.usuario.nombre_usuario+"   "+"Fecha:"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear(),50,y); */
								doc.addPage({ size: [612, 792], margin: 10 });
								y = 240;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraImpresionCompra(doc, compra, pagina, totalPaginas, existenDescuentos);
							}
						}
					}

					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL", 455, 792 - 97);

					doc.font('Helvetica', 8);
					if ($scope.usuario.empresa.ver_costos_dolares) {
						doc.text(compra.total_dolares.toFixed(2), 520, 792 - 97);
					} else {
						doc.text(compra.total.toFixed(2), 520, 792 - 97);
					}
					

					doc.text("SON : " + compra.numero_literal, 55, 792 - 97);


					doc.text("CÓDIGO DE CONTROL : " + compra.codigo_control, 55, 792 - 62);
					//var currentDate=new Date();
					//doc.text("Usuario: "+$scope.usuario.nombre_usuario+"--"+"Fecha:"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear(),50,792-100);
					//compra.fecha_limite_emision=new Date(compra.fecha_limite_emision);
					//doc.text("FECHA LÍMITE DE EMISIÓN: "+compra.fecha_limite_emision.getDate()+"/"+(compra.fecha_limite_emision.getMonth()+1)+"/"+compra.fecha_limite_emision.getFullYear(),55,792-100);


					doc.rect(50, 792 - 107, 540, 30).stroke();
					doc.rect(50, 792 - 72, 400, 20).stroke();
					//doc.rect(50,792-110,400,20).stroke();

					doc.end();
					stream.on('finish', function () {
						var fileURL = stream.toBlobURL('application/pdf');
						window.open(fileURL, '_blank', 'location=no');
					});
					blockUI.stop();
				});
			}

			$scope.guardarCompra = function (valido, compra) {
				if (valido) {
					$scope.ocultarMensajesValidacion();
					if (compra.proveedor.nit.id) {
						compra.proveedor = compra.proveedor.nit;
					}
					//compra.codigo_control=$scope.formatearCodigoControl(compra.codigo_control);
					compra.usar_peps = $scope.usuario.empresa.usar_peps
					var tiempoActual = new Date();
					compra.fecha = new Date($scope.convertirFecha(compra.fechaTexto));
					compra.fecha.setHours(tiempoActual.getHours())
					compra.fecha.setMinutes(tiempoActual.getMinutes())
					compra.fecha.setSeconds(tiempoActual.getSeconds())
					blockUI.start();
					if (compra.id) {
						compra.esModificacion = true;
						var detallesInvalidos = [];
						for (var index = 0; index < compra.detallesCompra.length; index++) {
							if (compra.detallesCompra[index].cantidad == undefined || compra.detallesCompra[index].costo_unitario == undefined) {
								detallesInvalidos.push(compra.detallesCompra[index].producto.nombre + " no tiene cantidad o precio");
							}
						}
						if (detallesInvalidos.length > 0) {
							//alert(detallesInvalidos);
							$scope.mostrarMensaje(detallesInvalidos);
							$scope.abrirPopup($scope.idModalAlerta);
							blockUI.stop();
						} else {
							Compra.update({ id: compra.id }, compra, function (res) {
								blockUI.stop();
								$scope.cerrarPopPupEdicion();
								$scope.mostrarMensaje(res.mensaje);
								$scope.recargarItemsTabla();
							});
						}
					} else {
						var promesa = SaveCompra(compra)
						promesa.then(function (dato) {
							$scope.cerrarPopPupEdicion();
							$scope.mostrarMensaje(dato.mensaje);
							$scope.recargarItemsTabla();
							if (dato.compra) {
								$scope.imprimirCompra(dato.compra);
							}
						})
						/* 				compra.$save(function (sucursal) {
											blockUI.stop();
											$scope.cerrarPopPupEdicion();
											$scope.mostrarMensaje('Compra registrada exitosamente!');
											$scope.recargarItemsTabla();
											$scope.imprimirCompra(compra);
										}, function (error) {
											blockUI.stop();
											$scope.cerrarPopPupEdicion();
											$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
											$scope.recargarItemsTabla();
										}); */
					}
				}
			}

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
			$scope.verDescuentosPedido = function () {
				$scope.verDescuento = ($scope.verDescuento == false) ? true : false
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
			$scope.cerrarPopPupEdicion = function () {
				$scope.cerrarPopup($scope.idModalWizardCompraEdicion);
			}

			$scope.generarCompraDePedido = function (pedido) {
				pedido.detallesPedido.forEach(function (detalle, index, array) {

				})
			}
			$scope.EliminarPedido = function (pedido) {
				var promesa = EliminarPedidoEmpresa(pedido.id)
				promesa.then(function (dato) {
					$scope.mostrarMensaje(dato.mensaje)
					$scope.obtenerPedidosEmpresa()
					$scope.cerrarDialogEliminarPedido()
				})
			}
			$scope.EliminarPedidoDetalle = function (detalle) {
				detalle.eliminado = true
				var promesa = EliminarDetallePedidoEmpresa(detalle.id)
				promesa.then(function (dato) {
					$scope.mostrarMensaje(dato.mensaje)
					$scope.cerrarDialogEliminarDetallePedido()
				})
			}
			//$scope.list = $scope.$parent.personList
			$scope.config = {
				itemsPerPage: $scope.itemsPerPageCompra,
				fillLastPage: true
			}
			$scope.SelectItemPorPagina = function (itemsPerPageCompra) {
				$scope.config = {
					itemsPerPage: itemsPerPageCompra,
					fillLastPage: true
				}
			}

			$scope.subirExcelComprasIngresosDiarios = function (event) {
				//console.log('iniciando carga de pacientes')
				var files = event.target.files;
				var i, f;
				for (i = 0, f = files[i]; i != files.length; ++i) {
					//console.log('iniciando lectura de excel(s)')
					var reader = new FileReader();
					var name = f.name;
					reader.onload = function (e) {
						var data = e.target.result;
						var workbook = XLSX.read(data, { type: 'binary' });
						var first_sheet_name = workbook.SheetNames[0];
						var row = 2, i = 0, row2 = 2;
						var worksheet = workbook.Sheets[first_sheet_name];
						var compras = [];
						var arregloProveedores = []
						var arregloCentrosCosto = []
						var arregloProductos = []
						do {
							row2 = row
							var compra = { usar_producto: true, sucursal: {}, almacen: {}, tipoPago: {}, detallesCompra: [], proveedor: {} };
							compra.proveedor.nit = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
							compra.proveedor.razon_social = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
							var bandera = false
							if (arregloProveedores.length > 0) {
								for (var i = 0; i < arregloProveedores.length; i++) {
									var element = arregloProveedores[i].nit;
									if (compra.proveedor.nit != null) {
										if (element == compra.proveedor.nit) {
											bandera = true
										}
									}
								}
								if (!bandera) {

									arregloProveedores.push(compra.proveedor)

								}
							} else {
								arregloProveedores.push(compra.proveedor)
							}
							compra.factura = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
							/* if (row == 2) {
								var facturaComparacion = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
							} else {
								var facturaComparacion = worksheet['A' + (row - 1)] != undefined && worksheet['A' + (row - 1)] != "" ? worksheet['A' + (row - 1)].v.toString() : null;
							} */
							compra.autorizacion = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
							compra.fechaTexto = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? new Date($scope.fecha_excel_angular(worksheet['E' + row].v.toString())) : null;
							compra.codigo_control = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
							compra.sucursal.nombre = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
							compra.almacen.nombre = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? worksheet['H' + row].v.toString() : null;
							compra.tipoPago.nombre = worksheet['I' + row2] != undefined && worksheet['I' + row2] != "" ? worksheet['I' + row2].v.toString() : null;
							compra.dias_credito = worksheet['J' + row2] != undefined && worksheet['J' + row2] != "" ? worksheet['J' + row2].v.toString() : null;
							compra.a_cuenta = worksheet['K' + row2] != undefined && worksheet['K' + row2] != "" ? parseFloat(worksheet['K' + row2].v.toString()) : null;
							compra.observacion = worksheet['L' + row2] != undefined && worksheet['L' + row2] != "" ? worksheet['L' + row2].v.toString() : null;

							do {
								var NumeroCompraA = worksheet['C' + row2] != undefined && worksheet['C' + row2] != "" ? worksheet['C' + row2].v.toString() : null;
								if (NumeroCompraA == compra.factura) {
									var detalleCompra = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false, eliminado: false }
									detalleCompra.centroCosto.nombre = worksheet['M' + row2] != undefined && worksheet['M' + row2] != "" ? worksheet['M' + row2].v.toString() : null;
									var bandera = false
									detalleCompra.producto.codigo = worksheet['N' + row2] != undefined && worksheet['N' + row2] != "" ? worksheet['N' + row2].v.toString() : null;
									detalleCompra.producto.nombre = worksheet['O' + row2] != undefined && worksheet['O' + row2] != "" ? worksheet['O' + row2].v.toString() : null;
									if (detalleCompra.centroCosto.nombre.toUpperCase() != "ALMACEN") {
										if (arregloCentrosCosto.length > 0) {
											for (var i = 0; i < arregloCentrosCosto.length; i++) {
												var element = arregloCentrosCosto[i].nombre;
												if (detalleCompra.centroCosto.nombre != null) {
													if (element == detalleCompra.centroCosto.nombre) {
														bandera = true
													}
												}
											}
											if (!bandera) {
												arregloCentrosCosto.push(detalleCompra.centroCosto)
											}
										} else {
											arregloCentrosCosto.push(detalleCompra.centroCosto)
										}

										var bandera = false
										if (arregloProductos.length > 0) {
											for (var i = 0; i < arregloProductos.length; i++) {
												var element = arregloProductos[i].codigo;
												if (detalleCompra.producto.codigo != null) {
													if (element == detalleCompra.producto.codigo) {
														bandera = true
													}
												}
											}
											if (!bandera) {
												arregloProductos.push(detalleCompra.producto)
											}
										} else {
											arregloProductos.push(detalleCompra.producto)
										}
									}
									detalleCompra.fecha_vencimiento = worksheet['P' + row2] != undefined && worksheet['P' + row2] != "" ? new Date($scope.fecha_excel_angular(worksheet['P' + row2].v.toString())) : null;
									detalleCompra.lote = worksheet['Q' + row2] != undefined && worksheet['Q' + row2] != "" ? worksheet['Q' + row2].v.toString() : null;
									if ($scope.usuario.empresa.ver_costos_dolares) {
										detalleCompra.costo_unitario = 0;
										detalleCompra.costo_unitario_dolares = worksheet['R' + row2] != undefined && worksheet['R' + row2] != "" ? parseFloat(worksheet['R' + row2].v.toString()) : null;
									} else {
										detalleCompra.costo_unitario_dolares = 0;
										detalleCompra.costo_unitario = worksheet['R' + row2] != undefined && worksheet['R' + row2] != "" ? parseFloat(worksheet['R' + row2].v.toString()) : null;
									}
									detalleCompra.costo_unitario = worksheet['R' + row2] != undefined && worksheet['R' + row2] != "" ? parseFloat(worksheet['R' + row2].v.toString()) : null;
									detalleCompra.cantidad = worksheet['S' + row2] != undefined && worksheet['S' + row2] != "" ? parseFloat(worksheet['S' + row2].v.toString()) : null;
									detalleCompra.importe = detalleCompra.costo_unitario * detalleCompra.cantidad
									detalleCompra.tipo_descuento = worksheet['T' + row2] != undefined && worksheet['T' + row2] != "" ? worksheet['T' + row2].v.toString() : null;
									detalleCompra.descuento = worksheet['U' + row2] != undefined && worksheet['U' + row2] != "" ? parseFloat(worksheet['U' + row2].v.toString()) : null;
									detalleCompra.tipo_recargo = worksheet['V' + row2] != undefined && worksheet['V' + row2] != "" ? worksheet['V' + row2].v.toString() : null;
									detalleCompra.recargo = worksheet['W' + row2] != undefined && worksheet['W' + row2] != "" ? parseFloat(worksheet['W' + row2].v.toString()) : null;
									detalleCompra.ice = worksheet['X' + row2] != undefined && worksheet['X' + row2] != "" ? parseFloat(worksheet['X' + row2].v.toString()) : null;
									detalleCompra.excento = worksheet['Y' + row2] != undefined && worksheet['Y' + row2] != "" ? parseFloat(worksheet['Y' + row2].v.toString()) : null;
									detalleCompra.importe_dolares = detalleCompra.costo_unitario_dolares * detalleCompra.cantidad
									var recargo = detalleCompra.recargo
									if (detalleCompra.tipo_recargo == "%") {
										if ($scope.usuario.empresa.ver_costos_dolares) {
											recargo = detalleCompra.importe_dolares * (detalleCompra.recargo / 100);
										} else {
											recargo = detalleCompra.importe * (detalleCompra.recargo / 100);
										}
									}
									var descuento = detalleCompra.descuento
									if (detalleCompra.tipo_descuento == "%") {
										if ($scope.usuario.empresa.ver_costos_dolares) {
											descuento = detalleCompra.importe_dolares * (detalleCompra.descuento / 100);
										} else {
											descuento = detalleCompra.importe * (detalleCompra.descuento / 100);
										}
									}
									if ($scope.usuario.empresa.ver_costos_dolares) {
										detalleCompra.total_dolares = Math.round((detalleCompra.importe_dolares - descuento + recargo - detalleCompra.ice - detalleCompra.excento) * 1000) / 1000;
									} else {
										detalleCompra.total = Math.round((detalleCompra.importe - descuento + recargo - detalleCompra.ice - detalleCompra.excento) * 1000) / 1000;
									}
									// detalleCompra.total = Math.round((detalleCompra.importe - descuento + recargo - detalleCompra.ice - detalleCompra.excento) * 1000) / 1000;
									compra.detallesCompra.push(detalleCompra);
									row2++;
								}

							} while (NumeroCompraA == compra.factura);

							row = (row2 - 1)

							/* if (NumeroVenta != NumeroVentaComparacion || row == 2)  {*/
							var sumaImporte = 0;
							var sumaImporte_dolares = 0;
							for (var i = 0; i < compra.detallesCompra.length; i++) {
								sumaImporte = sumaImporte + compra.detallesCompra[i].importe;
								sumaImporte_dolares = sumaImporte_dolares + compra.detallesCompra[i].importe_dolares;
							}
							compra.importe = Math.round((sumaImporte) * 1000) / 1000;
							var sumaTotal = 0;
							var sumaTotal_dolares = 0;
							for (var i = 0; i < compra.detallesCompra.length; i++) {
								sumaTotal = sumaTotal + compra.detallesCompra[i].total;
								sumaTotal_dolares = sumaTotal_dolares + compra.detallesCompra[i].total_dolares;
							}
							compra.total = Math.round((sumaTotal) * 1000) / 1000;
							compra.total_dolares = Math.round((sumaTotal_dolares) * 1000) / 1000;
							var tipo_pago = $scope.tiposPago.filter(function (dato) {
								return dato.nombre == compra.tipoPago.nombre
							})
							compra.tipoPago = tipo_pago[0]
							if (compra.tipoPago.nombre == "CREDITO") {
								if ($scope.usuario.empresa.ver_costos_dolares) {
									compra.saldo = compra.total_dolares - compra.a_cuenta;
								} else {
									compra.saldo = compra.total - compra.a_cuenta;
								}
							} else {
								compra.saldo = null
							}
							compra.id_usuario = $scope.usuario.id
							var mov = $scope.movimientosIngreso.filter(function (dato) {
								return dato.nombre == $scope.diccionario.MOVING_DIARIO
							})
							compra.movimiento = mov[0]
							compra.id_empresa = $scope.usuario.id_empresa
							compra.fecha = compra.fechaTexto
							/* ventas.push(venta); */
							/* } */
							compras.push(compra);
							row++;
							i++;

						} while (worksheet['A' + row] != undefined);
						$scope.guardarImportacionComprasIngresoDiario(compras, arregloProveedores, arregloCentrosCosto, arregloProductos);
					};
					reader.readAsBinaryString(f);

				}
			}
			$scope.guardarImportacionComprasIngresoDiario = function (compras, arregloProveedores, arregloCentrosCosto, arregloProductos) {
				blockUI.start();
				var promesa = GuardarImportacionComprasIngresoDiario(compras, arregloProveedores, arregloCentrosCosto, arregloProductos, $scope.usuario.id_empresa)
				promesa.then(function (dato) {
					blockUI.stop()
					$scope.mostrarMensaje(dato.mensaje)
					$scope.recargarItemsTabla()
				})
			}
			$scope.subirExcelPagosCompras = function (event) {
				var files = event.target.files;
				var i, f;
				for (i = 0, f = files[i]; i != files.length; ++i) {
					//console.log('iniciando lectura de excel(s)')
					var reader = new FileReader();
					var name = f.name;
					reader.onload = function (e) {
						var data = e.target.result;
						var workbook = XLSX.read(data, { type: 'binary' });
						var first_sheet_name = workbook.SheetNames[0];
						var row = 2, i = 0, row2 = 2;
						var worksheet = workbook.Sheets[first_sheet_name];
						var pagos = []
						do {
							row2 = 2
							var pago = {}
							pago.factura = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
							pago.fecha = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
							pago.monto = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? parseFloat(worksheet['C' + row].v.toString()) : null;
							pago.sucursal = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
							var sucursalEncontrada = $scope.sucursales.find(function (sucursal) {
								return sucursal.nombre.toUpperCase() == pago.sucursal.toUpperCase()
							})
							pago.sucursal = sucursalEncontrada
							pago.total = 0
							do {
								var NumeroCompraA = worksheet['A' + row2] != undefined && worksheet['A' + row2] != "" ? worksheet['A' + row2].v.toString() : null;
								var monto = worksheet['C' + row2] != undefined && worksheet['C' + row2] != "" ? parseFloat(worksheet['C' + row2].v.toString()) : null;
								if (NumeroCompraA == pago.factura) {
									pago.total += monto
								}
								row2++
							} while (NumeroCompraA == pago.factura);
							pagos.push(pago)
							row++
						} while (worksheet['A' + row] != undefined);
						$scope.guardarImportacionPagosCompras(pagos);
					};
					reader.readAsBinaryString(f);

				}
			}
			$scope.guardarImportacionPagosCompras = function (pagos) {
				blockUI.start();
				var promesa = GuardarImportacionPagosCompras(pagos, $scope.usuario.id_empresa)
				promesa.then(function (dato) {
					blockUI.stop()
					$scope.mostrarMensaje(dato.mensaje)
					$scope.recargarItemsTabla()
				})
			}
			$scope.$on('$routeChangeStart', function (next, current) {
				$scope.eliminarPopup($scope.idModalWizardCompraEdicion);
				$scope.eliminarPopup($scope.idModalWizardCompraVista);
				$scope.eliminarPopup($scope.idModalEliminarCompra);
				$scope.eliminarPopup($scope.idModalPago);
				$scope.eliminarPopup($scope.idModalServicios);
				$scope.eliminarPopup($scope.idModalPedidos);
				$scope.eliminarPopup($scope.idModalDetallePedidos);
				$scope.eliminarPopup($scope.idModalEliminarPedido);
				$scope.eliminarPopup($scope.idModalEliminarProductoPedido);
				$scope.eliminarPopup($scope.ModalMensajePago);
			});

			$scope.inicio();
		}]);