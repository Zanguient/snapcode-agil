module.exports = function (router, ensureAuthorizedAdministrador, fs, forEach, jwt, md5, Banco, Clase, TransaccionSeguimiento, CuentaTransaccion, Cliente, ClienteRazon,
    MedicoPaciente, Persona, sequelize, Proveedor, ProveedorCuenta, Venta, Almacen, Sucursal, PagoVenta, PagoCompra, Compra, Proforma) {

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

    function crearTransaccionIngreso(req, t, estado, transaccion) {
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
            factura: req.body.factura,
            id_estado: estado.id,
            id_empresa: req.params.id_empresa,
            eliminado: false,
            cerrada: false,
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
                    return new Promise(function (fulfill, reject) {
                        fulfill(seguimientoCreado);
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
    }

    router.route('/transacciones/ingreso/bancos/empresa/:id_empresa/:id_usuario')
        .post(ensureAuthorizedAdministrador, function (req, res) {
            var promisse = []
            var ventaRes = {}
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
                                                    return CuentaTransaccion.find({
                                                        where: {
                                                            factura: req.body.factura,
                                                            id_concepto: req.body.concepto,
                                                            id_empresa: req.params.id_empresa
                                                        }
                                                    }).then(function (transaccionEncontrada) {
                                                        var continuar = true
                                                        if (transaccionEncontrada) {
                                                            if (!req.body.venta.es_proforma) {
                                                                return Venta.find({
                                                                    where: { id: req.body.venta.id },
                                                                    include: [{
                                                                        model: Almacen, as: 'almacen',
                                                                        include: [{ model: Sucursal, as: 'sucursal' }]
                                                                    }],
                                                                    transaction: t
                                                                }).then(function (ventaEncontrada) {
                                                                    if (ventaEncontrada.saldo > 0 && req.body.haber <= ventaEncontrada.saldo) {
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
                                                                                }, {
                                                                                        transaction: t
                                                                                    }).then(function (detalleVentaCreada) {
                                                                                        return Sucursal.update({
                                                                                            nota_recibo_correlativo: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo + 1
                                                                                        }, {
                                                                                                where: {
                                                                                                    id: ventaEncontrada.almacen.sucursal.id
                                                                                                },
                                                                                                transaction: t
                                                                                            }).then(function (affectedRows) {
                                                                                                return crearTransaccionIngreso(req, t, estadoEnTransito, transaccion)
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
                                                                    } else if (ventaEncontrada.saldo === 0) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción el saldo por cobrar es 0');
                                                                        });
                                                                    } else if (req.body.haber > ventaEncontrada.saldo) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción el pago es mayor al saldo por cobrar.');
                                                                        });
                                                                    } else {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción hubo un error desconocido. Rutas transacciones LN - 261');
                                                                        });
                                                                    }
                                                                }).catch(function (err) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                                    });
                                                                })
                                                            } else {
                                                                return Proforma.find({
                                                                    where: { id: req.body.venta.id },
                                                                    include: [{ model: Sucursal, as: 'sucursal' }], transaction: t
                                                                }).then(function (proformaEncontrada) {
                                                                    var a_cuenta = (proformaEncontrada.dataValues.a_cuenta ? proformaEncontrada.dataValues.a_cuenta : 0 )+req.body.haber
                                                                    var saldoProforma = proformaEncontrada.totalImporteBs - ((proformaEncontrada.a_cuenta !== null && proformaEncontrada.a_cuenta !== undefined) ? proformaEncontrada.a_cuenta : 0)
                                                                    var saldoPosterior = saldoProforma - req.body.haber
                                                                    if (saldoProforma > 0 && req.body.haber <= saldoProforma && saldoPosterior == 0) {
                                                                        return Proforma.update({
                                                                            fecha_cobro: req.body.fecha,
                                                                            a_cuenta: a_cuenta
                                                                        }, {
                                                                                where: { id: req.body.venta.id },
                                                                                transaction: t
                                                                            }).then(function (proformaActualizada) {
                                                                                return crearTransaccionIngreso(req, t, estadoEnTransito, transaccion)
                                                                            }).catch(function (err) {
                                                                                return new Promise(function (fulfill, reject) {
                                                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                                                });
                                                                            });
                                                                    } else if (req.body.haber > saldoProforma) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('El monto excede el saldo por cobrar, la transaccion fué rechazada.');
                                                                        });
                                                                    } else if (saldoProforma == 0) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción el saldo por cobrar es 0.');
                                                                        });
                                                                    } else if (saldoProforma > 0 && req.body.haber <= saldoProforma && saldoPosterior > 0) {
                                                                        return Proforma.update({
                                                                            a_cuenta: req.body.haber
                                                                        }, {
                                                                                where: { id: req.body.venta.id },
                                                                                transaction: t
                                                                            }).then(function (proformaActualizada) {
                                                                                return crearTransaccionIngreso(req, t, estadoEnTransito, transaccion)
                                                                            }).catch(function (err) {
                                                                                return new Promise(function (fulfill, reject) {
                                                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                                                });
                                                                            });
                                                                    } else {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción hubo un error desconocido. Rutas transacciones LN - 313');
                                                                        });
                                                                    }
                                                                }).catch(function (err) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                                    });
                                                                })
                                                            }
                                                        } else {
                                                            if (!req.body.venta.es_proforma) {
                                                                return Venta.find({
                                                                    where: { id: req.body.venta.id },
                                                                    include: [{
                                                                        model: Almacen, as: 'almacen',
                                                                        include: [{ model: Sucursal, as: 'sucursal' }]
                                                                    }],
                                                                    transaction: t
                                                                }).then(function (ventaEncontrada) {
                                                                    if (ventaEncontrada.saldo > 0 && req.body.haber <= ventaEncontrada.saldo) {
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
                                                                                }, {
                                                                                        transaction: t
                                                                                    }).then(function (detalleVentaCreada) {
                                                                                        return Sucursal.update({
                                                                                            nota_recibo_correlativo: ventaEncontrada.almacen.sucursal.nota_recibo_correlativo + 1
                                                                                        }, {
                                                                                                where: {
                                                                                                    id: ventaEncontrada.almacen.sucursal.id
                                                                                                },
                                                                                                transaction: t
                                                                                            }).then(function (affectedRows) {
                                                                                                return crearTransaccionIngreso(req, t, estadoEnTransito, transaccion)
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
                                                                    } else if (ventaEncontrada.saldo === 0) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción el saldo por cobrar es 0');
                                                                        });
                                                                    } else if (req.body.haber - 0.005 > ventaEncontrada.saldo) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción el pago es mayor al saldo por cobrar.');
                                                                        });
                                                                    } else {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción hubo un error desconocido. Rutas transacciones LN - 261');
                                                                        });
                                                                    }
                                                                }).catch(function (err) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                                    });
                                                                })
                                                            } else {
                                                                return Proforma.find({
                                                                    where: { id: req.body.venta.id },
                                                                    include: [{ model: Sucursal, as: 'sucursal' }], transaction: t
                                                                }).then(function (proformaEncontrada) {
                                                                    var a_cuenta = (proformaEncontrada.dataValues.a_cuenta ? proformaEncontrada.dataValues.a_cuenta : 0 )+req.body.haber
                                                                    var saldoProforma = proformaEncontrada.dataValues.totalImporteBs - ((proformaEncontrada.dataValues.a_cuenta !== null && proformaEncontrada.a_cuenta !== undefined) ? proformaEncontrada.dataValues.a_cuenta : 0)
                                                                    var saldoPosterior = saldoProforma - req.body.haber
                                                                    if (saldoProforma > 0 && req.body.haber <= saldoProforma && saldoPosterior == 0) {
                                                                        return Proforma.update({
                                                                            fecha_cobro: req.body.fecha,
                                                                            a_cuenta: a_cuenta
                                                                        }, {
                                                                                where: { id: req.body.venta.id },
                                                                                transaction: t
                                                                            }).then(function (proformaActualizada) {
                                                                                return crearTransaccionIngreso(req, t, estadoEnTransito, transaccion)
                                                                            }).catch(function (err) {
                                                                                return new Promise(function (fulfill, reject) {
                                                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                                                });
                                                                            });
                                                                    } else if (req.body.haber > saldoProforma) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('El monto excede el saldo por cobrar, la transaccion fué rechazada.');
                                                                        });
                                                                    } else if (saldoProforma == 0) {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción el saldo por cobrar es 0.');
                                                                        });
                                                                    } else if (saldoProforma > 0 && req.body.haber <= saldoProforma && saldoPosterior > 0) {
                                                                        return Proforma.update({
                                                                            a_cuenta: a_cuenta
                                                                        }, {
                                                                                where: { id: req.body.venta.id },
                                                                                transaction: t
                                                                            }).then(function (proformaActualizada) {
                                                                                return crearTransaccionIngreso(req, t, estadoEnTransito, transaccion)
                                                                            }).catch(function (err) {
                                                                                return new Promise(function (fulfill, reject) {
                                                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                                                });
                                                                            });
                                                                    } else {
                                                                        return new Promise(function (fulfill, reject) {
                                                                            reject('No se puede realizar la transacción hubo un error desconocido. Rutas transacciones LN - 313');
                                                                        });
                                                                    }
                                                                }).catch(function (err) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject((err.stack !== undefined) ? err.stack : err);
                                                                    });
                                                                })
                                                            }
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
                                            id_concepto: req.body.concepto,
                                            observaciones: req.body.observacion,
                                            ref_doc: req.body.ref_doc,
                                            tipo_doc: req.body.tipo_doc,
                                            saldo: req.body.haber,
                                            id_estado: estadoConfirmado.id,
                                            id_empresa: req.params.id_empresa,
                                            eliminado: false,
                                            cerrada: true,
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
                    if (req.body.venta) {
                        if (req.body.venta.es_proforma) {
                            Proforma.find({
                                where: {
                                    id: req.body.venta.id
                                },
                                include: [{ model: Sucursal, as: 'sucursal' }, { model: Cliente, as: 'cliente' }]
                            }).then(function (proforma) {
                                proforma.dataValues.saldo = proforma.importe - proforma.a_cuenta
                                res.json({ mensaje: 'Transacción completada.', venta: proforma })
                            })
                        } else {
                            Venta.find({
                                where: { id: req.body.venta.id },
                                include: [{
                                    model: Almacen, as: 'almacen',
                                    include: [{ model: Sucursal, as: 'sucursal' }]
    
                                }, { model: Cliente, as: 'cliente' }]
                            }).then(function (ventaEncontrada) {
                                res.json({ mensaje: 'Transacción completada.', venta: ventaEncontrada })
                            })
                        }
                    } else {
                        res.json({ mensaje: 'Transacción completada.'})
                    }
                    
                } else {
                    throw new Error('Se produjo un error y no se puede asegurar los datos, los cambios fueron revertidos.');
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true })
            })
        })

    function crearTransaccionEgreso(req, t, estado, transaccion) {
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
            id_estado: estado.id,
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
                                                    return CuentaTransaccion.find({
                                                        where: {
                                                            factura: req.body.factura,
                                                            id_concepto: req.body.concepto,
                                                            id_empresa: req.params.id_empresa
                                                        }
                                                    }).then(function (transaccionEncontrada) {
                                                        if (transaccionEncontrada) {
                                                            return Compra.find({
                                                                where: { id: req.body.compra.id },
                                                                include: [{
                                                                    model: Almacen, as: 'almacen',
                                                                    include: [{ model: Sucursal, as: 'sucursal' }]
                                                                }],
                                                                transaction: t
                                                            }).then(function (compraEncontrada) {
                                                                if (compraEncontrada.saldo > 0 && req.body.debe <= compraEncontrada.saldo) {
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
                                                                                            return crearTransaccionEgreso(req, t, estadoEnTransito, transaccion)
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
                                                                } else if (compraEncontrada.saldo == 0) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject('No se pueden realizar la transaccion, el saldo por pagar es 0.');
                                                                    });
                                                                } else if (req.body.debe > compraEncontrada.saldo) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject('No se pueden realizar la transaccion, el saldo por pagar es menor al monto pagado.');
                                                                    });
                                                                } else {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject('No se pueden realizar la transaccion, error desconocido. rutas transacciones LN - 511');
                                                                    });
                                                                }
                                                            }).catch(function (err) {
                                                                return new Promise(function (fulfill, reject) {
                                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                                });
                                                            })
                                                        } else {
                                                            return Compra.find({
                                                                where: { id: req.body.compra.id },
                                                                include: [{
                                                                    model: Almacen, as: 'almacen',
                                                                    include: [{ model: Sucursal, as: 'sucursal' }]
                                                                }],
                                                                transaction: t
                                                            }).then(function (compraEncontrada) {
                                                                if (compraEncontrada.saldo > 0 && req.body.debe <= compraEncontrada.saldo) {
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
                                                                                            return crearTransaccionEgreso(req, t, estadoEnTransito, transaccion)
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
                                                                } else if (compraEncontrada.saldo == 0) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject('No se pueden realizar la transaccion, el saldo por pagar es 0.');
                                                                    });
                                                                } else if (req.body.debe > compraEncontrada.saldo) {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject('No se pueden realizar la transaccion, el saldo por pagar es menor al monto pagado.');
                                                                    });
                                                                } else {
                                                                    return new Promise(function (fulfill, reject) {
                                                                        reject('No se pueden realizar la transaccion, error desconocido. rutas transacciones LN - 511');
                                                                    });
                                                                }
                                                            }).catch(function (err) {
                                                                return new Promise(function (fulfill, reject) {
                                                                    reject((err.stack !== undefined) ? err.stack : err);
                                                                });
                                                            })
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
                condicionTransaccion.ref_doc = req.params.ref_doc
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
            if (req.params.items_pagina == 0) {
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
                            res.json({ transacciones: transacciones, paginas: 1 });
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack, paginas: 0, hasErr: true, transacciones: [] });
                        })
                    }).catch(function (err) {
                        res.json({ mensaje: err.stack, paginas: 0, hasErr: true, transacciones: [] });
                    })
                }
            } else {
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
                        cerrada: true
                    }, {
                            where: { id: req.body.id }
                        }).then(function (seguimientoActualizado) {
                            res.json({ mensaje: 'Estado actualizado correctamente.' })
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack, hasErr: true });
                        })
                } else {
                    res.json({ mensaje: 'No se puede cambiar la información de estado, porque no se encuentra la información de los estados.' })
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
            sequelize.query("SELECT MAX(agil_cuenta_transaccion.id), agil_cuenta_transaccion.saldo from agil_cuenta_transaccion where cuenta =" + req.params.id_cuenta + " and empresa =" + req.params.id_empresa + " and fecha BETWEEN '" + desde + "' and '" + hasta + "'", { type: sequelize.QueryTypes.SELECT })
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
             from agil_cuenta_transaccion where cuenta = "+ req.params.id_cuenta + " and empresa =" + req.params.id_empresa + " and concepto in (select id from gl_clase where nombre_corto ='SAL_INICIAL')", { type: sequelize.QueryTypes.SELECT })
                .then(function (saldoInicial) {
                    sequelize.query("SELECT agil_cuenta_transaccion.id, agil_cuenta_transaccion.debe, agil_cuenta_transaccion.haber, agil_cuenta_transaccion.saldo \
                     from agil_cuenta_transaccion where cuenta = "+ req.params.id_cuenta + " and empresa =" + req.params.id_empresa + " and estado in (select id from gl_clase where nombre_corto = 'CONFIRMADO') and concepto in (select id from gl_clase where nombre_corto ='PTRAN' or nombre_corto = 'CTRAN')", { type: sequelize.QueryTypes.SELECT })
                        .then(function (transaccionesConfirmadas) {
                            saldoDisponible += saldoInicial[0].saldo
                            if (transaccionesConfirmadas.length > 0) {
                                transaccionesConfirmadas.forEach(function (transaccion, indx) {
                                    if (transaccion.debe !== null) {
                                        saldoDisponible -= transaccion.debe
                                    } else if (transaccion.haber !== null) {
                                        saldoDisponible += transaccion.haber
                                    }
                                    if (indx === transaccionesConfirmadas.length - 1) {
                                        res.json({ saldo: saldoDisponible });
                                    }
                                });
                            } else {
                                res.json({ saldo: (saldoDisponible !== NaN) ? saldoDisponible : 0 });
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
    router.route('/transacciones/saldo/proformas/empresa/:id_empresa')
        .get(function (req, res) {
            var saldoDisponible = 0
            sequelize.query("SELECT gl_clase.id, gl_clase.nombre FROM gl_clase,gl_tipo where gl_tipo.nombre_corto='TIPA' and gl_clase.tipo=gl_tipo.id and gl_clase.nombre_corto= 'CRE'", { type: sequelize.QueryTypes.SELECT })
                .then(function (dato) {
                    sequelize.query("SELECT agil_proforma.id, agil_proforma.cliente,agil_cliente.razon_social, agil_proforma.factura, agil_proforma.monto, agil_proforma.a_cuenta, (agil_proforma.monto - agil_proforma.a_cuenta) as saldo  from agil_proforma LEFT JOIN agil_cliente ON agil_cliente.id = agil_proforma.cliente  where (agil_proforma.monto - agil_proforma.a_cuenta) > 0 and agil_proforma.empresa =" + req.params.id_empresa + " and agil_proforma.factura is not NULL and agil_proforma.eliminado = false and agil_proforma.tipo_pago = " + dato[0].id + " GROUP BY agil_proforma.id", { type: sequelize.QueryTypes.SELECT })
                        .then(function (proformas) {
                            res.json({ proformas: proformas })
                            // res.json({ cuenta: dato });
                        }).catch(function (err) {
                            res.json({ mensaje: err.stack })
                        })
                });



            // sequelize.query("SELECT MAX(agil_cuenta_transaccion.id), agil_cuenta_transaccion.saldo from agil_cuenta_transaccion where empresa =" + req.params.id_empresa + " and fecha BETWEEN " + ayer + " and " + hoy + "and estado = (select id from gl_clase where nombre_corto = CONFIRMADO)", { type: sequelize.QueryTypes.SELECT })
            //     .then(function (dato) {
            //         res.json({ cuenta: dato });
            //     }).catch(function (err) {
            //         res.json({ mensaje: err.stack })
            //     })
        });

}