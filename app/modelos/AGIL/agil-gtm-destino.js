module.exports = function (sequelize, Sequelize) {
    var GtmDestino = sequelize.define('agil_gtm_destino', {
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        destino: {
            type: Sequelize.STRING,
            field: 'destino'
        },
        direccion: {
            type: Sequelize.STRING,
            field: 'direccion'
        }
    }, {
            freezeTableName: true
        });

    GtmDestino.sync();

    return GtmDestino;
}