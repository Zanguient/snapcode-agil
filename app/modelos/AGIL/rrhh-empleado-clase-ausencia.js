module.exports = function (sequelize, Sequelize) {
	var RrhhClaseAsuencia = sequelize.define('agil_rrhh_clase_ausencia', {
		nombre: {
			type: Sequelize.STRING,
			field: 'nombre'
		},
		id_tipo: {
			type: Sequelize.INTEGER,
			field: 'tipo'
		},
		porcentaje: {
			type: Sequelize.INTEGER,
			field: 'porcentaje'
		},
		dias_descuento: {
			type: Sequelize.INTEGER,
			field: 'dias_descuento'
		},
		habilitado: {
			type: Sequelize.BOOLEAN,
			field: 'habilitado'
		},
	}, {
			freezeTableName: true
		});

	RrhhClaseAsuencia.sync().then(function () {

	});

	return RrhhClaseAsuencia;
}