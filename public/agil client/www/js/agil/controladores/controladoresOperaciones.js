angular.module('agil.controladores')
	.controller('ControladorOperaciones', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage,
		blockUI, ConfiguracionVentaVistaDatos, ClasesTipo, ListaGruposProductoEmpresa, ProductosPanel, socket, ListaGruposProductoEmpresa, SolicitudesReposicion,
		SolicitudesFormulacionProducto, SolicitudReposicion, EliminarSolicitudReposicion, Paginator) {

		$scope.usuario = JSON.parse($localStorage.usuario);
		convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
			$scope.usuario.empresa.imagen = imagenEmpresa;
		});

		$scope.idDialogDialogPanelOperaciones = "dialog-panel-operaciones"
		$scope.idDialogDatos = "modal-wizard-venta-edicion"
		$scope.idDialogEntregaViveres = "dialogEntregaViveres"
		$scope.idConfirmacionCierre = "dialog-confirmacion-entrega"

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsOperaciones($scope.idDialogDialogPanelOperaciones, $scope.idDialogEntregaViveres, $scope.idConfirmacionCierre);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			// $scope.obtenerColumnasAplicacion();
		});

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idDialogDialogPanelOperaciones);
			$scope.eliminarPopup($scope.idDialogEntregaViveres);
			$scope.eliminarPopup($scope.idConfirmacionCierre)
		})

		$scope.inicio = function () {
			$scope.ordenProductos = true;
			$scope.esContado = true;
			//$scope.obtenerClientes();
			// $scope.obtenerTiposDePago();
			$scope.obtenerConfiguracionVentaVista();

			// $scope.obtenerMovimientosOperaciones()
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
			$scope.filtro.desde = ($scope.filtro.fechaInicioTexto !== undefined) ? $scope.convertirFecha($scope.filtro.fechaInicioTexto) : 0
			$scope.filtro.hasta = ($scope.filtro.fechaFinTexto !== undefined) ? $scope.convertirFecha($scope.filtro.fechaFinTexto) : 0
			$scope.filtro.movimiento = 0// ($scope.filtro.movimiento !== null)?($scope.filtro.movimiento.id !==undefined)?$scope.filtro.movimiento.id:0:0
			$scope.filtro.estado = ($scope.filtro.estado !== null) ? ($scope.filtro.estado.id !== undefined) ? $scope.filtro.estado.id : 0 : 0
			var promesa = SolicitudesReposicion($scope.filtro)
			promesa.then(function (solicitudes) {
				$scope.paginator.setPages(solicitudes.paginas);
				$scope.solicitudesOperaciones = solicitudes.solicitudes
				blockUI.stop()
			}, function (error) {
				$scope.mostrarMensaje(error.data)
				blockUI.stop()
			})

			$scope.obtenerSucursales = function () {
				var sucursales = [];
				for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
					sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
				}
				return sucursales;
			}
			$scope.obtenerAlmacenes = function (idSucursal) {
				var comp = idSucursal * 1
				if (comp !== NaN) {
					$scope.almacenes = [];
					var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
					$scope.almacenes = sucursal.almacenes;
					// $scope.solicitud.almacen=$scope.almacenes.length==1?$scope.almacenes[0]:null;
					if ($scope.solicitud.almacen) {
						$scope.cargarProductos();

					}
				}
			}
			$scope.eliminar = function (solicitud) {
				$scope.cerrarConfirmacionEliminacion();
				EliminarSolicitudReposicion.save({ id_solicitud: solicitud.id }, {}, function (res) {
					$scope.mostrarMensaje(res.mensaje)
					$scope.obtenerSolicitudes()
				})
			}

			$scope.ver = function (solicitud) {
				$scope.solicitud = solicitud
				$scope.solicitud.ver = true
				$scope.solicitud.sucursal = $scope.solicitud.almacen.sucursal
				$scope.obtenerAlmacenes($scope.solicitud.sucursal.id)
				$scope.solicitud.almacen = $scope.solicitud.almacen
				$scope.solicitud.ingredientes = $scope.solicitud.solicitudesProductos
				$scope.solicitud.ingredientes = $scope.solicitud.solicitudesProductos.map(function (producto) {
					producto.elNombre = (producto.producto !== undefined) ? producto.producto.nombre : (producto.productoSolicitado !== undefined) ? producto.productoSolicitado.nombre : productito.productoSolicitudBase.nombre
				})
				$scope.abrirDialogPanelOperaciones()
			}

		}

		if (angular.isDefined($localStorage.color)) {
			$scope.color = $localStorage.color;
		} else {
			$localStorage.color = { 'style': 'red-style', 'stylebutton': 'red-style-button' };
			$scope.color = { 'style': 'red-style', 'stylebutton': 'red-style-button' };
		}
		$scope.clasificarGrupo = function (grupo) {
			$scope.productosProcesados = $filter('filter')($scope.productos, grupo);
			setTimeout(function () {
				aplicarSwiper(4, 3, true, 2);
			}, 5);
		}

		$scope.checkVentaDetalleProducto = function (producto) {
			$scope.sugerencias = [{ nombre: 'Silpancho' }, { nombre: 'Pique' }]
			$scope.sugerencias.push(producto)
			for (var j = 0; j < $scope.solicitud.solicitudesProductos.length; j++) {
				if ($scope.solicitud.solicitudesProductos[j].producto.nombre == producto.nombre) {
					producto.estaAhi = true
				}
			}
			var indice = $scope.productosProcesados.indexOf(producto);
			$scope.productosProcesados[indice] = producto;
		}
		$scope.verFormulacion = function (producto) {
			if ($scope.productoSeleccionado !== undefined) {
				if (producto.producto !== undefined) {
					if ($scope.productoSeleccionado.producto){
						var idn = ($scope.productoSeleccionado.producto !== undefined) ? $scope.productoSeleccionado.producto.id : $scope.productoSeleccionado.productoSolicitado.id						
					}
					if (producto.producto.id != idn) {
						var indice = $scope.solicitud.solicitudesProductos.indexOf(producto);
						$scope.solicitud.solicitudesProductos[indice].verFormulacion = undefined;
						$scope.productoSeleccionado.verFormulacion = undefined
					}
				} else {
					var idn = ($scope.productoSeleccionado.producto !== undefined) ? $scope.productoSeleccionado.producto.id : $scope.productoSeleccionado.productoSolicitado.id
					if (producto.id_producto != idn) {
						var indice = $scope.solicitud.solicitudesProductos.indexOf(producto);
						$scope.solicitud.solicitudesProductos[indice].verFormulacion = undefined;
						$scope.productoSeleccionado.verFormulacion = undefined
					}
				}

			}
			if (producto.verFormulacion === undefined) {
				producto.verFormulacion = true
			} else {
				producto.verFormulacion = undefined
			}
			$scope.productoSeleccionado = producto
			if (producto.ingredientes === undefined) {
				id = (producto.id_producto!==undefined)?producto.id_producto:(producto.producto!==undefined)?producto.producto.id:(producto.productoSolicitado!==undefined)?producto.productoSolicitado.id:0
				var formulacion = SolicitudesFormulacionProducto(id)
				formulacion.then(function (formula) {
					$scope.productoSeleccionado.ingredientes = formula.productosBase
					console.log($scope.productoSeleccionado)
				})
			}
		}

		$scope.eliminarDetalleVenta = function (detalleVenta) {
			if (detalleVenta.id === undefined) {
				$scope.solicitud.solicitudesProductos.splice($scope.solicitud.solicitudesProductos.indexOf(detalleVenta), 1);
			} else {
				detalleVenta.eliminado = true
				detalleVenta.cantidad=0
			}

			// $scope.sumarTotal();
			// $scope.sumarTotalImporte();
			// $scope.calcularSaldo();
			// $scope.calcularCambio();
			// $scope.capturarInteraccion();
		}
		$scope.eliminarIngrediente = function (detalleVenta) {
			if (detalleVenta.id === undefined) {
				$scope.productoSeleccionado.ingredientes.splice($scope.productoSeleccionado.ingredientes.indexOf(detalleVenta), 1);
			} else {
				detalleVenta.eliminado = true
			}
			if($scope.productoSeleccionado.ingredientes.length == 0){
				$scope.productoSeleccionado.ingredientes = undefined
				$scope.eliminarDetalleVenta($scope.productoSeleccionado);
			}else{
				var count = 0
				$scope.productoSeleccionado.ingredientes.map(function (ingr) {
					count += (ingr.eliminado===true)?1:0
				})
				if(count == $scope.productoSeleccionado.ingredientes.length){
					$scope.productoSeleccionado.ingredientes = undefined
					$scope.eliminarDetalleVenta($scope.productoSeleccionado);
				}
			}
			// $scope.productoSeleccionado.ingredientes.splice($scope.productoSeleccionado.ingredientes.indexOf(detalleVenta),1);
			// $scope.sumarTotal();
			// $scope.sumarTotalImporte();
			// $scope.calcularSaldo();
			// $scope.calcularCambio();
			// $scope.capturarInteraccion();
		}
		$scope.disminuirDetalleVenta = function (detalleVenta) {
			if (detalleVenta.cantidad == 1) {
				$scope.eliminarDetalleVenta(detalleVenta);
			} else {
				detalleVenta.cantidad = detalleVenta.cantidad - 1;
				// $scope.calcularImporteDetalleVenta(detalleVenta);
				// $scope.sumarTotal();
				// $scope.sumarTotalImporte();
				// $scope.calcularSaldo();
				// $scope.capturarInteraccion();
			}
		}

		$scope.obtenerActividades = function (idSucursal) {
			$scope.actividades = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
			$scope.actividadesDosificaciones = sucursal.actividadesDosificaciones;
			$scope.actividades = [];
			for (var i = 0; i < $scope.actividadesDosificaciones.length; i++) {
				$scope.actividades.push($scope.actividadesDosificaciones[i].actividad);
			}
			$scope.solicitud.actividad = $scope.actividades.length == 1 ? $scope.actividades[0] : null;
		}
		// $scope.obtenerMovimientosOperaciones = function () {
		// 	// $scope.movimientosEgreso=
		// 	blockUI.start();
		// 	var promesa = ClasesTipo("MOVOP");
		// 	promesa.then(function (entidad) {
		// 		$scope.movimientos = entidad.clases;
		// 		console.log($scope.movimientos)
		// 		blockUI.stop();
		// 	});
		// }

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
			return new Date
		}
		$scope.guardarOperacionPanel = function (formValid, solicitud) {
			blockUI.start()
			var monto = 0
			if (formValid) {
				solicitud.solicitudesProductos.map(function (produc) {
					var prodMonto = 0
					if(produc.ingredientes !==undefined){
						if (produc.ingredientes.length < 1) {
							if (produc.eliminado===undefined) {
								prodMonto += (produc.precio_unitario !== undefined) ? produc.precio_unitario : produc.productoSolicitado.precio_unitario
							}
						} else {
							produc.ingredientes.map(function (ingrediente) {
								if (ingrediente.eliminado === undefined) {
									var multiplicador = (ingrediente.cantidad_real !== undefined) ? (ingrediente.cantidad_real === 0) ? 1 : ingrediente.cantidad_real : (ingrediente.formulacion !== undefined) ? parseFloat(ingrediente.formulacion) : (ingrediente.cantidad_ideal === 0) ? 1 : ingrediente.cantidad_ideal
									prodMonto += (ingrediente.productoBase === undefined) ? ingrediente.productoSolicitudBase.precio_unitario * multiplicador : ingrediente.productoBase.precio_unitario * multiplicador
								}
							})
						}
					}else{
						if (produc.eliminado===undefined) {
							prodMonto += (produc.precio_unitario !== undefined) ? produc.precio_unitario : produc.productoSolicitado.precio_unitario
						}
					}
					
					monto += prodMonto * produc.cantidad
				})
				solicitud.monto = monto
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
		// $scope.obtenerInventarioTotal = function (producto) {
		// 	var cantidadTotal = 0;
		// 	if (producto.activar_inventario) {
		// 		for (var i = 0; i < producto.inventarios.length; i++) {
		// 			cantidadTotal += (producto.inventarios[i].cantidad);
		// 		}
		// 		for (var j = 0; j < $scope.solicitud.solicitudesProductos.length; j++) {
		// 			if ($scope.solicitud.solicitudesProductos[j].producto.id == producto.id) {
		// 				cantidadTotal = cantidadTotal - $scope.solicitud.solicitudesProductos[j].cantidad;
		// 			}
		// 		}
		// 	} else {
		// 		cantidadTotal = 500000;
		// 	}
		// 	return cantidadTotal;
		// }

		$scope.cargarProductos = function () {
			var promesa = ProductosPanel($scope.usuario.id_empresa, $scope.solicitud.almacen.id);
			promesa.then(function (productos) {
				// for (var i = 0; i < productos.length; i++) {
				// 	if (productos[i].activar_inventario) {
				// 		productos[i].inventario_disponible = $scope.obtenerInventarioTotal(productos[i]);
				// 	}
				// }
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
			$scope.cantidadInventario = 10;
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					$scope.cantidadInventario = $scope.cantidadInventario + producto.inventarios[i].cantidad;
				}
			}
			var j = 0, encontrado = false;
			if ($scope.solicitud.solicitudesProductos === undefined) {
				$scope.solicitud.solicitudesProductos = []
			}
			while (j < $scope.solicitud.solicitudesProductos.length && !encontrado) {
				if ($scope.solicitud.solicitudesProductos[j].producto !== undefined) {
					if (($scope.solicitud.solicitudesProductos[j].producto.id == producto.id)) {
						// if (producto.activar_inventario) {
						// 	if (($scope.solicitud.solicitudesProductos[j].cantidad + 1) <= $scope.cantidadInventario) {
						// 		$scope.solicitud.solicitudesProductos[j].cantidad = $scope.solicitud.solicitudesProductos[j].cantidad + 1;
						// 	} else {
						// 		$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
						// 	}
						// } else {
						$scope.solicitud.solicitudesProductos[j].cantidad = $scope.solicitud.solicitudesProductos[j].cantidad + 1;
						$scope.solicitud.solicitudesProductos[j].eliminado = undefined
						// if($scope.solicitud.solicitudesProductos[j].ingredientes === undefined ){
						// 	var formulacion = SolicitudesFormulacionProducto((producto.producto !== undefined) ? producto.producto.id : (producto.id !== undefined) ? producto.id : undefined)
						// 	var ingredientes = []
						// 	formulacion.then(function (formula) {
						// 		formula.productosBase.forEach(element => {
						// 			ingredientes.push(element)
						// 		});
						// 		$scope.solicitud.solicitudesProductos[j].ingredientes = ingredientes
						// 	})
						// }else{
						// 	if ($scope.solicitud.solicitudesProductos[j].ingredientes.length ==0) {
						// 		var formulacion = SolicitudesFormulacionProducto((producto.producto !== undefined) ? producto.producto.id : (producto.id !== undefined) ? producto.id : undefined)
						// 		var ingredientes = []
						// 		formulacion.then(function (formula) {
						// 			formula.productosBase.forEach(element => {
						// 				ingredientes.push(element)
						// 			});
						// 			$scope.solicitud.solicitudesProductos[j].ingredientes = ingredientes
						// 		})
								
						// 	}
						// }
						// }
						encontrado = true;
						detalleVenta = $scope.solicitud.solicitudesProductos[j];
					}
				} else {
					if (($scope.solicitud.solicitudesProductos[j].id_producto == producto.id)) {
						// if (producto.activar_inventario) {
						// 	if (($scope.solicitud.solicitudesProductos[j].cantidad + 1) <= $scope.cantidadInventario) {
						// 		$scope.solicitud.solicitudesProductos[j].cantidad = $scope.solicitud.solicitudesProductos[j].cantidad + 1;
						// 	} else {
						// 		$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
						// 	}
						// } else {
						$scope.solicitud.solicitudesProductos[j].cantidad = $scope.solicitud.solicitudesProductos[j].cantidad + 1;
						$scope.solicitud.solicitudesProductos[j].eliminado = undefined
						// if($scope.solicitud.solicitudesProductos[j].ingredientes === undefined ){
						// 	var formulacion = SolicitudesFormulacionProducto((producto.producto !== undefined) ? producto.producto.id : (producto.id !== undefined) ? producto.id : undefined)
						// 	var ingredientes = []
						// 	formulacion.then(function (formula) {
						// 		formula.productosBase.forEach(element => {
						// 			ingredientes.push(element)
						// 		});
						// 		$scope.solicitud.solicitudesProductos[j].ingredientes = ingredientes
						// 	})
						// }else{
							// if ($scope.solicitud.solicitudesProductos[j].ingredientes.length == 0) {
							// 	var formulacion = SolicitudesFormulacionProducto((producto.producto !== undefined) ? producto.producto.id : (producto.id !== undefined) ? producto.id : undefined)
							// 	var ingredientes = []
							// 	formulacion.then(function (formula) {
							// 		formula.productosBase.forEach(element => {
							// 			ingredientes.push(element)
							// 		});
							// 		$scope.solicitud.solicitudesProductos[j].ingredientes = ingredientes
							// 	})
								
							// }
						// }
	
						
						encontrado = true;
						detalleVenta = $scope.solicitud.solicitudesProductos[j];
					}
				}

				j++;
			}
			if (!encontrado) {
				var formulacion = SolicitudesFormulacionProducto((producto.producto !== undefined) ? producto.producto.id : (producto.id !== undefined) ? producto.id : undefined)
				var ingredientes = []
				formulacion.then(function (formula) {
					formula.productosBase.forEach(element => {
						ingredientes.push(element)
					});
					// ingredientes = formula.productosBase
				})
				if (producto.activar_inventario) {
					if (1 <= $scope.cantidadInventario) {

						detalleVenta = {
							elNombre: producto.nombre,
							producto: producto, precio_unitario: producto.precio_unitario,
							inventario_disponible: $scope.cantidadInventario, costos: producto.inventarios,
							cantidad: 1, descuento: producto.descuento, tipo_descuento: (producto.descuento > 0 ? true : false), recargo: 0, ice: 0, excento: 0, tipo_recargo: false,
							ingredientes: ingredientes
						};
						$scope.solicitud.solicitudesProductos.push(detalleVenta);
						// $scope.calcularImporteDetalleVenta(detalleVenta);
					} else {
						$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
					}
				} else {
					detalleVenta = {
						elNombre: producto.nombre,
						producto: producto, precio_unitario: producto.precio_unitario,
						inventario_disponible: $scope.cantidadInventario, costos: producto.inventarios,
						cantidad: 1, descuento: producto.descuento, tipo_descuento: (producto.descuento > 0 ? true : false), recargo: 0, ice: 0, excento: 0, tipo_recargo: false,
						ingredientes: ingredientes
					};
					$scope.solicitud.solicitudesProductos.push(detalleVenta);
					// $scope.calcularImporteDetalleVenta(detalleVenta);
				}
			} else {
				producto.eliminado = undefined
				// $scope.calcularImporteDetalleVenta(detalleVenta);
			}
			// $scope.sumarTotal();
			// $scope.sumarTotalImporte();
			// $scope.calcularSaldo();
			// $scope.capturarInteraccion();
			// ========= para rankin de vendidos =====================//
			producto.rankin += 1;

			var indice = $scope.productosProcesados.indexOf(producto);
			$scope.productosProcesados[indice] = producto;

			// setTimeout(function(){
			// 	aplicarSwiper(4,3,true,2);
			// },5);
			$localStorage.productosProcesados = $scope.productosProcesados;

			// ===== fin rankin ============================//
			// $scope.checkVentaDetalleProducto(producto)
			if ($scope.productoSeleccionado !== undefined) {
				var prod = (producto.producto !== undefined) ? producto.prod.id : (producto.id != undefined) ? producto.id : undefined
				var prodSel = ($scope.productoSeleccionado.producto !== undefined) ? $scope.productoSeleccionado.producto.id : ($scope.productoSeleccionado.id != undefined) ? $scope.productoSeleccionado.id : undefined
				if (prod != prodSel) {
					var indice = $scope.solicitud.solicitudesProductos.indexOf(producto);
					if (indice > -1)
						$scope.solicitud.solicitudesProductos[indice].verFormulacion = undefined;
					$scope.productoSeleccionado.verFormulacion = undefined
				}
			}
		}

		$scope.filtrarProductos = function (busqueda) {
			$scope.productosProcesados = $filter('filter')($scope.productos, busqueda);
			setTimeout(function () {
				aplicarSwiper(4, 3, true, 2);
			}, 5);
		}

		$scope.confirmarEntrega = function (solicitud) {
			//abrir dialog de confirmacion
			$scope.solicitudCerrar = solicitud
			$scope.abrirDialogConfirmacionCierre()

		}

		$scope.cerrarSolicitud = function (solicitud) {
			solicitud.activo = false
			SolicitudReposicion.update({ id_empresa: $scope.usuario.id_empresa }, solicitud, function (res) {
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
			$scope.solicitud.ingredientes = $scope.solicitud.solicitudesProductos
			$scope.solicitud.ingredientes = $scope.solicitud.solicitudesProductos.map(function (producto) {
				producto.elNombre = (producto.producto !== undefined) ? producto.producto.nombre : (producto.productoSolicitado !== undefined) ? producto.productoSolicitado.nombre : productito.productoSolicitudBase.nombre
			})

			$scope.abrirDialogPanelOperaciones()
		}
		$scope.capturarInteraccion = function () {
			// if ($scope.usuario.empresa.usar_pantalla_cliente) {
			// 	socket.emit('comenzarVenta', $scope.solicitud);
			// }
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

		$scope.venderProformaDirecto = function (venta) {
			if (venta.solicitudesProductos.length > 0) {
				// var promesa=ClientesNit($scope.usuario.id_empresa,0);
				// promesa.then(function(results){
				// 	if(results.length==1 || results.length>1){
				// 		$scope.establecerCliente(results[0]);
				// 	}else{
				// 		$scope.solicitud.cliente.razon_social=null;
				// 	}
				// 	venta.movimiento=$.grep($scope.movimientosEgreso, function(e){return e.nombre_corto == $scope.diccionario.EGRE_PROFORMA;})[0];
				// 	venta.tipoPago=$.grep($scope.tiposPago, function(e){return e.nombre == $scope.diccionario.TIPO_PAGO_CONTADO;})[0];
				// 	$scope.obtenerTipoEgreso(venta.movimiento);
				// 	$scope.cambiarTipoPago(venta.tipoPago);
				// 	var fechaActual=new Date();
				// 	venta.fechaTexto=fechaActual.getDate()+"/"+(fechaActual.getMonth()+1)+"/"+fechaActual.getFullYear();
				// 	fecha=fechaActual;
				// 	venta.pagado=venta.total;
				// 	venta.cambio=0;
				// 	$scope.guardarVentaPanel(true,venta);
				// });
			} else {
				$scope.mostrarMensaje("¡Debe agregar al menos un producto para realizar la transacción!");
			}
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
		$scope.buscarInventarios = function (idAlmacen, pagina, itemsPagina, texto, columna, direccion) {

		}

		$scope.sinFuncionalidad = function () {
			$scope.mostrarMensaje('Sin funcionalidad')
		}

		$scope.filtrarSolicitudesOperaciones = function (filtro) {
			console.log(filtro)
			$scope.obtenerSolicitudes()
		}
		$scope.copiar = function (solicitud) {
			$scope.solicitud = solicitud
			$scope.solicitud.ingredientes = $scope.solicitud.solicitudesProductos.map(function (producto) {
				producto.elNombre = (producto.producto !== undefined) ? producto.producto.nombre : (producto.productoSolicitado !== undefined) ? producto.productoSolicitado.nombre : productito.productoSolicitudBase.nombre
			})
			$scope.solicitud.copia = true
			$scope.solicitud.sucursal = $scope.solicitud.almacen.sucursal
			$scope.obtenerAlmacenes($scope.solicitud.sucursal.id)
			$scope.solicitud.almacen = $scope.solicitud.almacen




			// $scope.solicitud.solicitudesProductos.forEach(function(producto,indx,arry){
			// 	var prom = SolicitudesFormulacionProducto((producto.producto!==undefined)?producto.producto.id:(producto.id !==undefined)?producto.id:undefined)
			// 	prom.then(function(ingrediente) {
			// 		producto.detallesIngredientesProducto.push(ingrediente)
			// 	})
			// });
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
					$scope.solicitud.fechaTexto = $scope.fechaATexto(new Date())
				} else {
					if ($scope.solicitud.copia === undefined) {
						$scope.solicitud.fechaTexto = $scope.fechaATexto(new Date($scope.solicitud.fecha))
						$scope.solicitud.solicitudesProductos.forEach(element => {
							if (element.ingredientes === undefined) {
								if (element.detallesIngredientesProducto !== undefined) {
									element.ingredientes = element.detallesIngredientesProducto
								} else {
									element.ingredientes = []
								}
							}
						});
					} else {
						$scope.solicitud.id = undefined
						$scope.solicitud.fechaTexto = $scope.fechaATexto(new Date())
						$scope.solicitud.activo = true
						$scope.solicitud.solicitudesProductos.forEach(element => {
							if (element.ingredientes === undefined) {
								if (element.detallesIngredientesProducto !== undefined) {
									element.ingredientes = element.detallesIngredientesProducto
								} else {
									element.ingredientes = []
								}
							}
						});
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
		$scope.inicio()
	})