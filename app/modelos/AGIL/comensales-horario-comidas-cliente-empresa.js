module.exports = function (sequelize, Sequelize) {
	var HorarioComidasClienteEmpresa = sequelize.define('agil_comensales_horario_comidas_cliente_empresa', {
		nombre: {
			type: Sequelize.STRING,
			field: 'nombre'
		},
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
		inicio: {
			type: Sequelize.TIME,
			field: 'inicio'
		},
		final: {
			type: Sequelize.TIME,
			field: 'final'
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

	HorarioComidasClienteEmpresa.sync().then(function () {

	});
	return HorarioComidasClienteEmpresa;
}