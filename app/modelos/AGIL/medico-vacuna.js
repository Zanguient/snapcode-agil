module.exports=function(sequelize,Sequelize){
	var MedicoVacuna = sequelize.define('agil_medico_vacuna', {
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre'
	  },
	  observacion: {
		type: Sequelize.STRING,
		field: 'observacion'
		},
		dias_activacion:{
			type: Sequelize.INTEGER,
			field: 'dias_activacion',
			defaultValue:15
		},
	  eliminado: {
		type: Sequelize.BOOLEAN,
		field: 'eliminado'
	  }
	}, {
	  freezeTableName: true 
	});
	
	MedicoVacuna.sync().then(function(){
		
	});
	
	return MedicoVacuna;
}