module.exports = function (router, sequelize, Sequelize, Usuario, Cliente, Proforma, DetallesProformas, Servicios, Clase, Sucursal, SucursalActividadDosificacion, Dosificacion,
    Empresa, Tipo, UsuarioSucursal, Almacen, Venta, DetalleVenta, Pedido, DetallesPedido, SolicitudReposicion, DetalleSolicitudProducto, DetalleSolicitudProductoBase, Proveedor,
    Persona, Compra, Movimiento, Inventario, DetalleCompra, DetalleMovimiento) {
    router.route('/pedido/:id_empresa/:id_pedido')
        .get(function (req, res) {
            Pedido.find({
                where: { id: req.params.id_pedido },
                include: [{
                    model: Sucursal, as: 'sucursal',
                    include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
                }, {
                    model: SolicitudReposicion, as: 'solicitud', include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
                    {
                        model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false }, { model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] },
                        { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false }, { model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] }] }]
                    },
                    { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] }]
                }
                ]
            }).then(function (pedido) {
                res.json({ pedido: pedido });
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true });
            })
        })

    router.route('/proveedores/:id_empresa')
        .get(function (req, res) {
            Proveedor.findAll({
                where: { id_empresa: req.params.id_empresa },
            }).then(function (proveedores) {
                res.json({ proveedores: proveedores });
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true });
            })
        })

    router.route('/pedidos/empresa/:id_empresa/desde/:desde/hasta/:hasta/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/tipo_pedido/:id_tipo/proveedor/:id_proveedor/nit/:nit/sucursal/:id_sucursal/estado/:estado/usuario/:usuario')
        .get(function (req, res) {
            var condicionPersona = {}
            var condicionProveedor = {}
            var condicionUsuario = {}
            var condicionSucursal = {}
            var condicionTipo = {}
            var condicionEstado = {}
            var condicionPedido = {}
            var desde = false
            var hasta = false
            if (req.params.desde != "0") {
                var inicio = new Date(req.params.desde); //inicio.setHours(0, 0, 0, 0, 0);
                desde = true
            }
            if (req.params.hasta != "0") {
                var fin = new Date(req.params.hasta); //fin.setHours(23, 0, 0, 0, 0);
                hasta = true
            }
            if (desde && hasta) {
                condicionPedido.fecha = {
                    $between: [inicio, fin]
                }
            } else if (desde && !hasta) {
                condicionPedido.fecha = {
                    $gte: [inicio]
                }
            } else if (!desde && hasta) {
                condicionPedido.fecha = {
                    $lte: [fin]
                }
            } else if (!desde && !hasta) {
                // var hoy = new Date()
                // condicion.fecha = {
                // }
            }
            if (req.params.id_tipo !== 0) {

            }
            if (req.params.id_proveedor != 0) {
                // condicionProveedor.id = req.params.id_proveedor
                condicionPedido.id_proveedor = req.params.id_proveedor
            }
            if (req.params.nit != 0) {
                condicionProveedor.nit = req.params.nit
            }
            if (req.params.id_sucursal != 0) {
                condicionSucursal.id = req.params.id_sucursal
            }
            if (req.params.estado != 0) {

            }
            if (req.params.usuario != 0) {
                condicionUsuario.id = req.params.usuario
            }
            condicionPedido.id_empresa = req.params.id_empresa
            Pedido.findAndCountAll({
                where: condicionPedido,
                include: [{
                    model: Sucursal, as: 'sucursal', where: condicionSucursal
                    // include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
                },
                {
                    model: Compra, as: 'compra',
                },
                // {
                //     model: Usuario, as: 'usuario',
                // },
                // {
                //     model: SolicitudReposicion, as: 'solicitud', include: [{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] }]
                // },
                {
                    model: Proveedor, as: 'proveedor', where: condicionProveedor
                },
                // {
                //     model: DetalleSolicitudProducto, as: 'solicitudesProductos', include: [{ model: Producto, as: 'productoSolicitado', include: [{ model: Inventario, as: 'inventarios', required: false }, { model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] },
                //     { model: DetalleSolicitudProductoBase, as: 'detallesIngredientesProducto', include: [{ model: Producto, as: 'productoSolicitudBase', include: [{ model: Inventario, as: 'inventarios', required: false }, { model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }] }] }]
                // },
                { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }] }
                ],
                offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina
            }).then(function (pedidos) {
                res.json({ pedidos: pedidos.rows, paginas: Math.ceil(pedidos.count / req.params.items_pagina) });
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true });
            })
        })

    router.route('/pedidos/:id_empresa/:id_usuario')
        .post(function (req, res) {
            var promesas = []
            var compra = req.body
            sequelize.transaction(function (t) {
                return Pedido.create({
                    id_sucursal: req.body.sucursal,
                    id_empresa: req.params.id_empresa,
                    id_proveedor: req.body.proveedor,
                    // id_compra: req.body.id_compra,
                    id_usuario: req.params.id_usuario,
                    fecha: req.body.fecha,
                    recibido: false,
                    eliminado: false
                }, {
                        transaction: t
                    }).then(function (pedidoCreado) {
                        if (req.body.detallesPedido.length > 0) {
                            for (let index = 0; index < req.body.detallesPedido.length; index++) {
                                promesas.push(crearDetallePedido(pedidoCreado.id, req.body.detallesPedido[index], req.params.id_empresa, t))
                                // promesas.push(crearDetalleCompra(req.body.detallesPedido[index], movimientoCreado.id, compraCreada.id, compra.almacen, compra.detallesPedido[index].producto.id, compra.sucursal, t));
                            }
                            if (req.body.solicitudesIds) {
                                for (let j = 0; j < req.body.solicitudesIds.length; j++) {
                                    promesas.push(SolicitudReposicion.update({
                                        id_pedido: pedidoCreado.id
                                    }, {
                                            where: { id: req.body.solicitudesIds[j] }
                                        }).then(function (solicitudActualizada) {
                                            return new Promise(function (fulfill, reject) {
                                                fulfill('Solicitud Actualizada.');
                                            });
                                        }))
                                }
                                return Promise.all(promesas).then(function (data) {
                                    return new Promise(function (fulfill, reject) {
                                        fulfill('Pedido creado satisfactoriamente.');
                                    });
                                })
                            } else {
                                return Promise.all(promesas).then(function (data) {
                                    return new Promise(function (fulfill, reject) {
                                        fulfill('Pedido creado satisfactoriamente.');
                                    });
                                })
                            }
                        } else {
                            return new Promise(function (fulfill, reject) {
                                reject('No existen detalles para crear el pedido, agrege algunos productos para crear un pedido de productos.');
                            });
                        }
                    }).catch(function (err) {
                        return new Promise(function (fulfill, reject) {
                            reject((err.stack !== undefined) ? err.stack : err);
                        });
                    })
                // return Tipo.find({
                //     where: { nombre_corto: 'MOVING' },
                //     transaction: t
                // }).then(function (tipoMovimiento) {
                //     return Clase.find({
                //         where: { nombre_corto: 'ID' },
                //         transaction: t
                //     }).then(function (conceptoMovimiento) {
                //         return Movimiento.create({
                //             id_tipo: tipoMovimiento.id,
                //             id_clase: conceptoMovimiento.id,
                //             id_almacen: compra.almacen,
                //             fecha: compra.fecha
                //         }, { transaction: t }).then(function (movimientoCreado) {
                //             return Compra.create({
                //                 id_almacen: compra.almacen,
                //                 id_proveedor: compra.proveedor,
                //                 id_movimiento: movimientoCreado.id,
                //                 factura: 0,
                //                 autorizacion: 0,
                //                 fecha: compra.fecha,
                //                 codigo_control: 0,
                //                 importe: 0,
                //                 id_tipo_pago: 18,
                //                 dias_credito: null,
                //                 a_cuenta: null,
                //                 saldo: null,
                //                 descuento_general: false,
                //                 descuento: 0,
                //                 recargo: 0,
                //                 ice: 0,
                //                 excento: 0,
                //                 tipo_descuento: 0,
                //                 tipo_recargo: 0,
                //                 total: 0,
                //                 id_usuario: compra.usuario
                //             }, { transaction: t }).then(function (compraCreada) {

                //             }).catch(function (err) {
                //                 return new Promise(function (fulfill, reject) {
                //                     reject((err.stack !== undefined) ? err.stack : err);
                //                 });
                //             })
                //         }).catch(function (err) {
                //             return new Promise(function (fulfill, reject) {
                //                 reject((err.stack !== undefined) ? err.stack : err);
                //             });
                //         })
                //     }).catch(function (err) {
                //         return new Promise(function (fulfill, reject) {
                //             reject((err.stack !== undefined) ? err.stack : err);
                //         });
                //     })
                // }).catch(function (err) {
                //     return new Promise(function (fulfill, reject) {
                //         reject((err.stack !== undefined) ? err.stack : err);
                //     });
                // })
            }).then(function (result) {
                res.json({ mensaje: result })
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
            })
        })

    function crearDetallePedido(pedido, detalle, empresa, t) {
        return DetallesPedido.create({
            id_pedido: pedido,
            id_empresa: empresa,
            id_producto: detalle.producto.id,
            cantidad: detalle.cantidad,
            recibido: false,
            eliminado: false,
            id_solicitud: detalle.solicitud,
            observacion: detalle.observacion
        }, {
                transaction: t
            }).then(function (detallecreado) {
                return new Promise(function (fulfill, reject) {
                    fulfill('Detalle pedido creado.');
                });
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            })
    }

    // function crearDetalleCompra(detalleCompra, idMovimiento, idCompra, idAlmacen, idProducto, idCentroCosto, t) {
    //     return sequelize.query('select max(id) as id, costo_unitario  from inv_inventario where producto = ' + idProducto, { type: sequelize.QueryTypes.SELECT, transaction: t }).then(function (costos) {
    //         detalleCompra.costo_unitario = costos[0].costo_unitario ? costos[0].costo_unitario : 0
    //         return Inventario.create({
    //             id_almacen: idAlmacen,
    //             id_producto: idProducto,
    //             cantidad: detalleCompra.cantidad,
    //             costo_unitario: detalleCompra.costo_unitario,
    //             costo_total: detalleCompra.costo_unitario * detalleCompra.cantidad,
    //             fecha_vencimiento: null,
    //             lote: null
    //         }, { transaction: t }).then(function (inventarioCreado) {
    //             return DetalleCompra.create({
    //                 id_compra: idCompra,
    //                 id_producto: idProducto,
    //                 id_centro_costo: idCentroCosto,
    //                 costo_unitario: detalleCompra.costo_unitario,
    //                 cantidad: detalleCompra.cantidad,
    //                 importe: detalleCompra.importe,
    //                 descuento: detalleCompra.descuento,
    //                 recargo: detalleCompra.recargo,
    //                 ice: detalleCompra.ice,
    //                 excento: detalleCompra.excento,
    //                 tipo_descuento: detalleCompra.tipo_descuento,
    //                 tipo_recargo: detalleCompra.tipo_recargo,
    //                 total: detalleCompra.total,
    //                 id_inventario: inventarioCreado.id
    //             }, { transaction: t }).then(function (detalleCompraCreada) {
    //                 return DetalleMovimiento.create({
    //                     id_movimiento: idMovimiento,
    //                     id_producto: idProducto,
    //                     costo_unitario: detalleCompra.costo_unitario,
    //                     cantidad: detalleCompra.cantidad,
    //                     importe: (detalleCompra.costo_unitario * detalleCompra.cantidad),
    //                     descuento: detalleCompra.descuento,
    //                     recargo: detalleCompra.recargo,
    //                     ice: detalleCompra.ice,
    //                     excento: detalleCompra.excento,
    //                     tipo_descuento: detalleCompra.tipo_descuento,
    //                     tipo_recargo: detalleCompra.tipo_recargo,
    //                     total: detalleCompra.total,
    //                     id_inventario: inventarioCreado.id
    //                 }, { transaction: t }).then(function (detalleMovimientoCreado) {
    //                     return new Promise(function (fulfill, reject) {
    //                         fulfill('Detalle movimiento Creado')
    //                     })
    //                 }).catch(function (err) {
    //                     return new Promise(function (fulfill, reject) {
    //                         reject((err.stack !== undefined) ? err.stack : err);
    //                     });
    //                 })
    //             }).catch(function (err) {
    //                 return new Promise(function (fulfill, reject) {
    //                     reject((err.stack !== undefined) ? err.stack : err);
    //                 });
    //             })
    //         }).catch(function (err) {
    //             return new Promise(function (fulfill, reject) {
    //                 reject((err.stack !== undefined) ? err.stack : err);
    //             });
    //         })
    //     }).catch(function (err) {
    //         return new Promise(function (fulfill, reject) {
    //             reject((err.stack !== undefined) ? err.stack : err);
    //         });
    //     })

    // }

    // function crearDetalleMovimientoIngresoYCrearInventario(idMovimiento, idAlmacen, idProducto,
    //     costo_unitario, cantidad, descuento,
    //     recargo, ice, excento,
    //     tipo_descuento, tipo_recargo,
    //     total, fecha_vencimiento, lote, traspaso, t) {
    //     return Inventario.create({
    //         id_almacen: idAlmacen,
    //         id_producto: idProducto,
    //         cantidad: cantidad,
    //         costo_unitario: costo_unitario,
    //         costo_total: total,
    //         fecha_vencimiento: fecha_vencimiento,
    //         lote: lote
    //     }, { transaction: t }).then(function (inventarioCreado) {
    //         return DetalleMovimiento.create({
    //             id_movimiento: idMovimiento,
    //             id_producto: idProducto,
    //             costo_unitario: costo_unitario,
    //             cantidad: cantidad,
    //             importe: (costo_unitario * cantidad),
    //             descuento: descuento,
    //             recargo: recargo,
    //             ice: ice,
    //             excento: excento,
    //             tipo_descuento: tipo_descuento,
    //             tipo_recargo: tipo_recargo,
    //             total: total,
    //             id_inventario: inventarioCreado.id
    //         }, { transaction: t }).then(function (detCreado) {
    //             return new Promise(function (fulfill, reject) {
    //                 fulfill(traspaso);
    //             });
    //         }).catch(function (err) {
    //             return new Promise(function (fulfill, reject) {
    //                 reject((err.stack !== undefined) ? err.stack : err);
    //             });
    //         })
    //     }).catch(function (err) {
    //         return new Promise(function (fulfill, reject) {
    //             reject((err.stack !== undefined) ? err.stack : err);
    //         });
    //     })
    // }
}