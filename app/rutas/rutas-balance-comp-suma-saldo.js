module.exports = function (router, sequelize, Sequelize, EstadoFinancieroConfiguracionImpresion, EstadoFinancieroGestion, Tipo, Clase, ProveedorCuenta
    , Proveedor, ClienteCuenta, Cliente, ClasificacionCuenta, ContabilidadCuenta, AsientoContabilidad, ComprobanteContabilidad, MonedaTipoCambio) {
    
    router.route('/balance-comp-suma-saldo/empresa/:id_empresa/tipo_periodo/:periodo/gestion/:gestion/mes/:mes/inicio/:inicio/fin/:fin/gestion_fin/:gestion_fin')
    .post(function (req, res) {
        // var mes = new Date(req.params.gestion, parseInt(req.params.mes), 0);
        // var primerDia = new Date(req.params.gestion, parseInt(req.params.mes) - 1, 1, 0, 0, 0);
        // var ultimoDia = new Date(req.params.gestion, parseInt(req.params.mes) - 1, mes.getDate(), 23, 59, 59);

        var condicionCuenta = {}, condicionComprobante = {};
            condicionCuenta.id_empresa = parseInt(req.params.id_empresa);

        if (req.params.periodo == 'GESTIÓN') {
            var diaInicio = req.body.fechasImpresion.inicio.split("/")[0]
            var diafin = req.body.fechasImpresion.fin.split("/")[0]
            var mesinico = parseInt(req.body.fechasImpresion.inicio.split("/")[1]) - 1
            var mesfin = parseInt(req.body.fechasImpresion.fin.split("/")[1]) - 1
            if (mesinico == 0) {
                var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                var fin = new Date(req.params.gestion, mesfin, diafin)
            } else {
                var anio = parseInt(req.params.gestion) + 1
                var inicio = new Date(req.params.gestion, mesinico, diaInicio)
                var fin = new Date(anio, mesfin, diafin)
            }

            inicio.setHours(0, 0, 0, 0, 0);
            fin.setHours(23, 59, 59, 0, 0);
            var condicionComprobante = { eliminado: false, fecha: { $between: [inicio, fin] } }
        } else if (req.params.periodo == 'MES') {
            var mes = new Date(req.params.gestion, parseInt(req.params.mes), 0);
            var primerDia = new Date(req.params.gestion, parseInt(req.params.mes) - 1, 1, 0, 0, 0);
            var ultimoDia = new Date(req.params.gestion, parseInt(req.params.mes) - 1, mes.getDate(), 23, 59, 59);
            var condicionComprobante = { eliminado: false, fecha: { $between: [primerDia, ultimoDia] } }
            condicionComprobante.fecha = { $between: [primerDia, ultimoDia] }
        } else if (req.params.periodo == 'FECHAS') {
            var inicio = new Date(req.params.inicio)
            var fin = new Date(req.params.fin)
            inicio.setHours(0, 0, 0, 0, 0);
            fin.setHours(23, 59, 59, 0, 0);
            condicionComprobante.fecha = { $between: [inicio, fin] }
        }

        AsientoContabilidad.findAll({
            where: { eliminado: false },
            include: [{ 
                model: ComprobanteContabilidad, as: 'comprobante',
                where: condicionComprobante,
                include: [{ model: Clase, as: 'tipoComprobante' }]
            },
            { 
                model: ContabilidadCuenta, as: 'cuenta',
                where: condicionCuenta,
                include: [ { model: Clase, as: 'tipoCuenta', where: {nombre: "APROPIACION"} }]
            }],
            group: ['cuenta.id'],
            attributes: [[Sequelize.fn('SUM', Sequelize.col('debe_bs')), 'debe_bs'], [Sequelize.fn('SUM', Sequelize.col('haber_bs')), 'haber_bs'], [Sequelize.fn('SUM', Sequelize.col('debe_sus')), 'debe_sus'], [Sequelize.fn('SUM', Sequelize.col('haber_sus')), 'haber_sus']], 
        }).then(function (contabilidadComprobante) {
            res.json({cuentas:contabilidadComprobante})
        });
    })
}