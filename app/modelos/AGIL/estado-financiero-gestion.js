module.exports = function (sequelize, Sequelize) {
	var EstadoFinancieroGestion = sequelize.define('agil_estado_financiero_gestion', {
		id_tipo: {
			type: Sequelize.INTEGER,
			field: 'tipo'
		},
		inicio: {
			type: Sequelize.STRING,
			field: 'inicio'
		},
		fin: {
			type: Sequelize.STRING,
			field: 'fin'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
		habilitado: {
			type: Sequelize.BOOLEAN,
			field: 'habilitado'
		}
	}, {
			freezeTableName: true
		});

	EstadoFinancieroGestion.sync().then(function () {

	});

	return EstadoFinancieroGestion;
}