module.exports = function (sequelize, Sequelize) {
    var ComprobanteContabilidad = sequelize.define('agil_comprobante_contabilidad', {
        id_tipo: {
            type: Sequelize.INTEGER,
            field: 'tipo'
        },
        abierto: {
            type: Sequelize.BOOLEAN,
            field: 'abierto'
        },
        numero: {
            type: Sequelize.INTEGER,
            field: 'numero'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        gloza: {
            type: Sequelize.STRING,
            field: 'gloza'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        },
        importe: {
            type: Sequelize.DECIMAL(20,4),
            field: 'importe'
        },
        favorito: {
            type: Sequelize.BOOLEAN,
            field: 'favorito'
        }
    }, {
            freezeTableName: true
        });

    ComprobanteContabilidad.sync();

    return ComprobanteContabilidad;
}