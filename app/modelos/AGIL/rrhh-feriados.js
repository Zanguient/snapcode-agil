module.exports = function (sequelize, Sequelize) {
	var RrhhFeriado = sequelize.define('agil_rrhh_feriado', {
		fecha_inicio: {
			type: Sequelize.DATE,
			field: 'fecha_inicio'
		},
		fecha_fin: {
			type: Sequelize.DATE,
			field: 'fecha_fin'
		},
		id_empresa:{
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
	}, {
			freezeTableName: true
		});

	RrhhFeriado.sync().then(function () {

	});

	return RrhhFeriado;
}