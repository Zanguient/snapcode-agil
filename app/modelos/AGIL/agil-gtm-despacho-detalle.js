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
        cantidad: {
           type: Sequelize.DECIMAL(20,4),
           field: 'cantidad'
       },
        cantidad_despacho: {
           type: Sequelize.DECIMAL(20,4),
           field: 'cantidad_despacho'
       },
         saldo: {
           type: Sequelize.DECIMAL(20,4),
           field: 'saldo'
       },
       precio_unitario: {
         type: Sequelize.DECIMAL(20,4),
         field: 'precio_unitario'
       },
       importe: {
         type: Sequelize.DECIMAL(20,4),
         field: 'importe'
       },
         id_transportista: {
           type: Sequelize.INTEGER,
           field: 'transportista'
       },
         id_estibaje: {
           type: Sequelize.INTEGER,
           field: 'estibaje'
       },
         id_grupo_estibaje: {
           type: Sequelize.INTEGER,
           field: 'grupo_estibaje'
       },
       despachado: {
            type: Sequelize.BOOLEAN,
            field: 'despachado'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        },
        factura: {
            type: Sequelize.INTEGER,
            field: 'factura'
        },
        id_padre: {
            type: Sequelize.INTEGER,
            field: 'padre'
        },
        fecha: {
           type: Sequelize.DATE,
           field: 'fecha'
       },
       servicio_transporte: {
          type: Sequelize.DECIMAL(20,4),
          field: 'servicio_transporte'
      }
    }, {
            freezeTableName: true
        });
    GtmDespachoDetalle.sync();
    
    return GtmDespachoDetalle;
}