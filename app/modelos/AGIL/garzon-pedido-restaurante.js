module.exports=function(sequelize,Sequelize){
	var GarzonPedidoRestaurante = sequelize.define('agil_garzon_pedido_restaurante', {
	  fecha_atencion:{
		type: Sequelize.DATE,
		field: 'fecha_atencion'  
	  },
	  id_pedido_restaurante: {
		type: Sequelize.INTEGER,
		field: 'pedido_restaurante' 
	  },
	  id_garzon: {
		type: Sequelize.INTEGER,
		field: 'garzon' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	GarzonPedidoRestaurante.sync().then(function(){
		
	});
	
	return GarzonPedidoRestaurante;
}