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
            type: Sequelize.DECIMAL(20,4),
            field: 'cantidad'
        },
        cantidad_despachada: {
            type: Sequelize.DECIMAL(20,4),
            field: 'cantidad_despachada'
        },
        saldo: {
            type: Sequelize.DECIMAL(20,4),
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
        },
        factura: {
            type: Sequelize.INTEGER,
            field: 'factura'
        },
        precio_unitario: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'precio_unitario'
        },
        servicio_transporte: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'servicio_transporte'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
    }, {
            freezeTableName: true
        });
    GtmVentaKardexDetalle.sync();

    return GtmVentaKardexDetalle;
}