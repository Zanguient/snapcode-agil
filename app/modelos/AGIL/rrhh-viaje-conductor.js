module.exports = function (sequelize, Sequelize) {
    var RrhhViajeConductor = sequelize.define('agil_rrhh_viaje_conductor', {
        id_empleado: {
            type: Sequelize.INTEGER,
            field: 'empleado'
        }, 
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },        
        nombre: {
            type: Sequelize.STRING,
            field: 'nombre'
        },
        licencia: {
            type: Sequelize.INTEGER,
            field: 'licencia'
        },
        id_tipo_licencia: {
            type: Sequelize.INTEGER,
            field: 'tipo_licencia'
        },
        habilitado:{
            type: Sequelize.BOOLEAN,
            field: 'habilitado'
        }
        
    }, {
            freezeTableName: true
        });

    RrhhViajeConductor.sync().then(function () {

    });

    return RrhhViajeConductor;
}