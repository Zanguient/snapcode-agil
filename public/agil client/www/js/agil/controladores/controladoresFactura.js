angular.module('agil.controladores')

	.controller('ControladorFacturas', ['$scope', '$localStorage', '$location', '$templateCache', '$route', 'blockUI',
		'ConfiguracionesFactura', 'ConfiguracionGeneralFacturaDato', 'ClasesTipo',
		'ConfiguracionFacturaSucursal', 'ConfiguracionFacturaEmpresa', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ConfiguracionesFactura, ConfiguracionGeneralFacturaDato, ClasesTipo,
		ConfiguracionFacturaSucursal, ConfiguracionFacturaEmpresa) {
		blockUI.start();

		$scope.idModalWizardConfiguracionEdicion = 'modal-wizard-configuracion-edicion';
		$scope.idModalWizardConfiguracionGeneralEdicion = 'modal-wizard-configuracion-general-edicion';
		$scope.idModalContenedorConfiguracionEdicion = 'modal-wizard-container-configuracion-edicion';
		$scope.idModalContenedorConfiguracionGeneralEdicion = 'modal-wizard-container-configuracion-general-edicion';

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.obtenerImpresionesFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("IMPFACT");
			promesa.then(function (entidad) {
				$scope.impresionesFactura = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerTiposFacturacion = function () {
			blockUI.start();
			var promesa = ClasesTipo("TIPOFACT");
			promesa.then(function (entidad) {
				$scope.tiposFacturacion = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerTamanosPapelFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("TAMPAPFACT");
			promesa.then(function (entidad) {
				$scope.tamanosPapelFactura = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerTitulosFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("TITFACT");
			promesa.then(function (entidad) {
				$scope.titulosFactura = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerSubtitulosFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("SUBTITFACT");
			promesa.then(function (entidad) {
				$scope.subTitulosFactura = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerPiesFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("PIÉFACT");
			promesa.then(function (entidad) {
				$scope.piesFactura = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerFormatoFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("FORM_IMP_FAC");
			promesa.then(function (entidad) {
				$scope.formatosFactura = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerTipoConfigFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("CONF_FORM");
			promesa.then(function (entidad) {
				$scope.tiposConfiguraciones = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerFormatoFacturaColor = function () {
			blockUI.start();
			var promesa = ClasesTipo("FORM_IMP_FAC_COL");
			promesa.then(function (entidad) {
				$scope.formatosFacturaColor = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerConfiguracionesFactura = function () {
			blockUI.start();
			var promesa = ConfiguracionesFactura($scope.usuario.id_empresa);
			promesa.then(function (sucursales) {
				$scope.sucursales = sucursales;
				blockUI.stop();
			});
		}

		$scope.obtenerConfiguracionGeneralFactura = function () {
			blockUI.start();
			var promesa = ConfiguracionGeneralFacturaDato($scope.usuario.id_empresa);
			promesa.then(function (configuracion_general) {
				$scope.configuracion_general = configuracion_general;
				console.log($scope.configuracion_general)
				blockUI.stop();
			});
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardConfiguracionEdicion);
			$scope.eliminarPopup($scope.idModalWizardConfiguracionGeneralEdicion);
		});

		$scope.inicio = function () {
			$scope.obtenerConfiguracionesFactura();
			$scope.obtenerConfiguracionGeneralFactura();
			$scope.obtenerImpresionesFactura();
			$scope.obtenerTiposFacturacion();
			$scope.obtenerTamanosPapelFactura();
			$scope.obtenerTitulosFactura();
			$scope.obtenerSubtitulosFactura();
			$scope.obtenerPiesFactura();
			$scope.obtenerFormatoFactura();
			$scope.obtenerFormatoFacturaColor();
			$scope.obtenerTipoConfigFactura();
		
			$scope.coloresNotaTraspaso = false;
			$scope.coloresNotaVenta = false;
			$scope.coloresServicio = false;
			$scope.coloresFacturacion = false;
			$scope.coloresNotaBaja = false;
			$scope.coloresFacturacionSucursal = false;

			setTimeout(function () {
				ejecutarScriptsTabla('tabla-configuraciones', 7);
				ejecutarScriptsTabla('tabla-configuracion-general', 7);
			}, 2000);
		}

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsConfiguracionFactura($scope.idModalWizardConfiguracionEdicion,
				$scope.idModalContenedorConfiguracionEdicion,
				$scope.idModalWizardConfiguracionGeneralEdicion,
				$scope.idModalContenedorConfiguracionGeneralEdicion);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});

		$scope.cerrarPopPupEdicion = function () {
			$scope.cerrarPopup($scope.idModalWizardConfiguracionEdicion);
		}

		$scope.cerrarPopPupEdicionGeneral = function () {
			$scope.cerrarPopup($scope.idModalWizardConfiguracionGeneralEdicion);
		}

		$scope.modificarConfiguracionSucursal = function (sucursal) {
			$scope.sucursal = sucursal;
			$scope.abrirPopup($scope.idModalWizardConfiguracionEdicion);
		}

		$scope.modificarConfiguracionGeneralFactura = function (configuracion_general) {
			$scope.abrirPopup($scope.idModalWizardConfiguracionGeneralEdicion);
		}

		$scope.guardarConfiguracion = function (sucursal) {
			var button = $('#siguiente').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				ConfiguracionFacturaSucursal.update({ id_configuracion: sucursal.configuracionFactura.id }, sucursal, function (res) {
					blockUI.stop();
					$scope.cerrarPopPupEdicion();
					$scope.mostrarMensaje(res.mensaje);
					$scope.recargarItemsTabla();
				});
			}
		}

		$scope.guardarConfiguracionGeneral = function (configuracion_general) {
			console.log($('#siguiente-g').text().trim());
			var button = $('#siguiente-g').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				ConfiguracionFacturaEmpresa.update({ id_configuracion: configuracion_general.id }, configuracion_general, function (res) {
					blockUI.stop();
					$scope.cerrarPopPupEdicionGeneral();
					$scope.mostrarMensaje(res.mensaje);
					$scope.recargarItemsTabla();
				});
			}
		}

		$scope.mostrarColoresFacturacionSucursal = function(value){
			if (value == true) {
				$scope.coloresFacturacionSucursal = false;
			}else{
				$scope.coloresFacturacionSucursal = true;
			}
		}

		$scope.mostrarColoresNotaBaja = function(value){
			if (value == true) {
				$scope.coloresNotaBaja = false;
			}else{
				$scope.coloresNotaBaja = true;
			}
		}

		$scope.mostrarColoresNotaVenta = function(value){
			if (value == true) {
				$scope.coloresNotaVenta = false;
			}else{
				$scope.coloresNotaVenta = true;
			}
		}
		
		$scope.mostrarColoresFacturacion = function(value){
			if (value == true) {
				$scope.coloresFacturacion = false;
			}else{
				$scope.coloresFacturacion = true;
			}
		}

		$scope.mostrarColoresServicio = function(value){
			if (value == true) {
				$scope.coloresServicio = false;
			}else{
				$scope.coloresServicio = true;
			}
		}

		$scope.mostrarColoresNotaTraspaso = function(value){
			if (value == true) {
				$scope.coloresNotaTraspaso = false;
			}else{
				$scope.coloresNotaTraspaso = true;
			}
		}

		$scope.inicio();
	}]);



