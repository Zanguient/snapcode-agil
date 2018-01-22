module.exports = function (router, forEach, decodeBase64Image, fs, Empresa, Cliente, RutaCliente, Venta,
	VentaReprogramacionPago, sequelize, ClienteRazon, GtmClienteDestino,GtmDestino) {

	router.route('/clientes')
		.post(function (req, res) {
			Cliente.find({
				where: {
					$or: [{ nit: req.body.nit }, { codigo: req.body.codigo }],
					id_empresa: req.body.id_empresa
				},
			}).then(function (cliente) {
				if (cliente) {
					Cliente.update({
						destino: req.body.destino, //aumentamos esto
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
						texto2: req.body.texto2,
						latitud: req.body.latitud,
						longitud: req.body.longitud
					}, {
							where: {
								id: cliente.id
							}
						}).then(function (clienteCreado) {
							req.body.clientes_razon.forEach(function (cliente_razon, index, array) {
								if (!cliente_razon.eliminado) {
									ClienteRazon.create({
										id_cliente: cliente.id,
										razon_social: cliente_razon.razon_social,
										nit: cliente_razon.nit,

									}).then(function (clienteRazonCreado) {
									});
								}
							});

							req.body.cliente_destinos.forEach(function (clienteDestino, index, array) {
								if (!clienteDestino.eliminado) {
									GtmClienteDestino.create({
										id_cliente: cliente.id,
										id_destino: clienteDestino.id_destino,

									}).then(function (GtmClienteDestinoCreado) {
									});
								}
							});

							res.json({ mensaje: "¡Ya existia un cliente con codigo o nit iguales, por lo que se actualizo!" });
						});
				} else {
					Cliente.create({
						destino: req.body.destino, //aumentamos esto
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
						texto2: req.body.texto2,
						latitud: req.body.latitud,
						longitud: req.body.longitud
					}).then(function (clienteCreado) {
						req.body.clientes_razon.forEach(function (cliente_razon, index, array) {
							if (!cliente_razon.eliminado) {
								ClienteRazon.create({
									id_cliente: clienteCreado.id,
									razon_social: cliente_razon.razon_social,
									nit: cliente_razon.nit,

								}).then(function (clienteRazonCreado) {
								});
							}
						});

						req.body.cliente_destinos.forEach(function (clienteDestino, index, array) {
							if (!clienteDestino.eliminado) {
								GtmClienteDestino.create({
									id_cliente: clienteCreado.id,
									id_destino: clienteDestino.id_destino,

								}).then(function (GtmClienteDestinoCreado) {
								});
							}
						});
						res.json({ mensaje: "¡Cliente creado satisfactoriamente!" });
					});
				}
			});
		});

router.route('/clientes/empresa')
		.post(function (req, res) {
			req.body.clientes.forEach(function (cliente, index, array) {
				Cliente.find({
					where: {
						id_empresa: req.body.id_empresa,
						$or: [{ nit: cliente.nit }, { codigo: cliente.codigo }]
					},
				}).then(function (clienteEncontrado) {
					if (clienteEncontrado) {
						Cliente.update({
							razon_social: cliente.razon_social,
							codigo: cliente.codigo,
							nit: cliente.nit,
							direccion: cliente.direccion,
							telefono1: cliente.telefono1,
							telefono2: cliente.telefono2,
							telefono3: cliente.telefono3,
							contacto: cliente.contacto,
							rubro: cliente.rubro,
							categoria: cliente.categoria,
							ubicacion_geografica: cliente.ubicacion_geografica,
							fecha1: cliente.fecha1,
							fecha2: cliente.fecha2,
							texto1: cliente.texto1,
							texto2: cliente.texto2,
							latitud: cliente.latitud,
							longitud: cliente.longitud
						}, {
								where: {
									id: clienteEncontrado.id
								}
							}).then(function (clienteCreado) {
								crearRutaCliente(cliente.ruta1, clienteEncontrado.id);
								crearRutaCliente(cliente.ruta2, clienteEncontrado.id);
								crearRutaCliente(cliente.ruta3, clienteEncontrado.id);

								if (index === (array.length - 1)) {
									res.json({ mensaje: "¡Datos de Clientes actualizados satisfactoriamente!" });
								}
							});
					} else {
						Cliente.create({
							id_empresa: req.body.id_empresa,
							razon_social: cliente.razon_social,
							codigo: cliente.codigo,
							nit: cliente.nit,
							direccion: cliente.direccion,
							telefono1: cliente.telefono1,
							telefono2: cliente.telefono2,
							telefono3: cliente.telefono3,
							contacto: cliente.contacto,
							rubro: cliente.rubro,
							categoria: cliente.categoria,
							ubicacion_geografica: cliente.ubicacion_geografica,
							fecha1: cliente.fecha1,
							fecha2: cliente.fecha2,
							texto1: cliente.texto1,
							texto2: cliente.texto2,
							latitud: cliente.latitud,
							longitud: cliente.longitud
						}).then(function (clienteCreado) {
							crearRutaCliente(cliente.ruta1, clienteCreado.id);
							crearRutaCliente(cliente.ruta2, clienteCreado.id);
							crearRutaCliente(cliente.ruta3, clienteCreado.id);
							if (index === (array.length - 1)) {
								res.json({ mensaje: "Clientes creados satisfactoriamente!" });
							}
						});
					}
				});
			});
		});

	function crearRutaCliente(idRuta, idCliente) {
		if (idRuta != null) {
			RutaCliente.find({
				where: { id_cliente: idCliente, id_ruta: idRuta }
			}).then(function (rutaClienteEncontrada) {
				if (!rutaClienteEncontrada) {
					RutaCliente.create({
						id_cliente: idCliente,
						id_ruta: idRuta
					}).then(function (rutaClienteCreada) {

					})
				}
			})
		}
	}
router.route('/cliente-vencimiento-credito/:id')
		.put(function (req, res) {
			var inicio_fecha_anterior = new Date(req.body.fecha_anterior);
			inicio_fecha_anterior.setHours(0, 0, 0, 0, 0);
			var fin_fecha_anterior = new Date(req.body.fecha_anterior);
			fin_fecha_anterior.setHours(23, 59, 59, 0, 0);
			Venta.update({
				dias_credito: req.body.dias_credito,
			}, {
					where: {
						id: req.params.id
					}

				}).then(function (ventaActializada) {
					VentaReprogramacionPago.update({
						activo: false
					}, {
							where: {
								//fecha_reprogramacion:{ $between: [inicio_fecha_anterior, fin_fecha_anterior] },
								id_venta: req.params.id
							}

						}).then(function (ventaReproActializada) {
							VentaReprogramacionPago.create({
								id_venta: req.params.id,
								fecha_reprogramacion: req.body.fecha_reprogramacion,
								fecha_anterior: req.body.fecha_anterior,
								activo: true
							}).then(function (FechasReporgrmacionCreadas) {
								res.json({ mensaje: "¡Reprogramacion satisfactoriamente!" });
							});
						});
				});
		})
router.route('/clientes/:id_cliente')
		.put(function (req, res) {
			Cliente.update({
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
				texto2: req.body.texto2,
				latitud: req.body.latitud,
				longitud: req.body.longitud
			}, {
					where: {
						id: req.params.id_cliente
					}
				}).then(function (clienteActualizado) {

					req.body.clientes_razon.forEach(function (cliente_razon, index, array) {
						if (cliente_razon.eliminado) {
							ClienteRazon.destroy({
								where: { id: cliente_razon.id } // esta bien? 
							}).then(function (clienteEliminado) {

							});
						} else {
							if (cliente_razon.id) {
								ClienteRazon.update({
									razon_social: cliente_razon.razon_social,
									nit: cliente_razon.nit,
								}, {
										where: { id: cliente_razon.id }
									}).then(function (clienteRazonActualizado) {

									});
							} else {
								ClienteRazon.create({
									id_cliente: req.params.id_cliente,
									razon_social: cliente_razon.razon_social,
									nit: cliente_razon.nit,
								}).then(function (clienteRazonCreado) {

								});
							}
						}
					});
				
					//UPDATE DESTINO

					req.body.cliente_destinos.forEach(function (clienteDestino, index, array) {
						if (clienteDestino.eliminado) {
							GtmClienteDestino.destroy({
								where: { id: clienteDestino.id } // esta bien? 
							}).then(function (GtmClienteDestinoEliminado) {

							});
						} else {
							if (!clienteDestino.id) {
								GtmClienteDestino.create({
									id_cliente: req.params.id_cliente,
									id_destino: clienteDestino.id_destino,
								}).then(function (GtmClienteDestinoCreado) {

								});
							} 
						}
					});
					res.json({ mensaje: "¡Cliente Destino actualizado satisfactoriamente!" });
				});
		})

		.delete(function (req, res) {
			Cliente.destroy({
				where: {
					id: req.params.id_cliente
				}
			}).then(function (affectedRows) {
				res.json({ message: "Eliminado Satisfactoriamente!" });
			});
		})
		
		.get(function(req,res){
			Cliente.find({
				where: {
					id:req.params.id_cliente
				},
				include:[{model:ClienteRazon,as:'clientes_razon'},
				         {model:GtmClienteDestino,as:'cliente_destinos',include:[{model:GtmDestino,as:'destino'}]}]
			}).then(function (cliente) {
				res.json(cliente);
			});
		});

	router.route('/clientes/empresa/:id_empresa/texto/:texto')
		.get(function (req, res) {
			var orCondition = []; console.log(req.params.texto);
			if (req.params.texto == 0) {
				orCondition.push({ nit: req.params.texto });
			} else if (parseInt(req.params.texto)) {
				orCondition.push({ nit: parseInt(req.params.texto) });
			}
			orCondition.push({ razon_social: { $like: "%" + req.params.texto + "%" } }); console.log(orCondition);
			Cliente.findAll({
				where: {
					$and: { id_empresa: req.params.id_empresa, $or: orCondition }
				}
			}).then(function (clientes) {
				res.json(clientes);
			});
		});

	router.route('/cliente/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda')
		.get(function (req, res) {
			var condicionCliente = { id_empresa: req.params.id_empresa/*,codigo:{$not:null}*/ };

			if (parseInt(req.params.texto_busqueda)) {
				condicionCliente = { id_empresa: req.params.id_empresa/*,codigo:{$not:null}*/, nit: parseInt(req.params.texto_busqueda) }
			} else if (req.params.texto_busqueda != 0) {
				condicionCliente = {
					id_empresa: req.params.id_empresa,/*codigo:{$not:null},*/
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

			Cliente.findAndCountAll({

				where: condicionCliente,
				include: [{ model: Empresa, as: 'empresa' }],
				order: [['id', 'asc']]
			}).then(function (data) {
				Cliente.findAll({
					offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
					where: condicionCliente,
					include: [{ model: Empresa, as: 'empresa' },
					{
						model: ClienteRazon, as: 'clientes_razon'
					},
					{
						model: GtmClienteDestino, as: 'cliente_destinos',include:[{model:GtmDestino, as:"destino"}]
					}],
					order: [['id', 'asc']]
				}).then(function (clientes) {
					res.json({ clientes: clientes, paginas: Math.ceil(data.count / req.params.items_pagina) });
				});
			});
		});

	router.route('/clientes/empresa/:id_empresa')
		.get(function (req, res) {
			Cliente.findAll({
				attributes:['id','razon_social','nit','latitud','longitud'],
				where: { id_empresa: req.params.id_empresa },
				//include: [{ model: Empresa, as: 'empresa' }]
			}).then(function (usuarios) {
				res.json(usuarios);
			});
		});

	router.route('/cliente/empresa/:id_empresa/siguiente-codigo')
		.get(function (req, res) {
			sequelize.query("SELECT MAX(CAST(SUBSTRING(codigo, 4, length(codigo)-3) AS UNSIGNED)) as ultimo_codigo FROM agil_cliente where empresa=" + req.params.id_empresa + " and codigo like 'CLI%'", { type: sequelize.QueryTypes.SELECT })
				.then(function (dato) {
					res.json(dato[0]);;
				});
		});
}