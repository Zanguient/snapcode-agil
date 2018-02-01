module.exports = function (router, ComprobanteContabilidad, AsientoContabilidad, ContabilidadCuenta, ClasificacionCuenta, Sucursal, Clase, Usuario, Diccionario, Empresa, Persona, Compra, Venta, MonedaTipoCambio, NumeroLiteral, ContabilidadCuentaAuxiliar) {

	router.route('/comprobantes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion/monto/:monto/tipo-comprobante/:tipo_comprobante/sucursal/:sucursal/usuario/:usuario/numero/:numero/busqueda/:busqueda')
		.get(function (req, res) {
			var ordenArreglo = [];
			var condicionComprobante = {}
			if (req.params.columna == "sucursal") {
				ordenArreglo.push({ model: Sucursal, as: 'sucursal' });
				req.params.columna = "nombre";
			} else if (req.params.columna == "usaurio") {
				ordenArreglo.push({ model: Persona, as: 'persona' });
				req.params.columna = "nombres";
			} else if (req.params.columna == "comprobante") {
				ordenArreglo.push({ model: Clase, as: 'tipoComprobante' });
				req.params.columna = "nombre";
			}
			ordenArreglo.push(req.params.columna);
			ordenArreglo.push(req.params.direccion);
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			condicionComprobante = {
				eliminado: false,
				$or: [
					{
						fecha: {
							$between: [inicio, fin]
						}
					}
				]
			};
			var condicionSucursal = { id_empresa: req.params.id_empresa };
			if (req.params.numero != 0) {
				condicionComprobante = {
					eliminado: false,
					$or: [
						{
							numero: parseInt(req.params.numero),
							fecha: {
								$between: [inicio, fin]
							}
						}
					]
				};
			}
			if (req.params.busqueda != 0) {
				condicionComprobante = {
					eliminado: false,
					$or: [
						{
							gloza: {
								$like: "%" + req.params.busqueda + "%"
							},

						}
					]
				};
			}
			if (req.params.tipo_comprobante != 0) {
				condicionComprobante = {
					eliminado: false,
					$or: [
						{
							id_tipo: parseInt(req.params.tipo_comprobante),
							fecha: {
								$between: [inicio, fin]
							}
						}
					]
				};
			}
			if (req.params.monto != 0) {
				condicionComprobante = {
					eliminado: false,
					$or: [
						{
							importe: parseFloat(req.params.monto),
							fecha: {
								$between: [inicio, fin]
							}
						}
					]
				};
			}
			if (req.params.sucursal != 0) {
				condicionSucursal = {
					id_empresa: req.params.id_empresa,
					id: req.params.sucursal
				};
			}
			var condicionPersona = {}
			if (req.params.usuario != 0) {
				condicionPersona = {
					$or: [
						{
							nombres: {
								$like: "%" + req.params.usuario + "%"
							}

						}
					]
				}
			}
			ComprobanteContabilidad.findAndCountAll({
				where: condicionComprobante,
				include: [{ model: AsientoContabilidad, as: 'asientosContables' }, { model: Clase, as: 'tipoComprobante' }, { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] },
				{ model: Sucursal, as: 'sucursal', where: condicionSucursal, include: [{ model: Empresa, as: 'empresa' }] }],
			}).then(function (data) {
				if (req.params.items_pagina == "0") {
					ComprobanteContabilidad.findAll({
						where: condicionComprobante,
						include: [{ model: MonedaTipoCambio, as: 'tipoCambio' }, { model: AsientoContabilidad, as: 'asientosContables', include: [{ model: Clase, as: 'centroCosto' }, { model: ContabilidadCuenta, as: 'cuenta', include: [{ model: ContabilidadCuentaAuxiliar, as: 'cuentaAux' }, { model: Clase, as: 'tipoAuxiliar' }] }] }, { model: Clase, as: 'tipoComprobante' },
						{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] },
						{ model: Sucursal, as: 'sucursal', where: condicionSucursal, include: [{ model: Empresa, as: 'empresa' }] }],
						order: [ordenArreglo]
					}).then(function (comprobantes) {
						res.json({ comprobantes: comprobantes });
					});
				} else {
					ComprobanteContabilidad.findAll({
						offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
						where: condicionComprobante,
						include: [{ model: MonedaTipoCambio, as: 'tipoCambio' }, { model: AsientoContabilidad, as: 'asientosContables', include: [{ model: Clase, as: 'centroCosto' }, { model: ContabilidadCuenta, as: 'cuenta', include: [{ model: ContabilidadCuentaAuxiliar, as: 'cuentaAux' }, { model: Clase, as: 'tipoAuxiliar' }] }] }, { model: Clase, as: 'tipoComprobante' },
						{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona', where: condicionPersona }] },
						{ model: Sucursal, as: 'sucursal', where: condicionSucursal, include: [{ model: Empresa, as: 'empresa' }] }],
						order: [ordenArreglo]
					}).then(function (comprobantes) {
						res.json({ comprobantes: comprobantes, paginas: Math.ceil(data.count / req.params.items_pagina) });
					});
				}
			});
		});



	router.route('/comprobante-contabilidad/usuario/:id_usuario')
		.get(function (req, res) {
			ComprobanteContabilidad.findAll({
				where: {
					id_usuario: req.params.id_usuario,
					eliminado: false
				},
				include: [{ model: AsientoContabilidad, as: 'asientosContables', include: [{ model: ContabilidadCuenta, as: 'cuenta' }] }, { model: Clase, as: 'tipoComprobante' }, { model: Sucursal, as: 'sucursal' }, { model: Usuario, as: 'usuario' }]
			}).then(function (contabilidadComprobante) {
				res.json(contabilidadComprobante)
			})
		})
	router.route('/comprobante-contabilidad/monedaCambio')
		.post(function (req, res) {
			req.body.forEach(function (dia, index, array) {
				var inicio = new Date(dia.fecha); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(dia.fecha); fin.setHours(23, 0, 0, 0, 0);

				MonedaTipoCambio.find({
					where: {
						fecha: {
							$between: [inicio, fin]
						}
					}
				}).then(function (monedaCambio) {
					if (!monedaCambio) {
						MonedaTipoCambio.create({
							fecha: dia.fecha,
							ufv: parseFloat(dia.ufb),
							dolar: parseFloat(dia.dolar)
						}).then(function (MonedaTipoCambioActualizado) {
							console.log("a")
							if (index === (array.length - 1)) {
								res.json({ message: "datos actualizados satisfactoriamente!" })
							}
						})
					} else {
						MonedaTipoCambio.update({
							fecha: dia.fecha,
							ufv: parseFloat(dia.ufb),
							dolar: parseFloat(dia.dolar)
						}, {
								where: { id: monedaCambio.id }
							}).then(function (menedaTipoCambioActualizado) {
								if (index === (array.length - 1)) {
									res.json({ message: "datos actualizados satisfactoriamente!" })
								}
							})
					}

				}, this);
			})
		})
	router.route('/comprobante-contabilidad/monedaCambio/:fecha')
		.get(function (req, res) {
			var inicio = new Date(req.params.fecha); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fecha); fin.setHours(23, 0, 0, 0, 0);

			MonedaTipoCambio.find({
				where: {
					fecha: {
						$between: [inicio, fin]
					}
				}
			}).then(function (MonedaCambio) {
				res.json({ monedaCambio: MonedaCambio })
			})
		})
		
		router.route('/ultima-fecha-comprobante/empresa/:id_empresa/tipo/:id_tipo')
		.get(function (req, res) {
			var condicionSucursal={id_empresa:req.params.id_empresa}
			ComprobanteContabilidad.findAll({
				limit:1,
				where: {
					id_tipo:req.params.id_tipo,
				},
				include:[{ model: Sucursal, as: 'sucursal', where: condicionSucursal}],
				order: [['id', 'DESC']]
			}).then(function (Comprobante) {
				res.json({ comprobante: Comprobante[0] })
			})
		})
	router.route('/comprobante-contabilidad/monedaCambio/mes/:mes/anio/:anio')
		.get(function (req, res) {
			var condicion = {}
			if (req.params.mes != "a") {
				var inicio = new Date(req.params.anio, req.params.mes, 1); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.anio, (parseInt(req.params.mes) + 1), 0); fin.setHours(23, 0, 0, 0, 0);
				condicion = {
					fecha: {
						$between: [inicio, fin]
					}
				}
			} else {
				req.params.mes = 0
				var inicio = new Date(req.params.anio, req.params.mes, 1); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.anio, (parseInt(req.params.mes) + 12), 0); fin.setHours(23, 0, 0, 0, 0);
				condicion = {
					fecha: {
						$between: [inicio, fin]
					}
				}
			}
			MonedaTipoCambio.findAll({
				where: condicion
			}).then(function (MonedasCambio) {
				res.json(MonedasCambio)
			})
		})
	router.route('/comprobante-contabilidad/monedaCambio/:id_moneda')
		.put(function (req, res) {
			MonedaTipoCambio.update({
				fecha: req.body.fecha,
				ufv: parseFloat(req.body.ufv),
				dolar: parseFloat(req.body.dolar)
			}, {
					where: {
						id: req.params.id_moneda
					}
				}).then(function (monedaActualizada) {
					res.json({ mensaje: "cambio moneda actualizado satisfactoriamente!" })
				})
		})

	router.route('/comprobante-contabilidad/favorito/:id_comprobante')
		.put(function (req, res) {
			ComprobanteContabilidad.find({
				where: {

					id: req.params.id_comprobante,
				},
			}).then(function (comprobanteEncontrado) {
				var favorito = "";
				if (comprobanteEncontrado.favorito == null) {
					favorito = true
				}
				if (comprobanteEncontrado.favorito == true) {
					favorito = false
				} else {
					favorito = true
				}
				ComprobanteContabilidad.update({
					favorito: favorito
				}, {
						where: {
							id: req.params.id_comprobante,
						},
					}).then(function (ComprobanteActualizado) {
						res.json({ mensaje: "comprobante actualizado satisfactoriamente!" })
					})
			})

		})
	router.route('/comprobante-cuenta/:id_cuenta/periodo/:inicio/:fin')
		.get(function (req, res) {
			var condicionComprobante = {}
			if (req.params.inicio != 0 && req.params.fin != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				var condicionComprobante = {
					$or: [
						{
							fecha: {
								$between: [inicio, fin]
							}
						}
					]
				};
			} else {
				condicionComprobante = {}
			}


			ContabilidadCuenta.find({
				where: {
					id: req.params.id_cuenta,
					eliminado: false
				},
				include: [{ model: AsientoContabilidad, as: 'cuenta', include: [{ model: ComprobanteContabilidad, as: 'comprobante', where: condicionComprobante, order: [['fecha', 'DESC']] }] }],

			}).then(function (entidad) {
				res.json(entidad)
			})
		})
	/* 	router.route('/contabilidad-cuenta/empresa/:id_empresa')
			.get(function (req, res) {
				ContabilidadCuenta.findAll({
					where: {
						id_usuario: req.params.id_empresa,
						eliminado: false
					},
					include: [{ model: Clase, as: 'tipoCuenta' },
					{ model: ClasificacionCuenta, as: 'clasificacion' },
					{ model: Clase, as: 'vincularCuenta' },
					{ model: ClasificacionCuenta, as: 'claseCuenta' },
					{ model: Clase, as: 'claseCalculo' },
					{ model: AsientoContabilidad, as: 'cuenta' }]
				}).then(function (contabilidadComprobante) {
					res.json(contabilidadComprobante)
				})
			}) */

	router.route('/comprobantes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion/busqueda/:texto_busqueda')
		.get(function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			var ordenArreglo = [];
			if (req.params.columna == "sucursal") {
				ordenArreglo.push({ model: Sucursal, as: 'sucursal' });
				req.params.columna = "nombre";
			} else if (req.params.columna == "usaurio") {
				ordenArreglo.push({ model: Persona, as: 'persona' });
				req.params.columna = "nombres";
			} else if (req.params.columna == "comprobante") {
				ordenArreglo.push({ model: Clase, as: 'tipoComprobante' });
				req.params.columna = "nombre";
			}
			ordenArreglo.push(req.params.columna);
			ordenArreglo.push(req.params.direccion);
			if (req.params.inicio != 0) {
				if (req.params.texto_busqueda != 0) {
					var condicionComprobante = {
						$or: [
							{
								gloza: {
									$like: "%" + req.params.texto_busqueda + "%"
								},
								fecha: {
									$between: [inicio, fin]
								}
							}
						]
					};
				} else {
					var condicionComprobante = {
						$or: [
							{
								fecha: {
									$between: [inicio, fin]
								}
							}
						]
					};
				}

			} else {
				var condicionComprobante = {
					$or: [
						{
							favorito: true
						}
					]
				};
			}
			var condicionSucursal = { id_empresa: req.params.id_empresa };

			ComprobanteContabilidad.findAndCountAll({
				where: condicionComprobante,
				include: [{ model: AsientoContabilidad, as: 'asientosContables', include: [{ model: ContabilidadCuenta, as: 'cuenta' }] }, { model: Clase, as: 'tipoComprobante' }, { model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }] },
				{ model: Sucursal, as: 'sucursal', where: condicionSucursal, include: [{ model: Empresa, as: 'empresa' }] }],

			}).then(function (data) {
				ComprobanteContabilidad.findAll({
					offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
					where: condicionComprobante,
					include: [{ model: AsientoContabilidad, as: 'asientosContables', include: [{ model: Clase, as: 'centroCosto' }, { model: ContabilidadCuenta, as: 'cuenta', include: [{ model: ContabilidadCuentaAuxiliar, as: 'cuentaAux' }, { model: Clase, as: 'tipoAuxiliar' }] }] }, { model: Clase, as: 'tipoComprobante' },
					{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }] },
					{ model: Sucursal, as: 'sucursal', where: condicionSucursal, include: [{ model: Empresa, as: 'empresa' }] }],
					order: [ordenArreglo]
				}).then(function (comprobantes) {
					res.json({ comprobantes: comprobantes, paginas: Math.ceil(data.count / req.params.items_pagina) });
				});
			});
		});
	router.route('/comprobante-cuenta/empresa/:id_empresa/busqueda/:buscar')
		.get(function (req, res) {
			var condicionCuenta;
			if (req.params.buscar != 0) {
				condicionCuenta = {
					id_empresa: req.params.id_empresa,
					eliminado: false,
					$or: [
						{
							nombre: {
								$like: "%" + req.params.buscar + "%"
							}
						},
						{
							codigo: {
								$like: "%" + req.params.buscar + "%"
							}
						}
					]
				};
			} else {
				condicionCuenta = {
					id_empresa: req.params.id_empresa, eliminado: { $not: true }
				}
			}
			ContabilidadCuenta.findAll({
				where: condicionCuenta,
				include: [{ model: Clase, as: 'tipoAuxiliar' }, { model: Clase, as: 'tipoCuenta' },
				{ model: ClasificacionCuenta, as: 'clasificacion' },
				{ model: Clase, as: 'claseCalculo' },
				{ model: AsientoContabilidad, as: 'cuenta' }]

			}).then(function (cuentas) {
				res.json(cuentas)
			})

		});
	router.route('/comprobante-cuenta/asientos/:id_cuenta')
		.get(function (req, res) {
			AsientoContabilidad.findAll({
				where: {
					id_cuenta: req.params.id_cuenta,
					eliminado: false
				},
				include: [{
					model: ContabilidadCuenta, as: 'cuentas', include: [
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
					]
				},
				{
					model: ComprobanteContabilidad, as: 'comprobante', include: [{ model: Clase, as: 'tipoComprobante' }]
				}]
			}).then(function (asientosContables) {
				res.json(asientosContables)
			})
		})

	// router.route('/contabilidad-cuentas/empresa/:id_empresa/busqueda/:query')
	// .get(function (req, res) {
	// 	ContabilidadCuenta.findAll({
	// 		where: {
	// 			id_empresa: req.params.id_empresa,
	// 			eliminado: false
	// 		},
	// 		include: [{ model: Clase, as: 'tipoCuenta' }, { model: Clase, as: 'claseCalculo' }, { model: Clase, as: 'vincularCuenta' }, { model: ClasificacionCuenta, as: 'claseCuenta' }, { model: ClasificacionCuenta, as: 'clasificacion', include: [{ model: Clase, as: 'saldo' }, { model: Clase, as: 'movimiento' }] }]
	// 	}).then(function (ListaCuenta) {
	// 		res.json(ListaCuenta)
	// 	})


	// })
	router.route('/comprobante-contabolidad')
		.post(function (req, res) {
			Sucursal.find({			
				where: {
					id:req.body.id_sucursal.id,//your where conditions, or without them if you need ANY entry
				}				
			}).then(function (SucursalEncontrada) {
				var numero = 0;
				if (req.body.tipoComprobante.nombre == "INGRESO") { numero = SucursalEncontrada.comprobante_ingreso_correlativo }
				if (req.body.tipoComprobante.nombre == "EGRESO") { numero = SucursalEncontrada.comprobante_egreso_correlativo }
				if (req.body.tipoComprobante.nombre == "TRASPASO") { numero = SucursalEncontrada.comprobante_traspaso_correlativo }
				if (req.body.tipoComprobante.nombre == "CAJA CHICA") { numero = SucursalEncontrada.comprobante_caja_chica_correlativo }
				ComprobanteContabilidad.create({
					id_tipo: req.body.tipoComprobante.id,
					abierto: req.body.abierto,
					numero: numero,
					fecha: req.body.fecha,
					id_sucursal: req.body.id_sucursal.id,
					gloza: req.body.gloza,
					id_usuario: req.body.id_usuario,
					eliminado: req.body.eliminado,
					importe: req.body.importe,
					id_tipo_cambio: req.body.tipoCambio.id,
					fecha_creacion:req.body.fechaActual
				}).then(function (ComprobanteCreado) {					
				if (req.body.tipoComprobante.nombre == "INGRESO") { SucursalEncontrada.comprobante_ingreso_correlativo = SucursalEncontrada.comprobante_ingreso_correlativo+1 }
				if (req.body.tipoComprobante.nombre == "EGRESO") { SucursalEncontrada.comprobante_egreso_correlativo = SucursalEncontrada.comprobante_egreso_correlativo+1 }
				if (req.body.tipoComprobante.nombre == "TRASPASO") { SucursalEncontrada.comprobante_traspaso_correlativo = SucursalEncontrada.comprobante_traspaso_correlativo+1 }
				if (req.body.tipoComprobante.nombre == "CAJA CHICA") { SucursalEncontrada.comprobante_caja_chica_correlativo = SucursalEncontrada.comprobante_caja_chica_correlativo+1 }
					Sucursal.update({
						comprobante_ingreso_correlativo:SucursalEncontrada.comprobante_ingreso_correlativo,
						comprobante_egreso_correlativo:SucursalEncontrada.comprobante_egreso_correlativo,
						comprobante_traspaso_correlativo:SucursalEncontrada.comprobante_traspaso_correlativo,
						comprobante_caja_chica_correlativo:SucursalEncontrada.comprobante_caja_chica_correlativo,},{
							where:{
								id:req.body.id_sucursal.id,
							}
						
					})
					var totalHaber = 0, totalDebe = 0, totalSaldo = 0;
					req.body.asientosContables.forEach(function (asientoContable, index, array) {
						if (asientoContable.activo != false && asientoContable.cuenta != "") {
							if (asientoContable.debe_bs == null) {
								asientoContable.debe_bs = "0";
							}
							if (asientoContable.debe_sus == null) {
								asientoContable.debe_sus = "0";
							}
							if (asientoContable.haber_bs == null) {
								asientoContable.haber_bs = "0";
							}
							if (asientoContable.haber_sus == null) {
								asientoContable.haber_sus = "0";
							}
							totalHaber += parseFloat(asientoContable.haber_bs)
							totalDebe += parseFloat(asientoContable.debe_bs)
							var idCentroCosto = null
							if (asientoContable.centroCosto) {
								idCentroCosto = asientoContable.centroCosto.id
							}
							AsientoContabilidad.create({
								id_comprobante: ComprobanteCreado.id,
								id_cuenta: asientoContable.cuenta.id,
								glosa: asientoContable.glosa,
								debe_bs: parseFloat(asientoContable.debe_bs),
								haber_bs: parseFloat(asientoContable.haber_bs),
								debe_sus: parseFloat(asientoContable.debe_sus),
								haber_sus: parseFloat(asientoContable.haber_sus),
								eliminado: asientoContable.eliminado,
								id_centro_costo: idCentroCosto
							}).then(function (asientroCreado) {
								if (asientoContable.cuenta.cuentaAux) {
									ContabilidadCuentaAuxiliar.create({
										debe: asientoContable.cuenta.cuentaAux.debe,
										haber: asientoContable.cuenta.cuentaAux.haber,
										saldo: asientoContable.cuenta.cuentaAux.saldo,
										descripcion: asientoContable.cuenta.cuentaAux.nombre,
										nombre: asientoContable.cuenta.cuentaAux.nombre,
										id_cuenta: asientoContable.cuenta.id
									})
								}
								ContabilidadCuenta.find({
									where: { id: asientoContable.cuenta.id, }
								}).then(function (CuentaEncontrada) {
									CuentaEncontrada.debe = (CuentaEncontrada.debe == null) ? 0 : CuentaEncontrada.debe;
									CuentaEncontrada.haber = (CuentaEncontrada.haber == null) ? 0 : CuentaEncontrada.haber;
									CuentaEncontrada.debe += parseFloat(asientoContable.debe_bs)
									CuentaEncontrada.haber += parseFloat(asientoContable.haber_bs)
									if (CuentaEncontrada.debe > CuentaEncontrada.haber) {
										CuentaEncontrada.saldo = CuentaEncontrada.debe - CuentaEncontrada.haber
									} else {
										CuentaEncontrada.saldo = CuentaEncontrada.haber - CuentaEncontrada.debe
									}
									ContabilidadCuenta.update({
										debe: CuentaEncontrada.debe,
										haber: CuentaEncontrada.haber,
										saldo: CuentaEncontrada.saldo
									}, {
											where: { id: asientoContable.cuenta.id }
										}).then(function (CuentaActualizada) {
											if (index === (array.length - 1)) {

												if (req.body.id_venta) {
													var t = true;
													Venta.update({
														contabilizado: t
													}, {
															where: {
																id: req.body.id_venta,
															}
														}).then(function (ventaActualizada) {
															res.json({ mensaje: "¡Comprobante creado satisfactoriamente!", comprobante: ComprobanteCreado });
														})
												} else if (req.body.id_compra) {
													var t = true;
													Compra.update({
														contabilizado: t
													}, {
															where: {
																id: req.body.id_compra,
															}
														}).then(function (compraActualizada) {
															res.json({ mensaje: "¡Comprobante creado satisfactoriamente!", comprobante: ComprobanteCreado });
														})
												} else {
													res.json({ mensaje: "¡Comprobante creado satisfactoriamente!", comprobante: ComprobanteCreado });
												}



											}
										})
								})
							})
						} else {
							if (index === (array.length - 1)) {
								res.json({ mensaje: "¡Comprobante creado satisfactoriamente!", comprobante: ComprobanteCreado });
							}
						}

					});
				})
			})
		})
	router.route('/comprobante-contabolidad/:id_comprobante')
		.post(function (req, res) {
			ComprobanteContabilidad.update({
				eliminado: true
			}, {
					where: { id: req.params.id_comprobante }
				}).then(function (params) {
					res.json({ mensaje: "eliminado satisfactoriamente!" })
				})
		})
		.put(function (req, res) {
			/* ComprobanteContabilidad.findAll({
				where: {
					id: req.body.id//your where conditions, or without them if you need ANY entry
				},
				include: [{ model: AsientoContabilidad, as: 'asientosContables', include: [{ model: ContabilidadCuenta, as: 'cuenta' }] }]
			}).then(function (comprobanteEncontrado) {
				var numero = (comprobanteEncontrado[0] ? comprobanteEncontrado[0].numero + 1 : 1); */
				ComprobanteContabilidad.update({
					id_tipo: req.body.tipoComprobante.id,
					fecha: req.body.fecha,
					id_sucursal: req.body.id_sucursal.id,
					gloza: req.body.gloza,
					id_usuario: req.body.id_usuario,
					importe: req.body.importe,
					id_tipo_cambio: req.body.tipoCambio.id,
					abierto: req.body.abierto
				}, {
						where: {
							id: req.body.id
						}
					}).then(function (ComprobanteCreado) {
						req.body.asientosContables.forEach(function (asientoContable, index, array) {
							if (asientoContable.activo != false && asientoContable.cuenta != "") {
								if (asientoContable.debe_bs == null) {
									asientoContable.debe_bs = "0";
								}
								if (asientoContable.debe_sus == null) {
									asientoContable.debe_sus = "0";
								}
								if (asientoContable.haber_bs == null) {
									asientoContable.haber_bs = "0";
								}
								if (asientoContable.haber_sus == null) {
									asientoContable.haber_sus = "0";
								}
								var idCentroCosto = null
								if (asientoContable.centroCosto) {
									idCentroCosto = asientoContable.centroCosto.id
								}
								if (asientoContable.id) {
									AsientoContabilidad.update({
										id_cuenta: asientoContable.cuenta.id,
										glosa: asientoContable.glosa,
										debe_bs: parseFloat(asientoContable.debe_bs),
										haber_bs: parseFloat(asientoContable.haber_bs),
										debe_sus: parseFloat(asientoContable.debe_sus),
										haber_sus: parseFloat(asientoContable.haber_sus),
										eliminado: asientoContable.eliminado,
										id_centro_costo: idCentroCosto
									}, {
											where: {
												id: asientoContable.id
											}
										}).then(function (asientoActualizado) {
											if (asientoContable.cuenta.cuentaAux) {
												crearCuentaAuxiliar(asientoContable, res, index, array)
											}
											if (index === (array.length - 1)) {
												res.json({ mensaje: "¡Comprobante actualizado satisfactoriamente!" });
											}
										})
								} else {
									AsientoContabilidad.create({
										id_cuenta: asientoContable.cuenta.id,
										id_comprobante: req.body.id,
										glosa: asientoContable.glosa,
										debe_bs: parseFloat(asientoContable.debe_bs),
										haber_bs: parseFloat(asientoContable.haber_bs),
										debe_sus: parseFloat(asientoContable.debe_sus),
										haber_sus: parseFloat(asientoContable.haber_sus),
										eliminado: asientoContable.eliminado,
										id_centro_costo: idCentroCosto
									}).then(function (asientoCreado) {
										if (asientoContable.cuenta.cuentaAux) {
											crearCuentaAuxiliar(asientoContable, res, index, array)
										}
										if (index === (array.length - 1)) {
											res.json({ mensaje: "¡Comprobante actualizado satisfactoriamente!" });
										}

									})
								}
							} else {
								if (index === (array.length - 1)) {
									res.json({ mensaje: "¡Comprobante actualizado satisfactoriamente!" });
								}
							}

						});
					/* }) */
			})
		})
		.get(function (req, res) {
			ComprobanteContabilidad.find({
				where: { id: req.params.id_comprobante },
				include: [{ model: MonedaTipoCambio, as: 'tipoCambio' }, { model: AsientoContabilidad, as: 'asientosContables', include: [{ model: Clase, as: 'centroCosto' }, { model: ContabilidadCuenta, as: 'cuenta', include: [{ model: ContabilidadCuentaAuxiliar, as: 'cuentaAux' }, { model: Clase, as: 'tipoAuxiliar' },
				{
					model: Clase, as: 'especificaTexto1'
				},
				{
					model: Clase, as: 'especificaTexto2'
				},
				{
					model: Clase, as: 'especificaTexto3'
				}] }] }, { model: Clase, as: 'tipoComprobante' },
				{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }] },
				{ model: Sucursal, as: 'sucursal', include: [{ model: Empresa, as: 'empresa' }] }],
				
			}).then(function (comprobante) {
				var importeLiteral = NumeroLiteral.Convertir(parseFloat(comprobante.importe).toFixed(2).toString());
				res.json({ comprobante: comprobante, importeLiteral: importeLiteral });
			});
		})

	function crearCuentaAuxiliar(asientoContable, res, index, array) {
		if (asientoContable.cuenta.cuentaAux.id) {
			ContabilidadCuentaAuxiliar.update({
				debe: asientoContable.cuenta.cuentaAux.debe,
				haber: asientoContable.cuenta.cuentaAux.haber,
				saldo: asientoContable.cuenta.cuentaAux.saldo,
				descripcion: asientoContable.cuenta.cuentaAux.nombre,
				nombre: asientoContable.cuenta.cuentaAux.nombre,
				id_cuenta: asientoContable.cuenta.id
			}, {
					where: { id: asientoContable.cuenta.cuentaAux.id }
				})
		} else {
			ContabilidadCuentaAuxiliar.create({
				debe: asientoContable.cuenta.cuentaAux.debe,
				haber: asientoContable.cuenta.cuentaAux.haber,
				saldo: asientoContable.cuenta.cuentaAux.saldo,
				descripcion: asientoContable.cuenta.cuentaAux.nombre,
				nombre: asientoContable.cuenta.cuentaAux.nombre,
				id_cuenta: asientoContable.cuenta.id
			}).then(function (cuentaAuxCreate) {
				if (index === (array.length - 1)) {
					res.json({ mensaje: "¡Comprobante actualizado satisfactoriamente!" });
				}
			})
		}
	}
}