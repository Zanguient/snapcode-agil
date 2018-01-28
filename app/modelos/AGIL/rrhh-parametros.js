module.exports=function(sequelize,Sequelize){
	var RRHHParametros = sequelize.define('agil_rrhh_parametros', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		  },
		salario_minimo: {
			type: Sequelize.DECIMAL(20,4),
			field: 'salario_minimo'
		},
		salario_rciva: {
			type: Sequelize.DECIMAL(20,4),
			field: 'salario-rciva'
		},
		porcentage_iva: {
			type: Sequelize.DECIMAL(20,4),
			field: 'porcentage_iva'
		},
	    decreto_supremo:{
	        type: Sequelize.STRING,
			field: 'decreto_supremo'
	    },
	    seguro_salud:{
	        type: Sequelize.STRING,
			field: 'seguro_salud'
	    },
	    aporte_serguro_salud: {
			type: Sequelize.DECIMAL(20,4),
			field: 'aporte_serguro_salud'
		},
		numero_patronal:{
	        type: Sequelize.STRING,
			field: 'numero_patronal'
	    },
	    pension_vejez: {
			type: Sequelize.DECIMAL(20,4),
			field: 'pension_vejez'
		},
		riesgo_comun: {
			type: Sequelize.DECIMAL(20,4),
			field: 'riesgo_comun'
		},
		comision: {
			type: Sequelize.DECIMAL(20,4),
			field: 'comision'
		},
		aporte_solidario_laboral: {
			type: Sequelize.DECIMAL(20,4),
			field: 'aporte_solidario_laboral'
		},
		riesgo_profesional: {
			type: Sequelize.DECIMAL(20,4),
			field: 'riesgo_profesional'
		},
		aporte_solidario_patronal: {
			type: Sequelize.DECIMAL(20,4),
			field: 'aporte_solidario_patronal'
		},
		rango_primero_inicio_solidario: {
			type: Sequelize.DECIMAL(20,4),
			field: 'rango_primero_inicio_solidario'
		},
		rango_primero_fin_solidario: {
			type: Sequelize.DECIMAL(20,4),
			field: 'rango_primero_fin_solidario'
		},
		rango_segundo_inicio_solidario: {
			type: Sequelize.DECIMAL(20,4),
			field: 'rango_segundo_inicio_solidario'
		},
		rango_segundo_fin_solidario: {
			type: Sequelize.DECIMAL(20,4),
			field: 'rango_segundo_fin_solidario'
		},
		rango_tercero_inicio_solidario: {
			type: Sequelize.DECIMAL(20,4),
			field: 'rango_tercero_inicio_solidario'
		},
		rango_tercero_fin_solidario: {
			type: Sequelize.DECIMAL(20,4),
			field: 'rango_tercero_fin_solidario'
		},
		salario_base_antiguedad: {
			type: Sequelize.DECIMAL(20,4),
			field: 'salario_base_antiguedad'
		},
		antiguedad_cero_dos: {
			type: Sequelize.DECIMAL(20,4),
			field: 'antiguedad_cero_dos'
		},
		antiguedad_dos_cinco: {
			type: Sequelize.DECIMAL(20,4),
			field: 'antiguedad_dos_cinco'
		},
		antiguedad_cinco_ocho: {
			type: Sequelize.DECIMAL(20,4),
			field: 'antiguedad_cinco_ocho'
		},
		antiguedad_ocho_once: {
			type: Sequelize.DECIMAL(20,4),
			field: 'antiguedad_ocho_once'
		},
		antiguedad_once_quince: {
			type: Sequelize.DECIMAL(20,4),
			field: 'antiguedad_once_quince'
		},
		antiguedad_quice_veinte: {
			type: Sequelize.DECIMAL(20,4),
			field: 'antiguedad_quice_veinte'
		},
		antiguedad_veinte_veinticinco: {
			type: Sequelize.DECIMAL(20,4),
			field: 'antiguedad_veinte_veinticinco'
		},
		antiguedad_mas_veinticinco: {
			type: Sequelize.DECIMAL(20,4),
			field: 'antiguedad_mas_veinticinco'
		}
	}, {
	  freezeTableName: true 
	});

	RRHHParametros.sync();	
	return RRHHParametros;
}