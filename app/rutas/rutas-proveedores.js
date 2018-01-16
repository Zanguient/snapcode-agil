module.exports=function(router,sequelize,forEach,decodeBase64Image,fs,Empresa,Proveedor,Compra,CompraReprogramacionPago){
	
router.route('/proveedores')

    .post(function(req, res) {
		Proveedor.find({
			where: {
				$or: [{ nit: req.body.nit }, { codigo: req.body.codigo }],
				id_empresa: req.body.id_empresa
			},
		}).then(function (proveedor) {
			if (proveedor) {
				
				Proveedor.update({
					id_empresa:req.body.id_empresa,
					razon_social:req.body.razon_social,
					codigo:req.body.codigo,
					nit:req.body.nit,
					direccion:req.body.direccion,
					telefono1:req.body.telefono1,
					telefono2:req.body.telefono2,
					telefono3:req.body.telefono3,
					contacto:req.body.contacto,
					rubro:req.body.rubro,
					categoria:req.body.categoria,
					ubicacion_geografica:req.body.ubicacion_geografica,
					fecha1:req.body.fecha1,
					fecha2:req.body.fecha2,
					texto1:req.body.texto1,
					texto2:req.body.texto2
				}, {
						where: {
							id: proveedor.id
						}
						
					}).then(function (clienteCreado) {
						res.json(proveedor);
					});


			}else{
				Proveedor.create({
					id_empresa:req.body.id_empresa,
					razon_social:req.body.razon_social,
					codigo:req.body.codigo,
					nit:req.body.nit,
					direccion:req.body.direccion,
					telefono1:req.body.telefono1,
					telefono2:req.body.telefono2,
					telefono3:req.body.telefono3,
					contacto:req.body.contacto,
					rubro:req.body.rubro,
					categoria:req.body.categoria,
					ubicacion_geografica:req.body.ubicacion_geografica,
					fecha1:req.body.fecha1,
					fecha2:req.body.fecha2,
					texto1:req.body.texto1,
					texto2:req.body.texto2
				}).then(function(proveedorCreado){
					res.json(proveedorCreado);
				});
			}
    });
router.route('/proveedor/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda')
	.get(function(req, res) {
		var condicionProveedor={id_empresa:req.params.id_empresa,};	
		if(parseInt(req.params.texto_busqueda)){
			condicionProveedor={id_empresa:req.params.id_empresa,codigo:{$not:null},nit:parseInt(req.params.texto_busqueda)}
		}else if(req.params.texto_busqueda !=0){
			condicionProveedor={id_empresa:req.params.id_empresa,codigo:{$not:null},
				$or: [
						{
						  codigo: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  razon_social: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  direccion: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
							rubro:{
								$like: "%"+req.params.texto_busqueda+"%"
							}
						},
						{
							categoria:{
								$like: "%"+req.params.texto_busqueda+"%"
							}
						},
						{
							ubicacion_geografica:{
								$like: "%"+req.params.texto_busqueda+"%"	
							}
						}

					  ]
				};
		}
		
		Proveedor.findAndCountAll({
		  
			where:condicionProveedor,
			include: [{model:Empresa,as: 'empresa'}],
			order:[['id','asc']]
		}).then(function(data){
			Proveedor.findAll({ 
				offset:(req.params.items_pagina*(req.params.pagina-1)), limit:req.params.items_pagina,
				where:condicionProveedor,
				include: [{model:Empresa,as: 'empresa'}],
				order:[['id','asc']]
			}).then(function(proveedores){			
				res.json({proveedores:proveedores,paginas:Math.ceil(data.count/req.params.items_pagina)});		  
			});
		});
});	
router.route('/proveedores/empresa/:id_empresa')
	.get(function(req, res) {
		Proveedor.findAll({ 
			where:{id_empresa:req.params.id_empresa},
			include: [{model:Empresa,as: 'empresa'}]
		}).then(function(proveedores){			
			res.json(proveedores);		  
		});
	});
	
router.route('/proveedores/empresa')
	.post(function(req, res) {
		req.body.proveedores.forEach(function(proveedor, index, array){
			Proveedor.find({
				where: {
					id_empresa: req.body.id_empresa,
					$or: [{ nit: proveedor.nit }, { codigo: proveedor.codigo }]
				},
			}).then(function (proveedorEncontrado) {
				if (proveedorEncontrado) {
					Proveedor.update({
						razon_social:proveedor.razon_social,
						codigo:proveedor.codigo,
						nit:proveedor.nit,
						direccion:proveedor.direccion,
						telefono1:proveedor.telefono1,
						telefono2:proveedor.telefono2,
						telefono3:proveedor.telefono3,
						contacto:proveedor.contacto,
						rubro:proveedor.rubro,
						categoria:proveedor.categoria,
						ubicacion_geografica:proveedor.ubicacion_geografica,
						fecha1:proveedor.fecha1,
						fecha2:proveedor.fecha2,
						texto1:proveedor.texto1,
						texto2:proveedor.texto2
					}, {
							where: {
								id: proveedorEncontrado.id
							}
						}).then(function (clienteCreado) {
							if (index === (array.length - 1)) {
								res.json({ mensaje: "¡Datos de Proveedores actualizados satisfactoriamente!" });
							}
						});
				} else {
					Proveedor.create({
						id_empresa:req.body.id_empresa,
						razon_social:proveedor.razon_social,
						codigo:proveedor.codigo,
						nit:proveedor.nit,
						direccion:proveedor.direccion,
						telefono1:proveedor.telefono1,
						telefono2:proveedor.telefono2,
						telefono3:proveedor.telefono3,
						contacto:proveedor.contacto,
						rubro:proveedor.rubro,
						categoria:proveedor.categoria,
						ubicacion_geografica:proveedor.ubicacion_geografica,
						fecha1:proveedor.fecha1,
						fecha2:proveedor.fecha2,
						texto1:proveedor.texto1,
						texto2:proveedor.texto2
					}).then(function(proveedorCreado){
						if(index===(array.length-1)){
							res.json({mensaje:"Proveedores creados satisfactoriamente!"});
						}
					});
				}
			});
		});
    });

router.route('/proveedor-vencimiento-Deudas/:id')
	.put(function(req, res) {
		var inicio_fecha_anterior=new Date(req.body.fecha_anterior);
		inicio_fecha_anterior.setHours(0, 0, 0, 0, 0);
		var fin_fecha_anterior=new Date(req.body.fecha_anterior);
		fin_fecha_anterior.setHours(23, 59, 59, 0, 0);
		Compra.update({			
			dias_credito:req.body.dias_credito,
		},{
			where:{
				id:req.params.id
			}
		}).then(function(compraActualizada){
			CompraReprogramacionPago.update({		
			activo:false
			},{
				where:{					
					//fecha_reprogramacion:{ $between: [inicio_fecha_anterior, fin_fecha_anterior] },
					id_compra:req.params.id
				}

			}).then(function(compraReproActializada){		
				CompraReprogramacionPago.create({
				id_compra:req.params.id,
				fecha_reprogramacion:req.body.fecha_reprogramacion,
				fecha_anterior:req.body.fecha_anterior,
				activo:true
				}).then(function(FechasReporgrmacionCreadas){
					res.json({mensaje:"¡Reprogramacion satisfactoriamente!"});	
				});
			});						
		});
	})	
router.route('/proveedores/:id_proveedor')
	.put(function(req, res) {
		Proveedor.update({
			razon_social:req.body.razon_social,
			codigo:req.body.codigo,
			nit:req.body.nit,
			direccion:req.body.direccion,
			telefono1:req.body.telefono1,
			telefono2:req.body.telefono2,
			telefono3:req.body.telefono3,
			contacto:req.body.contacto,
			rubro:req.body.rubro,
			categoria:req.body.categoria,
			ubicacion_geografica:req.body.ubicacion_geografica,
			fecha1:req.body.fecha1,
			fecha2:req.body.fecha2,
			texto1:req.body.texto1,
			texto2:req.body.texto2
		},{
			where:{
				id:req.params.id_proveedor
			}
		}).then(function(proveedorCreado){
			res.json(req.body);		  
		});
	})
	
	.delete(function(req, res) {
		Proveedor.destroy({ 
			where:{
				id: req.params.id_proveedor
			}
		}).then(function(affectedRows){		
			res.json({message:"Eliminado Satisfactoriamente!"});
		});
	});

router.route('/proveedores/empresa/:id_empresa/texto/:texto')
	.get(function(req, res) {
		var orCondition=[];
		if(parseInt(req.params.texto)){
			orCondition.push({nit:parseInt(req.params.texto)});
		}
		orCondition.push({razon_social: {$like: "%"+req.params.texto+"%"}});
		Proveedor.findAll({ 
			where: {
				$and: {id_empresa:req.params.id_empresa,$or:orCondition}
			}
		}).then(function(proveedores){
			res.json(proveedores);		  
		});
	});
}