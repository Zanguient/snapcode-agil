module.exports = function (sequelize, Sequelize) {
    var GtmClienteDestino = sequelize.define('agil_gtm_cliente_destino', {
        id_cliente: {
            type: Sequelize.INTEGER,
            field: 'cliente'
        },
        id_destino: {
            type: Sequelize.INTEGER,
            field: 'destino'
        }
    }, {
            freezeTableName: true
        });

    GtmClienteDestino.sync();

    return GtmClienteDestino;
}