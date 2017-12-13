module.exports=function(sequelize,Sequelize){
	var MedicoPacienteVacunaDosis = sequelize.define('agil_medico_paciente_vacuna_dosis', {
	  id_paciente_vacuna: {
		type: Sequelize.INTEGER,
		field: 'id_paciente_vacuna' 
	  },
	  fecha_aplicacion: {
		type: Sequelize.DATE,
		field: 'fecha_aplicacion'
      },
	  eliminado: {
		type: Sequelize.BOOLEAN,
		field: 'eliminado'
	  }
	}, {
	  freezeTableName: true 
	});
	
	MedicoPacienteVacunaDosis.sync().then(function(){
		
	});
	
	return MedicoPacienteVacunaDosis;
}