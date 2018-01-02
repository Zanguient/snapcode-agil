module.exports = function (sequelize, Sequelize) {
	var DetalleSolicitudProductoBase = sequelize.define('inv_detalle_solicitud_producto_base', {
		id_detalle_solicitud_producto: {
			type: Sequelize.INTEGER,
			field: 'detalle_solicitud_producto'
		},
		id_producto_base: {
			type: Sequelize.INTEGER,
			field: 'producto_base'
		},
		cantidad_ideal: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'cantidad_ideal'
		},
		cantidad_real: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'cantidad_real'
		}
	}, {
			freezeTableName: true
		});
	DetalleSolicitudProductoBase.sync().then(function () {
	});
	return DetalleSolicitudProductoBase;
}