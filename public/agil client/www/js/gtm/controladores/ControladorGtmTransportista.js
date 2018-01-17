angular.module('agil.controladores')

    .controller('ControladorGtmTransportista', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmTransportista,GtmTransportistas,GtmTransportistaItem) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalWizardTransportistaEdicion = 'modal-wizard-transportista-edicion';
        $scope.idModalContenedorWizard="modal-wizard-container-transportista-edicion";

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptTransportista($scope.idModalWizardTransportistaEdicion,$scope.idModalContenedorWizard);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerTransportistas();
        }

        $scope.obtenerTransportistas=function(){
            var promesa=GtmTransportistas($scope.usuario.id_empresa);
            promesa.then(function(transportistas){
                $scope.transportistas=transportistas;
            });
        }

        $scope.crearNuevoTransportista = function () {
            $scope.transportista=new GtmTransportista({id_empresa:$scope.usuario.id_empresa,persona:{}});
            $scope.abrirPopup($scope.idModalWizardTransportistaEdicion);
        }

        $scope.cerrarPopPupEdicion = function () {
            $scope.cerrarPopup($scope.idModalWizardTransportistaEdicion);
        }

        $scope.modificarTransportista=function(transportista){
            $scope.transportista=transportista;
            $scope.abrirPopup($scope.idModalWizardTransportistaEdicion);
        }

        $scope.removerTransportista=function(transportista){
            transportista.eliminado=true;
            GtmTransportistaItem.update({ id_transportista: transportista.id }, transportista, function (res) {
                $scope.obtenerTransportistas();
                blockUI.stop();
                $scope.mostrarMensaje(res.mensaje);
            });
        }
        
        $scope.guardarTransportista=function(transportista){
            var button = $('#siguiente').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				if (transportista.id) {
					GtmTransportistaItem.update({ id_transportista: transportista.id }, transportista, function (res) {
                        $scope.obtenerTransportistas();
                        blockUI.stop();
						$scope.cerrarPopPupEdicion();
                        $scope.mostrarMensaje(res.mensaje);
                        $scope.recargarItemsTabla();
					});
				} else {
					transportista.$save(function (res) {
                        $scope.obtenerTransportistas();
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
                        $scope.mostrarMensaje("Transportista creado satisfactoriamente!");
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
			$scope.eliminarPopup($scope.idModalWizardTransportistaEdicion);
		});


        $scope.inicio();
    });



