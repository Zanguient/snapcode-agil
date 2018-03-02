angular.module('agil.controladores')
    .controller('controladorPolifuncionalidad', function ($scope, $location, $localStorage, $templateCache, $route, blockUI, Paginator, FieldViewer,
        $filter, ClasesTipo, ObtenerTodoPersonal, ObtenerEvaluaciones, GuardarEvaluacionPersonal, ObtenerReportePorMeses, ObtenerReportePorAnio, ObtenerReporteGeneralPorAnio) {

        $scope.usuarioSesion = JSON.parse($localStorage.usuario);
        $scope.idModalWizardPolifuncionalEdicion = 'modal-wizard-polifuncional-edicion';
        $scope.idModalContenedorPolifuncionalEdicion = 'modal-wizard-container-polifuncional-edicion';
        $scope.idModalWizardConceptoEdicion2 = 'modal-wizard-polifuncional-ac-edicion';
        $scope.idModalContenedorConceptoEdicion2 = 'modal-wizard-container-polifuncional-ac-edicion';
        $scope.modalBusquedaPersonal = 'dialog-Busqueda-personal-polifuncional'
        $scope.idModalReportes = 'dialog-reportes-polifuncional'
        $scope.reporteGraficoPolifuncional = 'reporte-grafico-polifuncional'

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsPolifuncionalidad($scope.idModalWizardPolifuncionalEdicion, $scope.idModalContenedorPolifuncionalEdicion, $scope.modalBusquedaPersonal,
                $scope.idModalWizardConceptoEdicion2, $scope.idModalContenedorConceptoEdicion2, $scope.idModalReportes, $scope.reporteGraficoPolifuncional);
            $scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion()
            blockUI.stop();
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalWizardPolifuncionalEdicion);
            $scope.eliminarPopup($scope.idModalWizardConceptoEdicion2);
            $scope.eliminarPopup($scope.idModalReportes);
            $scope.eliminarPopup($scope.modalBusquedaPersonal);
            $scope.eliminarPopup($scope.reporteGraficoPolifuncional);

        });

        $scope.inicio = function () {
            $scope.obtenerCargos()
            $scope.obtenerCentroCosto()
            var filtro = { id_empresa: $scope.usuarioSesion.empresa.id, mes: 0, anio: 0, desempenio: 0, mas_campo: 0, campo: 0, cargo: 0, estado: 0, codigo: 0, nombre: 0, apellido: 0, pagina: 1, items_pagina: 10, columna: 0, direccion: 0 }
            $scope.obtenerPaginador()
        }

        $scope.obtenerPaginador = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "anio";
            $scope.paginator.direccion = "asc";
            $scope.filtro = { id_empresa: $scope.usuarioSesion.empresa.id, mes: 0, anio: 0, desempenio: 0, mas_campo: 0, campo: 0, cargo: 0, estado: 0, codigo: 0, nombre: 0, apellido: 0, pagina: 1, items_pagina: 10 }
            $scope.paginator.filter = $scope.filtro
            $scope.paginator.callBack = $scope.obtenerEvaluaciones;
            $scope.paginator.getSearch("", $scope.filtro, null);
            $scope.resetFiltro()
            blockUI.stop();
        }

        $scope.determinarColor = function (desempenio) {
            return listaDesempenio[desempenio - 1].color
        }

        var listaDesempenio = [
            { id: 1, nombre: 'Deficiente', desde: 1, hasta: 25, color: "bg-red" },
            { id: 2, nombre: 'Insatisfactorio', desde: 26, hasta: 50, color: "bg-yellow" },
            { id: 3, nombre: 'Satisfactorio', desde: 51, hasta: 75, color: "bg-orange-green" },
            { id: 4, nombre: 'Competente', desde: 76, hasta: 100, color: "bg-blue" },
            { id: 5, nombre: 'ERROR', desde: 101, hasta: 99999, color: "bg-red" },
            { id: 6, nombre: 'ERROR', desde: -99999, hasta: 0, color: "bg-red" }]

        var listaEstados = [
            { id: 1, nombre: 'Activo' },
            { id: 2, nombre: 'Inactivo' }]

        $scope.determinarEstado = function (estado) {
            if (estado == true) {
                return listaEstados[1].nombre
            } else {
                return listaEstados[0].nombre
            }
        }

        $scope.determinarDesempenio = function (desempenio) {
            return listaDesempenio[desempenio - 1].nombre
        }

        var vars = ['asistencia_capacitacion',
            'documentos_actualizados',
            'trabajo_equipo',
            'funciones_puntualidad',
            'higiene_personal',
            'asistencia_reunion',
            'ingreso_campo',
            'llenado_formularios']

        $scope.calcularTotalEvaluacion = function (evaluacion) {
            var total = 0
            vars.map(function (key) {
                if (evaluacion[key] !== null && evaluacion[key] !== undefined && evaluacion[key] >= 0) {
                    total += evaluacion[key]
                    evaluacion.nota_total = total
                }
            })
        }

        var validarPrimerStep = false
        var validarSteps = 0
        $scope.validarDatosEvaluacion = function (evaluacion) {

            if (evaluacion === undefined || evaluacion === null) {
                return true
            }
            if (evaluacion.personal === undefined || evaluacion.personal == null) {
                return true
            }
            var count = 0

            for (const key in evaluacion) {
                if (evaluacion.hasOwnProperty(key)) {
                    count += 1;
                }
            }
            if (count == vars.length || count == 3) {
                if (!validarPrimerStep) {
                    validarPrimerStep = true
                    return false
                } else {
                    if (validarSteps < 1) {
                        validarSteps += 1
                        return false
                    } else {
                        return true
                    }
                }
            } else {
                if (count < vars.length + 4) {
                    return true
                } else {
                    return false
                }
            }
        }

        $scope.guardarEvaluacion = function (evaluacion) {
            var button = $('#siguiente').text().trim();
            if (button != "Siguiente") {
                blockUI.start()
                listaDesempenio.map(function (desempenio) {
                    if (evaluacion.nota_total >= desempenio.desde && evaluacion.nota_total <= desempenio.hasta) {
                        evaluacion.id_desempenio = desempenio.id
                    }
                })
                evaluacion.fecha = new Date(evaluacion.anio.id, evaluacion.mes.id, 15, 12, 0, 0)
                var prom = GuardarEvaluacionPersonal($scope.usuarioSesion.empresa.id, evaluacion)
                prom.then(function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrarPopPupNuevoPolifuncional()
                    $scope.recargarItemsTabla()
                    blockUI.stop()
                }, function (err) {
                    $scope.mostrarMensaje(err.data !== undefined ? err.data : err.message)
                    blockUI.stop()
                })
            }
        }

        $scope.reportePorMesGrafico = function (reporte, mesesReporte) {
            $scope.abriridModalReportesGrafico()
            var dataPointsReporte = []
            reporte.map(function (row, i) {
                if (i != 0) {
                    var x = 10
                    var datosCampo = []
                    row.map(function (dat, j) {
                        if (j > 5 && j <= row.length - 2) {
                            var col = { x: x, y: dat, label: row.length-2 != j ? mesesReporte[j - 6] : 'TOTAL' }
                            datosCampo.push(col)
                            x += 10
                        }
                    })
                    var dato = {
                        type: "column",
                        showInLegend: true,
                        legendText: (row[1] + " " + row[2] + " " + row[3] + " " + row[4] + " " + row[5]).toUpperCase(),
                        dataPoints: datosCampo
                    }
                    dataPointsReporte.push(dato)
                }
            })
            var chart = new CanvasJS.Chart("chartContainer",
                {
                    title: {
                        text: ("Reporte polifuncional desde " + mesesReporte[0] + " hasta " + mesesReporte[mesesReporte.length-1]).toUpperCase(),
                        fontSize: 32
                    },
                    legend: {
                        horizontalAlign: "center", // left, center ,right 
                        verticalAlign: "top",  // top, center, bottom
                        fontSize: 15
                    },
                    animationEnabled: true,
                    exportEnabled: true,
                    width: 1100,
                    height: 600,
                    axisX: {
                        labelFontSize: 18
                    },
                    data: dataPointsReporte
                });
            chart.render();
            blockUI.stop();
        }

        $scope.reportePorMeses = function (fromMonth, fromYear, untilMonth, untilYear, pdf, grafico) {
            blockUI.start()
            if (fromMonth === undefined || fromYear === undefined || untilMonth === undefined || untilYear === undefined || fromMonth === null || fromYear === null || untilMonth === null || untilYear === null) {
                $scope.mostrarMensaje('Ingrese desde que Mes/Año hasta que Mes/Año desea el reporte.')
                return
            }
            if (pdf) {
                var cabecera = ["N°", "Campo", "Empleado", "C.I.", "Estado", "Cargo"]
                var report = []
            } else {
                var cabecera = ["", "N°", "Campo", "Empleado", "C.I.", "Estado", "Cargo"]
                var wscols = [
                    { wch: 4 },
                    { wch: 4 },
                    { wch: 12 },
                    { wch: 20 },
                    { wch: 9 },
                    { wch: 8 },
                    { wch: 9 }
                ];
                var report = [[""]]
            }
            var data = []
            var reporte = ObtenerReportePorMeses(fromMonth, fromYear, untilMonth, untilYear)
            reporte.then(function (res) {
                if (res.reporte.length == 0) {
                    $scope.mostrarMensaje('No existen datos')
                    return
                }
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje)
                    return
                }
                res.mesesReporte.map(function (fecha) {
                    cabecera.push(fecha)
                })
                mesesReporte = res.mesesReporte
                for (var i = 0; i < res.reporte.length; i++) {
                    if (pdf) {
                        var columns = [];
                    } else {
                        var columns = [""];
                    }
                    columns.push(i + 1);
                    columns.push(res.reporte[i].campo);
                    columns.push(res.reporte[i].persona.nombre_completo);
                    columns.push(res.reporte[i].persona.ci);
                    columns.push($scope.determinarEstado(res.reporte[i].eliminado));
                    columns.push(res.reporte[i].cargos.length > 0 ? res.reporte[i].cargos[0].cargo.nombre : 'Sin cargo');
                    var currentIndx = 0
                    var promedio = 0
                    mesesReporte.map(function (mes) {
                        var fechaCabecera = currentIndx <= res.reporte[i].evaluaciones.length - 1 ? $scope.meses[res.reporte[i].evaluaciones[currentIndx].mes].nombre.substring(0, 3) + '-' + (res.reporte[i].evaluaciones[currentIndx].anio).toString().substring(4, 2) : "0"
                        if (mes == fechaCabecera) {
                            columns.push((res.reporte[i].evaluaciones[currentIndx].nota_total))
                            promedio += res.reporte[i].evaluaciones[currentIndx].nota_total
                            currentIndx += 1
                        } else {
                            columns.push("-")
                        }
                        if (i == 0 && pdf === undefined) {
                            wscols.push({ wch: 6 })
                        }
                    })
                    promedio = promedio / res.reporte[i].evaluaciones.length
                    columns.push((Math.round(promedio)))
                    listaDesempenio.map(function (desempenio) {
                        if (Math.round(promedio) >= desempenio.desde && Math.round(promedio) <= desempenio.hasta) {
                            columns.push($scope.determinarDesempenio(desempenio.id))
                        }
                    })
                    if (i == 0 && pdf === undefined) {
                        wscols.push({ wch: 10 })
                    }
                    if (i == res.reporte.length - 1) {
                        cabecera.push("Promedio")
                        cabecera.push("Desempeño")
                        if (pdf === undefined) {
                            wscols.push({ wch: 12 })
                        }
                    }
                    data.push(columns);
                }
                report.push(cabecera)
                data.map(function (row) {
                    report.push(row)
                })
                if (pdf) {
                    if (grafico) {
                        // blockUI.stop();
                        $scope.reportePorMesGrafico(report, mesesReporte)
                    } else {
                        blockUI.stop();
                        $scope.reportePorMesesPdf(report, fromMonth, fromYear, untilMonth, untilYear)
                    }

                } else {
                    var ws_name = "SheetJS";
                    var wb = new Workbook(), ws = sheet_from_array_of_arrays(report);
                    ws['!cols'] = wscols;
                    /* add worksheet to workbook */
                    wb.SheetNames.push(ws_name);
                    wb.Sheets[ws_name] = ws;
                    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true });
                    var rDesde = $scope.meses[fromMonth.id].nombre.substring(0, 3) + '-' + (fromYear.id).toString().substring(4, 2)
                    var rHasta = $scope.meses[untilMonth.id].nombre.substring(0, 3) + '-' + (untilYear.id).toString().substring(4, 2)
                    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE POLIFUNCIONAL POR MESES " + mesesReporte[0] + " : " + mesesReporte[mesesReporte.length - 1] + ".xlsx");
                    blockUI.stop();
                }

            }).catch(function (err) {
                var men = (err.data !== undefined && err.data !== null) ? err.data : err.message
                $scope.mostrarMensaje('Se produjo un error! ' + men)
                blockUI.stop();
            })
        }

        $scope.reportePorMesesPdf = function (reporte, mesDesde, anioDesde, mesHasta, anioHasta) {
            var x = 40
            var y = 120
            var spaceY = 25
            var spaceX = 45
            convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                var imagen = imagenEmpresa;
                var len = reporte[0].length - 8
                var margen = 10
                if (len == 12) {
                    x = 30
                }
                var limiteChar = 46
                var doc = new PDFDocument({ size: [612, 792], margin: 10, compress: false });
                var stream = doc.pipe(blobStream());
                doc.image(imagen, 40, 40, { width: 60, height: 60 });
                for (var i = 0; i <= (reporte.length - 1); i++) {
                    if (reporte[i].length < 15) {
                        if (i == 0) {
                            doc.font('Helvetica-Bold', 12);
                            doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO11", 50, 30, { align: "center" });
                            doc.text("DESDE " + mesDesde.nombre + "-" + anioDesde.id + " HASTA " + mesHasta.nombre + "-" + anioHasta.id, 50, 45, { align: "center" });
                            doc.text(" TODOS LOS CAMPOS " + " TODOS LOS EMPLEADOS", 50, 60, { align: "center" });
                        }
                        for (let j = 0; j < reporte[i].length; j++) {
                            if (i > 0) {
                                doc.font('Helvetica', 8);
                            } else {
                                doc.font('Helvetica-Bold', 8);
                            }
                            if (j == 0) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar });
                                x = x - 30
                            }
                            if (j > 0 && j < 5) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                            }
                            if (j > 4 && j < reporte[i].length - 3) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                                x = x - 10
                            }
                            if (j >= reporte[i].length - 3) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                            }
                            x += spaceX
                        }
                    }
                    if (reporte[i].length > 14 && reporte[i].length <= 20) {
                        if (i == 0) {
                            doc.font('Helvetica-Bold', 12);
                            doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO", 50, 30, { align: "center" });
                            doc.text("DESDE " + mesDesde.nombre + "-" + anioDesde.id + " HASTA " + mesHasta.nombre + "-" + anioHasta.id, 50, 45, { align: "center" });
                            doc.text(" TODOS LOS CAMPOS " + " TODOS LOS EMPLEADOS", 50, 60, { align: "center" });
                        }
                        for (let j = 0; j < reporte[i].length; j++) {
                            if (i > 0) {
                                doc.font('Helvetica', 7);
                            } else {
                                doc.font('Helvetica-Bold', 7);
                            }
                            if (j == 0) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar });
                                x = x - 35
                            }
                            if (j > 0 && j < 5) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                                x = x - 5
                            }
                            if (j > 4 && j < reporte[i].length - 3) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                                x = x - 15
                            }
                            if (j >= reporte[i].length - 3) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                            }
                            x += spaceX - 5
                        }
                    }

                    if (len == 12) {
                        x = 30
                    }
                    if (len < 12 && len > 10) {
                        x = 35
                    }
                    if (len < 10) {
                        x = 40
                    }
                    y += spaceY
                    if (y > 700) {
                        doc.addPage({ size: 'letter', margin: 10 });
                        y = 120
                    }
                }
                
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                    
                });
                
            });
        }

        $scope.reportePromediosGeneralGrafico = function (reporte, year, campo, tipo) {
            $scope.abriridModalReportesGrafico()
            var x = 10
            $scope.graficoType = "column"
            if (tipo) {
                $scope.graficoType = tipo
            }

            var dataPointsReporte = []
            reporte.map(function (row, i) {
                if (i != 0) {
                    var dato = { x: x, y: row[9], label: row[0] }
                    dataPointsReporte.push(dato)
                    x += 10
                }
            })
            var chart = new CanvasJS.Chart("chartContainer",
                {
                    title: {
                        text: ("Reporte promedio general campo " + campo + " gestión " + year.id).toUpperCase(),
                        fontSize: 32

                    },
                    animationEnabled: true,
                    exportEnabled: true,
                    zoomEnable: true,
                    width: 1100,
                    axisX: {
                        title: "Promedio total mensual",
                        // titleFontFamily: "comic sans ms"
                    },
                    data: [-
                        {
                            type: $scope.graficoType,
                            dataPoints: dataPointsReporte
                        }
                    ]
                });
            chart.render();
            blockUI.stop();
        }

        $scope.reportePromediosGeneralExcel = function (year, campo, pdf, grafico) {
            blockUI.start()
            if (year === null || year === undefined || campo === undefined || campo === null) {
                $scope.mostrarMensaje('Ingrese el Campo y el Año del cual desea el reporte.')
                return
            }
            if (pdf) {
                var cabecera = ["", "Asistencia Capacitación", "Documentos Actualizados", "Trabajo en equipo", "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo",
                    "Higiene personal", "Puntualidad a la asistencia de reunión de 5 minutos en campo", "Cumplimiento de ingreso a campo", "Aplicación y llenado correcto de los formularios del SIG", "TOTAL", "DESEMPEÑO"]
                var data = []
            } else {
                var cabecera = [" ", "Asistencia Capacitación", "Documentos Actualizados", "Trabajo en equipo", "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo",
                    "Higiene personal", "Puntualidad a la asistencia de reunión de 5 minutos en campo", "Cumplimiento de ingreso a campo", "Aplicación y llenado correcto de los formularios del SIG", "TOTAL", "DESEMPEÑO"]
                var data = [[""], [""], [""]]
            }
            data.push(cabecera)
            var reporte = ObtenerReporteGeneralPorAnio(year.id, campo)
            reporte.then(function (res) {
                if (res.reporte.length == 0) {
                    $scope.mostrarMensaje('No existen datos')
                    return
                }
                for (var i = 0; i < res.reporte.length; i++) {
                    var columns = [];
                    columns.push($scope.meses[res.reporte[i].mes].nombre);
                    columns.push(res.reporte[i].asistencia_capacitacion);
                    columns.push(res.reporte[i].documentos_actualizados);
                    columns.push(res.reporte[i].trabajo_equipo);
                    columns.push(res.reporte[i].funciones_puntualidad);
                    columns.push(res.reporte[i].higiene_personal);
                    columns.push(res.reporte[i].asistencia_reunion);
                    columns.push(res.reporte[i].ingreso_campo);
                    columns.push(res.reporte[i].llenado_formularios);
                    columns.push(res.reporte[i].total);
                    listaDesempenio.map(function (desempenio) {
                        if (res.reporte[i].total >= desempenio.desde && res.reporte[i].total <= desempenio.hasta) {
                            columns.push($scope.determinarDesempenio(desempenio.id))
                        }
                    })
                    data.push(columns);
                }
                if (pdf) {
                    if (grafico) {
                        
                        $scope.reportePromediosGeneralGrafico(data, year, campo)
                    } else {
                        blockUI.stop();
                        $scope.reportePromediosGeneralPdf(data, year, campo)
                    }
                } else {
                    var ws_name = "SheetJS";
                    var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
                    var wscols = [
                        { wch: 12 },
                        { wch: 19 },
                        { wch: 20 },
                        { wch: 16 },
                        { wch: 25 },
                        { wch: 15 },
                        { wch: 25 },
                        { wch: 25 },
                        { wch: 25 },
                        { wch: 8 },
                        { wch: 12 }
                    ];
                    ws['!cols'] = wscols;
                    ws['!rows'] = [{ hpx: 28, level: 3 }];
                    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }]
                    /* add worksheet to workbook */
                    wb.SheetNames.push(ws_name);
                    wb.Sheets[ws_name] = ws;
                    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE POLIFUNCIONAL Campo " + campo + " : " + anio.id + ".xlsx");
                    blockUI.stop();
                }

            }).catch(function (err) {
                var men = (err.data !== undefined && err.data !== null) ? err.data : err.message
                $scope.mostrarMensaje('Se produjo un error! > ' + men)
                blockUI.stop();
            })
        }

        $scope.reportePromediosGeneralPdf = function (reporte, year, campo) {
            var x = 20
            var y = 180
            var spaceY = 25
            var spaceX = 70
            var taa = 20
            convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                var imagen = imagenEmpresa;
                var len = reporte[0].length - 8
                var margen = 10
                var limiteChar = 70
                var doc = new PDFDocument({ size: [792, 612], margin: 10, compress: false });
                var stream = doc.pipe(blobStream());
                doc.image(imagen, 40, 40, { width: 60, height: 60 });
                for (var i = 0; i <= (reporte.length - 1); i++) {
                    if (i == 0) {
                        doc.font('Helvetica-Bold', 12);
                        doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO", 50, 40, { align: "center" });
                        doc.text("GESTIÓN " + year.id, 50, 55, { align: "center" });
                        doc.text(" " + campo.toUpperCase() + " ", 50, 70, { align: "center" });
                    }
                    for (let j = 0; j < reporte[i].length; j++) {
                        if (j > 0) {
                            if (i == 0) {
                                doc.font('Helvetica-Bold', 7);
                                if (j >= reporte[i].length - 2) {

                                    doc.text(reporte[i][j], x - taa, y - 40, { width: limiteChar, align: "center" });
                                    taa = taa + 20
                                } else {
                                    doc.text(reporte[i][j], x, y - 40, { width: limiteChar, align: "center" });
                                }
                            } else {
                                doc.font('Helvetica', 8);
                                if (j >= reporte[i].length - 2) {
                                    if (j == reporte[i].length - 1) {
                                        doc.text(reporte[i][j], x - taa, y, { width: limiteChar, align: "center" });
                                    } else {
                                        doc.text(reporte[i][j].toFixed(2), x - taa, y, { width: limiteChar, align: "center" });
                                    }
                                    taa = taa + 20
                                } else {
                                    doc.text(reporte[i][j].toFixed(2), x, y, { width: limiteChar, align: "center" });
                                    taa = 20
                                }
                            }
                        } else {
                            doc.font('Helvetica-Bold', 8);
                            doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                        }
                        x += spaceX
                    }
                    x = 25
                    y += spaceY
                    if (y > 700) {
                        doc.addPage({ size: 'letter', margin: 10 });
                        y = 120
                    }
                }
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
                
            });
        }

        $scope.reportePromediosCampoGrafico = function (reporte, year) {
            $scope.abriridModalReportesGrafico()
            var dataPointsReporte = []
            reporte.map(function (row, i) {
                if (i != 0) {
                    var x = 10
                    var datosCampo = []
                    row.map(function (dat, j) {
                        if (j != 0 && j <= 9) {
                            var col = { x: x, y: dat, label: reporte[0][j] }
                            datosCampo.push(col)
                            x += 10
                        }
                    })
                    var dato = {
                        type: "column",
                        showInLegend: true,
                        legendText: row[0].toUpperCase(),
                        dataPoints: datosCampo
                    }
                    dataPointsReporte.push(dato)
                }
            })
            var chart = new CanvasJS.Chart("chartContainer",
                {
                    title: {
                        text: ("Reporte anual por campos gestión " + year.id).toUpperCase(),
                        fontSize: 32
                    },
                    legend: {
                        horizontalAlign: "center", // left, center ,right 
                        verticalAlign: "top",  // top, center, bottom
                        fontSize: 15
                    },
                    animationEnabled: true,
                    exportEnabled: true,
                    width: 1100,
                    height: 600,
                    axisX: {
                        labelFontSize: 18
                    },
                    data: dataPointsReporte
                });
            chart.render();
            blockUI.stop();
        }

        $scope.reportePromediosCampoExcel = function (year, pdf, grafico) {
            blockUI.start()
            if (year === null || year === undefined) {
                $scope.mostrarMensaje('Ingrese el Año del cual desea el reporte.')
                return
            }
            if (pdf) {
                var cabecera = [" ", "Asistencia Capacitación", "Documentos Actualizados", "Trabajo en equipo", "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo",
                    "Higiene personal", "Puntualidad a la asistencia de reunión de 5 minutos en campo", "Cumplimiento de ingreso a campo", "Aplicación y llenado correcto de los formularios del SIG", "TOTAL", "DESEMPEÑO"]
                var data = []
            } else {
                var cabecera = [" ", "Asistencia Capacitación", "Documentos Actualizados", "Trabajo en equipo", "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo",
                    "Higiene personal", "Puntualidad a la asistencia de reunión de 5 minutos en campo", "Cumplimiento de ingreso a campo", "Aplicación y llenado correcto de los formularios del SIG", "TOTAL", "DESEMPEÑO"]
                var data = [[""], [""], [""]]
            }
            data.push(cabecera)
            var reporte = ObtenerReportePorAnio(year.id)
            reporte.then(function (reportes) {
                var columns = [];
                for (var i = 0; i < reportes.reporte.length; i++) {
                    columns = [];
                    columns.push(reportes.reporte[i].campo);
                    columns.push(reportes.reporte[i].asistencia_capacitacion);
                    columns.push(reportes.reporte[i].documentos_actualizados);
                    columns.push(reportes.reporte[i].trabajo_equipo);
                    columns.push(reportes.reporte[i].funciones_puntualidad);
                    columns.push(reportes.reporte[i].higiene_personal);
                    columns.push(reportes.reporte[i].asistencia_reunion);
                    columns.push(reportes.reporte[i].ingreso_campo);
                    columns.push(reportes.reporte[i].llenado_formularios);
                    columns.push(reportes.reporte[i].total);
                    listaDesempenio.map(function (desempenio) {
                        if (reportes.reporte[i].total >= desempenio.desde && reportes.reporte[i].total <= desempenio.hasta) {
                            columns.push($scope.determinarDesempenio(desempenio.id))
                        }
                    })
                    data.push(columns);
                }
                if (pdf) {
                    if (grafico) {
                        blockUI.stop();
                        $scope.reportePromediosCampoGrafico(data, year)
                    } else {
                        blockUI.stop();
                        $scope.reportePromediosCampoPdf(data, year)
                    }
                } else {
                    var ws_name = "SheetJS";
                    var wb = new Workbook()
                    var ws = sheet_from_array_of_arrays(data);
                    var wscols = [
                        { wch: 12 },
                        { wch: 19 },
                        { wch: 20 },
                        { wch: 16 },
                        { wch: 25 },
                        { wch: 15 },
                        { wch: 25 },
                        { wch: 25 },
                        { wch: 25 },
                        { wch: 8 },
                        { wch: 12 }
                    ];
                    ws['!cols'] = wscols;
                    ws['!rows'] = [{ hpx: 28, level: 3 }]
                    wb.SheetNames.push(ws_name);
                    wb.Sheets[ws_name] = ws;
                    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true });
                    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE ANUAL POLIFUNCIONAL POR CAMPOS " + year.id + ".xlsx");
                    blockUI.stop();
                }
            })
        }

        $scope.reportePromediosCampoPdf = function (reporte, year) {
            var x = 20
            var y = 180
            var spaceY = 15
            var spaceX = 70
            var taa = 20
            convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                var imagen = imagenEmpresa;
                var len = reporte[0].length - 8
                var margen = 10

                var limiteChar = 70
                var doc = new PDFDocument({ size: [792, 612], margin: 10, compress: false });
                var stream = doc.pipe(blobStream());
                doc.image(imagen, 40, 40, { width: 60, height: 60 });
                for (var i = 0; i <= (reporte.length - 1); i++) {

                    if (i == 0) {
                        doc.font('Helvetica-Bold', 12);
                        doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO", 50, 40, { align: "center" });
                        doc.text("GESTIÓN " + year.id, 50, 55, { align: "center" });
                        // doc.text(" " + campo.toUpperCase() + " ", 50, 70, { align: "center" });
                    }

                    for (let j = 0; j < reporte[i].length; j++) {
                        if (j > 0) {
                            if (i == 0) {
                                doc.font('Helvetica-Bold', 7);
                                if (j >= reporte[i].length - 2) {
                                    doc.text(reporte[i][j], x - taa, y - 40, { width: limiteChar, align: "center" });
                                    taa = taa + 20
                                } else {
                                    doc.text(reporte[i][j], x, y - 40, { width: limiteChar, align: "center" });
                                }
                            } else {
                                doc.font('Helvetica', 8);
                                if (j >= reporte[i].length - 2) {
                                    if (j == reporte[i].length -2) {
                                        doc.text(reporte[i][j].toFixed(2), x - taa, y, { width: limiteChar, align: "center" });
                                    }else{
                                        if (j == reporte[i].length-1) {
                                            doc.text(reporte[i][j], x - taa, y, { width: limiteChar, align: "center" });
                                        }else{
                                            doc.text(reporte[i][j].toFixed(2), x - taa, y, { width: limiteChar, align: "center" });
                                        }
                                    }
                                    taa = taa + 20
                                } else {
                                    doc.text(reporte[i][j].toFixed(2), x, y, { width: limiteChar, align: "center" });
                                    taa = 20
                                }
                            }
                        } else {
                            doc.font('Helvetica-Bold', 8);
                            doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                        }
                        x += spaceX
                    }
                    x = 25
                    y += spaceY
                    if (y > 700) {
                        doc.addPage({ size: 'letter', margin: 10 });
                        y = 120
                    }
                }
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
            });
        }

        $scope.obtenerEvaluaciones = function () {
            blockUI.start()
            $scope.filtro = $scope.filtrarFiltroPolifuncionalidad($scope.filtro, true)
            $scope.paginator.filter = $scope.filtro
            var prom = ObtenerEvaluaciones($scope.paginator)
            prom.then(function (res) {
                $scope.evaluaciones = res.evaluaciones.rows
                $scope.paginator.setPages(res.paginas)
                if (res.mensaje !== undefined) {
                    $scope.mostrarMensaje(res.mensaje)
                }
                $scope.resetFiltro()
                $scope.cerrarPopPupNuevoPolifuncional()
            }, function (err) {
                $scope.mostrarMensaje(err.data !== undefined ? err.data : err.message)
            })
            blockUI.stop()
        }

        $scope.resetFiltro = function () {
            $scope.filtro = { id_empresa: $scope.usuarioSesion.empresa.id, mes: "", anio: "", desempenio: "", mas_campo: "", campo: "", cargo: "", estado: "", codigo: "", nombre: "", apellido: "", pagina: 1, items_pagina: 10 }
        }

        $scope.filtrarFiltroPolifuncionalidad = function (filtro, _) {
            if (_ === undefined) {
                $scope.obtenerEvaluaciones()
            } else {
                for (var key in filtro) {
                    if (filtro[key] === "" || filtro[key] === null) {
                        filtro[key] = 0
                    }
                }
                return filtro
            }
        }

        $scope.obtenerColumnasAplicacion = function () {
            blockUI.start();
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuarioSesion.id_empresa,
                configuracion: {
                    anio: { value: "Año", show: true },
                    mes: { value: "Mes", show: true },
                    estado: { value: "Estado", show: true },
                    codigo: { value: "Código", show: true },
                    nombre: { value: "Nombre completo", show: true },
                    campo: { value: "Campo", show: true },
                    cargo: { value: "Cargo", show: true },
                    asis_capacitacion: { value: "Asistencia Capacitación", show: true },
                    doc_actualizados: { value: "Documentos Actualizados", show: true },
                    trab_equipo: { value: "Trabajo en equipo", show: true },
                    funciones_puntualidad: { value: "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo", show: true },
                    higiene: { value: "Higiene personal", show: true },
                    puntualidad_asistencia_campo: { value: "Puntualidad a la asistencia de reunión de 5 minutos en campo", show: true },
                    ingreso_campo: { value: "Cumplimiento de ingreso a campo", show: true },
                    llenado_correcto_sig: { value: "Aplicación y llenado correcto de los formularios del SIG", show: true },
                    nota_total: { value: "Nota total", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
            blockUI.stop();
        }

        $scope.obtenerCargos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_CARGO");
            promesa.then(function (entidad) {
                $scope.cargos = entidad.clases
                blockUI.stop();
            }, function (err) {
                $scope.mostrarMensaje('Se produjo un error : ' + err.message !== undefined ? err.message : err.data)
                blockUI.stop();
            })
        }

        $scope.obtenerCentroCosto = function () {
            blockUI.start();
            var promesa = ClasesTipo('CENCOS')
            promesa.then(function (dato) {
                $scope.centrosCostos = dato.clases
                blockUI.stop();
            }, function (err) {
                $scope.mostrarMensaje('Se produjo un error : ' + err.message !== undefined ? err.message : err.data)
                blockUI.stop();
            })
        }

        $scope.buscarPersonal = function (query) {
            if (query != "" && query != undefined) {
                var promesa = $filter('filter')($scope.todoPersonal, query);
                return promesa;
            }
        }

        $scope.filtrarPersonal = function (query) {
            if ($scope.todoPersonal !== undefined) {
                $scope.personalProcesado = $filter('filter')($scope.todoPersonal, query);
            } else {
                var prom = ObtenerTodoPersonal($scope.usuarioSesion.empresa.id)
                prom.then(function (personal) {
                    $scope.todoPersonal = personal.personal
                    $scope.personalProcesado = personal.personal
                    if (personal.mensaje !== undefined) {
                        $scope.mostrarMensaje(personal.mensaje)
                    }
                }, function (err) {
                    $scope.mostrarMensaje(err.message !== undefined ? err.message : err.data)
                })
            }
        }

        $scope.establecerPersonal = function (personal, modal) {
            if ($scope.evaluacion === undefined) {
                $scope.evaluacion = {}
            }
            var personalSeleccionado = { id: personal.id, persona: { nombre_completo: personal.persona.nombre_completo } }
            $scope.evaluacion.personal = personalSeleccionado

            if (modal !== undefined) {
                $scope.cerrarmodalBusquedaPersonal()
            }
        }

        $scope.abriridModalReportes = function () {
            $scope.abrirPopup($scope.idModalReportes);
        }

        $scope.cerraridModalReportes = function () {
            $scope.cerrarPopup($scope.idModalReportes);
        }

        $scope.abriridModalReportesGrafico = function () {
            $scope.abrirPopup($scope.reporteGraficoPolifuncional);
        }

        $scope.cerraridModalReportesGrafico = function () {
            $scope.cerrarPopup($scope.reporteGraficoPolifuncional);
        }

        $scope.abrirNuevoEvaluacionPolifuncional = function () {
            $scope.evaluacion = {}
            $scope.evaluacion.mes = { id: new Date().getMonth() }
            $scope.evaluacion.anio = { id: new Date().getFullYear() }
            $scope.abrirPopup($scope.idModalWizardPolifuncionalEdicion);
        }

        $scope.cerrarPopPupNuevoPolifuncional = function () {
            $scope.evaluacion = undefined
            $scope.cerrarPopup($scope.idModalWizardPolifuncionalEdicion);
        }

        $scope.abrirmodalParametrosPolifuncionalidad = function () {
            $scope.abrirPopup($scope.idModalWizardConceptoEdicion2);
        }

        $scope.cerrarmodalParametrosPolifuncionalidad = function () {
            $scope.cerrarPopup($scope.idModalWizardConceptoEdicion2);
        }

        $scope.abrirmodalBusquedaPersonal = function () {
            $scope.filtrarPersonal("")
            $scope.abrirPopup($scope.modalBusquedaPersonal);
        }

        $scope.cerrarmodalBusquedaPersonal = function () {
            $scope.cerrarPopup($scope.modalBusquedaPersonal);
        }

        $scope.guardarConfiguracionEvaluacion = function (parametros) {
            var button = $('#siguiente').text().trim();
            if (button != "Siguiente") {
                var paraEmpleados = {}
                var paraEncargados = {}
                var paraDesempeño = {}
                var configuracionPolifuncional = {}
            }
        }
        $scope.inicio();
    });