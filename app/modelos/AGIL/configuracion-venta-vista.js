module.exports=function(sequelize,Sequelize){
	var ConfiguracionVentaVista = sequelize.define('agil_configuracion_venta_vista', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa'
	  },
	  mostrar_producto: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_producto'
	  },
	  mostrar_codigo_producto: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_codigo_producto'
	  },
	  mostrar_unidad_producto: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_unidad_producto'
	  },
	  mostrar_precio_unitario: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_precio_unitario'
	  },
	  mostrar_cantidad: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_cantidad'
	  },
	  mostrar_importe: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_importe'
	  },
	  mostrar_descuento: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_descuento'
	  },
	  mostrar_recargo: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_recargo'
	  },
	  mostrar_ice: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_ice'
	  },
	  mostrar_excento: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_excento'
	  },
	  mostrar_total: {
		type: Sequelize.BOOLEAN,
		field: 'mostrar_total'
	  },
	  mostrar_fecha_vencimiento:{
		type: Sequelize.BOOLEAN,
		field: 'mostrar_fecha_vencimiento'  
	  },
	  mostrar_lote:{
		type: Sequelize.BOOLEAN,
		field: 'mostrar_lote'  
	  }
	}, {
	  freezeTableName: true 
	});
	
	ConfiguracionVentaVista.sync();
	
	return ConfiguracionVentaVista;
}