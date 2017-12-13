module.exports=function(router,Usuario,ConfiguracionVendedorApp,Clase,ConfiguracionGeneralApp,Rol,UsuarioRol,Diccionario,Persona){

router.route('/configuraciones-app/empresa/:id_empresa')
	.get(function(req, res) {
		obtenerConfiguracionesAppEmpresa(req,res,true);
	});
	
router.route('/configuraciones-app/:id_configuracion')
	.put(function(req, res) {
		ConfiguracionVendedorApp.update({
			id_tipo_venta:req.body.tipoVenta.id,
			id_cobro_habilitado:req.body.cobroHabilitado.id,
			id_tipo_pago:req.body.tipoPago.id,
			impresion_habilitada:req.body.impresion_habilitada,
			cierre_habilitado:req.body.cierre_habilitado,
			id_listado_productos:req.body.listadoProductos.id
		},{
			where:{id:req.params.id_configuracion}
		}).then(function(score){
			res.json({mensaje:"¡Configuracion de App de vendedor actualizado correctamente!"});
		});
	});
	
router.route('/configuracion-general-app/empresa/:id_empresa')
	.get(function(req, res) {
		obtenerConfiguracionGeneralAppEmpresa(req,res);
	});
	
router.route('/configuracion-general-app/:id_configuracion')
	.put(function(req, res) {
		ConfiguracionGeneralApp.update({
			id_tipo_venta:req.body.tipoVenta.id,
			id_cobro_habilitado:req.body.cobroHabilitado.id,
			id_tipo_pago:req.body.tipoPago.id,
			impresion_habilitada:req.body.impresion_habilitada,
			cierre_habilitado:req.body.cierre_habilitado,
			usar:req.body.usar,
			id_listado_productos:req.body.listadoProductos.id
		},{
			where:{id:req.params.id_configuracion}
		}).then(function(score){
			res.json({mensaje:"¡Configuracion de App General actualizado correctamente!"});
		});
	});
	
router.route('/configuraciones-app/empresa/:id_empresa/usuario/:id_usuario')
	.get(function(req, res) {
		ConfiguracionGeneralApp.find({
			where:{
				id_empresa:req.params.id_empresa,
				usar:true
			},
			include:[{model:Clase,as:'listadoProductos'},
					 {model:Clase,as:'tipoVenta'},
					 {model:Clase,as:'tipoPago'},
					 {model:Clase,as:'cobroHabilitado'}]
		}).then(function(configuracionGeneral){
			if(configuracionGeneral){
				res.json(configuracionGeneral);
			}else{
				ConfiguracionVendedorApp.find({
					where:{
						id_vendedor:req.params.id_usuario
					},
					include:[{model:Clase,as:'listadoProductos'},
							 {model:Clase,as:'tipoVenta'},
							 {model:Clase,as:'tipoPago'},
							 {model:Clase,as:'cobroHabilitado'}]
				}).then(function(configuracionVendedor){
					res.json(configuracionVendedor);
				});
			}
		});
	});

function obtenerConfiguracionesAppPremisa(req,required){
	return Usuario.findAll({
		where:{id_empresa:req.params.id_empresa},
		include: [{model:ConfiguracionVendedorApp,as: 'configuracionVendedorApp',required:required,
					include:[{model:Clase,as:'tipoVenta'},
							  {model:Clase,as:'cobroHabilitado'},
							  {model:Clase,as:'tipoPago'},
							  {model:Clase,as:'listadoProductos'}]},
				  {model:UsuarioRol,as:'rolesUsuario',
						include:[{model:Rol,as:'rol',where:{nombre:Diccionario.ROL_VENDEDOR}}]},
				  {model:Persona,as:'persona'}]
	});
}

function obtenerConfiguracionesAppEmpresa(req,res,verificar){
	var configuracionesPremisa=obtenerConfiguracionesAppPremisa(req,true);
	configuracionesPremisa.then(function(entities){	
		if(entities.length>0){
			if(verificar){
				verificarVendedoresFaltantes(req,res,entities);
			}else{
				devolverConfiguraciones(entities,res);	
			}
		}else{
			crearConfiguracionesAppsEmpresa(req,res);
		}
	});
}

function devolverConfiguraciones(entities,res){
	res.json(entities);
}

function crearConfiguracionesAppsEmpresa(req,res){
	Usuario.findAll({
		where:{
			id_empresa:req.params.id_empresa
		},
		include:[{model:UsuarioRol,as:'rolesUsuario',
			include:[{model:Rol,as:'rol',where:{nombre:Diccionario.ROL_VENDEDOR}}]}]
	}).then(function(usuarios){
		if(usuarios.length>0){
			Clase.find({
				where:{nombre_corto:"MIX15"}
			}).then(function(movimientoEgresoApp){
				Clase.find({
					where:{nombre_corto:"DSB16"}
				}).then(function(cobro){
					Clase.find({
						where:{nombre_corto:"MIX17"}
					}).then(function(tipoPago){
						Clase.find({
							where:{nombre_corto:"LS18"}
						}).then(function(listadoProductos){
							usuarios.forEach(function(usuario, index, array){
								ConfiguracionVendedorApp.create({
									id_vendedor:usuario.id,
									id_tipo_venta:movimientoEgresoApp.id,
									id_cobro_habilitado:cobro.id,
									id_tipo_pago:tipoPago.id,
									impresion_habilitada:false,
									cierre_habilitado:false,
									id_listado_productos:listadoProductos.id
								}).then(function(score){
									if(index===(array.length-1)){
										obtenerConfiguracionesAppEmpresa(req,res,false);
									}
								});
							})
						})
					})
				})
			})
		}else{
			res.json([]);
		}
	});
}

function crearConfiguracionesAppEmpresa(req,res,ids){
	Usuario.findAll({
		where:{
			id:{$in:ids}
		}
	}).then(function(usuarios){
		Clase.find({
			where:{nombre_corto:"MIX15"}
		}).then(function(movimientoEgresoApp){
			Clase.find({
				where:{nombre_corto:"DSB16"}
			}).then(function(cobro){
				Clase.find({
					where:{nombre_corto:"MIX17"}
				}).then(function(tipoPago){
					Clase.find({
						where:{nombre_corto:"LS18"}
					}).then(function(listadoProductos){
						usuarios.forEach(function(usuario, index, array){
							ConfiguracionVendedorApp.create({
								id_vendedor:usuario.id,
								id_tipo_venta:movimientoEgresoApp.id,
								id_cobro_habilitado:cobro.id,
								id_tipo_pago:tipoPago.id,
								impresion_habilitada:false,
								cierre_habilitado:false,
								id_listado_productos:listadoProductos.id
							}).then(function(score){
								if(index===(array.length-1)){
									obtenerConfiguracionesAppEmpresa(req,res,false);
								}
							});
						})
					})
				})
			})
		})
	});
}

function verificarVendedoresFaltantes(req,res,originalEntities){
	var scoresPromise=obtenerConfiguracionesAppPremisa(req,false);
	scoresPromise.then(function(entities){	
		var ids=[];
		for(var e=0;e<entities.length;e++){
			if(entities[e].configuracionVendedorApp==null){
				ids.push(entities[e].id);
			}
		}
		if(ids.length>0){
			crearConfiguracionesAppEmpresa(req,res,ids);
		}else{
			devolverConfiguraciones(originalEntities,res)
		}
	});
}

function obtenerConfiguracionGeneralAppEmpresa(req,res){
	var configuracionesPremisa=obtenerConfiguracionGeneralAppPremisa(req);
	configuracionesPremisa.then(function(entity){	
		if(entity){
			devolverConfiguraciones(entity,res);
		}else{
			crearConfiguracionGeneralAppEmpresa(req,res);
		}
	});
}

function obtenerConfiguracionGeneralAppPremisa(req){
	return ConfiguracionGeneralApp.find({
		where:{id_empresa:req.params.id_empresa},
		include:[{model:Clase,as:'tipoVenta'},
			  {model:Clase,as:'cobroHabilitado'},
			  {model:Clase,as:'tipoPago'},
			  {model:Clase,as:'listadoProductos'}]
	});
}

function crearConfiguracionGeneralAppEmpresa(req,res){
	Clase.find({
		where:{nombre_corto:"MIX15"}
	}).then(function(movimientoEgresoApp){
		Clase.find({
			where:{nombre_corto:"DSB16"}
		}).then(function(cobro){
			Clase.find({
				where:{nombre_corto:"MIX17"}
			}).then(function(tipoPago){
				Clase.find({
						where:{nombre_corto:"LS18"}
					}).then(function(listadoProductos){
					ConfiguracionGeneralApp.create({
						id_empresa:req.params.id_empresa,
						id_tipo_venta:movimientoEgresoApp.id,
						id_cobro_habilitado:cobro.id,
						id_tipo_pago:tipoPago.id,
						impresion_habilitada:false,
						cierre_habilitado:false,
						usar:true,
						id_listado_productos:listadoProductos.id
					}).then(function(score){
						obtenerConfiguracionGeneralAppEmpresa(req,res);
					});
				})
			})
		})
	})
}
}