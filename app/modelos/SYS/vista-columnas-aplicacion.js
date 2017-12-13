module.exports=function(sequelize,Sequelize){
	var VistaColumnasAplicacion = sequelize.define('sys_vista_columnas_aplicacion', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
	  },
	  id_aplicacion: {
		type: Sequelize.INTEGER,
		field: 'aplicacion' 
	  },
	  configuracion: {
		type: Sequelize.TEXT,
		field: 'configuracion' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	VistaColumnasAplicacion.sync().then(function(){
		
	});
	
	return VistaColumnasAplicacion;
}