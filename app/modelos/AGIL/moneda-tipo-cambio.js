module.exports=function(sequelize,Sequelize){
	var MonedaTipoCambio = sequelize.define('agil_moneda_tipo_cambio', {
	  fecha: {
		type: Sequelize.DATE,
		field: 'fecha'
	  },
	  ufv: {
		type: Sequelize.DECIMAL(20,4),
		field: 'ufv' 
	  },
	  dolar: {
		type: Sequelize.DECIMAL(20,4),
		field: 'dolar'
	  },	 
	}, {
	  freezeTableName: true 
	});
	
	MonedaTipoCambio.sync().then(function(){	
	});
	
	return MonedaTipoCambio;
}