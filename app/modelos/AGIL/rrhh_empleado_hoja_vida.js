module.exports=function(sequelize,Sequelize){
	var RrhhEmpleadoHojaVida= sequelize.define('agil_rrhh_empleado_hoja_vida', {
	  id_empleado: {
		type: Sequelize.INTEGER,
		field: 'empleado' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	RrhhEmpleadoHojaVida.sync().then(function(){
		
	});
	
	return RrhhEmpleadoHojaVida;
}