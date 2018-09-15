angular.module('agil.controladores')

    .controller('ControladorComprobantes', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, CodigoControl, Paginator, ComprobantePaginador, ClasesTipo, ListaCuentasComprobanteContabilidad, ListaAsientosComprobanteContabilidad, NuevoComprobanteContabilidad, ClasesTipo, LibroMayorCuenta, ComprobanteRevisarPaginador,
        AsignarComprobanteFavorito, Diccionario,ObtenerCambioMoneda, ImprimirComprobante, ComprasComprobante, VerificarUsuarioEmpresa, FieldViewer, DatosComprobante, EliminarComprobante, ListaCambioMoneda, ActualizarCambioMoneda,GuardarComprobantesImportados) {

        blockUI.start();
        $scope.asientoNuevo = false
        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';
        $scope.IdModalEliminarComprobante = 'dialog-eliminar-comprobante';
        $scope.IdModalCambioMoneda = 'dialog-cambio-moneda';
        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsComprobante($scope.IdModalVerificarCuenta, $scope.IdModalEliminarComprobante, $scope.IdModalCambioMoneda);
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
            $scope.diccionario = Diccionario
            console.log($scope.diccionario)
            $scope.comprobante = { asientos: [] }
            $scope.sucursales = $scope.obtenerSucursales();
            $scope.obtenerMeses()
            $scope.ObtenerComprobantes();
            $scope.obtenerGestiones();
            $scope.obtenerAnios("2016")
            $scope.obtenerCambioDolar()
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
            $scope.paginator.direction = "desc";
            $scope.paginator.callBack = $scope.obtenerLista;
            var date = new Date()
            var fechafin = $scope.fechaATexto(date)
            var fechaInicio = $scope.fechaATexto(sumarDias(date, -10))
            $scope.filtro = { inicio: fechaInicio, fin: fechafin, empresa: $scope.usuario.id_empresa, clasificacion: "", tipo_comprobante: "", monto: "" };
            if ($scope.filtro.inicio != null) {
                $scope.paginator.getSearch("", $scope.filtro);
            }
        }
        function sumarDias(fecha, dias) {
            fecha.setDate(fecha.getDate() + dias);
            return fecha;
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
            console.log(comprobante)

            if (view) {
                $scope.crearNuevoComprobante(null, null, comprobante, true)
            } else {

                if (comprobante.abierto) {
                    $scope.obtenerCambioMoneda2($scope.fechaATexto(comprobante.fecha))
                    $scope.crearNuevoComprobante(null, null, comprobante)
                } else {
                    if (!comprobante.id) {
                        $scope.crearNuevoComprobante(null, null, comprobante)
                    }
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
                        $scope.dato.abierto = true
                    } else {
                        $scope.dato.abierto = false
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
                ImprimirComprobante(datosComprobante.comprobante, bimonetario, $scope.usuario, $scope.number_format)
                blockUI.stop();
            })

        }
        $scope.buscarCambioMoneda = function name(filtro) {
            var promesa = ListaCambioMoneda(filtro)
            promesa.then(function (datos) {
                $scope.cambiosMoneda = datos
            })
        }
        $scope.abrirCambioMoneda = function () {
            $scope.filtroMoneda = { mes: "a", anio: 2018 }
            var promesa = ListaCambioMoneda($scope.filtroMoneda)
            promesa.then(function (datos) {
                $scope.cambiosMoneda = datos
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
            moneda.edit = true
        }
        $scope.CancelarModificarMoneda = function () {
            var promesa = ListaCambioMoneda($scope.filtroMoneda)
            promesa.then(function (datos) {
                $scope.cambiosMoneda = datos
            })
        }
        $scope.GuardarCambio = function (moneda) {
            var promesa = ActualizarCambioMoneda(moneda)
            promesa.then(function (datos) {
                $scope.mostrarMensaje(datos.mensaje)
                moneda.edit = false
            })
        }
        $scope.obtenerCambioDolar = function () {
            var fecha = new Date()
            var promesa = ObtenerCambioMoneda(fecha)
            promesa.then(function (dato) {
                console.log(dato)
                if (dato.monedaCambio) {
                    $scope.moneda = dato.monedaCambio;

                }
            })
        }
        $scope.subirExcelComprobantes = function (event) {
            blockUI.start();
            //console.log('iniciando carga de pacientes')
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                //console.log('iniciando lectura de excel(s)')
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    blockUI.start();
                    var data = e.target.result;

                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0, row2 = 2;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var comprobantes = [];
                    var codigo = "", fecha = "", tipo = ""
                    do {
                        row2 = row
                        var comprobante = { asientosContables: [] };
                        comprobante.tipoCambio=$scope.moneda
                        comprobante.tipo_comprobante = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        tipo = comprobante.tipo_comprobante
                        comprobante.codigo = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        codigo = comprobante.codigo
                        comprobante.fecha = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? new Date($scope.fecha_excel_angular(worksheet['C' + row].v.toString())) : null;
                        comprobante.fechaActual=new Date()
                        comprobante.sucursal = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
                        fecha = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? $scope.fecha_excel_angular(worksheet['C' + row].v.toString()) : null;
                        comprobante.importe=0
                        comprobante.gloza = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
                        do {
                            var asiento = {}
                            asiento.numero_cuenta = worksheet['F' + row2] != undefined && worksheet['F' + row2] != "" ? worksheet['F' + row2].v.toString() : null;
                            asiento.codigo = worksheet['G' + row2] != undefined && worksheet['G' + row2] != "" ? worksheet['G' + row2].v.toString() : null;
                            asiento.gloza = worksheet['H' + row2] != undefined && worksheet['H' + row2] != "" ? worksheet['H' + row2].v.toString() : null;
                            asiento.debe_bs = worksheet['I' + row2] != undefined && worksheet['I' + row2] != "" ? parseFloat(worksheet['I' + row2].v.toString()) : null;
                            asiento.haber_bs = worksheet['J' + row2] != undefined && worksheet['J' + row2] != "" ?  parseFloat(worksheet['J' + row2].v.toString()) : null;
                            asiento.debe_sus =Math.round((asiento.debe_bs / $scope.moneda.dolar) * 10000) / 10000;
                            asiento.haber_sus =Math.round((asiento.haber_bs / $scope.moneda.dolar) * 10000) / 10000;
                            asiento.eliminado=false
                            var codigoPrueba = worksheet['B' + row2] != undefined && worksheet['B' + row2] != "" ? parseInt(worksheet['B' + row2].v.toString()) : null;
                            var fechaPrueba = worksheet['C' + row2] != undefined && worksheet['C' + row2] != "" ? $scope.fecha_excel_angular(worksheet['C' + row2].v.toString()) : null;
                            var tipoPrueba = worksheet['A' + row2] != undefined && worksheet['A' + row2] != "" ? worksheet['A' + row2].v.toString() : null;

                            if (codigoPrueba == codigo && fechaPrueba == fecha && tipo == tipoPrueba) {
                                comprobante.importe+=asiento.debe_bs
                                comprobante.asientosContables.push(asiento);
                            }
                            row2++;
                            /*  i++; */
                        } while (worksheet['G' + row2].v.toString() != codigo);



                        if (comprobantes.length == 0) {
                            comprobantes.push(comprobante);
                        } else if (comprobantes[comprobantes.length - 1].codigo != codigo || comprobantes[comprobantes.length - 1].tipo_comprobante != tipo) {
                            comprobantes.push(comprobante);
                        }
                        row++;
                        i++;

                    } while (worksheet['A' + row] != undefined);
                    $scope.GuardarComprobantesImportacion(comprobantes);
                };
                reader.readAsBinaryString(f);

            }
        }
        $scope.GuardarComprobantesImportacion = function (comprobantes) {
            var promesa =GuardarComprobantesImportados(comprobantes,$scope.usuario.id,$scope.usuario.id_empresa)
            promesa.then(function(dato){
                blockUI.stop()
                $scope.mostrarMensaje(dato.mensaje)
            })
            
            blockUI.stop();
        }
        $scope.inicio();

    });



