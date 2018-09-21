angular.module('agil.controladores')

    .controller('ControladorGtmTransportista', ['$scope', '$localStorage', '$location', '$templateCache', '$route', 'blockUI', 'Paginator', 'FieldViewer',
        'GtmTransportista', 'GtmTransportistas', 'GtmTransportistaItem', 'GtmTransportistasEmpresa',function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmTransportista, GtmTransportistas, GtmTransportistaItem, GtmTransportistasEmpresa) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalWizardTransportistaEdicion = 'modal-wizard-transportista-edicion';
        $scope.idModalContenedorWizard = "modal-wizard-container-transportista-edicion";

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptTransportista($scope.idModalWizardTransportistaEdicion, $scope.idModalContenedorWizard);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerTransportistas();
        }

        $scope.obtenerTransportistas = function () {
            var promesa = GtmTransportistas($scope.usuario.id_empresa);
            promesa.then(function (transportistas) {
                $scope.transportistas = transportistas;
            });
        }

        $scope.crearNuevoTransportista = function () {
            $scope.transportista = new GtmTransportista({ id_empresa: $scope.usuario.id_empresa, persona: {} });
            $scope.abrirPopup($scope.idModalWizardTransportistaEdicion);
        }

        $scope.cerrarPopPupEdicion = function () {
            $scope.cerrarPopup($scope.idModalWizardTransportistaEdicion);
        }

        $scope.modificarTransportista = function (transportista) {
            $scope.transportista = transportista;
            $scope.abrirPopup($scope.idModalWizardTransportistaEdicion);
        }

        $scope.removerTransportista = function (transportista) {
            transportista.eliminado = true;
            GtmTransportistaItem.update({ id_transportista: transportista.id }, transportista, function (res) {
                $scope.obtenerTransportistas();
                blockUI.stop();
                $scope.mostrarMensaje(res.mensaje);
            });
        }
        $scope.guardarEstadoTransportista = function (transportista) {
            GtmTransportistaItem.update({ id_transportista: transportista.id }, transportista, function (res) {
                $scope.obtenerTransportistas();
                blockUI.stop();
     
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            });
        }
        $scope.guardarTransportista = function (transportista) {
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

        $scope.subirExcelTransportista = function (event) {
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
                    var transportistas = [];
                    do {
                        var transportista = {};
                        transportista.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        transportista.costo_transporte = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? parseFloat(worksheet['B' + row].v.toString()) : null;
                        transportista.nombre_completo = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                        transportista.vehiculo = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
                        transportista.capacidad = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? parseFloat(worksheet['E' + row].v.toString()) : null;
                        transportista.direccion = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
                        transportista.telefono = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
                        transportista.observacion = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? worksheet['H' + row].v.toString() : null;
                        transportista.nit = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? parseFloat(worksheet['I' + row].v.toString()) : null;
                        transportistas.push(transportista);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    $scope.guardarTransportistas(transportistas);

                    blockUI.stop();
                };
                reader.readAsBinaryString(f);
            }
        }
        $scope.guardarTransportistas = function (transportistas) {
            var promesa = GtmTransportistasEmpresa($scope.usuario.id_empresa, transportistas);
            promesa.then(function (res) {
                blockUI.stop();
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            });
        }
        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalWizardTransportistaEdicion);
        });


        $scope.inicio();
    }]);



