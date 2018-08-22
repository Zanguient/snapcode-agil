module.exports = function (router, Cotizacion, DetalleCotizacion, Usuario, Producto, Diccionario, Clase, ConfiguracionGeneralFactura, Sucursal) {

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
				id_sucursal: req.body.id_sucursal
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
			Sucursal.find({
				where: {
					id: req.body.sucursal
				}
			}).then(function (sucursal) {
				Cotizacion.create({
					id_empresa: req.body.id_empresa,
					nombre: req.body.nombre,
					descripcion: req.body.descripcion,
					numero_documento: sucursal.cotizacion_correlativo + 1 ,
					fecha: req.body.fecha,
					importe: req.body.importe,
					id_usuario: req.body.id_usuario,
					id_sucursal: req.body.sucursal,
					plazo: req.body.plazo,
					firma: req.body.firma,
					cargo: req.body.cargo,
					nota: req.body.nota,
					observacion: req.body.observacion,
					id_almacen: req.body.almacen
				}).then(function (cotizacionCreada) {
					req.body.detallesCotizacion.forEach(function (detallescotizacion, index, array) {
						DetalleCotizacion.create({
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
						}).then(function (detalleCreado) {
						});
					})
				}).then(function(detallesCreados)
				{
					
				});
				Sucursal.update({
					cotizacion_correlativo: (sucursal.cotizacion_correlativo + 1)
				}, {
						where: {
							id: sucursal.id
						}
					}).then(function (detallesCotizacion) {
						res.json({ mensaje: 'cotizacion creada' })
					});
			})
		});


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

	router.route('/cotizaciones/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/importe/:importe/busqueda/:busqueda/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion')
		.get(function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			var condicionCotizacion = {}, ordenArreglo = [];
			condicionCotizacion.id_empresa = parseInt(req.params.id_empresa)
			condicionCotizacion.fecha = { $between: [inicio, fin] }
			if (req.params.busqueda != 0) {
				condicionCotizacion = {
					id_empresa: parseInt(req.params.id_empresa),
					fecha: { $between: [inicio, fin] },
					$or: [
						{
							nombre: {
								$like: "%" + req.params.busqueda + "%"
							}
						},
						{
							descripcion: {
								$like: "%" + req.params.busqueda + "%"
							}
						}
					]
				}
			} else {
				condicionCotizacion = {
					id_empresa: parseInt(req.params.id_empresa),
					fecha: { $between: [inicio, fin] }

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
					include: [{ model: Usuario, as: 'usuario' }, { model: Sucursal, as: 'sucursal' },
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

	router.route('/cotizacion/:id/empresa/:id_empresa')
		.get(function (req, res) {
			Cotizacion.find({
				where: {
					id: req.params.id
				},
				include: [
					{
						model: DetalleCotizacion, as: "detallesCotizacion",
						include: [{ model: Producto, as: 'producto' },
					/*{ model: Inventario, as: 'inventario' }*/]
					},
					{ model: Sucursal, as: 'sucursal' }
				]

			}).then(function (cotizacion) {
				ConfiguracionGeneralFactura.find({
					where: {
						id_empresa: req.params.id_empresa
					},
					include: [{ model: Clase, as: 'tamanoPapelCotizacion' }
					]
				}).then(function (configuracionGeneralFactura) {
					res.json({ cotizacion: cotizacion, configuracionGeneralFactura: configuracionGeneralFactura })
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