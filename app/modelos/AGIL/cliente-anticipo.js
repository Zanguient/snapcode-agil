module.exports = function (sequelize, Sequelize) {
    var ClienteAnticipo = sequelize.define('agil_cliente_anticipo', {
        id_cliente: {
            type: Sequelize.INTEGER,
            field: 'cliente'
        },
        id_pago_venta: {
            type: Sequelize.INTEGER,
            field: 'pago_venta'
        },
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        id_padre: {
            type: Sequelize.INTEGER,
            field: 'padre'
        },
        monto_anticipo: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'monto_anticipo'
        },
        monto_salida: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'monto_salida'
        },
        saldo: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'saldo'
        },
        numero_correlativo_anticipo: {
            type: Sequelize.INTEGER,
            field: 'numero_correlativo_anticipo'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        },
    }, {
            freezeTableName: true
        });
        ClienteAnticipo.sync();
    return ClienteAnticipo;
}