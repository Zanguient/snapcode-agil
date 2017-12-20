module.exports=function(sequelize,Sequelize){
	var MedicoPacientePreRequisito = sequelize.define('agil_medico_paciente_prerequisito', {
	  id_paciente: {
		type: Sequelize.INTEGER,
		field: 'paciente' 
	  },
	  id_prerequisito: {
		type: Sequelize.INTEGER,
		field: 'prerequisito'
		},
		fecha_inicio: {
			type: Sequelize.DATE,
			field: 'fecha_inicio'
			},
			fecha_vencimiento: {
			type: Sequelize.DATE,
			field: 'fecha_vencimiento'
			},
	  fecha_entrega: {
		type: Sequelize.DATE,
		field: 'fecha_entrega'
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
		reprogramado:{
			type: Sequelize.INTEGER,
			field: 'reprogramado',
			defaultValue:0
		},
	  eliminado: {
		type: Sequelize.BOOLEAN,
		field: 'eliminado'
	  }
	}, {
	  freezeTableName: true 
	});
	
	MedicoPacientePreRequisito.sync().then(function(){
		
	});
	
	return MedicoPacientePreRequisito;
}