module.exports=function(sequelize,Sequelize){
	var DetalleVenta = sequelize.define('inv_detalle_venta', {
	  id_venta: {
		type: Sequelize.INTEGER,
		field: 'venta'
	  },
	  id_producto: {
		type: Sequelize.INTEGER,
		field: 'producto'
	  },
	  precio_unitario: {
		type: Sequelize.DECIMAL(20,4),
		field: 'precio_unitario'
		},
		precio_unitario_dolares: {
			type: Sequelize.DECIMAL(20,4),
			field: 'precio_unitario_dolares'
			},
	  cantidad: {
		type: Sequelize.DECIMAL(20,4),
		field: 'cantidad'
	  },
	  importe: {
		type: Sequelize.DECIMAL(20,4),
		field: 'importe'
		},
		importe_dolares: {
			type: Sequelize.DECIMAL(20,4),
			field: 'importe_dolares'
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
		total_dolares: {
			type: Sequelize.DECIMAL(20,4),
			field: 'total_dolares'
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
	  },
	  observaciones: {
		type: Sequelize.STRING,
		field: 'observaciones'
		},
		id_servicio: {
			type: Sequelize.INTEGER,
			field: 'servicio'
		 },
	}, {
	  freezeTableName: true 
	});
	
	DetalleVenta.sync();
	
	return DetalleVenta;
}