module.exports = function (sequelize, Sequelize) {
	var ContabilidadConfiguracionGeneralTipoCuenta = sequelize.define('agil_contabilidad_configuracion_general_tipo_cuenta', {
		id_tipo_cuenta: {
			type: Sequelize.INTEGER,
			field: 'tipo_cuenta'
		},
		digitos: {
			type: Sequelize.INTEGER,
			field: 'digitos'
		},
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},

	}, {
			freezeTableName: true
		});

	ContabilidadConfiguracionGeneralTipoCuenta.sync().then(function () {


	});

	return ContabilidadConfiguracionGeneralTipoCuenta;
}