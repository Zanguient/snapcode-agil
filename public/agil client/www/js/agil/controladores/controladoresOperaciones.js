angular.module('agil.controladores')
	.controller('ControladorOperaciones', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage,
		blockUI, ConfiguracionVentaVistaDatos, ClasesTipo, ListaGruposProductoEmpresa, ProductosOperaciones, socket, ListaGruposProductoEmpresa, SolicitudesReposicion,
		SolicitudesFormulacionProducto, SolicitudReposicion, EliminarSolicitudReposicion, Paginator, ImpresionSolicitudDatos, ListaInventariosProducto, ListaSucursalesUsuario,
		ListaGruposProductoUsuario, CerrarSolicitud, Solicitud, ProveedoresNit, ListaProductosEmpresaUsuario, $timeout, GuardarPedido, ListaProveedores,
		ProductosPaginadorSubgrupos, ListaProductosProveedores, ProductosPaginadorAsignados, ActualizarProductosProveedor, ListaSubGruposProductoEmpresa ) {

		$scope.usuarioSesion = JSON.parse($localStorage.usuario);
		convertUrlToBase64Image($scope.usuarioSesion.empresa.imagen, function (imagenEmpresa) {
			$scope.usuarioSesion.empresa.imagen = imagenEmpresa;
		});

		$scope.idDialogDialogPanelOperaciones = "dialog-panel-operaciones"
		$scope.idDialogDatos = "modal-wizard-venta-edicion"
		$scope.idDialogEntregaViveres = "dialogEntregaViveres"
		$scope.idConfirmacionCierre = "dialog-confirmacion-entrega"
		$scope.idDialogTotalIngredientes = "dialog-total-ingredientes"
		$scope.idDialogoListadoPedido = "modal-listado-nuevo-pedido"
		$scope.idDialogoNuevoPedido = "modal-nuevo-pedido"
		$scope.idDialogProductosProveedor = 'dialog-productos-proveedor-configuracion';
		$scope.idDialogBusquedaProveedor = 'dialog-Busqueda-proveedor';
		$scope.idDialogProductosAsigandosProveedor = 'dialog-productos-proveedor-asignados'

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			$timeout(function () {
				ejecutarScriptsOperaciones($scope.idDialogDialogPanelOperaciones, $scope.idDialogDatos, $scope.idDialogEntregaViveres, $scope.idConfirmacionCierre, $scope.idDialogTotalIngredientes,
					$scope.idDialogoListadoPedido, $scope.idDialogoNuevoPedido, $scope.idDialogProductosProveedor, $scope.idDialogBusquedaProveedor, $scope.idDialogProductosAsigandosProveedor);
				$scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario, $location.path().substring(1));
			}, 500)
		});

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idDialogDialogPanelOperaciones);
			$scope.eliminarPopup($scope.idDialogDatos);
			$scope.eliminarPopup($scope.idDialogEntregaViveres);
			$scope.eliminarPopup($scope.idConfirmacionCierre)
			$scope.eliminarPopup($scope.idDialogTotalIngredientes)
			$scope.eliminarPopup($scope.idDialogoListadoPedido)
			$scope.eliminarPopup($scope.idDialogoNuevoPedido)
			$scope.eliminarPopup($scope.idDialogProductosProveedor)
			$scope.eliminarPopup($scope.idDialogBusquedaProveedor)
			$scope.eliminarPopup($scope.idDialogProductosAsigandosProveedor)
		})

		$scope.inicio = function () {
			$scope.imprimir = { detalle: false }
			$scope.listaProductosProveedor = [];
			$scope.seleccionProductosProveedor = { seleccionar_todos: false };
			$scope.productosAsignadosPorveedor = { itemsPorPagina: 10, textoBusqueda: "", paginaActual: 1, paginas: [1] };
			$scope.configuracionPorveedor = { itemsPorPagina: 10, textoBusqueda: "", paginaActual: 1, paginas: [1] };
			$scope.detallesPedido = []
			$scope.mostarBusquedaProducto = false
			$scope.ordenProductos = true;
			$scope.esContado = true;
			$scope.obtenerConfiguracionVentaVista();
			$scope.alreadyCalculated = false
			$scope.sucursalesUsuario = "";
			for (var i = 0; i < $scope.usuarioSesion.sucursalesUsuario.length; i++) {
				$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuarioSesion.sucursalesUsuario[i].sucursal.id;
				if (i + 1 != $scope.usuarioSesion.sucursalesUsuario.length) {
					$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
				}
			}
			// $scope.detalleVenta = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
			// $scope.solicitud = { solicitudesProductos: [] }
			$scope.obtenerProveedores();
			$scope.obtenerProductos();
			$scope.obtenerProductosAsignados();
			$scope.obtenerPaginador()
			$scope.sucursales = $scope.obtenerSucursales();
			$scope.obtenerSubGruposProductosEmpresaUsuario()
		}

		$scope.obtenerProveedores = function () {
			var prom = ListaProveedores($scope.usuarioSesion.id_empresa);
			prom.then(function (res) {
				$scope.proveedores = res.proveedores;
				$scope.proveedoresProcesado = res.proveedores;
			}).catch(function (err) {
				$scope.proveedores = [];
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null && err.data !== "") ? err.data : 'Error: Se perdio la conexión.';
				$scope.mostrarMensaje(mensaje);
			});
		};
		$scope.filtrarProveedores = function (query) {
			if ($scope.proveedores !== undefined) {
				$scope.proveedoresProcesado = $filter('filter')($scope.proveedores, query);
			} else {
				$scope.proveedoresProcesado = [];
			}
		};

		$scope.agregarProductosSeleccionados = function () {
			if ($scope.productosProveedorSeleccionados.length > 0) {
				$scope.productosProveedorSeleccionados.forEach(function (producto, i, arr) {
					$scope.detallePedido = {
						producto: producto, precio_unitario: producto.precio_unitario,
						cantidad: 1, id_grupo: producto.id_grupo, id_subgrupo: producto.id_subgrupo
					};
					$scope.agregardetallePedido($scope.detallePedido)
					if (i === arr.length) {
						$scope.cerrarModalProductosAsignadosProveedor()
					}
				})
			} else {
				$scope.mostrarMensaje('No se seleccionó ningún producto para ser agregado.')
			}
		};

		$scope.establecerProveedor = function (proveedor, modal) {
			$scope.productosAsignadosProveedor = []
			if ($scope.pedido === undefined) {
				$scope.pedido = {};
			}
			$scope.pedido.proveedor = proveedor;
			if (modal !== undefined) {
				$scope.cerrarModalBusquedaProveedor();
			}
			if ($scope.pedido.por_proveedor) {
				$scope.generarPorProveedor()
			}
		};

		$scope.abrirModalProductosProveedor = function (pedido) {
			if ($scope.checkProveedor(pedido)) {
				$scope.buscarProductos(null, $scope.pedido);
				// $scope.obtenerProductosProveedor($scope.pedido.proveedor);
				// $scope.verificarAsignacionProductosProveedor()
				$scope.abrirPopup($scope.idDialogProductosProveedor);
			} else {
				$scope.mostrarMensaje('Seleccione un proveedor para ver su asignación de productos..');
			}
		};

		$scope.generarPorProveedor = function () {
			if ($scope.pedido.proveedor) {
				if ($scope.pedido.por_proveedor) {
					if ($scope.pedido.proveedor.productos.length > 0) {
						$scope.paginatorProductosAsignados.filter = $scope.productosAsignadosPorveedor.grupo ? $scope.productosAsignadosPorveedor.grupo : { id: 0 };
						var ids_productos_proveedor = "";

						// var promesa = ProductosPaginador($scope.usuarioSesion.id_empresa, $scope.paginatorProductosAsignados, $scope.usuarioSesion.id); //por grupos
						var prom = ListaProductosProveedores($scope.usuarioSesion.id_empresa, $scope.pedido.proveedor);
						prom.then(function (res) {
							if (res.hasErr) {
								$scope.mostrarMensaje(res.mensaje);
								$scope.listaProductosProveedor = [];
							} else {
								if (res.productos) {
									var arr = res.productos.split(',');
									$scope.listaProductosProveedor = arr.map(function (id) {
										return parseInt(id);
									});
									var promesa = ProductosPaginadorAsignados($scope.usuarioSesion.id_empresa, $scope.paginatorProductosAsignados, $scope.usuarioSesion.id, $scope.listaProductosProveedor, true); ///por subgrupos
									promesa.then(function (dato) {
										if (dato.hasErr) {
											$scope.mostrarMensaje(dato.mensaje);
										} else {
											$scope.paginatorProductosAsignados.setPages(dato.paginas);
											$scope.productosAsignadosProveedor = dato.productos;
											$scope.productosAsignadosProveedor.forEach(function (producto) {
												if ($scope.listaProductosProveedor.some(function (id) {
													return id === producto.id
												})) {
													$scope.detallePedido = {
														producto: producto, precio_unitario: producto.precio_unitario,
														cantidad: 1, id_grupo: producto.id_grupo, id_subgrupo: producto.id_subgrupo
													};
													$scope.agregardetallePedido($scope.detallePedido)
												}
											})
										}
										blockUI.stop();
									}).catch(function (err) {
										blockUI.stop();
										var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
										$scope.mostrarMensaje(memo);
									});
								} else {
									$scope.mostrarMensaje('El proveedor no tiene productos asignados.')
									$scope.listaProductosProveedor = [];
								}
							}
							blockUI.stop();
						}).catch(function (err) {
							blockUI.stop();
							var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
							$scope.mostrarMensaje(memo);
						})

					} else {
						$scope.mostrarMensaje('El proveedor no tiene productos asignados.')
					}
				} else {
					$scope.detallePedido = {}
					$scope.detallesPedido = []
				}

			} else {
				$scope.mostrarMensaje('Seleccione un proveedor.')
			}
		};

		$scope.verificarAsignacionProductosProveedor = function () {
			if ($scope.listaProductosProveedor.length > 0) {
				$scope.listaProductosProveedor.forEach(function (id) {
					$scope.productosAsignacionProveedor.forEach(function (producto) {
						if (producto.id === id) {
							producto.seleccionado = true
						}
					})
				})
			}
		}

		$scope.checkProveedor = function (pedido) {
			if ($scope.pedido) {
				if ($scope.pedido.proveedor) {
					if ($scope.pedido.proveedor.id) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		};

		$scope.buscarProveedor = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ProveedoresNit($scope.usuario.id_empresa, query);
				return promesa;
			}
		}

		// $scope.buscarProducto = function (query) {
		// 	if (query != "" && query != undefined) {
		// 		var promesa = ListaProductosEmpresaUsuario($scope.usuario.id_empresa, query, $scope.usuario.id, 0);
		// 		return promesa;
		// 	}
		// };
		$scope.buscarProducto = function (query, proveedor) {
			if ($scope.pedido === undefined) {
				$scope.mostrarMensaje('Seleccione un almacen.')
				return
			}
			if (query != "" && query != undefined && proveedor == undefined && $scope.pedido.almacen) {
				var promesa = ListaProductosEmpresaUsuario($scope.usuarioSesion.id_empresa, query, $scope.usuarioSesion.id, $scope.pedido.almacen);
				return promesa;
			} else if (query != "" && query != undefined && proveedor && $scope.pedido.almacen) {
				var promesa = ListaProductosEmpresaUsuario($scope.usuarioSesion.id_empresa, query, $scope.usuarioSesion.id, $scope.pedido.almacen);
				return promesa;
			} else {
				$scope.mostrarMensaje('Seleccione un almacen.')
			}
		};

		$scope.establecerProducto = function (producto, modelo) {
			$scope.detallePedido = {}
			producto.tipoProducto = producto['tipoProducto'] == null ? { id: producto['tipoProducto.id'], nombre: producto['tipoProducto.nombre'], nombre_corto: producto['tipoProducto.nombre_corto'] } : producto.tipoProducto;
			// var centroCostos = $scope.pedido.centroCosto;
			var inv_disponible = 0
			if (producto.inventarios.length > 0) {
				producto.inventarios.forEach(function (inventario) {
					inv_disponible += inventario.cantidad
				})
			}
			$scope.detallePedido = {
				producto: producto, precio_unitario: producto.precio_unitario,
				cantidad: 1, inventario_disponible: inv_disponible
			};
			// $scope.cerrarPopup($scope.idModalInventario);
			// $scope.enfocar('cantidad');
		}

		$scope.nuevoPedido = function () {
			$scope.detallesPedido = []
			$scope.pedido = {}
			$scope.detallePedido = {}
			$scope.abrirModalNuevoPedido()
		}

		$scope.generarPedido = function () {
			$scope.detallesPedido = []
			$scope.pedido = { generado: true }
			$scope.detallePedido = {}
			var listaproductosProcesados = $scope.calcularViveresDesdeFiltro(true)
			$scope.detallesPedido = listaproductosProcesados.map(function (detalle) {
				var inv_disponible = 0
				if (detalle.producto.inventarios.length > 0) {
					detalle.producto.inventarios.forEach(function (inventario) {
						inv_disponible += inventario.cantidad
					})
				}
				var detallePedido = {
					producto: detalle.producto, precio_unitario: detalle.producto.precio_unitario,
					cantidad: detalle.cantidad,
					solicitud: detalle.solicitud
				};
				return detallePedido
			})
			$scope.abriridDialogoListadoPedido()
		}

		// $scope.guardarPedido = function (pedido, generado) {
		// 	blockUI.start()
		// 	if (pedido !== undefined && detallesPedido) {
		// 		if (generado) {
		// 			pedido.solicitudesIds = $scope.solicitudesPedido.map(function (solicitud) {
		// 				return solicitud
		// 			})
		// 		}
		// 		var prom = GuardarPedido($scope.usuario.id_Empresa, pedido, $scope.usuarioSesion.id)
		// 		prom.then(function (res) {
		// 			if (res.hasErr) {
		// 				$scope.mostrarMensaje(res.mensaje)
		// 			} else {
		// 				$scope.mostrarMensaje(res.mensaje)
		// 				if (generado) {
		// 					$scope.cerraridDialogoListadoPedido()
		// 				} else {
		// 					$scope.cerrarModalNuevoPedido()
		// 				}
		// 			}
		// 			blockUI.stop()
		// 		}).catch(function (err) {
		// 			var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
		// 			$scope.mostrarMensaje(msg)
		// 		})
		// 	} else {
		// 		$scope.mostrarMensaje('Existe un problema con los datos del pedido, no se puede generar!')
		// 	}
		// }

		$scope.agregardetallePedido = function (producto) {
			if (producto !== undefined && producto !== null) {
				if (!$scope.detallesPedido.some(function (prod) {
					return prod.producto.id === producto.producto.id
				})) {
					$scope.detallesPedido.push(producto);
				} else {
					$scope.detallesPedido.forEach(function (prod) {
						if (prod.producto.id === producto.producto.id) {
							prod.cantidad += producto.cantidad
						}
					})
				}
				$scope.detallePedido = undefined;
			} else {
				$scope.mostrarMensaje('Ocurrió un problema, no se puede agregar un valor no definido o nulo.');
			}
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

		$scope.mostrarBusqueda = function () {
			if ($scope.mostarBusquedaProducto) {
				$scope.mostarBusquedaProducto = false
			} else {
				$scope.mostarBusquedaProducto = true
			}
		}

		$scope.obtenerSubGruposProductosEmpresaUsuario = function () {
			blockUI.start();
			// var promesa = ListaGruposProductoUsuario($scope.usuarioSesion.id_empresa, $scope.usuarioSesion.id);
			var promesa = ListaSubGruposProductoEmpresa($scope.usuarioSesion.id_empresa, $scope.usuarioSesion.id);
			promesa.then(function (grupos) {
				blockUI.stop();
				if (grupos.length > 0) {
					$scope.subGruposProducto = grupos;
				} else {
					$scope.subGruposProducto = [];
					$scope.mostrarMensaje('Parece que el usuario actual no cuenta con grupos de productos.');
				}
			}).catch(function (err) {
				$scope.subGruposProducto = [];
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null && err.data !== "") ? err.data : 'Error: Se perdio la conexión.';
				$scope.mostrarMensaje(mensaje);
				blockUI.stop();
			});
		};

		$scope.obtenerPaginador = function () {
			blockUI.start();
			$scope.paginator = Paginator();
			$scope.paginator.column = "fecha";
			$scope.paginator.direccion = "asc";
			$scope.filtro = { empresa: $scope.usuarioSesion.id_empresa, rol: $scope.usuarioSesion.rolesUsuario[0].rol.nombre, id: $scope.usuarioSesion.id, desde: 0, hasta: 0, sucursal: 0, almacen: 0, movimiento: 0, estado: 0, valuado: 0, pagina: 1, items_pagina: 10, busqueda: "" };
			$scope.paginator.callBack = $scope.obtenerSolicitudes;
			$scope.paginator.getSearch("", $scope.filtro, null);
			blockUI.stop();
		}

		$scope.obtenerSolicitudes = function () {
			blockUI.start()
			$scope.filtro.busqueda = $scope.paginator.search
			$scope.filtro.desde = ($scope.filtro.fechaInicioTexto !== undefined) ? ($scope.filtro.fechaInicioTexto !== "") ? $scope.convertirFecha($scope.filtro.fechaInicioTexto) : 0 : 0
			$scope.filtro.hasta = ($scope.filtro.fechaFinTexto !== undefined) ? ($scope.filtro.fechaFinTexto !== "") ? $scope.convertirFecha($scope.filtro.fechaFinTexto) : 0 : 0
			$scope.filtro.movimiento = 0// ($scope.filtro.movimiento !== null)?($scope.filtro.movimiento.id !==undefined)?$scope.filtro.movimiento.id:0:0
			$scope.filtro.estado = ($scope.filtro.estado !== null) ? ($scope.filtro.estado.id !== undefined) ? $scope.filtro.estado.id : 0 : 0
			$scope.paginator.filter = $scope.filtro
			var promesa = SolicitudesReposicion($scope.paginator)
			promesa.then(function (solicitudes) {
				$scope.paginator.setPages(solicitudes.paginas);
				$scope.solicitudesOperaciones = solicitudes.solicitudes
				blockUI.stop()
			}).catch(function (err) {
                blockUI.stop();
                var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
                $scope.mostrarMensaje(memo);
            })
		}

		$scope.obtenerSucursales = function () {
			var sucursales = [];
			for (var i = 0; i < $scope.usuarioSesion.sucursalesUsuario.length; i++) {
				sucursales.push($scope.usuarioSesion.sucursalesUsuario[i].sucursal);
			}
			return sucursales;
		}

		$scope.obtenerAlmacenes = function (idSucursal) {
			if (idSucursal === undefined) {
				$scope.filtro.sucursal = undefined
				$scope.almacenes = []
			}
			if (idSucursal !== undefined) {
				$scope.almacenes = [];
				var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
				$scope.almacenes = sucursal ? sucursal.almacenes : [];
				// if ($scope.solicitud.almacen) {
				// 	$scope.cargarProductos();
				// } else {
				// 	$scope.solicitud.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : $scope.solicitud.almacen ? $scope.solicitud.almacen : null;
				// 	$scope.productosProcesados = []
				// }
			}
		}

		$scope.eliminar = function (solicitud) {
			$scope.solicitud = solicitud
			var prom = EliminarSolicitudReposicion(solicitud)
			prom.then(function (res) {
				if (res.hasErr) {
					$scope.mostrarMensaje(res.mensaje)
				} else {
					$scope.recargarItemsTabla()
					$scope.solicitud = undefined
				}
				blockUI.stop()
			}).catch(function (err) {
				$scope.solicitud = undefined
				var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
				$scope.mostrarMensaje(msg)
				blockUI.stop()
			})
			// EliminarSolicitudReposicion.save({ id_solicitud: solicitud.id }, solicitud, function (res) {
			// 	if (res.hasErr) {
			// 		$scope.mostrarMensaje(res.mensaje)
			// 	} else {
			// 		$scope.recargarItemsTabla()
			// 		$scope.solicitud = undefined
			// 	}
			// 	blockUI.stop()
			// })
			// $scope.solicitud.solicitudesProductos.map(function (prod) {
			// 	var promesa = ListaInventariosProducto(prod.productoSolicitado.id, $scope.solicitud.almacen.id);
			// 	promesa.then(function (inventarios) {
			// 		prod.inventarios = inventarios
			// 		// prod.inventario_disponible_utilizado = prod.cantidad
			// 		if ($scope.solicitud.solicitudesProductos.indexOf(prod) == $scope.solicitud.solicitudesProductos.length - 1) {

			// 		}
			// 	})
			// })
			$scope.cerrarConfirmacionEliminacion();
		}

		$scope.ver = function (solicitud) {
			$scope.solicitud = solicitud
			$scope.solicitud.ver = true
			$scope.solicitud.sucursal = $scope.solicitud.almacen.sucursal
			$scope.obtenerAlmacenes($scope.solicitud.sucursal.id)
			$scope.solicitud.almacen = $scope.solicitud.almacen
			// $scope.solicitud.ingredientes = $scope.solicitud.solicitudesProductos
			// $scope.solicitud.ingredientes = $scope.solicitud.solicitudesProductos.map(function (producto) {
			// 	producto.elNombre = (producto.producto !== undefined) ? producto.producto.nombre : (producto.productoSolicitado !== undefined) ? producto.productoSolicitado.nombre : productito.productoSolicitudBase.nombre
			// })
			$scope.abrirDialogPanelOperaciones()
		}

		$scope.calcularTotalViveres = function (solicitud, solo_calcular) {
			// if(!$scope.alreadyCalculated){
			$scope.totalViveresSolicitados = {}

			if (solicitud !== undefined) {
				$scope.solicitud = solicitud
				$scope.totalViveresSolicitados.usuario = solicitud.usuario
				$scope.totalViveresSolicitados.fecha = solicitud.fecha
				$scope.totalViveresSolicitados.sucursal = solicitud.almacen.sucursal
				$scope.totalViveresSolicitados.almacen = solicitud.almacen
				$scope.totalViveresSolicitados.identificador = solicitud.id
				$scope.totalViveresSolicitados.productos = []
			} else {
				throw new Error('Hubo un problema con la solicitud, no esta definida!')
				$scope.mostrarMensaje('Hubo un problema con la solicitud, no esta definida!')
				return
			}
			var xArr = []
			$scope.solicitud.solicitudesProductos.map(function (producto) {
				if (producto.eliminado === false || producto.eliminado === undefined) {
					if (producto.productoSolicitado.activar_inventario) {
						var obj = {
							estado: solicitud.activo,
							almacen: solicitud.almacen,
							cantidad_ideal: producto.cantidad,
							cantidad_real: producto.cantidad,
							id: producto.id,
							id_detalle_solicitud_producto: producto.id,
							id_producto_base: producto.productoSolicitado,
							productoSolicitudBase: producto.productoSolicitado,
							total: producto.cantidad,
							monto: solicitud.monto,
							solicitud: solicitud.id
						}
						$scope.totalViveresSolicitados.productos.push(obj)
					}
					if (producto.detallesIngredientesProducto.length > 0) {
						producto.detallesIngredientesProducto.map(function (ingrediente) {
							if (ingrediente.eliminado === undefined || ingrediente.eliminado === false) {
								var obj = {
									estado: solicitud.activo,
									almacen: solicitud.almacen,
									cantidad_ideal: ingrediente.cantidad_ideal,
									cantidad_real: ingrediente.cantidad_real,
									id: ingrediente.id,
									id_detalle_solicitud_producto: ingrediente.id_detalle_solicitud_producto,
									id_producto_base: ingrediente.id_producto_base,
									productoSolicitudBase: ingrediente.productoSolicitudBase,
									total: 0,
									monto: solicitud.monto,
									solicitud: solicitud.id
								}
								xArr.push(obj)
							}
						})
					}
				}
			})
			var toDrop = []
			$scope.solicitud.solicitudesProductos.map(function (item) {
				var indx = 0
				while (indx < xArr.length) {
					xArr.forEach(function (ing, index, aarr) {
						if (indx > index) {
							if (xArr[indx].id_producto_base === ing.id_producto_base) {
								toDrop.push(index)
							}
						}
					});
					indx += 1
				}
			})
			toDrop.forEach(element => {
				delete xArr[element]
			});
			xArr.map(function (itm) {
				if (itm !== undefined) {
					var obj = {
						estado: solicitud.activo,
						almacen: solicitud.almacen,
						cantidad_ideal: 0,
						cantidad_real: 0,
						id: itm.id,
						id_detalle_solicitud_producto: itm.id_detalle_solicitud_producto,
						id_producto_base: itm.id_producto_base,
						productoSolicitudBase: itm.productoSolicitudBase,
						total: 0,
						monto: solicitud.monto,
						solicitud: solicitud.id
					}
					$scope.totalViveresSolicitados.productos.push(obj)
				}
			})
			$scope.solicitadoTotalFinalBs = 0
			var alreadyCount = []
			$scope.totalViveresSolicitados.productos.map(function (producto) {
				producto.totalMostrar = 0
				$scope.solicitud.solicitudesProductos.map(function (item) {
					item.detallesIngredientesProducto.map(function (ingr) {
						if (producto.id_producto_base == ingr.id_producto_base) {
							producto.cantidad_ideal += ingr.cantidad_ideal
							producto.cantidad_real += ingr.cantidad_real
							producto.totalMostrar += ingr.total
							producto.total += ingr.total
							producto.totalSumar = ingr.total
							producto.totalbs = producto.totalSumar * ingr.productoSolicitudBase.precio_unitario
							$scope.solicitadoTotalFinalBs += producto.totalbs
						}
					})
					if (producto.id_producto_base == item.id_producto) {
						producto.cantidad_ideal = 1
						producto.cantidad_real = item.cantidad
						producto.totalMostrar = item.cantidad
						producto.totalSumar = item.cantidad
						producto.total = item.cantidad
						producto.totalbs = producto.totalSumar * item.productoSolicitado.precio_unitario
						$scope.solicitadoTotalFinalBs += producto.totalbs
					}
				})
			})
			$scope.alreadyCalculated = true
			if (solo_calcular === undefined) {
				if (solicitud !== undefined) {
					$scope.abrirDialogTotalIngredientes()
				} else {
					$scope.solicitud = undefined
				}
			} else {
				return $scope.totalViveresSolicitados
			}
		}

		$scope.clasificarGrupo = function (grupo) {
			$scope.productosProcesados = $filter('filter')($scope.productos, grupo);
			setTimeout(function () {
				aplicarSwiper(4, 3, true, 2);
			}, 5);
		}

		$scope.verFormulacion = function (producto) {
			if ($scope.productoSeleccionado !== undefined) {
				if (producto.productoSolicitado.id != $scope.productoSeleccionado.productoSolicitado.id) {
					var indice = $scope.solicitud.solicitudesProductos.indexOf(producto);
					$scope.solicitud.solicitudesProductos[indice].verFormulacion = undefined;
					$scope.productoSeleccionado.verFormulacion = undefined
				}
			}
			if (producto.verFormulacion === undefined) {
				producto.verFormulacion = true
			} else {
				producto.verFormulacion = undefined
			}
			$scope.productoSeleccionado = producto
		}

		$scope.eliminarDetalleVenta = function (detalleVenta, disminuido) {
			if (detalleVenta.id === undefined) {
				$scope.solicitud.solicitudesProductos.splice($scope.solicitud.solicitudesProductos.indexOf(detalleVenta), 1);
			} else {
				detalleVenta.eliminado = true
				detalleVenta.cantidad = 0
				detalleVenta.detallesIngredientesProducto.map(function (ing) {
					ing.eliminado = true
				})
			}
		}

		$scope.eliminarIngrediente = function (detalleVenta) {
			if (detalleVenta.id === undefined) {
				$scope.productoSeleccionado.detallesIngredientesProducto.splice($scope.productoSeleccionado.detallesIngredientesProducto.indexOf(detalleVenta), 1);
			} else {
				detalleVenta.eliminado = true
			}
			if ($scope.productoSeleccionado.detallesIngredientesProducto.length == 0) {
				$scope.eliminarDetalleVenta($scope.productoSeleccionado, true);
			} else {
				var count = 0
				$scope.productoSeleccionado.detallesIngredientesProducto.map(function (ingr) {
					count += (ingr.eliminado === true) ? 1 : 0
				})
				if (count == $scope.productoSeleccionado.detallesIngredientesProducto.length) {
					$scope.eliminarDetalleVenta($scope.productoSeleccionado);
				}
			}
		}

		$scope.disminuirDetalleVenta = function (detalleVenta) {
			if (detalleVenta.cantidad == 1) {
				$scope.eliminarDetalleVenta(detalleVenta, true);
			} else {
				detalleVenta.cantidad = detalleVenta.cantidad - 1;
				detalleVenta.detallesIngredientesProducto.map(function (prod) {
					prod.total = detalleVenta.cantidad * prod.cantidad_ideal
				})

			}
		}

		$scope.actualizarTotalReal = function (prod) {
			prod.detallesIngredientesProducto.map(function (ing) {
				ing.total = prod.cantidad * ing.cantidad_ideal
			})
		}

		$scope.obtenerConfiguracionVentaVista = function () {
			blockUI.start();
			var promise = ConfiguracionVentaVistaDatos($scope.usuarioSesion.id_empresa);
			promise.then(function (configuracion) {
				$scope.configuracionVentaVista = configuracion;
				blockUI.stop();
			});
		}

		$scope.guardarConfiguracionVentaVista = function () {
			ConfiguracionVentaVista.update({ id_empresa: $scope.usuarioSesion.id_empresa }, $scope.configuracionVentaVista, function (res) {

			});
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

		$scope.getFecha = function () {
			if ($scope.solicitud !== undefined) {
				return new Date($scope.solicitud.fecha)
			} else {
				return new Date()
			}
		}

		$scope.guardarOperacionPanel = function (formValid, solicitud) {
			blockUI.start()
			var montobs = 0
			if (formValid) {
				var productosSolicitados = $scope.calcularTotalViveres(solicitud, true)
				solicitud.listaProductosSolicitados = productosSolicitados
				solicitud.solicitudesProductos.map(function (produc) {
					var prodMonto = 0
					if (produc.detallesIngredientesProducto !== undefined) {
						if (produc.detallesIngredientesProducto.length < 1) {
							if (produc.eliminado === undefined || produc.eliminado === false) {
								prodMonto += produc.productoSolicitado.precio_unitario * produc.cantidad
							}
						} else {
							if (produc.eliminado === undefined || produc.eliminado === false) {
								produc.detallesIngredientesProducto.map(function (ingrediente) {
									if (ingrediente.eliminado === undefined || ingrediente.eliminado === false) {
										prodMonto += ingrediente.total * ingrediente.productoSolicitudBase.precio_unitario
									}
								})
							}
						}
					} else {
						if (produc.eliminado === undefined) {
							prodMonto += produc.productoSolicitado.precio_unitario * produc.cantida
						}
					}
					montobs += prodMonto
				})
				solicitud.monto = montobs
				var fortime = new Date()
				var dateSplit = solicitud.fecha.split('/').reverse()
				solicitud.fecha = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], fortime.getHours(), fortime.getMinutes())
				solicitud.id_usuario = $scope.usuarioSesion.id
				solicitud.activo = true
				var prom = Solicitud(solicitud, $scope.usuarioSesion.id_empresa, solicitud.modificar)
				prom.then(function (res) {
					if (res.hasErr) {
						$scope.mostrarMensaje(res.mensaje)
						solicitud.fecha = new Date(solicitud.fecha).toLocaleDateString()
					} else {
						$scope.mostrarMensaje(res.mensaje)
						$scope.recargarItemsTabla()
					}
					blockUI.stop()
				}).catch(function (err) {
					var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
					$scope.mostrarMensaje(msg)
					solicitud.fecha = new Date(solicitud.fecha).toLocaleDateString()
					blockUI.stop()
				})
			} else {
				$scope.mostrarMensaje('Complete los campos requeridos')
				blockUI.stop();
			}
		}

		$scope.obtenerInventariosProdSolicitud = function () {
			$scope.solicitud.solicitudesProductos.map(function (prod) {
				var promesa = ListaInventariosProducto(prod.productoSolicitado.id, $scope.solicitud.almacen.id);
				promesa.then(function (inventarios) {
					prod.inventarios = inventarios
					// prod.inventario_disponible_utilizado = prod.cantidad
				})
			})
		}

		$scope.obtenerInventarioTotal = function (producto) {
			var cantidadTotal = 0;
			var promesa = ListaInventariosProducto(producto.id, $scope.solicitud.almacen.id);
			promesa.then(function (inventarios) {
				producto.inventarios = inventarios;
				for (var i = 0; i < producto.inventarios.length; i++) {
					producto.inventarios[i].fecha_vencimiento = (producto.inventarios[i].fecha_vencimiento ? new Date(producto.inventarios[i].fecha_vencimiento) : null);
					producto.inventarios[i].fechaVencimientoTexto = (producto.inventarios[i].fecha_vencimiento ? producto.inventarios[i].fecha_vencimiento.getDate() + "/" + (producto.inventarios[i].fecha_vencimiento.getMonth() + 1) + "/" + producto.inventarios[i].fecha_vencimiento.getFullYear() : "");
					producto.inventarios[i].detallesMovimiento[0].movimiento.fecha = new Date(producto.inventarios[i].detallesMovimiento[0].movimiento.fecha);
					producto.inventarios[i].detallesMovimiento[0].movimiento.fechaTexto = producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getDate() + "/" + (producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getMonth() + 1) + "/" + producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getFullYear();
				}
			}).catch(function (err) {
				var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
				$scope.mostrarMensaje(msg)
				return 0
			})
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					cantidadTotal += (producto.inventarios[i].cantidad);
				}
				if ($scope.solicitud.solicitudesProductos !== undefined && $scope.solicitud.copia) {
					for (var j = 0; j < $scope.solicitud.solicitudesProductos.length; j++) {
						if ($scope.solicitud.solicitudesProductos[j].productoSolicitado.id == producto.id) {
							cantidadTotal = cantidadTotal - $scope.solicitud.solicitudesProductos[j].cantidad;
						}
					}
				}
			} else {
				cantidadTotal = 500000;
			}
			return cantidadTotal;
		}

		$scope.cargarProductos = function () {
			var promesa = ProductosOperaciones($scope.usuarioSesion.id_empresa, $scope.solicitud.almacen.id, $scope.usuarioSesion.id);
			promesa.then(function (productos) {
				if (productos.length > 0) {
					for (var i = 0; i < productos.length; i++) {
						if (productos[i].activar_inventario) {
							productos[i].inventario_disponible = $scope.obtenerInventarioTotal(productos[i]);
						}
					}
					$scope.productos = productos;
				} else {
					$scope.productos = [];
				}
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
				// $scope.productosProcesados.sort(function(a, b){
				// 	var nameA=a.nombre.toLowerCase(), nameB=b.nombre.toLowerCase();
				// 	if (nameA < nameB) //sort string ascending
				// 	 return -1;
				// 	if (nameA > nameB)
				// 	 return 1;
				// 	return 0; //default return value (no sorting)
				//    });
				//===== Fin save localstorage ====
				setTimeout(function () {
					aplicarSwiper(4, 3, true, 2);
				}, 1000);
			});
		}

		$scope.agregarDetalleVentaPanel = function (producto) {
			var monto = 0
			$scope.cantidadInventario = 0;
			var detalleVenta = {
				productoSolicitado: producto, precio_unitario: producto.precio_unitario,
				inventario_disponible: $scope.cantidadInventario,
				inventarios: producto.inventarios,
				cantidad: 1,
				detallesIngredientesProducto: []
			};
			if (producto.activar_inventario) {
				$scope.cantidadInventario = producto.inventario_disponible
				var j = 0, encontrado = false;
				if ($scope.solicitud.solicitudesProductos === undefined) {
					$scope.solicitud.solicitudesProductos = []
				}
				if (1 <= $scope.cantidadInventario) {
					while (j < $scope.solicitud.solicitudesProductos.length && !encontrado) {
						if ($scope.solicitud.solicitudesProductos[j].eliminado === undefined) {
							if ($scope.solicitud.solicitudesProductos[j].productoSolicitado.id == producto.id) {
								$scope.solicitud.solicitudesProductos[j].cantidad = $scope.solicitud.solicitudesProductos[j].cantidad + 1;
								$scope.solicitud.solicitudesProductos[j].eliminado = undefined
								$scope.solicitud.solicitudesProductos[j].detallesIngredientesProducto.map(function (ingre) {
									ingre.total = ingre.cantidad_ideal * $scope.solicitud.solicitudesProductos[j].cantidad
								})
								encontrado = true;
								detalleVenta = $scope.solicitud.solicitudesProductos[j];
							}
						}
						j++;
					}
					if (!encontrado) {
						var formulacion = SolicitudesFormulacionProducto(producto.id)
						var ingredientes = []
						formulacion.then(function (formula) {
							if (formula.productosBase) {
								formula.productosBase.forEach(element => {
									ingrediente = {
										cantidad_ideal: parseFloat(element.formulacion),
										cantidad_real: parseFloat(element.formulacion),
										total: parseFloat(element.formulacion),
										id_producto_base: element.productoBase.id,
										productoSolicitudBase: element.productoBase
									}
									ingredientes.push(ingrediente)
								});
							}
						})
						if (producto.activar_inventario) {
							if (1 <= $scope.cantidadInventario) {
								detalleVenta = {
									productoSolicitado: producto, precio_unitario: producto.precio_unitario,
									inventario_disponible: $scope.cantidadInventario,
									inventarios: producto.inventarios,
									cantidad: 1,
									detallesIngredientesProducto: ingredientes
								};
								$scope.solicitud.solicitudesProductos.push(detalleVenta);
							} else {
								$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
							}
						} else {
							detalleVenta = {
								productoSolicitado: producto, precio_unitario: producto.precio_unitario,
								inventario_disponible: $scope.cantidadInventario,
								inventarios: producto.inventarios,
								cantidad: 1,
								detallesIngredientesProducto: ingredientes
							};
							$scope.solicitud.solicitudesProductos.push(detalleVenta);
						}
					} else {
						producto.eliminado = undefined
					}
				} else {
					$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
				}
			} else {
				var j = 0, encontrado = false
				if ($scope.solicitud.solicitudesProductos) {
					while (j < $scope.solicitud.solicitudesProductos.length && !encontrado) {
						if ($scope.solicitud.solicitudesProductos[j].eliminado === undefined) {
							if ($scope.solicitud.solicitudesProductos[j].productoSolicitado.id == producto.id) {
								$scope.solicitud.solicitudesProductos[j].cantidad = $scope.solicitud.solicitudesProductos[j].cantidad + 1;
								$scope.solicitud.solicitudesProductos[j].eliminado = undefined
								$scope.solicitud.solicitudesProductos[j].detallesIngredientesProducto.map(function (ingre) {
									ingre.total = ingre.cantidad_ideal * $scope.solicitud.solicitudesProductos[j].cantidad
								})
								encontrado = true;
								detalleVenta = $scope.solicitud.solicitudesProductos[j];
							}
						}
						j++;
					}
				} else {
					$scope.solicitud.solicitudesProductos = []
				}

				if (!encontrado) {
					var formulacion = SolicitudesFormulacionProducto(producto.id)
					var ingredientes = []
					formulacion.then(function (formula) {
						if (formula.productosBase) {
							formula.productosBase.forEach(element => {
								ingrediente = {
									cantidad_ideal: parseFloat(element.formulacion),
									cantidad_real: parseFloat(element.formulacion),
									total: parseFloat(element.formulacion),
									id_producto_base: ((element.productoBase) ? element.productoBase.id : null),
									productoSolicitudBase: element.productoBase
								}
								ingredientes.push(ingrediente)
							});
						}
						detalleVenta = {
							productoSolicitado: producto, precio_unitario: producto.precio_unitario,
							inventario_disponible: $scope.cantidadInventario,
							inventarios: producto.inventarios,
							cantidad: 1,
							detallesIngredientesProducto: ingredientes
						};
						$scope.solicitud.solicitudesProductos.push(detalleVenta);
					})
				} else {
					producto.eliminado = undefined
				}
			}
			producto.rankin += 1;
			var indice = $scope.productosProcesados.indexOf(producto);
			$scope.productosProcesados[indice] = producto;
			$localStorage.productosProcesados = $scope.productosProcesados;
		}

		$scope.filtrarProductos = function (busqueda) {
			$scope.productosProcesados = $filter('filter')($scope.productos, busqueda);
			setTimeout(function () {
				aplicarSwiper(4, 3, true, 2);
			}, 5);
		}

		$scope.confirmarEntrega = function (solicitud) {
			$scope.solicitudCerrar = solicitud
			$scope.abrirDialogConfirmacionCierre()

		}

		$scope.cerrarSolicitud = function (solicitud) {
			blockUI.start()
			var productosSolicitados = $scope.calcularTotalViveres(solicitud, true)
			solicitud.listaProductosSolicitados = productosSolicitados
			var prom = CerrarSolicitud(solicitud, $scope.usuarioSesion.id_empresa)
			prom.then(function (res) {
				if (res.hasErr) {
					$scope.mostrarMensaje(res.mensaje)
				} else {
					$scope.mostrarMensaje(res.mensaje)
					$scope.solicitudCerrar = undefined
					solicitud.activo = false
					$scope.solicitud = undefined
					$scope.cerrarDialogConfirmacionCierre()
				}
				blockUI.stop()
			}).catch(function (err) {
				var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : (err.data !== null && err.data !== undefined) ? err.data : 'Se perdió la conexión.'
				$scope.mostrarMensaje(msg)
				blockUI.stop()
			})
		}

		$scope.editar = function (solicitud) {
			$scope.solicitud = solicitud
			$scope.solicitud.fechaTexto = $scope.fechaATexto($scope.solicitud.fecha)
			$scope.solicitud.modificar = true
			$scope.abrirDialogPanelOperaciones()
			$scope.solicitud.sucursal = $scope.solicitud.almacen.sucursal
			$scope.solicitud.almacen = $scope.solicitud.almacen
			$scope.obtenerAlmacenes($scope.solicitud.sucursal.id)
			$scope.obtenerInventariosProdSolicitud()
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

		$scope.obtenerGruposProductoEmpresa = function () {
			var promesa = ListaGruposProductoUsuario($scope.usuarioSesion.id_empresa, $scope.usuario.id);
			promesa.then(function (grupos) {
				$scope.grupos_productos = grupos;
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

		if (angular.isDefined($localStorage.color)) {
			$scope.color = $localStorage.color;
		} else {
			$localStorage.color = { 'style': 'red-style', 'stylebutton': 'red-style-button' };
			$scope.color = { 'style': 'red-style', 'stylebutton': 'red-style-button' };
		}

		$scope.cambiarColor = function (color, buttonColor) {
			// == save localstorage ====
			$localStorage.color = { 'style': color, 'stylebutton': buttonColor };
			// ==== fin ======

			$('#dialog-panel-operaciones .widget-main').removeClass('red-style green-style skyblue-style brown-style');
			$('#dialog-panel-operaciones .widget-main').addClass(color);

			$('#dialog-panel-operaciones .widget-main .button-style').removeClass('red-style-button green-style-button skyblue-style-button brown-style-button');
			$('#dialog-panel-operaciones .widget-main .button-style').addClass(buttonColor);
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
				$scope.venderProformaDirecto(venta);
			}
			$scope.dragged = false;
		};

		$scope.startDragging = function () {
			$scope.dragged = true;
		};

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
			$scope.buscarInventarios($scope.almacenBusqueda.id, $scope.paginaActual, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion);
		}

		$scope.sinFuncionalidad = function () {
			$scope.mostrarMensaje('Sin funcionalidad')
		}

		$scope.filtrarSolicitudesOperaciones = function (filtro) {
			for (var key in filtro) {
				if (filtro[key] === undefined) {
					filtro[key] = 0
				}
			}
			$scope.obtenerSolicitudes()
		}

		$scope.copiar = function (solicitud) {
			solicitud.id = undefined
			solicitud.solicitudesProductos = solicitud.solicitudesProductos.map(function (producto) {
				producto.id = undefined
				producto.id_solicitud = undefined
				if (producto.detallesIngredientesProducto.length > 0) {
					producto.detallesIngredientesProducto = producto.detallesIngredientesProducto.map(function (ingrediente) {
						ingrediente.id = undefined
						ingrediente.id_detalle_solicitud_producto = undefined
						return ingrediente
					})
				}
				return producto
			})
			$scope.solicitud = solicitud
			$scope.solicitud.copia = true
			$scope.solicitud.sucursal = $scope.solicitud.almacen.sucursal
			$scope.obtenerAlmacenes($scope.solicitud.sucursal.id)
			$scope.solicitud.almacen = $scope.solicitud.almacen
			$scope.obtenerInventariosProdSolicitud()
			$scope.abrirDialogPanelOperaciones()
		}

		$scope.fechaATexto = function (fecha) {
			fech = new Date(fecha)
			fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
			return fecha
		}

		$scope.abrirDialogPanelOperaciones = function () {
			if ($scope.solicitud !== undefined) {
				if ($scope.solicitud.id === undefined) {
					$scope.productoSeleccionado = undefined
					$scope.solicitud.fecha = new Date().toLocaleDateString()
				} else {
					if ($scope.solicitud.copia === undefined) {
						$scope.solicitud.fecha = new Date($scope.solicitud.fecha).toLocaleDateString()
						if ($scope.solicitud.modificar) {

						} else {
							$scope.solicitud.nueva = true
						}
						
					} else {
						$scope.solicitud.id = undefined
						$scope.solicitud.fecha = new Date().toLocaleDateString()
						$scope.solicitud.activo = true
					}
				}
			} else {
				$scope.solicitud = {}
				$scope.solicitud.fecha = new Date().toLocaleDateString()
				$scope.solicitud.activo = true
			}
			$scope.obtenerGruposProductoEmpresa();
			$scope.abrirPopup($scope.idDialogDialogPanelOperaciones);
		}

		$scope.cerrarPopupPanel = function () {
			if ($scope.solicitud !== undefined) {
				$scope.solicitud.copia = undefined
				$scope.solicitud = undefined
			}
			$scope.productoSeleccionado = undefined
			$scope.recargarItemsTabla()
			$scope.productosProcesados = []
			$scope.cerrarPopup($scope.idDialogDialogPanelOperaciones);
		}

		$scope.abriridDialogoListadoPedido = function () {
			$scope.abrirPopup($scope.idDialogoListadoPedido);
		}

		$scope.cerraridDialogoListadoPedido = function () {
			$scope.detallesPedido = []
			$scope.pedido = {}
			$scope.detallePedido = {}
			$scope.solicitudesPedido = []
			$scope.cerrarPopup($scope.idDialogoListadoPedido);
		}

		$scope.verificarPulso = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				$scope.buscarProductos(1);
			}
		}

		$scope.verificarPulsoAsignados = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				$scope.buscarProductosAsignados(1);
			}
		}
		$scope.abrirDialogDatos = function () {
			$scope.abrirPopup($scope.idDialogDatos);
		}

		$scope.cerrarDialogDatos = function () {
			$scope.cerrarPopup($scope.idDialogDatos);
		}
		$scope.abrirDialogEntregaViveres = function () {
			$scope.abrirPopup($scope.idDialogEntregaViveres);
		}

		$scope.cerrarDialogEntregaViveres = function () {
			$scope.cerrarPopup($scope.idDialogEntregaViveres);
		}
		$scope.abrirDialogConfirmacionCierre = function () {
			$scope.abrirPopup($scope.idConfirmacionCierre);
		}
		$scope.cerrarDialogConfirmacionCierre = function () {
			$scope.cerrarPopup($scope.idConfirmacionCierre);
		}

		$scope.abrirDialogTotalIngredientes = function () {
			$scope.abrirPopup($scope.idDialogTotalIngredientes);
		}
		$scope.cerrarDialogTotalIngredientes = function () {
			$scope.alreadyCalculated = false
			$scope.cerrarPopup($scope.idDialogTotalIngredientes);
		}

		$scope.generarPdfSolicitud = function (solicitud) {
			blockUI.start();
			$scope.calcularTotalViveres(solicitud, true)
			var doc = new PDFDocument({ size: [612, 792], margin: 10, compress: false });
			var stream = doc.pipe(blobStream());
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.font('Helvetica', 8);
			var y = 115, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil($scope.totalViveresSolicitados.productos.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFSolicitud(doc, pagina, totalPaginas);

			for (var i = 0; i < $scope.totalViveresSolicitados.productos.length && items <= itemsPorPagina; i++) {
				doc.font('Helvetica', 8);
				doc.text(i + 1, 65, y);
				doc.text($scope.totalViveresSolicitados.productos[i].productoSolicitudBase.codigo, 100, y);
				doc.text($scope.totalViveresSolicitados.productos[i].productoSolicitudBase.nombre, 220, y);
				doc.text($scope.totalViveresSolicitados.productos[i].productoSolicitudBase.unidad_medida, 400, y);
				doc.text($scope.totalViveresSolicitados.productos[i].total.toFixed(2), 500, y);
				y = y + 20;
				items++;
				if (items > itemsPorPagina) {
					doc.rect(40, 105, 540, y - 115).stroke();
					doc.text(pagina + "/" + totalPaginas, 570, y + 15);
					doc.font('Helvetica', 6);
					doc.text("RESPONSABLE: " + $scope.usuarioSesion.nombre_usuario, 45, y + 10);
					doc.text("SOLICITANTE: " + $scope.totalViveresSolicitados.usuario.persona.nombre_completo, 345, y + 10);
					doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, y + 10);
					doc.addPage({ size: [612, 792], margin: 10 });
					y = 115;
					items = 0;
					pagina = pagina + 1;
					$scope.dibujarCabeceraPDFSolicitud(doc, pagina, totalPaginas);
				}
			}
			doc.rect(40, 105, 540, y - 115).stroke();
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.text(pagina + "/" + totalPaginas, 570, y + 15);
			doc.font('Helvetica', 6);
			doc.text("RESPONSABLE: " + $scope.usuarioSesion.nombre_usuario, 45, y + 5);
			doc.text("SOLICITANTE: " + $scope.totalViveresSolicitados.usuario.persona.nombre_completo, 345, y + 5);
			doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, y + 5);
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		$scope.dibujarCabeceraPDFSolicitud = function (doc, pagina, totalPaginas) {
			doc.font('Helvetica-Bold', 12);
			doc.text("CONSUMOS", 0, 25, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("SUCURSAL : ", -40, 50, { align: "center" });
			doc.font('Helvetica', 8);
			doc.text($scope.totalViveresSolicitados.sucursal.nombre, 60, 50, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("FECHA : ", 40, 60, { width: 40 });
			doc.font('Helvetica', 8);
			doc.text($scope.fechaATexto($scope.totalViveresSolicitados.fecha), 75, 60, { width: 40 });
			doc.font('Helvetica-Bold', 14);
			doc.text("N°", 380, 40, { align: "center" });
			doc.text($scope.totalViveresSolicitados.identificador, 440, 40, { align: "center" });
			doc.rect(40, 80, 540, 25).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Nº", 65, 90);
			doc.text("Código Ítem", 100, 90);
			doc.text("Producto", 220, 90);
			doc.text("Unidad medida", 380, 90);
			doc.text("Cantidad solicitada", 480, 90);
		}

		$scope.calcularViveresDesdeFiltro = function (UnDatoPorProducto) {
			var detallesSolicitudes = []
			$scope.totalViveresSolicitados = {}
			$scope.solicitudesPedido = []
			$scope.solicitudesOperaciones.forEach(function (solicitud, i) {
				if ((!solicitud.activo && UnDatoPorProducto === undefined)) {
					var desdd = $scope.calcularTotalViveres(solicitud, true)
					detallesSolicitudes.push(desdd)
				} else if (UnDatoPorProducto && !solicitud.id_pedido) {
					$scope.solicitudesPedido.push(solicitud.id)
					var desdd = $scope.calcularTotalViveres(solicitud, true)
					detallesSolicitudes.push(desdd)
				}
			})
			var productosParaSerProcesados = []
			detallesSolicitudes.forEach(function (productoParaProcesar) {
				productoParaProcesar.productos.forEach(function (producto) {
					var productoSinProcesado = {
						almacen: producto.almacen,
						sucursal: producto.almacen.sucursal,
						cantidad: producto.cantidad_real,
						fecha: productoParaProcesar.fecha,
						hora_fecha: productoParaProcesar.fecha,
						usuario: productoParaProcesar.usuario,
						estado: producto.estado,
						producto: producto.productoSolicitudBase,
						costo: (producto.productoSolicitudBase.inventarios ? producto.productoSolicitudBase.inventarios.length ? producto.productoSolicitudBase.inventarios[0].costo_unitario : 0 : 0),
						grupo: producto.productoSolicitudBase.grupo,
						subgrupo: producto.productoSolicitudBase.subgrupo,
						total: (producto.productoSolicitudBase.inventarios ? producto.productoSolicitudBase.inventarios.length ? producto.productoSolicitudBase.inventarios[0].costo_unitario : 0 : 0) * producto.cantidad_real,
						monto: producto.monto,
						solicitud: producto.solicitud
					}
					productosParaSerProcesados.push(productoSinProcesado)
				})
			})
			if (UnDatoPorProducto) {
				var productosReporteDetalle = []
				while (productosParaSerProcesados.length > 0) {
					var dato = productosParaSerProcesados.pop()
					if (productosReporteDetalle.length === 0) {
						productosReporteDetalle.push(dato)
					} else {
						var encontrado = false
						var indx
						productosReporteDetalle.forEach(function (producto, i) {
							if (producto.producto.id == dato.producto.id && !encontrado) {
								encontrado = true
								indx = i
							}
						})
						if (encontrado && indx !== undefined) {
							productosReporteDetalle[indx].cantidad += dato.cantidad
							productosReporteDetalle[indx].total = productosReporteDetalle[indx].cantidad * productosReporteDetalle[indx].costo
						} else {
							productosReporteDetalle.push(dato)
						}
					}
				}
				return productosReporteDetalle
			} else {
				return productosParaSerProcesados
			}
		}

		$scope.reporteExcel = function (pdf) {
			blockUI.start()
			if ($scope.imprimir.detalle) {
				var cabecera = ["Nro.", "Sucursal", "Almacén", "Hora-fecha", "Usuario", "Estado", "Detalle", "Unidad", "Grupo", "Subgrupo", "Cantidad", "Costo", "Total"]
				var data = []
				data.push(cabecera)
				var reporteEx = $scope.calcularViveresDesdeFiltro()
				var columns = [];
				for (var i = 0; i < reporteEx.length; i++) {
					columns = [];
					columns.push(i + 1);
					columns.push(reporteEx[i].almacen.sucursal.nombre);
					columns.push(reporteEx[i].almacen.nombre);
					// columns.push(new Date(reporteEx[i].fecha).toLocaleDateString());
					columns.push(new Date(reporteEx[i].fecha).toLocaleTimeString() + ' ' + new Date(reporteEx[i].fecha).toLocaleDateString());
					columns.push(reporteEx[i].usuario.nombre_usuario);
					columns.push((reporteEx[i].estado ? 'Abierto' : 'Cerrado'));
					columns.push(reporteEx[i].producto.nombre);
					columns.push(reporteEx[i].producto.unidad_medida);
					columns.push(reporteEx[i].grupo.nombre);
					columns.push(reporteEx[i].subgrupo.nombre);
					columns.push(reporteEx[i].cantidad);
					columns.push(reporteEx[i].costo);
					columns.push(reporteEx[i].total.toFixed(2));
					data.push(columns);
				}
				blockUI.stop();
			} else {
				var cabecera = ["Nro.", "Sucursal", "Hora-fecha", "Monto", "Usuario", "Estado"]
				var data = []
				data.push(cabecera)
				// var reporteEx = $scope.calcularViveresDesdeFiltro()
				var columns = [];
				for (var i = 0; i < $scope.solicitudesOperaciones.length; i++) {
					columns = [];
					columns.push(i + 1);
					columns.push($scope.solicitudesOperaciones[i].almacen.sucursal.nombre);
					// columns.push(new Date($scope.solicitudesOperaciones[i].fecha).toLocaleDateString());
					columns.push(new Date($scope.solicitudesOperaciones[i].fecha).toLocaleTimeString() + ' ' + new Date($scope.solicitudesOperaciones[i].fecha).toLocaleDateString());
					columns.push($scope.solicitudesOperaciones[i].monto);
					columns.push($scope.solicitudesOperaciones[i].usuario.nombre_usuario);
					columns.push(($scope.solicitudesOperaciones[i].activo ? 'Abierto' : 'Cerrado'));
					data.push(columns);
				}
				blockUI.stop();
			}
			if (pdf) {
				$scope.reportePdf(data)
				blockUI.stop();
			} else {
				var ws_name = "SheetJS";
				var wb = new Workbook()
				var ws = sheet_from_array_of_arrays(data);
				var wscols = [
					{ wch: 5 },
					{ wch: 18 },
					{ wch: 18 },
					{ wch: 12 },
					{ wch: 15 },
					{ wch: 15 },
					{ wch: 12 },
					{ wch: 25 },
					{ wch: 12 },
					{ wch: 12 },
					{ wch: 12 }
				];
				ws['!cols'] = wscols;
				ws['!rows'] = [{ hpx: 28, level: 3 }]
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE OPERACIONES.xlsx");
				blockUI.stop();
			}
		}

		$scope.reportePdf = function (reporte) {
			var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false }); //[612, 792]
			var stream = doc.pipe(blobStream());
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			$scope.posXforPdf = []
			doc.font('Helvetica', 8);
			var x = 65, y = 115, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil(reporte.length / itemsPorPagina);
			$scope.dibujarCabeceraReportePdf(doc, reporte)
			if ($scope.imprimir.detalle) {
				x = 50
				for (var i = 0; i < reporte.length && items <= itemsPorPagina; i++) {
					var px = x
					doc.font('Helvetica', 8);
					if (i > 0) {
						for (var j = 0; j < reporte[i].length; j++) {
							doc.text(reporte[i][j], px, y, { width: 40 }, { align: "center" });
							if (j == 0) {
								px = $scope.posXforPdf[j]
							} else {
								px = $scope.posXforPdf[j]
							}
						}
						y = y + 20;
						items++;
					}
					if (items > itemsPorPagina) {
						doc.rect(40, 105, 540, y - 115).stroke();
						doc.text(pagina + "/" + totalPaginas, 570, y + 15);
						doc.font('Helvetica', 6);
						// doc.text("RESPONSABLE: " + $scope.usuarioSesion.nombre_usuario, 45, y + 10);
						// doc.text("SOLICITANTE: " + $scope.reporte.usuario.persona.nombre_completo, 345, y + 10);
						doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, y + 10);
						doc.addPage({ size: [612, 792], margin: 10 });
						y = 115;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFSolicitud(doc, pagina, totalPaginas);
					}
				}
			} else {
				for (var i = 0; i < reporte.length && items <= itemsPorPagina; i++) {
					var px = x
					doc.font('Helvetica', 8);
					if (i > 0) {
						for (var j = 0; j < reporte[i].length; j++) {
							doc.text(reporte[i][j], px, y, { width: 40 });
							if (j == 0) {
								px += 30
							} else {
								px += 60
							}
						}
						y = y + 20;
						items++;
					}
					if (items > itemsPorPagina) {
						doc.rect(40, 105, 540, y - 115).stroke();
						doc.text(pagina + "/" + totalPaginas, 570, y + 15);
						doc.font('Helvetica', 6);
						// doc.text("RESPONSABLE: " + $scope.usuarioSesion.nombre_usuario, 45, y + 10);
						// doc.text("SOLICITANTE: " + $scope.reporte.usuario.persona.nombre_completo, 345, y + 10);
						doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, y + 10);
						doc.addPage({ size: [612, 792], margin: 10 });
						y = 115;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFSolicitud(doc, pagina, totalPaginas);
					}
				}
			}
			doc.rect(40, 105, 540, 650).stroke();
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.text(pagina + "/" + totalPaginas, 570, 765);
			doc.font('Helvetica', 6);
			// doc.text("RESPONSABLE: " + $scope.usuarioSesion.nombre_usuario, 45, y + 5);
			// doc.text("SOLICITANTE: " + $scope.totalViveresSolicitados.usuario.persona.nombre_completo, 345, y + 5);
			doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, 765);
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		$scope.dibujarCabeceraReportePdf = function (doc, reporte) {
			doc.font('Helvetica-Bold', 12);
			doc.text("REPORTE OPERACIONES", 0, 25, { align: "center" });
			// doc.font('Helvetica', 8);
			//doc.text("Desde  "+reporte.fechaInicioTexto,-70,40,{align:"center"});
			//doc.text("Hasta "+reporte.fechaFinTexto,70,40,{align:"center"});
			//doc.text("FOLIO "+pagina,550,25);
			// // doc.rect(40, 60, 540, 40).stroke();
			// doc.font('Helvetica-Bold', 8);
			// doc.text("SUCURSAL : ", -40, 50, { align: "center" });
			// doc.font('Helvetica', 8);
			// doc.text($scope.totalViveresSolicitados.sucursal.nombre, 60, 50, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("FECHA : ", 40, 60, { width: 40 });
			doc.font('Helvetica', 8);
			doc.text(new Date().toLocaleDateString(), 75, 60, { width: 40 });
			// doc.font('Helvetica-Bold', 14);
			// doc.text("N°", 380, 40, { align: "center" });
			// doc.text($scope.totalViveresSolicitados.identificador, 440, 40, { align: "center" });
			// doc.text("NIT : ", 440, 75);
			// doc.font('Helvetica', 8);
			//doc.text(datos.empresa.razon_social,195,75);
			//doc.text(datos.empresa.nit,460,75);		
			doc.rect(40, 80, 540, 25).stroke();
			doc.font('Helvetica-Bold', 8);
			if ($scope.imprimir.detalle) {
				px = 50
				for (let i = 0; i < reporte[0].length; i++) {
					doc.text(reporte[0][i], px, 90);
					if (i == 0) {
						px += reporte[0][i].length * 4 + 5
						$scope.posXforPdf.push(px)
					} else {
						if ($scope.imprimir.detalle) {
							px += reporte[0][i].length * 4 + 15
							$scope.posXforPdf.push(px)
						} else {
							px += reporte[0][i].length * 4 + 15
							$scope.posXforPdf.push(px)
						}
					}
				}
			} else {
				px = 65
				for (let i = 0; i < reporte[0].length; i++) {
					doc.text(reporte[0][i], px, 90);
					if (i == 0) {
						px += 20
						$scope.posXforPdf.push(px)
					} else {
						if ($scope.imprimir.detalle) {
							px += 40
							// $scope.posXforPdf.push(px) 
						} else {
							px += 60
							// $scope.posXforPdf.push(px)
						}
					}
				}
			}


			// if ($scope.imprimir.detalle) {
			// 	doc.font('Helvetica-Bold', 8);
			// 	doc.text("Nº", 65, 90);
			// 	doc.text("Sucursal", 75, 90);
			// 	doc.text("Almacén", 85, 90)
			// 	doc.text("Fecha", 95, 90);
			// 	doc.text("Hora-fecha", 105, 90);
			// 	doc.text("Usuario", 115, 90);
			// 	doc.text("Estado", 125, 90);
			// 	doc.text("Detalle", 135, 90);
			// 	doc.text("Unidad", 145, 90);
			// 	doc.text("Grupo", 155, 90);
			// 	doc.text("Subgrupo", 165, 90);
			// 	doc.text("Cantidad", 175, 90);
			// 	doc.text("Costo", 185, 90);
			// 	doc.text("Total", 195, 90);
			// } else {
			// 	doc.font('Helvetica-Bold', 8);
			// 	doc.text("Nº", 65, 90);
			// 	doc.text("Sucursal", 75, 90);
			// 	doc.text("Fecha", 95, 90);
			// 	doc.text("Hora-fecha", 105, 90);
			// 	doc.text("Monto", 115, 90);
			// 	doc.text("Usuario", 125, 90);
			// 	doc.text("Estado", 135, 90);
			// }
			doc.font('Helvetica', 8);
		}

		$scope.obtenerProductos = function () {
			$scope.paginatorProductos = Paginator();
			$scope.paginatorProductos.column = "nombre";
			$scope.paginatorProductos.filter = $scope.grupo;
			$scope.paginatorProductos.callBack = $scope.buscarProductos;
			$scope.paginatorProductos.getSearch("", null, null);
		};

		$scope.modificarListaProductosProveedor = function (producto) {
			var indx = $scope.listaProductosProveedor.indexOf(producto.id);
			if (indx >= 0 && !producto.seleccionado) {
				$scope.listaProductosProveedor.splice(indx, 1);
			} else if (indx == -1 && producto.seleccionado) {
				$scope.listaProductosProveedor.push(producto.id);
			}
		};

		$scope.seleccionarTodosParaAsignar = function () {
			if ($scope.seleccionProductosProveedor.seleccionar_todos) {
				$scope.productosAsignacionProveedor.forEach(function (producto) {
					producto.seleccionado = true;
					$scope.modificarListaProductosProveedor(producto)
				});
			} else {
				$scope.productosAsignacionProveedor.forEach(function (producto) {
					producto.seleccionado = false;
					$scope.modificarListaProductosProveedor(producto)
				});
			}
		};

		$scope.actualizarProductosProveedor = function () {
			var prom = ActualizarProductosProveedor($scope.usuarioSesion.id_empresa, $scope.listaProductosProveedor, $scope.pedido.proveedor);
			prom.then(function (res) {
				if (res.hasErr) {
					$scope.mostrarMensaje(res.mensaje);
				} else {
					$scope.mostrarMensaje(res.mensaje);
					$scope.cerrarModalProductosProveedor()
				}
			}).catch(function (err) {
				blockUI.stop();
				var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
				$scope.mostrarMensaje(memo);
			})
		};

		$scope.buscarProductos = function (pagina) {
			blockUI.start();
			if (pagina) {
				$scope.paginatorProductos.currentPage = pagina;
			}
			$scope.paginatorProductos.filter = $scope.configuracionPorveedor.grupo ? $scope.configuracionPorveedor.grupo : { id: 0 };
			$scope.paginatorProductos.search = $scope.configuracionPorveedor.textoBusqueda ? $scope.configuracionPorveedor.textoBusqueda : 0
			// var promesa = ProductosPaginador($scope.usuarioSesion.id_empresa, $scope.paginatorProductos, $scope.usuarioSesion.id); //por grupos
			var promesa = ProductosPaginadorSubgrupos($scope.usuarioSesion.id_empresa, $scope.paginatorProductos, $scope.usuarioSesion.id); ///por subgrupos
			promesa.then(function (dato) {
				if (dato.hasErr) {
					$scope.mostrarMensaje(dato.mensaje);
				} else {
					$scope.paginatorProductos.setPages(dato.paginas);
					$scope.productosAsignacionProveedor = dato.productos;
					if ($scope.pedido && $scope.pedido.proveedor) {
						var prom = ListaProductosProveedores($scope.usuarioSesion.id_empresa, $scope.pedido.proveedor);
						prom.then(function (res) {
							if (res.hasErr) {
								$scope.mostrarMensaje(res.mensaje);
								$scope.listaProductosProveedor = [];
							} else {
								if (res.productos) {
									var arr = res.productos.split(',');
									$scope.listaProductosProveedor = arr.map(function (id) {
										return parseInt(id);
									});
									$scope.verificarAsignacionProductosProveedor();
								} else {
									$scope.listaProductosProveedor = [];
								}
							}
							blockUI.stop();
						}).catch(function (err) {
							blockUI.stop();
							var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
							$scope.mostrarMensaje(memo);
						})
					}
				}
				blockUI.stop();
			}).catch(function (err) {
				blockUI.stop();
				var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
				$scope.mostrarMensaje(memo);
			});
		};

		$scope.obtenerProductosAsignados = function () {
			$scope.paginatorProductosAsignados = Paginator();
			$scope.paginatorProductosAsignados.column = "nombre";
			$scope.paginatorProductosAsignados.filter = $scope.grupo;
			$scope.paginatorProductosAsignados.callBack = $scope.buscarProductosAsignados;
			$scope.paginatorProductosAsignados.getSearch("", null, null);
		};

		$scope.buscarProductosAsignados = function (pagina, pedido) {
			blockUI.start();
			if (pagina) {
				$scope.paginatorProductosAsignados.currentPage = pagina;
			}
			if ($scope.pedido === undefined) {
				$scope.pedido = {};
				blockUI.stop();
			} else {
				if ($scope.pedido.proveedor) {
					$scope.paginatorProductosAsignados.filter = $scope.productosAsignadosPorveedor.grupo ? $scope.productosAsignadosPorveedor.grupo : { id: 0 };
					$scope.paginatorProductosAsignados.search = $scope.productosAsignadosPorveedor.textoBusqueda ? $scope.productosAsignadosPorveedor.textoBusqueda : 0
					var prom = ListaProductosProveedores($scope.usuarioSesion.id_empresa, $scope.pedido.proveedor);
					prom.then(function (res) {
						if (res.hasErr) {
							$scope.mostrarMensaje(res.mensaje);
							$scope.listaProductosProveedor = [];
						} else {
							if (res.productos) {
								var arr = res.productos.split(',');
								$scope.listaProductosProveedor = arr.map(function (id) {
									return parseInt(id);
								});
								var promesa = ProductosPaginadorAsignados($scope.usuarioSesion.id_empresa, $scope.paginatorProductosAsignados, $scope.usuarioSesion.id, $scope.listaProductosProveedor); ///por subgrupos
								promesa.then(function (dato) {
									if (dato.hasErr) {
										$scope.mostrarMensaje(dato.mensaje);
									} else {
										$scope.paginatorProductosAsignados.setPages(dato.paginas);
										$scope.productosAsignadosProveedor = dato.productos;
										$scope.listaProductosProveedorSeleccionados = []
										$scope.verificarSeleccionProductosProveedor()
									}
									blockUI.stop();
								}).catch(function (err) {
									blockUI.stop();
									var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
									$scope.mostrarMensaje(memo);
								});
							} else {
								$scope.listaProductosProveedor = [];
							}
						}
						blockUI.stop();
					}).catch(function (err) {
						blockUI.stop();
						var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
						$scope.mostrarMensaje(memo);
					})

				} else {
					$scope.mostrarMensaje('El proveedor no tiene productos asignados.')
				}
			}
		};

		$scope.verificarSeleccionProductosProveedor = function () {
			if ($scope.listaProductosProveedorSeleccionados.length > 0) {
				$scope.listaProductosProveedorSeleccionados.forEach(function (id) {
					$scope.productosProveedorSeleccionados.forEach(function (producto) {
						if (producto.id === id) {
							producto.seleccionado = true
						}
					})
				})
			}
		};

		$scope.filtrarProductosSeleccionadosPorGrupo = function () {
			if ($scope.detallesPedido.length > 0) {
				var productosPorGrupo = [];
				$scope.detallesPedido.forEach(function (prod) {
					if (prod.id_subgrupo === $scope.pedido.grupo) {
						productosPorGrupo.push(prod);
					}
				});
				if (productosPorGrupo.length > 0) {
					$scope.detallesPedido = productosPorGrupo.map(function (prod) {
						return prod;
					});
				}else {
					$scope.mostrarMensaje('No existen productos pertenecientes al grupo seleccionado. No se realizaron cambios.')
				}
			}
		}

		$scope.abrirmodalBusquedaProveedor = function () {
			$scope.filtrarProveedores("");
			$scope.abrirPopup($scope.idDialogBusquedaProveedor);
		};

		$scope.cerrarModalBusquedaProveedor = function () {
			$scope.cerrarPopup($scope.idDialogBusquedaProveedor);
		};

		$scope.abrirmodalProductosAsignadosProveedor = function () {
			if ($scope.pedido === undefined) {
				$scope.pedido = { por_proveedor: false };
			}
			if ($scope.pedido.proveedor) {
				$scope.generarPorProveedor();
				$scope.buscarProductosAsignados();
				$scope.abrirPopup($scope.idDialogProductosAsigandosProveedor);
			} else {
				$scope.mostrarMensaje('Seleccione un proveedor.');
			}
		};

		$scope.cerrarModalProductosAsignadosProveedor = function () {
			$scope.cerrarPopup($scope.idDialogProductosAsigandosProveedor);
		};

		$scope.cerrarModalProductosProveedor = function () {
			$scope.productosAsignacionProveedor = [];
			$scope.listaProductosProveedor = [];
			$scope.cerrarPopup($scope.idDialogProductosProveedor);
		};

		$scope.abrirModalNuevoPedido = function () {
			$scope.abrirPopup($scope.idDialogoNuevoPedido);
		}

		$scope.cerrarModalNuevoPedido = function () {
			$scope.detallesPedido = []
			$scope.pedido = {}
			$scope.detallePedido = {}
			$scope.solicitudesPedido = []
			$scope.cerrarPopup($scope.idDialogoNuevoPedido);
		}

		$scope.eliminarDetallePedido = function (detalle) {
			if (detalle.id) {
				detalle.eliminar = true
			} else {
				$scope.detallesPedido.splice($scope.detallesPedido.indexOf(detalle), 1);
			}
		}

		$scope.guardarPedido = function (pedido, generado) {
			blockUI.start()
			if (pedido !== undefined && $scope.detallesPedido.length > 0) {
				if (generado) {
					pedido.solicitudesIds = $scope.solicitudesPedido.map(function (solicitud) {
						return solicitud
					})
				}
				var fortime = new Date()
				var dateSplit = pedido.fecha.split('/').reverse()
				var sendPedido = {
					fecha: new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], fortime.getHours(), fortime.getMinutes()),
					sucursal: pedido.sucursal,
					almacen: pedido.almacen,
					proveedor: pedido.proveedor.id,
					observacion: pedido.observacion,
					grupo: (pedido.grupo !== undefined ? pedido.grupo !== null ? pedido.grupo : 0 : 0),
					detallesPedido: $scope.detallesPedido,
					usuario: $scope.usuarioSesion.id,
					solicitudesIds: pedido.generado ? $scope.solicitudesPedido : []
				}
				var prom = GuardarPedido($scope.usuario.id_empresa, sendPedido, $scope.usuarioSesion.id)
				prom.then(function (res) {
					blockUI.stop()
					if (res.hasErr) {
						$scope.mostrarMensaje(res.mensaje)
					} else {
						$scope.mostrarMensaje(res.mensaje)
						$scope.recargarItemsTabla()
					}
					
				}).catch(function (err) {
					blockUI.stop()
					var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
					$scope.mostrarMensaje(msg)
				})
			} else {
				if ($scope.detallesPedido.length > 0) {
					$scope.mostrarMensaje('Existe un problema con los datos del pedido, no se puede generar!')
				} else {
					$scope.mostrarMensaje('Existe un problema con los datos del pedido, no se puede generar sin lista de productos!')
				}
				blockUI.stop()
			}
		}

		$scope.inicio()
	})