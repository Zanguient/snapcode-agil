module.exports=function(router,ensureAuthorizedAdministrador,fs,forEach,jwt,md5,Banco,Clase){
	
router.route('/bancos/empresa/:id_empresa')

    .get(function(req, res) {
		Banco.findAll({ 
			where:{
				id_empresa: req.params.id_empresa
			},
			include: [{model:Clase,as: 'tipoCuenta'},{model:Clase,as: 'tipoMoneda'}]
		}).then(function(entity){			
			res.json(entity);		  
		});
	});

router.route('/bancos/empresa')

    .post(function(req, res) {
		Banco.create({
			nombre:req.body.nombre,
			id_empresa:req.body.id_empresa,
			numero:req.body.numero,
			id_tipo_cuenta:req.body.tipoCuenta.id,
			id_tipo_moneda:req.body.tipoMoneda.id
		}).then(function(bancoCreado){
			res.json(bancoCreado);
		});
    });

//Start paginador
router.route('/bancos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda')
	.get(function(req, res) {
		var condicionBanco={id_empresa:req.params.id_empresa/*,codigo:{$not:null}*/};
		if(req.params.texto_busqueda!=0){
			condicionBanco={id_empresa:req.params.id_empresa,/*codigo:{$not:null},*/
				$or: [
						{
						  nombre: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  numero: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						}
					  ]
				};
		}
		Banco.findAndCountAll({ 
			where:condicionBanco,
			// include: [{model:Clase,as: 'tipoCuenta'},{model:Clase,as: 'tipoMoneda'}]
			
			
		}).then(function(data){
			Banco.findAll({ 
				offset:(req.params.items_pagina*(req.params.pagina-1)), limit:req.params.items_pagina,
				where:condicionBanco,
				include: [{model:Clase,as: 'tipoCuenta'},{model:Clase,as: 'tipoMoneda'}],
			order:[['nombre','asc']]
			}).then(function(bancos){			
				res.json({bancos:bancos,paginas:Math.ceil(data.count/req.params.items_pagina)});		  
			});
		});
	});
//End paginador
		
router.route('/bancos/:id_banco')
	.get(function(req, res) {
		Banco.find({ 
			where:{
				id: req.params.id_banco
			},
			include: [{model:Clase,as: 'tipoCuenta'},{model:Clase,as: 'tipoMoneda'}]
		}).then(function(entity){			
			res.json(entity);		  
		});
	})
	
	.put(function(req, res) {
		Banco.update({
			nombre:req.body.nombre,
			id_empresa:req.body.id_empresa,
			numero:req.body.numero,
			id_tipo_cuenta:req.body.tipoCuenta.id,
			id_tipo_moneda:req.body.tipoMoneda.id
		},{
			where:{
				id:req.body.id
			}
		}).then(function(bancoActualizado){
			res.json({"message":"Actualizado Satisfactoriamente!"});
		});
	})
	
	.delete(function(req, res) {
		
	});
	
}