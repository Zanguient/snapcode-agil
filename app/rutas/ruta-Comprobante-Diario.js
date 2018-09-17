module.exports = function (router, sequelize, Sequelize, EstadoFinancieroConfiguracionImpresion, EstadoFinancieroGestion, Tipo, Clase, ProveedorCuenta
    , Proveedor, ClienteCuenta, Cliente, ClasificacionCuenta, ContabilidadCuenta, AsientoContabilidad, ComprobanteContabilidad, MonedaTipoCambio,ContabilidadCuentaAuxiliar,Usuario,
    Persona,Sucursal,Empresa,NumeroLiteral ) {



    router.route('/comprobante-contabilidad/empresa/:empresa/inicio/:inicio/fin/:fin')
	.get(function (req, res) {
		//var inicio = new Date(req.params.inicio); inicio.setHours(0, 0, 0, 0, 0);
        //var fin = new Date(req.params.fin); fin.setHours(23, 59, 59, 0, 0);

        var inicio =  new Date(req.params.inicio);//.toISOString().split('T')[0].reverse().join('-')+" T00.00.00.000Z"; 
        var fin = new Date(req.params.fin);
        fin.setHours(23)
        fin.setMinutes(59)

        var queryFecha = {fecha: {$between: [inicio, fin]} }
        var condicionSucursal = { id_empresa: req.params.empresa };
		ComprobanteContabilidad.findAll({
           // offset: (req.params.items_pagina * (req.params.pagina - 1)), limit: req.params.items_pagina,
            where: queryFecha,
            include:[{model:AsientoContabilidad,as:'asientosContables',where: { eliminado: false }},
                { model: Sucursal, as: 'sucursal',where: condicionSucursal, include: [{ model: Empresa, as: 'empresa' }]},
                { model: MonedaTipoCambio, as: 'tipoCambio'}
            ]
           
        }).then(function (comprobantes) {
            res.json({comprobantes});
        });
    })
    }