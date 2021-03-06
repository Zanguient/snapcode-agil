module.exports = function (router, forEach, decodeBase64Image, fs, Empresa, Producto, Proveedor, Cliente, Clase, Inventario, ComisionVendedorProducto,
	Usuario, DetalleVenta, DetalleMovimiento, Movimiento, Venta, Compra, DetalleCompra, Almacen, Sucursal, signs3, Tipo, VentaReprogramacionPago, UsuarioGrupos, ProductoBase, ProductoTipoPrecio) {

	router.route('/productos/empresa/:id_empresa/texto/:texto')
		.get(function (req, res) {
			Producto.findAll({
				where: {
					id_empresa: req.params.id_empresa,
					$or: [{ nombre: { $like: '%' + req.params.texto + '%' } },
					{ codigo: { $like: '%' + req.params.texto + '%' } },
					{ codigo_fabrica: { $like: '%' + req.params.texto + '%' } },
					{ descripcion: { $like: '%' + req.params.texto + '%' } }]
				},
				include: [{ model: Clase, as: 'tipoProducto' }]
			}).then(function (productos) {
				res.json(productos);
			});
		});

	router.route('/productos/empresa/:id_empresa/texto/:texto/user/:id_usuario/almacen/:id_almacen')
		.get(function (req, res) {
			if (req.params.id_almacen === 0) {
				req.params.id_almacen = undefined
			}
			UsuarioGrupos.findAll({
				where: { id_usuario: req.params.id_usuario }
			}).then(function (grupos) {
				var gurposUsuario = grupos.map(function (grupo) {
					return grupo.id_grupo
				})
				Producto.findAll({
					where: {
						id_empresa: req.params.id_empresa,
						id_grupo: { $in: gurposUsuario },
						$or: [{ nombre: { $like: '%' + req.params.texto + '%' } },
						{ codigo: { $like: '%' + req.params.texto + '%' } },
						{ codigo_fabrica: { $like: '%' + req.params.texto + '%' } },
						{ descripcion: { $like: '%' + req.params.texto + '%' } }]
					}
				}).then(function (pEncontrado) {
					if (pEncontrado.length > 0) {
						Producto.findAll({
							where: {
								id_empresa: req.params.id_empresa,
								id_grupo: { $in: gurposUsuario },
								$or: [{ nombre: { $like: '%' + req.params.texto + '%' } },
								{ codigo: { $like: '%' + req.params.texto + '%' } },
								{ codigo_fabrica: { $like: '%' + req.params.texto + '%' } },
								{ descripcion: { $like: '%' + req.params.texto + '%' } }]
							},
							include: [{ model: ProductoTipoPrecio, as: 'tiposPrecio',where:{eliminado:false}, required: false, include: [{ model: Clase, as: 'tipoPrecio' }] },
							{ model: Clase, as: 'tipoProducto' },
							{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
							{
								model: ProductoBase, as: 'productosBase', required: false,
								include: [{
									model: Producto, as: 'productoBase', required: false,
									include: [{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
									{ model: Clase, as: 'tipoProducto' },
									{
										model: ProductoBase, as: 'productosBase', required: false,
										include: [{
											model: Producto, as: 'productoBase', required: false,
											include: [{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
											{ model: Clase, as: 'tipoProducto' }]
										}]
									}]
								}]
							}
							]
						}).then(function (productos) {
							res.json(productos);
						});
					} else {
						Producto.findAll({
							where: {
								id_empresa: req.params.id_empresa,
								id_grupo: { $in: gurposUsuario },
							},
							include: [{ model: ProductoTipoPrecio, as: 'tiposPrecio',where:{eliminado:false}, required: false, include: [{ model: Clase, as: 'tipoPrecio' }] },
							{ model: Clase, as: 'tipoProducto' },
							{ model: Inventario, as: 'inventarios', where: { lote: { $like: '%' + req.params.texto + '%' }, id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
							{
								model: ProductoBase, as: 'productosBase', required: false,
								include: [{
									model: Producto, as: 'productoBase', required: false,
									include: [{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
									{ model: Clase, as: 'tipoProducto' },
									{
										model: ProductoBase, as: 'productosBase', required: false,
										include: [{
											model: Producto, as: 'productoBase', required: false,
											include: [{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
											{ model: Clase, as: 'tipoProducto' }]
										}]
									}]
								}]
							}
							]
						}).then(function (productos) {
							res.json(productos);
						});
					}
				})

			})
		});

	router.route('/inventarios-venta-edicion/producto/:id_producto/almacen/:id_almacen/fecha/:fecha')
		.get(function (req, res) {
			var inicio = new Date(2014, 1, 1)
			var fin = new Date(req.params.fecha); fin.setHours(23, 59, 59, 0, 0);

			Inventario.findAll({
				where: { id_producto: req.params.id_producto, id_almacen: req.params.id_almacen, cantidad: { $gt: 0 } },
				include: [{ model: DetalleCompra, as: 'detallesCompra', include: [{ model: Compra, as: 'compra' }] }, {
					model: DetalleMovimiento, as: "detallesMovimiento",
					include: [{
						model: Movimiento, as: 'movimiento', where: { fecha: { $between: [inicio, fin] } },
						include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: 'MOVING' } },
						{ model: Clase, as: 'clase' }]
					}]
				}],
				order: [['fecha_vencimiento', 'ASC']]
			}).then(function (inventarios) {
				res.json(inventarios);
			});
		});
	router.route('/inventarios/producto/:id_producto/almacen/:id_almacen/:lote?')
		.get(function (req, res) {
			if (req.params.lote) {
				Inventario.findAll({
					where: { id_producto: req.params.id_producto, id_almacen: req.params.id_almacen,lote:req.params.lote, cantidad: { $gt: 0 } },
					include: [{
						model: DetalleMovimiento, as: "detallesMovimiento",
						include: [{
							model: Movimiento, as: 'movimiento',
							include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: 'MOVING' } },
							{ model: Clase, as: 'clase' }]
						}]
					}],
					order: [['fecha_vencimiento', 'ASC']]
				}).then(function (inventarios) {
					res.json(inventarios);
				});
			} else {
				Inventario.findAll({
					where: { id_producto: req.params.id_producto, id_almacen: req.params.id_almacen, cantidad: { $gt: 0 } },
					include: [{
						model: DetalleMovimiento, as: "detallesMovimiento",
						include: [{
							model: Movimiento, as: 'movimiento',
							include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: 'MOVING' } },
							{ model: Clase, as: 'clase' }]
						}]
					}],
					order: [['fecha_vencimiento', 'ASC']]
				}).then(function (inventarios) {
					res.json(inventarios);
				});
			}
		});

	router.route('/ventas-no-despachadas/sucursal/:id_sucursal')
		.get(function (req, res) {
			Venta.findAll({
				where: { despachado: false },
				include: [{
					model: DetalleVenta, as: "detallesVenta",
					include: [{ model: Producto, as: "producto" }]
				},
				{ model: Almacen, as: 'almacen', where: { id_sucursal: req.params.id_sucursal } }],
				order: [['createdAt', 'ASC']]
			}).then(function (ventas) {
				res.json(ventas);
			});
		});

	router.route('/venta/:id_venta/despachar')
		.put(function (req, res) {
			Venta.update({
				despachado: true
			}, {
					where: { id: req.params.id_venta }
				}).then(function (ven) {
					res.json({ mensaje: 'Se despacho la venta!' });
				});
		});

}