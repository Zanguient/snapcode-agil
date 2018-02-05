module.exports = function (sequelize, Sequelize) {
	var ClienteRazon = sequelize.define('agil_cliente_razon', {
		id_cliente: {
			type: Sequelize.INTEGER,
			field: 'cliente'
		},
		razon_social: {
			type: Sequelize.STRING,
			field: 'razon_social'
		},
		nit: {
			type: Sequelize.BIGINT,
			field: 'nit'
		},
		codigo_sap: {
			type: Sequelize.STRING,
			field: 'codigo_sap'
		}
	}, {
			freezeTableName: true
		});

	ClienteRazon.sync();

	return ClienteRazon;
}