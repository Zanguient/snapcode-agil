module.exports = function (sequelize, Sequelize) {
    var ProveedorAnticipo = sequelize.define('agil_proveedor_anticipo', {
        id_proveedor: {
            type: Sequelize.INTEGER,
            field: 'proveedor'
        },
        id_pago_compra: {
            type: Sequelize.INTEGER,
            field: 'pago_comra'
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
        numero_correlativo: {
            type: Sequelize.INTEGER,
            field: 'numero_correlativo'
        },
        
    }, {
            freezeTableName: true
        });
    ProveedorAnticipo.sync();
    return ProveedorAnticipo;
}