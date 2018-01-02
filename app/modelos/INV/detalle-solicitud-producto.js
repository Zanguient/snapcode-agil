module.exports = function (sequelize, Sequelize) {
	var DetalleSolicitudProducto = sequelize.define('inv_detalle_solicitud_producto', {
		id_solicitud: {
			type: Sequelize.INTEGER,
			field: 'solicitud'
		},
		id_producto: {
			type: Sequelize.INTEGER,
			field: 'producto'
		},
		cantidad: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'cantidad'
		}
	}, {
			freezeTableName: true
		});

	DetalleSolicitudProducto.sync().then(function () {

	});

	return DetalleSolicitudProducto;
}