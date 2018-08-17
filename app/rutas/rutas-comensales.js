module.exports = function (router, sequelize, Persona, Cliente, AliasClienteEmpresa, ComensalesClienteEmpresa, GerenciasClienteEmpresa, horarioComidasClienteEmpresa, PrecioComidasClienteEmpresa) {

    function crearAlias(alias, empresa, t) {
        if (alias.id) {
            if (alias.eliminado) {
                return AliasClienteEmpresa.destroy({
                    where:{id: alias.id},
                    transaction: t
                })
            } else {
                return AliasClienteEmpresa.update({
                    codigo: alias.codigo,
                    id_cliente: alias.empresaCliente.id,
                    nombre: alias.nombre,
                    id_empresa: empresa
                }, { where:{id: alias.id}, transaction: t })
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

    router.route('/cliente/empresa/historial/:id_empresa/:id_usuario')
        .post(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })
        .get(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })
        .put(function (req, res) {
            res.json({ mensaje: 'sin funcionalidad' })
        })
}