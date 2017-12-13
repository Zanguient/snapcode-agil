module.exports=function(sequelize,Sequelize){
	var Almacen = sequelize.define('agil_almacen', {
	  id_sucursal: {
		type: Sequelize.INTEGER,
		field: 'sucursal' 
	  },
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre'
	  },
	  numero: {
		type: Sequelize.INTEGER,
		field: 'numero'
	  },
	  direccion: {
		type: Sequelize.STRING,
		field: 'direccion'
	  },
	  telefono:{
		type: Sequelize.STRING,
		field: 'telefono'  
	  }
	}, {
	  freezeTableName: true 
	});
	
	Almacen.sync().then(function(){
		
	});
	
	return Almacen;
}