angular.module('agil.controladores')

.controller('ControladorRutas', ['$scope','$localStorage','$location','$templateCache','$route','blockUI','$timeout','Clases',
	'Clientes','Rutas','Ruta','uiGmapGoogleMapApi','ClasesTipo','ClientesEmpresa',function($scope,$localStorage,$location,$templateCache,$route,blockUI,$timeout,Clases,
											Clientes,Rutas,Ruta,uiGmapGoogleMapApi,ClasesTipo,ClientesEmpresa){
	blockUI.start();
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		$scope.obtenerDias();
		$scope.obtenerClientes();
		$scope.obtenerDepartamentos();
		$scope.obtenerMunicipios();
		setTimeout(function() {
			ejecutarScriptsTabla('tabla-rutas',10);
		},2000);
	}
	
	$scope.obtenerClientes=function(){
		blockUI.start();
		var promesa=Clientes($scope.usuario.id_empresa);
		promesa.then(function(clientes){
			$scope.clientes=clientes;
			blockUI.stop();
		});
	}
	
	$scope.obtenerRutas=function(){
		blockUI.start();
		var promesa=Rutas($scope.usuario.id_empresa);
		promesa.then(function(rutas){
			for(var i=0;i<rutas.length;i++){
				rutas[i].segmentos=JSON.parse(rutas[i].segmentos);
				for(var k=0;k<rutas[i].dias.length;k++){
					rutas[i].dias[k]=rutas[i].dias[k].id_dia;
				}
				for(var j=0;j<rutas[i].clientes.length;j++){
					rutas[i].clientes[j]=rutas[i].clientes[j].id_cliente;
				}
			}
			$scope.rutas=rutas;
			blockUI.stop();
		});
	}
	
	$scope.obtenerDepartamentos=function(){
		blockUI.start();
		var promesa=ClasesTipo("DEP");
		promesa.then(function(entidad){
			$scope.departamentos=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.obtenerMunicipios=function(){
		blockUI.start();
		var promesa=ClasesTipo("MUN");
		promesa.then(function(entidad){
			$scope.municipios=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.buscarMunicipios=function(departamento){
		var promesa=Clases(departamento.nombre_corto+"M");
		promesa.then(function(entidades){
			$scope.municipios=entidades;
		});
	}
	
	$scope.obtenerDias=function(){
		blockUI.start();
		var promesa=ClasesTipo("DIAS");
		promesa.then(function(entidad){
			$scope.dias=entidad.clases;
			$scope.obtenerRutas();
			blockUI.stop();
		});
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsRuta('modal-wizard-ruta','modal-wizard-ruta-vista','dialog-eliminar-ruta','modal-wizard-container-ruta-edicion','modal-wizard-container-ruta-vista');
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
		
	$scope.abrirPopupRuta=function(ruta){
		$scope.formas=[];
		$scope.mostrarMap=false;
		$scope.ruta=ruta;
		uiGmapGoogleMapApi.then(function(maps) {
			$scope.map = {center: {latitude: -17.403800007775388, longitude: -66.11349012184144 }, zoom: 17,bounds: {
				  northeast: {
					latitude: -17.403800007775388,
					longitude: -66.11349012184144
				  }		  
				} };
			$scope.options = {
				scrollwheel: false,
				mapTypeId: google.maps.MapTypeId.TERRAIN
			};
			$scope.generarMarcadores($scope.ruta);
			$scope.dibujarRuta(ruta);
		});
		$scope.abrirPopup('modal-wizard-ruta');
	}
	
	$scope.eliminarLineas=function(){
		$scope.polylines=[];
		$scope.ruta.segmentos=[];
		for(var i=0;i<$scope.formas.length;i++){
			$scope.formas[i].setMap(null);
		}
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
	  /*$scope.$watch('markersAndCircleFlag', function() {
		if (!$scope.drawingManagerControl.getDrawingManager) {
		  return;
		}
		var controlOptions = angular.copy($scope.drawingManagerOptions);
		if (!$scope.markersAndCircleFlag) {
		  controlOptions.drawingControlOptions.drawingModes.shift();
		  controlOptions.drawingControlOptions.drawingModes.shift();
		}
		$scope.drawingManagerControl.getDrawingManager().setOptions(controlOptions);
	  });*/
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
	
	$scope.seleccionarMarcador=function(marcadorInstancia,evento,marcador){
		if(marcador.options.icon.strokeColor=="blue"){
			marcador.options.icon={
				path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				strokeColor: "red",
				scale: 3
			}
			$scope.ruta.clientes.splice($scope.ruta.clientes.indexOf(marcador.id), 1);
		}else{
			marcador.options.icon={
				path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				strokeColor: "blue",
				scale: 3
			}
			$scope.ruta.clientes.push(marcador.id);
		}
	}
	
	$scope.generarMarcadores=function(ruta) {
		var createMarker = function(i, bounds, idKey,latitude,longitude,options,id) {
		  if (idKey == null) {
			idKey = "id";
		  }
		  var ret = {
			latitude: latitude,
			longitude: longitude,
			title: 'm' + i,
			options: options
		  };
		  ret[idKey] = id;
		  return ret;
		};
		
		$scope.markers=[];
		var markers = [];
		var options;
		for (var i = 0; i <$scope.clientes.length; i++) {
			var seleccionados=$.grep(ruta.clientes, function(e){return e == $scope.clientes[i].id;});
			var color=seleccionados.length>0?"blue":"red";
			options={
				labelContent : $scope.clientes[i].razon_social,
				labelAnchor: "8 35",
				labelClass: 'marker-label',
				icon: {
					path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
					strokeColor: color,
					scale: 3
				}
			}
			markers.push(createMarker(i+1,$scope.map.bounds,null,$scope.clientes[i].latitud,$scope.clientes[i].longitud,options,$scope.clientes[i].id));
		}
		$scope.markers = markers;
	}
	
	$scope.mostrarMapa=function(){
		$scope.mostrarMap=true;
		$timeout(function(){
			$scope.$apply(function(){
				google.maps.event.trigger($scope.map, 'resize');
			});
		},2000);
	}
	
	$scope.crearNuevaRuta=function(){
		var usuario=JSON.parse($localStorage.usuario);
		var ruta=new Ruta({id_empresa:usuario.id_empresa,clientes:[],segmentos:[]});
		$scope.abrirPopupRuta(ruta);
	}
	
	$scope.verRuta=function(ruta){
		$scope.formas=[];
		$scope.mostrarMap=false;
		$scope.ruta=ruta;
		uiGmapGoogleMapApi.then(function(maps) {
			$scope.map = {center: {latitude: -17.403800007775388, longitude: -66.11349012184144 }, zoom: 17,bounds: {
				  northeast: {
					latitude: -17.403800007775388,
					longitude: -66.11349012184144
				  }		  
				} };
			$scope.options = {
				scrollwheel: false,
				mapTypeId: google.maps.MapTypeId.TERRAIN
			};
			$scope.generarMarcadores($scope.ruta);
			$scope.dibujarRuta(ruta);
		});
		$scope.abrirPopup('modal-wizard-ruta-vista');
	}
	
	$scope.cerrarPopPupVista=function(){
		$scope.cerrarPopup('modal-wizard-ruta-vista');
	}
	
	$scope.cerrarPopPupNuevaRuta=function(){
		$scope.cerrarPopup('modal-wizard-ruta');
	}
	
	$scope.modificarRuta=function(ruta){
		$scope.abrirPopupRuta(ruta);
	}
	
	$scope.mostrarConfirmacionEliminacion=function(ruta){
		$scope.ruta=new Ruta(ruta);
		$scope.abrirPopup("dialog-eliminar-ruta");
	}
	
	$scope.cerrarConfirmacionEliminacion=function(){
		$scope.cerrarPopup('dialog-eliminar-ruta');
	};
	
	$scope.eliminarRuta=function(ruta){
		blockUI.start();
		$scope.cerrarConfirmacionEliminacion();
		ruta.$delete();
		$scope.mostrarMensaje('Eliminado exitosamente!');
		$scope.recargarItemsTabla();
		blockUI.stop();
	}
	
	$scope.saveForm=function(ruta){
		var button=$('#siguiente').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			ruta.segmentos=JSON.stringify(ruta.segmentos);
			if(ruta.id){
				Ruta.update({ idRuta:ruta.id }, ruta,function(res){
					blockUI.stop();
					$scope.cerrarPopPupNuevaRuta();
					$scope.mostrarMensaje(res.mensaje);
					$scope.recargarItemsTabla();
				});
			}else{
				ruta.$save(function(res){
					blockUI.stop();
					$scope.ruta=new Ruta({});
					$scope.cerrarPopPupNuevaRuta();
					$scope.mostrarMensaje("¡Ruta creada con código "+res.id+"!");
					$scope.recargarItemsTabla();
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupNuevaRuta();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					$scope.recargarItemsTabla();
				});
			}
		}
	}
	
	$scope.subirExcelRutas=function(event){
		var files = event.target.files;
		var i,f;
		for (i = 0, f = files[i]; i != files.length; ++i) {
			var reader = new FileReader();
			var name = f.name;
			reader.onload = function(e) {
				blockUI.start();
			  var data = e.target.result;

			  var workbook = XLSX.read(data, {type: 'binary'});
				var first_sheet_name = workbook.SheetNames[0];
				var row=2,i=0;
				var worksheet = workbook.Sheets[first_sheet_name];
				var clientes=[];
				do {
					var cliente={};
					cliente.codigo=worksheet['A'+row]!=undefined && worksheet['A'+row]!=""?worksheet['A'+row].v.toString():null;
					cliente.razon_social=worksheet['B'+row]!=undefined && worksheet['B'+row]!=""?worksheet['B'+row].v.toString():null;
					cliente.nit=worksheet['C'+row]!=undefined && worksheet['C'+row]!=""?worksheet['C'+row].v.toString():null;
					cliente.direccion=worksheet['D'+row]!=undefined && worksheet['D'+row]!=""?worksheet['D'+row].v.toString():null;
					cliente.telefono1=worksheet['E'+row]!=undefined && worksheet['E'+row]!=""?worksheet['E'+row].v.toString():null;
					cliente.telefono2=worksheet['F'+row]!=undefined && worksheet['F'+row]!=""?worksheet['F'+row].v.toString():null;
					cliente.telefono3=worksheet['G'+row]!=undefined && worksheet['G'+row]!=""?worksheet['G'+row].v.toString():null;
					cliente.contacto=worksheet['H'+row]!=undefined && worksheet['H'+row]!=""?worksheet['H'+row].v.toString():null;
					cliente.ubicacion_geografica=worksheet['I'+row]!=undefined && worksheet['I'+row]!=""?worksheet['I'+row].v.toString():null;
					cliente.rubro=worksheet['J'+row]!=undefined && worksheet['J'+row]!=""?worksheet['J'+row].v.toString():null;
					cliente.categoria=worksheet['K'+row]!=undefined && worksheet['K'+row]!=""?worksheet['K'+row].v.toString():null;
					cliente.fecha1=worksheet['L'+row]!=undefined && worksheet['L'+row]!=""?new Date($scope.convertirFecha(worksheet['L'+row].v.toString())):null;
					cliente.fecha2=worksheet['M'+row]!=undefined && worksheet['M'+row]!=""?new Date($scope.convertirFecha(worksheet['M'+row].v.toString())):null;
					cliente.texto1=worksheet['N'+row]!=undefined && worksheet['N'+row]!=""?worksheet['N'+row].v.toString():null;
					cliente.texto2=worksheet['O'+row]!=undefined && worksheet['O'+row]!=""?worksheet['O'+row].v.toString():null;
					cliente.ruta1=worksheet['P'+row]!=undefined && worksheet['P'+row]!=""?worksheet['P'+row].v.toString():null;
					cliente.ruta2=worksheet['Q'+row]!=undefined && worksheet['Q'+row]!=""?worksheet['Q'+row].v.toString():null;
					cliente.ruta3=worksheet['R'+row]!=undefined && worksheet['R'+row]!=""?worksheet['R'+row].v.toString():null;
					clientes.push(cliente);
					row++;	
					i++;				
				} while (worksheet['A'+row]!=undefined);
				$scope.guardarClientes(clientes);
				blockUI.stop();
			};
			reader.readAsBinaryString(f);
	    }  
	}
	
	$scope.guardarClientes=function(clientes){
		var clientesEmpresa=new ClientesEmpresa({clientes:clientes,id_empresa:$scope.usuario.id_empresa});
		clientesEmpresa.$save(function(res){
			blockUI.stop();
			$scope.mostrarMensaje(res.mensaje);
			$scope.recargarItemsTabla();
		},function(error) {
			blockUI.stop();
			$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
			$scope.recargarItemsTabla();
		});
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup('modal-wizard-ruta');
	   $scope.eliminarPopup('modal-wizard-ruta-vista');
	   $scope.eliminarPopup('dialog-eliminar-ruta');
	});
	
	$scope.inicio();
}]);



