module.exports = function (router, sequelize, Sequelize, EstadoFinancieroConfiguracionImpresion, EstadoFinancieroGestion, Tipo, Clase) {

    router.route('/gestiones/:id_empresa')
        .get(function (req, res) {
            EstadoFinancieroGestion.findAll({
                include: [{ model: Clase, as: 'tipoGestion' ,include:[{model:Tipo,as:'tipo',where:{id_empresa: parseInt(req.params.id_empresa) }}]}]
            }).then(function (datos) {
                res.json(datos)
            })
        })
        .post(function (req, res) {
            req.body.forEach(function (gestion, index, array) {
                if (gestion.id) {
                    EstadoFinancieroGestion.update({
                        id_tipo: gestion.tipoGestion.id,
                        inicio: gestion.inicio,
                        fin: gestion.fin
                    }, {
                            where: { id: gestion.id }
                        }).then(function (entities) {
                            res.json({ mensaje: 'Guardado Satisfactoriamente!' });
                        });
                } else {
                    EstadoFinancieroGestion.create({
                        id_tipo: gestion.tipoGestion.id,
                        inicio: gestion.inicio,
                        fin: gestion.fin,
                    }).then(function (entities) {
                        res.json({ mensaje: 'Guardado Satisfactoriamente!' });
                    });
                }
            });

        });
    router.route('/configuracion-impresion/:id_empresa')
        .get(function (req, res) {
            EstadoFinancieroConfiguracionImpresion.find({
                where: { id_empresa: parseInt(req.params.id_empresa) },
                include:[{model:Clase,as:'tipoNumeracion'}]
            }).then(function (datos) {
                res.json(datos)
            })
        })
        .post(function (req, res) {
            if (req.body.id) {
                EstadoFinancieroConfiguracionImpresion.update({
                    id_empresa: parseInt(req.params.id_empresa),
                    lugar_emision: req.body.lugar_emision,
                    fecha_emision: req.body.fecha_emision,
                    id_tipo_numeracion: req.body.tipoNumeracion.id,
                    empesar_numeracion: req.body.empesar_numeracion,
                    firma_uno: req.body.firma_uno,
                    cargo_uno: req.body.cargo_uno,
                    firma_dos: req.body.firma_dos,
                    cargo_dos: req.body.cargo_dos,
                    frase_pie_pagina: req.body.frase_pie_pagina,
                    usar_lugar_emision: req.body.usar_lugar_emision,
                    usar_fecha_emision: req.body.usar_fecha_emision,
                    usar_tipo_numeracion: req.body.usar_tipo_numeracion,
                    usar_empesar_numeracion: req.body.usar_empesar_numeracion,
                    usar_firma_uno: req.body.usar_firma_uno,
                    usar_firma_dos: req.body.usar_firma_dos,
                    usar_frase_pie_pagina: req.body.usar_frase_pie_pagina
                }, {
                    where: { id: req.body.id }
                    }).then(function (datos) {
                        res.json({mensaje:'guardado Satisfactoriamente!'})
                    })
            } else {
                EstadoFinancieroConfiguracionImpresion.create({
                    id_empresa: parseInt(req.params.id_empresa),
                    lugar_emision: req.body.lugar_emision,
                    fecha_emision: req.body.fecha_emision,
                    id_tipo_numeracion: req.body.tipoNumeracion.id,
                    empesar_numeracion: req.body.empesar_numeracion,
                    firma_uno: req.body.firma_uno,
                    cargo_uno: req.body.cargo_uno,
                    firma_dos: req.body.firma_dos,
                    cargo_dos: req.body.cargo_dos,
                    frase_pie_pagina: req.body.frase_pie_pagina,
                    usar_lugar_emision: req.body.usar_lugar_emision,
                    usar_fecha_emision: req.body.usar_fecha_emision,
                    usar_tipo_numeracion: req.body.usar_tipo_numeracion,
                    usar_empesar_numeracion: req.body.usar_empesar_numeracion,
                    usar_firma_uno: req.body.usar_firma_uno,
                    usar_firma_dos: req.body.usar_firma_dos,
                    usar_frase_pie_pagina: req.body.usar_frase_pie_pagina,
                }).then(function (datos) {
                    res.json({mensaje:'guardado Satisfactoriamente!'})
                })
            }

        });
}