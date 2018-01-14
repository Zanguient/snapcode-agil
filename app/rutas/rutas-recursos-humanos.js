module.exports = function (router, sequelize, Sequelize, Usuario, MedicoPaciente, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, decodeBase64Image, fs, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad
    , RrhhEmpleadoCargo, RrhhEmpleadoHojaVida, RrhhEmpleadoFormacionAcademica, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna, NumeroLiteral) {
    router.route('/recursos-humanos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado')
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

                    activo = "false"

                } else {
                    activo = "true"
                }
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
                where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + activo + " AND (" + condicion + ") \
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
                    from agil_medico_paciente "+ condicionContrato + " INNER JOIN agil_rrhh_empleado_cargo AS cargos ON agil_medico_paciente.id = cargos.empleado " + condicionCargo + " \
                    LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) INNER JOIN gl_clase ON (agil_medico_paciente.extension = gl_clase.id)\
                    where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + activo + " AND (" + condicion + ") \
                    GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion + limite, options)
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
                                                include: [{ model: Clase, as: 'tipoContrato' }]
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
                where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + activo + " AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion, { type: sequelize.QueryTypes.SELECT })
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
                    where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + activo + " AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + limite, options)
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
                                                include: [{ model: Clase, as: 'tipoContrato' }]
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
                if (medicoPaciente.empleadosFichas[0] != undefined) {
                    if (medicoPaciente.empleadosFichas[0].length > 0) {
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
                                        if (req.body.cargos.length > 0) {
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
                                                id_empleado: medicoPacienteCreado.id,
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
            var mn = (req.body.activo == true) ? false : true
            MedicoPaciente.update({
                eliminado: req.body.activo
            }, {
                    where: {
                        id: mn
                    }
                }).then(function (personaActualizada) {
                    var mn = (req.body.activo == true) ? 'activo' : 'inactivo'
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

                    MedicoPaciente.update({

                        id_extension: req.body.empleado.extension.id,
                        id_tipo_documento: req.body.empleado.tipoDocumento.id,
                        fecha_vence_documento: req.body.empleado.fecha_vence_documento,
                    }, {
                            where: {
                                id: req.body.empleado.id
                            }
                        }).then(function (medicoPacienteActualizado) {
                            guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad)
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
                            })
                    })

            }
        })

    function guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad) {

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
            id_ciudad_nacimiento: req.body.empleado.persona.ciudad.id,
            id_provincia_nacimiento: req.body.empleado.persona.provincia.id,
            id_localidad_nacimiento: req.body.empleado.persona.localidad.id,
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
                    codigo_empleado: req.body.codigo_empleado,
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
                });
            })
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
                            })
                    } else {
                        RrhhEmpleadoFichaOtrosSeguros.destroy({
                            where: {
                                id: seguroSalud.id
                            },
                        }).then(function (SeguroEliminado) {
                            if (index === (array.length - 1)) {
                                guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo)

                            }
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
                    })
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
                                    })

                            })
                    } else {
                        RrhhEmpleadoFichaFamiliar.destroy({
                            where: {
                                id:familiar.id
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
                            });
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
                        })

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
                                        guardarSeguros(RrhhEmpleadoDiscapacidad, req.body.empleado.discapacidades, req.body.empleado, res)
                                    }
                                })

                        } else {
                            if (index === (array.length - 1)) {
                                guardarSeguros(RrhhEmpleadoDiscapacidad, req.body.empleado.discapacidades, req.body.empleado, res)
                            }
                        }
                    })
                });
            } else {
                guardarSeguros(RrhhEmpleadoDiscapacidad, req.body.empleado.discapacidades, req.body.empleado, res)
            }
        })
    }
    function guardarSeguros(RrhhEmpleadoDiscapacidad, discapacidades, empleado, res) {
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
                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                    }
                                })

                        } else {
                            if (index === (array.length - 1)) {
                                res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                            }
                        }
                    })

                })
            } else {
                res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
            }
        })
    }
    router.route('/usuario-ficha/:id_empleado')
        .get(function (req, res) {
            RrhhEmpleadoFicha.findAll({
                where: { id_empleado: req.params.id_empleado },

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


}
