module.exports = function (sequelize, Sequelize) {
    var Transaccion = sequelize.define('agil_cuenta_transaccion', {
        id_cuenta: {
            type: Sequelize.INTEGER,
            field: 'cuenta'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        detalle: {
            type: Sequelize.STRING,
            field: 'detalle'
        },
        id_cliente: {
            type: Sequelize.INTEGER,
            field: 'cliente'
        },
        id_proveedor: {
            type: Sequelize.INTEGER,
            field: 'proveedor'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        id_concepto: {
            type: Sequelize.INTEGER,
            field: 'concepto'
        },
        observaciones: {
            type: Sequelize.TEXT('medium'),
            field: 'observaciones'
        },
        ref_doc: {
            type: Sequelize.INTEGER,
            field: 'ref_doc'
        },
        tipo_doc: {
            type: Sequelize.INTEGER,
            field: 'tipo_doc'
        },
        debe: {
            type: Sequelize.DECIMAL(20,4),
            field: 'debe'
        },
        haber: {
            type: Sequelize.DECIMAL(20,4),
            field: 'haber'
        },
        saldo: {
            type: Sequelize.DECIMAL(20,4),
            field: 'saldo'
        },
        id_estado: {
            type: Sequelize.INTEGER,
            field: 'estado'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        cerrada: {
            type: Sequelize.BOOLEAN,
            field: 'cerrada'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
    }, {
            freezeTableName: true
        });
    Transaccion.sync().then(function () {
    });
    return Transaccion;
}