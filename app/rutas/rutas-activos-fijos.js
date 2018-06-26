module.exports = function (router, sequelize, Sequelize, Usuario, ActivosFijos, ActivosFijosValores, ActivosFijosConfiguracion) {
    
    router.route('/activos/empresa/:id_empresa')
        .get(function (req, res) {
            ActivosFijos.findAll({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: ActivosFijosValores, as: 'valores' }]
            }).then(function (activos) {
                res.json({ activos: activos });
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        });
        router.route('/activos/empresa/:id_empresa')
        .get(function (req, res) {
            ActivosFijos.findAll({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: ActivosFijosValores, as: 'valores' }]
            }).then(function (activos) {
                res.json({ activos: activos });
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        });
}