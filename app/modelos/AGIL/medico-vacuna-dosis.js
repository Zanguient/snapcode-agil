module.exports=function(sequelize,Sequelize){
	var VacunaDosis = sequelize.define('agil_medico_vacuna_dosis', {
	  es_dosis: {
		type: Sequelize.BOOLEAN,
		field: 'es_dosis' 
	  },
	  tiempo: {
		type: Sequelize.INTEGER,
		field: 'tiempo'
	  },
	  numero: {
		type: Sequelize.INTEGER,
		field: 'numero'
	  },
	  eliminado: {
		type: Sequelize.BOOLEAN,
		field: 'eliminado'
	  },
	  id_vacuna:{
		type: Sequelize.INTEGER,
		field: 'id_vacuna'  
	  }
	}, {
	  freezeTableName: true 
	});
	
	VacunaDosis.sync().then(function(){
		
	});
	
	return VacunaDosis;
}