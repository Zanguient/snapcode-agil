module.exports = function (sequelize, Sequelize) {
    var ActivosFijosConfiguracion = sequelize.define('agil_activos_fijos_configuracion', {
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        id_subgrupo: {
            type: Sequelize.INTEGER,
            field: 'subgrupo'
        },
        vida_util: {
            type: Sequelize.INTEGER,
            field: 'vida_util'
        },
        factor: {
            type: Sequelize.INTEGER,
            field: 'factor'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado',
            defaultValue: false
        }
    }, {
            freezeTableName: true
        });
    ActivosFijosConfiguracion.sync().then(function () {
    });
    return ActivosFijosConfiguracion;
}