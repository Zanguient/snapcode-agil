module.exports=function(sequelize,Sequelize){
	var CajaSiguienteTurno = sequelize.define('agil_caja_siguiente_turno', {
	  id_sucursal: {
		type: Sequelize.INTEGER,
		field: 'sucursal' 
	  },
	  id_cierre_caja: {
		type: Sequelize.INTEGER,
		field: 'cierre_caja'
	  },
	  id_cierre_caja_cerrado: {
		type: Sequelize.INTEGER,
		field: 'cierre_caja_cerrado'
	  }
	}, {
	  freezeTableName: true 
	});
	
	CajaSiguienteTurno.sync().then(function(){
		
	});
	
	return CajaSiguienteTurno;
}