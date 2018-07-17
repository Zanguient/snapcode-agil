module.exports = function (router, sequelize, Sequelize, EstadoFinancieroConfiguracionImpresion, EstadoFinancieroGestion, Tipo, Clase) {

    router.route('/gestiones/:id_empresa')
        .get(function (req, res) {
            EstadoFinancieroGestion.findAll({
                include: [{ model: Clase, as: 'tipoGestion'}]
            }).then(function (datos) {
                res.json(datos)
            })
        })
        .post(function (req, res) {
            req.body.forEach(function (gestion, index, array) {
                if (gestion.id) {
                    EstadoFinancieroGestion.update({
                        id_tipo: gestion.tipoGestion.id,
                        inicio:  gestion.inicio,
                        fin:  gestion.fin
                    }, {
                            where: { id: gestion.id }
                        }).then(function (entities) {
                            res.json({ mensaje: 'Guardado Satisfactoriamente!' });
                        });
                } else {
                    EstadoFinancieroGestion.create({
                        id_tipo: gestion.tipoGestion.id,
                        inicio: gestion.inicio,
                        fin:  gestion.fin,
                    }).then(function (entities) {
                        res.json({ mensaje: 'Guardado Satisfactoriamente!' });
                    });
                }
            });

        });
}