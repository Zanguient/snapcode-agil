angular.module('agil.controladores')
	.controller('ControladorOperaciones', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage,
		blockUI, ConfiguracionVentaVistaDatos, ClasesTipo, ListaGruposProductoEmpresa, ProductosPanel, socket, ListaGruposProductoEmpresa, SolicitudesReposicion,
		SolicitudesFormulacionProducto, SolicitudReposicion, EliminarSolicitudReposicion, Paginator, ImpresionSolicitudDatos, ListaInventariosProducto) {

		$scope.usuario = JSON.parse($localStorage.usuario);
		convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
			$scope.usuario.empresa.imagen = imagenEmpresa;
		});

		$scope.idDialogDialogPanelOperaciones = "dialog-panel-operaciones"
		$scope.idDialogDatos = "modal-wizard-venta-edicion"
		$scope.idDialogEntregaViveres = "dialogEntregaViveres"
		$scope.idConfirmacionCierre = "dialog-confirmacion-entrega"
		$scope.idDialogTotalIngredientes = "dialog-total-ingredientes"

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsOperaciones($scope.idDialogDialogPanelOperaciones, $scope.idDialogEntregaViveres, $scope.idConfirmacionCierre, $scope.idDialogTotalIngredientes);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
		});

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idDialogDialogPanelOperaciones);
			$scope.eliminarPopup($scope.idDialogEntregaViveres);
			$scope.eliminarPopup($scope.idConfirmacionCierre)
			$scope.eliminarPopup($scope.idDialogTotalIngredientes)
		})

		$scope.inicio = function () {
			$scope.ordenProductos = true;
			$scope.esContado = true;
			$scope.obtenerConfiguracionVentaVista();
			$scope.alreadyCalculated = false
			$scope.sucursalesUsuario = "";
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
				if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
					$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
				}
			}
			$scope.detalleVenta = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
			$scope.solicitud = { solicitudesProductos: [] }
			$scope.obtenerPaginador()
			$scope.sucursales = $scope.obtenerSucursales();
		}
		$scope.obtenerPaginador = function () {
			blockUI.start();
			$scope.paginator = Paginator();
			$scope.paginator.column = "fecha";
			$scope.paginator.direccion = "asc";
			$scope.filtro = { empresa: $scope.usuario.id_empresa, rol: $scope.usuario.rolesUsuario[0].rol.nombre, id: $scope.usuario.id, desde: 0, hasta: 0, sucursal: 0, almacen: 0, movimiento: 0, estado: 0, valuado: 0, pagina: 1, items_pagina: 10, busqueda: "" };
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
				$scope.solicitudesOperaciones
				blockUI.stop()
			}, function (error) {
				$scope.mostrarMensaje(error.data)
				blockUI.stop()
			})
		}

			$scope.obtenerSucursales = function () {
				var sucursales = [];
				for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
					sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
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
					$scope.almacenes = sucursal.almacenes;
					if ($scope.solicitud.almacen) {
						$scope.cargarProductos();
					}
				}
			}
			$scope.eliminar = function (solicitud) {
				$scope.solicitud = solicitud
				$scope.solicitud.solicitudesProductos.map(function (prod) {
					var promesa = ListaInventariosProducto(prod.productoSolicitado.id, $scope.solicitud.almacen.id);
					promesa.then(function (inventarios) {
						prod.inventarios = inventarios
						prod.inventario_disponible_utilizado = prod.cantidad
						if($scope.solicitud.solicitudesProductos.indexOf(prod) ==$scope.solicitud.solicitudesProductos.length-1 ){
							EliminarSolicitudReposicion.save({ id_solicitud: solicitud.id }, solicitud, function (res) {
								$scope.mostrarMensaje(res.mensaje)
								$scope.obtenerSolicitudes()
								$scope.solicitud = undefined
							}, function (error) {
								$scope.solicitud = undefined
								$scope.mostrarMensaje(error.data)
								blockUI.stop()
							})
						}
					})
				})
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
		
		$scope.calcularTotalViveres = function (solicitud) {
			// if(!$scope.alreadyCalculated){
			$scope.totalViveresSolicitados = []
			if (solicitud !== undefined) {
				$scope.solicitud = solicitud
				$scope.totalViveresSolicitados.usuario = solicitud.usuario
				$scope.totalViveresSolicitados.fecha = solicitud.fecha
				$scope.totalViveresSolicitados.sucursal = solicitud.almacen.sucursal
				$scope.totalViveresSolicitados.identificador = solicitud.id
			}


			// $scope.totalViveresSolicitados.push.apply()
			// indx = 0
			var xArr = []
			$scope.solicitud.solicitudesProductos.map(function (producto) {
				if (producto.eliminado === false || producto.eliminado === undefined) {
					if (producto.detallesIngredientesProducto.length > 0) {
						producto.detallesIngredientesProducto.map(function (ingrediente) {
							if (ingrediente.eliminado === undefined || ingrediente.eliminado === false) {
								var obj = {
									cantidad_ideal: ingrediente.cantidad_ideal,
									cantidad_real: ingrediente.cantidad_real,
									id: ingrediente.id,
									id_detalle_solicitud_producto: ingrediente.id_detalle_solicitud_producto,
									id_producto_base: ingrediente.id_producto_base,
									productoSolicitudBase: ingrediente.productoSolicitudBase,
									total: 0
								}
								xArr.push(obj)
							}
						})
					} else {
						var obj = {
							cantidad_ideal: 1,
							cantidad_real: producto.cantidad,
							id: undefined,
							id_detalle_solicitud_producto: producto.id,
							id_producto_base: producto.id_producto,
							productoSolicitudBase: producto.productoSolicitado,
							total: 0
						}
						xArr.push(obj)
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
				// xArr.slice(element,1)
				delete xArr[element]
			});
			// $scope.totalViveresSolicitados = 
			xArr.map(function (itm) {
				if (itm !== undefined) {
					var obj = {
						cantidad_ideal: 0,
						cantidad_real: 0,
						id: itm.id,
						id_detalle_solicitud_producto: itm.id_detalle_solicitud_producto,
						id_producto_base: itm.id_producto_base,
						productoSolicitudBase: itm.productoSolicitudBase,
						total: 0
					}
					$scope.totalViveresSolicitados.push(obj)
				}
			})
			
			$scope.solicitadoTotalFinalBs = 0
			var alreadyCount = []
			$scope.totalViveresSolicitados.map(function (producto) {
				// producto.total = 0
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
			if (solicitud == undefined) {
				$scope.abrirDialogTotalIngredientes()
			} else {
				$scope.solicitud = undefined
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
			$scope.productosProcesados.map(function (prod) {
				if (prod.id == detalleVenta.productoSolicitado.id && !disminuido) {
					prod.inventario_disponible += detalleVenta.cantidad
				}
			})
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
				$scope.eliminarDetalleVenta($scope.productoSeleccionado,true);
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
			$scope.productosProcesados.map(function (prod) {
				if (prod.id == detalleVenta.productoSolicitado.id) {
					prod.inventario_disponible +=1
				}
			})
			if (detalleVenta.cantidad == 1) {
				$scope.eliminarDetalleVenta(detalleVenta,true);
			} else {
				detalleVenta.cantidad = detalleVenta.cantidad - 1;
				detalleVenta.detallesIngredientesProducto.map(function (prod) {
					prod.total = detalleVenta.cantidad * prod.cantidad_ideal
				})

			}
		}
		$scope.actualizarTotalReal= function (prod) {
			prod.detallesIngredientesProducto.map(function (ing) {
				ing.total = prod.cantidad*ing.cantidad_ideal
			})
			// $scope.productosProcesados.map(function (prodProc) {
			// 	if (prodProc.id == prod.productoSolicitado.id) {
			// 		prodProc.inventario_disponible =prodProc.inventario_disponible - (prod.cantidad - prod.inventario_disponible_utilizado)
			// 	}
			// })
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
			if($scope.solicitud !== undefined){
				return new Date($scope.solicitud.fecha)
			}else{
				return new Date()
			}
		}

		$scope.guardarOperacionPanel = function (formValid, solicitud) {
			blockUI.start()
			var montobs = 0
			if (formValid) {
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
										// ingrediente.total = ingrediente.cantidad_real * produc.cantidad
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
				var fil = { id_empresa: $scope.usuario.id_empresa, rol: $scope.usuario.rolesUsuario[0].rol.nombre, id_usuario: $scope.usuario.id, desde: 0, hasta: 0, sucursal: 0, almacen: 0, movimiento: 0, estado: 0, valuado: 0, pagina: 1, items_pagina: 1000, busqueda: 0 };
				if (solicitud.modificar === undefined) {
					solicitud.fecha = new Date()
					solicitud.id_usuario = $scope.usuario.id
					solicitud.activo = true

					SolicitudReposicion.save(fil, solicitud, function (res) {
						blockUI.stop()
						$scope.mostrarMensaje(res.mensaje)
						$scope.cerrarPopupPanel()
					}, function (error) {
						blockUI.stop()
						$scope.mostrarMensaje(error.data)
					})
				} else {
					SolicitudReposicion.update(fil, solicitud, function (res) {
						blockUI.stop()
						$scope.mostrarMensaje(res.mensaje)
						$scope.cerrarPopupPanel()
					}, function (error) {
						blockUI.stop()
						$scope.mostrarMensaje(error.data)
					})
				}
			} else {
				$scope.mostrarMensaje('Complete los campos requeridos')
			}
		}

		$scope.obtenerInventariosProdSolicitud = function () {
			$scope.solicitud.solicitudesProductos.map(function (prod) {
				var promesa = ListaInventariosProducto(prod.productoSolicitado.id, $scope.solicitud.almacen.id);
				promesa.then(function (inventarios) {
					prod.inventarios = inventarios
					prod.inventario_disponible_utilizado = prod.cantidad
					// prod.inventarios.map(function (inv) {
					// 	prod.inventario_disponible =
					// })
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
			})
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					cantidadTotal += (producto.inventarios[i].cantidad);
				}
				if($scope.solicitud.solicitudesProductos!==undefined && $scope.solicitud.copia){
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
			var promesa = ProductosPanel($scope.usuario.id_empresa, $scope.solicitud.almacen.id);
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

		$scope.agregarDetalleVentaPanel = function (producto) {
			var monto = 0
			var detalleVenta;
			$scope.cantidadInventario =0;
			if (producto.activar_inventario) {
				$scope.cantidadInventario=producto.inventario_disponible
				// for (var i = 0; i < producto.inventarios.length; i++) {
				// 	$scope.cantidadInventario = $scope.cantidadInventario + producto.inventarios[i].cantidad;
				// }
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
								producto.inventario_disponible -= 1
								// var indx = $scope.productosProcesados.indexOf(producto)
								// $scope.productosProcesados[indx].inventarios[0].cantidad -=1
								// producto.inventarios[i].cantidad -=1
							}
						}
						j++;
					}
					if (!encontrado) {
						var formulacion = SolicitudesFormulacionProducto((producto.producto !== undefined) ? producto.producto.id : (producto.id !== undefined) ? producto.id : undefined)
						var ingredientes = []
						formulacion.then(function (formula) {
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
								producto.inventario_disponible -= 1
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
							producto.inventario_disponible -= 1
							$scope.solicitud.solicitudesProductos.push(detalleVenta);
						}
					} else {
						producto.eliminado = undefined
					}
				} else {
					$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
				}
			}else{
				var j = 0, encontrado = false
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
							// producto.inventario_disponible -= 1
							// var indx = $scope.productosProcesados.indexOf(producto)
							// $scope.productosProcesados[indx].inventarios[0].cantidad -=1
							// producto.inventarios[i].cantidad -=1
						}
					}
					j++;
				}
				if (!encontrado) {
					var formulacion = SolicitudesFormulacionProducto((producto.producto !== undefined) ? producto.producto.id : (producto.id !== undefined) ? producto.id : undefined)
					var ingredientes = []
					formulacion.then(function (formula) {
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
					})
					detalleVenta = {
						productoSolicitado: producto, precio_unitario: producto.precio_unitario,
						inventario_disponible: $scope.cantidadInventario,
						inventarios: producto.inventarios,
						cantidad: 1,
						detallesIngredientesProducto: ingredientes
					};
					$scope.solicitud.solicitudesProductos.push(detalleVenta);
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
			var fil = { id_empresa: $scope.usuario.id_empresa, rol: $scope.usuario.rolesUsuario[0].rol.nombre, id_usuario: $scope.usuario.id, desde: 0, hasta: 0, sucursal: 0, almacen: 0, movimiento: 0, estado: 0, valuado: 0, pagina: 1, items_pagina: 1000, busqueda: 0 };
			$scope.solicitudCerrar.activo = false
			SolicitudReposicion.update(fil, $scope.solicitudCerrar, function (res) {
				$scope.mostrarMensaje(res.mensaje)
			})
			$scope.solicitudCerrar = undefined
			$scope.cerrarDialogConfirmacionCierre()
		}

		$scope.editar = function (solicitud) {
			$scope.solicitud = solicitud
			$scope.solicitud.fechaTexto = $scope.fechaATexto($scope.solicitud.fecha)
			$scope.solicitud.modificar = true
			$scope.solicitud.sucursal = $scope.solicitud.almacen.sucursal
			$scope.obtenerAlmacenes($scope.solicitud.sucursal.id)
			$scope.solicitud.almacen = $scope.solicitud.almacen
			$scope.obtenerInventariosProdSolicitud()
			$scope.abrirDialogPanelOperaciones()
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
			var promesa = ListaGruposProductoEmpresa($scope.usuario.id_empresa);
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
		
				$scope.cambiarListaGruposCheck=function(grupo){console.log(grupo);
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
				// producto.elNombre = (producto.producto !== undefined) ? producto.producto.nombre : (producto.productoSolicitado !== undefined) ? producto.productoSolicitado.nombre : productito.productoSolicitudBase.nombre
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
			$scope.sucursal = {}
			$scope.almacen = {}
			if ($scope.solicitud !== undefined) {
				if ($scope.solicitud.id === undefined) {
					$scope.productoSeleccionado = undefined
					$scope.solicitud.fechaTexto = $scope.fechaATexto(new Date())
				} else {
					if ($scope.solicitud.copia === undefined) {
						$scope.solicitud.fechaTexto = $scope.fechaATexto(new Date($scope.solicitud.fecha))
						$scope.solicitud.nueva = true
					} else {
						$scope.solicitud.id = undefined
						$scope.solicitud.fechaTexto = $scope.fechaATexto(new Date())
						$scope.solicitud.activo = true
					}
				}
			} else {
				$scope.solicitud = {}
				$scope.solicitud.fechaTexto = $scope.fechaATexto(new Date())
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
			$scope.obtenerSolicitudes()
			$scope.productosProcesados = []
			$scope.cerrarPopup($scope.idDialogDialogPanelOperaciones);
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
			// $scope.totalViveresSolicitados=[]

			$scope.abrirPopup($scope.idDialogTotalIngredientes);
		}
		$scope.cerrarDialogTotalIngredientes = function () {
			// $scope.totalViveresSolicitados = []
			$scope.alreadyCalculated = false
			$scope.cerrarPopup($scope.idDialogTotalIngredientes);
		}

		$scope.generarPdfSolicitud = function (solicitud) {

			blockUI.start();
			$scope.calcularTotalViveres(solicitud)

			var doc = new PDFDocument({ size: [612, 792], margin: 10 });
			var stream = doc.pipe(blobStream());
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.font('Helvetica', 8);
			var y = 115, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil($scope.totalViveresSolicitados.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFSolicitud(doc, pagina, totalPaginas);

			for (var i = 0; i < $scope.totalViveresSolicitados.length && items <= itemsPorPagina; i++) {
				// doc.rect(40, y - 10, 540, 40).stroke();

				doc.font('Helvetica', 8);
				doc.text(i + 1, 65, y);
				doc.text($scope.totalViveresSolicitados[i].productoSolicitudBase.codigo, 100, y);
				doc.text($scope.totalViveresSolicitados[i].productoSolicitudBase.nombre, 220, y);
				doc.text($scope.totalViveresSolicitados[i].productoSolicitudBase.unidad_medida, 400, y);
				doc.text($scope.totalViveresSolicitados[i].totalMostrar.toFixed(2), 500, y);
				y = y + 20;
				items++;

				if (items > itemsPorPagina) {
					doc.rect(40, 105, 540, y - 115).stroke();
					doc.text(pagina + "/" + totalPaginas, 570, y + 15);
					doc.font('Helvetica', 6);
					doc.text("RESPONSABLE: " + $scope.usuario.nombre_usuario, 45, y + 10);
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
			doc.text("RESPONSABLE: " + $scope.usuario.nombre_usuario, 45, y + 5);
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
			// doc.font('Helvetica', 8);
			//doc.text("Desde  "+reporte.fechaInicioTexto,-70,40,{align:"center"});
			//doc.text("Hasta "+reporte.fechaFinTexto,70,40,{align:"center"});
			//doc.text("FOLIO "+pagina,550,25);
			// doc.rect(40, 60, 540, 40).stroke();
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
			// doc.text("NIT : ", 440, 75);
			// doc.font('Helvetica', 8);
			//doc.text(datos.empresa.razon_social,195,75);
			//doc.text(datos.empresa.nit,460,75);		
			doc.rect(40, 80, 540, 25).stroke();
			doc.font('Helvetica-Bold', 8);

			doc.text("Nº", 65, 90);
			doc.text("Código Ítem", 100, 90);
			doc.text("Producto", 220, 90);
			doc.text("Unidad medida", 380, 90);
			doc.text("Cantidad solicitada", 480, 90);
			// doc.text("Lote", 405, 110, { width: 35 });
			// doc.text("Descuento", 440, 110);
			// doc.text("Recargo", 490, 110);
			// doc.text("Total", 535, 110);
			// doc.font('Helvetica', 8);
		}
		$scope.inicio()
	})