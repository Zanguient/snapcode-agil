module.exports = function (sequelize, Sequelize) {
	var MantenimientoOrdenTrabajoMaterial = sequelize.define('agil_mantenimiento_orden_trabajo_material', {
		id_orden_trabajo: {
			type: Sequelize.INTEGER,
			field: 'orden_trabajo'
		},
		id_producto: {
			type: Sequelize.INTEGER,
			field: 'id_producto'
		},
		cantidad: {
			type: Sequelize.INTEGER,
			field: 'cantidad'
		},
		importe: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'importe'
		},
	}, {
			freezeTableName: true
		});

	MantenimientoOrdenTrabajoMaterial.sync().then(function () {

	});

	return MantenimientoOrdenTrabajoMaterial;
}