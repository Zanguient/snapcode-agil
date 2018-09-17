module.exports=function(sequelize,Sequelize){
	var ClasificacionCuenta = sequelize.define('agil_contabilidad_clasificacion_cuenta', {
	  
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre' 
	  },
	  id_saldo:{
		type: Sequelize.INTEGER,
		field: 'saldo' 
	  },
	  id_movimiento: {
		type: Sequelize.INTEGER,
		field: 'movimiento' 
	  },
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
		},
	  id_tipo: {
		type: Sequelize.INTEGER,
		field: 'tipo' 
	  }
		
	}, {
	  freezeTableName: true 
	});
	
	ClasificacionCuenta.sync().then(function(){
		
		
	});
	
	return ClasificacionCuenta;
}