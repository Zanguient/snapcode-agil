module.exports = function (sequelize, Sequelize) {
	var GtmEstibaje = sequelize.define('agil_gtm_estibaje', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		codigo: {
			type: Sequelize.STRING,
			field: 'codigo'
		},
		nombre: {
			type: Sequelize.STRING,
			field: 'nombre'
		},
		descripcion: {
			type: Sequelize.STRING,
			field: 'descripcion'
		},
		costo: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'costo'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
		activo: {
			type: Sequelize.BOOLEAN,
			field: 'activo'
		}
	}, {
			freezeTableName: true
		});

	GtmEstibaje.sync();

	return GtmEstibaje;
}