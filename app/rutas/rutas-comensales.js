module.exports = function (router, sequelize, Persona, Cliente, AliasClienteEmpresa, ComensalesClienteEmpresa, GerenciasClienteEmpresa, horarioComidasClienteEmpresa, PrecioComidasClienteEmpresa, HistorialComidaClienteEmpresa, Usuario) {

    function crearAlias(alias, empresa, t) {
        if (alias.id) {
            if (alias.eliminado) {
                return AliasClienteEmpresa.destroy({
                    where: { id: alias.id },
                    transaction: t
                })
            } else {
                return AliasClienteEmpresa.update({
                    codigo: alias.codigo,
                    id_cliente: alias.empresaCliente.id,
                    nombre: alias.nombre,
                    id_empresa: empresa
                }, { where: { id: alias.id }, transaction: t })
            }
        } else {
            return AliasClienteEmpresa.create({
                codigo: alias.codigo,
                id_cliente: alias.empresaCliente.id,
                nombre: alias.nombre,
                id_empresa: empresa
            }, { transaction: t })
        }
    }
    function crearGerencia(gerencia, empresa, t) {
        if (gerencia.id) {
            if (gerencia.eliminado) {
                return GerenciasClienteEmpresa.destroy({
                    where: { id: gerencia.id }
                }, { transaction: t })
            } else {
                return GerenciasClienteEmpresa.update({
                    codigo: gerencia.codigo,
                    id_cliente: gerencia.empresaCliente.id,
                    nombre: gerencia.nombre,
                    id_empresa: empresa
                }, { where: { id: gerencia.id }, transaction: t })
            }
        } else {
            return GerenciasClienteEmpresa.create({
                codigo: gerencia.codigo,
                id_cliente: gerencia.empresaCliente.id,
                nombre: gerencia.nombre,
                id_empresa: empresa
            }, { transaction: t })
        }
    }
    function crearComensal(comensal, empresa, t) {
        if (comensal.id) {
            if (comensal.eliminado) {
                return ComensalesClienteEmpresa.destroy({
                    where: { id: comensal.id }
                }, { transaction: t })
            } else {
                return ComensalesClienteEmpresa.update({
                    codigo: comensal.codigo,
                    tarjeta: comensal.tarjeta,
                    id_cliente: comensal.empresaCliente.id,
                    nombre: comensal.nombre,
                    id_empresa: empresa,
                    id_gerencia: comensal.gerencia.id,
                    tipo: comensal.tipo
                }, { where: { id: comensal.id }, transaction: t })
            }
        } else {
            return ComensalesClienteEmpresa.create({
                codigo: comensal.codigo,
                tarjeta: comensal.tarjeta,
                id_cliente: comensal.empresaCliente.id,
                nombre: comensal.nombre,
                id_empresa: empresa,
                id_gerencia: comensal.gerencia.id,
                tipo: comensal.tipo
            }, { transaction: t })
        }
    }
    function crearComida(comida, empresa, t) {
        if (comida.id) {
            if (comida.eliminado) {
                return horarioComidasClienteEmpresa.destroy({
                    where: { id: comida.id }
                }, { transaction: t })
            } else {
                return horarioComidasClienteEmpresa.update({
                    codigo: comida.codigo,
                    id_cliente: comida.empresaCliente.id,
                    nombre: comida.nombre,
                    id_empresa: empresa,
                    inicio: comida.inicio,
                    final: comida.final
                }, { where: { id: comida.id }, transaction: t })
            }
        } else {
            return horarioComidasClienteEmpresa.create({
                codigo: comida.codigo,
                id_cliente: comida.empresaCliente.id,
                nombre: comida.nombre,
                id_empresa: empresa,
                inicio: comida.inicio,
                final: comida.final
            }, { transaction: t })
        }
    }
    function crearPrecioComida(precioComida, empresa, t) {
        if (precioComida.id) {
            if (precioComida.eliminado) {
                return PrecioComidasClienteEmpresa.destroy({
                    where: { id: precioComida.id }
                }, { transaction: t })
            } else {
                return PrecioComidasClienteEmpresa.update({
                    codigo: precioComida.codigo,
                    id_cliente: precioComida.empresaCliente.id,
                    nombre: precioComida.nombre,
                    id_empresa: empresa,
                    inicio: precioComida.inicio,
                    final: precioComida.final
                }, { where: { id: precioComida.id }, transaction: t })
            }
        } else {
            return PrecioComidasClienteEmpresa.create({
                codigo: precioComida.codigo,
                id_cliente: precioComida.empresaCliente.id,
                nombre: precioComida.nombre,
                id_empresa: empresa,
                inicio: precioComida.inicio,
                final: precioComida.final
            }, { transaction: t })
        }
    }
    function crearHistorial(historial, empresa, t) {
        if (historial.id) {
            if (historial.eliminado) {
                return HistorialComidaClienteEmpresa.destroy({
                    where: { id: historial.id }
                }, { transaction: t }).catch(function (err) {
                    return new Promise(function (fullfil, reject) {
                        fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
                    })
                })
            } else {
                return HistorialComidaClienteEmpresa.update({
                    tarjeta: historial.tarjeta,
                    id_cliente: historial.alias.empresaCliente.id,
                    id_comensal: historial.comensal.id,
                    id_empresa: empresa,
                    id_gerencia: historial.comensal.gerencia.id,
                    id_comida: historial.comida.id,
                    fecha: historial.fecha,
                    id_usuario: historial.id_usuario
                }, { where: { id: historial.id }, transaction: t }).then(function (hisltorial) {
                    return new Promise(function (fullfil, reject) {
                        fullfil(historial)
                    })
                }).catch(function (err) {
                    return new Promise(function (fullfil, reject) {
                        fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
                    })
                })
            }
        } else {
            return HistorialComidaClienteEmpresa.create({
                tarjeta: historial.tarjeta,
                id_cliente: historial.alias.id_cliente,
                id_comensal: historial.comensal.id,
                id_empresa: empresa,
                id_gerencia: historial.comensal.gerencia.id,
                id_comida: historial.comida ? historial.comida.id : null,
                fecha: historial.fecha,
                id_usuario: historial.id_usuario
            }, {
                    transaction: t
                })/*.then(function (historial) {
                return new Promise(function (fullfil, reject) {
                    fullfil({hasErr: false, historial: historial})
                })
            }).catch(function (err) {
                return new Promise(function (fullfil, reject) {
                    fullfil({hasErr: true, mensaje: err.stack, index: i+2, tipo: 'Error' })
                })
            })*/
        }
    }
    function verificarDatosHistorialExcel(historial, empresa, t, i) {
        var erro = false
        var promises = []
        return AliasClienteEmpresa.find({
            where: { nombre: historial.alias },
            transaction: t
        }).then(function (alias) {
            if (alias) {
                historial.alias = alias.dataValues
                return ComensalesClienteEmpresa.find({
                    where: { nombre: historial.nombre },
                    include: [{ model: GerenciasClienteEmpresa, as: 'gerencia' }],
                    transaction: t
                }).then(function (comensal) {
                    if (comensal) {
                        if (!historial.fecha) {
                            historial.fecha = extraerFechaExcel(historial.fecha_hora)
                        }
                        var condicionTiempo = { inicio: { lte: historial.fecha.split('T')[1].split('.')[0] }, final: { gte: historial.fecha.split('T')[1].split('.')[0] }, empresa: historial.id_empresa }
                        historial.comensal = comensal.dataValues
                        return horarioComidasClienteEmpresa.find({
                            where: condicionTiempo,
                            transaction: t
                        }).then(function (comida) {
                            historial.comida = comida ? comida.dataValues : null
                            return crearHistorial(historial, empresa, t)
                        }).catch(function (err) {
                            return new Promise(function (fullfil, reject) {
                                fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
                            })
                        })
                    } else {
                        erro = true
                        return new Promise(function (fullfil, reject) {
                            fullfil({ hasErr: true, mensaje: 'No se encuentra en la Base de Datos el registro comensal : ' + historial.nombre, index: i + 2, tipo: 'Comensal -> No registrado.' })
                        })
                    }

                }).catch(function (err) {
                    return new Promise(function (fullfil, reject) {
                        fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
                    })
                })
            } else {
                erro = true
                return new Promise(function (fullfil, reject) {
                    fullfil({ hasErr: true, mensaje: 'No se encuentra en la Base de Datos el registro alias empresa -> NAME: ' + historial.alias, index: i + 2, tipo: 'Empresa -> alias -> NAME' })
                })
            }
        }).catch(function (err) {
            return new Promise(function (fullfil, reject) {
                fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
            })
        })
    }
    function verificarDatosComensalExcel(comensal, empresa, t, i) {
        return AliasClienteEmpresa.find({
            where: { nombre: comensal.tipo },
            transaction: t
        }).then(function (alias) {
            if (alias) {
                comensal.empresaCliente = { id: alias.dataValues.id_cliente }
                return ComensalesClienteEmpresa.find({
                    where: { codigo: comensal.codigo },
                    include: [{ model: GerenciasClienteEmpresa, as: 'gerencia' }],
                    transaction: t
                }).then(function (comensalEncontrado) {
                    if (comensalEncontrado) {
                        return new Promise(function (fullfil, reject) {
                            fullfil({ hasErr: true, mensaje: 'El código ' + comensal.codigo + ' ya existe en la base de datos', index: i + 2, tipo: 'Error' })
                        })
                    } else {
                        return crearComensal(comensal, empresa, t)
                    }
                }).catch(function (err) {
                    return new Promise(function (fullfil, reject) {
                        fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
                    })
                })
            } else {
                erro = true
                return new Promise(function (fullfil, reject) {
                    fullfil({ hasErr: true, mensaje: 'No se encuentra en la Base de Datos el registro alias empresa -> NAME: ' + comensal.alias, index: i + 2, tipo: 'Empresa -> alias -> NAME' })
                })
            }
        }).catch(function (err) {
            return new Promise(function (fullfil, reject) {
                fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
            })
        })
    }
    function verificarDatosAliasExcel(alias, empresa, t, i) {
        return AliasClienteEmpresa.find({
            where: { $or: [{nombre:{$like: '%' + alias.nombre}},{codigo: alias.codigo }] },
            transaction: t
        }).then(function (aliasEncontrado) {
            if (aliasEncontrado) {
                return new Promise(function (fullfil, reject) {
                    fullfil({ hasErr: true, mensaje: 'El código y/o alias NAME:'+alias.nombre+' código: ' + alias.codigo + ' ya existe en la base de datos', index: i + 2, tipo: 'Error' })
                })
            } else {
                return Cliente.find({
                    where: { razon_social: { $like: '%' + alias.empresaCliente }, id_empresa: empresa },
                    transaction: t
                }).then(function (clienteEncontrado) {
                    if (clienteEncontrado) {
                        alias.empresaCliente = clienteEncontrado
                        return crearAlias(alias, empresa, t)
                    } else {
                        return new Promise(function (fullfil, reject) {
                            fullfil({ hasErr: true, mensaje: 'No se encuentra la información del cliente/empresa: ' + alias.empresaCliente, index: i + 2, tipo: 'Error' })
                        })
                    }
                })
            }
        }).catch(function (err) {
            return new Promise(function (fullfil, reject) {
                fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
            })
        })
    }
    function extraerFechaExcel(datoFecha) {
        var horas = datoFecha.split(' ')[datoFecha.split(' ').length - 1]
        var fecha = datoFecha.split(' ')[0].split('/').reverse()
        if (horas.indexOf('AM') > 0) {
            horas = horas.split('A')[0].split(':')
        } else if (horas.indexOf('PM') > 0) {
            horas = horas.split('P')[0].split(':')
            horas[0] = (parseInt(horas[0]) + 12) + ''
        }
        var fechaCompleta = fecha[0] + '-' + (fecha[2].length == 2 ? fecha[2] : '0' + fecha[2]) + '-' + (fecha[1].length == 2 ? fecha[1] : '0' + fecha[1]) + 'T' + horas[0] + ':' + horas[1] + ':' + horas[2] + '.000Z'
        return fechaCompleta
    }
    router.route('/cliente/empresa/gerencias/:id_empresa/:id_usuario')
        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promises = []
                for (let i = 0; i < req.body.length; i++) {
                    promises.push(crearGerencia(req.body[i], req.params.id_empresa, t))
                }
                return Promise.all(promises)
            }).then(function (result) {
                if (result.length > 0) {
                    res.json({ mensaje: 'Guardado correctamente.', lista: result })
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .get(function (req, res) {
            GerenciasClienteEmpresa.findAll({
                where: { id_empresa: req.params.id_empresa },
                include: [{ model: Cliente, as: 'empresaCliente' }]
            }).then(function (result) {
                res.json({ lista: result })
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })

    router.route('/cliente/empresa/alias/:id_empresa/:id_usuario')
        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promises = []
                for (let i = 0; i < req.body.length; i++) {
                    promises.push(crearAlias(req.body[i], req.params.id_empresa, t))
                }
                return Promise.all(promises)
            }).then(function (result) {
                if (result.length > 0) {
                    res.json({ mensaje: 'Guardado correctamente.', lista: result })
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .get(function (req, res) {
            AliasClienteEmpresa.findAll({
                where: { id_empresa: req.params.id_empresa },
                include: [{ model: Cliente, as: 'empresaCliente' }]
            }).then(function (result) {
                res.json({ lista: result })
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })

    router.route('/cliente/empresa/comensales/:id_empresa/:id_usuario')
        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promises = []
                for (let i = 0; i < req.body.length; i++) {
                    promises.push(crearComensal(req.body[i], req.params.id_empresa, t))
                }
                return Promise.all(promises)
            }).then(function (result) {
                if (result.length > 0) {
                    res.json({ mensaje: 'Guardado correctamente.' })
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .get(function (req, res) {
            ComensalesClienteEmpresa.findAll({
                where: { id_empresa: req.params.id_empresa },
                include: [{ model: Cliente, as: 'empresaCliente' }, { model: GerenciasClienteEmpresa, as: 'gerencia' }]
            }).then(function (result) {
                res.json({ lista: result })
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })

    router.route('/cliente/empresa/horarios/comida/:id_empresa/:id_usuario/:id_cliente')
        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promises = []
                for (let i = 0; i < req.body.length; i++) {
                    promises.push(crearComida(req.body[i], req.params.id_empresa, t))
                }
                return Promise.all(promises)
            }).then(function (result) {
                if (result.length > 0) {
                    res.json({ mensaje: 'Guardado correctamente.' })
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .get(function (req, res) {
            var condicion = { id_empresa: req.params.id_empresa }
            if (req.params.id_cliente && req.params.id_cliente !== "0") {
                condicion.id_cliente = req.params.id_cliente
            }
            horarioComidasClienteEmpresa.findAll({
                where: condicion,
                include: [{ model: Cliente, as: 'empresaCliente' }]
            }).then(function (result) {
                res.json({ lista: result })
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })

    router.route('/cliente/empresa/precio/comida/:id_empresa/:id_usuario/:id_cliente')
        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promises = []
                for (let i = 0; i < req.body.length; i++) {
                    promises.push(crearPrecioComida(req.body[i], req.params.id_empresa, t))
                }
                return Promise.all(promises)
            }).then(function (result) {
                if (result.length > 0) {
                    res.json({ mensaje: 'Guardado correctamente.' })
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .get(function (req, res) {
            var condicion = { id_empresa: req.params.id_empresa }
            if (req.params.id_cliente && req.params.id_cliente !== "0") {
                condicion.id_cliente = req.params.id_cliente
            }
            PrecioComidasClienteEmpresa.findAll({
                where: condicion,
                include: [{ model: Cliente, as: 'empresaCliente' }]
            }).then(function (result) {
                res.json({ lista: result })
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })

    router.route('/cliente/empresa/excel/historial/:id_empresa/:id_usuario')
        .post(function (req, res) {
            var Errors = []
            var promises = []
            sequelize.transaction(function (t) {
                for (let i = 0; i < req.body.length; i++) {
                    req.body[i].id_usuario = req.params.id_usuario
                    req.body[i].id_empresa = req.params.id_empresa
                    promises.push(verificarDatosHistorialExcel(req.body[i], req.params.id_empresa, t, i))
                }
                return Promise.all(promises)
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
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })

    router.route('/cliente/empresa/excel/comensal/:id_empresa/:id_usuario')
        .post(function (req, res) {
            var Errors = []
            var promises = []
            sequelize.transaction(function (t) {
                for (let i = 0; i < req.body.length; i++) {
                    req.body[i].id_usuario = req.params.id_usuario
                    req.body[i].id_empresa = req.params.id_empresa
                    promises.push(verificarDatosComensalExcel(req.body[i], req.params.id_empresa, t, i))
                }
                return Promise.all(promises)
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
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })

    router.route('/cliente/empresa/excel/alias/:id_empresa/:id_usuario')
        .post(function (req, res) {
            var Errors = []
            var promises = []
            sequelize.transaction(function (t) {
                for (let i = 0; i < req.body.length; i++) {
                    req.body[i].id_usuario = req.params.id_usuario
                    req.body[i].id_empresa = req.params.id_empresa
                    promises.push(verificarDatosAliasExcel(req.body[i], req.params.id_empresa, t, i))
                }
                return Promise.all(promises)
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
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })

    router.route('/cliente/empresa/historial/:id_empresa/:id_usuario/:id_cliente/:desde/:hasta')
        .post(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })
        .get(function (req, res) {
            HistorialComidaClienteEmpresa.findAll({
                where: { id_empresa: req.params.id_empresa, id_cliente: req.params.id_cliente },
                include: [{ model: GerenciasClienteEmpresa, as: 'gerencia', required: false }, { model: Cliente, as: 'empresaCliente', required: false }, { model: ComensalesClienteEmpresa, as: 'comensal' }, { model: Usuario, as: 'usuario' }, { model: horarioComidasClienteEmpresa, as: 'comida' }]
            }).then(function (historial) {
                res.json({ historial: historial })
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })
}