module.exports = function (sequelize, Sequelize) {
	var DetalleCompra = sequelize.define('inv_detalle_compra', {
		id_compra: {
			type: Sequelize.INTEGER,
			field: 'compra'
		},
		id_producto: {
			type: Sequelize.INTEGER,
			field: 'producto'
		},
		id_centro_costo: {
			type: Sequelize.INTEGER,
			field: 'centro_costo'
		},
		costo_unitario: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'costo_unitario'
		},
		costo_unitario_dolares: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'costo_unitario_dolares'
		},
		cantidad: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'cantidad'
		},
		importe: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'importe'
		},
		importe_dolares: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'importe_dolares'
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
		id_inventario: {
			type: Sequelize.INTEGER,
			field: 'inventario'
		},
		it: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'it'
		},
		iue: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'iue'
		},
		id_servicio: {
			type: Sequelize.INTEGER,
			field: 'servicio'
		}
	}, {
			freezeTableName: true
		});

	DetalleCompra.sync();

	return DetalleCompra;
}