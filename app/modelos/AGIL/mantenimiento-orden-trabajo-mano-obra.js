module.exports=function(sequelize,Sequelize){
	var MantenimientoOrdenTrabajoManoObra = sequelize.define('agil_mantenimiento_orden_trabajo_mano_obra', {
	  id_orden_trabajo: {
			type: Sequelize.INTEGER,
			field: 'orden_trabajo'
		},
		id_especialidad: {
			type: Sequelize.INTEGER,
			field: 'especialidad'
		},
		fecha_inicio: {
			type: Sequelize.DATE,
			field: 'fecha_inicio'
		},
		fecha_fin: {
			type: Sequelize.DATE,
			field: 'fecha_fin'
		},
		diagnostico: {
			type: Sequelize.STRING,
			field: 'diagnostico'
		},
		id_persona:{
			type: Sequelize.INTEGER,
			field: 'persona'
		}
	}, {
	  freezeTableName: true 
	});
	
	MantenimientoOrdenTrabajoManoObra.sync().then(function(){
		
	});
	
	return MantenimientoOrdenTrabajoManoObra;
}