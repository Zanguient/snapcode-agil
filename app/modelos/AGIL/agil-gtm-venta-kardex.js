module.exports = function (sequelize, Sequelize) {
    var GtmVentaKardex = sequelize.define('agil_gtm_venta_kardex', {      
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
       
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        id_cliente: {
            type: Sequelize.INTEGER,
            field: 'cliente'
        },
        id_cliente_razon: {
           type: Sequelize.INTEGER,
           field: 'cliente_razon'
        },
        factura:{
            type: Sequelize.BOOLEAN,
            field: 'factura'
        },
        observacion: {
            type: Sequelize.STRING,
            field: 'observacion'
        },
        eliminar: {
            type: Sequelize.BOOLEAN,
            field: 'eliminar'
        }
    }, {
            freezeTableName: true
        });
    GtmVentaKardex.sync();

    return GtmVentaKardex;
}