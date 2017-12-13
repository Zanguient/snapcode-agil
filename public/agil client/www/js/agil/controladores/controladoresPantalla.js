angular.module('agil.controladores')

.controller('ControladorPantallaCliente', function($scope,$localStorage,$location,$templateCache,$route,blockUI,$timeout,Clases,
											ProductosPanel,socket){
	blockUI.start();
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.idModalPantallaCliente="dialog-pantalla-cliente";
	$scope.idModalPregunta="dialog-pregunta-video";
	$scope.idImagenPromocion1="imagen-promocion1";
	aplicarVisorImagenArchivo($scope.idImagenPromocion1);
	aplicarVisorImagenArchivo("imagen-promocion2");
	aplicarVisorImagenArchivo("imagen-promocion3");
	$scope.idModalImagenesPromociones="dialog-imagenes-promociones";

	// ==== funcion para generar imagen en base64 con canvas =========== 
	// var image = new Image();
	// image.src = 'assets/images/los-mejores-restaurantes-de-comida-mexicana-porfirio-s.jpg';
	// var canvas = document.createElement("canvas");
	// // document.body.appendChild(canvas);
	// canvas.width = image.width;
	// canvas.height = image.height;
	// canvas.getContext("2d").drawImage(image, 0, 0);
	// // ==== guardadndo en localstorage === 
	// localStorage.setItem('image', canvas.toDataURL('image/png'));


 	
 	$scope.cargarPromociones = function () {
 		$scope.imagen1 = localStorage.getItem('imagen1');
		$scope.imagen2 = localStorage.getItem('imagen2');
		$scope.imagen3 = localStorage.getItem('imagen3');
 	}

	

	$scope.saveForm=function(promocion){
		// console.log('lo q recibioo...', promocion.imagen1);
		if (promocion.imagen1) {
			localStorage.setItem('imagen1', promocion.imagen1);
		}
		if (promocion.imagen2) {
			localStorage.setItem('imagen2', promocion.imagen2);
		}
		if (promocion.imagen3) {
			localStorage.setItem('imagen3', promocion.imagen3);
		}

		$scope.cerrarAbrirModalImagenesPromociones();
		$scope.mostrarMensaje('Guardado Exitosamente!');
		$scope.cargarPromociones();
	}
	$scope.cargarPromociones();

	

	$('#myCarousel').carousel({
	    interval: 4000
	});

	// handles the carousel thumbnails
	$('[id^=carousel-selector-]').click( function(){
	  var id_selector = $(this).attr("id");
	  var id = id_selector.substr(id_selector.length -1);
	  id = parseInt(id);
	  $('#myCarousel').carousel(id);
	  $('[id^=carousel-selector-]').removeClass('selected');
	  $(this).addClass('selected');
	});

	// when the carousel slides, auto update
	$('#myCarousel').on('slid', function (e) {
	  var id = $('.item.active').data('slide-number');
	  id = parseInt(id);
	  $('[id^=carousel-selector-]').removeClass('selected');
	  $('[id=carousel-selector-'+id+']').addClass('selected');
	});


	$scope.inicio=function(){
		$scope.configuracionSockets();
		$scope.Math=Math;
	}
	
	$scope.abrirPantallaCliente=function(){
		$scope.abrirPopup($scope.idModalPregunta);
	}

	$scope.abrirAbrirModalImagenesPromociones=function(){
		$scope.abrirPopup($scope.idModalImagenesPromociones);
	}
	$scope.cerrarAbrirModalImagenesPromociones=function(){
		$scope.cerrarPopup($scope.idModalImagenesPromociones);
	}
	
	$scope.mostrarVideoPantalla=function(valor){
		$scope.mostrarProductos=true;
		if(valor){
			$scope.mostrarVideo=true;
		}else{
			$scope.mostrarVideo=false;
			$scope.cargarProductos();
		}
		$scope.cerrarPopup($scope.idModalPregunta);
		$scope.abrirPopup($scope.idModalPantallaCliente);
	}
	
	$scope.configuracionSockets=function(){
		socket.on('mostrarVenta', function (venta) {
			var i=0,encontrado=false;
			while(i<$scope.usuario.empresa.sucursales.length && !encontrado){
				if($scope.usuario.empresa.sucursales[i].id==venta.sucursal.id){
					encontrado=true;
					$scope.venta=venta;
					$scope.mostrarProductos=false;
				}
				i++;
			}
		});
		
		socket.on('mostrarProductos', function (sucursal) {
			var i=0,encontrado=false;
			while(i<$scope.usuario.empresa.sucursales.length && !encontrado){
				if($scope.usuario.empresa.sucursales[i].id==sucursal.id){
					encontrado=true;
					$scope.mostrarProductos=true;
				}
				i++;
			}
		});
	}
	
	$scope.cargarProductos=function(){
		var promesa=ProductosPanel($scope.usuario.id_empresa,$scope.usuario.sucursalesUsuario[0].sucursal.almacenes[0].id);
		promesa.then(function(productos){
			for(var i=0;i<productos.length;i++){
				productos[i].inventario_disponible=$scope.obtenerInventarioTotal(productos[i]);
			}
			$scope.productos=productos;
			$scope.productosProcesados=productos;
			setTimeout(function(){
				aplicarSwiper(6,4,true,2);
				// $('#productos .swiper-slide').addClass('btn-warning');
				$('#productos h3').css({color:'white'});
				$('#productos label').css({color:'#3596EA'});
			},500);
		});
	}
	
	$scope.obtenerInventarioTotal=function(producto){
		var cantidadTotal = 0;
		for(var i = 0; i < producto.inventarios.length; i++){
			cantidadTotal += (producto.inventarios[i].cantidad);
		}
		return cantidadTotal;
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsPantallaCliente($scope.idModalPantallaCliente,$scope.idModalPregunta, $scope.idModalImagenesPromociones);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalPantallaCliente);
	   $scope.eliminarPopup($scope.idModalPregunta);
	});
	
	$scope.inicio();
})

.controller('ControladorPantallaDespacho', function($scope,$localStorage,$location,$templateCache,$route,blockUI,$timeout,Clases,
											VentasNoDespachadasLista,DespachoVenta){
	blockUI.start();
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.idModalPantallaDespacho="dialog-pantalla-despacho";
	
	$scope.inicio=function(){
		//$scope.configuracionSockets();
	}
	
	$scope.abrirPantallaDespacho=function(){
		$scope.abrirPopup($scope.idModalPantallaDespacho);
		$scope.cargarPedidos();
	}
	
	/*$scope.configuracionSockets=function(){
		socket.on('mostrarVenta', function (venta) {
			var i=0,encontrado=false;
			while(i<$scope.usuario.empresa.sucursales.length && !encontrado){
				if($scope.usuario.empresa.sucursales[i].id==venta.sucursal.id){
					encontrado=true;
					$scope.venta=venta;
					$scope.mostrarProductos=false;
				}
				i++;
			}
		});
		
		socket.on('mostrarProductos', function (sucursal) {
			var i=0,encontrado=false;
			while(i<$scope.usuario.empresa.sucursales.length && !encontrado){
				if($scope.usuario.empresa.sucursales[i].id==sucursal.id){
					encontrado=true;
					$scope.mostrarProductos=true;
				}
				i++;
			}
		});
	}*/
	
	$scope.cargarPedidos=function(){
		var promesa=VentasNoDespachadasLista($scope.usuario.empresa.sucursales[0].id);
		promesa.then(function(ventas){
			$scope.ventas=ventas;
			setTimeout(function(){
				aplicarSwiper(6,4,true,2);
				$('#productos .swiper-slide').addClass('btn-warning');
				$('#productos h3').css({color:'white'});
				$('#productos label').css({color:'#3596EA'});
			},500);
		});
	}
	
	$scope.emitirSonido=function(venta){
		//responsiveVoice.speak("pedido "+$scope.contador, "Spanish Female");		
		var audio = new Audio('sound/'+venta.pedido+'.wav');
        audio.play();
	}
	
	$scope.despacharVenta=function(venta){
		DespachoVenta.update({id_venta:venta.id},venta,function(data){
			$scope.cargarPedidos();
			$scope.mostrarMensaje(data.mensaje);
		});
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsPantallaDespacho($scope.idModalPantallaDespacho);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalPantallaDespacho);
	});
	
	$scope.inicio();
});



