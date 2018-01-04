function ejecutarScriptsMesas(idPopupPanel, idPopupEdicionSala, idContenedorEdicionSala, idPopupEdicionMesa,
	idContenedorEdicionMesa, idPopupGarzonEdicion, idContenedorEdicionGarzon, idPopupFacturacion, idContenedorFacturacion,
	idPopupReserva, idContenedorReserva, idPopupCambioMesa, idContenedorCambioMesa,
	idPopupUnionMesas, idContenedorUnionMesas, idPopupAsignacionMesas, idContenedorAsignacionMesas) {
	crearPopup(idPopupPanel, "100%", screen.height);
	crearPopup(idPopupEdicionSala, "60%", 550);
	aplicarWizardFormulario(idPopupEdicionSala, idContenedorEdicionSala);
	crearPopup(idPopupEdicionMesa, "60%", 550);
	aplicarWizardFormulario(idPopupEdicionMesa, idContenedorEdicionMesa);
	crearPopup(idPopupGarzonEdicion, "60%", 550);
	aplicarWizardFormulario(idPopupGarzonEdicion, idContenedorEdicionGarzon);
	crearPopup(idPopupFacturacion, "60%", 550);
	aplicarWizardFormulario(idPopupFacturacion, idContenedorFacturacion);
	crearPopup(idPopupReserva, "60%", 550);
	aplicarWizardFormulario(idPopupReserva, idContenedorReserva);
	crearPopup(idPopupCambioMesa, "60%", 550);
	aplicarWizardFormulario(idPopupCambioMesa, idContenedorCambioMesa);
	crearPopup(idPopupUnionMesas, "60%", 550);
	aplicarWizardFormulario(idPopupUnionMesas, idContenedorUnionMesas);
	crearPopup(idPopupAsignacionMesas, "60%", 550);
	aplicarWizardFormulario(idPopupAsignacionMesas, idContenedorAsignacionMesas);
	setTimeout(function () {
		aplicarTiempos();
	}, 200);
}

function ejecutarScriptsPantallaDespacho(idModalPantallaDespacho) {
	crearPopup(idModalPantallaDespacho, "100%", screen.height);
}

function ejecutarScriptsPantallaCliente(idModalPantallaCliente, idPopupPregunta, idModalImagenesPromociones) {
	crearPopup(idModalPantallaCliente, "100%", screen.height);
	crearPopup(idPopupPregunta, "30%", 100);
	crearPopup(idModalImagenesPromociones, "70%", 'auto');
}

function ejecutarScriptsInventario(idModalActualizacionInventario, idModalCreacionInventario, idModalIngresosPorInventario) {
	crearPopup(idModalActualizacionInventario, "30%", 100);
	crearPopup(idModalCreacionInventario, "80%", 250);
	crearPopup(idModalIngresosPorInventario, "80%", 500);
	setTimeout(function () {
		aplicarDatePickers();
	}, 200);
}
function ejecutarScriptsOperaciones(idDialogDialogPanelOperaciones,idDialogEntregaViveres,idConfirmacionCierre) {	crearPopup(idDialogDialogPanelOperaciones, "100%", screen.height);
	crearPopup(idDialogEntregaViveres, "60%", 'auto');
	crearPopup(idConfirmacionCierre, "40%", 'auto');
}
function ejecutarScriptsInicio(idPopupTablaProductos, idPopupTablaCreditos, idPopupTablaDeudas, idPopupPago,
	idPopupActualizarCreditoCliente, idPopupActualizarCreditoDeuda, idPopupDeuda, idModalDescuento, idModalTablaVentasPendientes,
	idModalTablaComprasPendientes, idModalTablaBancosPendientes, idModalTablaOtrosPendientes, idModalInicioSesion, idModalWizardComprobanteEdicion, IdModalOpcionesQr, IdModalRegistrarComprobante, IdModalRevisarComprobante, IdModalLibroMayor, IdModalAsignarCuenta,
	idModalTablaDespachos) {
	crearPopup(idPopupTablaProductos, "100%", 550);
	crearPopup(idModalWizardComprobanteEdicion, "100%", 900);
	crearPopup(idPopupTablaCreditos, "60%", 550);
	crearPopup(idPopupTablaDeudas, "60%", 550);
	crearPopup(idPopupPago, "30%", 200);
	crearPopup(idPopupActualizarCreditoCliente, "30%", 200);
	crearPopup(idPopupActualizarCreditoDeuda, "30%", 200);
	crearPopup(idPopupDeuda, "30%", 200);
	crearPopup(idModalDescuento, "40%", 100);
	crearPopup(idModalTablaVentasPendientes, "60%", 550);
	crearPopup(idModalTablaComprasPendientes, "60%", 550);
	crearPopup(idModalTablaBancosPendientes, "60%", 550);
	crearPopup(idModalTablaOtrosPendientes, "60%", 550);
	crearPopup(idModalInicioSesion, "100%", screen.height);

	crearPopup(IdModalOpcionesQr, "30%", 250);
	crearPopup(IdModalRegistrarComprobante, "60%", 350);
	crearPopup(IdModalRevisarComprobante, "60%", 550);
	crearPopup(IdModalLibroMayor, "70%", "auto");
	crearPopup(IdModalAsignarCuenta, "30%", 270);
	crearPopup(idModalTablaDespachos, "90%", 550);
	$("#" + idModalInicioSesion).siblings('.ui-dialog-titlebar').remove();
	aplicarDatePickers();

	$(document).on('click', '#field-viewer', function (e) {
		e.stopPropagation();
	});
}
function ejecutarScriptsComprobante(IdModalVerificarCuenta, IdModalEliminarComprobante) {
	/* crearPopup(idModalWizardComprobanteNuevo, "100%", 800); */
	crearPopup(IdModalVerificarCuenta, "20%", 'auto');
	crearPopup(IdModalEliminarComprobante, "20%", 'auto');
	/*crearPopup(IdModalRevisarComprobante, "80%", 500);
	crearPopup(IdModalLibroMayor, "80%", 500); */

}

function ejecutarScriptsCotizacion(idModalWizardCotizacionEdicion) {
	crearPopup(idModalWizardCotizacionEdicion, "100%", 1800);
	aplicarDatePickers();
}
function ejecutarScriptsPacientes(idModalDialogVacunas, idModalDialogConsulta, idModalwizardContainerConsulta,
	idModalDialogVacunasConfig, idModalDialogVacunaEdicion, idModalDialogFechaEntrega, IdModalDialogPreRequisitos,
	IdModalDialogLaboratorio, IdModalDialogGraficoSV, idModalDialogHistorico, idModalFichaTecnica, idModalwizardContainerFichaTecnica,
	IdModalDialogLaboratorioExamen, IdModalDialogLaboratorioExamenes, IdModalDialogLaboratorioExamenesNuevoResultado,
	IdModalDialogLaboratorioExamenHistoricoPreview, IdModalDialogLaboratorioExamenHistoricoResultado, IdEntregaPrerequisito,
	idModalDialogPacienteNuevo, idModalDialogPrerequisitoNuevo, idModalwizardContainerPaciente, idModalHistorialPrerequisito, idModalEditarPrerequisito,
	idModalDialogHistorialVacuna, idModalDialogHistorialVacunaGeneral, idModalDialogDiagnosticos, idModalDialogDiagnosticoNuevo,
	idModalDialogExamenesDiagnostico, idModalDialogNuevoExamenDiagnostico, idModalDialogHistorialFicha, idModalDialogCredencial,
	idModalDialogPatologias, idModalDialogComentario, idModalAlertPrerequisitos, idModalDiasActivacionPrerequisitos,
	idModalReprogramarPrerequisitos, idModalAlertVacunas, idModalDiasActivacionVacunas, idModalReprogramarVacunas, idImagenUsuario, idModalHistorialConsulta,
	idModalWizardPacienteVista, idModalContenedorPacienteVista, idModalEliminarPaciente, IdModalDialogNuevoLaboratorio, IdModalDialogDiagnosticoExamenHistoricoResultado,
	idModalDialogVerResultadosHistorialLab, idModalDialogConfirmacionEntregaAdelantado) {
	crearPopup(idModalDialogVacunas, "60%", 'auto');
	crearPopup(idModalDialogVacunasConfig, "60%", 'auto');
	crearPopup(idModalDialogVacunaEdicion, "70%", 'auto');
	crearPopup(idModalDialogHistorialVacuna, "60%", 'auto');
	crearPopup(idModalDialogHistorialVacunaGeneral, "60%", 'auto');
	crearPopup(idModalDialogConsulta, "75%", 'auto');
	crearPopup(idModalDialogFechaEntrega, "80%", 800);
	crearPopup(IdModalDialogPreRequisitos, "90%", 'auto');
	crearPopup(IdModalDialogLaboratorio, "80%", 'auto');
	crearPopup(IdModalDialogGraficoSV, "100%", 'auto');
	crearPopup(idModalDialogHistorico, "100%", 800);
	crearPopup(idModalFichaTecnica, "90%", 'auto');
	crearPopup(IdModalDialogLaboratorioExamen, "35%", 'auto');
	crearPopup(IdModalDialogLaboratorioExamenes, "50%", 'auto');
	crearPopup(IdModalDialogLaboratorioExamenHistoricoPreview, "50%", 'auto');
	crearPopup(IdModalDialogLaboratorioExamenesNuevoResultado, "35%", 'auto');
	crearPopup(IdModalDialogLaboratorioExamenHistoricoResultado, "50%", 400);

	crearPopup(idModalDialogPacienteNuevo, "50%", 'auto');
	crearPopup(idModalDialogPrerequisitoNuevo, "50%", 'auto');
	crearPopup(idModalHistorialPrerequisito, "50%", 'auto');
	crearPopup(idModalEditarPrerequisito, "40%", 'auto');
	crearPopup(idModalDialogDiagnosticos, "80%", 'auto');
	crearPopup(idModalDialogDiagnosticoNuevo, "40%", 'auto');
	crearPopup(idModalDialogExamenesDiagnostico, "50%", 'auto');
	crearPopup(idModalDialogNuevoExamenDiagnostico, "40%", 'auto');
	crearPopup(idModalDialogHistorialFicha, "70%", 'auto');
	crearPopup(idModalDialogCredencial, "82%", 'auto');
	crearPopup(idModalDialogPatologias, "70%", 'auto');
	crearPopup(idModalDialogComentario, "40%", 'auto');
	crearPopup(idModalAlertPrerequisitos, "70%", 'auto');
	crearPopup(idModalDiasActivacionPrerequisitos, "35%", 'auto');
	crearPopup(idModalReprogramarPrerequisitos, "35%", 'auto');
	crearPopup(IdEntregaPrerequisito, "40%", 'auto');
	crearPopup(idModalAlertVacunas, "70%", 'auto');
	crearPopup(idModalDiasActivacionVacunas, "35%", 'auto');
	crearPopup(idModalReprogramarVacunas, "35%", 'auto');
	crearPopup(idModalHistorialConsulta, "35%", 'auto');
	crearPopup(idModalWizardPacienteVista, "50%", 'auto');
	crearPopup(idModalEliminarPaciente, "35%", 'auto');
	crearPopup(IdModalDialogNuevoLaboratorio, "35%", 'auto');
	crearPopup(IdModalDialogDiagnosticoExamenHistoricoResultado, "35%", 'auto');
	aplicarWizardFormulario(idModalWizardPacienteVista, idModalContenedorPacienteVista);
	aplicarWizardFormulario(idModalDialogPacienteNuevo, idModalwizardContainerPaciente);
	aplicarWizardFormulario(idModalDialogConsulta, idModalwizardContainerConsulta);
	aplicarWizardFormulario(idModalFichaTecnica, idModalwizardContainerFichaTecnica);
	crearPopup(idModalDialogVerResultadosHistorialLab, "55%", 'auto');
	crearPopup(idModalDialogConfirmacionEntregaAdelantado, "35%", 'auto');
	// aplicarDatePickers();
	// aplicarVisorImagenArchivo(idImagenUsuario);
	setTimeout(function name(params) {
		console.log('aplicacndo scripts pacientes')
		aplicarDatePickers();
		// aplicarHoras();
		aplicarTiempos();
		aplicarVisorImagenArchivo(idImagenUsuario);
	}, 2000)

}

function ejecutarScriptsMantenimientos(idModalInicioMantenimiento, idModalOTNuevo, idModalwizardContainerOTNuevo, idModalFacturaServicioExterno,
	idModaRepuestosOT) {
	crearPopup(idModalInicioMantenimiento, "48%", 'auto');
	crearPopup(idModalOTNuevo, "90%", 'auto');
	aplicarWizardFormulario(idModalOTNuevo, idModalwizardContainerOTNuevo);
	crearPopup(idModalFacturaServicioExterno, "50%", 'auto');
	crearPopup(idModaRepuestosOT, "75%", 'auto');
	aplicarDatePickers();
	aplicarHoras();
	aplicarTiempos();
}

function ejecutarScriptsRecursosHumanos(idModalPrerequisitos, idModalEmpleado, idModalwizardContainerEmpleado, idModalConceptoEdicion,
	idModalTipoDocumento, idModalEstadoCivil, idModalNacionalidad, idModalDepartamentoEstado, idModalProvincia, idModalLocalidad,
	idModalTipoDiscapacidad, idModalTipoContrato, idModalTipoPersonal, idModalCargaHoraria, idModalArea, idModalUbicacion, idImput,
	idModalHojaVida, idModalwizardContainerHojaVida, idModalSeguro, idModalSeguroLugar, idModalAporte, idModalAporteLugar,
	idModalTipoOtrosSeguros, idModalBanco, idModalNuevoHijo, idModalNuevoFamiliar, idModalGrado, idModalTitulo,
	idModalHistorialContrato, idModalBeneficiosSociales, idModalMotivoRetiro, idModalDetalleVacaciones, idModalOtroIngreso,
	idModalDeduccion, idModalAnticipoExtraordinario, idModalNuevoPrestamo, idModalAusenciasVacaciones, idTabAusenciasVacaciones,
	idModalTipoBaja, idModalFeriados, idModalHitorialVacaciones, idModalCompensacion, idModalHistorialAusencias,
	idModalHistorialAusenciaMedica, idModalTipoAusencia, idModalRolTurnos, idModalHistorialTurnos, idModalHorasExtras,
	idModalHistorialHorasExtras, idModalAnticipoRegular, idModalPrestamosPersonal, idModalAdvertencia, idModalPretamosNuevoTodos,
	idModalReporteHijos, idModalReporteVeneficios, idModalPagoPrestamo, idModalReporteVacaciones, idModalReporteBajasMedicas,
	idModalReporteRolTurnos, idModalReporteTurnosDetallado, idModalViajes, idModalVisita, idModalVehiculosViaje, idModalDestinos,
	idModalHistorialViajes, idModalReporteAusencias, idModalCertificado, idModalInstitucion, idModalRhNuevo, idModalWizardRhNuevo,
	idImagenUsuario, idEliminarUsuarioRh, idModalWizardRhVista, idModalContenedorRhVista, idModalDialogPrerequisitoNuevo, idEliminarSeguroEmpleado,
	idEliminarFamiliarEmpleado, idModalHistorialPrerequisito, idModalEditarPrerequisito, idModalDialogConfirmacionEntregaAdelantado, IdEntregaPrerequisito) {
	crearPopup(idModalPrerequisitos, "90%", 'auto');
	crearPopup(idModalEmpleado, "100%", 'auto');
	aplicarWizardFormulario(idModalEmpleado, idModalwizardContainerEmpleado);

	crearPopup(idModalTipoDocumento, "62%", "auto");
	crearPopup(idModalEstadoCivil, "62%", "auto");
	crearPopup(idModalNacionalidad, "62%", "auto");
	crearPopup(idModalDepartamentoEstado, "62%", "auto");
	crearPopup(idModalProvincia, "62%", "auto");
	crearPopup(idModalLocalidad, "62%", "auto");
	crearPopup(idModalTipoDiscapacidad, "62%", "auto");
	crearPopup(idModalTipoContrato, "62%", "auto");
	crearPopup(idModalTipoPersonal, "62%", "auto");
	crearPopup(idModalCargaHoraria, "62%", "auto");
	crearPopup(idModalArea, "62%", "auto");
	crearPopup(idModalUbicacion, "62%", "auto");
	crearPopup(idModalHojaVida, "100%", 'auto');
	aplicarWizardFormulario(idModalHojaVida, idModalwizardContainerHojaVida);
	crearPopup(idModalSeguro, "62%", "auto");
	crearPopup(idModalSeguroLugar, "62%", "auto");
	crearPopup(idModalAporte, "62%", "auto");
	crearPopup(idModalAporteLugar, "62%", "auto");
	crearPopup(idModalTipoOtrosSeguros, "62%", "auto");
	crearPopup(idModalBanco, "62%", "auto");
	crearPopup(idModalNuevoHijo, "62%", "auto");

	crearPopup(idModalGrado, "62%", "auto");
	crearPopup(idModalTitulo, "62%", "auto");
	crearPopup(idModalHistorialContrato, "62%", "auto");
	crearPopup(idModalBeneficiosSociales, "100%", "auto");
	crearPopup(idModalMotivoRetiro, "62%", "auto");
	crearPopup(idModalOtroIngreso, "50%", "auto");
	crearPopup(idModalDeduccion, "50%", "auto");
	crearPopup(idModalAnticipoExtraordinario, "62%", "auto");
	crearPopup(idModalNuevoPrestamo, "62%", "auto");
	crearPopup(idModalAusenciasVacaciones, "62%", "auto");
	aplicarTab(idTabAusenciasVacaciones);
	crearPopup(idModalTipoBaja, "50%", "auto");
	crearPopup(idModalFeriados, "50%", "auto");
	crearPopup(idModalHitorialVacaciones, "65%", "auto");
	crearPopup(idModalDetalleVacaciones, "70%", "auto");
	crearPopup(idModalCompensacion, "50%", "auto");
	crearPopup(idModalHistorialAusencias, "65%", "auto");
	crearPopup(idModalHistorialAusenciaMedica, "65%", "auto");
	crearPopup(idModalTipoAusencia, "50%", "auto");
	crearPopup(idModalRolTurnos, "50%", "auto");
	crearPopup(idModalHistorialTurnos, "70%", "auto");
	crearPopup(idModalHorasExtras, "50%", "auto");
	crearPopup(idModalHistorialHorasExtras, "70%", "auto");
	crearPopup(idModalAnticipoRegular, "70%", "auto");
	crearPopup(idModalPrestamosPersonal, "70%", "auto");
	crearPopup(idModalAdvertencia, "50%", "auto");
	crearPopup(idModalPretamosNuevoTodos, "62%", "auto");
	crearPopup(idModalReporteHijos, "50%", "auto");
	crearPopup(idModalReporteVeneficios, "70%", "auto");
	crearPopup(idModalPagoPrestamo, "50%", "auto");
	crearPopup(idModalReporteVacaciones, "70%", "auto");
	crearPopup(idModalReporteBajasMedicas, "70%", "auto");
	crearPopup(idModalReporteRolTurnos, "70%", "auto");
	crearPopup(idModalReporteTurnosDetallado, "80%", "auto");
	crearPopup(idModalViajes, "100%", "auto");
	crearPopup(idModalVisita, "50%", "auto");
	crearPopup(idModalVehiculosViaje, "62%", "auto");
	crearPopup(idModalDestinos, "62%", "auto");
	crearPopup(idModalHistorialViajes, "75%", "auto");
	crearPopup(idModalReporteAusencias, "70%", "auto");
	crearPopup(idModalCertificado, "62%", "auto");
	crearPopup(idModalInstitucion, "62%", "auto");
	crearPopup(idModalRhNuevo, "62%", "auto");
	crearPopup(idEliminarUsuarioRh, "20%", "auto");
	aplicarWizardFormulario(idModalRhNuevo, idModalWizardRhNuevo)
	crearPopup(idModalWizardRhVista, "62%", "auto");
	crearPopup(idEliminarSeguroEmpleado, "20%", "auto");
	crearPopup(idEliminarFamiliarEmpleado, "20%", "auto");
	aplicarWizardFormulario(idModalWizardRhVista, idModalContenedorRhVista);
	crearPopup(idModalDialogPrerequisitoNuevo, "50%", "auto");

	crearPopup(idModalNuevoFamiliar, "62%", "auto");
	crearPopup(idModalHistorialPrerequisito, "50%", 'auto');
	crearPopup(idModalEditarPrerequisito, "40%", 'auto');
	crearPopup(idModalDialogConfirmacionEntregaAdelantado, "35%", 'auto');
	crearPopup(IdEntregaPrerequisito, "40%", 'auto');
	setTimeout(function () {
		aplicarDatePickers();
		// aplicarHoras();
		aplicarTiempos();
		AplicarImputFile(idImput);
		aplicarVisorImagenArchivo(idImagenUsuario);
		crearPopup(idModalConceptoEdicion, "62%", "auto");
	}, 2000)
}

function ejecutarScriptsPlanillaSueldos(idModalNuevaPlanillaSueldos, idModalEditarPlanillaSueldo, idModalParametros, idModalTR3,
	idModalHistorialTR3) {
	crearPopup(idModalNuevaPlanillaSueldos, "100%", "auto");
	crearPopup(idModalEditarPlanillaSueldo, "50%", "auto");
	crearPopup(idModalParametros, "90%", "auto");
	crearPopup(idModalTR3, "75%", "auto");
	crearPopup(idModalHistorialTR3, "70%", "auto");
}

function ejecutarScriptsIncrementoSalarial(idModalNuevoIncrementoSalarial) {
	crearPopup(idModalNuevoIncrementoSalarial, "100%", "auto");
}

function ejecutarScriptsPlanillaRCIVA(idModalNuevoPlanillaRCIVA, idModalFormulario110, idModalFormularioGeneral110,
	idModalArchivosTXT) {
	crearPopup(idModalNuevoPlanillaRCIVA, "100%", "auto");
	crearPopup(idModalFormulario110, "40%", "auto");
	crearPopup(idModalFormularioGeneral110, "70%", "auto");
	crearPopup(idModalArchivosTXT, "60%", "auto");
}
function ejecutarScriptsPlanillaRetroActivos(idModalNuevoPlanillaRetroactivo) {
	crearPopup(idModalNuevoPlanillaRetroactivo, "100%", "auto");
}

function aplicarTab(idTab) {
	$("#" + idTab).tabs({ orientation: "vertical" });
}

function ejecutarScriptsComprobantesContabilidad(idModalWizardComprobantesContabilidadNueva, idModalInventario, idModalWizardComprobantesContabilidadModificar) {
	crearPopup(idModalWizardComprobantesContabilidadNueva, "100%", 600);
	crearPopup(idModalInventario, "100%", 600);
	crearPopup(idModalWizardComprobantesContabilidadModificar, "100%", 600);
	aplicarDatePickers();
}
function ejecutarScriptsEstadoCuentasClientes(idPopupTablaEstadoCuentasClientes) {
	crearPopup(idPopupTablaEstadoCuentasClientes, "60%", 550);
	aplicarDatePickers();
}

function ejecutarScriptsContabilidadCuentas(idModalWizardCuentaEdicion,
	idModalWizardContainerCuentaEdicion,
	idModalWizardClasificacionCuentaNueva,
	idModalWizardContainerClasificacionNueva,
	idModalWizardClasificacionVer,
	idModalWizardCuentaVer,
	idModalWizardContainerCuentaVer,
	idModalEliminarCuenta,
	idModalPlantilla,
	idModalWizardTipoCuenta,
	idModalWizardClasificacionCuenta) {
	crearPopup(idModalEliminarCuenta, "20%", 250);
	crearPopup(idModalWizardCuentaVer, "55%", 500);
	crearPopup(idModalWizardCuentaEdicion, "60%", 500);
	crearPopup(idModalWizardClasificacionCuentaNueva, "50%", 300);
	crearPopup(idModalWizardClasificacionVer, "60%", 550);
	crearPopup(idModalPlantilla, "50%", 450);
	crearPopup(idModalWizardTipoCuenta, "50%", 300);
	crearPopup(idModalWizardClasificacionCuenta, "50%", 350);
	aplicarWizardFormulario(idModalWizardCuentaVer, idModalWizardContainerCuentaVer);
	aplicarWizardFormulario(idModalWizardCuentaEdicion, idModalWizardContainerCuentaEdicion);
	aplicarDatePickers();
}


function ejecutarScriptsRuta(idPopupEdicion, idPopupVista, idPopupEliminacion, idContenedorEdicion, idContenedorVista) {
	crearPopup(idPopupEdicion, "60%", 550);
	crearPopup(idPopupVista, "60%", 550);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarDatePickers();
	crearPopup(idPopupEliminacion, "30%", 170);
}

function ejecutarScriptsEstadoResultadosNoContable(idPopupGastos) {
	crearPopup(idPopupGastos, "30%", 100);
	aplicarDatePickers();
}

function ejecutarScriptsConfiguracionFactura(idPopupEdicion, idContenedorEdicion, idPopupEdicionGeneral, idContenedorEdicionGeneral) {
	crearPopup(idPopupEdicion, "60%", 550);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	crearPopup(idPopupEdicionGeneral, "60%", 550);
	aplicarWizardFormulario(idPopupEdicionGeneral, idContenedorEdicionGeneral);
}

function ejecutarScriptsConfiguracionApp(idPopupEdicion, idContenedorEdicion, idPopupEdicionGeneral, idContenedorEdicionGeneral) {
	crearPopup(idPopupEdicion, "60%", 550);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	crearPopup(idPopupEdicionGeneral, "60%", 550);
	aplicarWizardFormulario(idPopupEdicionGeneral, idContenedorEdicionGeneral);
}

function ejecutarScriptsSeguimiento(idPopupSeguimiento, idPopupFiltro, idPopupFiltroGraficos, idPopupComisiones) {
	aplicarDatePickers();
	crearPopup(idPopupSeguimiento, "60%", 550);
	crearPopup(idPopupFiltro, "80%", 200);
	crearPopup(idPopupFiltroGraficos, "80%", 650);
	crearPopup(idPopupComisiones, "80%", 650);
};
function ejecutarScriptsVentasMensuales() {
	aplicarDatePickers();
}

function ejecutarScriptsVenta(idPopupEdicion, idPopupVista, idPopupEliminacion,
	idContenedorEdicion, idContenedorVista, idInput, url,
	idPopupPago, idPopupCierre, idPopupPanel, idPopupEliminacion, idModalInventario, idModalPanelCobro,
	idModalVendedor) {
	crearPopup(idPopupEdicion, "100%", 600);
	crearPopup(idPopupVista, "100%", 600);
	crearPopup(idModalInventario, "85%", 550);
	crearPopup(idPopupPago, "30%", 200);
	crearPopup(idPopupCierre, "30%", 200);
	setTimeout(function () {
		aplicarDatePickers();
		$("#venta-proforma").draggable();
	}, 2000);
	crearPopup(idPopupEliminacion, "30%", 170);
	crearPopup(idPopupPanel, "100%", screen.height);
	crearPopup(idModalPanelCobro, "40%", 500);
	crearPopup(idPopupEliminacion, "30%", 350);
	crearPopup(idModalVendedor, "50%", 250);

	$(document).on('click', '#campos-detalle-venta', function (e) {
		e.stopPropagation();
	});
}

function ejecutarScriptsCompra(idPopupEdicion, idPopupVista, idPopupEliminacion,
	idContenedorEdicion, idContenedorVista, idInput, url, idPopupPago) {
	crearPopup(idPopupEdicion, "100%", 600);
	crearPopup(idPopupVista, "100%", 600);
	crearPopup(idPopupPago, "30%", 200);
	setTimeout(function () {
		aplicarDatePickers();
	}, 200);
	//aplicarWizardFormulario(idPopupEdicion,idContenedorEdicion);
	//aplicarWizardFormulario(idPopupVista,idContenedorVista);
	crearPopup(idPopupEliminacion, "30%", 170);
	//aplicarCompletarTexto(idInput,url);

	$(document).on('click', '#campos-detalle-compra', function (e) {
		e.stopPropagation();
	});
}

function ejecutarScriptsDosificacion(idPopupEdicion, idPopupVista, idPopupEliminacion, idContenedorEdicion, idContenedorVista) {
	crearPopup(idPopupEdicion, "60%", 550);
	crearPopup(idPopupVista, "60%", 550);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	crearPopup(idPopupEliminacion, "30%", 170);
	aplicarDatePickers();
}

function ejecutarScriptsSucursal(idPopupEdicion, idPopupVista, idPopupEliminacion, idContenedorEdicion, idContenedorVista, idPopupCorrelativoEdicion) {
	crearPopup(idPopupEdicion, "60%", 550);
	crearPopup(idPopupVista, "60%", 550);
	crearPopup(idPopupCorrelativoEdicion, "60%", 450);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	crearPopup(idPopupEliminacion, "30%", 170);
}

function ejecutarScriptsConcepto(idPopupEdicion, idContenedorEdicion) {
	crearPopup(idPopupEdicion, "80%", 710);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
}

function ejecutarScriptsProducto(idPopupEdicion, idPopupVista, idPopupKadex, idPopupEliminacion, idContenedorEdicion, idContenedorVista, idContenedorKardex, idImagen) {
	crearPopup(idPopupEdicion, "60%", 610);
	crearPopup(idPopupVista, "60%", 610);
	crearPopup(idPopupKadex, "90%", 610);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarWizardFormulario(idPopupKadex, idContenedorKardex);
	aplicarVisorImagenArchivo(idImagen);
	crearPopup(idPopupEliminacion, "30%", 170);
	setTimeout(function () {
		aplicarDatePickers();
	}, 200);
}

function ejecutarScriptsProveedor(idPopupEdicion, idPopupVista, idPopupEliminacion, idContenedorEdicion, idContenedorVista) {
	crearPopup(idPopupEdicion, "60%", 550);
	crearPopup(idPopupVista, "60%", 550);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarDatePickers();
	crearPopup(idPopupEliminacion, "30%", 170);
}

function ejecutarScriptsCliente(idPopupEdicion, idPopupVista, idPopupEliminacion, idContenedorEdicion, idContenedorVista) {
	crearPopup(idPopupEdicion, "60%", 550);
	crearPopup(idPopupVista, "60%", 550);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarDatePickers();
	crearPopup(idPopupEliminacion, "30%", 170);
}

function ejecutarScriptsUsuario(idPopupEdicion, idImagen, idContenedorEdicion, idPopupVista, idContenedorVista,
	idPopupEliminacion, idPopupRutas, idContenedorRutas, idPopupComisiones, idContenedorComisiones) {
	crearPopup(idPopupEdicion, "60%", 550);
	crearPopup(idPopupVista, "60%", 550);
	crearPopup(idPopupRutas, "60%", 550);
	crearPopup(idPopupComisiones, "60%", 550);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarWizardFormulario(idPopupRutas, idContenedorRutas);
	aplicarWizardFormulario(idPopupComisiones, idContenedorComisiones);
	crearPopup(idPopupEliminacion, "30%", 170);
	aplicarVisorImagenArchivo(idImagen);
}

function ejecutarScriptsEmpresa(idPopupEdicion, idImagen, idContenedorEdicion, idPopupVista, idContenedorVista, idPopupEliminacion) {
	crearPopup(idPopupEdicion, "60%", 710);
	crearPopup(idPopupVista, "60%", 710);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarVisorImagenArchivo(idImagen);
	crearPopup(idPopupEliminacion, "30%", 170);
	aplicarVisorImagenArchivo(idImagen);
}

function ejecutarScriptsBanco(idPopupEdicion, idContenedorEdicion, idPopupVista, idContenedorVista, idPopupEliminacion) {
	crearPopup(idPopupEdicion, "60%", 710);
	crearPopup(idPopupVista, "60%", 710);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	crearPopup(idPopupEliminacion, "30%", 170);
}

function ejecutarScriptsCierre(idPopupEdicion, idContenedorEdicion, idPopupVista, idContenedorVista, idPopupEliminacion,
	idModalDeposito, idPopupDatosAdicionales) {
	crearPopup(idPopupEdicion, "60%", 710);
	crearPopup(idPopupVista, "60%", 710);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	crearPopup(idPopupEliminacion, "30%", 170);
	crearPopup(idModalDeposito, "50%", 500);
	crearPopup(idPopupDatosAdicionales, "60%", 200);
	aplicarDatePickers();
}
function ejecutarScriptsVehiculos(modalNuevoMantenimiento, modalReportarIncidente, modalCheckListDiario, modalCheckListMensual, modalEditarHistorico,
	modalOTEdicionCorrectivo, modalMantenimientoCorrectivo, modalBusquedaProducto, modalBusquedaEncargado, modalLogin,
	modalNuevoMantenimientoMaquinaria, modalCheckListMensualMaquinaria, modalEditarItemList, modalProxMantenimientoMaquinaria,
	modalProxMantenimientoVehiculo, modalCalendar, modalFichaVehiculo, modalEditarCheckList, modalBuscarMaquinaria, modalReportarIncidenteMaquinaria,
	idModalInicioMantenimiento, idModalOTNuevo, idModalwizardContainerOTNuevo, idModalFacturaServicioExterno, idModaRepuestosOT, idModalEventoCalendario, idModalEditarEventoCalendario) {
	crearPopup(modalNuevoMantenimiento, "43%", 300);
	crearPopup(modalReportarIncidente, "45%", 445);
	crearPopup(modalCheckListDiario, "45%", 710);
	crearPopup(modalCheckListMensual, "45%", 710);
	crearPopup(modalEditarHistorico, "45%", 500);
	crearPopup(modalOTEdicionCorrectivo, "100%", 800);
	crearPopup(modalMantenimientoCorrectivo, "50%", 360);
	crearPopup(modalBusquedaProducto, "45%", 510);
	crearPopup(modalBusquedaEncargado, "45%", 460);
	crearPopup(modalLogin, "43%", 290);
	crearPopup(modalNuevoMantenimientoMaquinaria, "43%", 250);
	crearPopup(modalCheckListMensualMaquinaria, "45%", 560);
	crearPopup(modalEditarItemList, "50%", 360);
	crearPopup(modalProxMantenimientoMaquinaria, "50%", 360);
	crearPopup(modalProxMantenimientoVehiculo, "50%", 360);
	crearPopup(modalCalendar, "80%", 600);
	crearPopup(modalFichaVehiculo, "45%", 833);
	crearPopup(modalEditarCheckList, "45%", 400);
	crearPopup(modalBuscarMaquinaria, "45%", 260);
	crearPopup(modalReportarIncidenteMaquinaria, "45%", 450);
	// ======
	crearPopup(idModalInicioMantenimiento, "50%", 'auto');
	crearPopup(idModalOTNuevo, "90%", 'auto');
	aplicarWizardFormulario(idModalOTNuevo, idModalwizardContainerOTNuevo);
	crearPopup(idModalFacturaServicioExterno, "50%", 'auto');
	crearPopup(idModaRepuestosOT, "75%", 'auto');
	crearPopup(idModalEventoCalendario, "45%", 250);
	crearPopup(idModalEditarEventoCalendario, "45%", 250);
	aplicarModalCabeceraBotonesVehiculos();
	aplicarMultiSelect();

	aplicarDatePickers();
	// aplicarHoras();
	aplicarTiempos();
}

function aplicarMultiSelect() {
	$('.multiselect').multiselect({
		enableFiltering: true,
		enableHTML: true,
		buttonClass: 'btn btn-white btn-primary',
		templates: {
			button: '<button type="button" class="multiselect dropdown-toggle form-control" data-toggle="dropdown"><span class="multiselect-selected-text"></span> &nbsp;<b class="fa fa-caret-down"></b></button>',
			ul: '<ul class="multiselect-container dropdown-menu"></ul>',
			filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
			filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default btn-white btn-grey multiselect-clear-filter" type="button"><i class="fa fa-times-circle red2"></i></button></span>',
			li: '<li><a tabindex="0"><label></label></a></li>',
			divider: '<li class="multiselect-item divider"></li>',
			liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
		}
	});
	$(".knob").knob();

}

function aplicarModalCabeceraBotonesVehiculos() {
	$("#id-btn-edicion-correctivo").on('click', function (e) {
		e.preventDefault();

		$("#dialog-edicion-correctivo").removeClass('hide').dialog({
			resizable: true,
			width: '100%',
			modal: true,
			title: "<div class='bg-green' ><h4 class='smaller'><i class='fa fa-calendar  '></i> <label>Registro/edición Orden de Trabajo</label></h4></div>",
			title_html: true,
			buttons: [{
				html: "<i class='ace-icon fa fa-check bigger-110'></i>&nbsp; Finalizar orden de trabajo",
				"class": "btn btn-success",
				click: function () {
					$(this).dialog("close");
				}
			}, {
				html: "<i class='ace-icon fa fa-floppy-o bigger-110'></i>&nbsp; Guardar",
				"class": "btn btn-primary",
				click: function () {
					$(this).dialog("close");
				}
			}, {
				html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Cancelar",
				"class": "btn btn-danger",
				click: function () {
					$(this).dialog("close");
				}
			}]
		});
	});
	$("#id-btn-mantenimiento-correctivo").on('click', function (e) {
		e.preventDefault();

		$("#dialog-mantenimiento-correctivo").removeClass('hide').dialog({
			resizable: true,
			width: '1200',
			modal: true,
			title: "<div ><h4 class='smaller'><i class='fa fa-calendar  '></i> <label>Mantenimiento Correctivo</label></h4></div>",
			title_html: true,
			buttons: [{
				html: "<i class='ace-icon fa fa-print bigger-110'></i>&nbsp; Imprimir",
				"class": "btn btn-primary",
				click: function () {
					$(this).dialog("close");
				}
			}, {
				html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; Cancelar",
				"class": "btn btn-danger",
				click: function () {
					$(this).dialog("close");
				}
			}]
		});
	});
}

function resaltarPestaña(idMenu) {
	$('#sidebar ul li.active').removeClass("active");
	$('#sidebar2 ul li.active').removeClass("active");
	$('#' + idMenu + '1').addClass("active");
	$('#' + idMenu + '2').addClass("active");
}

function ocultarPopup(idPopup) {
	$("#" + idPopup).dialog('close');
}

function eliminarPopup(idPopup) {
	$("#" + idPopup).dialog('destroy');

}

function abrirPopup(idPopup) {
	$("#" + idPopup).dialog('open');

}

function aplicarDatePickers() {
	$('.date-picker').datepicker({
		autoclose: true,
		todayHighlight: true,
		defaultDate: new Date($('#' + $(this).attr('id')).val()),
		onSelect: function (dateText) {
			console.log("3333");
			$('#' + $(this).attr('id')).trigger('change');
		}
	})
		//show datepicker when clicking on the icon
		.next().on(ace.click_event, function () {
			$(this).prev().focus();
		});
}

function aplicarListasDesplegables() {
	var demo1 = $('select[name="duallistbox_demo1[]"]').bootstrapDualListbox({ infoTextFiltered: '<span class="label label-purple label-lg">Filtered</span>' });
	var container1 = demo1.bootstrapDualListbox('getContainer');
	container1.find('.btn').addClass('btn-white btn-info btn-bold');

	/**var setRatingColors = function() {
		$(this).find('.star-on-png,.star-half-png').addClass('orange2').removeClass('grey');
		$(this).find('.star-off-png').removeClass('orange2').addClass('grey');
	}*/
	$('.rating').raty({
		'cancel': true,
		'half': true,
		'starType': 'i'
		/**,
		
		'click': function() {
			setRatingColors.call(this);
		},
		'mouseover': function() {
			setRatingColors.call(this);
		},
		'mouseout': function() {
			setRatingColors.call(this);
		}*/
	})//.find('i:not(.star-raty)').addClass('grey');



	//////////////////
	//select2
	$('.select2').css('width', '200px').select2({ allowClear: true, language: "es" });
	$('.select2').on("change", function (e) {
		console.log($(this).attr('id'));
		$('#' + $(this).attr('id')).trigger('change');
	});

	$('#select2-multiple-style .btn').on('click', function (e) {
		var target = $(this).find('input[type=radio]');
		var which = parseInt(target.val());
		if (which == 2) $('.select2').addClass('tag-input-style');
		else $('.select2').removeClass('tag-input-style');
	});

	//////////////////
	$('.multiselect').multiselect({
		enableFiltering: true,
		buttonClass: 'btn btn-white btn-primary',
		templates: {
			button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"></button>',
			ul: '<ul class="multiselect-container dropdown-menu"></ul>',
			filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="fa fa-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
			filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default btn-white btn-grey multiselect-clear-filter" type="button"><i class="fa fa-times-circle red2"></i></button></span>',
			li: '<li><a href="javascript:void(0);"><label></label></a></li>',
			divider: '<li class="multiselect-item divider"></li>',
			liGroup: '<li class="multiselect-item group"><label class="multiselect-group"></label></li>'
		}
	});


	///////////////////

	//typeahead.js
	//example taken from plugin's page at: https://twitter.github.io/typeahead.js/examples/
	var substringMatcher = function (strs) {
		return function findMatches(q, cb) {
			var matches, substringRegex;

			// an array that will be populated with substring matches
			matches = [];

			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');

			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(strs, function (i, str) {
				if (substrRegex.test(str)) {
					// the typeahead jQuery plugin expects suggestions to a
					// JavaScript object, refer to typeahead docs for more info
					matches.push({ value: str });
				}
			});

			cb(matches);
		}
	}

	$('input.typeahead').typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	}, {
			name: 'states',
			displayKey: 'value',
			source: substringMatcher(ace.vars['US_STATES'])
		});


	///////////////


	//in ajax mode, remove remaining elements before leaving page
	$(document).one('ajaxloadstart.page', function (e) {
		$('[class*=select2]').remove();
		$('select[name="duallistbox_demo1[]"]').bootstrapDualListbox('destroy');
		$('.rating').raty('destroy');
		$('.multiselect').multiselect('destroy');
	});
}

function aplicarVisorImagenArchivo(idImagen) {
	$('#' + idImagen).ace_file_input({
		style: 'well',
		btn_choose: 'Arrastra una imagen o click para cargar',
		btn_change: null,
		no_icon: 'ace-icon fa fa-cloud-upload',
		droppable: true,
		thumbnail: 'small'//large | fit
		//,icon_remove:null//set null, to hide remove/reset button
		/**,before_change:function(files, dropped) {
			//Check an example below
			//or examples/file-upload.html
			return true;
		}*/
		/**,before_remove : function() {
			return true;
		}*/
		,
		preview_error: function (filename, error_code) {
			//name of the file that failed
			//error_code values
			//1 = 'FILE_LOAD_FAILED',
			//2 = 'IMAGE_LOAD_FAILED',
			//3 = 'THUMBNAIL_FAILED'
			//alert(error_code);
		}

	}).on('change', function () {
		//console.log($(this).data('ace_input_files'));
		//console.log($(this).data('ace_input_method'));
	});
}

function AplicarImputFile(idImput) {
	$('#' + idImput).ace_file_input({
		no_file: 'Ningún archivo ..',
		btn_choose: 'Escoger',
		btn_change: 'Cambiar',
		droppable: false,
		onchange: null,
		thumbnail: false //| true | large
		//whitelist:'gif|png|jpg|jpeg'
		//blacklist:'exe|php'
		//onchange:''
		//
	});
}

function aplicarWizardFormulario(idPopup, idContenedor) {
	$('[data-rel=tooltip]').tooltip();
	var $validation = false;
	$('#' + idContenedor).ace_wizard();
	$('#' + idPopup + ' .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');
	$(document).one('ajaxloadstart.page', function (e) {
		//in ajax mode, remove remaining elements before leaving page
		$('[class*=select2]').remove();
	});
}

var numDialog = 0;
function crearPopup(idPopup, ancho, altura) {
	/*$.widget("ui.dialog", $.ui.dialog,
	{
	    open: function ()
	    {
	        var $dialog = $(this.element[0]);
	        var maxZ = 0;
	        // $('*').each(function ()
	        // {
	        //     var thisZ = $(this).css('z-index');
	        //     thisZ = (thisZ === 'auto' ? (Number(maxZ) + 1) : thisZ);
	        //     if (thisZ > maxZ){ 
	        //     	maxZ = thisZ;
	        //     };
	            
	        // });
	        numDialog = numDialog + 1;
	      
	        var thisZ = $(".ui-widget-overlay").css('z-index');
	        maxZ = (thisZ === 'auto' ? (Number(maxZ) + 1) : thisZ);
	        
	        // $(".datepicker").attr('style', 'z-index: 9999999 !important'); 
	        $(".ui-widget-overlay").attr('style', 'z-index: 99999 !important');
	        $dialog.parent().attr('style', 'z-index: '+(maxZ + numDialog)+'!important');

	        return this._super();
	    },
	    close: function () {
	       var $dialog = $(this.element[0]);
	        $(".ui-widget-overlay").attr('style', 'z-index: 90!important');
	        $dialog.parent().attr('style', 'z-index: 1050 !important');
	        return this._super();
	    }
	});*/

	var dialog = $("#" + idPopup).dialog({
		modal: true,
		width: ancho,
		height: altura,
		autoOpen: false
	});


	$("#" + idPopup).siblings('.ui-dialog-titlebar').remove();
	$("#" + idPopup).dialog("moveToTop");
}

function crearArregloColumnas(valor, longitud) {
	var arr = [], i = longitud + 2;
	while (i--) {
		arr[i] = valor;
	}
	return arr;
}

function ejecutarScriptsTabla(idTabla, longitudColumnas) {
	var columnas = crearArregloColumnas(null, longitudColumnas);
	columnas[0] = { "bSortable": false };
	columnas[longitudColumnas + 1] = { "bSortable": false };
	//initiate dataTables plugin
	var oTable1 =
		$('#' + idTabla)
			//.wrap("<div class='dataTables_borderWrap' />")   //if you are applying horizontal scrolling (sScrollX)
			.dataTable({
				destroy: true,
				"language": {
					"lengthMenu": "Mostrar _MENU_ objetos por página",
					"zeroRecords": "No existen resultados - lo sentimos",
					"info": "Mostrando página _PAGE_ de _PAGES_",
					"infoEmpty": "Ningun objeto disponible",
					"infoFiltered": "(Filtrando de un total de _MAX_ objetos)"
				},
				bAutoWidth: false,
				"aoColumns": columnas,
				"aaSorting": [],

				//,
				//"sScrollY": "200px",
				//"bPaginate": false,

				//"sScrollX": "100%",
				//"sScrollXInner": "120%",
				//"bScrollCollapse": true,
				//Note: if you are applying horizontal scrolling (sScrollX) on a ".table-bordered"
				//you may want to wrap the table inside a "div.dataTables_borderWrap" element

				//"iDisplayLength": 50
			});
	//oTable1.fnAdjustColumnSizing();


	//TableTools settings
	TableTools.classes.container = "btn-group btn-overlap";
	TableTools.classes.print = {
		"body": "DTTT_Print",
		"info": "tableTools-alert gritter-item-wrapper gritter-info gritter-center white",
		"message": "tableTools-print-navbar"
	}

	//initiate TableTools extension
	var tableTools_obj = new $.fn.dataTable.TableTools(oTable1, {
		"sSwfPath": "assets/swf/copy_csv_xls_pdf.swf",

		"sRowSelector": "td:not(:last-child)",
		"sRowSelect": "multi",
		"fnRowSelected": function (row) {
			//check checkbox when row is selected
			try { $(row).find('input[type=checkbox]').get(0).checked = true }
			catch (e) { }
		},
		"fnRowDeselected": function (row) {
			//uncheck checkbox
			try { $(row).find('input[type=checkbox]').get(0).checked = false }
			catch (e) { }
		},

		"sSelectedClass": "success",
		"aButtons": [
			{
				"sExtends": "copy",
				"sToolTip": "Copy to clipboard",
				"sButtonClass": "btn btn-white btn-primary btn-bold",
				"sButtonText": "<i class='fa fa-copy bigger-110 pink'></i>",
				"fnComplete": function () {
					this.fnInfo('<h3 class="no-margin-top smaller">Table copied</h3>\
									<p>Copied '+ (oTable1.fnSettings().fnRecordsTotal()) + ' row(s) to the clipboard.</p>',
						1500
					);
				}
			},

			{
				"sExtends": "csv",
				"sToolTip": "Export to CSV",
				"sButtonClass": "btn btn-white btn-primary  btn-bold",
				"sButtonText": "<i class='fa fa-file-excel-o bigger-110 green'></i>"
			},

			{
				"sExtends": "pdf",
				"sToolTip": "Export to PDF",
				"sButtonClass": "btn btn-white btn-primary  btn-bold",
				"sButtonText": "<i class='fa fa-file-pdf-o bigger-110 red'></i>"
			},

			{
				"sExtends": "print",
				"sToolTip": "Print view",
				"sButtonClass": "btn btn-white btn-primary  btn-bold",
				"sButtonText": "<i class='fa fa-print bigger-110 grey'></i>",

				"sMessage": "<div class='navbar navbar-default'><div class='navbar-header pull-left'><a class='navbar-brand' href='#'><small>Optional Navbar &amp; Text</small></a></div></div>",

				"sInfo": "<h3 class='no-margin-top'>Print view</h3>\
									  <p>Please use your browser's print function to\
									  print this table.\
									  <br />Press <b>escape</b> when finished.</p>",
			}
		]
	});
	//we put a container before our table and append TableTools element to it
	$(tableTools_obj.fnContainer()).appendTo($('.tableTools-container'));

	//also add tooltips to table tools buttons
	//addding tooltips directly to "A" buttons results in buttons disappearing (weired! don't know why!)
	//so we add tooltips to the "DIV" child after it becomes inserted
	//flash objects inside table tools buttons are inserted with some delay (100ms) (for some reason)
	setTimeout(function () {
		$(tableTools_obj.fnContainer()).find('a.DTTT_button').each(function () {
			var div = $(this).find('> div');
			if (div.length > 0) div.tooltip({ container: 'body' });
			else $(this).tooltip({ container: 'body' });
		});
	}, 200);



	//ColVis extension
	var colvis = new $.fn.dataTable.ColVis(oTable1, {
		"buttonText": "<i class='fa fa-search'></i>",
		"aiExclude": [0, 6],
		"bShowAll": true,
		//"bRestore": true,
		"sAlign": "right",
		"fnLabel": function (i, title, th) {
			return $(th).text();//remove icons, etc
		}

	});

	//style it
	$(colvis.button()).addClass('btn-group').find('button').addClass('btn btn-white btn-info btn-bold')

	//and append it to our table tools btn-group, also add tooltip
	$(colvis.button())
		.prependTo('.tableTools-container .btn-group')
		.attr('title', 'Show/hide columns').tooltip({ container: 'body' });

	//and make the list, buttons and checkboxed Ace-like
	$(colvis.dom.collection)
		.addClass('dropdown-menu dropdown-light dropdown-caret dropdown-caret-right')
		.find('li').wrapInner('<a href="javascript:void(0)" />') //'A' tag is required for better styling
		.find('input[type=checkbox]').addClass('ace').next().addClass('lbl padding-8');



	/////////////////////////////////
	//table checkboxes
	//$('th input[type=checkbox], td input[type=checkbox]').prop('checked', false);

	//select/deselect all rows according to table header checkbox
	$('#' + idTabla + ' > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
		var th_checked = this.checked;//checkbox inside "TH" table header

		$(this).closest('table').find('tbody > tr').each(function () {
			var row = this;
			if (th_checked) tableTools_obj.fnSelect(row);
			else tableTools_obj.fnDeselect(row);
		});
	});

	//select/deselect a row when the checkbox is checked/unchecked
	$('#' + idTabla).on('click', 'td input[type=checkbox]', function () {
		var row = $(this).closest('tr').get(0);
		if (!this.checked) tableTools_obj.fnSelect(row);
		else tableTools_obj.fnDeselect($(this).closest('tr').get(0));
	});




	$(document).on('click', '#' + idTabla + ' .dropdown-toggle', function (e) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		e.preventDefault();
	});


	//And for the first simple table, which doesn't have TableTools or dataTables
	//select/deselect all rows according to table header checkbox
	var active_class = 'active';
	$('#simple-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
		var th_checked = this.checked;//checkbox inside "TH" table header

		$(this).closest('table').find('tbody > tr').each(function () {
			var row = this;
			if (th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
			else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
		});
	});

	//select/deselect a row when the checkbox is checked/unchecked
	$('#simple-table').on('click', 'td input[type=checkbox]', function () {
		var $row = $(this).closest('tr');
		if (this.checked) $row.addClass(active_class);
		else $row.removeClass(active_class);
	});



	/********************************/
	//add tooltip for small view action buttons in dropdown menu
	$('[data-rel="tooltip"]').tooltip({ placement: tooltip_placement });

	//tooltip placement on right or left
	function tooltip_placement(context, source) {
		var $source = $(source);
		var $parent = $source.closest('table')
		var off1 = $parent.offset();
		var w1 = $parent.width();

		var off2 = $source.offset();
		//var w2 = $source.width();

		if (parseInt(off2.left) < parseInt(off1.left) + parseInt(w1 / 2)) return 'right';
		return 'left';
	}
}

function convertirFecha(fecha) {
	var dia = fecha.split('/')[0];
	var mes = fecha.split('/')[1];
	var año = fecha.split('/')[2];
	if (año == undefined) {
		año = new Date().getFullYear();
	}
	return mes + '/' + dia + '/' + año;
}

function sumaFecha(d, fecha) {

	var Fecha = new Date(fecha);
	var dia = Fecha.getDate(),
		mes = Fecha.getMonth() + 1,
		anio = Fecha.getFullYear(),
		addTime = d * 86400;
	var date = Fecha.setSeconds(addTime)
	/*console.log("Fecha actual: " + dia + "/" + mes + "/" + anio)
	console.log("Tiempo añadido: " + d )
	console.log("Fecha final: " + Fecha.getDate() + "/" + (Fecha.getMonth() + 1) + "/" + Fecha.getFullYear())*/
	fecha = new Date(Fecha);
	return (Fecha);
}

function aplicarSwiper(slidesPerView, slidesPerColumn, paginationClickable, spaceBetween) {
	var swiper = new Swiper('.swiper-container', {
		//pagination: '.swiper-pagination',
		slidesPerView: slidesPerView,
		slidesPerColumn: slidesPerColumn,
		paginationClickable: paginationClickable,
		spaceBetween: spaceBetween
	});
}

function aplicarTiempos() {
	$('.date-timepicker').datetimepicker({
		//format: 'MM/DD/YYYY h:mm:ss A',//use this option to display seconds
		icons: {
			time: 'fa fa-clock-o',
			date: 'fa fa-calendar',
			up: 'fa fa-chevron-up',
			down: 'fa fa-chevron-down',
			previous: 'fa fa-chevron-left',
			next: 'fa fa-chevron-right',
			today: 'fa fa-arrows ',
			clear: 'fa fa-trash',
			close: 'fa fa-times'
		}
	}).next().on(ace.click_event, function () {
		$(this).prev().focus();
	});
}





