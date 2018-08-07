module.exports = function (sequelize, Sequelize) {
	var DetalleCierreCajaChica = sequelize.define('agil_detalle_cierre_caja_chica', {
		id_caja_chica: {
			type: Sequelize.INTEGER,
			field: 'id_caja_chica'
		},
		id_cierre_caja_chica: {
			type: Sequelize.INTEGER,
			field: 'cierre_caja_chica'
		}
	}, {
			freezeTableName: true
		});

		DetalleCierreCajaChica.sync().then(function () {

	});

	return DetalleCierreCajaChica;
}