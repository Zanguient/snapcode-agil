module.exports = function (sequelize, Sequelize) {
    var Proforma = sequelize.define('agil_proforma', {
        fecha_proforma: {
            type: Sequelize.DATE,
            field: 'fecha_proforma'
        },
        fecha_proforma_ok: {
            type: Sequelize.DATE,
            field: 'fecha_proforma_ok'
        },
        fecha_recepcion: {
            type: Sequelize.DATE,
            field: 'fecha_recepcion'
        },
        fecha_factura: {
            type: Sequelize.DATE,
            field: 'fecha_factura'
        },
        fecha_cobro: {
            type: Sequelize.DATE,
            field: 'fecha_cobro'
        },
        periodo_mes: {
            type: Sequelize.INTEGER,
            field: 'periodo_mes'
        },
        periodo_anio: {
            type: Sequelize.INTEGER,
            field: 'periodo_anio'
        },
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        id_actividad: {
            type: Sequelize.INTEGER,
            field: 'actividad'
        },
        id_cliente: {
            type: Sequelize.INTEGER,
            field: 'cliente'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        detalle: {
            type: Sequelize.TEXT,
            field: 'detalle'
        },
        totalImporteBs: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'monto'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        descripcion: {
            type: Sequelize.TEXT,
            field: 'descripcion_factura'
        },
        factura: {
            type: Sequelize.INTEGER,
            field: 'factura'
        },
        autorizacion: {
            type: Sequelize.INTEGER,
            field: 'autorizacion'
        },
        fecha_limite_emision:{
            type: Sequelize.DATE,
            field:'fecha_limite_emision'
        },
        id_movimiento: {
            type: Sequelize.INTEGER,
            field: 'movimiento'
        },
        codigo_control:{
            type: Sequelize.STRING,
            field:'codigo_control'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
    }, {
            freezeTableName: true
        });
    Proforma.sync().then(function () {
    });
    return Proforma;
}