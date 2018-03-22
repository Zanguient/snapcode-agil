angular.module('agil.controladores')
    .controller('ControladorPacientes', function ($scope, $sce, blockUI, $localStorage, $window, $location, $templateCache, $route, Usuario, Paginator, DatosPacientes, Paciente, $filter, PacientesPaginador, ListaDatosPrerequisito,
        CrearPrerequisito, Prerequisito, DatosPrerequisitoPaciente, ListaDatosGenero, Vacunas, ltsVacunas, PacienteVacuna, VacunasPaciente, asignacionPacienteVacuna, aplicacionPacienteVacuna, VacunasPacientedosis, CrearMedicoPacienteConsulta,
        ListaConsultasMedicoPaciente, CrearMedicoPacienteFicha, BuscarFichaPaciente, ListaDatosTiposControl, ActualizarPatologiaPaciente, ListaPrerequisitosEmpresa, ListaPrerequisitosPaciente, ActualizarPrerequisito, CrearLaboratorio, ListaLaboratorios,
        CrearLaboratorioExamen, ListaLaboratorioExamenes, CrearLaboratorioExamenResultado, LaboratorioExamenListaHistorial, CrearDiagnostico, ListaDiagnosticos, CrearDiagnosticoExamen, ListaDiagnosticoExamenes, DiagnosticoExamenListaHistorial, CrearDiagnosticoExamenResultado,
        PacientesEmpresa, ListaVacunasEmpresa, FichasTecnicasPacientes, SignosVitalesPacientes, SOAPlistaPacientes, aplicacionVacunasPacientes, obtenerPaciente, Comentario, FieldViewer, PacienteActivo, HistorialFichaMedicoPaciente, ActualizarLaboratorio, ActualizarLaboratorioExamen,
        ActualizarDiagnostico, ActualizarDiagnosticoExamen, EliminarLaboratorio, EliminarLaboratorioExamen, EliminarDiagnosticoExamen, EliminarDiagnostico, Prerequisitos, PrerequisitoPaciente, ListaAlertasPrerequisitosPaciente, PrerequisitosHistorial, ListaAlertasVacunasEmpresa, Vacuna, ClasesTipo,ValidarCodigoCuentaEmpleado,$timeout) {

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalDialogVacunas = 'dialog-vacunas';
        $scope.idModalDialogConsulta = 'modal-wizard-consulta'
        $scope.idModalwizardContainerConsulta = 'modal-wizard-container-consulta'
        $scope.idModalDialogVacunasConfig = 'dialog-vacunas-config'
        $scope.idModalDialogVacunaEdicion = 'dialog-vacuna-nueva'
        $scope.idModalDialogFechaEntrega = 'dialog-fecha-entrega'
        $scope.IdModalDialogPreRequisitos = 'modal-preRequisitos'
        $scope.IdModalDialogLaboratorio = 'dialog-laboratorio'
        $scope.IdModalDialogGraficoSV = 'dialog-grafico'
        $scope.idModalDialogHistorico = 'dialog-previewHistorico'
        $scope.idModalFichaTecnica = 'modal-fichaMedica'
        $scope.idModalwizardContainerFichaTecnica = 'modal-wizard-container-ficha'
        $scope.IdModalDialogLaboratorioExamen = 'dialog-nuevo-examen'
        $scope.IdModalDialogLaboratorioExamenes = 'dialog-examenes'
        $scope.IdModalDialogLaboratorioExamenesNuevoResultado = 'dialog-nuevo-resultado'
        $scope.IdModalDialogLaboratorioExamenHistoricoPreview = 'dialog-previewHistorico'
        $scope.IdModalDialogLaboratorioExamenHistoricoResultado = 'dialog-historico-resultado'
        $scope.IdEntregaPrerequisito = 'dialog-entrega-preRequisito';
        $scope.idModalDialogPacienteNuevo = 'dialog-paciente-nuevo';
        $scope.idModalDialogPrerequisitoNuevo = 'dialog-pre-requisito-nuevo';
        $scope.idModalwizardContainerPaciente = 'modal-wizard-paciente-container';
        $scope.idModalHistorialPrerequisito = 'dialog-historico-preRequisito';
        $scope.idModalEditarPrerequisito = 'dialog-editar-preRequisito';
        $scope.idModalDialogHistorialVacuna = 'dialog-historial-vacuna';
        $scope.idModalDialogHistorialVacunaGeneral = 'dialog-historial-vacuna-general';
        $scope.idModalDialogDiagnosticos = 'dialog-diagnosticos';
        $scope.idModalDialogDiagnosticoNuevo = 'dialog-diagnostico-nuevo';
        $scope.idModalDialogExamenesDiagnostico = 'dialog-examenesDiagnostico';
        $scope.idModalDialogNuevoExamenDiagnostico = 'dialog-examenDiagnostico-nuevo';
        $scope.idModalDialogHistorialFicha = 'dialog-historico-ficha';
        $scope.idModalDialogCredencial = 'dialog-credencial';
        $scope.idModalDialogPatologias = 'dialog-patologias';
        $scope.idModalDialogComentario = "dialog-editar-comentario";
        $scope.idModalAlertPrerequisitos = "dialog-alertPre-requisitos";
        $scope.idModalDiasActivacionPrerequisitos = "dialog-diasActivacion-Prerequisitos";
        $scope.idModalReprogramarPrerequisitos = "dialog-reprogramar-prerequisito";
        $scope.idModalAlertVacunas = "dialog-alertVacunas";
        $scope.idModalDiasActivacionVacunas = "dialog-diasActivacion-Vacunas";
        $scope.idModalReprogramarVacunas = "dialog-reprogramar-vacunas";
        $scope.idImagenUsuario = 'imagen-persona';
        $scope.idModalHistorialConsulta = 'dialog-historial-consulta';
        $scope.idModalWizardPacienteVista = 'dialog-paciente-vista';
        $scope.idModalContenedorPacienteVista = 'modal-wizard-container-paciente-vista';
        $scope.idModalEliminarPaciente = 'dialog-eliminar-paciente';
        $scope.IdModalDialogNuevoLaboratorio = 'dialog-nuevo-laboratorio';
        $scope.IdModalDialogDiagnosticoExamenHistoricoResultado = 'dialog-historico-resultado-diag';
        $scope.idModalDialogVerResultadosHistorialLab = 'dialog-ver-resultados-Examen';
        $scope.idModalDialogConfirmacionEntregaAdelantado = 'dialog-entrega-adelantada-prerequisito'

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsPacientes($scope.idModalDialogVacunas, $scope.idModalDialogConsulta, $scope.idModalwizardContainerConsulta,
                $scope.idModalDialogVacunasConfig, $scope.idModalDialogVacunaEdicion, $scope.idModalDialogFechaEntrega, $scope.IdModalDialogPreRequisitos,
                $scope.IdModalDialogLaboratorio, $scope.IdModalDialogGraficoSV, $scope.idModalDialogHistorico, $scope.idModalFichaTecnica, $scope.idModalwizardContainerFichaTecnica,
                $scope.IdModalDialogLaboratorioExamen, $scope.IdModalDialogLaboratorioExamenes, $scope.IdModalDialogLaboratorioExamenesNuevoResultado,
                $scope.IdModalDialogLaboratorioExamenHistoricoPreview, $scope.IdModalDialogLaboratorioExamenHistoricoResultado, $scope.IdEntregaPrerequisito,
                $scope.idModalDialogPacienteNuevo, $scope.idModalDialogPrerequisitoNuevo, $scope.idModalwizardContainerPaciente, $scope.idModalHistorialPrerequisito, $scope.idModalEditarPrerequisito,
                $scope.idModalDialogHistorialVacuna, $scope.idModalDialogHistorialVacunaGeneral, $scope.idModalDialogDiagnosticos, $scope.idModalDialogDiagnosticoNuevo,
                $scope.idModalDialogExamenesDiagnostico, $scope.idModalDialogNuevoExamenDiagnostico, $scope.idModalDialogHistorialFicha, $scope.idModalDialogCredencial,
                $scope.idModalDialogPatologias, $scope.idModalDialogComentario, $scope.idModalAlertPrerequisitos, $scope.idModalDiasActivacionPrerequisitos,
                $scope.idModalReprogramarPrerequisitos, $scope.idModalAlertVacunas, $scope.idModalDiasActivacionVacunas, $scope.idModalReprogramarVacunas, $scope.idImagenUsuario,
                $scope.idModalHistorialConsulta, $scope.idModalWizardPacienteVista, $scope.idModalContenedorPacienteVista, $scope.idModalEliminarPaciente, $scope.IdModalDialogNuevoLaboratorio, $scope.IdModalDialogDiagnosticoExamenHistoricoResultado, $scope.idModalDialogVerResultadosHistorialLab, $scope.idModalDialogConfirmacionEntregaAdelantado);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion();
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalEliminarPaciente);
            $scope.eliminarPopup($scope.idModalDialogVacunas);
            $scope.eliminarPopup($scope.idModalDialogConsulta);
            $scope.eliminarPopup($scope.idModalDialogVacunasConfig);
            $scope.eliminarPopup($scope.idModalDialogVacunaEdicion);
            $scope.eliminarPopup($scope.idModalDialogFechaEntrega);
            $scope.eliminarPopup($scope.IdModalDialogPreRequisitos);
            $scope.eliminarPopup($scope.IdModalDialogLaboratorio);
            $scope.eliminarPopup($scope.IdModalDialogGraficoSV);
            $scope.eliminarPopup($scope.idModalDialogHistorico);
            $scope.eliminarPopup($scope.idModalFichaTecnica);
            $scope.eliminarPopup($scope.IdModalDialogLaboratorioExamen);
            $scope.eliminarPopup($scope.IdModalDialogLaboratorioExamenes);
            $scope.eliminarPopup($scope.IdModalDialogLaboratorioExamenesNuevoResultado);
            $scope.eliminarPopup($scope.IdModalDialogLaboratorioExamenHistoricoResultado);
            $scope.eliminarPopup($scope.IdEntregaPrerequisito);
            $scope.eliminarPopup($scope.idModalDialogPacienteNuevo);
            $scope.eliminarPopup($scope.idModalDialogPrerequisitoNuevo);
            $scope.eliminarPopup($scope.idModalHistorialPrerequisito);
            $scope.eliminarPopup($scope.idModalEditarPrerequisito);
            $scope.eliminarPopup($scope.idModalDialogHistorialVacuna);
            $scope.eliminarPopup($scope.idModalDialogHistorialVacunaGeneral);
            $scope.eliminarPopup($scope.idModalDialogDiagnosticos);
            $scope.eliminarPopup($scope.idModalDialogDiagnosticoNuevo);
            $scope.eliminarPopup($scope.idModalDialogExamenesDiagnostico);
            $scope.eliminarPopup($scope.idModalDialogNuevoExamenDiagnostico);
            $scope.eliminarPopup($scope.idModalDialogHistorialFicha);
            $scope.eliminarPopup($scope.idModalDialogCredencial);
            $scope.eliminarPopup($scope.idModalDialogPatologias);
            $scope.eliminarPopup($scope.idModalDialogComentario);
            $scope.eliminarPopup($scope.idModalAlertPrerequisitos);
            $scope.eliminarPopup($scope.idModalDiasActivacionPrerequisitos);
            $scope.eliminarPopup($scope.idModalReprogramarPrerequisitos);
            $scope.eliminarPopup($scope.idModalAlertVacunas);
            $scope.eliminarPopup($scope.idModalDiasActivacionVacunas);
            $scope.eliminarPopup($scope.idModalHistorialConsulta);
            $scope.eliminarPopup($scope.idModalWizardPacienteVista);
            $scope.eliminarPopup($scope.IdModalDialogNuevoLaboratorio)
            $scope.eliminarPopup($scope.IdModalDialogDiagnosticoExamenHistoricoResultado)
            $scope.eliminarPopup($scope.idModalDialogVerResultadosHistorialLab)
            $scope.eliminarPopup($scope.idModalReprogramarVacunas)
            $scope.eliminarPopup($scope.idModalDialogConfirmacionEntregaAdelantado);
        });
     
        $scope.inicio = function () {
            $scope.obtenerAlertas()
            blockUI.start();
          
            $scope.paginator = { pages: [] }
            $scope.obtenerPacientes();
            $scope.obtenerVacunas()
            $scope.paciente = { vacunas: [], cargos: [] };
            $scope.vacunas = []
            $scope.vacuna = { vacunaDosis: [] }
            $scope.vacunaDosis = []
            $scope.requisitos = { preRequisitos: [] }
            $scope.ficha = {}
            $scope.dosis = { tiempo: 0, numero: 0 }
            $scope.obtenerExpeditos()
            $scope.obtenerGenero();
            $scope.obtenerTipoControl()
            $scope.obtenerCargos()
            $scope.examen = {};
            $scope.filtroHistorialVacunas = []
            $scope.filtroVacunas = { inicio: "", fin: "", opcion: "todas" }
            var fechaAplicacionVacuna = new Date()
            $scope.filtro.fechaAplicacionVacuna_texto = fechaAplicacionVacuna.getDate() + "/" + (fechaAplicacionVacuna.getMonth() + 1) + "/" + fechaAplicacionVacuna.getFullYear()
            // $scope.alertasPrerequisitos = $scope.obtenerAlertas()
            blockUI.stop();
            $scope.dosisEdit = false
            $scope.fechaResultado = $scope.fechaATexto(new Date())
        }
        
        $scope.obtenerExpeditos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_EXP");
            promesa.then(function (entidad) {
                $scope.expeditos = entidad.clases
                blockUI.stop();
            });
        }

        $scope.obtenerCargos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_CARGO");
            promesa.then(function (entidad) {
                var cargos = entidad.clases
                $scope.llenarCargos(cargos)
                blockUI.stop();
            });
        }


        $scope.seleccionarCargos = function (cargosPaciente) {
            if (cargosPaciente.length > 0) {
                for (var i = 0; i < $scope.cargos.length; i++) {
                    for (var j = 0; j < cargosPaciente.length; j++) {
                        if ($scope.cargos[i].id == cargosPaciente[j].id_cargo) {
                            $scope.cargos[i].ticked = true;
                        }
                    }
                }
            }
        }

        $scope.llenarCargos = function (cargos) {
            $scope.nuevoRH = ""
            $scope.cargos = [];          
                for (var i = 0; i < cargos.length; i++) {
                    var cargo = {
                        nombre: cargos[i].nombre,
                        maker: "",
                        ticked: false,
                        id: cargos[i].id
                    }
                    $scope.cargos.push(cargo);
                }           
        }

        $scope.imcCal = function (consulta) {
            //Cálculo indice masa corporal
            if (consulta.talla != undefined && consulta.peso != undefined) {
                if (consulta.talla > 0 && consulta.peso > 0) {
                    var rxp = (consulta.talla / 100) * (consulta.talla / 100)
                    consulta.indice_masa = consulta.peso / rxp
                    consulta.indice_masa = consulta.indice_masa.toFixed(2)
                }
                $scope.ClasificacionIMC = ""
                $scope.ColorIMC = ""
                if (consulta.indice_masa < 16) {
                    $scope.ClasificacionIMC = "Infrapeso: Delgadez Severa"
                }
                if (consulta.indice_masa >= 16 && consulta.indice_masa < 17) {
                    $scope.ClasificacionIMC = "Infrapeso: Delgadez moderada"
                }
                if (consulta.indice_masa >= 17 && consulta.indice_masa < 18.49) {
                    $scope.ClasificacionIMC = "Infrapeso: Delgadez aceptable"
                }
                if (consulta.indice_masa >= 18.50 && consulta.indice_masa < 25) {
                    $scope.ClasificacionIMC = "Peso Normal"
                }
                if (consulta.indice_masa >= 25 && consulta.indice_masa < 30) {
                    $scope.ClasificacionIMC = "Sobrepeso"
                }
                if (consulta.indice_masa >= 30 && consulta.indice_masa < 35) {
                    $scope.ClasificacionIMC = "Obeso: Tipo I"
                }
                if (consulta.indice_masa >= 35 && consulta.indice_masa < 40) {
                    $scope.ClasificacionIMC = "Obeso: Tipo II"
                }
                if (consulta.indice_masa >= 40) {
                    $scope.ClasificacionIMC = "Obeso: Tipo III"
                }

            }

        }

        $scope.obtenerColumnasAplicacion = function () {
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuario.id_empresa,
                configuracion: {
                    codigo: { value: "Codigo", show: true },
                    nombre: { value: "Nombre", show: true },
                    empresa: { value: "Empresa", show: true },
                    imagen: { value: "Imagen", show: true },
                    ci: { value: "CI", show: true },
                    extension: { value: "Extension", show: true },
                    grupo_sanguineo: { value: "Grupo Sang.", show: true },
                    campo: { value: "Campo", show: true },
                    cargo: { value: "Cargo", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
        }

        $scope.fechaATexto = function (fecha) {
            fech = new Date(fecha)
            fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
            return fecha
        }

        $scope.agregarDosisVacuna = function (dosis) {
            blockUI.start();

            if (dosis.id != undefined || dosis.id != null) {
                indx = $scope.vacunaDosis.indexOf(dosis)
                dosis.es_dosis = (dosis.es_dosis == null || dosis.es_dosis == undefined) ? false : dosis.es_dosis
                dosis.unico = (dosis.unico === null || dosis.unico === undefined) ? false : dosis.unico
                dosis.numero = indx
                $scope.vacunaDosis[indx] = dosis
            } else {
                dosis.es_dosis = (dosis.es_dosis == null || dosis.es_dosis == undefined) ? false : dosis.es_dosis
                dosis.unico = (dosis.unico === null || dosis.unico === undefined) ? false : dosis.unico
                dosis.numero = $scope.vacunaDosis.length + 1
                $scope.vacunaDosis.push(dosis)
                console.log('añadiendo dosis')
                console.log(dosis)
            }
            if ($scope.vacunaDosis.length > 1) {
                dosis.unico = false
            }
            $scope.dosis = {}

            blockUI.stop();
        }

        $scope.agregarDosisEditada = function (dosis) {
            if ($scope.vacunaDosis.length > 1) {
                dosis.unico = false
            }
            $scope.vacunaDosis[dosis.index] = dosis
            $scope.dosis = {}
            $scope.dosisEdit = false
        }

        $scope.eliminarDosis = function (dosis) {
            if (dosis.id === undefined) {
                $scope.vacunaDosis.splice($scope.vacunaDosis.indexOf(dosis), 1);
            } else {
                var indx = $scope.vacunaDosis.indexOf(dosis)
                $scope.vacunaDosis[indx].eliminado = true

                $scope.vacunaDosis[indx].eliminar = true
            }

        }

        $scope.editarLaDosis = function (dosis) {
            $scope.dosis = dosis
            $scope.dosisEdit = true

        }

        $scope.asignarVacunas = function () {
            if (!$scope.paciente.activo) {
                $scope.mostrarMensaje('No se puede asignar vacuna a un paciente inactivo!')
            } else {
                blockUI.start();
                $scope.vacunas.forEach(function (vacuna) {
                    vacuna.asignada = (vacuna.asignada === null || vacuna.asignada === undefined) ? false : vacuna.asignada
                    var vacunaAlreadyAsigned = false
                    var vacunaPorAsignar = {}
                    $scope.paciente.vacunas.forEach(function (vacine) {
                        if (vacine.id_vacuna == vacuna.id) {
                            vacunaAlreadyAsigned = true
                            vacunaPorAsignar = vacine
                        }
                    }, this);
                    if (vacunaAlreadyAsigned) {
                        asignacionPacienteVacuna.update({ id: vacunaPorAsignar.id, asignar: vacuna.asignada }, vacunaPorAsignar, function (res) { //{paciente: $scope.paciente, vacuna: vacuna},vacuna,
                            // $scope.mostrarMensaje('Vacuna asignada satisfactoriamente.');
                            var promesa = VacunasPaciente($scope.paciente)
                            promesa.then(function (ltsVacunasPaciente) {
                                $scope.paciente.vacunas = ltsVacunasPaciente
                            })
                        }, function (error) {
                            $scope.mostrarMensaje('Ocurrio un problema al momento de actualizar la asignación de la vacuna!');
                        })
                    } else {
                        if (vacuna.asignada) {
                            var siguienteAplicacion = new Date();
                            if (vacuna.vacunaDosis.length > 1) {
                                if (vacuna.vacunaDosis[1].es_dosis) {
                                    siguienteAplicacion.setTime(siguienteAplicacion.getTime() + vacuna.vacunaDosis[1].tiempo * 86400000)
                                } else {
                                    siguienteAplicacion.setTime(siguienteAplicacion.getTime() + (vacuna.vacunaDosis[1].tiempo * 30) * 86400000)
                                }
                            }
                            var pacienteVacuna = new asignacionPacienteVacuna({ id_paciente: $scope.paciente.id, id_vacuna: vacuna.id, siguiente_aplicacion: siguienteAplicacion });
                            pacienteVacuna.$save(function (res) {
                                var promesa = VacunasPaciente($scope.paciente)
                                promesa.then(function (ltsVacunasPaciente) {
                                    $scope.paciente.vacunas = ltsVacunasPaciente
                                })
                            }, function (error) {
                                $scope.mostrarMensaje('Ocurrio un problema al momento de asignar la vacuna!');
                            })
                        }
                    }
                }, this);
            }
            $scope.cerrarPopUpVacunasConfig()
            blockUI.stop();
        }

        $scope.obtenerVacunas = function () {
            var promesa = ltsVacunas()
            promesa.then(function (vacunas) {
                $scope.vacunas = vacunas
            })
        }

        $scope.limpiarAsignacionVacunas = function () {
            blockUI.start();
            $scope.vacunas.forEach(function (vacuna) {
                vacuna.asignada = false
            }, this);
            blockUI.stop();
        }

        $scope.verificarAsignacionVacunas = function () {
            blockUI.start();
            // //console.log($scope.paciente.vacunas)
            if ($scope.paciente.vacunas.length > 0) {
                $scope.paciente.vacunas.forEach(function (vacuna) {
                    for (var index = 0; index < $scope.vacunas.length; index++) {
                        if (vacuna.id_vacuna == $scope.vacunas[index].id && !vacuna.eliminado) {
                            $scope.vacunas[index].asignada = true
                        }
                    }
                }, this);
            }
            blockUI.stop();
        }

        $scope.evaluarFechaDosisVacuna = function (vacuna) {
            blockUI.start();
            $scope.vacuna = vacuna
            if ($scope.vacuna.pacienteVacunaDosis[0] == undefined) {
                blockUI.stop();
                return
            }
            if ($scope.vacuna.alreadyProyected == undefined) {

                //vacuna de 1 dosis unica
                if ($scope.vacuna.pacienteVacuna.vacunaDosis.length == 1 && $scope.vacuna.pacienteVacuna.vacunaDosis[0].unico) {
                    $scope.vacuna.pacienteVacunaDosis[0].visible = true
                    $scope.vacuna.pacienteVacunaDosis[0].retrasada = false
                    $scope.vacuna.alreadyProyected = true
                    $scope.vacuna.pacienteVacunaDosis[0].fechaCorta = $scope.fechaATexto(new Date($scope.vacuna.pacienteVacunaDosis[0].fecha_aplicacion))
                    blockUI.stop();
                    return
                }

                //vacuna de 1 dosis repetitiva
                if ($scope.vacuna.pacienteVacuna.vacunaDosis.length == 1 && !$scope.vacuna.pacienteVacuna.vacunaDosis[0].unico) {
                    $scope.vacuna.pacienteVacunaDosis.forEach(function (dosis, index, array) {
                        if (index == 0) {
                            dosis.retrasada = false
                            dosis.visible = true
                            dosis.fechaCorta = $scope.fechaATexto(new Date(dosis.fecha_aplicacion))
                        } else {
                            var anterior_dosis_fecha_aplicada = new Date($scope.vacuna.pacienteVacunaDosis[index - 1].fecha_aplicacion).getTime()
                            if ($scope.vacuna.pacienteVacuna.vacunaDosis[0].es_dosis) {
                                var fecha_siguiente_aplicacion_dosis_anterior = new Date(new Date().setTime(anterior_dosis_fecha_aplicada + $scope.vacuna.pacienteVacuna.vacunaDosis[0].tiempo * 86400000))
                            } else {
                                var fecha_siguiente_aplicacion_dosis_anterior = new Date(new Date().setTime((anterior_dosis_fecha_aplicada + $scope.vacuna.pacienteVacuna.vacunaDosis[0].tiempo * 30) * 86400000))
                            }
                            fecha_siguiente_aplicacion_dosis_anterior.setHours(12, 0, 0, 0)
                            var fecha_aplicada = new Date(dosis.fecha_aplicacion)
                            fecha_aplicada.setHours(12, 0, 0, 0)
                            if (fecha_aplicada.getTime() <= fecha_siguiente_aplicacion_dosis_anterior.getTime()) {
                                dosis.retrasada = false
                            } else {
                                dosis.retrasada = true
                            }
                            dosis.visible = true
                            dosis.fechaCorta = $scope.fechaATexto(new Date(dosis.fecha_aplicacion))
                        }

                    });
                    var proyectada = { retrasada: false, id_paciente_vacuna: $scope.vacuna.id_paciente, fecha_aplicacion: new Date($scope.vacuna.fecha_siguiente_aplicacion), proyectada: true, visible: true, fechaCorta: $scope.fechaATexto(new Date($scope.vacuna.fecha_siguiente_aplicacion)), eliminado: false }
                    $scope.vacuna.pacienteVacunaDosis.push(proyectada)
                    $scope.vacuna.alreadyProyected = true

                }

                //vacuna multiples dosis
                if ($scope.vacuna.pacienteVacuna.vacunaDosis.length > 1) {
                    $scope.vacuna.pacienteVacunaDosis.forEach(function (dosis, index, array) {
                        if (index == 0) {
                            dosis.retrasada = false
                            dosis.visible = true
                            dosis.fechaCorta = $scope.fechaATexto(new Date(dosis.fecha_aplicacion))
                        } else {
                            var anterior_dosis_fecha_aplicada = new Date($scope.vacuna.pacienteVacunaDosis[index - 1].fecha_aplicacion).getTime()
                            if ($scope.vacuna.pacienteVacuna.vacunaDosis[0].es_dosis) {
                                var fecha_siguiente_aplicacion_dosis_anterior = new Date(new Date().setTime(anterior_dosis_fecha_aplicada + $scope.vacuna.pacienteVacuna.vacunaDosis[index].tiempo * 86400000))
                            } else {
                                var fecha_siguiente_aplicacion_dosis_anterior = new Date(new Date().setTime((anterior_dosis_fecha_aplicada + $scope.vacuna.pacienteVacuna.vacunaDosis[index].tiempo * 30) * 86400000))
                            }
                            fecha_siguiente_aplicacion_dosis_anterior.setHours(12, 0, 0, 0)
                            var fecha_aplicada = new Date(dosis.fecha_aplicacion)
                            fecha_aplicada.setHours(12, 0, 0, 0)
                            if (fecha_aplicada.getTime() <= fecha_siguiente_aplicacion_dosis_anterior.getTime()) {
                                dosis.retrasada = false
                            } else {
                                dosis.retrasada = true
                            }
                            dosis.visible = true
                            dosis.fechaCorta = $scope.fechaATexto(new Date(dosis.fecha_aplicacion))
                        }
                    });
                    while ($scope.vacuna.pacienteVacunaDosis.length < $scope.vacuna.pacienteVacuna.vacunaDosis.length) {
                        var proyectada = { retrasada: false, id_paciente_vacuna: $scope.vacuna.id_paciente, fecha_aplicacion: new Date(), proyectada: true, visible: true, fechaCorta: $scope.fechaATexto(new Date()), eliminado: false }
                        if ($scope.vacuna.pacienteVacuna.vacunaDosis[$scope.vacuna.pacienteVacunaDosis.length].es_dosis) {
                            proyectada.fecha_aplicacion = new Date(new Date().setTime(new Date($scope.vacuna.pacienteVacunaDosis[$scope.vacuna.pacienteVacunaDosis.length - 1].fecha_aplicacion).getTime() + $scope.vacuna.pacienteVacuna.vacunaDosis[$scope.vacuna.pacienteVacunaDosis.length].tiempo * 86400000))
                        } else {
                            proyectada.fecha_aplicacion = new Date(new Date().setTime(new Date($scope.vacuna.pacienteVacunaDosis[$scope.vacuna.pacienteVacunaDosis.length - 1].fecha_aplicacion).getTime() + ($scope.vacuna.pacienteVacuna.vacunaDosis[$scope.vacuna.pacienteVacunaDosis.length].tiempo * 30) * 86400000))
                        }
                        proyectada.fechaCorta = $scope.fechaATexto(proyectada.fecha_aplicacion)
                        $scope.vacuna.pacienteVacunaDosis.push(proyectada)
                        $scope.vacuna.alreadyProyected = true

                    }
                    blockUI.stop();
                    return
                }
                blockUI.stop();
            } else {
                blockUI.stop();
            }
        }

        $scope.validarDatosVacuna = function (vacuna) {
            if ($scope.vacunaDosis.length > 0 && vacuna.nombre != "") {
                return false
            } else {
                return true
            }
        }

        $scope.editarVacuna = function (valid, vacuna) {
            blockUI.start();
            if (!valid) {
                $scope.mostrarMensaje('Complete los campos requeridos!')
                return
            }
            var che = false
            $scope.vacuna = vacuna
            $scope.vacuna.vacunaDosis = $scope.vacunaDosis
            if ($scope.vacunaDosis.length > 1) {
                $scope.vacunaDosis.forEach(function (dosis, index, array) {
                    if (dosis.unico) {
                        che = true
                        dosis.unico = false
                    }
                    if (index == array.length - 1) {
                        if (che) {
                            $scope.mostrarMensaje('No se puede guardar una dosis única en un conjunto de dosis!')
                            return
                        }
                    }
                });
            }
            if (!vacuna.id && !che) {
                vacuna.$save(function (res) {
                    $scope.mostrarMensaje(res.mensaje);
                    blockUI.stop();
                }, function (error) {
                    $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                    blockUI.stop();
                })
            } else if (!che) {
                Vacunas.update({ id: vacuna.id }, vacuna, function (res) {
                    $scope.mostrarMensaje(res.mensaje);
                    blockUI.stop();
                }, function (error) {
                    $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                    blockUI.stop();
                })
            }
            $scope.vacunaDosis = []
            $scope.cerrarPopUpVacunaNueva()
        }

        $scope.obtenerPrerequisitos = function () {
            blockUI.start();
            var requisitos = Prerequisitos()
            requisitos.then(function (prerequisitos) {
                $scope.preRequisitos = prerequisitos.prerequisitos
                blockUI.stop();
            })
        }

        $scope.obtenerGenero = function () {
            blockUI.start();
            $scope.generos = []
            var promesa = ListaDatosGenero();
            promesa.then(function (entidad) {
                entidad.forEach(function (genero) {
                    $scope.generos.push(genero)
                }, this);
                blockUI.stop();
            });
        }

        $scope.obtenerPacientes = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "codigo";
            $scope.paginator.direccion = "asc";
            $scope.filtro = { empresa: $scope.usuario.id_empresa, codigo: "", nombres: "", ci: "", campo: "", cargo: "", busquedaEmpresa: "", estado: "", grupo_sanguineo: "" };
            $scope.paginator.callBack = $scope.buscarPacientes;
            $scope.paginator.getSearch("", $scope.filtro, null);
            blockUI.stop();

        }

        $scope.buscarPacientes = function () {
            blockUI.start();
            var promesa = PacientesPaginador($scope.paginator);
            promesa.then(function (dato) {
                $scope.paginator.setPages(dato.paginas);
                $scope.pacientes = dato.pacientes;
                $scope.dynamicPopoverCargos = {
                    templateUrl: 'myPopoverTemplate.html',
                };
                $scope.pacientes.forEach(function (pac, index, array) {
                    pac.activo = (pac.activo == 0) ? true : false
                    if (index === array.length - 1) {
                        blockUI.stop();
                    }
                });
                blockUI.stop();
            });
        }

        $scope.guardarFichaTecnica = function (valido, ficha) {
            if (valido) {
                var button = $('#siguiente-f').text().trim();
                if (button != "Siguiente") {

                    ficha.fecha_elaboracion = new Date($scope.convertirFecha(ficha.fecha_elaboracion));
                    var promesa = CrearMedicoPacienteFicha(ficha);
                    promesa.then(function (dato) {
                        $scope.cerrarPopUpIdModalFichaTecnica()
                        $scope.recargarItemsTabla()
                        $scope.mostrarMensaje(dato.message)
                    })
                }
            }
        }

        $scope.guardarFichaTecnicaExistente = function (valid, ficha) {
            if (valid) {
                ficha.fecha_elaboracion = new Date($scope.convertirFecha(ficha.fecha_elaboracion));
                var promesa = CrearMedicoPacienteFicha(ficha);
                promesa.then(function (dato) {
                    $scope.cerrarPopUpIdModalFichaTecnica()
                    $scope.recargarItemsTabla()
                    $scope.mostrarMensaje(dato.message)
                })
            } else {
                $scope.mostrarMensaje('Faltan datos!')
            }

        }

        $scope.aplicarVacuna = function (vacuna, paciente) {
            if (paciente != undefined) {
                paciente.activo = paciente.eliminado
                $scope.paciente = paciente
            }
            blockUI.start();
            if (!$scope.paciente.activo) {
                $scope.mostrarMensaje('No se puede aplicar vacuna a un paciente inactivo!')
                blockUI.stop()
                return
            } else {
                var hoy = new Date()
                hoy.setHours(12, 0, 0, 0)
                // var sgtAplicacion
                var supuestaAplicacion = (vacuna.fechaAplicacionVacuna_texto != undefined) ? new Date($scope.convertirFecha(vacuna.fechaAplicacionVacuna_texto)) : new Date()
                supuestaAplicacion.setHours(12, 0, 0, 0)
                var dosisIndx = 0
                var dosisAplicadas = []
                vacuna.pacienteVacunaDosis.forEach(function (dosis) {
                    if (dosis.proyectada === undefined) {
                        dosisAplicadas.push(new Date(dosis.fecha_aplicacion))
                    }
                });
                // if ($scope.fechaATexto(hoy) == $scope.fechaATexto(supuestaAplicacion)) {
                if (dosisAplicadas.length == 0) {
                    vacuna.fecha_ultima_aplicacion = supuestaAplicacion
                    if (vacuna.pacienteVacuna.vacunaDosis.length > 1) {
                        if (vacuna.pacienteVacuna.vacunaDosis[1].es_dosis) {
                            vacuna.fecha_siguiente_aplicacion = new Date(new Date().setTime(supuestaAplicacion.getTime() + vacuna.pacienteVacuna.vacunaDosis[1].tiempo * 86400000))
                            vacuna.fecha_siguiente_aplicacion_texto = $scope.fechaATexto(vacuna.fecha_siguiente_aplicacion)
                        } else {
                            vacuna.fecha_siguiente_aplicacion = new Date(new Date().setTime(supuestaAplicacion.getTime() + (vacuna.pacienteVacuna.vacunaDosis[1].tiempo * 30) * 86400000))
                            vacuna.fecha_siguiente_aplicacion_texto = $scope.fechaATexto(vacuna.fecha_siguiente_aplicacion)
                        }
                    } else {
                        if (vacuna.pacienteVacuna.vacunaDosis[0].es_dosis) {
                            vacuna.fecha_siguiente_aplicacion = new Date(new Date().setTime(supuestaAplicacion.getTime() + vacuna.pacienteVacuna.vacunaDosis[dosisIndx].tiempo * 86400000))
                            vacuna.fecha_siguiente_aplicacion_texto = $scope.fechaATexto(vacuna.fecha_siguiente_aplicacion)
                        } else {
                            vacuna.fecha_siguiente_aplicacion = new Date(new Date().setTime(supuestaAplicacion.getTime() + (vacuna.pacienteVacuna.vacunaDosis[dosisIndx].tiempo * 30) * 86400000))
                            vacuna.fecha_siguiente_aplicacion_texto = $scope.fechaATexto(vacuna.fecha_siguiente_aplicacion)
                        }
                    }

                } else {
                    var maxDate = new Date(Math.max.apply(null, dosisAplicadas));
                    if (supuestaAplicacion < maxDate) {
                        $scope.mostrarMensaje('No se puede aplicar en una fecha anterior a la ultima aplicación!')
                        blockUI.stop();
                        return
                    } else {
                        if (vacuna.pacienteVacuna.vacunaDosis.length > 1) {
                            dosisIndx = vacuna.pacienteVacunaDosis.length
                            if (vacuna.pacienteVacuna.vacunaDosis[dosisIndx] != undefined) {
                                vacuna.fecha_ultima_aplicacion = supuestaAplicacion
                                if (vacuna.pacienteVacuna.vacunaDosis[dosisIndx].es_dosis) {
                                    vacuna.fecha_siguiente_aplicacion = new Date(new Date().setTime(supuestaAplicacion.getTime() + vacuna.pacienteVacuna.vacunaDosis[dosisIndx].tiempo * 86400000))
                                    vacuna.fecha_siguiente_aplicacion_texto = $scope.fechaATexto(vacuna.fecha_siguiente_aplicacion)
                                } else {
                                    vacuna.fecha_siguiente_aplicacion = new Date(new Date().setTime(supuestaAplicacion.getTime() + (vacuna.pacienteVacuna.vacunaDosis[dosisIndx].tiempo * 30) * 86400000))
                                    vacuna.fecha_siguiente_aplicacion_texto = $scope.fechaATexto(vacuna.fecha_siguiente_aplicacion)
                                }
                            } else {
                                $scope.mostrarMensaje('No se puede aplicar, excede el número de dosis aplicables!')
                                return
                            }
                        } else {
                            vacuna.fecha_ultima_aplicacion = supuestaAplicacion
                            if (vacuna.pacienteVacuna.vacunaDosis[0].es_dosis) {
                                vacuna.fecha_siguiente_aplicacion = new Date(new Date().setTime(supuestaAplicacion.getTime() + vacuna.pacienteVacuna.vacunaDosis[0].tiempo * 86400000))
                                vacuna.fecha_siguiente_aplicacion_texto = $scope.fechaATexto(vacuna.fecha_siguiente_aplicacion)
                            } else {
                                vacuna.fecha_siguiente_aplicacion = new Date(new Date().setTime(supuestaAplicacion.getTime() + (vacuna.pacienteVacuna.vacunaDosis[0].tiempo * 30) * 86400000))
                                vacuna.fecha_siguiente_aplicacion_texto = $scope.fechaATexto(vacuna.fecha_siguiente_aplicacion)
                            }
                        }
                    }
                }
                aplicacionPacienteVacuna.update({ id: vacuna.id }, vacuna, function (res) {
                    var promesa = VacunasPaciente($scope.paciente)
                    promesa.then(function (ltsVacunasPaciente) {
                        $scope.paciente.vacunas = ltsVacunasPaciente
                        $scope.inicializarFechaAplicacionVacuna()
                        blockUI.stop();
                    })
                    $scope.mostrarMensaje(res.mensaje);
                }, function (error) {
                    $scope.mostrarMensaje('Se produjo un error');
                    blockUI.stop();
                });
                if ($scope.fechaATexto(hoy) != $scope.fechaATexto(supuestaAplicacion)) {

                } else {
                    $scope.mostrarMensaje('La fecha de aplicación y la fecha actual son diferentes, vacuna aplicada de todas formas!')
                    blockUI.stop();
                }

            }
            $scope.obtenerAlertas()
        }
        $scope.inicializarFechaAplicacionVacuna = function () {
            $scope.paciente.vacunas.forEach(function (vacuna, index, array) {
                var hoy = new Date()
                vacuna.fechaAplicacionVacuna_texto = hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear()
                if (index === array.length - 1) {
                    $scope.obtenerAlertas()
                }
            });
        }
        $scope.button_clicked = false;
        $scope.disableImput = function (vacuna) {
            aplicarDatePickers();
            var conteoDosis = 0
            vacuna.pacienteVacunaDosis.forEach(function (dosisAplicada) {
                if (!dosisAplicada.proyectada) {
                    conteoDosis += 1
                }
            }, this);
            if (vacuna.button_clicked) {
                if (vacuna.pacienteVacuna.vacunaDosis.length == 1 && !vacuna.pacienteVacuna.vacunaDosis[0].unico) {
                    $scope.aplicarVacuna(vacuna)
                } else {
                    if (conteoDosis < vacuna.pacienteVacuna.vacunaDosis.length) {
                        $scope.aplicarVacuna(vacuna)
                    } else {
                        $scope.mostrarMensaje('No se puede aplicar la vacuna, excede la cantidad de dosis')
                    }
                }
                vacuna.button_clicked = false;
            } else {
                vacuna.button_clicked = true;
            }
        }

        $scope.dosisText = "Mes(es)";
        $scope.textoDosis = function ($event) {
            if ($event) {
                $scope.dosisText = "Día(s)";
            } else {
                $scope.dosisText = "Mes(es)";
            }
        }

        $scope.imprimirCredencial = function () {
            html2canvas(document.getElementsByClassName('PrintCredencial'), {
                allowTaint: true,
                onrendered: function (canvas) {
                    var nWindow = window.open('', "Credencial", "width=1100,height=1000");

                    // append the canvas to the body
                    nWindow.document.body.appendChild(canvas);

                    // focus on the window
                    nWindow.focus();

                    // print the window
                    nWindow.print();

                    // reload the page
                    // location.reload();
                }
            });
        }

        // ======== PARA GRAFICO ==========

        $scope.DatosSV = [
            {
                type: "line",
                showInLegend: true,
                lineThickness: 2,
                name: "PrecionS",
                // markerType: "square",
                color: "#F08080",
                dataPoints: []
            },

            {
                type: "line",
                showInLegend: true,
                lineThickness: 2,
                name: "Pulso",
                // markerType: "square",
                color: "#EC11B0",
                dataPoints: []
            },
            {
                type: "line",
                showInLegend: true,
                lineThickness: 2,
                name: "Talla",
                // markerType: "square",
                color: "#11EC2B",
                dataPoints: []
            },
            {
                type: "line",
                showInLegend: true,
                lineThickness: 2,
                name: "Temperatura",
                // markerType: "square",
                color: "#48B5DF",
                dataPoints: []
            },
            {
                type: "line",
                showInLegend: true,
                lineThickness: 2,
                name: "Frecuencia Respiratoria",
                // markerType: "square",
                color: "#DF488A",
                dataPoints: []
            },
            {
                type: "line",
                showInLegend: true,
                lineThickness: 2,
                name: "Frecuencia cardiaca",
                // markerType: "square",
                color: "#CCDF48",
                dataPoints: []
            },
            {
                type: "line",
                showInLegend: true,
                lineThickness: 2,
                name: "indice de masa corporal",
                // markerType: "square",
                color: "#48DFD3",
                dataPoints: []
            }
        ];

        // $scope.fechasLabel = ["3/1/2010", "5/1/2010", "7/1/2010", "9/1/2010", "11/1/2010", "13/1/2010", "15/1/2010", "17/1/2010", "19/1/2010", "20/1/2010"]

        $scope.selection = [];
        $scope.chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: "GRAFICA - SIGNOS VITALES",
                fontSize: 22,

            },
            legend: {
                horizontalAlign: "right", // left, center ,right 
                verticalAlign: "center",  // top, center, bottom
                fontSize: 14,
            },
            animationEnabled: true,
            exportEnabled: true,
            width: 1100,

            axisX: {
                gridColor: "Silver",
                tickColor: "silver",
                valueFormatString: "DD/MM/YY",
                titleFontSize: 8,

            },
            theme: "theme1",
            axisY: {
                gridColor: "Silver",
                tickColor: "silver"
            },

            data: $scope.selection,

        });

        $scope.chart.render();

        // toggle selection for a given signo vital by name
        $scope.toggleSelection = function toggleSelection(signoVital) {
            var idx = $scope.selection.map(function (item) { return item.name; }).indexOf(signoVital.name);

            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
                $scope.chart.render();
                $scope.chart.destroy();
            }

            // is newly selected
            else {
                $scope.selection.push(signoVital);
                $scope.chart.render();
                $scope.chart.destroy();
            }

        };

        // === seleccionar todos ==
        $scope.checkAll = function ($event) {
            // == clear array ====
            $scope.selection.length = 0;
            // === uncheck and check all checkboxes === 
            angular.forEach($scope.DatosSV, function (sv) {
                sv.selected = $event.target.checked;
                if (sv.selected) {
                    $scope.selection.push(sv);
                    $scope.chart.render();
                    $scope.chart.destroy();
                } else {
                    $scope.selection.splice(0, 1);
                    $scope.chart.render();
                    $scope.chart.destroy();
                }

            });
        };

        // ======== PARA GRAFICO FIN ==========


        $scope.abrirIdModalDialogLaboratorioExamenesNuevoResultado = function (examen, vista) {
            $scope.examen = {}
            if (examen) {
                $scope.examen = examen
            }
            if (vista) {
                $scope.examen.soloVista = true
            } else {
                $scope.examen.soloVista = false
            }
            $scope.abrirPopup($scope.IdModalDialogLaboratorioExamenesNuevoResultado);
            $scope.fechaResultado = $scope.fechaATexto(new Date())
        }
        $scope.abrirIdModalDialogLaboratorioExamenesHistoricoResultados = function () {
            filtro = { inicio: 0, fin: 0 }
            $scope.ObtenerHistorialLaboratorioExamenes(filtro)
            $scope.abrirPopup($scope.IdModalDialogLaboratorioExamenHistoricoResultado);
        }
        $scope.abrirIdModalDialogDiagnosticoExamenesHistoricoResultados = function () {
            filtro = { inicio: 0, fin: 0 }
            $scope.ObtenerHistorialDiagnosticoExamenes(filtro)
            $scope.abrirPopup($scope.IdModalDialogDiagnosticoExamenHistoricoResultado);
        }
        $scope.abrirIdModalDialogNuevoLaboratorio = function (laboratorio, vista) {
            $scope.laboratorio = {}
            if (laboratorio) {
                $scope.laboratorio = laboratorio
            }
            if (vista) {
                $scope.laboratorio.soloVista = true
            } else {
                $scope.laboratorio.soloVista = false
            }

            $scope.abrirPopup($scope.IdModalDialogNuevoLaboratorio);
        }
        $scope.abrirIdModalDialogLaboratorioExamenesHistorico = function () {
            $scope.abrirPopup($scope.IdModalDialogLaboratorioExamenHistoricoPreview);
        }
        $scope.abrirIdModalDialogLaboratorioExamenes = function (laboratorio) {
            $scope.laboratorio = laboratorio;
            $scope.ObtenerMedicoLaboratorioExamenes(laboratorio)
            $scope.abrirPopup($scope.IdModalDialogLaboratorioExamenes);
        }

        $scope.abrirIdModalFichaTecnica = function (paciente) {
            $scope.paciente = paciente
            $scope.buscarfichaPaciente(paciente)
            $scope.abrirPopup($scope.idModalFichaTecnica);
        }
        $scope.buscarfichaPaciente = function (paciente) {
            blockUI.start();
            var promesa = BuscarFichaPaciente(paciente.id)
            promesa.then(function (datos) {
                if (datos.ficha) {
                    $scope.ficha = datos.ficha
                    var fechaActual = new Date();
                    var fechaNacimiento = new Date($scope.ficha.paciente.persona.fecha_nacimiento)
                    var fecha = new Date(datos.ficha.fecha)
                    $scope.ficha.fecha_elaboracion = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365);
                    $scope.ficha.edad
                    $scope.mostarGuardarFicha = true
                } else {
                    $scope.mostarGuardarFicha = false
                    $scope.ficha = { paciente: datos.paciente, pacienteReferencia: {} }
                    var fechaActual = new Date();
                    var fechaNacimiento = new Date($scope.ficha.paciente.persona.fecha_nacimiento)
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365)
                }
                blockUI.stop();
            });

        }
        $scope.obtenerTipoControl = function () {
            blockUI.start();
            var promesa = ListaDatosTiposControl();
            promesa.then(function (entidad) {
                $scope.tiposControl = entidad;
                blockUI.stop();
            });
        }



        $scope.diferenciaEntreDiasEnDias = function (a, b) {
            var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
        }

        $scope.obtenerDatosPrerequisito = function (paciente, filtro) {
            blockUI.start();
            if (filtro.inicio != undefined) {
                if (filtro.inicio != 0 && filtro.inicio != "") {
                    $scope.filtro.inicio = (filtro.inicio instanceof Date) ? filtro.inicio : new Date($scope.convertirFecha(filtro.inicio));
                } else {
                    $scope.filtro.inicio = 0
                }
            } else {
                $scope.filtro.inicio = 0
            }
            if (filtro.fin != undefined) {
                if (filtro.fin != 0 && filtro.fin != "") {
                    $scope.filtro.fin = (filtro.fin instanceof Date) ? filtro.fin : new Date($scope.convertirFecha(filtro.fin));
                } else {
                    $scope.filtro.fin = 0
                }
            } else {
                $scope.filtro.fin = 0
            }
            var promesa = ListaPrerequisitosPaciente(paciente.id, $scope.filtro);
            promesa.then(function (preRequisitos) {
                $scope.prerequisitosPaciente = preRequisitos.Prerequisitos;
                $scope.prerequisitosPaciente.forEach(function (requisito) {
                    if (requisito.fecha_entrega != null) {
                        requisito.entregado = true
                    }
                })
                console.log($scope.prerequisitosPaciente)
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
                blockUI.stop();
            }, function (error) {
                $scope.mostrarMensaje('Se produjo un error al obtener datos de prerequisitos')
                blockUI.stop();
            });
        }

        $scope.abrirDialogVerResultadosLab = function (laboratorio) {
            $scope.Hostorialexamenes = laboratorio.laboratorioResultados
            $scope.abrirPopup($scope.idModalDialogVerResultadosHistorialLab);
        }
        $scope.cerrarDialogVerResultadosLab = function (laboratorio) {
            $scope.cerrarPopup($scope.idModalDialogVerResultadosHistorialLab);
        }
        $scope.showPopover = false;

        $scope.popover = {
            title: 'Title',
            message: 'Message'
        };
        $scope.abrirIdModalDialogPreRequisitos = function (paciente) {
            $scope.paciente = paciente;
            $scope.verificarAsignacionPrerequisitos()
            // $scope.obtenerAlertas()
            $scope.abrirPopup($scope.IdModalDialogPreRequisitos);
        }

        $scope.abrirDialogHistorico = function (vacuna) {
            $scope.abrirPopup($scope.idModalDialogHistorico);
        }
        $scope.abrirDialogVacunaEditar = function (vacuna) {
            $scope.vacuna = vacuna
            $scope.vacunaDosis = vacuna.vacunaDosis
            $scope.dosis = {}
            $scope.dosisEdit = false
            $scope.abrirPopup($scope.idModalDialogVacunaEdicion);
        }
        $scope.abriridModalDialogFechaEntrega = function () {
            $scope.abrirPopup($scope.idModalDialogFechaEntrega);
        }

        $scope.abrirIdModalGraficoSV = function (paciente) {
            $scope.DatosSV.forEach(function (DatosSV) {
                DatosSV.dataPoints = []
            })

            $scope.fechasLabel = []
            var filtro = { inicio: 0, fin: 0 }
            $scope.paciente = paciente
            var yy = 0;
            var promesa = ListaConsultasMedicoPaciente($scope.paciente.id, filtro)
            promesa.then(function (dato) {
                for (var i = 0; i < dato.consultas.length; i++) {
                    var consulta = dato.consultas[i];
                    var fecha = new Date(consulta.fecha)
                    var str = consulta.presion
                    var res = str.split("/");
                    var fechaTabla = fecha.getDate() + "/" + (fecha.getMonth()) + "/" + fecha.getFullYear()
                    $scope.fechasLabel.push(fechaTabla)
                    var datoPrecion = { x: new Date(fecha.getFullYear(), (fecha.getMonth()), fecha.getDate()), y: parseInt(res[0]) };
                    var datoPulso = { x: new Date(fecha.getFullYear(), (fecha.getMonth()), fecha.getDate()), y: parseInt(consulta.pulso) };
                    var datoTalla = { x: new Date(fecha.getFullYear(), (fecha.getMonth()), fecha.getDate()), y: parseInt(consulta.talla) };
                    var datoPeso = { x: new Date(fecha.getFullYear(), (fecha.getMonth()), fecha.getDate()), y: parseInt(consulta.peso) };
                    var datoTemperatura = { x: new Date(fecha.getFullYear(), (fecha.getMonth()), fecha.getDate()), y: parseInt(consulta.temperatura) };
                    var datoFrecuenciaC = { x: new Date(fecha.getFullYear(), (fecha.getMonth()), fecha.getDate()), y: parseInt(consulta.frecuencia_cardiaca) };
                    var datoFrecuenciaR = { x: new Date(fecha.getFullYear(), (fecha.getMonth()), fecha.getDate()), y: parseInt(consulta.frecuencia_respiratoria) };
                    var datoIndiceMasaCorporal = { x: new Date(fecha.getFullYear(), (fecha.getMonth()), fecha.getDate()), y: parseInt(consulta.indice_masa_corporal) };
                    $scope.DatosSV.forEach(function (DatosSV) {
                        if (DatosSV.name == "PrecionS") DatosSV.dataPoints.push(datoPrecion)
                        if (DatosSV.name == "Talla") DatosSV.dataPoints.push(datoTalla)
                        if (DatosSV.name == "Pulso") DatosSV.dataPoints.push(datoPulso)
                        if (DatosSV.name == "Peso") DatosSV.dataPoints.push(datoPeso)
                        if (DatosSV.name == "Temperatura") DatosSV.dataPoints.push(datoTemperatura)
                        if (DatosSV.name == "Frecuencia Respiratoria") DatosSV.dataPoints.push(datoFrecuenciaR)
                        if (DatosSV.name == "Frecuencia cardiaca") DatosSV.dataPoints.push(datoFrecuenciaC)
                        if (DatosSV.name == "indice de masa corporal") DatosSV.dataPoints.push(datoIndiceMasaCorporal)
                    }, this);
                    yy = yy + 20;
                }
            })
            $scope.abrirPopup($scope.IdModalDialogGraficoSV);
        }

        $scope.cerrarIdModalGraficoSV = function () {
            $scope.cerrarPopup($scope.IdModalDialogGraficoSV);
        }

        $scope.abrirDialogNuevoExamen = function () {
            $scope.abrirPopup($scope.IdModalDialogLaboratorioExamen);
        }

        $scope.abrirIdModalDialogLaboratorio = function (paciente) {
            $scope.paciente = paciente
            $scope.ObtenerMedicoLaboratorios(paciente)
            $scope.abrirPopup($scope.IdModalDialogLaboratorio);
        }

        $scope.abriridModalDialogVacunaNueva = function () {
            $scope.vacuna = new Vacunas({});
            $scope.dosis = {}
            $scope.dosisEdit = false
            $scope.abrirPopup($scope.idModalDialogVacunaEdicion);
        }

        $scope.abrirDialogVacunasConfig = function () {
            // $scope.obtenerVacunas()
            $scope.limpiarAsignacionVacunas()
            $scope.verificarAsignacionVacunas()
            $scope.obtenerAlertas()
            $scope.abrirPopup($scope.idModalDialogVacunasConfig);
        }

        $scope.abrirDialogVacunas = function (paciente) {
            $scope.paciente = paciente
            $scope.paciente.vacunas = []
            $scope.filtroHistorialVacunas = []
            var vacunas_paciente = VacunasPaciente($scope.paciente)
            vacunas_paciente.then(function (datosVacunas) {
                $scope.paciente.vacunas = datosVacunas
                $scope.paciente.vacunas.forEach(function (vacuna) {
                    var hoy = new Date()
                    vacuna.fechaAplicacionVacuna_texto = hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear()
                    vacuna.button_clicked = false
                }, this);
            })
            $scope.limpiarAsignacionVacunas()
            $scope.verificarAsignacionVacunas()
            $scope.obtenerAlertas()
            $scope.abrirPopup($scope.idModalDialogVacunas);
        }
        $scope.guardarEntregaPrerequisito = function (prerequisito) {
            blockUI.start();
            if (prerequisito.fecha_entrega_texto == null || prerequisito.fecha_entrega_texto == "") {
                $scope.mostrarMensaje('Ingrese la fecha de entrega.')
            } else {
                prerequisito.fecha_entrega = new Date($scope.convertirFecha(prerequisito.fecha_entrega_texto))
                prerequisito.asignado = true
                PrerequisitoPaciente.save(prerequisito, function (res) {
                    var filtro = { inicio: 0, fin: 0 }
                    var promesa = ListaPrerequisitosPaciente($scope.paciente.id, filtro);
                    promesa.then(function (preRequisitos) {
                        $scope.prerequisitosPaciente = preRequisitos.Prerequisitos;
                        $scope.mostrarMensaje(res.mensaje)
                        $scope.prerequisitosPaciente.forEach(function (requisito) {
                            if (requisito.fecha_entrega != null) {
                                requisito.entregado = true
                            }
                        });
                        $scope.cerrarPopUpEntregaPreRequisito()
                        blockUI.stop();
                    });
                }, function (error) {
                    $scope.mostrarMensaje('Ocurrio un problema al guardar la fecha de entrega  de el prerequisito')
                })
            }
        }
        $scope.verificarFechaEntregaPrerequisito = function (preRequisito, paciente) {
            $scope.preRequisito = preRequisito
            $scope.preRequisito.fecha_entrega_texto = $scope.fechaATexto(new Date())
            if (paciente === undefined) {
                $scope.paciente = preRequisito.pacientePrerequisito
            } else {
                $scope.paciente = paciente
            }
            console.log($scope.preRequisito)
            var vence = new Date($scope.preRequisito.fecha_vencimiento).getTime()
            var hoy = new Date().getTime()
            var dif = Math.floor((hoy - vence) / 86400000)
            if (dif >= 0) {
                $scope.abrirDialogEntregaPreRequisito($scope.preRequisito, $scope.paciente);
            } else {
                $scope.abrirPopup($scope.idModalDialogConfirmacionEntregaAdelantado);
            }
            $scope.obtenerAlertas()
        }

        $scope.cerrarConfirmacionEntragaAdelantadaPrerequisito = function () {
            $scope.cerrarPopup($scope.idModalDialogConfirmacionEntregaAdelantado);
        }

        $scope.abrirDialogEntregaPreRequisito = function (PreRequisito, paciente) {
            $scope.cerrarConfirmacionEntragaAdelantadaPrerequisito()
            $scope.preRequisito = PreRequisito
            $scope.preRequisito.fecha_entrega_texto = $scope.fechaATexto(new Date())
            $scope.paciente = paciente
            $scope.abrirPopup($scope.IdEntregaPrerequisito);
        }

        $scope.cerrarPopUpEntregaPreRequisito = function () {
            $scope.obtenerAlertas()
            $scope.cerrarPopup($scope.IdEntregaPrerequisito);
        }

        $scope.abrirDialogPacienteNuevo = function () {
            $scope.paciente = new Paciente({ persona: { imagen: "img/icon-user-default.png" }, id_empresa: $scope.usuario.id_empresa });
            $scope.abrirPopup($scope.idModalDialogPacienteNuevo);
        }

        $scope.cerrarPopupPacienteNuevo = function () {
            // $scope.obtenerCargos()
            $scope.cerrarPopup($scope.idModalDialogPacienteNuevo);
        }

        $scope.abrirDialogPrerequisitoNuevo = function () {
            $scope.NuevoP = new Prerequisito({ puede_modificar_rrhh: false });
            $scope.abrirPopup($scope.idModalDialogPrerequisitoNuevo);
        }
        $scope.abrirDialogPrerequisitoEditar = function (prerequisito) {

            $scope.NuevoP = new Prerequisito({ id: prerequisito.id, nombre: prerequisito.nombre, observacion: prerequisito.observacion, vencimiento_mes: prerequisito.vencimiento_mes,dias_activacion:prerequisito.dias_activacion, puede_modificar_rrhh: prerequisito.puede_modificar_rrhh })
            $scope.abrirPopup($scope.idModalDialogPrerequisitoNuevo);
        }

        $scope.cerrarPopupPrerequisitoNuevo = function () {
            $scope.obtenerAlertas()
            $scope.cerrarPopup($scope.idModalDialogPrerequisitoNuevo);
        }
        $scope.validarCodigoCuentaEmpleado = function (CodigoCuenta) {
			var codigo = CodigoCuenta;
			if (codigo != '') {
				$timeout(function () {
					$scope.validar = new ValidarCodigoCuentaEmpleado();

					$scope.validar.codigo = CodigoCuenta;

					$scope.validar.$save(function (data) {
						$scope.data = data;
					})
				}, 1500);
			}
		};
        $scope.abrirDialogHistoricoPreRequisito = function (pre, pac) {
            var filtro = { inicio: 0, fin: 0 }
            $scope.preRequisito = pre
            $scope.paciente = pac
            var promesa = PrerequisitosHistorial({ id_pre: $scope.preRequisito.preRequisito.id, id_pac: $scope.paciente.id, inicio: filtro.inicio, fin: filtro.fin });
            promesa.then(function (preRequisitos) {
                $scope.historialPrerequisitosPaciente = preRequisitos.historial;
                blockUI.stop();
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
            });
            $scope.abrirPopup($scope.idModalHistorialPrerequisito);
        }

        $scope.filtrarHistorialPrerequisito = function (filtro) {
            if (filtro != undefined) {
                var fecha_inicio = (filtro.inicio === null || filtro.inicio === "" || filtro.inicio === undefined) ? 0 : new Date(filtro.inicio)
                var fecha_fin = (filtro.fin === null || filtro.fin === "" || filtro.fin === undefined) ? 0 : new Date(filtro.fin)
                var tipo_opcion = (filtro.opcion === null || filtro.opcion === undefined) ? 0 : filtro.opcion
                filtro = { inicio: fecha_inicio, fin: fecha_fin, opcion: tipo_opcion }
            } else {
                var filtro = { inicio: 0, fin: 0 }
            }

            var promesa = PrerequisitosHistorial({ id_pre: $scope.preRequisito.preRequisito.id, id_pac: $scope.paciente.id, inicio: filtro.inicio, fin: filtro.fin });
            promesa.then(function (preRequisitos) {
                $scope.historialPrerequisitosPaciente = preRequisitos.historial;
                blockUI.stop();
                filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
            });
        }

        $scope.cerrarDialogHistoricoPreRequisito = function () {
            $scope.cerrarPopup($scope.idModalHistorialPrerequisito);
        }

        $scope.actualizarPrerequisito = function (prerequisito) {
            blockUI.start();
            console.log(prerequisito)
            var promesa = ActualizarPrerequisito(prerequisito)
            promesa.then(function (dato) {
                if (prerequisito instanceof Array) {
                    $scope.cerrarPopUpPreRequisitos()
                }
                blockUI.stop();
                $scope.mostrarMensaje(dato.message)
            })
        }

        $scope.verificarAsignacionPrerequisitos = function () {
            blockUI.start();
            var requisitos = Prerequisitos()
            requisitos.then(function (prerequisitos) {
                $scope.preRequisitos = prerequisitos.prerequisitos
                filtro = { inicio: 0, fin: 0 }
                var promesa = ListaPrerequisitosPaciente($scope.paciente.id, filtro);
                promesa.then(function (preRequisitos) {
                    $scope.prerequisitosPaciente = preRequisitos.Prerequisitos;
                    $scope.preRequisitos.forEach(function (requisito, index, array) {
                        

                        $scope.prerequisitosPaciente.forEach(function (preRe) {
                            preRe.fecha_vencimiento = $scope.calcularFechaVencimientoRequisito(preRe)
                            if (requisito.id == preRe.id_prerequisito) {
                                requisito.asignado = true
                            }

                            if (preRe.fecha_entrega != null) {
                                preRe.entregado = true
                            }
                        });

                        if ($scope.prerequisitosPaciente.length == 0) {
                            requisito.asignado = false
                        }

                        if (index == array.length - 1) {
                            blockUI.stop();
                        }
                    });

                    if ($scope.preRequisitos.length == 0) {
                        blockUI.stop();
                    }
                });
            })
        }

        $scope.asignarPrerequisito = function (prerequisito, paciente) {
            blockUI.start();
            prerequisito.pacientePrerequisito = { id: paciente.id }
            prerequisito.preRequisito = { id: prerequisito.id }
            prerequisito.fecha_inicio = new Date()
            prerequisito.fecha_inicio_texto = $scope.fechaATexto(prerequisito.fecha_inicio)
            prerequisito.fecha_vencimiento = $scope.calcularFechaVencimientoRequisito(prerequisito)
            prerequisito.paraAsignar = true
            PrerequisitoPaciente.save(prerequisito, function (res) {
                $scope.verificarAsignacionPrerequisitos()
                $scope.mostrarMensaje(res.mensaje)
                blockUI.stop()
            }, function (error) {
                $scope.mostrarMensaje('Ocurrio un problema al asignar el prerequisito')
                blockUI.stop()
            })
        }

        $scope.diasVencidos = function (fechaVencimiento) {
            var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
            var hoy = new Date().getTime()
            var vencimiento = fechaVencimiento.getTime()
            var calculo = hoy - vencimiento
            var dias = Math.floor(calculo / MILISENGUNDOS_POR_DIA)
            return dias
        }

        $scope.calcularFechaVencimientoRequisito = function (requisito) {
            var meses = (requisito.vencimiento_mes === undefined) ? requisito.preRequisito.vencimiento_mes : requisito.vencimiento_mes
            var fechaControl = new Date()
            var fecha_inicio = new Date()
            if (requisito.fecha_inicio_texto === undefined) {
                var otra_fecha = $scope.fechaATexto(requisito.fecha_inicio)
            }
            var fecha_cortada = (requisito.fecha_inicio_texto === undefined) ? otra_fecha.split('/') : requisito.fecha_inicio_texto.split('/')
            var dia = parseInt(fecha_cortada[0])
            var mes = parseInt(fecha_cortada[1])
            var anio = parseInt(fecha_cortada[2])
            fecha_inicio.setFullYear(anio, mes - 1, dia)
            // if($scope.fechaATexto(requisito.fecha_inicio) == requisito.fecha_inicio_texto){
            //     console.log('son iguales')
            // }else{
            //     console.log('no son iguales')
            // }
            var fecha_vencimiento = new Date(fecha_inicio.setTime(fecha_inicio.getTime() + (meses * 30) * 86400000))
            return fecha_vencimiento
            // requisito.fechav_texto = $scope.fechaATexto(requisito.fechav)
        }

        $scope.actualizarPreRequisitoPaciente = function (prerequisito) {
            blockUI.start()
            var prerequisito_ = prerequisito
            // prerequisito.fecha_inicio = new Date($scope.convertirFecha(prerequisito.fecha_inicio_texto))
            // prerequisito.fecha_vencimiento = $scope.calcularFechaVencimientoRequisito(prerequisito)
            prerequisito_.fecha_vencimiento = new Date($scope.convertirFecha(prerequisito_.fecha_vencimiento_texto))
            prerequisito_.fecha_inicio = new Date()
            prerequisito_.fecha_entrega = null
            prerequisito_.asignado = true
            PrerequisitoPaciente.save(prerequisito_, function (res) {

                $scope.mostrarMensaje(res.mensaje)
                $scope.cerrarDialogEditarPreRequisito()
                $scope.verificarAsignacionPrerequisitos()
                blockUI.stop()
            }, function (error) {
                $scope.mostrarMensaje('Ocurrio un problema al asignar el prerequisito')
                $scope.cerrarDialogEditarPreRequisito()
                blockUI.stop()
            })
        }

        $scope.saveFormPrerequisito = function (nuevoPrerequisito) {
            blockUI.start();
            // nuevoPrerequisito.fecha_inicio = new Date($scope.convertirFecha(nuevoPrerequisito.fecha_inicio))
            // nuevoPrerequisito.fecha_inicio = nuevoPrerequisito.fecha_inicio.setFullYear(nuevoPrerequisito.fecha_inicio.getFullYear(), nuevoPrerequisito.fecha_inicio.getMonth(), nuevoPrerequisito.fecha_inicio.getDate());
            // nuevoPrerequisito.fecha_vencimiento = nuevoPrerequisito.fechav.setFullYear(nuevoPrerequisito.fechav.getFullYear(), nuevoPrerequisito.fechav.getMonth(), nuevoPrerequisito.fechav.getDate())
            if (nuevoPrerequisito.nombre != undefined && nuevoPrerequisito.vencimiento_mes != undefined) {
                if (nuevoPrerequisito.id != undefined) {
                    nuevoPrerequisito.$save(nuevoPrerequisito, function (res) {

                        $scope.mostrarMensaje(res.mensaje);
                        $scope.cerrarPopupPrerequisitoNuevo();
                        blockUI.stop();
                        $scope.verificarAsignacionPrerequisitos()
                    }, function (error) {
                        $scope.cerrarPopupPrerequisitoNuevo();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                        blockUI.stop();
                    });
                } else {
                    nuevoPrerequisito.$save({ nuevoPrerequisito }, function (res) {
                        $scope.mostrarMensaje(res.mensaje);
                        $scope.cerrarPopupPrerequisitoNuevo();
                        blockUI.stop();
                        $scope.verificarAsignacionPrerequisitos()
                    }, function (error) {
                        $scope.cerrarPopupPrerequisitoNuevo();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                        blockUI.stop();
                    });
                }
            } else {
                $scope.mostrarMensaje('Los campos Prerequisito Nombre y vencimiento mes son requeridos.')
                blockUI.stop();
            }

        }

        $scope.finVerPaciente = function () {
            var button = $('#siguiente-v').text().trim()
            if (button != "Siguiente") {
                $scope.cerrarPopPupVista()
            }
        }

        $scope.sinFuncionalidad = function (mensaje) {
            $scope.mostrarMensaje('Sin funcionalidad')

        }

        $scope.abrirDialogEditarPreRequisito = function (prerequisito) {
            $scope.preRequisito = prerequisito
            $scope.preRequisito.fecha_vencimiento_texto = $scope.fechaATexto(new Date)
            $scope.abrirPopup($scope.idModalEditarPrerequisito);
        }

        $scope.cerrarDialogEditarPreRequisito = function () {
            $scope.cerrarPopup($scope.idModalEditarPrerequisito);
        }

        $scope.verPaciente = function (elpaciente) {
            promesaPaciente = obtenerPaciente(elpaciente.id)
            promesaPaciente.then(function (paciente) {
                $scope.paciente = paciente
                $scope.paciente.fecha_nacimiento_texto = $scope.fechaATexto($scope.paciente.persona.fecha_nacimiento)
            })
            $scope.abrirPopup($scope.idModalWizardPacienteVista);
        }

        $scope.cerrarPopPupVista = function () {
            $scope.cerrarPopup($scope.idModalWizardPacienteVista);
        }

        $scope.modificarPaciente = function (elpaciente) {
            promesaPaciente = obtenerPaciente(elpaciente.id)
            promesaPaciente.then(function (paciente) {
                console.log(paciente)
                $scope.paciente = paciente
                // $scope.ficha.empleado.cargo = []
                /* $scope.seleccionarCargos($scope.paciente.cargos) */
                $scope.paciente.fecha_nacimiento_texto = $scope.fechaATexto($scope.paciente.persona.fecha_nacimiento)
                $scope.paciente.persona.imagen = (paciente.persona.imagen == null) ? "img/icon-user-default.png" : paciente.persona.imagen
                console.log($scope.paciente.fecha_nacimiento_texto)
            })
            console.log($scope.paciente)
            $scope.abrirPopup($scope.idModalDialogPacienteNuevo);
        }

        $scope.mostrarConfirmacionEliminacion = function (paciente) {
            paciente.persona = (paciente.persona == undefined) ? { imagen: (paciente.imagen == null) ? "img/icon-user-default.png" : paciente.imagen } : paciente.persona.imagen
            paciente.eliminar = true
            $scope.paciente = paciente
            $scope.abrirPopup($scope.idModalEliminarPaciente);
        }

        $scope.cerrarConfirmacionEliminacion = function () {
            $scope.cerrarPopup($scope.idModalEliminarPaciente);
        };

        $scope.eliminarPaciente = function (paciente) {
            blockUI.start();
            $scope.paciente.eliminado = (paciente.eliminado == false) ? true : false;
            Paciente.update({ id_paciente: $scope.paciente.id }, $scope.paciente, function (res) {
                blockUI.stop();
                $scope.cerrarConfirmacionEliminacion();
                $scope.obtenerPacientes();
                $scope.mostrarMensaje('Eliminado Exitosamente!');
            }, function (error) {
                blockUI.stop();
                $scope.cerrarConfirmacionEliminacion();
                $scope.obtenerPacientes();
                $scope.mostrarMensaje('Ocurrio un problema al eliminar el paciente!');
                $scope.recargarItemsTabla()
            })

        }

        $scope.cortarFecha = function (fechaTexto) {
            var fechaArray = fechaTexto.split(' ')
            var horaArray = fechaArray[1].split(':')
            var lafecha = fechaArray[0].split('/')
            var dia = parseInt(lafecha[0])
            var mes = parseInt(lafecha[1])
            var anio = parseInt(lafecha[2])
            var fecha = new Date()
            var laHora = (fechaArray[2] == "AM") ? parseInt(horaArray[0]) : (parseInt(horaArray[0]) < 12) ? parseInt(horaArray[0]) + 12 : parseInt(horaArray[0])
            fecha.setFullYear(anio, mes - 1, dia)
            fecha.setHours(laHora, horaArray[1])
            return fecha
        }

        $scope.guardarConsulta = function (form, consulta) {
            var button = $('#siguiente-c').text().trim();
            if (button != "Siguiente") {
                if (form.$valid) {
                    var cortarFecha = consulta.fecha.split(' ')
                    consulta.fecha = (consulta.fecha instanceof Date) ? $scope.cortarFecha(consulta.fecha) : $scope.cortarFecha(consulta.fecha)
                    consulta.presion = consulta.presionAlta + "/" + consulta.presionBaja
                    var promesa = CrearMedicoPacienteConsulta(consulta)
                    promesa.then(function (params) {
                        $scope.cerrarPopUpConsulta()
                        $scope.recargarItemsTabla()
                        $scope.mostrarMensaje(params.message)
                    })
                }
            }
        }

        $scope.guardarDatosConsulta = function (form, consulta) {
            if (form.$valid) {
                var cortarFecha = consulta.fecha.split(' ')
                consulta.fecha = (consulta.fecha instanceof Date) ? $scope.cortarFecha(consulta.fecha) : $scope.cortarFecha(consulta.fecha)
                consulta.presion = consulta.presionAlta + "/" + consulta.presionBaja
                var promesa = CrearMedicoPacienteConsulta(consulta)
                promesa.then(function (params) {
                    $scope.cerrarPopUpConsulta()
                    $scope.recargarItemsTabla()
                    $scope.mostrarMensaje(params.message)
                })
            }
        }
        $scope.listarConsultasPaciente = function (filtro) {
            if (filtro.inicio != undefined) {
                if (filtro.inicio != 0 || filtro.inicio != "") {
                    $scope.filtro.inicio = (filtro.inicio instanceof Date) ? filtro.inicio : new Date($scope.convertirFecha(filtro.inicio));
                } else {
                    $scope.filtro.inicio = 0
                }
            } else {
                $scope.filtro.inicio = 0
            }
            if (filtro.fin != undefined) {
                if (filtro.fin != 0 || filtro.fin != "") {
                    $scope.filtro.fin = (filtro.fin instanceof Date) ? filtro.fin : new Date($scope.convertirFecha(filtro.fin));
                } else {
                    $scope.filtro.fin = 0
                }
            } else {
                $scope.filtro.fin = 0
            }
            var promesa = ListaConsultasMedicoPaciente($scope.paciente.id, $scope.filtro)
            promesa.then(function (dato) {
                $scope.listaConsultas = dato.consultas
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
            })
        }
        $scope.changeActivo = function (paciente) {
            PacienteActivo.update({ id_paciente: paciente.id }, paciente, function (res) {
                $scope.mostrarMensaje(res.mensaje)
            });
        }
        $scope.saveForm = function (paciente) {
            $scope.paciente = paciente;
            var imagenPaciente = paciente.imagen;
            var button = $('#siguiente').text().trim()
            if (button != "Siguiente") {
                blockUI.start();
                if (paciente.id) {
                    paciente.persona.fecha_nacimiento = new Date($scope.convertirFecha(paciente.fecha_nacimiento_texto));
                    Paciente.update({ id_paciente: paciente.id }, paciente, function (res) {
                        blockUI.stop();
                        $scope.cerrarPopupPacienteNuevo();
                        $scope.obtenerPacientes();
                        $scope.mostrarMensaje('Actualizado Exitosamente!');
                        $scope.recargarItemsTabla()
                    });
                } else {
                    paciente.persona.fecha_nacimiento = new Date($scope.convertirFecha(paciente.fecha_nacimiento_texto));
                    paciente.$save({ id_paciente: 0 }, function (res) {
                        blockUI.stop();
                        $scope.cerrarPopupPacienteNuevo();
                        $scope.obtenerPacientes();
                        $scope.mostrarMensaje(res.message);
                        $scope.recargarItemsTabla()
                    }, function (error) {
                        blockUI.stop();
                        $scope.cerrarPopupPacienteNuevo();
                        $scope.obtenerPacientes();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                        $scope.recargarItemsTabla()
                    });
                }
            }
        }

        $scope.saveComment = function (paciente) {
            Comentario.update({ id_paciente: paciente.id }, paciente, function (res) {
                $scope.mostrarMensaje('Comentario actualizado Exitosamente!');
            }, function (error) {
                $scope.mostrarMensaje('Hubo un problema al guardar su comentario.');
            });
            blockUI.stop();
            $scope.cerrarDialogDialogComentario();
        }

        $scope.filtrarHistorialVacunas = function (filtroVacunas) {
            var fecha_inicio = (filtroVacunas.inicio === "" || filtroVacunas.inicio === undefined) ? 0 : new Date(filtroVacunas.inicio)
            var fecha_fin = (filtroVacunas.fin === "" || filtroVacunas.fin === undefined) ? 0 : new Date(filtroVacunas.fin)
            var tipo_opcion = (filtroVacunas.opcion === "" || filtroVacunas.opcion === undefined) ? 0 : filtroVacunas.opcion
            if (fecha_inicio != 0 && fecha_fin != 0) {
                $scope.filtroHistorialVacunas.forEach(vacuna => {
                    vacuna.pacienteVacunaDosis.forEach(dosis => {
                        var myDate = new Date(dosis.fecha_aplicacion)
                        if (fecha_inicio <= myDate && fecha_fin >= myDate) {
                            dosis.visible = true
                            if (tipo_opcion != 0) {
                                if (tipo_opcion == 'enfec') {
                                    dosis.visible = (dosis.retrasada == undefined) ? false : (dosis.retrasada && !dosis.proyectada) ? false : true
                                }
                                if (tipo_opcion == 'proye') {
                                    dosis.visible = (dosis.proyectada == undefined || dosis.proyectada == null) ? false : (dosis.proyectada) ? true : false
                                }
                                if (tipo_opcion == 'retra') {
                                    dosis.visible = (dosis.retrasada == undefined) ? false : (dosis.retrasada && !dosis.proyectada) ? true : false
                                }
                                if (tipo_opcion == 'todas') {
                                    dosis.visible = true
                                }
                            }
                        } else {
                            dosis.visible = false
                        }
                    })
                })
            } else {
                $scope.filtroHistorialVacunas.forEach(vacuna => {
                    vacuna.pacienteVacunaDosis.forEach(dosis => {
                        if (tipo_opcion != 0) {
                            $scope.filtroHistorialVacunas.forEach(vacuna => {
                                vacuna.pacienteVacunaDosis.forEach(dosis => {
                                    if (tipo_opcion == 'enfec') {
                                        dosis.visible = (dosis.retrasada == undefined) ? false : (dosis.retrasada && !dosis.proyectada) ? false : true
                                    }
                                    if (tipo_opcion == 'proye') {
                                        dosis.visible = (dosis.proyectada == undefined || dosis.proyectada == null) ? false : (dosis.proyectada) ? true : false
                                    }
                                    if (tipo_opcion == 'retra') {
                                        dosis.visible = (dosis.retrasada == undefined) ? false : (dosis.retrasada && !dosis.proyectada) ? true : false
                                    }
                                    if (tipo_opcion == 'todas') {
                                        dosis.visible = true
                                    }
                                });
                            })
                        } else {
                            dosis.visible = true
                        }
                    })
                })
            }
            if (fecha_inicio != 0 && fecha_fin == 0) {
                $scope.filtroHistorialVacunas.forEach(vacuna => {
                    vacuna.pacienteVacunaDosis.forEach(dosis => {
                        var myDate = new Date(dosis.fecha_aplicacion)
                        if (fecha_inicio <= myDate) {
                            dosis.visible = true
                            if (tipo_opcion != 0) {
                                if (tipo_opcion == 'enfec') {
                                    dosis.visible = (dosis.retrasada == undefined) ? false : (dosis.retrasada && !dosis.proyectada) ? false : true
                                }
                                if (tipo_opcion == 'proye') {
                                    dosis.visible = (dosis.proyectada == undefined || dosis.proyectada == null) ? false : (dosis.proyectada) ? true : false
                                }
                                if (tipo_opcion == 'retra') {
                                    dosis.visible = (dosis.retrasada == undefined) ? false : (dosis.retrasada && !dosis.proyectada) ? true : false
                                }
                                if (tipo_opcion == 'todas') {
                                    dosis.visible = true
                                }
                            }
                        } else {
                            dosis.visible = false
                        }
                    })
                })
            } else if (fecha_inicio == 0 && fecha_fin != 0) {
                $scope.filtroHistorialVacunas.forEach(vacuna => {
                    vacuna.pacienteVacunaDosis.forEach(dosis => {
                        var myDate = new Date(dosis.fecha_aplicacion)
                        if (fecha_fin >= myDate) {
                            dosis.visible = true
                            if (tipo_opcion != 0) {
                                if (tipo_opcion == 'enfec') {
                                    dosis.visible = (dosis.retrasada == undefined) ? false : (dosis.retrasada && !dosis.proyectada) ? false : true
                                }
                                if (tipo_opcion == 'proye') {
                                    dosis.visible = (dosis.proyectada == undefined || dosis.proyectada == null) ? false : (dosis.proyectada) ? true : false
                                }
                                if (tipo_opcion == 'retra') {
                                    dosis.visible = (dosis.retrasada == undefined) ? false : (dosis.retrasada && !dosis.proyectada) ? true : false
                                }
                                if (tipo_opcion == 'todas') {
                                    dosis.visible = true
                                }
                            }
                        } else {
                            dosis.visible = false
                        }
                    })
                })
            }
        }

        $scope.limpiarVisibilidadDosis = function () {
            $scope.filtroHistorialVacunas.forEach(vac => {
                vac.pacienteVacunaDosis.forEach(dosis => {
                    dosis.visible = true
                });
            });
        }

        $scope.abrirDialogHistorialVacuna = function (vacuna) {
            var indx = $scope.paciente.vacunas.indexOf(vacuna);
            $scope.vacuna = $scope.paciente.vacunas[indx];
            $scope.evaluarFechaDosisVacuna($scope.vacuna)
            $scope.filtroHistorialVacunas = []
            $scope.filtroHistorialVacunas.push($scope.vacuna)
            $scope.limpiarVisibilidadDosis()
            $scope.abrirPopup($scope.idModalDialogHistorialVacuna);
            $scope.filtroHistorialVacunas.forEach(vac => {
                vac.pacienteVacunaDosis.forEach(dosis => {
                    dosis.visible = true
                });
            });
        }

        $scope.cerrarDialogHistorialVacuna = function () {
            $scope.filtroVacunas = { inicio: "", fin: "", opcion: "todas" }
            $scope.limpiarVisibilidadDosis()
            $scope.cerrarPopup($scope.idModalDialogHistorialVacuna);
        }

        $scope.abrirDialogHistorialConsulta = function () {
            $scope.listarConsultasPaciente({ inicio: 0, fin: 0 })
            $scope.dynamicPopoverCargos = {
                templateUrl: 'consultaPopoverTemplate.html',
            };
            $scope.abrirPopup($scope.idModalHistorialConsulta);
        }

        $scope.cerrarDialogHistorialConsulta = function () {
            $scope.cerrarPopup($scope.idModalHistorialConsulta);
        }

        $scope.abrirDialogHistorialVacunaGeneral = function () {
            $scope.paciente.vacunas.forEach(function (vacuna, index, array) {
                $scope.evaluarFechaDosisVacuna(vacuna)
                if (index === array.length - 1) {
                    $scope.filtroHistorialVacunas = $scope.paciente.vacunas
                    $scope.limpiarVisibilidadDosis()
                }
            }, this);
            $scope.abrirPopup($scope.idModalDialogHistorialVacunaGeneral);
        }

        $scope.cerrarDialogHistorialVacunaGeneral = function () {
            $scope.filtroVacunas = { inicio: "", fin: "", opcion: "todas" }
            $scope.limpiarVisibilidadDosis()
            $scope.filtroHistorialVacunas = []
            $scope.cerrarPopup($scope.idModalDialogHistorialVacunaGeneral);
        }

        $scope.abrirDialogDiagnosticos = function (paciente) {
            $scope.paciente = paciente
            $scope.ObtenerMedicoDiagnostico(paciente)
            $scope.abrirPopup($scope.idModalDialogDiagnosticos);
        }

        $scope.cerrarDialogDiagnosticos = function () {
            $scope.cerrarPopup($scope.idModalDialogDiagnosticos);
        }

        $scope.abrirDialogDiagnosticoNuevo = function (diagnosticco, vista) {
            $scope.diagnostico = {}
            if (diagnosticco) {
                $scope.diagnostico = diagnosticco
            }
            if (vista) {
                $scope.diagnostico.soloVista = true
            } else {
                $scope.diagnostico.soloVista = false
            }
            $scope.abrirPopup($scope.idModalDialogDiagnosticoNuevo);
        }

        $scope.cerrarDialogDiagnosticoNuevo = function () {
            $scope.cerrarPopup($scope.idModalDialogDiagnosticoNuevo);
        }

        $scope.abrirDialogExamenesDiagnostico = function (diagnostico) {
            $scope.diagnostico = diagnostico
            $scope.ObtenerMedicoDiagnosticoExamenes(diagnostico)
            $scope.abrirPopup($scope.idModalDialogExamenesDiagnostico);
        }

        $scope.cerrarDialogExamenesDiagnostico = function () {
            $scope.cerrarPopup($scope.idModalDialogExamenesDiagnostico);
        }

        $scope.abrirDialogNuevoExamenDiagnostico = function (examen, vista) {
            $scope.examen = {}
            if (examen) {
                $scope.examen = examen
            }
            if (vista) {
                $scope.examen.soloVista = true
            } else {
                $scope.examen.soloVista = false
            }
            $scope.abrirPopup($scope.idModalDialogNuevoExamenDiagnostico);
        }

        $scope.cerrarDialogNuevoExamenDiagnostico = function () {
            $scope.cerrarPopup($scope.idModalDialogNuevoExamenDiagnostico);
        }

        $scope.abrirDialogHistorialFicha = function (ficha) {
            var filtro = { inicio: 0, fin: 0, tipo_control: 0 }
            $scope.ObtenerHistorialFichaMedica(filtro)
            $scope.abrirPopup($scope.idModalDialogHistorialFicha);
        }

        $scope.cerrarDialogHistorialFicha = function () {
            $scope.cerrarPopup($scope.idModalDialogHistorialFicha);
        }

        $scope.abrirDialogDialogCredencial = function (paciente) {
            $scope.paciente = paciente
            var promesa = BuscarFichaPaciente(paciente.id)
            promesa.then(function (datos) {
                if (datos.ficha) {
                    $scope.ficha = datos.ficha
                    if (!$scope.ficha.enfermedad_cardilogia) $scope.ficha.enfermedad_cardilogia2 = true
                    if (!$scope.ficha.enfermedad_hipertension) $scope.ficha.enfermedad_hipertension2 = true
                    if (!$scope.ficha.enfermedad_lumbalgia) $scope.ficha.enfermedad_lumbalgia2 = true
                    if (!$scope.ficha.enfermedad_diabetes) $scope.ficha.enfermedad_diabetes2 = true
                    if (!$scope.ficha.enfermedad_epilepsia) $scope.ficha.enfermedad_epilepsia2 = true
                    if (!$scope.ficha.enfermedad_chagas) $scope.ficha.enfermedad_chagas2 = true
                    if (!$scope.ficha.enfermedad_hepatitis) $scope.ficha.enfermedad_hepatitis2 = true
                    if (!$scope.ficha.enfermedad_otros == "") { $scope.ficha.enfermedad_otros2 = true } else { $scope.ficha.enfermedad_otros3 = true }
                    if ($scope.ficha.alergia_otros || $scope.ficha.alergia_conservas || $scope.ficha.alergia_alimentos || $scope.ficha.alergia_humo_cigarrillo || $scope.ficha.alergia_polvo || $scope.ficha.alergia_quimico || $scope.ficha.alergia_algun_material || $scope.ficha.alergia_medicamento || $scope.ficha.alergia_plantas) {
                        $scope.ficha.alergia = true
                    } else {
                        $scope.ficha.alergia2 = true
                    }
                    $scope.abrirPopup($scope.idModalDialogCredencial);
                } else {
                    $scope.mostrarMensaje("primero debe crear una ficha medica del paciente para poder ver el credencial")
                }
            })
        }

        $scope.cerrarDialogDialogCredencial = function () {
            $scope.cerrarPopup($scope.idModalDialogCredencial);
        }

        $scope.abrirDialogDialogPatologias = function (paciente) {
            $scope.paciente = paciente
            var promesa = BuscarFichaPaciente(paciente.id)
            promesa.then(function (datos) {
                if (datos.ficha) {
                    $scope.ficha = datos.ficha
                    $scope.abrirPopup($scope.idModalDialogPatologias);
                } else {
                    $scope.mostrarMensaje("primero debe crear una ficha medica para poder ver las patogias del paciente")
                }
            })
        }

        $scope.guardarPatoliga = function () {
            var promesa = ActualizarPatologiaPaciente($scope.paciente.id, $scope.ficha)
            promesa.then(function (datos) {
                $scope.cerrarDialogDialogPatologias()
                $scope.mostrarMensaje(datos.message)
            })
        }

        $scope.cerrarDialogDialogPatologias = function () {
            $scope.cerrarPopup($scope.idModalDialogPatologias);
        }

        $scope.abrirDialogDialogComentario = function (paciente) {
            $scope.paciente = paciente
            $scope.abrirPopup($scope.idModalDialogComentario);
        }

        $scope.cerrarDialogDialogComentario = function () {
            $scope.cerrarPopup($scope.idModalDialogComentario);
        }

        $scope.abrirDialogDialogAlertPrerequisitos = function () {
            var filtro = { inicio: 0, fin: 0 }
            $scope.listaAlertasPrerequisitosPaciente(filtro)
            $scope.abrirPopup($scope.idModalAlertPrerequisitos);
        }

        $scope.cerrarDialogDialogAlertPrerequisitos = function () {
            $scope.cerrarPopup($scope.idModalAlertPrerequisitos);
        }

        $scope.verificarConteoAlertas = function () {
            var conteo = 0

            if ($scope.alertasPrerequisitos != undefined) {
                conteo += $scope.alertasPrerequisitos
            }

            if ($scope.alertasVacunas != undefined) {
                conteo += $scope.alertasVacunas
            }
            $scope.alertasOtros = 0
            return conteo

        }

        // obtenerAlertasPrerequisitos = function (filtro) {
        //     $scope.filtro = filtro
        //     var promesa = ListaAlertasPrerequisitosPaciente($scope.usuario.id_empresa, filtro)
        //     promesa.then(function (datos) {
        //         $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
        //         $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
        //         $scope.listaAlertPrerequisitos = datos.Prerequisitos
        //         $scope.listaAlertPrerequisitos.forEach(function (prerequisito, index, array) {
        //             var fechaInicio = new Date(prerequisito.fecha_inicio)
        //             var fechaVence = new Date(prerequisito.fecha_vencimiento)
        //             prerequisito.DiasVence = $scope.diasVencidos(fechaVence)
        //             if (prerequisito.fecha_entrega != null) {
        //                 prerequisito.entregado = true
        //             }else{
        //                 prerequisito.entregado = false
        //             }
        //             if (index == array.length - 1) {
        //                 $scope.alertasPrerequisitos = $scope.listaAlertPrerequisitos.length
        //             }
        //         }, this);
        //     })
        // }

        $scope.obtenerAlertas = function () {
            $scope.verificarAlertasPrerequisitos()
            $scope.verificarAlertasVacunas()
            $scope.verificarConteoAlertas()
        }

        $scope.verificarAlertasPrerequisitos = function () {
            var filtro = { inicio: 0, fin: 0 }
            $scope.filtro = filtro
            var promesa = ListaAlertasPrerequisitosPaciente($scope.usuario.id_empresa, filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
                var listado = datos.Prerequisitos
                $scope.listaAlertPrerequisitos = []
                listado.forEach(function (prerequisito, index, array) {
                    var hoy = new Date()
                    var fechaVence = new Date(prerequisito.fecha_vencimiento)
                    prerequisito.DiasVence = $scope.diasVencidos(fechaVence)

                    if (prerequisito.fecha_entrega != null) {
                        prerequisito.entregado = true
                    } else {
                        prerequisito.entregado = false

                        if (!prerequisito.reprogramado) {
                            if (prerequisito.DiasVence <= prerequisito.preRequisito.dias_activacion && prerequisito.DiasVence >= prerequisito.preRequisito.dias_activacion * -1) {
                                $scope.listaAlertPrerequisitos.push(prerequisito)
                            }
                        } else {
                            if (prerequisito.DiasVence <= prerequisito.dias_activacion && prerequisito.DiasVence >= prerequisito.dias_activacion * -1) {
                                $scope.listaAlertPrerequisitos.push(prerequisito)
                            }
                        }
                    }
                    if (index == array.length - 1) {
                        $scope.alertasPrerequisitos = $scope.listaAlertPrerequisitos.length
                    }
                }, this);
            })
        }

        $scope.verificarAlertasVacunas = function () {
            var filtro = { inicio: 0, fin: 0 }
            if (filtro.vacuna === "" || filtro.vacuna === undefined) {
                filtro.vacuna = 0
            }
            var promesa = ListaAlertasVacunasEmpresa($scope.usuario.id_empresa, filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
                $scope.listaAlertVacunas = datos.Vacunas
                $scope.listaAlertVacunas.forEach(function (vacuna, index, array) {
                    var fechaInicio = new Date(vacuna.fecha_ultima_aplicacion)
                    var fechaVence = new Date(vacuna.fecha_siguiente_aplicacion)
                    vacuna.DiasVence = $scope.diasVencidos(fechaVence)
                    console.log(vacuna.DiasVence)
                    if (index == array.length - 1) {
                        $scope.alertasVacunas = $scope.listaAlertVacunas.length
                    }
                }, this);
            })
        }

        $scope.listaAlertasPrerequisitosPaciente = function (filtro) {
            $scope.filtro = filtro
            if (filtro.inicio != undefined) {
                if (filtro.inicio != 0 && filtro.inicio != "") {
                    $scope.filtro.inicio = (filtro.inicio instanceof Date) ? filtro.inicio : new Date($scope.convertirFecha(filtro.inicio));
                } else {
                    $scope.filtro.inicio = 0
                }
            } else {
                $scope.filtro.inicio = 0
            }
            if (filtro.fin != undefined) {
                if (filtro.fin != 0 && filtro.fin != "") {
                    $scope.filtro.fin = (filtro.fin instanceof Date) ? filtro.fin : new Date($scope.convertirFecha(filtro.fin));
                } else {
                    $scope.filtro.fin = 0
                }
            } else {
                $scope.filtro.fin = 0
            }

            var promesa = ListaAlertasPrerequisitosPaciente($scope.usuario.id_empresa, $scope.filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
                var listado = datos.Prerequisitos
                $scope.listaAlertPrerequisitos = []
                listado.forEach(function (prerequisito, index, array) {
                    var fechaInicio = new Date(prerequisito.fecha_inicio)
                    var fechaVence = new Date(prerequisito.fecha_vencimiento)
                    prerequisito.DiasVence = $scope.diasVencidos(fechaVence)
                    if (prerequisito.fecha_entrega != null) {
                        prerequisito.entregado = true
                    } else {
                        prerequisito.entregado = false
                        if (prerequisito.DiasVence <= prerequisito.preRequisito.dias_activacion && prerequisito.DiasVence >= prerequisito.preRequisito.dias_activacion * -1) {
                            $scope.listaAlertPrerequisitos.push(prerequisito)
                        }
                    }

                    if (index == array.length - 1) {
                        $scope.alertasPrerequisitos = $scope.listaAlertPrerequisitos.length
                        $scope.verificarConteoAlertas()
                    }
                }, this);

            })
        }

        $scope.obtenerListaEmpresaVacunas = function (filtro) {
            $scope.filtro = filtro
            if (filtro.inicio != undefined && filtro.fin != undefined) {
                if (filtro.inicio != 0 || filtro.inicio != "") {
                    $scope.filtro.inicio = (filtro.inicio instanceof Date) ? filtro.inicio : new Date($scope.convertirFecha(filtro.inicio));
                    $scope.filtro.fin = (filtro.fin instanceof Date) ? filtro.fin : new Date($scope.convertirFecha(filtro.fin));
                } else {
                    $scope.filtro.inicio = 0
                    $scope.filtro.fin = 0
                }
            } else {
                $scope.filtro.inicio = 0
                $scope.filtro.fin = 0
            }
            var promesa = ListaVacunasEmpresa($scope.usuario.id_empresa, $scope.filtro)
            promesa.then(function (datos) {
                // $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                // $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
                $scope.listaAlertVacunas = datos.Vacunas
                $scope.listaAlertVacunas.forEach(function (vacuna) {
                    var fechaInicio = new Date(vacuna.fecha_ultima_aplicacion)
                    var fechaVence = new Date(vacuna.fecha_siguiente_aplicacion)
                    vacuna.DiasVence = $scope.diasVencidos(fechaVence).
                        console.log(vacuna.DiasVence)
                }, this);
            })
        }

        $scope.obtenerListaAlertasVacunas = function (filtro) {
            $scope.filtro = filtro
            if (filtro.inicio != undefined) {
                if (filtro.inicio != 0 && filtro.inicio != "") {
                    $scope.filtro.inicio = (filtro.inicio instanceof Date) ? filtro.inicio : new Date($scope.convertirFecha(filtro.inicio));
                } else {
                    $scope.filtro.inicio = 0
                }
            } else {
                $scope.filtro.inicio = 0
            }
            if (filtro.fin != undefined) {
                if (filtro.fin != 0 && filtro.fin != "") {
                    $scope.filtro.fin = (filtro.fin instanceof Date) ? filtro.fin : new Date($scope.convertirFecha(filtro.fin));
                } else {
                    $scope.filtro.fin = 0
                }
            } else {
                $scope.filtro.fin = 0
            }
            if (filtro.vacuna == null || filtro.vacuna == undefined || $scope.filtro.vacuna == "") {
                $scope.filtro.vacuna = 0
            }
            var promesa = ListaAlertasVacunasEmpresa($scope.usuario.id_empresa, filtro)
            promesa.then(function (datos) {
                $scope.listaAlertVacunas = datos.Vacunas
                $scope.listaAlertVacunas.forEach(function (vacuna) {
                    var fechaInicio = new Date(vacuna.fecha_ultima_aplicacion)
                    var fechaVence = new Date(vacuna.fecha_siguiente_aplicacion)
                    vacuna.DiasVence = $scope.diasVencidos(fechaVence)
                    $scope.alertasVacunas = $scope.listaAlertVacunas.length
                    $scope.verificarConteoAlertas()
                    console.log(vacuna.DiasVence)
                }, this);
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
            })
        }

        $scope.setDiasActivacionPrerequisitos = function (dias_Activacion) {
            blockUI.start()
            if ($scope.preRequisito === undefined) {
                var datos = { setDiasTodos: true, dias_activacion: dias_Activacion }
                Prerequisito.save(datos, function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrarDialogDialogDiasActivacionPrerequisitos()
                    $scope.obtenerAlertas()
                    blockUI.stop()
                })
            } else {
                $scope.preRequisito.dias_activacion = dias_Activacion
                Prerequisito.save($scope.preRequisito, function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrarDialogDialogDiasActivacionPrerequisitos()
                    $scope.obtenerAlertas()
                    blockUI.stop()
                })
            }
        }

        $scope.setDiasActivacionVacunas = function (dias_Activacion) {
            blockUI.start()
            if ($scope.vacuna === undefined) {
                var datos = { setDiasTodos: true, dias_activacion: dias_Activacion }
                Vacuna.update(datos, function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrarDialogDiasActivacionVacunas()
                    $scope.obtenerAlertas()
                    blockUI.stop()
                })
            } else {
                $scope.vacuna.dias_activacion = dias_Activacion
                Vacuna.update($scope.preRequisito, function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrarDialogDiasActivacionVacunas()
                    $scope.obtenerAlertas()
                    blockUI.stop()
                })
            }
        }

        $scope.abrirDialogDialogDiasActivacionPrerequisitos = function (prerequisito) {
            if (prerequisito === undefined) {
                $scope.preRequisito = undefined
                $scope.paciente = undefined
            }
            else {
                $scope.preRequisito = prerequisito
            }
            $scope.abrirPopup($scope.idModalDiasActivacionPrerequisitos);
        }

        $scope.cerrarDialogDialogDiasActivacionPrerequisitos = function () {
            $scope.cerrarPopup($scope.idModalDiasActivacionPrerequisitos);
        }

        $scope.reprogramarPrerequisitos = function (fecha_reprogramada) {
            blockUI.start()
            if ($scope.paciente === undefined && $scope.preRequisito === undefined) {
                var datos = { reprogramarTodos: true, fecha_vencimiento: new Date(fecha_reprogramada) }
                PrerequisitoPaciente.save(datos, function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrarDialogReprogramarPrerequisitos()
                    $scope.obtenerAlertas()
                    blockUI.stop()
                })
            } else {
                $scope.preRequisito.fecha_vencimiento = new Date($scope.convertirFecha(fecha_reprogramada))
                $scope.preRequisito.asignado = true
                PrerequisitoPaciente.save($scope.preRequisito, function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    $scope.cerrarDialogReprogramarPrerequisitos()
                    $scope.obtenerAlertas()
                    blockUI.stop()
                })
            }
        }
        $scope.abrirDialogReprogramarPrerequisitos = function (prerequisito) {
            if (prerequisito === undefined) {
                $scope.preRequisito = undefined
                $scope.paciente = undefined
            }
            else {
                $scope.preRequisito = prerequisito
            }
            $scope.abrirPopup($scope.idModalReprogramarPrerequisitos);
        }

        $scope.cerrarDialogReprogramarPrerequisitos = function () {
            $scope.cerrarPopup($scope.idModalReprogramarPrerequisitos);
        }

        $scope.abrirDialogAlertVacunas = function () {
            var filtro = { inicio: 0, fin: 0 }
            $scope.obtenerListaAlertasVacunas(filtro)
            $scope.abrirPopup($scope.idModalAlertVacunas);
        }

        $scope.cerrarDialogAlertVacunas = function () {
            $scope.cerrarPopup($scope.idModalAlertVacunas);
        }

        $scope.abrirDialogDiasActivacionVacunas = function (vacuna) {
            if (vacuna === undefined) {
                $scope.vacuna = undefined
            } else {
                $scope.vacuna = vacuna
            }
            $scope.abrirPopup($scope.idModalDiasActivacionVacunas);
        }

        $scope.cerrarDialogDiasActivacionVacunas = function () {
            $scope.cerrarPopup($scope.idModalDiasActivacionVacunas);
        }

        $scope.abrirDialogReprogramarVacunas = function () {
            $scope.abrirPopup($scope.idModalReprogramarVacunas);
        }

        $scope.cerrarDialogReprogramarVacunas = function () {
            $scope.cerrarPopup($scope.idModalReprogramarVacunas);
        }

        $scope.cerrarIdModalDialogLaboratorioExamenesHistoricoResultados = function () {
            $scope.cerrarPopup($scope.IdModalDialogLaboratorioExamenHistoricoResultado);
        }

        $scope.cerrarIdModalDialogDiagnosticoExamenesHistoricoResultados = function () {
            $scope.cerrarPopup($scope.IdModalDialogDiagnosticoExamenHistoricoResultado);
        }

        $scope.cerrarIdModalDialogNuevoLaboratorio = function () {
            $scope.cerrarPopup($scope.IdModalDialogNuevoLaboratorio);
        }

        $scope.cerrarIdModalDialogLaboratorioExameneHistoricoPreview = function () {
            $scope.cerrarPopup($scope.IdModalDialogLaboratorioExamenHistoricoPreview);
        }

        $scope.cerrarIdModalDialogLaboratorioExamenesNuevoResultado = function () {
            $scope.cerrarPopup($scope.IdModalDialogLaboratorioExamenesNuevoResultado);
        }

        $scope.cerrarIdModalDialogLaboratorioExamenes = function () {
            $scope.cerrarPopup($scope.IdModalDialogLaboratorioExamenes);
        }

        $scope.cerrarPopUpExamenLaboratorio = function () {
            $scope.cerrarPopup($scope.IdModalDialogLaboratorioExamen);
        }

        $scope.cerrarPopUpVacunaNueva = function () {
            $scope.vacunaDosis = []
            setTimeout(function () {
                $scope.obtenerVacunas()
                setTimeout(function () {
                    $scope.verificarAsignacionVacunas()
                }, 1000);
            }, 1000);
            $scope.dosis = {}
            $scope.dosisEdit = false
            $scope.cerrarPopup($scope.idModalDialogVacunaEdicion);
        }

        $scope.cerrarPopUpVacunasConfig = function () {
            $scope.paciente.vacunas = []
            var vacunas_paciente = VacunasPaciente($scope.paciente)
            vacunas_paciente.then(function (datosVacunas) {
                $scope.paciente.vacunas = datosVacunas
                $scope.paciente.vacunas.forEach(function (vacuna) {
                    var hoy = new Date()
                    vacuna.fechaAplicacionVacuna_texto = hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear()
                    vacuna.button_clicked = false
                }, this);
            })
            $scope.limpiarAsignacionVacunas()
            $scope.verificarAsignacionVacunas()
            $scope.obtenerAlertas()
            $scope.cerrarPopup($scope.idModalDialogVacunasConfig);
        }

        $scope.cerrarPopUpIdModalFichaTecnica = function () {
            $scope.cerrarPopup($scope.idModalFichaTecnica);
        }

        $scope.cerrarPopUpConsulta = function () {
            $scope.cerrarPopup($scope.idModalDialogConsulta);

        }

        $scope.cerrarPopUpPreRequisitos = function () {
            $scope.obtenerAlertas()
            $scope.cerrarPopup($scope.IdModalDialogPreRequisitos);
        }

        $scope.cerrarIdModalDialogLaboratorio = function () {
            $scope.cerrarPopup($scope.IdModalDialogLaboratorio);
        }

        $scope.cerrarPopPupVacunas = function () {
            $scope.filtroHistorialVacunas = []
            $scope.obtenerAlertas()
            $scope.cerrarPopup($scope.idModalDialogVacunas);
        }

        $scope.cerrarPopPupVacunasConfig = function () {
            $scope.obtenerAlertas()
            $scope.cerrarPopup($scope.idModalDialogVacunasConfig);
        }

        $scope.crearNuevaConsulta = function (paciente) {
            var hoy = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            $scope.horaConsulta = new Date().getHours() + ':' + new Date().getMinutes()
            var aopm = (new Date().getHours() >= 12) ? 'PM' : 'AM'
            $scope.consulta = { id_paciente: paciente.id, fecha: hoy + ' ' + $scope.horaConsulta + ' ' + aopm }
            $scope.paciente = paciente
            var filtro = { inicio: 0, fin: 0 }
            var promesa = ListaConsultasMedicoPaciente($scope.paciente.id, filtro)
            promesa.then(function (dato) {
                $scope.consultas = dato.consultas
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
            })
            $scope.abrirPopup($scope.idModalDialogConsulta);
        }
        $scope.EliminarNuevoLaboratorio = function (laboratorio) {
            var promesa = EliminarLaboratorio($scope.paciente.id_empresa, laboratorio)
            promesa.then(function (datos) {
                // $scope.cerrarIdModalDialogNuevoLaboratorio()
                $scope.ObtenerMedicoLaboratorios($scope.paciente)
                $scope.mostrarMensaje(datos.message)
            })
        }
        $scope.guardarNuevoLaboratorio = function (form) {
            if (form.$valid) {
                if ($scope.laboratorio.id) {
                    var promesa = ActualizarLaboratorio($scope.paciente.id_empresa, $scope.laboratorio)
                    promesa.then(function (datos) {
                        $scope.cerrarIdModalDialogNuevoLaboratorio()
                        $scope.ObtenerMedicoLaboratorios($scope.paciente)
                        $scope.mostrarMensaje(datos.message)
                    })
                } else {
                    var promesa = CrearLaboratorio($scope.paciente.id_empresa, $scope.laboratorio)
                    promesa.then(function (datos) {
                        $scope.cerrarIdModalDialogNuevoLaboratorio()
                        $scope.ObtenerMedicoLaboratorios($scope.paciente)
                        $scope.mostrarMensaje(datos.message)
                    })
                }
            }
        }

        $scope.ObtenerMedicoLaboratorios = function (paciente) {
            var promesa = ListaLaboratorios(paciente.id_empresa)
            promesa.then(function (datos) {
                $scope.listaLaboratorios = datos
            })
        }

        $scope.guardarNuevoLaboratorioExamen = function (form) {
            if (form.$valid) {
                if ($scope.examen.id) {
                    var promesa = ActualizarLaboratorioExamen($scope.laboratorio.id, $scope.examen)
                    promesa.then(function (datos) {
                        $scope.cerrarIdModalDialogLaboratorioExamenesNuevoResultado()
                        $scope.ObtenerMedicoLaboratorioExamenes($scope.laboratorio)
                        $scope.mostrarMensaje(datos.message)
                    })
                } else {
                    var promesa = CrearLaboratorioExamen($scope.laboratorio.id, $scope.examen)
                    promesa.then(function (datos) {
                        $scope.cerrarIdModalDialogLaboratorioExamenesNuevoResultado()
                        $scope.ObtenerMedicoLaboratorioExamenes($scope.laboratorio)
                        $scope.mostrarMensaje(datos.message)
                    })
                }
            }
        }

        $scope.EliminarNuevoLaboratorioExamen = function (examen) {
            var promesa = EliminarLaboratorioExamen($scope.laboratorio.id, examen)
            promesa.then(function (datos) {
                //$scope.cerrarIdModalDialogNuevoLaboratorio()
                $scope.ObtenerMedicoLaboratorioExamenes($scope.laboratorio)
                $scope.mostrarMensaje(datos.message)
            })
        }

        $scope.ObtenerMedicoLaboratorioExamenes = function (laboratorio) {
            promesa = ListaLaboratorioExamenes(laboratorio.id)
            promesa.then(function (datos) {
                $scope.listaLaboratorioExamenes = datos
            })
        }

        $scope.guardarLaboratorioExamenResultados = function (form, fecha) {
            if (form.$valid) {
                var fecha1 = new Date($scope.convertirFecha(fecha));
                var datos = { fecha: fecha1, examenes: $scope.listaLaboratorioExamenes }
                promesa = CrearLaboratorioExamenResultado($scope.laboratorio.id, $scope.paciente.id, datos)
                promesa.then(function (datos) {
                    $scope.cerrarIdModalDialogLaboratorioExamenes()
                    $scope.ObtenerMedicoLaboratorioExamenes($scope.laboratorio)
                    $scope.mostrarMensaje(datos.message)
                })
            }
        }

        $scope.ObtenerHistorialLaboratorioExamenes = function (filtro) {
            if (filtro.inicio != undefined) {
                if (filtro.inicio != 0 || filtro.inicio != "") {
                    $scope.filtro.inicio = (filtro.inicio instanceof Date) ? filtro.inicio : new Date($scope.convertirFecha(filtro.inicio));
                } else {
                    $scope.filtro.inicio = 0
                }
            } else {
                $scope.filtro.inicio = 0
            }
            if (filtro.fin != undefined) {
                if (filtro.fin != 0 || filtro.fin != "") {
                    $scope.filtro.fin = (filtro.fin instanceof Date) ? filtro.fin : new Date($scope.convertirFecha(filtro.fin));
                } else {
                    $scope.filtro.fin = 0
                }
            } else {
                $scope.filtro.fin = 0
            }
            promesa = LaboratorioExamenListaHistorial($scope.laboratorio.id, $scope.paciente.id, $scope.filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
                $scope.listaHistorialLaboratorioExamenes = datos
            })
        }

        $scope.ObtenerHistorialFichaMedica = function (filtro) {
            if (filtro.inicio != undefined) {
                if (filtro.inicio != 0 || filtro.inicio != "") {
                    $scope.filtro.inicio = (filtro.inicio instanceof Date) ? filtro.inicio : new Date($scope.convertirFecha(filtro.inicio));
                } else {
                    $scope.filtro.inicio = 0
                }
            } else {
                $scope.filtro.inicio = 0
            }
            if (filtro.fin != undefined) {
                if (filtro.fin != 0 || filtro.fin != "") {
                    $scope.filtro.fin = (filtro.fin instanceof Date) ? filtro.fin : new Date($scope.convertirFecha(filtro.fin));
                } else {
                    $scope.filtro.fin = 0
                }
            } else {
                $scope.filtro.fin = 0
            }
            if (filtro.tipo_control == undefined) { filtro.tipo_control = 0 }
            promesa = HistorialFichaMedicoPaciente($scope.paciente.id, filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
                $scope.listaHistorialfichaMEdica = datos
            })
        }
        $scope.eliminarDiagnostico = function (diagnostico) {
            var promesa = EliminarDiagnostico($scope.paciente.id_empresa, diagnostico)
            promesa.then(function (datos) {
                // $scope.cerrarIdModalDialogNuevoLaboratorio()
                $scope.ObtenerMedicoDiagnostico($scope.paciente)
                $scope.mostrarMensaje(datos.message)
            })
        }
        $scope.guardarNuevoDiagnostico = function (form) {
            if (form.$valid) {
                if ($scope.diagnostico.id) {
                    promesa = ActualizarDiagnostico($scope.paciente.id_empresa, $scope.diagnostico)
                    promesa.then(function (datos) {
                        $scope.cerrarDialogDiagnosticoNuevo()
                        $scope.ObtenerMedicoDiagnostico($scope.paciente)
                        $scope.mostrarMensaje(datos.message)
                    })
                } else {
                    promesa = CrearDiagnostico($scope.paciente.id_empresa, $scope.diagnostico)
                    promesa.then(function (datos) {
                        $scope.cerrarDialogDiagnosticoNuevo()
                        $scope.ObtenerMedicoDiagnostico($scope.paciente)
                        $scope.mostrarMensaje(datos.message)
                    })
                }

            }
        }

        $scope.ObtenerMedicoDiagnostico = function (paciente) {
            promesa = ListaDiagnosticos(paciente.id_empresa)
            promesa.then(function (datos) {
                $scope.listaDiagnosticos = datos
            })
        }

        $scope.guardarNuevoDiagnosticoExamen = function (form) {
            if (form.$valid) {
                if ($scope.examen.id) {
                    promesa = ActualizarDiagnosticoExamen($scope.diagnostico.id, $scope.examen)
                    promesa.then(function (datos) {
                        $scope.cerrarDialogNuevoExamenDiagnostico()
                        $scope.ObtenerMedicoDiagnosticoExamenes($scope.diagnostico)
                        $scope.mostrarMensaje(datos.message)
                    })
                } else {
                    promesa = CrearDiagnosticoExamen($scope.diagnostico.id, $scope.examen)
                    promesa.then(function (datos) {
                        $scope.cerrarDialogNuevoExamenDiagnostico()
                        $scope.ObtenerMedicoDiagnosticoExamenes($scope.diagnostico)
                        $scope.mostrarMensaje(datos.message)
                    })
                }

            }
        }
        $scope.eliminarNuevoDiagnosticoExamen = function (examen) {
            var promesa = EliminarDiagnosticoExamen($scope.diagnostico.id, examen)
            promesa.then(function (datos) {
                //$scope.cerrarIdModalDialogNuevoLaboratorio()
                $scope.ObtenerMedicoDiagnosticoExamenes($scope.diagnostico)
                $scope.mostrarMensaje(datos.message)
            })
        }

        $scope.ObtenerMedicoDiagnosticoExamenes = function (diagnostico) {
            promesa = ListaDiagnosticoExamenes(diagnostico.id)
            promesa.then(function (datos) {
                $scope.listaDiagnosticosExamenes = datos
            })
        }

        $scope.guardarDiagnosticoExamenResultados = function (form, fecha) {
            if (form.$valid) {
                var fecha1 = new Date($scope.convertirFecha(fecha));
                var datos = { fecha: fecha1, examenes: $scope.listaDiagnosticosExamenes }
                promesa = CrearDiagnosticoExamenResultado($scope.diagnostico.id, $scope.paciente.id, datos)
                promesa.then(function (datos) {
                    $scope.cerrarDialogExamenesDiagnostico()
                    $scope.ObtenerMedicoDiagnosticoExamenes($scope.diagnostico)
                    $scope.mostrarMensaje(datos.message)
                })
            }
        }

        $scope.ObtenerHistorialDiagnosticoExamenes = function (filtro) {
            if (filtro.inicio != undefined) {
                if (filtro.inicio != 0 || filtro.inicio != "") {
                    $scope.filtro.inicio = (filtro.inicio instanceof Date) ? filtro.inicio : new Date($scope.convertirFecha(filtro.inicio));
                } else {
                    $scope.filtro.inicio = 0
                }
            } else {
                $scope.filtro.inicio = 0
            }
            if (filtro.fin != undefined) {
                if (filtro.fin != 0 || filtro.fin != "") {
                    $scope.filtro.fin = (filtro.fin instanceof Date) ? filtro.fin : new Date($scope.convertirFecha(filtro.fin));
                } else {
                    $scope.filtro.fin = 0
                }
            } else {
                $scope.filtro.fin = 0
            }
            promesa = DiagnosticoExamenListaHistorial($scope.diagnostico.id, $scope.paciente.id, $scope.filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ($scope.filtro.inicio instanceof Date) ? $scope.filtro.inicio.getDate() + '/' + ($scope.filtro.inicio.getMonth() + 1) + '/' + $scope.filtro.inicio.getFullYear() : ""
                $scope.filtro.fin = ($scope.filtro.fin instanceof Date) ? $scope.filtro.fin.getDate() + '/' + ($scope.filtro.fin.getMonth() + 1) + '/' + $scope.filtro.fin.getFullYear() : ""
                $scope.listaHistorialDiagnosticoExamenes = datos
            })
        }

        $scope.fecha_excel_angular = function (fecha_desde_excel) {
            var fecha_minima_angular_indice_excel_1970 = 25569 - 1 //fecha minima angular. el -1 es para ajustar que el resultado que daba 1 anterior a la fecha real.
            var fecha_excel = new Date(1 / 1 / 1970)
            var diferencia_de_fecha = fecha_desde_excel - fecha_minima_angular_indice_excel_1970
            return fecha_excel.setTime(fecha_excel.getTime() + diferencia_de_fecha * 86400000)
        }

        $scope.subirExcelPacientes = function (event) {
            blockUI.start();
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var pacientes = [];
                    do {
                        var paciente = {};
                        paciente.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        paciente.apellido_paterno = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                        paciente.apellido_materno = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
                        paciente.nombres = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
                        paciente.ci = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
                        paciente.extension = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
                        paciente.grupo_sanguineo = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
                        paciente.fecha_nacimiento = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? $scope.fecha_excel_angular(worksheet['H' + row].v.toString()) : null;
                        paciente.genero = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? worksheet['I' + row].v.toString() : null;
                        paciente.telefono = worksheet['J' + row] != undefined && worksheet['J' + row] != "" ? worksheet['J' + row].v.toString() : null;
                        paciente.telefono2 = worksheet['K' + row] != undefined && worksheet['K' + row] != "" ? worksheet['K' + row].v.toString() : null;
                        paciente.telefono_movil = worksheet['L' + row] != undefined && worksheet['L' + row] != "" ? worksheet['L' + row].v.toString() : null;
                        paciente.estilo_de_vida = worksheet['M' + row] != undefined && worksheet['M' + row] != "" ? worksheet['M' + row].v.toString() : null;
                        paciente.cargo = worksheet['N' + row] != undefined && worksheet['N' + row] != "" ? worksheet['N' + row].v.toString() : null;
                        paciente.designacion_empresa = worksheet['O' + row] != undefined && worksheet['O' + row] != "" ? worksheet['O' + row].v.toString() : null;
                        paciente.telefono_empresa = worksheet['P' + row] != undefined && worksheet['P' + row] != "" ? worksheet['P' + row].v.toString() : null;
                        paciente.campamento = worksheet['Q' + row] != undefined && worksheet['Q' + row] != "" ? worksheet['Q' + row].v.toString() : null;
                        paciente.riesgos_procesos_trabajo = worksheet['R' + row] != undefined && worksheet['R' + row] != "" ? worksheet['R' + row].v.toString() : null;
                        paciente.ciudad_referencia = worksheet['S' + row] != undefined && worksheet['S' + row] != "" ? worksheet['S' + row].v.toString() : null;
                        paciente.zona_referencia = worksheet['T' + row] != undefined && worksheet['T' + row] != "" ? worksheet['T' + row].v.toString() : null;
                        paciente.calle_av_referencia = worksheet['U' + row] != undefined && worksheet['U' + row] != "" ? worksheet['U' + row].v.toString() : null;
                        paciente.nro_referencia = worksheet['V' + row] != undefined && worksheet['V' + row] != "" ? worksheet['V' + row].v.toString() : null;
                        paciente.telefonos_referencia = worksheet['W' + row] != undefined && worksheet['W' + row] != "" ? worksheet['W' + row].v.toString() : null;
                        paciente.celular_referencia = worksheet['X' + row] != undefined && worksheet['X' + row] != "" ? worksheet['X' + row].v.toString() : null;
                        paciente.nombre_referencia = worksheet['Y' + row] != undefined && worksheet['Y' + row] != "" ? worksheet['Y' + row].v.toString() : null;
                        paciente.imagen = "img/icon-user-default.png"
                        pacientes.push(paciente);
                        row++;
                        i++;
                        console.log
                    } while (worksheet['A' + row] != undefined);
                    $scope.guardarPacientes(pacientes);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.guardarPacientes = function (lstpacientes) {
            var pacientesEmpresa = new PacientesEmpresa({ pacientes: lstpacientes, id_empresa: $scope.usuario.id_empresa });
            pacientesEmpresa.$save(function (res) {
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            })
            blockUI.stop();
        }

        $scope.subirExcelFichasTecnicas = function (event) {
            blockUI.start();
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var fichasTecnicas = [];
                    do {
                        var fichaTecnica = {};
                        fichaTecnica.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        fichaTecnica.fecha = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? new Date($scope.convertirFecha(worksheet['G' + row].v.toString())) : null;
                        fichaTecnica.estilo_vida = worksheet['L' + row] != undefined && worksheet['L' + row] != "" ? worksheet['L' + row].v.toString() : null;
                        fichaTecnica.empresa = worksheet['M' + row] != undefined && worksheet['M' + row] != "" ? worksheet['M' + row].v.toString() : null;
                        fichaTecnica.telefono = worksheet['N' + row] != undefined && worksheet['N' + row] != "" ? worksheet['N' + row].v.toString() : null;
                        fichaTecnica.area_operacion = worksheet['O' + row] != undefined && worksheet['O' + row] != "" ? worksheet['O' + row].v.toString() : null;
                        fichaTecnica.actividad_laboral = worksheet['P' + row] != undefined && worksheet['P' + row] != "" ? worksheet['P' + row].v.toString() : null;
                        fichaTecnica.riesgo = worksheet['Q' + row] != undefined && worksheet['Q' + row] != "" ? worksheet['Q' + row].v.toString() : null;
                        fichaTecnica.ciudad_referencia = worksheet['R' + row] != undefined && worksheet['R' + row] != "" ? worksheet['R' + row].v.toString() : null;
                        fichaTecnica.zona_referencia = worksheet['S' + row] != undefined && worksheet['S' + row] != "" ? worksheet['S' + row].v.toString() : null;
                        fichaTecnica.calle_av_referencia = worksheet['T' + row] != undefined && worksheet['T' + row] != "" ? worksheet['T' + row].v.toString() : null;
                        fichaTecnica.numero_referencia = worksheet['U' + row] != undefined && worksheet['U' + row] != "" ? worksheet['U' + row].v.toString() : null;
                        fichaTecnica.telefono_referencia = worksheet['V' + row] != undefined && worksheet['V' + row] != "" ? worksheet['V' + row].v.toString() : null;
                        fichaTecnica.celular_referencia = worksheet['W' + row] != undefined && worksheet['W' + row] != "" ? worksheet['W' + row].v.toString() : null;
                        fichaTecnica.nombre_referencia = worksheet['X' + row] != undefined && worksheet['X' + row] != "" ? worksheet['X' + row].v.toString() : null;
                        fichaTecnica.tipo_control = worksheet['Y' + row] != undefined && worksheet['Y' + row] != "" ? worksheet['Y' + row].v.toString() : null;
                        fichaTecnica.grupo_sanguineo = worksheet['Z' + row] != undefined && worksheet['Z' + row] != "" ? worksheet['Z' + row].v.toString() : null;
                        fichaTecnica.alergia_humo_cigarrillo = worksheet['AA' + row] != undefined && worksheet['AA' + row] != "" ? (worksheet['AA' + row].v.toString() != 'NO') ? true : false : false;
                        fichaTecnica.alergia_quimico = worksheet['AB' + row] != undefined && worksheet['AB' + row] != "" ? (worksheet['AB' + row].v.toString() != 'NO') ? true : false : false;
                        fichaTecnica.alergia_medicamento = worksheet['AC' + row] != undefined && worksheet['AC' + row] != "" ? (worksheet['AC' + row].v.toString() != 'NO') ? true : false : false;
                        fichaTecnica.alergia_plantas = worksheet['AD' + row] != undefined && worksheet['AD' + row] != "" ? worksheet['AD' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.alergia_polvo = worksheet['AE' + row] != undefined && worksheet['AE' + row] != "" ? worksheet['AE' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.alergia_algun_material = worksheet['AF' + row] != undefined && worksheet['AF' + row] != "" ? worksheet['AF' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.alergia_alimentos = worksheet['AG' + row] != undefined && worksheet['AG' + row] != "" ? worksheet['AG' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.alergia_conservas = worksheet['AH' + row] != undefined && worksheet['AH' + row] != "" ? worksheet['AH' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.alergia_picadura = worksheet['AI' + row] != undefined && worksheet['AI' + row] != "" ? worksheet['AI' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.alergia_otros = worksheet['AJ' + row] != undefined && worksheet['AJ' + row] != "" ? worksheet['AJ' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.alergia_otros_comentario = worksheet['AL' + row] != undefined && worksheet['AL' + row] != "" ? worksheet['AL' + row].v.toString() : null;
                        fichaTecnica.enfermedad_hipertension = worksheet['AL' + row] != undefined && worksheet['AL' + row] != "" ? worksheet['AL' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_diabetes = worksheet['AM' + row] != undefined && worksheet['AM' + row] != "" ? worksheet['AM' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_epilepsia = worksheet['AN' + row] != undefined && worksheet['AN' + row] != "" ? worksheet['AN' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_asma = worksheet['AO' + row] != undefined && worksheet['AO' + row] != "" ? worksheet['AO' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_cardiologia = worksheet['AP' + row] != undefined && worksheet['AP' + row] != "" ? worksheet['AP' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_digestivas = worksheet['AQ' + row] != undefined && worksheet['AQ' + row] != "" ? worksheet['AQ' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_chagas = worksheet['AR' + row] != undefined && worksheet['AR' + row] != "" ? worksheet['AR' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_hepatitis = worksheet['AS' + row] != undefined && worksheet['AS' + row] != "" ? worksheet['AS' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_lumbalgia = worksheet['AT' + row] != undefined && worksheet['AT' + row] != "" ? worksheet['AT' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.enfermedad_otros = worksheet['AU' + row] != undefined && worksheet['AU' + row] != "" ? (worksheet['AU' + row].v.toString() != 'NO') ? true : false : false;
                        fichaTecnica.enfermedad_comentario = worksheet['AV' + row] != undefined && worksheet['AV' + row] != "" ? worksheet['AV' + row].v.toString() : null;
                        fichaTecnica.quirurgico_operado = worksheet['AW' + row] != undefined && worksheet['AW' + row] != "" ? worksheet['AW' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.quirurgico_comentario = worksheet['AX' + row] != undefined && worksheet['AX' + row] != "" ? worksheet['AX' + row].v.toString() : null;
                        fichaTecnica.es_donante = worksheet['AY' + row] != undefined && worksheet['AY' + row] != "" ? worksheet['AY' + row].v.toString() != 'NO' ? true : false : false;
                        fichaTecnica.fecha = new Date(fichaTecnica.fecha)
                        fichasTecnicas.push(fichaTecnica);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    $scope.guardarfichasTecnicas(fichasTecnicas);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.guardarfichasTecnicas = function (lstFichasTecnicas) {
            var fichasTecnicas = new FichasTecnicasPacientes({ fichas: lstFichasTecnicas, id_empresa: $scope.usuario.id_empresa });
            fichasTecnicas.$save(function (res) {
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            }, function (error) {
                $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                $scope.recargarItemsTabla();
            });
            blockUI.stop();
        }

        $scope.subirExcelSignosVitales = function (event) {
            blockUI.start();
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var signosVitales = [];
                    do {
                        var SV_Paciente = {};
                        SV_Paciente.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        SV_Paciente.fecha = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
                        SV_Paciente.presion = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? worksheet['H' + row].v.toString() : null;
                        SV_Paciente.pulso = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? worksheet['I' + row].v.toString() : null;
                        SV_Paciente.talla = worksheet['J' + row] != undefined && worksheet['J' + row] != "" ? Math.round(parseFloat(worksheet['J' + row].v.toString()), 4) : null;
                        SV_Paciente.peso = worksheet['K' + row] != undefined && worksheet['K' + row] != "" ? Math.round(parseFloat(worksheet['K' + row].v.toString()), 4) : null;
                        SV_Paciente.temperatura = worksheet['L' + row] != undefined && worksheet['L' + row] != "" ? Math.round(parseFloat(worksheet['L' + row].v.toString()), 3) : null;
                        SV_Paciente.frecuencia_respiratoria = worksheet['M' + row] != undefined && worksheet['M' + row] != "" ? worksheet['M' + row].v.toString() : null;
                        SV_Paciente.fecha = new Date(SV_Paciente.fecha)
                        signosVitales.push(SV_Paciente);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    $scope.guardarSignosVitales(signosVitales);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.guardarSignosVitales = function (signosVitales) {
            var signos = new SignosVitalesPacientes({ signosVitales: signosVitales, id_empresa: $scope.usuario.id_empresa });
            signos.$save(function (res) {
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            }, function (error) {
                $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                $scope.recargarItemsTabla();
            });
            blockUI.stop();
        }

        $scope.guardarPacientes = function (lstpacientes) {
            var pacientesEmpresa = new PacientesEmpresa({ pacientes: lstpacientes, id_empresa: $scope.usuario.id_empresa });
            pacientesEmpresa.$save(function (res) {
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            }, function (error) {
                $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                $scope.recargarItemsTabla();
            });
            blockUI.stop();
        }

        $scope.subirExcelSOAP = function (event) {
            blockUI.start();
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var SOAPLista = [];
                    do {
                        var soap = {};
                        soap.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        soap.fecha = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
                        soap.subjetivo = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
                        soap.objetivo = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? worksheet['H' + row].v.toString() : null;
                        soap.analitico = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? worksheet['I' + row].v.toString() : null;
                        soap.plan = worksheet['J' + row] != undefined && worksheet['J' + row] != "" ? worksheet['J' + row].v.toString() : null;
                        soap.evolucion = worksheet['K' + row] != undefined && worksheet['K' + row] != "" ? worksheet['K' + row].v.toString() : null;
                        soap.fecha = new Date(soap.fecha)
                        SOAPLista.push(soap);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    $scope.guardarSOAPLista(SOAPLista);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.guardarSOAPLista = function (SOAPLista) {
            var soap = new SOAPlistaPacientes({ SOAPLista: SOAPLista, id_empresa: $scope.usuario.id_empresa });
            soap.$save(function (res) {
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            }, function (error) {
                $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                $scope.recargarItemsTabla();
            });
            blockUI.stop();
        }

        $scope.subirExcelVacunasPacientes = function (event) {
            blockUI.start();
            var files = event.target.files;
            var i, f;
            var pacientes = []
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var row = 2, i = 0;
                    var worksheet = workbook.Sheets[first_sheet_name];
                    var paciente = [];
                    do {
                        var vacuna = {};
                        vacuna.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                        vacuna.nombre_vacuna = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
                        vacuna.dosis = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
                        vacuna.fecha = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? $scope.fecha_excel_angular(worksheet['H' + row].v.toString()) : null;
                        vacuna.Estado = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? worksheet['I' + row].v.toString() : null;
                        paciente.push(vacuna);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    $scope.guardarAplicacionVacunas(paciente);
                };
                reader.readAsBinaryString(f);
            }
        }

        $scope.guardarAplicacionVacunas = function (paciente) {
            var AplicacionVacunas = new aplicacionVacunasPacientes({ pacientes: paciente, id_empresa: $scope.usuario.id_empresa });
            AplicacionVacunas.$save(function (res) {
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            }, function (error) {
                $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                $scope.recargarItemsTabla();
            });
            blockUI.stop();
        }

        $scope.inicio();
    });