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

    router.route('/alertas/proformas/:id_empresa/:mes/:anio/:razon_social/:proforma')
        .get(function (req, res) {
            var condicionCliente = {id_empresa: req.params.id_empresa}
            var condicion = {
                id_empresa: req.params.id_empresa,
                eliminado: false,
                fecha_factura: null,
                fecha_proforma_ok: { $not: null }
            }
            if (req.params.mes != "0") {
                condicion.periodo_mes = parseInt(req.params.mes)
            }
            if (req.params.anio != "0") {
                condicion.periodo_anio = parseInt(req.params.anio)
            }
            if (req.params.razon_social != "0") {
                condicionCliente.razon_social = {$like: req.params.razon_social + '%'}
            }
            if (req.params.proforma != "0") {
                condicion.correlativo = parseInt(req.params.proforma)
            }
            if (req.params.id_empresa) {
                Proforma.findAll({
                    where: condicion,
                    include: [
                        { model: Clase, as: 'actividadEconomica' },
                        { model: Cliente, as: 'cliente', where: condicionCliente }
                    ]
                }).then(function (proformasAlertas) {
                    res.json({ proformas: proformasAlertas })
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
                { model: Clase, as: 'formatoPapelFactura' },
                { model: Clase, as: 'formatoColorFactura' },
                { model: Clase, as: 'formatoPapelFacturaServicio' },
                { model: Clase, as: 'formatoColorFacturaServicio' }
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
        return Proforma.update({
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
                { model: Clase, as: 'tamanoPapelCierreCaja' },
                { model: Clase, as: 'formatoPapelFactura' },
                { model: Clase, as: 'formatoColorFactura' },
                { model: Clase, as: 'formatoPapelFacturaServicio' },
                { model: Clase, as: 'formatoColorFacturaServicio' }
                ]
            }).then(function (configuracionGeneralFactura) {
                res.json({ configuracion: configuracionGeneralFactura })
            }).catch(function (err) {
                res.json({ mensaje: err.stack !== undefined ? err.stack : err.message, hasErr: true, factura: req.body })
            });
        })

    router.route('/proformas/:ids')
        .get(function (req, res) {
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
}