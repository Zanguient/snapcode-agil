angular.module('agil.controladores')

.controller('ControladorDosificaciones', ['$scope','$localStorage','$location','$templateCache','$route','blockUI','Dosificacion','Dosificaciones',
	'DosificacionesEmpresa','ClasesTipo',function($scope,$localStorage,$location,$templateCache,$route,blockUI,Dosificacion,Dosificaciones,
												DosificacionesEmpresa,ClasesTipo){
	
	
	$scope.idModalWizardDosificacionEdicion='modal-wizard-dosificacion-edicion';
	$scope.idModalWizardDosificacionVista='modal-wizard-dosificacion-vista';
	$scope.idModalEliminarDosificacion='dialog-eliminar-dosificacion';
	$scope.idModalContenedorDosificacionEdicion='modal-wizard-container-dosificacion-edicion';
	$scope.idModalContenedorDosificacionVista='modal-wizard-container-dosificacion-vista';
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		$scope.obtenerDosificaciones();
		$scope.obtenerPiesFactura();
		setTimeout(function() {
			ejecutarScriptsTabla('tabla-dosificaciones',6);
		},2000);
	}
	
	$scope.obtenerPiesFactura=function(){
		blockUI.start();
		var promesa=ClasesTipo("PIÉFACT");
		promesa.then(function(entidad){
			$scope.piesFactura=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.obtenerDosificaciones=function(){
		blockUI.start();
		var promesa=Dosificaciones($scope.usuario.id_empresa);
		promesa.then(function(dosificaciones){
			$scope.dosificaciones=dosificaciones;
			blockUI.stop();
		});
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsDosificacion($scope.idModalWizardDosificacionEdicion,
									$scope.idModalWizardDosificacionVista,
									$scope.idModalEliminarDosificacion,
									$scope.idModalContenedorDosificacionEdicion,
									$scope.idModalContenedorDosificacionVista);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.crearNuevaDosificacion=function(){
		var usuario=JSON.parse($localStorage.usuario);
		$scope.dosificacion=new Dosificacion({id_empresa:usuario.id_empresa});
		$scope.abrirPopup($scope.idModalWizardDosificacionEdicion);
	}
	
	$scope.verDosificacion=function(dosificacion){
		$scope.dosificacion=dosificacion;
		dosificacion.fecha_limite_emision=new Date(dosificacion.fecha_limite_emision);
		$scope.dosificacion.fechaTexto=dosificacion.fecha_limite_emision.getDate()+"/"+(dosificacion.fecha_limite_emision.getMonth()+1)+"/"+dosificacion.fecha_limite_emision.getFullYear();
		$scope.abrirPopup($scope.idModalWizardDosificacionVista);
	}
	
	$scope.cerrarPopPupVista=function(){
		$scope.cerrarPopup($scope.idModalWizardDosificacionVista);
	}
	
	$scope.cerrarPopPupEdicion=function(){
		$scope.cerrarPopup($scope.idModalWizardDosificacionEdicion);
	}
	
	$scope.modificarDosificacion=function(dosificacion){
		$scope.dosificacion=dosificacion;
		dosificacion.fecha_limite_emision=new Date(dosificacion.fecha_limite_emision);
		$scope.dosificacion.fechaTexto=dosificacion.fecha_limite_emision.getDate()+"/"+(dosificacion.fecha_limite_emision.getMonth()+1)+"/"+dosificacion.fecha_limite_emision.getFullYear();
		$scope.abrirPopup($scope.idModalWizardDosificacionEdicion);
	}
	
	$scope.mostrarConfirmacionEliminacion=function(dosificacion){
		$scope.dosificacion=new Dosificacion(dosificacion);
		$scope.abrirPopup($scope.idModalEliminarDosificacion);
	}
	
	$scope.cerrarConfirmacionEliminacion=function(){
		$scope.cerrarPopup($scope.idModalEliminarDosificacion);
	};
	
	$scope.eliminarDosificacion=function(dosificacion){
		blockUI.start();
		$scope.cerrarConfirmacionEliminacion();
		dosificacion.$delete();
		$scope.mostrarMensaje('Eliminado exitosamente!');
		$scope.recargarItemsTabla();
		blockUI.stop();
	}
	
	$scope.saveForm=function(dosificacion){
		var button=$('#siguiente').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			dosificacion.fecha_limite_emision=new Date($scope.convertirFecha(dosificacion.fechaTexto));
			if(dosificacion.id){
				Dosificacion.update({ idDosificacion:dosificacion.id }, dosificacion,function(res){
					blockUI.stop();
					$scope.cerrarPopPupEdicion();
					$scope.mostrarMensaje('Actualizado Exitosamente!');
					$scope.recargarItemsTabla();
				});
			}else{
				dosificacion.$save(function(dosificacion){
					blockUI.stop();
					$scope.dosificacion=new Dosificacion({});
					$scope.cerrarPopPupEdicion();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.recargarItemsTabla();
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupEdicion();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					$scope.recargarItemsTabla();
				});
			}
		}
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalWizardDosificacionEdicion);
	   $scope.eliminarPopup($scope.idModalWizardDosificacionVista);
	   $scope.eliminarPopup($scope.idModalEliminarDosificacion);
	});
	
	$scope.inicio();
}]);



