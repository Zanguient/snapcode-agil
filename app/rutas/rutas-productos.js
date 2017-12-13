module.exports=function(router,forEach,decodeBase64Image,fs,Empresa,Producto,Proveedor,Cliente,Clase,Inventario,ComisionVendedorProducto,
						Usuario,DetalleVenta,DetalleMovimiento,Movimiento,Venta,Compra,DetalleCompra,Almacen,Sucursal,signs3,Tipo,ProductoBase,sequelize,
					ContabilidadCuenta){
	
router.route('/productos')
    .post(function(req, res) {
		Producto.create({
			id_empresa:req.body.id_empresa,
			nombre:req.body.nombre,
			codigo:req.body.codigo,
			unidad_medida:req.body.unidad_medida,
			precio_unitario:req.body.precio_unitario,
			utilidad_esperada:req.body.utilidad_esperada,
			inventario_minimo:req.body.inventario_minimo,
			descripcion:req.body.descripcion,
			grupo:req.body.grupo,
			subgrupo:req.body.subgrupo,
			caracteristica_especial1:req.body.caracteristica_especial1,
			caracteristica_especial2:req.body.caracteristica_especial2,
			codigo_fabrica:req.body.codigo_fabrica,
			comision:req.body.comision,
			publicar_panel:req.body.publicar_panel,
			alerta:req.body.alerta,
			descuento:req.body.descuento,
			descuento_fijo:req.body.descuento_fijo,
			id_tipo_producto:req.body.tipoProducto.id,
			activar_inventario:req.body.activar_inventario,
			marca:req.body.marca,
			modelo:req.body.modelo,
			anio:req.body.anio,
			id_almacen_erp:(req.body.almacenErp?req.body.almacenErp.id:null),
			id_cuenta:(req.body.cuenta?req.body.cuenta.id:null)
		}).then(function(productoCreado){
			req.body.productosBase.forEach(function(productoBase, index, array){
				if(!productoBase.eliminado){
					ProductoBase.create({
						id_producto:productoCreado.id,
						id_producto_base:productoBase.productoBase.id,						
						formulacion:productoBase.productoBase.formulacion						
					}).then(function(ProductoBaseCreado){
						
					});
				}
			});
			
			Clase.find({
				where:{nombre_corto:'OAL'}
			}).then(function(clase){
				if(clase.nombre=="ONLINE"){
					var imagen;
					if(req.body.imagen.indexOf('default') > -1){
						actualizarImagenProducto(productoCreado,req,res,null,req.body.imagen);
					}else{
						signs3('agil_imagenes/producto-'+productoCreado.id+'.jpg','image/jpeg',function(signedRequest,url){
							actualizarImagenProducto(productoCreado,req,res,signedRequest,url);
						});
					}
				}else{
					var imagen;
					if(req.body.imagen.indexOf('default') > -1){
						imagen=req.body.imagen;
					}else{
						var imagenProducto=decodeBase64Image(req.body.imagen);
						fs.writeFileSync('./img/producto-'+productoCreado.id+'.jpg', imagenProducto.data, 'base64', function(err) { });
						imagen='img/producto-'+productoCreado.id+'.jpg';
					}
					actualizarImagenProducto(productoCreado,req,res,null,imagen);
				}
			});
		});
    });
	
router.route('/productos/empresa/:id_empresa')
	.get(function(req, res) {
		Producto.findAll({
			where:{id_empresa:req.params.id_empresa,codigo:{$not:null}},
			include: [{model:Empresa,as: 'empresa'}],
			order:[['codigo','ASC']]
		}).then(function(resp){			
			res.json(resp);		  
		});
	});
router.route('/productos/kardex/:id_producto/almacen/:id_almacen/fecha-inicial/:fecha_inicio/fecha-final/:fecha_fin/lote/:lote')
	.get(function(req, res) {
		var fechaInicial=req.params.fecha_inicio==0?new Date(2016,0,1,0,0,0):new Date(req.params.fecha_inicio);
		var fechaFinal=req.params.fecha_fin==0?new Date():new Date(req.params.fecha_fin);
		var condicionInventario={};
		if(req.params.lote!="0"){
			condicionInventario={lote:req.params.lote}
		}
		DetalleMovimiento.findAll({
			where:{id_producto:req.params.id_producto},
			include:[{model:Inventario,as:'inventario',where:condicionInventario},
					 {model:Movimiento,as:'movimiento',
					 		where:{
									id_almacen:req.params.id_almacen,
								    fecha: { $between: [fechaInicial, fechaFinal] }},
							include:[{model:Compra,as:'compra',
										include:[{model:Proveedor,as:'proveedor'}]},
									{model:Venta,as:'venta',
										include:[{model:Cliente,as:'cliente'}]},
									{model:Almacen,as:'almacen',
													include:[{model:Sucursal,as:'sucursal'}]},
									{model:Tipo,as:'tipo'},
									{model:Clase,as:'clase'}]}],
			order:[[{ model: Movimiento, as: 'movimiento' }, 'fecha' ,'ASC'] ]
		}).then(function(productos){			
				res.json(productos);
		});
	});
	
router.route('/productos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
	.get(function(req, res) {
		var condicionProducto={id_empresa:req.params.id_empresa/*,codigo:{$not:null}*/};
		if(req.params.texto_busqueda!=0){
			condicionProducto={id_empresa:req.params.id_empresa,/*codigo:{$not:null},*/
				$or: [
						{
						  codigo: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  nombre: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  unidad_medida: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  descripcion: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  grupo: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  subgrupo: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						},
						{
						  codigo_fabrica: {
							$like: "%"+req.params.texto_busqueda+"%"
						  }
						}
					  ]
				};
		}
		Producto.findAndCountAll({ 
			where:condicionProducto,
			include: [{model:Empresa,as: 'empresa'},
					  {model:Clase,as: 'tipoProducto'},
					  {model:ProductoBase,as: 'productosBase',
					  include:[{model:Producto,as:'productoBase'}]}],
			order:[['nombre','asc']]
		}).then(function(data){
			Producto.findAll({ 
				offset:(req.params.items_pagina*(req.params.pagina-1)), limit:req.params.items_pagina,
				where:condicionProducto,
				include: [{model:Empresa,as: 'empresa'},
						  {model:Clase,as: 'tipoProducto'},
						  {model:Almacen,as: 'almacenErp',
								include:[{model:Sucursal,as: 'sucursal'},]},
						  {model:ContabilidadCuenta,as: 'cuenta'},
					  	  {model:ProductoBase,as: 'productosBase',
					   	  include:[{model:Producto,as:'productoBase'}]}],
				order:[[req.params.columna,req.params.direccion]]
			}).then(function(productos){			
				res.json({productos:productos,paginas:Math.ceil(data.count/req.params.items_pagina)});		  
			});
		});
	});
	
router.route('/productos/empresa')
	.post(function(req, res) {
		Clase.find({
			where:{nombre_corto:'PBASE'}
		}).then(function(clase){
			req.body.productos.forEach(function(producto, index, array){
				Producto.find({ 
					where:{
						$or: [{codigo:producto.codigo}/*, {codigo_fabrica:producto.codigo_fabrica}*/]
					},
				}).then(function(productoEncontrado){			
					if(productoEncontrado){
						Producto.update({
							nombre:producto.nombre,
							codigo:producto.codigo,
							unidad_medida:producto.unidad_medida,
							precio_unitario:producto.precio_unitario,
							utilidad_esperada:producto.utilidad_esperada,
							inventario_minimo:producto.inventario_minimo,
							descripcion:producto.descripcion,
							grupo:producto.grupo,
							subgrupo:producto.subgrupo,
							caracteristica_especial1:producto.caracteristica_especial1,
							caracteristica_especial2:producto.caracteristica_especial2,
							imagen:'./img/icon-producto-default.png',
							codigo_fabrica:producto.codigo_fabrica,
							comision:producto.comision,
							alerta:producto.alerta,
							descuento:producto.descuento,
							descuento_fijo:producto.descuento_fijo
						},{
							where:{
								id:productoEncontrado.id
							}
						}).then(function(productoCreado){
							if(index===(array.length-1)){
								res.json({mensaje:"¡Datos de Productos actualizados satisfactoriamente!"});
							}
						});
					}else{
						Producto.create({
							id_empresa:req.body.id_empresa,
							nombre:producto.nombre,
							codigo:producto.codigo,
							unidad_medida:producto.unidad_medida,
							precio_unitario:producto.precio_unitario,
							utilidad_esperada:producto.utilidad_esperada,
							inventario_minimo:producto.inventario_minimo,
							descripcion:producto.descripcion,
							grupo:producto.grupo,
							subgrupo:producto.subgrupo,
							caracteristica_especial1:producto.caracteristica_especial1,
							caracteristica_especial2:producto.caracteristica_especial2,
							imagen:'./img/icon-producto-default.png',
							codigo_fabrica:producto.codigo_fabrica,
							comision:producto.comision,
							alerta:producto.alerta,
							descuento:producto.descuento,
							descuento_fijo:producto.descuento_fijo,
							id_tipo_producto:clase.id
						}).then(function(productoCreado){
							if(index===(array.length-1)){
								res.json({mensaje:"Productos creados satisfactoriamente!"});
							}
						});
					}	  
				});
			});
		});
    });
	
router.route('/productos/:id_producto')
	.put(function(req, res) {
		Producto.update({
			id_empresa:req.body.id_empresa,
			nombre:req.body.nombre,
			codigo:req.body.codigo,
			unidad_medida:req.body.unidad_medida,
			precio_unitario:req.body.precio_unitario,
			utilidad_esperada:req.body.utilidad_esperada,
			inventario_minimo:req.body.inventario_minimo,
			descripcion:req.body.descripcion,
			grupo:req.body.grupo,
			subgrupo:req.body.subgrupo,
			caracteristica_especial1:req.body.caracteristica_especial1,
			caracteristica_especial2:req.body.caracteristica_especial2,
			//imagen:imagen,
			codigo_fabrica:req.body.codigo_fabrica,
			comision:req.body.comision,
			publicar_panel:req.body.publicar_panel,
			alerta:req.body.alerta,
			descuento:req.body.descuento,
			descuento_fijo:req.body.descuento_fijo,
			id_tipo_producto:req.body.tipoProducto.id,
			activar_inventario:req.body.activar_inventario,
			marca:req.body.marca,
			modelo:req.body.modelo,
			anio:req.body.anio,
			id_almacen_erp:(req.body.almacenErp?req.body.almacenErp.id:null),
			id_cuenta:(req.body.cuenta?req.body.cuenta.id:null)
		},{
			where:{
				id:req.params.id_producto
			}
		}).then(function(productoCreado){
			req.body.productosBase.forEach(function(productoBase, index, array){
				if(productoBase.eliminado){
					ProductoBase.destroy({ 
						where: { id : productoBase.id }
					}).then(function(productoBaseEliminado){
							
					});
				}else{
					if(productoBase.id){
						ProductoBase.update({
								id_producto:productoCreado.id,
								id_producto_base:productoBase.productoBase.id,
								formulacion:productoBase.productoBase.formulacion		
						},{ 
							where: { id : productoBase.id }
						}).then(function(productoBaseActualizado){
								
						});
					}else{
						ProductoBase.create({
							id_producto:req.params.id_producto,
							id_producto_base:productoBase.productoBase.id,
							formulacion:productoBase.productoBase.formulacion		
						}).then(function(productoBaseCreado){
							
						});
					}
				}
			});
			Clase.find({
				where:{nombre_corto:'OAL'}
			}).then(function(clase){
				if(clase.nombre=="ONLINE"){
					if((req.body.imagen.indexOf('default') > -1 || req.body.imagen.indexOf("producto-"+req.body.id) > -1 || req.body.imagen.indexOf(req.body.id) > -1) && req.body.imagen.length<200){
						actualizarImagenProducto(req.body,req,res,null,req.body.imagen);
					}else{
						signs3('agil_imagenes/producto-'+req.body.id+'.jpg','image/jpeg',function(signedRequest,url){
							actualizarImagenProducto(req.body,req,res,signedRequest,url);
						});
					}
				}else{
					if((req.body.imagen.indexOf('default') > -1 || req.body.imagen.indexOf("persona-"+req.body.id) > -1 || req.body.imagen.indexOf(req.body.id) > -1) && req.body.imagen.length<200){
						actualizarImagenProducto(req.body,req,res,null,req.body.imagen);
					}else{
						var imgPerson=decodeBase64Image(req.body.imagen);
						fs.writeFileSync('./img/producto-'+req.body.id+'.jpg', imgPerson.data, 'base64', function(err) { });
						var imagen='img/producto-'+req.body.id+'.jpg';
						actualizarImagenProducto(req.body,req,res,null,imagen);
					}
				}
			});
		});
	})
	
	.delete(function(req, res) {
		DetalleMovimiento.find({where:{
			id_producto:req.params.id_producto
		},
		}).then(function(detalleMovimientoProducto){	
			if (!detalleMovimientoProducto) {
				Producto.destroy({ 
				where:{
					id: req.params.id_producto
				}
				}).then(function(affectedRows){		
					res.json({message:"Eliminado Satisfactoriamente!"});
				});
			}else{
				res.json({movimiento:detalleMovimientoProducto,message:"Atencion no se puede eliminar este item porque tiene movimientos!"});
			}
			
		})
		
	});
	
function actualizarImagenProducto(productoCreado,req,res,signedRequest,imagen){
	Producto.update({
		imagen:imagen
	},{
		where:{id:productoCreado.id}
	}).then(function(affecteedRows){
		res.json({producto:productoCreado,url:imagen,signedRequest:signedRequest,image_name:'producto-'+productoCreado.id+'.jpg'});
	});
}
	
router.route('/productos/empresa/:id_empresa/cliente/:id_cliente/texto/:texto/sucursales/:ids')
	.get(function(req, res) {
		var condicionProducto={id_empresa:req.params.id_empresa};
		if(req.params.texto!=0){
			condicionProducto={id_empresa:req.params.id_empresa,$or: [{nombre:{$like:'%'+req.params.texto+'%'}},{codigo:req.params.texto},{descripcion:{$like:'%'+req.params.texto+'%'}}]};
		}
		
		Producto.findAll({
			where: condicionProducto,
			include:[{model:DetalleVenta,as:'detallesVenta',
						include:[{model:Venta,as:'venta',where:{id_cliente:req.params.id_cliente}}]},
					 {model:Clase,as:'tipoProducto'},
				     {model:Inventario,as:'inventarios',where:{id_almacen:{$not:null}},required:false,
						include:[{model:Almacen,as:'almacen',where:{id_sucursal:{$in:req.params.ids.split(',')}}}]}],
			order: [['nombre' ,'ASC']]
		}).then(function(productos){
			productos=(productos)?productos:[];
			var ids=[];
			for(var i=0;i<productos.length;i++){
				ids.push(productos[i].id);;
			}
			var condicionProductosRestantes;
			condicionProductosRestantes=(ids.length>0)?{id:{$notIn:ids},id_empresa:req.params.id_empresa}:{};
			if(req.params.texto!=0 && ids.length>0){
				condicionProductosRestantes={id:{$notIn:ids},id_empresa:req.params.id_empresa,$or: [{nombre:{$like:'%'+req.params.texto+'%'}},{codigo:req.params.texto},{descripcion:{$like:'%'+req.params.texto+'%'}}]}
			}else if(req.params.texto!=0 && ids.length==0){
				condicionProductosRestantes={id_empresa:req.params.id_empresa,$or: [{nombre:{$like:'%'+req.params.texto+'%'}},{codigo:req.params.texto},{descripcion:{$like:'%'+req.params.texto+'%'}}]}
			}
			Producto.findAll({
				where:condicionProductosRestantes,
				include:[{model:Inventario,as:'inventarios',where:{id_almacen:{$not:null}},required:false,
							include:[{model:Almacen,as:'almacen',where:{id_sucursal:{$in:req.params.ids.split(',')}}}]},
						 {model:Clase,as:'tipoProducto'}],
				order: [['nombre' ,'ASC']]
			}).then(function(productosRestantes){
				productos=productos.concat(productosRestantes);
				res.json(productos);
			});
		});
	});
	
router.route('/productos-panel/empresa/:id_empresa/almacen/:id_almacen')
	.get(function(req, res) {
		Producto.findAll({ 
			where: {id_empresa:req.params.id_empresa,publicar_panel:true},
			include:[{model:Inventario,as:'inventarios',where:{id_almacen:req.params.id_almacen,cantidad:{$gt: 0}},required:false},
				     {model:Clase,as:'tipoProducto'},
					 {model:ProductoBase,as:'productosBase',
						include:[{model:Producto,as:'productoBase',
							include:[{model:Inventario,as:'inventarios',where:{id_almacen:req.params.id_almacen,cantidad:{$gt: 0}},required:false},
									 {model:Clase,as:'tipoProducto'},
									 {model:ProductoBase,as:'productosBase',
										include:[{model:Producto,as:'productoBase',
											include:[{model:Inventario,as:'inventarios',where:{id_almacen:req.params.id_almacen,cantidad:{$gt: 0}},required:false},
													 {model:Clase,as:'tipoProducto'}]}]}]}]}],
			order: [ [ { model: Inventario, as: 'inventarios' }, 'updatedAt' ,'DESC'] ]
		}).then(function(productos){
			res.json(productos);		  
		});
	});
	
router.route('/comision-productos-vendedor/empresa/:id_empresa/usuario/:id_usuario')
	.get(function(req, res) {
		obtenerComisionesProductoVendedor(req,res,true);
	})
	
	.put(function(req, res) {
		Usuario.update({
			comision_general:req.body.comision_general,
			comision_activa:req.body.comision_activa,
		},{
			where:{id:req.params.id_usuario}
		}).then(function(usuarioActualizado){
			req.body.productos.forEach(function(producto,index,array){
				ComisionVendedorProducto.update({
					comision:producto.comisionesVendedores[0].comision
				},{
					where:{id:producto.comisionesVendedores[0].id}
				}).then(function(comisionesVendedor){
					if(index===(array.length-1)){
						res.json({mensaje:"Comisiones de Productos actualizados satisfactoriamente!"});
					}
				});
			});
		});
	});
	
function obtenerComisionesProductoVendedor(req,res,verificar){
	var configuracionesPremisa=obtenerComisionesProductoPremisa(req,true);
	configuracionesPremisa.then(function(entities){	
		if(entities.length>0){
			if(verificar){
				verificarProductosFaltantes(req,res,entities);
			}else{
				devolverComisiones(entities,res);	
			}
		}else{
			crearComisionesProductoVendedor(req,res);
		}
	});
}

function obtenerComisionesProductoPremisa(req,required){
	return Producto.findAll({
		where:{id_empresa:req.params.id_empresa},
		include: [{model:ComisionVendedorProducto,as: 'comisionesVendedores',where:{id_usuario:req.params.id_usuario},required:required}]
	});
}

function verificarProductosFaltantes(req,res,originalEntities){
	var productIds=[];
	for(var i=0;i<originalEntities.length;i++){
		productIds.push(originalEntities[i].id);
	}
	Producto.findAll({
		where:{id_empresa:req.params.id_empresa,id:{$notIn: productIds}}
	}).then(function(productosFaltantes){
		if(productosFaltantes.length>0){
			for(var i=0;i<productosFaltantes.length;i++){
				productosFaltantes[i]=productosFaltantes[i].id;
			}
			crearComisionesVendedor(req,res,productosFaltantes);
		}else{
			devolverComisiones(originalEntities,res)
		}
	});
}

function devolverComisiones(entities,res){
	res.json(entities);
}

function crearComisionesProductoVendedor(req,res){
	Producto.findAll({
		where:{
			id_empresa:req.params.id_empresa
		}
	}).then(function(productos){
		productos.forEach(function(producto, index, array){
			ComisionVendedorProducto.create({
				id_producto:producto.id,
				id_usuario:req.params.id_usuario
			}).then(function(score){
				if(index===(array.length-1)){
					obtenerComisionesProductoVendedor(req,res,false);
				}
			});
		});
	});
}

function crearComisionesVendedor(req,res,ids){
	Producto.findAll({
		where:{
			id:{$in:ids}
		}
	}).then(function(productos){
		productos.forEach(function(producto, index, array){
			ComisionVendedorProducto.create({
				id_producto:producto.id,
				id_usuario:req.params.id_usuario
			}).then(function(score){
				if(index===(array.length-1)){
					obtenerComisionesProductoVendedor(req,res,false);
				}
			});
		});
	});
}

router.route('/vencimientos-productos/:id_empresa')
	.get(function(req, res) {
		Clase.find({
			where:{nombre:"VENCIMIENTO DE PRODUCTOS"},
			include:[{model:Tipo,as:'tipo',where:{id_empresa:req.params.id_empresa}}]
		}).then(function(diasVencimientoDeudas){
			var diasParametro=parseInt(diasVencimientoDeudas.nombre_corto);
			var fechaActual=new Date();
			Inventario.findAll({
				where:{fecha_vencimiento:{$not:null},cantidad:{$gt: 0}},
				include: [{model:Producto,as: 'producto',where:{id_empresa:req.params.id_empresa},
							include:[{model:Clase,as:'tipoProducto'}]},
						  {model:Almacen,as: 'almacen',
							include: [{model:Sucursal,as: 'sucursal'}]}],
				order: [ [ 'fecha_vencimiento' ,'asc'] ]
			}).then(function(inventarios){
				var inventariosFiltrados=[];
				if(inventarios.length>0){
					inventarios.forEach(function(inventario, index, arrayP){
						var timeDiff = Math.abs(fechaActual.getTime() - inventario.fecha_vencimiento.getTime());
						var diferencia = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
						if(diferencia<=diasParametro){
							inventariosFiltrados.push(inventario);
						}
						if(index===(arrayP.length-1)){
							res.json(inventariosFiltrados);
						}
					});
				}else{
					res.json(inventariosFiltrados);		  
				}
			});
		});
	});
	
router.route('/producto/empresa/:id_empresa/siguiente-codigo')
	.get(function(req, res) {
		sequelize.query("SELECT MAX(CAST(SUBSTRING(codigo, 3, 5) AS UNSIGNED)) as ultimo_codigo FROM agil_producto where empresa="+req.params.id_empresa, { type: sequelize.QueryTypes.SELECT})
		  .then(function(dato) {
			res.json(dato[0]);;
		  });
	});
	
	
}