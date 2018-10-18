module.exports = function (router, sequelize, Sequelize, Usuario, MedicoPaciente, Persona, Empresa, Sucursal, Clase, Diccionario, Tipo, decodeBase64Image, fs, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad
    , RrhhEmpleadoCargo, RrhhEmpleadoHojaVida, RrhhEmpleadoFormacionAcademica, RrhhEmpleadoExperienciaLaboral, RrhhEmpleadoLogroInternoExterno, RrhhEmpleadoCapacidadInternaExterna, NumeroLiteral, RrhhEmpleadoPrestamo, RrhhEmpleadoPrestamoPago, RrhhEmpleadoRolTurno, RrhhEmpleadoHorasExtra, RrhhAnticipo,
    EvaluacionPolifuncional, ConfiguracionCalificacionEvaluacionPolifuncional, ConfiguracionDesempenioEvaluacionPolifuncional, RrhhEmpleadoAusencia, RrhhEmpleadoVacaciones, RrhhEmpleadoCompensacionAusencia, RrhhFeriado, RrhhClaseAsuencia, RrhhEmpleadoConfiguracionVacacion, RrhhEmpleadoHistorialVacacion, RrhhEmpleadoTr3, RrhhEmpleadoAnticipoTr3, Banco, RrhhEmpleadoDeduccionIngreso,
    RrhhEmpleadoBeneficioSocial, RrhhEmpleadoBitacoraFicha, RrhhEmpleadoConfiguracionRopa, Producto, Inventario, RrhhEmpleadoDotacionRopaItem, RrhhEmpleadoDotacionRopa, RrhhViajeDetalle, RrhhViaje, RrhhViajeDestino, RrhhViajeConductor, Movimiento, DetalleMovimiento, Almacen, RrhhEmpleadoDescuentoVacacionHistorial) {

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
                    condicion += " or campo =" + req.params.campo
                } else {
                    condicion += "campo =" + req.params.campo
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
                estado.nombre as 'estado', gl_persona.nombres as 'nombres',gl_persona.direccion_zona as 'direccion',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                ,campamento.nombre as 'campamento',fichas.fecha_inicio as 'fecha_inicio',fichas.fecha_expiracion as 'fecha_expiracion',fichas.haber_basico as 'haber_basico',fichas.id as 'id_ficha',contrato.nombre as 'tipoContrato', GROUP_CONCAT(`cargos.cargo`.nombre order by `cargos.cargo`.id) cargos from agil_medico_paciente "+ condicionContrato + " JOIN agil_rrhh_empleado_ficha AS fichas ON fichas.id=( select agil_rrhh_empleado_ficha.id from agil_rrhh_empleado_ficha where  agil_rrhh_empleado_ficha.id_empleado =  agil_medico_paciente.id order by id desc limit 1) INNER JOIN gl_clase AS contrato ON fichas.tipo_contrato = contrato.id INNER JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
                    LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id left JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) left JOIN gl_clase ON agil_medico_paciente.extension = gl_clase.id left JOIN gl_clase as estado ON gl_persona.genero = estado.id\
                    left JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND (" + condicion + ") \
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
                    estado.nombre as 'estado', gl_persona.nombres as 'nombres',gl_persona.direccion_zona as 'direccion',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    ,campamento.nombre as 'campamento',fichas.fecha_inicio as 'fecha_inicio',fichas.fecha_expiracion as 'fecha_expiracion',fichas.haber_basico as 'haber_basico',fichas.id as 'id_ficha',contrato.nombre as 'tipoContrato', GROUP_CONCAT(`cargos.cargo`.nombre order by `cargos.cargo`.id) cargos from agil_medico_paciente "+ condicionContrato + " JOIN agil_rrhh_empleado_ficha AS fichas ON fichas.id=( select agil_rrhh_empleado_ficha.id from agil_rrhh_empleado_ficha where  agil_rrhh_empleado_ficha.id_empleado =  agil_medico_paciente.id order by id desc limit 1) left JOIN gl_clase AS contrato ON fichas.tipo_contrato = contrato.id INNER JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
                    LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id left JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) left JOIN gl_clase ON agil_medico_paciente.extension = gl_clase.id left JOIN gl_clase as estado ON gl_persona.genero = estado.id\
                    left JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND (" + condicion + ") \
                    AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by "+ req.params.columna + " " + req.params.direccion + limite, { type: sequelize.QueryTypes.SELECT })
                            .then(function (pacientes) {

                                res.json({ pacientes: pacientes, paginas: Math.ceil(data.length / req.params.items_pagina) });

                            });
                    });
            } else {
                sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                agil_medico_paciente.empresa as 'id_empresa', gl_clase.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                estado.nombre as 'estado', gl_persona.nombres as 'nombres',gl_persona.direccion_zona as 'direccion',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                ,campamento.nombre as 'campamento',fichas.fecha_inicio as 'fecha_inicio',fichas.fecha_expiracion as 'fecha_expiracion',fichas.haber_basico as 'haber_basico',fichas.id as 'id_ficha',contrato.nombre as 'tipoContrato', GROUP_CONCAT(`cargos.cargo`.nombre order by `cargos.cargo`.id) cargos from agil_medico_paciente "+ condicionContrato + " JOIN agil_rrhh_empleado_ficha AS fichas ON fichas.id=( select agil_rrhh_empleado_ficha.id from agil_rrhh_empleado_ficha where  agil_rrhh_empleado_ficha.id_empleado =  agil_medico_paciente.id order by id desc limit 1) left JOIN gl_clase AS contrato ON fichas.tipo_contrato = contrato.id INNER JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
                    LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id left JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) left JOIN gl_clase ON agil_medico_paciente.extension = gl_clase.id left JOIN gl_clase as estado ON gl_persona.genero = estado.id\
                    left JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion, { type: sequelize.QueryTypes.SELECT })
                    .then(function (data) {
                        var options = {
                            model: MedicoPaciente,
                            include: [{ model: Persona, as: 'persona' },
                            { model: Clase, as: 'extension' }]
                        };
                        Sequelize.Model.$validateIncludedElements(options);
                        sequelize.query("select DISTINCT agil_medico_paciente.id as 'id',agil_medico_paciente.es_empleado as 'es_empleado', agil_medico_paciente.persona as 'id_persona',agil_medico_paciente.codigo as 'codigo',\
                    agil_medico_paciente.empresa as 'id_empresa', extencion.nombre as 'extension', agil_medico_paciente.grupo_sanguineo as 'grupo_sanguineo',\
                    agil_medico_paciente.campo as 'campo', agil_medico_paciente.designacion_empresa as 'designacion_empresa',agil_medico_paciente.comentario as 'comentario',\
                    gl_persona.nombre_completo as 'nombre_completo', gl_persona.apellido_paterno as 'apellido_paterno', gl_persona.apellido_materno as 'apellido_materno',\
                    estado.nombre as 'estado', gl_persona.nombres as 'nombres',gl_persona.direccion_zona as 'direccion',gl_persona.imagen as 'imagen', agil_medico_paciente.eliminado as 'activo', gl_persona.ci as 'ci', gl_persona.genero as 'id_genero', \
                    gl_persona.telefono as 'telefono', gl_persona.telefono_movil as 'telefono_movil', gl_persona.fecha_nacimiento as 'fecha_nacimiento'\
                    ,campamento.nombre as 'campamento',fichas.fecha_inicio as 'fecha_inicio',fichas.fecha_expiracion as 'fecha_expiracion',fichas.haber_basico as 'haber_basico',fichas.id as 'id_ficha',contrato.nombre as 'tipoContrato', GROUP_CONCAT(`cargos.cargo`.nombre order by `cargos.cargo`.id) cargos from agil_medico_paciente "+ condicionContrato + " JOIN agil_rrhh_empleado_ficha AS fichas ON fichas.id=( select agil_rrhh_empleado_ficha.id from agil_rrhh_empleado_ficha where  agil_rrhh_empleado_ficha.id_empleado =  agil_medico_paciente.id order by id desc limit 1) left JOIN gl_clase AS contrato ON fichas.tipo_contrato = contrato.id INNER JOIN agil_rrhh_empleado_cargo AS cargos ON fichas.id = cargos.ficha  " + condicionCargo + " \
                    LEFT OUTER JOIN gl_clase AS `cargos.cargo` ON cargos.cargo = `cargos.cargo`.id  left JOIN gl_persona ON (agil_medico_paciente.persona = gl_persona.id) left JOIN gl_clase as extencion ON agil_medico_paciente.extension = extencion.id left JOIN gl_clase as estado ON gl_persona.estado_civil = estado.id\
                    left JOIN gl_clase as campamento ON agil_medico_paciente.campo = campamento.id where agil_medico_paciente.empresa = "+ req.params.id_empresa + activo + " AND agil_medico_paciente.es_empleado = true GROUP BY agil_medico_paciente.id order by " + req.params.columna + " " + req.params.direccion + limite, { type: sequelize.QueryTypes.SELECT }/* , options */)
                            .then(function (pacientes) {
                                res.json({ pacientes: pacientes, paginas: Math.ceil(data.length / req.params.items_pagina) });
                            });
                    });
            }

        })
    router.route('/recursos-humanos-familiar/empresa/:id_empresa')
        .get(function (req, res) {
            RrhhEmpleadoFichaFamiliar.findAll({
                include: [{ model: Clase, as: 'relacion' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }, {
                    model: MedicoPaciente, as: "empleado", where: { id_empresa: req.params.id_empresa }, include: [{ model: Empresa, as: 'empresa' }, { model: Clase, as: 'campo' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', include: [{ model: Clase, as: "aporteSeguroLargoPlazo" }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }] }, { model: Clase, as: 'extension' }, {
                        model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' },
                        { model: Clase, as: 'pais' },
                        { model: Clase, as: 'ciudad' },
                        { model: Clase, as: 'provincia' },
                        { model: Clase, as: 'localidad' },
                        { model: Clase, as: 'estadoCivil' }]
                    }]
                }]
            }).then(function (FamiliaresEncontrados) {
                res.json(FamiliaresEncontrados);
            });
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
                include: [{ model: Clase, as: 'campo' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: "cargo" }] }] }, { model: Clase, as: 'extension' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }
                    // { model: Empresa, as: 'empresa'},{model:MedicoPrerequisito, as: 'prerequisitos',include: [{ model: Clase, as: 'prerequisitoClase' }]}
                ]
            }).then(function (medicoPaciente) {
                if (medicoPaciente.empleadosFichas != undefined) {
                    if (medicoPaciente.empleadosFichas.length > 0) {
                        Clase.find({
                            where: {
                                id: medicoPaciente.empleadosFichas[(medicoPaciente.empleadosFichas.length - 1)].id_tipo_contrato
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
                                    id_campo: req.body.campo.id,
                                    designacion_empresa: req.body.designacion_empresa,
                                    eliminado: false,
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
                                                    /* id_empleado: medicoPacienteCreado.id, */
                                                    id_cargo: cargo.id,
                                                    id_ficha: Creado.id
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
                                    id_campo: req.body.campo.id,
                                    designacion_empresa: req.body.designacion_empresa,
                                    eliminado: req.body.eliminado,
                                    es_empleado: req.body.es_empleado
                                }, {
                                        where: { id: req.body.id }

                                    }).then(function (medicoPacienteActualizado) {
                                        RrhhEmpleadoCargo.destroy({
                                            where: {
                                                id_ficha: req.body.empleadosFichas[req.body.empleadosFichas.length - 1].id,
                                            }
                                        }).then(function (EmpleadoCargosActualizada) {
                                            /*  RrhhEmpleadoFicha.create({
                                                 fecha: req.body.fechaFicha,
                                                 id_empleado: req.body.id,
                                                 id_tipo_contrato: req.body.tipo_contrato.id,
                                             }).then(function (Creado) { */
                                            if (req.body.cargos.length > 0) {
                                                req.body.cargos.forEach(function (cargo, index, array) {
                                                    RrhhEmpleadoCargo.findOrCreate({
                                                        where: { id_ficha: req.body.empleadosFichas[req.body.empleadosFichas.length - 1].id, id_cargo: cargo.id },
                                                        defaults: {
                                                            /*   id_empleado: req.body.id, */
                                                            id_cargo: cargo.id,
                                                            id_ficha: req.body.empleadosFichas[req.body.empleadosFichas.length - 1].id,
                                                        }
                                                    }).spread(function (cargoEncontrado, created) {
                                                        if (!created) {
                                                            RrhhEmpleadoCargo.update({
                                                                /* id_empleado: req.body.id, */
                                                                id_cargo: cargo.id,
                                                                id_ficha: req.body.empleadosFichas[req.body.empleadosFichas.length - 1].id,
                                                            }, {
                                                                    where: { id_ficha: req.body.empleadosFichas[req.body.empleadosFichas.length - 1].id, id_cargo: cargo.id }
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
                                            /* }) */


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
                    if (req.body.nueva_fecha_expiracion) {
                        RrhhEmpleadoFicha.update({
                            fecha_expiracion: req.body.nueva_fecha_expiracion,

                        }, {
                                where: { id: req.body.id_ficha }
                            }).then(function (fichaActualizada) {
                                RrhhEmpleadoBeneficioSocial.create({
                                    id_ficha: req.body.id_ficha,
                                    tipo_beneficio: true,
                                    fecha_retiro: req.body.nueva_fecha_expiracion,
                                    id_motivo: req.body.motivo_retiro,
                                    eliminado: false
                                }).then(function (creado) {
                                    res.json({ mensaje: "Usuario actualizado satisfactoriamente!" });
                                })

                            })

                    } else if (req.body.tipoReincorporacion) {
                        if (req.body.tipoReincorporacion.nombre_corto == Diccionario.TIPO_REINCORPORACION) {
                            RrhhEmpleadoFicha.update({
                                fecha_expiracion: null
                            }, {
                                    where: { id: req.body.id_ficha }
                                }).then(function (fichaActualizada) {
                                    RrhhEmpleadoBeneficioSocial.update({
                                        eliminado: true
                                    }, {
                                            where: {
                                                id_ficha: req.body.id_ficha,
                                                tipo_beneficio: true
                                            }
                                        }).then(function (beneficioEncontrado) {
                                            res.json({ mensaje: "Usuario actualizado satisfactoriamente!" });
                                        })

                                })
                        } else {
                            res.json({ mensaje: "Usuario actualizado satisfactoriamente!" });
                        }

                    } else {
                        res.json({ mensaje: "Usuario actualizado satisfactoriamente!" });
                    }
                })


        })//RrhhEmpleadoFichaOtrosSeguros,RrhhEmpleadoFichaFamiliar
    router.route('/usuario-recurso-humano-ficha/empleado/:id_empleado')
        .get(function (req, res) {
            RrhhEmpleadoFicha.findAll({
                limit: 1,
                where: {
                    id_empleado: req.params.id_empleado
                },
                include: [{ model: Clase, as: 'tipoContrato' }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] },
                { model: Clase, as: 'tipoPersonal' },
                { model: Clase, as: 'cargaHorario' },
                { model: Clase, as: 'area' },
                { model: Clase, as: 'ubicacion' },
                { model: Clase, as: 'seguroSalud' },
                { model: Clase, as: 'lugarSeguroSalud' },
                { model: Clase, as: 'aporteSeguroLargoPlazo' },
                { model: Clase, as: 'lugarSeguroLargoPlazo' },
                { model: Clase, as: 'banco' },
                { model: RrhhEmpleadoDiscapacidad, as: 'discapacidades', include: [{ model: Clase, as: "discapacidad" }] },
                /* { model: RrhhEmpleadoFichaFamiliar, as: 'familiares' },*/
                { model: RrhhEmpleadoFichaOtrosSeguros, as: 'otrosSeguros', include: [{ model: Clase, as: "tipoSeguro" }] },
                {
                    model: MedicoPaciente, as: 'empleado',
                    include: [{ model: RrhhViajeConductor, as: 'conductor', include: [{ model: Clase, as: "tipoLicencia" }] }, { model: RrhhEmpleadoFichaFamiliar, as: 'familiares', include: [{ model: Clase, as: 'relacion' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }] },
                    { model: Clase, as: 'extension' }, { model: Clase, as: 'tipoDocumento' },
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
                /* if (ficha) { */
                res.json({ ficha: ficha })
                /*  } else {
                     MedicoPaciente.find({
                         where: { id: req.params.id_empleado },
                         include: [{ model: RrhhEmpleadoDiscapacidad, as: 'discapacidades', include: [{ model: Clase, as: "discapacidad" }] }, { model: RrhhEmpleadoFichaFamiliar, as: 'familiares', include: [{ model: Clase, as: 'relacion' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }] },
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
                 } */
            })
        })
        .post(function (req, res) {
            RrhhEmpleadoFicha.find({

                where: {
                    id: req.body.id
                },
                include: [{ model: Clase, as: 'tipoContrato' }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] },
                { model: Clase, as: 'tipoPersonal' },
                { model: Clase, as: 'cargaHorario' },
                { model: Clase, as: 'area' },
                { model: Clase, as: 'ubicacion' },
                { model: Clase, as: 'seguroSalud' },
                { model: Clase, as: 'lugarSeguroSalud' },
                { model: Clase, as: 'aporteSeguroLargoPlazo' },
                { model: Clase, as: 'lugarSeguroLargoPlazo' },
                { model: Clase, as: 'banco' },
                { model: RrhhEmpleadoDiscapacidad, as: 'discapacidades', include: [{ model: Clase, as: "discapacidad" }] },
                /* { model: RrhhEmpleadoFichaFamiliar, as: 'familiares' }, */
                { model: RrhhEmpleadoFichaOtrosSeguros, as: 'otrosSeguros', include: [{ model: Clase, as: "tipoSeguro" }] },
                {
                    model: MedicoPaciente, as: 'empleado',
                    include: [{ model: RrhhEmpleadoFichaFamiliar, as: 'familiares', include: [{ model: Clase, as: 'relacion' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }] },
                    { model: Clase, as: 'extension' }, { model: Clase, as: 'tipoDocumento' },
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
            }).then(function (fichaAnterior) {
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
                            chofer: req.body.empleado.chofer
                        }, {
                                where: {
                                    id: req.body.empleado.id
                                }
                            }).then(function (medicoPacienteActualizado) {
                                if (req.body.empleado.chofer) {
                                    RrhhViajeConductor.find({
                                        where: { id_empleado: req.body.empleado.id }
                                    }).then(function (conductor) {
                                        var nombre = ""
                                        if (req.body.empleado.persona.segundo_nombre) {
                                            nombre = req.body.empleado.persona.nombres + ' ' + req.body.empleado.persona.segundo_nombre + ' ' + req.body.empleado.persona.apellido_paterno + ' ' + req.body.empleado.persona.apellido_materno
                                        } else {
                                            nombre = req.body.empleado.persona.nombres + ' ' + req.body.empleado.persona.apellido_paterno + ' ' + req.body.empleado.persona.apellido_materno
                                        }
                                        if (conductor) {
                                            RrhhViajeConductor.update({
                                                nombre: nombre,
                                                licencia: req.body.empleado.persona.ci,
                                                id_tipo_licencia: req.body.empleado.conductor.tipoLicencia.id,
                                                habilitado: true,
                                            }, {
                                                    where: { id: conductor.id }
                                                }).then(function (conductorCreado) {
                                                    guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior)
                                                })
                                        } else {
                                            RrhhViajeConductor.create({
                                                nombre: nombre,
                                                licencia: req.body.empleado.persona.ci,
                                                id_empleado: req.body.empleado.id,
                                                habilitado: true,
                                                id_tipo_licencia: req.body.empleado.conductor.tipoLicencia.id,
                                                id_empresa: req.body.empleado.id_empresa
                                            }).then(function (conductorCreado) {
                                                guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior)
                                            })
                                        }
                                    })
                                } else {
                                    RrhhViajeConductor.find({
                                        where: { id_empleado: req.body.empleado.id }
                                    }).then(function (conductor) {
                                        if (conductor) {
                                            RrhhViajeConductor.update({
                                                habilitado: false
                                            }, {
                                                    where: { id: conductor.id }
                                                }).then(function (conductorCreado) {
                                                    guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior)
                                                })
                                        } else {
                                            guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior)
                                        }
                                    })
                                }

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
                                codigo: req.body.empleado.codigo,
                                id_extension: req.body.empleado.extension.id,
                                id_tipo_documento: req.body.empleado.tipoDocumento.id,
                                fecha_vence_documento: req.body.empleado.fecha_vence_documento,
                                chofer: req.body.empleado.chofer
                            }, {
                                    where: {
                                        id: req.body.empleado.id
                                    }
                                }).then(function (medicoPacienteActualizado) {
                                    var personaReferencia = req.body.personaReferencia
                                    if (req.body.empleado.chofer) {
                                        RrhhViajeConductor.find({
                                            where: { id_empleado: req.body.empleado.id }
                                        }).then(function (conductor) {
                                            if (conductor) {
                                                var nombre = ""
                                                if (req.body.empleado.persona.segundo_nombre) {
                                                    nombre = req.body.empleado.persona.nombres + ' ' + req.body.empleado.persona.segundo_nombre + ' ' + req.body.empleado.persona.apellido_paterno + ' ' + req.body.empleado.persona.apellido_materno
                                                } else {
                                                    nombre = req.body.empleado.persona.nombres + ' ' + req.body.empleado.persona.apellido_paterno + ' ' + req.body.empleado.persona.apellido_materno
                                                }
                                                RrhhViajeConductor.update({
                                                    nombre: nombre,
                                                    licencia: req.body.empleado.persona.ci,
                                                    id_tipo_licencia: req.body.empleado.conductor.tipoLicencia.id,
                                                }, {
                                                        where: { id: conductor.id }
                                                    }).then(function (conductorCreado) {
                                                        guardarDatosFicha(req, res, personaReferencia, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior)
                                                    })
                                            } else {

                                                RrhhViajeConductor.create({
                                                    nombre: nombre,
                                                    licencia: req.body.empleado.persona.ci,
                                                    id_empleado: req.body.empleado.id,
                                                    habilitado: true,
                                                    id_empresa: req.body.empleado.id_empresa,
                                                    id_tipo_licencia: req.body.empleado.conductor.tipoLicencia.id,
                                                }).then(function (conductorCreado) {
                                                    guardarDatosFicha(req, res, personaReferencia, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior)
                                                })
                                            }
                                        })
                                    } else {
                                        RrhhViajeConductor.find({
                                            where: { id_empleado: req.body.empleado.id }
                                        }).then(function (conductor) {
                                            if (conductor) {
                                                RrhhViajeConductor.update({
                                                    habilitado: false,
                                                    id_tipo_licencia: req.body.conductor.tipoLicencia.id,
                                                }, {
                                                        where: { id: conductor.id }
                                                    }).then(function (conductorCreado) {
                                                        guardarDatosFicha(req, res, personaReferencia, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior)
                                                    })
                                            } else {
                                                guardarDatosFicha(req, res, personaReferencia, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior)
                                            }
                                        })
                                    }

                                }).catch(function (err) {
                                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                });
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                        });

                }
            })
        })

    function guardarDatosFicha(req, res, personaReferenciaCreada, Persona, RrhhEmpleadoFicha, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoCargo, RrhhEmpleadoDiscapacidad, fichaAnterior) {
        var provincia = (req.body.empleado.persona.provincia) ? req.body.empleado.persona.provincia.id : null
        var localidad = (req.body.empleado.persona.localidad) ? req.body.empleado.persona.localidad.id : null
        var ciudad = (req.body.empleado.persona.ciudad) ? req.body.empleado.persona.ciudad.id : null
        var nombre = ""
        if (req.body.empleado.persona.segundo_nombre) {
            nombre = req.body.empleado.persona.nombres + ' ' + req.body.empleado.persona.segundo_nombre + ' ' + req.body.empleado.persona.apellido_paterno + ' ' + req.body.empleado.persona.apellido_materno
        } else {
            nombre = req.body.empleado.persona.nombres + ' ' + req.body.empleado.persona.apellido_paterno + ' ' + req.body.empleado.persona.apellido_materno
        }
        Persona.update({
            nombres: req.body.empleado.persona.nombres,
            apellido_paterno: req.body.empleado.persona.apellido_paterno,
            apellido_materno: req.body.empleado.persona.apellido_materno,
            ci: req.body.empleado.persona.ci,
            id_genero: req.body.empleado.persona.genero.id,
            nombre_completo: nombre,
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
                var inicio = new Date(req.body.fecha_inicio2); inicio.setHours(0, 0, 0, 0, 0);

                condicionFicha = { id: req.body.id };
                RrhhEmpleadoFicha.find({
                    where: condicionFicha,

                }).then(function (ficha) {
                    var contrato = fechaATexto(ficha.fecha_inicio)
                    var fechaconT = fechaATexto(inicio)
                    if (contrato == fechaconT) {
                        RrhhEmpleadoFicha.update({
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

                        }, {
                                where: { id: ficha.id }
                            }).then(function (actualizado) {
                                if (req.body.contrato2) {
                                    fs.writeFileSync('./contratos/contrato-' + ficha.id + "-" + req.body.contrato2.name, req.body.contrato2.data, 'binary', function (err) {
                                        if (err)
                                            console.log(err);
                                        else
                                            console.log("The file was saved!");
                                    });

                                    RrhhEmpleadoFicha.update({
                                        contrato: req.body.contrato2.name
                                    }, {
                                            where: { id: ficha.id }
                                        }).then(function (affecteedRows) {
                                            guardarOtrosSeguros(req, res, Persona, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)
                                        });
                                } else {
                                    guardarOtrosSeguros(req, res, Persona, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)
                                }
                            })

                    } else {
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
                                        guardarOtrosSeguros(req, res, Persona, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, medicoPacientefichaCreado, fichaAnterior)
                                    });
                            } else {
                                guardarOtrosSeguros(req, res, Persona, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, medicoPacientefichaCreado, fichaAnterior)
                            }
                        })
                    }
                    /* RrhhEmpleadoFicha.create({
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
                    }).then(function (medicoPacientefichaCreado) { */

                })
            })
    }
    function guardarOtrosSeguros(req, res, Persona, RrhhEmpleadoFichaOtrosSeguros, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior) {
        if (req.body.otrosSeguros.length > 0) {
            req.body.otrosSeguros.forEach(function (seguroSalud, index, array) {
                if (seguroSalud.id) {
                    if (seguroSalud.eliminado != true) {
                        RrhhEmpleadoFichaOtrosSeguros.update({
                            id_ficha: ficha.id,
                            id_tipo_seguro: seguroSalud.tipoSeguro.id,
                            monto: seguroSalud.monto,
                            observacion: seguroSalud.observacion,
                        }, {
                                where: { id: seguroSalud.id }
                            }).then(function (seguroCreado) {
                                if (index === (array.length - 1)) {
                                    guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)

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
                                guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)

                            }
                        }).catch(function (err) {
                            res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                        });
                    }
                } else {
                    RrhhEmpleadoFichaOtrosSeguros.create({
                        id_ficha: ficha.id,
                        id_tipo_seguro: seguroSalud.tipoSeguro.id,
                        monto: seguroSalud.monto,
                        observacion: seguroSalud.observacion,
                    }).then(function (seguroCreado) {
                        if (index === (array.length - 1)) {
                            guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)

                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });
                }
            })
        } else {
            guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)
        }
    }
    function guardarFamiliares(req, res, Persona, RrhhEmpleadoFichaFamiliar, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior) {
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
                                            guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)

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
                                    guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)

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
                            referencia: familiar.referencia
                        }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                            if (index === (array.length - 1)) {
                                guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)
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
            guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior)
        }
    }
    function guardarCargo(req, res, RrhhEmpleadoDiscapacidad, RrhhEmpleadoCargo, ficha, fichaAnterior) {
        RrhhEmpleadoCargo.destroy({
            where: {
                id_ficha: ficha.id
            }
        }).then(function (EmpleadoCargosActualizada) {
            if (req.body.cargo.length > 0) {
                req.body.cargo.forEach(function (cargo, index, array) {
                    RrhhEmpleadoCargo.findOrCreate({
                        where: { id_ficha: ficha.id, id_cargo: cargo.id },
                        defaults: {
                            /*  id_empleado: req.body.empleado.id, */
                            id_cargo: cargo.id,
                            id_ficha: ficha.id
                        }
                    }).spread(function (cargoEncontrado, created) {
                        if (!created) {
                            RrhhEmpleadoCargo.update({
                                /* id_empleado: req.body.empleado.id, */
                                id_cargo: cargo.id,
                                id_ficha: ficha.id
                            }, {
                                    where: { id_ficha: ficha.id, id_cargo: cargo.id }
                                }).then(function (actualizado) {
                                    if (index === (array.length - 1)) {
                                        guardarSeguros(RrhhEmpleadoDiscapacidad, req, req.body.empleado, res, fichaAnterior, ficha)
                                    }
                                }).catch(function (err) {
                                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                });

                        } else {
                            if (index === (array.length - 1)) {
                                guardarSeguros(RrhhEmpleadoDiscapacidad, req, req.body.empleado, res, fichaAnterior, ficha)
                            }
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });
                });
            } else {
                guardarSeguros(RrhhEmpleadoDiscapacidad, req, req.body.empleado, res, fichaAnterior, ficha)
            }
        })
    }
    function guardarSeguros(RrhhEmpleadoDiscapacidad, req, empleado, res, fichaAnterior, ficha) {
        var discapacidades = req.body.discapacidades
        RrhhEmpleadoDiscapacidad.destroy({
            where: {
                id_ficha: ficha.id,
            }
        }).then(function (EmpleadoDiscapacidadesActualizada) {
            if (discapacidades.length > 0) {
                req.body.discapacidades.forEach(function (discapacidad, index, array) {
                    RrhhEmpleadoDiscapacidad.findOrCreate({
                        where: { id_ficha: ficha.id, id_discapacidad: discapacidad.id },
                        defaults: {
                            id_ficha: ficha.id,
                            id_discapacidad: discapacidad.id
                        }
                    }).spread(function (discapacidadEncontrada, created) {
                        if (!created) {
                            RrhhEmpleadoDiscapacidad.update({
                                id_ficha: ficha.id,
                                id_discapacidad: discapacidad.id
                            }, {
                                    where: { id_ficha: ficha.id, id_discapacidad: discapacidad.id }
                                }).then(function (actualizado) {
                                    if (index === (array.length - 1)) {
                                        guardarHistorialVacacion(RrhhEmpleadoHistorialVacacion, req, res, empleado, true, fichaAnterior, ficha)
                                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                                    }
                                }).catch(function (err) {
                                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                                });

                        } else {
                            if (index === (array.length - 1)) {
                                guardarHistorialVacacion(RrhhEmpleadoHistorialVacacion, req, res, empleado, true, fichaAnterior, ficha)

                            }
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                    });

                })
            } else {
                guardarHistorialVacacion(RrhhEmpleadoHistorialVacacion, req, res, empleado, true, fichaAnterior, ficha)

            }
        })
    }
    function guardarHistorialVacacion(RrhhEmpleadoHistorialVacacion, req, res, empleado, upload, fichaAnterior, ficha) {
        if (req.body.historialVacacion.length > 0) {
            /* RrhhEmpleadoHistorialVacacion.update({
                eliminado: true,
            }, {
                    where: { id_empleado: empleado.id }
                }).then(function (historialActualizado) { */
            /* req.body.historialVacacion.forEach(function (historial, index, array) { */
            var contador = 0
            for (var i = 0; i < req.body.historialVacacion.length; i++) {
                var historial = req.body.historialVacacion[i];
                RrhhEmpleadoHistorialVacacion.create({
                    aplicadas: historial.aplicadas,
                    tomadas: historial.tomadas,
                    anio: historial.anio,
                    gestion: historial.gestion,
                    /* id_empleado: empleado.id, */
                    eliminado: false,
                    id_ficha: ficha.id
                }).then(function (historialCreado) {

                    if (contador == (req.body.historialVacacion.length - 1)) {
                        if (upload) {

                            guardarBitacoraCambiosFicha(fichaAnterior, empleado, req, res)


                        } else {

                        }
                    }
                    contador++
                })
            }

            /* }) */
            /* }); */

        } else {
            guardarBitacoraCambiosFicha(fichaAnterior, empleado, req, res)

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
                include: [{ model: Persona, as: 'persona' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', limit: 1, order: [['id', 'DESC']] }]
            }).then(function (empleados) {
                /*  if (empleados.length > 0) {
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
  */
                res.json({ empleados: empleados })

                /*  }
  */
            })
        })
    router.route('/recursos-humanos/choferes/empresa/:id_empresa')
        .get(function (req, res) {
            RrhhViajeConductor.findAll({
                where: { id_empresa: req.params.id_empresa },
                include: [{ model: Clase, as: 'tipoLicencia' }]
            }).then(function (dato) {
                res.json(dato)
            })
        })
    /* router.route('/recursos-humanos/crearrolturno/:id_empresa')
    .get(function (req, res) {
        RrhhEmpleadoFicha.findAll({            
            include: [{model:MedicoPaciente,as:"empleado",where: { id_empresa: req.params.id_empresa, es_empleado: true },include: [{ model: Persona, as: 'persona' }]}],
        }).then(function (datos) {
            datos.forEach(function(dato,index,array) {
                RrhhEmpleadoRolTurno.create({
                   
                    id_ficha: dato.dataValues.id,
                    id_campo: 810,
                    fecha_inicio: new Date(),                   
                    tipo: 1,
                    dias_trabajado:14,
                    dias_descanso: 7,
                    id_grupo: 4287,
                    eliminado: false
                }).then(function (empleadoRolTurnoCreado) {
                    if(index===(array.length-1)){
                        res.json({ mensaje: "Creado satisfactoriamente!" })
                     }
               
               });
            })
        })
    }) */
    router.route('/recursos-humanos/rolTurno/empleado/:id_empleado')
        .post(function (req, res) {
            req.body.fecha_fin = (req.body.fecha_fin == '') ? null : req.body.fecha_fin
            if (req.body.id) {
                RrhhEmpleadoRolTurno.update({
                    /* id_empleado: req.params.id_empleado, */
                    id_ficha: req.body.id_ficha,
                    id_campo: req.body.campo.id,
                    fecha_inicio: req.body.fecha_inicio,
                    fecha_fin: req.body.fecha_fin,
                    tipo: req.body.tipo,
                    dias_trabajado: req.body.dias_trabajado,
                    dias_descanso: req.body.dias_descanso,
                    id_grupo: req.body.grupo.id,
                    eliminado: false
                }
                    , {
                        where: { id: req.body.id }
                    }).then(function (empleadoRolTurnoCreado) {
                        res.json({ mensaje: "Actualizado satisfactoriamente!" })

                    })
            } else {
                RrhhEmpleadoRolTurno.create({
                    /* id_empleado: req.params.id_empleado, */
                    id_ficha: req.body.id_ficha,
                    id_campo: req.body.campo.id,
                    fecha_inicio: req.body.fecha_inicio,
                    fecha_fin: req.body.fecha_fin,
                    tipo: req.body.tipo,
                    dias_trabajado: req.body.dias_trabajado,
                    dias_descanso: req.body.dias_descanso,
                    id_grupo: req.body.grupo.id,
                    eliminado: false
                }).then(function (empleadoRolTurnoCreado) {
                    res.json({ mensaje: "Guardado satisfactoriamente!" })

                })
            }
        })
    router.route('/recursos-humanos/empresa/:id_empresa/rolTurno/empleado/:id_empleado')
        .get(function (req, res) {
            if (req.params.id_empleado != 0) {
                RrhhEmpleadoRolTurno.findAll({
                    where: { id_ficha: req.params.id_empleado, eliminado: false },
                    include: [{ model: Clase, as: 'campo' }, { model: Clase, as: 'grupo' }, { model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa } }] }]
                }).then(function (empleadoRolesTurno) {
                    res.json({ rolesTurno: empleadoRolesTurno })

                })
            } else {
                MedicoPaciente.findAll({
                    where: { id_empresa: req.params.id_empresa, es_empleado: true },
                    include: [{ model: Persona, as: 'persona' },
                    {
                        model: RrhhEmpleadoFicha, as: 'empleadosFichas',
                        include: [{ model: RrhhEmpleadoRolTurno, as: "rolesTurno", include: [{ model: Clase, as: 'campo' }, { model: Clase, as: 'grupo' }] }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }, { model: RrhhEmpleadoVacaciones, as: 'vacaciones' }, { model: RrhhEmpleadoAusencia, as: 'ausencias', include: [{ model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo' }] }] }]
                    }]
                }).then(function (empleadoRolesTurno) {
                    sequelize.query("select min(fecha_inicio) as fecha from agil_rrhh_empleado_rol_turno;", { type: sequelize.QueryTypes.SELECT })
                        .then(function (fechaInicio) {
                            res.json({ rolesTurno: empleadoRolesTurno, fechaInicio: fechaInicio[0].fecha })
                        })
                })

                /* RrhhEmpleadoRolTurno.findAll({
                    where: { eliminado: false },
                    include: [{ model: Clase, as: 'campo' }, { model: Clase, as: 'grupo' }, { model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }, { model: RrhhEmpleadoVacaciones, as: 'vacaciones' }, { model: RrhhEmpleadoAusencia, as: 'ausencias', include: [{ model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo' }] }] }, { model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }] }]
                }).then(function (empleadoRolesTurno) {
                    sequelize.query("select min(fecha_inicio) as fecha from agil_rrhh_empleado_rol_turno;", { type: sequelize.QueryTypes.SELECT })
                        .then(function (fechaInicio) {
                            res.json({ rolesTurno: empleadoRolesTurno, fechaInicio: fechaInicio[0].fecha })
                        })
                }) */
            }
        })
    router.route('/recursos-humanos/empresa/:id_empresa/rolTurnoCalendario/inicio/:inicio/fin/:fin/pagina/:pagina/items_pagina/:items_pagina/texto_busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/grupo/:grupo/nombre/:nombre/campo/:campo')
        .get(function (req, res) {
            var condicionRolTurno = {},
                condicionCampo = {},
                condicionEmpleado = {}
            if (req.params.grupo != "0") {
                condicionRolTurno.id_grupo = req.params.grupo
            }
            if (req.params.nombre != "0") {
                condicionEmpleado.nombre_completo = { $like: '%' + req.params.nombre + '%' }
            }
            if (req.params.campo != "0") {
                condicionRolTurno.id_campo = req.params.campo
            }
            RrhhEmpleadoRolTurno.findAndCountAll({
                where: condicionRolTurno,

                include: [{ model: Clase, as: 'campo' }, { model: Clase, as: 'grupo' }, { model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }, { model: RrhhEmpleadoVacaciones, as: 'vacaciones' }, { model: RrhhEmpleadoAusencia, as: 'ausencias', include: [{ model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo' }] }] }, { model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionEmpleado }] }] }]
            }).then(function (datos) {
                /*  MedicoPaciente.findAndCountAll({
                     offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                     where: { id_empresa: req.params.id_empresa, es_empleado: true, eliminado: false },
                     include: [{ model: Persona, as: 'persona', where: condicionEmpleado },
                     {
                         model: RrhhEmpleadoFicha, as: 'empleadosFichas',
                         include: [{ model: RrhhEmpleadoRolTurno, as: "rolesTurno", where: condicionRolTurno, include: [{ model: Clase, as: 'campo' }, { model: Clase, as: 'grupo' }] }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }, { model: RrhhEmpleadoVacaciones, as: 'vacaciones' }, { model: RrhhEmpleadoAusencia, as: 'ausencias', include: [{ model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo' }] }] }]
                     }]
                 }).then(function (datos) { */
                RrhhEmpleadoRolTurno.findAll({
                    where: condicionRolTurno,
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    include: [{ model: Clase, as: 'campo' }, { model: Clase, as: 'grupo' }, { model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }, { model: RrhhEmpleadoVacaciones, as: 'vacaciones' }, { model: RrhhEmpleadoAusencia, as: 'ausencias', include: [{ model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo' }] }] }, { model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionEmpleado }] }] }]
                }).then(function (datos2) {
                    var fechas = datos2.map(function (rol) {
                        return rol.fecha_inicio.getTime()
                    })
                    
                    var fechaInicio = new Date(fechas.reduce(function (a, b) {
                        return Math.min(a, b)
                    }));
                  
                    res.json({ rolesTurno: datos2, fechaInicio: fechaInicio, paginas: Math.ceil(datos.count / req.params.items_pagina) });

                })
            })
        })

    router.route('/recursos-humanos/empresa/:id_empresa/rolTurno/inicio/:inicio/fin/:fin/grupo/:grupo/pagina/:pagina/items/:items_pagina/campo/:campo/texto_busqueda/:texto_busqueda/direccion/:direccion/columna/:columna')
        .get(function (req, res) {
            var condicionRolTurno = { eliminado: false }, ordenArreglo = [], condicionRolTurno = {};
            if (req.params.columna == "campo") {
                ordenArreglo.push({ model: Clase, as: 'campo' })
                ordenArreglo.push('nombre');
                ordenArreglo.push(req.params.direccion);
            } else if (req.params.columna == "grupo") {
                ordenArreglo.push({ model: Clase, as: 'grupo' })
                ordenArreglo.push('nombre');
                ordenArreglo.push(req.params.direccion);
            } else {
                ordenArreglo.push(req.params.columna);
                ordenArreglo.push(req.params.direccion);
            }
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                var condicionRolTurno = { eliminado: false, fecha_inicio: { $between: [inicio, fin] } };
            }
            if (req.params.grupo != "0") {
                condicionRolTurno.id_grupo = req.params.grupo
            }
            if (req.params.campo != "0") {
                condicionRolTurno.id_campo = req.params.campo
            }
            RrhhEmpleadoRolTurno.findAndCountAll({
                where: condicionRolTurno,
                include: [{ model: Clase, as: 'campo' }, { model: Clase, as: 'grupo' }, { model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: RrhhEmpleadoVacaciones, as: 'vacaciones' }, { model: RrhhEmpleadoAusencia, as: 'ausencias', include: [{ model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo' }] }] }, { model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }] }],
                order: [ordenArreglo]
            }).then(function (datos2) {
                RrhhEmpleadoRolTurno.findAndCountAll({
                    where: condicionRolTurno,
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    include: [{ model: Clase, as: 'campo' }, { model: Clase, as: 'grupo' }, { model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: RrhhEmpleadoVacaciones, as: 'vacaciones' }, { model: RrhhEmpleadoAusencia, as: 'ausencias', include: [{ model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo' }] }] }, { model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }] }],
                    order: [ordenArreglo]
                }).then(function (datos) {
                    res.json({ rolesTurno: datos.rows, paginas: Math.ceil(datos2.count / req.params.items_pagina) })
                })
            })
        })
    router.route('/recursos-humanos/horas-extra/empleado/:id_empleado')
        .post(function (req, res) {
            RrhhEmpleadoHorasExtra.create({
                id_empleado: req.params.id_empleado,
                id_ficha: req.body.id_ficha,
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
            var condicionHorasExtra = { id_ficha: req.params.id_empleado, eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                var condicionHorasExtra = { id_ficha: req.params.id_empleado, eliminado: false, fecha: { $between: [inicio, fin] } };
            }
            RrhhEmpleadoHorasExtra.findAll({
                where: condicionHorasExtra,
                include: [{ model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: MedicoPaciente, as: 'empleado' }] }]
            }).then(function (horasExtra) {
                res.json(horasExtra)

            })
        })

    router.route('/fichas/empleados/empresa/excel/upload')
        .post(function (req, res) {
            var promises = [];
            sequelize.transaction(function (t) {
                req.body.bancos.forEach(function (banco, index, array) {
                    promises.push(Tipo.find({
                        where: {
                            nombre_corto: 'RRHH_BAN',
                            id_empresa: req.body.id_empresa
                        }
                    }).then(function (tipo) {
                        return Clase.findOrCreate({
                            where: {
                                nombre: banco,
                                id_tipo: tipo.dataValues.id
                            },
                            transaction: t,
                            defaults: {
                                nombre: banco,
                                id_tipo: tipo.dataValues.id,
                                habilitado: true
                            }
                        })
                    }))
                    if (index === (array.length - 1)) {
                        req.body.pacientes.forEach(function (pacienteActual, index3, array3) {
                            promises.push(MedicoPaciente.find({
                                where: { codigo: pacienteActual.codigo, id_empresa: req.body.id_empresa },
                                transaction: t
                            }).then(function (pacienteFound) {
                                // console.log(pacienteFound)
                                if (pacienteFound != null) {
                                    return RrhhEmpleadoFicha.findAll({
                                        where: {
                                            id_empleado: pacienteFound.id,
                                        },
                                        transaction: t,
                                        include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo', include: [{ model: Tipo, as: 'tipo' }] }] }],
                                        limit: 1,
                                        order: [['id', 'desc']]
                                    }).then(function (fichaEncontrada) {
                                        return Tipo.find({
                                            where: {
                                                nombre_corto: 'RRHH_BAN',
                                                id_empresa: req.body.id_empresa
                                            }, transaction: t
                                        }).then(function (tipo) {
                                            return Clase.find({
                                                where: {
                                                    nombre: pacienteActual.banco,
                                                    id_tipo: tipo.dataValues.id
                                                },
                                                transaction: t,
                                            }).then(function (bancoEncontrado) {
                                                return RrhhEmpleadoFicha.update({
                                                    numero_cuenta: pacienteActual.numero_cuenta,
                                                    id_banco: bancoEncontrado.dataValues.id,
                                                },
                                                    {
                                                        where: {
                                                            id: fichaEncontrada[0].dataValues.id
                                                        }, transaction: t
                                                    })
                                            })
                                        })

                                    })
                                }

                            }))
                        })
                    }
                })
                return Promise.all(promises);
            }).then(function (result) {
                res.json({ mensaje: "¡Datos de ficha empleados actualizados satisfactoriamente!" });
            }).catch(function (err) {
                res.json({ hasError: true, message: err.stack });
            });
        })

    router.route('/familiares/empleados/empresa/excel/upload')
        .post(function (req, res) {
            var promises = [];
            var arregloRelacionesCreadas = []

            req.body.relaciones.forEach(function (relacion, index, array) {
                Tipo.find({
                    where: {
                        nombre_corto: 'RRHH_REL',
                        id_empresa: req.body.id_empresa
                    }
                }).then(function (tipo) {
                    Clase.findOrCreate({
                        where: {
                            nombre: relacion,
                            id_tipo: tipo.dataValues.id
                        },
                        defaults: {
                            nombre: relacion,
                            id_tipo: tipo.dataValues.id,
                            habilitado: true
                        }
                    }).spread(function (dato, cread) {
                        if (index === (array.length - 1)) {
                            sequelize.transaction(function (t) {
                                req.body.familiares.forEach(function (familiar, index3, array3) {
                                    promises.push(MedicoPaciente.find({
                                        where: { codigo: familiar.codigoEmpleado, id_empresa: req.body.id_empresa },
                                        transaction: t
                                    }).then(function (pacienteFound) {
                                        // console.log(pacienteFound)
                                        if (pacienteFound != null) {
                                            return Tipo.find({
                                                where: {
                                                    nombre_corto: 'RRHH_REL',
                                                    id_empresa: req.body.id_empresa
                                                }, transaction: t
                                            }).then(function (tipo) {
                                                return Clase.find({
                                                    where: {
                                                        nombre: familiar.relacion,
                                                        id_tipo: tipo.dataValues.id
                                                    },
                                                    transaction: t,

                                                }).then(function (relacionEncontrado) {
                                                    var nombre_corto = familiar.genero.charAt(0)
                                                    return Clase.find({
                                                        where: { nombre_corto: nombre_corto },
                                                        transaction: t
                                                    }).then(function (generoEncontrado) {
                                                        var nombre = ""
                                                        if (familiar.nombres) {
                                                            nombre += familiar.nombres
                                                        }
                                                        if (familiar.apellido_paterno) {
                                                            nombre += ' ' + familiar.apellido_paterno
                                                        }
                                                        if (familiar.apellido_materno) {
                                                            nombre += ' ' + familiar.apellido_materno
                                                        }
                                                        return Persona.create({
                                                            nombres: familiar.nombres,
                                                            apellido_paterno: familiar.apellido_paterno,
                                                            apellido_materno: familiar.apellido_materno,
                                                            fecha_nacimiento: familiar.fecha_nacimiento,
                                                            nombre_completo: nombre,
                                                            id_genero: generoEncontrado.id
                                                        }, {
                                                                transaction: t
                                                            }).then(function (personaCreada) {
                                                                return RrhhEmpleadoFichaFamiliar.create({
                                                                    id_empleado: pacienteFound.id,
                                                                    id_persona_familiar: personaCreada.id,
                                                                    id_relacion: relacionEncontrado.id,
                                                                    //afiliado: familiar.afiliado
                                                                    referencia: familiar.referencia
                                                                }, {
                                                                        transaction: t
                                                                    }).then(function (RrhhEmpleadoFichaFamiliarCreado) {
                                                                    })
                                                            })
                                                    })
                                                })
                                            })


                                        }

                                    }))
                                })
                                return Promise.all(promises);
                            }).then(function (result) {
                                res.json({ mensaje: "¡Datos de familiares empleados actualizados satisfactoriamente!" });
                            }).catch(function (err) {
                                res.json({ hasError: true, mensaje: err.stack });
                            });
                        }
                    })
                })
            })
        })
    router.route('/empleados/empresa/:id_empresa/fichas/excel/upload')
        .post(function (req, res) {
            Tipo.find({
                where: { nombre_corto: 'NAC' }
            }).then(function (tipoEncontradoNAC) {
                Tipo.find({
                    where: { nombre_corto: 'DEP' }
                }).then(function (tipoEncontradoDEP) {
                    Tipo.find({
                        where: { nombre_corto: 'MUN' }
                    }).then(function (tipoEncontradoMUN) {
                        Tipo.find({
                            where: { nombre_corto: 'LOC' }
                        }).then(function (tipoEncontradoLOC) {
                            Tipo.find({
                                where: { nombre_corto: 'RRHH_ASLP', id_empresa: req.params.id_empresa }
                            }).then(function (tipoEncontradoRRHH_ASLP) {
                                Tipo.find({
                                    where: { nombre_corto: 'RRHH_LSS', id_empresa: req.params.id_empresa }
                                }).then(function (tipoEncontradoRRHH_LSS) {
                                    Tipo.find({
                                        where: { nombre_corto: 'RRHH_TP', id_empresa: req.params.id_empresa }
                                    }).then(function (tipoEncontradoRRHH_TP) {
                                        Tipo.find({
                                            where: { nombre_corto: 'RRHH_CH', id_empresa: req.params.id_empresa }
                                        }).then(function (tipoEncontradoRRHH_CH) {
                                            Tipo.find({
                                                where: { nombre_corto: 'RRHH_AREA', id_empresa: req.params.id_empresa }
                                            }).then(function (tipoEncontradoRRHH_AREA) {
                                                Tipo.find({
                                                    where: { nombre_corto: 'RRHH_UBI', id_empresa: req.params.id_empresa }
                                                }).then(function (tipoEncontradoRRHH_UBI) {
                                                    Tipo.find({
                                                        where: { nombre_corto: 'RRHH_EC', id_empresa: req.params.id_empresa }
                                                    }).then(function (tipoEncontradoRRHH_EC) {
                                                        Tipo.find({
                                                            where: { nombre_corto: 'RRHH_OST', id_empresa: req.params.id_empresa }
                                                        }).then(function (tipoEncontradoRRHH_OST) {
                                                            var promises = []
                                                            sequelize.transaction(function (t) {
                                                                req.body.arregloAporteAfp.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_ASLP.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_ASLP.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloLugarAfp.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_LSS.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_LSS.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloLugarSeguroSalud.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_LSS.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_LSS.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloTipoPersona.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_TP.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_TP.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloCargaHorario.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_CH.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_CH.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloArega.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_AREA.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_AREA.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloUbicacion.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_UBI.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_UBI.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloEstadoCivil.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_EC.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_EC.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloOtrosSeguros1.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { habilitado: true, nombre: dato, id_tipo: tipoEncontradoRRHH_OST.dataValues.id },
                                                                        defaults: {
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_OST.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                req.body.arregloOtrosSeguros2.forEach(function (dato, index, array) {
                                                                    promises.push(Clase.findOrCreate({
                                                                        where: { nombre: dato, id_tipo: tipoEncontradoRRHH_OST.dataValues.id },
                                                                        defaults: {
                                                                            habilitado: true,
                                                                            nombre: dato,
                                                                            id_tipo: tipoEncontradoRRHH_OST.dataValues.id,
                                                                            habilitado: true
                                                                        }, transaction: t,
                                                                        lock: t.LOCK.UPDATE
                                                                    }).spread(function (datos, cread) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            fulfill(datos);
                                                                        });
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })

                                                                req.body.fichas.forEach(function (empleado, index, array) {
                                                                    promises.push(MedicoPaciente.find({
                                                                        where: { codigo: empleado.codigo, id_empresa: req.params.id_empresa }, transaction: t
                                                                        , include: [{ model: Persona, as: 'persona' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', required: false, limit: 1, order: [["id", "desc"]] }]
                                                                    }).then(function (pacienteFound) {
                                                                        if (pacienteFound != null) {
                                                                            return Clase.find({
                                                                                where: { habilitado: true, nombre: empleado.nacionalidad, id_tipo: tipoEncontradoNAC.dataValues.id }, transaction: t
                                                                            }).then(function (claseNacEncontrada) {
                                                                                return Clase.find({
                                                                                    where: { habilitado: true, nombre: empleado.departamento, id_tipo: tipoEncontradoDEP.dataValues.id }, transaction: t
                                                                                }).then(function (claseDepEncontrada) {
                                                                                    return Clase.find({
                                                                                        where: { habilitado: true, nombre: empleado.provincia, id_tipo: tipoEncontradoMUN.dataValues.id }, transaction: t
                                                                                    }).then(function (claseMunEncontrada) {
                                                                                        return Clase.find({
                                                                                            where: { habilitado: true, nombre: empleado.provincia, id_tipo: tipoEncontradoLOC.dataValues.id }, transaction: t
                                                                                        }).then(function (claseLocEncontrada) {
                                                                                            return Clase.find({
                                                                                                where: { habilitado: true, nombre: empleado.estado_civil, id_tipo: tipoEncontradoRRHH_EC.dataValues.id }, transaction: t
                                                                                            }).then(function (claseEncontrada) {
                                                                                                var idEstC = (claseEncontrada) ? claseEncontrada.id : null
                                                                                                var idNac = (claseNacEncontrada) ? claseNacEncontrada.id : null
                                                                                                var idDep = (claseDepEncontrada) ? claseDepEncontrada.id : null
                                                                                                var idProv = (claseMunEncontrada) ? claseMunEncontrada.id : null
                                                                                                var idLoc = (claseLocEncontrada) ? claseLocEncontrada.id : null
                                                                                                /*  if (!pacienteFound.persona) {
                                                                                                     console.log(pacienteFound)
                                                                                                     console.log("pacienteFound")
                                                                                                 } */
                                                                                                return Persona.update({
                                                                                                    id_estado_civil: idEstC,
                                                                                                    id_pais_nacimiento: idNac,
                                                                                                    id_ciudad_nacimiento: idDep,
                                                                                                    id_provincia_nacimiento: idProv,
                                                                                                    id_localidad_nacimiento: idLoc
                                                                                                }, {
                                                                                                        where: { id: pacienteFound.persona.id }, transaction: t
                                                                                                    }).then(function (PersonaActualizada) {
                                                                                                        return Clase.find({
                                                                                                            where: { habilitado: true, nombre: empleado.afp_aporte, id_tipo: tipoEncontradoRRHH_ASLP.dataValues.id }, transaction: t
                                                                                                        }).then(function (claseAfpEncontrada) {
                                                                                                            return Clase.find({
                                                                                                                where: { habilitado: true, nombre: empleado.tipo_personal, id_tipo: tipoEncontradoRRHH_TP.dataValues.id }, transaction: t
                                                                                                            }).then(function (clasePersonaEncontrada) {
                                                                                                                return Clase.find({
                                                                                                                    where: { habilitado: true, nombre: empleado.carga_horario, id_tipo: tipoEncontradoRRHH_CH.dataValues.id }, transaction: t
                                                                                                                }).then(function (claseCargaEncontrada) {
                                                                                                                    return Clase.find({
                                                                                                                        where: { habilitado: true, nombre: empleado.area, id_tipo: tipoEncontradoRRHH_AREA.dataValues.id }, transaction: t
                                                                                                                    }).then(function (claseAreaEncontrada) {
                                                                                                                        return Clase.find({
                                                                                                                            where: { habilitado: true, nombre: empleado.ubicacion, id_tipo: tipoEncontradoRRHH_UBI.dataValues.id }, transaction: t
                                                                                                                        }).then(function (claseUbicacionEncontrada) {
                                                                                                                            return Clase.find({
                                                                                                                                where: { habilitado: true, nombre: empleado.lugar_afp, id_tipo: tipoEncontradoRRHH_LSS.dataValues.id }, transaction: t
                                                                                                                            }).then(function (claseLugarSeguroAfpEncontrada) {
                                                                                                                                return Clase.find({
                                                                                                                                    where: { habilitado: true, nombre: empleado.lugar_seguro, id_tipo: tipoEncontradoRRHH_LSS.dataValues.id }, transaction: t
                                                                                                                                }).then(function (claseLugarSeguroEncontrada) {
                                                                                                                                    var id_tipo_personal = (clasePersonaEncontrada) ? clasePersonaEncontrada.id : null,
                                                                                                                                        id_carga_horarios = (claseCargaEncontrada) ? claseCargaEncontrada.id : null,
                                                                                                                                        id_area = (claseAreaEncontrada) ? claseAreaEncontrada.id : null,
                                                                                                                                        id_ubicacion = (claseUbicacionEncontrada) ? claseUbicacionEncontrada.id : null,
                                                                                                                                        nua_seguro_largo_plazo = (empleado.nua_cua) ? empleado.nua_cua : null,
                                                                                                                                        id_aporte_seguro_largo_plazo = (claseAfpEncontrada) ? claseAfpEncontrada.id : null,
                                                                                                                                        id_lugar_seguro_largo_plazo = (claseLugarSeguroAfpEncontrada) ? claseLugarSeguroAfpEncontrada.id : null,
                                                                                                                                        id_lugar_seguro_salud = (claseLugarSeguroEncontrada) ? claseLugarSeguroEncontrada.id : null;
                                                                                                                                    return RrhhEmpleadoFicha.update({
                                                                                                                                        id_tipo_personal: id_tipo_personal,
                                                                                                                                        id_carga_horarios: id_carga_horarios,
                                                                                                                                        id_area: id_area,
                                                                                                                                        id_ubicacion: id_ubicacion,
                                                                                                                                        nua_seguro_largo_plazo: nua_seguro_largo_plazo,
                                                                                                                                        id_aporte_seguro_largo_plazo: id_aporte_seguro_largo_plazo,
                                                                                                                                        id_lugar_seguro_largo_plazo: id_lugar_seguro_largo_plazo,
                                                                                                                                        id_lugar_seguro_salud: id_lugar_seguro_salud,
                                                                                                                                    }, {

                                                                                                                                            where: {
                                                                                                                                                id: pacienteFound.empleadosFichas[0].id
                                                                                                                                            }, transaction: t

                                                                                                                                        }).then(function (fichaCreada) {
                                                                                                                                            if (empleado.seguro1) {

                                                                                                                                                return Clase.find({
                                                                                                                                                    where: { habilitado: true, nombre: empleado.seguro1, id_tipo: tipoEncontradoRRHH_OST.dataValues.id }, transaction: t
                                                                                                                                                }).then(function (claseOtroSeguroEncontrada) {
                                                                                                                                                    return RrhhEmpleadoFichaOtrosSeguros.create({
                                                                                                                                                        id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                                                                        id_tipo_seguro: claseOtroSeguroEncontrada.id,
                                                                                                                                                        monto: empleado.monto1,
                                                                                                                                                        observacion: empleado.observacion2
                                                                                                                                                    }, { transaction: t }).then(function (seguroCreado) {
                                                                                                                                                        if (empleado.seguro2) {

                                                                                                                                                            return Clase.find({
                                                                                                                                                                where: { habilitado: true, nombre: empleado.seguro2, id_tipo: tipoEncontradoRRHH_OST.dataValues.id }, transaction: t
                                                                                                                                                            }).then(function (claseOtroSeguroEncontrada) {
                                                                                                                                                                return RrhhEmpleadoFichaOtrosSeguros.create({
                                                                                                                                                                    id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                                                                                    id_tipo_seguro: claseOtroSeguroEncontrada.id,
                                                                                                                                                                    monto: empleado.monto2,
                                                                                                                                                                    observacion: empleado.observacion2
                                                                                                                                                                }, { transaction: t }).then(function (seguroCreado) {
                                                                                                                                                                    return new Promise(function (fulfill, reject) {
                                                                                                                                                                        fulfill(seguroCreado);
                                                                                                                                                                    });
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
                                                                                                                                                })

                                                                                                                                            } else if (empleado.seguro2) {

                                                                                                                                                return Clase.find({
                                                                                                                                                    where: { habilitado: true, nombre: empleado.seguro2, id_tipo: tipoEncontradoRRHH_OST.dataValues.id }, transaction: t
                                                                                                                                                }).then(function (claseOtroSeguroEncontrada) {
                                                                                                                                                    return RrhhEmpleadoFichaOtrosSeguros.create({
                                                                                                                                                        id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                                                                        id_tipo_seguro: claseOtroSeguroEncontrada.id,
                                                                                                                                                        monto: empleado.monto2,
                                                                                                                                                        observacion: empleado.observacion2
                                                                                                                                                    }, { transaction: t }).then(function (seguroCreado) {
                                                                                                                                                        return new Promise(function (fulfill, reject) {
                                                                                                                                                            fulfill(seguroCreado);
                                                                                                                                                        });
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

                                                                                                                                            } else {
                                                                                                                                                return new Promise(function (fulfill, reject) {
                                                                                                                                                    reject((err.stack !== undefined) ? err.stack : err);
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
                                                                        } else {
                                                                            return new Promise(function (fulfill, reject) {
                                                                                fulfill();
                                                                            });
                                                                        }
                                                                    }).catch(function (err) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                                        });
                                                                    }))
                                                                })
                                                                return Promise.all(promises);
                                                            }).then(function (result) {
                                                                res.json({ mensaje: "¡Datos de empleados actualizados satisfactoriamente!" });
                                                            }).catch(function (err) {
                                                                res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
                                                            });
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
            })
            /* req.body.arregloAporteAfp.forEach(function (dato, index, array) {
            Tipo.find({
                where: { nombre_corto: 'RRHH_ASLP', id_empresa: req.params.id_empresa }
            }).then(function (tipoEncontrado) {
                Clase.findOrCreate({
                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                    defaults: {
                        nombre: dato,
                        id_tipo: tipoEncontrado.dataValues.id,
                        habilitado: true
                    }
                }).spread(function (datos, cread) {
                    if (index === (array.length - 1)) {
                        req.body.arregloLugarAfp.forEach(function (dato, index, array) {
                            Tipo.find({
                                where: { nombre_corto: 'RRHH_LSS', id_empresa: req.params.id_empresa }
                            }).then(function (tipoEncontrado) {
                                Clase.findOrCreate({
                                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                    defaults: {
                                        nombre: dato,
                                        id_tipo: tipoEncontrado.dataValues.id,
                                        habilitado: true
                                    }
                                }).spread(function (datos, cread) {
                                    if (index === (array.length - 1)) {
                                        req.body.arregloLugarSeguroSalud.forEach(function (dato, index, array) {
                                            Tipo.find({
                                                where: { nombre_corto: 'RRHH_LSS', id_empresa: req.params.id_empresa }
                                            }).then(function (tipoEncontrado) {
                                                Clase.findOrCreate({
                                                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                                    defaults: {
                                                        nombre: dato,
                                                        id_tipo: tipoEncontrado.dataValues.id,
                                                        habilitado: true
                                                    }
                                                }).spread(function (datos, cread) {
                                                    if (index === (array.length - 1)) {
                                                        req.body.arregloTipoPersona.forEach(function (dato, index, array) {
                                                            Tipo.find({
                                                                where: { nombre_corto: 'RRHH_TP', id_empresa: req.params.id_empresa }
                                                            }).then(function (tipoEncontrado) {
                                                                Clase.findOrCreate({
                                                                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                                                    defaults: {
                                                                        nombre: dato,
                                                                        id_tipo: tipoEncontrado.dataValues.id,
                                                                        habilitado: true
                                                                    }
                                                                }).spread(function (datos, cread) {
                                                                    if (index === (array.length - 1)) {
                                                                        req.body.arregloCargaHorario.forEach(function (dato, index, array) {
                                                                            Tipo.find({
                                                                                where: { nombre_corto: 'RRHH_CH', id_empresa: req.params.id_empresa }
                                                                            }).then(function (tipoEncontrado) {
                                                                                Clase.findOrCreate({
                                                                                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                                                                    defaults: {
                                                                                        nombre: dato,
                                                                                        id_tipo: tipoEncontrado.dataValues.id,
                                                                                        habilitado: true
                                                                                    }
                                                                                }).spread(function (datos, cread) {
                                                                                    if (index === (array.length - 1)) {
                                                                                        req.body.arregloArega.forEach(function (dato, index, array) {
                                                                                            Tipo.find({
                                                                                                where: { nombre_corto: 'RRHH_AREA', id_empresa: req.params.id_empresa }
                                                                                            }).then(function (tipoEncontrado) {
                                                                                                Clase.findOrCreate({
                                                                                                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                                                                                    defaults: {
                                                                                                        nombre: dato,
                                                                                                        id_tipo: tipoEncontrado.dataValues.id,
                                                                                                        habilitado: true
                                                                                                    }
                                                                                                }).spread(function (datos, cread) {
                                                                                                    if (index === (array.length - 1)) {
                                                                                                        req.body.arregloUbicacion.forEach(function (dato, index, array) {
                                                                                                            Tipo.find({
                                                                                                                where: { nombre_corto: 'RRHH_UBI', id_empresa: req.params.id_empresa }
                                                                                                            }).then(function (tipoEncontrado) {
                                                                                                                Clase.findOrCreate({
                                                                                                                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                                                                                                    defaults: {
                                                                                                                        nombre: dato,
                                                                                                                        id_tipo: tipoEncontrado.dataValues.id,
                                                                                                                        habilitado: true
                                                                                                                    }
                                                                                                                }).spread(function (datos, cread) {
                                                                                                                    if (index === (array.length - 1)) {
                                                                                                                        req.body.arregloEstadoCivil.forEach(function (dato, index, array) {
                                                                                                                            Tipo.find({
                                                                                                                                where: { nombre_corto: 'RRHH_EC', id_empresa: req.params.id_empresa }
                                                                                                                            }).then(function (tipoEncontrado) {
                                                                                                                                Clase.findOrCreate({
                                                                                                                                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                                                                                                                    defaults: {
                                                                                                                                        nombre: dato,
                                                                                                                                        id_tipo: tipoEncontrado.dataValues.id,
                                                                                                                                        habilitado: true
                                                                                                                                    }
                                                                                                                                }).spread(function (datos, cread) {
                                                                                                                                    if (index === (array.length - 1)) {
                                                                                                                                        req.body.arregloOtrosSeguros1.forEach(function (dato, index, array) {
                                                                                                                                            Tipo.find({
                                                                                                                                                where: { nombre_corto: 'RRHH_OST', id_empresa: req.params.id_empresa }
                                                                                                                                            }).then(function (tipoEncontrado) {
                                                                                                                                                Clase.findOrCreate({
                                                                                                                                                    where: { habilitado: true, nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                                                                                                                                    defaults: {
                                                                                                                                                        nombre: dato,
                                                                                                                                                        id_tipo: tipoEncontrado.dataValues.id,
                                                                                                                                                        habilitado: true
                                                                                                                                                    }
                                                                                                                                                }).spread(function (datos, cread) {
                                                                                                                                                    if (index === (array.length - 1)) {
                                                                                                                                                        if (req.body.arregloOtrosSeguros2.length > 0) {
                                                                                                                                                            req.body.arregloOtrosSeguros2.forEach(function (dato, index, array) {
                                                                                                                                                                Tipo.find({
                                                                                                                                                                    where: { nombre_corto: 'RRHH_OST', id_empresa: req.params.id_empresa }
                                                                                                                                                                }).then(function (tipoEncontrado) {
                                                                                                                                                                    Clase.findOrCreate({
                                                                                                                                                                        where: { nombre: dato, id_tipo: tipoEncontrado.dataValues.id },
                                                                                                                                                                        defaults: {
                                                                                                                                                                            habilitado: true,
                                                                                                                                                                            nombre: dato,
                                                                                                                                                                            id_tipo: tipoEncontrado.dataValues.id,
                                                                                                                                                                            habilitado: true
                                                                                                                                                                        }
                                                                                                                                                                    }).spread(function (datos, cread) {
                                                                                                                                                                        if (index === (array.length - 1)) {
                                                                                                                                                                            guardarFichas(req, res)
                                                                                                                                                                        }
                                                                                                                                                                    })
                                                                                                                                                                })
                                                                                                                                                            })
                                                                                                                                                        } else {
                                                                                                                                                            if (index === (array.length - 1)) {
                                                                                                                                                                guardarFichas(req, res)
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                })
                                                                                                                                            })
                                                                                                                                        })
                                                                                                                                    }
                                                                                                                                })
                                                                                                                            })
                                                                                                                        })
                                                                                                                    }
                                                                                                                })
                                                                                                            })
                                                                                                        })
                                                                                                    }
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                    }
                                                                                })
                                                                            })
                                                                        })
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    }
                                                })
                                            })
                                        })
                                    }
                                })
                            })
                        })
 
                    }
                })
            })
        }) */

        })
    /* function guardarFichas(req, res) {
        req.body.fichas.forEach(function (empleado, index, array) {
            MedicoPaciente.find({
                where: { codigo: empleado.codigo, id_empresa: req.params.id_empresa }
                , include: [{ model: Persona, as: 'persona' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', required: false, limit: 1, order: [["id", "desc"]] }]
            }).then(function (pacienteFound) {
                if (pacienteFound != null) {
                    Tipo.find({
                        where: { nombre_corto: 'NAC' }
                    }).then(function (tipoEncontrado) {
                        Clase.find({
                            where: { habilitado: true, nombre: empleado.nacionalidad, id_tipo: tipoEncontrado.dataValues.id }
                        }).then(function (claseNacEncontrada) {
                            Tipo.find({
                                where: { nombre_corto: 'DEP' }
                            }).then(function (tipoEncontrado) {
                                Clase.find({
                                    where: { habilitado: true, nombre: empleado.departamento, id_tipo: tipoEncontrado.dataValues.id }
                                }).then(function (claseDepEncontrada) {
                                    Tipo.find({
                                        where: { nombre_corto: 'MUN' }
                                    }).then(function (tipoEncontrado) {
                                        Clase.find({
                                            where: { habilitado: true, nombre: empleado.provincia, id_tipo: tipoEncontrado.dataValues.id }
                                        }).then(function (claseMunEncontrada) {
                                            Tipo.find({
                                                where: { nombre_corto: 'LOC' }
                                            }).then(function (tipoEncontrado) {
                                                Clase.find({
                                                    where: { habilitado: true, nombre: empleado.provincia, id_tipo: tipoEncontrado.dataValues.id }
                                                }).then(function (claseLocEncontrada) {
                                                    Tipo.find({
                                                        where: { nombre_corto: 'RRHH_EC', id_empresa: req.params.id_empresa }
                                                    }).then(function (tipoEncontrado) {
                                                        Clase.find({
                                                            where: { habilitado: true, nombre: empleado.estado_civil, id_tipo: tipoEncontrado.dataValues.id }
                                                        }).then(function (claseEncontrada) {
                                                            var idNac = (claseNacEncontrada) ? claseNacEncontrada.id : null
                                                            var idDep = (claseDepEncontrada) ? claseDepEncontrada.id : null
                                                            var idProv = (claseMunEncontrada) ? claseMunEncontrada.id : null
                                                            var idLoc = (claseLocEncontrada) ? claseLocEncontrada.id : null
                                                            if (!pacienteFound.persona) {
                                                                console.log(pacienteFound)
                                                                console.log("pacienteFound")
                                                            }
                                                            Persona.update({
                                                                id_estado_civil: claseEncontrada.id,
                                                                id_pais_nacimiento: idNac,
                                                                id_ciudad_nacimiento: idDep,
                                                                id_provincia_nacimiento: idProv,
                                                                id_localidad_nacimiento: idLoc
                                                            }, {
                                                                    where: { id: pacienteFound.persona.id }
                                                                }).then(function (PersonaActualizada) {
                                                                    Tipo.find({
                                                                        where: { nombre_corto: 'RRHH_TP', id_empresa: req.params.id_empresa }
                                                                    }).then(function (tipoEncontrado) {
                                                                        Clase.find({
                                                                            where: { habilitado: true, nombre: empleado.tipo_personal, id_tipo: tipoEncontrado.dataValues.id }
                                                                        }).then(function (clasePersonaEncontrada) {
                                                                            Tipo.find({
                                                                                where: { nombre_corto: 'RRHH_CH', id_empresa: req.params.id_empresa }
                                                                            }).then(function (tipoEncontrado) {
                                                                                Clase.find({
                                                                                    where: { habilitado: true, nombre: empleado.carga_horario, id_tipo: tipoEncontrado.dataValues.id }
                                                                                }).then(function (claseCargaEncontrada) {
                                                                                    Tipo.find({
                                                                                        where: { nombre_corto: 'RRHH_AREA', id_empresa: req.params.id_empresa }
                                                                                    }).then(function (tipoEncontrado) {
                                                                                        Clase.find({
                                                                                            where: { habilitado: true, nombre: empleado.area, id_tipo: tipoEncontrado.dataValues.id }
                                                                                        }).then(function (claseAreaEncontrada) {
                                                                                            Tipo.find({
                                                                                                where: { nombre_corto: 'RRHH_UBI', id_empresa: req.params.id_empresa }
                                                                                            }).then(function (tipoEncontrado) {
                                                                                                Clase.find({
                                                                                                    where: { habilitado: true, nombre: empleado.ubicacion, id_tipo: tipoEncontrado.dataValues.id }
                                                                                                }).then(function (claseUbicacionEncontrada) {
                                                                                                    Tipo.find({
                                                                                                        where: { nombre_corto: 'RRHH_LSS', id_empresa: req.params.id_empresa }
                                                                                                    }).then(function (tipoEncontrado) {
                                                                                                        Clase.find({
                                                                                                            where: { habilitado: true, nombre: empleado.lugar_afp, id_tipo: tipoEncontrado.dataValues.id }
                                                                                                        }).then(function (claseLugarSeguroAfpEncontrada) {
                                                                                                            Clase.find({
                                                                                                                where: { habilitado: true, nombre: empleado.lugar_seguro, id_tipo: tipoEncontrado.dataValues.id }
                                                                                                            }).then(function (claseLugarSeguroEncontrada) {
                                                                                                                Tipo.find({
                                                                                                                    where: { nombre_corto: 'RRHH_ASLP', id_empresa: req.params.id_empresa }
                                                                                                                }).then(function (tipoEncontrado) {
                                                                                                                    Clase.find({
                                                                                                                        where: { habilitado: true, nombre: empleado.afp_aporte, id_tipo: tipoEncontrado.dataValues.id }
                                                                                                                    }).then(function (claseAfpEncontrada) {

                                                                                                                        var id_tipo_personal = (clasePersonaEncontrada) ? clasePersonaEncontrada.id : null,
                                                                                                                            id_carga_horarios = (clasePersonaEncontrada) ? claseCargaEncontrada.id : null,
                                                                                                                            id_area = (clasePersonaEncontrada) ? claseAreaEncontrada.id : null,
                                                                                                                            id_ubicacion = (clasePersonaEncontrada) ? claseUbicacionEncontrada.id : null,
                                                                                                                            nua_seguro_largo_plazo = (clasePersonaEncontrada) ? empleado.nua_cua : null,
                                                                                                                            id_aporte_seguro_largo_plazo = (clasePersonaEncontrada) ? claseAfpEncontrada.id : null,
                                                                                                                            id_lugar_seguro_largo_plazo = (clasePersonaEncontrada) ? claseLugarSeguroAfpEncontrada.id : null,
                                                                                                                            id_lugar_seguro_salud = (clasePersonaEncontrada) ? claseLugarSeguroEncontrada.id : null;
                                                                                                                        RrhhEmpleadoFicha.update({
                                                                                                                            id_tipo_personal: id_tipo_personal,
                                                                                                                            id_carga_horarios: id_carga_horarios,
                                                                                                                            id_area: id_area,
                                                                                                                            id_ubicacion: id_ubicacion,
                                                                                                                            nua_seguro_largo_plazo: nua_seguro_largo_plazo,
                                                                                                                            id_aporte_seguro_largo_plazo: id_aporte_seguro_largo_plazo,
                                                                                                                            id_lugar_seguro_largo_plazo: id_lugar_seguro_largo_plazo,
                                                                                                                            id_lugar_seguro_salud: id_lugar_seguro_salud,
                                                                                                                        }, {

                                                                                                                                where: {
                                                                                                                                    id: pacienteFound.empleadosFichas[0].id
                                                                                                                                }

                                                                                                                            }).then(function (fichaCreada) {
                                                                                                                                if (empleado.seguro1) {
                                                                                                                                    Tipo.find({
                                                                                                                                        where: { nombre_corto: 'RRHH_OST', id_empresa: req.params.id_empresa }
                                                                                                                                    }).then(function (tipoEncontrado) {
                                                                                                                                        Clase.find({
                                                                                                                                            where: { habilitado: true, nombre: empleado.seguro1, id_tipo: tipoEncontrado.dataValues.id }
                                                                                                                                        }).then(function (claseOtroSeguroEncontrada) {
                                                                                                                                            RrhhEmpleadoFichaOtrosSeguros.create({
                                                                                                                                                id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                                                                id_tipo_seguro: claseOtroSeguroEncontrada.id,
                                                                                                                                                monto: empleado.monto1,
                                                                                                                                                observacion: empleado.observacion2
                                                                                                                                            }).then(function (seguroCreado) {
                                                                                                                                                if (empleado.seguro2) {
                                                                                                                                                    Tipo.find({
                                                                                                                                                        where: { nombre_corto: 'RRHH_OST', id_empresa: req.params.id_empresa }
                                                                                                                                                    }).then(function (tipoEncontrado) {
                                                                                                                                                        Clase.find({
                                                                                                                                                            where: { habilitado: true, nombre: empleado.seguro2, id_tipo: tipoEncontrado.dataValues.id }
                                                                                                                                                        }).then(function (claseOtroSeguroEncontrada) {
                                                                                                                                                            RrhhEmpleadoFichaOtrosSeguros.create({
                                                                                                                                                                id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                                                                                id_tipo_seguro: claseOtroSeguroEncontrada.id,
                                                                                                                                                                monto: empleado.monto2,
                                                                                                                                                                observacion: empleado.observacion2
                                                                                                                                                            }).then(function (seguroCreado) {
                                                                                                                                                                if (index === (array.length - 1)) {
                                                                                                                                                                    res.json({ mensaje: 'importacion satisfactoria!' })
                                                                                                                                                                }
                                                                                                                                                            }).catch(function (err) {
                                                                                                                                                                res.json({ mensaje: err.stack });
                                                                                                                                                            });
                                                                                                                                                        }).catch(function (err) {
                                                                                                                                                            res.json({ mensaje: err.stack });
                                                                                                                                                        });
                                                                                                                                                    }).catch(function (err) {
                                                                                                                                                        res.json({ mensaje: err.stack });
                                                                                                                                                    });
                                                                                                                                                } else {
                                                                                                                                                    if (index === (array.length - 1)) {
                                                                                                                                                        res.json({ mensaje: 'importacion satisfactoria!' })
                                                                                                                                                    }
                                                                                                                                                }

                                                                                                                                            }).catch(function (err) {
                                                                                                                                                res.json({ mensaje: err.stack });
                                                                                                                                            });
                                                                                                                                        }).catch(function (err) {
                                                                                                                                            res.json({ mensaje: err.stack });
                                                                                                                                        });
                                                                                                                                    }).catch(function (err) {
                                                                                                                                        res.json({ mensaje: err.stack });
                                                                                                                                    });
                                                                                                                                } else if (empleado.seguro2) {
                                                                                                                                    Tipo.find({
                                                                                                                                        where: { nombre_corto: 'RRHH_OST', id_empresa: req.params.id_empresa }
                                                                                                                                    }).then(function (tipoEncontrado) {
                                                                                                                                        Clase.find({
                                                                                                                                            where: { habilitado: true, nombre: empleado.seguro2, id_tipo: tipoEncontrado.dataValues.id }
                                                                                                                                        }).then(function (claseOtroSeguroEncontrada) {
                                                                                                                                            RrhhEmpleadoFichaOtrosSeguros.create({
                                                                                                                                                id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                                                                id_tipo_seguro: claseOtroSeguroEncontrada.id,
                                                                                                                                                monto: empleado.monto2,
                                                                                                                                                observacion: empleado.observacion2
                                                                                                                                            }).then(function (seguroCreado) {
                                                                                                                                                if (index === (array.length - 1)) {
                                                                                                                                                    res.json({ mensaje: 'importacion satisfactoria!' })
                                                                                                                                                }
                                                                                                                                            }).catch(function (err) {
                                                                                                                                                res.json({ mensaje: err.stack });
                                                                                                                                            });
                                                                                                                                        }).catch(function (err) {
                                                                                                                                            res.json({ mensaje: err.stack });
                                                                                                                                        });
                                                                                                                                    }).catch(function (err) {
                                                                                                                                        res.json({ mensaje: err.stack });
                                                                                                                                    });
                                                                                                                                } else {
                                                                                                                                    if (index === (array.length - 1)) {
                                                                                                                                        res.json({ mensaje: 'importacion satisfactoria!' })
                                                                                                                                    }
                                                                                                                                }

                                                                                                                            }).catch(function (err) {
                                                                                                                                res.json({ mensaje: err.stack });
                                                                                                                            });
                                                                                                                    }).catch(function (err) {
                                                                                                                        res.json({ mensaje: err.stack });
                                                                                                                    });
                                                                                                                }).catch(function (err) {
                                                                                                                    res.json({ mensaje: err.stack });
                                                                                                                });
                                                                                                            }).catch(function (err) {
                                                                                                                res.json({ mensaje: err.stack });
                                                                                                            });
                                                                                                        }).catch(function (err) {
                                                                                                            res.json({ mensaje: err.stack });
                                                                                                        });
                                                                                                    }).catch(function (err) {
                                                                                                        res.json({ mensaje: err.stack });
                                                                                                    });
                                                                                                }).catch(function (err) {
                                                                                                    res.json({ mensaje: err.stack });
                                                                                                });
                                                                                            }).catch(function (err) {
                                                                                                res.json({ mensaje: err.stack });
                                                                                            });
                                                                                        }).catch(function (err) {
                                                                                            res.json({ mensaje: err.stack });
                                                                                        });
                                                                                    }).catch(function (err) {
                                                                                        res.json({ mensaje: err.stack });
                                                                                    });
                                                                                }).catch(function (err) {
                                                                                    res.json({ mensaje: err.stack });
                                                                                });
                                                                            }).catch(function (err) {
                                                                                res.json({ mensaje: err.stack });
                                                                            });
                                                                        }).catch(function (err) {
                                                                            res.json({ mensaje: err.stack });
                                                                        });
                                                                    }).catch(function (err) {
                                                                        res.json({ mensaje: err.stack });
                                                                    });


                                                                }).catch(function (err) {
                                                                    res.json({ mensaje: err.stack });
                                                                });


                                                        }).catch(function (err) {
                                                            res.json({ mensaje: err.stack });
                                                        });
                                                    }).catch(function (err) {
                                                        res.json({ mensaje: err.stack });
                                                    });
                                                }).catch(function (err) {
                                                    res.json({ mensaje: err.stack });
                                                });

                                            }).catch(function (err) {
                                                res.json({ mensaje: err.stack });
                                            });
                                        }).catch(function (err) {
                                            res.json({ mensaje: err.stack });
                                        });
                                    }).catch(function (err) {
                                        res.json({ mensaje: err.stack });
                                    });
                                }).catch(function (err) {
                                    res.json({ mensaje: err.stack });
                                });
                            }).catch(function (err) {
                                res.json({ mensaje: err.stack });
                            });
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack });
                        });
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack });
                    });
                } else {
                    if (index === (array.length - 1)) {
                        res.json({ mensaje: 'importacion satisfactoria!' })
                    }
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack });
            })

        })
    } */
    router.route('/empleados/empresa/:id_empresa/rolTurnos/tipo/:tipo/excel/upload')
        .post(function (req, res) {
            var arregloSucursales = []
            var arregloGrupos = []
            req.body.forEach(function (rol, index, array) {
                var bandera = false
                if (arregloSucursales.length > 0) {
                    for (var i = 0; i < arregloSucursales.length; i++) {
                        var element = arregloSucursales[i];
                        if (rol.campo != null) {
                            if (element == rol.campo) {
                                bandera = true
                            }
                        }
                    }
                    if (!bandera) {

                        arregloSucursales.push(rol.campo)

                    }
                } else {
                    arregloSucursales.push(rol.campo)

                }
                var bandera2 = false
                if (arregloGrupos.length > 0) {
                    for (var i = 0; i < arregloGrupos.length; i++) {
                        var element = arregloGrupos[i];
                        if (rol.grupo != null) {
                            if (element == rol.grupo) {
                                bandera2 = true
                            }
                        }
                    }
                    if (!bandera2) {

                        arregloGrupos.push(rol.grupo)

                    }
                } else {
                    arregloGrupos.push(rol.grupo)

                }
                if (index === (array.length - 1)) {
                    arregloSucursales.forEach(function (sucursal, index2, array2) {
                        Tipo.find({
                            where: {
                                nombre_corto: 'CENCOS',
                                id_empresa: req.params.id_empresa
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
                            }).spread(function (dato, created) {
                                if (index2 === (array2.length - 1)) {
                                    arregloGrupos.forEach(function (grupo, index3, array3) {
                                        Tipo.find({
                                            where: {
                                                nombre_corto: 'RRHH_GROL',
                                                id_empresa: req.params.id_empresa
                                            }
                                        }).then(function (tipo) {
                                            Clase.findOrCreate({
                                                where: {

                                                    nombre_corto: grupo,
                                                    id_tipo: tipo.dataValues.id
                                                },
                                                defaults: {
                                                    nombre: "GRUPO " + grupo,
                                                    nombre_corto: grupo,
                                                    id_tipo: tipo.dataValues.id,
                                                    habilitado: true
                                                }
                                            }).spread(function (dato, created) {
                                                if (index3 === (array3.length - 1)) {
                                                    req.body.forEach(function (rol, index, array) {
                                                        MedicoPaciente.find({
                                                            where: { codigo: rol.codigo, id_empresa: req.params.id_empresa }
                                                            , include: [{ model: RrhhEmpleadoFicha, as: 'empleadosFichas', required: false, limit: 1, order: [["id", "desc"]] }]
                                                        }).then(function (pacienteFound) {
                                                            var sucursal = rol.campo
                                                            if (pacienteFound != null) {
                                                                Tipo.find({
                                                                    where: {
                                                                        nombre_corto: 'CENCOS',
                                                                        id_empresa: req.params.id_empresa
                                                                    }
                                                                }).then(function (tipo) {
                                                                    Clase.find({
                                                                        where: {
                                                                            nombre: sucursal,
                                                                            id_tipo: tipo.id
                                                                        }
                                                                    }).then(function (CentroCosto) {
                                                                        if (CentroCosto) {
                                                                            Tipo.find({
                                                                                where: {
                                                                                    nombre_corto: 'RRHH_GROL',
                                                                                    id_empresa: req.params.id_empresa
                                                                                }
                                                                            }).then(function (tipo) {
                                                                                Clase.find({
                                                                                    where: {
                                                                                        nombre_corto: rol.grupo,
                                                                                        id_tipo: tipo.dataValues.id
                                                                                    }
                                                                                }).then(function (Grupo) {
                                                                                    if (Grupo) {
                                                                                        RrhhEmpleadoRolTurno.find({
                                                                                            where: {
                                                                                                id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                tipo: rol.tipo
                                                                                            },
                                                                                            limit: 1,
                                                                                            order: [['id', 'desc']]
                                                                                        }).then(function (rolEncontrado) {
                                                                                            if (req.params.tipo != 'false') {
                                                                                                RrhhEmpleadoRolTurno.update({
                                                                                                    id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                    id_campo: CentroCosto.id,
                                                                                                    fecha_inicio: rol.fecha_inicio,
                                                                                                    fecha_fin: rol.fecha_fin,
                                                                                                    tipo: rol.tipo,
                                                                                                    dias_trabajado: rol.dias_trabajo,
                                                                                                    dias_descanso: rol.dias_descanso,
                                                                                                    id_grupo: Grupo.id,
                                                                                                    eliminado: false
                                                                                                }, {
                                                                                                        where: { id: rolEncontrado.id }
                                                                                                    }).then(function (empleadoRolTurnoActualizado) {
                                                                                                        if (index === (array.length - 1)) {
                                                                                                            res.json({ mensaje: "Registros actualizados satisfactoria!" })
                                                                                                        }

                                                                                                    })
                                                                                            } else {
                                                                                                if (rolEncontrado) {
                                                                                                    RrhhEmpleadoRolTurno.update({
                                                                                                        fecha_fin: rol.fecha_inicio
                                                                                                    }, {
                                                                                                            where: { id: rolEncontrado.id }
                                                                                                        }).then(function (empleadoRolTurnoActualizado) {
                                                                                                            RrhhEmpleadoRolTurno.create({
                                                                                                                id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                                id_campo: CentroCosto.id,
                                                                                                                fecha_inicio: rol.fecha_inicio,
                                                                                                                fecha_fin: rol.fecha_fin,
                                                                                                                tipo: rol.tipo,
                                                                                                                dias_trabajado: rol.dias_trabajo,
                                                                                                                dias_descanso: rol.dias_descanso,
                                                                                                                id_grupo: Grupo.id,
                                                                                                                eliminado: false
                                                                                                            }).then(function (empleadoRolTurnoCreado) {
                                                                                                                if (index === (array.length - 1)) {
                                                                                                                    res.json({ mensaje: "Nuevos registros creados satisfactoria!" })
                                                                                                                }

                                                                                                            })
                                                                                                        })
                                                                                                } else {
                                                                                                    RrhhEmpleadoRolTurno.create({
                                                                                                        id_ficha: pacienteFound.empleadosFichas[0].id,
                                                                                                        id_campo: CentroCosto.id,
                                                                                                        fecha_inicio: rol.fecha_inicio,
                                                                                                        fecha_fin: rol.fecha_fin,
                                                                                                        tipo: rol.tipo,
                                                                                                        dias_trabajado: rol.dias_trabajo,
                                                                                                        dias_descanso: rol.dias_descanso,
                                                                                                        id_grupo: Grupo.id,
                                                                                                        eliminado: false
                                                                                                    }).then(function (empleadoRolTurnoCreado) {
                                                                                                        if (index === (array.length - 1)) {
                                                                                                            res.json({ mensaje: "Nuevos registros creados satisfactoria!" })
                                                                                                        }

                                                                                                    })
                                                                                                }
                                                                                            }
                                                                                        })

                                                                                    } else {
                                                                                        if (index === (array.length - 1)) {
                                                                                            res.json({ mensaje: "Importacion satisfactoria!" })
                                                                                        }
                                                                                    }
                                                                                })
                                                                            })
                                                                        } else {
                                                                            if (index === (array.length - 1)) {
                                                                                res.json({ mensaje: "Importacion satisfactoria!" })
                                                                            }
                                                                        }
                                                                    })
                                                                })
                                                            } else {
                                                                if (index === (array.length - 1)) {
                                                                    res.json({ mensaje: "Importacion satisfactoria!" })
                                                                }
                                                            }
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    })

                                }
                            })
                        })

                    })
                }
            })



        })


    router.route('/empleados/empresa/excel/upload')
        .post(function (req, res) {
            var promises = []
            Tipo.find({
                where: {
                    nombre_corto: 'CENCOS',
                    id_empresa: req.body.id_empresa
                }
            }).then(function (tipoCentro) {
                Tipo.find({
                    where: {
                        nombre_corto: 'RRHH_CARGO',
                        id_empresa: req.body.id_empresa
                    }
                }).then(function (tipoCargo) {
                    Tipo.find({
                        where: {
                            nombre_corto: 'RRHH_TC',
                            id_empresa: req.body.id_empresa
                        }
                    }).then(function (tipoContrato) {
                        Tipo.find({
                            where: {
                                nombre_corto: 'RRHH_EXP',
                                id_empresa: req.body.id_empresa
                            }
                        }).then(function (tipoExp) {
                            Tipo.find({
                                where: {
                                    nombre_corto: 'RRHH_SS',
                                    id_empresa: req.body.id_empresa
                                }
                            }).then(function (tipoSeguroSalud) {
                                Tipo.find({
                                    where: { nombre_corto: Diccionario.GENERO }
                                }).then(function (tipoEE) {
                                    Tipo.find({
                                        where: {
                                            nombre_corto: 'RRHH_TEXP',
                                            id_empresa: req.body.id_empresa
                                        }
                                    }).then(function (tipoE) {
                                        sequelize.transaction(function (t) {
                                            for (var i = 0; i < req.body.arregloCargo.length; i++) {
                                                var cargo = req.body.arregloCargo[i];
                                                promises.push(guardarDatosCargo(req, cargo, i, t, tipoCargo))

                                            }
                                            for (var i = 0; i < req.body.arregloContrato.length; i++) {
                                                var contrato = req.body.arregloContrato[i];
                                                promises.push(guardarDatosContrato(req, contrato, i, t, tipoContrato))

                                            }
                                            for (var i = 0; i < req.body.arregloExpedido.length; i++) {
                                                var expedido = req.body.arregloExpedido[i];
                                                promises.push(guardarDatosExpedido(req, expedido, i, t, tipoExp))

                                            }
                                            for (var i = 0; i < req.body.arregloSegurosSalud.length; i++) {
                                                var seguroSalud = req.body.arregloSegurosSalud[i];
                                                promises.push(guardarDatosSeguro(req, seguroSalud, i, t, tipoSeguroSalud))

                                            }
                                            for (var i = 0; i < req.body.arregloSucursales.length; i++) {
                                                var sucursal = req.body.arregloSucursales[i];
                                                promises.push(guardarDatosSucursal(req, sucursal, i, t))

                                            }
                                            for (var i = 0; i < req.body.arregloSucursales.length; i++) {
                                                var sucursal = req.body.arregloSucursales[i];
                                                promises.push(guardarDatosCentroCostos(req, sucursal, i, t, tipoCentro))

                                            }

                                            for (var i = 0; i < req.body.pacientes.length; i++) {
                                                var paciente = req.body.pacientes[i];
                                                promises.push(guardarDatosEmpleado(req, paciente, i, t, tipoCentro,
                                                    tipoCargo,
                                                    tipoContrato,
                                                    tipoExp,
                                                    tipoSeguroSalud, tipoEE, tipoE))
                                            }

                                            return Promise.all(promises);
                                        }).then(function (result) {
                                            res.json({ mensaje: "¡Datos de empleados actualizados satisfactoriamente!" });
                                        }).catch(function (err) {
                                            res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
                                        });
                                    }).catch(function (err) {
                                        res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
                                    });
                                }).catch(function (err) {
                                    res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
                                });
                            }).catch(function (err) {
                                res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
                            });
                        }).catch(function (err) {
                            res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
                        });
                    }).catch(function (err) {
                        res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
                    });
                }).catch(function (err) {
                    res.json({ hasError: true, mensaje: err.stack ? err.stack : err });
                });
            })
        })
    function guardarDatosSucursal(req, sucursal, i, t) {
        return Sucursal.findOrCreate({
            where: {
                nombre: sucursal,
                id_empresa: req.body.id_empresa
            },
            defaults: {
                nombre: sucursal,
                id_empresa: req.body.id_empresa
            }, transaction: t
        }).spread(function (sucursalC, created) {
            return new Promise(function (fulfill, reject) {
                fulfill()
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })
    }
    function guardarDatosCentroCostos(req, sucursal, i, t, tipo) {

        return Clase.findOrCreate({
            where: {
                nombre: sucursal,
                nombre_corto: sucursal,
                id_tipo: tipo.dataValues.id
            },
            defaults: {
                nombre: sucursal,
                id_tipo: tipo.dataValues.id,
                habilitado: true
            }, transaction: t
        }).spread(function (sucursalC, created) {
            return new Promise(function (fulfill, reject) {
                fulfill()
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })

    }
    function guardarDatosCargo(req, cargo, i, t, tipoCargo) {


        var nombre_corto = cargo.substr(0, 3);
        return Clase.findOrCreate({
            where: {
                nombre: cargo,
                id_tipo: tipoCargo.dataValues.id,
            },
            defaults: {
                id_tipo: tipoCargo.dataValues.id,
                nombre: cargo,
                nombre_corto: nombre_corto,
                habilitado: true
            }, transaction: t
        }).spread(function (cargoC, created) {
            return new Promise(function (fulfill, reject) {
                fulfill()
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })

    }
    function guardarDatosContrato(req, contrato, i, t, tipoContrato) {

        var nombre_corto3 = contrato.substr(0, 3);
        return Clase.findOrCreate({
            where: {
                nombre: contrato,
                id_tipo: tipoContrato.dataValues.id,
            },

            defaults: {
                id_tipo: tipoContrato.dataValues.id,
                nombre: contrato,
                nombre_corto: nombre_corto3,
                habilitado: true

            }, transaction: t
        }).spread(function (contratoC, created) {
            return new Promise(function (fulfill, reject) {
                fulfill()
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })

    }
    function guardarDatosExpedido(req, expedido, i, t, tipoExp) {

        var nombre_corto3 = expedido.substr(0, 3);
        return Clase.findOrCreate({
            where: {
                nombre: expedido,
                id_tipo: tipoExp.dataValues.id,
            },
            defaults: {
                id_tipo: tipoExp.dataValues.id,
                nombre: expedido,
                nombre_corto: nombre_corto3,
                habilitado: true
            }, transaction: t
        }).spread(function (expeditoC, created) {
            return new Promise(function (fulfill, reject) {
                fulfill()
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })

    }
    function guardarDatosSeguro(req, seguroSalud, i, t, tipoSeguroSalud) {

        var nombre_corto3 = seguroSalud.substr(0, 3);
        return Clase.findOrCreate({
            where: {
                nombre: seguroSalud,
                id_tipo: tipoSeguroSalud.dataValues.id,
            },
            defaults: {
                id_tipo: tipoSeguroSalud.dataValues.id,
                nombre: seguroSalud,
                nombre_corto: nombre_corto3,
                habilitado: true
            }, transaction: t
        }).spread(function (seguroSaludC, created) {
            return new Promise(function (fulfill, reject) {
                fulfill()
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })

    }

    function guardarDatosEmpleado(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE) {

        var nombre_corto = pacienteActual.genero.charAt(0)
        return Clase.find({
            where: { nombre_corto: nombre_corto, id_tipo: tipoEE.id },
            transaction: t
        }).then(function (generoEncontrado) {
            return MedicoPaciente.find({
                where: { codigo: pacienteActual.codigo, id_empresa: req.body.id_empresa },
                transaction: t
            }).then(function (pacienteFound) {
                // console.log(pacienteFound)
                return guardarEmpleadoImportacion(req, pacienteActual, i, t, tipoCentro,
                    tipoCargo,
                    tipoContrato,
                    tipoExp,
                    tipoSeguroSalud, tipoEE, tipoE, pacienteFound, generoEncontrado)

            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            })
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            })
        })



    }
    function guardarEmpleadoImportacion(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, generoEncontrado) {
        if (pacienteFound != null) {
            var imagen;
            if (pacienteActual.imagen.indexOf('default') > -1) {
                imagen = pacienteActual.imagen;
            } else {
                var imagenPersona = decodeBase64Image(pacienteActual.imagen);
                fs.writeFileSync('./img/persona' + pacienteFound.id_persona + '.jpg', imagenPersona.data, 'base64', function (err) { });
                imagen = './img/persona' + pacienteFound.id_persona + '.jpg';
            }
            var nombre = ""
            if (pacienteActual.nombres) {
                nombre += pacienteActual.nombres
            }
            if (pacienteActual.segundo_nombre) {
                nombre += ' ' + pacienteActual.segundo_nombre
            }
            if (pacienteActual.apellido_paterno) {
                nombre += ' ' + pacienteActual.apellido_paterno
            }
            if (pacienteActual.apellido_materno) {
                nombre += ' ' + pacienteActual.apellido_materno
            }

            return Persona.update({
                nombres: pacienteActual.nombres,
                segundo_nombre: pacienteActual.segundo_nombre,
                apellido_paterno: pacienteActual.apellido_paterno,
                apellido_materno: pacienteActual.apellido_materno,
                ci: pacienteActual.ci,
                imagen: imagen,
                id_genero: generoEncontrado.id,
                nombre_completo: nombre,
                telefono: pacienteActual.telefono,
                telefono_movil: pacienteActual.telefono_movil,
                fecha_nacimiento: pacienteActual.fecha_nacimiento,
                activo: true,
            }, {
                    where: {
                        id: pacienteFound.id_persona
                    },
                    transaction: t
                }).then(function (personaActualizada) {
                    var persona = { id: pacienteFound.id_persona }
                    return guardarDatosEmpleadoExtension(req, pacienteActual, i, t, tipoCentro,
                        tipoCargo,
                        tipoContrato,
                        tipoExp,
                        tipoSeguroSalud, tipoEE, tipoE, persona, pacienteFound)
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                })


        } else {
            console.log('paciente nuevo')
            var nombre = ""
            if (pacienteActual.nombres) {
                nombre += pacienteActual.nombres
            }
            if (pacienteActual.segundo_nombre) {
                nombre += ' ' + pacienteActual.segundo_nombre
            }
            if (pacienteActual.apellido_paterno) {
                nombre += ' ' + pacienteActual.apellido_paterno
            }
            if (pacienteActual.apellido_materno) {
                nombre += ' ' + pacienteActual.apellido_materno
            }
            return Persona.create({
                nombres: pacienteActual.nombres,
                segundo_nombre: pacienteActual.segundo_nombre,
                apellido_paterno: pacienteActual.apellido_paterno,
                apellido_materno: pacienteActual.apellido_materno,
                ci: pacienteActual.ci,
                id_genero: generoEncontrado.id,
                nombre_completo: nombre,
                telefono: pacienteActual.telefono,
                telefono_movil: pacienteActual.telefono_movil,
                fecha_nacimiento: pacienteActual.fecha_nacimiento,
                activo: true,
            },
                { transaction: t }).then(function (personaCreada) {
                    var imagen;
                    if (pacienteActual.imagen.indexOf('default') > -1) {
                        imagen = pacienteActual.imagen;
                    } else {
                        var imagenPersona = decodeBase64Image(pacienteActual.imagen);
                        fs.writeFileSync('./img/persona' + personaCreada.id + '.jpg', imagenPersona.data, 'base64', function (err) { });
                        imagen = './img/persona' + personaCreada.id + '.jpg';

                    }
                    return Persona.update({
                        imagen: imagen
                    }, {
                            where: {
                                id: personaCreada.id
                            },
                            transaction: t
                        }).then(function (imagenAct) {
                            return guardarDatosEmpleadoExtension(req, pacienteActual, i, t, tipoCentro,
                                tipoCargo,
                                tipoContrato,
                                tipoExp,
                                tipoSeguroSalud, tipoEE, tipoE, personaCreada, pacienteFound)
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
        }
    }
    function guardarDatosEmpleadoExtension(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE, personaCreada, pacienteFound) {
        var nombre_corto2 = pacienteActual.extension.substr(0, 3);
        return Clase.find({
            where: {
                nombre: pacienteActual.extension,
                id_tipo: tipoExp.dataValues.id,
            },
            transaction: t,

        }).then(function (expClase) {
            var idexpClase = null
            if (expClase) {
                idexpClase = expClase.dataValues.id
            }
            return Clase.find({
                where: {
                    nombre: pacienteActual.campamento,
                    id_tipo: tipoCentro.dataValues.id
                },
                transaction: t
            }).then(function (centroCosto) {
                var idcentroCosto = null
                if (centroCosto) {
                    idcentroCosto = centroCosto.id
                }

                return Clase.find({
                    where: {
                        nombre_corto: "CI",
                        id_tipo: tipoE.dataValues.id,
                    },
                    transaction: t,

                }).then(function (TexpClase) {
                    return guardarDatosMedicoPaciente(req, pacienteActual, i, t, tipoCentro,
                        tipoCargo,
                        tipoContrato,
                        tipoExp,
                        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase)
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

    }
    function guardarDatosMedicoPaciente(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase) {
        if (pacienteFound != null) {
            return MedicoPaciente.update({
                id_persona: personaCreada.id,
                id_empresa: req.body.id_empresa,
                codigo: pacienteActual.codigo,
                id_extension: idexpClase,
                cargo: pacienteActual.cargo,
                id_campo: idcentroCosto,
                id_tipo_documento: TexpClase.dataValues.id,
                designacion_empresa: pacienteActual.designacion_empresa,
                eliminado: pacienteActual.eliminado,
                es_empleado: true,
                eliminado: pacienteActual.estado
            }, {
                    where: { id: pacienteFound.id },
                    transaction: t

                }).then(function (medicoPacienteActualizado) {
                    return guardarPersonaReferencia(req, pacienteActual, i, t, tipoCentro,
                        tipoCargo,
                        tipoContrato,
                        tipoExp,
                        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, pacienteFound)
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                })
        } else {
            return MedicoPaciente.create({
                id_persona: personaCreada.id,
                id_empresa: req.body.id_empresa,
                codigo: pacienteActual.codigo,
                id_extension: idexpClase,
                cargo: pacienteActual.cargo,
                id_campo: idcentroCosto,
                id_tipo_documento: TexpClase.dataValues.id,
                designacion_empresa: pacienteActual.designacion_empresa,
                eliminado: pacienteActual.eliminado,
                es_empleado: true,
                eliminado: pacienteActual.estado
                //comentario: pacienteActual.comentario
            },
                { transaction: t }).then(function (medicoPacienteActualizado) {
                    return guardarPersonaReferencia(req, pacienteActual, i, t, tipoCentro,
                        tipoCargo,
                        tipoContrato,
                        tipoExp,
                        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado)
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                })
        }

    }
    function guardarPersonaReferencia(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado) {
        /*   if (pacienteActual.contrato) {
              var nombre_corto3 = pacienteActual.contrato.substr(0, 3);
          } else {
              var nombre_corto3 = null
          } */
        return Clase.find({
            where: {
                nombre: pacienteActual.contrato,
                id_tipo: tipoContrato.dataValues.id,
            },
            transaction: t,

        }).then(function (contratoClase) {
            var idcontratoClase = ""
            if (contratoClase) {
                idcontratoClase = contratoClase.dataValues.id
            }
            var fecha = new Date()

            /*   if (pacienteActual.seguro_salud) {
                  var nombre_corto3 = pacienteActual.seguro_salud.substr(0, 3);
              } else {
                  var nombre_corto3 = null;
              } */
            return Clase.find({
                where: {
                    nombre: pacienteActual.seguro_salud,
                    id_tipo: tipoSeguroSalud.dataValues.id,
                },
                transaction: t,
            }).then(function (SeguroSalud) {
                var idSeguroSalud = null
                if (SeguroSalud) {
                    idSeguroSalud = SeguroSalud.dataValues.id
                }
                return guardarPersonaRefFicha(req, pacienteActual, i, t, tipoCentro,
                    tipoCargo,
                    tipoContrato,
                    tipoExp,
                    tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, idcontratoClase, idSeguroSalud)
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


    }
    function guardarPersonaRefFicha(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, idcontratoClase, idSeguroSalud) {
        if (pacienteFound != null) {
            return RrhhEmpleadoFicha.findAll({
                where: {
                    id_empleado: pacienteFound.id,
                },
                transaction: t,
                include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo', include: [{ model: Tipo, as: 'tipo' }] }] }],
                limit: 1,
                order: [['id', 'desc']]
            }).then(function (fichaEncontrada) {

                return Persona.destroy({
                    where: { id: fichaEncontrada[0].id_persona_referencia },
                    transaction: t,
                }).then(function (personaReferenciaEliminada) {
                    /* if (fecha1 == fecha2) { */
                    return Persona.create({
                        nombres: pacienteActual.personaReferencia.nombre_referencia,
                        telefono: pacienteActual.personaReferencia.telefonos_referencia,
                        telefono_movil: pacienteActual.personaReferencia.celular_referencia,
                        direccion_ciudad: pacienteActual.personaReferencia.ciudad_referencia,
                        direccion_zona: pacienteActual.personaReferencia.zona_referencia,
                        direccion_localidad: pacienteActual.personaReferencia.calle_av_referencia,
                        direccion_numero: pacienteActual.personaReferencia.direccion_numero
                    },
                        {
                            transaction: t
                        }).then(function (personaReferenciaCreada) {
                            return guardarFichasEmpleadoI(req, pacienteActual, i, t, tipoCentro,
                                tipoCargo,
                                tipoContrato,
                                tipoExp,
                                tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud, fichaEncontrada)
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
        } else {
            return Persona.create({
                nombres: pacienteActual.personaReferencia.nombre_referencia,
                telefono: pacienteActual.personaReferencia.telefonos_referencia,
                telefono_movil: pacienteActual.personaReferencia.celular_referencia,
                direccion_ciudad: pacienteActual.personaReferencia.ciudad_referencia,
                direccion_zona: pacienteActual.personaReferencia.zona_referencia,
                direccion_localidad: pacienteActual.personaReferencia.calle_av_referencia,
                direccion_numero: pacienteActual.personaReferencia.direccion_numero
            },
                {
                    transaction: t
                }).then(function (personaReferenciaCreada) {
                    return guardarFichasEmpleadoI(req, pacienteActual, i, t, tipoCentro,
                        tipoCargo,
                        tipoContrato,
                        tipoExp,
                        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud)
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                })
        }
    }

    function guardarFichasEmpleadoI(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud, fichaEncontrada) {
        if (pacienteFound != null) {
            pacienteActual.fecha_inicio = new Date(pacienteActual.fecha_inicio); pacienteActual.fecha_inicio.setHours(0, 0, 0, 0, 0);
            var fechaFichaEncontrada = new Date(fichaEncontrada[0].dataValues.fecha_inicio)
            var fecha1 = fechaATexto(fechaFichaEncontrada)
            var fecha2 = fechaATexto(pacienteActual.fecha_inicio)
            return RrhhEmpleadoFicha.update({
                id_tipo_contrato: idcontratoClase,
                fecha_inicio: pacienteActual.fecha_inicio,
                haber_basico: pacienteActual.haber_basico,
                matricula_seguro: pacienteActual.matricula_seguro,
                id_seguro_salud: idSeguroSalud,
                seguro_salud_carnet: true,
                fecha_expiracion: pacienteActual.fecha_expiracion,
                id_persona_referencia: personaReferenciaCreada.id
            },
                {
                    where: {
                        id: fichaEncontrada[0].dataValues.id
                    }, transaction: t
                }).then(function (CreadoA) {
                    return recorrerHistorialVacacionI(req, pacienteActual, i, t, tipoCentro,
                        tipoCargo,
                        tipoContrato,
                        tipoExp,
                        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud, fichaEncontrada)
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                })
        } else {
            return RrhhEmpleadoFicha.create({
                fecha: medicoPacienteActualizado.dataValues.createdAt,
                id_empleado: medicoPacienteActualizado.dataValues.id,
                id_tipo_contrato: idcontratoClase,
                fecha_inicio: pacienteActual.fecha_inicio,
                haber_basico: pacienteActual.haber_basico,
                matricula_seguro: pacienteActual.matricula_seguro,
                id_seguro_salud: idSeguroSalud,
                seguro_salud_carnet: true,
                fecha_expiracion: pacienteActual.fecha_expiracion,
                id_persona_referencia: personaReferenciaCreada.id
            },
                { transaction: t }).then(function (Creado) {
                    return guardarCargoEmpleadoI(req, pacienteActual, i, t, tipoCentro,
                        tipoCargo,
                        tipoContrato,
                        tipoExp,
                        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud, Creado)
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                })
        }
    }
    function guardarCargoEmpleadoI(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud, fichaEncontrada) {
        if (pacienteFound != null) {
            if (pacienteActual.cargo) {
                var nombre_corto = pacienteActual.cargo.substr(0, 3);
            } else {
                var nombre_corto = null
            }
            return Clase.find({
                where: {
                    nombre: pacienteActual.cargo,
                    id_tipo: tipoCargo.dataValues.id,
                },
                transaction: t,
            }).then(function (cargoClase) {
                return RrhhEmpleadoCargo.destroy({
                    where: {
                        id_ficha: fichaEncontrada[0].dataValues.id
                    }
                }).then(function (cargoDestruido) {
                    return RrhhEmpleadoCargo.create({
                        /* id_empleado: medicoPacienteActualizado.id, */
                        id_cargo: cargoClase.id,
                        id_ficha: fichaEncontrada[0].dataValues.id

                    }, {
                            transaction: t
                        }).then(function (params) {
                            return recorrerHistorialVacacionI(req, pacienteActual, i, t, tipoCentro,
                                tipoCargo,
                                tipoContrato,
                                tipoExp,
                                tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud, fichaEncontrada)
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
        } else {
            if (pacienteActual.cargo) {
                var nombre_corto = pacienteActual.cargo.substr(0, 3);
            } else {
                var nombre_corto = null
            }
            return Clase.find({
                where: {
                    nombre: pacienteActual.cargo,
                    id_tipo: tipoCargo.dataValues.id,
                },
                transaction: t,

            }).then(function (cargoClase) {
                return RrhhEmpleadoCargo.create({
                    /* id_empleado: medicoPacienteActualizado.id, */
                    id_cargo: cargoClase.id,
                    id_ficha: fichaEncontrada.id
                },
                    { transaction: t }).then(function (params) {
                        return recorrerHistorialVacacionI(req, pacienteActual, i, t, tipoCentro,
                            tipoCargo,
                            tipoContrato,
                            tipoExp,
                            tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud, fichaEncontrada)
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

        }

    }
    function recorrerHistorialVacacionI(req, pacienteActual, i, t, tipoCentro,
        tipoCargo,
        tipoContrato,
        tipoExp,
        tipoSeguroSalud, tipoEE, tipoE, pacienteFound, personaCreada, idexpClase, idcentroCosto, TexpClase, medicoPacienteActualizado, personaReferenciaCreada, idcontratoClase, idSeguroSalud, fichaEncontrada) {
        if (pacienteFound != null) {
            return RrhhEmpleadoHistorialVacacion.destroy({
                where: { id_ficha: fichaEncontrada[0].dataValues.id }, transaction: t
            }).then(function (historialvacacionEliminado) {
                if (pacienteActual.historialVacacion.length > 0) {
                    var promises = []
                    for (var i = 0; i < pacienteActual.historialVacacion.length; i++) {
                        var historial = pacienteActual.historialVacacion[i];
                        promises.push(guardarhistorialVacacionI(req, historial, i, t, fichaEncontrada))
                    }
                }
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            })
        } else {
            if (pacienteActual.historialVacacion.length > 0) {
                var contador = 0
                var promises = []
                for (var i = 0; i < pacienteActual.historialVacacion.length; i++) {
                    var historial = pacienteActual.historialVacacion[i];
                    promises.push(guardarhistorialVacacionI(req, historial, i, t, fichaEncontrada))
                }
                return Promise.all(promises)
            } else {
                return new Promise(function (fulfill, reject) {
                    fulfill();
                });
            }
        }
    }
    function guardarhistorialVacacionI(req, historial, i, t, fichaEncontrada) {
        return RrhhEmpleadoHistorialVacacion.create({
            aplicadas: historial.aplicadas,
            tomadas: historial.tomadas,
            anio: historial.anio,
            gestion: historial.gestion,
            eliminado: false,
            id_ficha: fichaEncontrada.dataValues ? fichaEncontrada.id : fichaEncontrada[0].dataValues.id
        },
            { transaction: t }).then(function (historialCreado) {

            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            })
    }
    router.route('/validar-codigo-empleado/empresa/:id_empresa')
        .post(function (req, res) {
            MedicoPaciente.find({
                where: {
                    codigo: req.body.codigo,
                    eliminado: false,
                    id_empresa: req.params.id_empresa
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
            var condicionTipo = {}
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 59, 0, 0, 0);
                condicionCapacidades = { id_hoja_vida: req.params.id_hoja_vida, fecha: { $between: [inicio, fin] } };
            } else {
                condicionCapacidades = { id_hoja_vida: req.params.id_hoja_vida };
            }
            if (req.params.tipo != "INTER") {
                condicionTipo = { nombre_corto: req.params.tipo }
            }
            RrhhEmpleadoCapacidadInternaExterna.findAll({
                where: condicionCapacidades,
                include: [{ model: Clase, as: 'tipoCapacidad', where: condicionTipo }]
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
                include: [{ model: MedicoPaciente, as: 'empleado', where: condicionEmpleado, include: [{ model: Persona, as: 'persona' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', include: [{ model: Clase, as: 'banco' }] }] }, { model: Clase, as: 'tipoAnticipo' }],
                order: [[{ model: MedicoPaciente, as: 'empleado' }, 'id', 'asc'], ['createdAt', 'asc']]
            }).then(function (empleadoaAnticipo) {
                /*    if (empleadoaAnticipo.length > 0) {
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
   
                   } else { */

                res.json({ anticipos: empleadoaAnticipo })
                /*  } */
            })
        })
    //rutas ausencias
    router.route('/recursos-humanos/ausencia/empleado/:id_empleado')
        .post(function (req, res) {
            RrhhEmpleadoAusencia.create({
                /* id_empleado: req.params.id_empleado, */
                id_ficha: req.params.id_empleado,
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
                if (req.body.compensaciones) {
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
                } else {
                    res.json({ mensaje: "Guardado satisfactoriamente!" })
                }
            })
        })
    router.route('/recursos-humanos/ausencias/empleado/:id_empleado/inicio/:inicio/fin/:fin/tipo-ausencia/:tipo_ausencia/tipo/:tipo')
        .get(function (req, res) {
            var condicionAusencias = { id_ficha: req.params.id_empleado, eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionAusencias = { id_ficha: req.params.id_empleado, eliminado: false, fecha_inicio: { $between: [inicio, fin] } };
                if (req.params.tipo_ausencia != 0) {
                    condicionAusencias = { id_ficha: req.params.id_empleado, eliminado: false, tipo: req.params.tipo_ausencia, fecha_inicio: { $between: [inicio, fin] } };
                }
            } else if (req.params.tipo_ausencia != 0) {
                condicionAusencias = { id_ficha: req.params.id_empleado, eliminado: false, tipo: req.params.tipo_ausencia };
            }
            RrhhEmpleadoAusencia.findAll({
                where: condicionAusencias,
                include: [{ model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: MedicoPaciente, as: 'empleado' }] }, { model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: req.params.tipo } }] }]
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
                include: [{ model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] }] }, { model: RrhhClaseAsuencia, as: 'tipoAusencia', include: [{ model: Tipo, as: 'tipo', where: { nombre_corto: req.params.tipo } }] }]
            }).then(function (ausencias) {
                res.json(ausencias)
            })
        })
    //fin rutas ausencias
    //rutas vacaciones
    router.route('/recursos-humanos/vacacion/empleado/:id_empleado')
        .post(function (req, res) {
            RrhhEmpleadoVacaciones.create({
                /* id_empleado: req.params.id_empleado, */
                id_ficha: req.params.id_empleado,
                fecha_inicio: req.body.fecha_inicio,
                fecha_fin: req.body.fecha_fin,
                observacion: req.body.observacion,
                dias: String(req.body.dias),
                sabado: req.body.sabado,
                inicio_tipo: req.body.inicio_tipo,
                fin_tipo: req.body.fin_tipo,
                eliminado: false,
                domingos: req.body.domingos,
                feriados: req.body.dias_descuento,
            }).then(function (empleadoVacacionCreado) {//dias=12
                var gestiones = ""
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
                                req.body.dias = 0
                            }
                            if (tomadas != 0) {
                                restantes = (historial.aplicadas - tomadas) + " días de la gestion " + historial.gestion + "-" + (historial.gestion + 1)
                                gestiones += historial.gestion + "-" + (historial.gestion + 1) + ", "
                                RrhhEmpleadoHistorialVacacion.update({
                                    tomadas: tomadas
                                }, {
                                        where: { id: historial.id }
                                    }).then(function (historialVacacionActualizado) {
                                        RrhhEmpleadoDescuentoVacacionHistorial.create({
                                            id_vacacion: empleadoVacacionCreado.id,
                                            id_historial_vacacion: historial.id
                                        }).then(function (descuentoCreado) {
                                            if (index === (array.length - 1)) {
                                                res.json({ mensaje: "Guardado satisfactoriamente!", gestiones: gestiones, restantes: restantes })
                                            }
                                        })

                                    })
                            } else {
                                if (index === (array.length - 1)) {
                                    res.json({ mensaje: "Guardado satisfactoriamente!", gestiones: gestiones, restantes: restantes })
                                }
                            }
                        } else {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Guardado satisfactoriamente!", gestiones: gestiones, restantes: restantes })
                            }
                        }
                    } else {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: "Guardado satisfactoriamente!", gestiones: gestiones, restantes: restantes })
                        }
                    }
                });
            })
        })
    router.route('/recursos-humanos/vacacion/empleado/:id_empleado/inicio/:inicio/fin/:fin')
        .get(function (req, res) {
            var condicionVacaciones = { id_ficha: req.params.id_empleado, eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionVacaciones = { id_ficha: req.params.id_empleado, eliminado: false, fecha_inicio: { $between: [inicio, fin] } };
            }
            RrhhEmpleadoVacaciones.findAll({
                where: condicionVacaciones,
                include: [{ model: RrhhEmpleadoDescuentoVacacionHistorial, as: 'detalleDescuentosVacacionHistorial', include: [{ model: RrhhEmpleadoHistorialVacacion, as: 'historialVacacion' }] }, { model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: MedicoPaciente, as: 'empleado', include: [{ model: Persona, as: 'persona' }] }] }]
            }).then(function (vacaciones) {
                res.json(vacaciones)
            })
        })
    router.route('/recursos-humanos/vacacion/empresa/:id_empresa/inicio/:inicio/fin/:fin/estado/:estado')
        .get(function (req, res) {
            var condicionEmpleado = { id_empresa: req.params.id_empresa }
            var condicionFicha = {}
            if (req.params.estado != 2) {
                if (req.params.estado == 0) {
                    condicionEmpleado = { eliminado: true, id_empresa: req.params.id_empresa }
                    condicionFicha = { fecha_expiracion: { $ne: null } }
                } else {
                    condicionEmpleado = { eliminado: false, id_empresa: req.params.id_empresa }
                    condicionFicha = { fecha_expiracion: { $eq: null } }
                }

            }
            var condicionVacaciones = { eliminado: false };
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionVacaciones = { eliminado: false, fecha_inicio: { $between: [inicio, fin] } };
            }
            RrhhEmpleadoVacaciones.findAll({
                where: condicionVacaciones,
                include: [{ model: RrhhEmpleadoDescuentoVacacionHistorial, as: 'detalleDescuentosVacacionHistorial', include: [{ model: RrhhEmpleadoHistorialVacacion, as: 'historialVacacion' }] }, {
                    model: RrhhEmpleadoFicha, as: 'ficha', where: condicionFicha, include: [{
                        model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }]
                    }, { model: RrhhEmpleadoHistorialVacacion, as: 'historialVacaciones' }, { model: MedicoPaciente, as: 'empleado', where: condicionEmpleado, include: [{ model: Persona, as: 'persona' }, { model: Clase, as: 'campo' }] }]
                }]
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
                        /*    var a = new Date().setTime(feriado.start .getTime() + 1000 * 60 * 60 * 24)
                           feriado.start = new Date(a)     */
                        feriado.start.setHours(20, 0, 0, 0, 0);
                        feriado.end.setHours(20, 0, 0, 0, 0);
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
                where: { id_ficha: req.params.id, eliminado: false }
            }).then(function (params) {
                res.json(params)
            })
        })
        .post(function (req, res) {
            RrhhEmpleadoHistorialVacacion.create({
                aplicadas: req.body.aplicadas,
                tomadas: req.body.tomadas,
                anio: req.body.anio,
                gestion: req.body.gestion,
                id_ficha: req.params.id,
                eliminado: false
            }, {
                    where: { id_empleado: req.params.id }
                }).then(function (params) {
                    res.json(params)
                })
        })
    router.route('/recursos-humanos/tr3/empresa/:id_empresa')
        .post(function (req, res) {
            RrhhEmpleadoTr3.create({
                id_empresa: req.params.id_empresa,
                id_cuenta: req.body.id_cuenta,
                fecha: req.body.fecha,
                planilla: req.body.planilla,
                id_departamento: req.body.id_departamento,
                nombre_archivo: req.body.nombre_archivo,
                nombre_planilla: req.body.nombre_planilla,
                numero_planilla: req.body.numero_planilla,
                origen_fondos: req.body.origen_fondos,
                destino_fondos: req.body.destino_fondos,
                dirigido_para: req.body.dirigido_para,
                cargo: req.body.cargo,
                firma_uno: req.body.firma_uno,
                firma_dos: req.body.firma_dos,
                firma_tres: req.body.firma_tres,
                firma_cuatro: req.body.firma_cuatro,
            }).then(function (tr3Creado) {
                RrhhEmpleadoTr3.find({
                    where: { id: tr3Creado.id },
                    include: [{ model: Banco, as: 'cuenta' }, { model: Clase, as: 'departamento' }]
                }).then(function (tr3Encontrado) {
                    var total = 0
                    req.body.anticipos.forEach(function (anticipo, index, array) {
                        if (!anticipo.entregado) {
                            total += anticipo.monto
                            RrhhAnticipo.update({
                                entregado: true
                            }, {
                                    where: { id: anticipo.id }
                                })
                            RrhhEmpleadoAnticipoTr3.create({
                                id_anticipo: anticipo.id,
                                id_tr3: tr3Encontrado.id
                            }).then(function (historialCreado) {
                                if (index === (array.length - 1)) {
                                    res.json({ mensaje: "Tr3 creado satisfactoriamente!", anticipos: req.body.anticipos, tipo: req.body.tipo, tr3Encontrado: tr3Encontrado, total: total })
                                }
                            })
                        } else {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Tr3 creado satisfactoriamente!", anticipos: req.body.anticipos, tipo: req.body.tipo, tr3Encontrado: tr3Encontrado, total: total })
                            }
                        }
                    })

                })
            })
        })
    router.route('/recursos-humanos/tr3/empresa/:id_empresa/banco/:nombre')
        .get(function (req, res) {
            RrhhEmpleadoTr3.findAll({
                where: { id_empresa: req.params.id_empresa },
                include: [{
                    model: RrhhEmpleadoAnticipoTr3, as: 'historialtr3',
                    include: [{
                        model: RrhhAnticipo, as: 'anticipo',
                        include: [{
                            model: MedicoPaciente, as: 'empleado',
                            include: [{ model: Persona, as: 'persona' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', required: false, limit: 1, order: [["id", "desc"]] }]
                        }]
                    }]
                },
                { model: Banco, as: 'cuenta', where: { nombre: req.params.nombre } },
                { model: Clase, as: 'departamento' }]
            }).then(function (params) {
                res.json(params)
            })
        })
    router.route('/recursos-humanos/beneficio/ficha/:id')
        .get(function (req, res) {
            RrhhEmpleadoBeneficioSocial.find({
                where: { id_ficha: req.params.id, tipo_beneficio: true, eliminado: false },
                include: [{ model: Clase, as: 'motivo' }, { model: Banco, as: 'cuenta' }, { model: RrhhEmpleadoDeduccionIngreso, as: 'deduccionEingresos', include: [{ model: Clase, as: "tipo" }] }]
            }).then(function (beneficio) {
                res.json({ beneficio: beneficio })
            })
        })
    router.route('/recursos-humanos/beneficio/empresa/:id_empresa/tipo/:tipo/inicio/:inicio/fin/:fin/motivo/:motivo/pagina/:pagina/items_pagina/:items_pagina/texto_busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
        .get(function (req, res) {
            var condicionBeneficio = { tipo_beneficio: false }

            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionBeneficio.fecha_elaboracion = { $between: [inicio, fin] };
            }
            if (req.params.tipo != 0) {
                condicionBeneficio.tipo_beneficio = true
            }
            if (req.params.motivo != 0) {
                condicionBeneficio.id_motivo = req.params.motivo
            }
            RrhhEmpleadoBeneficioSocial.findAndCountAll({
                where: condicionBeneficio,
                include: [{ model: RrhhEmpleadoFicha, as: 'ficha', include: [{ model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, include: [{ model: Clase, as: 'extension' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'estadoCivil' }] }] }] }, { model: Clase, as: 'motivo' }, { model: Banco, as: 'cuenta' }, { model: RrhhEmpleadoDeduccionIngreso, as: 'deduccionEingresos', include: [{ model: Clase, as: "tipo" }] }]
            }).then(function (datos) {
                res.json({ beneficios: datos.rows, paginas: Math.ceil(datos.count / req.params.items_pagina) });
            })
        })
    router.route('/recursos-humanos/beneficios/ficha/:id')
        .get(function (req, res) {
            RrhhEmpleadoBeneficioSocial.findAll({
                where: { id_ficha: req.params.id, tipo_beneficio: false }
            }).then(function (beneficios) {
                res.json(beneficios)
            })
        })
        .post(function (req, res) {
            if (req.body.id) {
                var id = null, idcuenta = null;
                if (req.body.motivo) {
                    id = req.body.motivo.id
                }

                if (req.body.cuenta) {
                    idcuenta = req.body.cuenta.id
                }
                RrhhEmpleadoBeneficioSocial.update({
                    id_ficha: req.params.id,
                    id_motivo: id,
                    fecha_elaboracion: req.body.fecha_elaboracion,
                    fecha_asistensia: req.body.fecha_asistensia,
                    fecha_ingreso: req.body.fecha_ingreso,
                    fecha_retiro: req.body.fecha_retiro,
                    primer_mes: req.body.primer_mes,
                    segundo_mes: req.body.segundo_mes,
                    tercer_mes: req.body.tercer_mes,
                    numero_quinquenio: req.body.numero_quinquenio,
                    quinquenio_adelantado: req.body.quinquenio_adelantado,
                    tipo_beneficio: req.body.tipo_beneficio,
                    desahucio: req.body.desahucio,
                    total_deducciones: req.body.total_deducciones,
                    total_ingresos: req.body.total_ingresos,
                    eliminado: false,
                    id_cuenta_banco: idcuenta,
                    promedio: req.body.promedio,
                    mes_uno: req.body.mes_uno.id,
                    mes_dos: req.body.mes_dos.id,
                    mes_tres: req.body.mes_tres.id,
                    empleado_cargo_impresion: req.body.empleado_cargo_impresion,
                    cargo_imprecion: req.body.cargo_imprecion,
                }, {
                        where: { id: req.body.id }
                    }).then(function (beneficioActualizado) {
                        RrhhEmpleadoBeneficioSocial.find({
                            where: { id: req.body.id }
                        }).then(function (beneficioCreado) {

                            if (req.body.ingresos.length > 0) {
                                req.body.ingresos.forEach(function (ingreso, index, array) {
                                    if (ingreso.eliminado == true) {
                                        RrhhEmpleadoDeduccionIngreso.destroy({
                                            where: { id: ingreso.id }
                                        }).then(function (decuccionEliminada) {
                                            if (index === (array.length - 1)) {
                                                guardarDeducciones(req, res, RrhhEmpleadoDeduccionIngreso, beneficioCreado)
                                            }
                                        })
                                    } else if (ingreso.id) {
                                        RrhhEmpleadoDeduccionIngreso.update({
                                            monto: ingreso.monto,
                                            motivo: ingreso.motivo,
                                            id_tipo: ingreso.tipo.id,
                                        }, {
                                                where: { id: ingreso.id }
                                            }).then(function (decuccionActualizada) {
                                                if (index === (array.length - 1)) {
                                                    guardarDeducciones(req, res, RrhhEmpleadoDeduccionIngreso, beneficioCreado)
                                                }
                                            })
                                    } else {
                                        RrhhEmpleadoDeduccionIngreso.create({
                                            id_beneficio: beneficioCreado.id,
                                            monto: ingreso.monto,
                                            motivo: ingreso.motivo,
                                            id_tipo: ingreso.tipo.id,
                                            eliminado: false
                                        }).then(function (decuccionCreada) {
                                            if (index === (array.length - 1)) {
                                                guardarDeducciones(req, res, RrhhEmpleadoDeduccionIngreso, beneficioCreado)
                                            }
                                        })
                                    }
                                });
                            } else {
                                guardarDeducciones(req, res, RrhhEmpleadoDeduccionIngreso, beneficioCreado)
                            }
                        })
                    })

            } else {
                var id = null, idcuenta = null;
                if (req.body.motivo) {
                    id = req.body.motivo.id
                }
                if (req.body.cuenta) {
                    idcuenta = req.body.cuenta.id
                }
                if (!req.body.tipo_beneficio) {
                    RrhhEmpleadoBeneficioSocial.create({
                        id_ficha: req.params.id,
                        fecha_elaboracion: req.body.fecha_elaboracion,
                        fecha_asistensia: req.body.fecha_asistensia,
                        fecha_ingreso: req.body.fecha_ingreso,
                        primer_mes: req.body.primer_mes,
                        segundo_mes: req.body.segundo_mes,
                        tercer_mes: req.body.tercer_mes,
                        total_quinquenio: req.body.total_quinquenio,
                        tipo_beneficio: req.body.tipo_beneficio,
                        eliminado: false,
                        numero_quinquenio: req.body.numero_quinquenio,
                        id_cuenta_banco: idcuenta,
                        promedio: req.body.promedio,
                        mes_uno: req.body.mes_uno.id,
                        mes_dos: req.body.mes_dos.id,
                        mes_tres: req.body.mes_tres.id,
                        empleado_cargo_impresion: req.body.empleado_cargo_impresion,
                        cargo_imprecion: req.body.cargo_imprecion,
                    }).then(function (beneficioCreado) {
                        res.json({ mensaje: 'Beneficio social creado satisfactoriamente!' })

                    }).catch(function (err) {
                        res.json({ hasError: true, mensaje: err.stack });
                    });
                } else {

                    RrhhEmpleadoBeneficioSocial.create({
                        id_ficha: req.params.id,
                        id_motivo: id,
                        fecha_elaboracion: req.body.fecha_elaboracion,
                        fecha_asistensia: req.body.fecha_asistensia,
                        fecha_ingreso: req.body.fecha_ingreso,
                        fecha_retiro: req.body.fecha_retiro,
                        primer_mes: req.body.primer_mes,
                        segundo_mes: req.body.segundo_mes,
                        tercer_mes: req.body.tercer_mes,
                        numero_quinquenio: req.body.numero_quinquenio,
                        quinquenio_adelantado: req.body.quinquenio_adelantado,
                        tipo_beneficio: req.body.tipo_beneficio,
                        desahucio: req.body.desahucio,
                        total_deducciones: req.body.total_deducciones,
                        total_ingresos: req.body.total_ingresos,
                        eliminado: false,
                        id_cuenta_banco: idcuenta,
                        promedio: req.body.promedio,
                        mes_uno: req.body.mes_uno.id,
                        mes_dos: req.body.mes_dos.id,
                        mes_tres: req.body.mes_tres.id,
                        empleado_cargo_impresion: req.body.empleado_cargo_impresion,
                        cargo_imprecion: req.body.cargo_imprecion,
                    }).then(function (beneficioCreado) {
                        if (req.body.ingresos.length > 0) {
                            req.body.ingresos.forEach(function (ingreso, index, array) {
                                RrhhEmpleadoDeduccionIngreso.create({
                                    id_beneficio: beneficioCreado.id,
                                    monto: ingreso.monto,
                                    motivo: ingreso.motivo,
                                    id_tipo: ingreso.tipo.id,
                                    eliminado: false
                                }).then(function (decuccionCreada) {
                                    if (index === (array.length - 1)) {
                                        guardarDeducciones(req, res, RrhhEmpleadoDeduccionIngreso, beneficioCreado)
                                    }
                                }).catch(function (err) {
                                    res.json({ hasError: true, mensaje: err.stack });
                                });

                            });
                        } else {
                            guardarDeducciones(req, res, RrhhEmpleadoDeduccionIngreso, beneficioCreado)
                        }

                    }).catch(function (err) {
                        res.json({ hasError: true, mensaje: err.stack });
                    });
                }
            }
        })
    function fechaATexto(fecha) {
        fech = new Date(fecha)
        var valor = (fech.getMonth() + 1)
        if (valor < 10) {
            valor = "0" + valor
        }
        var valor2 = fech.getDate()
        if (valor2 < 10) {
            valor2 = "0" + valor2
        }
        fecha = valor2 + "/" + valor + "/" + fech.getFullYear();
        return fecha
        // $scope.fechaAplicacionVacuna = new Date(convertirFecha(fecha))
    }

    function guardarDeducciones(req, res, RrhhEmpleadoDeduccionIngreso, beneficioCreado) {
        if (req.body.deducciones.length > 0) {
            req.body.deducciones.forEach(function (deduccion, index, array) {
                if (deduccion.eliminado == true) {
                    RrhhEmpleadoDeduccionIngreso.destroy({
                        where: { id: deduccion.id }
                    }).then(function (decuccionEliminada) {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: 'Beneficio social actualizado satisfactoriamente!' })
                        }
                    }).catch(function (err) {
                        res.json({ hasError: true, mensaje: err.stack });
                    });
                } else if (deduccion.id) {
                    RrhhEmpleadoDeduccionIngreso.update({
                        monto: deduccion.monto,
                        motivo: deduccion.motivo,
                        id_tipo: deduccion.tipo.id,
                    }, {
                            where: { id: deduccion.id }
                        }).then(function (decuccionActualizada) {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: 'Beneficio social actualizado satisfactoriamente!' })
                            }
                        }).catch(function (err) {
                            res.json({ hasError: true, mensaje: err.stack });
                        });
                } else {
                    RrhhEmpleadoDeduccionIngreso.create({
                        id_beneficio: beneficioCreado.id,
                        monto: deduccion.monto,
                        motivo: deduccion.motivo,
                        id_tipo: deduccion.tipo.id,
                        eliminado: false
                    }).then(function (decuccionCreada) {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: 'Beneficio social actualizado satisfactoriamente!' })
                        }
                    }).catch(function (err) {
                        res.json({ hasError: true, mensaje: err.stack });
                    });
                }

            });
        } else {
            res.json({ mensaje: 'Beneficio social creado satisfactoriamente!' })
        }
    }
    router.route('/recursos-humanos/bitacora-ficha/usuario/:id')
        .post(function (req, res) {
            req.body.forEach(function (cambio, index, array) {
                if (cambio.valor_anterior === true) {
                    cambio.valor_anterior = "true"
                } else if (cambio.valor_anterior === false) {
                    cambio.valor_anterior = "false"
                }
                if (cambio.valor_actual === true) {
                    cambio.valor_actual = "true"
                } else if (cambio.valor_actual === false) {
                    cambio.valor_actual = "false"
                }

                RrhhEmpleadoBitacoraFicha.create({
                    id_ficha: cambio.id_ficha,
                    campo: cambio.campo,
                    valor_anterior: cambio.valor_anterior,
                    valor_actual: cambio.valor_actual,
                    fecha: cambio.fecha,
                    id_usuario: req.params.id
                }).then(function (bitacoraCreada) {
                    if (index === (array.length - 1)) {

                        res.json({ message: "Ficha empleado actualizada satisfactoriamente!" })
                    }
                })
            })
        })
        .get(function (req, res) {
            RrhhEmpleadoBitacoraFicha.findAll({
                where: {
                    id_ficha: req.params.id
                },
                include: [{ model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }] }]
            }).then(function (bitacoras) {

                res.json(bitacoras)

            })
        });

    router.route('/reporte/configuracion/ropa-trabajo/empresa/:id_empresa')
        .get(function (req, res) {
            RrhhEmpleadoConfiguracionRopa.findAll({
                include: [{ model: Clase, as: 'cargo' }, { model: Clase, as: 'ropaTrabajo', include: [{ model: Tipo, as: 'tipo', where: { id_empresa: req.params.id_empresa } }] }]
            }).then(function (entidad) {
                res.json(entidad);
            });
        });
    router.route('/recursos-humanos/configuracion-ropa-trabajo/cargo/:id_cargo')
        .post(function (req, res) {
            req.body.forEach(function (ropa, index, array) {
                if (ropa.id) {
                    if (ropa.eliminado) {
                        RrhhEmpleadoConfiguracionRopa.destroy({
                            where: { id: ropa.id }
                        }).then(function (configuracion) {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Configuración guardada satisfactoriamente!" })
                            }
                        })
                    } else {
                        RrhhEmpleadoConfiguracionRopa.update({
                            id_ropa_trabajo: ropa.ropaTrabajo.id,
                            cantidad: ropa.cantidad
                        },
                            {
                                where: { id: ropa.id }
                            }).then(function (configuracion) {
                                if (index === (array.length - 1)) {
                                    res.json({ mensaje: "Configuración guardada satisfactoriamente!" })
                                }
                            })
                    }
                } else {
                    if (ropa.eliminado) {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: "Configuración guardada satisfactoriamente!" })
                        }
                    } else {
                        RrhhEmpleadoConfiguracionRopa.create({
                            id_ropa_trabajo: ropa.ropaTrabajo.id,
                            id_cargo: req.params.id_cargo,
                            cantidad: ropa.cantidad
                        }).then(function (configuracion) {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Configuración guardada satisfactoriamente!" })
                            }
                        })
                    }
                }

            })
        })
        .get(function (req, res) {
            RrhhEmpleadoConfiguracionRopa.findAll({
                where: {
                    id_cargo: req.params.id_cargo,
                },
                include: [{ model: Clase, as: 'ropaTrabajo' }]
            }).then(function (ropasTrabajo) {
                res.json(ropasTrabajo)
            })
        });
    router.route('/recursos-humanos/cargos/empleado/:id_ficha')
        .get(function (req, res) {
            RrhhEmpleadoCargo.findAll({
                where: {
                    id_ficha: req.params.id_ficha,
                },
                include: [{ model: Clase, as: 'cargo', include: [{ model: RrhhEmpleadoConfiguracionRopa, as: 'ConfiguracionesCargo', include: [{ model: Clase, as: 'cargo' }, { model: Clase, as: 'ropaTrabajo' }] }] }]
            }).then(function (cargosEmpleado) {
                res.json(cargosEmpleado)
            })
        })

    router.route('/recursos-humanos/ropa-trabajo/productos/subgrupos/:subgrupos')
        .get(function (req, res) {
            var arrelo = []
            var dato = req.params.subgrupos.split(",")
            dato.map(function (grupo) {
                arrelo.push(grupo)
            })
            Producto.findAll({
                where: {
                    id_subgrupo: { $in: arrelo }
                },
                include: [{ model: Inventario, as: 'inventarios' }]
            }).then(function (cargosEmpleado) {
                res.json(cargosEmpleado)
            })
        })
    router.route('/recursos-humanos/ropa-trabajo/actualizar/empleado/:id_empleado')
        .put(function (req, res) {
            sequelize.transaction(function (t) {
                var promises = [];

                return RrhhEmpleadoDotacionRopa.update({
                    fecha: req.body.fecha,
                    fecha_vencimiento: req.body.fecha_vencimiento,
                    id_cumplimiento: req.body.cumplimiento.id,
                    id_periodo: req.body.periodo.id,
                    id_estado: req.body.estado.id,
                    observacion: req.body.observacion,
                    id_usuario: req.body.id_usuario,
                }, {
                        transaction: t,
                        where: {
                            id: req.body.id
                        }
                    }).then(function (dotacionActualizada) {
                        return actualizarItemRopa(req, res, t)
                    })
            }).then(function (result) {
                res.json({ mensaje: "Creado Satisfactoriamente!", numero: req.body.numero })
            }).catch(function (err) {
                var error = (err.stack) ? err.stack : err
                res.json({ hasError: true, mensaje: error });
            });
        })
    function actualizarItemRopa(req, res, t) {
        var promises = []
        req.body.dotacionItems.forEach(function (item, index, array) {

            item.id = (item.id) ? item.id : 0
            promises.push(RrhhEmpleadoDotacionRopaItem.find({
                transaction: t,
                where: { id_ropa_trabajo: item.id_ropa_trabajo, id_producto: item.producto.id, entregado: true }
            }).then(function (dato) {
                if (dato) {
                    if (!dato.entregado) {
                        return Producto.find({
                            include: [{
                                model: Inventario, as: 'inventarios', required: false, where: {
                                    id_almacen: req.body.almacen.id
                                }
                            }],
                            where: {
                                id: item.producto.id
                            },
                            transaction: t
                        }).then(function (producto) {
                            return Tipo.find({
                                where: { nombre_corto: Diccionario.MOV_EGRE },
                                transaction: t
                            }).then(function (tipoMovimiento) {
                                return Clase.find({
                                    where: { nombre_corto: Diccionario.EGRE_PROFORMA },
                                    transaction: t
                                }).then(function (tipoEgreso) {
                                    calcularCostosEgresosRopa(tipoMovimiento, tipoEgreso, producto, item.cantidad, producto.inventarios, index, array, res, t, req, item)
                                })
                            })
                        })
                    } else {
                        return RrhhEmpleadoDotacionRopaItem.update({
                            id_producto: item.producto.id,
                            entregado: item.entregado,
                            id_ropa_trabajo: item.ropaTrabajo.id,
                            id_cargo: item.cargo.id,
                            cantidad: item.cantidad
                        }, {
                                where: { id: item.id },
                                transaction: t
                            }).then(function (detalleCreado) { })
                    }
                } else {
                    return Producto.find({
                        include: [{
                            model: Inventario, as: 'inventarios', required: false, where: {
                                id_almacen: req.body.almacen.id
                            }
                        }],
                        where: {
                            id: item.producto.id
                        },
                        transaction: t
                    }).then(function (producto) {
                        return Tipo.find({
                            where: { nombre_corto: Diccionario.MOV_EGRE },
                            transaction: t
                        }).then(function (tipoMovimiento) {
                            return Clase.find({
                                where: { nombre_corto: Diccionario.EGRE_PROFORMA },
                                transaction: t
                            }).then(function (tipoEgreso) {
                                calcularCostosEgresosRopa(tipoMovimiento, tipoEgreso, producto, item.cantidad, producto.inventarios, index, array, res, t, req, item)
                            })
                        })
                    })
                }
            }))





            /*  RrhhEmpleadoDotacionRopaItem.update({
                 id_producto: item.producto.id,
                 entregado: item.entregado,
                 id_ropa_trabajo: item.ropaTrabajo.id,
                 id_cargo: item.cargo.id,
                 cantidad: item.cantidad
             }, {
                     where: { id: item.id }
                 }).then(function (detalleCreado) {
                     if (index === (array.length - 1)) {
                         res.json({ mensaje: "Creado Satisfactoriamente!", numero: req.body.numero })
                     }
                 }) */
        })
        return Promise.all(promises);
    }

    function calcularCostosEgresosRopa(tipoMovimiento, tipoEgreso, producto, cantidad, inventarios, index, array, res, t, req, item) {
        var cantidadTotal = cantidad;
        if (producto.activar_inventario) {
            if (inventarios.length > 0) {
                var promises = [];
                var totalInventario = 0
                for (var p = 0; p < inventarios.length; p++) {
                    totalInventario = totalInventario + inventarios[p].cantidad;
                    if (p === (inventarios.length - 1)) {
                        if (totalInventario >= cantidad) {
                            return Movimiento.create({
                                id_tipo: tipoMovimiento.id,
                                id_clase: tipoEgreso.id,
                                id_almacen: req.body.id_almacen,
                                fecha: new Date()
                            }, { transaction: t }).then(function (movimientoCreado) {
                                var anterior = false
                                if (!item.modificable) {
                                    anterior = true
                                }
                                return RrhhEmpleadoDotacionRopaItem.update({
                                    id_producto: item.producto.id,
                                    entregado: item.entregado,
                                    id_ropa_trabajo: item.ropaTrabajo.id,
                                    id_cargo: item.cargo.id,
                                    cantidad: item.cantidad
                                }, {
                                        where: { id: item.id },
                                        transaction: t
                                    }).then(function (detalleCreado) {
                                        for (var i = 0; i < inventarios.length; i++) {
                                            if (cantidadTotal > 0) {
                                                var cantidadParcial;
                                                if (cantidadTotal > inventarios[i].cantidad) {
                                                    cantidadParcial = inventarios[i].cantidad;
                                                    cantidadTotal = cantidadTotal - inventarios[i].cantidad
                                                } else {
                                                    cantidadParcial = cantidadTotal;
                                                    cantidadTotal = 0;
                                                }

                                                if (cantidadParcial > 0) {
                                                    //req.body.mensaje += "cliente pedido: "+detalle_despacho.despacho.cliente.razon_social+" producto: "+producto.nombre+" inventario=" + totalInventario+ "cantidad despachadas=" + cantidad+"|------|"														
                                                    var rrr = crearMovimientoEgresoYActualizarInventario(movimientoCreado, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, res, t);
                                                    //console.log(rrr);
                                                    promises.push(new Promise(function (fulfill, reject) {
                                                        fulfill({});
                                                    }));
                                                }
                                            } else {
                                                //if (index == (array.length - 1) && i == (inventarios.length - 1)) {
                                                //res.json(venta);
                                                /*promises.push(new Promise(function (fulfill, reject){
                                                    fulfill(venta);
                                                }));*/
                                                //}
                                            }
                                        }
                                    })

                            })
                        } else {
                            var anterior = false
                            if (!item.modificable) {
                                anterior = true
                            }
                            promises.push(RrhhEmpleadoDotacionRopaItem.update({
                                id_dotacion_ropa: dotacionCreada.dataValues.id,
                                id_producto: item.producto.id,
                                entregado: false,
                                id_ropa_trabajo: item.ropaTrabajo.id,
                                id_cargo: item.cargo.id,
                                cantidad: item.cantidad,
                                anterior: anterior
                            }, {
                                    where: { id: item.id },
                                    transaction: t
                                }).then(function (detalleCreado) {
                                    //  req.body.mensaje += "cliente pedido: " + detalle_despacho.despacho.cliente.razon_social + " producto: " + producto.nombre + " inventario=" + totalInventario + "cantidad despachadas=" + cantidad + "|---|"
                                }))

                        }
                    }
                }
                return Promise.all(promises);
            } else {
                return RrhhEmpleadoDotacionRopaItem.create({
                    id_dotacion_ropa: dotacionCreada.dataValues.id,
                    id_producto: item.producto.id,
                    entregado: false,
                    id_ropa_trabajo: item.ropaTrabajo.id,
                    id_cargo: item.cargo.id,
                    cantidad: item.cantidad,
                    anterior: anterior
                }, {
                        transaction: t
                    }).then(function (detalleCreado) {
                        return new Promise(function (fulfill, reject) {
                            fulfill({});
                        }); //  req.body.mensaje += "cliente pedido: " + detalle_despacho.despacho.cliente.razon_social + " producto: " + producto.nombre + " inventario=" + totalInventario + "cantidad despachadas=" + cantidad + "|---|"
                    })
                //if (index == (array.length - 1)) {

                //}
            }
        } else {
            //if (index == (array.length - 1)) {
            return new Promise(function (fulfill, reject) {
                fulfill(venta);
            });
            //}
        }
    }
    router.route('/recursos-humanos/ropa-trabajo/empleado/:id_empleado')
        .post(function (req, res) {
            req.body.mensaje = ""
            sequelize.transaction(function (t) {
                var promises = [];
                var a = 0
                return Sucursal.find({
                    transaction: t,
                    where: {

                        id: req.body.sucursal.id,//your where conditions, or without them if you need ANY entry
                    }
                }).then(function (SucursalEncontrada) {
                    var nuemero_correlativo = SucursalEncontrada.ropa_trabajo_correlativo
                    req.body.nuemero_correlativo = nuemero_correlativo
                    return RrhhEmpleadoDotacionRopa.create({
                        fecha: req.body.fecha,
                        fecha_vencimiento: req.body.fecha_vencimiento,
                        id_cumplimiento: req.body.cumplimiento.id,
                        id_periodo: req.body.periodo.id,
                        id_estado: req.body.estado.id,
                        id_empleado: req.params.id_empleado,
                        observacion: req.body.observacion,
                        id_usuario: req.body.id_usuario,
                        eliminado: false,
                        numero: SucursalEncontrada.ropa_trabajo_correlativo,
                        id_sucursal: req.body.sucursal.id,
                        id_almacen: req.body.almacen.id,
                    }, {
                            transaction: t,
                        }).then(function (dotacionCreada) {
                            var numero = SucursalEncontrada.ropa_trabajo_correlativo + 1;
                            return Sucursal.update({
                                ropa_trabajo_correlativo: numero
                            }, {
                                    transaction: t,
                                    where: {
                                        id: req.body.sucursal.id,
                                    }
                                }).then(function (sucursalActualizada) {
                                    return agreregarItemsRopa(req, res, dotacionCreada, nuemero_correlativo, t, a)
                                })

                        })
                })


            }).then(function (result) {
                res.json({ mensaje: "Creado Satisfactoriamente!", numero: req.body.nuemero_correlativo })
            }).catch(function (err) {
                var error = (err.stack) ? err.stack : err
                res.json({ hasError: true, mensaje: error });
            });
        })
        .put(function (req, res) {
            RrhhEmpleadoDotacionRopa.update({
                eliminado: true
            }, {
                    where: { id: req.body.id }
                }).then(function (eliminado) {
                    res.json({ mensaje: "Eliminado satisfactoriamente" })
                })
        })

    function agreregarItemsRopa(req, res, dotacionCreada, nuemero_correlativo, t, a) {
        var promises = []
        req.body.dotacionItems.forEach(function (item, index, array) {
            if (item.editable) {
                item.id = (item.id) ? item.id : 0
                promises.push(RrhhEmpleadoDotacionRopaItem.find({
                    transaction: t,
                    where: { id_ropa_trabajo: item.id_ropa_trabajo, id_producto: item.producto.id, entregado: true }
                }).then(function (dato) {
                    if (dato) {
                        if (!dato.entregado) {
                            return Producto.find({
                                include: [{
                                    model: Inventario, as: 'inventarios', required: false, where: {
                                        id_almacen: req.body.almacen.id
                                    }
                                }],
                                where: {
                                    id: item.producto.id
                                },
                                transaction: t
                            }).then(function (producto) {
                                return Tipo.find({
                                    where: { nombre_corto: Diccionario.MOV_EGRE },
                                    transaction: t
                                }).then(function (tipoMovimiento) {
                                    return Clase.find({
                                        where: { nombre_corto: Diccionario.EGRE_PROFORMA },
                                        transaction: t
                                    }).then(function (tipoEgreso) {
                                        return calcularCostosEgresos(tipoMovimiento, tipoEgreso, producto, item.cantidad, producto.inventarios, index, array, res, t, req, item, a, dotacionCreada);
                                    })
                                })
                            })
                        } else {
                            var anterior = false
                            if (!item.modificable) {
                                anterior = true
                            }
                            return RrhhEmpleadoDotacionRopaItem.create({
                                id_dotacion_ropa: dotacionCreada.dataValues.id,
                                id_producto: item.producto.id,
                                entregado: item.entregado,
                                id_ropa_trabajo: item.ropaTrabajo.id,
                                id_cargo: item.cargo.id,
                                cantidad: item.cantidad,
                                anterior: anterior
                            }, {
                                    transaction: t
                                }).then(function (detalleCreado) { })
                        }
                    } else {
                        if (item.entregado) {
                            return Producto.find({
                                include: [{
                                    model: Inventario, as: 'inventarios', required: false, where: {
                                        id_almacen: req.body.almacen.id
                                    }
                                }],
                                where: {
                                    id: item.producto.id
                                },
                                transaction: t
                            }).then(function (producto) {
                                return Tipo.find({
                                    where: { nombre_corto: Diccionario.MOV_EGRE },
                                    transaction: t
                                }).then(function (tipoMovimiento) {
                                    return Clase.find({
                                        where: { nombre_corto: Diccionario.EGRE_PROFORMA },
                                        transaction: t
                                    }).then(function (tipoEgreso) {
                                        return calcularCostosEgresos(tipoMovimiento, tipoEgreso, producto, item.cantidad, producto.inventarios, index, array, res, t, req, item, a, dotacionCreada);
                                    })
                                })
                            })
                        } else {
                            var anterior = false
                            if (!item.modificable) {
                                anterior = true
                            }
                            return RrhhEmpleadoDotacionRopaItem.create({
                                id_dotacion_ropa: dotacionCreada.dataValues.id,
                                id_producto: item.producto.id,
                                entregado: item.entregado,
                                id_ropa_trabajo: item.ropaTrabajo.id,
                                id_cargo: item.cargo.id,
                                cantidad: item.cantidad,
                                anterior: anterior
                            }, {
                                    transaction: t
                                }).then(function (detalleCreado) { })
                        }
                    }
                }))
            } else {
                var anterior = false
                if (!item.modificable) {
                    anterior = true
                }
                promises.push(
                    RrhhEmpleadoDotacionRopaItem.create({
                        id_dotacion_ropa: dotacionCreada.dataValues.id,
                        id_producto: item.producto.id,
                        entregado: item.entregado,
                        id_ropa_trabajo: item.ropaTrabajo.id,
                        id_cargo: item.cargo.id,
                        cantidad: item.cantidad,
                        anterior: anterior
                    }, {
                            transaction: t
                        }).then(function (detalleCreado) { })
                )
            }
        })

        return Promise.all(promises);
    }
    function crearMovimientoEgresoYActualizarInventario(movimientoCreado, producto, cantidad, inventarios, cantidadParcial, costo, index, array, i, res, t) {
        console.log(cantidad);
        return DetalleMovimiento.create({
            id_movimiento: movimientoCreado.id,
            id_producto: producto.id,
            cantidad: cantidadParcial,
            costo_unitario: costo.costo_unitario,
            importe: (cantidadParcial * costo.costo_unitario),
            total: (cantidadParcial * costo.costo_unitario),
            descuento: 0,
            recargo: 0,
            ice: 0,
            excento: 0,
            tipo_descuento: 0,
            tipo_recargo: 0,
            id_inventario: costo.id
        }, { transaction: t }).then(function (detalleMovimientoCreado) {
            sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED }, function (tu) {
                return Inventario.find({
                    where: {
                        id: costo.id
                    },
                    transaction: tu,
                    lock: tu.LOCK.UPDATE
                }).then(function (inventario) {
                    return Inventario.update({
                        cantidad: inventario.cantidad - cantidadParcial,
                        costo_total: ((inventario.cantidad - cantidadParcial) * costo.costo_unitario)
                    }, {
                            where: {
                                id: inventario.id
                            },
                            transaction: tu
                        });
                });
            }).then(function (result) {
                return new Promise(function (fulfill, reject) {
                    fulfill({});
                });
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject(err);
                });
            });
        });
    }

    function calcularCostosEgresos(tipoMovimiento, tipoEgreso, producto, cantidad, inventarios, index, array, res, t, req, item, a, dotacionCreada) {
        var cantidadTotal = cantidad;
        if (producto.activar_inventario) {
            if (inventarios.length > 0) {
                var promises = [];
                var totalInventario = 0
                for (var p = 0; p < inventarios.length; p++) {
                    totalInventario = totalInventario + inventarios[p].cantidad;
                    if (p === (inventarios.length - 1)) {
                        if (totalInventario >= cantidad) {
                            return Movimiento.create({
                                id_tipo: tipoMovimiento.id,
                                id_clase: tipoEgreso.id,
                                id_almacen: req.body.id_almacen,
                                fecha: new Date()
                            }, { transaction: t }).then(function (movimientoCreado) {
                                var anterior = false
                                if (!item.modificable) {
                                    anterior = true
                                }
                                return RrhhEmpleadoDotacionRopaItem.create({
                                    id_dotacion_ropa: dotacionCreada.dataValues.id,
                                    id_producto: item.producto.id,
                                    entregado: item.entregado,
                                    id_ropa_trabajo: item.ropaTrabajo.id,
                                    id_cargo: item.cargo.id,
                                    cantidad: item.cantidad,
                                    anterior: anterior
                                }, {
                                        transaction: t
                                    }).then(function (detalleCreado) {
                                        for (var i = 0; i < inventarios.length; i++) {
                                            if (cantidadTotal > 0) {
                                                var cantidadParcial;
                                                if (cantidadTotal > inventarios[i].cantidad) {
                                                    cantidadParcial = inventarios[i].cantidad;
                                                    cantidadTotal = cantidadTotal - inventarios[i].cantidad
                                                } else {
                                                    cantidadParcial = cantidadTotal;
                                                    cantidadTotal = 0;
                                                }

                                                if (cantidadParcial > 0) {
                                                    //req.body.mensaje += "cliente pedido: "+detalle_despacho.despacho.cliente.razon_social+" producto: "+producto.nombre+" inventario=" + totalInventario+ "cantidad despachadas=" + cantidad+"|------|"														
                                                    var rrr = crearMovimientoEgresoYActualizarInventario(movimientoCreado, producto, cantidad, inventarios, cantidadParcial, inventarios[i], index, array, i, res, t);
                                                    //console.log(rrr);
                                                    promises.push(new Promise(function (fulfill, reject) {
                                                        fulfill({});
                                                    }));
                                                }
                                            } else {
                                                //if (index == (array.length - 1) && i == (inventarios.length - 1)) {
                                                //res.json(venta);
                                                /*promises.push(new Promise(function (fulfill, reject){
                                                    fulfill(venta);
                                                }));*/
                                                //}
                                            }
                                        }
                                    })

                            })
                        } else {
                            var anterior = false
                            if (!item.modificable) {
                                anterior = true
                            }
                            promises.push(RrhhEmpleadoDotacionRopaItem.create({
                                id_dotacion_ropa: dotacionCreada.dataValues.id,
                                id_producto: item.producto.id,
                                entregado: false,
                                id_ropa_trabajo: item.ropaTrabajo.id,
                                id_cargo: item.cargo.id,
                                cantidad: item.cantidad,
                                anterior: anterior
                            }, {
                                    transaction: t
                                }).then(function (detalleCreado) {
                                    //  req.body.mensaje += "cliente pedido: " + detalle_despacho.despacho.cliente.razon_social + " producto: " + producto.nombre + " inventario=" + totalInventario + "cantidad despachadas=" + cantidad + "|---|"
                                }))

                        }
                    }
                }
                return Promise.all(promises);
            } else {
                var anterior = false
                if (!item.modificable) {
                    anterior = true
                }

                return RrhhEmpleadoDotacionRopaItem.create({
                    id_dotacion_ropa: dotacionCreada.dataValues.id,
                    id_producto: item.producto.id,
                    entregado: false,
                    id_ropa_trabajo: item.ropaTrabajo.id,
                    id_cargo: item.cargo.id,
                    cantidad: item.cantidad,
                    anterior: anterior
                }, {
                        transaction: t
                    }).then(function (detalleCreado) {
                        return new Promise(function (fulfill, reject) {
                            fulfill({});
                        }); //  req.body.mensaje += "cliente pedido: " + detalle_despacho.despacho.cliente.razon_social + " producto: " + producto.nombre + " inventario=" + totalInventario + "cantidad despachadas=" + cantidad + "|---|"
                    })
                //if (index == (array.length - 1)) {

                //}
            }
        } else {
            //if (index == (array.length - 1)) {
            return new Promise(function (fulfill, reject) {
                fulfill(venta);
            });
            //}
        }
    }
    router.route('/recursos-humanos/ropa-trabajo/empleado/:id_empleado/inicio/:inicio/fin/:fin')
        .get(function (req, res) {
            var condicionRopaTrabajo = { id_empleado: req.params.id_empleado, eliminado: false }
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 59, 0);
                condicionRopaTrabajo = { id_empleado: req.params.id_empleado, eliminado: false, fecha: { $between: [inicio, fin] } };
            }
            RrhhEmpleadoDotacionRopa.findAll({
                where: condicionRopaTrabajo,
                include: [{ model: Sucursal, as: "sucursal" }, { model: Almacen, as: "almacen" }, {
                    model: RrhhEmpleadoDotacionRopaItem, as: "dotacionItems",
                    include: [{ model: Clase, as: "cargo" }, { model: Clase, as: "ropaTrabajo" }, { model: Producto, as: "producto", include: [{ model: Inventario, as: 'inventarios' }] }]
                },
                { model: MedicoPaciente, as: "empleado" },
                { model: Clase, as: "estado" },
                { model: Clase, as: "periodo" },
                { model: Clase, as: "cumplimiento" },
                { model: Usuario, as: "usuario", include: [{ model: Persona, as: 'persona' }] }],
                order: [["id", "asc"]]
            }).then(function (entity) {
                res.json(entity)
            })
        })
    router.route('/recursos-humanos/ropa-trabajo/empresa/:id_empresa/inicio/:inicio/fin/:fin/campamento/:campamento')
        .get(function (req, res) {
            var condicionRopaTrabajo = { eliminado: false }
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 59, 0);
                condicionRopaTrabajo = { eliminado: false, fecha: { $between: [inicio, fin] } };
            }
            RrhhEmpleadoDotacionRopaItem.findAll({
                where: { anterior: false },
                include: [{ model: Clase, as: "cargo" }, { model: Clase, as: "ropaTrabajo" }, { model: Producto, as: "producto" }, {
                    model: RrhhEmpleadoDotacionRopa, as: "dotacionRopa", where: condicionRopaTrabajo,
                    include: [{ model: MedicoPaciente, as: "empleado", where: { id_campo: req.params.campamento, id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona' }] },
                    { model: Clase, as: "estado" },
                    { model: Clase, as: "periodo" },
                    { model: Clase, as: "cumplimiento" },
                    { model: Usuario, as: "usuario", include: [{ model: Persona, as: 'persona' }] }]
                }],
                order: [["dotacion_ropa", "asc"]]
            }).then(function (entity) {
                res.json(entity)
            })
            /* MedicoPaciente.findAll({     
                where: { id_empresa: req.params.id_empresa,id_campo:req.params.campamento }, 
                include:[{ model: Persona, as: 'persona' },{model:RrhhEmpleadoDotacionRopa,as:"dotacionesRopa",require:false, where:condicionRopaTrabajo,include: [{
                    model: RrhhEmpleadoDotacionRopaItem, as: "dotacionItems",        
                    include: [{ model: Clase, as: "cargo" }, { model: Clase, as: "ropaTrabajo" }, { model: Producto, as: "producto" }]
                },
                { model: Clase, as: "estado" },
                { model: Clase, as: "periodo" },
                { model: Clase, as: "cumplimiento" },
                { model: Usuario, as: "usuario", include: [{ model: Persona, as: 'persona' }] }]}]
                
            }).then(function (entity) {
                res.json(entity)
            })  */
        })
    router.route('/recursos-humanos/viaje/empresa/:id_empresa/inicio/:inicio/fin/:fin/tipoPasajero/:tipoPasajero/destino/:destino/vehiculo/:vehiculo/conductor/:conductor/tipoViaje/:tipoViaje/pagina/:pagina/items_pagina/:items_pagina/texto_busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
        .get(function (req, res) {
            var condicionViaje = { id_empresa: req.params.id_empresa }
            var condicionDetalleViaje = {}
            var condicionEmpleado = {}
            if (req.params.inicio != 0 && req.params.fin != 0) {
                var fechaInicial = new Date(req.params.inicio);
                var fechaFinal = new Date(req.params.fin);
                fechaInicial.setHours(0, 0, 0, 0, 0);
                fechaFinal.setHours(23, 59, 59, 59, 0);
                condicionViaje = {
                    id_empresa: req.params.id_empresa,
                    $or: [
                        {
                            fecha: { $between: [fechaInicial, fechaFinal] },
                        }
                    ]
                };
            }
            if (req.params.tipoPasajero != 0) {
                if (req.params.tipoPasajero == "E") {
                    condicionDetalleViaje.id_ficha = { $ne: null }
                } else if (req.params.tipoPasajero == "V") {
                    condicionDetalleViaje.id_visita = { $ne: null }
                }
            }
            if (req.params.vehiculo != 0) {
                condicionViaje.id_vehiculo = req.params.vehiculo
            }
            if (req.params.conductor != 0) {
                condicionViaje.id_conductor = req.params.conductor
            }
            if (req.params.tipoViaje != 0) {
                condicionDetalleViaje.id_tipo_viaje = parseInt(req.params.tipoViaje)
            }
            if (req.params.destino != 0) {
                condicionDetalleViaje.id_campo = parseInt(req.params.destino)
            }
            RrhhViajeDetalle.findAndCountAll({
                where: condicionDetalleViaje,
                offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                include: [{ model: Clase, as: 'estado' }, { model: Clase, as: 'campo' }, { model: Clase, as: "tipoViaje" }, { model: RrhhViaje, as: "viaje", where: condicionViaje, include: [{ model: Clase, as: "vehiculo" }, { model: RrhhViajeConductor, as: "conductor", required: false }] },
                { model: Persona, as: "visita", required: false },
                { model: RrhhEmpleadoFicha, as: "ficha", required: false, include: [{ model: MedicoPaciente, as: "empleado", required: false, include: [{ model: Persona, as: "persona", required: false }] }] }],
                order: [["id", "asc"]]
            }).then(function (datos) {
                res.json({ viajes: datos.rows, paginas: Math.ceil(datos.count / req.params.items_pagina) });
            })
        })

    router.route('/recursos-humanos/viaje/empresa/:id_empresa/inicio/:inicio/fin/:fin/destino/:destino/vehiculo/:vehiculo/conductor/:conductor/relevo/:relevo/pagina/:pagina/items_pagina/:items_pagina/texto_busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
        .get(function (req, res) {
            var condicionViaje = { id_empresa: req.params.id_empresa }
            var condicionDetalleViaje = {}
            var condicionEmpleado = {}
            if (req.params.inicio != 0 && req.params.fin != 0) {
                var fechaInicial = new Date(req.params.inicio);
                var fechaFinal = new Date(req.params.fin);
                fechaInicial.setHours(0, 0, 0, 0, 0);
                fechaFinal.setHours(23, 59, 59, 59, 0);
                condicionViaje = {
                    id_empresa: req.params.id_empresa,
                    $or: [
                        {
                            fecha: { $between: [fechaInicial, fechaFinal] },
                        }
                    ]
                };
            }
            if (req.params.vehiculo != 0) {
                condicionViaje.id_vehiculo = req.params.vehiculo
            }
            if (req.params.conductor != 0) {
                condicionViaje.id_conductor = req.params.conductor
            }
            if (req.params.relevo != 0) {
                condicionViaje.id_relevo = parseInt(req.params.tipoViaje)
            }
            if (req.params.destino != 0) {
                condicionDetalleViaje.id_campo = parseInt(req.params.destino)
            }
            RrhhViaje.findAndCountAll({
                where: condicionViaje,
                offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                include: [{ model: Clase, as: "vehiculo" },
                { model: RrhhViajeConductor, as: "conductor", required: false, include: [{ model: Clase, as: 'tipoLicencia' }] },
                { model: RrhhViajeConductor, as: "relevo", required: false, include: [{ model: Clase, as: 'tipoLicencia' }] },
                { model: RrhhViajeDestino, as: "destinos", include: [{ model: Clase, as: 'destino' }] },
                {
                    model: RrhhViajeDetalle, as: "viajeDetalles",
                    include: [{ model: Clase, as: 'estado' }, { model: Clase, as: 'campo' }, { model: Clase, as: "tipoViaje" },
                    { model: Persona, as: "visita", required: false },
                    { model: RrhhEmpleadoFicha, as: "ficha", required: false, include: [{ model: MedicoPaciente, as: "empleado", required: false, include: [{ model: Persona, as: "persona", required: false }] }] }]
                }],

                order: [["id", "asc"]]
            }).then(function (datos) {
                res.json({ viajes: datos.rows, paginas: Math.ceil(datos.count / req.params.items_pagina) });
            })
        })
    router.route('/recursos-humanos/viaje/empresa/:id_empresa')
        .post(function (req, res) {
            RrhhViaje.create({
                id_empresa: req.params.id_empresa,
                id_vehiculo: req.body.vehiculo.id,
                id_conductor: req.body.conductor.id,
                id_relevo: req.body.relevo.id,
                fecha_ingreso: req.body.fecha_ingreso,
                fecha_salida: req.body.fecha_salida,
                fecha: req.body.fecha,
                eliminado: true
            }).then(function (viajeCreado) {
                req.body.destinos.forEach(function (destino, index, array) {
                    RrhhViajeDestino.create({
                        id_viaje: viajeCreado.id,
                        id_destino: destino.id,
                    }).then(function (destinoCreado) {
                        if (index === (array.length - 1)) {
                            if (req.body.empleadosEntrada.length > 0) {
                                req.body.empleadosEntrada.forEach(function (entrada, index, array) {
                                    if (entrada.esVisita) {
                                        Persona.create({
                                            nombres: entrada.persona.nombres,
                                            apellido_paterno: entrada.persona.apellido_paterno,
                                            apellido_materno: entrada.persona.apellido_materno,
                                            nombre_completo: entrada.persona.nombre_completo,
                                            ci: entrada.persona.ci,
                                            id_expedido: entrada.persona.expedido.id,
                                        }).then(function (personaCreada) {
                                            RrhhViajeDetalle.create({
                                                id_viaje: viajeCreado.id,
                                                id_visita: personaCreada.id,
                                                eliminado: false,
                                                id_estado: entrada.estado.id,
                                                id_tipo_viaje: entrada.tipoViaje.id,
                                                habilitado: entrada.habilitado,
                                                id_campo: entrada.campo.id
                                            }).then(function (destinoCreado) {
                                                if (index === (array.length - 1)) {
                                                    guardarEmpleadosSalida(req, res, viajeCreado)
                                                }
                                            })
                                        })

                                    } else {
                                        RrhhViajeDetalle.create({
                                            id_viaje: viajeCreado.id,
                                            id_ficha: entrada.id_ficha,
                                            eliminado: false,
                                            id_estado: entrada.estado.id,
                                            id_tipo_viaje: entrada.tipoViaje.id,
                                            habilitado: entrada.habilitado,
                                            id_campo: entrada.campo.id
                                        }).then(function (destinoCreado) {
                                            if (index === (array.length - 1)) {
                                                guardarEmpleadosSalida(req, res, viajeCreado)
                                            }
                                        })
                                    }

                                })
                            } else {
                                guardarEmpleadosSalida(req, res, viajeCreado)
                            }
                        }
                    })

                });
            })
        })
    function guardarEmpleadosSalida(req, res, viajeCreado) {
        if (req.body.empleadosSalida.length > 0) {
            req.body.empleadosSalida.forEach(function (salida, index, array) {
                if (salida.esVisita) {
                    Persona.create({
                        nombres: salida.persona.nombres,
                        apellido_paterno: salida.persona.apellido_paterno,
                        apellido_materno: salida.persona.apellido_materno,
                        nombre_completo: salida.persona.nombre_completo,
                        ci: salida.persona.ci,
                        id_expedido: salida.persona.expedido.id,
                    }).then(function (personaCreada) {
                        RrhhViajeDetalle.create({
                            id_viaje: viajeCreado.id,
                            id_visita: personaCreada.id,
                            eliminado: false,
                            id_estado: salida.estado.id,
                            id_tipo_viaje: salida.tipoViaje.id,
                            habilitado: salida.habilitado,
                            id_campo: salida.campo.id
                        }).then(function (destinoCreado) {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Creado Satisfactoriamente" })
                            }
                        })
                    })

                } else {
                    RrhhViajeDetalle.create({
                        id_viaje: viajeCreado.id,
                        id_ficha: salida.id_ficha,
                        eliminado: false,
                        id_estado: salida.estado.id,
                        id_tipo_viaje: salida.tipoViaje.id,
                        habilitado: salida.habilitado,
                        id_campo: salida.campo.id
                    }).then(function (destinoCreado) {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: "Creado Satisfactoriamente" })
                        }
                    })
                }

            })
        } else {
            res.json({ mensaje: "Creado Satisfactoriamente" })
        }
    }
    router.route('/recursos-humanos/conductor/empresa/:id_empresa')
        .post(function (req, res) {
            req.body.forEach(function (conductor, index, array) {
                if (conductor.id_empleado) {
                    if (index === (array.length - 1)) {
                        res.json({ mensaje: "Agregados satisfactoriamente!" })
                    }
                } else {
                    if (conductor.id) {
                        RrhhViajeConductor.update({
                            nombre: conductor.nombre,
                            licencia: conductor.licencia,
                            habilitado: conductor.habilitado,
                            id_empresa: req.params.id_empresa,
                            id_tipo_licencia: conductor.tipoLicencia.id,
                        }, {
                                where: { id: conductor.id }
                            }).then(function (ConductorActualizado) {
                                if (index === (array.length - 1)) {
                                    res.json({ mensaje: "Agregados satisfactoriamente!" })
                                }
                            })
                    } else {
                        RrhhViajeConductor.create({
                            nombre: conductor.nombre,
                            licencia: conductor.licencia,
                            habilitado: conductor.habilitado,
                            id_empresa: req.params.id_empresa,
                            id_tipo_licencia: conductor.tipoLicencia.id,
                        }).then(function (ConductorCreado) {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: "Agregados satisfactoriamente!" })
                            }
                        })
                    }

                }
            });
        });
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
                condicion_evaluacion.mes = parseInt(req.params.mes) - 1
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
            } else {
                // condicion_empleado.eliminado = false
            }
            if (req.params.codigo !== "0") {
                condicion_empleado.codigo = { $like: req.params.codigo + '%' }
            }
            if (req.params.nombre !== "0") {
                condicion_persona.nombre_completo = { $like: '%' + req.params.nombre + '%' }
            }
            if (req.params.apellido !== "0") {
                condicion_persona.nombre_completo = { $like: '%' + req.params.apellido + '%' }
            }
            condicion_empleado.es_empleado = true
            condicion_empleado.id_empresa = req.params.id_empresa
            condicion_evaluacion.eliminado = false
            EvaluacionPolifuncional.findAndCountAll({
                offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                where: condicion_evaluacion,
                include: [{
                    model: MedicoPaciente, as: 'empleado',
                    where: condicion_empleado,
                    include: [{ model: Clase, as: 'campo' }, {
                        model: RrhhEmpleadoFicha, as: 'empleadosFichas', include: [{
                            model: RrhhEmpleadoCargo, as: 'cargos', where: condicion_cargos, include: [{ model: Clase, as: 'cargo' }]
                        }
                        ]
                    }, { model: Persona, as: 'persona', where: condicion_persona }]
                    // }
                    //  include: [{
                    //     model: RrhhEmpleadoCargo, as: 'cargos', required: false,
                    //     where: { $or: condicion_cargos },
                    //     include: [{ model: Clase, as: 'cargo' }]
                    // } , { model: Persona, as: 'persona', where: condicion_persona }]
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
                    es_empleado: true,
                    id_empresa: req.params.id_empresa
                }, include: [{ model: RrhhEmpleadoFicha, as: 'empleadosFichas', include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }] }, { model: Persona, as: 'persona' }]
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
                        mes: req.body.mes.id,
                        id_empresa: req.params.id_empresa,
                        eliminado: false
                        // fecha: req.body.fecha,
                    },
                    include: [{
                        model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa },
                        include: [{ model: RrhhEmpleadoFicha, as: 'empleadosFichas', include: [{ model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] }] }, { model: Persona, as: 'persona' }]
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
                        eliminado: req.body.eliminado,
                        id_empresa: req.params.id_empresa
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
                eliminado: req.body.eliminado,
                id_empresa: req.params.id_empresa
            }, {
                    where: { id: req.body.id }
                }).then(function (evaluacionCreada) {
                    res.json({ mensaje: 'Evaluación modificada correctamente!' })
                }).catch(function (err) {
                    res.json({ mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
                });
        })

    router.route('/evaluacion/personal/test/:id_empresa')
        .post(function (req, res) {
            MedicoPaciente.findAll({
                where: {
                    es_empleado: true,
                    id_empresa: req.params.id_empresa
                }
            }).then(function (empleados) {
                empleados.map(function (empleado, i) {
                    EvaluacionPolifuncional.findOrCreate({
                        where: {
                            id_empleado: empleado.id,
                            anio: new Date().getFullYear(),
                            mes: new Date().getMonth() + 4,
                            id_empresa: req.params.id_empresa,
                            eliminado: false
                            // fecha: req.body.fecha
                        },
                        defaults: {
                            id_empleado: empleado.id,
                            anio: new Date().getFullYear(),
                            mes: new Date().getMonth() + 4,
                            fecha: new Date(),
                            asistencia_capacitacion: Math.floor((Math.random() * 10) + 1),
                            documentos_actualizados: Math.floor((Math.random() * 10) + 1),
                            trabajo_equipo: Math.floor((Math.random() * 10) + 1),
                            funciones_puntualidad: Math.floor((Math.random() * 10) + 1),
                            higiene_personal: Math.floor((Math.random() * 10) + 1),
                            asistencia_reunion: Math.floor((Math.random() * 10) + 1),
                            ingreso_campo: Math.floor((Math.random() * 10) + 1),
                            llenado_formularios: Math.floor((Math.random() * 10) + 1),
                            nota_total: 80,
                            id_desempenio: 8,
                            encargado: false,
                            eliminado: false,
                            id_empresa: req.params.id_empresa
                        }
                    }).spread(function (evaluacion, nueva) {
                        if (i === empleados.length - 1) {
                            res.json({ mensaje: 'Evaluación Creada satisfactoriamente!' })
                        }
                    }).catch(function (err) {
                        res.json({ mensaje: err.message !== undefined ? err.stack : err.message, hasErr: true })
                    });
                })
            })
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

    router.route('/reportes/:desde_mes/:desde_anio/:hasta_mes/:hasta_anio/:id_empresa')
        .get(function (req, res) {
            var desde = new Date(parseInt(req.params.desde_anio), parseInt(req.params.desde_mes), 1, 0, 0, 0)
            var hasta = new Date(parseInt(req.params.hasta_anio), parseInt(req.params.hasta_mes) + 1, 0, 23, 59, 0)
            var condicion = { fecha: { $between: [desde, hasta] }, eliminado: false }
            MedicoPaciente.findAll({
                where: {
                    es_empleado: true,
                    id_empresa: req.params.id_empresa
                }, include: [{ model: Clase, as: 'campo' }, { model: RrhhEmpleadoFicha, as: 'empleadosFichas', required: false, include: [{ model: RrhhEmpleadoCargo, as: 'cargos', required: false, include: [{ model: Clase, as: 'cargo' }] }] },
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

    router.route('/reportes/anual/:anio/campos/:id_empresa')
        .get(function (req, res) {
            var condicionCampo = {}
            EvaluacionPolifuncional.findAll({
                where: { anio: req.params.anio },
                include: [{
                    model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa }, required: true, include: [{ model: Clase, as: 'campo' }]
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
                if (reporteAnual.length > 0) {
                    reporteAnual.map(function (campo, i) {
                        campo.asistencia_capacitacion = campo.asistencia_capacitacion / campo.count
                        campo.documentos_actualizados = campo.documentos_actualizados / campo.count
                        campo.trabajo_equipo = campo.trabajo_equipo / campo.count
                        campo.funciones_puntualidad = campo.funciones_puntualidad / campo.count
                        campo.higiene_personal = campo.higiene_personal / campo.count
                        campo.asistencia_reunion = campo.asistencia_reunion / campo.count
                        campo.ingreso_campo = campo.ingreso_campo / campo.count
                        campo.llenado_formularios = campo.llenado_formularios / campo.count
                        campo.total = campo.asistencia_capacitacion + campo.documentos_actualizados + campo.trabajo_equipo + campo.funciones_puntualidad + campo.higiene_personal + campo.asistencia_reunion + campo.ingreso_campo + campo.llenado_formularios
                        if (i == reporteAnual.length - 1) {
                            res.json({ reporte: reporteAnual })
                        }
                    })
                } else {
                    res.json({ reporte: [], mensaje: 'No existen datos.' })
                }

            }).catch(function (err) {
                res.json({ reporte: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })

    ////////////////////////////////////////////////////////////////Reporte Anual de campo

    router.route('/reportes/anual/:anio/:campo/:id_empresa')
        .get(function (req, res) {
            var condicionCampo = {}
            EvaluacionPolifuncional.findAll({
                where: { anio: req.params.anio },
                include: [{
                    model: MedicoPaciente, as: 'empleado', where: { id_empresa: req.params.id_empresa, id_campo: req.params.campo }, required: true
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
                if (reporteAnual.length > 0) {
                    reporteAnual.map(function (campo, i) {
                        campo.asistencia_capacitacion = campo.asistencia_capacitacion / campo.count
                        campo.documentos_actualizados = campo.documentos_actualizados / campo.count
                        campo.trabajo_equipo = campo.trabajo_equipo / campo.count
                        campo.funciones_puntualidad = campo.funciones_puntualidad / campo.count
                        campo.higiene_personal = campo.higiene_personal / campo.count
                        campo.asistencia_reunion = campo.asistencia_reunion / campo.count
                        campo.ingreso_campo = campo.ingreso_campo / campo.count
                        campo.llenado_formularios = campo.llenado_formularios / campo.count
                        campo.total = campo.asistencia_capacitacion + campo.documentos_actualizados + campo.trabajo_equipo + campo.funciones_puntualidad + campo.higiene_personal + campo.asistencia_reunion + campo.ingreso_campo + campo.llenado_formularios
                        if (i == reporteAnual.length - 1) {
                            res.json({ reporte: reporteAnual })
                        }
                    })
                } else {
                    res.json({ reporte: [], mensaje: 'No existen datos.' })
                }


            }).catch(function (err) {
                res.json({ reporte: [], mensaje: err.message === undefined ? err.stack : err.message, hasErr: true })
            });
        })

    ///////////////////////////////////////////////////// FIN RUTAS POLIFUNCIONAL /////////////////////////////////////////////////////

    //bitacora de cambios ficha
    function guardarBitacoraCambiosFicha(fichaAnterior, empleado, req, res) {
        RrhhEmpleadoFicha.findAll({
            limit: 1,
            where: {
                id_empleado: empleado.id
            },
            include: [{ model: Clase, as: 'tipoContrato' }, { model: RrhhEmpleadoCargo, as: 'cargos', include: [{ model: Clase, as: 'cargo' }] },
            { model: Clase, as: 'tipoPersonal' },
            { model: Clase, as: 'cargaHorario' },
            { model: Clase, as: 'area' },
            { model: Clase, as: 'ubicacion' },
            { model: Clase, as: 'seguroSalud' },
            { model: Clase, as: 'lugarSeguroSalud' },
            { model: Clase, as: 'aporteSeguroLargoPlazo' },
            { model: Clase, as: 'lugarSeguroLargoPlazo' },
            { model: Clase, as: 'banco' },
            { model: RrhhEmpleadoDiscapacidad, as: 'discapacidades', include: [{ model: Clase, as: "discapacidad" }] },
            /* { model: RrhhEmpleadoFichaFamiliar, as: 'familiares' },*/
            { model: RrhhEmpleadoFichaOtrosSeguros, as: 'otrosSeguros', include: [{ model: Clase, as: "tipoSeguro" }] },
            {
                model: MedicoPaciente, as: 'empleado',
                include: [{ model: RrhhEmpleadoFichaFamiliar, as: 'familiares', include: [{ model: Clase, as: 'relacion' }, { model: Persona, as: 'persona', include: [{ model: Clase, as: 'genero' }] }] },
                { model: Clase, as: 'extension' }, { model: Clase, as: 'tipoDocumento' },
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
        }).then(function (fichas) {
            var fichaActual = fichas[0]
            res.json({ message: "Ficha empleado actualizada satisfactoriamente!", fichaActual: fichaActual, fichaAnterior: fichaAnterior })

        })
    }
}

