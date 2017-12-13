module.exports=function(sequelize,Sequelize){
	var CuentaRestaurante = sequelize.define('agil_cuenta_restaurante', {
	  id_detalle_pedido_restaurante: {
		type: Sequelize.INTEGER,
		field: 'detalle_pedido_restaurante' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	CuentaRestaurante.sync().then(function(){
		
	});
	
	return CuentaRestaurante;
}