angular.module('agil.controladores')

    .controller('ControladorGtmDestino', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmDestino,GtmDestinos,GtmDestinoItem) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalWizardDestinoEdicion = 'modal-wizard-destino-edicion';
        $scope.idModalContenedorWizard="modal-wizard-container-destino-edicion";

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptDestino($scope.idModalWizardDestinoEdicion,$scope.idModalContenedorWizard);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerDestinos();
        }

        $scope.obtenerDestinos=function(){
            var promesa=GtmDestinos($scope.usuario.id_empresa);
            promesa.then(function(destinos){
                $scope.destinos=destinos;
            });
        }

        $scope.crearNuevoDestino = function () {
            $scope.destino=new GtmDestino({id_empresa:$scope.usuario.id_empresa});
            $scope.abrirPopup($scope.idModalWizardDestinoEdicion);
        }

        $scope.cerrarPopPupEdicion = function () {
            $scope.cerrarPopup($scope.idModalWizardDestinoEdicion);
        }

        $scope.modificarDestino=function(destino){
            $scope.destino=destino;
            $scope.abrirPopup($scope.idModalWizardDestinoEdicion);
        }

        $scope.removerDestino=function(destino){
            destino.eliminado=true;
            GtmDestinoItem.update({ id_destino: destino.id }, destino, function (res) {
                $scope.obtenerDestinos();
                blockUI.stop();
                $scope.mostrarMensaje(res.mensaje);
            });
        }
        
        $scope.guardarDestino=function(destino){
            var button = $('#siguiente').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				if (destino.id) {
					GtmDestinoItem.update({ id_destino: destino.id }, destino, function (res) {
                        $scope.obtenerDestinos();
                        blockUI.stop();
						$scope.cerrarPopPupEdicion();
                        $scope.mostrarMensaje(res.mensaje);
                        $scope.recargarItemsTabla();
					});
				} else {
					destino.$save(function (res) {
                        $scope.obtenerDestinos();
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
                        $scope.mostrarMensaje("Destino creado satisfactoriamente!");
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
			$scope.eliminarPopup($scope.idModalWizardDestinoEdicion);
		});


        $scope.inicio();
    });



