module.exports=function(sequelize,Sequelize){
	var Sucursal = sequelize.define('agil_sucursal', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
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
	  telefono1:{
		type: Sequelize.STRING,
		field: 'telefono1'  
	  },
	  telefono2:{
		type: Sequelize.STRING,
		field: 'telefono2'  
	  },
	  telefono3:{
		type: Sequelize.STRING,
		field: 'telefono3'  
	  },
	  id_departamento:{
		type: Sequelize.INTEGER,
		field: 'departamento'  
	  },
	  id_municipio:{
		type: Sequelize.INTEGER,
		field: 'municipio'  
	  },
	  nota_venta_correlativo:{
		type: Sequelize.INTEGER,
		field: 'nota_venta_correlativo'  
	  },
	  nota_traspaso_correlativo:{
		type: Sequelize.INTEGER,
		field: 'nota_traspaso_correlativo'  
	  },
	  nota_baja_correlativo:{
		type: Sequelize.INTEGER,
		field: 'nota_baja_correlativo'  
	  },
	  pedido_correlativo:{
		type: Sequelize.INTEGER,
		field: 'pedido_correlativo'  
	  },
	  frase_pedido:{
		type: Sequelize.STRING,
		field: 'frase_pedido'  
	  },
	  copias_impresion_pedido:{
		type: Sequelize.INTEGER,
		field: 'copias_impresion_pedido'  
	  },
	  nota_recibo_correlativo:{
	  	type: Sequelize.INTEGER,
		field: 'nota_recibo_correlativo'
	  },
	  imprimir_pedido_corto:{
	  	type: Sequelize.BOOLEAN,
		field: 'imprimir_pedido_corto'
		},
		cotizacion_correlativo:{
	  	type: Sequelize.INTEGER,
		field: 'cotizacion_correlativo'
		},
		pre_factura_correlativo:{
	  	type: Sequelize.INTEGER,
		field: 'pre_factura_correlativo'
		},
		comprobante_ingreso_correlativo:{
	  	type: Sequelize.INTEGER,
		field: 'comprobante_ingreso_correlativo'
		},
		comprobante_egreso_correlativo:{
	  	type: Sequelize.INTEGER,
		field: 'comprobante_egreso_correlativo'
		},
		comprobante_traspaso_correlativo:{
	  	type: Sequelize.INTEGER,
		field: 'comprobante_traspaso_correlativo'
		}
		,
		comprobante_caja_chica_correlativo:{
	  	type: Sequelize.INTEGER,
		field: 'comprobante_caja_chica_correlativo'
		},
		reiniciar_comprobante_ingreso_correlativo:{
	  	type: Sequelize.BOOLEAN,
		field: 'reiniciar_comprobante_ingreso_correlativo'
		},
		reiniciar_comprobante_egreso_correlativo:{
	  	type: Sequelize.BOOLEAN,
		field: 'reiniciar_comprobante_egreso_correlativo'
		},
		reiniciar_comprobante_traspaso_correlativo:{
	  	type: Sequelize.BOOLEAN,
		field: 'reiniciar_comprobante_traspaso_correlativo'
		}
		,
		reiniciar_comprobante_caja_chica_correlativo:{
	  	type: Sequelize.BOOLEAN,
		field: 'reiniciar_comprobante_caja_chica_correlativo'
		},
		fecha_reinicio_correlativo:{
			type: Sequelize.DATE,
		field: 'fecha_reinicio_correlativo'
		}
	}, {
	  freezeTableName: true 
	});
	
	Sucursal.sync().then(function(){
		
	});
	
	return Sucursal;
}