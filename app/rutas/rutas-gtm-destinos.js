module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmDestino, Cliente, GtmClienteDestino,Clase) {

	router.route('/gtm-destinos/empresa/:id_empresa')
		.get(function (req, res) {
			GtmDestino.findAll({
				where: {
					id_empresa: req.params.id_empresa,
					eliminado: false
				}
			}).then(function (entity) {
				res.json(entity);
			});
		})
		.post(function (req, res) {
			req.body.forEach(function (destino, index, array) {
				if (destino.cliente_codigo) {
					Cliente.find({
						where: {
							id_empresa: req.params.id_empresa,
							codigo: destino.cliente_codigo
						}
					}).then(function (clienteEncontrado) {
						if (clienteEncontrado) {
							GtmDestino.findOrCreate({
								where: {
									codigo: destino.codigo,
								},
								defaults: {
									id_empresa: req.params.id_empresa,
									destino: destino.destino,
									direccion: destino.direccion,
									eliminado: false,
								}
							}).spread(function (destinosEncontrado, created) {
								GtmClienteDestino.findOrCreate({
									where: {
										id_cliente: clienteEncontrado.id,
										id_destino: destinosEncontrado.id
									},
									defaults: {
										id_cliente: clienteEncontrado.id,
										id_destino: destinosEncontrado.id
									}

								}).spread(function (destinosCliente, created) {
									if (index === (array.length - 1)) {
										res.json({ mensaje: "Datos importados Satisfactoriamente!" });
									}
								})
							})
						} else {
							GtmDestino.create({
								id_empresa: req.params.id_empresa,
								destino: destino.destino,
								direccion: destino.direccion,
								eliminado: false,
								codigo: destino.codigo
							}).then(function (destinoCreado) {
								if (index === (array.length - 1)) {
									res.json({ mensaje: "Datos importados Satisfactoriamente!" });
								}
							});
						}
					})

				} else {
					GtmDestino.create({
						id_empresa: req.params.id_empresa,
						destino: destino.destino,
						direccion: destino.direccion,
						eliminado: false,
						codigo: destino.codigo
					}).then(function (destinoCreado) {
						if (index === (array.length - 1)) {
							res.json({ mensaje: "Datos importados Satisfactoriamente!" });
						}
					});
				}
			});

		});
	router.route('/gtm-destinos/empresa')

		.post(function (req, res) {
			if (req.body.correlativo) {
				Clase.find({
					where: { id: req.body.correlativo.id }
				}).then(function (correlativoEncontrado) {
					var numero_correlativo = correlativoEncontrado.nombre_corto.split("-")[0]
					var maximo = parseInt(correlativoEncontrado.nombre_corto.split("-")[1])
					if (numero_correlativo > maximo) {
						numero_correlativo = null
					}
					GtmDestino.create({
						id_empresa: req.body.id_empresa,
						destino: req.body.destino,
						direccion: req.body.direccion,
						eliminado: false,
						codigo: numero_correlativo
					}).then(function (destinoCreado) {
						var numero = parseInt(numero_correlativo) + 1
						var nombre_corto = numero + "-" + maximo
						if (numero_correlativo > maximo) {
							nombre_corto = maximo - maximo
						}
						Clase.update({
							nombre_corto: nombre_corto
						}, {
								where: { id: req.body.correlativo.id }
							}).then(function (correlativoActualizado) {
								res.json(destinoCreado);
							});
					});
				})
			} else {
				GtmDestino.create({
					id_empresa: req.body.id_empresa,
					destino: req.body.destino,
					direccion: req.body.direccion,
					eliminado: false,
					codigo: req.body.codigo
				}).then(function (destinoCreado) {
					res.json(destinoCreado);
				});
			}
		});

	router.route('/gtm-destinos/:id_destino')

		.put(function (req, res) {
			GtmDestino.update({
				destino: req.body.destino,
				direccion: req.body.direccion,
				eliminado: req.body.eliminado,
				codigo: req.body.codigo
			},
				{
					where: {
						id: req.params.id_destino
					}
				}).then(function (entity) {
					res.json({ mensaje: "actualizado satisfactoriamente" });
				});
		})

		.delete(function (req, res) {
			GtmDestino.destroy(
				{
					where: {
						id: req.params.id_destino
					}
				}).then(function (entity) {
					res.json({ mensaje: "eliminado satisfactoriamente" });
				});
		});
}