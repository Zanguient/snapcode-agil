module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, GtmTransportista,Persona) {

	router.route('/gtm-transportistas/empresa/:id_empresa')

		.get(function (req, res) {
			GtmTransportista.findAll({
				include:[{model:Persona,as:'persona'}],
				where: {
					id_empresa: req.params.id_empresa,
					eliminado:false
				}
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/gtm-transportistas/empresa')

		.post(function (req, res) {
			Persona.create({
				nombre_completo:req.body.persona.nombre_completo,
				direccion:req.body.persona.direccion,
				telefono:req.body.persona.telefono
			}).then(function(personaCreada){
				GtmTransportista.create({
					id_persona: personaCreada.id,
					vehiculo: req.body.vehiculo,
					codigo: req.body.codigo,
					capacidad: req.body.capacidad,
					nit: req.body.nit,
					costo_transporte: req.body.costo_transporte,
					id_empresa: req.body.id_empresa,
					observacion: req.body.observacion
				}).then(function (transportistaCreado) {
					res.json(transportistaCreado);
				});
			});
		});

	router.route('/gtm-transportistas/:id_transportista')

		.put(function (req, res) {
			Persona.update({
				nombre_completo:req.body.persona.nombre_completo,
				direccion:req.body.persona.direccion,
				telefono:req.body.persona.telefono
			},{
				where:{
					id:req.body.id_persona
				}
			}).then(function(personaActualizada){
				GtmTransportista.update({
					vehiculo: req.body.vehiculo,
					codigo: req.body.codigo,
					capacidad: req.body.capacidad,
					nit: req.body.nit,
					costo_transporte: req.body.costo_transporte,
					eliminado:req.body.eliminado,
					observacion:req.body.observacion
				},
					{
						where: {
							id: req.params.id_transportista
						}
					}).then(function (entity) {
						res.json({ mensaje: "actualizado satisfactoriamente" });
					});
			});
		})

		.delete(function (req, res) {
			GtmTransportista.update({
				eliminado:true
			},
				{
					where: {
						id: req.params.id_transportista
					}
				}).then(function (entity) {
					res.json({ mensaje: "eliminado satisfactoriamente" });
				});
		});
}
