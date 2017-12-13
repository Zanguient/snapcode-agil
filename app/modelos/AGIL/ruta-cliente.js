module.exports=function(sequelize,Sequelize){
	var RutaCliente = sequelize.define('agil_ruta_cliente', {
	  id_ruta: {
		type: Sequelize.INTEGER,
		field: 'ruta' 
	  },
	  id_cliente: {
		type: Sequelize.INTEGER,
		field: 'cliente'
	  }
	}, {
	  freezeTableName: true 
	});
	
	RutaCliente.sync().then(function(){
		
	});
	
	return RutaCliente;
}