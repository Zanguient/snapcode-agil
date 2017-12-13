module.exports = function (sequelize, Sequelize) {
	var MedicoPaciente = sequelize.define('agil_medico_paciente', {
		id_persona: {
			type: Sequelize.INTEGER,
			field: 'persona'
		},
		codigo: {
			type: Sequelize.STRING,
			field: 'codigo'
		},
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		extension: {
			type: Sequelize.STRING,
			field: 'extension'
		},
		grupo_sanguineo: {
			type: Sequelize.STRING,
			field: 'grupo_sanguineo'
		},
		cargo: {
			type: Sequelize.STRING,
			field: 'cargo'
		},
		campo: {
			type: Sequelize.STRING,
			field: 'campo'
		},
		designacion_empresa: {
			type: Sequelize.STRING,
			field: 'designacion_empresa'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
		comentario: {
			type: Sequelize.STRING,
			field: 'comentario'
		},
		es_empleado: {
			type: Sequelize.BOOLEAN,
			field: 'es_empleado'
		},
	}, {
			freezeTableName: true
		});

	MedicoPaciente.sync().then(function () {

	});

	return MedicoPaciente;
}