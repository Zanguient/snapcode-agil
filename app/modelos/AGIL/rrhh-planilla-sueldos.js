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
	    }
	}, {
	  freezeTableName: true 
	});

	RRHHPlanillaSueldos.sync();	
	return RRHHPlanillaSueldos;
}