module.exports=function(router,Ruta,RutaDia,RutaCliente,Clase,Cliente,Persona,UsuarioRuta,Usuario,Venta,Movimiento,
						DetalleVenta,Producto,DetalleVentaNoConsolidada){
	
router.route('/rutas')

    .post(function(req, res) {
		Ruta.create({ 
			id_empresa:req.body.id_empresa,
			nombre:req.body.nombre,
			codigo:req.body.codigo,
			id_departamento:req.body.departamento.id,
			id_municipio:req.body.municipio.id,
			segmentos:req.body.segmentos
		}).then(function(rutaCreada){
			req.body.dias.forEach(function(dia,indice,arreglo){
				RutaDia.create({
					id_ruta:rutaCreada.id,
					id_dia:dia
				}).then(function(rutaDiaCreado){
					
				});
			});
			req.body.clientes.forEach(function(cliente,indice,arreglo){
				RutaCliente.create({
					id_ruta:rutaCreada.id,
					id_cliente:cliente
				}).then(function(rutaClienteCreado){
					
				});
			});
			
			res.json(rutaCreada);
		});
    });
	
router.route('/rutas/:id')

    .put(function(req, res) {
		Ruta.update({ 
			nombre:req.body.nombre,
			codigo:req.body.codigo,
			id_departamento:req.body.departamento.id,
			id_municipio:req.body.municipio.id,
			segmentos:req.body.segmentos
		},{
			where:{
				id:req.params.id
			}
		}).then(function(rutaActualizada){
			RutaDia.destroy({
				where:{id_ruta:req.params.id}
			}).then(function(res){
				req.body.dias.forEach(function(dia,indice,arreglo){
					RutaDia.create({
						id_ruta:req.params.id,
						id_dia:dia
					}).then(function(rutaDiaCreado){
						
					});
				});
			});
			
			RutaCliente.destroy({
				where:{id_ruta:req.params.id}
			}).then(function(res){
				req.body.clientes.forEach(function(cliente,indice,arreglo){
					RutaCliente.create({
						id_ruta:req.params.id,
						id_cliente:cliente
					}).then(function(rutaClienteCreado){
						
					});
				});
			});
			
			
			res.json({mensaje:"¡Ruta actualizada satisfactoriamente!"});
		});
    })
	
	.delete(function(req, res) {
		Ruta.destroy({
			where:{
				id:req.params.id
			}
		}).then(function(rutaActualizada){
			RutaDia.destroy({
				where:{id_ruta:req.params.id}
			}).then(function(res){
				
			});
			
			RutaCliente.destroy({
				where:{id_ruta:req.params.id}
			}).then(function(res){

			});
			
			
			res.json({mensaje:"¡Ruta eliminada satisfactoriamente!"});
		});
    });
	
router.route('/rutas/empresa/:id_empresa')
	.get(function(req, res) {
		Ruta.findAll({ 
			where:{id_empresa:req.params.id_empresa},
			include: [{model:Clase,as: 'departamento'},
					  {model:Clase,as: 'municipio'},
					  {model:RutaDia,as: 'dias'},
					  {model:RutaCliente,as: 'clientes',
							include: [{model:Cliente,as: 'cliente'}]},
					  {model:UsuarioRuta,as: 'usuarios',include:[{model:Usuario,as:'usuario'}]}]
		}).then(function(rutas){			
			res.json(rutas);		  
		});
	});
	
router.route('/rutas/usuario/:id_usuario/dia/:dia')
	.get(function(req, res) {
		UsuarioRuta.findAll({ 
			where:{id_usuario:req.params.id_usuario},
			include: [{model:Ruta,as: 'ruta',
							include: [{model:RutaDia,as: 'dias',
										include:[{model:Clase,as:'dia',where:{nombre_corto:req.params.dia}}]},
									  {model:RutaCliente,as:'clientes',
										include:[{model:Cliente,as:'cliente',
													include:[{model:Venta,as: 'ventas',required:false,where:{'saldo': {$gt: 0}},
														include:[{model:Clase,as:'tipoPago',required:false,where:{nombre_corto:'CRE'}},
																 {model:Movimiento,as: 'movimiento',
																	include:[{model:Clase,as:'clase'}]},
															     {model:DetalleVenta,as:'detallesVenta',
																	include:[{model:Producto,as:'producto'}]}]}]}]}]}]
		}).then(function(rutas){			
			res.json(rutas);		  
		});
	});
	
router.route('/rutas/seguimiento/usuario/:id_usuario/dia/:dia')
	.get(function(req, res) {
		var inicio= new Date();inicio.setHours(0,0,0,0,0);
		var fin= new Date();fin.setHours(23,0,0,0,0);
		UsuarioRuta.findAll({ 
			where:{id_usuario:req.params.id_usuario},
			include: [{model:Ruta,as: 'ruta',
							include: [{model:RutaDia,as: 'dias',
										include:[{model:Clase,as:'dia',where:{nombre_corto:req.params.dia}}]},
									  {model:RutaCliente,as:'clientes',
										include:[{model:Cliente,as:'cliente',
													include:[{model:Venta,as: 'ventas',required:false,where:{fecha: {$between: [inicio,fin]}},
														include:[{model:DetalleVenta,as:'detallesVenta',
																	include:[{model:Producto,as:'producto'}]},
																 {model:DetalleVentaNoConsolidada,as:'detallesVentaNoConsolidadas',
																	include:[{model:Producto,as:'producto'},
																			 {model:Cliente,as:'cliente'}]}]},
															 {model:DetalleVentaNoConsolidada,as:'detallesVentaNoConsolidadas',required:false,where:{fecha: {$between: [inicio,fin]}},
																	include:[{model:Producto,as:'producto'},
																			 {model:Cliente,as:'cliente'}]}]}]}]}]
		}).then(function(rutas){			
			res.json(rutas);		  
		});
	});
}