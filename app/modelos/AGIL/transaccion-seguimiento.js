module.exports = function (sequelize, Sequelize) {
    var Seguimiento = sequelize.define('agil_transaccion_seguimiento', {
        id_transaccion: {
            type: Sequelize.INTEGER,
            field: 'transaccion'
        },
        proveedor: {
            type: Sequelize.BOOLEAN,
            field: 'proveedor'
        },
        id_entregado: {
            type: Sequelize.INTEGER,
            field: 'entregado'
        },
        id_devuelto: {
            type: Sequelize.INTEGER,
            field: 'devuelto'
        },
        fecha_entrega: {
            type: Sequelize.DATE,
            field: 'fecha_entrega'
        },
        fecha_devolucion: {
            type: Sequelize.DATE,
            field: 'fecha_devolucion'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
    }, {
            freezeTableName: true
        });
    Seguimiento.sync().then(function () {
    });
    return Seguimiento;
}