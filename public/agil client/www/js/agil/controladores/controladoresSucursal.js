angular.module('agil.controladores')

	.controller('ControladorSucursales', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Sucursal, Sucursales, SucursalesEmpresa, ClasesTipo, Clases, DosificacionesDisponibles,Sucursalupdate) {
		blockUI.start();

		$scope.idModalWizardSucursalCorrelativoEdicion = 'modal-wizard-sucursal-correlativo-edicion';
		$scope.idModalWizardSucursalEdicion = 'modal-wizard-sucursal-edicion';
		$scope.idModalWizardSucursalVista = 'modal-wizard-sucursal-vista';
		$scope.idModalEliminarSucursal = 'dialog-eliminar-sucursal';
		$scope.idModalContenedorSucursalEdicion = 'modal-wizard-container-sucursal-edicion';
		$scope.idModalContenedorSucursalVista = 'modal-wizard-container-sucursal-vista';

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerSucursales();
			$scope.obtenerDepartamentos();
			$scope.obtenerActividades();
			$scope.obtenerDosificaciones();
			$scope.obtenerTamanosPapelFactura()
			setTimeout(function () {
				ejecutarScriptsTabla('tabla-sucursales', 8);
			}, 2000);
		}

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsSucursal($scope.idModalWizardSucursalEdicion, $scope.idModalWizardSucursalVista,
				$scope.idModalEliminarSucursal, $scope.idModalContenedorSucursalEdicion, $scope.idModalContenedorSucursalVista,
				$scope.idModalWizardSucursalCorrelativoEdicion);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});
		$scope.obtenerTamanosPapelFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("TAMPAPFACT");
			promesa.then(function (entidad) {
				$scope.tamanosPapelFactura = entidad.clases;
				blockUI.stop();
			});
		}
		$scope.obtenerSucursales = function () {
			blockUI.start();
			var promesa = Sucursales($scope.usuario.id_empresa);
			promesa.then(function (sucursales) {
				$scope.sucursales = sucursales;
				console.log(sucursales)
				blockUI.stop();
			});
		}

		$scope.obtenerDepartamentos = function () {
			var promesa = ClasesTipo("DEP");
			promesa.then(function (entidad) {
				$scope.departamentos = entidad.clases;
			});
		}

		$scope.obtenerActividades = function () {
			var promesa = ClasesTipo("ACTCOM");
			promesa.then(function (entidad) {
				$scope.actividades = entidad.clases;
			});
		}

		$scope.obtenerDosificaciones = function () {
			var promesa = DosificacionesDisponibles($scope.usuario.id_empresa);
			promesa.then(function (dosificaciones) {
				$scope.dosificaciones = dosificaciones;
			});
		}

		$scope.buscarMunicipios = function (idDepartamento) {
			var nombre_corto = idDepartamento.split('-')[1];
			var promesa = Clases(nombre_corto + "M");
			promesa.then(function (entidades) {
				$scope.municipios = entidades;
			});
		}

		$scope.crearNuevaSucursal = function () {
			var usuario = JSON.parse($localStorage.usuario);
			$scope.sucursal = new Sucursal({ id_empresa: usuario.id_empresa, almacenes: [], actividadesDosificaciones: [] });
			$scope.abrirPopup($scope.idModalWizardSucursalEdicion);
		}

		$scope.verSucursal = function (sucursal) {
			$scope.sucursal = sucursal;
			$scope.buscarMunicipios(sucursal.id_departamento + '-' + sucursal.departamento.nombre_corto);
			$scope.abrirPopup($scope.idModalWizardSucursalVista);
		}

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup($scope.idModalWizardSucursalVista);
		}

		$scope.cerrarPopPupEdicion = function () {
			$scope.cerrarPopup($scope.idModalWizardSucursalEdicion);
		}

		$scope.cerrarPopPupEdicionCorrelativo = function () {
			$scope.cerrarPopup($scope.idModalWizardSucursalCorrelativoEdicion);
		}

		$scope.modificarSucursal = function (sucursal) {
			$scope.sucursal = sucursal;
			$scope.buscarMunicipios(sucursal.id_departamento + '-' + sucursal.departamento.nombre_corto);
			$scope.abrirPopup($scope.idModalWizardSucursalEdicion);
		}

		$scope.mostrarConfirmacionEliminacion = function (sucursal) {
			$scope.sucursal = new Sucursal(sucursal);
			$scope.abrirPopup($scope.idModalEliminarSucursal);
		}

		$scope.cerrarConfirmacionEliminacion = function () {
			$scope.cerrarPopup($scope.idModalEliminarSucursal);
		};

		$scope.eliminarSucursal = function (sucursal) {
			blockUI.start();
			$scope.cerrarConfirmacionEliminacion();
			sucursal.$delete();
			$scope.mostrarMensaje('Eliminado exitosamente!');
			$scope.recargarItemsTabla();
			blockUI.stop();
		}

		$scope.modificarCorrelativos = function (sucursal) {
			$scope.sucursal = sucursal;
			$scope.abrirPopup($scope.idModalWizardSucursalCorrelativoEdicion);
		}

		$scope.guardarCorrelativos = function (sucursal) {
			console.log(sucursal)
			Sucursalupdate.update({ idSucursal: sucursal.id }, sucursal, function (res) {
				blockUI.stop();
				$scope.cerrarPopPupEdicionCorrelativo();
				$scope.mostrarMensaje('Actualizado Exitosamente!');
				$scope.recargarItemsTabla();
			});
		}

		$scope.saveForm = function (sucursal) {
			var button = $('#siguiente').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				if (typeof sucursal.id_departamento == "string") {
					sucursal.id_departamento = sucursal.id_departamento.split('-')[0];
				}
				if (sucursal.id) {
					Sucursal.update({ idSucursal: sucursal.id }, sucursal, function (res) {
						blockUI.stop();
						$scope.recargarItemsTabla();
						$scope.cerrarPopPupEdicion();
						$scope.mostrarMensaje('Actualizado Exitosamente!');
						
					});
				} else {
					sucursal.$save(function (sucursal) {
						blockUI.stop();
						$scope.sucursal = new Sucursal({});
						$scope.cerrarPopPupEdicion();
						$scope.recargarItemsTabla();
						$scope.mostrarMensaje('Guardado Exitosamente!');
						
					}, function (error) {
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
						$scope.recargarItemsTabla();
						$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
						
					});
				}
			}
		}

		$scope.agregarAlmacen = function (almacen) {
			almacen.edit=false
			if (almacen.nombre && almacen.numero && almacen.direccion) {

				if ($scope.sucursal.almacenes.indexOf(almacen) == -1) {
					$scope.sucursal.almacenes.push(almacen);
				}

				$scope.almacen = {}
			}
		}

		$scope.modificarAlmacen = function (almacen) {
			almacen.edit=true
			$scope.almacen = almacen;
		}

		$scope.removerAlmacen = function (almacen) {
			almacen.eliminado = true;
		}

		$scope.agregarActividadDosificacion = function (actividadDosificacion) {
			if (actividadDosificacion.actividad && actividadDosificacion.dosificacion) {
				if (!actividadDosificacion.id) {
					actividadDosificacion.id_actividad = actividadDosificacion.actividad.id;
					actividadDosificacion.id_dosificacion = actividadDosificacion.dosificacion.id;
					$scope.sucursal.actividadesDosificaciones.push(actividadDosificacion);
				}
				$scope.actividadDosificacion = {}
			}
		}

		$scope.removerActividadDosificacion = function (actividadDosificacion) {
			actividadDosificacion.eliminado = true;
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardSucursalEdicion);
			$scope.eliminarPopup($scope.idModalWizardSucursalCorrelativoEdicion);
			$scope.eliminarPopup($scope.idModalWizardSucursalVista);
			$scope.eliminarPopup($scope.idModalEliminarSucursal);
		});

		$scope.inicio();
	});