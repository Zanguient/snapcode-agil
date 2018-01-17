module.exports = function (sequelize, Sequelize) {
    var GtmGrupoEstibaje = sequelize.define('agil_gtm_grupo_estibaje', {
        id_empresa: {
            type: Sequelize.INTEGER,
            field: 'empresa'
        },
        codigo: {
            type: Sequelize.STRING,
            field: 'codigo'
        },
        nombre: {
            type: Sequelize.STRING,
            field: 'nombre'
        },
         descripcion: {
            type: Sequelize.STRING,
            field: 'descripcion'
        },
		eliminado: {
			type: Sequelize.BOOLEAN,
			field: 'eliminado'
		}
    }, {
            freezeTableName: true
        });

    GtmGrupoEstibaje.sync();

    return GtmGrupoEstibaje;
}