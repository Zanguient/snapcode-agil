module.exports=function(sequelize,Sequelize){
	var UsuarioAplicacion = sequelize.define('sys_usuario_aplicacion', {
	  id_usuario: {
		type: Sequelize.INTEGER,
		field: 'usuario' 
	  },
	  id_aplicacion: {
		type: Sequelize.INTEGER,
		field: 'aplicacion' 
	  },
	  puede_ver:{
		type: Sequelize.BOOLEAN,
		field: 'puede_ver'  
	  },
	  puede_crear:{
		type: Sequelize.BOOLEAN,
		field: 'puede_crear'  
	  },
	  puede_modificar:{
		type: Sequelize.BOOLEAN,
		field: 'puede_modificar'  
	  },
	  puede_eliminar:{
		type: Sequelize.BOOLEAN,
		field: 'puede_eliminar'  
	  }
	}, {
	  freezeTableName: true 
	});
	
	UsuarioAplicacion.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO sys_usuario_aplicacion SET id=1,usuario=1,aplicacion=1,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO sys_usuario_aplicacion SET id=2,usuario=1,aplicacion=2,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
		sequelize.query("INSERT IGNORE INTO sys_usuario_aplicacion SET id=3,usuario=1,aplicacion=3,puede_ver=1,puede_crear=1,puede_modificar=1,puede_eliminar=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
	});
	
	return UsuarioAplicacion;
}