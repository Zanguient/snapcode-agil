module.exports=function(sequelize,Sequelize){
	var MedicoLaboratorioExamen = sequelize.define('agil_medico_laboratorio_examen', {
    id_laboratorio: {
		type: Sequelize.INTEGER,
		field: 'laboratorio'
	  },
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre' 
	  },
	  examen: {
		type: Sequelize.STRING,
		field: 'examen'
      },
     unidad: {
		type: Sequelize.STRING,
		field: 'unidad'
      },
    observacion: {
		type: Sequelize.STRING,
		field: 'observacion'
      },
	 
	}, {
	  freezeTableName: true 
	});
	
	MedicoLaboratorioExamen.sync().then(function(){
		
	});
	
	return MedicoLaboratorioExamen;
}