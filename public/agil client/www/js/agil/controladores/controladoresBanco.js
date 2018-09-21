angular.module('agil.controladores')

	.controller('ControladorBancos',['$scope', '$localStorage', '$location', '$templateCache', '$route', 'blockUI',
		'ClasesTipo', 'Clases', 'Banco', 'ListaBancos', 'BancoDatos', 'BancoPaginador', '$window', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipo, Clases, Banco, ListaBancos, BancoDatos, BancoPaginador, $window) {
		blockUI.start();

		$scope.idModalWizardBancoEdicion = 'modal-wizard-banco';
		$scope.idModalWizardBancoVista = 'modal-wizard-banco-vista';
		$scope.idModalEliminarBanco = 'dialog-eliminar-banco';
		$scope.idModalContenedorBancoEdicion = 'modal-wizard-container-banco-edicion';
		$scope.idModalContenedorBancoVista = 'modal-wizard-container-banco-vista';


		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			//$scope.obtenerBancos($scope.usuario.id_empresa);
			// setTimeout(function() {
			// 	ejecutarScriptsTabla('tabla-bancos',4);
			// },2000);
			$scope.paginadorBancos($scope.usuario.id_empresa)
		}

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsBanco($scope.idModalWizardBancoEdicion,
				$scope.idModalContenedorBancoEdicion,
				$scope.idModalWizardBancoVista,
				$scope.idModalContenedorBancoVista,
				$scope.idModalEliminarBanco);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			var promesa = ClasesTipo("TCB");
			promesa.then(function (entidad) {
				$scope.tiposCuenta = entidad.clases;
				blockUI.stop();
			});
			promesa = ClasesTipo("TM");
			promesa.then(function (entidad) {
				$scope.tiposMoneda = entidad.clases;
				blockUI.stop();
			});
		});

		$scope.crearNuevoBanco = function () {
			$scope.esNuevo = true;
			$scope.banco = new Banco({ id_empresa: $scope.usuario.id_empresa });
			$scope.abrirPopup($scope.idModalWizardBancoEdicion);
		}

		$scope.cerrarPopPupNuevoBanco = function () {
			$scope.cerrarPopup($scope.idModalWizardBancoEdicion);
		}

		$scope.verBanco = function (banco) {
			$scope.banco = banco;
			$scope.abrirPopup($scope.idModalWizardBancoVista);
		}

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup($scope.idModalWizardBancoVista);
		}

		$scope.cerrarPopPupEdicion = function () {
			$scope.cerrarPopup($scope.idModalWizardBancoEdicion);
		}

		$scope.modificarBanco = function (banco) {
			$scope.banco = banco;
			$scope.abrirPopup($scope.idModalWizardBancoEdicion);
		}

		$scope.mostrarConfirmacionEliminacion = function (banco) {
			$scope.banco = new Banco(banco);
			$scope.abrirPopup($scope.idModalEliminarBanco);
		}

		$scope.cerrarConfirmacionEliminacion = function () {
			$scope.cerrarPopup($scope.idModalEliminarBanco);
		};

		$scope.eliminarBanco = function (banco) {
			blockUI.start();
			$scope.cerrarConfirmacionEliminacion();
			banco.$delete();
			$scope.mostrarMensaje('Eliminado exitosamente!');
			$scope.recargarItemsTabla();
			blockUI.stop();
		}

		$scope.saveForm = function (banco) {
			var button = $('#siguiente').text().trim(); console.log(button);
			if (button != "Siguiente") {
				blockUI.start();
				if (banco.id) {
					BancoDatos.update({ id_banco: banco.id }, banco, function (res) {
						$scope.cerrarPopPupNuevoBanco();
						$scope.mostrarMensaje('Actualizado Exitosamente!');
						$scope.recargarItemsTabla();
					});
				} else {
					banco.$save(function (res) {
						blockUI.stop();
						$scope.banco = new Banco();
						$scope.cerrarPopPupNuevoBanco();
						$scope.mostrarMensaje('Guardado Exitosamente!');
						$scope.recargarItemsTabla();
					}, function (error) {
						blockUI.stop();
						$scope.cerrarPopPupNuevoBanco();
						$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
						$scope.recargarItemsTabla();
					});
				}
			}
		}

		$scope.obtenerBancos = function (idEmpresa) {
			blockUI.start();
			var promesa = ListaBancos(idEmpresa);
			promesa.then(function (bancos) {
				$scope.bancos = bancos;
				blockUI.stop();
			});
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardBancoEdicion);
			$scope.eliminarPopup($scope.idModalWizardBancoVista);
			$scope.eliminarPopup($scope.idModalEliminarBanco);
		});
		////start paginador
		$scope.paginadorBancos = function () {
			$scope.abs = $window.Math.abs;
			$scope.itemsPorPagina = 10;
			$scope.buscarBancos(1, $scope.itemsPorPagina, "");
		}

		$scope.verificarPulso = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				$scope.buscarBancos(1, $scope.itemsPorPagina, textoBusqueda);
			}
		}
		$scope.buscarBanco = function (query) {
			if (query != "" && query != undefined) {
				var promesa = BancoPaginador($scope.usuario.id_empresa, query);
				return promesa;
			}

		}

		$scope.buscarBancos = function (pagina, itemsPagina, texto) {
			blockUI.start();
			$scope.itemsPorPagina = itemsPagina;
			if (texto == "" || texto == null) {
				texto = 0;
			} else {
				$scope.textoBusqueda = texto;
			}
			$scope.paginaActual = pagina;
			var promesa = BancoPaginador($scope.usuario.id_empresa, pagina, itemsPagina, texto);
			promesa.then(function (dato) {
				$scope.paginas = [];
				for (var i = 1; i <= dato.paginas; i++) {
					$scope.paginas.push(i);
				}
				$scope.bancos = dato.bancos;
				// console.log(dato)
				blockUI.stop();
			});
		}
		$scope.inicio();
	}]);



