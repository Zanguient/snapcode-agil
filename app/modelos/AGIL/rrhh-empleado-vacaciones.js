
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoVacaciones = sequelize.define('agil_rrhh_empleado_vacaciones', {
   /*      id_empleado: {
            type: Sequelize.INTEGER,
            field: 'empleado'
        }, */
        id_ficha: {
            type: Sequelize.INTEGER,
            field: 'ficha'
        },
        sabado: {
            type: Sequelize.BOOLEAN,
            field: 'sabado'
        },
        fecha_inicio: {
            type: Sequelize.DATE,
            field: 'fecha_inicio'
        },
        fecha_fin: {
            type: Sequelize.DATE,
            field: 'fecha_fin'
        },       
        observacion: {
            type: Sequelize.STRING,
            field: 'observacion'
        },
        dias: {
            type: Sequelize.STRING,
            field: 'dias'
        },
        inicio_tipo: {
            type: Sequelize.BOOLEAN,
            field: 'inicio_tipo'
        },
        fin_tipo: {
            type: Sequelize.BOOLEAN,
            field: 'fin_tipo'
        },
        eliminado:{
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
    }, {
            freezeTableName: true
        });

        RrhhEmpleadoVacaciones.sync().then(function () {

    });

    return RrhhEmpleadoVacaciones;
}