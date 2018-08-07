module.exports = function (sequelize, Sequelize) {
    var CajaChica = sequelize.define('agil_caja_chica', {       
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        ingreso: {
            type: Sequelize.DECIMAL(20,4),
            field: 'revaluado'
        },
        egreso: {
            type: Sequelize.DECIMAL(20,4),
            field: 'eliminado',
          
        },
        saldo: {
            type: Sequelize.DECIMAL(20,4),
            field: 'eliminado',
          
        }
    }, {
            freezeTableName: true
        });
        CajaChica.sync().then(function () {
    });
    return CajaChica;
}