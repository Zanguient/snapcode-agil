module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmDestino) {

	router.route('/gtm-destinos/empresa/:id_empresa')

		.get(function (req, res) {
			GtmDestino.findAll({
				where: {
					id_empresa: req.params.id_empresa
				}
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/gtm-destinos/empresa')

		.post(function (req, res) {
			GtmDestino.create({
				id_empresa: req.body.id_empresa,
				destino: req.body.destino,
				direccion: req.body.direccion
			}).then(function (destinoCreado) {
				res.json(destinoCreado);
			});
		});

	router.route('/gtm-destinos/:id_destino')

		.put(function (req, res) {
			GtmDestino.update({
				destino: req.body.destino,
				direccion: req.body.direccion
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