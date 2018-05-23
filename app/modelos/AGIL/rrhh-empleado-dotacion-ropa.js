
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoDotacionRopa = sequelize.define('agil_rrhh_empleado_dotacion_ropa', {
        fecha : {
            type: Sequelize.DATE,
            field: 'fecha'
        },   
        fecha_vencimiento : {
            type: Sequelize.DATE,
            field: 'fecha_vencimiento'
        },       
        id_cumplimiento : {
            type: Sequelize.INTEGER,
            field: 'cumplimiento'
        },
        id_periodo: {
            type: Sequelize.INTEGER,
            field: 'periodo'
        },
        id_estado: {
            type: Sequelize.INTEGER,
            field: 'estado'
        },
        id_empleado: {
            type: Sequelize.INTEGER,
            field: 'empleado'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        id_sucursal: {
            type: Sequelize.INTEGER,
            field: 'sucursal'
        },
        id_almacen: {
            type: Sequelize.INTEGER,
            field: 'almacen'
        },
        observacion: {
            type: Sequelize.STRING,
            field: 'observacion'
        },        
        numero: {
            type: Sequelize.INTEGER,
            field: 'numero'
        },
        eliminado:{
            type: Sequelize.BOOLEAN,
            field: 'eliminado'
        }
    }, {
            freezeTableName: true
        });

        RrhhEmpleadoDotacionRopa.sync().then(function () {

    });

    return RrhhEmpleadoDotacionRopa;
}