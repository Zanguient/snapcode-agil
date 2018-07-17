module.exports = function (router, ensureAuthorized, forEach, Compra, DetalleCompra, Almacen, Sucursal, Empresa, sequelize, Sequelize,
	Tipo, Clase, Proveedor, Producto, Movimiento, DetalleMovimiento, Inventario, Venta, DetalleVenta,
	Cliente, CodigoControl, NumeroLiteral, Diccionario, SucursalActividadDosificacion, Dosificacion,
	ConfiguracionGeneralFactura, ConfiguracionFactura, PagoVenta, PagoCompra, Usuario, DetalleVentaNoConsolidada, ClienteCuenta, ContabilidadCuenta, ProveedorCuenta, UsuarioGrupos, Pedido, DetallesPedido, ProductoBase) {
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
							{ model: Clase, as: 'tipoProducto' },{
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
					res.json({ productos: [], mensaje: 'El usuario no cuenta con grupos de productos asignados.', paginas: Math.ceil(productos.count / req.params.items_pagina) });
				}
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
			Compra.findAll({
				where: condicionCompra,
				include: [/* {model:Clase,as:'tipoMovimiento'},{ model: Sucursal, as: 'sucursal',where: condicionSucursal }, */ {
					model: Movimiento, as: 'movimiento',
					include: [{ model: Clase, as: 'clase' }]
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
					var compras = entity.concat(entity2);

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
															id_producto: detalleCompra.producto.id
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
						a_cuenta: compraEncontrada.a_cuenta + req.body.pago,
						saldo: compraEncontrada.total - (compraEncontrada.a_cuenta + req.body.pago)
					}, {
							where: {
								id: compraEncontrada.id
							}
						}).then(function (affectedRows) {
							PagoCompra.create({
								id_compra: compraEncontrada.id,
								a_cuenta_anterior: compraEncontrada.a_cuenta,
								saldo_anterior: compraEncontrada.saldo,
								monto_pagado: req.body.pago,
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
										var pago = NumeroLiteral.Convertir(parseFloat(req.body.pago).toFixed(2).toString());
										res.json({ mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, compra: compraEncontrada });
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
								});
							} else {
								crearCompra(compra, res, compra.proveedor.id, movimientoCreado.id, conceptoMovimiento.id);
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
									crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, productoCreado.id, centroCostoCreado.id, res, compra);
								});
							});
						} else {
							crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, productoCreado.id, detalleCompra.centroCosto.id, res, compra);
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
								crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, centroCostoCreado.id, res, compra);
							});
						});
					} else {
						crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra);
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
		});
	}

	function crearDetalleCompra(detalleCompra, idMovimiento, idCompra, idAlmacen, idProducto, idCentroCosto, res, compra) {
		if (detalleCompra.centroCosto.nombre_corto == "ALM") {
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
													res.json({ message: lenregistrados < mensajeRegistrados.length &&  lennoregistrados == mensajeNoRegistrados.length ? mensajeRegistrados :lennoregistrados < mensajeNoRegistrados.length && lenregistrados == mensajeRegistrados.length ? mensajeNoRegistrados : mensajeRegistrados + "<|||>." + mensajeNoRegistrados });
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

	router.route('/ventas')
		.post(function (req, res) {
			sequelize.transaction(function (t) {
				var movimiento = req.body.movimiento.nombre_corto;
				var id_movimiento = req.body.movimiento.id;
				var venta = req.body;
				var factura = {};
				factura.venta = venta;

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
								transaction: t
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
												{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
												{ model: Clase, as: 'tamanoPapelNotaBaja' },
												{ model: Clase, as: 'tamanoPapelNotaPedido' },
												{ model: Clase, as: 'tamanoPapelCierreCaja' }]
											}).then(function (configuracionGeneralFactura) {
												if (configuracionGeneralFactura.usar) {
													var promises = [];
													venta.configuracion = configuracionGeneralFactura;
													venta.detallesVenta.forEach(function (detalleVenta, index, array) {
														promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, -detalleVenta.precio_unitario, -detalleVenta.importe, -detalleVenta.total, index, array, res, venta, t));
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
														{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
														{ model: Clase, as: 'tamanoPapelNotaBaja' },
														{ model: Clase, as: 'tamanoPapelNotaPedido' },
														{ model: Clase, as: 'tamanoPapelCierreCaja' }]
													}).then(function (configuracionFactura) {
														var promises = [];
														venta.configuracion = configuracionFactura;
														venta.detallesVenta.forEach(function (detalleVenta, index, array) {
															promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, -detalleVenta.precio_unitario, -detalleVenta.importe, -detalleVenta.total, index, array, res, venta, t));
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
								transaction: t
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
															{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
															{ model: Clase, as: 'tamanoPapelNotaBaja' },
															{ model: Clase, as: 'tamanoPapelNotaPedido' },
															{ model: Clase, as: 'tamanoPapelCierreCaja' }]
														}).then(function (configuracionGeneralFactura) {
															if (configuracionGeneralFactura.usar) {
																var promises = [];
																venta.configuracion = configuracionGeneralFactura;
																venta.detallesVenta.forEach(function (detalleVenta, index, array) {
																	promises.push(calcularCostosIngresos(detalleVenta, movimientoIngresoCreado, venta.almacenDestino.id, venta, t));
																	promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t));
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
																	{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
																	{ model: Clase, as: 'tamanoPapelNotaBaja' },
																	{ model: Clase, as: 'tamanoPapelNotaPedido' },
																	{ model: Clase, as: 'tamanoPapelCierreCaja' }]
																}).then(function (configuracionFactura) {
																	var promises = [];
																	venta.configuracion = configuracionFactura;
																	venta.detallesVenta.forEach(function (detalleVenta, index, array) {
																		promises.push(calcularCostosIngresos(detalleVenta, movimientoIngresoCreado, venta.almacenDestino.id, venta, t));
																		promises.push(crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, detalleVenta.precio_unitario, detalleVenta.importe, detalleVenta.total, index, array, res, venta, t));
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
			}).then(function (result) {
				console.log(result);
				var resV = (result.length ? (result[0].length ? (result[0][0].length ? (result[0][0][0].length ? result[0][0][0][0] : result[0][0][0]) : result[0][0]) : result[0]) : result);
				res.json(resV);
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
			});
		});

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
			id_vendedor: (venta.vendedor ? venta.vendedor.id : null)
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

	function crearMovimientoEgresoYActualizarInventario(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, costo, index, array, i, res, datosVenta, t) {
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
		});
	}

	function calcularCostosEgresos(detalleVenta, producto, cantidad, inventarios, movimientoCreado, index, array, res, venta, t) {
		var cantidadTotal = cantidad;
		var condicionInventario={
			id_producto: producto.id, id_almacen: venta.almacen.id,
			cantidad: { $gt: 0 }
		}
		if(detalleVenta.lote){
			condicionInventario.lote=detalleVenta.lote
		} 
		if(detalleVenta.fecha_vencimiento){
			var inicio = new Date(detalleVenta.fecha_vencimiento); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(detalleVenta.fecha_vencimiento); fin.setHours(23, 59, 59, 0, 0);

			condicionInventario.fecha_vencimiento={ $between: [inicio, fin] }
		} 
	/* 	if (inventarios.length == 0) { */
			return Inventario.findAll({
				where:condicionInventario , transaccion: t,
				order:[['id','asc']]

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
									var rrr = crearMovimientoEgresoYActualizarInventario(movimientoCreado, detalleVenta, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, res, venta, t);
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
		// 						//console.log(rrr);
		// 						promises.push(new Promise(function (fulfill, reject) {
		// 							fulfill(venta);
		// 						}));
		// 					} /*else {
		// 				//if (index == (array.length - 1) && i == (inventarios.length - 1)) {
		// 					//res.json(venta);
		// 					promises.push(new Promise(function (fulfill, reject){
		// 						fulfill(venta);
		// 					}));
		// 				//}
		// 			}*/
		// 				} else {
		// 					//if (index == (array.length - 1) && i == (inventarios.length - 1)) {
		// 					//res.json(venta);
		// 					/*promises.push(new Promise(function (fulfill, reject){
		// 						fulfill(venta);
		// 					}));*/
		// 					//}
		// 				}
		// 			}
		// 			return Promise.all(promises);
		// 		} else {
		// 			//if (index == (array.length - 1)) {
		// 			return new Promise(function (fulfill, reject) {
		// 				fulfill(venta);
		// 			});
		// 			//}
		// 		}
		// 	} else {
		// 		//if (index == (array.length - 1)) {
		// 		return new Promise(function (fulfill, reject) {
		// 			fulfill(venta);
		// 		});
		// 		//}
		// 	}
		// }
	}

	function crearDetalleVenta(movimientoCreado, ventaCreada, detalleVenta, precio_unitario, importe, total, index, array, res, venta, t) {
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
			if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
				return calcularCostosEgresos(detalleVenta, detalleVenta.producto, detalleVenta.cantidad, detalleVenta.costos,
					movimientoCreado, index, array, res, venta, t);
			} else if (detalleVenta.producto.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
				var promises = [];
				for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
					if ((i + 1) == detalleVenta.producto.productosBase.length) {
						promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
							movimientoCreado, index, array, res, venta, t));
					} else {
						promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
							movimientoCreado, index - 1, array, res, venta, t));
					}
				}
				return Promise.all(promises);
			} else {
				var promises = [];
				for (var i = 0; i < detalleVenta.producto.productosBase.length; i++) {
					if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_BASE) {
						if ((i + 1) == detalleVenta.producto.productosBase.length) {
							promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
								movimientoCreado, index, array, res, venta, t));
						} else {
							promises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase, detalleVenta.producto.productosBase[i].formulacion * detalleVenta.cantidad, detalleVenta.producto.productosBase[i].productoBase.inventarios,
								movimientoCreado, index - 1, array, res, venta, t));
						}
					} else if (detalleVenta.producto.productosBase[i].productoBase.tipoProducto.nombre_corto == Diccionario.TIPO_PRODUCTO_INTERMEDIO) {
						var innerpromises = [];
						for (var j = 0; j < detalleVenta.producto.productosBase[i].productoBase.productosBase.length; j++) {
							if ((j + 1) == detalleVenta.producto.productosBase[i].productoBase.productosBase.length) {
								innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
									detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
									detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index, array, res, venta, t));
							} else {
								innerpromises.push(calcularCostosEgresos(detalleVenta, detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase,
									detalleVenta.producto.productosBase[i].formulacion * detalleVenta.producto.productosBase[i].productoBase.productosBase[j].formulacion * detalleVenta.cantidad,
									detalleVenta.producto.productosBase[i].productoBase.productosBase[j].productoBase.inventarios, movimientoCreado, index - 1, array, res, venta, t));
							}
						}
						promises.push(Promise.all(innerpromises));
					}
				}
				return Promise.all(promises);
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
					include: [{ model: Producto, as: 'producto' }]
				},
				{ model: Clase, as: 'tipoPago' },
				{ model: Usuario, as: 'usuario', where: condicionUsuario },
				{ model: Cliente, as: 'cliente', where: condicionCliente, required: clienteRequerido },
				{
					model: Movimiento, as: 'movimiento',
					include: [{ model: Clase, as: 'clase', where: condicionTransaccion }]
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
				}]
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/ventas/:id/empresa/:id_empresa')
		.get(function (req, res) {
			Venta.find({
				where: {
					id: req.params.id
				},
				include: [{ model: Cliente, as: 'cliente' },
				{
					model: DetalleVenta, as: 'detallesVenta',
					include: [{ model: Producto, as: 'producto' },
					{ model: Inventario, as: 'inventario' }]
				},
				{ model: Almacen, as: 'almacen', include: [{ model: Sucursal, as: 'sucursal' }] },
				{ model: Almacen, as: 'almacenTraspaso', include: [{ model: Sucursal, as: 'sucursal' }], required: false },
				{ model: Clase, as: 'actividad' },
				{ model: Clase, as: 'tipoPago' },
				{ model: Movimiento, as: 'movimiento', include: [{ model: Clase, as: 'clase' }] }]

			}).then(function (venta) {
				venta.sucursal = venta.almacen.sucursal;
				if (venta.movimiento.clase.nombre_corto == Diccionario.EGRE_FACTURACION ||
					venta.movimiento.clase.nombre_corto == Diccionario.EGRE_PROFORMA) {
					venta.numero_literal = NumeroLiteral.Convertir(parseFloat(venta.total).toFixed(2).toString());
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
					{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
					{ model: Clase, as: 'tamanoPapelNotaBaja' },
					{ model: Clase, as: 'tamanoPapelNotaPedido' },
					{ model: Clase, as: 'tamanoPapelCierreCaja' }]
				}).then(function (configuracionGeneralFactura) {
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
									{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
									{ model: Clase, as: 'tamanoPapelNotaBaja' },
									{ model: Clase, as: 'tamanoPapelNotaPedido' },
									{ model: Clase, as: 'tamanoPapelCierreCaja' }]
								}).then(function (configuracionFactura) {
									res.json({
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
								{ model: Clase, as: 'subtituloFactura' }]
							}).then(function (configuracionFactura) {
								res.json({
									venta: venta,
									configuracion: configuracionFactura,
									sucursal: venta.sucursal,
									numero_literal: venta.numero_literal, sucursalDestino: ((venta.almacenTraspaso) ? venta.almacenTraspaso.sucursal : null)
								});
							});
						}
					}
				});
			});
		})

		.put(function (req, res) {
			Venta.find({
				where: { id: req.params.id },
				include: [{
					model: Almacen, as: 'almacen',
					include: [{ model: Sucursal, as: 'sucursal' }]
				}]
			}).then(function (ventaEncontrada) {
				Venta.update({
					a_cuenta: ventaEncontrada.a_cuenta + req.body.pago,
					saldo: ventaEncontrada.total - (ventaEncontrada.a_cuenta + req.body.pago)
				}, {
						where: {
							id: ventaEncontrada.id
						}
					}).then(function (affectedRows) {
						PagoVenta.create({
							id_venta: ventaEncontrada.id,
							a_cuenta_anterior: ventaEncontrada.a_cuenta,
							saldo_anterior: ventaEncontrada.saldo,
							monto_pagado: req.body.pago,
							id_usuario: req.body.id_usuario_cajero,
							numero_documento: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo
						}).then(function (detalleVentaCreada) {
							Sucursal.update({
								nota_recibo_correlativo: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo + 1
							}, {
									where: {
										id: ventaEncontrada.almacen.sucursal.id
									}
								}).then(function (affectedRows) {
									var pago = NumeroLiteral.Convertir(parseFloat(req.body.pago).toFixed(2).toString());
									res.json({ mensaje: "¡Saldo de cuenta actualizado satisfactoriamente!", pago: pago, venta: ventaEncontrada });
								});
						});
					});
			});
		});



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
				res.json(entity);
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
					{ model: Clase, as: 'pieFactura' }]
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
							{ model: Clase, as: 'pieFactura' }]
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
			var fin = new Date()
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
					},{model:Venta,as:'venta', where: { fecha: { $between: [inicio, fin] } },include:[{
						model: Almacen, as: 'almacen',
						include: [{
							model: Sucursal, as: 'sucursal',
							include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
						}]
					}]}], transaccion: t
				}).then(function (detallesVenta) {
					detallesVenta.forEach(function (detalleVenta, index, array) {
						if(detalleVenta.venta.activa){
						/* for (var i = 0; i < venta.detallesVenta.length; i++) { */
							/* var detalle = venta.detallesVenta[i]; */
							promises1.push(DetalleMovimiento.find({
								where: {
									id_movimiento: detalleVenta.venta.dataValues.id_movimiento, id_producto: detalleVenta.dataValues.id_producto,
									cantidad: detalleVenta.dataValues.cantidad
								}, transaccion: t
							}).then(function (detalleMovimientoEncontrado) {
								if (!detalleMovimientoEncontrado) {
									req.body.actualizados++
									return Movimiento.find({
										where: { id: detalleVenta.venta.id_movimiento }, transaccion: t
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
						}else{
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
}
