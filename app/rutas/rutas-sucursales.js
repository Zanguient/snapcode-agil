module.exports = function (router, forEach, decodeBase64Image, fs, Empresa, Sucursal, Almacen, Clase, SucursalActividadDosificacion, Dosificacion,
	schedule, ConfiguracionFactura) {

	router.route('/sucursales')
		.post(function (req, res) {
			Sucursal.create({
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				numero: req.body.numero,
				direccion: req.body.direccion,
				telefono1: req.body.telefono1,
				telefono2: req.body.telefono2,
				telefono3: req.body.telefono3,
				id_departamento: req.body.id_departamento,
				id_municipio: req.body.id_municipio,
				nota_venta_correlativo: req.body.nota_venta_correlativo,
				nota_traspaso_correlativo: req.body.nota_traspaso_correlativo,
				nota_baja_correlativo: req.body.nota_baja_correlativo,
				pedido_correlativo: req.body.pedido_correlativo,
				frase_pedido: req.body.frase_pedido,
				copias_impresion_pedido: req.body.copias_impresion_pedido,
				nota_recibo_correlativo: req.body.nota_recibo_correlativo,
				imprimir_pedido_corto: req.body.imprimir_pedido_corto,
				cotizacion_correlativo: req.body.cotizacion_correlativo,
				pre_factura_correlativo: req.body.pre_factura_correlativo,
				fecha_reinicio_correlativo: req.body.fecha_reinicio_correlativo,
				correlativo_proforma: req.body.correlativo_proforma
			}).then(function (sucursalCreada) {
				req.body.almacenes.forEach(function (almacen, index, array) {
					if (!almacen.eliminado) {
						Almacen.create({
							id_sucursal: sucursalCreada.id,
							nombre: almacen.nombre,
							numero: almacen.numero,
							direccion: almacen.direccion,
							telefono: almacen.telefono,
						}).then(function (almacenCreado) {

						});
					}
				});
				req.body.actividadesDosificaciones.forEach(function (actividadDosificacion, index, array) {
					if (!actividadDosificacion.eliminado) {
						SucursalActividadDosificacion.create({
							id_sucursal: sucursalCreada.id,
							id_actividad: actividadDosificacion.id_actividad,
							id_dosificacion: actividadDosificacion.id_dosificacion,
							expirado: false
						}).then(function (actividadDosificacionCreado) {

						});
					}
				});
				res.json(sucursalCreada);
			});
		});

	router.route('/sucursales/empresa/:id_empresa')
		.get(function (req, res) {
			Sucursal.findAll({
				where: { id_empresa: req.params.id_empresa },
				include: [{ model: Empresa, as: 'empresa' },
				{ model: Almacen, as: 'almacenes' },
				{
					model: SucursalActividadDosificacion, as: 'actividadesDosificaciones',
					include: [{ model: Clase, as: 'actividad' },
					{ model: Dosificacion, as: 'dosificacion' }]
				},
				{ model: Clase, as: 'departamento' },
				{ model: Clase, as: 'municipio' },
				{
					model: ConfiguracionFactura, as: 'configuracionFactura',
					include: [{ model: Clase, as: 'tamanoPapelNotaVenta' },
					{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
					{ model: Clase, as: 'tamanoPapelNotaBaja' },
					{ model: Clase, as: 'tamanoPapelNotaPedido' },
					{ model: Clase, as: 'tamanoPapelCierreCaja' }]
				}]
			}).then(function (sucursales) {
				res.json(sucursales);
			});
		});

	router.route('/configuracion/factura/sucursales/empresa/:id_empresa')
		.get(function (req, res) {
			Sucursal.findAll({
				where: { id_empresa: req.params.id_empresa },
			}).then(function (sucursales) {
				res.json(sucursales);
			});
		})
	router.route('/reiniciar-correlativo/sucursales')
		.put(function (req, res) {
			req.body.sucursales.forEach(function (sucursal, array, index) {
				var comprobante_ingreso_correlativo = (sucursal.reiniciar_comprobante_caja_chica_correlativo) ? 1 : sucursal.comprobante_ingreso_correlativo;
				var comprobante_egreso_correlativo = (sucursal.reiniciar_comprobante_egreso_correlativo) ? 1 : sucursal.comprobante_egreso_correlativo;
				var comprobante_traspaso_correlativo = (sucursal.reiniciar_comprobante_traspaso_correlativo) ? 1 : sucursal.comprobante_traspaso_correlativo;
				var comprobante_caja_chica_correlativo = (sucursal.reiniciar_comprobante_caja_chica_correlativo) ? 1 : sucursal.comprobante_caja_chica_correlativo;
				Sucursal.update({
					comprobante_ingreso_correlativo: comprobante_ingreso_correlativo,
					comprobante_egreso_correlativo: comprobante_egreso_correlativo,
					comprobante_traspaso_correlativo: comprobante_traspaso_correlativo,
					comprobante_caja_chica_correlativo: comprobante_caja_chica_correlativo,
					fecha_reinicio_correlativo: req.body.fecha
				}, {
						where: {
							id: sucursal.id
						}
					}).then(function (sucursalesActualizadas) {
						res.json({ message: "Numero Correlativos Reiniciados satisfactoriamente!" });
					});
			});

		})
	router.route('/configuracion/factura/sucursal/:id_sucursal')
		.put(function (req, res) {
			Sucursal.update({
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				numero: req.body.numero,
				direccion: req.body.direccion,
				telefono1: req.body.telefono1,
				telefono2: req.body.telefono2,
				telefono3: req.body.telefono3,
				id_departamento: req.body.id_departamento,
				id_municipio: req.body.id_municipio,
				nota_venta_correlativo: req.body.nota_venta_correlativo,
				nota_traspaso_correlativo: req.body.nota_traspaso_correlativo,
				nota_baja_correlativo: req.body.nota_baja_correlativo,
				pedido_correlativo: req.body.pedido_correlativo,
				frase_pedido: req.body.frase_pedido,
				copias_impresion_pedido: req.body.copias_impresion_pedido,
				nota_recibo_correlativo: req.body.nota_recibo_correlativo,
				imprimir_pedido_corto: req.body.imprimir_pedido_corto,
				cotizacion_correlativo: req.body.cotizacion_correlativo,
				pre_factura_correlativo: req.body.pre_factura_correlativo,
				despacho_correlativo: req.body.despacho_correlativo,
				despacho_recivo_correlativo: req.body.despacho_recivo_correlativo,
				ropa_trabajo_correlativo: req.body.ropa_trabajo_correlativo,
				comprobante_ingreso_correlativo: req.body.comprobante_ingreso_correlativo,
				comprobante_egreso_correlativo: req.body.comprobante_egreso_correlativo,
				comprobante_traspaso_correlativo: req.body.comprobante_traspaso_correlativo,
				comprobante_caja_chica_correlativo: req.body.comprobante_caja_chica_correlativo,
				reiniciar_comprobante_ingreso_correlativo: req.body.reiniciar_comprobante_ingreso_correlativo,
				reiniciar_comprobante_egreso_correlativo: req.body.reiniciar_comprobante_egreso_correlativo,
				reiniciar_comprobante_traspaso_correlativo: req.body.reiniciar_comprobante_traspaso_correlativo,
				reiniciar_comprobante_caja_chica_correlativo: req.body.reiniciar_comprobante_caja_chica_correlativo,
				caja_chica_ingreso_correlativo: req.body.caja_chica_ingreso_correlativo,
				caja_chica_egreso_correlativo: req.body.caja_chica_egreso_correlativo,
				anticipo_cliente_correlativo: req.body.anticipo_cliente_correlativo,
				anticipo_proveedor_correlativo: req.body.anticipo_proveedor_correlativo,
				anticipo_compensacion_cliente_correlativo: req.body.anticipo_compensacion_cliente_correlativo,
				anticipo_compensacion_proveedor_correlativo: req.body.anticipo_compensacion_proveedor_correlativo,
				correlativo_proforma: req.body.correlativo_proforma
			}, {
					where: {
						id: req.params.id_sucursal
					}
				}).then(function (sucursalActualizada) {
					var datos = req.body.configuracionFactura;
					ConfiguracionFactura.update({
						//id_tamano_papel_nota_venta:req.body.ConfiguracionFactura.tamanoPapelNotaVenta.id, 
						id_tamano_papel_nota_venta: req.body.configuracionFactura.tamanoPapelNotaVenta.id,
						id_tamano_papel_cierre_caja: req.body.configuracionFactura.tamanoPapelCierreCaja.id,
						id_tamano_papel_nota_baja: req.body.configuracionFactura.tamanoPapelNotaBaja.id,
						id_tamano_papel_nota_pedido: req.body.configuracionFactura.tamanoPapelNotaPedido.id,
						id_tamano_papel_nota_traspaso: req.body.configuracionFactura.tamanoPapelNotaTraspaso.id,

					}, {
							where: { id_sucursal: req.params.id_sucursal }
						}).then(function (actividadDosificacionCreado) {
							res.json({ message: "Actualizado satisfactoriamente!" });
						})
				});
		})
	router.route('/sucursales/:id_sucursal')
		.put(function (req, res) {
			Sucursal.update({
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				numero: req.body.numero,
				direccion: req.body.direccion,
				telefono1: req.body.telefono1,
				telefono2: req.body.telefono2,
				telefono3: req.body.telefono3,
				id_departamento: req.body.id_departamento,
				id_municipio: req.body.id_municipio,
				nota_venta_correlativo: req.body.nota_venta_correlativo,
				nota_traspaso_correlativo: req.body.nota_traspaso_correlativo,
				nota_baja_correlativo: req.body.nota_baja_correlativo,
				pedido_correlativo: req.body.pedido_correlativo,
				frase_pedido: req.body.frase_pedido,
				copias_impresion_pedido: req.body.copias_impresion_pedido,
				nota_recibo_correlativo: req.body.nota_recibo_correlativo,
				imprimir_pedido_corto: req.body.imprimir_pedido_corto,
				cotizacion_correlativo: req.body.cotizacion_correlativo,
				pre_factura_correlativo: req.body.pre_factura_correlativo,
				correlativo_proforma: req.body.correlativo_proforma
			}, {
					where: {
						id: req.params.id_sucursal
					}
				}).then(function (sucursalActualizada) {
					req.body.almacenes.forEach(function (almacen, index, array) {
						if (almacen.eliminado) {
							Almacen.destroy({
								where: { id: almacen.id }
							}).then(function (almacenEliminado) {
								if (index === (array.length - 1)) {
									res.json({ message: "Actualizado satisfactoriamente!" });
								}
							});
						} else {
							if (almacen.id) {
								Almacen.update({
									nombre: almacen.nombre,
									numero: almacen.numero,
									direccion: almacen.direccion,
									telefono: almacen.telefono,
								}, {
										where: { id: almacen.id }
									}).then(function (almacenActualizado) {
										if (index === (array.length - 1)) {
											res.json({ message: "Actualizado satisfactoriamente!" });
										}
									});
							} else {
								Almacen.create({
									id_sucursal: req.params.id_sucursal,
									nombre: almacen.nombre,
									numero: almacen.numero,
									direccion: almacen.direccion,
									telefono: almacen.telefono
								}).then(function (almacenCreado) {
									if (index === (array.length - 1)) {
										res.json({ message: "Actualizado satisfactoriamente!" });
									}
								});
							}
						}
					});

					req.body.actividadesDosificaciones.forEach(function (actividadDosificacion, index, array) {
						if (actividadDosificacion.eliminado) {
							SucursalActividadDosificacion.destroy({
								where: { id: actividadDosificacion.id }
							}).then(function (actividadDosificacionEliminado) {
								if (index === (array.length - 1)) {
									res.json({ message: "Actualizado satisfactoriamente!" });
								}
							});
						} else {
							var id = 0
							if (actividadDosificacion.id != undefined) {
								id = actividadDosificacion.id
							}
							SucursalActividadDosificacion.find({
								where: { id: id },
								/* default: {
									id_sucursal: req.params.id_sucursal,
									id_actividad: actividadDosificacion.id_actividad,
									id_dosificacion: actividadDosificacion.id_dosificacion,
									expirado: false
								} */
							}).then(function (actividadDosificacionActualizado) {
								if (!actividadDosificacionActualizado) {
									var idsucursal = parseInt(req.params.id_sucursal)
									SucursalActividadDosificacion.create({

										id_sucursal: idsucursal,
										id_actividad: actividadDosificacion.id_actividad,
										id_dosificacion: actividadDosificacion.id_dosificacion,
										expirado: false

									}).then(function (actividadDosificacionActualizado) {
										if (index === (array.length - 1)) {
											res.json({ message: "Asignado satisfactoriamente!" });
										}
									})

								} else {
									if (actividadDosificacionActualizado.id_dosificacion != actividadDosificacion.id_dosificacion) {
										SucursalActividadDosificacion.update({
											expirado: true
										}, {
												where: { id: actividadDosificacionActualizado.id }
											}).then(function (actividadDosificacionCreado) {
												SucursalActividadDosificacion.create({
													id_sucursal: req.params.id_sucursal,
													id_actividad: actividadDosificacion.id_actividad,
													id_dosificacion: actividadDosificacion.id_dosificacion,
													expirado: false
												}).then(function (actividadDosificacionCreado) {
													if (index === (array.length - 1)) {
														res.json({ message: "Actualizado satisfactoriamente!" });
													}
												});
											});
									} else {
										if (index === (array.length - 1)) {
											res.json({ message: "Actualizado satisfactoriamente!" });
										}
									}
								}
							});
							// } else {

							// }
						}
					});
				});
		})

		.delete(function (req, res) {
			Almacen.destroy({
				where: {
					id_sucursal: req.params.id_sucursal
				}
			}).then(function (affectedRows) {
				Sucursal.destroy({
					where: {
						id: req.params.id_sucursal
					}
				}).then(function (affectedRows) {
					res.json({ message: "Eliminado Satisfactoriamente!" });
				});
			});
		});

	actualizarPedido();

	function actualizarPedido() {
		var rule = new schedule.RecurrenceRule();
		rule.minute = 17;
		rule.hour = 7;
		rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
		var j = schedule.scheduleJob(rule, function () {
			console.log('The answer to life, the universe, and everything!');
			console.log(new Date());
			Sucursal.update({
				pedido_correlativo: 1
			}, {
					where: {

					}
				}).then(function (sucursalActualizada) {

				});
		});
	}
}