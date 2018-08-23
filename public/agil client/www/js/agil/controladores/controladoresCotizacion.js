angular.module('agil.controladores')
	.controller('ControladorCotizacion', function ($scope, blockUI, $localStorage, $location, $templateCache, $route, $timeout, ListaCotizacion, Cotizaciones, Cotizacion, filtroCotizaciones, Diccionario,
		ListaInventariosProducto, ClasesTipo, $window, ListaProductosEmpresa, InventarioPaginador, ConfiguracionCotizacionVista, ConfiguracionCotizacionVistaDatos, FiltroCotizacionPaginador, Paginator, DatosImpresionCotizacion, ultimaCotizacion, ListaSucursalesUsuario, ClientesNit) {

		$scope.usuario = JSON.parse($localStorage.usuario);
		$scope.idModalWizardCotizacionNueva = 'modal-wizard-cotizacion-nueva';
		// $scope.idModalWizardCotizacionModificar = 'modal-wizard-cotizacion-modificar';
		$scope.idModalInventario = "dialog-productos-venta";
		// $scope.cotizacion = new Cotizacion({detallesCotizacion:[]});

		$scope.inicio = function () {
			$scope.obtenerCotizaciones();
			$scope.detalleCotizacion = { producto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false, eliminado: false }
			$scope.sucursales = [];
			$scope.obtenerSucursales();
			$scope.cotizacionModel = ['id', 'nombre', 'descripcion', 'fecha', 'numero_documento', 'importe', 'usuario']
			$scope.productoSeleccionado = false
		}

		// $scope.obtenerSucursales = function () {
		// 	var sucursales = [];
		// 	for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
		// 		sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
		// 	}
		// 	return sucursales;
		// }

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
		$scope.obtenerCotizaciones = function () {
			$scope.paginator = Paginator();
			$scope.paginator.column = "id";
			$scope.paginator.direction = "desc";
			$scope.paginator.callBack = $scope.obtenerLista;
			$scope.filtro = { empresa: $scope.usuario.id_empresa, inicio: "", fin: "", fecha_inicio: new Date(), fecha_fin: new Date(), busqueda: "", importe: 0 };
			$scope.paginator.getSearch("", $scope.filtro, null);
		}

		$scope.establecerFechas = function (inicio, fin) {
			$scope.filtro.fecha_inicio = new Date(convertirFecha(inicio))
			$scope.filtro.fecha_fin = new Date(convertirFecha(fin))
		}

		$scope.obtenerLista = function () {
			blockUI.start();
			var promesa = filtroCotizaciones($scope.paginator);
			promesa.then(function (dato) {
				$scope.paginator.setPages(dato.paginas);
				$scope.cotizaciones = dato.cotizaciones;
				blockUI.stop();
			})
		}

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsCotizacion($scope.idModalWizardCotizacionNueva, $scope.idModalInventario, $scope.idModalWizardCotizacionModificar);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
		});

		$scope.cerrarNuevaCotizacion = function () {
			$scope.cerrarPopup($scope.idModalWizardCotizacionNueva);
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

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardCotizacionNueva);
			$scope.eliminarPopup($scope.idModalInventario);

		});

		$scope.ModificarCotizacion = function (cotizacion) {
			$scope.cotizacion = cotizacion;
			$scope.obtenerAlmacenes(cotizacion.sucursal.id);
			$scope.cotizacion.fecha = new Date($scope.cotizacion.fecha);
			$scope.cotizacion.fechaTexto = $scope.cotizacion.fecha.getDate() + "/" + ($scope.cotizacion.fecha.getMonth() + 1) + "/" + $scope.cotizacion.fecha.getFullYear();
			$scope.abrirPopup($scope.idModalWizardCotizacionNueva);
		}

		$scope.buscarProducto = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ListaProductosEmpresa($scope.usuario.id_empresa, query);
				setTimeout($scope.enfocar('id_productoTB'), 0)
				return promesa;
			}
		}

		$scope.eliminarDetalleCotizacion = function (detalleCotizacion) {
			indx = $scope.cotizacion.detallesCotizacion.indexOf(detalleCotizacion)
			$scope.cotizacion.detallesCotizacion[indx].eliminado = true
			$scope.sumarTotalImporte();
		}

		$scope.establecerProducto = function (producto) {
			producto.tipoProducto = producto['tipoProducto'] == null ? { id: producto['tipoProducto.id'], nombre: producto['tipoProducto.nombre'], nombre_corto: producto['tipoProducto.nombre_corto'] } : producto.tipoProducto;
			$scope.detalleCotizacion = { producto: producto, precio_unitario: producto.precio_unitario, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, descuento: producto.descuento, eliminado: false };
			$scope.editar_precio = false;
			producto.activar_inventario = false
			$scope.calcularImporte()
			$scope.productoSeleccionado = true
		}

		$scope.calcularImporte = function () {
			$scope.detalleCotizacion.importe = Math.round(($scope.detalleCotizacion.cantidad * $scope.detalleCotizacion.precio_unitario) * 1000) / 1000;
			var descuento, recargo;
			if ($scope.detalleCotizacion.tipo_descuento) {
				descuento = $scope.detalleCotizacion.importe * ($scope.detalleCotizacion.descuento / 100);
			} else {
				descuento = $scope.detalleCotizacion.descuento;
			}
			if ($scope.detalleCotizacion.tipo_recargo) {
				recargo = $scope.detalleCotizacion.importe * ($scope.detalleCotizacion.recargo / 100);
			} else {
				recargo = $scope.detalleCotizacion.recargo;
			}
			$scope.detalleCotizacion.total = $scope.detalleCotizacion.importe - descuento + recargo - $scope.detalleCotizacion.ice - $scope.detalleCotizacion.excento;
		}

		$scope.agregarDetalleCotizacion = function (detalleCotizacion) {
			$scope.cotizacion.detallesCotizacion.push(detalleCotizacion);
			$scope.sumarTotalImporte()
			$scope.detalleCotizacion = { producto: {}, cantidad: 0, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false, eliminado: false }
			$scope.productoSeleccionado = false
		}
		$scope.sumarTotalImporte = function () {
			var sumaImporte = 0;
			for (var i = 0; i < $scope.cotizacion.detallesCotizacion.length; i++) {
				if (!$scope.cotizacion.detallesCotizacion[i].eliminado) {
					sumaImporte = sumaImporte + $scope.cotizacion.detallesCotizacion[i].importe;
				}

			}
			$scope.cotizacion.importe = Math.round((sumaImporte) * 1000) / 1000;
		}

		$scope.crearNuevaCotizacion = function () {
			$scope.cotizacion = new Cotizacion({
				id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, cliente: {},
				detallesCotizacion: []

			});
			var fechaActual = new Date();
			$scope.cotizacion.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
			$scope.detalleCotizacion = { producto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false, eliminado: false }
			$scope.abrirPopup($scope.idModalWizardCotizacionNueva);
			$scope.enfocar('nombreCotizacion');
		}
		$scope.guardarCotizacion = function (valido, cotizacion) {
			if (valido) {
				var tiempoActual = new Date();
				cotizacion.fecha = new Date($scope.convertirFecha(cotizacion.fechaTexto));
				blockUI.start();
				if (cotizacion.id) {
					Cotizacion.update({ id_cotizacion: cotizacion.id }, cotizacion, function (res) {
						blockUI.stop();
						$scope.imprimirCotizacion(cotizacion);
						$scope.cerrarNuevaCotizacion();
						$scope.recargarItemsTabla();
						$scope.mostrarMensaje('Actualizado exitosamente!');
					});
				} else {
					cotizacion.$save(function (res) {
						blockUI.stop();
						promesa = ultimaCotizacion()
						promesa.then(function (dato) {
							$scope.cotizacionImp = dato.cotizacion[0];
							console.log(dato.cotizacion[0].id)
							$scope.imprimirCotizacion($scope.cotizacionImp);
						});
						$scope.cerrarNuevaCotizacion();
						$scope.recargarItemsTabla();
						$scope.mostrarMensaje('Cotización registrada exitosamente!');
						blockUI.stop();
					}, function (error) {
						blockUI.stop();
						$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
						$scope.recargarItemsTabla();
					});
				}
			}
		}

		$scope.obtenerAlmacenesActividades = function (idSucursal) {
			$scope.obtenerAlmacenes(idSucursal);
			// $scope.obtenerActividades(idSucursal);
		}

		$scope.obtenerAlmacenes = function (idSucursal) {
			console.log("seleccion sucursallllllll ", idSucursal);
			$scope.almacenes = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
			$scope.almacenes = sucursal.almacenes;

			// if (!$scope.venta.editar) {
			// 	$scope.venta.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : null;
			// 	if ($scope.venta.almacen) {
			// 		$scope.cargarProductos();
			// 	}
			// }
		}


		$scope.buscarCliente = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ClientesNit($scope.usuario.id_empresa, query);
				return promesa;
			}
		};

		$scope.establecerCliente = function (cliente) {
			$scope.cotizacion.cliente = cliente;
			$scope.enfocar('razon_social');
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
					$scope.enfocar(elemento)
				} else {
					$timeout(function () {
						$('#' + elemento).trigger('click');
					}, 0);
				}
			}
		}

		$scope.verificarPulso = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				if (textoBusqueda) {
					$scope.buscarCotizaciones(1, $scope.itemsPorPagina, textoBusqueda);
				}

			}
		}

		$scope.filtrarCotizaciones = function (inicio, fin, pagina, itemsPorPagina, texto) {
			blockUI.start();
			if (texto == "" || texto == null) {
				texto = 0;
			} else {
				$scope.textoBusqueda = texto;
			}
			inicio = (fin == null || fin == undefined) ? 0 : new Date($scope.convertirFecha(inicio));
			fin = (fin == null || fin == undefined) ? 0 : new Date($scope.convertirFecha(fin));
			var promesa = FiltroCotizacionPaginador($scope.usuario.id_empresa, pagina, itemsPorPagina, texto, inicio, fin);
			promesa.then(function (dato) {
				if (dato.cotizaciones.length != 0) {
					$scope.cotizaciones = dato.cotizaciones;

				} else {
					blockUI.stop();
					return $scope.buscarCotizaciones(1, $scope.itemsPorPagina, "");
				}
				$scope.paginas = [];
				for (var i = 1; i <= dato.paginas; i++) {
					$scope.paginas.push(i);
				}
				blockUI.stop();
			});
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

		$scope.dibujarCabeceraImpresionCotizacion = function (doc, cotizacion, pagina, totalPaginas, existenDescuentos, yCuerpo) {
			var yCabecera = 80;
			var yEspacio = 10;
			if ($scope.usuario.empresa.imagen.length > 100) {
				// doc.image($scope.usuario.empresa.imagen, 20,  60, 40, { width: 50, height: 50 });
				doc.image($scope.usuario.empresa.imagen, 60, 40, { fit: [65, 65] });
			}
			doc.font('Helvetica-Bold', 16);
			doc.text("COTIZACIÓN", 250, 90); 
			
			doc.font('Helvetica-Bold', 8);
			
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(), 60, 105);

			doc.font('Helvetica', 7);
			doc.text(cotizacion.sucursal.nombre.toUpperCase(), 60, 113);
			var longitudCaracteres = cotizacion.sucursal.direccion.length;
			var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
			doc.text(cotizacion.sucursal.direccion.toUpperCase(), 60, 121);
			var telefono = (cotizacion.sucursal.telefono1 != null ? cotizacion.sucursal.telefono1 : "") +
				(cotizacion.sucursal.telefono2 != null ? "-" + cotizacion.sucursal.telefono2 : "") +
				(cotizacion.sucursal.telefono3 != null ? "-" + cotizacion.sucursal.telefono3 : "");
			doc.text("TELF.: " + telefono, 60, yDesc);
			doc.text("COCHABAMBA - BOLIVIA", 60, yDesc + 8);

			doc.font('Helvetica-Bold', 8);
			doc.rect(380, 40, 190, 50).stroke();
			doc.text("NRO : ", 400, 60);
			doc.text(cotizacion.numero_documento, 500, 60);

			doc.rect(50, 160, 520, 40).stroke();
			doc.text("FECHA : ", 60, 165);
			doc.text("SEÑOR(ES) : ", 60, 175);
			doc.text("NIT : ", 360, 165);
			doc.text(cotizacion.fechaTexto, 120, 165);
			doc.text(cotizacion.cliente.razon_social, 120, 175);
			doc.text(cotizacion.cliente.nit, 400, 165);
			


			doc.rect(50, 200, 520, 25).stroke();
			
			if (existenDescuentos) {
				doc.text("CODIGO", 55, yCuerpo);
				doc.text("CANT.", 105, yCuerpo);
				doc.text("UNID.", 135, yCuerpo);
				doc.text("DETALLE", 170, yCuerpo);
				doc.text("P. UNIT.", 300, yCuerpo);
				doc.text("IMPORTE", 335, yCuerpo);
				doc.text("DESC. Bs", 385, yCuerpo);
				doc.text("REC. Bs", 420, yCuerpo);
				doc.text("ICE", 455, yCuerpo);
				doc.text("EXC.", 490, yCuerpo);
				doc.text("TOTAL", 520, yCuerpo);
			} else {
				doc.text("CODIGO", 55, 210, { width: 70 });
				doc.text("CANT.", 125, 210);
				if (cotizacion.detallesCotizacion[0].producto) {
					doc.text("UNIDAD", 155, 210);
				}
				doc.text("DETALLE", 198, 210);
				if (cotizacion.detallesCotizacion[0].producto) {
					doc.text("P.UNIT.", 470, 210);
				}
				doc.text("TOTAL", 530, 210);
			}
			doc.font('Helvetica', 8);
			var currentDate = new Date();
		}

		$scope.imprimirCotizacionCartaOficio = function (papel, cotizacion, itemsPorPagina) {
			//cabecera para: oficio, 1/2 oficio, carta.
			var doc = new PDFDocument({ size: papel, compress: false, margin: 10 });
			var stream = doc.pipe(blobStream());
			cotizacion.fecha = new Date(cotizacion.fecha);
			cotizacion.fechaTexto = cotizacion.fecha.getDate() + "/" + (cotizacion.fecha.getMonth() + 1) + "/" + cotizacion.fecha.getFullYear();
			var yCuerpo = 240, totalAray = 0, items = 0, pagina = 1, totalPaginas = Math.ceil(cotizacion.detallesCotizacion.length / itemsPorPagina);
			var existenDescuentos = $scope.verificarDescuentos(cotizacion.detallesCotizacion);
			$scope.dibujarCabeceraImpresionCotizacion(doc, cotizacion, pagina, totalPaginas, existenDescuentos, yCuerpo - 20);
			var totalBS = 0.0
			for (var i = 0; i < cotizacion.detallesCotizacion.length; i++) {
				doc.font('Helvetica', 7);
				indx = i + 1
				totalBS = totalBS + cotizacion.detallesCotizacion[i].total
				if (existenDescuentos) {
					doc.text(cotizacion.detallesCotizacion[i].producto.codigo, 55, yCuerpo, { width: 70 });
					doc.text(cotizacion.detallesCotizacion[i].cantidad, 110, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].producto.unidad_medida, 135, yCuerpo);
					var longitudCaracteres = cotizacion.detallesCotizacion[i].producto.nombre.length;
					var yDesc = (longitudCaracteres <= 45) ? yCuerpo : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? yCuerpo - 7 : yCuerpo - 14);
					doc.text(cotizacion.detallesCotizacion[i].producto.nombre, 170, yDesc - 5, { width: 130 });///////////
					doc.text((cotizacion.detallesCotizacion[i].precio_unitario===null)?'null':cotizacion.detallesCotizacion[i].precio_unitario.toFixed(2), 300, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].importe.toFixed(2), 335, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].descuento.toFixed(2), 385, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].recargo.toFixed(2), 420, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].ice.toFixed(2), 455, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].excento.toFixed(2), 490, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].total.toFixed(2), 520, yCuerpo);
				} else {
					doc.text(cotizacion.detallesCotizacion[i].producto.codigo, 55, yCuerpo, { width: 70 });
					doc.text(cotizacion.detallesCotizacion[i].cantidad, 135, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].producto.unidad_medida, 155, yCuerpo);
					var longitudCaracteres = cotizacion.detallesCotizacion[i].producto.nombre.length;
					var yDesc = (longitudCaracteres <= 45) ? yCuerpo : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? yCuerpo - 7 : yCuerpo - 14);
					if ($scope.usuario.empresa.usar_vencimientos) {
						if (cotizacion.detallesCotizacion[i].inventario) {
							cotizacion.detallesCotizacion[i].inventario.fecha_vencimiento = new Date(cotizacion.detallesCotizacion[i].inventario.fecha_vencimiento);
							cotizacion.detallesCotizacion[i].inventario.fechaVencimientoTexto = cotizacion.detallesCotizacion[i].inventario.fecha_vencimiento.getDate() + "/" + (cotizacion.detallesCotizacion[i].inventario.fecha_vencimiento.getMonth() + 1) + "/" + cotizacion.detallesCotizacion[i].inventario.fecha_vencimiento.getFullYear();
							doc.text(cotizacion.detallesCotizacion[i].inventario.fechaVencimientoTexto, 400, yCuerpo);
							doc.text(cotizacion.detallesCotizacion[i].inventario.lote, 460, yCuerpo);
						}
						doc.text(cotizacion.detallesCotizacion[i].producto.nombre, 200, yDesc - 5, { width: 185 });/////
					} else {
						doc.text(cotizacion.detallesCotizacion[i].producto.nombre, 240, yDesc - 5, { width: 225 });//////
					}
					doc.text((cotizacion.detallesCotizacion[i].precio_unitario===null)?'null':cotizacion.detallesCotizacion[i].precio_unitario.toFixed(2), 470, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].total.toFixed(2), 530, yCuerpo);
				}
				ancho = longitudCaracteres <= 80 ? 20 : 30
				// doc.rect(35, yCuerpo - 10, 540, ancho).stroke(); /// fila de detalle
				doc.rect(50, yCuerpo - 15, 520, 30).stroke();
				yCuerpo = yCuerpo + 20;

				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}

				doc.text("usuario : " + $scope.usuario.nombre_usuario, 55, yCuerpo + 20);
				doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 180, yCuerpo + 20);
				items = items + 1;

				if (items == itemsPorPagina) {
					totalAray = totalAray + items;
					if (totalAray != cotizacion.detallesCotizacion.length) {
						doc.text('Pag. ' + pagina + ' de ' + totalPaginas, 520, papel[1] - 40);
						doc.addPage({ size: papel, margin: 10 });
						yCuerpo = 140;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraImpresionCotizacion(doc, cotizacion, pagina, totalPaginas, existenDescuentos, yCuerpo - 20);
					}
				}
			}
			//TOTAL
			


			doc.font('Helvetica-Bold', 8);
			doc.text("TOTAL", 470, yCuerpo);
			
			doc.font('Helvetica', 8);
			doc.text(totalBS.toFixed(2), 530, yCuerpo);

			doc.text("SON : " + cotizacion.numero_literal, 55, yCuerpo);
			doc.rect(50, yCuerpo-5, 520, 30).stroke();
		
			if (totalPaginas > 1) {
				doc.text('Pag. ' + pagina + ' de ' + totalPaginas, 520, papel[1] - 40);
			}
			
			doc.end();

			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
			$scope.usuario.empresa.imagen = imagenEmpresa;
		});

		$scope.dibujarCabeceraImpresionCotizacionCuartoCarta = function (doc, cotizacion, pagina, totalPaginas, existenDescuentos, yCuerpo) {
			var yCabecera = 80;
			var yEspacio = 10;
			if ($scope.usuario.empresa.imagen.length > 100) {
				doc.image($scope.usuario.empresa.imagen, 20, yCuerpo - yCabecera, { width: 50, height: 50 });
			} else {
				doc.image($scope.usuario.empresa.imagen, 20, yCuerpo - yCabecera);
			}
			sucurTel = {}
			for (var i = 0; i < $scope.sucursales.length; i++) {
				if ($scope.sucursales[i].id == cotizacion.id_sucursal) {
					sucurTel = $scope.sucursales[i].telefono1
				}
			}
			doc.font('Helvetica-Bold', 8);
			doc.text("COTIZACIÓN N°" + cotizacion.id, 120, yCuerpo - yCabecera);
			doc.font('Helvetica', 7);
			doc.text("Nombre: " + cotizacion.nombre + "    Descripción: " + cotizacion.descripcion, 20, yCuerpo - (yEspacio * 2));
			doc.text("Fecha: " + cotizacion.fechaTexto, 225, yCuerpo - (yEspacio * 2));
			doc.font('Helvetica-Bold', 7);
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(), 220, yCuerpo - yCabecera + (yEspacio * 0));
			doc.font('Helvetica', 6);
			doc.text('NIT ' + $scope.usuario.empresa.nit, 225, yCuerpo - yCabecera + (yEspacio * 1));
			doc.text("TELF.: " + sucurTel, 225, yCuerpo - yCabecera + (yEspacio * 2));
			doc.text("Fecha: " + cotizacion.fechaTexto, 225, yCuerpo - yCabecera + (yEspacio * 3));
			doc.font('Helvetica', 5);
			doc.text("COCHABAMBA - BOLIVIA", 220, yCuerpo - yCabecera + (yEspacio * 4));
			doc.rect(15, yCuerpo - yEspacio, 282, (yEspacio * 2)).stroke();
			doc.font('Helvetica', 6);
			doc.text("N°", 20, yCuerpo);
			if (existenDescuentos) {
				doc.text("Cod.", 30, yCuerpo);
				doc.text("Cant.", 60, yCuerpo);
				doc.text("Unid.", 80, yCuerpo);
				doc.text("Det.", 100, yCuerpo);
				doc.text("P.Unit.", 184, yCuerpo);
				doc.text("Imp.", 212, yCuerpo);
				doc.text("Desc.", 240, yCuerpo);

				doc.text("Totl.", 270, yCuerpo);
			} else {
				doc.text("Cod.", 30, yCuerpo);
				doc.text("Cant.", 60, yCuerpo);
				doc.text("Unid.", 80, yCuerpo);
				doc.text("Detalle.", 100, yCuerpo);
				doc.text("P.Unit.", 195, yCuerpo);
				doc.text("Total.", 270, yCuerpo);
			}
			doc.font('Helvetica', 8);
		}



		$scope.imprimirCotizacionRollo = function (papel, cotizacion) {
			///impresion rollo, cuarto carta
			var doc = new PDFDocument({ size: papel, compress: false, margin: 10 });
			var stream = doc.pipe(blobStream());
			cotizacion.fecha = new Date(cotizacion.fecha);
			cotizacion.fechaTexto = cotizacion.fecha.getDate() + "/" + (cotizacion.fecha.getMonth() + 1) + "/" + cotizacion.fecha.getFullYear();
			var itemsPorPagina = 0;
			if (cotizacion.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
				itemsPorPagina = 13;
			} else if (cotizacion.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_CUARTOCARTA) {
				itemsPorPagina = 13;
			}
			var yCuerpo = 140, totalAray = 0, items = 0, pagina = 1, totalPaginas = Math.ceil(cotizacion.detallesCotizacion.length / itemsPorPagina);
			var existenDescuentos = $scope.verificarDescuentos(cotizacion.detallesCotizacion);
			$scope.dibujarCabeceraImpresionCotizacionCuartoCarta(doc, cotizacion, pagina, totalPaginas, existenDescuentos, yCuerpo - 20);
			var totalImporte = 0;
			for (var i = 0; i < cotizacion.detallesCotizacion.length; i++) {
				doc.font('Helvetica', 7);
				totalImporte = totalImporte + cotizacion.detallesCotizacion[i].importe
				indx = i + 1
				var longitudCaracteres = cotizacion.detallesCotizacion[i].producto.nombre.length;
				doc.text(indx, 20, yCuerpo)//, 555, 25)
				if (existenDescuentos) {
					doc.text(cotizacion.detallesCotizacion[i].producto.codigo, 30, yCuerpo-7, { width: 32 });
					doc.text(cotizacion.detallesCotizacion[i].cantidad, 64, yCuerpo, { width: 30 });
					doc.text(cotizacion.detallesCotizacion[i].producto.unidad_medida, 79, yCuerpo, { width: 30 });
					var yDesc = longitudCaracteres <= 45 ? yCuerpo - 7 : yCuerpo;
					doc.text(cotizacion.detallesCotizacion[i].producto.nombre, 100, yDesc -7, { width: 80 });
					doc.text(cotizacion.detallesCotizacion[i].precio_unitario.toFixed(2), 184, yCuerpo, { width: 30 });
					doc.text(cotizacion.detallesCotizacion[i].importe.toFixed(2), 212, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].tipo_descuento ? "%" : "Bs", 240, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].descuento.toFixed(2), 250, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].total.toFixed(2), 270, yCuerpo);
				} else {
					doc.text(cotizacion.detallesCotizacion[i].producto.codigo, 30, yCuerpo-7, { width: 32 });
					doc.text(cotizacion.detallesCotizacion[i].cantidad, 64, yCuerpo, { width: 30 });
					doc.text(cotizacion.detallesCotizacion[i].producto.unidad_medida, 79, yCuerpo, { width: 30 });
					console.log(longitudCaracteres)
					var yDesc = (longitudCaracteres <= 65) ? yCuerpo -7 : yCuerpo;
					doc.text(cotizacion.detallesCotizacion[i].producto.nombre, 100, yDesc, { width: 80 });
					doc.text(cotizacion.detallesCotizacion[i].precio_unitario.toFixed(2), 184, yCuerpo, { width: 30 });
					doc.text(cotizacion.detallesCotizacion[i].total.toFixed(2), 270, yCuerpo);
				}
				ancho = longitudCaracteres <= 80 ? 20 : 30
				doc.rect(15, yCuerpo - 10, 282, ancho).stroke(); /// fila de detalle
				yCuerpo = yCuerpo + 20;

				items++;
			}
			//TOTAL
			doc.font('Helvetica-Bold', 7);
			doc.text("TOTAL BS.", 225, yCuerpo);
			doc.text(totalImporte.toFixed(1), 270, yCuerpo);
			doc.rect(220, yCuerpo - 10, 77, 20).stroke();
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		$scope.imprimirCotizacionCuartoCarta = function (papel, cotizacion, itemsPorPagina) {
			///impresion rollo, cuarto carta
			var doc = new PDFDocument({ size: papel, compress: false, margin: 10 });
			var stream = doc.pipe(blobStream());
			cotizacion.fecha = new Date(cotizacion.fecha);
			cotizacion.fechaTexto = cotizacion.fecha.getDate() + "/" + (cotizacion.fecha.getMonth() + 1) + "/" + cotizacion.fecha.getFullYear();
			var yCuerpo = 140, totalAray = 0, items = 0, pagina = 1, totalPaginas = Math.ceil(cotizacion.detallesCotizacion.length / itemsPorPagina);
			var existenDescuentos = $scope.verificarDescuentos(cotizacion.detallesCotizacion);
			$scope.dibujarCabeceraImpresionCotizacionCuartoCarta(doc, cotizacion, pagina, totalPaginas, existenDescuentos, yCuerpo - 20);
			var totalImporte = 0;
			for (var i = 0; i < cotizacion.detallesCotizacion.length; i++) {
				doc.font('Helvetica', 7);
				totalImporte = totalImporte + cotizacion.detallesCotizacion[i].importe
				indx = i + 1
				var longitudCaracteres = cotizacion.detallesCotizacion[i].producto.nombre.length;
				doc.text(indx, 20, yCuerpo)//, 555, 25)
				if (existenDescuentos) {
					doc.text(cotizacion.detallesCotizacion[i].producto.codigo, 30, yCuerpo - 7, { width: 32 });
					doc.text(cotizacion.detallesCotizacion[i].cantidad, 64, yCuerpo, { width: 30 });
					doc.text(cotizacion.detallesCotizacion[i].producto.unidad_medida, 79, yCuerpo, { width: 30 });
					var yDesc = longitudCaracteres <= 45 ? yCuerpo - 7 : yCuerpo;
					doc.text(cotizacion.detallesCotizacion[i].producto.nombre, 100, yDesc, { width: 80 });
					doc.text(cotizacion.detallesCotizacion[i].precio_unitario.toFixed(2), 184, yCuerpo, { width: 30 });
					doc.text(cotizacion.detallesCotizacion[i].importe.toFixed(2), 212, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].tipo_descuento ? "%" : "Bs", 240, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].descuento.toFixed(2), 250, yCuerpo);
					doc.text(cotizacion.detallesCotizacion[i].total.toFixed(2), 270, yCuerpo);
				} else {
					doc.text(cotizacion.detallesCotizacion[i].producto.codigo, 30, yCuerpo, { width: 32 });
					doc.text(cotizacion.detallesCotizacion[i].cantidad, 64, yCuerpo, { width: 30 });
					doc.text(cotizacion.detallesCotizacion[i].producto.unidad_medida, 79, yCuerpo, { width: 30 });
					var yDesc = longitudCaracteres <= 45 ? yCuerpo - 7 : yCuerpo;
					doc.text(cotizacion.detallesCotizacion[i].producto.nombre, 100, yDesc, { width: 80 });
					doc.text(cotizacion.detallesCotizacion[i].precio_unitario.toFixed(2), 184, yCuerpo, { width: 30 });
					doc.text(cotizacion.detallesCotizacion[i].total.toFixed(2), 270, yCuerpo);
				}
				ancho = longitudCaracteres <= 80 ? 20 : 30
				doc.rect(15, yCuerpo - 10, 282, ancho).stroke(); /// fila de detalle
				yCuerpo = yCuerpo + 20;

				items++;

				if (items == itemsPorPagina) {
					totalAray = totalAray + items;
					if (totalAray != cotizacion.detallesCotizacion.length) {
						doc.text('Pag. ' + pagina + ' de ' + totalPaginas, 260, papel[1] - 40);
						doc.addPage({ size: papel, margin: 10 });
						yCuerpo = 140
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraImpresionCotizacionCuartoCarta(doc, cotizacion, pagina, totalPaginas, existenDescuentos, yCuerpo - 20);
					}
				}
			}
			//TOTAL
			doc.font('Helvetica-Bold', 7);
			doc.text("TOTAL BS.", 225, yCuerpo);
			doc.text(totalImporte.toFixed(2), 270, yCuerpo);
			doc.rect(220, yCuerpo - 10, 77, 20).stroke();
			if (totalPaginas > 1) {
				doc.text('Pag. ' + pagina + ' de ' + totalPaginas, 255, papel[1] - 40);
			}
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				$window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}
		$scope.imprimirCotizacion = function (cotizacionId) {
			console.log('cotizacion id')
			console.log(cotizacionId)
			var promesa = DatosImpresionCotizacion(cotizacionId.id, $scope.usuario.id_empresa);
			promesa.then(function (datos) {
				console.log('datos')
				console.log(datos.cotizacion)
				var cotizacionConsultada = datos.cotizacion;
				cotizacionConsultada.configuracion = datos.configuracionGeneralFactura;
				var fecha = new Date(cotizacionConsultada.fecha);
				cotizacionConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
				var papel;
				if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
					console.log('impresion papel oficio')
					papel = [612, 792];
					itemsPorPagina = 30;
					$scope.imprimirCotizacionCartaOficio(papel, cotizacionConsultada, itemsPorPagina);
				} else if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
					console.log('impresion papel carta')
					papel = [612, 792];
					itemsPorPagina = 20;
					$scope.imprimirCotizacionCartaOficio(papel, cotizacionConsultada, itemsPorPagina);
				} else if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
					console.log('impresion papel medio oficio')
					papel = [612, 468];
					itemsPorPagina = 12;
					$scope.imprimirCotizacionCartaOficio(papel, cotizacionConsultada, itemsPorPagina);
				}
				else if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_ROLLO) {
					console.log('impresion papel rollo')
					var alto;
					if (cotizacionConsultada.detallesCotizacion.length <= 2) {
						console.log('impresion papel rollo detalle <= 2')
						alto = 610;
					} else {
						console.log('impresion papel rollo detalle > 2')
						alto = 610 + (20 * (cotizacionConsultada.detallesCotizacion.length - 2))
					}
					console.log('impresion papel rollo alto: ' + alto)
					papel = [306, alto];
					// itemsPorPagina = 10;
					$scope.imprimirCotizacionRollo(papel, cotizacionConsultada);
				} else if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_CUARTOCARTA) {
					papel = [306, 396];
					itemsPorPagina = 8;
					$scope.imprimirCotizacionCuartoCarta(papel, cotizacionConsultada, itemsPorPagina);
				}
			});
		}
		$scope.inicio();
	});