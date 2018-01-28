module.exports=function(router,Tipo,Clase,Venta,DetalleVenta,Cliente,Almacen,Sucursal,Compra,DetalleCompra,Proveedor,
						Producto,Usuario,Movimiento,VentaReprogramacionPago,CompraReprogramacionPago){

router.route('/tipos/:nombre_corto')
	.get(function(req, res) {
		Tipo.find({ 
			where:{
				nombre_corto: req.params.nombre_corto
			},
			include: [{model:Clase,as: 'clases'}]
		}).then(function(entidad){			
			res.json(entidad);		  
		});
	});
	router.route('/tipos/:nombre_corto/empresa/:id_empresa')
	.get(function(req, res) {
		Tipo.find({ 
			where:{
				nombre_corto: req.params.nombre_corto,
				id_empresa:req.params.id_empresa
			},
			include: [{model:Clase,as: 'clases'}]
		}).then(function(entidad){			
			res.json(entidad);		  
		});
	});	
router.route('/clases/:nombre_corto')
	.get(function(req, res) {
		Clase.findAll({ 
			where:{
				nombre_corto: req.params.nombre_corto
			}
		}).then(function(entidad){			
			res.json(entidad);		  
		});
	});
	router.route('/clase/:nombre')
	.get(function(req, res) {
		Clase.find({ 
			where:{
				nombre: req.params.nombre
			}
		}).then(function(entidad){			
			res.json({clase:entidad});		  
		});
	});
	router.route('/paises/:nombre_corto')

		.get(function(req, res) {
			
				var condicion =  { $like: "%" +req.params.nombre_corto+ "%" }

			Clase.findAll({ 
				where:{
					nombre_corto: condicion
				}
			}).then(function(entidad){			
				res.json(entidad);		  
			});
		});	
router.route('/tipos')
	.get(function(req, res) {
		Tipo.findAll({
			include: [{model:Clase,as: 'clases'}]
		}).then(function(entity){			
			res.json(entity);
		});
	});
	
router.route('/tipos/:id_tipo')
	.put(function(req, res) {
		Tipo.update({
			nombre:req.body.nombre,
			nombre_corto:req.body.nombre_corto
		},{ 
			where: { id : req.params.id_tipo }
		}).then(function(tipoActualizado){
			req.body.clases.forEach(function(clase, index, array){
				if(clase.eliminado){
					Clase.destroy({ 
						where: { id : clase.id }
					}).then(function(claseEliminado){
							
					});
				}else{
					if(clase.id){
						Clase.update({
							nombre:clase.nombre,
							nombre_corto:clase.nombre_corto,
							habilitado:clase.habilitado
						},{ 
							where: { id : clase.id }
						}).then(function(claseActualizada){
								
						});
					}else{
						Clase.create({
							nombre:clase.nombre,
							nombre_corto:clase.nombre_corto,
							id_tipo:req.params.id_tipo,
							habilitado:clase.habilitado
						}).then(function(claseCreado){
							
						});
					}
				}
				
				if(index===(array.length-1)){
					res.json({message:"Actualizado satisfactoriamente!"});
				}
			});
		});
	});

router.route('/tipos/empresa/:id_empresa')
	.get(function(req, res) {
		var condicionTipo={id_empresa:null}
		if(req.params.id_empresa!=0){
			condicionTipo.id_empresa=req.params.id_empresa;
		}
		Tipo.findAll({
			where:condicionTipo,
			include: [{model:Clase,as: 'clases'}]
		}).then(function(entity){			
			res.json(entity);
		});
	});

router.route('/tipos/empresa')
	.post(function(req, res) {
		Tipo.create({
			nombre:req.body.nombre,
			nombre_corto:req.body.nombre_corto,
			id_empresa:req.body.id_empresa
		}).then(function(tipoCreado){			
			req.body.clases.forEach(function(clase, index, array){
				if(!clase.eliminado){
					Clase.create({
						nombre:clase.nombre,
						nombre_corto:clase.nombre_corto,
						id_tipo:tipoCreado.id
					}).then(function(instanceCreated){
						if(index===(array.length-1)){
							res.json(tipoCreado);
						}
					});
				}else{
					if(index===(array.length-1)){
						res.json(tipoCreado);
					}
				}
			});		  
		});
	});
	
router.route('/vencimientos-creditos/:id_empresa')
	.get(function(req, res) {
		Clase.find({
			where:{nombre:"VENCIMIENTO DE CRÉDITOS"},
			include:[{model:Tipo,as:'tipo',where:{id_empresa:req.params.id_empresa}}]
		}).then(function(diasVencimientoCreditos){
			var diasParametro=parseInt(diasVencimientoCreditos.nombre_corto);
			var fechaActual=new Date();
			Venta.findAll({
				where:{saldo:{$gt: 0},activa:true},
				include: [{model:VentaReprogramacionPago,as: 'ventaReprogramacionPagos'},
						{model:DetalleVenta,as: 'detallesVenta',
							include:[{model:Producto,as:'producto'}]},
						  {model:Clase,as: 'tipoPago',where:{nombre_corto:"CRE"}},
						  {model:Usuario,as: 'usuario'},
						  {model:Cliente,as: 'cliente'},
						  {model:Movimiento,as: 'movimiento',
							include:[{model:Clase,as:'clase'}]},
						  {model:Almacen,as: 'almacen',
							include: [{model:Sucursal,as: 'sucursal',
								where:{id_empresa:req.params.id_empresa}}]}],
				/*order: [ [ { model: PagoVenta, as: 'pagosVenta' }, 'createdAt' ,'DESC'] ]*/
				order: [ [ 'fecha' ,'asc'] ]
			}).then(function(ventas){
				var ventasFiltradas=[];
				if(ventas.length>0){
					ventas.forEach(function(venta, index, arrayP){
						var timeDiff = Math.abs(fechaActual.getTime() - venta.fecha.getTime());
						var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
						var diferencia=venta.dias_credito-diffDays;
						if(diferencia<=diasParametro){
							ventasFiltradas.push(venta);
						}
						if(index===(arrayP.length-1)){
							res.json(ventasFiltradas);
						}
					});
				}else{
					res.json(ventasFiltradas);		  
				}
			});
		});
	});
	
router.route('/vencimientos-deudas/:id_empresa')
	.get(function(req, res) {
		Clase.find({
			where:{nombre:"VENCIMIENTO DE DEUDAS"},
			include:[{model:Tipo,as:'tipo',where:{id_empresa:req.params.id_empresa}}]
		}).then(function(diasVencimientoDeudas){
			var diasParametro=parseInt(diasVencimientoDeudas.nombre_corto);
			var fechaActual=new Date();
			Compra.findAll({
				where:{saldo:{$gt: 0}},
				include: [{model:CompraReprogramacionPago,as: 'compraReprogramacionPagos'},
							{model:DetalleCompra,as: 'detallesCompra'},
						  //{model:PagoVenta,as: 'pagosVenta'},
						  {model:Clase,as: 'tipoPago',where:{nombre_corto:"CRE"}},
						  {model:Proveedor,as: 'proveedor'},
						  {model:Almacen,as: 'almacen',
							include: [{model:Sucursal,as: 'sucursal',
								where:{id_empresa:req.params.id_empresa}}]}],
				/*order: [ [ { model: PagoVenta, as: 'pagosVenta' }, 'createdAt' ,'DESC'] ]*/
				order: [ [ 'fecha' ,'asc'] ]
			}).then(function(compras){
				var comprasFiltradas=[];
				if(compras.length>0){
					compras.forEach(function(compra, index, arrayP){
						var timeDiff = Math.abs(fechaActual.getTime() - compra.fecha.getTime());
						var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
						var diferencia=compra.dias_credito-diffDays;
						if(diferencia<=diasParametro){
							comprasFiltradas.push(compra);
						}
						if(index===(arrayP.length-1)){
							res.json(comprasFiltradas);
						}
					});
				}else{
					res.json(comprasFiltradas);		  
				}
			});
		});
	});
}