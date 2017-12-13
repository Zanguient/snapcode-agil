angular.module('agil.controladores')

.controller('ControladorConceptos', function($scope,$location,$localStorage,$templateCache,$route,blockUI,Tipos,TiposEmpresa,ListaTiposEmpresa){
	
	blockUI.start();
	
	$scope.usuarioSesion=JSON.parse($localStorage.usuario);
	$scope.idModalWizardConceptoEdicion='modal-wizard-concepto-edicion';
	$scope.idModalContenedorConceptoEdicion='modal-wizard-container-concepto-edicion';
	
	
	$scope.inicio=function(){
		$scope.obtenerTipos();
		setTimeout(function() {
			ejecutarScriptsTabla('tabla-conceptos',2);
		},2000);
	}
	
	$scope.obtenerTipos=function(){
		blockUI.start();
		var idEmpresa=$scope.usuarioSesion.id_empresa?$scope.usuarioSesion.id_empresa:0;
		var promesa=ListaTiposEmpresa(idEmpresa);
		promesa.then(function(tipos){
			$scope.tipos=tipos;
			blockUI.stop();
		});
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsConcepto($scope.idModalWizardConceptoEdicion,$scope.idModalContenedorConceptoEdicion);
		//$scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.crearNuevoConcepto=function(){
		$scope.tipo=new TiposEmpresa({clases:[]});
		$scope.abrirPopup($scope.idModalWizardConceptoEdicion);
	}
	
	$scope.cerrarPopPupNuevo=function(){
		$scope.cerrarPopup($scope.idModalWizardConceptoEdicion);
	}
	
	$scope.agregarClase=function(clase){
		if(clase.nombre && clase.nombre_corto){
			if(!clase.id){
				$scope.tipo.clases.push(clase);
			}
			$scope.clase={}
		}
	}
	
	$scope.modificarClase=function(clase){
		$scope.clase=clase;
	}
	
	$scope.removerClase=function(clase){
		clase.eliminado=true;
	}
	
	$scope.modificarConcepto=function(tipo){
		$scope.tipo=tipo;
		$scope.abrirPopup($scope.idModalWizardConceptoEdicion);
	}
	
	$scope.saveForm=function(tipo){
		var button=$('#siguiente').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			if(tipo.id){
				Tipos.update({ id_tipo:tipo.id }, tipo,function(res){
					blockUI.stop();
					$scope.cerrarPopPupNuevo();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.recargarItemsTabla();
				});
			}else{
				tipo.$save(function(tipo){
					blockUI.stop();
					$scope.cerrarPopPupNuevo();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.recargarItemsTabla();
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupNuevo();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					$scope.recargarItemsTabla();
				});
			}
		}
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalWizardConceptoEdicion);
	});
	
	$scope.inicio();
});



