angular.module('agil.controladores')
	.controller('ControladorOperaciones', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage,
		blockUI, ConfiguracionVentaVistaDatos, ClasesTipo, ListaGruposProductoEmpresa, ProductosPanel, socket, ListaGruposProductoEmpresa, SolicitudesReposicion, SolicitudesFormulacionProducto, SolicitudReposicion) {

		$scope.usuario = JSON.parse($localStorage.usuario);
		convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
			$scope.usuario.empresa.imagen = imagenEmpresa;
		});

		$scope.idDialogDialogPanelOperaciones = "dialog-panel-operaciones"
		$scope.idDialogDatos = "modal-wizard-venta-edicion"
		$scope.idDialogEntregaViveres = "dialogEntregaViveres"

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsOperaciones($scope.idDialogDialogPanelOperaciones,$scope.idDialogEntregaViveres);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			// $scope.obtenerColumnasAplicacion();
		});

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idDialogDialogPanelOperaciones);
			$scope.eliminarPopup($scope.idDialogEntregaViveres);
		})

		$scope.inicio = function () {
			$scope.ordenProductos = true;
			$scope.esContado = true;
			//$scope.obtenerClientes();
			// $scope.obtenerTiposDePago();
			$scope.obtenerConfiguracionVentaVista();
			$scope.sucursales=$scope.obtenerSucursales();
			$scope.sucursalesUsuario = "";
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
				if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
					$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
				}
			}

			$scope.detalleVenta = { producto: { nombre: 'producto 1' }, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
			// $scope.almacenes = [{ nombre: 'Almacen ventura', id: 1 }, { nombre: 'Almacen Nueva ventura', id: 2 }]
			// $scope.sucursales = [{ nombre: 'Sucursal Vieja ventura', id: 1 }, { nombre: 'Sucursal Nueva ventura', id: 2 }]
			$scope.solicitud = { solicitudesProductos: [] }
			$scope.obtenerSolicitudes()
			
			// $scope.solicitudesOperaciones = [{ movimiento: { clase: { nombre: 'circular' } }, almacen: { sucursal: { nombre: 'Sucursal Vieja ventura' } }, fecha: new Date(), monto: 546, usuario: { persona: { nombre: 'Nombre del usuario' } }, estado: { clase: { nombre: 'activo' } } }]
		}

		$scope.obtenerSucursales=function(){
			var sucursales=[];
			for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
				sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			}
			return sucursales;
		}
		$scope.obtenerAlmacenes=function(idSucursal){
			$scope.almacenes=[];
			var sucursal=$.grep($scope.sucursales, function(e){return e.id == idSucursal;})[0];
			$scope.almacenes=sucursal.almacenes;
			$scope.solicitud.almacen=$scope.almacenes.length==1?$scope.almacenes[0]:null;
			if($scope.solicitud.almacen){
				$scope.cargarProductos();
			}
		}

		$scope.obtenerSolicitudes = function () {
			blockUI.start()
			var promesa = SolicitudesReposicion($scope.usuario.id_empresa)
			promesa.then(function (solicitudes) {
				$scope.solicitudesOperaciones = solicitudes.solicitudes
				console.log($scope.solicitudesOperaciones)
				console.log($scope.usuario)
				blockUI.stop()
			},function (error) {
				$scope.mostrarMensaje(error.data)
				blockUI.stop()
			})
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
			$scope.sugerencias = [{nombre:'Silpancho'},{nombre:'Pique'}]
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
			if($scope.productoSeleccionado!==undefined){	
				if (producto.producto.id != $scope.productoSeleccionado.producto.id){
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
			if(producto.ingredientes === undefined){
				var formulacion = SolicitudesFormulacionProducto(producto.producto.id)
				formulacion.then(function (formula) {
					$scope.productoSeleccionado.ingredientes = formula.productosBase
					console.log($scope.productoSeleccionado)
				})
			}		
		}
		$scope.eliminarDetalleVenta=function(detalleVenta){
			$scope.solicitud.solicitudesProductos.splice($scope.solicitud.solicitudesProductos.indexOf(detalleVenta),1);
			// $scope.sumarTotal();
			// $scope.sumarTotalImporte();
			// $scope.calcularSaldo();
			// $scope.calcularCambio();
			// $scope.capturarInteraccion();
		}
		$scope.eliminarIngrediente=function(detalleVenta){
			$scope.productoSeleccionado.ingredientes.splice($scope.productoSeleccionado.ingredientes.indexOf(detalleVenta),1);
			// $scope.sumarTotal();
			// $scope.sumarTotalImporte();
			// $scope.calcularSaldo();
			// $scope.calcularCambio();
			// $scope.capturarInteraccion();
		}
		$scope.disminuirDetalleVenta=function(detalleVenta){
			if(detalleVenta.cantidad==1){
				$scope.eliminarDetalleVenta(detalleVenta);
			}else{
				detalleVenta.cantidad=detalleVenta.cantidad-1;
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
		$scope.obtenerMovimientosEgreso = function () {
			// $scope.movimientosEgreso=
			blockUI.start();
			var promesa = ClasesTipo("MOVEGR");
			promesa.then(function (entidad) {
				$scope.movimientosEgreso = entidad.clases;
				blockUI.stop();
			});
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
			return new Date
		}
		$scope.guardarOperacionPanel = function (formValid, solicitud) {
			blockUI.start()
			var monto = 0
			if (formValid) {
				// solicitud.fecha = new Date(convertirFecha(solicitud.fechaTexto))
				solicitud.id_usuario = $scope.usuario.id
				solicitud.activo = true

				SolicitudReposicion.save({id_empresa:$scope.usuario.id_empresa},solicitud,function (res) {
					blockUI.stop()
					$scope.mostrarMensaje(res.mensaje)
				},function (error) {
					$scope.mostrarMensaje(error.data)
				})
			} else {
				$scope.mostrarMensaje('Complete los campos requeridos')
			}
		}
		$scope.obtenerInventarioTotal = function (producto) {
			var cantidadTotal = 0;
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					cantidadTotal += (producto.inventarios[i].cantidad);
				}
				for (var j = 0; j < $scope.solicitud.solicitudesProductos.length; j++) {
					if ($scope.solicitud.solicitudesProductos[j].producto.id == producto.id) {
						cantidadTotal = cantidadTotal - $scope.solicitud.solicitudesProductos[j].cantidad;
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
			
			var detalleVenta;
			$scope.cantidadInventario = 0;
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					$scope.cantidadInventario = $scope.cantidadInventario + producto.inventarios[i].cantidad;
				}
			}
			var j = 0, encontrado = false;
			while (j < $scope.solicitud.solicitudesProductos.length && !encontrado) {
				if (($scope.solicitud.solicitudesProductos[j].producto.id == producto.id)) {
					if (producto.activar_inventario) {
						if (($scope.solicitud.solicitudesProductos[j].cantidad + 1) <= $scope.cantidadInventario) {
							$scope.solicitud.solicitudesProductos[j].cantidad = $scope.solicitud.solicitudesProductos[j].cantidad + 1;
						} else {
							$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: ' + $scope.cantidadInventario + '!');
						}
					} else {
						$scope.solicitud.solicitudesProductos[j].cantidad = $scope.solicitud.solicitudesProductos[j].cantidad + 1;
					}
					encontrado = true;
					detalleVenta = $scope.solicitud.solicitudesProductos[j];
				}
				j++;
			}
			if (!encontrado) {
				var formulacion = SolicitudesFormulacionProducto((producto.producto!==undefined)?producto.producto.id:(producto.id !==undefined)?producto.id:undefined)
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
						producto: producto, precio_unitario: producto.precio_unitario,
						inventario_disponible: $scope.cantidadInventario, costos: producto.inventarios,
						cantidad: 1, descuento: producto.descuento, tipo_descuento: (producto.descuento > 0 ? true : false), recargo: 0, ice: 0, excento: 0, tipo_recargo: false,
						ingredientes: ingredientes
					};
					$scope.solicitud.solicitudesProductos.push(detalleVenta);
					// $scope.calcularImporteDetalleVenta(detalleVenta);
				}
			} else {
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
			$scope.checkVentaDetalleProducto(producto)
			if($scope.productoSeleccionado!==undefined){
				var prod = (producto.producto !==undefined)?producto.prod.id:(producto.id!=undefined)?producto.id:undefined
				var prodSel = ($scope.productoSeleccionado.producto !==undefined)?$scope.productoSeleccionado.producto.id:($scope.productoSeleccionado.id!=undefined)?$scope.productoSeleccionado.id:undefined	
				if (prod != prodSel){
					var indice = $scope.solicitud.solicitudesProductos.indexOf(producto);
					if(indice>-1)
					$scope.solicitud.solicitudesProductos[indice].verFormulacion = undefined;
					$scope.productoSeleccionado.verFormulacion = undefined
				}
			}
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
		// $scope.obtenerGruposProductoEmpresa=function(){
		// 	//from promesa
		// 	var grupos = [{id:1,nombre:'LICORES'},{id:2,nombre:'RONES'},{id:3,nombre:'Generíco'}]
		// 	//end from promesa
		// 	$scope.grupos_productos=grupos;
		// 	if ( angular.isDefined($localStorage.grupos_productos) ) {
		// 		$scope.grupos_productos=$scope.generarListaGruposSeleccionados($scope.grupos_productos,$localStorage.grupos_productos);
		// 	} else {
		// 		for (var i = 0; i < grupos.length; i++) {
		// 			$scope.grupos_productos[i].selected = true;
		// 		}
		// 	}
		// 	//save checked list function
		// 	$scope.listChecked = [];				
		// 	$scope.saveCheckList = function() {	
		// 		//remove all list checked
		// 		$scope.listChecked.splice(0, $scope.listChecked.length);
		// 		for (var i = 0; i < $scope.grupos_productos.length; i++) {
		// 			if ($scope.grupos_productos[i].selected == true) {
		// 				$scope.listChecked.push($scope.grupos_productos[i]);
		// 			}
		// 		}
		// 		$localStorage.grupos_productos = $scope.grupos_productos;
		// 	}
		// 	$scope.saveCheckList();

		// 	//checked or unchecked function	
		// 	$scope.allChecked = false;							
		// 	$scope.checkedUnchecked = function() {
		// 		for (var i = 0; i < $scope.grupos_productos.length; i++) {
		// 			$scope.grupos_productos[i].selected = $scope.allChecked;

		// 		}
		// 		$scope.saveCheckList();
		// 	}
		// }
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
			// blockUI.start();
			// $scope.itemsPorPagina=itemsPagina;
			// if(texto=="" || texto==null){
			// 	texto=0;
			// }else{
			// 	$scope.textoBusqueda=texto;
			// }
			// $scope.paginaActual=pagina;
			// var promesa=InventarioPaginador($scope.usuario.id_empresa,idAlmacen,pagina,itemsPagina,texto,columna,direccion);
			// promesa.then(function(dato){
			// 	var productos = dato.productos;
			// 	//var mproductos=[];
			// 	for(var i=0;i<productos.length;i++){
			// 		var inventarios=[],cantidadTotal=0;
			// 		productos[i].fecha_vencimiento=new Date(productos[i].fecha_vencimiento);
			// 		productos[i].cantidad_total=productos[i].cantidad;
			// 		/*mproductos.push({id:productos[i].id,descuento:productos[i].descuento,descuento_fijo:productos[i].descuento_fijo,
			// 						nombre:productos[i].nombre,codigo:productos[i].codigo,grupo:productos[i].grupo,subgrupo:productos[i].subgrupo,
			// 						inventarios:inventarios,cantidad_total:productos[i].cantidad,fecha_vencimiento:new Date(productos[i].fecha_vencimiento),precio_unitario:productos[i].precio_unitario,
			// 						porcentaje:$scope.porcentaje,color:$scope.color});*/
			// 	}
			// 	$scope.paginas=[];
			// 	for(var i=1;i<=dato.paginas;i++){
			// 		$scope.paginas.push(i);
			// 	}

			// 	$scope.productos=productos;

			// 	blockUI.stop();
			// });
		}

		$scope.sinFuncionalidad = function () {
			$scope.mostrarMensaje('Sin funcionalidad')
		}

		$scope.filtrarSolicitudesOperaciones = function (filtro) {
			if (filtro === undefined) {
				$scope.mostrarMensaje('Nada para buscar')
			} else {
				$scope.mostrarMensaje('Buscando:\n' + filtro)
			}
		}
		$scope.fechaATexto = function (fecha) {
            fech = new Date(fecha)
            fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
            return fecha
        }
		$scope.abrirDialogPanelOperaciones = function () {
			$scope.obtenerGruposProductoEmpresa();
			$scope.productoSeleccionado = undefined
			$scope.solicitud.fechaTexto = $scope.fechaATexto(new Date())
			$scope.abrirPopup($scope.idDialogDialogPanelOperaciones);
		}

		$scope.cerrarPopupPanel = function () {
			$scope.productoSeleccionado = undefined
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

		$scope.inicio()
	})