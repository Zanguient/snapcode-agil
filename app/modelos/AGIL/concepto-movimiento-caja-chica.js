module.exports = function (sequelize, Sequelize) {
    var ConceptoMovimientoCajaChica = sequelize.define('agil_concepto_movimiento_caja_chica', {
        nombre: {
            type: Sequelize.STRING,
            field: 'nombre'
        },
        id_movimiento: {
            type: Sequelize.INTEGER,
            field: 'movimiento'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        habilitado: {
            type: Sequelize.BOOLEAN,
            field: 'habilitado'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado',
            defaultValue: false
        }
    }, {
            freezeTableName: true
        });
        ConceptoMovimientoCajaChica.sync().then(function () {
    });
    return ConceptoMovimientoCajaChica;
}