module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmEstibaje) {

	router.route('/gtm-estibajes/empresa/:id_empresa')

		.get(function (req, res) {
			GtmEstibaje.findAll({
				where: {
					id_empresa: req.params.id_empresa,
					eliminado:false
				}
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/gtm-estibajes/empresa')

		.post(function (req, res) {
			GtmEstibaje.create({
				codigo: req.body.codigo,
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				costo: req.body.costo,
				eliminado:false
			}).then(function (estibajeCreado) {
				res.json(estibajeCreado);
			});
		});

	router.route('/gtm-estibajes/:id_estibaje')

		.put(function (req, res) {
			GtmEstibaje.update({
				codigo: req.body.codigo,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				costo: req.body.costo,
				eliminado:req.body.eliminado
			},
				{
					where: {
						id: req.params.id_estibaje
					}
				}).then(function (entity) {
					res.json({ mensaje: "Estibaje actualizado satisfactoriamente!" });
				});
		})

		.delete(function (req, res) {
			GtmEstibaje.update({
				eliminado:true
			},
				{
					where: {
						id: req.params.id_estibaje
					}
				}).then(function (entity) {
					res.json({ mensaje: "eliminado satisfactoriamente" });
				});
		});


}