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
        nit: {
            type: Sequelize.INTEGER,
            field: 'nit'
        },
        razon_social: {
            type: Sequelize.STRING,
            field: 'razon_social'
        },
        factura:{
            type: Sequelize.BOOLEAN,
            field: 'factura'
        }
    }, {
            freezeTableName: true
        });
    GtmVentaKardex.sync();

    return GtmVentaKardex;
}