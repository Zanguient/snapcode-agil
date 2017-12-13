module.exports=function(sequelize,Sequelize){
	var UsuarioRol = sequelize.define('sys_usuario_rol', {
	  id_usuario: {
		type: Sequelize.INTEGER ,
		field: 'usuario'
	  },
	  id_rol: {
		type: Sequelize.INTEGER ,
		field: 'rol'
	  }
	}, {
	  freezeTableName: true 
	});
	
	UsuarioRol.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO sys_usuario_rol SET id = 1,usuario=1,rol =1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
		  
		});
	});
	
	return UsuarioRol;
}