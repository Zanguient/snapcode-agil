module.exports=function(sequelize,Sequelize){
	var MedicoDiagnosticoPaciente = sequelize.define('agil_medico_diagnostico_paciente', {
    id_diagnostico: {
		type: Sequelize.INTEGER,
		field: 'diagnostico'
      },
      id_paciente: {
		type: Sequelize.INTEGER,
		field: 'paciente'
	  },	
    fecha: {
		type: Sequelize.DATE,
		field: 'fecha'
      },
	 
	}, {
	  freezeTableName: true 
	});
	
	MedicoDiagnosticoPaciente.sync().then(function(){
		
	});
	
	return MedicoDiagnosticoPaciente;
}