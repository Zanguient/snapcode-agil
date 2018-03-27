module.exports = function (router, sequelize, Sequelize, jwt, md5, forEach, ensureAuthorized, ensureAuthorizedAdministrador, PDF, fs,
	excelbuilder, decodeBase64Image, signs3, io, socket, schedule) {

	//*****ENTITIES*****
	//entities GRAL
	var Persona = require('../modelos/GRAL/persona')(sequelize, Sequelize);
	var Tipo = require('../modelos/GRAL/tipo')(sequelize, Sequelize);
	var Clase = require('../modelos/GRAL/clase')(sequelize, Sequelize);
	//entities SYS
	var Usuario = require('../modelos/SYS/usuario')(sequelize, Sequelize);
	var Rol = require('../modelos/SYS/rol')(sequelize, Sequelize);
	var UsuarioRol = require('../modelos/SYS/usuario-rol')(sequelize, Sequelize);
	var Aplicacion = require('../modelos/SYS/aplicacion')(sequelize, Sequelize);
	var RolAplicacion = require('../modelos/SYS/rol-aplicacion')(sequelize, Sequelize);
	var UsuarioAplicacion = require('../modelos/SYS/usuario-aplicacion')(sequelize, Sequelize);
	var VistaColumnasAplicacion = require('../modelos/SYS/vista-columnas-aplicacion')(sequelize, Sequelize);
	var CodigoControl = require('../codigo-control')();
	var NumeroLiteral = require('../numero-literal')();
	var Diccionario = require('../diccionario')();
	//entities AGIL
	var Empresa = require('../modelos/AGIL/empresa')(sequelize, Sequelize);
	var Sucursal = require('../modelos/AGIL/sucursal')(sequelize, Sequelize);
	var UsuarioSucursal = require('../modelos/AGIL/usuario-sucursal')(sequelize, Sequelize);
	var Cliente = require('../modelos/AGIL/cliente')(sequelize, Sequelize);
	var Proveedor = require('../modelos/AGIL/proveedor')(sequelize, Sequelize);
	var Producto = require('../modelos/AGIL/producto')(sequelize, Sequelize);
	var ProductoBase = require('../modelos/AGIL/producto-base')(sequelize, Sequelize);
	var Almacen = require('../modelos/AGIL/almacen')(sequelize, Sequelize);
	var Dosificacion = require('../modelos/AGIL/dosificacion')(sequelize, Sequelize);
	var SucursalActividadDosificacion = require('../modelos/AGIL/sucursal-actividad-dosificacion')(sequelize, Sequelize);
	var ConfiguracionFactura = require('../modelos/AGIL/configuracion-factura')(sequelize, Sequelize);
	var ConfiguracionGeneralFactura = require('../modelos/AGIL/configuracion-general-factura')(sequelize, Sequelize);
	var ConfiguracionVendedorApp = require('../modelos/AGIL/configuracion-vendedor-app')(sequelize, Sequelize);
	var ConfiguracionGeneralApp = require('../modelos/AGIL/configuracion-general-app')(sequelize, Sequelize);
	var Ruta = require('../modelos/AGIL/ruta')(sequelize, Sequelize);
	var RutaDia = require('../modelos/AGIL/ruta-dia')(sequelize, Sequelize);
	var RutaCliente = require('../modelos/AGIL/ruta-cliente')(sequelize, Sequelize);
	var UsuarioRuta = require('../modelos/AGIL/usuario-ruta')(sequelize, Sequelize);
	var ComisionVendedorProducto = require('../modelos/AGIL/comision-vendedor-producto')(sequelize, Sequelize);
	var ConfiguracionVentaVista = require('../modelos/AGIL/configuracion-venta-vista')(sequelize, Sequelize);
	var ConfiguracionCompraVista = require('../modelos/AGIL/configuracion-compra-vista')(sequelize, Sequelize);
	var Banco = require('../modelos/AGIL/banco')(sequelize, Sequelize);
	var CierreCaja = require('../modelos/AGIL/cierre-caja')(sequelize, Sequelize);
	var CajaSiguienteTurno = require('../modelos/AGIL/caja-siguiente-turno')(sequelize, Sequelize);
	var Garzon = require('../modelos/AGIL/garzon')(sequelize, Sequelize);
	var MedicoPaciente = require('../modelos/AGIL/medico-paciente')(sequelize, Sequelize);
	var MedicoPrerequisito = require('../modelos/AGIL/medico-prerequisito')(sequelize, Sequelize);
	var GarzonPedidoRestaurante = require('../modelos/AGIL/garzon-pedido-restaurante')(sequelize, Sequelize);
	var PedidoRestaurante = require('../modelos/AGIL/pedido-restaurante')(sequelize, Sequelize);
	var MesaPedidoRestaurante = require('../modelos/AGIL/mesa-pedido-restaurante')(sequelize, Sequelize);
	var DetallePedidoRestaurante = require('../modelos/AGIL/detalle-pedido-restaurante')(sequelize, Sequelize);
	var CuentaRestaurante = require('../modelos/AGIL/cuenta-restaurante')(sequelize, Sequelize);
	var Mesa = require('../modelos/AGIL/mesa')(sequelize, Sequelize);
	var Sala = require('../modelos/AGIL/sala')(sequelize, Sequelize);
	var ContabilidadCuenta = require('../modelos/AGIL/contabilidad-cuenta')(sequelize, Sequelize);
	var ClasificacionCuenta = require('../modelos/AGIL/contabilidad-clasificacion-cuenta')(sequelize, Sequelize);
	var ComprobanteContabilidad = require('../modelos/AGIL/comprobante-contabilidad')(sequelize, Sequelize);
	var AsientoContabilidad = require('../modelos/AGIL/asiento-contabilidad')(sequelize, Sequelize);
	var ClienteCuenta = require('../modelos/AGIL/cliente-cuenta')(sequelize, Sequelize);
	var ProveedorCuenta = require('../modelos/AGIL/proveedor-cuenta')(sequelize, Sequelize);
	var ConfiguracionCuenta = require('../modelos/AGIL/configuracion-cuenta')(sequelize, Sequelize);
	var MonedaTipoCambio = require('../modelos/AGIL/moneda-tipo-cambio')(sequelize, Sequelize);
	var MedicoPacienteVacunaDosis = require('../modelos/AGIL/medico-paciente-vacuna-dosis')(sequelize, Sequelize);
	var MedicoVacuna = require('../modelos/AGIL/medico-vacuna')(sequelize, Sequelize);
	var VacunaDosis = require('../modelos/AGIL/medico-vacuna-dosis')(sequelize, Sequelize);
	var MedicoPacienteVacuna = require('../modelos/AGIL/medico-paciente-vacuna')(sequelize, Sequelize);
	var MedicoPacienteConsulta = require('../modelos/AGIL/medico-paciente-consulta')(sequelize, Sequelize);
	var MedicoPacienteFicha = require('../modelos/AGIL/medico-paciente-ficha')(sequelize, Sequelize);
	var MedicoLaboratorioExamen = require('../modelos/AGIL/medico-laboratorio-examen')(sequelize, Sequelize);
	var MedicoLaboratorio = require('../modelos/AGIL/medico-laboratorio')(sequelize, Sequelize);
	var MedicoLaboratorioPaciente = require('../modelos/AGIL/medico-laboratorio-paciente')(sequelize, Sequelize);
	var MedicoLaboratorioResultado = require('../modelos/AGIL/medico-laboratorio-resultado')(sequelize, Sequelize);
	var MedicoDiagnostico = require('../modelos/AGIL/medico-diagnostico')(sequelize, Sequelize);
	var MedicoDiagnosticoExamen = require('../modelos/AGIL/medico-diagnostico-examen')(sequelize, Sequelize);
	var MedicoDiagnosticoPaciente = require('../modelos/AGIL/medico-diagnostico-paciente')(sequelize, Sequelize);
	var MedicoDiagnosticoResultado = require('../modelos/AGIL/medico-diagnostico-resultado')(sequelize, Sequelize);
	var MantenimientoOrdenTrabajo = require('../modelos/AGIL/mantenimiento-orden-trabajo')(sequelize, Sequelize);
	var MantenimientoOrdenTrabajoSistema = require('../modelos/AGIL/mantenimiento-orden-trabajo-sistema')(sequelize, Sequelize);
	var MantenimientoOrdenTrabajoManoObra = require('../modelos/AGIL/mantenimiento-orden-trabajo-mano-obra')(sequelize, Sequelize);
	var MantenimientoOrdenTrabajoServicioExterno = require('../modelos/AGIL/mantenimiento-orden-trabajo-servicio-externo')(sequelize, Sequelize);
	var MantenimientoOrdenTrabajoMaterial = require('../modelos/AGIL/mantenimiento-orden-trabajo-material')(sequelize, Sequelize);
	var RrhhEmpleadoFicha = require('../modelos/AGIL/rrhh-empleado-ficha')(sequelize, Sequelize);
	var RrhhEmpleadoFichaFamiliar = require('../modelos/AGIL/rrhh-empleado-ficha-familiares')(sequelize, Sequelize);
	var RrhhEmpleadoFichaOtrosSeguros = require('../modelos/AGIL/rrhh-empleado-ficha-otros-seguros')(sequelize, Sequelize);
	var MedicoPacientePreRequisito = require('../modelos/AGIL/medico-paciente-prerequisito')(sequelize, Sequelize);
	var RrhhEmpleadoDiscapacidad = require('../modelos/AGIL/rrhh-empleado-discapacidad')(sequelize, Sequelize);
	var RrhhEmpleadoCargo = require('../modelos/AGIL/rrhh-empleado-cargo')(sequelize, Sequelize);
	var ClienteRazon = require('../modelos/AGIL/cliente-razon')(sequelize, Sequelize);
	var GtmDestino = require('../modelos/AGIL/agil-gtm-destino')(sequelize, Sequelize);
	var GtmEstibaje = require('../modelos/AGIL/agil-gtm-estibaje')(sequelize, Sequelize);
	var GtmGrupoEstibaje = require('../modelos/AGIL/agil-gtm-grupo-estibaje')(sequelize, Sequelize);
	var GtmTransportista = require('../modelos/AGIL/agil-gtm-transportista')(sequelize, Sequelize);
	var GtmDespacho = require('../modelos/AGIL/agil-gtm-despacho')(sequelize, Sequelize);
	var GtmClienteDestino = require('../modelos/AGIL/agil-gtm-cliente-destino')(sequelize, Sequelize);
	var GtmDespachoDetalle = require('../modelos/AGIL/agil-gtm-despacho-detalle')(sequelize, Sequelize);
	var RrhhEmpleadoHojaVida = require('../modelos/AGIL/rrhh_empleado_hoja_vida')(sequelize, Sequelize);
	var RrhhEmpleadoFormacionAcademica = require('../modelos/AGIL/rrhh_empleado_formacion_academica')(sequelize, Sequelize);
	var RrhhEmpleadoExperienciaLaboral = require('../modelos/AGIL/rrhh_empleado_experiencia_laboral')(sequelize, Sequelize);
	var RrhhEmpleadoLogroInternoExterno = require('../modelos/AGIL/rrhh_empleado_logro_interno_externo')(sequelize, Sequelize);
	var RrhhEmpleadoCapacidadInternaExterna = require('../modelos/AGIL/rrhh_empleado_capacidad_interna_externa')(sequelize, Sequelize);
	var ContabilidadCuentaAuxiliar = require('../modelos/AGIL/contabilidad-cuenta-auxiliar')(sequelize, Sequelize);
	var RRHHParametros = require('../modelos/AGIL/rrhh-parametros')(sequelize, Sequelize);
	var ConfiguracionCalificacionEvaluacionPolifuncional = require('../modelos/AGIL/configuracion-calificacion-evaluacion')(sequelize, Sequelize);
	var ConfiguracionDesempenioEvaluacionPolifuncional = require('../modelos/AGIL/configuracion-desempenio-evaluacion')(sequelize, Sequelize);
	//entities INV
	var Inventario = require('../modelos/INV/inventario')(sequelize, Sequelize);
	var Movimiento = require('../modelos/INV/movimiento')(sequelize, Sequelize);
	var DetalleMovimiento = require('../modelos/INV/detalle-movimiento')(sequelize, Sequelize);
	var Compra = require('../modelos/INV/compra')(sequelize, Sequelize);
	var DetalleCompra = require('../modelos/INV/detalle-compra')(sequelize, Sequelize);
	var Venta = require('../modelos/INV/venta')(sequelize, Sequelize);
	var DetalleVenta = require('../modelos/INV/detalle-venta')(sequelize, Sequelize);
	var PagoVenta = require('../modelos/INV/pago-venta')(sequelize, Sequelize);
	var PagoCompra = require('../modelos/INV/pago-compra')(sequelize, Sequelize);
	var DetalleVentaNoConsolidada = require('../modelos/INV/detalle-venta-no-consolidada')(sequelize, Sequelize);
	var VentaReprogramacionPago = require('../modelos/INV/venta-reprogramacion-pago')(sequelize, Sequelize);
	var CompraReprogramacionPago = require('../modelos/INV/compra-reprogramacion-pago')(sequelize, Sequelize);
	var Cotizacion = require('../modelos/INV/cotizacion')(sequelize, Sequelize);
	var DetalleCotizacion = require('../modelos/INV/detalle-cotizacion')(sequelize, Sequelize);
	var VendedorVenta = require('../modelos/INV/vendedor-venta')(sequelize, Sequelize);
	var DetalleSolicitudProducto = require('../modelos/INV/detalle-solicitud-producto')(sequelize, Sequelize);
	var DetalleSolicitudProductoBase = require('../modelos/INV/detalle-solicitud-producto-base')(sequelize, Sequelize);
	var SolicitudReposicion = require('../modelos/INV/solicitud-reposicion')(sequelize, Sequelize);
	var Proforma = require('../modelos/AGIL/proforma')(sequelize, Sequelize);
	var DetallesProformas = require('../modelos/AGIL/detalles-proformas')(sequelize, Sequelize);
	var Servicios = require('../modelos/AGIL/servicios')(sequelize, Sequelize);
	var EvaluacionPolifuncional = require('../modelos/AGIL/evaluacion-polifuncional')(sequelize, Sequelize);
	var Farmacia = require('../modelos/INV/farmacia')(sequelize, Sequelize);


	var RrhhEmpleadoPrestamo = require('../modelos/AGIL/rrhh-empleado-prestamo')(sequelize, Sequelize);
	var RrhhEmpleadoRolTurno = require('../modelos/AGIL/rrhh-empleado-rol-turno')(sequelize, Sequelize);
	var RrhhEmpleadoPrestamoPago = require('../modelos/AGIL/rrhh-empleado-prestamo-pago')(sequelize, Sequelize);
	var RrhhEmpleadoHorasExtra = require('../modelos/AGIL/rrhh-empleado-horas-extra')(sequelize, Sequelize);
	var RRHHPlanillaSueldos = require('../modelos/AGIL/rrhh-planilla-sueldos')(sequelize, Sequelize);
	var RRHHDetallePlanillaSueldos = require('../modelos/AGIL/rrhh-detalle-planilla-sueldos')(sequelize, Sequelize);
	var RrhhAnticipo = require('../modelos/AGIL/rrhh-empleado-anticipo')(sequelize, Sequelize);
	var RrhhEmpleadoAusencia = require('../modelos/AGIL/rrhh-empleado-ausencia')(sequelize, Sequelize);
	var RrhhEmpleadoVacaciones = require('../modelos/AGIL/rrhh-empleado-vacaciones')(sequelize, Sequelize);
	var RrhhEmpleadoCompensacionAusencia = require('../modelos/AGIL/rrhh-empleado-compensacion-ausencias')(sequelize, Sequelize);
	var RrhhFeriado = require('../modelos/AGIL/rrhh-feriados')(sequelize, Sequelize);
	var RrhhClaseAsuencia = require('../modelos/AGIL/rrhh-empleado-clase-ausencia')(sequelize, Sequelize);
	var RrhhEmpleadoConfiguracionVacacion = require('../modelos/AGIL/rrhh-empleado-configuracion_vacaciones')(sequelize, Sequelize);
	var RrhhEmpleadoHistorialVacacion = require('../modelos/AGIL/rrhh-empleado-historial_vacacion')(sequelize, Sequelize);
	var RrhhEmpleadoAnticipoTr3 = require('../modelos/AGIL/rrhh-empleado-anticipo-tr3')(sequelize, Sequelize);
	var RrhhEmpleadoTr3 = require('../modelos/AGIL/rrhh-empleado-tr3')(sequelize, Sequelize);
	var RrhhEmpleadoDeduccionIngreso= require('../modelos/AGIL/rrhh-empleado-deduccion-ingreso')(sequelize, Sequelize);
	var RrhhEmpleadoBeneficioSocial= require('../modelos/AGIL/rrhh-empleado-beneficio-social')(sequelize, Sequelize);
	var RrhhEmpleadoBitacoraFicha= require('../modelos/AGIL/rrhh-empleado-bitacora-ficha')(sequelize, Sequelize);
	var UsuarioGrupos = require('../modelos/SYS/usuario-grupos')(sequelize, Sequelize);
	//*****RELATIONS*****
	require('../modelos/relaciones.js')(sequelize, Usuario, Persona, Rol, UsuarioRol, Tipo, Clase, Aplicacion, RolAplicacion,
		Empresa, Sucursal, UsuarioSucursal, Cliente, Proveedor, Producto, UsuarioAplicacion,
		Almacen, Dosificacion, SucursalActividadDosificacion, Inventario, Movimiento,
		Compra, DetalleMovimiento, DetalleCompra, Venta, DetalleVenta, ConfiguracionFactura,
		ConfiguracionGeneralFactura, PagoVenta, ConfiguracionVendedorApp, ConfiguracionGeneralApp,
		Ruta, RutaDia, RutaCliente, UsuarioRuta, ComisionVendedorProducto, DetalleVentaNoConsolidada,
		ProductoBase, ConfiguracionVentaVista, ConfiguracionCompraVista, CierreCaja, Banco, PagoCompra,
		CajaSiguienteTurno, VentaReprogramacionPago, CompraReprogramacionPago,
		MedicoPaciente, Garzon, GarzonPedidoRestaurante, PedidoRestaurante, MesaPedidoRestaurante,
		DetallePedidoRestaurante, CuentaRestaurante, Mesa, Sala, Cotizacion, DetalleCotizacion, ContabilidadCuenta, ClasificacionCuenta, ComprobanteContabilidad, AsientoContabilidad,
		ClienteCuenta, ProveedorCuenta, MedicoPrerequisito, ConfiguracionCuenta, MedicoVacuna, VacunaDosis, MedicoPacienteVacuna, MedicoPacienteVacunaDosis, VistaColumnasAplicacion, MedicoPacienteConsulta,
		MedicoPacienteFicha, MedicoLaboratorioExamen, MedicoLaboratorio, MedicoLaboratorioPaciente, MedicoLaboratorioResultado, MedicoDiagnostico, MedicoDiagnosticoExamen, MedicoDiagnosticoPaciente, MedicoDiagnosticoResultado,
		MantenimientoOrdenTrabajo, MantenimientoOrdenTrabajoManoObra, MantenimientoOrdenTrabajoMaterial, MantenimientoOrdenTrabajoServicioExterno, MantenimientoOrdenTrabajoSistema, VendedorVenta, RrhhEmpleadoFicha,
		RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, MedicoPacientePreRequisito, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ClienteRazon, GtmDestino, GtmEstibaje, GtmGrupoEstibaje, GtmTransportista, GtmDespacho, GtmClienteDestino,
		RrhhEmpleadoHojaVida, RrhhEmpleadoFormacionAcademica, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna, SolicitudReposicion, DetalleSolicitudProducto, DetalleSolicitudProductoBase, MonedaTipoCambio, ContabilidadCuentaAuxiliar, GtmDespachoDetalle, RrhhEmpleadoPrestamo, RrhhEmpleadoPrestamoPago, Proforma, DetallesProformas, Servicios, Farmacia, RRHHParametros, RrhhEmpleadoRolTurno, RrhhEmpleadoHorasExtra, RRHHPlanillaSueldos, RRHHDetallePlanillaSueldos, RrhhAnticipo, EvaluacionPolifuncional,
		RrhhEmpleadoAusencia, RrhhEmpleadoVacaciones, RrhhEmpleadoCompensacionAusencia, RrhhClaseAsuencia,RrhhEmpleadoHistorialVacacion,RrhhEmpleadoTr3,RrhhEmpleadoAnticipoTr3,RrhhEmpleadoDeduccionIngreso,
		RrhhEmpleadoBeneficioSocial,RrhhEmpleadoBitacoraFicha, UsuarioGrupos);

	require('../sockets/pantallas.js')(io, socket);
	//*****ROUTES*****
	//SYS
	require('./rutas-usuarios')(router, ensureAuthorizedAdministrador, fs, decodeBase64Image, forEach, jwt, md5, Usuario, Persona, UsuarioRol, Rol, Tipo, Clase,
		Aplicacion, RolAplicacion, Empresa, UsuarioSucursal, Sucursal, UsuarioAplicacion, Almacen,
		SucursalActividadDosificacion, Dosificacion, UsuarioRuta, Ruta, VistaColumnasAplicacion, Diccionario, ComprobanteContabilidad, UsuarioGrupos);
	require('./rutas-roles')(router, Rol, RolAplicacion, Aplicacion);
	require('./rutas-tipos')(router, Tipo, Clase, Venta, DetalleVenta, Cliente, Almacen, Sucursal, Compra, DetalleCompra, Proveedor,
		Producto, Usuario, Movimiento, VentaReprogramacionPago, CompraReprogramacionPago, RrhhClaseAsuencia);
	require('./rutas-personas')(router, Persona, VendedorVenta, Venta);

	//AGIL
	require('./rutas-empresas')(router, decodeBase64Image, fs, Empresa, Sucursal, Clase, Tipo, signs3, ConfiguracionVentaVista, ConfiguracionCompraVista, sequelize);
	require('./rutas-clientes')(router, forEach, decodeBase64Image, fs, Empresa, Cliente, RutaCliente, Venta, VentaReprogramacionPago, sequelize, ClienteRazon, GtmClienteDestino, GtmDestino);
	require('./rutas-proveedores')(router, sequelize, forEach, decodeBase64Image, fs, Empresa, Proveedor, Compra, CompraReprogramacionPago);
	require('./rutas-productos')(router, forEach, decodeBase64Image, fs, Empresa, Producto, Proveedor, Cliente, Clase, Inventario, ComisionVendedorProducto, Usuario,
		DetalleVenta, DetalleMovimiento, Movimiento, Venta, Compra, DetalleCompra, Almacen, Sucursal, signs3, Tipo, ProductoBase, sequelize, ContabilidadCuenta, UsuarioGrupos);
	require('./rutas-sucursales')(router, forEach, decodeBase64Image, fs, Empresa, Sucursal, Almacen, Clase, SucursalActividadDosificacion, Dosificacion, schedule, ConfiguracionFactura);
	require('./rutas-dosificaciones')(router, forEach, fs, sequelize, Empresa, Dosificacion, SucursalActividadDosificacion, Sucursal, Clase);
	require('./rutas-pruebas-codigo-control')(router, fs, excelbuilder, CodigoControl);
	require('./rutas-configuraciones-factura')(router, Sucursal, ConfiguracionFactura, Clase, ConfiguracionGeneralFactura);
	require('./rutas-configuraciones-app')(router, Usuario, ConfiguracionVendedorApp, Clase, ConfiguracionGeneralApp, Rol, UsuarioRol, Diccionario, Persona);
	require('./rutas-reportes')(router, sequelize, Sequelize, Compra, Proveedor, Almacen, Sucursal, Empresa, Venta, Cliente, Movimiento, Clase,
		Inventario, Producto, DetalleVenta, DetalleCompra, Usuario, Diccionario, PagoVenta, Persona, VendedorVenta);
	require('./rutas-rutas')(router, Ruta, RutaDia, RutaCliente, Clase, Cliente, Persona, UsuarioRuta, Usuario, Venta, Movimiento,
		DetalleVenta, Producto, DetalleVentaNoConsolidada);
	require('./rutas-seguimiento-app')(router, UsuarioRuta, Ruta, Usuario, Persona, Venta, RutaDia, Clase, DetalleVenta, Producto, Cliente,
		RutaCliente, DetalleVentaNoConsolidada, ComisionVendedorProducto, PagoVenta);
	require('./rutas-bancos')(router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, Banco, Clase);
	require('./rutas-cierres-caja')(router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, CierreCaja, Clase, Sucursal, Usuario,
		Venta, DetalleVenta, Cliente, Almacen, Sucursal, PagoVenta, PagoCompra, Compra, Proveedor, sequelize, Banco, DetalleCompra,
		CajaSiguienteTurno, Diccionario, Producto, Inventario, Sequelize);
	require('./rutas-contabilidad-cuenta')(router, ContabilidadCuenta, ClasificacionCuenta, Tipo, Clase, Usuario, Diccionario, ClienteCuenta, ProveedorCuenta, ConfiguracionCuenta, sequelize, Cliente, Proveedor, MedicoPaciente, Persona);
	require('./rutas-comprobante-contabilidad')(router, ComprobanteContabilidad, AsientoContabilidad, ContabilidadCuenta, ClasificacionCuenta, Sucursal, Clase, Usuario, Diccionario, Empresa, Persona, Compra, Venta, MonedaTipoCambio, NumeroLiteral, ContabilidadCuentaAuxiliar); //MonedaTipoCambio
	// require('./rutas-contabilidad-clasificacion-cuenta')(router,ClasificacionCuenta,tipo,Usuario,Diccionario);
	require('./rutas-gtm-estibajes')(router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmEstibaje); //MonedaTipoCambio
	require('./rutas-gtm-destinos')(router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmDestino, Cliente, GtmClienteDestino);
	require('./rutas-gtm-transportistas')(router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmTransportista, Persona);
	require('./rutas-gtm-grupo-estibajes')(router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmGrupoEstibaje);
	require('./rutas-gtm-despacho')(router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmDespacho, GtmDespachoDetalle, Cliente, Usuario, GtmDestino, Producto
		,GtmTransportista, GtmEstibaje, GtmGrupoEstibaje, Persona, ClienteRazon, sequelize, Inventario, Movimiento, DetalleMovimiento, Tipo, Clase, Diccionario, Sequelize, Sucursal);



	//INV
	require('./rutas-inventario')(router, ensureAuthorized, forEach, Compra, DetalleCompra, Almacen, Sucursal, Empresa, sequelize, Sequelize,
		Tipo, Clase, Proveedor, Producto, Movimiento, DetalleMovimiento, Inventario, Venta, DetalleVenta,
		Cliente, CodigoControl, NumeroLiteral, Diccionario, SucursalActividadDosificacion, Dosificacion,
		ConfiguracionGeneralFactura, ConfiguracionFactura, PagoVenta, PagoCompra, Usuario, DetalleVentaNoConsolidada, ClienteCuenta, ContabilidadCuenta, ProveedorCuenta, Farmacia, Proforma, DetallesProformas, Servicios);
	require('./rutas-salidas')(router, forEach, decodeBase64Image, fs, Empresa, Producto, Proveedor, Cliente, Clase, Inventario, ComisionVendedorProducto, Usuario,
		DetalleVenta, DetalleMovimiento, Movimiento, Venta, Compra, DetalleCompra, Almacen, Sucursal, signs3, Tipo, VentaReprogramacionPago, Farmacia);

	require('./rutas-mesa')(router, forEach, fs, sequelize, Empresa, Dosificacion, SucursalActividadDosificacion,
		Sucursal, Clase, Mesa, Sala, PedidoRestaurante, MesaPedidoRestaurante, DetallePedidoRestaurante,
		Producto, Inventario, Tipo, Movimiento, DetalleMovimiento, Garzon, Persona, decodeBase64Image,
		GarzonPedidoRestaurante);

	require('./rutas-cotizacion')(router, Cotizacion, DetalleCotizacion, Usuario, Producto, Diccionario, Clase, ConfiguracionGeneralFactura, Sucursal)
	require('./rutas-paciente')(router, Usuario, MedicoPaciente, Persona, Empresa, Sucursal, MedicoPrerequisito, Clase, Diccionario, Tipo, decodeBase64Image, fs, MedicoVacuna, VacunaDosis, MedicoPacienteVacuna, MedicoPacienteVacunaDosis,
		MedicoPacienteConsulta, MedicoPacienteFicha, sequelize, Sequelize, MedicoLaboratorioExamen, MedicoLaboratorio, MedicoLaboratorioPaciente, MedicoLaboratorioResultado, MedicoLaboratorioResultado, MedicoDiagnostico, MedicoDiagnosticoExamen, MedicoDiagnosticoPaciente, MedicoDiagnosticoResultado, MedicoPacientePreRequisito, RrhhEmpleadoCargo,RrhhEmpleadoFicha)
	require('./rutas-farmacia')(router, sequelize, Sequelize, Usuario, Farmacia, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, Movimiento, SucursalActividadDosificacion, CodigoControl, NumeroLiteral, Dosificacion, Venta, DetalleVenta, Producto, Cliente, Almacen, MedicoPaciente, RrhhEmpleadoCargo, Inventario, ConfiguracionGeneralFactura, DetalleMovimiento, ConfiguracionFactura, decodeBase64Image, fs,RrhhEmpleadoFicha);

	//Mantenimiento Vehiculos
	require('./rutas-maquinaria')(router, sequelize, Sequelize, Usuario, Producto, Diccionario, Clase, Sucursal, Empresa, ProductoBase, Almacen, ContabilidadCuenta, Persona, MantenimientoOrdenTrabajo, MantenimientoOrdenTrabajoManoObra, MantenimientoOrdenTrabajoMaterial, MantenimientoOrdenTrabajoServicioExterno, MantenimientoOrdenTrabajoSistema, Inventario, Clase)
	require('./rutas-recursos-humanos')(router, sequelize, Sequelize, Usuario, MedicoPaciente, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, decodeBase64Image, fs, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo,
		RrhhEmpleadoHojaVida, RrhhEmpleadoFormacionAcademica, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna, NumeroLiteral, RrhhEmpleadoPrestamo, RrhhEmpleadoPrestamoPago, RrhhEmpleadoRolTurno, RrhhEmpleadoHorasExtra, RrhhAnticipo, EvaluacionPolifuncional, ConfiguracionCalificacionEvaluacionPolifuncional, ConfiguracionDesempenioEvaluacionPolifuncional, RrhhEmpleadoAusencia, RrhhEmpleadoVacaciones, RrhhEmpleadoCompensacionAusencia,
		RrhhFeriado, RrhhClaseAsuencia,RrhhEmpleadoConfiguracionVacacion,RrhhEmpleadoHistorialVacacion,RrhhEmpleadoTr3,RrhhEmpleadoAnticipoTr3,Banco,RrhhEmpleadoDeduccionIngreso,
		RrhhEmpleadoBeneficioSocial,RrhhEmpleadoBitacoraFicha)

	require('./rutas-planillas')(router, sequelize, Sequelize, Usuario, RRHHParametros, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, RrhhEmpleadoFicha, RrhhEmpleadoCargo, MedicoPaciente, RrhhEmpleadoDiscapacidad, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoHorasExtra, RRHHPlanillaSueldos, RRHHDetallePlanillaSueldos, RrhhEmpleadoPrestamo, decodeBase64Image, fs)


	require('./rutas-operaciones')(router, sequelize, Sequelize, Usuario, Producto, Diccionario, Clase, Sucursal, Empresa, ProductoBase, Almacen, Inventario, SolicitudReposicion, DetalleSolicitudProducto, DetalleSolicitudProductoBase, Persona, UsuarioGrupos)
	require('./rutas-proformas')(router, sequelize, Sequelize, Usuario, Cliente, Proforma, DetallesProformas, Servicios, Clase, Sucursal, SucursalActividadDosificacion, Dosificacion, CodigoControl, NumeroLiteral, Empresa, ConfiguracionGeneralFactura, Tipo, UsuarioSucursal, Almacen, Venta, DetalleVenta, ConfiguracionGeneralFactura, ConfiguracionFactura, Movimiento)

	router.route('/test')
		.get(function (req, res) {
			var rest;
			for (var i = 5000.36; i <= 6532; i++) {
				rest = NumeroLiteral.prueba(parseFloat(i).toString());
			}
			res.json({ rest: rest });
		});
}