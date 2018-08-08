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
            type: Sequelize.DECIMAL(20, 4),
            field: 'cantidad'
        },
        cantidad_despacho: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'cantidad_despacho'
        },
        saldo: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'saldo'
        },
        precio_unitario: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'precio_unitario'
        },
        importe: {
            type: Sequelize.DECIMAL(20, 4),
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
        fecha_factura: {
            type: Sequelize.DATE,
            field: 'fecha_factura'
        },
        servicio_transporte: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'servicio_transporte'
        },
        numero_correlativo: {
            type: Sequelize.INTEGER,
            field: 'numero_correlativo'
        },
        alerta: {
            type: Sequelize.BOOLEAN,
            field: 'alerta'
        },
        pago_ac: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'pago_ac'
        },
        saldo_pago_ac: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'saldo_pago_ac'
        },
        total: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'total'
        },
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        id_almacen: {
            type: Sequelize.INTEGER,
            field: 'almacen'
        },
        kardex_detalle: {
            type: Sequelize.INTEGER,
            field: 'kardex_detalle'
        },
        id_movimiento: {
            type: Sequelize.INTEGER,
            field: 'movimiento'
        },
        latitud: {
			type: Sequelize.DECIMAL(30, 20),
			field: 'latitud'
		},
		longitud: {
			type: Sequelize.DECIMAL(30, 20),
			field: 'longitud'
        },
        id_estado: {
            type: Sequelize.INTEGER,
            field: 'estado'
        },
    }, {
            freezeTableName: true
        });
    GtmDespachoDetalle.sync();

    return GtmDespachoDetalle;
}