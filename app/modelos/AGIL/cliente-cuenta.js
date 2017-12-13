module.exports=function(sequelize,Sequelize){
	var ClienteCuenta = sequelize.define('agil_cliente_cuenta', {
	id_cuenta: {
		type: Sequelize.INTEGER,
		field: 'cuenta'
	  },
	id_cliente: {
		type: Sequelize.INTEGER,
		field: 'cliente'
	  }    
	}, {
	  freezeTableName: true 
	});
	
	ClienteCuenta.sync();
	
	return ClienteCuenta;
}