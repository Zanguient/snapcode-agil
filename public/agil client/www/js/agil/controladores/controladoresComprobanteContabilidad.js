angular.module('agil.controladores')
	.controller('ControladorComprobanteContabilidad',['$scope', 'blockUI', '$localStorage', '$location', '$templateCache', '$window', 'CuentasPaginador', 'ContabilidadCuenta', 'CuentasClasificaciones', 'ClasesTipo', 'lasClasificaciones', 'losSaldos', 'losMovimientos', 'losTiposDeCuentas', 'lasOperacionesCalculos', 'CuentaContabilidad', function ($scope, blockUI, $localStorage, $location, $templateCache, $window, CuentasPaginador, ContabilidadCuenta, CuentasClasificaciones, ClasesTipo, lasClasificaciones, losSaldos, losMovimientos, losTiposDeCuentas, lasOperacionesCalculos, CuentaContabilidad) {

		$scope.usuario = JSON.parse($localStorage.usuario);
		// $scope.idModalWizardCuentaEdicion = "modal-wizard-cuenta-edicion"
		// $scope.idModalWizardContainerCuentaEdicion = "modal-wizard-container-cuenta-edicion"
		// $scope.idModalWizardCuentaVer = "modal-wizard-cuenta-ver"
		// $scope.idModalWizardContainerCuentaVer = "modal-wizard-container-cuenta-ver"
		// $scope.idModalWizardClasificacionNueva = "modal-wizard-agregar-clasificacion-cuenta"
		// $scope.idModalWizardClasificacionVer = "modal-wizard-ver-clasificacion"
		// $scope.idModalWizardContainerClasificacionNueva = "modal-wizard-container-agregar-clasificacion"
		// $scope.idModalEliminarCuenta = "dialog-eliminar-cuenta"

		$scope.inicio = function () {
			// $scope.obtenerCuentas();
			// $scope.obtenerTiposCuenta();
			// $scope.obtenerClasificacionCuenta();
			// $scope.obtenerClasificacionSaldos();
			// $scope.obtenerClasificacionMovimientos();
			// $scope.obtenerOperacionesCalculo();
			$scope.sucursalesUsuario = "";
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
				if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
					$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
				}
			}
			// $scope.filtro = { empresa: $scope.usuario.id_empresa, clasificacion: 0, tipo_cuenta: 0, monto: 0 };
		}
		$scope.obtenerComprobantes = function () {
			$scope.comprobantes = ListaComprobanteContabilidad($scope.usuario.id)
			
		}
	}])