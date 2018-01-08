module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmTransportista,Persona) {

	router.route('/gtm-transportistas/empresa/:id_empresa')

		.get(function (req, res) {
			GtmTransportista.findAll({
				include:[{model:Persona,as:'persona'}],
				where: {
					id_empresa: req.params.id_empresa
				}
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/gtm-transportistas/empresa')

		.post(function (req, res) {
			GtmTransportista.create({
				id_persona: req.body.id_persona,
				vehiculo: req.body.vehiculo,
				codigo: req.body.codigo,
				capacidad: req.body.capacidad,
				nit: req.body.nit,
				costo_transporte: req.body.costo_transporte,
				id_empresa: req.body.id_empresa
			}).then(function (transportistaCreado) {
				res.json(transportistaCreado);
			});
		});

	router.route('/gtm-transportistas/:id_transportista')

		.put(function (req, res) {
			GtmTransportista.update({
				id_persona: req.body.id_persona,
				vehiculo: req.body.vehiculo,
				codigo: req.body.codigo,
				capacidad: req.body.capacidad,
				nit: req.body.nit,
				costo_transporte: req.body.costo_transporte,
			},
				{
					where: {
						id: req.params.id_transportista
					}
				}).then(function (entity) {
					res.json({ mensaje: "actualizado satisfactoriamente" });
				});
		})

		.delete(function (req, res) {
			GtmTransportista.destroy(
				{
					where: {
						id: req.params.id_transportista
					}
				}).then(function (entity) {
					res.json({ mensaje: "eliminado satisfactoriamente" });
				});
		});
}
