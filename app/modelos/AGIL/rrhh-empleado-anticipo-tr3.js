
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoAnticipoTr3 = sequelize.define('agil_rrhh_anticipo_tr3', {
        id_anticipo: {
            type: Sequelize.INTEGER,
            field: 'anticipo'
        },
        id_tr3: {
            type: Sequelize.INTEGER,
            field: 'tr3'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado',
            defaultValue: false
        }

    }, {
            freezeTableName: true
        });

        RrhhEmpleadoAnticipoTr3.sync().then(function () {

    });

    return RrhhEmpleadoAnticipoTr3;
}