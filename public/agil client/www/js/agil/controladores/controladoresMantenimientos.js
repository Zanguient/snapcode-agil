angular.module('agil.controladores')
    .controller('ControladorMantenimientos', ['$scope', 'blockUI', '$localStorage', '$location', '$templateCache', '$route', 'Usuario','Paginator', function ($scope, blockUI, $localStorage, $location, $templateCache, $route, Usuario,Paginator) {
        
        $scope.idModalInicioMantenimiento = 'dialog-iniciar-mantenimiento';
        $scope.idModalOTNuevo = 'dialog-ot-nuevo';
        $scope.idModalFacturaServicioExterno = 'dialog-factura-servicioExterno';
        $scope.idModaRepuestosOT = 'panel-repuestos-ot';
        $scope.idModalwizardContainerOTNuevo = 'modal-wizard-ot-nuevo-container';
        $scope.$on('$viewContentLoaded', function () {
        // resaltarPestaña($location.path().substring(1));
        ejecutarScriptsMantenimientos($scope.idModalInicioMantenimiento, $scope.idModalOTNuevo, $scope.idModalwizardContainerOTNuevo, $scope.idModalFacturaServicioExterno, $scope.idModaRepuestosOT);
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalInicioMantenimiento, $scope.idModalOTNuevo, $scope.idModalFacturaServicioExterno, $scope.idModaRepuestosOT);
    });

    $scope.abrirDialogInicioMantenimiento= function () {
        $scope.abrirPopup($scope.idModalInicioMantenimiento);
    }
    $scope.cerrarPopUpInicioMantenimiento=function () {
        $scope.cerrarPopup($scope.idModalInicioMantenimiento);   
    }
    $scope.abrirDialogOTnuevo= function () {
        $scope.abrirPopup($scope.idModalOTNuevo);
    }
    $scope.cerrarOTnuevo=function () {
        $scope.cerrarPopup($scope.idModalOTNuevo);   
    }
    $scope.abrirDialogFacturaServicioExterno= function () {
        $scope.abrirPopup($scope.idModalFacturaServicioExterno);
    }
    $scope.cerrarDialogFacturaServicioExterno=function () {
        $scope.cerrarPopup($scope.idModalFacturaServicioExterno);   
    }
    $scope.abrirDialogRepuestosOT= function () {
        $scope.abrirPopup($scope.idModaRepuestosOT);
    }
    $scope.cerrarDialogRepuestosOT=function () {
        $scope.cerrarPopup($scope.idModaRepuestosOT);   
    }


}]);