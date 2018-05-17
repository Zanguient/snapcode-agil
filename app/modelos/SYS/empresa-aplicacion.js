module.exports = function (sequelize, Sequelize) {
	var EmpresaAplicacion = sequelize.define('sys_empresa_aplicacion', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		id_aplicacion: {
			type: Sequelize.INTEGER,
			field: 'aplicacion'
		}
		
	}, {
			freezeTableName: true
		});

		EmpresaAplicacion.sync().then(function () {
		
	});

	return EmpresaAplicacion;
}