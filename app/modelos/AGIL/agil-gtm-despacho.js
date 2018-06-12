module.exports = function (sequelize, Sequelize) {
    var GtmDespacho = sequelize.define('agil_gtm_despacho', {
        id_destino: {
            type: Sequelize.INTEGER,
            field: 'destino'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
         id_cliente: {
            type: Sequelize.INTEGER,
            field: 'cliente'
        },
        id_cliente_razon: {
           type: Sequelize.INTEGER,
           field: 'cliente_razon'
       },
         fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
       observacion: {
            type: Sequelize.STRING,
            field: 'observacion'
        }
    }, {
            freezeTableName: true
        });
    GtmDespacho.sync();
    
    return GtmDespacho;
}