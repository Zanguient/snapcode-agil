angular.module('agil.controladores')
    .controller('ControladorPacientes', function ($scope, blockUI, $localStorage, $window, $location, $templateCache, $route, Usuario, Paginator, DatosPacientes, Paciente, $filter, PacientesPaginador, ListaDatosPrerequisito,
        CrearPrerequisito, Prerequisito, DatosPrerequisitoPaciente, ListaDatosGenero, Vacunas, ltsVacunas, PacienteVacuna, VacunasPaciente, asignacionPacienteVacuna, aplicacionPacienteVacuna, VacunasPacientedosis, CrearMedicoPacienteConsulta,
        ListaConsultasMedicoPaciente, CrearMedicoPacienteFicha, BuscarFichaPaciente, ListaDatosTiposControl, ActualizarPatologiaPaciente, ListaPrerequisitosEmpresa, ListaPrerequisitosPaciente, ActualizarPrerequisito, CrearLaboratorio, ListaLaboratorios,
        CrearLaboratorioExamen, ListaLaboratorioExamenes, CrearLaboratorioExamenResultado, LaboratorioExamenListaHistorial, CrearDiagnostico, ListaDiagnosticos, CrearDiagnosticoExamen, ListaDiagnosticoExamenes, DiagnosticoExamenListaHistorial, CrearDiagnosticoExamenResultado,
        PacientesEmpresa, ListaVacunasEmpresa, FichasTecnicasPacientes, SignosVitalesPacientes, SOAPlistaPacientes, aplicacionVacunasPacientes, obtenerPaciente, Comentario, FieldViewer, PacienteActivo) {

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
        $scope.IdModalDialogDiagnosticoExamenHistoricoResultado = 'dialog-historico-resultado-diag'
        $scope.usuario = JSON.parse($localStorage.usuario);
        // $scope.abrirDialogVacunaEditar = dialog-grafico dialog-nuevo-resultado

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
                $scope.idModalHistorialConsulta, $scope.idModalWizardPacienteVista, $scope.idModalContenedorPacienteVista, $scope.idModalEliminarPaciente, $scope.IdModalDialogNuevoLaboratorio, $scope.IdModalDialogDiagnosticoExamenHistoricoResultado);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            // aplicarDatePickers();
            $scope.obtenerColumnasAplicacion();
        });

        $scope.$on('$routeChangeStart', function (next, current) {
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
            $scope.eliminarPopup($scope.idModalEliminarPaciente);
            $scope.eliminarPopup($scope.IdModalDialogDiagnosticoExamenHistoricoResultado)
        });

        $scope.inicio = function () {
            blockUI.start();
            $scope.paciente = { vacunas: [] };
            $scope.vacunas = []
            $scope.vacuna = { vacunaDosis: [] }
            // $scope.vacuna.vacunaDosis = []
            $scope.vacunaDosis = []
            $scope.requisitos = { preRequisitos: [] }
            $scope.ficha = {}
            $scope.dosis = { tiempo: 0, numero: 0 }
            $scope.paginator = { pages: [] }
            $scope.obtenerPrerequisito();
            $scope.obtenerGenero();
            $scope.obtenerTipoControl()
            $scope.examen = {};
            $scope.obtenerPacientes();
            $scope.obtenerVacunas();
            $scope.aplicandoVacuna = false
            var fechaAplicacionVacuna = new Date()
            $scope.filtro.fechaAplicacionVacuna_texto = fechaAplicacionVacuna.getDate() + "/" + (fechaAplicacionVacuna.getMonth() + 1) + "/" + fechaAplicacionVacuna.getFullYear()
            $scope.habilitarBotonAgregarDosisVacuna = false
            blockUI.stop();
            // $scope.textoAfecha
            // $scope.retrasada = false
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
            // $scope.fechaAplicacionVacuna = new Date(convertirFecha(fecha))
        }

        $scope.obtenerVacunasPaciente = function (paciente) {
            // var promesa = VacunasPaciente($scope.paciente)
            // promesa.then(function (ltsVacunasPaciente) {
            //     $scope.paciente.vacunas = ltsVacunasPaciente
            // })
        }

        $scope.checkAgregar = function (dosis) {
            if (dosis.numero > 0 && dosis.tiempo > 0) {
                $scope.habilitarBotonAgregarDosisVacuna = true
            } else {
                $scope.habilitarBotonAgregarDosisVacuna = false
            }
        }
        $scope.agregarDosisVacuna = function (dosis) {
            blockUI.start();
            //console.log(dosis)
            if (dosis.numero > 0 && dosis.tiempo > 0) {
                if (dosis.id) {
                    //console.log('editando dosis')
                    //console.log(dosis)
                    indx = $scope.vacunaDosis.indexOf(dosis)
                    $scope.vacunaDosis[indx] = dosis
                    //console.log($scope.vacunaDosis[indx])
                } else {
                    //console.log('creando dosis')
                    if (dosis.es_dosis) {
                        //console.log(dosis)
                        try {
                            $scope.vacunaDosis.push(dosis)
                        } catch (error) {
                            indx = $scope.vacunaDosis.indexOf(dosis)
                            $scope.vacunaDosis[indx] = dosis
                        }

                    } else {
                        dosis.es_dosis = false
                        try {
                            $scope.vacunaDosis.push(dosis)
                        } catch (error) {
                            indx = $scope.vacunaDosis.indexOf(dosis)
                            $scope.vacunaDosis[indx] = dosis
                        }
                    }
                }
            }
            $scope.dosis = {}
            $scope.habilitarBotonAgregarDosisVacuna = false
            blockUI.stop();
        }

        $scope.eliminarDosis = function (dosis) {
            if(dosis.id === undefined){
                $scope.vacunaDosis.splice($scope.vacunaDosis.indexOf(dosis), 1);
            }else{
                var indx = $scope.vacunaDosis.indexOf(dosis)
            $scope.vacunaDosis[indx].eliminado = true
            
                $scope.vacunaDosis[indx].eliminar = true
            }
            
        }

        $scope.editarLaDosis = function (dosis) {
            //console.log(dosis)
            $scope.dosis = dosis
            // $scope.dosis.tiempo = dosis.tiempo
            // $scope.dosis.numero = dosis.numero
            //console.log($scope.dosis)
        }

        $scope.asignarVacunas = function () {
            blockUI.start();
            //console.log('asignanado Vacunas')
            $scope.vacunas.forEach(function (vacuna) {
                vacuna.asignada = (vacuna.asignada === null || vacuna.asignada === undefined) ? false : vacuna.asignada
                //console.log(vacuna)
                var vacunaAlreadyAsigned = false
                var vacunaPorAsignar = {}
                $scope.paciente.vacunas.forEach(function (vacine) {
                    if (vacine.id_vacuna == vacuna.id) {
                        //console.log('ya asignada')
                        vacunaAlreadyAsigned = true
                        vacunaPorAsignar = vacine
                        // break;
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
                        if (vacuna.vacunaDosis.length > 1){
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
            $scope.cerrarPopUpVacunasConfig()
            blockUI.stop();
        }

        $scope.obtenerVacunas = function () {
            var promesa = ltsVacunas()
            promesa.then(function (vacunas) {
                // //console.log(vacunas)
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
            $scope.vacuna = vacuna
            if($scope.vacuna.pacienteVacunaDosis[0] == undefined){
                return
            }
            if ($scope.vacuna.alreadyProyected == null || $scope.vacuna.alreadyProyected == undefined) {
                var inicial = ($scope.vacuna.pacienteVacunaDosis[0] == undefined)? new Date : new Date($scope.vacuna.pacienteVacunaDosis[0].fecha_aplicacion)
                var num = 1
                var orderer = []
                $scope.vacunasProyectadas = []
                while (num <= $scope.vacuna.pacienteVacuna.vacunaDosis.length) {
                    $scope.vacuna.pacienteVacuna.vacunaDosis.forEach(function (dosis) {
                        if (parseInt(dosis.numero) == num) {
                            orderer.push(dosis)
                            num = num + 1
                        }
                    }, this);
                }
                $scope.vacuna.pacienteVacuna.vacunaDosis = orderer
                $scope.vacuna.pacienteVacunaDosis.sort(function (a, b) {
                    if (a.id < b.id) {
                        return -1
                    } else {
                        return 1
                    }

                })
                var lstDosisFechas = []
                console.log(inicial)
                console.log('inicial')
                $scope.vacuna.pacienteVacuna.vacunaDosis.forEach(function (dosis, index) {
                    inicial = new Date($scope.vacuna.pacienteVacunaDosis[0].fecha_aplicacion)
                    // if(use_createdAt){
                    //     inicial = new Date(asignacion_inicial)
                    // }else{
                    //     inicial = new Date(aplicacion_inicial)
                    // }
                    console.log('Pronostico de fecha de aplicacion de vacuna')
                    console.log(inicial)
                    if (index < 1) {
                        var aplicacionEstimada = inicial.setTime(inicial.getTime() + 0 * 86400000)
                        lstDosisFechas.push(aplicacionEstimada)
                    } else {
                        var aplicacionEstimada = new Date(inicial)
                        if (dosis.es_dosis) {
                            aplicacionEstimada = inicial.setTime(inicial.getTime() + dosis.tiempo * 86400000)
                            lstDosisFechas.push(aplicacionEstimada)
                        } else {
                            aplicacionEstimada = inicial.setTime(inicial.getTime() + (dosis.tiempo * 30) * 86400000)
                            lstDosisFechas.push(aplicacionEstimada)
                        }
                        console.log(dosis)
                    }
                }, this);
                console.log(lstDosisFechas)
                var fechaIndx = 0

                $scope.vacuna.pacienteVacunaDosis.forEach(function (dosisPaciente) {
                    var fechaAplicacion = new Date(dosisPaciente.fecha_aplicacion)
                    var fechaEstimado = new Date(lstDosisFechas[fechaIndx])
                    fechaIndx = fechaIndx + 1
                    dosisPaciente.fechaCorta = fechaAplicacion.getDate() + "/" + (fechaAplicacion.getMonth() + 1) + "/" + fechaAplicacion.getFullYear()
                    if (fechaAplicacion > fechaEstimado) {
                        dosisPaciente.retrasada = true
                    } else {
                        dosisPaciente.retrasada = false
                    }
                }, this);

                while ($scope.vacuna.pacienteVacunaDosis.length < lstDosisFechas.length) {
                    if ($scope.vacuna.pacienteVacunaDosis.length < lstDosisFechas.length) {
                        var proyectada = { id_paciente_vacuna: $scope.vacuna.id_paciente, fecha_aplicacion: "2017-04-15T04:00:00.000Z", eliminado: false }
                        proyectada.fecha_aplicacion = new Date(lstDosisFechas[fechaIndx])
                        proyectada.proyectada = true
                        proyectada.fechaCorta = proyectada.fecha_aplicacion.getDate() + "/" + (proyectada.fecha_aplicacion.getMonth() + 1) + "/" + proyectada.fecha_aplicacion.getFullYear()
                        $scope.vacuna.pacienteVacunaDosis.push(proyectada)
                        fechaIndx = fechaIndx + 1
                    }
                }
                $scope.vacuna.alreadyProyected = true
                console.log($scope.vacuna.pacienteVacunaDosis)
            }else{
                console.log('proyected')
            }
        }

        $scope.editarVacuna = function (valid, vacuna) {
            blockUI.start();
            $scope.vacuna = vacuna
            $scope.vacuna.vacunaDosis = $scope.vacunaDosis
            //console.log('valido')
            if (!vacuna.id) {
                //console.log('creando nueva')
                vacuna.$save(function (res) {
                    $scope.mostrarMensaje(res.mensaje);
                }, function (error) {
                    $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                })
            } else {
                //console.log('editando vacuna')
                Vacunas.update({ id: vacuna.id }, vacuna, function (res) {
                    $scope.mostrarMensaje(res.mensaje);
                }, function (error) {
                    $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                })
            }
            $scope.vacunaDosis = []
            blockUI.stop();
            $scope.cerrarPopUpVacunaNueva()
        }

        $scope.obtenerPrerequisito = function () {
            blockUI.start();
            var promesa = ListaDatosPrerequisito();
            promesa.then(function (entidad) {
                $scope.prerequisitos = entidad;
                blockUI.stop();
            });
        }

        $scope.obtenerGenero = function () {
            blockUI.start();
            $scope.generos = []
            var promesa = ListaDatosGenero();
            promesa.then(function (entidad) {
                entidad.forEach(function (genero) {
                    $scope.generos.push(genero)
                    console.log(genero)
                }, this);
                console.log($scope.generos)
                // $scope.generos = entidad.generos;
                blockUI.stop();
            });
        }

        $scope.updateFiltro = function (filtro) {
            $scope.filtro = filtro
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
                $scope.pacientes.forEach(function(pac, index, array) {
                    pac.activo = (pac.activo == 0) ? false : true
                });
                //console.log($scope.pacientes);
                blockUI.stop();
                console.log($scope.pacientes)
            });
        }

        // $scope.establecerFechas = function (fecha, hora) {
        //     $scope.consulta.fecha = new Date(convertirFecha(fecha))
        //     $scope.consulta.fecha = new Date(convertirFecha(fecha))
        // }
        $scope.guardarFichaTecnica = function (valido, ficha) {
            if (valido) {
                var button = $('#siguiente-f').text().trim();
                if (button != "Siguiente") {
                    ficha.fecha_elaboracion = new Date($scope.convertirFecha(ficha.fecha_elaboracion));
                    promesa = CrearMedicoPacienteFicha(ficha);
                    promesa.then(function (dato) {
                        $scope.cerrarPopUpIdModalFichaTecnica()
                        $scope.recargarItemsTabla()
                        $scope.mostrarMensaje(dato.message)
                    })
                }
            }
        }

        $scope.aplicarVacuna = function (vacuna) {
            var laVacuna = null
            var indx = $scope.paciente.vacunas.indexOf(vacuna)
            var inicial =($scope.paciente.vacunas[indx].pacienteVacunaDosis[0] == undefined)? new Date() : new Date($scope.paciente.vacunas[indx].pacienteVacunaDosis[0].fecha_aplicacion)
            var vaccas = []
            $scope.paciente.vacunas[indx].pacienteVacunaDosis.forEach(function (aplicacionVacuna, index, array) {
                
            vaccas.push(new Date(aplicacionVacuna.fecha_aplicacion))
                
            });
            var minDate=new Date(Math.min.apply(null,vaccas));
            console.log(inicial)
            console.log(minDate)
            $scope.vacunas.forEach(function (vacunaT,index,array) {
                if(vacunaT.nombre == vacuna.pacienteVacuna.nombre){
                    laVacuna = vacunaT
                }
            });
            console.log($scope.vacunas)
            console.log(vacuna)
            console.log(laVacuna)
            // var vacineIndx = $scope.vacunas.indexOf(vacuna)
            // var dosisIndx = $scope.paciente.vacunas[indx].pacienteVacunaDosis.length -1
            // var dosis = $scope.vacunas[vacineIndx].vacunaDosis[dosisIndx]
            // console.log(dosis)
            $scope.paciente.vacunas[indx].fecha_ultima_aplicacion = new Date(convertirFecha(vacuna.fechaAplicacionVacuna_texto))
            var dosisIndx = (vacuna.pacienteVacunaDosis.length > 0 && vacuna.pacienteVacunaDosis.length <= laVacuna.vacunaDosis.length-1) ? vacuna.pacienteVacunaDosis.length : laVacuna.vacunaDosis.length-1
            $scope.paciente.vacunas[indx].fecha_siguiente_aplicacion =  new Date(minDate.setTime(inicial.getTime() + laVacuna.vacunaDosis[dosisIndx].tiempo * 86400000))
            $scope.paciente.vacunas[indx].fecha_siguiente_aplicacion_texto = $scope.fechaATexto($scope.paciente.vacunas[indx].fecha_siguiente_aplicacion)
            var showdate = new Date($scope.paciente.vacunas[indx].fecha_siguiente_aplicacion)
            console.log('siguiente aplicacion')
            console.log($scope.paciente.vacunas[indx].fecha_siguiente_aplicacion)     
            aplicacionPacienteVacuna.update({ id: $scope.paciente.vacunas[indx].id }, $scope.paciente.vacunas[indx], function (res) {
                var promesa = VacunasPaciente($scope.paciente)
                promesa.then(function (ltsVacunasPaciente) {
                    $scope.paciente.vacunas = ltsVacunasPaciente
                })
                $scope.mostrarMensaje('vacuna aplicada');
            }, function (error) {
                $scope.mostrarMensaje('Se produjo un error');
            });
            // var fechaAplicacionVacuna = new Date()
            // $scope.filtro.fechaAplicacionVacuna_texto = fechaAplicacionVacuna.getDate() + "/" + (fechaAplicacionVacuna.getMonth() + 1) + "/" + fechaAplicacionVacuna.getFullYear()
        }

        $scope.button_clicked = false;
        $scope.disableImput = function (vacuna) {
            aplicarDatePickers();
            var conteoDosis = 0
            //console.log(vacuna)
            vacuna.pacienteVacunaDosis.forEach(function (dosisAplicada) {
                if (!dosisAplicada.proyectada) {
                    conteoDosis += 1
                }
            }, this);
            if (vacuna.button_clicked) {
                // $scope.aplicarVacuna(vacuna)
                if (conteoDosis < vacuna.pacienteVacuna.vacunaDosis.length){
                    $scope.aplicarVacuna(vacuna)
                }else {
                    $scope.mostrarMensaje('No se puede aplicar la vacuna, excede la cantidad de dosis')
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

        $scope.fechasLabel = ["3/1/2010", "5/1/2010", "7/1/2010", "9/1/2010", "11/1/2010", "13/1/2010", "15/1/2010", "17/1/2010", "19/1/2010", "20/1/2010"]

        $scope.selection = [];
        $scope.chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: "GRAFICA - SIGNOS VITALES",
                fontSize: 30,

            },
            legend: {
                horizontalAlign: "right", // left, center ,right 
                verticalAlign: "center",  // top, center, bottom
                fontSize: 20,
            },
            animationEnabled: true,
            exportEnabled: true,

            width: 1000,

            axisX: {
                gridColor: "Silver",
                tickColor: "silver",
                valueFormatString: "DD/MMM/YY",
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


        $scope.abrirIdModalDialogLaboratorioExamenesNuevoResultado = function () {
            $scope.examen = {}
            $scope.abrirPopup($scope.IdModalDialogLaboratorioExamenesNuevoResultado);
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
        $scope.abrirIdModalDialogNuevoLaboratorio = function () {
            $scope.laboratorio = {}
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
            promesa = BuscarFichaPaciente(paciente.id)
            promesa.then(function (datos) {

                if (datos.ficha) {
                    $scope.ficha = datos.ficha
                    var fechaActual = new Date();
                    var fechaNacimiento = new Date($scope.ficha.paciente.persona.fecha_nacimiento)
                    //console.log("fechas:" + fechaActual + "/" + fechaNacimiento)
                    var fecha = new Date(datos.ficha.fecha)
                    $scope.ficha.fecha_elaboracion = (fecha.getMonth() + 1) + "/" + fecha.getDate() + "/" + fecha.getFullYear()
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365);
                    $scope.ficha.edad
                } else {

                    $scope.ficha = { paciente: datos.paciente, pacienteReferencia: {} }
                    var fechaActual = new Date();
                    var fechaNacimiento = new Date($scope.ficha.paciente.persona.fecha_nacimiento)
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365)
                    //console.log($scope.ficha.edad)
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
        /*     $scope.abrirIdModalDialogConsulta = function (paciente) {
    
                $scope.abrirPopup($scope.idModalDialogVacunas);
            } */

        $scope.diferenciaEntreDiasEnDias = function (a, b) {
            var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
        }

        $scope.obtenerDatosPrerequisito = function (paciente, filtro) {
            blockUI.start();
            if (filtro.inicio != 0 && filtro.inicio != "") {
                filtro.inicio = new Date($scope.convertirFecha(filtro.inicio));
                filtro.fin = new Date($scope.convertirFecha(filtro.fin));
            } else {
                filtro.inicio = 0
                filtro.fin = 0
            }

            var promesa = ListaPrerequisitosPaciente(paciente.id, filtro);
            promesa.then(function (preRequisitos) {
                $scope.datoprerequisitos = preRequisitos;
                //console.log($scope.datoprerequisitos);
                blockUI.stop();
                $scope.filtro = { inicio: "", fin: "" }
            });
            console.log($scope.datoprerequisitos)
        }

        $scope.abrirIdModalDialogPreRequisitos = function (paciente) {
            var filtro = { inicio: 0, fin: 0 }
            $scope.obtenerDatosPrerequisito(paciente, filtro);
            $scope.paciente = paciente;
            $scope.abrirPopup($scope.IdModalDialogPreRequisitos);
        }
        $scope.abrirDialogHistorico = function (vacuna) {
            $scope.abrirPopup($scope.idModalDialogHistorico);
        }
        $scope.abrirDialogVacunaEditar = function (vacuna) {
            $scope.vacuna = vacuna
            $scope.vacunaDosis = vacuna.vacunaDosis
            //console.log(vacuna)
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
            promesa = ListaConsultasMedicoPaciente($scope.paciente.id, filtro)
            promesa.then(function (dato) {
                for (var i = 0; i < dato.consultas.length; i++) {
                    var consulta = dato.consultas[i];
                    var fecha = new Date(consulta.fecha)
                    var str = consulta.presion
                    var res = str.split("/");
                    var fechaTabla = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
                    $scope.fechasLabel.push(fechaTabla)
                    var datoPrecion = { x: new Date(fecha.getFullYear(), (fecha.getMonth() + 1), fecha.getDate()), y: parseInt(res[0]) };
                    var datoPulso = { x: new Date(fecha.getFullYear(), (fecha.getMonth() + 1), fecha.getDate()), y: parseInt(consulta.pulso) };
                    var datoTalla = { x: new Date(fecha.getFullYear(), (fecha.getMonth() + 1), fecha.getDate()), y: parseInt(consulta.talla) };
                    var datoPeso = { x: new Date(fecha.getFullYear(), (fecha.getMonth() + 1), fecha.getDate()), y: parseInt(consulta.peso) };
                    var datoTemperatura = { x: new Date(fecha.getFullYear(), (fecha.getMonth() + 1), fecha.getDate()), y: parseInt(consulta.temperatura) };
                    var datoFrecuenciaC = { x: new Date(fecha.getFullYear(), (fecha.getMonth() + 1), fecha.getDate()), y: parseInt(consulta.frecuencia_cardiaca) };
                    var datoFrecuenciaR = { x: new Date(fecha.getFullYear(), (fecha.getMonth() + 1), fecha.getDate()), y: parseInt(consulta.frecuencia_respiratoria) };
                    var datoIndiceMasaCorporal = { x: new Date(fecha.getFullYear(), (fecha.getMonth() + 1), fecha.getDate()), y: parseInt(consulta.indice_masa_corporal) };
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
            //console.log($scope.DatosSV)
            /*  paciente.consultas.forEach(function(consulta) {
                 var fecha = new Date(consulta.fecha)
                 var dato = { x: new Date(fecha.getFullYear(), (fecha.getMonth()+1), fecha.getDate()), y: 0 }
                  $scope.DatosSV[0].dataPoints.push()
             }, this); */

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
            $scope.abrirPopup($scope.idModalDialogVacunaEdicion);
        }
        $scope.abrirDialogVacunasConfig = function () {
            // $scope.obtenerVacunas()

            $scope.verificarAsignacionVacunas()
            $scope.abrirPopup($scope.idModalDialogVacunasConfig);
        }
        $scope.abrirDialogVacunas = function (paciente) {

            // setTimeout(function name(params) {
            //     //console.log('aplicacndo scripts pacientes')
            //     aplicarDatePickers();

            // }, 2000)
            $scope.paciente = paciente
            $scope.paciente.vacunas = []
            var vacunas_paciente = VacunasPaciente($scope.paciente)
            vacunas_paciente.then(function (datosVacunas) {
                //console.log(datosVacunas)
                $scope.paciente.vacunas = datosVacunas
                $scope.paciente.vacunas.forEach(function (vacuna) {
                    var fecha = new Date(vacuna.fecha_siguiente_aplicacion)
                    vacuna.fecha_siguiente_aplicacion = (fecha.getMonth() + 1) + "/" + fecha.getDate() + "/" + fecha.getFullYear()
                    vacuna.button_clicked = false
                }, this);
            })
            $scope.limpiarAsignacionVacunas()
            $scope.verificarAsignacionVacunas()

            $scope.abrirPopup($scope.idModalDialogVacunas);
        }
        $scope.abrirDialogEntregaPreRequisito = function () {
            $scope.abrirPopup($scope.IdEntregaPrerequisito);
        }
        $scope.cerrarPopUpEntregaPreRequisito = function () {
            $scope.cerrarPopup($scope.IdEntregaPrerequisito);
        }

        $scope.abrirDialogPacienteNuevo = function () {
            // var usuario = JSON.parse($localStorage.usuario);
            $scope.paciente = new Paciente({ persona: { imagen: "img/icon-user-default.png" }, id_empresa: $scope.usuario.id_empresa });

            $scope.abrirPopup($scope.idModalDialogPacienteNuevo);
        }
        $scope.cerrarPopupPacienteNuevo = function () {
            $scope.cerrarPopup($scope.idModalDialogPacienteNuevo);
        }
        $scope.abrirDialogPrerequisitoNuevo = function () {
            $scope.NuevoP = new Prerequisito({ puede_modificar_rrhh: false });
            /* var usuario=JSON.parse($localStorage.usuario);
            $scope.paciente=new Paciente({id_empresa:usuario.id_empresa});
            //console.log('sdsdsdsdsdsdsdsdsd',$scope.idModalDialogPrerequisitoNuevo); */
            $scope.abrirPopup($scope.idModalDialogPrerequisitoNuevo);
        }
        $scope.cerrarPopupPrerequisitoNuevo = function () {
            $scope.cerrarPopup($scope.idModalDialogPrerequisitoNuevo);
        }
        $scope.abrirDialogHistoricoPreRequisito = function () {
            $scope.abrirPopup($scope.idModalHistorialPrerequisito);
        }
        $scope.cerrarDialogHistoricoPreRequisito = function () {
            $scope.cerrarPopup($scope.idModalHistorialPrerequisito);
        }

        $scope.actualizarPrerequisito = function (prerequisito) {
            var promesa = ActualizarPrerequisito(prerequisito)
            promesa.then(function (dato) {
                if (prerequisito instanceof Array) {
                    $scope.cerrarPopUpPreRequisitos()
                }
                $scope.mostrarMensaje(dato.message)
            })
        }
        $scope.saveFormPrerequisito = function (nuevoPrerequisito) {
            blockUI.start();

            nuevoPrerequisito.fecha_inicio = new Date($scope.convertirFecha(nuevoPrerequisito.fecha_inicio));
            nuevoPrerequisito.fecha_vencimiento = new Date($scope.convertirFecha(nuevoPrerequisito.fechav));

            nuevoPrerequisito.$save({ id_paciente: $scope.paciente.id }, function (prerequisito) {
                blockUI.stop();
                var filtro = { inicio: 0, fin: 0 }
                prerequisito = new Prerequisito({});
                $scope.obtenerDatosPrerequisito($scope.paciente, filtro);
                $scope.cerrarPopupPrerequisitoNuevo();
                $scope.mostrarMensaje('Guardado Exitosamente!');

            }, function (error) {
                blockUI.stop();
                var filtro = { inicio: 0, fin: 0 }
                $scope.obtenerDatosPrerequisito($scope.paciente, filtro);
                $scope.cerrarPopupPrerequisitoNuevo();
                $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
            });
        }

        /* $scope.buscarPrerequisito=function(idPrerequisito){
            var nombre_corto=idPrerequisito.split('-')[1];
            var promesa=Clases(nombre_corto+"M");
            promesa.then(function(entidades){
                $scope.municipios=entidades;
            });
        } */
        $scope.finVerPaciente = function () {
            var button = $('#siguiente-v').text().trim()
            if (button != "Siguiente") {
                $scope.cerrarPopPupVista()
            }

        }
        $scope.sinFuncionalidad = function () {
            $scope.mostrarMensaje('Sin funcionalidad')
        }
        $scope.abrirDialogEditarPreRequisito = function () {
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
                console.log(paciente.imagen)
                $scope.paciente.fecha_nacimiento_texto = $scope.fechaATexto($scope.paciente.persona.fecha_nacimiento)
                $scope.paciente.persona.imagen = (paciente.persona.imagen== null) ? "img/icon-user-default.png": paciente.persona.imagen
                console.log($scope.paciente.fecha_nacimiento_texto)
            })
            console.log($scope.paciente)
            $scope.abrirPopup($scope.idModalDialogPacienteNuevo);
        }

        $scope.mostrarConfirmacionEliminacion = function (paciente) {
            paciente.persona = (paciente.persona == undefined) ? {imagen: (paciente.imagen == null)? "img/icon-user-default.png" : paciente.imagen }: paciente.persona.imagen
            paciente.eliminar = true
            $scope.paciente = paciente
            $scope.abrirPopup($scope.idModalEliminarPaciente);
        }

        $scope.cerrarConfirmacionEliminacion = function () {
            $scope.cerrarPopup($scope.idModalEliminarPaciente);
        };

        $scope.eliminarPaciente = function (paciente) {
            blockUI.start();
            paciente.eliminado = true;

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
        //guardar consultas paciente
        $scope.guardarConsulta = function (form, consulta) {
            var button = $('#siguiente-c').text().trim();
            if (button != "Siguiente") {
                if (form.$valid) {
                    consulta.presion = consulta.presionAlta + "/" + consulta.presionBaja
                    tiempoActual = new Date();
                    consulta.fecha = new Date($scope.convertirFecha(consulta.fecha))
                    consulta.fecha.setHours(tiempoActual.getHours());
                    consulta.fecha.setMinutes(tiempoActual.getMinutes());
                    promesa = CrearMedicoPacienteConsulta(consulta)
                    promesa.then(function (params) {
                        $scope.cerrarPopUpConsulta()
                        $scope.recargarItemsTabla()
                        $scope.mostrarMensaje(params.message)


                    })
                }
            }
        }
        //funcion lista de consultas
        $scope.listarConsultasPaciente = function (filtro) {
            if (filtro.inicio != 0 && filtro.inicio != "") {
                filtro.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtro.fin = new Date($scope.convertirFecha(filtro.fin))
            } else {
                filtro.inicio = 0
                filtro.fin = 0
            }
            promesa = ListaConsultasMedicoPaciente($scope.paciente.id, filtro)
            promesa.then(function (dato) {
                $scope.listaConsultas = dato.consultas
                $scope.filtro.inicio = "";
                $scope.filtro.fin = "";
            })
        }
        $scope.changeActivo=function(paciente) {
            PacienteActivo.update({ id_paciente: paciente.id }, paciente, function (res) {
                $scope.mostrarMensaje(res.mensaje)
            });
        }
        $scope.saveForm = function (paciente) {
            $scope.paciente = paciente;
            console.log($scope.paciente.persona.fecha_nacimiento)
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
                        $scope.mostrarMensaje('Guardado Exitosamente!');
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

        // $scope.comentario = "comentar";
        $scope.saveComment = function (paciente) {
            //console.log(paciente)
            Comentario.update({ id_paciente: paciente.id }, paciente, function (res) {
                $scope.mostrarMensaje('Comentario actualizado Exitosamente!');
            }, function (error) {
                $scope.mostrarMensaje('Hubo un problema al guardar su comentario.');
            });
            blockUI.stop();
            $scope.cerrarDialogDialogComentario();
        }

        $scope.abrirDialogHistorialVacuna = function (vacuna) {
            // $scope.paciente = paciente
            var indx = $scope.paciente.vacunas.indexOf(vacuna);
            $scope.vacuna = $scope.paciente.vacunas[indx];
            $scope.evaluarFechaDosisVacuna($scope.vacuna)
            //console.log(vacuna)
            $scope.abrirPopup($scope.idModalDialogHistorialVacuna);
        }

        $scope.cerrarDialogHistorialVacuna = function () {
            // $scope.vacuna = {}
            $scope.cerrarPopup($scope.idModalDialogHistorialVacuna);
        }
        $scope.abrirDialogHistorialConsulta = function () {
            $scope.abrirPopup($scope.idModalHistorialConsulta);
        }
        $scope.cerrarDialogHistorialConsulta = function () {
            $scope.cerrarPopup($scope.idModalHistorialConsulta);
        }
        $scope.abrirDialogHistorialVacunaGeneral = function () {
            $scope.paciente.vacunas.forEach(function (vacuna) {
                $scope.evaluarFechaDosisVacuna(vacuna)
            }, this);
            //console.log($scope.paciente.vacunas)
            $scope.abrirPopup($scope.idModalDialogHistorialVacunaGeneral);
        }
        $scope.cerrarDialogHistorialVacunaGeneral = function () {
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
        $scope.abrirDialogDiagnosticoNuevo = function () {
            $scope.diagnostico = {}
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

        $scope.abrirDialogNuevoExamenDiagnostico = function () {
            $scope.examen = {}
            $scope.abrirPopup($scope.idModalDialogNuevoExamenDiagnostico);
        }
        $scope.cerrarDialogNuevoExamenDiagnostico = function () {
            $scope.cerrarPopup($scope.idModalDialogNuevoExamenDiagnostico);
        }
        $scope.abrirDialogHistorialFicha = function () {
            $scope.abrirPopup($scope.idModalDialogHistorialFicha);
        }
        $scope.cerrarDialogHistorialFicha = function () {
            $scope.cerrarPopup($scope.idModalDialogHistorialFicha);
        }
        $scope.abrirDialogDialogCredencial = function (paciente) {
            $scope.paciente = paciente
            //console.log('el paciente a verificar... V abago')
            //console.log($scope.paciente)
            //console.log($scope.usuario)
            promesa = BuscarFichaPaciente(paciente.id)
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
            promesa = BuscarFichaPaciente(paciente.id)
            promesa.then(function (datos) {
                // //console.log(datos)
                if (datos.ficha) {
                    $scope.ficha = datos.ficha
                    $scope.abrirPopup($scope.idModalDialogPatologias);
                } else {
                    $scope.mostrarMensaje("primero debe crear una ficha medica para poder ver las patogias del paciente")
                }
            })

        }

        $scope.guardarPatoliga = function () {
            promesa = ActualizarPatologiaPaciente($scope.paciente.id, $scope.ficha)
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
            $scope.obtenerListaEmpresaPrerequisito(filtro)
            $scope.abrirPopup($scope.idModalAlertPrerequisitos);
        }
        $scope.cerrarDialogDialogAlertPrerequisitos = function () {
            $scope.cerrarPopup($scope.idModalAlertPrerequisitos);
        }
        //lista pre requisitos
        $scope.obtenerListaEmpresaPrerequisito = function (filtro) {
            $scope.filtro = filtro
            if (filtro.inicio != 0) {
                filtro.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtro.fin = new Date($scope.convertirFecha(filtro.fin))
            }
            promesa = ListaPrerequisitosEmpresa($scope.usuario.id_empresa, filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ""
                $scope.filtro.fin = ""
                $scope.listaPrerequisitos = datos
                $scope.listaPrerequisitos.forEach(function (prerequisito) {

                    var fechaInicio = new Date(prerequisito.fecha_inicio)
                    var fechaVence = new Date(prerequisito.fecha_vencimiento)
                    prerequisito.DiasVence = $scope.diferenciaEntreDiasEnDias(fechaInicio, fechaVence)
                }, this);

            })
        }

        $scope.obtenerListaEmpresaVacunas = function (filtro) {
            $scope.filtro = filtro
            if (filtro.inicio != 0) {
                filtro.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtro.fin = new Date($scope.convertirFecha(filtro.fin))
            }

            promesa = ListaVacunasEmpresa($scope.usuario.id_empresa, filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ""
                $scope.filtro.fin = ""
                $scope.listaVacunas = datos
                $scope.listaVacunas.forEach(function (vacuna) {
                    var fechaInicio = new Date(vacuna.fecha_ultima_aplicacion)
                    var fechaVence = new Date(vacuna.fecha_siguiente_aplicacion)
                    vacuna.DiasVence = $scope.diferenciaEntreDiasEnDias(fechaInicio, fechaVence)
                }, this);

            })
        }

        $scope.abrirDialogDialogDiasActivacionPrerequisitos = function () {
            $scope.abrirPopup($scope.idModalDiasActivacionPrerequisitos);
        }
        $scope.cerrarDialogDialogDiasActivacionPrerequisitos = function () {
            $scope.cerrarPopup($scope.idModalDiasActivacionPrerequisitos);
        }
        $scope.abrirDialogReprogramarPrerequisitos = function () {
            $scope.abrirPopup($scope.idModalReprogramarPrerequisitos);
        }
        $scope.cerrarDialogReprogramarPrerequisitos = function () {
            $scope.cerrarPopup($scope.idModalReprogramarPrerequisitos);
        }
        $scope.abrirDialogAlertVacunas = function () {
            var filtro = { inicio: 0, fin: 0 }
            $scope.obtenerListaEmpresaVacunas(filtro)
            $scope.abrirPopup($scope.idModalAlertVacunas);
        }
        $scope.cerrarDialogAlertVacunas = function () {
            $scope.cerrarPopup($scope.idModalAlertVacunas);
        }
        $scope.abrirDialogDiasActivacionVacunas = function () {
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
            $scope.cerrarPopup($scope.idModalDialogVacunaEdicion);
        }
        $scope.cerrarPopUpVacunasConfig = function () {
            $scope.paciente.vacunas = []
            var vacunas_paciente = VacunasPaciente($scope.paciente)
            vacunas_paciente.then(function (datosVacunas) {
                //console.log(datosVacunas)
                $scope.paciente.vacunas = datosVacunas
                $scope.paciente.vacunas.forEach(function (vacuna) {
                    var fecha = new Date(vacuna.fecha_siguiente_aplicacion)
                    vacuna.fecha_siguiente_aplicacion = (fecha.getMonth() + 1) + "/" + fecha.getDate() + "/" + fecha.getFullYear()
                    vacuna.button_clicked = false
                }, this);
            })
            // $scope.limpiarAsignacionVacunas()
            // $scope.verificarAsignacionVacunas()
            $scope.cerrarPopup($scope.idModalDialogVacunasConfig);
        }
        $scope.cerrarPopUpIdModalFichaTecnica = function () {
            $scope.cerrarPopup($scope.idModalFichaTecnica);
        }
        $scope.cerrarPopUpConsulta = function () {
            $scope.cerrarPopup($scope.idModalDialogConsulta);
        }
        $scope.cerrarPopUpPreRequisitos = function () {
            $scope.cerrarPopup($scope.IdModalDialogPreRequisitos);
        }
        $scope.cerrarIdModalDialogLaboratorio = function () {
            $scope.cerrarPopup($scope.IdModalDialogLaboratorio);
        }
        $scope.cerrarPopPupVacunas = function () {
            $scope.cerrarPopup($scope.idModalDialogVacunas);
        }
        $scope.cerrarPopPupVacunasConfig = function () {
            $scope.cerrarPopup($scope.idModalDialogVacunasConfig);
        }
        $scope.crearNuevaConsulta = function (paciente) {
            $scope.consulta = { id_paciente: paciente.id }
            $scope.paciente = paciente
            var filtro = { inicio: 0, fin: 0 }
            promesa = ListaConsultasMedicoPaciente($scope.paciente.id, filtro)
            promesa.then(function (dato) {
                $scope.consultas = dato.consultas
                $scope.filtro.inicio = "";
                $scope.filtro.fin = "";
            })
            $scope.abrirPopup($scope.idModalDialogConsulta);
        }

        /*   $scope.obtenerPacientes = function () {
              
              var promesa = DatosPacientes()
              promesa.then(function(Datos){
                  $scope.pacientes=Datos.pacientes;
              
              //console.log($scope.pacientes);
              })
          } */

        //laboratorio inicio
        $scope.guardarNuevoLaboratorio = function (form) {
            if (form.$valid) {
                promesa = CrearLaboratorio($scope.paciente.id_empresa, $scope.laboratorio)
                promesa.then(function (datos) {
                    $scope.cerrarIdModalDialogNuevoLaboratorio()
                    $scope.ObtenerMedicoLaboratorios($scope.paciente)
                    $scope.mostrarMensaje(datos.message)
                })
            }
        }
        $scope.ObtenerMedicoLaboratorios = function (paciente) {
            promesa = ListaLaboratorios(paciente.id_empresa)
            promesa.then(function (datos) {
                $scope.listaLaboratorios = datos
            })

        }
        $scope.guardarNuevoLaboratorioExamen = function (form) {
            if (form.$valid) {
                promesa = CrearLaboratorioExamen($scope.laboratorio.id, $scope.examen)
                promesa.then(function (datos) {
                    $scope.cerrarIdModalDialogLaboratorioExamenesNuevoResultado()
                    $scope.ObtenerMedicoLaboratorioExamenes($scope.laboratorio)
                    $scope.mostrarMensaje(datos.message)
                })
            }
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
            if (filtro.inicio != 0) {
                filtro.inicio = new Date($scope.convertirFecha(filtro.inicio));
                filtro.fin = new Date($scope.convertirFecha(filtro.fin));
            }
            promesa = LaboratorioExamenListaHistorial($scope.laboratorio.id, $scope.paciente.id, filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ""
                $scope.filtro.fin = ""
                $scope.listaHistorialLaboratorioExamenes = datos

            })
        }

        //laboratorio fin

        // diagnostico inicio
        $scope.guardarNuevoDiagnostico = function (form) {
            if (form.$valid) {
                promesa = CrearDiagnostico($scope.paciente.id_empresa, $scope.diagnostico)
                promesa.then(function (datos) {
                    $scope.cerrarDialogDiagnosticoNuevo()
                    $scope.ObtenerMedicoLaboratorios($scope.paciente)
                    $scope.mostrarMensaje(datos.message)
                })
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
                promesa = CrearDiagnosticoExamen($scope.diagnostico.id, $scope.examen)
                promesa.then(function (datos) {
                    $scope.cerrarDialogNuevoExamenDiagnostico()
                    $scope.ObtenerMedicoDiagnosticoExamenes($scope.diagnostico)
                    $scope.mostrarMensaje(datos.message)
                })
            }
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
            if (filtro.inicio != 0) {
                filtro.inicio = new Date($scope.convertirFecha(filtro.inicio));
                filtro.fin = new Date($scope.convertirFecha(filtro.fin));
            }
            promesa = DiagnosticoExamenListaHistorial($scope.diagnostico.id, $scope.paciente.id, filtro)
            promesa.then(function (datos) {
                $scope.filtro.inicio = ""
                $scope.filtro.fin = ""
                $scope.listaHistorialDiagnosticoExamenes = datos

            })
        }
        $scope.fecha_excel_angular = function (fecha_desde_excel) {
            var fecha_minima_angular_indice_excel_1970 = 25569 - 1 //fecha minima angular. el -1 es para ajustar que el resultado da 1 anterior a la fecha real.
            var fecha_excel = new Date(1 / 1 / 1970)
            var diferencia_de_fecha = fecha_desde_excel - fecha_minima_angular_indice_excel_1970
            return fecha_excel.setTime(fecha_excel.getTime() + diferencia_de_fecha * 86400000)
        }
        $scope.subirExcelPacientes = function (event) {
            blockUI.start();
            //console.log('iniciando carga de pacientes')
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                //console.log('iniciando lectura de excel(s)')
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    // blockUI.start();
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
                //console.log('pacientes obtenidos')
            }
        }

        $scope.guardarPacientes = function (lstpacientes) {
            var pacientesEmpresa = new PacientesEmpresa({ pacientes: lstpacientes, id_empresa: $scope.usuario.id_empresa });
            pacientesEmpresa.$save(function (res) {

                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            })
            // , function (error) {

            //     $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
            //     $scope.recargarItemsTabla();
            // });
            blockUI.stop();
        }

        $scope.subirExcelFichasTecnicas = function (event) {
            blockUI.start();
            //console.log('iniciando carga de fichas tecnicas pacientes')
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                //console.log('iniciando lectura de excel(s)')
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    // blockUI.start();
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
                //console.log('ficha obtenidos')
            }
        }

        $scope.guardarfichasTecnicas = function (lstFichasTecnicas) {
            var fichasTecnicas = new FichasTecnicasPacientes({ fichas: lstFichasTecnicas, id_empresa: $scope.usuario.id_empresa });
            fichasTecnicas.$save(function (res) {
                $scope.mostrarMensaje(res.mensaje);
                $scope.recargarItemsTabla();
            }, function (error) {
                // $scope.mostrarMensaje(error);
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
                    // blockUI.start();
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

                        //console.log(SV_Paciente.fecha)
                        SV_Paciente.fecha = new Date(SV_Paciente.fecha)
                        signosVitales.push(SV_Paciente);
                        row++;
                        i++;
                    } while (worksheet['A' + row] != undefined);
                    $scope.guardarSignosVitales(signosVitales);
                };
                reader.readAsBinaryString(f);
                //console.log('pacientes obtenidos')
            }
        }

        $scope.guardarSignosVitales = function (signosVitales) {
            var signos = new SignosVitalesPacientes({ signosVitales: signosVitales, id_empresa: $scope.usuario.id_empresa });
            //console.log(signosVitales)
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
            //console.log('iniciando carga de Signos Vitales')
            var files = event.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                //console.log('iniciando lectura de excel(s)')
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    // blockUI.start();
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
                //console.log('pacientes obtenidos')
            }
        }

        $scope.guardarSOAPLista = function (SOAPLista) {
            var soap = new SOAPlistaPacientes({ SOAPLista: SOAPLista, id_empresa: $scope.usuario.id_empresa });
            //console.log(SOAPLista)
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