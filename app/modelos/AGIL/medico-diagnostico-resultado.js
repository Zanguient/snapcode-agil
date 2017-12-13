module.exports=function(sequelize,Sequelize){
	var MedicoDiagnosticoResultado = sequelize.define('agil_medico_diagnostico_resultado', {
    id_diagnostico_paciente: {
		type: Sequelize.INTEGER,
		field: 'laboratorio_paciente'
      },
     id_diagnostico_examen: {
		type: Sequelize.INTEGER,
		field: 'laboratorio_examen'
      },
    resultado: {
		type: Sequelize.STRING,
		field: 'resultado'
			},
	estado: {
		type: Sequelize.STRING,
		field: 'estado'
      }
	 
	}, {
	  freezeTableName: true 
	});
	
	MedicoDiagnosticoResultado.sync().then(function(){
		
	});
	
	return MedicoDiagnosticoResultado;
}