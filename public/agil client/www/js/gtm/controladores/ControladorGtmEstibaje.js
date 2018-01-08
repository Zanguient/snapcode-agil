angular.module('agil.controladores')

    .controller('ControladorGtmEstibaje', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalWizardEstibajeEdicion = 'modal-wizard-estibaje-edicion';
        $scope.idModalEliminarEstibaje = 'dialog-eliminar-estibaje';
        $scope.idModalWizardEstibajeVista = 'modal-wizard-estibaje-vista';


        $scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';
        /* $scope.idModalWizardComprobanteEdicion='modal-wizard-comprobante-edicion';
        $scope.idPopupQr='modal-wizard-comprobante-edicions';  
        $scope.IdModalOpcionesQr='modal-opciones-qr';
        $scope.IdModalRegistrarComprobante='modal-registrar';
        $scope.IdModalRevisarComprobante='modal-revisar';
        $scope.IdModalLibroMayor='modal-libro-contable'; */
        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptEstibaje($scope.idModalWizardEstibajeEdicion, $scope.idModalEliminarEstibaje, $scope.idModalWizardEstibajeVista);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            //$scope.obtenerColumnasAplicacion();
        });


        $scope.inicio = function () {

        }
        $scope.crearNuevoEstibaje = function () {
            // $scope.sucursal = new Sucursal({ id_empresa: usuario.id_empresa, almacenes: [], actividadesDosificaciones: [] });
            $scope.abrirPopup($scope.idModalWizardEstibajeEdicion);
        }

        $scope.cerrarPopPupEdicion = function () {
            $scope.cerrarPopup($scope.idModalWizardEstibajeEdicion);
        }

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup($scope.idModalWizardEstibajeVista);
		}

        $scope.inicio();
    });



