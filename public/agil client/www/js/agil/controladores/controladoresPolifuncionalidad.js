angular.module('agil.controladores')
    .controller('controladorPolifuncionalidad', function ($scope, $location, $localStorage, $templateCache, $route, blockUI, Paginator, FieldViewer, $timeout,
        $filter, ClasesTipo, ObtenerTodoPersonal, ObtenerEvaluaciones, GuardarEvaluacionPersonal, ObtenerReportePorMeses, ObtenerReportePorAnio, ObtenerReporteGeneralPorAnio, GuardarConfiguracionCalificacion,
        ObtenerConfiguracionCalificacion, GuardarConfiguracionDesempenio, ObtenerConfiguracionDesempenio, ActualizarEvaluacionPersonal) {

        $scope.usuarioSesion = JSON.parse($localStorage.usuario);
        $scope.idModalWizardPolifuncionalEdicion = 'modal-wizard-polifuncional-edicion';
        $scope.idModalContenedorPolifuncionalEdicion = 'modal-wizard-container-polifuncional-edicion';
        $scope.idModalWizardConceptoEdicion2 = 'modal-wizard-polifuncional-ac-edicion';
        $scope.idModalContenedorConceptoEdicion2 = 'modal-wizard-container-polifuncional-ac-edicion';
        $scope.modalBusquedaPersonal = 'dialog-Busqueda-personal-polifuncional'
        $scope.modalBusquedaCentroCosto = 'dialog-Busqueda-centro-costo-polifuncional'
        $scope.idModalReportes = 'dialog-reportes-polifuncional'
        $scope.reporteGraficoPolifuncional = 'reporte-grafico-polifuncional'

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsPolifuncionalidad($scope.idModalWizardPolifuncionalEdicion, $scope.idModalContenedorPolifuncionalEdicion, $scope.modalBusquedaPersonal,
                $scope.idModalWizardConceptoEdicion2, $scope.idModalContenedorConceptoEdicion2, $scope.idModalReportes, $scope.reporteGraficoPolifuncional, $scope.modalBusquedaCentroCosto);
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
            $scope.eliminarPopup($scope.modalBusquedaCentroCosto);
        });

        $scope.inicio = function () {
            $scope.obtenerCargos()
            $scope.obtenerCentroCosto()
            $scope.actualizarListaDesempenio()
            $scope.obtenerConfiguracionnotas()
            $scope.filtrarPersonal("")
            var filtro = { id_empresa: $scope.usuarioSesion.empresa.id, mes: 0, anio: 0, desempenio: 0, mas_campo: 0, campo: 0, cargo: 0, estado: 0, codigo: 0, nombre: 0, apellido: 0, pagina: 1, items_pagina: 10, columna: 0, direccion: 0 }
            $scope.obtenerPaginador()
        }

        $scope.eliminar = function (evaluacion) {
            evaluacion.eliminado = true
            evaluacion.eliminar = true
            var prom = GuardarEvaluacionPersonal($scope.usuarioSesion.empresa.id, evaluacion)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje("Hubo un error no se pudo eliminar: " + res.mensaje)
                } else {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.recargarItemsTabla()
                }
            }, function (err) {
                $scope.mostrarMensaje("No hay respuesta del servidor, se perdió la conexión: " + res.mensaje)
            })
        }
        $scope.obtenerConfiguracionnotas = function () {
            var prom = ObtenerConfiguracionCalificacion($scope.usuarioSesion.empresa.id)
            prom.then(function (res) {
                for (const key in res.configuracion) {
                    if (res.configuracion[key].encargados) {
                        $scope.encargados = res.configuracion[key];
                    } else {
                        $scope.empleados = res.configuracion[key];
                    }
                }
                var otraProm = ObtenerConfiguracionDesempenio($scope.usuarioSesion.empresa.id)
                otraProm.then(function (res) {
                    $scope.parametros = res.parametros
                    while (res.parametros.length > 0) {
                        var dato = res.parametros.pop()
                        $scope.listaDesempenio.map(function (configuracion) {
                            if (configuracion.nombre == dato.nombre) {
                                configuracion.desde = dato.desde
                                configuracion.hasta = dato.hasta
                            }
                        })
                    }
                })
            }).catch(function (err) {
                $scope.mostrarMensaje(err.stack ? err.stack : err.message)
            })
        }

        $scope.editar = function (evaluacion, editar, nuevo, ver) {
            $scope.abrirNuevoEvaluacionPolifuncional()
            if (ver) {
                $scope.evaluacion = {
                    encargado: evaluacion.encargado,
                    anio: { id: evaluacion.anio },
                    mes: { id: evaluacion.mes },
                    asistencia_capacitacion: evaluacion.asistencia_capacitacion,
                    asistencia_reunion: evaluacion.asistencia_reunion,
                    documentos_actualizados: evaluacion.documentos_actualizados,
                    funciones_puntualidad: evaluacion.funciones_puntualidad,
                    higiene_personal: evaluacion.higiene_personal,
                    ingreso_campo: evaluacion.ingreso_campo,
                    llenado_formularios: evaluacion.llenado_formularios,
                    trabajo_equipo: evaluacion.trabajo_equipo,
                    nota_total: evaluacion.nota_total,
                    id: evaluacion.id,
                    id_desempenio: evaluacion.id_desempenio,
                    id_empleado: evaluacion.id_empleado,
                    personal: { id: evaluacion.empleado.id, persona: { nombre_completo: evaluacion.empleado.persona.nombre_completo } }
                }
                $scope.evaluacion.ver = true
            }
            if (editar) {
                $scope.evaluacion = {
                    encargado: evaluacion.encargado,
                    anio: { id: evaluacion.anio },
                    mes: { id: evaluacion.mes },
                    asistencia_capacitacion: evaluacion.asistencia_capacitacion,
                    asistencia_reunion: evaluacion.asistencia_reunion,
                    documentos_actualizados: evaluacion.documentos_actualizados,
                    funciones_puntualidad: evaluacion.funciones_puntualidad,
                    higiene_personal: evaluacion.higiene_personal,
                    ingreso_campo: evaluacion.ingreso_campo,
                    llenado_formularios: evaluacion.llenado_formularios,
                    trabajo_equipo: evaluacion.trabajo_equipo,
                    nota_total: evaluacion.nota_total,
                    id: evaluacion.id,
                    id_desempenio: evaluacion.id_desempenio,
                    id_empleado: evaluacion.id_empleado,
                    personal: { id: evaluacion.empleado.id, persona: { nombre_completo: evaluacion.empleado.persona.nombre_completo } }
                }
                $scope.evaluacion.editar = true
            }
            if (nuevo) {
                $scope.evaluacion.encargado = evaluacion.encargado
                $scope.evaluacion.id_desempenio = evaluacion.id_desempenio
                $scope.evaluacion.id_empleado = evaluacion.id_empleado
                $scope.evaluacion.personal = { id: evaluacion.empleado.id, persona: { nombre_completo: evaluacion.empleado.persona.nombre_completo } }
                $scope.evaluacion.nuevo = true
                var button = $('#siguiente').trigger("click");
            }
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
        var errorDesempenio = { nombre: 'ERROR', color: "bg-red" }

        $scope.listaDesempenio = [
            { nombre: 'Deficiente', desde: 0, hasta: 25, color: "bg-red" },
            { nombre: 'Insatisfactorio', desde: 26, hasta: 50, color: "bg-yellow" },
            { nombre: 'Satisfactorio', desde: 51, hasta: 75, color: "bg-orange-green" },
            { nombre: 'Competente', desde: 76, hasta: 100, color: "bg-blue" }
        ]

        $scope.actualizarListaDesempenio = function (lista) {
            if (lista == null || lista == undefined) {
                var prom = ObtenerConfiguracionDesempenio($scope.usuarioSesion.empresa.id)
                prom.then(function (res) {
                    while (res.parametros.length > 0) {
                        var dato = res.parametros.pop()
                        $scope.listaDesempenio.map(function (configuracion) {
                            if (configuracion.nombre == dato.nombre) {
                                configuracion.desde = dato.desde
                                configuracion.hasta = dato.hasta
                                configuracion.id = dato.id
                                configuracion.activo = dato.activo
                            }
                        })
                    }
                }).catch(function (err) {
                    $scope.mostrarMensaje(err.stack ? err.stack : err.message)
                })
            } else {
                var listado = lista.map(function (_) {
                    return _
                })
                while (listado.length > 0) {
                    var dato = listado.pop()
                    $scope.listaDesempenio.map(function (configuracion) {
                        if (configuracion.nombre == dato.nombre) {
                            configuracion.desde = dato.desde
                            configuracion.hasta = dato.hasta
                        }
                    })
                }
            }
        }

        $scope.listaEstados = [
            { id: 1, nombre: 'Activo' },
            { id: 2, nombre: 'Inactivo' }]

        $scope.determinarEstado = function (estado) {
            if (estado == true) {
                return $scope.listaEstados[1].nombre
            } else {
                return $scope.listaEstados[0].nombre
            }
        }

        $scope.determinarDesempenio = function (desempenio) {
            var indx = NaN
            if (desempenio == null || desempenio == undefined) {
                return "bg-red"
            } else {
                $scope.listaDesempenio.map(function (_, i) {
                    if (_.id == desempenio) {
                        indx = i
                    }
                })
                var retornoNombre = (indx !== NaN) ? $scope.listaDesempenio[indx].nombre : errorDesempenio.nombre
                var ss = 0
                return retornoNombre
            }

        }

        $scope.determinarColor = function (desempenio) {
            var indx = NaN
            if (desempenio == null || desempenio == undefined) {
                return "bg-red"
            } else {
                $scope.listaDesempenio.map(function (_, i) {
                    if (_.id == desempenio) {
                        indx = i
                    }
                })
                var retornoColor = (indx !== NaN) ? $scope.listaDesempenio[indx].color : errorDesempenio.color
                var ss = 0
                return retornoColor
            }
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
                    if ($scope.opcion[key]) {
                        total += evaluacion[key]
                    } else {
                        if (evaluacion.encargado) {
                            total += $scope.encargados[key]
                            evaluacion[key] = $scope.encargados[key]
                        } else {
                            total += $scope.empleados[key]
                            evaluacion[key] = $scope.empleados[key]
                        }
                    }
                    evaluacion.nota_total = total
                } else {
                    if ($scope.opcion[key]) {
                        total += evaluacion[key]
                    } else {
                        if (evaluacion.encargado) {
                            total += encargados[key]
                            evaluacion[key] = $scope.encargados[key]
                        } else {
                            total += empleados[key]
                            evaluacion[key] = $scope.empleados[key]
                        }
                    }
                }
            })
        }

        $scope.filtrarPolifuncionalidad = function (filtro, _) {
            for (var key in filtro) {
                if (filtro[key] === "" || filtro[key] === null) {
                    filtro[key] = 0
                }
            }
            if (_ === undefined) {
                $scope.obtenerProformas()
                // $scope.recargarItemsTabla()
            } else {
                return filtro
            }
        }

        $scope.calcularNotaTotalConfiguracion = function (empleados, encargados) {
            var notaEmpleados = 0
            var notaEncargados = 0
            if (empleados) {
                empleados.nota_total = 0
            }
            if (encargados) {
                encargados.nota_total = 0
            }

            for (const key in empleados) {
                if (key !== "createdAt" && key !== "updatedAt" && key !== "id_empresa" && key !== "id" && key !== "activo" && key !== "encargados") {
                    notaEmpleados += empleados[key]
                }

            }
            for (const key in encargados) {
                if (key !== "createdAt" && key !== "updatedAt" && key !== "id_empresa" && key !== "id" && key !== "activo" && key !== "encargados") {
                    notaEncargados += encargados[key]
                }
            }
            empleados.nota_total = notaEmpleados
            encargados.nota_total = notaEncargados
        }

        var validarPrimerStep = false
        var validarSteps = 0
        var stepOneComplete = false
        var stepTwoComplete = false
        $scope.validarDatosEvaluacion = function (evaluacion) {

            if (!stepOneComplete) {
                if (evaluacion === undefined || evaluacion === null) {
                    return true
                }
                if (evaluacion.personal === undefined || evaluacion.personal == null) {
                    return true
                } else {
                    stepOneComplete = true
                    validarSteps += 1
                    return false
                }
            } else {

                var count = 0
                for (const key in evaluacion) {
                    if (evaluacion.hasOwnProperty(key)) {
                        count += 1;
                    }
                }
                if (count == vars.length || count == 4 || (count == 7 && evaluacion.nuevo)) {
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
        }

        $scope.guardarEvaluacion = function (evaluacion) {
            var button = $('#siguiente').text().trim();
            if (button != "Siguiente") {
                blockUI.start()
                $scope.listaDesempenio.map(function (desempenio) {
                    if (evaluacion.nota_total >= desempenio.desde && evaluacion.nota_total <= desempenio.hasta) {
                        evaluacion.id_desempenio = desempenio.id
                    }
                })
                if (evaluacion.ver) {
                    $scope.cerrarPopPupNuevoPolifuncional()
                    blockUI.stop()
                } else {
                    evaluacion.fecha = new Date(evaluacion.anio.id, evaluacion.mes.id, 15, 12, 0, 0)
                    if (evaluacion.editar) {
                        var prom = ActualizarEvaluacionPersonal($scope.usuarioSesion.empresa.id, evaluacion)
                    } else {
                        var prom = GuardarEvaluacionPersonal($scope.usuarioSesion.empresa.id, evaluacion)
                    }
                    prom.then(function (res) {
                        $scope.mostrarMensaje(res.mensaje)
                        $scope.cerrarPopPupNuevoPolifuncional()
                        $scope.recargarItemsTabla()
                        blockUI.stop()
                    }, function (err) {
                        var meno = err.stack !== undefined ? err.stack : err.message
                        evaluacion.editar = undefined
                        $scope.mostrarMensaje("Se perdió la conexión." + meno)
                        blockUI.stop()
                    })
                }
            }
        }

        $scope.reportePorMesGrafico = function (reporte, mesesReporte) {
            $scope.abriridModalReportesGrafico()
            var dataPointsReporte = []
            reporte.forEach(function (row, i) {
                if (i != 0) {
                    var x = 10
                    var datosCampo = []
                    row.forEach(function (dat, j) {
                        if (j > 5 && j <= row.length - 2) {
                            var col = { y: dat !== '-' ? dat : 0, label: row.length - 2 != j ? mesesReporte[j - 6] : 'TOTAL' }
                            datosCampo.push(col)
                            x += 10
                        }
                    })
                    var dato = {
                        type: "column",
                        interval: 0,
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
                        text: ("Reporte polifuncional desde " + mesesReporte[0] + " hasta " + mesesReporte[mesesReporte.length - 1]).toUpperCase(),
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
                blockUI.stop()
                return
            }
            var cabecera = ["N°", "Campo", "Empleado", "C.I.", "Estado", "Cargo"]
            var report = []
            if (pdf === undefined) {
                var wscols = [
                    // { wch: 4 },
                    { wch: 4 },
                    { wch: 12 },
                    { wch: 20 },
                    { wch: 9 },
                    { wch: 8 },
                    { wch: 9 }
                ];                
            }
            var data = []
            var reporte = ObtenerReportePorMeses(fromMonth, fromYear, untilMonth, untilYear, $scope.usuarioSesion.empresa.id)
            reporte.then(function (res) {
                if (res.reporte.length == 0) {
                    $scope.mostrarMensaje('No existen datos')
                    blockUI.stop()
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
                    var columns = [];
                    columns.push(i + 1);
                    columns.push(res.reporte[i].campo.nombre);
                    columns.push(res.reporte[i].persona.nombre_completo);
                    columns.push(res.reporte[i].persona.ci);
                    columns.push($scope.determinarEstado(res.reporte[i].eliminado));
                    columns.push(res.reporte[i].empleadosFichas[res.reporte[i].empleadosFichas.length - 1].cargos.length > 0 ? res.reporte[i].empleadosFichas[res.reporte[i].empleadosFichas.length - 1].cargos[0].cargo.nombre : 'Sin cargo');
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
                    $scope.listaDesempenio.map(function (desempenio) {
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
                var limiteChar = 50
                var doc = new PDFDocument({ size: [612, 792], margin: 10, compress: false });
                var stream = doc.pipe(blobStream());
                doc.image(imagen, 40, 30, { fit: [85, 85] });
                for (var i = 0; i <= (reporte.length - 1); i++) {
                    if (reporte[i].length <= 14) {
                        if (i == 0) {
                            doc.font('Helvetica-Bold', 12);
                            doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO", 50, 30, { align: "center" });
                            doc.text("DESDE " + mesDesde.nombre.toUpperCase() + "-" + anioDesde.id + " HASTA " + mesHasta.nombre.toUpperCase() + "-" + anioHasta.id, 50, 45, { align: "center" });
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
                                if ((j == 2 || j == 1 || j == 5) && i >= 1) {
                                    doc.font('Helvetica', 5);
                                }
                                doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                            }
                            if (j > 4 && j < reporte[i].length - 3) {
                                if (j == 5) {
                                    doc.text(reporte[i][j].toLowerCase(), x, y, { width: limiteChar, align: "center" });
                                } else {
                                    doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                                }

                                x = x - 10
                            }
                            if (j >= reporte[i].length - 3) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar, align: "center" });
                            }
                            x += spaceX
                        }
                    }
                    if (reporte[i].length >= 15 && reporte[i].length <= 23) {
                        if (i == 0) {
                            doc.font('Helvetica-Bold', 12);
                            doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO", 50, 30, { align: "center" });
                            doc.text("DESDE " + mesDesde.nombre + "-" + anioDesde.id + " HASTA " + mesHasta.nombre + "-" + anioHasta.id, 50, 45, { align: "center" });
                            doc.text(" TODOS LOS CAMPOS " + " TODOS LOS EMPLEADOS", 50, 60, { align: "center" });
                        }
                        for (let j = 0; j < reporte[i].length; j++) {
                            if (i > 0) {
                                doc.font('Helvetica', 6);
                            } else {
                                doc.font('Helvetica-Bold', 6);
                            }
                            if (j == 0) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar });
                                x = x - 40
                            }
                            if (j > 0 && j < 5) {
                                if ((j == 2 || j == 1) && i >= 1) {
                                    doc.font('Helvetica', 5);
                                }
                                doc.text(reporte[i][j], x, y, { width: limiteChar - 5, align: "center" });
                                x = x - 5
                            }
                            if (j > 4 && j < reporte[i].length - 3) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar - 5, align: "center" });
                                x = x - 15
                            }
                            if (j >= reporte[i].length - 3) {
                                doc.text(reporte[i][j], x, y, { width: limiteChar - 5, align: "center" });
                            }
                            x += spaceX - 5
                        }
                    }
                    if (len > 12) {
                        x = 20
                    }
                    if (len == 12) {
                        x = 30
                    }
                    if (len < 12 && len > 10) {
                        x = 35
                    }
                    if (len <= 10) {
                        x = 40
                    }
                    y += spaceY
                    if (y > 700) {
                        doc.addPage({ size: 'letter', margin: 10 });
                        
                        doc.font('Helvetica-Bold', 12);
                        doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO", 50, 30, { align: "center" });
                        doc.text("DESDE " + mesDesde.nombre + "-" + anioDesde.id + " HASTA " + mesHasta.nombre + "-" + anioHasta.id, 50, 45, { align: "center" });
                        doc.text(" TODOS LOS CAMPOS " + " TODOS LOS EMPLEADOS", 50, 60, { align: "center" });

                        for (let k = 0; k < reporte[0].length; k++) {
                            doc.font('Helvetica-Bold', 8);
                            doc.text(reporte[0][k], x, y-625, { width: limiteChar });

                            if (k == 0) {
                                // doc.text(reporte[i][j], x, y, { width: limiteChar });
                                x = x - 20
                            }
                            if (k == 2) {
                                x = x + 10
                            }
                            if (k > 4 && k < reporte[i].length - 3) {
                                x = x - 10
                            }

                            x += spaceX
                        }
                        if (len > 12) {
                            x = 20
                        }
                        if (len == 12) {
                            x = 30
                        }
                        if (len < 12 && len > 10) {
                            x = 35
                        }
                        if (len <= 10) {
                            x = 40
                        }
                        y = 120
                    }
                    
                }
                if (len > 12) {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.mostrarMensaje('ADVERTENCIA: El rango de fechas excede el tamaño máximo de impresion.')
                        })
                    }, 1000)

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
                    var dato = { y: row[9], label: row[0] }
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
                    // zoomEnable: true,
                    width: 1100,
                    axisX: {
                        title: "Promedio total mensual"
                        // titleFontFamily: "comic sans ms"
                    },
                    data: [
                        {
                            type: "column",
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
                blockUI.stop()
                return
            }
            var cabecera = ["", "Asistencia Capacitación", "Documentos Actualizados", "Trabajo en equipo", "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo",
                    "Higiene personal", "Puntualidad a la asistencia de reunión de 5 minutos en campo", "Cumplimiento de ingreso a campo", "Aplicación y llenado correcto de los formularios del SIG", "TOTAL", "DESEMPEÑO"]
                var data = []
            data.push(cabecera)
            var reporte = ObtenerReporteGeneralPorAnio(year.id, campo, $scope.usuarioSesion.empresa.id)
            reporte.then(function (res) {
                if (res.reporte.length == 0) {
                    $scope.mostrarMensaje('No existen datos')
                    blockUI.stop()
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
                    $scope.listaDesempenio.map(function (desempenio) {
                        if (res.reporte[i].total >= desempenio.desde && res.reporte[i].total <= desempenio.hasta) {
                            columns.push($scope.determinarDesempenio(desempenio.id))
                        }
                    })
                    data.push(columns);
                }
                if (pdf) {
                    if (grafico) {
                        blockUI.stop()
                        $scope.reportePromediosGeneralGrafico(data, year, campo.nombre)
                    } else {
                        blockUI.stop();
                        $scope.reportePromediosGeneralPdf(data, year, campo.nombre)
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
                    // ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }]
                    /* add worksheet to workbook */
                    wb.SheetNames.push(ws_name);
                    wb.Sheets[ws_name] = ws;
                    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE POLIFUNCIONAL CAMPO " + campo.nombre + " : " + anio.id + ".xlsx");
                    blockUI.stop();
                }

            }).catch(function (err) {
                var men = (err.data !== undefined && err.data !== null) ? err.data : (err.message !== null && err.message !== undefined) ? err.message : (err.stack !== undefined && err.stack !== null) ? err.stack: 'Se perdió la conexión al servidor.'
                $scope.mostrarMensaje('Se produjo un error! ' + men)
                blockUI.stop();
            })
        }

        $scope.reportePromediosGeneralPdf = function (reporte, year, campo) {
            var x = 15
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
                doc.image(imagen, 40, 40, { fit: [85, 85] });
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

                                    doc.text(reporte[i][j], x - taa,  y - 40, { width: limiteChar, align: "center" });
                                    taa = taa + 20
                                } else {
                                    doc.text(reporte[i][j], x , y - 40, { width: limiteChar, align: "center" });
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
                blockUI.stop();
                $scope.mostrarMensaje('Ingrese el Año del cual desea el reporte.')
                return
            }
            var cabecera = [" ", "Asistencia Capacitación", "Documentos Actualizados", "Trabajo en equipo", "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo",
                    "Higiene personal", "Puntualidad a la asistencia de reunión de 5 minutos en campo", "Cumplimiento de ingreso a campo", "Aplicación y llenado correcto de los formularios del SIG", "TOTAL", "DESEMPEÑO"]
                var data = []
            data.push(cabecera)
            var reporte = ObtenerReportePorAnio(year.id, $scope.usuarioSesion.empresa.id)
            reporte.then(function (reportes) {
                var columns = [];
                for (var i = 0; i < reportes.reporte.length; i++) {
                    columns = [];
                    columns.push((reportes.reporte[i].campo !== null && reportes.reporte[i].campo != undefined) ? reportes.reporte[i].campo.nombre : "");
                    columns.push(reportes.reporte[i].asistencia_capacitacion);
                    columns.push(reportes.reporte[i].documentos_actualizados);
                    columns.push(reportes.reporte[i].trabajo_equipo);
                    columns.push(reportes.reporte[i].funciones_puntualidad);
                    columns.push(reportes.reporte[i].higiene_personal);
                    columns.push(reportes.reporte[i].asistencia_reunion);
                    columns.push(reportes.reporte[i].ingreso_campo);
                    columns.push(reportes.reporte[i].llenado_formularios);
                    columns.push(reportes.reporte[i].total);
                    $scope.listaDesempenio.map(function (desempenio) {
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
                    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
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
            var itemsPorPagina = 25
            var items = 0
            var taa = 20
            convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                var imagen = imagenEmpresa;
                var len = reporte[0].length - 8
                var margen = 10
                var pagina = 1
                var limiteChar = 70
                var doc = new PDFDocument({ size: [792, 612], margin: 10, compress: false });
                var stream = doc.pipe(blobStream());
                doc.image(imagen, 40, 40, { fit: [85, 85] });
                for (var i = 0; i <= (reporte.length - 1); i++) {

                    if (i == 0) {
                        doc.font('Helvetica-Bold', 12);
                        doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO", 50, 40, { align: "center" });
                        doc.text("GESTIÓN " + year.id, 50, 55, { align: "center" });
                        doc.font('Helvetica', 12);
                        doc.text(pagina, 730, 585, { width: limiteChar, align: "center" });
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
                                    if (j == reporte[i].length - 2) {
                                        doc.text(reporte[i][j].toFixed(2), x - taa, y, { width: limiteChar, align: "center" });
                                    } else {
                                        if (j == reporte[i].length - 1) {
                                            doc.text(reporte[i][j], x - taa, y, { width: limiteChar, align: "center" });
                                        } else {
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
                    items += 1
                    y += spaceY
                    if (y > 580) {

                        doc.addPage({ size: [792, 612], margin: 10 });

                        pagina += 1
                        doc.font('Helvetica', 12);
                        doc.text(pagina, 730, y, { width: limiteChar, align: "center" });
                        doc.font('Helvetica-Bold', 12);
                        doc.text("MATRIZ POLIFUNCIONALIDAD Y DESEMPEÑO", 50, 40, { align: "center" });
                        doc.text("GESTIÓN " + year.id, 50, 55, { align: "center" });
                        taa = 20
                        y = 120
                        doc.font('Helvetica-Bold', 7);
                        for (let k = 0; k < reporte[0].length; k++) {
                            if (k >= reporte[0].length - 2) {
                                doc.text(reporte[0][k], x - taa, y - 40, { width: limiteChar, align: "center" });
                                taa = taa + 20
                            } else {
                                doc.text(reporte[0][k], x, y - 40, { width: limiteChar, align: "center" });
                            }
                            x += spaceX
                        }
                        // doc.font('Helvetica', 12);
                        // doc.text(pagina, x , y , { width: limiteChar, align: "center" });
                        x = 25
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
                //                 $scope.filtrarFiltroPolifuncionalidad($scope.filtro, true)
                blockUI.stop()
                // $scope.resetFiltro()
                /*  $scope.cerrarPopPupNuevoPolifuncional() */
            }).catch(function (err) {
                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.mostrarMensaje(err.data)
                    })
                }, 500)

                blockUI.stop()
            })
            // blockUI.stop()
        }

        $scope.resetFiltro = function () {
            $scope.filtro = { id_empresa: $scope.usuarioSesion.empresa.id, mes: "", anio: "", desempenio: "", mas_campo: "", campo: "", cargo: "", estado: "", codigo: "", nombre: "", apellido: "", pagina: 1, items_pagina: 10 }
        }

        $scope.filtrarFiltroPolifuncionalidad = function (filtro, _) {
            if (_ === undefined) {
                $scope.obtenerEvaluaciones()
            } else {
                for (var key in filtro) {
                    if (filtro[key] === null || filtro[key] === undefined) {
                        filtro[key] = 0
                    } else if ((filtro[key] == 0 || filtro[key] == "0") && (key == "codigo" || key == "nombre" || key == "apellido")) {
                        filtro[key] = ""
                    }
                }
                return filtro
            }
        }

        $scope.obtenerColumnasAplicacion = function () {
            blockUI.start();
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuarioSesion.empresa.id,
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
                $scope.mostrarMensaje("Se perdió la conexión.")
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
                $scope.mostrarMensaje("Se perdió la conexión.")
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
                    $scope.mostrarMensaje("Se perdió la conexión.")
                })
            }
        }

        $scope.filtrarCentroCosto = function (query) {
            // $scope.centrosDeCostosProcesado = $filter('filter')($scope.centrosDeCostos, query);
            if ($scope.centrosDeCostosProcesado !== undefined) {
                $scope.centrosDeCostosProcesado = $filter('filter')($scope.centrosDeCostos, query);
            } else {
                $scope.centrosDeCostosProcesado = $scope.centrosDeCostos

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

        $scope.establecercentroCosto = function (centroCosto, modal) {
            if ($scope.reporte === undefined) {
                $scope.reporte = {}
            }
            // var campoXanio = { id: centroCosto.id, nombre_corto: centroCosto.nombre, nombre: } }
            $scope.reporte.campoXanio = centroCosto

            if (modal !== undefined) {
                $scope.cerrarmodalBusquedaCentroCosto()
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
            if ($scope.evaluacion == undefined) {
                $scope.evaluacion = {}
                $scope.evaluacion.mes = { id: new Date().getMonth() }
                $scope.evaluacion.anio = { id: new Date().getFullYear() }
                $scope.evaluacion.encargado = false
                if ($scope.opcion == undefined) {
                    $scope.opcion = {}
                    vars.forEach(function (variable) {
                        $scope.opcion[variable] = true
                    })
                }
                vars.forEach(function (variable) {
                    $scope.evaluacion[variable] = 0
                })
                $scope.evaluacion.nota_total = 0
            }

            $scope.abrirPopup($scope.idModalWizardPolifuncionalEdicion);
        }

        $scope.cerrarPopPupNuevoPolifuncional = function () {
            $scope.evaluacion = {}
            $scope.evaluacion = undefined
            $scope.recargarItemsTabla()
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

        $scope.abrirmodalBusquedaCentroCosto = function () {
            $scope.filtrarCentroCosto("")
            $scope.abrirPopup($scope.modalBusquedaCentroCosto);
        }

        $scope.cerrarmodalBusquedaCentroCosto = function () {
            $scope.cerrarPopup($scope.modalBusquedaCentroCosto);
        }

        $scope.comprobarConfiguracion = function () {
            if ($scope.empleados) {
                var countempleado = 0
                for (const key in $scope.empleados) {
                    if ($scope.empleados.hasOwnProperty(key)) {
                        countempleado += 1
                    }
                }
            }
            if ($scope.encargados) {
                var countencargado = 0
                for (const key in $scope.encargados) {
                    if ($scope.encargados.hasOwnProperty(key)) {
                        countencargado += 1
                    }
                }
            }

            if (countempleado > 7 && countencargado > 7) {
                return false
            } else {
                return true
            }
        }

        $scope.guardarConfiguracionEvaluacion = function (parametros, encargados, empleados) {

            var button = $('#siguiente-conf').text().trim();
            if (button != "Siguiente") {
                blockUI.start()
                empleados.encargados = false
                encargados.encargados = true
                var errores = false
                var conf = [empleados, encargados]
                var prom = GuardarConfiguracionCalificacion($scope.usuarioSesion.empresa.id, conf)
                prom.then(function (res) {
                    if (res.hasErr) {
                        var rrores = res.mensaje
                        // errores = true
                        $scope.mostrarMensaje('Hubo un error. ' + res.mensaje)
                    }
                }, function (err) {
                    $scope.mostrarMensaje("No hubo respuesta del servidor, se perdió la conexión.")
                    // blockUI.stop()
                })
                // $scope.actualizarListaDesempenio($scope.listaDesempenio)
                var otraProm = GuardarConfiguracionDesempenio($scope.usuarioSesion.empresa.id, $scope.listaDesempenio)
                otraProm.then(function (resp) {
                    if (resp.hasErr) {
                        $scope.mostrarMensaje('Hubo uno o mas errores. ' + rrores + " " + resp.mensaje)
                    } else {
                        $scope.mostrarMensaje(resp.mensaje)
                    }
                    blockUI.stop()
                    $scope.recargarItemsTabla()
                })
                $scope.cerrarmodalParametrosPolifuncionalidad()
            }
        }
        $scope.inicio();
    });