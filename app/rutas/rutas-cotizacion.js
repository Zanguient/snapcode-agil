module.exports = function (router,sequelize,Sequelize, Cotizacion, DetalleCotizacion, Usuario, Producto, Diccionario, Clase, ConfiguracionGeneralFactura,ConfiguracionFactura, Sucursal, Cliente, Almacen, NumeroLiteral, Inventario, Movimiento, DetalleMovimiento, Tipo) {

	router.route('/cotizaciones/empresa/:id_empresa')
		.get(function (req, res) {
			Cotizacion.findAll({
				where: {
					id_empresa: req.params.id_empresa
				},
				include: [{ model: DetalleCotizacion, as: 'detallesCotizacion' }]
			}).then(function (listaCotizacion) {
				res.json(listaCotizacion)
			})

		})
		.post(function (req, res) {
			Cotizacion.create({
				id_empresa: req.params.id_empresa
			}).then(function (cotizacionCreada) {
				res.json(cotizacionCreada)
			})

		});

	router.route('/cotizacion/:id')
		.put(function (req, res) {
			Cotizacion.update({
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				numero_documento: req.body.numero_documento,
				fecha: req.body.fecha,
				importe: req.body.importe,
				id_usuario: req.body.id_usuario,
				id_sucursal: req.body.id_sucursal,
				id_cliente: req.body.cliente.id
			}, {
					where: {
						id: req.params.id
					}
				}).then(function (cotizacion) {
					console.log(req.body.detallesCotizacion)
					req.body.detallesCotizacion.forEach(function (detallescotizacion, index, array) {
						if (detallescotizacion.id) {
							if (!detallescotizacion.eliminado) {
								console.log(req.params)
								DetalleCotizacion.update({
									id_cotizacion: req.params.id,
									id_producto: detallescotizacion.id_producto,
									precio_unitario: detallescotizacion.precio_unitario,
									cantidad: detallescotizacion.cantidad,
									importe: detallescotizacion.importe,
									descuento: detallescotizacion.descuento,
									recargo: detallescotizacion.recargo,
									ice: detallescotizacion.ice,
									excento: detallescotizacion.excento,
									tipo_descuento: detallescotizacion.tipo_descuento,
									tipo_recargo: detallescotizacion.tipo_recargo,
									total: detallescotizacion.total,
									fecha_vencimiento: detallescotizacion.fecha_vencimiento,
								}, {
										where: {
											id: detallescotizacion.id
										}
									}).then(function (detalleCotizacionActualizado) {
										console.log(detalleCotizacionActualizado)
									})
							} else {
								DetalleCotizacion.destroy({
									where: {
										id: detallescotizacion.id
									}
								});
							}
						} else {
							if (!detallescotizacion.eliminado) {
								DetalleCotizacion.create({
									id_cotizacion: req.params.id,
									id_producto: detallescotizacion.producto.id,
									precio_unitario: detallescotizacion.precio_unitario,
									cantidad: detallescotizacion.cantidad,
									importe: detallescotizacion.importe,
									descuento: detallescotizacion.descuento,
									recargo: detallescotizacion.recargo,
									ice: detallescotizacion.ice,
									excento: detallescotizacion.excento,
									tipo_descuento: detallescotizacion.tipo_descuento,
									tipo_recargo: detallescotizacion.tipo_recargo,
									total: detallescotizacion.total,
									fecha_vencimiento: detallescotizacion.fecha_vencimiento,
									eliminado: false
								}).then(function (detalleCotizacionCreado) {
									console.log(detalleCotizacionCreado)
								})
							}
						}
						if (index == (array.length - 1)) {
							res.json({ mensaje: "La cotización fué actualizada satisfactoriamente...." });
						}
					});
				})
		})

	router.route('/cotizacion')
		.post(function (req, res) {
			sequelize.transaction(function (t) {
				return Sucursal.find({
					where: {
						id: req.body.sucursal
					}, transaction: t,
				}).then(function (sucursal) {
					return Cliente.findOrCreate({
						where: {
							nit: req.body.cliente.nit,
							razon_social: req.body.cliente.razon_social,
						},
						transaction: t,
						lock: t.LOCK.UPDATE,
						defaults: {
							nit: req.body.cliente.nit,
							razon_social: req.body.cliente.razon_social,
						}
					}).spread(function (dato, cread) {
						return Cotizacion.create({
							id_empresa: req.body.id_empresa,
							nombre: req.body.nombre,
							descripcion: req.body.descripcion,
							numero_documento: sucursal.cotizacion_correlativo + 1,
							fecha: req.body.fecha,
							importe: req.body.importe,
							id_usuario: req.body.id_usuario,
							id_sucursal: req.body.sucursal,
							plazo: req.body.plazo,
							firma: req.body.firma,
							cargo: req.body.cargo,
							nota: req.body.nota,
							observacion: req.body.observacion,
							id_almacen: req.body.almacen.id,
							id_cliente: dato.id,
							estado: 'PENDIENTE'
						}, {
								transaction: t,
							}).then(function (cotizacionCreada) {
								return Sucursal.update({
									cotizacion_correlativo: (sucursal.cotizacion_correlativo + 1)
								}, {
										where: {
											id: sucursal.id
										}, transaction: t
									}).then(function (detallesCotizacion) {
										return CrearDetalleCotizacion(req, res, cotizacionCreada,t)
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
					});;
					/* Sucursal.update({
						cotizacion_correlativo: (sucursal.cotizacion_correlativo + 1)
					}, {
							where: {
								id: sucursal.id
							}
						}).then(function (detallesCotizacion) {

						});
				}) */
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				});
			}).then(function (result) {
				res.json({ mensaje: 'cotizacion creada', cotizacion: result[0] });
			}).catch(function (err) {
				res.json({ hasError: true, message: err.stack });
			});
		});

	function CrearDetalleCotizacion(req, res, cotizacionCreada,t) {
		var promises = []
		req.body.detallesCotizacion.forEach(function (detallescotizacion, index, array) {
			promises.push(DetalleCotizacion.create({
				id_cotizacion: cotizacionCreada.id,
				id_producto: detallescotizacion.producto.id,
				precio_unitario: detallescotizacion.precio_unitario,
				cantidad: detallescotizacion.cantidad,
				importe: detallescotizacion.importe,
				descuento: detallescotizacion.descuento,
				recargo: detallescotizacion.recargo,
				ice: detallescotizacion.ice,
				excento: detallescotizacion.excento,
				tipo_descuento: detallescotizacion.tipo_descuento,
				tipo_recargo: detallescotizacion.tipo_recargo,
				total: detallescotizacion.total,
				fecha_vencimiento: detallescotizacion.fecha_vencimiento,
				eliminado: false
			}, {
					transaction: t,
				}).then(function (detalleCreado) {
					if (index == (array.length - 1)) {
						return ConfiguracionGeneralFactura.find({
							where: {
								id_empresa: req.body.id_empresa,
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
							{ model: Clase, as: 'formatoColorFacturaServicio' }]
						}).then(function (configuracionGeneralFactura) {
							if (configuracionGeneralFactura.usar) {
								cotizacionCreada.configuracion = ConfiguracionFactura
								return new Promise(function (fulfill, reject) {
									fulfill(cotizacionCreada);
								});
							} else {
								return ConfiguracionFactura.find({
									where: {
										id_sucursal: req.body.sucursal,
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
									{ model: Clase, as: 'formatoColorFacturaServicio' }]
								}).then(function (configuracionFactura) {
									cotizacionCreada.configuracion = configuracionFactura
									return new Promise(function (fulfill, reject) {
										fulfill(cotizacionCreada);
									});
									
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
						});

					}
				}).catch(function (err) {
					return new Promise(function (fulfill, reject) {
						reject(err);
					});
				}));


		})
		return Promise.all(promises);
	}
	// condicionCotizacion = {
	// 	id_empresa: req.params.id_empresa,/*codigo:{$not:null},*/
	// $or: [
	// 	{
	// 		nombre: {
	// 			$like: "%" + req.params.texto_busqueda + "%"
	// 		}
	// 	},
	// 	{
	// 		descripcion: {
	// 			$like: "%" + req.params.texto_busqueda + "%"
	// 		}
	// 	},{

	// 	}
	// ]
	// };

	router.route('/cotizaciones/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/importe/:importe/busqueda/:busqueda/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion/estado/:estado/sucursal/:sucursal/usuario/:usuario/razon-social/:razon_social/nit/:nit')
		.get(function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			var clienteRequerido = false, condicionCotizacion = {}, condicionSucursal = {}, condicionUsuario = {}, ordenArreglo = [], condicionCliente = {};
			condicionCotizacion.id_empresa = parseInt(req.params.id_empresa)

			condicionCotizacion.fecha = { $between: [inicio, fin] }
			condicionCotizacion = {
				id_empresa: parseInt(req.params.id_empresa),
				fecha: { $between: [inicio, fin] }
			}

			if (req.params.columna == "usuario") {
				ordenArreglo.push({ model: Ususario, as: 'usuario' });
				req.params.columna = "nombre";
			}
			ordenArreglo.push(req.params.columna);
			ordenArreglo.push(req.params.direccion);

			if (req.params.importe != 0) {
				condicionCotizacion.importe = parseFloat(req.params.importe);
			}

			if (req.params.sucursal != 0) {
				condicionSucursal.id = req.params.sucursal;
			}

			if (req.params.estado != 0) {
				condicionCotizacion.estado = req.params.estado;
			}

			if (req.params.usuario != 0) {
				condicionUsuario.nombre_usuario = { $like: "%" + req.params.usuario + "%" };
			}

			if (req.params.razon_social != 0) {
				condicionCliente.razon_social = { $like: "%" + req.params.razon_social + "%" };
				clienteRequerido = true;
			}
			if (req.params.nit != 0) {
				condicionCliente.nit = parseInt(req.params.nit);
				clienteRequerido = true;
			}

			Cotizacion.findAndCountAll({
				where: condicionCotizacion,
				include: [{ model: DetalleCotizacion, as: 'detallesCotizacion' }],

			}).then(function (data) {
				Cotizacion.findAll({
					where: condicionCotizacion,
					include: [{ model: Usuario, as: 'usuario', where: condicionUsuario },
					{
						model: Sucursal, as: 'sucursal',
						where: condicionSucursal
					},
					{ model: Cliente, as: 'cliente', where: condicionCliente, required: clienteRequerido },
					{ model: Almacen, as: 'almacen' },
					{
						model: DetalleCotizacion, as: "detallesCotizacion",
						include: [{ model: Producto, as: 'producto' }]
					}],
					order: [[req.params.columna, req.params.direccion]]
				}).then(function (cotizaciones) {
					res.json({ cotizaciones: cotizaciones, paginas: Math.ceil(data.count / req.params.items_pagina) });
				});
			});
		});


	router.route('/cotizaciones-pendientes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/importe/:importe/busqueda/:busqueda/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion')
		.get(function (req, res) {
			var condicionCotizacion = {}, ordenArreglo = [], condicionCliente = {};
			condicionCotizacion.id_empresa = parseInt(req.params.id_empresa)
			condicionCotizacion = {
				id_empresa: parseInt(req.params.id_empresa),
				estado: "PENDIENTE"
			}
			if (req.params.busqueda != 0) {
				condicionCliente = {
					razon_social: {
						$like: "%" + req.params.busqueda + "%"
					}
				}

			} else {
				condicionCliente = {
				}
			}

			if (req.params.columna == "usuario") {
				ordenArreglo.push({ model: Ususario, as: 'usuario' });
				req.params.columna = "nombre";
			}
			ordenArreglo.push(req.params.columna);
			ordenArreglo.push(req.params.direccion);

			if (req.params.importe != 0) {
				condicionCotizacion.importe = parseFloat(req.params.importe);
			}

			Cotizacion.findAndCountAll({
				where: condicionCotizacion,
				include: [{ model: DetalleCotizacion, as: 'detallesCotizacion' }],

			}).then(function (data) {
				Cotizacion.findAll({
					offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
					where: condicionCotizacion,
					include: [{ model: Usuario, as: 'usuario' },
					{ model: Sucursal, as: 'sucursal' },
					{
						model: Cliente, as: 'cliente',
						where: condicionCliente
					},
					{ model: Almacen, as: 'almacen' },
					{
						model: DetalleCotizacion, as: "detallesCotizacion",
						include: [{
							model: Producto, as: 'producto',
							// rescatar tipoProducto======

							include: [
								{ model: Clase, as: 'tipoProducto' },
								{
									model: Inventario, as: 'inventarios', required: false,
									// include: [{
									// 	model: DetalleMovimiento, as: "detallesMovimiento", required: false,
									// 	include: [{
									// 		model: Movimiento, as: 'movimiento', required: false,
									// 		include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: 'MOVING' } },
									// 		{ model: Clase, as: 'clase' }]
									// 	}]
									// }]
								}

							]
						}]
					}],
					// order: [[req.params.columna, req.params.direccion]] 
					order: [['id', 'desc']]
				}).then(function (cotizaciones) {
					res.json({ cotizaciones: cotizaciones, paginas: Math.ceil(data.count / req.params.items_pagina) });
				});
			});
		});

	router.route('/cotizaciones/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda')
		.get(function (req, res) {
			var condicionCotizacion = { id_empresa: req.params.id_empresa/*,codigo:{$not:null}*/ };
			if (req.params.texto_busqueda != 0) {
				condicionCotizacion = {
					id_empresa: req.params.id_empresa,/*codigo:{$not:null},*/
					$or: [
						{
							nombre: {
								$like: "%" + req.params.texto_busqueda + "%"
							}
						},
						{
							descripcion: {
								$like: "%" + req.params.texto_busqueda + "%"
							}
						}
					]
				};
			}

			Cotizacion.findAndCountAll({
				where: condicionCotizacion,
				include: [{ model: DetalleCotizacion, as: 'detallesCotizacion' }],

			}).then(function (data) {
				Cotizacion.findAll({
					offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
					where: condicionCotizacion,
					include: [{ model: Usuario, as: 'usuario' },
					{
						model: DetalleCotizacion, as: "detallesCotizacion",
						include: [{ model: Producto, as: 'producto' }]
					}],
					order: [['id', 'asc']]
				}).then(function (cotizaciones) {
					res.json({ cotizaciones: cotizaciones, paginas: Math.ceil(data.count / req.params.items_pagina) });
				});
			});
		});

	router.route('/cotizacion/ultima')
		.get(function (req, res) {
			Cotizacion.findAll({
				limit: 1,
				order: [['id', 'desc']]
			}).then(function (ultimaCotizacion) {
				res.json({ cotizacion: ultimaCotizacion });

			})
		})

	router.route('/cotizacion-rechazo/:id_cotizacion')
		.put(function (req, res) {
			Cotizacion.update({
				estado: req.body.estado,
				fecha_estado: req.body.fecha_estado,
				observacion: req.body.observacion,
			}, {
					where: {
						id: req.params.id_cotizacion
					}
				}).then(function (Cotizacion) {
					res.json({ cotizacion: Cotizacion });

				})
		})

	router.route('/cotizacion/:id/empresa/:id_empresa')
		.get(function (req, res) {
			Cotizacion.find({
				where: {
					id: req.params.id
				},
				include: [
					{ model: Cliente, as: 'cliente' },
					{
						model: DetalleCotizacion, as: "detallesCotizacion",
						include: [{ model: Producto, as: 'producto' },
					/*{ model: Inventario, as: 'inventario' }*/]
					},
					{ model: Sucursal, as: 'sucursal' }
				]

			}).then(function (cotizacion) {
				// console.log("lllegooooo aqui cotiiiiiiiii ==========================================================", cotizacion);

				ConfiguracionGeneralFactura.find({
					where: {
						id_empresa: req.params.id_empresa
					},
					include: [{ model: Clase, as: 'tamanoPapelCotizacion' }
					]
				}).then(function (configuracionGeneralFactura) {
					if(configuracionGeneralFactura.usar){
					var numero_literal = NumeroLiteral.Convertir(parseFloat(cotizacion.dataValues.importe).toFixed(2).toString());
					res.json({ cotizacion: cotizacion, configuracionGeneralFactura: configuracionGeneralFactura, numero_literal: numero_literal })
				}else{
					return ConfiguracionFactura.find({
						where: {
							id_sucursal: cotizacion.id_sucursal,
						},
						include: [{ model: Clase, as: 'tamanoPapelCotizacion' }
					]
					}).then(function (configuracionFactura) {
						var numero_literal = NumeroLiteral.Convertir(parseFloat(cotizacion.dataValues.importe).toFixed(2).toString());
						res.json({ cotizacion: cotizacion, configuracionGeneralFactura: configuracionFactura, numero_literal: numero_literal })
					})
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
}