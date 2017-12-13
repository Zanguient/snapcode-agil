angular.module('agil.controladores')

.controller('ControladorClientes', function($scope,$window,$localStorage,$location,$templateCache,$route,blockUI,$timeout,
											ClientesPaginador,Cliente,Clientes,Empresas,ClientesEmpresa,uiGmapGoogleMapApi,$cordovaGeolocation){
	blockUI.start();
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		$scope.obtenerEmpresas();
		$scope.obtenerClientes();
		/*setTimeout(function() {
			ejecutarScriptsTabla('tabla-clientes',10);
		},2000);*/
		uiGmapGoogleMapApi.then(function(maps) {console.log(maps);//google.maps.event.trigger(maps[0].map, 'resize');
			$scope.map = {center: {latitude: -17.403800007775388, longitude: -66.11349012184144 }, zoom: 17,bounds: {
				  northeast: {
					latitude: -17.403800007775388,
					longitude: -66.11349012184144
				  }		  
				} };
				$scope.options = {
				  scrollwheel: false,
				  mapTypeId: google.maps.MapTypeId.SATELLITE
				};
		});
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsCliente('modal-wizard-cliente','modal-wizard-cliente-vista','dialog-eliminar-cliente','modal-wizard-container-cliente-edicion','modal-wizard-container-cliente-vista');
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});

	$scope.obtenerClientes=function(){
		$scope.abs = $window.Math.abs;
		$scope.itemsPorPagina=10;
		$scope.buscarClientes(1,$scope.itemsPorPagina,"");
	}

	$scope.verificarPulso=function(evento,textoBusqueda){
		if(evento.keyCode===13){ //enter pressed
		   $scope.buscarClientes(1,$scope.itemsPorPagina,textoBusqueda);
	   }
	}
	$scope.buscarClientes=function(pagina,itemsPagina,texto){
		blockUI.start();
		$scope.itemsPorPagina=itemsPagina;
		if(texto=="" || texto==null){
			texto=0;
		}else{
			$scope.textoBusqueda=texto;
		}
		$scope.paginaActual=pagina;
		var promesa=ClientesPaginador($scope.usuario.id_empresa,pagina,itemsPagina,texto);
		promesa.then(function(dato){
			$scope.paginas=[];
			for(var i=1;i<=dato.paginas;i++){
				$scope.paginas.push(i);
			}
			$scope.clientes=dato.clientes;
			blockUI.stop();
		});
	}
	
	$scope.abrirPopupCliente=function(cliente){
		$scope.mostrarMap=false;
		$scope.cliente=cliente;
		$scope.map = {center: {latitude:$scope.cliente.latitud, longitude:$scope.cliente.longitud }, zoom: 17,bounds: {
		  northeast: {
			latitude: $scope.cliente.latitud,
			longitude: $scope.cliente.longitud
		  }		  
		}};
		$scope.options = {scrollwheel: false,mapTypeId: google.maps.MapTypeId.SATELLITE};
		$scope.coordsUpdates = 0;
		$scope.dynamicMoveCtr = 0;
		$scope.marker = {
		  id: 0,
		  coords: {
			latitude:$scope.cliente.latitud,
			longitude:$scope.cliente.longitud
		  },
		  options: { draggable: true },
		  events: {
			dragend: function (marker, eventName, args) {
				$scope.cliente.latitud=marker.getPosition().lat();
				$scope.cliente.longitud=marker.getPosition().lng();
			  $scope.marker.options = {
				draggable: true,
				labelAnchor: "100 0",
				labelClass: "marker-labels"
			  };
			}
		  }
		}
		$scope.abrirPopup('modal-wizard-cliente');
	}
	
	$scope.mostrarMapa=function(){
		$scope.mostrarMap=true;
		$timeout(function(){
			$scope.$apply(function(){
				google.maps.event.trigger($scope.map, 'resize');
			});
		},2000);
	}
	
	$scope.crearNuevoCliente=function(){
		var usuario=JSON.parse($localStorage.usuario);
		var cliente=new Cliente({id_empresa:usuario.id_empresa,latitud:-17.403800007775388,longitud:-66.11349012184144});
		$scope.abrirPopupCliente(cliente);
		/*var posOptions = {timeout: 10000, enableHighAccuracy: false};
		  $cordovaGeolocation
			.getCurrentPosition(posOptions)
			.then(function (position) {
				$timeout(function(){
					$scope.$apply(function(){
						$scope.cliente=new Cliente({id_empresa:usuario.id_empresa,latitud:position.coords.latitude,longitud:position.coords.longitude});
						$scope.abrirPopup('modal-wizard-cliente');
					});
				});
				
			}, function(err) {
			  // error
			});*/
	}
	
	$scope.verCliente=function(cliente){
		$scope.cliente=cliente;
		cliente.fecha1=new Date(cliente.fecha1);
		cliente.fecha2=new Date(cliente.fecha2);
		$scope.cliente.fechatexto1=cliente.fecha1.getDate()+"/"+(cliente.fecha1.getMonth()+1)+"/"+cliente.fecha1.getFullYear();
		$scope.cliente.fechatexto2=cliente.fecha2.getDate()+"/"+(cliente.fecha2.getMonth()+1)+"/"+cliente.fecha2.getFullYear();
		$scope.abrirPopup('modal-wizard-cliente-vista');
	}
	
	$scope.cerrarPopPupVista=function(){
		$scope.cerrarPopup('modal-wizard-cliente-vista');
	}
	
	$scope.cerrarPopPupNuevoCliente=function(){
		$scope.cerrarPopup('modal-wizard-cliente');
	}
	
	$scope.modificarCliente=function(cliente){
		if(cliente.fecha1){
			cliente.fecha1=new Date(cliente.fecha1);
			cliente.fechatexto1=cliente.fecha1.getDate()+"/"+(cliente.fecha1.getMonth()+1)+"/"+cliente.fecha1.getFullYear();
		}
		if(cliente.fecha2){
			cliente.fecha2=new Date(cliente.fecha2);
			cliente.fechatexto2=cliente.fecha2.getDate()+"/"+(cliente.fecha2.getMonth()+1)+"/"+cliente.fecha2.getFullYear();
		}
		$scope.abrirPopupCliente(cliente);
	}
	
	$scope.mostrarConfirmacionEliminacion=function(cliente){
		$scope.cliente=new Cliente(cliente);
		$scope.abrirPopup("dialog-eliminar-cliente");
	}
	
	$scope.cerrarConfirmacionEliminacion=function(){
		$scope.cerrarPopup('dialog-eliminar-cliente');
	};
	
	$scope.eliminarCliente=function(cliente){
		blockUI.start();
		$scope.cerrarConfirmacionEliminacion();
		cliente.$delete();
		$scope.mostrarMensaje('Eliminado exitosamente!');
		$scope.recargarItemsTabla();
		blockUI.stop();
	}
	
	$scope.saveForm=function(cliente){
		var button=$('#siguiente').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			cliente.fecha1=null;
			if(cliente.fechatexto1){
				cliente.fecha1=new Date($scope.convertirFecha(cliente.fechatexto1));
			}
			cliente.fecha2=null;
			if(cliente.fechatexto2){
				cliente.fecha2=new Date($scope.convertirFecha(cliente.fechatexto2));
			}
			if(cliente.id){
				Cliente.update({ idCliente:cliente.id }, cliente,function(res){
					blockUI.stop();
					$scope.cerrarPopPupNuevoCliente();
					$scope.mostrarMensaje(res.mensaje);
					$scope.recargarItemsTabla();
				});
			}else{
				cliente.$save(function(res){
					blockUI.stop();
					$scope.cliente=new Cliente({});
					$scope.cerrarPopPupNuevoCliente();
					$scope.mostrarMensaje(res.mensaje);
					$scope.recargarItemsTabla();
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupNuevoCliente();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					$scope.recargarItemsTabla();
				});
			}
		}
	}
	
	$scope.obtenerEmpresas=function(){
		blockUI.start();
		var promesa=Empresas();
		promesa.then(function(empresas){
			$scope.empresas=empresas;
			blockUI.stop();
		});
	}
	
	// $scope.obtenerClientes=function(){
	// 	blockUI.start();
	// 	var promesa=Clientes($scope.usuario.id_empresa);
	// 	promesa.then(function(clientes){
	// 		$scope.clientes=clientes;
	// 		blockUI.stop();
	// 	});
	// }
	
	$scope.subirExcelClientes=function(event){
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
	   $scope.eliminarPopup('modal-wizard-cliente');
	   $scope.eliminarPopup('modal-wizard-cliente-vista');
	   $scope.eliminarPopup('dialog-eliminar-cliente');
	});
	
	$scope.inicio();
});



