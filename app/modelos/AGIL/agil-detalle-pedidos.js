module.exports = function (sequelize, Sequelize) {
    var DetallesPedidos = sequelize.define('agil_detalles_pedidos', {
        id_pedido: {
            type: Sequelize.INTEGER,
            field: 'pedido'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        id_producto: {
            type: Sequelize.INTEGER,
            field: 'producto'
        },
        cantidad: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'cantidad'
        },
        recibido: {
            type: Sequelize.BOOLEAN,
            field: 'recibido'
        },
        observacion: {
            type: Sequelize.STRING,
            field: 'observacion'
        },
        id_solicitud: {
            type: Sequelize.INTEGER,
            field: 'solicitud'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
    }, {
            freezeTableName: true
        });
    DetallesPedidos.sync().then(function () {
    });
    return DetallesPedidos;
}