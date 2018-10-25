module.exports=function(sequelize,Sequelize){
	var RrhhEmpleadoPrerequisitoCargo = sequelize.define('agil_rrhh_empleado_prerequisito_cargo', {
	  id_cargo: {
		type: Sequelize.INTEGER,
		field: 'cargo' 
	  },
	  id_prerequisito: {
		type: Sequelize.INTEGER,
		field: 'prerequisito'
      }  
      
	}, {
	  freezeTableName: true 
	});
	
	RrhhEmpleadoPrerequisitoCargo.sync().then(function(){
		
	});
	
	return RrhhEmpleadoPrerequisitoCargo;
}