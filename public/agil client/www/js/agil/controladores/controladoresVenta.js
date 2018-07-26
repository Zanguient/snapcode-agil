angular.module('agil.controladores')

	.controller('ControladorVentas', function ($scope, $filter, $localStorage, $location, $templateCache, $route, blockUI, $timeout, $window, InventarioPaginador,
		Venta, Ventas, Clientes, ClientesNit, ProductosNombre, ClasesTipo, VentasContado, VentasCredito,
		PagosVenta, DatosVenta, VentaEmpresaDatos, ProductosPanel, ListaProductosEmpresaUsuario, ListaInventariosProducto,
		socket, ConfiguracionVentaVistaDatos, ConfiguracionVentaVista, ListaGruposProductoEmpresa,
		ConfiguracionImpresionEmpresaDato, ImprimirSalida, ListaVendedorVenta, VendedorVenta, VendedorVentaActualizacion, GuardarUsuarLectorDeBarra, VerificarLimiteCredito, ListaSucursalesUsuario, ListaGruposProductoUsuario) {
		blockUI.start();
		$scope.usuario = JSON.parse($localStorage.usuario);
		convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
			$scope.usuario.empresa.imagen = imagenEmpresa;
		});
		$scope.idModalPago = 'dialog-pago';
		$scope.idModalCierre = 'dialog-cierre-caja';
		$scope.idModalWizardCompraEdicion = 'modal-wizard-venta-edicion';
		$scope.idModalWizardVentaVista = 'modal-wizard-venta-vista';
		$scope.idModalEliminarCompra = 'dialog-eliminar-venta';
		$scope.idModalContenedorCompraEdicion = 'modal-wizard-container-venta-edicion';
		$scope.idModalContenedorVentaVista = 'modal-wizard-container-venta-vista';
		$scope.idInputCompletar = 'nit';
		$scope.idModalPanelVentas = 'dialog-panel-ventas';
		$scope.idModalConfirmacionEliminacionVenta = "dialog-eliminar-venta";
		$scope.idModalInventario = "dialog-productos-venta";
		$scope.idModalPanelVentasCobro = 'dialog-panel-cobro';
		$scope.idModalEdicionVendedor = 'dialog-edicion-vendedor';
		$scope.idModalImpresionVencimiento = 'dialog-imprimir-con-fecha-vencimiento';
		
		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsVenta($scope.idModalWizardCompraEdicion, $scope.idModalWizardVentaVista,
				$scope.idModalEliminarCompra, $scope.idModalContenedorCompraEdicion,
				$scope.idModalContenedorVentaVista, $scope.idInputCompletar, $scope.url, $scope.idModalPago,
				$scope.idModalCierre,
				$scope.idModalPanelVentas, $scope.idModalConfirmacionEliminacionVenta, $scope.idModalInventario, $scope.idModalPanelVentasCobro,
				$scope.idModalEdicionVendedor, $scope.idModalImpresionVencimiento);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});

		$scope.inicio = function () {

			$scope.ordenProductos = true;
			$scope.esContado = true;
			//$scope.obtenerClientes();
			$scope.obtenerTiposDePago();
			$scope.obtenerConfiguracionVentaVista();

			$scope.sucursales = []//$scope.obtenerSucursales();
			$scope.obtenerSucursales();
			$scope.sucursalesUsuario = "";
			$scope.obtenerFormatoFactura();
			// for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
			// 	$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
			// 	if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
			// 		$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
			// 	}
			// }

			//$scope.obtenerVentas();
			$scope.obtenerMovimientosEgreso();

			$scope.obtenerVendedores();

			$scope.detalleVenta = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
		}

		$scope.obtenerConfiguracionVentaVista = function () {
			blockUI.start();
			var promise = ConfiguracionVentaVistaDatos($scope.usuario.id_empresa);
			promise.then(function (configuracion) {
				$scope.configuracionVentaVista = configuracion;
				blockUI.stop();
			});
		}

		$scope.guardarConfiguracionVentaVista = function () {
			ConfiguracionVentaVista.update({ id_empresa: $scope.usuario.id_empresa }, $scope.configuracionVentaVista, function (res) {

			});
		}

		$scope.generarListaGruposSeleccionados = function (gruposActualizado, gruposCache) {
			var listaGruposSeleccionados = [];
			for (var i = 0; i < gruposActualizado.length; i++) {
				for (var j = 0; j < gruposCache.length; j++) {
					if (gruposActualizado[i].id == gruposCache[j].id) {
						gruposActualizado[i].selected = gruposCache[j].selected;
					}
				}
			}
			return gruposActualizado;
		}
		// $scope.usarServicios = function (usar_servicios) {
		// 	if (usar_servicios) {

		// 	}else{

		// 	}
		// }
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
						//console.log(totalsaldo)
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
		$scope.diferenciaEntreDiasEnDias = function (a, b) {
			var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
			var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

			return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
		}

		$scope.obtenerGruposProductoEmpresa = function () {
			// var promesa = ListaGruposProductoEmpresa($scope.usuario.id_empresa);
			var promesa = ListaGruposProductoUsuario($scope.usuario.id_empresa, $scope.usuario.id);

			promesa.then(function (grupos) {
				$scope.grupos_productos = grupos;
				/*if ( angular.isDefined($localStorage.grupos_check) ) {
					$scope.grupos_check=JSON.parse($localStorage.grupos_check);
					$scope.grupos_check=$scope.generarListaGruposSeleccionados($scope.grupos_productos,$scope.grupos_check);
				} else {
					$scope.grupos_check=[];
					for (var i = 0; i < $scope.grupos_productos.length; i++) {
						$scope.grupos_productos[i].selected = true;
						$scope.grupos_check.push($scope.grupos_productos[i]);
						$localStorage.grupos_check=JSON.stringify($scope.grupos_check);
					}
				}
	
				$scope.cambiarListaGruposCheck=function(grupo){//console.log(grupo);
					grupo.selected=!grupo.selected;
					$localStorage.grupos_check=JSON.stringify($scope.grupos_check);
				}*/

				// ================== codigo filtro grupos checkbox ==============

				// == condicion save localstorage ====
				if (angular.isDefined($localStorage.grupos_productos)) {
					$scope.grupos_productos = $scope.generarListaGruposSeleccionados($scope.grupos_productos, $localStorage.grupos_productos);
				} else {
					for (var i = 0; i < grupos.length; i++) {
						$scope.grupos_productos[i].selected = true;
					}
				}


				//save checked list function
				$scope.listChecked = [];
				$scope.saveCheckList = function () {
					//remove all list checked
					$scope.listChecked.splice(0, $scope.listChecked.length);
					for (var i = 0; i < $scope.grupos_productos.length; i++) {
						if ($scope.grupos_productos[i].selected == true) {
							$scope.listChecked.push($scope.grupos_productos[i]);
						}
					}

					$localStorage.grupos_productos = $scope.grupos_productos;
				}

				$scope.saveCheckList();

				//checked or unchecked function	
				$scope.allChecked = false;
				$scope.checkedUnchecked = function () {
					for (var i = 0; i < $scope.grupos_productos.length; i++) {
						$scope.grupos_productos[i].selected = $scope.allChecked;
					}
					$scope.saveCheckList();
				}
				// =================== fin codigo ============================
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

		$scope.abrirPopuEdicionVendedor = function () {
			$scope.vendedor = new VendedorVenta({ id_empresa: $scope.usuario.id_empresa });
			$scope.abrirPopup($scope.idModalEdicionVendedor);
		}

		$scope.cerrarPopupEdicionVendedor = function () {
			$scope.cerrarPopup($scope.idModalEdicionVendedor);
		}

		$scope.guardarVendedor = function (vendedor) {
			$scope.cerrarPopup($scope.idModalEdicionVendedor);
			if (vendedor.id) {
				VendedorVentaActualizacion.update({ id_vendedor: vendedor.id }, vendedor, function (res) {
					$scope.mostrarMensaje(res.mensaje);
					$scope.obtenerVendedores();
				});
			} else {
				vendedor.$save(function (res) {
					$scope.mostrarMensaje("Vendedor registrado satisfactoriamente!");
					$scope.obtenerVendedores();
				});
			}
		}

		$scope.obtenerVendedores = function () {
			blockUI.start();
			var promesa = ListaVendedorVenta($scope.usuario.id_empresa);
			promesa.then(function (vendedores) {
				$scope.vendedores = vendedores;
				blockUI.stop();
			});
		}

		$scope.obtenerMovimientosEgreso = function () {
			blockUI.start();
			var promesa = ClasesTipo("MOVEGR");
			promesa.then(function (entidad) {
				$scope.movimientosEgreso = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerTipoEgreso = function (movimiento) {
			var nombre_corto = movimiento.nombre_corto;
			$scope.tipoEgreso = nombre_corto;
		}

		$scope.buscarCliente = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ClientesNit($scope.usuario.id_empresa, query);
				return promesa;
			}
		};

		$scope.obtenerClientes = function () {
			var promesa = Clientes($scope.usuario.id_empresa);
			promesa.then(function (clientes) {
				for (var i = 0; i < clientes.length; i++) {
					clientes[i].nit = clientes[i].nit.toString();
				}
				$scope.clientes = clientes;
			});
		}

		$scope.buscarProductoLectorBarra = function (query) {
			blockUI.start()
			if (query != "" && query != undefined) {
				var promesa = ListaProductosEmpresaUsuario($scope.usuario.id_empresa, query, $scope.usuario.id, $scope.venta.almacen.id);
				promesa.then(function (datos) {
					if (datos.length == 1) {
						$scope.establecerProducto(datos[0])
					}
					blockUI.stop()
				}, function (err) {
					$scope.mostrarMensaje(err.message)
					blockUI.stop()
				})
				blockUI.stop()
				return promesa;
			}

		}

		$scope.buscarProducto = function (query) {
			blockUI.start()
			if (query != "" && query != undefined) {
				var promesa = ListaProductosEmpresaUsuario($scope.usuario.id_empresa, query, $scope.usuario.id, $scope.venta.almacen.id);
				/*  promesa.then(function (datos) {
					if (datos.length > 1) {
					} else {
						$scope.establecerProducto(datos[0])
					}
					blockUI.stop()
				}, function (err) {
					$scope.mostrarMensaje(err.message)
					blockUI.stop()
				})	 */
				blockUI.stop()
				return promesa;
			}

		}
		$scope.establecerProducto = function (producto) {

			producto.tipoProducto = producto['tipoProducto'] == null ? { id: producto['tipoProducto.id'], nombre: producto['tipoProducto.nombre'], nombre_corto: producto['tipoProducto.nombre_corto'] } : producto.tipoProducto;
			$scope.editar_precio = false;

			var promesa = ListaInventariosProducto(producto.id, $scope.venta.almacen.id);
			promesa.then(function (inventarios) {
				producto.inventarios = inventarios;
					for (var i = 0; i < producto.inventarios.length; i++) {
						producto.inventarios[i].fecha_vencimiento = (producto.inventarios[i].fecha_vencimiento ? new Date(producto.inventarios[i].fecha_vencimiento) : null);
						producto.inventarios[i].fechaVencimientoTexto = (producto.inventarios[i].fecha_vencimiento ? producto.inventarios[i].fecha_vencimiento.getDate() + "/" + (producto.inventarios[i].fecha_vencimiento.getMonth() + 1) + "/" + producto.inventarios[i].fecha_vencimiento.getFullYear() : "");
						producto.inventarios[i].detallesMovimiento[0].movimiento.fecha = new Date(producto.inventarios[i].detallesMovimiento[0].movimiento.fecha);
						producto.inventarios[i].detallesMovimiento[0].movimiento.fechaTexto = producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getDate() + "/" + (producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getMonth() + 1) + "/" + producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getFullYear();
					}

					$scope.inventariosDisponibleProducto = [];
					$scope.inventariosDisponibleProducto.push({ id: 0, fecha_vencimiento: "TODOS", fechaVencimientoTexto: "TODOS" });
					$scope.inventariosDisponibleProducto = $scope.inventariosDisponibleProducto.concat(producto.inventarios);
					var inventarioDisponible = $scope.obtenerInventarioTotal(producto);
					$scope.detalleVenta = {
						producto: producto, precio_unitario: producto.precio_unitario, inventarioProducto: $scope.inventariosDisponibleProducto[0],
						inventario_disponible: inventarioDisponible, costos: producto.activar_inventario ? producto.inventarios : [],
						cantidad: 1, descuento: producto.descuento, recargo: 0, ice: 0, excento: 0, tipo_descuento: (producto.descuento > 0 ? true : false), tipo_recargo: false
					};

					// === para colocar el costo unitario de inventario == 
					$scope.precio_inventario;
					if (producto.inventarios.length > 0) {
						$scope.precio_inventario = producto.inventarios[producto.inventarios.length - 1].costo_unitario + " Bs";

					} else {
						$scope.precio_inventario = "Sin histórico";
					}
					$scope.inventarioProducto = producto.activar_inventario ? producto.inventarios : []
					$scope.colorearInventarioDisponible(inventarioDisponible, producto);
					//	$scope.enfocar('cantidad');
					document.getElementById("cantidad").focus();
					$scope.calcularImporte();
					$scope.cerrarPopup($scope.idModalInventario);
			});
		}

		$scope.colorearInventarioDisponible = function (inventarioDisponible, producto) {
			if (inventarioDisponible == 0) {
				$scope.porcentaje = "100";
				$scope.color = "red";
			} else if (inventarioDisponible > ((producto.inventario_minimo * 3) + 1)) {
				$scope.porcentaje = "100";
				$scope.color = "green";
			} else if (inventarioDisponible > ((producto.inventario_minimo * 2) + 1)) {
				$scope.porcentaje = "75";
				$scope.color = "green";
			} else if (inventarioDisponible > ((producto.inventario_minimo * 1.5) + 1)) {
				$scope.porcentaje = "50";
				$scope.color = "green"
			} else if (inventarioDisponible == (producto.inventario_minimo + 1)) {
				$scope.porcentaje = "38";
				$scope.color = "yellow";
			} else if (inventarioDisponible == producto.inventario_minimo) {
				$scope.porcentaje = "25";
				$scope.color = "red";
			} else if (inventarioDisponible < producto.inventario_minimo && inventarioDisponible > 0) {
				$scope.porcentaje = "12";
				$scope.color = "red";
			}
		}

		$scope.actualizarInventarioDisponibleFechaVencimiento = function (detalleVenta) {
			if (detalleVenta.inventarioProducto.id != 0) {
				detalleVenta.costos = [];
				detalleVenta.costos.push(detalleVenta.inventarioProducto);
				detalleVenta.inventario_disponible = $scope.obtenerInventarioTotalPorFechaVencimiento(detalleVenta);
				detalleVenta.lote = detalleVenta.inventarioProducto.lote;
			} else {
				detalleVenta.inventario_disponible = $scope.obtenerInventarioTotal(detalleVenta.producto);
				detalleVenta.costos = detalleVenta.producto.inventarios;
				detalleVenta.lote = "";
			}
			$scope.colorearInventarioDisponible(detalleVenta.inventario_disponible, detalleVenta.producto);
			$scope.calcularImporte();
		}

		$scope.establecerCliente = function (cliente) {
			$scope.venta.cliente = cliente;
			$scope.enfocar('razon_social');
			$scope.capturarInteraccion();
		}

		$scope.eliminarVendedor = function (vendedor) {
			$scope.cerrarConfirmacionEliminacion();
			var vendedorAEliminar = new VendedorVentaActualizacion(vendedor);
			vendedorAEliminar.$delete(function (res) {
				$scope.mostrarMensaje(res.mensaje);
				$scope.obtenerVendedores();
			}, function (res) {
				$scope.mostrarMensaje("Ocurrio un problema al eliminar!");
			});
		}

		$scope.modificarVendedor = function (vendedor) {
			$scope.vendedor = vendedor;
			$scope.abrirPopup($scope.idModalEdicionVendedor);
		}

		$scope.obtenerInventarioTotal = function (producto) {
			var cantidadTotal = 0;
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					cantidadTotal += (producto.inventarios[i].cantidad);
				}
				for (var j = 0; j < $scope.venta.detallesVenta.length; j++) {
					if ($scope.venta.detallesVenta[j].producto.id == producto.id) {
						cantidadTotal = cantidadTotal - $scope.venta.detallesVenta[j].cantidad;
					}
				}
			} else {
				cantidadTotal = 500000;
			}
			return cantidadTotal;
		}

		$scope.obtenerInventarioTotalPorFechaVencimiento = function (detalleVenta) {
			if ($scope.usuario.empresa.usar_peps) {
				var cantidadTotal = detalleVenta.inventarioProducto.cantidad;
			for (var j = 0; j < $scope.venta.detallesVenta.length; j++) {
				if ($scope.venta.detallesVenta[j].producto.id == detalleVenta.producto.id && $scope.venta.detallesVenta[j].costos[0].id == detalleVenta.inventarioProducto.id) {
					cantidadTotal = cantidadTotal - $scope.venta.detallesVenta[j].cantidad;
				}
			}
			return cantidadTotal;
			} else {
				var cantidadTotal = detalleVenta.inventario_disponible;
			for (var j = 0; j < $scope.venta.detallesVenta.length; j++) {
				if ($scope.venta.detallesVenta[j].producto.id == detalleVenta.producto.id && $scope.venta.detallesVenta[j].costos[0].id == detalleVenta.inventarioProducto.id) {
					cantidadTotal = cantidadTotal - $scope.venta.detallesVenta[j].cantidad;
				}
			}
			return cantidadTotal;
			}
			
		}

		$scope.agregarDetalleVenta = function (detalleVenta) {
			if (detalleVenta.producto.id) {
				if (detalleVenta.producto.activar_inventario) {
					if ($scope.usuario.empresa.usar_peps) {
						if (detalleVenta.costos.length > 1) {
							var cantidadTotal = detalleVenta.cantidad, i = 0, detalleVentaOriginal = JSON.parse(JSON.stringify(detalleVenta));
							while (i < detalleVenta.costos.length && cantidadTotal > 0) {
								detalleVenta.inventarioProducto = detalleVenta.costos[i];
								var cantidadDisponible = $scope.obtenerInventarioTotalPorFechaVencimiento(detalleVenta);
								if (cantidadDisponible > 0) {
									var nuevoDetalleVenta = JSON.parse(JSON.stringify(detalleVentaOriginal));
									var cantidadParcial;
									/* if (i > 0) {
										nuevoDetalleVenta.descuento = 0;
										nuevoDetalleVenta.recargo = 0;
										nuevoDetalleVenta.ice = 0;
										nuevoDetalleVenta.excento = 0;
									} */
									$scope.detalleVenta = nuevoDetalleVenta;
									if (cantidadTotal > cantidadDisponible) {
										cantidadParcial = cantidadDisponible;
										cantidadTotal = cantidadTotal - cantidadDisponible
									} else {
										cantidadParcial = cantidadTotal;
										cantidadTotal = 0;
									}
									nuevoDetalleVenta.cantidad = cantidadParcial;
									if ($scope.usuario.empresa.usar_vencimientos) {
										nuevoDetalleVenta.fecha_vencimiento = detalleVenta.costos[i].fecha_vencimiento;
										nuevoDetalleVenta.lote = detalleVenta.costos[i].lote;
									}
									nuevoDetalleVenta.costos = [];
									nuevoDetalleVenta.costos.push(detalleVenta.costos[i]);
									nuevoDetalleVenta.inventario = detalleVenta.costos[i];
									$scope.calcularImporte();
									$scope.venta.detallesVenta.push(nuevoDetalleVenta);
								}
								i++;
							}
						} else {
							if (detalleVenta.costos.length > 0) {
								if ($scope.usuario.empresa.usar_vencimientos) {
									detalleVenta.fecha_vencimiento = detalleVenta.costos[0].fecha_vencimiento;
									detalleVenta.lote = detalleVenta.costos[0].lote;
									detalleVenta.inventario = detalleVenta.costos[0];
								}
							}
							$scope.venta.detallesVenta.push(detalleVenta);
						}
					} else {
						var cantidadTotal = detalleVenta.cantidad, i = 0, detalleVentaOriginal = JSON.parse(JSON.stringify(detalleVenta));
						detalleVenta.inventarioProducto = detalleVenta.costos[i];
						var cantidadDisponible = $scope.obtenerInventarioTotalPorFechaVencimiento(detalleVenta);
						if (cantidadDisponible > 0) {
							var nuevoDetalleVenta = JSON.parse(JSON.stringify(detalleVentaOriginal));
							var cantidadParcial;
							/* if (i > 0) {
								nuevoDetalleVenta.descuento = 0;
								nuevoDetalleVenta.recargo = 0;
								nuevoDetalleVenta.ice = 0;
								nuevoDetalleVenta.excento = 0;
							} */
							$scope.detalleVenta = nuevoDetalleVenta;
							if (cantidadTotal > cantidadDisponible) {
								cantidadParcial = cantidadDisponible;
								cantidadTotal = cantidadTotal - cantidadDisponible
							} else {
								cantidadParcial = cantidadTotal;
								cantidadTotal = 0;
							}
							nuevoDetalleVenta.cantidad = cantidadParcial;
							if ($scope.usuario.empresa.usar_vencimientos) {
								nuevoDetalleVenta.fecha_vencimiento = detalleVenta.costos[i].fecha_vencimiento;
								nuevoDetalleVenta.lote = detalleVenta.costos[i].lote;
							}
							nuevoDetalleVenta.costos = [];
							nuevoDetalleVenta.costos.push(detalleVenta.costos[i]);
							nuevoDetalleVenta.inventario = detalleVenta.costos[i];
							$scope.calcularImporte();
							$scope.venta.detallesVenta.push(nuevoDetalleVenta);
						}
					}

				} else {
					$scope.venta.detallesVenta.push(detalleVenta);
				}
				$scope.inventariosDisponibleProducto = [];
				$scope.sumarTotal();
				$scope.sumarTotalImporte();
				$scope.calcularSaldo();
				$scope.calcularCambio();
				$scope.precio_inventario = "Sin histórico";
				$scope.detalleVenta = { producto: { activar_inventario: true }, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
				$scope.enfocar('id_producto');
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

		$scope.eliminarDetalleVenta = function (detalleVenta) {
			$scope.venta.detallesVenta.splice($scope.venta.detallesVenta.indexOf(detalleVenta), 1);
			$scope.sumarTotal();
			$scope.sumarTotalImporte();
			$scope.calcularSaldo();
			$scope.calcularCambio();
			$scope.capturarInteraccion();
		}

		$scope.eliminarDetalleVentaPanel = function (detalleVenta) {
			var indice = $scope.productosProcesados.indexOf(detalleVenta.producto);
			$scope.productosProcesados[indice].inventario_disponible = $scope.productosProcesados[indice].inventario_disponible + detalleVenta.cantidad;

			$scope.venta.detallesVenta.splice($scope.venta.detallesVenta.indexOf(detalleVenta), 1);
			$scope.sumarTotal();
			$scope.sumarTotalImporte();
			$scope.calcularSaldo();
			$scope.calcularCambio();
			$scope.capturarInteraccion();
		}

		$scope.cambiarTipoPago = function (venta) {
			var tipoPagoO = venta.tipoPago
			var tipoPago = $.grep($scope.tiposPago, function (e) { return e.id == tipoPagoO.id; })[0];
			$scope.esContado = tipoPago.nombre_corto == 'CONT' ? true : false;
			$scope.calcularCambio();
			if (venta.cliente.usar_limite_credito == true) {
				$scope.verificarLimiteCredito(venta)
			}
		}

		$scope.recalcular = function () {
			$scope.calcularImporte();
		}

		$scope.calcularImporte = function () {
			$scope.detalleVenta.importe = Math.round(($scope.detalleVenta.cantidad * $scope.detalleVenta.precio_unitario) * 1000) / 1000;
			var descuento, recargo;
			if ($scope.detalleVenta.tipo_descuento) {
				descuento = $scope.detalleVenta.importe * ($scope.detalleVenta.descuento / 100);
			} else {
				descuento = $scope.detalleVenta.descuento;
			}
			if ($scope.detalleVenta.tipo_recargo) {
				recargo = $scope.detalleVenta.importe * ($scope.detalleVenta.recargo / 100);
			} else {
				recargo = $scope.detalleVenta.recargo;
			}
			$scope.detalleVenta.total = Math.round(($scope.detalleVenta.importe - descuento + recargo - $scope.detalleVenta.ice - $scope.detalleVenta.excento) * 1000) / 1000;
		}

		$scope.sumarTotalImporte = function () {
			var sumaImporte = 0;
			for (var i = 0; i < $scope.venta.detallesVenta.length; i++) {
				sumaImporte = sumaImporte + $scope.venta.detallesVenta[i].importe;
			}
			$scope.venta.importe = Math.round((sumaImporte) * 1000) / 1000;
		}

		$scope.sumarTotal = function () {
			var sumaTotal = 0;
			for (var i = 0; i < $scope.venta.detallesVenta.length; i++) {
				sumaTotal = sumaTotal + $scope.venta.detallesVenta[i].total;
			}
			$scope.venta.total = Math.round((sumaTotal) * 1000) / 1000;
			$scope.venta.pagado = $scope.venta.total;
		}

		$scope.calcularSaldo = function () {
			$scope.venta.saldo = $scope.venta.total - $scope.venta.a_cuenta;
		}

		$scope.obtenerSucursales = function () {
			var sucursales = [];
			// for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
			// 	sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			// }
			var promesa = ListaSucursalesUsuario($scope.usuario.id);
			promesa.then(function (res) {
				res.sucursales.map(function (_) {
					$scope.sucursales.push(_.sucursal)
					// $scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
					// if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
					// 	$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
					// }
				})
				$scope.usuario.sucursalesUsuario = res.sucursales
				for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
					$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
					if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
						$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
					}
				}
				// blockUI.stop();
			});

			// return sucursales;
		}

		$scope.obtenerAlmacenesSucursalesDiferente = function (idSucursalOrigen) {
			$scope.obtenerAlmacenes(idSucursalOrigen);
			$scope.obtenerSucursalesDiferente(idSucursalOrigen);
		}

		$scope.obtenerAlmacenesDiferente = function (idSucursalDestino) {
			$scope.almacenesDiferente = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursalDestino; })[0];
			$scope.almacenesDiferente = sucursal.almacenes;
			$scope.venta.almacenDestino = $scope.almacenesDiferente.length == 1 ? $scope.almacenesDiferente[0] : null;
		}

		$scope.obtenerSucursalesDiferente = function (idSucursal) {
			$scope.sucursalesDiferente = $.grep($scope.sucursales, function (e) { return e.id != idSucursal; });
			$scope.almacenesDiferente = $scope.sucursalesDiferente.almacenes;
		}

		$scope.obtenerAlmacenesActividades = function (idSucursal) {
			$scope.obtenerAlmacenes(idSucursal);
			$scope.obtenerActividades(idSucursal);
		}

		$scope.obtenerAlmacenes = function (idSucursal) {
			$scope.almacenes = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
			$scope.almacenes = sucursal.almacenes;
			$scope.venta.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : null;
			if ($scope.venta.almacen) {
				$scope.cargarProductos();
			}
		}

		$scope.obtenerActividades = function (idSucursal) {
			$scope.actividades = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
			$scope.actividadesDosificaciones = sucursal.actividadesDosificaciones;
			$scope.actividades = [];
			for (var i = 0; i < $scope.actividadesDosificaciones.length; i++) {
				if ($scope.actividadesDosificaciones[i].dosificacion) {
					if (!$scope.actividadesDosificaciones[i].expirado && !$scope.actividadesDosificaciones[i].dosificacion.expirado) {
						$scope.actividades.push($scope.actividadesDosificaciones[i].actividad);
					} else {
						$scope.dosificacionesExpiradas = true
					}
				}
			}
			$scope.venta.actividad = $scope.actividades.length == 1 ? $scope.actividades[0] : null;
		}

		$scope.obtenerVentas = function () {
			var currentDate = new Date();
			var currentDateString = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
			$scope.filtrarVentas($scope.sucursalesUsuario, currentDateString, currentDateString);
		}

		$scope.filtrarVentas = function (sucursalesUsuario, inicio, fin, razon_social, nit, monto, tipo_pago, sucursal, transaccion, usuario, estado) {
			razon_social = (razon_social == "" || razon_social == undefined) ? 0 : razon_social;
			estado = (estado == "" || estado == undefined) ? 0 : estado;
			nit = (nit == null || nit == undefined) ? 0 : nit;
			monto = (monto == null || monto == undefined) ? 0 : monto;
			tipo_pago = (tipo_pago == undefined) ? 0 : tipo_pago;
			sucursal = (sucursal == null || sucursal == undefined) ? 0 : sucursal;
			transaccion = (transaccion == null || transaccion == undefined) ? 0 : transaccion;
			var roles = $.grep($scope.usuario.rolesUsuario, function (e) { return e.rol.nombre == $scope.diccionario.ROL_ADMINISTRADOR; });
			usuario = roles.length > 0 ? ((usuario == "" || usuario == undefined) ? 0 : usuario) : $scope.usuario.nombre_usuario;
			blockUI.start();

			$scope.razon_sociald = razon_social;
			$scope.nitd = nit;
			$scope.montod = monto;
			$scope.usuariod = usuario;

			if (transaccion != 0) $scope.transacciond = $.grep($scope.movimientosEgreso, function (e) { return e.id == transaccion; }).length > 0 ? $.grep($scope.movimientosEgreso, function (e) { return e.id == transaccion; })[0].nombre : "todos";
			if (sucursal != 0) $scope.sucursald = $.grep($scope.sucursales, function (e) { return e.id == sucursal; }).length > 0 ? $.grep($scope.sucursales, function (e) { return e.id == sucursal; })[0].nombre : "todos";
			if (tipo_pago != 0) $scope.tipoPagod = $.grep($scope.tiposPago, function (e) { return e.id == tipo_pago; }).length > 0 ? $.grep($scope.tiposPago, function (e) { return e.id == tipo_pago; })[0].nombre : "todos";


			inicio = new Date($scope.convertirFecha(inicio));
			fin = new Date($scope.convertirFecha(fin));
			var promesa = Ventas(sucursalesUsuario, inicio, fin, razon_social, nit, monto, tipo_pago, sucursal, transaccion, usuario, estado);
			promesa.then(function (ventas) {
				$scope.ventas = ventas;
				//console.log(ventas);
				blockUI.stop();

				//$scope.aplicarTabla('tabla-ventas',6);
			});
		}

		$scope.abrirPopupPago = function (venta) {
			$scope.venta = venta;
			$scope.pago = null;
			$scope.abrirPopup($scope.idModalPago);
		}

		$scope.cerrarPopupPago = function () {
			$scope.cerrarPopup($scope.idModalPago);
		}

		$scope.efectuarPago = function (pago) {
			blockUI.start();
			VentaEmpresaDatos.update({ id: $scope.venta.id, id_empresa: $scope.usuario.id_empresa }, { pago: pago, id_usuario_cajero: $scope.usuario.id }, function (data) {
				$scope.mostrarMensaje(data.mensaje);
				$scope.cerrarPopup($scope.idModalPago);
				$scope.obtenerVentas();
				$scope.imprimirRecibo(data, data.venta, pago);
				blockUI.stop();
			}, function (error) {
				$scope.mostrarMensaje(error);
				$scope.cerrarPopup($scope.idModalPago);
				$scope.obtenerVentas();
				blockUI.stop();
			});
		}

		$scope.imprimirRecibo = function (data, venta, pago) {
			blockUI.start();
			var doc = new PDFDocument({ compress: false, size: [227, 353], margin: 10 });
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
		}

		$scope.abrirPopupCierre = function () {
			$scope.cierre = {}
			$scope.abrirPopup($scope.idModalCierre);
		}

		$scope.cerrarPopupCierre = function () {
			$scope.cerrarPopup($scope.idModalCierre);
		}

		$scope.cerrarCaja = function (cierre) {
			blockUI.start();
			inicio = new Date();
			fin = new Date();
			var promesa = VentasContado($scope.sucursalesUsuario, inicio, fin, $scope.usuario.id);
			promesa.then(function (ventasContado) {
				promesa = VentasCredito($scope.sucursalesUsuario, inicio, fin, $scope.usuario.id);
				promesa.then(function (ventasCredito) {
					promesa = PagosVenta($scope.sucursalesUsuario, inicio, fin, $scope.usuario.id);
					promesa.then(function (pagos) {
						$scope.generarReporteCierreCaja(cierre, ventasContado, ventasCredito, pagos);
						$scope.cerrarPopupCierre();
					});
				});
			});
		}

		$scope.generarReporteCierreCaja = function (cierre, ventas, ventasCredito, pagos) {
			var promesa = ConfiguracionImpresionEmpresaDato($scope.usuario.id_empresa, 0);
			promesa.then(function (configuracion) {
				var papel = [612, 792];
				if (configuracion.usar) {
					if (configuracion.tamanoPapelCierreCaja.nombre_corto == $scope.diccionario.FACT_PAPEL_OFICIO) {
						papel = [612, 936];
						$scope.imprimirReporteCierreCajaCartaOficio(papel, cierre, ventas, ventasCredito, pagos);
					} else if (configuracion.tamanoPapelCierreCaja.nombre_corto == $scope.diccionario.FACT_PAPEL_CARTA) {
						papel = [612, 792];
						$scope.imprimirReporteCierreCajaCartaOficio(papel, cierre, ventas, ventasCredito, pagos);
					} else if (configuracion.tamanoPapelCierreCaja.nombre_corto == $scope.diccionario.FACT_PAPEL_MEDIOOFICIO) {
						papel = [612, 468];
						$scope.imprimirReporteCierreCajaCartaOficio(papel, cierre, ventas, ventasCredito, pagos);
					} else if (configuracion.tamanoPapelCierreCaja.nombre_corto == $scope.diccionario.FACT_PAPEL_ROLLO) {
						var alto, totalItems = ventas.length + ventasCredito.length + pagos.length;
						if (totalItems <= 2) {
							alto = 310;
						} else {
							alto = 310 + (20 * (totalItems - 2))
						}
						papel = [227, alto];
						$scope.imprimirReporteCierreCajaRollo(papel, cierre, ventas, ventasCredito, pagos);
					}
				} else {
					var alto, totalItems = ventas.length + ventasCredito.length + pagos.length;
					if (totalItems <= 2) {
						alto = 310;
					} else {
						alto = 310 + (20 * (totalItems - 2))
					}
					papel = [227, alto];
					$scope.imprimirReporteCierreCajaRollo(papel, cierre, ventas, ventasCredito, pagos);
				}
			});
		}
		$scope.trueDetalle = true;
		$scope.verDetalle = function () {
			if ($scope.trueDetalle) {
				$scope.trueDetalle = false;
			} else {
				$scope.trueDetalle = true;
			}

		}
		$scope.imprimirFiltroCajaCartaOficio = function (ventas, fechaInicio, fechaFin) {
			var doc = new PDFDocument({ compress: false, size: [612, 792], margin: 0 });
			var stream = doc.pipe(blobStream());
			var itemsPorPagina = 20;
			if ($scope.trueDetalle) {
				var c = ventas.length * 2;
				for (var i = 0; i < ventas.length; i++) {
					c = c + ventas[i].detallesVenta.length;
				}
				var totalPaginas = Math.ceil(c / (itemsPorPagina));
			} else {
				var itemsPorPagina = 20;
				var totalPaginas = Math.ceil(ventas.length / itemsPorPagina);
			}
			var y = 100, items = 0, pagina = 1;
			$scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, ventas, fechaInicio, fechaFin);

			doc.font('Helvetica', 7);

			for (var i = 0; i < ventas.length; i++) {
				doc.font('Helvetica', 7);
				doc.rect(50, y + 9, 520, 0).stroke();

				doc.text(i + 1, 55, y + 20);
				doc.font('Helvetica', 6);
				doc.text(ventas[i].movimiento.clase.nombre, 65, y + 20);
				doc.text(ventas[i].almacen.sucursal.nombre, 120, y + 20, { width: 60 });
				if (ventas[i].cliente) {
					doc.font('Helvetica', 6);
					doc.text(ventas[i].cliente.razon_social, 170, y + 15, { width: 75 });
					doc.font('Helvetica', 7);
					doc.text(ventas[i].cliente.nit, 245, y + 20);
				} else {
					doc.text("", 205, y + 16, { width: 75 });
					doc.text("", 265, y + 20);
				}
				doc.text(ventas[i].factura, 305, y + 20);
				ventas[i].fecha = new Date(ventas[i].fecha);
				doc.text(ventas[i].fecha.getDate() + "/" + (ventas[i].fecha.getMonth() + 1) + "/" + ventas[i].fecha.getFullYear(), 345, y + 20);
				doc.text(ventas[i].fecha.getHours() + ":" + ventas[i].fecha.getMinutes() + " - ", 385, y + 13, { width: 28 });
				doc.text(ventas[i].fecha.getDate() + "/" + (ventas[i].fecha.getMonth() + 1) + "/" + ventas[i].fecha.getFullYear(), 385, y + 21, { width: 32 });
				doc.text(ventas[i].total, 425, y + 20);
				if (ventas[i].tipoPago) {
					doc.text(ventas[i].tipoPago.nombre, 455, y + 20);
					if (ventas[i].tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
						doc.font('Helvetica', 6);
						doc.text("Plazo: " + ventas[i].dias_credito + " A cuenta: Bs " + ventas[i].a_cuenta + " Saldo: Bs " + ventas[i].saldo, 510, y + 16, { width: 55 });
					}
				} else {
					doc.text("", 455, y + 20);
					doc.text("", 520, y + 16, { width: 65 });
				}

				if ($scope.trueDetalle) {
					doc.rect(50, y + 34, 520, 0).stroke();
					doc.font('Helvetica', 7);
					y = y + 50;

					doc.text("N°", 105, y);
					doc.text("Nombre", 115, y);
					doc.text("Codigo Item", 170, y);
					doc.text("Unidad de Med", 230, y);
					doc.text("Cantidad", 295, y);
					doc.text("Importe", 355, y);
					items++;
					for (var j = 0; j < ventas[i].detallesVenta.length; j++) {
						doc.font('Helvetica', 7);

						doc.text(j + 1, 105, y + 20);
						doc.text(ventas[i].detallesVenta[j].producto.nombre, 115, y + 20, { width: 55 });
						doc.text(ventas[i].detallesVenta[j].producto.id, 170, y + 20);
						doc.text(ventas[i].detallesVenta[j].producto.unidad_medida, 230, y + 20);
						doc.text(ventas[i].detallesVenta[j].cantidad, 295, y + 20);
						doc.text(ventas[i].detallesVenta[j].importe, 355, y + 20);

						y = y + 24
						items++;
						if (items + 1 > itemsPorPagina - 1) {
							y = y + 10;

							doc.text(pagina + " de " + totalPaginas, 520, 705);
							var currentDate = new Date();
							doc.text("FECHA : " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 55, 705);
							doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 150, 705);

							doc.addPage({ size: [612, 792], margin: 10 });
							y = 100;
							items = 0;
							pagina = pagina + 1;
							$scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, ventas, fechaInicio, fechaFin);
						}
					}

					doc.font('Helvetica', 7);
					y = y + 4;
					items++;

					if (items > itemsPorPagina) {
						y = y + 10;
						doc.text(pagina + " de " + totalPaginas, 520, 705);
						var currentDate = new Date();
						//doc.rect(50,y+6,520,0).stroke();
						doc.text("FECHA : " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 55, 705);
						doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 150, 705);

						doc.addPage({ size: [612, 792], margin: 10 });
						y = 100;
						items = 0;
						pagina = pagina + 1;
						$scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, ventas, fechaInicio, fechaFin);
					}
				} else {

					doc.font('Helvetica', 7);
					y = y + 30;
					items++;

					if (items == itemsPorPagina) {
						doc.text(pagina + " de " + totalPaginas, 520, 705);
						var currentDate = new Date();
						doc.text("FECHA : " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 55, 705);
						doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 150, 705);

						doc.addPage({ size: [612, 792], margin: 10 });
						y = 100;
						items = 0;
						pagina = pagina + 1;
						$scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, ventas, fechaInicio, fechaFin);
					}

				}
			}
			doc.font('Helvetica', 7);
			doc.text(pagina + " de " + totalPaginas, 520, 705);
			var currentDate = new Date();
			doc.text("FECHA : " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 55, 705);
			doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 150, 705);
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}
		$scope.imprimirCabeceraFiltroCajaCartaOficio = function (doc, pagina, totalPaginas, ventas, fechaInicio, fechaFin) {

			doc.font('Helvetica-Bold', 16);
			doc.text('REPORTE', 0, 40, { align: 'center' });
			doc.font('Helvetica-Bold', 8);
			doc.rect(50, 80, 520, 620).stroke();

			doc.text("Desde: " + fechaInicio + " Hasta: " + fechaFin, 0, 55, { align: 'center' });

			var filtrod = [$scope.razon_sociald, $scope.nitd, $scope.montod, $scope.usuariod, $scope.transacciond, $scope.sucursald, $scope.tipoPagod];
			var x = 85, c = 0, cadena = "";
			doc.text("Filtro: ", 55, 65);
			for (var i = 0; i < filtrod.length; i++) {
				if (filtrod[i] != 0 && filtrod[i] != undefined) {
					//doc.text(filtrod[i]+", ",x,65);
					cadena = cadena + filtrod[i] + ", ";
					x = x + 65;

				} else {
					c = c + 1;
					if (c == 7) doc.text("GENERAL", 85, 65);
				}
			}

			doc.text(cadena, 85, 65);
			doc.font('Helvetica-Bold', 7);
			//doc.rect(50,80,520,25).stroke();


			doc.font('Helvetica-Bold', 8);

			doc.text("N°", 55, 90);
			doc.text("Transaccion", 65, 90);
			doc.text("Sucursal", 120, 90, { width: 43 });
			doc.text("Razon Social", 170, 90);
			doc.text("Nit Cliente", 245, 90, { width: 43 });
			doc.text("Fac.", 305, 90);
			doc.text("Fecha-Fact.", 345, 90 - 4, { width: 43 });
			doc.text("Hora-Fecha", 385, 90 - 4, { width: 43 });
			doc.text("Monto", 420, 90);
			doc.text("Tipo de Pago", 455, 90);
			doc.text("Pago", 520, 90);
		}
		$scope.imprimirFiltroExcelCajaCartaOficio = function (ventas) {
			blockUI.start();

			var data = [["N°", "Tipo de Transaccion", "Sucursal", "Razon Social", "N° DE LA FACTURA", "Nit Cliente", "Fac.", "Fecha-Fact.", "Hora-Fecha", "Monto", "Tipo de Pago", "Pago", "Sucursal dest"]]
			/*var sumaImporte=0,sumaImporteNo=0,sumaTotal=0,sumaDescuentos=0,sumaImporteBase=0,sumaCredito=0;*/
			for (var i = 0; i < ventas.length; i++) {
				var columns = [];
				ventas[i].fecha = new Date(ventas[i].fecha);
				columns.push(i + 1);
				columns.push(ventas[i].movimiento.clase.nombre);
				columns.push(ventas[i].almacen.sucursal.nombre);
				if (ventas[i].cliente) {
					columns.push(ventas[i].cliente.razon_social);
					columns.push(ventas[i].factura);
					columns.push(ventas[i].cliente.nit);
				} else {
					columns.push("");
					columns.push(ventas[i].factura);
					columns.push("");
				}
				columns.push(ventas[i].factura);
				columns.push(ventas[i].fecha);
				columns.push(ventas[i].fecha);
				columns.push(ventas[i].total);
				if (ventas[i].tipoPago) {
					columns.push(ventas[i].tipoPago.nombre);

					if (ventas[i].tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
						columns.push("Plazo: " + ventas[i].dias_credito + " A cuenta: Bs " + ventas[i].a_cuenta + " Saldo: Bs " + ventas[i].saldo);
					}
				} else {
					columns.push("");
				}
				if (ventas[i].movimiento.clase.nombre == "TRASPASO") {
					columns.push("");

					columns.push(ventas[i].almacenTraspaso.sucursal.nombre);
				}

				data.push(columns);
				if ($scope.trueDetalle) {
					data.push(["", "", "", "", "N°", "Nombre", "Codigo Item", "Unidad de Med", "Cantidad", "Importe"]);
					for (var j = 0; j < ventas[i].detallesVenta.length; j++) {
						columns = [];
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push(j + 1);
						columns.push(ventas[i].detallesVenta[j].producto.nombre);
						columns.push(ventas[i].detallesVenta[j].producto.id);
						columns.push(ventas[i].detallesVenta[j].producto.unidad_medida);
						columns.push(ventas[i].detallesVenta[j].cantidad);
						columns.push(ventas[i].detallesVenta[j].importe);

						data.push(columns);
					}
				}
				if (i + 1 == ventas.length) {
					columns = [];
					columns.push("");
					columns.push("");
					columns.push("");
					columns.push("");
					columns.push("");
					columns.push("");
					columns.push("");
					columns.push("");
					columns.push("");
					columns.push("");
					columns.push("TOTALES");

					data.push(columns);
				}

			}

			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "Reporte-ventas.xlsx");
			blockUI.stop();

		}


		$scope.imprimirReporteCierreCajaCartaOficio = function (papel, cierre, ventas, ventasCredito, pagos) {
			var doc = new PDFDocument({ compress: false, size: papel, margin: 0 });
			var stream = doc.pipe(blobStream());
			doc.font('Helvetica-Bold', 15);
			doc.text("CIERRE DE CAJA", 55, 50);
			doc.font('Helvetica-Bold', 8);
			doc.text("SALDO INICIAL: ", 55, 80);
			doc.text(cierre.saldo_inicial, 350, 80);
			doc.font('Helvetica-Bold', 8);
			doc.text("VENTAS AL CONTADO: ", 55, 100);
			doc.font('Helvetica', 8);
			var y = 100, suma = 0, sumaPago = 0;
			for (var i = 0; i < ventas.length; i++) {
				doc.text("No. " + ventas[i].factura, 55, y + 20);
				doc.text(ventas[i].cliente.razon_social, 100, y + 20);
				doc.text(ventas[i].total, 300, y + 20);
				suma = suma + ventas[i].total;
				y = y + 20;
			}
			doc.font('Helvetica-Bold', 8);
			doc.text(suma, 350, 100);

			doc.font('Helvetica-Bold', 8);
			doc.text("VENTAS AL CREDITO: ", 55, y + 20);
			doc.font('Helvetica', 8);
			var creditoY = y + 20;
			y = y + 20; var sumaCredito = 0;
			for (var i = 0; i < ventasCredito.length; i++) {
				if (ventasCredito[i].pagosVenta.length > 0) {
					if (ventasCredito[i].pagosVenta[0].a_cuenta_anterior > 0) {
						doc.text("No. " + ventasCredito[i].factura, 55, y + 20);
						doc.text(ventasCredito[i].cliente.razon_social, 100, y + 20);
						doc.text(ventasCredito[i].pagosVenta[0].a_cuenta_anterior, 300, y + 20);
						sumaCredito = sumaCredito + ventasCredito[i].pagosVenta[0].a_cuenta_anterior;
						y = y + 20;
					}
				} else {
					if (ventasCredito[i].a_cuenta) {
						doc.text("No. " + ventasCredito[i].factura, 55, y + 20);
						doc.text(ventasCredito[i].cliente.razon_social, 100, y + 20);
						doc.text(ventasCredito[i].a_cuenta, 300, y + 20);
						sumaCredito = sumaCredito + ventasCredito[i].a_cuenta;
						y = y + 20;
					}
				}
			}
			doc.font('Helvetica-Bold', 8);
			doc.text(sumaCredito, 350, creditoY);
			var cobroY = y + 20;

			doc.text("COBROS REALIZADOS: ", 55, y + 20);
			doc.font('Helvetica', 8);
			y = y + 20;
			for (var i = 0; i < pagos.length; i++) {
				doc.text("No. " + pagos[i].venta.factura, 55, y + 20);
				doc.text(pagos[i].venta.cliente.razon_social, 100, y + 20);
				doc.text(pagos[i].monto_pagado, 300, y + 20);
				sumaPago = sumaPago + pagos[i].monto_pagado;
				y = y + 20;
			}
			doc.text(sumaPago, 350, cobroY);
			doc.font('Helvetica-Bold', 8);
			doc.text("GASTOS: ", 55, y + 40);
			doc.text(cierre.gastos, 350, y + 40);
			doc.text("SALDO FINAL CAJA: ", 55, y + 60);
			doc.text((Math.round((cierre.saldo_inicial + suma + sumaCredito + sumaPago - cierre.gastos) * 100) / 100), 350, y + 60);
			doc.text("---------------------------------------------                       ---------------------------------------------", 0, y + 100, { align: 'center' });
			doc.text("ENTREGUE CONFORME                                     RECIBI CONFORME", 0, y + 130, { align: 'center' });

			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		$scope.imprimirReporteCierreCajaRollo = function (papel, cierre, ventas, ventasCredito, pagos) {
			var doc = new PDFDocument({ compress: false, size: papel, margins: { top: 10, bottom: 10, left: 10, right: 20 } });
			var stream = doc.pipe(blobStream());
			doc.moveDown(2);
			doc.font('Helvetica-Bold', 8);
			doc.text("CIERRE DE CAJA", { align: 'center' });
			doc.moveDown(0.4);
			doc.font('Helvetica-Bold', 8);
			var currentY = doc.y;
			doc.text("SALDO INICIAL: ", { align: 'left', width: 100 });
			doc.text(cierre.saldo_inicial, 0, currentY, { align: 'right' });
			doc.x = 10;
			doc.moveDown(0.8);
			doc.font('Helvetica-Bold', 8);
			var yContado = doc.y;
			doc.text("VENTAS AL CONTADO: ", { align: 'left' });
			doc.font('Helvetica', 8);
			doc.moveDown(0.4);
			var y = doc.y, suma = 0, sumaPago = 0;
			for (var i = 0; i < ventas.length; i++) {
				doc.text("No. " + ventas[i].factura, 20, y);
				doc.text(ventas[i].cliente.razon_social, 60, y, { width: 90 });
				doc.text(ventas[i].total, 150, y);
				suma = suma + ventas[i].total;
				y = y + 20;
			}
			doc.font('Helvetica-Bold', 8);
			doc.text(suma, 0, yContado, { align: 'right' });
			doc.y = y;
			doc.moveDown(0.4);
			doc.x = 10;
			doc.font('Helvetica-Bold', 8);
			var creditoY = doc.y;
			doc.text("VENTAS AL CREDITO: ", { align: 'left' });
			doc.font('Helvetica', 8);
			doc.moveDown(0.4);
			y = doc.y; var sumaCredito = 0;
			for (var i = 0; i < ventasCredito.length; i++) {
				if (ventasCredito[i].pagosVenta.length > 0) {
					if (ventasCredito[i].pagosVenta[0].a_cuenta_anterior > 0) {
						doc.text("No. " + ventasCredito[i].factura, 20, y);
						doc.text(ventasCredito[i].cliente.razon_social, 60, y, { width: 90 });
						doc.text(ventasCredito[i].pagosVenta[0].a_cuenta_anterior, 150, y);
						sumaCredito = sumaCredito + ventasCredito[i].pagosVenta[0].a_cuenta_anterior;
						y = y + 20;
					}
				} else {
					if (ventasCredito[i].a_cuenta) {
						doc.text("No. " + ventasCredito[i].factura, 20, y);
						doc.text(ventasCredito[i].cliente.razon_social, 60, y, { width: 90 });
						doc.text(ventasCredito[i].a_cuenta, 150, y);
						sumaCredito = sumaCredito + ventasCredito[i].a_cuenta;
						y = y + 20;
					}
				}
			}
			doc.font('Helvetica-Bold', 8);
			doc.text(sumaCredito, 0, creditoY, { align: 'right' });
			doc.y = y;
			doc.moveDown(0.4);
			doc.x = 10;
			var cobroY = doc.y;
			doc.text("COBROS REALIZADOS: ", { align: 'left' });
			doc.font('Helvetica', 8);
			doc.moveDown(0.4);
			y = doc.y;
			for (var i = 0; i < pagos.length; i++) {
				doc.text("No. " + pagos[i].venta.factura, 20, y);
				doc.text(pagos[i].venta.cliente.razon_social, 60, y, { width: 90 });
				doc.text(pagos[i].monto_pagado, 150, y);
				sumaPago = sumaPago + pagos[i].monto_pagado;
				y = y + 20;
			}
			doc.font('Helvetica-Bold', 8);
			doc.text(sumaPago, 0, cobroY, { align: 'right' });
			doc.y = y;
			doc.moveDown(0.4);
			doc.x = 10;
			doc.font('Helvetica-Bold', 8);
			currentY = doc.y;
			doc.text("GASTOS: ", { align: 'left' });
			doc.text(cierre.gastos, 0, currentY, { align: 'right' });
			doc.x = 10;
			doc.moveDown(0.4);
			currentY = doc.y;
			doc.text("SALDO FINAL CAJA: ", { align: 'left' });
			doc.text((Math.round((cierre.saldo_inicial + suma + sumaCredito + sumaPago - cierre.gastos) * 100) / 100), 0, currentY, { align: 'right' });
			doc.x = 10;
			doc.text("-----------------------------      -----------------------------", 0, y + 100, { align: 'center' });
			doc.text("ENTREGUE CONFORME   RECIBI CONFORME", { align: 'center' });

			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		$scope.sumarMonto = function () {
			var suma = 0;
			for (var i = 0; i < $scope.ventas.length; i++) {
				if (($scope.ventas[i].movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ||
					$scope.ventas[i].movimiento.clase.nombre_corto == $scope.diccionario.EGRE_PROFORMA) && $scope.ventas[i].activa) {
					suma = suma + $scope.ventas[i].total;
				}
			}
			return Math.round(suma * 100) / 100;
		}

		$scope.crearNuevaVenta = function (venta) {
			//console.log("venta ressss =========== ", venta);

			$scope.blockerVenta = true
			$scope.venta = new Venta({
				id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, cliente: {},
				detallesVenta: [], detallesVentaNoConsolidadas: [], pagado: 0, cambio: 0, despachado: false, vendedor: null
			});
			var al = 0;
			if (venta == undefined) {
				$scope.venta.sucursal = $scope.sucursales.length == 1 ? $scope.sucursales[0] : null;
			} else {
				$scope.venta.sucursal = venta.sucursal;
				al = venta.almacen;
			}

			if ($scope.venta.sucursal) {
				$scope.obtenerAlmacenesActividades($scope.venta.sucursal.id);
				if (al.id) {
					$scope.venta.almacen = al;
				}
			}
			$scope.venta.movimiento = $scope.movimientosEgreso[0];
			// $scope.venta.sucursal =  $scope.sucursales[0];
			$scope.obtenerTipoEgreso($scope.venta.movimiento);
			var fechaActual = new Date();
			$scope.venta.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
			$scope.venta.tipoPago = $scope.tiposPago[0];
			$scope.cambiarTipoPago($scope.venta);
			$scope.editar_precio = false;
			$scope.detalleVenta = { producto: { activar_inventario: true }, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
			$scope.abrirPopup($scope.idModalWizardCompraEdicion);
			angular.element($window).unbind("keydown");
			angular.element($window).bind("keydown", function (e) {
				if (e.keyCode == 115) {
					$scope.venderProformaDirectoNormal($scope.venta);
				}
			});
			$scope.enfocar('nit');
		}


		$scope.venderProformaDirectoNormal = function (venta) {
			//console.log("venta.sucursal.id ==", venta.sucursal.id);
			if (venta.detallesVenta.length > 0) {
				var promesa = ClientesNit($scope.usuario.id_empresa, 0);
				promesa.then(function (results) {
					if (results.length == 1 || results.length > 1) {
						$scope.establecerCliente(results[0]);
					} else {
						$scope.venta.cliente.razon_social = null;
					}
					venta.movimiento = $.grep($scope.movimientosEgreso, function (e) { return e.nombre_corto == $scope.diccionario.EGRE_PROFORMA; })[0];
					venta.tipoPago = $.grep($scope.tiposPago, function (e) { return e.nombre == $scope.diccionario.TIPO_PAGO_CONTADO; })[0];
					$scope.obtenerTipoEgreso(venta.movimiento);
					$scope.cambiarTipoPago(venta);
					var fechaActual = new Date();
					venta.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
					fecha = fechaActual;
					venta.pagado = venta.total;
					venta.cambio = 0;
					$scope.usuario.empresa.usar_vencimientos = false;
					//console.log("la ventaaa directo ======== ", venta);
					$scope.guardarVenta(true, venta);
					$scope.venta.sucursal = venta.sucursal;
				});

			} else {
				$scope.$apply(function () {
					$scope.message = "¡Debe agregar al menos un producto para realizar la transacción!";
					$scope.mostrarMensaje($scope.message);
				});
			}

			// $scope.venta.sucursal = venta.sucursal.id;

		}

		$scope.verVenta = function (venta) {
			$scope.venta = venta;
			$scope.abrirPopup($scope.idModalWizardVentaVista);
		}

		$scope.cerrarPopupVista = function () {
			$scope.cerrarPopup($scope.idModalWizardVentaVista);
		}

		$scope.cerrarPopupEdicion = function () {
			$scope.ocultarMensajesValidacion();
			//$scope.recargarItemsTabla();
			$scope.cerrarPopup($scope.idModalWizardCompraEdicion);
		}

		$scope.calcularCambio = function () {
			if ($scope.esContado) {
				$scope.venta.cambio = Math.round(($scope.venta.pagado - $scope.venta.total) * 100) / 100;
				$scope.pagoMinimo = $scope.venta.total;
			} else {
				$scope.venta.cambio = 0;
				$scope.pagoMinimo = 0;
			}
		}

		$scope.mostrarDescuentos = function () {
			var style = $(".des-datos").css("display");
			if (style == "none") {
				$(".des-datos").css("display", "");
			} else {
				$(".des-datos").css("display", "none");
			}
		}

		$scope.imprimirVenta = function (venta) {
			var promesa = DatosVenta(venta.id, $scope.usuario.id_empresa);
			promesa.then(function (datos) {
				var ventaConsultada = datos.venta;
				ventaConsultada.configuracion = datos.configuracion;
				ventaConsultada.sucursal = datos.sucursal;
				ventaConsultada.numero_literal = datos.numero_literal;
				ventaConsultada.pieFactura = datos.pieFactura;
				ventaConsultada.sucursalDestino = datos.sucursalDestino;
				
				var fecha = new Date(ventaConsultada.fecha);
				ventaConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
						
				ImprimirSalida(ventaConsultada.movimiento.clase.nombre_corto, ventaConsultada, false, $scope.usuario, false,$scope.formatosFactura);
	
			});
		}

		$scope.modificarPrecio = function () {
			$scope.editar_precio = true;
		}

		$scope.establecerPrecio = function () {
			$scope.editar_precio = false;
		}

		$scope.obtenerFormatoFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("FORM_IMP_FAC");
			promesa.then(function (entidad) {
				$scope.formatosFactura = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.guardarVenta = function (valido, venta) {
			if (valido) {
				$scope.ocultarMensajesValidacion();
				var tiempoActual = new Date();
				venta.fecha = new Date($scope.convertirFecha(venta.fechaTexto));
				venta.fecha.setHours(tiempoActual.getHours());
				venta.fecha.setMinutes(tiempoActual.getMinutes());
				venta.fecha.setSeconds(tiempoActual.getSeconds())
				//venta.receptor=(venta.receptor!=undefined && venta.receptor!=null)?venta.receptor:((venta.receptor==undefined || venta.receptor==null)?(venta.textoVendedor!=""?{nombre_completo:venta.textoVendedor}:null):venta.receptor);
				blockUI.start();
				if (venta.id) {
					Venta.update({ idCompra: compra.id }, compra, function (res) {
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
						$scope.mostrarMensaje('Actualizado Exitosamente!');
						$scope.recargarItemsTabla();
					});
				} else {
					var movimiento = venta.movimiento.nombre_corto;
					venta.usar_peps = $scope.usuario.empresa.usar_peps;
					venta.$save(function (res) {
						if (res.hasError) {
							blockUI.stop();
							$scope.crearNuevaVenta(res);
							$scope.mostrarMensaje(res.message);
						} else {
							blockUI.stop();
							$scope.cerrarPopPupEdicion();
							if ($scope.usuario.empresa.usar_vencimientos) {
								$scope.impresion = {
									movimiento: movimiento,
									res: res,
									al_guardar: true,
									usuario: $scope.usuario
								}
								$scope.abrirPopup($scope.idModalImpresionVencimiento);
								//ImprimirSalida(movimiento, res, true, $scope.usuario);
							} else {
								ImprimirSalida(movimiento, res, true, $scope.usuario, false);
							}
							$scope.crearNuevaVenta(res);
							$scope.mostrarMensaje('Venta registrada exitosamente!');
						}
					}, function (error) {
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
						$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
						$scope.recargarItemsTabla();
					});
				}
			}
		}

		$scope.imprimirConVencimiento = function () {
			$scope.impresion.res.con_vencimiento = true;
			ImprimirSalida($scope.impresion.movimiento, $scope.impresion.res, $scope.impresion.al_guardar, $scope.impresion.usuario, false);
			$scope.cerrarPopup($scope.idModalImpresionVencimiento);
		}

		$scope.imprimirSinVencimiento = function () {
			$scope.impresion.res.con_vencimiento = false;
			ImprimirSalida($scope.impresion.movimiento, $scope.impresion.res, $scope.impresion.al_guardar, $scope.impresion.usuario, false);
			$scope.cerrarPopup($scope.idModalImpresionVencimiento);
		}

		$scope.imprimirVentaConVencimiento = function (venta) {
			var promesa = DatosVenta(venta.id, $scope.usuario.id_empresa);
			promesa.then(function (datos) {
				var ventaConsultada = datos.venta;
				ventaConsultada.con_vencimiento = true;
				ventaConsultada.configuracion = datos.configuracion;
				ventaConsultada.sucursal = datos.sucursal;
				ventaConsultada.numero_literal = datos.numero_literal;
				ventaConsultada.pieFactura = datos.pieFactura;
				ventaConsultada.sucursalDestino = datos.sucursalDestino;
				var fecha = new Date(ventaConsultada.fecha);
				ventaConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
				ImprimirSalida(ventaConsultada.movimiento.clase.nombre_corto, ventaConsultada, false, $scope.usuario, false);
			});
		}

		$scope.cerrarPopPupEdicion = function () {
			$scope.cerrarPopup($scope.idModalWizardCompraEdicion);
		}

		$scope.buscarNit = function (evento, nit) {
			if (evento.which === 13) {
				var promesa = ClientesNit($scope.usuario.id_empresa, nit);
				promesa.then(function (results) {
					if (results.length == 1 || results.length > 1) {
						$scope.establecerCliente(results[0]);
						$scope.interceptarTecla(evento, "razon_socialP", true);
						$scope.interceptarTecla(evento, "razon_socialP1", true);
					} else {
						$scope.venta.cliente.razon_social = null;
						$scope.interceptarTecla(evento, "razon_socialP", true);
						$scope.interceptarTecla(evento, "razon_socialP1", true);
					}
				});
			}
			$scope.capturarInteraccion();
		}

		$scope.capturarInteraccion = function () {
			if ($scope.usuario.empresa.usar_pantalla_cliente) {
				socket.emit('comenzarVenta', $scope.venta);
			}
		}

		$scope.abrirPopupPanel = function (sucursal, almacen, actividad, tipoPago, movimiento) {

			$scope.venta = new Venta({
				id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, cliente: {},
				detallesVenta: [], detallesVentaNoConsolidadas: [], despachado: false,
				sucursal: sucursal, almacen: almacen, actividad: actividad, tipoPago: tipoPago, movimiento: movimiento, vendedor: null
			});
			$scope.obtenerGruposProductoEmpresa();
			if (!sucursal) {
				$scope.venta.sucursal =/*$scope.sucursales.length==1?*/$scope.sucursales[0]/*:null*/;
			}
			if ($scope.venta.sucursal) {
				if ($scope.venta.almacen == null) {
					$scope.obtenerAlmacenesActividades($scope.venta.sucursal.id);
				}
			}
			if (!movimiento) {
				$scope.venta.movimiento = $scope.movimientosEgreso[0];
			}
			$scope.obtenerTipoEgreso($scope.venta.movimiento);
			if (!tipoPago) {
				$scope.venta.tipoPago = $scope.tiposPago[0];
			}
			$scope.cambiarTipoPago($scope.venta);
			var fechaActual = new Date();
			$scope.venta.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
			$scope.abrirPopup($scope.idModalPanelVentas);
			$scope.enfocar('nitP');
			setTimeout(function () {
				aplicarDatePickers();
				$("#venta-proforma").draggable({
					cursor: "crosshair",
					start: $scope.startDragging
				});
			}, 2000);

			angular.element($window).unbind("keydown");
			angular.element($window).bind("keydown", function (e) {
				if (e.keyCode == 115) {
					$scope.venderProformaDirecto($scope.venta, false);
				}

				if (e.keyCode == 113) {
					$scope.venderProformaDirecto($scope.venta, true);
				}

				// ========= para la tecla F10 del panel ventas ============ 
				if (e.keyCode == 121) {
					e.preventDefault();
					// $scope.abrirPopPupVentasCobro();

					if ($scope.venta.detallesVenta.length > 0) {
						// $scope.abrirPopup($scope.idModalConfirmacionEliminacionVenta);
						var fechaActual = new Date();
						$scope.horaActual = fechaActual.getHours() + ":" + fechaActual.getMinutes() + ":" + fechaActual.getSeconds();
						$scope.abrirPopup($scope.idModalPanelVentasCobro);
						$scope.enfocar('nitP1');
						var select = $('#movimiento').val('24');
						angular.element(select).triggerHandler('change');
						angular.element($('#pagadoP').val($scope.venta.total)).triggerHandler('change');

						$("form").bind("keydown", function (e) {
							if (e.keyCode === 13) return false;
						});


					} else {
						$scope.mostrarMensaje("¡Debe agregar al menos un producto para realizar la transacción!");
					}

				}
				// ========= para la tecla F10 fin ============ 
			});
		}

		$scope.capturarPago = function (keyEvent, formularioVentaPanel, venta) {
			//console.log('llego a cobroooooo 11111');

			if (keyEvent.keyCode == 13) {
				//console.log('llego a cobroooooo 22222222222');
				$scope.guardarVentaPanel(formularioVentaPanel, venta, false);
				$scope.cerrarPopPupVentasCobro();
			}

		}


		$scope.abrirPopPupVentasCobro = function () {
			if ($scope.venta.detallesVenta.length > 0) {
				var fechaActual = new Date();
				$scope.horaActual = fechaActual.getHours() + ":" + fechaActual.getMinutes() + ":" + fechaActual.getSeconds();
				$scope.abrirPopup($scope.idModalPanelVentasCobro);
				$scope.enfocar('nitP1');

				angular.element(select).triggerHandler('change');
				angular.element($('#pagadoP').val($scope.venta.total)).triggerHandler('change');

				$("form").bind("keydown", function (e) {
					if (e.keyCode === 13) return false;
				});
			} else {
				$scope.mostrarMensaje("¡Debe agregar al menos un producto para realizar la transacción!");
			}
		}

		$scope.cerrarPopPupVentasCobro = function () {
			$scope.cerrarPopup($scope.idModalPanelVentasCobro);
		}

		$scope.cerrarPopupPanel = function () {
			$scope.cerrarPopup($scope.idModalPanelVentas);
			$scope.recargarItemsTabla();
			if ($scope.usuario.empresa.usar_pantalla_cliente) {
				socket.emit('terminarVenta', $scope.venta.sucursal);
			}
			angular.element($window).unbind("keydown");
		}

		$scope.clasificarGrupo = function (grupo) {
			$scope.productosProcesados = $filter('filter')($scope.productos, grupo);
			setTimeout(function () {
				aplicarSwiper(4, 3, true, 2);
			}, 5);
		}

		$scope.cargarProductos = function () {
			var promesa = ProductosPanel($scope.usuario.id_empresa, $scope.venta.almacen.id, $scope.usuario.id);
			promesa.then(function (productos) {
				for (var i = 0; i < productos.length; i++) {
					if (productos[i].activar_inventario) {
						productos[i].inventario_disponible = $scope.obtenerInventarioTotal(productos[i]);
					}
				}
				$scope.productos = productos;

				// ======= save localstorage ====
				if (angular.isDefined($localStorage.productosProcesados)) {

					// ===== conbinar array productos con storage ====
					$scope.productosProcesados = productos;

					for (var i = 0; i < $localStorage.productosProcesados.length; i++) {
						for (var j = 0; j < $scope.productosProcesados.length; j++) {
							if ($localStorage.productosProcesados[i].id == $scope.productosProcesados[j].id) {
								$scope.productosProcesados[j].rankin = $localStorage.productosProcesados[i].rankin;
							}
						}
					}



				} else {
					$scope.productosProcesados = productos;
				}
				// ===== Fin save localstorage ====

				setTimeout(function () {
					aplicarSwiper(4, 3, true, 2);
				}, 1000);
			});
		}

		$scope.textorder = 'A<- ->Z';
		$scope.ordenarProductos = function (orden) {
			//console.log(orden);
			$scope.productosProcesados = $filter('orderBy')($scope.productos, ['nombre'], orden);
			$scope.ordenProductos = !orden;
			// ====  para agregar el texto de orden el sistema ====
			if (orden) {
				$scope.textorder = 'A<- ->Z';
			} else {
				$scope.textorder = "Z<- ->A";
			}
			// ==== fin ==============
			setTimeout(function () {
				aplicarSwiper(4, 3, true, 2);
			}, 5);
		}

		$scope.filtrarProductos = function (busqueda) {
			$scope.productosProcesados = $filter('filter')($scope.productos, busqueda);
			setTimeout(function () {
				aplicarSwiper(4, 3, true, 2);
			}, 5);
		}

		// == condicion save localstorage ====
		if (angular.isDefined($localStorage.color)) {
			$scope.color = $localStorage.color;
		} else {
			$localStorage.color = { 'style': 'red-style', 'stylebutton': 'red-style-button' };
			$scope.color = { 'style': 'red-style', 'stylebutton': 'red-style-button' };
		}
		// ==== fin save condicion

		$scope.cambiarColor = function (color, buttonColor) {
			// == save localstorage ====
			$localStorage.color = { 'style': color, 'stylebutton': buttonColor };
			// ==== fin ======

			$('#dialog-panel-ventas .widget-main').removeClass('red-style green-style skyblue-style brown-style');
			$('#dialog-panel-ventas .widget-main').addClass(color);

			$('#dialog-panel-ventas .widget-main .button-style').removeClass('red-style-button green-style-button skyblue-style-button brown-style-button');
			$('#dialog-panel-ventas .widget-main .button-style').addClass(buttonColor);
		}

		$scope.showHideFirstRow = function () {

			if ($(".first-row").css("display") == "none") {
				$('.first-row').show("slow");
			} else {
				$(".first-row").hide(1000);
			}
		}

		$scope.dragged = false;
		$scope.proformaClick = function (venta) {
			if (!$scope.dragged) {
				$scope.venderProformaDirecto(venta, false);
			}

			$scope.dragged = false;
		};

		$scope.startDragging = function () {
			$scope.dragged = true;
		};

		$scope.venderProformaDirecto = function (venta, llevar) {
			if (venta.detallesVenta.length > 0) {
				var promesa = ClientesNit($scope.usuario.id_empresa, 0);
				promesa.then(function (results) {
					if (results.length == 1 || results.length > 1) {
						$scope.establecerCliente(results[0]);
					} else {
						$scope.venta.cliente.razon_social = null;
					}
					venta.movimiento = $.grep($scope.movimientosEgreso, function (e) { return e.nombre_corto == $scope.diccionario.EGRE_PROFORMA; })[0];
					venta.tipoPago = $.grep($scope.tiposPago, function (e) { return e.nombre == $scope.diccionario.TIPO_PAGO_CONTADO; })[0];
					$scope.obtenerTipoEgreso(venta.movimiento);
					$scope.cambiarTipoPago(venta);
					var fechaActual = new Date();
					venta.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
					fecha = fechaActual;
					venta.pagado = venta.total;
					venta.cambio = 0;
					$scope.guardarVentaPanel(true, venta, llevar);
				});
			} else {
				$scope.mostrarMensaje("¡Debe agregar al menos un producto para realizar la transacción!");
			}
		}

		$scope.calcularImporteDetalleVenta = function (detalleVenta) {
			detalleVenta.importe = Math.round((detalleVenta.cantidad * detalleVenta.precio_unitario) * 1000) / 1000;
			var descuento, recargo;
			if (detalleVenta.tipo_descuento) {
				descuento = detalleVenta.importe * (detalleVenta.descuento / 100);
			} else {
				descuento = detalleVenta.descuento;
			}
			if (detalleVenta.tipo_recargo) {
				recargo = detalleVenta.importe * (detalleVenta.recargo / 100);
			} else {
				recargo = detalleVenta.recargo;
			}
			detalleVenta.total = detalleVenta.importe - descuento + recargo - detalleVenta.ice - detalleVenta.excento;
		}

		$scope.agregarDetalleVentaPanel = function (producto) {
			//console.log("producto sssssssssss ", producto);
			//if (producto.activar_inventario) {
			var detalleVenta;
			$scope.cantidadInventario = 0;
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					$scope.cantidadInventario = $scope.cantidadInventario + producto.inventarios[i].cantidad;
				}
			}
			var j = 0, encontrado = false;
			while (j < $scope.venta.detallesVenta.length && !encontrado) {
				if (($scope.venta.detallesVenta[j].producto.id == producto.id)) {
					if (producto.activar_inventario) {
						if (($scope.venta.detallesVenta[j].cantidad + 1) <= $scope.cantidadInventario) {
							$scope.venta.detallesVenta[j].cantidad = $scope.venta.detallesVenta[j].cantidad + 1;
						} else {
							$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
						}
					} else {
						$scope.venta.detallesVenta[j].cantidad = $scope.venta.detallesVenta[j].cantidad + 1;
					}
					encontrado = true;
					detalleVenta = $scope.venta.detallesVenta[j];
				}
				j++;
			}
			if (!encontrado) {
				if (producto.activar_inventario) {
					if (1 <= $scope.cantidadInventario) {
						detalleVenta = {
							producto: producto, precio_unitario: producto.precio_unitario,
							inventario_disponible: $scope.cantidadInventario, costos: producto.inventarios,
							cantidad: 1, descuento: producto.descuento, tipo_descuento: (producto.descuento > 0 ? true : false), recargo: 0, ice: 0, excento: 0, tipo_recargo: false
						};
						$scope.venta.detallesVenta.push(detalleVenta);
						$scope.calcularImporteDetalleVenta(detalleVenta);
					} else {
						$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
					}
				} else {
					detalleVenta = {
						producto: producto, precio_unitario: producto.precio_unitario,
						inventario_disponible: $scope.cantidadInventario, costos: producto.inventarios,
						cantidad: 1, descuento: producto.descuento, tipo_descuento: (producto.descuento > 0 ? true : false), recargo: 0, ice: 0, excento: 0, tipo_recargo: false
					};
					$scope.venta.detallesVenta.push(detalleVenta);
					$scope.calcularImporteDetalleVenta(detalleVenta);
				}
			} else {
				$scope.calcularImporteDetalleVenta(detalleVenta);
			}

			$scope.sumarTotal();
			$scope.sumarTotalImporte();
			$scope.calcularSaldo();
			$scope.capturarInteraccion();
			// ========= para rankin de vendidos =====================//
			producto.rankin += 1;

			var indice = $scope.productosProcesados.indexOf(producto);
			$scope.productosProcesados[indice] = producto;

			// setTimeout(function(){
			// 	aplicarSwiper(4,3,true,2);
			// },5);
			$localStorage.productosProcesados = $scope.productosProcesados;
			//}else{
			//$scope.mostrarMensaje('¡No esta activado el inventario para este producto!');

			//}
			if (producto.activar_inventario) {
				producto.inventario_disponible = $scope.cantidadInventario - detalleVenta.cantidad;
			}

			// ===== fin rankin ============================//
		}

		$scope.disminuirDetalleVenta = function (detalleVenta) {
			var indice = $scope.productosProcesados.indexOf(detalleVenta.producto);

			if (detalleVenta.cantidad == 1) {
				$scope.eliminarDetalleVentaPanel(detalleVenta);
				// $scope.productosProcesados[indice].inventario_disponible = $scope.productosProcesados[indice].inventario_disponible + 1;
			} else {
				detalleVenta.cantidad = detalleVenta.cantidad - 1;
				$scope.productosProcesados[indice].inventario_disponible = $scope.productosProcesados[indice].inventario_disponible + 1;
				$scope.calcularImporteDetalleVenta(detalleVenta);
				$scope.sumarTotal();
				$scope.sumarTotalImporte();
				$scope.calcularSaldo();
				$scope.capturarInteraccion();
			}
		}

		$scope.guardarVentaPanel = function (valido, venta, llevar) {
			if (valido) {
				if ($scope.usuario.empresa.usar_pantalla_cliente) {
					socket.emit('terminarVenta', venta.sucursal);
				}
				$scope.ocultarMensajesValidacion();
				var tiempoActual = new Date();
				venta.fecha = new Date($scope.convertirFecha(venta.fechaTexto));
				venta.fecha.setHours(tiempoActual.getHours());
				venta.fecha.setMinutes(tiempoActual.getMinutes());
				blockUI.start();
				if (venta.id) {
					Venta.update({ idCompra: compra.id }, compra, function (res) {
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
						$scope.mostrarMensaje('Actualizado Exitosamente!');
						$scope.recargarItemsTabla();
					});
				} else {
					var movimiento = venta.movimiento.nombre_corto;
					venta.$save(function (res) {
						blockUI.stop();
						if (res.hasError) {
							blockUI.stop();
							$scope.mostrarMensaje(res.message);
							$scope.venta.almacen.id = venta.almacen.id;
							$scope.abrirPopupPanel(venta.sucursal, venta.almacen, venta.actividad, venta.tipoPago, venta.movimiento);

						} else {
							ImprimirSalida(movimiento, res, true, $scope.usuario, llevar);
							$scope.mostrarMensaje('Venta registrada exitosamente!');
							$scope.cargarProductos();
							$scope.abrirPopupPanel(venta.sucursal, venta.almacen, venta.actividad, venta.tipoPago, venta.movimiento);
							$scope.enfocar('nitP');
						}
					}, function (error) {
						blockUI.stop();
						$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					});
				}
			}
		}

		$scope.mostrarConfirmacionEliminacionVenta = function (venta) {
			$scope.venta = new Venta(venta);
			$scope.abrirPopup($scope.idModalConfirmacionEliminacionVenta);
		}

		$scope.cerrarConfirmacionEliminacionVenta = function () {
			$scope.cerrarPopup($scope.idModalConfirmacionEliminacionVenta);
		};

		$scope.eliminarVenta = function (venta) {
			blockUI.start();
			$scope.cerrarConfirmacionEliminacionVenta();
			venta.$delete();
			$scope.mostrarMensaje('Anulado exitosamente!');
			$scope.recargarItemsTabla();
			blockUI.stop();
		}

		$scope.abrirPopupInventario = function () {
			$scope.abs = $window.Math.abs;
			$scope.itemsPorPagina = 10;
			$scope.paginaActual = 1;
			$scope.columna = "nombre";
			$scope.direccion = "asc";
			$scope.cantidadInv = "0";
			$scope.textoBusqueda = "";
			if ($scope.venta.almacen) {
				$scope.almacenBusqueda = $scope.venta.almacen;
				$scope.buscarInventarios($scope.almacenBusqueda.id, $scope.paginaActual, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion, $scope.cantidadInv);
			}
			$scope.abrirPopup($scope.idModalInventario);
		}

		$scope.barcodeScanned = function (barcode) {
			// document.getElementById("inputGroup").focus();
			$scope.search = barcode;

			// $scope.cargarProductos();       
			$scope.filtrarProductos(barcode);
		};

		$scope.limpiarBusqueda = function () {
			$scope.search = "";
			$scope.filtrarProductos();
		}

		$scope.buscarInventarios = function (idAlmacen, pagina, itemsPagina, texto, columna, direccion, cantidad) {
			blockUI.start();
			$scope.itemsPorPagina = itemsPagina;
			if (texto == "" || texto == null) {
				texto = 0;
			} else {
				$scope.textoBusqueda = texto;
			}
			$scope.paginaActual = pagina;
			var promesa = InventarioPaginador($scope.usuario.id_empresa, idAlmacen, pagina, itemsPagina, texto, columna, direccion, cantidad, undefined, $scope.usuario.id);
			promesa.then(function (dato) {
				var productos = dato.productos;
				//var mproductos=[];
				for (var i = 0; i < productos.length; i++) {
					var inventarios = [], cantidadTotal = 0;
					productos[i].fecha_vencimiento = new Date(productos[i].fecha_vencimiento);
					productos[i].cantidad_total = productos[i].cantidad;
					/*mproductos.push({id:productos[i].id,descuento:productos[i].descuento,descuento_fijo:productos[i].descuento_fijo,
									nombre:productos[i].nombre,codigo:productos[i].codigo,grupo:productos[i].grupo,subgrupo:productos[i].subgrupo,
									inventarios:inventarios,cantidad_total:productos[i].cantidad,fecha_vencimiento:new Date(productos[i].fecha_vencimiento),precio_unitario:productos[i].precio_unitario,
									porcentaje:$scope.porcentaje,color:$scope.color});*/
				}
				$scope.paginas = [];
				for (var i = 1; i <= dato.paginas; i++) {
					$scope.paginas.push(i);
				}

				$scope.productos = productos;

				blockUI.stop();
			});
		}

		$scope.clasificarColumna = function (columna) {
			if ($scope.columna == columna) {
				if ($scope.direccion == "asc") {
					$scope.direccion = "desc";
					$("#" + columna + "p").removeClass("fa-caret-up");
					$("#" + columna + "p").addClass("fa-caret-down");
				} else {
					$scope.direccion = "asc";
					$("#" + columna + "p").removeClass("fa-caret-down");
					$("#" + columna + "p").addClass("fa-caret-up");
				}
			} else {
				$scope.direccion = "asc";
				$(".sort").removeClass("fa-caret-up");
				$(".sort").removeClass("fa-caret-down");
				$(".sort").addClass("fa-sort");
				$("#" + columna + "p").addClass("fa-caret-up");
				$("#" + columna + "p").removeClass("fa-sort");
			}
			$scope.columna = columna;
			$scope.buscarInventarios($scope.almacenBusqueda.id, $scope.paginaActual, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion, $scope.cantidadInv);
		}

		$scope.verificarPulso = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				$scope.textoBusqueda = textoBusqueda;
				if ($scope.almacenBusqueda) {
					$scope.buscarInventarios($scope.almacenBusqueda.id, 1, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion, $scope.cantidadInv);
				}
			}
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardCompraEdicion);
			$scope.eliminarPopup($scope.idModalWizardVentaVista);
			$scope.eliminarPopup($scope.idModalEliminarCompra);
			$scope.eliminarPopup($scope.idModalPago);
			$scope.eliminarPopup($scope.idModalCierre);
			$scope.eliminarPopup($scope.idModalPanelVentas);
			$scope.eliminarPopup($scope.idModalInventario);
			$scope.eliminarPopup($scope.idModalPanelVentasCobro);
			$scope.eliminarPopup($scope.idModalEdicionVendedor);
			$scope.eliminarPopup($scope.idModalImpresionVencimiento);
		});

		$scope.UsarLectorDeBarra = function () {
			if ($scope.usuario.usar_lector_de_barra == true) {
				$scope.usuario.usar_lector_de_barra = true
				$localStorage.usuario = JSON.stringify($scope.usuario);
				var promesa = GuardarUsuarLectorDeBarra($scope.usuario)
			} else {
				$scope.usuario.usar_lector_de_barra = false
				localStorage.usuario = JSON.stringify($scope.usuario);
				var promesa = GuardarUsuarLectorDeBarra($scope.usuario)
			}
			//console.log($scope.usuario.usar_lector_de_barra)
		}

		$scope.inicio();
	});