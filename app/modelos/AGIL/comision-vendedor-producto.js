module.exports=function(sequelize,Sequelize){
	var ComisionVendedorProducto = sequelize.define('agil_comision_vendedor_producto', {
	  id_usuario: {
		type: Sequelize.INTEGER,
		field: 'usuario' 
	  },
	  id_producto: {
		type: Sequelize.INTEGER,
		field: 'sucursal' 
	  },
	  comision: {
		type: Sequelize.INTEGER,
		field: 'comision' 
	  }
	}, {
	  freezeTableName: true 
	});
	
	ComisionVendedorProducto.sync().then(function(){
		
	});
	
	return ComisionVendedorProducto;
}