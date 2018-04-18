module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoFichaFamiliar = sequelize.define('agil_rrhh_empleado_ficha_familiar', {
		id_empleado: {
			type: Sequelize.INTEGER,
			field: 'empleado'
		},
		id_persona_familiar: {
			type: Sequelize.INTEGER,
			field: 'familiar'
		},
		id_relacion: {
			type: Sequelize.INTEGER,
			field: 'relacion'
		},
		afiliado: {
			type: Sequelize.BOOLEAN,
			field: 'afiliado'
		},
		referencia:{
			type: Sequelize.STRING,
			field: 'referencia'
		}
	}, {
			freezeTableName: true
		});

	RrhhEmpleadoFichaFamiliar.sync().then(function () {

	});

	return RrhhEmpleadoFichaFamiliar;
}