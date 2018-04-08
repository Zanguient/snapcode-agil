module.exports = function (sequelize, Sequelize) {
    var GtmVentaKardexDetalle = sequelize.define('agil_gtm_venta_kardex_detalle', {
        id_producto: {
            type: Sequelize.INTEGER,
            field: 'producto'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        cantidad: {
            type: Sequelize.INTEGER,
            field: 'cantidad'
        },
        cantidad_despachada: {
            type: Sequelize.INTEGER,
            field: 'cantidad_despachada'
        },
        saldo: {
            type: Sequelize.INTEGER,
            field: 'saldo'
        },
        id_padre: {
            type: Sequelize.INTEGER,
            field: 'padre'
        },
        id_kardex:{
            type: Sequelize.INTEGER,
            field: 'kardex'
        },
        entregado:{
            type: Sequelize.BOOLEAN,
            field: 'entregado'
        }
    }, {
            freezeTableName: true
        });
    GtmVentaKardexDetalle.sync();

    return GtmVentaKardexDetalle;
}