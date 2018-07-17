angular.module('agil.controladores')

.controller('ControladorBalanceGeneral', function($scope,$localStorage,$location,$templateCache,$route,blockUI){
	
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		
	}

	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsBalanceGeneral();
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});

	

	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup();
	 
	});
	
	$scope.inicio();
});



