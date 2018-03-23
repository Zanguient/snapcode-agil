module.exports=function(router,sequelize,Sequelize,Compra,Proveedor,Almacen,Sucursal,Empresa,Venta,Cliente,Movimiento,Clase,
						Inventario,Producto,DetalleVenta,DetalleCompra,Usuario,Diccionario,PagoVenta,Persona,VendedorVenta){

router.route('/reportes/libro-compras/:id_empresa/gestion/:gestion/mes/:mes')
	.get(/*ensureAuthorized,*/function(req, res) {
		var mes= new Date(req.params.gestion,parseInt(req.params.mes),0);
		var primerDia = new Date(req.params.gestion,parseInt(req.params.mes)-1,1,0,0,0);
		var ultimoDia = new Date(req.params.gestion,parseInt(req.params.mes)-1,mes.getDate(),23,59,59);
		Empresa.find({ 
			where:{
				id: req.params.id_empresa
			}
		}).then(function(empresa){			
			Compra.findAll({ 
				where:{
					fecha: {$between: [primerDia,ultimoDia]}
				},
				include: [{model:Proveedor,as: 'proveedor'},
						  {model:Almacen,as:'almacen',
							include:[{model:Sucursal,as:'sucursal',where:{id_empresa:req.params.id_empresa}}]}]
			}).then(function(compras){			
				res.json({compras:compras,empresa:empresa});		  
			});
		});
	});
	
router.route('/reportes/libro-ventas/:id_empresa/gestion/:gestion/mes/:mes')
	.get(/*ensureAuthorized,*/function(req, res) {
		var mes= new Date(req.params.gestion,parseInt(req.params.mes),0);
		var primerDia = new Date(req.params.gestion,parseInt(req.params.mes)-1,1,0,0,0);
		var ultimoDia = new Date(req.params.gestion,parseInt(req.params.mes)-1,mes.getDate(),23,59,59);
		Empresa.find({ 
			where:{
				id: req.params.id_empresa
			}
		}).then(function(empresa){			
			Venta.findAll({ 
				where:{
					fecha: {$between: [primerDia,ultimoDia]}
				},
				include: [{model:Cliente,as: 'cliente'},
						  {model:Movimiento,as:'movimiento',include:[{model:Clase,as:'clase',where:{nombre_corto:"FACT"}}]},
						  {model:Almacen,as:'almacen',
							include:[{model:Sucursal,as:'sucursal',where:{id_empresa:req.params.id_empresa}}]}]
			}).then(function(ventas){			
				res.json({ventas:ventas,empresa:empresa});		  
			});
		});
	});
	
router.route('/reportes/inventario/empresa/:id_empresa/sucursal/:id_sucursal/almacen/:id_almacen')
	.get(function(req, res) {
		var condicionSucursal={},condicionAlmacen={};
		if(req.params.id_sucursal!=0){
			condicionSucursal={id:req.params.id_sucursal}
		}
		if(req.params.id_almacen!=0){
			condicionAlmacen={id:req.params.id_almacen}
		}
		
		Inventario.findAll({
			where:{cantidad:{$gt:0}},
			include: [{model:Producto,as: 'producto',required:true},
					  {model:Almacen,as: 'almacen',where:condicionAlmacen,
									include: [{model:Sucursal,as: 'sucursal',where:condicionSucursal,
												include: [{model:Empresa,as: 'empresa',where:{id:req.params.id_empresa}}]}]}]
		}).then(function(inventarios){			
			res.json(inventarios);		  
		});
	});
router.route('/reportes/empresa/:id_empresa/sucursal/:id_sucursal/almacen/:id_almacen/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
	.get(function(req, res) {
		var condicionSucursal={},condicionAlmacen={};
		if(req.params.id_sucursal!=0){
			condicionSucursal={id:req.params.id_sucursal}
		}
		if(req.params.id_almacen!=0){
			condicionAlmacen={id:req.params.id_almacen}
		}		
		var condicionProducto="e.id="+req.params.id_empresa;		
		if(req.params.id_sucursal!=0){
			condicionProducto= condicionProducto+" and s.id ="+req.params.id_sucursal;		
		}
		if(req.params.id_almacen!=0){
			condicionProducto= condicionProducto+" and a.id ="+req.params.id_almacen;		
		}
		if(req.params.texto_busqueda!=0){
			condicionProducto=condicionProducto+" and (p.codigo like '%"+req.params.texto_busqueda+"%' or  p.nombre like '%"+req.params.texto_busqueda+"%' or p.unidad_medida like '%"+req.params.texto_busqueda+"%' or p.descripcion like '%"+req.params.texto_busqueda+"%' or gr.nombre like '%"+req.params.texto_busqueda+"%' or sgr.nombre like '%"+req.params.texto_busqueda+"%')";
		}
			condicionProducto= condicionProducto+" and i.cantidad != 0";		
		Inventario.findAndCountAll({		
			where:{cantidad:{$gt:0}},
			include: [{model:Producto,as: 'producto',required:true},
					  {model:Almacen,as: 'almacen',where:condicionAlmacen,
									include: [{model:Sucursal,as: 'sucursal',where:condicionSucursal,
												include: [{model:Empresa,as: 'empresa',where:{id:req.params.id_empresa}}]}]}],
			order:[['id','asc']]		
		}).then(function(data){		
			sequelize.query("SELECT i.id,p.codigo,i.cantidad,sgr.nombre as subgrupo ,gr.nombre as grupo,p.unidad_medida,p.precio_unitario,p.descripcion,p.inventario_minimo,p.caracteristica_especial1,p.caracteristica_especial2,p.codigo_fabrica, p.nombre,i.fecha_vencimiento,i.lote,i.costo_unitario,i.costo_total,a.nombre AS nombre_almacen,s.nombre AS nombre_sucursal\
							FROM inv_inventario AS i\
							INNER JOIN agil_producto AS p ON (i.producto = p.id)\
							INNER JOIN agil_almacen As a ON (i.almacen = a.id)\
							INNER JOIN agil_sucursal As s ON (a.sucursal = s.id)\
							INNER JOIN agil_empresa As e ON (s.empresa = e.id)\
							LEFT JOIN gl_clase As gr ON (p.grupo = gr.id)\
							LEFT JOIN gl_clase As sgr ON (p.subgrupo = sgr.id)\
							where "+condicionProducto+"\
			                order by "+req.params.columna+" "+req.params.direccion+" LIMIT "+(req.params.items_pagina*(req.params.pagina-1))+","+req.params.items_pagina)			
			.then(function(inventario){			
				res.json({inventario:inventario[0],paginas:Math.ceil(data.count/req.params.items_pagina)});		  
			});
		});
	});
	

router.route('/reportes/ventas-mensuales/:id_empresa/sucursal/:id_sucursal/inicio/:inicio/fin/:fin')
	.get(/*ensureAuthorized,*/function(req, res) {
		var inicio= new Date(req.params.inicio);inicio.setHours(0,0,0,0,0);
		var fin= new Date(req.params.fin);fin.setHours(23,0,0,0,0);
		var condicionVenta={id_empresa:req.params.id_empresa};
		if(req.params.id_sucursal!=0){
			 condicionVenta.id=req.params.id_sucursal;				
		}
		Empresa.find({ 
			where:{
				id: req.params.id_empresa
			}
		}).then(function(empresa){			
			DetalleVenta.findAll({ 
				include: [{model:Producto,as: 'producto',required:true,
							include:[{model:Clase,as:'grupo'},{model:Clase,as:'subgrupo'}]},
						  {model:Venta,as: 'venta',where:{fecha: {$between: [inicio,fin]},activa:true},
							include:[{model:Cliente,as: 'cliente',required:true},
									 {model:Usuario,as: 'usuario',required:true,attributes:['id','id_persona','id_empresa','nombre_usuario']},
									 {model:VendedorVenta,as: 'vendedor',required:false,
										include:[{model:Persona,as:'persona',required:false}]},
									 {model:Movimiento,as:'movimiento',include:[{model:Clase,as:'clase',where:{$or: [{nombre_corto:"FACT"}, {nombre_corto:"PFR"}]}}]},
									 {model:Almacen,as:'almacen',
										include:[{model:Sucursal,as:'sucursal',where:condicionVenta}]}]},
						  {model:Inventario,as: 'inventario'}],
				order: [ [ { model: Venta, as: 'venta' }, 'fecha' ,'ASC'] ]
			}).then(function(detallesVenta){
				//res.header('Content-Length', 1114566456456938848);			
				res.json({detallesVenta:JSON.stringify(detallesVenta),empresa:empresa});		  
			});
		});
	});

router.route('/reportes/compras-mensuales/:id_empresa/sucursal/:id_sucursal/inicio/:inicio/fin/:fin')
	.get(/*ensureAuthorized,*/function(req, res) {
		var inicio= new Date(req.params.inicio);inicio.setHours(0,0,0,0,0);
		var fin= new Date(req.params.fin);fin.setHours(23,0,0,0,0);
		var condicionCompra={id_empresa:req.params.id_empresa};
		if(req.params.id_sucursal!=0){
			 condicionCompra.id=req.params.id_sucursal;				
		}
		Empresa.find({ 
			where:{
				id: req.params.id_empresa
			}
		}).then(function(empresa){			
			DetalleCompra.findAll({ 
			include: [{model:Inventario,as: 'inventario'},
					  {model:Producto,as: 'producto',include:[{model:Clase,as: 'grupo'}]},
					  {model:Compra,as: 'compra',where:{fecha: {$between: [inicio,fin]}},
							include: [{model:Proveedor,as: 'proveedor'},
										{model:Almacen,as: 'almacen',
								include: [{model:Sucursal,as: 'sucursal',where:condicionCompra}]}]},
						{model:Clase,as: 'centroCosto'/*,where:{nombre_corto:'ALM'}*/}],
			order: [ [ { model: Compra, as: 'compra' }, 'fecha' ,'ASC'] ]
		}).then(function(detallesCompra){			
			res.json({detallesCompra:detallesCompra,empresa:empresa});		  
		});
		});
	});

router.route('/reportes/estado-resultados-no-contable/:id_empresa/inicio/:inicio/fin/:fin')
	.get(/*ensureAuthorized,*/function(req, res) {
		var inicio= new Date(req.params.inicio);inicio.setHours(0,0,0,0,0);
		var fin= new Date(req.params.fin);fin.setHours(23,0,0,0,0);
		var condicionVenta={fecha: {$between: [inicio,fin]},activa:true};
		Venta.findAll({ 
			where:condicionVenta,
			include: [{model:Movimiento,as: 'movimiento',
							include: [{model:DetalleMovimiento,as: 'detallesMovimiento'},
								      {model:Clase,as:'clase'}]},
					  {model:DetalleVenta,as: 'detallesVenta'},
					  {model:Clase,as: 'tipoPago'},
					  {model:Almacen,as: 'almacen',
							include: [{model:Sucursal,as: 'sucursal',
										include: [{model:Empresa,as: 'empresa',where:{id:req.params.id_empresa}}]}]}]
		}).then(function(entity){			
			res.json(entity);		  
		});
	});

router.route('/reportes/estado-cuentas-proveedores/:id_empresa')
	.get(function(req, res) {
		Proveedor.findAll({ 
			where:{id_empresa:req.params.id_empresa},
			include:[{model:Compra,as: 'compras',where:{'saldo': {$gt: 0}}}],
		}).then(function(entidad){			
			res.json(entidad);		  
		});
	});
	
router.route('/reportes/estado-cuentas-clientes/:id_empresa')
	.get(function(req, res) {
		Cliente.findAll({ 
			where:{id_empresa:req.params.id_empresa},
			include:[{model:Venta,as: 'ventas',where:{tipo_pago: '18','saldo': {$gt: 0},activa:true},
					include: [{model:Movimiento,as: 'movimiento',
							include: [{model:Clase,as:'clase'}]}]}],
		}).then(function(entidad){			
			res.json(entidad);		  
		});
	});


router.route('/reportes/estado-cuentas-clientes/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/cuentas-liquidadas/:cuentas_liquidadas')
	.get(function(req, res) {
		var condicionCliente={id_empresa:req.params.id_empresa/*,codigo:{$not:null}*/};
		var cuentasLiquidadas={saldo: {$gt: 0},activa:true};
		console.log(cuentasLiquidadas);
		if(req.params.cuentas_liquidadas !=0){		
			console.log("esto es:"+ req.params.cuentas_liquidadas)
			cuentasLiquidadas={saldo: {$eq: 0},activa:true};
			console.log(cuentasLiquidadas);
		}
		if(parseInt(req.params.texto_busqueda)){
			condicionCliente={id_empresa:req.params.id_empresa/*,codigo:{$not:null}*/,nit:parseInt(req.params.texto_busqueda)}
		}else if(req.params.texto_busqueda !=0){
			condicionCliente={id_empresa:req.params.id_empresa,/*codigo:{$not:null},*/
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
		
		Cliente.findAndCountAll({		  
			where:condicionCliente,
			include: [{model:Empresa,as: 'empresa'}],
			include:[{model:Venta,as: 'ventas',where:cuentasLiquidadas,
					include: [{model:Clase,as:'tipoPago',where:{nombre_corto: Diccionario.TIPO_PAGO_CREDITO}},
							{model:PagoVenta,as: 'pagosVenta'},
							{model:Almacen,as: 'almacen',include:[{model:Sucursal,as:'sucursal'}]},								
							{model:Movimiento,as: 'movimiento',							
							include: [{model:Clase,as:'clase'}]}]}],				
			order:[['id','asc']]
		}).then(function(data){
			var paginas=Math.ceil(data.count/req.params.items_pagina);
			var datosCliente={ 
				where:condicionCliente,
				include:[{model:Venta,as: 'ventas',where:cuentasLiquidadas,
					include: [{model:Clase,as:'tipoPago',where:{nombre_corto: Diccionario.TIPO_PAGO_CREDITO}},
								{model:PagoVenta,as: 'pagosVenta'},
								{model:Almacen,as: 'almacen',include:[{model:Sucursal,as:'sucursal'}]},								
								{model:Movimiento,as: 'movimiento',
									include: [{model:Clase,as:'clase'}]}]}],				
				order:[['id','asc']]
			}

			if(req.params.items_pagina!=0){
				datosCliente.offset=(req.params.items_pagina*(req.params.pagina-1));
				datosCliente.limit=req.params.items_pagina;
			}else{
				paginas=1;
			}


			Cliente.findAll(
				datosCliente
			).then(function(clientes){			
				res.json({clientes:clientes,paginas:paginas});		  
			});
		});
	});
}