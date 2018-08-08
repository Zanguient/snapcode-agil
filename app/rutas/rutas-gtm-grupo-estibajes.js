module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmGrupoEstibaje) {

	router.route('/gtm-grupo-estibajes/empresa/:id_empresa')

		.get(function (req, res) {
			GtmGrupoEstibaje.findAll({
				where: {
					id_empresa: req.params.id_empresa,
					eliminado:false
				}
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/gtm-grupo-estibajes/empresa')

		.post(function (req, res) {
			GtmGrupoEstibaje.create({
				id_empresa: req.body.id_empresa,
				codigo: req.body.codigo,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				activo:true
			}).then(function (grupoEstibajeCreado) {
				res.json(grupoEstibajeCreado);
			});
		});

	router.route('/gtm-grupo-estibajes/:id_grupo_estibaje')

		.put(function (req, res) {
			GtmGrupoEstibaje.update({
				codigo: req.body.codigo,
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				eliminado:req.body.eliminado,
				activo:req.body.activo
			},
				{
					where: {
						id: req.params.id_grupo_estibaje
					}
				}).then(function (entity) {
					res.json({ mensaje: "actualizado satisfactoriamente" });
				});
		})

		.delete(function (req, res) {
			GtmGrupoEstibaje.destroy(
				{
					where: {
						id: req.params.id_grupo_estibaje
					}
				}).then(function (entity) {
					res.json({ mensaje: "eliminado satisfactoriamente" });
				});
		});
}