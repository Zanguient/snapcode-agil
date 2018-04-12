module.exports = function (router, Usuario, MedicoPaciente, Persona, Empresa, Sucursal, MedicoPrerequisito, Clase, Diccionario, Tipo, decodeBase64Image, fs, MedicoVacuna, VacunaDosis,
	MedicoPacienteVacuna, MedicoPacienteVacunaDosis, MedicoPacienteConsulta, MedicoPacienteFicha, sequelize, Sequelize, MedicoLaboratorioExamen, MedicoLaboratorio, MedicoLaboratorioPaciente, MedicoLaboratorioResultado,
	MedicoLaboratorioResultado, MedicoDiagnostico, MedicoDiagnosticoExamen, MedicoDiagnosticoPaciente, MedicoDiagnosticoResultado, MedicoPacientePreRequisito, RrhhEmpleadoCargo, RrhhEmpleadoFicha) {

	router.route('/paciente/:id_paciente')
		.get(function (req, res) {
			MedicoPaciente.find({
				where: {
					id: req.params.id_paciente
				},
				include: [{ model: Clase, as: 'campo' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }
					// { model: Empresa, as: 'empresa'},{model:MedicoPrerequisito, as: 'prerequisitos',include: [{ model: Clase, as: 'prerequisitoClase' }]}
				]
			}).then(function (medicoPaciente) {
				res.json(medicoPaciente);
			});
		});
	router.route('/pacientes/:id_paciente/comentario')
		.put(function (req, res) {
			MedicoPaciente.update({
				comentario: req.body.comentario
			}, {
					where: { id: req.params.id_paciente }
				}).then(function (medicoPacienteActualizado) {
					res.json({ mensaje: "Comentario Actualizado." });
				})
		})

	router.route('/pacientes/:id_paciente/activo/:activo')
		.put(function (req, res) {
			MedicoPaciente.update({
				eliminado: req.params.activo
			}, {
					where: {
						id: req.params.id_paciente
					}
				}).then(function (pacienteInactivo) {
					var mn = (req.body.activo == true) ? 'activo' : 'inactivo'
					res.json({ mensaje: "Paciente " + mn });
				})
		})

	router.route('/pacientes/:id_paciente')
		.post(function (req, res) {
			Clase.find({
				where: { nombre_corto: Diccionario.GENERO }
			}).then(function (clase) {
				Persona.find({
					where: {
						$or: [{ id_genero: req.body.persona.id_genero }]
					},
				}).then(function (generoEncontrado) {
					Persona.create({
						nombres: req.body.persona.nombres,
						apellido_paterno: req.body.persona.apellido_paterno,
						apellido_materno: req.body.persona.apellido_materno,
						ci: req.body.persona.ci,
						id_genero: req.body.persona.genero.id,
						nombre_completo: req.body.persona.nombres + ' ' + req.body.persona.apellido_paterno + ' ' + req.body.persona.apellido_materno,
						telefono: req.body.persona.telefono,
						telefono_movil: req.body.persona.telefono_movil,
						fecha_nacimiento: req.body.persona.fecha_nacimiento
					}).then(function (personaCreada) {
						var imagen;
						if (req.body.persona.imagen.indexOf('default') > -1) {
							imagen = req.body.persona.imagen;
						} else {
							var imagenPersona = decodeBase64Image(req.body.persona.imagen);
							fs.writeFileSync('./img/persona' + personaCreada.id + '.jpg', imagenPersona.data, 'base64', function (err) { res.json({ mensaje: 'error' }) });
							imagen = './img/persona' + personaCreada.id + '.jpg';
						}
						Persona.update({
							imagen: imagen
						}, {
								where: { id: personaCreada.id }
							}).then(function (affecteedRows) {
								MedicoPaciente.create({
									id_persona: personaCreada.id,
									id_empresa: req.body.id_empresa,
									codigo: req.body.codigo,
									id_extension: req.body.extension.id,
									grupo_sanguineo: req.body.grupo_sanguineo,
									cargo: req.body.cargo,
									id_campo: req.body.campo.id,
									designacion_empresa: req.body.designacion_empresa,
									eliminado: false,
								}).then(function (medicoPacienteCreado) {
									guardarCargo(req, res, RrhhEmpleadoCargo, medicoPacienteCreado)
								});
							});
					});

				})
			})

		})
		.put(function (req, res) {
			if (req.body.eliminar == undefined) {
				var imagen;
				if (req.body.persona.imagen.indexOf('default') > -1 || req.body.persona.imagen.indexOf('persona' + req.body.persona.id) > -1) {
					imagen = req.body.persona.imagen;
				} else {
					var imagenPersona = decodeBase64Image(req.body.persona.imagen);
					fs.writeFileSync('./img/persona' + req.body.persona.id + '.jpg', imagenPersona.data, 'base64', function (err) { });
					imagen = './img/persona' + req.body.persona.id + '.jpg'; console.log('entro2');
				}
				Persona.update({
					nombres: req.body.persona.nombres,
					apellido_paterno: req.body.persona.apellido_paterno,
					apellido_materno: req.body.persona.apellido_materno,
					ci: req.body.persona.ci,
					id_genero: req.body.persona.genero.id,
					nombre_completo: req.body.persona.nombres + ' ' + req.body.persona.apellido_paterno + ' ' + req.body.persona.apellido_materno,
					telefono: req.body.persona.telefono,
					telefono_movil: req.body.persona.telefono_movil,
					fecha_nacimiento: req.body.persona.fecha_nacimiento,
					imagen: imagen
				}, {
						where: {
							id: req.body.id_persona
						}
					}).then(function (personaActualizada) {
						MedicoPaciente.update({
							id_persona: personaActualizada.id,
							id_empresa: req.body.id_empresa,
							codigo: req.body.codigo,
							id_extension: req.body.extension.id,
							grupo_sanguineo: req.body.grupo_sanguineo,
							cargo: req.body.cargo,
							id_campo: req.body.campo.id,
							designacion_empresa: req.body.designacion_empresa,
							eliminado: req.body.eliminado,
						}, {
								where: { id: req.params.id_paciente }

							}).then(function (medicoPacienteActualizado) {
								guardarCargo(req, res, RrhhEmpleadoCargo)
							})
					})
			} else {
				MedicoPaciente.update({
					eliminado: true
				}, {
						where: {
							id: req.params.id_paciente
						}
					}).then(function (pacienteInactivo) {
						res.json({ mensaje: "Eliminado!" });
					})
			}
		})

		.get(function (req, res) {
			MedicoPaciente.find({
				where: {
					id: req.params.id_paciente
				},
				include: [{ model: Clase, as: 'campo' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }] }, { model: Clase, as: 'extension' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }
					// { model: Empresa, as: 'empresa'},{model:MedicoPrerequisito, as: 'prerequisitos',include: [{ model: Clase, as: 'prerequisitoClase' }]}
				]
			}).then(function (medicoPaciente) {
				res.json(medicoPaciente);
			});
		});
	function guardarCargo(req, res, RrhhEmpleadoCargo, medicoPacienteCreado) {
		var idpaciente = 0
		var mensaje = ""
		if (medicoPacienteCreado) {
			idpaciente = medicoPacienteCreado.id
			mensaje = "Creado Satisfactoriamente!"
		} else {
			idpaciente = req.body.id
			mensaje = "Actualizado Satisfactoriamente!"
		}
		/* RrhhEmpleadoCargo.destroy({
			where: {
				id_empleado: idpaciente
			}
		}).then(function (EmpleadoCargoEliminados) { */
		/* if (req.body.cargos) {
			if (req.body.cargos.length > 0) {
				req.body.cargos.forEach(function (cargo, index, array) {
					RrhhEmpleadoCargo.findOrCreate({
						where: { id_empleado: idpaciente, id_cargo: cargo.id },
						defaults: {
							id_empleado: idpaciente,
							id_cargo: cargo.id
						}
					}).spread(function (ficha, created) {
						if (!created) {
							RrhhEmpleadoCargo.update({
								id_empleado: idpaciente,
								id_cargo: cargo.id
							}, {
									where: { id_empleado: idpaciente, id_cargo: cargo.id }
								}).then(function (actualizado) {
									if (index === (array.length - 1)) {
										res.json({ message: mensaje });
									}
								})

						} else {
							if (index === (array.length - 1)) {
								res.json({ message: mensaje });
							}
						}
					})
				});
			} else {
				res.json({ message: mensaje });
			}
		} else { */
		res.json({ message: mensaje });

		/* } */
		/* }) */
	}
	router.route('/pacientes/ficha_tecnica/excel/upload')
		.post(function (req, res) {
			req.body.fichas.forEach(function (fichaActual, index, array) {
				Clase.find({
					where: { nombre: fichaActual.tipo_control }
				}).then(function (tipoControl) {
					MedicoPaciente.find({
						where: { codigo: fichaActual.codigo }
					}).then(function (pacienteEncontrado) {
						console.log(pacienteEncontrado)
						MedicoPacienteFicha.findOrCreate({
							where: { id_paciente: pacienteEncontrado.id, fecha: fichaActual.fecha },
							defaults: {
								id_paciente: pacienteEncontrado.id,
								fecha: fichaActual.fecha,
								estilo_vida: fichaActual.estilo_vida,
								actividad_laboral: fichaActual.actividad_laboral,
								area_operacion: fichaActual.area_operacion,
								riesgo: fichaActual.riesgo,
								// id_persona_referencia: 1, //SE ACTUALIZA AL FINAL
								id_tipo_control: tipoControl.id,
								alergia_humo_cigarrillo: fichaActual.alergia_humo_cigarrillo,
								alergia_polvo: fichaActual.alergia_polvo,
								alergia_picadura: fichaActual.alergia_picadura,
								alergia_quimico: fichaActual.alergia_quimico,
								alergia_algun_material: fichaActual.alergia_algun_material,
								alergia_medicamento: fichaActual.alergia_medicamento,
								alergia_plantas: fichaActual.alergia_plantas,
								alergia_alimentos: fichaActual.alergia_alimentos,
								alergia_conservas: fichaActual.alergia_conservas,
								alergia_otros: fichaActual.alergia_otros,
								alergia_otros_comentario: fichaActual.alergia_otros_comentario,
								es_donante: fichaActual.es_donante,
								enfermedad_hipertension: fichaActual.enfermedad_hipertension,
								enfermedad_cardilogia: fichaActual.enfermedad_cardiologia,
								enfermedad_lumbalgia: fichaActual.enfermedad_lumbalgia,
								enfermedad_diabetes: fichaActual.enfermedad_diabetes,
								enfermedad_digestiva: fichaActual.enfermedad_digestivas,
								enfermedad_epilepsia: fichaActual.enfermedad_epilepsia,
								enfermedad_chagas: fichaActual.enfermedad_chagas,
								enfermedad_asma: fichaActual.enfermedad_asma,
								enfermedad_hepatitis: fichaActual.enfermedad_hepatitis,
								enfermedad_otros: fichaActual.enfermedad_otros,
								enfermedad_comentario: fichaActual.enfermedad_comentario,
								quirurgico_operado: fichaActual.quirurgico_operado,
								quirurgico_comentario: fichaActual.quirurgico_comentario
							}
						}).spread(function (ficha, created) {
							if (created) {
								Persona.findOrCreate({
									where: {
										nombres: fichaActual.nombre_referencia,
										telefono: fichaActual.telefono_referencia,
										telefono_movil: fichaActual.celular_referencia,
										direccion_numero: fichaActual.numero_referencia,
										direccion_zona: fichaActual.zona_referencia,
										direccion_ciudad: fichaActual.ciudad_referencia,
										direccion_localidad: fichaActual.calle_av_referencia
									},
									defaults: {
										nombres: fichaActual.nombre_referencia,
										nombre_completo: fichaActual.nombre_referencia,
										telefono: fichaActual.telefono_referencia,
										telefono_movil: fichaActual.celular_referencia,
										direccion_numero: fichaActual.numero_referencia,
										direccion_zona: fichaActual.zona_referencia,
										direccion_ciudad: fichaActual.ciudad_referencia,
										direccion: fichaActual.calle_av_referencia
									}
								}).spread(function (personaReferencia, created) {
									MedicoPacienteFicha.update({
										id_persona_referencia: personaReferencia.id
									}, {
											where: { id: ficha.id }
										}).then(function (affectedRows) {

										})
								})
							}
							if (index === (array.length - 1)) {
								res.json({ mensaje: "¡Datos de fichas técnicas actualizados satisfactoriamente!" });
							}
						})
					})
				})
			}, this)
			// res.json({ mensaje: 'Creando fichas medicas...' })
		})

	router.route('/pacientes/Vacunas/excel/upload')
		.post(function (req, res) {
			req.body.pacientes.forEach(function (vacuna, index, array) {
				var fecha_inicio = new Date(vacuna.fecha)
				var fecha_fin = new Date(vacuna.fecha)
				fecha_inicio.setMinutes(0)
				fecha_inicio.setHours(0)
				fecha_fin.setMinutes(59)
				fecha_fin.setHours(23)
				sequelize.transaction(function (t) {
					isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
					return MedicoPaciente.find({
						where: { codigo: vacuna.codigo },
						transaction: t
						// lock: t.LOCK.UPDATE
					}).then(function (pacienteEncontrado) {
						return MedicoVacuna.find({
							where: { nombre: vacuna.nombre_vacuna },
							transaction: t
							// lock: t.LOCK.UPDATE
						}).then(function (vacunaIdentificada) {
							return MedicoPacienteVacuna.findOrCreate({
								where: {
									id_paciente: pacienteEncontrado.id,
									id_vacuna: vacunaIdentificada.id
								},
								defaults: {
									id_paciente: pacienteEncontrado.id,
									id_vacuna: vacunaIdentificada.id,
									fecha_ultima_aplicacion: vacuna.fecha,
									eliminado: false
								},
								transaction: t,
								lock: {
									level: t.LOCK.SHARE,
									of: MedicoPacienteVacuna
								}
							}).spread(function (VacunaPaciente, is_new) {
								return MedicoPacienteVacunaDosis.findOrCreate({
									where: {
										id_paciente_vacuna: VacunaPaciente.id,
										fecha_aplicacion: { $between: [fecha_inicio, fecha_fin] }
									},
									defaults: {
										id_paciente_vacuna: VacunaPaciente.id,
										fecha_aplicacion: vacuna.fecha,
										unico: dosis.unico,
										eliminado: false
									},
									transaction: t
									// lock: t.LOCK.SHARE
								}).then(function (dosisCreada) {
									// return MedicoPacienteVacuna.update({
									// 	id_paciente: pacienteEncontrado.id,
									// 	id_vacuna: vacunaIdentificada.id,
									// 	fecha_ultima_aplicacion: vacuna.fecha,
									// 	eliminado: false},
									// 	{where: {
									// 		id_paciente: pacienteEncontrado.id,
									// 		id_vacuna: vacunaIdentificada.id
									// 	}
									// },
									// 	{
									// 	transaction: t
									// 	// lock: t.LOCK.UPDATE
									// });
								})
							})
						})
					})
				}).then(function (result) {
					if (index === (array.length - 1)) {
						res.json({ mensaje: "¡Datos de vacunas aplicadas actualizadas satisfactoriamente!" });
					}
				}).catch(function (err) {
					res.json({ hasError: true, mensaje: 'Se produjo un error! intente realizar la operación nuevamente.\n' + err });
				});
			});
			// res.json({ mensaje: 'Aplicando Vacunas... Por favor espere.' })
		})

	router.route('/pacientes/empresa/excel/upload')
		.post(function (req, res) {
			var arregloSucursales = []
			var bandera = false
			req.body.pacientes.forEach(function (pacienteActual, index, array) {
				if (arregloSucursales.length > 0) {
					for (var i = 0; i < arregloSucursales.length; i++) {
						var element = arregloSucursales[i];
						if (element == pacienteActual.campamento) {
							bandera = true
						}
					}
					if (!bandera) {
						arregloSucursales.push(pacienteActual.campamento)
					}
				} else {
					arregloSucursales.push(pacienteActual.campamento)
				}
				if (index === (array.length - 1)) {
					arregloSucursales.forEach(function (sucursal, index2, array2) {
						Tipo.find({
							where: {
								nombre_corto: 'CENCOS',
								id_empresa: req.body.id_empresa
							}
						}).then(function (tipo) {
							Clase.findOrCreate({
								where: {
									nombre: sucursal,
									nombre_corto: sucursal,
									id_tipo: tipo.dataValues.id
								},
								defaults: {
									nombre: sucursal,
									id_tipo: tipo.dataValues.id,
									habilitado: true
								}
							})
						})
						Sucursal.findOrCreate({
							where: {
								nombre: sucursal,
								id_empresa: req.body.id_empresa
							},
							defaults: {
								nombre: sucursal,
								id_empresa: req.body.id_empresa
							}
						})
						if (index2 === (array2.length - 1)) {
							req.body.pacientes.forEach(function (pacienteActual, index, array) {
								Clase.find({
									where: { nombre_corto: pacienteActual.genero }
								}).then(function (generoEncontrado) {
									MedicoPaciente.find({
										where: { codigo: pacienteActual.codigo }
									}).then(function (pacienteFound) {
										// console.log(pacienteFound)
										if (pacienteFound != null) {
											var imagen;
											if (pacienteActual.imagen.indexOf('default') > -1) {
												imagen = pacienteActual.imagen;
											} else {
												var imagenPersona = decodeBase64Image(pacienteActual.imagen);
												fs.writeFileSync('./img/persona' + pacienteFound.id_persona + '.jpg', imagenPersona.data, 'base64', function (err) { });
												imagen = './img/persona' + pacienteFound.id_persona + '.jpg';
											}
											Persona.update({
												nombres: pacienteActual.nombres,
												apellido_paterno: pacienteActual.apellido_paterno,
												apellido_materno: pacienteActual.apellido_materno,
												ci: pacienteActual.ci,
												imagen: imagen,
												id_genero: generoEncontrado.id,
												nombre_completo: pacienteActual.nombres + ' ' + pacienteActual.apellido_paterno + ' ' + pacienteActual.apellido_materno,
												telefono: pacienteActual.telefono,
												telefono_movil: pacienteActual.telefono_movil,
												fecha_nacimiento: pacienteActual.fecha_nacimiento,
												activo: true,
											}, {
													where: {
														id: pacienteFound.id_persona
													}
												}).then(function (personaActualizada) {
													Tipo.find({
														where: { nombre_corto: 'RRHH_EXP', id_empresa: req.body.id_empresa }
													}).then(function (tipoExp) {
														var nombre_corto2 = pacienteActual.extension.substr(0, 3);
														Clase.findOrCreate({
															where: {
																nombre: pacienteActual.extension,
																id_tipo: tipoExp.dataValues.id,
															},
															defaults: {
																id_tipo: tipoExp.dataValues.id,
																nombre: pacienteActual.extension,
																nombre_corto: nombre_corto2
															}
														}).spread(function (expClase, created) {
															MedicoPaciente.update({
																id_persona: personaActualizada.id,
																id_empresa: req.body.id_empresa,
																codigo: pacienteActual.codigo,
																id_extension: expClase.id,
																grupo_sanguineo: pacienteActual.grupo_sanguineo,
																cargo: pacienteActual.cargo,
																id_campo: pacienteActual.campamento,
																designacion_empresa: pacienteActual.designacion_empresa,
																eliminado: false,
																es_empleado: false
															}, {
																	where: { id: pacienteFound.id }

																}).then(function (medicoPacienteActualizado) {
																	RrhhEmpleadoCargo.findAll({
																		where: {
																			id_empleado: pacienteFound.id,
																		},
																		include: [{ model: Clase, as: 'cargo', include: [{ model: Tipo, as: 'tipo' }] }]
																	}).then(function (EmpleadoCargos) {
																		var dato = 0;
																		/* EmpleadoCargos.forEach(function (cargo, index, array) {
																			var nombre_corto = pacienteActual.cargo.substr(0, 3);
																			Clase.findOrCreate({
																				where: {
																					nombre: pacienteActual.cargo,
																					id_tipo: cargo.dataValues.cargo.dataValues.tipo.dataValues.id,
																				},
																				defaults: {
																					id_tipo: cargo.dataValues.cargo.dataValues.tipo.dataValues.id,
																					nombre: pacienteActual.cargo,
																					nombre_corto: nombre_corto
																				}
																			}).spread(function (cargoClase, created) {
																				RrhhEmpleadoCargo.findOrCreate({
																					where: {
																						id_empleado: pacienteFound.id,
																						id_cargo: cargoClase.id,
																					},
																					defaults: {
																						id_empleado: pacienteFound.id,
																						id_cargo: cargoClase.id,
																					}
																				}).spread(function (cargoAc, created) {
																					if (index === (array.length - 1)) { */
																		res.json({ mensaje: "¡Datos de pacientes actualizados satisfactoriamente!" });
																		/* 	}
																		})
																	})
		
																}); */
																	})
																})
														})
													})
												})
										} else {
											console.log('paciente nuevo')
											Persona.create({
												nombres: pacienteActual.nombres,
												apellido_paterno: pacienteActual.apellido_paterno,
												apellido_materno: pacienteActual.apellido_materno,
												ci: pacienteActual.ci,
												id_genero: generoEncontrado.id,
												nombre_completo: pacienteActual.nombres + ' ' + pacienteActual.apellido_paterno + ' ' + pacienteActual.apellido_materno,
												telefono: pacienteActual.telefono,
												telefono_movil: pacienteActual.telefono_movil,
												fecha_nacimiento: pacienteActual.fecha_nacimiento,
												activo: true,
											}).then(function (personaCreada) {
												var imagen;
												if (pacienteActual.imagen.indexOf('default') > -1) {
													imagen = pacienteActual.imagen;
												} else {
													var imagenPersona = decodeBase64Image(pacienteActual.imagen);
													fs.writeFileSync('./img/persona' + personaCreada.id + '.jpg', imagenPersona.data, 'base64', function (err) { });
													imagen = './img/persona' + personaCreada.id + '.jpg';

												}
												Persona.update({
													imagen: imagen
												}, {
														where: {
															id: personaCreada.id
														}
													}).then(function (imagenAct) {
														Tipo.find({
															where: { nombre_corto: 'RRHH_EXP', id_empresa: req.body.id_empresa }
														}).then(function (tipoExp) {
															var nombre_corto2 = pacienteActual.extension.substr(0, 3);
															Clase.findOrCreate({
																where: {
																	nombre: pacienteActual.extension,
																	id_tipo: tipoExp.dataValues.id,
																},
																defaults: {
																	id_tipo: tipoExp.dataValues.id,
																	nombre: pacienteActual.extension,
																	nombre_corto: nombre_corto2
																}
															}).spread(function (expClase, created) {
																Tipo.find({
																	where: {
																		nombre_corto: 'CENCOS',
																		id_empresa: req.body.id_empresa
																	}
																}).then(function (tipo) {
																	 Clase.findOrCreate({
																		where: {
																			nombre: pacienteActual.campamento,
																			id_tipo: tipo.dataValues.id
																		},
																		defaults: {
																			nombre: pacienteActual.campamento,
																			id_tipo: tipo.dataValues.id,
																			habilitado: true
																		}
																	}).spread(function (centroCosto, created2) {
																		MedicoPaciente.create({
																			id_persona: personaCreada.id,
																			id_empresa: req.body.id_empresa,
																			codigo: pacienteActual.codigo,
																			grupo_sanguineo: pacienteActual.grupo_sanguineo,
																			cargo: pacienteActual.cargo,
																			id_extension: expClase.id,
																			id_campo: centroCosto.id,
																			designacion_empresa: pacienteActual.designacion_empresa,
																			eliminado: false,
																			es_empleado: false
																			//comentario: pacienteActual.comentario
																		}).then(function (medicoPacienteActualizado) {
																			/* Tipo.find({
																				where: { nombre_corto: 'RRHH_CARGO' }
																			}).then(function (tipoCargo) {
																				var nombre_corto = pacienteActual.cargo.substr(0, 3);
																				Clase.findOrCreate({
																					where: {
																						nombre: pacienteActual.cargo,
																						id_tipo: tipoCargo.dataValues.id,
																					},
																					defaults: {
																						id_tipo: tipoCargo.dataValues.id,
																						nombre: pacienteActual.cargo,
																						nombre_corto: nombre_corto
																					}
																				}).spread(function (cargoClase, created) {
																					RrhhEmpleadoCargo.create({
																						id_empleado: medicoPacienteActualizado.id,
																						id_cargo: cargoClase.id
																					}).then(function (params) {
						
						
																						if (index === (array.length - 1)) { */
																			res.json({ mensaje: "¡Datos de pacientes actualizados satisfactoriamente!" });
																			/* 	}
				
				
																			})
				
																		}) 
																	})*/
																		})
																	})
																})


															})
														})
													})
											})
										}
									})
								});
							})
						}
					})
				}
			})

		})
	router.route('/pacientes/SOAP/excel/upload')
		.post(function (req, res) {
			req.body.SOAPLista.forEach(function (soap, index, array) {
				MedicoPaciente.find({
					where: { codigo: soap.codigo }
				}).then(function (pacienteEncontrado) {
					var fecha_inicio = new Date(soap.fecha)
					var fecha_fin = new Date(soap.fecha)
					fecha_inicio.setMinutes(0)
					fecha_inicio.setHours(0)
					fecha_fin.setMinutes(59)
					fecha_fin.setHours(23)
					MedicoPacienteConsulta.findOrCreate({
						where: {
							fecha: { $between: [fecha_inicio, fecha_fin] },
							id_paciente: pacienteEncontrado.id
						},
						defaults: {
							id_paciente: pacienteEncontrado.id,
							fecha: soap.fecha,
							subjetivo: soap.subjetivo,
							objetivo: soap.objetivo,
							analitico: soap.analitico,
							plan: soap.plan,
							evolucion: soap.evolucion
						}
					}).spread(function (soapActual, created) {
						if (!created) {
							MedicoPacienteConsulta.update({
								fecha: soap.fecha,
								subjetivo: soap.subjetivo,
								objetivo: soap.objetivo,
								analitico: soap.analitico,
								plan: soap.plan,
								evolucion: soap.evolucion
							}, {
									where: { id: soapActual.id }
								})
						}
						if (index === (array.length - 1)) {
							res.json({ mensaje: "¡Datos de SOAP pacientes actualizados satisfactoriamente!" });
						}
					})
				})
			}, this)
		})
	router.route('/pacientes/signos_vitales/excel/upload')
		.post(function (req, res) {
			req.body.signosVitales.forEach(function (signo_vital, index, array) {
				MedicoPaciente.find({
					where: { codigo: signo_vital.codigo }
				}).then(function (pacienteEncontrado) {
					var fecha_inicio = new Date(signo_vital.fecha)
					var fecha_fin = new Date(signo_vital.fecha)
					fecha_inicio.setMinutes(0)
					fecha_inicio.setHours(0)
					fecha_fin.setMinutes(59)
					fecha_fin.setHours(23)
					MedicoPacienteConsulta.findOrCreate({
						where: {
							fecha: { $between: [fecha_inicio, fecha_fin] },
							id_paciente: pacienteEncontrado.id
						},
						defaults: {
							id_paciente: pacienteEncontrado.id,
							fecha: signo_vital.fecha,
							presion: signo_vital.presion,
							pulso: signo_vital.pulso,
							talla: signo_vital.talla,
							peso: signo_vital.peso,
							temperatura: signo_vital.temperatura,
							frecuencia_respiratoria: signo_vital.frecuencia_respiratoria,
							frecuencia_cardiaca: signo_vital.frecuencia_cardiaca
						}
					}).spread(function (signoVitalActual, created) {
						if (!created) {
							MedicoPacienteConsulta.update({
								fecha: signo_vital.fecha,
								presion: signo_vital.presion,
								pulso: signo_vital.pulso,
								talla: signo_vital.talla,
								peso: signo_vital.peso,
								temperatura: signo_vital.temperatura,
								frecuencia_respiratoria: signo_vital.frecuencia_respiratoria,
								frecuencia_cardiaca: signo_vital.frecuencia_cardiaca
							}, {
									where: { id: signoVitalActual.id, fecha: { $between: [fecha_inicio, fecha_fin] } }
								})
						}
						if (index === (array.length - 1)) {
							res.json({ mensaje: "¡Datos de consultas actualizados satisfactoriamente!" });
						}
					})
				})
			}, this);
		})

	// ========= ruta para obtener pacientes x su nit ==============
	router.route('/pacientes/empresa/:id_empresa/texto/:texto')
		.get(function (req, res) {
			console.log('llegooooooooooo aqui =====?=');
			var orCondition = []; console.log(req.params.texto);
			if (req.params.texto == 0) {
				orCondition.push({ ci: req.params.texto });
			} else if (req.params.texto) {
				orCondition.push({ ci: req.params.texto });
			}
			orCondition.push({ nombre_completo: { $like: "%" + req.params.texto + "%" } });
			MedicoPaciente.findAll({
				where: {
					empresa: req.params.id_empresa
				},
				include: [{ model: Clase, as: 'campo' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }] }, { model: Clase, as: 'extension' }, { model: Persona, as: 'persona', where: { $or: orCondition }, include: [{ model: Clase, as: 'genero' }] }
					// { model: Empresa, as: 'empresa'},{model:MedicoPrerequisito, as: 'prerequisitos',include: [{ model: Clase, as: 'prerequisitoClase' }]}
				]
			}).then(function (pacientes) {
				res.json(pacientes);
			});
		})

	/* router.route('/pacientes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado')
		.get(function (req, res) {
			var condicion = ""
			var activo = "false"
			if (req.params.codigo != "0") {
				condicion += "codigo like '%" + req.params.codigo + "%'"
			}
			if (req.params.nombres != "0") {
				if (condicion.length > 1) {
					condicion += " or nombre_completo like '%" + req.params.nombres + "%'"
				} else {
					condicion += "nombre_completo like '%" + req.params.nombres + "%'"
				}
			}
			if (req.params.ci != "0") {
				if (condicion.length > 1) {
					condicion += " or ci like '%" + req.params.ci + "%'"
				} else {
					condicion += "ci like '%" + req.params.ci + "%'"
				}
			}
			if (req.params.campo != "0") {
				if (condicion.length > 1) {
					condicion += " or campo like '%" + req.params.campo + "%'"
				} else {
					condicion += "campo like '%" + req.params.campo + "%'"
				}
			}
			if (req.params.cargo != "0") {
				if (condicion.length > 1) {
					condicion += " or cargo like '%" + req.params.cargo + "%'"
				} else {
					condicion += "cargo like '%" + req.params.cargo + "%'"
				}
			}
			if (req.params.busquedaEmpresa != "0") {
				if (condicion.length > 1) {
					condicion += " or designacion_empresa like '%" + req.params.busquedaEmpresa + "%'"
				} else {
					condicion += "designacion_empresa like '%" + req.params.busquedaEmpresa + "%'"
				}
			}
			if (req.params.grupo_sanguineo != "0") {
				if (condicion.length > 1) {
					condicion += " or grupo_sanguineo like '%" + req.params.grupo_sanguineo + "%'"
				} else {
					condicion += "grupo_sanguineo like '%" + req.params.grupo_sanguineo + "%'"
				}
			}
	
			if (req.params.estado != "0") {
				if (req.params.estado === 'Inactivo') {
					activo = "false"
				} else {
					activo = "true"
				}
			}
			if (req.params.texto_busqueda != 0) {
				if (condicion.length > 1) {
					condicion += " or nombre_completo like '%" + req.params.texto_busqueda + "%' or codigo like '%" + req.params.texto_busqueda + "%' or ci like '%" + req.params.texto_busqueda + "%' or designacion_empresa like '%" + req.params.texto_busqueda + "%' or grupo_sanguineo like '%" + req.params.texto_busqueda + "%' or campo like '%" + req.params.texto_busqueda + "%' or cargo like '%" + req.params.texto_busqueda + "%' or extension like '%" + req.params.texto_busqueda + "%'"
				} else {
					condicion += "nombre_completo like '%" + req.params.texto_busqueda + "%' or codigo like '%" + req.params.texto_busqueda + "%' or ci like '%" + req.params.texto_busqueda + "%' or designacion_empresa like '%" + req.params.texto_busqueda + "%' or grupo_sanguineo like '%" + req.params.texto_busqueda + "%' or campo like '%" + req.params.texto_busqueda + "%' or cargo like '%" + req.params.texto_busqueda + "%' or extension like '%" + req.params.texto_busqueda + "%'"
				}
			}
			console.log(condicion)
	
			if (condicion.length > 1) {
				sequelize.query("select count(*) as cantidad_pacientes from agil_medico_paciente LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) where agil_medico_paciente.eliminado = " + activo + " AND (" + condicion + ")", { type: sequelize.QueryTypes.SELECT })
					.then(function (data) {
						var options = {
							model: MedicoPaciente,
							include: [{ model: Persona, as: 'persona' }]
						};
						Sequelize.Model.$validateIncludedElements(options);
						sequelize.query("select agil_medico_paciente.id as 'id', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
						agil_medico_paciente.empresa as 'id_empresa', agil_medico_paciente.extension as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo', \
						agil_medico_paciente.cargo as 'cargo', agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa', agil_medico_paciente.comentario as 'comentario', \
						gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
						gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
						gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
						from agil_medico_paciente LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id)\
						where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + activo + " AND (" + condicion + ") \
						GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion + " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina, options)
							.then(function (pacientes) {
								res.json({ pacientes: pacientes, paginas: Math.ceil(data[0].cantidad_pacientes / req.params.items_pagina) });
							});
					});
			} else {
				sequelize.query("select count(*) as cantidad_pacientes from agil_medico_paciente LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) where  agil_medico_paciente.eliminado = " + activo, { type: sequelize.QueryTypes.SELECT })
					.then(function (data) {
						var options = {
							model: MedicoPaciente,
							include: [{ model: Persona, as: 'persona' }]
						};
						Sequelize.Model.$validateIncludedElements(options);
						sequelize.query("select agil_medico_paciente.id as 'id', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
						agil_medico_paciente.empresa as 'id_empresa', agil_medico_paciente.extension as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo', \
						agil_medico_paciente.cargo as 'cargo', agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
						gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
						gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
						gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
						from agil_medico_paciente LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id)\
						where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + activo + " GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina, options)
							.then(function (pacientes) {
								res.json({ pacientes: pacientes, paginas: Math.ceil(data[0].cantidad_pacientes / req.params.items_pagina) });
							});
					});
			}
		});
	*/
	router.route('/pacientes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado/apellido/:apellido')
		.get(function (req, res) {
			var condicion = ""
			var condicionCargo = ""
			var activo = "true"
			var condicionContrato = ""
			if (req.params.codigo != "0") {
				condicion += "codigo like '%" + req.params.codigo + "%'"
			}
			if (req.params.nombres != "0") {
				if (condicion.length > 1) {
					condicion += " or nombre_completo like '%" + req.params.nombres + "%'"
				} else {
					condicion += "nombre_completo like '%" + req.params.nombres + "%'"
				}
			}
			if (req.params.apellido != "0") {
				if (condicion.length > 1) {
					condicion += " or nombre_completo like '%" + req.params.apellido + "%'"
				} else {
					condicion += "nombre_completo like '%" + req.params.apellido + "%'"
				}
			}
			if (req.params.ci != "0") {
				if (condicion.length > 1) {
					condicion += " or ci like '%" + req.params.ci + "%'"
				} else {
					condicion += "ci like '%" + req.params.ci + "%'"
				}
			}
			if (req.params.campo != "0") {
				if (condicion.length > 1) {
					condicion += " or campo like '%" + req.params.campo + "%'"
				} else {
					condicion += "campo like '%" + req.params.campo + "%'"
				}
			}
			if (req.params.cargo != "0") {
				condicionCargo = "AND cargos.cargo = " + req.params.cargo
			} else {
				condicionCargo = ""
			}
			if (req.params.busquedaEmpresa != "0") {
				if (condicion.length > 1) {
					condicion += " or designacion_empresa like '%" + req.params.busquedaEmpresa + "%'"
				} else {
					condicion += "designacion_empresa like '%" + req.params.busquedaEmpresa + "%'"
				}
			}
			if (req.params.grupo_sanguineo != "0") {
				if (condicion.length > 1) {
					condicion += " or grupo_sanguineo like '%" + req.params.grupo_sanguineo + "%'"
				} else {
					condicion += "grupo_sanguineo like '%" + req.params.grupo_sanguineo + "%'"
				}
			}

			if (req.params.estado != "0") {
				if (req.params.estado === 'Inactivo') {

					activo = " AND agil_medico_paciente.eliminado = false"

				} else {
					activo = " AND agil_medico_paciente.eliminado = true"
				}
			} else {
				activo = ""
			}
			if (req.params.texto_busqueda != "0") {
				if (condicion.length > 1) {
					condicion += " or nombre_completo like '%" + req.params.texto_busqueda + "%' or grupo_sanguineo like '%" + req.params.texto_busqueda + "%' or campo like '%" + req.params.texto_busqueda + "%'"
				} else {
					condicion += "nombre_completo like '%" + req.params.texto_busqueda + "%' or ci like '%" + req.params.texto_busqueda + "%' or designacion_empresa like '%" + req.params.texto_busqueda + "%' or grupo_sanguineo like '%" + req.params.texto_busqueda + "%' or campo like '%" + req.params.texto_busqueda + "%'"
				}
			}
			console.log(condicion)
			var limite = " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina
			if (req.params.items_pagina == "0") {
				limite = "";
			}
			if (condicion.length > 1 && req.params.cargo == 0) {
				sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa', agil_medico_paciente.comentario as 'comentario', \
                gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                ,campamento.nombre as 'campamento' from agil_medico_paciente "+ condicionContrato + " LEFT JOIN agil_rrhh_empleado_ficha AS fichas ON (agil_medico_paciente.id = fichas.id_empleado ) LEFT JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
				LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) LEFT JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                LEFT JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND (" + condicion + ") \
                GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion, { type: sequelize.QueryTypes.SELECT })
					.then(function (data) {
						var options = {
							model: MedicoPaciente,
							include: [{ model: Persona, as: 'persona' },
							{ model: Clase, as: 'extension' }]
						};
						Sequelize.Model.$validateIncludedElements(options);
						sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                    agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                    agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa', agil_medico_paciente.comentario as 'comentario', \
                    gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                    gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    ,campamento.nombre as 'campamento' from agil_medico_paciente "+ condicionContrato + " LEFT JOIN agil_rrhh_empleado_ficha AS fichas ON (agil_medico_paciente.id = fichas.id_empleado ) LEFT JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
					LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) LEFT JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                    LEFT JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND (" + condicion + ") \
                    GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion + limite, options)
							.then(function (pacientes) {
								var a = ""
								var arregloCargos = []
								if (pacientes.length > 0) {

									pacientes.forEach(function (paciente, index, array) {
										RrhhEmpleadoFicha.findAll({
											limit: 1,
											where: {
												id_empleado: paciente.id
											},
											include: [{ model: Clase, as: 'tipoContrato' }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }],
											order: [['id', 'DESC']],
										}).then(function (fichaActual) {
											/* paciente.cargos = cargosEmpleado */
											/* paciente.dataValues.ficha = fichaActual[0] */
											arregloCargos.push(fichaActual[0])
											if (index === (array.length - 1)) {
												res.json({ pacientes: pacientes, fichas: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
											}
										})
									});
								} else {
									res.json({ pacientes: pacientes, fichas: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
								}
							});
					});
			} else if (req.params.cargo != 0 && condicion.length > 1) {
				sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                ,campamento.nombre as 'campamento' from agil_medico_paciente "+ condicionContrato + " LEFT JOIN agil_rrhh_empleado_ficha AS fichas ON (agil_medico_paciente.id = fichas.id_empleado ) LEFT JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
				LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) LEFT JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                LEFT JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND (" + condicion + ") GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion, { type: sequelize.QueryTypes.SELECT })
					.then(function (data) {
						var options = {
							model: MedicoPaciente,
							include: [{ model: Persona, as: 'persona' },
							{ model: Clase, as: 'extension' }]
						};
						Sequelize.Model.$validateIncludedElements(options);
						sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                    agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                    agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                    gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                    gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    ,campamento.nombre as 'campamento', GROUP_CONCAT(`cargos.cargo`.nombre order by `cargos.cargo`.id) cargos from agil_medico_paciente "+ condicionContrato + " LEFT JOIN agil_rrhh_empleado_ficha AS fichas ON (agil_medico_paciente.id = fichas.id_empleado ) LEFT JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
					LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) LEFT JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                    LEFT JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND (" + condicion + ") GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + limite, options)
							.then(function (pacientes) {
								var a = ""
								var arregloCargos = []
								if (pacientes.length > 0) {
									pacientes.forEach(function (paciente, index, array) {
										RrhhEmpleadoFicha.findAll({
											limit: 1,
											where: {
												id_empleado: paciente.id
											},
											include: [{ model: Clase, as: 'tipoContrato' }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }],
											order: [['id', 'DESC']],
										}).then(function (fichaActual) {
											/* paciente.cargos = cargosEmpleado */
											/* 	paciente.dataValues.ficha = fichaActual[0] */
											arregloCargos.push(fichaActual[0])
											if (index === (array.length - 1)) {
												res.json({ pacientes: pacientes, fichas: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
											}
										})
									});
								} else {
									res.json({ pacientes: pacientes, fichas: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });

								}
							});
					});
			} else if (req.params.cargo != 0) {
				sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                ,campamento.nombre as 'campamento' from agil_medico_paciente "+ condicionContrato + " LEFT JOIN agil_rrhh_empleado_ficha AS fichas ON (agil_medico_paciente.id = fichas.id_empleado ) LEFT JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
				LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) LEFT JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                LEFT JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion, { type: sequelize.QueryTypes.SELECT })
					.then(function (data) {
						var options = {
							model: MedicoPaciente,
							include: [{ model: Persona, as: 'persona' },
							{ model: Clase, as: 'extension' }]
						};
						Sequelize.Model.$validateIncludedElements(options);
						sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                    agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                    agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                    gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                    gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    ,campamento.nombre as 'campamento', GROUP_CONCAT(`cargos.cargo`.nombre order by `cargos.cargo`.id) cargos from agil_medico_paciente "+ condicionContrato + " LEFT JOIN agil_rrhh_empleado_ficha AS fichas ON (agil_medico_paciente.id = fichas.id_empleado ) LEFT JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
					LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) LEFT JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                    LEFT JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + limite, options)
							.then(function (pacientes) {
								var a = ""
								var arregloCargos = []
								if (pacientes.length > 0) {
									pacientes.forEach(function (paciente, index, array) {
										RrhhEmpleadoFicha.findAll({
											limit: 1,
											where: {
												id_empleado: paciente.id
											},
											include: [{ model: Clase, as: 'tipoContrato' }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }],
											order: [['id', 'DESC']],
										}).then(function (fichaActual) {
											/* paciente.cargos = cargosEmpleado */
											/* 	paciente.dataValues.ficha = fichaActual[0] */
											arregloCargos.push(fichaActual[0])
											if (index === (array.length - 1)) {
												res.json({ pacientes: pacientes, fichas: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
											}
										})
									});
								} else {
									res.json({ pacientes: pacientes, fichas: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });

								}
							});
					});
			} else {
				sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                ,campamento.nombre as 'campamento' from agil_medico_paciente "+ condicionContrato + "  LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) LEFT JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                LEFT JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion, { type: sequelize.QueryTypes.SELECT })
					.then(function (data) {
						var options = {
							model: MedicoPaciente,
							include: [{ model: Persona, as: 'persona' },
							{ model: Clase, as: 'extension' }]
						};
						Sequelize.Model.$validateIncludedElements(options);
						sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                    agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                    agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                    gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                    gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    ,campamento.nombre as 'campamento' from agil_medico_paciente "+ condicionContrato + "  LEFT JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) LEFT JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                    LEFT JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + limite, options)
							.then(function (pacientes) {
								var a = ""
								var arregloCargos = []
								if (pacientes.length > 0) {
									pacientes.forEach(function (paciente, index, array) {
										RrhhEmpleadoFicha.findAll({
											limit: 1,
											where: {
												id_empleado: paciente.id
											},
											include: [{ model: Clase, as: 'tipoContrato' }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }],
											order: [['id', 'DESC']],
										}).then(function (fichaActual) {
											/* paciente.cargos = cargosEmpleado */
											/* 	paciente.dataValues.ficha = fichaActual[0] */
											arregloCargos.push(fichaActual[0])
											if (index === (array.length - 1)) {
												res.json({ pacientes: pacientes, fichas: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
											}
										})
									});
								} else {
									res.json({ pacientes: pacientes, fichas: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });

								}
							});
					});
			}
		})
	router.route('/vacunas/:id')
		.put(function (req, res) {
			MedicoVacuna.update({
				nombre: req.body.nombre,
				observacion: req.body.observacion
			}, {
					where: { id: req.body.id }
				}).then(function (vacunaActualizada) {
					var memo = "Vacuna actualizada"
					req.body.vacunaDosis.forEach(function (dosis, index, array) {
						if (dosis.id > 0 && dosis.eliminar == undefined) {
							VacunaDosis.update({
								es_dosis: dosis.es_dosis,
								tiempo: dosis.tiempo,
								numero: dosis.numero,
								id_vacuna: dosis.id_vacuna,
								unico: dosis.unico,
								eliminado: dosis.eliminado
							}, {
									where: { id: dosis.id, id_vacuna: dosis.id_vacuna }
								}).then(function (dosis_Creada) {
									if (index === array.length - 1) {
										res.json({ mensaje: memo })
									}
								})
						} else if (dosis.id == undefined && dosis.eliminar == undefined) {
							VacunaDosis.create({
								es_dosis: dosis.es_dosis,
								tiempo: dosis.tiempo,
								numero: dosis.numero,
								id_vacuna: req.body.id,
								unico: dosis.unico,
								eliminado: false
							}).then(function (dosis_Creada) {
								if (index === array.length - 1) {
									res.json({ mensaje: memo })
								}
							})
						} else if (dosis.eliminar == true) {
							var lmax = 0
							MedicoPacienteVacuna.findAndCountAll({
								where: { id_vacuna: req.body.id },
								include: [{ model: MedicoVacuna, as: 'pacienteVacuna', include: [{ model: VacunaDosis, as: 'vacunaDosis', where: { eliminado: false }, order: [['numero', 'desc']] }] }, { model: MedicoPacienteVacunaDosis, as: 'pacienteVacunaDosis', order: [['createdAt', 'desc']] }]
							}).then(function (vacunasPaciente) {
								if (vacunasPaciente.count > 0) {
									var a = vacunasPaciente.rows
									a.forEach(function (vacun, indexb, arrayb) {

										MedicoPacienteVacunaDosis.findAndCountAll({
											where: {
												id_paciente_vacuna: vacun.dataValues.id
											}
										}).then(function (dosisCount) {
											console.log(dosisCount)
											lmax = (lmax <= dosisCount.count) ? dosisCount.count : lmax
											if (indexb == arrayb.length - 1) {
												if (lmax < dosis.numero) {
													VacunaDosis.update({
														es_dosis: dosis.es_dosis,
														tiempo: dosis.tiempo,
														numero: dosis.numero,
														id_vacuna: dosis.id_vacuna,
														unico: dosis.unico,
														eliminado: true
													}, {
															where: { id: dosis.id, id_vacuna: dosis.id_vacuna }
														}).then(function (dosis_Creada) {
															if (index === array.length - 1) {
																res.json({ mensaje: memo })
															}
														})
												} else {
													memo += "\n La dosis N° " + dosis.numero + " No se puede eliminar."
													if (index === array.length - 1) {
														res.json({ mensaje: memo })
													}
												}
											}
										})
									});
								} else {
									VacunaDosis.update({
										es_dosis: dosis.es_dosis,
										tiempo: dosis.tiempo,
										numero: dosis.numero,
										id_vacuna: dosis.id_vacuna,
										unico: dosis.unico,
										eliminado: dosis.eliminado
									}, {
											where: { id: dosis.id, id_vacuna: dosis.id_vacuna }
										}).then(function (dosis_Creada) {
											if (index === array.length - 1) {
												res.json({ mensaje: memo })
											}
										})
								}
							});
						}
					}, this);
				}).then(function (vacunaActualizada) {
					// res.json({mensaje: 'vacuna Actializada'})
				})
		})

	router.route('/vacunas')
		.post(function (req, res) {
			MedicoVacuna.create({
				nombre: req.body.nombre,
				observacion: req.body.observacion,
				eliminado: false
			}).then(function (vacuna) {
				req.body.vacunaDosis.forEach(function (dosis, index, array) {
					VacunaDosis.create({
						es_dosis: dosis.es_dosis,
						tiempo: dosis.tiempo,
						numero: dosis.numero,
						id_vacuna: vacuna.id,
						unico: dosis.unico,
						eliminado: false
					}).then(function (dosis_Creada) {

					})
				}, this);
			}).then(function () {
				res.json({ mensaje: 'Vacuna creada' });
			})
		})
		.get(function (req, res) {
			MedicoVacuna.findAll({
				// where: {eliminado: false},
				include: [{ model: VacunaDosis, as: 'vacunaDosis', where: { eliminado: false }, order: [['numero', 'desc']] }] //where:{eliminado: false}
			}).then(function (vacunas) {
				res.json(vacunas);
			});
		})
		.put(function (req, res) {
			if (req.body.id != undefined) {
				MedicoVacuna.update({
					dias_activacion: req.body.dias_activacion
				}, {
						where: {
							id: req.body.id
						}
					}).then(function (alertaDiasActualizados) {
						res.json({ mensaje: 'Días de alerta de vacuna actualizada!' })
					})
			} else {
				if (req.body.setDiasTodos != undefined) {
					MedicoVacuna.findAll({
						where: {
							eliminado: false
						}
					}).then(function (vacunas) {
						vacunas.forEach(function (vac, index, array) {
							MedicoVacuna.update({
								dias_activacion: req.body.dias_activacion
							}, {
									where: {
										id: vac.id
									}
								}).then(function (alertaDiasActualizados) {
									if (index === array.length - 1) {
										res.json({ mensaje: 'Días de alerta de vacunas actualizados!' })
									}
								})
						});
					})
				}
			}
		})

	router.route('/paciente/aplicacion/vacuna/:id')
		.put(function (req, res) {
			MedicoPacienteVacuna.find({
				where: { id: req.params.id }
			}).then(function (vacunaIdentificada) {
				var fecha_inicio = new Date(req.body.fecha_ultima_aplicacion)
				var fecha_fin = new Date(req.body.fecha_ultima_aplicacion)
				fecha_inicio.setMinutes(0)
				fecha_inicio.setHours(0)
				fecha_fin.setMinutes(59)
				fecha_fin.setHours(23)
				MedicoPacienteVacunaDosis.findOrCreate({
					where: {
						fecha_aplicacion: { $between: [fecha_inicio, fecha_fin] },
						id_paciente_vacuna: req.params.id
					},
					defaults: {
						id_paciente_vacuna: req.params.id,
						fecha_aplicacion: req.body.fecha_ultima_aplicacion,
						eliminado: false
					}
				}).spread(function (dosisAplicada, created) {
					if (created) {
						MedicoPacienteVacuna.update({
							id_paciente: req.body.id_paciente,
							id_vacuna: req.body.id_vacuna,
							fecha_ultima_aplicacion: req.body.fecha_ultima_aplicacion,
							fecha_siguiente_aplicacion: req.body.fecha_siguiente_aplicacion,
							eliminado: req.body.eliminado
						}, {
								where: {
									id: req.params.id
								}
							}).then(function (vacunaAplicada) {
								res.json({ mensaje: 'Dosis aplicada correctamente!.' })
							})
					} else {
						res.json({ mensaje: 'No se puede aplicar en la misma fecha!.' })
					}
				})
			})

		})
		.get(function (req, res) {
			MedicoPacienteVacuna.findAll({
				where: {
					id: req.params.id
				},
				include: [{ model: MedicoPacienteVacunaDosis, as: 'pacienteVacunaDosis' }]
			}).then(function (vacunas) {
				res.json(vacunas)
			})
		})

	router.route('/paciente/vacuna')
		.post(function (req, res) {
			MedicoPacienteVacuna.create({
				id_paciente: req.body.id_paciente,
				id_vacuna: req.body.id_vacuna,
				fecha_ultima_aplicacion: req.body.ultima_aplicacion,
				fecha_siguiente_aplicacion: req.body.siguiente_aplicacion,
				eliminado: false
			}).then(function (pacienteVacuna) {
				res.json(pacienteVacuna.id)
			})
		})

		.get(function (req, res) {
			MedicoPacienteVacuna.findAll({
				where: { id_paciente: req.query.id_paciente },
				include: [{ model: MedicoVacuna, as: 'pacienteVacuna', include: [{ model: VacunaDosis, as: 'vacunaDosis', where: { eliminado: false }, order: [['numero', 'desc']] }] }, { model: MedicoPacienteVacunaDosis, as: 'pacienteVacunaDosis', order: [['createdAt', 'desc']] }]
			}).then(function (vacunasPaciente) {
				res.json(vacunasPaciente);
			});
		});

	router.route('/paciente/vacuna/:id_paciente')
		.get(function (req, res) {
			MedicoPacienteVacuna.findAll({
				where: { id_paciente: req.params.id_paciente },
				include: [{ model: MedicoVacuna, as: 'pacienteVacuna', include: [{ model: VacunaDosis, as: 'vacunaDosis', where: { eliminado: false }, order: [['numero', 'desc']] }] }, { model: MedicoPacienteVacunaDosis, as: 'pacienteVacunaDosis', order: [['createdAt', 'desc']] }]
			}).then(function (vacunasPaciente) {
				res.json(vacunasPaciente);
			});
		});

	router.route('/paciente/vacuna/asignacion')
		.post(function (req, res) {
			MedicoPacienteVacuna.create({
				id_paciente: req.body.id_paciente,
				id_vacuna: req.body.id_vacuna,
				fecha_ultima_aplicacion: req.body.fecha_ultima_aplicacion,
				fecha_siguiente_aplicacion: req.body.fecha_siguiente_aplicacion,
				eliminado: false
			}).then(function (vacunaAsignada) {
				res.json({ mensaje: 'Vacuna Asignada' })
			})
		})

	router.route('/paciente/vacuna/asignacion/:id/:asignar')
		.put(function (req, res) {
			var eliminar = false
			console.log(req.params)
			console.log(req.body)
			if (req.params.asignar === "false") {
				console.log('ingreso')
				eliminar = true
			}
			MedicoPacienteVacuna.update({
				id_paciente: req.body.id_paciente,
				id_vacuna: req.body.id_vacuna,
				fecha_ultima_aplicacion: req.body.fecha_ultima_aplicacion,
				fecha_siguiente_aplicacion: req.body.fecha_siguiente_aplicacion,
				eliminado: eliminar
			}, {
					where: { id: req.params.id },
				}).then(function (vacunasPaciente) {
					res.json('vacuna paciente actualizada');
				});

		});

	router.route('/prerequisito/:id_pre/historial/:id_pac/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var condicionPreRequisito = { eliminado: false }
			var desde = false
			var hasta = false
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				desde = true
			}
			if (req.params.fin != 0) {
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				hasta = true
			}
			if (desde && hasta) {
				condicionPreRequisito = {
					id_prerequisito: req.params.id_pre,
					id_paciente: req.params.id_pac,
					eliminado: false,
					fecha_vencimiento: {
						$between: [inicio, fin]
					}
				}
			} else if (desde && !hasta) {
				condicionPreRequisito = {
					id_prerequisito: req.params.id_pre,
					id_paciente: req.params.id_pac,
					eliminado: false,
					fecha_vencimiento: {
						$gte: [inicio]
					}
				}
			} else if (!desde && hasta) {
				condicionPreRequisito = {
					id_prerequisito: req.params.id_pre,
					id_paciente: req.params.id_pac,
					eliminado: false,
					fecha_vencimiento: {
						$lte: [fin]
					}
				}
			} else if (!desde && !hasta) {
				var hoy = new Date()
				// hoy.setHours(0,0,0,0)
				condicionPreRequisito = {
					// fecha_entrega: null,
					id_prerequisito: req.params.id_pre,
					id_paciente: req.params.id_pac,
					eliminado: false,
					// fecha_vencimiento: {
					// 	$lte: hoy
					// }
				}
			}
			MedicoPacientePreRequisito.findAll({
				where: condicionPreRequisito,
				include: [{ model: MedicoPrerequisito, as: 'preRequisito' }]
			}).then(function (historial) {
				res.json({ historial: historial })
			})
		})
	router.route('/prerequisitos')
		.post(function (req, res) {
			if (req.body.id != undefined) {
				MedicoPrerequisito.update({
					nombre: req.body.nombre,
					vencimiento_mes: req.body.vencimiento_mes,
					// fecha_inicio: req.body.fecha_inicio,
					dias_activacion: req.body.dias_activacion,
					observacion: req.body.observacion,
					puede_modificar_rrhh: req.body.puede_modificar_rrhh
				}, {
						where: {
							id: req.body.id
						}
					}).then(function (prerequisitoCreado) {
						res.json({ mensaje: "Pre-requisitos actualizado satisfactoriamente!" });
					});

			} else {
				if (req.body.setDiasTodos != undefined) {
					MedicoPrerequisito.findAll({

					}).then(function (prere) {
						prere.forEach(function (element, index, array) {
							MedicoPrerequisito.update({
								dias_activacion: req.body.dias_activacion
							}, {
									where: {
										id: element.id
									}
								}).then(function (prerequisitoCreado) {
									if (index === array.length - 1) {
										res.json({ mensaje: "Pre-requisitos actualizado satisfactoriamente!" });
									}
								});
						});
					})
				} else {
					MedicoPrerequisito.create({
						// id_paciente: req.params.id_paciente,
						// id_prerequisito: req.body.prerequisito.id,
						nombre: req.body.nombre,
						vencimiento_mes: req.body.vencimiento_mes,
						// fecha_inicio: req.body.fecha_inicio,
						// fecha_vencimiento: req.body.fecha_vencimiento,
						observacion: req.body.observacion,
						puede_modificar_rrhh: req.body.puede_modificar_rrhh
					}).then(function (prerequisitoCreado) {
						res.json({ mensaje: "Pre-requisitos creados satisfactoriamente!" });
					});
				}
			}
		})
		.put(function (req, res) {
			MedicoPrerequisito.update({
				nombre: req.body.nombre,
				vencimiento_mes: req.body.vencimiento_mes,
				// fecha_inicio: req.body.fecha_inicio,
				// fecha_vencimiento: req.body.fecha_vencimiento,
				observacion: req.body.observacion,
				puede_modificar_rrhh: req.body.puede_modificar_rrhh
			}, {
					where: {
						id: req.body.id
					}
				}).then(function (prerequisitoCreado) {
					res.json({ mensaje: "Pre-requisitos actualizado satisfactoriamente!" });
				});
		})
		.get(function (req, res) {
			MedicoPrerequisito.findAll({
				// include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: Diccionario.PRE_REQUSITO } }]
			}).then(function (prerequisitos) {
				res.json({ prerequisitos: prerequisitos });
			});
		});

	router.route('/generos')
		.get(function (req, res) {
			Tipo.find({
				where: { nombre_corto: Diccionario.GENERO }
				// include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: Diccionario.GENERO } }]
			}).then(function (tipo) {
				Clase.findAll({
					where: { id_tipo: tipo.id }
				}).then(function (generos) {
					res.json(generos);
				})

			});
		});
	router.route('/tipo-control')
		.get(function (req, res) {
			Tipo.find({
				where: { nombre_corto: Diccionario.TIPOCONTROL }
				// include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: Diccionario.GENERO } }]
			}).then(function (tipo) {
				Clase.findAll({
					where: { id_tipo: tipo.id }
				}).then(function (generos) {
					res.json(generos);
				})

			});
		})

	router.route('/prerequisito/paciente')
		.post(function (req, res) {
			var inicio = new Date(req.body.fecha_inicio)
			inicio.setHours(0, 0, 0, 0)
			var fin = new Date(req.body.fecha_inicio)
			fin.setHours(23, 59, 0, 0)
			var asignar = true
			if (req.body.asignado) {
				asignar = false
			}
			if (req.body.reprogramarTodos != undefined) {
				MedicoPacientePreRequisito.findAll({
					where: {
						fecha_entrega: null
					}
				}).then(function (requisitosPac) {
					requisitosPac.forEach(function (repac, index, array) {
						MedicoPacientePreRequisito.update({
							fecha_vencimiento: req.body.fecha_vencimiento
						}, {
								where: {
									id: repac.id
								}
							})
						if (index === array.length - 1) {
							res.json({ mensaje: 'Todos los prerequisitos se reprogramaron correctamente!' })
						}
					});
				})
			} else {
				MedicoPacientePreRequisito.findOrCreate({
					where: {
						id_paciente: req.body.pacientePrerequisito.id,
						id_prerequisito: req.body.preRequisito.id,
						fecha_inicio: { $between: [inicio, fin] },
						fecha_entrega: null
					},
					defaults: {
						id_paciente: req.body.pacientePrerequisito.id,
						id_prerequisito: req.body.preRequisito.id,
						// vencimiento_mes: req.body.vencimiento_mes,
						fecha_inicio: req.body.fecha_inicio,
						//fecha_entrega: req.body.fecha_entrega,
						fecha_vencimiento: req.body.fecha_vencimiento,
						observacion: req.body.observacion,
						// puede_modificar_rrhh: req.body.puede_modificar_rrhh,
						eliminado: asignar
					}
				}).spread(function (prerequisitoAsignado, is_new) {
					if (!is_new) {
						if (req.body.paraAsignar == undefined) {
							MedicoPacientePreRequisito.update({
								id_paciente: req.body.id_paciente,
								id_prerequisito: req.body.id_prerequisito,
								// vencimiento_mes: req.body.vencimiento_mes,
								fecha_entrega: req.body.fecha_entrega,
								fecha_inicio: req.body.fecha_inicio,
								fecha_vencimiento: req.body.fecha_vencimiento,
								observacion: req.body.observacion,
								// puede_modificar_rrhh: req.body.puede_modificar_rrhh,
								eliminado: asignar
							}, {
									where: {
										id_paciente: req.body.id_paciente,
										id_prerequisito: req.body.id_prerequisito
									}
								}).then(function (preRequisitoActualizado) {
									res.json({ mensaje: "Pre-requisito actualizado satisfactoriamente!" });
								})
						} else {
							MedicoPacientePreRequisito.update({
								id_paciente: req.body.pacientePrerequisito.id,
								id_prerequisito: req.body.preRequisito.id,
								// vencimiento_mes: req.body.vencimiento_mes,
								fecha_entrega: req.body.fecha_entrega,
								fecha_inicio: req.body.fecha_inicio,
								fecha_vencimiento: req.body.fecha_vencimiento,
								// observacion: req.body.observacion,
								// puede_modificar_rrhh: req.body.puede_modificar_rrhh,
								eliminado: asignar
							}, {
									where: {
										id_paciente: req.body.pacientePrerequisito.id,
										id_prerequisito: req.body.preRequisito.id
									}
								}).then(function (preRequisitoActualizado) {
									res.json({ mensaje: "Pre-requisito actualizado satisfactoriamente!" });
								})
						}

					} else {
						if (req.body.asignado) {
							res.json({ mensaje: "Pre-requisito asignado satisfactoriamente!" });
						} else {
							res.json({ mensaje: "Pre-requisito ya no esta asignado a esta persona!" });
						}
					}
				});
			}
		})
		.get(function (req, res) {
			MedicoPacientePreRequisito.findAll({
				where: {
					id: req.body.id_paciente,
					eliminado: false
				},
				include: [{ model: MedicoPrerequisito, as: 'preRequisito' }]
			}).then(function (requisitos) {
				res.json({ Requisitos: requisitos })
			})
		})

	router.route('/medico-paciente-pre-requisito-alertas/empresa/:id_empresa/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var condicionPreRequisito = { fecha_entrega: null, eliminado: false }
			var desde = false
			var hasta = false
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				desde = true
			}
			if (req.params.fin != 0) {
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				hasta = true
			}
			if (desde && hasta) {
				condicionPreRequisito = {
					// id_paciente: req.params.id_paciente,
					eliminado: false,
					fecha_entrega: null,
					fecha_vencimiento: {
						$between: [inicio, fin]
					}
				}
			} else if (desde && !hasta) {
				condicionPreRequisito = {
					// id_paciente: req.params.id_paciente,
					fecha_entrega: null,
					eliminado: false,
					fecha_vencimiento: {
						$gte: [inicio]
					}
				}
			} else if (!desde && hasta) {
				condicionPreRequisito = {
					// id_paciente: req.params.id_paciente,
					fecha_entrega: null,
					eliminado: false,
					fecha_vencimiento: {
						$lte: [fin]
					}
				}
			} else if (!desde && !hasta) {
				var hoy = new Date()
				// hoy.setHours(0,0,0,0)
				condicionPreRequisito = {
					fecha_entrega: null,
					// id_paciente: req.params.id_paciente,
					eliminado: false,
					// fecha_vencimiento: {
					// 	$lte: hoy
					// }
				}
			}
			MedicoPacientePreRequisito.findAll({
				where: condicionPreRequisito,
				include: [{ model: MedicoPrerequisito, as: 'preRequisito' }, { model: MedicoPaciente, as: 'pacientePrerequisito', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }
				]
			}).then(function (prerequisitos) {
				res.json({ Prerequisitos: prerequisitos });
			});
		})
	router.route('/medico-paciente-pre-requisito/paciente/:id_paciente/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var requisitosPac = []
			MedicoPrerequisito.findAll({
			}).then(function (lstRequisitos) {
				if(lstRequisitos.length>0){
				lstRequisitos.forEach(function (requi, index, array) {
					var condicionPreRequisito = { id_paciente: req.params.id_paciente, eliminado: false }
					var desde = false
					var hasta = false
					if (req.params.inicio != 0) {
						var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
						desde = true
					}
					if (req.params.fin != 0) {
						var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
						hasta = true
					}
					if (desde && hasta) {
						condicionPreRequisito = {
							id_paciente: req.params.id_paciente,
							eliminado: false,
							id_prerequisito: requi.id,
							fecha_vencimiento: {
								$between: [inicio, fin]
							}
						}
					} else if (desde && !hasta) {
						condicionPreRequisito = {
							id_paciente: req.params.id_paciente,
							eliminado: false,
							id_prerequisito: requi.id,
							fecha_vencimiento: {
								$gte: [inicio]
							}
						}
					} else if (!desde && hasta) {
						condicionPreRequisito = {
							id_paciente: req.params.id_paciente,
							eliminado: false,
							id_prerequisito: requi.id,
							fecha_vencimiento: {
								$lte: [fin]
							}
						}
					} else if (!desde && !hasta) {
						var hoy = new Date()
						// hoy.setHours(0,0,0,0)
						condicionPreRequisito = {
							id_paciente: req.params.id_paciente,
							id_prerequisito: requi.id,
							eliminado: false
							// fecha_vencimiento: {
							// 	$gte: hoy
							// }
						}
					}
					MedicoPacientePreRequisito.findAll({
						limit: 1,
						where: condicionPreRequisito,
						include: [{ model: MedicoPrerequisito, as: 'preRequisito' }, { model: MedicoPaciente, as: 'pacientePrerequisito' }
						],
						order: [['id', 'DESC']]
					}).then(function (prerequisitos) {
						if (prerequisitos[0] != undefined) {
							requisitosPac.push(prerequisitos[0])
						}

						// res.json({ Prerequisitos: prerequisitos });
						if (index == array.length - 1) {
							res.json({ Prerequisitos: requisitosPac });
						}
					});
				});
			}else{
				res.json({ Prerequisitos: [] });
			}
			})
			
		})
	router.route('/medico-paciente-consulta')
		.post(function (req, res) {
			MedicoPacienteConsulta.create({
				id_paciente: req.body.id_paciente,
				fecha: req.body.fecha,
				presion: req.body.presion,
				pulso: req.body.pulso,
				talla: req.body.talla,
				peso: req.body.peso,
				temperatura: req.body.temperatura,
				frecuencia_respiratoria: req.body.frecuencia_respiratoria,
				frecuencia_cardiaca: req.body.frecuencia_cardiaca,
				indice_masa_corporal: req.body.indice_masa,
				subjetivo: req.body.subjetivo,
				objetivo: req.body.objetivo,
				analitico: req.body.diagnosticos,
				plan: req.body.planes,
				evolucion: req.body.evolucion,
				nervioso_central: req.body.nervioso_central,
				sentidos: req.body.ojos_oido_nariz_garganta,
				cardiovascular: req.body.cardio_vascular,
				respiratorio: req.body.respiratorio,
				gastrointestinal: req.body.gastro_instestinal,
				genitourinario: req.body.genitourinario,
				locomotor: req.body.locomotor,
				piel: req.body.piel_faneras,
			}).then(function (medicoPacienteConsultaCreado) {
				res.json({ message: "consulta creada satisfactoriamente!" })
			})
		})
	router.route('/medico-paciente-consulta/paciente/:id_paciente/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var desde = false
			var hasta = false
			var condicionPaciente = { id_paciente: req.params.id_paciente }
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				desde = true
			}
			if (req.params.fin != 0) {
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				hasta = true
			}
			if (desde && hasta) {
				condicionPaciente = {
					id_paciente: req.params.id_paciente,
					fecha: {
						$between: [inicio, fin]
					}
				}
			} else if (desde && !hasta) {
				condicionPaciente = {
					id_paciente: req.params.id_paciente,
					fecha: {
						$gte: [inicio]
					}
				}
			} else if (!desde && hasta) {
				condicionPaciente = {
					id_paciente: req.params.id_paciente,
					fecha: {
						$lte: [fin]
					}
				}
			} else if (!desde && !hasta) {
				var hoy = new Date()
				condicionPaciente = {
					id_paciente: req.params.id_paciente
				}
			}
			// if (req.params.inicio != 0) {
			// 	var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			// 	var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);

			// 	var condicionPaciente = {
			// 		id_paciente: req.params.id_paciente,
			// 		$or: [
			// 			{
			// 				fecha: {
			// 					$between: [inicio, fin]
			// 				}
			// 			}
			// 		]
			// 	};
			// } else {
			// 	var condicionPaciente = {
			// 		id_paciente: req.params.id_paciente,
			// 	}
			// }
			MedicoPacienteConsulta.findAll({
				where: condicionPaciente,
				order: [['createdAt', 'ASC']]
			}).then(function (MedicoPacienteConsultaEncontrado) {
				res.json({ consultas: MedicoPacienteConsultaEncontrado })
			})
		})
	router.route('/medico-paciente-patologia/paciente/:id_paciente')
		.put(function (req, res) {
			MedicoPacienteFicha.update({
				/* 	id_paciente: req.body.paciente.id,
					fecha: req.body.fecha_elaboracion,
					estilo_vida: req.body.estilo_vida,
					actividad_laboral: req.body.actividad_laboral,
					area_operacion: req.body.area_operacion,
					riesgo: req.body.riesgo,
					id_persona_referencia: personaReferenciaCreada.id,
					id_tipo_control: req.body.tipoControl.id,
					alergia_humo_cigarrillo: req.body.alergia_humo_cigarrillo,
					alergia_polvo: req.body.alergia_polvo,
					alergia_picadura: req.body.alergia_picadura,
					alergia_quimico: req.body.alergia_quimico,
					alergia_algun_material: req.body.alergia_algun_material,
					alergia_medicamento: req.body.alergia_medicamento,
					alergia_plantas: req.body.alergia_plantas,
					alergia_alimentos: req.body.alergia_alimentos,
					alergia_conservas: req.body.alergia_conservas,
					alergia_otros: req.body.alergia_otros,
					alergia_otros_comentario: req.body.alergia_otros_comentario,
					es_donante: req.body.es_donante, */
				enfermedad_hipertension: req.body.enfermedad_hipertension,
				enfermedad_cardilogia: req.body.enfermedad_cardilogia,
				enfermedad_lumbalgia: req.body.enfermedad_lumbalgia,
				enfermedad_diabetes: req.body.enfermedad_diabetes,
				enfermedad_digestiva: req.body.enfermedad_digestiva,
				enfermedad_epilepsia: req.body.enfermedad_epilepsia,
				enfermedad_chagas: req.body.enfermedad_chagas,
				enfermedad_asma: req.body.enfermedad_asma,
				enfermedad_hepatitis: req.body.enfermedad_hepatitis,
				enfermedad_otros: req.body.enfermedad_otros,
				enfermedad_comentario: req.body.enfermedad_comentario,
				quirurgico_operado: req.body.quirurgico_operado,
				quirurgico_comentario: req.body.quirurgico_comentario,
			}, {
					where: {
						id: req.body.id
					}
				}).then(function (medicoPacientefichaCreado) {
					res.json({ message: "Patologías paciente actualizadas satisfactoriamente!" })
				})
		})
	router.route('/medico-paciente-pre-requisito/empresa/:id_empresa/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				var condicionPreRequisito = {

					$or: [
						{
							fecha_vencimiento: {
								$between: [inicio, fin]
							}
						}
					]
				};
			} else {
				var condicionPaciente = {}
			}

			MedicoPacientePreRequisito.findAll({
				where: condicionPreRequisito,
				include: [{ model: MedicoPrerequisito, as: 'preRequisito' }, { model: MedicoPaciente, as: 'pacientePrerequisito', include: [{ model: Persona, as: 'persona' }] }
				]
			}).then(function (prerequisitos) {
				res.json({ Prerequisitos: prerequisitos });
			});
		})
	router.route('/medico-paciente-vacunas-alertas/empresa/:id_empresa/inicio/:inicio/fin/:fin/opcion/:opcion')
		.get(function (req, res) {
			var condicionPaciente = { eliminado: false }
			var desde = false
			var hasta = false
			if (req.params.opcion != 0) {
				if (req.params.inicio != 0) {
					var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
					desde = true
				}
				if (req.params.fin != 0) {
					var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
					hasta = true
				}
				if (desde && hasta) {
					condicionPaciente = {
						eliminado: false,
						id_vacuna: req.params.opcion,
						fecha_siguiente_aplicacion: {
							$between: [inicio, fin]
						}
					}
				} else if (desde && !hasta) {
					condicionPaciente = {
						id_vacuna: req.params.opcion,
						eliminado: false,
						fecha_siguiente_aplicacion: {
							$gte: [inicio]
						}
					}
				} else if (!desde && hasta) {
					condicionPaciente = {
						id_vacuna: req.params.opcion,
						eliminado: false,
						fecha_siguiente_aplicacion: {
							$lte: [fin]
						}
					}
				} else if (!desde && !hasta) {
					var hoy = new Date()
					condicionPaciente = {
						id_vacuna: req.params.opcion,
						eliminado: false,
					}
				}
			} else {
				if (req.params.inicio != 0) {
					var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
					desde = true
				}
				if (req.params.fin != 0) {
					var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
					hasta = true
				}
				if (desde && hasta) {
					condicionPaciente = {
						eliminado: false,
						fecha_siguiente_aplicacion: {
							$between: [inicio, fin]
						}
					}
				} else if (desde && !hasta) {
					condicionPaciente = {
						eliminado: false,
						fecha_siguiente_aplicacion: {
							$gte: [inicio]
						}
					}
				} else if (!desde && hasta) {
					condicionPaciente = {
						eliminado: false,
						fecha_siguiente_aplicacion: {
							$lte: [fin]
						}
					}
				} else if (!desde && !hasta) {
					var hoy = new Date()
					condicionPaciente = {
						eliminado: false,
					}
				}
			}
			MedicoPacienteVacuna.findAll({
				where: condicionPaciente,

				include: [{ model: MedicoPaciente, as: 'paciente', include: [{ model: Persona, as: 'persona' }] }, { model: MedicoVacuna, as: 'pacienteVacuna', include: [{ model: VacunaDosis, as: 'vacunaDosis', where: { eliminado: false }, order: [['numero', 'desc']] }] }, { model: MedicoPacienteVacunaDosis, as: 'pacienteVacunaDosis' }]
			}).then(function (vacunas) {
				var vacas = []
				if (vacunas.length > 0) {
					vacunas.forEach(function (vac, index, array) {
						if (vac.paciente !== null && vac.paciente !== undefined) {
							vac.paciente.activo = vac.paciente.eliminado
							var ulti_aplic = new Date(vac.fecha_ultima_aplicacion).getTime()
							var indexSgteDosis = vac.pacienteVacunaDosis.length
							var proyeccion = new Date(vac.fecha_siguiente_aplicacion).getTime()
							if (vac.pacienteVacuna.vacunaDosis[indexSgteDosis] != undefined) {
								// proyeccion = proyeccion.setTime(ulti_aplic+(vac.pacienteVacuna.vacunaDosis[indexSgteDosis].es_dosis?vac.pacienteVacuna.vacunaDosis[indexSgteDosis].tiempo * 86400000:(vac.pacienteVacuna.vacunaDosis[indexSgteDosis].tiempo*30) * 86400000).tiempo)
								var hoy = new Date().getTime()
								var diferencia = Math.floor(hoy - proyeccion) / 86400000
								if (diferencia < vac.pacienteVacuna.dias_activacion && diferencia > vac.pacienteVacuna.dias_activacion * -1) {
									//15 = vac.pacienteVacuna.dias_activacion
									vacas.push(vac)
								}

								if (index == array.length - 1) {
									console.log(vacas.length)
									res.json({ Vacunas: vacas });
								}
							} else {
								if (index == array.length - 1) {
									res.json({ Vacunas: vacas });
								}
							}
						}
						if (index == array.length - 1) {
							res.json({ Vacunas: vacas });
						}
					});
				} else {
					var nada = []
					res.json({ Vacunas: nada });
				}

			});
		})
	router.route('/medico-paciente-vacunas/empresa/:id_empresa/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				var condicionPaciente = {
					eliminado: false,
					$or: [
						{
							ultima_Aplicacion: {
								$between: [inicio, fin]
							}
						}
					]
				};
			} else {
				var condicionPaciente = { eliminado: false, }
			}

			MedicoPacienteVacuna.findAll({
				where: condicionPaciente,
				include: [{ model: MedicoPaciente, as: 'paciente', include: [{ model: Persona, as: 'persona' }] }, { model: MedicoVacuna, as: 'pacienteVacuna' }]
			}).then(function (vacunas) {
				res.json({ Vacunas: vacunas });
			});
		})

	router.route('/historial-ficha-medico-paciente/paciente/:id_paciente/inicio/:inicio/fin/:fin/tipo-control/:tipo_control')
		.get(function (req, res) {
			// var condicionFichaPaciente = { id_paciente: req.params.id_paciente }
			var condicionTipoControl = {}
			var desde = false
			var hasta = false
			var condicionFichaPaciente = { id_paciente: req.params.id_paciente }
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				desde = true
			}
			if (req.params.fin != 0) {
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				hasta = true
			}
			if (desde && hasta) {
				condicionFichaPaciente = {
					id_paciente: req.params.id_paciente,
					fecha: {
						$between: [inicio, fin]
					}
				}
			} else if (desde && !hasta) {
				condicionFichaPaciente = {
					id_paciente: req.params.id_paciente,
					fecha: {
						$gte: [inicio]
					}
				}
			} else if (!desde && hasta) {
				condicionFichaPaciente = {
					id_paciente: req.params.id_paciente,
					fecha: {
						$lte: [fin]
					}
				}
			} else if (!desde && !hasta) {
				var hoy = new Date()
				condicionFichaPaciente = {
					id_paciente: req.params.id_paciente
				}
			}
			// if (req.params.inicio != 0) {
			// 	var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			// 	var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			// 	condicionFichaPaciente = {
			// 		id_paciente: req.params.id_paciente,
			// 		$and: [
			// 			{
			// 				fecha: {
			// 					$between: [inicio, fin]
			// 				}
			// 			}
			// 		]
			// 	};
			// }
			if (req.params.tipo_control != 0) {
				condicionTipoControl = { id: req.params.tipo_control }
				// }else{
				// 	MedicoPacienteFicha.findAll({
				// 		where: condicionFichaPaciente,
				// 		include: [{ model: Clase, as: 'tipoControl'}, {
				// 			model: MedicoPaciente, as: 'paciente', include: [{ model: Empresa, as: 'empresa' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }]
				// 		}, { model: Persona, as: 'personaReferencia' }],
				// 		order: [['createdAt', 'DESC']]
				// 	}).then(function (fichaEncontrada) {
				// 		res.json(fichaEncontrada)
				// 	})
			}
			MedicoPacienteFicha.findAll({
				where: condicionFichaPaciente,
				include: [{ model: Clase, as: 'tipoControl', where: condicionTipoControl }, {
					model: MedicoPaciente, as: 'paciente', include: [{ model: Empresa, as: 'empresa' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }]
				}, { model: Persona, as: 'personaReferencia' }],
				order: [['createdAt', 'DESC']]
			}).then(function (fichaEncontrada) {
				res.json(fichaEncontrada)
			})
		})
	router.route('/medico-paciente-ficha/paciente/:id_paciente')
		.get(function (req, res) {
			MedicoPacienteFicha.findAll({
				limit: 1,
				where: {
					id_paciente: req.params.id_paciente
				},
				include: [{ model: Clase, as: 'tipoControl' },
				{
					model: MedicoPaciente, as: 'paciente', include: [{ model: Clase, as: 'extension' }, { model: Empresa, as: 'empresa' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }]
				}, { model: Persona, as: 'personaReferencia' }],
				order: [['id', 'DESC']]
			}).then(function (fichaEncontrada) {
				var ficha = fichaEncontrada[0]
				if (ficha) {
					res.json({ ficha: ficha })
				} else {
					MedicoPaciente.find({
						where: { id: req.params.id_paciente },
						include: [{ model: Clase, as: 'extension' },{ model: Clase, as: 'campo' },
						{ model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] },
						{ model: Empresa, as: 'empresa' }]
					}).then(function (pacienteEncontrado) {
						res.json({ paciente: pacienteEncontrado })
					});
				}
			})
		})
		.post(function (req, res) {
			if (!req.body.personaReferencia.id) {
				Persona.create({
					nombres: req.body.personaReferencia.nombres,
					telefono: req.body.personaReferencia.telefono,
					direccion: req.body.personaReferencia.direecion,
					telefono_movil: req.body.personaReferencia.telefono_movil,
					direccion_ciudad: req.body.personaReferencia.direccion_ciudad,
					direccion_zona: req.body.personaReferencia.direccion_zona,
					direccion_localidad: req.body.personaReferencia.direccion_localidad,
					direccion_numero: req.body.personaReferencia.direccion_numero
				}).then(function (personaReferenciaCreada) {
					Empresa.update({
						razon_social: req.body.paciente.empresa.razon_social,
						telefono: req.body.paciente.empresa.telefono
					}, {
							where: {
								id: req.body.paciente.empresa.id
							}
						}).then(function (EmpresaActualizada) {
							MedicoPaciente.update({
								grupo_sanguineo: req.body.paciente.grupo_sanguineo,
								id_extension: req.body.paciente.extension.id,
								activo: req.body.paciente.activo
							}, {
									where: {
										id: req.body.paciente.id
									}
								}).then(function (medicoPacienteActualizado) {

									Persona.update({
										nombres: req.body.paciente.persona.nombres,
										apellido_paterno: req.body.paciente.persona.apellido_paterno,
										apellido_materno: req.body.paciente.persona.apellido_materno,
										ci: req.body.paciente.persona.ci,
										id_genero: req.body.paciente.persona.id_genero,
										nombre_completo: req.body.paciente.persona.nombres + ' ' + req.body.paciente.persona.apellido_paterno + ' ' + req.body.paciente.persona.apellido_materno,
										telefono: req.body.paciente.persona.telefono,
										telefono_movil: req.body.paciente.persona.telefono_movil,
										correo_electronico: req.body.paciente.persona.correo_electronico
									}, {
											where: {
												id: req.body.paciente.persona.id
											}
										}).then(function (MedicoPasientePersonaActualizado) {
											MedicoPacienteFicha.create({
												id_paciente: req.body.paciente.id,
												fecha: req.body.fecha_elaboracion,
												estilo_vida: req.body.estilo_vida,
												actividad_laboral: req.body.actividad_laboral,
												area_operacion: req.body.area_operacion,
												riesgo: req.body.riesgo,
												id_persona_referencia: personaReferenciaCreada.id,
												id_tipo_control: req.body.tipoControl.id,
												alergia_humo_cigarrillo: req.body.alergia_humo_cigarrillo,
												alergia_polvo: req.body.alergia_polvo,
												alergia_picadura: req.body.alergia_picadura,
												alergia_quimico: req.body.alergia_quimico,
												alergia_algun_material: req.body.alergia_algun_material,
												alergia_medicamento: req.body.alergia_medicamento,
												alergia_plantas: req.body.alergia_plantas,
												alergia_alimentos: req.body.alergia_alimentos,
												alergia_conservas: req.body.alergia_conservas,
												alergia_otros: req.body.alergia_otros,
												alergia_otros_comentario: req.body.alergia_otros_comentario,
												es_donante: req.body.es_donante,
												enfermedad_hipertension: req.body.enfermedad_hipertension,
												enfermedad_cardilogia: req.body.enfermedad_cardilogia,
												enfermedad_lumbalgia: req.body.enfermedad_lumbalgia,
												enfermedad_diabetes: req.body.enfermedad_diabetes,
												enfermedad_digestiva: req.body.enfermedad_digestiva,
												enfermedad_epilepsia: req.body.enfermedad_epilepsia,
												enfermedad_chagas: req.body.enfermedad_chagas,
												enfermedad_asma: req.body.enfermedad_asma,
												enfermedad_hepatitis: req.body.enfermedad_hepatitis,
												enfermedad_otros: req.body.enfermedad_otros,
												enfermedad_comentario: req.body.enfermedad_comentario,
												quirurgico_operado: req.body.quirurgico_operado,
												quirurgico_comentario: req.body.quirurgico_comentario
											}).then(function (medicoPacientefichaCreado) {
												res.json({ message: "Ficha paciente actualizada satisfactoriamente!" })
											})
										})
								})
						})
				})
			} else {
				Persona.update({
					nombres: req.body.personaReferencia.nombres,
					telefono: req.body.personaReferencia.telefono,
					direccion: req.body.personaReferencia.direecion,
					telefono_movil: req.body.personaReferencia.telefono_movil,
					direccion_ciudad: req.body.personaReferencia.direccion_ciudad,
					direccion_zona: req.body.personaReferencia.direccion_zona,
					direccion_localidad: req.body.personaReferencia.direccion_localidad,
					direccion_numero: req.body.personaReferencia.direccion_numero
				}, {
						where: {
							id: req.body.personaReferencia.id
						}
					}).then(function (personaReferenciaCreada) {
						Empresa.update({
							razon_social: req.body.paciente.empresa.razon_social,
							telefono: req.body.paciente.empresa.telefono
						}, {
								where: {
									id: req.body.paciente.empresa.id
								}
							}).then(function (EmpresaActualizada) {
								MedicoPaciente.update({
									grupo_sanguineo: req.body.paciente.grupo_sanguineo,
									id_extension: req.body.paciente.extension.id,
									activo: req.body.paciente.activo
								}, {
										where: {
											id: req.body.paciente.id
										}
									}).then(function (medicoPacienteActualizado) {
										Persona.update({
											nombres: req.body.paciente.persona.nombres,
											apellido_paterno: req.body.paciente.persona.apellido_paterno,
											apellido_materno: req.body.paciente.persona.apellido_materno,
											ci: req.body.paciente.persona.ci,
											id_genero: req.body.paciente.persona.genero.id,
											nombre_completo: req.body.paciente.persona.nombres + ' ' + req.body.paciente.persona.apellido_paterno + ' ' + req.body.paciente.persona.apellido_materno,
											telefono: req.body.paciente.persona.telefono,
											telefono_movil: req.body.paciente.persona.telefono_movil,
											correo_electronico: req.body.paciente.persona.correo_electronico
										}, {
												where: {
													id: req.body.paciente.persona.id
												}
											}).then(function (MedicoPasientePersonaActualizado) {
												MedicoPacienteFicha.create({
													id_paciente: req.body.paciente.id,
													fecha: req.body.fecha_elaboracion,
													estilo_vida: req.body.estilo_vida,
													actividad_laboral: req.body.actividad_laboral,
													area_operacion: req.body.area_operacion,
													riesgo: req.body.riesgo,
													id_persona_referencia: req.body.personaReferencia.id,
													id_tipo_control: req.body.tipoControl.id,
													alergia_humo_cigarrillo: req.body.alergia_humo_cigarrillo,
													alergia_polvo: req.body.alergia_polvo,
													alergia_picadura: req.body.alergia_picadura,
													alergia_quimico: req.body.alergia_quimico,
													alergia_algun_material: req.body.alergia_algun_material,
													alergia_medicamento: req.body.alergia_medicamento,
													alergia_plantas: req.body.alergia_plantas,
													alergia_alimentos: req.body.alergia_alimentos,
													alergia_conservas: req.body.alergia_conservas,
													alergia_otros: req.body.alergia_otros,
													alergia_otros_comentario: req.body.alergia_otros_comentario,
													es_donante: req.body.es_donante,
													enfermedad_hipertension: req.body.enfermedad_hipertension,
													enfermedad_cardilogia: req.body.enfermedad_cardilogia,
													enfermedad_lumbalgia: req.body.enfermedad_lumbalgia,
													enfermedad_diabetes: req.body.enfermedad_diabetes,
													enfermedad_digestiva: req.body.enfermedad_digestiva,
													enfermedad_epilepsia: req.body.enfermedad_epilepsia,
													enfermedad_chagas: req.body.enfermedad_chagas,
													enfermedad_asma: req.body.enfermedad_asma,
													enfermedad_hepatitis: req.body.enfermedad_hepatitis,
													enfermedad_otros: req.body.enfermedad_otros,
													enfermedad_comentario: req.body.enfermedad_comentario,
													quirurgico_operado: req.body.quirurgico_operado,
													quirurgico_comentario: req.body.quirurgico_comentario
												}).then(function (medicoPacientefichaCreado) {
													res.json({ message: "Ficha paciente creada satisfactoriamente!" })
												})
											})
									})
							})
					})
			}
		})
	router.route('/medico-paciente-consulta/paciente/:id_paciente')
		.put(function (req, res) {
			MedicoPacienteConsulta.update({
				id_paciente: req.body.id_paciente,
				fecha: req.body.fecha,
				presion: req.body.presion,
				pulso: req.body.pulso,
				talla: req.body.talla,
				peso: req.body.peso,
				temperatura: req.body.temperatura,
				frecuencia_respiratoria: req.body.frecuencia_respiratoria,
				frecuencia_cardiaca: req.body.frecuencia_cardiaca,
				indice_masa_corporal: req.body.indice_masa,
				subjetivo: req.body.subjetivo,
				objetivo: req.body.objetivo,
				analitico: req.body.diagnosticos,
				plan: req.body.planes,
				evolucion: req.body.evolucion,
				nervioso_central: req.body.nervioso_central,
				sentidos: req.body.ojos_oido_nariz_garganta,
				cardiovascular: req.body.cardio_vascular,
				respiratorio: req.body.respiratorio,
				gastrointestinal: req.body.gastro_instestinal,
				genitourinario: req.body.genitourinario,
				locomotor: req.body.locomotor,
				piel: req.body.piel_faneras,
			}, {
					where: {
						id: req.params.id_paciente
					}
				}).then(function (medicoPacienteConsultaCreado) {
					res.json({ message: "consulta creada satisfactoriamente!" })
				})
		})

	router.route('/prerequisitos/paciente/:id_paciente')
		.post(function (req, res) {
			Clase.find({
				where: { nombre_corto: Diccionario.PRE_REQUSITO }
			}).then(function (clase) {
				req.body.prerequisitos.forEach(function (prerequisito, index, array) {
					MedicoPrerequisito.find({
						where: {
							$or: [{ id_prerequisito: prerequisito.id_prerequisito }]
						},
					}).then(function (prerequisitoEncontrado) {
						if (prerequisitoEncontrado) {
							MedicoPrerequisito.update({
								vencimiento_mes: prerequisito.vencimiento_mes,
								fecha_inicio: prerequisito.fecha_inicio,
								fecha_vencimiento: prerequisito.fecha_vencimiento,
								observacion: prerequisito.observacion,
								puede_modificar_rrhh: prerequisito.puede_modificar_rrhh
							}, {
									where: {
										id: prerequisitoEncontrado.id
									}
								}).then(function (prerequisitoCreado) {
									if (index === (array.length - 1)) {
										res.json({ mensaje: "¡Datos de Pre-requisito actualizados satisfactoriamente!" });
									}
								});
						} else {
							MedicoPrerequisito.create({
								id_paciente: req.params.id_paciente,
								id_prerequisito: prerequisito.id_prerequisito,
								vencimiento_mes: prerequisito.vencimiento_mes,
								fecha_inicio: prerequisito.fecha_inicio,
								fecha_vencimiento: prerequisito.fecha_vencimiento,
								observacion: prerequisito.observacion,
								puede_modificar_rrhh: prerequisito.puede_modificar_rrhh

							}).then(function (prerequisitoCreado) {
								if (index === (array.length - 1)) {
									res.json({ mensaje: "Pre-requisitos creados satisfactoriamente!" });
								}
							});
						}

					})

				})
			})
		})

	//rutas laboratorio inicio
	router.route('/nuevo-laboratorio/empresa/:id_empresa')
		.post(function (req, res) {
			if (req.body.id) {
				MedicoLaboratorio.update({
					nombre: req.body.nombre,
					descripcion: req.body.descripcion,
					id_empresa: req.params.id_empresa,
				}, {
						where: { id: req.body.id }
					}).then(function (MedicoLaboratorioCreado) {
						res.json({ message: "laboratorio actualizado satisfactoriamente!" })
					})
			} else {
				MedicoLaboratorio.create({
					nombre: req.body.nombre,
					descripcion: req.body.descripcion,
					id_empresa: req.params.id_empresa
				}).then(function (MedicoLaboratorioCreado) {
					res.json({ message: "laboratorio creado satisfactoriamente!" })
				})
			}
		})
		.put(function (req, res) {
			MedicoLaboratorio.find({
				where: { id_empresa: req.params.id_empresa, id: req.body.id },
				include: [{ model: MedicoLaboratorioExamen, as: 'laboratorioExamenes' }]
			}).then(function (MedicosLaboratorioEncontrados) {
				if (MedicosLaboratorioEncontrados.laboratorioExamenes.length > 0) {

					res.json({ message: "EL laboratorio cuenta con historial de examenes no se puede eliminar!" })
				} else {
					MedicoLaboratorio.destroy({
						where: {
							id: req.body.id
						}
					}).then(function (medicoLaboratorioEliminado) {
						res.json({ message: "Eliminado Satisfactoriamente!" })
					})

				}

			})
		})
		.get(function (req, res) {
			MedicoLaboratorio.findAll({
				where: { id_empresa: req.params.id_empresa }
			}).then(function (MedicosLaboratorioEncontrados) {
				res.json(MedicosLaboratorioEncontrados)
			})
		})
	router.route('/nuevo-laboratorio-examen/laboratorio/:id_laboratorio')
		.post(function (req, res) {
			if (req.body.id) {
				MedicoLaboratorioExamen.update({
					nombre: req.body.nombre,
					examen: req.body.examen,
					unidad: req.body.unidad,
					observacion: req.body.observacion,
					id_laboratorio: req.params.id_laboratorio
				}, {
						where: { id: req.body.id }
					}).then(function (MedicoLaboratorioCreado) {
						res.json({ message: "laboratorio examen actualizado satisfactoriamente!" })
					})
			} else {
				MedicoLaboratorioExamen.create({
					nombre: req.body.nombre,
					examen: req.body.examen,
					unidad: req.body.unidad,
					observacion: req.body.observacion,
					id_laboratorio: req.params.id_laboratorio
				}).then(function (MedicoLaboratorioCreado) {
					res.json({ message: "laboratorio examen creado satisfactoriamente1" })
				})
			}

		})
		.put(function (req, res) {
			MedicoLaboratorioExamen.find({
				where: { id: req.body.id },
				include: [{ model: MedicoLaboratorioResultado, as: 'laboratorioPacientesExamenes' }]
			}).then(function (MedicosLaboratorioExamenEncontrados) {
				if (MedicosLaboratorioExamenEncontrados.laboratorioPacientesExamenes.length > 0) {

					res.json({ message: "EL examen cuenta con historial de resultados no se puede eliminar!" })
				} else {
					MedicoLaboratorioExamen.destroy({
						where: {
							id: req.body.id
						}
					}).then(function (medicoLaboratorioEliminado) {
						res.json({ message: "Eliminado Satisfactoriamente!" })
					})

				}

			})
		})
		.get(function (req, res) {
			MedicoLaboratorioExamen.findAll({
				where: { id_laboratorio: req.params.id_laboratorio }
			}).then(function (MedicoLaboratorioExamenesEncontrado) {
				res.json(MedicoLaboratorioExamenesEncontrado)
			})
		})
	router.route('/nuevo-laboratorio-resultado/laboratorio/:id_laboratorio/paciente/:id_paciente')
		.post(function (req, res) {
			MedicoLaboratorioPaciente.create({
				id_laboratorio: req.params.id_laboratorio,
				id_paciente: req.params.id_paciente,
				fecha: req.body.fecha
			}).then(function (MedicoLaboratorioCreado) {
				req.body.examenes.forEach(function (examen, index, array) {
					if (examen.estado != null || examen.resultado != null) {
						MedicoLaboratorioResultado.create({
							id_laboratorio_paciente: MedicoLaboratorioCreado.id,
							id_laboratorio_examen: examen.id,
							resultado: examen.resultado
						}).then(function (MedicoLaboratorioCreado) {
							if (index === (array.length - 1)) {
								res.json({ message: "Resultados agregados satisfactoriamente" })
							}
						})
					} else {
						if (index === (array.length - 1)) {
							res.json({ message: "Resultados agregados satisfactoriamente" })
						}
					}
				}, this);

			})
		})
	router.route('/laboratorio-resultado/laboratorio/:id_laboratorio/paciente/:id_paciente/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var desde = false
			var hasta = false
			var condicionLaboratorioPaciente = { id_laboratorio: req.params.id_laboratorio, id_paciente: req.params.id_paciente }
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				desde = true
			}
			if (req.params.fin != 0) {
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				hasta = true
			}
			if (desde && hasta) {
				condicionLaboratorioPaciente = {
					id_laboratorio: req.params.id_laboratorio,
					id_paciente: req.params.id_paciente,
					fecha: {
						$between: [inicio, fin]
					}
				}
			} else if (desde && !hasta) {
				condicionLaboratorioPaciente = {
					id_laboratorio: req.params.id_laboratorio,
					id_paciente: req.params.id_paciente,
					fecha: {
						$gte: [inicio]
					}
				}
			} else if (!desde && hasta) {
				condicionLaboratorioPaciente = {
					id_laboratorio: req.params.id_laboratorio,
					id_paciente: req.params.id_paciente,
					fecha: {
						$lte: [fin]
					}
				}
			} else if (!desde && !hasta) {
				var hoy = new Date()
				condicionLaboratorioPaciente = {
					id_laboratorio: req.params.id_laboratorio,
					id_paciente: req.params.id_paciente
				}
			}
			// if (req.params.inicio != 0) {
			// 	var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			// 	var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			// 	condicionLaboratorioPaciente = {
			// 		id_laboratorio: req.params.id_laboratorio, id_paciente: req.params.id_paciente,
			// 		$or: [
			// 			{
			// 				fecha: {
			// 					$between: [inicio, fin]
			// 				}
			// 			}
			// 		]
			// 	};
			// }
			MedicoLaboratorioPaciente.findAll({
				where: condicionLaboratorioPaciente,
				include: [{ model: MedicoLaboratorio, as: 'laboratorio' },
				{ model: MedicoLaboratorioResultado, as: 'laboratorioResultados', include: [{ model: MedicoLaboratorioExamen, as: 'laboratorioExamen' }] }]
			}).then(function (MedicoLaboratorioExamenesEncontrado) {
				res.json(MedicoLaboratorioExamenesEncontrado)
			})
		})

	//rutas laboratorio fin

	//rutas Diagnostico inicio

	router.route('/nuevo-diagnostico/empresa/:id_empresa')
		.put(function (req, res) {
			MedicoDiagnostico.find({
				where: { id_empresa: req.params.id_empresa, id: req.body.id },
				include: [{ model: MedicoDiagnosticoExamen, as: 'diagnosticoExamenes' }]
			}).then(function (MedicosDiagnosticoEncontrados) {
				if (MedicosDiagnosticoEncontrados.diagnosticoExamenes.length > 0) {

					res.json({ message: "EL diagnostico cuenta con historial de examenes no se puede eliminar!" })
				} else {
					MedicoDiagnostico.destroy({
						where: {
							id: req.body.id
						}
					}).then(function (medicoDiagnosticoEliminado) {
						res.json({ message: "Eliminado Satisfactoriamente!" })
					})

				}

			})
		})
		.post(function (req, res) {
			if (req.body.id) {
				MedicoDiagnostico.update({
					nombre: req.body.nombre,
					descripcion: req.body.descripcion,
					id_empresa: req.params.id_empresa,
				}, {
						where: { id: req.body.id }
					}).then(function (MedicoLaboratorioCreado) {
						res.json({ message: "diagnostico actualizado satisfactoriamente!" })
					})
			} else {
				MedicoDiagnostico.create({
					nombre: req.body.nombre,
					descripcion: req.body.descripcion,
					id_empresa: req.params.id_empresa
				}).then(function (MedicoLaboratorioCreado) {
					res.json({ message: "diagnostico creado satisfactoriamente!" })
				})
			}
		})
		.get(function (req, res) {
			MedicoDiagnostico.findAll({
				where: { id_empresa: req.params.id_empresa }
			}).then(function (MedicosDiagnosticosEncontrados) {
				res.json(MedicosDiagnosticosEncontrados)
			})
		})

	router.route('/nuevo-diagnostico-examen/diagnostico/:id_diagnostico')
		.put(function (req, res) {
			MedicoDiagnosticoExamen.find({
				where: { id: req.body.id },
				include: [{ model: MedicoDiagnosticoResultado, as: 'diagnosticoPacientesExamenes' }]
			}).then(function (MedicosDiagnosticoExamenEncontrados) {
				if (MedicosDiagnosticoExamenEncontrados.diagnosticoPacientesExamenes.length > 0) {

					res.json({ message: "EL examen cuenta con historial de resultados no se puede eliminar!" })
				} else {
					MedicoDiagnosticoExamen.destroy({
						where: {
							id: req.body.id
						}
					}).then(function (medicoDiagnosticoEliminado) {
						res.json({ message: "Eliminado Satisfactoriamente!" })
					})

				}

			})
		})
		.post(function (req, res) {
			if (req.body.id) {
				MedicoDiagnosticoExamen.update({
					nombre: req.body.nombre,
					examen: req.body.examen,
					unidad: req.body.unidad,
					observacion: req.body.observacion,
					id_diagnostico: req.params.id_diagnostico
				}, {
						where: { id: req.body.id }
					}).then(function (MedicodiagnosticoCreado) {
						res.json({ message: "diagnostico examen actualizado satisfactoriamente!" })
					})
			} else {
				MedicoDiagnosticoExamen.create({
					nombre: req.body.nombre,
					examen: req.body.examen,
					unidad: req.body.unidad,
					observacion: req.body.observacion,
					id_diagnostico: req.params.id_diagnostico
				}).then(function (MedicodiagnosticoCreado) {
					res.json({ message: "diagnostico examen creado satisfactoriamente!" })
				})
			}

		})
		.get(function (req, res) {
			MedicoDiagnosticoExamen.findAll({
				where: { id_diagnostico: req.params.id_diagnostico }
			}).then(function (MedicoDiagnosticoExamenesEncontrado) {
				res.json(MedicoDiagnosticoExamenesEncontrado)
			})
		})
	router.route('/nuevo-diagnostico-resultado/diagnostico/:id_diagnostico/paciente/:id_paciente')
		.post(function (req, res) {
			MedicoDiagnosticoPaciente.create({
				id_diagnostico: req.params.id_diagnostico,
				id_paciente: req.params.id_paciente,
				fecha: req.body.fecha
			}).then(function (MedicoDiagnosticoCreado) {
				req.body.examenes.forEach(function (examen, index, array) {
					if (examen.estado != null || examen.resultado != null) {
						MedicoDiagnosticoResultado.create({
							id_diagnostico_paciente: MedicoDiagnosticoCreado.id,
							id_diagnostico_examen: examen.id,
							estado: examen.estado,
							resultado: examen.resultado
						}).then(function (MedicoDiagnosticoResltadoCreado) {
							if (index === (array.length - 1)) {
								res.json({ message: "Resultados agregados satisfactoriamente" })
							}
						})
					} else {
						if (index === (array.length - 1)) {
							res.json({ message: "Resultados agregados satisfactoriamente" })
						}
					}
				}, this);

			})
		})

	router.route('/diagnostico-resultado/diagnostico/:id_diagnostico/paciente/:id_paciente/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var desde = false
			var hasta = false
			var condicionDiagnosticoPaciente = { id_diagnostico: req.params.id_diagnostico, id_paciente: req.params.id_paciente }
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				desde = true
			}
			if (req.params.fin != 0) {
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				hasta = true
			}
			if (desde && hasta) {
				condicionDiagnosticoPaciente = {
					id_diagnostico: req.params.id_diagnostico,
					id_paciente: req.params.id_paciente,
					fecha: {
						$between: [inicio, fin]
					}
				}
			} else if (desde && !hasta) {
				condicionDiagnosticoPaciente = {
					id_diagnostico: req.params.id_diagnostico,
					id_paciente: req.params.id_paciente,
					fecha: {
						$gte: [inicio]
					}
				}
			} else if (!desde && hasta) {
				condicionDiagnosticoPaciente = {
					id_diagnostico: req.params.id_diagnostico,
					id_paciente: req.params.id_paciente,
					fecha: {
						$lte: [fin]
					}
				}
			} else if (!desde && !hasta) {
				var hoy = new Date()
				condicionDiagnosticoPaciente = {
					id_diagnostico: req.params.id_diagnostico,
					id_paciente: req.params.id_paciente
				}
			}
			// var condicionDiagnosticoPaciente = { id_diagnostico: req.params.id_diagnostico, id_paciente: req.params.id_paciente }
			// if (req.params.inicio != 0) {
			// 	var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
			// 	var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
			// 	condicionDiagnosticoPaciente = {
			// 		id_diagnostico: req.params.id_diagnostico, id_paciente: req.params.id_paciente,
			// 		$or: [
			// 			{
			// 				fecha: {
			// 					$between: [inicio, fin]
			// 				}
			// 			}
			// 		]
			// 	};
			// }
			MedicoDiagnosticoPaciente.findAll({
				where: condicionDiagnosticoPaciente,
				include: [{ model: MedicoDiagnostico, as: 'diagnostico' },
				{ model: MedicoDiagnosticoResultado, as: 'diagnosticoResultados', include: [{ model: MedicoDiagnosticoExamen, as: 'diagnosticoExamen' }] }]
			}).then(function (MedicoDiagnosticoExamenesEncontrado) {
				res.json(MedicoDiagnosticoExamenesEncontrado)
			})
		})
	//rutas Diagnostico fin
}