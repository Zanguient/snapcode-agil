angular.module('agil.controladores')

    .controller('ControladorRecursosHumanos', function ($scope, $sce, $localStorage, $location, $templateCache, $route, blockUI, ListaDatosGenero, NuevoRecursoHumano, RecursosHumanosPaginador, Paginator,
        FieldViewer, EmpleadoEmpresa, obtenerEmpleadoRh, UsuarioRecursosHUmanosActivo, Prerequisito, ListaDatosPrerequisito, Prerequisitos, ListaPrerequisitosPaciente, ActualizarPrerequisito, UsuarioRecursosHumanosFicha,
        ClasesTipo, Clases, Paises, CrearEmpleadoFicha, EliminarOtroSeguroRh, EliminarFamiliarRh, PrerequisitoPaciente, PrerequisitosHistorial, UsuarioRhHistorialFicha, ObtenerEmpleadoHojaVida, GuardarEmpleadoHojaVida, CrearPrestamo,
        ObtenerListaPrestamo, CrearRolTurno, CrearPagoPrestamo, VerificarUsuarioEmpresa, EditarPrestamo, ListaEmpleadosRrhh, CrearHorasExtra, HistorialHorasExtra, ListaRolTurnos, ValidarCodigoCuentaEmpleado, $timeout, DatosCapacidadesImpresion, NuevoAnticipoEmpleado,
        ListaAnticiposEmpleado, CrearNuevosAnticiposEmpleados, ActualizarAnticipoEmpleado, NuevaAusenciaEmpleado, HistorialEmpleadoAusencias, HistorialEmpresaEmpleadosAusencias, NuevaVacacionEmpleado, HistorialEmpleadoVacaciones, HistorialEmpresaVacaciones, NuevoFeriado,
        ListaFeriados, GuardarClasesAusencias, Tipos, ListaBancos, ConfiguracionesVacacion, HistorialGestionesVacacion, GuardarTr3, ListaTr3Empresa, GuardarHistorialVacacion, CrearBeneficioSocial, ListaBeneficiosEmpleado) {
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
        $scope.idModalBitacoraFicha = "dialog-nueva-deduccion";
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
        $scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';
        $scope.IdModalVerificarCuentaRrhh = 'modal-verificar-cuenta-Rrhh';
        $scope.idModalImpresionHojaVida = 'dialog-impresion-hoja-vida';
        $scope.idModalNuevoAnticipoRegularTodos = 'dialog-nuevo-anticipo-regular-todos';
        $scope.idModalTr3BancoMsc = 'modal-tr3-banco-msc'
        $scope.idModalTr3BancoUnion = 'modal-tr3-banco-union'
        $scope.idModalHistorialTr3 = 'modal-historial-tr3'
        $scope.idModalConfirmarDesabilitacion = 'modal-confirmar-desabilitacion'
        $scope.idModalReingresoEmpleado = 'modal-reingreso-empleado'
        $scope.idModalHistorialBeneficios = "dialog-historial-beneficio_social"
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
                $scope.idModalMotivoRetiro, $scope.idModalDetalleVacaciones, $scope.idModalOtroIngreso, $scope.idModalBitacoraFicha,
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
                $scope.idModalEditarPrerequisito, $scope.idModalDialogConfirmacionEntregaAdelantado, $scope.IdEntregaPrerequisito, $scope.IdModalVerificarCuenta, $scope.idModalImpresionHojaVida, $scope.idModalNuevoAnticipoRegularTodos,
                $scope.idModalTr3BancoMsc, $scope.idModalTr3BancoUnion, $scope.idModalHistorialTr3, $scope.IdModalVerificarCuentaRrhh, $scope.idModalConfirmarDesabilitacion, $scope.idModalReingresoEmpleado,
                $scope.idModalHistorialBeneficios);
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
            $scope.eliminarPopup($scope.idModalBitacoraFicha)
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
            $scope.eliminarPopup($scope.IdModalVerificarCuenta)
            $scope.eliminarPopup($scope.idModalImpresionHojaVida)
            $scope.eliminarPopup($scope.idModalNuevoAnticipoRegularTodos)
            $scope.eliminarPopup($scope.idEliminarUsuarioRh)
            $scope.eliminarPopup($scope.idModalTr3BancoMsc)
            $scope.eliminarPopup($scope.idModalTr3BancoUnion)
            $scope.eliminarPopup($scope.idModalHistorialTr3)
            $scope.eliminarPopup($scope.IdModalVerificarCuentaRrhh)
            $scope.eliminarPopup($scope.idModalConfirmarDesabilitacion)
            $scope.eliminarPopup($scope.idModalReingresoEmpleado)
            $scope.eliminarPopup($scope.idModalHistorialBeneficios)
        });
        $scope.inicio = function () {
            $scope.listYearsAnticipo = $scope.obtenerAnios(2017)
            $scope.obtenerGenero();
            $scope.obtenerRecursosHumanos();
            /*   $scope.obtenerPrerequisito(); */
            $scope.recuperarDatosTipo()
            $scope.empleadosSeleccionados = []
            $scope.listaBancos()
            $scope.obtenerConfiguracionVacaciones()
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
        $scope.abrirModalHistorialTr3 = function (banco, tipo) {
            $scope.tipoBanco = tipo
            var promesa = ListaTr3Empresa($scope.usuario.id_empresa, banco.nombre)
            promesa.then(function (dato) {
                $scope.historialTr3 = dato
                $scope.abrirPopup($scope.idModalHistorialTr3)
            })

        }
        $scope.abrirModalBeneficioSicial = function () {
            var promesa = ListaBeneficiosEmpleado($scope.empleado.ficha.id)
            promesa.then(function (dato) {
                $scope.listabeneficios = dato
                $scope.abrirPopup($scope.idModalHistorialBeneficios)
            })

        }
        $scope.cerrarModalBeneficioSicial = function () {
            $scope.cerrarPopup($scope.idModalHistorialBeneficios)
        }

        $scope.cerrarModalHistorialTr3 = function () {
            $scope.cerrarPopup($scope.idModalHistorialTr3)
        }
        $scope.abrirModalTr3BancoMsc = function () {
            $scope.abrirPopup($scope.idModalTr3BancoMsc)
        }
        $scope.cerrarModalTr3BancoMsc = function () {
            $scope.cerrarPopup($scope.idModalTr3BancoMsc)
        }
        $scope.abrirModalTr3BancoUnion = function () {
            $scope.abrirPopup($scope.idModalTr3BancoUnion)
        }
        $scope.cerrarModalTr3BancoUnion = function () {
            $scope.cerrarPopup($scope.idModalTr3BancoUnion)
        }
        $scope.abrirModalbanco = function (banco) {
            $scope.tr3 = { anticipos: $scope.anticiposTr3, tipo: "" }
            $scope.datosBanco = banco
            if (banco.nombre == "Banco Mercantil Santa Cruz") {
                $scope.tr3.tipo = "MSC"
                $scope.abrirModalTr3BancoMsc()
            }
            if (banco.nombre == "Banco Unión") {
                $scope.tr3.tipo = "BU"
                $scope.abrirModalTr3BancoUnion()
            }
        }
        $scope.abrirModalImprimirHojaVida = function () {
            $scope.filtroCap = { inicio: "", fin: "", capacidadInterna: "" }
            $scope.abrirPopup($scope.idModalImpresionHojaVida)
        }
        $scope.cerrarModalImprimirHojaVida = function () {
            $scope.cerrarPopup($scope.idModalImpresionHojaVida)
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
            $scope.steps = [{ cabeza: "cabeza-nuevo-datos-personales", cuerpo: "cuerpo-nuevo-datos-personales" },
            { cabeza: "cabeza-nuevo-datos-comple", cuerpo: "cuerpo-nuevo-datos-comple" },
            { cabeza: "cabeza-nuevo-datos-laborales", cuerpo: "cuerpo-nuevo-datos-laborales" }

            ]
            $scope.nuevoRH = new NuevoRecursoHumano({ persona: { imagen: "img/icon-user-default.png" }, id_empresa: $scope.usuario.id_empresa, es_empleado: true, activoCopiaCodigo: true });
            $scope.abrirPopup($scope.idModalRhNuevo);
        }
        $scope.cerrarDialogRhNuevo = function () {

            $scope.cerrarPopup($scope.idModalRhNuevo);
        }
        $scope.cerrarDialogEliminarUsuarioRh = function () {
            $scope.cerrarPopup($scope.idEliminarUsuarioRh);
        }
        $scope.abrirDialogEliminarUsuarioRh = function (empleado) {
            $scope.empleado = empleado
            if (empleado.activo) {
                $scope.abrirPopup($scope.idEliminarUsuarioRh);
            }

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
            if (empleado.activo) {
                $scope.empleado = empleado;
                $scope.verificarAsignacionPrerequisitos()

                $scope.abrirPopup($scope.idModalPrerequisitos);
            }
        }
        $scope.cerrarIdModalDialogPreRequisitos = function () {
            $scope.cerrarPopup($scope.idModalPrerequisitos);
        }
        $scope.abrirDialogEmpleado = function (empleado) {
            if (empleado.activo) {
                $scope.steps = [{ cabeza: "stepDatosPersonales", cuerpo: "datos-personales" },
                { cabeza: "stepDatosLaborales", cuerpo: "ficha-datos-laborales" },
                { cabeza: "stepdatosAfiliacion", cuerpo: "ficha-seguros" },
                { cabeza: "stepDatosFamiliares", cuerpo: "ficha-familia" }]
                $scope.obtenerDatosFichaUsuario(empleado);
                $scope.empleado = empleado


                $scope.abrirPopup($scope.idModalEmpleado);
            }
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
            $scope.clase = { pais: $scope.ficha.empleado.persona.pais }
            var promesa = ClasesTipo("DEP");
            promesa.then(function (entidad) {
                $scope.tipo_edicion2 = entidad
                $scope.abrirPopup($scope.idModalDepartamentoEstado);
            })

        }
        $scope.cerrarDialogDepartamentoEstado = function () {
            $scope.cerrarPopup($scope.idModalDepartamentoEstado);
        }
        $scope.abrirDialogProvincia = function () {
            $scope.clase = { departamento: $scope.ficha.empleado.persona.ciudad }

            var promesa = ClasesTipo("MUN");
            promesa.then(function (entidad) {
                $scope.tipo_edicion2 = entidad
                $scope.abrirPopup($scope.idModalProvincia);
            })

        }
        $scope.cerrarDialogProvincia = function () {
            $scope.cerrarPopup($scope.idModalProvincia);
        }
        $scope.abrirDialogLocalidad = function () {
            $scope.clase = { provincia: $scope.ficha.empleado.persona.provincia }

            var promesa = ClasesTipo("LOC");
            promesa.then(function (entidad) {
                $scope.tipo_edicion2 = entidad
                $scope.abrirPopup($scope.idModalLocalidad);
            })

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
            $scope.obtenerHistorialContratos($scope.empleado)
            $scope.abrirPopup($scope.idModalHistorialContrato);
        }
        $scope.cerrarDialogHistorialContrato = function () {
            $scope.cerrarPopup($scope.idModalHistorialContrato);
        }
        $scope.abrirDialogBeneficiosSociales = function (empleado) {
            $scope.empleado = empleado
            if (empleado.ficha.fecha_inicio) {
                var fecha = ""
                var fechaActual = new Date()
                var tipo = false
                if (empleado.ficha.fecha_expiracion) {
                    fecha = $scope.fechaATexto(empleado.ficha.fecha_expiracion)
                    fechaActual = new Date(empleado.ficha.fecha_expiracion)
                    tipo = true
                }
                var fechaAnterior = new Date(empleado.ficha.fecha_inicio)
                $scope.tiempoTrabajado = duration(fechaAnterior, fechaActual)
                $scope.beneficio = { tipo_beneficio: tipo, anios: 0, meses: 0, dias: 0, fecha_elaboracion: $scope.fechaATexto(new Date()), fecha_ingreso: $scope.fechaATexto(empleado.ficha.fecha_inicio), fecha_retiro: fecha, ingresos: [], deducciones: [] }

                $scope.deduccion = {}
                $scope.ingreso = {}
                $scope.obtenerTiposOtrosingresosYDeduccion()
                $scope.obtenerMotivosRetiro()
                $scope.vacacion = {
                    sabado: false,
                    inicio_tipo: false,
                    fin_tipo: false,
                    aniosDisponibles: 0,
                    historial: null
                }
                $scope.obtenerHistorialGestionesVacacion(empleado, false, true)

                $scope.abrirPopup($scope.idModalBeneficiosSociales);
            }
            else {
                $timeout(function () {
                    $scope.$apply(function () {
                        $scope.mostrarMensaje("No cuenta con ficha actualmente, crear ficha empleado!")
                    });
                }, 200);

            }
        }
        $scope.abrirDialogBeneficiosSociales2 = function (empleado) {

            var promesa = HistorialGestionesVacacion(empleado.id)
            promesa.then(function (dato) {
                var fechaActual = new Date()
                if (dato.length > 0) {
                    if (dato[(dato.length - 1)].gestion < fechaActual.getFullYear()) {
                        var anioConfiguracion = dato[(dato.length - 1)].anio + 1
                        var config = 0
                        var gestion = fechaActual.getFullYear()
                        if (anioConfiguracion < 5) {
                            config = $scope.configuracionesVacacion[0].dias
                        } else if (anioConfiguracion < 10) {
                            config = $scope.configuracionesVacacion[1].dias
                        } else if (anioConfiguracion >= 10) {
                            config = $scope.configuracionesVacacion[2].dias
                        }
                        var historialVacacion = {
                            gestion: gestion,
                            anio: anioConfiguracion,
                            aplicadas: config,
                            tomadas: 0
                        }
                        var promesa = GuardarHistorialVacacion(empleado.id, historialVacacion)
                        promesa.then(function (datos) {
                            $scope.abrirDialogBeneficiosSociales(empleado)
                        })
                    } else {
                        $scope.abrirDialogBeneficiosSociales(empleado)
                    }
                } else {
                    $scope.mostrarMensaje("No cuenta con ficha del empleado actualizada, actualizar ficha empleado")
                }
            })
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
        $scope.abrirDialogBitacoraFicha = function () {
            $scope.abrirPopup($scope.idModalBitacoraFicha);
        }
        $scope.cerrarDialogBitacoraFicha = function () {
            $scope.cerrarPopup($scope.idModalBitacoraFicha);
        }
        $scope.abrirDialogAnticipoExtraordinario = function (empleado) {
            if (empleado.activo) {
                $scope.empleado = empleado
                if (empleado.ficha.haber_basico) {

                    $scope.obtenerAnticiposExtra(empleado)

                    $scope.abrirPopup($scope.idModalAnticipoExtraordinario);
                }
                else {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.mostrarMensaje("No cuenta con haber basico actualizar ficha empleado!")
                        });
                    }, 200);
                }
            }
        }
        $scope.obtenerAnticiposExtra = function (empleado) {
            var mes = new Date().getMonth()
            $scope.mesActual = mes
            var gestion = String(new Date().getFullYear())
            var ultimodia = new Date()
            $scope.listaAnticipos = []
            $scope.filtroAnticipo = { mes: { id: mes }, gestion: gestion }
            var date = new Date();
            var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
            var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            var filtro = { inicio: primerDia, fin: ultimoDia, nombre: 'ORDI', id_empresa: 0 }
            $scope.anticipo_ordinaroOextra = 0;
            $scope.obtenerListaAnticipos(filtro, empleado.id)
        }
        $scope.cerrarDialogAnticipoExtraordinario = function () {
            $scope.cerrarPopup($scope.idModalAnticipoExtraordinario);
        }
        $scope.abrirDialogNuevoPrestamo = function (empleado) {
            if (empleado.activo) {
                $scope.empleado = empleado
                $scope.prestamo = {}
                if (empleado.ficha.haber_basico) {
                    $scope.abrirPopup($scope.idModalNuevoPrestamo);
                } else {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.mostrarMensaje("No cuenta con haber basico actualizar ficha empleado!")
                        });
                    }, 200);

                }
            }
        }
        $scope.cerrarDialogNuevoPrestamo = function () {
            $scope.cerrarPopup($scope.idModalNuevoPrestamo);
        }
        $scope.abrirDialogAusenciasVacaciones = function (empleado) {

            $scope.empleado = empleado
            $scope.ausencia = { primera_baja: false }
            $scope.otraAusencia = {}
            $scope.vacacion = {
                sabado: false,
                inicio_tipo: false,
                fin_tipo: false,
                aniosDisponibles: 0,
                historial: null
            }
            $scope.feriados = []
            $scope.listaFeriado()
            $scope.obtenerHistorialGestionesVacacion(empleado, true)


        }
        $scope.abriirmodelAusenciasVacas = function (empleado) {
            if (empleado.activo) {
                if (empleado.ficha.fecha_inicio) {
                    var promesa = HistorialGestionesVacacion(empleado.id)
                    promesa.then(function (dato) {
                        var fechaActual = new Date()
                        if (dato[(dato.length - 1)].gestion < fechaActual.getFullYear()) {
                            var anioConfiguracion = dato[(dato.length - 1)].anio + 1
                            var config = 0
                            var gestion = fechaActual.getFullYear()
                            if (anioConfiguracion < 5) {
                                config = $scope.configuracionesVacacion[0].dias
                            } else if (anioConfiguracion < 10) {
                                config = $scope.configuracionesVacacion[1].dias
                            } else if (anioConfiguracion >= 10) {
                                config = $scope.configuracionesVacacion[2].dias
                            }
                            var historialVacacion = {
                                gestion: gestion,
                                anio: anioConfiguracion,
                                aplicadas: config,
                                tomadas: 0
                            }
                            var promesa = GuardarHistorialVacacion(empleado.id, historialVacacion)
                            promesa.then(function (datos) {
                                $scope.abrirDialogAusenciasVacaciones(empleado)
                            })
                        } else {
                            $scope.abrirDialogAusenciasVacaciones(empleado)
                        }
                    })
                }
                else {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.mostrarMensaje("No cuenta con ficha actualmente, crear ficha empleado!")
                        });
                    }, 200);
                }
            }
        }
        $scope.cerrarDialogAusenciasVacaciones = function () {
            $scope.cerrarPopup($scope.idModalAusenciasVacaciones);
        }
        $scope.abrirDialogTipoBaja = function (tiposAusenciasMedicas) {
            $scope.clase = {}
            $scope.tiposAusencia = tiposAusenciasMedicas.ausencias
            $scope.abrirPopup($scope.idModalTipoBaja);
        }
        $scope.cerrarDialogTipoBaja = function () {
            $scope.cerrarPopup($scope.idModalTipoBaja);
        }

        /* initialize the full calendar
        -----------------------------------------------------------------*/
        $scope.GuardarFeriadosCalendario = function () {
            var datos = $scope.calendar.fullCalendar('clientEvents');
            var feriados = []
            if (datos.length > 0) {
                datos.forEach(function (feriado, index, array) {
                    if (feriado.id == undefined) {
                        var feriado = {
                            start: feriado.start._d,
                            end: feriado.end._d
                        }
                        feriados.push(feriado)
                    }

                    if (index === (array.length - 1)) {
                        var promesa = NuevoFeriado($scope.usuario.id_empresa, feriados, $scope.feriadosEliminados)
                        promesa.then(function (dato) {
                            $scope.listaFeriado()
                            $scope.feriadosEliminados = []
                            $scope.cerrarDialogFeriados()
                            $scope.mostrarMensaje(dato.mensaje)
                        })
                    }
                });
            } else {
                var promesa = NuevoFeriado($scope.usuario.id_empresa, feriados, $scope.feriadosEliminados)
                promesa.then(function (dato) {
                    $scope.listaFeriado()
                    $scope.feriadosEliminados = []
                    $scope.cerrarDialogFeriados()
                    $scope.mostrarMensaje(dato.mensaje)
                })
            }

        }
        $scope.agregarFeriado = function (start, end, allDay) {
            $scope.calendar.fullCalendar('renderEvent',
                {
                    /* identificador: 0, */
                    title: 'Feriado',
                    start: start,
                    end: end,
                    allDay: allDay,
                    className: 'label-info'
                },
                true // make the event "stick"
            );
            $scope.calendar.fullCalendar('unselect');
        }

        $scope.obtenerFechasCalendarioFeriado = function () {
            $('#calendar').fullCalendar('removeEvents');
            var datos = []
            $scope.FeriadosCalendario.forEach(function (element, index, array) {
                var a = { id: element.id, title: 'Feriado', start: element.fecha_inicio, end: element.fecha_fin, className: 'label-info' }
                datos.push(a)
                if (index === (array.length - 1)) {
                    $scope.addEvents(datos);
                }
            }, this);
        }

        $scope.listaFeriado = function () {
            $scope.ListaDiasFeriado = []
            promesa = ListaFeriados($scope.usuario.id_empresa)

            promesa.then(function (dato) {
                dato.forEach(function (feriado, index, array) {
                    var rango = getDates(new Date(feriado.fecha_inicio), new Date(feriado.fecha_fin));
                    /*          $scope.ListaDiasFeriado.concat(rango) */
                    $scope.ListaDiasFeriado.push.apply($scope.ListaDiasFeriado, rango)


                });
                $scope.FeriadosCalendario = dato;
            })
        }
        $scope.addEvents = function (datos) {
            $scope.calendar.fullCalendar('addEventSource', datos)
        }

        $scope.calendar = $('#calendar').fullCalendar({
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
                /*  {
                     title: 'Feriado',
                     start: new Date(y, m, 1),
                     className: 'label-important'
                 } */

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
                var datos = $scope.calendar.fullCalendar('clientEvents');
                var bandera = true
                if (datos.length > 0) {
                    datos.forEach(function (feriado, index, array) {
                        var inicio = $scope.fechaATexto(feriado.start._d)
                        var inicio2 = $scope.fechaATexto(start._d)
                        if (inicio == inicio2) {
                            bandera = false
                        }
                        if (index === (array.length - 1)) {
                            if (bandera) {
                                $scope.agregarFeriado(start, end, allDay)
                            }
                        }
                    });
                } else {
                    $scope.agregarFeriado(start, end, allDay)
                }
            },
            eventClick: function (calEvent, jsEvent, view) {
                if (calEvent.id != undefined) {
                    var feriado = {
                        id: calEvent.id

                    }
                    $scope.feriadosEliminados.push(feriado)
                    $scope.calendar.fullCalendar('removeEvents', function (ev) {
                        return (ev._id == calEvent._id);
                    })

                } else {
                    $scope.calendar.fullCalendar('removeEvents', function (ev) {
                        return (ev._id == calEvent._id);
                    })
                }
            }
        });

        $scope.abrirDialogFeriados = function () {
            $scope.abrirPopup($scope.idModalFeriados);
            $scope.feriadosEliminados = []
            $('#calendar').fullCalendar('render');
            $scope.obtenerFechasCalendarioFeriado()
        }
        $scope.cerrarDialogFeriados = function () {
            $scope.cerrarPopup($scope.idModalFeriados);
        }
        $scope.abrirDialogHitorialVacaciones = function () {
            var filtro = {}
            $scope.obtenerHistorialEmpleadVacacion(filtro)
            $scope.abrirPopup($scope.idModalHitorialVacaciones);
        }
        $scope.cerrarDialogHitorialVacaciones = function () {
            $scope.cerrarPopup($scope.idModalHitorialVacaciones);
        }
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
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
                $scope.horas = moment.utc(moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(start, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                $scope.Event = $scope.calendarCompensacion.fullCalendar('renderEvent',
                    {
                        start: start,
                        end: end,
                        className: 'label-info'
                    },
                    true // make the event "stick"
                );

                $scope.selectionday.push({ '_id': $scope.Event[0]._id, 'fecha_real': start, 'fecha': start.format("DD-MM-YYYY"), 'hora_inicio': start.format("HH:mm:ss"), 'hora_fin': end.format("HH:mm:ss"), 'total': $scope.horas });
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
                totalHoras = String("0" + timeHoras).slice(-2) + ':' + String("0" + timeMinutos).slice(-2) + ":00";
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
            var filtroAusencias = { inicio: 0, fin: 0, tipo_ausencia: 0 }
            $scope.filtroOtrasAusencias = {}
            $scope.obtenerHistorialEmpleadoOtrasAusencias(filtroAusencias)
            $scope.abrirPopup($scope.idModalHistorialAusencias);
        }
        $scope.cerrarDialogHistorialAusencias = function () {
            $scope.cerrarPopup($scope.idModalHistorialAusencias);
        }
        $scope.abrirDialogHistorialAusenciaMedica = function () {
            var filtroAusencias = { inicio: 0, fin: 0, tipo_ausencia: 0 }
            $scope.filtroAusencias = {}
            $scope.obtenerHistorialEmpleadoAusenciasMedicas(filtroAusencias)
            $scope.abrirPopup($scope.idModalHistorialAusenciaMedica);
        }
        $scope.cerrarDialogHistorialAusenciaMedica = function () {
            $scope.cerrarPopup($scope.idModalHistorialAusenciaMedica);
        }
        $scope.abrirDialogTipoAusencia = function (tiposOtrasAusencias) {
            $scope.tiposOtras = tiposOtrasAusencias.ausencias
            $scope.clase = {}
            $scope.abrirPopup($scope.idModalTipoAusencia);
        }
        $scope.cerrarDialogTipoAusencia = function () {
            $scope.cerrarPopup($scope.idModalTipoAusencia);
        }
        $scope.abrirDialogRolTurnos = function (empleado) {
            if (empleado.activo) {
                if (empleado.ficha.fecha_inicio) {


                    $scope.empleado = empleado
                    $scope.rolTurno = { tipo: false, fecha_fin: "", dias_trabajo: null, dias_descanso: null, grupo: "", id_ficha: null }
                    $scope.abrirPopup($scope.idModalRolTurnos);
                }
                else {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.mostrarMensaje("No cuenta con ficha actualmente, crear ficha empleado!")
                        });
                    }, 200);
                }
            }
        }
        $scope.cerrarDialogRolTurnos = function () {
            $scope.cerrarPopup($scope.idModalRolTurnos);
        }
        $scope.abrirDialogHistorialTurnos = function (empleado) {
            $scope.obtenerlistaRolTurno(empleado.ficha.id)
            $scope.abrirPopup($scope.idModalHistorialTurnos);
        }
        $scope.cerrarDialogHistorialTurnos = function () {
            $scope.cerrarPopup($scope.idModalHistorialTurnos);
        }
        $scope.abrirDialogHorasExtras = function (empleado) {
            if (empleado.activo) {
                if (empleado.ficha.fecha_inicio) {

                    $scope.empleado = empleado
                    var fecha = new Date()
                    $scope.horaExtra = { fecha: $scope.fechaATexto(fecha) }
                    $scope.abrirPopup($scope.idModalHorasExtras);
                }
                else {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.mostrarMensaje("No cuenta con ficha actualmente, crear ficha empleado!")
                        });
                    }, 200);
                }
            }
        }
        $scope.cerrarDialogHorasExtras = function () {
            $scope.cerrarPopup($scope.idModalHorasExtras);
        }
        $scope.abrirDialogHistorialHorasExtras = function () {
            var filtroHorasExtra = { inicio: "", fin: "" }
            $scope.obtenerHistorialHorasExtra(filtroHorasExtra)
            $scope.abrirPopup($scope.idModalHistorialHorasExtras);
        }
        $scope.cerrarDialogHistorialHorasExtras = function () {
            $scope.cerrarPopup($scope.idModalHistorialHorasExtras);
        }
        $scope.abrirDialogAnticipoRegular = function () {
            $scope.obteneranticiposOrdi()
            $scope.dynamicPopovertr3 = {
                templateUrl: 'myPopoverTr3.html',
            };
            $scope.obtenerDepartamentos()
            $scope.abrirPopup($scope.idModalAnticipoRegular);
        }
        $scope.obteneranticiposOrdi = function () {
            var mes = new Date().getMonth()
            var gestion = String(new Date().getFullYear())
            var ultimodia = new Date()
            $scope.listaAnticipos = []
            $scope.meses.forEach(function (mese, index, array) {
                if (mese.id == mes) {
                    mes = mese
                }
                if (index === (array.length - 1)) {
                    $scope.filtroAnticipo = { mes: mes, gestion: gestion }
                    var date = new Date();
                    var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
                    var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    var filtro = { inicio: primerDia, fin: ultimoDia, nombre: 'EXTRAORDI', id_empresa: $scope.usuario.id_empresa }
                    $scope.anticipo_extraordinaro = 0;
                    $scope.obtenerListaAnticiposOrdi(filtro, 0)
                }
            });

        }
        $scope.cerrarDialogAnticipoRegular = function () {
            $scope.listaAnticipos2 = []
            $scope.cerrarPopup($scope.idModalAnticipoRegular);
        }
        $scope.abrirDialogPrestamosPersonal = function () {
            $scope.obtenerPrestamos()
            $scope.abrirPopup($scope.idModalPrestamosPersonal);
        }
        $scope.optenerListaPrestamos = function () {
            var promesa = ObtenerListaPrestamo($scope.paginator)
            promesa.then(function (datos) {
                $scope.paginator.setPages(datos.paginas);
                if (datos.prestamos.length > 0) {
                    datos.prestamos.forEach(function (prestamo, index, array) {
                        var fecha = $scope.fechaATexto(prestamo.fecha_inicial)
                        prestamo.fecha_vence = editar_fecha(fecha, prestamo.plazo, "m", "/")


                        prestamo.saldo = prestamo.monto
                        prestamo.pago = 0
                        $scope.prestamos = { total_montos: 0, pagos_acuenta: 0, saldo: 0 }
                        if (index === (array.length - 1)) {

                            datos.prestamos.forEach((prestamo, index, array) => {
                                if (prestamo.prestamoPagos.length > 0) {
                                    if (prestamo.prestamoPagos[(prestamo.prestamoPagos.length - 1)].saldo_anterior == prestamo.total) {
                                        prestamo.pagadoTotal = true

                                    }
                                    prestamo.pagadoTotal = false
                                    $scope.prestamos.total_montos += prestamo.monto
                                    $scope.prestamos.pagos_acuenta += prestamo.prestamoPagos[(prestamo.prestamoPagos.length - 1)].a_cuenta_anterior
                                    $scope.prestamos.saldo += (prestamo.total - prestamo.prestamoPagos[(prestamo.prestamoPagos.length - 1)].a_cuenta_anterior)
                                } else {
                                    prestamo.pagadoTotal = false
                                    $scope.prestamos.total_montos += prestamo.monto
                                    $scope.prestamos.pagos_acuenta += 0
                                    $scope.prestamos.saldo += prestamo.total
                                }
                                if (index === (array.length - 1)) {
                                    $scope.listaPrestamos = datos.prestamos
                                }

                            });
                        }
                        prestamo.montoEdit = false
                    });
                } else {
                    $scope.listaPrestamos = {}
                    $scope.prestamos = {}
                }
            })
        }

        $scope.copiarCodigodeCi = function (empleado) {
            if (empleado.activoCopiaCodigo) {
                empleado.codigo = empleado.persona.ci
            } else {
                empleado.codigo = ""
            }

        }
        $scope.obtenerPrestamos = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "id";
            $scope.paginator.direccion = "asc";
            $scope.filtro = { empresa: $scope.usuario.id_empresa, plazo: "", inicio: "", fin: "", nombre: "", apellido: "", cuentas_liquidas: false };
            $scope.paginator.callBack = $scope.optenerListaPrestamos;
            $scope.paginator.getSearch("", $scope.filtro, null);
            blockUI.stop();

        }
        $scope.borrarFechas = function (filtro) {
            filtro.fin = ""
            filtro.inicio = ""
            $scope.paginator.getSearch("", $scope.filtro, null);
        }
        $scope.cerrarDialogPrestamosPersonal = function () {
            $scope.cerrarPopup($scope.idModalPrestamosPersonal);
        }
        $scope.abrirDialogNuevoAnticipoRegularTodos = function () {
            $scope.listaAnticipos2 = []
            $scope.cerrarDialogAdvertencia();
            $scope.obtenerListaEmpleados()
            $scope.abrirPopup($scope.idModalNuevoAnticipoRegularTodos);
        }
        $scope.cerrarDialogNuevoAnticipoRegularTodos = function () {
            $scope.cerrarPopup($scope.idModalNuevoAnticipoRegularTodos);
        }

        $scope.abrirDialogAdvertencia = function (modal) {
            $scope.abrirModalAdvertencia = modal
            $scope.abrirPopup($scope.idModalAdvertencia);
        }

        $scope.abrirDialogAdvertenciaPrestamo = function () {
            $scope.mensajeAdvertencia = {
                texto1: 'Los prestamos y las condiciones se realizarán para todos los trabajadores seleccionados.',
                texto2: 'Para prestamos personalizados use la opción directamente en la fila del empleado.'
            }
            $scope.abrirDialogAdvertencia($scope.abrirDialogPretamosNuevoTodos)
        }
        $scope.abrirDialogAdvertenciaAnticipo = function () {
            $scope.anticipo = { tipo: false, tope: null, monto: null }
            $scope.mensajeAdvertencia = {
                texto1: 'Los anticipos y las condiciones se realizarán para todos los trabajadores seleccionados.',
                texto2: 'Para anticipos personalizados use la opción directamente en la fila del empleado.'
            }
            $scope.abrirDialogAdvertencia($scope.abrirDialogNuevoAnticipoRegularTodos)
        }
        $scope.cerrarDialogAdvertencia = function () {
            $scope.cerrarPopup($scope.idModalAdvertencia);
        }
        $scope.abrirDialogPretamosNuevoTodos = function () {
            $scope.cerrarDialogAdvertencia();
            $scope.obtenerListaEmpleados()
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
        $scope.abrirDialogPagoPrestamo = function (prestamo) {
            $scope.prestamo = prestamo
            var fechaActual = new Date()
            if ($scope.prestamo.prestamoPagos.length > 0) {
                prestamo.saldo = $scope.prestamo.prestamoPagos[(prestamo.prestamoPagos.length - 1)].saldo_anterior
                prestamo.total = ((prestamo.monto * prestamo.interes_pactado) / 100) + prestamo.monto
            }
            var fechaVence = new Date($scope.convertirFecha(prestamo.fecha_vence))
            var fechaInicioTexto = moment(fechaActual).format('YYYY-MM-DD HH:mm:ss');
            var fechaFinTexto = moment(fechaVence).format('YYYY-MM-DD HH:mm:ss');
            var fecha1 = moment(fechaInicioTexto, "YYYY-MM-DD HH:mm:ss");
            var fecha2 = moment(fechaFinTexto, "YYYY-MM-DD HH:mm:ss");
            $scope.prestamo.plazo_restante = Math.round(fecha2.diff(fecha1, 'months', true))
            $scope.abrirPopup($scope.idModalPagoPrestamo);
        }
        $scope.cerrarDialogPagoPrestamo = function () {
            $scope.cerrarPopup($scope.idModalPagoPrestamo);
        }
        $scope.abrirDialogReporteVacaciones = function () {
            $scope.filtroVacacion = {}
            $scope.obtenerHistorialEmpresaVacacion($scope.filtroVacacion)
            $scope.abrirPopup($scope.idModalReporteVacaciones);
        }
        $scope.cerrarDialogReporteVacaciones = function () {
            $scope.cerrarPopup($scope.idModalReporteVacaciones);
        }
        $scope.abrirDialogReporteBajasMedicas = function () {
            var filtroAusencias = { inicio: 0, fin: 0, tipo_ausencia: 0 }
            $scope.filtroAusencias = {}
            $scope.obtenerHistorialEmpresaAusenciasMedicas(filtroAusencias)
            $scope.abrirPopup($scope.idModalReporteBajasMedicas);
        }
        $scope.cerrarDialogReporteBajasMedicas = function () {
            $scope.cerrarPopup($scope.idModalReporteBajasMedicas);
        }
        $scope.abrirDialogReporteRolTurnos = function () {
            $scope.obtenerlistaRolTurno(0)
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
            var filtroAusencias = { inicio: 0, fin: 0, tipo_ausencia: 0 }
            $scope.filtroOtrasAusencias = {}
            $scope.obtenerHistorialEmpresaOtrasAusencias(filtroAusencias)
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

                }, this);

                // $scope.generos = entidad.generos;
                blockUI.stop();
            });
        }
        $scope.abrirDialogPrerequisitoEditar = function (prerequisito) {

            $scope.NuevoP = new Prerequisito({ id: prerequisito.id, nombre: prerequisito.nombre, observacion: prerequisito.observacion, vencimiento_mes: prerequisito.vencimiento_mes, dias_activacion: prerequisito.dias_activacion, puede_modificar_rrhh: prerequisito.puede_modificar_rrhh })
            $scope.abrirPopup($scope.idModalDialogPrerequisitoNuevo);
        }

        $scope.cerrarPopupPrerequisitoNuevo = function () {
            $scope.obtenerAlertas()
            $scope.cerrarPopup($scope.idModalDialogPrerequisitoNuevo);
        }

        $scope.saveForm = function () {
            //$scope.paciente = paciente;

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
            $scope.paginator.column = "id";
            $scope.paginator.direccion = "asc";
            $scope.dynamicPopoverCargos = {
                templateUrl: 'myPopoverTemplate.html',
            };
            $scope.filtro = { empresa: $scope.usuario.id_empresa, codigo: "", nombres: "", ci: "", campo: "", cargo: "", busquedaEmpresa: "", estado: "", grupo_sanguineo: "" };
            $scope.paginator.callBack = $scope.buscarRecursosHumanos;
            $scope.paginator.getSearch("", $scope.filtro, null);
            blockUI.stop();

        }
        $scope.buscarRecursosHumanos = function (seleccionar, empleado, todos, model) {
            blockUI.start();

            var promesa = RecursosHumanosPaginador($scope.paginator);
            promesa.then(function (dato) {
                $scope.paginator.setPages(dato.paginas);
                $scope.RecursosHumanosEmpleados = dato.pacientes;

                $scope.RecursosHumanosEmpleados.forEach(function (empleado) {
                    empleado.activo = (empleado.activo == 0) ? true : false

                });
                if (seleccionar) {
                    if (todos) {
                        $scope.RecursosHumanosEmpleados.forEach(function (empleado, index, array) {
                            if (model == false) {
                                empleado.select = false
                                $scope.empleadosSeleccionados = []
                            } else {

                                empleado.select = true
                                $scope.empleadosSeleccionados.push(empleado)


                            }
                        });
                    }
                }

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
                        paciente.segundo_nombre = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
                        paciente.ci = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
                        paciente.extension = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
                        paciente.contrato = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? worksheet['H' + row].v.toString() : null;
                        paciente.fecha_nacimiento = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? $scope.fecha_excel_angular(worksheet['I' + row].v.toString()) : null;
                        paciente.genero = worksheet['J' + row] != undefined && worksheet['J' + row] != "" ? worksheet['J' + row].v.toString() : null;
                        paciente.telefono = worksheet['K' + row] != undefined && worksheet['K' + row] != "" ? worksheet['K' + row].v.toString() : null;
                        paciente.telefono2 = worksheet['L' + row] != undefined && worksheet['L' + row] != "" ? worksheet['L' + row].v.toString() : null;
                        paciente.telefono_movil = worksheet['M' + row] != undefined && worksheet['M' + row] != "" ? worksheet['M' + row].v.toString() : null;
                        paciente.estilo_de_vida = worksheet['N' + row] != undefined && worksheet['N' + row] != "" ? worksheet['N' + row].v.toString() : null;
                        paciente.cargo = worksheet['O' + row] != undefined && worksheet['O' + row] != "" ? worksheet['O' + row].v.toString() : null;
                        paciente.designacion_empresa = worksheet['P' + row] != undefined && worksheet['P' + row] != "" ? worksheet['P' + row].v.toString() : null;
                        paciente.telefono_empresa = worksheet['Q' + row] != undefined && worksheet['Q' + row] != "" ? worksheet['Q' + row].v.toString() : null;
                        paciente.campamento = worksheet['R' + row] != undefined && worksheet['R' + row] != "" ? worksheet['R' + row].v.toString() : null;
                        paciente.riesgos_procesos_trabajo = worksheet['S' + row] != undefined && worksheet['S' + row] != "" ? worksheet['S' + row].v.toString() : null;
                        paciente.ciudad_referencia = worksheet['T' + row] != undefined && worksheet['T' + row] != "" ? worksheet['T' + row].v.toString() : null;
                        paciente.zona_referencia = worksheet['U' + row] != undefined && worksheet['U' + row] != "" ? worksheet['U' + row].v.toString() : null;
                        paciente.calle_av_referencia = worksheet['V' + row] != undefined && worksheet['V' + row] != "" ? worksheet['V' + row].v.toString() : null;
                        paciente.nro_referencia = worksheet['W' + row] != undefined && worksheet['W' + row] != "" ? worksheet['W' + row].v.toString() : null;
                        paciente.telefonos_referencia = worksheet['X' + row] != undefined && worksheet['X' + row] != "" ? worksheet['X' + row].v.toString() : null;
                        paciente.celular_referencia = worksheet['Y' + row] != undefined && worksheet['Y' + row] != "" ? worksheet['Y' + row].v.toString() : null;
                        paciente.nombre_referencia = worksheet['Z' + row] != undefined && worksheet['Z' + row] != "" ? worksheet['Z' + row].v.toString() : null;
                        paciente.fecha_inicio = worksheet['AA' + row] != undefined && worksheet['AA' + row] != "" ?$scope.fecha_excel_angular(worksheet['AA' + row].v.toString()) : null;
                        paciente.haber_basico = worksheet['AB' + row] != undefined && worksheet['AB' + row] != "" ? parseFloat(worksheet['AB' + row].v.toString()) : null;
                        paciente.imagen = "img/icon-user-default.png"
                        paciente.es_empleado = true
                        var a = new Date(paciente.fecha_inicio)
                        paciente.historialVacacion = []
                        var b = a.getFullYear()
                        var anos = $scope.obtenerAnios(b)
                        anos.forEach(function (_, index, array) {
                            var anioConfiguracion = index + 1
                            var config = null
                            if (anioConfiguracion < 5) {
                                config = $scope.configuracionesVacacion[0].dias
                            } else if (anioConfiguracion < 10) {
                                config = $scope.configuracionesVacacion[1].dias
                            } else if (anioConfiguracion >= 10) {
                                config = $scope.configuracionesVacacion[2].dias
                            }
                            var historialVacacion = {
                                gestion: _,
                                anio: index + 1,
                                aplicadas: config,
                                tomadas: 0
                            }
                            paciente.historialVacacion.push(historialVacacion)
                        });
                        pacientes.push(paciente);

                        row++;
                        i++;

                    } while (worksheet['A' + row] != undefined);
                    $scope.GuardarEmpleadosRh(pacientes);
                };
                reader.readAsBinaryString(f);
                //console.log('pacientes obtenidos')
            }
        }
        $scope.GuardarEmpleadosRh = function (lstpacientes) {
            var empleadoEmpresa = new EmpleadoEmpresa({ pacientes: lstpacientes, id_empresa: $scope.usuario.id_empresa });
            empleadoEmpresa.$save(function (res) {
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
                $scope.seleccionarCargos($scope.nuevoRH.empleadosFichas[($scope.nuevoRH.empleadosFichas.length-1)].cargos)
            })
            $scope.abrirPopup($scope.idModalRhNuevo);
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
                $scope.ficha.otrosSeguros.splice(otroSeguro.index, 1);

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
                    $scope.ficha.editDatosLaborales = false
                    if ($scope.ficha.fecha_inicio) {
                        $scope.ficha.fecha_inicio2 = $scope.fechaATexto($scope.ficha.fecha_inicio)
                    } else {
                        $scope.ficha.editDatosLaborales = true
                    }
                    if ($scope.ficha.fecha_fin) {
                        $scope.ficha.fecha_fin2 = $scope.fechaATexto($scope.ficha.fecha_fin)
                    }
                    $scope.ficha.cargo = []
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
                    if ($scope.ficha.fecha) {
                        var fecha = new Date($scope.ficha.fecha)
                    } else {
                        var fecha = new Date()
                    }
                    $scope.ficha.fecha_elaboracion = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365);

                    $scope.ficha.empleado.familiares.forEach(function (familiar, index, array) {
                        var fechaActual = new Date()
                        var fechaNacimiento = new Date(familiar.persona.fecha_nacimiento)

                        var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                        familiar.edad = Math.trunc(dato / 365);
                        familiar.eliminado = false
                    });
                    $scope.ficha.otrosSeguros.forEach(function (otroSeguro, index, array) {
                        otroSeguro.eliminado = false
                    })
                    $scope.seleccionarCargos($scope.ficha.cargos)
                    $scope.seleccionarDiscapacidades($scope.ficha.discapacidades)
                    //llenarCargos($scope.cargos)
                }/*  else {

                    $scope.ficha = { empleado: datos.empleado, pacienteReferencia: {}, editDatosLaborales: false }
                    $scope.ficha.empleado.cargo = []
                    $scope.ficha.empleado.otrosSeguros = []
                    $scope.ficha.empleado.familiares = []
                    $scope.ficha.empleado.persona.correo_electronico = datos.empleado.persona.correo_electronico
                    $scope.seleccionarCargos($scope.ficha.empleado.cargos)
                    $scope.seleccionarDiscapacidades($scope.ficha.discapacidades)
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
                } */
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
            $scope.ficha.otrosSeguros.push(seguro)
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
                $scope.ficha.otrosSeguros.splice(index, 1);

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
                familiar.eliminado = true
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
            $scope.ficha.otrosSeguros[dato.index] = dato
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
            $scope.listYears = $scope.obtenerAnios(1930)

            $scope.obtenerCargos()
            $scope.obtenerDiscapacidades()
            $scope.obtenerGrados()
            $scope.obtenerTitulos()
            $scope.obtenerInstituciones()
            $scope.obtenerCapacidadesIE()
            $scope.obtenerLogrosIE()
            $scope.obtenertiposAusenciaMedica()
            $scope.obtenerTiposOtrasAusencias()
            $scope.obtenerTiposBaja()
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
                $scope.listaCargos = entidad
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
        $scope.obtenerDepartamentos = function () {
            blockUI.start();
            var nombre_corto = '-BOL';
            var promesa = Paises(nombre_corto);
            promesa.then(function (entidades) {
                $scope.departamentosBanco = entidades;

                blockUI.stop();
            });

        }
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

        $scope.AgregarDepartamento = function (datos) {
            if (datos.edit) {
                var bandera = true
                $scope.clase = { pais: datos.pais }
                $scope.departamentos.forEach(function (departamento, index, array) {
                    var nombre_corto = departamento.nombre_corto.split("-")[0]
                    if (departamento.id != datos.id) {
                        if (nombre_corto == datos.nombre_corto2) {
                            bandera = false
                        }
                    }
                    if (index === (array.length - 1)) {
                        if (bandera) {
                            datos.nombre_corto = datos.nombre_corto2 + "-" + datos.pais.nombre_corto
                            $scope.clase = { pais: datos.pais }
                        } else {
                            $scope.mostrarMensaje("El nombre corto tiene que ser unico por departamento")
                        }
                    }
                });
            } else {
                var bandera = true
                if ($scope.departamentos.length > 0) {
                    $scope.departamentos.forEach(function (departamento, index, array) {
                        var nombre_corto = departamento.nombre_corto.split("-")[0]
                        if (nombre_corto == datos.nombre_corto2) {
                            bandera = false
                        }
                        if (index === (array.length - 1)) {
                            if (bandera) {
                                datos.nombre_corto = datos.nombre_corto2 + "-" + datos.pais.nombre_corto
                                $scope.departamentos.push(datos)
                                $scope.clase = { pais: datos.pais }
                            } else {
                                $scope.mostrarMensaje("El nombre corto tiene que ser unico por departamento")
                            }
                        }
                    });
                } else {
                    datos.nombre_corto = datos.nombre_corto2 + "-" + datos.pais.nombre_corto
                    $scope.departamentos.push(datos)
                    $scope.clase = { pais: datos.pais }
                }
            }

        }

        $scope.AgregarProvincia = function (datos) {
            if (datos.edit) {
                var bandera = true
                $scope.provincias.forEach(function (provincia, index, array) {
                    var nombre_corto = provincia.nombre_corto.split("-")[1]
                    if (provincia.id != datos.id) {
                        if (nombre_corto == datos.nombre_corto2) {
                            bandera = false
                        }
                    }
                    if (index === (array.length - 1)) {
                        if (bandera) {
                            var nombreCorto = datos.departamento.nombre_corto.split("-")[0]
                            datos.nombre_corto = nombreCorto + "M-" + datos.nombre_corto2
                        } else {
                            $scope.mostrarMensaje("El nombre corto tiene que ser unico por provincia")
                        }
                    }
                });
                $scope.clase = { departamento: datos.departamento }

            } else {
                var bandera = true
                if ($scope.provincias.length > 0) {
                    $scope.provincias.forEach(function (provincia, index, array) {
                        var nombre_corto = provincia.nombre_corto.split("-")[1]
                        if (nombre_corto == datos.nombre_corto2) {
                            bandera = false
                        }
                        if (index === (array.length - 1)) {
                            if (bandera) {
                                var nombreCorto = datos.departamento.nombre_corto.split("-")[0]
                                datos.nombre_corto = nombreCorto + "M-" + datos.nombre_corto2
                                $scope.provincias.push(datos)
                                $scope.clase = { departamento: datos.departamento }
                            } else {
                                $scope.mostrarMensaje("El nombre corto tiene que ser unico por provincia")
                            }
                        }
                    });
                } else {
                    var nombreCorto = datos.departamento.nombre_corto.split("-")[0]
                    datos.nombre_corto = nombreCorto + "M-" + datos.nombre_corto2
                    $scope.provincias.push(datos)
                    $scope.clase = { departamento: datos.departamento }
                }
            }
        }
        $scope.AgregarLocalidad = function (datos) {
            if (datos.edit) {
                var bandera = true
                $scope.localidades.forEach(function (localidad, index, array) {
                    var nombre_corto = localidad.nombre_corto.split("-")[0]
                    var nombre_corto2 = datos.nombre_corto2
                    if (localidad.id != datos.id) {
                        if (nombre_corto == nombre_corto2) {
                            bandera = false
                        }
                    }
                    if (index === (array.length - 1)) {
                        if (bandera) {
                            var nombreCorto = datos.provincia.nombre_corto.split("-")[1]
                            datos.nombre_corto = datos.nombre_corto2 + "-" + nombreCorto + "L"
                        } else {
                            $scope.mostrarMensaje("El nombre corto tiene que ser unico por localidad")
                        }
                    }
                })
                $scope.clase = { provincia: datos.provincia }
            } else {
                var bandera = true
                if ($scope.localidades.length > 0) {
                    $scope.localidades.forEach(function (localidad, index, array) {
                        var nombre_corto = localidad.nombre_corto.split("-")[0]
                        var nombre_corto2 = datos.nombre_corto2
                        if (nombre_corto == nombre_corto2) {
                            bandera = false
                        }
                        if (index === (array.length - 1)) {
                            if (bandera) {
                                var nombreCorto = datos.provincia.nombre_corto.split("-")[1]
                                datos.nombre_corto = datos.nombre_corto2 + "-" + nombreCorto + "L"
                                $scope.localidades.push(datos)
                                $scope.clase = { provincia: datos.provincia }
                            } else {
                                $scope.mostrarMensaje("El nombre corto tiene que ser unico por localidad")
                            }
                        }
                    });
                } else {
                    var nombreCorto = datos.provincia.nombre_corto.split("-")[1]
                    datos.nombre_corto = datos.nombre_corto2 + "-" + nombreCorto + "L"
                    $scope.localidades.push(datos)
                    $scope.clase = { provincia: datos.provincia }
                }
            }
        }
        $scope.guardarConceptoEdicionRrhh = function (datos, clase) {
            blockUI.start();
            $scope.tipo_edicion2.clases = datos
            var tipo = $scope.tipo_edicion2
            Tipos.update({ id_tipo: tipo.id }, tipo, function (res) {
                var promesa = ClasesTipo(tipo.nombre_corto);
                promesa.then(function (entidad) {
                    tipo = entidad
                    $scope.tipo_edicion2 = {}
                    blockUI.stop();
                    $scope.buscarDepartamento(clase.pais)
                    $scope.buscarMunicipios(clase.departamento)
                    $scope.buscarLocalidad(clase.provincia)
                    $scope.cerrarDialogDepartamentoEstado();
                    $scope.cerrarDialogProvincia();
                    $scope.cerrarDialogLocalidad();
                    $scope.mostrarMensaje('Guardado Exitosamente!');
                });
            });
        }
        $scope.editarLocalidad = function (loc, clase) {
            var a = clase.provincia
            var nombre_corto = loc.nombre_corto.split("-")[0]
            $scope.clase = loc; $scope.clase.provincia = a; $scope.clase.nombre_corto2 = nombre_corto
            $scope.clase.edit = true
        }
        $scope.editarProvincia = function (pro, clase) {
            var a = clase.departamento
            var nombre_corto = pro.nombre_corto.split("-")[1]
            $scope.clase = pro; $scope.clase.departamento = a; $scope.clase.nombre_corto2 = nombre_corto
            $scope.clase.edit = true
        }
        $scope.editarDepartamento = function (pro, clase) {
            var a = clase.pais
            var nombre_corto = pro.nombre_corto.split("-")[0]
            $scope.clase = pro; $scope.clase.pais = a; $scope.clase.nombre_corto2 = nombre_corto
            $scope.clase.edit = true
        }
        $scope.cancelarEdicionLocalidad = function (clase) {
            $scope.clase = { provincia: clase.provincia }
        }
        $scope.cancelarEdicionProvincia = function (clase) {
            $scope.clase = { departamento: clase.departamento }
        }
        $scope.cancelarEdicionDepartamento = function (clase) {
            $scope.clase = { pais: clase.pais }
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
                $scope.bancosHdv = entidad
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


        $scope.obtenerAnios = function (startYear) {
            var currentYear = new Date().getFullYear(), years = [];
            startYear = startYear || 1930;

            while (startYear <= currentYear) {
                years.push(startYear++);
            }

            return years;
        }
        $scope.getDaysInMonth = function (month, year) {
            // Here January is 1 based
            //Day 0 is the last day in the previous month
            var dias = new Date(year, month + 1, 0).getDate();
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

        $scope.guardarFichaTecnica = function (form, ficha, save) {
            $scope.ficha.quienModifico=$scope.usuario.id
            
            var s = $scope.fechaATexto(ficha.fecha_inicio)
            ficha.historialVacacion = []
            if (s != ficha.fecha_inicio2) {
                var a = ficha.fecha_inicio2
                var b = new Date($scope.convertirFecha(a)).getFullYear()
                var anos = $scope.obtenerAnios(b)
                anos.forEach(function (_, index, array) {
                    var anioConfiguracion = index + 1
                    var config = null
                    if (anioConfiguracion < 5) {
                        config = $scope.configuracionesVacacion[0].dias
                    } else if (anioConfiguracion < 10) {
                        config = $scope.configuracionesVacacion[1].dias
                    } else if (anioConfiguracion >= 10) {
                        config = $scope.configuracionesVacacion[2].dias
                    }
                    var historialVacacion = {
                        gestion: _,
                        anio: index + 1,
                        aplicadas: config,
                        tomadas: 0
                    }
                    ficha.historialVacacion.push(historialVacacion)
                });

            }
            if (save) {
                /*  if (ficha.empleado.persona.fecha_nacimiento) { */
                ficha.empleado.persona.fecha_nacimiento = new Date(ficha.nac_anio, parseInt(ficha.nac_mes.id), parseInt(ficha.nac_dia))
                /*  } */
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
                    /*  if (ficha.empleado.persona.fecha_nacimiento) { */
                    ficha.empleado.persona.fecha_nacimiento = new Date(ficha.nac_anio, parseInt(ficha.nac_mes.id), parseInt(ficha.nac_dia))
                    /*    } */
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
                    if (ficha.empleado.fecha_vence_documento) {
                        ficha.empleado.fecha_vence_documento = new Date($scope.convertirFecha(ficha.empleado.fecha_vence_documento));
                    }

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
                if ($scope.empleado.activo) {
                    var promesa = GuardarEmpleadoHojaVida($scope.empleado.id, $scope.hojaVida)
                    promesa.then(function (dato) {
                        $scope.cerrarDialogHojaVida()
                        $scope.mostrarMensaje(dato.mensaje)
                        $scope.recargarItemsTabla()
                    })
                } else {
                    $("#formacion-academica").click()
                    $scope.cerrarDialogHojaVida()
                }
            }
        }
        $scope.GuardarHojaDeVidaDirecto = function () {
            var promesa = GuardarEmpleadoHojaVida($scope.empleado.id, $scope.hojaVida)
            promesa.then(function (dato) {
                $scope.cerrarDialogHojaVida()
                $scope.mostrarMensaje(dato.mensaje)
                $scope.recargarItemsTabla()
            })
        }
        //impresion hoja de vida

        $scope.imprimirHojaVida = function (filtro) {
            if (filtro.capacidadInterna) {
                var a = filtro
                a.tipo = "INTER"
                if (a.inicio && a.fin) {
                    a.inicio = new Date(convertirFecha(a.inicio))
                    a.fin = new Date(convertirFecha(a.fin))
                } else {
                    a.inicio = 0
                    a.fin = 0
                }
                var promesa = DatosCapacidadesImpresion(a, $scope.hojaVida.id)
                promesa.then(function (dato) {
                    $scope.capacidades = dato.capacidades
                    convertUrlToBase64Image($scope.empleado.imagen, function (imagenEmpresa) {
                        var imagen = imagenEmpresa;
                        $scope.generarPdfHojaVida(imagen)
                        a.inicio = ""
                        a.fin = ""
                    });

                })
            } else {
                var a = filtro
                a.tipo = "EXT"
                a.inicio = 0
                a.fin = 0
                var promesa = DatosCapacidadesImpresion(a, $scope.hojaVida.id)
                promesa.then(function (dato) {
                    $scope.capacidades = dato.capacidades
                    convertUrlToBase64Image($scope.empleado.imagen, function (imagenEmpresa) {
                        var imagen = imagenEmpresa;
                        $scope.generarPdfHojaVida(imagen)
                        a.inicio = ""
                        a.fin = ""
                    });

                })

            }
        }

        $scope.generarPdfHojaVida = function (imagen) {

            blockUI.start();
            /*  if ($scope.filtroCap.capacidadInterna) { */
            totalpaginastamaño = $scope.hojaVida.experienciasLaborales.length + $scope.hojaVida.formacionesAcademicas.length + $scope.capacidades.length
            /*   } else {
                  totalpaginastamaño = $scope.hojaVida.experienciasLaborales.length + $scope.hojaVida.formacionesAcademicas.length
              } */
            promesaPaciente = obtenerEmpleadoRh($scope.empleado.id)
            promesaPaciente.then(function (dato) {
                if (dato.clase != undefined) {
                    dato.medicoPaciente.tipo_contrato = dato.clase
                }
                $scope.empleado2 = dato.medicoPaciente

                //	var inventarios = $scope.inventarios;
                var doc = new PDFDocument({ compress: false, size: [612, 792], margin: 10 });
                var stream = doc.pipe(blobStream());
                // draw some text
                var totalCosto = 0;
                var y = 205, itemsPorPagina = 20, items = 0, pagina = 1, totalPaginas = Math.ceil(totalpaginastamaño / itemsPorPagina);
                $scope.dibujarCabeceraPDFHojaVida(doc, 1, totalPaginas, imagen);
                doc.font('Helvetica', 7);
                for (var i = 0; i < $scope.hojaVida.formacionesAcademicas.length; i++) {
                    formacion = $scope.hojaVida.formacionesAcademicas[i]
                    doc.text(formacion.anio_obtencion, 80, y);
                    doc.text(formacion.institucion.nombre, 170, y, { width: 100 });
                    doc.text(formacion.grado.nombre, 305, y, { width: 100 });
                    doc.text(formacion.titulo.nombre, 405, y, { width: 100 });
                    if (formacion.institucion.nombre.length > 20 || formacion.grado.nombre.length > 20 || formacion.titulo.nombre.length > 20) {
                        rowinstituto = formacion.institucion.nombre.length / 20
                        rowgrado = formacion.grado.nombre.length / 20
                        rowtitulo = formacion.titulo.nombre.length / 20
                        arregloTamaño = [Math.floor(rowinstituto), Math.floor(rowgrado), Math.floor(rowtitulo)]
                        var rows = Math.max.apply(null, arregloTamaño);
                        var tamaño = rows * 10
                        y = y + tamaño
                    }
                    y = y + 20;
                    items++;
                    //totalCosto = totalCosto + inventarios[i].costo_total;
                    if (y >= 725) {
                        doc.addPage({ margin: 0, bufferPages: true });

                        y = 90;
                        items = 0;
                        doc.rect(25, y - 20, 550, 15).fill("silver", "#000");
                        doc.font('Helvetica-Bold', 8).fill('black')
                        doc.text("GRADO DE INSTRUCCIONES", 35, y);
                        doc.font('Helvetica-Bold', 8);
                        doc.text("AÑO DE OBTENCIÓN", 45, y);
                        doc.text("INSTITUCIÓN", 170, y);
                        doc.text("GRADO", 305, y);
                        doc.text("CARRERA", 405, y);
                        pagina = pagina + 1;
                        doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 750, { align: "center" });
                        doc.font('Helvetica', 7);
                    }
                }
                /*     for (var j = 0; j < $scope.hojaVida.logros.length; j++) {
    
                       
                        doc.text("FECHA2", 80, y);
                        doc.text("INSTITUCIÓN2", 185, y);
                        doc.text("GRADO2", 305, y);
                        doc.text("CARRERA2", 405, y);
                        y = y + 10;
    
    
                        items++;
                        //totalCosto = totalCosto + inventarios[i].costo_total;
                        if (y >=785) {
                            doc.addPage({ margin: 0, bufferPages: true });
                            y = 90;
                            items = 0;
                            pagina = pagina + 1;
                            $scope.dibujarCabeceraPDFHojaVida(doc, pagina, totalPaginas);
                            doc.font('Helvetica', 7);
                        }
                    } */
                /*  if ($scope.filtroCap.capacidadInterna) { */
                for (var j = 0; j < $scope.capacidades.length; j++) {
                    var capacidad = $scope.capacidades[j]
                    if (j == 0) {
                        y += 15

                        doc.rect(25, y - 20, 550, 15).fill("silver", "#000");
                        doc.font('Helvetica-Bold', 8).fill('black')
                        doc.text("CURSO,CAPACIDADES Y SEMINARIOS", 35, y - 15);
                        doc.font('Helvetica-Bold', 8);
                        doc.text("FECHA", 45, y);
                        doc.text("INSTITUCIÓN", 170, y);
                        doc.text("GRADO", 305, y);
                        doc.text("CARRERA", 405, y);
                        y = y + 20;
                    }
                    doc.font('Helvetica', 8);
                    capacidad.fechaTexto = $scope.fechaATexto(capacidad.fecha)
                    doc.text(capacidad.fechaTexto, 40, y, { width: 100 });
                    doc.text(capacidad.curso, 170, y, { width: 100 });
                    doc.text(capacidad.institucion, 305, y, { width: 80 });
                    doc.text(capacidad.certificado, 405, y, { width: 100 });
                    if (capacidad.curso.length > 20 || capacidad.institucion.length > 17 || capacidad.certificado.length > 20) {
                        rowcurso = capacidad.curso.length / 20
                        rowinstituto = capacidad.institucion.length / 17
                        rowcertificado = capacidad.certificado.length / 20
                        arregloTamaño = [Math.floor(rowcurso), Math.floor(rowinstituto), Math.floor(rowcertificado)]
                        var rows = Math.max.apply(null, arregloTamaño);
                        var tamaño = rows * 10
                        y = y + tamaño
                    }
                    y = y + 20;


                    items++;
                    //totalCosto = totalCosto + inventarios[i].costo_total;
                    if (y >= 725) {
                        doc.addPage({ margin: 0, bufferPages: true });
                        y = 90;

                        items = 0;
                        doc.rect(25, y - 20, 550, 15).fill("silver", "#000");
                        doc.font('Helvetica-Bold', 8).fill('black')
                        doc.text("CURSO,CAPACIDADES Y SEMINARIOS", 35, y - 15);
                        doc.font('Helvetica-Bold', 8);
                        doc.text("FECHA", 45, y);
                        doc.text("INSTITUCIÓN", 170, y);
                        doc.text("GRADO", 305, y);
                        doc.text("CARRERA", 405, y);
                        y += 20;
                        pagina = pagina + 1;
                        doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 750, { align: "center" });
                        doc.font('Helvetica', 7);
                    }
                }
                /* } */
                for (var h = 0; h < $scope.hojaVida.experienciasLaborales.length; h++) {
                    var experienciaLaboral = $scope.hojaVida.experienciasLaborales[h]
                    if (h == 0) {
                        y += 15
                        doc.rect(25, y - 20, 550, 15).fill("silver", "#000");
                        doc.font('Helvetica-Bold', 8).fill('black')
                        doc.text("EXPERIENCIA LABORAL", 35, y - 15);
                        doc.font('Helvetica-Bold', 8);
                        doc.text("DESDE", 45, y);
                        doc.text("HASTA", 120, y);
                        doc.text("EMPRESA", 205, y);
                        doc.text("CARGO", 305, y);
                        doc.text("REFERENCIA", 385, y);
                        doc.text("TELEFONO", 485, y);
                        y = y + 20;
                    }
                    doc.font('Helvetica', 8);
                    doc.text(experienciaLaboral.fecha_inicioTexto, 40, y, { width: 100 });
                    doc.text(experienciaLaboral.fecha_finTexto, 115, y, { width: 100 });

                    doc.text(experienciaLaboral.empresa, 205, y, { width: 80 });
                    doc.text(experienciaLaboral.cargo, 305, y, { width: 60 });
                    doc.text(experienciaLaboral.contacto, 385, y, { width: 100 });
                    doc.text(experienciaLaboral.telefono, 485, y, { width: 100 });
                    if (experienciaLaboral.empresa.length > 17 || experienciaLaboral.cargo.length > 13 || experienciaLaboral.contacto.length > 20) {
                        rowempresa = experienciaLaboral.empresa.length / 17
                        rowcargo = experienciaLaboral.cargo.length / 13
                        rowcontacto = experienciaLaboral.contacto.length / 20
                        arregloTamaño = [Math.floor(rowempresa), Math.floor(rowcargo), Math.floor(rowcontacto)]
                        var rows = Math.max.apply(null, arregloTamaño);
                        var tamaño = rows * 10
                        y = y + tamaño
                    }
                    y = y + 20;
                    items++;
                    //totalCosto = totalCosto + inventarios[i].costo_total;
                    if (y >= 725) {

                        y = y + 20;
                        doc.addPage({ margin: 0, bufferPages: true });

                        y = 90;
                        items = 0;
                        doc.rect(25, y - 20, 550, 15).fill("silver", "#000");
                        doc.font('Helvetica-Bold', 8).fill('black')
                        doc.text("EXPERIENCIA LABORAL", 35, y - 15);
                        doc.font('Helvetica-Bold', 8);
                        doc.text("DESDE", 45, y);
                        doc.text("HASTA", 120, y);
                        doc.text("EMPRESA", 205, y);
                        doc.text("CARGO", 305, y);
                        doc.text("REFERENCIA", 385, y);
                        doc.text("TELEFONO", 485, y);
                        y += 20;
                        pagina = pagina + 1;
                        doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 750, { align: "center" });
                        doc.font('Helvetica', 7);
                    }
                }
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
                blockUI.stop();
            })
        }
        $scope.dibujarCabeceraPDFHojaVida = function (doc, pagina, totalPaginas, imagen) {
            doc.font('Helvetica-Bold', 12);
            doc.rect(25, 30, 550, 20).fill("silver", "#000");
            doc.font('Helvetica-Bold', 12).fill('black')
            doc.text("HOJA DE VIDA", 0, 35, { align: "center" });
            doc.image(imagen, 400, 70, { width: 80, height: 80 });
            doc.font('Helvetica-Bold', 10);
            //doc.text("SUCURSAL:" + $scope.reporte.sucursal.nombre + " - ALMACEN:" + $scope.reporte.almacen.nombre, 0, 38, { align: "center" });
            doc.font('Helvetica-Bold', 8);
            doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 750, { align: "center" });
            doc.font('Helvetica-Bold', 8);
            doc.text("NOMBRE Y APELLIDO:", 45, 60);
            doc.text("NACIONALIDAD:", 45, 70);
            doc.text("LUGAR DE NACIMIENTOS:", 45, 80);
            doc.text("RESIDENCIA ACTUAL:", 45, 90);
            doc.text("DIRECCION:", 45, 100);
            doc.text("CI:", 45, 110);
            doc.text("ESTADO CIVIL:", 45, 120);
            doc.text("TELEFONO:", 45, 130);
            doc.text("CELULAR:", 45, 140);
            doc.text("E-MAIL:", 45, 150);
            doc.font('Helvetica', 8);
            doc.text($scope.empleado2.persona.nombre_completo, 170, 60);
            doc.text($scope.empleado2.persona.pais_nacimiento, 170, 70);
            doc.text($scope.empleado2.persona.ciudad_nacimiento + " / " + $scope.empleado2.persona.provincia_nacimiento + " / " + $scope.empleado2.persona.localidad_nacimiento, 170, 80);
            doc.text("", 170, 90);
            doc.text($scope.empleado2.persona.direccion_zona, 170, 100);
            doc.text($scope.empleado2.persona.ci, 170, 110);
            doc.text($scope.empleado2.persona.estado_civil, 170, 120);
            doc.text($scope.empleado2.persona.telefono, 170, 130);
            doc.text($scope.empleado2.persona.telefono_movil, 170, 140);
            doc.text($scope.empleado2.persona.correo_electronico, 170, 150);
            doc.rect(25, 165, 550, 15).fill("silver", "#000");
            doc.font('Helvetica-Bold', 8).fill('black')
            doc.text("GRADO DE INSTRUCCIONES", 35, 170);
            doc.font('Helvetica-Bold', 8);
            doc.text("AÑO DE OBTENCIÓN", 45, 185);
            doc.text("INSTITUCIÓN", 170, 185);
            doc.text("GRADO", 305, 185);
            doc.text("CARRERA", 405, 185);
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

            var fecha = new Date()
            var textomes = ""
            var textocargos = ""
            var mes2 = fecha.getMonth()
            $scope.meses.forEach(function (mes) {
                if (mes.id == mes2) {
                    textomes = mes.nombre
                }
            });
            $scope.ficha.cargo.forEach(function (cargo) {
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
            $scope.ficha.cargo.forEach(function (cargo) {
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

        //prestamos
        $scope.calcularCuota = function (prestamo) {
            var cuotaSinInteres = prestamo.monto / prestamo.plazo
            var interes = (cuotaSinInteres * prestamo.interes_pactado) / 100
            prestamo.cuota = cuotaSinInteres + interes
            prestamo.cuota2 = $scope.number_format(prestamo.cuota, 2)
            var años = 0;
            var meses = 0;
            var tiempo = prestamo.plazo

            do {
                tiempo = tiempo - 12
                años++
                if (tiempo <= 12) {
                    meses = tiempo
                }
            } while (tiempo > 12)
            if (prestamo.plazo > 12) {
                prestamo.tiempo_plazo_literal = años + " año y " + (prestamo.plazo - (años * 12)) + " meses"
            } else {
                prestamo.tiempo_plazo_literal = prestamo.plazo + " meses"
            }
        }
        $scope.GuardarPrestamo = function (prestamo) {
            prestamo.id_usuario = $scope.usuario.id
            prestamo.fecha_inicial = new Date($scope.convertirFecha(prestamo.fecha_inicial))
            prestamo.total = ((prestamo.monto * prestamo.interes_pactado) / 100) + prestamo.monto
            var promesa = CrearPrestamo($scope.empleado.id, prestamo)
            promesa.then(function (datos) {
                $scope.imprimirPrestamo(prestamo)
                $scope.cerrarDialogNuevoPrestamo()
                $scope.prestamo = {}
                $scope.mostrarMensaje(datos.mensaje)
            })

        }
        $scope.GuardarMultiplesPrestamos = function (prestamo) {
            var idEmpleado = 0
            prestamo.id_usuario = $scope.usuario.id
            prestamo.fecha_inicial = $scope.convertirFecha(prestamo.fecha_inicial)
            prestamo.total = ((prestamo.monto * prestamo.interes_pactado) / 100) + prestamo.monto
            var promesa = CrearPrestamo(idEmpleado, prestamo)
            promesa.then(function (datos) {
                $scope.cerrarDialogPretamosNuevoTodos()
                $scope.optenerListaPrestamos()

                $scope.mostrarMensaje(datos.mensaje)
                $scope.prestamo = {}
            })

        }
        $scope.imprimirPrestamo = function (prestamo) {
            var doc = new PDFDocument({ size: [792, 612], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
            var stream = doc.pipe(blobStream());
            doc.rect(40, 90, 712, 432).stroke();
            doc.rect(635, 125, 100, 30).stroke();
            doc.font('Helvetica-Bold', 16);
            doc.text("Nro. 11111", 640, 133)
            doc.font('Helvetica-Bold', 14);
            doc.text($scope.usuario.empresa.razon_social, 65, 95)
            doc.text("Santa Cruz" + "- Bolivia", 55, 110)
            doc.text("NIT: ", 55, 125)
            doc.font('Helvetica', 14);
            doc.text($scope.usuario.empresa.nit + ".", 80, 125)
            doc.font('Helvetica-Bold', 14);
            doc.text("PRESTAMO AL PERSONAL", 0, 135, { align: 'center' })
            doc.font('Helvetica-Bold', 14);
            doc.text("Empleado ", 55, 175)
            doc.text("Monto otorgado ", 55, 200)
            doc.text("Interés Pactado ", 55, 225)
            doc.text("Fecha des desembolso ", 55, 250)
            doc.text("Plazo ", 55, 275)
            doc.text("Monto Mensual ", 55, 300)
            doc.text("Observaciones ", 55, 325)
            doc.text("Sueldo Básico ", 55, 350)
            doc.font('Helvetica', 14);
            doc.text($scope.empleado.nombre_completo, 220, 175)
            doc.text($scope.number_format(prestamo.monto, 2), 220, 200)
            doc.text(prestamo.interes_pactado + "%", 220, 225)
            var fecha = $scope.fechaATexto(prestamo.fecha_inicial)
            doc.text(fecha, 220, 250)
            doc.text(prestamo.plazo, 220, 275)
            doc.text(prestamo.cuota2, 220, 300)
            doc.text(prestamo.observacion, 220, 325)
            doc.text($scope.number_format($scope.empleado.ficha.haber_basico, 2), 220, 350)
            doc.font('Helvetica-Bold', 14);
            doc.text("Recibí Conforme ", 55, 500)
            doc.text("Responsable de Área ", 225, 500)
            doc.text("Encargado RRHH ", 425, 500)
            doc.text("Contabilidad ", 605, 500)
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
        }
        $scope.GuardarPagoPrestamo = function (prestamo) {
            /* if (prestamo.monto_pagado != prestamo.cuota) { */
            if (prestamo.prestamoPagos.length > 0) {
                var montopaga = prestamo.monto_pagado + prestamo.prestamoPagos[(prestamo.prestamoPagos.length - 1)].a_cuenta_anterior
                var cuotaSinInteres = (prestamo.total - montopaga) / prestamo.plazo_restante
                prestamo.cuota2 = cuotaSinInteres
            } else {
                var cuotaSinInteres = (prestamo.total - prestamo.monto_pagado) / prestamo.plazo_restante
                prestamo.cuota2 = cuotaSinInteres
            }

            /* } */
            /*   if (prestamo.monto_pagado == prestamo.total) {
                  prestamo.cuota2 = 0
              } */
            prestamo.pagoFecha = new Date()
            var promesa = CrearPagoPrestamo($scope.usuario.id, $scope.prestamo.id, prestamo)
            promesa.then(function (datos) {
                //$scope.imprimirPrestamo(prestamo)
                $scope.cerrarDialogPagoPrestamo()
                $scope.optenerListaPrestamos()
                $scope.prestamo = {}
                $scope.mostrarMensaje(datos.mensaje)
            })
        }

        $scope.abrirModalVerificarCuenta = function (dato, tipo) {
            $scope.dato = dato
            $scope.tipoDatosPermiso = tipo
            $scope.abrirPopup($scope.IdModalVerificarCuenta);
        }
        $scope.cerrarModalVerificarCuenta = function () {
            $scope.cerrarPopup($scope.IdModalVerificarCuenta);
        }

        $scope.EditarMontoPrestamo = function (prestamo) {
            prestamo.montoEdit = false
            prestamo.total = ((prestamo.monto * prestamo.interes_pactado) / 100) + prestamo.monto
            var cuotaSinInteres = prestamo.monto / prestamo.plazo
            var interes = (cuotaSinInteres * prestamo.interes_pactado) / 100
            prestamo.cuota = cuotaSinInteres + interes
            if (prestamo.prestamoPagos.length > 0) {
                prestamo.prestamoPagos.forEach(function (pago, index, array) {
                    pago.saldo_anterior = prestamo.total - pago.a_cuenta_anterior
                    if (index === (array.length - 1)) {
                        var promesa = EditarPrestamo(prestamo)
                        promesa.then(function (dato) {
                            $scope.mostrarMensaje(dato.mensaje)
                        })
                    }
                });
            } else {
                var promesa = EditarPrestamo(prestamo)
                promesa.then(function (dato) {
                    $scope.mostrarMensaje(dato.mensaje)
                })
            }
        }
        $scope.CancelarEditMontoPrestamo = function (prestamo) {
            $scope.optenerListaPrestamos()
        }

        $scope.verificarCuentaAdmin = function (cuenta) {
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {

                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    /*  cuenta.abierto= cuenta.abierto; */
                    if ($scope.tipoDatosPermiso == "anticipo") {
                        if (!$scope.dato.montoEdit) {
                            $scope.dato.montoEdit = true
                        } else {
                            $scope.dato.montoEdit = false
                        }
                    }
                    if ($scope.tipoDatosPermiso == "datosLaborales") {
                        if (!$scope.dato.editDatosLaborales) {
                            $scope.dato.editDatosLaborales = true
                        } else {
                            $scope.dato.editDatosLaborales = false
                        }
                    }
                    $scope.cerrarModalVerificarCuenta();
                } else {
                    $scope.mostrarMensaje(dato.message)
                }
            })
        }

        $scope.obtenerListaEmpleados = function () {
            var promesa = ListaEmpleadosRrhh($scope.usuario.id_empresa)
            promesa.then(function (dato) {
                dato.empleados.forEach(function (empleado, index, array) {
                    empleado.ficha = empleado.empleadosFichas[0]
                    if (index === (array.length - 1)) {
                        $scope.llenarEmpleados(dato.empleados)
                    }

                });


            })
        }
        $scope.llenarEmpleados = function (empleados) {
            $scope.todosLosEmpleados = [];
            for (var i = 0; i < empleados.length; i++) {
                var empleado = {
                    nombre: empleados[i].persona.nombre_completo,
                    persona: empleados[i].persona,
                    ficha: empleados[i].ficha,
                    maker: "",
                    ticked: false,
                    id: empleados[i].id
                }
                $scope.todosLosEmpleados.push(empleado);
                if (i === (empleados.length - 1)) {
                    $scope.seleccionarEmpleados($scope.empleadosSeleccionados)
                }
            }
        }
        $scope.seleccionarEmpleados = function (empleados) {
            for (var i = 0; i < $scope.todosLosEmpleados.length; i++) {
                for (var j = 0; j < empleados.length; j++) {
                    if (empleados[i].select) {
                        $scope.todosLosEmpleados[i].ticked = true;
                    }
                }
            }
        }
        //fin prestamos

        //inicio rol turno
        $scope.GuardarRolTurno = function (rolTurno) {
            rolTurno.fecha_inicio = new Date($scope.convertirFecha(rolTurno.fecha_inicio))
            rolTurno.fecha_fin = new Date($scope.convertirFecha(rolTurno.fecha_fin))
            rolTurno.id_ficha = $scope.empleado.ficha.id
            var promesa = CrearRolTurno($scope.empleado.id, rolTurno)
            promesa.then(function (datos) {
                //$scope.imprimirPrestamo(prestamo)
                rolTurno = {}
                $scope.cerrarDialogRolTurnos()
                $scope.mostrarMensaje(datos.mensaje)
            })
        }
        $scope.calcularDatosRolTurno = function (rolTurno) {
            if (rolTurno.fecha_inicio && rolTurno.fecha_inicio.length == 10) {
                if (rolTurno.tipo) {
                    rolTurno.fecha_fin = $scope.SumarDiasMesesAñosfecha(rolTurno.fecha_inicio, 35, "d", "/")
                    rolTurno.dias_trabajo = 15;
                    rolTurno.dias_descanso = 20;
                } else {
                    rolTurno.fecha_fin = $scope.SumarDiasMesesAñosfecha(rolTurno.fecha_inicio, 22, "d", "/")
                    rolTurno.dias_trabajo = 7;
                    rolTurno.dias_descanso = 15;
                }
            } else {
                $scope.rolTurno = { tipo: false, fecha_fin: "", dias_trabajo: null, dias_descanso: null, grupo: "", id_ficha: null }
            }
        }
        $scope.obtenerlistaRolTurno = function (idficha) {
            var promesa = ListaRolTurnos($scope.usuario.id_empresa, idficha)
            promesa.then(function (datos) {
                $scope.listaRolTurno = datos.rolesTurno

            })
        }
        ListaRolTurnos
        //fin rol turno

        //inicio horas extra
        $scope.guardarHorasExtra = function (horasExtra) {
            horasExtra.fecha = new Date($scope.convertirFecha(horasExtra.fecha))
            horasExtra.hora_inicio2 = $scope.fechaATiempo(horasExtra.hora_inicio)
            horasExtra.hora_fin2 = $scope.fechaATiempo(horasExtra.hora_fin)
            horasExtra.id_ficha = $scope.empleado.ficha.id
            var promesa = CrearHorasExtra($scope.empleado.id, horasExtra)
            promesa.then(function (datos) {
                $scope.cerrarDialogHorasExtras()
                $scope.horaExtra = {}
                $scope.mostrarMensaje(datos.mensaje)
            })
        }
        $scope.calcularTiempoHorasExtra = function (horasExtra) {

            if (horasExtra.hora_inicio instanceof Date && horasExtra.hora_fin instanceof Date) {
                var horaInicio = horasExtra.hora_inicio.getHours()
                var horafin = horasExtra.hora_fin.getHours()
                var minInicio = horasExtra.hora_inicio.getMinutes()
                var minFin = horasExtra.hora_fin.getMinutes()
                if (horaInicio < horafin) {
                    var fechaInicioTexto = moment(horasExtra.hora_inicio).format('YYYY-MM-DD HH:mm:ss');
                    var fechaFinTexto = moment(horasExtra.hora_fin).format('YYYY-MM-DD HH:mm:ss');
                    var fecha1 = moment(fechaInicioTexto, "YYYY-MM-DD HH:mm:ss");
                    var fecha2 = moment(fechaFinTexto, "YYYY-MM-DD HH:mm:ss");
                    var diff = fecha2.diff(fecha1, 's');
                    horasExtra.tiempo = $scope.caluclarDiferencia(diff)
                } else if (horaInicio == horafin && minInicio < minFin) {
                    var fechaInicioTexto = moment(horasExtra.hora_inicio).format('YYYY-MM-DD HH:mm:ss');
                    var fechaFinTexto = moment(horasExtra.hora_fin).format('YYYY-MM-DD HH:mm:ss');
                    var fecha1 = moment(fechaInicioTexto, "YYYY-MM-DD HH:mm:ss");
                    var fecha2 = moment(fechaFinTexto, "YYYY-MM-DD HH:mm:ss");
                    var diff = fecha2.diff(fecha1, 's');
                    horasExtra.tiempo = $scope.caluclarDiferencia(diff)
                } else {
                    horasExtra.tiempo = ""
                }
            }
        }

        $scope.fechaATiempo = function (fecha) {
            var hours = fecha.getHours();
            var minutes = fecha.getMinutes();
            var seconds = fecha.getSeconds();
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            //Anteponiendo un 0 a los segundos si son menos de 10 
            seconds = seconds < 10 ? '0' + seconds : seconds;
            return hours + ":" + minutes + ":" + seconds;  // 2:41:30
        }
        $scope.caluclarDiferencia = function (time) {
            var hours = Math.floor(time / 3600);
            var minutes = Math.floor((time % 3600) / 60);
            var seconds = time % 60
            //Anteponiendo un 0 a los minutos si son menos de 10 
            minutes = minutes < 10 ? '0' + minutes : minutes;
            //Anteponiendo un 0 a los segundos si son menos de 10 
            seconds = seconds < 10 ? '0' + seconds : seconds;
            return hours + ":" + minutes + ":" + seconds;  // 2:41:30
        }

        $scope.obtenerHistorialHorasExtra = function (filtroHorasExtra) {
            var filtro = {}
            filtro.inicio = (filtroHorasExtra.inicio.length == 10) ? new Date($scope.convertirFecha(filtroHorasExtra.inicio)) : 0
            filtro.fin = (filtroHorasExtra.fin.length == 10) ? new Date($scope.convertirFecha(filtroHorasExtra.fin)) : 0
            var promesa = HistorialHorasExtra($scope.empleado.ficha.id, filtro)
            promesa.then(function (dato) {
                $scope.ListaHorasExtraEmpleado = dato
                if ($scope.ListaHorasExtraEmpleado.length > 0) {
                    $scope.sumarTotalHorasExtra()
                } else {
                    $scope.SumaTotalHorasExtra = "00:00";
                }

            })
        }

        $scope.sumarTotalHorasExtra = function () {
            var totalHoras = "";
            var timeHoras = 0;
            var timeMinutos = 0;
            for (var i = 0; i < $scope.ListaHorasExtraEmpleado.length; i++) {
                var minutos = $scope.ListaHorasExtraEmpleado[i].tiempo.split(':')[1];
                var horas = $scope.ListaHorasExtraEmpleado[i].tiempo.split(':')[0];

                timeHoras = timeHoras + parseInt(horas);
                timeMinutos = timeMinutos + parseInt(minutos);
                if (timeMinutos >= 60) {
                    timeMinutos = timeMinutos - 60;
                    timeHoras = timeHoras + 1;
                }
                totalHoras = String("0" + timeHoras).slice(-3) + ':' + String("0" + timeMinutos).slice(-2);
            }
            $scope.SumaTotalHorasExtra = totalHoras;
        }
        //fin horas extra

        //inicio anticipos        
        $scope.GuardarAnticipos = function (anticipos) {
            var anticipo = anticipos.slice(-1).pop()
            anticipo.montoExtraoridnario = anticipo.total - anticipo.anticipo_ordinaro
            anticipo.textoClase = "EXTRAORDI"
            anticipo.fecha = new Date().getTime()
            var promesa = NuevoAnticipoEmpleado($scope.empleado.id, anticipo)
            promesa.then(function (datos) {
                anticipo = {}
                $scope.cerrarDialogAnticipoExtraordinario()
                $scope.mostrarMensaje(datos.mensaje)
            })
        }
        $scope.GuardarAnticiposEmpleados = function (anticipos) {
            var datos = {}
            datos.anticipos = anticipos
            datos.textoClase = "ORDI"
            datos.fecha = new Date().getTime()
            datos.anticipos.forEach(function (anticipo, index, array) {
                anticipo.montoordinario = anticipo.monto + anticipo.anticipo_ordinaro
                if (index === (array.length - 1)) {
                    var promesa = CrearNuevosAnticiposEmpleados(datos)
                    promesa.then(function (datos) {
                        anticipo = {}
                        $scope.listaAnticipos2 = []
                        $scope.cerrarDialogAnticipoRegular()
                        $scope.mostrarMensaje(datos.mensaje)
                    })
                }
            });

        }
        $scope.buscarAnticiposExtraoridnario = function (datosFiltro) {
            $scope.anticipo_extraordinaro = 0;
            var date = new Date(datosFiltro.gestion, datosFiltro.mes.id, 1);
            var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
            var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            var filtro = { inicio: primerDia, fin: ultimoDia, nombre: "ORDI", id_empresa: 0 }
            $scope.obtenerListaAnticipos(filtro, $scope.empleado.id)

        }
        $scope.buscarAnticiposOridnario = function (datosFiltro) {
            if (datosFiltro.gestion != undefined) {
                $scope.anticipo_extraordinaro = 0;
                var date = new Date(datosFiltro.gestion, datosFiltro.mes.id, 1);
                var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
                var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var filtro = { inicio: primerDia, fin: ultimoDia, nombre: "EXTRAORDI", id_empresa: $scope.usuario.id_empresa }
                $scope.obtenerListaAnticiposOrdi(filtro, 0)
            }
        }
        $scope.obtenerListaAnticipos = function (filtro, idEmpleado) {
            $scope.anticipo_ordinaroOextra = 0
            var promesa = ListaAnticiposEmpleado(filtro, idEmpleado)
            $scope.arregloid = []
            promesa.then(function (datos) {
                if (datos.anticipos.length > 0) {
                    datos.anticipos.ordinarios = []
                    datos.anticipos.extraordinarios = []
                    datos.anticipos.forEach(function (anticipo, index, array) {
                        anticipo.empleado.ficha = anticipo.empleado.empleadosFichas[(anticipo.empleado.empleadosFichas.length - 1)]
                        anticipo.total2 = 0
                        if (anticipo.tipoAnticipo.nombre_corto != filtro.nombre) {

                            datos.anticipos.ordinarios.push(anticipo)
                        } else {
                            $scope.anticipo_ordinaroOextra += anticipo.monto
                            datos.anticipos.extraordinarios.push(anticipo)
                        }
                        if (index === (array.length - 1)) {
                            for (let i = 0; i < datos.anticipos.ordinarios.length; i++) {
                                const ordi = datos.anticipos.ordinarios[i];
                                if (datos.anticipos.extraordinarios.length > 0) {
                                    for (let j = 0; j < datos.anticipos.extraordinarios.length; j++) {
                                        const anticipo = datos.anticipos.extraordinarios[j];
                                        if (anticipo.id_empleado == ordi.id_empleado) {
                                            if (ordi.anticipo_ordinaro) {
                                                ordi.anticipo_ordinaro += anticipo.monto
                                            } else {
                                                ordi.anticipo_ordinaro = anticipo.monto
                                            }
                                            //ordi.total += ordi.anticipo_ordinaro
                                            ordi.saldo_salario = ordi.salario_basico - ordi.total
                                            ordi.montoEdit = false
                                        } else {
                                            ordi.anticipo_ordinaro = 0
                                            ordi.saldo_salario = ordi.salario_basico - ordi.total
                                        }

                                    }
                                } else {
                                    ordi.anticipo_ordinaro = 0
                                    ordi.saldo_salario = ordi.salario_basico - ordi.total
                                }
                                if (i === (datos.anticipos.ordinarios.length - 1)) {

                                    $scope.listaAnticipos = datos.anticipos.ordinarios;
                                }

                            }
                        }

                    });
                } else {
                    $scope.listaAnticipos = []
                }

            })
        }
        $scope.obtenerListaAnticiposOrdi = function (filtro, idEmpleado) {
            $scope.anticipo_ordinaroOextra = 0
            var promesa = ListaAnticiposEmpleado(filtro, idEmpleado)
            $scope.arregloid = []
            promesa.then(function (datos) {
                if (datos.anticipos.length > 0) {
                    datos.anticipos.ordinarios = []
                    datos.anticipos.extraordinarios = []
                    datos.anticipos.forEach(function (anticipo, index, array) {
                        anticipo.empleado.ficha = anticipo.empleado.empleadosFichas[(anticipo.empleado.empleadosFichas.length - 1)]
                        anticipo.total2 = 0
                        anticipo.anticipo_extraordinaro = 0
                        anticipo.saldo_salario = anticipo.salario_basico - anticipo.total
                        if (anticipo.tipoAnticipo.nombre_corto != filtro.nombre) {

                            datos.anticipos.ordinarios.push(anticipo)

                        } else {
                            datos.anticipos.extraordinarios.push(anticipo)
                        }
                        if (index === (array.length - 1)) {
                            $scope.anticiposDatos = { ordinarios: datos.anticipos.ordinarios, extraordinarios: datos.anticipos.extraordinarios }

                            for (let i = 0; i < datos.anticipos.ordinarios.length; i++) {
                                var ordi = datos.anticipos.ordinarios[i];
                                for (let j = 0; j < datos.anticipos.extraordinarios.length; j++) {
                                    const anticipo = datos.anticipos.extraordinarios[j];
                                    if (anticipo.id_empleado == ordi.id_empleado) {
                                        if (ordi.anticipo_extraordinaro) {
                                            ordi.anticipo_extraordinaro += anticipo.monto
                                        } else {
                                            ordi.anticipo_extraordinaro = anticipo.monto
                                        }
                                        /*   ordi.total += ordi.anticipo_extraordinaro */

                                        ordi.saldo_salario = ordi.salario_basico - ordi.total
                                        ordi.montoEdit = false
                                    } else {
                                        if (ordi.anticipo_ordinaro) {
                                            ordi.anticipo_ordinaro += anticipo.monto
                                        } else {
                                            ordi.anticipo_ordinaro = anticipo.monto
                                        }
                                        ordi.anticipo_extraordinaro = 0

                                        ordi.saldo_salario = ordi.salario_basico - ordi.total
                                    }

                                }

                                if (i === (datos.anticipos.ordinarios.length - 1)) {

                                    $scope.listaAnticipos = datos.anticipos.ordinarios;

                                }

                            }

                        }
                    })
                } else {
                    $scope.listaAnticipos = []
                }

            })
        }
        $scope.AgregarAnticipoOrdinario = function (datos) {
            var monto = datos.monto
            var tope = 0
            var porcentaje = null
            if (datos.tope) {
                tope = datos.tope
            } else {
                tope = null
            }
            datos.empleados.forEach(function (empleado, index, array) {
                if (datos.tipo) {
                    monto = (empleado.ficha.haber_basico * datos.monto) / 100;
                    porcentaje = datos.monto
                }
                if ($scope.listaAnticipos2.length == 0) {
                    var anticipo = { fecha: new Date(), empleado: empleado, monto: monto, anticipo_extraordinaro: null, total: null, salario_basico: empleado.ficha.haber_basico, saldo_salario: empleado.ficha.haber_basico, tope: tope, tipo_porcentual: datos.tipo, porcentaje: porcentaje }

                } else {

                    var anticipo = { fecha: new Date(), empleado: empleado, monto: monto, anticipo_extraordinaro: null, total: null, salario_basico: empleado.ficha.haber_basico, saldo_salario: null, tope: tope, tipo_porcentual: datos.tipo, porcentaje: porcentaje }
                    anticipo.saldo_salario = anticipo.salario_basico - anticipo.total
                }
                anticipo.anticipo_extraordinaro = 0
                anticipo.anticipo_ordinaro = 0
                if ($scope.anticiposDatos) {
                    if ($scope.anticiposDatos.ordinarios.length > 0) {
                        for (let i = 0; i < $scope.anticiposDatos.ordinarios.length; i++) {
                            const ordi = $scope.anticiposDatos.ordinarios[i];
                            if (anticipo.empleado.id == ordi.id_empleado) {
                                anticipo.anticipo_ordinaro += ordi.monto
                            }
                        }

                    }


                    if ($scope.anticiposDatos.extraordinarios.length > 0) {
                        for (let i = 0; i < $scope.anticiposDatos.extraordinarios.length; i++) {
                            const ordi = $scope.anticiposDatos.extraordinarios[i];
                            if (anticipo.empleado.id == ordi.id_empleado) {
                                anticipo.anticipo_extraordinaro += ordi.monto
                            }
                        }
                    }
                } else {
                    anticipo.anticipo_ordinaro = 0
                    anticipo.anticipo_extraordinaro = 0
                }
                anticipo.total = anticipo.anticipo_extraordinaro + anticipo.anticipo_ordinaro + anticipo.monto
                anticipo.total2 = anticipo.anticipo_extraordinaro + anticipo.anticipo_ordinaro + anticipo.monto
                anticipo.saldo_salario = anticipo.salario_basico - anticipo.total
                anticipo.saldo_salario2 = anticipo.salario_basico - anticipo.total
                $scope.listaAnticipos2.push(anticipo)
                if (index === (array.length - 1)) {
                    $scope.cerrarDialogNuevoAnticipoRegularTodos()
                    $scope.anticipo = {}

                }
            });

        }
        $scope.AgregarAnticipoExtraordinario = function () {
            /*   $scope.obtenerAnticiposExtra($scope.empleado) */
            if ($scope.listaAnticipos.length == 0) {
                var anticipo = { fecha: new Date(), monto: null, total2: $scope.anticipo_ordinaroOextra, anticipo_ordinaro: $scope.anticipo_ordinaroOextra, total: $scope.anticipo_ordinaroOextra, salario_basico: $scope.empleado.ficha.haber_basico, saldo_salario: $scope.empleado.ficha.haber_basico }
                $scope.listaAnticipos.push(anticipo)
            } else {
                if ($scope.listaAnticipos[$scope.listaAnticipos.length - 1].id) {


                    var anticipo = { fecha: new Date(), monto: null, anticipo_ordinaro: $scope.anticipo_ordinaroOextra, total: $scope.listaAnticipos[$scope.listaAnticipos.length - 1].total, salario_basico: $scope.empleado.ficha.haber_basico, saldo_salario: null }

                    anticipo.saldo_salario = anticipo.salario_basico - anticipo.total

                    $scope.listaAnticipos.push(anticipo)
                } else {
                    $scope.mostrarMensaje("cuenta con 1 anticipo sin guardar!")
                }

            }
        }
        $scope.sumarMontoPrestamoNuevo = function (anticipo) {
            /*  if (anticipo.id == undefined) { */
            if ($scope.listaAnticipos.length > 1) {
                if (anticipo.monto) {
                    anticipo.total = $scope.listaAnticipos[$scope.listaAnticipos.length - 2].total + anticipo.monto
                } else {
                    if (anticipo.anticipo_ordinaro) {
                        anticipo.total = anticipo.anticipo_ordinaro
                    } else {
                        anticipo.total = anticipo.anticipo_extraordinaro
                    }
                }

            } else {
                anticipo.total2 = anticipo.anticipo_ordinaro
                if (anticipo.monto) {
                    anticipo.total = anticipo.total2 + anticipo.monto
                } else {
                    if (anticipo.anticipo_ordinaro) {
                        anticipo.total = anticipo.anticipo_ordinaro
                    } else {
                        anticipo.total = anticipo.anticipo_extraordinaro
                    }
                }
            }

            anticipo.saldo_salario = anticipo.salario_basico - anticipo.total
        }
        $scope.sumarMontoPrestamoNuevo2 = function (anticipo) {

            anticipo.total = anticipo.anticipo_extraordinaro + anticipo.monto + anticipo.anticipo_ordinaro
            anticipo.saldo_salario = anticipo.salario_basico - anticipo.total
        }

        $scope.ActualizarAnticipo = function (anticipo) {
            anticipo.montoExtraoridnario = anticipo.total - anticipo.anticipo_ordinaro
            var promesa = ActualizarAnticipoEmpleado(anticipo.id_empleado, anticipo)
            promesa.then(function (datos) {
                anticipo.montoEdit = false
                $scope.cerrarDialogAnticipoExtraordinario()
                $scope.mostrarMensaje(datos.mensaje)
            })
        }
        $scope.ActualizarAnticipoOrdi = function (anticipo) {
            anticipo.anticipo_ordinaro = 0
            if ($scope.anticiposDatos) {
                if ($scope.anticiposDatos.ordinarios.length > 0) {
                    for (let i = 0; i < $scope.anticiposDatos.ordinarios.length; i++) {
                        const ordi = $scope.anticiposDatos.ordinarios[i];
                        if (anticipo.empleado.id == ordi.id_empleado && anticipo.id != ordi.id) {
                            anticipo.anticipo_ordinaro += ordi.monto
                        }
                    }

                }
            }
            anticipo.montoExtraoridnario = anticipo.total - (anticipo.anticipo_extraordinaro)
            var promesa = ActualizarAnticipoEmpleado(anticipo.id_empleado, anticipo)
            promesa.then(function (datos) {
                anticipo.montoEdit = false
                $scope.cerrarDialogAnticipoExtraordinario()
                $scope.mostrarMensaje(datos.mensaje)
            })
        }
        $scope.cancelarEdicionAnticipo = function () {
            $scope.obtenerAnticiposExtra($scope.empleado)
        }
        $scope.cancelarEdicionAnticipo = function () {
            $scope.obteneranticiposOrdi()
        }
        $scope.imprimirAnticipoRegular = function (datos, filtro) {
            var doc = new PDFDocument({ compress: false, size: 'letter', margin: 10 });
            var stream = doc.pipe(blobStream());
            var totalCosto = 0, totalTransporte = 0;
            var y = 205, itemsPorPagina = 18, items = 0, pagina = 1, totalPaginas = Math.ceil(datos.length / itemsPorPagina);
            $scope.DibujarCabeceraPDFAnticipoRegular(doc, pagina, totalPaginas, datos, filtro);
            doc.font('Helvetica', 10);
            for (var i = 0; i < datos.length && items <= itemsPorPagina; i++) {
                anticipo = datos[i]
                doc.text(i + 1, 45, y);
                doc.text(anticipo.empleado.codigo, 80, y, { width: 70 });
                doc.text(anticipo.empleado.persona.nombre_completo, 200, y, { width: 100 });
                doc.text(anticipo.monto, 320, y, { width: 100 });
                doc.text(anticipo.empleado.ficha.banco.nombre, 400, y, { width: 100 });
                doc.text(".......... ", 500, y + 2, { width: 100 });
                y += 30
                items++
                if (items == itemsPorPagina) {
                    doc.addPage({ margin: 0, bufferPages: true });
                    y = 205;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.DibujarCabeceraPDFAnticipoRegular(doc, pagina, totalPaginas, datos, filtro);
                    doc.font('Helvetica', 10);
                }
            }
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();

        }

        $scope.DibujarCabeceraPDFAnticipoRegular = function (doc, pagina, totalPaginas, anticipos, filtro) {

            var comparadorTope = 0,
                comparadorTipo = 0,
                bandera = false,
                tope = 0,
                bandera2 = false,
                bandera3 = false,
                tipo = 0,
                Datoporcentaje = 0,
                datofecha = "",
                fecha = ""
            anticipos.forEach(function (anticipo, index, array) {
                if (index == 0) {
                    comparadorTope = anticipo.tope
                    comparadorTipo = anticipo.tipo_porcentual
                    Datoporcentaje = anticipo.porcentaje
                    datofecha = $scope.fechaATexto(anticipo.fecha)
                } else {
                    if (anticipo.tope != comparadorTope) {
                        bandera = true
                    }
                    if (anticipo.tipo_porcentual != comparadorTipo) {
                        bandera2 = true
                    }
                    if ($scope.fechaATexto(anticipo.fecha) != datofecha) {
                        bandera3 = true
                    }
                }
                if (index === (array.length - 1)) {
                    tope = (bandera) ? "Diferentes Topes" : comparadorTope
                    tipo = (bandera2) ? "Diferentes tipos" : comparadorTipo = (comparadorTipo) ? "Porcentual " + Datoporcentaje + "%" : "Monto"
                    fecha = (bandera3) ? "Diferentes fechas" : datofecha
                    tope = (tope == null) ? "Sin restricción" : tope
                    doc.font('Helvetica-Bold', 14);
                    doc.text("LISTA DE ANTICIPOS", 0, 45, { align: "center" });
                    doc.font('Helvetica-Bold', 12);
                    doc.text("PERIODO : ", 45, 100);
                    doc.text("FECHA DE CREACIÓN : ", 45, 120);
                    doc.text("USUARIO : ", 45, 140);
                    doc.text("TIPO DE ANTICIPO : ", 45, 160);
                    doc.text("TOPE: ", 345, 160);
                    doc.font('Helvetica', 12);
                    if (fecha instanceof Date) { fecha = $scope.fechaATexto(fecha) }
                    doc.fillColor('blue')
                    doc.text(fecha, 185, 120);
                    doc.text($scope.usuario.persona.nombre_completo, 115, 140);
                    doc.text(filtro.mes.nombre + " " + filtro.gestion, 115, 100);
                    doc.text(tipo, 175, 160);
                    doc.text(tope, 385, 160);
                    doc.fillColor('black')
                    doc.font('Helvetica-Bold', 12);
                    doc.text("Nro.", 45, 180);
                    width = doc.widthOfString('Nro.')
                    height = doc.currentLineHeight()
                    doc.underline(45, 181, width, height)
                    doc.text("Cod. Emp.", 80, 180);
                    width = doc.widthOfString('Cod. Emp.')
                    height = doc.currentLineHeight()
                    doc.underline(80, 181, width, height)
                    doc.text("Nombre", 200, 180);
                    width = doc.widthOfString('Nombre')
                    height = doc.currentLineHeight()
                    doc.underline(200, 181, width, height)
                    doc.text("Monto", 320, 180);
                    width = doc.widthOfString('Monto')
                    height = doc.currentLineHeight()
                    doc.underline(320, 181, width, height)
                    doc.text("Mod. ", 400, 180);
                    width = doc.widthOfString('Mod')
                    height = doc.currentLineHeight()
                    doc.underline(400, 181, width, height)
                    doc.text("Firma. ", 500, 180);
                    width = doc.widthOfString('Firma')
                    height = doc.currentLineHeight()
                    doc.underline(500, 181, width, height)
                    doc.font('Helvetica', 8);
                    var currentDate = new Date();
                    doc.text("USUARIO: " + $scope.usuario.persona.nombre_completo + " fecha " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "Hrs." + currentDate.getHours() + ":" + currentDate.getMinutes(), 15, 765);
                    doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
                }
            });


        }
        $scope.listaBancos = function () {
            $scope.anticiposSeleccionados = []
            $scope.anticiposTr3 = []
            var promesa = ListaBancos($scope.usuario.id_empresa)
            $scope.arregloBancosUnion = ""
            $scope.arregloBancosMsc = ""

            var arregloCuentaBanco = []
            promesa.then(function (dato) {
                $scope.datosBancos = dato
                $scope.bancos = []

                dato.forEach(function (banco, index, array) {

                    banco.cuentas = []
                    if (index == 0) {
                        $scope.bancos.push(banco)
                    }
                    var bandera = false
                    for (let i = 0; i < $scope.bancos.length; i++) {
                        var banco2 = $scope.bancos[i]
                        if (banco2.nombre == banco.nombre) {
                            bandera = true
                        }
                        if (i === ($scope.bancos.length - 1)) {
                            if (bandera == false) {
                                $scope.bancos.push(banco)

                            }
                        }
                    }
                    if (index === (array.length - 1)) {
                        dato.forEach(function (banco, index, array) {
                            for (let i = 0; i < $scope.bancos.length; i++) {
                                var banco2 = $scope.bancos[i]
                                if (banco2.nombre == banco.nombre) {
                                    bandera = true
                                    banco2.cuentas.push(banco)

                                    i = $scope.bancos.length
                                }
                            }
                        })
                    }
                });
            })
        }
        $scope.imprimirTr3 = function (tr3, tipo) {
            var fecha = new Date(tr3.fecha)
            var mes = fecha.getMonth()
            var dia = fecha.getDate()
            var mesActual = ""
            for (let i = 0; i < $scope.meses.length; i++) {
                const element = $scope.meses[i];
                if (mes == element.id) {
                    mesActual = element.nombre
                }
            }
            mes = (mes < 10) ? "0" + mes : mes
            dia = (dia < 10) ? "0" + dia : dia
            anio = fecha.getFullYear()
            var anticiposTr3 = []
            var total = 0
            tr3.historialtr3.forEach(function (tr3H, index, array) {
                total += tr3H.anticipo.monto
                anticiposTr3.push(tr3H.anticipo)
                if (index === (array.length - 1)) {
                    var dato = { anticipos: anticiposTr3, tipo: tipo, tr3Encontrado: tr3, total: total }
                    if (tipo == "MSC") {
                        var nombreArchivo = dato.tr3Encontrado.planilla + "" + dia + "" + (mes + 1) + "" + anio + "" + dato.tr3Encontrado.numero_planilla + ".tr3"
                    } else {
                        var nombreArchivo = dato.tr3Encontrado.planilla + "" + dia + "" + (mes + 1) + "" + anio + "" + dato.tr3Encontrado.numero_planilla + ".tr3"
                    }
                    $scope.descargarArchivo($scope.generarTexto(dato), nombreArchivo);
                }
            });

        }
        $scope.imprimirCartaTr3 = function (tr3, tipo) {
            var anticiposTr3 = []
            var total = 0
            var fecha = new Date(tr3.fecha)
            var mes = fecha.getMonth()
            var dia = fecha.getDate()
            var mesActual = ""
            for (let i = 0; i < $scope.meses.length; i++) {
                const element = $scope.meses[i];
                if (mes == element.id) {
                    mesActual = element.nombre
                }
            }
            mes = (mes < 10) ? "0" + mes : mes
            dia = (dia < 10) ? "0" + dia : dia
            anio = fecha.getFullYear()
            tr3.historialtr3.forEach(function (tr3H, index, array) {
                total = tr3H.anticipo.monto
                anticiposTr3.push(tr3H.anticipo)
                if (index === (array.length - 1)) {
                    var dato = { anticipos: anticiposTr3, tipo: tipo, tr3Encontrado: tr3, total: total }
                    if (tipo == "MSC") {
                        var nombreArchivo = dato.tr3Encontrado.planilla + "" + dia + "" + (mes + 1) + "" + anio + "" + dato.tr3Encontrado.numero_planilla + ".txt"
                    } else {
                        var nombreArchivo = dato.tr3Encontrado.planilla + "" + dia + "" + (mes + 1) + "" + anio + "" + dato.tr3Encontrado.numero_planilla + ".txt"
                    }
                    $scope.descargarArchivo($scope.generarTextoCarta(dato), nombreArchivo);
                }
            });

        }
        $scope.guardarTr3Empleado = function (datos) {
            datos.fecha = new Date()
            if (datos.anticipos.length > 0) {
                var promesa = GuardarTr3(datos, $scope.usuario.id_empresa)
                promesa.then(function (dato) {
                    var fecha = new Date(dato.tr3Encontrado.fecha)
                    var mes = fecha.getMonth()
                    var dia = fecha.getDate()
                    var mesActual = ""
                    for (let i = 0; i < $scope.meses.length; i++) {
                        const element = $scope.meses[i];
                        if (mes == element.id) {
                            mesActual = element.nombre
                        }
                    }
                    mes = (mes < 10) ? "0" + mes : mes
                    dia = (dia < 10) ? "0" + dia : dia
                    anio = fecha.getFullYear()
                    $scope.cerrarModalTr3BancoMsc()
                    $scope.cerrarModalTr3BancoUnion()
                    $scope.buscarAnticiposOridnario($scope.filtroAnticipo)
                    if (datos.tipo == "MSC") {
                        var nombreArchivo = dato.tr3Encontrado.planilla + "" + dia + "" + (mes + 1) + "" + anio + "" + dato.tr3Encontrado.numero_planilla + ".txt"
                    } else {
                        var nombreArchivo = dato.tr3Encontrado.planilla + "" + dia + "" + (mes + 1) + "" + anio + "" + dato.tr3Encontrado.numero_planilla + ".txt"
                    }
                    $scope.descargarArchivo($scope.generarTexto(dato), nombreArchivo);
                    $scope.descargarArchivo($scope.generarTextoCarta(dato), nombreArchivo);
                    $scope.mostrarMensaje(dato.mensaje)
                })
            }
        }
        $scope.descargarArchivo = function (contenidoEnBlob, nombreArchivo) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var save = document.createElement('a');
                save.href = event.target.result;
                save.target = '_blank';
                save.download = nombreArchivo || 'archivo.dat';
                var clicEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                save.dispatchEvent(clicEvent);
                (window.URL || window.webkitURL).revokeObjectURL(save.href);
            };
            reader.readAsDataURL(contenidoEnBlob);
        };
        $scope.generarTextoCarta = function (datos) {
            var fecha = new Date(datos.tr3Encontrado.fecha)
            var mes = fecha.getMonth()
            var dia = fecha.getDate()
            var mesActual = ""
            for (let i = 0; i < $scope.meses.length; i++) {
                const element = $scope.meses[i];
                if (mes == element.id) {
                    mesActual = element.nombre
                }
            }
            mes = (mes < 10) ? "0" + mes : mes
            dia = (dia < 10) ? "0" + dia : dia
            anio = fecha.getFullYear()
            var totalLiteral = ConvertirALiteral(datos.total.toFixed(2));
            var texto = [];
            if (datos.tipo == "MSC") {
                var cabezera = "\r\n\r\n" + datos.tr3Encontrado.departamento.nombre + " " + dia + " de " + mesActual + " del " + anio + "\r\n" +
                    "Nro Cite: ESS-P-29/18\r\n\r\n\r\n" +
                    "Señores \r\n" +
                    datos.tr3Encontrado.cuenta.nombre + "\r\n" +
                    "Ciudad\r\n\r\n" +
                    "Ref.: Orden de Pago\r\n\r\n" +
                    "De nuestra consideración:\r\n\r\n" +
                    "Mediante la presente y según contrato suscrito con el Banco Mercantil Santa Cruz S.A.,\r\n" +
                    "autorizamos a ustedes realizar el débito por el valor total de Bs. " + datos.total + "\r\n(" + totalLiteral + ")\r\n" +
                    "correspondiente a la cancelación de la planilla de pago(s), de acuerdo al siguiente detalle:\r\n\r\n" +

                    "* Cuenta de débito Nro:                 " + datos.tr3Encontrado.cuenta.numero + "\r\n" +
                    "* Cuenta Pago de Planilla:              " + datos.tr3Encontrado.planilla + "\r\n" +
                    "* Nombre del archivo:                   " + datos.tr3Encontrado.planilla + "" + dia + "" + (mes + 1) + "" + anio + "" + datos.tr3Encontrado.numero_planilla + ".tr3\r\n" +
                    "* Código de control:                     87fd35e019787f9612a4ffb9fc2cb415\r\n" +
                    "* Nombre / Número de planilla:  " + datos.tr3Encontrado.nombre_planilla + "\r\n" +
                    "* Monto total de débito:                 Bs " + datos.total + "\r\n\r\n" +

                    "Los datos apuntados anteriormente y el detalle de pagos, se encuentran en el archivo \r\n" +
                    datos.tr3Encontrado.planilla + "" + dia + "" + (mes + 1) + "" + anio + "" + datos.tr3Encontrado.numero_planilla + ".tr3, adjunto a la presente carta.\r\n\r\n " +

                    "Si, a los efectos de la presente, fuera necesario realizar compra venta de moneda nacional\r\n" +
                    "o extranjera,  también  autorizamos e instruimos  realizar las operaciones  necesarias  para\r\n" +
                    "cumplir  con  lo  instruido,  de  tal  manera  que se realicen  los abonos  en  la moneda  que\r\n" +
                    "corresponda a cada cuenta beneficiaria.\r\n" +
                    "de " + mesActual + " de Debo informar lo siguiente:\r\n" +
                    "El origen de los fondos corresponde al " + datos.tr3Encontrado.origen_fondos + ".\r\n" +
                    "El Destino de los Fondos, " + datos.tr3Encontrado.destino_fondos + ".\r\n\r\n" +

                    "Agradecemos su gentil atención a esta solicitud.\r\n\r\n" +

                    "Atentamente\r\n\r\n\r\n\r\n" +




                    datos.tr3Encontrado.firma_uno + "                                 " + datos.tr3Encontrado.firma_tres + "\r\n" +
                    datos.tr3Encontrado.firma_dos + "                                             " + datos.tr3Encontrado.firma_cuatro + "\r\n\r\n\r\n" +



                    "Adj. Lo citado"
                texto.push(cabezera)
                return new Blob(texto, {
                    type: 'text/plain'
                });
            } else if (datos.tipo == "BU") {

                var cabezera = "\r\n\r\nSanta Cruz" + " " + dia + " de " + mesActual + " de " + anio + "\r\n" +
                    "ESS-P-30/18\r\n" +
                    "Señores:\r\n" +
                    "BANCO UNION  S.A.\r\n" +
                    "Atn.:" + datos.tr3Encontrado.dirigido_para + "\r\n" +
                    datos.tr3Encontrado.cargo + "\r\n" +
                    "Presente.-\r\n\r\n" +
                    "\t\t\t\tRef.: Autorización para Abono de  Sueldos " + mesActual + " " + anio + "\r\n\r\n" +
                    "Mediante la presente solicitamos debiten de nuestra cuenta corriente No." + datos.tr3Encontrado.cuenta.numero + "\r\n" + "el importe total de Bs." + datos.total + "(" + totalLiteral + ")\r\n" + ", y el concepto de comisiones debitar de nuestra cuenta." + "\r\n\r\n" +
                    "Se ha realizado la verificación de nuestro extracto de cuenta  No." + datos.tr3Encontrado.cuenta.numero + ", tenemos saldo suficiente lo cual cubre el importe requerido.\r\n\r\n" +
                    "Enviamos planilla detallada adjunta.\r\n\r\n" +
                    "de Enero de Debo informar lo siguiente:\r\n\r\n" +
                    datos.tr3Encontrado.origen_fondos + "\r\n" +
                    datos.tr3Encontrado.destino_fondos + ".\r\n\r\n" +
                    "Agradeciendo de antemano su pronta respuesta vía mail, saludo a Usted cordialmente.\r\n\r\n" +
                    "Atentamente,\r\n\r\n\r\n\r\n\r\n\r\n" +
                    "\t\t" + datos.tr3Encontrado.firma_uno + "\t\t\t\t" + datos.tr3Encontrado.firma_dos + "\r\n" +
                    "\tGERENTE GENERAL\t\t\t\t" + "\t\tAUDITOR FINANCIERO\r\n"
                texto.push(cabezera)
                return new Blob(texto, {
                    type: 'text/plain'
                });
            }
        }
        $scope.generarTexto = function (datos) {
            var texto = [];
            var cuerpo = ""
            if (datos.tipo == "MSC") {
                var nombreArchivoTr3 = datos.tr3Encontrado.nombre_archivo
                var fechaPago = $scope.fechaATexto(datos.tr3Encontrado.fecha)
                if(datos.tr3Encontrado.historialtr3){
                var fecha = $scope.fechaATexto(datos.tr3Encontrado.historialtr3[0].anticipo.fecha)
            }else{
                var fecha = $scope.fechaATexto(datos.anticipos[0].fecha)
            }
                var cabezera = datos.tr3Encontrado.planilla + "|" + datos.tr3Encontrado.cuenta.numero + "|0|" + datos.tr3Encontrado.nombre_planilla + "|" + fecha + "|" + fechaPago + "|" + datos.total + "|" + datos.tr3Encontrado.numero_planilla + "\r\n"

                datos.anticipos.forEach(function (anticipo, index, array) {
                    if (anticipo.empleado.empleadosFichas) {
                        anticipo.empleado.ficha = anticipo.empleado.empleadosFichas[0]
                    }
                    fecha = $scope.fechaATexto(anticipo.fecha)
                    cabezera += (index + 1) + "|" + anticipo.empleado.persona.nombre_completo + "|" + anticipo.empleado.ficha.numero_cuenta + "|" + fecha + "|" + datos.tr3Encontrado.numero_planilla + "|" + anticipo.monto + "|||" + datos.tr3Encontrado.nombre_archivo + "\r\n"
                    if (index === (array.length - 1)) {
                        texto.push(cabezera)
                    }
                })
                return new Blob(texto, {
                    type: 'text/plain'
                });
            } else if (datos.tipo == "BU") {
                var fecha = new Date(datos.tr3Encontrado.fecha)
                var mes = fecha.getMonth()
                var dia = fecha.getDate()
                var mesActual = ""
                for (let i = 0; i < $scope.meses.length; i++) {
                    const element = $scope.meses[i];
                    if (mes == element.id) {
                        mesActual = element.nombre
                    }
                }
                mes = (mes < 10) ? "0" + mes : mes
                dia = (dia < 10) ? "0" + dia : dia
                var cabezera = "SUELDOS  " + mesActual + "  " + fecha.getFullYear() + "      " + datos.tr3Encontrado.numero_planilla + "" + dia + "" + mes + "" + fecha.getFullYear() + "\r\n"
                cabezera += datos.tr3Encontrado.cuenta.numero + "" + datos.total + "\r\n"
                datos.anticipos.forEach(function (anticipo, index, array) {
                    if (anticipo.empleado.empleadosFichas) {
                        anticipo.empleado.ficha = anticipo.empleado.empleadosFichas[0]
                    }
                    fecha = $scope.fechaATexto(anticipo.fecha)
                    cabezera += anticipo.empleado.ficha.numero_cuenta + "" + anticipo.monto + "\r\n"
                    if (index === (array.length - 1)) {
                        texto.push(cabezera)
                    }
                })
                return new Blob(texto, {
                    type: 'text/plain'
                });
            }
            //El contructor de Blob requiere un Array en el primer parámetro
            //así que no es necesario usar toString. el segundo parámetro
            //es el tipo MIME del archivo

        };
        $scope.selecionarAnticipos = function (anticipo, anticipos, todos) {

            if (anticipo) {
                if (anticipo.select == false) {
                    /*  anticipos.select = false */
                    $scope.anticiposSeleccionados.splice($scope.anticiposSeleccionados.indexOf(anticipo))
                    if (anticipo.entregado == false) {
                        $scope.anticiposTr3.splice($scope.anticiposTr3.indexOf(anticipo))
                    }
                } else {
                    /*  anticipos.select = true */
                    $scope.anticiposSeleccionados.push(anticipo)
                    if (anticipo.entregado == false) {
                        $scope.anticiposTr3.push(anticipo)
                    }

                    console.log($scope.empleadosSeleccionados)
                }
            }
            if (todos == true) {
                $scope.anticiposSeleccionados = []
                if (anticipos) {
                    anticipos.forEach(function (anticipo, index, array) {
                        anticipo.select = true
                        $scope.anticiposSeleccionados.push(anticipo)
                        if (anticipo.entregado == false) {
                            $scope.anticiposTr3.push(anticipo)
                        }
                    });
                }
            } else if (todos == false) {
                anticipos.forEach(function (anticipo, index, array) {
                    anticipo.select = false

                });
                $scope.anticiposSeleccionados = []
                $scope.anticiposTr3 = []
            }
            /*   } */
        }
        //fin anticipos

        //inicio ausencias
        $scope.obtenertiposAusenciaMedica = function () {
            $scope.tiposAusenciasMedicas = []
            blockUI.start();
            var promesa = ClasesTipo("RRHH_AUSMED");
            promesa.then(function (entidad) {
                $scope.tiposAusenciasMedicas = entidad

                blockUI.stop();
            });
        }
        $scope.obtenerTiposOtrasAusencias = function () {
            $scope.tiposOtrasAusencias = []
            blockUI.start();
            var promesa = ClasesTipo("RRHH_OTRAUS");
            promesa.then(function (entidad) {
                $scope.tiposOtrasAusencias = entidad
                blockUI.stop();
            });
        }
        $scope.CalcularDiferenciaDias = function (ausencia, otro) {
            if (otro) {
                /*    if (ausencia.fecha_inicio && ausencia.fecha_fin) {
                       var fechaInicio = new Date($scope.convertirFecha(ausencia.fecha_inicio));
                       var fechaFin = new Date($scope.convertirFecha(ausencia.fecha_fin));
                       var dato = $scope.diferenciaEntreDiasEnDias(fechaInicio, fechaFin)
                       if (dato == 0) {
                           dato = 1
                       }
                   } */
                if (ausencia.fecha_inicio && ausencia.fecha_fin) {
                    var fechaInicio = new Date($scope.convertirFecha(ausencia.fecha_inicio));
                    var fechaFin = new Date($scope.convertirFecha(ausencia.fecha_fin));
                    fechaInicio.setMinutes(ausencia.fecha_inicio_hora.getMinutes()); fechaInicio.setHours(ausencia.fecha_inicio_hora.getHours());
                    fechaFin.setMinutes(ausencia.fecha_fin_hora.getMinutes()); fechaFin.setHours(ausencia.fecha_fin_hora.getHours());
                    var fecha1 = moment('"' + fechaInicio.getFullYear() + '-' + fechaInicio.getMonth() + '-' + fechaInicio.getDate() + " " + fechaInicio.getHours() + ":" + fechaInicio.getMinutes() + ":00", "YYYY-MM-DD HH:mm:ss");
                    var fecha2 = moment('"' + fechaFin.getFullYear() + '-' + fechaFin.getMonth() + '-' + fechaFin.getDate() + " " + fechaFin.getHours() + ":" + fechaFin.getMinutes() + ":00", "YYYY-MM-DD HH:mm:ss");

                    var diff = fecha2.diff(fecha1, 'd'); // Diff in days


                    ausencia.horas = convertirSegundosATiempo(fecha2.diff(fecha1, 's')); // Diff in hours


                }
            } else {
                if (ausencia.fecha_inicio && ausencia.fecha_fin) {
                    var fechaInicio = new Date($scope.convertirFecha(ausencia.fecha_inicio));
                    var fechaFin = new Date($scope.convertirFecha(ausencia.fecha_fin));
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaInicio, fechaFin)
                    if (dato == 0) {
                        dato = 1
                    }
                }
            }
            if (ausencia.primera_baja) {
                ausencia.dias = dato - ausencia.tipo.dias_descuento
                ausencia.dias_reales = dato
            } else {
                ausencia.dias = dato
            }
        }

        $scope.crearNuevaAusencia = function (datos, otro) {

            if (otro == true) {
                var minutos = parseInt($scope.SumaTotalHoras.split(':')[1])
                var horas = parseInt($scope.SumaTotalHoras.split(':')[0])
                var minutosDatos = parseInt(datos.horas.split(':')[1])
                var horasDatos = parseInt(datos.horas.split(':')[0])
                if (horas < horasDatos) {
                    datos.fecha_inicio = new Date($scope.convertirFecha(datos.fecha_inicio));
                    datos.fecha_fin = new Date($scope.convertirFecha(datos.fecha_fin));
                    datos.fecha_inicio.setMinutes(datos.fecha_inicio_hora.getMinutes()); datos.fecha_inicio.setHours(datos.fecha_inicio_hora.getHours());
                    datos.fecha_fin.setMinutes(datos.fecha_fin_hora.getMinutes()); datos.fecha_fin.setHours(datos.fecha_fin_hora.getHours());
                    datos.compensaciones = $scope.selectionday
                    $scope.guardarAusencia($scope.empleado.ficha.id, datos)
                } else if (horas == horasDatos) {
                    if (minutos <= minutosDatos) {
                        datos.fecha_inicio = new Date($scope.convertirFecha(datos.fecha_inicio));
                        datos.fecha_fin = new Date($scope.convertirFecha(datos.fecha_fin));
                        datos.fecha_inicio.setMinutes(datos.fecha_inicio_hora.getMinutes()); datos.fecha_inicio.setHours(datos.fecha_inicio_hora.getHours());
                        datos.fecha_fin.setMinutes(datos.fecha_fin_hora.getMinutes()); datos.fecha_fin.setHours(datos.fecha_fin_hora.getHours());
                        datos.compensaciones = $scope.selectionday
                        $scope.guardarAusencia($scope.empleado.ficha.id, datos)
                    } else {
                        $scope.mostrarMensaje("La suma del total de horas compensacion es mayor al total de horas de la ausencia!")
                    }
                } else {
                    $scope.mostrarMensaje("La suma del total de horas compensacion es mayor al total de horas de la ausencia!")
                }

            } else {
                datos.fecha_inicio = new Date($scope.convertirFecha(datos.fecha_inicio));
                datos.fecha_fin = new Date($scope.convertirFecha(datos.fecha_fin));
                $scope.guardarAusencia($scope.empleado.ficha.id, datos)
            }

        }

        $scope.guardarAusencia = function (id, datos) {
            var promesa = NuevaAusenciaEmpleado(id, datos)
            promesa.then(function (dato) {
                $scope.ausencia = {}
                $scope.cerrarDialogAusenciasVacaciones()
                $scope.selectionday = []
                $scope.SumaTotalHoras = "";
                $scope.calendarCompensacion.fullCalendar('removeEvents');
                $scope.mostrarMensaje(dato.mensaje)

            })
        }
        $scope.obtenerHistorialEmpleadoAusenciasMedicas = function (filtro) {
            $scope.historialEmpleadoAusencias = []
            if (filtro.tipo_ausencia == null || filtro.tipo_ausencia == undefined) {
                filtro.tipo_ausencia = 0
            }
            var filtroAusencias = { inicio: 0, fin: 0, tipo_ausencia: filtro.tipo_ausencia }
            if (filtro.inicio) {
                filtroAusencias.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtroAusencias.fin = new Date($scope.convertirFecha(filtro.fin))
            }
            var promesa = HistorialEmpleadoAusencias($scope.empleado.ficha.id, filtroAusencias, 'RRHH_AUSMED')
            promesa.then(function (datos) {
                datos.forEach(function (dato, index, array) {
                    if (dato.primera_baja) {
                        dato.baja = "Si"
                    } else {
                        dato.baja = "No"
                    }
                    if (index === (array.length - 1)) {
                        $scope.historialEmpleadoAusencias = datos
                    }
                })
            })
        }
        $scope.obtenerHistorialEmpleadoOtrasAusencias = function (filtro) {
            if (filtro.tipo_ausencia == null || filtro.tipo_ausencia == undefined) {
                filtro.tipo_ausencia = 0
            }
            var filtroAusencias = { inicio: 0, fin: 0, tipo_ausencia: filtro.tipo_ausencia }
            if (filtro.inicio) {
                filtroAusencias.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtroAusencias.fin = new Date($scope.convertirFecha(filtro.fin))
            }
            var promesa = HistorialEmpleadoAusencias($scope.empleado.ficha.id, filtroAusencias, 'RRHH_OTRAUS')
            promesa.then(function (datos) {

                $scope.historialEmpleadoOtrasAusencias = datos

            })
        }

        //ausencias empresa
        $scope.obtenerHistorialEmpresaAusenciasMedicas = function (filtro) {
            if (filtro.tipo_ausencia == null || filtro.tipo_ausencia == undefined) {
                filtro.tipo_ausencia = 0
            }
            var filtroAusencias = { inicio: 0, fin: 0, tipo_ausencia: filtro.tipo_ausencia }
            if (filtro.inicio) {
                filtroAusencias.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtroAusencias.fin = new Date($scope.convertirFecha(filtro.fin))
            }
            var promesa = HistorialEmpresaEmpleadosAusencias($scope.usuario.id_empresa, filtroAusencias, 'RRHH_AUSMED')
            promesa.then(function (datos) {
                $scope.historialEmpresaAusencias = datos
            })
        }
        $scope.obtenerHistorialEmpresaOtrasAusencias = function (filtro) {
            if (filtro.tipo_ausencia == null || filtro.tipo_ausencia == undefined) {
                filtro.tipo_ausencia = 0
            }
            var filtroAusencias = { inicio: 0, fin: 0, tipo_ausencia: filtro.tipo_ausencia }
            if (filtro.inicio) {
                filtroAusencias.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtroAusencias.fin = new Date($scope.convertirFecha(filtro.fin))
            }
            var promesa = HistorialEmpresaEmpleadosAusencias($scope.usuario.id_empresa, filtroAusencias, 'RRHH_OTRAUS')
            promesa.then(function (datos) {
                $scope.historialEmpresaOtrasAusencias = datos
            })
        }

        $scope.agregarTipoAusencia = function (clase, array) {
            if (clase.edit == true) {
                $scope.guardarModificado(clase)
            } else {
                array.push(clase)
            }
        }
        $scope.ModificarTipoAusencia = function (clase) {
            $scope.clase = {}
            clase.edit = true
            $scope.clase = clase
        }
        $scope.guardarModificado = function (clase) {
            clase.edit = false
            $scope.clase = {}
        }
        $scope.guardarClasesAusencias = function (array, tipo) {
            var promesa = GuardarClasesAusencias(array, tipo)
            promesa.then(function (dato) {
                $scope.cerrarDialogTipoBaja()
                $scope.cerrarDialogTipoAusencia()
                $scope.obtenertiposAusenciaMedica()
                $scope.obtenerTiposOtrasAusencias()
                $scope.mostrarMensaje(dato.mensaje)

            })
        }
        //fin ausencias
        //inicio vacaciones
        $scope.obtenerConfiguracionVacaciones = function () {
            var promesa = ConfiguracionesVacacion()
            promesa.then(function (dato) {
                $scope.configuracionesVacacion = dato
            })
        }
        $scope.obtenerHistorialGestionesVacacion = function (empleado, tipo, beneficio) {
            var promesa = HistorialGestionesVacacion(empleado.id)
            promesa.then(function (dato) {
                $scope.historialGestionesVacacion = dato
                var fechaActual = new Date()
                var fechaAnterior = new Date(empleado.ficha.fecha_inicio)
                var datow = $scope.diferenciaEntreDiasEnDias(fechaAnterior, fechaActual)
                var años = Math.round(datow / 365)
                $scope.vacacion.aniosDisponibles = años
                $scope.vacacion.historial = $scope.historialGestionesVacacion;
                $scope.diasDisponibles = 0
                $scope.historialGestionesVacacion.forEach(function (historial, index, array) {
                    if (historial.anio <= años) {
                        $scope.diasDisponibles += (historial.aplicadas - historial.tomadas)
                    }
                });
                if (datow > 365) {
                    $scope.usarVacacion = true
                    if (tipo) {
                        $scope.abrirPopup($scope.idModalAusenciasVacaciones);
                    }

                } else {
                    $scope.usarVacacion = false
                    if (tipo) {
                        $scope.abrirPopup($scope.idModalAusenciasVacaciones);

                        /*   $scope.$apply(function () {
                              $scope.mostrarMensaje("no cuenta con la antiguedad para usar vacaciones")
                          }) */
                        setTimeout(function () {
                            $scope.$apply(function () {
                                var m = "El empleado no cuenta con la antiguedad para asignar vacaciones"
                                $scope.mostrarMensaje(m)
                            });
                        }, 2000)
                    }

                }
                if (beneficio) {
                    $scope.beneficio.totalV = 0
                    $scope.historialGestionesVacacion.forEach(function (gestion, index, array) {
                        if (index === (array.length - 1)) {
                            $scope.beneficio.meses = $scope.tiempoTrabajado.meses;
                            $scope.beneficio.dias = $scope.tiempoTrabajado.dias;
                            if ($scope.beneficio.meses == 0) {
                                $scope.beneficio.anios++
                            }
                            if (gestion.tomadas < gestion.aplicadas) {
                                $scope.beneficio.totalV += (gestion.aplicadas - gestion.tomadas)
                            }
                        } else {
                            if (gestion.tomadas < gestion.aplicadas) {
                                $scope.beneficio.totalV += (gestion.aplicadas - gestion.tomadas)
                                $scope.beneficio.anios++
                            }
                        }

                    });
                }
            })
        }

        $scope.CalcularDiferenciaDiasVacacion = function (vacacion) {
            vacacion.dias = 0
            vacacion.dias_descuento = 0
            vacacion.domingos = 0
            vacacion.sabados = 0
            if ($scope.ListaDiasFeriado.length > 0) {
                var a = vacacion.fecha_inicio
                var b = vacacion.fecha_fin
                a = new Date($scope.convertirFecha(a))
                b = new Date($scope.convertirFecha(b))
                if (vacacion.fecha_inicio.length >= 9 && vacacion.fecha_fin.length >= 9)
                    var rango = getDates(a, b);
                /*          $scope.ListaDiasFeriado.concat(rango) */
                rango.forEach(function (fecha, index, array) {
                    if (vacacion.sabado) {
                        var d = new Date(fecha);
                        if ((d.getDay() == 0)) {
                            vacacion.domingos += 1
                        }
                        var a = $scope.ListaDiasFeriado.indexOf(fecha)
                        if (a != -1) {
                            vacacion.dias_descuento += 1
                        }
                        if (index === (array.length - 1)) {
                            $scope.CalcularDiferenciaDiasV(vacacion)
                        }
                    } else {
                        var d = new Date(fecha);
                        if ((d.getDay() == 0)) {
                            vacacion.domingos += 1
                        }
                        if ((d.getDay() == 6)) {
                            vacacion.sabados += 1
                        }
                        var a = $scope.ListaDiasFeriado.indexOf(fecha)
                        if (a != -1) {
                            vacacion.dias_descuento += 1
                        }
                        if (index === (array.length - 1)) {
                            $scope.CalcularDiferenciaDiasV(vacacion)
                        }
                    }
                });


            } else {
                $scope.CalcularDiferenciaDiasV(vacacion)
            }
        }
        $scope.CalcularDiferenciaDiasV = function (vacacion) {
            if (vacacion.fecha_inicio && vacacion.fecha_fin) {
                var fechaInicio = new Date($scope.convertirFecha(vacacion.fecha_inicio));
                var fechaFin = new Date($scope.convertirFecha(vacacion.fecha_fin));
                var dato = $scope.diferenciaEntreDiasEnDias(fechaInicio, fechaFin)
                if (dato == 0) {
                    dato = 1
                }
                vacacion.dias = dato - (vacacion.dias_descuento + vacacion.domingos + vacacion.sabados)
                if (!vacacion.inicio_tipo && !vacacion.fin_tipo) {
                    vacacion.dias = vacacion.dias - 1
                } else if (vacacion.inicio_tipo && !vacacion.fin_tipo) {
                    vacacion.dias = vacacion.dias - 0.5
                } else if (!vacacion.inicio_tipo && vacacion.fin_tipo) {
                    vacacion.dias = vacacion.dias - 0.5
                } else if (vacacion.inicio_tipo && vacacion.fin_tipo) {
                    vacacion.dias = vacacion.dias
                }
                vacacion.dias_reales = dato
            }
        }
        $scope.crearNuevaVacacion = function (datos) {
            if (datos.dias <= $scope.diasDisponibles) {
                datos.fecha_inicio = new Date($scope.convertirFecha(datos.fecha_inicio));
                datos.fecha_fin = new Date($scope.convertirFecha(datos.fecha_fin));
                var promesa = NuevaVacacionEmpleado($scope.empleado.ficha.id, datos)
                promesa.then(function (dato) {
                    $scope.cerrarDialogAusenciasVacaciones()
                    $scope.mostrarMensaje(dato.mensaje)
                })
            } else {
                $scope.mostrarMensaje("El empleado solo cuenta con " + $scope.diasDisponibles + " dias disponbles para asignar vacaciones")
            }
        }
        $scope.obtenerHistorialEmpleadVacacion = function (filtro) {
            var filtroVacaciones = { inicio: 0, fin: 0 }
            if (filtro.inicio) {
                filtroVacaciones.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtroVacaciones.fin = new Date($scope.convertirFecha(filtro.fin))

            }
            var promesa = HistorialEmpleadoVacaciones($scope.empleado.ficha.id, filtroVacaciones)
            promesa.then(function (datos) {
                $scope.historialEmpleadoVacaciones = datos
            })
        }

        $scope.obtenerHistorialEmpresaVacacion = function (filtro) {
            var filtroVacaciones = { inicio: 0, fin: 0 }
            if (filtro.inicio) {
                filtroVacaciones.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtroVacaciones.fin = new Date($scope.convertirFecha(filtro.fin))

            }
            var promesa = HistorialEmpresaVacaciones($scope.usuario.id_empresa, filtroVacaciones)
            promesa.then(function (datos) {
                $scope.historialEmpresaVacaciones = datos
            })
        }
        //fin vacaciones
        //selecionar empleados

        $scope.selecionarEmpleados = function (empleado, todos, model) {
            if (model) {
                $scope.paginator.itemsPerPage = "0";
                $scope.empleadosSeleccionados = []
            } else {
                $scope.paginator.itemsPerPage = "10";
            }
            if (todos) {
                $scope.buscarRecursosHumanos(true, empleado, todos, model)
            } else {
                if (empleado.select == false) {
                    empleado.select = false
                    $scope.empleadosSeleccionados.splice($scope.empleadosSeleccionados.indexOf(empleado))
                } else {
                    empleado.select = true
                    $scope.empleadosSeleccionados.push(empleado)
                    console.log($scope.empleadosSeleccionados)
                }

            }
        }

        //fin seleccion empleados


        //exportar en exel y pdf empleados
        $scope.generarExcelEmpleados = function (empleados, configuracion) {

            var data = [["N°", "ACTIVO", "CODIGO", "NOMBRE COMPLETO", "EMPLEADO",
                "CI", "EXTENCÓN", "TIPO CONTRATO", "CAMPO", "CARGO"]]
            var iu = []
            for (var i = 0; i < empleados.length; i++) {
                var columns = [];
                columns.push((i + 1));
                columns.push(empleados[i].eliminado);
                columns.push(empleados[i].codigo);
                columns.push(empleados[i].nombre_completo);
                columns.push(empleados[i].designacion_empresa);
                columns.push(empleados[i].ci);
                columns.push(empleados[i].extension);
                columns.push(empleados[i].ficha.tipoContrato.nombre);
                columns.push(empleados[i].campo);
                var cargostexto = empleados[i].cargos[0].cargo.nombre
                iu.push(i)
                empleados[i].cargos.forEach(function (cargo, index, array) {
                    if (cargostexto == "") {
                        cargostexto = cargo
                    } else {
                        cargostexto = cargostexto + "-" + cargo.cargo.nombre
                    }
                });

                columns.push(cargostexto);
                data.push(columns);
            }

            var ws_name = "SheetJS";
            var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
            /* add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "EMPLEADO RRHH.xlsx");
            blockUI.stop();

        }
        //fin exportar en exel y pdf
        $scope.obtenerGestiones = function () {
            blockUI.start();
            var promesa = ClasesTipo("GTN");
            promesa.then(function (entidad) {
                $scope.gestiones = entidad.clases;
                blockUI.stop();
            });
        }

        // desabilitar o habilitar empleados
        $scope.abrirModalVerificarCuentaRrhh = function (empleado) {
            $scope.empleado = empleado
            $scope.abrirPopup($scope.IdModalVerificarCuentaRrhh);
        }
        $scope.cerrarModalVerificarCuentaRrhh = function (dato) {
            if (dato) {
                $scope.empleado.activo = ($scope.empleado.activo == true) ? false : true
            }
            $scope.cerrarPopup($scope.IdModalVerificarCuentaRrhh);
        }
        $scope.abrirModalVerificacion = function (empleado) {

            if (empleado.activo == true) {
                $scope.funcionCerrar = $scope.cerrarModalReingresoEmpleado
                $scope.funcionArealizar = $scope.ActivarCuentaRrhh
                $scope.abrirModalVerificarCuentaRrhh(empleado)
            } else {
                $scope.funcionCerrar = $scope.cerrarMensajeConfirmacion
                $scope.funcionArealizar = $scope.verificarCuentaAdminRrhh
                $scope.abrirModalVerificarCuentaRrhh(empleado)
                setTimeout(function () {
                    aplicarDatePickers();
                }, 300);
            }
        }
        $scope.abrirMensajeConfirmacion = function (cuenta) {
            $scope.cuenta = cuenta
            $scope.abrirPopup($scope.idModalConfirmarDesabilitacion);
        }
        $scope.abrirModalReingresoEmpleado = function () {
            $scope.abrirPopup($scope.idModalReingresoEmpleado)
        }
        $scope.cerrarModalReingresoEmpleado = function (dato) {
            if (dato) {
                $scope.empleado.activo = ($scope.empleado.activo == true) ? false : true

            }
            $scope.cerrarPopup($scope.idModalReingresoEmpleado)
            if ($scope.empleado.tipoReincorporacion) {
                if ($scope.empleado.tipoReincorporacion.nombre_corto == "NREING") {
                    $scope.abrirDialogEmpleado($scope.empleado)
                }
            }
        }
        $scope.cerrarMensajeConfirmacion = function (dato) {
            if (dato) {
                $scope.empleado.activo = ($scope.empleado.activo == true) ? false : true
            }
            $scope.cerrarPopup($scope.idModalConfirmarDesabilitacion);
        }

        $scope.verificarCuentaAdminRrhh = function (cuenta) {
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {

                if (dato.type) {
                    if (cuenta.fecha) {
                        $scope.empleado.nueva_fecha_expiracion = new Date($scope.convertirFecha($scope.cuenta.fecha))
                    } else {
                        $scope.empleado.nueva_fecha_expiracion = null
                    }

                    $scope.abrirMensajeConfirmacion(cuenta)
                    $scope.cerrarModalVerificarCuentaRrhh();
                } else {
                    $scope.mostrarMensaje(dato.message)
                }
            })


        }
        $scope.ActivarCuentaRrhh = function (cuenta) {
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {

                if (dato.type) {

                    $scope.empleado.nueva_fecha_expiracion = null

                    /*  $scope.abrirMensajeConfirmacion(cuenta) */
                    $scope.abrirModalReingresoEmpleado(cuenta)
                    $scope.cerrarModalVerificarCuentaRrhh();
                } else {
                    $scope.mostrarMensaje(dato.message)
                }
            })


        }
        $scope.changeActivoEmpleado = function (empleado) {

            empleado.activo = (empleado.activo == false) ? true : false
            var promesa = UsuarioRecursosHUmanosActivo(empleado)
            promesa.then(function (dato) {

                $scope.funcionCerrar()

                $scope.cuenta = {}
                $scope.mostrarMensaje(dato.mensaje)

                if (empleado.tipoReincorporacion) {
                    empleado.activo = (empleado.activo == false) ? true : false
                    if (empleado.tipoReincorporacion.nombre_corto == "NREING") {
                        $scope.abrirDialogEmpleado(empleado)
                        $("#siguiente-f").click()
                        setTimeout(function () {
                            $scope.ficha.editDatosLaborales = true
                        }, 400);
                    }
                } else {
                    $scope.recargarItemsTabla()
                }

            })
        }


        $scope.EliminarUsuarioRh = function (empleado) {
            if (empleado.activo) {
                empleado.activo = false
                $scope.abrirModalVerificacion(empleado)
            }
        }
        $scope.obtenerTiposBaja = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TPRE");
            promesa.then(function (entidad) {
                $scope.tiposBajas = entidad
                blockUI.stop();
            });
        }
        //fin desabilitar o habilitar empleado

        //beneficios sociales
        $scope.obtenerTiposOtrosingresosYDeduccion = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TPDOI");
            promesa.then(function (entidad) {
                $scope.tiposOtrosingresosYDeduccion = entidad
                blockUI.stop();
            });
        }
        $scope.obtenerMotivosRetiro = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TPMR");
            promesa.then(function (entidad) {
                $scope.tipoMotivo = entidad
                blockUI.stop();
            });
        }
        $scope.agregarOtroIngreso = function (model) {
            $scope.tiposOtrosingresosYDeduccion.clases.forEach(function (otro, index, array) {
                if (otro.nombre_corto == "OTRING") {
                    model.tipo = otro
                }
                if (index == (array.length - 1)) {
                    $scope.beneficio.ingresos.push(model);
                    $scope.ingreso = { motivo: '', monto: '' }
                }
            });
        }

        $scope.eliminarOtroIngreso = function (index) {
            $scope.beneficio.ingresos.splice(index, 1)
        }
        $scope.agregarDeduccion = function (model) {
            $scope.tiposOtrosingresosYDeduccion.clases.forEach(function (otro, index, array) {
                if (otro.nombre_corto == "DEDUC") {
                    model.tipo = otro
                }
                if (index == (array.length - 1)) {
                    $scope.beneficio.deducciones.push(model);
                    $scope.deduccion = { motivo: '', monto: '' }
                }
            });
        }

        $scope.eliminarDeduccion = function (index) {
            $scope.beneficio.deducciones.splice(index, 1)
        }
        $scope.guardarBeneficioSocial = function (datos) {
            datos.fecha_elaboracion = new Date($scope.convertirFecha(datos.fecha_elaboracion))
            datos.fecha_asistensia = new Date($scope.convertirFecha(datos.fecha_asistensia))
            datos.fecha_ingreso = new Date($scope.convertirFecha(datos.fecha_ingreso))
            if (datos.fecha_retiro) {
                datos.fecha_retiro = new Date($scope.convertirFecha(datos.fecha_retiro))
            }
            var promesa = CrearBeneficioSocial(datos, $scope.empleado.ficha.id)
            promesa.then(function (dato) {
                $scope.mostrarMensaje(dato.mensaje)
                $scope.cerrarDialogBeneficiosSociales()
            })
        }
        $scope.calcularPromedioFiniquito = function (beneficio) {
            beneficio.promedio = (beneficio.primer_mes2 + beneficio.segundo_mes2 + beneficio.tercer_mes2) / 3
            beneficio.promedio = parseFloat(beneficio.promedio.toFixed(2))

        }
        $scope.calcularTotalQuiquenio = function (beneficio) {
            beneficio.total_quiquenio = beneficio.promedio * (beneficio.numero_quiqueneo * 5)
            beneficio.total_quiquenio = parseFloat(beneficio.total_quiquenio.toFixed(2))
        }
        //fin beneficios sociales
        $scope.inicio()
        $scope.calcularDesaucio = function (beneficio) {
            beneficio.total_desahucio = beneficio.promedio * 3
            beneficio.total_desahucio == parseFloat(beneficio.desahucio.toFixed(2))
        }

    });
