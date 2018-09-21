angular.module('agil.controladores')

.controller('ControladoresPlanillaRetroactivos', ['$scope','$localStorage','$location','$templateCache','$route','blockUI',function($scope,$localStorage,$location,$templateCache,$route,blockUI){
	$scope.$on('$viewContentLoaded', function () {
        
        $scope.idModalNuevoPlanillaRetroactivo = 'dialog-nueva-planilla-retroactivo';
        
        ejecutarScriptsPlanillaRetroActivos($scope.idModalNuevoPlanillaRetroactivo);
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalNuevoPlanillaRetroactivo);
    });

    $scope.abrirDialogNuevoPlanillaRetroactivo= function () {
        $scope.abrirPopup($scope.idModalNuevoPlanillaRetroactivo);
    }
    $scope.cerrarDialogNuevoPlanillaRetroactivo=function () {
        $scope.cerrarPopup($scope.idModalNuevoPlanillaRetroactivo); 
    }
   

}]);