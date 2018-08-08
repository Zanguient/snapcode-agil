module.exports = function (router, sequelize, Sequelize, EstadoFinancieroConfiguracionImpresion, EstadoFinancieroGestion, Tipo, Clase, ProveedorCuenta
    , Proveedor, ClienteCuenta, Cliente, ClasificacionCuenta, ContabilidadCuenta, AsientoContabilidad, ComprobanteContabilidad,MonedaTipoCambio) {

    router.route('/gestiones/:id_empresa')
        .get(function (req, res) {
            EstadoFinancieroGestion.findAll({
                include: [{ model: Clase, as: 'tipoGestion', include: [{ model: Tipo, as: 'tipo', where: { id_empresa: parseInt(req.params.id_empresa) } }] }]
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
                include: [{ model: Clase, as: 'tipoNumeracion' }]
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
                        res.json({ mensaje: 'guardado Satisfactoriamente!' })
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
                    res.json({ mensaje: 'guardado Satisfactoriamente!' })
                })
            }

        });
    router.route('/contabilidad-cuentas/empresa/:id_empresa/tipo_periodo/:periodo/tipo/:id_tipo/gestion/:gestion/mes/:mes/inicio/:inicio/fin/:fin/gestion_fin/:gestion_fin')
        .get(/*ensureAuthorized,*/function (req, res) {
            var condicionCuenta = {}, condicionComprobante = {};
            condicionCuenta.id_empresa = parseInt(req.params.id_empresa);
            /* if (req.params.id_tipo != 0) {
                condicionCuenta.id_tipo_cuenta = parseInt(req.params.id_tipo);
            } */
            if (req.params.periodo == 'GESTIÓN') {
                var inicio = new Date(req.params.gestion, 0, 1)
                var fin = new Date(req.params.gestion, 12, 0)
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                var condicionComprobante = { eliminado: false, fecha: { $between: [inicio, fin] } }
            } else if (req.params.periodo == 'MES') {
                var inicio = new Date(req.params.gestion, req.params.mes, 1)
                var fin = new Date(req.params.gestion, parseInt(req.params.mes) + 1, 0)
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                var condicionComprobante = { eliminado: false, fecha: { $between: [inicio, fin] } }
                condicionComprobante.fecha = { $between: [inicio, fin] }
            } else if (req.params.periodo == 'FECHAS') {
                var inicio = new Date(req.params.inicio)
                var fin = new Date(req.params.fin)
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                condicionComprobante.fecha = { $between: [inicio, fin] }
            }
            condicionCuenta.eliminado = false

            var datosCuenta = {
                where: condicionCuenta,
                include: [
                    {
                        model: ClasificacionCuenta, as: "clasificacion",
                        include: [{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }]
                    },
                    {
                        model: Clase, as: 'tipoCuenta'
                    },
                    {
                        model: Clase, as: 'claseCalculo'
                    },
                    {
                        model: Clase, as: 'tipoAuxiliar'
                    }
                    ,
                    {
                        model: AsientoContabilidad, as: 'cuenta', include: [{ model: ComprobanteContabilidad, as: 'comprobante', where: condicionComprobante }]
                    }
                ],

            }
            if (req.params.periodo != 'COMPARATIVO') {

                ContabilidadCuenta.findAll({
                    where: condicionCuenta,
                include: [
                    {
                        model: ClasificacionCuenta, as: "clasificacion",
                        include: [{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }]
                    },
                    {
                        model: Clase, as: 'tipoCuenta'
                    },
                    {
                        model: Clase, as: 'claseCalculo'
                    },
                    {
                        model: Clase, as: 'tipoAuxiliar'
                    }
                    ,
                    {
                        model: AsientoContabilidad, as: 'cuenta', include: [{ model: ComprobanteContabilidad, as: 'comprobante', where: condicionComprobante }]
                    }
                ]
                }).then(function (cuentas) {
                    MonedaTipoCambio.find({
                        where: {
                            fecha: {
                                $between: [inicio, fin]
                            }
                        }
                    }).then(function (MonedaCambio) {
                        res.json({ cuentas: cuentas, monedaCambio: MonedaCambio })
                    })


                });
            } else {
                var inicio = new Date(req.params.gestion, 0, 1)
                var fin = new Date(req.params.gestion, 12, 0)
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                condicionComprobante.fecha = { $between: [inicio, fin] }
                ContabilidadCuenta.findAll(
                    datosCuenta
                ).then(function (cuentas) {
                    var inicio = new Date(req.params.gestion_fin, 0, 1)
                    var fin = new Date(req.params.gestion_fin, 12, 0)
                    inicio.setHours(0, 0, 0, 0, 0);
                    fin.setHours(23, 59, 59, 0, 0);
                    condicionComprobante.fecha = { $between: [inicio, fin] }
                    ContabilidadCuenta.findAll(
                        datosCuenta
                    ).then(function (cuentas2) {
                        MonedaTipoCambio.find({
                            where: {
                                fecha: {
                                    $between: [inicio, fin]
                                }
                            }
                        }).then(function (MonedaCambio) {
                            res.json({ cuentas: cuentas, cuentas2: cuentas2, monedaCambio: MonedaCambio })
                        })
                    });
                });
            }
        })
}