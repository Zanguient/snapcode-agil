module.exports = function (sequelize, Sequelize) {
    var GtmDespachoDetalle = sequelize.define('agil_gtm_despacho_detalle', {
        id_despacho: {
            type: Sequelize.INTEGER,
            field: 'despacho'
        },
        id_producto: {
            type: Sequelize.INTEGER,
            field: 'producto'
        },
        precio_unitario: {
          type: Sequelize.DECIMAL(20,4),
          field: 'precio_unitario'
        },
        cantidad: {
          type: Sequelize.DECIMAL(20,4),
          field: 'cantidad'
        },
        importe: {
          type: Sequelize.DECIMAL(20,4),
          field: 'importe'
        }
    }, {
            freezeTableName: true
        });
    GtmDespachoDetalle.sync();
    
    return GtmDespachoDetalle;
}