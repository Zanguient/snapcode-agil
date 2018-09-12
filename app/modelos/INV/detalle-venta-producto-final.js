module.exports = function (sequelize, Sequelize) {
	var DetalleVentaProductoFinal = sequelize.define('inv_detalle_venta_producto_final', {
		id_detalle_venta: {
			type: Sequelize.INTEGER,
			field: 'detalle_venta'
		},
		id_detalle_movimiento: {
			type: Sequelize.INTEGER,
			field: 'detalle_movimiento'
		},
		
	}, {
			freezeTableName: true
		});

	DetalleVentaProductoFinal.sync();

	return DetalleVentaProductoFinal;
}