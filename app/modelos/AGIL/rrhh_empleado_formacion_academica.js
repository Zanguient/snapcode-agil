module.exports=function(sequelize,Sequelize){
	var RrhhEmpleadoFormacionAcademica = sequelize.define('agil_rrhh_empleado_formacion_academica', {
	  id_hoja_vida: {
		type: Sequelize.INTEGER,
		field: 'hoja_vida' 
	  },
	  id_grado: {
		type: Sequelize.INTEGER,
		field: 'id_grado'
      },
      id_titulo: {
		type: Sequelize.INTEGER,
		field: 'id_titulo'
	  },
      id_institucion: {
		type: Sequelize.INTEGER,
		field: 'id_institucion'
	  },
      descripcion: {
		type: Sequelize.STRING,
		field: 'descripcion'
	  },
      anio_obtencion: {
		type: Sequelize.STRING,
		field: 'anio_obtencion'
	  }
	}, {
	  freezeTableName: true 
	});
	
	RrhhEmpleadoFormacionAcademica.sync().then(function(){
		
	});
	
	return RrhhEmpleadoFormacionAcademica;
}