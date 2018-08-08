module.exports = function (sequelize, Sequelize) {
	var GtmTransportista = sequelize.define('agil_gtm_transportista', {
		id_persona: {
			type: Sequelize.INTEGER,
			field: 'persona'
		},
		vehiculo: {
			type: Sequelize.STRING,
			field: 'vehiculo'
		},
		codigo: {
			type: Sequelize.STRING,
			field: 'codigo'
		},
		capacidad: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'capacidad'
		},
		nit: {
			type: Sequelize.BIGINT,
			field: 'nit'
		},
		costo_transporte: {
			type: Sequelize.DECIMAL(20, 4),
			field: 'costo_transporte'
		},
		id_empresa: {
			type: Sequelize.INTEGER,
			field: 'empresa'
		},
		observacion: {
			type: Sequelize.STRING,
			field: 'observacion'
		},
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		},
		activo: {
			type: Sequelize.BOOLEAN,
			field: 'activo'
		}
	}, {
			freezeTableName: true
		});

	GtmTransportista.sync();

	return GtmTransportista;
}