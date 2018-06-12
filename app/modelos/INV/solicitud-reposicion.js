module.exports = function (sequelize, Sequelize) {
	var SolicitudReposicion = sequelize.define('inv_solicitud_reposicion', {
		id_movimiento:{
			type: Sequelize.INTEGER,
			field:'movimiento'
		},
		id_almacen: {
			type: Sequelize.INTEGER,
			field: 'almacen'
		},
		fecha: {
			type: Sequelize.DATE,
			field: 'fecha'
		},
		id_usuario: {
			type: Sequelize.INTEGER,
			field: 'usuario'
		},
		activo: {
			type: Sequelize.BOOLEAN,
			field: 'activo'
		},
		monto: {
			type: Sequelize.DECIMAL(20,4),
			field: 'monto'
		},
		id_pedido: {
			type: Sequelize.INTEGER,
			field: 'pedido'
		},
		id_comprobante: {
			type: Sequelize.INTEGER,
			field: 'comprobante'
		},
		id_compra: {
			type: Sequelize.INTEGER,
			field: 'compra'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado',
			defaultValue: 0
		}
	}, {
			freezeTableName: true
		});

	SolicitudReposicion.sync().then(function () {

	});

	return SolicitudReposicion;
}