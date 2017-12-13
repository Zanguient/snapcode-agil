module.exports=function(sequelize,Sequelize){
	var MedicoPacienteConsulta = sequelize.define('agil_medico_paciente_consulta', {
	  id_paciente: {
		type: Sequelize.INTEGER,
		field: 'id_paciente' 
	  },
	  fecha: {
		type: Sequelize.DATE,
		field: 'fecha'
	  },
	  presion: {
		type: Sequelize.STRING,
		field: 'presion'
	  },
	  pulso: {
		type: Sequelize.STRING,
		field: 'pulso'
	  },
	  talla:{
		type: Sequelize.DECIMAL(20,4),
		field: 'talla'  
	  },
	  peso:{
		type: Sequelize.DECIMAL(20,4),
		field: 'peso'  
	  },
	  temperatura:{
		type: Sequelize.DECIMAL(20,4),
		field: 'temperatura'  
	  },
	  frecuencia_respiratoria:{
		type: Sequelize.STRING,
		field: 'frecuencia_respiratoria'  
	  },
	  frecuencia_cardiaca:{
		type: Sequelize.STRING,
		field: 'frecuencia_cardiaca'  
	  },
	  indice_masa_corporal:{
		type: Sequelize.STRING,
		field: 'indice_masa_corporal'  
	  },
	  subjetivo:{
		type: Sequelize.STRING,
		field: 'subjetivo'  
	  },
	  objetivo:{
		type: Sequelize.STRING,
		field: 'objetivo'  
	  },
	  analitico:{
		type: Sequelize.STRING,
		field: 'analitico'  
	  },
	  plan:{
		type: Sequelize.STRING,
		field: 'plan'  
	  },
	  evolucion:{
		type: Sequelize.STRING,
		field: 'evolucion'  
	  },
	  nervioso_central:{
		type: Sequelize.STRING,
		field: 'nervioso_central'  
	  },
	  sentidos:{
		type: Sequelize.STRING,
		field: 'sentidos'  
	  },
	  cardiovascular:{
		type: Sequelize.STRING,
		field: 'cardiovascular'  
	  },
	  respiratorio:{
		type: Sequelize.STRING,
		field: 'respiratorio'  
	  },
	  gastrointestinal:{
		type: Sequelize.STRING,
		field: 'gastrointestinal'  
	  },
	  genitourinario:{
		type: Sequelize.STRING,
		field: 'genitourinario'  
	  },
		locomotor:{
		type: Sequelize.STRING,
		field: 'locomotor'  
	  },
		piel:{
		type: Sequelize.STRING,
		field: 'piel'  
	  }
	}, {
	  freezeTableName: true 
	});
	
	MedicoPacienteConsulta.sync().then(function(){
		
	});
	
	return MedicoPacienteConsulta;
}