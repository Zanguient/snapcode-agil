module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoDescuentoVacacionHistorial = sequelize.define('agil_rrhh_empleado_descuento_vacacion_historial', {
		id_vacacion: {
			type: Sequelize.INTEGER,
			field: 'id_vacacion'
		},
		id_historial_vacacion: {
			type: Sequelize.INTEGER,
			field: 'id_historial_vacacion'
		}
	}, {
			freezeTableName: true
		});

		RrhhEmpleadoDescuentoVacacionHistorial.sync().then(function () {

	});

	return RrhhEmpleadoDescuentoVacacionHistorial;
}