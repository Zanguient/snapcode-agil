module.exports=function(sequelize,Sequelize){
	var RrhhEmpleadoDiscapacidad = sequelize.define('agil_rrhh_empleado_discapacidad', {
	  id_empleado: {
		type: Sequelize.INTEGER,
		field: 'empleado' 
	  },
	  id_discapacidad: {
		type: Sequelize.INTEGER,
		field: 'discapacidad'
      }  
      
	}, {
	  freezeTableName: true 
	});
	
	RrhhEmpleadoDiscapacidad.sync().then(function(){
		
	});
	
	return RrhhEmpleadoDiscapacidad;
}