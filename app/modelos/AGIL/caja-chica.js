module.exports = function (sequelize, Sequelize) {
    var CajaChica = sequelize.define('agil_caja_chica', {
        id_solicitud: {
            type: Sequelize.INTEGER,
            field: 'solicitud'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        id_cuenta: {
            type: Sequelize.INTEGER,
            field: 'cuenta'
        },
        id_concepto: {
            type: Sequelize.INTEGER,
            field: 'concepto'
        },
        detalle: {
            type: Sequelize.TEXT("long"),
            field: 'detalle'
        },
        id_compra: {
            type: Sequelize.INTEGER,
            field: 'compra'
        },
        monto: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'monto'
        },
        pagado: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'pagado'
        },
        saldo: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'saldo'
        },
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        id_padre: {
            type: Sequelize.INTEGER,
            field: 'padre'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado',
            default: false
        },
        cerrada: {
            type: Sequelize.BOOLEAN,
            field: 'cerrada',
            default: false
        },
		id_cierre_caja_chica: {
			type: Sequelize.INTEGER,
			field: 'cierre_caja_chica'
        },
        numero_correlativo: {
			type: Sequelize.INTEGER,
			field: 'numero_correlativo'
		}
    }, {
            freezeTableName: true
        });
    CajaChica.sync().then(function () {
    });
    return CajaChica;
}