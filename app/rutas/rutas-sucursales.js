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
				pre_factura_correlativo: req.body.pre_factura_correlativo
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
							id_dosificacion: actividadDosificacion.id_dosificacion
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
				pre_factura_correlativo: req.body.pre_factura_correlativo
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
						});

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
				pre_factura_correlativo: req.body.pre_factura_correlativo
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
								if(index===(array.length-1)){
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
										if(index===(array.length-1)){
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
									if(index===(array.length-1)){
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
								if(index===(array.length-1)){
									res.json({ message: "Actualizado satisfactoriamente!" });
								}
							});
						} else {
							if (actividadDosificacion.id) {
								SucursalActividadDosificacion.update({
									id_actividad: actividadDosificacion.id_actividad,
									id_dosificacion: actividadDosificacion.id_dosificacion
								}, {
										where: { id: actividadDosificacion.id }
									}).then(function (actividadDosificacionActualizado) {
										if(index===(array.length-1)){
											res.json({ message: "Actualizado satisfactoriamente!" });
										}
									});
							} else {
								SucursalActividadDosificacion.create({
									id_sucursal: req.params.id_sucursal,
									id_actividad: actividadDosificacion.id_actividad,
									id_dosificacion: actividadDosificacion.id_dosificacion
								}).then(function (actividadDosificacionCreado) {
									if(index===(array.length-1)){
										res.json({ message: "Actualizado satisfactoriamente!" });
									}
								});
							}
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