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
        id_estado: {
            type: Sequelize.INTEGER,
            field: 'estado'
        },
        id_tipo_viaje: {
            type: Sequelize.INTEGER,
            field: 'tipo_viaje'
        },
        habilitado:{
            type: Sequelize.BOOLEAN,
            field: 'habilitado'
        },
        id_campo:{
            type: Sequelize.INTEGER,
            field: 'campo'
        }
        
    }, {
            freezeTableName: true
        });

        RrhhViajeDetalle.sync().then(function () {

    });

    return RrhhViajeDetalle;
}