module.exports = function (router, ContabilidadCuenta, ClasificacionCuenta, Tipo, Clase, Usuario, Diccionario, ClienteCuenta, ProveedorCuenta, ConfiguracionCuenta,sequelize) {

	router.route('/contabilidad-cuentas/empresa/:id_empresa')
		.get(function (req, res) {
			ContabilidadCuenta.findAll({
				where: {
					id_empresa: req.params.id_empresa,
					eliminado: false
				},
				include: [{ model: Clase, as: 'tipoCuenta' }, { model: Clase, as: 'claseCalculo' }, { model: ClasificacionCuenta, as: 'clasificacion', include: [{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }] }],
				
			}).then(function (ListaCuenta) {
				res.json(ListaCuenta)
			})

		})
		
		router.route('/validar-codigo')
		.post(function(req, res) {
			ContabilidadCuenta.find({ 
				where:{
					codigo: req.body.codigo
				}
			}).then(function(entidad){
				if(entidad){
					res.json({
						type: true,
						message: "¡el codigo ya Exsiste!"
					});
				}else{
					res.json({
						type: false,
						message: "Codigo Disponible"
					});
				}
			});
		});
	router.route('/contabilidad-cuentas/asignar-cuenta-cliente')
		.post(function (req, res) {
			ClienteCuenta.create({
				id_cuenta:req.body.cuenta.id,
				id_cliente: req.body.id_cliente
			}).then(function (clienteCuentaActualizado) {
				res.json({cliente:clienteCuentaActualizado,menssage:"cuenta asignada satisfactoriamente"})
			})

		})
	router.route('/contabilidad-cuentas/asignar-cuenta-proveedor')
		.post(function (req, res) {
			ProveedorCuenta.create({
				id_cuenta:req.body.cuenta.id,
				id_proveedor: req.body.id_proveedor
			}).then(function (proveedorCuentaActualizado) {
				res.json({proveedor:proveedorCuentaActualizado,menssage:"cuenta asignada satisfactoriamente"})
			})

		})
	router.route('/configuracion-cuentas/:id_empresa')
		.get(function (req, res) {
			ConfiguracionCuenta.findAll({
				where: {
					id_empresa: req.params.id_empresa,
				}, include: [{ model: ContabilidadCuenta, as: 'cuenta' }, { model: Tipo, as: 'tipo' }],
				 order: [['id', 'asc']]
			}).then(function (ListaConfiguracionCuenta) {
				res.json({ lista: ListaConfiguracionCuenta, menssage: "plantilla actualizada satisfactoriamente!" })
			})
		})
	router.route('/configuracion-cuentas/empresa/:id_empresa')
		.get(function (req, res) {
			Tipo.find({
				where: {
					nombre_corto: Diccionario.MOV_ING
				}
			}).then(function (tipoEncontrado) {
				ConfiguracionCuenta.findOrCreate({
					where: {
						id_empresa: req.params.id_empresa,
						nombre: Diccionario.CAJA_BANCOS,
						id_tipo: tipoEncontrado.id
					}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.CAJA_BANCOS }

				}).then(function (ListaCuenta) {
					ConfiguracionCuenta.findOrCreate({
						where: {
							id_empresa: req.params.id_empresa,
							nombre: Diccionario.IT,
							id_tipo: tipoEncontrado.id
						}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IT }
					}).then(function (ListaCuenta) {
						ConfiguracionCuenta.findOrCreate({
							where: {
								id_empresa: req.params.id_empresa,
								nombre: Diccionario.IVA_DF,
								id_tipo: tipoEncontrado.id
							}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IVA_DF }

						}).then(function (ListaCuenta) {
							ConfiguracionCuenta.findOrCreate({
								where: {
									id_empresa: req.params.id_empresa,
									nombre: Diccionario.IT_POR_PAGAR,
									id_tipo: tipoEncontrado.id
								}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IT_POR_PAGAR }
							}).then(function (ListaCuenta) {
								Tipo.find({
									where: {
										nombre_corto: Diccionario.MOV_EGRE
									}
								}).then(function (tipoEncontradoE) {
									ConfiguracionCuenta.findOrCreate({
										where: {
											id_empresa: req.params.id_empresa,
											nombre: Diccionario.CAJA_BANCOS,
											id_tipo: tipoEncontradoE.id
										}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontradoE.id, valor: req.body.valor, nombre: Diccionario.CAJA_BANCOS }

									}).then(function (ListaCuenta) {
										ConfiguracionCuenta.findOrCreate({
											where: {
												id_empresa: req.params.id_empresa,
												nombre: Diccionario.IVA_CF,
												id_tipo: tipoEncontradoE.id
											}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontradoE.id, valor: req.body.valor, nombre: Diccionario.IVA_CF }
										}).then(function (ListaCuenta) {
											ConfiguracionCuenta.findAll({
												where: {
													id_empresa: req.params.id_empresa,

												}, include: [{ model: ContabilidadCuenta, as: 'cuenta' },{ model: Tipo, as: 'tipo' }], order: [['id', 'asc']]
											}).then(function (ListaConfiguracionCuenta) {
												res.json({ lista: ListaConfiguracionCuenta, menssage: "plantilla actualizada satisfactoriamente!" })
											})
										})
									})
								})
							})
						})
					})
				})
			})
		})
		.put(function (req, res) {
			Tipo.find({
				where: {
					nombre_corto: Diccionario.MOV_ING
				}
			}).then(function (tipoEncontrado) {
				ConfiguracionCuenta.update({
					id_cuenta: req.body.ingreso.ivadf.cuenta.id,
					valor: req.body.ingreso.ivadf.porsentaje.toString(),
				}, {
						where: {
							id_empresa: req.params.id_empresa,
							nombre: Diccionario.IVA_DF,
							id_tipo: tipoEncontrado.id
						}
					}).then(function (configuracionActualizado) {
						ConfiguracionCuenta.update({
							id_cuenta: req.body.ingreso.it.cuenta.id,
							valor: req.body.ingreso.it.porsentaje.toString(),
						}, {
								where: {
									id_empresa: req.params.id_empresa,
									nombre: Diccionario.IT,
									id_tipo: tipoEncontrado.id
								}
							}).then(function (configuracionActualizado) {
								ConfiguracionCuenta.update({
									id_cuenta: req.body.ingreso.itPorPagar.cuenta.id,
									valor: req.body.ingreso.itPorPagar.porsentaje.toString(),
								}, {
										where: {
											id_empresa: req.params.id_empresa,
											nombre: Diccionario.IT_POR_PAGAR,
											id_tipo: tipoEncontrado.id
										}
									}).then(function (configuracionActualizado) {
										ConfiguracionCuenta.update({
											id_cuenta: req.body.ingreso.cajaBanco.cuenta.id,
											valor: req.body.ingreso.cajaBanco.porsentaje.toString(),
										}, {
												where: {
													id_empresa: req.params.id_empresa,
													nombre: Diccionario.CAJA_BANCOS,
													id_tipo: tipoEncontrado.id
												}
											}).then(function (configuracionActualizado) {
												Tipo.find({
													where: {
														nombre_corto: Diccionario.MOV_EGRE
													}
												}).then(function (tipoEncontradoE) {
													ConfiguracionCuenta.update({
														id_cuenta: req.body.egreso.cajaBanco.cuenta.id,
														valor: req.body.egreso.cajaBanco.porsentaje.toString(),
													}, {
															where: {
																id_empresa: req.params.id_empresa,
																nombre: Diccionario.CAJA_BANCOS,
																id_tipo: tipoEncontradoE.id
															}
														}).then(function (configuracionActualizado) {
															ConfiguracionCuenta.update({
																id_cuenta: req.body.egreso.ivacf.cuenta.id,
																valor: req.body.egreso.ivacf.porsentaje.toString(),
															}, {
																	where: {
																		id_empresa: req.params.id_empresa,
																		nombre: Diccionario.IVA_CF,
																		id_tipo: tipoEncontradoE.id
																	}
																}).then(function (configuracionActualizado) {
																	res.json({ menssage: "Actualizado Sadisfactoriamente!" })
																})
														})
												})
											})
									})
							})
					})

			})

		})
	router.route('/contabilidad-cuenta/:id')
		.put(function (req, res) {
			ContabilidadCuenta.update({
				id_empresa: req.body.id_empresa,
				codigo: req.body.codigo,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				debe: req.body.debe,
				haber: req.body.haber,
				saldo: req.body.saldo,
				id_clasificacion: req.body.clasificacion.id,
				id_tipo_cuenta: req.body.tipoCuenta.id,
				bimonetaria: req.body.bimonetaria,
				aplicar_calculo: req.body.aplicar_calculo,
				monto: req.body.monto,
				eliminado: req.body.eliminado
			}, {
					where: {
						id: req.body.id
					}
				}).then(function (ContabilidadCuentaActualizada) {
					res.json({ mensaje: 'Creado' })
				});
		})

	router.route('/contabilidad-cuenta')
		.post(function (req, res) {
			ContabilidadCuenta.create({
				id_empresa: req.body.id_empresa,
				codigo: req.body.codigo,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				debe: req.body.debe,
				haber: req.body.haber,
				saldo: req.body.saldo,
				id_clasificacion: req.body.clasificacion.id,
				id_tipo_cuenta: req.body.tipoCuenta.id,
				bimonetaria: req.body.bimonetaria,
				aplicar_calculo: req.body.aplicar_calculo,
				monto: req.body.monto,
				id_calculo: req.body.claseCalculo.id,
				eliminado: req.body.eliminado
			}).then(function (cuentaCreada) {
				if (req.body.cliente != null) {
					ClienteCuenta.create({
						id_cuenta: cuentaCreada.id,
						id_cliente: req.body.cliente.id
					}).then(function (CuentaClienteCreado) {
						res.json({ mensaje: 'cuentaCreada' })
					})
				} else if(req.body.proveedor!=null) {
					ProveedorCuenta.create({
						id_cuenta: cuentaCreada.id,
						id_proveedor: req.body.proveedor.id
					})
						.then(function (CuentaClienteCreado) {
							res.json({ mensaje: 'cuentaCreada' })
						})
				}else{
					res.json({ mensaje: 'cuentaCreada' })
				}

			})

		})

	router.route('/contabilidad-cuentas/clasificaciones')
		.get(function (req, res) {
			ClasificacionCuenta.findAll({
				// where: {id_empresa: req.params.id_empresa},
				include: [{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }],

			}).then(function (clasificacionesCuenta) {
				Clase.findAll({
					where: [{
						nombre_corto: {
							$like: "%" + "CONTCLS" + "%"
						}
					}],
				}).then(function (listaClasificaiones) {
					res.json({ clasificaciones: clasificacionesCuenta });
				})
			});
		})

	router.route('/contabilidad-cuentas/clasificaciones')
		.post(function (req, res) {
			ClasificacionCuenta.create({
				nombre: req.body.nombre,
				id_saldo: req.body.saldo.id,
				id_movimiento: req.body.movimiento.id
			}).then(function (clasificionCuenta) {
				res.json({ mensaje: "Cotización creada sadisfactoriamente..." })
			});
		})

	router.route('/contabilidad-cuentas/clasificaciones/edicion')
		.put(function (req, res) {
			req.body.forEach(function (clasificacion, index, array) {
				if(!clasificacion.eliminado){
					if(clasificacion.id){
						ClasificacionCuenta.update({
							nombre: clasificacion.nombre,
							id_saldo: clasificacion.saldo.id,
							id_movimiento: clasificacion.movimiento.id
						},{
							where:{
								id:clasificacion.id
							}
						});
					}else{
						ClasificacionCuenta.create({
							nombre: clasificacion.nombre,
							id_saldo: clasificacion.saldo.id,
							id_movimiento: clasificacion.movimiento.id
						});
					}
				}else{
					ClasificacionCuenta.destroy({
						where:{
							id:clasificacion.id
						}
					});
				}

				if(index==(array.length-1)){
					res.json({ mensaje: "Clasificaciones actualizadas satisfactoriamente!" })
				}

			});
			
		})

	router.route('/contabilidad-cuentas/clasificaciones/:id')
		.put(function (req, res) {
			ClasificacionCuenta.update({
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				numero_documento: req.body.numero_documento,
				fecha: req.body.fecha,
				importe: req.body.importe,
				id_usuario: req.body.id_usuario
			}, {
					where: {
						id: req.params.id
					}
				});
		})

	router.route('/contabilidad-cuentas/empresa/:id_empresa/clasificacion/:id_clasificacion/tipo/:id_tipo/monto/:monto/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/columna/:columna/direccion/:direccion')
		.get(/*ensureAuthorized,*/function (req, res) {
			var condicionCuenta = {}, ordenArreglo = [];

			if (req.params.columna == "clasificacion") {
				ordenArreglo.push({ model: ClasificacionCuenta, as: 'clasificacion' });
				req.params.columna = "nombre";
			} else if (req.params.columna == "tipoCuenta") {
				ordenArreglo.push({ model: Clase, as: 'tipoCuenta' });
				req.params.columna = "nombre";
			}
			ordenArreglo.push(req.params.columna);
			ordenArreglo.push(req.params.direccion);

			if (req.params.busqueda != 0) {
				condicionCuenta = 
				{
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
			}
			
			condicionCuenta.id_empresa = parseInt(req.params.id_empresa);

			if (req.params.id_clasificacion != 0) {
				condicionCuenta.id_clasificacion = parseInt(req.params.id_clasificacion);
			}
			if (req.params.id_tipo != 0) {
				condicionCuenta.id_tipo_cuenta = parseInt(req.params.id_tipo);
			}
			if (req.params.monto != 0) {
				condicionCuenta.monto = parseFloat(req.params.monto);
			}
			condicionCuenta.eliminado = false
			ContabilidadCuenta.findAndCountAll({
				where: condicionCuenta,
				include: [{ model: ClasificacionCuenta, as: 'clasificacion' }],

			}).then(function (data) {
				ContabilidadCuenta.findAll({
					offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
					where: condicionCuenta,
					include: [
						{
							model: ClasificacionCuenta, as: "clasificacion",
							include: [{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }]
						},
						{
							model: Clase, as: 'tipoCuenta'
						},
						{
							model: Clase, as: 'claseCalculo'
						}
					],
					order: [ordenArreglo]
				}).then(function (cuentas) {
					res.json({ cuentas: cuentas, paginas: Math.ceil(data.count / req.params.items_pagina) });
				});
			})
		});
	
	router.route('/cuentas/empresa')
		.post(function (req, res) {
			req.body.cuentas.forEach(function (cuenta, index, array) {
				sequelize.transaction(function (t) {
					return ClasificacionCuenta.findOrCreate({
						where: { nombre: cuenta.clasificacion.nombre },
						defaults: {nombre: cuenta.clasificacion.nombre},
						transaction: t,
						lock: t.LOCK.UPDATE
					}).then(function (claficiacionEncontrada) {
						return Tipo.find({
							where: { nombre_corto: Diccionario.TIPOS_CUENTA_CONTABILIDAD },
							transaction: t
						}).then(function (TipoEncontrado) {
							return Clase.findOrCreate({
								where: { nombre: cuenta.tipoCuenta.nombre },
								defaults: {nombre: cuenta.tipoCuenta.nombre,
											id_tipo: TipoEncontrado.id},
								transaction: t,
								lock: t.LOCK.UPDATE
							}).then(function (claseEncontrada) {
								return ContabilidadCuenta.create({
									id_empresa: req.body.id_empresa,
									codigo: cuenta.codigo,
									nombre: cuenta.nombre,
									descripcion: cuenta.descripcion,
									debe: cuenta.debe,
									haber: cuenta.haber,
									saldo: cuenta.saldo,
									id_clasificacion: claficiacionEncontrada.id,
									id_tipo_cuenta: claseEncontrada.id,
									bimonetaria: cuenta.bimonetaria,
									eliminado: false
								}, { transaction: t });
							})
						});
					})
				}).then(function (result) {
					if (index === (array.length - 1)) {
						res.json({ mensaje: "¡Cuentas creados satisfactoriamente!" });
					}
				}).catch(function (err) {
					res.json({ hasError: true, message: err.stack });
				});
			});
		});

}
