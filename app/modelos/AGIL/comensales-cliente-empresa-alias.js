module.exports = function (sequelize, Sequelize) {
	var AliasClienteEmpresa = sequelize.define('agil_comensales_alias_cliente_empresa', {
		id_cliente: {
			type: Sequelize.INTEGER,
			field: 'cliente'
		},
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

	AliasClienteEmpresa.sync().then(function () {

	});

	return AliasClienteEmpresa;
}