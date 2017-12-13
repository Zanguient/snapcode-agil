module.exports=function(sequelize,Sequelize){
	var RutaDia = sequelize.define('agil_ruta_dia', {
	  id_ruta: {
		type: Sequelize.INTEGER,
		field: 'ruta' 
	  },
	  id_dia: {
		type: Sequelize.INTEGER,
		field: 'dia'
	  }
	}, {
	  freezeTableName: true 
	});
	
	RutaDia.sync().then(function(){
		
	});
	
	return RutaDia;
}