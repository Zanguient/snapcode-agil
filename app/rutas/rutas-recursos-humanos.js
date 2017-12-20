module.exports = function (router, sequelize, Sequelize, Usuario, MedicoPaciente, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, decodeBase64Image, fs, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar) {
    router.route('/recursos-humanos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado')
        .get(function (req, res) {
            var condicion = ""
            var es_eliminado = "true"
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
                if (condicion.length > 1) {
                    if (req.params.estado == 1) {
                        condicion += " or gl_persona.activo like '%0%'"
                    } else {
                        condicion += " or gl_persona.activo like '%1%'"
                    }
                    c
                } else {
                    if (req.params.estado == 1) {
                        condicion += "gl_persona.activo like '%0%'"
                    } else {
                        condicion += "gl_persona.activo like '%1%'"
                    }
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
                sequelize.query("select count(*) as cantidad_pacientes from agil_medico_paciente INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) where eliminado = " + es_eliminado + " AND es_empleado = true AND (" + condicion + ")", { type: sequelize.QueryTypes.SELECT })
                    .then(function (data) {
                        var options = {
                            model: MedicoPaciente,
                            include: [{ model: Persona, as: 'persona' }]
                        };
                        Sequelize.Model.$validateIncludedElements(options);
                        sequelize.query("select  gl_persona.id as id_persona ,agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                    agil_medico_paciente.empresa as 'id_empresa', agil_medico_paciente.extension as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                    agil_medico_paciente.cargo as 'cargo', agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa', agil_medico_paciente.comentario as 'comentario', \
                    gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                    gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', gl_persona.activo as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    from agil_medico_paciente INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id)\
                    where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + es_eliminado + " AND agil_medico_paciente.es_empleado = true AND (" + condicion + ") \
                    GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion + " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina, options)
                            .then(function (pacientes) {
                                res.json({ pacientes: pacientes, paginas: Math.ceil(data[0].cantidad_pacientes / req.params.items_pagina) });
                            });
                    });
            } else {
                sequelize.query("select count(*) as cantidad_pacientes from agil_medico_paciente where eliminado = " + es_eliminado + " AND es_empleado = true", { type: sequelize.QueryTypes.SELECT })
                    .then(function (data) {
                        var options = {
                            model: MedicoPaciente,
                            include: [{ model: Persona, as: 'persona' }]
                        };
                        Sequelize.Model.$validateIncludedElements(options);
                        sequelize.query("select gl_persona.id as id_persona, agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                    agil_medico_paciente.empresa as 'id_empresa', agil_medico_paciente.extension as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                    agil_medico_paciente.cargo as 'cargo', agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                    gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                    gl_persona.nombres as 'nombres',gl_persona.imagen as 'imagen', gl_persona.activo as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    from agil_medico_paciente INNER JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id)\
                    where agil_medico_paciente.empresa = "+ req.params.id_empresa + " AND agil_medico_paciente.eliminado = " + es_eliminado + " AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina, options)
                            .then(function (pacientes) {
                                res.json({ pacientes: pacientes, paginas: Math.ceil(data[0].cantidad_pacientes / req.params.items_pagina) });
                            });
                    });
            }
        })
    router.route('/recursos-humanos/:id_usuario')
        .get(function (req, res) {
            MedicoPaciente.find({
                where: {
                    id: req.params.id_usuario
                },
                include: [{ model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }
                    // { model: Empresa, as: 'empresa'},{model:MedicoPrerequisito, as: 'prerequisitos',include: [{ model: Clase, as: 'prerequisitoClase' }]}
                ]
            }).then(function (medicoPaciente) {
                res.json(medicoPaciente);
            });
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
                                    extension: req.body.extension,
                                    grupo_sanguineo: req.body.grupo_sanguineo,
                                    cargo: req.body.cargo,
                                    campo: req.body.campo,
                                    designacion_empresa: req.body.designacion_empresa,
                                    eliminado: true,
                                    es_empleado: req.body.es_empleado
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
                                    extension: req.body.extension,
                                    grupo_sanguineo: req.body.grupo_sanguineo,
                                    cargo: req.body.cargo,
                                    campo: req.body.campo,
                                    designacion_empresa: req.body.designacion_empresa,
                                    eliminado: req.body.eliminado,
                                    es_empleado: req.body.es_empleado
                                }, {
                                        where: { id: req.params.id_paciente }

                                    }).then(function (medicoPacienteActualizado) {
                                        res.json({ mensaje: "Actualizado Satisfactoriamente" });
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
    router.route('/usuario-recurso-humano/:id_persona')
        .put(function (req, res) {
            Persona.update({
                activo: req.body.activo
            }, {
                    where: {
                        id: req.params.id_persona
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
                    include: [{ model: RrhhEmpleadoFichaFamiliar, as: 'familiares',include:[{model:Clase,as:'relacion'},{model:Persona,as:'persona',include: [{ model: Clase, as: 'genero' }]}] },
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
                        include: [{ model: RrhhEmpleadoFichaFamiliar, as: 'familiares' ,include:[{model:Clase,as:'relacion'},{model:Persona,as:'persona',include: [{ model: Clase, as: 'genero' }]}]},
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
                        cargo: req.body.empleado.cargo,
                        eid_extension: req.body.empleado.extension.id,
                        id_tipo_documento: req.body.empleado.tipoDocumento.id,
                        fecha_vence_documento: req.body.empleado.fecha_vence_documento,
                    }, {
                            where: {
                                id: req.body.empleado.id
                            }
                        }).then(function (medicoPacienteActualizado) {
                            Persona.update({
                                nombres: req.body.empleado.persona.nombres,
                                apellido_paterno: req.body.empleado.persona.apellido_paterno,
                                apellido_materno: req.body.empleado.persona.apellido_materno,
                                ci: req.body.empleado.persona.ci,
                                id_genero: req.body.empleado.persona.id_genero,
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
                                fecha_nacimiento:req.body.empleado.persona.fecha_nacimiento
                            }, {
                                    where: {
                                        id: req.body.empleado.persona.id
                                    }
                                }).then(function (EmpleadoPersonaActualizado) {
                                    var haber = parseFloat(req.body.haber_basico)
                                    RrhhEmpleadoFicha.create({
                                        id_empleado: req.body.empleado.id,
                                        fecha: req.body.fecha_elaboracion,
                                        codigo_empleado: req.body.codigo_empleado,
                                        id_tipo_contrato: req.body.tipoContrato.id,
                                        fecha_inicio: req.body.fecha_inicio,
                                        fecha_fin: req.body.fecha_fin,
                                        id_tipo_personal: req.body.tipoPersonal.id,
                                        id_carga_horarios: req.body.cargaHorario.id,
                                        id_area: req.body.area.id,
                                        id_ubicacion: req.body.ubicacion.id,
                                        haber_basico: haber,
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
                                        req.body.empleado.otrosSeguros.forEach(function (seguroSalud, index, array) {
                                            if (seguroSalud.id) {
                                                RrhhEmpleadoFichaOtrosSeguros.update({
                                                    id_empleado: req.body.empleado.id,
                                                    id_tipo_seguro: seguroSalud.tipoSeguro.id,
                                                    monto: seguroSalud.monto,
                                                    observacion: seguroSalud.observacion,
                                                }, {
                                                        where: { id: seguroSalud.id }
                                                    }).then(function (seguroCreado) {
                                                        if (index === (array.length - 1)) {
                                                            req.body.empleado.familiares.forEach(function (familiar, index, array) {
                                                                if (familiar.persona.id) {
                                                                    Persona.update({
                                                                        nombres: familiar.persona.nombres,
                                                                        apellido_paterno: familiar.persona.apellido_paterno,
                                                                        apellido_materno: familiar.persona.apellido_materno,
                                                                        fecha_nacimiento: familiar.persona.fecha_nacimiento,
                                                                        genero: familiar.persona.genero.id,
                                                                    }, {
                                                                            where: {
                                                                                id: familiar.persona.id
                                                                            }
                                                                        }).then(function (personaActualizada) {
                                                                            if (familiar.id) {
                                                                                RrhhEmpleadoFichaFamiliar.update({
                                                                                    id_empleado: req.body.empleado.id,
                                                                                    id_persona_familiar: familiar.persona.id,
                                                                                    id_relacion: familiar.relacion.id,
                                                                                    afiliado: familiar.persona.afiliado,
                                                                                }, {
                                                                                        where: { id: familiar.id }
                                                                                    }).then(function (empleadoFamiliarActulizado) {
                                                                                        if (index === (array.length - 1)) {
                                                                                            res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                        }
                                                                                    })
                                                                            } else {
                                                                                RrhhEmpleadoFichaFamiliar.create({
                                                                                    id_empleado: req.body.empleado.id,
                                                                                    id_persona_familiar: familiar.persona.id,
                                                                                    id_relacion: familiar.relacion.id,
                                                                                    afiliado: familiar.persona.afiliado,
                                                                                }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                                    if (index === (array.length - 1)) {
                                                                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                } else {
                                                                    Persona.create({
                                                                        nombres: familiar.persona.nombres,
                                                                        apellido_paterno: familiar.persona.apellido_paterno,
                                                                        apellido_materno: familiar.persona.apellido_materno,
                                                                        fecha_nacimiento: familiar.persona.fecha_nacimiento,
                                                                        genero: familiar.persona.genero.id,
                                                                    }).then(function (personaCreada) {
                                                                        if (familiar.id) {
                                                                            RrhhEmpleadoFichaFamiliar.update({
                                                                                id_empleado: req.body.empleado.id,
                                                                                id_persona_familiar: personaCreada.id,
                                                                                id_relacion: familiar.relacion.id,
                                                                                afiliado: familiar.persona.afiliado,
                                                                            }, {
                                                                                    where: { id: familiar.id }
                                                                                }).then(function (empleadoFamiliarActulizado) {
                                                                                    if (index === (array.length - 1)) {
                                                                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                    }
                                                                                })
                                                                        } else {
                                                                            RrhhEmpleadoFichaFamiliar.create({
                                                                                id_empleado: req.body.empleado.id,
                                                                                id_persona_familiar: personaCreada.id,
                                                                                id_relacion: familiar.relacion.id,
                                                                                afiliado: familiar.persona.afiliado,
                                                                            }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                                if (index === (array.length - 1)) {
                                                                                    res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }

                                                            });

                                                        }
                                                    })
                                            } else {
                                                RrhhEmpleadoFichaOtrosSeguros.create({
                                                    id_empleado: req.body.empleado.id,
                                                    id_tipo_seguro: seguroSalud.tipoSeguro.id,
                                                    monto: seguroSalud.monto,
                                                    observacion: seguroSalud.observacion,
                                                }).then(function (seguroCreado) {
                                                    if (index === (array.length - 1)) {
                                                        req.body.empleado.familiares.forEach(function (familiar, index, array) {
                                                            if (familiar.persona.id) {
                                                                Persona.update({
                                                                    nombres: familiar.persona.nombres,
                                                                    apellido_paterno: familiar.persona.telefono,
                                                                    apellido_materno: familiar.persona.direecion,
                                                                    fecha_nacimiento: familiar.persona.fecha_nacimiento,
                                                                    genero: familiar.persona.genero.id,
                                                                }, {
                                                                        where: {
                                                                            id: familiar.persona.id
                                                                        }
                                                                    }).then(function (personaActualizada) {
                                                                        if (familiar.id) {
                                                                            RrhhEmpleadoFichaFamiliar.update({
                                                                                id_empleado: req.body.empleado.id,
                                                                                id_persona_familiar: familiar.persona.id,
                                                                                id_relacion: familiar.relacion.id,
                                                                                afiliado: familiar.persona.afiliado,
                                                                            }, {
                                                                                    where: { id: familiar.id }
                                                                                }).then(function (empleadoFamiliarActulizado) {
                                                                                    if (index === (array.length - 1)) {
                                                                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                    }
                                                                                })
                                                                        } else {
                                                                            RrhhEmpleadoFichaFamiliar.create({
                                                                                id_empleado: req.body.empleado.id,
                                                                                id_persona_familiar: familiar.persona.id,
                                                                                id_relacion: familiar.relacion.id,
                                                                                afiliado: familiar.persona.afiliado,
                                                                            }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                                if (index === (array.length - 1)) {
                                                                                    res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                            } else {
                                                                Persona.create({
                                                                    nombres: familiar.persona.nombres,
                                                                    apellido_paterno: familiar.persona.telefono,
                                                                    apellido_materno: familiar.persona.direecion,
                                                                    fecha_nacimiento: familiar.persona.fecha_nacimiento,
                                                                    genero: familiar.persona.genero.id,
                                                                }).then(function (personaCreada) {
                                                                    if (familiar.id) {
                                                                        RrhhEmpleadoFichaFamiliar.update({
                                                                            id_empleado: req.body.empleado.id,
                                                                            id_persona_familiar: personaCreada.id,
                                                                            id_relacion: familiar.relacion.id,
                                                                            afiliado: familiar.persona.afiliado,
                                                                        }, {
                                                                                where: { id: familiar.id }
                                                                            }).then(function (empleadoFamiliarActulizado) {
                                                                                if (index === (array.length - 1)) {
                                                                                    res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                }
                                                                            })
                                                                    } else {
                                                                        RrhhEmpleadoFichaFamiliar.create({
                                                                            id_empleado: req.body.empleado.id,
                                                                            id_persona_familiar: personaCreada.id,
                                                                            id_relacion: familiar.relacion.id,
                                                                            afiliado: familiar.persona.afiliado,
                                                                        }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                            if (index === (array.length - 1)) {
                                                                                res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }

                                                        });

                                                    }
                                                })
                                            }
                                        })

                                    });
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

                        MedicoPaciente.update({
                            cargo: req.body.empleado.cargo,
                            id_extension: req.body.empleado.extension.id,
                            id_tipo_documento: req.body.empleado.tipoDocumento.id,
                            fecha_vence_documento: req.body.empleado.fecha_vence_documento,
                        }, {
                                where: {
                                    id: req.body.empleado.id
                                }
                            }).then(function (medicoPacienteActualizado) {
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
                                    fecha_nacimiento:req.body.empleado.persona.fecha_nacimiento
                                }, {
                                        where: {
                                            id: req.body.empleado.persona.id
                                        }
                                    }).then(function (MedicoPasientePersonaActualizado) {
                                        var haber = parseFloat(req.body.haber_basico)
                                        RrhhEmpleadoFicha.create({
                                            id_empleado: req.body.empleado.id,
                                            fecha: req.body.fecha_elaboracion,
                                            codigo_empleado: req.body.codigo_empleado,
                                            id_tipo_contrato: req.body.tipoContrato.id,
                                            fecha_inicio: req.body.fecha_inicio,
                                            fecha_fin: req.body.fecha_fin,
                                            id_tipo_personal: req.body.tipoPersonal.id,
                                            id_carga_horarios: req.body.cargaHorario.id,
                                            id_area: req.body.area.id,
                                            id_ubicacion: req.body.ubicacion.id,
                                            haber_basico: haber,
                                            //contrato: req.body.alergia_quimico,
                                            jubilacion: req.body.jubilacion,
                                            fecha_jubilacion: req.body.fecha_jubilacion,
                                            id_persona_referencia: req.body.personaReferencia.id,
                                            matricula_seguro: req.body.matricula_seguro,
                                            id_seguro_salud: req.body.seguroSalud.id,
                                            id_lugar_seguro_salud: req.body.lugarSeguroSalud.id,
                                            seguro_salud_carnet: req.body.seguro_salud_carnet,
                                            nua_seguro_largo_plazo: req.body.nua_seguro_largo_plazo,
                                            id_aporte_seguro_largo_plazo: req.body.aporteSeguroLargoPlazo.id,
                                            id_lugar_seguro_largo_plazo: req.body.lugarSeguroLargoPlazo.id,
                                            numero_cuenta: req.body.numero_cuenta,
                                            id_banco: req.body.banco.id,
                                        }).then(function (RrhhEmpleadoFichaCreado) {
                                            req.body.empleado.otrosSeguros.forEach(function (seguroSalud, index, array) {
                                                if (seguroSalud.id) {

                                                    RrhhEmpleadoFichaOtrosSeguros.update({
                                                        id_empleado: req.body.empleado.id,
                                                        id_tipo_seguro: seguroSalud.tipoSeguro.id,
                                                        monto: seguroSalud.monto,
                                                        observacion: seguroSalud.observacion,
                                                    }, {
                                                            where: { id: seguroSalud.id }
                                                        }).then(function (seguroCreado) {
                                                            if (index === (array.length - 1)) {
                                                                req.body.empleado.familiares.forEach(function (familiar, index, array) {
                                                                    if (familiar.persona.id) {
                                                                        Persona.update({
                                                                            nombres: familiar.persona.nombres,
                                                                            apellido_paterno: familiar.persona.telefono,
                                                                            apellido_materno: familiar.persona.direecion,
                                                                            fecha_nacimiento: familiar.persona.fecha_nacimiento,
                                                                            id_genero: familiar.persona.genero.id,
                                                                        }, {
                                                                                where: {
                                                                                    id: familiar.persona.id
                                                                                }
                                                                            }).then(function (personaActualizada) {
                                                                                if (familiar.id) {
                                                                                    RrhhEmpleadoFichaFamiliar.update({
                                                                                        id_empleado: req.body.empleado.id,
                                                                                        id_persona_familiar: familiar.persona.id,
                                                                                        id_relacion: familiar.relacion.id,
                                                                                        afiliado: familiar.persona.afiliado,
                                                                                    }, {
                                                                                            where: { id: familiar.id }
                                                                                        }).then(function (empleadoFamiliarActulizado) {
                                                                                            if (index === (array.length - 1)) {
                                                                                                res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                            }
                                                                                        })
                                                                                } else {
                                                                                    RrhhEmpleadoFichaFamiliar.create({
                                                                                        id_empleado: req.body.empleado.id,
                                                                                        id_persona_familiar: familiar.persona.id,
                                                                                        id_relacion: familiar.relacion.id,
                                                                                        afiliado: familiar.persona.afiliado,
                                                                                    }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                                        if (index === (array.length - 1)) {
                                                                                            res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                    } else {
                                                                        Persona.create({
                                                                            nombres: familiar.persona.nombres,
                                                                            apellido_paterno: familiar.persona.apellido_paterno,
                                                                            apellido_materno: familiar.persona.apellido_materno,
                                                                            fecha_nacimiento: familiar.persona.fecha_nacimiento,
                                                                            id_genero: familiar.persona.genero.id,
                                                                        }).then(function (personaCreada) {
                                                                            if (familiar.id) {
                                                                                RrhhEmpleadoFichaFamiliar.update({
                                                                                    id_empleado: req.body.empleado.id,
                                                                                    id_persona_familiar: personaCreada.id,
                                                                                    id_relacion: familiar.relacion.id,
                                                                                    afiliado: familiar.persona.afiliado,
                                                                                }, {
                                                                                        where: { id: familiar.id }
                                                                                    }).then(function (empleadoFamiliarActulizado) {
                                                                                        if (index === (array.length - 1)) {
                                                                                            res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                        }
                                                                                    })
                                                                            } else {
                                                                                RrhhEmpleadoFichaFamiliar.create({
                                                                                    id_empleado: req.body.empleado.id,
                                                                                    id_persona_familiar: personaCreada.id,
                                                                                    id_relacion: familiar.relacion.id,
                                                                                    afiliado: familiar.persona.afiliado,
                                                                                }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                                    if (index === (array.length - 1)) {
                                                                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }

                                                                });

                                                            }
                                                        })
                                                } else {
                                                    RrhhEmpleadoFichaOtrosSeguros.create({
                                                        id_empleado: req.body.empleado.id,
                                                        id_tipo_seguro: seguroSalud.tipoSeguro.id,
                                                        monto: seguroSalud.monto,
                                                        observacion: seguroSalud.observacion,
                                                    }).then(function (seguroCreado) {
                                                        if (index === (array.length - 1)) {
                                                            req.body.empleado.familiares.forEach(function (familiar, index, array) {
                                                                if (familiar.persona.id) {
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
                                                                            if (familiar.id) {
                                                                                RrhhEmpleadoFichaFamiliar.update({
                                                                                    id_empleado: req.body.empleado.id,
                                                                                    id_persona_familiar: familiar.persona.id,
                                                                                    id_relacion: familiar.relacion.id,
                                                                                    afiliado: familiar.persona.afiliado,
                                                                                }, {
                                                                                        where: { id: familiar.id }
                                                                                    }).then(function (empleadoFamiliarActulizado) {
                                                                                        if (index === (array.length - 1)) {
                                                                                            res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                        }
                                                                                    })
                                                                            } else {
                                                                                RrhhEmpleadoFichaFamiliar.create({
                                                                                    id_empleado: req.body.empleado.id,
                                                                                    id_persona_familiar: familiar.persona.id,
                                                                                    id_relacion: familiar.relacion.id,
                                                                                    afiliado: familiar.persona.afiliado,
                                                                                }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                                    if (index === (array.length - 1)) {
                                                                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                } else {
                                                                    Persona.create({
                                                                        nombres: familiar.persona.nombres,
                                                                        apellido_paterno: familiar.persona.apellido_paterno,
                                                                        apellido_materno: familiar.persona.apellido_materno,
                                                                        fecha_nacimiento: familiar.persona.fecha_nacimiento,
                                                                        id_genero: familiar.persona.genero.id,
                                                                    }).then(function (personaCreada) {
                                                                        if (familiar.id) {
                                                                            RrhhEmpleadoFichaFamiliar.update({
                                                                                id_empleado: req.body.empleado.id,
                                                                                id_persona_familiar: personaCreada.id,
                                                                                id_relacion: familiar.relacion.id,
                                                                                afiliado: familiar.persona.afiliado,
                                                                            }, {
                                                                                    where: { id: familiar.id }
                                                                                }).then(function (empleadoFamiliarActulizado) {
                                                                                    if (index === (array.length - 1)) {
                                                                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                    }
                                                                                })
                                                                        } else {
                                                                            RrhhEmpleadoFichaFamiliar.create({
                                                                                id_empleado: req.body.empleado.id,
                                                                                id_persona_familiar: personaCreada.id,
                                                                                id_relacion: familiar.relacion.id,
                                                                                afiliado: familiar.persona.afiliado,
                                                                            }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                                if (index === (array.length - 1)) {
                                                                                    res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }

                                                            });

                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    })
                            })
                    })

            }
        })
}