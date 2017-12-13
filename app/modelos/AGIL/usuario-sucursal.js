module.exports=function(sequelize,Sequelize){
	var UsuarioSucursal = sequelize.define('agil_usuario_sucursal', {
	  id_usuario: {
		type: Sequelize.INTEGER,
		field: 'usuario' 
	  },
	  id_sucursal: {
		type: Sequelize.INTEGER,
		field: 'sucursal' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	UsuarioSucursal.sync().then(function(){
		
	});
	
	return UsuarioSucursal;
}