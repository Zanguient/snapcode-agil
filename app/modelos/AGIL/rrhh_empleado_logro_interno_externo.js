module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoLogroInternoExterno = sequelize.define('agil_rrhh_empleado_logro_interno_externo', {
		id_hoja_vida: {
			type: Sequelize.INTEGER,
			field: 'hoja_vida'
		},
		id_tipo_logro: {
			type: Sequelize.INTEGER,
			field: 'tipo_logro'
		},
		motivo: {
			type: Sequelize.STRING,
			field: 'motivo'
		},
		institucion: {
			type: Sequelize.STRING,
			field: 'institucion'
		},
		observacion: {
			type: Sequelize.STRING,
			field: 'observacion'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		},

	}, {
			freezeTableName: true
		});

	RrhhEmpleadoLogroInternoExterno.sync().then(function () {

	});

	return RrhhEmpleadoLogroInternoExterno;
}