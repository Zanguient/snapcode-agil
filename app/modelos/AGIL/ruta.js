module.exports=function(sequelize,Sequelize){
	var Ruta = sequelize.define('agil_ruta', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
	  },
	  codigo: {
		type: Sequelize.STRING,
		field: 'codigo'
	  },
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre'
	  },
	  id_departamento: {
		type: Sequelize.INTEGER,
		field: 'departamento'
	  },
	  id_municipio: {
		type: Sequelize.INTEGER,
		field: 'municipio'
	  },
	  segmentos: {
		type: Sequelize.TEXT,
		field: 'segmentos'
	  }
	}, {
	  freezeTableName: true 
	});
	
	Ruta.sync().then(function(){
		
	});
	
	return Ruta;
}