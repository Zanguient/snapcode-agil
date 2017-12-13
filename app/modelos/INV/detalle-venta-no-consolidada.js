module.exports=function(sequelize,Sequelize){
	var DetalleVentaNoConsolidada = sequelize.define('inv_detalle_venta_no_consolidada', {
	  id_venta: {
		type: Sequelize.INTEGER,
		field: 'venta'
	  },
	  id_cliente: {
		type: Sequelize.INTEGER,
		field: 'cliente'
	  },
	  fecha: {
		type: Sequelize.DATE,
		field: 'fecha'
	  },
	  id_producto: {
		type: Sequelize.INTEGER,
		field: 'producto'
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
	  }
	}, {
	  freezeTableName: true 
	});
	
	DetalleVentaNoConsolidada.sync();
	
	return DetalleVentaNoConsolidada;
}