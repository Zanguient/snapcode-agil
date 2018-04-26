module.exports = function (sequelize, Sequelize) {
    var RrhhViajeDestino = sequelize.define('agil_rrhh_viaje_destino', {
        id_viaje: {
            type: Sequelize.INTEGER,
            field: 'viaje'
        },
        id_destino: {
            type: Sequelize.INTEGER,
            field: 'destino'
        },
    }, {
            freezeTableName: true
        });

    RrhhViajeDestino.sync().then(function () {

    });

    return RrhhViajeDestino;
}