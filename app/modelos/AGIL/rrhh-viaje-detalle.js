module.exports = function (sequelize, Sequelize) {
    var RrhhViajeDetalle = sequelize.define('agil_rrhh_viaje_detalle', {
        id_viaje: {
            type: Sequelize.INTEGER,
            field: 'viaje'
        },
        id_visita: {
            type: Sequelize.INTEGER,
            field: 'visita'
        },
        id_ficha: {
            type: Sequelize.INTEGER,
            field: 'ficha'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        },        
        estado: {
            type: Sequelize.BOOLEAN,
            field: 'estado'
        },
        id_tipo_viaje: {
            type: Sequelize.DATE,
            field: 'tipo_viaje'
        }
    }, {
            freezeTableName: true
        });

        RrhhViajeDetalle.sync().then(function () {

    });

    return RrhhViajeDetalle;
}