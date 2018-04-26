module.exports = function (sequelize, Sequelize) {
    var RrhhViaje = sequelize.define('agil_rrhh_viaje', {
        id_vehiculo: {
            type: Sequelize.INTEGER,
            field: 'vehiculo'
        },
        id_destino: {
            type: Sequelize.INTEGER,
            field: 'destino'
        },
        id_conductor: {
            type: Sequelize.INTEGER,
            field: 'conductor'
        },
        id_relacion: {
            type: Sequelize.INTEGER,
            field: 'relacion'
        },
        fecha_ingreso: {
            type: Sequelize.DATE,
            field: 'fecha_ingreso'
        },
        fecha_salida: {
            type: Sequelize.DATE,
            field: 'fecha_salida'
        }
    }, {
            freezeTableName: true
        });

    RrhhViaje.sync().then(function () {

    });

    return RrhhViaje;
}