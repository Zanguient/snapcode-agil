module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmDespacho,
	GtmDespachoDetalle, Cliente, Usuario, GtmDestino, Producto, GtmTransportista, GtmEstibaje, GtmGrupoEstibaje,
	Persona, ClienteRazon, sequelize, Inventario, Movimiento, DetalleMovimiento, Tipo, Clase, Diccionario, Sequelize, Sucursal, GtmVentaKardex, GtmVentaKardexDetalle, socket, io, GtmDespachoDetalleResivo, Banco) {

	router.route('/gtm-despacho-detalle-resivo/:id_despacho')
		.post(function (req, res) {
			var promises = [];
			sequelize.transaction(function (t) {
				promises.push(GtmDespachoDetalle.update({
					pago_ac: req.body.pago_ac,
					saldo_pago_ac: req.body.saldo_pago_ac,
				}, {
						transaction: t,
						where: {
							id: req.params.id_despacho
						}
					}).then(function (despachoActualizado) {
						if (req.body.id) {
							var monto = 0
							if (req.body.tipo_moneda == false) {
								monto = req.body.monto_dolar
							} else {
								monto = req.body.monto
							}
							var idbanco = null, idOtroBanco = null;
							if (req.body.banco) {
								idbanco = req.body.banco.id
							}
							if (req.body.otroBanco) {
								idOtroBanco = req.body.otroBanco.id
							}
							if (req.body.eliminado) {
								return GtmDespachoDetalleResivo.update({
									eliminado: true,
								}, {
										where: { id: req.body.id },
										transaction: t
									}).then(function (detalleResivoCreado) {
										req.body.mensaje = "Actualizado satisfactoriamente!"
									})

							} else {
								return GtmDespachoDetalleResivo.update({
									id_sucursal: req.body.sucursal.id,
									tipo_moneda: req.body.tipo_moneda,
									id_tipo_pago: req.body.tipoPago.id,
									monto: monto,
									cambio_moneda: req.body.cambio_moneda,
									numero_cuenta: req.body.numero_cuenta,
									id_banco: idbanco,
									id_otro_banco: idOtroBanco,
									concepto: req.body.concepto,
									fecha: req.body.fecha,
								}, {
										where: { id: req.body.id },
										transaction: t
									}).then(function (detalleResivoCreado) {
										req.body.mensaje = "Actualizado satisfactoriamente!"
									})
							}

						} else {

							return Sucursal.find({
								transaction: t,
								where: {
									id: req.body.sucursal.id,//your where conditions, or without them if you need ANY entry
								}
							}).then(function (SucursalEncontrada) {
								var numero_correlativo = SucursalEncontrada.despacho_recivo_correlativo
								var monto = 0
								if (req.body.tipo_moneda == false) {
									monto = req.body.monto_dolar
								} else {
									monto = req.body.monto
								}
								var idbanco = null, idOtroBanco = null;
								if (req.body.banco) {
									idbanco = req.body.banco.id
								}
								if (req.body.otroBanco) {
									idOtroBanco = req.body.otroBanco.id
								}
								return GtmDespachoDetalleResivo.create({
									id_despacho_detalle: req.params.id_despacho,
									id_sucursal: req.body.sucursal.id,
									tipo_moneda: req.body.tipo_moneda,
									id_tipo_pago: req.body.tipoPago.id,
									monto: monto,
									cambio_moneda: req.body.cambio_moneda,
									numero_cuenta: req.body.numero_cuenta,
									id_banco: idbanco,
									id_otro_banco: idOtroBanco,
									concepto: req.body.concepto,
									fecha: req.body.fecha,
									numero_correlativo: numero_correlativo,
									eliminado: false
								}, {
										transaction: t
									}).then(function (detalleResivoCreado) {
										var numero = SucursalEncontrada.despacho_recivo_correlativo + 1;
										return Sucursal.update({
											despacho_recivo_correlativo: numero
										}, {
												transaction: t,
												where: {
													id: req.body.sucursal.id
												}
											}).then(function (sucursalActualizada) {
												return GtmDespachoDetalleResivo.find({
													transaction: t,
													where: { id: detalleResivoCreado.id },
													include: [{ model: Sucursal, as: 'sucursal', include: [{ model: Clase, as: 'departamento' }] }, { model: Clase, as: 'tipoPago' }, { model: Clase, as: 'otroBanco' }, { model: Banco, as: 'banco' }]
												}).then(function (recivoEncontrado) {
													req.body.detalleCreado = recivoEncontrado
													req.body.mensaje = "Creado satisfactoriamente!"
												})

											})
									})
							})
						}
					}))
				return Promise.all(promises);
			}).then(function (result) {
				var datos
				if (req.body.detalleCreado) {
					datos = req.body.detalleCreado
				} else {
					datos = req.body
				}
				res.json({ mensaje: req.body.mensaje, recivo: datos })
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
			});

		})
	router.route('/gtm-despacho-kardex/empresa/:id_empresa')
		.post(function (req, res) {
			GtmVentaKardex.create({
				id_usuario: req.body.id_usuario,
				fecha: new Date(req.body.fecha.split("/")[2], req.body.fecha.split("/")[1], req.body.fecha.split("/")[0]),
				id_empresa: req.params.id_empresa,
				id_cliente: req.body.id_cliente,
				id_cliente_razon: req.body.id_cliente_razon,
				factura: req.body.factura,
				observacion: req.body.observacion
			}).then(function (kardexCreado) {
				req.body.detalles_kardex.forEach(function (detalle_kardex, index, array) {
					GtmVentaKardexDetalle.create({
						id_kardex: kardexCreado.id,
						cantidad_despachada: 0,
						id_producto: detalle_kardex.id_producto,
						cantidad: parseFloat(detalle_kardex.cantidad),
						saldo: parseFloat(detalle_kardex.cantidad),
						precio_unitario: parseFloat(detalle_kardex.precio_unitario),
						servicio_transporte: parseFloat(detalle_kardex.servicio_transporte),
						entregado: false,
						fecha: new Date(req.body.fecha.split("/")[2], req.body.fecha.split("/")[1], req.body.fecha.split("/")[0]),
					}).then(function (detalleDespachoCreado) {
						if (index === (array.length - 1)) {
							res.json(detalleDespachoCreado);
						}
					});
				});
			});
		});

	router.route('/pedido-kardex/gtm-despacho/empresa/:id_empresa')
		.post(function (req, res) {
			GtmDespacho.create({
				id_cliente: req.body.id_cliente,
				id_usuario: req.body.id_usuario,
				id_destino: req.body.id_destino,
				id_cliente_razon: req.body.id_cliente_razon,
				fecha: new Date(req.body.fecha.split("/")[2], req.body.fecha.split("/")[1] - 1, req.body.fecha.split("/")[0]),
				id_empresa: req.params.id_empresa,
				observacion: req.body.observacion
			}).then(function (despachoCreado) {
				req.body.detalles_kardex.forEach(function (detalle, index, array) {
					if (detalle.saldo == 0) {
						detalle.entregado = true
					}
					// === actualizar el padre ====
					GtmVentaKardexDetalle.update({
						cantidad_despacho: detalle.cantidad - detalle.saldo,
						id_producto: detalle.id_producto,
						saldo: detalle.saldo,
						entregado: detalle.entregado,
						fecha: new Date(detalle.fecha.split("/")[2], detalle.fecha.split("/")[1], detalle.fecha.split("/")[0]),
					},
						{
							where: {
								id: detalle.id
							}
						}).then(function (detalleKardexActualizado) {
							// ==== agragar su historial con su padre =====
							GtmVentaKardexDetalle.create({
								id_kardex: detalle.id_kardex,
								cantidad_despachada: detalle.cantidad_despacho,
								id_producto: detalle.id_producto,
								cantidad: detalle.cantidad,
								saldo: detalle.saldo,
								entregado: false,
								id_padre: detalle.id,
								fecha: new Date(detalle.fecha.split("/")[2], detalle.fecha.split("/")[1], detalle.fecha.split("/")[0]),
							}).then(function (detallekardexDespachoCreado) {
								GtmDespachoDetalle.create({
									id_despacho: despachoCreado.id,
									cantidad_despacho: 0,
									id_producto: detalle.id_producto,
									cantidad: parseFloat(detalle.cantidad_pedido),
									precio_unitario: parseFloat(detalle.precio_unitario),
									importe: parseFloat(detalle.total),
									saldo: parseFloat(detalle.cantidad_pedido),
									despachado: false,
									eliminado: false,
									kardex_detalle: detallekardexDespachoCreado.id,
									fecha: new Date(req.body.fecha.split("/")[2], req.body.fecha.split("/")[1] - 1, req.body.fecha.split("/")[0]),
									servicio_transporte: (detalle.servicio_transporte ? parseFloat(detalle.servicio_transporte) * parseFloat(detalle.cantidad) : 0)
								}).then(function (detalleDespachoCreado) {
									if (index === (array.length - 1)) {
										res.json(despachoCreado);
									}
								});
							});
						});
				});
			});

		});

	// router.route('/pedido-kardex/gtm-despacho/empresa/:id_empresa')
	// 	.post(function (req, res) {

	// 		req.body.detalles_kardex.forEach(function (detalle, index, array) {
	// 			if (detalle.saldo == 0) {
	// 				detalle.entregado = true
	// 			}
	// 			// === actualizar el padre ====
	// 			GtmVentaKardexDetalle.update({
	// 				cantidad_despacho: detalle.cantidad - detalle.saldo,
	// 				id_producto: detalle.id_producto,
	// 				saldo: detalle.saldo,
	// 				entregado: detalle.entregado,
	// 				fecha: new Date(detalle.fecha.split("/")[2], detalle.fecha.split("/")[1], detalle.fecha.split("/")[0]),
	// 			},
	// 				{
	// 					where: {
	// 						id: detalle.id
	// 					}
	// 				}).then(function (detalleKardexActualizado) {
	// 					// ==== agragar su historial con su padre =====
	// 					GtmVentaKardexDetalle.create({
	// 						id_kardex: detalle.id_kardex,
	// 						cantidad_despachada: detalle.cantidad_despacho,
	// 						id_producto: detalle.id_producto,
	// 						cantidad: detalle.cantidad,
	// 						saldo: detalle.saldo,
	// 						entregado: false,
	// 						id_padre: detalle.id,
	// 						fecha: new Date(detalle.fecha.split("/")[2], detalle.fecha.split("/")[1], detalle.fecha.split("/")[0]),
	// 					}).then(function (detalleDespachoCreado) {
	// 						res.json(detalleDespachoCreado);
	// 					});
	// 				});

	// 		});

	// 	});
	router.route('/gtm-despacho-kardex-factura/empresa/:id_empresa/usuario/:id_usuario/factura/:factura')
		.get(function (req, res) {
			GtmVentaKardex.findAll({

				where: { factura: (req.params.factura == "true") ? true : false, id_empresa: req.params.id_empresa, id_usuario: req.params.id_usuario, eliminar: false },
				include: [{ model: Cliente, as: 'cliente' }, {
					model: GtmVentaKardexDetalle, as: 'detalles_kardex',
					where: { entregado: false, id_padre: null },
					include: [{ model: Producto, as: 'producto' }]
					// include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionVendedor }] },
					// { model: ClienteRazon, as: 'cliente_razon' },
					// { model: Cliente, as: 'cliente', where: condicionCliente },
					// { model: GtmDestino, as: 'destino' }]
				}],
				order: [['id', 'asc']]
			}).then(function (detallesDespacho) {
				res.json(detallesDespacho);
			});
		});
	router.route('/gtm-despacho-kardex-factura/empresa/:id_empresa/inicio/:inicio/fin/:fin/pendiente/:pendiente')
		.get(function (req, res) {
			var condicionKardex = { factura: true, id_empresa: req.params.id_empresa, eliminar: false }
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
				condicionKardex = { factura: true, id_empresa: req.params.id_empresa, fecha: { $between: [inicio, fin] }, eliminar: false };
			}
			var condicionDetalle = { entregado: false, id_padre: null, factura: { $ne: null } }
			if (req.params.pendiente == "true") {
				condicionDetalle = { entregado: false, id_padre: null, factura: null }
			}
			GtmVentaKardex.findAll({
				where: condicionKardex,
				include: [{ model: Cliente, as: 'cliente' }, { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }] }, {
					model: GtmVentaKardexDetalle, as: 'detalles_kardex',
					where: condicionDetalle,
					include: [{ model: Producto, as: 'producto' }, { model: GtmVentaKardexDetalle, as: 'hijosDetalle', include: [{ model: Producto, as: 'producto' }] }]
					// include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionVendedor }] },
					// { model: ClienteRazon, as: 'cliente_razon' },
					// { model: Cliente, as: 'cliente', where: condicionCliente },
					// { model: GtmDestino, as: 'destino' }]
				}],
				order: [['id', 'asc']]
			}).then(function (detallesDespacho) {
				res.json(detallesDespacho);
			});
		});

	router.route('/gtm-despacho/empresa/:id_empresa')
		.post(function (req, res) {
			GtmDespacho.create({
				id_cliente: req.body.id_cliente,
				id_usuario: req.body.id_usuario,
				id_destino: req.body.id_destino,
				id_cliente_razon: req.body.id_cliente_razon,
				fecha: new Date(req.body.fecha.split("/")[2], req.body.fecha.split("/")[1] - 1, req.body.fecha.split("/")[0]),
				id_empresa: req.params.id_empresa,
				observacion: req.body.observacion
			}).then(function (despachoCreado) {
				req.body.detalles_despacho.forEach(function (detalle_despacho, index, array) {
					GtmDespachoDetalle.create({
						id_despacho: despachoCreado.id,
						cantidad_despacho: 0,
						id_producto: detalle_despacho.id_producto,
						cantidad: parseFloat(detalle_despacho.cantidad),
						precio_unitario: parseFloat(detalle_despacho.precio_unitario),
						importe: parseFloat(detalle_despacho.total),
						saldo: parseFloat(detalle_despacho.cantidad),
						despachado: false,
						eliminado: false,
						fecha: new Date(req.body.fecha.split("/")[2], req.body.fecha.split("/")[1] - 1, req.body.fecha.split("/")[0]),
						servicio_transporte: (detalle_despacho.servicio_transporte ? parseFloat(detalle_despacho.servicio_transporte) * parseFloat(detalle_despacho.cantidad) : 0)
					}).then(function (detalleDespachoCreado) {
						if (index === (array.length - 1)) {
							res.json(despachoCreado);
						}
					});
				});
			});
		});

	router.route('/gtm-detalle-despacho/empresa/:id_empresa/inicio/:inicio/fin/:fin/empleado/:empleado/cliente/:cliente')
		.get(function (req, res) {
			var condicionDetalleDespacho = {
				despachado: false,
				eliminado: false,
				id_padre: null
			}
			var condicionCliente = {}
			var condicionEmpleado = {}
			var condicionDespacho = { id_empresa: req.params.id_empresa }
			if (req.params.inicio != 0 && req.params.fin != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
				condicionDespacho = { id_empresa: req.params.id_empresa, fecha: { $between: [inicio, fin] } };
			}
			if (req.params.empleado != 0) {
				condicionEmpleado = {
					nombre_completo: { $like: "%" + req.params.empleado + "%" }
				}
			}
			if (req.params.cliente != 0) {
				condicionCliente = {
					razon_social: { $like: "%" + req.params.cliente + "%" }
				}
			}
			GtmDespachoDetalle.findAll({
				where: condicionDetalleDespacho,
				include: [{
					model: GtmDespacho, as: 'despacho',
					where: condicionDespacho,
					include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionEmpleado }] },
					{ model: Cliente, as: 'cliente', where: condicionCliente },
					{ model: ClienteRazon, as: 'cliente_razon' },
					{ model: GtmDestino, as: 'destino' }]
				},
				{ model: Producto, as: 'producto' }]
			}).then(function (detallesDespacho) {
				res.json(detallesDespacho);
			});
		});

	function crearMovimientoEgresoYActualizarInventario(movimientoCreado, producto, cantidad, inventarios, cantidadParcial, costo, index, array, i, res, t) {
		console.log(cantidad);
		return DetalleMovimiento.create({
			id_movimiento: movimientoCreado.id,
			id_producto: producto.id,
			cantidad: cantidadParcial,
			costo_unitario: costo.costo_unitario,
			importe: (cantidadParcial * costo.costo_unitario),
			total: (cantidadParcial * costo.costo_unitario),
			descuento: 0,
			recargo: 0,
			ice: 0,
			excento: 0,
			tipo_descuento: 0,
			tipo_recargo: 0,
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

	function calcularCostosEgresos(tipoMovimiento, tipoEgreso, producto, cantidad, inventarios, index, array, res, t, req, detalle_despacho, a) {
		var cantidadTotal = cantidad;
		if (producto.activar_inventario) {
			if (inventarios.length > 0) {
				var promises = [];
				var totalInventario = 0
				for (var p = 0; p < inventarios.length; p++) {
					totalInventario = totalInventario + inventarios[p].cantidad;
					if (p === (inventarios.length - 1)) {
						if (totalInventario >= cantidad) {
							return GtmDespachoDetalle.find({
								transaction: t,
								where: { id: detalle_despacho.id }
							}).then(function (DespachoEncontrado2) {
								if (DespachoEncontrado2.eliminado != true) {
									return Movimiento.create({
										id_tipo: tipoMovimiento.id,
										id_clase: tipoEgreso.id,
										id_almacen: req.body.id_almacen,
										fecha: new Date()
									}, { transaction: t }).then(function (movimientoCreado) {


										var despachado = false;
										if (detalle_despacho.saldo2 == 0) {
											despachado = true
										}
										if (detalle_despacho.saldo != detalle_despacho.cantidad) {
											detalle_despacho.servicio_transporte = 0
										}
										detalle_despacho.cantidad_despacho = detalle_despacho.cantidad_despacho + detalle_despacho.cantidad_despacho2
										return GtmDespachoDetalle.update({
											cantidad_despacho: detalle_despacho.cantidad_despacho,
											saldo: detalle_despacho.saldo2,
											id_transportista: detalle_despacho.id_transportista,
											id_estibaje: detalle_despacho.id_estibaje,
											id_grupo_estibaje: detalle_despacho.id_grupo_estibaje,
											despachado: despachado
										}, {
												where: {
													id: detalle_despacho.id
												}/*,
											transaction: t*/
											}, { transaction: t }).then(function (desact) {
												return Sucursal.find({
													where: {
														id: req.body.id_sucursal,//your where conditions, or without them if you need ANY entry
													}
												}, { transaction: t }).then(function (SucursalEncontrada) {
													var numero = 0;
													numero = SucursalEncontrada.despacho_correlativo + a
													a++
													var total = detalle_despacho.servicio_transporte + (detalle_despacho.precio_unitario * detalle_despacho.cantidad_despacho2)
													return GtmDespachoDetalle.create({
														cantidad_despacho: detalle_despacho.cantidad_despacho2,
														saldo: detalle_despacho.saldo2,
														id_transportista: detalle_despacho.id_transportista,
														id_estibaje: detalle_despacho.id_estibaje,
														id_grupo_estibaje: detalle_despacho.id_grupo_estibaje,
														despachado: despachado,
														id_despacho: detalle_despacho.id_despacho,
														id_producto: detalle_despacho.id_producto,
														cantidad: detalle_despacho.cantidad,
														precio_unitario: detalle_despacho.precio_unitario,
														importe: detalle_despacho.importe,
														eliminado: false,
														id_padre: detalle_despacho.id,
														fecha: req.params.fecha,
														servicio_transporte: detalle_despacho.servicio_transporte,
														numero_correlativo: numero,
														pago_ac: 0,
														saldo_pago_ac: total,
														total: total,
														id_sucursal: req.body.id_sucursal,
														id_almacen: req.body.id_almacen,
														id_movimiento: movimientoCreado.id

													}, { transaction: t }).then(function (detalleDespachoCreado) {
														SucursalEncontrada.despacho_correlativo = SucursalEncontrada.despacho_correlativo + a
														return Sucursal.update({
															despacho_correlativo: SucursalEncontrada.despacho_correlativo
														}, {
																where: {
																	id: req.body.id_sucursal,
																}

															}, { transaction: t }).then(function (actualizado) {
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
																			//req.body.mensaje += "cliente pedido: "+detalle_despacho.despacho.cliente.razon_social+" producto: "+producto.nombre+" inventario=" + totalInventario+ "cantidad despachadas=" + cantidad+"|------|"														
																			var rrr = crearMovimientoEgresoYActualizarInventario(movimientoCreado, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, res, t);
																			//console.log(rrr);
																			promises.push(new Promise(function (fulfill, reject) {
																				fulfill({});
																			}));
																		}
																	} else {
																		//if (index == (array.length - 1) && i == (inventarios.length - 1)) {
																		//res.json(venta);
																		/*promises.push(new Promise(function (fulfill, reject){
																			fulfill(venta);
																		}));*/
																		//}
																	}
																}
															})
													})
												});
											});
									});
								} else {
									req.body.mensaje += "cliente pedido: " + detalle_despacho.despacho.cliente.razon_social + " El pedido fue eliminado."
								}
							})


						} else {
							req.body.mensaje += "cliente pedido: " + detalle_despacho.despacho.cliente.razon_social + " producto: " + producto.nombre + " inventario=" + totalInventario + "cantidad despachadas=" + cantidad + "|---|"

						}
					}
				}
				return Promise.all(promises);
			} else {
				//if (index == (array.length - 1)) {
				return new Promise(function (fulfill, reject) {
					fulfill({});
				});
				//}
			}
		} else {
			return Movimiento.create({
				id_tipo: tipoMovimiento.id,
				id_clase: tipoEgreso.id,
				id_almacen: req.body.id_almacen,
				fecha: new Date()
			}, { transaction: t }).then(function (movimientoCreado) {


				var despachado = false;
				if (detalle_despacho.saldo2 == 0) {
					despachado = true
				}
				if (detalle_despacho.saldo != detalle_despacho.cantidad) {
					detalle_despacho.servicio_transporte = 0
				}
				detalle_despacho.cantidad_despacho = detalle_despacho.cantidad_despacho + detalle_despacho.cantidad_despacho2
				return GtmDespachoDetalle.update({
					cantidad_despacho: detalle_despacho.cantidad_despacho,
					saldo: detalle_despacho.saldo2,
					id_transportista: detalle_despacho.id_transportista,
					id_estibaje: detalle_despacho.id_estibaje,
					id_grupo_estibaje: detalle_despacho.id_grupo_estibaje,
					despachado: despachado
				}, {
						where: {
							id: detalle_despacho.id
						}/*,
					transaction: t*/
					}, { transaction: t }).then(function (desact) {
						return Sucursal.find({
							where: {
								id: req.body.id_sucursal,//your where conditions, or without them if you need ANY entry
							}
						}, { transaction: t }).then(function (SucursalEncontrada) {
							var numero = 0;
							numero = SucursalEncontrada.despacho_correlativo + a
							a++
							var total = detalle_despacho.servicio_transporte + (detalle_despacho.precio_unitario * detalle_despacho.cantidad_despacho2)
							return GtmDespachoDetalle.create({
								cantidad_despacho: detalle_despacho.cantidad_despacho2,
								saldo: detalle_despacho.saldo2,
								id_transportista: detalle_despacho.id_transportista,
								id_estibaje: detalle_despacho.id_estibaje,
								id_grupo_estibaje: detalle_despacho.id_grupo_estibaje,
								despachado: despachado,
								id_despacho: detalle_despacho.id_despacho,
								id_producto: detalle_despacho.id_producto,
								cantidad: detalle_despacho.cantidad,
								precio_unitario: detalle_despacho.precio_unitario,
								importe: detalle_despacho.importe,
								eliminado: false,
								id_padre: detalle_despacho.id,
								fecha: req.params.fecha,
								servicio_transporte: detalle_despacho.servicio_transporte,
								numero_correlativo: numero,
								pago_ac: 0,
								saldo_pago_ac: total,
								total: total,
								id_sucursal: req.body.id_sucursal,
								id_almacen: req.body.id_almacen

							}, { transaction: t }).then(function (detalleDespachoCreado) {
								SucursalEncontrada.despacho_correlativo = SucursalEncontrada.despacho_correlativo + a
								return Sucursal.update({
									despacho_correlativo: SucursalEncontrada.despacho_correlativo
								}, {
										where: {
											id: req.body.id_sucursal,
										}

									}, { transaction: t }).then(function (actualizado) {
										//if (index == (array.length - 1)) {
										return new Promise(function (fulfill, reject) {
											fulfill(venta);
										});
										//}
									});
							});
						});
					});
			});
		}
	}

	router.route('/gtm-detalle-despacho/empresa/:id_empresa/fecha/:fecha')
		.put(function (req, res) {
			req.body.mensaje = ""
			sequelize.transaction(function (t) {
				var promises = [];
				var a = 0
				req.body.detalles_despacho.forEach(function (detalle_despacho, index, array) {
					promises.push(Producto.find({
						include: [{
							model: Inventario, as: 'inventarios', required: false, where: {
								id_almacen: req.body.id_almacen,
								cantidad: { $gt: 0 }
							}
						}],
						where: {
							id: detalle_despacho.id_producto
						},
						transaction: t
					}).then(function (producto) {
						return Tipo.find({
							where: { nombre_corto: Diccionario.MOV_EGRE },
							transaction: t
						}).then(function (tipoMovimiento) {
							return Clase.find({
								where: { nombre_corto: Diccionario.EGRE_PROFORMA },
								transaction: t
							}).then(function (tipoEgreso) {

								return calcularCostosEgresos(tipoMovimiento, tipoEgreso, producto, detalle_despacho.cantidad_despacho2, producto.inventarios, index, array, res, t, req, detalle_despacho, a);

							});
						});
					}));
				});

				return Promise.all(promises);

			}).then(function (result) {
				if (req.body.mensaje != "") {
					res.json({ mensaje: "de los siguientes clientes no se realizaron los despachos por falta de inventario o fue eliminado:                                                " + req.body.mensaje });
				} else {
					res.json({ mensaje: "Despacho realizado satisfactoriamente!" });
				}
			}).catch(function (err) {
				var error = (err.stack) ? err.stack : err
				res.json({ hasError: true, mensaje: error });
			});

		});

	router.route('/gtm-detalle-despacho-despachado/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/inicio/:inicio/fin/:fin/transportista/:transportista/tipo/:tipo/grupo/:grupo/estado/:estado/vendedor/:vendedor')
		.get(function (req, res) {
			var condicionDespacho = { id_padre: { $ne: null }, eliminado: false }
			var condicionEstibaje = {}
			var condicionGrupoEstibaje = {}
			var condicionTrabajador = {}
			var condicionCliente = {}
			var condicionVendedor = {}
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(4, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(19, 59, 59, 0, 0);
				condicionDespacho = { id_padre: { $ne: null }, eliminado: false, fecha: { $between: [inicio, fin] } };
			}
			if (req.params.transportista != 0) {
				condicionTrabajador.nombre_completo = { $like: "%" + req.params.transportista + "%" }
			}
			if (req.params.tipo != 0) {
				condicionEstibaje.nombre = { $like: "%" + req.params.tipo + "%" }
			}
			if (req.params.grupo != 0) {
				condicionGrupoEstibaje.nombre = { $like: "%" + req.params.grupo + "%" }
			}
			if (req.params.estado != 0) {

			}
			if (req.params.vendedor != 0) {

				condicionVendedor =
					{
						$or: [
							{
								nombre_completo: {
									$like: "%" + req.params.vendedor + "%"
								}
							}

						]
					}
			}
			if (req.params.texto_busqueda != 0) {
				var datonumerico = parseInt(req.params.texto_busqueda)
				if (!isNaN(datonumerico)) {
					condicionDespacho.numero_correlativo = req.params.texto_busqueda
				} else {
					condicionCliente =
						{
							$or: [
								{
									razon_social: {
										$like: "%" + req.params.texto_busqueda + "%"
									},

								}

							]
						}
				}
			}
			GtmDespachoDetalle.findAndCountAll({
				where: condicionDespacho,

				include: [{ model: GtmDespachoDetalleResivo, as: 'recivos', required: false, include: [{ model: Sucursal, as: 'sucursal', required: false, include: [{ model: Clase, as: 'departamento', required: false }] }, { model: Clase, as: 'tipoPago', required: false }, { model: Clase, as: 'otroBanco', required: false }, { model: Banco, as: 'banco', required: false }] }, {
					model: GtmDespacho, as: 'despacho',
					where: { id_empresa: req.params.id_empresa },
					include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionVendedor }] },
					{ model: ClienteRazon, as: 'cliente_razon' },
					{ model: Cliente, as: 'cliente', where: condicionCliente },
					{ model: GtmDestino, as: 'destino' }]
				},
				{ model: Producto, as: 'producto' },
				{
					model: GtmTransportista, as: 'transportista',
					include: [{ model: Persona, as: 'persona', where: condicionTrabajador }]
				},
				{ model: GtmGrupoEstibaje, as: 'grupo_estibaje', where: condicionGrupoEstibaje },
				{ model: GtmEstibaje, as: 'estibaje', where: condicionEstibaje }],
				order: [['id', 'asc']]
			}).then(function (data) {

				if (req.params.items_pagina != 0) {
					GtmDespachoDetalle.findAll({
						subQuery: false,
						offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
						where: condicionDespacho,
						include: [{ model: GtmDespachoDetalleResivo, as: 'recivos', required: false, include: [{ model: Sucursal, as: 'sucursal', required: false, include: [{ model: Clase, as: 'departamento', required: false }] }, { model: Clase, as: 'tipoPago', required: false }, { model: Clase, as: 'otroBanco', required: false }, { model: Banco, as: 'banco', required: false }] }, {
							model: GtmDespacho, as: 'despacho',
							where: { id_empresa: req.params.id_empresa },
							include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionVendedor }] },
							{ model: ClienteRazon, as: 'cliente_razon' },
							{ model: Cliente, as: 'cliente', where: condicionCliente },
							{ model: GtmDestino, as: 'destino' }]
						},
						{ model: Producto, as: 'producto' },
						{
							model: GtmTransportista, as: 'transportista',
							include: [{ model: Persona, as: 'persona', where: condicionTrabajador }]
						},
						{ model: GtmGrupoEstibaje, as: 'grupo_estibaje', where: condicionGrupoEstibaje },
						{ model: GtmEstibaje, as: 'estibaje', where: condicionEstibaje }],
						order: [['id', 'asc']]
					}).then(function (detallesDespacho) {
						res.json({ detallesDespacho: detallesDespacho, paginas: Math.ceil(data.count / req.params.items_pagina) });
					});
				} else {
					GtmDespachoDetalle.findAll({
						subQuery: false,
						offset: (req.params.items_pagina * (req.params.pagina - 1)),
						where: condicionDespacho,
						include: [{ model: GtmDespachoDetalleResivo, as: 'recivos', required: false, include: [{ model: Sucursal, as: 'sucursal', required: false, include: [{ model: Clase, as: 'departamento', required: false }] }, { model: Clase, as: 'tipoPago', required: false }, { model: Clase, as: 'otroBanco', required: false }, { model: Banco, as: 'banco', required: false }] }, {
							model: GtmDespacho, as: 'despacho',
							where: { id_empresa: req.params.id_empresa },
							include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionVendedor }] },
							{ model: ClienteRazon, as: 'cliente_razon' },
							{ model: Cliente, as: 'cliente', where: condicionCliente },
							{ model: GtmDestino, as: 'destino' }]
						},
						{ model: Producto, as: 'producto' },
						{
							model: GtmTransportista, as: 'transportista',
							include: [{ model: Persona, as: 'persona', where: condicionTrabajador }]
						},
						{ model: GtmGrupoEstibaje, as: 'grupo_estibaje', where: condicionGrupoEstibaje },
						{ model: GtmEstibaje, as: 'estibaje', where: condicionEstibaje }],
						order: [['id', 'asc']]
					}).then(function (detallesDespacho) {
						res.json({ detallesDespacho: detallesDespacho, paginas: 1 });
					});
				}
			});
		});

	router.route('/gtm-detalle-kardex/:id_detalle_kardex')
		.put(function (req, res) {
			GtmVentaKardexDetalle.update({
				factura: req.body.factura
			}, {
					where: {
						id: req.params.id_detalle_kardex
					}
				}).then(function (detallesKardex) {
					res.json({ mensaje: "Actualizado satisfactoriamente!" });
				});
		})

	router.route('/gtm-detalle-despacho/:id_detalle_despacho')
		.put(function (req, res) {
			GtmDespachoDetalle.update({
				factura: req.body.factura,
				fecha_factura: req.body.fecha_factura
			}, {
					where: {
						id: req.params.id_detalle_despacho
					}
				}).then(function (detallesDespacho) {
					res.json({ mensaje: "Actualizado satisfactoriamente!" });
				});
		})

		.delete(function (req, res) {
			sequelize.transaction(function (t) {
				return Movimiento.find({
					include: [{ model: GtmDespachoDetalle, as: "detallesDespacho", where: { id: req.params.id_detalle_despacho } },
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
								return GtmDespachoDetalle.update({
									eliminado: true
								}, {
										where: { id: req.params.id_detalle_despacho },
										transaction: t
									}).then(function (DespachoActualizado) {
										return GtmDespachoDetalle.find({
											where: { id: req.params.id_detalle_despacho },
											transaction: t
										}).then(function (DespachoActual) {
											return GtmDespachoDetalle.find({
												where: { id: DespachoActual.id_padre },
												transaction: t
											}).then(function (PadreEncontrado) {
												var total = PadreEncontrado.dataValues.cantidad_despacho - DespachoActual.dataValues.cantidad_despacho
												return GtmDespachoDetalle.update({
													cantidad_despacho: total,
													saldo: PadreEncontrado.saldo + DespachoActual.dataValues.cantidad_despacho,
													despachado: false
												}, {
														where: { id: DespachoActual.id_padre },
														transaction: t
													}).then(function (DespachoPadreActualizado) {
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
							});
						});
					});
				})
			}).then(function (result) {
				res.json({ mensaje: 'Se anulo el despacho!' });
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
			});
			/* GtmDespachoDetalle.update({
				eliminado: true
			}, {
					where: {
						id: req.params.id_detalle_despacho
					}
				}).then(function (detallesDespacho) {
					res.json({ mensaje: "Eliminado satisfactoriamente!" });
				}); */
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
	router.route('/gtm-detalle-despacho/:id_detalle_despacho/padre/:id_padre')
		.get(function (req, res) {
			GtmDespachoDetalle.findAll({
				where: {
					id: { $lt: req.params.id_detalle_despacho },
					id_padre: req.params.id_padre,
					eliminado: false
				}
			}).then(function (detallesDespacho) {
				res.json({ detallesDespacho: detallesDespacho });
			});
		})

	router.route('/gtm-detalle-despacho-alert/:id_detalle_despacho')
		.put(function (req, res) {
			GtmDespachoDetalle.update({
				alerta: req.body.alerta
			}, {
					where: {
						id: req.params.id_detalle_despacho
					}
				}).then(function (detallesDespacho) {
					res.json({ mensaje: "Actualizado satisfactoriamente!" });
				});
		})


	router.route('/gtm-venta-kardex/:id_venta_kardex')
		.delete(function (req, res) {
			GtmVentaKardex.update({
				eliminar: true
			}, {
					where: {
						id: req.params.id_venta_kardex
					}
				}).then(function (detallesDespacho) {
					res.json({ mensaje: "Actualizado satisfactoriamente!" });
				});
		})

	router.route('/gtm-detalle-despacho-alerta/:id_detalle_despacho')

		.delete(function (req, res) {
			GtmDespachoDetalle.update({
				eliminado: true
			}, {
					where: {
						id: req.params.id_detalle_despacho
					}
				}).then(function (detallesDespacho) {
					GtmDespachoDetalle.find({
						where: {
							id: req.params.id_detalle_despacho
						},
						include: [{
							model: GtmVentaKardexDetalle, as: 'detalle_Kardex',
							where: {
								eliminado: false
							},
							include: [{ model: GtmVentaKardexDetalle, as: 'padre' }]
						}]
					})
						.then(function (despacho) {
							// === obtener el detalle del hijo para obtener el padre 
							// 			// ==== actualizar kardex padre sumar saldo de despacho eliminado
							if (despacho != null) {
								GtmVentaKardexDetalle.update({
									saldo: despacho.dataValues.detalle_Kardex.padre.saldo + despacho.dataValues.detalle_Kardex.cantidad_despachada
								}, {
										where: {
											id: despacho.dataValues.detalle_Kardex.id_padre
										}
									}).then(function (detallesDespachos) {
										// 			// === eliminar hijo
										GtmVentaKardexDetalle.update({
											eliminado: true
										}, {
												where: {
													id: despacho.dataValues.detalle_Kardex.id
												}
											}).then(function (affectedRows) {
												res.json({ message: "Eliminado Satisfactoriamente!" });
											});
									});
							} else {
								res.json({ message: "Eliminado Satisfactoriamente!" });
							}
							// console.log("los datos de despacho ", despacho.dataValues.detalle_Kardex);

						});


				});
		})

	router.route('/gtm-detalle-despacho-alerta/empresa/:id_empresa/inicio/:inicio/fin/:fin/empleado/:empleado/cliente/:cliente/usuario/:id_usuario')
		.get(function (req, res) {
			var condicionDetalleDespacho = {
				despachado: false,
				eliminado: false,
				id_padre: null
			}
			var condicionCliente = {}
			var condicionEmpleado = {}
			var condicionDespacho = { id_empresa: req.params.id_empresa, id_usuario: req.params.id_usuario }
			if (req.params.inicio != 0 && req.params.fin != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
				condicionDespacho = { id_empresa: req.params.id_empresa, id_usuario: req.params.id_usuario, fecha: { $between: [inicio, fin] } };
			}
			if (req.params.empleado != 0) {
				condicionEmpleado = {
					nombre_completo: { $like: "%" + req.params.empleado + "%" }
				}
			}
			if (req.params.cliente != 0) {
				condicionCliente = {
					razon_social: { $like: "%" + req.params.cliente + "%" }
				}
			}
			GtmDespachoDetalle.findAll({
				where: condicionDetalleDespacho,
				include: [{
					model: GtmDespacho, as: 'despacho',
					where: condicionDespacho,
					include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionEmpleado }] },
					{ model: Cliente, as: 'cliente', where: condicionCliente },
					{ model: ClienteRazon, as: 'cliente_razon' },
					{ model: GtmDestino, as: 'destino' }]
				},
				{ model: Producto, as: 'producto' },
				{ model: GtmVentaKardexDetalle, as: 'detalle_Kardex' }]
			}).then(function (detallesDespacho) {
				res.json(detallesDespacho);
			});
		});

	router.route('/gtm-detalle-despacho-ubicacion/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/inicio/:inicio/fin/:fin/cliente/:cliente/vendedor/:vendedor')
		.get(function (req, res) {
			var condicionDespacho = { id_padre: null, eliminado: false }
			var condicionEstibaje = {}
			var condicionGrupoEstibaje = {}
			var condicionTrabajador = {}
			var condicionCliente = {}
			var condicionVendedor = {}
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(4, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(19, 59, 59, 0, 0);
				condicionDespacho = { id_padre: { $ne: null }, eliminado: false, fecha: { $between: [inicio, fin] } };
			}

			if (req.params.vendedor != 0) {

				condicionVendedor =
					{
						$or: [
							{
								nombre_completo: {
									$like: "%" + req.params.vendedor + "%"
								}
							}

						]
					}
			}
			if (req.params.texto_busqueda != 0) {
				var datonumerico = parseInt(req.params.texto_busqueda)
				if (!isNaN(datonumerico)) {
					condicionDespacho.numero_correlativo = req.params.texto_busqueda
				} else {
					condicionCliente =
						{
							$or: [
								{
									razon_social: {
										$like: "%" + req.params.texto_busqueda + "%"
									},

								}

							]
						}
				}
			}
			GtmDespachoDetalle.findAndCountAll({
				where: condicionDespacho,

				include: [{ model: GtmDespachoDetalleResivo, as: 'recivos', required: false, include: [{ model: Sucursal, as: 'sucursal', required: false, include: [{ model: Clase, as: 'departamento', required: false }] }, { model: Clase, as: 'tipoPago', required: false }, { model: Clase, as: 'otroBanco', required: false }, { model: Banco, as: 'banco', required: false }] }, {
					model: GtmDespacho, as: 'despacho',
					where: { id_empresa: req.params.id_empresa },
					include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionVendedor }] },
					{ model: ClienteRazon, as: 'cliente_razon' },
					{ model: Cliente, as: 'cliente', where: condicionCliente },
					{ model: GtmDestino, as: 'destino' }]
				},
				{ model: Producto, as: 'producto' },
				],
				order: [['id', 'asc']]
			}).then(function (data) {

				if (req.params.items_pagina != 0) {
					GtmDespachoDetalle.findAll({
						subQuery: false,
						offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
						where: condicionDespacho,
						include: [{
							model: GtmDespacho, as: 'despacho',
							where: { id_empresa: req.params.id_empresa },
							include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionVendedor }] },
							{ model: ClienteRazon, as: 'cliente_razon' },
							{ model: Cliente, as: 'cliente', where: condicionCliente },
							{ model: GtmDestino, as: 'destino' }]
						},
						{ model: Producto, as: 'producto' },
						],
						order: [['id', 'asc']]
					}).then(function (detallesDespacho) {
						res.json({ detallesDespacho: detallesDespacho, paginas: Math.ceil(data.count / req.params.items_pagina) });
					});
				} else {
					GtmDespachoDetalle.findAll({
						subQuery: false,
						offset: (req.params.items_pagina * (req.params.pagina - 1)),
						where: condicionDespacho,
						include: [{
							model: GtmDespacho, as: 'despacho',
							where: { id_empresa: req.params.id_empresa },
							include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionVendedor }] },
							{ model: ClienteRazon, as: 'cliente_razon' },
							{ model: Cliente, as: 'cliente', where: condicionCliente },
							{ model: GtmDestino, as: 'destino' }]
						},
						{ model: Producto, as: 'producto' },
						],
						order: [['id', 'asc']]
					}).then(function (detallesDespacho) {
						res.json({ detallesDespacho: detallesDespacho, paginas: 1 });
					});
				}
			});
		});
		router.route('/gtm-detalle-despacho-ubicacion/vendedor/:id_vendedor/fecha/:fecha')
        .get(function (req, res) {  
			var inicio = new Date(req.params.fecha); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fecha); fin.setHours(23, 59, 59, 0, 0);

			var condicionDespacho = { id_padre: null, eliminado: false, fecha: { $between: [inicio, fin] }}        
            GtmDespachoDetalle.findAll({
				subQuery: false,				
				where: condicionDespacho,
				include: [{
					model: GtmDespacho, as: 'despacho',
					where: { id_usuario:req.params.id_vendedor},
					include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona'}] },
					{ model: ClienteRazon, as: 'cliente_razon' },
					{ model: Cliente, as: 'cliente'},
					{ model: GtmDestino, as: 'destino' }]
				},
				{ model: Producto, as: 'producto' }],
				order: [['id', 'asc']]
			}).then(function (detallesDespacho) {
				res.json({ detallesDespacho: detallesDespacho});
			});
        })
		router.route('/gtm-detalle-despacho-ubicacion/empresa/:id_empresa/vendedor/:nombre')
        .get(function (req, res) {  
			var inicio = new Date(req.params.fecha); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fecha); fin.setHours(23, 59, 59, 0, 0);

			var condicionDespacho = { id_padre: null, eliminado: false, fecha: { $between: [inicio, fin] }}        
            Usuario.findAll({
				where:{id_empresa:req.params.id_empresa}							
				,include:[{model:Persona,as:'persona',where:{nombre_completo: { $like: req.params.nombre + "%" }}}]
			
			}).then(function (vendedores) {
				res.json(vendedores);
			});
        })
}
