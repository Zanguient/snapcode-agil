module.exports=function(sequelize,Sequelize){
	var DetallePedidoRestaurante = sequelize.define('agil_detalle_pedido_restaurante', {
	  id_producto: {
		type: Sequelize.INTEGER,
		field: 'producto'
	  },
	  id_inventario: {
		type: Sequelize.INTEGER,
		field: 'inventario'
	  },
	  id_pedido_restaurante: {
		type: Sequelize.INTEGER,
		field: 'pedido_restaurante' 
	  },
	  precio_unitario: {
		type: Sequelize.DECIMAL(20,4),
		field: 'precio_unitario'
	  },
	  cantidad: {
		type: Sequelize.DECIMAL(20,4),
		field: 'cantidad'
	  },
	  importe: {
		type: Sequelize.DECIMAL(20,4),
		field: 'importe'
	  },
	  descuento: {
		type: Sequelize.DECIMAL(20,4),
		field: 'descuento'
	  },
	  recargo: {
		type: Sequelize.DECIMAL(20,4),
		field: 'recargo'
	  },
	  ice: {
		type: Sequelize.DECIMAL(20,4),
		field: 'ice'
	  },
	  excento: {
		type: Sequelize.DECIMAL(20,4),
		field: 'excento'
	  },
	  tipo_descuento: {
		type: Sequelize.BOOLEAN,
		field: 'tipo_descuento'
	  },
	  tipo_recargo: {
		type: Sequelize.BOOLEAN,
		field: 'tipo_recargo'
	  },
	  total: {
		type: Sequelize.DECIMAL(20,4),
		field: 'total'
	  },
	  fecha_vencimiento:{
		type: Sequelize.DATE,
		field: 'fecha_vencimiento'  
	  },
	  lote:{
		type: Sequelize.STRING,
		field: 'lote'  
	  }
	}, {
	  freezeTableName: true 
	});
	
	DetallePedidoRestaurante.sync().then(function(){
		
	});
	
	return DetallePedidoRestaurante;
}