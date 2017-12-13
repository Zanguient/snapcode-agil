module.exports=function(sequelize,Sequelize){
	var Garzon = sequelize.define('agil_garzon', {
	  id_persona: {
		type: Sequelize.INTEGER,
		field: 'persona' 
	  },
	  codigo: {
		type: Sequelize.STRING,
		field: 'codigo'
	  },
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	Garzon.sync().then(function(){
		
	});
	
	return Garzon;
}