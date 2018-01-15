module.exports = function (router,ensureAuthorizedAdministrador,fs,forEach,jwt,md5,GtmDespacho,GtmDespachoDetalle) {

	router.route('/gtm-despacho/empresa/:id_empresa')
		.post(function (req, res) {
			GtmDespacho.create({
				id_cliente:req.body.id_cliente,
				id_usuario:req.body.id_usuario,
				id_destino:req.body.id_destino,
				id_cliente_razon:req.body.id_cliente_razon,
				fecha:new Date(req.body.fecha.split("/")[2],req.body.fecha.split("/")[1]-1,req.body.fecha.split("/")[0]),
				id_empresa:req.params.id_empresa
			}).then(function(despachoCreado){
				console.log(req.body);
				res.json(despachoCreado);
			});
		});
}
