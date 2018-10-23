module.exports = function (sequelize, Sequelize) {
	var ConfiguracionGeneralFactura = sequelize.define('agil_configuracion_general_factura', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		id_impresion_factura: {
			type: Sequelize.INTEGER,
			field: 'impresion_factura'
		},
		id_tipo_facturacion: {
			type: Sequelize.INTEGER,
			field: 'tipo_facturacion'
		},
		id_tamano_papel_factura: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_factura'
		},
		id_titulo_factura: {
			type: Sequelize.INTEGER,
			field: 'titulo_factura'
		},
		id_subtitulo_factura: {
			type: Sequelize.INTEGER,
			field: 'subtitulo_factura'
		},
		id_pie_factura: {
			type: Sequelize.INTEGER,
			field: 'pie_factura'
		},
		maximo_items: {
			type: Sequelize.INTEGER,
			field: 'maximo_items'
		},
		usar: {
			type: Sequelize.BOOLEAN,
			field: 'usar'
		},
		usar_pf: {
			type: Sequelize.BOOLEAN,
			field: 'usar_pf'
		},
		imprimir_al_guardar: {
			type: Sequelize.BOOLEAN,
			field: 'imprimir_al_guardar'
		},
		id_tamano_papel_nota_venta: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_nota_venta'
		},
		id_tamano_papel_factura_servicio: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_factura_servicio'
		},
		id_tamano_papel_nota_traspaso: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_nota_traspaso'
		},
		id_tamano_papel_nota_baja: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_nota_baja'
		},
		id_tamano_papel_nota_pedido: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_nota_pedido'
		},
		id_tamano_papel_cierre_caja: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_cierre_caja'
		},
		id_tamano_papel_cotizacion: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_cotizacion'
		},
		id_tamano_papel_despacho: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_despacho'
		},
		id_tamano_papel_farmacia: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_farmacia'
		},
		id_tamano_papel_ropa_trabajo: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_ropa_trabajo'
		},
		id_tamano_papel_caja_chica_ingreso: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_caja_chica_ingreso'
		},
		id_tamano_papel_caja_chica_egreso: {
			type: Sequelize.INTEGER,
			field: 'tamano_papel_caja_chica_egreso'
		},
		id_formato_papel_factura: {
			type: Sequelize.INTEGER,
			field: 'formato_papel_factura'
		},
		id_formato_color_factura: {
			type: Sequelize.INTEGER,
			field: 'formato_color_factura'
		},
		id_formato_papel_factura_servicio: {
			type: Sequelize.INTEGER,
			field: 'formato_papel_factura_servicio'
		},
		id_formato_color_factura_servicio: {
			type: Sequelize.INTEGER,
			field: 'formato_color_factura_servicio'
		},
		nota_factura_bien: {
			type: Sequelize.STRING,
			field: 'nota_factura_bien'
		},
		nota_factura_servicio: {
			type: Sequelize.STRING,
			field: 'nota_factura_servicio'
		},
		color_cabecera_factura: {
			type: Sequelize.STRING,
			field: 'color_cabecera_factura'
		},
		color_detalle_factura: {
			type: Sequelize.STRING,
			field: 'color_detalle_factura'
		},
		color_cabecera_factura_servicio: {
			type: Sequelize.STRING,
			field: 'color_cabecera_factura_servicio'
		},
		color_detalle_factura_servicio: {
			type: Sequelize.STRING,
			field: 'color_detalle_factura_servicio'
		},id_tipo_configuracion: {
			type: Sequelize.INTEGER,
			field: 'tipo_configuracion'
		},
		id_formato_papel_nota_venta: {
			type: Sequelize.INTEGER,
			field: 'formato_papel_nota_venta'
		},
		id_formato_color_nota_venta: {
			type: Sequelize.INTEGER,
			field: 'formato_color_nota_venta'
		},
		nota_factura_nota_venta: {
			type: Sequelize.STRING,
			field: 'nota_factura_nota_venta'
		},
		color_cabecera_nota_venta: {
			type: Sequelize.STRING,
			field: 'color_cabecera_nota_venta'
		},
		color_detalle_nota_venta: {
			type: Sequelize.STRING,
			field: 'color_detalle_nota_venta'
		},
		id_tipo_configuracion_nota_venta: {
			type: Sequelize.INTEGER,
			field: 'tipo_configuracion_nota_venta'
		},

		
		id_formato_papel_nota_traspaso: {
			type: Sequelize.INTEGER,
			field: 'formato_papel_nota_traspaso'
		},
		id_formato_color_nota_traspaso: {
			type: Sequelize.INTEGER,
			field: 'formato_color_nota_traspaso'
		},
		nota_factura_nota_traspaso: {
			type: Sequelize.STRING,
			field: 'nota_factura_nota_traspaso'
		},
		color_cabecera_nota_traspaso: {
			type: Sequelize.STRING,
			field: 'color_cabecera_nota_traspaso'
		},
		color_detalle_nota_traspaso: {
			type: Sequelize.STRING,
			field: 'color_detalle_nota_traspaso'
		},
		
		id_formato_papel_nota_baja: {
			type: Sequelize.INTEGER,
			field: 'formato_papel_nota_baja'
		},
		id_formato_color_nota_baja: {
			type: Sequelize.INTEGER,
			field: 'formato_color_nota_baja'
		},
		nota_factura_nota_baja: {
			type: Sequelize.STRING,
			field: 'nota_factura_nota_baja'
		},
		color_cabecera_nota_baja: {
			type: Sequelize.STRING,
			field: 'color_cabecera_nota_baja'
		},
		color_detalle_nota_baja: {
			type: Sequelize.STRING,
			field: 'color_detalle_nota_baja'
		},
		id_tipo_configuracion_nota_baja: {
			type: Sequelize.INTEGER,
			field: 'tipo_configuracion_nota_baja'
		}
		
	}, {
			freezeTableName: true
		});

	ConfiguracionGeneralFactura.sync().then(function () {

	});

	return ConfiguracionGeneralFactura;
}


