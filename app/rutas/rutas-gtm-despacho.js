module.exports = function (router,ensureAuthorizedAdministrador,fs,forEach,jwt,md5,GtmDespacho,
	GtmDespachoDetalle,Cliente,Usuario,GtmDestino,Producto,GtmTransportista,GtmEstibaje,GtmGrupoEstibaje,
	Persona) {

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
				req.body.detalles_despacho.forEach(function(detalle_despacho, index, array){
					GtmDespachoDetalle.create({
						id_despacho:despachoCreado.id,
						id_producto:detalle_despacho.id_producto,
						cantidad:parseFloat(detalle_despacho.cantidad),
						precio_unitario:parseFloat(detalle_despacho.precio_unitario),
						importe:parseFloat(detalle_despacho.total),
						saldo:0,
						despachado:false,
						eliminado:false
					}).then(function(detalleDespachoCreado){
						if (index === (array.length - 1)) {
							res.json(despachoCreado);
						}
					});
				});
			});
		});

router.route('/gtm-detalle-despacho/empresa/:id_empresa')
	.get(function (req, res) {
		GtmDespachoDetalle.findAll({
			where:{
				despachado:false,
				eliminado:false
			},
			include:[{model:GtmDespacho,as:'despacho',
					where:{id_empresa:req.params.id_empresa},
					include:[{model:Usuario,as:'usuario'},
							 {model:Cliente,as:'cliente'},
							 {model:GtmDestino,as:'destino'}]},
					{model:Producto,as:'producto'}]
		}).then(function(detallesDespacho){
			res.json(detallesDespacho);
		});
	})
	
	.put(function (req, res) {
		req.body.forEach(function(detalle_despacho, index, array){
			GtmDespachoDetalle.update({
				cantidad_despacho:detalle_despacho.cantidad_despacho,
				saldo:detalle_despacho.saldo,
				id_transportista:detalle_despacho.id_transportista,
				id_estibaje:detalle_despacho.id_estibaje,
				id_grupo_estibaje:detalle_despacho.id_grupo_estibaje,
				despachado:true
			},{
				where:{
					id:detalle_despacho.id
				}
			}).then(function(desact){
				if (index === (array.length - 1)) {
					res.json({mensaje:"Despachos asignados satisfactoriamente!"});
				}
			});
		});
	});

router.route('/gtm-detalle-despacho-despachado/empresa/:id_empresa')
	.get(function (req, res) {
		GtmDespachoDetalle.findAll({
			where:{
				despachado:true,
				eliminado:false
			},
			include:[{model:GtmDespacho,as:'despacho',
					where:{id_empresa:req.params.id_empresa},
					include:[{model:Usuario,as:'usuario'},
							 {model:Cliente,as:'cliente'},
							 {model:GtmDestino,as:'destino'}]},
					{model:Producto,as:'producto'},
					{model:GtmTransportista,as:'transportista',
							include:[{model:Persona,as:'persona'}]},
				    {model:GtmGrupoEstibaje,as:'grupo_estibaje'},
				    {model:GtmEstibaje,as:'estibaje'}]
		}).then(function(detallesDespacho){
			res.json(detallesDespacho);
		});
	});

router.route('/gtm-detalle-despacho/:id_detalle_despacho')
	.put(function (req, res) {
		GtmDespachoDetalle.update({
			factura:req.body.factura
		},{
			where:{
				id:req.params.id_detalle_despacho
			}
		}).then(function(detallesDespacho){
			res.json({mensaje:"Actualizado satisfactoriamente!"});
		});
	})
	
	.delete(function (req, res) {
		GtmDespachoDetalle.update({
			eliminado:true
		},{
			where:{
				id:req.params.id_detalle_despacho
			}
		}).then(function(detallesDespacho){
			res.json({mensaje:"Eliminado satisfactoriamente!"});
		});
	});
	
}
