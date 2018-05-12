module.exports=function(sequelize,Sequelize){
	var RRHHPlanillaRcIva = sequelize.define('agil_rrhh_planilla_rc_iva', {
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
	    neto_imponible:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'neto_imponible'
	    },
	    dos_smn:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'dos_smn'
	    },
	    diferencia:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'diferencia'
	    },
	    rc_iva:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'rc_iva'
	    },
	    dos_smn13:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'dos_smn13'
	    },
	    f110:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'f110'
	    },
	    rc_iva_fisico:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'rc_iva_fisico'
	    },
	    saldo_dependiente:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'saldo_dependiente'
	    },
	    saldo_anterior:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'saldo_anterior'
	    },
	    actualizacion:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'actualizacion'
	    },
	    saldo_actualizado:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'saldo_actualizado'
	    },
	    saldo_total:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'saldo_total'
	    },
	    saldo_utilizado:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'saldo_utilizado'
	    },
	    rc_iva_mes:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'rc_iva_mes'
	    },
	    nuevo_saldo:{
	        type: Sequelize.DECIMAL(20,4),
			field: 'nuevo_saldo'
	    }

	}, {
	  freezeTableName: true 
	});

	RRHHPlanillaRcIva.sync();	
	return RRHHPlanillaRcIva;
}