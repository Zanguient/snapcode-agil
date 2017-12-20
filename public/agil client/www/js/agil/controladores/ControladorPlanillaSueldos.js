angular.module('agil.controladores')

.controller('ControladorPlanillaSueldos', function($scope,$localStorage,$location,$templateCache,$route,blockUI){
	$scope.$on('$viewContentLoaded', function () {
        // resaltarPestaña($location.path().substring(1));
        $scope.idModalNuevaPlanillaSueldos = 'dialog-nueva-planilla-sueldos';
        $scope.idModalEditarPlanillaSueldo = 'dialog-editar-planilla-sueldo';
        $scope.idModalParametros = 'dialog-parametros';
        $scope.idModalTR3 = 'dialog-tr3';
        $scope.idModalHistorialTR3 = 'dialog-historial-tr3';
        
        ejecutarScriptsPlanillaSueldos($scope.idModalNuevaPlanillaSueldos, $scope.idModalEditarPlanillaSueldo, $scope.idModalParametros, 
            $scope.idModalTR3, $scope.idModalHistorialTR3);
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalNuevaPlanillaSueldos, $scope.idModalEditarPlanillaSueldo, $scope.idModalParametros, 
            $scope.idModalTR3, $scope.idModalHistorialTR3);
    });

    $scope.abrirDialogNuevaPlanillaSueldos= function () {
        $scope.abrirPopup($scope.idModalNuevaPlanillaSueldos);
    }
    $scope.cerrarDialogNuevaPlanillaSueldos=function () {
        $scope.cerrarPopup($scope.idModalNuevaPlanillaSueldos); 
    }
    $scope.abrirDialogEditarPlanillaSueldo= function () {
        $scope.sueldo = {
            'sueldoBasico': 1000,
            'horasExtras': 5
        };
       

        $scope.calcularTotalHorasRecargos();
        $scope.abrirPopup($scope.idModalEditarPlanillaSueldo);

    }
    $scope.cerrarDialogEditarPlanillaSueldo=function () {
        $scope.cerrarPopup($scope.idModalEditarPlanillaSueldo);
    }

    $scope.calcularTotalHorasRecargos=function(){
        $scope.sueldo.totalHoras= Math.round(($scope.sueldo.sueldoBasico/30/8)*2);
        $scope.sueldo.recargoNocturno= Math.round(($scope.sueldo.sueldoBasico/30/8)*1.5);    
    }
    $scope.abrirDialogParametros= function () {
        $scope.abrirPopup($scope.idModalParametros);
    }
    $scope.cerrarDialogParametros=function () {
        $scope.cerrarPopup($scope.idModalParametros); 
    }
    $scope.abrirDialogTR3= function () {
        $scope.abrirPopup($scope.idModalTR3);
    }
    $scope.cerrarDialogTR3=function () {
        $scope.cerrarPopup($scope.idModalTR3); 
    }
    $scope.abrirDialogHistorialTR3= function () {
        $scope.abrirPopup($scope.idModalHistorialTR3);
    }
    $scope.cerrarDialogHistorialTR3=function () {
        $scope.cerrarPopup($scope.idModalHistorialTR3); 
    }

    

});