angular.module('agil.controladores')

	.controller('ControladorBalaceComprobacionSumaSaldo', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipoEmpresa, ClasesTipo, ObtenerConfiguracionImpresion, CuentasContabilidadEEFF, ObtenerGestionesEEFF) {


		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
            $scope.obtenerGestiones();
        }
        
        $scope.obtenerGestiones=function(){
            blockUI.start();
            var promesa=ClasesTipo("GTN");
            promesa.then(function(entidad){
                $scope.gestiones=entidad.clases;
                blockUI.stop();
            });
        }
    
        


		$scope.$on('$viewContentLoaded', function () {
			// resaltarPestaña($location.path().substring(1));

			// $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			// blockUI.stop();
		});

		
		$scope.$on('$routeChangeStart', function (next, current) {
			/* 	$scope.eliminarPopup(); */

		});

		$scope.inicio();
	});



