module.exports = function (sequelize, Sequelize) {
	var Inventario = sequelize.define('inv_inventario', {
		id_almacen: {
			type: Sequelize.INTEGER,
			field: 'almacen'
		},
		id_producto: {
			type: Sequelize.INTEGER,
			field: 'producto'
		},
		cantidad: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'cantidad'
		},
		costo_unitario: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'costo_unitario'
		},
		costo_unitario_dolares: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'costo_unitario_dolares'
		},
		costo_total: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'costo_total'
		},
		costo_total_dolares: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'costo_total_dolares'
		},
		fecha_vencimiento: {
			type: Sequelize.DATE,
			field: 'fecha_vencimiento'
		},
		lote: {
			type: Sequelize.STRING,
			field: 'lote'
		}
	}, {
			freezeTableName: true
		});

	Inventario.sync().then(function () {

	});

	return Inventario;
}