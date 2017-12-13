module.exports = function (sequelize, Usuario, Persona, Rol, UsuarioRol, Tipo, Clase, Aplicacion, RolAplicacion,
	Empresa, Sucursal, UsuarioSucursal, Cliente, Proveedor, Producto, UsuarioAplicacion,
	Almacen, Dosificacion, SucursalActividadDosificacion, Inventario, Movimiento,
	Compra, DetalleMovimiento, DetalleCompra, Venta, DetalleVenta, ConfiguracionFactura,
	ConfiguracionGeneralFactura, PagoVenta, ConfiguracionVendedorApp, ConfiguracionGeneralApp,
	Ruta, RutaDia, RutaCliente, UsuarioRuta, ComisionVendedorProducto, DetalleVentaNoConsolidada,
	ProductoBase, ConfiguracionVentaVista, ConfiguracionCompraVista, CierreCaja, Banco, PagoCompra,
	CajaSiguienteTurno, VentaReprogramacionPago, CompraReprogramacionPago,
	MedicoPaciente, Garzon, GarzonPedidoRestaurante, PedidoRestaurante, MesaPedidoRestaurante,
	DetallePedidoRestaurante, CuentaRestaurante, Mesa, Sala, Cotizacion, DetalleCotizacion, ContabilidadCuenta, ClasificacionCuenta, ComprobanteContabilidad, AsientoContabilidad,
	ClienteCuenta, ProveedorCuenta, MedicoPrerequisito, ConfiguracionCuenta, MedicoVacuna, VacunaDosis, MedicoPacienteVacuna, MedicoPacienteVacunaDosis, VistaColumnasAplicacion,
	MedicoPacienteConsulta, MedicoPacienteFicha, MedicoLaboratorioExamen, MedicoLaboratorio, MedicoLaboratorioPaciente, MedicoLaboratorioResultado, MedicoDiagnostico, MedicoDiagnosticoExamen, MedicoDiagnosticoPaciente, MedicoDiagnosticoResultado,
	MantenimientoOrdenTrabajo, MantenimientoOrdenTrabajoManoObra, MantenimientoOrdenTrabajoMaterial, MantenimientoOrdenTrabajoServicioExterno, MantenimientoOrdenTrabajoSistema,VendedorVenta) {

	Persona.hasOne(Usuario, { foreignKey: 'id_persona', as: 'usuario' });
	Persona.belongsTo(Clase, { foreignKey: 'id_lugar_nacimiento', as: 'lugar_nacimiento' });
	Persona.belongsTo(Clase, { foreignKey: 'id_genero', as: 'genero' });
	Persona.belongsTo(Clase, { foreignKey: 'id_lenguaje', as: 'lenguaje' });
	Persona.belongsTo(Clase, { foreignKey: 'id_grado_academico', as: 'grado' });
	Persona.hasOne(Garzon, { foreignKey: 'id_persona', as: 'garzon' });
	Persona.hasOne(MedicoPaciente, { foreignKey: 'id_persona', as: 'medicoPaciente' });
	Persona.hasOne(MedicoPacienteFicha, { foreignKey: 'id_persona_referencia', as: 'personaReferencias' });
	Persona.hasMany(MantenimientoOrdenTrabajoManoObra, { foreignKey: 'id_persona', as: 'MantenimientosManoDeObra' });
	Persona.hasOne(VendedorVenta, { foreignKey: 'id_persona', as: 'vendedor' });

	Usuario.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' });
	Usuario.hasMany(UsuarioRol, { foreignKey: 'id_usuario', as: 'rolesUsuario' });
	Usuario.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Usuario.hasMany(UsuarioSucursal, { foreignKey: 'id_usuario', as: 'sucursalesUsuario' });
	Usuario.hasMany(UsuarioAplicacion, { foreignKey: 'id_usuario', as: 'aplicacionesUsuario' });
	Usuario.hasMany(Venta, { foreignKey: 'id_usuario', as: 'ventas' });
	Usuario.hasOne(ConfiguracionVendedorApp, { foreignKey: 'id_vendedor', as: 'configuracionVendedorApp' });
	Usuario.hasMany(UsuarioRuta, { foreignKey: 'id_usuario', as: 'rutas' });
	Usuario.hasMany(ComisionVendedorProducto, { foreignKey: 'id_usuario', as: 'comisionesVendedores' });
	Usuario.hasMany(PagoVenta, { foreignKey: 'id_usuario', as: 'pagos' });
	Usuario.hasMany(PagoCompra, { foreignKey: 'id_usuario', as: 'pagosCompra' });
	Usuario.hasMany(CierreCaja, { foreignKey: 'id_usuario', as: 'cierresCaja' });
	Usuario.hasMany(Compra, { foreignKey: 'id_usuario', as: 'compras' });
	Usuario.hasMany(ComprobanteContabilidad, { foreignKey: 'id_usuario', as: 'usuario' });

	Rol.hasMany(UsuarioRol, { foreignKey: 'id_rol', as: 'rolesUsuario' });
	Rol.hasMany(RolAplicacion, { foreignKey: 'id_rol', as: 'aplicacionesRol' });

	UsuarioRol.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	UsuarioRol.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });

	Tipo.hasMany(Clase, { foreignKey: 'id_tipo', as: 'clases' });
	Tipo.hasMany(Movimiento, { foreignKey: 'id_tipo', as: 'movimientos' });
	Tipo.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Tipo.hasMany(ConfiguracionCuenta, { foreignKey: 'id_tipo', as: 'tipoConfiguracionCuenta' });

	Clase.hasMany(ContabilidadCuenta, { foreignKey: 'id_calculo', as: 'claseCalculo' });
	Clase.hasMany(ComprobanteContabilidad, { foreignKey: 'id_tipo', as: 'tipoComprobante' });
	Clase.hasMany(ContabilidadCuenta, { foreignKey: 'id_tipo_cuenta', as: 'tipoCuenta' });

	Clase.hasMany(ClasificacionCuenta, { foreignKey: 'id_saldo', as: 'clasificacionesCuenta' });
	Clase.hasMany(ClasificacionCuenta, { foreignKey: 'id_movimiento', as: 'movimientos' });
	Clase.belongsTo(Tipo, { foreignKey: 'id_tipo', as: 'tipo' });
	Clase.hasMany(Persona, { foreignKey: 'id_lugar_nacimiento', as: 'lugaresNacimientoPersonas' });
	Clase.hasMany(Persona, { foreignKey: 'id_genero', as: 'generosPersonas' });
	Clase.hasMany(Persona, { foreignKey: 'id_lenguaje', as: 'lenguajesPersonas' });
	Clase.hasMany(Persona, { foreignKey: 'id_grado_academico', as: 'gradosPersonas' });
	Clase.hasMany(Empresa, { foreignKey: 'id_departamento', as: 'empresasDepartamentos' });
	Clase.hasMany(Empresa, { foreignKey: 'id_municipio', as: 'empresasMunicipios' });
	Clase.hasMany(Sucursal, { foreignKey: 'id_departamento', as: 'sucursalesDepartamentos' });
	Clase.hasMany(Sucursal, { foreignKey: 'id_municipio', as: 'sucursalesMunicipios' });
	Clase.hasMany(SucursalActividadDosificacion, { foreignKey: 'id_actividad', as: 'sucursalesDosificaciones' });
	Clase.hasMany(Movimiento, { foreignKey: 'id_clase', as: 'movimientos' });
	Clase.hasMany(Compra, { foreignKey: 'id_tipo_pago', as: 'compras' });
	Clase.hasMany(Venta, { foreignKey: 'id_tipo_pago', as: 'ventas' });
	Clase.hasMany(Venta, { foreignKey: 'id_actividad', as: 'ventasActividad' });
	Clase.hasMany(DetalleCompra, { foreignKey: 'id_centro_costo', as: 'detallesCompra' });
	Clase.hasMany(ConfiguracionFactura, { foreignKey: 'id_impresion_factura', as: 'impresionesFactura' });
	Clase.hasMany(ConfiguracionFactura, { foreignKey: 'id_tipo_facturacion', as: 'tiposFacturacion' });
	Clase.hasMany(ConfiguracionFactura, { foreignKey: 'id_tamano_papel_factura', as: 'tamanosPapelFactura' });
	Clase.hasMany(ConfiguracionFactura, { foreignKey: 'id_titulo_factura', as: 'titulosFactura' });
	Clase.hasMany(ConfiguracionFactura, { foreignKey: 'id_subtitulo_factura', as: 'subtitulosFactura' });
	Clase.hasMany(ConfiguracionFactura, { foreignKey: 'id_pie_factura', as: 'piesFactura' });
	Clase.hasMany(ConfiguracionGeneralFactura, { foreignKey: 'id_impresion_factura', as: 'impresionesFactura' });
	Clase.hasMany(ConfiguracionGeneralFactura, { foreignKey: 'id_tipo_facturacion', as: 'tiposFacturacion' });
	Clase.hasMany(ConfiguracionGeneralFactura, { foreignKey: 'id_tamano_papel_factura', as: 'tamanosPapelFactura' });
	Clase.hasMany(ConfiguracionGeneralFactura, { foreignKey: 'id_titulo_factura', as: 'titulosFactura' });
	Clase.hasMany(ConfiguracionGeneralFactura, { foreignKey: 'id_subtitulo_factura', as: 'subtitulosFactura' });
	Clase.hasMany(ConfiguracionGeneralFactura, { foreignKey: 'id_pie_factura', as: 'piesFactura' });
	Clase.hasMany(ConfiguracionGeneralApp, { foreignKey: 'id_tipo_venta', as: 'tiposVenta' });
	Clase.hasMany(ConfiguracionGeneralApp, { foreignKey: 'id_cobro_habilitado', as: 'cobros' });
	Clase.hasMany(ConfiguracionGeneralApp, { foreignKey: 'id_tipo_pago', as: 'tiposPago' });
	Clase.hasMany(ConfiguracionGeneralApp, { foreignKey: 'id_listado_productos', as: 'listadoProductosGeneral' });
	Clase.hasMany(ConfiguracionVendedorApp, { foreignKey: 'id_tipo_venta', as: 'tiposVentaVendedor' });
	Clase.hasMany(ConfiguracionVendedorApp, { foreignKey: 'id_cobro_habilitado', as: 'cobrosVendedor' });
	Clase.hasMany(ConfiguracionVendedorApp, { foreignKey: 'id_tipo_pago', as: 'tiposPagoVendedor' });
	Clase.hasMany(ConfiguracionVendedorApp, { foreignKey: 'id_listado_productos', as: 'listadoProductosVendedor' });
	Clase.hasMany(RutaDia, { foreignKey: 'id_dia', as: 'rutas' });
	Clase.hasMany(Ruta, { foreignKey: 'id_departamento', as: 'rutasDepartamentos' });
	Clase.hasMany(Ruta, { foreignKey: 'id_municipio', as: 'rutasMunicipios' });
	Clase.hasMany(Dosificacion, { foreignKey: 'id_pie_factura', as: 'piesFactura' });
	Clase.hasMany(Producto, { foreignKey: 'id_tipo_producto', as: 'productos' });
	Clase.hasMany(CierreCaja, { foreignKey: 'id_destino', as: 'cierresCajaDestino' });
	Clase.hasMany(Banco, { foreignKey: 'id_tipo_cuenta', as: 'bancosTipoCuenta' });
	Clase.hasMany(Banco, { foreignKey: 'id_tipo_moneda', as: 'bancosTipoMoneda' });
	Clase.hasMany(Mesa, { foreignKey: 'id_estado', as: 'mesas' });
	Clase.hasMany(MedicoPrerequisito, { foreignKey: 'id_prerequisito', as: 'prerequisitos' });
	Clase.hasMany(MedicoPacienteFicha, { foreignKey: 'id_tipo_control', as: 'tiposControl' });

	Clase.hasMany(MantenimientoOrdenTrabajo, { foreignKey: 'id_prioridad', as: 'prioridades' });
	Clase.hasMany(MantenimientoOrdenTrabajoSistema, { foreignKey: 'id_orden_trabajo_sistema', as: 'Sistemas' });
	Clase.hasMany(MantenimientoOrdenTrabajo, { foreignKey: 'id_tipo_mantenimiento', as: 'tiposMantenimientos' });
	Clase.hasMany(MantenimientoOrdenTrabajoManoObra, { foreignKey: 'id_especialidad', as: 'especilidades' });


	MedicoPrerequisito.belongsTo(Clase, { foreignKey: 'id_prerequisito', as: 'prerequisitoClase' });
	MedicoPrerequisito.belongsTo(MedicoPaciente, { foreignKey: 'id_paciente', as: 'prerequisitoPaciente' });


	Aplicacion.belongsTo(Aplicacion, { foreignKey: 'id_padre', as: 'padre' });
	Aplicacion.hasMany(Aplicacion, { foreignKey: 'id_padre', as: 'subaplicaciones' });
	Aplicacion.hasMany(RolAplicacion, { foreignKey: 'id_aplicacion', as: 'rolAplicaciones' });
	Aplicacion.hasMany(UsuarioAplicacion, { foreignKey: 'id_aplicacion', as: 'usuarioAplicaciones' });
	Aplicacion.hasMany(VistaColumnasAplicacion, { foreignKey: 'id_aplicacion', as: 'columnas' })

	RolAplicacion.belongsTo(Aplicacion, { foreignKey: 'id_aplicacion', as: 'aplicacion' });
	RolAplicacion.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });

	Empresa.hasMany(Usuario, { foreignKey: 'id_empresa', as: 'usuarios' });
	Empresa.hasMany(Sucursal, { foreignKey: 'id_empresa', as: 'sucursales' });
	Empresa.hasMany(Cliente, { foreignKey: 'id_empresa', as: 'clientes' });
	Empresa.hasMany(Proveedor, { foreignKey: 'id_empresa', as: 'proveedores' });
	Empresa.hasMany(Producto, { foreignKey: 'id_empresa', as: 'productos' });
	Empresa.hasMany(Dosificacion, { foreignKey: 'id_empresa', as: 'dosificaciones' });
	Empresa.belongsTo(Clase, { foreignKey: 'id_departamento', as: 'departamento' });
	Empresa.belongsTo(Clase, { foreignKey: 'id_municipio', as: 'municipio' });
	Empresa.hasOne(ConfiguracionGeneralFactura, { foreignKey: 'id_empresa', as: 'configuracionGeneralFactura' });
	Empresa.hasOne(ConfiguracionGeneralApp, { foreignKey: 'id_empresa', as: 'configuracionGeneralApp' });
	Empresa.hasMany(Ruta, { foreignKey: 'id_empresa', as: 'rutas' });
	Empresa.hasMany(Tipo, { foreignKey: 'id_empresa', as: 'conceptos' });
	Empresa.hasOne(ConfiguracionVentaVista, { foreignKey: 'id_empresa', as: 'configuracionVentaVista' });
	Empresa.hasOne(ConfiguracionCompraVista, { foreignKey: 'id_empresa', as: 'configuracionCompraVista' });
	Empresa.hasMany(Banco, { foreignKey: 'id_empresa', as: 'bancos' });
	Empresa.hasMany(Garzon, { foreignKey: 'id_empresa', as: 'garzones' });
	Empresa.hasMany(ConfiguracionCuenta, { foreignKey: 'id_empresa', as: 'EmpresaconfiguracionCuenta' });
	Empresa.hasMany(MedicoLaboratorio, { foreignKey: 'id_empresa', as: 'empresaLaboratorios' });
	Empresa.hasMany(MedicoDiagnostico, { foreignKey: 'id_empresa', as: 'empresaDiagnosticos' });
	Empresa.hasMany(VendedorVenta, { foreignKey: 'id_empresa', as: 'vendedores' });

	VendedorVenta.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	VendedorVenta.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' });
	VendedorVenta.hasMany(Venta, { foreignKey: 'id_vendedor', as: 'ventas' });

	Sucursal.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Sucursal.belongsTo(Clase, { foreignKey: 'id_departamento', as: 'departamento' });
	Sucursal.belongsTo(Clase, { foreignKey: 'id_municipio', as: 'municipio' });
	Sucursal.hasMany(UsuarioSucursal, { foreignKey: 'id_sucursal', as: 'usuariosSucursal' });
	Sucursal.hasMany(Almacen, { foreignKey: 'id_sucursal', as: 'almacenes' });
	Sucursal.hasMany(SucursalActividadDosificacion, { foreignKey: 'id_sucursal', as: 'actividadesDosificaciones' });
	Sucursal.hasOne(ConfiguracionFactura, { foreignKey: 'id_sucursal', as: 'configuracionFactura' });
	Sucursal.hasMany(CierreCaja, { foreignKey: 'id_sucursal', as: 'cierresCaja' });
	Sucursal.hasMany(CajaSiguienteTurno, { foreignKey: 'id_sucursal', as: 'cajasSiguienteTurno' });
	Sucursal.hasMany(Sala, { foreignKey: 'id_sucursal', as: 'salas' });
	Sucursal.hasMany(ComprobanteContabilidad, { foreignKey: 'id_sucursal', as: 'sucursal' });
	Sucursal.hasMany(Cotizacion, { foreignKey: 'id_sucursal', as: 'sucursal' });


	UsuarioSucursal.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });
	UsuarioSucursal.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

	Cliente.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Cliente.hasMany(Venta, { foreignKey: 'id_cliente', as: 'ventas' });
	Cliente.hasMany(RutaCliente, { foreignKey: 'id_cliente', as: 'rutas' });
	Cliente.hasMany(DetalleVentaNoConsolidada, { foreignKey: 'id_cliente', as: 'detallesVentaNoConsolidadas' });
	Cliente.hasOne(ClienteCuenta, { foreignKey: 'id_cliente', as: 'clienteCuenta' });

	Proveedor.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Proveedor.hasMany(Compra, { foreignKey: 'id_proveedor', as: 'compras' });
	Proveedor.hasOne(ProveedorCuenta, { foreignKey: 'id_proveedor', as: 'proveedorCuenta' });

	Producto.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Producto.hasMany(Inventario, { foreignKey: 'id_producto', as: 'inventarios' });
	Producto.hasMany(DetalleMovimiento, { foreignKey: 'id_producto', as: 'detallesMovimiento' });
	Producto.hasMany(DetalleCompra, { foreignKey: 'id_producto', as: 'detallesCompra' });
	Producto.hasMany(DetalleVenta, { foreignKey: 'id_producto', as: 'detallesVenta' });
	Producto.hasMany(ComisionVendedorProducto, { foreignKey: 'id_producto', as: 'comisionesVendedores' });
	Producto.hasMany(DetalleVentaNoConsolidada, { foreignKey: 'id_producto', as: 'detallesVentaNoConsolidadas' });
	Producto.belongsTo(Clase, { foreignKey: 'id_tipo_producto', as: 'tipoProducto' });
	Producto.hasMany(ProductoBase, { foreignKey: 'id_producto', as: 'productosBase' });
	Producto.hasMany(ProductoBase, { foreignKey: 'id_producto_base', as: 'productos' });
	Producto.belongsTo(ContabilidadCuenta, { foreignKey: 'id_cuenta', as: 'cuenta' });
	Producto.belongsTo(Almacen, { foreignKey: 'id_almacen_erp', as: 'almacenErp' });
	Producto.hasMany(MantenimientoOrdenTrabajoMaterial, { foreignKey: 'id_producto', as: 'productos' });
	Producto.hasMany(MantenimientoOrdenTrabajo, { foreignKey: 'id_producto', as: 'productos' });

	ProductoBase.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
	ProductoBase.belongsTo(Producto, { foreignKey: 'id_producto_base', as: 'productoBase' });

	UsuarioAplicacion.belongsTo(Aplicacion, { foreignKey: 'id_aplicacion', as: 'aplicacion' });
	UsuarioAplicacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

	Almacen.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });
	Almacen.hasMany(Inventario, { foreignKey: 'id_almacen', as: 'inventarios' });
	Almacen.hasMany(Movimiento, { foreignKey: 'id_almacen', as: 'movimientos' });
	Almacen.hasMany(Compra, { foreignKey: 'id_almacen', as: 'compras' });
	Almacen.hasMany(Venta, { foreignKey: 'id_almacen', as: 'ventas' });
	Almacen.hasMany(Venta, { foreignKey: 'id_almacen_traspaso', as: 'ventasTraspaso' });
	Almacen.hasMany(Producto, { foreignKey: 'id_almacen_erp', as: 'productos' });

	Dosificacion.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Dosificacion.hasMany(SucursalActividadDosificacion, { foreignKey: 'id_dosificacion', as: 'actividadesSucursales' });
	Dosificacion.belongsTo(Clase, { foreignKey: 'id_pie_factura', as: 'pieFactura' });


	SucursalActividadDosificacion.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });
	SucursalActividadDosificacion.belongsTo(Clase, { foreignKey: 'id_actividad', as: 'actividad' });
	SucursalActividadDosificacion.belongsTo(Dosificacion, { foreignKey: 'id_dosificacion', as: 'dosificacion' });

	Inventario.belongsTo(Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
	Inventario.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
	Inventario.hasMany(DetalleMovimiento, { foreignKey: 'id_inventario', as: 'detallesMovimiento' });
	Inventario.hasMany(DetalleCompra, { foreignKey: 'id_inventario', as: 'detallesCompra' });
	Inventario.hasMany(DetalleVenta, { foreignKey: 'id_inventario', as: 'detallesVenta' });


	Movimiento.belongsTo(Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
	Movimiento.belongsTo(Tipo, { foreignKey: 'id_tipo', as: 'tipo' });
	Movimiento.belongsTo(Clase, { foreignKey: 'id_clase', as: 'clase' });
	Movimiento.hasOne(Compra, { foreignKey: 'id_movimiento', as: 'compra' });
	Movimiento.hasOne(Venta, { foreignKey: 'id_movimiento', as: 'venta' });
	Movimiento.hasMany(DetalleMovimiento, { foreignKey: 'id_movimiento', as: 'detallesMovimiento' });

	Compra.belongsTo(Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
	Compra.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
	Compra.belongsTo(Movimiento, { foreignKey: 'id_movimiento', as: 'movimiento' });
	Compra.belongsTo(Clase, { foreignKey: 'id_tipo_pago', as: 'tipoPago' });
	Compra.hasMany(DetalleCompra, { foreignKey: 'id_compra', as: 'detallesCompra' });
	Compra.hasMany(PagoCompra, { foreignKey: 'id_compra', as: 'pagosCompra' });
	Compra.belongsTo(CierreCaja, { foreignKey: 'id_cierre_caja', as: 'cierreCaja' });
	Compra.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	Compra.hasMany(CompraReprogramacionPago, { foreignKey: 'id_compra', as: 'compraReprogramacionPagos' });

	DetalleMovimiento.belongsTo(Movimiento, { foreignKey: 'id_movimiento', as: 'movimiento' });
	DetalleMovimiento.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
	DetalleMovimiento.belongsTo(Inventario, { foreignKey: 'id_inventario', as: 'inventario' });

	DetalleCompra.belongsTo(Compra, { foreignKey: 'id_compra', as: 'compra' });
	DetalleCompra.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
	DetalleCompra.belongsTo(Clase, { foreignKey: 'id_centro_costo', as: 'centroCosto' });
	DetalleCompra.belongsTo(Inventario, { foreignKey: 'id_inventario', as: 'inventario' });

	Venta.belongsTo(Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
	Venta.belongsTo(Almacen, { foreignKey: 'id_almacen_traspaso', as: 'almacenTraspaso' });
	Venta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
	Venta.belongsTo(Movimiento, { foreignKey: 'id_movimiento', as: 'movimiento' });
	Venta.belongsTo(Clase, { foreignKey: 'id_tipo_pago', as: 'tipoPago' });
	Venta.belongsTo(Clase, { foreignKey: 'id_actividad', as: 'actividad' });
	Venta.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta', as: 'detallesVenta' });
	Venta.hasMany(PagoVenta, { foreignKey: 'id_venta', as: 'pagosVenta' });
	Venta.hasMany(DetalleVentaNoConsolidada, { foreignKey: 'id_venta', as: 'detallesVentaNoConsolidadas' });
	Venta.belongsTo(CierreCaja, { foreignKey: 'id_cierre_caja', as: 'cierreCaja' });
	Venta.hasMany(VentaReprogramacionPago, { foreignKey: 'id_venta', as: 'ventaReprogramacionPagos' });
	Venta.belongsTo(VendedorVenta, { foreignKey: 'id_vendedor', as: 'vendedor' });


	PagoVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });
	PagoVenta.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	PagoVenta.belongsTo(CierreCaja, { foreignKey: 'id_cierre_caja', as: 'cierreCaja' });

	PagoCompra.belongsTo(Compra, { foreignKey: 'id_compra', as: 'compra' });
	PagoCompra.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	PagoCompra.belongsTo(CierreCaja, { foreignKey: 'id_cierre_caja', as: 'cierreCaja' });

	DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });
	DetalleVenta.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
	DetalleVenta.belongsTo(Inventario, { foreignKey: 'id_inventario', as: 'inventario' });

	ConfiguracionFactura.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_impresion_factura', as: 'impresionFactura' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_tipo_facturacion', as: 'tipoFacturacion' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_factura', as: 'tamanoPapelFactura' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_titulo_factura', as: 'tituloFactura' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_subtitulo_factura', as: 'subtituloFactura' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_pie_factura', as: 'pieFactura' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_nota_venta', as: 'tamanoPapelNotaVenta' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_nota_traspaso', as: 'tamanoPapelNotaTraspaso' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_nota_baja', as: 'tamanoPapelNotaBaja' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_nota_pedido', as: 'tamanoPapelNotaPedido' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_cierre_caja', as: 'tamanoPapelCierreCaja' });
	ConfiguracionFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_cotizacion', as: 'tamanoPapelCotizacion' });

	ConfiguracionGeneralFactura.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_impresion_factura', as: 'impresionFactura' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_tipo_facturacion', as: 'tipoFacturacion' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_factura', as: 'tamanoPapelFactura' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_titulo_factura', as: 'tituloFactura' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_subtitulo_factura', as: 'subtituloFactura' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_pie_factura', as: 'pieFactura' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_nota_venta', as: 'tamanoPapelNotaVenta' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_nota_traspaso', as: 'tamanoPapelNotaTraspaso' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_nota_baja', as: 'tamanoPapelNotaBaja' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_nota_pedido', as: 'tamanoPapelNotaPedido' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_cierre_caja', as: 'tamanoPapelCierreCaja' });
	ConfiguracionGeneralFactura.belongsTo(Clase, { foreignKey: 'id_tamano_papel_cotizacion', as: 'tamanoPapelCotizacion' });

	ConfiguracionGeneralApp.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	ConfiguracionGeneralApp.belongsTo(Clase, { foreignKey: 'id_tipo_venta', as: 'tipoVenta' });
	ConfiguracionGeneralApp.belongsTo(Clase, { foreignKey: 'id_cobro_habilitado', as: 'cobroHabilitado' });
	ConfiguracionGeneralApp.belongsTo(Clase, { foreignKey: 'id_tipo_pago', as: 'tipoPago' });
	ConfiguracionGeneralApp.belongsTo(Clase, { foreignKey: 'id_listado_productos', as: 'listadoProductos' });

	ConfiguracionVendedorApp.belongsTo(Usuario, { foreignKey: 'id_vendedor', as: 'vendedor' });
	ConfiguracionVendedorApp.belongsTo(Clase, { foreignKey: 'id_tipo_venta', as: 'tipoVenta' });
	ConfiguracionVendedorApp.belongsTo(Clase, { foreignKey: 'id_cobro_habilitado', as: 'cobroHabilitado' });
	ConfiguracionVendedorApp.belongsTo(Clase, { foreignKey: 'id_tipo_pago', as: 'tipoPago' });
	ConfiguracionVendedorApp.belongsTo(Clase, { foreignKey: 'id_listado_productos', as: 'listadoProductos' });

	Ruta.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Ruta.belongsTo(Clase, { foreignKey: 'id_departamento', as: 'departamento' });
	Ruta.belongsTo(Clase, { foreignKey: 'id_municipio', as: 'municipio' });
	Ruta.hasMany(RutaDia, { foreignKey: 'id_ruta', as: 'dias' });
	Ruta.hasMany(RutaCliente, { foreignKey: 'id_ruta', as: 'clientes' });
	Ruta.hasMany(UsuarioRuta, { foreignKey: 'id_ruta', as: 'usuarios' });

	RutaDia.belongsTo(Ruta, { foreignKey: 'id_ruta', as: 'ruta' });
	RutaDia.belongsTo(Clase, { foreignKey: 'id_dia', as: 'dia' });

	RutaCliente.belongsTo(Ruta, { foreignKey: 'id_ruta', as: 'ruta' });
	RutaCliente.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

	UsuarioRuta.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	UsuarioRuta.belongsTo(Ruta, { foreignKey: 'id_ruta', as: 'ruta' });

	ComisionVendedorProducto.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	ComisionVendedorProducto.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

	DetalleVentaNoConsolidada.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });
	DetalleVentaNoConsolidada.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
	DetalleVentaNoConsolidada.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

	ConfiguracionVentaVista.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	ConfiguracionCompraVista.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	CierreCaja.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });
	CierreCaja.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	CierreCaja.belongsTo(Clase, { foreignKey: 'id_destino', as: 'destino' });
	CierreCaja.belongsTo(Banco, { foreignKey: 'id_banco_destino', as: 'bancoDestino' });
	CierreCaja.hasMany(Venta, { foreignKey: 'id_cierre_caja', as: 'ventasContado' });
	CierreCaja.hasMany(Venta, { foreignKey: 'id_cierre_caja', as: 'ventasCredito' });
	CierreCaja.hasMany(Compra, { foreignKey: 'id_cierre_caja', as: 'comprasContado' });
	CierreCaja.hasMany(Compra, { foreignKey: 'id_cierre_caja', as: 'comprasCredito' });
	CierreCaja.hasMany(PagoVenta, { foreignKey: 'id_cierre_caja', as: 'pagosVenta' });
	CierreCaja.hasMany(PagoCompra, { foreignKey: 'id_cierre_caja', as: 'pagosCompra' });
	CierreCaja.hasMany(CajaSiguienteTurno, { foreignKey: 'id_cierre_caja', as: 'cajasSiguienteTurno' });
	CierreCaja.hasMany(CajaSiguienteTurno, { foreignKey: 'id_cierre_caja_cerrado', as: 'cajasSiguienteTurnoCerradas' });

	Banco.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	Banco.belongsTo(Clase, { foreignKey: 'id_tipo_cuenta', as: 'tipoCuenta' });
	Banco.belongsTo(Clase, { foreignKey: 'id_tipo_moneda', as: 'tipoMoneda' });
	Banco.hasMany(CierreCaja, { foreignKey: 'id_banco_destino', as: 'cierresCajaDestino' });

	CajaSiguienteTurno.belongsTo(CierreCaja, { foreignKey: 'id_cierre_caja', as: 'cierreCaja' });
	CajaSiguienteTurno.belongsTo(CierreCaja, { foreignKey: 'id_cierre_caja_cerrado', as: 'cierreCajaCerrado' });
	CajaSiguienteTurno.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });

	VentaReprogramacionPago.belongsTo(Venta, { foreignKey: 'id_venta', as: 'venta' });

	CompraReprogramacionPago.belongsTo(Compra, { foreignKey: 'id_compra', as: 'compra' });

	Garzon.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' });
	Garzon.hasMany(GarzonPedidoRestaurante, { foreignKey: 'id_garzon', as: 'garzonpedidosRestaurante' });
	Garzon.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });

	MedicoPaciente.belongsTo(Persona, { foreignKey: 'id_persona', as: 'persona' });
	MedicoPaciente.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	MedicoPaciente.hasMany(MedicoPrerequisito, { foreignKey: 'id_paciente', as: 'prerequisitos' });
	MedicoPaciente.hasMany(MedicoPacienteConsulta, { foreignKey: 'id_paciente', as: 'consultas' });
	MedicoPaciente.hasMany(MedicoPacienteFicha, { foreignKey: 'id_paciente', as: 'fichas' });
	MedicoPaciente.hasMany(MedicoPacienteVacuna, { foreignKey: 'id_paciente', as: 'pacienteVacunas' })
	MedicoPaciente.hasMany(MedicoLaboratorioPaciente, { foreignKey: 'id_paciente', as: 'pacienteLaboratorios' })

	MedicoPacienteVacuna.belongsTo(MedicoPaciente, { foreignKey: 'id_paciente', as: 'paciente' })

	MedicoPacienteConsulta.belongsTo(MedicoPaciente, { foreignKey: 'id_paciente', as: 'pacienteConsulta' })

	MedicoPacienteFicha.belongsTo(MedicoPaciente, { foreignKey: 'id_paciente', as: 'paciente' })
	MedicoPacienteFicha.belongsTo(Clase, { foreignKey: 'id_tipo_control', as: 'tipoControl' })
	MedicoPacienteFicha.belongsTo(Persona, { foreignKey: 'id_persona_referencia', as: 'personaReferencia' })

	MedicoLaboratorio.hasMany(MedicoLaboratorioExamen, { foreignKey: 'id_laboratorio', as: 'laboratorioExamenes' })
	MedicoLaboratorio.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' })
	MedicoLaboratorio.hasMany(MedicoLaboratorioPaciente, { foreignKey: 'id_laboratorio', as: 'laboratorioPacientes' })

	MedicoLaboratorioExamen.belongsTo(MedicoLaboratorio, { foreignKey: 'id_laboratorio', as: 'laboratorio' })
	MedicoLaboratorioExamen.hasMany(MedicoLaboratorioResultado, { foreignKey: 'id_laboratorio_examen', as: 'laboratorioPacientesExamenes' })

	MedicoLaboratorioPaciente.belongsTo(MedicoLaboratorio, { foreignKey: 'id_laboratorio', as: 'laboratorio' })
	MedicoLaboratorioPaciente.belongsTo(MedicoPaciente, { foreignKey: 'id_paciente', as: 'paciente' })
	MedicoLaboratorioPaciente.hasMany(MedicoLaboratorioResultado, { foreignKey: 'id_laboratorio_paciente', as: 'laboratorioResultados' })

	MedicoLaboratorioResultado.belongsTo(MedicoLaboratorioPaciente, { foreignKey: 'id_laboratorio_paciente', as: 'laboratorioResultado' })
	MedicoLaboratorioResultado.belongsTo(MedicoLaboratorioExamen, { foreignKey: 'id_laboratorio_examen', as: 'laboratorioExamen' })

	MedicoDiagnostico.hasMany(MedicoDiagnosticoExamen, { foreignKey: 'id_diagnostico', as: 'diagnosticoExamenes' })
	MedicoDiagnostico.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' })
	MedicoDiagnostico.hasMany(MedicoDiagnosticoPaciente, { foreignKey: 'id_diagnostico', as: 'diagnosticoPacientes' })

	MedicoDiagnosticoExamen.belongsTo(MedicoDiagnostico, { foreignKey: 'id_diagnostico', as: 'diagnostico' })
	MedicoDiagnosticoExamen.hasMany(MedicoDiagnosticoResultado, { foreignKey: 'id_diagnostico_examen', as: 'diagnosticoPacientesExamenes' })

	MedicoDiagnosticoPaciente.belongsTo(MedicoDiagnostico, { foreignKey: 'id_diagnostico', as: 'diagnostico' })
	MedicoDiagnosticoPaciente.belongsTo(MedicoPaciente, { foreignKey: 'id_paciente', as: 'paciente' })
	MedicoDiagnosticoPaciente.hasMany(MedicoDiagnosticoResultado, { foreignKey: 'id_diagnostico_paciente', as: 'laboratorioResultados' })

	MedicoDiagnosticoResultado.belongsTo(MedicoDiagnosticoPaciente, { foreignKey: 'id_diagnostico_paciente', as: 'diagnosticoResultado' })
	MedicoDiagnosticoResultado.belongsTo(MedicoDiagnosticoExamen, { foreignKey: 'id_diagnostico_examen', as: 'diagnosticoExamen' })


	MedicoVacuna.hasMany(VacunaDosis, { foreignKey: 'id_vacuna', as: 'vacunaDosis' })
	VacunaDosis.belongsTo(MedicoVacuna, { foreignKey: 'id_vacuna', as: 'vacunaDosis' })
	MedicoVacuna.hasMany(MedicoPacienteVacuna, { foreignKey: 'id_vacuna', as: 'pacienteVacuna' })
	MedicoPacienteVacuna.belongsTo(MedicoVacuna, { foreignKey: 'id_vacuna', as: 'pacienteVacuna' })
	MedicoPacienteVacuna.hasMany(MedicoPacienteVacunaDosis, { foreignKey: 'id_paciente_vacuna', as: 'pacienteVacunaDosis' })
	MedicoPacienteVacunaDosis.belongsTo(MedicoPacienteVacuna, { foreignKey: 'id_paciente_vacuna', as: 'pacienteVacunaDosis' })



	GarzonPedidoRestaurante.belongsTo(Garzon, { foreignKey: 'id_garzon', as: 'garzon' });
	GarzonPedidoRestaurante.belongsTo(PedidoRestaurante, { foreignKey: 'id_pedido_restaurante', as: 'pedidoRestaurante' });

	PedidoRestaurante.hasMany(GarzonPedidoRestaurante, { foreignKey: 'id_pedido_restaurante', as: 'garzonesPedidoRestaurante' });
	PedidoRestaurante.hasMany(MesaPedidoRestaurante, { foreignKey: 'id_pedido_restaurante', as: 'mesasPedidoRestaurante' });
	PedidoRestaurante.hasMany(DetallePedidoRestaurante, { foreignKey: 'id_pedido_restaurante', as: 'detallesPedidoRestaurante' });

	MesaPedidoRestaurante.belongsTo(PedidoRestaurante, { foreignKey: 'id_pedido_restaurante', as: 'pedidoRestaurante' });
	MesaPedidoRestaurante.belongsTo(Mesa, { foreignKey: 'id_mesa', as: 'mesa' });

	Mesa.hasMany(MesaPedidoRestaurante, { foreignKey: 'id_mesa', as: 'pedidosRestaurante' });
	Mesa.belongsTo(Clase, { foreignKey: 'id_estado', as: 'estado' });
	Mesa.belongsTo(Sala, { foreignKey: 'id_sala', as: 'sala' });

	DetallePedidoRestaurante.belongsTo(PedidoRestaurante, { foreignKey: 'id_pedido_restaurante', as: 'pedidoRestaurante' });
	DetallePedidoRestaurante.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
	DetallePedidoRestaurante.hasMany(CuentaRestaurante, { foreignKey: 'id_detalle_pedido_restaurante', as: 'cuentasRestaurante' });

	CuentaRestaurante.belongsTo(DetallePedidoRestaurante, { foreignKey: 'id_detalle_pedido_restaurante', as: 'detallePedidoRestaurante' });

	Sala.hasMany(Mesa, { foreignKey: 'id_sala', as: 'mesas' });
	Sala.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });

	//Cotizaciones
	Cotizacion.hasMany(DetalleCotizacion, { foreignKey: 'id_cotizacion', as: 'detallesCotizacion' });
	Cotizacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
	Cotizacion.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });


	DetalleCotizacion.belongsTo(Cotizacion, { foreignKey: 'id_cotizacion', as: 'cotizacion' });
	DetalleCotizacion.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

	/// Contabilidad Cuentas
	ContabilidadCuenta.belongsTo(ClasificacionCuenta, { foreignKey: 'id_clasificacion', as: 'clasificacion' });
	ContabilidadCuenta.belongsTo(Clase, { foreignKey: 'id_tipo_cuenta', as: 'tipoCuenta' });
	ContabilidadCuenta.belongsTo(Clase, { foreignKey: 'id_calculo', as: 'claseCalculo' });
	ContabilidadCuenta.hasMany(AsientoContabilidad, { foreignKey: 'id_cuenta', as: 'cuenta' });

	ContabilidadCuenta.hasOne(ClienteCuenta, { foreignKey: 'id_cuenta', as: 'cuentaC' })
	ContabilidadCuenta.hasOne(ProveedorCuenta, { foreignKey: 'id_cuenta', as: 'cuentaP' })
	ContabilidadCuenta.hasMany(ConfiguracionCuenta, { foreignKey: 'id_cuenta', as: 'CuentaConfiguracion' })
	ContabilidadCuenta.hasMany(Producto, { foreignKey: 'id_cuenta', as: 'productos' })

	ClasificacionCuenta.belongsTo(Clase, { foreignKey: 'id_saldo', as: 'saldo' });
	ClasificacionCuenta.belongsTo(Clase, { foreignKey: 'id_movimiento', as: 'movimiento' });
	ClasificacionCuenta.hasMany(ContabilidadCuenta, { foreignKey: 'id_clasificacion', as: 'clasificacion' });

	ComprobanteContabilidad.hasMany(AsientoContabilidad, { foreignKey: 'id_comprobante', as: 'comprobante' })

	AsientoContabilidad.belongsTo(ComprobanteContabilidad, { foreignKey: 'id_comprobante', as: 'comprobante' })
	AsientoContabilidad.belongsTo(ContabilidadCuenta, { foreignKey: 'id_cuenta', as: 'cuentas' })

	ComprobanteContabilidad.belongsTo(Clase, { foreignKey: 'id_tipo', as: 'tipoComprobante' });
	ComprobanteContabilidad.belongsTo(Sucursal, { foreignKey: 'id_sucursal', as: 'sucursal' });
	ComprobanteContabilidad.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

	ClienteCuenta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
	ClienteCuenta.belongsTo(ContabilidadCuenta, { foreignKey: 'id_cuenta', as: 'cuenta' });

	ProveedorCuenta.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
	ProveedorCuenta.belongsTo(ContabilidadCuenta, { foreignKey: 'id_cuenta', as: 'cuenta' });


	ConfiguracionCuenta.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	ConfiguracionCuenta.belongsTo(Tipo, { foreignKey: 'id_tipo', as: 'tipo' });
	ConfiguracionCuenta.belongsTo(ContabilidadCuenta, { foreignKey: 'id_cuenta', as: 'cuenta' });

	VistaColumnasAplicacion.belongsTo(Empresa, { foreignKey: 'id_empresa', as: 'empresa' });
	VistaColumnasAplicacion.belongsTo(Aplicacion, { foreignKey: 'id_aplicacion', as: 'aplicacion' });

	MantenimientoOrdenTrabajo.hasMany(MantenimientoOrdenTrabajoManoObra, { foreignKey: 'id_orden_trabajo', as: 'manosDeObra' });
	MantenimientoOrdenTrabajo.hasMany(MantenimientoOrdenTrabajoMaterial, { foreignKey: 'id_orden_trabajo', as: 'materiales' });	
	MantenimientoOrdenTrabajo.hasMany(MantenimientoOrdenTrabajoServicioExterno, { foreignKey: 'id_orden_trabajo', as: 'serviciosExternos' });
	MantenimientoOrdenTrabajo.hasMany(MantenimientoOrdenTrabajoSistema, { foreignKey: 'id_orden_trabajo', as: 'sistemas' });
	MantenimientoOrdenTrabajo.belongsTo(Clase, { foreignKey: 'id_prioridad', as: 'Prioridad' });
	MantenimientoOrdenTrabajo.belongsTo(Clase, { foreignKey: 'id_tipo_mantenimiento', as: 'tipoMantenimiento' });
	MantenimientoOrdenTrabajo.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

	MantenimientoOrdenTrabajoManoObra.belongsTo(MantenimientoOrdenTrabajo, { foreignKey: 'id_orden_trabajo', as: 'ordenTrabajo' });
	MantenimientoOrdenTrabajoManoObra.belongsTo(Clase, { foreignKey: 'id_especialidad', as: 'especialidad' });
	MantenimientoOrdenTrabajoManoObra.belongsTo(Persona, { foreignKey: 'id_persona', as: 'encargado' });
	
	MantenimientoOrdenTrabajoMaterial.belongsTo(MantenimientoOrdenTrabajo, { foreignKey: 'id_orden_trabajo', as: 'ordenTrabajo' });
	MantenimientoOrdenTrabajoMaterial.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

	MantenimientoOrdenTrabajoServicioExterno.belongsTo(MantenimientoOrdenTrabajo, { foreignKey: 'id_orden_trabajo', as: 'ordenTrabajo' });


	MantenimientoOrdenTrabajoSistema.belongsTo(MantenimientoOrdenTrabajo, { foreignKey: 'id_orden_trabajo', as: 'ordenTrabajo' });
	MantenimientoOrdenTrabajoSistema.belongsTo(Clase, { foreignKey: 'id_orden_trabajo_sistema', as: 'ordenTrabajoSistema' });

	sequelize.sync();
}