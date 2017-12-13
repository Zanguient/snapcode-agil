module.exports=function(sequelize,Sequelize){
	var DetalleCotizacion = sequelize.define('inv_detalle_cotizacion', {
		id_cotizacion: {
			type: Sequelize.INTEGER,
			field: 'cotizacion'
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
		id_venta: {
		type: Sequelize.INTEGER,
		field: 'venta'
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
	  eliminado: {
		type: Sequelize.BOOLEAN,
		field: 'eliminado'
	  }
	}, {
		freezeTableName: true 
		});
	
	DetalleCotizacion.sync();
	
	return DetalleCotizacion;
}