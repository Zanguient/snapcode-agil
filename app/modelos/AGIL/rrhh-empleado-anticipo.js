
module.exports = function (sequelize, Sequelize) {
	var RrhhAnticipo = sequelize.define('agil_rrhh_empleado_anticipo', {
		id_empleado: {
			type: Sequelize.INTEGER,
			field: 'empleado'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		},
		monto: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'monto'
		},
		id_tipo: {
			type: Sequelize.INTEGER,
			field: 'tipo'
		},
		total: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
		entregado: {
			type: Sequelize.BOOLEAN,
			field: 'entregado',
			defaultValue: false
		},
		tope: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'tope'
		},
		salario_basico:{
			type: Sequelize.DECIMAL(20, 4),
			field: 'salario_basico'
		},
		tipo_porcentual: {
			type: Sequelize.BOOLEAN,
			field: 'tipo_porcentual'
		},
		porcentaje: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'porcentaje'
		},
	}, {
			freezeTableName: true
		});

	RrhhAnticipo.sync().then(function () {

	});

	return RrhhAnticipo;
}