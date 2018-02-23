module.exports = function (sequelize, Sequelize) {
	var ConfiguracionDesempenioEvaluacionPolifuncional = sequelize.define('agil_configuracion_desempenio_evaluacion', {
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
			field: 'formularioss'
		},
		nota_total: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total'
		},
		para_empleados: {
			type: Sequelize.BOOLEAN,
			field: 'para_empleados'
		},
		para_encargados: {
			type: Sequelize.BOOLEAN,
			field: 'para_encargados'
		},
		activo: {
			type: Sequelize.BOOLEAN,
			field: 'activo'
		}
	}, {
			freezeTableName: true
		});
	ConfiguracionDesempenioEvaluacionPolifuncional.sync().then(function () {
	});
	return ConfiguracionDesempenioEvaluacionPolifuncional;
}