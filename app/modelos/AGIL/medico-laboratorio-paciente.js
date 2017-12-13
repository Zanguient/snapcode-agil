module.exports=function(sequelize,Sequelize){
	var MedicoLaboratorioPaciente = sequelize.define('agil_medico_laboratorio_paciente', {
    id_laboratorio: {
		type: Sequelize.INTEGER,
		field: 'laboratorio'
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
	
	MedicoLaboratorioPaciente.sync().then(function(){
		
	});
	
	return MedicoLaboratorioPaciente;
}