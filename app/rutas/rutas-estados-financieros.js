module.exports = function (router, sequelize, Sequelize, EstadoFinancieroConfiguracionImpresion, EstadoFinancieroGestion, Tipo, Clase, ProveedorCuenta
    , Proveedor, ClienteCuenta, Cliente, ClasificacionCuenta, ContabilidadCuenta, AsientoContabilidad, ComprobanteContabilidad, MonedaTipoCambio,ContabilidadCuentaAuxiliar,Usuario,
    Persona,Sucursal,Empresa,NumeroLiteral ) {

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
                        fin: gestion.fin,
                        habilitado: gestion.habilitado
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
                        habilitado: gestion.habilitado
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

    router.route('/contabilidad-cuentas-estado-resultado/empresa/:id_empresa/tipo_periodo/:periodo/tipo/:id_tipo/gestion/:gestion/mes/:mes/inicio/:inicio/fin/:fin/gestion_fin/:gestion_fin')
        .post(/*ensureAuthorized,*/function (req, res) {
            var condicionCuenta = {}, condicionComprobante = {};
            condicionCuenta.id_empresa = parseInt(req.params.id_empresa);
            /* if (req.params.id_tipo != 0) {   
                condicionCuenta.id_tipo_cuenta = parseInt(req.params.id_tipo);
            } */
            if (req.params.periodo == 'GESTIÓN') {
                var diaInicio = req.body.fechasImpresion.inicio.split("/")[0]
                var diafin = req.body.fechasImpresion.fin.split("/")[0]
                var mesinico = parseInt(req.body.fechasImpresion.inicio.split("/")[1]) - 1
                var mesfin = parseInt(req.body.fechasImpresion.fin.split("/")[1]) - 1
                if (mesinico == 0) {
                    var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                    var fin = new Date(req.params.gestion, mesfin, diafin)
                } else {
                    var anio = parseInt(req.params.gestion) + 1
                    var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                    var fin = new Date(anio, mesfin, diafin)
                }

                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                var condicionComprobante = { eliminado: false }
            } else if (req.params.periodo == 'MES') {
                var inicio = new Date(req.params.gestion, req.params.mes, 1)
                var fin = new Date(req.params.gestion, parseInt(req.params.mes) + 1, 0)
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                var condicionComprobante = { eliminado: false }
               
            } else if (req.params.periodo == 'FECHAS') {
                var inicio = new Date(req.params.inicio)
                var fin = new Date(req.params.fin)
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                var condicionComprobante = { eliminado: false }
                
            }
            condicionCuenta.eliminado = false
            //condicionCuenta.cuenta_activo = true
            condicionCuenta.estado_resultado = true
            var condicionClasificacion = {}
            var condicionTipo = {}
            var datosCuenta = {
                where: condicionCuenta,
                include: [
                {
                    model: ClasificacionCuenta, as: "clasificacion", 
                    include: [{ model: Clase, as: 'tipoClasificacion',where: condicionClasificacion },{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }]
                },
                {
                    model: Clase, as: 'tipoCuenta', where: condicionTipo
                },
                {
                    model: Clase, as: 'claseCalculo'
                },
                {
                    model: Clase, as: 'tipoAuxiliar'
                }

                ],

            }

            if (req.params.periodo != 'COMPARATIVO') {
                MonedaTipoCambio.find({
                    where: {
                        fecha: {
                            $between: [inicio, fin]
                        }
                    }
                }).then(function (MonedaCambio) {
                    condicionComprobante.fecha = { $between: [inicio, fin] }
                    condicionTipo.nombre_corto = "2"
                    ContabilidadCuenta.findAll(
                        datosCuenta
                    ).then(function (cuentasVenta) {
                        if (cuentasVenta.length > 0) {
                            cuentasVenta.forEach(function (cuenta, index, array) {
                                delete condicionTipo.nombre_corto;
                                delete  condicionComprobante.fecha;
                                /* condicionTipo.nombre_corto = "3" */
                                condicionCuenta.estado_resultado = false
                                condicionCuenta.codigo = { $like: cuenta.codigo + "%" }
                                ContabilidadCuenta.findAll(
                                    datosCuenta
                                ).then(function (cuentasCostoVenta) {
                                    cuenta.dataValues.cuentasEstadoResultado = cuentasCostoVenta
                                    if (index === (array.length - 1)) {
                                        delete condicionCuenta.codigo;
                                        condicionClasificacion.nombre_corto = "7"
                                        ContabilidadCuenta.findAll(
                                            datosCuenta
                                        ).then(function (cuentasGrupoIngresoEgreso) {
                                            condicionTipo.nombre_corto = "2"
                                            ContabilidadCuenta.findAll(
                                                datosCuenta
                                            ).then(function (cuentasSubGrupoIngresoEgreso) {
                                                condicionTipo.nombre_corto = "3"
                                                ContabilidadCuenta.findAll(
                                                    datosCuenta
                                                ).then(function (cuentasGenericasIngresoEgreso) {
                                                    condicionTipo.nombre_corto = "4"
                                                    condicionComprobante.fecha = { $between: [inicio, fin] }
                                                    ContabilidadCuenta.findAll(
                                                        datosCuenta
                                                    ).then(function (cuentasApropiacionIngresoEgreso) {
                                                        delete condicionComprobante.fecha
                                                        //condicionCuenta.cuenta_activo = false
                                                        condicionTipo.nombre_corto = "1"
                                                        condicionClasificacion.nombre_corto = "5"
                                                        ContabilidadCuenta.findAll(
                                                            datosCuenta
                                                        ).then(function (cuentasGrupo) {
                                                            condicionTipo.nombre_corto = "2"
                                                            ContabilidadCuenta.findAll(
                                                                datosCuenta
                                                            ).then(function (cuentasSubGrupo) {
                                                                condicionTipo.nombre_corto = "3"
                                                                ContabilidadCuenta.findAll(
                                                                    datosCuenta
                                                                ).then(function (cuentasGenericas) {
                                                                    condicionTipo.nombre_corto = "4"
                                                                    condicionComprobante.fecha = { $between: [inicio, fin] }
                                                                    ContabilidadCuenta.findAll(
                                                                        datosCuenta
                                                                    ).then(function (cuentasApropiacion) {

                                                                        delete condicionComprobante.fecha
                                                                        res.json({
                                                                            cuentasGrupo: cuentasGrupo, cuentasSubGrupo: cuentasSubGrupo, cuentasGenericas: cuentasGenericas, cuentasApropiacion: cuentasApropiacion,
                                                                            cuentasSubGrupoEstadoResultado: cuentasVenta, cuentasGrupoIngresoEgreso: cuentasGrupoIngresoEgreso, cuentasSubGrupoIngresoEgreso: cuentasSubGrupoIngresoEgreso, cuentasGenericasIngresoEgreso: cuentasGenericasIngresoEgreso, cuentasApropiacionIngresoEgreso: cuentasApropiacionIngresoEgreso
                                                                            , monedaCambio: MonedaCambio
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                });
                                            })
                                        })

                                    }
                                })
                            })
                        } else {
                            delete condicionTipo.nombre_corto;
                            condicionCuenta.estado_resultado = false   
                            condicionClasificacion.nombre = "EGRESO"
                            ContabilidadCuenta.findAll(
                                datosCuenta
                            ).then(function (cuentasGrupoFijo) {
                                condicionTipo.nombre_corto = "2"
                                ContabilidadCuenta.findAll(
                                    datosCuenta
                                ).then(function (cuentasSubGrupoFijo) {
                                    condicionTipo.nombre_corto = "3"
                                    ContabilidadCuenta.findAll(
                                        datosCuenta
                                    ).then(function (cuentasGenericasFijo) {
                                        condicionTipo.nombre_corto = "4"
                                        condicionComprobante.fecha = { $between: [inicio, fin] }
                                        ContabilidadCuenta.findAll(
                                            datosCuenta
                                        ).then(function (cuentasApropiacionFijo) {
                                            delete condicionComprobante.fecha
                                            condicionCuenta.cuenta_activo = false
                                            condicionTipo.nombre_corto = "1"
                                            ContabilidadCuenta.findAll(
                                                datosCuenta
                                            ).then(function (cuentasGrupo) {
                                                condicionTipo.nombre_corto = "2"
                                                ContabilidadCuenta.findAll(
                                                    datosCuenta
                                                ).then(function (cuentasSubGrupo) {
                                                    condicionTipo.nombre_corto = "3"
                                                    ContabilidadCuenta.findAll(
                                                        datosCuenta
                                                    ).then(function (cuentasGenericas) {
                                                        condicionTipo.nombre_corto = "4"
                                                        condicionComprobante.fecha = { $between: [inicio, fin] }
                                                        ContabilidadCuenta.findAll(
                                                            datosCuenta
                                                        ).then(function (cuentasApropiacion) {
                                                            delete condicionComprobante.fecha
                                                            res.json({
                                                                cuentasGrupo: cuentasGrupo, cuentasSubGrupo: cuentasSubGrupo, cuentasGenericas: cuentasGenericas, cuentasApropiacion: cuentasApropiacion,
                                                                cuentasSubGrupoEstadoResultado: cuentasVenta, cuentasGrupoFijo: cuentasGrupoFijo, cuentasSubGrupoFijo: cuentasSubGrupoFijo, cuentasGenericasFijo: cuentasGenericasFijo, cuentasApropiacionFijo: cuentasApropiacionFijo
                                                                , monedaCambio: MonedaCambio
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    });
                                })
                            })


                        }
                    })

                    /* ContabilidadCuenta.findAll(
                        datosCuenta
                    ).then(function (cuentasGrupoFijo) {
                        condicionTipo.nombre_corto = "2"
                        ContabilidadCuenta.findAll(
                            datosCuenta
                        ).then(function (cuentasSubGrupoFijo) {
                            condicionTipo.nombre_corto = "3"
                            ContabilidadCuenta.findAll(
                                datosCuenta
                            ).then(function (cuentasGenericasFijo) {
                                condicionTipo.nombre_corto = "4"
                                ContabilidadCuenta.findAll(
                                    datosCuenta
                                ).then(function (cuentasApropiacionFijo) {
                                    condicionCuenta.cuenta_activo = false
                                    condicionTipo.nombre_corto = "1"
                                    ContabilidadCuenta.findAll(
                                        datosCuenta
                                    ).then(function (cuentasGrupo) {
                                        condicionTipo.nombre_corto = "2"
                                        ContabilidadCuenta.findAll(
                                            datosCuenta
                                        ).then(function (cuentasSubGrupo) {
                                            condicionTipo.nombre_corto = "3"
                                            ContabilidadCuenta.findAll(
                                                datosCuenta
                                            ).then(function (cuentasGenericas) {
                                                condicionTipo.nombre_corto = "4"
                                                ContabilidadCuenta.findAll(
                                                    datosCuenta
                                                ).then(function (cuentasApropiacion) {
                                                    res.json({
                                                        cuentasGrupo: cuentasGrupo, cuentasSubGrupo: cuentasSubGrupo, cuentasGenericas: cuentasGenericas, cuentasApropiacion: cuentasApropiacion,
                                                        cuentasGrupoFijo: cuentasGrupoFijo, cuentasSubGrupoFijo: cuentasSubGrupoFijo, cuentasGenericasFijo: cuentasGenericasFijo, cuentasApropiacionFijo: cuentasApropiacionFijo
                                                        , monedaCambio: MonedaCambio
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            });
                        })
                    }) */
                });
            } else {
                var diaInicio = req.body.fechasImpresion.inicio.split("/")[0]
                var diafin = req.body.fechasImpresion.fin.split("/")[0]
                var mesinico = parseInt(req.body.fechasImpresion.inicio.split("/")[1]) - 1
                var mesfin = parseInt(req.body.fechasImpresion.fin.split("/")[1]) - 1
                if (mesinico == 0) {
                    var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                    var fin = new Date(req.params.gestion, mesfin, diafin)
                } else {
                    var anio = parseInt(req.params.gestion) + 1
                    var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                    var fin = new Date(anio, mesfin, diafin)
                }

                condicionCuenta.cuenta_activo = true
                /* var inicio = new Date(req.params.gestion, 0, 1)
                var fin = new Date(req.params.gestion, 12, 0) */
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                MonedaTipoCambio.find({
                    where: {
                        fecha: {
                            $between: [inicio, fin]
                        }
                    }
                }).then(function (MonedaCambio) {
                    condicionTipo.nombre_corto = "1"
                    ContabilidadCuenta.findAll(
                        datosCuenta
                    ).then(function (cuentasGrupoFijo) {
                        condicionTipo.nombre_corto = "2"
                        ContabilidadCuenta.findAll(
                            datosCuenta
                        ).then(function (cuentasSubGrupoFijo) {
                            condicionTipo.nombre_corto = "3"
                            ContabilidadCuenta.findAll(
                                datosCuenta
                            ).then(function (cuentasGenericasFijo) {
                                condicionTipo.nombre_corto = "4"
                                ContabilidadCuenta.findAll(
                                    datosCuenta
                                ).then(function (cuentasApropiacionFijo) {
                                    condicionCuenta.cuenta_activo = false
                                    condicionTipo.nombre_corto = "1"
                                    ContabilidadCuenta.findAll(
                                        datosCuenta
                                    ).then(function (cuentasGrupo) {
                                        condicionTipo.nombre_corto = "2"
                                        ContabilidadCuenta.findAll(
                                            datosCuenta
                                        ).then(function (cuentasSubGrupo) {
                                            condicionTipo.nombre_corto = "3"
                                            ContabilidadCuenta.findAll(
                                                datosCuenta
                                            ).then(function (cuentasGenericas) {
                                                condicionTipo.nombre_corto = "4"
                                                ContabilidadCuenta.findAll(
                                                    datosCuenta
                                                ).then(function (cuentasApropiacion) {
                                                    condicionCuenta.cuenta_activo = true
                                                    var inicio = new Date(req.params.gestion_fin, mesinico, diaInicio)
                                                    var fin = new Date(req.params.gestion_fin, mesfin, diafin)
                                                    inicio.setHours(0, 0, 0, 0, 0);
                                                    fin.setHours(23, 59, 59, 0, 0);
                                                    condicionComprobante.fecha = { $between: [inicio, fin] }
                                                    condicionTipo.nombre_corto = "1"
                                                    ContabilidadCuenta.findAll(
                                                        datosCuenta
                                                    ).then(function (cuentasGrupoFijoDos) {
                                                        condicionTipo.nombre_corto = "2"
                                                        ContabilidadCuenta.findAll(
                                                            datosCuenta
                                                        ).then(function (cuentasSubGrupoFijoDos) {
                                                            condicionTipo.nombre_corto = "3"
                                                            ContabilidadCuenta.findAll(
                                                                datosCuenta
                                                            ).then(function (cuentasGenericasFijoDos) {
                                                                condicionTipo.nombre_corto = "4"
                                                                ContabilidadCuenta.findAll(
                                                                    datosCuenta
                                                                ).then(function (cuentasApropiacionFijoDos) {
                                                                    condicionCuenta.cuenta_activo = false
                                                                    condicionTipo.nombre_corto = "1"
                                                                    ContabilidadCuenta.findAll(
                                                                        datosCuenta
                                                                    ).then(function (cuentasGrupoDos) {
                                                                        condicionTipo.nombre_corto = "2"
                                                                        ContabilidadCuenta.findAll(
                                                                            datosCuenta
                                                                        ).then(function (cuentasSubGrupoDos) {
                                                                            condicionTipo.nombre_corto = "3"
                                                                            ContabilidadCuenta.findAll(
                                                                                datosCuenta
                                                                            ).then(function (cuentasGenericasDos) {
                                                                                condicionTipo.nombre_corto = "4"
                                                                                ContabilidadCuenta.findAll(
                                                                                    datosCuenta
                                                                                ).then(function (cuentasApropiacionDos) {
                                                                                    res.json({
                                                                                        primero: {
                                                                                            cuentasGrupo: cuentasGrupo, cuentasSubGrupo: cuentasSubGrupo, cuentasGenericas: cuentasGenericas, cuentasApropiacion: cuentasApropiacion,
                                                                                            cuentasGrupoFijo: cuentasGrupoFijo, cuentasSubGrupoFijo: cuentasSubGrupoFijo, cuentasGenericasFijo: cuentasGenericasFijo, cuentasApropiacionFijo: cuentasApropiacionFijo

                                                                                        }, monedaCambio: MonedaCambio,
                                                                                        segundo: {
                                                                                            cuentasGrupo: cuentasGrupoDos, cuentasSubGrupo: cuentasSubGrupoDos, cuentasGenericas: cuentasGenericasDos, cuentasApropiacion: cuentasApropiacionDos,
                                                                                            cuentasGrupoFijo: cuentasGrupoFijoDos, cuentasSubGrupoFijo: cuentasSubGrupoFijoDos, cuentasGenericasFijo: cuentasGenericasFijoDos, cuentasApropiacionFijo: cuentasApropiacionFijoDos

                                                                                        }
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })

    router.route('/contabilidad-cuentas/empresa/:id_empresa/tipo_periodo/:periodo/tipo/:id_tipo/gestion/:gestion/mes/:mes/inicio/:inicio/fin/:fin/gestion_fin/:gestion_fin')
        .post(/*ensureAuthorized,*/function (req, res) {
            var condicionCuenta = {}, condicionComprobante = {};
            condicionCuenta.id_empresa = parseInt(req.params.id_empresa);
            /* if (req.params.id_tipo != 0) {
                condicionCuenta.id_tipo_cuenta = parseInt(req.params.id_tipo);
            } */
            if (req.params.periodo == 'GESTIÓN') {
                var diaInicio = req.body.fechasImpresion.inicio.split("/")[0]
                var diafin = req.body.fechasImpresion.fin.split("/")[0]
                var mesinico = parseInt(req.body.fechasImpresion.inicio.split("/")[1]) - 1
                var mesfin = parseInt(req.body.fechasImpresion.fin.split("/")[1]) - 1
                if (mesinico == 0) {
                    var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                    var fin = new Date(req.params.gestion, mesfin, diafin)
                } else {
                    var anio = parseInt(req.params.gestion) + 1
                    var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                    var fin = new Date(anio, mesfin, diafin)
                }

                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                var condicionComprobante = { eliminado: false }
            } else if (req.params.periodo == 'MES') {
                var inicio = new Date(req.params.gestion, req.params.mes, 1)
                var fin = new Date(req.params.gestion, parseInt(req.params.mes) + 1, 0)
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                var condicionComprobante = { eliminado: false  }
              
            } else if (req.params.periodo == 'FECHAS') {
                var inicio = new Date(req.params.inicio)
                var fin = new Date(req.params.fin)
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                var condicionComprobante = { eliminado: false  }
            }
            condicionCuenta.eliminado = false
            condicionCuenta.cuenta_activo = true
            var condicionTipo = {}
            var datosCuenta = {
                where: condicionCuenta,
                include: [{ model: AsientoContabilidad, as: 'cuenta', 
                include: [{ model: ComprobanteContabilidad, as: 'comprobante'}] },
                {
                    model: ClasificacionCuenta, as: "clasificacion",
                    include: [{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }]
                },
                {
                    model: Clase, as: 'tipoCuenta', where: condicionTipo
                },
                {
                    model: Clase, as: 'claseCalculo'
                },
                {
                    model: Clase, as: 'tipoAuxiliar'
                }

                ],

            }

            if (req.params.periodo != 'COMPARATIVO') {
                MonedaTipoCambio.find({
                    where: {
                        fecha: {
                            $between: [inicio, fin]
                        }
                    }
                }).then(function (MonedaCambio) {
                    condicionTipo.nombre_corto = "1"
                    ContabilidadCuenta.findAll(
                        datosCuenta
                    ).then(function (cuentasGrupoFijo) {
                        condicionTipo.nombre_corto = "2"
                        ContabilidadCuenta.findAll(
                            datosCuenta
                        ).then(function (cuentasSubGrupoFijo) {
                            condicionTipo.nombre_corto = "3"
                            ContabilidadCuenta.findAll(
                                datosCuenta
                            ).then(function (cuentasGenericasFijo) {
                                condicionTipo.nombre_corto = "4"
                                condicionComprobante.fecha = { $between: [inicio, fin] }
                                ContabilidadCuenta.findAll(
                                    datosCuenta
                                ).then(function (cuentasApropiacionFijo) {
                                    delete condicionComprobante.fecha
                                    condicionCuenta.cuenta_activo = false
                                    condicionTipo.nombre_corto = "1"
                                    ContabilidadCuenta.findAll(
                                        datosCuenta
                                    ).then(function (cuentasGrupo) {
                                        condicionTipo.nombre_corto = "2"
                                        ContabilidadCuenta.findAll(
                                            datosCuenta
                                        ).then(function (cuentasSubGrupo) {
                                            condicionTipo.nombre_corto = "3"
                                            ContabilidadCuenta.findAll(
                                                datosCuenta
                                            ).then(function (cuentasGenericas) {
                                                condicionComprobante.fecha = { $between: [inicio, fin] }
                                                condicionTipo.nombre_corto = "4"
                                                ContabilidadCuenta.findAll(
                                                    datosCuenta
                                                ).then(function (cuentasApropiacion) {
                                                    delete condicionComprobante.fecha
                                                    res.json({
                                                        cuentasGrupo: cuentasGrupo, cuentasSubGrupo: cuentasSubGrupo, cuentasGenericas: cuentasGenericas, cuentasApropiacion: cuentasApropiacion,
                                                        cuentasGrupoFijo: cuentasGrupoFijo, cuentasSubGrupoFijo: cuentasSubGrupoFijo, cuentasGenericasFijo: cuentasGenericasFijo, cuentasApropiacionFijo: cuentasApropiacionFijo
                                                        , monedaCambio: MonedaCambio
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            });
                        })
                    })
                });
            } else {
                var diaInicio = req.body.fechasImpresion.inicio.split("/")[0]
                var diafin = req.body.fechasImpresion.fin.split("/")[0]
                var mesinico = parseInt(req.body.fechasImpresion.inicio.split("/")[1]) - 1
                var mesfin = parseInt(req.body.fechasImpresion.fin.split("/")[1]) - 1
                if (mesinico == 0) {
                    var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                    var fin = new Date(req.params.gestion, mesfin, diafin)
                } else {
                    var anio = parseInt(req.params.gestion) + 1
                    var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                    var fin = new Date(anio, mesfin, diafin)
                }

                condicionCuenta.cuenta_activo = true
                /* var inicio = new Date(req.params.gestion, 0, 1)
                var fin = new Date(req.params.gestion, 12, 0) */
                inicio.setHours(0, 0, 0, 0, 0);
                fin.setHours(23, 59, 59, 0, 0);
                MonedaTipoCambio.find({
                    where: {
                        fecha: {
                            $between: [inicio, fin]
                        }
                    }
                }).then(function (MonedaCambio) {
                    condicionTipo.nombre_corto = "1"
                    ContabilidadCuenta.findAll(
                        datosCuenta
                    ).then(function (cuentasGrupoFijo) {
                        condicionTipo.nombre_corto = "2"
                        ContabilidadCuenta.findAll(
                            datosCuenta
                        ).then(function (cuentasSubGrupoFijo) {
                            condicionTipo.nombre_corto = "3"
                            ContabilidadCuenta.findAll(
                                datosCuenta
                            ).then(function (cuentasGenericasFijo) {
                                condicionTipo.nombre_corto = "4"
                                ContabilidadCuenta.findAll(
                                    datosCuenta
                                ).then(function (cuentasApropiacionFijo) {
                                    condicionCuenta.cuenta_activo = false
                                    condicionTipo.nombre_corto = "1"
                                    ContabilidadCuenta.findAll(
                                        datosCuenta
                                    ).then(function (cuentasGrupo) {
                                        condicionTipo.nombre_corto = "2"
                                        ContabilidadCuenta.findAll(
                                            datosCuenta
                                        ).then(function (cuentasSubGrupo) {
                                            condicionTipo.nombre_corto = "3"
                                            ContabilidadCuenta.findAll(
                                                datosCuenta
                                            ).then(function (cuentasGenericas) {
                                                condicionTipo.nombre_corto = "4"
                                                ContabilidadCuenta.findAll(
                                                    datosCuenta
                                                ).then(function (cuentasApropiacion) {
                                                    condicionCuenta.cuenta_activo = true
                                                    var inicio = new Date(req.params.gestion_fin, mesinico, diaInicio)
                                                    var fin = new Date(req.params.gestion_fin, mesfin, diafin)
                                                    inicio.setHours(0, 0, 0, 0, 0);
                                                    fin.setHours(23, 59, 59, 0, 0);
                                                    condicionComprobante.fecha = { $between: [inicio, fin] }
                                                    condicionTipo.nombre_corto = "1"
                                                    ContabilidadCuenta.findAll(
                                                        datosCuenta
                                                    ).then(function (cuentasGrupoFijoDos) {
                                                        condicionTipo.nombre_corto = "2"
                                                        ContabilidadCuenta.findAll(
                                                            datosCuenta
                                                        ).then(function (cuentasSubGrupoFijoDos) {
                                                            condicionTipo.nombre_corto = "3"
                                                            ContabilidadCuenta.findAll(
                                                                datosCuenta
                                                            ).then(function (cuentasGenericasFijoDos) {
                                                                condicionTipo.nombre_corto = "4"
                                                                ContabilidadCuenta.findAll(
                                                                    datosCuenta
                                                                ).then(function (cuentasApropiacionFijoDos) {
                                                                    condicionCuenta.cuenta_activo = false
                                                                    condicionTipo.nombre_corto = "1"
                                                                    ContabilidadCuenta.findAll(
                                                                        datosCuenta
                                                                    ).then(function (cuentasGrupoDos) {
                                                                        condicionTipo.nombre_corto = "2"
                                                                        ContabilidadCuenta.findAll(
                                                                            datosCuenta
                                                                        ).then(function (cuentasSubGrupoDos) {
                                                                            condicionTipo.nombre_corto = "3"
                                                                            ContabilidadCuenta.findAll(
                                                                                datosCuenta
                                                                            ).then(function (cuentasGenericasDos) {
                                                                                condicionTipo.nombre_corto = "4"
                                                                                ContabilidadCuenta.findAll(
                                                                                    datosCuenta
                                                                                ).then(function (cuentasApropiacionDos) {
                                                                                    res.json({
                                                                                        primero: {
                                                                                            cuentasGrupo: cuentasGrupo, cuentasSubGrupo: cuentasSubGrupo, cuentasGenericas: cuentasGenericas, cuentasApropiacion: cuentasApropiacion,
                                                                                            cuentasGrupoFijo: cuentasGrupoFijo, cuentasSubGrupoFijo: cuentasSubGrupoFijo, cuentasGenericasFijo: cuentasGenericasFijo, cuentasApropiacionFijo: cuentasApropiacionFijo

                                                                                        }, monedaCambio: MonedaCambio,
                                                                                        segundo: {
                                                                                            cuentasGrupo: cuentasGrupoDos, cuentasSubGrupo: cuentasSubGrupoDos, cuentasGenericas: cuentasGenericasDos, cuentasApropiacion: cuentasApropiacionDos,
                                                                                            cuentasGrupoFijo: cuentasGrupoFijoDos, cuentasSubGrupoFijo: cuentasSubGrupoFijoDos, cuentasGenericasFijo: cuentasGenericasFijoDos, cuentasApropiacionFijo: cuentasApropiacionFijoDos

                                                                                        }
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })

    router.route('/comprobante-contabilidad/empresa/:empresa/inicio/:inicio/fin/:fin')
    .get(function (req, res) {
        //var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
        //var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);

        var inicio =  new Date(req.params.inicio);//.toISOString().split('T')[0].reverse().join('-')+" T00.00.00.000Z"; 
        var fin = new Date(req.params.fin);
        fin.setHours(23)
        fin.setMinutes(59)

        var queryFecha = {fecha: {$between: [inicio, fin]} }
        var condicionSucursal = { id_empresa: req.params.empresa };
        ComprobanteContabilidad.findAll({
            // offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
            where: queryFecha,
            include:[
                {model:AsientoContabilidad,as:'asientosContables',where: { eliminado: false }, include:[{ model: ContabilidadCuenta, as : 'cuenta'}]},
                { model: Sucursal, as: 'sucursal',where: condicionSucursal, include: [{ model: Empresa, as: 'empresa' }]},
                { model: MonedaTipoCambio, as: 'tipoCambio'}             
            ]
            
        }).then(function (comprobantes) {
            res.json({comprobantes});
        });
    })
      
}