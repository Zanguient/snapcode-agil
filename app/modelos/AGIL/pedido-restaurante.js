module.exports=function(sequelize,Sequelize){
	var PedidoRestaurante = sequelize.define('agil_pedido_restaurante', {
	  cantidad_personas: {
		type: Sequelize.INTEGER,
		field: 'cantidad_personas' 
	  },
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre'
	  },
	  tiempo_ingreso:{
		type: Sequelize.DATE,
		field: 'tiempo_ingreso'  
	  },
	  tiempo_salida:{
		type: Sequelize.DATE,
		field: 'tiempo_salida'  
	  },
	  fecha_reserva:{
		type: Sequelize.DATE,
		field: 'fecha_reserva'  
	  }
	}, {
	  freezeTableName: true 
	});
	
	PedidoRestaurante.sync().then(function(){
		
	});
	
	return PedidoRestaurante;
}