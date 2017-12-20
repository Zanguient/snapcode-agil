angular.module('agil.controladores')

    .controller('ControladorRecursosHumanos', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, ListaDatosGenero, NuevoRecursoHumano, RecursosHumanosPaginador, Paginator,
        FieldViewer, PacientesEmpresa, obtenerEmpleadoRh, UsuarioRecursosHUmanosActivo, Prerequisito, ListaDatosPrerequisito, ListaPrerequisitosPaciente, ActualizarPrerequisito, UsuarioRecursosHumanosFicha,
        ClasesTipo, Clases, Paises, CrearEmpleadoFicha) {
        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalPrerequisitos = 'dialog-pre-requisitos';
        $scope.idModalEmpleado = 'dialog-empleado';
        $scope.idModalwizardContainerEmpleado = 'modal-wizard-empleado-container';
        $scope.idModalExpedidoEn = 'dialog-expedido-en';
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
        $scope.idModalWizardRhVista = 'dialog-rh-vista';
        $scope.idModalContenedorRhVista = 'modal-wizard-container-rh-vista';
        $scope.idModalDialogPrerequisitoNuevo = 'dialog-pre-requisito-nuevo';
        $scope.$on('$viewContentLoaded', function () {
            // resaltarPestaña($location.path().substring(1));
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsRecursosHumanos($scope.idModalPrerequisitos, $scope.idModalEmpleado, $scope.idModalwizardContainerEmpleado,
                $scope.idModalExpedidoEn, $scope.idModalTipoDocumento, $scope.idModalEstadoCivil, $scope.idModalNacionalidad,
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
                $scope.idModalContenedorRhVista, $scope.idModalDialogPrerequisitoNuevo);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion()
            blockUI.stop();

        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalEmpleado, $scope.idModalExpedidoEn,
                $scope.idModalTipoDocumento, $scope.idModalEstadoCivil, $scope.idModalNacionalidad, $scope.idModalDepartamentoEstado,
                $scope.idModalProvincia, $scope.idModalLocalidad, $scope.idModalTipoDiscapacidad, $scope.idModalTipoContrato,
                $scope.idModalTipoPersonal, $scope.idModalCargaHoraria, $scope.idModalArea, $scope.idModalUbicacion, $scope.idModalHojaVida,
                $scope.idModalSeguro, $scope.idModalSeguroLugar, $scope.idModalAporte, $scope.idModalAporteLugar,
                $scope.idModalTipoOtrosSeguros, $scope.idModalBanco, $scope.idModalNuevoHijo, $scope.idModalNuevoFamiliar,
                $scope.idModalGrado, $scope.idModalTitulo, $scope.idModalHistorialContrato, $scope.idModalBeneficiosSociales,
                $scope.idModalMotivoRetiro, $scope.idModalDetalleVacaciones, $scope.idModalOtroIngreso, $scope.idModalDeduccion,
                $scope.idModalAnticipoExtraordinario, $scope.idModalNuevoPrestamo, $scope.idModalAusenciasVacaciones,
                $scope.idModalTipoBaja, $scope.idModalFeriados, $scope.idModalHitorialVacaciones, $scope.idModalCompensacion,
                $scope.idModalHistorialAusencias, $scope.idModalHistorialAusenciaMedica, $scope.idModalTipoAusencia, $scope.idModalRolTurnos,
                $scope.idModalHistorialTurnos, $scope.idModalHorasExtras, $scope.idModalHistorialHorasExtras, $scope.idModalAnticipoRegular,
                $scope.idModalPrestamosPersonal, $scope.idModalAdvertencia, $scope.idModalPretamosNuevoTodos, $scope.idModalReporteHijos,
                $scope.idModalReporteVeneficios, $scope.idModalPagoPrestamo, $scope.idModalReporteVacaciones, $scope.idModalReporteBajasMedicas,
                $scope.idModalReporteRolTurnos, $scope.idModalReporteTurnosDetallado, $scope.idModalViajes, $scope.idModalVisita,
                $scope.idModalVehiculosViaje, $scope.idModalDestinos, $scope.idModalHistorialViajes, $scope.idModalReporteAusencias,
                $scope.idModalCertificado, $scope.idModalInstitucion);
            $scope.eliminarPopup($scope.idModalPrerequisitos)
            $scope.eliminarPopup($scope.idModalRhNuevo)
            $scope.eliminarPopup($scope.idModalWizardRhVista)
            $scope.eliminarPopup($scope.idModalDialogPrerequisitoNuevo)
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
                    grupo_sanguineo: { value: "Grupo Sang.", show: true },
                    campo: { value: "Campo", show: true },
                    cargo: { value: "Cargo", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
        }

        $scope.abrirDialogPrerequisitoNuevo = function () {
            $scope.nuevoP = new Prerequisito({ puede_modificar_rrhh: false });
            console.log($scope.nuevoP)
            $scope.abrirPopup($scope.idModalDialogPrerequisitoNuevo);
        }

        $scope.cerrarPopupPrerequisitoNuevo = function () {
            $scope.cerrarPopup($scope.idModalDialogPrerequisitoNuevo);
        }

        $scope.abrirDialogVerEmpleado = function (elpaciente) {
            promesaPaciente = obtenerEmpleadoRh(elpaciente.id)
            promesaPaciente.then(function (paciente) {
                $scope.paciente = paciente
                $scope.paciente.fecha_nacimiento_texto = $scope.fechaATexto($scope.paciente.persona.fecha_nacimiento)


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

        $scope.abrirDialogInicioPreRequisitos = function (empleado) {
            var filtro = { inicio: 0, fin: 0 }
            $scope.obtenerDatosPrerequisito(empleado, filtro);
            $scope.empleado = empleado
            $scope.abrirPopup($scope.idModalPrerequisitos);
        }
        $scope.cerrarDialogInicioPreRequisitos = function () {
            $scope.cerrarPopup($scope.idModalPrerequisitos);
        }
        $scope.abrirDialogEmpleado = function (empleado) {
            $scope.obtenerDatosFichaUsuario(empleado);
            $scope.empleado = empleado


            $scope.abrirPopup($scope.idModalEmpleado);
        }
        $scope.cerrarDialogEmpleado = function (ficha) {
            $scope.departamentos = []
            $scope.provincias = []
            $scope.localidades = []
            $scope.cerrarPopup($scope.idModalEmpleado);
        }
        $scope.abrirDialogExpedidoEn = function () {
            $scope.abrirPopup($scope.idModalExpedidoEn);
        }
        $scope.cerrarDialogExpedidoEn = function () {
            $scope.cerrarPopup($scope.idModalExpedidoEn);
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
        $scope.cargos = [{ 'name': 'Chofer' }, { 'name': 'Ayudante de Of.' }, { 'name': 'Mecanico' }];
        $scope.discapacidades = [{ 'name': 'Fisica' }, { 'name': 'Sensorial' }, { 'name': 'Psiquica' },{ 'name': 'Intelectual o Mental' }];
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
        $scope.abrirDialogHojaVida = function () {
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
            promesaPaciente.then(function (paciente) {
                console.log(paciente)
                $scope.nuevoRH = paciente
                $scope.nuevoRH.persona.fecha_nacimiento = $scope.fechaATexto($scope.nuevoRH.persona.fecha_nacimiento)
            })
            console.log($scope.paciente)
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
                    $scope.empleado.otrosSeguros = datos.ficha

                    $scope.buscarDepartamento(datos.ficha.empleado.persona.pais)
                    $scope.buscarMunicipios(datos.ficha.empleado.persona.ciudad)
                    $scope.buscarLocalidad(datos.ficha.empleado.persona.provincia)
                   
                    var fechaActual = new Date();
                    var fechaNacimiento = new Date($scope.ficha.empleado.persona.fecha_nacimiento)
                    $scope.ficha.nac_anio=fechaNacimiento.getFullYear()
                    $scope.ficha.nac_dia=fechaNacimiento.getDate()
                    $scope.ficha.nac_mes=(fechaNacimiento.getMonth()-1)
                    var fecha = new Date()
                    $scope.ficha.fecha_elaboracion = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365);
                    $scope.ficha.edad
                    $scope.ficha.empleado.familiares.forEach(function (familiar, index, array) {
                        var fechaActual = new Date()
                        var fechaNacimiento = new Date(familiar.persona.fecha_nacimiento)

                        var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                        familiar.edad = Math.trunc(dato / 365);

                    });
                } else {

                    $scope.ficha = { empleado: datos.empleado, pacienteReferencia: {} }
                    $scope.empleado.otrosSeguros = []
                    $scope.empleado.familiares = []

                    var fechaActual = new Date();
                    $scope.ficha.fecha_elaboracion = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear()
                    var fechaNacimiento = new Date($scope.ficha.empleado.persona.fecha_nacimiento)
                    var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
                    $scope.ficha.edad = Math.trunc(dato / 365)
                }
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
        $scope.saveFormPrerequisito = function () {
            blockUI.start();
            console.log($scope.nuevoP)
            $scope.nuevoP.fecha_inicio = new Date($scope.convertirFecha($scope.nuevoP.fecha_inicio));
            $scope.nuevoP.fecha_vencimiento = new Date($scope.convertirFecha($scope.nuevoP.fechav));

            $scope.nuevoP.$save({ id_paciente: $scope.empleado.id }, function (prerequisito) {
                blockUI.stop();
                var filtro = { inicio: 0, fin: 0 }
                //prerequisito = new Prerequisito({});
                $scope.obtenerDatosPrerequisito($scope.empleado, filtro);
                $scope.cerrarPopupPrerequisitoNuevo();
                $scope.mostrarMensaje('Guardado Exitosamente!');

            }, function (error) {
                blockUI.stop();
                var filtro = { inicio: 0, fin: 0 }
                $scope.obtenerDatosPrerequisito($scope.empleado, filtro);
                $scope.cerrarPopupPrerequisitoNuevo();
                $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
            });
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

            var anio = familiar.nac_anio
            var mes = parseInt(familiar.nac_mes)
            var dia = parseInt(familiar.nac_dia)
            var fechaNacimiento = new Date()
            fechaNacimiento.setFullYear(anio, mes, dia)
            var dato = $scope.diferenciaEntreDiasEnDias(fechaNacimiento, fechaActual)
            familiar.edad = Math.trunc(dato / 365);
            $scope.familiar.edad
        }
        $scope.eliminarSeguro = function (dato) {
            $scope.ficha.empleado.otrosSeguros.splice($scope.ficha.empleado.otrosSeguros.indexOf(dato), 1);
        }
        $scope.editarSeguro = function (dato, index) {
            $scope.seguro = dato
            $scope.seguro.edit = true
            $scope.seguro.index = index
        }
        $scope.agregarFamiliar = function (familiar) {
            familiar.eliminado = false
            if (parseInt(familiar.nac_mes) < 10) {
                familiar.nac_mes = "0" + familiar.nac_mes
            }
            familiar.persona.fecha_nacimiento = new Date(familiar.nac_anio, parseInt(familiar.nac_mes), parseInt(familiar.nac_dia))
            $scope.ficha.empleado.familiares.push(familiar)
            $scope.familiar = { edit: false }
        }
        $scope.eliminarFamiliar = function (dato) {
            $scope.ficha.empleado.familiares.splice($scope.ficha.empleado.familiares.indexOf(dato), 1);
        }
        $scope.editarFamiliar = function (dato, index) {
            $scope.familiar = dato
            var fecha = new Date(dato.persona.fecha_nacimiento)
            $scope.familiar.nac_anio = fecha.getFullYear()
            $scope.familiar.nac_dia = fecha.getDate()
            $scope.familiar.nac_mes = fecha.getMonth()
            $scope.familiar.edit = true
            $scope.familiar.index = index
            $scope.abrirDialogNuevoFamiliar()
        }
        $scope.guardarSeguroEditado = function (dato) {
            $scope.ficha.empleado.otrosSeguros[dato.index] = dato
            $scope.seguro = { edit: false }
        }

        $scope.guardarFamiliarEditado = function (dato) {
            $scope.ficha.empleado.familiares[dato.index].persona.fecha_nacimiento = new Date(dato.nac_anio, parseInt(dato.nac_mes), parseInt(dato.nac_dia))
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
        }
        $scope.obtenerExpeditos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_EXP");
            promesa.then(function (entidad) {
                $scope.expeditos = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerTipoExpeditos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TEXP");
            promesa.then(function (entidad) {
                $scope.tiposDocumentos = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerEstadoCivil = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_EC");
            promesa.then(function (entidad) {
                $scope.estadosCiviles = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerNacionalidades = function () {
            blockUI.start();
            var promesa = ClasesTipo("NAC");
            promesa.then(function (entidad) {
                $scope.nacionalidades = entidad.clases
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
                $scope.tiposContratos = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerTiposPersonales = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_TP");
            promesa.then(function (entidad) {
                $scope.tiposPersonales = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerCargasHorarios = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_CH");
            promesa.then(function (entidad) {
                $scope.cargasHorarios = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerAreas = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_AREA");
            promesa.then(function (entidad) {
                $scope.listaAreas = entidad.clases
                blockUI.stop();
            });
        }

        $scope.obtenerUbicacion = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_UBI");
            promesa.then(function (entidad) {
                $scope.ubicaciones = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerSegurosSalud = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_SS");
            promesa.then(function (entidad) {
                $scope.segurosSalud = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerLugarSegurosSalud = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_LSS");
            promesa.then(function (entidad) {
                $scope.LugaresSegurosSalud = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerAporteSeguroLargoPlazo = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_ASLP");
            promesa.then(function (entidad) {
                $scope.aportesSeguroLargoPlazo = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerTipoOtrosSeguros = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_OST");
            promesa.then(function (entidad) {
                $scope.OtrosSegurosTipos = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerBancos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_BAN");
            promesa.then(function (entidad) {
                $scope.bancos = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerFamiliaRelacion = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_REL");
            promesa.then(function (entidad) {
                $scope.relaciones = entidad.clases
                blockUI.stop();
            });
        }
        $scope.obtenerMeses = function () {
            $scope.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
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

        $scope.guardarFichaTecnica = function (valido, ficha) {
            //if (valido) {
            var button = $('#siguiente-f').text().trim();
            if (button != "Siguiente") {
                ficha.empleado.persona.fecha_nacimiento = new Date(ficha.nac_anio, parseInt(ficha.nac_mes), parseInt(ficha.nac_dia))
                ficha.fecha_elaboracion = new Date($scope.convertirFecha(ficha.fecha_elaboracion));
                ficha.fecha_inicio = new Date($scope.convertirFecha(ficha.fecha_inicio));
                ficha.fecha_fin = new Date($scope.convertirFecha(ficha.fecha_fin));
                ficha.fecha_jubilacion = new Date($scope.convertirFecha(ficha.fecha_jubilacion));
                var promesa = CrearEmpleadoFicha(ficha);
                promesa.then(function (dato) {
                    $scope.cerrarDialogEmpleado()
                    $scope.recargarItemsTabla()
                    $scope.mostrarMensaje(dato.message)
                })
            }
            // }
        }
        $scope.inicio()

        $scope.actualizarPrerequisito = function (prerequisitos) {
            var promesa = ActualizarPrerequisito(prerequisitos)
            promesa.then(function (dato) {
                /* if (prerequisitos instanceof Array) {
                    
                } */
                $scope.cerrarDialogInicioPreRequisitos()
                $scope.mostrarMensaje(dato.message)
            })
        }

    });