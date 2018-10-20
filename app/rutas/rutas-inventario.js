module.exports = function (router, ensureAuthorized, forEach, Compra, DetalleCompra, Almacen, Sucursal, Empresa, sequelize, Sequelize,
	Tipo, Clase, Proveedor, Producto, Movimiento, DetalleMovimiento, Inventario, Venta, DetalleVenta,
	Cliente, CodigoControl, NumeroLiteral, Diccionario, SucursalActividadDosificacion, Dosificacion,
	ConfiguracionGeneralFactura, ConfiguracionFactura, PagoVenta, PagoCompra, Usuario, DetalleVentaNoConsolidada, ClienteCuenta, ContabilidadCuenta, ProveedorCuenta, UsuarioGrupos, Pedido, DetallesPedido, ProductoBase, ServicioVenta, DetalleVentaProductoFinal, ClienteAnticipo, ProveedorAnticipo) {
	router.route('/compra/pedido/empresa/:id_empresa')
		.get(function (req, res) {
			Pedido.findAll({
				where: {
					eliminado: false,
					id_empresa: req.params.id_empresa,
					recibido: false,
					id_compra: null
				}, include: [{ model: Proveedor, as: 'proveedor' }, { model: Almacen, as: 'almacen' }, { model: Sucursal, as: 'sucursal' }, {
					model: DetallesPedido, as: 'detallesPedido', include: [{
						model: Producto, as: 'producto', include: [
							{ model: Clase, as: 'tipoProducto' }, {
								model: Inventario, as: 'inventarios', required: false, attributes: ['id', 'costo_unitario']
							}
						]
					}]
				}]
			}).then(function (Pedidos) {
				res.json({ pedidos: Pedidos });
			});
		});
	router.route('/inventarios/:id_empresa')
		.get(function (req, res) {
			Producto.findAll({
				include: [{
					model: Inventario, as: 'inventarios',
					include: [{
						model: Almacen, as: 'almacen',
						include: [{
							model: Sucursal, as: 'sucursal',
							include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
						}]
					}]
				}]
			}).then(function (productos) {
				res.json(productos);
			});
		});

	router.route('/obtenerDetalleVenta/empresa/:id_empresa')
		.get(function (req, res) {
			Venta.findAll({
				include: [{
					model: DetalleVenta, as: 'detallesVenta'
				},
				{
					model: Almacen, as: 'almacen',
					include: [
						{
							model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa }
						}]
				}
				]
			}).then(function (detalle) {
				res.json(detalle);
			}).catch(function (error) {
				res.json([{ mensaje: error.stack }]);
			})
		})

	router.route('/obtenerDetalleVenta/empresa/:id_empresa/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var inicio = (req.params.inicio + "T00:00:00.000Z");//.split('/').reverse().join('-'); //inicio.setHours(0, 0, 0, 0, 0);
			var fin = (req.params.fin + "T23:59:59.000Z");//.split('/').reverse().join('-'); //fin.setHours(23, 59, 59, 0, 0);
			var condicionCompra = { fecha: { $between: [inicio, fin] } };
			Venta.findAll({
				where: condicionCompra,
				include: [{
					model: DetalleVenta, as: 'detallesVenta'
				},
				{
					model: Cliente, as: 'cliente'
				},
				{
					model: Movimiento, as: 'movimiento'
				},
				{
					model: Almacen, as: 'almacen',
					include: [
						{
							model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa }
						}]
				}
				]
			}).then(function (detalle) {
				res.json(detalle);
			}).catch(function (error) {
				res.json([{ mensaje: error.stack }]);
			})
		})

	router.route('/inventario/:id')
		.put(function (req, res) {
			Inventario.update({
				cantidad: req.body.cantidad,
				costo_total: (req.body.cantidad * req.body.costo_unitario)
			}, {
					where: {
						id: req.params.id
					}
				}).then(function () {
					res.json({ message: "Inventario actualizado satisfactoriamente" });
				});

		});

	router.route('/ventasProductos/:idsSucursales/inicio/:inicio/fin/:fin/sucursal/:sucursal/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = req.params.inicio.split('/').reverse().join('-'); //inicio.setHours(0, 0, 0, 0, 0);
			var fin = req.params.fin.split('/').reverse().join('-'); //fin.setHours(23, 59, 59, 0, 0);
			condicionSucursal = { id: { $in: req.params.idsSucursales.split(',') } };
			condicionUsuario = {}, clienteRequerido = false;
			var busquedaQuery = (req.params.texto_busqueda === "0") ? "" : " AND p.nombre like '%" + req.params.texto_busqueda + "%'";

			if (req.params.sucursal != 0) {
				condicionSucursal.id = req.params.sucursal;
			}

			var limite = " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina
			if (req.params.items_pagina == "0") {
				limite = "";
			}
			sequelize.query("select count(p.id) as cantidad_productos \
		FROM\
			agil_producto AS p\
		INNER JOIN inv_detalle_venta AS d ON p.id = d.producto\
		INNER JOIN inv_venta AS v ON d.venta = v.id\
		INNER JOIN agil_almacen AS a ON v.almacen = a.id\
		INNER JOIN agil_sucursal AS s ON a.sucursal = s.id\
		WHERE\
		date(v.fecha) BETWEEN '"+ inicio + "' AND '" + fin + "'\
		AND s.id in ("+ req.params.idsSucursales.split(',') + ")\
		GROUP BY p.nombre",
				{ type: sequelize.QueryTypes.SELECT })
				.then(function (data) {
					sequelize.query("SELECT\
			p.id,p.nombre,\
			sum(d.cantidad) AS cantidad,p.unidad_medida,\
			sum(d.total) AS total, c.razon_social\
		FROM\
			agil_producto AS p\
		INNER JOIN inv_detalle_venta AS d ON p.id = d.producto\
		INNER JOIN inv_venta AS v ON d.venta = v.id\
		INNER JOIN agil_almacen AS a ON v.almacen = a.id\
		INNER JOIN agil_sucursal AS s ON a.sucursal = s.id\
		INNER JOIN agil_cliente AS  c ON v.cliente = c.id\
		WHERE\
		date(v.fecha) BETWEEN '"+ inicio + "' AND '" + fin + "'\
		AND s.id in ("+ req.params.idsSucursales.split(',') + ")" + busquedaQuery + "\
		AND v.activa = true \
		GROUP BY p.nombre\
		ORDER BY "+ req.params.columna + " " + req.params.direccion + " " + limite,
						{ type: sequelize.QueryTypes.SELECT })
						.then(function (Ventas) {
							res.json({ ventas: Ventas, paginas: Math.ceil(data.length / req.params.items_pagina) });
						});
				});
		});


	router.route("/ventasDetalleEmpresa/:idsSucursales/inicio/:inicio/fin/:fin/sucursal/:sucursal/idEmpresa/:idEmpresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion")
		.get(function (req, res) {
			var inicio = req.params.inicio.split('/').reverse().join('-'); //inicio.setHours(0, 0, 0, 0, 0);
			var fin = req.params.fin.split('/').reverse().join('-'); //fin.setHours(23, 59, 59, 0, 0);
			condicionSucursal = { id: { $in: req.params.idsSucursales.split(',') } };
			condicionUsuario = {}, clienteRequerido = false;
			var busquedaQuery = (req.params.texto_busqueda === "0") ? "" : " AND cli.razon_social like '%" + req.params.texto_busqueda + "%'";
			var sucursalQuery;

			if (req.params.sucursal == 0) {
				//condicionSucursal.id = req.params.sucursal;
				sucursalQuery = " AND s.id in (" + req.params.idsSucursales.split(',') + ")";
			} else {
				sucursalQuery = " AND s.id = " + req.params.sucursal;
			}

			var limite = " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina
			if (req.params.items_pagina == "0") {
				limite = "";
			}

			sequelize.query("SELECT COUNT(cli.razon_social) as cantidad_empresas FROM agil_cliente as cli INNER JOIN inv_venta as v on v.cliente = cli.id\
				INNER JOIN inv_detalle_venta as dv on dv.venta = v.id\
				INNER JOIN agil_almacen AS a ON v.almacen = a.id\
				INNER JOIN agil_sucursal AS s ON a.sucursal = s.id\
				WHERE date(v.fecha) BETWEEN '"+ inicio + "' AND '" + fin + "'AND v.activa = true " + sucursalQuery + "\
				AND s.empresa = "+ req.params.idEmpresa + "\
				GROUP BY \
				cli.razon_social",
				{ type: sequelize.QueryTypes.SELECT })
				.then(function (detalleCantidad) {
					//res.json(detalle);
					sequelize.query("SELECT cli.id, cli.razon_social, sum(dv.total) as total FROM agil_cliente as cli INNER JOIN inv_venta as v on v.cliente = cli.id\
								INNER JOIN inv_detalle_venta as dv on dv.venta = v.id\
								INNER JOIN agil_almacen AS a ON v.almacen = a.id\
								INNER JOIN agil_sucursal AS s ON a.sucursal = s.id\
								WHERE date(v.fecha) BETWEEN '"+ inicio + "' AND '" + fin + "'AND v.activa = true " + sucursalQuery + "\
								"+ busquedaQuery + " AND s.empresa = " + req.params.idEmpresa + "\
								GROUP BY \
								cli.razon_social \
								ORDER BY "+ req.params.columna + " " + req.params.direccion + " " + limite,
						{ type: sequelize.QueryTypes.SELECT })
						.then(function (detalle) {
							//res.json(detalle);
							res.json({ detalle: detalle, paginas: Math.ceil(detalleCantidad.length / req.params.items_pagina) });
						});

				});
		})


	router.route('/inventarios/empresa/:id_empresa/almacen/:id_almacen/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/cantidad/:cantidad/grupo/:id_grupo/user/:id_usuario')
		.get(function (req, res) {
			var condicionProducto = "empresa=" + req.params.id_empresa;
			var condicionCantidad = ""
			if (req.params.texto_busqueda != 0) {
				condicionProducto = condicionProducto + " and (codigo like '%" + req.params.texto_busqueda + "%' or agil_producto.nombre like '%" + req.params.texto_busqueda + "%' or unidad_medida like '%" + req.params.texto_busqueda + "%' or descripcion like '%" + req.params.texto_busqueda + "%' or gr.nombre like '%" + req.params.texto_busqueda + "%' or sgr.nombre like '%" + req.params.texto_busqueda + "%')";
			}
			if (req.params.cantidad != 0) {
				if (req.params.cantidad == 1) {
					condicionCantidad = " HAVING SUM(inv_inventario.cantidad) > 0 "
				} else {
					condicionCantidad = " HAVING SUM(inv_inventario.cantidad) < 0 "
				}
			}
			UsuarioGrupos.findAll({
				where: { id_usuario: req.params.id_usuario }
			}).then(function (grupos) {
				var condicionGrupo = ""
				if (grupos.length > 0) {
					var grupoLiteral = '('
					grupos.forEach(function (grupo, i) {
						if (i == grupos.length - 1) {
							grupoLiteral += grupo.id_grupo + ')'
						} else {
							grupoLiteral += grupo.id_grupo + ','
						}
					})
					if (req.params.id_grupo != "0") {
						condicionProducto += " and agil_producto.grupo =" + req.params.id_grupo
					}
					condicionProducto += " and agil_producto.grupo in " + grupoLiteral

					sequelize.query("select count(*) as cantidad_productos\
					from agil_producto\
					INNER JOIN gl_clase AS tipoProducto ON (agil_producto.tipo_producto = tipoProducto.id)\
					LEFT  JOIN gl_clase AS gr ON (agil_producto.grupo = gr.id)\
					LEFT  JOIN gl_clase AS sgr ON (agil_producto.subgrupo = sgr.id)\
					LEFT OUTER JOIN inv_inventario on agil_producto.id=inv_inventario.producto where "+ condicionProducto + " and almacen=" + req.params.id_almacen + " GROUP BY agil_producto.id " + condicionCantidad, { type: sequelize.QueryTypes.SELECT })
						.then(function (data) {
							var cantidad_productos = data.length
							var options = {
								model: Producto,
								include: [{ model: Clase, as: 'tipoProducto' }]
							};
							Sequelize.Model.$validateIncludedElements(options);
							sequelize.query("select tipoProducto.id as 'tipoProducto.id',tipoProducto.nombre as 'tipoProducto.nombre',tipoProducto.nombre_corto as 'tipoProducto.nombre_corto', agil_producto.id,agil_producto.activar_inventario,unidad_medida,descuento,descuento_fijo,precio_unitario,inventario_minimo,codigo,agil_producto.nombre,descripcion,sum(inv_inventario.cantidad) as cantidad,min(inv_inventario.fecha_vencimiento) as fecha_vencimiento,gr.nombre as grupo,sgr.nombre as subgrupo\
							from agil_producto\
							INNER JOIN gl_clase AS tipoProducto ON (agil_producto.tipo_producto = tipoProducto.id)\
							LEFT  JOIN gl_clase AS gr ON (agil_producto.grupo = gr.id)\
							LEFT  JOIN gl_clase AS sgr ON (agil_producto.subgrupo = sgr.id)\
							LEFT OUTER JOIN inv_inventario on agil_producto.id=inv_inventario.producto where "+ condicionProducto + " and almacen=" + req.params.id_almacen + " \
			                 GROUP BY agil_producto.id "+ condicionCantidad + " order by " + req.params.columna + " " + req.params.direccion + " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina, options)
								.then(function (productos) {
									res.json({ productos: productos, paginas: Math.ceil(cantidad_productos / req.params.items_pagina) });
								});
						});
				} else {
					res.json({ productos: [], mensaje: 'El usuario no cuenta con grupos de productos asignados.', paginas: 1 });
				}
			})
		});
	router.route('/detalle/:inicio/:fin/:idEmpresa/:id')
		.get(function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			var condicionCompra = { fecha: { $between: [inicio, fin] } };
			DetalleVenta.findAll({
				where: { id_producto: req.params.id },
				include: [{ model: Producto, as: 'producto', where: { id_empresa: req.params.idEmpresa } },
				{
					model: Venta, as: 'venta', where: condicionCompra, include: [{ model: Cliente, as: 'cliente' }]
				}]
			}).then(function (Detalle) {
				res.json(Detalle);

			});
		});

	router.route('/detalleEmpresa/:inicio/:fin/:idEmpresa/:id')
		.get(function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			var condicionCompra = { fecha: { $between: [inicio, fin] } };
			Producto.findAll({
				include: [{
					model: DetalleVenta, as: 'detallesVenta', include: [{ model: Venta, as: 'venta', where: condicionCompra, include: [{ model: Cliente, as: 'cliente', where: { id: req.params.id, id_empresa: req.params.idEmpresa } }] },
					]
				}]
			}).then(function (detalle) {
				res.json(detalle);
			})
		});


	router.route('/compras/:idsSucursales/inicio/:inicio/fin/:fin/razon-social/:razon_social/nit/:nit/monto/:monto/tipo-compra/:tipo_compra/sucursal/:sucursal/usuario/:usuario/user/:id_usuario/tipo/:tipo')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
			var condicionProveedor = {}, condicionCompra = { fecha: { $between: [inicio, fin] } },
				condicionSucursal = { id: { $in: req.params.idsSucursales.split(',') } },
				condicionUsuario = {};


			if (req.params.razon_social != 0) {
				condicionProveedor.razon_social = { $like: "%" + req.params.razon_social + "%" };
			}
			if (req.params.nit != 0) {
				condicionProveedor.nit = parseInt(req.params.nit);
			}
			if (req.params.monto != 0) {
				condicionCompra.total = parseFloat(req.params.monto);
			}
			if (req.params.tipo_compra != 0) {
				condicionCompra.id_tipo_pago = req.params.tipo_compra;
			}
			if (req.params.sucursal != 0) {
				condicionSucursal.id = req.params.sucursal;
			}
			if (req.params.usuario != 0) {
				condicionUsuario.nombre_usuario = { $like: "%" + req.params.usuario + "%" };
			}
			condicionCompra.usar_producto = true
			var compras = []
			Compra.findAll({
				where: condicionCompra,
				include: [{ model: PagoCompra, as: 'pagosCompra' },/* {model:Clase,as:'tipoMovimiento'},{ model: Sucursal, as: 'sucursal',where: condicionSucursal }, */ {
					model: Movimiento, as: 'movimiento',
					include: [{ model: Clase, as: 'clase', }]
				}, {
					model: DetalleCompra, as: 'detallesCompra',
					include: [{ model: Producto, as: 'producto' },
					{ model: Clase, as: 'centroCosto',/*,where:{nombre_corto:'ALM'}*/ }]
				},

				{ model: Clase, as: 'tipoPago', },
				{ model: Usuario, as: 'usuario', where: condicionUsuario },
				{ model: Proveedor, as: 'proveedor', where: condicionProveedor },
				{
					model: Almacen, as: 'almacen',
					include: [{
						model: Sucursal, as: 'sucursal',
						where: condicionSucursal
					}]
				}]
			}).then(function (entity) {
				Compra.findAll({
					where: condicionCompra,
					include: [{ model: PagoCompra, as: 'pagosCompra' }, {
						model: Movimiento, as: 'movimiento',
						include: [{ model: Clase, as: 'clase', }]
					},

					{ model: Clase, as: 'tipoPago', },
					{ model: Usuario, as: 'usuario', where: condicionUsuario },
					{ model: Proveedor, as: 'proveedor', where: condicionProveedor },
					{
						model: Sucursal, as: 'sucursal',
						where: condicionSucursal
					}]
				}).then(function (entity3) {

					condicionCompra.usar_producto = false
					Compra.findAll({
						where: condicionCompra,
						include: [{ model: Clase, as: 'tipoMovimiento' }, { model: Sucursal, as: 'sucursal', where: condicionSucursal }, {
							model: DetalleCompra, as: 'detallesCompra',
							include: [{ model: Clase, as: 'servicio' }
							]
						},
						{ model: Clase, as: 'tipoPago', },
						{ model: Usuario, as: 'usuario', where: condicionUsuario },
						{ model: Proveedor, as: 'proveedor', where: condicionProveedor },
						]
					}).then(function (entity2) {

						entity = entity.concat(entity3);
						compras = entity.concat(entity2);

						if (req.params.tipo == 'productos') {
							res.json(entity);
						} else if (req.params.tipo == 'servicios') {
							res.json(entity2);
						} else {
							compras = compras.sort(function (a, b) {
								return a.fecha - b.fecha;
							});
							res.json(compras);
						}
					});
				});
			});
		});

	router.route('/compras/:id')
		.get(function (req, res) {
			Compra.find({
				where: {
					id: req.params.id
				},
				include: [{ model: Clase, as: 'tipoMovimiento', required: false }, { model: Sucursal, as: 'sucursal', required: false }, {
					model: Movimiento, as: 'movimiento', required: false,
					include: [{ model: DetalleMovimiento, as: 'detallesMovimiento', required: false }, { model: Clase, as: 'clase' }]
				},
				{
					model: DetalleCompra, as: 'detallesCompra', required: false,
					include: [{ model: Producto, as: 'producto', required: false }, { model: Clase, as: 'servicio', required: false },
					{ model: Inventario, as: 'inventario', required: false },
					{ model: Clase, as: 'centroCosto'/*,where:{nombre_corto:'ALM'}*/, required: false }]
				},
				{ model: Clase, as: 'tipoPago', required: false },
				{ model: Proveedor, as: 'proveedor', required: false },
				{
					model: Almacen, as: 'almacen', required: false,
					include: [{ model: Sucursal, as: 'sucursal', required: false }]
				}]
			}).then(function (entity) {
				res.json(entity);
			});
		})

		.put(function (req, res) {
			if (req.body.saldoRestante == 0) {
				var anticipo = 0
			} else {
				var anticipo = req.body.saldoRestante * (-1);
			}
			var pagoV = req.body.pago - anticipo
			if (req.body.esModificacion) {
				var compra = req.body;
				if (req.body.usar_producto) {
					Compra.update({
						id_almacen: compra.almacen.id,
						id_proveedor: compra.proveedor.id,
						factura: compra.factura,
						autorizacion: compra.autorizacion,
						fecha: compra.fecha,
						codigo_control: compra.codigo_control,
						importe: compra.importe,
						id_tipo_pago: compra.id_tipo_pago,
						dias_credito: compra.dias_credito,
						a_cuenta: compra.a_cuenta,
						saldo: compra.saldo,
						descuento_general: compra.descuento_general,
						descuento: compra.descuento,
						recargo: compra.recargo,
						ice: compra.ice,
						excento: compra.excento,
						tipo_descuento: compra.tipo_descuento,
						tipo_recargo: compra.tipo_recargo,
						total: compra.total,
						usar_producto: compra.usar_producto,
						observacion: compra.observacion,
						dui: compra.dui,
						tipo_retencion: compra.tipo_retencion,
					}, {
							where: {
								id: compra.id
							}
						}).then(function (compraActualizada) {
							Movimiento.update({
								id_almacen: compra.almacen.id,
								fecha: compra.fecha,
							}, {
									where: {
										id: compra.movimiento.id
									}
								}).then(function (movimientoActualizado) {
									compra.detallesCompra.forEach(function (detalleCompra, index, array) {
										if (detalleCompra.id) {
											if (!detalleCompra.eliminado) {
												if (detalleCompra.centroCosto.nombre_corto == "ALM") {
													DetalleCompra.update({
														cantidad: detalleCompra.cantidad,
														costo_unitario: detalleCompra.costo_unitario,
														importe: detalleCompra.importe,
														total: detalleCompra.total,
													}, {
															where: {
																id: detalleCompra.id
															}
														}).then(function (detalleCompraActualizado) {

															DetalleMovimiento.find({
																where: {
																	id_inventario: detalleCompra.id_inventario,
																	id_movimiento: compra.movimiento.id,
																	id_producto: detalleCompra.producto.id
																}
															}).then(function (detalleMovimiento) {
																Inventario.find({
																	where: {
																		id: detalleCompra.id_inventario
																	}
																}).then(function (inventario) {
																	var diferencia = 0, cantidadInventario = inventario.cantidad;
																	if (detalleCompra.cantidad > detalleMovimiento.cantidad) {
																		diferencia = detalleCompra.cantidad - detalleMovimiento.cantidad;
																		cantidadInventario = cantidadInventario + diferencia;
																	} else if (detalleCompra.cantidad < detalleMovimiento.cantidad) {
																		diferencia = detalleMovimiento.cantidad - detalleCompra.cantidad;
																		cantidadInventario = cantidadInventario - diferencia;
																	}
																	Inventario.update({
																		cantidad: cantidadInventario,
																		costo_unitario: detalleCompra.costo_unitario,
																		costo_total: detalleCompra.costo_unitario * cantidadInventario,
																		fecha_vencimiento: (detalleCompra.inventario.fechaVencimientoTexto ? new Date(detalleCompra.inventario.fechaVencimientoTexto.split('/')[1] + "/" + detalleCompra.inventario.fechaVencimientoTexto.split('/')[0] + "/" + detalleCompra.inventario.fechaVencimientoTexto.split('/')[2]) : null),
																		lote: detalleCompra.inventario.lote
																	}, {
																			where: {
																				id: inventario.id
																			}
																		}).then(function (inventarioActualizado) {
																			DetalleMovimiento.update({
																				cantidad: detalleCompra.cantidad,
																				costo_unitario: detalleCompra.costo_unitario,
																				importe: detalleCompra.importe,
																				total: detalleCompra.total
																			}, {
																					where: {
																						id: detalleMovimiento.id
																					}
																				}).then(function (detalleMovimientoActualizado) {

																				});
																		});
																});
															});

														});
												} else {
													DetalleCompra.update({
														cantidad: detalleCompra.cantidad,
														costo_unitario: detalleCompra.costo_unitario,
														importe: detalleCompra.importe,
														total: detalleCompra.total,
													}, {
															where: {
																id: detalleCompra.id
															}
														}).then(function (detalleCompraActualizado) {

														})
												}
											} else {
												if (detalleCompra.centroCosto.nombre_corto == "ALM") {
													DetalleMovimiento.destroy({
														where: {
															id_inventario: detalleCompra.id_inventario,
															id_movimiento: compra.movimiento.id,
															id_producto: detalleCompra.producto ? detalleCompra.producto.id : null
														}
													}).then(function (detalleMovimientoEliminado) {
														DetalleCompra.destroy({
															where: {
																id: detalleCompra.id
															}
														}).then(function (detalleCompraEliminado) {
															Inventario.update(
																{
																	cantidad: 0
																}, {
																	where: {
																		id: detalleCompra.id_inventario
																	}
																}).then(function (inventarioEliminado) {

																});
														});
													});
												} else {
													DetalleCompra.destroy({
														where: {
															id: detalleCompra.id
														}
													}).then(function (detalleCompraEliminado) {
													})
												}
											}
										} else {
											if (detalleCompra.centroCosto.nombre_corto == "ALM") {
												crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id)
											} else {
												if (!detalleCompra.producto.id) {
													Producto.create({
														nombre: detalleCompra.producto.nombre,
														codigo: detalleCompra.producto.codigo,
														unidad_medida: detalleCompra.producto.unidad_medida,
														id_empresa: compra.id_empresa,
													}).then(function (productoCreado) {
														if (!detalleCompra.centroCosto.id) {
															Tipo.find({
																where: { nombre_corto: 'CCO' }
															}).then(function (tipoCentroCosto) {
																Clase.create({
																	nombre: detalleCompra.centroCosto.nombre,
																	id_tipo: tipoCentroCosto.id
																}).then(function (centroCostoCreado) {
																	crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, compra.almacen.id, productoCreado.id, detalleCompra.centroCosto.id, res, compra)
																});
															});
														} else {
															crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, compra.almacen.id, productoCreado.id, detalleCompra.centroCosto.id, res, compra)
														}
													});
												} else {
													if (!detalleCompra.centroCosto.id) {
														Tipo.find({
															where: { nombre_corto: 'CCO' }
														}).then(function (tipoCentroCosto) {
															Clase.create({
																nombre: detalleCompra.centroCosto.nombre,
																id_tipo: tipoCentroCosto.id
															}).then(function (centroCostoCreado) {
																crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra)
															});
														});
													} else {
														crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra)
													}
												}
											}
										}
										if (index == (array.length - 1)) {
											res.json({ mensaje: "Compra actualizada satisfactoriamente!" });
										}
									});
								});
						});
				} else {
					Compra.update({
						id_sucursal: compra.sucursal.id,
						id_tipo_movimiento: compra.movimiento.clase.id,
						id_proveedor: compra.proveedor.id,
						factura: compra.factura,
						autorizacion: compra.autorizacion,
						fecha: compra.fecha,
						codigo_control: compra.codigo_control,
						importe: compra.importe,
						id_tipo_pago: compra.id_tipo_pago,
						dias_credito: compra.dias_credito,
						a_cuenta: compra.a_cuenta,
						saldo: compra.saldo,
						descuento_general: compra.descuento_general,
						descuento: compra.descuento,
						recargo: compra.recargo,
						ice: compra.ice,
						excento: compra.excento,
						tipo_descuento: compra.tipo_descuento,
						tipo_recargo: compra.tipo_recargo,
						total: compra.total,
						id_usuario: compra.id_usuario,
						usar_producto: compra.usar_producto,
						observacion: compra.observacion,
						dui: compra.dui,
						tipo_retencion: compra.tipo_retencion,
					}, {
							where: {
								id: compra.id
							}
						}).then(function (compraActualizada) {

							compra.detallesCompra.forEach(function (detalleCompra, index, array) {
								if (detalleCompra.id) {
									if (!detalleCompra.eliminado) {
										DetalleCompra.update({
											cantidad: detalleCompra.cantidad,
											costo_unitario: detalleCompra.costo_unitario,
											importe: detalleCompra.importe,
											total: detalleCompra.total,
										}, {
												where: {
													id: detalleCompra.id
												}
											}).then(function (detalleCompraActualizado) {

											});
									} else {
										DetalleMovimiento.destroy({
											where: {
												id_inventario: detalleCompra.id_inventario,
												id_movimiento: compra.movimiento.id,
												id_producto: detalleCompra.producto.id
											}
										}).then(function (detalleMovimientoEliminado) {
											DetalleCompra.destroy({
												where: {
													id: detalleCompra.id
												}
											}).then(function (detalleCompraEliminado) {

											});
										});
									}
								} else {
									crearDetalleCompraServicio(detalleCompra, compra.id, res);
								}


								if (index == (array.length - 1)) {
									res.json({ mensaje: "Compra actualizada satisfactoriamente!" });
								}
							});

						});
				}
			} else {
				Compra.find({
					where: { id: req.params.id },
					include: [{
						model: Almacen, as: 'almacen',
						include: [{ model: Sucursal, as: 'sucursal' }]
					}]
				}).then(function (compraEncontrada) {
					Compra.update({
						a_cuenta: compraEncontrada.a_cuenta + pagoV,
						saldo: compraEncontrada.total - (compraEncontrada.a_cuenta + pagoV)
					}, {
							where: {
								id: compraEncontrada.id
							}
						}).then(function (affectedRows) {
							PagoCompra.create({
								id_compra: compraEncontrada.id,
								a_cuenta_anterior: compraEncontrada.a_cuenta,
								saldo_anterior: compraEncontrada.saldo,
								monto_pagado: pagoV,
								id_usuario: req.body.id_usuario_cajero,
								numero_documento: compraEncontrada.almacen.sucursal.nota_recibo_correlativo
							}).then(function (detalleVentaCreada) {
								Sucursal.update({
									nota_recibo_correlativo: compraEncontrada.almacen.sucursal.nota_recibo_correlativo + 1
								}, {
										where: {
											id: compraEncontrada.almacen.sucursal.id
										}
									}).then(function (affectedRows) {
										if (anticipo != 0) {
											Sucursal.find({
												where: { id: compraEncontrada.almacen.sucursal.id }
											}).then(function (sucursalEncontrada) {
												ProveedorAnticipo.create({
													id_proveedor: parseInt(compraEncontrada.id_proveedor),
													monto_anticipo: anticipo,
													fecha: req.body.fecha,
													monto_salida: 0,
													saldo: anticipo,
													id_sucursal: compraEncontrada.almacen.sucursal.id,
													numero_correlativo_anticipo: sucursalEncontrada.anticipo_proveedor_correlativo,
													eliminado: false
												}).then(function (ProvedorAnticipoCreado) {
													var correlativo = sucursalEncontrada.anticipo_proveedor_correlativo + 1
													Sucursal.update({
														anticipo_proveedor_correlativo: correlativo
													}, {
															where: { id: compraEncontrada.almacen.sucursal.id }
														}).then(function (Actualizado) {
															ProveedorAnticipo.find({
																where: { id: ProvedorAnticipoCreado.id },
																include: [{ model: Sucursal, as: 'sucursal' }, { model: Proveedor, as: 'proveedor' }]
															}).then(function (encontrado) {
																var pago = NumeroLiteral.Convertir(parseFloat(pagoV).toFixed(2).toString());
																res.json({ anticipo: encontrado, mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, compra: compraEncontrada });
															})

														})

												})
											})
										} else {
											var pago = NumeroLiteral.Convertir(parseFloat(pagoV).toFixed(2).toString());
											res.json({ anticipo: {}, mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, compra: compraEncontrada });
										}

									});
							});
						});
				});
			}
		});

	router.route('/comprasComprobante')
		.post(/*ensureAuthorized,*/function (req, res) {
			var compras = req.body;
			Tipo.find({
				where: { nombre_corto: 'MOVING' }
			}).then(function (tipoMovimiento) {
				Clase.find({
					where: { nombre_corto: 'ID' }
				}).then(function (conceptoMovimiento) {
					compras.forEach(function (compra, index, array) {
						Movimiento.create({
							id_tipo: tipoMovimiento.id,
							id_clase: conceptoMovimiento.id,
							fecha: compra.fecha
						}).then(function (movimientoCreado) {
							Proveedor.find({
								where: {
									nit: compra.nit
								}
							}).then(function (provedorEncontrado) {
								if (!provedorEncontrado) {
									Proveedor.create({
										id_empresa: compra.id_empresa,
										nit: compra.nit,
									}).then(function (proveedorCreado) {
										crearCompra(compra, res, proveedorCreado.id, movimientoCreado.id, conceptoMovimiento.id);
										if (index === (array.length - 1)) {
											res.json({ mensaje: "¡Comprobante creado satisfactoriamente!" });
										}

									});
								} else {
									crearCompra(compra, res, provedorEncontrado.id, movimientoCreado.id, conceptoMovimiento.id);
									if (index === (array.length - 1)) {
										res.json({ mensaje: "¡Comprobante creado satisfactoriamente!" });
									}
								}
							})

						});
					});
				});
			});
		});

	//lista de compras sin contabilizar
	router.route('/compras/empresa/:id_empresa')
		.get(function (req, res) {
			Compra.findAll({
				where: { contabilizado: false, usar_producto: true },

				include: [{
					model: DetalleCompra, as: 'detallesCompra',
					include: [{ model: Producto, as: 'producto' },
					{ model: Clase, as: 'centroCosto',/*,where:{nombre_corto:'ALM'}*/ }]
				}, { model: Movimiento, as: 'movimiento', include: [{ model: Clase, as: 'clase' }] }, { model: Proveedor, as: 'proveedor', include: [{ model: ProveedorCuenta, as: 'proveedorCuenta', include: [{ model: ContabilidadCuenta, as: 'cuenta', include: [{ model: Clase, as: 'tipoCuenta' }] }] }] },

				{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa } }] },

				]

			}).then(function (Compras) {
				Compra.findAll({
					where: { contabilizado: false, usar_producto: false },
					include: [{ model: Clase, as: 'tipoMovimiento' }, { model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa } }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }, { model: Proveedor, as: 'proveedor', include: [{ model: ProveedorCuenta, as: 'proveedorCuenta', include: [{ model: ContabilidadCuenta, as: 'cuenta', include: [{ model: Clase, as: 'tipoCuenta' }] }] }] }

					]
				}).then(function (Compras2) {
					var compras3 = Compras.concat(Compras2);
					compras3 = compras3.sort(function (a, b) {
						return a.fecha - b.fecha;
					});
					res.json({ compras: compras3 })
				})
			})
		})
	//lista de ventas sin contabilizar		
	router.route('/ventas/empresa/:id_empresa')
		.get(function (req, res) {
			Venta.findAll({
				where: { contabilizado: false },
				include: [{ model: Cliente, as: 'cliente', include: [{ model: ClienteCuenta, as: 'clienteCuenta', include: [{ model: ContabilidadCuenta, as: 'cuenta', include: [{ model: Clase, as: 'tipoCuenta' }] }] }] },
				{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa } }] }]
			}).then(function (Ventas) {
				res.json({ ventas: Ventas })
			})
		})


	router.route('/compras')
		.post(/*ensureAuthorized,*/function (req, res) {
			var compra = req.body;
			if (req.body.usar_producto) {
				Tipo.find({
					where: { nombre_corto: 'MOVING' }
				}).then(function (tipoMovimiento) {
					Clase.find({
						where: { nombre_corto: 'ID' }
					}).then(function (conceptoMovimiento) {
						if (compra.movimiento.clase.id) {
							conceptoMovimiento = compra.movimiento.clase
						}
						Movimiento.create({
							id_tipo: tipoMovimiento.id,
							id_clase: conceptoMovimiento.id,
							id_almacen: compra.almacen.id,
							fecha: compra.fecha
						}).then(function (movimientoCreado) {
							if (!compra.proveedor.id) {
								Proveedor.create({
									id_empresa: compra.id_empresa,
									nit: compra.proveedor.nit,
									razon_social: compra.proveedor.razon_social
								}).then(function (proveedorCreado) {
									crearCompra(compra, res, proveedorCreado.id, movimientoCreado.id, conceptoMovimiento.id);
									// if (compra.usar_peps) {
									// 	crearCompra(compra, res, proveedorCreado.id, movimientoCreado.id, conceptoMovimiento.id);
									// } else {
									// 	crearCompraPonderado(compra, res, proveedorCreado.id, movimientoCreado.id, conceptoMovimiento.id);
									// }
								});
							} else {
								crearCompra(compra, res, compra.proveedor.id, movimientoCreado.id, conceptoMovimiento.id);
								// if (compra.usar_peps) {
								// 	crearCompra(compra, res, proveedorCreado.id, movimientoCreado.id, conceptoMovimiento.id);
								// } else {
								// 	crearCompraPonderado(compra, res, proveedorCreado.id, movimientoCreado.id, conceptoMovimiento.id);
								// }
							}
						});
					});
				});
			} else {
				Tipo.find({
					where: { nombre_corto: 'MOVING' }
				}).then(function (tipoMovimiento) {
					Clase.find({
						where: { nombre_corto: 'ID' }
					}).then(function (conceptoMovimiento) {
						if (compra.movimiento.clase) {
							conceptoMovimiento = compra.movimiento.clase
						}
						if (!compra.proveedor.id) {
							Proveedor.create({
								id_empresa: compra.id_empresa,
								nit: compra.proveedor.nit,
								razon_social: compra.proveedor.razon_social
							}).then(function (proveedorCreado) {
								crearCompraServicio(compra, res, proveedorCreado.id, conceptoMovimiento.id)
							});
						} else {
							crearCompraServicio(compra, res, compra.proveedor.id, conceptoMovimiento.id)
						}
					})
				})
			}
		})
	function crearCompraServicio(compra, res, idProveedor, idtipo) {
		Compra.create({
			id_sucursal: compra.sucursal.id,
			id_tipo_movimiento: idtipo,
			id_proveedor: idProveedor,
			factura: compra.factura,
			autorizacion: compra.autorizacion,
			fecha: compra.fecha,
			codigo_control: compra.codigo_control,
			importe: compra.importe,
			id_tipo_pago: compra.id_tipo_pago,
			dias_credito: compra.dias_credito,
			a_cuenta: compra.a_cuenta,
			saldo: compra.saldo,
			descuento_general: compra.descuento_general,
			descuento: compra.descuento,
			recargo: compra.recargo,
			ice: compra.ice,
			excento: compra.excento,
			tipo_descuento: compra.tipo_descuento,
			tipo_recargo: compra.tipo_recargo,
			total: compra.total,
			id_usuario: compra.id_usuario,
			usar_producto: compra.usar_producto,
			observacion: compra.observacion,
			dui: compra.dui,
			tipo_retencion: compra.tipo_retencion,
		}).then(function (compraCreada) {
			compra.detallesCompra.forEach(function (detalleCompra, index, array) {
				crearDetalleCompraServicio(detalleCompra, compraCreada.id, res);
				if (index == (array.length - 1)) {
					compra.id = compraCreada.id;
					res.json({ compra: compra, mensaje: "creado satisfactoriamente!" });
				}
			})

		})
	}

	function crearDetalleCompraServicio(detalleCompra, idCompra, res) {
		DetalleCompra.create({
			id_compra: idCompra,
			costo_unitario: detalleCompra.costo_unitario,
			cantidad: detalleCompra.cantidad,
			importe: detalleCompra.importe,
			descuento: detalleCompra.descuento,
			recargo: detalleCompra.recargo,
			ice: detalleCompra.ice,
			excento: detalleCompra.excento,
			tipo_descuento: detalleCompra.tipo_descuento,
			tipo_recargo: detalleCompra.tipo_recargo,
			total: detalleCompra.total,
			it: detalleCompra.it,
			iue: detalleCompra.iue,
			id_servicio: detalleCompra.servicio.id
		}).then(function (detalleCompraCreada) {

		});


	}

	// function crearCompraPonderado(compra, res, idProveedor, idMovimiento, idTipo) {
	// 	Compra.create({
	// 		id_tipo_movimiento: idTipo,
	// 		id_almacen: compra.almacen.id,
	// 		id_proveedor: idProveedor,
	// 		id_movimiento: idMovimiento,
	// 		factura: compra.factura,
	// 		autorizacion: compra.autorizacion,
	// 		fecha: compra.fecha,
	// 		codigo_control: compra.codigo_control,
	// 		importe: compra.importe,
	// 		id_tipo_pago: compra.id_tipo_pago,
	// 		dias_credito: compra.dias_credito,
	// 		a_cuenta: compra.a_cuenta,
	// 		saldo: compra.saldo,
	// 		descuento_general: compra.descuento_general,
	// 		descuento: compra.descuento,
	// 		recargo: compra.recargo,
	// 		ice: compra.ice,
	// 		excento: compra.excento,
	// 		tipo_descuento: compra.tipo_descuento,
	// 		tipo_recargo: compra.tipo_recargo,
	// 		total: compra.total,
	// 		id_usuario: compra.id_usuario,
	// 		usar_producto: compra.usar_producto,
	// 		observacion: compra.observacion,
	// 		dui: compra.dui,
	// 		tipo_retencion: compra.tipo_retencion,
	// 	}).then(function (compraCreada) {
	// 		compra.detallesCompra.forEach(function (detalleCompra, index, array) {
	// 			if (!detalleCompra.producto.id) {
	// 				Producto.create({
	// 					nombre: detalleCompra.producto.nombre,
	// 					codigo: detalleCompra.producto.codigo,
	// 					unidad_medida: detalleCompra.producto.unidad_medida,
	// 					id_empresa: compra.id_empresa,
	// 				}).then(function (productoCreado) {
	// 					if (!detalleCompra.centroCosto.id) {
	// 						Tipo.find({
	// 							where: { nombre_corto: 'CCO' }
	// 						}).then(function (tipoCentroCosto) {
	// 							Clase.create({
	// 								nombre: detalleCompra.centroCosto.nombre,
	// 								id_tipo: tipoCentroCosto.id
	// 							}).then(function (centroCostoCreado) {
	// 								crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, productoCreado.id, centroCostoCreado.id, res, compra);
	// 							});
	// 						});
	// 					} else {
	// 						crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, productoCreado.id, detalleCompra.centroCosto.id, res, compra);
	// 					}
	// 				});
	// 			} else {
	// 				if (!detalleCompra.centroCosto.id) {
	// 					Tipo.find({
	// 						where: { nombre_corto: 'CCO' }
	// 					}).then(function (tipoCentroCosto) {
	// 						Clase.create({
	// 							nombre: detalleCompra.centroCosto.nombre,
	// 							id_tipo: tipoCentroCosto.id
	// 						}).then(function (centroCostoCreado) {
	// 							crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, centroCostoCreado.id, res, compra);
	// 						});
	// 					});
	// 				} else {
	// 					crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra);
	// 				}
	// 			}
	// 			if (index == (array.length - 1)) {
	// 				compra.id = compraCreada.id;
	// 				if (compra.generado_por_pedido) {
	// 					compra.pedido.detallesPedido.forEach(function (detalle, index, array) {
	// 						if (detalle.eliminado == true) {
	// 							DetallesPedido.update({
	// 								eliminado: true
	// 							}, {
	// 									where: { id: detalle.id }
	// 								})
	// 							if (index == (array.length - 1)) {
	// 								Pedido.update({
	// 									recibido: true,
	// 									id_compra: compra.id
	// 								}, {
	// 										where: { id: compra.pedido.id }
	// 									}).then(function (productoEntregado) {
	// 										res.json({ compra: compra, mensaje: "creado satisfactoriamente!" });
	// 									})
	// 							}
	// 						} else {
	// 							DetallesPedido.update({
	// 								recibido: true
	// 							}, {
	// 									where: { id: detalle.id }
	// 								})
	// 							if (index == (array.length - 1)) {
	// 								Pedido.update({
	// 									recibido: true
	// 								}, {
	// 										where: { id: compra.pedido.id }
	// 									}).then(function (productoEntregado) {
	// 										res.json({ compra: compra, mensaje: "creado satisfactoriamente!" });
	// 									})
	// 							}
	// 						}


	// 					})

	// 				} else {
	// 					res.json({ compra: compra, mensaje: "creado satisfactoriamente!" });
	// 				}
	// 			}
	// 		});
	// 	});
	// }
	function crearCompra(compra, res, idProveedor, idMovimiento, idTipo) {
		/* 	var almacenid=null;
			if(compra.almacen==undefined){
				almacenid =null;
			}else{
				almacenid=compra.almacen.id;
			} */
		Compra.create({
			id_tipo_movimiento: idTipo,
			id_almacen: compra.almacen.id,
			id_proveedor: idProveedor,
			id_movimiento: idMovimiento,
			factura: compra.factura,
			autorizacion: compra.autorizacion,
			fecha: compra.fecha,
			codigo_control: compra.codigo_control,
			importe: compra.importe,
			id_tipo_pago: compra.id_tipo_pago,
			dias_credito: compra.dias_credito,
			a_cuenta: compra.a_cuenta,
			saldo: compra.saldo,
			descuento_general: compra.descuento_general,
			descuento: compra.descuento,
			recargo: compra.recargo,
			ice: compra.ice,
			excento: compra.excento,
			tipo_descuento: compra.tipo_descuento,
			tipo_recargo: compra.tipo_recargo,
			total: compra.total,
			id_usuario: compra.id_usuario,
			usar_producto: compra.usar_producto,
			observacion: compra.observacion,
			dui: compra.dui,
			tipo_retencion: compra.tipo_retencion,
		}).then(function (compraCreada) {
			Empresa.find({
				where: { id: compra.id_empresa }
			}).then(function (empresaEncontrada) {
				compra.detallesCompra.forEach(function (detalleCompra, index, array) {
					if (!detalleCompra.producto.id) {
						Producto.create({
							nombre: detalleCompra.producto.nombre,
							codigo: detalleCompra.producto.codigo,
							unidad_medida: detalleCompra.producto.unidad_medida,
							id_empresa: compra.id_empresa,
						}).then(function (productoCreado) {
							if (!detalleCompra.centroCosto.id) {
								Tipo.find({
									where: { nombre_corto: 'CCO' }
								}).then(function (tipoCentroCosto) {
									Clase.create({
										nombre: detalleCompra.centroCosto.nombre,
										id_tipo: tipoCentroCosto.id
									}).then(function (centroCostoCreado) {
										if (empresaEncontrada.dataValues.usar_peps) {
											crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, productoCreado.id, centroCostoCreado.id, res, compra);
										} else {
											crearDetalleCompraPonderado(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, productoCreado.id, centroCostoCreado.id, res, compra);
										}

									});
								});
							} else {
								if (empresaEncontrada.dataValues.usar_peps) {
									crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, productoCreado.id, detalleCompra.centroCosto.id, res, compra);
								} else {
									crearDetalleCompraPonderado(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, productoCreado.id, detalleCompra.centroCosto.id, res, compra);
								}
							}
						});
					} else {
						if (!detalleCompra.centroCosto.id) {
							Tipo.find({
								where: { nombre_corto: 'CCO' }
							}).then(function (tipoCentroCosto) {
								Clase.create({
									nombre: detalleCompra.centroCosto.nombre,
									id_tipo: tipoCentroCosto.id
								}).then(function (centroCostoCreado) {
									/* 	if (empresaEncontrada.dataValues.usar_peps) { */
									crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, centroCostoCreado.id, res, compra);
									/* 	} else {
											crearDetalleCompraPonderado(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, centroCostoCreado.id, res, compra);
										} */
								});
							});
						} else {
							/* if (empresaEncontrada.dataValues.usar_peps) { */
							crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra);
							/* } else {
								crearDetalleCompraPonderado(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra);
							} */
						}
					}
					if (index == (array.length - 1)) {
						compra.id = compraCreada.id;
						if (compra.generado_por_pedido) {
							compra.pedido.detallesPedido.forEach(function (detalle, index, array) {
								if (detalle.eliminado == true) {
									DetallesPedido.update({
										eliminado: true
									}, {
											where: { id: detalle.id }
										})
									if (index == (array.length - 1)) {
										Pedido.update({
											recibido: true,
											id_compra: compra.id
										}, {
												where: { id: compra.pedido.id }
											}).then(function (productoEntregado) {
												res.json({ compra: compra, mensaje: "creado satisfactoriamente!" });
											})
									}
								} else {
									DetallesPedido.update({
										recibido: true
									}, {
											where: { id: detalle.id }
										})
									if (index == (array.length - 1)) {
										Pedido.update({
											recibido: true
										}, {
												where: { id: compra.pedido.id }
											}).then(function (productoEntregado) {
												res.json({ compra: compra, mensaje: "creado satisfactoriamente!" });
											})
									}
								}


							})

						} else {
							res.json({ compra: compra, mensaje: "creado satisfactoriamente!" });
						}
					}
				});
			})
		});
	}

	function crearDetalleCompraPonderado(detalleCompra, idMovimiento, idCompra, idAlmacen, idProducto, idCentroCosto, res, compra) {
		if (detalleCompra.centroCosto.nombre_corto == "ALM") {
			Inventario.findAll({
				where: { id_producto: idProducto, id_almacen: idAlmacen, cantidad: { $gt: 0 } }
			}).then(function (inventarios) {
				var costoUnitarioPonderado = 0
				var cantidadPonderado = 0
				if (inventarios.length > 0) {
					for (let i = 0; i < inventarios.length; i++) {
						costoUnitarioPonderado += inventarios[i].costo_unitario * inventarios[i].cantidad;
						cantidadPonderado += inventarios[i].cantidad;
					}
					costoUnitarioPonderado += detalleCompra.costo_unitario * detalleCompra.cantidad;
					cantidadPonderado += detalleCompra.cantidad;
					Inventario.create({
						id_almacen: idAlmacen,
						id_producto: idProducto,
						cantidad: detalleCompra.cantidad,
						costo_unitario: detalleCompra.costo_unitario,
						costo_total: detalleCompra.costo_unitario * detalleCompra.cantidad,
						fecha_vencimiento: detalleCompra.fecha_vencimiento,
						lote: detalleCompra.lote
					}).then(function (inventarioCreado) {
						DetalleCompra.create({
							id_compra: idCompra,
							id_producto: idProducto,
							id_centro_costo: idCentroCosto,
							costo_unitario: detalleCompra.costo_unitario,
							cantidad: detalleCompra.cantidad,
							importe: detalleCompra.importe,
							descuento: detalleCompra.descuento,
							recargo: detalleCompra.recargo,
							ice: detalleCompra.ice,
							excento: detalleCompra.excento,
							tipo_descuento: detalleCompra.tipo_descuento,
							tipo_recargo: detalleCompra.tipo_recargo,
							total: detalleCompra.total,
							id_inventario: inventarioCreado.id,
							it: detalleCompra.it,
							iue: detalleCompra.iue
						}).then(function (detalleCompraCreada) {
							DetalleMovimiento.create({
								id_movimiento: idMovimiento,
								id_producto: idProducto,
								costo_unitario: (costoUnitarioPonderado / cantidadPonderado),
								cantidad: detalleCompra.cantidad,
								importe: (detalleCompra.costo_unitario * detalleCompra.cantidad),
								descuento: detalleCompra.descuento,
								recargo: detalleCompra.recargo,
								ice: detalleCompra.ice,
								excento: detalleCompra.excento,
								tipo_descuento: detalleCompra.tipo_descuento,
								tipo_recargo: detalleCompra.tipo_recargo,
								total: detalleCompra.total,
								fecha_vencimiento: detalleCompra.fecha_vencimiento,
								lote: detalleCompra.lote,
								id_inventario: inventarioCreado.id
							}).then(function (detalleMovimientoCreado) {
								res.json({ mensaje: "creado satisfactoriamente" })
							});
						});
					});
				} else {
					Inventario.create({
						id_almacen: idAlmacen,
						id_producto: idProducto,
						cantidad: detalleCompra.cantidad,
						costo_unitario: detalleCompra.costo_unitario,
						costo_total: detalleCompra.costo_unitario * detalleCompra.cantidad,
						fecha_vencimiento: detalleCompra.fecha_vencimiento,
						lote: detalleCompra.lote
					}).then(function (inventarioCreado) {
						DetalleCompra.create({
							id_compra: idCompra,
							id_producto: idProducto,
							id_centro_costo: idCentroCosto,
							costo_unitario: detalleCompra.costo_unitario,
							cantidad: detalleCompra.cantidad,
							importe: detalleCompra.importe,
							descuento: detalleCompra.descuento,
							recargo: detalleCompra.recargo,
							ice: detalleCompra.ice,
							excento: detalleCompra.excento,
							tipo_descuento: detalleCompra.tipo_descuento,
							tipo_recargo: detalleCompra.tipo_recargo,
							total: detalleCompra.total,
							id_inventario: inventarioCreado.id,
							it: detalleCompra.it,
							iue: detalleCompra.iue
						}).then(function (detalleCompraCreada) {
							DetalleMovimiento.create({
								id_movimiento: idMovimiento,
								id_producto: idProducto,
								costo_unitario: detalleCompra.costo_unitario,
								cantidad: detalleCompra.cantidad,
								importe: (detalleCompra.costo_unitario * detalleCompra.cantidad),
								descuento: detalleCompra.descuento,
								recargo: detalleCompra.recargo,
								ice: detalleCompra.ice,
								excento: detalleCompra.excento,
								tipo_descuento: detalleCompra.tipo_descuento,
								tipo_recargo: detalleCompra.tipo_recargo,
								total: detalleCompra.total,
								fecha_vencimiento: detalleCompra.fecha_vencimiento,
								lote: detalleCompra.lote,
								id_inventario: inventarioCreado.id
							}).then(function (detalleMovimientoCreado) {
								res.json({ mensaje: "creado satisfactoriamente" })
							});
						});
					});
				}
			})
		} else {
			DetalleCompra.create({
				id_compra: idCompra,
				id_producto: idProducto,
				id_centro_costo: idCentroCosto,
				costo_unitario: detalleCompra.costo_unitario,
				cantidad: detalleCompra.cantidad,
				importe: detalleCompra.importe,
				descuento: detalleCompra.descuento,
				recargo: detalleCompra.recargo,
				ice: detalleCompra.ice,
				excento: detalleCompra.excento,
				tipo_descuento: detalleCompra.tipo_descuento,
				tipo_recargo: detalleCompra.tipo_recargo,
				total: detalleCompra.total,
				it: detalleCompra.it,
				iue: detalleCompra.iue
			}).then(function (detalleCompraCreada) {
				res.json({ mensaje: "creado satisfactoriamente" })
			});
		}
	}

	function crearDetalleCompra(detalleCompra, idMovimiento, idCompra, idAlmacen, idProducto, idCentroCosto, res, compra) {
		if (detalleCompra.centroCosto.nombre_corto == "ALM") {
			// Inventario.findAll({
			// 	where: {id_producto: idProducto, cantidad: {$gt: 0}}
			// })
			Inventario.create({
				id_almacen: idAlmacen,
				id_producto: idProducto,
				cantidad: detalleCompra.cantidad,
				costo_unitario: detalleCompra.costo_unitario,
				costo_total: detalleCompra.costo_unitario * detalleCompra.cantidad,
				fecha_vencimiento: detalleCompra.fecha_vencimiento,
				lote: detalleCompra.lote
			}).then(function (inventarioCreado) {
				DetalleCompra.create({
					id_compra: idCompra,
					id_producto: idProducto,
					id_centro_costo: idCentroCosto,
					costo_unitario: detalleCompra.costo_unitario,
					cantidad: detalleCompra.cantidad,
					importe: detalleCompra.importe,
					descuento: detalleCompra.descuento,
					recargo: detalleCompra.recargo,
					ice: detalleCompra.ice,
					excento: detalleCompra.excento,
					tipo_descuento: detalleCompra.tipo_descuento,
					tipo_recargo: detalleCompra.tipo_recargo,
					total: detalleCompra.total,
					id_inventario: inventarioCreado.id,
					it: detalleCompra.it,
					iue: detalleCompra.iue
				}).then(function (detalleCompraCreada) {
					DetalleMovimiento.create({
						id_movimiento: idMovimiento,
						id_producto: idProducto,
						costo_unitario: detalleCompra.costo_unitario,
						cantidad: detalleCompra.cantidad,
						importe: (detalleCompra.costo_unitario * detalleCompra.cantidad),
						descuento: detalleCompra.descuento,
						recargo: detalleCompra.recargo,
						ice: detalleCompra.ice,
						excento: detalleCompra.excento,
						tipo_descuento: detalleCompra.tipo_descuento,
						tipo_recargo: detalleCompra.tipo_recargo,
						total: detalleCompra.total,
						fecha_vencimiento: detalleCompra.fecha_vencimiento,
						lote: detalleCompra.lote,
						id_inventario: inventarioCreado.id
					}).then(function (detalleMovimientoCreado) {
						res.json({ mensaje: "creado satisfactoriamente" })
					});
				});
			});
		} else {
			DetalleCompra.create({
				id_compra: idCompra,
				id_producto: idProducto,
				id_centro_costo: idCentroCosto,
				costo_unitario: detalleCompra.costo_unitario,
				cantidad: detalleCompra.cantidad,
				importe: detalleCompra.importe,
				descuento: detalleCompra.descuento,
				recargo: detalleCompra.recargo,
				ice: detalleCompra.ice,
				excento: detalleCompra.excento,
				tipo_descuento: detalleCompra.tipo_descuento,
				tipo_recargo: detalleCompra.tipo_recargo,
				total: detalleCompra.total,
				it: detalleCompra.it,
				iue: detalleCompra.iue
			}).then(function (detalleCompraCreada) {
				res.json({ mensaje: "creado satisfactoriamente" })
			});
		}
	}

	function crearDetalleMovimientoIngresoYCrearInventario(idMovimiento, idAlmacen, idProducto,
		costo_unitario, cantidad, descuento,
		recargo, ice, excento,
		tipo_descuento, tipo_recargo,
		total, fecha_vencimiento, lote, traspaso, t) {
		return Inventario.create({
			id_almacen: idAlmacen,
			id_producto: idProducto,
			cantidad: cantidad,
			costo_unitario: costo_unitario,
			costo_total: total,
			fecha_vencimiento: fecha_vencimiento,
			lote: lote
		}, { transaction: t }).then(function (inventarioCreado) {
			return DetalleMovimiento.create({
				id_movimiento: idMovimiento,
				id_producto: idProducto,
				costo_unitario: costo_unitario,
				cantidad: cantidad,
				importe: (costo_unitario * cantidad),
				descuento: descuento,
				recargo: recargo,
				ice: ice,
				excento: excento,
				tipo_descuento: tipo_descuento,
				tipo_recargo: tipo_recargo,
				total: total,
				id_inventario: inventarioCreado.id
			}, { transaction: t }).then(function (detCreado) {
				return new Promise(function (fulfill, reject) {
					fulfill(traspaso);
				});
			});
		});
	}

	router.route('/inventarios')
		.post(function (req, res) {
			if (req.body.productos.length > 0) {
				Tipo.find({
					where: { nombre_corto: 'MOVING' }
				}).then(function (tipoMovimiento) {
					Clase.find({
						where: { nombre_corto: 'III' }
					}).then(function (conceptoMovimiento) {
						Movimiento.create({
							id_tipo: tipoMovimiento.id,
							id_clase: conceptoMovimiento.id,
							id_almacen: req.body.id_almacen,
							fecha: new Date()
						}).then(function (movimientoCreado) {
							var productos = req.body.productos;
							var mensajeRegistrados = "Los inventarios de los siguientes productos fueron registrados: "
							var lenregistrados = mensajeRegistrados.length
							var mensajeNoRegistrados = "Ocurrio un problema al registrar los inventarios de los siguientes productos: ";
							var lennoregistrados = mensajeNoRegistrados.length
							productos.forEach(function (producto, index, array) {
								Producto.find({
									where: {
										codigo: producto.codigo,
										id_empresa: req.body.id_empresa
									}
								}).then(function (productoEncontrado) {
									if (productoEncontrado) {
										Inventario.create({
											id_almacen: req.body.id_almacen,
											id_producto: productoEncontrado.id,
											cantidad: producto.cantidad,
											costo_unitario: producto.costo_unitario,
											fecha_vencimiento: producto.fecha_vencimiento,
											lote: producto.lote ? producto.lote.toString() : null,
											costo_total: (producto.cantidad * producto.costo_unitario)
										}).then(function (inventarioCreado) {
											DetalleMovimiento.create({
												id_movimiento: movimientoCreado.id,
												id_producto: productoEncontrado.id,
												costo_unitario: producto.costo_unitario,
												cantidad: producto.cantidad,
												importe: (producto.costo_unitario * producto.cantidad),
												descuento: 0,
												recargo: 0,
												ice: 0,
												excento: 0,
												tipo_descuento: 0,
												tipo_recargo: 0,
												total: (producto.costo_unitario * producto.cantidad),
												id_inventario: inventarioCreado.id
											}).then(function (detalleMovimientoCreado) {
												mensajeRegistrados = mensajeRegistrados + " " + producto.codigo;
												if (index == (array.length - 1)) {
													res.json({ message: lenregistrados < mensajeRegistrados.length && lennoregistrados == mensajeNoRegistrados.length ? mensajeRegistrados : lennoregistrados < mensajeNoRegistrados.length && lenregistrados == mensajeRegistrados.length ? mensajeNoRegistrados : mensajeRegistrados + "<|||>." + mensajeNoRegistrados });
												}
											});
										});
									} else {
										mensajeNoRegistrados = mensajeNoRegistrados + " " + producto.codigo;
									}

								});
							});
						});
					});
				});
			} else {
				res.json({ message: "Ningun Item se actualizo!" });
			}
		});

	function crearInventario() {
		return Inventario.create({
			id_almacen: req.body.id_almacen,
			id_producto: productoEncontrado.id,
			cantidad: producto.cantidad,
			costo_unitario: producto.costo_unitario,
			fecha_vencimiento: producto.fecha_vencimiento,
			lote: producto.lote ? producto.lote.toString() : null,
			costo_total: (producto.cantidad * producto.costo_unitario)
		}).then(function (inventarioCreado) {
			return DetalleMovimiento.create({
				id_movimiento: movimientoCreado.id,
				id_producto: productoEncontrado.id,
				costo_unitario: producto.costo_unitario,
				cantidad: producto.cantidad,
				importe: (producto.costo_unitario * producto.cantidad),
				descuento: 0,
				recargo: 0,
				ice: 0,
				excento: 0,
				tipo_descuento: 0,
				tipo_recargo: 0,
				total: (producto.costo_unitario * producto.cantidad),
				id_inventario: inventarioCreado.id
			}).then(function (detalleMovimientoCreado) {
				return new Promise(function (fulfill, reject) {
					fulfill('Inventario creado...')
				})
				// mensajeRegistrados = mensajeRegistrados + " " + producto.codigo;
			});
		});
	}

	function formatearFecha(fecha) {
		var mes = fecha.split('/')[1];
		var dia = fecha.split('/')[0];
		return fecha.split('/')[2] + mes + dia;
	}

	router.route('/ventasN')
		.post(function (req, res) {
			Tipo.find({
				where: { nombre_corto: Diccionario.MOV_EGRE },
				transaction: t
			}).then(function (tipoMovimiento) {
				sequelize.transaction(function (t) {
					return Movimiento.create({
						id_tipo: tipoMovimiento.dataValues.id,
						id_clase: req.body.movimiento.id,
						id_almacen: req.body.almacen.id,
						fecha: req.body.fecha
					}, { transaction: t }).then(function (movimientoCreado) {
						if (req.body.movimiento.nombre_corto === Diccionario.EGRE_FACTURACION) {
							return SucursalActividadDosificacion.find({
								where: {
									id_actividad: venta.actividad.id,
									id_sucursal: venta.sucursal.id,
									expirado: false
								}
							}).then(function (sucursalActividadDosificacion) {
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
									return crearVenta(venta, res, venta.cliente.id, movimientoCreado, dosificacion, true, sucursalActividadDosificacion.sucursal, t);
								}
							})
						}
						if (req.body.movimiento.nombre_corto === Diccionario.EGRE_PROFORMA) {

						}
						if (req.body.movimiento.nombre_corto === Diccionario.EGRE_BAJA) {

						}
						if (req.body.movimiento.nombre_corto === Diccionario.EGRE_TRASPASO) {

						}
					})
				}).then(function (result) {

				}).catch(function (err) {

				})
			})

		})
	function crearDetalleVentaServicio(ventaCreada, detalleVenta, index, array, res, venta, t, sucursal) {
		return ServicioVenta.find({
			where: {
				nombre: detalleVenta.servicio.nombre
			}
			, transaction: t
		}).then(function (servicioEncontrado) {

			venta.servicio = servicioEncontrado

			return DetalleVenta.create({
				id_venta: ventaCreada.id,
				id_servicio: detalleVenta.servicio.id,
				importe: detalleVenta.importe,
				descuento: detalleVenta.descuento,
				recargo: detalleVenta.recargo,
				ice: detalleVenta.ice,
				excento: detalleVenta.excento,
				tipo_descuento: detalleVenta.tipo_descuento,
				tipo_recargo: detalleVenta.tipo_recargo,
				total: detalleVenta.total,
				observaciones: detalleVenta.observaciones
			}, { transaction: t }).then(function (detalleVentaCreada) {
				return new Promise(function (fulfill, reject) {
					fulfill(venta);
				});
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			})
		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject(err);
			});
		})
	}
	function crearVentaServicio(venta, res, idCliente, dosificacion, esFactura, sucursal, t, id_movimiento) {
		return Venta.create({
			id_cliente: idCliente,
			factura: venta.factura,
			fecha: venta.fecha,
			importe: venta.importe,
			id_tipo_pago: venta.tipoPago.id,
			dias_credito: venta.dias_credito,
			a_cuenta: venta.a_cuenta,
			saldo: venta.saldo,
			total: venta.total,
			id_usuario: venta.id_usuario,
			pagado: venta.pagado,
			cambio: venta.cambio,
			id_vendedor: (venta.vendedor ? venta.vendedor.id : null),
			observacion: venta.observacion,
			id_tipo_movimiento: id_movimiento,
			id_sucursal: venta.sucursal.id,
			id_actividad: venta.actividad.id,
			autorizacion: venta.autorizacion,
			codigo_control: venta.codigo_control,
			fecha_limite_emision: venta.fecha_limite_emision
			/* pedido: venta.pedido, */
			//despachado: venta.despachado,

		}, { transaction: t }).then(function (ventaCreada) {
			return Dosificacion.update({
				correlativo: (venta.factura + 1)
			}, {
					where: { id: dosificacion.id },
					transaction: t
				}).then(function (dosificacionActualizada) {

					return ConfiguracionGeneralFactura.find({
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

						{ model: Clase, as: 'tamanoPapelFacturaServicio' },
						{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
						{ model: Clase, as: 'tamanoPapelNotaBaja' },
						{ model: Clase, as: 'tamanoPapelNotaPedido' },
						{ model: Clase, as: 'tamanoPapelCierreCaja' },
						{ model: Clase, as: 'formatoPapelFactura' },
						{ model: Clase, as: 'formatoColorFactura' },
						{ model: Clase, as: 'formatoPapelFacturaServicio' },
						{ model: Clase, as: 'formatoColorFacturaServicio' },
						{ model: Clase, as: 'tipoConfiguracion' },
						{ model: Clase, as: 'formatoPapelNotaVenta'},
						{ model: Clase, as: 'formatoColorNotaVenta'},
						{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
						{ model: Clase, as: 'formatoPapelNotaTraspaso'},
						{ model: Clase, as: 'formatoColorNotaTraspaso'}]
					}).then(function (configuracionGeneralFactura) {
						if (configuracionGeneralFactura.usar) {
							var promises = [];
							venta.configuracion = configuracionGeneralFactura;
							venta.detallesVenta.forEach(function (detalleVenta, index, array) {
								promises.push(crearDetalleVentaServicio(ventaCreada, detalleVenta, index, array, res, venta, t, sucursal));
							});
							return Promise.all(promises);
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

								{ model: Clase, as: 'tamanoPapelFacturaServicio' },
								{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
								{ model: Clase, as: 'tamanoPapelNotaBaja' },
								{ model: Clase, as: 'tamanoPapelNotaPedido' },
								{ model: Clase, as: 'tamanoPapelCierreCaja' },
								{ model: Clase, as: 'formatoPapelFactura' },
								{ model: Clase, as: 'formatoColorFactura' },
								{ model: Clase, as: 'formatoPapelFacturaServicio' },
								{ model: Clase, as: 'formatoColorFacturaServicio' },
								{ model: Clase, as: 'tipoConfiguracion' },
								{ model: Clase, as: 'formatoPapelNotaVenta'},
								{ model: Clase, as: 'formatoColorNotaVenta'},
								{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
								{ model: Clase, as: 'formatoPapelNotaTraspaso'},
								{ model: Clase, as: 'formatoColorNotaTraspaso'}]
							}).then(function (configuracionFactura) {
								var promises = [];
								venta.configuracion = configuracionFactura;
								venta.detallesVenta.forEach(function (detalleVenta, index, array) {
									promises.push(crearDetalleVentaServicio(ventaCreada, detalleVenta, index, array, res, venta, t, sucursal));
								});
								return Promise.all(promises);
							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							})
						}
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					})

				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				})

		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject(err);
			});
		})
	}
	router.route('/ventas')
		.post(function (req, res) {
			sequelize.transaction(function (t) {
				var movimiento = req.body.movimiento.nombre_corto;
				var id_movimiento = req.body.movimiento.id;
				var venta = req.body;
				var factura = {};
				factura.venta = venta;
				if (movimiento == Diccionario.EGRE_SERVICIO) {
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
						/* if (sucursalActividadDosificacion.sucursal.empresa.usar_pedidos) {
							venta.pedido = sucursalActividadDosificacion.sucursal.pedido_correlativo;
						} */
						if (!venta.cliente.id) {
							return Cliente.create({
								id_empresa: venta.id_empresa,
								nit: venta.cliente.nit,
								razon_social: venta.cliente.razon_social
							}, { transaction: t }).then(function (clienteCreado) {
								return crearVentaServicio(venta, res, clienteCreado.id, dosificacion, true, sucursalActividadDosificacion.sucursal, t, id_movimiento);
							});
						} else {
							return crearVentaServicio(venta, res, venta.cliente.id, dosificacion, true, sucursalActividadDosificacion.sucursal, t, id_movimiento);
						}
					})
				} else {

					return Tipo.find({
						where: { nombre_corto: Diccionario.MOV_EGRE },
						transaction: t
					}).then(function (tipoMovimiento) {
						return Movimiento.create({
							id_tipo: tipoMovimiento.id,
							id_clase: id_movimiento,
							id_almacen: venta.almacen.id,
							fecha: venta.fecha
						}, { transaction: t }).then(function (movimientoCreado) {
							//SI ES FACTURACION
							if (movimiento == Diccionario.EGRE_FACTURACION) {
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
										return crearVenta(venta, res, venta.cliente.id, movimientoCreado, dosificacion, true, sucursalActividadDosificacion.sucursal, t);
									}
								});
								//SI ES PROFORMA
							} else if (movimiento == Diccionario.EGRE_PROFORMA) {
								return Sucursal.find({
									where: {
										id: venta.sucursal.id
									},
									transaction: t,
									include: [{ model: Empresa, as: 'empresa' }]
								}).then(function (sucursal) {
									venta.factura = sucursal.nota_venta_correlativo;
									venta.numero_literal = NumeroLiteral.Convertir(parseFloat(venta.total).toFixed(2).toString());
									venta.actividad = { id: null };

									if (sucursal.empresa.usar_pedidos) {
										venta.pedido = sucursal.pedido_correlativo;
									}

									if (!venta.cliente.id) {
										return Cliente.create({
											id_empresa: venta.id_empresa,
											nit: venta.cliente.nit,
											razon_social: venta.cliente.razon_social
										}, { transaction: t }).then(function (clienteCreado) {
											return crearVenta(venta, res, clienteCreado.id, movimientoCreado, null, false, sucursal, t);
										});
									} else {
										return crearVenta(venta, res, venta.cliente.id, movimientoCreado, null, false, sucursal, t);
									}
								});
								//SI ES PREFACTURACION
							} else if (movimiento == Diccionario.EGRE_PRE_FACTURACION) {
								return Sucursal.find({
									where: {
										id: venta.sucursal.id
									},
									transaction: t,
									include: [{ model: Empresa, as: 'empresa' }]
								}).then(function (sucursal) {
									venta.factura = sucursal.pre_facturacion_correlativo;
									venta.numero_literal = NumeroLiteral.Convertir(parseFloat(venta.total).toFixed(2).toString());
									venta.actividad = { id: null };

									if (sucursal.empresa.usar_pedidos) {
										venta.pedido = sucursal.pedido_correlativo;
									}

									if (!venta.cliente.id) {
										return Cliente.create({
											id_empresa: venta.id_empresa,
											nit: venta.cliente.nit,
											razon_social: venta.cliente.razon_social
										}, { transaction: t }).then(function (clienteCreado) {
											return crearVenta(venta, res, clienteCreado.id, movimientoCreado, null, false, sucursal, t);
										});
									} else {
										return crearVenta(venta, res, venta.cliente.id, movimientoCreado, null, false, sucursal, t);
									}
								});
								//SI ES BAJA
							} else if (movimiento == Diccionario.EGRE_BAJA) {
								return Sucursal.find({
									where: {
										id: venta.sucursal.id
									},
									transaction: t,
									include: [{ model: Empresa, as: 'empresa' }]
								}).then(function (sucursal) {
									venta.factura = sucursal.nota_baja_correlativo;
									return Venta.create({
										id_almacen: venta.almacen.id,
										id_movimiento: movimientoCreado.id,
										fecha: venta.fecha,
										importe: (-venta.importe),
										total: (-venta.total),
										id_usuario: venta.id_usuario,
										activa: true,
										factura: venta.factura,
										observacion: venta.observacion
									}, { transaction: t }).then(function (ventaCreada) {
										return Sucursal.update({
											nota_baja_correlativo: (venta.factura + 1)
										}, {
												where: { id: venta.sucursal.id },
												transaction: t
											}).then(function (correlativoActualizada) {
												return ConfiguracionGeneralFactura.find({
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

													{ model: Clase, as: 'tamanoPapelFacturaServicio' },
													{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
													{ model: Clase, as: 'tamanoPapelNotaBaja' },
													{ model: Clase, as: 'tamanoPapelNotaPedido' },
													{ model: Clase, as: 'tamanoPapelCierreCaja' },
													{ model: Clase, as: 'formatoPapelFactura' },
													{ model: Clase, as: 'formatoColorFactura' },
													{ model: Clase, as: 'formatoPapelFacturaServicio' },
													{ model: Clase, as: 'formatoColorFacturaServicio' },
													{ model: Clase, as: 'tipoConfiguracion' },
													{ model: Clase, as: 'formatoPapelNotaVenta'},
													{ model: Clase, as: 'formatoColorNotaVenta'},
													{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
													{ model: Clase, as: 'formatoPapelNotaTraspaso'},
													{ model: Clase, as: 'formatoColorNotaTraspaso'}]
												}).then(function (configuracionGeneralFactura) {
													if (configuracionGeneralFactura.usar) {
														var promises = [];
														venta.configuracion = configuracionGeneralFactura;
														venta.detallesVenta.forEach(function (detalleVenta, index, array) {
															promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, -detalleVenta.precio_unitario, -detalleVenta.importe, -detalleVenta.total, index, array, res, venta, t, sucursal));
														});
														return Promise.all(promises);
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

															{ model: Clase, as: 'tamanoPapelFacturaServicio' },
															{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
															{ model: Clase, as: 'tamanoPapelNotaBaja' },
															{ model: Clase, as: 'tamanoPapelNotaPedido' },
															{ model: Clase, as: 'tamanoPapelCierreCaja' },
															{ model: Clase, as: 'formatoPapelFactura' },
															{ model: Clase, as: 'formatoColorFactura' },
															{ model: Clase, as: 'formatoPapelFacturaServicio' },
															{ model: Clase, as: 'formatoColorFacturaServicio' },
															{ model: Clase, as: 'tipoConfiguracion' },
															{ model: Clase, as: 'formatoPapelNotaVenta'},
															{ model: Clase, as: 'formatoColorNotaVenta'},
															{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
															{ model: Clase, as: 'formatoPapelNotaTraspaso'},
															{ model: Clase, as: 'formatoColorNotaTraspaso'}]
														}).then(function (configuracionFactura) {
															var promises = [];
															venta.configuracion = configuracionFactura;
															venta.detallesVenta.forEach(function (detalleVenta, index, array) {
																promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, -detalleVenta.precio_unitario, -detalleVenta.importe, -detalleVenta.total, index, array, res, venta, t, sucursal));
															});
															return Promise.all(promises);
														});
													}
												});
											});
									});
								});
								//SI ES TRASPASO A OTRA SUCURSAL
							} else if (movimiento == Diccionario.EGRE_TRASPASO) {
								return Sucursal.find({
									where: {
										id: venta.sucursal.id
									},
									transaction: t,
									include: [{ model: Empresa, as: 'empresa' }]
								}).then(function (sucursal) {
									venta.factura = sucursal.nota_traspaso_correlativo;
									return Venta.create({
										id_almacen: venta.almacen.id,
										id_movimiento: movimientoCreado.id,
										fecha: venta.fecha,
										importe: venta.importe,
										total: venta.total,
										id_usuario: venta.id_usuario,
										activa: true,
										id_almacen_traspaso: venta.almacenDestino.id,
										factura: venta.factura,
										observacion: venta.observacion
									}, { transaction: t }).then(function (ventaCreada) {
										return Sucursal.update({
											nota_traspaso_correlativo: (venta.factura + 1)
										}, {
												where: { id: venta.sucursal.id },
												transaction: t
											}).then(function (correlativoActualizada) {
												return Tipo.find({
													where: { nombre_corto: Diccionario.MOV_ING },
													transaction: t
												}).then(function (tipoMovimiento) {
													return Clase.find({
														where: { nombre_corto: Diccionario.ING_TRASPASO },
														transaction: t
													}).then(function (conceptoMovimiento) {
														return Movimiento.create({
															id_tipo: tipoMovimiento.id,
															id_clase: conceptoMovimiento.id,
															id_almacen: venta.almacenDestino.id,
															fecha: venta.fecha
														}, { transaction: t }).then(function (movimientoIngresoCreado) {
															return ConfiguracionGeneralFactura.find({
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

																{ model: Clase, as: 'tamanoPapelFacturaServicio' },
																{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
																{ model: Clase, as: 'tamanoPapelNotaBaja' },
																{ model: Clase, as: 'tamanoPapelNotaPedido' },
																{ model: Clase, as: 'tamanoPapelCierreCaja' },
																{ model: Clase, as: 'formatoPapelFactura' },
																{ model: Clase, as: 'formatoColorFactura' },
																{ model: Clase, as: 'formatoPapelFacturaServicio' },
																{ model: Clase, as: 'formatoColorFacturaServicio' },
																{ model: Clase, as: 'tipoConfiguracion' },
																{ model: Clase, as: 'formatoPapelNotaVenta'},
																{ model: Clase, as: 'formatoColorNotaVenta'},
																{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
																{ model: Clase, as: 'formatoPapelNotaTraspaso'},
																{ model: Clase, as: 'formatoColorNotaTraspaso'}]
															}).then(function (configuracionGeneralFactura) {
																if (configuracionGeneralFactura.usar) {
																	var promises = [];
																	venta.configuracion = configuracionGeneralFactura;
																	venta.detallesVenta.forEach(function (detalleVenta, index, array) {
																		promises.push(calcularCostosIngresos(detalleVenta, movimientoIngresoCreado, venta.almacenDestino.id, venta, t));
																		promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t, sucursal));
																	});
																	return Promise.all(promises);
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

																		{ model: Clase, as: 'tamanoPapelFacturaServicio' },
																		{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
																		{ model: Clase, as: 'tamanoPapelNotaBaja' },
																		{ model: Clase, as: 'tamanoPapelNotaPedido' },
																		{ model: Clase, as: 'tamanoPapelCierreCaja' },
																		{ model: Clase, as: 'formatoPapelFactura' },
																		{ model: Clase, as: 'formatoColorFactura' },
																		{ model: Clase, as: 'formatoPapelFacturaServicio' },
																		{ model: Clase, as: 'formatoColorFacturaServicio' },
																		{ model: Clase, as: 'tipoConfiguracion' },
																		{ model: Clase, as: 'formatoPapelNotaVenta'},
																		{ model: Clase, as: 'formatoColorNotaVenta'},
																		{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
																		{ model: Clase, as: 'formatoPapelNotaTraspaso'},
																		{ model: Clase, as: 'formatoColorNotaTraspaso'}]
																	}).then(function (configuracionFactura) {
																		var promises = [];
																		venta.configuracion = configuracionFactura;
																		venta.detallesVenta.forEach(function (detalleVenta, index, array) {
																			promises.push(calcularCostosIngresos(detalleVenta, movimientoIngresoCreado, venta.almacenDestino.id, venta, t));
																			promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t, sucursal));
																		});
																		return Promise.all(promises);
																	});
																}
															});
														});
													});
												});
											});
									});
								});
							} else if (movimiento == Diccionario.EGRE_AJUSTE) {

							}
						});
					});
				}
			}).then(function (result) {
				console.log(result);
				var resV = (result.length ? (result[0].length ? (result[0][0].length ? (result[0][0][0].length ? result[0][0][0][0] : result[0][0][0]) : result[0][0]) : result[0]) : result);
				res.json(resV);
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
			});
		});
	function ActualizarVenta(venta, res, idCliente, movimientoCreado, dosificacion, esFactura, sucursal, t, empresaEncontrada) {
		return Venta.update({
			importe: venta.importe,
			id_tipo_pago: venta.tipoPago.id,
			dias_credito: (venta.tipoPago.nombre_corto = Diccionario.TIPO_PAGO_CREDITO) ? venta.dias_credito : null,
			a_cuenta: (venta.tipoPago.nombre_corto = Diccionario.TIPO_PAGO_CREDITO) ? venta.a_cuenta : null,
			saldo: venta.saldo,
			total: venta.total,
			//id_usuario: venta.id_usuario,
			activa: true,
			pagado: venta.pagado,
			cambio: venta.cambio,
			pedido: venta.pedido,
			//despachado: venta.despachado,
			id_vendedor: (venta.vendedor ? venta.vendedor.id : null)
		}, { transaction: t, where: { id: venta.id } }).then(function (ventaActualizada) {
			var promisesVenta = [];
			promisesVenta.unshift(ConfiguracionGeneralFactura.find({
				where: {
					id_empresa: venta.id_empresa
				}, transaction: t,
				include: [{ model: Clase, as: 'impresionFactura' },
				{ model: Clase, as: 'tipoFacturacion' },
				{ model: Clase, as: 'tamanoPapelFactura' },
				{ model: Clase, as: 'tituloFactura' },
				{ model: Clase, as: 'subtituloFactura' },
				{ model: Clase, as: 'tamanoPapelNotaVenta' },

				{ model: Clase, as: 'tamanoPapelFacturaServicio' },
				{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
				{ model: Clase, as: 'tamanoPapelNotaBaja' },
				{ model: Clase, as: 'tamanoPapelNotaPedido' },
				{ model: Clase, as: 'tamanoPapelCierreCaja' },
				{ model: Clase, as: 'formatoPapelFactura' },
				{ model: Clase, as: 'formatoColorFactura' },
				{ model: Clase, as: 'formatoPapelFacturaServicio' },
				{ model: Clase, as: 'formatoColorFacturaServicio' },
				{ model: Clase, as: 'tipoConfiguracion' },
				{ model: Clase, as: 'formatoPapelNotaVenta'},
				{ model: Clase, as: 'formatoColorNotaVenta'},
				{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
				{ model: Clase, as: 'formatoPapelNotaTraspaso'},
				{ model: Clase, as: 'formatoColorNotaTraspaso'}]
			}).then(function (configuracionGeneralFactura) {

				if (configuracionGeneralFactura.usar) {
					var promises = [];
					venta.configuracion = configuracionGeneralFactura;
					venta.detallesVenta.forEach(function (detalleVenta, index, array) {
						promises.push(actualizarDetalleVenta(movimientoCreado, venta, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t, sucursal, empresaEncontrada));
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

						{ model: Clase, as: 'tamanoPapelFacturaServicio' },
						{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
						{ model: Clase, as: 'tamanoPapelNotaBaja' },
						{ model: Clase, as: 'tamanoPapelNotaPedido' },
						{ model: Clase, as: 'tamanoPapelCierreCaja' },
						{ model: Clase, as: 'formatoPapelFactura' },
						{ model: Clase, as: 'formatoColorFactura' },
						{ model: Clase, as: 'formatoPapelFacturaServicio' },
						{ model: Clase, as: 'formatoColorFacturaServicio' },
						{ model: Clase, as: 'tipoConfiguracion' },
						{ model: Clase, as: 'formatoPapelNotaVenta'},
						{ model: Clase, as: 'formatoColorNotaVenta'},
						{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
						{ model: Clase, as: 'formatoPapelNotaTraspaso'},
						{ model: Clase, as: 'formatoColorNotaTraspaso'}]
					}).then(function (configuracionFactura) {
						var promises = [];
						venta.configuracion = configuracionFactura;
						venta.detallesVenta.forEach(function (detalleVenta, index, array) {
							promises.push(actualizarDetalleVenta(movimientoCreado, venta, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t, sucursal, empresaEncontrada));
						});
						return Promise.all(promises)
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					});
				}
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			}));
			return Promise.all(promisesVenta);
		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject(err);
			});
		});
	}
	function actualizarDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, precio_unitario, importe, total, index, array, res, venta, t, sucursal, empresaEncontrada) {

		if (detalleVenta.eliminado) {
			return DetalleMovimiento.destroy({
				where: {
					id_inventario: detalleVenta.id_inventario,
					id_movimiento: venta.movimientoActual.id,
					id_producto: detalleVenta.producto ? detalleVenta.producto.id : null
				}, transaction: t
			}).then(function (detalleMovimientoEliminado) {
				return DetalleVenta.destroy({
					where: {
						id: detalleVenta.id
					}, transaction: t
				}).then(function (detalleCompraEliminado) {
					return Inventario.find({
						where: {
							id: detalleVenta.id_inventario
						}, transaction: t
					}).then(function (inventarioEncontrado) {
						inventarioEncontrado.cantidad += detalleVenta.cantidad
						return Inventario.update(
							{
								cantidad: inventarioEncontrado.cantidad
							}, {
								where: {
									id: detalleVenta.id_inventario
								}, transaction: t
							}).then(function (InventarioActualizado) {

							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							});
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					});
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			});
		} else if (detalleVenta.id) {
		} else {
			return DetalleVenta.create({
				id_venta: ventaCreada.id,
				id_producto: detalleVenta.producto.id,
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
				id_inventario: (detalleVenta.costos.length > 0) ? detalleVenta.costos[0].id : null
			}, { transaction: t }).then(function (detalleVentaCreada) {
				console.log("la sucursalllllll ============================================== ", sucursal);
				if (empresaEncontrada.dataValues.usar_peps) {
					if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
						return calcularCostosEgresos(detalleVenta, detalleVenta.producto, detalleVenta.cantidad, detalleVenta.costos,
							movimientoCreado, index, array, res, venta, t, detalleVentaCreada);
					} else if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
						var promises = [];
						for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
							if ((i + 1) == detalleVenta.producto.productosBase.length) {
								promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
									movimientoCreado, index, array, res, venta, t, detalleVentaCreada));
							} else {
								promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
									movimientoCreado, index - 1, array, res, venta, t, detalleVentaCreada));
							}
						}
						return Promise.all(promises);
					} else {
						var promises = [];
						for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
							if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
								if ((i + 1) == detalleVenta.producto.productosBase.length) {
									promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
										movimientoCreado, index, array, res, venta, t, detalleVentaCreada));
								} else {
									promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
										movimientoCreado, index - 1, array, res, venta, t, detalleVentaCreada));
								}
							} else if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
								var innerpromises = [];
								for (var j = 0; j < detalleVenta.producto.productosBase[i].productoBase.productosBase.length; j++) {
									if ((j + 1) == detalleVenta.producto.productosBase[i].productoBase.productosBase.length) {
										innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
											detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
											detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index, array, res, venta, t, detalleVentaCreada));
									} else {
										innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
											detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
											detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index - 1, array, res, venta, t, detalleVentaCreada));
									}
								}
								promises.push(Promise.all(innerpromises));
							}
						}
						return Promise.all(promises);
					}
				} else {
					if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
						return calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto, detalleVenta.cantidad, detalleVenta.costos,
							movimientoCreado, index, array, res, venta, t);
					} else if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
						var promises = [];
						for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
							if ((i + 1) == detalleVenta.producto.productosBase.length) {
								promises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
									movimientoCreado, index, array, res, venta, t));
							} else {
								promises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
									movimientoCreado, index - 1, array, res, venta, t));
							}
						}
						return Promise.all(promises);
					} else {
						var promises = [];
						for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
							if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
								if ((i + 1) == detalleVenta.producto.productosBase.length) {
									promises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
										movimientoCreado, index, array, res, venta, t));
								} else {
									promises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
										movimientoCreado, index - 1, array, res, venta, t));
								}
							} else if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
								var innerpromises = [];
								for (var j = 0; j < detalleVenta.producto.productosBase[i].productoBase.productosBase.length; j++) {
									if ((j + 1) == detalleVenta.producto.productosBase[i].productoBase.productosBase.length) {
										innerpromises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
											detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
											detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index, array, res, venta, t));
									} else {
										innerpromises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
											detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
											detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index - 1, array, res, venta, t));
									}
								}
								promises.push(Promise.all(innerpromises));
							}
						}
						return Promise.all(promises);
					}
				}
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			});
		}
	}
	function crearVenta(venta, res, idCliente, movimientoCreado, dosificacion, esFactura, sucursal, t) {
		return Venta.create({
			id_almacen: venta.almacen.id,
			id_cliente: idCliente,
			id_movimiento: movimientoCreado.id,
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
			observacion: venta.observacion,
			total_descuento: venta.total_descuento_general,
			total_ice: venta.total_ice,
			total_recargo : venta.total_recargo_general,
			total_exento : venta.total_exento
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

				{ model: Clase, as: 'tamanoPapelFacturaServicio' },
				{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
				{ model: Clase, as: 'tamanoPapelNotaBaja' },
				{ model: Clase, as: 'tamanoPapelNotaPedido' },
				{ model: Clase, as: 'tamanoPapelCierreCaja' },
				{ model: Clase, as: 'formatoPapelFactura' },
				{ model: Clase, as: 'formatoColorFactura' },
				{ model: Clase, as: 'formatoPapelFacturaServicio' },
				{ model: Clase, as: 'formatoColorFacturaServicio' },
				{ model: Clase, as: 'tipoConfiguracion' },
				{ model: Clase, as: 'formatoPapelNotaVenta'},
				{ model: Clase, as: 'formatoColorNotaVenta'},
				{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
				{ model: Clase, as: 'formatoPapelNotaTraspaso'},
				{ model: Clase, as: 'formatoColorNotaTraspaso'}]
			}).then(function (configuracionGeneralFactura) {
				venta.detallesVentaNoConsolidadas.forEach(function (detalleVentaNoConsolidada, index, array) {
					//crearDetalleVentaNoConsolidada(ventaCreada.id, detalleVentaNoConsolidada.producto.id, null, detalleVentaNoConsolidada);
				});
				if (configuracionGeneralFactura.usar) {
					var promises = [];
					venta.configuracion = configuracionGeneralFactura;
					venta.detallesVenta.forEach(function (detalleVenta, index, array) {
						promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t, sucursal));
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

						{ model: Clase, as: 'tamanoPapelFacturaServicio' },
						{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
						{ model: Clase, as: 'tamanoPapelNotaBaja' },
						{ model: Clase, as: 'tamanoPapelNotaPedido' },
						{ model: Clase, as: 'tamanoPapelCierreCaja' },
						{ model: Clase, as: 'formatoPapelFactura' },
						{ model: Clase, as: 'formatoColorFactura' },
						{ model: Clase, as: 'formatoPapelFacturaServicio' },
						{ model: Clase, as: 'formatoColorFacturaServicio' },
						{ model: Clase, as: 'tipoConfiguracion' },
						{ model: Clase, as: 'formatoPapelNotaVenta'},
						{ model: Clase, as: 'formatoColorNotaVenta'},
						{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
						{ model: Clase, as: 'formatoPapelNotaTraspaso'},
						{ model: Clase, as: 'formatoColorNotaTraspaso'}]
					}).then(function (configuracionFactura) {
						var promises = [];
						venta.configuracion = configuracionFactura;
						venta.detallesVenta.forEach(function (detalleVenta, index, array) {
							promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t, sucursal));
						});
						return Promise.all(promises)
					});
				}
			}));
			return Promise.all(promisesVenta);
		});
	}

	function calcularCostosIngresos(detalleVenta, movimientoCreado, idAlmacen, traspaso, t) {
		var cantidadTotal = detalleVenta.cantidad;
		var promises = [];
		for (var i = 0; i < detalleVenta.costos.length; i++) {
			if (cantidadTotal > 0) {
				var cantidadParcial;
				if (cantidadTotal > detalleVenta.costos[i].cantidad) {
					cantidadParcial = detalleVenta.costos[i].cantidad;
					cantidadTotal = cantidadTotal - detalleVenta.costos[i].cantidad
				} else {
					cantidadParcial = cantidadTotal;
					cantidadTotal = 0;
				}

				if (cantidadParcial > 0) {
					promises.push(crearDetalleMovimientoIngresoYCrearInventario(movimientoCreado.id, idAlmacen, detalleVenta.producto.id,
						detalleVenta.costos[i].costo_unitario, cantidadParcial, 0,
						0, 0, 0, 0, 0, detalleVenta.costos[i].costo_unitario * cantidadParcial,
						detalleVenta.costos[i].fecha_vencimiento, detalleVenta.costos[i].lote, traspaso, t));
				}
			}
		}
		return Promise.all(promises);
	}
	function calcularCostosIngresosPonderado(detalleVenta, movimientoCreado, idAlmacen, traspaso, t) {
		var cantidadTotal = detalleVenta.cantidad;
		var promises = [];
		for (var i = 0; i < detalleVenta.costos.length; i++) {
			if (cantidadTotal > 0) {
				var cantidadParcial;
				if (cantidadTotal > detalleVenta.costos[i].cantidad) {
					cantidadParcial = detalleVenta.costos[i].cantidad;
					cantidadTotal = cantidadTotal - detalleVenta.costos[i].cantidad
				} else {
					cantidadParcial = cantidadTotal;
					cantidadTotal = 0;
				}

				if (cantidadParcial > 0) {
					promises.push(crearDetalleMovimientoIngresoYCrearInventario(movimientoCreado.id, idAlmacen, detalleVenta.producto.id,
						detalleVenta.costos[i].costo_unitario, cantidadParcial, 0,
						0, 0, 0, 0, 0, detalleVenta.costos[i].costo_unitario * cantidadParcial,
						detalleVenta.costos[i].fecha_vencimiento, detalleVenta.costos[i].lote, traspaso, t));
				}
			}
		}
		return Promise.all(promises);
	}

	function crearMovimientoEgresoYActualizarInventario(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, costo, index, array, i, res, datosVenta, t, detalleVentaCreada) {
		return DetalleMovimiento.create({
			id_movimiento: movimientoCreado.id,
			id_producto: producto.id,
			cantidad: cantidadParcial,
			costo_unitario: costo.costo_unitario,
			importe: (cantidadParcial * costo.costo_unitario),
			total: (cantidadParcial * costo.costo_unitario),
			descuento: ((detalleVenta.descuento / cantidad) * cantidadParcial),
			recargo: ((detalleVenta.recargo / cantidad) * cantidadParcial),
			ice: ((detalleVenta.ice / cantidad) * cantidadParcial),
			excento: ((detalleVenta.excento / cantidad) * cantidadParcial),
			tipo_descuento: detalleVenta.tipo_descuento,
			tipo_recargo: detalleVenta.tipo_recargo,
			fecha_vencimiento: detalleVenta.fecha_vencimiento,
			lote: detalleVenta.lote,
			id_inventario: costo.id
		}, { transaction: t }).then(function (detalleMovimientoCreado) {
			return DetalleVentaProductoFinal.create({
				id_detalle_venta: detalleVentaCreada.id,
				id_detalle_movimiento: detalleMovimientoCreado.id
			},
				{ transaction: t }).then(function (creado) {
					sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED }, function (tu) {
						return Inventario.find({
							where: {
								id: costo.id
							},
							transaction: tu,
							lock: tu.LOCK.UPDATE
						}).then(function (inventario) {
							return Inventario.update({
								cantidad: inventario.cantidad - cantidadParcial,
								costo_total: ((inventario.cantidad - cantidadParcial) * costo.costo_unitario)
							}, {
									where: {
										id: inventario.id
									},
									transaction: tu
								}).then(function (result) {
									contador++
									return new Promise(function (fulfill, reject) {
										fulfill(datosVenta);
									});
								});
						});
					}).then(function (result) {
						return new Promise(function (fulfill, reject) {
							fulfill(datosVenta);
						});
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					});
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject(err);
			});
		});
	}
	function crearMovimientoEgresoYActualizarInventarioPonderado(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, costo, index, array, i, res, datosVenta, t) {

		return DetalleMovimiento.create({
			id_movimiento: movimientoCreado.id,
			id_producto: producto.id,
			cantidad: cantidadParcial,
			costo_unitario: costo.costo_unitario,
			importe: (cantidadParcial * costo.costo_unitario),
			total: (cantidadParcial * costo.costo_unitario),
			descuento: ((detalleVenta.descuento / cantidad) * cantidadParcial),
			recargo: ((detalleVenta.recargo / cantidad) * cantidadParcial),
			ice: ((detalleVenta.ice / cantidad) * cantidadParcial),
			excento: ((detalleVenta.excento / cantidad) * cantidadParcial),
			tipo_descuento: detalleVenta.tipo_descuento,
			tipo_recargo: detalleVenta.tipo_recargo,
			fecha_vencimiento: detalleVenta.fecha_vencimiento,
			lote: detalleVenta.lote,
			id_inventario: costo.id[costo.id.length - 1].id
		}, { transaction: t }).then(function (detalleMovimientoCreado) {
			// sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED }, function (tu) {
			var promisesPonderado = []
			if (costo.id.length > 0) {
				for (let l = 0; l < costo.id.length; l++) {
					promisesPonderado.push(actualizarInventario(costo.id[l], cantidadParcial, t))
				}
			}
			// return Promise.all(promisesPonderado)
			return new Promise(function (fulfill, reject) {
				fulfill(datosVenta);
			});
			// }).then(function (result) {
			// 	return new Promise(function (fulfill, reject) {
			// 		fulfill(datosVenta);
			// 	});
			// }).catch(function (err) {
			// 	return new Promise(function (fulfill, reject) {
			// 		reject(err);
			// 	});
			// });
		});
	}

	function actualizarInventario(costo_id, cantidadParcial) {
		Inventario.find({
			where: {
				id: costo_id.id
			}
		}).then(function (inventario) {
			Inventario.update({
				cantidad: inventario.cantidad - cantidadParcial,
				costo_total: ((inventario.cantidad - cantidadParcial) * inventario.costo_unitario)
			}, {
					where: {
						id: inventario.id
					}
				})
		});
	}

	function calcularCostosEgresosPonderado(detalleVenta, producto, cantidad, inventarios, movimientoCreado, index, array, res, venta, t) {
		var cantidadTotal = cantidad;
		var condicionInventario = {
			id_producto: producto.id, id_almacen: venta.almacen.id,
			cantidad: { $gt: 0 }
		}
		if (detalleVenta.lote) {
			condicionInventario.lote = detalleVenta.lote
		}
		if (detalleVenta.fecha_vencimiento) {
			var inicio = new Date(detalleVenta.fecha_vencimiento); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(detalleVenta.fecha_vencimiento); fin.setHours(23, 59, 59, 0, 0);

			condicionInventario.fecha_vencimiento = { $between: [inicio, fin] }
		}
		// if (inventarios.length == 0) {
		return Inventario.findAll({
			where: condicionInventario, transaction: t,
			order: [['id', 'asc']]

		}).then(function (encontrado) {
			return sequelize.query('select costo_unitario from inv_detalle_movimiento where producto = ' + producto.id + ' ORDER BY id DESC limit 1', { type: sequelize.QueryTypes.SELECT, transaction: t }).then(function (UltimoCostoUnitaro) {
				var inventariados = encontrado
				var cantidadE = 0
				var cantidadEParcial = 0
				var cantidadETotal = cantidad
				var costoUnitario = 0.0
				var ids = []
				if (producto.activar_inventario) {
					if (inventariados.length > 0) {
						var promises = [];
						for (var i = 0; i < inventariados.length; i++) {
							if (cantidadETotal > inventariados[i].cantidad) {
								cantidadE += inventariados[i].cantidad
								cantidadEParcial = cantidad - inventariados[i].cantidad
								cantidadETotal = cantidadEParcial
								ids.push({ id: inventariados[i].id, cantidad: inventariados[i].cantidad })
								costoUnitario += inventariados[i].cantidad * inventariados[i].costo_unitario
							} else {
								ids.push({ id: inventariados[i].id, cantidad: cantidadTotal })
								cantidadE = cantidadTotal
								costoUnitario += cantidadETotal * inventariados[i].costo_unitario
							}
						}
						var costoUnitarioPonderado = costoUnitario / cantidadE
						var costoPonderado = { id: ids, costo_unitario: UltimoCostoUnitaro[0].costo_unitario }

						if (cantidadTotal > 0) {
							var cantidadParcial;
							if (cantidadTotal > cantidad) {
								cantidadParcial = cantidad;
								cantidadTotal = cantidadTotal - cantidad
							} else {
								cantidadParcial = cantidadTotal;
								cantidadTotal = 0;
							}

							if (cantidadParcial > 0) {
								var rrr = crearMovimientoEgresoYActualizarInventarioPonderado(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, costoPonderado, index, array, i, res, venta, t);
								// promises.push(rrr)
								promises.push(new Promise(function (fulfill, reject) {
									fulfill(venta);
								}));
							}
						}
						return Promise.all(promises);
					} else {
						return new Promise(function (fulfill, reject) {
							fulfill(venta);
						});
					}
				} else {
					return new Promise(function (fulfill, reject) {
						fulfill(venta);
					});
				}
			})
		})
		// } else {
		// 	if (producto.activar_inventario) {
		// 		if (inventarios.length > 0) {
		// 			var promises = [];
		// 			for (var i = 0; i < inventarios.length; i++) {
		// 				if (cantidadTotal > 0) {
		// 					var cantidadParcial;
		// 					if (cantidadTotal > inventarios[i].cantidad) {
		// 						cantidadParcial = inventarios[i].cantidad;
		// 						cantidadTotal = cantidadTotal - inventarios[i].cantidad
		// 					} else {
		// 						cantidadParcial = cantidadTotal;
		// 						cantidadTotal = 0;
		// 					}

		// 					if (cantidadParcial > 0) {
		// 						var rrr = crearMovimientoEgresoYActualizarInventario(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, res, venta, t);
		// 						promises.push(new Promise(function (fulfill, reject) {
		// 							fulfill(venta);
		// 						}));
		// 					}
		// 				} 
		// 			}
		// 			return Promise.all(promises);
		// 		} else {
		// 			return new Promise(function (fulfill, reject) {
		// 				fulfill(venta);
		// 			});
		// 		}
		// 	} else {
		// 		return new Promise(function (fulfill, reject) {
		// 			fulfill(venta);
		// 		});
		// 	}
		// }
	}

	function calcularCostosEgresos(detalleVenta, producto, cantidad, inventarios, movimientoCreado, index, array, res, venta, t, detalleVentaCreada) {
		var cantidadTotal = cantidad;
		var condicionInventario = {
			id_producto: producto.id, id_almacen: venta.almacen.id,
			cantidad: { $gt: 0 }
		}
		if (detalleVenta.lote) {
			condicionInventario.lote = detalleVenta.lote
		}
		if (detalleVenta.fecha_vencimiento) {
			var inicio = new Date(detalleVenta.fecha_vencimiento); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(detalleVenta.fecha_vencimiento); fin.setHours(23, 59, 59, 0, 0);

			condicionInventario.fecha_vencimiento = { $between: [inicio, fin] }
		}
		if (inventarios.length == 0) {
			return Inventario.findAll({
				where: condicionInventario, transaction: t,
				order: [['id', 'asc']]
			}).then(function (encontrado) {
				inventarios = encontrado
				if (producto.activar_inventario) {
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
									var rrr = crearMovimientoEgresoYActualizarInventario(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, res, venta, t, detalleVentaCreada);
									//console.log(rrr);
									promises.push(new Promise(function (fulfill, reject) {
										fulfill(venta);
									}));
								} /*else {
							//if (index == (array.length - 1) && i == (inventarios.length - 1)) {
								//res.json(venta);
								promises.push(new Promise(function (fulfill, reject){
									fulfill(venta);
								}));
							//}
						}*/
							} else {
								//if (index == (array.length - 1) && i == (inventarios.length - 1)) {
								//res.json(venta);
								/*promises.push(new Promise(function (fulfill, reject){
									fulfill(venta);
								}));*/
								//}
							}
						}
						return Promise.all(promises);
					} else {
						//if (index == (array.length - 1)) {
						return new Promise(function (fulfill, reject) {
							fulfill(venta);
						});
						//}
					}
				} else {
					//if (index == (array.length - 1)) {
					return new Promise(function (fulfill, reject) {
						fulfill(venta);
					});
					//}
				}
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			})
		} else {
			if (producto.activar_inventario) {
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
								var rrr = crearMovimientoEgresoYActualizarInventario(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, res, venta, t, detalleVentaCreada);
								//console.log(rrr);
								promises.push(new Promise(function (fulfill, reject) {
									fulfill(venta);
								}));
							} /*else {
						//if (index == (array.length - 1) && i == (inventarios.length - 1)) {
							//res.json(venta);
							promises.push(new Promise(function (fulfill, reject){
								fulfill(venta);
							}));
						//}
					}*/
						} else {
							//if (index == (array.length - 1) && i == (inventarios.length - 1)) {
							//res.json(venta);
							/*promises.push(new Promise(function (fulfill, reject){
								fulfill(venta);
							}));*/
							//}
						}
					}
					return Promise.all(promises);
				} else {
					//if (index == (array.length - 1)) {
					return new Promise(function (fulfill, reject) {
						fulfill(venta);
					});
					//}
				}
			} else {
				//if (index == (array.length - 1)) {
				return new Promise(function (fulfill, reject) {
					fulfill(venta);
				});
				//}
			}
		}
	}

	function crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, precio_unitario, importe, total, index, array, res, venta, t, sucursal) {
		return DetalleVenta.create({
			id_venta: ventaCreada.id,
			id_producto: detalleVenta.producto.id,
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
			id_inventario: (detalleVenta.costos.length > 0) ? detalleVenta.costos[0].id : null
		}, { transaction: t }).then(function (detalleVentaCreada) {
			console.log("la sucursalllllll ============================================== ", sucursal);
			if (sucursal.empresa.dataValues.usar_peps) {
				if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
					return calcularCostosEgresos(detalleVenta, detalleVenta.producto, detalleVenta.cantidad, detalleVenta.costos,
						movimientoCreado, index, array, res, venta, t, detalleVentaCreada);
				} else if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
					var promises = [];
					for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
						if ((i + 1) == detalleVenta.producto.productosBase.length) {
							promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
								movimientoCreado, index, array, res, venta, t, detalleVentaCreada));
						} else {
							promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
								movimientoCreado, index - 1, array, res, venta, t, detalleVentaCreada));
						}
					}
					return Promise.all(promises);
				} else {
					var promises = [];
					for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
						if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
							if ((i + 1) == detalleVenta.producto.productosBase.length) {
								promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
									movimientoCreado, index, array, res, venta, t, detalleVentaCreada));
							} else {
								promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
									movimientoCreado, index - 1, array, res, venta, t, detalleVentaCreada));
							}
						} else if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
							var innerpromises = [];
							for (var j = 0; j < detalleVenta.producto.productosBase[i].productoBase.productosBase.length; j++) {
								if ((j + 1) == detalleVenta.producto.productosBase[i].productoBase.productosBase.length) {
									innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
										detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
										detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index, array, res, venta, t, detalleVentaCreada));
								} else {
									innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
										detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
										detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index - 1, array, res, venta, t, detalleVentaCreada));
								}
							}
							promises.push(Promise.all(innerpromises));
						}
					}
					return Promise.all(promises);
				}
			} else {
				if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
					return calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto, detalleVenta.cantidad, detalleVenta.costos,
						movimientoCreado, index, array, res, venta, t);
				} else if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
					var promises = [];
					for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
						if ((i + 1) == detalleVenta.producto.productosBase.length) {
							promises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
								movimientoCreado, index, array, res, venta, t));
						} else {
							promises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
								movimientoCreado, index - 1, array, res, venta, t));
						}
					}
					return Promise.all(promises);
				} else {
					var promises = [];
					for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
						if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
							if ((i + 1) == detalleVenta.producto.productosBase.length) {
								promises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
									movimientoCreado, index, array, res, venta, t));
							} else {
								promises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
									movimientoCreado, index - 1, array, res, venta, t));
							}
						} else if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
							var innerpromises = [];
							for (var j = 0; j < detalleVenta.producto.productosBase[i].productoBase.productosBase.length; j++) {
								if ((j + 1) == detalleVenta.producto.productosBase[i].productoBase.productosBase.length) {
									innerpromises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
										detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
										detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index, array, res, venta, t));
								} else {
									innerpromises.push(calcularCostosEgresosPonderado(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
										detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
										detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index - 1, array, res, venta, t));
								}
							}
							promises.push(Promise.all(innerpromises));
						}
					}
					return Promise.all(promises);
				}
			}
		});
	}

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

	router.route('/ventas/:id')
		.put(function (req, res) {
			sequelize.transaction(function (t) {
				var movimiento = req.body.movimiento.nombre_corto;
				var id_movimiento = req.body.movimiento.id;
				var venta = req.body;
				var factura = {};
				factura.venta = venta;

				return Empresa.find({
					where: { id: venta.id_empresa }
				}).then(function (empresaEncontrada) {
					//SI ES FACTURACION
					if (movimiento == Diccionario.EGRE_FACTURACION) {
						return ActualizarVenta(venta, res, venta.cliente.id, venta.movimientoActual, null, true, venta.sucursal, t, empresaEncontrada);
						//SI ES PROFORMA
					} else if (movimiento == Diccionario.EGRE_PROFORMA) {
						return ActualizarVenta(venta, res, venta.cliente.id, venta.movimientoActual, null, false, venta.sucursal, t, empresaEncontrada);
						//SI ES PREFACTURACION
					} else if (movimiento == Diccionario.EGRE_PRE_FACTURACION) {
						return ActualizarVenta(venta, res, venta.cliente.id, venta.movimientoActual, null, false, venta.sucursal, t, empresaEncontrada);
						//SI ES BAJA
					}
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
			}).then(function (result) {
				console.log(result);
				/* var resV = (result.length ? (result[0].length ? (result[0][0].length ? (result[0][0][0].length ? result[0][0][0][0] : result[0][0][0]) : result[0][0]) : result[0]) : result); */
				res.json({ mensaje: 'actualizado satisfactoriamente' });
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
			});
		})
		.post(function (req, res) {
			sequelize.transaction(function (t) {
				return Venta.update({
					activa: false
				}, {
						where: { id: req.params.id },
						transaction: t
					}).then(function (ven) {
						new Promise(function (fulfill, reject) {
							fulfill({});
						});
					})
			}).then(function (result) {
				res.json({ mensaje: 'Se anulo la venta!' });
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
			})
		})
		.delete(function (req, res) {
			sequelize.transaction(function (t) {
				return Movimiento.find({
					include: [{ model: Venta, as: "venta", where: { id: req.params.id } },
					{ model: DetalleMovimiento, as: "detallesMovimiento" }],
					transaction: t
				}).then(function (movimiento) {
					return Tipo.find({
						where: { nombre_corto: 'MOVING' },
						transaction: t
					}).then(function (tipoMovimiento) {
						return Clase.find({
							where: { nombre_corto: 'IPD' },
							transaction: t
						}).then(function (conceptoMovimiento) {
							return Movimiento.create({
								id_tipo: tipoMovimiento.id,
								id_clase: conceptoMovimiento.id,
								id_almacen: movimiento.id_almacen,
								fecha: new Date()
							}, { transaction: t }).then(function (movimientoCreado) {
								return Venta.update({
									activa: false
								}, {
										where: { id: req.params.id },
										transaction: t
									}).then(function (ven) {
										var promises = [];
										if (movimiento.detallesMovimiento.length > 0) {
											for (var i = 0; i < movimiento.detallesMovimiento.length; i++) {
												var rrr = crearDetalleMovimientoIngresoYActualizarInventario(movimientoCreado, movimiento.detallesMovimiento[i], t);
												promises.push(new Promise(function (fulfill, reject) {
													fulfill({});
												}));
											}
											return Promise.all(promises);
										} else {
											return new Promise(function (fulfill, reject) {
												fulfill({});
											});
										}
									});
							});
						});
					});
				})
			}).then(function (result) {
				res.json({ mensaje: 'Se anulo la venta!' });
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
			});
		});

	router.route('/venta-no-consolidada/:id')
		.put(function (req, res) {
			req.body.forEach(function (detalleVentaNoConsolidada, index, array) {
				crearDetalleVentaNoConsolidada(null, detalleVentaNoConsolidada.producto.id, detalleVentaNoConsolidada.id_cliente, detalleVentaNoConsolidada);
				if (array.length === (index + 1)) {
					res.json({ mensaje: 'Se registro los detalles de venta no consolidados!' });
				}
			});
		});

	router.route('/venta-no-consolidada')
		.post(function (req, res) {
			crearDetalleVentaNoConsolidada(null, null, req.body.id_cliente, req.body);
			res.json({ mensaje: 'Se registro la venta no consolidada!' });
		});

	function crearDetalleVentaNoConsolidada(idVenta, idProducto, idCliente, detalleVentaNoConsolidada) {
		DetalleVentaNoConsolidada.create({
			id_venta: idVenta,
			id_cliente: idCliente,
			id_producto: idProducto,
			precio_unitario: detalleVentaNoConsolidada.precio_unitario,
			cantidad: detalleVentaNoConsolidada.cantidad,
			importe: detalleVentaNoConsolidada.importe,
			fecha: detalleVentaNoConsolidada.fecha,
			descuento: detalleVentaNoConsolidada.descuento,
			recargo: detalleVentaNoConsolidada.recargo,
			ice: detalleVentaNoConsolidada.ice,
			excento: detalleVentaNoConsolidada.excento,
			tipo_descuento: detalleVentaNoConsolidada.tipo_descuento,
			tipo_recargo: detalleVentaNoConsolidada.tipo_recargo,
			total: detalleVentaNoConsolidada.total
		}).then(function (detalleVentaCreada) {

		});
	}

	router.route('/ventas/:idsSucursales/inicio/:inicio/fin/:fin/razon-social/:razon_social/nit/:nit/monto/:monto/tipo-venta/:tipo_venta/sucursal/:sucursal/transaccion/:transaccion/usuario/:usuario/estado/:estado')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
			var condicionCliente = {}, condicionVenta = { fecha: { $between: [inicio, fin] } },
				condicionSucursal = { id: { $in: req.params.idsSucursales.split(',') } }, condicionTransaccion = {},
				condicionUsuario = {}, clienteRequerido = false;
			if (req.params.razon_social != 0) {
				condicionCliente.razon_social = { $like: "%" + req.params.razon_social + "%" };
				clienteRequerido = true;
			}
			if (req.params.nit != 0) {
				condicionCliente.nit = parseInt(req.params.nit);
				clienteRequerido = true;
			}
			if (req.params.monto != 0) {
				condicionVenta.total = parseFloat(req.params.monto);
			}
			if (req.params.tipo_venta != 0) {
				condicionVenta.id_tipo_pago = req.params.tipo_venta;
			}
			if (req.params.sucursal != 0) {
				condicionSucursal.id = req.params.sucursal;
			}
			if (req.params.transaccion != 0) {
				condicionTransaccion.id = req.params.transaccion;
			}
			if (req.params.estado != 0) {
				condicionVenta.activa = (req.params.estado == "true") ? true : false;
			}
			if (req.params.usuario != 0) {
				condicionUsuario.nombre_usuario = { $like: "%" + req.params.usuario + "%" };
			}
			Venta.findAll({
				where: condicionVenta,
				include: [{
					model: DetalleVenta, as: 'detallesVenta',
					include: [{ model: DetalleVentaProductoFinal, as: 'detallesVentaProductoFinal', required: false, include: [{ model: DetalleMovimiento, as: 'detalleMovimiento' }] }, {
						model: Producto, as: 'producto', include: [
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
					}]
				},
				{ model: Clase, as: 'tipoPago' },
				{ model: Clase, as: 'actividad' },
				{ model: Usuario, as: 'usuario', where: condicionUsuario },
				{ model: Cliente, as: 'cliente', where: condicionCliente, required: clienteRequerido },
				{
					model: Movimiento, as: 'movimiento',
					include: [{ model: DetalleMovimiento, as: 'detallesMovimiento' }, { model: Clase, as: 'clase', where: condicionTransaccion }]
				},
				{
					model: Almacen, as: 'almacen',
					include: [{
						model: Sucursal, as: 'sucursal',
						where: condicionSucursal
					}]
				},
				{
					model: Almacen, as: 'almacenTraspaso',
					include: [{
						model: Sucursal, as: 'sucursal'
					}]
				}/* , {
					model: Sucursal, as: 'sucursal'
				}, {
					model: Clase, as: 'movimientoServicio'
				} */]
			}).then(function (entity) {
				Venta.findAll({
					where: condicionVenta,
					include: [{
						model: DetalleVenta, as: 'detallesVenta',
						include: [{ model: ServicioVenta, as: 'servicio' }]
					},
					{ model: Clase, as: 'tipoPago' },
					/* { model: Clase, as: 'actividad' }, */
					{ model: Usuario, as: 'usuario', where: condicionUsuario },
					{ model: Cliente, as: 'cliente', where: condicionCliente, required: clienteRequerido },
					{
						model: Sucursal, as: 'sucursal', where: condicionSucursal
					}, {
						model: Clase, as: 'movimientoServicio', where: condicionTransaccion
					}]
				}).then(function (entity2) {
					ventas = entity.concat(entity2);

					ventas = ventas.sort(function (a, b) {
						return b.factura - a.factura;
					});
					res.json(ventas);

				});
			});
		});

	router.route('/ventas/:id/empresa/:id_empresa')
		.get(function (req, res) {
			Sucursal.findAll({
				where: {
					id_empresa: req.params.id_empresa,
					numero: 0
				}
			}).then(function (sucursalPrincipalEncontrada) {
				Venta.find({
					where: {
						id: req.params.id
					},
					include: [{ model: Cliente, as: 'cliente' },
					{
						model: DetalleVenta, as: 'detallesVenta',
						include: [{ model: Producto, as: 'producto' }, { model: ServicioVenta, as: 'servicio' },
						{ model: Inventario, as: 'inventario' }]
					}, { model: Sucursal, as: 'sucursal' }, { model: Clase, as: 'movimientoServicio' },
					{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
					{ model: Almacen, as: 'almacenTraspaso', include: [{ model: Sucursal, as: 'sucursal' }], required: false },
					{ model: Clase, as: 'actividad' },
					{ model: Clase, as: 'tipoPago' },
					{ model: Movimiento, as: 'movimiento', include: [{ model: Clase, as: 'clase' }] }]
				}).then(function (venta) {
					if (venta.sucursal) {
						venta.numero_literal = NumeroLiteral.Convertir(parseFloat(venta.total).toFixed(2).toString());
					} else {
						venta.sucursal = venta.almacen.sucursal;
						if (venta.movimiento.clase.nombre_corto == Diccionario.EGRE_FACTURACION ||
							venta.movimiento.clase.nombre_corto == Diccionario.EGRE_PROFORMA) {
							venta.numero_literal = NumeroLiteral.Convertir(parseFloat(venta.total).toFixed(2).toString());
						}
					}
					ConfiguracionGeneralFactura.find({
						where: {
							id_empresa: req.params.id_empresa
						},
						include: [{ model: Clase, as: 'impresionFactura' },
						{ model: Clase, as: 'tipoFacturacion' },
						{ model: Clase, as: 'tamanoPapelFactura' },
						{ model: Clase, as: 'tituloFactura' },
						{ model: Clase, as: 'subtituloFactura' },
						{ model: Clase, as: 'pieFactura' },
						{ model: Clase, as: 'tamanoPapelNotaVenta' },

						{ model: Clase, as: 'tamanoPapelFacturaServicio' },
						{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
						{ model: Clase, as: 'tamanoPapelNotaBaja' },
						{ model: Clase, as: 'tamanoPapelNotaPedido' },
						{ model: Clase, as: 'tamanoPapelCierreCaja' },
						{ model: Clase, as: 'formatoPapelFactura' },
						{ model: Clase, as: 'formatoColorFactura' },
						{ model: Clase, as: 'formatoPapelFacturaServicio' },
						{ model: Clase, as: 'formatoColorFacturaServicio' },
						{ model: Clase, as: 'tipoConfiguracion' },
						{ model: Clase, as: 'formatoPapelNotaVenta'},
						{ model: Clase, as: 'formatoColorNotaVenta'},
						{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
						{ model: Clase, as: 'formatoPapelNotaTraspaso'},
						{ model: Clase, as: 'formatoColorNotaTraspaso'}]
					}).then(function (configuracionGeneralFactura) {
						if (venta.movimiento) {
							if (venta.movimiento.clase.nombre_corto == Diccionario.EGRE_FACTURACION) {
								SucursalActividadDosificacion.find({
									where: {
										id_actividad: venta.actividad.id,
										id_sucursal: venta.sucursal.id,
										expirado: false
									},
									include: [{ model: Dosificacion, as: 'dosificacion', include: [{ model: Clase, as: 'pieFactura' }] }]
								}).then(function (sucursalActividadDosificacion) {
									var dosificacion = sucursalActividadDosificacion.dosificacion;
									if (configuracionGeneralFactura.usar) {
										res.json({
											sucursalPrincipal: sucursalPrincipalEncontrada, venta: venta, configuracion: configuracionGeneralFactura, sucursal: venta.sucursal,
											numero_literal: venta.numero_literal, pieFactura: dosificacion.pieFactura, sucursalDestino: ((venta.almacenTraspaso) ? venta.almacenTraspaso.sucursal : null)
										});
									} else {
										ConfiguracionFactura.find({
											where: {
												id_sucursal: venta.sucursal.id
											},
											include: [{ model: Clase, as: 'impresionFactura' },
											{ model: Clase, as: 'tipoFacturacion' },
											{ model: Clase, as: 'tamanoPapelFactura' },
											{ model: Clase, as: 'tituloFactura' },
											{ model: Clase, as: 'subtituloFactura' },
											{ model: Clase, as: 'tamanoPapelNotaVenta' },

											{ model: Clase, as: 'tamanoPapelFacturaServicio' },
											{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
											{ model: Clase, as: 'tamanoPapelNotaBaja' },
											{ model: Clase, as: 'tamanoPapelNotaPedido' },
											{ model: Clase, as: 'tamanoPapelCierreCaja' },
											{ model: Clase, as: 'formatoPapelFactura' },
											{ model: Clase, as: 'formatoColorFactura' },
											{ model: Clase, as: 'formatoPapelFacturaServicio' },
											{ model: Clase, as: 'formatoColorFacturaServicio' },
											{ model: Clase, as: 'tipoConfiguracion' },
											{ model: Clase, as: 'formatoPapelNotaVenta'},
											{ model: Clase, as: 'formatoColorNotaVenta'},
											{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
											{ model: Clase, as: 'formatoPapelNotaTraspaso'},
											{ model: Clase, as: 'formatoColorNotaTraspaso'}]
										}).then(function (configuracionFactura) {
											res.json({
												sucursalPrincipal: sucursalPrincipalEncontrada,
												venta: venta,
												configuracion: configuracionFactura,
												sucursal: venta.sucursal,
												numero_literal: venta.numero_literal,
												pieFactura: dosificacion.pieFactura, sucursalDestino: ((venta.almacenTraspaso) ? venta.almacenTraspaso.sucursal : null)
											});
										});
									}
								});
							} else {
								if (configuracionGeneralFactura.usar) {
									res.json({
										sucursalPrincipal: sucursalPrincipalEncontrada,
										venta: venta, configuracion: configuracionGeneralFactura, sucursal: venta.sucursal,
										numero_literal: venta.numero_literal, sucursalDestino: ((venta.almacenTraspaso) ? venta.almacenTraspaso.sucursal : null)
									});
								} else {
									ConfiguracionFactura.find({
										where: {
											id_sucursal: venta.sucursal.id
										},
										include: [{ model: Clase, as: 'impresionFactura' },
										{ model: Clase, as: 'tipoFacturacion' },
										{ model: Clase, as: 'tamanoPapelFactura' },
										{ model: Clase, as: 'tituloFactura' },
										{ model: Clase, as: 'subtituloFactura' },
										{ model: Clase, as: 'tamanoPapelNotaVenta' }]
									}).then(function (configuracionFactura) {
										res.json({
											sucursalPrincipal: sucursalPrincipalEncontrada,
											venta: venta,
											configuracion: configuracionFactura,
											sucursal: venta.sucursal,
											numero_literal: venta.numero_literal, sucursalDestino: ((venta.almacenTraspaso) ? venta.almacenTraspaso.sucursal : null)
										});
									});
								}
							}
						} else {
							SucursalActividadDosificacion.find({
								where: {
									id_actividad: venta.actividad.id,
									id_sucursal: venta.sucursal.id,
									expirado: false
								},
								include: [{ model: Dosificacion, as: 'dosificacion', include: [{ model: Clase, as: 'pieFactura' }] }]
							}).then(function (sucursalActividadDosificacion) {
								var dosificacion = sucursalActividadDosificacion.dosificacion;
								if (configuracionGeneralFactura.usar) {
									res.json({
										sucursalPrincipal: sucursalPrincipalEncontrada,
										venta: venta, configuracion: configuracionGeneralFactura, sucursal: venta.sucursal,
										numero_literal: venta.numero_literal, pieFactura: dosificacion.pieFactura, sucursalDestino: ((venta.almacenTraspaso) ? venta.almacenTraspaso.sucursal : null)
									});
								} else {
									ConfiguracionFactura.find({
										where: {
											id_sucursal: venta.sucursal.id
										},
										include: [{ model: Clase, as: 'impresionFactura' },
										{ model: Clase, as: 'tipoFacturacion' },
										{ model: Clase, as: 'tamanoPapelFactura' },
										{ model: Clase, as: 'tituloFactura' },
										{ model: Clase, as: 'subtituloFactura' },
										{ model: Clase, as: 'tamanoPapelNotaVenta' },

										{ model: Clase, as: 'tamanoPapelFacturaServicio' },
										{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
										{ model: Clase, as: 'tamanoPapelNotaBaja' },
										{ model: Clase, as: 'tamanoPapelNotaPedido' },
										{ model: Clase, as: 'tamanoPapelCierreCaja' },
										{ model: Clase, as: 'formatoPapelFactura' },
										{ model: Clase, as: 'formatoColorFactura' },
										{ model: Clase, as: 'formatoPapelFacturaServicio' },
										{ model: Clase, as: 'formatoColorFacturaServicio' },
										{ model: Clase, as: 'tipoConfiguracion' },
										{ model: Clase, as: 'formatoPapelNotaVenta'},
										{ model: Clase, as: 'formatoColorNotaVenta'},
										{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
										{ model: Clase, as: 'formatoPapelNotaTraspaso'},
										{ model: Clase, as: 'formatoColorNotaTraspaso'}]
									}).then(function (configuracionFactura) {
										res.json({
											sucursalPrincipal: sucursalPrincipalEncontrada,
											venta: venta,
											configuracion: configuracionFactura,
											sucursal: venta.sucursal,
											numero_literal: venta.numero_literal,
											pieFactura: dosificacion.pieFactura, sucursalDestino: ((venta.almacenTraspaso) ? venta.almacenTraspaso.sucursal : null)
										});
									});
								}
							});
						}
					});

				});
			})
		})

		.put(function (req, res) {
			sequelize.transaction(function (t) {
				if (req.body.saldoRestante == 0) {
					var anticipo = 0
				} else {
					var anticipo = req.body.saldoRestante * (-1);
				}
				var pagoV = req.body.pago - anticipo
				return Venta.find({
					where: { id: req.params.id },
					include: [{
						model: Almacen, as: 'almacen',
						include: [{ model: Sucursal, as: 'sucursal' }]
					}], transaction: t
				}).then(function (ventaEncontrada) {
					return Venta.update({
						a_cuenta: ventaEncontrada.a_cuenta + pagoV,
						saldo: ventaEncontrada.total - (ventaEncontrada.a_cuenta + pagoV)
					}, {
							where: {
								id: ventaEncontrada.id
							}, transaction: t
						}).then(function (affectedRows) {
							return PagoVenta.create({
								id_venta: ventaEncontrada.id,
								a_cuenta_anterior: ventaEncontrada.a_cuenta,
								saldo_anterior: ventaEncontrada.saldo,
								monto_pagado: pagoV,
								id_usuario: req.body.id_usuario_cajero,
								numero_documento: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo
							}, {
									transaction: t
								}).then(function (detalleVentaCreada) {
									return Sucursal.update({
										nota_recibo_correlativo: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo + 1
									}, {
											where: {
												id: ventaEncontrada.almacen.sucursal.id
											}, transaction: t
										}).then(function (affectedRows) {
											if (anticipo != 0) {
												return Sucursal.find({
													where: { id: ventaEncontrada.almacen.sucursal.id }, transaction: t
												}).then(function (sucursalEncontrada) {
													return ClienteAnticipo.create({
														id_cliente: parseInt(ventaEncontrada.id_cliente),
														monto_anticipo: anticipo,
														fecha: req.body.fecha,
														monto_salida: 0,
														saldo: anticipo,
														id_sucursal: ventaEncontrada.almacen.sucursal.id,
														numero_correlativo_anticipo: sucursalEncontrada.anticipo_cliente_correlativo,
														eliminado: false
													}, {
															transaction: t
														}).then(function (clienteCreado) {
															var correlativo = sucursalEncontrada.anticipo_cliente_correlativo + 1
															return Sucursal.update({
																anticipo_cliente_correlativo: correlativo
															}, {
																	where: { id: ventaEncontrada.almacen.sucursal.id }, transaction: t
																}).then(function (Actualizado) {
																	return ClienteAnticipo.find({
																		where: { id: clienteCreado.id },
																		include: [{ model: Sucursal, as: 'sucursal' }, { model: Cliente, as: 'cliente' }], transaction: t
																	}).then(function (encontrado) {
																		var pago = NumeroLiteral.Convertir(parseFloat(pagoV).toFixed(2).toString());
																		return new Promise(function (fulfill, reject) {
																			fulfill({ anticipo: encontrado, mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, venta: ventaEncontrada });
																		})
																	}).catch(function (err) {
																		return new Promise(function (fulfill, reject) {
																			reject((err.stack !== undefined) ? err.stack : err);
																		});
																	});

																}).catch(function (err) {
																	return new Promise(function (fulfill, reject) {
																		reject((err.stack !== undefined) ? err.stack : err);
																	});
																});

														}).catch(function (err) {
															return new Promise(function (fulfill, reject) {
																reject((err.stack !== undefined) ? err.stack : err);
															});
														});
												}).catch(function (err) {
													return new Promise(function (fulfill, reject) {
														reject((err.stack !== undefined) ? err.stack : err);
													});
												});
											} else {
												var pago = NumeroLiteral.Convertir(parseFloat(pagoV).toFixed(2).toString());
												return new Promise(function (fulfill, reject) {
													fulfill({ anticipo: {}, mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, venta: ventaEncontrada });
												})
											}
										}).catch(function (err) {
											return new Promise(function (fulfill, reject) {
												reject((err.stack !== undefined) ? err.stack : err);
											});
										});
								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject((err.stack !== undefined) ? err.stack : err);
									});
								});
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject((err.stack !== undefined) ? err.stack : err);
							});
						});
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject((err.stack !== undefined) ? err.stack : err);
					});
				});
			}).then(function (result) {
				res.json(result);
			}).catch(function (err) {
				res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
			});
		});
	router.route('/compensacion/ventas/:id/empresa/:id_empresa/cliente/:id_cliente')
		.put(function (req, res) {
			sequelize.transaction(function (t) {
				return Venta.find({
					where: { id: req.params.id },
					include: [{
						model: Almacen, as: 'almacen',
						include: [{ model: Sucursal, as: 'sucursal' },
						]
					}, {
						model: Movimiento, as: 'movimiento',
						include: [{ model: Clase, as: 'clase' }]
					}], transaction: t
				}).then(function (ventaEncontrada) {
					return Venta.update({
						a_cuenta: ventaEncontrada.a_cuenta + req.body.pago,
						saldo: ventaEncontrada.total - (ventaEncontrada.a_cuenta + req.body.pago)
					}, {
							where: {
								id: ventaEncontrada.id
							}, transaction: t
						}).then(function (affectedRows) {
							return PagoVenta.create({
								id_venta: ventaEncontrada.id,
								a_cuenta_anterior: ventaEncontrada.a_cuenta,
								saldo_anterior: ventaEncontrada.saldo,
								monto_pagado: req.body.pago,
								id_usuario: req.body.id_usuario_cajero,
								numero_documento: ventaEncontrada.almacen.sucursal.anticipo_compensacion_cliente_correlativo
							}, {
									transaction: t
								}).then(function (PagoVentaCreado) {
									return Sucursal.update({
										anticipo_compensacion_cliente_correlativo: ventaEncontrada.almacen.sucursal.anticipo_compensacion_cliente_correlativo + 1
									}, {
											where: {
												id: ventaEncontrada.almacen.sucursal.id
											}, transaction: t
										}).then(function (affectedRows) {
											return ClienteAnticipo.findAll({
												where: { id_cliente: req.params.id_cliente, saldo: { $gt: 0 } }, transaction: t
											}).then(function (AnticiposEncontrados) {
												return guardarAnticiposCliente(req, res, AnticiposEncontrados, ventaEncontrada.almacen.sucursal, req.body.pago, ventaEncontrada, t, PagoVentaCreado)
											}).catch(function (err) {
												return new Promise(function (fulfill, reject) {
													reject((err.stack !== undefined) ? err.stack : err);
												});
											})

											/* var pago = NumeroLiteral.Convertir(parseFloat(req.body.pago).toFixed(2).toString());
											res.json({ mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, venta: ventaEncontrada }); */
										}).catch(function (err) {
											return new Promise(function (fulfill, reject) {
												reject((err.stack !== undefined) ? err.stack : err);
											});
										});
								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject((err.stack !== undefined) ? err.stack : err);
									});
								});
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject((err.stack !== undefined) ? err.stack : err);
							});
						});
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject((err.stack !== undefined) ? err.stack : err);
					});
				});
			}).then(function (result) {
				res.json(result[0]);
			}).catch(function (err) {
				res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
			});
		});
	function guardarAnticiposCliente(req, res, AnticiposEncontrados, sucursal, pago, ventaEncontrada, t, PagoVentaCreado) {
		var cantidadTotal = req.body.pago
		var promises = []
		for (var i = 0; i < AnticiposEncontrados.length; i++) {
			var anticipo = AnticiposEncontrados[i];


			if (cantidadTotal > 0) {
				var cantidadParcial;
				if (cantidadTotal > anticipo.saldo) {
					cantidadParcial = anticipo.saldo;
					cantidadTotal = cantidadTotal - anticipo.saldo
				} else {
					cantidadParcial = cantidadTotal;
					cantidadTotal = 0;
				}

				if (cantidadParcial > 0) {
					promises.push(guardarDetalleHijosAnticipo(req, res, anticipo, cantidadParcial, sucursal, pago, ventaEncontrada, t, PagoVentaCreado))
				}
			}
		}
		return Promise.all(promises)
	}
	function guardarDetalleHijosAnticipo(req, res, anticipo, cantidadParcial, sucursal, pago, ventaEncontrada, t, PagoVentaCreado) {
		return Sucursal.find({
			where: { id: sucursal.id }, transaction: t
		}).then(function (sucursalEncontrada) {
			return ClienteAnticipo.update({
				monto_salida: anticipo.monto_salida + cantidadParcial,
				saldo: anticipo.saldo - (anticipo.monto_salida + cantidadParcial)
			}, {
					where: { id: anticipo.id },
					transaction: t
				}).then(function (anticipoActualizado) {
					return ClienteAnticipo.create({
						id_cliente: parseInt(req.params.id_cliente),
						id_pago_venta: PagoVentaCreado.id,
						monto_anticipo: anticipo.monto_anticipo,
						fecha: req.body.fecha,
						monto_salida: cantidadParcial,
						saldo: anticipo.saldo - cantidadParcial,
						id_sucursal: sucursal.id,
						eliminado: false,
						id_padre: anticipo.id
					}, {
							transaction: t
						}).then(function (clienteCreado) {
							return ClienteAnticipo.find({
								where: { id: clienteCreado.id },
								include: [{ model: Sucursal, as: 'sucursal' }, { model: Cliente, as: 'cliente' }], transaction: t
							}).then(function (encontrado) {
								var pago = NumeroLiteral.Convertir(parseFloat(req.body.pago).toFixed(2).toString());
								return new Promise(function (fulfill, reject) {
									fulfill({ mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, venta: ventaEncontrada, anticipo: encontrado });
								});
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
		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject((err.stack !== undefined) ? err.stack : err);
			});
		})
	}
	router.route('/compensacion/compra/:id/empresa/:id_empresa/proveedor/:id_proveedor')
		.put(function (req, res) {
			sequelize.transaction(function (t) {
				return Compra.find({
					where: { id: req.params.id },
					include: [{
						model: Almacen, as: 'almacen',
						include: [{ model: Sucursal, as: 'sucursal' },
						]
					}, {
						model: Movimiento, as: 'movimiento',
						include: [{ model: Clase, as: 'clase' }]
					}], transaction: t
				}).then(function (compraEncontrada) {
					return Compra.update({
						a_cuenta: compraEncontrada.a_cuenta + req.body.pago,
						saldo: compraEncontrada.total - (compraEncontrada.a_cuenta + req.body.pago)
					}, {
							where: {
								id: compraEncontrada.id
							}, transaction: t
						}).then(function (affectedRows) {
							return PagoCompra.create({
								id_compra: compraEncontrada.id,
								a_cuenta_anterior: compraEncontrada.a_cuenta,
								saldo_anterior: compraEncontrada.saldo,
								monto_pagado: req.body.pago,
								id_usuario: req.body.id_usuario_cajero,
								numero_documento: compraEncontrada.almacen.sucursal.anticipo_compensacion_proveedor_correlativo
							}, {
									transaction: t
								}).then(function (PagoCompraCreado) {
									return Sucursal.update({
										anticipo_compensacion_proveedor_correlativo: compraEncontrada.almacen.sucursal.anticipo_compensacion_proveedor_correlativo + 1
									}, {
											where: {
												id: compraEncontrada.almacen.sucursal.id
											}, transaction: t
										}).then(function (affectedRows) {
											return ProveedorAnticipo.findAll({
												where: { id_proveedor: req.params.id_proveedor, saldo: { $gt: 0 } }, transaction: t
											}).then(function (AnticiposEncontrados) {
												return guardarAnticiposProveedor(req, res, AnticiposEncontrados, compraEncontrada.almacen.sucursal, req.body.pago, compraEncontrada, t, PagoCompraCreado)
											}).catch(function (err) {
												return new Promise(function (fulfill, reject) {
													reject((err.stack !== undefined) ? err.stack : err);
												});
											})

											/* var pago = NumeroLiteral.Convertir(parseFloat(req.body.pago).toFixed(2).toString());
											res.json({ mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, venta: ventaEncontrada }); */
										}).catch(function (err) {
											return new Promise(function (fulfill, reject) {
												reject((err.stack !== undefined) ? err.stack : err);
											});
										});
								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject((err.stack !== undefined) ? err.stack : err);
									});
								});
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject((err.stack !== undefined) ? err.stack : err);
							});
						});
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject((err.stack !== undefined) ? err.stack : err);
					});
				});
			}).then(function (result) {
				res.json(result[0]);
			}).catch(function (err) {
				res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
			});
		});
	function guardarAnticiposProveedor(req, res, AnticiposEncontrados, sucursal, pago, compraEncontrada, t, PagoCompraCreado) {
		var cantidadTotal = req.body.pago
		var promises = []
		for (var i = 0; i < AnticiposEncontrados.length; i++) {
			var anticipo = AnticiposEncontrados[i];


			if (cantidadTotal > 0) {
				var cantidadParcial;
				if (cantidadTotal > anticipo.saldo) {
					cantidadParcial = anticipo.saldo;
					cantidadTotal = cantidadTotal - anticipo.saldo
				} else {
					cantidadParcial = cantidadTotal;
					cantidadTotal = 0;
				}

				if (cantidadParcial > 0) {
					promises.push(guardarDetalleHijosAnticipoProveedor(req, res, anticipo, cantidadParcial, sucursal, pago, compraEncontrada, t, PagoCompraCreado))
				}
			}
		}
		return Promise.all(promises)
	}
	function guardarDetalleHijosAnticipoProveedor(req, res, anticipo, cantidadParcial, sucursal, pago, compraEncontrada, t, PagoCompraCreado) {
		return Sucursal.find({
			where: { id: sucursal.id }, transaction: t
		}).then(function (sucursalEncontrada) {
			return ProveedorAnticipo.update({
				monto_salida: anticipo.monto_salida + cantidadParcial,
				saldo: anticipo.saldo - (anticipo.monto_salida + cantidadParcial)
			}, {
					where: { id: anticipo.id },
					transaction: t
				}).then(function (anticipoActualizado) {
					return ProveedorAnticipo.create({
						id_proveedor: parseInt(req.params.id_proveedor),
						id_pago_compra: PagoCompraCreado.id,
						monto_anticipo: anticipo.monto_anticipo,
						fecha: req.body.fecha,
						monto_salida: cantidadParcial,
						saldo: anticipo.saldo - cantidadParcial,
						id_sucursal: sucursal.id,
						eliminado: false,
						id_padre: anticipo.id
					}, {
							transaction: t
						}).then(function (ProvedorAnticipoCreado) {
							return ProveedorAnticipo.find({
								where: { id: ProvedorAnticipoCreado.id },
								include: [{ model: Sucursal, as: 'sucursal' }, { model: Proveedor, as: 'proveedor' }], transaction: t
							}).then(function (encontrado) {
								var pago = NumeroLiteral.Convertir(parseFloat(req.body.pago).toFixed(2).toString());
								return new Promise(function (fulfill, reject) {
									fulfill({ mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, compra: compraEncontrada, anticipo: encontrado });
								});
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
		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject((err.stack !== undefined) ? err.stack : err);
			});
		})
	}
	router.route('/ventas/:id_empresa/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
			var condicionVenta = { fecha: { $between: [inicio, fin] }, activa: true };
			Venta.findAll({
				where: condicionVenta,
				include: [{
					model: Movimiento, as: 'movimiento',
					include: [{ model: DetalleMovimiento, as: 'detallesMovimiento' },
					{ model: Clase, as: 'clase' }]
				},
				{ model: DetalleVenta, as: 'detallesVenta' },
				{ model: Clase, as: 'tipoPago' },
				{
					model: Almacen, as: 'almacen',
					include: [{
						model: Sucursal, as: 'sucursal',
						include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
					}]
				}]
			}).then(function (entity) {
				Venta.findAll({
					where: condicionVenta,
					include: [{
						model: DetalleVenta, as: 'detallesVenta',
						include: [{ model: ServicioVenta, as: 'servicio' }]
					},
					{ model: Clase, as: 'tipoPago' },
					/* { model: Clase, as: 'actividad' }, */
					{
						model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
					}, {
						model: Clase, as: 'movimientoServicio'
					}]
				}).then(function (entity2) {
					var ventas = entity.concat(entity2)
					ventas = ventas.sort(function (a, b) {
						return a.fecha - b.fecha;
					});
					res.json(ventas);
				});
			});
		});

	router.route('/detalles_compra/:id_empresa/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			var condicionCompra = { fecha: { $between: [inicio, fin] } };
			Clase.findAll({
				where: { $or: [{ nombre_corto: { $not: "ALM" } }, { nombre_corto: null }] },
				include: [{
					model: DetalleCompra, as: 'detallesCompra',
					include: [{
						model: Compra, as: 'compra', where: condicionCompra,
						include: [{
							model: Almacen, as: 'almacen',
							include: [{
								model: Sucursal, as: 'sucursal',
								include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
							}]
						}]
					}]
				}]
			}).then(function (entity) {
				res.json(entity);
			});

			/*DetalleCompra.findAll({ 
				include: [{model:Compra,as: 'compra',where:condicionCompra,
								include: [{model:Almacen,as: 'almacen',
									include: [{model:Sucursal,as: 'sucursal',
												include: [{model:Empresa,as: 'empresa',where:{id:req.params.id_empresa}}]}]}]},
						  {model:Clase,as:'centroCosto',where:{$or: [{nombre_corto:{$not:"ALM"}},{nombre_corto:null}]}}]
			}).then(function(entity){			
				res.json(entity);		  
			});*/
		});
	router.route('/compras/:id/empresa/:id_empresa')
		.get(function (req, res) {
			Compra.find({
				where: {
					id: req.params.id
				},
				include: [{ model: Clase, as: 'tipoMovimiento', required: false }, { model: Sucursal, as: 'sucursal', required: false }, { model: Proveedor, as: 'proveedor', required: false },
				{
					model: DetalleCompra, as: 'detallesCompra', include: [{ model: Clase, as: 'servicio', required: false }, { model: Producto, as: 'producto', required: false },
					{ model: Inventario, as: 'inventario', required: false }]
				},
				{ model: Almacen, as: 'almacen', required: false, include: [{ model: Sucursal, as: 'sucursal', required: false }] },
				//{model:Clase,as:'actividad'},
				{ model: Clase, as: 'tipoPago', required: false },
				{ model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }]

			}).then(function (compra) {
				if (compra.sucursal == undefined) {
					compra.sucursal = compra.almacen.sucursal;
				}
				compra.numero_literal = NumeroLiteral.Convertir(parseFloat(compra.total).toFixed(2).toString());

				ConfiguracionGeneralFactura.find({
					where: {
						id_empresa: req.params.id_empresa
					},
					include: [{ model: Clase, as: 'impresionFactura' },
					{ model: Clase, as: 'tipoFacturacion' },
					{ model: Clase, as: 'tamanoPapelFactura' },
					{ model: Clase, as: 'tituloFactura' },
					{ model: Clase, as: 'subtituloFactura' },
					{ model: Clase, as: 'pieFactura' },
					{ model: Clase, as: 'tamanoPapelNotaVenta' },]
				}).then(function (configuracionGeneralFactura) {
					if (configuracionGeneralFactura.usar) {
						res.json({ compra: compra, configuracion: configuracionGeneralFactura, sucursal: compra.sucursal, numero_literal: compra.numero_literal });
					} else {
						ConfiguracionFactura.find({
							where: {
								id_sucursal: compra.sucursal.id
							},
							include: [{ model: Clase, as: 'impresionFactura' },
							{ model: Clase, as: 'tipoFacturacion' },
							{ model: Clase, as: 'tamanoPapelFactura' },
							{ model: Clase, as: 'tituloFactura' },
							{ model: Clase, as: 'subtituloFactura' },
							{ model: Clase, as: 'pieFactura' },
							{ model: Clase, as: 'tamanoPapelNotaVenta' },]
						}).then(function (configuracionFactura) {
							res.json({
								compra: compra,
								configuracion: configuracionFactura,
								sucursal: compra.sucursal,
								numero_literal: compra.numero_literal
							});
						});
					}
				});

			});
		})
	router.route('/ingreso-por-inventario/:id_empresa')
		.get(function (req, res) {
			Movimiento.findAll({
				include: [{ model: DetalleMovimiento, as: 'detallesMovimiento', where: { id_producto: { $not: null } }, include: [{ model: Inventario, as: 'inventario' }, { model: Producto, as: 'producto', required: true }] },
				{ model: Clase, as: 'clase', where: { nombre_corto: Diccionario.ING_POR_INVENTARIO } }, {
					model: Almacen, as: 'almacen',
					include: [{ model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa } }]
				}]
			}).then(function (productos) {
				res.json(productos);
			}).catch(function (err) {
				res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
			})
		});
	router.route('/actualizar-movimiento-detalle/:id')
		.put(function (req, res) {
			var imp = req.body.cantidad * req.body.costo_unitario
			var total = imp - req.body.descuento + req.body.recargo - req.body.ice - req.body.excento
			DetalleMovimiento.update({
				cantidad: req.body.cantidad,
				costo_unitario: req.body.costo_unitario,
				importe: imp,
				total: total
			}, {
					where: { id: req.params.id }

				}).then(function (detalleMovimientoActualizado) {
					Inventario.update({
						cantidad: req.body.cantidad,
						costo_unitario: req.body.costo_unitario,
						lote: req.body.inventario.lote,
						fecha_vencimiento: req.body.inventario.fecha_vencimiento,
						costo_total: total
					}, {
							where: {
								id: req.body.id_inventario
							}

						}).then(function (inventarioActualizado) {
							res.json({ mensaje: "actualizado satisfactoriamente!" });
						});
				});
			// DetalleMovimiento.update({
			// 	cantidad: req.body.cantidad,
			// 	costo_unitario: req.body.costo_unitario
			// }, {
			// 		where: { id: req.params.id }

			// 	}).then(function (detalleMovimientoActualizado) {
			// 		Inventario.update({
			// 			cantidad: req.body.cantidad,
			// 			costo_unitario: req.body.costo_unitario,
			// 			lote: req.body.inventario.lote,
			// 			fecha_vencimiento: req.body.inventario.fecha_vencimiento
			// 		}, {
			// 				where: {
			// 					id: req.body.id_inventario
			// 				}

			// 			}).then(function (inventarioActualizado) {
			// 				res.json({ mensaje: "actualizado satisfactoriamente!" });
			// 			});
			// 	});
		});

	router.route('/movimientos')
		.get(function (req, res) {
			Movimiento.findAll({

			}).then(function (movimiento) {
				res.json(movimiento);
			})
		});



	router.route('/cliente/verificar-credito/:id_cliente/tipo/:id_tipo')
		.get(function (req, res) {
			Venta.findAll({
				where: {
					id_cliente: req.params.id_cliente,
					saldo: { $ne: 0 },
					id_tipo_pago: req.params.id_tipo
				}
			}).then(function (Ventas) {
				res.json({ ventas: Ventas });

			});
		});
	var contador = 0
	router.route('/actualizarMovimientos/empresa/:id_empresa')
		.put(function (req, res) {
			req.body.mensaje = ""
			var inicio = new Date(2018, 05, 25)
			var fin = new Date(2018, 06, 30)
			inicio.setHours(0, 0, 0, 0, 0);
			fin.setHours(23, 0, 0, 0, 0);
			req.body.actualizados = 0
			contador = 0
			req.body.ids = []
			sequelize.transaction(function (t) {
				var promises1 = [];
				var a = 0
				return DetalleVenta.findAll({

					include: [{
						model: Producto, as: 'producto', include: [
							{ model: Clase, as: 'tipoProducto' }, {
								model: ProductoBase, as: 'productosBase',
								include: [{ model: Producto, as: 'productoBase' }]
							}
						]
					}, {
						model: Venta, as: 'venta', where: { fecha: { $between: [inicio, fin] } }, include: [{
							model: Almacen, as: 'almacen',
							include: [{
								model: Sucursal, as: 'sucursal',
								include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
							}]
						}]
					}], transaction: t
				}).then(function (detallesVenta) {
					detallesVenta.forEach(function (detalleVenta, index, array) {
						if (detalleVenta.venta.activa) {
							/* for (var i = 0; i < venta.detallesVenta.length; i++) { */
							/* var detalle = venta.detallesVenta[i]; */
							promises1.push(DetalleMovimiento.find({
								where: {
									id_movimiento: detalleVenta.venta.dataValues.id_movimiento, id_producto: detalleVenta.dataValues.id_producto,
									cantidad: detalleVenta.dataValues.cantidad
								}, transaction: t
							}).then(function (detalleMovimientoEncontrado) {
								if (!detalleMovimientoEncontrado) {
									req.body.actualizados++
									return Movimiento.find({
										where: { id: detalleVenta.venta.id_movimiento }, transaction: t
									}).then(function (movimientoEncontrado) {
										var arrgloInv = []/* promises.push(calcularCostosEgresos(detalle, detalle.producto, detalle.cantidad, arrgloInv, movimientoEncontrado, index, array, res, venta, t)) */
										if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
											return calcularCostosEgresos(detalleVenta, detalleVenta.producto, detalleVenta.cantidad, arrgloInv,
												movimientoEncontrado, index, array, res, detalleVenta.venta, t)
										} else if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
											var promises = [];
											for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
												if ((i + 1) == detalleVenta.producto.productosBase.length) {
													promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, arrgloInv,
														movimientoEncontrado, index, array, res, detalleVenta.venta, t));
												} else {
													promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, arrgloInv,
														movimientoEncontrado, index - 1, array, res, detalleVenta.venta, t));
												}
											}

										} else {
											var promises = [];
											for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
												if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
													if ((i + 1) == detalleVenta.producto.productosBase.length) {
														promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
															movimientoEncontrado, index, array, res, detalleVenta.venta, t));
													} else {
														promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
															movimientoEncontrado, index - 1, array, res, detalleVenta.venta, t));
													}
												} else if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
													var innerpromises = [];
													for (var j = 0; j < detalleVenta.producto.productosBase[i].productoBase.productosBase.length; j++) {
														if ((j + 1) == detalleVenta.producto.productosBase[i].productoBase.productosBase.length) {
															innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
																detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
																detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoEncontrado, index, array, res, detalleVenta.venta, t));
														} else {
															innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
																detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
																detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoEncontrado, index - 1, array, res, detalleVenta.venta, t));
														}
													}
													promises.push(Promise.all(innerpromises));
												}
											}
											promises1.push(Promise.all(promises));
										}
									})

								} else {
									var promises = [];
									promises1.push(Promise.all(promises));
								}
							}))
						} else {
							console.log(detalleVenta.venta.factura)
						}

						/* 	} */

					});
					return Promise.all(promises1);
				})
				/* return Promise.all(promises1); */

			}).then(function (result) {

				res.json({ mensaje: "Movimientos Creados de los detalles de las Ventas total movimientos creados =" + contador });

			}).catch(function (err) {
				var error = (err.stack) ? err.stack : err
				res.json({ hasError: true, mensaje: error });
			});

		});
	router.route('/servicios-venta/empresa/:id_empresa')
		.get(function (req, res) {
			ServicioVenta.findAll({
				where: {
					eliminado: false,
					id_empresa: req.params.id_empresa
				}
			}).then(function (Servicios) {
				res.json({ servicios: Servicios });
			});
		})
		.post(function (req, res) {
			req.body.forEach(function (servicio, index, array) {
				if (servicio.id) {
					ServicioVenta.update({
						nombre: servicio.nombre,
						precio: servicio.precio,
						descripcion: servicio.descripcion,
						descuento: servicio.descuento,
						descuento_fijo: servicio.descuento_fijo,
						habilitado: servicio.habilitado,
						eliminado: servicio.eliminado,
					}, {
							where: {
								id: servicio.id
							}
						}).then(function (Servicios) {
							if (index === (array.length - 1)) {
								res.json({ mensaje: "Datos agregados satisfactoriamente!" });
							}

						});
				} else {
					ServicioVenta.create({
						id_empresa: req.params.id_empresa,
						nombre: servicio.nombre,
						precio: servicio.precio,
						descripcion: servicio.descripcion,
						descuento: servicio.descuento,
						descuento_fijo: servicio.descuento_fijo,
						habilitado: servicio.habilitado,
						eliminado: servicio.eliminado,
					}).then(function (Servicios) {
						if (index === (array.length - 1)) {
							res.json({ mensaje: "Datos agregados satisfactoriamente!" });
						}
					});
				}
			})

		});
	function CrearVentasServicioMasiva(req, res, t) {
		var promises2 = [];
		req.body.ventas.forEach(function (venta, index, array) {
			var movimiento = venta.movimiento.nombre_corto;
			var id_movimiento = venta.movimiento.id;
			/* 	var venta = req.body; */
			var factura = {};
			factura.venta = venta;

			promises2.push(SucursalActividadDosificacion.find({
				where: {
					id_actividad: venta.actividad.id,
					id_sucursal: venta.sucursal.id,
					expirado: false
				},
				transaction: t,
				include: [{ model: Dosificacion, as: 'dosificacion', include: [{ model: Clase, as: 'pieFactura' }] },
				{ model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa' }] }]
			}).then(function (sucursalActividadDosificacion) {
				var dosificacion = sucursalActividadDosificacion.dosificacion;
				venta.factura = dosificacion.correlativo + (index);
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
				/* if (sucursalActividadDosificacion.sucursal.empresa.usar_pedidos) {
					venta.pedido = sucursalActividadDosificacion.sucursal.pedido_correlativo;
				} */


				return Cliente.find({
					where: {
						nit: venta.cliente.nit,
						razon_social: venta.cliente.razon_social
					}
					, transaction: t
				}).then(function (ClienteEncontrado) {
					if (!ClienteEncontrado) {
						return Cliente.create({
							id_empresa: venta.id_empresa,
							nit: venta.cliente.nit,
							razon_social: venta.cliente.razon_social
						}, { transaction: t }).then(function (clienteCreado) {
							return crearVentaServicio(venta, res, clienteCreado.id, dosificacion, true, sucursalActividadDosificacion.sucursal, t, id_movimiento);
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject(err);
							});
						});
					} else {
						return crearVentaServicio(venta, res, ClienteEncontrado.id, dosificacion, true, sucursalActividadDosificacion.sucursal, t, id_movimiento);
					}
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				})

			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			}))

		})
		return Promise.all(promises2);
	}
	function CrearClientesVentasMasivas(req, res, t, id_empresa) {
		var promises2 = [];
		req.body.arregloClientes.forEach(function (cliente, index, array) {
			promises2.push(Cliente.findOrCreate({
				where: {
					nit: cliente.nit,
					id_empresa: id_empresa,
				},
				transaction: t,
				lock: t.LOCK.UPDATE,
				defaults: {
					id_empresa: id_empresa,
					nit: cliente.nit,
					razon_social: cliente.razon_social
				}
			}).spread(function (ClienteEnc, created4) {

				if (index == (array.length - 1)) {
					return CrearVentasServicioMasiva(req, res, t)
				}

			}))
		})
		return Promise.all(promises2);
	}
	router.route('/importacion-ventas-servicio')
		.post(function (req, res) {
			var promesas = []
			var promises2 = [];
			var promises3 = []
			SucursalActividadDosificacion.find({
				where: {
					id_actividad: req.body.ventas[0].actividad.id,
					id_sucursal: req.body.ventas[0].sucursal.id,
					expirado: false
				},
				include: [{ model: Dosificacion, as: 'dosificacion', include: [{ model: Clase, as: 'pieFactura' }] },
				{ model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa' }] }]
			}).then(function (sucursalActividadDosificacion) {
				var dosificacion = sucursalActividadDosificacion.dosificacion;
				sequelize.transaction(function (t) {
					for (let index = 0; index < req.body.arregloServicios.length; index++) {
						var ser = ServicioVenta.findOrCreate({
							where: {
								nombre: req.body.arregloServicios[index].nombre,
								id_empresa: req.body.arregloServicios[index].id_empresa,
							},
							transaction: t,
							lock: t.LOCK.UPDATE,
							defaults: {
								id_empresa: req.body.arregloServicios[index].id_empresa,
								nombre: req.body.arregloServicios[index].nombre,
								precio: req.body.arregloServicios[index].precio,
								descripcion: "",
								descuento: 0,
								descuento_fijo: false,
								habilitado: true,
								eliminado: false
							}
						})
						promises2.push(ser)
					}
					promesas.unshift(promises2)
					promesas.unshift(promises3)
					return Promise.all(promesas)
				}).then(function (result) {
					sequelize.transaction(function (y) {
						var promm = []
						for (let index = 0; index < req.body.ventas.length; index++) {
							req.body.ventas[index].factura = dosificacion.correlativo + (index);
							req.body.ventas[index].pieFactura = dosificacion.pieFactura;
							req.body.ventas[index].codigo_control = CodigoControl.obtenerCodigoControl(dosificacion.autorizacion.toString(),
								(dosificacion.correlativo + (index)).toString(),
								req.body.ventas[index].cliente.nit.toString(),
								formatearFecha(req.body.ventas[index].fechaTexto).toString(),
								parseFloat(req.body.ventas[index].total).toFixed(2),
								dosificacion.llave_digital.toString());
							req.body.ventas[index].autorizacion = dosificacion.autorizacion.toString();
							req.body.ventas[index].fecha_limite_emision = dosificacion.fecha_limite_emision;
							req.body.ventas[index].numero_literal = NumeroLiteral.Convertir(parseFloat(req.body.ventas[index].total).toFixed(2).toString());
							promm.push(aaaaaaaVentaServicio(req, index, y, res, dosificacion, sucursalActividadDosificacion))
						}
						return Promise.all(promm)
					}).then(function name(result) {
						res.json({ mensaje: "Importación satisfactoriamente!" })
					}).catch(function (err) {
						res.json({ hasError: true, message: err.stack });
					})
				}).catch(function (err) {
					res.json({ hasError: true, message: err.stack });
				});
			})
		})

	function aaaaaaaVentaServicio(req, index, y, res, dosificacion, sucursalActividadDosificacion) {
		var movimiento = req.body.ventas[index].movimiento.nombre_corto;
		var id_movimiento = req.body.ventas[index].movimiento.id;
		return Cliente.find({
			where: {
				nit: req.body.ventas[index].cliente.nit,
				razon_social: req.body.ventas[index].cliente.razon_social
			}
			, transaction: y
		}).then(function (ClienteEncontrado) {
			if (!ClienteEncontrado) {
				return Cliente.create({
					id_empresa: req.body.ventas[index].id_empresa,
					nit: req.body.ventas[index].cliente.nit,
					razon_social: req.body.ventas[index].cliente.razon_social
				}, { transaction: y }).then(function (clienteCreado) {
					return crearVentaServicio(req.body.ventas[index], res, clienteCreado.id, dosificacion, true, sucursalActividadDosificacion.sucursal, y, id_movimiento);
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
			} else {
				return crearVentaServicio(req.body.ventas[index], res, ClienteEncontrado.id, dosificacion, true, sucursalActividadDosificacion.sucursal, y, id_movimiento);
			}
		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject(err);
			});
		})
	}

	function eliminarDetalleVentaBase(req, res, detalleVenta, t, venta) {
		var promises = []
		detalleVenta.detallesVentaProductoFinal.forEach(function (mov) {
			promises.push(DetalleMovimiento.destroy({
				where: {
					id: mov.id_detalle_movimiento
				}, transaction: t
			}).then(function (detalleMovimientoEliminado) {
				return DetalleVentaProductoFinal.destroy({
					where: {
						id: mov.id
					}, transaction: t
				}).then(function (detalleVPF) {
					return Inventario.find({
						where: {
							id: mov.detalleMovimiento.id_inventario
						}, transaction: t
					}).then(function (inventarioEncontrado) {
						inventarioEncontrado.cantidad += mov.detalleMovimiento.cantidad
						return Inventario.update(
							{
								cantidad: inventarioEncontrado.cantidad
							}, {
								where: {
									id: mov.detalleMovimiento.id_inventario
								}, transaction: t
							}).then(function (InventarioActualizado) {

							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							});
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					});
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			}));
		})
		/* detalleVenta.producto.productosBase.forEach(function (productoBase) {
			for (var i = 0; i < venta.movimientoActual.detallesMovimiento.length; i++) {
				var element = venta.movimientoActual.detallesMovimiento[i];
				if (element.id_producto == productoBase.id_producto_base && element.cantidad == parseInt(productoBase.formulacion)) {
					
				}

			}

		}) */
		return Promise.all(promises);
	}
	router.route('/eliminar-detalle-venta/movimiento/:id_movimiento')
		.put(function (req, res) {
			var detalleVenta = req.body.detalleVenta
			var venta = req.body.venta
			sequelize.transaction(function (t) {
				if (detalleVenta.producto.tipoProducto.nombre_corto == "PFINAL") {
					return DetalleVenta.destroy({
						where: {
							id: detalleVenta.id
						}, transaction: t
					}).then(function (detalleCompraEliminado) {
						return eliminarDetalleVentaBase(req, res, detalleVenta, t, venta)
					})
				} else {
					return DetalleMovimiento.destroy({
						where: {
							id_inventario: detalleVenta.id_inventario,
							id_movimiento: parseInt(req.params.id_movimiento),
							id_producto: detalleVenta.producto.id
						}, transaction: t
					}).then(function (detalleMovimientoEliminado) {
						return DetalleVenta.destroy({
							where: {
								id: detalleVenta.id
							}, transaction: t
						}).then(function (detalleCompraEliminado) {
							return Inventario.find({
								where: {
									id: detalleVenta.id_inventario
								}, transaction: t
							}).then(function (inventarioEncontrado) {
								inventarioEncontrado.cantidad += detalleVenta.cantidad
								return Inventario.update(
									{
										cantidad: inventarioEncontrado.cantidad
									}, {
										where: {
											id: detalleVenta.id_inventario
										}, transaction: t
									}).then(function (InventarioActualizado) {

									}).catch(function (err) {
										return new Promise(function (fulfill, reject) {
											reject(err);
										});
									});
							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							});
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject(err);
							});
						});
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					});
				}
			}).then(function name(result) {
				res.json({ mensaje: "detalle venta eliminado!" })
			}).catch(function (err) {
				res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
			});
		})
	router.route('/importar-compras-ingresos-diarios/empresa/:id_empresa')
		.post(function (req, res) {
			Tipo.find({
				where: { nombre_corto: 'MOVING' }
			}).then(function (tipoMovimiento) {
				Tipo.find({
					where: { nombre_corto: 'CCO' }
				}).then(function (tipoCentroCosto) {
					var promises = []
					sequelize.transaction(function (t) {
						req.body.proveedores.forEach(function (proveedor, index, array) {
							promises.push(Proveedor.findOrCreate({
								where: {
									id_empresa: req.params.id_empresa,
									nit: proveedor.nit,
									razon_social: proveedor.razon_social
								},
								defaults: {
									id_empresa: req.params.id_empresa,
									nit: proveedor.nit,
									razon_social: proveedor.razon_social
								},
								transaction: t,
								lock: t.LOCK.UPDATE,
							}).spread(function (proveedorCreado, created) {
								return new Promise(function (fulfill, reject) {
									fulfill(proveedorCreado);
								});
							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							}));
						})
						if (req.body.centrosCosto.length > 0) {
							req.body.centrosCosto.forEach(function (centroCosto, index, array) {
								promises.push(Clase.findOrCreate(
									{
										where: {
											nombre: centroCosto.nombre,
											id_tipo: tipoCentroCosto.id
										},
										defaults: {
											nombre: centroCosto.nombre,
											id_tipo: tipoCentroCosto.id
										},
										transaction: t,
										lock: t.LOCK.UPDATE,
									}).spread(function (centroCostoCreado, created) {
										return new Promise(function (fulfill, reject) {
											fulfill(centroCostoCreado);
										});
									}).catch(function (err) {
										return new Promise(function (fulfill, reject) {
											reject(err);
										});
									}));
							})
						}
						if (req.body.productos.length > 0) {
							req.body.productos.forEach(function (producto, index, array) {
								promises.push(Producto.findOrCreate({
									where: {
										nombre: producto.nombre,
										codigo: producto.codigo,
										id_empresa: req.params.id_empresa
									},
									defaults: {
										nombre: producto.nombre,
										codigo: producto.codigo,
										unidad_medida: producto.unidad_medida,
										id_empresa: req.params.id_empresa
									},
									transaction: t,
									lock: t.LOCK.UPDATE,
								}).spread(function (productoCreado, created) {
									return new Promise(function (fulfill, reject) {
										fulfill(productoCreado);
									});
								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject(err);
									});
								}));
							})
						}
						req.body.compras.forEach(function (compra, index, array) {
							conceptoMovimiento = compra.movimiento
							promises.push(Almacen.find({
								where: { nombre: compra.almacen.nombre }, transaction: t,
								include: [{ model: Sucursal, as: 'sucursal', where: { id_empresa: compra.id_empresa } }]
							}).then(function (almacenEncontrado) {
								return Movimiento.create({
									id_tipo: tipoMovimiento.id,
									id_clase: conceptoMovimiento.id,
									id_almacen: almacenEncontrado.id,
									fecha: compra.fecha
								}, {
										transaction: t
									}).then(function (movimientoCreado) {
										return Proveedor.findOrCreate({
											where: {
												id_empresa: compra.id_empresa,
												nit: compra.proveedor.nit,
												razon_social: compra.proveedor.razon_social
											},
											defaults: {
												id_empresa: compra.id_empresa,
												nit: compra.proveedor.nit,
												razon_social: compra.proveedor.razon_social
											},
											transaction: t,
											lock: t.LOCK.UPDATE,
										}).spread(function (proveedorCreado, created) {

											return crearCompraImportacion(compra, res, proveedorCreado.id, movimientoCreado.id, conceptoMovimiento.id, tipoCentroCosto, almacenEncontrado, t);
										}).catch(function (err) {
											return new Promise(function (fulfill, reject) {
												reject(err);
											});
										});
									}).catch(function (err) {
										return new Promise(function (fulfill, reject) {
											reject(err);
										});
									});
							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							}));

						})
						return Promise.all(promises)
					}).then(function name(result) {
						res.json({ mensaje: "Importación satisfactoriamente!" })
					}).catch(function (err) {
						res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
					})
				})
			})
		})
	function crearCompraImportacion(compra, res, idProveedor, idMovimiento, idTipo, tipoCentroCosto, almacenEncontrado, t) {
		return Compra.create({
			id_tipo_movimiento: idTipo,
			id_almacen: almacenEncontrado.id,
			id_proveedor: idProveedor,
			id_movimiento: idMovimiento,
			factura: compra.factura,
			autorizacion: compra.autorizacion,
			fecha: compra.fecha,
			codigo_control: compra.codigo_control,
			importe: compra.importe,
			id_tipo_pago: compra.tipoPago.id,
			dias_credito: compra.dias_credito,
			a_cuenta: compra.a_cuenta,
			saldo: compra.saldo,
			descuento_general: compra.descuento_general,
			descuento: compra.descuento,
			recargo: compra.recargo,
			ice: compra.ice,
			excento: compra.excento,
			tipo_descuento: compra.tipo_descuento,
			tipo_recargo: compra.tipo_recargo,
			total: compra.total,
			id_usuario: compra.id_usuario,
			usar_producto: compra.usar_producto,
			observacion: compra.observacion,
			dui: compra.dui,
			tipo_retencion: compra.tipo_retencion
		}, {
				transaction: t
			}).then(function (compraCreada) {
				var promises = []
				compra.detallesCompra.forEach(function (detalleCompra, index, array) {
					promises.push(Producto.find({
						where: {
							nombre: detalleCompra.producto.nombre,
							codigo: detalleCompra.producto.codigo,
							id_empresa: compra.id_empresa
						},
						transaction: t
					}).then(function (productoCreado) {
						return Clase.find(
							{
								where: {
									nombre: detalleCompra.centroCosto.nombre,
									id_tipo: tipoCentroCosto.id
								},
								transaction: t,
							}).then(function (centroCostoCreado) {
								return crearDetalleCompraImportacion(detalleCompra, idMovimiento, compraCreada.id, almacenEncontrado.id, productoCreado.id, centroCostoCreado, res, compra, t);
							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							});
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					}));
				});
				return Promise.all(promises)
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			});
	}
	function crearDetalleCompraImportacion(detalleCompra, idMovimiento, idCompra, idAlmacen, idProducto, centroCosto, res, compra, t) {
		if (centroCosto.nombre_corto == "ALM") {
			return Inventario.create({
				id_almacen: idAlmacen,
				id_producto: idProducto,
				cantidad: detalleCompra.cantidad,
				costo_unitario: detalleCompra.costo_unitario,
				costo_total: detalleCompra.costo_unitario * detalleCompra.cantidad,
				fecha_vencimiento: detalleCompra.fecha_vencimiento,
				lote: detalleCompra.lote
			}, {
					transaction: t
				}).then(function (inventarioCreado) {
					return DetalleCompra.create({
						id_compra: idCompra,
						id_producto: idProducto,
						id_centro_costo: centroCosto.id,
						costo_unitario: detalleCompra.costo_unitario,
						cantidad: detalleCompra.cantidad,
						importe: detalleCompra.importe,
						descuento: detalleCompra.descuento,
						recargo: detalleCompra.recargo,
						ice: detalleCompra.ice,
						excento: detalleCompra.excento,
						tipo_descuento: detalleCompra.tipo_descuento.toUpperCase() == "%" ? true : false,
						tipo_recargo: detalleCompra.tipo_recargo.toUpperCase() == "%" ? true : false,
						total: detalleCompra.total,
						id_inventario: inventarioCreado.id,
					}, {
							transaction: t
						}).then(function (detalleCompraCreada) {
							return DetalleMovimiento.create({
								id_movimiento: idMovimiento,
								id_producto: idProducto,
								costo_unitario: detalleCompra.costo_unitario,
								cantidad: detalleCompra.cantidad,
								importe: (detalleCompra.costo_unitario * detalleCompra.cantidad),
								descuento: detalleCompra.descuento,
								recargo: detalleCompra.recargo,
								ice: detalleCompra.ice,
								excento: detalleCompra.excento,
								tipo_descuento: detalleCompra.tipo_descuento.toUpperCase() == "%" ? true : false,
								tipo_recargo: detalleCompra.tipo_recargo.toUpperCase() == "%" ? true : false,
								total: detalleCompra.total,
								fecha_vencimiento: detalleCompra.fecha_vencimiento,
								lote: detalleCompra.lote,
								id_inventario: inventarioCreado.id
							}, {
									transaction: t
								}).then(function (detalleMovimientoCreado) {
									return new Promise(function (fulfill, reject) {
										fulfill();
									});
								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject(err);
									});
								});
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject(err);
							});
						});
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
		} else {
			DetalleCompra.create({
				id_compra: idCompra,
				id_producto: idProducto,
				id_centro_costo: centroCosto.id,
				costo_unitario: detalleCompra.costo_unitario,
				cantidad: detalleCompra.cantidad,
				importe: detalleCompra.importe,
				descuento: detalleCompra.descuento,
				recargo: detalleCompra.recargo,
				ice: detalleCompra.ice,
				excento: detalleCompra.excento,
				tipo_descuento: detalleCompra.tipo_descuento,
				tipo_recargo: detalleCompra.tipo_recargo,
				total: detalleCompra.total,
				it: detalleCompra.it,
				iue: detalleCompra.iue
			}).then(function (detalleCompraCreada) {
				return new Promise(function (fulfill, reject) {
					fulfill();
				});
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			});
		}
	}
	router.route('/importar-ventas-facturacion/empresa/:id_empresa')
		.post(function (req, res) {
			sequelize.transaction(function (t) {
				var promises = []
				req.body.ventas.forEach(function (venta, index, array) {
					promises.push(Tipo.find({
						where: { nombre_corto: Diccionario.MOV_EGRE },
						transaction: t
					}).then(function (tipoMovimiento) {
						var id_movimiento = venta.movimiento.id;
						return Almacen.find({
							where: { nombre: venta.almacen.nombre },
							include: [{ model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa } }], transaction: t
						}).then(function (almacenEncontrado) {
							return Movimiento.create({
								id_tipo: tipoMovimiento.id,
								id_clase: id_movimiento,
								id_almacen: almacenEncontrado.id,
								fecha: venta.fecha
							}, { transaction: t }).then(function (movimientoCreado) {
								//SI ES FACTURACION
								return Sucursal.find({
									where: { nombre: venta.sucursal.nombre, id_empresa: req.params.id_empresa }, transaction: t
								}).then(function (sucursalEncontrada) {

									return Clase.find({
										where: { nombre: venta.actividad }, transaction: t
									}).then(function (actividadEncontrada) {
										return SucursalActividadDosificacion.find({
											where: {
												id_actividad: actividadEncontrada.id,
												id_sucursal: sucursalEncontrada.id,
												expirado: false
											},
											transaction: t,
											include: [{ model: Dosificacion, as: 'dosificacion', include: [{ model: Clase, as: 'pieFactura' }] },
											{ model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa' }] }]
										}).then(function (sucursalActividadDosificacion) {
											var dosificacion = sucursalActividadDosificacion.dosificacion;
											venta.factura = dosificacion.correlativo + index;
											venta.pieFactura = dosificacion.pieFactura;
											venta.codigo_control = CodigoControl.obtenerCodigoControl(dosificacion.autorizacion.toString(),
												dosificacion.correlativo.toString(),
												venta.cliente.nit,
												formatearFecha(venta.fechaTexto.split('T')[0].split('-').reverse().join('/')).toString(),
												parseFloat(venta.total).toFixed(2),
												dosificacion.llave_digital.toString());
											venta.autorizacion = dosificacion.autorizacion.toString();
											venta.fecha_limite_emision = dosificacion.fecha_limite_emision;
											venta.numero_literal = NumeroLiteral.Convertir(parseFloat(venta.total).toFixed(2).toString());

											if (sucursalActividadDosificacion.sucursal.empresa.usar_pedidos) {
												venta.pedido = sucursalActividadDosificacion.sucursal.pedido_correlativo;
											}

											return Cliente.find({
												where: {
													id_empresa: venta.id_empresa,
													nit: venta.cliente.nit,
													razon_social: venta.cliente.razon_social
												}
												, transaction: t
											}).then(function (clienteCreado) {
												return crearVentaImportacion(venta, req, clienteCreado.id, movimientoCreado, dosificacion, true, sucursalActividadDosificacion.sucursal, t, index, array, almacenEncontrado, actividadEncontrada);
											}).catch(function (err) {
												return new Promise(function (fulfill, reject) {
													reject(err);
												});
											});

										}).catch(function (err) {
											return new Promise(function (fulfill, reject) {
												reject(err);
											});
										});
									}).catch(function (err) {
										return new Promise(function (fulfill, reject) {
											reject(err);
										});
									});
								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject(err);
									});
								});
							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							});



						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject(err);
							});
						});
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					}));

				})
				return Promise.all(promises)
			}).then(function name(result) {

				res.json({ mensaje: "Importación satisfactoriamente!" })
			}).catch(function (err) {
				res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
			})
		})
	function crearVentaImportacion(venta, req, idCliente, movimientoCreado, dosificacion, esFactura, sucursal, t, index1, array1, almacen, actividad) {
		return Venta.create({
			id_almacen: almacen.id,
			id_cliente: idCliente,
			id_movimiento: movimientoCreado.id,
			id_actividad: actividad.id,
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
			observacion: venta.observacion,
			total_descuento: venta.total_descuento_general,
			total_ice: venta.total_ice,
			total_recargo : venta.total_recargo_general,
			total_exento : venta.total_exento
		}, { transaction: t }).then(function (ventaCreada) {
			venta.ventaCreada = ventaCreada
			return Dosificacion.update({
				correlativo: (venta.factura + 1)
			}, {
					where: { id: dosificacion.id },
					transaction: t
				}).then(function (dosificacionActualizada) {
					var promises = []
					venta.detalles = []
					venta.detallesVenta.forEach(function (detalleVenta, index, array) {
						promises.push(Producto.find({
							where: { nombre: detalleVenta.producto.nombre, codigo: detalleVenta.producto.codigo, id_empresa: req.params.id_empresa },
							include: [
								{ model: Clase, as: 'tipoProducto' }, {
									model: ProductoBase, as: 'productosBase',
									include: [{ model: Producto, as: 'productoBase' }]
								}
							], transaction: t
						}).then(function (ProductoEncontrado) {
							detalleVenta.producto = ProductoEncontrado
							var condicionInventario = {
								id_producto: ProductoEncontrado.id, id_almacen: almacen.id,
								cantidad: { $gt: 0 }
							}
							if (detalleVenta.lote) {
								condicionInventario.lote = detalleVenta.lote
							}
							if (detalleVenta.fecha_vencimiento) {
								var inicio = new Date(detalleVenta.fecha_vencimiento); inicio.setHours(0, 0, 0, 0, 0);
								var fin = new Date(detalleVenta.fecha_vencimiento); fin.setHours(23, 59, 59, 0, 0);

								condicionInventario.fecha_vencimiento = { $between: [inicio, fin] }
							}
							return Inventario.findAll({
								where: condicionInventario, transaction: t,
								order: [['id', 'asc']]
							}).then(function (encontrado) {
								detalleVenta.costos = encontrado
								agregarDetalleVenta(t, req, movimientoCreado, ventaCreada, detalleVenta, venta, ProductoEncontrado, encontrado, sucursal, index, array)
								//venta.detalles.concat(detalleVenta2)
							}).catch(function (err) {
								return new Promise(function (fulfill, reject) {
									reject(err);
								});
							});
						}))

					})

					return Promise.all(promises)

				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject(err);
			});
		});
	}
	function agregarDetalleVenta(t, req, movimientoCreado, ventaCreada, detalleVenta, venta, ProductoEncontrado, encontrado, sucursal, index, array) {
		detalleVenta.producto = ProductoEncontrado
		detalleVenta.costos = encontrado
		if (detalleVenta.producto.id) {
			if (detalleVenta.producto.activar_inventario) {
				if (detalleVenta.costos.length > 1) {
					var datosDetalle = [], cantidadTotal = detalleVenta.cantidad, i = 0, detalleVentaOriginal = JSON.parse(JSON.stringify(detalleVenta));
					while (i < detalleVenta.costos.length && cantidadTotal > 0) {
						detalleVenta.inventarioProducto = detalleVenta.costos[i];
						if (detalleVenta.descuento > 0) {
							if (detalleVenta.tipo_descuento) {
								venta.total_descuento_general += (((detalleVenta.precio_unitario * detalleVenta.descuento) / 100) * detalleVenta.cantidad)
							} else {
								venta.total_descuento_general += detalleVenta.descuento
							}
						}
						if (detalleVenta.recargo > 0) {
							if (detalleVenta.tipo_recargo) {
								venta.total_recargo += (((detalleVenta.precio_unitario * detalleVenta.recargo) / 100) * detalleVenta.cantidad)
							} else {
								venta.total_recargo += detalleVenta.recargo
							}
						}
						var paraRectificacionDescuento = []
						while (i < detalleVenta.costos.length && cantidadTotal > 0) {
							detalleVenta.inventarioProducto = detalleVenta.costos[i];
							var cantidadDisponible = obtenerInventarioTotalPorFechaVencimiento(detalleVenta, datosDetalle);
							if (cantidadDisponible > 0) {
								var nuevoDetalleVenta = JSON.parse(JSON.stringify(detalleVentaOriginal));
								var cantidadParcial;

								if (cantidadTotal > cantidadDisponible) {
									cantidadParcial = cantidadDisponible;
									cantidadTotal = cantidadTotal - cantidadDisponible
								} else {
									cantidadParcial = cantidadTotal;
									cantidadTotal = 0;
								}
								nuevoDetalleVenta.cantidad = cantidadParcial;
								if (sucursal.empresa.usar_vencimientos) {
									nuevoDetalleVenta.fecha_vencimiento = detalleVenta.costos[i].fecha_vencimiento;
									nuevoDetalleVenta.lote = detalleVenta.costos[i].lote;
								}
								nuevoDetalleVenta.costos = [];
								nuevoDetalleVenta.costos.push(detalleVenta.costos[i]);
								nuevoDetalleVenta.inventario = detalleVenta.costos[i];
								paraRectificacionDescuento.push(nuevoDetalleVenta);
								//nuevoDetalleVenta = calcularImporte(nuevoDetalleVenta, detalleVenta.ice, detalleVenta.excento);
								//venta.detalles.push(nuevoDetalleVenta);
							}
						}
						i++;
					}
					var totalDescuento = detalleVenta.descuento ? detalleVenta.descuento > 0 ? (detalleVenta.descuento / detalleVenta.cantidad) : 0 : 0
					var totalRecargo = detalleVenta.recargo ? detalleVenta.recargo > 0 ? (detalleVenta.recargo / detalleVenta.cantidad) : 0 : 0
					var total_ice = detalleVenta.ice ? detalleVenta.ice > 0 ? (detalleVenta.ice / detalleVenta.cantidad) : 0 : 0
					var total_exento = detalleVenta.excento ? detalleVenta.excento > 0 ? (detalleVenta.excento / detalleVenta.cantidad) : 0 : 0
					if (!detalleVenta.tipo_descuento) {
						venta.total_descuento_general = detalleVenta.descuento;
						for (var index = 0; index < paraRectificacionDescuento.length; index++) {
							paraRectificacionDescuento[index].descuento = Math.round((totalDescuento * paraRectificacionDescuento[index].cantidad) * 100) / 100
						}
					}
					if (!detalleVenta.tipo_recargo) {
						venta.total_recargo_general = detalleVenta.recargo;
						for (var index = 0; index < paraRectificacionDescuento.length; index++) {
							paraRectificacionDescuento[index].recargo = Math.round((totalRecargo * paraRectificacionDescuento[index].cantidad) * 100) / 100
						}
					}
					if (total_ice > 0) {
						venta.total_ice = detalleVenta.ice;
						for (var index = 0; index < paraRectificacionDescuento.length; index++) {
							paraRectificacionDescuento[index].ice = Math.round((total_ice * paraRectificacionDescuento[index].cantidad) * 100) / 100
						}
					}
					if (total_exento > 0) {
						venta.total_exento = detalleVenta.excento;
						for (var index = 0; index < paraRectificacionDescuento.length; index++) {
							paraRectificacionDescuento[index].excento = Math.round((total_exento * paraRectificacionDescuento[index].cantidad) * 100) / 100
						}
					}
					for (var index = 0; index < paraRectificacionDescuento.length; index++) {
						var detalleCorregido = calcularImporte(paraRectificacionDescuento[index], paraRectificacionDescuento[index].ice, paraRectificacionDescuento[index].excento);
						venta.detalles.push(detalleCorregido);
					}
				} else {
					if (detalleVenta.costos.length > 0) {
						if (sucursal.empresa.usar_vencimientos) {
							detalleVenta.fecha_vencimiento = detalleVenta.costos[0].fecha_vencimiento;
							detalleVenta.lote = detalleVenta.costos[0].lote;
							detalleVenta.inventario = detalleVenta.costos[0];
						}
					}
					detalleVenta = calcularImporte(detalleVenta, detalleVenta.ice, detalleVenta.excento);
					venta.detalles.push(detalleVenta);
				}



			} else {
				detalleVenta = calcularImporte(detalleVenta, detalleVenta.ice, detalleVenta.excento);
				venta.detalles.push(detalleVenta);
			}

		}
		if (index == (array.length - 1)) {
			sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED }, function (tu) {
				promises2 = []
				venta.detalles.forEach(function (detalleVenta, index, array) {
					promises2.push(crearDetalleVentaImportacion(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, req, venta, tu, sucursal));
				});
				return Promise.all(promises2)
			}).then(function (result) {
				return new Promise(function (fulfill, reject) {
					fulfill();
				});
			}).catch(function (err) {
				return new Promise(function (fulfill, reject) {
					reject(err);
				});
			});
		}

	}
	function obtenerInventarioTotalPorFechaVencimiento(detalleVenta, datosDetalle) {

		var cantidadTotal = detalleVenta.inventarioProducto.cantidad;
		if (datosDetalle.length > 0) {
			for (var j = 0; j < datosDetalle.length; j++) {
				if (datosDetalle[j].producto.id == detalleVenta.producto.id && datosDetalle[j].costos[0].id == detalleVenta.inventarioProducto.id && !datosDetalle[j].id) {
					cantidadTotal = cantidadTotal - datosDetalle[j].cantidad;
				}
			}
		}
		return cantidadTotal;


	}
	function calcularImporte(detalleVenta, ice, excento) {
		detalleVenta.importe = Math.round((detalleVenta.cantidad * detalleVenta.precio_unitario) * 1000) / 1000;
		var descuento, recargo;
		if (detalleVenta.tipo_descuento) {
			descuento = detalleVenta.importe * (detalleVenta.descuento / 100);
		} else {
			descuento = detalleVenta.descuento;
		}
		if (detalleVenta.tipo_recargo) {
			recargo = detalleVenta.importe * (detalleVenta.recargo / 100);
		} else {
			recargo = detalleVenta.recargo;
		}
		detalleVenta.total = Math.round((detalleVenta.importe - descuento + recargo - ice - excento) * 1000) / 1000;
		return detalleVenta
	}
	function crearDetalleVentaImportacion(movimientoCreado, ventaCreada, detalleVenta, precio_unitario, importe, total, index, array, req, venta, t, sucursal) {

		console.log("la sucursalllllll ============================================== ", sucursal);
		if (sucursal.empresa.dataValues.usar_peps) {
			if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
				return calcularCostosEgresosImportacion(detalleVenta, detalleVenta.producto, detalleVenta.cantidad, detalleVenta.costos,
					movimientoCreado, index, array, req, venta, t, ventaCreada);
			} else if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
				var promises = [];
				for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
					if ((i + 1) == detalleVenta.producto.productosBase.length) {
						promises.push(calcularCostosEgresosImportacion(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
							movimientoCreado, index, array, req, venta, t, ventaCreada));
					} else {
						promises.push(calcularCostosEgresosImportacion(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
							movimientoCreado, index - 1, array, req, venta, t, ventaCreada));
					}
				}
				return Promise.all(promises);
			} else {
				var promises = [];
				for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
					if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
						if ((i + 1) == detalleVenta.producto.productosBase.length) {
							promises.push(calcularCostosEgresosImportacion(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
								movimientoCreado, index, array, req, venta, t, ventaCreada));
						} else {
							promises.push(calcularCostosEgresosImportacion(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
								movimientoCreado, index - 1, array, req, venta, t, ventaCreada));
						}
					} else if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
						var innerpromises = [];
						for (var j = 0; j < detalleVenta.producto.productosBase[i].productoBase.productosBase.length; j++) {
							if ((j + 1) == detalleVenta.producto.productosBase[i].productoBase.productosBase.length) {
								innerpromises.push(calcularCostosEgresosImportacion(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
									detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
									detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index, array, req, venta, t, ventaCreada));
							} else {
								innerpromises.push(calcularCostosEgresosImportacion(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
									detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
									detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index - 1, array, req, venta, t, ventaCreada));
							}
						}
						promises.push(Promise.all(innerpromises));
					}
				}
				return Promise.all(promises);
			}
		}

	}
	function calcularCostosEgresosImportacion(detalleVenta, producto, cantidad, inventarios, movimientoCreado, index, array, req, venta, t, detalleVentaCreada) {
		var cantidadTotal = cantidad;
		var condicionInventario = {
			id_producto: producto.id, id_almacen: venta.almacen.id,
			cantidad: { $gt: 0 }
		}
		if (detalleVenta.lote) {
			condicionInventario.lote = detalleVenta.lote
		}
		if (detalleVenta.fecha_vencimiento) {
			var inicio = new Date(detalleVenta.fecha_vencimiento); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(detalleVenta.fecha_vencimiento); fin.setHours(23, 59, 59, 0, 0);

			condicionInventario.fecha_vencimiento = { $between: [inicio, fin] }
		}

		if (producto.activar_inventario) {
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
							return DetalleVenta.create({
								id_venta: venta.ventaCreada.id,
								id_producto: detalleVenta.producto.id,
								precio_unitario: detalleVenta.precio_unitario,
								cantidad: detalleVenta.cantidad,
								importe: importe,
								descuento: detalleVenta.descuento,
								recargo: detalleVenta.recargo,
								ice: detalleVenta.ice,
								excento: detalleVenta.excento,
								tipo_descuento: detalleVenta.tipo_descuento.toUpperCase() == "%" ? true : false,
								tipo_recargo: detalleVenta.tipo_recargo.toUpperCase() == "%" ? true : false,
								total: total,
								fecha_vencimiento: detalleVenta.fecha_vencimiento,
								lote: detalleVenta.lote,
								id_inventario: (detalleVenta.costos.length > 0) ? detalleVenta.costos[0].id : null
							}, { transaction: t }).then(function (detalleVentaCreada) {
								return crearMovimientoEgresoYActualizarInventarioImportacion(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, req, venta, t, detalleVentaCreada);
							})
						}
					} else {

					}
				}
				return Promise.all(promises);
			} else {

				return new Promise(function (fulfill, reject) {
					fulfill(venta);
				});

			}
		} else {

			return new Promise(function (fulfill, reject) {
				fulfill(venta);
			});

		}

	}
	function crearMovimientoEgresoYActualizarInventarioImportacion(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, costo, index, array, i, res, datosVenta, t, detalleVentaCreada) {
		return DetalleMovimiento.create({
			id_movimiento: movimientoCreado.id,
			id_producto: producto.id,
			cantidad: cantidadParcial,
			costo_unitario: costo.costo_unitario,
			importe: (cantidadParcial * costo.costo_unitario),
			total: (cantidadParcial * costo.costo_unitario),
			descuento: ((detalleVenta.descuento / cantidad) * cantidadParcial),
			recargo: ((detalleVenta.recargo / cantidad) * cantidadParcial),
			ice: ((detalleVenta.ice / cantidad) * cantidadParcial),
			excento: ((detalleVenta.excento / cantidad) * cantidadParcial),
			tipo_descuento: detalleVenta.tipo_descuento.toUpperCase() == "%" ? true : false,
			tipo_recargo: detalleVenta.tipo_recargo.toUpperCase() == "%" ? true : false,
			fecha_vencimiento: detalleVenta.fecha_vencimiento,
			lote: detalleVenta.lote,
			id_inventario: costo.id
		}, { transaction: t }).then(function (detalleMovimientoCreado) {
			return DetalleVentaProductoFinal.create({
				id_detalle_venta: detalleVentaCreada.id,
				id_detalle_movimiento: detalleMovimientoCreado.id
			},
				{ transaction: t }).then(function (creado) {
					sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED }, function (tu) {
						return Inventario.find({
							where: {
								id: costo.id
							},
							transaction: tu,
							lock: tu.LOCK.UPDATE
						}).then(function (inventario) {
							return Inventario.update({
								cantidad: inventario.cantidad - cantidadParcial,
								costo_total: ((inventario.cantidad - cantidadParcial) * costo.costo_unitario)
							}, {
									where: {
										id: inventario.id
									},
									transaction: tu
								}).then(function (result) {
									contador++
									return new Promise(function (fulfill, reject) {
										fulfill(datosVenta);
									});
								});
						});
					}).then(function (result) {
						return new Promise(function (fulfill, reject) {
							fulfill(datosVenta);
						});
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject(err);
						});
					});
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
		}).catch(function (err) {
			return new Promise(function (fulfill, reject) {
				reject(err);
			});
		});
	}

	router.route('/importar-pagos-compra/empresa/:id_empresa')
		.post(function (req, res) {
			Clase.find({
				where: { nombre_corto: 'ID' }
			}).then(function (conceptoMovimiento) {
				var promises = []
				var a_cuenta = 0
				var saldo = 0
				sequelize.transaction(function (t) {
					req.body.pagos.forEach(function (pago, index, array) {
						promises.push(Compra.find({
							where: { factura: pago.factura },
							include: [{ model: Movimiento, as: 'movimiento', where: { id_clase: conceptoMovimiento.id } }, {
								model: Almacen, as: 'almacen',
								include: [{ model: Sucursal, as: 'sucursal', where: { id_empresa: req.params.id_empresa, id: pago.sucursal.id } }]
							}],
							transaction: t
						}).then(function (compraEncontrada) {
							var pagoV = pago.monto

							if (index == 0) {
								a_cuenta = compraEncontrada.a_cuenta
								saldo = compraEncontrada.saldo
							} else {
								var i = index - 1
								if (pago.factura == req.body.pagos[i].factura) {
									a_cuenta = a_cuenta + req.body.pagos[i].monto
									saldo = saldo - req.body.pagos[i].monto
								} else {
									a_cuenta = compraEncontrada.a_cuenta
									saldo = compraEncontrada.saldo
								}
							}
							return Compra.update({
								a_cuenta: a_cuenta + pagoV,
								saldo: compraEncontrada.total - (a_cuenta + pagoV)
							}, {
									where: {
										id: compraEncontrada.id
									},
									transaction: t
								}).then(function (affectedRows) {
									if (index == 0) {
										a_cuenta = compraEncontrada.a_cuenta
										saldo = compraEncontrada.saldo
									} else {
										var i = index - 1
										if (pago.factura == req.body.pagos[i].factura) {
											a_cuenta = a_cuenta + req.body.pagos[i].monto
											saldo = saldo - req.body.pagos[i].monto
										} else {
											a_cuenta = compraEncontrada.a_cuenta
											saldo = compraEncontrada.saldo
										}
									}
									return PagoCompra.create({
										id_compra: compraEncontrada.id,
										a_cuenta_anterior: a_cuenta,
										saldo_anterior: saldo,
										monto_pagado: pagoV,
										id_usuario: pago.id_usuario_cajero,
										numero_documento: compraEncontrada.almacen.sucursal.nota_recibo_correlativo + (index)
									}, {
											transaction: t
										}).then(function (detalleVentaCreada) {
											return Sucursal.update({
												nota_recibo_correlativo: compraEncontrada.almacen.sucursal.nota_recibo_correlativo + (index + 1)
											}, {
													where: {
														id: compraEncontrada.almacen.sucursal.id
													},
													transaction: t
												}).then(function (affectedRows) {
													return new Promise(function (fulfill, reject) {
														fulfill();
													});
													return new Promise(function (fulfill, reject) {
														fulfill();
													});
													//logica de anticipos va aqui
												}).catch(function (err) {
													return new Promise(function (fulfill, reject) {
														reject(err);
													});
												});
										}).catch(function (err) {
											return new Promise(function (fulfill, reject) {
												reject(err);
											});
										});
								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject(err);
									});
								});
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject(err);
							});
						}));
					})
					return Promise.all(promises)
				}).then(function name(result) {
					res.json({ mensaje: "Importación satisfactoriamente!" })
				}).catch(function (err) {
					res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
				})
			})
		})
		router.route('/importar-pagos-ventas/empresa/:id_empresa')
		.post(function (req, res) {
			Clase.find({
				where: { nombre_corto:Diccionario.EGRE_FACTURACION }
			}).then(function (conceptoMovimiento) {
				var promises = []
				var a_cuenta = 0
				var saldo = 0
				sequelize.transaction(function (t) {
					req.body.pagos.forEach(function (pago, index, array) {
						promises.push(Venta.find({
							where: { factura: pago.factura,autorizacion:pago.autorizacion },
							include: [{
								model: Almacen, as: 'almacen',
								include: [{ model: Sucursal, as: 'sucursal',where:{id_empresa:req.params.id_empresa} },
								]
							}, {
								model: Movimiento, as: 'movimiento' ,where: { id_clase: conceptoMovimiento.id },
								include: [{ model: Clase, as: 'clase' }]
							}],
							transaction: t
						}).then(function (ventaEncontrada) {
							var pagoV = pago.monto
							if (index == 0) {
								a_cuenta = ventaEncontrada.a_cuenta
								saldo = ventaEncontrada.saldo
							} else {
								var i = index - 1
								if (pago.factura == req.body.pagos[i].factura) {
									a_cuenta = a_cuenta + req.body.pagos[i].monto
									saldo = saldo - req.body.pagos[i].monto
								} else {
									a_cuenta = ventaEncontrada.a_cuenta
									saldo = ventaEncontrada.saldo
								}
							}
							return Venta.update({
								a_cuenta: a_cuenta + pagoV,
								saldo: ventaEncontrada.total - (a_cuenta + pagoV)
							}, {
									where: {
										id: ventaEncontrada.id
									},
									transaction: t
								}).then(function (affectedRows) {
									if (index == 0) {
										a_cuenta = ventaEncontrada.a_cuenta
										saldo = ventaEncontrada.saldo
									} else {
										var i = index - 1
										if (pago.factura == req.body.pagos[i].factura) {
											a_cuenta = a_cuenta + req.body.pagos[i].monto
											saldo = saldo - req.body.pagos[i].monto
										} else {
											a_cuenta = ventaEncontrada.a_cuenta
											saldo = ventaEncontrada.saldo
										}
									}
									return PagoVenta.create({
										id_venta: ventaEncontrada.id,
										a_cuenta_anterior: a_cuenta,
										saldo_anterior: saldo,
										monto_pagado: pagoV,
										id_usuario: pago.id_usuario_cajero,
										numero_documento: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo + (index)
									}, {
											transaction: t
										}).then(function (detalleVentaCreada) {
											return Sucursal.update({
												nota_recibo_correlativo: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo + (index + 1)
											}, {
													where: {
														id: ventaEncontrada.almacen.sucursal.id
													},
													transaction: t
												}).then(function (affectedRows) {
													return new Promise(function (fulfill, reject) {
														fulfill();
													});
													return new Promise(function (fulfill, reject) {
														fulfill();
													});
													//logica de anticipos va aqui
												}).catch(function (err) {
													return new Promise(function (fulfill, reject) {
														reject(err);
													});
												});
										}).catch(function (err) {
											return new Promise(function (fulfill, reject) {
												reject(err);
											});
										});
								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject(err);
									});
								});
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject(err);
							});
						}));
					})
					return Promise.all(promises)
				}).then(function name(result) {
					res.json({ mensaje: "Importación satisfactoriamente!" })
				}).catch(function (err) {
					res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
				})
			})
		})
}
