module.exports = function (sequelize, Sequelize) {
	var MantenimientoOrdenTrabajoServicioExterno = sequelize.define('agil_mantenimiento_orden_trabajo_servicio_externo', {
		id_orden_trabajo: {
			type: Sequelize.INTEGER,
			field: 'orden_trabajo'
		},
		empresa: {
			type: Sequelize.STRING,
			field: 'empresa'
		},
		servicio: {
			type: Sequelize.STRING,
			field: 'servicio'
		},
		fecha_inicio: {
			type: Sequelize.DATE,
			field: 'fecha_inicio'
		},
		fecha_fin: {
			type: Sequelize.DATE,
			field: 'fecha_fin'
		},
		numero_factura: {
			type: Sequelize.INTEGER,
			field: 'numero_factura'
		},
		 importe: {
		type: Sequelize.DECIMAL(20,4),
		field: 'importe' 
	  },
	}, {
			freezeTableName: true
		});

	MantenimientoOrdenTrabajoServicioExterno.sync().then(function () {

	});

	return MantenimientoOrdenTrabajoServicioExterno;
}