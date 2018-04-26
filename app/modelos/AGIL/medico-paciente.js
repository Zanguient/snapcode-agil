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
		id_extension: {
			type: Sequelize.INTEGER,
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
		id_campo: {
			type: Sequelize.INTEGER,
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
		fecha_vence_documento: {
			type: Sequelize.DATE,
			field: 'fecha_vence_documento'
		},
		id_tipo_documento: {
			type: Sequelize.INTEGER,
			field: 'tipo_documento'
		},		
		chofer: {
			type: Sequelize.BOOLEAN,
			field: 'chofer'
		}
	}, {
			freezeTableName: true
		});

	MedicoPaciente.sync().then(function () {

	});

	return MedicoPaciente;
}