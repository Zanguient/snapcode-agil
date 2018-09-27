angular.module("agil.controladores").controller("ControladorPantallaCliente",["$scope","$localStorage","$location","$templateCache","$route","blockUI","$timeout","Clases","ProductosPanel","socket",function(a,o,e,r,i,n,t,s,c,l){n.start(),a.usuario=JSON.parse(o.usuario),a.idModalPantallaCliente="dialog-pantalla-cliente",a.idModalPregunta="dialog-pregunta-video",a.idImagenPromocion1="imagen-promocion1",aplicarVisorImagenArchivo(a.idImagenPromocion1),aplicarVisorImagenArchivo("imagen-promocion2"),aplicarVisorImagenArchivo("imagen-promocion3"),a.idModalImagenesPromociones="dialog-imagenes-promociones",a.cargarPromociones=function(){a.imagen1=localStorage.getItem("imagen1"),a.imagen2=localStorage.getItem("imagen2"),a.imagen3=localStorage.getItem("imagen3")},a.saveForm=function(o){o.imagen1&&localStorage.setItem("imagen1",o.imagen1),o.imagen2&&localStorage.setItem("imagen2",o.imagen2),o.imagen3&&localStorage.setItem("imagen3",o.imagen3),a.cerrarAbrirModalImagenesPromociones(),a.mostrarMensaje("Guardado Exitosamente!"),a.cargarPromociones()},a.cargarPromociones(),$("#myCarousel").carousel({interval:4e3}),$("[id^=carousel-selector-]").click(function(){var a=$(this).attr("id"),o=a.substr(a.length-1);o=parseInt(o),$("#myCarousel").carousel(o),$("[id^=carousel-selector-]").removeClass("selected"),$(this).addClass("selected")}),$("#myCarousel").on("slid",function(a){var o=$(".item.active").data("slide-number");o=parseInt(o),$("[id^=carousel-selector-]").removeClass("selected"),$("[id=carousel-selector-"+o+"]").addClass("selected")}),a.inicio=function(){a.configuracionSockets(),a.Math=Math},a.abrirPantallaCliente=function(){a.abrirPopup(a.idModalPregunta)},a.abrirAbrirModalImagenesPromociones=function(){a.abrirPopup(a.idModalImagenesPromociones)},a.cerrarAbrirModalImagenesPromociones=function(){a.cerrarPopup(a.idModalImagenesPromociones)},a.mostrarVideoPantalla=function(o){a.mostrarProductos=!0,o?a.mostrarVideo=!0:(a.mostrarVideo=!1,a.cargarProductos()),a.cerrarPopup(a.idModalPregunta),a.abrirPopup(a.idModalPantallaCliente)},a.configuracionSockets=function(){l.on("mostrarVenta",function(o){for(var e=0,r=!1;e<a.usuario.empresa.sucursales.length&&!r;)a.usuario.empresa.sucursales[e].id==o.sucursal.id&&(r=!0,a.venta=o,a.mostrarProductos=!1),e++}),l.on("mostrarProductos",function(o){for(var e=0,r=!1;e<a.usuario.empresa.sucursales.length&&!r;)a.usuario.empresa.sucursales[e].id==o.id&&(r=!0,a.mostrarProductos=!0),e++})},a.cargarProductos=function(){c(a.usuario.id_empresa,a.usuario.sucursalesUsuario[0].sucursal.almacenes[0].id).then(function(o){for(var e=0;e<o.length;e++)o[e].inventario_disponible=a.obtenerInventarioTotal(o[e]);a.productos=o,a.productosProcesados=o,setTimeout(function(){aplicarSwiper(6,4,!0,2),$("#productos h3").css({color:"white"}),$("#productos label").css({color:"#3596EA"})},500)})},a.obtenerInventarioTotal=function(a){for(var o=0,e=0;e<a.inventarios.length;e++)o+=a.inventarios[e].cantidad;return o},a.$on("$viewContentLoaded",function(){resaltarPestaña(e.path().substring(1)),ejecutarScriptsPantallaCliente(a.idModalPantallaCliente,a.idModalPregunta,a.idModalImagenesPromociones),a.buscarAplicacion(a.usuario.aplicacionesUsuario,e.path().substring(1)),n.stop()}),a.$on("$routeChangeStart",function(o,e){a.eliminarPopup(a.idModalPantallaCliente),a.eliminarPopup(a.idModalPregunta)}),a.inicio()}]).controller("ControladorPantallaDespacho",["$scope","$localStorage","$location","$templateCache","$route","blockUI","$timeout","Clases","VentasNoDespachadasLista","DespachoVenta",function(a,o,e,r,i,n,t,s,c,l){n.start(),a.usuario=JSON.parse(o.usuario),a.idModalPantallaDespacho="dialog-pantalla-despacho",a.inicio=function(){},a.abrirPantallaDespacho=function(){a.abrirPopup(a.idModalPantallaDespacho),a.cargarPedidos()},a.cargarPedidos=function(){c(a.usuario.empresa.sucursales[0].id).then(function(o){a.ventas=o,setTimeout(function(){aplicarSwiper(6,4,!0,2),$("#productos .swiper-slide").addClass("btn-warning"),$("#productos h3").css({color:"white"}),$("#productos label").css({color:"#3596EA"})},500)})},a.emitirSonido=function(a){new Audio("sound/"+a.pedido+".wav").play()},a.despacharVenta=function(o){l.update({id_venta:o.id},o,function(o){a.cargarPedidos(),a.mostrarMensaje(o.mensaje)})},a.$on("$viewContentLoaded",function(){resaltarPestaña(e.path().substring(1)),ejecutarScriptsPantallaDespacho(a.idModalPantallaDespacho),a.buscarAplicacion(a.usuario.aplicacionesUsuario,e.path().substring(1)),n.stop()}),a.$on("$routeChangeStart",function(o,e){a.eliminarPopup(a.idModalPantallaDespacho)}),a.inicio()}]);