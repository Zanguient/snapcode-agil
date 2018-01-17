module.exports = function (sequelize, Sequelize) {
    var GtmDestino = sequelize.define('agil_gtm_destino', {
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        codigo: {
            type: Sequelize.STRING,
            field: 'codigo'
        },
        destino: {
            type: Sequelize.STRING,
            field: 'destino'
        },
        direccion: {
            type: Sequelize.STRING,
            field: 'direccion'
        },
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		}
    }, {
            freezeTableName: true
        });

    GtmDestino.sync();

    return GtmDestino;
}