module.exports = function (sequelize, Sequelize) {
    var GtmDespachoDetalleResivo = sequelize.define('agil_gtm_despacho_detalle_resivo', {
        id_despacho_detalle: {
            type: Sequelize.INTEGER,
            field: 'despacho_detalle'
        },
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        numero_correlativo: {
            type: Sequelize.INTEGER,
            field: 'numero_correlativo'
        },
        tipo_moneda: {
            type: Sequelize.BOOLEAN,
            field: 'tipo_moneda'
        },
        id_tipo_pago: {
            type: Sequelize.INTEGER,
            field: 'tipo_pago'
        },
        monto: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'monto'
        },
        cambio_moneda: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'cambio_moneda'
        },
        numero_cuenta: {
            type: Sequelize.INTEGER,
            field: 'numero_cuenta'
        },
        id_banco: {
            type: Sequelize.INTEGER,
            field: 'banco'
        },
        id_otro_banco: {
            type: Sequelize.INTEGER,
            field: 'otro_banco'
        },
        concepto: {
            type: Sequelize.STRING,
            field: 'concepto'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        }
    }, {
            freezeTableName: true
        });
        GtmDespachoDetalleResivo.sync();

    return GtmDespachoDetalleResivo;
}