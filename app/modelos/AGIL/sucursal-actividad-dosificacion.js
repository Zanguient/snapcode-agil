module.exports=function(sequelize,Sequelize){
	var SucursalActividadDosificacion = sequelize.define('agil_sucursal_actividad_dosificacion', {
	  id_sucursal: {
		type: Sequelize.INTEGER,
		field: 'sucursal' 
	  },
	  id_actividad: {
		type: Sequelize.INTEGER,
		field: 'actividad' 
	  },
	  id_dosificacion:{
		type: Sequelize.INTEGER,
		field: 'dosificacion' 
		},
		expirado:{
			type: Sequelize.BOOLEAN,
			field: 'expirado' 
			}
	}, {
	  freezeTableName: true 
	});
	
	SucursalActividadDosificacion.sync().then(function(){
		
	});
	
	return SucursalActividadDosificacion;
}