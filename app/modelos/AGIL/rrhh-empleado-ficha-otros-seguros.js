module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoFichaOtrosSeguros = sequelize.define('agil_rrhh_empleado_ficha_otros_seguros', {
      /*   id_empleado: {
            type: Sequelize.INTEGER,
            field: 'empleado'
        }, */
        id_ficha: {
            type: Sequelize.INTEGER,
            field: 'ficha'
        },
        id_tipo_seguro: {
            type: Sequelize.INTEGER,
            field: 'tipo_seguro'
        },
        monto: {
            type: Sequelize.DECIMAL(20, 4),
            field: 'monto'
        },
        observacion: {
            type: Sequelize.STRING,
            field: 'observacion'
        }

    }, {
            freezeTableName: true
        });

    RrhhEmpleadoFichaOtrosSeguros.sync().then(function () {

    });

    return RrhhEmpleadoFichaOtrosSeguros;
}