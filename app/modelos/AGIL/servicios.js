module.exports=function(sequelize,Sequelize){
	var Servicio = sequelize.define('agil_servicio', {
		
	  id_actividad: {
		type: Sequelize.INTEGER,
		field: 'actividad' 
	  },
	  id_centro_costo: {
		type: Sequelize.INTEGER,
		field: 'centro_costo'
      },
      codigo: {
		type: Sequelize.STRING,
		field: 'codigo'
      },
      nombre: {
		type: Sequelize.STRING,
		field: 'nombre'
      },
      precio: {
		type: Sequelize.DECIMAL(20,4),
		field: 'precio'
		},
		id_empresa:{
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
			}
	}, {
	  freezeTableName: true 
	});
	Servicio.sync().then(function(){
	});
	return Servicio;
}