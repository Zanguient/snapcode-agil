module.exports = function (router, forEach, decodeBase64Image, fs, Empresa, Producto, Proveedor, Cliente, Clase, Inventario, ComisionVendedorProducto,
	Usuario, DetalleVenta, DetalleMovimiento, Movimiento, Venta, Compra, DetalleCompra, Almacen, Sucursal, signs3, Tipo, ProductoBase, sequelize,
	ContabilidadCuenta, UsuarioGrupos, ActivosFijos, ActivosFijosValores, ProductoTipoPrecio, Diccionario) {

	router.route('/productos')
		.post(function (req, res) {
			Producto.create({
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				codigo: req.body.codigo,
				unidad_medida: req.body.unidad_medida,
				precio_unitario: req.body.precio_unitario,
				utilidad_esperada: req.body.utilidad_esperada,
				inventario_minimo: req.body.inventario_minimo,
				descripcion: req.body.descripcion,
				id_grupo: req.body.grupo.id,
				id_subgrupo: req.body.subgrupo.id,
				caracteristica_especial1: req.body.caracteristica_especial1,
				caracteristica_especial2: req.body.caracteristica_especial2,
				codigo_fabrica: req.body.codigo_fabrica,
				comision: req.body.comision,
				publicar_panel: req.body.publicar_panel,
				alerta: req.body.alerta,
				descuento: req.body.descuento,
				descuento_fijo: req.body.descuento_fijo,
				id_tipo_producto: req.body.tipoProducto.id,
				activar_inventario: req.body.activar_inventario,
				marca: req.body.marca,
				modelo: req.body.modelo,
				anio: req.body.anio,
				id_almacen_erp: (req.body.almacenErp ? req.body.almacenErp.id : null),
				id_cuenta: (req.body.cuenta ? req.body.cuenta.id : null),
				rango_positivo: req.body.rango_positivo,
				rango_negativo: req.body.rango_negativo,
				activo_fijo: req.body.activo_fijo
			}).then(function (productoCreado) {
				req.body.productosBase.forEach(function (productoBase, index, array) {
					if (!productoBase.eliminado) {
						ProductoBase.create({
							id_producto: productoCreado.id,
							id_producto_base: productoBase.productoBase.id,
							formulacion: productoBase.productoBase.formulacion
						}).then(function (ProductoBaseCreado) {

						});
					}
				});
				if (req.body.activo_fijo) {
					ActivosFijos.create({
						id_usuario: req.body.usuario,
						id_empresa: req.body.id_empresa,
						id_producto: productoCreado.dataValues.id,
						fecha_ingreso: new Date(req.body.fecha_ingreso.split('/').reverse()),
						revaluado: false,
						eliminado: false
					}).then(function (ACtivoCreado) {
						ActivosFijosValores.create({
							id_usuario: req.body.usuario,
							id_activo: ACtivoCreado.dataValues.id,
							mes: (new Date(req.body.fecha_ingreso.split('/').reverse()).getMonth() + 1),
							anio: (new Date(req.body.fecha_ingreso.split('/').reverse()).getFullYear()),
							valor: req.body.valor_actualizado,
							incremento_actualizacion: 0,
							valor_actualizado: req.body.valor_actualizado,
							depreciacion_acumulada: req.body.depreciacion_acumulada,
							incremento_actualizacion_depreciacion_acumulada: 0,
							depreciacion_acumulada_actualizada: req.body.depreciacion_acumulada,
							depreciacion: 0,//(req.body.depreciacion_acumulada/10)/12,
							total_depreciacion_acumulada: req.body.depreciacion_acumulada,
							valor_neto: req.body.valor_actualizado,
							eliminado: false
						});
					})
				}

				Clase.find({
					where: { nombre_corto: 'OAL' }
				}).then(function (clase) {
					if (clase.nombre == "ONLINE") {
						var imagen;
						if (req.body.imagen.indexOf('default') > -1) {
							actualizarImagenProducto(productoCreado, req, res, null, req.body.imagen);
						} else {
							signs3('agil_imagenes/producto-' + productoCreado.id + '.jpg', 'image/jpeg', function (signedRequest, url) {
								actualizarImagenProducto(productoCreado, req, res, signedRequest, url);
							});
						}
					} else {
						var imagen;
						if (req.body.imagen.indexOf('default') > -1) {
							imagen = req.body.imagen;
						} else {
							var imagenProducto = decodeBase64Image(req.body.imagen);
							fs.writeFileSync('./img/producto-' + productoCreado.id + '.jpg', imagenProducto.data, 'base64', function (err) { });
							imagen = 'img/producto-' + productoCreado.id + '.jpg';
						}
						actualizarImagenProducto(productoCreado, req, res, null, imagen);
					}
				});
			});
		});

	router.route('/productos/empresa/:id_empresa')
		.get(function (req, res) {
			Producto.findAll({
				where: { id_empresa: req.params.id_empresa, codigo: { $not: null } },
				include: [{ model: Empresa, as: 'empresa' }],
				order: [['codigo', 'ASC']]
			}).then(function (resp) {
				res.json(resp);
			});
		});
	router.route('/productos/kardex/empresa/:id_empresa/almacen/:id_almacen/grupo/:grupo')
		.get(function (req, res) {

			var condicion = { id_empresa: req.params.id_empresa, codigo: { $not: null } }
			if (req.params.grupo != 0) {
				condicion = { id_grupo: req.params.grupo, id_empresa: req.params.id_empresa, codigo: { $not: null } }
			}

			var fechaInicial = new Date(2016, 1, 0);
			var fechaFinal = new Date();
			var condicionMovimiento = { id_almacen: req.params.id_almacen }
			condicionMovimiento.fecha = { $between: [fechaInicial, fechaFinal] }


			Producto.findAll({
				where: condicion,
				include: [{ model: Empresa, as: 'empresa' },
				{
					model: DetalleMovimiento, as: "detallesMovimiento",

					include: [{ model: Inventario, as: 'inventario' },
					{
						model: Movimiento, as: 'movimiento',
						where: condicionMovimiento,
						include: [{
							model: Compra, as: 'compra', required: false,
							include: [{ model: Proveedor, as: 'proveedor' }]
						},
						{
							model: Venta, as: 'venta', required: false,
							include: [{ model: Cliente, as: 'cliente' }]
						},
						{
							model: Almacen, as: 'almacen', required: false,
							include: [{ model: Sucursal, as: 'sucursal' }]
						},
						{ model: Tipo, as: 'tipo' },
						{ model: Clase, as: 'clase' }]
					}
					],
					order: [[{ model: Movimiento, as: 'movimiento' }, 'fecha', 'ASC']]
				}],

				order: [['id', 'ASC']]

			}).then(function (resp) {
				res.json(resp);
			});
		});
	router.route('/productos/empresa/:id_empresa/user/:id_usuario')
		.get(function (req, res) {
			UsuarioGrupos.findAll({
				where: { id_usuario: req.params.id_usuario }
			}).then(function (grupos) {
				var gruposUser = grupos.map(function (grupo) {
					return grupo.id_grupo
				})
				Producto.findAll({
					where: { id_empresa: req.params.id_empresa, codigo: { $not: null }, id_grupo: { $in: gruposUser } },
					include: [{ model: Empresa, as: 'empresa' }, { model: Clase, as: 'tipoProducto', where: { nombre_corto: Diccionario.TIPO_PRODUCTO_BASE } }],
					order: [['codigo', 'ASC']]
				}).then(function (resp) {
					res.json(resp);
				});
			})
		});
	router.route('/productos/kardex/:id_producto/almacen/:id_almacen/fecha-inicial/:fecha_inicio/fecha-final/:fecha_fin/lote/:lote/:saldo')
		.get(function (req, res) {
			///pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion
			var condicionMovimiento = { id_almacen: req.params.id_almacen }
			var desde = false
			var hasta = false
			var fecha_desde;
			var fecha_hasta;
			// if (req.params.mes != "0" && req.params.anio != "0") {
			// 	var fecha_desde = new Date(parseInt(req.params.anio), parseInt(req.params.mes) - 1, 1, 0, 0, 0)
			// 	var fecha_hasta = new Date(parseInt(req.params.anio), parseInt(req.params.mes), -1, 0, 0, 0)
			// 	fecha_hasta.setHours(23)
			// 	fecha_hasta.setMinutes(59)
			// 	fecha_hasta.setSeconds(59)
			// 	condicionMovimiento.fecha = { $between: [fecha_desde, fecha_hasta] }
			// } else {
				if (req.params.fecha_inicio != "0") {
					fecha_desde = req.params.fecha_inicio.split('/').reverse().join('-') + "T00:00:00.000Z"; 
					// fecha_desde.setHours(0, 0, 0, 0, 0);
					desde = true
				}
				if (req.params.fecha_fin != "0") {
					fecha_hasta = req.params.fecha_fin.split('/').reverse().join('-') + "T23:59:59.000Z";
					// fecha_hasta.setHours(23)
					// fecha_hasta.setMinutes(59)
					// fecha_hasta.setSeconds(59)
					hasta = true
				}
			// }
			if (desde && hasta) {
				condicionMovimiento.fecha = { $between: [fecha_desde, fecha_hasta] }
			} else if (desde && !hasta) {
				condicionMovimiento.fecha = {
					$gte: [fecha_desde]
				}
			} else if (!desde && hasta) {
				condicionMovimiento.fecha = {
					$lte: [fecha_hasta]
				}
			} 
			// else if (!desde && !hasta && (req.params.anio != "0")) {
			// 	if (req.params.mes != "0") {
			// 		fecha_desde = new Date(parseInt(req.params.anio), parseInt(req.params.mes) - 1, 1, 0, 0, 0, 0)
			// 		fecha_hasta = new Date(parseInt(req.params.anio), parseInt(req.params.mes), 1, 0, 0, 0, 0)
			// 	} else {
			// 		fecha_desde = new Date(parseInt(req.params.anio), 0, 1, 0, 0, 0, 0)
			// 		fecha_hasta = new Date(parseInt(req.params.anio), 11, 31, 23, 59, 59, 0)
			// 	}
			// 	condicionMovimiento.fecha = { $between: [fecha_desde, fecha_hasta] }
			// }
			// var fechaInicial = req.params.fecha_inicio == 0 ? new Date(2016, 1, 0) : new Date(2016, 1, 0)//new Date(req.params.fecha_inicio.split('/').reverse().join('-') + "T00:00:00.000Z");
			// var fechaFinal = req.params.fecha_inicio == 0 ? new Date() : new Date(req.params.fecha_inicio.split('/').reverse().join('-') + "T00:00:00.000Z");
			
			var condicionMovimientoSaldo = { id_almacen: req.params.id_almacen }
			var condicionDetalleMovimientoSaldoAnterior = { id_producto: req.params.id_producto }
			if (req.params.fecha_inicio != 0) {
				condicionMovimientoSaldo.fecha = { $lte: [req.params.fecha_inicio.split('/').reverse().join('-') + "T00:00:00.000Z"] }
			}
			var condicionInventario = {id_producto: req.params.id_producto};
			if (req.params.lote != "0") {
				condicionInventario.lote = req.params.lote
			}
			if (req.params.saldo != "0") {
				DetalleMovimiento.findAll({
					where: condicionDetalleMovimientoSaldoAnterior,
					include: [{ model: Inventario, as: 'inventario', where: condicionInventario },
					{
						model: Movimiento, as: 'movimiento',
						where: condicionMovimientoSaldo,
						include: [{
							model: Compra, as: 'compra', required: false,
							include: [{ model: Proveedor, as: 'proveedor' }]
						},
						{
							model: Venta, as: 'venta', required: false,
							include: [{ model: Cliente, as: 'cliente' }]
						},
						{
							model: Almacen, as: 'almacen', required: false,
							include: [{ model: Sucursal, as: 'sucursal' }]
						},
						{ model: Tipo, as: 'tipo' },
						{ model: Clase, as: 'clase' }]
					}
					],
					order: [[{ model: Movimiento, as: 'movimiento' }, 'fecha', 'ASC']]
				}).then(function (productosSaldoAnterior) {
					DetalleMovimiento.findAll({
						where: { id_producto: req.params.id_producto },
						include: [{ model: Inventario, as: 'inventario', where: condicionInventario },
						{
							model: Movimiento, as: 'movimiento',
							where: condicionMovimiento,
							include: [{
								model: Compra, as: 'compra', required: false,
								include: [{ model: Proveedor, as: 'proveedor' }]
							},
							{
								model: Venta, as: 'venta', required: false,
								include: [{ model: Cliente, as: 'cliente' }]
							},
							{
								model: Almacen, as: 'almacen', required: false,
								include: [{ model: Sucursal, as: 'sucursal' }]
							},
							{ model: Tipo, as: 'tipo' },
							{ model: Clase, as: 'clase' }]
						}
						],
						order: [[{ model: Movimiento, as: 'movimiento' }, 'fecha', 'ASC']]

					}).then(function (productos) {
						res.json({ saldoAnterior: productosSaldoAnterior, kardex: productos });
						/*DetalleMovimiento.findAll(limite).then(function (productos) {
							res.json({ kardex: productos, paginas: Math.ceil(datosCount.count / req.params.items_pagina) })
		
							//res.json(productos);
						});*/
					}).catch(function (err) {
						res.json({ mensaje: err.stack, hasErr: true })
					})
				}).catch(function (err) {
                    res.json({ mensaje: err.stack, hasErr: true })
                })
			} else {
				DetalleMovimiento.findAll({
					where: { id_producto: req.params.id_producto },
					include: [{ model: Inventario, as: 'inventario', where: condicionInventario },
					{
						model: Movimiento, as: 'movimiento',
						where: condicionMovimiento,
						include: [{
							model: Compra, as: 'compra', required: false,
							include: [{ model: Proveedor, as: 'proveedor' }]
						},
						{
							model: Venta, as: 'venta', required: false,
							include: [{ model: Cliente, as: 'cliente' }]
						},
						{
							model: Almacen, as: 'almacen', required: false,
							include: [{ model: Sucursal, as: 'sucursal' }]
						},
						{ model: Tipo, as: 'tipo' },
						{ model: Clase, as: 'clase' }]
					}
					],
					order: [[{ model: Movimiento, as: 'movimiento' }, 'fecha', 'ASC']]

				}).then(function (productos) {
					res.json({ saldoAnterior: 0, kardex: productos });
					/*DetalleMovimiento.findAll(limite).then(function (productos) {
						res.json({ kardex: productos, paginas: Math.ceil(datosCount.count / req.params.items_pagina) })
	
						//res.json(productos);
					});*/
				}).catch(function (err) {
                    res.json({ mensaje: err.stack, hasErr: true })
                })
			}


			//	var busquedaQuery = (req.params.texto_busqueda === "0") ? "" : " AND p.nombre like '%" + req.params.texto_busqueda + "%'";
			// if (req.params.items_pagina != 0) {
			// 	var limite = {
			// 		where: { id_producto: req.params.id_producto },
			// 		offset: (req.params.items_pagina * (req.params.pagina - 1)),
			// 		limit: req.params.items_pagina,
			// 		include: [{ model: Inventario, as: 'inventario' },
			// 		{
			// 			model: Movimiento, as: 'movimiento',
			// 			where: condicionMovimiento,
			// 			include: [{
			// 				model: Compra, as: 'compra', required: false,
			// 				include: [{ model: Proveedor, as: 'proveedor' }]
			// 			},
			// 			{
			// 				model: Venta, as: 'venta', required: false,
			// 				include: [{ model: Cliente, as: 'cliente' }]
			// 			},
			// 			{
			// 				model: Almacen, as: 'almacen', required: false,
			// 				include: [{ model: Sucursal, as: 'sucursal' }]
			// 			},
			// 			{ model: Tipo, as: 'tipo' },
			// 			{ model: Clase, as: 'clase' }]
			// 		}
			// 		],
			// 		order: [[{ model: Movimiento, as: 'movimiento' }, 'fecha', 'ASC']]
			// 	}
			// } else {
			// 	var limite = {
			// 		where: { id_producto: req.params.id_producto },
			// 		include: [{ model: Inventario, as: 'inventario' },
			// 		{
			// 			model: Movimiento, as: 'movimiento',
			// 			where: condicionMovimiento,
			// 			include: [{
			// 				model: Compra, as: 'compra', required: false,
			// 				include: [{ model: Proveedor, as: 'proveedor' }]
			// 			},
			// 			{
			// 				model: Venta, as: 'venta', required: false,
			// 				include: [{ model: Cliente, as: 'cliente' }]
			// 			},
			// 			{
			// 				model: Almacen, as: 'almacen', required: false,
			// 				include: [{ model: Sucursal, as: 'sucursal' }]
			// 			},
			// 			{ model: Tipo, as: 'tipo' },
			// 			{ model: Clase, as: 'clase' }]
			// 		}
			// 		],
			// 		order: [[{ model: Movimiento, as: 'movimiento' }, 'fecha', 'ASC']]
			// 	}
			// }

			// DetalleMovimiento.findAll({
			// 	where: { id_producto: req.params.id_producto },
			// 	include: [{ model: Inventario, as: 'inventario' },
			// 	{
			// 		model: Movimiento, as: 'movimiento',
			// 		where: condicionMovimiento,
			// 		include: [{
			// 			model: Compra, as: 'compra', required: false,
			// 			include: [{ model: Proveedor, as: 'proveedor' }]
			// 		},
			// 		{
			// 			model: Venta, as: 'venta', required: false,
			// 			include: [{ model: Cliente, as: 'cliente' }]
			// 		},
			// 		{
			// 			model: Almacen, as: 'almacen', required: false,
			// 			include: [{ model: Sucursal, as: 'sucursal' }]
			// 		},
			// 		{ model: Tipo, as: 'tipo' },
			// 		{ model: Clase, as: 'clase' }]
			// 	}
			// 	],
			// 	order: [[{ model: Movimiento, as: 'movimiento' }, 'fecha', 'ASC']]

			// }).then(function (productos) {
			// 	res.json(productos);
			// 	/*DetalleMovimiento.findAll(limite).then(function (productos) {
			// 		res.json({ kardex: productos, paginas: Math.ceil(datosCount.count / req.params.items_pagina) })

			// 		//res.json(productos);
			// 	});*/
			// });
		});

	router.route('/productos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/grupo/:id_grupo/user/:id_user')
		.get(function (req, res) {
			var gruposProductos = ''
			UsuarioGrupos.findAll({
				where: { id_usuario: req.params.id_user }
			}).then(function (grupos) {
				if (grupos.length == 0) {
					res.json({ productos: [], hasError: true, mensaje: 'Los grupos del usuario no cuentan con productos.' });
				} else {
					grupos.forEach(function (grupo, i) {
						if (i == grupos.length - 1) {
							gruposProductos += grupo.id_grupo + ''
						} else {
							gruposProductos += grupo.id_grupo + ','
						}
					})
					var condicionProducto = "empresa=" + req.params.id_empresa, paginas, limit;
					if (req.params.texto_busqueda != 0) {
						condicionProducto = condicionProducto + " and (\
					codigo LIKE '%"+ req.params.texto_busqueda + "%' or \
					producto.nombre LIKE '%"+ req.params.texto_busqueda + "%' or \
					unidad_medida LIKE '%"+ req.params.texto_busqueda + "%' or \
					descripcion LIKE '%"+ req.params.texto_busqueda + "%' or \
					grupo.nombre LIKE '%"+ req.params.texto_busqueda + "%' or \
					tipoProducto.nombre LIKE '"+ req.params.texto_busqueda + "' or \
					producto.caracteristica_especial1 LIKE '%"+ req.params.texto_busqueda + "%' or \
					producto.caracteristica_especial2 LIKE '%"+ req.params.texto_busqueda + "%' or \
					subgrupo.nombre LIKE '%"+ req.params.texto_busqueda + "%')";

					}
					if (req.params.id_grupo != 0) {
						condicionProducto += ' and producto.grupo =' + req.params.id_grupo
					}
					sequelize.query("select count(producto.id) as cantidad_productos \
								from agil_producto as producto \
								LEFT OUTER JOIN gl_clase AS tipoProducto ON (producto.tipo_producto = tipoProducto.id)\
								LEFT OUTER JOIN gl_clase AS grupo ON (producto.grupo = grupo.id) \
								LEFT OUTER JOIN gl_clase AS subgrupo ON (producto.subgrupo = subgrupo.id) \
								WHERE "+ condicionProducto + " and producto.grupo in (" + gruposProductos + ")", { type: sequelize.QueryTypes.SELECT })
						.then(function (data) {
							if (req.params.items_pagina != 0) {
								limit = " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina;
								paginas = Math.ceil(data[0].cantidad_productos / req.params.items_pagina);
							} else {
								limit = "";
								paginas = 1;
							}
							sequelize.query("select producto.id,producto.caracteristica_especial1,producto.caracteristica_especial2,producto.publicar_panel,producto.activar_inventario,producto.codigo,producto.nombre as nombre,producto.imagen,producto.unidad_medida,producto.precio_unitario,producto.inventario_minimo,producto.descripcion,tipoProducto.nombre as tipoProducto,grupo.nombre as grupo,subgrupo.nombre as subgrupo\
						from agil_producto as producto\
						LEFT OUTER JOIN gl_clase AS tipoProducto ON (producto.tipo_producto = tipoProducto.id)\
						LEFT OUTER JOIN gl_clase AS grupo ON (producto.grupo = grupo.id)\
						LEFT OUTER JOIN gl_clase AS subgrupo ON (producto.subgrupo = subgrupo.id)\
						WHERE "+ condicionProducto + " and producto.grupo in (" + gruposProductos + ")\
						ORDER BY producto."+ req.params.columna + " " + req.params.direccion + limit, { type: sequelize.QueryTypes.SELECT })
								.then(function (productos) {
									if (productos.length > 0) {
										var idsProductos = productos.map(function (producto) {
											return producto.id
										})
										ProductoTipoPrecio.findAll({
											where: { id_producto: { $in: idsProductos }, eliminado: false },
											include: [{ model: Clase, as: 'tipoPrecio' }]
										}).then(function (precios) {
											if (precios.length > 0) {
												for (var index = 0; index < productos.length; index++) {
													var tiposprecios = precios.filter(function (precio) {
														return precio.id_producto === productos[index].id
													})
													if (tiposprecios.length > 0) {
														var tiposPrecio = tiposprecios.map(function (data_precio) {
															// mensajetooltip += (data_precio.tipoPrecio.nombre + ':' + data_precio.precio_unitario + '&#013') // for linebreaks &#013;&#010;
															var dat = { nombre: data_precio.tipoPrecio.nombre, precio_unitario: data_precio.precio_unitario }
															return dat
														})
														productos[index].tipoPrecio = tiposPrecio
													} else {
														productos[index].tipoPrecio = []
													}
												}
												res.json({ productos: productos, paginas: paginas, precios: precios });
											} else {
												res.json({ productos: productos, paginas: paginas, precios: precios });
											}
										}).catch(function (err) {
											res.json({ productos: [], hasErr: true, mensaje: err.stack });
										});
									} else {
										res.json({ productos: productos, paginas: paginas });
									}

								}).catch(function (err) {
									res.json({ productos: [], hasErr: true, mensaje: err.stack });
								});
						}).catch(function (err) {
							res.json({ productos: [], hasErr: true, mensaje: err.stack });
						});
				}
			}).catch(function (err) {
				res.json({ productos: [], hasErr: true, mensaje: err.stack });
			})
		});

	router.route('/productos/empresa')
		.post(function (req, res) {
			Tipo.find({
				where: {
					nombre_corto: 'TPS'
				},
				include: [{ model: Clase, as: 'clases', where: { eliminado: false } }]
			}).then(function (entidad) {
				var producto_base = entidad.clases.find(function (tipo) {
					return tipo.nombre_corto === 'PBASE'
				})
				var producto_intermedio = entidad.clases.find(function (tipo) {
					return tipo.nombre_corto === 'PINTER'
				})
				var producto_final = entidad.clases.find(function (tipo) {
					return tipo.nombre_corto === 'PFINAL'
				})
				// Clase.find({
				// 	where: { nombre_corto: 'PBASE' }
				// }).then(function (clase) {
				Tipo.find({
					where: {
						nombre_corto: "GRUPOS PRODUCTOS",
						id_empresa: req.body.id_empresa
					}
				}).then(function (tipoGrupoEncontrado) {
					Tipo.find({
						where: {
							nombre_corto: "SUBGRUPOS PRODUCTOS",
							id_empresa: req.body.id_empresa
						}
					}).then(function (tipoSubGrupoEncontrado) {
						req.body.productos.forEach(function (producto, index, array) {
							sequelize.transaction(function (t) {
								var tipo_producto;
								if (producto.tipo_producto === 'base') {
									tipo_producto = producto_base.id
									producto.activar_inventario = true
								}
								if (producto.tipo_producto === 'intermedio') {
									tipo_producto = producto_intermedio.id
									producto.activar_inventario = false
								}
								if (producto.tipo_producto === 'final') {
									tipo_producto = producto_final.id
									producto.activar_inventario = false
								}
								return Producto.find({
									where: {
										$or: [{ codigo: producto.codigo }],
										id_empresa: req.body.id_empresa
									},
									transaction: t
								}).then(function (productoEncontrado) {
									return Clase.findOrCreate({
										where: {
											nombre: producto.grupo,
											id_tipo: tipoGrupoEncontrado.id
										},
										defaults: {
											nombre: producto.grupo,
											id_tipo: tipoGrupoEncontrado.id
										},
										transaction: t,
										lock: t.LOCK.UPDATE
									}).spread(function (claseGrupoEncontrado, created) {
										return Clase.findOrCreate({
											where: {
												nombre: producto.subgrupo,
												id_tipo: tipoSubGrupoEncontrado.id
											},
											defaults: {
												nombre: producto.subgrupo,
												id_tipo: tipoSubGrupoEncontrado.id
											},
											transaction: t,
											lock: t.LOCK.UPDATE
										}).spread(function (claseSubGrupoEncontrado, created) {
											if (productoEncontrado) {
												return Producto.update({
													nombre: producto.nombre,
													codigo: producto.codigo,
													unidad_medida: producto.unidad_medida,
													precio_unitario: producto.precio_unitario,
													utilidad_esperada: producto.utilidad_esperada,
													inventario_minimo: producto.inventario_minimo,
													descripcion: producto.descripcion,
													id_grupo: claseGrupoEncontrado.id,
													id_subgrupo: claseSubGrupoEncontrado.id,
													caracteristica_especial1: producto.caracteristica_especial1,
													caracteristica_especial2: producto.caracteristica_especial2,
													imagen: './img/icon-producto-default.png',
													codigo_fabrica: producto.codigo_fabrica,
													comision: producto.comision,
													alerta: producto.alerta,
													descuento: producto.descuento,
													descuento_fijo: producto.descuento_fijo,
													marca: producto.marca,
													id_tipo_producto: tipo_producto ? tipo_producto : producto_base,
													activo_fijo: req.body.activo_fijo,
													activar_inventario: producto.activar_inventario
												}, {
														where: {
															id: productoEncontrado.id
														},
														transaction: t
													}).then(function (creado) {
														return new Promise(function (fulfill, reject) {
															fulfill(creado)
														});
													}).catch(function (err) {
														return new Promise(function (fulfill, reject) {
															reject((err.stack !== undefined) ? err.stack : err);
														});
													});
											} else {
												return Producto.create({
													id_empresa: req.body.id_empresa,
													nombre: producto.nombre,
													codigo: producto.codigo,
													unidad_medida: producto.unidad_medida,
													precio_unitario: producto.precio_unitario,
													utilidad_esperada: producto.utilidad_esperada,
													inventario_minimo: producto.inventario_minimo,
													descripcion: producto.descripcion,
													id_grupo: claseGrupoEncontrado.id,
													id_subgrupo: claseSubGrupoEncontrado.id,
													caracteristica_especial1: producto.caracteristica_especial1,
													caracteristica_especial2: producto.caracteristica_especial2,
													imagen: './img/icon-producto-default.png',
													codigo_fabrica: producto.codigo_fabrica,
													comision: producto.comision,
													alerta: producto.alerta,
													descuento: producto.descuento,
													descuento_fijo: producto.descuento_fijo,
													id_tipo_producto: tipo_producto ? tipo_producto : producto_base,
													marca: producto.marca,
													activo_fijo: producto.activo_fijo,
													activar_inventario: producto.activar_inventario
												}, { transaction: t }).then(function (creado) {
													return new Promise(function (fulfill, reject) {
														fulfill(creado)
													});
												}).catch(function (err) {
													return new Promise(function (fulfill, reject) {
														reject((err.stack !== undefined) ? err.stack : err);
													});
												});
											}
										}).catch(function (err) {
											return new Promise(function (fulfill, reject) {
												reject((err.stack !== undefined) ? err.stack : err);
											});
										})

									}).catch(function (err) {
										return new Promise(function (fulfill, reject) {
											reject((err.stack !== undefined) ? err.stack : err);
										});
									})

								}).catch(function (err) {
									return new Promise(function (fulfill, reject) {
										reject((err.stack !== undefined) ? err.stack : err);
									});
								})
							}).then(function (result) {
								if (index === (array.length - 1)) {
									res.json({ mensaje: "¡Datos de Productos actualizados satisfactoriamente!" });
								}
							}).catch(function (err) {
								res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
							});
						});


					}).catch(function (err) {
						res.json({ hasError: true, mensaje: err.stack });
					});
				}).catch(function (err) {
					res.json({ hasError: true, mensaje: err.stack });
				});
				// });
			}).catch(function (err) {
				res.json({ hasError: true, mensaje: err.stack });
			});;
		});

	function crearFormulacion(producto, req, t) {
		return Producto.find({
			where: {
				codigo: producto.codigo_final.toString(),
				id_empresa: req.params.id_empresa
			},
			transaction: t
		}).then(function (productoFinal) {
			if (productoFinal) {
				return Producto.find({
					where: {
						codigo: producto.codigo_base.toString(),
						id_empresa: req.params.id_empresa
					},
					transaction: t
				}).then(function (productoBase) {
					if (productoBase) {
						return ProductoBase.findOrCreate({
							where: {
								id_producto: productoFinal.dataValues.id,
								id_producto_base: productoBase.id
							},
							transaction: t,
							lock: t.LOCK.UPDATE,
							defaults: {
								id_producto: productoFinal.dataValues.id,
								id_producto_base: productoBase.id,
								formulacion: parseFloat(producto.formulacion)
							}
						}).spread(function (ProductoCr, created) {
							if (!created) {
								return ProductoBase.update({
									id_producto: productoFinal.dataValues.id,
									id_producto_base: productoBase.id,
									formulacion: parseFloat(producto.formulacion)
								}, { transaction: t, where: { id: ProductoCr.id } }).then(function (dato) {
									return new Promise(function (fullfill, reject) {
										fullfill()
									})
								});
							}
						})

					} else {
						return new Promise(function (fullfill, reject) {
							fullfill({ hasErr: true, mensaje: 'No se encuentra en la base de datos el producto: ' + producto.nombre_base + ' Código: ' + producto.codigo_base })
						})
					}
				});
			} else {
				return new Promise(function (fullfill, reject) {
					fullfill({ hasErr: true, mensaje: 'No se encuentra en la base de datos el producto: ' + producto.nombre_final + ' Código: ' + producto.codigo_final })
				})
			}
		});
	}

	router.route('/productos/formulacion/empresa/:id_empresa')
		.post(function (req, res) {
			var promesas = []
			sequelize.transaction(function (t) {
				for (let index = 0; index < req.body.length; index++) {
					promesas.push(crearFormulacion(req.body[index], req, t))
				}
				return Promise.all(promesas)
			}).then(function (result) {
				if (result.length > 0) {
					var mensajes = []
					result.forEach(function (dato) {
						if (dato !== undefined) {
							if (dato.hasErr) {
								mensajes.push(dato.mensaje)
							}
						}
					});
					if (mensajes.length === result.length) {
						mensajes.unshift('No se guardo')
						res.json({ hasErr: true, mensaje: 'No se guardo', mensajes: mensajes })
					} else if (mensajes.length === 0) {
						res.json({ mensaje: 'Guardado correctamente.' })
					} else {
						mensajes.unshift('Cantidad guardados correctamente: ' + (result.length - mensajes.length) + ', Cantidad no guardados: ' + mensajes.length)
						res.json({ hasErr: true, mensaje: 'Cantidad guardados correctamente: ' + (result.length - mensajes.length) + ', Cantidad no guardados: ' + mensajes.length, mensajes: mensajes })
					}
				} else {
					res.json({ mensaje: 'No se guardo, ocurrio un error.' })
				}
				// res.json({ mensaje: "¡Formulación de Productos actualizados satisfactoriamente!" });
			}).catch(function (err) {
				res.json({ hasError: true, mensaje: err.stack });
			});
		});

	router.route('/productos/:id_producto')
		.put(function (req, res) {
			Producto.update({
				id_empresa: req.body.id_empresa,
				nombre: req.body.nombre,
				codigo: req.body.codigo,
				unidad_medida: req.body.unidad_medida,
				precio_unitario: req.body.precio_unitario,
				utilidad_esperada: req.body.utilidad_esperada,
				inventario_minimo: req.body.inventario_minimo,
				descripcion: req.body.descripcion,
				id_grupo: req.body.grupo.id,
				id_subgrupo: req.body.subgrupo.id,
				caracteristica_especial1: req.body.caracteristica_especial1,
				caracteristica_especial2: req.body.caracteristica_especial2,
				//imagen:imagen,
				codigo_fabrica: req.body.codigo_fabrica,
				comision: req.body.comision,
				publicar_panel: req.body.publicar_panel,
				alerta: req.body.alerta,
				descuento: req.body.descuento,
				descuento_fijo: req.body.descuento_fijo,
				id_tipo_producto: req.body.tipoProducto.id,
				activar_inventario: req.body.activar_inventario,
				marca: req.body.marca,
				modelo: req.body.modelo,
				anio: req.body.anio,
				id_almacen_erp: (req.body.almacenErp ? req.body.almacenErp.id : null),
				id_cuenta: (req.body.cuenta ? req.body.cuenta.id : null),
				rango_positivo: req.body.rango_positivo,
				rango_negativo: req.body.rango_negativo,
				activo_fijo: req.body.activo_fijo
			}, {
					where: {
						id: req.params.id_producto
					}
				}).then(function (productoCreado) {
					req.body.productosBase.forEach(function (productoBase, index, array) {
						if (productoBase.eliminado) {
							ProductoBase.destroy({
								where: { id: productoBase.id }
							}).then(function (productoBaseEliminado) {

							});
						} else {
							if (productoBase.id) {
								ProductoBase.update({
									id_producto: productoCreado.id,
									id_producto_base: productoBase.productoBase.id,
									formulacion: productoBase.productoBase.formulacion
								}, {
										where: { id: productoBase.id }
									}).then(function (productoBaseActualizado) {

									});
							} else {
								ProductoBase.create({
									id_producto: req.params.id_producto,
									id_producto_base: productoBase.productoBase.id,
									formulacion: productoBase.productoBase.formulacion
								}).then(function (productoBaseCreado) {

								});
							}
						}
					});
					Clase.find({
						where: { nombre_corto: 'OAL' }
					}).then(function (clase) {
						if (clase.nombre == "ONLINE") {
							if ((req.body.imagen.indexOf('default') > -1 || req.body.imagen.indexOf("producto-" + req.body.id) > -1 || req.body.imagen.indexOf(req.body.id) > -1) && req.body.imagen.length < 200) {
								actualizarImagenProducto(req.body, req, res, null, req.body.imagen);
							} else {
								signs3('agil_imagenes/producto-' + req.body.id + '.jpg', 'image/jpeg', function (signedRequest, url) {
									actualizarImagenProducto(req.body, req, res, signedRequest, url);
								});
							}
						} else {
							if ((req.body.imagen.indexOf('default') > -1 || req.body.imagen.indexOf("producto-" + req.body.id) > -1 || req.body.imagen.indexOf(req.body.id) > -1) && req.body.imagen.length < 200) {
								actualizarImagenProducto(req.body, req, res, null, req.body.imagen);
							} else {
								var imgPerson = decodeBase64Image(req.body.imagen);
								fs.writeFileSync('./img/producto-' + req.body.id + '.jpg', imgPerson.data, 'base64', function (err) { });
								var imagen = 'img/producto-' + req.body.id + '.jpg';
								actualizarImagenProducto(req.body, req, res, null, imagen);
							}
						}
					});
				});
		})

		.delete(function (req, res) {
			DetalleMovimiento.find({
				where: {
					id_producto: req.params.id_producto
				},
			}).then(function (detalleMovimientoProducto) {
				if (!detalleMovimientoProducto) {
					Producto.destroy({
						where: {
							id: req.params.id_producto
						}
					}).then(function (affectedRows) {
						res.json({ message: "Eliminado Satisfactoriamente!" });
					});
				} else {
					res.json({ movimiento: detalleMovimientoProducto, message: "Atencion no se puede eliminar este item porque tiene movimientos!" });
				}

			})

		})

		.get(function (req, res) {
			Producto.find({
				where: { id: req.params.id_producto },
				include: [{ model: Empresa, as: 'empresa' },
				{ model: Clase, as: 'tipoProducto' },
				{ model: Clase, as: 'grupo' },
				{ model: ProductoTipoPrecio, as: 'tiposPrecio', include: [{ model: Clase, as: 'tipoPrecio' }] },
				{ model: Clase, as: 'subgrupo' },
				{
					model: Almacen, as: 'almacenErp',
					include: [{ model: Sucursal, as: 'sucursal' },]
				},
				{ model: ContabilidadCuenta, as: 'cuenta' },
				{
					model: ProductoBase, as: 'productosBase',
					include: [{ model: Producto, as: 'productoBase' }]
				}]
			}).then(function (producto) {
				res.json(producto);
			});
		});

	function actualizarImagenProducto(productoCreado, req, res, signedRequest, imagen) {
		Producto.update({
			imagen: imagen
		}, {
				where: { id: productoCreado.id }
			}).then(function (affecteedRows) {
				if (req.body.tiposPrecio.length > 0) {
					req.body.tiposPrecio.forEach(function (tipoP, index, array) {
						if (tipoP.id) {
							ProductoTipoPrecio.update({
								id_producto: productoCreado.id,
								id_tipo_precio: tipoP.tipoPrecio.id,
								precio_unitario: tipoP.precio_unitario,
								rango_positivo: tipoP.rango_positivo,
								rango_negativo: tipoP.rango_negativo,
								eliminado: tipoP.eliminado
							}, {
									where: { id: tipoP.id }
								}).then(function (actualizado) {
									if (index === (array.length - 1)) {
										res.json({ producto: productoCreado, url: imagen, signedRequest: signedRequest, image_name: 'producto-' + productoCreado.id + '.jpg' });
									}
								})
						} else {
							ProductoTipoPrecio.create({
								id_producto: productoCreado.id,
								id_tipo_precio: tipoP.tipoPrecio.id,
								precio_unitario: tipoP.precio_unitario,
								rango_positivo: tipoP.rango_positivo,
								rango_negativo: tipoP.rango_negativo,
								eliminado: false
							}).then(function (creado) {
								if (index === (array.length - 1)) {
									res.json({ producto: productoCreado, url: imagen, signedRequest: signedRequest, image_name: 'producto-' + productoCreado.id + '.jpg' });
								}
							})
						}

					})
				} else {
					res.json({ producto: productoCreado, url: imagen, signedRequest: signedRequest, image_name: 'producto-' + productoCreado.id + '.jpg' });
				}
			});
	}

	router.route('/productos/empresa/:id_empresa/cliente/:id_cliente/texto/:texto/sucursales/:ids')
		.get(function (req, res) {
			var condicionProducto = { id_empresa: req.params.id_empresa };
			if (req.params.texto != 0) {
				condicionProducto = { id_empresa: req.params.id_empresa, $or: [{ nombre: { $like: '%' + req.params.texto + '%' } }, { codigo: req.params.texto }, { descripcion: { $like: '%' + req.params.texto + '%' } }] };
			}

			Producto.findAll({
				where: condicionProducto,
				include: [{
					model: DetalleVenta, as: 'detallesVenta',
					include: [{ model: Venta, as: 'venta', where: { id_cliente: req.params.id_cliente } }]
				},
				{ model: Clase, as: 'tipoProducto' },
				{
					model: Inventario, as: 'inventarios', where: { id_almacen: { $not: null } }, required: false,
					include: [{ model: Almacen, as: 'almacen', where: { id_sucursal: { $in: req.params.ids.split(',') } } }]
				}],
				order: [['nombre', 'ASC']]
			}).then(function (productos) {
				productos = (productos) ? productos : [];
				var ids = [];
				for (var i = 0; i < productos.length; i++) {
					ids.push(productos[i].id);;
				}
				var condicionProductosRestantes;
				condicionProductosRestantes = (ids.length > 0) ? { id: { $notIn: ids }, id_empresa: req.params.id_empresa } : {};
				if (req.params.texto != 0 && ids.length > 0) {
					condicionProductosRestantes = { id: { $notIn: ids }, id_empresa: req.params.id_empresa, $or: [{ nombre: { $like: '%' + req.params.texto + '%' } }, { codigo: req.params.texto }, { descripcion: { $like: '%' + req.params.texto + '%' } }] }
				} else if (req.params.texto != 0 && ids.length == 0) {
					condicionProductosRestantes = { id_empresa: req.params.id_empresa, $or: [{ nombre: { $like: '%' + req.params.texto + '%' } }, { codigo: req.params.texto }, { descripcion: { $like: '%' + req.params.texto + '%' } }] }
				}
				Producto.findAll({
					where: condicionProductosRestantes,
					include: [{
						model: Inventario, as: 'inventarios', where: { id_almacen: { $not: null } }, required: false,
						include: [{ model: Almacen, as: 'almacen', where: { id_sucursal: { $in: req.params.ids.split(',') } } }]
					},
					{ model: Clase, as: 'tipoProducto' }],
					order: [['nombre', 'ASC']]
				}).then(function (productosRestantes) {
					productos = productos.concat(productosRestantes);
					res.json(productos);
				});
			});
		});

	router.route('/productos-panel/empresa/:id_empresa/almacen/:id_almacen/user/:id_usuario')
		.get(function (req, res) {
			UsuarioGrupos.findAll({
				where: { id_usuario: req.params.id_usuario }
			}).then(function (grupos) {
				var gruposUsuario = grupos.map(function (grupo) {
					return grupo.id_grupo
				})
				Producto.findAll({
					where: { id_empresa: req.params.id_empresa, publicar_panel: true, id_grupo: { $in: gruposUsuario } },
					include: [
						{ model: ProductoTipoPrecio, as: 'tiposPrecio', include: [{ model: Clase, as: 'tipoPrecio' }] },
						{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
						{ model: Clase, as: 'tipoProducto' },
						{
							model: ProductoBase, as: 'productosBase', required: false,
							include: [{
								model: Producto, as: 'productoBase', required: false,
								include: [{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
								{ model: Clase, as: 'tipoProducto' },
								{
									model: ProductoBase, as: 'productosBase', required: false,
									include: [{
										model: Producto, as: 'productoBase', required: false,
										include: [{ model: Inventario, as: 'inventarios', required: false, where: { id_almacen: req.params.id_almacen, cantidad: { $gte: 0 } } },
										{ model: Clase, as: 'tipoProducto' }]
									}]
								}]
							}]
						}],
					order: [[{ model: Inventario, as: 'inventarios' }, 'updatedAt', 'DESC']]
				}).then(function (productos) {
					res.json(productos);
				}).catch(function (err) {
					res.json([{ hasError: true, mensaje: err.stack + '---LN 523 rutas productos' }]);
				});
			}).catch(function (err) {
				res.json([{ hasError: true, mensaje: err.stack + '---LN 517 rutas productos' }]);
			});
		});

	router.route('/comision-productos-vendedor/empresa/:id_empresa/usuario/:id_usuario')
		.get(function (req, res) {
			var gruposProductos = []
			UsuarioGrupos.findAll({
				where: { id_usuario: req.params.id_usuario }
			}).then(function (grupos) {
				if (grupos.length == 0) {
					res.json([{ mensaje: 'El usuario no cuenta con grupos de productos asignados!' }])
				} else {
					grupos.map(function (grupo, i) {
						gruposProductos.push(grupo.id_grupo)
						if (i == grupos.length - 1) {
							obtenerComisionesProductoVendedor(req, res, true, gruposProductos);
						}
					})
				}
			}).catch(function (err) {
				res.json([{ mensaje: err.stack }])
			})
		})

		.put(function (req, res) {
			Usuario.update({
				comision_general: req.body.comision_general,
				comision_activa: req.body.comision_activa,
			}, {
					where: { id: req.params.id_usuario }
				}).then(function (usuarioActualizado) {
					req.body.productos.forEach(function (producto, index, array) {
						ComisionVendedorProducto.update({
							comision: producto.comisionesVendedores[0].comision
						}, {
								where: { id: producto.comisionesVendedores[0].id }
							}).then(function (comisionesVendedor) {
								if (index === (array.length - 1)) {
									res.json({ mensaje: "Comisiones de Productos actualizados satisfactoriamente!" });
								}
							});
					});
				});
		});

	function obtenerComisionesProductoVendedor(req, res, verificar, gruposProductos) {
		var configuracionesPremisa = obtenerComisionesProductoPremisa(req, true, gruposProductos);
		configuracionesPremisa.then(function (entities) {
			if (entities.length > 0) {
				if (verificar) {
					// verificarProductosFaltantes(req, res, entities);
					devolverComisiones(entities, res);
				} else {
					devolverComisiones(entities, res);
				}
			} else {
				crearComisionesProductoVendedor(req, res, gruposProductos);
			}
		});
	}

	function obtenerComisionesProductoPremisa(req, required, gruposProductos) {

		return Producto.findAll({
			where: { id_empresa: req.params.id_empresa, id_grupo: { $in: gruposProductos } },
			include: [{ model: ComisionVendedorProducto, as: 'comisionesVendedores', where: { id_usuario: req.params.id_usuario }, required: required }]
		});

		//old change at 06/04/2018
		// return Producto.findAll({
		// 	where: { id_empresa: req.params.id_empresa },
		// 	include: [{ model: ComisionVendedorProducto, as: 'comisionesVendedores', where: { id_usuario: req.params.id_usuario }, required: required }]
		// });
	}

	function verificarProductosFaltantes(req, res, originalEntities) {
		var productIds = [];
		for (var i = 0; i < originalEntities.length; i++) {
			productIds.push(originalEntities[i].id);
		}
		Producto.findAll({
			where: { id_empresa: req.params.id_empresa, id: { $notIn: productIds } }
		}).then(function (productosFaltantes) {
			if (productosFaltantes.length > 0) {
				for (var i = 0; i < productosFaltantes.length; i++) {
					productosFaltantes[i] = productosFaltantes[i].id;
				}
				crearComisionesVendedor(req, res, productosFaltantes);
			} else {
				devolverComisiones(originalEntities, res)
			}
		});
	}

	function devolverComisiones(entities, res) {
		res.json(entities);
	}

	function crearComisionesProductoVendedor(req, res, gruposProductos) {
		Producto.findAll({
			where: {
				id_empresa: req.params.id_empresa, id_grupo: { $in: gruposProductos }, activo_fijo: false
			}
		}).then(function (productos) {
			productos.forEach(function (producto, index, array) {
				ComisionVendedorProducto.create({
					id_producto: producto.id,
					id_usuario: req.params.id_usuario
				}).then(function (score) {
					if (index === (array.length - 1)) {
						obtenerComisionesProductoVendedor(req, res, false, gruposProductos);
						// res.json(productos)
					}
				});
			});
		});
	}

	function crearComisionesVendedor(req, res, ids) {
		Producto.findAll({
			where: {
				id: { $in: ids }, activo_fijo: false
			}
		}).then(function (productos) {
			productos.forEach(function (producto, index, array) {
				ComisionVendedorProducto.create({
					id_producto: producto.id,
					id_usuario: req.params.id_usuario
				}).then(function (score) {
					if (index === (array.length - 1)) {
						obtenerComisionesProductoVendedor(req, res, false);
					}
				});
			});
		});
	}

	router.route('/vencimientos-productos/:id_empresa')
		.get(function (req, res) {
			Clase.find({
				where: { nombre: "VENCIMIENTO DE PRODUCTOS" },
				include: [{ model: Tipo, as: 'tipo', where: { id_empresa: req.params.id_empresa } }]
			}).then(function (diasVencimientoDeudas) {
				var diasParametro = parseInt(diasVencimientoDeudas.nombre_corto);
				var fechaActual = new Date();
				Inventario.findAll({
					where: { fecha_vencimiento: { $not: null }, cantidad: { $gt: 0 } },
					include: [{
						model: Producto, as: 'producto', where: { id_empresa: req.params.id_empresa },
						include: [{ model: Clase, as: 'tipoProducto' }]
					},
					{
						model: Almacen, as: 'almacen',
						include: [{ model: Sucursal, as: 'sucursal' }]
					}],
					order: [['fecha_vencimiento', 'asc']]
				}).then(function (inventarios) {
					var inventariosFiltrados = [];
					if (inventarios.length > 0) {
						inventarios.forEach(function (inventario, index, arrayP) {
							var timeDiff = Math.abs(fechaActual.getTime() - inventario.fecha_vencimiento.getTime());
							var diferencia = Math.ceil(timeDiff / (1000 * 3600 * 24));
							if (diferencia <= diasParametro) {
								inventariosFiltrados.push(inventario);
							}
							if (index === (arrayP.length - 1)) {
								res.json(inventariosFiltrados);
							}
						});
					} else {
						res.json(inventariosFiltrados);
					}
				});
			});
		});

	router.route('/producto/empresa/:id_empresa/siguiente-codigo')
		.get(function (req, res) {
			sequelize.query("SELECT MAX(CAST(SUBSTRING(codigo, 3, 5) AS UNSIGNED)) as ultimo_codigo FROM agil_producto where empresa=" + req.params.id_empresa, { type: sequelize.QueryTypes.SELECT })
				.then(function (dato) {
					if (dato[0].ultimo_codigo == 99999) {
						sequelize.query("SELECT MAX(CAST(SUBSTRING(codigo, 3, 6) AS UNSIGNED)) as ultimo_codigo FROM agil_producto where empresa=" + req.params.id_empresa + " and SUBSTRING(codigo,1,2) = 'FC'", { type: sequelize.QueryTypes.SELECT })
							.then(function (dato2) {
								if (dato[0].ultimo_codigo < dato2[0].ultimo_codigo) {
									res.json(dato2[0]);
								} else {
									res.json(dato[0]);
								}
							});
					} else {
						res.json(dato[0]);
					}
				});
		});

	router.route('/catalogo-productos/empresa/:id_empresa/grupo/:id_grupo/user/:id_usuario')
		.get(function (req, res) {
			var condicionProducto = "empresa=" + req.params.id_empresa
			if (req.params.id_grupo != 0) {
				Producto.findAll({
					where: { id_empresa: req.params.id_empresa, id_grupo: req.params.id_grupo },
					include: [{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }]
				}).then(function (productos) {
					res.json({ catalogo: productos });
				}).catch(function (err) {
					res.json({ catalogo: [], hasError: true, mensaje: err.stack });
				});
			} else {
				UsuarioGrupos.findAll({
					where: { id_usuario: req.params.id_usuario }
				}).then(function (grupos) {
					var grupoLiteral = '('
					var grupoArray = []
					grupos.forEach(function (grupo, i) {
						grupoArray.push(grupo.id_grupo)
					})
					Producto.findAll({
						where: { id_empresa: req.params.id_empresa, id_grupo: { $in: grupoArray } },
						include: [{ model: Clase, as: 'grupo' }, { model: Clase, as: 'subgrupo' }]
					}).then(function (productos) {
						res.json({ catalogo: productos });
					}).catch(function (err) {
						res.json({ catalogo: [], hasError: true, mensaje: err.stack });
					});
				}).catch(function (err) {
					res.json({ catalogo: [], hasError: true, mensaje: err.stack });
				});
			}
		});

	//buscar por subgrupo de productos, paginador Asignacion de producos proveedor (Pedidos).
	router.route('/productos/asignacion/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/subgrupo/:id_subgrupo/user/:id_user')
		.get(function (req, res) {
			var gruposProductos = ''
			UsuarioGrupos.findAll({
				where: { id_usuario: req.params.id_user }
			}).then(function (grupos) {
				if (grupos.length == 0) {
					res.json({ productos: [], hasError: true, mensaje: 'Los grupos del usuario no cuentan con productos.' });
				} else {
					grupos.forEach(function (grupo, i) {
						if (i == grupos.length - 1) {
							gruposProductos += grupo.id_grupo + ''
						} else {
							gruposProductos += grupo.id_grupo + ','
						}
					})
					var condicionProducto = "empresa=" + req.params.id_empresa, paginas, limit;
					if (req.params.texto_busqueda != 0) {
						condicionProducto = condicionProducto + " and (\
					codigo LIKE '%"+ req.params.texto_busqueda + "%' or \
					producto.nombre LIKE '%"+ req.params.texto_busqueda + "%' or \
					unidad_medida LIKE '%"+ req.params.texto_busqueda + "%' or \
					descripcion LIKE '%"+ req.params.texto_busqueda + "%' or \
					grupo.nombre LIKE '%"+ req.params.texto_busqueda + "%' or \
					subgrupo.nombre LIKE '%"+ req.params.texto_busqueda + "%')";
					}
					if (req.params.id_subgrupo != 0) {
						condicionProducto += ' and producto.subgrupo =' + req.params.id_subgrupo
					}
					sequelize.query("select count(producto.id) as cantidad_productos \
								from agil_producto as producto \
								LEFT OUTER JOIN gl_clase AS grupo ON (producto.grupo = grupo.id) \
								LEFT OUTER JOIN gl_clase AS subgrupo ON (producto.subgrupo = subgrupo.id) \
								WHERE "+ condicionProducto + " and producto.grupo in (" + gruposProductos + ")", { type: sequelize.QueryTypes.SELECT })
						.then(function (data) {
							if (req.params.items_pagina != 0) {
								limit = " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina;
								paginas = Math.ceil(data[0].cantidad_productos / req.params.items_pagina);
							} else {
								limit = "";
								paginas = 1;
							}
							sequelize.query("select producto.id,producto.publicar_panel,producto.activar_inventario,producto.codigo,producto.nombre as nombre,producto.imagen,producto.unidad_medida,producto.precio_unitario,producto.inventario_minimo,producto.descripcion,tipoProducto.nombre as tipoProducto,grupo.nombre as grupo, grupo.id as id_grupo,subgrupo.nombre as subgrupo, subgrupo.id as id_subgrupo\
						from agil_producto as producto\
						LEFT OUTER JOIN gl_clase AS tipoProducto ON (producto.tipo_producto = tipoProducto.id)\
						LEFT OUTER JOIN gl_clase AS grupo ON (producto.grupo = grupo.id)\
						LEFT OUTER JOIN gl_clase AS subgrupo ON (producto.subgrupo = subgrupo.id)\
						WHERE "+ condicionProducto + " and producto.grupo in (" + gruposProductos + ") \
						ORDER BY producto."+ req.params.columna + " " + req.params.direccion + limit, { type: sequelize.QueryTypes.SELECT })
								.then(function (productos) {
									res.json({ productos: productos, paginas: paginas });
								}).catch(function (err) {
									res.json({ productos: [], hasError: true, mensaje: err.stack });
								});
						}).catch(function (err) {
							res.json({ productos: [], hasError: true, mensaje: err.stack });
						});
				}
			}).catch(function (err) {
				res.json({ productos: [], hasError: true, mensaje: err.stack });
			})
		});

	// Paginador productos asignados proveedor (Pedidos)
	router.route('/productos/asignados/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/subgrupo/:id_subgrupo/user/:id_user/:ids')
		.get(function (req, res) {
			var gruposProductos = ''
			UsuarioGrupos.findAll({
				where: { id_usuario: req.params.id_user }
			}).then(function (grupos) {
				if (grupos.length == 0) {
					res.json({ productos: [], hasError: true, mensaje: 'Los grupos del usuario no cuentan con productos.' });
				} else {
					grupos.forEach(function (grupo, i) {
						if (i == grupos.length - 1) {
							gruposProductos += grupo.id_grupo + ''
						} else {
							gruposProductos += grupo.id_grupo + ','
						}
					})
					var condicionProducto = "producto.id in (" + req.params.ids + ") and empresa=" + req.params.id_empresa, paginas, limit;
					if (req.params.texto_busqueda != 0) {
						condicionProducto = condicionProducto + " and (\
					codigo LIKE '%"+ req.params.texto_busqueda + "%' or \
					producto.nombre LIKE '%"+ req.params.texto_busqueda + "%' or \
					unidad_medida LIKE '%"+ req.params.texto_busqueda + "%' or \
					descripcion LIKE '%"+ req.params.texto_busqueda + "%' or \
					grupo.nombre LIKE '%"+ req.params.texto_busqueda + "%' or \
					subgrupo.nombre LIKE '%"+ req.params.texto_busqueda + "%')";
					}
					if (req.params.id_subgrupo != 0) {
						condicionProducto += ' and producto.subgrupo =' + req.params.id_subgrupo
					}
					sequelize.query("select count(producto.id) as cantidad_productos \
								from agil_producto as producto \
								LEFT OUTER JOIN gl_clase AS grupo ON (producto.grupo = grupo.id) \
								LEFT OUTER JOIN gl_clase AS subgrupo ON (producto.subgrupo = subgrupo.id) \
								WHERE "+ condicionProducto + " and producto.grupo in (" + gruposProductos + ")", { type: sequelize.QueryTypes.SELECT })
						.then(function (data) {
							if (req.params.items_pagina != 0) {
								limit = " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina;
								paginas = Math.ceil(data[0].cantidad_productos / req.params.items_pagina);
							} else {
								limit = "";
								paginas = 1;
							}
							sequelize.query("select producto.id,producto.publicar_panel,producto.activar_inventario,producto.codigo,producto.nombre as nombre,producto.imagen,producto.unidad_medida,producto.precio_unitario,producto.inventario_minimo,producto.descripcion,tipoProducto.nombre as tipoProducto,grupo.nombre as grupo, grupo.id as id_grupo,subgrupo.nombre as subgrupo, subgrupo.id as id_subgrupo\
						from agil_producto as producto\
						LEFT OUTER JOIN gl_clase AS tipoProducto ON (producto.tipo_producto = tipoProducto.id)\
						LEFT OUTER JOIN gl_clase AS grupo ON (producto.grupo = grupo.id)\
						LEFT OUTER JOIN gl_clase AS subgrupo ON (producto.subgrupo = subgrupo.id)\
						WHERE "+ condicionProducto + " and producto.grupo in (" + gruposProductos + ") \
						ORDER BY producto."+ req.params.columna + " " + req.params.direccion + limit, { type: sequelize.QueryTypes.SELECT })
								.then(function (productos) {
									res.json({ productos: productos, paginas: paginas });
								}).catch(function (err) {
									res.json({ productos: [], hasError: true, mensaje: err.stack });
								});
						}).catch(function (err) {
							res.json({ productos: [], hasError: true, mensaje: err.stack });
						});
				}
			}).catch(function (err) {
				res.json({ productos: [], hasError: true, mensaje: err.stack });
			})
		});
	router.route('/importar-precios-productos/:id_empresa')
		.post(function (req, res) {
			var promises = []
			sequelize.transaction(function (t) {
				req.body.forEach(function (producto, index, array) {
					promises.push(Producto.find({
						where: { id_empresa: req.params.id_empresa, codigo: producto.codigo }, transaction: t
					}).then(function (ProductoEncontrado) {
						return ProductoTipoPrecio.findOrCreate({
							where: {
								id_producto: ProductoEncontrado.id,
								id_tipo_precio: producto.tipoPrecio.id,
							},
							transaction: t,
							lock: t.LOCK.UPDATE,
							defaults: {
								id_producto: ProductoEncontrado.id,
								id_tipo_precio: producto.tipoPrecio.id,
								precio_unitario: producto.precio_unitario,
								rango_positivo: producto.rango_positivo,
								rango_negativo: producto.rango_negativo,
								eliminado: false
							}
						}).spread(function (precoProducto, created) {
							if (!created) {
								return ProductoTipoPrecio.update({
									precio_unitario: producto.precio_unitario,
									rango_positivo: producto.rango_positivo,
									rango_negativo: producto.rango_negativo,
									eliminado: false
								}, {
										where: { id: precoProducto.id }, transaction: t
									}).then(function (actualizado) {
										return new Promise(function (fulfill, reject) {
											fulfill();
										});
									}).catch(function (err) {
										return new Promise(function (fulfill, reject) {
											reject((err.stack !== undefined) ? err.stack : err);
										});
									})
							} else {
								return new Promise(function (fulfill, reject) {
									fulfill();
								});
							}
						}).catch(function (err) {
							return new Promise(function (fulfill, reject) {
								reject((err.stack !== undefined) ? err.stack : err);
							});
						})
					}).catch(function (err) {
						return new Promise(function (fulfill, reject) {
							reject((err.stack !== undefined) ? err.stack : err);
						});
					}))

				})
				return Promise.all(promises);
			}).then(function (result) {
				res.json({ mensaje: "¡Datos de Productos actualizados satisfactoriamente!" });
			}).catch(function (err) {
				res.json({ hasError: true, mensaje: err.stack });
			});
		})

}