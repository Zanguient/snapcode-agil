module.exports = function (sequelize, Sequelize) {
	var ConfiguracionDesempenioEvaluacionPolifuncional = sequelize.define('agil_configuracion_desempenio_evaluacion', {
		id_empresa:{
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		nombre:{
			type: Sequelize.STRING,
			field: 'nombre'
		},
		desde:{
			type: Sequelize.DECIMAL(20,4),
			field: 'desde'
		},
		hasta:{
			type: Sequelize.DECIMAL(20,4),
			field: 'hasta'
		},
		color:{
			type: Sequelize.STRING,
			field: 'color'
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