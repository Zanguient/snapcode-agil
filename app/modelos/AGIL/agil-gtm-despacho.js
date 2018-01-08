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
         id_producto: {
            type: Sequelize.INTEGER,
            field: 'producto'
        },
         cantidad: {
            type: Sequelize.DECIMAL(20,4),
            field: 'cantidad'
        },
         despacho: {
            type: Sequelize.DECIMAL(20,4),
            field: 'despacho'
        },
          saldo: {
            type: Sequelize.DECIMAL(20,4),
            field: 'saldo'
        },
          id_transportista: {
            type: Sequelize.INTEGER,
            field: 'transportista'
        },
          id_estibaje: {
            type: Sequelize.INTEGER,
            field: 'estibaje'
        },
          id_grupo_estibaje: {
            type: Sequelize.INTEGER,
            field: 'grupo_estibaje'
        }
    }, {
            freezeTableName: true
        });
    GtmDespacho.sync();
    
    return GtmDespacho;
}