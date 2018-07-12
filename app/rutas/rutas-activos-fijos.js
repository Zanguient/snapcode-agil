module.exports = function (router, sequelize, Sequelize, Usuario, ActivosFijos, ActivosFijosValores, ActivosFijosConfiguracion, Clase, Producto, Inventario, MonedaTipoCambio) {

    router.route('/activos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/subgrupo/:subgrupo/mes/:mes/year/:anio/codigo/:codigo/activo/:activo/vida/:vida_util')
        .get(function (req, res) {
            var mes = new Date().getMonth() + 1
            var year = new Date().getFullYear()
            var condicionProducto = { id_empresa: req.params.id_empresa };
            var condicionValores = { eliminado: false, mes: mes, anio: year }
            var condicionConfiguracion = {id_empresa: req.params.id_empresa}
            if (req.params.activo !== "0") {
                condicionProducto.nombre = { $like: req.params.activo + '%' }
            }
            if (req.params.vida_util !== "0") {
                condicionConfiguracion.vida_util = req.params.vida_util
            }
            if (req.params.mes !== "0") {
                condicionValores.mes = req.params.mes
            }
            if (req.params.anio !== "0") {
                condicionValores.anio = req.params.anio
            }
            if (req.params.subgrupo !== "0") {
                condicionProducto.id_subgrupo = req.params.subgrupo
            }
            if (req.params.codigo !== "0") {
                condicionProducto.codigo = req.params.codigo
            }
            ActivosFijos.findAll({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: ActivosFijosValores, as: 'valores', where: condicionValores },
                {
                    model: Producto, as: 'activo', attributes: ['nombre', 'codigo', 'id_subgrupo'],
                    include: [{ model: Inventario, as: 'inventarios' },
                    { model: Clase, as: 'subgrupo', include: [{ model: ActivosFijosConfiguracion, as: 'configuracion', where: condicionConfiguracion, required: false }] }], where: condicionProducto
                }]
            }).then(function (activos) {
                res.json({ activos: activos });
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true });
            });
        });

    router.route('/activos/configuracion/empresa/:id_empresa/:id_usuario')
        .get(function (req, res) {
            ActivosFijosConfiguracion.findAll({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: Clase, as: 'subgrupo' }]
            }).then(function (configuracion) {
                res.json({ configuracion: configuracion });
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true });
            });
        })

        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promesas = []
                req.body.forEach(function (detalle) {
                    if (detalle.id) {
                        promesas.push(editarDetalleConfiguracion(detalle, t, req.params));
                    } else {
                        promesas.push(crearDetalleConfiguracion(detalle, t, req.params));
                    }
                })
                return Promise.all(promesas);
            }).then(function (result) {
                if (result) {
                    res.json({ mensaje: 'Configuración actualizada.' });
                } else {
                    res.json({ mensaje: 'Parece haber un error no determinado.', hasErr: true });
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true });
            })
        });

    router.route('/activos/revaluacion/:id_empresa/user/:id_usuario')
        .put(function (req, res) {
            var fecha_revaluacion = new Date(req.body.fecha_revaluacion.split('/').reverse())
            var mesAnterior = new Date(fecha_revaluacion.getFullYear(), fecha_revaluacion.getMonth(), 0, 0, 0, 0, 0)
            var mesActual = new Date(fecha_revaluacion.getFullYear(), fecha_revaluacion.getMonth(), 1, 23, 59, 59, 999)
            MonedaTipoCambio.findAll({
                where: {
                    fecha: {
                        $between: [mesAnterior, mesActual]
                    }
                }
            }).then(function (MonedaCambio) {
                var ufv1 = 0 //MonedaCambio[0].ufv
                var ufv2 = MonedaCambio[0].ufv
                ActivosFijosValores.create({
                    id_usuario: req.params.id_usuario,
                    id_activo: req.body.id,
                    mes: new Date(req.body.fecha_revaluacion.split('/').reverse()).getMonth(),
                    anio: new Date(req.body.fecha_revaluacion.split('/').reverse()).getFullYear(),
                    valor: req.body.valor_revaluacion,
                    incremento_actualizacion: ((req.body.valor_revaluacion / ufv1) * ufv2) - req.body.valor_revaluacion,
                    valor_actualizado: 0,
                    depreciacion_acumulada: 0,
                    incremento_actualizacion_depreciacion_acumulada: 0,
                    depreciacion_acumulada_actualizada: 0,
                    depreciacion: 0,
                    total_depreciacion_acumulada: 0,
                    valor_neto: 0,
                    eliminado: false
                }, {
                        where: {
                            id_activo: req.body.id
                        }
                    }).then(function (configuracion) {
                        res.json({ configuracion: configuracion });
                    }).catch(function (err) {
                        res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true });
                    });
            })
        });

    function crearDetalleConfiguracion(detalle, t, params) {
        return ActivosFijosConfiguracion.create({
            id_usuario: params.id_usuario,
            id_empresa: params.id_empresa,
            id_subgrupo: detalle.subgrupo.id,
            vida_util: detalle.vida_util,
            factor: detalle.factor,
            eliminado: false
        }, { transaction: t }).then(function (res) {
            return new Promise(function (fulfill, reject) {
                fulfill('Detalle configuración creado.');
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })
    };

    function editarDetalleConfiguracion(detalle, t, params) {
        return ActivosFijosConfiguracion.update({
            id_usuario: params.id_usuario,
            id_empresa: params.id_empresa,
            id_subgrupo: detalle.subgrupo.id,
            vida_util: detalle.vida_util,
            factor: detalle.factor,
            eliminado: detalle.eliminado
        }, { where: { id: detalle.id }, transaction: t }).then(function (res) {
            return new Promise(function (fulfill, reject) {
                fulfill('Detalle configuración actualizado.');
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })
    }

    router.route('/activos/mensual/:id_empresa')
        .get(function (req, res) {
            var promesas = []
            var mes = new Date().getMonth() + 1
            var year = new Date().getFullYear()
            var initlastDate = new Date(year, mes - 1, 0)
            var initnextDate = new Date(year, mes, 0)
            var endlastDate = new Date(year, mes - 1, 0, 23, 59, 59, 999)
            var endnextDate = new Date(year, mes, 0, 23, 59, 59, 999)
            MonedaTipoCambio.findAll({
                where: {
                    $or: [{
                        fecha: {
                            $between: [initlastDate, endlastDate]
                        }
                    },
                    {
                        fecha: {
                            $between: [initnextDate, endnextDate]
                        }
                    }
                    ]
                }
            }).then(function (MonedaCambio) {
                if (MonedaCambio.length === 2) {
                    var ufv1 = MonedaCambio[0].ufv;
                    var ufv2 = MonedaCambio[1].ufv;
                    sequelize.transaction(function (t) {
                        return ActivosFijos.findAll({
                            where: {
                                id_empresa: req.params.id_empresa,
                                $or: [{ ultima_actualizacion: { $between: [new Date((new Date().getMonth() > 0 ? new Date().getFullYear(): new Date().getFullYear() -1), (new Date().getMonth() > 0 ? new Date().getMonth() -1: 11), 1, 0, 0), new Date(new Date().getFullYear(), (new Date().getMonth()), 0, 23, 59, 59, 999)] } }, { ultima_actualizacion: { $eq: null } }],
                                fecha_ingreso: { $notBetween: [new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0), new Date(new Date().getFullYear(), new Date().getMonth()+1, 0, 23, 59, 59, 999)] }
                            },
                            include: [{ model: ActivosFijosValores, as: 'valores', where: { anio: new Date().getFullYear(), $or: [{ mes: (new Date().getMonth()) }, { mes: (new Date().getMonth()+1) }] } }, { model: Producto, as: 'activo', attributes: ['nombre', 'codigo', 'id_subgrupo'], include: [{ model: Inventario, as: 'inventarios' }, { model: Clase, as: 'subgrupo', include: [{ model: ActivosFijosConfiguracion, as: 'configuracion', required: false }] }] }],
                            transaction: t
                        }).then(function (activosFijos) {
                            if (activosFijos.length > 0) {
                                for (var index = 0; index < activosFijos.length; index++) {
                                    promesas.push(crearValoresActivosFijos(activosFijos[index], t, mes, year, ufv1, ufv2))
                                }
                            } else {
                                var po = new Promise(function (fulfill, reject) {
                                    fulfill({mensaje:'No hay activos fijos para actualizar.', normal: true})
                                })
                                promesas.push(po)
                            }
                            return Promise.all(promesas)
                        }).catch(function (err) {
                            return new Promise(function (fulfill, reject) {
                                reject((err.stack !== undefined) ? err.stack : err);
                            });
                        });
                    }).then(function (result) {
                        if (result !== undefined) {
                            var mensaje = ''
                            var err = false
                            if (result.length > 0) {
                                result.forEach(function (obj) {
                                    if (obj.err) {
                                        mensaje+= '|' +obj.mensaje + ' | ';
                                        err = true;
                                    }
                                })
                                if (err) {
                                    res.json({ mensaje: mensaje, hasErr: true })
                                }else{

                                }
                                res.json({mensaje: 'No es necesario actualizar los activos fijos'})
                            }else{
                                res.json({mensaje: 'No es necesario actualizar los activos fijos'})
                            }
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true });
                    });
                } else {
                    throw new Error("No se encuentra la información de ufv's necesaria para actualizar los activos fijos.")
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true });
            });
        })
    function crearValoresActivosFijos(activo, t, mes, year, ufv1, ufv2) {
        if (activo.valores.length > 0 && activo.valores.length == 1) {
            var valorAnterior = activo.valores.filter(function (val) {
                return ((val.dataValues.mes === mes - 1) && val.dataValues.anio === year);
            })[0];
        } else {
            return new Promise(function (fulfill, reject) {
                if (activo.valores.length > 2) {
                    reject({mensaje: 'El activo fijo con código "' + activo.activo.codigo + '" contiene datos en conflicto. No se puede actualizar la depreciación.', err: true});
                } else if(activo.valores.length == 2) {
                    fulfill({mensaje: 'El activo fijo con código "' + activo.activo.codigo + '" ya fué depreciado el mes actual.', normal: true});
                }
            });
        }

        if (valorAnterior && activo.activo.subgrupo.configuracion && activo.activo.inventarios.length > 0) {
            return ActivosFijosValores.create({
                id_usuario: activo.id_usuario,
                id_activo: activo.id,
                mes: new Date().getMonth() + 1,
                anio: new Date().getFullYear(),
                valor: valorAnterior.dataValues.valor,
                incremento_actualizacion: ((valorAnterior.dataValues.valor / ufv1) * ufv2) - valorAnterior.dataValues.valor,
                valor_actualizado: (((valorAnterior.dataValues.valor / ufv1) * ufv2) - valorAnterior.dataValues.valor) + valorAnterior.dataValues.valor,
                depreciacion_acumulada: valorAnterior.dataValues.total_depreciacion_acumulada,
                incremento_actualizacion_depreciacion_acumulada: ((valorAnterior.dataValues.depreciacion_acumulada / ufv1) * ufv2) - valorAnterior.dataValues.total_depreciacion_acumulada,
                depreciacion_acumulada_actualizada: valorAnterior.dataValues.total_depreciacion_acumulada + (((valorAnterior.dataValues.depreciacion_acumulada / ufv1) * ufv2) - valorAnterior.dataValues.total_depreciacion_acumulada),
                depreciacion: ((((valorAnterior.dataValues.valor / ufv1) * ufv2) - valorAnterior.dataValues.valor) + valorAnterior.dataValues.valor) / activo.activo.subgrupo.configuracion.factor / 12,
                total_depreciacion_acumulada: (valorAnterior.dataValues.total_depreciacion_acumulada + (((valorAnterior.dataValues.depreciacion_acumulada / ufv1) * ufv2) - valorAnterior.dataValues.total_depreciacion_acumulada)) + (((((valorAnterior.dataValues.valor / ufv1) * ufv2) - valorAnterior.dataValues.valor) + valorAnterior.dataValues.valor) / activo.activo.subgrupo.configuracion.factor / 12),
                valor_neto: ((((valorAnterior.dataValues.valor / ufv1) * ufv2) - valorAnterior.dataValues.valor) + valorAnterior.dataValues.valor) - ((valorAnterior.dataValues.total_depreciacion_acumulada + (((valorAnterior.dataValues.depreciacion_acumulada / ufv1) * ufv2) - valorAnterior.dataValues.total_depreciacion_acumulada)) + (((((valorAnterior.dataValues.valor / ufv1) * ufv2) - valorAnterior.dataValues.valor) + valorAnterior.dataValues.valor) / activo.activo.subgrupo.configuracion.factor / 12)),
                eliminado: false
            }, { transaction: t }).then(function (valorCreado) {
                var fechaActualizacion = new Date(year, mes-1, new Date().getDate(), 0,0,0,0)
                return ActivosFijos.update({
                    ultima_actualizacion: fechaActualizacion
                }, {
                        where: { id: activo.id }, transaction: t
                    }).then(function (activoActualizado) {
                        return new Promise(function (fulfill, reject) {
                            fulfill('Actualizacion de activo fijo: correcta...')
                        });
                    }).catch(function (err) {
                        return new Promise(function (fulfill, reject) {
                            reject((err.stack !== undefined) ? err.stack : err);
                        });
                    });
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            });
        } else {
            return new Promise(function (fulfill, reject) {
                fulfill('El activo codigo "' + activo.activo.codigo + '" no tiene configuración...')
            });
        }
    }
}