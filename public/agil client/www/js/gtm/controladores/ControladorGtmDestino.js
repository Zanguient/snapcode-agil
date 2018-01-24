angular.module('agil.controladores')

    .controller('ControladorGtmDestino', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmDestino,GtmDestinos,GtmDestinoItem,GtmDestinosEmpresa) {

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

        $scope.subirExcelDestinos =function (event) {
            var files = event.target.files;
			var i, f;
			for (i = 0, f = files[i]; i != files.length; ++i) {
				var reader = new FileReader();
				var name = f.name;
				reader.onload = function (e) {
					blockUI.start();
					var data = e.target.result;

					var workbook = XLSX.read(data, { type: 'binary' });
					var first_sheet_name = workbook.SheetNames[0];
					var row = 2, i = 0;
					var worksheet = workbook.Sheets[first_sheet_name];
					var destinos = [];
					do {
						var destino = {};
						destino.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
						destino.destino = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
						destino.direccion = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;						
						destinos.push(destino);
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
                    $scope.guardarDestinos(destinos);
                   
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
        }
        $scope.guardarDestinos = function (destinos) {
			var promesa = GtmDestinosEmpresa($scope.usuario.id_empresa,destinos );
			promesa.then(function (res) {
				blockUI.stop();
				$scope.mostrarMensaje(res.mensaje);
				$scope.recargarItemsTabla();            
			});
		}
       
        $scope.inicio();
    });



