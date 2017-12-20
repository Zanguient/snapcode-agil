module.exports=function(sequelize,Sequelize){
	var MedicoPrerequisito = sequelize.define('agil_medico_prerequisito', {
	  // id_paciente: {
		// type: Sequelize.INTEGER,
		// field: 'paciente' 
	  // },
	  // id_prerequisito: {
		// type: Sequelize.INTEGER,
		// field: 'prerequisito'
		// },
		nombre: {
			type: Sequelize.STRING,
			field: 'nombre'
			},
	  vencimiento_mes: {
		type: Sequelize.INTEGER,
		field: 'vencimiento_mes' 
	  },
	  
	  observacion: {
		type: Sequelize.STRING,
		field: 'observacion'
	  },
	  puede_modificar_rrhh: {
		type: Sequelize.BOOLEAN,
		field: 'puede_modificar_rrhh'
		},
	dias_activacion:{
		type: Sequelize.INTEGER,
		field: 'dias_activacion',
		defaultValue:15
	}
	}, {
	  freezeTableName: true 
	});
	
	MedicoPrerequisito.sync().then(function(){
		
	});
	
	return MedicoPrerequisito;
}