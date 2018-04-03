module.exports = function (router, ensureAuthorizedAdministrador, fs, decodeBase64Image, forEach, jwt, md5, Usuario, Persona, UsuarioRol, Rol, Tipo, Clase,
	Aplicacion, RolAplicacion, Empresa, UsuarioSucursal, Sucursal, UsuarioAplicacion,
	Almacen, SucursalActividadDosificacion, Dosificacion, UsuarioRuta, Ruta, VistaColumnasAplicacion, Diccionario, ComprobanteContabilidad, UsuarioGrupos) {

	router.route('/usuarios')
		.post(function (req, res) {
			Persona.create({
				nombres: req.body.persona.nombres,
				apellido_paterno: req.body.persona.apellido_paterno,
				apellido_materno: req.body.persona.apellido_materno,
				nombre_completo: req.body.persona.nombres + ' ' + req.body.persona.apellido_paterno + ' ' + req.body.persona.apellido_materno
			}).then(function (personaCreada) {
				var imagen;
				if (req.body.persona.imagen.indexOf('default') > -1) {
					imagen = req.body.persona.imagen;
				} else {
					var imagenPersona = decodeBase64Image(req.body.persona.imagen);
					fs.writeFileSync('./img/persona' + personaCreada.id + '.jpg', imagenPersona.data, 'base64', function (err) { });
					imagen = './img/persona' + personaCreada.id + '.jpg';
				}
				Persona.update({
					imagen: imagen
				}, {
						where: { id: personaCreada.id }
					}).then(function (affecteedRows) {
						Usuario.create({
							id_persona: personaCreada.id,
							id_empresa: req.body.id_empresa,
							nombre_usuario: req.body.nombre_usuario,
							clave: md5(req.body.clave),
							activo: req.body.activo
						}).then(function (usuarioCreado) {
							Usuario.update({
								token: jwt.sign(usuarioCreado, 'shhhhh')
							},
								{ where: { id: usuarioCreado.id } }
							).then(function (affectedRows) {
								UsuarioRol.create({
									id_usuario: usuarioCreado.id,
									id_rol: req.body.id_rol
								}).then(function (usuarioRolCreado) {
									req.body.aplicacionesUsuario.forEach(function (aplicacionUsuario, index, array) {
										UsuarioAplicacion.create({
											id_usuario: usuarioCreado.id,
											id_aplicacion: aplicacionUsuario.id_aplicacion,
											puede_crear: aplicacionUsuario.puede_crear,
											puede_ver: aplicacionUsuario.puede_ver,
											puede_modificar: aplicacionUsuario.puede_modificar,
											puede_eliminar: aplicacionUsuario.puede_eliminar
										}).then(function (aplicacionUsuarioCreado) {

										});
									});

									if (req.body.sucursales.length > 0) {
										req.body.sucursales.forEach(function (sucursal, index, array) {
											UsuarioSucursal.create({
												id_usuario: usuarioCreado.id,
												id_sucursal: sucursal.id
											}).then(function (usuarioSucursalCreado) {
												if (req.body.grupos.length > 0) {
													req.body.grupos.map(function (grupo, i) {
														UsuarioGrupos.findOrCreate({
															where: {
																id_usuario: usuarioCreado.id,
																id_grupo: grupo.id
															}
															,
															default: {
																id_usuario: usuarioCreado.id,
																id_grupo: grupo.id
															}
														}).spread(function (gruposUsuarios, created) {
															if (created) {
																if (i === req.body.grupos.length - 1) {
																	if (index === array.length - 1) {
																		res.json(usuarioCreado);
																	}
																}
															}
														})
													})
												} else {
													if (index === array.length - 1) {
														res.json(usuarioCreado);
													}
												}
											});
										});
									} else {
										if (req.body.grupos.length > 0) {
											req.body.grupos.map(function (grupo, i) {
												UsuarioGrupos.findOrCreate({
													where: {
														id_usuario: usuarioCreado.id,
														id_grupo: grupo.id
													}
													,
													default: {
														id_usuario: usuarioCreado.id,
														id_grupo: grupo.id
													}
												}).spread(function (gruposUsuarios, created) {
													if (created) {
														if (i === req.body.grupos.length - 1) {
															res.json(usuarioCreado);
														}
													}else{
														if (i === req.body.grupos.length - 1) {
															res.json(usuarioCreado);
														}
													}
												})
											})
										} else {
											res.json(usuarioCreado);
										}
									}
								});
							});
						});
					});
			});
		})

		.get(function (req, res) {
			Usuario.findAll({
				include: [{ model: Persona, as: 'persona' },
				{ model: UsuarioRol, as: 'rolesUsuario', include: [{ model: Rol, as: 'rol' }] },
				{ model: Empresa, as: 'empresa' },
				{ model: UsuarioSucursal, as: 'sucursalesUsuario', include: [{ model: Sucursal, as: 'sucursal' }] },
				{ model: UsuarioGrupos, as: 'grupos', include: [{ model: Clase, as: 'grupo' }] }
				]
			}).then(function (usuarios) {
				res.json(usuarios);
			});
		});

	router.route('/usuarios/empresa/:id_empresa')
		.get(ensureAuthorizedAdministrador, function (req, res) {
			var idEmpresa = req.params.id_empresa;
			if (idEmpresa != 0) {
				condicion = { id_empresa: idEmpresa }
			} else {
				condicion = {}
			}
			Usuario.findAll({
				where: condicion,
				include: [{ model: Persona, as: 'persona' },
				{ model: UsuarioRol, as: 'rolesUsuario', include: [{ model: Rol, as: 'rol' }] },
				{ model: Empresa, as: 'empresa', include: [{ model: Sucursal, as: 'sucursales' }] },
				{ model: UsuarioSucursal, as: 'sucursalesUsuario', include: [{ model: Sucursal, as: 'sucursal' }] },
				{ model: UsuarioAplicacion, as: 'aplicacionesUsuario', include: [{ model: Aplicacion, as: 'aplicacion' }] },
				{ model: UsuarioRuta, as: 'rutas', include: [{ model: Ruta, as: 'ruta' }] }
				// { model: UsuarioGrupos, as: 'grupos', include: [{ model: Clase, as: 'grupo' }] }
				]
			}).then(function (usuarios) {
				usuarios.forEach(function (usuario, i) {
					UsuarioGrupos.findAll({
						where: {id_usuario: usuario.id},
						include: [{model: Clase, as: 'grupo'}]
					}).then(function (gruposUsuario) {
						usuario.dataValues.grupos = gruposUsuario
						if (i == usuarios.length -1) {
							res.json({ usuarios: usuarios, paginas: Math.ceil(data.count / req.params.items_pagina) });
						}
					})
				})
			});
		})

	router.route('/verificar/usuarios/empresa/:id_empresa')
		.post(function (req, res) {
			Usuario.find({
				where: {
					nombre_usuario: req.body.nombre_usuario,
					clave: md5(req.body.clave),
					id_empresa: req.params.id_empresa
				},
				include: [{ model: Persona, as: 'persona' },
				{
					model: UsuarioRol, as: 'rolesUsuario',
					include: [{ model: Rol, as: 'rol', where: { nombre: Diccionario.ROL_ADMINISTRADOR } }]
				}]
			}).then(function (entidad) {
				if (entidad) {
					if (req.body.id_comprobante) {
						ComprobanteContabilidad.update({
							abierto: req.body.abierto
						}, {
								where: {
									id: req.body.id_comprobante
								}
							}).then(function (comprobanteActualizado) {
								res.json({
									type: true,
									message: "login correcto"
								});
							})
					} else {
						res.json({
							type: true,
							message: "login correcto"
						});
					}

				} else {
					res.json({
						type: false,
						message: "¡Usuario sin permiso!"
					});
				}
			});
		});
	router.route('/usuario/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
		.get(function (req, res) {
			if (req.params.id_empresa == "0") {
				var condicionUsuario = { id_empresa: { $ne: req.params.id_empresa } };
			} else {
				var condicionUsuario = { id_empresa: req.params.id_empresa };
				if (parseInt(req.params.texto_busqueda)) {
					condicionUsuario = { id_empresa: req.params.id_empresa, nit: parseInt(req.params.texto_busqueda) }
				} else if (req.params.texto_busqueda != 0) {
					condicionUsuario = {
						id_empresa: req.params.id_empresa,
						$or: [
							{
								nombre_usuario: {
									$like: "%" + req.params.texto_busqueda + "%"
								}
							}
						]
					};
				}
			}


			var ordenArreglo = [];
			if (req.params.columna == "nombres") {
				ordenArreglo.push({ model: Persona, as: 'persona' });
				req.params.columna = "nombres";
			} else if (req.params.columna == "empresa") {
				ordenArreglo.push({ model: Empresa, as: 'empresa' });
				req.params.columna = "razon_social";
			} else if (req.params.columna == "apellido_paterno") {
				ordenArreglo.push({ model: Persona, as: 'persona' });
				req.params.columna = "apellido_paterno";
			} else if (req.params.columna == "apellido_materno") {
				ordenArreglo.push({ model: Persona, as: 'persona' });
				req.params.columna = "apellido_paterno";
			}
			ordenArreglo.push(req.params.columna);
			ordenArreglo.push(req.params.direccion);
			Usuario.findAndCountAll({

				where: condicionUsuario,
				include: [{ model: Persona, as: 'persona' },
				{ model: UsuarioRol, as: 'rolesUsuario', include: [{ model: Rol, as: 'rol' }] },
				{ model: Empresa, as: 'empresa', include: [{ model: Sucursal, as: 'sucursales' }] },
				{ model: UsuarioSucursal, as: 'sucursalesUsuario', include: [{ model: Sucursal, as: 'sucursal' }] },
				{ model: UsuarioAplicacion, as: 'aplicacionesUsuario', include: [{ model: Aplicacion, as: 'aplicacion' }] },
				{ model: UsuarioRuta, as: 'rutas', include: [{ model: Ruta, as: 'ruta' }] },
				// { model: UsuarioGrupos, as: 'grupos', include: [{ model: Clase, as: 'grupo' }] }
				],
				order: [ordenArreglo]
			}).then(function (data) {
				Usuario.findAll({
					offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
					where: condicionUsuario,
					include: [{ model: Persona, as: 'persona' },
					{ model: UsuarioRol, as: 'rolesUsuario', include: [{ model: Rol, as: 'rol' }] },
					{ model: Empresa, as: 'empresa', include: [{ model: Sucursal, as: 'sucursales' }] },
					{ model: UsuarioSucursal, as: 'sucursalesUsuario', include: [{ model: Sucursal, as: 'sucursal' }] },
					{ model: UsuarioAplicacion, as: 'aplicacionesUsuario', include: [{ model: Aplicacion, as: 'aplicacion' }] },
					{ model: UsuarioRuta, as: 'rutas', include: [{ model: Ruta, as: 'ruta' }] },
					// { model: UsuarioGrupos, as: 'grupos', include: [{ model: Clase, as: 'grupo' }]} 
					],
					order: [ordenArreglo]
				}).then(function (usuarios) {
					usuarios.forEach(function (usuario, i) {
						UsuarioGrupos.findAll({
							where: {id_usuario: usuario.id},
							include: [{model: Clase, as: 'grupo'}]
						}).then(function (gruposUsuario) {
							usuario.dataValues.grupos = gruposUsuario
							if (i == usuarios.length -1) {
								res.json({ usuarios: usuarios, paginas: Math.ceil(data.count / req.params.items_pagina) });
							}
						})
					})
					// res.json({ usuarios: usuariosConGrupos, paginas: Math.ceil(data.count / req.params.items_pagina) });
				});
			});
		});
	router.route('/usuarios/:id_usuario')
		.get(function (req, res) {
			User.find({
				where: {
					id: req.params.user_id
				},
				include: [{ model: Person, as: 'person' }, { model: UserRole, as: 'userRoles' },
				{ model: UsuarioGrupos, as: 'grupos', include: [{ model: Clase, as: 'grupo' }] }
				]
			}).then(function (entity) {
				res.json(entity);
			});
		})

		.put(function (req, res) {
			Persona.update({
				nombres: req.body.persona.nombres,
				apellido_paterno: req.body.persona.apellido_paterno,
				apellido_materno: req.body.persona.apellido_materno,
				nombre_completo: req.body.persona.nombres + ' ' + req.body.persona.apellido_paterno + ' ' + req.body.persona.apellido_materno
			}, {
					where: {
						id: req.body.persona.id
					}
				}).then(function (personaActualizada) {
					var imagen;
					if (req.body.persona.imagen.indexOf('default') > -1 || req.body.persona.imagen.indexOf('persona' + req.body.persona.id) > -1) {
						imagen = req.body.persona.imagen; console.log('entro1');
					} else {
						var imagenPersona = decodeBase64Image(req.body.persona.imagen);
						fs.writeFileSync('./img/persona' + req.body.persona.id + '.jpg', imagenPersona.data, 'base64', function (err) { });
						imagen = './img/persona' + req.body.persona.id + '.jpg'; console.log('entro2');
					}
					Persona.update({
						imagen: imagen
					}, {
							where: { id: req.body.persona.id }
						}).then(function (affecteedRows) {
							Usuario.find({
								where: { id: req.body.id }
							}).then(function (usuarioExistente) {
								var clave;
								if (usuarioExistente.clave != req.body.clave) {
									clave = md5(req.body.clave);
								} else {
									clave = usuarioExistente.clave;
								}
								Usuario.update({
									id_empresa: req.body.id_empresa,
									nombre_usuario: req.body.nombre_usuario,
									clave: clave,
									activo: req.body.activo
								}, {
										where: {
											id: req.body.id
										}
									}).then(function (usuarioCreado) {
										UsuarioRol.update({
											id_usuario: req.body.id,
											id_rol: req.body.id_rol
										}, {
												where: {
													id: req.body.rolesUsuario[0].id
												}
											}).then(function (usuarioRolCreado) {
												UsuarioSucursal.destroy({
													where: {
														id_usuario: req.body.id
													}
												}).then(function (affectedRows) {
													UsuarioAplicacion.destroy({
														where: {
															id_usuario: req.body.id
														}
													}).then(function (affectedRows) {
														if (req.body.sucursales.length > 0) {
															req.body.sucursales.forEach(function (sucursal, index, array) {
																var id_sucursal = sucursal.id ? sucursal.id : sucursal;
																UsuarioSucursal.create({
																	id_usuario: req.body.id,
																	id_sucursal: id_sucursal
																}).then(function (usuarioSucursalCreado) {
																	if (req.body.grupos.length > 0) {
																		req.body.grupos.map(function (grupo, i) {
																			UsuarioGrupos.findOrCreate({
																				where: {
																					id_usuario: req.body.id,
																					id_grupo: grupo.id
																				}
																				,
																				default: {
																					id_usuario: req.body.id,
																					id_grupo: grupo.id
																				}
																			}).spread(function (gruposUsuarios, created) {
																				if (created) {
																					if (index === array.length - 1) {
																						if (i === req.body.grupos.length - 1) {
																							res.json(affectedRows);
																						}
																					}
																				} else {
																					if (index === array.length - 1) {
																						if (i === req.body.grupos.length - 1) {
																							res.json(affectedRows);
																						}
																					}
																				}
																			})
																		})
																	} else {
																		if (index === array.length - 1) {
																			res.json(affectedRows);
																		}
																	}
																});
															});
														} else {
															if (req.body.grupos.length > 0) {
																req.body.grupos.map(function (grupo, i) {
																	UsuarioGrupos.findOrCreate({
																		where: {
																			id_usuario: usuarioCreado.id,
																			id_grupo: grupo.id
																		}
																		,
																		default: {
																			id_usuario: usuarioCreado.id,
																			id_grupo: grupo.id
																		}
																	}).spread(function (gruposUsuarios, created) {
																		if (created) {
																			if (i === array.length - 1) {
																				res.json(affectedRows);
																			}
																		} else {
																			if (i === array.length - 1) {
																				res.json(affectedRows);
																			}
																		}
																	})
																})
															} else {
																res.json(affectedRows);
															}
															// res.json(affectedRows);
														}

														req.body.aplicacionesUsuario.forEach(function (aplicacionUsuario, index, array) {
															UsuarioAplicacion.create({
																id_usuario: req.body.id,
																id_aplicacion: aplicacionUsuario.id_aplicacion,
																puede_crear: aplicacionUsuario.puede_crear,
																puede_ver: aplicacionUsuario.puede_ver,
																puede_modificar: aplicacionUsuario.puede_modificar,
																puede_eliminar: aplicacionUsuario.puede_eliminar
															}).then(function (aplicacionUsuarioCreado) {
																res.json(affectedRows);
															});
														});
													});
												});
											});
									});
							});
						});
				});
		})

		.delete(function (req, res) {
			UsuarioAplicacion.destroy({
				where: {
					id_usuario: req.params.id_usuario
				}
			}).then(function (affectedRows) {
				UsuarioSucursal.destroy({
					where: {
						id_usuario: req.params.id_usuario
					}
				}).then(function (affectedRows) {
					UsuarioRol.destroy({
						where: {
							id_usuario: req.params.id_usuario
						}
					}).then(function (affectedRows) {
						Usuario.find({
							where: {
								id: req.params.id_usuario
							}
						}).then(function (usuario) {
							Persona.destroy({
								where: {
									id: usuario.id_persona
								}
							}).then(function (affectedRows) {
								Usuario.destroy({
									where: {
										id: req.params.id_usuario
									}
								}).then(function (affectedRows) {
									res.json({ message: "Eliminado Satisfactoriamente!" });
								});
							});
						});
					});
				});
			});
		});

	router.route('/usuarios-rutas/:id_usuario')

		.put(function (req, res) {
			UsuarioRuta.destroy({
				where: {
					id_usuario: req.params.id_usuario
				}
			}).then(function (affectedRows) {
				if (req.body.rutas.length > 0) {
					req.body.rutas.forEach(function (ruta, index, array) {
						UsuarioRuta.create({
							id_usuario: ruta.id_usuario,
							id_ruta: ruta.id_ruta,
							activo: ruta.activo
						}).then(function (usuarioRutaCreado) {
							if (index === array.length - 1) {
								res.json(affectedRows);
							}
						});
					});
				} else {
					res.json(affectedRows);
				}
			});
		});

	router.route('/userspassword/:user_id')

		.put(function (req, res) {
			Usuario.update({
				password: md5(req.body.password)
			},
				{
					where: { id: req.params.user_id }
				}).then(function (affectedRows) {
					res.json({ message: "Updated successfully!" });
				});
		});

	router.route('/users/:query')
		.get(function (req, res) {
			User.findAll({
				where: {
					name: {
						$like: '%' + req.params.query + '%'
					}
				}
			}).then(function (users) {
				res.json(users);
			});
		});

	router.route('/autenticar')
		.post(function (req, res) {
			Usuario.find({
				where: {
					nombre_usuario: req.body.nombre_usuario,
					clave: md5(req.body.clave)
				},
				include: [{ model: Persona, as: 'persona' },
				// { model: UsuarioGrupos, as: 'grupos', include: [{ model: Clase, as: 'grupo' }] },
				//{ model: Empresa, as: 'empresa', include: [{ model: Sucursal, as: 'sucursales' }] },
				{
					model: UsuarioRol, as: 'rolesUsuario',
					include: [{
						model: Rol, as: 'rol',
						include: [{
							model: RolAplicacion, as: 'aplicacionesRol',
							include: [{
								model: Aplicacion, as: 'aplicacion', include: [{
									model: Aplicacion, as: 'subaplicaciones',
									include: [{ model: RolAplicacion, as: 'rolAplicaciones' }]
								}]
							}]
						}]
					}]
				},
				{ model: UsuarioAplicacion, as: 'aplicacionesUsuario', include: [{ model: Aplicacion, as: 'aplicacion', include: [{ model: Aplicacion, as: 'subaplicaciones' }] }] }]
			}).then(function (entidad) {
				if (entidad) {
					res.json({
						type: true,
						data: entidad,
						token: entidad.token
					});
				} else {
					res.json({
						type: false,
						data: "¡Usuario o clave incorrecta!"
					});
				}
			});
		});


	router.route('/autenticar-sucursales/:id_usuario')
		.get(function (req, res) {
			UsuarioSucursal.findAll({
				where: {
					id_usuario: req.params.id_usuario
				},
				include: [{
					model: Sucursal, as: 'sucursal',
					include: [{ model: Almacen, as: 'almacenes' },
					{
						model: SucursalActividadDosificacion, as: 'actividadesDosificaciones',
						include: [{ model: Dosificacion, as: 'dosificacion' },
						{ model: Clase, as: 'actividad' }]
					}]
				}]
			}).then(function (entidades) {
				res.json(entidades);
			});
		});


	router.route('/validar')
		.post(function (req, res) {
			Usuario.find({
				where: {
					nombre_usuario: req.body.nombre_usuario
				}
			}).then(function (entidad) {
				if (entidad) {
					res.json({
						type: true,
						message: "¡Usuario ya Exsiste!"
					});
				} else {
					res.json({
						type: false,
						message: "Usuario Disponible"
					});
				}
			});
		});

	router.route('/columnnas-aplicacion/aplicacion/:id_aplicacion')
		.put(function (req, res) {
			if (!req.body.crear) {
				VistaColumnasAplicacion.update({
					configuracion: JSON.stringify(req.body.configuracion)
				}, {
						where: {
							id_empresa: req.body.id_empresa,
							id_aplicacion: req.params.id_aplicacion
						}
					}).then(function (vistaActualizada) {
						VistaColumnasAplicacion.find({
							where: {
								id_empresa: req.body.id_empresa,
								id_aplicacion: req.params.id_aplicacion
							}
						}).then(function (vista) {
							res.json(vista);
						});
					});
			} else {
				VistaColumnasAplicacion.findOrCreate({
					where: {
						id_empresa: req.body.id_empresa,
						id_aplicacion: req.params.id_aplicacion
					},
					defaults: { configuracion: JSON.stringify(req.body.configuracion) }
				}).then(function (vista) {
					res.json(vista[0]);
				});
			}
		});
	router.route('/usar-lector-de-barra/usuario')
		.put(function (req, res) {
			Usuario.update({
				usar_lector_de_barra: req.body.usar_lector_de_barra,
			}, {
					where: {
						id: req.body.id
					}
				}).then(function (entidad) {
					res.json({ mensaje: "actualizado Satisfactoriamente!" });
				});
		});
}