
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoDotacionRopaItem = sequelize.define('agil_rrhh_empleado_dotacion_ropa_item', {
        id_dotacion_ropa: {
            type: Sequelize.INTEGER,
            field: 'dotacion_ropa'
        },
        id_producto: {
            type: Sequelize.INTEGER,
            field: 'producto'
        },
        entregado: {
            type: Sequelize.BOOLEAN,
            field: 'entregado'
        },
        id_ropa_trabajo: {
            type: Sequelize.INTEGER,
            field: 'ropa'
        },
        id_cargo: {
            type: Sequelize.INTEGER,
            field: 'cargo'
        },
        cantidad: {
            type: Sequelize.INTEGER,
            field: 'cantidad'
        },
        anterior:{
            type: Sequelize.BOOLEAN,
            field: 'anterior' 
        }
    }, {
            freezeTableName: true
        });

    RrhhEmpleadoDotacionRopaItem.sync().then(function () {

    });

    return RrhhEmpleadoDotacionRopaItem;
}