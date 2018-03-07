module.exports = function (router, sequelize, Sequelize, Usuario, MedicoPaciente, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, decodeBase64Image, fs, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad
    , RrhhEmpleadoCargo, RrhhEmpleadoHojaVida, RrhhEmpleadoFormacionAcademica, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna, NumeroLiteral, RrhhEmpleadoPrestamo, RrhhEmpleadoPrestamoPago, RrhhEmpleadoRolTurno, RrhhEmpleadoHorasExtra, RrhhAnticipo,
    EvaluacionPolifuncional, ConfiguracionCalificacionEvaluacionPolifuncional, ConfiguracionDesempenioEvaluacionPolifuncional, RrhhEmpleadoAusencia, RrhhEmpleadoVacaciones, RrhhEmpleadoCompensacionAusencia, RrhhFeriado, RrhhClaseAsuencia, RrhhEmpleadoConfiguracionVacacion, RrhhEmpleadoHistorialVacacion) {

    router.route('/recursos-humanos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado/apellido/:apellido')
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
                condicionContrato = "INNER JOIN agil_rrhh_empleado_ficha as ficha on agil_medico_paciente.id = ficha.id_empleado AND ficha.tipo_contrato = " + req.params.grupo_sanguineo
            } else {
                condicionContrato = ""
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
            if (condicion.length > 1) {
                sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa', agil_medico_paciente.comentario as 'comentario', \
                gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                from agil_medico_paciente "+ condicionContrato + " INNER JOIN agil_rrhh_empleado_cargo AS cargos ON agil_medico_paciente.id = cargos.empleado " + condicionCargo + " \
                LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) INNER JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND (" + condicion + ") \
                AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion, { type: sequelize.QueryTypes.SELECT })
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
                    from agil_medico_paciente "+ condicionContrato + " INNER JOIN agil_rrhh_empleado_cargo AS cargos ON agil_medico_paciente.id = cargos.empleado " + condicionCargo + " \
                    LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) INNER JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                    where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND (" + condicion + ") \
                    AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion + limite, options)
                            .then(function (pacientes) {
                                var a = ""
                                var arregloCargos = []
                                if (pacientes.length > 0) {

                                    pacientes.forEach(function (paciente, index, array) {
                                        RrhhEmpleadoCargo.findAll({
                                            where: {
                                                id_empleado: paciente.id
                                            },
                                            include: [{ model: Clase, as: 'cargo' }]
                                        }).then(function (cargosEmpleado) {
                                            RrhhEmpleadoFicha.findAll({
                                                limit: 1,
                                                where: {
                                                    id_empleado: paciente.id
                                                },
                                                include: [{ model: Clase, as: 'tipoContrato' }],
                                                order: [['id', 'DESC']]
                                            }).then(function (fichaActual) {
                                                paciente.dataValues.cargos = cargosEmpleado
                                                paciente.dataValues.ficha = fichaActual[0]
                                                arregloCargos.push(paciente)
                                                if (index === (array.length - 1)) {
                                                    res.json({ pacientes: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
                                                }
                                            })

                                        })
                                    });
                                } else {
                                    res.json({ pacientes: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
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
                from agil_medico_paciente "+ condicionContrato + " INNER JOIN agil_rrhh_empleado_cargo AS cargos ON agil_medico_paciente.id = cargos.empleado " + condicionCargo + " \
                LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) INNER JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion, { type: sequelize.QueryTypes.SELECT })
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
                    from agil_medico_paciente "+ condicionContrato + " INNER JOIN agil_rrhh_empleado_cargo AS cargos ON agil_medico_paciente.id = cargos.empleado " + condicionCargo + " \
                    LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) INNER JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                    where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + limite, options)
                            .then(function (pacientes) {
                                var a = ""
                                var arregloCargos = []
                                if (pacientes.length > 0) {
                                    pacientes.forEach(function (paciente, index, array) {
                                        RrhhEmpleadoCargo.findAll({
                                            where: {
                                                id_empleado: paciente.id
                                            },
                                            include: [{ model: Clase, as: 'cargo' }]
                                        }).then(function (cargosEmpleado) {
                                            RrhhEmpleadoFicha.findAll({
                                                limit: 1,
                                                where: {
                                                    id_empleado: paciente.id
                                                },
                                                include: [{ model: Clase, as: 'tipoContrato' }],
                                                order: [['id', 'DESC']],
                                            }).then(function (fichaActual) {
                                                paciente.dataValues.cargos = cargosEmpleado
                                                paciente.dataValues.ficha = fichaActual[0]
                                                arregloCargos.push(paciente)
                                                if (index === (array.length - 1)) {
                                                    res.json({ pacientes: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
                                                }
                                            })

                                        })
                                    });
                                } else {
                                    res.json({ pacientes: arregloCargos, paginas: Math.ceil(data.length / req.params.items_pagina) });
                                }
                            });
                    });
            }
        })

    router.route('/recursos-humanos-familiar/:id_persona/familiar-relacion/:id_familiar')
        .put(function (req, res) {

            RrhhEmpleadoFichaFamiliar.destroy({
                where: {
                    id: req.params.id_familiar
                },
            }).then(function (RelacionEliminado) {
                Persona.destroy({
                    where: {
                        id: req.params.id_persona
                    },
                }).then(function (FamiliarEliminado) {
                    res.json({ mensaje: "Familiar eliminado satisfactoriamente!" });
                });
            });
        })
    /*    router.route('/recursos-humanos-seguro/:id_seguro')
           .put(function (req, res) {
               RrhhEmpleadoFichaOtrosSeguros.destroy({
                   where: {
                       id: req.params.id_seguro
                   },
               }).then(function (SeguroEliminado) {
                   res.json({ mensaje: "Seguro eliminado satisfactoriamente!" });
               });
           }) */
    router.route('/recursos-humanos/:id_usuario')
        .get(function (req, res) {
            MedicoPaciente.find({
                where: {
                    id: req.params.id_usuario
                },
                include: [{ model: RrhhEmpleadoFicha, as: 'empleadosFichas', limit: 1, order: [['id', 'DESC']] }, { model: Clase, as: 'extension' }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }
                    // { model: Empresa, as: 'empresa'},{model:MedicoPrerequisito, as: 'prerequisitos',include: [{ model: Clase, as: 'prerequisitoClase' }]}
                ]
            }).then(function (medicoPaciente) {
                if (medicoPaciente.empleadosFichas != undefined) {
                    if (medicoPaciente.empleadosFichas.length > 0) {
                        Clase.find({
                            where: {
                                id: medicoPaciente.empleadosFichas[0].id_tipo_contrato
                            }
                        }).then(function (clase) {
                            res.json({ medicoPaciente: medicoPaciente, clase: clase })
                        })
                    } else {
                        res.json({ medicoPaciente: medicoPaciente })
                    }
                } else {
                    res.json({ medicoPaciente: medicoPaciente })
                }
            })
        })
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
                            fs.writeFileSync('./img/persona' + personaCreada.id + '.jpg', imagenPersona.data, 'base64', function (err) { });
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
                                    // cargo: req.body.cargo,
                                    campo: req.body.campo,
                                    designacion_empresa: req.body.designacion_empresa,
                                    eliminado: true,
                                    es_empleado: req.body.es_empleado
                                }).then(function (medicoPacienteCreado) {
                                    RrhhEmpleadoFicha.create({
                                        fecha: req.body.fechaFicha,
                                        id_empleado: medicoPacienteCreado.id,
                                        id_tipo_contrato: req.body.tipo_contrato.id,
                                    }).then(function (Creado) {
                                        if (req.body.cargos) {
                                            req.body.cargos.forEach(function (cargo, index, array) {
                                                RrhhEmpleadoCargo.create({
                                                    id_empleado: medicoPacienteCreado.id,
                                                    id_cargo: cargo.id
                                                }).then(function (cargoCreado) {
                                                    if (index === (array.length - 1)) {
                                                        res.json({ message: 'creado Satisfactoriamente' });
                                                    }
                                                })
                                            });
                                        } else {
                                            res.json({ message: 'creado Satisfactoriamente' });
                                        }
                                    })

                                });
                            });
                    });

                })
            })

        })
        .put(function (req, res) {
            if (req.body.eliminar == undefined) {

                Persona.update({
                    nombres: req.body.persona.nombres,
                    apellido_paterno: req.body.persona.apellido_paterno,
                    apellido_materno: req.body.persona.apellido_materno,
                    ci: req.body.persona.ci,
                    id_genero: req.body.persona.genero.id,
                    nombre_completo: req.body.persona.nombres + ' ' + req.body.persona.apellido_paterno + ' ' + req.body.persona.apellido_materno,
                    telefono: req.body.persona.telefono,
                    telefono_movil: req.body.persona.telefono_movil,
                    fecha_nacimiento: req.body.persona.fecha_nacimiento_update,
                }, {
                        where: {
                            id: req.body.id_persona
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
                                    campo: req.body.campo,
                                    designacion_empresa: req.body.designacion_empresa,
                                    eliminado: req.body.eliminado,
                                    es_empleado: req.body.es_empleado
                                }, {
                                        where: { id: req.body.id }

                                    }).then(function (medicoPacienteActualizado) {
                                        RrhhEmpleadoCargo.destroy({
                                            where: {
                                                id_empleado: req.body.id,
                                            }
                                        }).then(function (EmpleadoCargosActualizada) {
                                            RrhhEmpleadoFicha.create({
                                                fecha: req.body.fechaFicha,
                                                id_empleado: req.body.id,
                                                id_tipo_contrato: req.body.tipo_contrato.id,
                                            }).then(function (Creado) {
                                                if (req.body.cargos.length > 0) {
                                                    req.body.cargos.forEach(function (cargo, index, array) {
                                                        RrhhEmpleadoCargo.findOrCreate({
                                                            where: { id_empleado: req.body.id, id_cargo: cargo.id },
                                                            defaults: {
                                                                id_empleado: req.body.id,
                                                                id_cargo: cargo.id
                                                            }
                                                        }).spread(function (ficha, created) {
                                                            if (!created) {
                                                                RrhhEmpleadoCargo.update({
                                                                    id_empleado: req.body.id,
                                                                    id_cargo: cargo.id
                                                                }, {
                                                                        where: { id_empleado: req.body.id, id_cargo: cargo.id }
                                                                    }).then(function (actualizado) {
                                                                        if (index === (array.length - 1)) {
                                                                            res.json({ message: 'creado Satisfactoriamente' });
                                                                        } s
                                                                    })

                                                            } else {
                                                                if (index === (array.length - 1)) {
                                                                    res.json({ message: 'creado Satisfactoriamente' });
                                                                }
                                                            }
                                                        })
                                                    });
                                                } else {
                                                    res.json({ message: 'creado Satisfactoriamente' });
                                                }
                                            })


                                        });
                                    })
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
    router.route('/usuario-recurso-humano/:id_empleado')
        .put(function (req, res) {
            var activo
            if (req.body.eliminado) {
                activo = req.body.eliminado
            } else {
                activo = req.body.activo
            }
            MedicoPaciente.update({
                eliminado: activo
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (personaActualizada) {
                    /*  var mn = (req.body.activo == true) ? 'activo' : 'inactivo' */
                    res.json({ mensaje: "Usuario actualizado satisfactoriamente!" });
                })


        })//RrhhEmpleadoFichaOtrosSeguros,RrhhEmpleadoFichaFamiliar
    router.route('/usuario-recurso-humano-ficha/empleado/:id_empleado')
        .get(function (req, res) {
            RrhhEmpleadoFicha.findAll({
                limit: 1,
                where: {
                    id_empleado: req.params.id_empleado
                },
                include: [{ model: Clase, as: 'tipoContrato' },
                { model: Clase, as: 'tipoPersonal' },
                { model: Clase, as: 'cargaHorario' },
                { model: Clase, as: 'area' },
                { model: Clase, as: 'ubicacion' },
                { model: Clase, as: 'seguroSalud' },
                { model: Clase, as: 'lugarSeguroSalud' },
                { model: Clase, as: 'aporteSeguroLargoPlazo' },
                { model: Clase, as: 'lugarSeguroLargoPlazo' },
                { model: Clase, as: 'banco' },
                /* { model: RrhhEmpleadoFichaFamiliar, as: 'familiares' },
                { model: RrhhEmpleadoFichaOtrosSeguros, as: 'otrosSeguros' }, */
                {
                    model: MedicoPaciente, as: 'empleado',
                    include: [{ model: RrhhEmpleadoDiscapacidad, as: 'discapacidades', include: [{ model: Clase, as: "discapacidad" }] }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }, { model: RrhhEmpleadoFichaFamiliar, as: 'familiares', include: [{ model: Clase, as: 'relacion' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }] },
                    { model: RrhhEmpleadoFichaOtrosSeguros, as: 'otrosSeguros', include: [{ model: Clase, as: "tipoSeguro" }] }, { model: Clase, as: 'extension' }, { model: Clase, as: 'tipoDocumento' },
                    {
                        model: Persona, as: 'persona',
                        include: [{ model: Clase, as: 'genero' },
                        { model: Clase, as: 'pais' },
                        { model: Clase, as: 'ciudad' },
                        { model: Clase, as: 'provincia' },
                        { model: Clase, as: 'localidad' },
                        { model: Clase, as: 'estadoCivil' }]
                    }]
                }, { model: Persona, as: 'personaReferencia' }],
                order: [['id', 'DESC']]
            }).then(function (fichaEncontrada) {
                var ficha = fichaEncontrada[0]
                if (ficha) {
                    res.json({ ficha: ficha })
                } else {
                    MedicoPaciente.find({
                        where: { id: req.params.id_empleado },
                        include: [{ model: RrhhEmpleadoDiscapacidad, as: 'discapacidades', include: [{ model: Clase, as: "discapacidad" }] }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }, { model: RrhhEmpleadoFichaFamiliar, as: 'familiares', include: [{ model: Clase, as: 'relacion' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }] },
                        { model: RrhhEmpleadoFichaOtrosSeguros, as: 'otrosSeguros', include: [{ model: Clase, as: "tipoSeguro" }] }, { model: Clase, as: 'extension' }, { model: Clase, as: 'tipoDocumento' }, { model: Empresa, as: 'empresa' },
                        {
                            model: Persona, as: 'persona',
                            include: [{ model: Clase, as: 'genero' },
                            { model: Clase, as: 'pais' },
                            { model: Clase, as: 'ciudad' },
                            { model: Clase, as: 'provincia' },
                            { model: Clase, as: 'localidad' },
                            { model: Clase, as: 'estadoCivil' }]
                        }]
                    }).then(function (pacienteEncontrado) {
                        res.json({ empleado: pacienteEncontrado })
                    })
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
                    MedicoPaciente.update({
                        codigo: req.body.empleado.codigo,
                        id_extension: req.body.empleado.extension.id,
                        id_tipo_documento: req.body.empleado.tipoDocumento.id,
                        fecha_vence_documento: req.body.empleado.fecha_vence_documento,
                    }, {
                            where: {
                                id: req.body.empleado.id
                            }
                        }).then(function (medicoPacienteActualizado) {
                            guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad)
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                        });

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

                        MedicoPaciente.update({

                            id_extension: req.body.empleado.extension.id,
                            id_tipo_documento: req.body.empleado.tipoDocumento.id,
                            fecha_vence_documento: req.body.empleado.fecha_vence_documento,
                        }, {
                                where: {
                                    id: req.body.empleado.id
                                }
                            }).then(function (medicoPacienteActualizado) {
                                var personaReferencia = req.body.personaReferencia
                                guardarDatosFicha(req, res, personaReferencia, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad)
                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                            });
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });

            }
        })

    function guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad) {
        var provincia = (req.body.empleado.persona.provincia) ? req.body.empleado.persona.provincia.id : null
        var localidad = (req.body.empleado.persona.localidad) ? req.body.empleado.persona.localidad.id : null
        var ciudad = (req.body.empleado.persona.ciudad) ? req.body.empleado.persona.ciudad.id : null
        Persona.update({
            nombres: req.body.empleado.persona.nombres,
            apellido_paterno: req.body.empleado.persona.apellido_paterno,
            apellido_materno: req.body.empleado.persona.apellido_materno,
            ci: req.body.empleado.persona.ci,
            id_genero: req.body.empleado.persona.genero.id,
            nombre_completo: req.body.empleado.persona.nombres + ' ' + req.body.empleado.persona.apellido_paterno + ' ' + req.body.empleado.persona.apellido_materno,
            telefono: req.body.empleado.persona.telefono,
            telefono_movil: req.body.empleado.persona.telefono_movil,
            correo_electronico: req.body.empleado.persona.correo_electronico,
            id_estado_civil: req.body.empleado.persona.estadoCivil.id,
            direccion_zona: req.body.empleado.persona.direccion_zona,
            direccion_numero: req.body.empleado.persona.direccion_numero,
            id_pais_nacimiento: req.body.empleado.persona.pais.id,
            id_ciudad_nacimiento: ciudad,
            id_provincia_nacimiento: provincia,
            id_localidad_nacimiento: localidad,
            apellido_casada: req.body.empleado.persona.apellido_casada,
            segundo_nombre: req.body.empleado.persona.segundo_nombre,
            fecha_nacimiento: req.body.empleado.persona.fecha_nacimiento
        }, {
                where: {
                    id: req.body.empleado.persona.id
                }
            }).then(function (EmpleadoPersonaActualizado) {
                var haber = parseFloat(req.body.haber_basico)
                var numero_literal = NumeroLiteral.Convertir(parseFloat(req.body.haber_basico).toFixed(2).toString());
                RrhhEmpleadoFicha.create({
                    discapacidad: req.body.discapacidad,
                    detalle_discapacidades: req.body.detalle_discapacidades,
                    id_empleado: req.body.empleado.id,
                    fecha: req.body.fecha_elaboracion,
                    //codigo_empleado: req.body.codigo_empleado,
                    id_tipo_contrato: req.body.tipoContrato.id,
                    fecha_inicio: req.body.fecha_inicio2,
                    fecha_fin: req.body.fecha_fin2,
                    id_tipo_personal: req.body.tipoPersonal.id,
                    id_carga_horarios: req.body.cargaHorario.id,
                    id_area: req.body.area.id,
                    id_ubicacion: req.body.ubicacion.id,
                    haber_basico: haber,
                    haber_basico_literal: numero_literal,
                    //contrato: req.body.alergia_quimico,
                    jubilacion: req.body.jubilacion,
                    fecha_jubilacion: req.body.fecha_jubilacion,
                    id_persona_referencia: personaReferenciaCreada.id,
                    matricula_seguro: req.body.matricula_seguro,
                    id_seguro_salud: req.body.seguroSalud.id,
                    id_lugar_seguro_salud: req.body.lugarSeguroSalud.id,
                    seguro_salud_carnet: req.body.seguro_salud_carnet,
                    nua_seguro_largo_plazo: req.body.nua_seguro_largo_plazo,
                    id_aporte_seguro_largo_plazo: req.body.aporteSeguroLargoPlazo.id,
                    id_lugar_seguro_largo_plazo: req.body.lugarSeguroLargoPlazo.id,
                    numero_cuenta: req.body.numero_cuenta,
                    id_banco: req.body.banco.id,
                }).then(function (medicoPacientefichaCreado) {
                    if (req.body.contrato2) {
                        fs.writeFileSync('./contratos/contrato-' + medicoPacientefichaCreado.id + "-" + req.body.contrato2.name, req.body.contrato2.data, 'binary', function (err) {
                            if (err)
                                console.log(err);
                            else
                                console.log("The file was saved!");
                        });

                        RrhhEmpleadoFicha.update({
                            contrato: req.body.contrato2.name
                        }, {
                                where: { id: medicoPacientefichaCreado.id }
                            }).then(function (affecteedRows) {
                                guardarOtrosSeguros(req, res, Persona, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)
                            });
                    } else {
                        guardarOtrosSeguros(req, res, Persona, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)
                    }
                }).catch(function (err) {
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                });
            }).catch(function (err) {
                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
    }
    function guardarOtrosSeguros(req, res, Persona, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo) {
        if (req.body.empleado.otrosSeguros.length > 0) {
            req.body.empleado.otrosSeguros.forEach(function (seguroSalud, index, array) {
                if (seguroSalud.id) {
                    if (seguroSalud.eliminado != true) {
                        RrhhEmpleadoFichaOtrosSeguros.update({
                            id_empleado: req.body.empleado.id,
                            id_tipo_seguro: seguroSalud.tipoSeguro.id,
                            monto: seguroSalud.monto,
                            observacion: seguroSalud.observacion,
                        }, {
                                where: { id: seguroSalud.id }
                            }).then(function (seguroCreado) {
                                if (index === (array.length - 1)) {
                                    guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)

                                }
                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                            });
                    } else {
                        RrhhEmpleadoFichaOtrosSeguros.destroy({
                            where: {
                                id: seguroSalud.id
                            },
                        }).then(function (SeguroEliminado) {
                            if (index === (array.length - 1)) {
                                guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)

                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                        });
                    }
                } else {
                    RrhhEmpleadoFichaOtrosSeguros.create({
                        id_empleado: req.body.empleado.id,
                        id_tipo_seguro: seguroSalud.tipoSeguro.id,
                        monto: seguroSalud.monto,
                        observacion: seguroSalud.observacion,
                    }).then(function (seguroCreado) {
                        if (index === (array.length - 1)) {
                            guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)

                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });
                }
            })
        } else {
            guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)
        }
    }
    function guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo) {
        if (req.body.empleado.familiares.length > 0) {
            req.body.empleado.familiares.forEach(function (familiar, index, array) {
                if (familiar.id) {
                    if (familiar.eliminado != true) {
                        Persona.update({
                            nombres: familiar.persona.nombres,
                            apellido_paterno: familiar.persona.apellido_paterno,
                            apellido_materno: familiar.persona.apellido_materno,
                            fecha_nacimiento: familiar.persona.fecha_nacimiento,
                            id_genero: familiar.persona.genero.id,
                        }, {
                                where: {
                                    id: familiar.persona.id
                                }
                            }).then(function (personaActualizada) {

                                RrhhEmpleadoFichaFamiliar.update({
                                    id_empleado: req.body.empleado.id,
                                    id_persona_familiar: familiar.persona.id,
                                    id_relacion: familiar.relacion.id,
                                    afiliado: familiar.persona.afiliado,
                                }, {
                                        where: { id: familiar.id }
                                    }).then(function (empleadoFamiliarActulizado) {
                                        if (index === (array.length - 1)) {
                                            guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)

                                        }
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                    });

                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                            });
                    } else {
                        RrhhEmpleadoFichaFamiliar.destroy({
                            where: {
                                id: familiar.id
                            },
                        }).then(function (RelacionEliminado) {
                            Persona.destroy({
                                where: {
                                    id: familiar.persona.id
                                },
                            }).then(function (FamiliarEliminado) {
                                if (index === (array.length - 1)) {
                                    guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)

                                }
                            }).catch(function (err) {
                                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                            });
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                        });
                    }
                } else {
                    Persona.create({
                        nombres: familiar.persona.nombres,
                        apellido_paterno: familiar.persona.apellido_paterno,
                        apellido_materno: familiar.persona.apellido_materno,
                        fecha_nacimiento: familiar.persona.fecha_nacimiento,
                        id_genero: familiar.persona.genero.id,
                    }).then(function (personaCreada) {
                        RrhhEmpleadoFichaFamiliar.create({
                            id_empleado: req.body.empleado.id,
                            id_persona_familiar: personaCreada.id,
                            id_relacion: familiar.relacion.id,
                            afiliado: familiar.persona.afiliado,
                        }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                            if (index === (array.length - 1)) {
                                guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)
                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                        });

                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });
                }
            });
        } else {
            guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)
        }
    }
    function guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo) {
        RrhhEmpleadoCargo.destroy({
            where: {
                id_empleado: req.body.empleado.id
            }
        }).then(function (EmpleadoCargosActualizada) {
            if (req.body.empleado.cargo.length > 0) {

                req.body.empleado.cargo.forEach(function (cargo, index, array) {
                    RrhhEmpleadoCargo.findOrCreate({
                        where: { id_empleado: req.body.empleado.id, id_cargo: cargo.id },
                        defaults: {
                            id_empleado: req.body.empleado.id,
                            id_cargo: cargo.id
                        }
                    }).spread(function (ficha, created) {
                        if (!created) {
                            RrhhEmpleadoCargo.update({
                                id_empleado: req.body.empleado.id,
                                id_cargo: cargo.id
                            }, {
                                    where: { id_empleado: req.body.empleado.id, id_cargo: cargo.id }
                                }).then(function (actualizado) {
                                    if (index === (array.length - 1)) {
                                        guardarSeguros(RrhhEmpleadoDiscapacidad, req, req.body.empleado, res)
                                    }
                                }).catch(function (err) {
                                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                });

                        } else {
                            if (index === (array.length - 1)) {
                                guardarSeguros(RrhhEmpleadoDiscapacidad, req, req.body.empleado, res)
                            }
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });
                });
            } else {
                guardarSeguros(RrhhEmpleadoDiscapacidad, req, req.body.empleado, res)
            }
        })
    }
    function guardarSeguros(RrhhEmpleadoDiscapacidad, req, empleado, res) {
        discapacidades = req.body.empleado.discapacidades
        RrhhEmpleadoDiscapacidad.destroy({
            where: {
                id_empleado: empleado.id,
            }
        }).then(function (EmpleadoDiscapacidadesActualizada) {
            if (discapacidades.length > 0) {
                discapacidades.forEach(function (discapacidad, index, array) {
                    RrhhEmpleadoDiscapacidad.findOrCreate({
                        where: { id_empleado: empleado.id, id_discapacidad: discapacidad.id },
                        defaults: {
                            id_empleado: empleado.id,
                            id_discapacidad: discapacidad.id
                        }
                    }).spread(function (ficha, created) {
                        if (!created) {
                            RrhhEmpleadoDiscapacidad.update({
                                id_empleado: empleado.id,
                                id_discapacidad: discapacidad.id
                            }, {
                                    where: { id_empleado: empleado.id, id_discapacidad: discapacidad.id }
                                }).then(function (actualizado) {
                                    if (index === (array.length - 1)) {
                                        guardarHistorialVacacion(RrhhEmpleadoHistorialVacacion, req, res, empleado)
                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                    }
                                }).catch(function (err) {
                                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                });

                        } else {
                            if (index === (array.length - 1)) {
                                guardarHistorialVacacion(RrhhEmpleadoHistorialVacacion, req, res, empleado)

                            }
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });

                })
            } else {
                guardarHistorialVacacion(RrhhEmpleadoHistorialVacacion, req, res, empleado)

            }
        })
    }
    function guardarHistorialVacacion(RrhhEmpleadoHistorialVacacion, req, res, empleado) {
        if (req.body.historialVacacion) {
            RrhhEmpleadoHistorialVacacion.update({
                eliminado: true,
            }, {
                    where: { id_empleado: empleado.id }
                }).then(function (historialActualizado) {
                    RrhhEmpleadoHistorialVacacion.create({
                        aplicadas: req.body.historialVacacion.aplicadas,
                        tomadas: req.body.historialVacacion.tomadas,
                        anio: req.body.historialVacacion.anio,
                        gestion: req.body.historialVacacion.gestion,
                        id_empleado: empleado.id,
                        eliminado: false
                    }).then(function (historialCreado) {
                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                    })
                })
        } else {
            res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
        }
    }
    router.route('/usuario-ficha/:id_empleado')
        .get(function (req, res) {
            RrhhEmpleadoFicha.findAll({
                where: { id_empleado: req.params.id_empleado, contrato: { $ne: null } },

            }).then(function (empleado) {
                res.json(empleado)

            })
        })
    router.route('/usuario-hoja-vida/:id_empleado')
        .get(function (req, res) {
            RrhhEmpleadoHojaVida.find({
                where: { id_empleado: req.params.id_empleado },
                include: [{ model: RrhhEmpleadoCapacidadInternaExterna, as: 'capacidades', include: [{ model: Clase, as: 'tipoCapacidad' }] },
                { model: RrhhEmpleadoLogroInternoExterno, as: 'logros', include: [{ model: Clase, as: 'tipoLogro' }] },
                { model: RrhhEmpleadoExperienciaLaboral, as: 'experienciasLaborales' },
                {
                    model: RrhhEmpleadoFormacionAcademica, as: 'formacionesAcademicas',
                    include: [{ model: Clase, as: 'grado' }, { model: Clase, as: 'institucion' }, { model: Clase, as: 'titulo' }]
                }]
            }).then(function (HojaVida) {
                res.json({ hojaVida: HojaVida })
            })
        })
        .post(function (req, res) {
            if (req.body.id) {
                guardarRrhhHojaVidaFormacionAcademica(req, res, RrhhEmpleadoFormacionAcademica, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
            } else {
                RrhhEmpleadoHojaVida.create({
                    id_empleado: req.params.id_empleado
                }).then(function (hojaVidaCreado) {
                    guardarRrhhHojaVidaFormacionAcademica(req, res, RrhhEmpleadoFormacionAcademica, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna, hojaVidaCreado)
                })
            }
        })

    function guardarRrhhHojaVidaFormacionAcademica(req, res, RrhhEmpleadoFormacionAcademica, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna, hojaVidaCreado) {
        var idhojaVida = 0
        if (hojaVidaCreado) {
            idhojaVida = hojaVidaCreado.id
        } else {
            idhojaVida = req.body.id
        }
        if (req.body.formacionesAcademicas.length > 0) {
            req.body.formacionesAcademicas.forEach(function (formacionAcademica, index, array) {
                var idformacion = 0
                if (formacionAcademica.id) {
                    idformacion = formacionAcademica.id
                }
                if (!formacionAcademica.eliminado) {
                    RrhhEmpleadoFormacionAcademica.findOrCreate({
                        where: { id: idformacion },
                        defaults: {
                            id_hoja_vida: idhojaVida,
                            id_grado: formacionAcademica.grado.id,
                            id_titulo: formacionAcademica.titulo.id,
                            id_institucion: formacionAcademica.institucion.id,
                            descripcion: formacionAcademica.descripcion,
                            anio_obtencion: formacionAcademica.anio_obtencion
                        }
                    }).spread(function (formacion, created) {
                        if (!created) {
                            RrhhEmpleadoFormacionAcademica.update({
                                id_grado: formacionAcademica.grado.id,
                                id_titulo: formacionAcademica.titulo.id,
                                id_institucion: formacionAcademica.institucion.id,
                                descripcion: formacionAcademica.descripcion,
                                anio_obtencion: formacionAcademica.anio_obtencion
                            }, {
                                    where: { id: formacionAcademica.id }
                                }).then(function (actualizado) {
                                    if (index === (array.length - 1)) {
                                        guardarRrhhHojaVidaExperienciaLaboral(req, res, idhojaVida, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
                                    }
                                })
                        } else {
                            if (index === (array.length - 1)) {
                                guardarRrhhHojaVidaExperienciaLaboral(req, res, idhojaVida, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
                            }
                        }
                    })
                } else {
                    if (formacionAcademica.id) {
                        RrhhEmpleadoFormacionAcademica.destroy({
                            where: { id: formacionAcademica.id }
                        }).then(function (formacionEliminada) {
                            if (index === (array.length - 1)) {
                                guardarRrhhHojaVidaExperienciaLaboral(req, res, idhojaVida, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
                            }
                        })
                    } else {
                        if (index === (array.length - 1)) {
                            guardarRrhhHojaVidaExperienciaLaboral(req, res, idhojaVida, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
                        }
                    }
                }
            })
        } else {
            guardarRrhhHojaVidaExperienciaLaboral(req, res, idhojaVida, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
        }
    }
    function guardarRrhhHojaVidaExperienciaLaboral(req, res, idhojaVida, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna) {
        if (req.body.experienciasLaborales.length > 0) {
            req.body.experienciasLaborales.forEach(function (experienciaLaboral, index, array) {
                var idexperiencia = 0
                if (experienciaLaboral.id) {
                    idexperiencia = experienciaLaboral.id
                }
                if (!experienciaLaboral.eliminado) {
                    RrhhEmpleadoExperienciaLaboral.findOrCreate({
                        where: { id: idexperiencia },
                        defaults: {
                            id_hoja_vida: idhojaVida,
                            fecha_inicio: experienciaLaboral.fecha_inicio,
                            fecha_fin: experienciaLaboral.fecha_fin,
                            empresa: experienciaLaboral.empresa,
                            cargo: experienciaLaboral.cargo,
                            motivo_retiro: experienciaLaboral.motivo_retiro,
                            contacto: experienciaLaboral.contacto,
                            telefono: experienciaLaboral.telefono
                        }
                    }).spread(function (experiencia, created) {
                        if (!created) {
                            RrhhEmpleadoExperienciaLaboral.update({
                                fecha_inicio: experienciaLaboral.fecha_inicio,
                                fecha_fin: experienciaLaboral.fecha_fin,
                                empresa: experienciaLaboral.empresa,
                                cargo: experienciaLaboral.cargo,
                                motivo_retiro: experienciaLaboral.motivo_retiro,
                                contacto: experienciaLaboral.contacto,
                                telefono: experienciaLaboral.telefono
                            }, {
                                    where: { id: experienciaLaboral.id }
                                }).then(function (actualizado) {
                                    if (index === (array.length - 1)) {
                                        guardarRrhhHojaVidaCapacidades(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
                                    }
                                })
                        } else {
                            if (index === (array.length - 1)) {
                                guardarRrhhHojaVidaCapacidades(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
                            }
                        }
                    })
                } else {
                    if (experienciaLaboral.id) {
                        RrhhEmpleadoExperienciaLaboral.destroy({
                            where: { id: experienciaLaboral.id }
                        }).then(function (experienciaEliminada) {
                            if (index === (array.length - 1)) {
                                guardarRrhhHojaVidaCapacidades(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
                            }
                        })
                    } else {
                        if (index === (array.length - 1)) {
                            guardarRrhhHojaVidaCapacidades(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
                        }
                    }
                }
            })
        } else {
            guardarRrhhHojaVidaCapacidades(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna)
        }
    }
    function guardarRrhhHojaVidaCapacidades(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna) {
        if (req.body.capacidades.length > 0) {
            req.body.capacidades.forEach(function (capacidad, index, array) {
                var idcapacidad = 0
                if (capacidad.id) {
                    idcapacidad = capacidad.id
                }
                if (!capacidad.eliminado) {
                    RrhhEmpleadoCapacidadInternaExterna.findOrCreate({
                        where: { id: idcapacidad },
                        defaults: {
                            id_hoja_vida: idhojaVida,
                            id_tipo_capacidad: capacidad.tipoCapacidad.id,
                            curso: capacidad.curso,
                            institucion: capacidad.institucion,
                            certificado: capacidad.certificado,
                            fecha: capacidad.fecha,
                        }
                    }).spread(function (capacidadCreada, created) {
                        if (!created) {
                            RrhhEmpleadoCapacidadInternaExterna.update({
                                id_tipo_capacidad: capacidad.tipoCapacidad.id,
                                curso: capacidad.curso,
                                institucion: capacidad.institucion,
                                certificado: capacidad.certificado,
                                fecha: capacidad.fecha,
                            }, {
                                    where: { id: capacidad.id }
                                }).then(function (actualizado) {
                                    if (index === (array.length - 1)) {
                                        guardarRrhhHojaVidaLogros(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno)
                                    }
                                })
                        } else {
                            if (index === (array.length - 1)) {
                                guardarRrhhHojaVidaLogros(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno)
                            }
                        }
                    })
                } else {
                    if (capacidad.id) {
                        RrhhEmpleadoCapacidadInternaExterna.destroy({
                            where: { id: capacidad.id }
                        }).then(function (capacidadEliminada) {
                            if (index === (array.length - 1)) {
                                guardarRrhhHojaVidaLogros(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno)
                            }
                        })
                    } else {
                        if (index === (array.length - 1)) {
                            guardarRrhhHojaVidaLogros(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno)
                        }
                    }
                }
            })
        } else {
            guardarRrhhHojaVidaLogros(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno)
        }
    }

    function guardarRrhhHojaVidaLogros(req, res, idhojaVida, RrhhEmpleadoLogroInternoExterno) {
        if (req.body.logros.length > 0) {
            req.body.logros.forEach(function (logro, index, array) {
                var idlogro = 0
                if (logro.id) {
                    idlogro = logro.id
                }
                if (!logro.eliminado) {
                    RrhhEmpleadoLogroInternoExterno.findOrCreate({
                        where: { id: idlogro },
                        defaults: {
                            id_hoja_vida: idhojaVida,
                            id_tipo_logro: logro.tipoLogro.id,
                            motivo: logro.motivo,
                            institucion: logro.institucion,
                            observacion: logro.observacion,
                            fecha: logro.fecha,
                        }
                    }).spread(function (logroCreada, created) {
                        if (!created) {
                            RrhhEmpleadoLogroInternoExterno.update({
                                id_tipo_logro: logro.tipoLogro.id,
                                motivo: logro.motivo,
                                institucion: logro.institucion,
                                observacion: logro.observacion,
                                fecha: logro.fecha,
                            }, {
                                    where: { id: logro.id }
                                }).then(function (actualizado) {
                                    if (index === (array.length - 1)) {
                                        res.json({ mensaje: "Hoja de vida guardada satisfactoriamente!" })
                                    }
                                })
                        } else {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Hoja de vida guardada satisfactoriamente!" })
                            }
                        }
                    })
                } else {
                    if (logro.id) {
                        RrhhEmpleadoLogroInternoExterno.destroy({
                            where: { id: logro.id }
                        }).then(function (logroEliminada) {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Hoja de vida guardada satisfactoriamente!" })
                            }
                        })
                    } else {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: "Hoja de vida guardada satisfactoriamente!" })
                        }
                    }
                }
            })
        } else {
            res.json({ mensaje: "Hoja de vida guardada satisfactoriamente!" })
        }

    }
    router.route('/recursos-humanos/prestamo/empleado/:id_empleado')
        .post(function (req, res) {
            if (req.params.id_empleado == "0") {
                req.body.empleados.forEach(function (empleado, index, array) {
                    RrhhEmpleadoPrestamo.create({
                        id_empleado: empleado.id,
                        fecha_inicial: req.body.fecha_inicial,
                        monto: req.body.monto,
                        interes_pactado: req.body.interes_pactado,
                        plazo: req.body.plazo,
                        observacion: req.body.observacion,
                        id_usuario: req.body.id_usuario,
                        total: req.body.total,
                        cuota: req.body.cuota
                    }).then(function (empleadoPrestamoCreado) {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: "Prestamos guardados satisfactoriamente!" })
                        }
                    })
                });
            } else {
                RrhhEmpleadoPrestamo.create({
                    id_empleado: req.params.id_empleado,
                    fecha_inicial: req.body.fecha_inicial,
                    monto: req.body.monto,
                    interes_pactado: req.body.interes_pactado,
                    plazo: req.body.plazo,
                    observacion: req.body.observacion,
                    id_usuario: req.body.id_usuario,
                    total: req.body.total,
                    cuota: req.body.cuota,
                }).then(function (empleadoPrestamoCreado) {
                    res.json({ mensaje: "Guardado satisfactoriamente!" })

                })
            }
        })
    router.route('/recursos-humanos/prestamo/:id_prestamo')
        .put(function (req, res) {
            RrhhEmpleadoPrestamo.update({
                monto: req.body.monto,
                interes_pactado: req.body.interes_pactado,
                plazo: req.body.plazo,
                observacion: req.body.observacion,
                total: req.body.total,
                cuota: req.body.cuota
            }, {
                    where: { id: req.params.id_prestamo }
                }).then(function (empleadoPrestamoCreado) {
                    if (req.body.prestamoPagos.length > 0) {
                        req.body.prestamoPagos.forEach(function (pago, index, array) {
                            RrhhEmpleadoPrestamoPago.update({
                                saldo_anterior: pago.saldo_anterior
                            }, {
                                    where: { id: pago.id }
                                }).then(function (params) {
                                    res.json({ mensaje: "Actualizado satisfactoriamente!" })
                                })
                        });
                    } else {
                        res.json({ mensaje: "Actualizado satisfactoriamente!" })
                    }

                })
        })

    router.route('/recursos-humanos/prestamos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/plazo/:plazo/inicio/:inicio/fin/:fin/nombre/:nombre/cuenta-liquida/:cuentas_liquidas')
        .get(function (req, res) {

            var ordenArreglo = [], condicionPrestamo = {};
            var condicionPersona = {};
            ordenArreglo.push(req.params.columna);
            ordenArreglo.push(req.params.direccion);
            /*   if (req.params.texto_busqueda != 0 || req.params.plazo != 0 || req.params.inicio != 0 || req.params.fin != 0 || req.params.texto_busqueda != 0) { */
            if (req.params.texto_busqueda != 0) {
                condicionPrestamo = {
                    $or: [
                        {
                            monto:
                                parseFloat(req.params.texto_busqueda)

                        },
                        {
                            total:
                                parseFloat(req.params.texto_busqueda)

                        }
                    ]
                };
            }
            if (req.params.plazo != 0) {
                condicionPrestamo = {
                    $or: [
                        {
                            plazo: req.params.plazo
                        }
                    ]

                };
            }
            if (req.params.cuentas_liquidas != 0) {
                condicionPrestamo = {
                    $or: [
                        {
                            cuota: { $eq: 0.00 }
                        }
                    ]
                };
            } else {
                condicionPrestamo = {
                    $or: [
                        {
                            cuota: { $ne: 0.00 }
                        }
                    ]
                };
            }
            if (req.params.inicio != 0 && req.params.fin != 0) {
                var fechaInicial = req.params.inicio == 0 ? new Date(2016, 0, 1, 0, 0, 0) : new Date(req.params.inicio);
                var fechaFinal = req.params.fin == 0 ? new Date() : new Date(req.params.fin);
                condicionPrestamo = {
                    $or: [
                        {
                            fecha_inicial: { $between: [fechaInicial, fechaFinal] }
                        }
                    ]
                };
            }
            if (req.params.nombre != 0) {
                condicionPersona = {
                    $or: [
                        {
                            nombres: {
                                $like: "%" + req.params.nombre + "%"
                            }
                        }
                    ]
                };
            }
            RrhhEmpleadoPrestamo.findAndCountAll({
                where: condicionPrestamo,
                include: [{ model: RrhhEmpleadoPrestamoPago, as: "prestamoPagos" }, { model: MedicoPaciente, as: "empleado", where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: "persona", where: condicionPersona }] }],
                order: [ordenArreglo]
            }).then(function (data) {
                RrhhEmpleadoPrestamo.findAll({
                    where: condicionPrestamo,
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    include: [{ model: RrhhEmpleadoPrestamoPago, as: "prestamoPagos" }, { model: MedicoPaciente, as: "empleado", where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: "persona", where: condicionPersona }] }],
                    order: [ordenArreglo]
                }).then(function (prestamos) {
                    res.json({ prestamos: prestamos, paginas: Math.ceil(data.count / req.params.items_pagina) });
                });
            })

        })

    router.route('/recursos-humanos/pago-prestamo/:id_prestamo/usuario/:id_usuario')
        .post(function (req, res) {
            var monto_pagado = 0
            var saldo_anterior = 0
            var a_cuenta_anterior = 0
            var prestamoAnterior = req.body.prestamoPagos[(req.body.prestamoPagos.length - 1)]
            if (req.body.prestamoPagos.length > 0) {
                saldo_anterior = prestamoAnterior.saldo_anterior - prestamoAnterior.monto_pagado /* - req.body.monto_pagado */
                a_cuenta_anterior = prestamoAnterior.a_cuenta_anterior + req.body.monto_pagado
                //req.body.total
            } else {
                saldo_anterior = req.body.total /* - req.body.monto_pagado */
                a_cuenta_anterior = req.body.monto_pagado
            }
            RrhhEmpleadoPrestamoPago.create({
                id_usuario: req.params.id_usuario,
                id_prestamo: req.params.id_prestamo,
                fecha: req.body.pagoFecha,
                monto_pagado: req.body.monto_pagado,
                saldo_anterior: saldo_anterior,
                a_cuenta_anterior: a_cuenta_anterior
            }).then(function (empleadoPrestamoCreado) {
                RrhhEmpleadoPrestamo.update({
                    cuota: req.body.cuota2
                }, {
                        where: { id: req.params.id_prestamo }
                    }).then(function (params) {
                        res.json({ mensaje: "Pago efectuado satisfactoriamente!" })
                    })
            })
        })
    router.route('/recursos-humanos/empleados/:id_empresa')
        .get(function (req, res) {
            MedicoPaciente.findAll({
                where: { id_empresa: req.params.id_empresa, es_empleado: true, eliminado: false },
                include: [{ model: Persona, as: 'persona' }]
            }).then(function (empleados) {
                if (empleados.length > 0) {
                    empleados.forEach(function (empleado, index, array) {
                        RrhhEmpleadoFicha.findAll({
                            limit: 1,
                            where: {
                                id_empleado: empleado.id
                            },
                            order: [['id', 'DESC']]
                        }).then(function (fichaActual) {
                            empleado.dataValues.ficha = fichaActual[0]
                            if (index === (array.length - 1)) {
                                res.json({ empleados: empleados })
                            }
                        })
                    })

                } else {

                    res.json({ empleados: empleados })

                }

            })
        })
    router.route('/recursos-humanos/rolTurno/empleado/:id_empleado')
        .post(function (req, res) {
            RrhhEmpleadoRolTurno.create({
                id_empleado: req.params.id_empleado,
                id_campo: req.body.campo.id,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin,
                tipo: req.body.tipo,
                dias_trabajado: req.body.dias_trabajo,
                dias_descanso: req.body.dias_descanso,
                grupo: req.body.grupo,
                eliminado: false
            }).then(function (empleadoRolTurnoCreado) {
                res.json({ mensaje: "Guardado satisfactoriamente!" })

            })
        })
    router.route('/recursos-humanos/empresa/:id_empresa/rolTurno/empleado/:id_empleado')
        .get(function (req, res) {
            if (req.params.id_empleado != 0) {
                RrhhEmpleadoRolTurno.findAll({
                    where: { id_empleado: req.params.id_empleado },
                    include: [{ model: Clase, as: 'campo' }, { model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa } }]
                }).then(function (empleadoRolesTurno) {
                    res.json({ rolesTurno: empleadoRolesTurno })

                })
            } else {
                RrhhEmpleadoRolTurno.findAll({
                    include: [{ model: Clase, as: 'campo' }, { model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }]
                }).then(function (empleadoRolesTurno) {
                    res.json({ rolesTurno: empleadoRolesTurno })
                })
            }
        })

    router.route('/recursos-humanos/horas-extra/empleado/:id_empleado')
        .post(function (req, res) {
            RrhhEmpleadoHorasExtra.create({
                id_empleado: req.params.id_empleado,
                fecha: req.body.fecha,
                hora_inicio: req.body.hora_inicio2,
                hora_fin: req.body.hora_fin2,
                tiempo: req.body.tiempo,
                observacion: req.body.observacion,
                eliminado: false
            }).then(function (empleadohorasExtraCreado) {
                res.json({ mensaje: "Guardado satisfactoriamente!" })
            })
        })
    router.route('/recursos-humanos/horas-extra/empleado/:id_empleado/inicio/:inicio/fin/:fin')
        .get(function (req, res) {
            var condicionHorasExtra = { id_empleado: req.params.id_empleado, eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                var condicionHorasExtra = { id_empleado: req.params.id_empleado, eliminado: false, fecha: { $between: [inicio, fin] } };
            }
            RrhhEmpleadoHorasExtra.findAll({
                where: condicionHorasExtra,
                include: [{ model: MedicoPaciente, as: 'empleado' }]
            }).then(function (horasExtra) {
                res.json(horasExtra)

            })
        })
    router.route('/empleados/empresa/excel/upload')
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
                                segundo_nombre: pacienteActual.segundo_nombre,
                                apellido_paterno: pacienteActual.apellido_paterno,
                                apellido_materno: pacienteActual.apellido_materno,
                                ci: pacienteActual.ci,
                                imagen: imagen,
                                id_genero: generoEncontrado.id,
                                nombre_completo: pacienteActual.nombres + ' ' + pacienteActual.segundo_nombre + ' ' + pacienteActual.apellido_paterno + ' ' + pacienteActual.apellido_materno,
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
                                        where: { nombre_corto: 'RRHH_EXP' }
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
                                                id_: pacienteActual.grupo_sanguineo,
                                                cargo: pacienteActual.cargo,
                                                campo: pacienteActual.campamento,
                                                designacion_empresa: pacienteActual.designacion_empresa,
                                                eliminado: pacienteActual.eliminado,
                                                es_empleado: true
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
                                                        EmpleadoCargos.forEach(function (cargo, index, array) {
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
                                                                    if (index === (array.length - 1)) {
                                                                        res.json({ mensaje: "¡Datos de pacientes actualizados satisfactoriamente!" });
                                                                    }
                                                                })
                                                            })

                                                        });
                                                    })
                                                })
                                        })
                                    })
                                })
                        } else {
                            console.log('paciente nuevo')
                            Persona.create({
                                nombres: pacienteActual.nombres,
                                segundo_nombre: pacienteActual.segundo_nombre,
                                apellido_paterno: pacienteActual.apellido_paterno,
                                apellido_materno: pacienteActual.apellido_materno,
                                ci: pacienteActual.ci,
                                id_genero: generoEncontrado.id,
                                nombre_completo: pacienteActual.nombres + ' ' + pacienteActual.segundo_nombre + " " + pacienteActual.apellido_paterno + ' ' + pacienteActual.apellido_materno,
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
                                            where: { nombre_corto: 'RRHH_EXP' }
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
                                                MedicoPaciente.create({
                                                    id_persona: personaCreada.id,
                                                    id_empresa: req.body.id_empresa,
                                                    codigo: pacienteActual.codigo,
                                                    cargo: pacienteActual.cargo,
                                                    id_extension: expClase.id,
                                                    campo: pacienteActual.campamento,
                                                    designacion_empresa: pacienteActual.designacion_empresa,
                                                    eliminado: false,
                                                    es_empleado: pacienteActual.es_empleado
                                                    //comentario: pacienteActual.comentario
                                                }).then(function (medicoPacienteActualizado) {
                                                    Tipo.find({
                                                        where: { nombre_corto: 'RRHH_TC' }
                                                    }).then(function (tipoContrato) {
                                                        var nombre_corto3 = pacienteActual.contrato.substr(0, 3);
                                                        Clase.findOrCreate({
                                                            where: {
                                                                nombre: pacienteActual.contrato,
                                                                id_tipo: tipoContrato.dataValues.id,
                                                            },
                                                            defaults: {
                                                                id_tipo: tipoContrato.dataValues.id,
                                                                nombre: pacienteActual.contrato,
                                                                nombre_corto: nombre_corto3
                                                            }
                                                        }).spread(function (contratoClase, created) {
                                                            var fecha = new Date()
                                                            RrhhEmpleadoFicha.create({
                                                                fecha: medicoPacienteActualizado.dataValues.createdAt,
                                                                id_empleado: medicoPacienteActualizado.dataValues.id,
                                                                id_tipo_contrato: contratoClase.dataValues.id,
                                                            }).then(function (Creado) {
                                                                Tipo.find({
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
                                                                            if (index === (array.length - 1)) {
                                                                                res.json({ mensaje: "¡Datos de pacientes actualizados satisfactoriamente!" });
                                                                            }
                                                                        })
                                                                    })
                                                                })
                                                            })
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
        })
    router.route('/validar-codigo-empleado')
        .post(function (req, res) {
            MedicoPaciente.find({
                where: {
                    codigo: req.body.codigo,
                    eliminado: false
                }
            }).then(function (entidad) {
                if (entidad) {
                    res.json({
                        type: true,
                        message: "¡el codigo ya Exsiste!"
                    });
                } else {
                    res.json({
                        type: false,
                        message: "Codigo Disponible"
                    });
                }
            });
        })
    router.route('/recurso-humanos/capacidades/hoja-vida/:id_hoja_vida/inicio/:inicio/fin/:fin/tipo/:tipo')
        .get(function (req, res) {
            var condicionCapacidades = {}
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 59, 0, 0, 0);
                condicionCapacidades = { id_hoja_vida: req.params.id_hoja_vida, fecha: { $between: [inicio, fin] } };
            } else {
                condicionCapacidades = { id_hoja_vida: req.params.id_hoja_vida };
            }
            RrhhEmpleadoCapacidadInternaExterna.findAll({
                where: condicionCapacidades,
                include: [{ model: Clase, as: 'tipoCapacidad', where: { nombre_corto: req.params.tipo } }]
            }).then(function (entidad) {
                res.json({ capacidades: entidad })
            });
        });

    router.route('/recursos-humanos/anticipos/empleado/:id_empleado')
        .post(function (req, res) {
            Clase.find({
                where: { nombre_corto: req.body.textoClase }
            }).then(function (clase) {
                RrhhAnticipo.create({
                    id_empleado: req.params.id_empleado,
                    fecha: req.body.fecha,
                    monto: req.body.monto,
                    id_tipo: clase.id,
                    total: req.body.total,
                    salario_basico: req.body.salario_basico,
                    eliminado: false,
                    entregado: false,
                }).then(function (empleadoaAnticipo) {
                    RrhhAnticipo.findAll({
                        where: { id_empleado: req.params.id_empleado, id_tipo: { $ne: clase.id } }
                    }).then(function (anticipos) {
                        var anteriorMonto = 0
                        if (anticipos.length > 0) {
                            anticipos.forEach(function (anticipo, index, array) {
                                /*   var total = req.body.montoExtraoridnario + anticipo.monto */
                                if (index == 0) {
                                    var total = req.body.montoExtraoridnario + anticipo.monto
                                } else {
                                    var total = anticipo.monto + anteriorMonto
                                }
                                anteriorMonto = total
                                RrhhAnticipo.update({
                                    total: total,
                                }, {
                                        where: { id: anticipo.id }
                                    }).then(function (empleadoaAnticipo) {
                                        if (index === (array.length - 1)) {
                                            res.json({ mensaje: "Guardado satisfactoriamente!" })
                                        }
                                    })
                            });
                        } else {
                            res.json({ mensaje: "Guardado satisfactoriamente!" })
                        }

                    })
                })
            })

        })
        .put(function (req, res) {
            RrhhAnticipo.update({
                monto: req.body.monto,
                total: req.body.total,
            }, {
                    where: { id: req.body.id }
                }).then(function (empleadoaAnticipo) {
                    RrhhAnticipo.findAll({
                        where: { id_empleado: req.params.id_empleado, id_tipo: { $ne: req.body.id_tipo } }
                    }).then(function (anticipos) {
                        var anteriorMonto = 0
                        if (anticipos.length > 0) {
                            anticipos.forEach(function (anticipo, index, array) {
                                /*   var total = req.body.montoExtraoridnario + anticipo.monto */
                                if (index == 0) {
                                    var total = req.body.montoExtraoridnario + anticipo.monto
                                } else {
                                    var total = anticipo.monto + anteriorMonto
                                }
                                anteriorMonto = total
                                RrhhAnticipo.update({
                                    total: total,
                                }, {
                                        where: { id: anticipo.id }
                                    }).then(function (empleadoaAnticipo) {
                                        if (index === (array.length - 1)) {
                                            res.json({ mensaje: "Guardado satisfactoriamente!" })
                                        }
                                    })
                            });
                        } else {
                            res.json({ mensaje: "Guardado satisfactoriamente!" })
                        }
                    })

                })
        })
    router.route('/recursos-humanoss/anticipos/empleados')
        .post(function (req, res) {

            for (let i = 0; i < req.body.anticipos.length; i++) {
                const anticipo = req.body.anticipos[i];
                Clase.find({
                    where: { nombre_corto: req.body.textoClase }
                }).then(function (clase) {
                    RrhhAnticipo.create({
                        id_empleado: anticipo.empleado.id,
                        fecha: anticipo.fecha,
                        monto: anticipo.monto,
                        id_tipo: clase.id,
                        total: anticipo.total,
                        eliminado: false,
                        salario_basico: anticipo.salario_basico,
                        tope: anticipo.tope,
                        tipo_porcentual: anticipo.tipo_porcentual,
                        porcentaje: anticipo.porcentaje
                    }).then(function (empleadoaAnticipo) {
                        RrhhAnticipo.findAll({
                            where: { id_empleado: empleadoaAnticipo.id_empleado, id_tipo: { $ne: clase.id } }
                        }).then(function (anticipos) {
                            if (anticipos.length > 0) {
                                var anteriorMonto = 0
                                anticipos.forEach(function (anticipo2, index, array) {
                                    if (index == 0) {
                                        var total = anticipo.montoordinario + anticipo2.monto
                                    } else {
                                        var total = anticipo2.monto + anteriorMonto
                                    }
                                    anteriorMonto = total
                                    RrhhAnticipo.update({
                                        total: total,
                                    }, {
                                            where: { id: anticipo2.id }
                                        }).then(function (empleadoaAnticipo) {
                                            if (index === (array.length - 1)) {
                                                res.json({ mensaje: "Guardado satisfactoriamente!" })
                                            }
                                        })
                                })
                            } else {
                                res.json({ mensaje: "Guardado satisfactoriamente!" })
                            }
                        })
                    })

                })
            }
            /* req.body.anticipos.forEach(function (anticipo, index, array) {
                
                Clase.find({
                    where: { nombre_corto: req.body.textoClase }
                }).then(function (clase) {
                    RrhhAnticipo.create({
                        id_empleado: anticipo.empleado.id,
                        fecha: anticipo.fecha,
                        monto: anticipo.monto,
                        id_tipo: clase.id,
                        total: anticipo.total,
                        eliminado: false,
                        salario_basico: anticipo.salario_basico,
                        tope: anticipo.tope
                    }).then(function (empleadoaAnticipo) {
                        RrhhAnticipo.findAll({
                            where: { id_empleado: empleadoaAnticipo.id_empleado, id_tipo: { $ne: clase.id } }
                        }).then(function (anticipos) {
                            if (anticipos.length > 0) {
                                var anteriorMonto = 0
                                anticipos.forEach(function (anticipo2, index, array) {
                                    if (index == 0) {
                                        var total = anticipo.montoordinario + anticipo2.monto
                                    }else{
                                        var total = anticipo.montoordinario + anticipo2.monto+anteriorMonto
                                    }
                                    anteriorMonto=anticipo2.monto
                                    RrhhAnticipo.update({
                                        total: total,
                                    }, {
                                            where: { id: anticipo2.id }
                                        }).then(function (empleadoaAnticipo) {
                                            if (index === (array.length - 1)) {
                                                res.json({ mensaje: "Guardado satisfactoriamente!" })
                                            }
                                        })
                                })
                            } else { 
                                res.json({ mensaje: "Guardado satisfactoriamente!" })
                             }


                    })
                })
            }); */

        })

    router.route('/recursos-humanos/anticipos/empleado/:id_empleado/inicio/:inicio/fin/:fin/empresa/:id_empresa')
        .get(function (req, res) {
            var condicionAnticipo = {}
            var condicionEmpleado = {}
            var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
            var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);
            if (req.params.id_empleado != "0") {
                var condicionAnticipo = { id_empleado: req.params.id_empleado, eliminado: false, fecha: { $between: [inicio, fin] } };
            } else {
                condicionAnticipo = { eliminado: false, fecha: { $between: [inicio, fin] } };
                condicionEmpleado = { id_empresa: req.params.id_empresa }
            }
            RrhhAnticipo.findAll({
                where: condicionAnticipo,
                include: [{ model: MedicoPaciente, as: 'empleado', where: condicionEmpleado, include: [{ model: Persona, as: 'persona' }] }, { model: Clase, as: 'tipoAnticipo' }]
            }).then(function (empleadoaAnticipo) {
                if (empleadoaAnticipo.length > 0) {
                    empleadoaAnticipo.forEach(function (anticipo, index, array) {
                        RrhhEmpleadoFicha.findAll({
                            limit: 1,
                            where: {
                                id_empleado: anticipo.empleado.id
                            },
                            include: [{ model: Clase, as: 'banco' }],
                            order: [['id', 'DESC']]
                        }).then(function (fichaActual) {
                            anticipo.dataValues.empleado.dataValues.ficha = fichaActual[0]
                            if (index === (array.length - 1)) {
                                res.json({ anticipos: empleadoaAnticipo })
                            }
                        })
                    })

                } else {

                    res.json({ anticipos: empleadoaAnticipo })
                }
            })
        })
    //rutas ausencias
    router.route('/recursos-humanos/ausencia/empleado/:id_empleado')
        .post(function (req, res) {
            RrhhEmpleadoAusencia.create({
                id_empleado: req.params.id_empleado,
                id_tipo: req.body.tipo.id,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin,
                diagnostico: req.body.diagnostico,
                observacion: req.body.observacion,
                dias: req.body.dias,
                horas: req.body.horas,
                eliminado: false,
                primera_baja: req.body.primera_baja,
                planilla: req.body.planilla
            }).then(function (empleadoAusenciaCreado) {
                if (req.body.compensaciones.length > 0) {
                    req.body.compensaciones.forEach(function (compensacion, index, array) {
                        RrhhEmpleadoCompensacionAusencia.create({
                            id_ausencia: empleadoAusenciaCreado.id,
                            fecha: compensacion.fecha_real,
                            hora_inicio: compensacion.hora_inicio,
                            hora_fin: compensacion.hora_fin,
                            tiempo: compensacion.total,
                            eliminado: false
                        }).then(function (compensacionCreada) {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Guardado satisfactoriamente!" })
                            }
                        })
                    })

                } else {
                    res.json({ mensaje: "Guardado satisfactoriamente!" })
                }
            })
        })
    router.route('/recursos-humanos/ausencias/empleado/:id_empleado/inicio/:inicio/fin/:fin/tipo-ausencia/:tipo_ausencia/tipo/:tipo')
        .get(function (req, res) {
            var condicionAusencias = { id_empleado: req.params.id_empleado, eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionAusencias = { id_empleado: req.params.id_empleado, eliminado: false, fecha_inicio: { $between: [inicio, fin] } };
                if (req.params.tipo_ausencia != 0) {
                    condicionAusencias = { id_empleado: req.params.id_empleado, eliminado: false, tipo: req.params.tipo_ausencia, fecha_inicio: { $between: [inicio, fin] } };
                }
            } else if (req.params.tipo_ausencia != 0) {
                condicionAusencias = { id_empleado: req.params.id_empleado, eliminado: false, tipo: req.params.tipo_ausencia };
            }
            RrhhEmpleadoAusencia.findAll({
                where: condicionAusencias,
                include: [{ model: MedicoPaciente, as: 'empleado' }, { model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: req.params.tipo } }] }]
            }).then(function (ausencias) {
                res.json(ausencias)
            })

        })
    router.route('/recursos-humanos/ausencias/empresa/:id_empresa/inicio/:inicio/fin/:fin/tipo-ausencia/:tipo_ausencia/tipo/:tipo')
        .get(function (req, res) {
            var condicionAusencias = { eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionAusencias = { eliminado: false, fecha_inicio: { $between: [inicio, fin] } };
                if (req.params.tipo_ausencia != 0) {
                    condicionAusencias = { eliminado: false, tipo: req.params.tipo_ausencia, fecha_inicio: { $between: [inicio, fin] } };
                }
            } else if (req.params.tipo_ausencia != 0) {
                condicionAusencias = { eliminado: false, tipo: req.params.tipo_ausencia };
            }
            RrhhEmpleadoAusencia.findAll({
                where: condicionAusencias,
                include: [{ model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }, { model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: req.params.tipo } }] }]
            }).then(function (ausencias) {
                res.json(ausencias)
            })
        })
    //fin rutas ausencias
    //rutas vacaciones
    router.route('/recursos-humanos/vacacion/empleado/:id_empleado')
        .post(function (req, res) {
            RrhhEmpleadoVacaciones.create({
                id_empleado: req.params.id_empleado,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin,
                observacion: req.body.observacion,
                dias: String(req.body.dias),
                sabado: req.body.sabado,
                inicio_tipo: req.body.inicio_tipo,
                fin_tipo: req.body.fin_tipo,
                eliminado: false
            }).then(function (empleadoVacacionCreado) {//dias=12
                req.body.historial.forEach(function (historial, index, array) {
                    if (historial.anio <= req.body.aniosDisponibles) {
                        var restante = historial.aplicadas - historial.tomadas
                        if (restante != 0) {
                            var tomadas = 0
                            if (req.body.dias >= restante) {
                                req.body.dias = req.body.dias - restante
                                tomadas = restante + historial.tomadas
                            } else {
                                tomadas = req.body.dias + historial.tomadas
                            }

                            RrhhEmpleadoHistorialVacacion.update({
                                tomadas: tomadas
                            }, {
                                    where: { id: historial.id }
                                }).then(function (historialVacacionActualizado) {
                                    if (index === (array.length - 1)) {
                                        res.json({ mensaje: "Guardado satisfactoriamente!" })
                                    }
                                })

                        } else {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Guardado satisfactoriamente!" })
                            }
                        }
                    } else {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: "Guardado satisfactoriamente!" })
                        }
                    }
                });
            })
        })
    router.route('/recursos-humanos/vacacion/empleado/:id_empleado/inicio/:inicio/fin/:fin')
        .get(function (req, res) {
            var condicionVacaciones = { id_empleado: req.params.id_empleado, eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionVacaciones = { id_empleado: req.params.id_empleado, eliminado: false, fecha_inicio: { $between: [inicio, fin] } };
            }
            RrhhEmpleadoVacaciones.findAll({
                where: condicionVacaciones,
                include: [{ model: MedicoPaciente, as: 'empleado', include: [{ model: Persona, as: 'persona' }] }]
            }).then(function (vacaciones) {
                res.json(vacaciones)
            })
        })
    router.route('/recursos-humanos/vacacion/empresa/:id_empresa/inicio/:inicio/fin/:fin')
        .get(function (req, res) {
            var condicionVacaciones = { eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionVacaciones = { eliminado: false, fecha_inicio: { $between: [inicio, fin] } };
            }
            RrhhEmpleadoVacaciones.findAll({
                where: condicionVacaciones,
                include: [{ model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }]
            }).then(function (vacaciones) {
                res.json(vacaciones)
            })
        })
    router.route('/recursos-humanos/vacacion/feriados/empresa/:id_empresa')
        .post(function (req, res) {
            if (req.body.feriados.length > 0) {
                req.body.feriados.forEach(function (feriado, index, array) {
                    if (feriado.id == undefined) {
                        feriado.start = new Date(feriado.start)
                        feriado.end = new Date(feriado.end)
                        feriado.start.setHours(0, 0, 0, 0, 0);
                        feriado.end.setHours(23, 59, 0, 0, 0);
                        RrhhFeriado.create({
                            fecha_inicio: feriado.start,
                            fecha_fin: feriado.end,
                            id_empresa: req.params.id_empresa
                        }).then(function (feriadoCreado) {
                            if (index === (array.length - 1)) {
                                if (req.body.feriadosEliminados.length > 0) {
                                    guardarEliminados(req, res)
                                } else {
                                    res.json({ mensaje: "Guardado satisfactoriamente!" })
                                }
                            }

                        })
                    } else {
                        if (index === (array.length - 1)) {
                            if (req.body.feriadosEliminados.length > 0) {
                                guardarEliminados(req, res)
                            } else {
                                res.json({ mensaje: "Guardado satisfactoriamente!" })
                            }
                        }

                    }
                });
            } else {
                guardarEliminados(req, res)
            }
        })
        .get(function (req, res) {
            RrhhFeriado.findAll({
                where: { id_empresa: req.params.id_empresa }
            }).then(function (dato) {
                res.json(dato)
            })
        })

    guardarEliminados = function (req, res) {
        req.body.feriadosEliminados.forEach(function (feriado, index, array) {
            RrhhFeriado.destroy({
                where: { id: feriado.id }
            }).then(function (feriadoCreado) {
                if (index === (array.length - 1)) {
                    res.json({ mensaje: "Guardado satisfactoriamente!" })
                }
            })
        })
    }
    //fin rutas vacaciones
    // TIPOS AUSENCIA
    router.route('/recursos-humanos/ausencia/clases/tipo/:tipo')
        .post(function (req, res) {
            req.body.forEach(function (clase, index, array) {
                if (clase.id) {
                    RrhhClaseAsuencia.update({
                        nombre: clase.nombre,
                        id_tipo: req.params.tipo,
                        porcentaje: clase.porcentaje,
                        dias_descuento: clase.dias_descuento,
                        habilitado: req.body.habilitado,
                    }, {
                            where: { id: clase.id }
                        }).then(function (claseCreada) {
                            res.json({ mensaje: "Guardado satisfactoriamente!" })
                        })
                } else {
                    RrhhClaseAsuencia.create({
                        nombre: clase.nombre,
                        id_tipo: req.params.tipo,
                        porcentaje: clase.porcentaje,
                        dias_descuento: clase.dias_descuento,
                        habilitado: true
                    }).then(function (claseCreada) {
                        res.json({ mensaje: "Guardado satisfactoriamente!" })
                    })
                }
            });
        })
    router.route('/recursos-humanos/configuracion/vacacion')
        .get(function (req, res) {
            RrhhEmpleadoConfiguracionVacacion.findAll({

            }).then(function (params) {
                res.json(params)
            })
        })
    router.route('/recursos-humanos/historial/gestion/vacacion/empleado/:id')
        .get(function (req, res) {
            RrhhEmpleadoHistorialVacacion.findAll({
                where: { id_empleado: req.params.id, eliminado: false }
            }).then(function (params) {
                res.json(params)
            })
        })
    //FIN
    /////////////////////////////////////////////////////// RUTAS PARA POLIFUNCIONAL ///////////////////////////////////////////////////

    var meses = [{ id: 0, nombre: "Enero" }, { id: 1, nombre: "Febrero" }, { id: 2, nombre: "Marzo" }, { id: 3, nombre: "Abril" },
    { id: 4, nombre: "Mayo" }, { id: 5, nombre: "Junio" }, { id: 6, nombre: "Julio" }, { id: 7, nombre: "Agosto" },
    { id: 8, nombre: "Septiembre" }, { id: 9, nombre: "Octubre" }, { id: 10, nombre: "Noviembre" }, { id: 11, nombre: "Diciembre" }];
    var actual_year_diference = (new Date().getFullYear() - 1980)
    var anios = Array.apply(null, Array(actual_year_diference + 1)).map(function (_, i) {
        var start_year = 1980
        var year = { id: start_year + i, nombre: start_year + i }
        return year
    })
    ///////////////////////////////////// FILTRO POLIFUNCIONAL

    router.route('/personal/filtro/:id_empresa/:mes/:anio/:desempenio/:mas_campo/:campo/:cargo/:estado/:codigo/:nombre/:apellido/:pagina/:items_pagina/:columna/:direccion/fiu')
        .get(function (req, res) {
            var condicion_evaluacion = {}
            var condicion_cargos = {}
            var condicion_persona = {}
            var condicion_empleado = {}

            if (req.params.mes !== "0") {
                condicion_evaluacion.mes = parseInt(req.params.mes) -1
            }
            if (req.params.anio !== "0") {
                condicion_evaluacion.anio = req.params.anio
            }
            if (req.params.desempenio !== "0") {
                condicion_evaluacion.desempenio = req.params.desempenio
            }
            if (req.params.mas_campo !== "0") {

            }
            if (req.params.campo !== "0") {
                condicion_empleado.campo = req.params.campo
            }
            if (req.params.cargo !== "0") {
                condicion_cargos.cargo = req.params.cargo
            }
            if (req.params.estado !== "0") {
                condicion_empleado.eliminado = req.params.estado == "1" ? false : true
            }else{
                // condicion_empleado.eliminado = false
            }
            if (req.params.codigo !== "0") {
                condicion_empleado.codigo = { $like: req.params.codigo + '%' }
            }
            if (req.params.nombre !== "0") {
                condicion_persona.nombre_completo = { $like: '%'+req.params.nombre+'%' }
            }
            if (req.params.apellido !== "0") {
                condicion_persona.nombre_completo = { $like: '%'+req.params.apellido+'%' }
            }
            condicion_empleado.es_empleado = true
            EvaluacionPolifuncional.findAndCountAll({
                offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                where: condicion_evaluacion,
                include: [{
                    model: MedicoPaciente, as: 'empleado',
                    where: condicion_empleado,
                    include: [{
                        model: RrhhEmpleadoCargo, as: 'cargos',
                        where: { $or: condicion_cargos },
                        include: [{ model: Clase, as: 'cargo' }]
                    }, { model: Persona, as: 'persona', where: condicion_persona }]
                }]
            }).then(function (evaluaciones) {
                res.json({ evaluaciones: evaluaciones, paginas: Math.ceil(evaluaciones.count / req.params.items_pagina) })
            }).catch(function (err) {
                res.json({ personal: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })

    /////////////////////////////////////// Lista de trabajadores

    router.route('/todo/personal/:id_empresa')
        .get(function (req, res) {
            MedicoPaciente.findAll({
                where: {
                    es_empleado: true
                }, include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }, { model: Persona, as: 'persona' }]
            }).then(function (personal) {
                res.json({ personal: personal })
            }).catch(function (err) {
                res.json({ personal: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })

    /////////////////////////////////////////// Guardar evaluaciones       

    router.route('/evaluacion/personal/:id_empresa')
        .post(function (req, res) {
            if (req.body.eliminar) {
                EvaluacionPolifuncional.update({
                    eliminado: req.body.eliminado
                }, {
                        where: { id: req.body.id }
                    }).then(function (evaluacionCreada) {
                        res.json({ mensaje: 'Evaluación eliminada correctamente!' })
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });
            } else {
                EvaluacionPolifuncional.findOrCreate({
                    where: {
                        id_empleado: req.body.personal.id,
                        anio: req.body.anio.id,
                        mes: req.body.mes.id
                        // fecha: req.body.fecha
                    },
                    include: [{
                        model: MedicoPaciente, as: 'empleado',
                        include: [{
                            model: RrhhEmpleadoCargo, as: 'cargos',
                            include: [{ model: Clase, as: 'cargo' }]
                        }, { model: Persona, as: 'persona' }]
                    }],
                    defaults: {
                        id_empleado: req.body.personal.id,
                        anio: req.body.anio.id,
                        mes: req.body.mes.id,
                        fecha: req.body.fecha,
                        asistencia_capacitacion: req.body.asistencia_capacitacion,
                        documentos_actualizados: req.body.documentos_actualizados,
                        trabajo_equipo: req.body.trabajo_equipo,
                        funciones_puntualidad: req.body.funciones_puntualidad,
                        higiene_personal: req.body.higiene_personal,
                        asistencia_reunion: req.body.asistencia_reunion,
                        ingreso_campo: req.body.ingreso_campo,
                        llenado_formularios: req.body.llenado_formularios,
                        nota_total: req.body.nota_total,
                        id_desempenio: req.body.id_desempenio,
                        encargado: req.body.encargado,
                        eliminado: req.body.eliminado
                    }
                }).spread(function (evaluacion, nueva) {
                    if (!nueva) {
                        res.json({ mensaje: 'Ya existe una evaluación de fecha ' + meses[evaluacion.mes].nombre + '-' + evaluacion.anio + ' para el empleado ' + evaluacion.empleado.persona.nombre_completo })
                    } else {
                        res.json({ mensaje: 'Evaluación Creada satisfactoriamente!' })
                    }

                }).catch(function (err) {
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                });
            }

        })
        .put(function (req, res) {
            EvaluacionPolifuncional.update({
                id_empleado: req.body.personal.id,
                anio: req.body.anio.id,
                mes: req.body.mes.id,
                fecha: req.body.fecha,
                asistencia_capacitacion: req.body.asistencia_capacitacion,
                documentos_actualizados: req.body.documentos_actualizados,
                trabajo_equipo: req.body.trabajo_equipo,
                funciones_puntualidad: req.body.funciones_puntualidad,
                higiene_personal: req.body.higiene_personal,
                asistencia_reunion: req.body.asistencia_reunion,
                ingreso_campo: req.body.ingreso_campo,
                llenado_formularios: req.body.llenado_formularios,
                nota_total: req.body.nota_total,
                id_desempenio: req.body.id_desempenio,
                encargado: req.body.encargado,
                eliminado: req.body.eliminado
            }, {
                    where: { id: req.body.id }
                }).then(function (evaluacionCreada) {
                    res.json({ mensaje: 'Evaluación modificada correctamente!' })
                }).catch(function (err) {
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                });
        })


    /////////////////////////////////////////// configuraciones

    //////Configuracion Desempeño
    router.route('/desempenio/configuracion/:id_empresa/sufra')
        .post(function (req, res) {
            var i = 0
            req.body.forEach(function (dato, i) {
                ConfiguracionDesempenioEvaluacionPolifuncional.findOrCreate({
                    where: {
                        id_empresa: req.params.id_empresa,
                        id: dato.id,
                        nombre: dato.nombre
                    },
                    defaults: {
                        id_empresa: req.params.id_empresa,
                        nombre: dato.nombre,
                        desde: dato.desde,
                        hasta: dato.hasta,
                        color: dato.color,
                        activo: dato.activo !== undefined && dato.activo !== null ? dato.activo : false
                    }
                }).spread(function (configuracion, created) {
                    if (created) {
                        if (i == req.body.length - 1) {
                            res.json({ mensaje: 'Configuración guardada correctamente!' })
                        }
                    } else {
                        ConfiguracionDesempenioEvaluacionPolifuncional.update({
                            id_empresa: req.params.id_empresa,
                            nombre: dato.nombre,
                            desde: dato.desde,
                            hasta: dato.hasta,
                            activo: dato.activo
                        }, {
                                where: {
                                    id_empresa: req.params.id_empresa,
                                    id: dato.id,
                                    nombre: dato.nombre
                                }
                            }).then(function (configuracionActializada) {
                                if (i == req.body.length - 1) {
                                    res.json({ mensaje: 'Configuracion Actualizada...' })
                                }
                            })
                    }
                }).catch(function (err) {
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                });
            })
        })
        .get(function (req, res) {
            ConfiguracionDesempenioEvaluacionPolifuncional.findAll({
                where: {
                    id_empresa: req.params.id_empresa
                }
            }).then(function (configuracion) {
                res.json({ parametros: configuracion })
            }).catch(function (err) {
                res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })

    ///////Configuracion evaluacion
    router.route('/evaluacion/configuracion/:id_empresa')
        .post(function (req, res) {
            req.body.forEach(function (obj, i) {
                ConfiguracionCalificacionEvaluacionPolifuncional.findOrCreate({
                    where: {
                        id: obj.id,
                        encargados: obj.encargados,
                        id_empresa: req.params.id_empresa
                    },
                    defaults: {
                        asistencia_capacitacion: obj.asistencia_capacitacion,
                        documentos_actualizados: obj.documentos_actualizados,
                        trabajo_equipo: obj.trabajo_equipo,
                        funciones_puntualidad: obj.funciones_puntualidad,
                        higiene_personal: obj.higiene_personal,
                        asistencia_reunion: obj.asistencia_reunion,
                        ingreso_campo: obj.ingreso_campo,
                        llenado_formularios: obj.llenado_formularios,
                        encargados: obj.encargados,
                        nota_total: obj.nota_total,
                        eliminado: obj.parametros !== undefined && obj.parametros !== null ? obj.parametros : false
                    }
                }).spread(function (configuracion, created) {
                    if (created) {
                        if (i == req.body.length - 1) {
                            res.json({ mensaje: 'Configuración registrada correctamente!' })
                        }
                    } else {
                        ConfiguracionCalificacionEvaluacionPolifuncional.update({
                            asistencia_capacitacion: obj.asistencia_capacitacion,
                            documentos_actualizados: obj.documentos_actualizados,
                            trabajo_equipo: obj.trabajo_equipo,
                            funciones_puntualidad: obj.funciones_puntualidad,
                            higiene_personal: obj.higiene_personal,
                            asistencia_reunion: obj.asistencia_reunion,
                            ingreso_campo: obj.ingreso_campo,
                            llenado_formularios: obj.llenado_formularios,
                            encargados: obj.encargados,
                            nota_total: obj.nota_total,
                            eliminado: obj.parametros !== undefined && obj.parametros !== null ? obj.parametros : false
                        }, {
                                where: {
                                    id: obj.id,
                                    encargados: obj.encargados,
                                    id_empresa: req.params.id_empresa
                                }
                            }).then(function (configuracionActializada) {
                                if (i == req.body.length - 1) {
                                    res.json({ mensaje: 'Actualizada registrada correctamente!' })
                                }
                            })
                    }
                    // i += 1
                }).catch(function (err) {
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                });
            })
            // var i = 0
            // for (var key in req.body) {
            //     ConfiguracionCalificacionEvaluacionPolifuncional.findOrCreate({
            //         where: {
            //             id: req.body[key].id,
            //             encargados: req.body[key].encargados,
            //             id_empresa: req.params.id_empresa
            //         },
            //         defaults: {
            //             asistencia_capacitacion: req.body[key].asistencia_capacitacion,
            //             documentos_actualizados: req.body[key].documentos_actualizados,
            //             trabajo_equipo: req.body[key].trabajo_equipo,
            //             funciones_puntualidad: req.body[key].funciones_puntualidad,
            //             higiene_personal: req.body[key].higiene_personal,
            //             asistencia_reunion: req.body[key].asistencia_reunion,
            //             ingreso_campo: req.body[key].ingreso_campo,
            //             llenado_formularios: req.body[key].llenado_formularios,
            //             encargados: req.body[key].encargados,
            //             nota_total: req.body[key].nota_total,
            //             eliminado: req.body[key].parametros !== undefined && req.body[key].parametros !== null ? req.body[key].parametros : false
            //         }
            //     }).spread(function (configuracion, created) {
            //         if (created) {
            //             if (i >= 1) {
            //                 res.json({ mensaje: 'Configuración registrada correctamente!' })
            //             }
            //         } else {
            //             ConfiguracionCalificacionEvaluacionPolifuncional.update({
            //                 asistencia_capacitacion: req.body[key].asistencia_capacitacion,
            //                 documentos_actualizados: req.body[key].documentos_actualizados,
            //                 trabajo_equipo: req.body[key].trabajo_equipo,
            //                 funciones_puntualidad: req.body[key].funciones_puntualidad,
            //                 higiene_personal: req.body[key].higiene_personal,
            //                 asistencia_reunion: req.body[key].asistencia_reunion,
            //                 ingreso_campo: req.body[key].ingreso_campo,
            //                 llenado_formularios: req.body[key].llenado_formularios,
            //                 encargados: req.body[key].encargados,
            //                 nota_total: req.body[key].nota_total,
            //                 eliminado: req.body[key].parametros !== undefined && req.body[key].parametros !== null ? req.body[key].parametros : false
            //             }, {
            //                     where: {
            //                         id: req.body[key].id,
            //                         encargados: req.body[key].encargados,
            //                         id_empresa: req.params.id_empresa
            //                     }
            //                 }).then(function (configuracionActializada) {
            //                     if (i >= 1) {
            //                         res.json({ mensaje: 'Actualizada registrada correctamente!' })
            //                     }
            //                 })
            //         }
            //         i += 1
            //     }).catch(function (err) {
            //         res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            //     });
            // }

        })
        .get(function (req, res) {
            ConfiguracionCalificacionEvaluacionPolifuncional.findAll({
                where: { id_empresa: req.params.id_empresa }
            }).then(function (configuracion) {
                var configuraciones = {}
                for (var key in configuracion) {
                    if (configuracion[key].encargados) {
                        configuraciones.encargados = configuracion[key];
                    } else {
                        configuraciones.empleados = configuracion[key]
                    }
                }
                res.json({ configuracion: configuraciones })
            })
        })

    ///////////////////////////////////////////////Reporte por meses

    router.route('/reportes/:desde_mes/:desde_anio/:hasta_mes/:hasta_anio')
        .get(function (req, res) {
            var desde = new Date(parseInt(req.params.desde_anio), parseInt(req.params.desde_mes), 1, 0, 0, 0)
            var hasta = new Date(parseInt(req.params.hasta_anio), parseInt(req.params.hasta_mes) + 1, 0, 23, 59, 0)
            var condicion = { fecha: { $between: [desde, hasta] } }
            MedicoPaciente.findAll({
                where: {
                    es_empleado: true
                }, include: [
                    { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] },
                    { model: Persona, as: 'persona' },
                    { model: EvaluacionPolifuncional, as: 'evaluaciones', where: condicion, order: [['fecha', 'asc']], required: true }
                ],
                order: [[{ model: EvaluacionPolifuncional, as: 'evaluaciones' }, 'fecha', 'asc']]
            }).then(function (reporteEvaluaciones) {
                var evaluaciones = []
                var mesesReporte = []
                reporteEvaluaciones.map(function (trabajador) {
                    trabajador.evaluaciones.map(function (evaluacion) {
                        var fechatexto = meses[evaluacion.mes].nombre.substring(0, 3) + '-' + (evaluacion.anio).toString().substring(4, 2)
                        var mesAnio = { texto: fechatexto, fecha: evaluacion.fecha }
                        var existe = mesesReporte.indexOf(mesAnio)
                        if (existe < 0) {
                            mesesReporte.push(mesAnio)
                        }
                    })
                })
                mesesReporte.sort(function compare(a, b) {
                    var aDate = new Date(a.fecha)
                    var bDate = new Date(b.fecha)
                    return aDate - bDate;
                })
                var mesesAnio = mesesReporte.map(function (fecha) {
                    return fecha.texto
                })
                var mesesEnviar = []
                mesesAnio.map(function (fecha) {
                    var esta = mesesEnviar.indexOf(fecha)
                    if (esta < 0) {
                        mesesEnviar.push(fecha)
                    }
                })
                res.json({ reporte: reporteEvaluaciones, mesesReporte: mesesEnviar })
            }).catch(function (err) {
                res.json({ reporte: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })

    ////////////////////////////////////////////////////// Promedios anuales de campos

    router.route('/reportes/anual/:anio/campos')
        .get(function (req, res) {
            var condicionCampo = {}
            EvaluacionPolifuncional.findAll({
                where: { anio: req.params.anio },
                include: [{
                    model: MedicoPaciente, as: 'empleado', where: condicionCampo
                }],
                order: [[{ model: MedicoPaciente, as: 'empleado' }, 'campo', 'asc']]
            }).then(function (evaluaciones) {
                var reportesCampos = []
                var reporteAnual = []
                evaluaciones.map(function (evaluacion) {
                    var reporte = {
                        campo: evaluacion.empleado.campo,
                        asistencia_capacitacion: evaluacion.asistencia_capacitacion,
                        documentos_actualizados: evaluacion.documentos_actualizados,
                        trabajo_equipo: evaluacion.trabajo_equipo,
                        funciones_puntualidad: evaluacion.funciones_puntualidad,
                        higiene_personal: evaluacion.higiene_personal,
                        asistencia_reunion: evaluacion.asistencia_reunion,
                        ingreso_campo: evaluacion.ingreso_campo,
                        llenado_formularios: evaluacion.llenado_formularios,
                        count: 1
                    }
                    reportesCampos.push(reporte)
                })
                while (reportesCampos.length > 0) {
                    if (reporteAnual.length == 0) {
                        reporteAnual.push(reportesCampos.pop())
                    } else {
                        var reporteCampo = reportesCampos.pop()
                        var indx = -1
                        var existe = reporteAnual.some(function (reporte, i) {
                            indx = i
                            return reporte.campo == reporteCampo.campo
                        })
                        if (existe) {
                            reporteAnual[indx].asistencia_capacitacion += reporteCampo.asistencia_capacitacion
                            reporteAnual[indx].documentos_actualizados += reporteCampo.documentos_actualizados
                            reporteAnual[indx].trabajo_equipo += reporteCampo.trabajo_equipo
                            reporteAnual[indx].funciones_puntualidad += reporteCampo.funciones_puntualidad
                            reporteAnual[indx].higiene_personal += reporteCampo.higiene_personal
                            reporteAnual[indx].asistencia_reunion += reporteCampo.asistencia_reunion
                            reporteAnual[indx].ingreso_campo += reporteCampo.ingreso_campo
                            reporteAnual[indx].llenado_formularios += reporteCampo.llenado_formularios
                            reporteAnual[indx].count += 1
                        } else {
                            reporteAnual.push(reporteCampo)
                        }
                    }
                }
                reporteAnual.map(function (campo) {
                    campo.asistencia_capacitacion = campo.asistencia_capacitacion / campo.count
                    campo.documentos_actualizados = campo.documentos_actualizados / campo.count
                    campo.trabajo_equipo = campo.trabajo_equipo / campo.count
                    campo.funciones_puntualidad = campo.funciones_puntualidad / campo.count
                    campo.higiene_personal = campo.higiene_personal / campo.count
                    campo.asistencia_reunion = campo.asistencia_reunion / campo.count
                    campo.ingreso_campo = campo.ingreso_campo / campo.count
                    campo.llenado_formularios = campo.llenado_formularios / campo.count
                    campo.total = campo.asistencia_capacitacion + campo.documentos_actualizados + campo.trabajo_equipo + campo.funciones_puntualidad + campo.higiene_personal + campo.asistencia_reunion + campo.ingreso_campo + campo.llenado_formularios
                })
                res.json({ reporte: reporteAnual })
            }).catch(function (err) {
                res.json({ reporte: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })

    ////////////////////////////////////////////////////////////////Reporte Anual de campo

    router.route('/reportes/anual/:anio/:campo')
        .get(function (req, res) {
            var condicionCampo = {}
            EvaluacionPolifuncional.findAll({
                where: { anio: req.params.anio },
                include: [{
                    model: MedicoPaciente, as: 'empleado', where: { campo: req.params.campo }
                }],
                order: [['mes', 'DESC']]
            }).then(function (evaluaciones) {
                var reportesCampo = []
                var reporteAnual = []
                evaluaciones.map(function (evaluacion) {
                    var reporte = {
                        mes: evaluacion.mes,
                        asistencia_capacitacion: evaluacion.asistencia_capacitacion,
                        documentos_actualizados: evaluacion.documentos_actualizados,
                        trabajo_equipo: evaluacion.trabajo_equipo,
                        funciones_puntualidad: evaluacion.funciones_puntualidad,
                        higiene_personal: evaluacion.higiene_personal,
                        asistencia_reunion: evaluacion.asistencia_reunion,
                        ingreso_campo: evaluacion.ingreso_campo,
                        llenado_formularios: evaluacion.llenado_formularios,
                        count: 1
                    }
                    reportesCampo.push(reporte)
                })
                while (reportesCampo.length > 0) {
                    if (reporteAnual.length == 0) {
                        reporteAnual.push(reportesCampo.pop())
                    } else {
                        var reporteCampo = reportesCampo.pop()
                        var indx = -1
                        var existe = reporteAnual.some(function (reporte, i) {
                            indx = i
                            return reporte.mes == reporteCampo.mes
                        })
                        if (existe) {
                            reporteAnual[indx].asistencia_capacitacion += reporteCampo.asistencia_capacitacion
                            reporteAnual[indx].documentos_actualizados += reporteCampo.documentos_actualizados
                            reporteAnual[indx].trabajo_equipo += reporteCampo.trabajo_equipo
                            reporteAnual[indx].funciones_puntualidad += reporteCampo.funciones_puntualidad
                            reporteAnual[indx].higiene_personal += reporteCampo.higiene_personal
                            reporteAnual[indx].asistencia_reunion += reporteCampo.asistencia_reunion
                            reporteAnual[indx].ingreso_campo += reporteCampo.ingreso_campo
                            reporteAnual[indx].llenado_formularios += reporteCampo.llenado_formularios
                            reporteAnual[indx].count += 1
                        } else {
                            reporteAnual.push(reporteCampo)
                        }
                    }
                }
                reporteAnual.map(function (campo) {
                    campo.asistencia_capacitacion = campo.asistencia_capacitacion / campo.count
                    campo.documentos_actualizados = campo.documentos_actualizados / campo.count
                    campo.trabajo_equipo = campo.trabajo_equipo / campo.count
                    campo.funciones_puntualidad = campo.funciones_puntualidad / campo.count
                    campo.higiene_personal = campo.higiene_personal / campo.count
                    campo.asistencia_reunion = campo.asistencia_reunion / campo.count
                    campo.ingreso_campo = campo.ingreso_campo / campo.count
                    campo.llenado_formularios = campo.llenado_formularios / campo.count
                    campo.total = campo.asistencia_capacitacion + campo.documentos_actualizados + campo.trabajo_equipo + campo.funciones_puntualidad + campo.higiene_personal + campo.asistencia_reunion + campo.ingreso_campo + campo.llenado_formularios
                })
                res.json({ reporte: reporteAnual })
            }).catch(function (err) {
                res.json({ reporte: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })

    ///////////////////////////////////////////////////// FIN RUTAS POLIFUNCIONAL /////////////////////////////////////////////////////
}

