angular.module('agil.controladores')

    .controller('ControladorConfiguracionesEstadosFinancieros', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
        ClasesTipoEmpresa, ClasesTipo, ObtenerGestionesEEFF, GuardarGestionesEEFF,GuardarConfiguracionImpresion,ObtenerConfiguracionImpresion) {


        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalConfiguracionGestion = 'dialog-configuracion-gestiones'
        $scope.idModalDetalleImpresion = 'dialog-detalles-impesion'
        $scope.inicio = function () {
            $scope.obtenerTipoNumeracion()
            $scope.obtenerGestionesEEFF()
        }
       

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsConfiguracionEstadosFinacioneros($scope.idModalConfiguracionGestion, $scope.idModalDetalleImpresion);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            blockUI.stop();
        });

        $scope.abrirModalConfiguracionGestion = function () {
            blockUI.start()
            $scope.gestionesEF = []
            var promesa = ObtenerGestionesEEFF($scope.usuario.id_empresa)
            promesa.then(function (datos) {
                if (datos.length > 0) {
                    $scope.gestionesEF = datos
                } else {
                    $scope.ClasesGestionesEF.forEach(function (gestion, index, array) {
                        var gestion = { index:index,tipoGestion: gestion, inicio: "", fin: "",habilitado:false }
                        $scope.gestionesEF.push(gestion)
                        if(index==(array.length-1)){
                            setTimeout(function () {
                                aplicarDatePickers();
                            }, 300);
                        }
                    });
                }
                blockUI.stop()
            })

            $scope.abrirPopup($scope.idModalConfiguracionGestion)
        }
        $scope.habilitarGestion=function(gestion){
            $scope.gestionesEF.forEach(function(dato) {
                if(dato.id){
                    if(dato.id!=gestion.id){
                        dato.habilitado=false
                    }
                }else{
                    if(dato.index!=gestion.index){
                        dato.habilitado=false
                    }
                }
            });
        }
        $scope.cerrarModalConfiguracionGestion = function () {
            $scope.cerrarPopup($scope.idModalConfiguracionGestion)
        }
        $scope.abrirModalDetalleImpresion = function () {
            $scope.configuracionImpresion={}
            var promesa = ObtenerConfiguracionImpresion($scope.usuario.id_empresa)
            promesa.then(function (dato) {
                if (dato) {
                    dato.fecha_emision=$scope.fechaATexto(dato.fecha_emision)
                    $scope.configuracionImpresion = dato
                }
                blockUI.stop()
            })
            $scope.abrirPopup($scope.idModalDetalleImpresion)
        }
        $scope.cerrarModalDetalleImpresion = function () {
            $scope.cerrarPopup($scope.idModalDetalleImpresion)
        }

        $scope.obtenerTipoPeriodos = function () {
            blockUI.start();
            var promesa = ClasesTipo("EEFF_TP");
            promesa.then(function (entidad) {
                $scope.TiposPeriodos = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerTipoNumeracion = function () {
			blockUI.start();
			var promesa = ClasesTipo("NEEFF");
			promesa.then(function (entidad) {
				$scope.TiposNumeraciones = entidad
				blockUI.stop();
			});
		}
        $scope.obtenerGestionesEEFF = function () {
            blockUI.start();
            var promesa = ClasesTipoEmpresa("GESTION_EEFF", $scope.usuario.id_empresa);
            promesa.then(function (entidad) {
                $scope.ClasesGestionesEF = entidad.clases
                blockUI.stop();
            });
        }
        $scope.guardarConfiguracionImpresion = function (datos) {
            blockUI.start()
            datos.fecha_emision=new Date($scope.convertirFecha(datos.fecha_emision))
            var promesa = GuardarConfiguracionImpresion($scope.usuario.id_empresa, datos)
            promesa.then(function(dato){
                $scope.mostrarMensaje(dato.mensaje)
                blockUI.stop()
            })
        }
        $scope.guardarGestionesEEFF = function (datos) {
            blockUI.start()
            var promesa = GuardarGestionesEEFF($scope.usuario.id_empresa, datos)
            promesa.then(function(dato){
                $scope.mostrarMensaje(dato.mensaje)
                blockUI.stop()
            })
        }
        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalConfiguracionGestion);
            $scope.eliminarPopup($scope.idModalDetalleImpresion)

        });

        $scope.inicio();
    });



