module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, Banco, Clase, TransaccionSeguimiento, CuentaTransaccion, Cliente, ClienteRazon,
    MedicoPaciente, Persona, sequelize, Proveedor, ProveedorCuenta, Venta, Almacen, Sucursal, PagoVenta, PagoCompra, Compra) {

    router.route('/transacciones/bancos/empresa/:id_empresa')

        .get(ensureAuthorizedAdministrador, function (req, res) {
            Banco.findAll({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: Clase, as: 'tipoCuenta' }, { model: Clase, as: 'tipoMoneda' }]
            }).then(function (entity) {
                res.json(entity);
            });
        });

    router.route('/transacciones/ingreso/bancos/empresa/:id_empresa/:id_usuario')
        .post(ensureAuthorizedAdministrador, function (req, res) {
            var promisse = []
            sequelize.transaction(function (t) {
                promisse.push(
                    Clase.find({
                        where: { nombre_corto: 'SAL_INICIAL' }
                    }).then(function (SALDO_INICIAL) {
                        return CuentaTransaccion.find({
                            where: { id_concepto: SALDO_INICIAL.id, id_cuenta: req.body.cuenta, id_empresa: req.params.id_empresa }
                        }).then(function (transaccionInicial) {
                            if (transaccionInicial !== null && transaccionInicial !== undefined) {
                                if (SALDO_INICIAL.id == req.body.concepto) {
                                    return new Promise(function (fulfill, reject) {
                                        reject('La cuenta ya cuenta con un saldo inicial, no puede ser modificado.');
                                    });
                                } else {
                                    return Clase.find({
                                        where: { nombre_corto: 'CTRAN' }
                                    }).then(function (COBRO) {
                                        if (COBRO.id === req.body.concepto) {
                                            return sequelize.query(
                                                "SELECT agil_cuenta_transaccion.saldo  \
                                                 from agil_cuenta_transaccion where id = (select MAX(agil_cuenta_transaccion.id) from agil_cuenta_transaccion where cuenta = "+ req.body.cuenta + " and empresa =" + req.params.id_empresa + ")",
                                                { type: sequelize.QueryTypes.SELECT, transaction: t }
                                            ).then(function (transaccion) {
                                                return Clase.find({
                                                    where: { nombre_corto: 'EN_TRANSITO' },
                                                    transaction: t
                                                }).then(function (estadoEnTransito) {
                                                    return CuentaTransaccion.create({
                                                        fecha: req.body.fecha,
                                                        id_cuenta: req.body.cuenta,
                                                        detalle: req.body.detalle,
                                                        id_cliente: (req.body.venta !== null && req.body.venta !== undefined) ? req.body.venta.id_cliente : null,
                                                        id_concepto: req.body.concepto,
                                                        observaciones: req.body.observacion,
                                                        ref_doc: req.body.ref_doc,
                                                        tipo_doc: req.body.tipo_doc,
                                                        debe: req.body.debe,
                                                        haber: req.body.haber,
                                                        saldo: req.body.haber + transaccion[0].saldo,
                                                        id_estado: estadoEnTransito.id,
                                                        id_empresa: req.params.id_empresa,
                                                        eliminado: false,
                                                        id_usuario: req.params.id_usuario
                                                    }, {
                                                            transaction: t
                                                        }).then(function (transaccionRegistrada) {
                                                            return TransaccionSeguimiento.create({
                                                                id_transaccion: transaccionRegistrada.id,
                                                                proveedor: false,
                                                                id_entregado: null,
                                                                id_devuelto: null,
                                                                fecha_entraga: null,
                                                                fecha_devuelto: null,
                                                                id_empresa: req.params.id_empresa,
                                                                eliminado: false
                                                            }, { transaction: t }).then(function (seguimientoCreado) {

                                                                return Venta.find({
                                                                    where: { id: req.body.venta.id },
                                                                    include: [{
                                                                        model: Almacen, as: 'almacen',
                                                                        include: [{ model: Sucursal, as: 'sucursal' }]
                                                                    }],
                                                                    transaction: t
                                                                }).then(function (ventaEncontrada) {
                                                                    return Venta.update({
                                                                        a_cuenta: ventaEncontrada.a_cuenta + req.body.haber,
                                                                        saldo: ventaEncontrada.total - (ventaEncontrada.a_cuenta + req.body.haber)
                                                                    }, {
                                                                            where: {
                                                                                id: ventaEncontrada.id
                                                                            },
                                                                            transaction: t
                                                                        }).then(function (affectedRows) {
                                                                            return PagoVenta.create({
                                                                                id_venta: ventaEncontrada.id,
                                                                                a_cuenta_anterior: ventaEncontrada.a_cuenta,
                                                                                saldo_anterior: ventaEncontrada.saldo,
                                                                                monto_pagado: req.body.haber,
                                                                                id_usuario: req.body.id_usuario_cajero,
                                                                                numero_documento: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo
                                                                            },
                                                                                {
                                                                                    transaction: t
                                                                                }).then(function (detalleVentaCreada) {
                                                                                    return Sucursal.update({
                                                                                        nota_recibo_correlativo: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo + 1
                                                                                    }, {
                                                                                            where: {
                                                                                                id: ventaEncontrada.almacen.sucursal.id
                                                                                            }, transaction: t
                                                                                        }).then(function (affectedRows) {
                                                                                            return new Promise(function (fulfill, reject) {
                                                                                                fulfill(affectedRows);
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
                                                reject('No se puede hacer el ingreso con concepto de pago (egreso).');
                                            });
                                        }
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    })
                                }
                            } else {
                                if (SALDO_INICIAL.id === req.body.concepto) {
                                    return Clase.find({
                                        where: { nombre_corto: 'CONFIRMADO' },
                                        transaction: t
                                    }).then(function (estadoConfirmado) {
                                        return CuentaTransaccion.create({
                                            fecha: req.body.fecha,
                                            id_cuenta: req.body.cuenta,
                                            detalle: req.body.detalle,
                                            // id_cliente: (req.body.venta !== null && req.body.venta !== undefined) ? req.body.venta.id_cliente : null,
                                            id_concepto: req.body.concepto,
                                            observaciones: req.body.observacion,
                                            ref_doc: req.body.ref_doc,
                                            tipo_doc: req.body.tipo_doc,
                                            // debe: req.body.debe,
                                            // haber: req.body.haber,
                                            saldo: req.body.haber,
                                            id_estado: estadoConfirmado.id,
                                            id_empresa: req.params.id_empresa,
                                            eliminado: false,
                                            id_usuario: req.params.id_usuario
                                        }, {
                                                transaction: t
                                            }).then(function (transaccionInicial) {
                                                return new Promise(function (fulfill, reject) {
                                                    fulfill(transaccionInicial);
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
                                        reject('No se pueden hacer ingresos a la cuenta, se requiere un ingreso de saldo inicial.');
                                    });
                                }
                            }
                        }).catch(function (err) {
                            return new Promise(function (fulfill, reject) {
                                reject((err.stack !== undefined) ? err.stack : err);
                            });
                        })
                    })
                )
                return Promise.all(promisse);
            }).then(function (transaccionCreada) {
                if (transaccionCreada !== undefined) {
                    res.json({ mensaje: 'Transacción completada.' })
                } else {
                    throw new Error('Se produjo un error y no se puede asegurar los datos, los cambios fueron revertidos.');
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
            })
        })
    // .put(function (req, res) {

    // })

    router.route('/transacciones/egreso/bancos/empresa/:id_empresa/:id_usuario')
        .post(ensureAuthorizedAdministrador, function (req, res) {
            var promisse = []
            sequelize.transaction(function (t) {
                promisse.push(
                    Clase.find({
                        where: { nombre_corto: 'SAL_INICIAL' }
                    }).then(function (SALDO_INICIAL) {
                        return CuentaTransaccion.find({
                            where: { id_concepto: SALDO_INICIAL.id, id_cuenta: req.body.cuenta, id_empresa: req.params.id_empresa }
                        }).then(function (transaccionInicial) {
                            if (transaccionInicial !== null && transaccionInicial !== undefined) {
                                if (SALDO_INICIAL.id == req.body.concepto) {
                                    return new Promise(function (fulfill, reject) {
                                        reject('No se pueden realizar ingresos de apertura desde egresos.');
                                    });
                                } else {
                                    return Clase.find({
                                        where: { nombre_corto: 'PTRAN' }
                                    }).then(function (COBRO) {
                                        if (COBRO.id === req.body.concepto) {
                                            return sequelize.query(
                                                "SELECT agil_cuenta_transaccion.saldo  \
                                                 from agil_cuenta_transaccion where id = (select MAX(agil_cuenta_transaccion.id) from agil_cuenta_transaccion where cuenta = "+ req.body.cuenta + " and empresa =" + req.params.id_empresa + ")",
                                                { type: sequelize.QueryTypes.SELECT, transaction: t }
                                            ).then(function (transaccion) {
                                                return Clase.find({
                                                    where: { nombre_corto: 'EN_TRANSITO' },
                                                    transaction: t
                                                }).then(function (estadoEnTransito) {
                                                    return CuentaTransaccion.create({
                                                        fecha: req.body.fecha,
                                                        id_cuenta: req.body.cuenta,
                                                        detalle: req.body.detalle,
                                                        id_cliente: (req.body.compra !== null && req.body.compra !== undefined) ? req.body.compra.id_cliente : null,
                                                        id_concepto: req.body.concepto,
                                                        observaciones: req.body.observacion,
                                                        ref_doc: req.body.ref_doc,
                                                        tipo_doc: req.body.tipo_doc,
                                                        debe: req.body.debe,
                                                        haber: req.body.haber,
                                                        saldo: ((req.body.debe * -1) + transaccion[0].saldo),
                                                        id_estado: estadoEnTransito.id,
                                                        id_empresa: req.params.id_empresa,
                                                        eliminado: false,
                                                        id_usuario: req.params.id_usuario
                                                    }, {
                                                            transaction: t
                                                        }).then(function (transaccionRegistrada) {
                                                            return TransaccionSeguimiento.create({
                                                                id_transaccion: transaccionRegistrada.id,
                                                                proveedor: false,
                                                                id_entregado: null,
                                                                id_devuelto: null,
                                                                fecha_entraga: null,
                                                                fecha_devuelto: null,
                                                                id_empresa: req.params.id_empresa,
                                                                eliminado: false
                                                            }, { transaction: t }).then(function (seguimientoCreado) {
                                                                return Compra.find({
                                                                    where: { id: req.body.compra.id },
                                                                    include: [{
                                                                        model: Almacen, as: 'almacen',
                                                                        include: [{ model: Sucursal, as: 'sucursal' }]
                                                                    }],
                                                                    transaction: t
                                                                }).then(function (compraEncontrada) {
                                                                    return Compra.update({
                                                                        a_cuenta: compraEncontrada.a_cuenta + req.body.debe,
                                                                        saldo: compraEncontrada.total - (compraEncontrada.a_cuenta + req.body.debe)
                                                                    }, {
                                                                            where: {
                                                                                id: compraEncontrada.id
                                                                            },
                                                                            transaction: t
                                                                        }).then(function (affectedRows) {
                                                                            return PagoCompra.create({
                                                                                id_compra: compraEncontrada.id,
                                                                                a_cuenta_anterior: compraEncontrada.a_cuenta,
                                                                                saldo_anterior: compraEncontrada.saldo,
                                                                                monto_pagado: req.body.debe,
                                                                                id_usuario: req.params.id_usuario,
                                                                                numero_documento: compraEncontrada.almacen.sucursal.nota_recibo_correlativo
                                                                            }, {
                                                                                    transaction: t
                                                                                }).then(function (pagoCompraCreada) {
                                                                                    return Sucursal.update({
                                                                                        nota_recibo_correlativo: compraEncontrada.almacen.sucursal.nota_recibo_correlativo + 1
                                                                                    }, {
                                                                                            where: {
                                                                                                id: compraEncontrada.almacen.sucursal.id
                                                                                            },
                                                                                            transaction: t
                                                                                        }).then(function (affectedRows) {
                                                                                            return new Promise(function (fulfill, reject) {
                                                                                                fulfill(affectedRows);
                                                                                            });
                                                                                        });
                                                                                });
                                                                        });
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
                                                reject('No se puede hacer el egreso con concepto de cobro (ingreso).');
                                            });
                                        }
                                    }).catch(function (err) {
                                        return new Promise(function (fulfill, reject) {
                                            reject((err.stack !== undefined) ? err.stack : err);
                                        });
                                    })
                                }
                            } else {
                                return new Promise(function (fulfill, reject) {
                                    reject('No se pueden realizar egresos, la cuenta no cuenta con saldo inicial.');
                                });
                            }
                        }).catch(function (err) {
                            return new Promise(function (fulfill, reject) {
                                reject((err.stack !== undefined) ? err.stack : err);
                            });
                        })
                    })
                )
                return Promise.all(promisse);
            }).then(function (transaccionCreada) {
                if (transaccionCreada !== undefined) {
                    res.json({ mensaje: 'Transacción completada.' })
                } else {
                    throw new Error('Se produjo un error y no se puede asegurar los datos, los cambios fueron revertidos.');
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
            })
        });

    //Start paginador
    router.route('/transacciones/bancos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/nombre/:texto_nombre/cta/:id_cuenta/desde/:desde/hasta/:hasta/concepto/:concepto/ref_doc/:ref_doc/tipo_doc/:tipo_doc/estado/:estado')
        .get(ensureAuthorizedAdministrador, function (req, res) {
            var condicionTransaccion = {};
            var clientes = []
            var proveedores = []
            condicionTransaccion.id_empresa = req.params.id_empresa
            var condicionNombre = { razon_social: { $like: '%' + '%' } }

            if (req.params.id_cuenta != 0) {
                condicionTransaccion.id_cuenta = req.params.id_cuenta
            }
            if (req.params.concepto != 0) {
                condicionTransaccion.concepto = req.params.concepto
            }
            if (req.params.ref_doc != 0) {
                condicionTransaccion.ref_doc = { $like: '%' + req.params.ref_doc + '%' }
            }
            if (req.params.tipo_doc != 0) {
                condicionTransaccion.tipo_doc = req.params.tipo_doc
            }
            if (req.params.estado != 0) {
                condicionTransaccion.estado = req.params.estado
            }
            var desde = false
            var hasta = false
            if (req.params.desde != "0") {
                var inicio = new Date(req.params.desde.split('/').reverse()); inicio.setHours(4, 0, 0, 0, 0);
                desde = true
            }
            if (req.params.hasta != "0") {
                var fin = new Date(req.params.hasta.split('/').reverse()); fin.setHours(19, 0, 0, 0, 0);
                hasta = true
            }
            if (desde && hasta) {
                condicionTransaccion.fecha = { $between: [inicio, fin] }

            } else if (desde && !hasta) {
                condicionTransaccion.fecha = {
                    $gte: [inicio]
                }
            } else if (!desde && hasta) {
                condicionTransaccion.fecha = {
                    $lte: [fin]
                }
            } else if (!desde && !hasta) {
                // var hoy = new Date()
                // condicion.fecha = {
                // }
            }
            if (req.params.texto_nombre != 0) {
                var ids = []
                condicionNombre.razon_social = { $like: '%' + req.params.texto_nombre + '%' }
                Cliente.findAll({
                    where: condicionNombre,
                    include: [
                        { model: CuentaTransaccion, as: 'transacciones' }
                    ]
                }).then(function (clientes) {
                    Proveedor.findAll({
                        where: condicionNombre,
                        include: [
                            { model: CuentaTransaccion, as: 'transacciones' }
                        ]
                    }).then(function (proveedores) {
                        var transIds = []
                        var transCli = []
                        var vproveedores = []
                        var transProv = []
                        clientes.map(function (cliente) {
                            transCli = cliente.transacciones.map(function (transaccion) {
                                return transaccion.id
                            })
                            Array.prototype.push.apply(transIds, transCli)
                        })
                        proveedores.map(function (proveedor) {
                            transProv = proveedor.transacciones.map(function (transaccion) {
                                return transacciones.id
                            })
                            Array.prototype.push.apply(transIds, transProv)
                        })
                        condicionTransaccion.id = { $in: transIds }
                        // if (clientes.length > 0) {
                        //     var vclientes = clientes.map(function (cliente) {
                        //         return cliente.id
                        //     })
                        //     Array.prototype.push.apply(ids, vclientes)
                        // }
                        // if (proveedores.length > 0) {
                        //     var vproveedores = proveedores.map(function (proveedor) {
                        //         return proveedor.id
                        //     })
                        //     Array.prototype.push.apply(ids, vproveedores)
                        // }

                        CuentaTransaccion.findAndCountAll({
                            where: condicionTransaccion,
                            include: [
                                {
                                    model: Cliente, as: 'cliente', where: { id: { $in: ids } }, required: false,
                                    include: [{ model: ClienteRazon, as: 'clientes_razon' }]
                                },
                                {
                                    model: Proveedor, as: 'proveedor', where: { id: { $in: ids } }, required: false,
                                    include: [{ model: ProveedorCuenta, as: 'proveedorCuenta' }]
                                }
                            ]
                        }).then(function (data) {
                            CuentaTransaccion.findAll({
                                offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                                where: condicionTransaccion,
                                include: [
                                    {
                                        model: Banco, as: 'cuenta',
                                        include: [{ model: Clase, as: 'tipoCuenta' }, { model: Clase, as: 'tipoMoneda' }]
                                    },
                                    {
                                        model: Cliente, as: 'cliente',
                                        include: [{ model: ClienteRazon, as: 'clientes_razon' }]
                                    },
                                    {
                                        model: Proveedor, as: 'proveedor',
                                        include: [{ model: ProveedorCuenta, as: 'proveedorCuenta' }]
                                    },
                                    {
                                        model: Clase, as: 'concepto'
                                    },
                                    {
                                        model: Clase, as: 'tipo_documento'
                                    },
                                    {
                                        model: Clase, as: 'estado'
                                    },
                                    {
                                        model: TransaccionSeguimiento, as: 'seguimientos',
                                        include: [{ model: MedicoPaciente, as: 'entregado_por' }, { model: MedicoPaciente, as: 'devuelto_a' }]
                                    }
                                ],
                                order: [['id', 'asc']]
                            }).then(function (transacciones) {
                                res.json({ transacciones: transacciones, paginas: Math.ceil(data.count / req.params.items_pagina) });
                            }).catch(function (err) {
                                res.json({ mensaje: err.stack, paginas: 0, hasErr: true, transacciones: [] });
                            })
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack, paginas: 0, hasErr: true, transacciones: [] });
                        })
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack, paginas: 0, hasErr: true, transacciones: [] });
                    })
                }).catch(function (err) {
                    res.json({ mensaje: err.stack, paginas: 0, hasErr: true, transacciones: [] });
                })
            } else {
                CuentaTransaccion.findAndCountAll({
                    where: condicionTransaccion,
                }).then(function (data) {
                    CuentaTransaccion.findAll({
                        offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                        where: condicionTransaccion,
                        include: [
                            {
                                model: Banco, as: 'cuenta',
                                include: [{ model: Clase, as: 'tipoCuenta' }, { model: Clase, as: 'tipoMoneda' }]
                            },
                            {
                                model: Cliente, as: 'cliente',
                                include: [{ model: ClienteRazon, as: 'clientes_razon', required: false }]
                            },
                            {
                                model: Proveedor, as: 'proveedor',
                                include: [{ model: ProveedorCuenta, as: 'proveedorCuenta', required: false }]
                            },
                            {
                                model: Clase, as: 'concepto'
                            },
                            {
                                model: Clase, as: 'tipo_documento'
                            },
                            {
                                model: Clase, as: 'estado'
                            },
                            {
                                model: TransaccionSeguimiento, as: 'seguimientos',
                                include: [{ model: MedicoPaciente, as: 'entregado_por' }, { model: MedicoPaciente, as: 'devuelto_a' }]
                            }
                        ],
                        order: [['id', 'asc']]
                    }).then(function (transacciones) {
                        res.json({ transacciones: transacciones, paginas: Math.ceil(data.count / req.params.items_pagina) });
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack, paginas: 0, hasErr: true, transacciones: [] });
                    })
                }).catch(function (err) {
                    res.json({ mensaje: err.stack, paginas: 0, hasErr: true, transacciones: [] });
                })
            }
        });
    //End paginador
    router.route('/transacciones/seguimiento/bancos/empresa/:id_empresa/:id_usuario')
        .post(function (req, res) {
            TransaccionSeguimiento.update({
                proveedor: req.body.proveedor,
                id_entregado: req.body.id_entregado,
                id_devuelto: req.body.id_devuelto,
                fecha_entrega: req.body.fecha_entrega,
                fecha_devolucion: req.body.fecha_devolucion,
                id_empresa: req.params.id_empresa,
                id_usuario: req.params.id_usuario,
                eliminado: false
            }, {
                    where: { id: req.body.id }
                }).then(function (seguimientoActualizado) {
                    res.json({ mensaje: 'Seguimiento actualizado correctamente.' })
                }).catch(function (err) {
                    res.json({ mensaje: err.stack, hasErr: true });
                })
        })


    router.route('/transacciones/bancos/:id_banco')
        .get(ensureAuthorizedAdministrador, function (req, res) {
            Banco.find({
                where: {
                    id: req.params.id_banco
                },
                include: [{ model: Clase, as: 'tipoCuenta' }, { model: Clase, as: 'tipoMoneda' }]
            }).then(function (entity) {
                res.json(entity);
            });
        })

        .put(function (req, res) {
            Banco.update({
                nombre: req.body.nombre,
                id_empresa: req.body.id_empresa,
                numero: req.body.numero,
                id_tipo_cuenta: req.body.tipoCuenta.id,
                id_tipo_moneda: req.body.tipoMoneda.id
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function (bancoActualizado) {
                    res.json({ "message": "Actualizado Satisfactoriamente!" });
                });
        })

        .delete(ensureAuthorizedAdministrador, function (req, res) {

        });

    router.route('/transacciones/seguimiento/Estados/empresa') ///:id_empresa/:id_usuario/:id_estado
        .put(function (req, res) {
            Clase.find({
                where: { id: req.body.id_estado }
            }).then(function (estado) {
                if (estado) {
                    CuentaTransaccion.update({
                        id_estado: estado.id,
                        // id_empresa: req.params.id_empresa,
                        // id_usuario: req.params.id_usuario,
                        // eliminado: false
                    }, {
                            where: { id: req.body.id }
                        }).then(function (seguimientoActualizado) {
                            res.json({ mensaje: 'Estado actualizado correctamente.' })
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack, hasErr: true });
                        })
                } else {
                    res.json({ mensaje: 'No se puede cambiar la información de estado, porque no se encuentra la nueva información de estado.' })
                }

            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true });
            })

        })
    router.route('/transacciones/revision/Estados/empresa') ///:id_empresa/:id_usuario/:id_trans
        .put(function (req, res) {
            CuentaTransaccion.find({
                where: { id: req.body.id_trans },
                include: [
                    {
                        model: Clase, as: 'estado'
                    }
                ]
            }).then(function (transaccion) {
                Clase.find({
                    where: { id: transaccion.estado.id }
                }).then(function (estado) {
                    if (estado.nombre === "CONFIRMADO") {
                        CuentaTransaccion.update({
                            cerrada: true,
                            // id_empresa: req.params.id_empresa,
                            id_usuario: req.body.id_usuario,
                            // eliminado: false
                        }, {
                                where: { id: transaccion.id, id_empresa: req.body.id_empresa }
                            }).then(function (seguimientoActualizado) {
                                res.json({ mensaje: 'Transacción cerrada correctamente.' })
                            }).catch(function (err) {
                                res.json({ mensaje: err.stack, hasErr: true });
                            })
                    } else {
                        res.json({ mensaje: 'No se puede cerrar, la transacción no esta confirmada.' })
                    }
                })
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true });
            })
        })

    router.route('/transacciones/saldo/cuenta/empresa/:id_empresa/:id_cuenta/:fecha_desde/:fecha_hasta')
        .get(function (req, res) {
            var desde = req.params.fecha_desde.split('/').reverse()//new Date(req.params.fecha_desde.split('/')[2],req.params.fecha_desde.split('/')[1] -1, req.params.fecha_desde.split('/')[0])
            var hasta = req.params.fecha_hasta.split('/').reverse()//new Date(req.params.fecha_hasta.split('/')[2],req.params.fecha_hasta.split('/')[1] -1, req.params.fecha_hasta.split('/')[0]-1)
            sequelize.query("SELECT MAX(agil_cuenta_transaccion.id), agil_cuenta_transaccion.saldo from agil_cuenta_transaccion where empresa =" + req.params.id_empresa + " and fecha BETWEEN '" + desde + "' and '" + hasta +"'", { type: sequelize.QueryTypes.SELECT })
                .then(function (dato) {
                    res.json({ cuenta: dato });
                }).catch(function (err) {
                    res.json({ mensaje: err.stack })
                })
        });

    router.route('/transacciones/saldo/disponible/empresa/:id_empresa/:id_cuenta/:fecha_desde/:fecha_hasta')
        .get(function (req, res) {
            
            var saldoDisponible = 0
            sequelize.query("SELECT MIN(agil_cuenta_transaccion.id) as id, agil_cuenta_transaccion.debe, agil_cuenta_transaccion.haber, agil_cuenta_transaccion.saldo \
             from agil_cuenta_transaccion where cuenta = "+req.params.id_cuenta+" and empresa =" + req.params.id_empresa + " and concepto in (select id from gl_clase where nombre_corto ='SAL_INICIAL')", { type: sequelize.QueryTypes.SELECT })
                .then(function (saldoInicial) {
                    sequelize.query("SELECT agil_cuenta_transaccion.id, agil_cuenta_transaccion.debe, agil_cuenta_transaccion.haber, agil_cuenta_transaccion.saldo \
                     from agil_cuenta_transaccion where empresa =" + req.params.id_empresa + " and estado in (select id from gl_clase where nombre_corto = 'CONFIRMADO') and concepto in (select id from gl_clase where nombre_corto ='PTRAN' or nombre_corto = 'CTRAN')", { type: sequelize.QueryTypes.SELECT })
                        .then(function (transaccionesConfirmadas) {
                            saldoDisponible += saldoInicial[0].saldo
                            if (transaccionesConfirmadas.length > 0) {
                                transaccionesConfirmadas.forEach(function(transaccion, indx) {
                                    if (transaccion.debe !== null) {
                                        saldoDisponible -= transaccion.debe
                                    } else if(transaccion.haber !== null) {
                                        saldoDisponible += transaccion.haber
                                    }
                                    if (indx === transaccionesConfirmadas.length -1) {
                                        res.json({ saldo: saldoDisponible });
                                    }
                                });
                            }
                            
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack, hasErr: true })
                        })
                    // res.json({ cuenta: dato });
                }).catch(function (err) {
                    res.json({ mensaje: err.stack })
                })

            // sequelize.query("SELECT MAX(agil_cuenta_transaccion.id), agil_cuenta_transaccion.saldo from agil_cuenta_transaccion where empresa =" + req.params.id_empresa + " and fecha BETWEEN " + ayer + " and " + hoy + "and estado = (select id from gl_clase where nombre_corto = CONFIRMADO)", { type: sequelize.QueryTypes.SELECT })
            //     .then(function (dato) {
            //         res.json({ cuenta: dato });
            //     }).catch(function (err) {
            //         res.json({ mensaje: err.stack })
            //     })
        });

}