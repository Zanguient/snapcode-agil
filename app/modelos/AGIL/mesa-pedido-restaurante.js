module.exports=function(sequelize,Sequelize){
	var MesaPedidoRestaurante = sequelize.define('agil_mesa_pedido_restaurante', {
	  pedido_activo: {
		type: Sequelize.BOOLEAN,
		field: 'pedido_activo'
	  },
	  id_pedido_restaurante: {
		type: Sequelize.INTEGER,
		field: 'pedido_restaurante' 
	  },
	  id_mesa: {
		type: Sequelize.INTEGER,
		field: 'mesa' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	MesaPedidoRestaurante.sync().then(function(){
		
	});
	
	return MesaPedidoRestaurante;
}