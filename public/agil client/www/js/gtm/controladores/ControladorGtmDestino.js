angular.module('agil.controladores')

    .controller('ControladorGtmDestino', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmDestino, GtmDestinos, GtmDestinoItem, GtmDestinosEmpresa, ClasesTipoEmpresa, Diccionario, Tipos, ClasesTipo,
        VerificarUsuarioEmpresa) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalWizardDestinoEdicion = 'modal-wizard-destino-edicion';
        $scope.idModalContenedorWizard = "modal-wizard-container-destino-edicion";
        $scope.idModalConceptoEdicionCorrelativos = 'dialog-conceptos-correlativos';
        $scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';



        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptDestino($scope.idModalWizardDestinoEdicion, $scope.idModalContenedorWizard, $scope.idModalConceptoEdicionCorrelativos, $scope.IdModalVerificarCuenta);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.diccionario = Diccionario
            $scope.obtenerDestinos();
        }

        $scope.obtenerDestinos = function () {
            var promesa = GtmDestinos($scope.usuario.id_empresa);
            promesa.then(function (destinos) {
                $scope.destinos = destinos;
            });
        }

        $scope.crearNuevoDestino = function () {
            $scope.obtenerCorrelativoDestino()
            $scope.steps = [{ cabeza: "cabeza-datos-destino", cuerpo: "cuerpo-datos-destino" }]
            $scope.destino = new GtmDestino({ id_empresa: $scope.usuario.id_empresa });
            $scope.abrirPopup($scope.idModalWizardDestinoEdicion);
        }

        $scope.cerrarPopPupEdicion = function () {
            $scope.cerrarPopup($scope.idModalWizardDestinoEdicion);
        }

        $scope.modificarDestino = function (destino) {
            $scope.destino = destino;
            $scope.abrirPopup($scope.idModalWizardDestinoEdicion);
        }

        $scope.removerDestino = function (destino) {
            destino.eliminado = true;
            GtmDestinoItem.update({ id_destino: destino.id }, destino, function (res) {
                $scope.obtenerDestinos();
                blockUI.stop();
                $scope.mostrarMensaje(res.mensaje);
            });
        }

        $scope.guardarDestino = function (destino) {
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
            $scope.eliminarPopup($scope.idModalConceptoEdicionCorrelativos);
            $scope.eliminarPopup($scope.IdModalVerificarCuenta);
        });

        $scope.subirExcelDestinos = function (event) {
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
                        destino.cliente_codigo = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        destino.destino = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                        destino.direccion = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
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
            var promesa = GtmDestinosEmpresa($scope.usuario.id_empresa, destinos);
            promesa.then(function (res) {
                blockUI.stop();
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            });
        }
        $scope.obtenerCorrelativoDestino = function () {
            blockUI.start();
            var promesa = ClasesTipoEmpresa("correlativo_destinos", $scope.usuario.id_empresa);
            promesa.then(function (entidad) {
                if (entidad.clases.length > 1) {
                    entidad.clases.sort(function (a, b) {
                        a.correlativo = a.nombre_corto.split('-')[0]
                        a.correlativo_maximo = a.nombre_corto.split('-')[1]
                        b.correlativo = b.nombre_corto.split('-')[0]
                        b.correlativo_maximo = b.nombre_corto.split('-')[1]
                        return a.correlativo - b.correlativo
                    })
                } else if (entidad.clases.length == 1) {
                    entidad.clases[0].correlativo = entidad.clases[0].nombre_corto.split('-')[0]
                    entidad.clases[0].correlativo_maximo = entidad.clases[0].nombre_corto.split('-')[1]
                }
                $scope.correlativosDestino = entidad

                blockUI.stop();
            });
        }
        $scope.cargarCodigo = function (cliente) {
            cliente.codigo = cliente.correlativo.correlativo
        }
        $scope.abrirModalConceptoEdicionCorrelativos = function (Tipo) {
            blockUI.start();
            var promesa = ClasesTipoEmpresa("correlativo_destinos", $scope.usuario.id_empresa);
            promesa.then(function (entidad) {
                //$scope.correlativosClientes = entidad
                if (entidad.clases.length > 1) {
                    
                    entidad.clases.sort(function (a, b) {
                        a.correlativo = a.nombre_corto.split('-')[0]
                        a.correlativo_maximo = a.nombre_corto.split('-')[1]
                        b.correlativo = b.nombre_corto.split('-')[0]
                        b.correlativo_maximo = b.nombre_corto.split('-')[1]                       
                        return a.correlativo - b.correlativo
                    })
                    $scope.minimo=parseInt(entidad.clases[entidad.clases.length-1].correlativo_maximo)+1
                } else if (entidad.clases.length == 1) {
                    entidad.clases[0].correlativo = entidad.clases[0].nombre_corto.split('-')[0]
                    entidad.clases[0].correlativo_maximo = entidad.clases[0].nombre_corto.split('-')[1]
                    $scope.minimo=parseInt(entidad.clases[0].correlativo_maximo)+1
                    
                }
                $scope.tipo_edicion = entidad;
                $scope.clase = {};
                $scope.abrirPopup($scope.idModalConceptoEdicionCorrelativos);
                blockUI.stop();
            });

        }
        $scope.cerrarModalConceptoEdicionCorrelativos = function () {
            $scope.cerrarPopup($scope.idModalConceptoEdicionCorrelativos);
        }
        $scope.agregarConceptoEdicion = function (clase) {
            clase.nombre_corto = clase.correlativo + "-" + clase.correlativo_maximo

            if ($scope.tipo_edicion.clases.indexOf(clase) == -1) {
                if ($scope.tipo_edicion.clases.length > 0) {
                   /*  if (clase.correlativo > $scope.tipo_edicion.clases[$scope.tipo_edicion.clases.length - 1].correlativo_maximo) { */
                        $scope.tipo_edicion.clases.push(clase);
                        $scope.minimo=clase.correlativo_maximo+1
                  /*   } else {
                        $scope.mostrarMensaje("El valor de correlativo debe ser mayor al valor maximo del ultimo correlativo")
                    } */
                } else {
                    $scope.tipo_edicion.clases.push(clase);
                    $scope.minimo=clase.correlativo_maximo+1
                }

            }
            $scope.clase = {}

        }
        $scope.modificarConceptoEdicion = function (clase) {
            clase.correlativo=parseInt(clase.correlativo)
			clase.correlativo_maximo=parseInt(clase.correlativo_maximo)
            $scope.clase = clase;
        }
        $scope.removerConceptoEdicion = function (clase) {
            clase.eliminado = true;
        }

        $scope.guardarConceptoEdicion = function (tipo) {
            blockUI.start();
            Tipos.update({ id_tipo: tipo.id }, tipo, function (res) {
                var promesa = ClasesTipo(tipo.nombre_corto);
                promesa.then(function (entidad) {
                    tipo = entidad
                    blockUI.stop();
                    $scope.cerrarModalConceptoEdicionCorrelativos();
                    $scope.mostrarMensaje('Guardado Exitosamente!');
                });
            });
        }

        $scope.abrirModalVerificarCuenta = function (dato, tipo) {
            $scope.dato = dato
            $scope.tipoDatosPermiso = tipo
            $scope.abrirPopup($scope.IdModalVerificarCuenta);
        }
        $scope.cerrarModalVerificarCuenta = function () {
            $scope.cerrarPopup($scope.IdModalVerificarCuenta);
        }
        $scope.verificarCuentaAdmin = function (cuenta) {
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {

                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    /*  cuenta.abierto= cuenta.abierto; */
                    if ($scope.tipoDatosPermiso == "correlativo") {
                        $scope.modificarConceptoEdicion($scope.dato)
                    }
                    $scope.cerrarModalVerificarCuenta();
                } else {
                    $scope.mostrarMensaje(dato.message)
                }
            })
        }
        $scope.inicio();
    });



