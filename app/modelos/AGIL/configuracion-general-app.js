module.exports=function(sequelize,Sequelize){
	var ConfiguracionGeneralApp = sequelize.define('agil_configuracion_general_app', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa'
	  },
	  id_tipo_venta:{
		type: Sequelize.INTEGER,
		field: 'tipo_venta' 
	  },
	  impresion_habilitada:{
		type: Sequelize.BOOLEAN,
		field: 'impresion_habilitada' 
	  },
	  id_cobro_habilitado:{
		type: Sequelize.INTEGER,
		field: 'cobro_habilitado' 
	  },
	  id_tipo_pago:{
		type: Sequelize.INTEGER,
		field: 'tipo_pago' 
	  },
	  cierre_habilitado:{
		type: Sequelize.BOOLEAN,
		field: 'cierre_habilitado' 
	  },
	  usar:{
		type: Sequelize.BOOLEAN,
		field: 'usar' 
	  },
	  id_listado_productos:{
		type: Sequelize.INTEGER,
		field: 'listado_productos' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	ConfiguracionGeneralApp.sync().then(function(){
		
	});
	
	return ConfiguracionGeneralApp;
}