angular.module('agil.controladores')

.controller('ControladorCompras', function($scope,$localStorage,$location,$templateCache,$route,blockUI,DatosCompra,$timeout,
											Compra,Compras,Proveedores,ProveedoresNit,ListaProductosEmpresaUsuario,ClasesTipo,CompraDatos,
											ConfiguracionCompraVistaDatos,ConfiguracionCompraVista){
	blockUI.start();
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	$scope.idModalPago='dialog-pago';
	$scope.idModalWizardCompraEdicion='modal-wizard-compra-edicion';
	$scope.idModalWizardCompraVista='modal-wizard-compra-vista';
	$scope.idModalEliminarCompra='dialog-eliminar-compra';
	$scope.idModalContenedorCompraEdicion='modal-wizard-container-compra-edicion';
	$scope.idModalContenedorCompraVista='modal-wizard-container-compra-vista';
	$scope.idInputCompletar='nit';
	$scope.url=restServer+'/proveedores/empresa/'+$scope.usuario.id_empresa+'/texto/';
	
	$scope.inicio=function(){
		$scope.compra=new Compra({proveedor:{},detallesCompra:[],descuento_general:false,tipo_descuento:false,
									tipo_recargo:false,descuento:0,recargo:0,ice:0,excento:0});
		$scope.esContado=true;
		$scope.obtenerProveedores();
		$scope.obtenerTiposDePago();
		$scope.obtenerConfiguracionCompraVista();
		$scope.obtenerCentrosDeCosto();
		$scope.sucursales=$scope.obtenerSucursales();
		$scope.obtenerCompras();
		$scope.busquedaProductoHabilidato=false;
		$scope.detalleCompra={producto:{},centroCosto:{},cantidad:1,descuento:0,recargo:0,ice:0,excento:0,tipo_descuento:false,tipo_recargo:false}
	}
	
	$scope.obtenerConfiguracionCompraVista=function(){
		blockUI.start();
		var promise=ConfiguracionCompraVistaDatos($scope.usuario.id_empresa);
		promise.then(function(configuracion){
			$scope.configuracionCompraVista=configuracion;
			blockUI.stop();
		});
	}
	
	$scope.guardarConfiguracionCompraVista=function(){
		ConfiguracionCompraVista.update({id_empresa:$scope.usuario.id_empresa},$scope.configuracionCompraVista,function(res){
			
		});
	}
	
	$scope.obtenerTiposDePago=function(){
		blockUI.start();
		var promesa=ClasesTipo("TIPA");
		promesa.then(function(entidad){
			$scope.tiposPago=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.obtenerCentrosDeCosto=function(){
		blockUI.start();
		var promesa=ClasesTipo("CCO");
		promesa.then(function(entidad){
			$scope.centrosCosto=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.obtenerProveedores=function(){
		var promesa=Proveedores($scope.usuario.id_empresa);
		promesa.then(function(proveedores){
			for(var i=0;i<proveedores.length;i++){
				proveedores[i].nit=proveedores[i].nit.toString();
			}
			$scope.proveedores=proveedores;
		});
	}
	
	$scope.modificarCompra=function(compra){
		var promesa=CompraDatos(compra.id);
		promesa.then(function(compraConsultada){
			$scope.compra=compraConsultada;
			$scope.compra.fecha=new Date($scope.compra.fecha);
			$scope.compra.fechaTexto=$scope.compra.fecha.getDate()+"/"+($scope.compra.fecha.getMonth()+1)+"/"+$scope.compra.fecha.getFullYear();
			$scope.compra.sucursal=compraConsultada.almacen.sucursal;
			$scope.obtenerAlmacenes($scope.compra.sucursal.id);
			$scope.cambiarTipoPago($scope.compra.tipoPago);
			if($scope.usuario.empresa.usar_vencimientos){
				$scope.aplicarFechaTextoDetalleCompra($scope.compra);
			}
			$scope.abrirPopup($scope.idModalWizardCompraEdicion);
		});
	}

	$scope.aplicarFechaTextoDetalleCompra=function(compra){
		for(var i=0;i<compra.detallesCompra.length;i++){
			compra.detallesCompra[i].inventario.fecha_vencimiento=new Date(compra.detallesCompra[i].inventario.fecha_vencimiento);
			compra.detallesCompra[i].inventario.fechaVencimientoTexto=compra.detallesCompra[i].inventario.fecha_vencimiento.getDate()+"/"+(compra.detallesCompra[i].inventario.fecha_vencimiento.getMonth()+1)+"/"+compra.detallesCompra[i].inventario.fecha_vencimiento.getFullYear();
		}
	}
	
	$scope.buscarProveedor=function(query) {
		if(query!="" && query!=undefined){
			var promesa=ProveedoresNit($scope.usuario.id_empresa,query);
			return promesa;
		}
	};
	
	$scope.establecerProveedor=function(proveedor){
		$scope.compra.proveedor=proveedor;
	}
	
	$scope.buscarProducto=function(query) {
		if(query!="" && query!=undefined && $scope.busquedaProductoHabilidato){
			var promesa=ListaProductosEmpresaUsuario($scope.usuario.id_empresa,query, $scope.usuario.id, $scope.compra.almacen.id);
			return promesa;
		}
	};

	$scope.verificarProducto=function(detalleCompra){
		if(detalleCompra.centroCosto.nombre==$scope.diccionario.CENTRO_COSTO_ALMACEN){
			if(detalleCompra.producto.id){
				$scope.agregarDetalleCompra(detalleCompra);		
			}	
		}else{
			$scope.agregarDetalleCompra(detalleCompra);		
		}
	}
	
	$scope.agregarDetalleCompra=function(detalleCompra){
		if(detalleCompra.producto.nombre.id){
			detalleCompra.producto=detalleCompra.producto.nombre;
		}
		if(detalleCompra.centroCosto.nombre.id){
			detalleCompra.centroCosto=detalleCompra.centroCosto.nombre;
		}else{
			if(detalleCompra.centroCosto.nombre==$scope.diccionario.CENTRO_COSTO_ALMACEN){
				var centroCostoAlmacen=$.grep($scope.centrosCosto, function(e){return e.nombre == $scope.diccionario.CENTRO_COSTO_ALMACEN;})[0];
				detalleCompra.centroCosto=centroCostoAlmacen;
			}
		}
		if(detalleCompra.fechaVencimientoTexto){
			detalleCompra.fecha_vencimiento=new Date($scope.convertirFecha(detalleCompra.fechaVencimientoTexto));
		}
		$scope.compra.detallesCompra.push(detalleCompra);
		$scope.sumarTotal();
		$scope.sumarTotalImporte();
		if($scope.compra.descuento_general){
			$scope.calcularImporteGeneral();
		}
		if($scope.compra.tipoPago.nombre==$scope.diccionario.TIPO_PAGO_CREDITO){
			$scope.calcularSaldo();
		}
		$scope.detalleCompra={producto:{},centroCosto:{},cantidad:1,descuento:0,recargo:0,ice:0,excento:0,tipo_descuento:false,tipo_recargo:false}
		$scope.enfocar('centro_costo');
	}
	
	$scope.eliminarDetalleCompra=function(detalleCompra){
		if($scope.compra.id){
			detalleCompra.eliminado=true;
		}else{
			$scope.compra.detallesCompra.splice($scope.compra.detallesCompra.indexOf(detalleCompra),1);
		}
		$scope.sumarTotal();
		$scope.sumarTotalImporte();
		if($scope.compra.descuento_general){
			$scope.calcularImporteGeneral();
		}
		if($scope.compra.tipoPago.nombre==$scope.diccionario.TIPO_PAGO_CREDITO){
			$scope.calcularSaldo();
		}
	}
	
	$scope.cambiarTipoPago=function(tipoPago){
		var tipoPago=$.grep($scope.tiposPago, function(e){return e.id == tipoPago.id;})[0];
		$scope.esContado=tipoPago.nombre_corto=='CONT'?true:false;
		$scope.compra.id_tipo_pago=tipoPago.id;
		if(!$scope.esContado){
			$scope.calcularSaldo();
		}
	}
	
	$scope.recalcular=function(){
		$scope.calcularImporteGeneral();
		$scope.calcularImporte();
	}
	
	$scope.calcularImporteGeneral=function(){
		var descuento,recargo;
		if($scope.compra.tipo_descuento){
			descuento=$scope.compra.importe*($scope.compra.descuento/100);
		}else{
			descuento=$scope.compra.descuento;
		}
		if($scope.compra.tipo_recargo){
			recargo=$scope.compra.importe*($scope.compra.recargo/100);
		}else{
			recargo=$scope.compra.recargo;
		}		
		$scope.compra.total=Math.round(($scope.compra.importe-descuento+recargo-$scope.compra.ice-$scope.compra.excento)*1000)/1000;
	}
	
	$scope.calcularImporte=function(){
		$scope.detalleCompra.importe=Math.round(($scope.detalleCompra.cantidad*$scope.detalleCompra.costo_unitario)*1000)/1000;
		var descuento,recargo;
		if($scope.detalleCompra.tipo_descuento){
			descuento=$scope.detalleCompra.importe*($scope.detalleCompra.descuento/100);
		}else{
			descuento=$scope.detalleCompra.descuento;
		}
		if($scope.detalleCompra.tipo_recargo){
			recargo=$scope.detalleCompra.importe*($scope.detalleCompra.recargo/100);
		}else{
			recargo=$scope.detalleCompra.recargo;
		}
		$scope.detalleCompra.total=$scope.detalleCompra.importe-descuento+recargo-$scope.detalleCompra.ice-$scope.detalleCompra.excento;
	}
	
	$scope.calcularImporteDetalleEdicion=function(detalleCompra){
		detalleCompra.importe=Math.round((detalleCompra.cantidad*detalleCompra.costo_unitario)*1000)/1000;
		var descuento,recargo;
		if(detalleCompra.tipo_descuento){
			descuento=detalleCompra.importe*(detalleCompra.descuento/100);
		}else{
			descuento=detalleCompra.descuento;
		}
		if(detalleCompra.tipo_recargo){
			recargo=detalleCompra.importe*(detalleCompra.recargo/100);
		}else{
			recargo=detalleCompra.recargo;
		}
		detalleCompra.total=detalleCompra.importe-descuento+recargo-detalleCompra.ice-detalleCompra.excento;
		$scope.sumarTotal();
		$scope.sumarTotalImporte();
		if($scope.compra.descuento_general){
			$scope.calcularImporteGeneral();
		}
		if($scope.compra.tipoPago.nombre==$scope.diccionario.TIPO_PAGO_CREDITO){
			$scope.calcularSaldo();
		}
	}
	
	$scope.sumarMonto=function(compras){
		var suma=0;
		for(var i=0;i<compras.length;i++){
				suma=suma+compras[i].total;
			
		}
		return Math.round(suma*100)/100;
	}

	$scope.sumarTotalImporte=function(){
		var sumaImporte=0;
		for(var i=0;i<$scope.compra.detallesCompra.length;i++){
			if(!$scope.compra.detallesCompra[i].eliminado){
				sumaImporte=sumaImporte+$scope.compra.detallesCompra[i].importe;
			}
		}		
		$scope.compra.importe=Math.round((sumaImporte)*1000)/1000;
	}
	
	$scope.sumarTotal=function(){
		var sumaTotal=0;
		for(var i=0;i<$scope.compra.detallesCompra.length;i++){
			if(!$scope.compra.detallesCompra[i].eliminado){
				sumaTotal=sumaTotal+$scope.compra.detallesCompra[i].total;
			}
		}		
		$scope.compra.total=Math.round((sumaTotal)*1000)/1000;
	}
	
	$scope.calcularSaldo=function(){
		$scope.compra.saldo=$scope.compra.total-$scope.compra.a_cuenta;
	}
	
	$scope.obtenerSucursales=function(){
		var sucursales=[];
		for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
			sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
		}
		return sucursales;
	}
	
	$scope.mostrarDescuentos=function(){
		var style=$(".des-datos").css("display");
		if(style=="none"){
			$(".des-datos").css("display","");
		}else{
			$(".des-datos").css("display","none");
		}
	}
	
	$scope.enfocar=function(elemento){
		$timeout(function() {
			$("#"+elemento).focus();
		},0);
	}
	
	$scope.interceptarTecla=function(keyEvent,elemento,esEnfocar){
		if (keyEvent.which === 13){
			if(esEnfocar){
				$scope.enfocar(elemento);
			}else{
				$timeout(function() {
					$('#'+elemento).trigger('click');
				}, 0);
			}
		}
	}
	
	$scope.obtenerAlmacenes=function(idSucursal){
		$scope.almacenes=[];
		var sucursal=$.grep($scope.sucursales, function(e){return e.id == idSucursal;})[0];
		$scope.almacenes=sucursal.almacenes;
		$scope.compra.almacen=$scope.almacenes.length==1?$scope.almacenes[0]:null;
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsCompra($scope.idModalWizardCompraEdicion,$scope.idModalWizardCompraVista,
								$scope.idModalEliminarCompra,$scope.idModalContenedorCompraEdicion,
								$scope.idModalContenedorCompraVista,$scope.idInputCompletar,$scope.url,$scope.idModalPago);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		$('#formularioCompra').ketchup({
			validateEvents: 'blur focus keyup change submit'
		});
		blockUI.stop();
	});
	
	$scope.formatearCodigoControl=function(codigo){
		var codigoFormateado="";
		for(var i=0;i<codigo.length;i++){
			if(i%2==0){
				codigoFormateado=codigoFormateado+codigo.substring(i,i+2);
				if(codigo.length-i>2){
					codigoFormateado=codigoFormateado+"-"
				}
			}
		}
		return codigoFormateado;
	}
	
	$scope.obtenerCompras=function(){
		$scope.sucursalesUsuario="";
		for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
			$scope.sucursalesUsuario=$scope.sucursalesUsuario+$scope.usuario.sucursalesUsuario[i].sucursal.id;
			if(i+1!=$scope.usuario.sucursalesUsuario.length){
				$scope.sucursalesUsuario=$scope.sucursalesUsuario+',';
			}
		}
		var currentDate=new Date();
		var currentDateString=currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear();
		$scope.filtrarCompras($scope.sucursalesUsuario,currentDateString,currentDateString);
	}
	
	$scope.filtrarCompras=function(sucursalesUsuario,inicio,fin,razon_social,nit,monto,tipo_pago,sucursal,usuario){
		razon_social=(razon_social==""||razon_social==undefined)?0:razon_social;
		nit=(nit==null||nit==undefined)?0:nit;
		monto=(monto==null||monto==undefined)?0:monto;
		tipo_pago=(tipo_pago==undefined)?0:tipo_pago;
		sucursal=(sucursal==null||sucursal==undefined)?0:sucursal;
		var roles=$.grep($scope.usuario.rolesUsuario, function(e){return e.rol.nombre == $scope.diccionario.ROL_ADMINISTRADOR;});
		usuario=roles.length>0?((usuario==""||usuario==undefined)?0:usuario):$scope.usuario.nombre_usuario;
		blockUI.start();
		inicio=new Date($scope.convertirFecha(inicio));
		fin=new Date($scope.convertirFecha(fin));
		var promesa=Compras(sucursalesUsuario,inicio,fin,razon_social,nit,monto,tipo_pago,sucursal,usuario, $scope.usuario.id);
		promesa.then(function(compras){
			$scope.compras=compras;
			blockUI.stop();
		});
	}
	
	$scope.abrirPopupPago=function(compra){
		$scope.compra=compra;
		$scope.pago=null;
		$scope.abrirPopup($scope.idModalPago);
	}
	
	$scope.cerrarPopupPago=function(){
		$scope.cerrarPopup($scope.idModalPago);
	}
	
	$scope.efectuarPago=function(pago){
		blockUI.start();
		Compra.update({ id:$scope.compra.id }, {pago:pago,id_usuario_cajero:$scope.usuario.id},function(data) {
			$scope.mostrarMensaje(data.mensaje);
			$scope.cerrarPopup($scope.idModalPago);
			$scope.obtenerCompras();
			$scope.imprimirRecibo(data,data.compra,pago);
			blockUI.stop();
		},function(error) {
			$scope.mostrarMensaje(error);
			$scope.cerrarPopup($scope.idModalPago);
			$scope.obtenerCompras();
			blockUI.stop();
		});
	}
	
	$scope.imprimirRecibo=function(data,compra,pago){
		blockUI.start();
		var doc = new PDFDocument({size:[227,353],margin:10});
		var stream = doc.pipe(blobStream());
		doc.moveDown(2);
		doc.font('Helvetica-Bold',8);
		doc.text($scope.usuario.empresa.razon_social.toUpperCase(),{align:'center'});		
		doc.moveDown(0.4);
		doc.font('Helvetica',7);
		doc.text(compra.almacen.sucursal.nombre.toUpperCase(),{align:'center'});
		doc.moveDown(0.4);
		doc.text(compra.almacen.sucursal.direccion.toUpperCase(),{align:'center'});
		doc.moveDown(0.4);
		var telefono=(compra.almacen.sucursal.telefono1!=null?compra.almacen.sucursal.telefono1:"")+
		(compra.almacen.sucursal.telefono2!=null?"-"+compra.almacen.sucursal.telefono2:"")+
		(compra.almacen.sucursal.telefono3!=null?"-"+compra.almacen.sucursal.telefono3:"");
		doc.text("TELF.: "+telefono,{align:'center'});
		doc.moveDown(0.4);
		doc.text("COCHABAMBA - BOLIVIA",{align:'center'});
		doc.moveDown(0.5);
		doc.font('Helvetica-Bold',8);
		doc.text("PAGO",{align:'center'});
		doc.font('Helvetica',7);
		doc.moveDown(0.4);
		doc.text("------------------------------------",{align:'center'});
		doc.moveDown(0.4);
		//doc.text("NIT: "+$scope.usuario.empresa.nit,{align:'center'});
		doc.moveDown(0.4);
		doc.text(compra.almacen.sucursal.nota_recibo_correlativo,{align:'center'});
		doc.moveDown(0.4);
		//doc.text("AUTORIZACIÓN No: "+venta.autorizacion,{align:'center'});
		doc.moveDown(0.4);
		doc.text("------------------------------------",{align:'center'});
		doc.moveDown(0.4);
		//doc.text(venta.actividad.nombre,{align:'center'});
		doc.moveDown(0.6);
		var date=new Date();
		doc.text("FECHA : "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear(),{align:'left'});
		doc.moveDown(0.4);
		doc.text("Pagado a : "+$scope.compra.proveedor.razon_social,{align:'left'});
		doc.moveDown(0.4);
		doc.text("---------------------------------------------------------------------------------",{align:'center'});
		doc.moveDown(0.2);
		doc.text("       CONCEPTO                                   ",{align:'left'});
		doc.moveDown(0.2);
		doc.text("---------------------------------------------------------------------------------",{align:'center'});
		doc.moveDown(0.4);
		compra.fecha=new Date(compra.fecha);
		doc.text("Fecha: "+compra.fecha.getDate()+"/"+(compra.fecha.getMonth()+1)+"/"+compra.fecha.getFullYear(),15,210);
		var textoFact=$scope.compra.factura;
		doc.text(textoFact,105,210,{width:100});
		doc.text("Bs "+pago+".-",170,210,{width:100});
		
		doc.text("--------------",10,230,{align:'right'});
		//oc.text("--------------------",{align:'right'});
		doc.moveDown(0.3);
		doc.text("TOTAL Bs.              "+pago.toFixed(2),{align:'right'});
		doc.moveDown(0.4);
		doc.moveDown(0.4);
		doc.text("SON: "+data.pago,{align:'left'});
		doc.moveDown(0.6);
		
		doc.moveDown(0.4);
		
		doc.moveDown(0.4);
		doc.moveDown(0.4);
		doc.moveDown(0.4);	
		doc.moveDown(0.4);
		doc.moveDown(0.4);
		doc.moveDown(0.4);	
		doc.moveDown(0.4);
		doc.moveDown(0.4);
		doc.moveDown(0.4);	
		doc.moveDown(0.4);
		doc.moveDown(0.4);
		doc.moveDown(0.4);	
		
		doc.text("-------------------------                       -------------------------",{align:'center'});
		doc.text("ENTREGUE CONFORME            RECIBI CONFORME",{align:'center'});
		doc.end();
		stream.on('finish', function() {
			var fileURL = stream.toBlobURL('application/pdf');
			window.open(fileURL,'_blank','location=no');
		});
		blockUI.stop();
	}
	
	$scope.establecerCentroCosto=function(centroCosto){console.log(centroCosto);
		var centroCostoAnalizado=centroCosto.nombre?centroCosto.nombre:centroCosto;
		if(centroCostoAnalizado==$scope.diccionario.CENTRO_COSTO_ALMACEN){
			$scope.busquedaProductoHabilidato=true;
			
		}else{
			$scope.busquedaProductoHabilidato=false;
		}
	}
	
	$scope.crearNuevaCompra=function(){
		$scope.compra=new Compra({id_empresa:$scope.usuario.id_empresa,id_usuario:$scope.usuario.id,proveedor:{},id_tipo_pago:$scope.tiposPago[0].id,tipoPago:$scope.tiposPago[0],
									detallesCompra:[],descuento_general:false,tipo_descuento:false,codigo_control:0,autorizacion:0,
									tipo_recargo:false,descuento:0,recargo:0,ice:0,excento:0});
		
		$scope.compra.sucursal=$scope.sucursales.length==1?$scope.sucursales[0]:null;
		if($scope.compra.sucursal){
			$scope.obtenerAlmacenes($scope.compra.sucursal.id);
		}
		var fechaActual=new Date();
		$scope.compra.fechaTexto=fechaActual.getDate()+"/"+(fechaActual.getMonth()+1)+"/"+fechaActual.getFullYear();
		$scope.abrirPopup($scope.idModalWizardCompraEdicion);
		$scope.enfocar('nit');
	}
	
	$scope.verCompra=function(compra){
		$scope.compra=compra;
		$scope.abrirPopup($scope.idModalWizardCompraVista);
	}
	
	$scope.cerrarPopupVista=function(){
		$scope.cerrarPopup($scope.idModalWizardCompraVista);
	}
	
	$scope.cerrarPopupEdicion=function(){
		$scope.ocultarMensajesValidacion();
		$scope.cerrarPopup($scope.idModalWizardCompraEdicion);
	}
	
	$scope.verificarDescuentos=function(detalles){
		var existe=false;
		for(var i=0;i<detalles.length;i++){
			if(detalles[i].descuento>0 || detalles[i].recargo>0 || detalles[i].ice>0 || detalles[i].excento>0){
				existe=true;
			}
		}
		return existe;
	}
	
	$scope.dibujarCabeceraImpresionCompra=function(doc,compra,pagina,totalPaginas,existenDescuentos){
		if($scope.usuario.empresa.imagen.length>100){doc.image($scope.usuario.empresa.imagen,60,50,{width: 50,height:50});}
			doc.font('Helvetica-Bold',8);
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(),60,105);		
			doc.font('Helvetica',7);
			doc.text(compra.sucursal.nombre.toUpperCase(),60,113);
			doc.text(compra.sucursal.direccion.toUpperCase(),60,121);
			var telefono=(compra.sucursal.telefono1!=null?compra.sucursal.telefono1:"")+
			(compra.sucursal.telefono2!=null?"-"+compra.sucursal.telefono2:"")+
			(compra.sucursal.telefono3!=null?"-"+compra.sucursal.telefono3:"");
			doc.text("TELF.: "+telefono,60,129);
			doc.text("COCHABAMBA - BOLIVIA",60,137);
			
			doc.font('Helvetica-Bold',16);
			doc.text("NOTA DE COMPRA",150,50);
			doc.font('Helvetica-Bold',8);
			//doc.text(compra.actividad.nombre,380,105,{width:200});
			
			doc.rect(380,50,190,50).stroke();
			doc.text("NIT : ",390,60);
			doc.text("FACTURA No : ",390,70);
			doc.text("AUTORIZACIÓN No : ",390,80);
		
			doc.text($scope.usuario.empresa.nit,500,60);
			doc.text(compra.factura,500,70);
			doc.text(compra.autorizacion,500,80);
			
			doc.rect(50,150,540,50).stroke();
			doc.text("FECHA : ",60,165);
			doc.text("SEÑOR(ES) : ",60,175);
			doc.text("NIT : ",360,165);
		
			doc.text(compra.fechaTexto,120,165);
			doc.text(compra.proveedor.razon_social,120,175);
			doc.text(compra.proveedor.nit,400,165);
			
			doc.rect(50,200,540,25).stroke();
			doc.rect(50,225,540,792-118-225).stroke();
			
			if(existenDescuentos){
				doc.text("CODIGO",55,210);
				doc.text("CANT.",105,210);
				doc.text("UNID.",135,210);
				doc.text("DETALLE",170,210);
				doc.text("P. UNIT.",300,210);
				doc.text("IMPORTE",335,210);
				doc.text("DESC.",385,210);
				doc.text("REC.",420,210);
				doc.text("ICE",455,210);
				doc.text("EXC.",490,210);
				doc.text("TOTAL",520,210);
			}else{
				doc.text("CODIGO",55,210);
				doc.text("CANT.",135,210);
				doc.text("UNID.",165,210);
				if($scope.usuario.empresa.usar_vencimientos){
					doc.text("DETALLE",210,210);
					doc.text("FECHA VENC.",400,205,{width:50});
					doc.text("LOTE",450,210);					
				}else{
					doc.text("DETALLE",210,210);
				}
				doc.text("P.UNIT.",495,210);
				doc.text("TOTAL",540,210);
			}
			doc.font('Helvetica',8);
			var currentDate=new Date();
			doc.text("Usuario: "+$scope.usuario.nombre_usuario+"   "+"Fecha:"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear()+"   "+"Hr:"+currentDate.getHours()+":"+currentDate.getMinutes(),50,750);
	}
	
	$scope.imprimirCompra=function(compra){
		var promesa=DatosCompra(compra.id,$scope.usuario.id_empresa);
		promesa.then(function(datos){
			compra=datos.compra;
			compra.sucursal=datos.sucursal;
			compra.numero_literal=datos.numero_literal;
			compra.fecha=new Date(compra.fecha);
			compra.fechaTexto=compra.fecha.getDate()+"/"+(compra.fecha.getMonth()+1)+"/"+compra.fecha.getFullYear();
			compra.configuracion=datos.configuracion;
			var doc = new PDFDocument({size:[612,792],margin:10});
			var stream = doc.pipe(blobStream());
			// draw some text
			
			var y=240,totalAray=0 ,itemsPorPagina=15,items=0,pagina=1,totalPaginas=Math.ceil(compra.detallesCompra.length/itemsPorPagina);
			var existenDescuentos=$scope.verificarDescuentos(compra.detallesCompra);
			$scope.dibujarCabeceraImpresionCompra(doc,compra,pagina,totalPaginas,existenDescuentos);
		
			var y=240;
			for(var i=0;i<compra.detallesCompra.length;i++){
				doc.font('Helvetica',8);				
				if(existenDescuentos){
					doc.text(compra.detallesCompra[i].producto.codigo,55,y,{width:70});
					doc.text(compra.detallesCompra[i].cantidad,110,y);
					doc.text(compra.detallesCompra[i].producto.unidad_medida,135,y);
					doc.text(compra.detallesCompra[i].producto.nombre,170,y-6,{width:130});
					doc.text(compra.detallesCompra[i].costo_unitario.toFixed(2),300,y);
					doc.text(compra.detallesCompra[i].importe.toFixed(2),335,y);
					doc.text(compra.detallesCompra[i].tipo_descuento?"%":"Bs",385,y-10);
					doc.text(compra.detallesCompra[i].descuento.toFixed(2),385,y);
					doc.text(compra.detallesCompra[i].tipo_recargo?"%":"Bs",420,y-10);
					doc.text(compra.detallesCompra[i].recargo.toFixed(2),420,y);
					doc.text(compra.detallesCompra[i].ice.toFixed(2),455,y);
					doc.text(compra.detallesCompra[i].excento.toFixed(2),490,y);
					doc.text(compra.detallesCompra[i].total.toFixed(2),520,y);
				}else{
					doc.text(compra.detallesCompra[i].producto.codigo,55,y,{width:70});
					doc.text(compra.detallesCompra[i].cantidad,140,y);
					doc.text(compra.detallesCompra[i].producto.unidad_medida,160,y);
					var longitudCaracteres=compra.detallesCompra[i].producto.nombre.length;
					var yDesc=(longitudCaracteres<=45)?y:((longitudCaracteres>45&&longitudCaracteres<=90)?y-4:y-11);
					if($scope.usuario.empresa.usar_vencimientos){
						if(compra.detallesCompra[i].inventario){
							compra.detallesCompra[i].inventario.fecha_vencimiento=new Date(compra.detallesCompra[i].inventario.fecha_vencimiento);
							compra.detallesCompra[i].inventario.fechaVencimientoTexto=compra.detallesCompra[i].inventario.fecha_vencimiento.getDate()+"/"+(compra.detallesCompra[i].inventario.fecha_vencimiento.getMonth()+1)+"/"+compra.detallesCompra[i].inventario.fecha_vencimiento.getFullYear();
							doc.text(compra.detallesCompra[i].inventario.fechaVencimientoTexto,400,y);
							doc.text(compra.detallesCompra[i].inventario.lote,460,y);
						}
						doc.text(compra.detallesCompra[i].producto.nombre,210,yDesc-11.5,{width:185});
					}else{
						doc.text(compra.detallesCompra[i].producto.nombre,210,yDesc-11.5,{width:225});
					}
					doc.text(compra.detallesCompra[i].costo_unitario.toFixed(2),500,y);
					doc.text(compra.detallesCompra[i].total.toFixed(2),540,y);
				}
				
				doc.rect(50,y-15,540,30).stroke();
				
				y=y+30;
				
				items++;
				
				if(items==itemsPorPagina){
					totalAray=totalAray+items;
					if(totalAray!=compra.detallesCompra.length)
					{
					/* var currentDate=new Date();
					doc.text("Usuario: "+$scope.usuario.nombre_usuario,50,y);
					doc.text("Usuario: "+$scope.usuario.nombre_usuario+"   "+"Fecha:"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear(),50,y); */
					doc.addPage({size:[612,792],margin:10});
					y=240;
					items=0;
					pagina=pagina+1;
					$scope.dibujarCabeceraImpresionCompra(doc,compra,pagina,totalPaginas,existenDescuentos);
					}
				}
			}
			
				doc.font('Helvetica-Bold',8);
				doc.text("TOTAL",455,792-97);
			
			doc.font('Helvetica',8);
			doc.text(compra.total.toFixed(2),520,792-97);
			
			doc.text("SON : "+compra.numero_literal,55,792-97);
			
			
			doc.text("CÓDIGO DE CONTROL : "+compra.codigo_control,55,792-62);
			//var currentDate=new Date();
			//doc.text("Usuario: "+$scope.usuario.nombre_usuario+"--"+"Fecha:"+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear(),50,792-100);
			//compra.fecha_limite_emision=new Date(compra.fecha_limite_emision);
			//doc.text("FECHA LÍMITE DE EMISIÓN: "+compra.fecha_limite_emision.getDate()+"/"+(compra.fecha_limite_emision.getMonth()+1)+"/"+compra.fecha_limite_emision.getFullYear(),55,792-100);
			
			
			doc.rect(50,792-107,540,30).stroke();
			doc.rect(50,792-72,400,20).stroke();
			//doc.rect(50,792-110,400,20).stroke();
			
			doc.end();
			stream.on('finish', function() {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL,'_blank','location=no');
			});
			blockUI.stop();
		});
	}
	
	$scope.guardarCompra=function(valido,compra){
		if(valido){
			$scope.ocultarMensajesValidacion();
			if(compra.proveedor.nit.id){
				compra.proveedor=compra.proveedor.nit;
			}
			//compra.codigo_control=$scope.formatearCodigoControl(compra.codigo_control);
			compra.fecha=new Date($scope.convertirFecha(compra.fechaTexto));
			blockUI.start();
			if(compra.id){
				compra.esModificacion=true;
				Compra.update({ id:compra.id }, compra,function(res){
					blockUI.stop();
					$scope.cerrarPopPupEdicion();
					$scope.mostrarMensaje(res.mensaje);
					$scope.recargarItemsTabla();
				});
			}else{
				compra.$save(function(sucursal){
					blockUI.stop();
					$scope.cerrarPopPupEdicion();
					$scope.mostrarMensaje('Compra registrada exitosamente!');
					$scope.recargarItemsTabla();
					$scope.imprimirCompra(compra);
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupEdicion();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					$scope.recargarItemsTabla();
				});
			}
		}
	}
	
	$scope.establecerProducto=function(producto){
		producto.tipoProducto=producto['tipoProducto']==null?{id:producto['tipoProducto.id'],nombre:producto['tipoProducto.nombre'],nombre_corto:producto['tipoProducto.nombre_corto']}:producto.tipoProducto;
		var centroCostos = $scope.detalleCompra.centroCosto;
			$scope.detalleCompra={centroCosto:centroCostos,producto:producto,precio_unitario:producto.precio_unitario,								
								cantidad:1,descuento:producto.descuento,recargo:0,ice:0,excento:0,tipo_descuento:(producto.descuento>0?true:false),tipo_recargo:false};
			$scope.cerrarPopup($scope.idModalInventario);
			$scope.enfocar('cantidad');

	}	
	$scope.cerrarPopPupEdicion=function(){
		$scope.cerrarPopup($scope.idModalWizardCompraEdicion);
	}	
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalWizardCompraEdicion);
	   $scope.eliminarPopup($scope.idModalWizardCompraVista);
	   $scope.eliminarPopup($scope.idModalEliminarCompra);
	   $scope.eliminarPopup($scope.idModalPago);
	});
	
	$scope.inicio();
});