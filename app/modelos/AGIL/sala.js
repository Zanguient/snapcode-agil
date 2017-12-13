module.exports=function(sequelize,Sequelize){
	var Sala = sequelize.define('agil_sala', {
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre'
	  },
	  descripcion: {
		type: Sequelize.STRING,
		field: 'descripcion'
	  },
	  ubicacion: {
		type: Sequelize.STRING,
		field: 'ubicacion'
	  },
	  posicion: {
		type: Sequelize.INTEGER,
		field: 'posicion' 
	  },
	  id_sucursal: {
		type: Sequelize.INTEGER,
		field: 'sucursal' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	Sala.sync().then(function(){
		sequelize.query("INSERT IGNORE INTO agil_sala SET id=1, nombre='UNO',descripcion='primera sala',ubicacion='ala este',posicion=1,createdAt = NOW(),updatedAt = NOW();").spread(function(results, metadata) {
	
		})
	});
	
	return Sala;
}