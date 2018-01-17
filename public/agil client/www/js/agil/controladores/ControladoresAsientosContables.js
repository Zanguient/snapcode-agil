angular.module('agil.controladores')

    .controller('ControladorComprobantes', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, CodigoControl, Paginator, ComprobantePaginador, ClasesTipo, ListaCuentasComprobanteContabilidad, ListaAsientosComprobanteContabilidad, NuevoComprobanteContabilidad, ClasesTipo, LibroMayorCuenta, ComprobanteRevisarPaginador,
        AsignarComprobanteFavorito, ImprimirComprobante, ComprasComprobante, VerificarUsuarioEmpresa, FieldViewer, DatosComprobante, EliminarComprobante,ListaCambioMoneda,ActualizarCambioMoneda) {

        blockUI.start();
        $scope.asientoNuevo = false
        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';
        $scope.IdModalEliminarComprobante = 'dialog-eliminar-comprobante';
        $scope.IdModalCambioMoneda = 'dialog-cambio-moneda';
        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsComprobante($scope.IdModalVerificarCuenta, $scope.IdModalEliminarComprobante,$scope.IdModalCambioMoneda);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion();
        });
        $scope.$on('$routeChangeStart', function (next, current) {

            $scope.eliminarPopup($scope.IdModalVerificarCuenta);
            $scope.eliminarPopup($scope.IdModalEliminarComprobante)
            $scope.eliminarPopup($scope.IdModalCambioMoneda)
        });

        $scope.inicio = function () {
            $scope.opcionBimonetario2 = false
            $scope.detalleComprobante = {}
            $scope.obtenerTiposComprobante();
            $scope.asientos = []
            $scope.cuenta = {}
            $scope.comprobante = { asientos: [] }
            $scope.sucursales = $scope.obtenerSucursales();
            $scope.obtenerMeses()
            $scope.ObtenerComprobantes();
            $scope.obtenerGestiones();
            $scope.obtenerAnios("2016")
        }

        $scope.obtenerColumnasAplicacion = function () {
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuario.id_empresa,
                configuracion: {
                    abierto: { value: "Abierto", show: true },
                    comprobante: { value: "Comp.", show: true },
                    numero: { value: "Nro", show: true },
                    fecha: { value: "Fecha", show: true },
                    sucursal: { value: "Sucursal", show: true },
                    gloza: { value: "Gloza", show: true },
                    hora_fecha: { value: "Hora-Fecha", show: true },
                    importe: { value: "Importe", show: true },
                    usuario: { value: "Usuario", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
        }

        $scope.obtenerSucursales = function () {
            var sucursales = [];
            for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
                sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
            }
            console.log($scope.usuario.sucursalesUsuario)
            return sucursales;
        }


        $scope.ObtenerComprobantes = function () {
            $scope.paginator = Paginator();
            $scope.paginator.column = "numero";
            $scope.paginator.callBack = $scope.obtenerLista;
            $scope.filtro = { empresa: $scope.usuario.id_empresa, clasificacion: "", tipo_comprobante: "", monto: "" };
            if ($scope.filtro.inicio != null) {
                $scope.paginator.getSearch("", $scope.filtro);
            }
        }

        $scope.obtenerLista = function () {

            blockUI.start();

            var fechainico = $scope.paginator.filter.inicio;
            var fechafin = $scope.paginator.filter.fin;
            $scope.paginator.filter.inicio = new Date($scope.convertirFecha($scope.paginator.filter.inicio));
            $scope.paginator.filter.fin = new Date($scope.convertirFecha($scope.paginator.filter.fin));
            var promise = ComprobantePaginador($scope.paginator);
            $scope.totalImporte = 0;
            promise.then(function (data) {
                $scope.paginator.setPages(data.paginas);
                $scope.comprobantes = data.comprobantes;
                $scope.comprobantes.forEach(function (comprobante) {
                    $scope.totalImporte = $scope.totalImporte + comprobante.importe;
                }, this);
                //$scope.filtro = { empresa: $scope.usuario.id_empresa, inicio: fechainico, fin: fechafin};
                $scope.paginator.filter.inicio = fechainico
                $scope.paginator.filter.fin = fechafin
                blockUI.stop();
            });
        }

        $scope.formatearFecha = function (fecha) {
            var fechaArreglo = fecha.split('/');
            var fechaFormateada = fechaArreglo[0] + fechaArreglo[1] + fechaArreglo[2];
            return fechaFormateada;
        }

        $scope.cerrarModalLibrosMayores = function () {
            $scope.cerrarPopup($scope.IdModalLibroMayor);
        }

        $scope.obtenerTiposComprobante = function () {
            blockUI.start();
            var promesa = ClasesTipo("TCMC");
            promesa.then(function (entidad) {
                $scope.tiposComprobantes = entidad.clases;
                blockUI.stop();
            });
        }

        $scope.obtenerGestiones = function () {
            blockUI.start();
            var promesa = ClasesTipo("GTN");
            promesa.then(function (entidad) {
                $scope.gestiones = entidad.clases;
                blockUI.stop();
            });
        }
        $scope.buscarCuentas = function (query) {
            if (query != "" && query != undefined) {
                // console.log(query)
                var promesa = ListaCuentasComprobanteContabilidad($scope.usuario.id_empresa, query);
                console.log(promesa)
                return promesa;
            }
        }

        $scope.DatosCodigoQr = [];
        $scope.cont2 = 1
        $scope.disparo = true;

        $scope.AgregarComprobante = function () {
            if ($scope.nuevoComprobante.tipo_comprobante != null && $scope.nuevoComprobante.id_sucursal != null && $scope.nuevoComprobante.fecha != null) {
                for (var index = 0; index < $scope.nuevoComprobante.asientosContables.length; index++) {

                    var element = $scope.nuevoComprobante.asientosContables[index];
                    if (element.activo != false && element.debe_bs != "") {
                        $scope.nuevoComprobante.importe = Math.round(($scope.nuevoComprobante.importe + element.debe_bs) * 10000) / 10000
                    }
                }
                $scope.nuevoComprobante.fecha = new Date($scope.convertirFecha($scope.nuevoComprobante.fecha))
                NuevoComprobanteContabilidad.save($scope.nuevoComprobante, function (dato) {
                    $scope.mostrarMensaje(dato.mensaje);
                    $scope.cerrarNuevoComprobante();


                })
            } else {

            }
        }

        /*  $scope.verComprobante = function (comprobante,view) {
             if (comprobante.abierto) {
                 $scope.crearNuevoComprobante(null, null, comprobante)
             }
         } */
        $scope.verComprobante = function (comprobante, view) {
            if (view) {
                $scope.crearNuevoComprobante(null, null, comprobante, true)
            } else {
                if (comprobante.abierto) {
                    $scope.crearNuevoComprobante(null, null, comprobante)
                }

            }

        }
        $scope.ComvertirDebeEnDolar = function (asiento) {
            asiento.debe_sus = Math.round((asiento.debe_bs / $scope.valorDolar) * 10000) / 10000;
        }
        $scope.ComvertirHaberEnDolar = function (asiento) {
            asiento.haber_sus = Math.round((asiento.haber_bs / $scope.valorDolar) * 10000) / 10000;
        }
        $scope.ComvertirDebeEnBolivianos = function (asiento) {
            asiento.debe_bs = Math.round((asiento.debe_sus * $scope.valorDolar) * 10000) / 10000;
        }
        $scope.ComvertirHaberEnBolivianos = function (asiento) {
            asiento.haber_bs = Math.round((asiento.haber_sus * $scope.valorDolar) * 10000) / 10000;
        }

        $scope.verificarCuentaAdmin = function (cuenta) {
            cuenta.id_comprobante = $scope.dato.id
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {
                console.log(dato)
                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    /*  cuenta.abierto= cuenta.abierto; */                   
                   if (!$scope.dato.abierto) {
                        $scope.dato.abierto=true                     
                     } else {
                        $scope.dato.abierto=false                      
                    }
                    $scope.cerrarModalVerificarCuenta();
                } else {                                        
                    $scope.mostrarMensaje(dato.message)    
                }
            })




        }

        $scope.abrirModalVerificarCuenta = function (comprobante) {
            $scope.dato = comprobante
            $scope.abrirPopup($scope.IdModalVerificarCuenta);
        }
        $scope.cerrarModalVerificarCuenta = function () {

            $scope.cerrarPopup($scope.IdModalVerificarCuenta);
        }
        $scope.abrirModalEliminarComprobante = function (comprobante) {
            $scope.dato = comprobante
            $scope.abrirPopup($scope.IdModalEliminarComprobante);
        }
        $scope.cerrarModalEliminarComprobante = function () {

            $scope.cerrarPopup($scope.IdModalEliminarComprobante);
        }
        $scope.eliminarComprobante = function () {
            var promesa = EliminarComprobante($scope.dato.id)
            promesa.then(function (dato) {
                $scope.recargarItemsTabla()
                $scope.mostrarMensaje(dato.mensaje)
                $scope.cerrarModalEliminarComprobante()
            })
        }
        $scope.opcionBimonetario = true;
        $scope.VerBimonetario = function () {
            console.log($scope.opcionBimonetario)
            if ($scope.opcionBimonetario != true) {
                $scope.opcionBimonetario = false;
            } else {
                $scope.opcionBimonetario = true;
            }
        }
        $scope.imprimirComprobante = function (comprobante, bimonetario) {
            blockUI.start();
            var promesa = DatosComprobante(comprobante.id)
            promesa.then(function (datosComprobante) {
                datosComprobante.comprobante.importe_literal = datosComprobante.importeLiteral
                ImprimirComprobante(datosComprobante.comprobante, bimonetario, $scope.usuario,$scope.number_format)
                blockUI.stop();
            })

        }
        $scope.buscarCambioMoneda = function name(filtro) {
            var promesa = ListaCambioMoneda(filtro)
            promesa.then(function (datos) {
                $scope.cambiosMoneda=datos
            })
        }
        $scope.abrirCambioMoneda = function () {            
            $scope.filtroMoneda={mes:"a",anio:2018}
            var promesa = ListaCambioMoneda($scope.filtroMoneda)
            promesa.then(function (datos) {
                $scope.cambiosMoneda=datos
                $scope.abrirPopup($scope.IdModalCambioMoneda);
            })
			
		}
		$scope.cerrarCambioMoneda = function () {
			$scope.cerrarPopup($scope.IdModalCambioMoneda);
		}
        $scope.obtenerAnios = function (startYear) {
            var currentYear = new Date().getFullYear(), years = [];
            startYear = startYear || 1980;

            while (startYear <= currentYear) {
                years.push(startYear++);
            }

            $scope.listYears = years;
        }
        $scope.EditarCambioMoneda = function (moneda) {
            moneda.edit=true
        }
        $scope.CancelarModificarMoneda=function(){
            var promesa = ListaCambioMoneda($scope.filtroMoneda)
            promesa.then(function (datos) {
                $scope.cambiosMoneda=datos
            })
        }
        $scope.GuardarCambio=function (moneda) {
            var promesa = ActualizarCambioMoneda(moneda)
            promesa.then(function (datos) {
                $scope.mostrarMensaje(datos.mensaje)
                moneda.edit=false
            })
        }
        $scope.inicio();

    });



