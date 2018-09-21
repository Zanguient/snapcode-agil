angular.module('agil.controladores')

.controller('ControladorMesa', ['$scope','$localStorage','$location','$templateCache','$route','blockUI','ListaSalas',
	'ListaGruposProductoEmpresa','ProductosPanel','Sala','Mesa','ClasesTipo','MesaPedidoRestaurante',
'PedidoRestaurante','PedidoRestauranteActualizacion','MesaActualizacion','$timeout',
'Venta','ImprimirSalida','ListaInventariosProducto','InactivarPedido','ClientesNit','ActualizarGarzon','CrearGarzon','Garzon','ListaGarzones',
'EliminacionMesaPedidoRestaurante',function($scope,$localStorage,$location,$templateCache,$route,blockUI,ListaSalas,
										ListaGruposProductoEmpresa,ProductosPanel,Sala,Mesa,ClasesTipo,MesaPedidoRestaurante,
									PedidoRestaurante,PedidoRestauranteActualizacion,MesaActualizacion,$timeout,
								Venta,ImprimirSalida,ListaInventariosProducto,InactivarPedido,ClientesNit,ActualizarGarzon,CrearGarzon,Garzon,ListaGarzones,
							EliminacionMesaPedidoRestaurante){
	blockUI.start();
	$scope.usuario=JSON.parse($localStorage.usuario);

	$scope.idModalPanelPedido='dialog-panel-ventas';
	$scope.idModalSalaEdicion='modal-wizard-sala-edicion';
	$scope.idModalContenedorSalaEdicion='modal-wizard-container-sala-edicion';
	$scope.idModalMesaEdicion='modal-wizard-mesa-edicion';
	$scope.idModalContenedorMesaEdicion='modal-wizard-container-mesa-edicion';
	$scope.idModalGarzonEdicion='modal-wizard-garzon-edicion';
	$scope.idModalContenedorGarzonEdicion='modal-wizard-container-garzon-edicion';
	$scope.idModalFacturacion='modal-wizard-facturacion';
	$scope.idModalContenedorFacturacion='modal-wizard-container-facturacion';
	$scope.idModalReserva='modal-wizard-reserva';
	$scope.idModalContenedorReserva='modal-wizard-container-reserva';
	$scope.idModalCambioMesa='modal-wizard-cambio-mesa';
	$scope.idModalContenedorCambioMesa='modal-wizard-container-cambio-mesa';
	$scope.idModalUnionMesas='modal-wizard-union-mesas';
	$scope.idModalContenedorUnionMesas='modal-wizard-container-union-mesas';
	$scope.idModalAsignacionGarzon='modal-wizard-asignacion-garzon';
	$scope.idModalContenedorAsignacionGarzon='modal-wizard-container-asignacion-garzon';

	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsMesas($scope.idModalPanelPedido,$scope.idModalSalaEdicion,$scope.idModalContenedorSalaEdicion,
							$scope.idModalMesaEdicion,$scope.idModalContenedorMesaEdicion,$scope.idModalGarzonEdicion,$scope.idModalContenedorGarzonEdicion,
						$scope.idModalFacturacion,$scope.idModalContenedorFacturacion,$scope.idModalReserva,
					$scope.idModalContenedorReserva,$scope.idModalCambioMesa,$scope.idModalContenedorCambioMesa,
				$scope.idModalUnionMesas,$scope.idModalContenedorUnionMesas,
			$scope.idModalAsignacionGarzon,$scope.idModalContenedorAsignacionGarzon);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});

	$scope.inicio=function(){
		blockUI.start();
		var promesa=ClasesTipo("EM");
		promesa.then(function(entidad){
			$scope.estadosMesa=entidad.clases;
			blockUI.stop();
		});
		$scope.sucursales=$scope.obtenerSucursales();
		$scope.obtenerMovimientosEgreso();
		$scope.obtenerTiposDePago();
		$scope.obtenerGarzones();
	}

	$scope.obtenerMovimientosEgreso=function(){
		blockUI.start();
		var promesa=ClasesTipo("MOVEGR");
		promesa.then(function(entidad){
			$scope.movimientosEgreso=entidad.clases;
			blockUI.stop();
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
	
	$scope.obtenerSalas = function(idSucursal){
		blockUI.start();
		$scope.obtenerAlmacenes(idSucursal);
		var promesa=ListaSalas(idSucursal);
		promesa.then (function(salas){
			$scope.salas = salas;
			$scope.mesas=[];
			blockUI.stop();
		})
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
		$scope.filtro.almacen=$scope.almacenes.length==1?$scope.almacenes[0]:null;
		//$scope.cargarProductosPanel();
	}

	$scope.obtenerGarzones = function(){
		blockUI.start();
		var promesa=ListaGarzones($scope.usuario.empresa.id);
		promesa.then (function(garzones){
			$scope.garzones=garzones;
			$scope.llenarGarzonesOpciones();
			blockUI.stop();
		})
	}

	$scope.cargarProductosPanel=function(){
		var promesa=ProductosPanel($scope.usuario.id_empresa,$scope.filtro.almacen.id);
		promesa.then(function(productos){
			for(var i=0;i<productos.length;i++){
				if(productos[i].activar_inventario){
					productos[i].inventario_disponible=$scope.obtenerInventarioTotal(productos[i]);
				}
			}
			$scope.productos=productos;
			$scope.productosProcesados=productos;
		});
	}

	$scope.obtenerInventarioTotal=function(producto){
		var cantidadTotal = 0;
		if(producto.activar_inventario){
			for(var i = 0; i < producto.inventarios.length; i++){
				cantidadTotal += (producto.inventarios[i].cantidad);
			}
			/*for(var j=0;j<$scope.venta.detallesVenta.length;j++){
				if($scope.venta.detallesVenta[j].producto.id==producto.id){
					cantidadTotal=cantidadTotal-$scope.venta.detallesVenta[j].cantidad;
				}
			}*/
		}else{
			cantidadTotal=500000;
		}
		return cantidadTotal;
	}

	$scope.verSala = function(sala){
		$scope.salaVista=sala;
		$scope.mesas = sala.mesas;
	    $scope.llenarMesasOpciones();
	}

	$scope.llenarMesasOpciones=function(){
		$scope.mesas_unidas=[];
		for(var i=0;i<$scope.mesas.length;i++){
			var mesa={
				name:$scope.mesas[i].numero+"",
				numero:$scope.mesas[i].numero,
				maker: "",
				ticked:false,
				id:$scope.mesas[i].id
			}
			$scope.mesas_unidas.push(mesa);
		}
	}

	$scope.llenarGarzonesOpciones=function(){
		$scope.garzonesOpciones=[];
		for(var i=0;i<$scope.garzones.length;i++){
			var garzon={
				name:$scope.garzones[i].persona.nombre_completo,
				maker: "",
				ticked:false,
				id:$scope.garzones[i].id,
				persona:{imagen:$scope.garzones[i].persona.imagen}
			}
			$scope.garzonesOpciones.push(garzon);
		}
	}

	$scope.verGarzon = function(garzon){
		$scope.garzon=garzon;
		$scope.garzonVista=garzon;
		$scope.abrirPopup($scope.idModalGarzonEdicion);
		if($scope.garzon!=null){
			$scope.garzon.persona.imagen="img/icon-user-default.png";
		}
	}

	$scope.obtenerGruposProductoEmpresa=function(){
		var promesa=ListaGruposProductoEmpresa($scope.usuario.id_empresa);
		promesa.then(function(grupos){
			$scope.grupos_productos=grupos;
		});
	}

	$scope.verPedido=function(mesa){
		$scope.cargarProductosPanel();
		var promesa=MesaPedidoRestaurante(mesa.id,$scope.filtro.almacen.id);
		promesa.then(function(mesaPedido){
			if(mesaPedido.pedidosRestaurante){
				$scope.pedidoRestaurante=mesaPedido.pedidosRestaurante[0].pedidoRestaurante;
				for(var i=0;i<$scope.pedidoRestaurante.detallesPedidoRestaurante.length;i++){
					if($scope.pedidoRestaurante.detallesPedidoRestaurante[i].producto.activar_inventario){
						$scope.pedidoRestaurante.detallesPedidoRestaurante[i].costos=$scope.pedidoRestaurante.detallesPedidoRestaurante[i].producto.inventarios;
					}else{
						$scope.pedidoRestaurante.detallesPedidoRestaurante[i].costos=[];
					}
				}
			}else{
				$scope.pedidoRestaurante=new PedidoRestaurante({detallesPedidoRestaurante:[],
																mesas:[],pedido_activo:true,
															   garzones:[]});
				$scope.pedidoRestaurante.mesas.push(mesa);
			}
			$scope.obtenerGruposProductoEmpresa();
			$scope.abrirPopup($scope.idModalPanelPedido);
			$scope.sumarTotal();
			$scope.sumarTotalImporte();
			setTimeout(function(){
				aplicarSwiper(4,3,true,2);
			},1000);
		});
	}

	$scope.liberarMesa=function(mesa){
		var promesa=MesaPedidoRestaurante(mesa.id,$scope.filtro.almacen.id);
		promesa.then(function(mesaPedido){
			if(mesaPedido.pedidosRestaurante){
				$scope.mostrarMensaje("La mesa no puede ser liberada porque aun existe un pedido pendiente!");
			}else{
				mesa.estado=$.grep($scope.estadosMesa, function(e){return e.nombre_corto == $scope.diccionario.ESTADO_MESA_DISPONIBLE;})[0];
				MesaActualizacion.update({ id_mesa:mesa.id }, mesa,function(res){
					blockUI.stop();
					$scope.mostrarMensaje('Mesa liberada exitosamente!');
				});
			}
		});
	}

	$scope.reservarMesa=function(mesa){
		$scope.mesa=mesa;
		$scope.abrirPopup($scope.idModalReserva);
	}

	$scope.crearReserva=function(){
		$scope.abrirPopup($scope.idModalReserva);
	}

	$scope.guardarPedidoRestaurante=function(valido,pedidoRestaurante) {
		if(valido){
			if(pedidoRestaurante.id){
				PedidoRestauranteActualizacion.update({ id_pedido_restaurante:pedidoRestaurante.id }, pedidoRestaurante,function(res){
					blockUI.stop();
					$scope.cerrarPedido();
					$scope.mostrarMensaje('Pedido actualizado Exitosamente!');
				});
			}else{
				var mesas=pedidoRestaurante.mesas;
				pedidoRestaurante.$save(function(estado){
					for(var i=0;i<mesas.length;i++){
						mesas[i].estado=estado;
					}
					blockUI.stop();
					$scope.cerrarPedido();
					$scope.mostrarMensaje('Pedido guardado Exitosamente!');
				},function(error) {
					blockUI.stop();
					$scope.cerrarPedido();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				});
			}
		}
	}

	$scope.abrirPopupDatosFacturacion=function(){
		$scope.venta=new Venta({cliente:{},pagado:0});
		$scope.abrirPopup($scope.idModalFacturacion);
	}

	$scope.buscarNit=function(evento,nit){
		if (evento.which === 13){
			var promesa=ClientesNit($scope.usuario.id_empresa,nit);
			promesa.then(function(results){
				if(results.length==1  || results.length>1){
					$scope.establecerCliente(results[0]);
					$scope.interceptarTecla(evento,"razon_social",true);
				}else{
					$scope.venta.cliente.razon_social=null;
					$scope.interceptarTecla(evento,"razon_social",true);
				}
			});
		}
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

	$scope.cerrarPopupFacturacion=function(){
		$scope.cerrarPopup($scope.idModalFacturacion);
	}

	$scope.cerrarPopupReserva=function(){
		$scope.cerrarPopup($scope.idModalReserva);
	}

	$scope.enfocar=function(elemento){
		$timeout(function() {
			$("#"+elemento).focus();
		},0);
	}

	$scope.establecerCliente=function(cliente){
		$scope.venta.cliente=cliente;
		$scope.enfocar('razon_social');
	}

	$scope.calcularCambio=function(){
		$scope.venta.cambio=Math.round(($scope.venta.pagado-$scope.pedidoRestaurante.total)*100)/100;
		$scope.pagoMinimo=$scope.pedidoRestaurante.total;
	}

	$scope.facturarPedidoRestaurante=function() {
		var button=$('#siguienteFacturacion').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			$scope.venta.total=$scope.pedidoRestaurante.total;
			$scope.venta.importe=$scope.pedidoRestaurante.importe;
			$scope.venta.id_usuario=$scope.usuario.id;
			$scope.venta.id_empresa=$scope.usuario.empresa.id;
			$scope.venta.detallesVentaNoConsolidadas=[];
			$scope.venta.fecha=new Date();
			$scope.venta.fechaTexto=$scope.venta.fecha.getDate()+"/"+($scope.venta.fecha.getMonth()+1)+"/"+$scope.venta.fecha.getFullYear();
			$scope.venta.almacen=$scope.filtro.almacen;
			$scope.venta.sucursal=$scope.filtro.sucursal;
			$scope.venta.actividad=$scope.filtro.sucursal.actividadesDosificaciones[0].actividad;
			$scope.venta.detallesVenta=$scope.pedidoRestaurante.detallesPedidoRestaurante;
			$scope.venta.movimiento=$.grep($scope.movimientosEgreso, function(e){return e.nombre_corto == $scope.diccionario.EGRE_FACTURACION;})[0];
			$scope.venta.tipoPago=$.grep($scope.tiposPago, function(e){return e.nombre == $scope.diccionario.TIPO_PAGO_CONTADO;})[0];
			var movimiento=$scope.venta.movimiento.nombre_corto;
			$scope.venta.$save(function(res){
				if($scope.pedidoRestaurante.id){
					InactivarPedido.update({ id:$scope.pedidoRestaurante.id }, $scope.pedidoRestaurante,function(resInact){
						for(var i=0;i<$scope.pedidoRestaurante.mesasPedidoRestaurante.length;i++){
							var mesa=$.grep($scope.mesas, function(e){return e.id == $scope.pedidoRestaurante.mesasPedidoRestaurante[i].mesa.id;})[0];
							$scope.liberarMesa(mesa);
						}
						blockUI.stop();
					});
				}else{console.log($scope.pedidoRestaurante);
					$scope.pedidoRestaurante.pedido_activo=false;
					var pedidoRestaurante=Object.create($scope.pedidoRestaurante);
					$scope.guardarPedidoRestaurante(true,$scope.pedidoRestaurante);
					//$timeout(function() {
						for(var i=0;i<pedidoRestaurante.mesas.length;i++){
							var mesa=$.grep($scope.mesas, function(e){return e.id == pedidoRestaurante.mesas[i].id;})[0];
							$scope.liberarMesa(mesa);
						}
					//},1000);
				}
				ImprimirSalida(movimiento,res,true,$scope.usuario);
				$scope.cerrarPopup($scope.idModalFacturacion);
				$scope.cerrarPedido();
				$scope.mostrarMensaje('Venta registrada exitosamente!');
				blockUI.stop();
			},function(error) {
				blockUI.stop();
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
			});
		}
	}

	$scope.eliminarDetallePedidoRestaurante=function(detallePedidoRestaurante){
		detallePedidoRestaurante.eliminado=true;
		$scope.sumarTotal();
		$scope.sumarTotalImporte();
	}

	$scope.disminuirDetallePedidoRestaurante=function(detallePedidoRestaurante){
		if(detallePedidoRestaurante.cantidad==1){
			$scope.eliminarDetallePedidoRestaurante(detallePedidoRestaurante);
		}else{
			detallePedidoRestaurante.cantidad=detallePedidoRestaurante.cantidad-1;
			$scope.calcularImporteDetallePedido(detallePedidoRestaurante);
			$scope.sumarTotal();
			$scope.sumarTotalImporte();
		}
	}

	$scope.agregarDetallePedido=function(producto){
		var detallePedido;
		$scope.cantidadInventario=0;
		if(producto.activar_inventario){
			for(var i=0;i<producto.inventarios.length;i++){
				$scope.cantidadInventario=$scope.cantidadInventario+producto.inventarios[i].cantidad;
			}
		}
		var j=0,encontrado=false;
		while(j<$scope.pedidoRestaurante.detallesPedidoRestaurante.length && !encontrado){
			if(!$scope.pedidoRestaurante.detallesPedidoRestaurante[j].eliminado && ($scope.pedidoRestaurante.detallesPedidoRestaurante[j].producto.id==producto.id)){
				if(producto.activar_inventario){
					if(($scope.pedidoRestaurante.detallesPedidoRestaurante[j].cantidad+1)<=$scope.cantidadInventario){
						$scope.pedidoRestaurante.detallesPedidoRestaurante[j].cantidad=$scope.pedidoRestaurante.detallesPedidoRestaurante[j].cantidad+1;
					}else{
						$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: '+$scope.cantidadInventario+'!');
					}
				}else{
					$scope.pedidoRestaurante.detallesPedidoRestaurante[j].cantidad=$scope.pedidoRestaurante.detallesPedidoRestaurante[j].cantidad+1;
				}
				encontrado=true;
				detallePedido=$scope.pedidoRestaurante.detallesPedidoRestaurante[j];
			}
			j++;
		}
		if(!encontrado){
			if(producto.activar_inventario){
				if(1<=$scope.cantidadInventario){
					detallePedido={producto:producto,precio_unitario:producto.precio_unitario,
									inventario_disponible:$scope.cantidadInventario,costos:producto.inventarios,
									cantidad:1,descuento:producto.descuento,tipo_descuento:(producto.descuento>0?true:false),recargo:0,ice:0,excento:0,tipo_recargo:false};
					$scope.pedidoRestaurante.detallesPedidoRestaurante.push(detallePedido);
					$scope.calcularImporteDetallePedido(detallePedido);
				}else{
					$scope.mostrarMensaje('¡Cantidad de inventario insuficiente, inventario disponible: '+$scope.cantidadInventario+'!');
				}
			}else{
				detallePedido={producto:producto,precio_unitario:producto.precio_unitario,
								inventario_disponible:$scope.cantidadInventario,costos:[],
								cantidad:1,descuento:producto.descuento,tipo_descuento:(producto.descuento>0?true:false),recargo:0,ice:0,excento:0,tipo_recargo:false};
				$scope.pedidoRestaurante.detallesPedidoRestaurante.push(detallePedido);
				$scope.calcularImporteDetallePedido(detallePedido);
			}
		}else{
			$scope.calcularImporteDetallePedido(detallePedido);
		}
		$scope.sumarTotal();
		$scope.sumarTotalImporte();
	}

	$scope.sumarTotalImporte=function(){
		var sumaImporte=0;
		for(var i=0;i<$scope.pedidoRestaurante.detallesPedidoRestaurante.length;i++){
			if(!$scope.pedidoRestaurante.detallesPedidoRestaurante[i].eliminado){
				sumaImporte=sumaImporte+$scope.pedidoRestaurante.detallesPedidoRestaurante[i].importe;
			}
		}		
		$scope.pedidoRestaurante.importe=Math.round((sumaImporte)*1000)/1000;
	}
	
	$scope.sumarTotal=function(){
		var sumaTotal=0;
		for(var i=0;i<$scope.pedidoRestaurante.detallesPedidoRestaurante.length;i++){
			if(!$scope.pedidoRestaurante.detallesPedidoRestaurante[i].eliminado){
				sumaTotal=sumaTotal+$scope.pedidoRestaurante.detallesPedidoRestaurante[i].total;
			}
		}		
		$scope.pedidoRestaurante.total=Math.round((sumaTotal)*1000)/1000;
	}

	$scope.calcularImporteDetallePedido=function(detallePedido){
		detallePedido.importe=Math.round((detallePedido.cantidad*detallePedido.precio_unitario)*1000)/1000;
		var descuento,recargo;
		if(detallePedido.tipo_descuento){
			descuento=detallePedido.importe*(detallePedido.descuento/100);
		}else{
			descuento=detallePedido.descuento;
		}
		if(detallePedido.tipo_recargo){
			recargo=detallePedido.importe*(detallePedido.recargo/100);
		}else{
			recargo=detallePedido.recargo;
		}
		detallePedido.total=detallePedido.importe-descuento+recargo-detallePedido.ice-detallePedido.excento;
	}

	$scope.cerrarPedido=function(){
		$scope.cerrarPopup($scope.idModalPanelPedido);	
	}

	$scope.clasificarGrupo=function(grupo){
		$scope.productosProcesados=$filter('filter')($scope.productos,grupo);
		setTimeout(function(){
			aplicarSwiper(4,3,true,2);
		},5);
	}
	
	$scope.ordenarProductos=function(orden){console.log(orden);
		$scope.productosProcesados=$filter('orderBy')($scope.productos,['nombre'], orden);
		$scope.ordenProductos=!orden;
		setTimeout(function(){
			aplicarSwiper(4,3,true,2);
		},5);
	}
	
	$scope.filtrarProductos=function(busqueda){
		$scope.productosProcesados=$filter('filter')($scope.productos,busqueda);
		setTimeout(function(){
			aplicarSwiper(4,3,true,2);
		},5);
	}
	
	$scope.cambiarColor=function(color,buttonColor){
		$('#dialog-panel-ventas .widget-main').removeClass('red-style green-style skyblue-style brown-style');
		$('#dialog-panel-ventas .widget-main').addClass(color);

		$('#dialog-panel-ventas .widget-main .button-style').removeClass('red-style-button green-style-button skyblue-style-button brown-style-button');
		$('#dialog-panel-ventas .widget-main .button-style').addClass(buttonColor);
	}

	$scope.showHideFirstRow=function(){

		if($(".first-row").css( "display")=="none"){
			$('.first-row').show( "slow" );
		}else{
			$( ".first-row" ).hide( 1000 );
		}
	}

	$scope.crearSala=function(id_sucursal){
		$scope.sala=new Sala({id_sucursal:id_sucursal});
		$scope.abrirPopup($scope.idModalSalaEdicion);
		$('#sala_step_1').trigger("click");
	}

	$scope.crearMesa=function(id_sala){
		$scope.mesa=new Mesa({id_sala:id_sala,imagen:"img/table.png"});
		$scope.mesa.estado=$.grep($scope.estadosMesa, function(e){return e.nombre_corto == $scope.diccionario.ESTADO_MESA_DISPONIBLE;})[0];
		$scope.abrirPopup($scope.idModalMesaEdicion);
		$('#mesa_step_1').trigger("click");
	}
	$scope.crearGarzon=function(id_garzon){
		$scope.garzon=new CrearGarzon({id_empresa:$scope.usuario.id_empresa,persona:{imagen:"img/icon-user-default.png"}});
		$scope.abrirPopup($scope.idModalGarzonEdicion);
		$('#garzon_step_1').trigger("click");
	}

	$scope.cerrarPopPupEdicionSala=function(){
		$scope.cerrarPopup($scope.idModalSalaEdicion);
	}

	$scope.cerrarPopPupEdicionMesa=function(){
		$scope.cerrarPopup($scope.idModalMesaEdicion);
	}
	$scope.cerrarPopPupEdicionGarzon=function(){
		$scope.cerrarPopup($scope.idModalGarzonEdicion);
	}

	$scope.guardarSala=function(sala){
		var button=$('#siguiente').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			if(sala.id){
				Sala.update({ id_sala:sala.id }, sala,function(res){
					blockUI.stop();
					$scope.cerrarPopPupEdicionSala();
					$scope.mostrarMensaje('Sala actualizada Exitosamente!');
				});
			}else{
				sala.$save(function(salaCreada){
					blockUI.stop();
					$scope.cerrarPopPupEdicionSala();
					$scope.obtenerSalas(sala.id_sucursal);

					$scope.mostrarMensaje('Sala guardada Exitosamente!');
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupEdicionSala();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				});
			}
		}
	}

	$scope.guardarMesa=function(mesa){
		var button=$('#siguienteMesa').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			var estado=mesa.estado;
			if(mesa.id){
				Mesa.update({ id_mesa:mesa.id }, mesa,function(res){
					blockUI.stop();
					$scope.cerrarPopPupEdicionMesa();
					$scope.mostrarMensaje('Mesa actualizada Exitosamente!');
				});
			}else{
				mesa.$save(function(mesaCreada){
					mesaCreada.estado=estado;
					$scope.salaVista.mesas.push(mesaCreada);
					blockUI.stop();
					$scope.cerrarPopPupEdicionMesa();
					//$scope.obtenerSalas(mesa.id_sala);
					$scope.mostrarMensaje('Mesa guardada Exitosamente!');
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupEdicionMesa();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				});
			}
		}
	}
	$scope.guardarGarzon=function(garzon){
		$scope.garzon=garzon;
		var button=$('#siguienteGarzon').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			var imagenPersona=garzon.persona.imagen;
			if(garzon.id){
				ActualizarGarzon.update({ id_garzon:garzon.id }, $scope.garzon,function(res){
					if(res.signedRequest==null){
						$scope.obtenerGarzones();
						blockUI.stop();
						$scope.cerrarPopPupEdicionGarzon();
						$scope.mostrarMensaje('Garzon actualizado Exitosamente!');
					}else{
						var xhr = new XMLHttpRequest();
						xhr.open('PUT', res.signedRequest);
						xhr.onreadystatechange = function() {
							if(xhr.readyState === 4){
							  if(xhr.status === 200){
								$scope.obtenerGarzones();
								blockUI.stop();
								$scope.cerrarPopPupEdicionGarzon();
								$scope.mostrarMensaje('Garzon actualizado Exitosamente!');
							  }
							  else{
								alert('Could not upload file.');
							  }
							}
						};
						
						var binary = atob(imagenPersona.split(',')[1]);
						var data = [];
						for(var i = 0; i < binary.length; i++) {
							data.push(binary.charCodeAt(i));
						}
						var blob =new Blob([new Uint8Array(data)], {type: 'image/jpeg'}); 
						var file=new File([blob],res.image_name, {type:"image/jpeg"});
						console.log(file);
						xhr.send(file);
					}
				});
			}else{
				garzon.$save(function(res){
					if(res.signedRequest==null){
						$scope.verGarzon();
						$scope.obtenerGarzones();
						blockUI.stop();
						$scope.cerrarPopPupEdicionGarzon();
						$scope.mostrarMensaje('Garzon guardado Exitosamente!');
					}else{
						var xhr = new XMLHttpRequest();
						xhr.open('PUT', res.signedRequest);
						xhr.onreadystatechange = function() {
							if(xhr.readyState === 4){
							  if(xhr.status === 200){
								$scope.verGarzon();
								$scope.obtenerGarzones();
								blockUI.stop();
								$scope.cerrarPopPupEdicionGarzon();
								$scope.mostrarMensaje('Garzon guardado Exitosamente!');
							  }
							  else{
								alert('Could not upload file.');
							  }
							}
						};
						
						var binary = atob(imagenPersona.split(',')[1]);
						var data = [];
						for(var i = 0; i < binary.length; i++) {
							data.push(binary.charCodeAt(i));
						}
						var blob =new Blob([new Uint8Array(data)], {type: 'image/jpeg'}); 
						var file=new File([blob],res.image_name, {type:"image/jpeg"});
						xhr.send(file);
					}
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupEdicionGarzon();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				});
			}
		}
	}

	$scope.abrirPopupAsignacionGarzon=function(){
		$scope.llenarGarzonesOpciones();
		if($scope.pedidoRestaurante.garzones){
			for(var j=0;j<$scope.garzonesOpciones.length;j++){
				for(var i=0;i<$scope.pedidoRestaurante.garzones.length;i++){
					if($scope.garzonesOpciones[j].id==$scope.pedidoRestaurante.garzones[i].id){
						$scope.garzonesOpciones[j].ticked=true;
					}
				}
			}
		}else{
			for(var j=0;j<$scope.garzonesOpciones.length;j++){
				for(var i=0;i<$scope.pedidoRestaurante.garzonesPedidoRestaurante.length;i++){
					if($scope.garzonesOpciones[j].id==$scope.pedidoRestaurante.garzonesPedidoRestaurante[i].garzon.id){
						$scope.garzonesOpciones[j].ticked=true;
					}
				}
			}
		}
		$scope.abrirPopup($scope.idModalAsignacionGarzon);
	}

	$scope.abrirPopupUnionMesas=function(){
		$scope.llenarMesasOpciones();
		if($scope.pedidoRestaurante.mesas){
			for(var j=0;j<$scope.mesas_unidas.length;j++){
				for(var i=0;i<$scope.pedidoRestaurante.mesas.length;i++){
					if($scope.mesas_unidas[j].id==$scope.pedidoRestaurante.mesas[i].id){
						$scope.mesas_unidas[j].ticked=true;
					}
				}
			}
		}else{
			for(var j=0;j<$scope.mesas_unidas.length;j++){
				for(var i=0;i<$scope.pedidoRestaurante.mesasPedidoRestaurante.length;i++){
					if($scope.mesas_unidas[j].id==$scope.pedidoRestaurante.mesasPedidoRestaurante[i].mesa.id){
						$scope.mesas_unidas[j].ticked=true;
					}
				}
			}
		}
		$scope.abrirPopup($scope.idModalUnionMesas);
	}

	$scope.abrirPopupCambioMesa=function(){
		$scope.mesaAcambiar=null;
		$scope.abrirPopup($scope.idModalCambioMesa);
	}

	$scope.cerrarPopupCambioMesa=function(){
		$scope.cerrarPopup($scope.idModalCambioMesa);
	}

	$scope.cerrarPopupUnionMesas=function(){
		$scope.cerrarPopup($scope.idModalUnionMesas);
	}

	$scope.cerrarPopupAsignacionGarzones=function(){
		$scope.cerrarPopup($scope.idModalAsignacionGarzon);
	}

	$scope.cambiarMesa=function(mesaACambiar){
		if(!$scope.pedidoRestaurante.mesas){
			//inactivar mesas pedidos restaurante
			InactivarPedido.update({ id:$scope.pedidoRestaurante.id }, $scope.pedidoRestaurante,function(resInact){
				for(var i=0;i<$scope.pedidoRestaurante.mesasPedidoRestaurante.length;i++){
					var mesa=$.grep($scope.mesas, function(e){return e.id == $scope.pedidoRestaurante.mesasPedidoRestaurante[i].mesa.id;})[0];
					$scope.liberarMesa(mesa);
				}
				$scope.guardarPedidoRestaurante(true,$scope.pedidoRestaurante);
			});
		}
		//agregar las nuevas mesas asignadas
		$scope.pedidoRestaurante.mesas=[];
		$scope.pedidoRestaurante.mesas.push(mesaACambiar);
		var mesaAOcupar=$.grep($scope.mesas, function(e){return e.id == mesaACambiar.id;})[0];
		mesaAOcupar.estado=$.grep($scope.estadosMesa, function(e){return e.nombre_corto == $scope.diccionario.ESTADO_MESA_OCUPADO;})[0];
		$scope.cerrarPopupCambioMesa();
	}
	
	$scope.estaMesaUnida=function(mesa_a_unirse){
		var encontrado=false,i=0;
		var mesas=($scope.pedidoRestaurante.mesas?$scope.pedidoRestaurante.mesas:$scope.pedidoRestaurante.mesasPedidoRestaurante);		
		while(i<mesas.length && !encontrado){
			var mesa=mesas[i].mesa?mesas[i].mesa:mesas[i];
			if(mesa.id==mesa_a_unirse.id){
				encontrado=true;
			}
			i++;
		}
		return encontrado;
	}

	$scope.unirMesas=function(mesas_a_unirse){
		//leer detalles pedidos de las demas mesas
		var nuevasMesas=[];
		for (var i = 0; i < mesas_a_unirse.length; i++){
			if(!$scope.estaMesaUnida(mesas_a_unirse[i])){
				nuevasMesas.push(mesas_a_unirse[i]);
				var promesa=MesaPedidoRestaurante(mesas_a_unirse[i].id,$scope.filtro.almacen.id);
				promesa.then(function(mesaPedido){
					if(mesaPedido.pedidosRestaurante){
						var otraMesaPedidoRestaurante=mesaPedido.pedidosRestaurante[0].pedidoRestaurante;
						for(var i=0;i<otraMesaPedidoRestaurante.detallesPedidoRestaurante.length;i++){
							if(otraMesaPedidoRestaurante.detallesPedidoRestaurante[i].producto.activar_inventario){
								otraMesaPedidoRestaurante.detallesPedidoRestaurante[i].costos=otraMesaPedidoRestaurante.detallesPedidoRestaurante[i].producto.inventarios;
							}else{
								otraMesaPedidoRestaurante.detallesPedidoRestaurante[i].costos=[];
							}
							//agregar detalles pedidos leidos al actual pedido
							for(var j=0;j<otraMesaPedidoRestaurante.detallesPedidoRestaurante[i].cantidad;j++){
								$scope.agregarDetallePedido(otraMesaPedidoRestaurante.detallesPedidoRestaurante[i].producto);
							}
						}
					}
					$scope.sumarTotal();
					$scope.sumarTotalImporte();
				});
			}
		}
		//eliminar pedidos de las otras mesas
		if(nuevasMesas.length>0){
			var nuevasMesasIds="";
			for(var t=0;t<nuevasMesas.length;t++){
				if(t==(nuevasMesas.length-1)){
					nuevasMesasIds=nuevasMesasIds+""+nuevasMesas[t].id;
				}else{
					nuevasMesasIds=nuevasMesas[t].id+","+nuevasMesasIds;
				}
			}
			var mesaPedidoAeliminar=new EliminacionMesaPedidoRestaurante({id:nuevasMesasIds});
			mesaPedidoAeliminar.$delete(function(){
				//agregar todas las mesas al pedido
				$scope.pedidoRestaurante.mesas=mesas_a_unirse;
				PedidoRestauranteActualizacion.update({ id_pedido_restaurante:$scope.pedidoRestaurante.id }, $scope.pedidoRestaurante,function(res){
					blockUI.stop();
					$scope.cerrarPopupUnionMesas();
					$scope.mostrarMensaje('Mesas Unidas satisfactoriamente!');
				});
			});
		}
		$scope.cerrarPopupUnionMesas();
		$scope.mostrarMensaje('Mesas Unidas satisfactoriamente!');
	}

	$scope.estaGarzon=function(garzonAasignar){
		var encontrado=false,i=0;
		var garzones=($scope.pedidoRestaurante.garzones?$scope.pedidoRestaurante.garzones:$scope.pedidoRestaurante.garzonesPedidoRestaurante);
		while(i<garzones.length && !encontrado){
			var garzon=garzones[i].garzon?garzones[i].mesa:garzones[i];
			if(garzon.id==garzonAasignar.id){
				encontrado=true;
			}
			i++;
		}
		return encontrado;
	}

	$scope.asignarGarzones=function(garzonesSeleccionados){
		$scope.pedidoRestaurante.garzones=garzonesSeleccionados;
		if($scope.pedidoRestaurante.id){
			PedidoRestauranteActualizacion.update({ id_pedido_restaurante:$scope.pedidoRestaurante.id }, $scope.pedidoRestaurante,function(res){
				$scope.pedidoRestaurante.garzones=garzonesSeleccionados;
				blockUI.stop();
				$scope.cerrarPopupAsignacionGarzones();
				$scope.mostrarMensaje('Garzones asignados satisfactoriamente!');
			});
		}else{
			$scope.cerrarPopupAsignacionGarzones();
			$scope.mostrarMensaje('Garzones asignados satisfactoriamente!');
		}		
	}

	$scope.generarCuenta=function(pedidoRestaurante){
		var doc=new PDFDocument({size:[227,350],margins:{top:10,bottom:10,left:20,right:20}})
		stream = doc.pipe(blobStream());
		doc.font('Helvetica-Bold',14);
		doc.moveDown(0.8);
		var mesas="";
		if(pedidoRestaurante.mesas){
			for(var i=0;i<pedidoRestaurante.mesas.length;i++){
				mesas=mesas+" "+pedidoRestaurante.mesas[i].numero+",";
			}
		}else{
			for(var i=0;i<pedidoRestaurante.mesasPedidoRestaurante.length;i++){
				mesas=mesas+" "+pedidoRestaurante.mesasPedidoRestaurante[i].mesa.numero+",";
			}
		}
		doc.text("MESAS: " +mesas,{align:'center'});
		doc.font('Helvetica',10);
		doc.moveDown(0.4);
		doc.text("Cant.  Consumo                P/U           total",{align:'left'});
		doc.moveDown(0.4);
		var y=doc.y,sumaDescuento=0,sumaRecargo=0,sumaIce=0,sumaExcento=0;
		for(var i=0;i<pedidoRestaurante.detallesPedidoRestaurante.length;i++){
			doc.font('Helvetica',9);
			doc.text(pedidoRestaurante.detallesPedidoRestaurante[i].cantidad,20,y);
			doc.text(pedidoRestaurante.detallesPedidoRestaurante[i].producto.nombre,30,y,{width:100});
			doc.text(pedidoRestaurante.detallesPedidoRestaurante[i].producto.precio_unitario.toFixed(2),140,y);
			doc.text(pedidoRestaurante.detallesPedidoRestaurante[i].producto.precio_unitario*pedidoRestaurante.detallesPedidoRestaurante[i].cantidad,180,y);
			y=y+20;
		}
		doc.x=20;
		doc.font('Helvetica',10);
		doc.moveDown(0.4);
		doc.text("Total Transacción:                         "+pedidoRestaurante.total.toFixed(2),{align:'left'});
		doc.moveDown(2);
		doc.text("Por favor llene sus datos para la emision de factura:",{align:'left'});
		doc.moveDown(0.4);
		doc.text("Razon social:.........................................",{align:'left'});
		doc.moveDown(0.4);
		doc.text("...............................................................",{align:'left'});
		doc.moveDown(0.4);
		doc.text("Nit:.........................................................",{align:'left'});
		
		doc.moveDown(2);
		var fechaActual = new Date();
		var min = fechaActual.getMinutes();

		if(min<10){
			min = "0"+min;
		}
		doc.text(" Fecha : "+ fechaActual.getDate()+"/"+(fechaActual.getMonth()+1)+"/"+fechaActual.getFullYear()+"  "+fechaActual.getHours()+":"+min+"  ",{align:'center'});
		doc.end();
		stream.on('finish', function() {
			var fileURL = stream.toBlobURL('application/pdf');
			var w=window.open(fileURL,'_blank','location=no');
			$timeout(function(){
				w.print();
			},500);
		});
	}

	$scope.obtenerMesasLibres=function(){
		if($scope.mesas){
			var mesasDisponibles=[];
			for(var i=0;i<$scope.mesas.length;i++){
				if($scope.mesas[i].estado.nombre_corto==$scope.diccionario.ESTADO_MESA_DISPONIBLE){
					mesasDisponibles.push($scope.mesas[i]);
				}
			}
			return mesasDisponibles;
		}
	}

	$scope.$on('$routeChangeStart', function(next, current) { 
	  	$scope.eliminarPopup($scope.idModalPanelPedido);
		$scope.eliminarPopup($scope.idModalSalaEdicion);
		$scope.eliminarPopup($scope.idModalMesaEdicion);
		$scope.eliminarPopup($scope.idModalGarzonEdicion);
		$scope.eliminarPopup($scope.idModalFacturacion);
		$scope.eliminarPopup($scope.idModalReserva);
		$scope.eliminarPopup($scope.idModalCambioMesa);
		$scope.eliminarPopup($scope.idModalUnionMesas);
		$scope.eliminarPopup($scope.idModalAsignacionGarzon);
	});

	$scope.inicio();
}]);



