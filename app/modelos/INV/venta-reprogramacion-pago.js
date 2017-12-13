module.exports=function(sequelize,Sequelize){
	var VentaRepogramacionPago = sequelize.define('inv_venta_reprogramacion_pago', {
	id_venta: {
		type: Sequelize.INTEGER,
		field: 'venta'
	  },
	fecha_reprogramacion: {
		type: Sequelize.DATE,
		field: 'fecha_reprogramacion'
	  },
    fecha_anterior: {
		type: Sequelize.DATE,
		field: 'fecha_anterior'
	  },
    activo: {
		type: Sequelize.BOOLEAN,
		field: 'activo'
	  },
	}, {
	  freezeTableName: true 
	});
	
	VentaRepogramacionPago.sync();
	
	return VentaRepogramacionPago;
}