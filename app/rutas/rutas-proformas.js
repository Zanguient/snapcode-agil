module.exports = function (router, sequelize, Sequelize, Usuario, Cliente, Proforma, DetallesProformas, Servicios, Clase, Sucursal, SucursalActividadDosificacion, Dosificacion,
    CodigoControl, NumeroLiteral, Empresa, ConfiguracionGeneralFactura, Tipo, UsuarioSucursal, Almacen, Venta, DetalleVenta, ConfiguracionGeneralFactura, ConfiguracionFactura, Movimiento) {
    router.route('/proformas/empresa/:id_empresa/mes/:mes/anio/:anio/suc/:sucursal/act/:actividad/ser/:servicio/monto/:monto/razon/:razon/usuario/:usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/num/:numero')
        .get(function (req, res) {
            var condicion = {}
            var condicionCliente = {}
            var condicionServicio = {}
            var condicionUsuario = {}
            var condicionActividad = {}
            condicion.id_empresa = req.params.id_empresa
            condicion.eliminado = false
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
                condicionActividad.id = parseInt(req.params.actividad)
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
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    where: condicion,
                    include: [
                        { model: Clase, as: 'actividadEconomica', where: condicionActividad },
                        { model: DetallesProformas, as: 'detallesProformas', where: { eliminado: false }, include: [{ model: Servicios, as: 'servicio', where: condicionServicio }] },
                        { model: Usuario, as: 'usuarioProforma', where: condicionUsuario },
                        { model: Cliente, as: 'clienteProforma', where: condicionCliente },
                        { model: Sucursal, as: 'sucursalProforma' }
                    ]
                }).then(function (proformas) {
                    res.json({ proformas: proformas.rows, count: Math.ceil(proformas.count / req.params.items_pagina) })
                }).catch(function (err) {
                    res.json({ proformas: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                id_sucursal: req.body.sucursal.id,
                id_actividad: req.body.actividadEconomica.id,
                id_cliente: req.body.clienteProforma.id,
                id_usuario: req.body.usuarioProforma.id,
                totalImporteBs: req.body.totalImporteBs,
                id_venta: null,
                eliminado: false
            }).then(function (proformaCreada) {
                req.body.detallesProformas.map(function (detalle, i) {
                    DetallesProformas.create({
                        id_proforma: proformaCreada.id,
                        id_servicio: detalle.id_servicio,
                        precio_unitario: detalle.precio_unitario,
                        cantidad: detalle.cantidad,
                        importe: detalle.importe,
                        id_centro_costo: detalle.centroCosto !== undefined && detalle.centroCosto !== null ? detalle.centroCosto.id : null,
                        eliminado: false
                    }).then(function (detalleCreado) {
                        if (i === req.body.detallesProformas.length - 1) {
                            res.json({ mensaje: 'Proforma creada satisfactoriamente!' })
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });
                })
            }).catch(function (err) {
                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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


    // router.route('/sucursales/proforma/:id_empresa/id:usuario')
    //     .get(function (req, res) {
    //         Sucursales.findAll({
    //             where: {
    //                 id_empresa: req.params.id_empresa
    //             },
    //             include: [{ model: clase }]
    //         }).then(function (sucursales) {
    //             res.json({ sucursales: sucursales })
    //         }).catch(function (err) {
    //             res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
    //         });
    //     })
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
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                });
        })
    router.route('/proforma/:id/:id_actividad')
        .get(function (req, res) {
            Proforma.find(
                {
                    where: { id: req.params.id },
                    include: [
                        { model: Clase, as: 'actividadEconomica' },
                        { model: DetallesProformas, as: 'detallesProformas', where: { eliminado: false }, include: [{ model: Servicios, as: 'servicio' }, { model: Clase, as: 'centroCosto' }] },
                        { model: Usuario, as: 'usuarioProforma' },
                        { model: Cliente, as: 'clienteProforma' },
                        {
                            model: Sucursal, as: 'sucursalProforma', include: [
                                { model: Almacen, as: 'almacenes' },
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
                    res.json({ proforma: {}, mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                            importe: detalle.importe,
                            id_centro_costo: detalle.centroCosto !== undefined && detalle.centroCosto !== null ? detalle.centroCosto.id : null,
                            eliminado: detalle.eliminado
                        }, { where: { id: detalle.id } }).then(function (detalleActializado) {
                            if (i === req.body.detallesProformas.length - 1) {
                                res.json({ mensaje: 'Proforma actualizada!' })
                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                        });
                    } else {
                        DetallesProformas.create({
                            id_proforma: req.params.id,
                            id_servicio: detalle.id_servicio,
                            precio_unitario: detalle.precio_unitario,
                            cantidad: detalle.cantidad,
                            importe: detalle.importe,
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
                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                            where: { id_actividad: actividad.id }
                        }).then(function (ActividadEnUso) {
                            if (ActividadEnUso !== null) {
                                if (ActividadEnUso.id !== undefined) {
                                    enUso = true
                                    mensajeExtra += ". La actividad " + actividad.claseActividad.nombre + " tiene servicios activos y no se puede eliminar. Para eliminar la actividad primero elimine sus servicios."
                                }
                            }
                            if (!enUso) {
                                SucursalActividadDosificacion.update({
                                    expirado: true
                                }, {
                                        where: { id_actividad: actividad.id }
                                    }).then(function (actividadEliminada) {
                                        if (i === req.body.length - 1) {
                                            res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' + mensajeExtra })
                                        }
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                    });
                            } else {
                                if (i === req.body.length - 1) {
                                    res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' + mensajeExtra })
                                }
                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                                SucursalActividadDosificacion.create({
                                    id_sucursal: actividad.id_sucursal,
                                    id_actividad: actividad.actividad.id,
                                    id_dosificacion: actividad.dosificacion !== undefined && actividad.dosificacion !== null ? actividad.dosificacion.id : null
                                }).then(function (actividadEmpresaCreada) {
                                    if (actividad.dosificacionAnterior !== undefined && actividad.dosificacionAnterior !== null) {
                                        if (actividad.dosificacionAnterior.id !== null && actividad.dosificacionAnterior.id !== undefined) {
                                            Dosificacion.update({
                                                expirado: true
                                            }, {
                                                    where: { id: actividad.dosificacionAnterior.id }
                                                }).then(function (dosificacionActualizada) {
                                                    if (i === req.body.length - 1) {
                                                        res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' })
                                                    }
                                                })
                                        } else {
                                            if (i === req.body.length - 1) {
                                                res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' })
                                            }
                                        }
                                    } else {
                                        if (i === req.body.length - 1) {
                                            res.json({ mensaje: 'Actividades actualizadas satisfactoriamente!' })
                                        }
                                    }

                                }).catch(function (err) {
                                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                });

                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                res.json({ actividades: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })
    // .put(function (req, res) {
    //     ActividadEconomica.update({

    //         where: { id: req.body.id }
    //     }).then(function (actividadActualizada) {
    //         res.json({ mensaje: 'Actividad Actualizada' })
    //     }).catch(function (err) {
    //         res.json({ actividades: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                    });
                                } else {
                                    if (i === req.body.length - 1) {
                                        res.json({ mensaje: 'Servicios actualizados satisfactoriamente!' + mensajeExtra })
                                    }
                                }
                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                res.json({ servicios: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
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
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                });
        })

    router.route('/alertas/proformas/:id_empresa')
        .get(function (req, res) {
            Proforma.findAll({
                where: {
                    id_empresa: req.params.id_empresa,
                    eliminado: false,
                    fecha_factura: null,
                    fecha_proforma_ok: { $not: null }
                },
                include: [
                    { model: Clase, as: 'actividadEconomica' },
                    { model: Cliente, as: 'clienteProforma' },
                ]

            }).then(function (proformasAlertas) {
                var proformasVencimiento = []
                if (proformasAlertas.length > 0) {
                    proformasAlertas.map(function (proforma, i) {
                        var fecPro = new Date(proforma.fecha_proforma).getTime()

                        var hoy = new Date().getTime()
                        var dif = Math.floor((hoy - fecPro) / 86400000)
                        if (dif >= -30 && dif <= 30) {
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
                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
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
                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })


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
                        res.json({ hasError: true, message: err.stack });
                    });
                })
            }).then(function (result) {
                console.log(result);
                if (result) {
                    if (mensajeError.length > 0) {
                        res.json({ mensaje: mensajeError, hasError: true });
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
                res.json({ hasError: true, mensaje: err.stack });
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

    router.route('/proforma/facturar/:id_empresa')
        .post(function (req, res) {
            var factura = req.body;

            SucursalActividadDosificacion.find({
                where: {
                    id_actividad: req.body.actividad.id,
                    id_sucursal: req.body.sucursal.id,
                    expirado: false
                },
                include: [{ model: Dosificacion, as: 'dosificacion', include: [{ model: Clase, as: 'pieFactura' }] },
                { model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa' }] }]
            }).then(function (sucursalActividadDosificacion) {

                var dosificacion = sucursalActividadDosificacion.dosificacion;
                factura.factura = dosificacion.correlativo;
                factura.pieFactura = dosificacion.pieFactura;
                factura.codigo_control = CodigoControl.obtenerCodigoControl(dosificacion.autorizacion.toString(),
                    dosificacion.correlativo.toString(),
                    factura.clienteProforma.nit.toString(),
                    formatearFecha(factura.fecha_factura).toString(),
                    parseFloat(factura.totalImporteBs).toFixed(2),
                    dosificacion.llave_digital.toString());
                factura.autorizacion = dosificacion.autorizacion.toString();
                factura.fecha_limite_emision = dosificacion.fecha_limite_emision;
                factura.numero_literal = NumeroLiteral.Convertir(parseFloat(factura.totalImporteBs).toFixed(2).toString());
                var laFecha = factura.fecha_factura.split("/")
                var fecha_factura = new Date(laFecha[2], laFecha[1] - 1, laFecha[0])
                factura.datosProformas.map(function (prof, i) {
                    Proforma.update({
                        movimiento: factura.movimiento.id,
                        factura: factura.factura,
                        autorizacion: factura.autorizacion,
                        fecha_limite_emision: factura.fecha_limite_emision,
                        codigo_control: factura.codigo_control,
                        descripcion_factura: factura.descripcion,
                        fecha_factura: fecha_factura
                    }, {
                            where: { id: prof.id }
                        }).then(function (proformaActualizada) {
                            if (i === factura.datosProformas.length - 1) {
                                Dosificacion.update({
                                    correlativo: (factura.factura + 1)
                                }, {
                                        where: { id: dosificacion.id }
                                    }).then(function (correlativoActualizado) {
                                        ConfiguracionGeneralFactura.find({
                                            where: {
                                                id_empresa: prof.id_empresa
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
                                            factura.configuracion = configuracionGeneralFactura
                                            var total = 0
                                            factura.detallesVenta = factura.detallesProformas.map(function (det, i) {
                                                var producto = { codigo: det.servicio.codigo, nombre: det.servicio.nombre, unidad_medida: "" }
                                                total += det.importe
                                                det.total = det.importe * det.cantidad
                                                det.producto = producto
                                                return det
                                            })
                                            factura.total = total
                                            factura.cliente = factura.clienteProforma
                                            res.json({ mensaje: 'Espere la impresión...', factura: req.body })

                                        }).catch(function (err) {
                                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true, factura: req.body })
                                        });
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true, factura: req.body })
                                    });
                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true, factura: req.body })
                        });
                })
            }).catch(function (err) {
                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true, factura: req.body })
            });
        })

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
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true, factura: req.body })
                });
            })

        })
}