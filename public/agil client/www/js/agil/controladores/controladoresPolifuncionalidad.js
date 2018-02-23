angular.module('agil.controladores')
    .controller('controladorPolifuncionalidad', function ($scope, $location, $localStorage, $templateCache, $route, blockUI, Paginator, FieldViewer,
        $filter, ClasesTipo, ObtenerTodoPersonal, ObtenerEvaluaciones, GuardarEvaluacionPersonal, ObtenerReportePorMeses) {

        $scope.usuarioSesion = JSON.parse($localStorage.usuario);
        $scope.idModalWizardPolifuncionalEdicion = 'modal-wizard-polifuncional-edicion';
        $scope.idModalContenedorPolifuncionalEdicion = 'modal-wizard-container-polifuncional-edicion';
        $scope.idModalWizardConceptoEdicion2 = 'modal-wizard-polifuncional-ac-edicion';
        $scope.idModalContenedorConceptoEdicion2 = 'modal-wizard-container-polifuncional-ac-edicion';
        $scope.modalBusquedaPersonal = 'dialog-Busqueda-personal-polifuncional'
        $scope.idModalReportes = 'dialog-reportes-polifuncional'

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsPolifuncionalidad($scope.idModalWizardPolifuncionalEdicion, $scope.idModalContenedorPolifuncionalEdicion, $scope.modalBusquedaPersonal,
                $scope.idModalWizardConceptoEdicion2, $scope.idModalContenedorConceptoEdicion2, $scope.idModalReportes);
            $scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion()
            blockUI.stop();
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalWizardPolifuncionalEdicion);
            $scope.eliminarPopup($scope.idModalWizardConceptoEdicion2);
            $scope.eliminarPopup($scope.idModalReportes);
            $scope.eliminarPopup($scope.modalBusquedaPersonal);

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
            { id: 1, nombre: 'Deficiente', desde: 0, hasta: 20, color: "bg-red" },
            { id: 2, nombre: 'Insatisfactorio', desde: 21, hasta: 40, color: "bg-yellow" },
            { id: 3, nombre: 'Satisfactorio', desde: 41, hasta: 60, color: "bg-orange-green" },
            { id: 4, nombre: 'Competente', desde: 61, hasta: 80, color: "bg-blue" }]

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
            vars.map(function (key, i) {
                if (evaluacion[key] !== null && evaluacion[key] !== undefined && evaluacion[key] >= 0) {
                    total += evaluacion[key]
                    evaluacion.nota_total = total
                }
            })
        }

        var validarPrimerStep = false
        var validarPrimerSteps = 0
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
                    if (validarPrimerSteps < 1) {
                        validarPrimerSteps += 1
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
                    // $scope.paginator.getSearch("", $scope.filtro, null);
                    blockUI.stop()
                }, function (err) {
                    $scope.mostrarMensaje(err.data !== undefined ? err.data : err.message)
                    blockUI.stop()
                })
            }
        }

        $scope.reportePorMesGrafico = function (month, year) {

        }

        $scope.reportePorMesExcel = function (fromMonth, fromYear, untilMonth, untilYear) {
            if (fromMonth === undefined || fromYear === undefined || untilMonth === undefined || untilYear === undefined || fromMonth === null || fromYear === null || untilMonth === null || untilYear === null) {
                $scope.mostrarMensaje('Ingrese desde que Mes/Año hasta que Mes/Año desea el reporte.')
                return
            }
            var cabecera = ["N°", "Campo", "Empleado", "C.I.", "Estado", "Cargo"]
            // var mesesReporte = []
            var data = []
            var report = []
            var endLoop = false
            var monthPlus = 0
            var yearPlus = 0
            var err = false
            var reporte = ObtenerReportePorMeses(fromMonth, fromYear, untilMonth, untilYear)
            reporte.then(function (res) {
                res.mesesReporte.map(function (fecha) {
                    cabecera.push(fecha)
                })
                mesesReporte = res.mesesReporte
                mesesReporte.map(function (mes) {

                })
                for (var i = 0; i < res.reporte.length; i++) {
                    var columns = [];
                    columns.push(i + 1);
                    columns.push(res.reporte[i].campo);
                    columns.push(res.reporte[i].persona.nombre_completo);
                    columns.push(res.reporte[i].persona.ci);
                    columns.push($scope.determinarEstado(res.reporte[i].eliminado));
                    columns.push(res.reporte[i].cargos && res.reporte[i].cargos.length > 0 ? res.reporte[i].cargos[0].cargo.nombre : 'Sin cargo');
                    var currentIndx = 0
                    var promedio = 0
                    mesesReporte.map(function (mes, j) {
                        var fechaCabecera = currentIndx <= res.reporte[i].evaluaciones.length - 1 ? $scope.meses[res.reporte[i].evaluaciones[currentIndx].mes].nombre.substring(0, 3) + '-' + (res.reporte[i].evaluaciones[currentIndx].anio).toString().substring(4, 2) : "0"
                        if (mes == fechaCabecera) {
                            columns.push((res.reporte[i].evaluaciones[currentIndx].nota_total))
                            promedio += res.reporte[i].evaluaciones[currentIndx].nota_total
                            currentIndx += 1

                        } else {
                            columns.push("-")
                        }
                    })
                    promedio = promedio / res.reporte[i].evaluaciones.length
                    columns.push((promedio))
                    listaDesempenio.map(function (desempenio) {
                        if (promedio >= desempenio.desde && promedio <= desempenio.hasta) {
                            columns.push($scope.determinarDesempenio(desempenio.id))
                        }
                    })
                    if (i == res.reporte.length - 1) {
                        cabecera.push("Promedio")
                        cabecera.push("Desempeño")
                    }
                    data.push(columns);
                }
                report.push(cabecera)
                data.map(function (row) {
                    report.push(row)
                })
                var ws_name = "SheetJS";
                var wb = new Workbook(), ws = sheet_from_array_of_arrays(report);
                /* add worksheet to workbook */
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                var rDesde = $scope.meses[fromMonth.id].nombre.substring(0, 3) + '-' + (fromYear.id).toString().substring(4, 2)
                var rHasta = $scope.meses[untilMonth.id].nombre.substring(0, 3) + '-' + (untilYear.id).toString().substring(4, 2)
                saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE POR MESES " + rDesde + " : " + rHasta + ".xlsx");
                blockUI.stop();

            }).catch(function (err) {
                var men = (err.data !== undefined && err.data !== null) ? err.data : err.message
                $scope.mostrarMensaje('Se produjo un error! > ' + men)
                blockUI.stop();
            })
        }

        $scope.reportePorMesPdf = function (month, year) {

        }

        $scope.reportePromediosGeneralGrafico = function (year, campo) {

        }

        $scope.reportePromediosGeneralExcel = function (year, campo) {
            if (year === null || year === undefined || campo === undefined || campo === null ) {
                $scope.mostrarMensaje('Ingrese el Campo y el Año del cual desea el reporte.')
                return
            }
            var cabecera = ["N°", "Campo", "Empleado", "C.I.", "Estado", "Cargo"]
            // var mesesReporte = []
            var data = []
            var report = []
            var endLoop = false
            var monthPlus = 0
            var yearPlus = 0
            var err = false
            var reporte = ObtenerReportePorMeses(fromMonth, fromYear, untilMonth, untilYear)
            reporte.then(function (res) {
                res.mesesReporte.map(function (fecha) {
                    cabecera.push(fecha)
                })
                mesesReporte = res.mesesReporte
                mesesReporte.map(function (mes) {

                })
                for (var i = 0; i < res.reporte.length; i++) {
                    var columns = [];
                    columns.push(i + 1);
                    columns.push(res.reporte[i].campo);
                    columns.push(res.reporte[i].persona.nombre_completo);
                    columns.push(res.reporte[i].persona.ci);
                    columns.push($scope.determinarEstado(res.reporte[i].eliminado));
                    columns.push(res.reporte[i].cargos && res.reporte[i].cargos.length > 0 ? res.reporte[i].cargos[0].cargo.nombre : 'Sin cargo');
                    var currentIndx = 0
                    var promedio = 0
                    mesesReporte.map(function (mes, j) {
                        var fechaCabecera = currentIndx <= res.reporte[i].evaluaciones.length - 1 ? $scope.meses[res.reporte[i].evaluaciones[currentIndx].mes].nombre.substring(0, 3) + '-' + (res.reporte[i].evaluaciones[currentIndx].anio).toString().substring(4, 2) : "0"
                        if (mes == fechaCabecera) {
                            columns.push((res.reporte[i].evaluaciones[currentIndx].nota_total))
                            promedio += res.reporte[i].evaluaciones[currentIndx].nota_total
                            currentIndx += 1

                        } else {
                            columns.push("-")
                        }
                    })
                    promedio = promedio / res.reporte[i].evaluaciones.length
                    columns.push((promedio))
                    listaDesempenio.map(function (desempenio) {
                        if (promedio >= desempenio.desde && promedio <= desempenio.hasta) {
                            columns.push($scope.determinarDesempenio(desempenio.id))
                        }
                    })
                    if (i == res.reporte.length - 1) {
                        cabecera.push("Promedio")
                        cabecera.push("Desempeño")
                    }
                    data.push(columns);
                }
                report.push(cabecera)
                data.map(function (row) {
                    report.push(row)
                })
                var ws_name = "SheetJS";
                var wb = new Workbook(), ws = sheet_from_array_of_arrays(report);
                /* add worksheet to workbook */
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                var rDesde = $scope.meses[fromMonth.id].nombre.substring(0, 3) + '-' + (fromYear.id).toString().substring(4, 2)
                var rHasta = $scope.meses[untilMonth.id].nombre.substring(0, 3) + '-' + (untilYear.id).toString().substring(4, 2)
                saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE POR MESES " + rDesde + " : " + rHasta + ".xlsx");
                blockUI.stop();

            }).catch(function (err) {
                var men = (err.data !== undefined && err.data !== null) ? err.data : err.message
                $scope.mostrarMensaje('Se produjo un error! > ' + men)
                blockUI.stop();
            })
        }

        $scope.reportePromediosGeneralPdf = function () {

        }

        $scope.reportePromediosCampoGrafico = function () {

        }

        $scope.reportePromediosCampoExcel = function () {
            var cabecera = ["N°", "Campo", "Empleado", "C.I.", "Estado", "Cargo"]
            var data = []
            var iu = []
            var reporte = ObtenerReportePorMeses(fromMonth, fromYear, untilMonth, untilYear)
            reporte.then(function (reportes) {
                for (var i = 0; i < reportes.meses.length; i++) {
                    var columns = [];
                    columns = [];
                    columns.push((i + 1));
                    data.push(columns);
                }
                var ws_name = "SheetJS";
                var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
                /* add worksheet to workbook */
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
                saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "COMPROBACION DATOS CLIENTES RAZONES DESTINOS.xlsx");
                blockUI.stop();
            })
        }

        $scope.reportePromediosCampoPdf = function () {

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