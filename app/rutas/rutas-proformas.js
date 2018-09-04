module.exports = function (router, sequelize, Sequelize, Usuario, Cliente, Proforma, DetallesProformas, Servicios, Clase, Sucursal, SucursalActividadDosificacion, Dosificacion,
    CodigoControl, NumeroLiteral, Empresa, ConfiguracionGeneralFactura, Tipo, UsuarioSucursal, Almacen, Venta, DetalleVenta, ConfiguracionGeneralFactura, ConfiguracionFactura, Movimiento, ClienteCentroCostos, MonedaTipoCambio) {
    router.route('/proformas/empresa/:id_empresa/mes/:mes/anio/:anio/suc/:sucursal/act/:actividad/ser/:servicio/monto/:monto/razon/:razon/usuario/:usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/num/:numero/facturas/:id_opcion')
        .get(function (req, res) {
            var condicion = {}
            var condicionCliente = {}
            var condicionServicio = {}
            var condicionUsuario = {}
            var condicionActividad = {}
            condicion.id_empresa = req.params.id_empresa
            // condicion.eliminado = false
            if (req.params.mes != "0") {
                condicion.periodo_mes = parseInt(req.params.mes) - 1
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
                condicion.totalImporteBs = req.params.monto
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
                condicion.correlativo = req.params.numero
            }
            if (req.params.id_opcion != "0") {
                if (req.params.id_opcion == "1") {
                    condicion.fecha_factura = { $ne: null }
                } else if (req.params.id_opcion == "2") {
                    condicion.fecha_factura = { $eq: null }
                }
                // condicion.id = req.params.numero
            }
            Proforma.findAndCountAll(
                {
                    where: condicion,
                    include: [
                        { model: Clase, as: 'actividadEconomica' },
                        { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio', where: condicionServicio }] },
                        { model: Usuario, as: 'usuarioProforma', where: condicionUsuario },
                        { model: Cliente, as: 'cliente', where: condicionCliente },
                        { model: Sucursal, as: 'sucursal' }
                    ],
                    order: [['correlativo', 'desc']]
                }).then(function (count) {
                    Proforma.findAll(
                        {
                            offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                            where: condicion,
                            include: [
                                { model: Clase, as: 'actividadEconomica' },
                                { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio', where: condicionServicio }] },
                                { model: Usuario, as: 'usuarioProforma', where: condicionUsuario },
                                { model: Cliente, as: 'cliente', where: condicionCliente },
                                { model: Sucursal, as: 'sucursal' }
                            ],
                            order: [['correlativo', 'desc']]
                        }).then(function (proformas) {
                            res.json({ proformas: proformas, count: Math.ceil(count.count / req.params.items_pagina) })
                        }).catch(function (err) {
                            res.json({ proformas: [], mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                        });
                }).catch(function (err) {
                    res.json({ proformas: [], mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                });
        })



    router.route('/proforma-sucursales/:id_usuario')
        .get(function (req, res) {
            UsuarioSucursal.findAll({
                where: {
                    id_usuario: req.params.id_usuario
                },
                include: [{
                    model: Sucursal, as: 'sucursal',
                    include: [
                        { model: Almacen, as: 'almacenes' },
                        {
                            model: SucursalActividadDosificacion, as: 'actividadesDosificaciones',
                            include: [{ model: Dosificacion, as: 'dosificacion' },
                            { model: Clase, as: 'actividad' }]
                        }]
                }]
            }).then(function (entidades) {
                res.json({ sucursales: entidades });
            }).catch(function (err) {
                res.json({ mensaje: err.stack === undefined ? err.stack : err.message, hasErr: true })
            });
        });

    router.route('/guardar/proforma/:id_empresa/:usuario')
        .post(function (req, res) {
            var detalles = []
            sequelize.transaction(function (t) {
                return Sucursal.find({
                    where: { id: req.body.sucursal.id }
                }).then(function (sucursal) {
                    var conteo = sucursal.dataValues.correlativo_proforma + 1
                    return Sucursal.update({
                        correlativo_proforma: conteo
                    }, {
                            where: { id: sucursal.dataValues.id },
                            transaction: t
                        }).then(function (sucursalActualizada) {
                            return Proforma.create({
                                fecha_proforma: req.body.fecha_proforma,
                                // fecha_proforma_ok:null,
                                // fecha_recepcion:null,
                                // fecha_factura:null,
                                // fecha_cobro:null,
                                id_empresa: req.body.id_empresa,
                                detalle: req.body.detalle,
                                periodo_mes: req.body.periodo_mes.id,
                                periodo_anio: req.body.periodo_anio.id,
                                id_sucursal: req.body.sucursal.id,
                                id_actividad: req.body.actividadEconomica.id,
                                id_cliente: req.body.cliente.id,
                                id_usuario: req.body.usuarioProforma.id,
                                totalImporteBs: req.body.totalImporteBs,
                                correlativo: sucursal.dataValues.correlativo_proforma,
                                eliminado: false
                            }, { transaction: t }).then(function (proformaCreada) {
                                req.body.detallesProformas.map(function (detalle, i) {
                                    detalles.push(crearDetalleProforma(proformaCreada, detalle, t))
                                })
                                return Promise.all(detalles)
                            }).catch(function (err) {
                                return new Promise(function (fulfill, reject) {
                                    reject((err.stack !== undefined) ? err.stack : err);
                                });
                            })
                        }).catch(function (err) {
                            return new Promise(function (fulfill, reject) {
                                reject((err.stack !== undefined) ? err.stack : err);
                            });
                        })
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                });
            }).then(function (result) {
                if (result.length === req.body.detallesProformas.length) {
                    res.json({ mensaje: 'Proforma creada satisfactoriamente!' })
                } else {
                    res.json({ mensaje: 'Existe un error no identificado!' })
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
            });
        })

    function crearDetalleProforma(proformaCreada, detalle, t) {
        return DetallesProformas.create({
            id_proforma: proformaCreada.id,
            id_servicio: detalle.id_servicio,
            precio_unitario: detalle.precio_unitario,
            cantidad: detalle.cantidad,
            importe: detalle.importe,
            id_centro_costo: detalle.centroCosto !== undefined && detalle.centroCosto !== null ? detalle.centroCosto.id : null,
            eliminado: false
        }, { transaction: t }).then(function (detalleCreado) {
            return new Promise(function (fulfill, reject) {
                fulfill(detalleCreado)
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })
    }
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
                    res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                });
        })
    router.route('/proforma/:id')
        .get(function (req, res) {
            Proforma.find(
                {
                    where: { id: req.params.id },
                    include: [
                        { model: Clase, as: 'actividadEconomica' },
                        { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio' }, { model: Clase, as: 'centroCosto' }] },
                        { model: Usuario, as: 'usuarioProforma' },
                        { model: Cliente, as: 'cliente' },
                        {
                            model: Sucursal, as: 'sucursal', include: [
                                // { model: Almacen, as: 'almacenes' },
                                {
                                    model: SucursalActividadDosificacion, as: 'actividadesDosificaciones',
                                    include: [{ model: Dosificacion, as: 'dosificacion' },
                                    { model: Clase, as: 'actividad' }]
                                }]
                        }
                    ]
                }).then(function (proforma) {
                    res.json({ proforma: proforma })
                }).catch(function (err) {
                    res.json({ proforma: {}, mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                });
        })
        .put(function (req, res) {
            sequelize.transaction(function (t) {
                var promesas = []
                return Proforma.update({
                    fecha_proforma: req.body.fecha_proforma,
                    // fecha_proforma_ok:null,
                    // fecha_recepcion:null,
                    // fecha_factura:null,
                    // fecha_cobro:null,
                    detalle: req.body.detalle,
                    id_empresa: req.body.id_empresa,
                    periodo_mes: req.body.periodo_mes.id,
                    periodo_anio: req.body.periodo_anio.id,
                    id_sucursal: req.body.sucursal.id,
                    id_actividad: req.body.actividadEconomica.id,
                    id_cliente: req.body.cliente.id,
                    id_usuario: req.body.usuarioProforma.id,
                    totalImporteBs: req.body.totalImporteBs,
                    eliminado: false
                }, { where: { id: req.params.id }, transaction: t }).then(function (proformaActualizada) {
                    return DetallesProformas.destroy({
                        where: { id_proforma: req.params.id }
                        , transaction: t
                    }).then(function (detalleEliminado) {
                        req.body.detallesProformas.forEach(function (detalle) {
                            if (!detalle.eliminado) {
                                promesas.push(crearDetalleProforma({ id: req.params.id }, detalle, t))
                            }
                        })
                        return Promise.all(promesas)
                    }).catch(function (err) {
                        return new Promise(function (fulfill, reject) {
                            reject(err)
                        })
                    });
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject(err)
                    })
                });
            }).then(function (result) {
                res.json({ mensaje: 'Actualizado correctamente.' })
            }).catch(function (err) {
                res.json({ proforma: {}, mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
            });
        })

    router.route('/actividades/historial/:id/:id_sucursal')
        .get(function (req, res) {
            SucursalActividadDosificacion.findAll({
                where: { id_sucursal: req.params.id_sucursal, id_actividad: req.params.id, expirado: true },
                include: [{ model: Dosificacion, as: 'dosificacion' },
                { model: Clase, as: 'actividad' }]
            }).then(function (histo) {
                res.json({ historial: histo })
            }).catch(function (err) {
                res.json({ historial: [], mensaje: err.stack ? err.stack : err.message, hasErr: true })
            })
        })
    router.route('/actividades/empresa/:id_empresa')
        .post(function (req, res) {
            var mensajeExtra = ""
            req.body.map(function (actividad, i) {
                if (actividad.id !== undefined) {
                    var enUso = false
                    if (actividad.eliminado) {
                        Servicios.find({
                            where: { id_actividad: actividad.id_actividad }
                        }).then(function (ActividadEnUso) {
                            if (ActividadEnUso !== null) {
                                if (ActividadEnUso.id !== undefined) {
                                    enUso = true
                                    mensajeExtra += ". La actividad " + actividad.actividad.nombre + " tiene servicios activos y no se puede eliminar. Para eliminar la actividad primero elimine sus servicios."
                                }
                            }
                            if (!enUso) {
                                SucursalActividadDosificacion.update({
                                    expirado: true
                                }, {
                                        where: { id: actividad.id }
                                    }).then(function (actividadEliminada) {
                                        Dosificacion.update({
                                            expirado: true,
                                            where: { id: actividad.dosificacion.id }
                                        }).then(function (dosificacionExpirada) {
                                            if (i === req.body.length - 1) {
                                                res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' + mensajeExtra })
                                            }
                                        }).catch(function (err) {
                                            res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                                        });
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                                    });
                            } else {
                                if (i === req.body.length - 1) {
                                    res.json({ mensaje: mensajeExtra })
                                }
                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                        });

                    } else {
                        SucursalActividadDosificacion.update({
                            // id_sucursal: actividad.id_sucursal,
                            // id_actividad: actividad.actividad.id,
                            // id_dosificacion: (actividad.dosificacion !== undefined && actividad.dosificacion !== null) ? actividad.dosificacion.id : null
                            expirado: true,
                        }, {
                                where: { id: actividad.id }
                            }).then(function (actividadEmpresaCreada) {
                                Dosificacion.update({
                                    expirado: true
                                }, {
                                        where: { id: actividad.dosificacionAnterior.id }
                                    }).then(function (dosificacionExpirada) {
                                        if (i === req.body.length - 1) {
                                            SucursalActividadDosificacion.create({
                                                id_sucursal: actividad.id_sucursal,
                                                id_actividad: actividad.id_actividad,
                                                id_dosificacion: actividad.dosificacion !== undefined && actividad.dosificacion !== null ? actividad.dosificacion.id : null
                                            }).then(function (actividadEmpresaCreada) {
                                                if (i === req.body.length - 1) {
                                                    res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' })
                                                }
                                            }).catch(function (err) {
                                                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                                            });
                                        }
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                                    });
                            }).catch(function (err) {
                                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                            });
                    }
                } else {
                    SucursalActividadDosificacion.create({
                        id_sucursal: actividad.sucursal.id,
                        id_actividad: actividad.actividad.id,
                        id_dosificacion: actividad.dosificacion !== undefined && actividad.dosificacion !== null ? actividad.dosificacion.id : null
                    }).then(function (actividadEmpresaCreada) {
                        if (i === req.body.length - 1) {
                            res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' })
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                    });
                }
            })
        })
        .get(function (req, res) {
            Clase.findAll({
                where: { habilitado: true },
                include: [{ model: Tipo, as: 'tipo', where: { id_empresa: req.params.id_empresa } }]
            }).then(function (actividades) {
                res.json({ actividades: actividades })
            }).catch(function (err) {
                res.json({ actividades: [], mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
            });
        })
    // .put(function (req, res) {
    //     ActividadEconomica.update({

    //         where: { id: req.body.id }
    //     }).then(function (actividadActualizada) {
    //         res.json({ mensaje: 'Actividad Actualizada' })
    //     }).catch(function (err) {
    //         res.json({ actividades: [], mensaje:  err.stack !== undefined ? err.stack : err.message, hasErr: true })
    //     });
    // })

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
                                        res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                                    });
                                } else {
                                    if (i === req.body.length - 1) {
                                        res.json({ mensaje: 'Servicios actualizados satisfactoriamente!' + mensajeExtra })
                                    }
                                }
                            }).catch(function (err) {
                                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                            });
                        } else {
                            Servicios.update({
                                id_actividad: servicio.actividad.id,
                                centro_costo: null,
                                codigo: servicio.codigo,
                                nombre: servicio.nombre,
                                precio: parseFloat(servicio.precio),
                                id_empresa: req.params.id_empresa,
                                eliminado: false
                            }, {
                                    where: { id: servicio.id }
                                }).then(function (servicioActualizado) {
                                    if (i === req.body.length - 1) {
                                        res.json({ mensaje: 'Servicios actualizados satisfactoriamente!' })
                                    }
                                }).catch(function (err) {
                                    res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                                });
                        }
                    } else {

                        Servicios.create({
                            id_actividad: servicio.actividad.id,
                            centro_costo: null,
                            codigo: servicio.codigo,
                            nombre: servicio.nombre,
                            precio: parseFloat(servicio.precio),
                            id_empresa: req.params.id_empresa,
                            eliminado: false
                        }).then(function (servicioCreado) {
                            if (i == req.body.length - 1) {
                                res.json({ mensaje: 'Servicio creado satisfactoriamente!' })
                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                        });
                    }
                })
            } else {
                res.json({ mensaje: 'No se encontraron datos para guardar' })
            }
        })
        .get(function (req, res) {
            Servicios.findAll({
                where: {
                    id_actividad: req.params.id_actividad,
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: Clase, as: 'actividad' }]
            }).then(function (servicios) {
                if (servicios !== null) {
                    res.json({ servicios: servicios })
                } else {
                    res.json({ servicios: [] })
                }

            }).catch(function (err) {
                res.json({ servicios: [], mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
            });
        })
        .put(function (req, res) {
            Servicios.update({
                id_actividad: servicio.actividad.id,
                centro_costo: null,
                codigo: servicio.codigo,
                nombre: servicio.nombre,
                precio: parseFloat(servicio.precio),
                id_empresa: req.params.id_empresa,
                eliminado: false,
                where: { id: req.body.id }
            }).then(function (servicioActualizado) {
                res.json({ mensaje: 'Servicio actualizado' })
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
            });
        })

    router.route('/eliminar/proforma/:id')
        .post(function (req, res) {
            Proforma.find({
                where: req.body.id
            }).then(function (prof) {
                if (prof.fecha_proforma_ok || prof.fecha_factura || prof.fecha_cobro) {
                    res.json({ mensaje: 'La proforma no se puede anular, debido a que ya fué aceptada, facturada y/o cobrada. Si no ha sido aceptada, facturada o cobrada pongase en contacto con servicio.', hasErr: true })
                } else {
                    Proforma.update({
                        eliminado: true
                    }, {
                            where: {
                                id: req.body.id
                                // fecha_proforma_ok: { $not: null }
                            }
                        }).then(function (fechasActualizadas) {
                            res.json({ mensaje: 'Proforma Anulada.' })
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                        });
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
            });
        })

    router.route('/factura/:id_factura/proforma/facturada/:id_empresa')
        .get(function (req, res) {
            Proforma.findAll({
                where: {
                    factura: req.params.id_factura
                },
                include: [
                    { model: Clase, as: 'actividadEconomica' },
                    { model: DetallesProformas, as: 'detallesProformas', where: { eliminado: false }, include: [{ model: Servicios, as: 'servicio' }, { model: Clase, as: 'centroCosto' }] },
                    { model: Usuario, as: 'usuarioProforma' },
                    { model: Cliente, as: 'cliente' },
                    {
                        model: Sucursal, as: 'sucursal', include: [
                            {
                                model: SucursalActividadDosificacion, as: 'actividadesDosificaciones',
                                include: [{ model: Dosificacion, as: 'dosificacion' },
                                { model: Clase, as: 'actividad' }]
                            }]
                    }
                ]
            }).then(function (facturadas) {
                res.json({ datosProformas: facturadas })
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
            });
        })

    router.route('/alertas/proformas/:id_empresa')
        .get(function (req, res) {
            if (req.params.id_empresa) {
                Proforma.findAll({
                    where: {
                        id_empresa: req.params.id_empresa,
                        eliminado: false,
                        fecha_factura: null,
                        fecha_proforma_ok: { $not: null }
                    },
                    include: [
                        { model: Clase, as: 'actividadEconomica' },
                        { model: Cliente, as: 'cliente' }
                    ]

                }).then(function (proformasAlertas) {
                    res.json({ proformas: proformasAlertas })
                    // var proformasVencimiento = []
                    // if (proformasAlertas.length > 0) {
                    //     proformasAlertas.map(function (proforma, i) {
                    //         proforma.dataValues.saldo = proforma.dataValues.totalImporteBs - (proforma.dataValues.a_cuenta !== null ? proforma.dataValues.a_cuenta: 0) 
                    //         if (proforma.dataValues.saldo >0) {
                    //             proformasVencimiento.push(proforma)
                    //         }
                    //         if (i === proformasAlertas.length - 1) {
                    //             res.json({ proformas: proformasAlertas })
                    //         }
                    //     })
                    // } else {
                    //     res.json({ proformas: [] })
                    // }
                }).catch(function (err) {
                    res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                });
            } else {
                res.json({ mensaje: 'No se ouede identificar la empresa.', hasErr: true })
            }
        })
    function formatearFecha(fecha) {
        var mes = fecha.split('/')[1];
        var dia = fecha.split('/')[0];
        return fecha.split('/')[2] + mes + dia;
    }
    router.route('/actividades/servicios/:id_empresa')
        .get(function (req, res) {
            var factura = req.body;
            SucursalActividadDosificacion.findAll({
                where: {
                    //     // id_actividad: req.body.actividadEconomica.id,
                    // id_sucursal: req.body.sucursal.id,
                    expirado: false
                },
                include: [{ model: Dosificacion, as: 'dosificacion', include: [{ model: Clase, as: 'pieFactura' }] },
                { model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa }, include: [{ model: Empresa, as: 'empresa' }] },
                { model: Clase, as: 'actividad' }]
            }).then(function (actividades) {
                res.json({ actividades: actividades })
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
            });
        })

    router.route('/clientes/centroCostos/:id_cliente')
        .get(function (req, res) {
            ClienteCentroCostos.findAll({
                where: {
                    id_cliente: req.params.id_cliente
                },
                include: [{ model: Clase, as: 'centroCosto' }]
            }).then(function (centroCostos) {
                res.json({ centros: centroCostos })
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
            });
        })
        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promises = []
                if (req.body.length > 0) {
                    for (var index = 0; index < req.body.length; index++) {
                        if (req.body[index].eliminado) {
                            promises.push(eliminarAsignacionCentroCostoCliente(req.params.id_cliente, req.body[index], t))
                        } else {
                            promises.push(AsignarCentroCostoCliente(req.params.id_cliente, req.body[index], t))
                        }
                    }
                } else {
                    return new Promise(function (fulfill, reject) {
                        reject('No hay información para guardar.')
                    })
                }
                return Promise.all(promises)
            }).then(function (result) {
                if (result.length > 0) {
                    res.json({ mensaje: 'Actualizado correctamente' })
                } else {
                    throw new Error('Error al guardar los datos.')
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err, hasErr: true })
            });
        })
    // .put(function (req, res) {
    //     sequelize.transaction(function (t) {
    //         var promises = []
    //         if (req.body.length > 0) {
    //             for (var index = 0; index < req.body.length; index++) {
    //                 promises.push(AsignarCentroCostoCliente(req.params.id_cliente, req.body[index], t))
    //             }
    //         } else {
    //             return new Promise(function (fulfill, reject) {
    //                 reject('No hay información para guardar.')
    //             })
    //         }
    //         return Promise.all(promises)
    //     }).then(function (result) {
    //         if (result.length > 0) {
    //             res.json({mensaje: 'Actualizado correctamente'})
    //         }else{
    //             throw new Error('Error al guardar los datos.')
    //         }
    //     }).catch(function (err) {
    //         res.json({ mensaje: err.stack !== undefined ? err.stack : err, hasErr: true })
    //     });
    // })

    function AsignarCentroCostoCliente(clienteId, centro, t) {
        ClienteCentroCostos.create({
            id_cliente: clienteId,
            id_centro: centro.id
        }, { transaction: t }).then(function (centroCreado) {
            return new Promise(function (fullfil, reject) {
                fullfil(centroCreado)
            })
        }).catch(function (err) {
            return new Promise(function (fullfil, reject) {
                reject(err)
            })
        });
    }
    function eliminarAsignacionCentroCostoCliente(clienteId, centro, t) {
        ClienteCentroCostos.destroy({
            where: {
                id_cliente: clienteId,
                id_centro: centro.id
            }
        }, { transaction: t }).then(function (AsiganacionEliminada) {
            return new Promise(function (fullfil, reject) {
                fullfil(centroCreado)
            })
        }).catch(function (err) {
            return new Promise(function (fullfil, reject) {
                reject(err)
            })
        });
    }


    router.route('/ventas/factura/proformas')
        .post(function (req, res) {
            var mensajeError = ''
            var movimiento = req.body.movimiento.nombre_corto;
            var id_movimiento = req.body.movimiento.id;
            var venta = req.body;
            var factura = {};
            factura.venta = venta;
            sequelize.transaction(function (t) {
                return Movimiento.create({
                    id_tipo: req.body.id_tipo_pago,
                    id_clase: req.body.id_movimiento,
                    id_almacen: null,
                    fecha: req.body.fecha
                }, { transaction: t }).then(function (movimientoCreado) {
                    return SucursalActividadDosificacion.find({
                        where: {
                            id_actividad: venta.actividad.id,
                            id_sucursal: venta.sucursal.id,
                            expirado: false
                        },
                        transaction: t,
                        include: [{ model: Dosificacion, as: 'dosificacion', include: [{ model: Clase, as: 'pieFactura' }] },
                        { model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa' }] }]
                    }).then(function (sucursalActividadDosificacion) {
                        if (sucursalActividadDosificacion !== null && sucursalActividadDosificacion !== undefined) {
                            var dosificacion = sucursalActividadDosificacion.dosificacion;
                            venta.factura = dosificacion.correlativo;
                            venta.pieFactura = dosificacion.pieFactura;
                            venta.codigo_control = CodigoControl.obtenerCodigoControl(dosificacion.autorizacion.toString(),
                                dosificacion.correlativo.toString(),
                                venta.cliente.nit.toString(),
                                formatearFecha(venta.fechaTexto).toString(),
                                parseFloat(venta.total).toFixed(2),
                                dosificacion.llave_digital.toString());
                            venta.autorizacion = dosificacion.autorizacion.toString();
                            venta.fecha_limite_emision = dosificacion.fecha_limite_emision;
                            venta.numero_literal = NumeroLiteral.Convertir(parseFloat(venta.total).toFixed(2).toString());
                            if (sucursalActividadDosificacion.sucursal.empresa.usar_pedidos) {
                                venta.pedido = sucursalActividadDosificacion.sucursal.pedido_correlativo;
                            }
                            if (!venta.cliente.id) {
                                return Cliente.create({
                                    id_empresa: venta.id_empresa,
                                    nit: venta.cliente.nit,
                                    razon_social: venta.cliente.razon_social
                                }, { transaction: t }).then(function (clienteCreado) {
                                    return crearVenta(venta, res, clienteCreado.id, movimientoCreado, dosificacion, true, sucursalActividadDosificacion.sucursal, t);
                                });
                            } else {
                                var fecha_de_facturacion = new Date(venta.fecha_factura.split('/')[2], venta.fecha_factura.split('/')[1], venta.fecha_factura.split('/')[0])
                                return crearVenta(venta, res, venta.cliente.id, movimientoCreado, dosificacion, true, sucursalActividadDosificacion.sucursal, t);
                            }
                        } else {
                            mensajeError = 'No existe una dosificacion para la actividad.'
                        }
                    }).catch(function (err) {
                        mensajeError = err.stack
                        res.json({ hasErr: true, message: err.stack });
                    });
                })
            }).then(function (result) {
                console.log(result);
                if (result) {
                    if (mensajeError.length > 0) {
                        res.json({ mensaje: mensajeError, hasErr: true });
                    } else {
                        Venta.findAll({
                            where: { factura: venta.factura },
                            limit: 1,
                            order: [['id', 'asc']]
                        }).then(function (ventas) {
                            venta.id = ventas[0].id
                            venta.datosProformas.map(function (prof, i) {
                                Proforma.update({
                                    movimiento: venta.movimiento.id,
                                    factura: venta.factura,
                                    autorizacion: venta.autorizacion,
                                    fecha_limite_emision: venta.fecha_limite_emision,
                                    codigo_control: venta.codigo_control,
                                    descripcion_factura: venta.descripcion,
                                    fecha_factura: new Date(venta.fecha_factura.split('/')[2], venta.fecha_factura.split('/')[1], venta.fecha_factura.split('/')[0]),
                                    id_venta: ventas[0].id
                                }, {
                                        where: { id: prof.id }
                                    }).then(function (proformaActualizada) {
                                        if (i == venta.datosProformas.length - 1) {
                                            res.json({ mensaje: 'Venta realizada satisfactoriamente.', venta: venta });
                                        }
                                    })
                            })
                        })
                    }
                    // var resV = (result.length ? (result[0].length ? (result[0][0].length ? (result[0][0][0].length ? result[0][0][0][0] : result[0][0][0]) : result[0][0]) : result[0]) : result);
                }
            }).catch(function (err) {
                res.json({ hasErr: true, mensaje: err.stack });
            });
        });

    function crearVenta(venta, res, idCliente, movimientoCreado, dosificacion, esFactura, sucursal, t) {
        return Venta.create({
            id_almacen: venta.almacen ? venta.almacen.id : null,
            id_cliente: idCliente,
            id_movimiento: movimientoCreado ? movimientoCreado.id : null,
            id_actividad: venta.actividad.id,
            factura: venta.factura,
            autorizacion: venta.autorizacion,
            fecha: venta.fecha,
            codigo_control: venta.codigo_control,
            fecha_limite_emision: venta.fecha_limite_emision,
            importe: venta.importe,
            id_tipo_pago: venta.tipoPago.id,
            dias_credito: venta.dias_credito,
            a_cuenta: venta.a_cuenta,
            saldo: venta.saldo,
            total: venta.total,
            id_usuario: venta.id_usuario,
            activa: true,
            pagado: venta.pagado,
            cambio: venta.cambio,
            pedido: venta.pedido,
            despachado: venta.despachado,
            id_vendedor: (venta.vendedor ? venta.vendedor.id : null),
            usar_servicios: true
        }, { transaction: t }).then(function (ventaCreada) {
            var promisesVenta = [];
            if (esFactura) {
                var dosProm = Dosificacion.update({
                    correlativo: (venta.factura + 1)
                }, {
                        where: { id: dosificacion.id },
                        transaction: t
                    });
                promisesVenta.push(dosProm);
            } else {
                var sucProm = Sucursal.update({
                    nota_venta_correlativo: (venta.factura + 1)
                }, {
                        where: { id: venta.sucursal.id },
                        transaction: t
                    });
                promisesVenta.push(sucProm);
            }

            if (sucursal.empresa.usar_pedidos) {
                var suc2Prom = Sucursal.update({
                    pedido_correlativo: (venta.pedido + 1)
                }, {
                        where: { id: venta.sucursal.id },
                        transaction: t
                    });
                promisesVenta.push(suc2Prom);
            }

            promisesVenta.unshift(ConfiguracionGeneralFactura.find({
                where: {
                    id_empresa: venta.id_empresa
                },
                transaction: t,
                include: [{ model: Clase, as: 'impresionFactura' },
                { model: Clase, as: 'tipoFacturacion' },
                { model: Clase, as: 'tamanoPapelFactura' },
                { model: Clase, as: 'tituloFactura' },
                { model: Clase, as: 'subtituloFactura' },
                { model: Clase, as: 'tamanoPapelNotaVenta' },
                { model: Clase, as: 'tamanoPapelNotaTraspaso' },
                { model: Clase, as: 'tamanoPapelNotaBaja' },
                { model: Clase, as: 'tamanoPapelNotaPedido' },
                { model: Clase, as: 'tamanoPapelCierreCaja' }]
            }).then(function (configuracionGeneralFactura) {
                venta.detallesVentaNoConsolidadas.forEach(function (detalleVentaNoConsolidada, index, array) {
                    //crearDetalleVentaNoConsolidada(ventaCreada.id, detalleVentaNoConsolidada.producto.id, null, detalleVentaNoConsolidada);
                });
                if (configuracionGeneralFactura.usar) {
                    var promises = [];
                    venta.configuracion = configuracionGeneralFactura;
                    venta.detallesVenta.forEach(function (detalleVenta, index, array) {
                        promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t));
                    });
                    return Promise.all(promises)
                } else {
                    return ConfiguracionFactura.find({
                        where: {
                            id_sucursal: venta.sucursal.id
                        },
                        transaction: t,
                        include: [{ model: Clase, as: 'impresionFactura' },
                        { model: Clase, as: 'tipoFacturacion' },
                        { model: Clase, as: 'tamanoPapelFactura' },
                        { model: Clase, as: 'tituloFactura' },
                        { model: Clase, as: 'subtituloFactura' },
                        { model: Clase, as: 'tamanoPapelNotaVenta' },
                        { model: Clase, as: 'tamanoPapelNotaTraspaso' },
                        { model: Clase, as: 'tamanoPapelNotaBaja' },
                        { model: Clase, as: 'tamanoPapelNotaPedido' },
                        { model: Clase, as: 'tamanoPapelCierreCaja' }]
                    }).then(function (configuracionFactura) {
                        var promises = [];
                        venta.configuracion = configuracionFactura;
                        venta.detallesVenta.forEach(function (detalleVenta, index, array) {
                            promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t));
                        });
                        return Promise.all(promises)
                    });
                }
            }));
            return Promise.all(promisesVenta);
        });
    }

    function crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, precio_unitario, importe, total, index, array, res, venta, t) {
        var promises = [];
        if (!ventaCreada.usar_servicios) {
            promises.push(DetalleVenta.create({
                id_venta: ventaCreada.id,
                id_producto: detalleVenta.producto ? detalleVenta.producto.id : null,
                id_servicio: detalleVenta.servicio ? detalleVenta.servicio.id : null,
                precio_unitario: detalleVenta.precio_unitario,
                cantidad: detalleVenta.cantidad,
                importe: importe,
                descuento: detalleVenta.descuento,
                recargo: detalleVenta.recargo,
                ice: detalleVenta.ice,
                excento: detalleVenta.excento,
                tipo_descuento: detalleVenta.tipo_descuento,
                tipo_recargo: detalleVenta.tipo_recargo,
                total: total,
                fecha_vencimiento: detalleVenta.fecha_vencimiento,
                lote: detalleVenta.lote,
                id_inventario: null
            }, { transaction: t }).then(function (detalleVentaCreada) {

                // if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
                // 	return calcularCostosEgresos(detalleVenta, detalleVenta.producto, detalleVenta.cantidad, detalleVenta.costos,
                // 		movimientoCreado, index, array, res, venta, t);
                // } else if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
                // 	var promises = [];
                // 	for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
                // 		if ((i + 1) == detalleVenta.producto.productosBase.length) {
                // 			promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
                // 				movimientoCreado, index, array, res, venta, t));
                // 		} else {
                // 			promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
                // 				movimientoCreado, index - 1, array, res, venta, t));
                // 		}
                // 	}
                // 	return Promise.all(promises);
                // } else {
                // 	var promises = [];
                // 	for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
                // 		if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
                // 			if ((i + 1) == detalleVenta.producto.productosBase.length) {
                // 				promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
                // 					movimientoCreado, index, array, res, venta, t));
                // 			} else {
                // 				promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
                // 					movimientoCreado, index - 1, array, res, venta, t));
                // 			}
                // 		} else if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
                // 			var innerpromises = [];
                // 			for (var j = 0; j < detalleVenta.producto.productosBase[i].productoBase.productosBase.length; j++) {
                // 				if ((j + 1) == detalleVenta.producto.productosBase[i].productoBase.productosBase.length) {
                // 					innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
                // 						detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
                // 						detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index, array, res, venta, t));
                // 				} else {
                // 					innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
                // 						detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
                // 						detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index - 1, array, res, venta, t));
                // 				}
                // 			}
                // 			promises.push(Promise.all(innerpromises));
                // 		}
                // 	}
                // 	return Promise.all(promises);
                // }
            }))
        } else {
            promises.push(DetalleVenta.create({
                id_venta: ventaCreada.id,
                id_producto: detalleVenta.producto ? detalleVenta.producto.id : null,
                id_servicio: detalleVenta.servicio ? detalleVenta.servicio.id : null,
                precio_unitario: detalleVenta.precio_unitario,
                cantidad: detalleVenta.cantidad,
                importe: importe,
                descuento: null,
                recargo: null,
                ice: null,
                excento: null,
                tipo_descuento: null,
                tipo_recargo: null,
                total: total,
                fecha_vencimiento: null,
                lote: null,
                id_inventario: null
            }, { transaction: t }).then(function (detalleVentaCreada) {

            }))
        }
        return Promise.all(promises)
    }

    // router.route('/proforma/facturar/:id_empresa')
    //     .post(function (req, res) {
    //         var factura = req.body;
    //         sequelize.transaction(function (t) {
    //             return SucursalActividadDosificacion.find({
    //                 where: {
    //                     id_actividad: req.body.actividad.id,
    //                     id_sucursal: req.body.sucursal.id,
    //                     expirado: false
    //                 },
    //                 include: [{ model: Dosificacion, as: 'dosificacion', where: { expirado: false }, include: [{ model: Clase, as: 'pieFactura' }] },
    //                 { model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa' }] }],
    //                 transaction: t
    //             }).then(function (sucursalActividadDosificacion) {
    //                 if (sucursalActividadDosificacion) {
    //                     if (sucursalActividadDosificacion.dosificacion) {
    //                         var dosificacion = sucursalActividadDosificacion.dosificacion;
    //                         factura.factura = dosificacion.correlativo;
    //                         factura.pieFactura = dosificacion.pieFactura;
    //                         factura.codigo_control = CodigoControl.obtenerCodigoControl(dosificacion.autorizacion.toString(),
    //                             dosificacion.correlativo.toString(),
    //                             factura.cliente.nit.toString(),
    //                             formatearFecha(factura.fecha_factura).toString(),
    //                             parseFloat(factura.totalImporteBs).toFixed(2),
    //                             dosificacion.llave_digital.toString());
    //                         factura.autorizacion = dosificacion.autorizacion.toString();
    //                         factura.fecha_limite_emision = dosificacion.fecha_limite_emision;
    //                         factura.numero_literal = NumeroLiteral.Convertir(parseFloat(factura.totalImporteBs).toFixed(2).toString());
    //                         var laFecha = factura.fecha_factura.split("/")
    //                         var fecha_factura = new Date(laFecha[2], laFecha[1] - 1, laFecha[0])
    //                         var promisse = []
    //                         factura.datosProformas.map(function (prof, i) {
    //                             promisse.push(Proforma.update({
    //                                 movimiento: factura.movimiento.id,
    //                                 factura: factura.factura,
    //                                 autorizacion: factura.autorizacion,
    //                                 fecha_limite_emision: factura.fecha_limite_emision,
    //                                 codigo_control: factura.codigo_control,
    //                                 descripcion: factura.descripcion,
    //                                 fecha_factura: fecha_factura,
    //                                 dias_credito: factura.dias_credito,
    //                                 a_cuenta: factura.a_cuenta,
    //                                 id_tipo_pago: factura.tipoPago.id
    //                             }, {
    //                                     where: { id: prof.id },
    //                                     transaction: t
    //                                 }).then(function (proformaActualizada) {
    //                                     if (i === factura.datosProformas.length - 1) {
    //                                         return Dosificacion.update({
    //                                             correlativo: (factura.factura + 1)
    //                                         }, {
    //                                                 where: { id: dosificacion.id },
    //                                                 transaction: t
    //                                             }).then(function (correlativoActualizado) {
    //                                                 return ConfiguracionGeneralFactura.find({
    //                                                     where: {
    //                                                         id_empresa: prof.id_empresa
    //                                                     },
    //                                                     include: [{ model: Clase, as: 'impresionFactura' },
    //                                                     { model: Clase, as: 'tipoFacturacion' },
    //                                                     { model: Clase, as: 'tamanoPapelFactura' },
    //                                                     { model: Clase, as: 'tituloFactura' },
    //                                                     { model: Clase, as: 'subtituloFactura' },
    //                                                     { model: Clase, as: 'tamanoPapelNotaVenta' },
    //                                                     { model: Clase, as: 'tamanoPapelNotaTraspaso' },
    //                                                     { model: Clase, as: 'tamanoPapelNotaBaja' },
    //                                                     { model: Clase, as: 'tamanoPapelNotaPedido' },
    //                                                     { model: Clase, as: 'tamanoPapelCierreCaja' },
    //                                                     { model: Clase, as: 'formatoPapelFactura' }
    //                                                     ],
    //                                                     transaction: t
    //                                                 }).then(function (configuracionGeneralFactura) {
    //                                                     factura.configuracion = configuracionGeneralFactura
    //                                                     var total = 0
    //                                                     factura.detallesVenta = factura.detallesVenta.map(function (det, i) {
    //                                                         var producto = { codigo: det.servicio.codigo, nombre: det.servicio.nombre, unidad_medida: "" }
    //                                                         total += det.importe
    //                                                         det.total = det.precio_unitario * det.cantidad
    //                                                         det.producto = producto
    //                                                         return det
    //                                                     })
    //                                                     factura.total = total
    //                                                     // factura.cliente = factura.cliente
    //                                                     return new Promise(function (fulfill, reject) {
    //                                                         fulfill(factura);
    //                                                     });
    //                                                 }).catch(function (err) {
    //                                                     res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
    //                                                 });
    //                                             }).catch(function (err) {
    //                                                 if (typeof err === 'string' || err instanceof String) {
    //                                                     res.json({ mensaje: err, hasErr: true, factura: req.body })
    //                                                 } else {
    //                                                     res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
    //                                                 }
    //                                             });
    //                                     }
    //                                 }).catch(function (err) {
    //                                     res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
    //                                 }))
    //                         })
    //                         return Promise.all(promisse);
    //                     } else {
    //                         res.json({ mensaje: 'La actividad no tiene asignada una dosificación activa. No se puede generar factura!', hasErr: true, factura: req.body })
    //                     }
    //                 } else {
    //                     res.json({ mensaje: 'La actividad no tiene asignada una dosificación activa para la sucursal actual. No se puede generar factura!', hasErr: true, factura: req.body })
    //                 }
    //             }).catch(function (err) {
    //                 res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
    //             });
    //         }).then(function (tranTermino) {
    //             if (tranTermino === undefined) {
    //                 res.json({ mensaje: 'La actividad no tiene asignada una dosificación activa. No se puede generar factura!', hasErr: true, factura: req.body })
    //             } else {
    //                 res.json({ mensaje: 'Factura generada...', factura: req.body })
    //             }
    //         }).catch(function (err) {
    //             if (typeof err === 'string' || err instanceof String) {
    //                 res.json({ mensaje: err, hasErr: true, factura: req.body })
    //             } else {
    //                 res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
    //             }
    //         })
    //     })

    router.route('/proforma/facturar/:id_empresa')
        .post(function (req, res) {
            var factura = req.body;
            ConfiguracionGeneralFactura.find({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: Clase, as: 'impresionFactura' },
                { model: Clase, as: 'tipoFacturacion' },
                { model: Clase, as: 'tamanoPapelFactura' },
                { model: Clase, as: 'tituloFactura' },
                { model: Clase, as: 'subtituloFactura' },
                { model: Clase, as: 'tamanoPapelNotaVenta' },
                { model: Clase, as: 'tamanoPapelNotaTraspaso' },
                { model: Clase, as: 'tamanoPapelNotaBaja' },
                { model: Clase, as: 'tamanoPapelNotaPedido' },
                { model: Clase, as: 'tamanoPapelCierreCaja' },
                { model: Clase, as: 'formatoPapelFactura' }
                ]
            }).then(function (configuracionGeneralFactura) {
                factura.configuracion = configuracionGeneralFactura
                var total = 0
                factura.detallesVenta = factura.detallesVenta.map(function (det, i) {
                    var producto = { codigo: det.servicio.codigo, nombre: det.servicio.nombre, unidad_medida: "" }
                    total += det.importe
                    det.total = det.precio_unitario * det.cantidad
                    det.producto = producto
                    return det
                })
                factura.total = total
                SucursalActividadDosificacion.find({
                    where: {
                        id_actividad: req.body.actividad.id,
                        id_sucursal: req.body.sucursal.id,
                        expirado: false
                    },
                    include: [{ model: Dosificacion, as: 'dosificacion', where: { expirado: false }, include: [{ model: Clase, as: 'pieFactura' }] },
                    { model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa' }] }]
                }).then(function (sucursalActividadDosificacion) {
                    if (sucursalActividadDosificacion) {
                        if (sucursalActividadDosificacion.dosificacion) {
                            var dosificacion = sucursalActividadDosificacion.dosificacion;
                            factura.factura = dosificacion.correlativo;
                            factura.pieFactura = dosificacion.pieFactura;
                            factura.codigo_control = CodigoControl.obtenerCodigoControl(dosificacion.autorizacion.toString(),
                                dosificacion.correlativo.toString(),
                                factura.cliente.nit.toString(),
                                formatearFecha(factura.fecha_factura).toString(),
                                parseFloat(factura.totalImporteBs).toFixed(2),
                                dosificacion.llave_digital.toString());
                            factura.autorizacion = dosificacion.autorizacion.toString();
                            factura.fecha_limite_emision = dosificacion.fecha_limite_emision;
                            factura.numero_literal = NumeroLiteral.Convertir(parseFloat(factura.totalImporteBs).toFixed(2).toString());
                            var laFecha = factura.fecha_factura.split("/")
                            var fecha_factura = new Date(laFecha[2], laFecha[1] - 1, laFecha[0])
                            var promisse = []
                            sequelize.transaction(function (t) {
                                factura.datosProformas.forEach(function (prof, i) {
                                    promisse.push(updateProforma(factura, prof, t, fecha_factura))
                                })
                                promisse.push(updateDosificacionCorrelativo(factura, t, dosificacion))
                                return Promise.all(promisse);
                            }).then(function (tranTermino) {
                                if (tranTermino === undefined) {
                                    res.json({ mensaje: 'La actividad no tiene asignada una dosificación activa. No se puede generar factura!', hasErr: true, factura: req.body })
                                } else {
                                    res.json({ mensaje: 'Factura generada...', factura: req.body })
                                }
                            }).catch(function (err) {
                                if (typeof err === 'string' || err instanceof String) {
                                    res.json({ mensaje: err, hasErr: true, factura: req.body })
                                } else {
                                    res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: factura })
                                }
                            })
                        } else {
                            res.json({ mensaje: 'La actividad no tiene asignada una dosificación activa. No se puede generar factura!', hasErr: true, factura: req.body })
                        }
                    } else {
                        res.json({ mensaje: 'La actividad no tiene asignada una dosificación activa para la sucursal actual. No se puede generar factura!', hasErr: true, factura: req.body })
                    }
                }).catch(function (err) {
                    res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
                });
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
            });
        })

    function updateDosificacionCorrelativo(factura, t, dosificacion) {
        return Dosificacion.update({
            correlativo: (factura.factura + 1)
        }, {
                where: { id: dosificacion.id },
                transaction: t
            })
    }
    function updateProforma(factura, prof, t, fecha_factura) {
        Proforma.update({
            movimiento: factura.movimiento.id,
            factura: factura.factura,
            autorizacion: factura.autorizacion,
            fecha_limite_emision: factura.fecha_limite_emision,
            codigo_control: factura.codigo_control,
            descripcion: factura.descripcion,
            fecha_factura: fecha_factura,
            dias_credito: factura.dias_credito,
            a_cuenta: factura.a_cuenta,
            id_tipo_pago: factura.tipoPago.id
        }, {
                where: { id: prof.id },
                transaction: t
            })
    }

    router.route('/detalles/proforma/facturar/:id_empresa')
        .get(function (req, res) {
            var detalles = []
            req.body.map(function (ids, i) {
                DetallesProformas.findAll({
                    where: { id_proforma: ids },
                    include: [{ model: Servicios, as: 'servicio' }, { model: Clase, as: 'centroCosto' }]
                }).then(function (Detalles) {
                    Detalles.map(function (_) {
                        detalles.push(_)
                    })
                    if (i === req.body.length - 1) {
                        res.json({ detalles: detalles })
                    }
                }).catch(function (err) {
                    res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
                });
            })
        })

    router.route('/configuracion/proforma/facturar/:id_empresa')
        .get(function (req, res) {
            ConfiguracionGeneralFactura.find({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: Clase, as: 'impresionFactura' },
                { model: Clase, as: 'tipoFacturacion' },
                { model: Clase, as: 'tamanoPapelFactura' },
                { model: Clase, as: 'tituloFactura' },
                { model: Clase, as: 'subtituloFactura' },
                { model: Clase, as: 'tamanoPapelNotaVenta' },
                { model: Clase, as: 'tamanoPapelNotaTraspaso' },
                { model: Clase, as: 'tamanoPapelNotaBaja' },
                { model: Clase, as: 'tamanoPapelNotaPedido' },
                { model: Clase, as: 'tamanoPapelCierreCaja' }]
            }).then(function (configuracionGeneralFactura) {
                res.json({ configuracion: configuracionGeneralFactura })
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
            });
        })

    router.route('/proformas/:ids')
        .get(function (req, res) {
            // var inicio = new Date(req.params.fecha); inicio.setHours(0, 0, 0, 0, 0);
            // var fin = new Date(req.params.fecha); fin.setHours(23, 0, 0, 0, 0);
            var lista = req.params.ids.split(',')
            Proforma.findAll(
                {
                    where: { id: { $in: lista } },
                    include: [
                        { model: Clase, as: 'actividadEconomica' },
                        { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio' }, { model: Clase, as: 'centroCosto' }] },
                        { model: Usuario, as: 'usuarioProforma' },
                        { model: Cliente, as: 'cliente' },
                        {
                            model: Sucursal, as: 'sucursal', include: [
                                {
                                    model: SucursalActividadDosificacion, as: 'actividadesDosificaciones',
                                    include: [{ model: Dosificacion, as: 'dosificacion' },
                                    { model: Clase, as: 'actividad' }]
                                }]
                        }
                    ]
                }).then(function (proformas) {
                    proformas.forEach(function (proforma, i) {
                        var inicio = new Date(proforma.fecha_proforma); inicio.setHours(0, 0, 0, 0, 0);
                        var fin = new Date(proforma.fecha_proforma); fin.setHours(23, 0, 0, 0, 0);
                        MonedaTipoCambio.find({
                            where: {
                                fecha: {
                                    $between: [inicio, fin]
                                }
                            }
                        }).then(function (MonedaCambio) {
                            if (MonedaCambio) {
                                proforma.dataValues.tc = { ufv: MonedaCambio.ufv, dolar: MonedaCambio.dolar };
                            } else {
                                proforma.dataValues.tc = { ufv: 'Error', dolar: 'Error' };
                            }
                            if (i === proformas.length - 1) {
                                res.json({ proformas: proformas })
                            }
                        }).catch(function (err) {
                            proforma.dataValues.tc = { ufv: 'Error', dolar: 'Error' };
                            if (i === proformas.length - 1) {
                                res.json({ proformas: proformas })
                            }
                        });
                    })
                }).catch(function (err) {
                    res.json({ proformas: [], mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
                });
        })

    // router.route('/proforma/:id')
    // .get(function (req, res) {
    //     // var inicio = new Date(req.params.fecha); inicio.setHours(0, 0, 0, 0, 0);
    //     // var fin = new Date(req.params.fecha); fin.setHours(23, 0, 0, 0, 0);
    //     var lista = req.params.ids.split(',')
    //     Proforma.findAll(
    //         {
    //             where: { id: { $in: lista } },
    //             include: [
    //                 { model: Clase, as: 'actividadEconomica' },
    //                 { model: DetallesProformas, as: 'detallesProformas', include: [{ model: Servicios, as: 'servicio' }, { model: Clase, as: 'centroCosto' }] },
    //                 { model: Usuario, as: 'usuarioProforma' },
    //                 { model: Cliente, as: 'cliente' },
    //                 {
    //                     model: Sucursal, as: 'sucursal', include: [
    //                         {
    //                             model: SucursalActividadDosificacion, as: 'actividadesDosificaciones',
    //                             include: [{ model: Dosificacion, as: 'dosificacion' },
    //                             { model: Clase, as: 'actividad' }]
    //                         }]
    //                 }
    //             ]
    //         }).then(function (proformas) {
    //             proformas.forEach(function (proforma, i) {
    //                 var inicio = new Date(proforma.fecha_proforma); inicio.setHours(0, 0, 0, 0, 0);
    //                 var fin = new Date(proforma.fecha_proforma); fin.setHours(23, 0, 0, 0, 0);
    //                 MonedaTipoCambio.find({
    //                     where: {
    //                         fecha: {
    //                             $between: [inicio, fin]
    //                         }
    //                     }
    //                 }).then(function (MonedaCambio) {
    //                     if (MonedaCambio) {
    //                         proforma.dataValues.tc = { ufv: MonedaCambio.ufv, dolar: MonedaCambio.dolar };
    //                     } else {
    //                         proforma.dataValues.tc = { ufv: 'Error', dolar: 'Error' };
    //                     }
    //                     if (i === proformas.length - 1) {
    //                         res.json({ proformas: proformas })
    //                     }
    //                 }).catch(function (err) {
    //                     proforma.dataValues.tc = { ufv: 'Error', dolar: 'Error' };
    //                     if (i === proformas.length - 1) {
    //                         res.json({ proformas: proformas })
    //                     }
    //                 });
    //             })
    //         }).catch(function (err) {
    //             res.json({ proformas: [], mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true })
    //         });
    // })
    // router.route('/reestablecer/proforma/:id_proforma/hash/:id_hash')
    //     .get(function (req, res) {
    //         if (req.params.id_hash !== "728free728") {
    //             res.json('ACCESO DENEGADO!')
    //         } else {
    //             Proforma.update({
    //                 eliminado: false
    //                 , fecha_factura: null
    //             }, {
    //                     where: { id: req.params.id_proforma }
    //                 }).then(function (proformaReestablecida) {
    //                     DetallesProformas.update({
    //                         eliminado: false
    //                     }, {
    //                             where: { id_proforma: req.params.id_proforma }
    //                         }).then(function (detallesReestablecidos) {
    //                             res.json({ mensaje: 'Operación correcta.' })
    //                         })
    //                 }).catch(function (err) {
    //                     res.json({ mensaje: err.stack })
    //                 })
    //         }
    //     })
}