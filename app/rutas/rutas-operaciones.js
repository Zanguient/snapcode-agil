module.exports = function (router, sequelize, Sequelize, Usuario, Producto, Diccionario, Clase, Sucursal, Empresa, ProductoBase, Almacen,
    Inventario, SolicitudReposicion, DetalleSolicitudProducto, DetalleSolicitudProductoBase, Persona) {
    router.route('/operaciones/empresa/:id_empresa/vintage/:id_usuario/capo/:rol/desde/:desde/hasta/:hasta/suc/:sucursal/alm/:almacen/mov/:movimiento/est/:estado/val/:valuado/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda')
        .post(function (req, res) {
            if (req.body.id === undefined) {
                fecha = req.body.fechaTexto.split('/')
                SolicitudReposicion.create({
                    id_almacen: req.body.almacen.id,
                    // id_movimiento: movimiento.id,
                    fecha: req.body.fecha,
                    id_usuario: req.body.id_usuario,
                    activo: req.body.activo,
                    monto: req.body.monto
                }).then(function (solicitudCreada) {
                    var aceptado = false
                    var done = false
                    req.body.solicitudesProductos.forEach(function (producto, index, array) {
                        DetalleSolicitudProducto.create({
                            id_solicitud: solicitudCreada.id,
                            id_producto: producto.productoSolicitado.id,
                            cantidad: producto.cantidad
                        }).then(function (detalleCreado) {
                            if (producto.detallesIngredientesProducto.length > 0) {
                                producto.detallesIngredientesProducto.forEach(function (ingrediente, indx, arry) {
                                    DetalleSolicitudProductoBase.create({
                                        id_detalle_solicitud_producto: detalleCreado.id,
                                        id_producto_base: ingrediente.id_producto_base,
                                        cantidad_ideal: ingrediente.cantidad_ideal,
                                        cantidad_real: ingrediente.cantidad_real,
                                        total: ingrediente.total
                                    }).then(function (detalleBaseCreado) {
                                        if (index === array.length - 1) {
                                            if (indx === arry.length - 1) {
                                            res.json({ mensaje: 'Solicitud creada.' })
                                        }}
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.data })
                                    })
                                });
                            }else{
                                if (index === array.length - 1) {
                                    res.json({ mensaje: 'Solicitud creada.' })
                                }
                            }

                        }).catch(function (err) {
                            res.json({ mensaje: err.data })
                        });
                        // if (producto.inventarios.length > 1 && !done) {
                        //     producto.inventarios.map(function (inventario) {
                        //         if (!aceptado) {
                        //             Inventario.find({
                        //                 where: {
                        //                     id: inventario.id
                        //                 }
                        //             }).then(function (InventarioEncontrado) {
                        //                 // if (InventarioEncontrado.cantidad >= producto.cantidad) {
                        //                 //     aceptado = true
                        //                 // }
                        //                 // if (aceptado && !done) {
                        //                 //     Inventario.update({
                        //                 //         cantidad: InventarioEncontrado.cantidad - producto.cantidad,
                        //                 //         costo_total: (InventarioEncontrado.cantidad - producto.cantidad) * InventarioEncontrado.costo_unitario
                        //                 //     }, {
                        //                 //             where: {
                        //                 //                 id: InventarioEncontrado.id
                        //                 //             }
                        //                 //         }).then(function (InventarioActualizado) {
                        //                 //             done = true
                        //                 //             if (index === array.length - 1) {

                        //                 //                 res.json({ mensaje: 'Solicitud creada.' })
                        //                 //             }
                        //                 //         }).catch(function (err) {
                        //                 //             res.json({ mensaje: err.data })
                        //                 //         });
                        //                 // }
                        //             }).catch(function (err) {
                        //                 res.json({ mensaje: err.data })
                        //             });
                        //         }
                        //     })
                        // } else if (producto.inventarios.length === 1) {
                        //     Inventario.find({
                        //         where: {
                        //             id: producto.inventarios[0].id
                        //         }
                        //     }).then(function (InventarioEncontrado) {
                        //         // Inventario.update({
                        //         //     cantidad: InventarioEncontrado.cantidad - producto.cantidad,
                        //         //     costo_total: (InventarioEncontrado.cantidad - producto.cantidad) * InventarioEncontrado.costo_unitario
                        //         // }, {
                        //         //         where: {
                        //         //             id: InventarioEncontrado.id
                        //         //         }
                        //         //     }).then(function (InventarioActualizado) {
                        //         //         if (index === array.length - 1) {

                        //         //             res.json({ mensaje: 'Solicitud creada.' })
                        //         //         }
                        //         //     }).catch(function (err) {
                        //         //         res.json({ mensaje: err.data })
                        //         //     });

                        //     }).catch(function (err) {
                        //         res.json({ mensaje: err.data })
                        //     });
                        // }else{
                        //     res.json({ mensaje: 'La SOLICITUD CREADA puede contener ERRORES o FALTA ALGÚN DATO, por favor verifique la solicitud y realice las modificaciones necesarias.' })
                        // }
                    });
                }).catch(function (err) {
                    res.json({ mensaje: err.data })
                });
            } else {
                res.json({ mensaje: 'Se produjo un error contactese con el administrador código OPERACIONES 109' })
            }
        })
        .get(function (req, res) {
            var condicion = {}
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
                            model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                            { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                        },
                        { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]

                    }).then(function (data) {
                        SolicitudReposicion.findAll({
                            offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                            where: condicion,
                            include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                            {
                                model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                                { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                            },
                            { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]

                        }).then(function (solicitudes) {
                            res.json({ solicitudes: solicitudes, paginas: Math.ceil(data.count / req.params.items_pagina) })
                        }).catch(function (err) {
                            res.json({ mensaje: err.data })
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.data })
                    });
                } else {
                    SolicitudReposicion.findAndCountAll({
                        where: condicion,
                        include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                        {
                            model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                            { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                        },
                        { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]

                    }).then(function (data) {
                        SolicitudReposicion.findAll({
                            where: condicion,
                            include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                            {
                                model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                                { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                            },
                            { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]
                        }).then(function (solicitudes) {
                            res.json({ solicitudes: solicitudes, paginas: 1 })
                        }).catch(function (err) {
                            res.json({ mensaje: err.data })
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.data })
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
                            model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                            { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                        },
                        { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]
                    }).then(function (data) {
                        SolicitudReposicion.findAll({
                            offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                            where: condicion,
                            include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                            {
                                model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                                { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                            },
                            { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }],//, { model: Clase, as: 'movimiento' }],
                            order: [['id', 'asc']]
                        }).then(function (solicitudes) {
                            res.json({ solicitudes: solicitudes, paginas: Math.ceil(data.count / req.params.items_pagina) })
                        }).catch(function (err) {
                            res.json({ solicitudes: [], mensaje: err.data })
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.data })
                    });
                } else {
                    SolicitudReposicion.findAndCountAll({
                        where: condicion,
                        include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                        {
                            model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                            { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                        },
                        { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]//, { model: Clase, as: 'movimiento' }]

                    }).then(function (data) {
                        SolicitudReposicion.findAll({
                            where: condicion,
                            include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                            {
                                model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                                { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                            },
                            { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }],//, { model: Clase, as: 'movimiento' }],
                            order: [['id', 'asc']]
                        }).then(function (solicitudes) {
                            res.json({ solicitudes: solicitudes, paginas: 1 })
                        }).catch(function (err) {
                            res.json({ solicitudes: [], mensaje: err.data })
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.data })
                    });
                }

            }

        })
        .put(function (req, res) {
            if (req.body.activo) {
                SolicitudReposicion.update({
                    id_almacen: req.body.almacen.id,
                    // id_movimiento: req.body.movimiento.id,
                    fecha: req.body.fecha,
                    id_usuario: req.body.id_usuario,
                    activo: req.body.activo,
                    monto: req.body.monto
                }, {
                        where: { id: req.body.id }
                    }).then(function (solicitudActualizada) {
                        req.body.solicitudesProductos.forEach(function (producto, index, array) {
                            if (producto.id !== undefined) {
                                if (producto.eliminado === undefined) {
                                    DetalleSolicitudProducto.update({
                                        id_solicitud: req.body.id,
                                        id_producto: (producto.id_producto !== undefined) ? producto.id_producto : producto.producto.id,
                                        cantidad: producto.cantidad
                                    }, {
                                            where: { id: producto.id }
                                        }).then(function (detalleActualizado) {
                                            if (producto.detallesIngredientesProducto.length > 0) {
                                                producto.detallesIngredientesProducto.forEach(function (ingrediente, indx, arry) {
                                                    if (ingrediente.eliminado === undefined) {
                                                        if (ingrediente.id !== undefined) {
                                                            DetalleSolicitudProductoBase.update({
                                                                id_detalle_solicitud_producto: ingrediente.id_detalle_solicitud_producto,
                                                                id_producto_base: (ingrediente.productoBase !== undefined) ? ingrediente.productoBase.id : ingrediente.id_producto_base,
                                                                cantidad_ideal: ingrediente.cantidad_ideal,
                                                                cantidad_real: ingrediente.cantidad_real,
                                                                total: ingrediente.total
                                                            }, {
                                                                    where: { id: ingrediente.id }
                                                                }).then(function (detalleBaseActualizado) {
                                                                    if (index === array.length - 1) {
                                                                        if (indx === arry.length - 1) {
                                                                            res.json({ mensaje: 'Solicitud actualizada' })
                                                                        }
                                                                    }
                                                                }).catch(function (err) {
                                                                    res.json({ mensaje: err.data })
                                                                });
                                                        } else {
                                                            DetalleSolicitudProductoBase.create({
                                                                id_detalle_solicitud_producto: producto.id,
                                                                id_producto_base: ingrediente.id_producto_base,
                                                                cantidad_ideal: ingrediente.cantidad_ideal,
                                                                cantidad_real: ingrediente.cantidad_real,
                                                                total: ingrediente.total
                                                            }).then(function (detalleBaseCreado) {
                                                                if (index === array.length - 1) {
                                                                    if (indx === arry.length - 1) {
                                                                        res.json({ mensaje: 'Solicitud Actualizada' })
                                                                    }
                                                                }
                                                            }).catch(function (err) {
                                                                res.json({ mensaje: err.data })
                                                            });
                                                        }

                                                    } else {
                                                        DetalleSolicitudProductoBase.destroy({
                                                            where: {
                                                                id: ingrediente.id
                                                            }
                                                        }).then(function (elementoEliminado) {
                                                            if (index === array.length - 1) {
                                                                if (indx === arry.length - 1) {
                                                                    res.json({ mensaje: 'Solicitud actualizada' })
                                                                }
                                                            }
                                                        }).catch(function (err) {
                                                            res.json({ mensaje: err.data })
                                                        });
                                                    }
                                                });
                                            } else {
                                                if (index === array.length - 1) {
                                                    res.json({ mensaje: 'Solicitud Actualizada' })
                                                }
                                            }
                                        }).catch(function (err) {
                                            res.json({ mensaje: err.data })
                                        });
                                } else {
                                    // if(producto.detallesIngredientesProducto!=undefined)
                                    DetalleSolicitudProducto.destroy({
                                        where: {
                                            id: producto.id
                                        }
                                    }).then(function (elementoEliminado) {
                                        if (index === array.length - 1) {
                                            res.json({ mensaje: 'Solicitud Actualizada' })
                                        }
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.data })
                                    });
                                }

                            } else {
                                DetalleSolicitudProducto.create({
                                    id_solicitud: req.body.id,
                                    id_producto: producto.productoSolicitado.id,
                                    cantidad: producto.cantidad
                                }).then(function (detalleCreado) {
                                    if (producto.detallesIngredientesProducto.length > 0) {
                                        producto.detallesIngredientesProducto.forEach(function (ingrediente, indxe, arrye) {
                                            DetalleSolicitudProductoBase.create({
                                                id_detalle_solicitud_producto: detalleCreado.id,
                                                id_producto_base: ingrediente.id_producto_base,
                                                cantidad_ideal: ingrediente.cantidad_ideal,
                                                cantidad_real: ingrediente.cantidad_real,
                                                total: ingrediente.total
                                            }).then(function (detalleBaseCreado) {
                                                if (index === array.length - 1) {
                                                    if (indxe === arrye.length - 1) {
                                                        res.json({ mensaje: 'Solicitud Actualizada' })
                                                    }
                                                }
                                            }).catch(function (err) {
                                                res.json({ mensaje: err.data })
                                            });
                                        });
                                    } else {
                                        if (index === array.length - 1) {
                                            res.json({ mensaje: 'Solicitud Actualizada' })
                                        }
                                    }
                                }).catch(function (err) {
                                    res.json({ mensaje: err.data })
                                });
                            }
                            // if (producto.inventarios.length > 1 && !done) {
                            //     producto.inventarios.map(function (inventario) {
                            //         if (!aceptado) {
                            //             Inventario.find({
                            //                 where: {
                            //                     id: inventario.id
                            //                 }
                            //             }).then(function (InventarioEncontrado) {
                            //                 if (InventarioEncontrado.cantidad >= producto.cantidad) {
                            //                     aceptado = true
                            //                 }
                            //                 if (aceptado && !done) {
                            //                     Inventario.update({
                            //                         cantidad: InventarioEncontrado.cantidad - (producto.cantidad - producto.inventario_disponible_utilizado),
                            //                         costo_total: (InventarioEncontrado.cantidad - (producto.cantidad - producto.inventario_disponible_utilizado)) * InventarioEncontrado.costo_unitario
                            //                     }, {
                            //                             where: {
                            //                                 id: InventarioEncontrado.id
                            //                             }
                            //                         }).then(function (InventarioActualizado) {
                            //                             done = true
                            //                             if (index === array.length - 1) {
                            //                                 res.json({ mensaje: 'Solicitud Actualizada' })
                            //                             }
                            //                         }).catch(function (err) {
                            //                             res.json({ mensaje: err.data })
                            //                         });
                            //                 }
                            //             }).catch(function (err) {
                            //                 res.json({ mensaje: err.data })
                            //             });
                            //         }
                            //     })
                            // } else if (producto.inventarios.length === 1) {
                            //     Inventario.find({
                            //         where: {
                            //             id: producto.inventarios[0].id
                            //         }
                            //     }).then(function (InventarioEncontrado) {
                            //         Inventario.update({
                            //             cantidad: InventarioEncontrado.cantidad - (producto.cantidad - producto.inventario_disponible_utilizado),
                            //             costo_total: (InventarioEncontrado.cantidad - (producto.cantidad - producto.inventario_disponible_utilizado)) * InventarioEncontrado.costo_unitario
                            //         }, {
                            //                 where: {
                            //                     id: InventarioEncontrado.id
                            //                 }
                            //             }).then(function (InventarioActualizado) {
                            //                 if (index === array.length - 1) {

                            //                     res.json({ mensaje: 'Solicitud Actualizada' })
                            //                 }
                            //             }).catch(function (err) {
                            //                 res.json({ mensaje: err.data })
                            //             });

                            //     }).catch(function (err) {
                            //         res.json({ mensaje: err.data })
                            //     });
                            // }
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.data })
                    });
            } else {
                SolicitudReposicion.update({
                    activo: req.body.activo
                }, {
                        where: { id: req.body.id }
                    }).then(function (solicitudActualizada) {
                        res.json({ mensaje: "Solicitud Cerrada satisfactoriamente!" });
                    }).catch(function (err) {
                        res.json({ mensaje: err.data.data })
                    });
            }
        })
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
                res.json({ mensaje: err.data })
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
                    //                                     res.json({ mensaje: err.data })
                    //                                 });
                    //                         }
                    //                     }).catch(function (err) {
                    //                         res.json({ mensaje: err.data })
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
                    //                         res.json({ mensaje: err.data })
                    //                     });
                    //             }).catch(function (err) {
                    //                 res.json({ mensaje: err.data })
                    //             });
                    //         }
                    //     }
                    // })
                    res.json({ mensaje: 'Solicitud eliminada!' })
                }).catch(function (err) {
                    res.json({ mensaje: err.data })
                });
        })

    router.route('/operaciones/producto/:id_producto')
        .get(function (req, res) {
            Producto.find({
                where: { id: req.params.id_producto },
                include: [{
                    model: ProductoBase, as: 'productosBase',
                    include: [{ model: Producto, as: 'productoBase' }]
                }]
            }).then(function (producto) {
                res.json(producto);
            }).catch(function (err) {
                res.json({ mensaje: err.data })
            });
        });
}