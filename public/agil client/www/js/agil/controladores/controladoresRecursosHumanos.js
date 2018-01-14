angular.module('agil.controladores')

    .controller('ControladorRecursosHumanos', function ($scope, $sce, $localStorage, $location, $templateCache, $route, blockUI, ListaDatosGenero, NuevoRecursoHumano, RecursosHumanosPaginador, Paginator,
        FieldViewer, PacientesEmpresa, obtenerEmpleadoRh, UsuarioRecursosHUmanosActivo, Prerequisito, ListaDatosPrerequisito, Prerequisitos, ListaPrerequisitosPaciente, ActualizarPrerequisito, UsuarioRecursosHumanosFicha,
        ClasesTipo, Clases, Paises, CrearEmpleadoFicha, EliminarOtroSeguroRh, EliminarFamiliarRh, PrerequisitoPaciente, PrerequisitosHistorial, UsuarioRhHistorialFicha, ObtenerEmpleadoHojaVida, GuardarEmpleadoHojaVida) {
        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalPrerequisitos = 'dialog-pre-requisitos';
        $scope.idModalEmpleado = 'dialog-empleado';
        $scope.idModalwizardContainerEmpleado = 'modal-wizard-empleado-container';
        $scope.idModalTipoDocumento = "dialog-tipo-documento";
        $scope.idModalEstadoCivil = "dialog-estado-civil";
        $scope.idModalNacionalidad = "dialog-nacionalidad";
        $scope.idModalDepartamentoEstado = "dialog-departamento-estado";
        $scope.idModalProvincia = "dialog-provincia";
        $scope.idModalLocalidad = "dialog-localidad";
        $scope.idModalTipoDiscapacidad = "dialog-tipo-discapacidad";
        $scope.idModalTipoContrato = "dialog-tipo-contrato";
        $scope.idModalTipoPersonal = "dialog-tipo-personal";
        $scope.idModalCargaHoraria = "dialog-carga-horaria";
        $scope.idModalUbicacion = "dialog-ubicacion";
        $scope.idModalArea = "dialog-area";
        $scope.idImputContrato = "id-contrato";
        $scope.idModalHojaVida = 'modal-hoja-vida';
        $scope.idModalSeguro = "dialog-seguro";
        $scope.idModalSeguroLugar = "dialog-seguro-lugar";
        $scope.idModalAporte = "dialog-aporte";
        $scope.idModalAporteLugar = "dialog-aporte-lugar";
        $scope.idModalTipoOtrosSeguros = "dialog-tipo-otros-seguros";
        $scope.idModalwizardContainerHojaVida = 'modal-wizard-hoja-vida-container';
        $scope.idModalBanco = "dialog-banco";
        $scope.idModalNuevoHijo = "dialog-nuevo-hijo";
        $scope.idModalNuevoFamiliar = "dialog-nuevo-familiar";
        $scope.idModalGrado = "dialog-grado";
        $scope.idModalTitulo = "dialog-titulo";
        $scope.idModalHistorialContrato = "dialog-historial-contrato";
        $scope.idModalBeneficiosSociales = "modal-beneficios-sociales";
        $scope.idModalMotivoRetiro = "dialog-motivo-retiro";
        $scope.idModalDetalleVacaciones = "dialog-detalle-vacaciones";
        $scope.idModalOtroIngreso = "dialog-nuevo-otro-ingreso";
        $scope.idModalDeduccion = "dialog-nueva-deduccion";
        $scope.idModalAnticipoExtraordinario = "dialog-anticipo-extraordinario";
        $scope.idModalNuevoPrestamo = "dialog-nuevo-prestamo";
        $scope.idModalAusenciasVacaciones = "dialog-ausencias-vacaciones";
        $scope.idTabAusenciasVacaciones = "tab-ausencias-vacaciones";
        $scope.idModalTipoBaja = "dialog-tipo-baja";
        $scope.idModalFeriados = "dialog-feriados";
        $scope.idModalHitorialVacaciones = "dialog-historial-vacaciones";
        $scope.idModalCompensacion = "dialog-compesacion";
        $scope.idModalHistorialAusencias = "dialog-historial-ausencias";
        $scope.idModalHistorialAusenciaMedica = "dialog-historial-ausencia-medica";
        $scope.idModalTipoAusencia = "dialog-tipo-ausencia";
        $scope.idModalRolTurnos = "dialog-rol-turnos";
        $scope.idModalHistorialTurnos = "dialog-historial-turnos";
        $scope.idModalHorasExtras = "dialog-horas-extras";
        $scope.idModalHistorialHorasExtras = "dialog-historial-horas-extras";
        $scope.idModalAnticipoRegular = "dialog-anticipo-regular";
        $scope.idModalPrestamosPersonal = "dialog-prestamos-personal";
        $scope.idModalAdvertencia = "dialog-advertencia";
        $scope.idModalPretamosNuevoTodos = "dialog-nuevo-prestamo-todos";
        $scope.idModalReporteHijos = "dialog-reporte-hijos";
        $scope.idModalReporteVeneficios = "dialog-reporte-beneficios-sociales";
        $scope.idModalPagoPrestamo = "dialog-pago-prestamo";
        $scope.idModalReporteVacaciones = "dialog-reporte-vacaciones";
        $scope.idModalReporteBajasMedicas = "dialog-reporte-bajas-medicas";
        $scope.idModalReporteRolTurnos = "dialog-reporte-rol-turnos";
        $scope.idModalReporteTurnosDetallado = "dialog-reporte-turnos-detallado";
        $scope.idModalViajes = "dialog-viajes";
        $scope.idModalVisita = "dialog-visita";
        $scope.idModalVehiculosViaje = "dialog-vehiculos-viaje";
        $scope.idModalDestinos = "dialog-destinos";
        $scope.idModalHistorialViajes = "dialog-historial-viajes";
        $scope.idModalReporteAusencias = "dialog-reporte-ausencias";
        $scope.idModalCertificado = "dialog-certificado";
        $scope.idModalInstitucion = "dialog-institucion";
        $scope.idModalRhNuevo = "dialog-rh-nuevo";
        $scope.idModalWizardRhNuevo = "modal-wizard-rh-container";
        $scope.idImagenUsuario = 'imagen-persona';
        $scope.idEliminarUsuarioRh = 'dialog-eliminar-usuarioRh';
        $scope.idEliminarSeguroEmpleado = 'dialog-eliminar-seguro';
        $scope.idEliminarFamiliarEmpleado = 'dialog-eliminar-familiar';
        $scope.idModalWizardRhVista = 'dialog-rh-vista';
        $scope.idModalContenedorRhVista = 'modal-wizard-container-rh-vista';
        $scope.idModalDialogPrerequisitoNuevo = 'dialog-pre-requisito-nuevo';
        $scope.idModalHistorialPrerequisito = 'dialog-historico-preRequisito';
        $scope.idModalEditarPrerequisito = 'dialog-editar-preRequisito';
        $scope.idModalDialogConfirmacionEntregaAdelantado = 'dialog-entrega-adelantada-prerequisito'
        $scope.IdEntregaPrerequisito = 'dialog-entrega-preRequisito';
        $scope.$on('$viewContentLoaded', function () {
            // resaltarPestaña($location.path().substring(1));
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsRecursosHumanos($scope.idModalPrerequisitos, $scope.idModalEmpleado, $scope.idModalwizardContainerEmpleado,
                $scope.idModalConceptoEdicion, $scope.idModalTipoDocumento, $scope.idModalEstadoCivil, $scope.idModalNacionalidad,
                $scope.idModalDepartamentoEstado, $scope.idModalProvincia, $scope.idModalLocalidad, $scope.idModalTipoDiscapacidad,
                $scope.idModalTipoContrato, $scope.idModalTipoPersonal, $scope.idModalCargaHoraria, $scope.idModalArea,
                $scope.idModalUbicacion, $scope.idImputContrato, $scope.idModalHojaVida, $scope.idModalwizardContainerHojaVida,
                $scope.idModalSeguro, $scope.idModalSeguroLugar, $scope.idModalAporte, $scope.idModalAporteLugar,
                $scope.idModalTipoOtrosSeguros, $scope.idModalBanco, $scope.idModalNuevoHijo, $scope.idModalNuevoFamiliar,
                $scope.idModalGrado, $scope.idModalTitulo, $scope.idModalHistorialContrato, $scope.idModalBeneficiosSociales,
                $scope.idModalMotivoRetiro, $scope.idModalDetalleVacaciones, $scope.idModalOtroIngreso, $scope.idModalDeduccion,
                $scope.idModalAnticipoExtraordinario, $scope.idModalNuevoPrestamo, $scope.idModalAusenciasVacaciones,
                $scope.idTabAusenciasVacaciones, $scope.idModalTipoBaja, $scope.idModalFeriados, $scope.idModalHitorialVacaciones,
                $scope.idModalCompensacion, $scope.idModalHistorialAusencias, $scope.idModalHistorialAusenciaMedica, $scope.idModalTipoAusencia,
                $scope.idModalRolTurnos, $scope.idModalHistorialTurnos, $scope.idModalHorasExtras, $scope.idModalHistorialHorasExtras,
                $scope.idModalAnticipoRegular, $scope.idModalPrestamosPersonal, $scope.idModalAdvertencia, $scope.idModalPretamosNuevoTodos,
                $scope.idModalReporteHijos, $scope.idModalReporteVeneficios, $scope.idModalPagoPrestamo, $scope.idModalReporteVacaciones,
                $scope.idModalReporteBajasMedicas, $scope.idModalReporteRolTurnos, $scope.idModalReporteTurnosDetallado,
                $scope.idModalViajes, $scope.idModalVisita, $scope.idModalVehiculosViaje, $scope.idModalDestinos,
                $scope.idModalHistorialViajes, $scope.idModalReporteAusencias, $scope.idModalCertificado, $scope.idModalInstitucion,
                $scope.idModalRhNuevo, $scope.idModalWizardRhNuevo, $scope.idImagenUsuario, $scope.idEliminarUsuarioRh, $scope.idModalWizardRhVista,
                $scope.idModalContenedorRhVista, $scope.idModalDialogPrerequisitoNuevo, $scope.idEliminarSeguroEmpleado, $scope.idEliminarFamiliarEmpleado, $scope.idModalHistorialPrerequisito,
                $scope.idModalEditarPrerequisito, $scope.idModalDialogConfirmacionEntregaAdelantado, $scope.IdEntregaPrerequisito);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion()
            blockUI.stop();

        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalEmpleado)
            $scope.eliminarPopup($scope.idModalConceptoEdicion)
            $scope.eliminarPopup($scope.idModalTipoDocumento)
            $scope.eliminarPopup($scope.idModalEstadoCivil)
            $scope.eliminarPopup($scope.idModalNacionalidad)
            $scope.eliminarPopup($scope.idModalDepartamentoEstado)
            $scope.eliminarPopup($scope.idModalProvincia)
            $scope.eliminarPopup($scope.idModalLocalidad)
            $scope.eliminarPopup($scope.idModalTipoDiscapacidad)
            $scope.eliminarPopup($scope.idModalTipoContrato)
            $scope.eliminarPopup($scope.idModalTipoPersonal)
            $scope.eliminarPopup($scope.idModalCargaHoraria)
            $scope.eliminarPopup($scope.idModalArea)
            $scope.eliminarPopup($scope.idModalUbicacion)
            $scope.eliminarPopup($scope.idModalHojaVida)
            $scope.eliminarPopup($scope.idModalSeguro)
            $scope.eliminarPopup($scope.idModalSeguroLugar)
            $scope.eliminarPopup($scope.idModalAporte)
            $scope.eliminarPopup($scope.idModalAporteLugar)
            $scope.eliminarPopup($scope.idModalTipoOtrosSeguros)
            $scope.eliminarPopup($scope.idModalBanco)
            $scope.eliminarPopup($scope.idModalNuevoHijo)
            $scope.eliminarPopup($scope.idModalNuevoFamiliar)
            $scope.eliminarPopup($scope.idModalGrado)
            $scope.eliminarPopup($scope.idModalTitulo)
            $scope.eliminarPopup($scope.idModalHistorialContrato)
            $scope.eliminarPopup($scope.idModalBeneficiosSociales)
            $scope.eliminarPopup($scope.idModalMotivoRetiro)
            $scope.eliminarPopup($scope.idModalDetalleVacaciones)
            $scope.eliminarPopup($scope.idModalOtroIngreso)
            $scope.eliminarPopup($scope.idModalDeduccion)
            $scope.eliminarPopup($scope.idModalAnticipoExtraordinario)
            $scope.eliminarPopup($scope.idModalNuevoPrestamo)
            $scope.eliminarPopup($scope.idModalAusenciasVacaciones)
            $scope.eliminarPopup($scope.idModalTipoBaja)
            $scope.eliminarPopup($scope.idModalFeriados)
            $scope.eliminarPopup($scope.idModalHitorialVacaciones)
            $scope.eliminarPopup($scope.idModalCompensacion)
            $scope.eliminarPopup($scope.idModalHistorialAusencias)
            $scope.eliminarPopup($scope.idModalHistorialAusenciaMedica)
            $scope.eliminarPopup($scope.idModalTipoAusencia)
            $scope.eliminarPopup($scope.idModalRolTurnos)
            $scope.eliminarPopup($scope.idModalHistorialTurnos)
            $scope.eliminarPopup($scope.idModalHorasExtras)
            $scope.eliminarPopup($scope.idModalHistorialHorasExtras)
            $scope.eliminarPopup($scope.idModalAnticipoRegular)
            $scope.eliminarPopup($scope.idModalPrestamosPersonal)
            $scope.eliminarPopup($scope.idModalAdvertencia)
            $scope.eliminarPopup($scope.idModalPretamosNuevoTodos)
            $scope.eliminarPopup($scope.idModalReporteHijos)
            $scope.eliminarPopup($scope.idModalReporteVeneficios)
            $scope.eliminarPopup($scope.idModalPagoPrestamo)
            $scope.eliminarPopup($scope.idModalReporteVacaciones)
            $scope.eliminarPopup($scope.idModalReporteBajasMedicas)
            $scope.eliminarPopup($scope.idModalReporteRolTurnos)
            $scope.eliminarPopup($scope.idModalReporteTurnosDetallado)
            $scope.eliminarPopup($scope.idModalViajes)
            $scope.eliminarPopup($scope.idModalVisita)
            $scope.eliminarPopup($scope.idModalVehiculosViaje)
            $scope.eliminarPopup($scope.idModalDestinos)
            $scope.eliminarPopup($scope.idModalHistorialViajes)
            $scope.eliminarPopup($scope.idModalReporteAusencias)
            $scope.eliminarPopup($scope.idModalCertificado)
            $scope.eliminarPopup($scope.idModalInstitucion)
            $scope.eliminarPopup($scope.idModalPrerequisitos)
            $scope.eliminarPopup($scope.idModalRhNuevo)
            $scope.eliminarPopup($scope.idModalWizardRhVista)
            $scope.eliminarPopup($scope.idModalDialogPrerequisitoNuevo)
            $scope.eliminarPopup($scope.idEliminarFamiliarEmpleado)
            $scope.eliminarPopup($scope.idEliminarSeguroEmpleado)
            $scope.eliminarPopup($scope.idModalHistorialPrerequisito)
            $scope.eliminarPopup($scope.idModalEditarPrerequisito)
            $scope.eliminarPopup($scope.idModalDialogConfirmacionEntregaAdelantado)
            $scope.eliminarPopup($scope.IdEntregaPrerequisito)
        });
        $scope.inicio = function () {
            $scope.obtenerGenero();
            $scope.obtenerRecursosHumanos();
            /*   $scope.obtenerPrerequisito(); */
            $scope.recuperarDatosTipo()


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
                    tipo_contrato: { value: "Tipo Contrato", show: true },
                    campo: { value: "Campo", show: true },
                    cargo: { value: "Cargo", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
        }
        $scope.abrirDialogEditarPreRequisito = function (prerequisito) {
            $scope.prerequisito = prerequisito
            $scope.prerequisito.fecha_vencimiento_texto = $scope.fechaATexto(new Date)
            $scope.abrirPopup($scope.idModalEditarPrerequisito);
        }

        $scope.cerrarDialogEditarPreRequisito = function () {
            $scope.cerrarPopup($scope.idModalEditarPrerequisito);
        }
        $scope.abrirDialogPrerequisitoNuevo = function () {
            $scope.NuevoP = new Prerequisito({ puede_modificar_rrhh: false });
            console.log($scope.nuevoP)
            $scope.abrirPopup($scope.idModalDialogPrerequisitoNuevo);
        }

        $scope.cerrarDialogPrerequisitoNuevo = function () {
            $scope.cerrarPopup($scope.idModalDialogPrerequisitoNuevo);
        }
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
                $scope.abrirDialogEntregaPreRequisito($scope.preRequisito, $scope.empleado);
            } else {
                $scope.abrirPopup($scope.idModalDialogConfirmacionEntregaAdelantado);
            }

        }
        $scope.abrirDialogEntregaPreRequisito = function (PreRequisito, paciente) {
            $scope.cerrarConfirmacionEntragaAdelantadaPrerequisito()
            $scope.preRequisito = PreRequisito
            $scope.preRequisito.fecha_entrega_texto = $scope.fechaATexto(new Date())
            $scope.paciente = paciente
            $scope.abrirPopup($scope.IdEntregaPrerequisito);
        }
        $scope.cerrarPopUpEntregaPreRequisito = function () {

            $scope.cerrarPopup($scope.IdEntregaPrerequisito);
        }
        $scope.cerrarConfirmacionEntragaAdelantadaPrerequisito = function () {
            $scope.cerrarPopup($scope.idModalDialogConfirmacionEntregaAdelantado);
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
        $scope.abrirDialogVerEmpleado = function (elpaciente) {
            promesaPaciente = obtenerEmpleadoRh(elpaciente.id)
            promesaPaciente.then(function (dato) {
                if (dato.clase != undefined) {
                    dato.medicoPaciente.tipo_contrato = dato.clase
                }
                $scope.paciente = dato.medicoPaciente
                $scope.paciente.fecha_nacimiento_texto = $scope.fechaATexto($scope.paciente.persona.fecha_nacimiento)
                $scope.seleccionarCargos(paciente.cargos)
                $scope.paciente.ver = true

            })
            $scope.abrirPopup($scope.idModalWizardRhVista);
        }

        $scope.cerrarDialogVerEmpleado = function () {
            $scope.cerrarPopup($scope.idModalWizardRhVista);
        }
        $scope.abrirDialogRhNuevo = function () {
            $scope.nuevoRH = new NuevoRecursoHumano({ persona: { imagen: "img/icon-user-default.png" }, id_empresa: $scope.usuario.id_empresa, es_empleado: true });
            $scope.abrirPopup($scope.idModalRhNuevo);
        }
        $scope.cerrarDialogRhNuevo = function () {
            $scope.cerrarPopup($scope.idModalRhNuevo);
        }
        $scope.cerrarDialogEliminarUsuarioRh = function () {
            $scope.cerrarPopup($scope.idEliminarUsuarioRh);
        }
        $scope.abrirDialogEliminarUsuarioRh = function () {

            $scope.abrirPopup($scope.idEliminarUsuarioRh);
        }
        $scope.cerrarDialogEliminarSeguroEmpleado = function () {

            $scope.cerrarPopup($scope.idEliminarSeguroEmpleado);
        }
        $scope.abrirDialogEliminarSeguroEmpleado = function (dato, index) {
            $scope.otroSeguro = dato
            $scope.otroSeguro.index = index
            $scope.abrirPopup($scope.idEliminarSeguroEmpleado);
        }
        $scope.cerrarDialogEliminarFamiliarEmpleado = function () {

            $scope.cerrarPopup($scope.idEliminarFamiliarEmpleado);
        }
        $scope.abrirDialogEliminarFamiliarEmpleado = function (dato, index) {
            $scope.familiar = dato
            $scope.familiar.index = index
            $scope.abrirPopup($scope.idEliminarFamiliarEmpleado);
        }

        $scope.abrirIdModalDialogPreRequisitos = function (empleado) {
            $scope.empleado = empleado;
            $scope.verificarAsignacionPrerequisitos()

            $scope.abrirPopup($scope.idModalPrerequisitos);
        }
        $scope.cerrarIdModalDialogPreRequisitos = function () {
            $scope.cerrarPopup($scope.idModalPrerequisitos);
        }
        $scope.abrirDialogEmpleado = function (empleado) {
            $scope.obtenerDatosFichaUsuario(empleado);
            $scope.empleado = empleado
            $scope.obtenerHistorialContratos(empleado)

            $scope.abrirPopup($scope.idModalEmpleado);
        }
        $scope.cerrarDialogEmpleado = function (ficha) {
            $scope.departamentos = []
            $scope.provincias = []
            $scope.localidades = []
            $scope.obtenerCargos()
            $scope.obtenerDiscapacidades()
            $scope.cerrarPopup($scope.idModalEmpleado);
        }

        $scope.abrirDialogTipoDocumento = function () {
            $scope.abrirPopup($scope.idModalTipoDocumento);
        }
        $scope.cerrarDialogTipoDocumento = function () {
            $scope.idModalHitorialAusencias
            $scope.cerrarPopup($scope.idModalTipoDocumento);
        }
        $scope.abrirDialogEstadoCivil = function () {
            $scope.abrirPopup($scope.idModalEstadoCivil);
        }
        $scope.cerrarDialogEstadoCivil = function () {
            $scope.cerrarPopup($scope.idModalEstadoCivil);
        }
        $scope.abrirDialogNacionalidad = function () {
            $scope.abrirPopup($scope.idModalNacionalidad);
        }
        $scope.cerrarDialogNacionalidad = function () {
            $scope.cerrarPopup($scope.idModalNacionalidad);
        }
        $scope.abrirDialogDepartamentoEstado = function () {
            $scope.abrirPopup($scope.idModalDepartamentoEstado);
        }
        $scope.cerrarDialogDepartamentoEstado = function () {
            $scope.cerrarPopup($scope.idModalDepartamentoEstado);
        }
        $scope.abrirDialogProvincia = function () {
            $scope.abrirPopup($scope.idModalProvincia);
        }
        $scope.cerrarDialogProvincia = function () {
            $scope.cerrarPopup($scope.idModalProvincia);
        }
        $scope.abrirDialogLocalidad = function () {
            $scope.abrirPopup($scope.idModalLocalidad);
        }
        $scope.cerrarDialogLocalidad = function () {
            $scope.cerrarPopup($scope.idModalLocalidad);
        }
        $scope.abrirDialogTipoDiscapacidad = function () {
            $scope.abrirPopup($scope.idModalTipoDiscapacidad);
        }
        $scope.cerrarDialogTipoDiscapacidad = function () {
            $scope.cerrarPopup($scope.idModalTipoDiscapacidad);
        }
        $scope.abrirDialogTipoContrato = function () {
            $scope.abrirPopup($scope.idModalTipoContrato);
        }
        $scope.cerrarDialogTipoContrato = function () {
            $scope.cerrarPopup($scope.idModalTipoContrato);
        }
        $scope.abrirDialogTipoPersonal = function () {
            $scope.abrirPopup($scope.idModalTipoPersonal);
        }
        $scope.cerrarDialogTipoPersonal = function () {
            $scope.cerrarPopup($scope.idModalTipoPersonal);
        }
        $scope.abrirDialogCargaHoraria = function () {
            $scope.abrirPopup($scope.idModalCargaHoraria);
        }
        $scope.cerrarDialogCargaHoraria = function () {
            $scope.cerrarPopup($scope.idModalCargaHoraria);
        }
        $scope.abrirDialogArea = function () {
            $scope.abrirPopup($scope.idModalArea);
        }
        $scope.cerrarDialogArea = function () {
            $scope.cerrarPopup($scope.idModalArea);
        }
        //$scope.cargos = [{ 'name': 'Chofer' }, { 'name': 'Ayudante de Of.' }, { 'name': 'Mecanico' }];
        // $scope.discapacidades = [{ 'name': 'Fisica' }, { 'name': 'Sensorial' }, { 'name': 'Psiquica' }, { 'name': 'Intelectual o Mental' }];
        $scope.fechacontratos = [{ 'name': '10/01/2000 - 01/01/2002' }, { 'name': '10/01/2000 - 01/01/2002' }, { 'name': '10/01/2000 - 01/01/2002' }];
        // === traductor select multiple ==========
        $scope.localLang = {
            selectAll: "Marcar todo",
            selectNone: "No marcar ninguno",
            reset: "Deshacer todo",
            search: "Escriba aquí para busc$scope.idModalGradoar...",
            nothingSelected: "No se ha seleccionado nada"
        };

        $scope.abrirDialogUbicacion = function () {
            $scope.abrirPopup($scope.idModalUbicacion);
        }
        $scope.cerrarDialogUbicacion = function () {
            $scope.cerrarPopup($scope.idModalUbicacion);
        }
        $scope.abrirDialogHojaVida = function (empleado) {
            $scope.empleado = empleado
            if (!$scope.empleado.persona) {
                $scope.empleado.persona = { nombre_completo: "" }
                $scope.empleado.persona.nombre_completo = empleado.nombre_completo
            }
            var promesa = ObtenerEmpleadoHojaVida(empleado.id)
            promesa.then(function (datos) {
                if (datos.hojaVida) {
                    //
                    if (datos.hojaVida.capacidades.length > 0) {
                        datos.hojaVida.capacidades.forEach(function (capacidad, index, array) {
                            capacidad.fechaTexto = $scope.fechaATexto(capacidad.fecha)
                        });
                    }
                    if (datos.hojaVida.logros.length > 0) {
                        datos.hojaVida.logros.forEach(function (logro, index, array) {
                            logro.fechaTexto = $scope.fechaATexto(logro.fecha)
                        });
                    }
                    if (datos.hojaVida.experienciasLaborales.length > 0) {
                        datos.hojaVida.experienciasLaborales.forEach(function (experiencia, index, array) {
                            experiencia.fecha_inicioTexto = $scope.fechaATexto(experiencia.fecha_inicio)
                            experiencia.fecha_finTexto = $scope.fechaATexto(experiencia.fecha_fin)
                        });
                    }
                    $scope.hojaVida = datos.hojaVida

                } else {
                    $scope.hojaVida = { capacidades: [], logros: [], formacionesAcademicas: [], experienciasLaborales: [] }
                }
            })
            $scope.formacionAcademica = { edit: false, eliminado: false }
            $scope.capacidad = { edit: false, eliminado: false }
            $scope.logros = { edit: false, eliminado: false }
            $scope.experienciaLaboral = { edit: false, eliminado: false }
            $scope.abrirPopup($scope.idModalHojaVida);
        }
        $scope.cerrarDialogHojaVida = function () {
            $scope.cerrarPopup($scope.idModalHojaVida);
        }
        $scope.abrirDialogSeguro = function () {
            $scope.abrirPopup($scope.idModalSeguro);
        }
        $scope.cerrarDialogSeguro = function () {
            $scope.cerrarPopup($scope.idModalSeguro);
        }
        $scope.abrirDialogSeguroLugar = function () {
            $scope.abrirPopup($scope.idModalSeguroLugar);
        }
        $scope.cerrarDialogSeguroLugar = function () {
            $scope.cerrarPopup($scope.idModalSeguroLugar);
        }
        $scope.abrirDialogAporte = function () {
            $scope.abrirPopup($scope.idModalAporte);
        }
        $scope.cerrarDialogAporte = function () {
            $scope.cerrarPopup($scope.idModalAporte);
        }
        $scope.abrirDialogAporteLugar = function () {
            $scope.abrirPopup($scope.idModalAporteLugar);
        }
        $scope.cerrarDialogAporteLugar = function () {
            $scope.cerrarPopup($scope.idModalAporteLugar);
        }
        $scope.abrirDialogTipoOtrosSeguros = function () {
            $scope.abrirPopup($scope.idModalTipoOtrosSeguros);
        }
        $scope.cerrarDialogTipoOtrosSeguros = function () {
            $scope.cerrarPopup($scope.idModalTipoOtrosSeguros);
        }
        $scope.abrirDialogBanco = function () {
            $scope.abrirPopup($scope.idModalBanco);
        }
        $scope.cerrarDialogBanco = function () {
            $scope.cerrarPopup($scope.idModalBanco);
        }
        $scope.abrirDialogNuevoHijo = function () {
            $scope.abrirPopup($scope.idModalNuevoHijo);
        }
        $scope.cerrarDialogNuevoHijo = function () {
            $scope.cerrarPopup($scope.idModalNuevoHijo);
        }
        $scope.abrirDialogNuevoFamiliar = function () {
            $scope.abrirPopup($scope.idModalNuevoFamiliar);
        }
        $scope.cerrarDialogNuevoFamiliar = function () {
            if ($scope.familiar) {

                $scope.familiar = { edit: false }
            }
            $scope.cerrarPopup($scope.idModalNuevoFamiliar);
        }
        $scope.abrirDialogGrado = function () {
            $scope.abrirPopup($scope.idModalGrado);
        }
        $scope.cerrarDialogGrado = function () {
            $scope.cerrarPopup($scope.idModalGrado);
        }
        $scope.abrirDialogTitulo = function () {
            $scope.abrirPopup($scope.idModalTitulo);
        }
        $scope.cerrarDialogTitulo = function () {
            $scope.cerrarPopup($scope.idModalTitulo);
        }
        $scope.abrirDialogHistorialContrato = function () {
            $scope.abrirPopup($scope.idModalHistorialContrato);
        }
        $scope.cerrarDialogHistorialContrato = function () {
            $scope.cerrarPopup($scope.idModalHistorialContrato);
        }
        $scope.abrirDialogBeneficiosSociales = function () {
            $scope.abrirPopup($scope.idModalBeneficiosSociales);
        }
        $scope.cerrarDialogBeneficiosSociales = function () {
            $scope.cerrarPopup($scope.idModalBeneficiosSociales);
        }
        $scope.abrirDialogMotivoRetiro = function () {
            $scope.abrirPopup($scope.idModalMotivoRetiro);
        }
        $scope.cerrarDialogMotivoRetiro = function () {
            $scope.cerrarPopup($scope.idModalMotivoRetiro);
        }
        $scope.abrirDialogDetalleVacaciones = function () {
            $scope.abrirPopup($scope.idModalDetalleVacaciones);
        }
        $scope.cerrarDialogDetalleVacaciones = function () {
            $scope.cerrarPopup($scope.idModalDetalleVacaciones);
        }
        $scope.abrirDialogOtroIngreso = function () {
            $scope.abrirPopup($scope.idModalOtroIngreso);
        }
        $scope.cerrarDialogOtroIngreso = function () {
            $scope.cerrarPopup($scope.idModalOtroIngreso);
        }
        $scope.abrirDialogDeduccion = function () {
            $scope.abrirPopup($scope.idModalDeduccion);
        }
        $scope.cerrarDialogDeduccion = function () {
            $scope.cerrarPopup($scope.idModalDeduccion);
        }
        $scope.abrirDialogAnticipoExtraordinario = function () {
            $scope.abrirPopup($scope.idModalAnticipoExtraordinario);
        }
        $scope.cerrarDialogAnticipoExtraordinario = function () {
            $scope.cerrarPopup($scope.idModalAnticipoExtraordinario);
        }
        $scope.abrirDialogNuevoPrestamo = function () {
            $scope.abrirPopup($scope.idModalNuevoPrestamo);
        }
        $scope.cerrarDialogNuevoPrestamo = function () {
            $scope.cerrarPopup($scope.idModalNuevoPrestamo);
        }
        $scope.abrirDialogAusenciasVacaciones = function () {
            $scope.abrirPopup($scope.idModalAusenciasVacaciones);
        }
        $scope.cerrarDialogAusenciasVacaciones = function () {
            $scope.cerrarPopup($scope.idModalAusenciasVacaciones);
        }
        $scope.abrirDialogTipoBaja = function () {
            $scope.abrirPopup($scope.idModalTipoBaja);
        }
        $scope.cerrarDialogTipoBaja = function () {
            $scope.cerrarPopup($scope.idModalTipoBaja);
        }

        /* initialize the full calendar
        -----------------------------------------------------------------*/
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        var calendar = $('#calendar').fullCalendar({
            buttonHtml: {
                prev: '<i class="ace-icon fa fa-chevron-left"></i>',
                next: '<i class="ace-icon fa fa-chevron-right"></i>'
            },
            height: 400,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek, agendaDay'
            },
            events: [
                {
                    title: 'Feriado',
                    start: new Date(y, m, 1),
                    className: 'label-important'
                }

            ],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            buttonText: {
                today: 'hoy',
                month: 'mes',
                week: 'semana',
                day: 'día',
                list: 'lista'
            },
            editable: true,
            selectable: true,
            select: function (start, end, allDay) {
                calendar.fullCalendar('renderEvent',
                    {
                        title: 'Feriado',
                        start: start,
                        end: end,
                        allDay: allDay,
                        className: 'label-info'
                    },
                    true // make the event "stick"
                );
                calendar.fullCalendar('unselect');
            },
            eventClick: function (calEvent, jsEvent, view) {
                //display a modal
                var modal =
                    '<div class="modal fade modal-delete">\
			  <div class="modal-dialog">\
			   <div class="modal-content">\
				 <div class="modal-body">\
				   <button type="button" class="close" data-dismiss="modal" style="margin-top:-10px;">&times;</button>\
				   <form class="no-margin">\
					  <label> Eliminar ' + calEvent.title + ' &nbsp;</label>\
				   </form>\
				 </div>\
				 <div class="modal-footer">\
					<button type="button" class="btn btn-sm btn-danger" data-action="delete"><i class="ace-icon fa fa-trash-o"></i>Eliminar</button>\
					<button type="button" class="btn btn-sm" data-dismiss="modal"><i class="ace-icon fa fa-times"></i> Cancel</button>\
				 </div>\
			  </div>\
			 </div>\
			</div>';

                var modal = $(modal).appendTo('body');
                modal.find('form').on('submit', function (ev) {
                    ev.preventDefault();

                    calEvent.title = $(this).find("input[type=text]").val();
                    calendar.fullCalendar('updateEvent', calEvent);
                    modal.modal("hide");
                });
                modal.find('button[data-action=delete]').on('click', function () {
                    calendar.fullCalendar('removeEvents', function (ev) {
                        return (ev._id == calEvent._id);
                    })
                    modal.modal("hide");
                });

                modal.modal('show').on('hidden', function () {
                    modal.remove();
                });

            }
        });

        $scope.abrirDialogFeriados = function () {
            $scope.abrirPopup($scope.idModalFeriados);
            $('#calendar').fullCalendar('render');
        }
        $scope.cerrarDialogFeriados = function () {
            $scope.cerrarPopup($scope.idModalFeriados);
        }
        $scope.abrirDialogHitorialVacaciones = function () {
            $scope.abrirPopup($scope.idModalHitorialVacaciones);
        }
        $scope.cerrarDialogHitorialVacaciones = function () {
            $scope.cerrarPopup($scope.idModalHitorialVacaciones);
        }

        $scope.selectionday = [];
        $scope.totalHoras = moment("00:00", "HH:mm");

        $scope.calendarCompensacion = $('#calendar-compensacion').fullCalendar({
            buttonHtml: {
                prev: '<i class="ace-icon fa fa-chevron-left"></i>',
                next: '<i class="ace-icon fa fa-chevron-right"></i>'
            },
            height: 400,
            defaultView: 'agendaWeek',
            allDaySlot: false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek, agendaDay'
            },
            events: [
                {
                    title: 'Feriado',
                    start: new Date(y, m, 1),
                    className: 'label-important'
                }

            ],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            buttonText: {
                today: 'hoy',
                month: 'mes',
                week: 'semana',
                day: 'día',
                list: 'lista'
            },
            editable: true,
            selectable: true,
            // slotMinutes: 15,
            // slotLabelInterval: 15,
            // slotDuration: '00:15:00',
            select: function (start, end) {
                $scope.horas = moment.utc(moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(start, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm");
                $scope.Event = $scope.calendarCompensacion.fullCalendar('renderEvent',
                    {
                        start: start,
                        end: end,
                        className: 'label-info'
                    },
                    true // make the event "stick"
                );

                $scope.selectionday.push({ '_id': $scope.Event[0]._id, 'fecha': start.format("DD-MM-YYYY"), 'hora_inicio': start.format("HH:mm"), 'hora_fin': end.format("HH:mm"), 'total': $scope.horas });
                $scope.sumarTotalHoras();
                $scope.$apply();
                $scope.calendarCompensacion.fullCalendar('unselect');
            },
            eventResize: function (event, delta, revertFunc) {
                var end = event.end;
                var start = event.start;
                var idx = event._id;
                $scope.horas = moment.utc(moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(start, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm");
                function Update(key, value) {
                    for (var i = 0; i < $scope.selectionday.length; i++) {
                        if ($scope.selectionday[i]._id == key) {
                            $scope.selectionday[i].hora_fin = value;
                            $scope.selectionday[i].total = $scope.horas;
                            break;
                        }
                    }
                }
                Update(idx, end.format("HH:mm"));
                $scope.sumarTotalHoras();
                $scope.$apply();
            },
            eventDrop: function (event, delta, revertFunc) {
                console.log('el evento dropp ', event.start.format());
                var start = event.start;
                var end = event.end;
                $scope.horas = moment.utc(moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(start, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm");

                function Update(key, valueStart, valueEnd) {
                    for (var i = 0; i < $scope.selectionday.length; i++) {
                        if ($scope.selectionday[i]._id == key) {
                            $scope.selectionday[i].fecha = valueStart.format("DD-MM-YYYY");
                            $scope.selectionday[i].hora_inicio = valueStart.format("HH:mm");
                            $scope.selectionday[i].hora_fin = valueEnd.format("HH:mm");
                            $scope.selectionday[i].total = $scope.horas;
                            break;
                        }
                    }
                }
                Update(event._id, start, end);
                $scope.sumarTotalHoras();
                $scope.$apply();
            },
            eventClick: function (calEvent, jsEvent, view) {
                //display a modal
                var modal =
                    '<div class="modal fade modal-delete">\
			  <div class="modal-dialog">\
			   <div class="modal-content">\
				 <div class="modal-body">\
				   <button type="button" class="close" data-dismiss="modal" style="margin-top:-10px;">&times;</button>\
				   <form class="no-margin">\
					  <label> Eliminar ' + calEvent.title + ' &nbsp;</label>\
				   </form>\
				 </div>\
				 <div class="modal-footer">\
					<button type="button" class="btn btn-sm btn-danger" data-action="delete"><i class="ace-icon fa fa-trash-o"></i>Eliminar</button>\
					<button type="button" class="btn btn-sm" data-dismiss="modal"><i class="ace-icon fa fa-times"></i> Cancel</button>\
				 </div>\
			  </div>\
			 </div>\
			</div>';


                var modal = $(modal).appendTo('body');
                modal.find('button[data-action=delete]').on('click', function () {
                    $scope.calendarCompensacion.fullCalendar('removeEvents', function (ev) {
                        return (ev._id == calEvent._id);
                    });
                    $scope.selectionday.splice(calEvent._id, 1);
                    $scope.$apply();
                    modal.modal("hide");
                });

                modal.modal('show').on('hidden', function () {
                    modal.remove();
                });

            }
        });

        $scope.sumarTotalHoras = function () {
            var totalHoras = "";
            var timeHoras = 0;
            var timeMinutos = 0;
            for (var i = 0; i < $scope.selectionday.length; i++) {
                var minutos = $scope.selectionday[i].total.split(':')[1];
                var horas = $scope.selectionday[i].total.split(':')[0];

                timeHoras = timeHoras + parseInt(horas);
                timeMinutos = timeMinutos + parseInt(minutos);
                if (timeMinutos >= 60) {
                    timeMinutos = timeMinutos - 60;
                    timeHoras = timeHoras + 1;
                }
                totalHoras = String("0" + timeHoras).slice(-2) + ':' + String("0" + timeMinutos).slice(-2);
            }
            $scope.SumaTotalHoras = totalHoras;
        }

        $scope.abrirDialogCompensacion = function () {
            $scope.abrirPopup($scope.idModalCompensacion);
            $('#calendar-compensacion').fullCalendar('render');
        }
        $scope.cerrarDialogCompensacion = function () {
            $scope.cerrarPopup($scope.idModalCompensacion);
        }
        $scope.abrirDialogHistorialAusencias = function () {
            $scope.abrirPopup($scope.idModalHistorialAusencias);
        }
        $scope.cerrarDialogHistorialAusencias = function () {
            $scope.cerrarPopup($scope.idModalHistorialAusencias);
        }
        $scope.abrirDialogHistorialAusenciaMedica = function () {
            $scope.abrirPopup($scope.idModalHistorialAusenciaMedica);
        }
        $scope.cerrarDialogHistorialAusenciaMedica = function () {
            $scope.cerrarPopup($scope.idModalHistorialAusenciaMedica);
        }
        $scope.abrirDialogTipoAusencia = function () {
            $scope.abrirPopup($scope.idModalTipoAusencia);
        }
        $scope.cerrarDialogTipoAusencia = function () {
            $scope.cerrarPopup($scope.idModalTipoAusencia);
        }
        $scope.abrirDialogRolTurnos = function () {
            $scope.abrirPopup($scope.idModalRolTurnos);
        }
        $scope.cerrarDialogRolTurnos = function () {
            $scope.cerrarPopup($scope.idModalRolTurnos);
        }
        $scope.abrirDialogHistorialTurnos = function () {
            $scope.abrirPopup($scope.idModalHistorialTurnos);
        }
        $scope.cerrarDialogHistorialTurnos = function () {
            $scope.cerrarPopup($scope.idModalHistorialTurnos);
        }
        $scope.abrirDialogHorasExtras = function () {
            $scope.abrirPopup($scope.idModalHorasExtras);
        }
        $scope.cerrarDialogHorasExtras = function () {
            $scope.cerrarPopup($scope.idModalHorasExtras);
        }
        $scope.abrirDialogHistorialHorasExtras = function () {
            $scope.abrirPopup($scope.idModalHistorialHorasExtras);
        }
        $scope.cerrarDialogHistorialHorasExtras = function () {
            $scope.cerrarPopup($scope.idModalHistorialHorasExtras);
        }
        $scope.abrirDialogAnticipoRegular = function () {
            $scope.abrirPopup($scope.idModalAnticipoRegular);
        }
        $scope.cerrarDialogAnticipoRegular = function () {
            $scope.cerrarPopup($scope.idModalAnticipoRegular);
        }
        $scope.abrirDialogPrestamosPersonal = function () {
            $scope.abrirPopup($scope.idModalPrestamosPersonal);
        }
        $scope.cerrarDialogPrestamosPersonal = function () {
            $scope.cerrarPopup($scope.idModalPrestamosPersonal);
        }
        $scope.abrirDialogAdvertencia = function () {
            $scope.abrirPopup($scope.idModalAdvertencia);
        }
        $scope.cerrarDialogAdvertencia = function () {
            $scope.cerrarPopup($scope.idModalAdvertencia);
        }
        $scope.abrirDialogPretamosNuevoTodos = function () {
            $scope.cerrarDialogAdvertencia();
            $scope.abrirPopup($scope.idModalPretamosNuevoTodos);
        }
        $scope.cerrarDialogPretamosNuevoTodos = function () {
            $scope.cerrarPopup($scope.idModalPretamosNuevoTodos);
        }
        $scope.abrirDialogReporteHijos = function () {
            $scope.abrirPopup($scope.idModalReporteHijos);
        }
        $scope.cerrarDialogReporteHijos = function () {
            $scope.cerrarPopup($scope.idModalReporteHijos);
        }
        $scope.abrirDialogReporteVeneficios = function () {
            $scope.abrirPopup($scope.idModalReporteVeneficios);
        }
        $scope.cerrarDialogReporteVeneficios = function () {
            $scope.cerrarPopup($scope.idModalReporteVeneficios);
        }
        $scope.abrirDialogPagoPrestamo = function () {
            $scope.abrirPopup($scope.idModalPagoPrestamo);
        }
        $scope.cerrarDialogPagoPrestamo = function () {
            $scope.cerrarPopup($scope.idModalPagoPrestamo);
        }
        $scope.abrirDialogReporteVacaciones = function () {
            $scope.abrirPopup($scope.idModalReporteVacaciones);
        }
        $scope.cerrarDialogReporteVacaciones = function () {
            $scope.cerrarPopup($scope.idModalReporteVacaciones);
        }
        $scope.abrirDialogReporteBajasMedicas = function () {
            $scope.abrirPopup($scope.idModalReporteBajasMedicas);
        }
        $scope.cerrarDialogReporteBajasMedicas = function () {
            $scope.cerrarPopup($scope.idModalReporteBajasMedicas);
        }
        $scope.abrirDialogReporteRolTurnos = function () {
            $scope.abrirPopup($scope.idModalReporteRolTurnos);
        }
        $scope.cerrarDialogReporteRolTurnos = function () {
            $scope.cerrarPopup($scope.idModalReporteRolTurnos);
        }
        $scope.abrirDialogReporteTurnosDetallado = function () {
            $scope.abrirPopup($scope.idModalReporteTurnosDetallado);
        }
        $scope.cerrarDialogReporteTurnosDetallado = function () {
            $scope.cerrarPopup($scope.idModalReporteTurnosDetallado);
        }
        $scope.abrirDialogViajes = function () {
            $scope.abrirPopup($scope.idModalViajes);
        }
        $scope.cerrarDialogViajes = function () {
            $scope.cerrarPopup($scope.idModalViajes);
        }
        $scope.abrirDialogVisita = function () {
            $scope.abrirPopup($scope.idModalVisita);
        }
        $scope.cerrarDialogVisita = function () {
            $scope.cerrarPopup($scope.idModalVisita);
        }
        $scope.abrirDialogVehiculosViaje = function () {
            $scope.abrirPopup($scope.idModalVehiculosViaje);
        }
        $scope.cerrarDialogVehiculosViaje = function () {
            $scope.cerrarPopup($scope.idModalVehiculosViaje);
        }
        $scope.abrirDialogDestinos = function () {
            $scope.abrirPopup($scope.idModalDestinos);
        }
        $scope.cerrarDialogDestinos = function () {
            $scope.cerrarPopup($scope.idModalDestinos);
        }
        $scope.abrirDialogHistorialViajes = function () {
            $scope.abrirPopup($scope.idModalHistorialViajes);
        }
        $scope.cerrarDialogHistorialViajes = function () {
            $scope.cerrarPopup($scope.idModalHistorialViajes);
        }
        $scope.abrirDialogReporteAusencias = function () {
            $scope.abrirPopup($scope.idModalReporteAusencias);
        }
        $scope.cerrarDialogReporteAusencias = function () {
            $scope.cerrarPopup($scope.idModalReporteAusencias);
        }
        $scope.abrirDialogCertificado = function () {
            $scope.abrirPopup($scope.idModalCertificado);
        }
        $scope.cerrarDialogCertificado = function () {
            $scope.cerrarPopup($scope.idModalCertificado);
        }
        $scope.abrirDialogInstitucion = function () {
            $scope.abrirPopup($scope.idModalInstitucion);
        }
        $scope.cerrarDialogInstitucion = function () {
            $scope.cerrarPopup($scope.idModalInstitucion);
        }


        $scope.button_clicked = false;
        $scope.disableImput = function ($event) {
            if ($event) {
                $scope.button_clicked = false;
                console.log('llegoo check');
            } else {
                $scope.button_clicked = true;
            }
        }
        //nuevo RH
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
        $scope.saveForm = function () {
            //$scope.paciente = paciente;
            console.log($scope.nuevoRH.persona.fecha_nacimiento)
            var imagenPaciente = $scope.nuevoRH.imagen;
            $scope.nuevoRH.fechaFicha = new Date()
            var button = $('#siguiente').text().trim()
            if (button != "Siguiente") {
                blockUI.start();
                if ($scope.nuevoRH.id) {
                    $scope.nuevoRH.persona.fecha_nacimiento = new Date($scope.convertirFecha($scope.nuevoRH.persona.fecha_nacimiento));
                    NuevoRecursoHumano.update({ id_usuario: $scope.nuevoRH.id }, $scope.nuevoRH, function (res) {
                        blockUI.stop();
                        $scope.cerrarDialogRhNuevo();

                        $scope.mostrarMensaje('Actualizado Exitosamente!');
                        $scope.recargarItemsTabla()
                    });
                } else {
                    $scope.nuevoRH.persona.fecha_nacimiento = new Date($scope.convertirFecha($scope.nuevoRH.persona.fecha_nacimiento));
                    $scope.nuevoRH.$save({ id_usuario: 0 }, function (res) {
                        blockUI.stop();
                        $scope.cerrarDialogRhNuevo();

                        $scope.mostrarMensaje('Guardado Exitosamente!');
                        $scope.recargarItemsTabla()
                    }, function (error) {
                        blockUI.stop();
                        $scope.cerrarDialogRhNuevo();

                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                        $scope.recargarItemsTabla()
                    });
                }
            }
        }
        //fun nuevo 

        // recuperar lista principal
        $scope.obtenerRecursosHumanos = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "codigo";
            $scope.paginator.direccion = "asc";
            $scope.dynamicPopoverCargos = {
                templateUrl: 'myPopoverTemplate.html',
            };
            $scope.filtro = { empresa: $scope.usuario.id_empresa, codigo: "", nombres: "", ci: "", campo: "", cargo: "", busquedaEmpresa: "", estado: "", grupo_sanguineo: "" };
            $scope.paginator.callBack = $scope.buscarRecursosHumanos;
            $scope.paginator.getSearch("", $scope.filtro, null);
            blockUI.stop();

        }
        $scope.buscarRecursosHumanos = function () {
            blockUI.start();

            var promesa = RecursosHumanosPaginador($scope.paginator);
            promesa.then(function (dato) {
                $scope.paginator.setPages(dato.paginas);
                $scope.RecursosHumanosEmpleados = dato.pacientes;

                $scope.RecursosHumanosEmpleados.forEach(function (empleado) {
                    empleado.activo = (empleado.activo == 0) ? false : true
                });
                console.log($scope.RecursosHumanosEmpleados[0])
                blockUI.stop();
            });
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
                        paciente.es_empleado = true
                        pacientes.push(paciente);

                        row++;
                        i++;
                        console.log
                    } while (worksheet['A' + row] != undefined);
                    $scope.GuardarEmpleadosRh(pacientes);
                };
                reader.readAsBinaryString(f);
                //console.log('pacientes obtenidos')
            }
        }
        $scope.GuardarEmpleadosRh = function (lstpacientes) {
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
        $scope.fecha_excel_angular = function (fecha_desde_excel) {
            var fecha_minima_angular_indice_excel_1970 = 25569 - 1 //fecha minima angular. el -1 es para ajustar que el resultado da 1 anterior a la fecha real.
            var fecha_excel = new Date(1 / 1 / 1970)
            var diferencia_de_fecha = fecha_desde_excel - fecha_minima_angular_indice_excel_1970
            return fecha_excel.setTime(fecha_excel.getTime() + diferencia_de_fecha * 86400000)
        }

        $scope.modificarEmpleado = function (elpaciente) {
            promesaPaciente = obtenerEmpleadoRh(elpaciente.id)
            promesaPaciente.then(function (dato) {

                if (dato.clase != undefined) {
                    dato.medicoPaciente.tipo_contrato = dato.clase
                }
                $scope.nuevoRH = dato.medicoPaciente
                $scope.nuevoRH.persona.fecha_nacimiento = $scope.fechaATexto($scope.nuevoRH.persona.fecha_nacimiento)
                $scope.seleccionarCargos($scope.nuevoRH.cargos)
            })
            $scope.abrirPopup($scope.idModalRhNuevo);
        }
        $scope.fechaATexto = function (fecha) {
            fech = new Date(fecha)
            fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
            return fecha
            // $scope.fechaAplicacionVacuna = new Date(convertirFecha(fecha))
        }

        $scope.changeActivoEmpleado = function (empleado) {
            console.log(empleado)
            var promesa = UsuarioRecursosHUmanosActivo(empleado)
            promesa.then(function (dato) {
                $scope.mostrarMensaje(dato.mensaje)
            })
        }
        $scope.EliminarUsuarioRh = function (empleado) {
            console.log(empleado)
            empleado.activo = false
            var promesa = UsuarioRecursosHUmanosActivo(empleado)
            promesa.then(function (dato) {
                $scope.cerrarDialogEliminarUsuarioRh()
                $scope.mostrarMensaje(dato.mensaje)
            })
        }
        $scope.eliminarFamiliarRh = function () {
            var promesa = EliminarFamiliarRh($scope.familiar)
            promesa.then(function (dato) {
                $scope.ficha.empleado.familiares.splice($scope.familiar.index, 1);
                $scope.familiar = null
                $scope.cerrarDialogEliminarFamiliarEmpleado()
                $scope.mostrarMensaje(dato.mensaje)
            })
        }
        $scope.eliminarOtroSeguroRh = function (otroSeguro) {
            var promesa = EliminarOtroSeguroRh(otroSeguro)
            promesa.then(function (dato) {
                $scope.ficha.empleado.otrosSeguros.splice(otroSeguro.index, 1);

                // $scope.ficha.empleado.otrosSeguros.splice($scope.ficha.empleado.otrosSeguros.indexOf(otroSeguro.index), 1);
                $scope.otroSeguro = null

                $scope.cerrarDialogEliminarSeguroEmpleado()
                $scope.mostrarMensaje(dato.mensaje)
            })
        }


        $scope.finVerEmpleado = function () {
            var button = $('#siguiente-v').text().trim()
            if (button != "Siguiente") {
                $scope.cerrarDialogVerEmpleado()
            }

        }

        $scope.obtenerDatosFichaUsuario = function (empleado) {
            var promesa = UsuarioRecursosHumanosFicha(empleado.id)
            promesa.then(function (datos) {
                if (datos.ficha) {
                    $scope.ficha = datos.ficha
                    $scope.ficha.empleado.cargo = []
                    /* $scope.empleado.otrosSeguros = datos.ficha */
                    $scope.ficha.fecha_jubilacion = new Date($scope.ficha.fecha_jubilacion)
                    $scope.ficha.empleado.fecha_vence_documento = new Date($scope.ficha.empleado.fecha_vence_documento)
                    $scope.ficha.fecha_jubilacion = $scope.fechaATexto($scope.ficha.fecha_jubilacion)
                    $scope.ficha.empleado.fecha_vence_documento = $scope.fechaATexto($scope.ficha.empleado.fecha_vence_documento)
                    $scope.buscarDepartamento(datos.ficha.empleado.persona.pais)
                    $scope.buscarMunicipios(datos.ficha.empleado.persona.ciudad)
                    $scope.buscarLocalidad(datos.ficha.empleado.persona.provincia)

                    var fechaActual = new Date();
                    var fechaNacimiento = new Date($scope.ficha.empleado.persona.fecha_nacimiento)
                    $scope.ficha.nac_anio = fechaNacimiento.getFullYear()
                    $scope.ficha.nac_dia = fechaNacimiento.getDate()
                    var mesNac = fechaNacimiento.getMonth()
                    $scope.meses.forEach(function (mes, array, index) {
                        if (mes.id == mesNac) {
                            $scope.ficha.nac_mes = mes
                            $scope.getDaysInMonth($scope.ficha.nac_mes.id, $scope.ficha.nac_anio)
                        }
                    });
                    var fecha = new Date()
                    $scope.ficha.fecha_elaboracion = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365);

                    $scope.ficha.empleado.familiares.forEach(function (familiar, index, array) {
                        var fechaActual = new Date()
                        var fechaNacimiento = new Date(familiar.persona.fecha_nacimiento)

                        var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                        familiar.edad = Math.trunc(dato / 365);
                        familiar.eliminado=false
                    });
                    $scope.ficha.empleado.otrosSeguros.forEach(function (otroSeguro, index, array) {
                        otroSeguro.eliminado = false
                    })
                    $scope.seleccionarCargos($scope.ficha.empleado.cargos)
                    $scope.seleccionarDiscapacidades($scope.ficha.empleado.discapacidades)
                    //llenarCargos($scope.cargos)
                } else {

                    $scope.ficha = { empleado: datos.empleado, pacienteReferencia: {} }
                    $scope.ficha.empleado.cargo = []
                    $scope.ficha.empleado.otrosSeguros = []
                    $scope.ficha.empleado.familiares = []
                    $scope.ficha.empleado.persona.correo_electronico = datos.empleado.persona.correo_electronico
                    $scope.seleccionarCargos($scope.ficha.empleado.cargos)
                    $scope.seleccionarDiscapacidades($scope.ficha.empleado.discapacidades)
                    var fechaActual = new Date();
                    $scope.ficha.fecha_elaboracion = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear()
                    var fechaNacimiento = new Date($scope.ficha.empleado.persona.fecha_nacimiento)
                    $scope.ficha.nac_anio = fechaNacimiento.getFullYear()
                    $scope.ficha.nac_dia = fechaNacimiento.getDate()
                    var mesNac = fechaNacimiento.getMonth()
                    $scope.meses.forEach(function (mes, array, index) {
                        if (mes.id == mesNac) {
                            $scope.ficha.nac_mes = mes
                            $scope.getDaysInMonth($scope.ficha.nac_mes.id, $scope.ficha.nac_anio)
                        }
                    });
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365)
                }
                blockUI.stop();
            });

        }
        $scope.seleccionarCargos = function (cargosEmpleado) {
            for (var i = 0; i < $scope.cargos.length; i++) {
                for (var j = 0; j < cargosEmpleado.length; j++) {
                    if ($scope.cargos[i].id == cargosEmpleado[j].id_cargo) {
                        $scope.cargos[i].ticked = true;
                    }
                }
            }
        }

        $scope.llenarCargos = function (cargos) {
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
        $scope.seleccionarDiscapacidades = function (discapacidadesEmpleado) {
            for (var i = 0; i < $scope.discapacidades.length; i++) {
                for (var j = 0; j < discapacidadesEmpleado.length; j++) {
                    if ($scope.discapacidades[i].id == discapacidadesEmpleado[j].id_discapacidad) {
                        $scope.discapacidades[i].ticked = true;
                    }
                }
            }
        }

        $scope.llenarDiscapacidades = function (discapacidades) {
            $scope.discapacidades = [];

            for (var i = 0; i < discapacidades.length; i++) {
                var discapacidade = {
                    nombre: discapacidades[i].nombre,
                    maker: "",
                    ticked: false,
                    id: discapacidades[i].id
                }
                $scope.discapacidades.push(discapacidade);
            }

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
        $scope.saveFormPrerequisito = function (nuevoPrerequisito) {
            blockUI.start();
            // nuevoPrerequisito.fecha_inicio = new Date($scope.convertirFecha(nuevoPrerequisito.fecha_inicio))
            // nuevoPrerequisito.fecha_inicio = nuevoPrerequisito.fecha_inicio.setFullYear(nuevoPrerequisito.fecha_inicio.getFullYear(), nuevoPrerequisito.fecha_inicio.getMonth(), nuevoPrerequisito.fecha_inicio.getDate());
            // nuevoPrerequisito.fecha_vencimiento = nuevoPrerequisito.fechav.setFullYear(nuevoPrerequisito.fechav.getFullYear(), nuevoPrerequisito.fechav.getMonth(), nuevoPrerequisito.fechav.getDate())
            if (nuevoPrerequisito.nombre != undefined && nuevoPrerequisito.vencimiento_mes != undefined) {
                if (nuevoPrerequisito.id != undefined) {
                    nuevoPrerequisito.$save(nuevoPrerequisito, function (res) {

                        $scope.mostrarMensaje(res.mensaje);
                        $scope.cerrarDialogPrerequisitoNuevo();
                        blockUI.stop();
                        $scope.verificarAsignacionPrerequisitos()
                    }, function (error) {
                        $scope.cerrarDialogPrerequisitoNuevo();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                        blockUI.stop();
                    });
                } else {
                    nuevoPrerequisito.$save({ nuevoPrerequisito }, function (res) {
                        $scope.mostrarMensaje(res.mensaje);
                        $scope.cerrarDialogPrerequisitoNuevo();
                        blockUI.stop();
                        $scope.verificarAsignacionPrerequisitos()
                    }, function (error) {
                        $scope.cerrarDialogPrerequisitoNuevo();
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                        blockUI.stop();
                    });
                }
            } else {
                $scope.mostrarMensaje('Los campos Prerequisito Nombre y vencimiento mes son requeridos.')
                blockUI.stop();
            }

        }
        $scope.verificarAsignacionPrerequisitos = function () {
            blockUI.start();
            var requisitos = Prerequisitos()
            requisitos.then(function (prerequisitos) {
                $scope.preRequisitos = prerequisitos.prerequisitos
                filtro = { inicio: 0, fin: 0 }
                var promesa = ListaPrerequisitosPaciente($scope.empleado.id, filtro);
                promesa.then(function (preRequisitos) {
                    $scope.prerequisitosPaciente = preRequisitos.Prerequisitos;
                    $scope.preRequisitos.forEach(function (requisito, index, array) {

                        $scope.prerequisitosPaciente.forEach(function (preRe) {

                            if (requisito.id == preRe.id_prerequisito) {
                                requisito.asignado = true
                            }

                            if (preRe.fecha_entrega != null) {
                                preRe.entregado = true
                            }

                            //Re asignar la fecha de vencimiento si la fecha de inicio cambia.
                            // var fechaContro = new Date(preRe.fecha_vencimiento)
                            // var calculoFechaVencimiento = $scope.calcularFechaVencimientoRequisito(preRe)
                            // fechaContro.setHours(0,0,0,0)
                            // calculoFechaVencimiento.setHours(0,0,0,0)
                            // var a = $scope.fechaATexto(fechaContro)
                            // var b = $scope.fechaATexto(calculoFechaVencimiento)
                            // if(a != b){
                            //     preRe.asignado = true
                            //     preRe.fecha_vencimiento = calculoFechaVencimiento
                            //     PrerequisitoPaciente.save(preRe,function (res) {
                            //         $scope.verificarAsignacionPrerequisitos()
                            //     })
                            // }

                        });

                        if ($scope.prerequisitosPaciente.length == 0) {
                            requisito.asignado = false
                        }

                        if (index == array.length - 1) {
                            blockUI.stop();
                        }

                        // var reducido = $scope.prerequisitosPaciente.reduce(function (anterior,actual,index,array) {
                        //     if(anterior == 0) return actual
                        //     if(anterior.id_prerequisito == actual.id_prerequisito){
                        //         if(anterior.id < actual.id){
                        //             return actual
                        //         }
                        //     }
                        // })
                        // console.log(reducido)
                    });

                    if ($scope.preRequisitos.length == 0) {
                        blockUI.stop();
                    }

                    // var found = $.map(xtra, function(val) {
                    //     if(val.id == 'C' ){

                    //     }
                    // });​
                });
            })
        }
        $scope.diasVencidosPrerequisito = function (fechaVencimiento) {
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
        $scope.obtenerPrerequisito = function () {
            blockUI.start();
            var promesa = ListaDatosPrerequisito();
            promesa.then(function (entidad) {
                $scope.prerequisitos = entidad;
                blockUI.stop();
            });
        }
        $scope.agregarSeguro = function (seguro) {
            seguro.eliminado = false
            $scope.ficha.empleado.otrosSeguros.push(seguro)
            $scope.seguro = { edit: false }
        }

        $scope.calcularEdad = function (familiar) {
            var fechaActual = new Date();
            if (familiar.nac_mes && familiar.nac_anio && familiar.nac_dia) {
                var anio = familiar.nac_anio
                var mes = parseInt(familiar.nac_mes.id)
                var dia = parseInt(familiar.nac_dia)
                var fechaNacimiento = new Date()
                fechaNacimiento.setFullYear(anio, mes, dia)
                var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                familiar.edad = Math.trunc(dato / 365);

            }
        }
        $scope.eliminarSeguro = function (seguro, index) {
            if (seguro.id) {
                seguro.eliminado = true
            } else {
                $scope.ficha.empleado.otrosSeguros.splice(index, 1);
                console.log($scope.ficha.empleado.otrosSeguros)
            }
        }
        $scope.editarSeguro = function (dato, index) {
            $scope.seguro = dato
            $scope.seguro.edit = true
            $scope.seguro.index = index
        }
        $scope.agregarFamiliar = function (familiar) {
            familiar.eliminado = false
            if (parseInt(familiar.nac_mes.id) < 10) {
                familiar.nac_mes.id = "0" + familiar.nac_mes.id
            }
            familiar.persona.fecha_nacimiento = new Date(familiar.nac_anio, parseInt(familiar.nac_mes.id), parseInt(familiar.nac_dia))
            $scope.ficha.empleado.familiares.push(familiar)
            $scope.familiar = { edit: false }
        }
        $scope.eliminarFamiliar = function (familiar, index) {
            if (familiar.id) {
                familiar.eliminado=true
            } else {
                $scope.ficha.empleado.familiares.splice(index, 1);
            }
        }
        $scope.editarFamiliar = function (dato, index) {
            $scope.familiar = dato
            var fechaNacimiento = new Date(dato.persona.fecha_nacimiento)
            $scope.familiar.nac_anio = fechaNacimiento.getFullYear()
            $scope.familiar.nac_dia = fechaNacimiento.getDate()
            var mesNac = fechaNacimiento.getMonth()
            $scope.meses.forEach(function (mes, array, index) {
                if (mes.id == mesNac) {
                    $scope.familiar.nac_mes = mes
                    //$scope.getDaysInMonth($scope.ficha.nac_mes.id,$scope.ficha.nac_anio)
                }
            });
            $scope.familiar.edit = true
            $scope.familiar.index = index
            $scope.abrirDialogNuevoFamiliar()
        }
        $scope.guardarSeguroEditado = function (dato) {
            $scope.ficha.empleado.otrosSeguros[dato.index] = dato
            $scope.seguro = { edit: false }
        }

        $scope.guardarFamiliarEditado = function (dato) {
            $scope.ficha.empleado.familiares[dato.index].persona.fecha_nacimiento = new Date(dato.nac_anio, parseInt(dato.nac_mes.id), parseInt(dato.nac_dia))
            $scope.ficha.empleado.familiares[dato.index] = dato
            $scope.familiar = { edit: false }
            $scope.cerrarDialogNuevoFamiliar()
        }
        //RECUPERAR TIPOS FICHA 
        $scope.recuperarDatosTipo = function () {
            $scope.obtenerExpeditos()
            $scope.obtenerTipoExpeditos()
            $scope.obtenerEstadoCivil()
            $scope.obtenerNacionalidades()
            //$scope.obtenerDepartamentos()
            //$scope.obtenerProvicias()
            //$scope.obtenerLocalidades()
            $scope.obtenerTiposContratos()
            $scope.obtenerTiposPersonales()
            $scope.obtenerCargasHorarios()
            $scope.obtenerAreas()
            $scope.obtenerUbicacion()
            $scope.obtenerSegurosSalud()
            $scope.obtenerLugarSegurosSalud()
            $scope.obtenerAporteSeguroLargoPlazo()
            $scope.obtenerTipoOtrosSeguros()
            $scope.obtenerFamiliaRelacion()
            $scope.obtenerBancos()
            $scope.obtenerMeses()
            $scope.obtenerAnios()
            $scope.obtenerCargos()
            $scope.obtenerDiscapacidades()
            $scope.obtenerGrados()
            $scope.obtenerTitulos()
            $scope.obtenerInstituciones()
            $scope.obtenerCapacidadesIE()
            $scope.obtenerLogrosIE()

        }
        $scope.obtenerGrados = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_GRA");
            promesa.then(function (entidad) {
                $scope.grados = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerTitulos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TITL");
            promesa.then(function (entidad) {
                $scope.titulos = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerInstituciones = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_INST");
            promesa.then(function (entidad) {
                $scope.instituciones = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerCapacidadesIE = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TCIE");
            promesa.then(function (entidad) {
                $scope.capacidadesIE = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerLogrosIE = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TLIE");
            promesa.then(function (entidad) {
                $scope.logrosIE = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerHistorialContratos = function (empleado) {
            blockUI.start();
            var promesa = UsuarioRhHistorialFicha(empleado.id);
            promesa.then(function (entidad) {
                $scope.historialFichaEmpleado = entidad
                $scope.llenarHistoricoCertificado(entidad)
                blockUI.stop();
            });
        }

        // $scope.fechacontratos = [{ 'name': '10/01/2000 - 01/01/2002' }, { 'name': '10/01/2000 - 01/01/2002' }, { 'name': '10/01/2000 - 01/01/2002' }];
        $scope.obtenerCargos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_CARGO");
            promesa.then(function (entidad) {
                var cargos = entidad.clases
                $scope.listaCargos=entidad
                $scope.llenarCargos(cargos)
                blockUI.stop();
            });
        }
        $scope.obtenerDiscapacidades = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_DISC");
            promesa.then(function (entidad) {
                var discapacidades = entidad.clases
                $scope.llenarDiscapacidades(discapacidades)
                blockUI.stop();
            });
        }
        $scope.obtenerExpeditos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_EXP");
            promesa.then(function (entidad) {
                $scope.tipoExpedido = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerTipoExpeditos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TEXP");
            promesa.then(function (entidad) {
                $scope.tipoDocumento = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerEstadoCivil = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_EC");
            promesa.then(function (entidad) {
                $scope.estadosCiviles = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerNacionalidades = function () {
            blockUI.start();
            var promesa = ClasesTipo("NAC");
            promesa.then(function (entidad) {
                $scope.nacionalidades = entidad
                blockUI.stop();
            });
        }
        /* $scope.obtenerDepartamentos = function () {
            blockUI.start();
            var promesa = ClasesTipo("DEP");
            promesa.then(function (entidad) {
                $scope.departamentos = entidad.clases
                blockUI.stop();
            });
        } */
        /*   $scope.obtenerProvicias = function () {
              blockUI.start();
              var promesa = ClasesTipo("MUN");
              promesa.then(function (entidad) {
                  $scope.provincias = entidad.clases
                  blockUI.stop();
              });
          } */
        $scope.buscarDepartamento = function (ciudad) {
            if (ciudad) {
                var nombre_corto = '-' + ciudad.nombre_corto;
                var promesa = Paises(nombre_corto);
                promesa.then(function (entidades) {
                    $scope.departamentos = entidades;
                    if (entidades.length === 0) {
                        $scope.provincias = []
                        $scope.localidades = []
                    }
                });
            }
        }
        $scope.buscarMunicipios = function (departamento) {
            if (departamento) {
                var idDepartamento = departamento.id + '-' + departamento.nombre_corto
                var nombre_corto = idDepartamento.split('-')[1];
                var promesa = Paises(nombre_corto + "M");
                promesa.then(function (entidades) {
                    $scope.provincias = entidades;
                    if (entidades.length === 0) {
                        $scope.localidades = []
                    }
                });
            }
        }
        $scope.buscarLocalidad = function (provincia) {
            if (provincia) {
                var nombre_corto = provincia.nombre_corto.split('-')[1];
                var nombre_corto = '-' + nombre_corto
                var promesa = Paises(nombre_corto + "L");
                promesa.then(function (entidades) {
                    $scope.localidades = entidades;
                });
            }
        }
        /*  $scope.obtenerLocalidades = function () {
             blockUI.start();
             var promesa = ClasesTipo("LOC");
             promesa.then(function (entidad) {
                 $scope.localidades = entidad.clases
                 blockUI.stop();
             });
         } */
        $scope.obtenerTiposContratos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TC");
            promesa.then(function (entidad) {
                $scope.tiposContratos = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerTiposPersonales = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TP");
            promesa.then(function (entidad) {
                $scope.tiposPersonales = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerCargasHorarios = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_CH");
            promesa.then(function (entidad) {
                $scope.cargasHorarios = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerAreas = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_AREA");
            promesa.then(function (entidad) {
                $scope.listaAreas = entidad
                blockUI.stop();
            });
        }

        $scope.obtenerUbicacion = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_UBI");
            promesa.then(function (entidad) {
                $scope.ubicaciones = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerSegurosSalud = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_SS");
            promesa.then(function (entidad) {
                $scope.segurosSalud = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerLugarSegurosSalud = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_LSS");
            promesa.then(function (entidad) {
                $scope.LugaresSegurosSalud = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerAporteSeguroLargoPlazo = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_ASLP");
            promesa.then(function (entidad) {
                $scope.aportesSeguroLargoPlazo = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerTipoOtrosSeguros = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_OST");
            promesa.then(function (entidad) {
                $scope.OtrosSegurosTipos = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerBancos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_BAN");
            promesa.then(function (entidad) {
                $scope.bancos = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerFamiliaRelacion = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_REL");
            promesa.then(function (entidad) {
                $scope.relaciones = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerMeses = function () {
            $scope.meses = [{ id: 0, nombre: "Enero" }, { id: 1, nombre: "Febrero" }, { id: 2, nombre: "Marzo" }, { id: 3, nombre: "Abril" }, { id: 4, nombre: "Mayo" }, { id: 5, nombre: "Junio" }, { id: 6, nombre: "Julio" }, { id: 7, nombre: "Agosto" },
            { id: 8, nombre: "Septiembre" }, { id: 9, nombre: "Octubre" }, { id: 10, nombre: "Noviembre" }, { id: 11, nombre: "Diciembre" }];
        }

        $scope.obtenerAnios = function (startYear) {
            var currentYear = new Date().getFullYear(), years = [];
            startYear = startYear || 1980;

            while (startYear <= currentYear) {
                years.push(startYear++);
            }

            $scope.listYears = years;
        }
        $scope.getDaysInMonth = function (month, year) {
            // Here January is 1 based
            //Day 0 is the last day in the previous month
            var dias = new Date(year, month, 0).getDate();
            var listaDias = []
            for (let i = 1; i <= dias; i++) {
                listaDias.push(i)
                if (i == dias) {
                    $scope.listaDias = listaDias
                }
            }
            // Here January is 0 based
            // return new Date(year, month+1, 0).getDate();

        };
        //FIN RECUPERAR TIPOS FICHA 

        $scope.guardarFichaTecnica = function (valido, ficha, save) {

            if (save) {
                if (ficha.empleado.persona.fecha_nacimiento) {
                    ficha.empleado.persona.fecha_nacimiento = new Date(ficha.nac_anio, parseInt(ficha.nac_mes.id), parseInt(ficha.nac_dia))
                }
                if (ficha.fecha_elaboracion) {
                    ficha.fecha_elaboracion = new Date($scope.convertirFecha(ficha.fecha_elaboracion));
                }
                if (ficha.fecha_inicio2) {
                    ficha.fecha_inicio2 = new Date($scope.convertirFecha(ficha.fecha_inicio2));
                }
                if (ficha.fecha_fin2) {
                    ficha.fecha_fin2 = new Date($scope.convertirFecha(ficha.fecha_fin2));
                }
                if (ficha.fecha_jubilacion) {
                    ficha.fecha_jubilacion = new Date($scope.convertirFecha(ficha.fecha_jubilacion));
                }
                if (ficha.empleado.fecha_vence_documento) { ficha.empleado.fecha_vence_documento = new Date($scope.convertirFecha(ficha.empleado.fecha_vence_documento)); }
                var f = document.getElementById('id-contrato').files[0],

                    r = new FileReader();

                if (f) {
                    r.onloadend = function (e) {
                        ficha.contrato2 = { name: "", data: null }
                        ficha.contrato2.name = ficha.contrato[0].name
                        ficha.contrato2.data = e.target.result;

                        var promesa = CrearEmpleadoFicha(ficha);
                        promesa.then(function (dato) {
                            $scope.cerrarDialogEmpleado()
                            $scope.recargarItemsTabla()
                            $scope.mostrarMensaje(dato.message)
                        })
                        //send your binary data via $http or $resource or do anything else with it
                    }

                    r.readAsBinaryString(f);
                } else {
                    var promesa = CrearEmpleadoFicha(ficha);
                    promesa.then(function (dato) {
                        $scope.cerrarDialogEmpleado()
                        $scope.recargarItemsTabla()
                        $scope.mostrarMensaje(dato.message)
                    })
                }
            } else {

                var button = $('#siguiente-f').text().trim();
                if (button != "Siguiente") {
                    ficha.empleado.persona.fecha_nacimiento = new Date(ficha.nac_anio, parseInt(ficha.nac_mes.id), parseInt(ficha.nac_dia))
                    ficha.fecha_elaboracion = new Date($scope.convertirFecha(ficha.fecha_elaboracion));
                    ficha.fecha_inicio2 = new Date($scope.convertirFecha(ficha.fecha_inicio2));
                    ficha.fecha_fin2 = new Date($scope.convertirFecha(ficha.fecha_fin2));
                    ficha.fecha_jubilacion = new Date($scope.convertirFecha(ficha.fecha_jubilacion));
                    ficha.empleado.fecha_vence_documento = new Date($scope.convertirFecha(ficha.empleado.fecha_vence_documento));
                    var promesa = CrearEmpleadoFicha(ficha);
                    promesa.then(function (dato) {
                        $scope.cerrarDialogEmpleado()
                        $scope.recargarItemsTabla()
                        $scope.mostrarMensaje(dato.message)
                    })
                }
            }

        }
        $scope.actualizarPrerequisito = function (prerequisitos) {
            var promesa = ActualizarPrerequisito(prerequisitos)
            promesa.then(function (dato) {
                /* if (prerequisitos instanceof Array) {
                    
                } */
                $scope.cerrarDialogInicioPreRequisitos()
                $scope.mostrarMensaje(dato.message)
            })
        }
        $scope.completarCamposLaboral = function (ficha) {
            if (ficha.tipoContrato.nombre == "OBRA") {
                $scope.tiposPersonales.clases.forEach(function (tipo) {
                    if (tipo.nombre == "CAMPO") {
                        ficha.tipoPersonal = tipo
                    }

                });
                ficha.area = {}
                ficha.ubicacion = {}

            }
            if (ficha.tipoContrato.nombre == "INDEFINIDO") {
                $scope.tiposPersonales.clases.forEach(function (tipo) {
                    if (tipo.nombre == "OFICINA") {
                        ficha.tipoPersonal = tipo
                    }

                });
                $scope.listaAreas.clases.forEach(function (tipo) {
                    if (tipo.nombre == "ESS-SCZ") {
                        ficha.area = tipo
                    }

                });
                $scope.ubicaciones.clases.forEach(function (tipo) {
                    if (tipo.nombre == "ESS-SCZ") {
                        ficha.ubicacion = tipo
                    }

                });
            }

        }
        //find ficha
        //logica hoja de vida
        //FORMACION ACADEMICA
        $scope.agregarFormacionAcademica = function (formacion) {
            $scope.hojaVida.formacionesAcademicas.push(formacion)
            $scope.formacionAcademica = { edit: false, eliminado: false }
        }
        $scope.guardarFormacionAcademicaEditada = function (formacion) {
            $scope.formacionAcademica = { edit: false, eliminado: false }
        }

        $scope.editarFomracionAcademica = function (formacion, index) {
            $scope.formacionAcademica = formacion
            $scope.formacionAcademica.edit = true
        }
        $scope.eliminarFomracionAcademica = function (formacion) {
            formacion.eliminado = true;
        }
        //FORMACION ACADEMICA
        //EXPERIENCIA LABORAL
        $scope.agregarExperienciaLaboral = function (experienciaLaboral) {
            experienciaLaboral.fecha_inicio = new Date(convertirFecha(experienciaLaboral.fecha_inicio))
            experienciaLaboral.fecha_fin = new Date(convertirFecha(experienciaLaboral.fecha_fin))
            experienciaLaboral.fecha_inicioTexto = $scope.fechaATexto(experienciaLaboral.fecha_inicio)
            experienciaLaboral.fecha_finTexto = $scope.fechaATexto(experienciaLaboral.fecha_fin)
            $scope.hojaVida.experienciasLaborales.push(experienciaLaboral)
            $scope.experienciaLaboral = { edit: false, eliminado: false }
        }
        $scope.guardarExperienciaLaboralEditada = function (experienciaLaboral) {
            experienciaLaboral.fecha_inicio = new Date(convertirFecha(experienciaLaboral.fecha_inicio))
            experienciaLaboral.fecha_fin = new Date(convertirFecha(experienciaLaboral.fecha_fin))
            experienciaLaboral.fecha_inicioTexto = $scope.fechaATexto(experienciaLaboral.fecha_inicio)
            experienciaLaboral.fecha_finTexto = $scope.fechaATexto(experienciaLaboral.fecha_fin)
            $scope.experienciaLaboral = { edit: false, eliminado: false }
        }
        $scope.editarExperienciaLaboral = function (experienciaLaboral) {
            experienciaLaboral.fecha_inicio = $scope.fechaATexto(experienciaLaboral.fecha_inicio)
            experienciaLaboral.fecha_fin = $scope.fechaATexto(experienciaLaboral.fecha_fin)
            $scope.experienciaLaboral = experienciaLaboral
            $scope.experienciaLaboral.edit = true
        }
        $scope.eliminarExperienciaLaboral = function (experienciaLaboral) {
            experienciaLaboral.eliminado = true;
        }
        //EXPERIENCIA LABORAL
        //CAPACIDADES INTERNOS EXTERNOS
        $scope.agregarCapacidadHojaVida = function (capacidad) {
            capacidad.fecha = new Date(convertirFecha(capacidad.fecha))
            capacidad.fechaTexto = $scope.fechaATexto(capacidad.fecha)
            $scope.hojaVida.capacidades.push(capacidad)
            $scope.capacidad = { edit: false, eliminado: false }
        }
        $scope.guardarCapacidadHojaVidaEditada = function (capacidad) {
            capacidad.fecha = new Date(convertirFecha(capacidad.fecha))
            capacidad.fechaTexto = $scope.fechaATexto(capacidad.fecha)
            $scope.capacidad = { edit: false, eliminado: false }
        }
        $scope.editarCapacidadHojaVida = function (capacidad) {
            capacidad.fecha = $scope.fechaATexto(capacidad.fecha)
            $scope.capacidad = capacidad
            $scope.capacidad.edit = true
        }
        $scope.eliminarCapacidadHojaVida = function (capacidad) {
            capacidad.eliminado = true;
        }
        //CAPACIDADES INTERNOS EXTERNOS
        //LOGROS INTERNOS EXTERNOS
        $scope.agregarLogroHojaVida = function (logro) {
            logro.fecha = new Date(convertirFecha(logro.fecha))
            logro.fechaTexto = $scope.fechaATexto(logro.fecha)
            $scope.hojaVida.logros.push(logro)
            $scope.logro = { edit: false, eliminado: false }
        }
        $scope.guardarLogroHojaVidaEditada = function (logro) {
            logro.fecha = new Date(convertirFecha(logro.fecha))
            logro.fechaTexto = $scope.fechaATexto(logro.fecha)
            $scope.logro = { edit: false, eliminado: false }
        }
        $scope.editarLogroHojaVida = function (logro) {
            logro.fecha = $scope.fechaATexto(logro.fecha)
            $scope.logro = logro
            $scope.logro.edit = true
        }
        $scope.eliminarLogroHojaVida = function (logro) {
            logro.eliminado = true;
        }
        //LOGROS INTERNOS EXTERNOS

        $scope.GuardarHojaDeVida = function () {

            var button = $('#siguiente-s').text().trim()
            if (button != "Siguiente") {

                var promesa = GuardarEmpleadoHojaVida($scope.empleado.id, $scope.hojaVida)
                promesa.then(function (dato) {
                    $scope.mostrarMensaje(dato.mensaje)
                    $scope.recargarItemsTabla()
                })
            }
        }
        $scope.GuardarHojaDeVidaDirecto = function () {
            var promesa = GuardarEmpleadoHojaVida($scope.empleado.id, $scope.hojaVida)
            promesa.then(function (dato) {
                $scope.mostrarMensaje(dato.mensaje)
                $scope.recargarItemsTabla()
            })
        }
        //fin hoja de vida
        //certificado ficha
        $scope.llenarHistoricoCertificado = function (historialContratos) {
            $scope.historialContratos = [];

            for (var i = 0; i < historialContratos.length; i++) {
                var fechaFin = ""
                var fechaInicio = $scope.fechaATexto(historialContratos[i].fecha_inicio)
                if (historialContratos[i].fecha_fin != null) {
                    var fechaFin = $scope.fechaATexto(historialContratos[i].fecha_fin)
                }
                var Contrato = {
                    nombre: fechaInicio + "-" + fechaFin,
                    maker: "",
                    ticked: false,
                    id: historialContratos[i].id
                }
                $scope.historialContratos.push(Contrato);
            }

        }
        $scope.generarPdfCertificado = function (certificado) {
            var doc = new PDFDocument({ size: [612, 792], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
            var stream = doc.pipe(blobStream());
            if (certificado.tipo == 0) {                              // draw some text
                $scope.dibujarPdfCertificadoHojaVida(doc, certificado);

            } else {
                $scope.dibujarPdfCertificadoPrestamo(doc, certificado);
            }
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
        }

        $scope.dibujarPdfCertificadoHojaVida = function (doc, certificado) {
            console.log($scope.usuario)
            var fecha = new Date()
            var textomes = ""
            var textocargos = ""
            var mes2 = fecha.getMonth()
            $scope.meses.forEach(function (mes) {
                if (mes.id == mes2) {
                    textomes = mes.nombre
                }
            });
            $scope.ficha.empleado.cargo.forEach(function (cargo) {
                if (textocargos == "") {
                    textocargos = cargo.nombre
                } else {
                    textocargos = textocargos + ", " + cargo.nombre
                }

            });
            doc.font('Times-Roman', 12);

            doc.text("Santa Cruz, " + fecha.getDate() + " de " + textomes + " de " + fecha.getFullYear(), 0, 75, { align: "center" });
            doc.font('Times-Roman', 24);
            doc.text("CERTIFICADO DE TRABAJO", 0, 150, { align: "center" });
            doc.font('Times-Roman', 13);
            var texto = "EMSERSO SA., certifica que " + $scope.ficha.empleado.persona.nombre_completo + " con CI." + $scope.ficha.empleado.persona.ci + " " + $scope.ficha.empleado.extension.nombre + ", trabajó (a) como " + textocargos + ", durante los siguientes periodos:"
            doc.text(texto, 100, 230, { width: 412, align: 'left', indent: 0, columns: 1, height: 300, ellipsis: true });
            var f = 250;
            for (let i = 0; i < certificado.historialContratos.length; i++) {
                const element = certificado.historialContratos[i].nombre;
                var textoFecha = element.split("-")
                doc.text("Desde el " + textoFecha[0] + " al " + textoFecha[1], 100, f, { width: 412, align: 'left', indent: 0, columns: 1, height: 300, ellipsis: true });
                f = f + 20
            }
            doc.text("Es cuanto certifico para los fines que convengan al interesado.", 100, f + 20, { align: "left" });
            doc.text("Lic. Rosangela Velasques S.", 100, 695);
            doc.text("JEFA DE RECURSOS HUMANOS", 100, 715);
        }
        $scope.dibujarPdfCertificadoPrestamo = function (doc, certificado) {
            console.log($scope.usuario)
            var fecha = new Date()
            var textomes = ""
            var textocargos = ""
            var textoFechas = ""
            var mes2 = fecha.getMonth()
            $scope.meses.forEach(function (mes) {
                if (mes.id == mes2) {
                    textomes = mes.nombre
                }
            });
            $scope.ficha.empleado.cargo.forEach(function (cargo) {
                if (textocargos == "") {
                    textocargos = cargo.nombre
                } else {
                    textocargos = textocargos + ", " + cargo.nombre
                }

            });
            for (let i = 0; i < certificado.historialContratos.length; i++) {
                const element = certificado.historialContratos[i].nombre;
                var textoFecha = element.split("-")
                var ini = textoFecha[0].split("/")
                var fin = textoFecha[1].split("/")

                fechaIni = new Date(ini[0], ini[1], ini[2])
                var fechaFin = new Date(fin[0], fin[1], fin[2])
                var mesIni = fechaIni.getMonth()
                var mesFin = fechaFin.getMonth()
                $scope.meses.forEach(function (mes) {
                    if (mes.id == mesIni) {
                        mesIni = mes.nombre
                    }
                });
                $scope.meses.forEach(function (mes) {
                    if (mes.id == mesFin) {
                        mesFin = mes.nombre
                    }
                    if (textoFecha[1] == "") {
                        mesFin = ""
                    }
                });

                if (textoFechas == "") {
                    if (mesFin != "") {
                        textoFechas = "el " + fechaIni.getDate() + " de " + mesIni + " de " + fechaIni.getFullYear() + " al " + fechaFin.getDate() + " de " + mesFin + " de " + fechaFin.getFullYear()
                    } else {
                        textoFechas = "el " + fechaIni.getDate() + " de " + mesIni + " de " + fechaIni.getFullYear() + "."
                    }
                } else {
                    if (mesFin != "") {
                        textoFechas = textoFechas + ",  renovando contrato con la empresa a partir del " + fechaIni.getDate() + " de " + mesIni + " de " + fechaIni.getFullYear() + " al " + fechaFin.getDate() + " de " + mesFin + " de " + fechaFin.getFullYear()
                    } else {
                        textoFechas = textoFechas + ",  renovando contrato con la empresa a partir del " + fechaIni.getDate() + " de " + mesIni + " de " + fechaIni.getFullYear()
                    }
                }
                /*  texto"Desde el " + textoFecha[0] + " al " + textoFecha[1] */
                if (i === (certificado.historialContratos.length - 1)) {
                    textoFechas = textoFechas + ". Percibiendo un sueldo aproximado mensual de Bs." + $scope.ficha.haber_basico + ".- (" + $scope.ficha.haber_basico_literal + ")"
                }
            }
            doc.font('Times-Roman', 12);

            doc.text("Santa Cruz, " + fecha.getDate() + " de " + textomes + " de " + fecha.getFullYear(), 0, 75, { align: "center" });
            doc.font('Times-Roman', 24);
            doc.text("CERTIFICADO DE TRABAJO", 0, 150, { align: "center" });
            doc.font('Times-Roman', 13);
            var texto = "EMSERSO SA., certifica que " + $scope.ficha.empleado.persona.nombre_completo + " con CI." + $scope.ficha.empleado.persona.ci + " " + $scope.ficha.empleado.extension.nombre + ", trabaja en nuestra empresa como " + textocargos + " desde " + textoFechas

            doc.text(texto, 100, 230, {
                width: 412,
                align: 'justify',
                indent: 0,
                columns: 1,
                lineGap: 10,
                wordSpacing: 1,
                height: 300,
                ellipsis: true,

            })

            doc.moveDown(2)

            doc.text("Es cuanto certifico para los fines que convengan al interesado.", { align: "left" });
            doc.text("Lic. Rosangela Velasques S.", 100, 695);
            doc.text("JEFA DE RECURSOS HUMANOS", 100, 715);

        }
        //fin certificado ficha
        $scope.inicio()


    });
