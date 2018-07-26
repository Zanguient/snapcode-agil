module.exports = function (router, Sucursal, ConfiguracionFactura, Clase, ConfiguracionGeneralFactura) {

	router.route('/configuraciones-factura/empresa/:id_empresa')
		.get(function (req, res) {
			obtenerConfiguracionesFacturaEmpresa(req, res, true);
		});

	router.route('/configuraciones-factura/:id_configuracion')
		.put(function (req, res) {
			ConfiguracionFactura.update({
				id_impresion_factura: req.body.impresionFactura.id,
				id_tipo_facturacion: req.body.tipoFacturacion.id,
				id_tamano_papel_factura: req.body.tamanoPapelFactura.id,
				id_titulo_factura: req.body.tituloFactura.id,
				id_subtitulo_factura: req.body.subtituloFactura.id,
				id_pie_factura: req.body.pieFactura.id,
				usar_pf: req.body.usar_pf,
				imprimir_al_guardar: req.body.imprimir_al_guardar,
				id_tamano_papel_nota_venta: req.body.tamanoPapelNotaVenta.id,
				id_tamano_papel_nota_traspaso: req.body.tamanoPapelNotaTraspaso.id,
				id_tamano_papel_nota_baja: req.body.tamanoPapelNotaBaja.id,
				id_tamano_papel_nota_pedido: req.body.tamanoPapelNotaPedido.id,
				id_tamano_papel_cierre_caja: req.body.tamanoPapelCierreCaja.id,
				id_tamano_papel_cotizacion: req.body.tamanoPapelCotizacion.id
			}, {
					where: { id: req.params.id_configuracion }
				}).then(function (score) {
					res.json({ mensaje: "¡Configuracion de Factura actualizado correctamente!" });
				});
		});

	router.route('/configuracion-general-factura/empresa/:id_empresa')
		.get(function (req, res) {
			obtenerConfiguracionGeneralFacturaEmpresa(req, res);
		});

	router.route('/configuracion-general-factura/:id_configuracion')
		.put(function (req, res) {
			ConfiguracionGeneralFactura.update({
				id_impresion_factura: req.body.impresionFactura.id,
				id_tipo_facturacion: req.body.tipoFacturacion.id,
				id_tamano_papel_factura: req.body.tamanoPapelFactura.id,
				id_titulo_factura: req.body.tituloFactura.id,
				id_subtitulo_factura: req.body.subtituloFactura.id,
				id_pie_factura: req.body.pieFactura.id,
				usar: req.body.usar,
				usar_pf: req.body.usar_pf,
				imprimir_al_guardar: req.body.imprimir_al_guardar,
				id_tamano_papel_nota_venta: req.body.tamanoPapelNotaVenta.id,
				id_tamano_papel_nota_traspaso: req.body.tamanoPapelNotaTraspaso.id,
				id_tamano_papel_nota_baja: req.body.tamanoPapelNotaBaja.id,
				id_tamano_papel_nota_pedido: req.body.tamanoPapelNotaPedido.id,
				id_tamano_papel_cierre_caja: req.body.tamanoPapelCierreCaja.id,
				id_tamano_papel_cotizacion: req.body.tamanoPapelCotizacion.id,
				id_formato_papel_factura: req.body.formatoPapelFactura.id
			}, {
					where: { id: req.params.id_configuracion }
				}).then(function (score) {
					res.json({ mensaje: "¡Configuracion de Factura General actualizado correctamente!" });
				});
		});

	function obtenerConfiguracionesFacturaPremisa(req, required) {
		return Sucursal.findAll({
			where: { id_empresa: req.params.id_empresa },
			include: [{
				model: ConfiguracionFactura, as: 'configuracionFactura', required: required,
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
				{ model: Clase, as: 'tamanoPapelCierreCaja' },
				{ model: Clase, as: 'tamanoPapelCotizacion' }]
			}]
		});
	}

	function obtenerConfiguracionesFacturaEmpresa(req, res, verificar) {
		var configuracionesPremisa = obtenerConfiguracionesFacturaPremisa(req, true);
		configuracionesPremisa.then(function (entities) {
			if (entities.length > 0) {
				if (verificar) {
					verificarSucursalesFaltantes(req, res, entities);
				} else {
					devolverConfiguraciones(entities, res);
				}
			} else {
				crearConfiguracionesFacturaEmpresa(req, res);
			}
		});
	}

	function devolverConfiguraciones(entities, res) {
		res.json(entities);
	}

	function crearConfiguracionesFacturaEmpresa(req, res) {
		Sucursal.findAll({
			where: {
				id_empresa: req.params.id_empresa
			}
		}).then(function (sucursales) {
			Clase.find({
				where: { nombre_corto: "VAC" }
			}).then(function (impresionFactura) {
				Clase.find({
					where: { nombre_corto: "NORM" }
				}).then(function (tipoFactura) {
					Clase.find({
						where: { nombre_corto: "ROLLO" }
					}).then(function (tipoPapelFactura) {
						Clase.find({
							where: { nombre_corto: "TITFACT" }
						}).then(function (tituloFactura) {
							Clase.find({
								where: { nombre_corto: "DERCREFIS" }
							}).then(function (subtituloFactura) {
								Clase.find({
									where: { nombre_corto: "L453" }
								}).then(function (pieFactura) {
									sucursales.forEach(function (sucursal, index, array) {
										ConfiguracionFactura.create({
											id_sucursal: sucursal.id,
											id_impresion_factura: impresionFactura.id,
											id_tipo_facturacion: tipoFactura.id,
											id_tamano_papel_factura: tipoPapelFactura.id,
											id_titulo_factura: tituloFactura.id,
											id_subtitulo_factura: subtituloFactura.id,
											id_pie_factura: pieFactura.id,
											maximo_items: 5,
											usar_pf: false,
											imprimir_al_guardar: true,
											id_tamano_papel_nota_venta: tipoPapelFactura.id,
											id_tamano_papel_nota_traspaso: tipoPapelFactura.id,
											id_tamano_papel_nota_baja: tipoPapelFactura.id,
											id_tamano_papel_nota_pedido: tipoPapelFactura.id,
											id_tamano_papel_cierre_caja: tipoPapelFactura.id,
											id_tamano_papel_cotizacion: tipoPapelFactura.id,
											
										}).then(function (score) {
											if (index === (array.length - 1)) {
												obtenerConfiguracionesFacturaEmpresa(req, res, false);
											}
										});
									});
								})
							})
						})
					})
				})
			})
		});
	}

	function crearConfiguracionesFacturasEmpresa(req, res, ids) {
		Sucursal.findAll({
			where: {
				id: { $in: ids }
			}
		}).then(function (sucursales) {
			Clase.find({
				where: { nombre_corto: "VAC" }
			}).then(function (impresionFactura) {
				Clase.find({
					where: { nombre_corto: "NORM" }
				}).then(function (tipoFactura) {
					Clase.find({
						where: { nombre_corto: "ROLLO" }
					}).then(function (tipoPapelFactura) {
						Clase.find({
							where: { nombre_corto: "TITFACT" }
						}).then(function (tituloFactura) {
							Clase.find({
								where: { nombre_corto: "DERCREFIS" }
							}).then(function (subtituloFactura) {
								Clase.find({
									where: { nombre_corto: "L453" }
								}).then(function (pieFactura) {
									sucursales.forEach(function (sucursal, index, array) {
										ConfiguracionFactura.create({
											id_sucursal: sucursal.id,
											id_impresion_factura: impresionFactura.id,
											id_tipo_facturacion: tipoFactura.id,
											id_tamano_papel_factura: tipoPapelFactura.id,
											id_titulo_factura: tituloFactura.id,
											id_subtitulo_factura: subtituloFactura.id,
											id_pie_factura: pieFactura.id,
											maximo_items: 5,
											usar_pf: false,
											imprimir_al_guardar: true,
											id_tamano_papel_nota_venta: tipoPapelFactura.id,
											id_tamano_papel_nota_traspaso: tipoPapelFactura.id,
											id_tamano_papel_nota_baja: tipoPapelFactura.id,
											id_tamano_papel_nota_pedido: tipoPapelFactura.id,
											id_tamano_papel_cierre_caja: tipoPapelFactura.id,
											id_tamano_papel_cotizacion: tipoPapelFactura.id
										}).then(function (score) {
											if (index === (array.length - 1)) {
												obtenerConfiguracionesFacturaEmpresa(req, res, false);
											}
										});
									});
								})
							})
						})
					})
				})
			})
		});
	}

	function verificarSucursalesFaltantes(req, res, originalEntities) {
		var scoresPromise = obtenerConfiguracionesFacturaPremisa(req, false);
		scoresPromise.then(function (entities) {
			var ids = [];
			for (var e = 0; e < entities.length; e++) {
				if (entities[e].configuracionFactura == null) {
					ids.push(entities[e].id);
				}
			}
			if (ids.length > 0) {
				crearConfiguracionesFacturasEmpresa(req, res, ids);
			} else {
				devolverConfiguraciones(originalEntities, res)
			}
		});
	}

	function obtenerConfiguracionGeneralFacturaEmpresa(req, res) {
		var configuracionesPremisa = obtenerConfiguracionGeneralFacturaPremisa(req);
		configuracionesPremisa.then(function (entity) {
			if (entity) {
				devolverConfiguraciones(entity, res);
			} else {
				crearConfiguracionGeneralFacturaEmpresa(req, res);
			}
		});
	}

	function obtenerConfiguracionGeneralFacturaPremisa(req) {
		return ConfiguracionGeneralFactura.find({
			where: { id_empresa: req.params.id_empresa },
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
			{ model: Clase, as: 'tamanoPapelCierreCaja' },
			{ model: Clase, as: 'tamanoPapelCotizacion' }]
		});
	}

	function crearConfiguracionGeneralFacturaEmpresa(req, res) {
		Clase.find({
			where: { nombre_corto: "VAC" }
		}).then(function (impresionFactura) {
			Clase.find({
				where: { nombre_corto: "NORM" }
			}).then(function (tipoFactura) {
				Clase.find({
					where: { nombre_corto: "ROLLO" }
				}).then(function (tipoPapelFactura) {
					Clase.find({
						where: { nombre_corto: "TITFACT" }
					}).then(function (tituloFactura) {
						Clase.find({
							where: { nombre_corto: "DERCREFIS" }
						}).then(function (subtituloFactura) {
							Clase.find({
								where: { nombre_corto: "FORM_C_MAR" }
							}).then(function (formatoPapelImpresion){
								Clase.find({
									where: { nombre_corto: "L453" }
								}).then(function (pieFactura) {
									ConfiguracionGeneralFactura.create({
										id_empresa: req.params.id_empresa,
										id_impresion_factura: impresionFactura.id,
										id_tipo_facturacion: tipoFactura.id,
										id_tamano_papel_factura: tipoPapelFactura.id,
										id_titulo_factura: tituloFactura.id,
										id_formato_papel_factura: formatoPapelImpresion.id,
										id_subtitulo_factura: subtituloFactura.id,
										id_pie_factura: pieFactura.id,
										maximo_items: 5,
										usar_pf: false,
										imprimir_al_guardar: true,
										id_tamano_papel_nota_venta: tipoPapelFactura.id,
										id_tamano_papel_nota_traspaso: tipoPapelFactura.id,
										id_tamano_papel_nota_baja: tipoPapelFactura.id,
										id_tamano_papel_nota_pedido: tipoPapelFactura.id,
										id_tamano_papel_cierre_caja: tipoPapelFactura.id,
										id_tamano_papel_cotizacion: tipoPapelFactura.id

									}).then(function (score) {
										obtenerConfiguracionGeneralFacturaEmpresa(req, res);
									});
								})
							})
						})
					})
				})
			})
		})
	}

	router.route('/configuracion-impresion/empresa/:id_empresa/sucursal/:id_sucursal')
		.get(function (req, res) {
			ConfiguracionGeneralFactura.find({
				where: { id_empresa: req.params.id_empresa },
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
				{ model: Clase, as: 'tamanoPapelCierreCaja' },
				{ model: Clase, as: 'tamanoPapelCotizacion' }]
			}).then(function (configuracion) {
				if (configuracion.usar) {
					res.json(configuracion);
				} else {
					ConfiguracionFactura.find({
						where: { id_sucursal: req.params.id_sucursal },
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
						{ model: Clase, as: 'tamanoPapelCierreCaja' },
						{ model: Clase, as: 'tamanoPapelCotizacion' }]
					}).then(function (configuracionEspecifica) {
						res.json(configuracionEspecifica);
					});
				}
			});
		});
}