angular.module('agil.controladores')

.controller('ControladorSeguimientoApp', function($scope,$window,$localStorage,$location,$templateCache,$route,blockUI,
													UsuariosRutasLista,Rutas,uiGmapGoogleMapApi,UsuarioRutasSeguimiento,
													UsuarioRutaReporteDatos,UsuarioRutaGraficoDatos,UsuariosComisionesReporte,
													CierreCajaRutaUsuarioDatos){
	blockUI.start();
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	$scope.idModalSeguimientoVentas='dialog-seguimiento-ventas';	
	$scope.idModalFiltroExcel='dialog-filtro-excel';
	$scope.idModalFiltroGraficos='dialog-filtro-graficos';
	$scope.idModalUsuarioComision='dialog-usuario-comision';
	
	$scope.inicio=function(){
		$scope.obtenerUsuariosRutas();
		$scope.obtenerRutas();
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		setTimeout(function(){
			ejecutarScriptsSeguimiento($scope.idModalSeguimientoVentas,$scope.idModalFiltroExcel,$scope.idModalFiltroGraficos,$scope.idModalUsuarioComision);
		},1000);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.obtenerUsuariosRutas=function(){
		var currentDate=new Date();
		var currentDateString=currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear();
		$scope.filtrarRutasUsuarios(currentDateString,currentDateString,0,0);
	}
	
	$scope.obtenerRutas=function(){
		blockUI.start();
		var promesa=Rutas($scope.usuario.id_empresa);
		promesa.then(function(rutas){
			$scope.rutas=rutas;
			blockUI.stop();
		});
	}
	
	$scope.filtrarRutasUsuarios=function(inicio,fin,ruta,usuario){
		blockUI.start();
		ruta=(ruta==null||ruta==undefined)?0:ruta;
		usuario=(usuario==""||usuario==undefined)?0:usuario;
		var inicio=new Date($scope.convertirFecha(inicio));
		var fin=new Date($scope.convertirFecha(fin));
		var promesa=UsuariosRutasLista($scope.usuario.id_empresa,inicio,fin,usuario,ruta);
		promesa.then(function(entidades){
			$scope.usuariosRutas=entidades;
			blockUI.stop();
		});
	}
	
	$scope.abrirSeguimientoVentas=function(idUsuario,ruta){
		blockUI.start();
		var diaActual=$scope.obtenerDiaActual();
		var diaHoy=$.grep(ruta.dias, function(e){return e.dia.nombre_corto == diaActual;});
		if(diaHoy.length>0){
			var promise=UsuarioRutasSeguimiento(idUsuario,diaActual);
			promise.then(function(rutas){
			$scope.mostrarMap=true;
				uiGmapGoogleMapApi.then(function(maps) {
					$scope.map = {center: {latitude: -17.403800007775388, longitude: -66.11349012184144 }, zoom: 17,bounds: {
						  northeast: {
							latitude: -17.403800007775388,
							longitude: -66.11349012184144
						  }		  
						},
						window: {
							marker: {},
							show: false,
							closeClick: function() {
								this.show = false;
							},
							options: {} // define when map is ready
						},
						markersEvents: {
							click: function(marker, eventName, model, arguments) {
								$scope.map.window.model = model;
								$scope.map.window.show = true;
							}
						},};
					$scope.options = {
						scrollwheel: false,
						mapTypeId: google.maps.MapTypeId.TERRAIN
					};
					$scope.generarMarcadores(rutas[0].ruta.clientes);
					rutas[0].ruta.segmentos=JSON.parse(rutas[0].ruta.segmentos);
					$scope.dibujarRuta(rutas[0].ruta);
				});
				$scope.abrirPopup($scope.idModalSeguimientoVentas);
				blockUI.stop();
			});
		}else{
			$scope.mostrarMensaje("¡No existe ventas en el dia para esta Ruta y Usuario!");
			blockUI.stop();
		}
	}
	
	$scope.generarMarcadores=function(clientes) {
		//$templateRequest("templates/venta-seguimiento.html").then(function(html){
			  
			var createMarker = function(i, bounds, idKey,latitude,longitude,options,id,razonSocial,ventas,detallesVentaNoConsolidadas,html) {
			  if (idKey == null) {
				idKey = "id";
			  }
			  
			  var ret = {
				latitude: latitude,
				longitude: longitude,
				title: html,//'<b>m' + i+"</b>",
				options: options,
				razonSocial:razonSocial,
				ventas:ventas,
				detallesVentaNoConsolidadas:detallesVentaNoConsolidadas,
				show: false
			  };
			  ret[idKey] = id;
			  return ret;
			};
			
			$scope.markers=[];
			var markers = [];
			var options;
			for (var i = 0; i <clientes.length; i++) {
				//var seleccionados=$.grep(ruta.clientes, function(e){return e == $scope.clientes[i].id;});
				var color, templateVentas='',templateVentasNoConsolidadas='';
				if(clientes[i].cliente.ventas.length>0){
					templateVentas=$scope.renderizarHtmlVentas(clientes[i].cliente.ventas[0]);
					if(clientes[i].cliente.ventas[0].detallesVentaNoConsolidadas.length>0){
						templateVentasNoConsolidadas=$scope.renderizarHtmlVentasNoConsolidadas(clientes[i].cliente.ventas[0].detallesVentaNoConsolidadas);
						color="yellow";
					}else{
						color="green";
					}
				}else if(clientes[i].cliente.detallesVentaNoConsolidadas.length>0){
					templateVentasNoConsolidadas=$scope.renderizarHtmlVentasNoConsolidadas(clientes[i].cliente.detallesVentaNoConsolidadas);
					color="red";
				}else{
					templateVentas='¡Aún no se visito!'
					color="black";
				}
				options={
					labelContent : clientes[i].cliente.razon_social,
					labelAnchor: "8 35",
					labelClass: 'marker-label',
					icon: {
						path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
						strokeColor: color,
						scale: 3
					}
				}
				var template=templateVentas+templateVentasNoConsolidadas;
				
				//$timeout(function(){
					markers.push(createMarker(i+1,$scope.map.bounds,null,clientes[i].cliente.latitud,clientes[i].cliente.longitud,options,clientes[i].cliente.id,clientes[i].cliente.razon_social,clientes[i].cliente.ventas,clientes[i].cliente.detallesVentaNoConsolidadas,template));
				//});
			}
			$scope.markers = markers;
		//});
	}
	
	$scope.renderizarHtmlVentas=function(venta){
		var template='<h3>Venta</h3><table class="table table-striped table-bordered table-hover" ng-if="modelo.detallesVenta.length>0"> \
			<thead>\
				<tr>\
					<th>\
						<label>#</label>\
					</th>\
					<th>\
						<label>Cantidad</label>\
					</th>\
					<th>\
						<label>Producto</label>\
					</th>\
					<th>\
						<label>Precio (Bs)</label>\
					</th>\
				</tr>\
			</thead>\
			<tbody>';
		var template2='';
		for(var i=0;i<venta.detallesVenta.length;i++){
			template2=template2+'<tr><td>'+(i+1)+'</td>\
					<td>'+venta.detallesVenta[i].cantidad+'</td>\
					<td>'+venta.detallesVenta[i].producto.nombre+'</td>\
					<td>'+venta.detallesVenta[i].total+'</td></tr>';
		}
		 var template3='</tr>\
				<tr>\
					<td>\
					</td>\
					<td>\
					</td>\
					<td>\
						<b>TOTALES</b>\
					</td>\
					<td>'+venta.total+'</td>\
				</tr>\
			</tbody>\
		</table>';
		
		return template+template2+template3;
	}
	
	$scope.renderizarHtmlVentasNoConsolidadas=function(detallesVentaNoConsolidadas){
		var template='<h3>Venta No Consolidada</h3>\
		<table class="table table-striped table-bordered table-hover">\
			<thead>\
				<tr>\
					<th>\
						<label>#</label>\
					</th>\
					<th>\
						<label>Cantidad</label>\
					</th>\
					<th>\
						<label>Producto</label>\
					</th>\
					<th>\
						<label>Precio (Bs)</label>\
					</th>\
				</tr>\
			</thead>\
			<tbody>';
		var template2='';
		for(var i=0;i<detallesVentaNoConsolidadas.length;i++){
			template2=template2+'<tr><td>'+(i+1)+'</td>\
					<td>'+detallesVentaNoConsolidadas[i].cantidad+'</td>\
					<td>'+detallesVentaNoConsolidadas[i].producto.nombre+'</td>\
					<td>'+detallesVentaNoConsolidadas[i].total+'</td></tr>';
		}
			var template3='</tr>\
			</tbody>\
		</table>';
		return template+template2+template3;
	}
	
	$scope.dibujarRuta=function(ruta){
		$scope.polylines=[];
		if(ruta.segmentos.length>0){
			for(var i=0;i<ruta.segmentos.length;i++){
				var markersPolylines=[]
				for(var j=0;j<ruta.segmentos[i].length;j++){
					markersPolylines.push({latitude:ruta.segmentos[i][j].lat,longitude:ruta.segmentos[i][j].lng});
				}
				$scope.polylines.push({
					id: i+1,
					path: markersPolylines,
					stroke: {
						color: '#69AA46',
						weight: 3
					},
					editable: true,
					draggable: true,
					geodesic: true,
					visible: true
				});
			}
		}
				
		$scope.drawingManagerOptions = {
			//drawingMode: google.maps.drawing.OverlayType.POLYLINE,
			drawingControl: true,
			drawingControlOptions: {
			  position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
				  google.maps.drawing.OverlayType.POLYLINE
				]
			},
			polylineOptions: {
				strokeColor: '#69AA46',
				strokeWeight: 5
			}
		};
		$scope.markersAndCircleFlag = true;
		$scope.drawingManagerControl = {};
		$scope.drawingManagerEvents={
			polylinecomplete: function (dm, name, scope, objs) {
				var polyline = objs[0];
				var path = polyline.getPath();
				var segmento=[];
				for (var i = 0; i < path.getArray().length; i++) {
					segmento.push(path.getArray()[i].toJSON());
				}
				$scope.ruta.segmentos.push(segmento);
				$scope.formas.push(polyline);
			}
		}
	}
	
	$scope.seleccionarMarcador=function(marker, eventName, model){
        model.show = !model.show;
	}
	
	$scope.cerrarSeguimientoVenta=function(){
		$scope.mostrarMap=false;
		$scope.cerrarPopup($scope.idModalSeguimientoVentas);
	}
	
	$scope.abrirPopupFiltroExcel=function(usuario,ruta){
		var fechaActual=new Date();
		$scope.reporte={bandera:3,id_usuario:usuario.id,usuario:usuario,ruta:ruta,id_ruta:ruta.id,mes:"1",gestion:"2017"};
		$scope.reporte.fechaTextoInicio=fechaActual.getDate()+"/"+(fechaActual.getMonth()+1)+"/"+fechaActual.getFullYear();
		$scope.reporte.fechaTextoFin=fechaActual.getDate()+"/"+(fechaActual.getMonth()+1)+"/"+fechaActual.getFullYear();
		$scope.abrirPopup($scope.idModalFiltroExcel);
	}
	
	$scope.cerrarPopupFiltroExcel=function(){
		$scope.cerrarPopup($scope.idModalFiltroExcel);
	}
	
	$scope.buscarDetallesVenta=function(reporte){
		blockUI.start();
		if(reporte.tipo){
			var fechaInicio=new Date();
			fechaInicio.setDate(1);
			fechaInicio.setMonth((parseInt(reporte.mes)-1));
			fechaInicio.setFullYear(parseInt(reporte.gestion));
			reporte.inicio=fechaInicio;
			var fechaFin=new Date();
			fechaFin.setDate(new Date(parseInt(reporte.gestion), parseInt(reporte.mes), 0).getDate());
			fechaFin.setMonth((parseInt(reporte.mes)-1));
			fechaFin.setFullYear(parseInt(reporte.gestion));
			reporte.fin=fechaFin;
		}else{
			reporte.inicio=new Date($scope.convertirFecha(reporte.fechaTextoInicio));
			reporte.fin=new Date($scope.convertirFecha(reporte.fechaTextoFin));
		}
		var promesa=UsuarioRutaReporteDatos(reporte.id_usuario,reporte.inicio,reporte.fin,reporte.bandera,reporte.id_ruta);
		promesa.then(function(detalles){
			var data = [["","","REPORTE VENDEDOR RUTA"],["Vendedor : ",reporte.usuario.persona.nombres,"Ruta : ",reporte.ruta.nombre],["Nro.","Fecha","Cliente","Producto","Cantidad","P. U.","Total","Comision","Total Comision","Tipo de Venta","Dias"]]
			var totalCosto=0;
			for(var i=0;i<detalles.length;i++){
				var columns=[];
				columns.push((i+1).toString());
				if(reporte.bandera==1){
					detalles[i].fecha=new Date(detalles[i].fecha);
					columns.push(detalles[i].fecha.getDate()+"/"+(detalles[i].fecha.getMonth()+1)+"/"+detalles[i].fecha.getFullYear());
					columns.push(detalles[i].cliente.razon_social);
					columns.push("ROJO");
					columns.push("ROJO");
					columns.push("ROJO");
					columns.push("ROJO");
					columns.push("ROJO");
					columns.push("ROJO");
					columns.push("ROJO");
					columns.push("ROJO");
				}else{
					detalles[i].venta.fecha=new Date(detalles[i].venta.fecha);
					columns.push(detalles[i].venta.fecha.getDate()+"/"+(detalles[i].venta.fecha.getMonth()+1)+"/"+detalles[i].venta.fecha.getFullYear());
					columns.push(detalles[i].venta.cliente.razon_social);
					columns.push(detalles[i].producto.nombre);
					columns.push(detalles[i].cantidad);
					columns.push(detalles[i].precio_unitario);
					columns.push(detalles[i].total);
					columns.push(detalles[i].producto.comision);
					columns.push(detalles[i].cantidad*detalles[i].producto.comision);
					columns.push(detalles[i].venta.tipoPago.nombre);
					if(detalles[i].venta.dias_credito){columns.push(detalles[i].venta.dias_credito);}
				}
				data.push(columns);
			}
			
			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
			saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "REPORTE-RUTA-USUARIO.xlsx");
			blockUI.stop();
		});
	}
	
	$scope.abrirPopupFiltroGraficos=function(usuario,ruta){
		var fechaActual=new Date();
		$scope.reporte={bandera:3,id_usuario:usuario.id,usuario:usuario,ruta:ruta,id_ruta:ruta.id,mes:"1",gestion:"2017"};
		$scope.reporte.fechaTextoInicio=fechaActual.getDate()+"/"+(fechaActual.getMonth()+1)+"/"+fechaActual.getFullYear();
		$scope.reporte.fechaTextoFin=fechaActual.getDate()+"/"+(fechaActual.getMonth()+1)+"/"+fechaActual.getFullYear();
		$scope.abrirPopup($scope.idModalFiltroGraficos);
	}
	
	$scope.buscarGraficos=function(reporte){
		blockUI.start();
		//por mes
		if(reporte.tipo){
			var fechaInicio=new Date();
			fechaInicio.setDate(1);
			fechaInicio.setMonth((parseInt(reporte.mes)-1));
			fechaInicio.setFullYear(parseInt(reporte.gestion));
			reporte.inicio=fechaInicio;
			var fechaFin=new Date();
			fechaFin.setDate(new Date(parseInt(reporte.gestion), parseInt(reporte.mes), 0).getDate());
			fechaFin.setMonth((parseInt(reporte.mes)-1));
			fechaFin.setFullYear(parseInt(reporte.gestion));
			reporte.fin=fechaFin;
		}else{//por periodo
			reporte.inicio=new Date($scope.convertirFecha(reporte.fechaTextoInicio));
			reporte.fin=new Date($scope.convertirFecha(reporte.fechaTextoFin));
		}
		var promesa=UsuarioRutaGraficoDatos(reporte.id_usuario,reporte.inicio,reporte.fin,reporte.id_ruta);
		promesa.then(function(ventas){
			if(reporte.tipo){
				$scope.labels = [];
				$scope.data = [];
				var suma=0;
				for(var i=0;i<ventas.length;i++){
					ventas[i].fecha=new Date(ventas[i].fecha);
					var iguales=$.grep(ventas, function(e){
						e.fecha=new Date(e.fecha);
						return e.fecha.getDate() == ventas[i].fecha.getDate() && e.fecha.getMonth() == ventas[i].fecha.getMonth() && e.fecha.getFullYear() == ventas[i].fecha.getFullYear();
					});
					ventas=$.grep(ventas, function(e){
						e.fecha=new Date(e.fecha);
						return !(e.fecha.getDate() == ventas[i].fecha.getDate() && e.fecha.getMonth() == ventas[i].fecha.getMonth() && e.fecha.getFullYear() == ventas[i].fecha.getFullYear());
					});
					i=-1;
					suma=0;
					for(var j=0;j<iguales.length;j++){
						suma=suma+iguales[j].total;
					}
					$scope.labels.push(iguales[0].fecha.getDate()+"/"+(iguales[0].fecha.getMonth()+1)+"/"+iguales[0].fecha.getFullYear());
					$scope.data.push(suma);
				}
				  $scope.series = ['Series A'];
			}else{
				$scope.labels = [];
				$scope.data = [];
				var suma=0;
				for(var i=0;i<ventas.length;i++){
					ventas[i].fecha=new Date(ventas[i].fecha);
					var iguales=$.grep(ventas, function(e){
						e.fecha=new Date(e.fecha);
						return e.fecha.getMonth() == ventas[i].fecha.getMonth() && e.fecha.getFullYear() == ventas[i].fecha.getFullYear();
					});
					ventas=$.grep(ventas, function(e){
						e.fecha=new Date(e.fecha);
						return !(e.fecha.getMonth() == ventas[i].fecha.getMonth() && e.fecha.getFullYear() == ventas[i].fecha.getFullYear());
					});
					i=-1;
					suma=0;
					for(var j=0;j<iguales.length;j++){
						suma=suma+iguales[j].total;
					}
					$scope.labels.push((iguales[0].fecha.getMonth()+1));
					$scope.data.push(suma);
				}
				  $scope.series = ['Series A'];
			}
			
			blockUI.stop();
		});
	}
	
	$scope.cerrarPopupFiltroGraficos=function(){
		$scope.cerrarPopup($scope.idModalFiltroGraficos);
	}
	
	$scope.cerrarPopupUsuarioComision=function(){
		$scope.cerrarPopup($scope.idModalUsuarioComision);
	}
	
	$scope.verComisionesVendedores=function(inicio,fin){
		blockUI.start();
		$scope.abrirPopup($scope.idModalUsuarioComision);
		inicio=new Date($scope.convertirFecha(inicio));
		fin=new Date($scope.convertirFecha(fin));
		
		var promesa=UsuariosComisionesReporte($scope.usuario.id_empresa,inicio,fin);
		promesa.then(function(usuarios){
			$scope.labels = [];
			$scope.data = [];
			for(var i=0;i<usuarios.length;i++){
				$scope.labels.push(usuarios[i].persona.nombre_completo);
				var suma=0;
				for(var j=0;j<usuarios[i].ventas.length;j++){
					for(var k=0;k<usuarios[i].ventas[j].detallesVenta.length;k++){
						if(usuarios[i].comision_activa){
							suma=suma+usuarios[i].comision_general;
						}else{
							suma=suma+usuarios[i].ventas[j].detallesVenta[k].producto.comisionesVendedores[0].comision;
						}
					}
				}
				$scope.data.push(suma);
			}
			$scope.series = ['Series A'];
			blockUI.stop();
		});
	}
	
	$scope.cerrarCajaUsuarioRuta=function(usuario,ruta){
		blockUI.start();
		var diaActual=$scope.obtenerDiaActual();
		var diaHoy=$.grep(ruta.dias, function(e){return e.dia.nombre_corto == diaActual;});
		var y=100,no=1;
		if(diaHoy.length>0){
			var doc = new PDFDocument({size:[612,792],margin:0});
			var stream = doc.pipe(blobStream());
			doc.font('Helvetica-Bold',15);
			doc.text("CIERRE DE CAJA",55,50);
			doc.font('Helvetica-Bold',8);
			var promise=CierreCajaRutaUsuarioDatos(usuario.id,diaActual);
			promise.then(function(rutas){
				doc.text("VENTAS",75,80);
				doc.text("No.",100,100);
				doc.text("Fecha",150,100);
				doc.text("Cliente",200,100);
				doc.text("Total",350,100);
				doc.text("Comision",400,100);
				doc.text("T. Comision",450,100);
				doc.text("Tipo Venta",500,100);
				doc.font('Helvetica',8);
				var totalVenta=0,totalComision=0,totalPagado=0;
				for(var i=0;i<rutas[0].ruta.clientes.length;i++){
					for(var j=0;j<rutas[0].ruta.clientes[i].cliente.ventas.length;j++){
						rutas[0].ruta.clientes[i].cliente.ventas[j].fecha=new Date(rutas[0].ruta.clientes[i].cliente.ventas[j].fecha);
						doc.text("No. "+no,100,y+20);
						doc.text(rutas[0].ruta.clientes[i].cliente.ventas[j].fecha.getDate()+"/"+(rutas[0].ruta.clientes[i].cliente.ventas[j].fecha.getMonth()+1)+"/"+rutas[0].ruta.clientes[i].cliente.ventas[j].fecha.getFullYear(),150,y+20);
						doc.text(rutas[0].ruta.clientes[i].cliente.razon_social,200,y+20);
						var total=(rutas[0].ruta.clientes[i].cliente.ventas[j].tipoPago.nombre==$scope.diccionario.TIPO_PAGO_CREDITO)?rutas[0].ruta.clientes[i].cliente.ventas[j].a_cuenta:rutas[0].ruta.clientes[i].cliente.ventas[j].total;
						doc.text(total,350,y+20);
						totalVenta=totalVenta+total;
						if(usuario.comision_activa){
							doc.text(usuario.comision_general+"%",400,y+20);
							doc.text((rutas[0].ruta.clientes[i].cliente.ventas[j].total*usuario.comision_general)/100,450,y+20);
							totalComision=totalComision+(rutas[0].ruta.clientes[i].cliente.ventas[j].total*usuario.comision_general)/100;
						}
						doc.text(rutas[0].ruta.clientes[i].cliente.ventas[j].tipoPago.nombre,500,y+20);
						//suma=suma+ventas[i].total;
						y=y+20;
						no++;
					}
				}
				doc.font('Helvetica-Bold',8);
				doc.text("Totales",200,y+20);
				doc.text(totalVenta,350,y+20);
				doc.text(totalComision,450,y+20);
				y=y+20;
				doc.text("COBROS",75,y+20);
				y=y+20;
				doc.text("No.",100,y+20);
				doc.text("Fecha",150,y+20);
				doc.text("Cliente",200,y+20);
				doc.text("Total",350,y+20);
				doc.text("Pago",400,y+20);
				doc.font('Helvetica',8);
				y=y+20;
				no=1;
				for(var i=0;i<rutas[0].usuario.pagos.length;i++){
					rutas[0].usuario.pagos[i].createdAt=new Date(rutas[0].usuario.pagos[i].createdAt);
					doc.text("No. "+no,100,y+20);
					doc.text(rutas[0].usuario.pagos[i].createdAt.getDate()+"/"+(rutas[0].usuario.pagos[i].createdAt.getMonth()+1)+"/"+rutas[0].usuario.pagos[i].createdAt.getFullYear(),150,y+20);
					doc.text(rutas[0].usuario.pagos[i].venta.cliente.razon_social,200,y+20);
					doc.text(rutas[0].usuario.pagos[i].monto_pagado,350,y+20);
					totalPagado=totalPagado+rutas[0].usuario.pagos[i].monto_pagado
					var pago=(rutas[0].usuario.pagos[i].saldo_anterior==rutas[0].usuario.pagos[i].monto_pagado)?"Total":"A/C";
					doc.text(pago,400,y+20);
					//suma=suma+ventas[i].total;
					y=y+20;
					no++;
				}
				doc.font('Helvetica-Bold',8);
				doc.text("Totales",200,y+20);
				doc.text(totalPagado,350,y+20);
				doc.text("RESUMEN",200,y+40);
				doc.text("Ventas",200,y+50);
				doc.text("Cobros",200,y+60);
				doc.text(totalVenta,280,y+50);
				doc.text(totalPagado,280,y+60);
				doc.text("Total a entregar",200,y+70);
				doc.text(totalVenta+totalPagado,280,y+70);
				y=y+40;
				doc.text("---------------------------------------------                       ---------------------------------------------                       ---------------------------------------------",0,y+100,{align:'center'});
				doc.text("ENTREGUE CONFORME                                               RECIBI CONFORME                                               VoBo                         ",0,y+130,{align:'center'});
				doc.text("NOMBRE                                                        NOMBRE                                                       NOMBRE                         ",0,y+145,{align:'center'});
				doc.text("CI                                                              CI                                                              CI                           ",0,y+160,{align:'center'});
				blockUI.stop();
				doc.end();
				stream.on('finish', function() {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL,'_blank','location=no');
				});
			});
		}else{
			$scope.mostrarMensaje("¡No existe ventas en el dia para esta Ruta y Usuario!");
			blockUI.stop();
		}
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalSeguimientoVentas);
	   $scope.eliminarPopup($scope.idModalFiltroExcel);
	   $scope.eliminarPopup($scope.idModalFiltroGraficos);
	   $scope.eliminarPopup($scope.idModalUsuarioComision);
	});
	
	$scope.inicio();
});



