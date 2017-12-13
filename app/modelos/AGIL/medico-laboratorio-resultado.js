module.exports=function(sequelize,Sequelize){
	var MedicoLaboratorioResultado = sequelize.define('agil_medico_laboratorio_resultado', {
    id_laboratorio_paciente: {
		type: Sequelize.INTEGER,
		field: 'laboratorio_paciente'
      },
     id_laboratorio_examen: {
		type: Sequelize.INTEGER,
		field: 'laboratorio_examen'
			},			
    resultado: {
		type: Sequelize.STRING,
		field: 'resultado'
			},	
	 
	}, {
	  freezeTableName: true 
	});
	
	MedicoLaboratorioResultado.sync().then(function(){
		
	});
	
	return MedicoLaboratorioResultado;
}