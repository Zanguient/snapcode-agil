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
                    id_gerencia: comensal.gerencia ? comensal.gerencia.id : null,
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
                id_gerencia: comensal.gerencia ? comensal.gerencia.id : null,
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
                    id_comida: precioComida.comida.id,
                    id_empresa: empresa,
                    precio: parseFloat(precioComida.precio)
                }, { where: { id: precioComida.id }, transaction: t })
            }
        } else {
            return PrecioComidasClienteEmpresa.create({
                codigo: precioComida.codigo,
                id_cliente: precioComida.empresaCliente.id,
                id_comida: precioComida.comida.id,
                id_empresa: empresa,
                precio: parseFloat(precioComida.precio)
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
                    id_gerencia: historial.gerencia ? historial.gerencia.id : null,
                    id_comida: historial.comida.id,
                    fecha: historial.fecha,
                    id_usuario: historial.id_usuario,
                    precio: historial.comida.precio
                }, { where: { id: historial.id }, transaction: t }).then(function (historialActualizado) {
                    return new Promise(function (fullfil, reject) {
                        fullfil({ historial: historial, actualizado: historialActualizado })
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
                id_gerencia: historial.gerencia ? historial.gerencia.id : null,
                id_comida: historial.comida ? historial.comida.id : null,
                fecha: historial.fecha,
                id_usuario: historial.id_usuario,
                precio: historial.comida.precio
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
            where: { nombre: historial.alias, id_empresa: empresa },
            transaction: t
        }).then(function (alias) {
            if (alias) {
                historial.alias = alias.dataValues
                return ComensalesClienteEmpresa.find({
                    where: { nombre: historial.nombre, id_empresa: empresa, id_cliente: historial.alias.id_cliente },
                    include: [{ model: GerenciasClienteEmpresa, as: 'gerencia' }],
                    transaction: t
                }).then(function (comensal) {
                    if (comensal) {
                        if (!historial.fecha) {
                            historial.fecha = extraerFechaExcel(historial.fecha_hora)
                        }
                        var condicionTiempo = { inicio: { lte: historial.fecha.split('T')[1].split('.')[0] }, final: { gte: historial.fecha.split('T')[1].split('.')[0] }, id_empresa: empresa, id_cliente: historial.alias.id_cliente }
                        historial.comensal = comensal.dataValues
                        return horarioComidasClienteEmpresa.find({
                            having: condicionTiempo,
                            transaction: t
                        }).then(function (comida) {
                            historial.comida = comida ? comida.dataValues : { id: null }
                            return GerenciasClienteEmpresa.find({
                                where: { nombre: historial.comensal.gerencia.nombre }
                            }).then(function (gerenciaEncontrada) {
                                if (gerenciaEncontrada) {
                                    historial.gerencia = gerenciaEncontrada.dataValues
                                    return crearHistorial(historial, empresa, t)
                                } else {
                                    historial.gerencia = historial.comensal.gerencia
                                    return crearHistorial(historial, empresa, t)
                                }
                            })
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
            where: { nombre: comensal.tipo, id_empresa: empresa },
            transaction: t
        }).then(function (alias) {
            if (alias) {
                comensal.empresaCliente = { id: alias.dataValues.id_cliente }
                return ComensalesClienteEmpresa.find({
                    where: { codigo: comensal.codigo, id_empresa: empresa, id_cliente: comensal.empresaCliente.id },
                    include: [{ model: GerenciasClienteEmpresa, as: 'gerencia' }],
                    transaction: t
                }).then(function (comensalEncontrado) {
                    if (comensalEncontrado) {
                        return new Promise(function (fullfil, reject) {
                            fullfil({ hasErr: true, mensaje: 'El código ' + comensal.codigo + ' ya existe en la base de datos', index: i + 2, tipo: 'Error' })
                        })
                    } else {
                        return GerenciasClienteEmpresa.find({
                            where: { nombre: comensal.gerencia, id_empresa: empresa, id_cliente: comensal.empresaCliente.id }
                        }).then(function (gerenciaEncontrada) {
                            comensal.gerencia = gerenciaEncontrada ? gerenciaEncontrada.dataValues : { id: null }
                            return crearComensal(comensal, empresa, t)
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
            where: { $or: [{ nombre: { $like: '%' + alias.nombre } }, { codigo: alias.codigo }], id_empresa: empresa },
            transaction: t
        }).then(function (aliasEncontrado) {
            if (aliasEncontrado) {
                return new Promise(function (fullfil, reject) {
                    fullfil({ hasErr: true, mensaje: 'El código y/o alias NAME:' + alias.nombre + ' código: ' + alias.codigo + ' ya existe en la base de datos', index: i + 2, tipo: 'Error' })
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
    function verificarDatosGerenciasExcel(gerencia, empresa, t, i) {
        return Cliente.find({
            where: { razon_social: { $like: '%' + gerencia.empresaCliente } },
            transaction: t
        }).then(function (aliasEncontrado) {
            if (aliasEncontrado) {
                gerencia.empresaCliente = aliasEncontrado.dataValues
                return GerenciasClienteEmpresa.find({
                    where: { $or: [{ nombre: { $like: '%' + gerencia.nombre }, codigo: gerencia.codigo }], id_empresa: empresa },
                    transaction: t
                }).then(function (gerenciaEncontrado) {
                    if (gerenciaEncontrado) {
                        return new Promise(function (fullfil, reject) {
                            fullfil({ hasErr: true, mensaje: 'El código y/o gerencia NAME:' + gerencia.nombre + ' código: ' + gerencia.codigo + ' ya existe en la base de datos', index: i + 2, tipo: 'Error' })
                        })
                    } else {
                        return crearGerencia(gerencia, empresa, t)
                    }
                })
            } else {
                return new Promise(function (fullfil, reject) {
                    fullfil({ hasErr: true, mensaje: 'No se encuentra la información del cliente/empresa: ' + gerencia.empresaCliente, index: i + 2, tipo: 'Error' })
                })
            }
        }).catch(function (err) {
            return new Promise(function (fullfil, reject) {
                fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
            })
        })
    }
    function verificarDatosComidasExcel(comida, empresa, t, i) {
        return Cliente.find({
            where: { razon_social: { $like: '%' + comida.empresaCliente } },
            transaction: t
        }).then(function (aliasEncontrado) {
            if (aliasEncontrado) {
                comida.empresaCliente = aliasEncontrado.dataValues
                return horarioComidasClienteEmpresa.find({
                    where: { $or: [{ nombre: { $like: comida.nombre }, codigo: comida.codigo }], id_empresa: empresa },
                    transaction: t
                }).then(function (comidaEncontrada) {
                    if (comidaEncontrada) {
                        return new Promise(function (fullfil, reject) {
                            fullfil({ hasErr: true, mensaje: 'El código y/o comida Nombre:' + comida.nombre + ' código: ' + comida.codigo + ' ya existe en la base de datos', index: i + 2, tipo: 'Error' })
                        })
                    } else {
                        return crearComida(comida, empresa, t)
                    }
                })
            } else {
                return new Promise(function (fullfil, reject) {
                    fullfil({ hasErr: true, mensaje: 'No se encuentra la información del cliente/empresa: ' + comida.empresaCliente, index: i + 2, tipo: 'Error' })
                })
            }
        }).catch(function (err) {
            return new Promise(function (fullfil, reject) {
                fullfil({ hasErr: true, mensaje: err.stack, index: i + 2, tipo: 'Error' })
            })
        })
    }
    function verificarDatosPreciosExcel(precio, empresa, t, i) {
        return Cliente.find({
            where: { razon_social: { $like: '%' + precio.empresaCliente } },
            transaction: t
        }).then(function (aliasEncontrado) {
            if (aliasEncontrado) {
                precio.empresaCliente = aliasEncontrado.dataValues
                return horarioComidasClienteEmpresa.find({
                    where: { nombre: { $like: '%' + precio.nombre }, id_empresa: empresa },
                    transaction: t
                }).then(function (comidaEncontrada) {
                    if (comidaEncontrada) {
                        precio.comida = comidaEncontrada.dataValues
                        return crearPrecioComida(precio, empresa, t)
                    } else {
                        return new Promise(function (fullfil, reject) {
                            fullfil({ hasErr: true, mensaje: 'No se encuentra la información del comida/empresa: ' + precio.nombre, index: i + 2, tipo: 'Error' })
                        })
                    }
                })
            } else {
                return new Promise(function (fullfil, reject) {
                    fullfil({ hasErr: true, mensaje: 'No se encuentra la información del cliente/empresa: ' + precio.empresaCliente, index: i + 2, tipo: 'Error' })
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
    router.route('/cliente/empresa/gerencias/:id_empresa/:id_usuario/:id_cliente')
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
            var condicion = { id_empresa: req.params.id_empresa }
            if (req.params.id_cliente != "0") {
                condicion.id_cliente = req.params.id_cliente
            }
            GerenciasClienteEmpresa.findAll({
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

    router.route('/cliente/empresa/comensales/:id_empresa/:id_usuario/:id_cliente')
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
            var condicion = { id_empresa: req.params.id_empresa }
            if (req.params.id_cliente != "0") {
                condicion.id_cliente = req.params.id_cliente
            }
            ComensalesClienteEmpresa.findAll({
                where: condicion,
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
                include: [{ model: Cliente, as: 'empresaCliente' }, { model: horarioComidasClienteEmpresa, as: 'comida' }]
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

    router.route('/cliente/empresa/excel/gerencias/:id_empresa/:id_usuario')
        .post(function (req, res) {
            var Errors = []
            var promises = []
            sequelize.transaction(function (t) {
                for (let i = 0; i < req.body.length; i++) {
                    req.body[i].id_usuario = req.params.id_usuario
                    req.body[i].id_empresa = req.params.id_empresa
                    promises.push(verificarDatosGerenciasExcel(req.body[i], req.params.id_empresa, t, i))
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
                    res.json({ mensaje: 'No se guardo, ocurrió un error.' })
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })

    router.route('/cliente/empresa/excel/comidas/:id_empresa/:id_usuario')
        .post(function (req, res) {
            var Errors = []
            var promises = []
            sequelize.transaction(function (t) {
                for (let i = 0; i < req.body.length; i++) {
                    req.body[i].id_usuario = req.params.id_usuario
                    req.body[i].id_empresa = req.params.id_empresa
                    promises.push(verificarDatosComidasExcel(req.body[i], req.params.id_empresa, t, i))
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
                    res.json({ mensaje: 'No se guardo, ocurrió un error.' })
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })

    router.route('/cliente/empresa/excel/precios/:id_empresa/:id_usuario')
        .post(function (req, res) {
            var Errors = []
            var promises = []
            sequelize.transaction(function (t) {
                for (let i = 0; i < req.body.length; i++) {
                    req.body[i].id_usuario = req.params.id_usuario
                    req.body[i].id_empresa = req.params.id_empresa
                    promises.push(verificarDatosPreciosExcel(req.body[i], req.params.id_empresa, t, i))
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
                    res.json({ mensaje: 'No se guardo, ocurrió un error.' })
                }
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })

    router.route('/cliente/empresa/historial/:id_empresa/:id_usuario/:id_cliente/:desde/:hasta/:mes/:anio/:empresaCliente/:gerencia/:comensal/:comida/:estado/:pagina/:items_pagina')
        .post(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })
        .get(function (req, res) {
            var condicionHistorial = {}
            var condicionGerencia = {}
            var condicionEmpleado = {}
            condicionHistorial.id_empresa = req.params.id_empresa
            condicionHistorial.id_cliente = req.params.id_cliente
            var desde = false
            var hasta = false
            if (req.params.mes != "0" && req.params.anio != "0") {
                var fecha_desde = new Date(parseInt(req.params.anio), parseInt(req.params.mes), 1, 0, 0, 0)
                var fecha_hasta = new Date(parseInt(req.params.anio), parseInt(req.params.mes) + 1, 0, 23, 59, 0)
                condicionHistorial.fecha = { $between: [fecha_desde, fecha_hasta] }
            } else {
                if (req.params.desde != "0") {
                    var inicio = new Date(req.params.desde.split('/').reverse()); inicio.setHours(0, 0, 0, 0, 0);
                    desde = true
                }
                if (req.params.hasta != "0") {
                    var fin = new Date(req.params.hasta.split('/').reverse()); fin.setHours(23, 59, 0, 0, 0);
                    hasta = true
                }
            }
            if (desde && hasta) {
                condicionHistorial.fecha = { $between: [inicio, fin] }
            } else if (desde && !hasta) {
                condicionHistorial.fecha = {
                    $gte: [inicio]
                }
            } else if (!desde && hasta) {
                condicionHistorial.fecha = {
                    $lte: [fin]
                }
            } else if (!desde && !hasta && (req.params.anio != "0")) {
                var inicio;
                var fin;
                if (req.params.mes != "0") {
                    inicio = new Date(parseInt(req.params.anio), parseInt(req.params.mes) - 1, 1, 0, 0, 0, 0)
                    fin = new Date(parseInt(req.params.anio), parseInt(req.params.mes), 1, 0, 0, 0, 0)
                } else {
                    inicio = new Date(parseInt(req.params.anio), 0, 1, 0, 0, 0, 0)
                    fin = new Date(parseInt(req.params.anio), 11, 31, 23, 59, 59, 0)
                }
                condicionHistorial.fecha = { $between: [inicio, fin] }
            }
            if (req.params.empresaCliente != "0") {
                condicionHistorial.id_cliente = req.params.empresaCliente
            }
            if (req.params.gerencia != "0") {
                condicionHistorial.id_gerencia = req.params.gerencia
            }
            if (req.params.comensal != "0") {
                condicionHistorial.id_comensal = req.params.comensal
            }
            if (req.params.comida != "0") {
                condicionHistorial.id_comida = req.params.comida
            }
            if (req.params.estado != "0") {

            }
            HistorialComidaClienteEmpresa.findAndCountAll({
                where: condicionHistorial,
                include: [
                    { model: GerenciasClienteEmpresa, as: 'gerencia', where: condicionGerencia, required: false },
                    { model: Cliente, as: 'empresaCliente', required: false },
                    { model: ComensalesClienteEmpresa, as: 'comensal', where: condicionEmpleado },
                    { model: Usuario, as: 'usuario' },
                    { model: horarioComidasClienteEmpresa, as: 'comida' }
                ]
            }).then(function (historialCount) {
                HistorialComidaClienteEmpresa.findAll({
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    where: condicionHistorial,
                    include: [
                        { model: GerenciasClienteEmpresa, as: 'gerencia', where: condicionGerencia, required: false },
                        { model: Cliente, as: 'empresaCliente', required: false },
                        { model: ComensalesClienteEmpresa, as: 'comensal' },
                        { model: Usuario, as: 'usuario' },
                        { model: horarioComidasClienteEmpresa, as: 'comida' }
                    ]
                }).then(function (historial) {
                    res.json({ historial: historial, paginas: Math.ceil(historialCount.count / req.params.items_pagina) })
                }).catch(function (err) {
                    res.json({ mensaje: err.stack, hasErr: true })
                })
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })
    router.route('/comensal/empresa/busqueda/:busqueda/:id_empresa/:id_usuario/:id_cliente')
        .get(function (req, res) {
            var condicion = { id_empresa: req.params.id_empresa, id_cliente: req.params.id_cliente, nombre: { $like: req.params.busqueda + '%' } }
            ComensalesClienteEmpresa.findAll({
                where: condicion
            }).then(function (result) {
                res.json(result)
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })

    router.route('/reporte/comedor/:id_empresa/:id_usuario/:id_cliente/:desde/:hasta/:mes/:anio/:empresaCliente/:gerencia/:comensal/:comida/:estado')
        .get(function (req, res) {
            var condicion = { id_empresa: req.params.id_empresa, id_cliente: req.params.id_cliente }
            var desde = false
            var hasta = false
            if (req.params.mes != "0" && req.params.anio != "0") {
                var fecha_desde = new Date(parseInt(req.params.anio), parseInt(req.params.mes), 1, 0, 0, 0)
                var fecha_hasta = new Date(parseInt(req.params.anio), parseInt(req.params.mes) + 1, 0, 23, 59, 0)
                condicionHistorial.fecha = { $between: [fecha_desde, fecha_hasta] }
            } else {
                if (req.params.desde != "0") {
                    var inicio = new Date(req.params.desde.split('/').reverse()); inicio.setHours(0, 0, 0, 0, 0);
                    desde = true
                }
                if (req.params.hasta != "0") {
                    var fin = new Date(req.params.hasta.split('/').reverse()); fin.setHours(23, 59, 0, 0, 0);
                    hasta = true
                }
            }
            if (desde && hasta) {
                condicionHistorial.fecha = { $between: [inicio, fin] }
            } else if (desde && !hasta) {
                condicionHistorial.fecha = {
                    $gte: [inicio]
                }
            } else if (!desde && hasta) {
                condicionHistorial.fecha = {
                    $lte: [fin]
                }
            } else if (!desde && !hasta && (req.params.anio != "0")) {
                var inicio;
                var fin;
                if (req.params.mes != "0") {
                    inicio = new Date(parseInt(req.params.anio), parseInt(req.params.mes) - 1, 1, 0, 0, 0, 0)
                    fin = new Date(parseInt(req.params.anio), parseInt(req.params.mes), 1, 0, 0, 0, 0)
                } else {
                    inicio = new Date(parseInt(req.params.anio), 0, 1, 0, 0, 0, 0)
                    fin = new Date(parseInt(req.params.anio), 11, 31, 23, 59, 59, 0)
                }
                condicionHistorial.fecha = { $between: [inicio, fin] }
            }
            GerenciasClienteEmpresa.findAll({
                where: condicion,
                include: [{ model: HistorialComidaClienteEmpresa, as: 'historial', include: [{ model: horarioComidasClienteEmpresa, as: 'comida' }] }],
                order: [[{ model: HistorialComidaClienteEmpresa, as: 'historial' }, 'fecha', 'asc']]
            }).then(function (result) {
                res.json({reporte: result})
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true })
            })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })
}