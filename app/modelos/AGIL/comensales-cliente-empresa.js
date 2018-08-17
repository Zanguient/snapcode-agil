module.exports = function (sequelize, Sequelize) {
  var ComensalesClienteEmpresa = sequelize.define('agil_comensales_cliente_empresa', {
    id_cliente: {
      type: Sequelize.INTEGER,
      field: 'cliente'
    },
    codigo: {
      type: Sequelize.STRING,
      field: 'codigo'
    },
    nombre: {
      type: Sequelize.STRING,
      field: 'nombre'
    },
    tarjeta: {
      type: Sequelize.INTEGER.UNSIGNED,
      field: 'tarjeta'
    },
    id_gerencia: {
      type: Sequelize.INTEGER,
      field: 'gerencia'
    },
    tipo: {
      type: Sequelize.STRING,
      field: 'tipo'
    },
    id_empresa: {
      type: Sequelize.INTEGER,
      field: 'empresa'
  },
    habilitado: {
      type: Sequelize.BOOLEAN,
      field: 'habilitado',
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

  ComensalesClienteEmpresa.sync().then(function () {

  });
  return ComensalesClienteEmpresa;
}