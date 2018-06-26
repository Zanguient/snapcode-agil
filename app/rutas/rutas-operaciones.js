module.exports = function (router, sequelize, Sequelize, Usuario, Producto, Diccionario, Clase, Sucursal, Empresa, ProductoBase, Almacen,
    Inventario, SolicitudReposicion, DetalleSolicitudProducto, DetalleSolicitudProductoBase, Persona, UsuarioGrupos, Tipo, Movimiento, DetalleMovimiento) {
    router.route('/operaciones/empresa/:id_empresa/vintage/:id_usuario/capo/:rol/desde/:desde/hasta/:hasta/suc/:sucursal/alm/:almacen/mov/:movimiento/est/:estado/val/:valuado/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda')
        .get(function (req, res) {
            var condicion = {id_empresa: req.params.id_empresa}
            var condicionSucursal = {}
            var condicionAlmacen = {}
            var condicionUsuario = {}
            var condicionPersona = {}
            ordenArreglo = [];
            var desde = false
            var hasta = false
            if (req.params.desde != "0") {
                var inicio = new Date(req.params.desde); inicio.setHours(0, 0, 0, 0, 0);
                desde = true
            }
            if (req.params.hasta != "0") {
                var fin = new Date(req.params.hasta); fin.setHours(23, 0, 0, 0, 0);
                hasta = true
            }
            if (desde && hasta) {
                condicion = {
                    fecha: { $between: [inicio, fin] }
                }
            } else if (desde && !hasta) {
                condicion.fecha = {
                    $gte: [inicio]
                }
            } else if (!desde && hasta) {
                condicion.fecha = {
                    $lte: [fin]
                }
            } else if (!desde && !hasta) {
                // var hoy = new Date()
                // condicion.fecha = {
                // }
            }
            // if (req.params.sucursal != "0") {
            //     condicion.sucursal = req.params.sucursal
            // }
            if (req.params.almacen != "0") {
                condicion.almacen = parseInt(req.params.almacen)
            }
            // if (req.params.movimiento != "0") {
            //     condicion.movimiento = parseInt(req.params.movimiento)
            // }
            if (req.params.estado != "0") {
                condicion.activo = (req.params.estado == "1") ? true : false
            }
            if (req.params.busqueda != "0") {
                // condicionAlmacen = {$or:[{nombre:{$like:
                //     '%'+req.params.busqueda+'%'
                // }}]}
                // condicionSucursal = {$or:[{nombre:{$like:
                //     '%'+req.params.busqueda+'%'
                // }}]}
                condicionUsuario = {
                    $or: [{
                        nombre_usuario: {
                            $like:
                                '%' + req.params.busqueda + '%'
                        }
                    }]
                }
                condicionPersona = {
                    $or: [{
                        nombre_completo: {
                            $like:
                                '%' + req.params.busqueda + '%'
                        }
                    }]
                }
            }
            if (req.params.valuado != "0") {
                condicion.valuado = req.params.valuado
            }

            if (req.params.rol === "ADMINISTRADOR") {
                //:desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
                condicion.eliminado = false
                if (req.params.items_pagina !== "0") {
                    SolicitudReposicion.findAndCountAll({
                        where: condicion,
                        include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                        {
                            model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] },
                            { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false }, { model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] }] }]
                        },
                        { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]
                    }).then(function (data) {
                        SolicitudReposicion.findAll({
                            offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                            where: condicion,
                            include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                            {
                                model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] },
                                { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] }] }]
                            },
                            { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]

                        }).then(function (solicitudes) {
                            res.json({ solicitudes: solicitudes, paginas: Math.ceil(data.count / req.params.items_pagina) })
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack })
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack })
                    });
                } else {
                    SolicitudReposicion.findAndCountAll({
                        where: condicion,
                        include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                        {
                            model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] },
                            { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] }] }]
                        },
                        { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]

                    }).then(function (data) {
                        SolicitudReposicion.findAll({
                            where: condicion,
                            include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                            {
                                model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] },
                                { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] }] }]
                            },
                            { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]
                        }).then(function (solicitudes) {
                            res.json({ solicitudes: solicitudes, paginas: 1 })
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack })
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack })
                    });
                }

            } else {
                condicion.eliminado = false
                condicion.id_usuario = req.params.id_usuario
                if (req.params.items_pagina !== "0") {
                    SolicitudReposicion.findAndCountAll({
                        where: condicion,
                        include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                        {
                            model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false }] },
                            { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false }] }] }]
                        },
                        { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]
                    }).then(function (data) {
                        SolicitudReposicion.findAll({
                            offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                            where: condicion,
                            include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                            {
                                model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] },
                                { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] }] }]
                            },
                            { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }],//, { model: Clase, as: 'movimiento' }],
                            order: [['id', 'asc']]
                        }).then(function (solicitudes) {
                            res.json({ solicitudes: solicitudes, paginas: Math.ceil(data.count / req.params.items_pagina) })
                        }).catch(function (err) {
                            res.json({ solicitudes: [], mensaje: err.stack })
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack })
                    });
                } else {
                    SolicitudReposicion.findAndCountAll({
                        where: condicion,
                        include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                        {
                            model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false }] },
                            { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false }] }] }]
                        },
                        { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]

                    }).then(function (data) {
                        SolicitudReposicion.findAll({
                            where: condicion,
                            include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                            {
                                model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] },
                                { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false },{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] }] }]
                            },
                            { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }],//, { model: Clase, as: 'movimiento' }],
                            order: [['id', 'asc']]
                        }).then(function (solicitudes) {
                            res.json({ solicitudes: solicitudes, paginas: 1 })
                        }).catch(function (err) {
                            res.json({ solicitudes: [], mensaje: err.stack })
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack })
                    });
                }

            }
        })

    function crearDetalleSolicitudProductoBase(ingrediente, t, detalleCreado) {
        if (ingrediente.eliminado) {
            return new Promise(function (fulfill, reject) {
                fulfill('Ingrediente eliminado')
            })
        } else {
            return DetalleSolicitudProductoBase.create({
                id_detalle_solicitud_producto: detalleCreado.id,
                id_producto_base: ingrediente.id_producto_base,
                cantidad_ideal: ingrediente.cantidad_ideal,
                cantidad_real: ingrediente.cantidad_real,
                total: ingrediente.total
            }, { transaction: t }).then(function (detalleBaseCreado) {
                return new Promise(function (fulfill, reject) {
                    return fulfill('detalleBaseCreado')
                })
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    return reject((err.stack !== undefined) ? err.stack : err)
                })
            })
        }
    }

    function crearDetalleSolicitudProducto(producto, solicitudCreada, t) {
        if (producto.eliminado) {
            return new Promise(function (fulfill, reject) {
                fulfill('Producto eliminado.')
            })
        } else {
            return DetalleSolicitudProducto.create({
                id_solicitud: solicitudCreada.id,
                id_producto: producto.productoSolicitado.id,
                cantidad: producto.cantidad
            }, { transaction: t }).then(function (detalleCreado) {
                var detallesProductoBase = []
                if (producto.detallesIngredientesProducto.length > 0) {
                    for (let i = 0; i < producto.detallesIngredientesProducto.length; i++) {
                        detallesProductoBase.push(crearDetalleSolicitudProductoBase(producto.detallesIngredientesProducto[i], t, detalleCreado))
                    }
                } else {
                    detallesProductoBase.push(new Promise(function (fulfill, reject) {
                        fulfill('Empty object')
                    }))
                }
                Promise.all(detallesProductoBase)
            }).catch(function (err) {
                new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err)
                })
            })
        }
    }

    router.route('/solicitud/empresa/:id_empresa')
        .post(function (req, res) {
            sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE }, function (t) {
                return SolicitudReposicion.create({
                    id_almacen: req.body.almacen.id,
                    // id_movimiento: movimientoEgresoCreado.id,
                    fecha: req.body.fecha,
                    id_usuario: req.body.id_usuario,
                    activo: req.body.activo,
                    monto: req.body.monto,
                    id_empresa: req.params.id_empresa
                }, { transaction: t }).then(function (solicitudCreada) {
                    var aceptado = false
                    var done = false
                    var detallesSolicitud = []
                    for (let i = 0; i < req.body.solicitudesProductos.length; i++) {
                        detallesSolicitud.push(
                            crearDetalleSolicitudProducto(req.body.solicitudesProductos[i], solicitudCreada, t)
                        )
                    }
                    return Promise.all(detallesSolicitud).then(function (donePromises) {
                        return new Promise(function (fulfill, reject) {
                            fulfill('Solicitud creada, para actualizar el inventario confirme la entrega.')
                        })
                    })
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                });
            }).then(function (result) {
                if (result) {
                    res.json({ mensaje: result })
                } else {
                    throw new Error('Parece que hubo un error pero no capturó correctamente. Por favor revise que se guardaron los datos de la acción que acaba de realizar, si no es así, por favor vuelva a intentarlo o contacte a servicio técnico.');
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
            });
        })

        .put(function (req, res) {
            sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE }, function (t) {
                return SolicitudReposicion.update({
                    id_almacen: req.body.almacen.id,
                    id_movimiento: req.body.id_movimiento,
                    fecha: req.body.fecha,
                    id_usuario: req.body.id_usuario,
                    activo: req.body.activo,
                    monto: req.body.monto,
                    empresa: req.params.id_empresa
                }, {
                        where: { id: req.body.id },
                        transaction: t
                    }).then(function (sol) {
                        return DetalleSolicitudProducto.destroy({
                            where: { id_solicitud: req.body.id }
                        }).then(function (result) {
                            var promises = [];
                            for (let i = 0; i < req.body.solicitudesProductos.length; i++) {
                                promises.push(
                                    crearDetalleSolicitudProducto(req.body.solicitudesProductos[i], req.body, t)
                                )
                            }
                            return Promise.all(promises).then(function (data) {
                                return new Promise(function (fulfill, reject) {
                                    fulfill('Solicitud actualizada.')
                                })
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
                    })
            }).then(function (transaccionActualizada) {
                if (transaccionActualizada !== undefined) {
                    res.json({ mensaje: transaccionActualizada })
                } else {
                    throw new Error('Se produjo un error y no se puede asegurar que los datos se guardaron correctamente, contacte con servicio técnico.');
                }
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            })
        })

    function crearDetalleMovimientoIngresoYActualizarInventario(movimiento, detalleMovimiento, t) {
        return DetalleMovimiento.create({
            id_movimiento: movimiento.id,
            id_producto: detalleMovimiento.id_producto,
            costo_unitario: detalleMovimiento.costo_unitario,
            cantidad: detalleMovimiento.cantidad,
            importe: (detalleMovimiento.costo_unitario * detalleMovimiento.cantidad),
            descuento: detalleMovimiento.descuento,
            recargo: detalleMovimiento.recargo,
            ice: detalleMovimiento.ice,
            excento: detalleMovimiento.excento,
            tipo_descuento: detalleMovimiento.tipo_descuento,
            tipo_recargo: detalleMovimiento.tipo_recargo,
            total: detalleMovimiento.total,
            id_inventario: detalleMovimiento.id_inventario
        }, { transaction: t }).then(function (detalleMovimientoCreado) {
            sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED }, function (tu) {
                return Inventario.find({
                    where: {
                        id: detalleMovimiento.id_inventario
                    },
                    transaction: tu,
                    lock: tu.LOCK.UPDATE
                }).then(function (inventarioEncontrado) {
                    return Inventario.update({
                        cantidad: inventarioEncontrado.cantidad + detalleMovimientoCreado.cantidad,
                        costo_total: inventarioEncontrado.costo_unitario * (inventarioEncontrado.cantidad + detalleMovimientoCreado.cantidad)
                    }, {
                            where: {
                                id: detalleMovimiento.id_inventario
                            },
                            transaction: tu
                        });
                });
            }).then(function (result) {
                return new Promise(function (fulfill, reject) {
                    fulfill({});
                });
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject(err);
                });
            });
        });
    }

    router.route('/productos-operaciones/empresa/:id_empresa/cerrar')
        .post(function (req, res) {
            var Mypromise = []
            var trans = sequelize.transaction({
                isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, function (t) {
                return Tipo.find({
                    where: { nombre_corto: Diccionario.MOV_EGRE },
                    transaction: t
                }).then(function (tipoMovimiento) {
                    return Clase.find({
                        where: { nombre_corto: Diccionario.EGRE_TRASPASO },
                        transaction: t
                    }).then(function (conceptoMovimiento) {
                        return Movimiento.create({
                            id_tipo: tipoMovimiento.id,
                            id_clase: conceptoMovimiento.id,
                            id_almacen: req.body.almacen.id,
                            fecha: req.body.fecha
                        }, { transaction: t }).then(function (movimientoEgresoCreado) {
                            return SolicitudReposicion.update({
                                id_movimiento:movimientoEgresoCreado.id,
                                activo: false
                            }, {
                                    where: { id: req.body.id }, transaction: t
                                }).then(function (solicitudActualizada) {
                                    for (let index = 0; index < req.body.listaProductosSolicitados.productos.length; index++) {
                                        Mypromise.push(calcularCostosEgresos(req.body.listaProductosSolicitados.productos[index], req.body.listaProductosSolicitados.productos[index].productoSolicitudBase, req.body.listaProductosSolicitados.productos[index].cantidad_real, req.body.listaProductosSolicitados.productos[index].productoSolicitudBase.inventarios, movimientoEgresoCreado, index, req.body.listaProductosSolicitados, res, req.body, t))
                                    }
                                    return Promise.all(Mypromise).then(function (data) {
                                        return new Promise(function (fulfill, reject) {
                                            fulfill('Solicitud cerrada, inventario actualizado.')
                                        })
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
                })
            }).then(function (transaccionCreada) {
                if (transaccionCreada !== undefined) {
                    res.json({ mensaje: transaccionCreada })
                } else {
                    throw new Error('Se produjo un error y no se puede asegurar que los datos se guardaron correctamente, contacte con servicio técnico.');
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
            })
        })

    function calcularCostosEgresos(detalleVenta, producto, cantidad, inventarios, movimientoCreado, index, array, res, venta, t) {
        var promesas = []
        var cantidadTotal = cantidad;
        if (producto.activar_inventario) {
            if (inventarios !== undefined) {
                if (inventarios.length > 0) {
                    var promises = [];
                    for (var i = 0; i < inventarios.length; i++) {
                        if (cantidadTotal > 0) {
                            var cantidadParcial;
                            if (cantidadTotal > inventarios[i].cantidad) {
                                cantidadParcial = inventarios[i].cantidad;
                                cantidadTotal = cantidadTotal - inventarios[i].cantidad
                            } else {
                                cantidadParcial = cantidadTotal;
                                cantidadTotal = 0;
                            }
                            if (cantidadParcial > 0) {
                                promesas.push(crearMovimientoEgresoYActualizarInventario(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, res, venta, t))
                            }
                        }
                    }
                } else {
                    promesas.push(new Promise(function (fulfill, reject) {
                        reject('Producto ' + producto.nombre + ' sin inventario disponible, no se puede cerrar la solicitud');
                    }))
                }
            } else {
                promesas.push(new Promise(function (fulfill, reject) {
                    reject('Producto ' + producto.nombre + ' sin inventario disponible, no se puede cerrar la solicitud')
                }))
            }

        } else {
            promesas.push(new Promise(function (fulfill, reject) {
                fulfill('Producto no inventariado.');
            }))
        }
        return Promise.all(promesas);
    }

    function crearMovimientoEgresoYActualizarInventario(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, costo, index, array, i, res, datosVenta, t) {
        return DetalleMovimiento.create({
            id_movimiento: movimientoCreado.id,
            id_producto: producto.id,
            cantidad: cantidadParcial,
            costo_unitario: costo.costo_unitario,
            importe: (cantidadParcial * costo.costo_unitario),
            total: (cantidadParcial * costo.costo_unitario),
            descuento: (producto.descuento * cantidadParcial),
            recargo: (0 * cantidadParcial),
            ice: (0 * cantidadParcial),
            excento: (0 * cantidadParcial),
            tipo_descuento: producto.descuento_fijo,
            tipo_recargo: 0,
            fecha_vencimiento: producto.inventarios[0].fecha_vencimiento,
            lote: producto.inventarios[0].lote,
            id_inventario: costo.id
        }, { transaction: t }).then(function (detalleMovimientoCreado) {
            return Inventario.find({
                where: {
                    id: costo.id
                },
                transaction: t,
                lock: t
            }).then(function (inventario) {
                if (inventario.cantidad >= cantidadParcial) {
                    return Inventario.update({
                        cantidad: inventario.cantidad - cantidadParcial,
                        costo_total: ((inventario.cantidad - cantidadParcial) * costo.costo_unitario)
                    }, {
                            where: {
                                id: inventario.id
                            },
                            transaction: t
                        }).then(function (result) {
                            return new Promise(function (fulfill, reject) {
                                fulfill(result);
                            });
                        }).catch(function (err) {
                            return new Promise(function (fulfill, reject) {
                                reject((err.stack !== undefined) ? err.stack : err);
                            });
                        });
                } else {
                    return new Promise(function (fulfill, reject) {
                        reject('Error: La cantidad disponible es menor a la cantidad solicitada.');
                    });
                }
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            });
        });
    }

    router.route('/productos-operaciones/empresa/:id_empresa/almacen/:id_almacen/user/:id_usuario')
        .get(function (req, res) {
            UsuarioGrupos.findAll({
                where: { id_usuario: req.params.id_usuario }
            }).then(function (grupos) {
                var gruposUsuario = grupos.map(function (grupo) {
                    return grupo.id_grupo
                })
                Producto.findAll({
                    where: { id_empresa: req.params.id_empresa, publicar_panel: true, id_grupo: { $in: gruposUsuario } },
                    include: [
                        { model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
                        { model: Clase, as: 'tipoProducto', required: false },
                        {
                            model: ProductoBase, as: 'productosBase', required: false,
                            include: [{
                                model: Producto, as: 'productoBase', required: false,
                                include: [{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
                                { model: Clase, as: 'tipoProducto', required: false },
                                {
                                    model: ProductoBase, as: 'productosBase', required: false,
                                    include: [{
                                        model: Producto, as: 'productoBase', required: false,
                                        include: [{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
                                        { model: Clase, as: 'tipoProducto', required: false }]
                                    }]
                                }]
                            }]
                        }],
                    order: [[{ model: Inventario, as: 'inventarios' }, 'updatedAt', 'DESC']]
                }).then(function (productos) {
                    res.json(productos);
                }).catch(function (err) {
                    res.json([{ hasError: true, mensaje: err.stack + '---LN 535 rutas operaciones.' }]);
                });
            }).catch(function (err) {
                res.json([{ hasError: true, mensaje: err.stack + '---LN 529 rutas operaciones.' }]);
            });
        });

    router.route('/operaciones/impresion/:id_solicitud')
        .get(function (req, res) {
            SolicitudReposicion.find({
                where: condicion,
                include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                {
                    model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                    { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                },
                { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }] }]

            }).then(function (solicitudImprimir) {
                res.json({ solicitud: solicitudImprimir })
            }).catch(function (err) {
                res.json({ mensaje: err.stack })
            });
        })

    router.route('/operaciones/eliminar/:id_solicitud')
        .post(function (req, res) {
            SolicitudReposicion.update({
                eliminado: true
            }, {
                    where: { id: req.params.id_solicitud }
                }).then(function (solicitudEliminada) {
                    // req.body.solicitudesProductos.map(function (prod) {
                    //     var done = false
                    //     var aceptado = false
                    //     if (prod.inventarios !== undefined) {
                    //         if (prod.inventarios.length > 1 && !done) {
                    //             prod.inventarios.map(function (inventario) {
                    //                 if (!aceptado) {
                    //                     Inventario.find({
                    //                         where: {
                    //                             id: inventario.id
                    //                         }
                    //                     }).then(function (InventarioEncontrado) {
                    //                         if (InventarioEncontrado.cantidad >= prod.cantidad) {
                    //                             aceptado = true
                    //                         }
                    //                         if (aceptado && !done) {
                    //                             Inventario.update({
                    //                                 cantidad: InventarioEncontrado.cantidad + prod.cantidad,
                    //                                 costo_total: InventarioEncontrado.cantidad + prod.cantidad * InventarioEncontrado.costo_unitario
                    //                             }, {
                    //                                     where: {
                    //                                         id: InventarioEncontrado.id
                    //                                     }
                    //                                 }).then(function (InventarioActualizado) {
                    //                                     done = true
                    //                                     if (index === array.length - 1) {
                    //                                         res.json({ mensaje: 'Solicitud Eliminada' })
                    //                                     }
                    //                                 }).catch(function (err) {
                    //                                     res.json({ mensaje: err.stack })
                    //                                 });
                    //                         }
                    //                     }).catch(function (err) {
                    //                         res.json({ mensaje: err.stack })
                    //                     });
                    //                 }
                    //             })
                    //         } else if (prod.inventarios.length === 1) {
                    //             Inventario.find({
                    //                 where: {
                    //                     id: prod.inventarios[0].id
                    //                 }
                    //             }).then(function (InventarioEncontrado) {
                    //                 Inventario.update({
                    //                     cantidad: InventarioEncontrado.cantidad + prod.cantidad,
                    //                     costo_total: InventarioEncontrado.cantidad + prod.cantidad * InventarioEncontrado.costo_unitario
                    //                 }, {
                    //                         where: {
                    //                             id: InventarioEncontrado.id
                    //                         }
                    //                     }).then(function (InventarioActualizado) {
                    //                         done = true
                    //                         if (index === array.length - 1) {
                    //                             res.json({ mensaje: 'Solicitud Eliminada' })
                    //                         }
                    //                     }).catch(function (err) {
                    //                         res.json({ mensaje: err.stack })
                    //                     });
                    //             }).catch(function (err) {
                    //                 res.json({ mensaje: err.stack })
                    //             });
                    //         }
                    //     }
                    // })
                    res.json({ mensaje: 'Solicitud eliminada!' })
                }).catch(function (err) {
                    res.json({ mensaje: err.stack })
                });
        })

    router.route('/operaciones/producto/:id_producto')
        .get(function (req, res) {
            Producto.find({
                where: { id: req.params.id_producto, },
                include: [{
                    model: ProductoBase, as: 'productosBase', where: { id_producto: { $ne: null } }, required: true,
                    include: [{ model: Producto, as: 'productoBase', required: true }]
                }]
            }).then(function (producto) {
                res.json(producto);
            }).catch(function (err) {
                res.json({ mensaje: err.stack })
            });
        });

        router.route('/operaciones/pedido/:id_empresa')
        .post(function (req, res) {
            Producto.find({
                where: { id: req.params.id_producto, },
                include: [{
                    model: ProductoBase, as: 'productosBase', where: { id_producto: { $ne: null } }, required: true,
                    include: [{ model: Producto, as: 'productoBase', required: true }]
                }]
            }).then(function (producto) {
                res.json(producto);
            }).catch(function (err) {
                res.json({ mensaje: err.stack })
            });
        });
}
