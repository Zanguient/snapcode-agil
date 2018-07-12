angular.module('agil.controladores')
	.controller('ControladorPedidos', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage,
		blockUI, ClasesTipo, socket, Paginator, PedidosFiltro, ListaGruposProductoUsuario, ProveedoresNit, ListaProductosEmpresaUsuario, GuardarPedido, ListaProveedores, InventarioPaginador,
		ProductosPaginador, ListaProductosProveedores, ActualizarProductosProveedor, ListaSubGruposProductoEmpresa, ProductosPaginadorSubgrupos, ProductosPaginadorAsignados) {

		$scope.usuarioSesion = JSON.parse($localStorage.usuario);
		convertUrlToBase64Image($scope.usuarioSesion.empresa.imagen, function (imagenEmpresa) {
			$scope.usuarioSesion.empresa.imagen = imagenEmpresa;
		});

		$scope.idDialogNuevoPedido = "modal-nuevo-pedido";
		// $scope.idDialogListadoPedido = "modal-listado-nuevo-pedido"
		$scope.idDialogProductosProveedor = 'dialog-productos-proveedor-configuracion';
		$scope.idDialogBusquedaProveedor = 'dialog-Busqueda-proveedor';
		$scope.idDialogProductosAsigandosProveedor = 'dialog-productos-proveedor-asignados'

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsPedidos($scope.idDialogNuevoPedido, $scope.idDialogProductosProveedor, $scope.idDialogBusquedaProveedor, $scope.idDialogProductosAsigandosProveedor);
			$scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario, $location.path().substring(1));
		});

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idDialogListadoPedido);
			$scope.eliminarPopup($scope.idDialogProductosProveedor);
			$scope.eliminarPopup($scope.idDialogNuevoPedido);
			$scope.eliminarPopup($scope.idDialogBusquedaProveedor);
			$scope.eliminarPopup($scope.idDialogProductosAsigandosProveedor);
		});

		$scope.inicio = function () {
			$scope.imprimir = { detalle: false };
			$scope.listaProductosProveedor = [];
			$scope.seleccionProductosProveedor = { seleccionar_todos: false };
			$scope.seleccionProductosProveedorAsignados = { seleccionar_todos: false };
			$scope.productosAsignadosPorveedor = { itemsPorPagina: 10, textoBusqueda: "", paginaActual: 1, paginas: [1] };
			$scope.configuracionPorveedor = { itemsPorPagina: 10, textoBusqueda: "", paginaActual: 1, paginas: [1] };
			$scope.detallesPedido = [];
			$scope.mostarBusquedaProducto = false;
			$scope.ordenProductos = true;
			$scope.esContado = true;
			$scope.alreadyCalculated = false;
			$scope.sucursalesUsuario = "";
			for (var i = 0; i < $scope.usuarioSesion.sucursalesUsuario.length; i++) {
				$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuarioSesion.sucursalesUsuario[i].sucursal.id;
				if (i + 1 != $scope.usuarioSesion.sucursalesUsuario.length) {
					$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
				}
			};

			$scope.obtenerProveedores();
			$scope.obtenerProductos();
			$scope.obtenerProductosAsignados();
			$scope.filtro = {
				desde: 0,
				hasta: 0,
				tipo: 0,
				proveedor: 0,
				nit: "",
				sucursal: 0,
				estado: 0,
				id_usuario: ""
			};
			// $scope.detalleVenta = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
			// $scope.solicitud = { solicitudesProductos: [] }
			$scope.obtenerPaginador();
			$scope.sucursales = $scope.obtenerSucursales();
			$scope.obtenerSubGruposProductosEmpresaUsuario();
		};

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

		$scope.establecerProveedor = function (proveedor, modal) {
			if ($scope.pedido === undefined) {
				$scope.pedido = {};
			}
			$scope.pedido.proveedor = proveedor;
			$scope.productosAsignadosProveedor = []
			$scope.paginatorProductosAsignados.setPages(1);

			if (modal !== undefined) {
				$scope.cerrarModalBusquedaProveedor();
			}
			if ($scope.pedido.por_proveedor) {
				$scope.generarPorProveedor()
			}
		};

		$scope.checkProveedor = function (pedido) {
			if ($scope.pedido) {
				if ($scope.pedido.proveedor) {
					return true;
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

		$scope.establecerProducto = function (producto, modelo) {
			$scope.detallePedido = {};
			producto.tipoProducto = producto['tipoProducto'] == null ? { id: producto['tipoProducto.id'], nombre: producto['tipoProducto.nombre'], nombre_corto: producto['tipoProducto.nombre_corto'] } : producto.tipoProducto;
			// var centroCostos = $scope.pedido.centroCosto;
			var inv_disponible = 0;
			if (producto.inventarios.length > 0) {
				producto.inventarios.forEach(function (inventario) {
					inv_disponible += inventario.cantidad;
				})
			}
			$scope.detallePedido = {
				producto: producto, precio_unitario: producto.precio_unitario,
				cantidad: 1, inventario_disponible: inv_disponible
			};
			// $scope.cerrarPopup($scope.idModalInventario);
			// $scope.enfocar('cantidad');
		};

		$scope.guardarPedido = function (pedido) {
			blockUI.start();
			if (pedido !== undefined && $scope.detallesPedido.length > 0) {
				var fortime = new Date();
				var dateSplit = pedido.fecha.split('/').reverse();
				var sendPedido = {
					fecha: new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], fortime.getHours(), fortime.getMinutes()),
					sucursal: pedido.sucursal,
					almacen: pedido.almacen,
					proveedor: pedido.proveedor.id,
					observacion: pedido.observacion,
					grupo: (pedido.grupo !== undefined ? pedido.grupo !== null ? pedido.grupo : 0 : 0),
					detallesPedido: $scope.detallesPedido,
					usuario: $scope.usuarioSesion.id
				};
				var prom = GuardarPedido($scope.usuario.id_empresa, sendPedido, $scope.usuarioSesion.id);
				prom.then(function (res) {
					if (res.hasErr) {
						$scope.mostrarMensaje(res.mensaje);
					} else {
						$scope.mostrarMensaje(res.mensaje);
						$scope.recargarItemsTabla();
					}
					blockUI.stop();
				}).catch(function (err) {
					blockUI.stop();
					var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.';
					$scope.mostrarMensaje(msg);
				})
			} else {
				if ($scope.detallesPedido.length > 0) {
					$scope.mostrarMensaje('Existe un problema con los datos del pedido, no se puede generar!');
				} else {
					$scope.mostrarMensaje('Existe un problema con los datos del pedido, no se puede generar sin lista de productos!');
				}
				blockUI.stop();
			}
		};

		$scope.mostrarBusqueda = function () {
			if ($scope.mostarBusquedaProducto) {
				$scope.mostarBusquedaProducto = false;
			} else {
				$scope.mostarBusquedaProducto = true;
			}
		};

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
		};

		$scope.filtrarFiltro = function (filtro, _, __) {
			if (__ !== undefined) {
				for (var key in filtro) {
					if (filtro[key] == 0) {
						filtro[key] = "";
					}
				}
			} else {
				for (var key in filtro) {
					if (filtro[key] === "" || filtro[key] === null || filtro[key] === undefined) {
						filtro[key] = 0;
					}
				}
			}
			if (_ === undefined || !_) {
				$scope.obtenerPedidos();
			} else {
				return filtro;
			}
		};

		$scope.obtenerPaginador = function () {
			blockUI.start();
			$scope.paginator = Paginator();
			$scope.paginator.column = "fecha";
			$scope.paginator.direccion = "asc";
			$scope.paginator.itemPerPage = 10;
			$scope.paginator.page = 1;
			$scope.filtro = {
				desde: 0,
				hasta: 0,
				tipo: 0,
				proveedor: 0,
				nit: "",
				sucursal: 0,
				estado: 0,
				usuario: ""
			};
			$scope.paginator.callBack = $scope.obtenerPedidos;
			$scope.paginator.getSearch("");
			blockUI.stop();

		}
		$scope.obtenerPedidos = function () {
			blockUI.start();
			$scope.filtro = $scope.filtrarFiltro($scope.filtro, true);
			$scope.paginator.filter = $scope.filtro;
			var prom = PedidosFiltro($scope.usuarioSesion.id_empresa, $scope.paginator);
			prom.then(function (res) {
				if (res.hasErr) {
					$scope.mostrarMensaje(res.mensaje);
				} else {
					$scope.listaPedidos = res.pedidos;
					$scope.paginator.setPages(res.paginas);
				}
				$scope.filtro = $scope.filtrarFiltro($scope.filtro, true, true);
				blockUI.stop();
			}).catch(function (err) {
				blockUI.stop();
				var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null) ? err.data : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.';
				$scope.mostrarMensaje(msg);
			});
		};

		$scope.obtenerSucursales = function () {
			var sucursales = [];
			for (var i = 0; i < $scope.usuarioSesion.sucursalesUsuario.length; i++) {
				sucursales.push($scope.usuarioSesion.sucursalesUsuario[i].sucursal);
			}
			return sucursales;
		}
		$scope.obtenerAlmacenes = function (idSucursal) {
			if (idSucursal === undefined) {
				$scope.filtro.sucursal = undefined;
				$scope.almacenes = [];
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
			$scope.solicitud = solicitud;
			$scope.solicitud.solicitudesProductos.map(function (prod) {
				var promesa = ListaInventariosProducto(prod.productoSolicitado.id, $scope.solicitud.almacen.id);
				promesa.then(function (inventarios) {
					prod.inventarios = inventarios;
					prod.inventario_disponible_utilizado = prod.cantidad;
					if ($scope.solicitud.solicitudesProductos.indexOf(prod) == $scope.solicitud.solicitudesProductos.length - 1) {
						EliminarSolicitudReposicion.save({ id_solicitud: solicitud.id }, solicitud, function (res) {
							$scope.mostrarMensaje(res.mensaje);
							// $scope.obtenerSolicitudes()
							$scope.recargarItemsTabla();
							$scope.solicitud = undefined;
							blockUI.stop();
						}, function (error) {
							$scope.solicitud = undefined;
							$scope.mostrarMensaje(err.stack ? err.stack : err.message);
							blockUI.stop();
						})
					}
				})
			})
			$scope.cerrarConfirmacionEliminacion();
		};

		$scope.ver = function (solicitud) {
			// $scope.solicitud = solicitud;
			// $scope.solicitud.ver = true;
			// $scope.solicitud.sucursal = $scope.solicitud.almacen.sucursal;
			// $scope.obtenerAlmacenes($scope.solicitud.sucursal.id);
			// $scope.solicitud.almacen = $scope.solicitud.almacen;
			// $scope.abrirDialogPanelOperaciones();
		};

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
		};


		$scope.editar = function (pedido) {

		};

		$scope.sinFuncionalidad = function () {
			$scope.mostrarMensaje('Sin funcionalidad');
		};

		$scope.generarPdfSolicitud = function (solicitud) {

			blockUI.start();
			$scope.calcularTotalViveres(solicitud);

			var doc = new PDFDocument({ size: [612, 792], margin: 10, compress: false });
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
		};

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
		};

		// $scope.buscarInventarios = function (idAlmacen, pagina, itemsPagina, texto, columna, direccion, cantidad) {
		// 	blockUI.start();
		// 	$scope.itemsPorPagina = itemsPagina;
		// 	if (texto == "" || texto == null) {
		// 		texto = 0;
		// 	} else {
		// 		$scope.textoBusqueda = texto;
		// 	}
		// 	$scope.paginaActual = pagina;
		// 	var promesa = InventarioPaginador($scope.usuario.id_empresa, idAlmacen, pagina, itemsPagina, texto, columna, direccion, cantidad, undefined, $scope.usuario.id);
		// 	promesa.then(function (dato) {
		// 		var productos = dato.productos;
		// 		//var mproductos=[];
		// 		for (var i = 0; i < productos.length; i++) {
		// 			var inventarios = [], cantidadTotal = 0;
		// 			productos[i].fecha_vencimiento = new Date(productos[i].fecha_vencimiento);
		// 			productos[i].cantidad_total = productos[i].cantidad;
		// 			/*mproductos.push({id:productos[i].id,descuento:productos[i].descuento,descuento_fijo:productos[i].descuento_fijo,
		// 							nombre:productos[i].nombre,codigo:productos[i].codigo,grupo:productos[i].grupo,subgrupo:productos[i].subgrupo,
		// 							inventarios:inventarios,cantidad_total:productos[i].cantidad,fecha_vencimiento:new Date(productos[i].fecha_vencimiento),precio_unitario:productos[i].precio_unitario,
		// 							porcentaje:$scope.porcentaje,color:$scope.color});*/
		// 		}
		// 		$scope.paginas = [];
		// 		for (var i = 1; i <= dato.paginas; i++) {
		// 			$scope.paginas.push(i);
		// 		}

		// 		$scope.productosConfiguracionProveedor = productos;

		// 		blockUI.stop();
		// 	});
		// }

		$scope.calcularViveresDesdeFiltro = function (UnDatoPorProducto) {
			var detallesSolicitudes = [];
			$scope.totalViveresSolicitados = {};
			$scope.solicitudesPedido = [];
			$scope.solicitudesOperaciones.forEach(function (solicitud, i) {
				if ((!solicitud.activo && UnDatoPorProducto === undefined)) {
					var desdd = $scope.calcularTotalViveres(solicitud, true);
					detallesSolicitudes.push(desdd);
				} else if (UnDatoPorProducto && !solicitud.id_pedido) {
					$scope.solicitudesPedido.push(solicitud.id);
					var desdd = $scope.calcularTotalViveres(solicitud, true);
					detallesSolicitudes.push(desdd);
				}
			});
			var productosParaSerProcesados = [];
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
						monto: producto.monto
					};
					productosParaSerProcesados.push(productoSinProcesado);
				});
			});
			if (UnDatoPorProducto) {
				var productosReporteDetalle = [];
				while (productosParaSerProcesados.length > 0) {
					var dato = productosParaSerProcesados.pop();
					if (productosReporteDetalle.length === 0) {
						productosReporteDetalle.push(dato);
					} else {
						var encontrado = false;
						var indx;
						productosReporteDetalle.forEach(function (producto, i) {
							if (producto.producto.id == dato.producto.id && !encontrado) {
								encontrado = true;
								indx = i;
							}
						})
						if (encontrado && indx !== undefined) {
							productosReporteDetalle[indx].cantidad += dato.cantidad;
							productosReporteDetalle[indx].total = productosReporteDetalle[indx].cantidad * productosReporteDetalle[indx].costo;
						} else {
							productosReporteDetalle.push(dato);
						}
					}
				}
				return productosReporteDetalle;
			} else {
				return productosParaSerProcesados;
			}
		};

		$scope.reporteExcel = function (pdf) {
			blockUI.start();
			if ($scope.imprimir.detalle) {
				var cabecera = ["Nro.", "Sucursal", "Almacén", "Hora-fecha", "Usuario", "Estado", "Detalle", "Unidad", "Grupo", "Subgrupo", "Cantidad", "Costo", "Total"];
				var data = [];
				data.push(cabecera);
				var reporteEx = $scope.calcularViveresDesdeFiltro();
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
				var cabecera = ["Nro.", "Sucursal", "proveedor", "Hora-fecha", "Estado"];
				var data = [];
				data.push(cabecera);
				// var reporteEx = $scope.calcularViveresDesdeFiltro()
				var columns = [];
				for (var i = 0; i < $scope.listaPedidos.length; i++) {
					columns = [];
					columns.push(i + 1);
					columns.push($scope.listaPedidos[i].sucursal.nombre);
					columns.push($scope.listaPedidos[i].proveedor.razon_social);
					columns.push(new Date($scope.listaPedidos[i].fecha).toLocaleTimeString() + ' ' + new Date($scope.listaPedidos[i].fecha).toLocaleDateString());
					columns.push($scope.listaPedidos[i].recibido ? 'Completado' : 'En espera');
					// columns.push(($scope.listaPedidos[i].activo ? 'Abierto' : 'Cerrado'));
					data.push(columns);
				}
				blockUI.stop();
			}
			if (pdf) {
				$scope.reportePdf(data);
				blockUI.stop();
			} else {
				var ws_name = "SheetJS";
				var wb = new Workbook();
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
				ws['!rows'] = [{ hpx: 28, level: 3 }];
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE OPERACIONES.xlsx");
				blockUI.stop();
			}
		};

		$scope.reportePdf = function (reporte) {
			var doc = new PDFDocument({ size: 'letter', margin: 10, compress: false }); //[612, 792]
			var stream = doc.pipe(blobStream());
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			$scope.posXforPdf = [];
			doc.font('Helvetica', 8);
			var x = 65, y = 115, itemsPorPagina = 29, items = 0, pagina = 1, totalPaginas = Math.ceil(reporte.length / itemsPorPagina);
			$scope.dibujarCabeceraReportePdf(doc, reporte);
			if ($scope.imprimir.detalle) {
				x = 50;
				for (var i = 0; i < reporte.length && items <= itemsPorPagina; i++) {
					var px = x;
					doc.font('Helvetica', 8);
					if (i > 0) {
						for (var j = 0; j < reporte[i].length; j++) {
							doc.text(reporte[i][j], px, y, { width: 40 }, { align: "center" });
							if (j == 0) {
								px = $scope.posXforPdf[j];
							} else {
								px = $scope.posXforPdf[j];
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
					var px = x;
					doc.font('Helvetica', 8);
					if (i > 0) {
						for (var j = 0; j < reporte[i].length; j++) {
							doc.text(reporte[i][j], px, y, { width: 40 });
							if (j == 0) {
								px += 30;
							} else {
								px += 60;
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
		};

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
				px = 50;
				for (let i = 0; i < reporte[0].length; i++) {
					doc.text(reporte[0][i], px, 90);
					if (i == 0) {
						px += reporte[0][i].length * 4 + 5;
						$scope.posXforPdf.push(px);
					} else {
						if ($scope.imprimir.detalle) {
							px += reporte[0][i].length * 4 + 15;
							$scope.posXforPdf.push(px);
						} else {
							px += reporte[0][i].length * 4 + 15;
							$scope.posXforPdf.push(px);
						}
					}
				}
			} else {
				px = 65
				for (let i = 0; i < reporte[0].length; i++) {
					doc.text(reporte[0][i], px, 90);
					if (i == 0) {
						px += 20;
						$scope.posXforPdf.push(px);
					} else {
						if ($scope.imprimir.detalle) {
							px += 40;
							// $scope.posXforPdf.push(px) 
						} else {
							px += 60;
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
		};

		// $scope.abrirModalPedido = function () {
		// 	$scope.abrirPopup($scope.idDialogListadoPedido)
		// }
		// $scope.cerrarModalPedido = function () {
		// 	$scope.cerrarPopup($scope.idDialogListadoPedido)
		// }
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

		$scope.seleccionarProductoAsignado = function (producto) {
			if (producto.seleccionado) {
				if (!$scope.productosProveedorSeleccionados.some(function (id) {
					return id === producto.id
				})) {
					$scope.productosProveedorSeleccionados.push(producto)
				}
			} else {
				var indxDorp = $scope.productosProveedorSeleccionados.indexOf(producto);
				if (indxDorp >= 0 && !producto.seleccionado) {
					$scope.productosProveedorSeleccionados.splice(indxDorp, 1);
				} else if (indxDorp == -1 && producto.seleccionado) {
					$scope.productosProveedorSeleccionados.push(producto.id);
				}
			}
		}

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

		$scope.eliminarDetallePedido = function (detalle) {
			$scope.detallesPedido.splice($scope.detallesPedido.indexOf(detalle), 1);
		}

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

		$scope.obtenerProductos = function () {
			$scope.paginatorProductos = Paginator();
			$scope.paginatorProductos.column = "nombre";
			$scope.paginatorProductos.filter = $scope.grupo;
			$scope.paginatorProductos.callBack = $scope.buscarProductos;
			$scope.paginatorProductos.getSearch("", null, null);
		};

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

		$scope.modificarListaProductosProveedor = function (producto) {
			var indx = $scope.listaProductosProveedor.indexOf(producto.id);
			if (indx >= 0 && !producto.seleccionado) {
				$scope.listaProductosProveedor.splice(indx, 1);
			} else if (indx == -1 && producto.seleccionado) {
				$scope.listaProductosProveedor.push(producto.id);
			}
		};

		$scope.modificarListaProductosProveedorSeleccionados = function (producto) {
			var indx = $scope.listaProductosProveedorSeleccionados.indexOf(producto.id);
			if (indx >= 0 && !producto.seleccionado) {
				$scope.listaProductosProveedorSeleccionados.splice(indx, 1);
			} else if (indx == -1 && producto.seleccionado) {
				$scope.listaProductosProveedorSeleccionados.push(producto.id);
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
				});
				$scope.modificarListaProductosProveedor(producto)
			}
		};

		$scope.seleccionarTodosAsignados = function () {
			$scope.listaProductosProveedorSeleccionados = []
			if ($scope.seleccionProductosProveedorAsignados.seleccionar_todos) {
				$scope.productosAsignadosProveedor.forEach(function (producto) {
					producto.seleccionado = true;
					$scope.productosProveedorSeleccionados.push(producto)
					$scope.modificarListaProductosProveedorSeleccionados(producto)
				});
			} else {
				$scope.productosAsignadosProveedor.forEach(function (producto) {
					producto.seleccionado = false;
					$scope.productosProveedorSeleccionados.push(producto)
					$scope.modificarListaProductosProveedorSeleccionados(producto)
				});
			}
		};
		// $scope.deseleccionarTodosAsignados = function () {
		// 	$scope.productosAsignadosProveedor.forEach(function (producto) {
		// 		producto.seleccionado = false;
		// 	});
		// }

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

		$scope.buscarProductos = function (pagina, pedido) {
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

		$scope.cerrarModalProductosProveedor = function () {
			$scope.productosAsignacionProveedor = [];
			$scope.listaProductosProveedor = [];
			$scope.cerrarPopup($scope.idDialogProductosProveedor);
		};

		$scope.abrirModalNuevoPedido = function () {
			$scope.abrirPopup($scope.idDialogNuevoPedido);
		};

		$scope.cerrarModalNuevoPedido = function () {
			$scope.pedido = {};
			$scope.detallesPedido = {};
			$scope.cerrarPopup($scope.idDialogNuevoPedido);
		};

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
			if ($scope.productosProveedorSeleccionados === undefined || $scope.productosProveedorSeleccionados === null) {
				$scope.productosProveedorSeleccionados = []
			}
			if ($scope.pedido.proveedor) {
				$scope.buscarProductosAsignados();
				$scope.abrirPopup($scope.idDialogProductosAsigandosProveedor);
			} else {
				$scope.mostrarMensaje('Seleccione un proveedor.');
			}
		};

		$scope.cerrarModalProductosAsignadosProveedor = function (throwChanges) {
			if (throwChanges) {
				$scope.productosProveedorSeleccionados = []
				$scope.seleccionProductosProveedorAsignados.seleccionar_todos = false
			}
			$scope.cerrarPopup($scope.idDialogProductosAsigandosProveedor);
		};
		$scope.inicio();
	});