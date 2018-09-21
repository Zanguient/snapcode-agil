angular.module('agil.controladores')

    .controller('ControladorGtmEstibaje', ['$scope', '$localStorage', '$location', '$templateCache', '$route', 'blockUI', 'Paginator', 'FieldViewer',
        'GtmEstibaje','GtmEstibajes','GtmEstibajeItem',function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmEstibaje,GtmEstibajes,GtmEstibajeItem) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalWizardEstibajeEdicion = 'modal-wizard-estibaje-edicion';
        $scope.idModalContenedorWizard="modal-wizard-container-estibaje-edicion";
        $scope.idModalEliminarEstibaje = 'dialog-eliminar-estibaje';
        $scope.idModalWizardEstibajeVista = 'modal-wizard-estibaje-vista';

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptEstibaje($scope.idModalWizardEstibajeEdicion,$scope.idModalContenedorWizard, $scope.idModalEliminarEstibaje, $scope.idModalWizardEstibajeVista);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerEstibajes();
        }

        $scope.obtenerEstibajes=function(){
            var promesa=GtmEstibajes($scope.usuario.id_empresa);
            promesa.then(function(estibajes){
                $scope.estibajes=estibajes;
            });
        }

        $scope.crearNuevoEstibaje = function (datos,ver) {
            $scope.estibaje=new GtmEstibaje({id_empresa:$scope.usuario.id_empresa});
            $scope.abrirPopup($scope.idModalWizardEstibajeEdicion);
        }

        $scope.cerrarPopPupEdicion = function () {
            $scope.cerrarPopup($scope.idModalWizardEstibajeEdicion);
        }

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup($scope.idModalWizardEstibajeVista);
        }

        $scope.modificarEstibaje=function(estibaje,ver){
            $scope.estibaje=estibaje;
            $scope.estibaje.verDatos=(ver)?true:false
            $scope.abrirPopup($scope.idModalWizardEstibajeEdicion);
        }

        $scope.removerEstibaje=function(estibaje){
            estibaje.eliminado=true;
            GtmEstibajeItem.update({ id_estibaje: estibaje.id }, estibaje, function (res) {
                $scope.obtenerEstibajes();
                blockUI.stop();
                $scope.mostrarMensaje(res.mensaje);
            });
        }
        $scope.guardarEstadoEstibaje=function(estibaje){
            GtmEstibajeItem.update({ id_estibaje: estibaje.id }, estibaje, function (res) {
                $scope.obtenerEstibajes();
                blockUI.stop();
              
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            });
        }
        $scope.guardarEstibaje=function(estibaje){
            var button = $('#siguiente').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				if (estibaje.id) {
					GtmEstibajeItem.update({ id_estibaje: estibaje.id }, estibaje, function (res) {
                        $scope.obtenerEstibajes();
                        blockUI.stop();
						$scope.cerrarPopPupEdicion();
                        $scope.mostrarMensaje(res.mensaje);
                        $scope.recargarItemsTabla();
					});
				} else {
					estibaje.$save(function (res) {
                        $scope.obtenerEstibajes();
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
                        $scope.mostrarMensaje("Estibaje creado satisfactoriamente!");
                        $scope.recargarItemsTabla();
					}, function (error) {
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
						$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					});
				}
			}
        }

        $scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardEstibajeEdicion);
		});


        $scope.inicio();
    }]);



