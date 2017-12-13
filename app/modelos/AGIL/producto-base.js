module.exports=function(sequelize,Sequelize){
	var ProductoBase = sequelize.define('agil_producto_base', {
	  id_producto: {
		type: Sequelize.INTEGER,
		field: 'producto' 
	  },
	  id_producto_base: {
		type: Sequelize.INTEGER,
		field: 'producto_base'
	  },
	  formulacion:{
	  	type: Sequelize.DECIMAL(20,4),
	  	field:'formulacion'
	  }
	}, {
	  freezeTableName: true 
	});
	
	ProductoBase.sync().then(function(){
		
	});

	return ProductoBase;
}
