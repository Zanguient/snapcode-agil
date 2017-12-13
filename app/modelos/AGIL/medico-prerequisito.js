module.exports=function(sequelize,Sequelize){
	var MedicoPrerequisito = sequelize.define('agil_medico_prerequisito', {
	  id_paciente: {
		type: Sequelize.INTEGER,
		field: 'paciente' 
	  },
	  id_prerequisito: {
		type: Sequelize.INTEGER,
		field: 'prerequisito'
	  },
	  vencimiento_mes: {
		type: Sequelize.INTEGER,
		field: 'vencimiento_mes' 
	  },
	  fecha_inicio: {
		type: Sequelize.DATE,
		field: 'fecha_inicio'
	  },
	  fecha_vencimiento: {
		type: Sequelize.DATE,
		field: 'fecha_vencimiento'
	  },
	  observacion: {
		type: Sequelize.STRING,
		field: 'observacion'
	  },
	  puede_modificar_rrhh: {
		type: Sequelize.BOOLEAN,
		field: 'puede_modificar_rrhh'
		},
	entregado:{
		type: Sequelize.BOOLEAN,
		field: 'entregado',
		defaultValue:0
	}
	}, {
	  freezeTableName: true 
	});
	
	MedicoPrerequisito.sync().then(function(){
		
	});
	
	return MedicoPrerequisito;
}