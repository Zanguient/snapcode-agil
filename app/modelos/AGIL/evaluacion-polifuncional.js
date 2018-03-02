module.exports = function (sequelize, Sequelize) {
	var EvaluacionPolifuncional = sequelize.define('agil_evaluacion_polifuncional', {
		id_empleado: {
			type: Sequelize.INTEGER,
			field: 'empleado'
		},
		anio: {
			type: Sequelize.INTEGER,
			field: 'anio'
		},
		mes: {
			type: Sequelize.INTEGER,
			field: 'mes'
		},
		asistencia_capacitacion: {
			type: Sequelize.DECIMAL(20,4),
			field: 'capacitacion'
		},
		documentos_actualizados: {
			type: Sequelize.DECIMAL(20,4),
			field: 'documentos'
		},
		trabajo_equipo: {
			type: Sequelize.DECIMAL(20,4),
			field: 'equipo'
        },
        funciones_puntualidad: {
			type: Sequelize.DECIMAL(20,4),
			field: 'puntualidad'
        },
        higiene_personal: {
			type: Sequelize.DECIMAL(20,4),
			field: 'higiene'
        },
        asistencia_reunion: {
			type: Sequelize.DECIMAL(20,4),
			field: 'reunion'
		},
        ingreso_campo: {
			type: Sequelize.DECIMAL(20,4),
			field: 'ingreso'
        },
        llenado_formularios: {
			type: Sequelize.DECIMAL(20,4),
			field: 'formularios'
        },
        nota_total: {
			type: Sequelize.DECIMAL(20,4),
			field: 'total'
        },
        id_desempenio: {
			type: Sequelize.INTEGER,
			field: 'desempenio'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		  },
		  encargado: {
			type: Sequelize.BOOLEAN,
			field: 'encargado',
			default: false
			},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado',
			default: false
			}
	}, {
			freezeTableName: true
		});
	EvaluacionPolifuncional.sync().then(function () {
	});
	return EvaluacionPolifuncional;
}