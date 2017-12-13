module.exports = function (router, sequelize, Sequelize, Usuario, Producto, Diccionario, Clase, Sucursal, Empresa, ProductoBase, Almacen, ContabilidadCuenta, Persona,
    MantenimientoOrdenTrabajo, MantenimientoOrdenTrabajoManoObra, MantenimientoOrdenTrabajoMaterial, MantenimientoOrdenTrabajoServicioExterno, MantenimientoOrdenTrabajoSistema, Inventario, Clase, calendar) {

    router.route('/orden-de-trabajo/empresa/:id_empresa/correctivo/:correctivo/preventivo/:preventivo/rutina/:rutina/entrega/:entrega')
        .get(function (req, res) {
            1
            var condicionMantenimiento = {}
            var condicionProducto = { id_empresa: req.params.id_empresa }
            if (req.params.correctivo != "false") {
                if (req.params.preventivo != "false") {
                    if (req.params.rutina != "false") {
                        if (req.params.entrega != "false") {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.PREVENTIVO },
                                { nombre_corto: Diccionario.CORRECTIVO },
                                { nombre_corto: Diccionario.RUTINA },
                                { nombre_corto: Diccionario.ENTREGA }]
                            }
                        } else {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.PREVENTIVO },
                                { nombre_corto: Diccionario.CORRECTIVO },
                                { nombre_corto: Diccionario.RUTINA }]
                            }
                        }
                    } else {
                        if (req.params.entrega != "false") {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.PREVENTIVO },
                                { nombre_corto: Diccionario.CORRECTIVO },
                                { nombre_corto: Diccionario.ENTREGA }]
                            }
                        } else {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.PREVENTIVO },
                                { nombre_corto: Diccionario.CORRECTIVO }]
                            }
                        }
                    }
                }
                else {
                    if (req.params.rutina != "false") {
                        if (req.params.entrega != "false") {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.CORRECTIVO },
                                { nombre_corto: Diccionario.RUTINA },
                                { nombre_corto: Diccionario.ENTREGA }]
                            }
                        } else {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.CORRECTIVO },
                                { nombre_corto: Diccionario.RUTINA }]
                            }
                        }
                    } else {
                        if (req.params.entrega != "false") {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.CORRECTIVO },
                                { nombre_corto: Diccionario.ENTREGA }]
                            }
                        } else {
                            condicionMantenimiento = { $or: [{ nombre_corto: Diccionario.CORRECTIVO }] }
                        }
                    }
                }
            } else {
                if (req.params.preventivo != "false") {
                    if (req.params.rutina != "false") {
                        if (req.params.entrega != "false") {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.PREVENTIVO },
                                { nombre_corto: Diccionario.RUTINA },
                                { nombre_corto: Diccionario.ENTREGA }]
                            }
                        } else {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.PREVENTIVO },
                                { nombre_corto: Diccionario.RUTINA }]
                            }
                        }
                    } else {
                        if (req.params.entrega != "false") {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.PREVENTIVO },
                                { nombre_corto: Diccionario.ENTREGA }]
                            }
                        } else {
                            condicionMantenimiento = { $or: [{ nombre_corto: Diccionario.PREVENTIVO }] }
                        }
                    }
                }
                else {
                    if (req.params.rutina != "false") {
                        if (req.params.entrega != "false") {
                            condicionMantenimiento = {
                                $or: [{ nombre_corto: Diccionario.RUTINA },
                                { nombre_corto: Diccionario.ENTREGA }]
                            }
                        } else {
                            condicionMantenimiento = { $or: [{ nombre_corto: Diccionario.RUTINA }] }
                        }
                    } else {
                        if (req.params.entrega != "false") {
                            condicionMantenimiento = { $or: [{ nombre_corto: Diccionario.ENTREGA }] }
                        } else {
                            condicionMantenimiento = {

                                id: null

                            }
                        }
                    }
                }
            }
            MantenimientoOrdenTrabajo.findAll({
                include: [{ model: Producto, as: 'producto', where: condicionProducto },
                { model: Clase, as: 'tipoMantenimiento', where: condicionMantenimiento }]
            }).then(function (Encontrado) {
                res.json(Encontrado)
            })
        })

    router.route('/orden-de-trabajo/empresa')
        .put(function (req, res) {
            MantenimientoOrdenTrabajo.update({
                //id_producto: req.body.vehiculo.id,
                observacion: req.body.observacion,
                diagnostico: req.body.diagnostico,
                id_prioridad: req.body.id_prioridad,
                // tiempo_estimado: req.body.tiempo_estimado,
                fecha_hora_aviso: req.body.fecha_hora_aviso,
                fecha_hora_inicio: req.body.fecha_hora_inicio,
                fecha_hora_fin: req.body.fecha_hora_fin,
                //id_tipo_mantenimiento: req.body.tipo_mantenimiento,
            }, {
                    where: { id: req.body.id }
                }).then(function (OrdenTrabajoActualizada) {
                    req.body.manosDeObra.forEach(function (manoDeObra, index, array) {
                        if (manoDeObra.id) {
                            MantenimientoOrdenTrabajoManoObra.update({
                                // id_orden_trabajo: OrdenTrabajoActualizada.id,
                                id_especialidad: manoDeObra.especialidad.id,
                                fecha_inicio: manoDeObra.fecha_inicio,
                                fecha_fin: manoDeObra.fecha_fin,
                                diagnostico: manoDeObra.diagnostico,
                                id_persona: manoDeObra.encargado.id
                            }, {
                                    where: {
                                        id: manoDeObra.id
                                    }
                                }).then(function (ManoDeObraActualizada) {
                                    if (index == (array.length - 1)) {
                                        req.body.materiales.forEach(function (material, index2, array2) {
                                            if (material.id) {
                                                MantenimientoOrdenTrabajoMaterial.update({
                                                    //id_orden_trabajo: OrdenTrabajoActualizada.id,
                                                    id_producto: material.producto.id,
                                                    cantidad: material.cantidad,
                                                    importe: material.total,
                                                }, {
                                                        where: {
                                                            id: material.id
                                                        }
                                                    }).then(function (MaterialCreado) {
                                                        if (index2 == (array2.length - 1)) {
                                                            req.body.serviciosExternos.forEach(function (servicioExterno, index3, array3) {
                                                                if (servicioExterno.id) {
                                                                    MantenimientoOrdenTrabajoServicioExterno.update({
                                                                        //id_orden_trabajo: OrdenTrabajoActualizada.id,
                                                                        empresa: servicioExterno.empresa,
                                                                        servicio: servicioExterno.servicio,
                                                                        fecha_inicio: servicioExterno.fecha_inicio,
                                                                        fecha_fin: servicioExterno.fecha_fin,
                                                                    }, {
                                                                            where: {
                                                                                id: servicioExterno.id
                                                                            }
                                                                        }).then(function (ServicioExternoCreado) {
                                                                            if (index3 == (array3.length - 1)) {
                                                                                res.json({ message: "Orden de trabajo actualizada satisfactoriamente!" })
                                                                            }
                                                                        })
                                                                } else {
                                                                    MantenimientoOrdenTrabajoServicioExterno.create({
                                                                        id_orden_trabajo: req.body.id,
                                                                        empresa: servicioExterno.empresa,
                                                                        servicio: servicioExterno.servicio,
                                                                        fecha_inicio: servicioExterno.fecha_inicio,
                                                                        fecha_fin: servicioExterno.fecha_fin,
                                                                    }, {
                                                                            where: {
                                                                                id: servicioExterno.id
                                                                            }
                                                                        }).then(function (ServicioExternoCreado) {
                                                                            if (index3 == (array3.length - 1)) {
                                                                                res.json({ message: "Orden de trabajo actualizada satisfactoriamente!" })
                                                                            }
                                                                        })
                                                                }
                                                            }, this);
                                                        }
                                                    })
                                            } else {
                                                MantenimientoOrdenTrabajoMaterial.create({
                                                    id_orden_trabajo: req.body.id,
                                                    id_producto: material.producto.id,
                                                    cantidad: material.cantidad,
                                                    importe: material.total,
                                                }).then(function (MaterialCreado) {
                                                    if (index2 == (array2.length - 1)) {
                                                        req.body.serviciosExternos.forEach(function (servicioExterno, index3, array3) {
                                                            if (servicioExterno.id) {
                                                                MantenimientoOrdenTrabajoServicioExterno.update({
                                                                    //id_orden_trabajo: OrdenTrabajoActualizada.id,
                                                                    empresa: servicioExterno.empresa,
                                                                    servicio: servicioExterno.servicio,
                                                                    fecha_inicio: servicioExterno.fecha_inicio,
                                                                    fecha_fin: servicioExterno.fecha_fin,
                                                                }, {
                                                                        where: {
                                                                            id: servicioExterno.id
                                                                        }
                                                                    }).then(function (ServicioExternoCreado) {
                                                                        if (index3 == (array3.length - 1)) {
                                                                            res.json({ message: "Orden de trabajo actualizada satisfactoriamente!" })
                                                                        }
                                                                    })
                                                            } else {
                                                                MantenimientoOrdenTrabajoServicioExterno.create({
                                                                    id_orden_trabajo: req.body.id,
                                                                    empresa: servicioExterno.empresa,
                                                                    servicio: servicioExterno.servicio,
                                                                    fecha_inicio: servicioExterno.fecha_inicio,
                                                                    fecha_fin: servicioExterno.fecha_fin,
                                                                }).then(function (ServicioExternoCreado) {
                                                                    if (index3 == (array3.length - 1)) {
                                                                        res.json({ message: "Orden de trabajo actualizada satisfactoriamente!" })
                                                                    }
                                                                })
                                                            }
                                                        }, this);
                                                    }
                                                })
                                            }
                                        }, this);
                                    }
                                })
                        } else {
                            MantenimientoOrdenTrabajoManoObra.create({
                                id_orden_trabajo: req.body.id,
                                id_especialidad: manoDeObra.especialidad.id,
                                fecha_inicio: manoDeObra.fecha_inicio,
                                fecha_fin: manoDeObra.fecha_fin,
                                diagnostico: manoDeObra.diagnostico,
                                id_persona: manoDeObra.encargado.id
                            }).then(function (ManoDeObraActualizada) {
                                if (index == (array.length - 1)) {
                                    req.body.materiales.forEach(function (material, index2, array2) {
                                        if (material.id) {
                                            MantenimientoOrdenTrabajoMaterial.update({
                                                //id_orden_trabajo: OrdenTrabajoActualizada.id,
                                                id_producto: material.producto.id,
                                                cantidad: material.cantidad,
                                                importe: material.total,
                                            }, {
                                                    where: {
                                                        id: material.id
                                                    }
                                                }).then(function (MaterialCreado) {
                                                    if (index2 == (array2.length - 1)) {
                                                        req.body.serviciosExternos.forEach(function (servicioExterno, index3, array3) {
                                                            if (servicioExterno.id) {
                                                                MantenimientoOrdenTrabajoServicioExterno.update({
                                                                    //id_orden_trabajo: OrdenTrabajoActualizada.id,
                                                                    empresa: servicioExterno.empresa,
                                                                    servicio: servicioExterno.servicio,
                                                                    fecha_inicio: servicioExterno.fecha_inicio,
                                                                    fecha_fin: servicioExterno.fecha_fin,
                                                                }, {
                                                                        where: {
                                                                            id: servicioExterno.id
                                                                        }
                                                                    }).then(function (ServicioExternoCreado) {
                                                                        if (index3 == (array3.length - 1)) {
                                                                            res.json({ message: "Orden de trabajo actualizada satisfactoriamente!" })
                                                                        }
                                                                    })
                                                            } else {
                                                                MantenimientoOrdenTrabajoServicioExterno.create({
                                                                    id_orden_trabajo: req.body.id,
                                                                    empresa: servicioExterno.empresa,
                                                                    servicio: servicioExterno.servicio,
                                                                    fecha_inicio: servicioExterno.fecha_inicio,
                                                                    fecha_fin: servicioExterno.fecha_fin,
                                                                }, {
                                                                        where: {
                                                                            id: servicioExterno.id
                                                                        }
                                                                    }).then(function (ServicioExternoCreado) {
                                                                        if (index3 == (array3.length - 1)) {
                                                                            res.json({ message: "Orden de trabajo actualizada satisfactoriamente!" })
                                                                        }
                                                                    })
                                                            }
                                                        }, this);
                                                    }
                                                })
                                        } else {
                                            MantenimientoOrdenTrabajoMaterial.create({
                                                id_orden_trabajo: req.body.id,
                                                id_producto: material.producto.id,
                                                cantidad: material.cantidad,
                                                importe: material.total,
                                            }).then(function (MaterialCreado) {
                                                if (index2 == (array2.length - 1)) {
                                                    req.body.serviciosExternos.forEach(function (servicioExterno, index3, array3) {
                                                        if (servicioExterno.id) {
                                                            MantenimientoOrdenTrabajoServicioExterno.update({
                                                                //id_orden_trabajo: OrdenTrabajoActualizada.id,
                                                                empresa: servicioExterno.empresa,
                                                                servicio: servicioExterno.servicio,
                                                                fecha_inicio: servicioExterno.fecha_inicio,
                                                                fecha_fin: servicioExterno.fecha_fin,
                                                            }, {
                                                                    where: {
                                                                        id: servicioExterno.id
                                                                    }
                                                                }).then(function (ServicioExternoCreado) {
                                                                    if (index3 == (array3.length - 1)) {
                                                                        res.json({ message: "Orden de trabajo actualizada satisfactoriamente!" })
                                                                    }
                                                                })
                                                        } else {
                                                            MantenimientoOrdenTrabajoServicioExterno.create({
                                                                id_orden_trabajo: req.body.id,
                                                                empresa: servicioExterno.empresa,
                                                                servicio: servicioExterno.servicio,
                                                                fecha_inicio: servicioExterno.fecha_inicio,
                                                                fecha_fin: servicioExterno.fecha_fin,
                                                            }).then(function (ServicioExternoCreado) {
                                                                if (index3 == (array3.length - 1)) {
                                                                    res.json({ message: "Orden de trabajo actualizada satisfactoriamente!" })
                                                                }
                                                            })
                                                        }
                                                    }, this);
                                                }
                                            })
                                        }
                                    }, this);
                                }
                            })
                        }
                    }, this);
                })


        })
        .post(function (req, res) {
            MantenimientoOrdenTrabajo.create({
                id_producto: req.body.vehiculo.id,
                observacion: req.body.observacion,
                diagnostico: req.body.diagnostico,
                id_prioridad: req.body.id_prioridad,
                tiempo_estimado: req.body.tiempo_estimado,
                fecha_hora_aviso: req.body.fecha_hora_aviso,
                fecha_hora_inicio: req.body.fecha_hora_inicio,
                fecha_hora_fin: req.body.fecha_hora_fin,
                id_tipo_mantenimiento: req.body.tipo_mantenimiento,
            }).then(function (OrdenTrabajoCreada) {
                req.body.ordenTrabajoManoObra.forEach(function (manoDeObra, index, array) {
                    MantenimientoOrdenTrabajoManoObra.create({
                        id_orden_trabajo: OrdenTrabajoCreada.id,
                        id_especialidad: manoDeObra.especialidad.id,
                        fecha_inicio: manoDeObra.fecha_inicio,
                        fecha_fin: manoDeObra.fecha_fin,
                        diagnostico: manoDeObra.diagnostico,
                        id_persona: manoDeObra.encargado.id
                    }).then(function (ManoDeObraCreada) {
                        if (index == (array.length - 1)) {
                            req.body.materiales.forEach(function (material, index2, array2) {
                                MantenimientoOrdenTrabajoMaterial.create({
                                    id_orden_trabajo: OrdenTrabajoCreada.id,
                                    id_producto: material.producto.id,
                                    cantidad: material.cantidad,
                                    importe: material.total,
                                }).then(function (MaterialCreado) {
                                    if (index2 == (array2.length - 1)) {
                                        req.body.servicioExterno.forEach(function (servicioExterno, index3, array3) {
                                            MantenimientoOrdenTrabajoServicioExterno.create({
                                                id_orden_trabajo: OrdenTrabajoCreada.id,
                                                empresa: servicioExterno.empresa,
                                                servicio: servicioExterno.servicio,
                                                fecha_inicio: servicioExterno.fecha_inicio,
                                                fecha_fin: servicioExterno.fecha_fin,
                                            }).then(function (ServicioExternoCreado) {
                                                if (index3 == (array3.length - 1)) {
                                                    req.body.sistemas.forEach(function (sistema, index4, array4) {
                                                        MantenimientoOrdenTrabajoSistema.create({
                                                            id_orden_trabajo: OrdenTrabajoCreada.id,
                                                            id_orden_trabajo_sistema: sistema
                                                        }).then(function name(params) {
                                                            if (index4 == (array4.length - 1)) {
                                                                res.json({ message: "nueva orden de trabajo creada satisfactoriamente!" })
                                                            }
                                                        })

                                                    }, this);

                                                }
                                            })

                                        }, this);
                                    }
                                })
                            }, this);
                        }
                    })
                }, this);
            })


        })
    router.route('/mantenimiento/vehiculo/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/inicio/:inicio/fin/:fin/tipo_activo/:tipo_activo/placa/:placa/marca/:marca/modelo/:modelo/anio/:anio/tipo_mantenimiento/:tipo_mantenimiento/numero_ot/:numero_ot/estado_ot/:estado_ot/campamento/:campamento')
        .get(function (req, res) {
            var condicionMantenimiento = ''
            if (req.params.inicio != 0) {
                var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
                var fin = new Date(req.params.fin); fin.setHours(23, 0, 0, 0, 0);
                condicionMantenimiento += "WHERE fecha_hora_aviso BETWEEN '" + inicio.getFullYear() + "-" + (inicio.getMonth() + 1) + "-" + inicio.getDate() + " 00:00:00' AND '" + fin.getFullYear() + "-" + (fin.getMonth() + 1) + "-" + fin.getDate() + " 23:00:00' ";
                if (req.params.placa != '0') { condicionMantenimiento += " and producto.caracteristica_especial1 like '%" + req.params.placa + "%'" }
                if (req.params.marca != '0') { condicionMantenimiento += " and marca like '%" + req.params.marca + "%'" }
                if (req.params.modelo != '0') { condicionMantenimiento += " and modelo like '%" + req.params.modelo + "%'" }
                if (req.params.anio != '0') { condicionMantenimiento += " and anio like '%" + req.params.anio + "%'" }
                if (req.params.tipo_activo != '0') { }
                if (req.params.tipo_mantenimiento != '0') { condicionMantenimiento += " and tipomantenimiento.nombre like '%" + req.params.tipo_mantenimiento + "%'" }
                if (req.params.estado_ot != '0') { }
                if (req.params.numero_ot != '0') { }
                if (req.params.texto_busqueda != 0) {
                    if (condicionMantenimiento.length > 1) {
                        condicionMantenimiento += " or producto.caracteristica_especial1 like '%" + req.params.texto_busqueda + "%' or marca like '%" + req.params.texto_busqueda + "%' or modelo like '%" + req.params.texto_busqueda + "%' or anio like '%" + req.params.texto_busqueda + "%' or tipomantenimiento.nombre like '%"+ req.params.texto_busqueda+"%'"
                    } else {
                        condicionMantenimiento += "where producto.caracteristica_especial1 like '%" + req.params.texto_busqueda + "%' or marca like '%" + req.params.texto_busqueda + "%' or modelo like '%" + req.params.texto_busqueda + "%' or anio like '%" + req.params.texto_busqueda + "%' or tipomantenimiento.nombre like '%"+ req.params.texto_busqueda+"%'"
                    }
                }
            } else {
                if (req.params.texto_busqueda != 0) {
                    if (condicionMantenimiento.length > 1) {
                        condicionMantenimiento += " or producto.caracteristica_especial1 like '%" + req.params.texto_busqueda + "%' or marca like '%" + req.params.texto_busqueda + "%' or modelo like '%" + req.params.texto_busqueda + "%' or anio like '%" + req.params.texto_busqueda + "%' or tipomantenimiento.nombre like '%"+ req.params.texto_busqueda+"%'"
                    } else {
                        condicionMantenimiento += "where producto.caracteristica_especial1 like '%" + req.params.texto_busqueda + "%' or marca like '%" + req.params.texto_busqueda + "%' or modelo like '%" + req.params.texto_busqueda + "%' or anio like '%" + req.params.texto_busqueda + "%' or tipomantenimiento.nombre like '%"+ req.params.texto_busqueda+"%'"
                    }
                }
                if (req.params.placa != '0') {
                    if (condicionMantenimiento.length > 1) {
                        condicionMantenimiento += " or producto.caracteristica_especial1 like '%" + req.params.placa + "%'"
                    } else {
                        condicionMantenimiento += "where producto.caracteristica_especial1 like '%" + req.params.placa + "%'"
                    }
                }
                if (req.params.marca != '0') {
                    if (condicionMantenimiento.length > 1) {
                        condicionMantenimiento += " or marca like '%" + req.params.marca + "%'"
                    } else {
                        condicionMantenimiento += "where marca like '%" + req.params.marca + "%'"
                    }
                }
                if (req.params.modelo != '0') {
                    if (condicionMantenimiento.length > 1) {
                        condicionMantenimiento += " or modelo like '%" + req.params.modelo + "%'"
                    } else {
                        condicionMantenimiento += "where modelo like '%" + req.params.modelo + "%'"
                    }
                }
                if (req.params.anio != '0') {
                    if (condicionMantenimiento.length > 1) {
                        condicionMantenimiento += " or anio like '%" + req.params.anio + "%'"
                    } else {
                        condicionMantenimiento += "where anio like '%" + req.params.anio + "%'"
                    }
                }
                if (req.params.tipo_activo != '0') { }
                if (req.params.tipo_mantenimiento != '0') {
                    if (condicionMantenimiento.length > 1) {
                        condicionMantenimiento += " or tipomantenimiento.nombre like '%" + req.params.tipo_mantenimiento + "%'"
                    } else {
                        condicionMantenimiento += "where tipomantenimiento.nombre like '%" + req.params.tipo_mantenimiento + "%'"
                    }
                }
                if (req.params.estado_ot != '0') { }
                if (req.params.numero_ot != '0') { }
            }

            sequelize.query(" select count(*) as cantidad_vehiculos, mantenimiento.fecha_hora_aviso,producto.imagen,producto.caracteristica_especial1,producto.marca,producto.modelo,producto.anio,tipomantenimiento.nombre  from agil_mantenimiento_orden_trabajo as mantenimiento INNER JOIN agil_producto AS producto ON mantenimiento.producto = producto.id \
            INNER JOIN gl_clase AS tipomantenimiento ON mantenimiento.tipo_mantenimiento = tipomantenimiento.id "+ condicionMantenimiento, { type: sequelize.QueryTypes.SELECT })
                .then(function (data) {
                    var options = {
                        model: MantenimientoOrdenTrabajo,
                        include: [{ model: Producto, as: 'producto' },
                        { model: Clase, as: 'tipoMantenimiento' },
                        { model: MantenimientoOrdenTrabajoManoObra, as: 'manosDeObra', include: [{ model: Persona, as: 'encargado' }, { model: Clase, as: 'especialidad' }] },
                        { model: MantenimientoOrdenTrabajoMaterial, as: 'materiales', include: [{ model: Producto, as: "producto" }] },
                        { model: MantenimientoOrdenTrabajoServicioExterno, as: 'serviciosExternos' },
                        { model: MantenimientoOrdenTrabajoSistema, as: 'sistemas' },
                        { model: Clase, as: 'Prioridad' }]
                    };
                    Sequelize.Model.$validateIncludedElements(options);
                    sequelize.query("SELECT mantenimiento.*,producto.imagen,producto.caracteristica_especial1,producto.marca,producto.modelo,producto.anio,tipomantenimiento.nombre\
                FROM agil_mantenimiento_orden_trabajo AS mantenimiento INNER JOIN agil_producto AS producto ON mantenimiento.producto = producto.id\
                INNER JOIN gl_clase AS tipomantenimiento ON mantenimiento.tipo_mantenimiento = tipomantenimiento.id\
                 "+ condicionMantenimiento + " order by " + req.params.columna + " " + req.params.direccion + " LIMIT " + (req.params.items_pagina * (req.params.pagina - 1)) + "," + req.params.items_pagina, options)
                        .then(function (vehiculos) {
                            res.json({ vehiculos: vehiculos, paginas: Math.ceil(data[0].cantidad_vehiculos / req.params.items_pagina) });
                        });
                });
            /* MantenimientoOrdenTrabajo.findAndCountAll({
                where: condicionMantenimiento,
                include: [{ model: Producto, as: 'producto', where: condicionProducto },
                { model: Clase, as: 'tipoMantenimiento' },
                { model: MantenimientoOrdenTrabajoManoObra, as: 'manosDeObra', include: [{ model: Persona, as: 'encargado' }, { model: Clase, as: 'especialidad' }] },
                { model: MantenimientoOrdenTrabajoMaterial, as: 'materiales', include: [{ model: Producto, as: "producto" }] },
                { model: MantenimientoOrdenTrabajoServicioExterno, as: 'serviciosExternos' },
                { model: MantenimientoOrdenTrabajoSistema, as: 'sistemas' },
                { model: Clase, as: 'Prioridad' }],
                
                order: [ordenArreglo]
            }).then(function (data) {
                MantenimientoOrdenTrabajo.findAll({
                    offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
                    where: condicionMantenimiento,
                    include: [{ model: Producto, as: 'producto', where: condicionProducto },
                    { model: Clase, as: 'tipoMantenimiento' },
                    { model: MantenimientoOrdenTrabajoManoObra, as: 'manosDeObra', include: [{ model: Persona, as: 'encargado' }, { model: Clase, as: 'especialidad' }] },
                    { model: MantenimientoOrdenTrabajoMaterial, as: 'materiales', include: [{ model: Producto, as: "producto" }] },
                    { model: MantenimientoOrdenTrabajoServicioExterno, as: 'serviciosExternos' },
                    { model: MantenimientoOrdenTrabajoSistema, as: 'sistemas' },
                    { model: Clase, as: 'Prioridad' }],

                    order: [ordenArreglo]
                }).then(function (vehiculos) {
                    res.json({ vehiculos: vehiculos, paginas: Math.ceil(data.count / req.params.items_pagina) });
                });
            }); */
        });
    router.route('/mantenimiento-vehiculo/empresa/:id_empresa/Mantenimiento/:id_mantenimiento')
        .get(function (req, res) {
            var condicionProducto = {id_empresa:req.params.id_empresa}
            MantenimientoOrdenTrabajo.find({
                where: { id: req.params.id_mantenimiento },
                include: [{ model: Producto, as: 'producto', where: condicionProducto },
                { model: Clase, as: 'tipoMantenimiento' },
                { model: MantenimientoOrdenTrabajoManoObra, as: 'manosDeObra', include: [{ model: Persona, as: 'encargado' }, { model: Clase, as: 'especialidad' }] },
                { model: MantenimientoOrdenTrabajoMaterial, as: 'materiales', include: [{ model: Producto, as: "producto" }] },
                { model: MantenimientoOrdenTrabajoServicioExterno, as: 'serviciosExternos' },
                { model: MantenimientoOrdenTrabajoSistema, as: 'sistemas' },
                { model: Clase, as: 'Prioridad' }],
            }).then(function (MantenimeintoEncontrado) {
                res.json({ mantenimiento: MantenimeintoEncontrado })
            })
        })
    router.route('/mantenimiento-vehiculo/empresa/:id_empresa/busqueda/:buscar')
        .get(function (req, res) {
            var condicionCuenta;
            if (req.params.buscar != 0) {
                condicionCuenta = {
                    id_empresa: req.params.id_empresa,
                    almacen_erp: { $not: null },
                    $or: [
                        {
                            caracteristica_especial1: {
                                $like: "%" + req.params.buscar + "%"
                            }
                        },
                        {
                            marca: {
                                $like: "%" + req.params.buscar + "%"
                            }
                        }
                    ]
                };
            } else {
                condicionCuenta = {
                    id_empresa: req.params.id_empresa, almacen_erp: { $not: null }
                }
            }
            Producto.findAll({
                where: condicionCuenta,
                include: [{ model: Almacen, as: 'almacenErp' }],


            }).then(function (cuentas) {
                res.json(cuentas)
            })

        });

    router.route('/mantenimiento-encargado/empresa/:id_empresa/busqueda/:buscar')
        .get(function (req, res) {

            var condicionCuenta;
            var condicionEmpresa = { id_empresa: req.params.id_empresa }
            if (req.params.buscar != 0) {
                condicionCuenta = {
                    $or: [
                        {
                            nombres: {
                                $like: "%" + req.params.buscar + "%"
                            }
                        },
                        {
                            apellido_materno: {
                                $like: "%" + req.params.buscar + "%"
                            }
                        },
                        {
                            apellido_paterno: {
                                $like: "%" + req.params.buscar + "%"
                            }
                        }
                    ]
                };
            } else {
                condicionCuenta = {}
            }

            Persona.findAll({
                include: [{ model: Usuario, as: 'usuario', where: condicionEmpresa }],
                where: condicionCuenta
            }).then(function (cuentas) {
                res.json(cuentas)
            })

        });
}