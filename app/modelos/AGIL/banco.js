module.exports=function(sequelize,Sequelize){
	var Banco = sequelize.define('agil_banco', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
	  },
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre'
	  },
	  numero:{
		type: Sequelize.STRING,
		field: 'numero' 
	  },
	  id_tipo_cuenta: {
		type: Sequelize.INTEGER,
		field: 'tipo_cuenta'
	  },
	  id_tipo_moneda: {
		type: Sequelize.INTEGER,
		field: 'tipo_moneda'
	  }
	}, {
	  freezeTableName: true 
	});
	
	Banco.sync().then(function(){
		
	});
	
	return Banco;
}