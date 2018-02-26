
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoAusencia = sequelize.define('agil_rrhh_empleado_ausencia', {
        id_empleado: {
            type: Sequelize.INTEGER,
            field: 'empleado'
        },
        id_tipo: {
            type: Sequelize.INTEGER,
            field: 'tipo'
        },
        fecha_inicio: {
            type: Sequelize.DATE,
            field: 'fecha_inicio'
        },
        fecha_fin: {
            type: Sequelize.DATE,
            field: 'fecha_fin'
        },
        diagnostico: {
            type: Sequelize.STRING,
            field: 'diagnostico'
        },
        observacion: {
            type: Sequelize.STRING,
            field: 'observacion'
        },
        dias: {
            type: Sequelize.INTEGER,
            field: 'dias'
        },
        eliminado:{
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        },
        primera_baja:{
            type: Sequelize.BOOLEAN,
            field: 'primera_baja'
        },
        horas: {
            type: Sequelize.TIME,
            field: 'horas'
        },
        planilla:{
            type: Sequelize.BOOLEAN,
            field: 'planilla'
        }
    }, {
            freezeTableName: true
        });

        RrhhEmpleadoAusencia.sync().then(function () {

    });

    return RrhhEmpleadoAusencia;
}