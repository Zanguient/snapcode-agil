module.exports = function (sequelize, Sequelize) {
    var ActivosFijosValores = sequelize.define('agil_activos_fijos_valores', {
        id_usuario: {
            type: Sequelize.INTEGER,
            field: 'usuario'
        },
        id_activo: {
            type: Sequelize.INTEGER,
            field: 'activo'
        },
        mes: {
            type: Sequelize.INTEGER,    //Mes de la depreciación.
            field: 'mes'
        },
        anio: {
            type: Sequelize.INTEGER,    //Año de la depreciación.
            field: 'anio'
        },
        valor: {
            type: Sequelize.DECIMAL(20,4),  //Último (Mes anterior) valor actualizado (si no existe se utiliza el valor inicial del activo.)
            field: 'valor'
        },
        incremento_actualizacion: {
            type: Sequelize.DECIMAL(20,4),  // ((valor / ufv_1(Mes Anterior)) * ufv_2(Mes actual)) - valor
            field: 'incremento_actualizacion'
        },
        valor_actualizado: { 
            type: Sequelize.DECIMAL(20,4),  // incremento_actualización + valor
            field: 'valor_actualizado'
        },
        depreciacion_acumulada: {
            type: Sequelize.DECIMAL(20,4),  // Último (anterior) total_depreciación_acumulada
            field: 'depreciacion_acumulada'
        },
        incremento_actualizacion_depreciacion_acumulada: {
            type: Sequelize.DECIMAL(20,4),  // ((depreciacion_acumulada / ufv_1(Mes Anterior)) * ufv_2(Mes actual)) - depreciacion_acumulada
            field: 'incremento_actualizacion_depreciacion_acumulada'
        },
        depreciacion_acumulada_actualizada: {
            type: Sequelize.DECIMAL(20,4),  // depreciacion_acumulada + incremento_actualizacion_depreciacion_acumulada
            field: 'depreciacion_acumulada_actualizada'
        },
        depreciacion: {
            type: Sequelize.DECIMAL(20,4),  // valor_actualizado /10 /12
            field: 'depreciacion'
        },
        total_depreciacion_acumulada: {
            type: Sequelize.DECIMAL(20,4),  // depreciacion_acumulada_actualizada + depreciacion
            field: 'total_depreciacion_acumulada'
        },
        valor_neto: {
            type: Sequelize.DECIMAL(20,4),  // valor_actualizado - total_depreciacion_acumulada
            field: 'valor_neto'
        },
        eliminado: {
            type: Sequelize.BOOLEAN,
            field: 'eliminado',
            defaultValue: false
        }
    }, {
            freezeTableName: true
        });
    ActivosFijosValores.sync().then(function () {
    });
    return ActivosFijosValores;
}