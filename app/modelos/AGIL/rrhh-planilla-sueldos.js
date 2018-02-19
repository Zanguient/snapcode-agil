module.exports=function(sequelize,Sequelize){
	var RRHHPlanillaSueldos = sequelize.define('agil_rrhh_planilla_sueldos', {
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		mes: {
			type: Sequelize.STRING,
			field: 'mes'
		},
		anio: {
			type: Sequelize.STRING,
			field: 'anio'
		},
		total_empleados: {
			type: Sequelize.INTEGER,
			field: 'total_empleados'
		},
	    total:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'total'
	    },
	    importe_sueldo_basico:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_sueldo_basico'
	    },
	    total_horas_extras: {
			type: Sequelize.INTEGER,
			field: 'total_horas_extras'
		},
		importe_horas_extras: {
			type: Sequelize.DECIMAL(20,4),
			field: 'importe_horas_extras'
		},
		importe_recargo_nocturno: {
			type: Sequelize.DECIMAL(20,4),
			field: 'importe_recargo_nocturno'
		},
	    importe_bono_antiguedad:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_bono_antiguedad'
	    },
	    importe_bono_frontera:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_bono_frontera'
	    },
	    importe_otros_bonos:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_otros_bonos'
	    },
	    importe_total_ganado:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_total_ganado'
	    },
	    importe_afp:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_afp'
	    },
	    importe_rc_iva:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_rc_iva'
	    },
	    importe_anticipos:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_anticipos'
	    },
	    importe_prestamos:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_prestamos'
	    },
	    importe_total_descuento:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_total_descuento'
	    },
	    importe_liquido_pagable:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_liquido_pagable'
	    }

	}, {
	  freezeTableName: true 
	});

	RRHHPlanillaSueldos.sync();	
	return RRHHPlanillaSueldos;
}