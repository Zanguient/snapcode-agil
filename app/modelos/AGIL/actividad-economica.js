module.exports=function(sequelize,Sequelize){
	var ActividadesEconomicas = sequelize.define('agil_actividades_economicas', {
	  id_clase_actividad: {
		type: Sequelize.INTEGER,
		field: 'actividad' 
	  },
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado',
			defaultValue: false
			}
	}, {
	  freezeTableName: true 
	});
	ActividadesEconomicas.sync().then(function(){
	});
	return ActividadesEconomicas;
}