module.exports=function(router,forEach,fs,sequelize,Empresa,Dosificacion,SucursalActividadDosificacion,
						Sucursal,Clase,Mesa,Sala,PedidoRestaurante,MesaPedidoRestaurante,DetallePedidoRestaurante,
					Producto,Inventario,Tipo,Movimiento,DetalleMovimiento,Garzon,Persona,decodeBase64Image,
				GarzonPedidoRestaurante){
	
router.route('/sala/sucursal/:id_sucursal')
	.get(function(req, res) {
		Sala.findAll({
			where:{
				id_sucursal:req.params.id_sucursal
			},
			include: [{model: Mesa, as: 'mesas',
				include: [{model: Clase, as: 'estado'}]
			}]	
		})
		.then(function (salas){
			res.json(salas);
		});
	});

router.route('/inactivacion-pedido-restaurante/:id')
	.put(function(req, res) {
		MesaPedidoRestaurante.update({
			pedido_activo:false
		},
		{
			where:{
				id_pedido_restaurante:req.params.id
			}
		})
		.then(function (affete){
			res.json({mendaje:"Pedido desactivado satisfactoriamente!"});
		});
	});

router.route('/pedido-restaurante/mesa/:id_mesa/almacen/:id_almacen')
	.get(function(req, res) {
		Mesa.find({
			where:{
				id:req.params.id_mesa
			},
			include:[{model:MesaPedidoRestaurante,as:'pedidosRestaurante',
						where:{
							pedido_activo:true
						},
						include:[{model:PedidoRestaurante,as:'pedidoRestaurante',
								include:[{model:MesaPedidoRestaurante,as:'mesasPedidoRestaurante',
											where:{
												pedido_activo:true
											},
									include:[{model:Mesa,as:'mesa'}]},
								{model:GarzonPedidoRestaurante,as:"garzonesPedidoRestaurante",
									include:[{model:Garzon,as:'garzon',
											include:[{model:Persona,as:'persona'}]}]},
								{model:DetallePedidoRestaurante,as:'detallesPedidoRestaurante',
									include:[{model:Producto,as:'producto',
											include:[{model:Clase,as:'tipoProducto'},
													 /*{model:Inventario,as:'inventarios',
														  where:{id_almacen:req.params.id_almacen,cantidad:{$gt: 0}},
														  include:[{model:DetalleMovimiento,as:"detallesMovimiento",
																include:[{model:Movimiento,as:'movimiento',
																		include:[{model:Tipo,as:'tipo',where:{nombre_corto:'MOVING'}},
																				{model:Clase,as:'clase'}]}]}]
													}*/]}]}]}]}]
		})
		.then(function (mesa){
			res.json(mesa);
		});
	});

router.route('/pedido-restaurante/:id_pedido_restaurante')
	.put(function(req, res) {
		PedidoRestaurante.update({
			//tiempo_ingreso:new Date()
			tiempo_salida:req.body.tiempo_salida
		},{
			where:{
				id:req.params.id_pedido_restaurante
			}
		}).then(function (pedidoRestauranteCreado){
			if(req.body.mesas){
				Clase.find({
					where:{
						nombre_corto:"OCU"
					}
				}).then(function(estado){
					req.body.mesas.forEach(function(mesa, index, array){
						MesaPedidoRestaurante.findOrCreate({
							where:{
								pedido_activo:true,
								id_pedido_restaurante:req.params.id_pedido_restaurante,
								id_mesa:mesa.id
							},
							defaults:{
								pedido_activo:true,
								id_pedido_restaurante:req.params.id_pedido_restaurante,
								id_mesa:mesa.id
							}
						}).then(function(mesaPedidoRestauranteCreado){
							Mesa.update({
								id_estado:estado.id
							},{
								where:{
									id:mesa.id
								}
							}).then(function(mesaActualizada){

							});
						});
					});
				});
			}
			if(req.body.garzones){
				req.body.garzones.forEach(function(garzon, index, array){
					GarzonPedidoRestaurante.findOrCreate({
						where:{
							id_pedido_restaurante:req.params.id_pedido_restaurante,
							id_garzon:garzon.id
						},
						defaults:{
							fecha_atencion:new Date()
						}
					}).then(function(garzonPedidoRestauranteCreado){

					});
				});
			}
			req.body.detallesPedidoRestaurante.forEach(function(detallePedidoRestaurante, index, array){
				if(detallePedidoRestaurante.id){
					if(detallePedidoRestaurante.eliminado){
						DetallePedidoRestaurante.destroy({
							where:{
								id:detallePedidoRestaurante.id
							}
						}).then(function(detallePedidoRestauranteEliminado){
							
						});
					}else{
						DetallePedidoRestaurante.update({
							id_producto:detallePedidoRestaurante.producto.id,
							id_pedido_restaurante:pedidoRestauranteCreado.id,
							precio_unitario:detallePedidoRestaurante.precio_unitario,
							cantidad:detallePedidoRestaurante.cantidad,
							importe:detallePedidoRestaurante.importe,
							descuento:detallePedidoRestaurante.descuento,
							recargo:detallePedidoRestaurante.recargo,
							ice:detallePedidoRestaurante.ice,
							excento:detallePedidoRestaurante.excento,
							tipo_descuento:detallePedidoRestaurante.tipo_descuento,
							tipo_recargo:detallePedidoRestaurante.tipo_recargo,
							total:detallePedidoRestaurante.total
						},{
							where:{
								id:detallePedidoRestaurante.id
							}
						}).then(function(detallePedidoRestauranteActualizado){
							
						});
					}
				}else{
					if(!detallePedidoRestaurante.eliminado){
						DetallePedidoRestaurante.create({
							id_producto:detallePedidoRestaurante.producto.id,
							id_pedido_restaurante:req.params.id_pedido_restaurante,
							precio_unitario:detallePedidoRestaurante.precio_unitario,
							cantidad:detallePedidoRestaurante.cantidad,
							importe:detallePedidoRestaurante.importe,
							total:detallePedidoRestaurante.total
						}).then(function(detallePedidoRestauranteCreado){
							
						});
					}
				}
			});
			res.json({mensaje:"Actualizado Satisfactoriamente"});
		});
	});

router.route('/pedido-restaurante/mesa/almacen')
	.post(function(req, res) {
		PedidoRestaurante.create({
			tiempo_ingreso:new Date()
		}).then(function (pedidoRestauranteCreado){
			Clase.find({
				where:{
					nombre_corto:"OCU"
				}
			}).then(function(estado){
				req.body.mesas.forEach(function(mesa, index, array){
					MesaPedidoRestaurante.create({
						pedido_activo:req.body.pedido_activo,
						id_pedido_restaurante:pedidoRestauranteCreado.id,
						id_mesa:mesa.id
					}).then(function(mesaPedidoRestauranteCreado){
						Mesa.update({
							id_estado:estado.id
						},{
							where:{
								id:mesa.id
							}
						}).then(function(mesaActualizada){

						});
					});
				});
				req.body.garzones.forEach(function(garzon, index, array){
					GarzonPedidoRestaurante.create({
						fecha_atencion:new Date(),
						id_pedido_restaurante:pedidoRestauranteCreado.id,
						id_garzon:garzon.id
					}).then(function(garzonPedidoRestauranteCreado){
						
					});
				});
				req.body.detallesPedidoRestaurante.forEach(function(detallePedidoRestaurante, index, array){
					if(!detallePedidoRestaurante.eliminado){
						DetallePedidoRestaurante.create({
							id_producto:detallePedidoRestaurante.producto.id,
							id_pedido_restaurante:pedidoRestauranteCreado.id,
							precio_unitario:detallePedidoRestaurante.precio_unitario,
							cantidad:detallePedidoRestaurante.cantidad,
							importe:detallePedidoRestaurante.importe,
							descuento:detallePedidoRestaurante.descuento,
							recargo:detallePedidoRestaurante.recargo,
							ice:detallePedidoRestaurante.ice,
							excento:detallePedidoRestaurante.excento,
							tipo_descuento:detallePedidoRestaurante.tipo_descuento,
							tipo_recargo:detallePedidoRestaurante.tipo_recargo,
							total:detallePedidoRestaurante.total
						}).then(function(detallePedidoRestauranteCreado){
							
						});
					}
				});
				res.json(estado);
			});
		});
	});

router.route('/sala/sucursal')
	.post(function(req, res) {
		Sala.create({
			nombre:req.body.nombre,
			descripcion:req.body.descripcion,
			ubicacion:req.body.ubicacion,
			posicion:req.body.posicion,
			id_sucursal:req.body.id_sucursal
		})
		.then(function (salaCreada){
			res.json(salaCreada);
		});
	});

router.route('/mesa/sala')
	.post(function(req, res) {
		Mesa.create({
			numero:req.body.numero,
			id_estado:req.body.estado.id,
			imagen:req.body.imagen,			
			id_sala:req.body.id_sala
		})
		.then(function (mesaCreada){
			res.json(mesaCreada);
		});
	});

router.route('/mesa/:id_mesa')
	.put(function(req, res) {
		Mesa.update({
			numero:req.body.numero,
			id_estado:req.body.estado.id,
			imagen:req.body.imagen
		},{
			where:{
				id:req.params.id_mesa
			}
		})
		.then(function (mesaCreada){
			res.json({mensaje:"Mesa Actualizada satisfactoriamente!"});
		});
	});

function actualizarImagenPersona(personaCreada,req,res,signedRequest,imagen){
	Persona.update({
		imagen:imagen
	},{
		where:{id:personaCreada.id}
	}).then(function(affecteedRows){
		res.json({persona:personaCreada,url:imagen,signedRequest:signedRequest,image_name:'persona-'+personaCreada.id+'.jpg'});
	});
}

router.route('/sala/garzon')
.post(function(req, res) {
	Persona.create({
		nombres:req.body.persona.nombres,
		apellido_paterno:req.body.persona.apellido_paterno,
		apellido_materno:req.body.persona.apellido_materno,
		nombre_completo:req.body.persona.nombres+' '+req.body.persona.apellido_paterno+' '+req.body.persona.apellido_materno
	}).then(function(personaCreada){
		Garzon.create({
			id_persona:personaCreada.id,
			id_empresa:req.body.id_empresa,
			codigo:req.body.codigo
		}).then(function(garzonCreado){
			Clase.find({
				where:{nombre_corto:'OAL'}
			}).then(function(clase){
				if(clase.nombre=="ONLINE"){
					var imagen;
					if(req.body.persona.imagen.indexOf('default') > -1){
						actualizarImagenPersona(personaCreada,req,res,null,req.body.persona.imagen);
					}else{
						signs3('agil_imagenes/persona-'+personaCreada.id+'.jpg','image/jpeg',function(signedRequest,url){
							actualizarImagenPersona(personaCreada,req,res,signedRequest,url);
						});
					}
				}else{
					var imagen;
					if(req.body.persona.imagen.indexOf('default') > -1){
						imagen=req.body.persona.imagen;
					}else{
						var imagenEmpresa=decodeBase64Image(req.body.persona.imagen);
						fs.writeFileSync('./img/persona-'+personaCreada.id+'.jpg', imagenEmpresa.data, 'base64', function(err) { });
						imagen='img/persona-'+personaCreada.id+'.jpg';
					}
					actualizarImagenPersona(personaCreada,req,res,null,imagen);
				}
			});
		});	
	});
})

router.route('/garzon/:id_empresa')
	.get(function(req, res) {
		Garzon.findAll({
			where:{
				id_empresa:req.params.id_empresa
			},include: [{model:Persona,as: 'persona'}]	
		})
		.then(function (garzones){
			res.json(garzones);
		});
	})
	
router.route('/garzon/:id_garzon')
	.put(function(req, res) {
		Persona.update({
			nombres:req.body.persona.nombres,
			apellido_paterno:req.body.persona.apellido_paterno,
			apellido_materno:req.body.persona.apellido_materno,
			nombre_completo:req.body.persona.nombres+' '+req.body.persona.apellido_paterno+' '+req.body.persona.apellido_materno
		},{
			where:{
				id:req.body.persona.id
			}
		}).then(function(personaActualizada){
			Garzon.update({
				id_persona:personaActualizada.id,
				id_empresa:req.body.id_empresa,
				codigo:req.body.codigo
			},{
					where:{id:req.params.id_garzon}
					
			}).then(function(garzonCreado){
				Clase.find({
					where:{nombre_corto:'OAL'}
				}).then(function(clase){
					if(clase.nombre=="ONLINE"){
						if((req.body.persona.imagen.indexOf('default') > -1 || req.body.persona.imagen.indexOf("persona-"+req.body.persona.id) > -1 || req.body.persona.imagen.indexOf(req.body.persona.id) > -1) && req.body.persona.imagen.length<200){
							actualizarImagenPersona(req.body.persona,req,res,null,req.body.persona.imagen);
						}else{
							signs3('agil_imagenes/persona-'+req.body.persona.id+'.jpg','image/jpeg',function(signedRequest,url){
								actualizarImagenPersona(req.body.persona,req,res,signedRequest,url);
							});
						}
					}else{
						if((req.body.persona.imagen.indexOf('default') > -1 || req.body.persona.imagen.indexOf("persona-"+req.body.persona.id) > -1 || req.body.persona.imagen.indexOf(req.body.persona.id) > -1) && req.body.persona.imagen.length<200){
							actualizarImagenPersona(req.body.persona,req,res,null,req.body.persona.imagen);
						}else{
							var imgPerson=decodeBase64Image(req.body.persona.imagen);
							fs.writeFileSync('./img/persona-'+req.body.persona.id+'.jpg', imgPerson.data, 'base64', function(err) { });
							var imagen='img/persona-'+req.body.persona.id+'.jpg';
							actualizarImagenPersona(req.body.persona,req,res,null,imagen);
						}
					}
				});
			});
		});
	});

router.route('/mesa-pedido-restaurante/:ids_mesas')
	.delete(function(req,res){
		var ids=req.params.ids_mesas.split(",");
		ids.forEach(function(idMesa, index, array){
			MesaPedidoRestaurante.find({
				where:{
					id_mesa:idMesa,
					pedido_activo:true
				}
			}).then(function(mesaPedidoRestauranteEncontrado){
				DetallePedidoRestaurante.destroy({
					where:{
							id_pedido_restaurante:mesaPedidoRestauranteEncontrado.id_pedido_restaurante
						}
				}).then(function(res1){
					PedidoRestaurante.destroy({
						where:{
							id:mesaPedidoRestauranteEncontrado.id_pedido_restaurante
						}
					}).then(function(res2){
						MesaPedidoRestaurante.destroy({
							where:{
								id_mesa:idMesa,
								pedido_activo:true
							}
						}).then(function(mesaPedidoRestauranteRes){
							res.json({mensaje:"Eliminado Satisfactoriamente!"});
						});
					});
				})
			});
		});
	})
}