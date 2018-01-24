module.exports=function(sequelize,Sequelize){
	var RrhhEmpleadoPrestamo = sequelize.define('agil_rrhh_empleado_prestamo', {
	  id_empleado: {
		type: Sequelize.INTEGER,
		field: 'empleado' 
	  },
	  fecha_inicial: {
		type: Sequelize.DATE,
		field: 'fecha_inicial'
      },
       monto: {
		type: Sequelize.DECIMAL(20,4),
		field: 'monto'
      },
      interes_pactado: {
		type: Sequelize.DECIMAL(20,4),
		field: 'interes_pactado'
	  },
      plazo: {
		type: Sequelize.INTEGER,
		field: 'plazo'
	  },
      observacion: {
		type: Sequelize.STRING,
		field: 'observacion'
	  },
		id_usuario: {
			type: Sequelize.INTEGER,
			field: 'usuario'
		},
		total: {
 type: Sequelize.DECIMAL(20,4),
 field: 'total'
	 }
	}, {
	  freezeTableName: true 
	});
	
	RrhhEmpleadoPrestamo.sync().then(function(){
		
	});
	
	return RrhhEmpleadoPrestamo;
}