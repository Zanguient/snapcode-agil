module.exports = function (sequelize, Sequelize) {
    var Pedidos = sequelize.define('agil_pedidos', {
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        id_proveedor: {
            type: Sequelize.INTEGER,
            field: 'proveedor'
        },
        id_compra: {
            type: Sequelize.INTEGER,
            field: 'compra'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        recibido: {
            type: Sequelize.BOOLEAN,
            field: 'recibido'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
    }, {
            freezeTableName: true
        });
        Pedidos.sync().then(function () {
    });
    return Pedidos;
}