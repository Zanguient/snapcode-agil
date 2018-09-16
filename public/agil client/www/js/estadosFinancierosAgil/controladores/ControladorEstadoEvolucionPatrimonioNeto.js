angular.module('agil.controladores')

    .controller('controladoEvolucionPatrimonioNeto', function ($scope, $timeout, $localStorage, $filter, $location, blockUI, Clientes, ClientesNit,
        ClasesTipoEmpresa, ClasesTipo, ObtenerConfiguracionImpresion, CuentasContabilidadEEFF, ObtenerGestionesEEFF, ObtenerCuentrasReporte) {

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.imagenEmpresa;

        $scope.$on('$viewContentLoaded', function () {

        });

        $scope.$on('$routeChangeStart', function (next, current) {

        });

        convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
            if (imagenEmpresa.length > 0 && imagenEmpresa !== "error") {
                $scope.imagenEmpresa = imagenEmpresa;
            } else {
                convertUrlToBase64Image("img/agilsoftware.png", function (imagenEmpresa) {
                    if (imagenEmpresa.length > 0 && imagenEmpresa !== "error") {
                        $scope.mostrarMensaje('No se encuentra la imagen de la empresa.')
                        $scope.imagenEmpresa = imagenEmpresa;
                    } else {
                        $scope.mostrarMensaje('No se encuentra imagenen de la empresa.')
                    }
                })
            }
        })

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.inicio = function () {
            $scope.obtenerTiposPeriodos()
            $scope.obtenerGestiones()
            $scope.obtenerTiposCuenta()
            $scope.obtenerConfiguracionImpresion()
            $scope.obtenerGestionesImpresion()
        }


        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            blockUI.stop();
        });

        $scope.obtenerTiposPeriodos = function () {
            blockUI.start();
            var promesa = ClasesTipo("EEFF_TP");
            promesa.then(function (entidad) {
                $scope.TiposPeriodos = entidad
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
        $scope.obtenerConfiguracionImpresion = function () {
            var promesa = ObtenerConfiguracionImpresion($scope.usuario.id_empresa)
            promesa.then(function (dato) {
                $scope.configuracionImpresion = dato
                $scope.configuracionImpresion.bimonetario = false
                $scope.configuracionImpresion.tioPeriodo = ""
                $scope.configuracionImpresion.gestion = ""
                $scope.configuracionImpresion.gestion_fin = ""
                $scope.configuracionImpresion.mes = ""
                $scope.configuracionImpresion.fecha_inicio = null
                $scope.configuracionImpresion.fecha_fin = null
                blockUI.stop()
            })
        }
        $scope.cargarFechasFiltro = function (filtro) {
            if (filtro == 'FECHAS') {
                setTimeout(function () {
                    aplicarDatePickers();
                }, 300);
            }
        }
        $scope.obtenerTiposCuenta = function () {
            blockUI.start();
            var promesa = ClasesTipo("TCC");
            promesa.then(function (entidad) {
                $scope.cuentaTipos = [{ id: 0, nombre: "PREESTABLECIDO" }]
                $scope.cuentaTipos = $scope.cuentaTipos.concat(entidad.clases);
                blockUI.stop();
            });
        }
        $scope.obtenerGestionesImpresion = function () {
            blockUI.start()
            $scope.gestionesEF = []
            var promesa = ObtenerGestionesEEFF($scope.usuario.id_empresa)
            promesa.then(function (datos) {
                blockUI.stop();
                datos.forEach(function (dato) {
                    if (dato.habilitado) {
                        $scope.fechasImpresion = dato
                    }
                })

            })
        }

        $scope.extraerFechaExcel = function (datoFecha) {
            var horas = datoFecha.split(' ')[datoFecha.split(' ').length - 1]
            var fecha = datoFecha.split(' ')[0].split('/').reverse()
            if (horas.indexOf('AM') > 0) {
                horas = horas.split('A')[0].split(':')
            } else if (horas.indexOf('PM') > 0) {
                horas = horas.split('P')[0].split(':')
                horas[0] = (parseInt(horas[0]) + 12) + ''
            }
            var fecha_texto = fecha[0] + '-' + (fecha[2].length == 2 ? fecha[2] : '0' + fecha[2]) + '-' + (fecha[1].length == 2 ? fecha[1] : '0' + fecha[1]) + 'T' + (horas[0].length == 2 ? horas[0] : '0' + horas[0]) + ':' + (horas[1].length == 2 ? horas[1] : '0' + horas[1]) + ':' + (horas[2].length == 2 ? horas[2] : '0' + horas[2]) + '.000Z'
            var fechaCompleta = new Date(fecha[0], fecha[2] - 1, fecha[1], (horas[0].length == 2 ? horas[0] : '0' + horas[0]), (horas[1].length == 2 ? horas[1] : '0' + horas[1]), (horas[2].length == 2 ? horas[2] : '0' + horas[2]))
            return fechaCompleta, fecha_texto
        }

        $scope.generarReportePDF = function () {
            if ($scope.configuracionImpresion.gestion) {
                var tipoCuenta = $scope.cuentaTipos.find(function (cuenta) {
                    return cuenta.nombre.toLowerCase() === "Apropiacion".toLowerCase()
                })
                $scope.reportePDFEstadoEvolucionPatrimonioNeto(tipoCuenta)
            } else {
                $scope.mostrarMensaje('Seleccione una gestion.')
            }
        }

        $scope.reportePDFEstadoEvolucionPatrimonioNeto = function (tipoCuenta) {
            var prom = ObtenerCuentrasReporte($scope.usuario.id_empresa, tipoCuenta)
            prom.then(function (res) {
                var reporte = []
                var capitales = $filter('filter')(res.cuentas, 'Capital');
                var ajusteCapital = $filter('filter')(res.cuentas, 'Ajuste de Capital');
                var reservaLegal = $filter('filter')(res.cuentas, 'Reserva Legal');
                var ajusteReservaLegal = $filter('filter')(res.cuentas, 'Ajuste Reserva Legal');
                var ajusteReservasPatrimoniales = $filter('filter')(res.cuentas, 'Ajuste Reservas Patrimoniales');
                var resultadosAcumulados = $filter('filter')(res.cuentas, 'Resultados Acumulados');
                var resultadosGestion = $filter('filter')(res.cuentas, 'Resultado de la Gestión');
                // if (ajusteReservaLegal) {
                //     if (ajusteReservaLegal.length > 0) {
                //         reservaLegal[0].reservaLegal += ajusteReservaLegal[0].saldo
                //     }
                // }
                // if (resultadosGestion) {
                //     if (resultadosGestion.length > 0) {
                //         resultadosAcumulados[0].resultadoAcumulados += ajusteReservaLegal[0].saldo
                //     }
                // }
                for (let index = 0; index < capitales.length; index++) {
                    var cuenta;
                    if (index === 0) {
                        cuenta = { nombre: "Saldos al 1ro de enero " + $scope.configuracionImpresion.gestion.nombre, capital: capitales[index].saldo, AjusteCapital: '-', reservaLegal: '-', ajusteReservasPatrimoniales: '-', resultadoAcumulados: '-' }
                        reporte.push(cuenta)
                    } else {
                        cuenta = { nombre: capitales[index].nombre, capital: capitales[index].saldo, AjusteCapital: '-', reservaLegal: '-', ajusteReservasPatrimoniales: '-', resultadoAcumulados: '-' }
                        if (cuenta.capital > 0 && cuenta.nombre !== "Ajuste de Capital") {
                            reporte.push(cuenta)
                        }
                    }
                }

                for (let index = 0; index < ajusteCapital.length; index++) {
                    var cuenta;
                    if (index === 0) {
                        reporte[0].AjusteCapital = ajusteCapital[index].saldo
                        // cuenta =  { nombre: "habers al 1ro de enero " + $scope.configuracionImpresion.gestion.nombre, capital: '-', AjusteCapital: ajusteCapital[index].haber, reservaLegal: '-', ajusteReservasPatrimoniales: '-', resultadoAcumulados: '-' }
                    } else {
                        cuenta = { nombre: ajusteCapital[index].nombre, capital: '-', AjusteCapital: ajusteCapital[index].saldo, reservaLegal: '-', ajusteReservasPatrimoniales: '-', resultadoAcumulados: '-' }
                        reporte.push(cuenta)
                    }

                }

                for (let index = 0; index < reservaLegal.length; index++) {
                    var cuenta;
                    if (index === 0) {
                        reporte[0].reservaLegal = reservaLegal[index].saldo
                        // cuenta =  { nombre: "Saldos al 1ro de enero " + $scope.configuracionImpresion.gestion.nombre, capital: '-', AjusteCapital: '-', reservaLegal:  reservaLegal[index].saldo, ajusteReservasPatrimoniales: '-', resultadoAcumulados: '-' }
                    } else {
                        cuenta = { nombre: reservaLegal[index].nombre, capital: '-', AjusteCapital: '-', reservaLegal: reservaLegal[index].saldo, ajusteReservasPatrimoniales: '-', resultadoAcumulados: '-' }
                        reporte.push(cuenta)
                    }

                }

                for (let index = 0; index < ajusteReservasPatrimoniales.length; index++) {
                    var cuenta;
                    if (index === 0) {
                        reporte[0].ajusteReservasPatrimoniales = ajusteReservasPatrimoniales[index].saldo
                        // cuenta =  { nombre: "Saldos al 1ro de enero " + $scope.configuracionImpresion.gestion.nombre, capital: '-', AjusteCapital: '-', reservaLegal: '-', ajusteReservasPatrimoniales: ajusteReservasPatrimoniales[index].saldo, resultadoAcumulados: '-' }
                    } else {
                        cuenta = { nombre: ajusteReservasPatrimoniales[index].nombre, capital: '-', AjusteCapital: '-', reservaLegal: '-', ajusteReservasPatrimoniales: ajusteReservasPatrimoniales[index].saldo, resultadoAcumulados: '-' }
                        reporte.push(cuenta)
                    }

                }
                for (let index = 0; index < resultadosAcumulados.length; index++) {
                    var cuenta;
                    if (index === 0) {
                        reporte[0].resultadoAcumulados = resultadosAcumulados[index].saldo
                        // cuenta =  { nombre: "Saldos al 1ro de enero " + $scope.configuracionImpresion.gestion.nombre, capital: '-', AjusteCapital: '-', reservaLegal: '-', ajusteReservasPatrimoniales: '-', resultadoAcumulados: resultadosAcumulados[index].saldo }
                    } else {
                        cuenta = { nombre: resultadosAcumulados[index].nombre, capital: '-', AjusteCapital: '-', reservaLegal: '-', ajusteReservasPatrimoniales: '-', resultadoAcumulados: resultadosAcumulados[index].saldo }
                        reporte.push(cuenta)
                    }
                }
                for (let index = 0; index < ajusteReservaLegal.length; index++) {
                    var cuenta;
                    cuenta = { nombre: ajusteReservaLegal[index].nombre, capital: '-', AjusteCapital: '-', reservaLegal: ajusteReservaLegal[index].saldo, ajusteReservasPatrimoniales: '-', resultadoAcumulados: '-' }
                    reporte.push(cuenta)
                }
                for (let index = 0; index < resultadosGestion.length; index++) {
                    var cuenta;
                    cuenta = { nombre: resultadosGestion[index].nombre, capital: '-', AjusteCapital: '-', reservaLegal: '-', ajusteReservasPatrimoniales: '-', resultadoAcumulados: resultadosGestion[index].saldo }
                    reporte.push(cuenta)
                }
                var cabecera = [$scope.usuario.empresa, $scope.configuracionImpresion]
                $scope.imprimirReporteComensal(reporte, cabecera)
            })
        }

        $scope.formatoFechaPDF = function (fecha) {
            var MyDate = new Date(fecha);
            var MyDateString;
            MyDate.setDate(MyDate.getDate());
            MyDateString = ('0' + MyDate.getDate()).slice(-2) + '/' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/' + MyDate.getFullYear();
            return MyDateString
        }

        $scope.imprimirReporteComensal = function (reporte, cabecera) {
            var doc = new PDFDocument({ size: [792, 612], margin: 10, compress: false });// {compress: false},
            var stream = doc.pipe(blobStream());
            var y = 280
            var itemsPorPagina = 10
            var items = 0
            var xSeparacion = 0
            var pagina = 1
            var cubeX = 70
            var totalPaginas = Math.ceil(reporte.length / itemsPorPagina);
            $scope.cabeceraReporteComensal(doc, pagina, totalPaginas, cabecera);
            var totalCapital = 0
            var totalAjusteCapital = 0
            var totalReservaLegal = 0
            var totalAjusteReservasPatrimoniales = 0
            var totalResulatadosAcumulados = 0
            var totalTotalrow = 0
            for (let index = 0; index < reporte.length; index++) {
                totalCapital += (reporte[index].capital !== '-' ? reporte[index].capital : 0)
                totalAjusteCapital += (reporte[index].AjusteCapital !== '-' ? reporte[index].AjusteCapital : 0)
                totalReservaLegal += (reporte[index].reservaLegal !== '-' ? reporte[index].reservaLegal : 0)
                totalAjusteReservasPatrimoniales += (reporte[index].ajusteReservasPatrimoniales !== '-' ? reporte[index].ajusteReservasPatrimoniales : 0)
                totalResulatadosAcumulados += (reporte[index].resultadoAcumulados !== '-' ? reporte[index].resultadoAcumulados : 0)
                totalrow = (reporte[index].capital !== '-' ? reporte[index].capital : 0) + (reporte[index].AjusteCapital !== '-' ? reporte[index].AjusteCapital : 0) + (reporte[index].reservaLegal !== '-' ? reporte[index].reservaLegal : 0) + (reporte[index].ajusteReservasPatrimoniales !== '-' ? reporte[index].ajusteReservasPatrimoniales : 0) + (reporte[index].resultadoAcumulados !== '-' ? reporte[index].resultadoAcumulados : 0)
                totalTotalrow += totalrow
                doc.text(reporte[index].nombre, 60, y, { width: 200 });
                doc.text(reporte[index].capital !== '-' ? $scope.number_format(reporte[index].capital, 2) : '', 250, y, { width: 120 });
                doc.text(reporte[index].AjusteCapital !== '-' ? $scope.number_format(reporte[index].AjusteCapital, 2) : '', 330, y, { width: 120 });
                doc.text(reporte[index].reservaLegal !== '-' ? $scope.number_format(reporte[index].reservaLegal,2) : '', 410, y, { width: 120 });
                doc.text(reporte[index].ajusteReservasPatrimoniales !== '-' ? $scope.number_format(reporte[index].ajusteReservasPatrimoniales, 2) : '', 490, y, { width: 120 });
                doc.text(reporte[index].resultadoAcumulados !== '-' ? $scope.number_format(reporte[index].resultadoAcumulados, 2) : '', 570, y, { width: 120 });
                doc.text(totalrow.toFixed(2), 710, y, { width: 120 });
                y = y + 20;
            }
            doc.text('Saldos al 31 de Diciembre de ' + $scope.configuracionImpresion.gestion.nombre, 60, y, { width: 200 });
            doc.text($scope.number_format(totalCapital, 2), 250, y, { width: 120 });
            doc.text($scope.number_format(totalAjusteCapital, 2), 330, y, { width: 120 });
            doc.text($scope.number_format(totalReservaLegal, 2), 410, y, { width: 120 });
            doc.text($scope.number_format(totalAjusteReservasPatrimoniales, 2), 490, y, { width: 120 });
            doc.text($scope.number_format(totalResulatadosAcumulados, 2), 570, y, { width: 120 });
            doc.text($scope.number_format(totalTotalrow, 2), 710, y, { width: 120 });
            y = y + 20;
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
        }

        $scope.cabeceraReporteComensal = function (doc, pagina, totalPaginas, cabecera) {
            var y = 150;
            var x = 100
            var xSeparacion = 0
            var cubeX = 70
            doc.font('Helvetica-Bold', 8)
                .fill('black')
            doc.text(cabecera[0].razon_social, 60, 75);
            doc.text(cabecera[0].de ? cabecera[0].de : 'De: ', 60, 90);
            doc.text(cabecera[0].telefono1 ? cabecera[0].telefono1 : '0000000', 60, 105);
            doc.text(cabecera[0].direccion, 60, 120);
            doc.text('Cochabamba - Bolivia', 60, 135)
            doc.font('Helvetica-Bold', 12)
                .fill('black')
            doc.text('ESTADO DE EVOLUCIÓN DEL PATRIMONIO NETO', 0, 180, { align: 'center' });
            doc.font('Helvetica-Bold', 8)
                .fill('black')
            // doc.text("Al 31 de Diciembre de " + $scope.configuracionImpresion.gestion.nombre, 0, 85, { align: "center" });
            doc.text('Por el ejercicio terminado el 31 de Diciembre de' + $scope.configuracionImpresion.gestion.nombre, 0, 200, { align: 'center' }); //$scope.configuracionImpresion
            if ($scope.configuracionImpresion.bimonetario) {
                doc.text("Expresado en Bolivianos y Dólares", 0, 95, { align: "center" });
                if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
                    doc.text('Bolivianos', 400, 115);
                    doc.text('Dolares', 520, 115);
                } else {
                    doc.text($scope.configuracionImpresion.gestion.nombre, 340, 115);
                    doc.text('Bolivianos', 290, 125);
                    doc.text('Dolares', 370, 125);
                    doc.text($scope.configuracionImpresion.gestion_fin.nombre, 525, 115);
                    doc.text('Bolivianos', 473, 125);
                    doc.text('Dolares', 553, 125);
                }
            } else {
                doc.text("(Expresado en Bolivianos)", 0, 220, { align: "center" });
            }
            doc.text('Capital', 250, 260, { width: 120 });
            doc.text('Ajuste de Capital', 330, 260, { width: 120 });
            doc.text('Reserva Legal', 410, 260, { width: 120 });
            doc.text('Ajuste de Reservas Patrimoniales', 490, 260, { width: 120 });
            doc.text('Resultados Acumulados', 570, 260, { width: 120 });
            doc.text('Total', 710, 260, { width: 120 });
            doc.font('Helvetica', 8);
            if ($scope.imagenEmpresa) {
                doc.image($scope.imagenEmpresa, 40, 30, { fit: [100, 100] });
            }
        }

        $scope.abrirdialogHistorialDocumentos = function () {
            $scope.activeModal = 0
            $scope.obtenerHistorialDocumentos()
            $scope.abrirPopup($scope.dialogHistorialDocumentos);
        }

        $scope.cerrardialogHistorialDocumentos = function () {
            $scope.activeModal = 0
            $scope.historialesDocumentos = []
            $scope.cerrarPopup($scope.dialogHistorialDocumentos);
        }
        $scope.inicio()
    });