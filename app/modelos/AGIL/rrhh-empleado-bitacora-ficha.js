
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoBitacoraFicha = sequelize.define('agil_rrhh_empleado_bitacora_ficha', {
       
        id_ficha: {
            type: Sequelize.INTEGER,
            field: 'ficha'
        },
        campo: {
            type: Sequelize.STRING,
            field: 'campo'
        },
        valor_anterior: {
            type: Sequelize.STRING,
            field: 'valor_anterior'
        },
        valor_actual: {
            type: Sequelize.STRING,
            field: 'valor_actual'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        }
    }, {
            freezeTableName: true
        });

        RrhhEmpleadoBitacoraFicha.sync().then(function () {

    });

    return RrhhEmpleadoBitacoraFicha;
}