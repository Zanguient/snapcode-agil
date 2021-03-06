module.exports = function (router, sequelize, Sequelize, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, Tipo, Clase, CajaChica, SolicitudCajaChica, Empresa, ConceptoMovimientoCajaChica, MedicoPaciente, Usuario, Persona, ContabilidadCuenta,
    Movimiento, Proveedor, Compra, Sucursal, CierreCajaChica, DetalleCompra, Producto) {

    router.route('/solicitud-caja-chica')
        .post(function (req, res) {
            if (req.body.id) {
                SolicitudCajaChica.update({
                    id_usuario: req.body.usuario.id,
                    fecha: req.body.fecha,
                    id_solicitante: req.body.solicitante.id,
                    id_concepto: req.body.concepto.id,
                    monto: req.body.monto,
                    eliminado: req.body.eliminado,
                    id_estado: req.body.estado.id,
                    detalle: req.body.detalle,
                    id_sucursal: req.body.sucursal.id,
                    id_autorizador: req.body.autorizador
                }, {
                        where: { id: req.body.id }
                    }).then(function (SolicitudCreada) {
                        res.json({ mensaje: 'Actualizado Satisfactoriamente!' });
                    });
            } else {
                SolicitudCajaChica.create({
                    id_usuario: req.body.usuario.id,
                    fecha: req.body.fecha,
                    id_solicitante: req.body.solicitante.id,
                    detalle: req.body.detalle,
                    id_concepto: req.body.concepto.id,
                    monto: req.body.monto,
                    eliminado: false,
                    id_estado: req.body.estado.id,
                    id_sucursal: req.body.sucursal.id,
                    id_autorizador: req.body.autorizador
                }).then(function (SolicitudCreada) {
                    res.json({ mensaje: 'Creado Satisfactoriamente!' });
                });
            }

        })

    router.route('/verificar-solicitudes-caja-chica')
        .put(function (req, res) {
            Tipo.find({
                where: { nombre_corto: 'ES_CCH' }
            }).then(function (tipoE) {
                Clase.find({
                    where: { id_tipo: tipoE.id, nombre_corto: 'VERIFICADO' }
                }).then(function (claseE) {
                    req.body.solicitudes.forEach(function (solicitud, index, array) {
                        SolicitudCajaChica.update({
                            id_estado: claseE.id,
                            id_verificador: req.body.id_verificador
                        }, {
                                where: { id: solicitud.id }
                            }).then(function (SolicitudActualizada) {
                                if (index === (array.length - 1)) {
                                    if (index > 1) {
                                        res.json({ mensaje: 'Actualizados Satisfactoriamente!' });
                                    } else {
                                        res.json({ mensaje: 'Actualizado Satisfactoriamente!' });
                                    }
                                }
                            });
                    })
                })
            })

        })
    router.route('/alertas-solicitud-caja-chica/empresa/:id_empresa/historico/:historico/mes/:mes/anio/:anio/verificador/:id_verificador')
        .get(function (req, res) {
            var condicionCajaChica = { id_verificador: null }
            var inicio = ""
            var fin = ""
            if (req.params.historico != 0) {
                condicionCajaChica.id_verificador = req.params.id_verificador
            }
            if (req.params.anio != 0) {
                var aniofin = parseInt(req.params.anio) + 1
                inicio = new Date(req.params.anio, 0, 1)
                fin = new Date(aniofin, 0, 0)

                condicionCajaChica.fecha = { $between: [inicio, fin] }
                if (req.params.mes != 0) {
                    var mes = parseInt(req.params.mes) - 1

                    inicio = new Date(req.params.anio, mes, 1)
                    fin = new Date(req.params.anio, req.params.mes, 0)
                    condicionCajaChica.fecha = { $between: [inicio, fin] }
                }
            }
            var datosbusqueda = {

                where: condicionCajaChica,
                include: [{ model: Sucursal, as: 'sucursal' },
                {
                    model: CajaChica, as: 'cajasChicas', required: true,
                    include: [{ model: Sucursal, as: 'sucursal' },
                    {
                        model: ConceptoMovimientoCajaChica, as: 'concepto',
                        include: [{ model: Clase, as: 'concepto' }]
                    },
                    { model: ContabilidadCuenta, as: 'cuenta' },
                    {
                        model: Compra, as: 'compra',
                        include: [{ model: Proveedor, as: 'proveedor' },
                        { model: Sucursal, as: 'sucursal' },
                        {
                            model: Movimiento, as: 'movimiento', required: false,
                            include: [{ model: Clase, as: 'clase' }]
                        }]
                    }]
                },
                {
                    model: MedicoPaciente, as: 'solicitante',
                    include: [{ model: Persona, as: 'persona' }]
                },
                {
                    model: ConceptoMovimientoCajaChica, as: 'concepto',
                    include: [{ model: Clase, as: 'concepto', where: { nombre_corto: "KARDEX" } }]
                },
                { model: Clase, as: 'estado' },
                {
                    model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa },
                    include: [{ model: Persona, as: 'persona' }]
                }],
                //order: [['nombre', 'asc']]

            }
            SolicitudCajaChica.findAll(
                datosbusqueda
            ).then(function (solicitudes) {
                res.json(solicitudes)
            })

        })
    router.route('/solicitud-conceptos-caja-chica/empresa/:id_empresa')
        .post(function (req, res) {
            req.body.forEach(function (concepto, index, array) {
                if (concepto.id) {
                    ConceptoMovimientoCajaChica.update({
                        nombre: concepto.nombre,
                        id_movimiento: concepto.concepto.id,
                        habilitado: concepto.habilitado,

                    },
                        {
                            where: {
                                id: concepto.id
                            }
                        }).then(function (SolicitudCreada) {
                            if (index === (array.length - 1)) {
                                res.json({ mensaje: 'Guarado Satisfactoriamente!' });
                            }
                        });
                } else {
                    ConceptoMovimientoCajaChica.create({
                        nombre: concepto.nombre,
                        id_movimiento: concepto.concepto.id,
                        id_empresa: req.params.id_empresa,
                        habilitado: concepto.habilitado,
                        eliminado: false
                    }).then(function (SolicitudCreada) {
                        if (index === (array.length - 1)) {
                            res.json({ mensaje: 'Guarado Satisfactoriamente!' });
                        }
                    });
                }
            });
        })
        .get(function (req, res) {
            ConceptoMovimientoCajaChica.findAll({
                where: { id_empresa: req.params.id_empresa },
                include: { model: Clase, as: 'concepto' }
            }).then(function (SolicitudCreada) {
                res.json(SolicitudCreada);
            });
        })

    router.route('/caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/fecha/:fecha/saldoInicial/:saldo')
        .get(function (req, res) {
            CajaChica.findAll({
                include: [{ model: Sucursal, as: 'sucursal', where: { id: req.params.id_sucursal } }, { model: SolicitudCajaChica, as: 'solicitud', include: [{ model: Clase, as: 'estado' }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona' }] }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', where: { id_empresa: req.params.id_empresa }, include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }],
                where: { id_padre: null, cerrada: false },
                order: [['fecha', 'asc']]
            }).then(function (cajas) {
                if (cajas.length > 0) {
                    CierreCajaChica.create({
                        inicio: cajas[0].fecha,
                        fin: cajas[cajas.length - 1].fecha,
                        fecha: req.params.fecha,
                        saldo_inicial: parseInt(req.params.saldo),
                    }).then(function (cierreCajaChicaCreado) {
                        cajas.forEach(function (caja, index, array) {
                            CajaChica.update({
                                id_cierre_caja_chica: cierreCajaChicaCreado.id,
                                cerrada: true
                            }, {
                                    where: { id: caja.id }
                                }).then(function (cajaChicaActualizada) {
                                    if (index === (array.length - 1)) {
                                        CierreCajaChica.find({
                                            where: { id: cierreCajaChicaCreado.id },
                                            include: [{
                                                model: CajaChica, as: 'detalleCierreCaja',
                                                include: [{ model: Sucursal, as: 'sucursal', where: { id: req.params.id_sucursal } }, {
                                                    model: SolicitudCajaChica, as: 'solicitud',
                                                    include: [{ model: Clase, as: 'estado' },
                                                    {
                                                        model: MedicoPaciente, as: 'solicitante',
                                                        include: [{ model: Persona, as: 'persona' }]
                                                    }]
                                                },
                                                {
                                                    model: ConceptoMovimientoCajaChica, as: 'concepto', where: { id_empresa: req.params.id_empresa },
                                                    include: [{ model: Clase, as: 'concepto' }]
                                                },
                                                { model: ContabilidadCuenta, as: 'cuenta' },
                                                {
                                                    model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' },
                                                    { model: Sucursal, as: 'sucursal' },
                                                    {
                                                        model: Movimiento, as: 'movimiento', required: false,
                                                        include: [{ model: Clase, as: 'clase' }]
                                                    }]
                                                }]
                                            }],
                                            order: [[{ model: CajaChica, as: 'detalleCierreCaja' }, 'id', 'asc']]
                                        }).then(function (datosEncontrados) {
                                            res.json({ cierreCaja: datosEncontrados });
                                        })

                                    }
                                })
                        })

                    })
                } else {
                    res.json({ cierreCaja: [] });
                }
            });

        })
    router.route('/cierre-caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
        .get(function (req, res) {
            CierreCajaChica.findAndCountAll({
                include: [{
                    model: CajaChica, as: 'detalleCierreCaja',
                    include: [{ model: Sucursal, as: 'sucursal', where: { id: req.params.id_sucursal } }, {
                        model: SolicitudCajaChica, as: 'solicitud',
                        include: [{ model: Clase, as: 'estado' },
                        {
                            model: MedicoPaciente, as: 'solicitante',
                            include: [{ model: Persona, as: 'persona' }]
                        }]
                    },
                    {
                        model: ConceptoMovimientoCajaChica, as: 'concepto', where: { id_empresa: req.params.id_empresa },
                        include: [{ model: Clase, as: 'concepto' }]
                    },
                    { model: ContabilidadCuenta, as: 'cuenta' },
                    {
                        model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' },
                        { model: Sucursal, as: 'sucursal' },
                        {
                            model: Movimiento, as: 'movimiento', required: false,
                            include: [{ model: Clase, as: 'clase' }]
                        }]
                    }]
                }]
            }).then(function (data) {
                CierreCajaChica.findAll({
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    include: [{
                        model: CajaChica, as: 'detalleCierreCaja',
                        include: [{ model: Sucursal, as: 'sucursal', where: { id: req.params.id_sucursal } }, {
                            model: SolicitudCajaChica, as: 'solicitud',
                            include: [{ model: Clase, as: 'estado' },
                            {
                                model: MedicoPaciente, as: 'solicitante',
                                include: [{ model: Persona, as: 'persona' }]
                            }]
                        },
                        {
                            model: ConceptoMovimientoCajaChica, as: 'concepto', where: { id_empresa: req.params.id_empresa },
                            include: [{ model: Clase, as: 'concepto' }]
                        },
                        { model: ContabilidadCuenta, as: 'cuenta' },
                        {
                            model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' },
                            { model: Sucursal, as: 'sucursal' },
                            {
                                model: Movimiento, as: 'movimiento', required: false,
                                include: [{ model: Clase, as: 'clase' }]
                            }]
                        }]
                    }],
                    order: [[{ model: CajaChica, as: 'detalleCierreCaja' }, 'id', 'asc']]
                }).then(function (datosEncontrados) {
                    res.json({ cierreCaja: datosEncontrados, paginas: Math.ceil(data.count / req.params.items_pagina) });
                    /*      res.json({ cierreCaja: datosEncontrados }); */
                })
            })
        })
    //start pagator caja chica
    router.route('/caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion')
        .get(function (req, res) {
            CajaChica.findAndCountAll({
                include: [{ model: Sucursal, as: 'sucursal', where: { id: req.params.id_sucursal } }, { model: ConceptoMovimientoCajaChica, as: 'concepto', where: { id_empresa: req.params.id_empresa }, include: [{ model: Clase, as: 'concepto', where: { nombre_corto: 'INGRESO' } }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }],
                where: { id_solicitud: null }
            }).then(function (data) {
                CajaChica.findAll({
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    include: [{ model: Sucursal, as: 'sucursal', where: { id: req.params.id_sucursal } }, { model: ConceptoMovimientoCajaChica, as: 'concepto', where: { id_empresa: req.params.id_empresa }, include: [{ model: Clase, as: 'concepto', where: { nombre_corto: 'INGRESO' } }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }],
                    where: { id_solicitud: null }
                }).then(function (solicitudes) {
                    res.json({ ingresos: solicitudes, paginas: Math.ceil(data.count / req.params.items_pagina) });
                });
            });
        })
    //Start paginador solicitudes
    router.route('/solocitudes-caja-chica/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/solicitante/:solicitante/usuario/:usuario/estado/:estado/concepto/:concepto/movimiento/:movimiento/usuario-no-autorizado/:id_usuario_no_autorizado')
        .get(function (req, res) {
            var condicionCajaChica = {};
            /* var condicionSolicitud={} */
            var condicionPersonaUsuario = {};
            var condicionPersonaSolicitanter = {};
            if (req.params.estado != 0) {
                condicionCajaChica.id_estado = req.params.estado
            }
            if (req.params.concepto != 0) {
                condicionCajaChica.id_concepto = req.params.concepto
            }
            if (req.params.usuario != 0) {
                condicionPersonaUsuario.nombre_completo = {
                    $like: "%" + req.params.usuario + "%"
                }
            }
            if (req.params.solicitante != 0) {
                condicionPersonaSolicitanter.nombre_completo = {
                    $like: "%" + req.params.solicitante + "%"
                }
            }
            if (req.params.id_usuario_no_autorizado != 0) {
                condicionCajaChica.id_usuario = parseInt(req.params.id_usuario_no_autorizado)
            }

            if (req.params.texto_busqueda != 0) {
                condicionCajaChica = {
                    $or: [
                        {
                            detalle: {
                                $like: "%" + req.params.texto_busqueda + "%"
                            }
                        }
                    ]
                };
            }
            var condicionConceptoClase = {}
            if (req.params.movimiento != '0') {
                condicionConceptoClase.id = req.params.movimiento
            }
            if (req.params.items_pagina != '0') {
                var datosbusqueda = {
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    where: condicionCajaChica,
                    include: [{ model: Sucursal, as: 'sucursal' }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona', where: condicionPersonaSolicitanter }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto', where: condicionConceptoClase }] }, { model: Clase, as: 'estado' }, { model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionPersonaUsuario }] }],    
                    //order: [['nombre', 'asc']]
                }
            } else {
                var datosbusqueda = {
                    where: condicionCajaChica,
                    include: [{ model: Sucursal, as: 'sucursal' }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona', where: condicionPersonaSolicitanter }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto', where: condicionConceptoClase }] }, { model: Clase, as: 'estado' }, { model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionPersonaUsuario }] }],    
                }
            }
            SolicitudCajaChica.findAndCountAll({
                where: condicionCajaChica,
                include: [{ model: Sucursal, as: 'sucursal' }, { model: CajaChica, as: 'cajasChicas', required: false, include: [{ model: Sucursal, as: 'sucursal' }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }] }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona', where: condicionPersonaSolicitanter }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto', where: condicionConceptoClase }] }, { model: Clase, as: 'estado' }, { model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionPersonaUsuario }] }],

            }).then(function (data) {
                SolicitudCajaChica.findAll({                   
                    where: condicionCajaChica,
                    include: [{ model: Sucursal, as: 'sucursal' }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona', where: condicionPersonaSolicitanter }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto', where: condicionConceptoClase }] }, { model: Clase, as: 'estado' }, { model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionPersonaUsuario }] }],    
                    offset: (req.params.items_pagina * (req.params.pagina - 1)),
                    limit: req.params.items_pagina
                }).then(function (solicitudes) {
                    sequelize.query("SELECT SUM(c.monto) as total from agil_caja_chica as c inner JOIN agil_concepto_movimiento_caja_chica as m on c.concepto=m.id INNER JOIN gl_clase as g on m.movimiento=g.id\
                    where g.nombre='INGRESO'and c.cerrada = false and c.padre is null and m.empresa ="+ req.params.id_empresa, { type: sequelize.QueryTypes.SELECT })
                        .then(function (ingreso) {
                            sequelize.query("SELECT SUM(c.monto) as total from agil_caja_chica as c inner JOIN agil_concepto_movimiento_caja_chica as m on c.concepto=m.id INNER JOIN gl_clase as g on m.movimiento=g.id\
                    where g.nombre='INGRESO'and c.cerrada = true and c.padre is null and m.empresa ="+ req.params.id_empresa, { type: sequelize.QueryTypes.SELECT })
                                .then(function (ingresoCerrados) {
                                    sequelize.query("SELECT SUM(c.monto) as total from agil_caja_chica as c inner JOIN agil_concepto_movimiento_caja_chica as m on c.concepto=m.id INNER JOIN gl_clase as g on m.movimiento=g.id\
                        where g.nombre='GASTO' and c.cerrada = false and c.padre is null and m.empresa ="+ req.params.id_empresa, { type: sequelize.QueryTypes.SELECT })
                                        .then(function (egreso) {
                                            sequelize.query("SELECT SUM(c.monto) as total from agil_caja_chica as c inner JOIN agil_concepto_movimiento_caja_chica as m on c.concepto=m.id INNER JOIN gl_clase as g on m.movimiento=g.id\
                        where g.nombre='GASTO' and c.cerrada = true and c.padre is null and m.empresa ="+ req.params.id_empresa, { type: sequelize.QueryTypes.SELECT })
                                                .then(function (egresosCerrados) {
                                                    var total = 0
                                                    var totalRlCaja = 0
                                                    if (ingreso[0].total != null) {
                                                        total = ingreso[0].total
                                                        // totalRlCaja = ingreso[0].total
                                                    }
                                                    if (egresosCerrados[0].total != null) {
                                                        total -= egresosCerrados[0].total
                                                        totalRlCaja -= egresosCerrados[0].total
                                                    }
                                                    if (egreso[0].total != null) {
                                                        total -= egreso[0].total
                                                    }
                                                    if (ingresoCerrados[0].total != null) {
                                                        total += ingresoCerrados[0].total
                                                        totalRlCaja += ingresoCerrados[0].total
                                                    }
                                                    res.json({ totalRlCaja: totalRlCaja, total: total, solicitudes: solicitudes, paginas: Math.ceil(data.count / req.params.items_pagina) });
                                                });
                                        });
                                });
                        });
                });
            });
        });
    //End paginador
    //paginator caja chica
    router.route('/caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/solicitante/:solicitante/usuario/:usuario/estado/:estado/concepto/:concepto/movimiento/:movimiento/usuario-no-autorizado/:id_usuario_no_autorizado/rendiciones/:rendiciones')
        .get(function (req, res) {
            var condicionCajaChica = { id_sucursal: req.params.id_sucursal };
            //  var condicionSolicitud={}
            var condicionPersonaUsuario = {};
            var condicionPersonaSolicitanter = {};
            var condicionTipo={}
            if (req.params.estado != 0) {
                condicionCajaChica.id_estado = req.params.estado
            }
            if(req.params.rendiciones !=0){
                condicionTipo.nombre_corto="DESEMBOLSADO"
            }
            if (req.params.concepto != 0) {
                condicionCajaChica.id_concepto = req.params.concepto
            }
            if (req.params.usuario != 0) {
                condicionPersonaUsuario.nombre_completo = {
                    $like: "%" + req.params.usuario + "%"
                }
            }
            if (req.params.solicitante != 0) {
                condicionPersonaSolicitanter.nombre_completo = {
                    $like: "%" + req.params.solicitante + "%"
                }
            }
            if (req.params.id_usuario_no_autorizado != 0) {
                condicionCajaChica.id_usuario = parseInt(req.params.id_usuario_no_autorizado)
            }

            if (req.params.texto_busqueda != 0) {
                condicionCajaChica = {
                    $or: [
                        {
                            detalle: {
                                $like: "%" + req.params.texto_busqueda + "%"
                            }
                        }
                    ]
                };
            }
            var condicionConceptoClase = {}
            if (req.params.movimiento != '0') {
                condicionConceptoClase.id = req.params.movimiento
            }
            var ordenArreglo = []
            var textOrder=""
            if (req.params.columna == 'usuario_solicitante') {
                textOrder="`usuario.persona.nombre_completo` "+req.params.direccion     
            } else  if (req.params.columna == 'concepto') {
                textOrder="`concepto.nombre` "+req.params.direccion      
            } else if (req.params.columna == 'beneficiario') {
                textOrder="`solicitante.persona.nombre_completo` "+req.params.direccion     
            } else if (req.params.columna == 'autorizador') {
                textOrder="`autorizador.persona.nombre_completo` "+req.params.direccion     
            } else if (req.params.columna == 'verificador') {
                textOrder="`verificador.persona.nombre_completo` "+req.params.direccion     
            } else if (req.params.columna == 'movimiento') {
                textOrder="`concepto.concepto.nombre` "+req.params.direccion     
            } else if (req.params.columna == 'estado') {
                textOrder="`estado.nombre` "+req.params.direccion     
            } else{
                textOrder=req.params.columna+" "+req.params.direccion                
            }


            if (req.params.items_pagina != '0') {
                /* var datosbusqueda = {
                    //offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    where: condicionCajaChica,
                    include: [{ model: Sucursal, as: 'sucursal' }, {
                        model: Usuario, as: 'autorizador',
                        include: [{ model: Persona, as: 'persona' }]
                    },
                    {
                        model: Usuario, as: 'verificador',
                        include: [{ model: Persona, as: 'persona' }]
                    },  { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona', where: condicionPersonaSolicitanter }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto', where: condicionConceptoClase }] }, { model: Clase, as: 'estado',where:condicionTipo }, { model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionPersonaUsuario }] }],
                    order: sequelize.literal(textOrder)
                } */
                var datosbusqueda = {
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    where: condicionCajaChica,
                    include: [{
                        model: Usuario, as: 'autorizador',
                        include: [{ model: Persona, as: 'persona' }]
                    },
                    {
                        model: Usuario, as: 'verificador',
                        include: [{ model: Persona, as: 'persona' }]
                    },{ model: Sucursal, as: 'sucursal' }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona', where: condicionPersonaSolicitanter }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto', where: condicionConceptoClase }] }, { model: Clase, as: 'estado' }, { model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionPersonaUsuario }] }],    
                    order: sequelize.literal(textOrder)
                }
            } else {
                var datosbusqueda = {
                    where: condicionCajaChica,
                    include: [{
                        model: Usuario, as: 'autorizador',
                        include: [{ model: Persona, as: 'persona' }]
                    },
                    {
                        model: Usuario, as: 'verificador',
                        include: [{ model: Persona, as: 'persona' }]
                    },{ model: Sucursal, as: 'sucursal' }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona', where: condicionPersonaSolicitanter }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto', where: condicionConceptoClase }] }, { model: Clase, as: 'estado' }, { model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionPersonaUsuario }] }],    
                    order: sequelize.literal(textOrder)
                }
            }
            SolicitudCajaChica.findAndCountAll({
                where: condicionCajaChica,
                include: [{
                    model: Usuario, as: 'autorizador',
                    include: [{ model: Persona, as: 'persona' }]
                },
                {
                    model: Usuario, as: 'verificador',
                    include: [{ model: Persona, as: 'persona' }]
                },{ model: Sucursal, as: 'sucursal' }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona', where: condicionPersonaSolicitanter }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto', where: condicionConceptoClase }] }, { model: Clase, as: 'estado' }, { model: Usuario, as: 'usuario', where: { id_empresa: req.params.id_empresa }, include: [{ model: Persona, as: 'persona', where: condicionPersonaUsuario }] }],                   

            }).then(function (data) {
                SolicitudCajaChica.findAll(
                    datosbusqueda
                ).then(function (solicitudes) {
                    sequelize.query("SELECT SUM(c.monto) as total from agil_caja_chica as c inner JOIN agil_concepto_movimiento_caja_chica as m on c.concepto=m.id INNER JOIN gl_clase as g on m.movimiento=g.id\
                where g.nombre='INGRESO'and c.cerrada = false and c.padre is null and m.empresa ="+ req.params.id_empresa + " and c.sucursal=" + req.params.id_sucursal, { type: sequelize.QueryTypes.SELECT })
                        .then(function (ingreso) {
                            sequelize.query("SELECT SUM(c.monto) as total from agil_caja_chica as c inner JOIN agil_concepto_movimiento_caja_chica as m on c.concepto=m.id INNER JOIN gl_clase as g on m.movimiento=g.id\
                where g.nombre='INGRESO'and c.cerrada = true and c.padre is null and m.empresa ="+ req.params.id_empresa + " and c.sucursal=" + req.params.id_sucursal, { type: sequelize.QueryTypes.SELECT })
                                .then(function (ingresoCerrados) {
                                    sequelize.query("SELECT SUM(c.monto) as total from agil_caja_chica as c inner JOIN agil_concepto_movimiento_caja_chica as m on c.concepto=m.id INNER JOIN gl_clase as g on m.movimiento=g.id\
                    where g.nombre='GASTO' and c.cerrada = false and c.padre is null and m.empresa ="+ req.params.id_empresa + " and c.sucursal=" + req.params.id_sucursal +
                                        " or g.nombre='KARDEX' and c.cerrada = false and c.padre is null and m.empresa =" + req.params.id_empresa + " and c.sucursal=" + req.params.id_sucursal + "\
                                        or g.nombre='ANTICIPO' and c.cerrada = false and c.padre is null and m.empresa =" + req.params.id_empresa + " and c.sucursal=" + req.params.id_sucursal, { type: sequelize.QueryTypes.SELECT })
                                        .then(function (egreso) {
                                            sequelize.query("SELECT SUM(c.monto) as total from agil_caja_chica as c inner JOIN agil_concepto_movimiento_caja_chica as m on c.concepto=m.id INNER JOIN gl_clase as g on m.movimiento=g.id\
                    where g.nombre='GASTO' and c.cerrada = true and c.padre is null and m.empresa ="+ req.params.id_empresa + " and c.sucursal=" + req.params.id_sucursal +
                                                " or g.nombre='KARDEX' and c.cerrada = true and c.padre is null and m.empresa =" + req.params.id_empresa + " and c.sucursal=" + req.params.id_sucursal + "\
                                                or g.nombre='ANTICIPO' and c.cerrada = true and c.padre is null and m.empresa =" + req.params.id_empresa + " and c.sucursal=" + req.params.id_sucursal, { type: sequelize.QueryTypes.SELECT })
                                                .then(function (egresosCerrados) {
                                                    var total = 0
                                                    var totalRlCaja = 0
                                                    if (ingreso[0].total != null) {
                                                        total = ingreso[0].total
                                                        // totalRlCaja = ingreso[0].total
                                                    }
                                                    if (egresosCerrados[0].total != null) {
                                                        total -= egresosCerrados[0].total
                                                        totalRlCaja -= egresosCerrados[0].total
                                                    }
                                                    if (egreso[0].total != null) {
                                                        total -= egreso[0].total
                                                    }
                                                    if (ingresoCerrados[0].total != null) {
                                                        total += ingresoCerrados[0].total
                                                        totalRlCaja += ingresoCerrados[0].total
                                                    }
                                                    if (req.params.columna = "usuario_solicitante") {
                                                        solicitudes = solicitudes.sort(function (a, b) {
                                                            if (req.params.direccion) {
                                                                return a.usuario.persona.nombre_completo < b.usuario.persona.nombre_completo;
                                                            } else {
                                                                return a.usuario.persona.nombre_completo > b.usuario.persona.nombre_completo;
                                                            }

                                                        });
                                                        res.json({ totalRlCaja: totalRlCaja, total: total, solicitudes: solicitudes, paginas: Math.ceil(data.count / req.params.items_pagina) });
                                                    } else if (req.params.columna = "id") {
                                                        res.json({ totalRlCaja: totalRlCaja, total: total, solicitudes: solicitudes, paginas: Math.ceil(data.count / req.params.items_pagina) });
                                                    }

                                                });
                                        });
                                });
                        });
                });
            });
        });
    //fin paginator
    router.route('/cobros-caja-chica/solicitud/:id_solicitud')
    .get(function (req, res) {
        SolicitudCajaChica.find(
            {where:{id:req.params.id_solicitud},
            include: [{ model: Sucursal, as: 'sucursal' },
                {
                    model: CajaChica, as: 'cajasChicas', required: false, include: [{ model: Sucursal, as: 'sucursal' }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, {
                        model: Compra, as: 'compra', include: [{ model: Clase, as: 'tipoMovimiento', required: false }, {
                            model: DetalleCompra, as: 'detallesCompra',
                            include: [{ model: Clase, as: 'servicio' },
                            { model: Producto, as: 'producto' },
                            { model: Clase, as: 'centroCosto' }]
                        },
                        { model: Proveedor, as: 'proveedor' },
                        { model: Sucursal, as: 'sucursal' },
                        {
                            model: Movimiento, as: 'movimiento', required: false,
                            include: [{ model: Clase, as: 'clase' }]
                        }]
                    }]
                },
                {
                    model: Usuario, as: 'autorizador',
                    include: [{ model: Persona, as: 'persona' }]
                },
                {
                    model: Usuario, as: 'verificador',
                    include: [{ model: Persona, as: 'persona' }]
                },
                {
                    model: MedicoPaciente, as: 'solicitante',
                    include: [{ model: Persona, as: 'persona'}]
                },
                { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto'}] }, { model: Clase, as: 'estado'},
                {
                    model: Usuario, as: 'usuario',
                    include: [{ model: Persona, as: 'persona'}]
                }],

            }
        ).then(function (solicitud) {
            res.json({solicitud:solicitud})
        })
    })
    function crearCompraServicio(compra, req, idProveedor, idtipo, t) {
        if (!compra.id) {
            return Compra.create({
                id_sucursal: compra.sucursal.id,
                id_tipo_movimiento: idtipo,
                id_proveedor: idProveedor,
                factura: compra.factura,
                autorizacion: compra.autorizacion,
                fecha: compra.fecha,
                codigo_control: compra.codigo_control,
                importe: compra.importe,
                id_tipo_pago: compra.id_tipo_pago,
                dias_credito: compra.dias_credito,
                a_cuenta: compra.a_cuenta,
                saldo: compra.saldo,
                descuento_general: compra.descuento_general,
                descuento: compra.descuento,
                recargo: compra.recargo,
                ice: compra.ice,
                excento: compra.excento,
                tipo_descuento: compra.tipo_descuento,
                tipo_recargo: compra.tipo_recargo,
                total: compra.total,
                id_usuario: compra.id_usuario,
                usar_producto: compra.usar_producto,
                observacion: compra.observacion,
                dui: compra.dui,
                tipo_retencion: compra.tipo_retencion
            }, {
                    transaction: t
                }).then(function (compraCreada) {
                    if (req.body.solicitud.cajasChicas.length > 0) {
                        padre = req.body.solicitud.cajasChicas[0].id
                        pagado = compra.total
                        monto = req.body.solicitud.cajasChicas[0].monto
                        saldo = req.body.solicitud.cajasChicas[0].saldo - pagado
                    } else {
                        padre = null
                        monto = compra.total
                        saldo = compra.total
                    }
                    if (req.body.solicitud.concepto.concepto.nombre == "GASTO") {
                        padre = null
                        monto = compra.total
                        pagado = compra.total
                        saldo = 0
                    }
                    return Sucursal.find({
                        where: {
                            id: compra.sucursal.id,//your where conditions, or without them if you need ANY entry
                        }, transaction: t
                    }).then(function (SucursalEncontrada) {
                        return CajaChica.create({
                            id_solicitud: req.body.solicitud.id,
                            fecha: req.body.fecha,
                            id_cuenta: req.body.cuenta.id,
                            id_compra: compraCreada.id,
                            eliminado: false,
                            detalle: req.body.detalle,
                            monto: monto,
                            pagado: pagado,
                            saldo: saldo,
                            id_padre: padre,
                            id_concepto: req.body.concepto.id,
                            cerrada: false,
                            id_sucursal: compra.sucursal.id,
                            numero_correlativo: SucursalEncontrada.caja_chica_egreso_correlativo
                        }, {
                                transaction: t
                            }).then(function (CajaCreada) {
                                req.body.CajaCreadaid = CajaCreada.id
                                return Sucursal.update({
                                    caja_chica_egreso_correlativo: SucursalEncontrada.caja_chica_egreso_correlativo + 1
                                }, {
                                        where: {
                                            id: compra.sucursal.id,
                                        }

                                        , transaction: t
                                    }).then(function (actualizado) {
                                        if (padre) {
                                            return CajaChica.update({
                                                pagado: req.body.solicitud.cajasChicas[0].pagado + pagado,
                                                saldo: req.body.solicitud.cajasChicas[0].saldo - pagado,
                                            }, {
                                                    where: { id: padre }, transaction: t
                                                }).then(function (dato) {
                                                    return SolicitudCajaChica.update({
                                                        id_estado: req.body.solicitud.estado.id,
                                                    }, {
                                                            where: { id: req.body.solicitud.id }, transaction: t
                                                        }).then(function (SolicitudActualizada) {
                                                            return crearDetalleCompraServicio(compra, compraCreada.id, req, t);
                                                        }).catch(function (err) {
                                                            return new Promise(function (fulfill, reject) {
                                                                reject((err.stack !== undefined) ? err.stack : err);
                                                            });
                                                        });
                                                }).catch(function (err) {
                                                    return new Promise(function (fulfill, reject) {
                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                    });
                                                })
                                        } else {
                                            return SolicitudCajaChica.update({
                                                id_estado: req.body.solicitud.estado.id,
                                            }, {
                                                    where: { id: req.body.solicitud.id }, transaction: t
                                                }).then(function (SolicitudActualizada) {
                                                    return crearDetalleCompraServicio(compra, compraCreada.id, req, t);
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
                                    });
                            }).catch(function (err) {
                                return new Promise(function (fulfill, reject) {
                                    reject((err.stack !== undefined) ? err.stack : err);
                                });
                            });
                    }).catch(function (err) {
                        return new Promise(function (fulfill, reject) {
                            reject((err.stack !== undefined) ? err.stack : err);
                        });
                    });
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                });
        } else {
            return Compra.update({
                id_sucursal: compra.sucursal.id,
                id_tipo_movimiento: compra.movimiento.clase.id,
                id_proveedor: idProveedor,
                factura: compra.factura,
                autorizacion: compra.autorizacion,
                fecha: compra.fecha,
                codigo_control: compra.codigo_control,
                importe: compra.importe,
                id_tipo_pago: compra.id_tipo_pago,
                dias_credito: compra.dias_credito,
                a_cuenta: compra.a_cuenta,
                saldo: compra.saldo,
                descuento_general: compra.descuento_general,
                descuento: compra.descuento,
                recargo: compra.recargo,
                ice: compra.ice,
                excento: compra.excento,
                tipo_descuento: compra.tipo_descuento,
                tipo_recargo: compra.tipo_recargo,
                total: compra.total,
                id_usuario: compra.id_usuario,
                usar_producto: compra.usar_producto,
                observacion: compra.observacion,
                dui: compra.dui,
                tipo_retencion: compra.tipo_retencion,
            }, {
                    where: {
                        id: compra.id
                    }, transaction: t
                }).then(function (compraActualizada) {
                    return ActualizarDetalleCompra(req, compra, t)


                });
        }
    }

    function crearDetalleCompraServicio(compra, idCompra, req, t) {
        var promises = []
        compra.detallesCompra.forEach(function (detalleCompra, index, array) {
            promises.push(DetalleCompra.create({
                id_compra: idCompra,
                costo_unitario: detalleCompra.costo_unitario,
                cantidad: detalleCompra.cantidad,
                importe: detalleCompra.importe,
                descuento: detalleCompra.descuento,
                recargo: detalleCompra.recargo,
                ice: detalleCompra.ice,
                excento: detalleCompra.excento,
                tipo_descuento: detalleCompra.tipo_descuento,
                tipo_recargo: detalleCompra.tipo_recargo,
                total: detalleCompra.total,
                it: detalleCompra.it,
                iue: detalleCompra.iue,
                id_servicio: detalleCompra.servicio.id
            }, {
                    transaction: t
                }).then(function (detalleCompraCreada) {

                    return new Promise(function (fulfill, reject) {
                        fulfill()
                    });

                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                }));
        })
        return Promise.all(promises);
    }

    router.route('/caja-chica/:id_empresa')
        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promises = [];
                var a = 0
                if (req.body.solicitud) {
                    if (req.body.Desembolso) {
                        if (!req.body.id) {
                            return Sucursal.find({
                                where: {
                                    id: req.body.sucursal.id,//your where conditions, or without them if you need ANY entry
                                },
                                transaction: t
                            }).then(function (SucursalEncontrada) {
                                return CajaChica.create({
                                    fecha: req.body.fecha,
                                    id_sucursal: req.body.sucursal.id,
                                    id_cuenta: req.body.cuenta.id,
                                    eliminado: false,
                                    monto: req.body.total,
                                    saldo: req.body.total,
                                    pagado: 0,
                                    detalle: req.body.detalle,
                                    id_concepto: req.body.concepto.id,
                                    cerrada: false,
                                    id_solicitud: req.body.solicitud.id,
                                    numero_correlativo: SucursalEncontrada.caja_chica_egreso_correlativo
                                }, {
                                        transaction: t
                                    }).then(function (CajaCreada) {
                                        req.body.CajaCreadaid = CajaCreada.id
                                        return Sucursal.update({
                                            caja_chica_egreso_correlativo: SucursalEncontrada.caja_chica_egreso_correlativo + 1
                                        }, {
                                                where: {
                                                    id: req.body.sucursal.id,
                                                }

                                                , transaction: t
                                            }).then(function (actualizado) {
                                                return SolicitudCajaChica.update({
                                                    id_estado: req.body.solicitud.estado.id,
                                                }, {
                                                        where: { id: req.body.solicitud.id }, transaction: t
                                                    }).then(function (SolicitudCreada) {
                                                        return CajaChica.find({
                                                            where: { id: CajaCreada.id }, transaction: t,
                                                            include: [{ model: Sucursal, as: 'sucursal' }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }]
                                                        }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona' }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: Clase, as: 'estado' }, {
                                                                model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }]

                                                            }).then(function (data) {
                                                                return new Promise(function (fulfill, reject) {
                                                                    fulfill(data)
                                                                });
                                                            }).catch(function (err) {
                                                                return new Promise(function (fulfill, reject) {
                                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                                });
                                                            });
                                                    }).catch(function (err) {
                                                        return new Promise(function (fulfill, reject) {
                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                        });
                                                    });
                                            }).catch(function (err) {
                                                return new Promise(function (fulfill, reject) {
                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                });
                                            });
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                            });
                        } else {
                            return CajaChica.update({
                                fecha: req.body.fecha,
                                id_sucursal: req.body.sucursal.id,
                                id_cuenta: req.body.cuenta.id,
                                eliminado: req.body.eliminado,
                                monto: req.body.total,
                                saldo: req.body.total,
                                pagado: 0,
                                detalle: req.body.detalle,
                                id_concepto: req.body.concepto.id,
                                cerrada: req.body.cerrada,
                            }, {
                                    where: { id: req.body.id },
                                    transaction: t
                                }).then(function (CajaActualizada) {
                                    return CajaChica.find({
                                        where: { id: req.body.id }, transaction: t,
                                        include: [{ model: Sucursal, as: 'sucursal' }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }]
                                    }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona' }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: Clase, as: 'estado' }, {
                                            model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }]

                                        }).then(function (data) {
                                            return new Promise(function (fulfill, reject) {
                                                fulfill(data)
                                            });
                                        }).catch(function (err) {
                                            return new Promise(function (fulfill, reject) {
                                                reject((err.stack !== undefined) ? err.stack : err);
                                            });
                                        });
                                }).catch(function (err) {
                                    return new Promise(function (fulfill, reject) {
                                        reject((err.stack !== undefined) ? err.stack : err);
                                    });
                                });
                        }
                    } else {
                        var compra = req.body.compra;
                        if (!compra.id) {
                            if (compra.usar_producto) {
                                return Tipo.find({
                                    where: { nombre_corto: 'MOVING' }, transaction: t
                                }).then(function (tipoMovimiento) {
                                    return Clase.find({
                                        where: { nombre_corto: 'ID' }, transaction: t
                                    }).then(function (conceptoMovimiento) {
                                        if (compra.movimiento.clase.id) {
                                            conceptoMovimiento = compra.movimiento.clase
                                        }
                                        return Movimiento.create({
                                            id_tipo: tipoMovimiento.id,
                                            id_clase: conceptoMovimiento.id,
                                            fecha: compra.fecha
                                        }, {
                                                transaction: t
                                            }).then(function (movimientoCreado) {
                                                if (!compra.proveedor.id) {
                                                    return Proveedor.create({
                                                        id_empresa: req.params.id_empresa,
                                                        nit: compra.proveedor.nit,
                                                        razon_social: compra.proveedor.razon_social
                                                    }, {
                                                            transaction: t
                                                        }).then(function (proveedorCreado) {
                                                            return crearCompra(compra, res, proveedorCreado.id, movimientoCreado.id, conceptoMovimiento.id, req, t);

                                                        }).catch(function (err) {
                                                            return new Promise(function (fulfill, reject) {
                                                                reject((err.stack !== undefined) ? err.stack : err);
                                                            });
                                                        });;
                                                } else {
                                                    return crearCompra(compra, res, compra.proveedor.id, movimientoCreado.id, conceptoMovimiento.id, req, t);

                                                }
                                            }).catch(function (err) {
                                                return new Promise(function (fulfill, reject) {
                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                });
                                            });
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                                }).catch(function (err) {
                                    return new Promise(function (fulfill, reject) {
                                        reject((err.stack !== undefined) ? err.stack : err);
                                    });
                                });
                            } else {
                                return Tipo.find({
                                    where: { nombre_corto: 'MOVING' }, transaction: t
                                }).then(function (tipoMovimiento) {
                                    return Clase.find({
                                        where: { nombre_corto: 'ID' }, transaction: t
                                    }).then(function (conceptoMovimiento) {
                                        if (compra.movimiento.clase) {
                                            conceptoMovimiento = compra.movimiento.clase
                                        }
                                        if (compra.movimiento.clase.id) {
                                            conceptoMovimiento = compra.movimiento.clase
                                        }
                                        /*   return Movimiento.create({
                                              id_tipo: tipoMovimiento.id,
                                              id_clase: conceptoMovimiento.id,
                                              fecha: compra.fecha
                                          }, {
                                                  transaction: t
                                              }).then(function (movimientoCreado) { */
                                        if (!compra.proveedor.id) {
                                            return Proveedor.create({
                                                id_empresa: compra.id_empresa,
                                                nit: compra.proveedor.nit,
                                                razon_social: compra.proveedor.razon_social
                                            }, {
                                                    transaction: t
                                                }).then(function (proveedorCreado) {
                                                    return crearCompraServicio(compra, req, proveedorCreado.id, conceptoMovimiento.id, t)
                                                }).catch(function (err) {
                                                    return new Promise(function (fulfill, reject) {
                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                    });
                                                });
                                        } else {
                                            return crearCompraServicio(compra, req, compra.proveedor.id, conceptoMovimiento.id, t)
                                        }
                                        /* }).catch(function (err) {
                                            return new Promise(function (fulfill, reject) {
                                                reject((err.stack !== undefined) ? err.stack : err);
                                            });
                                        }); */
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                                }).catch(function (err) {
                                    return new Promise(function (fulfill, reject) {
                                        reject((err.stack !== undefined) ? err.stack : err);
                                    });
                                });
                            }
                        } else {
                            if (compra.usar_producto) {
                                return Tipo.find({
                                    where: { nombre_corto: 'MOVING' }, transaction: t
                                }).then(function (tipoMovimiento) {
                                    return Clase.find({
                                        where: { nombre_corto: 'ID' }, transaction: t
                                    }).then(function (conceptoMovimiento) {
                                        if (compra.movimiento.clase.id) {
                                            conceptoMovimiento = compra.movimiento.clase
                                        }
                                        return Movimiento.update({
                                            id_tipo: tipoMovimiento.id,
                                            id_clase: conceptoMovimiento.id,
                                            fecha: compra.fecha
                                        }, {
                                                where: { id: compra.movimiento.id },
                                                transaction: t
                                            }).then(function (movimientoActualizado) {
                                                if (!compra.proveedor.id) {
                                                    return Proveedor.create({
                                                        id_empresa: req.params.id_empresa,
                                                        nit: compra.proveedor.nit,
                                                        razon_social: compra.proveedor.razon_social
                                                    }, {
                                                            transaction: t
                                                        }).then(function (proveedorCreado) {
                                                            return crearCompra(compra, res, proveedorCreado.id, compra.movimiento.id, conceptoMovimiento.id, req, t);

                                                        });
                                                } else {
                                                    return crearCompra(compra, res, compra.proveedor.id, compra.movimiento.id, conceptoMovimiento.id, req, t);

                                                }
                                            }).catch(function (err) {
                                                return new Promise(function (fulfill, reject) {
                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                });
                                            });
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                                }).catch(function (err) {
                                    return new Promise(function (fulfill, reject) {
                                        reject((err.stack !== undefined) ? err.stack : err);
                                    });
                                });
                            } else {
                                return Tipo.find({
                                    where: { nombre_corto: 'MOVING' }, transaction: t
                                }).then(function (tipoMovimiento) {
                                    return Clase.find({
                                        where: { nombre_corto: 'ID' }, transaction: t
                                    }).then(function (conceptoMovimiento) {
                                        if (compra.movimiento.clase) {
                                            conceptoMovimiento = compra.movimiento.clase
                                        }
                                        /* return Movimiento.update({
                                            id_tipo: tipoMovimiento.id,
                                            id_clase: conceptoMovimiento.id,
                                            fecha: compra.fecha
                                        }, {
                                                where: { id: compra.movimiento.id },
                                                transaction: t
                                            }).then(function (movimientoActualizado) { */
                                        if (!compra.proveedor.id) {

                                            return Proveedor.create({
                                                id_empresa: compra.id_empresa,
                                                nit: compra.proveedor.nit,
                                                razon_social: compra.proveedor.razon_social
                                            }, {
                                                    transaction: t
                                                }).then(function (proveedorCreado) {
                                                    return crearCompraServicio(compra, req, proveedorCreado.id, conceptoMovimiento.id, t)
                                                }).catch(function (err) {
                                                    return new Promise(function (fulfill, reject) {
                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                    })
                                                });
                                        } else {
                                            return crearCompraServicio(compra, req, compra.proveedor.id, conceptoMovimiento.id, t)
                                        }
                                        /*   }).catch(function (err) {
                                              return new Promise(function (fulfill, reject) {
                                                  reject((err.stack !== undefined) ? err.stack : err);
                                              })
                                          }) */
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        })
                                    })
                                }).catch(function (err) {
                                    return new Promise(function (fulfill, reject) {
                                        reject((err.stack !== undefined) ? err.stack : err);
                                    })
                                })
                            }
                        }
                    }
                } else {
                    if (!req.body.id) {
                        return Sucursal.find({
                            where: {
                                id: req.body.sucursal.id,//your where conditions, or without them if you need ANY entry
                            },
                            transaction: t
                        }).then(function (SucursalEncontrada) {
                            return CajaChica.create({
                                fecha: req.body.fecha,
                                id_sucursal: req.body.sucursal.id,
                                id_cuenta: req.body.cuenta.id,
                                eliminado: false,
                                monto: req.body.total,
                                saldo: 0,
                                pagado: req.body.total,
                                detalle: req.body.detalle,
                                id_concepto: req.body.concepto.id,
                                cerrada: false,
                                numero_correlativo: SucursalEncontrada.caja_chica_ingreso_correlativo
                            }, {
                                    transaction: t
                                }).then(function (CajaCreada) {
                                    req.body.CajaCreadaid = CajaCreada.id
                                    return Sucursal.update({
                                        caja_chica_ingreso_correlativo: SucursalEncontrada.caja_chica_ingreso_correlativo + 1
                                    }, {
                                            where: {
                                                id: req.body.sucursal.id,
                                            }

                                            , transaction: t
                                        }).then(function (actualizado) {
                                            return CajaChica.find({
                                                where: { id: CajaCreada.id }, transaction: t,
                                                include: [{ model: Sucursal, as: 'sucursal' }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }]
                                            }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona' }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: Clase, as: 'estado' }, {
                                                    model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }]

                                                }).then(function (data) {
                                                    return new Promise(function (fulfill, reject) {
                                                        fulfill(data)
                                                    });
                                                }).catch(function (err) {
                                                    return new Promise(function (fulfill, reject) {
                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                    });
                                                });
                                        }).catch(function (err) {
                                            return new Promise(function (fulfill, reject) {
                                                reject((err.stack !== undefined) ? err.stack : err);
                                            });
                                        });
                                }).catch(function (err) {
                                    return new Promise(function (fulfill, reject) {
                                        reject((err.stack !== undefined) ? err.stack : err);
                                    });
                                });
                        });
                    } else {
                        return CajaChica.update({
                            fecha: req.body.fecha,
                            id_sucursal: req.body.sucursal.id,
                            id_cuenta: req.body.cuenta.id,
                            eliminado: req.body.eliminado,
                            monto: req.body.total,
                            saldo: 0,
                            pagado: req.body.total,
                            detalle: req.body.detalle,
                            id_concepto: req.body.concepto.id,
                            cerrada: req.body.cerrada,
                        }, {
                                where: { id: req.body.id },
                                transaction: t
                            }).then(function (CajaActualizada) {
                                return CajaChica.find({
                                    where: { id: req.body.id }, transaction: t,
                                    include: [{ model: Sucursal, as: 'sucursal' }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }]
                                }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona' }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: Clase, as: 'estado' }, {
                                        model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }]

                                    }).then(function (data) {
                                        return new Promise(function (fulfill, reject) {
                                            fulfill(data)
                                        });
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                            }).catch(function (err) {
                                return new Promise(function (fulfill, reject) {
                                    reject((err.stack !== undefined) ? err.stack : err);
                                });
                            });
                    }
                }


            }).then(function (result) {
                CajaChica.find({
                    where: { id: req.body.CajaCreadaid },
                    include: [{ model: Sucursal, as: 'sucursal' }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: DetalleCompra, as: 'detallesCompra', include: [{ model: Producto, as: 'producto' }, { model: Clase, as: 'centroCosto' }] }, { model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }]
                }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona' }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: Clase, as: 'estado' }, {
                        model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }]

                    }).then(function (data) {
                        var mensaje = ""
                        if (req.body.id) {
                            mensaje = "Actualizado Satisfactoriamente"
                        } else {
                            mensaje = "Creado Satisfactoriamente"
                        }
                        res.json({ mensaje: mensaje, cajaChica: data });
                    })

            }).catch(function (err) {
                var error = (err.stack) ? err.stack : err
                res.json({ hasError: true, mensaje: error });
            });

        })
    function crearDetalleCompra(detalleCompra, idMovimiento, idCompra, idAlmacen, idProducto, idCentroCosto, res, compra, t) {
        return DetalleCompra.create({
            id_compra: idCompra,
            id_producto: idProducto,
            id_centro_costo: idCentroCosto,
            costo_unitario: detalleCompra.costo_unitario,
            cantidad: detalleCompra.cantidad,
            importe: detalleCompra.importe,
            descuento: detalleCompra.descuento,
            recargo: detalleCompra.recargo,
            ice: detalleCompra.ice,
            excento: detalleCompra.excento,
            tipo_descuento: detalleCompra.tipo_descuento,
            tipo_recargo: detalleCompra.tipo_recargo,
            total: detalleCompra.total,
            it: detalleCompra.it,
            iue: detalleCompra.iue
        }, {
                transaction: t
            }).then(function (detalleCompraCreada) {

                return new Promise(function (fulfill, reject) {
                    fulfill()
                });

            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            });
    }
    function crearDetalleCompraPonderado(detalleCompra, idMovimiento, idCompra, idAlmacen, idProducto, idCentroCosto, res, compra, t) {
        return DetalleCompra.create({
            id_compra: idCompra,
            id_producto: idProducto,
            id_centro_costo: idCentroCosto,
            costo_unitario: detalleCompra.costo_unitario,
            cantidad: detalleCompra.cantidad,
            importe: detalleCompra.importe,
            descuento: detalleCompra.descuento,
            recargo: detalleCompra.recargo,
            ice: detalleCompra.ice,
            excento: detalleCompra.excento,
            tipo_descuento: detalleCompra.tipo_descuento,
            tipo_recargo: detalleCompra.tipo_recargo,
            total: detalleCompra.total,
            it: detalleCompra.it,
            iue: detalleCompra.iue
        }, {
                transaction: t
            }).then(function (detalleCompraCreada) {
                return new Promise(function (fulfill, reject) {
                    fulfill(data)
                });
            }).catch(function (err) {
                return new Promise(function (fulfill, reject) {
                    reject((err.stack !== undefined) ? err.stack : err);
                });
            });
    }
    function ActualizarDetalleCompra(req, compra, t) {
        var promises = []
        compra.detallesCompra.forEach(function (detalleCompra, index, array) {
            if (detalleCompra.id) {
                if (!detalleCompra.eliminado) {
                    promises.push(DetalleCompra.update({
                        cantidad: detalleCompra.cantidad,
                        costo_unitario: detalleCompra.costo_unitario,
                        importe: detalleCompra.importe,
                        total: detalleCompra.total,
                    }, {
                            where: {
                                id: detalleCompra.id
                            }, transaction: t
                        }).then(function (detalleCompraActualizado) {
                            return new Promise(function (fulfill, reject) {
                                fulfill()
                            });
                        }).catch(function (err) {
                            return new Promise(function (fulfill, reject) {
                                reject((err.stack !== undefined) ? err.stack : err);
                            });
                        }))

                } else {

                    promises.push(DetalleCompra.destroy({
                        where: {
                            id: detalleCompra.id
                        }, transaction: t
                    }).then(function (detalleCompraEliminado) {
                        return new Promise(function (fulfill, reject) {
                            fulfill()
                        });
                    }).catch(function (err) {
                        return new Promise(function (fulfill, reject) {
                            reject((err.stack !== undefined) ? err.stack : err);
                        });
                    }))

                }
            } else {
                if (compra.usar_producto) {
                    if (!detalleCompra.producto.id) {
                        promises.push(Producto.create({
                            nombre: detalleCompra.producto.nombre,
                            codigo: detalleCompra.producto.codigo,
                            unidad_medida: detalleCompra.producto.unidad_medida,
                            id_empresa: compra.id_empresa
                        }, {
                                transaction: t
                            }).then(function (productoCreado) {
                                if (!detalleCompra.centroCosto.id) {
                                    return Tipo.find({
                                        where: { nombre_corto: 'CCO' }, transaction: t
                                    }).then(function (tipoCentroCosto) {
                                        return Clase.create({
                                            nombre: detalleCompra.centroCosto.nombre,
                                            id_tipo: tipoCentroCosto.id
                                        }, {
                                                transaction: t
                                            }).then(function (centroCostoCreado) {
                                                return crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, null, productoCreado.id, detalleCompra.centroCosto.id, res, compra)
                                            }).catch(function (err) {
                                                return new Promise(function (fulfill, reject) {
                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                });
                                            });
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                                } else {
                                    return crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, null, productoCreado.id, detalleCompra.centroCosto.id, res, compra)
                                }
                            }).catch(function (err) {
                                return new Promise(function (fulfill, reject) {
                                    reject((err.stack !== undefined) ? err.stack : err);
                                });
                            }));
                    } else {
                        if (!detalleCompra.centroCosto.id) {
                            promises.push(Tipo.find({
                                where: { nombre_corto: 'CCO' }
                            }).then(function (tipoCentroCosto) {
                                return Clase.create({
                                    nombre: detalleCompra.centroCosto.nombre,
                                    id_tipo: tipoCentroCosto.id
                                }, {
                                        transaction: t
                                    }).then(function (centroCostoCreado) {
                                        return crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, null, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra)
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                            }).catch(function (err) {
                                return new Promise(function (fulfill, reject) {
                                    reject((err.stack !== undefined) ? err.stack : err);
                                });
                            }));
                        } else {
                            return crearDetalleCompra(detalleCompra, compra.movimiento.id, compra.id, null, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra)
                        }

                    }
                } else {
                    crearDetalleCompraServicio(detalleCompra, compra.id, res);
                }
            }
        });
        return Promise.all(promises)
    }
    function crearDatosDetalle(compra, idMovimiento, res, t, empresaEncontrada, compraCreada) {
        var promises = []
        compra.detallesCompra.forEach(function (detalleCompra, index, array) {

            if (!detalleCompra.producto.id) {
                promises.push(Producto.create({
                    nombre: detalleCompra.producto.nombre,
                    codigo: detalleCompra.producto.codigo,
                    unidad_medida: detalleCompra.producto.unidad_medida,
                    id_empresa: compra.id_empresa
                }, {
                        transaction: t
                    }).then(function (productoCreado) {
                        if (!detalleCompra.centroCosto.id) {
                            return Tipo.find({
                                where: { nombre_corto: 'CCO' }, transaction: t
                            }).then(function (tipoCentroCosto) {
                                Clase.create({
                                    nombre: detalleCompra.centroCosto.nombre,
                                    id_tipo: tipoCentroCosto.id
                                }, {
                                        transaction: t
                                    }).then(function (centroCostoCreado) {
                                        if (empresaEncontrada.dataValues.usar_peps) {
                                            promises.push(crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, null, productoCreado.id, centroCostoCreado.id, res, compra, t));
                                        } else {
                                            promises.push(crearDetalleCompraPonderado(detalleCompra, idMovimiento, compraCreada.id, null, productoCreado.id, centroCostoCreado.id, res, compra, t));
                                        }

                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                            }).catch(function (err) {
                                return new Promise(function (fulfill, reject) {
                                    reject((err.stack !== undefined) ? err.stack : err);
                                });
                            });
                        } else {
                            if (empresaEncontrada.dataValues.usar_peps) {
                                promises.push(crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, null, productoCreado.id, detalleCompra.centroCosto.id, res, compra, t))
                            } else {
                                promises.push(crearDetalleCompraPonderado(detalleCompra, idMovimiento, compraCreada.id, null, productoCreado.id, detalleCompra.centroCosto.id, res, compra, t))
                            }
                        }
                    }).catch(function (err) {
                        return new Promise(function (fulfill, reject) {
                            reject((err.stack !== undefined) ? err.stack : err);
                        });
                    }));
            } else {
                if (!detalleCompra.centroCosto.id) {
                    promises.push(Tipo.find({
                        where: { nombre_corto: 'CCO' }, transaction: t
                    }).then(function (tipoCentroCosto) {
                        return Clase.create({
                            nombre: detalleCompra.centroCosto.nombre,
                            id_tipo: tipoCentroCosto.id
                        }, {
                                transaction: t
                            }).then(function (centroCostoCreado) {
                                if (empresaEncontrada.dataValues.usar_peps) {
                                    promises.push(crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, centroCostoCreado.id, res, compra, t));
                                } else {
                                    promises.push(crearDetalleCompraPonderado(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, centroCostoCreado.id, res, compra, t));
                                }
                            }).catch(function (err) {
                                return new Promise(function (fulfill, reject) {
                                    reject((err.stack !== undefined) ? err.stack : err);
                                });
                            });
                    }).catch(function (err) {
                        return new Promise(function (fulfill, reject) {
                            reject((err.stack !== undefined) ? err.stack : err);
                        });
                    }));
                } else {
                    if (empresaEncontrada.dataValues.usar_peps) {
                        promises.push(crearDetalleCompra(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra, t))
                    } else {
                        promises.push(crearDetalleCompraPonderado(detalleCompra, idMovimiento, compraCreada.id, compra.almacen.id, detalleCompra.producto.id, detalleCompra.centroCosto.id, res, compra, t))
                    }
                }
            }
        });
        return Promise.all(promises);
    }
    function crearCompra(compra, res, idProveedor, idMovimiento, idTipo, req, t) {
        var pagado = 0, saldo = 0, monto = 0, padre = null;
        var promises = []
        if (!compra.id) {
            return Compra.create({
                id_tipo_movimiento: idTipo,
                id_proveedor: idProveedor,
                id_movimiento: idMovimiento,
                factura: compra.factura,
                autorizacion: compra.autorizacion,
                fecha: compra.fecha,
                codigo_control: compra.codigo_control,
                importe: compra.importe,
                id_tipo_pago: compra.id_tipo_pago,
                descuento_general: compra.descuento_general,
                descuento: compra.descuento,
                recargo: compra.recargo,
                ice: compra.ice,
                excento: compra.excento,
                tipo_descuento: compra.tipo_descuento,
                tipo_recargo: compra.tipo_recargo,
                total: compra.total,
                id_usuario: compra.id_usuario,
                observacion: compra.observacion,
                dui: compra.dui,
                id_sucursal: compra.sucursal.id
            }, {
                    transaction: t
                }).then(function (compraCreada) {
                    if (req.body.solicitud.cajasChicas.length > 0) {
                        padre = req.body.solicitud.cajasChicas[0].id
                        pagado = compra.total
                        monto = req.body.solicitud.cajasChicas[0].monto
                        saldo = req.body.solicitud.cajasChicas[0].saldo - pagado
                    } else {
                        padre = null
                        monto = compra.total
                        saldo = compra.total
                    }
                    if (req.body.solicitud.concepto.concepto.nombre == "GASTO") {
                        padre = null
                        monto = compra.total
                        pagado = compra.total
                        saldo = 0
                    }
                    return Sucursal.find({
                        where: {
                            id: compra.sucursal.id,//your where conditions, or without them if you need ANY entry
                        }, transaction: t
                    }).then(function (SucursalEncontrada) {
                        return CajaChica.create({
                            id_solicitud: req.body.solicitud.id,
                            fecha: req.body.fecha,
                            id_cuenta: req.body.cuenta.id,
                            id_compra: compraCreada.id,
                            eliminado: false,
                            detalle: req.body.detalle,
                            monto: monto,
                            pagado: pagado,
                            saldo: saldo,
                            id_padre: padre,
                            id_concepto: req.body.concepto.id,
                            cerrada: false,
                            id_sucursal: compra.sucursal.id,
                            numero_correlativo: SucursalEncontrada.caja_chica_egreso_correlativo
                        }, {
                                transaction: t
                            }).then(function (CajaCreada) {
                                req.body.CajaCreadaid = CajaCreada.id
                                return Sucursal.update({
                                    caja_chica_egreso_correlativo: SucursalEncontrada.caja_chica_egreso_correlativo + 1
                                }, {
                                        where: {
                                            id: compra.sucursal.id,
                                        }

                                        , transaction: t
                                    }).then(function (actualizado) {
                                        if (padre) {
                                            return CajaChica.update({
                                                pagado: req.body.solicitud.cajasChicas[0].pagado + pagado,
                                                saldo: req.body.solicitud.cajasChicas[0].saldo - pagado,
                                            }, {
                                                    where: { id: padre }, transaction: t
                                                }).then(function (dato) {
                                                    return SolicitudCajaChica.update({
                                                        id_estado: req.body.solicitud.estado.id,
                                                    }, {
                                                            where: { id: req.body.solicitud.id }, transaction: t
                                                        }).then(function (SolicitudActualizada) {
                                                            return Empresa.find({
                                                                where: { id: compra.id_empresa }, transaction: t
                                                            }).then(function (empresaEncontrada) {


                                                                return crearDatosDetalle(compra, idMovimiento, res, t, empresaEncontrada, compraCreada)




                                                                //return Promise.all(promises);
                                                            }).catch(function (err) {
                                                                return new Promise(function (fulfill, reject) {
                                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                                });
                                                            })
                                                            /* return CajaChica.find({
                                                                where: { id: CajaCreada.id }, transaction: t,
                                                                include: [{ model: Sucursal, as: 'sucursal' }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: ContabilidadCuenta, as: 'cuenta' }, { model: Compra, as: 'compra', include: [{ model: Proveedor, as: 'proveedor' }, { model: Sucursal, as: 'sucursal' }, { model: Movimiento, as: 'movimiento', required: false, include: [{ model: Clase, as: 'clase' }] }] }]
                                                            }, { model: MedicoPaciente, as: 'solicitante', include: [{ model: Persona, as: 'persona' }] }, { model: ConceptoMovimientoCajaChica, as: 'concepto', include: [{ model: Clase, as: 'concepto' }] }, { model: Clase, as: 'estado' }, {
                                                                    model: Usuario, as: 'usuario', include: [{ model: Persona, as: 'persona' }]

                                                                }).then(function (data) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        fulfill(data)
                                                                    });
                                                                }).catch(function (err) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                                    });
                                                                }); */
                                                        }).catch(function (err) {
                                                            return new Promise(function (fulfill, reject) {
                                                                reject((err.stack !== undefined) ? err.stack : err);
                                                            });
                                                        });
                                                }).catch(function (err) {
                                                    return new Promise(function (fulfill, reject) {
                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                    });
                                                })
                                        } else {
                                            return SolicitudCajaChica.update({
                                                id_estado: req.body.solicitud.estado.id,
                                            }, {
                                                    where: { id: req.body.solicitud.id }, transaction: t
                                                }).then(function (SolicitudActualizada) {
                                                    return Empresa.find({
                                                        where: { id: compra.id_empresa }, transaction: t
                                                    }).then(function (empresaEncontrada) {


                                                        return crearDatosDetalle(compra, idMovimiento, res, t, empresaEncontrada, compraCreada)




                                                        // return Promise.all(promises);
                                                    }).catch(function (err) {
                                                        return new Promise(function (fulfill, reject) {
                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                        });
                                                    })
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
                                    });
                            }).catch(function (err) {
                                return new Promise(function (fulfill, reject) {
                                    reject((err.stack !== undefined) ? err.stack : err);
                                });
                            });
                    }).catch(function (err) {
                        return new Promise(function (fulfill, reject) {
                            reject((err.stack !== undefined) ? err.stack : err);
                        });
                    });
                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                });
        } else {
            return Compra.update({
                id_tipo_movimiento: idTipo,
                id_proveedor: idProveedor,
                id_movimiento: idMovimiento,
                factura: compra.factura,
                autorizacion: compra.autorizacion,
                fecha: compra.fecha,
                codigo_control: compra.codigo_control,
                importe: compra.importe,
                id_tipo_pago: compra.id_tipo_pago,
                descuento_general: compra.descuento_general,
                descuento: compra.descuento,
                recargo: compra.recargo,
                ice: compra.ice,
                excento: compra.excento,
                tipo_descuento: compra.tipo_descuento,
                tipo_recargo: compra.tipo_recargo,
                total: compra.total,
                id_usuario: compra.id_usuario,
                observacion: compra.observacion,
                dui: compra.dui,
                id_proveedor: idProveedor,
                id_sucursal: compra.sucursal.id
            }, {
                    where: { id: compra.id },
                    transaction: t
                }).then(function (compraCreada) {
                    if (req.body.solicitud.cajasChicas.length > 0) {
                        padre = req.body.solicitud.cajasChicas[0].id
                        pagado = compra.total
                        monto = req.body.solicitud.cajasChicas[0].monto
                        saldo = req.body.solicitud.cajasChicas[0].saldo - pagado
                    } else {
                        padre = null
                        monto = compra.total
                        saldo = compra.total
                    }
                    if (req.body.solicitud.concepto.concepto.nombre == "GASTO") {
                        padre = null
                        monto = compra.total
                        pagado = compra.total
                        saldo = 0
                    }
                    return CajaChica.update({
                        //id_solicitud: req.body.solicitud.id,
                        fecha: req.body.fecha,
                        id_cuenta: req.body.cuenta.id,
                        id_compra: compraCreada.id,
                        eliminado: false,
                        detalle: req.body.detalle,
                        monto: monto,
                        pagado: pagado,
                        saldo: saldo,
                        id_padre: padre,
                        id_concepto: req.body.concepto.id,
                        cerrada: false,
                        id_sucursal: compra.sucursal.id,
                        // numero_correlativo: SucursalEncontrada.caja_chica_egreso_correlativo
                    }, {
                            where: { id: req.body.id },
                            transaction: t
                        }).then(function (CajaCreada) {
                            req.body.CajaCreadaid = req.body.id
                            if (padre) {
                                return CajaChica.update({
                                    pagado: req.body.solicitud.cajasChicas[0].pagado + pagado,
                                    saldo: req.body.solicitud.cajasChicas[0].saldo - pagado,
                                }, {
                                        where: { id: padre }, transaction: t
                                    }).then(function (dato) {
                                        return SolicitudCajaChica.update({
                                            id_estado: req.body.solicitud.estado.id,
                                        }, {
                                                where: { id: req.body.solicitud.id }, transaction: t
                                            }).then(function (SolicitudCreada) {
                                                return Movimiento.update({
                                                    fecha: compra.fecha,
                                                }, {
                                                        where: {
                                                            id: compra.movimiento.id
                                                        }, transaction: t
                                                    }).then(function (movimientoActualizado) {
                                                        return ActualizarDetalleCompra(req, compra, t)
                                                    }).catch(function (err) {
                                                        return new Promise(function (fulfill, reject) {
                                                            reject((err.stack !== undefined) ? err.stack : err);
                                                        });
                                                    })
                                            }).catch(function (err) {
                                                return new Promise(function (fulfill, reject) {
                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                });
                                            });
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    })
                            } else {
                                return SolicitudCajaChica.update({
                                    id_estado: req.body.solicitud.estado.id,
                                }, {
                                        where: { id: req.body.solicitud.id }, transaction: t
                                    }).then(function (SolicitudCreada) {
                                        return Movimiento.update({
                                            fecha: compra.fecha,
                                        }, {
                                                where: {
                                                    id: compra.movimiento.id
                                                }, transaction: t
                                            }).then(function (movimientoActualizado) {
                                                return ActualizarDetalleCompra(req, compra, t)
                                            }).catch(function (err) {
                                                return new Promise(function (fulfill, reject) {
                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                });
                                            })
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    });
                            }
                        }).catch(function (err) {
                            return new Promise(function (fulfill, reject) {
                                console.log(err)
                                reject((err.stack !== undefined) ? err.stack : err);
                            });
                        });

                }).catch(function (err) {
                    return new Promise(function (fulfill, reject) {
                        reject((err.stack !== undefined) ? err.stack : err);
                    });
                });
        }
    }
}