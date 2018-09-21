angular.module('agil.controladores')

    .controller('ControladorGtmGrupoEstibaje', ['$scope', '$localStorage', '$location', '$templateCache', '$route', 'blockUI', 'Paginator', 'FieldViewer',
        'GtmGrupoEstibaje','GtmGrupoEstibajes','GtmGrupoEstibajeItem',function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmGrupoEstibaje,GtmGrupoEstibajes,GtmGrupoEstibajeItem) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalWizardGrupoEstibajeEdicion = 'modal-wizard-grupo-estibaje-edicion';
        $scope.idModalContenedorWizard="modal-wizard-container-grupo-estibaje-edicion";

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptGrupoEstibaje($scope.idModalWizardGrupoEstibajeEdicion,$scope.idModalContenedorWizard);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerGrupoEstibajes();
        }

        $scope.obtenerGrupoEstibajes=function(){
            var promesa=GtmGrupoEstibajes($scope.usuario.id_empresa);
            promesa.then(function(grupo_estibajes){
                $scope.grupo_estibajes=grupo_estibajes;
            });
        }

        $scope.crearNuevoGrupoEstibaje = function () {
            $scope.grupo_estibaje=new GtmGrupoEstibaje({id_empresa:$scope.usuario.id_empresa});
            $scope.abrirPopup($scope.idModalWizardGrupoEstibajeEdicion);
        }

        $scope.cerrarPopPupEdicion = function () {
            $scope.cerrarPopup($scope.idModalWizardGrupoEstibajeEdicion);
        }

        $scope.modificarGrupoEstibaje=function(grupo_estibaje){
            $scope.grupo_estibaje=grupo_estibaje;
            $scope.abrirPopup($scope.idModalWizardGrupoEstibajeEdicion);
        }

        $scope.removerGrupoEstibaje=function(grupo_estibaje){
            grupo_estibaje.eliminado=true;
            GtmGrupoEstibajeItem.update({ id_grupo_estibaje: grupo_estibaje.id }, grupo_estibaje, function (res) {
                $scope.obtenerGrupoEstibajes();
                blockUI.stop();
                $scope.mostrarMensaje(res.mensaje);
            });
        }
        $scope.guardarEstadoGrupoEstibaje=function(grupo_estibaje){
            GtmGrupoEstibajeItem.update({ id_grupo_estibaje: grupo_estibaje.id }, grupo_estibaje, function (res) {
                $scope.obtenerGrupoEstibajes();
                blockUI.stop();
               
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            });
        }
        $scope.guardarGrupoEstibaje=function(grupo_estibaje){
            var button = $('#siguiente').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				if (grupo_estibaje.id) {
					GtmGrupoEstibajeItem.update({ id_grupo_estibaje: grupo_estibaje.id }, grupo_estibaje, function (res) {
                        $scope.obtenerGrupoEstibajes();
                        blockUI.stop();
						$scope.cerrarPopPupEdicion();
                        $scope.mostrarMensaje(res.mensaje);
                        $scope.recargarItemsTabla();
					});
				} else {
					grupo_estibaje.$save(function (res) {
                        $scope.obtenerGrupoEstibajes();
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
			$scope.eliminarPopup($scope.idModalWizardGrupoEstibajeEdicion);
		});


        $scope.inicio();
    }]);



