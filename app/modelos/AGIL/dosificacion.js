module.exports = function (sequelize, Sequelize) {
	var Dosificacion = sequelize.define('agil_dosificacion', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		autorizacion: {
			type: Sequelize.BIGINT,
			field: 'autorizacion'
		},
		correlativo: {
			type: Sequelize.INTEGER,
			field: 'correlativo'
		},
		fecha_limite_emision: {
			type: Sequelize.DATE,
			field: 'fecha_limite_emision'
		},
		llave_digital: {
			type: Sequelize.STRING,
			field: 'llave_digital'
		},
		id_pie_factura: {
			type: Sequelize.INTEGER,
			field: 'pie_factura'
		},
		expirado: {
			type: Sequelize.BOOLEAN,
			field: 'expirado'
		},
		tipo_dosificacion: {
			type: Sequelize.BOOLEAN,
			field: 'tipo_dosificacion'
		}
	}, {
			freezeTableName: true
		});

	Dosificacion.sync().then(function () {

	});

	return Dosificacion;
}