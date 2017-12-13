module.exports=function(sequelize,Sequelize){
	var PagoCompra = sequelize.define('inv_pago_compra', {
	  id_compra: {
		type: Sequelize.INTEGER,
		field: 'compra'
	  },
	  a_cuenta_anterior: {
		type: Sequelize.DECIMAL(20,4),
		field: 'a_cuenta_anterior'
	  },
	  saldo_anterior: {
		type: Sequelize.DECIMAL(20,4),
		field: 'saldo_anterior'
	  },
	  monto_pagado: {
		type: Sequelize.DECIMAL(20,4),
		field: 'monto_pagado'
	  },
	  id_usuario: {
		type: Sequelize.INTEGER,
		field: 'usuario' 
	  },
	  numero_documento: {
	  	type: Sequelize.INTEGER,
		field: 'numero_documento'
	  },
	  id_cierre_caja: {
		type: Sequelize.INTEGER,
		field: 'cierre_caja' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	PagoCompra.sync();
	
	return PagoCompra;
}