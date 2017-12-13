module.exports=function(router,UsuarioRuta,Ruta,Usuario,Persona,Venta,RutaDia,Clase,DetalleVenta,Producto,Cliente,RutaCliente,
						DetalleVentaNoConsolidada,ComisionVendedorProducto,PagoVenta){

router.route('/usuarios-rutas/empresa/:id_empresa/inicio/:inicio/fin/:fin/usuario/:usuario/ruta/:ruta')
	.get(function(req, res) {
		var inicio= new Date(req.params.inicio);inicio.setHours(0,0,0,0,0);
		var fin= new Date(req.params.fin);fin.setHours(23,0,0,0,0);
		var condicionVenta={fecha: {$between: [inicio,fin]}},condicionRuta={},condicionUsuario={id_empresa:req.params.id_empresa};
		if(req.params.ruta!=0){
			condicionRuta.id=req.params.ruta;
		}
		if(req.params.usuario!=0){
			condicionUsuario.nombre_usuario={$like:"%"+req.params.usuario+"%"};
		}
		
		UsuarioRuta.findAll({
			include:[{model:Ruta,as:'ruta',where:condicionRuta,
						include:[{model:RutaDia,as:'dias',
							include:[{model:Clase,as:'dia'}]}]},
				     {model:Usuario,as:'usuario',where:condicionUsuario,
						include:[{model:Persona,as:'persona'},
							     {model:Venta,as:'ventas',where:condicionVenta,required:false,
									include:[{model:Clase,as:'tipoPago'}]}]}]
		}).then(function(usuariosRutas){
			res.json(usuariosRutas);
		});
	});
	
/*router.route('/rutas/seguimiento/usuario/:id_usuario')
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
	});*/
router.route('/rutas/reporte/usuario/:id_usuario/ruta/:id_ruta/inicio/:inicio/fin/:fin/detalles-venta/:tipo')
	.get(function(req, res) {
		var inicio= new Date(req.params.inicio);inicio.setHours(0,0,0,0,0);
		var fin= new Date(req.params.fin);fin.setHours(23,0,0,0,0);
		/*if(req.params.tipo==0){
			DetalleVenta.findAll({ 
				include: [{model:Venta,as: 'venta',where:{id_usuario:req.params.id_usuario,fecha: {$between: [inicio,fin]}},
								include: [{model:Cliente,as: 'cliente',
											include:[{model:RutaCliente,as:'rutas',where:{id_ruta:req.params.id_ruta}}]},
										  {model:Clase,as: 'tipoPago'},
										  {model:DetalleVentaNoConsolidada,as:'detallesVentaNoConsolidadas',required:false,
												include: [{model:Producto,as:'producto'}]}]},
						  {model:Producto,as:'producto'}]
			}).then(function(detallesVenta){			
				res.json(detallesVenta);		  
			});
		}else*/ if(req.params.tipo==1){
			DetalleVentaNoConsolidada.findAll({ 
				where:{
					id_venta:null,
					id_producto:null,
					fecha: {$between: [inicio,fin]}
				},
				include: [{model:Cliente,as: 'cliente',
								include: [{model:RutaCliente,as: 'rutas',where:{id_ruta:req.params.id_ruta}}]},
						  {model:Producto,as:'producto'}]
			}).then(function(detallesVenta){			
				res.json(detallesVenta);		  
			});
		}else if(req.params.tipo==2){
			DetalleVentaNoConsolidada.findAll({ 
				where:{
					fecha: {$between: [inicio,fin]}
				},
				include: [{model:Venta,as: 'venta',where:{id_usuario:req.params.id_usuario},
								include: [{model:Cliente,as: 'cliente',
											include:[{model:RutaCliente,as:'rutas',where:{id_ruta:req.params.id_ruta}}]},
										  {model:Clase,as: 'tipoPago'}]},
						  {model:Producto,as:'producto'}]
			}).then(function(detallesVenta){			
				res.json(detallesVenta);		  
			});
		}else if(req.params.tipo==3){
			DetalleVenta.findAll({ 
				include: [{model:Venta,as: 'venta',where:{id_usuario:req.params.id_usuario,fecha: {$between: [inicio,fin]}},
								include: [{model:Cliente,as: 'cliente',
											include:[{model:RutaCliente,as:'rutas',where:{id_ruta:req.params.id_ruta}}]},
										  {model:Clase,as: 'tipoPago'}]},
						  {model:Producto,as:'producto'}]
			}).then(function(detallesVenta){			
				res.json(detallesVenta);		  
			});
		}
	});
	
router.route('/rutas/grafico/usuario/:id_usuario/ruta/:id_ruta/inicio/:inicio/fin/:fin')
	.get(function(req, res) {
		var inicio= new Date(req.params.inicio);inicio.setHours(0,0,0,0,0);
		var fin= new Date(req.params.fin);fin.setHours(23,0,0,0,0);
		Venta.findAll({
			where:{id_usuario:req.params.id_usuario,fecha: {$between: [inicio,fin]}},
			include: [{model:Cliente,as: 'cliente',
							include: [{model:RutaCliente,as: 'rutas',where:{id_ruta:req.params.id_ruta}}]}],
			order: [['fecha', 'ASC']]
		}).then(function(ventas){			
			res.json(ventas);		  
		});
	})
	
router.route('/usuarios-comisiones-reporte/empresa/:id_empresa/inicio/:inicio/fin/:fin')
	.get(function(req, res) {
		var inicio= new Date(req.params.inicio);inicio.setHours(0,0,0,0,0);
		var fin= new Date(req.params.fin);fin.setHours(23,0,0,0,0);
		Usuario.findAll({
			where:{id_empresa:req.params.id_empresa},
			include:[{model:Venta,as:'ventas',where:{fecha: {$between: [inicio,fin]}},
						include:[{model:DetalleVenta,as:'detallesVenta',
							include:[{model:Producto,as:'producto',
								include:[{model:ComisionVendedorProducto,as:'comisionesVendedores'}]}]}]},
					 {model:Persona,as:'persona'}]
		}).then(function(usuarios){
			res.json(usuarios);
		});
	});
	
router.route('/cierre-usuario-ruta/usuario/:id_usuario/dia/:dia')
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
																 {model:Clase,as:'tipoPago'}]}]}]}]},
					  {model:Usuario,as:'usuario',
						include:[{model:PagoVenta,as:'pagos',where:{createdAt: {$between: [inicio,fin]}},required:false,
										include:[{model:Venta,as:'venta',
													include:[{model:Cliente,as:'cliente'}]}]}]}]
		}).then(function(rutas){			
			res.json(rutas);		  
		});
	});
}