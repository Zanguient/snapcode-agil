module.exports=function(sequelize,Sequelize){
	var Inventario = sequelize.define('agil_inventario', {
	  id_almacen: {
		type: Sequelize.INTEGER,
		field: 'almacen' 
	  },
	  id_producto: {
		type: Sequelize.INTEGER,
		field: 'producto' 
	  },
	  cantidad: {
		type: Sequelize.INTEGER,
		field: 'cantidad'
	  },
	  costo_unitario: {
		type: Sequelize.DECIMAL(20,4),
		field: 'costo_unitario'
	  },
	  costo_total: {
		type: Sequelize.DECIMAL(20,4),
		field: 'costo_total'
	  }
	}, {
	  freezeTableName: true 
	});
	
	Inventario.sync().then(function(){
		
	});
	
	return Inventario;
}