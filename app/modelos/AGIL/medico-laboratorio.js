module.exports=function(sequelize,Sequelize){
	var MedicoLaboratorio = sequelize.define('agil_medico_laboratorio', {
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre' 
	  },
	  descripcion: {
		type: Sequelize.STRING,
		field: 'descripcion'
      },
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa'
	  }
	}, {
	  freezeTableName: true 
	});
	
	MedicoLaboratorio.sync().then(function(){
		
	});
	
	return MedicoLaboratorio;
}