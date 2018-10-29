module.exports = function (sequelize, Sequelize) {
	var Compra = sequelize.define('inv_compra', {
		id_almacen: {
			type: Sequelize.INTEGER,
			field: 'almacen'
		},
		id_sucursal: {
			type: Sequelize.INTEGER,
			field: 'sucursal'
		},
		id_tipo_movimiento: {
			type: Sequelize.INTEGER,
			field: 'tipo_movimiento'
		},
		id_proveedor: {
			type: Sequelize.INTEGER,
			field: 'proveedor'
		},
		id_movimiento: {
			type: Sequelize.INTEGER,
			field: 'movimiento'
		},
		factura: {
			type: Sequelize.BIGINT,
			field: 'factura'
		},
		autorizacion: {
			type: Sequelize.BIGINT,
			field: 'autorizacion'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		},
		codigo_control: {
			type: Sequelize.STRING,
			field: 'codigo_control'
		},
		importe: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'importe'
		},
		importe_dolares: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'importe_dolares'
		},
		id_tipo_pago: {
			type: Sequelize.INTEGER,
			field: 'tipo_pago'
		},
		dias_credito: {
			type: Sequelize.INTEGER,
			field: 'dias_credito'
		},
		a_cuenta: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'a_cuenta'
		},
		saldo: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'saldo'
		},
		descuento_general: {
			type: Sequelize.BOOLEAN,
			field: 'descuento_general'
		},
		descuento: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'descuento'
		},
		recargo: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'recargo'
		},
		ice: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'ice'
		},
		excento: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'excento'
		},
		tipo_descuento: {
			type: Sequelize.BOOLEAN,
			field: 'tipo_descuento'
		},
		tipo_recargo: {
			type: Sequelize.BOOLEAN,
			field: 'tipo_recargo'
		},
		total: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total'
		},
		total_dolares: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total_dolares'
		},
		id_cierre_caja: {
			type: Sequelize.INTEGER,
			field: 'cierre_caja'
		},
		id_usuario: {
			type: Sequelize.INTEGER,
			field: 'usuario'
		},
		contabilizado: {
			type: Sequelize.BOOLEAN,
			field: 'contabilizado',
			defaultValue: false,
		},
		usar_producto: {
			type: Sequelize.BOOLEAN,
			field: 'usar_producto',
		},
		observacion: {
			type: Sequelize.STRING,
			field: 'observacion',
		},
		dui: {
			type: Sequelize.STRING,
			field: 'dui',
		},
		tipo_retencion: {
			type: Sequelize.BOOLEAN,
			field: 'tipo_retencion',
		},

	}, {
			freezeTableName: true
		});

	Compra.sync().then(function () {

	});

	return Compra;
}