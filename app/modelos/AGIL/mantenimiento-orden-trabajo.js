module.exports = function (sequelize, Sequelize) {
    var MantenimientoOrdenTrabajo = sequelize.define('agil_mantenimiento_orden_trabajo', {
        id_producto: {
            type: Sequelize.INTEGER,
            field: 'producto'
        },
        observacion: {
            type: Sequelize.STRING,
            field: 'observacion'
        },
        diagnostico: {
            type: Sequelize.STRING,
            field: 'diagnostico'
        },
        id_prioridad: {
            type: Sequelize.INTEGER,
            field: 'prioridad'
        },
        tiempo_estimado: {
            type: Sequelize.STRING,
            field: 'tiempo_estimado'
        },
        fecha_hora_aviso: {
            type: Sequelize.DATE,
            field: 'fecha_hora_aviso'
        },
        fecha_hora_inicio: {
            type: Sequelize.DATE,
            field: 'fecha_hora_inicio'
        },
          fecha_hora_fin: {
            type: Sequelize.DATE,
            field: 'fecha_hora_fin'
        },
        id_tipo_mantenimiento: {
            type: Sequelize.INTEGER,
            field: 'tipo_mantenimiento'
        },
    }, {
            freezeTableName: true
        });

    MantenimientoOrdenTrabajo.sync().then(function () {

    });

    return MantenimientoOrdenTrabajo;
}