module.exports = function (router,ensureAuthorizedAdministrador,fs,forEach,jwt,md5,GtmDespacho,
	GtmDespachoDetalle,Cliente,Usuario,GtmDestino,Producto,GtmTransportista,GtmEstibaje,GtmGrupoEstibaje,
	Persona,ClienteRazon) {

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
						cantidad_despacho:0,
						id_producto:detalle_despacho.id_producto,
						cantidad:parseFloat(detalle_despacho.cantidad),
						precio_unitario:parseFloat(detalle_despacho.precio_unitario),
						importe:parseFloat(detalle_despacho.total),
						saldo:parseFloat(detalle_despacho.cantidad),						
						despachado:false,
						eliminado:false,
						fecha:new Date(req.body.fecha.split("/")[2],req.body.fecha.split("/")[1]-1,req.body.fecha.split("/")[0]),
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
				eliminado:false,
				id_padre:null
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
	
	/* .put(function (req, res) {
		req.body.forEach(function(detalle_despacho, index, array){
			var despachado=false
			if(detalle_despacho.saldo2==0){
				despachado=true
			}
			detalle_despacho.cantidad_despacho=detalle_despacho.cantidad_despacho+detalle_despacho.cantidad_despacho2
			GtmDespachoDetalle.update({
				cantidad_despacho:detalle_despacho.cantidad_despacho,
				saldo:detalle_despacho.saldo2,
				id_transportista:detalle_despacho.id_transportista,
				id_estibaje:detalle_despacho.id_estibaje,
				id_grupo_estibaje:detalle_despacho.id_grupo_estibaje,
				despachado:despachado
			},{
				where:{
					id:detalle_despacho.id
				}
			}).then(function(desact){
				if (index === (array.length - 1)) {
					res.json({mensaje:"Despachos asignados satisfactoriamente!"});
				}
			});
			
		}); */
		router.route('/gtm-detalle-despacho/empresa/:id_empresa/fecha/:fecha')
		.put(function (req, res) {
			req.body.forEach(function (detalle_despacho, index, array) {
				var despachado = false
				if (detalle_despacho.saldo2 == 0) {
					despachado = true
				}
				detalle_despacho.cantidad_despacho = detalle_despacho.cantidad_despacho + detalle_despacho.cantidad_despacho2
				GtmDespachoDetalle.update({
					cantidad_despacho:detalle_despacho.cantidad_despacho,
					saldo:detalle_despacho.saldo2,
					id_transportista:detalle_despacho.id_transportista,
					id_estibaje:detalle_despacho.id_estibaje,
					id_grupo_estibaje:detalle_despacho.id_grupo_estibaje,
					despachado:despachado				
				},{
					where:{
						id:detalle_despacho.id
					}
				}).then(function(desact){
				GtmDespachoDetalle.create({
					cantidad_despacho: detalle_despacho.cantidad_despacho,
					saldo: detalle_despacho.saldo2,
					id_transportista: detalle_despacho.id_transportista,
					id_estibaje: detalle_despacho.id_estibaje,
					id_grupo_estibaje: detalle_despacho.id_grupo_estibaje,
					despachado: despachado,
					id_despacho: detalle_despacho.id_despacho,
					id_producto: detalle_despacho.id_producto,
					cantidad: detalle_despacho.cantidad,
					precio_unitario: detalle_despacho.precio_unitario,
					importe: detalle_despacho.importe,
					eliminado: false,
					id_padre: detalle_despacho.id,
					fecha:req.params.fecha
				}, {
						where: {
							id: detalle_despacho.id
						}
					}).then(function (desact) {
						if (index === (array.length - 1)) {
							res.json({ mensaje: "Despachos asignados satisfactoriamente!" });
						}
					});
			});
		});
	});

router.route('/gtm-detalle-despacho-despachado/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/inicio/:inicio/fin/:fin/transportista/:transportista/tipo/:tipo/grupo/:grupo/estado/:estado')
	.get(function (req, res) {
		var condicionDespacho={id_padre:{$ne:null},	eliminado:false}
		var condicionEstibaje={}
		var condicionGrupoEstibaje={}
		var condicionTrabajador={}
		var condicionCliente={}
		if (req.params.inicio != 0) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
			condicionDespacho={id_padre:{$ne:null}, eliminado: false, fecha: { $between: [inicio, fin] } };
		}
		if (req.params.transportista != 0) {
			condicionTrabajador={nombre_completo:{$like: "%" + req.params.transportista + "%"}}
		}
		if (req.params.tipo != 0) {
			condicionEstibaje={nombre:req.params.tipo}
		}
		if (req.params.grupo != 0) {
			condicionGrupoEstibaje={nombre:req.params.grupo}
		}
		if (req.params.estado != 0) {
			
		}
		if (req.params.texto_busqueda != 0) {
			condicionCliente={razon_social:req.params.texto_busqueda}
		}
		GtmDespachoDetalle.findAndCountAll({
			where: condicionDespacho,
			include:[{model:GtmDespacho,as:'despacho',
					where:{id_empresa:req.params.id_empresa},
					include:[{model:Usuario,as:'usuario'},
							 {model:Cliente,as:'cliente',include:[{model: ClienteRazon, as: 'clientes_razon'}],where:condicionCliente},
							 {model:GtmDestino,as:'destino'}]},
					{model:Producto,as:'producto'},
					{model:GtmTransportista,as:'transportista',
							include:[{model:Persona,as:'persona',where:condicionTrabajador}]},
				    {model:GtmGrupoEstibaje,as:'grupo_estibaje',where:condicionGrupoEstibaje},
				    {model:GtmEstibaje,as:'estibaje',	where:condicionEstibaje}],
			order: [['id', 'asc']]
		}).then(function (data) {
			GtmDespachoDetalle.findAll({
				offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
				where: condicionDespacho,		
				include:[{model:GtmDespacho,as:'despacho',
					where:{id_empresa:req.params.id_empresa},
					include:[{model:Usuario,as:'usuario'},
							 {model:Cliente,as:'cliente',include:[{model: ClienteRazon, as: 'clientes_razon'}],where:condicionCliente},
							 {model:GtmDestino,as:'destino'}]},
					{model:Producto,as:'producto'},
					{model:GtmTransportista,as:'transportista',
							include:[{model:Persona,as:'persona',where:condicionTrabajador}]},
				    {model:GtmGrupoEstibaje,as:'grupo_estibaje',where:condicionGrupoEstibaje},
				    {model:GtmEstibaje,as:'estibaje',where:condicionEstibaje}],		
				order: [['id', 'asc']]
			}).then(function (detallesDespacho) {
				res.json({ detallesDespacho: detallesDespacho, paginas: Math.ceil(data.count / req.params.items_pagina) });
			});
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
