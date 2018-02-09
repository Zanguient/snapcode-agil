module.exports=function(sequelize,Sequelize){
	var VentaFarmacia = sequelize.define('inv_venta_farmacia', {
	  id_venta: {
		type: Sequelize.INTEGER,
		field: 'venta' 
	  },
	  diagnostico: {
		type: Sequelize.STRING,
		field: 'diagnostico' 
	  },
	  observaciones: {
		type: Sequelize.STRING,
		field: 'observaciones' 
	  },
	  numero_receta: {
		type: Sequelize.INTEGER,
		field: 'numero_receta' 
	  },
	  id_paciente: {
		type: Sequelize.INTEGER,
		field: 'id_paciente'
	  }
	 }, {
	  freezeTableName: true 
	});
	
	VentaFarmacia.sync().then(function(){
		
	});
	
	return VentaFarmacia;
}