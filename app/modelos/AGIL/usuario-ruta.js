module.exports=function(sequelize,Sequelize){
	var UsuarioRuta = sequelize.define('agil_usuario_ruta', {
	  id_usuario: {
		type: Sequelize.INTEGER,
		field: 'usuario' 
	  },
	  id_ruta: {
		type: Sequelize.INTEGER,
		field: 'ruta' 
	  },
	  activo: {
		type: Sequelize.BOOLEAN,
		field: 'activo' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	UsuarioRuta.sync().then(function(){
		
	});
	
	return UsuarioRuta;
}