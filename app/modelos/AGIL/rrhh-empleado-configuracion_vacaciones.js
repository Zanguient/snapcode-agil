module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoConfiguracionVacacion = sequelize.define('agil_rrhh_empleado_configuracion_vacacion', {
		desde: {
			type: Sequelize.INTEGER,
			field: 'desde'
		},
		hasta: {
			type: Sequelize.INTEGER,
			field: 'hasta'
		},
		dias: {
			type: Sequelize.INTEGER,
			field: 'dias'
		}
	}, {
			freezeTableName: true
		});

	RrhhEmpleadoConfiguracionVacacion.sync().then(function () {
		sequelize.query("INSERT IGNORE INTO agil_rrhh_empleado_configuracion_vacacion SET id = 1,desde = 1,hasta=5,dias=15,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO agil_rrhh_empleado_configuracion_vacacion SET id = 2,desde = 5,hasta=10,dias=20,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
		sequelize.query("INSERT IGNORE INTO agil_rrhh_empleado_configuracion_vacacion SET id = 3,desde = 10,hasta=9999,dias=30,createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
	});

	return RrhhEmpleadoConfiguracionVacacion;
}