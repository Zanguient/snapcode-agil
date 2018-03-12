module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoHorasExtra = sequelize.define('agil_rrhh_empleado_horas_extra', {
	/* 	id_empleado: {
			type: Sequelize.INTEGER,
			field: 'empleado'
		}, */
		id_ficha: {
			type: Sequelize.INTEGER,
			field: 'ficha'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		},
		hora_inicio: {
			type: Sequelize.TIME,
			field: 'hora_inicio'
		},
		hora_fin: {
			type: Sequelize.TIME,
			field: 'hora_fin'
		},
		tiempo: {
			type: Sequelize.TIME,
			field: 'tiempo'
		},
		observacion: {
			type: Sequelize.STRING,
			field: 'observacion'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		}

	}, {
			freezeTableName: true
		});

	RrhhEmpleadoHorasExtra.sync().then(function () {

	});

	return RrhhEmpleadoHorasExtra;
}
