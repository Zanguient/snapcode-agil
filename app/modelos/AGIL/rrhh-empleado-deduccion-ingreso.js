module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoDeduccionIngreso = sequelize.define('agil_rrhh_empleado_deduccion_ingreso', {
		id_beneficio: {
			type: Sequelize.INTEGER,
			field: 'beneficio'
		},
		monto: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'monto'
		},
		motivo: {
			type: Sequelize.STRING,
			field: 'motivo'
		},
		id_tipo: {
			type: Sequelize.INTEGER,
			field: 'tipo'
		},		
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
	}, {
			freezeTableName: true
		});

	RrhhEmpleadoDeduccionIngreso.sync().then(function () {

	});

	return RrhhEmpleadoDeduccionIngreso;
}