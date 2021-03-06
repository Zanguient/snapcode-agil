module.exports = function (router, sequelize, forEach, decodeBase64Image, fs, Empresa, Proveedor, Compra, CompraReprogramacionPago,Pedido,ProveedorAnticipo,Sucursal) {

	router.route('/proveedores')

		.post(function (req, res) {
			Proveedor.find({
				where: {
					$or: [{ nit: req.body.nit }, { codigo: req.body.codigo }],
					id_empresa: req.body.id_empresa
				},
			}).then(function (proveedor) {
				if (proveedor) {

					Proveedor.update({
						id_empresa: req.body.id_empresa,
						razon_social: req.body.razon_social,
						codigo: req.body.codigo,
						nit: req.body.nit,
						direccion: req.body.direccion,
						telefono1: req.body.telefono1,
						telefono2: req.body.telefono2,
						telefono3: req.body.telefono3,
						contacto: req.body.contacto,
						rubro: req.body.rubro,
						categoria: req.body.categoria,
						ubicacion_geografica: req.body.ubicacion_geografica,
						fecha1: req.body.fecha1,
						fecha2: req.body.fecha2,
						texto1: req.body.texto1,
						texto2: req.body.texto2
					}, {
							where: {
								id: proveedor.id
							}

						}).then(function (clienteCreado) {
							guardarContratosProvedor(req, res, proveedor)
							res.json(proveedor);
						});


				} else {
					Proveedor.create({
						id_empresa: req.body.id_empresa,
						razon_social: req.body.razon_social,
						codigo: req.body.codigo,
						nit: req.body.nit,
						direccion: req.body.direccion,
						telefono1: req.body.telefono1,
						telefono2: req.body.telefono2,
						telefono3: req.body.telefono3,
						contacto: req.body.contacto,
						rubro: req.body.rubro,
						categoria: req.body.categoria,
						ubicacion_geografica: req.body.ubicacion_geografica,
						fecha1: req.body.fecha1,
						fecha2: req.body.fecha2,
						texto1: req.body.texto1,
						texto2: req.body.texto2
					}).then(function (proveedorCreado) {

						guardarContratosProvedor(req, res, proveedorCreado)
						res.json(proveedorCreado);
					});
				}
			});
		});

	function guardarContratosProvedor(req, res, proveedor) {
		if (req.body.documento_nit1) {
			fs.writeFileSync('./documentos/proveedores/documento-nit-' + proveedor.id + "-" + req.body.documento_nit1[0].nombre, req.body.documento_nit1[0].data, 'binary', function (err) {
				if (err)
					console.log(err);
				else
					console.log("The file was saved!");
			});

			Proveedor.update({
				documento_nit: req.body.documento_nit1[0].nombre
			}, {
					where: { id: proveedor.id }
				}).then(function (affecteedRows) {
				});
		}
		if (req.body.documento_funda_empresa1) {
			fs.writeFileSync('./documentos/proveedores/documento-fundaempresa-' + proveedor.id + "-" + req.body.documento_funda_empresa1[0].nombre, req.body.documento_funda_empresa1[0].data, 'binary', function (err) {
				if (err)
					console.log(err);
				else
					console.log("The file was saved!");
			});

			Proveedor.update({
				documento_funda_empresa: req.body.documento_funda_empresa1[0].nombre
			}, {
					where: { id: proveedor.id }
				}).then(function (affecteedRows) {
				});
		}
		if (req.body.documento_ci1) {
			fs.writeFileSync('./documentos/proveedores/documento-ci-' + proveedor.id + "-" + req.body.documento_ci1[0].nombre, req.body.documento_ci1[0].data, 'binary', function (err) {
				if (err)
					console.log(err);
				else
					console.log("The file was saved!");
			});

			Proveedor.update({
				documento_ci: req.body.documento_ci1[0].nombre
			}, {
					where: { id: proveedor.id }
				}).then(function (affecteedRows) {
				});
		}
		if (req.body.documento_licencia_funcionamiento1) {
			fs.writeFileSync('./documentos/proveedores/documento-licencia-funcionamiento-' + proveedor.id + "-" + req.body.documento_licencia_funcionamiento1[0].nombre, req.body.documento_licencia_funcionamiento1[0].data, 'binary', function (err) {
				if (err)
					console.log(err);
				else
					console.log("The file was saved!");
			});

			Proveedor.update({
				documento_licencia_funcionamiento: req.body.documento_licencia_funcionamiento1[0].nombre
			}, {
					where: { id: proveedor.id }
				}).then(function (affecteedRows) {
				});
		}
		if (req.body.documento_seguro_social1) {
			fs.writeFileSync('./documentos/proveedores/documento-seguro-social-' + proveedor.id + "-" + req.body.documento_seguro_social1[0].nombre, req.body.documento_seguro_social1[0].data, 'binary', function (err) {
				if (err)
					console.log(err);
				else
					console.log("The file was saved!");
			});

			Proveedor.update({
				documento_seguro_social: req.body.documento_seguro_social1[0].nombre
			}, {
					where: { id: proveedor.id }
				}).then(function (affecteedRows) {
				});
		}

	}
	router.route('/proveedor/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda')
		.get(function (req, res) {
			var condicionProveedor = { id_empresa: req.params.id_empresa, };
			if (parseInt(req.params.texto_busqueda)) {
				condicionProveedor = { id_empresa: req.params.id_empresa, codigo: { $not: null }, nit: parseInt(req.params.texto_busqueda) }
			} else if (req.params.texto_busqueda != 0) {
				condicionProveedor = {
					id_empresa: req.params.id_empresa, codigo: { $not: null },
					$or: [
						{
							codigo: {
								$like: "%" + req.params.texto_busqueda + "%"
							}
						},
						{
							razon_social: {
								$like: "%" + req.params.texto_busqueda + "%"
							}
						},
						{
							direccion: {
								$like: "%" + req.params.texto_busqueda + "%"
							}
						},
						{
							rubro: {
								$like: "%" + req.params.texto_busqueda + "%"
							}
						},
						{
							categoria: {
								$like: "%" + req.params.texto_busqueda + "%"
							}
						},
						{
							ubicacion_geografica: {
								$like: "%" + req.params.texto_busqueda + "%"
							}
						}

					]
				};
			}

			Proveedor.findAndCountAll({

				where: condicionProveedor,
				include: [{ model: Empresa, as: 'empresa' }],
				order: [['id', 'asc']]
			}).then(function (data) {
				Proveedor.findAll({
					offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
					where: condicionProveedor,
					include: [{ model: Empresa, as: 'empresa' }],
					order: [['id', 'asc']]
				}).then(function (proveedores) {
					res.json({ proveedores: proveedores, paginas: Math.ceil(data.count / req.params.items_pagina) });
				});
			});
		});
	router.route('/proveedores/empresa/:id_empresa')
		.get(function (req, res) {
			Proveedor.findAll({
				where: { id_empresa: req.params.id_empresa },
				include: [{ model: Empresa, as: 'empresa' }]
			}).then(function (proveedores) {
				res.json(proveedores);
			});
		});

	router.route('/proveedores/empresa')
		.post(function (req, res) {
			req.body.proveedores.forEach(function (proveedor, index, array) {
				Proveedor.find({
					where: {
						id_empresa: req.body.id_empresa,
						$or: [{ nit: proveedor.nit }, { codigo: proveedor.codigo }]
					},
				}).then(function (proveedorEncontrado) {
					if (proveedorEncontrado) {
						Proveedor.update({
							razon_social: proveedor.razon_social,
							codigo: proveedor.codigo,
							nit: proveedor.nit,
							direccion: proveedor.direccion,
							telefono1: proveedor.telefono1,
							telefono2: proveedor.telefono2,
							telefono3: proveedor.telefono3,
							contacto: proveedor.contacto,
							rubro: proveedor.rubro,
							categoria: proveedor.categoria,
							ubicacion_geografica: proveedor.ubicacion_geografica,
							fecha1: proveedor.fecha1,
							fecha2: proveedor.fecha2,
							texto1: proveedor.texto1,
							texto2: proveedor.texto2
						}, {
								where: {
									id: proveedorEncontrado.id
								}
							}).then(function (clienteCreado) {
								if (index === (array.length - 1)) {
									res.json({ mensaje: "¡Datos de Proveedores actualizados satisfactoriamente!" });
								}
							});
					} else {
						Proveedor.create({
							id_empresa: req.body.id_empresa,
							razon_social: proveedor.razon_social,
							codigo: proveedor.codigo,
							nit: proveedor.nit,
							direccion: proveedor.direccion,
							telefono1: proveedor.telefono1,
							telefono2: proveedor.telefono2,
							telefono3: proveedor.telefono3,
							contacto: proveedor.contacto,
							rubro: proveedor.rubro,
							categoria: proveedor.categoria,
							ubicacion_geografica: proveedor.ubicacion_geografica,
							fecha1: proveedor.fecha1,
							fecha2: proveedor.fecha2,
							texto1: proveedor.texto1,
							texto2: proveedor.texto2
						}).then(function (proveedorCreado) {
							if (index === (array.length - 1)) {
								res.json({ mensaje: "Proveedores creados satisfactoriamente!" });
							}
						});
					}
				});
			});
		});

	router.route('/proveedor-vencimiento-Deudas/:id')
		.put(function (req, res) {
			var inicio_fecha_anterior = new Date(req.body.fecha_anterior);
			inicio_fecha_anterior.setHours(0, 0, 0, 0, 0);
			var fin_fecha_anterior = new Date(req.body.fecha_anterior);
			fin_fecha_anterior.setHours(23, 59, 59, 0, 0);
			Compra.update({
				dias_credito: req.body.dias_credito,
			}, {
					where: {
						id: req.params.id
					}
				}).then(function (compraActualizada) {
					CompraReprogramacionPago.update({
						activo: false
					}, {
							where: {
								//fecha_reprogramacion:{ $between: [inicio_fecha_anterior, fin_fecha_anterior] },
								id_compra: req.params.id
							}

						}).then(function (compraReproActializada) {
							CompraReprogramacionPago.create({
								id_compra: req.params.id,
								fecha_reprogramacion: req.body.fecha_reprogramacion,
								fecha_anterior: req.body.fecha_anterior,
								activo: true
							}).then(function (FechasReporgrmacionCreadas) {
								res.json({ mensaje: "¡Reprogramacion satisfactoriamente!" });
							});
						});
				});
		})
	router.route('/proveedores/:id_proveedor')
		.put(function (req, res) {
			Proveedor.update({
				razon_social: req.body.razon_social,
				codigo: req.body.codigo,
				nit: req.body.nit,
				direccion: req.body.direccion,
				telefono1: req.body.telefono1,
				telefono2: req.body.telefono2,
				telefono3: req.body.telefono3,
				contacto: req.body.contacto,
				rubro: req.body.rubro,
				categoria: req.body.categoria,
				ubicacion_geografica: req.body.ubicacion_geografica,
				fecha1: req.body.fecha1,
				fecha2: req.body.fecha2,
				texto1: req.body.texto1,
				texto2: req.body.texto2
			}, {
					where: {
						id: req.params.id_proveedor
					}
				}).then(function (proveedorCreado) {
					guardarContratosProvedor(req, res, req.body)
					res.json(req.body);
				});
		})

		.delete(function (req, res) {
			Compra.findAll({
				where: {
					id_proveedor: req.params.id_proveedor
				}
			}).then(function (comprasProvedor) {
				Pedido.findAll({
					where: {
						id_proveedor: req.params.id_proveedor
					}
				}).then(function (pedidosProvedor) {
					if (comprasProvedor.length == 0 && pedidosProvedor.length == 0) {
						Proveedor.destroy({
							where: {
								id: req.params.id_proveedor
							}
						}).then(function (affectedRows) {
							res.json({ mensaje: "Eliminado Satisfactoriamente!" });
						});
					} else {
						res.json({ mensaje: "El Provedor cuenta con movimientos Realizados no es posible eliminar!" });
					}

				});
			});
		});

	router.route('/proveedores/empresa/:id_empresa/texto/:texto')
		.get(function (req, res) {
			var orCondition = [];
			if (parseInt(req.params.texto)) {
				orCondition.push({ nit: parseInt(req.params.texto) });
			}
			orCondition.push({ razon_social: { $like: "%" + req.params.texto + "%" } });
			Proveedor.findAll({
				where: {
					$and: { id_empresa: req.params.id_empresa, $or: orCondition }
				}
			}).then(function (proveedores) {
				res.json(proveedores);
			});
		});

	router.route('/proveedores/productos/empresa/:id_empresa/:id_proveedor')
		.get(function (req, res) {
			sequelize.query('select productos from agil_proveedor where id = ' + req.params.id_proveedor, { type: sequelize.QueryTypes.SELECT })
				.then(function (productos) {
					res.json({ productos: productos[0].productos })
				}).catch(function (err) {
					res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
				})
		})
	router.route('/proveedores/productos/empresa/:id_empresa')
		.post(function (req, res) {
			var productos = ""
			req.body.productos.forEach(function (id) {
				if (productos.length == 0) {
					productos += id
				} else {
					productos += "," + id
				}
			})
			Proveedor.update({
				productos: productos
			}, {
					where: { id: req.body.id_proveedor }
				}).then(function (productosProveedorActualizados) {
					res.json({ mensaje: 'Productos del proveedor actualizados' })
				}).catch(function (err) {
					res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
				})
		})

		router.route('/anticipo-proveedor/proveedor/:id_proveedor')
		.post(function (req, res) {
			Sucursal.find({
				where: { id: req.body.id_sucursal }
			}).then(function (sucursalEncontrada) {
				ProveedorAnticipo.create({
					id_proveedor: parseInt(req.params.id_proveedor),
					monto_anticipo: req.body.monto_anticipo,
					fecha: req.body.fecha,
					monto_salida: req.body.monto_salida,
					saldo: req.body.saldo,
					id_sucursal: req.body.id_sucursal,
					numero_correlativo_anticipo: sucursalEncontrada.anticipo_proveedor_correlativo,
					eliminado: false
				}).then(function (provedorAnticipoCreado) {
					var correlativo = sucursalEncontrada.anticipo_proveedor_correlativo + 1
					Sucursal.update({
						anticipo_proveedor_correlativo: correlativo
					}, {
							where: { id: req.body.id_sucursal }
						}).then(function (Actualizado) {
							ProveedorAnticipo.find({
								where:{id:provedorAnticipoCreado.id},
								include:[{model:Sucursal,as:'sucursal'},{model:Proveedor,as:'proveedor'}]
							}).then(function(encontrado){
								res.json({ mensaje: "anticipo guardado satisfactoriamente!",anticipo:encontrado });
							})
							
						})

				});
			})
		})
		.get(function (req, res) {
			ProveedorAnticipo.findAll({
				where:{id_proveedor:req.params.id_proveedor,padre:null}
			}).then(function (clientesAnticipos) {
				res.json(clientesAnticipos);
			})

		})
}