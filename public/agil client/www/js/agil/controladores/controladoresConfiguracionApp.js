angular.module('agil.controladores')

.controller('ControladorConfiguracionesApp',['$scope','$localStorage','$location','$templateCache','$route','blockUI',
	'ConfiguracionesApp','ConfiguracionGeneralAppDato','ClasesTipo',
	'ConfiguracionAppVendedor','ConfiguracionAppEmpresa', function($scope,$localStorage,$location,$templateCache,$route,blockUI,
											ConfiguracionesApp,ConfiguracionGeneralAppDato,ClasesTipo,
											ConfiguracionAppVendedor,ConfiguracionAppEmpresa){
	blockUI.start();
	
	$scope.idModalWizardConfiguracionEdicion='modal-wizard-configuracion-edicion';
	$scope.idModalWizardConfiguracionGeneralEdicion='modal-wizard-configuracion-general-edicion';
	$scope.idModalContenedorConfiguracionEdicion='modal-wizard-container-configuracion-edicion';
    $scope.idModalContenedorConfiguracionGeneralEdicion='modal-wizard-container-configuracion-general-edicion';
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.obtenerTiposVenta=function(){
		blockUI.start();
		var promesa=ClasesTipo("MEA");
		promesa.then(function(entidad){
			$scope.tiposVenta=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.obtenerCobros=function(){
		blockUI.start();
		var promesa=ClasesTipo("COA");
		promesa.then(function(entidad){
			$scope.cobros=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.obtenerTiposPago=function(){
		blockUI.start();
		var promesa=ClasesTipo("TPA");
		promesa.then(function(entidad){
			$scope.tiposPago=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.obtenerListadoProductos=function(){
		blockUI.start();
		var promesa=ClasesTipo("LPA");
		promesa.then(function(entidad){
			$scope.listadoProductos=entidad.clases;
			blockUI.stop();
		});
	}
	
	$scope.obtenerConfiguracionesApp=function(){
		blockUI.start();
		var promesa=ConfiguracionesApp($scope.usuario.id_empresa);
		promesa.then(function(vendedores){
			$scope.vendedores=vendedores;
			blockUI.stop();
		});
	}
	
	$scope.obtenerConfiguracionGeneralApp=function(){
		blockUI.start();
		var promesa=ConfiguracionGeneralAppDato($scope.usuario.id_empresa);
		promesa.then(function(configuracion_general){
			$scope.configuracion_general=configuracion_general;
			blockUI.stop();
		});
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalWizardConfiguracionEdicion);
	   $scope.eliminarPopup($scope.idModalWizardConfiguracionGeneralEdicion);
	});
	
	$scope.inicio=function(){
		$scope.obtenerConfiguracionesApp();
		$scope.obtenerConfiguracionGeneralApp();
		$scope.obtenerTiposVenta();
		$scope.obtenerCobros();
		$scope.obtenerTiposPago();
		$scope.obtenerListadoProductos();
		setTimeout(function() {
			ejecutarScriptsTabla('tabla-configuraciones',8);
			ejecutarScriptsTabla('tabla-configuracion-general',8);
		},2000);
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsConfiguracionApp($scope.idModalWizardConfiguracionEdicion,
											$scope.idModalContenedorConfiguracionEdicion,
											$scope.idModalWizardConfiguracionGeneralEdicion,
											$scope.idModalContenedorConfiguracionGeneralEdicion);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.cerrarPopPupEdicion=function(){
		$scope.cerrarPopup($scope.idModalWizardConfiguracionEdicion);
	}
	
	$scope.cerrarPopPupEdicionGeneral=function(){
		$scope.cerrarPopup($scope.idModalWizardConfiguracionGeneralEdicion);
	}
	
	$scope.modificarConfiguracionVendedor=function(vendedor){
		$scope.vendedor=vendedor;
		$scope.abrirPopup($scope.idModalWizardConfiguracionEdicion);
	}
	
	$scope.modificarConfiguracionGeneralApp=function(configuracion_general){
		$scope.abrirPopup($scope.idModalWizardConfiguracionGeneralEdicion);
	}
	
	$scope.guardarConfiguracion=function(vendedor){
		var button=$('#siguiente').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			ConfiguracionAppVendedor.update({ id_configuracion:vendedor.configuracionVendedorApp.id }, vendedor.configuracionVendedorApp,function(res){
				blockUI.stop();
				$scope.cerrarPopPupEdicion();
				$scope.mostrarMensaje(res.mensaje);
				$scope.recargarItemsTabla();
			});
		}
	}
	
	$scope.guardarConfiguracionGeneral=function(configuracion_general){
		var button=$('#siguiente-g').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			ConfiguracionAppEmpresa.update({ id_configuracion:configuracion_general.id }, configuracion_general,function(res){
				blockUI.stop();
				$scope.cerrarPopPupEdicionGeneral();
				$scope.mostrarMensaje(res.mensaje);
				$scope.recargarItemsTabla();
			});
		}
	}
	
	$scope.inicio();
}]);



