angular.module('agil.controladores')

.controller('ControladorEmpresas', function($scope,$localStorage,$location,$templateCache,$route,blockUI,ClasesTipo,Clases,Empresa,Empresas,ListaAplicacionesSistema){
	blockUI.start();
	
	$scope.idModalWizardEmpresaEdicion='modal-wizard-empresa';
	$scope.idModalWizardEmpresaVista='modal-wizard-empresa-vista';
	$scope.idModalEliminarEmpresa='dialog-eliminar-empresa';
	$scope.idModalContenedorEmpresaEdicion='modal-wizard-container-empresa-edicion';
	$scope.idModalContenedorEmpresaVista='modal-wizard-container-empresa-vista';
	$scope.idImagenEmpresa='imagen-empresa';
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		$scope.obtenerEmpresas($scope.usuario.id_empresa);
		$scope.obtenerAplicaciones()
		setTimeout(function() {
			ejecutarScriptsTabla('tabla-empresas',11);
		},2000);
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsEmpresa($scope.idModalWizardEmpresaEdicion,
							   $scope.idImagenEmpresa,
							   $scope.idModalContenedorEmpresaEdicion,
							   $scope.idModalWizardEmpresaVista,
							   $scope.idModalContenedorEmpresaVista,
							   $scope.idModalEliminarEmpresa);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
		var promesa=ClasesTipo("DEP");
		promesa.then(function(entidad){
			$scope.departamentos=entidad.clases;
		});
	});
	
	$scope.crearNuevaEmpresa=function(){
		$scope.esNuevo=true;
		$scope.empresa=new Empresa({sucursal:{},imagen:"img/icon-user-default.png"});
		$scope.abrirPopup($scope.idModalWizardEmpresaEdicion);
	}
	
	$scope.cerrarPopPupNuevaEmpresa=function(){
		$scope.cerrarPopup($scope.idModalWizardEmpresaEdicion);
	}
	
	$scope.verEmpresa=function(empresa){
		$scope.empresa=empresa;
		$scope.abrirPopup($scope.idModalWizardEmpresaVista);
	}
	
	$scope.cerrarPopPupVista=function(){
		$scope.cerrarPopup($scope.idModalWizardEmpresaVista);
	}
	
	$scope.cerrarPopPupEdicion=function(){
		$scope.cerrarPopup($scope.idModalWizardEmpresaEdicion);
	}
	
	$scope.modificarEmpresa=function(empresa){
		$scope.esNuevo=false;
		$scope.empresa=empresa;
		if(empresa.departamento){
			$scope.buscarMunicipios(empresa.id_departamento+'-'+empresa.departamento.nombre_corto);
		}
		$scope.seleccionarAplicaciones(empresa.aplicacionesEmpresa)
		$scope.abrirPopup($scope.idModalWizardEmpresaEdicion);
	}
	
	$scope.mostrarConfirmacionEliminacion=function(empresa){
		$scope.empresa=new Empresa(empresa);
		$scope.abrirPopup($scope.idModalEliminarEmpresa);
	}
	
	$scope.cerrarConfirmacionEliminacion=function(){
		$scope.cerrarPopup($scope.idModalEliminarEmpresa);
	};
	
	$scope.eliminarEmpresa=function(empresa){
		blockUI.start();
		$scope.cerrarConfirmacionEliminacion();
		empresa.$delete();
		$scope.mostrarMensaje('Eliminado exitosamente!');
		$scope.recargarItemsTabla();
		blockUI.stop();
	}
	
	$scope.buscarMunicipios=function(idDepartamento){
		var nombre_corto=idDepartamento.split('-')[1];
		var promesa=Clases(nombre_corto+"M");
		promesa.then(function(entidades){
			$scope.municipios=entidades;
		});
	}
	
	$scope.saveForm=function(empresa){
		var button=$('#siguiente').text().trim();console.log(button);
		if(button!="Siguiente"){
			blockUI.start();
			var imagenEmpresa=empresa.imagen;
			if(typeof empresa.id_departamento=="string"){
				empresa.id_departamento=empresa.id_departamento.split('-')[0];
			}
			if($scope.esNuevo && typeof empresa.sucursal.id_departamento=="string"){
				empresa.sucursal.id_departamento=empresa.sucursal.id_departamento.split('-')[0];
			}
			if(empresa.id){
				Empresa.update({ idEmpresa:empresa.id }, empresa,function(res){
					if(res.signedRequest==null){
						blockUI.stop();
						$scope.cerrarPopPupNuevaEmpresa();
						$scope.mostrarMensaje('Actualizado Exitosamente!');
						$scope.recargarItemsTabla();
					}else{
						var xhr = new XMLHttpRequest();
						xhr.open('PUT', res.signedRequest);
						xhr.onreadystatechange = () => {
							if(xhr.readyState === 4){
							  if(xhr.status === 200){
								blockUI.stop();
								$scope.cerrarPopPupNuevaEmpresa();
								$scope.mostrarMensaje('Actualizado Exitosamente!');
								$scope.recargarItemsTabla();
							  }
							  else{
								alert('Could not upload file.');
							  }
							}
						};
						
						var binary = atob(imagenEmpresa.split(',')[1]);
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
				empresa.$save(function(res){
					if(res.signedRequest==null){
						blockUI.stop();
						$scope.empresa=new Empresa({sucursal:{},imagen:"img/icon-user-default.png"});
						$scope.cerrarPopPupNuevaEmpresa();
						$scope.mostrarMensaje('Guardado Exitosamente!');
						$scope.recargarItemsTabla();
					}else{
						var xhr = new XMLHttpRequest();
						xhr.open('PUT', res.signedRequest);
						xhr.onreadystatechange = () => {
							if(xhr.readyState === 4){
							  if(xhr.status === 200){
								blockUI.stop();
								$scope.empresa=new Empresa({sucursal:{},imagen:"img/icon-user-default.png"});
								$scope.cerrarPopPupNuevaEmpresa();
								$scope.mostrarMensaje('Guardado Exitosamente!');
								$scope.recargarItemsTabla();
							  }
							  else{
								alert('Could not upload file.');
							  }
							}
						};
						
						var binary = atob(imagenEmpresa.split(',')[1]);
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
					$scope.cerrarPopPupNuevaEmpresa();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					$scope.recargarItemsTabla();
				});
			}
		}
	}
	
	$scope.obtenerEmpresas=function(idEmpresa){
		blockUI.start();
		if(idEmpresa==null){
			idEmpresa=0;
		}
		var promesa=Empresas(idEmpresa);
		promesa.then(function(empresas){
			$scope.empresas=empresas;
			blockUI.stop();
		});
	}
	$scope.obtenerAplicaciones = function(){
		var promesa = ListaAplicacionesSistema()
		promesa.then(function(datos){			
			$scope.llenarAplicaciones(datos)
		})
	}
	$scope.llenarAplicaciones = function (aplicaciones) {
		$scope.aplicacionesSistema = [];
		for (var i = 0; i < aplicaciones.length; i++) {
			var aplicacion = {
				name: aplicaciones[i].titulo,
				maker: "",
				ticked: false,
				id: aplicaciones[i].id
			}
			$scope.aplicacionesSistema.push(aplicacion);
		}
	}
	$scope.seleccionarAplicaciones = function (aplicacionesEmpresa) {
		for (var i = 0; i < $scope.aplicacionesSistema.length; i++) {
			for (var j = 0; j < aplicacionesEmpresa.length; j++) {
				if ($scope.aplicacionesSistema[i].id == aplicacionesEmpresa[j].id_aplicacion) {
					$scope.aplicacionesSistema[i].ticked = true;
				}
			}
		}
	}

	$scope.$on('$routeChangeStart', function(next, current) { 
		$scope.eliminarPopup($scope.idModalWizardEmpresaEdicion);
		$scope.eliminarPopup($scope.idModalWizardEmpresaVista);
		$scope.eliminarPopup($scope.idModalEliminarEmpresa);
	});
	
	$scope.inicio();
});



