module.exports = function (sequelize, Sequelize) {
	var ProductoTipoPrecio = sequelize.define('agil_producto_tipo_precio', {
		id_producto: {
			type: Sequelize.INTEGER,
			field: 'producto'
		},
		id_tipo_precio: {
			type: Sequelize.INTEGER,
			field: 'tipo_precio'
		},
		precio_unitario: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'precio_unitario'
		},
		rango_positivo: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'rango_positivo'
		},
		rango_negativo: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'rango_negativo'
		},
		eliminado:{
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		}
	}, {
			freezeTableName: true
		});

	ProductoTipoPrecio.sync().then(function () {

	});

	return ProductoTipoPrecio;
}