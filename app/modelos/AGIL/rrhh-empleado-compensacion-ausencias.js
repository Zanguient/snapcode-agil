
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoCompensacionAusencia = sequelize.define('agil_rrhh_empleado_compensacion_ausencia', {
        id_ausencia: {
            type: Sequelize.INTEGER,
            field: 'ausencia'
        },       
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        hora_inicio: {
            type: Sequelize.TIME,
            field: 'hora_inicio'
        },       
        hora_fin: {
            type: Sequelize.TIME,
            field: 'hora_fin'
        },
        tiempo: {
            type: Sequelize.TIME,
            field: 'tiempo'
        },
        eliminado:{
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
        
    }, {
            freezeTableName: true
        });

        RrhhEmpleadoCompensacionAusencia.sync().then(function () {

    });

    return RrhhEmpleadoCompensacionAusencia;
}