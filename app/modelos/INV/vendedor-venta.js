module.exports=function(sequelize,Sequelize){
	var VendedorVenta = sequelize.define('inv_vendedor_venta', {
	  id_persona: {
		type: Sequelize.INTEGER,
		field: 'persona'
	  },
	  id_empresa: {
		type: Sequelize.INTEGER,
		field: 'empresa'
	  },
	  codigo: {
		type: Sequelize.STRING,
		field: 'codigo'
	  }
	}, {
	  freezeTableName: true 
	});
	
	VendedorVenta.sync();
	
	return VendedorVenta;
}