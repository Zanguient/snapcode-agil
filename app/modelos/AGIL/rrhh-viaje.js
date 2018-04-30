module.exports = function (sequelize, Sequelize) {
    var RrhhViaje = sequelize.define('agil_rrhh_viaje', {
        id_vehiculo: {
            type: Sequelize.INTEGER,
            field: 'vehiculo'
        },
        id_conductor: {
            type: Sequelize.INTEGER,
            field: 'conductor'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        id_relevo: {
            type: Sequelize.INTEGER,
            field: 'relevo'
        },
        fecha_ingreso: {
            type: Sequelize.DATE,
            field: 'fecha_ingreso'
        },
        fecha_salida: {
            type: Sequelize.DATE,
            field: 'fecha_salida'
        },
        eliminado:{
            type: Sequelize.BOOLEAN,
            field: 'relevo'
        },
        fecha:{
            type: Sequelize.DATE,
            field: 'fecha'
        }
    }, {
            freezeTableName: true
        });

    RrhhViaje.sync().then(function () {

    });

    return RrhhViaje;
}