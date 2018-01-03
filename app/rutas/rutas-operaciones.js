module.exports = function (router, sequelize, Sequelize, Usuario, Producto, Diccionario, Clase, Sucursal, Empresa, ProductoBase, Almacen,
    Inventario, SolicitudReposicion, DetalleSolicitudProducto, DetalleSolicitudProductoBase, Persona, Tipo) {
    router.route('/operaciones/empresa/:id_empresa')
        .post(function (req, res) {
            // var fecha = req.body.fechaTexto.split('/')
            Clase.find({
                where:{nombre_corto : 'MOVOPSOL'}
            }).then(function (movimiento) {
                if (req.body.id === undefined) {
                    fecha = req.body.fechaTexto.split('/')
                    SolicitudReposicion.create({
                        id_almacen: req.body.almacen.id,
                        id_movimiento: movimiento.id,
                        fecha: req.body.fecha,
                        id_usuario: req.body.id_usuario,
                        activo: req.body.activo
                    }).then(function (solicitudCreada) {
                        req.body.solicitudesProductos.forEach(function (producto, index, array) {
                            DetalleSolicitudProducto.create({
                                id_solicitud: solicitudCreada.id,
                                id_producto: (producto.id_producto!==undefined)?producto.id_producto:producto.producto.id,
                                cantidad: producto.cantidad
                            }).then(function (detalleCreado) {
                                if(producto.ingredientes.length >0){
                                    producto.ingredientes.forEach(function (ingrediente, indx, arry) {
                                        DetalleSolicitudProductoBase.create({
                                            id_detalle_solicitud_producto: detalleCreado.id,
                                            id_producto_base: ingrediente.id_producto_base,
                                            cantidad_ideal: (ingrediente.formulacion !== undefined)?parseFloat(ingrediente.formulacion): parseFloat(ingrediente.cantidad_ideal),
                                            cantidad_real: (ingrediente.cantidad_real !== undefined)?parseFloat(ingrediente.cantidad_real):parseFloat(ingrediente.formulacion)
                                        }).then(function (detalleBaseCreado) {
                                            if (index === array.length - 1) {
                                                if (indx === arry.length - 1) {
                                                    res.json({ mensaje: 'Solicitud creada', solitudId: solicitudCreada.id })
                                                }
                                            }
                                        })
                                    });
                                }else{
                                    res.json({ mensaje: 'Solicitud creada', solitudId: solicitudCreada.id })
                                }
                            })
                        });
                    })
                }
            })
        })
        .get(function (req, res) {
            SolicitudReposicion.findAll({
                include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                {
                    model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado' },
                    { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase' }] }]
                },
                { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }] }, { model: Clase, as: 'movimiento' }]
            }).then(function (solicitudes) {
                res.json({ solicitudes: solicitudes })
            })
        })
        .put(function (req, res) {
            var actualizacionTerminada = false
            if(req.body.activo){
                SolicitudReposicion.update({
                    id_almacen: req.body.almacen.id,
                    id_movimiento: req.body.movimiento.id,
                    fecha: req.body.fecha,
                    id_usuario: req.body.id_usuario,
                    activo: req.body.activo
                },{
                    where:{id:req.body.id}
                }).then(function (solicitudActualizada) {
                    req.body.solicitudesProductos.forEach(function (producto, index, array) {
                        if(producto.id!==undefined){
                            if(producto.eliminado === undefined){
                                DetalleSolicitudProducto.update({
                                    id_solicitud: req.body.id,
                                    id_producto: (producto.id_producto!==undefined)?producto.id_producto:producto.producto.id,
                                    cantidad: producto.cantidad
                                },{
                                    where:{id: producto.id}
                                }).then(function (detalleActualizado) {
                                    if(producto.detallesIngredientesProducto.length >0){
                                        producto.detallesIngredientesProducto.forEach(function (ingrediente, indx, arry) {
                                            if (ingrediente.eliminado === undefined) {
                                                DetalleSolicitudProductoBase.update({
                                                    id_detalle_solicitud_producto: ingrediente.id_detalle_solicitud_producto,
                                                    id_producto_base: (ingrediente.productoBase!==undefined)?ingrediente.productoBase.id:ingrediente.id_producto_base,
                                                    cantidad_ideal:(ingrediente.cantidad_ideal !== undefined)? parseFloat(ingrediente.cantidad_ideal):parseFloat(ingrediente.formulacion),
                                                    cantidad_real: (ingrediente.cantidad_real !== undefined)?parseFloat(ingrediente.cantidad_real):parseFloat(ingrediente.formulacion)
                                                },{
                                                    where:{id:ingrediente.id}
                                                }).then(function (detalleBaseActualizado) {
                                                    if (index === array.length - 1) {
                                                        if (indx === arry.length - 1) {
                                                            res.json({ mensaje: 'Solicitud actualizada', solitudId: solicitudActualizada.id })
                                                        }
                                                    }
                                                })
                                            } else {
                                                DetalleSolicitudProductoBase.destroy({
                                                    where:{
                                                        id:ingrediente.id
                                                    }
                                                }).then(function (elementoEliminado) {
                                                    
                                                })
                                            }
                                            
                                        });
                                    }else{
                                        if (index === array.length - 1) {
                                            res.json({ mensaje: 'Solicitud Actualizada'})
                                        }
                                    }
                                })
                            }else{
                                DetalleSolicitudProducto.destroy({
                                    where:{
                                        id:producto.id
                                    }
                                }).then(function (elementoEliminado) {
                                    
                                })
                            }
                           
                        }else{
                            DetalleSolicitudProducto.create({
                                id_solicitud: req.body.id,
                                id_producto: (producto.id_producto!==undefined)?producto.id_producto:producto.producto.id,
                                cantidad: producto.cantidad
                            }).then(function (detalleCreado) {
                                if(producto.ingredientes.length >0){
                                    producto.ingredientes.forEach(function (ingrediente, indxe, arrye) {
                                        DetalleSolicitudProductoBase.create({
                                            id_detalle_solicitud_producto: detalleCreado.id,
                                            id_producto_base: ingrediente.id_producto_base,
                                            cantidad_ideal: (ingrediente.formulacion !== undefined)?parseFloat(ingrediente.formulacion): parseFloat(ingrediente.cantidad_ideal),
                                            cantidad_real: (ingrediente.cantidad_real !== undefined)?parseFloat(ingrediente.cantidad_real):parseFloat(ingrediente.formulacion)
                                        }).then(function (detalleBaseCreado) {
                                            if (index === array.length - 1) {
                                                if (indxe === arrye.length - 1) {
                                                    res.json({ mensaje: 'Solicitud Actualizada' })
                                                }
                                            }
                                        })
                                    });
                                }else{
                                    if (index === array.length - 1) {
                                        res.json({ mensaje: 'Solicitud Actualizada' })
                                    }
                                    
                                }
                            })
                        }
                    });
                })
            }else{
                SolicitudReposicion.update({
                    activo: req.body.activo
                }, {
                        where: { id: req.body.id}
                    }).then(function (solicitudActualizada) {
                        res.json({ mensaje: "Solicitud Cerrada satisfactoriamente!" });
                    })
            }
        })
        router.route('/operaciones/eliminar/:id_solicitud')
        .post(function (req,res) {
            SolicitudReposicion.destroy({
                where:{id:req.params.id_solicitud}
            }).then(function(solicitudEliminada) {
                res.json({mensaje:'Solicitud eliminada!'})
            })
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
            });
        });
}