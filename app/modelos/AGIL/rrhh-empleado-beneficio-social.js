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
		mes_uno: {
			type: Sequelize.INTEGER,
			field: 'mes_uno'
		},
		mes_dos: {
			type: Sequelize.INTEGER,
			field: 'mes_dos'
		},
		mes_tres: {
			type: Sequelize.INTEGER,
			field: 'mes_tres'
		},
		promedio: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'promedio'
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
		total_ingresos: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total_ingresos'
		},
		total_deducciones: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'total_deducciones'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
		id_cuenta_banco: {
			type: Sequelize.INTEGER,
			field: 'cuenta_banco'
		},
		empleado_cargo_impresion: {
			type: Sequelize.STRING,
			field: 'empleado_cargo_impresion'
		},
		cargo_imprecion: {
			type: Sequelize.STRING,
			field: 'cargo_imprecion'
		},
	}, {
			freezeTableName: true
		});

	RrhhEmpleadoBeneficioSocial.sync().then(function () {

	});

	return RrhhEmpleadoBeneficioSocial;
}