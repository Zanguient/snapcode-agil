angular.module('agil.controladores')
	.controller('ControladorPedidos', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage,
		blockUI, ClasesTipo, socket, Paginator, PedidosFiltro) {

		$scope.usuarioSesion = JSON.parse($localStorage.usuario);
		convertUrlToBase64Image($scope.usuarioSesion.empresa.imagen, function (imagenEmpresa) {
			$scope.usuarioSesion.empresa.imagen = imagenEmpresa;
		});

		$scope.idDialogDialogPanelOperaciones = "dialog-panel-operaciones"
		$scope.idDialogDatos = "modal-wizard-venta-edicion"
		$scope.idDialogEntregaViveres = "dialogEntregaViveres"
		$scope.idConfirmacionCierre = "dialog-confirmacion-entrega"
		$scope.idDialogTotalIngredientes = "dialog-total-ingredientes"

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsOperaciones($scope.idDialogDialogPanelOperaciones, $scope.idDialogEntregaViveres, $scope.idConfirmacionCierre, $scope.idDialogTotalIngredientes);
			$scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario, $location.path().substring(1));
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
			$scope.obtenerPaginador()
			$scope.sucursales = $scope.obtenerSucursales();
		}
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

				if ($scope.solicitud.almacen) {
					$scope.cargarProductos();
				} else {
					$scope.solicitud.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : $scope.solicitud.almacen ? $scope.solicitud.almacen : null;
					$scope.productosProcesados = []
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
					if ($scope.solicitud.solicitudesProductos.indexOf(prod) == $scope.solicitud.solicitudesProductos.length - 1) {
						EliminarSolicitudReposicion.save({ id_solicitud: solicitud.id }, solicitud, function (res) {
							setTimeout(function () {
								$scope.$apply(function () {
									$scope.mostrarMensaje(res.mensaje)
								});
							}, 600)
							// $scope.obtenerSolicitudes()
							$scope.recargarItemsTabla()
							$scope.solicitud = undefined
							blockUI.stop()
						}, function (error) {
							$scope.solicitud = undefined
							setTimeout(function () {
								$scope.$apply(function () {
									$scope.mostrarMensaje(err.stack ? err.stack : err.message)
								});
							}, 600)
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
			$scope.abrirDialogPanelOperaciones()
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


		$scope.editar = function (pedido) {

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

		$scope.generarPdfSolicitud = function (solicitud) {

			blockUI.start();
			$scope.calcularTotalViveres(solicitud)

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