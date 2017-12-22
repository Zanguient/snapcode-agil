module.exports=function(router,ensureAuthorizedAdministrador,fs,forEach,jwt,md5,CierreCaja,Clase,Sucursal,Usuario,
	Venta,DetalleVenta,Cliente,Almacen,Sucursal,PagoVenta,PagoCompra,Compra,Proveedor,sequelize,Banco,DetalleCompra,
	CajaSiguienteTurno,Diccionario,Producto,Inventario,Sequelize){
	
router.route('/cierres-caja/empresa/:id_empresa/:id_usuario')

    .get(function(req, res) {
    	var condicionUsuario={};
    	if(req.params.id_usuario!=0){
    		condicionUsuario={id:req.params.id_usuario}
    	}
		CierreCaja.findAll({ 
			include: [{model:Sucursal,as: 'sucursal',where:{id_empresa:req.params.id_empresa}},
					  {model:Clase,as:'destino'},
					  {model:Banco,as:'bancoDestino'},
					  {model:Usuario,as:'usuario',where:condicionUsuario},
					  {model:CajaSiguienteTurno,as:'cajasSiguienteTurnoCerradas',
							include:[{model:CierreCaja,as:'cierreCaja',
										include:[{model:Usuario,as:'usuario'}]}]}],
		    order:[['fecha']]
		}).then(function(entity){			
			res.json(entity);		  
		});
	});

router.route('/cierres-caja/empresa/:id_empresa/:id_usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/columna/:columna/direccion/:direccion')
	
		.get(function(req, res) {
			var condicion="sucursal.empresa="+req.params.id_empresa;
			if(req.params.id_usuario!=0){
				condicion=condicion+" AND usuario_condicion.id="+req.params.id_usuario;
				//condicionUsuario={id:req.params.id_usuario}
			}
	
			sequelize.query("select count(*) as cantidad_cierres \
			from agil_cierre_caja as cierre_caja\
			INNER JOIN agil_sucursal AS sucursal ON (cierre_caja.sucursal = sucursal.id)\
			INNER JOIN gl_clase AS destino ON (cierre_caja.destino = destino.id)\
			LEFT  JOIN agil_banco AS bancoDestino ON (cierre_caja.banco_destino = bancoDestino.id)\
			INNER JOIN sys_usuario AS usuario_condicion on (cierre_caja.usuario=usuario_condicion.id) where "+ condicion, { type: sequelize.QueryTypes.SELECT })
			.then(function (data) {
				var options = {
					model: CierreCaja,
					include: [{ model: Sucursal, as: 'sucursal' }]
				};
				Sequelize.Model.$validateIncludedElements(options);

				var paginacion="",paginas=1;
				if(req.params.items_pagina!=0){
					paginacion=" LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina;
					paginas=Math.ceil(data[0].cantidad_cierres / req.params.items_pagina);
				}

				sequelize.query("select cierre_caja.id, destino.nombre_corto as destino_nombre_corto, cierre_caja.fecha, sucursal.nombre as sucursal, usuario_condicion.nombre_usuario as usuario,usuario_condicion.id as id_usuario,cierre_caja.importe,destino.nombre as destino,bancoDestino.nombre as banco_destino,bancoDestino.numero as banco_destino_numero,cierre_caja.persona_destino, cierre_caja.importe_entrega,cierre_caja.fecha_entrega,cierre_caja.numero_documento\
				from agil_cierre_caja as cierre_caja\
				INNER JOIN agil_sucursal AS sucursal ON (cierre_caja.sucursal = sucursal.id)\
				INNER JOIN gl_clase AS destino ON (cierre_caja.destino = destino.id)\
				LEFT  JOIN agil_banco AS bancoDestino ON (cierre_caja.banco_destino = bancoDestino.id)\
				INNER JOIN sys_usuario AS usuario_condicion on (cierre_caja.usuario=usuario_condicion.id) where "+ condicion+"\
				order by "+ req.params.columna + " " + req.params.direccion +paginacion, options)
					.then(function (cierresCaja) {
						res.json({ cierresCaja: cierresCaja, paginas:paginas });
					});
			});
		});

router.route('/cierres-caja/empresa')

    .post(function(req, res) {
		CierreCaja.create({
			id_sucursal:req.body.id_sucursal,
			fecha:new Date(),
			id_usuario:req.body.id_usuario,
			importe:req.body.importe,
			id_destino:req.body.destino.id,
			saldo_inicial:req.body.saldo_inicial,
			gastos:req.body.gastos
		}).then(function(cierreCreado){
			if(req.body.destino.nombre_corto==Diccionario.DESTINO_CIERRE_SIGUIENTETURNO){
				CajaSiguienteTurno.create({
					id_sucursal:req.body.id_sucursal,
					id_cierre_caja:cierreCreado.id
				}).then(function(cajaSiguienteTurnoCreado){

				});
			}
			req.body.ventasContado.forEach(function (ventaContado, indexVentasContado, arrayVentasContado) {
				Venta.update({
					id_cierre_caja:cierreCreado.id
				},{
					where:{
						id:ventaContado.id
					}
				}).then(function(affvc){
					
				});
			});
			req.body.ventasCredito.forEach(function (ventaCredito, indexVentasCredito, arrayVentasCredito) {
				Venta.update({
					id_cierre_caja:cierreCreado.id
				},{
					where:{
						id:ventaCredito.id
					}
				}).then(function(affvc){
					
				});
			});	
			req.body.pagosVenta.forEach(function (pagoVenta, indexPagoVenta, arrayPagosVenta) {
				PagoVenta.update({
					id_cierre_caja:cierreCreado.id
				},{
					where:{
						id:pagoVenta.id
					}
				}).then(function(affvc){
					
				});
			});	
			req.body.pagosCompra.forEach(function (pagoCompra, indexPagoCompra, arrayPagosCompra) {
				PagoCompra.update({
					id_cierre_caja:cierreCreado.id
				},{
					where:{
						id:pagoCompra.id
					}
				}).then(function(affvc){
					
				});
			});
			req.body.comprasContado.forEach(function (compraContado, indexComprasContado, arrayComprasContado) {
				Compra.update({
					id_cierre_caja:cierreCreado.id
				},{
					where:{
						id:compraContado.id
					}
				}).then(function(affvc){
					
				});
			});
			req.body.comprasCredito.forEach(function (compraCredito, indexVentasCredito, arrayVentasCredito) {
				Compra.update({
					id_cierre_caja:cierreCreado.id
				},{
					where:{
						id:compraCredito.id
					}
				}).then(function(affvc){
					
				});
			});	
			req.body.cierresPendientes.forEach(function (cierrePendiente, indexCierrePendiente, arrayCierrePendiente) {
				CajaSiguienteTurno.update({
					id_cierre_caja_cerrado:cierreCreado.id
				},{
					where:{
						id:cierrePendiente.id
					}
				}).then(function(affvc){
					
				});
			});	

			res.json(cierreCreado);
		});
    });

		
router.route('/cierres-caja/:id_cierre')
	.get(function(req, res) {
		CierreCaja.find({ 
			where:{
				id:req.params.id_cierre
			},
			include: [{model:Sucursal,as: 'sucursal'},
					  {model:Clase,as:'destino'},
					  {model:Banco,as:'bancoDestino'},
					  {model:Usuario,as:'usuario'},
					  {model:CajaSiguienteTurno,as:'cajasSiguienteTurnoCerradas',
							include:[{model:CierreCaja,as:'cierreCaja',
										include:[{model:Usuario,as:'usuario'}]}]}]
		}).then(function(entity){			
			res.json(entity);		  
		});
	})
	
	.put(function(req, res) {
		CierreCaja.update({
			id_banco_destino:(req.body.bancoDestino?req.body.bancoDestino.id:null),
			persona_destino:req.body.persona_destino,
			importe_entrega:req.body.importe_entrega,
			fecha_entrega:req.body.fecha_entrega,
			numero_documento:req.body.numero_documento
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

router.route('/ventas-contado/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			var condicionVenta = { /*fecha: { $between: [inicio, fin] },*/ 
								   id_usuario: req.params.id_usuario, 
								   activa: true,
								   id_cierre_caja:(req.params.id_cierre_caja==0?null:req.params.id_cierre_caja) };
			Venta.findAll({
				where: condicionVenta,
				include: [{ model: DetalleVenta, as: 'detallesVenta',
							include:[{model:Producto,as:'producto',
										include:[{model:Inventario,as:'inventarios',required:false,
													include:[{model:Almacen,as:'almacen',
																include:[{model:Sucursal,as:'sucursal',required:false,
																			where: { id: { $in: req.params.idsSucursales.split(',') } }}]}]}]}] },
				{ model: Clase, as: 'tipoPago', where: { nombre_corto: "CONT" } },
				{ model: Cliente, as: 'cliente' },
				{
					model: Almacen, as: 'almacen',
					include: [{
						model: Sucursal, as: 'sucursal',
						where: { id: { $in: req.params.idsSucursales.split(',') } }
					}]
				}]
			}).then(function (entity) {
				res.json(entity);
			});
		});

router.route('/compras-contado/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			var condicionCompra = { /*fecha: { $between: [inicio, fin] },*/ 
								   id_usuario: req.params.id_usuario, 
								   id_cierre_caja:(req.params.id_cierre_caja==0?null:req.params.id_cierre_caja) };
			Compra.findAll({
				where: condicionCompra,
				include: [{ model: DetalleCompra, as: 'detallesCompra',
							include:[{model:Producto,as:'producto',
										include:[{model:Inventario,as:'inventarios',required:false,
													include:[{model:Almacen,as:'almacen',
																include:[{model:Sucursal,as:'sucursal',required:false,
																			where: { id: { $in: req.params.idsSucursales.split(',') } }}]}]}]}] },
				{ model: Clase, as: 'tipoPago', where: { nombre_corto: "CONT" } },
				{ model: Proveedor, as: 'proveedor' },
				{
					model: Almacen, as: 'almacen',
					include: [{
						model: Sucursal, as: 'sucursal',
						where: { id: { $in: req.params.idsSucursales.split(',') } }
					}]
				}]
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/ventas-credito/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);

			var condicionVenta = { /*fecha: { $between: [inicio, fin] },*/ 
									id_usuario: req.params.id_usuario, 
									activa: true,
									a_cuenta:{$gt:0},
									id_cierre_caja:(req.params.id_cierre_caja==0?null:req.params.id_cierre_caja)/*,
									id:$notIn:*/ };

			Venta.findAll({
				where: condicionVenta,
				include: [{ model: DetalleVenta, as: 'detallesVenta',
							include:[{model:Producto,as:'producto',
										include:[{model:Inventario,as:'inventarios',required:false,
													include:[{model:Almacen,as:'almacen',
																include:[{model:Sucursal,as:'sucursal',required:false,
																			where: { id: { $in: req.params.idsSucursales.split(',') } }}]}]}]}] },
				{ model: PagoVenta, as: 'pagosVenta'},
				{ model: Clase, as: 'tipoPago', where: { nombre_corto: "CRE" } },
				{ model: Cliente, as: 'cliente' },
				{
					model: Almacen, as: 'almacen',
					include: [{
						model: Sucursal, as: 'sucursal',
						where: { id: { $in: req.params.idsSucursales.split(',') } }
					}]
				}],
				order: [[{ model: PagoVenta, as: 'pagosVenta' }, 'createdAt', 'ASC']]
			}).then(function (entity) {
				res.json(entity);
			});
		});

router.route('/compras-credito/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);

			var condicionCompra = { /*fecha: { $between: [inicio, fin] },*/ 
									id_usuario: req.params.id_usuario, 
									a_cuenta:{$gt:0},
									id_cierre_caja:(req.params.id_cierre_caja==0?null:req.params.id_cierre_caja)/*,
									id:$notIn:*/ };

			Compra.findAll({
				where: condicionCompra,
				include: [{ model: DetalleCompra, as: 'detallesCompra',
							include:[{model:Producto,as:'producto',
										include:[{model:Inventario,as:'inventarios',required:false,
													include:[{model:Almacen,as:'almacen',
																include:[{model:Sucursal,as:'sucursal',required:false,
																			where: { id: { $in: req.params.idsSucursales.split(',') } }}]}]}]}] },
				{ model: PagoCompra, as: 'pagosCompra'},
				{ model: Clase, as: 'tipoPago', where: { nombre_corto: "CRE" } },
				{ model: Proveedor, as: 'proveedor' },
				{
					model: Almacen, as: 'almacen',
					include: [{
						model: Sucursal, as: 'sucursal',
						where: { id: { $in: req.params.idsSucursales.split(',') } }
					}]
				}],
				order: [[{ model: PagoCompra, as: 'pagosCompra' }, 'createdAt', 'ASC']]
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/pagos-venta/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 59, 0, 0, 0);
			PagoVenta.findAll({
				where: { /*createdAt: { $between: [inicio, fin] },*/
						id_usuario: req.params.id_usuario,
						id_cierre_caja:(req.params.id_cierre_caja==0?null:req.params.id_cierre_caja) },
				include: [{
					model: Venta, as: 'venta',
					include: [{ model: Cliente, as: 'cliente' }, {
						model: Almacen, as: 'almacen',
						include: [{
							model: Sucursal, as: 'sucursal',
							where: { id: { $in: req.params.idsSucursales.split(',') } }
						}]
					}]
				}]
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/pagos-compra/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja')
		.get(/*ensureAuthorized,*/function (req, res) {
			var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			var fin = new Date(req.params.fin); fin.setHours(23, 59, 0, 0, 0);
			PagoCompra.findAll({
				where: { /*createdAt: { $between: [inicio, fin] },*/
						id_usuario: req.params.id_usuario,
						id_cierre_caja:(req.params.id_cierre_caja==0?null:req.params.id_cierre_caja) },
				include: [{
					model: Compra, as: 'compra',
					include: [{ model: Proveedor, as: 'proveedor' }, {
						model: Almacen, as: 'almacen',
						include: [{
							model: Sucursal, as: 'sucursal',
							where: { id: { $in: req.params.idsSucursales.split(',') } }
						}]
					}]
				}]
			}).then(function (entity) {
				res.json(entity);
			});
		});

	router.route('/cierre-caja-pendiente/:idsSucursales')
		.get(/*ensureAuthorized,*/function (req, res) {
			CajaSiguienteTurno.findAll({
				where: { id_sucursal: { $in: req.params.idsSucursales.split(',') },
						 id_cierre_caja_cerrado:null
						 },
				include: [{model: CierreCaja, as: 'cierreCaja',
							include:[{model:Usuario,as:'usuario'}]}]
			}).then(function (entity) {
				res.json(entity);
			});
		});
	
}