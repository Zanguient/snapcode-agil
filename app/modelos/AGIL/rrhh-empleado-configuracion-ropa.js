
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoConfiguracionRopa = sequelize.define('agil_rrhh_empleado_configuracion_ropa', {
        id_ropa_trabajo: {
            type: Sequelize.INTEGER,
            field: 'ropa_trabajo'
        },       
        id_cargo : {
            type: Sequelize.INTEGER,
            field: 'cargo'
        },
        cantidad: {
            type: Sequelize.INTEGER,
            field: 'cantidad'
        }
    }, {
            freezeTableName: true
        });

        RrhhEmpleadoConfiguracionRopa.sync().then(function () {

    });

    return RrhhEmpleadoConfiguracionRopa;
}