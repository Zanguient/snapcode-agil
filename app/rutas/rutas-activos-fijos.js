module.exports = function (router, sequelize, Sequelize, Usuario, ActivosFijos, ActivosFijosValores, ActivosFijosConfiguracion, Clase, Producto, Inventario) {

    router.route('/activos/empresa/:id_empresa')
        .get(function (req, res) {
            ActivosFijos.findAll({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: ActivosFijosValores, as: 'valores' }, {model: Producto, as: 'activo', attributes: ['nombre', 'codigo', 'id_subgrupo'], include:[{model: Inventario, as: 'inventarios'}]}]
            }).then(function (activos) {
                res.json({ activos: activos });
            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true });
            });
            // ActivosFijosConfiguracion.findAll({
            //     where: {
            //         id_empresa: req.params.id_empresa
            //     },
            //     include: [{ model: Clase, as: 'subgrupo' }]
            // }).then(function (configuraciones) {
            //     var indices = configuraciones.map(function (conf) {
            //         return conf.subgrupo.id
            //     })
            //     ///producto.publicar_panel,,producto.activar_inventario
            //     // sequelize.query("select producto.id,producto.codigo,producto.nombre as nombre,producto.precio_unitario,producto.inventario_minimo,producto.descripcion,tipoProducto.nombre as tipoProducto,grupo.nombre as grupo, grupo.id as id_grupo,subgrupo.nombre as subgrupo, subgrupo.id as id_subgrupo\
			// 	// 		from agil_producto as producto\
			// 	// 		LEFT OUTER JOIN gl_clase AS tipoProducto ON (producto.tipo_producto = tipoProducto.id)\
			// 	// 		LEFT OUTER JOIN gl_clase AS grupo ON (producto.grupo = grupo.id)\
			// 	// 		LEFT OUTER JOIN gl_clase AS subgrupo ON (producto.subgrupo = subgrupo.id)\
			// 	// 		WHERE "+ condicionProducto + " and producto.grupo in (" + gruposProductos + ") \
			// 	// 		ORDER BY producto."+ req.params.columna + " " + req.params.direccion + limit, { type: sequelize.QueryTypes.SELECT })
            //     //     .then(function (productos) {
            //     //         res.json({ productos: productos, paginas: paginas });
            //     //     }).catch(function (err) {
            //     //         res.json({ productos: [], hasError: true, mensaje: err.stack });
            //     //     });
            // }).catch(function (err) {
            //     res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true });
            // });
        });

    router.route('/activos/configuracion/empresa/:id_empresa/:id_usuario')
        .get(function (req, res) {
            ActivosFijosConfiguracion.findAll({
                where: {
                    id_empresa: req.params.id_empresa
                },
                include: [{ model: Clase, as: 'subgrupo' }]
            }).then(function (configuracion) {
                res.json({ configuracion: configuracion });
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true });
            });
        })

        .post(function (req, res) {
            sequelize.transaction(function (t) {
                var promesas = []
                req.body.forEach(function (detalle) {
                    if (detalle.id) {
                        promesas.push(editarDetalleConfiguracion(detalle, t, req.params));
                    } else {
                        promesas.push(crearDetalleConfiguracion(detalle, t, req.params));
                    }
                })
                return Promise.all(promesas);
            }).then(function (result) {
                if (result) {
                    res.json({ mensaje: 'Configuración actualizada.' });
                } else {
                    res.json({ mensaje: 'Parece haber un error no determinado.', hasErr: true });
                }
            }).catch(function (err) {
                res.json({ mensaje: (err.stack !== undefined) ? err.stack : err, hasErr: true });
            })
        });

    function crearDetalleConfiguracion(detalle, t, params) {
        return ActivosFijosConfiguracion.create({
            id_usuario: params.id_usuario,
            id_empresa: params.id_empresa,
            id_subgrupo: detalle.subgrupo.id,
            vida_util: detalle.vida_util,
            factor: detalle.factor,
            eliminado: false
        }, { transaction: t }).then(function (res) {
            return new Promise(function (fulfill, reject) {
                fulfill('Detalle configuración creado.');
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })
    };

    function editarDetalleConfiguracion(detalle, t, params) {
        return ActivosFijosConfiguracion.update({
            id_usuario: params.id_usuario,
            id_empresa: params.id_empresa,
            id_subgrupo: detalle.subgrupo.id,
            vida_util: detalle.vida_util,
            factor: detalle.factor,
            eliminado: detalle.eliminado
        }, { where: { id: detalle.id }, transaction: t }).then(function (res) {
            return new Promise(function (fulfill, reject) {
                fulfill('Detalle configuración actualizado.');
            });
        }).catch(function (err) {
            return new Promise(function (fulfill, reject) {
                reject((err.stack !== undefined) ? err.stack : err);
            });
        })
    }
}