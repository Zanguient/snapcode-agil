module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmDespacho,
	GtmDespachoDetalle, Cliente, Usuario, GtmDestino, Producto, GtmTransportista, GtmEstibaje, GtmGrupoEstibaje,
	Persona, ClienteRazon, sequelize, Inventario, Movimiento, DetalleMovimiento, Tipo, Clase, Diccionario, Sequelize, Sucursal) {

	router.route('/gtm-despacho/empresa/:id_empresa')
		.post(function (req, res) {
			GtmDespacho.create({
				id_cliente: req.body.id_cliente,
				id_usuario: req.body.id_usuario,
				id_destino: req.body.id_destino,
				id_cliente_razon: req.body.id_cliente_razon,
				fecha: new Date(req.body.fecha.split("/")[2], req.body.fecha.split("/")[1] - 1, req.body.fecha.split("/")[0]),
				id_empresa: req.params.id_empresa
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
						servicio_transporte: (detalle_despacho.servicio_transporte?parseFloat(detalle_despacho.servicio_transporte):0)
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
		console.log(cantidad); return DetalleMovimiento.create({
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

	function calcularCostosEgresos(movimientoCreado, producto, cantidad, inventarios, index, array, res, t) {
		var cantidadTotal = cantidad;
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
				return Promise.all(promises);
			} else {
				//if (index == (array.length - 1)) {
				return new Promise(function (fulfill, reject) {
					fulfill({});
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

	router.route('/gtm-detalle-despacho/empresa/:id_empresa/fecha/:fecha')
		.put(function (req, res) {
			sequelize.transaction(function (t) {
				var promises = [];
				var a=0
				req.body.detalles_despacho.forEach(function (detalle_despacho, index, array) {
					promises.push(Producto.find({
						include: [{
							model: Inventario, as: 'inventarios', required: false, where: {
								id_almacen: req.body.id_almacen
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
												numero = SucursalEncontrada.despacho_correlativo+a
												a++
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
													numero_correlativo: numero
												}, { transaction: t }).then(function (detalleDespachoCreado) {
													SucursalEncontrada.despacho_correlativo = SucursalEncontrada.despacho_correlativo +a
													return Sucursal.update({
														despacho_correlativo: SucursalEncontrada.despacho_correlativo
													}, {
															where: {
																id: req.body.id_sucursal,
															}

														}, { transaction: t }).then(function (actualizado) {
															return calcularCostosEgresos(movimientoCreado, producto, detalle_despacho.cantidad_despacho2, producto.inventarios, index, array, res, t);
														})
												})
											});
										})/*)*/;

								});
							});
						});
					}));
				});

				return Promise.all(promises);

			}).then(function (result) {
				res.json({ mensaje: "Despacho realizado satisfactoriamente!" });
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
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
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
				condicionDespacho = { id_padre: { $ne: null }, eliminado: false, fecha: { $between: [inicio, fin] } };
			}
			if (req.params.transportista != 0) {
				condicionTrabajador = { nombre_completo: { $like: "%" + req.params.transportista + "%" } }
			}
			if (req.params.tipo != 0) {
				condicionEstibaje = { nombre: req.params.tipo }
			}
			if (req.params.grupo != 0) {
				condicionGrupoEstibaje = { nombre: req.params.grupo }
			}
			if (req.params.estado != 0) {

			}
			if (req.params.vendedor != 0) {
				condicionVendedor = { nombre_completo: { $like: "%" + req.params.vendedor + "%" } }
			}
			if (req.params.texto_busqueda != 0) {
				condicionCliente = { razon_social: { $like: "%" + req.params.texto_busqueda + "%" } }
			}
			GtmDespachoDetalle.findAndCountAll({
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
				{
					model: GtmTransportista, as: 'transportista',
					include: [{ model: Persona, as: 'persona', where: condicionTrabajador }]
				},
				{ model: GtmGrupoEstibaje, as: 'grupo_estibaje', where: condicionGrupoEstibaje },
				{ model: GtmEstibaje, as: 'estibaje', where: condicionEstibaje }],
				order: [['id', 'asc']]
			}).then(function (data) {
				GtmDespachoDetalle.findAll({
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
			});
		});

	router.route('/gtm-detalle-despacho/:id_detalle_despacho')
		.put(function (req, res) {
			GtmDespachoDetalle.update({
				factura: req.body.factura
			}, {
					where: {
						id: req.params.id_detalle_despacho
					}
				}).then(function (detallesDespacho) {
					res.json({ mensaje: "Actualizado satisfactoriamente!" });
				});
		})

		.delete(function (req, res) {
			GtmDespachoDetalle.update({
				eliminado: true
			}, {
					where: {
						id: req.params.id_detalle_despacho
					}
				}).then(function (detallesDespacho) {
					res.json({ mensaje: "Eliminado satisfactoriamente!" });
				});
		})
	router.route('/gtm-detalle-despacho/:id_detalle_despacho/padre/:id_padre')
		.get(function (req, res) {
			GtmDespachoDetalle.findAll({
				where: {
					id: { $lt: req.params.id_detalle_despacho },
					id_padre: req.params.id_padre
				}
			}).then(function (detallesDespacho) {
				res.json({ detallesDespacho: detallesDespacho });
			});
		})

}
