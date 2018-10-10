module.exports = function (sequelize, Sequelize) {
	var Empresa = sequelize.define('agil_empresa', {
		razon_social: {
			type: Sequelize.STRING,
			field: 'razon_social'
		},
		nit: {
			type: Sequelize.STRING,
			field: 'nit'
		},
		imagen: {
			type: Sequelize.STRING,
			field: 'imagen'
		},
		direccion: {
			type: Sequelize.STRING,
			field: 'direccion'
		},
		telefono1: {
			type: Sequelize.STRING,
			field: 'telefono1'
		},
		telefono2: {
			type: Sequelize.STRING,
			field: 'telefono2'
		},
		telefono3: {
			type: Sequelize.STRING,
			field: 'telefono3'
		},
		id_departamento: {
			type: Sequelize.INTEGER,
			field: 'departamento'
		},
		id_municipio: {
			type: Sequelize.INTEGER,
			field: 'municipio'
		},
		usar_panel: {
			type: Sequelize.BOOLEAN,
			field: 'usar_panel'
		},
		usar_vencimientos: {
			type: Sequelize.BOOLEAN,
			field: 'usar_vencimientos'
		},
		usar_servicios: {
			type: Sequelize.BOOLEAN,
			field: 'usar_servicios'
		},
		usar_consumos: {
			type: Sequelize.BOOLEAN,
			field: 'usar_consumos'
		},
		usar_descuentos: {
			type: Sequelize.BOOLEAN,
			field: 'usar_descuentos'
		},
		usar_georeferenciacion: {
			type: Sequelize.BOOLEAN,
			field: 'usar_georeferenciacion'
		},
		usar_pedidos: {
			type: Sequelize.BOOLEAN,
			field: 'usar_pedidos'
		},
		usar_pantalla_cliente: {
			type: Sequelize.BOOLEAN,
			field: 'usar_pantalla_cliente'
		},
		usar_pantalla_despacho: {
			type: Sequelize.BOOLEAN,
			field: 'usar_pantalla_despacho'
		},
		usar_mesas: {
			type: Sequelize.BOOLEAN,
			field: 'usar_mesas'
		},
		usar_salas: {
			type: Sequelize.BOOLEAN,
			field: 'usar_salas'
		},
		usar_contabilidad: {
			type: Sequelize.BOOLEAN,
			field: 'usar_contabilidad'
		},
		usar_medico: {
			type: Sequelize.BOOLEAN,
			field: 'usar_medico'
		},
		usar_mantenimiento: {
			type: Sequelize.BOOLEAN,
			field: 'usar_mantenimiento'
		},
		usar_cuentas_auxiliares: {
			type: Sequelize.BOOLEAN,
			field: 'usar_cuentas_auxiliares'
		},
		usar_proformas: {
			type: Sequelize.BOOLEAN,
			field: 'usar_proforma'
		},
		usar_creditos: {
			type: Sequelize.BOOLEAN,
			field: 'usar_creditos'
		},
		usar_destinos: {
			type: Sequelize.BOOLEAN,
			field: 'usar_destinos'
		},
		usar_razon_social: {
			type: Sequelize.BOOLEAN,
			field: 'usar_razon_social'
		},
		usar_correlativos_clientes: {
			type: Sequelize.BOOLEAN,
			field: 'usar_correlativos_clientes'
		},
		usar_correlativos_destinos: {
			type: Sequelize.BOOLEAN,
			field: 'usar_correlativos_destinos'
		},
		usar_funciones_erp: {
			type: Sequelize.BOOLEAN,
			field: 'usar_funciones_erp'
		},
		usar_estado_resultados_no_contables: {
			type: Sequelize.BOOLEAN,
			field: 'usar_estado_resultados_no_contables'
		},
		usar_peps: {
			type: Sequelize.BOOLEAN,
			field: 'usar_peps',
			default: true
		},
		usar_edicion_venta:{
			type: Sequelize.BOOLEAN,
			field: 'usar_edicion_venta'
		},
		usar_venta_servicio:{
			type: Sequelize.BOOLEAN,
			field: 'usar_venta_servicio'
		},
		usar_facturacion_masiva:{
			type: Sequelize.BOOLEAN,
			field: 'usar_facturacion_masiva'
		},
		usar_cotizacion:{
			type: Sequelize.BOOLEAN,
			field: 'usar_cotizacion'
		},
		usar_tipo_precio:{
			type: Sequelize.BOOLEAN,
			field: 'usar_tipo_precio'
		},
		usar_pago_anticipado:{
			type: Sequelize.BOOLEAN,
			field: 'usar_pago_anticipado'
		},
		usar_ceros_plan_cuenta:{
			type: Sequelize.BOOLEAN,
			field: 'usar_ceros_plan_cuenta'
		},
		usar_importacion_compra:{
			type: Sequelize.BOOLEAN,
			field: 'usar_importacion_compra'
		},
		usar_importacion_venta:{
			type: Sequelize.BOOLEAN,
			field: 'usar_importacion_venta'
		}
	}, {
			freezeTableName: true
		});

	Empresa.sync().then(function () {

	});

	return Empresa;
}