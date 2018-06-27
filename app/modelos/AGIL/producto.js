module.exports=function(sequelize,Sequelize){
	var Producto = sequelize.define('agil_producto', {
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa' 
	  },
	  nombre: {
		type: Sequelize.STRING,
		field: 'nombre'
	  },
	  imagen:{
		type: Sequelize.STRING,
		field: 'imagen' 
	  },
	  codigo: {
		type: Sequelize.STRING,
		field: 'codigo'
	  },
	  unidad_medida: {
		type: Sequelize.STRING,
		field: 'unidad_medida'
	  },
	  precio_unitario: {
		type: Sequelize.DECIMAL(20,4),
		field: 'precio_unitario'
	  },
	  utilidad_esperada: {
		type: Sequelize.DECIMAL(20,4),
		field: 'utilidad_esperada'
	  },
	  inventario_minimo:{
		type: Sequelize.INTEGER,
		field: 'inventario_minimo'  
	  },
	  descripcion: {
		type: Sequelize.STRING,
		field: 'descripcion'
	  },
	  id_grupo: {
		type: Sequelize.INTEGER,
		field: 'grupo'
	  },
	  id_subgrupo:{
		type: Sequelize.INTEGER,
		field: 'subgrupo'  
	  },
	  caracteristica_especial1:{
		type: Sequelize.STRING,
		field: 'caracteristica_especial1'  
	  },
	  caracteristica_especial2:{
		type: Sequelize.STRING,
		field: 'caracteristica_especial2'  
	  },
	  codigo_fabrica:{
		type: Sequelize.STRING,
		field: 'codigo_fabrica'  
	  },
	  comision: {
		type: Sequelize.DECIMAL(20,4),
		field: 'comision'
	  },
	  publicar_panel:{
		type: Sequelize.BOOLEAN,
		field: 'publicar_panel'  
	  },
	  alerta:{
		type: Sequelize.INTEGER,
		field: 'alerta'  
	  },
	  descuento: {
		type: Sequelize.DECIMAL(20,4),
		field: 'descuento'
	  },
	  descuento_fijo: {
		type: Sequelize.BOOLEAN,
		field: 'descuento_fijo'
	  },
	  id_tipo_producto: {
		type: Sequelize.INTEGER,
		field: 'tipo_producto'
	  },
	  activar_inventario:{
		type: Sequelize.BOOLEAN,
		field: 'activar_inventario'  
	  },
	  id_almacen_erp: {
		type: Sequelize.INTEGER,
		field: 'almacen_erp'
	  },
	  id_cuenta: {
		type: Sequelize.INTEGER,
		field: 'cuenta'
	  },
	  marca:{
		type: Sequelize.STRING,
		field: 'marca'  
	  },
	  modelo:{
		type: Sequelize.STRING,
		field: 'modelo'  
	  },
	  anio:{
		type: Sequelize.STRING,
		field: 'anio'  
		},
		rango_positivo: {
			type: Sequelize.DECIMAL(20,4),
			field: 'rango_positivo'
			},
			rango_negativo: {
			type: Sequelize.DECIMAL(20,4),
			field: 'rango_negativo'
			},
			activo_fijo: {
				type: Sequelize.BOOLEAN,
				field: 'activo_fijo'
				}
	}, {
	  freezeTableName: true 
	});
	
	Producto.sync().then(function(){
		
	});
	
	return Producto;
}