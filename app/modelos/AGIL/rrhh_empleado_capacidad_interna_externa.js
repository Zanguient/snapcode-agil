module.exports=function(sequelize,Sequelize){
	var RrhhEmpleadoCapacidadInternoExterno = sequelize.define('agil_rrhh_empleado_capacidad_interno_externo', {
	  id_hoja_vida: {
		type: Sequelize.INTEGER,
		field: 'hoja_vida' 
	  },
	  id_tipo_capacidad: {
		type: Sequelize.INTEGER,
		field: 'tipo_capacidad'
      },
      curso: {
		type: Sequelize.STRING,
		field: 'curso' 
	  },
	  institucion: {
		type: Sequelize.STRING,
		field: 'institucion'
      },
      certificado: {
		type: Sequelize.STRING,
		field: 'certificado' 
	  },
	  fecha: {
		type: Sequelize.DATE,
		field: 'fecha'
	  },
      
	}, {
	  freezeTableName: true 
	});
	
	RrhhEmpleadoCapacidadInternoExterno.sync().then(function(){
		
	});
	
	return RrhhEmpleadoCapacidadInternoExterno;
}