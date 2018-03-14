module.exports = function (sequelize, Sequelize) {
	var DetalleProforma = sequelize.define('agil_detalle_proforma', {
		id_proforma: {
			type: Sequelize.INTEGER,
			field: 'proforma'
		},
		id_servicio: {
			type: Sequelize.INTEGER,
			field: 'servicio'
		},
		precio_unitario: {
			type: Sequelize.DECIMAL(20,4),
			field: 'precio_unitario'
		},
		cantidad: {
			type: Sequelize.INTEGER,
			field: 'cantidad'
		},
		importe: {
			type: Sequelize.DECIMAL(20,4),
			field: 'importe'
		},
		id_centro_costo: {
			type: Sequelize.INTEGER,
			field: 'centro_costo'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
			}
	}, {
			freezeTableName: true
		});
	DetalleProforma.sync().then(function () {
	});
	return DetalleProforma;
}