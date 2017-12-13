module.exports=function(sequelize,Sequelize){
	var MantenimientoOrdenTrabajoSistema = sequelize.define('agil_mantenimiento_orden_trabajo_sistema', {
	  id_orden_trabajo: {
		type: Sequelize.INTEGER,
		field: 'orden_trabajo' 
	  }, 
       id_orden_trabajo_sistema: {
		type: Sequelize.INTEGER,
		field: 'orden_trabajo_sistema' 
	  },
	}, {
	  freezeTableName: true 
	});
	
	MantenimientoOrdenTrabajoSistema.sync().then(function(){
		
	});
	
	return MantenimientoOrdenTrabajoSistema;
}