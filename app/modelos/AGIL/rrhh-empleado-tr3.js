
module.exports = function (sequelize, Sequelize) {
    var RrhhEmpleadoTr3 = sequelize.define('agil_rrhh_tr3', {
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        id_cuenta: {
            type: Sequelize.INTEGER,
            field: 'cuenta'
        },
        id_departamento: {
            type: Sequelize.INTEGER,
            field: 'departamento'
        },
        planilla: {
            type: Sequelize.STRING,
            field: 'planilla'
        },
        nombre_archivo: {
            type: Sequelize.STRING,
            field: 'nombre_archivo'
        },
        nombre_planilla: {
            type: Sequelize.STRING,
            field: 'nombre_planilla'
        },
        numero_planilla: {
            type: Sequelize.INTEGER,
            field: 'numero_planilla'
        },
        origen_fondos: {
            type: Sequelize.STRING,
            field: 'origen_fondos'
        },
        destino_fondos: {
            type: Sequelize.STRING,
            field: 'destino_fondos'
        },
        dirigido_para: {
            type: Sequelize.STRING,
            field: 'dirigido_para'
        },
        cargo: {
            type: Sequelize.STRING,
            field: 'cargo'
        },
        firma_uno: {
            type: Sequelize.STRING,
            field: 'firma_uno'
        },
        firma_dos: {
            type: Sequelize.STRING,
            field: 'firma_dos'
        },
        firma_tres: {
            type: Sequelize.STRING,
            field: 'firma_tres'
        },
        firma_cuatro: {
            type: Sequelize.STRING,
            field: 'firma_cuatro'
        },
       
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado',
            defaultValue:false
        }

    }, {
            freezeTableName: true
        });

        RrhhEmpleadoTr3.sync().then(function () {

    });

    return RrhhEmpleadoTr3;
}