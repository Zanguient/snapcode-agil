angular.module('agil.controladores')

.controller('ControladoresRCIVA', function($scope,$localStorage,$location,$templateCache,$route,blockUI){
	$scope.$on('$viewContentLoaded', function () {
        
        $scope.idModalNuevoPlanillaRCIVA = 'dialog-nueva-planilla-rc-iva';
        $scope.idModalFormulario110 = 'dialog-formulario-110';
        $scope.idModalFormularioGeneral110 = 'dialog-formulario-general-110';
        $scope.idModalArchivosTXT = 'dialog-archivos-txt';
        
        ejecutarScriptsPlanillaRCIVA($scope.idModalNuevoPlanillaRCIVA, $scope.idModalFormulario110, $scope.idModalFormularioGeneral110, 
            $scope.idModalArchivosTXT);
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalNuevoPlanillaRCIVA, $scope.idModalFormulario110,$scope.idModalFormularioGeneral110, 
            $scope.idModalArchivosTXT);
    });

    $scope.abrirDialogNuevoPlanillaRCIVA= function () {
        $scope.abrirPopup($scope.idModalNuevoPlanillaRCIVA);
    }
    $scope.cerrarDialogNuevoPlanillaRCIVA=function () {
        $scope.cerrarPopup($scope.idModalNuevoPlanillaRCIVA); 
    }
    $scope.abrirDialogFormulario110= function () {
        $scope.abrirPopup($scope.idModalFormulario110);
    }
    $scope.cerrarDialogFormulario110=function () {
        $scope.cerrarPopup($scope.idModalFormulario110); 
    }
    $scope.abrirDialogFormularioGeneral110= function () {
        $scope.abrirPopup($scope.idModalFormularioGeneral110);
    }
    $scope.cerrarDialogFormularioGeneral110=function () {
        $scope.cerrarPopup($scope.idModalFormularioGeneral110); 
    }
    $scope.abrirDialogArchivosTXT= function () {
        $scope.abrirPopup($scope.idModalArchivosTXT);
    }
    $scope.cerrarDialogArchivosTXT=function () {
        $scope.cerrarPopup($scope.idModalArchivosTXT); 
    }
    

});