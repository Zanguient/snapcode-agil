module.exports=function(sequelize,Sequelize){
	var MedicoDiagnostico = sequelize.define('agil_medico_diagnostico', {
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
	
	MedicoDiagnostico.sync().then(function(){
		
	});
	
	return MedicoDiagnostico;
}