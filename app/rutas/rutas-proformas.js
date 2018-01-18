module.exports = function (router, sequelize, Sequelize, Usuario, Cliente, Proforma, DetallesProformas, ActividadEconomica, Servicios) {
    router.route('/proformas/empresa/:id_empresa/mes/:mes/anio/:anio/suc/:sucursal/act/:actividad/ser/:servicio/monto/:monto/razon/:razon/usuario/:usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda')
        .get(function (req, res) {
            Proforma.findAll(
                {
                    include: [{ model: ActividadEconomica, as: 'actividadEconomica', where: req.params.id_empresa },
                    { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio' }] }]
                }).then(function (proformas) {
                    res.json({ proformas: proformas })
                }).catch(function (err) {
                    res.json({ proformas: [], mensaje: err.data })
                });
        })
        .post(function (req, res) {
            Proforma.create({

            }).then(function (proformaCreada) {
                res.json({ mensaje: 'Proforma creada!' })
            }).catch(function (err) {
                res.json({ mensaje: err.data })
            });
        })
        .put(function (req, res) {
            Proforma.update({

            }).then(function (proformaActualizada) {
                res.json({ mensaje: 'Proforma actualizada!' })
            }).catch(function (err) {
                res.json({ mensaje: err.data })
            });
        })
    router.route('/actividades/empresa/:id_empresa')
        .post(function (req, res) {
            req.body.map(function (actividad,i) {
                ActividadEconomica.create({
                    id_clase_actividad: actividad.id_clase_actividad,
                    id_empresa: actividad.id_empresa,
                    eliminado: false
                }).then(function (actividadEmpresaCreada) {
                    if (i === req.body.length-1) {
                        res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' })
                    }
                }).catch(function (err) {
                    res.json({ mensaje: err.data })
                });
            })
        })
        .get(function (req, res) {
            ActividadEconomica.findAll({
                where: { id_empresa: req.params.id_empresa, eliminado:false }
            }).then(function (actividades) {
                res.json({ actividades: actividades })
            }).catch(function (err) {
                res.json({ actividades: [], mensaje: err.data })
            });
        })
        .put(function (req, res) {
            ActividadEconomica.update({
                where: { id: req.body.id }
            }).then(function (actividadActualizada) {
                res.json({ mensaje: 'Actividad Actualizada' })
            }).catch(function (err) {
                res.json({ actividades: [], mensaje: err.data })
            });
        })

    router.route('/actividades/servicios/empresa/:id_empresa')
        .post(function (req, res) {
            Servicios.create({

            }).then(function (servicioCreado) {
                res.json({ mensaje: 'Servicio creado satisfactoriamente!' })
            }).catch(function (err) {
                res.json({ mensaje: err.data })
            });
        })
        .get(function (res, req) {
            Servicios.findAll({

            }).then(function (servicios) {
                res.json({ servicios: servicios })
            }).catch(function (err) {
                res.json({ servicios: [], mensaje: err.data })
            });
        })
        .put(function (req, res) {
            Servicios.update({
                where: { id: req.body.id }
            }).then(function (servicioActualizado) {
                res.json({ mensaje: 'Servicio actualizado' })
            }).catch(function (err) {
                res.json({ mensaje: err.data })
            });
        })
}