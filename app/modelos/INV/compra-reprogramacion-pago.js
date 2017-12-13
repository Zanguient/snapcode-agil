module.exports=function(sequelize,Sequelize){
	var CompraRepogramacionPago = sequelize.define('inv_compra_reprogramacion_pago', {
	id_compra: {
		type: Sequelize.INTEGER,
		field: 'compra'
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
	
	CompraRepogramacionPago.sync();
	
	return CompraRepogramacionPago;
}