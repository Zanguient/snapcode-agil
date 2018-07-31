module.exports=function(sequelize,Sequelize){
	var ClienteCentroCostos = sequelize.define('agil_cliente_centro_costos', {
	  id_centro: {
		type: Sequelize.INTEGER,
		field: 'centro' 
	  },
	  id_cliente: {
		type: Sequelize.INTEGER,
		field: 'cliente'
		}
	}, {
	  freezeTableName: true 
	});
	
	ClienteCentroCostos.sync().then(function(){
		
	});
	
	return ClienteCentroCostos;
}