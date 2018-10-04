module.exports = function (router, ContabilidadCuenta, ClasificacionCuenta, Tipo, Clase, Usuario, Diccionario, ClienteCuenta, ProveedorCuenta, ConfiguracionCuenta, sequelize, Cliente, Proveedor, MedicoPaciente, Persona, ContabilidadConfiguracionGeneralTipoCuenta) {

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
	router.route('/contabilidad-configuracion-general-tipos-cuentas/empresa/:id_empresa')
		.post(function (req, res) {
			req.body.forEach(function (dato, index, array) {
				if (dato.id) {
					ContabilidadConfiguracionGeneralTipoCuenta.update({
						id_tipo_cuenta: dato.tipoCuenta.id,
						digitos: dato.digitos
					}, {
						where: { id_empresa: req.params.id_empresa }
						}).then(function (actualizado) {
							if (index === (array.length - 1)) {
								res.json({mensaje:"Guardado satisfactoriamente!"})
							}
						})
				} else {
					ContabilidadConfiguracionGeneralTipoCuenta.create({
						id_tipo_cuenta: dato.tipoCuenta.id,
						digitos: dato.digitos,
						id_empresa: req.params.id_empresa
					}).then(function (creado) {
						if (index === (array.length - 1)) {
							res.json({mensaje:"Guardado satisfactoriamente!"})
						}
					})
				}
			})
		})
		.get(function (req, res) {
			ContabilidadConfiguracionGeneralTipoCuenta.findAll({
				where: {
					id_empresa: req.params.id_empresa,
				},
				include:[{model:Clase,as:'tipoCuenta'}]
			}).then(function (ListaCuenta) {
				res.json(ListaCuenta)
			})

		})
	router.route('/validar-codigo/empresa/:id_empresa')
		.post(function (req, res) {
			ContabilidadCuenta.find({
				where: {
					id_empresa: req.params.id_empresa,
					codigo: req.body.codigo,
					eliminado: false
				}
			}).then(function (entidad) {
				if (entidad) {
					res.json({
						type: true,
						message: "¡el codigo ya Exsiste!"
					});
				} else {
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
				id_cuenta: req.body.cuenta.id,
				id_cliente: req.body.id_cliente
			}).then(function (clienteCuentaActualizado) {
				res.json({ cliente: clienteCuentaActualizado, menssage: "cuenta asignada satisfactoriamente" })
			})

		})
	router.route('/contabilidad-cuentas/asignar-cuenta-proveedor')
		.post(function (req, res) {
			ProveedorCuenta.create({
				id_cuenta: req.body.cuenta.id,
				id_proveedor: req.body.id_proveedor
			}).then(function (proveedorCuentaActualizado) {
				res.json({ proveedor: proveedorCuentaActualizado, menssage: "cuenta asignada satisfactoriamente" })
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
											ConfiguracionCuenta.findOrCreate({
												where: {
													id_empresa: req.params.id_empresa,
													nombre: Diccionario.IT_RETENCION_BIEN,
													id_tipo: tipoEncontrado.id
												}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IT_RETENCION_BIEN }
											}).then(function (ListaCuenta) {
												ConfiguracionCuenta.findOrCreate({
													where: {
														id_empresa: req.params.id_empresa,
														nombre: Diccionario.IUE_RETENCION_BIEN,
														id_tipo: tipoEncontrado.id
													}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IUE_RETENCION_BIEN }
												}).then(function (ListaCuenta) {
													ConfiguracionCuenta.findOrCreate({
														where: {
															id_empresa: req.params.id_empresa,
															nombre: Diccionario.CUENTA_ALMACEN_RETENCION_BIEN,
															id_tipo: tipoEncontrado.id
														}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.CUENTA_ALMACEN_RETENCION_BIEN }
													}).then(function (ListaCuenta) {
														ConfiguracionCuenta.findOrCreate({
															where: {
																id_empresa: req.params.id_empresa,
																nombre: Diccionario.IT_RETENCION_BIEN_GASTO,
																id_tipo: tipoEncontrado.id
															}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IT_RETENCION_BIEN_GASTO }
														}).then(function (ListaCuenta) {
															ConfiguracionCuenta.findOrCreate({
																where: {
																	id_empresa: req.params.id_empresa,
																	nombre: Diccionario.IUE_RETENCION_BIEN_GASTO,
																	id_tipo: tipoEncontrado.id
																}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IUE_RETENCION_BIEN_GASTO }
															}).then(function (ListaCuenta) {
																ConfiguracionCuenta.findOrCreate({
																	where: {
																		id_empresa: req.params.id_empresa,
																		nombre: Diccionario.CUENTA_GASTO_RETENCION_BIEN,
																		id_tipo: tipoEncontrado.id
																	}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.CUENTA_GASTO_RETENCION_BIEN }
																}).then(function (ListaCuenta) {
																	ConfiguracionCuenta.findOrCreate({
																		where: {
																			id_empresa: req.params.id_empresa,
																			nombre: Diccionario.CUENTA_RETENCION_SERVICIO,
																			id_tipo: tipoEncontrado.id
																		}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.CUENTA_RETENCION_SERVICIO }
																	}).then(function (ListaCuenta) {
																		ConfiguracionCuenta.findOrCreate({
																			where: {
																				id_empresa: req.params.id_empresa,
																				nombre: Diccionario.IT_RETENCION_SERVICIO,
																				id_tipo: tipoEncontrado.id
																			}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IT_RETENCION_SERVICIO }
																		}).then(function (ListaCuenta) {
																			ConfiguracionCuenta.findOrCreate({
																				where: {
																					id_empresa: req.params.id_empresa,
																					nombre: Diccionario.IUE_RETENCION_SERVICIO,
																					id_tipo: tipoEncontrado.id
																				}, defaults: { id_empresa: req.params.id_empresa, id_tipo: tipoEncontrado.id, valor: req.body.valor, nombre: Diccionario.IUE_RETENCION_SERVICIO }
																			}).then(function (ListaCuenta) {
																				ConfiguracionCuenta.findAll({
																					where: {
																						id_empresa: req.params.id_empresa,

																					}, include: [{ model: ContabilidadCuenta, as: 'cuenta' }, { model: Tipo, as: 'tipo' }], order: [['id', 'asc']]
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
																	Tipo.find({
																		where: {
																			nombre_corto: Diccionario.MOV_ING
																		}
																	}).then(function (tipoEncontrado) {
																		if (req.body.usar_funciones_erp) {
																			ConfiguracionCuenta.update({
																				id_cuenta: req.body.retencionBienes.it.cuenta.id,
																				valor: req.body.retencionBienes.it.porsentaje.toString(),
																			}, {
																					where: {
																						id_empresa: req.params.id_empresa,
																						nombre: Diccionario.IT_RETENCION_BIEN,
																						id_tipo: tipoEncontrado.id
																					}
																				}).then(function (configuracionActualizado) {
																					ConfiguracionCuenta.update({
																						id_cuenta: req.body.retencionBienes.iue.cuenta.id,
																						valor: req.body.retencionBienes.iue.porsentaje.toString(),
																					}, {
																							where: {
																								id_empresa: req.params.id_empresa,
																								nombre: Diccionario.IUE_RETENCION_BIEN,
																								id_tipo: tipoEncontrado.id
																							}
																						}).then(function (configuracionActualizado) {
																							ConfiguracionCuenta.update({
																								id_cuenta: req.body.retencionBienes.almacen.cuenta.id,
																								valor: req.body.retencionBienes.almacen.porsentaje.toString(),
																							}, {
																									where: {
																										id_empresa: req.params.id_empresa,
																										nombre: Diccionario.CUENTA_ALMACEN_RETENCION_BIEN,
																										id_tipo: tipoEncontrado.id
																									}
																								}).then(function (configuracionActualizado) {
																									ConfiguracionCuenta.update({
																										id_cuenta: req.body.retencionBienesGasto.it.cuenta.id,
																										valor: req.body.retencionBienesGasto.it.porsentaje.toString(),
																									}, {
																											where: {
																												id_empresa: req.params.id_empresa,
																												nombre: Diccionario.IT_RETENCION_BIEN_GASTO,
																												id_tipo: tipoEncontrado.id
																											}
																										}).then(function (configuracionActualizado) {
																											ConfiguracionCuenta.update({
																												id_cuenta: req.body.retencionBienesGasto.iue.cuenta.id,
																												valor: req.body.retencionBienesGasto.iue.porsentaje.toString(),
																											}, {
																													where: {
																														id_empresa: req.params.id_empresa,
																														nombre: Diccionario.IUE_RETENCION_BIEN_GASTO,
																														id_tipo: tipoEncontrado.id
																													}
																												}).then(function (configuracionActualizado) {
																													ConfiguracionCuenta.update({
																														id_cuenta: req.body.retencionBienesGasto.gasto.cuenta.id,
																														valor: req.body.retencionBienesGasto.gasto.porsentaje.toString(),
																													}, {
																															where: {
																																id_empresa: req.params.id_empresa,
																																nombre: Diccionario.CUENTA_GASTO_RETENCION_BIEN,
																																id_tipo: tipoEncontrado.id
																															}
																														}).then(function (configuracionActualizado) {
																															ConfiguracionCuenta.update({
																																id_cuenta: req.body.retencionServicios.servicio.cuenta.id,
																																valor: req.body.retencionServicios.servicio.porsentaje.toString(),
																															}, {
																																	where: {
																																		id_empresa: req.params.id_empresa,
																																		nombre: Diccionario.CUENTA_RETENCION_SERVICIO,
																																		id_tipo: tipoEncontrado.id
																																	}
																																}).then(function (configuracionActualizado) {
																																	ConfiguracionCuenta.update({
																																		id_cuenta: req.body.retencionServicios.it.cuenta.id,
																																		valor: req.body.retencionServicios.it.porsentaje.toString(),
																																	}, {
																																			where: {
																																				id_empresa: req.params.id_empresa,
																																				nombre: Diccionario.IT_RETENCION_SERVICIO,
																																				id_tipo: tipoEncontrado.id
																																			}
																																		}).then(function (configuracionActualizado) {
																																			ConfiguracionCuenta.update({
																																				id_cuenta: req.body.retencionServicios.iue.cuenta.id,
																																				valor: req.body.retencionServicios.iue.porsentaje.toString(),
																																			}, {
																																					where: {
																																						id_empresa: req.params.id_empresa,
																																						nombre: Diccionario.IUE_RETENCION_SERVICIO,
																																						id_tipo: tipoEncontrado.id
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
																		} else {
																			res.json({ menssage: "Actualizado Sadisfactoriamente!" })
																		}
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
	router.route('/contabilidad-cuenta/:id')
		.put(function (req, res) {
			var idTipoAux = null, id_texto1 = null, id_texto2 = null, id_texto3 = null
			if (req.body.tipoAuxiliar) {
				idTipoAux = req.body.tipoAuxiliar.id
			}
			if (req.body.especifica_texto1) {
				id_texto1 = req.body.especifica_texto1.id
			}
			if (req.body.especifica_texto2) {
				id_texto2 = req.body.especifica_texto2.id
			}
			if (req.body.especifica_texto3) {
				id_texto3 = req.body.especifica_texto3.id
			}
			ContabilidadCuenta.update({
				id_empresa: req.body.id_empresa,
				codigo: req.body.codigo,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				debe: req.body.debe,
				haber: req.body.haber,
				saldo: req.body.saldo,
				id_clasificacion: (req.body.clasificacion ? req.body.clasificacion.id : null),
				id_tipo_cuenta: (req.body.tipoCuenta ? req.body.tipoCuenta.id : null),
				bimonetaria: req.body.bimonetaria,
				aplicar_calculo: req.body.aplicar_calculo,
				monto: req.body.monto,
				eliminado: req.body.eliminado,
				id_tipo_auxiliar: idTipoAux,
				especifica: req.body.especifica,
				id_especifica_texto1: id_texto1,
				id_especifica_texto2: id_texto2,
				id_especifica_texto3: id_texto3,
				tipo_especifica: req.body.tipo_especifica,
				vincular_cuenta: req.body.vincular_cuenta,
				cuenta_activo: req.body.cuenta_activo,
				estado_resultado: req.body.estado_resultado
			}, {
					where: {
						id: req.body.id
					}
				}).then(function (ContabilidadCuentaActualizada) {
					if (req.body.cuentaC != null) {
						ClienteCuenta.findOrCreate({
							where: { id_cuenta: req.body.id },
							defaults: {
								id_cuenta: req.body.id,
								id_cliente: req.body.cuentaC.cliente.id
							}
						}).spread(function (ficha, created) {
							if (!created) {
								ClienteCuenta.update({
									id_cliente: req.body.cuentaC.cliente.id
								}, {
										where: { id_cuenta: req.body.id },
									}).then(function (actualizado) {
										guardarCuentaespecificas(req, res, Clase)
									})
							} else {
								guardarCuentaespecificas(req, res, Clase)
							}
						})
					} else if (req.body.cuentaP != null) {
						ProveedorCuenta.findOrCreate({
							where: { id_cuenta: req.body.id },
							defaults: {
								id_cuenta: req.body.id,
								id_proveedor: req.body.cuentaP.proveedor.id
							}
						}).spread(function (ficha, created) {
							if (!created) {
								ProveedorCuenta.update({
									id_proveedor: req.body.proveedor.id
								}, {
										where: { id_cuenta: req.body.id },
									}).then(function (actualizado) {
										guardarCuentaespecificas(req, res, Clase)
									})
							} else {
								guardarCuentaespecificas(req, res, Clase)
							}
						})
					} else {
						guardarCuentaespecificas(req, res, Clase)
					}
				});
		})

	router.route('/contabilidad-cuenta')
		.post(function (req, res) {
			var idTipoAux = null, id_texto1 = null, id_texto2 = null, id_texto3 = null
			if (req.body.tipoAuxiliar) {
				idTipoAux = req.body.tipoAuxiliar.id
			}
			if (req.body.especifica_texto1) {
				id_texto1 = req.body.especifica_texto1.id
			}
			if (req.body.especifica_texto2) {
				id_texto2 = req.body.especifica_texto2.id
			}
			if (req.body.especifica_texto3) {
				id_texto3 = req.body.especifica_texto3.id
			}
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
				id_calculo: (req.body.claseCalculo ? req.body.claseCalculo.id : null),
				eliminado: req.body.eliminado,
				id_tipo_auxiliar: idTipoAux,
				especifica: req.body.especifica,
				id_especifica_texto1: id_texto1,
				id_especifica_texto2: id_texto2,
				id_especifica_texto3: id_texto3,
				tipo_especifica: req.body.tipo_especifica,
				vincular_cuenta: req.body.vincular_cuenta,
				cuenta_activo: req.body.cuenta_activo,
				estado_resultado: req.body.estado_resultado
			}).then(function (cuentaCreada) {
				if (req.body.cliente != null) {
					ClienteCuenta.create({
						id_cuenta: cuentaCreada.id,
						id_cliente: req.body.cuentaC.cliente.id
					}).then(function (CuentaClienteCreado) {
						guardarCuentaespecificas(req, res, Clase)
					})
				} else if (req.body.proveedor != null) {
					ProveedorCuenta.create({
						id_cuenta: cuentaCreada.id,
						id_proveedor: req.body.cuentaP.proveedor.id
					})
						.then(function (CuentaClienteCreado) {
							guardarCuentaespecificas(req, res, Clase)
						})
				} else {
					guardarCuentaespecificas(req, res, Clase)
				}

			})

		})
	function guardarCuentaespecificas(req, res, Clase) {
		if (req.body.especifica) {
			var a = 1
			Clase.update({
				nombre_corto: req.body.especifica_texto1.nombre_corto
			}, {
					where: { id: req.body.especifica_texto1.id }
				})
			Clase.update({
				nombre_corto: req.body.especifica_texto2.nombre_corto
			}, {
					where: { id: req.body.especifica_texto2.id }
				})
			Clase.update({
				nombre_corto: req.body.especifica_texto3.nombre_corto
			}, {
					where: { id: req.body.especifica_texto3.id }
				}).then(function (params) {
					res.json({ mensaje: "guardado Sadisfactoriamente" })
				})

		} else {
			res.json({ mensaje: "guardado Sadisfactoriamente" })

		}
	}
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
	router.route('/contabilidad-cuentas/clasificaciones/id/:id_empresa')
		.get(function (req, res) {
			ClasificacionCuenta.findAll({
				where: { id_empresa: req.params.id_empresa },
				include: [{ model: Clase, as: 'tipoClasificacion' }, { model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }],

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
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				id_saldo: req.body.saldo.id,
				id_movimiento: req.body.movimiento.id,
				id_tipo: req.body.tipoClasificacion.id
			}).then(function (clasificionCuenta) {
				res.json({ mensaje: "Cotización creada sadisfactoriamente..." })
			});
		})

	router.route('/contabilidad-cuentas/clasificaciones/edicion/id/:id_empresa')
		.put(function (req, res) {
			req.body.forEach(function (clasificacion, index, array) {
				if (!clasificacion.eliminado) {
					if (clasificacion.id) {
						ClasificacionCuenta.update({
							nombre: clasificacion.nombre,
							id_saldo: (clasificacion.saldo ? clasificacion.saldo.id : null),
							id_movimiento: (clasificacion.movimiento ? clasificacion.movimiento.id : null),
							id_tipo: (clasificacion.tipoClasificacion ? clasificacion.tipoClasificacion.id : null),
						}, {
								where: {
									id: clasificacion.id
								}
							});
					} else {
						ClasificacionCuenta.create({
							id_empresa: req.params.id_empresa,
							nombre: clasificacion.nombre,
							id_saldo: (clasificacion.saldo ? clasificacion.saldo.id : null),
							id_movimiento: (clasificacion.movimiento ? clasificacion.movimiento.id : null),
							id_tipo: (clasificacion.tipoClasificacion ? clasificacion.tipoClasificacion.id : null),
							id_empresa: req.params.id_empresa
						});
					}
				} else {
					ClasificacionCuenta.destroy({
						where: {
							id: clasificacion.id
						}
					});
				}

				if (index == (array.length - 1)) {
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
			var condicionCuenta = {}, ordenArreglo = [], paginas;
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
								codigo: {
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
				condicionCuenta =
					{
						$or: [
							{
								debe: parseFloat(req.params.monto)
							},
							{
								haber: parseFloat(req.params.monto)
							},
							{
								saldo: parseFloat(req.params.monto)
							}
						]
					}

			}
			condicionCuenta.eliminado = false
			ContabilidadCuenta.findAndCountAll({
				where: condicionCuenta,
				include: [{ model: ClasificacionCuenta, as: 'clasificacion' }],

			}).then(function (data) {
				var datosCuenta = {
					where: condicionCuenta,
					include: [{ model: ProveedorCuenta, as: 'cuentaP', include: [{ model: Proveedor, as: 'proveedor' }] }, { model: ClienteCuenta, as: 'cuentaC', include: [{ model: Cliente, as: 'cliente' }] },
					{
						model: ClasificacionCuenta, as: "clasificacion",
						include: [{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }]
					},
					{
						model: Clase, as: 'tipoCuenta'
					},
					{
						model: Clase, as: 'claseCalculo'
					},
					{
						model: Clase, as: 'tipoAuxiliar'
					}

					],
					order: [ordenArreglo]
				}

				if (req.params.items_pagina != 0) {
					paginas = Math.ceil(data.count / req.params.items_pagina);
					datosCuenta.offset = (req.params.items_pagina * (req.params.pagina - 1));
					datosCuenta.limit = req.params.items_pagina;
				} else {
					paginas = 1;
				}

				ContabilidadCuenta.findAll(
					datosCuenta
				).then(function (cuentas) {
					res.json({ cuentas: cuentas, paginas: paginas });
				});
			})
		});
	function obtenercodigoCuenta(codigo, tipo) {
		var nuevoString = "0"
		if (tipo == 2) {
			nuevoString = codigo.substring(0, 1);
		} else if (tipo == 3) {
			nuevoString = codigo.substring(0, 2);
		} else if (tipo == 4) {
			nuevoString = codigo.substring(0, 3);
		}

		return nuevoString;
	}
	router.route('/cuentas/empresa')
		.post(function (req, res) {
			req.body.cuentas.forEach(function (cuenta, index, array) {
				sequelize.transaction(function (t) {
					return ClasificacionCuenta.findOrCreate({
						where: { nombre: cuenta.clasificacion.nombre, id_empresa: req.body.id_empresa },
						defaults: { nombre: cuenta.clasificacion.nombre, id_empresa: req.body.id_empresa },
						transaction: t,
						lock: t.LOCK.UPDATE
					}).then(function (claficiacionEncontrada) {
						return Tipo.find({
							where: { nombre_corto: Diccionario.TIPOS_CUENTA_CONTABILIDAD, id_empresa: req.body.id_empresa },
							transaction: t
						}).then(function (TipoEncontrado) {
							return Clase.findOrCreate({
								where: { nombre: cuenta.tipoCuenta.nombre, id_tipo: TipoEncontrado.id },
								defaults: {
									nombre: cuenta.tipoCuenta.nombre,
									id_tipo: TipoEncontrado.id
								},
								transaction: t,
								lock: t.LOCK.UPDATE
							}).then(function (claseEncontrada) {
								return ContabilidadCuenta.find({
									where: {
										$or: [{ codigo: cuenta.codigo }],
										id_empresa: req.body.id_empresa,
										eliminado: false
									},
									transaction: t
								}).then(function (cuentaEncontrada) {
									if (cuentaEncontrada) {
										return ContabilidadCuenta.update({
											id_empresa: req.body.id_empresa,
											codigo: cuenta.codigo,
											nombre: cuenta.nombre,
											descripcion: cuenta.descripcion,
											debe: cuenta.debe,
											haber: cuenta.haber,
											saldo: cuenta.saldo,
											id_clasificacion: claficiacionEncontrada[0].id,
											id_tipo_cuenta: claseEncontrada[0].id,
											bimonetaria: cuenta.bimonetaria,
											eliminado: false
										}, {
												where: {
													id: cuentaEncontrada.id
												},
												transaction: t
											}).then(function (cuentaActualizada) {
												var codigoCuentaPadre = obtenercodigoCuenta(cuenta.codigo, claseEncontrada[0].nombre_corto);
												return ContabilidadCuenta.find({
													where: {
														$or: [{ codigo: codigoCuentaPadre }],
														id_empresa: req.body.id_empresa
													},
													transaction: t
												}).then(function (cuentaPadreEncontrada) {
													if (cuentaPadreEncontrada) {
														return ContabilidadCuenta.update({
															id_cuenta_padre: cuentaPadreEncontrada.id
														}, {
																where: {
																	id: cuentaEncontrada.id
																},
																transaction: t
															});
													} else {
														return new Promise(function (fulfill, reject) {
															fulfill({});
														});
													}
												})

												/* return sequelize.query("UPDATE agil_contabilidad_cuenta set cuenta_padre=" + cuentaEncontrada.id + " where LENGTH(codigo)=" + (cuenta.codigo.length + 2) + " AND codigo LIKE '" + cuenta.codigo + "%';", { transaction: t })
													.then(function (act) {
														var codigoCuentaPadre =obtenercodigoCuenta(cuenta.codigo);
														return ContabilidadCuenta.find({
															where: {
																$or: [{ codigo: codigoCuentaPadre }],
																id_empresa: req.body.id_empresa
															},
															transaction: t
														}).then(function (cuentaPadreEncontrada) {
															if (cuentaPadreEncontrada) {
																return ContabilidadCuenta.update({
																	id_cuenta_padre: cuentaPadreEncontrada.id
																}, {
																		where: {
																			id: cuentaEncontrada.id
																		},
																		transaction: t
																	});
															} else {
																return new Promise(function (fulfill, reject) {
																	fulfill({});
																});
															}
														});
													}); */
											});
									} else {
										return ContabilidadCuenta.create({
											id_empresa: req.body.id_empresa,
											codigo: cuenta.codigo,
											nombre: cuenta.nombre,
											descripcion: cuenta.descripcion,
											debe: cuenta.debe,
											haber: cuenta.haber,
											saldo: cuenta.saldo,
											id_clasificacion: claficiacionEncontrada[0].id,
											id_tipo_cuenta: claseEncontrada[0].id,
											bimonetaria: cuenta.bimonetaria,
											eliminado: false,

										}, { transaction: t }).then(function (cuentaCreada) {
											var codigoCuentaPadre = obtenercodigoCuenta(cuenta.codigo, claseEncontrada[0].nombre_corto);
											return ContabilidadCuenta.find({
												where: {
													$or: [{ codigo: codigoCuentaPadre }],
													id_empresa: req.body.id_empresa
												},
												transaction: t
											}).then(function (cuentaPadreEncontrada) {
												if (cuentaPadreEncontrada) {
													return ContabilidadCuenta.update({
														id_cuenta_padre: cuentaPadreEncontrada.id
													}, {
															where: {
																id: cuentaCreada.id
															},
															transaction: t
														});
												} else {
													return new Promise(function (fulfill, reject) {
														fulfill({});
													});
												}
											});
										});
									}
								});
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

	router.route('/cuentas-auxiliares/empresa/:id_empresa/tipo/:tipo')
		.get(function (req, res) {
			if (req.params.tipo == Diccionario.CUENTA_AUXILIAR_CLIENTE) {
				Cliente.findAll({
					where: {
						id_empresa: req.params.id_empresa
					}

				}).then(function (clientes) {
					res.json(clientes)
				});
			}
			if (req.params.tipo == Diccionario.CUENTA_AUXILIAR_PROVEEDOR) {
				Proveedor.findAll({
					where: {
						id_empresa: req.params.id_empresa
					}
				}).then(function (proveedores) {
					res.json(proveedores)
				});
			}
			if (req.params.tipo == Diccionario.CUENTA_AUXILIAR_EMPLEADO) {
				MedicoPaciente.findAll({
					where: {
						id_empresa: req.params.id_empresa,
						es_empleado: true
					},
					include: [{ model: Persona, as: 'persona' }]
				}).then(function (empleados) {
					res.json(empleados)
				});
			}
		})

}
