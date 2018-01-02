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
                        fecha: new Date(parseInt(fecha[2]),parseInt(fecha[1])-1,parseInt(fecha[0])),
                        id_usuario: req.body.id_usuario,
                        activo: req.body.activo
                    }).then(function (solicitudCreada) {
                        req.body.solicitudesProductos.forEach(function (producto, index, array) {
                            DetalleSolicitudProducto.create({
                                id_solicitud: solicitudCreada.id,
                                id_producto: producto.producto.id,
                                cantidad: producto.cantidad
                            }).then(function (detalleCreado) {
                                producto.ingredientes.forEach(function (ingrediente, indx, arry) {
                                    DetalleSolicitudProductoBase.create({
                                        id_detalle_solicitud_producto: detalleCreado.id,
                                        id_producto_base: ingrediente.producto.id,
                                        cantidad_ideal: ingrediente.formulacion,
                                        cantidad_real: ingrediente.cantidad_real
                                    }).then(function (detalleBaseCreado) {
                                        if (index === array.length - 1) {
                                            if (indx === arry.length - 1) {
                                                res.json({ mensaje: 'Solicitud creada', solitudId: solicitudCreada.id })
                                            }
                                        }
                                    })
                                });
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