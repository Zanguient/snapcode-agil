angular.module('agil.controladores')

    .controller('ControladorGtmDespacho', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmDespachos) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalWizardEstibajeEdicion = 'modal-wizard-estibaje-edicion';
        $scope.idModalContenedorWizard="modal-wizard-container-estibaje-edicion";
        $scope.idModalEliminarEstibaje = 'dialog-eliminar-estibaje';
        $scope.idModalWizardEstibajeVista = 'modal-wizard-estibaje-vista';

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            //ejecutarScriptEstibaje($scope.idModalWizardEstibajeEdicion,$scope.idModalContenedorWizard, $scope.idModalEliminarEstibaje, $scope.idModalWizardEstibajeVista);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerDespachados();
        }

        $scope.obtenerDespachados=function(){
            var promesa=GtmDespachos($scope.usuario.id_empresa);
            promesa.then(function(despachos){
                $scope.despachos=despachos;
            });
        }

        $scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardEstibajeEdicion);
		});


        $scope.inicio();
    });



