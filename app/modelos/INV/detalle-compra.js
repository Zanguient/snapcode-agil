module.exports=function(sequelize,Sequelize){
	var DetalleCompra = sequelize.define('inv_detalle_compra', {
	  id_compra: {
		type: Sequelize.INTEGER,
		field: 'compra'
	  },
	  id_producto: {
		type: Sequelize.INTEGER,
		field: 'producto'
	  },
	  id_centro_costo: {
		type: Sequelize.INTEGER,
		field: 'centro_costo'
	  },
	  costo_unitario: {
		type: Sequelize.DECIMAL(20,4),
		field: 'costo_unitario'
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
	  id_inventario: {
		type: Sequelize.INTEGER,
		field: 'inventario'
	  }
	}, {
	  freezeTableName: true 
	});
	
	DetalleCompra.sync();
	
	return DetalleCompra;
}