module.exports = function (sequelize, Sequelize) {
	var RrhhEmpleadoBeneficioSocial = sequelize.define('agil_rrhh_empleado_beneficio_social', {
		id_ficha: {
			type: Sequelize.INTEGER,
			field: 'ficha'
		},
		id_motivo: {
			type: Sequelize.INTEGER,
			field: 'motivo'
		},
		fecha_elaboracion: {
			type: Sequelize.DATE,
			field: 'fecha_elaboracion'
		},
		fecha_asistensia: {
			type: Sequelize.DATE,
			field: 'fecha_asistensia'
		},
		fecha_ingreso: {
			type: Sequelize.DATE,
			field: 'fecha_ingreso'
		},
		fecha_retiro: {
			type: Sequelize.DATE,
			field: 'fecha_retiro'
		},
		primer_mes: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'primer_mes'
		},
		segundo_mes: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'segundo_mes'
		},
		tercer_mes: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'tercer_mes'
		},
		numero_quinquenio: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'numero_quinquenio'
		},
		quinquenio_adelantado: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'quinquenio_adelantado'
		},
		total_quinquenio: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total_quinquenio'
		},
		tipo_beneficio: {
			type: Sequelize.BOOLEAN,
			field: 'tipo_beneficio'
		},
		desahucio: {
			type: Sequelize.BOOLEAN,
			field: 'desahucio'
		},
		total_ingresos:{
			type: Sequelize.DECIMAL(20, 4),
			field: 'total_ingresos'
		},
		total_deducciones:{
			type: Sequelize.DECIMAL(20, 4),
			field: 'total_deducciones'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
	}, {
			freezeTableName: true
		});

	RrhhEmpleadoBeneficioSocial.sync().then(function () {

	});

	return RrhhEmpleadoBeneficioSocial;
}