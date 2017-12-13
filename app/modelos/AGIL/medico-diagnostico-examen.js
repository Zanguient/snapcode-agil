module.exports=function(sequelize,Sequelize){
	var MedicoDiagnosticoExamen = sequelize.define('agil_medico_diagnostico_examen', {
    id_diagnostico: {
		type: Sequelize.INTEGER,
		field: 'diagnostico'
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
	
	MedicoDiagnosticoExamen.sync().then(function(){
		
	});
	
	return MedicoDiagnosticoExamen;
}