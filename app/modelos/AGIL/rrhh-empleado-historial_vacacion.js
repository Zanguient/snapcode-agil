module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoHistorialVacacion = sequelize.define('agil_rrhh_empleado_historial_vacacion', {
		id_empleado: {
			type: Sequelize.INTEGER,
			field: 'empleado'
		},
		gestion: {
			type: Sequelize.INTEGER,
			field: 'gestion'
		},
		anio: {
			type: Sequelize.INTEGER,
			field: 'anio'
		},
		aplicadas: {
			type: Sequelize.INTEGER,
			field: 'aplicadas'
		},
		tomadas: {
			type: Sequelize.INTEGER,
			field: 'tomadas'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		}
	}, {
			freezeTableName: true
		});
		RrhhEmpleadoHistorialVacacion.sync().then(function () {
	});
	return RrhhEmpleadoHistorialVacacion;
}