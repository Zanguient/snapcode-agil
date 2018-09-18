module.exports = function (sequelize, Sequelize) {
	var GerenciasClienteEmpresa = sequelize.define('agil_comensales_gerencias_cliente_empresa', {
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
		identificador_equipo: {
			type: Sequelize.STRING,
			field: 'identificador_equipo'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado',
			defaultValue: false
		},
	}, {
			freezeTableName: true
		});

	GerenciasClienteEmpresa.sync().then(function () {
		
	});
	return GerenciasClienteEmpresa;
}