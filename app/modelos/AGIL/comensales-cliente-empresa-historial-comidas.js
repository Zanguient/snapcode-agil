module.exports = function (sequelize, Sequelize) {
    var HistorialComidaClienteEmpresa = sequelize.define('agil_comensales_historial_comida_cliente_empresa', {
        id_cliente: {
            type: Sequelize.INTEGER,
            field: 'cliente'
        },
        id_comensal: {
            type: Sequelize.INTEGER,
            field: 'comensal'
        },
        fecha: {
            type: Sequelize.DATE,
            field: 'fecha'
        },
        tarjeta: {
            type: Sequelize.INTEGER.UNSIGNED,
            field: 'tarjeta'
        },
        id_gerencia: {
            type: Sequelize.INTEGER,
            field: 'gerencia'
        },
        id_comida: {
            type: Sequelize.INTEGER,
            field: 'comida'
        },
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        estado: {
            type: Sequelize.BOOLEAN,
            field: 'estado',
            defaultValue: true
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado',
            defaultValue: false
        }
    }, {
            freezeTableName: true
        });
        HistorialComidaClienteEmpresa.sync().then(function(){
		
        });
        
        return HistorialComidaClienteEmpresa;
    }