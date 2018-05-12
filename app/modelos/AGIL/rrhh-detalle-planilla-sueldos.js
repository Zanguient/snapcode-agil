module.exports=function(sequelize,Sequelize){
	var RRHHDetallePlanillaSueldos = sequelize.define('agil_rrhh_detalle_planilla_sueldos', {
		planilla: {
			type: Sequelize.INTEGER,
			field: 'planilla'
		},
		ficha: {
			type: Sequelize.INTEGER,
			field: 'ficha'
		},
		importe_sueldo_basico:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'importe_sueldo_basico'
	    },
		horas_extras: {
			type: Sequelize.INTEGER,
			field: 'horas_extras'
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
	    total_ganado:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'total_ganado'
	    },
	    afp:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'afp'
	    },
	    rc_iva:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'rc_iva'
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
	    liquido_pagable:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'liquido_pagable'
	    }


	}, {
	  freezeTableName: true 
	});

	RRHHDetallePlanillaSueldos.sync();	
	return RRHHDetallePlanillaSueldos;
}