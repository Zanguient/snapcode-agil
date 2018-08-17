module.exports = function (sequelize, Sequelize) {
	var Usuario = sequelize.define('sys_usuario', {
		id_persona: {
			type: Sequelize.INTEGER,
			field: 'persona'
		},
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		nombre_usuario: {
			type: Sequelize.STRING,
			field: 'nombre_usuario'
		},
		clave: {
			type: Sequelize.STRING,
			field: 'clave'
		},
		token: {
			type: Sequelize.TEXT,
			field: 'token'
		},
		activo: {
			type: Sequelize.BOOLEAN,
			field: 'activo'
		},
		comision_general: {
			type: Sequelize.INTEGER,
			field: 'comision_general'
		},
		comision_activa: {
			type: Sequelize.BOOLEAN,
			field: 'comision_activa'
		},
		usar_lector_de_barra: {
			type: Sequelize.BOOLEAN,
			field: 'usar_lector_de_barra'
		},
		autorizacion_caja_chica: {
			type: Sequelize.BOOLEAN,
			field: 'autorizacion_caja_chica'
		},
		encargado_caja_chica: {
			type: Sequelize.BOOLEAN,
			field: 'encargado_caja_chica'
		},
	}, {
			freezeTableName: true
		});

	Usuario.sync().then(function () {
		sequelize.query("INSERT IGNORE INTO sys_usuario SET id = 1,persona=1,nombre_usuario='superadmin',clave='b5933b1e3c4023774366da04a515ef37',activo=1,token='b5933b1e3c4023774366da04a515ef37',createdAt = NOW(),updatedAt = NOW();").spread(function (results, metadata) {

		});
	});

	return Usuario;
}