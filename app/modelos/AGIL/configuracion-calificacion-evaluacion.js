module.exports = function (sequelize, Sequelize) {
	var ConfiguracionCalificacionEvaluacionPolifuncional = sequelize.define('agil_configuracion_calificacion_evaluacion', {
		id_empresa:{
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		asistencia_capacitacion: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'capacitacion'
		},
		documentos_actualizados: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'documentos'
		},
		trabajo_equipo: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'equipo'
		},
		funciones_puntualidad: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'puntualidad'
		},
		higiene_personal: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'higiene'
		},
		asistencia_reunion: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'reunion'
		},
		ingreso_campo: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'ingreso'
		},
		llenado_formularios: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'formularios'
		},
		nota_total: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total'
		},
		encargados: {
			type: Sequelize.BOOLEAN,
			field: 'encargado',
			defaultValue: false
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado',
			defaultValue: false
		}
	}, {
			freezeTableName: true
		});
	ConfiguracionCalificacionEvaluacionPolifuncional.sync().then(function () {
	});
	return ConfiguracionCalificacionEvaluacionPolifuncional;
}