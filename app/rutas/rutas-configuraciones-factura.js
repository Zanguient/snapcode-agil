module.exports = function (router, Sucursal, ConfiguracionFactura, Clase, ConfiguracionGeneralFactura) {

	router.route('/configuraciones-factura/empresa/:id_empresa')
		.get(function (req, res) {
			obtenerConfiguracionesFacturaEmpresa(req, res, true);
		});

	router.route('/configuraciones-factura/:id_configuracion')
		.put(function (req, res) {
			ConfiguracionFactura.update({
				id_impresion_factura: req.body.configuracionFactura.impresionFactura.id,
				id_tipo_facturacion: req.body.configuracionFactura.tipoFacturacion.id,
				id_tamano_papel_factura: req.body.configuracionFactura.tamanoPapelFactura.id,
				id_titulo_factura: req.body.configuracionFactura.tituloFactura.id,
				id_subtitulo_factura: req.body.configuracionFactura.subtituloFactura.id,
				id_pie_factura: req.body.configuracionFactura.pieFactura.id,
				usar_pf: req.body.configuracionFactura.usar_pf,
				imprimir_al_guardar: req.body.configuracionFactura.imprimir_al_guardar,
				id_tamano_papel_nota_venta: req.body.configuracionFactura.tamanoPapelNotaVenta.id,
				id_tamano_papel_nota_traspaso: req.body.configuracionFactura.tamanoPapelNotaTraspaso.id,
				id_tamano_papel_nota_baja: req.body.configuracionFactura.tamanoPapelNotaBaja.id,
				id_tamano_papel_nota_pedido: req.body.configuracionFactura.tamanoPapelNotaPedido.id,
				id_tamano_papel_cierre_caja: req.body.configuracionFactura.tamanoPapelCierreCaja.id,
				id_tamano_papel_cotizacion: req.body.configuracionFactura.tamanoPapelCotizacion.id,
				id_formato_papel_factura: req.body.configuracionFactura.formatoPapelFactura.id,
				id_formato_color_factura: req.body.configuracionFactura.formatoColorFactura.id,
				id_formato_papel_factura_servicio: req.body.configuracionFactura.formatoPapelFacturaServicio.id,
				id_formato_color_factura_servicio: req.body.configuracionFactura.formatoColorFacturaServicio.id,
				id_tamano_papel_factura_servicio: req.body.configuracionFactura.tamanoPapelFacturaServicio.id,
				id_tamano_papel_despacho: req.body.configuracionFactura.tamanoPapelDespacho?req.body.configuracionFactura.tamanoPapelDespacho.id:null,
				id_tamano_papel_farmacia: req.body.configuracionFactura.tamanoPapelFarmacia?req.body.configuracionFactura.tamanoPapelFarmacia.id:null,
				id_tamano_papel_ropa_trabajo: req.body.configuracionFactura.tamanoPapelRopaTrabajo?req.body.configuracionFactura.tamanoPapelRopaTrabajo.id:null,
				id_tamano_papel_caja_chica_ingreso: req.body.configuracionFactura.tamanoPapelCajaChicaIngreso?req.body.configuracionFactura.tamanoPapelCajaChicaIngreso.id:null,
				id_tamano_papel_caja_chica_egreso: req.body.configuracionFactura.tamanoPapelCajaChicaEgreso?req.body.configuracionFactura.tamanoPapelCajaChicaEgreso.id:null,
				nota_factura_bien: req.body.configuracionFactura.nota_factura_bien,
				nota_factura_servicio: req.body.configuracionFactura.nota_factura_servicio,
				color_cabecera_factura: req.body.configuracionFactura.color_cabecera_factura,
				color_detalle_factura: req.body.configuracionFactura.color_detalle_factura,
				color_cabecera_factura_servicio: req.body.configuracionFactura.color_cabecera_factura_servicio,
				color_detalle_factura_servicio: req.body.configuracionFactura.color_detalle_factura_servicio,
				id_tipo_configuracion:req.body.tipoConfiguracion.id,
				id_formato_papel_nota_venta: req.body.configuracionFactura.formatoPapelNotaVenta.id,
				id_formato_color_nota_venta: req.body.configuracionFactura.formatoColorNotaVenta.id,
				color_cabecera_nota_venta: req.body.configuracionFactura.color_cabecera_nota_venta,
				color_detalle_nota_venta: req.body.configuracionFactura.color_detalle_nota_venta,
				nota_factura_nota_venta: req.body.configuracionFactura.nota_factura_nota_venta,
				id_tipo_configuracion_nota_venta:req.body.configuracionFactura.tipoConfiguracionNotaVenta.id,
				id_formato_papel_nota_traspaso: req.body.configuracionFactura.formatoPapelNotaTraspaso.id,
				id_formato_color_nota_traspaso: req.body.configuracionFactura.formatoColorNotaTraspaso.id,
				color_cabecera_nota_traspaso: req.body.configuracionFactura.color_cabecera_nota_traspaso,
				color_detalle_nota_traspaso: req.body.configuracionFactura.color_detalle_nota_traspaso,
				nota_factura_nota_traspaso: req.body.configuracionFactura.nota_factura_nota_traspaso,
				id_formato_papel_nota_baja: req.body.configuracionFactura.formatoPapelNotaBaja.id,
				id_formato_color_nota_baja: req.body.configuracionFactura.formatoColorNotaBaja.id,
				color_cabecera_nota_baja: req.body.configuracionFactura.color_cabecera_nota_baja,
				color_detalle_nota_baja: req.body.configuracionFactura.color_detalle_nota_baja,
				nota_factura_nota_baja: req.body.configuracionFactura.nota_factura_nota_baja,
				id_tipo_configuracion_nota_baja:req.body.configuracionFactura.tipoConfiguracionNotaBaja.id

			}, {
					where: { id: req.params.id_configuracion }
				}).then(function (score) {
					/* Sucursal.update({						
						nota_venta_correlativo: req.body.nota_venta_correlativo,
						nota_traspaso_correlativo: req.body.nota_traspaso_correlativo,
						nota_baja_correlativo: req.body.nota_baja_correlativo,
						pedido_correlativo: req.body.pedido_correlativo,
						nota_recibo_correlativo: req.body.nota_recibo_correlativo,						
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
						caja_chica_egreso_correlativo: req.body.caja_chica_egreso_correlativo
					}, {
							where: {
								id: req.body.id
							}
						}).then(function (sucursalActualizada) { */
							res.json({ mensaje: "¡Configuracion de Factura actualizado correctamente!" });
						/* }); */
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
				id_formato_papel_factura: req.body.formatoPapelFactura.id,
				id_formato_color_factura: req.body.formatoColorFactura.id,
				id_formato_papel_factura_servicio: req.body.formatoPapelFacturaServicio.id,
				id_formato_color_factura_servicio: req.body.formatoColorFacturaServicio.id,
				id_tamano_papel_factura_servicio: req.body.tamanoPapelFacturaServicio.id,
				id_tamano_papel_despacho: req.body.tamanoPapelDespacho?req.body.tamanoPapelDespacho.id:null,
				id_tamano_papel_farmacia: req.body.tamanoPapelFarmacia?req.body.tamanoPapelFarmacia.id:null,
				id_tamano_papel_ropa_trabajo: req.body.tamanoPapelRopaTrabajo?req.body.tamanoPapelRopaTrabajo.id:null,
				id_tamano_papel_caja_chica_ingreso: req.body.tamanoPapelCajaChicaIngreso?req.body.tamanoPapelCajaChicaIngreso.id:null,
				id_tamano_papel_caja_chica_egreso: req.body.tamanoPapelCajaChicaEgreso?req.body.tamanoPapelCajaChicaEgreso.id:null,
				nota_factura_bien: req.body.nota_factura_bien,
				nota_factura_servicio: req.body.nota_factura_servicio,
				color_cabecera_factura: req.body.color_cabecera_factura,
				color_detalle_factura: req.body.color_detalle_factura,
				color_cabecera_factura_servicio: req.body.color_cabecera_factura_servicio,
				color_detalle_factura_servicio: req.body.color_detalle_factura_servicio,
				id_tipo_configuracion:req.body.tipoConfiguracion.id,
				id_formato_papel_nota_venta: req.body.formatoPapelNotaVenta.id,
				id_formato_color_nota_venta: req.body.formatoColorNotaVenta.id,
				color_cabecera_nota_venta: req.body.color_cabecera_nota_venta,
				color_detalle_nota_venta: req.body.color_detalle_nota_venta,
				nota_factura_nota_venta: req.body.nota_factura_nota_venta,
				id_tipo_configuracion_nota_venta:req.body.tipoConfiguracionNotaVenta.id,
				id_formato_papel_nota_traspaso: req.body.formatoPapelNotaTraspaso.id,
				id_formato_color_nota_traspaso: req.body.formatoColorNotaTraspaso.id,
				color_cabecera_nota_traspaso: req.body.color_cabecera_nota_traspaso,
				color_detalle_nota_traspaso: req.body.color_detalle_nota_traspaso,
				nota_factura_nota_traspaso: req.body.nota_factura_nota_traspaso,
				id_formato_papel_nota_baja: req.body.formatoPapelNotaBaja.id,
				id_formato_color_nota_baja: req.body.formatoColorNotaBaja.id,
				color_cabecera_nota_baja: req.body.color_cabecera_nota_baja,
				color_detalle_nota_baja: req.body.color_detalle_nota_baja,
				nota_factura_nota_baja: req.body.nota_factura_nota_baja,
				id_tipo_configuracion_nota_baja: req.body.tipoConfiguracionNotaBaja.id,
				
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
				{ model: Clase, as: 'tamanoPapelFacturaServicio' },
				{ model: Clase, as: 'formatoPapelFactura' },
				{ model: Clase, as: 'formatoColorFactura' },
				{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
				{ model: Clase, as: 'tamanoPapelNotaBaja' },
				{ model: Clase, as: 'tamanoPapelNotaPedido' },
				{ model: Clase, as: 'tamanoPapelCierreCaja' },
				{ model: Clase, as: 'tamanoPapelCotizacion' },
				{ model: Clase, as: 'tamanoPapelDespacho' },
				{ model: Clase, as: 'tamanoPapelFarmacia' },
				{ model: Clase, as: 'tamanoPapelRopaTrabajo' },
				{ model: Clase, as: 'tamanoPapelCajaChicaIngreso' },
				{ model: Clase, as: 'tamanoPapelCajaChicaEgreso' },
				{ model: Clase, as: 'formatoPapelFacturaServicio' },
				{ model: Clase, as: 'formatoColorFacturaServicio' },
				{ model: Clase, as: 'tipoConfiguracion' },

				{ model: Clase, as: 'formatoPapelNotaVenta'},
				{ model: Clase, as: 'formatoColorNotaVenta'},
				{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
				{ model: Clase, as: 'formatoPapelNotaTraspaso'},
				{ model: Clase, as: 'formatoColorNotaTraspaso'},
				{ model: Clase, as: 'formatoPapelNotaBaja'},
				{ model: Clase, as: 'formatoColorNotaBaja'},
				{ model: Clase, as: 'tipoConfiguracionNotaBaja'}]

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
									where: { nombre_corto: "FORM_C_MAR" }
								}).then(function (formatoPapelImpresion) {
									Clase.find({
										where: { nombre_corto: "FORM_S_COL" }
									}).then(function (formatoColorImpresion) {
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
													id_formato_papel_factura: formatoPapelImpresion.id,
													id_formato_color_factura: formatoColorImpresion.id,
													id_formato_papel_factura_servicio: formatoPapelImpresion.id,
													id_formato_color_factura_servicio: formatoColorImpresion.id,
													id_tamano_papel_factura_servicio: tipoPapelFactura.id,
													id_tamano_papel_despacho: tipoPapelFactura.id,
													id_tamano_papel_farmacia: tipoPapelFactura.id,
													id_tamano_papel_ropa_trabajo: tipoPapelFactura.id,
													id_tamano_papel_caja_chica_ingreso: tipoPapelFactura.id,
													id_tamano_papel_caja_chica_egreso: tipoPapelFactura.id,
													id_formato_papel_nota_venta: formatoPapelImpresion.id,
													id_formato_color_nota_venta: formatoColorImpresion.id

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
									where: { nombre_corto: "FORM_C_MAR" }
								}).then(function (formatoPapelImpresion) {
									Clase.find({
										where: { nombre_corto: "FORM_S_COL" }
									}).then(function (formatoColorImpresion) {
										Clase.find({
											where: { nombre_corto: "L453" }
										}).then(function (pieFactura) {
											sucursales.forEach(function (sucursal, index, array) {
												ConfiguracionFactura.create({
													id_sucursal: sucursal.id,
													id_impresion_factura: impresionFactura.id,
													id_tipo_facturacion: tipoFactura.id,
													id_tamano_papel_factura: tipoPapelFactura.id,
													id_formato_papel_factura: formatoPapelImpresion.id,
													id_formato_color_factura: formatoColorImpresion.id,
													id_formato_papel_factura_servicio: formatoPapelImpresion.id,
													id_formato_color_factura_servicio: formatoColorImpresion.id,
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
													id_tamano_papel_despacho: tipoPapelFactura.id,
													id_tamano_papel_farmacia: tipoPapelFactura.id,
													id_tamano_papel_ropa_trabajo: tipoPapelFactura.id,
													id_tamano_papel_caja_chica_ingreso: tipoPapelFactura.id,
													id_tamano_papel_caja_chica_egreso: tipoPapelFactura.id,
													id_formato_papel_nota_venta: formatoPapelImpresion.id,
													id_formato_color_nota_venta: formatoColorImpresion.id

												}).then(function (score) {
													if (index === (array.length - 1)) {
														obtenerConfiguracionesFacturaEmpresa(req, res, false);
													}
												});
											});
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
			{ model: Clase, as: 'tamanoPapelFacturaServicio' },
			{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
			{ model: Clase, as: 'tamanoPapelNotaBaja' },
			{ model: Clase, as: 'tamanoPapelNotaPedido' },
			{ model: Clase, as: 'tamanoPapelCierreCaja' },
			{ model: Clase, as: 'tamanoPapelCotizacion' },
			{ model: Clase, as: 'tamanoPapelDespacho' },
			{ model: Clase, as: 'tamanoPapelFarmacia' },
			{ model: Clase, as: 'tamanoPapelRopaTrabajo' },
			{ model: Clase, as: 'tamanoPapelCajaChicaIngreso' },
			{ model: Clase, as: 'tamanoPapelCajaChicaEgreso' },
			{ model: Clase, as: 'formatoPapelFactura' },
			{ model: Clase, as: 'formatoColorFactura' },
			{ model: Clase, as: 'formatoPapelFacturaServicio' },
			{ model: Clase, as: 'formatoColorFacturaServicio' },
			{ model: Clase, as: 'tipoConfiguracion' },
			{ model: Clase, as: 'formatoPapelNotaVenta' },
			{ model: Clase, as: 'formatoColorNotaVenta' },
			{ model: Clase, as: 'tipoConfiguracionNotaVenta' },
			{ model: Clase, as: 'formatoPapelNotaTraspaso' },
			{ model: Clase, as: 'formatoColorNotaTraspaso' },
			{ model: Clase, as: 'formatoPapelNotaBaja'},
			{ model: Clase, as: 'formatoColorNotaBaja'},
			{ model: Clase, as: 'tipoConfiguracionNotaBaja'}]
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
							}).then(function (formatoPapelImpresion) {
								Clase.find({
									where: { nombre_corto: "FORM_S_COL" }
								}).then(function (formatoColorImpresion) {
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
											id_formato_color_factura: formatoColorImpresion.id,
											id_formato_papel_factura_servicio: formatoPapelImpresion.id,
											id_formato_color_factura_servicio: formatoColorImpresion.id,
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
											id_tamano_papel_factura_servicio: tipoPapelFactura.id,
											id_tamano_papel_despacho: tipoPapelFactura.id,
											id_tamano_papel_farmacia: tipoPapelFactura.id,
											id_tamano_papel_ropa_trabajo: tipoPapelFactura.id,
											id_tamano_papel_caja_chica_ingreso: tipoPapelFactura.id,
											id_tamano_papel_caja_chica_egreso: tipoPapelFactura.id,
											id_formato_papel_nota_venta: formatoPapelImpresion.id,
											id_formato_color_nota_venta: formatoColorImpresion.id

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
				{ model: Clase, as: 'tamanoPapelFacturaServicio' },
				{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
				{ model: Clase, as: 'tamanoPapelNotaBaja' },
				{ model: Clase, as: 'tamanoPapelNotaPedido' },
				{ model: Clase, as: 'tamanoPapelCierreCaja' },
				{ model: Clase, as: 'tamanoPapelCotizacion' },
				{ model: Clase, as: 'tamanoPapelDespacho' },
				{ model: Clase, as: 'tamanoPapelFarmacia' },
				{ model: Clase, as: 'tamanoPapelRopaTrabajo' },
				{ model: Clase, as: 'tamanoPapelCajaChicaIngreso' },
				{ model: Clase, as: 'tamanoPapelCajaChicaEgreso' },
				{ model: Clase, as: 'formatoPapelFactura' },
				{ model: Clase, as: 'formatoColorFactura' },
				{ model: Clase, as: 'formatoPapelFacturaServicio' },
				{ model: Clase, as: 'formatoColorFacturaServicio' },
				{ model: Clase, as: 'tipoConfiguracion' },
				{ model: Clase, as: 'formatoPapelNotaVenta'},
				{ model: Clase, as: 'formatoColorNotaVenta'},
				{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
				{ model: Clase, as: 'formatoPapelNotaTraspaso'},
				{ model: Clase, as: 'formatoColorNotaTraspaso'},
				{ model: Clase, as: 'formatoPapelNotaBaja'},
				{ model: Clase, as: 'formatoColorNotaBaja'},
				{ model: Clase, as: 'tipoConfiguracionNotaBaja'}]

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
						{ model: Clase, as: 'tamanoPapelFacturaServicio' },
						{ model: Clase, as: 'tamanoPapelNotaTraspaso' },
						{ model: Clase, as: 'tamanoPapelNotaBaja' },
						{ model: Clase, as: 'tamanoPapelNotaPedido' },
						{ model: Clase, as: 'tamanoPapelCierreCaja' },
						{ model: Clase, as: 'tamanoPapelCotizacion' },
						{ model: Clase, as: 'tamanoPapelDespacho' },
						{ model: Clase, as: 'tamanoPapelFarmacia' },
						{ model: Clase, as: 'tamanoPapelRopaTrabajo' },
						{ model: Clase, as: 'tamanoPapelCajaChicaIngreso' },
						{ model: Clase, as: 'tamanoPapelCajaChicaEgreso' },
						{ model: Clase, as: 'formatoPapelFactura' },
						{ model: Clase, as: 'formatoColorFactura' },
						{ model: Clase, as: 'formatoPapelFacturaServicio' },
						{ model: Clase, as: 'formatoColorFacturaServicio' },
						{ model: Clase, as: 'tipoConfiguracion' },
						{ model: Clase, as: 'formatoPapelNotaVenta'},
						{ model: Clase, as: 'formatoColorNotaVenta'},
						{ model: Clase, as: 'tipoConfiguracionNotaVenta'},
						{ model: Clase, as: 'formatoPapelNotaTraspaso'},
						{ model: Clase, as: 'formatoColorNotaTraspaso'},
						{ model: Clase, as: 'formatoPapelNotaBaja'},
						{ model: Clase, as: 'formatoColorNotaBaja'},
						{ model: Clase, as: 'tipoConfiguracionNotaBaja'}]
					}).then(function (configuracionEspecifica) {
						res.json(configuracionEspecifica);
					});
				}
			});
		});
}