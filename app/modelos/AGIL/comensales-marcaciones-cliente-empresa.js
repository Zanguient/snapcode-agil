module.exports = function (sequelize, Sequelize) {
  var ComensalesMarcacionesClienteEmpresa = sequelize.define('agil_comensales_marcaciones_cliente_empresa', {
    id_empresa: {
      type: Sequelize.INTEGER,
      field: 'empresa'
    },
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
    id_gerencia: {
      type: Sequelize.INTEGER,
      field: 'gerencia'
    },
    id_comida: {
      type: Sequelize.INTEGER,
      field: 'comida'
    },
    verificado: {
      type: Sequelize.BOOLEAN,
      field: 'verificado',
      defaultValue: false
    },
    // cena: {
    //   type: Sequelize.INTEGER,
    //   field: 'cena'
    // },
    habilitado: {
      type: Sequelize.BOOLEAN,
      field: 'habilitado',
      defaultValue: true
    },
    observacion: {
      type: Sequelize.STRING,
      field: 'observacion'
    },
    // observacion_almuerzo: {
    //   type: Sequelize.STRING,
    //   field: 'observacion_almuerzo'
    // },
    // observacion_cena: {
    //   type: Sequelize.STRING,
    //   field: 'observacion_cena'
    // },
    eliminado: {
      type: Sequelize.BOOLEAN,
      field: 'eliminado',
      defaultValue: false
    }
  }, {
      freezeTableName: true
    });

  ComensalesMarcacionesClienteEmpresa.sync().then(function () {

  });
  return ComensalesMarcacionesClienteEmpresa;
}