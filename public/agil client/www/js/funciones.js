function ejecutarScriptDespacho(idModalAsignacionFactura, idModalVentaKardexFactura, idModalAsignacionFacturaKardex, idModalDetalleKardex, IdModalVerificarCuenta,
	IdModalCobros, IdModalHistorialCobros,idModalConceptoEdicion,idModalAsignacionDespacho) {

	crearPopup(idModalVentaKardexFactura, "80%", 'auto');
	crearPopup(idModalAsignacionFactura, "auto", 'auto');
	crearPopup(idModalDetalleKardex, "auto", 'auto')
	crearPopup(idModalAsignacionFacturaKardex, "auto", 'auto')
	crearPopup(IdModalCobros, "50%", 'auto');
	crearPopup(IdModalHistorialCobros, "50%", 'auto');
	crearPopup(idModalAsignacionDespacho, "auto", 'auto');
	crearPopup(IdModalVerificarCuenta, "auto", 'auto');
	setTimeout(function () {
		crearPopup(idModalConceptoEdicion, "auto", 'auto');
		
	}, 2000);
	
}

function ejecutarScriptEstibaje(idModalWizardEstibajeEdicion, idContenedorEdicionEstibaje) {
	crearPopup(idModalWizardEstibajeEdicion, "60%", 550);
	aplicarWizardFormulario(idModalWizardEstibajeEdicion, idContenedorEdicionEstibaje);
}

function ejecutarScriptsPedidos(idDialogListadoPedido, idDialogProductosProveedor, idDialogBusquedaProveedor, idDialogProductosAsigandosProveedor) {
	crearPopup(idDialogListadoPedido, "auto", 'auto');
	crearPopup(idDialogBusquedaProveedor, "auto", 'auto');
	crearPopup(idDialogProductosProveedor, screen.width, screen.height);
	crearPopup(idDialogProductosAsigandosProveedor, screen.width, screen.height);
	// aplicarWizardFormulario(idModalWizardEstibajeEdicion, idContenedorEdicionEstibaje);
}

function ejecutarScriptDestino(idModalWizardDestinoEdicion, idContenedorEdicionDestino, idModalConceptoEdicionCorrelativos,
	IdModalVerificarCuenta) {	crearPopup(idModalWizardDestinoEdicion, "60%", 550);
	aplicarWizardFormulario(idModalWizardDestinoEdicion, idContenedorEdicionDestino);
	
	setTimeout(function () {
		crearPopup(idModalConceptoEdicionCorrelativos, "auto", 'auto');
		crearPopup(IdModalVerificarCuenta, "auto", 'auto');
	}, 3000);

}
function ejecutarScriptsConfiguracionEstadosFinacioneros(idModalConfiguracionGestion,idModalDetalleImpresion){
	crearPopup(idModalConfiguracionGestion, "auto", 'auto');
	crearPopup(idModalDetalleImpresion,  'auto', 'auto');
	setTimeout(function () {
		aplicarDatePickers();
	}, 200);
	
}
function  ejecutarScriptsSolicitudCajaChicas(idModalSolicitudCajaChica,idModalConceptosMovimiento,idModalEliminarSolicitud,idModalVerificarAutorizacion){
	crearPopup(idModalSolicitudCajaChica, "auto", 'auto');
	crearPopup(idModalConceptosMovimiento, "auto", 'auto');
	crearPopup(idModalEliminarSolicitud, "auto", 'auto');
	crearPopup(idModalVerificarAutorizacion, "auto", 'auto');
	
	setTimeout(function () {
		aplicarDatePickers();
	}, 200);
	
}
function  ejecutarScriptsCajaChicas(idModalSolicitudCajaChica,idModalConceptosMovimiento,idModalEliminarSolicitud,idModalVerificarAutorizacion,idModalRegistroCajaChica,
	idModalKardexCajaChica,idModalIngresosCajaChica,idModalRegistroIngresoCajaChica,idModalHistorialCierreCajaChica,idModalRegistroDesembolsoCajaChica,
	idModalServicios,idModalRegistroAnticipoCajaChica){
	crearPopup(idModalSolicitudCajaChica, "auto", 'auto');
	crearPopup(idModalConceptosMovimiento, "auto", 'auto');
	crearPopup(idModalEliminarSolicitud, "auto", 'auto');
	crearPopup(idModalVerificarAutorizacion, "auto", 'auto');
	crearPopup(idModalIngresosCajaChica, "auto", 'auto');
	crearPopup(idModalKardexCajaChica, "auto", 'auto');
	crearPopup(idModalRegistroCajaChica, "auto", 'auto',20,50);
	crearPopup(idModalRegistroIngresoCajaChica, "auto", 'auto');
	crearPopup(idModalHistorialCierreCajaChica, "auto", 'auto');
	crearPopup(idModalRegistroDesembolsoCajaChica, "auto", 'auto');
	crearPopup(idModalRegistroAnticipoCajaChica, "auto", 'auto');
	crearPopup(idModalServicios, "auto", 'auto');
	setTimeout(function () {
		aplicarDatePickers();
	}, 200);
	
}
	
	

function ejecutarScriptsPolifuncionalidad(modalNuevaEvaluacion, modalNuevaEvaluacionWizard, modalBusquedaPersonal, modalParametrosPolifuncionalidad,
	modalParametrosPolifuncionalidadWizard, idModalReportes, reporteGraficoPolifuncional, modalBusquedaCentroCosto) {
	crearPopup(modalNuevaEvaluacion, 'auto', 'auto');
	crearPopup(modalParametrosPolifuncionalidad, 'auto', 'auto');
	crearPopup(idModalReportes, 'auto', 'auto');
	crearPopup(modalBusquedaPersonal, 'auto', 'auto');
	crearPopup(modalBusquedaCentroCosto, 'auto', 'auto');
	crearPopup(reporteGraficoPolifuncional, '85%', 800);
	aplicarWizardFormulario(modalNuevaEvaluacion, modalNuevaEvaluacionWizard);
	aplicarWizardFormulario(modalParametrosPolifuncionalidad, modalParametrosPolifuncionalidadWizard);
}

function ejecutarScriptsTransacciones(modalNuevoIngreso, modalNuevoEgreso, modalSeguimiento, modalRevision, modalVencimientoCreditos, modalVerIngreso, modalVerEgreso) {
	crearPopup(modalNuevoIngreso, "auto", "auto");
	crearPopup(modalNuevoEgreso, "auto", "auto");
	crearPopup(modalSeguimiento, "auto", "auto");
	crearPopup(modalRevision, "auto", "auto");
	crearPopup(modalVencimientoCreditos, "auto", "auto");
	crearPopup(modalVerIngreso, "auto", "auto");
	crearPopup(modalVerEgreso, "auto", "auto");
	// aplicarWizardFormulario(idModalWizardDestinoEdicion, idContenedorEdicionDestino);
}

function ejecutarScriptsComensales(modalEdicionAlias, modalEdicionGerencias, modalEdicionComensales, modalEdicionComidas, modalEdicionPrecios, dialogClienteEmpresa, busquedaComensalesEmpresa,
	dialogAlertasMarcaciones) {
	crearPopup(modalEdicionAlias, "auto", "auto");
	crearPopup(modalEdicionGerencias, "auto", "auto");
	crearPopup(modalEdicionComensales, "auto", "auto");
	crearPopup(modalEdicionComidas, "auto", "auto");
	crearPopup(modalEdicionPrecios, "auto", "auto");
	crearPopup(dialogClienteEmpresa, "auto", "auto");
	crearPopup(busquedaComensalesEmpresa, "auto", "auto");
	crearPopup(dialogAlertasMarcaciones, "auto", "auto");
	// aplicarWizardFormulario(idModalWizardDestinoEdicion, idContenedorEdicionDestino);
}

function ejecutarScriptsProformas(modalConfiguracionActividadesServicios, wizardConfiguracionActividadesServicios, dialogProformaEdicion, dialogClientesProforma, modalConfiguracionActividades, wizardConfiguracionActividades,
	dialogmodalFechas, dialogBusquedaServicio, dialogDosificacionesDisponibles, confirmarDosificacion, asignacionCentroCostoCliente, dialogClienteEmpresa) {
	crearPopup(modalConfiguracionActividadesServicios, 'auto', 'auto');
	crearPopup(modalConfiguracionActividades, 'auto', 'auto');
	crearPopup(dialogProformaEdicion, 'auto', 'auto');
	crearPopup(dialogClientesProforma, 'auto', 'auto');
	crearPopup(dialogmodalFechas, 'auto', 'auto');
	crearPopup(dialogBusquedaServicio, 'auto', 'auto');
	crearPopup(dialogDosificacionesDisponibles, 'auto', 'auto');
	crearPopup(confirmarDosificacion, 'auto', 'auto');
	crearPopup(asignacionCentroCostoCliente, 'auto', 'auto');
	crearPopup(dialogClienteEmpresa, 'auto', 'auto');
	aplicarWizardFormulario(wizardConfiguracionActividadesServicios);
	aplicarWizardFormulario(wizardConfiguracionActividades);
}
function ejecutarScriptTransportista(idModalWizardTransportistajeEdicion, idContenedorEdicionTransportista) {
	crearPopup(idModalWizardTransportistajeEdicion, "60%", 550);
	aplicarWizardFormulario(idModalWizardTransportistajeEdicion, idContenedorEdicionTransportista);
}

function ejecutarScriptGrupoEstibaje(idModalWizardGrupoEstibajeEdicion, idContenedorEdicionGrupoEstibaje) {
	crearPopup(idModalWizardGrupoEstibajeEdicion, "60%", 550);
	aplicarWizardFormulario(idModalWizardGrupoEstibajeEdicion, idContenedorEdicionGrupoEstibaje);
}


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

function ejecutarScriptsOperaciones(idDialogDialogPanelOperaciones, idDialogEntregaViveres, idConfirmacionCierre, idDialogTotalIngredientes, idDialogoListadoPedido, idDialogoNuevoPedido,
	idDialogProductosProveedor, idDialogBusquedaProveedor, idDialogProductosAsigandosProveedor,idDialogDatos) {
	crearPopup(idDialogDialogPanelOperaciones, "100%", screen.height);
	crearPopup(idDialogEntregaViveres, "60%", 'auto');
	crearPopup(idConfirmacionCierre, "40%", 'auto');
	crearPopup(idDialogTotalIngredientes, "60%", 'auto');
	crearPopup(idDialogoListadoPedido, "auto", 'auto');
	crearPopup(idDialogoNuevoPedido, "auto", 'auto');
	crearPopup(idDialogProductosProveedor, "auto", 'auto');
	crearPopup(idDialogBusquedaProveedor, "auto", 'auto');
	crearPopup(idDialogProductosAsigandosProveedor, "auto", 'auto');
	crearPopup(idDialogDatos, "auto", 'auto');
}
function ejecutarScriptsInicio(idPopupTablaProductos, idPopupTablaCreditos, idPopupTablaDeudas, idPopupPago,
	idPopupActualizarCreditoCliente, idPopupActualizarCreditoDeuda, idPopupDeuda, idModalDescuento, idModalTablaVentasPendientes,
	idModalTablaComprasPendientes, idModalTablaBancosPendientes, idModalTablaOtrosPendientes, idModalInicioSesion, idModalWizardComprobanteEdicion, IdModalOpcionesQr, IdModalRegistrarComprobante, IdModalRevisarComprobante, IdModalLibroMayor, IdModalAsignarCuenta,
	idModalTablaDespachos, idModalTablaAsignacionDespacho, IdModalEliminarProductoVencido, dialogAlertasProformas, facturarProformas, mensajeConfirmacionComprobante, idModalNuevoPedido, idModalDatosProducto, idModalNuevoClientePedido, idModalNuevaRazonCliente,
	idModalNuevoDestino,idModalVerificacionCajaChica) {
	crearPopup(idPopupTablaProductos, "70%", "auto");
	crearPopup(idModalWizardComprobanteEdicion, "100%", "auto");
	crearPopup(idPopupTablaCreditos, "auto", "auto");
	crearPopup(idPopupTablaDeudas, "auto", "auto");
	crearPopup(idPopupPago, "auto", "auto");
	crearPopup(idPopupActualizarCreditoCliente, "auto", "auto");
	crearPopup(idPopupActualizarCreditoDeuda, "auto", "auto");
	crearPopup(idPopupDeuda, "auto", "auto");
	crearPopup(idModalDescuento, "40%", 100);
	crearPopup(idModalTablaVentasPendientes, "60%", "auto");
	crearPopup(idModalTablaComprasPendientes, "60%", 550);
	crearPopup(idModalTablaBancosPendientes, "60%", 550);
	crearPopup(idModalTablaOtrosPendientes, "60%", 550);
	crearPopup(dialogAlertasProformas, 'auto', 'auto');
	crearPopup(idModalInicioSesion, "100%", screen.height);
	crearPopup(mensajeConfirmacionComprobante, "40%", "auto");
	crearPopup(facturarProformas, "80%", 'auto');

	crearPopup(IdModalOpcionesQr, "30%", 250);
	crearPopup(IdModalRegistrarComprobante, "60%", 350);
	crearPopup(IdModalRevisarComprobante, "60%", "auto");
	crearPopup(IdModalLibroMayor, "70%", "auto");
	crearPopup(IdModalAsignarCuenta, "30%", 270);
	crearPopup(idModalVerificacionCajaChica,  "auto",  "auto");
	setTimeout(function name(params) {
		crearPopup(idModalTablaDespachos, screen.width, screen.height);
		crearPopup(idModalTablaAsignacionDespacho, "auto", "auto");
		aplicarDatePickers();
		crearPopup(idModalNuevoPedido, screen.width, screen.height);
		aplicarDatePickerPedido();
		crearPopup(idModalDatosProducto, "36%", 370 );
		crearPopup(idModalNuevoClientePedido, "36%", 330);
		crearPopup(idModalNuevaRazonCliente, "36%", 275);
		crearPopup(idModalNuevoDestino, "36%", 275);
	}, 2000)

	crearPopup(IdModalEliminarProductoVencido, "60%", 550)
	$("#" + idModalInicioSesion).siblings('.ui-dialog-titlebar').remove();
	aplicarDatePickers();
	quitarScrollInputNumber()
	$(document).on('click', '#field-viewer', function (e) {
		e.stopPropagation();
	});
}

function aplicarDatePickerPedido() {
	$('.date-picker-pedido').datetimepicker({
		format: 'DD/MM/YYYY',//use this option to display seconds
		autoclose: true,
		pickTime: false
	}).on('changeDate', function (e) {
        $(this).datetimepicker('hide');
  	});
} 

function quitarScrollInputNumber() {
	$('.input-fix-mousewheel1').on('focus', function (e) {
		$(this).on('mousewheel.disableScroll', function (e) {
			e.preventDefault();
		})
	}).on('blur', function (e) {
		$(this).off('mousewheel.disableScroll')
	});
}
function ejecutarScriptsComprobante(IdModalVerificarCuenta, IdModalEliminarComprobante, IdModalCambioMoneda) {
	/* crearPopup(idModalWizardComprobanteNuevo, "100%", 800); */
	crearPopup(IdModalVerificarCuenta, "20%", 'auto');
	crearPopup(IdModalEliminarComprobante, "20%", 'auto');
	crearPopup(IdModalCambioMoneda, "40%", 'auto');
	/*crearPopup(IdModalRevisarComprobante, "80%", 500);
	crearPopup(IdModalLibroMayor, "80%", 500); */

}

function ejecutarScriptsCotizacion(idModalWizardCotizacionEdicion, idModalInventario, idModalDialogRechazo) {
	crearPopup(idModalWizardCotizacionEdicion, "100%", 1800);
	crearPopup(idModalDialogRechazo, "40%", 'auto');
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
	idModalDialogVerResultadosHistorialLab, idModalDialogConfirmacionEntregaAdelantado, idModalConceptoEdicion) {
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
		crearPopup(idModalConceptoEdicion, "62%", "auto");
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

function ejecutarScriptsRecursosHumanos(idModalPrerequisitos, idModalEmpleado, idModalwizardContainerEmpleado,
	idModalDepartamentoEstado, idModalProvincia, idModalLocalidad,
	idImput,
	idModalHojaVida, idModalwizardContainerHojaVida, idModalNuevoFamiliar,
	idModalHistorialContrato, idModalBeneficiosSociales, idModalDetalleVacaciones,
	idModalBitacoraFicha, idModalAnticipoExtraordinario, idModalNuevoPrestamo, idModalAusenciasVacaciones, idTabAusenciasVacaciones,
	idModalTipoBaja, idModalFeriados, idModalHitorialVacaciones, idModalCompensacion, idModalHistorialAusencias,
	idModalHistorialAusenciaMedica, idModalTipoAusencia, idModalRolTurnos, idModalHistorialTurnos, idModalHorasExtras,
	idModalHistorialHorasExtras, idModalAnticipoRegular, idModalPrestamosPersonal, idModalAdvertencia, idModalPretamosNuevoTodos,
	idModalReporteHijos, idModalReporteVeneficios, idModalPagoPrestamo, idModalReporteVacaciones, idModalReporteBajasMedicas,
	idModalReporteRolTurnos, idModalReporteTurnosDetallado, idModalViajes, idModalVisita, idModalVehiculosViaje,
	idModalHistorialViajes, idModalReporteAusencias, idModalCertificado, idModalRhNuevo, idModalWizardRhNuevo,
	idImagenUsuario, idEliminarUsuarioRh, idModalWizardRhVista, idModalContenedorRhVista, idModalDialogPrerequisitoNuevo, idEliminarSeguroEmpleado,
	idEliminarFamiliarEmpleado, idModalHistorialPrerequisito, idModalEditarPrerequisito, idModalDialogConfirmacionEntregaAdelantado, IdEntregaPrerequisito, IdModalVerificarCuenta, idModalImpresionHojaVida, idModalNuevoAnticipoRegularTodos,
	idModalTr3BancoMsc, idModalTr3BancoUnion, idModalHistorialTr3, IdModalVerificarCuentaRrhh, idModalConfirmarDesabilitacion, idModalReingresoEmpleado,
	idModalHistorialBeneficios, idModalConfiguracionRopaDeTrabajo, idModalReporteRopaDeTrabajo, idmodalWizardContainerConfiguracionRopaTrabajo, idModalRopaTrabajo, idModalNuevaRopaTrabajo, idModalItemsNuevaRopaTrabajo, idModalEliminarRopaTrabajo, idModalConceptoEdicion, idModalVisitaSalida, idModalDesabilitarPasajero,
	idModalCerrarRolDeTurno, idModalConductoresViaje,idModalHistorialGestionesVacaciones,idModalTipoImportacionRol) {
	crearPopup(idModalPrerequisitos, "auto", "auto");
	crearPopup(idModalEmpleado, "auto", "auto");
	aplicarWizardFormulario(idModalEmpleado, idModalwizardContainerEmpleado);
	crearPopup(idModalDepartamentoEstado, "auto", "auto");
	crearPopup(idModalProvincia, "auto","auto");
	crearPopup(idModalLocalidad, "auto","auto");
	crearPopup(idModalHojaVida, "auto", "auto");
	aplicarWizardFormulario(idModalHojaVida, idModalwizardContainerHojaVida);
	crearPopup(idModalHistorialContrato, "auto", "auto");
	crearPopup(idModalBeneficiosSociales, "auto", "auto");
	crearPopup(idModalBitacoraFicha, "auto", "auto");
	crearPopup(idModalAnticipoExtraordinario, "auto","auto");
	crearPopup(idModalNuevoPrestamo, "auto", "auto");
	crearPopup(idModalRolTurnos, "auto", "auto");
	crearPopup(idModalHistorialTurnos, "auto", "auto");
	crearPopup(idModalHorasExtras, "auto", "auto");
	crearPopup(idModalHistorialHorasExtras, "auto", "auto");
	crearPopup(idModalAnticipoRegular, "auto", "auto");
	crearPopup(idModalPrestamosPersonal, "auto","auto");
	crearPopup(idModalAdvertencia, "auto", "auto");
	crearPopup(idModalPretamosNuevoTodos, "auto", "auto");
	crearPopup(idModalReporteHijos, "auto", "auto");
	crearPopup(idModalReporteVeneficios, "auto", "auto");
	crearPopup(idModalPagoPrestamo, "auto", "auto");
	crearPopup(idModalReporteVacaciones, "auto", "auto");
	crearPopup(idModalReporteBajasMedicas, "auto", "auto");
	crearPopup(idModalReporteRolTurnos, "auto", "auto");
	crearPopup(idModalReporteTurnosDetallado, screen.width,"auto");
	crearPopup(idModalViajes, "auto", "auto");
	crearPopup(idModalAusenciasVacaciones, "auto", "auto");
	aplicarTab(idTabAusenciasVacaciones);
	crearPopup(idModalTipoBaja, "auto", "auto");
	crearPopup(idModalFeriados, "auto", "auto");
	crearPopup(idModalHitorialVacaciones, "auto", "auto");
	crearPopup(idModalDetalleVacaciones, "auto", "auto");
	crearPopup(idModalCompensacion, "auto", "auto");
	crearPopup(idModalHistorialAusencias, "auto", "auto");
	crearPopup(idModalHistorialAusenciaMedica, "auto", "auto");
	crearPopup(idModalTipoAusencia, "auto", "auto");
	crearPopup(idModalVisita, "auto", "auto");
	crearPopup(idModalVehiculosViaje, "auto", "auto");
	crearPopup(idModalHistorialViajes, "auto", "auto");
	crearPopup(idModalReporteAusencias, "auto", "auto");
	crearPopup(idModalCertificado, "auto", "auto");
	crearPopup(idModalRhNuevo, "auto", "auto");
	crearPopup(idEliminarUsuarioRh, "auto", "auto");
	aplicarWizardFormulario(idModalRhNuevo, idModalWizardRhNuevo)
	crearPopup(idModalWizardRhVista, "auto", "auto");
	crearPopup(idEliminarSeguroEmpleado, "auto", "auto");
	crearPopup(idEliminarFamiliarEmpleado, "auto", "auto");
	aplicarWizardFormulario(idModalWizardRhVista, idModalContenedorRhVista);
	crearPopup(idModalDialogPrerequisitoNuevo, "auto", "auto");
	crearPopup(idModalNuevoFamiliar, "auto", "auto");
	crearPopup(idModalHistorialPrerequisito, "auto", "auto");
	crearPopup(idModalEditarPrerequisito, "auto", "auto");
	crearPopup(idModalDialogConfirmacionEntregaAdelantado, "auto", "auto");
	crearPopup(IdEntregaPrerequisito, "auto", "auto");
	crearPopup(idModalImpresionHojaVida, "auto", "auto");
	crearPopup(idModalNuevoAnticipoRegularTodos, "auto", "auto")
	crearPopup(idModalTr3BancoMsc, "auto", "auto");
	crearPopup(idModalTr3BancoUnion, "auto", "auto");
	crearPopup(idModalHistorialTr3, "auto", "auto");
	crearPopup(IdModalVerificarCuentaRrhh, "auto", "auto");
	crearPopup(idModalConfirmarDesabilitacion, "auto", "auto");
	crearPopup(idModalReingresoEmpleado, "auto", "auto");
	crearPopup(idModalHistorialBeneficios, "auto", "auto");
	crearPopup(idModalConfiguracionRopaDeTrabajo, "auto", "auto");
	aplicarWizardFormulario(idModalConfiguracionRopaDeTrabajo, idmodalWizardContainerConfiguracionRopaTrabajo);
	crearPopup(idModalReporteRopaDeTrabajo, "auto", "auto");
	crearPopup(idModalRopaTrabajo, "auto", "auto");
	crearPopup(idModalNuevaRopaTrabajo, "auto", "auto");
	crearPopup(idModalItemsNuevaRopaTrabajo, "auto", "auto");
	crearPopup(IdModalVerificarCuenta, "auto", "auto");
	crearPopup(idModalEliminarRopaTrabajo, "auto", "auto");
	crearPopup(idModalVisitaSalida, "auto", "auto");
	crearPopup(idModalDesabilitarPasajero, "auto", "auto");
	crearPopup(idModalCerrarRolDeTurno, "auto", "auto");
	crearPopup(idModalConductoresViaje, "auto", "auto");
	crearPopup(idModalHistorialGestionesVacaciones, "auto", "auto");
	crearPopup(idModalTipoImportacionRol, "auto", "auto");
	setTimeout(function () {
		aplicarDatePickers();
		// aplicarHoras();
		aplicarTiempos();
		AplicarImputFile(idImput);
		aplicarVisorImagenArchivo(idImagenUsuario);

	}, 2000)
	setTimeout(function () {
		crearPopup(idModalConceptoEdicion, "auto", "auto");
	}, 5000)
}

function ejecutarScriptsPlanillaSueldos(idModalNuevaPlanillaSueldos, idModalEditarPlanillaSueldo, idModalParametros, idModalTR3,
	idModalHistorialTR3, idEliminarSueldoEmpleado) {
	crearPopup(idModalNuevaPlanillaSueldos, "100%", 700);
	crearPopup(idModalEditarPlanillaSueldo, "50%", "auto");
	crearPopup(idModalParametros, "90%", "auto");
	crearPopup(idModalTR3, "75%", "auto");
	crearPopup(idModalHistorialTR3, "70%", "auto");
	crearPopup(idEliminarSueldoEmpleado, "30%", "auto");
}

function ejecutarScriptsIncrementoSalarial(idModalNuevoIncrementoSalarial) {
	crearPopup(idModalNuevoIncrementoSalarial, "100%", "auto");
}

function ejecutarScriptsPlanillaRCIVA(idModalNuevoPlanillaRCIVA, idModalFormulario110, idModalFormularioGeneral110,
	idModalArchivosTXT, idModalEditarPlanillaRCIVA) {
	crearPopup(idModalNuevoPlanillaRCIVA, "100%", 700);
	crearPopup(idModalFormulario110, "40%", "auto");
	crearPopup(idModalFormularioGeneral110, "70%", "auto");
	crearPopup(idModalArchivosTXT, "60%", "auto");
	crearPopup(idModalEditarPlanillaRCIVA, "100%", 700);
}
function ejecutarScriptsPlanillaRetroActivos(idModalNuevoPlanillaRetroactivo) {
	crearPopup(idModalNuevoPlanillaRetroactivo, "100%", "auto");
}

function ejecutarScriptsFarmacia(idModalWizardFarmaciaEdicion, idModalInventario, idPopupVista, idPopupPago) {
	crearPopup(idModalWizardFarmaciaEdicion, "100%", 600);
	crearPopup(idModalInventario, "85%", 550);
	crearPopup(idPopupVista, "100%", 600);
	crearPopup(idPopupPago, "30%", 200);
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
	crearPopup(idModalWizardCuentaEdicion, "60%", "auto");
	crearPopup(idModalWizardClasificacionCuentaNueva, "50%", 300);
	crearPopup(idModalWizardClasificacionVer, "60%", 550);
	crearPopup(idModalPlantilla, "auto", "auto");
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
	idModalVendedor, idModalImpresionVencimiento,IdModalVerificarCuenta,modalReportesProductos,modalServicioVenta,
	modelGraficaProductos,modalReportesEmpresas,modelGraficaEmpresas,modelImportacionVentaServicio, idModalCotizaciones, idModalDetalleCotizaciones, idModalDetalleCotizacionEditar) {
	crearPopup(idPopupEdicion, "100%",  screen.height);
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
	crearPopup(idModalImpresionVencimiento, "30%", 150);
	crearPopup(idModalVendedor, "50%", 250);
	crearPopup(IdModalVerificarCuenta, "auto", "auto");
	crearPopup(modalReportesProductos, "auto","auto");
	crearPopup(modelGraficaProductos,"50%",500);
	crearPopup(modalServicioVenta, "auto","auto");
	crearPopup(modalReportesEmpresas,"50%","auto");
	crearPopup(modelGraficaEmpresas,"50%","auto");
	crearPopup(modelImportacionVentaServicio, "30%","auto");
	crearPopup(idModalCotizaciones, "85%", 550);
	crearPopup(idModalDetalleCotizaciones, "79%", 480);
	crearPopup(idModalDetalleCotizacionEditar, "30%", 270);
	$(document).on('click', '#campos-detalle-venta', function (e) {
		e.stopPropagation();
	});
}

function ejecutarScriptsCompra(idPopupEdicion, idPopupVista, idPopupEliminacion,
	idContenedorEdicion, idContenedorVista, idInput, url, idPopupPago,idModalServicios,idModalPedidos,idModalDetallePedidos,idModalEliminarPedido,idModalEliminarProductoPedido) {
	crearPopup(idPopupEdicion, "100%", 600);
	crearPopup(idPopupVista, "100%", 600);
	crearPopup(idPopupPago, "30%", 200);
	crearPopup(idModalServicios,'auto','auto')
	crearPopup(idModalPedidos,'auto','auto')
	crearPopup(idModalDetallePedidos, "100%", 600);
	crearPopup(idModalEliminarPedido, "30%", 200);
	crearPopup(idModalEliminarProductoPedido, "30%", 200);
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
	crearPopup(idPopupEdicion, "auto", "auto");
	crearPopup(idPopupVista, "auto", "auto");
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	crearPopup(idPopupEliminacion, "auto", "auto");
	aplicarDatePickers();
}

function ejecutarScriptsSucursal(idPopupEdicion, idPopupVista, idPopupEliminacion, idContenedorEdicion, idContenedorVista, idPopupCorrelativoEdicion) {
	crearPopup(idPopupEdicion, "auto", "auto");
	crearPopup(idPopupVista, "auto", "auto");
	crearPopup(idPopupCorrelativoEdicion, "auto", "auto");
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	crearPopup(idPopupEliminacion, "auto", "auto");
}

function ejecutarScriptsConcepto(idPopupEdicion, idContenedorEdicion) {
	crearPopup(idPopupEdicion, "auto", "auto");
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
}

function ejecutarScriptsProducto(idPopupEdicion, idPopupVista, idPopupKadex, idPopupEliminacion, idContenedorEdicion, idContenedorVista, idContenedorKardex, idImagen, idModalReporteProductosKardex) {
	crearPopup(idPopupEdicion, "60%", 610);
	crearPopup(idPopupVista, "60%", 610);
	crearPopup(idPopupKadex, "90%", 610);
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarWizardFormulario(idPopupKadex, idContenedorKardex);
	aplicarVisorImagenArchivo(idImagen);
	crearPopup(idPopupEliminacion, "30%", 170);
	crearPopup(idModalReporteProductosKardex, "auto", "auto")
	setTimeout(function () {
		aplicarDatePickers();
	}, 200);
}

function ejecutarScriptsProveedor(idPopupEdicion, idPopupVista, idPopupEliminacion, idContenedorEdicion, idContenedorVista) {
	crearPopup(idPopupEdicion, "auto", "auto");
	crearPopup(idPopupVista,"auto", "auto");
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarDatePickers();
	crearPopup(idPopupEliminacion, "auto", "auto");
}

function ejecutarScriptsCliente(idPopupEdicion, idPopupVista, idPopupEliminacion, idContenedorEdicion, idContenedorVista, idModalConceptoEdicionCorrelativos
	, IdModalVerificarCuenta) {
	crearPopup(idPopupEdicion,"auto", "auto");
	crearPopup(idPopupVista, "auto", "auto");
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarDatePickers();
	crearPopup(idPopupEliminacion, "auto", "auto");
	
	setTimeout(function name(params) {
		crearPopup(idModalConceptoEdicionCorrelativos, "auto", "auto");
		crearPopup(IdModalVerificarCuenta, "auto", "auto");
	}, 3000)

}

function ejecutarScriptsUsuario(idPopupEdicion, idImagen, idContenedorEdicion, idPopupVista, idContenedorVista,
	idPopupEliminacion, idPopupRutas, idContenedorRutas, idPopupComisiones, idContenedorComisiones) {		
	crearPopup(idPopupEdicion, "auto", "auto");
	crearPopup(idPopupVista, "auto", "auto");
	crearPopup(idPopupRutas, "auto", "auto");
	crearPopup(idPopupComisiones, "auto", "auto");
	aplicarWizardFormulario(idPopupEdicion, idContenedorEdicion);
	aplicarWizardFormulario(idPopupVista, idContenedorVista);
	aplicarWizardFormulario(idPopupRutas, idContenedorRutas);
	aplicarWizardFormulario(idPopupComisiones, idContenedorComisiones);
	crearPopup(idPopupEliminacion, "auto", "auto");
	aplicarVisorImagenArchivo(idImagen);
}

function ejecutarScriptsEmpresa(idPopupEdicion, idImagen, idContenedorEdicion, idPopupVista, idContenedorVista, idPopupEliminacion) {
	crearPopup(idPopupEdicion, "60%", "auto");
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

function ejecutarScriptsActivos(idModalconfiguracionActivos, idModalRevaluarActivo){
	crearPopup(idModalconfiguracionActivos, 'auto', 'auto');
	crearPopup(idModalRevaluarActivo, 'auto', 'auto');
}
function ejecutarScriptGeoLocalizacion(ModalVendedorMapa,ModalFiltroMapa){
	crearPopup(ModalVendedorMapa, "80%", 600);
	crearPopup(ModalFiltroMapa, "auto", "auto");
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
	console.log(idContenedor + ' ace wizard')
	$('#' + idPopup + ' .wizard-actions .btn[data-dismiss=modal]').removeAttr('disabled');
	console.log(idPopup)
	$(document).one('ajaxloadstart.page', function (e) {
		//in ajax mode, remove remaining elements before leaving page
		$('[class*=select2]').remove();
	});
}

var numDialog = 0;
function crearPopup(idPopup, ancho, altura,positionX,positionY) {
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
if(positionX){
	var dialog = $("#" + idPopup).dialog({
		modal: true,
		width: ancho,
		height: altura,
		autoOpen: false,
		resizable: true,
		position: [positionX,positionY],
	});
}else{
	var dialog = $("#" + idPopup).dialog({
		modal: true,
		width: ancho,
		height: altura,
		autoOpen: false,
		resizable: true,
		
	});
}
	


	$("#" + idPopup).siblings('.ui-dialog-titlebar').remove();
	/* $("#" + idPopup).dialog("moveToTop"); */
	// $("#" + idPopup).draggable({
	// 	handle: ".modal-header"
	// });
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
function number_format(amount, decimals) {

	amount += ''; // por si pasan un numero en vez de un string
	amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

	decimals = decimals || 0; // por si la variable no fue fue pasada

	// si no es un numero o es igual a cero retorno el mismo cero
	if (isNaN(amount) || amount === 0)
		return parseFloat(0).toFixed(decimals);

	// si es mayor o menor que cero retorno el valor formateado como numero
	amount = '' + amount.toFixed(decimals);

	var amount_parts = amount.split('.'),
		regexp = /(\d+)(\d{3})/;

	while (regexp.test(amount_parts[0]))
		amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

	return amount_parts.join('.');
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

		// slidesPerView: slidesPerView,
		// slidesPerColumn: slidesPerColumn,
		// paginationClickable: paginationClickable,
		// spaceBetween: spaceBetween
		slidesPerColumn: slidesPerColumn,
		paginationClickable: paginationClickable,
		slidesPerView: 'auto',
		spaceBetween: 30,
	});
}
function editar_fecha(fecha, intervalo, dma, simbolo) {

	var simbolo = simbolo || "-";
	var arrayFecha = fecha.split(simbolo);
	var dia = arrayFecha[0];
	var mes = arrayFecha[1];
	var anio = arrayFecha[2];

	var fechaInicial = new Date(anio, mes - 1, dia);
	var fechaFinal = fechaInicial;
	if (dma == "m" || dma == "M") {
		fechaFinal.setMonth(fechaInicial.getMonth() + parseInt(intervalo));
	} else if (dma == "y" || dma == "Y") {
		fechaFinal.setFullYear(fechaInicial.getFullYear() + parseInt(intervalo));
	} else if (dma == "d" || dma == "D") {
		fechaFinal.setDate(fechaInicial.getDate() + parseInt(intervalo));
	} else {
		return fecha;
	}
	dia = fechaFinal.getDate();
	mes = fechaFinal.getMonth() + 1;
	anio = fechaFinal.getFullYear();

	dia = (dia.toString().length == 1) ? "0" + dia.toString() : dia;
	mes = (mes.toString().length == 1) ? "0" + mes.toString() : mes;

	return dia + simbolo + mes + simbolo + anio;
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

function parseDate(input) {
	var parts = input.split('-');
	return new Date(parts[2], parts[1] - 1, parts[0]);
}


function getDates(startDate, endDate) {
	var mes2 = (startDate.getMonth() + 1)
	var dia2 = startDate.getDate()
	mes2 = (mes2 < 10) ? "0" + mes2 : mes2
	dia2 = (dia2 < 10) ? "0" + dia2 : dia2
	var mes3 = (endDate.getMonth() + 1)
	var dia3 = endDate.getDate()
	mes3 = (mes3 < 10) ? "0" + mes3 : mes3
	dia3 = (dia3 < 10) ? "0" + dia3 : dia3
	startDate = startDate.getFullYear() + "/" + mes2 + "/" + dia2
	endDate = endDate.getFullYear() + "/" + mes3 + "/" + dia3
	var listDate = [];
	var dateMove = new Date(startDate);
	var strDate = startDate;
	while (strDate <= endDate) {
		//var strDate = dateMove.toISOString().slice(0, 10);
		listDate.push(strDate);
		dateMove.setDate(dateMove.getDate() + 1);
		var mes = (dateMove.getMonth() + 1)
		var dia = (dateMove.getDate())
		mes = (mes < 10) ? "0" + mes : mes
		dia = (dia < 10) ? "0" + dia : dia
		strDate = dateMove.getFullYear() + "/" + mes + "/" + dia
	};
	return listDate;
};
function convertirSegundosATiempo(time) {
	var hours = Math.floor(time / 3600);
	var minutes = Math.floor((time % 3600) / 60);
	var seconds = time % 60;

	//Anteponiendo un 0 a los minutos si son menos de 10 
	minutes = minutes < 10 ? '0' + minutes : minutes;

	//Anteponiendo un 0 a los segundos si son menos de 10 
	seconds = seconds < 10 ? '0' + seconds : seconds;

	var result = hours + ":" + minutes + ":" + seconds;
	console.log(result)
	return result;
}
function ValidarForm(form, steps, button) {
	/* if (!form.$valid) { */
	steps.forEach(function (dato, index, array) {


		var step = $('#' + dato.cabeza).attr('class');
		/* console.log(step) */
		var fail = false
		if (step == "active") {
			$('#' + dato.cuerpo).find('select').each(function () {
				if ($(this).prop('required')) {
					if (this.value.length > 0) {
						$(this).removeClass("validacionRRhh");
						if (this.value == "?") {
							$(this).addClass("validacionRRhh");
							fail = true
						}
					} else {
						$(this).addClass("validacionRRhh");
						fail = true
					}

				}
			});
			$('#' + dato.cuerpo).find('input').each(function () {
				if ($(this).prop('required')) {

					if (this.value.length > 0) {

						$(this).removeClass("validacionRRhh");

					} else {
						$(this).addClass("validacionRRhh");
						fail = true
					}
				}
			});
			$('#' + dato.cuerpo).find('#cargos').each(function () {


				if (this.innerText != "No se ha seleccionado nada") {

					$(this).removeClass("validacionRRhh");

				} else {
					$(this).addClass("validacionRRhh");
					fail = true
				}

			});
			/*  stepDatosLaborales
			 stepdatosAfiliacion
			 stepDatosFamiliares */


			if (fail) {
				setTimeout(function () {
					$('#' + button).click()
				}, 300);

			}

		}

	});
	// cancel change



}
function duration(since, until) {

	//if first date is greater that the first, we fix the order
	/* if (since > until) {
		var temp = since;
		since = until;
		until = temp;
	}
 */
	var years, months, days;

	//Years
	years = (until.getFullYear() - since.getFullYear());
	if (until.getMonth() == since.getMonth()) {
		if (since.getDate() > (until.getDate() - 1)) {
			years += 1;
		}
		if (since.getDate() == until.getDate()) {
			years += 1;
		}
	}
	if (since.getMonth() > until.getMonth()) {
		years = (years - 1);
	}
	//Months
	if (since.getDate() > until.getDate()) {
		if (since.getMonth() > (until.getMonth() - 1)) {
			months = 11 - (since.getMonth() - until.getMonth());
			if (since.getMonth() == until.getMonth()) {
				months = 11;
			}
		} else {
			months = until.getMonth() - since.getMonth() - 1;
		}
	} else {
		if (since.getMonth() > until.getMonth()) {
			months = 12 - (Math.abs(until.getMonth() - since.getMonth()));
		} else {
			months = until.getMonth() - since.getMonth();
		}
	}
	//Days
	if (since.getDate() > (until.getDate() - 1)) {
		var days_pm = dayssInmonths(until.getMonth(until.getMonth() - 1));
		days = days_pm - since.getDate() + until.getDate();
		if ((since.getMonth() == until.getMonth()) & (since.getDate() == until.getDate())) {
			days = 0;
		}
	} else {
		days = until.getDate() - since.getDate();
	}

	return ({ "anios": years, "meses": months, "dias": days });
}

function dayssInmonths(date) {
	date = new Date(date);
	return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
}

function dec2gms(valor, tipo)
{
	grados    = Math.abs(parseInt(valor));
	minutos   = (Math.abs(valor) - grados) * 60;
	segundos  = minutos;
	minutos   = Math.abs(parseInt(minutos));
	segundos  = Math.round((segundos - minutos) * 60 * 1000000) / 1000000;
	signo     = (valor < 0) ? -1 : 1; 	direccion = (tipo == "LATITUD") ?
                    ((signo > 0) ? 'N' : 'S') :
	            ((signo > 0) ? 'E' : 'W');

	if(isNaN(direccion))
		grados = grados * signo;

	return {
		'grados'   : grados,
		'minutos'  : minutos,
		'segundos' : segundos,
		'direccion': direccion,
		'valor'    : grados + "° " + minutos + "' "+ segundos +"'" + ((isNaN(direccion)) ? (' ' + direccion) : '')
	};
}