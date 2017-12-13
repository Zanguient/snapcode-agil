module.exports=function(sequelize,Sequelize){
	var DetalleMovimiento = sequelize.define('inv_detalle_movimiento', {
	  id_producto: {
		type: Sequelize.INTEGER,
		field: 'producto'
	  },
	  id_movimiento: {
		type: Sequelize.INTEGER,
		field: 'movimiento'
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
	  fecha_vencimiento:{
		type: Sequelize.DATE,
		field: 'fecha_vencimiento'  
	  },
	  lote:{
		type: Sequelize.STRING,
		field: 'lote'  
	  },
	  id_inventario: {
		type: Sequelize.INTEGER,
		field: 'inventario'
	  }
	}, {
	  freezeTableName: true 
	});
	
	DetalleMovimiento.sync();
	
	return DetalleMovimiento;
}