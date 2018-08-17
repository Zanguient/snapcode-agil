module.exports = function (sequelize, Sequelize) {
    var ActivosFijos = sequelize.define('agil_activos_fijos', {
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        id_producto: {
            type: Sequelize.INTEGER,
            field: 'producto'
        },
        fecha_ingreso: {
            type: Sequelize.DATE,
            field: 'fecha_ingreso'
        },
        ultima_actualizacion : {
            type: Sequelize.DATE,
            field: 'ultima_actualizacion'
        },
        revaluado: {
            type: Sequelize.BOOLEAN,
            field: 'revaluado'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado',
            defaultValue: false
        }
    }, {
            freezeTableName: true
        });
    ActivosFijos.sync().then(function () {
    });
    return ActivosFijos;
}