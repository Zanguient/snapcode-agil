module.exports = function (sequelize, Sequelize) {
	var PrecioComidasClienteEmpresa = sequelize.define('agil_comensales_precio_comidas_cliente_empresa', {
		id_comida: {
			type: Sequelize.INTEGER,
			field: 'comida'
		},
		codigo: {
			type: Sequelize.STRING,
			field: 'codigo'
		},
		id_cliente: {
			type: Sequelize.INTEGER,
			field: 'cliente'
		},
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		precio: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'precio'
		},
		habilitado: {
			type: Sequelize.BOOLEAN,
			field: 'habilitado',
			defaultValue: true
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado',
			defaultValue: false
		}
	}, {
			freezeTableName: true
		});

	PrecioComidasClienteEmpresa.sync().then(function () {

	});
	return PrecioComidasClienteEmpresa;
}