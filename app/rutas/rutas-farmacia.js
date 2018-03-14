module.exports = function (router, sequelize, Sequelize, Usuario, Farmacia, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, Movimiento, SucursalActividadDosificacion, CodigoControl, NumeroLiteral, Dosificacion, Venta, DetalleVenta, Producto, Cliente, Almacen, MedicoPaciente, RrhhEmpleadoCargo, Inventario, ConfiguracionGeneralFactura, DetalleMovimiento, ConfiguracionFactura, decodeBase64Image, fs) {

	router.route('/venta-farmacia')

    .post(function(req, res) {
		Farmacia.create({
			id_venta:req.body.id_venta,
			diagnostico:req.body.diagnostico,
			observaciones:req.body.observaciones,
			id_consulta:null
		}).then(function(farmacia){
			res.json(farmacia);
		});
    })

    router.route('/ventas-farmacia/:idsSucursales/inicio/:inicio/fin/:fin/codigo/:codigo/nombreCompleto/:nombreCompleto/ci/:ci/tipo-venta/:tipo_venta/campo/:campo/cargo/:cargo/empresa/:empresa/numero_receta/:numero_receta')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
			var condicionPaciente = {}, condicionPersona = {}, condicionCargo = {}, condicionFarmacia = {}, condicionVenta = { fecha: { $between: [inicio, fin] } },
				condicionTransaccion = {},
				condicionUsuario = {}, pacienteRequerido = false;
			if (req.params.codigo != 0) {
				condicionPaciente.codigo = { $like: "%" + req.params.codigo + "%" };
				pacienteRequerido = true;
			}
			if (req.params.nombreCompleto != 0) {
				condicionPersona.nombre_completo = { $like: "%" + req.params.nombreCompleto + "%" };
			}
			if (req.params.ci != 0) {
				condicionPersona.ci = req.params.ci;
			}
			if (req.params.tipo_venta != 0) {
				condicionVenta.id_tipo_pago = req.params.tipo_venta;
			}
			if (req.params.empresa != 0) {
				condicionPaciente.designacion_empresa = { $like: "%" + req.params.empresa + "%" };
				pacienteRequerido = true;
			}
			if (req.params.numero_receta != 0) {
				condicionFarmacia.numero_receta = parseInt(req.params.numero_receta);
			}
			if (req.params.campo != 0) {
				condicionPaciente.campo = { $like: "%" + req.params.campo + "%" };
				pacienteRequerido = true;
			}
			if (req.params.cargo != 0) {
				condicionCargo.id = parseInt(req.params.cargo);
			}
			// if (req.params.usuario != 0) {
			// 	condicionUsuario.nombre_usuario = { $like: "%" + req.params.usuario + "%" };
			// }
			Venta.findAll({
				where: condicionVenta,
				include: [{
					model: DetalleVenta, as: 'detallesVenta',
					include: [{ model: Producto, as: 'producto' }]
				},
				{ 
					model: Farmacia, as: 'farmacia' ,
					where: condicionFarmacia,
					include: [{
						 // ===== agregar modelo de persona para mostrar los datos del paciente ====
						 // en clientes esta encontrando cliente q no pertenecen a pacientes ======
						model: MedicoPaciente, as: 'paciente',
						where: condicionPaciente,
						required: pacienteRequerido,
						include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo", where: condicionCargo }]}, { model: Persona, as: 'persona', where: condicionPersona}]
					}]
				},
				{ model: Clase, as: 'tipoPago' },
				{ model: Usuario, as: 'usuario'},
				{
					model: Movimiento, as: 'movimiento',
					include: [{ model: Clase, as: 'clase'}]
				},
				{
					model: Almacen, as: 'almacen',
					include: [{
						model: Sucursal, as: 'sucursal'
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
	})

	router.route('/ventas-farmacia/:id/empresa/:id_empresa')
		.get(function (req, res) {
			Venta.find({
				where: {
					id: req.params.id
				},
				include: [{ model: Cliente, as: 'cliente' },
				{ 
					model: Farmacia, as: 'farmacia' ,
					include: [{
						model: MedicoPaciente, as: 'paciente',
						include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo"}]}, { model: Persona, as: 'persona'}]
					}]
				},
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
								{ model: Clase, as: 'tamanoPapelNotaVenta' },
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
		});

	router.route('/ventas-farmacia')
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
									}, {transaction: t}).then(function (clienteCreado) {
										return crearVenta(venta, res, clienteCreado.id, movimientoCreado, dosificacion, true, sucursalActividadDosificacion.sucursal,t);
									});
								} else {
									return crearVenta(venta, res, venta.cliente.id, movimientoCreado, dosificacion, true, sucursalActividadDosificacion.sucursal,t);
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
								venta.numero_receta  = sucursal.nota_venta_farmacia_correlativo;
								venta.numero_literal = NumeroLiteral.Convertir(parseFloat(venta.total).toFixed(2).toString());
								venta.actividad = { id: null };

								if (sucursal.empresa.usar_pedidos) {
									venta.pedido = sucursal.pedido_correlativo;
								}

								return crearVenta(venta, res, null, movimientoCreado, null, false, sucursal,t);
								
							});
							//SI ES PREFACTURACION
						}else if (movimiento == Diccionario.EGRE_PRE_FACTURACION) {
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
									}, {transaction: t}).then(function (clienteCreado) {
										return crearVenta(venta, res, clienteCreado.id, movimientoCreado, null, false, sucursal,t);
									});
								} else {
									return crearVenta(venta, res, venta.cliente.id, movimientoCreado, null, false, sucursal,t);
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
			id_vendedor: (venta.vendedor?venta.vendedor.id:null)
		}, { transaction: t }).then(function (ventaCreada) {
			

			var promisesVenta = [];
			venta.id=ventaCreada.id;
			// === agregar numero receta autoincrementado ==============<
			Farmacia.create({
				id_venta:ventaCreada.id,
				diagnostico: (venta.diagnostico?venta.diagnostico:null),
				observaciones: (venta.observaciones?venta.observaciones:null),
				numero_receta: venta.numero_receta,
				id_paciente:venta.cliente.id
			}).then(function(farmacia){
				// promisesVenta.unshift(ventaCreada);
				// venta.id = ventaCreada.id;
				// res.json(farmacia);
			});
				
			

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
					nota_venta_correlativo: (venta.factura + 1),
					nota_venta_farmacia_correlativo: (venta.numero_receta + 1)
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
						})/*.then(function (result) {
								return new Promise(function (fulfill, reject){
									fulfill(datosVenta);
								});
							})*/;
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
			id_inventario: (detalleVenta.costos.length > 0) ? detalleVenta.costos[0].id : null,
			observaciones: detalleVenta.observaciones
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



	



}