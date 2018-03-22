module.exports=function(sequelize,Sequelize){
	var RrhhEmpleadoCargo = sequelize.define('agil_rrhh_empleado_cargo', {
	/*   id_empleado: {
		type: Sequelize.INTEGER,
		field: 'empleado' 
		}, */
		id_ficha: {
			type: Sequelize.INTEGER,
			field: 'ficha' 
			},
	  id_cargo: {
		type: Sequelize.INTEGER,
		field: 'cargo'
	  }
	}, {
	  freezeTableName: true 
	});
	
	RrhhEmpleadoCargo.sync().then(function(){
		
	});
	
	return RrhhEmpleadoCargo;
}