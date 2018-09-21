angular.module('agil.controladores')

.controller('ControladorIncrementoSalarial', ['$scope','$localStorage','$location','$templateCache','$route','blockUI',function($scope,$localStorage,$location,$templateCache,$route,blockUI){
	$scope.$on('$viewContentLoaded', function () {
        // resaltarPestaña($location.path().substring(1));
        
        $scope.idModalNuevoIncrementoSalarial = 'dialog-nueva-incremento-salarial';
        
        ejecutarScriptsIncrementoSalarial($scope.idModalNuevoIncrementoSalarial);
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalNuevoIncrementoSalarial);
    });

    $scope.abrirDialogNuevoIncrementoSalarial= function () {
        $scope.abrirPopup($scope.idModalNuevoIncrementoSalarial);
    }
    $scope.cerrarDialogNuevoIncrementoSalarial=function () {
        $scope.cerrarPopup($scope.idModalNuevoIncrementoSalarial); 
    }
    

}]);