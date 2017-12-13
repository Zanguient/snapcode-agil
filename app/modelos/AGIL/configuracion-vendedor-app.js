module.exports=function(sequelize,Sequelize){
	var ConfiguracionVendedorApp = sequelize.define('agil_configuracion_vendedor_app', {
	  id_vendedor: {
		type: Sequelize.INTEGER,
		field: 'vendedor'
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
	  id_listado_productos:{
		type: Sequelize.INTEGER,
		field: 'listado_productos' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	ConfiguracionVendedorApp.sync().then(function(){
		
	});
	
	return ConfiguracionVendedorApp;
}