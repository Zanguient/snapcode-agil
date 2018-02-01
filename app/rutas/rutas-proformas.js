module.exports = function (router, sequelize, Sequelize, Usuario, Cliente, Proforma, DetallesProformas, ActividadEconomica, Servicios, Clase, Sucursal, SucursalActividadDosificacion, CodigoControl,
    CodigoControl, NumeroLiteral) {
    router.route('/proformas/empresa/:id_empresa/mes/:mes/anio/:anio/suc/:sucursal/act/:actividad/ser/:servicio/monto/:monto/razon/:razon/usuario/:usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/num/:numero')
        .get(function (req, res) {
            var condicion = {}
            var condicionCliente = {}
            var condicionServicio = {}
            var condicionUsuario = {}
            condicion.id_empresa = req.params.id_empresa
            condicion.eliminado = false
            if (req.params.mes != "0") {
                condicion.periodo_mes = parseInt(req.params.mes)
            }
            if (req.params.anio != "0") {
                condicion.periodo_anio = parseInt(req.params.anio)
            }
            if (req.params.sucursal != "0") {
                condicion.id_sucursal = parseInt(req.params.sucursal)
            }
            if (req.params.actividad != "0") {
                condicion.id_actividad = parseInt(req.params.actividad)
            }
            if (req.params.monto != "0") {
                condicion.totalImporteBs = parseFloat(req.params.monto)
            }
            if (req.params.servicio != "0") {
                condicionServicio.id = req.params.servicio
            }
            if (req.params.razon != "0") {
                condicionCliente = {
                    razon_social: { $or: [{ $like: '%' + req.params.razon + '%' }] }
                }
            }
            if (req.params.usuario != "0") {
                condicionUsuario = {
                    nombre_usuario: { $or: [{ $like: '%' + req.params.usuario + '%' }] }
                }
            }
            if (req.params.numero != "0") {
                condicion.id = req.params.numero
            }
            Proforma.findAndCountAll(
                {
                    where: condicion,
                    include: [
                        { model: ActividadEconomica, as: 'actividadEconomica', include: [{ model: Clase, as: 'claseActividad' }] },
                        { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio', where: condicionServicio }] },
                        { model: Usuario, as: 'usuarioProforma', where: condicionUsuario },
                        { model: Cliente, as: 'clienteProforma', where: condicionCliente },
                        { model: Sucursal, as: 'sucursalProforma' }
                    ]
                }).then(function (proformas) {
                    res.json({ proformas: proformas.rows, count: Math.ceil(proformas.count / req.params.items_pagina) })
                }).catch(function (err) {
                    res.json({ proformas: [], mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                });
        })
        .post(function (req, res) {
            Proforma.create({
                fecha_proforma: req.body.fecha_proforma,
                // fecha_proforma_ok:null,
                // fecha_recepcion:null,
                // fecha_factura:null,
                // fecha_cobro:null,
                id_empresa: req.body.id_empresa,
                detalle: req.body.detalle,
                periodo_mes: req.body.periodo_mes.id,
                periodo_anio: req.body.periodo_anio.id,
                id_sucursal: req.body.sucursalProforma.id,
                id_actividad: req.body.actividadEconomica.id,
                id_cliente: req.body.clienteProforma.id,
                id_usuario: req.body.usuarioProforma.id,
                totalImporteBs: req.body.totalImporteBs,
                eliminado: false
            }).then(function (proformaCreada) {
                req.body.detallesProformas.map(function (detalle, i) {
                    DetallesProformas.create({
                        id_proforma: proformaCreada.id,
                        id_servicio: detalle.id_servicio,
                        precio_unitario: detalle.precio_unitario,
                        cantidad: detalle.cantidad,
                        importeBs: detalle.importeBs,
                        id_centro_costo: detalle.centroCosto !== undefined && detalle.centroCosto !== null ? detalle.centroCosto.id : null,
                        eliminado: false
                    }).then(function (detalleCreado) {
                        if (i === req.body.detallesProformas.length - 1) {
                            res.json({ mensaje: 'Proforma creada satisfactoriamente!' })
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                    });
                })
            }).catch(function (err) {
                res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
            });
        })
    router.route('/fechas/proforma/:id')
        .post(function (req, res) {
            // if (req.body.fecha_recepcion !== null) {
            //     req.body.fecha_recepcion = new Date(req.body.fecha_recepcion)
            //     if (req.body.fecha_proforma_ok!==null) {

            //     }


            // }else{
            //     res.json({mensaje:'No se puede guardar sin la fecha de recepcion!'})
            // }
            Proforma.update({
                // fecha_recepcion: (req.body.fecha_recepcion instanceof Date) ? req.body.fecha_recepcion : null,
                // fecha_proforma_ok: (req.body.fecha_proforma_ok instanceof Date) ? req.body.fecha_proforma_ok : null,
                // fecha_factura: (req.body.fecha_factura instanceof Date) ? req.body.fecha_factura : null,
                // fecha_cobro: (req.body.fecha_cobro instanceof Date) ? req.body.fecha_cobro : null
                fecha_recepcion: (req.body.fecha_recepcion !== null) ? new Date(req.body.fecha_recepcion) : null,
                fecha_proforma_ok: (req.body.fecha_proforma_ok !== null) ? new Date(req.body.fecha_proforma_ok) : null,
                fecha_factura: (req.body.fecha_factura !== null) ? new Date(req.body.fecha_factura) : null,
                fecha_cobro: (req.body.fecha_cobro !== null) ? new Date(req.body.fecha_cobro) : null
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (fechasActualizadas) {
                    res.json({ mensaje: 'Las fechas Fueron actualizadas.' })
                }).catch(function (err) {
                    res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                });
        })
    router.route('/proforma/:id')
        .get(function (req, res) {
            Proforma.find(
                {
                    where: { id: req.params.id },
                    include: [
                        { model: ActividadEconomica, as: 'actividadEconomica', include: [{ model: Clase, as: 'claseActividad' }] },
                        { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio' }, { model: Clase, as: 'centroCosto' }] },
                        { model: Usuario, as: 'usuarioProforma' },
                        { model: Cliente, as: 'clienteProforma' },
                        { model: Sucursal, as: 'sucursalProforma' }

                    ]
                }).then(function (proforma) {
                    res.json({ proforma: proforma })

                }).catch(function (err) {
                    res.json({ proforma: {}, mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                });
        })
        .put(function (req, res) {

            Proforma.update({
                fecha_proforma: req.body.fecha_proforma,
                // fecha_proforma_ok:null,
                // fecha_recepcion:null,
                // fecha_factura:null,
                // fecha_cobro:null,
                id_empresa: req.body.id_empresa,
                periodo_mes: req.body.periodo_mes.id,
                periodo_anio: req.body.periodo_anio.id,
                id_sucursal: req.body.sucursalProforma.id,
                id_actividad: req.body.actividadEconomica.id,
                id_cliente: req.body.clienteProforma.id,
                id_usuario: req.body.usuarioProforma.id,
                totalImporteBs: req.body.totalImporteBs,
                eliminado: req.body.eliminado
            }, { where: { id: req.params.id } }).then(function (proformaActualizada) {
                req.body.detallesProformas.map(function (detalle, i) {
                    if (detalle.id !== undefined) {
                        DetallesProformas.update({
                            id_proforma: req.params.id,
                            id_servicio: detalle.id_servicio,
                            precio_unitario: detalle.precio_unitario,
                            cantidad: detalle.cantidad,
                            importeBs: detalle.importeBs,
                            id_centro_costo: detalle.centroCosto !== undefined && detalle.centroCosto !== null ? detalle.centroCosto.id : null,
                            eliminado: detalle.eliminado
                        }, { where: { id: detalle.id } }).then(function (detalleActializado) {
                            if (i === req.body.detallesProformas.length - 1) {
                                res.json({ mensaje: 'Proforma actualizada!' })
                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                        });
                    } else {
                        DetallesProformas.create({
                            id_proforma: req.params.id,
                            id_servicio: detalle.id_servicio,
                            precio_unitario: detalle.precio_unitario,
                            cantidad: detalle.cantidad,
                            importeBs: detalle.importeBs,
                            id_centro_costo: detalle.centroCosto !== undefined && detalle.centroCosto !== null ? detalle.centroCosto.id : null,
                            eliminado: detalle.eliminado
                        }).then(function (detalleActializado) {
                            if (i === req.body.detallesProformas.length - 1) {
                                res.json({ mensaje: 'Proforma actualizada!' })
                            }
                        })
                    }
                })

            }).catch(function (err) {
                res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
            });
        })
    router.route('/actividades/empresa/:id_empresa')
        .post(function (req, res) {
            var mensajeExtra = ""
            req.body.map(function (actividad, i) {
                if (actividad.id !== undefined) {
                    var enUso = false
                    if (actividad.eliminado) {
                        Servicios.find({
                            where: { id_actividad: actividad.id }
                        }).then(function (ActividadEnUso) {
                            if (ActividadEnUso !== null) {
                                if (ActividadEnUso.id !== undefined) {
                                    enUso = true
                                    mensajeExtra += ". La actividad " + actividad.claseActividad.nombre + " tiene servicios activos y no se puede eliminar. Para eliminar la actividad primero elimine sus servicios."
                                }
                            }
                            if (!enUso) {
                                ActividadEconomica.destroy({
                                    where: { id: actividad.id }
                                }).then(function (actividadEliminada) {
                                    if (i === req.body.length - 1) {
                                        res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' + mensajeExtra })
                                    }
                                }).catch(function (err) {
                                    res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                                });
                            } else {
                                if (i === req.body.length - 1) {
                                    res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' + mensajeExtra })
                                }
                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                        });

                    } else {
                        if (i === req.body.length - 1) {
                            res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' + mensajeExtra })
                        }
                    }
                } else {
                    ActividadEconomica.create({
                        id_clase_actividad: actividad.claseActividad.id,
                        id_empresa: actividad.id_empresa,
                        eliminado: false
                    }).then(function (actividadEmpresaCreada) {
                        if (i === req.body.length - 1) {
                            res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' })
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                    });
                }
            })
        })
        .get(function (req, res) {
            ActividadEconomica.findAll({
                where: { id_empresa: req.params.id_empresa, eliminado: false },
                include: [{ model: Clase, as: 'claseActividad' }]
            }).then(function (actividades) {
                res.json({ actividades: actividades })
            }).catch(function (err) {
                res.json({ actividades: [], mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
            });
        })
        .put(function (req, res) {
            ActividadEconomica.update({

                where: { id: req.body.id }
            }).then(function (actividadActualizada) {
                res.json({ mensaje: 'Actividad Actualizada' })
            }).catch(function (err) {
                res.json({ actividades: [], mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
            });
        })

    router.route('/actividades/servicios/empresa/:id_empresa/:id_actividad')
        .post(function (req, res) {
            if (req.body.length > 0) {
                req.body.map(function (servicio, i) {
                    var enUso = false
                    var mensajeExtra = ""
                    if (servicio.id !== undefined) {
                        if (servicio.eliminado) {
                            DetallesProformas.find({
                                where: { id_servicio: servicio.id }
                            }).then(function (servicioEnuso) {

                                if (servicioEnuso !== null) {
                                    if (servicioEnuso.id !== undefined) {
                                        enUso = true
                                        mensajeExtra += ". El servicio " + servicio.nombre + " ya fué utilizado y no se puede eliminar"
                                    }
                                }
                                if (!enUso) {
                                    Servicios.destroy({
                                        where: { id: servicio.id }
                                    }).then(function (actividadEliminada) {
                                        if (i === req.body.length - 1) {
                                            res.json({ mensaje: 'Servicios actualizados satisfactoriamente!' + mensajeExtra })
                                        }
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                                    });
                                } else {
                                    if (i === req.body.length - 1) {
                                        res.json({ mensaje: 'Servicios actualizados satisfactoriamente!' + mensajeExtra })
                                    }
                                }
                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                            });
                        } else {
                            Servicios.update({
                                id_actividad: servicio.actividad.id,
                                centro_costo: null,
                                codigo: servicio.codigo,
                                nombre: servicio.nombre,
                                precio: parseFloat(servicio.precio),
                                eliminado: false
                            }).then(function (servicioActualizado) {
                                if (i === req.body.length - 1) {
                                    res.json({ mensaje: 'Servicios actualizados satisfactoriamente!' })
                                }
                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                            });
                        }
                    } else {
                        if (servicio.actividad.id === undefined) {
                            ActividadEconomica.find({
                                where: { id_clase_actividad: servicio.actividad.claseActividad.id },
                                include: [{ model: Clase, as: 'claseActividad' }]
                            }).then(function (actividad) {
                                servicio.actividad = actividad
                                Servicios.create({
                                    id_actividad: servicio.actividad.id,
                                    centro_costo: null,
                                    codigo: servicio.codigo,
                                    nombre: servicio.nombre,
                                    precio: parseFloat(servicio.precio),
                                    eliminado: false
                                }).then(function (servicioCreado) {
                                    if (i == req.body.length - 1) {
                                        res.json({ mensaje: 'Servicio creado satisfactoriamente!' })
                                    }
                                }).catch(function (err) {
                                    res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                                });
                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                            });
                        } else {
                            Servicios.create({
                                id_actividad: servicio.actividad.id,
                                centro_costo: null,
                                codigo: servicio.codigo,
                                nombre: servicio.nombre,
                                precio: parseFloat(servicio.precio),
                                eliminado: false
                            }).then(function (servicioCreado) {
                                if (i == req.body.length - 1) {
                                    res.json({ mensaje: 'Servicio creado satisfactoriamente!' })
                                }
                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                            });
                        }

                    }
                })
            } else {
                res.json({ mensaje: 'No se encontraron datos para guardar' })
            }
        })
        .get(function (req, res) {
            Servicios.findAll({
                where: {
                    id_actividad: req.params.id_actividad
                },
                include: [{ model: ActividadEconomica, as: 'actividad', include: [{ model: Clase, as: 'claseActividad' }] }]
            }).then(function (servicios) {
                if (servicios !== null) {
                    res.json({ servicios: servicios })
                } else {
                    res.json({ servicios: [] })
                }

            }).catch(function (err) {
                res.json({ servicios: [], mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
            });
        })
        .put(function (req, res) {
            Servicios.update({
                where: { id: req.body.id }
            }).then(function (servicioActualizado) {
                res.json({ mensaje: 'Servicio actualizado' })
            }).catch(function (err) {
                res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
            });
        })

    router.route('/eliminar/proforma/:id')
        .post(function (req, res) {
            Proforma.update({
                eliminado: req.body.eliminado
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (fechasActualizadas) {
                    res.json({ mensaje: 'Proforma eliminada.' })
                }).catch(function (err) {
                    res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
                });
        })

    router.route('/alertas/proformas/:id_empresa')
        .get(function (req, res) {
            Proforma.findAll({
                where: {
                    id_empresa: req.params.id_empresa,
                    eliminado: false,
                    fecha_proforma_ok: null
                },
                include: [
                    { model: ActividadEconomica, as: 'actividadEconomica', include: [{ model: Clase, as: 'claseActividad' }] },
                    // { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio' }, { model: Clase, as: 'centroCosto' }] },
                    // { model: Usuario, as: 'usuarioProforma' },
                    { model: Cliente, as: 'clienteProforma' },
                    // { model: Sucursal, as: 'sucursalProforma' }

                ]
            }).then(function (proformasAlertas) {
                var proformasVencimiento = []
                if (proformasAlertas.length > 0) {
                    proformasAlertas.map(function (proforma, i) {
                        var fecPro = new Date(proforma.fecha_proforma).getTime()

                        var hoy = new Date().getTime()
                        var dif = Math.floor((hoy - fecPro) / 86400000)
                        if (dif > 0 && dif < 8) {
                            proformasVencimiento.push(proforma)
                        }
                        if (i === proformasAlertas.length - 1) {
                            res.json({ proformas: proformasVencimiento })
                        }
                    })
                } else {
                    res.json({ proformas: [] })
                }


            }).catch(function (err) {
                res.json({ mensaje: err.message === undefined ? err.data : err.message, hasErr: true })
            });
        })
}