module.exports = function (router, sequelize, Sequelize, Usuario, Cliente, Proforma, DetallesProformas, Servicios, Clase, Sucursal, SucursalActividadDosificacion, Dosificacion,
 Empresa, Tipo, UsuarioSucursal, Almacen, Venta, DetalleVenta) {
    router.route('/pedido/:id_empresa/:id_pedido')
        .get(function (req, res) {
            Pedido.find({
                where: { id: req.params.id_pedido },
                include: [{
                    model: Sucursal, as: 'sucursal',
                    include: [{ model: Empresa, as: 'empresa', where: { id: req.params.id_empresa } }]
                }]
            }).then(function (pedido) {
                res.json({ pedido: pedido });

            }).catch(function (err) {
                res.json({ mensaje: err.stack, hasErr: true });
            })
        })
}