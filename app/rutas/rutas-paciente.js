module.exports = function (router, Usuario, MedicoPaciente, Persona, Empresa, Sucursal, MedicoPrerequisito, Clase, Diccionario, Tipo, decodeBase64Image, fs, MedicoVacuna, VacunaDosis,
	MedicoPacienteVacuna, MedicoPacienteVacunaDosis, MedicoPacienteConsulta, MedicoPacienteFicha, sequelize, Sequelize, MedicoLaboratorioExamen, MedicoLaboratorio, MedicoLaboratorioPaciente, MedicoLaboratorioResultado,
	MedicoLaboratorioResultado, MedicoDiagnostico, MedicoDiagnosticoExamen, MedicoDiagnosticoPaciente, MedicoDiagnosticoResultado) {

	router.route('/paciente/:id_paciente')
		.get(function (req, res) {
			MedicoPaciente.find({
				where: {
					id: req.params.id_paciente
				},
				include: [{ model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }
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
			MedicoPaciente.find({
					where: {
						id: req.params.id_paciente
					},
					include: [{model: Persona, as: 'persona'}]
				}).then(function (pacienteInactivo) {
					Persona.update({
						activo: req.params.activo
					}, {
							where: {
								id: pacienteInactivo.persona.dataValues.id
							}
					})
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
						id_genero: req.body.persona.id_genero,
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
							fs.writeFileSync('./img/persona' + req.body.persona.id + '.jpg', imagenPersona.data, 'base64', function (err) { });
							imagen = './img/persona' + req.body.persona.id + '.jpg';
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
									extension: req.body.extension,
									grupo_sanguineo: req.body.grupo_sanguineo,
									cargo: req.body.cargo,
									campo: req.body.campo,
									designacion_empresa: req.body.designacion_empresa,
									eliminado: false,
								}).then(function (medicoPacienteCreado) {
									res.json({ message: 'creado Satisfactoriamente' });
								});
							});
					});

				})
			})

		})
		.put(function (req, res) {
			if (req.body.eliminar == undefined) {
				var imagen;
				if (req.body.persona.imagen.indexOf('default') > -1) {
					imagen = req.body.persona.imagen;
				} else {
					var imagenPersona = decodeBase64Image(req.body.persona.imagen);
					fs.writeFileSync('./img/persona' + req.body.persona.id + '.jpg', imagenPersona.data, 'base64', function (err) { });
					imagen = './img/persona' + req.body.persona.id + '.jpg';
				}
				Persona.update({
					nombres: req.body.persona.nombres,
					apellido_paterno: req.body.persona.apellido_paterno,
					apellido_materno: req.body.persona.apellido_materno,
					ci: req.body.persona.ci,
					id_genero: req.body.persona.id_genero,
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
							extension: req.body.extension,
							grupo_sanguineo: req.body.grupo_sanguineo,
							cargo: req.body.cargo,
							campo: req.body.campo,
							designacion_empresa: req.body.designacion_empresa,
							eliminado: req.body.eliminado,
						}, {
								where: { id: req.params.id_paciente }

							}).then(function (medicoPacienteActualizado) {
								res.json({ mensaje: "Actualizado Satisfactoriamente" });
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
				include: [{ model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }
					// { model: Empresa, as: 'empresa'},{model:MedicoPrerequisito, as: 'prerequisitos',include: [{ model: Clase, as: 'prerequisitoClase' }]}
				]
			}).then(function (medicoPaciente) {
				res.json(medicoPaciente);
			});
		});

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
							where: { id_paciente: pacienteEncontrado.id },
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
										})
								})
							}
						})
					})
				})
				if (index === (array.length - 1)) {
					res.json({ mensaje: "¡Datos de fichas técnicas actualizados satisfactoriamente!" });
				}
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
					res.json({ hasError: true, mensaje: 'Se produjo un error! intente realizar la operación nuevamente.\n' });
				});
			});
			// res.json({ mensaje: 'Aplicando Vacunas... Por favor espere.' })
		})

	router.route('/pacientes/empresa/excel/upload')
		.post(function (req, res) {
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
									MedicoPaciente.update({
										id_persona: personaActualizada.id,
										id_empresa: req.body.id_empresa,
										codigo: pacienteActual.codigo,
										extension: pacienteActual.extension,
										grupo_sanguineo: pacienteActual.grupo_sanguineo,
										cargo: pacienteActual.cargo,
										campo: pacienteActual.campamento,
										designacion_empresa: pacienteActual.designacion_empresa,
										eliminado: pacienteActual.eliminado,
										es_empleado:pacienteActual.es_empleado									}, {
											where: { id: pacienteFound.id }

										}).then(function (medicoPacienteActualizado) {
											// res.json({ mensaje: "Actualizado Satisfactoriamente" });
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
										MedicoPaciente.create({
											id_persona: personaCreada.id,
											id_empresa: req.body.id_empresa,
											codigo: pacienteActual.codigo,
											extension: pacienteActual.extension,
											grupo_sanguineo: pacienteActual.grupo_sanguineo,
											cargo: pacienteActual.cargo,
											campo: pacienteActual.campamento,
											designacion_empresa: pacienteActual.designacion_empresa,
											eliminado: false,										
											es_empleado:pacienteActual.es_empleado	
											//comentario: pacienteActual.comentario
										}).then(function (medicoPacienteActualizado) {

										})
									})

							})
						}
					})
				})
				if (index === (array.length - 1)) {
					res.json({ mensaje: "¡Datos de pacientes actualizados satisfactoriamente!" });
				}
			});
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
					})
				})
				if (index === (array.length - 1)) {
					res.json({ mensaje: "¡Datos de SOAP pacientes actualizados satisfactoriamente!" });
				};
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
					})
				})
				if (index === (array.length - 1)) {
					res.json({ mensaje: "¡Datos de consultas actualizados satisfactoriamente!" });
				};
			}, this);
		})

	router.route('/pacientes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado')
		.get(function (req, res) {
			var condicion = ""
			var es_eliminado = "false"
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
					es_eliminado = "true"
				} else {
					es_eliminado = "false"
				}
			}
			if (req.params.texto_busqueda != 0) {
				if (condicion.length > 1) {
					condicion += " or designacion_empresa like '%" + req.params.texto_busqueda + "%' or grupo_sanguineo like '%" + req.params.texto_busqueda + "%' or campo like '%" + req.params.texto_busqueda + "%' or cargo like '%" + req.params.texto_busqueda + "%'"
				} else {
					condicion += "nombre_completo like '%" + req.params.texto_busqueda + "%' or codigo like '%" + req.params.texto_busqueda + "%' or ci like '%" + req.params.texto_busqueda + "%' or designacion_empresa like '%" + req.params.texto_busqueda + "%' or grupo_sanguineo like '%" + req.params.texto_busqueda + "%' or campo like '%" + req.params.texto_busqueda + "%' or cargo like '%" + req.params.texto_busqueda + "%'"
				}
			}
			console.log(condicion)

			if (condicion.length > 1) {
				sequelize.query("select count(*) as cantidad_pacientes from agil_medico_paciente INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) where eliminado = " + es_eliminado + " AND (" + condicion + ")", { type: sequelize.QueryTypes.SELECT })
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
						gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', gl_persona.activo as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
						gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
						from agil_medico_paciente INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id)\
						where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + es_eliminado + " AND (" + condicion + ") \
						GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion + " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina, options)
							.then(function (pacientes) {
								res.json({ pacientes: pacientes, paginas: Math.ceil(data[0].cantidad_pacientes / req.params.items_pagina) });
							});
					});
			} else {
				sequelize.query("select count(*) as cantidad_pacientes from agil_medico_paciente where eliminado = " + es_eliminado, { type: sequelize.QueryTypes.SELECT })
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
						gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', gl_persona.activo as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
						gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
						from agil_medico_paciente INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id)\
						where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + es_eliminado + " GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina, options)
							.then(function (pacientes) {
								res.json({ pacientes: pacientes, paginas: Math.ceil(data[0].cantidad_pacientes / req.params.items_pagina) });
							});
					});
			}
		});

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
								eliminado: dosis.eliminado
							}, {
									where: { id: dosis.id, id_vacuna: dosis.id_vacuna }
								}).then(function (dosis_Creada) {
									if(index === array.length-1){
										res.json({mensaje: memo})
									}
								})
						} else  if(dosis.id == undefined && dosis.eliminar == undefined){
							VacunaDosis.create({
								es_dosis: dosis.es_dosis,
								tiempo: dosis.tiempo,
								numero: dosis.numero,
								id_vacuna: req.body.id,
								eliminado: false
							}).then(function (dosis_Creada) {
								if(index === array.length-1){
									res.json({mensaje: memo})
								}
							})
						} else if(dosis.eliminar == true){
							var lmax = 0
							MedicoPacienteVacuna.findAndCountAll({
								where: { id_vacuna: req.body.id },
								include: [{ model: MedicoVacuna, as: 'pacienteVacuna', include: [{ model: VacunaDosis, as: 'vacunaDosis', where: { eliminado: false }, order: [['numero', 'desc']] }] }, { model: MedicoPacienteVacunaDosis, as: 'pacienteVacunaDosis', order: [['createdAt', 'desc']] }]
							}).then(function (vacunasPaciente) {
								if(vacunasPaciente.count > 0) {
									var a = vacunasPaciente.rows
									a.forEach(function(vacun, indexb, arrayb) {
										
										MedicoPacienteVacunaDosis.findAndCountAll({
											where: {
												id_paciente_vacuna : vacun.dataValues.id
											}
										}).then(function (dosisCount) {
											console.log(dosisCount)
											lmax = (lmax  <= dosisCount.count) ? dosisCount.count : lmax
											if (indexb == arrayb.length-1){
												if(lmax < dosis.numero){
													VacunaDosis.update({
														es_dosis: dosis.es_dosis,
														tiempo: dosis.tiempo,
														numero: dosis.numero,
														id_vacuna: dosis.id_vacuna,
														eliminado: true
													}, {
															where: { id: dosis.id, id_vacuna: dosis.id_vacuna }
														}).then(function (dosis_Creada) {
															if(index === array.length-1){
																res.json({mensaje: memo})
															}
														})	
												}else{
													memo += "\n La dosis N° " + dosis.numero + " No se puede eliminar."
													if(index === array.length-1){
														res.json({mensaje: memo})
													}
												}
											}
										})
									});
								}else{
									VacunaDosis.update({
										es_dosis: dosis.es_dosis,
										tiempo: dosis.tiempo,
										numero: dosis.numero,
										id_vacuna: dosis.id_vacuna,
										eliminado: dosis.eliminado
									}, {
											where: { id: dosis.id, id_vacuna: dosis.id_vacuna }
										}).then(function (dosis_Creada) {
											if(index === array.length-1){
												res.json({mensaje: memo})
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
						eliminado: false
					}).then(function (dosis_Creada) {

					})
				}, this);
			}).then(function () {
				res.json({mensaje:'Vacuna creada'});
			})
		})
		.get(function (req, res) {
			MedicoVacuna.findAll({
				// where: {eliminado: false},
				include: [{ model: VacunaDosis, as: 'vacunaDosis', where: { eliminado: false }, order: [['numero', 'desc']] }] //where:{eliminado: false}
			}).then(function (vacunas) {
				res.json(vacunas);
			});
		});

	router.route('/paciente/aplicacion/vacuna/:id')
		.put(function (req, res) {
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
					MedicoPacienteVacunaDosis.create({
						id_paciente_vacuna: req.params.id,
						fecha_aplicacion: req.body.fecha_ultima_aplicacion,
						eliminado: false
					}).then({

					})
					res.json('Vacuna aplicada.')
				})
		})

		.get(function (req, res) {
			MedicoPacienteVacuna.findAll({
				where: {
					id: req.params.id
				},
				include: [{ model: MedicoPacienteVacunaDosis, as: 'pacienteVacunaDosis' }]
			}).then(function (vacuna) {
				res.json(vacuna)
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
				where: { id_paciente: req.params.id_paciente, eliminado: false },
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

	router.route('/prerequisitos')
		.get(function (req, res) {
			Clase.findAll({
				include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: Diccionario.PRE_REQUSITO } }]
			}).then(function (prerequisitos) {
				res.json(prerequisitos);
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

	// .get(function (req, res) {
	// 	Clase.findAll({
	// 		include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: Diccionario.GENERO } }]
	// 	}).then(function (generos) {
	// 		res.json(generos);
	// 	});
	// });

	router.route('/prerequisito/paciente/:id_paciente')
		.post(function (req, res) {
			Clase.find({

				where: { nombre_corto: Diccionario.PRE_REQUSITO }
			}).then(function (prerequisito) {
				MedicoPrerequisito.find({
					where: {
						id_paciente: req.params.id_paciente,
						$or: [{ id_prerequisito: req.body.id_prerequisito }]
					},
				}).then(function (prerequisitoEncontrado) {
					if (prerequisitoEncontrado) {
						MedicoPrerequisito.update({
							vencimiento_mes: req.body.vencimiento_mes,
							fecha_inicio: req.body.fecha_inicio,
							fecha_vencimiento: req.body.fecha_vencimiento,
							observacion: req.body.observacion,
							puede_modificar_rrhh: req.body.puede_modificar_rrhh
						}, {
								where: {
									id: prerequisitoEncontrado.id
								}
							}).then(function (prerequisitoCreado) {

								res.json({ mensaje: "¡Datos de Pre-requisito actualizados satisfactoriamente!" });

							});
					} else {
						MedicoPrerequisito.create({
							id_paciente: req.params.id_paciente,
							id_prerequisito: req.body.id_prerequisito,
							vencimiento_mes: req.body.vencimiento_mes,
							fecha_inicio: req.body.fecha_inicio,
							fecha_vencimiento: req.body.fecha_vencimiento,
							observacion: req.body.observacion,
							puede_modificar_rrhh: req.body.puede_modificar_rrhh

						}).then(function (prerequisitoCreado) {

							res.json({ mensaje: "Pre-requisitos creados satisfactoriamente!" });

						});
					}
				})

			})

		})
		.put(function (req, res) {
			if (req.body instanceof Array) {
				req.body.forEach(function (prerequisito, index, array) {
					MedicoPrerequisito.update({
						entregado: prerequisito.entregado,
						puede_modificar_rrhh: prerequisito.puede_modificar_rrhh
					}, {
							where: {
								id: prerequisito.id
							},
						}).then(function (prerequisitos) {
							if (index === (array.length - 1)) {
								res.json({ message: "pre requisito actualizado satisfactoriamente!" });
							}
						});
				}, this);

			} else {
				MedicoPrerequisito.update({
					entregado: req.body.entregado,
					puede_modificar_rrhh: req.body.puede_modificar_rrhh
				}, {
						where: {
							id: req.body.id
						},
					}).then(function (prerequisitos) {
						res.json({ message: "pre requisito actualizado satisfactoriamente!" });
					});
			}
		});
	router.route('/medico-paciente-pre-requisito/paciente/:id_paciente/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			var condicionPreRequisito = { id_paciente: req.params.id_paciente }
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);

				condicionPreRequisito = {
					$or: [
						{
							fecha_vencimiento: {
								$between: [inicio, fin]
							}
						}
					]
				};

			}
			MedicoPrerequisito.findAll({
				where: condicionPreRequisito,
				include: [{ model: Clase, as: 'prerequisitoClase' }, { model: MedicoPaciente, as: 'prerequisitoPaciente', include: [{ model: Persona, as: 'persona' }] }
				]
			}).then(function (prerequisitos) {
				res.json(prerequisitos);
			});
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
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);

				var condicionPaciente = {
					id_paciente: req.params.id_paciente,
					$or: [
						{
							fecha: {
								$between: [inicio, fin]
							}
						}
					]
				};
			} else {
				var condicionPaciente = {
					id_paciente: req.params.id_paciente,
				}
			}
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

			MedicoPrerequisito.findAll({
				where: condicionPreRequisito,
				include: [{ model: Clase, as: 'prerequisitoClase' }, { model: MedicoPaciente, as: 'prerequisitoPaciente', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }
				]
			}).then(function (prerequisitos) {
				res.json(prerequisitos);
			});
		})
	router.route('/medico-paciente-vacunas/empresa/:id_empresa/inicio/:inicio/fin/:fin')
		.get(function (req, res) {
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				var condicionPreRequisito = {
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
				where: condicionPreRequisito,
				include: [{ model: MedicoPaciente, as: 'paciente', include: [{ model: Persona, as: 'persona' }] }, { model: MedicoVacuna, as: 'pacienteVacuna' }]
			}).then(function (prerequisitos) {
				res.json(prerequisitos);
			});
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
					model: MedicoPaciente, as: 'paciente', include: [{ model: Empresa, as: 'empresa' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }]
				}, { model: Persona, as: 'personaReferencia' }],
				order: [['createdAt', 'DESC']]
			}).then(function (fichaEncontrada) {
				var ficha = fichaEncontrada[0]
				if (ficha) {
					res.json({ ficha: ficha })
				} else {
					MedicoPaciente.find({
						where: { id: req.params.id_paciente },
						include: [
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
								extension: req.body.paciente.extension,
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
									extension: req.body.paciente.extension,
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
			MedicoLaboratorio.create({
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				id_empresa: req.params.id_empresa
			}).then(function (MedicoLaboratorioCreado) {
				res.json({ message: "laboratorio creado satisfactoriamente" })
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
			MedicoLaboratorioExamen.create({
				nombre: req.body.nombre,
				examen: req.body.examen,
				unidad: req.body.unidad,
				observacion: req.body.observacion,
				id_laboratorio: req.params.id_laboratorio
			}).then(function (MedicoLaboratorioCreado) {
				res.json({ message: "laboratorio examen creado satisfactoriamente" })
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
			var condicionLaboratorioPaciente = { id_laboratorio: req.params.id_laboratorio, id_paciente: req.params.id_paciente }
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				condicionLaboratorioPaciente = {
					id_laboratorio: req.params.id_laboratorio, id_paciente: req.params.id_paciente,
					$or: [
						{
							fecha: {
								$between: [inicio, fin]
							}
						}
					]
				};
			}
			MedicoLaboratorioPaciente.findAll({
				where: condicionLaboratorioPaciente,
				include: [{ model: MedicoLaboratorio, as: 'laboratorio' }]
			}).then(function (MedicoLaboratorioExamenesEncontrado) {
				res.json(MedicoLaboratorioExamenesEncontrado)
			})
		})

	//rutas laboratorio fin

	//rutas Diagnostico inicio

	router.route('/nuevo-diagnostico/empresa/:id_empresa')
		.post(function (req, res) {
			MedicoDiagnostico.create({
				nombre: req.body.nombre,
				descripcion: req.body.descripcion,
				id_empresa: req.params.id_empresa
			}).then(function (MedicoLaboratorioCreado) {
				res.json({ message: "diagnostico creado satisfactoriamente" })
			})
		})
		.get(function (req, res) {
			MedicoDiagnostico.findAll({
				where: { id_empresa: req.params.id_empresa }
			}).then(function (MedicosDiagnosticosEncontrados) {
				res.json(MedicosDiagnosticosEncontrados)
			})
		})

	router.route('/nuevo-diagnostico-examen/diagnostico/:id_diagnostico')
		.post(function (req, res) {
			MedicoDiagnosticoExamen.create({
				nombre: req.body.nombre,
				examen: req.body.examen,
				unidad: req.body.unidad,
				observacion: req.body.observacion,
				id_diagnostico: req.params.id_diagnostico
			}).then(function (MedicodiagnosticoCreado) {
				res.json({ message: "diagnostico examen creado satisfactoriamente!" })
			})
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
			var condicionDiagnosticoPaciente = { id_diagnostico: req.params.id_diagnostico, id_paciente: req.params.id_paciente }
			if (req.params.inicio != 0) {
				var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
				var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
				condicionDiagnosticoPaciente = {
					id_diagnostico: req.params.id_diagnostico, id_paciente: req.params.id_paciente,
					$or: [
						{
							fecha: {
								$between: [inicio, fin]
							}
						}
					]
				};
			}
			MedicoDiagnosticoPaciente.findAll({
				where: condicionDiagnosticoPaciente,
				include: [{ model: MedicoDiagnostico, as: 'diagnostico' }]
			}).then(function (MedicoDiagnosticoExamenesEncontrado) {
				res.json(MedicoDiagnosticoExamenesEncontrado)
			})
		})
	//rutas Diagnostico fin
}