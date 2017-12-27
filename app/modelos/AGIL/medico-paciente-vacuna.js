module.exports=function(sequelize,Sequelize){
	var MedicoPacienteVacuna = sequelize.define('agil_medico_paciente_vacuna', {
	  id_paciente: {
		type: Sequelize.INTEGER,
		field: 'id_paciente' 
	  },
	  id_vacuna: {
		type: Sequelize.INTEGER,
		field: 'id_vacuna'
	  },
	  fecha_ultima_aplicacion: {
		type: Sequelize.DATE,
		field: 'ultima_aplicacion'
      },
      fecha_siguiente_aplicacion: {
		type: Sequelize.DATE,
		field: 'siguiente_aplicacion'
		},
	  eliminado: {
		type: Sequelize.BOOLEAN,
		field: 'eliminado'
	  }
	}, {
	  freezeTableName: true 
	});
	
	MedicoPacienteVacuna.sync().then(function(){
		
	});
	
	return MedicoPacienteVacuna;
}