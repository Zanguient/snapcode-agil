angular.module('agil.controladores')
	.controller('ControladorCotizacion', ['$scope', 'blockUI', '$localStorage', '$location', '$templateCache', '$route', '$timeout', 'ListaCotizacion', 'Cotizaciones', 'Cotizacion', 'filtroCotizaciones', 'Diccionario',
		'ListaInventariosProducto', 'ClasesTipo', '$window', 'ListaProductosEmpresa', 'InventarioPaginador', 'ConfiguracionCotizacionVista', 'ConfiguracionCotizacionVistaDatos', 'FiltroCotizacionPaginador', 'Paginator',
		'DatosImpresionCotizacion', 'ultimaCotizacion', 'ListaSucursalesUsuario', 'ClientesNit', 'CotizacionRechazo', 'ListaProductosEmpresaUsuario', 'UsuarioFirma', function ($scope, blockUI, $localStorage, $location, $templateCache, $route, $timeout, ListaCotizacion, Cotizaciones, Cotizacion, filtroCotizaciones, Diccionario,
		ListaInventariosProducto, ClasesTipo, $window, ListaProductosEmpresa, InventarioPaginador, ConfiguracionCotizacionVista, ConfiguracionCotizacionVistaDatos, FiltroCotizacionPaginador, Paginator,
		DatosImpresionCotizacion, ultimaCotizacion, ListaSucursalesUsuario, ClientesNit, CotizacionRechazo, ListaProductosEmpresaUsuario, UsuarioFirma) {

		$scope.usuario = JSON.parse($localStorage.usuario);
		
		convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
			$scope.usuario.empresa.imagen = imagenEmpresa;
		});
		if($scope.usuario.persona.firma){
			convertUrlToBase64Image($scope.usuario.persona.firma, function (imagenFirma) {
				$scope.usuario.persona.firma = imagenFirma;
			});
		}

		$scope.idModalWizardCotizacionNueva = 'modal-wizard-cotizacion-nueva';
		// $scope.idModalWizardCotizacionModificar = 'modal-wizard-cotizacion-modificar';
		$scope.idModalInventario = "dialog-productos-venta";
		$scope.idModalDialogRechazo = "dialog-editar-rechazo";
		$scope.idModalDialogFirmaUsuario = "dialog-firma-usuario";
		$scope.idImagenFirmaUsuario = 'imagen-firma';
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
			$scope.sucursales = [];
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
			$scope.dynamicPopoverRechazo = {
                    templateUrl: 'myPopoverTemplate.html',
            };
			$scope.paginator.callBack = $scope.obtenerLista;
			$scope.filtro = { empresa: $scope.usuario.id_empresa, inicio: "", fin: "", fecha_inicio: new Date(), fecha_fin: new Date(), busqueda: "", importe: 0, estado: "", sucursal: "", usuario: "", razon_social: "", nit: "" };
			// $scope.paginator.getSearch("", $scope.filtro, null);
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


		$scope.sumarMonto = function () {
			var suma = 0;
			for (var i = 0; i < $scope.cotizaciones.length; i++) {
				suma = suma + $scope.cotizaciones[i].importe;
			}
			return Math.round(suma * 100) / 100;
		}

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsCotizacion($scope.idModalWizardCotizacionNueva, $scope.idModalInventario, $scope.idModalDialogRechazo, $scope.idModalDialogFirmaUsuario, $scope.idImagenFirmaUsuario);
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
			$scope.eliminarPopup($scope.idModalDialogRechazo);
			$scope.eliminarPopup($scope.idModalDialogFirmaUsuario);

		});

		$scope.ModificarCotizacion = function (cotizacion) {
			$scope.cotizacion = cotizacion;
			$scope.obtenerAlmacenes(cotizacion.sucursal);
			$scope.cotizacion.fecha = new Date($scope.cotizacion.fecha);
			$scope.cotizacion.fechaTexto = $scope.cotizacion.fecha.getDate() + "/" + ($scope.cotizacion.fecha.getMonth() + 1) + "/" + $scope.cotizacion.fecha.getFullYear();
			$scope.abrirPopup($scope.idModalWizardCotizacionNueva);
		}

		$scope.buscarProducto = function (query) {
			if (query != "" && query != undefined) {
				//var promesa = ListaProductosEmpresa($scope.usuario.id_empresa, query);
				var promesa = ListaProductosEmpresaUsuario($scope.usuario.id_empresa, query, $scope.usuario.id, $scope.cotizacion.almacen.id);
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
			producto.activar_inventario = false;
			$scope.calcularImporte();
			$scope.productoSeleccionado = true;

			var promesa = ListaInventariosProducto(producto.id, $scope.cotizacion.almacen.id);
			promesa.then(function (inventarios) {
				producto.inventarios = inventarios;
				// === para colocar el costo unitario de inventario == 
				$scope.precio_inventario;
				if (producto.inventarios.length > 0) {
					$scope.precio_inventario = producto.inventarios[producto.inventarios.length - 1].costo_unitario + " Bs";

				} else {
					$scope.precio_inventario = "Sin histórico";
				}
				
			});
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
			// $scope.obtenerSucursales()
			$scope.cotizacion = new Cotizacion({
				id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, cliente: {},
				detallesCotizacion: [],
				sucursal: ($scope.sucursales ? $scope.sucursales.length == 1 ? $scope.sucursales[0] : null : null)
			});
			if ($scope.cotizacion.sucursal) {
				$scope.obtenerAlmacenes($scope.cotizacion.sucursal)
				$scope.cotizacion.almacen = $scope.almacenes ? $scope.almacenes.length == 1 ? $scope.almacenes[0] : null : null
			}
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
				cotizacion.sucursal = cotizacion.sucursal.id
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
					var tiempoActual = new Date();
					cotizacion.fecha = new Date($scope.convertirFecha(cotizacion.fechaTexto));
					cotizacion.fecha.setHours(tiempoActual.getHours());
					cotizacion.fecha.setMinutes(tiempoActual.getMinutes());
					cotizacion.fecha.setSeconds(tiempoActual.getSeconds())
					cotizacion.$save(function (res) {
						console.log("cotizacion guardaoooo ", res);
						blockUI.stop();
						// promesa = ultimaCotizacion()
						// promesa.then(function (dato) {
						// 	$scope.cotizacionImp = dato.cotizacion[0];
						// 	console.log(dato.cotizacion[0].id)
						// 	$scope.imprimirCotizacion($scope.cotizacionImp);
						// });
						$scope.imprimirCotizacion(res.cotizacion);
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
			// console.log("seleccion sucursallllllll ", idSucursal);
			$scope.almacenes = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal.id; })[0];
			$scope.almacenes = sucursal.almacenes;

			// if (!$scope.venta.editar) {
			// 	$scope.venta.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : null;
			// 	if ($scope.venta.almacen) {
			// 		$scope.cargarProductos();
			// 	}
			// }
		}

		
		$scope.abrirFirmaUsuario = function () {
			// $scope.usuario = new Usuario({ persona: { imagen: "" }});
			$scope.firmaNew = true;
			if($scope.usuario.persona.firma){
				$scope.firmaNew = false;
			}
			$scope.abrirPopup($scope.idModalDialogFirmaUsuario);
		}

		$scope.cerrarDialogFirmaUsuario = function () {
            $scope.cerrarPopup($scope.idModalDialogFirmaUsuario);
		}


		$scope.canvas = document.getElementById('signature-pad');  
		$scope.signaturePad = new SignaturePad($scope.canvas);
		// $scope.signaturePad .penColor = "rgb(66, 133, 244)";
		

		$scope.limpiarFirma = function (){
			$scope.firmaNew = true;		
			$scope.signaturePad.clear();
			
		}

		$scope.subirImagenFirma = function (event) {
			$scope.firmaNew = false;
			var files = event.target.files;

			var reader = new FileReader();
            
            reader.onload = function (e) {
				$scope.usuario.persona.firma = e.target.result;
				$scope.$apply()
			}
		
			reader.readAsDataURL(files[0]);
		}

		

		$scope.saveFirma = function (usuario) {
			if($scope.firmaNew){
				usuario.persona.firma = $scope.signaturePad.toDataURL("image/jpg"); 
			}
			$scope.firmaNew = false;

			blockUI.start();
			if (usuario.id) {
				UsuarioFirma.update({ id_usuario: usuario.id }, usuario, function (res) {
					blockUI.stop();
					$scope.cerrarDialogFirmaUsuario();
					$scope.mostrarMensaje('Guardado Exitosamente!');
				});
			} 
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
			
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(), 60, 110);

			doc.font('Helvetica', 7);
			doc.text(cotizacion.sucursal.nombre.toUpperCase(), 60, 118);
			var longitudCaracteres = cotizacion.sucursal.direccion.length;
			var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
			doc.text(cotizacion.sucursal.direccion.toUpperCase(), 60, 126);
			var telefono = (cotizacion.sucursal.telefono1 != null ? cotizacion.sucursal.telefono1 : "") +
				(cotizacion.sucursal.telefono2 != null ? "-" + cotizacion.sucursal.telefono2 : "") +
				(cotizacion.sucursal.telefono3 != null ? "-" + cotizacion.sucursal.telefono3 : "");
			doc.text("TELF.: " + telefono, 60, yDesc + 5);
			doc.text("COCHABAMBA - BOLIVIA", 60, yDesc + 13);

			doc.font('Helvetica-Bold', 10);
			doc.rect(450, 40, 120, 50).stroke();
			doc.text("NRO : ", 460, 60);
			doc.text(cotizacion.numero_documento, 500, 60);

			doc.font('Helvetica-Bold', 8);
			doc.rect(50, 160, 520, 40).stroke();
			doc.text("FECHA : ", 60, 165);
			doc.text("SEÑOR(ES) : ", 60, 180);
			doc.text("NIT : ", 360, 165);
			doc.text(cotizacion.fechaTexto, 120, 165);
			doc.text(cotizacion.cliente.razon_social, 120, 180);
			doc.text(cotizacion.cliente.nit, 400, 165);
			


			doc.rect(50, 200, 520, 25).stroke();
			
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
			doc.font('Helvetica', 8);
			var currentDate = new Date();
		}

		$scope.imprimirCotizacionCartaOficio = function (papel, cotizacion, itemsPorPagina, numero_literal) {
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
				
				doc.text(cotizacion.detallesCotizacion[i].producto.codigo, 55, yCuerpo, { width: 70 });
				doc.text(cotizacion.detallesCotizacion[i].cantidad, 135, yCuerpo);
				doc.text(cotizacion.detallesCotizacion[i].producto.unidad_medida, 155, yCuerpo);
				var longitudCaracteres = cotizacion.detallesCotizacion[i].producto.nombre.length;
				var yDesc = (longitudCaracteres <= 45) ? yCuerpo : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? yCuerpo - 7 : yCuerpo - 14);
				doc.text(cotizacion.detallesCotizacion[i].producto.nombre, 200, yDesc - 5, { width: 225 });//////
				doc.text((cotizacion.detallesCotizacion[i].precio_unitario===null)?'null':cotizacion.detallesCotizacion[i].precio_unitario.toFixed(2), 470, yCuerpo);
				doc.text(cotizacion.detallesCotizacion[i].total.toFixed(2), 530, yCuerpo);
			
				ancho = longitudCaracteres <= 80 ? 20 : 30
				// doc.rect(35, yCuerpo - 10, 540, ancho).stroke(); /// fila de detalle
				doc.rect(50, yCuerpo - 15, 520, 30).stroke();
				yCuerpo = yCuerpo + 30;

				
				items = items + 1;

				if (items == itemsPorPagina) {
					totalAray = totalAray + items;
					if (totalAray != cotizacion.detallesCotizacion.length) {
						doc.text('Pag. ' + pagina + ' de ' + totalPaginas, 520, papel[1] - 40);
						doc.addPage({ size: papel, margin: 10 });
						yCuerpo = 240;
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

			doc.text("SON : " + numero_literal, 55, yCuerpo);
			doc.rect(50, yCuerpo-15, 520, 30).stroke();
			if (items > itemsPorPagina-6) {
				doc.addPage({ size: papel, margin: 10 });
				yCuerpo = 240;
				items = 0;
				pagina = pagina + 1;
				$scope.dibujarCabeceraImpresionCotizacion(doc, cotizacion, pagina, totalPaginas, existenDescuentos, yCuerpo - 20);
			}
			
			
			doc.rect(50, yCuerpo + 40, 420, 25).stroke();
			doc.font('Helvetica', 8);
			doc.text("Plazo de cotizacion: "+cotizacion.plazo, 55, yCuerpo+50);

			doc.rect(50, yCuerpo + 80, 420, 25).stroke();
			doc.font('Helvetica', 8);
			doc.text("Nota: "+cotizacion.nota, 55, yCuerpo+90);

			doc.rect(50, yCuerpo + 120, 420, 25).stroke();
			doc.font('Helvetica', 8);
			if (cotizacion.descripcion == null) {
				cotizacion.descripcion = "Ninguna";
			}
			doc.text("Observaciones: "+cotizacion.descripcion, 55, yCuerpo+130);

			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.font('Helvetica', 8);

			if ($scope.usuario.persona.firma){
				if ($scope.usuario.persona.firma > 100) {
					doc.image($scope.usuario.persona.firma, 55, papel[1] - 150, { width: 50, height: 50 });
				} else {
					doc.image($scope.usuario.persona.firma, 55, papel[1] - 150, { width: 90, height: 70 });
				}
			}

			doc.text(cotizacion.firma, 55, papel[1] - 90);
			doc.text(cotizacion.cargo.toUpperCase(), 55, papel[1] - 80);

			doc.text("usuario : " + $scope.usuario.nombre_usuario, 380, papel[1] - 60);
			doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 480, papel[1] - 60);
		
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

		// var pormimg = ObtenerImagen($scope.usuarioSesion.empresa.imagen)
			// 	pormimg.then(function (img) {
			// 		$scope.usuario.empresa.imagen = img
			// 	})

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
			var pormimg = ObtenerImagen($scope.usuarioSesion.empresa.imagen)
				pormimg.then(function (img) {
					$scope.usuario.empresa.imagen = img
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
				})
			
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

				/* console.log('impresion papel carta')
				papel = [612, 792];
				itemsPorPagina = 10;
				$scope.imprimirCotizacionCartaOficio(papel, cotizacionConsultada, itemsPorPagina, datos.numero_literal); */
				 if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
					console.log('impresion papel oficio')
					papel = [612, 936];
				 	itemsPorPagina = 20;
				 	$scope.imprimirCotizacionCartaOficio(papel, cotizacionConsultada, itemsPorPagina, datos.numero_literal);
				 } else if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
				 	console.log('impresion papel carta')
				 	papel = [612, 792];
				 	itemsPorPagina = 15;
				 	$scope.imprimirCotizacionCartaOficio(papel, cotizacionConsultada, itemsPorPagina, datos.numero_literal);
				 } else if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
				 	console.log('impresion papel medio oficio')
				 	papel = [612, 468];
				 	itemsPorPagina = 5;
				 	$scope.imprimirCotizacionCartaOficio(papel, cotizacionConsultada, itemsPorPagina, datos.numero_literal);
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
				 	 itemsPorPagina = 10;
					$scope.imprimirCotizacionRollo(papel, cotizacionConsultada);
				 } else if (cotizacionConsultada.configuracion.tamanoPapelCotizacion.nombre_corto == Diccionario.FACT_PAPEL_CUARTOCARTA) {
				 	papel = [306, 396];
					itemsPorPagina = 8;
				 	$scope.imprimirCotizacionCuartoCarta(papel, cotizacionConsultada, itemsPorPagina);
				 }
			});
		}

		 $scope.abrirDialogDialogRechazo = function (cotizacion) {
            $scope.cotizacion = cotizacion;
            // $scope.rechazo.fechaTexto = "";
            $scope.abrirPopup($scope.idModalDialogRechazo);
        }

        $scope.cerrarDialogDialogRechazo = function () {
            $scope.cerrarPopup($scope.idModalDialogRechazo);
        }


        $scope.saveRechazo = function (cotizacion) {
        	console.log("cotizacion ssssss ", cotizacion);
        	cotizacion.fecha_estado = new Date($scope.convertirFecha(cotizacion.fechaTexto));
        	cotizacion.estado = "RECHAZADO";
            CotizacionRechazo.update({ id_cotizacion: cotizacion.id }, cotizacion, function (res) {
            	// $scope.cotizacion=rechazo;
            	// $scope.obtenerCotizaciones();

                $scope.mostrarMensaje('actualizado Exitosamente!');
            }, function (error) {
                $scope.mostrarMensaje('Hubo un problema al guardar.');
            });
            blockUI.stop();
            $scope.cerrarDialogDialogRechazo();
        }

        $scope.imprimirFiltroCajaCartaOficio = function (cotizaciones, fechaInicio, fechaFin) {
			var doc = new PDFDocument({ compress: false, size: [612, 792], margin: 0 });
			var stream = doc.pipe(blobStream());
			
			var itemsPorPagina = 20;
			var totalPaginas = Math.ceil(cotizaciones.length / itemsPorPagina);
			
			var y = 100, items = 0, pagina = 1;
			$scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, cotizaciones, fechaInicio, fechaFin);

			doc.font('Helvetica', 7);

			for (var i = 0; i < cotizaciones.length; i++) {
				doc.font('Helvetica', 7);
				doc.rect(50, y + 9, 520, 0).stroke();

				doc.text(i + 1, 55, y + 20);
				doc.font('Helvetica', 6);
				doc.text(cotizaciones[i].sucursal.nombre, 80, y + 20);
				if (cotizaciones[i].cliente) {
					doc.font('Helvetica', 6);
					doc.text(cotizaciones[i].cliente.razon_social, 150, y + 15, { width: 75 });
					doc.font('Helvetica', 7);
					doc.text(cotizaciones[i].cliente.nit, 270, y + 20);
				} else {
					doc.text("", 150, y + 16, { width: 75 });
					doc.text("", 270, y + 20);
				}
				cotizaciones[i].fecha = new Date(cotizaciones[i].fecha);
				doc.text(cotizaciones[i].fecha.getHours() + ":" + cotizaciones[i].fecha.getMinutes() + " - ", 340, y + 21, { width: 28 });
				var widthFecha = 360;
				if (cotizaciones[i].fecha.getMinutes() > 10) {
					widthFecha = 365;
				}
				doc.text(cotizaciones[i].fecha.getDate() + "/" + (cotizaciones[i].fecha.getMonth() + 1) + "/" + cotizaciones[i].fecha.getFullYear(), widthFecha, y + 21, { width: 32 });
				doc.text(cotizaciones[i].importe, 425, y + 20);
				doc.text(cotizaciones[i].usuario.nombre_usuario, 455, y + 20);
				doc.text(cotizaciones[i].estado, 500, y + 16, { width: 65 });

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
					$scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, cotizaciones, fechaInicio, fechaFin);
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
		$scope.imprimirCabeceraFiltroCajaCartaOficio = function (doc, pagina, totalPaginas, cotizaciones, fechaInicio, fechaFin) {

			doc.font('Helvetica-Bold', 16);
			doc.text('REPORTE DE COTIZACIONES', 0, 40, { align: 'center' });
			doc.font('Helvetica-Bold', 8);
			doc.rect(50, 80, 520, 620).stroke();

			doc.text("Desde: " + fechaInicio + " Hasta: " + fechaFin, 0, 55, { align: 'center' });

			doc.font('Helvetica-Bold', 7);
			//doc.rect(50,80,520,25).stroke();


			doc.font('Helvetica-Bold', 8);

			doc.text("N°", 55, 90);
			doc.text("Sucursal", 80, 90);
			doc.text("Razon Social", 150, 90);
			doc.text("Nit Cliente", 270, 90);
			doc.text("Fecha", 340, 90);
			doc.text("Monto", 420, 90);
			doc.text("Usuario", 455, 90);
			doc.text("Estado", 500, 90);
		}

		$scope.imprimirFiltroExcelCajaCartaOficio = function (cotizacion) {
			blockUI.start();

			var data = [["N°", "Sucursal", "Razon Social", "Nit Cliente", "Fecha", "Monto", "Usuario", "Estado"]]
			/*var sumaImporte=0,sumaImporteNo=0,sumaTotal=0,sumaDescuentos=0,sumaImporteBase=0,sumaCredito=0;*/
			for (var i = 0; i < cotizacion.length; i++) {
				cotizacion[i].fecha = new Date(cotizacion[i].fecha);
			}
			cotizacion.sort(function (a, b) {
				if (a.fecha > b.fecha) {
					return 1;
				}
				if (a.fecha < b.fecha) {
					return -1;
				}
				return 0;
			})
			for (var i = 0; i < cotizacion.length; i++) {
				var columns = [];
				columns.push(i + 1);
				columns.push(cotizacion[i].sucursal.nombre);
				if (cotizacion[i].cliente) {
					columns.push(cotizacion[i].cliente.razon_social);
					columns.push(cotizacion[i].cliente.nit);
				} else {
					columns.push("");
					columns.push("");
				}
				columns.push(cotizacion[i].fecha);
				columns.push(cotizacion[i].importe);
				columns.push(cotizacion[i].usuario.nombre_usuario);
				columns.push(cotizacion[i].estado);
				
				
				data.push(columns);

			}

			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "Reporte-cotizaciones.xlsx");
			blockUI.stop();

		}


		$scope.inicio();
	}]);