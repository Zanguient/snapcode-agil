module.exports=function(sequelize,Sequelize){
	var UsuarioGrupos = sequelize.define('sys_usuario_grupos', {
	  id_usuario: {
		type: Sequelize.INTEGER ,
		field: 'usuario'
	  },
	  id_grupo: {
		type: Sequelize.INTEGER ,
		field: 'grupo'
	  }
	}, {
	  freezeTableName: true 
	});
	
	UsuarioGrupos.sync().then(function(){

	});
	
	return UsuarioGrupos;
}