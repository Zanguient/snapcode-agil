module.exports=function(sequelize,Sequelize){
	var RrhhEmpleadoExperienciaLaboral = sequelize.define('agil_rrhh_empleado_experiencia_laboral', {
	  id_hoja_vida: {
		type: Sequelize.INTEGER,
		field: 'hoja_vida' 
	  },
	  fecha_inicio: {
		type: Sequelize.DATE,
		field: 'fecha_inicio'
      },
      fecha_fin: {
		type: Sequelize.DATE,
		field: 'fecha_fin'
	  },
      empresa: {
		type: Sequelize.STRING,
		field: 'empresa'
	  },
      cargo: {
		type: Sequelize.STRING,
		field: 'cargo'
	  },
      motivo_retiro: {
		type: Sequelize.STRING,
		field: 'motivo_retiro'
      },
      contacto: {
		type: Sequelize.STRING,
		field: 'contacto'
      },
      telefono: {
		type: Sequelize.INTEGER,
		field: 'telefono'
	  }
	}, {
	  freezeTableName: true 
	});
	
	RrhhEmpleadoExperienciaLaboral.sync().then(function(){
		
	});
	
	return RrhhEmpleadoExperienciaLaboral;
}