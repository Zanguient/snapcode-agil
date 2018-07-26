module.exports=function(sequelize,Sequelize){
	var ConfiguracionGeneralFactura = sequelize.define('agil_configuracion_general_factura', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa'
	  },
	  id_impresion_factura:{
		type: Sequelize.INTEGER,
		field: 'impresion_factura' 
	  },
	  id_tipo_facturacion:{
		type: Sequelize.INTEGER,
		field: 'tipo_facturacion' 
	  },
	  id_tamano_papel_factura:{
		type: Sequelize.INTEGER,
		field: 'tamano_papel_factura' 
	  },
	  id_titulo_factura:{
		type: Sequelize.INTEGER,
		field: 'titulo_factura' 
	  },
	  id_subtitulo_factura:{
		type: Sequelize.INTEGER,
		field: 'subtitulo_factura' 
	  },
	  id_pie_factura:{
		type: Sequelize.INTEGER,
		field: 'pie_factura' 
	  },
	  maximo_items:{
		type: Sequelize.INTEGER,
		field: 'maximo_items' 
	  },
	  usar:{
		type: Sequelize.BOOLEAN,
		field: 'usar' 
	  },
	  usar_pf:{
		type: Sequelize.BOOLEAN,
		field: 'usar_pf' 
	  },
	  imprimir_al_guardar:{
		type: Sequelize.BOOLEAN,
		field: 'imprimir_al_guardar' 
	  },
	  id_tamano_papel_nota_venta:{
		type: Sequelize.INTEGER,
		field: 'tamano_papel_nota_venta' 
	  },
	  id_tamano_papel_nota_traspaso:{
		type: Sequelize.INTEGER,
		field: 'tamano_papel_nota_traspaso' 
	  },
	  id_tamano_papel_nota_baja:{
		type: Sequelize.INTEGER,
		field: 'tamano_papel_nota_baja' 
	  },
	  id_tamano_papel_nota_pedido:{
		type: Sequelize.INTEGER,
		field: 'tamano_papel_nota_pedido' 
	  },
	  id_tamano_papel_cierre_caja:{
		type: Sequelize.INTEGER,
		field: 'tamano_papel_cierre_caja' 
		},
		id_tamano_papel_cotizacion:{
			type: Sequelize.INTEGER,
			field: 'tamano_papel_cotizacion' 
		},
		id_formato_papel_factura:{
			type: Sequelize.INTEGER,
			field: 'formato_papel_factura' 		
		}
	}, {
	  freezeTableName: true 
	});
	
	ConfiguracionGeneralFactura.sync().then(function(){
		
	});
	
	return ConfiguracionGeneralFactura;
}


