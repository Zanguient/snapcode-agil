module.exports = function (sequelize, Sequelize) {
    var SolicitudCajaChica = sequelize.define('agil_solicitud_caja_chica', {
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        id_solicitante: {
            type: Sequelize.INTEGER,
            field: 'solicitante'
        },
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        id_concepto: {
            type: Sequelize.INTEGER,
            field: 'concepto'
        },
        detalle: {
            type: Sequelize.TEXT("long"),
            field: 'detalle'
        },
        monto: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'monto',
        },       
        
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        },
        id_estado: {
            type: Sequelize.INTEGER,
            field: 'estado'
        }
    }, {
            freezeTableName: true
        });
    SolicitudCajaChica.sync().then(function () {
    });
    return SolicitudCajaChica;
}