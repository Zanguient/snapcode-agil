module.exports=function(sequelize,Sequelize){
	var Movimiento = sequelize.define('inv_movimiento', {
	  id_tipo: {
		type: Sequelize.INTEGER,
		field: 'tipo' 
	  },
	  id_clase: {
		type: Sequelize.INTEGER,
		field: 'clase' 
	  },
	  id_almacen: {
		type: Sequelize.INTEGER,
		field: 'almacen' 
	  },
	  fecha: {
		type: Sequelize.DATE,
		field: 'fecha' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	Movimiento.sync().then(function(){
		
	});
	
	return Movimiento;
}