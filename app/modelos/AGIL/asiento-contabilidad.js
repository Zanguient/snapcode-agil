module.exports = function (sequelize, Sequelize) {
    var AsientoContabilidad = sequelize.define('agil_asiento_contabilidad', {
        id_comprobante: {
            type: Sequelize.INTEGER,
            field: 'comprobante'
        },
        id_cuenta: {
            type: Sequelize.INTEGER,
            field: 'cuenta'
        },
        debe_bs: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'debe_bs'
        },
        haber_bs: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'haber_bs'
        },
        debe_sus: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'debe_sus'
        },
        haber_sus: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'haber_sus'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        },
        glosa:{
            type: Sequelize.STRING,
            field: 'glosa'
        }
    }, {
            freezeTableName: true
        });

    AsientoContabilidad.sync();

    return AsientoContabilidad;
}