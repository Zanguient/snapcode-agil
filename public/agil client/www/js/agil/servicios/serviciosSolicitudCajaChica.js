angular.module('agil.servicios')


.factory('SolicitudCajaChica', function ($resource) {
    return $resource(restServer + "solicitud-caja-chica", null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('GuardarSolicitudCajaChica', ['SolicitudCajaChica', '$q', function (SolicitudCajaChica, $q) {
    var res = function (datos)//idEmpresa, xxx
    {
        var delay = $q.defer();
        SolicitudCajaChica.save(datos, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('ConceptoMovimientoCajaChica', function ($resource) {
    return $resource(restServer + "solicitud-conceptos-caja-chica/empresa/:id_empresa", null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('GuardarConceptoMovimientoCajaChica', ['ConceptoMovimientoCajaChica', '$q', function (ConceptoMovimientoCajaChica, $q) {
    var res = function (idEmpleado, conceptos)//idEmpresa, xxx
    {
        var delay = $q.defer();
        ConceptoMovimientoCajaChica.save({
            id_empresa: idEmpleado
        }, conceptos, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('ObtenerConceptoMovimientoCajaChica', ['ConceptoMovimientoCajaChica', '$q', function (ConceptoMovimientoCajaChica, $q) {
    var res = function (idEmpleado, conceptos)//idEmpresa, xxx
    {
        var delay = $q.defer();
        ConceptoMovimientoCajaChica.query({
            id_empresa: idEmpleado
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('SolicitudCajaChicaPaginador', function ($resource) {
    return $resource(restServer + "solocitudes-caja-chica/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/solicitante/:solicitante/usuario/:usuario/estado/:estado/concepto/:concepto/movimiento/:movimiento/usuario-no-autorizado/:id_usuario_no_autorizado");
})

.factory('SolicitudesCajaPaginador', ['SolicitudCajaChicaPaginador', '$q', function (SolicitudCajaChicaPaginador, $q) {
    var res = function (paginator)//idEmpresa, xxx
    {        
        var delay = $q.defer();
        SolicitudCajaChicaPaginador.get({
            id_empresa: paginator.filter.empresa,
            pagina: paginator.currentPage,
            items_pagina: paginator.itemsPerPage,
            texto_busqueda: paginator.search,
            columna: paginator.column,
            direccion: paginator.direction,
            solicitante:paginator.filter.solicitante,
            usuario:paginator.filter.usuario,
            estado:paginator.filter.estado,
            concepto:paginator.filter.concepto,
            movimiento:paginator.filter.movimiento,
            id_usuario_no_autorizado:paginator.filter.id_usuario_no_autorizado,
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('CajaChicaPaginador', function ($resource) {
    return $resource(restServer + "caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/solicitante/:solicitante/usuario/:usuario/estado/:estado/concepto/:concepto/movimiento/:movimiento/usuario-no-autorizado/:id_usuario_no_autorizado");
})

.factory('SolicitudesCajaChicaPaginador', ['CajaChicaPaginador', '$q', function (CajaChicaPaginador, $q) {
    var res = function (paginator)//idEmpresa, xxx
    {        
        var delay = $q.defer();
        CajaChicaPaginador.get({
            id_empresa: paginator.filter.empresa,
            pagina: paginator.currentPage,
            items_pagina: paginator.itemsPerPage,
            texto_busqueda: paginator.search,
            columna: paginator.column,
            direccion: paginator.direction,
            solicitante:paginator.filter.solicitante,
            usuario:paginator.filter.usuario,
            estado:paginator.filter.estado,
            concepto:paginator.filter.concepto,
            movimiento:paginator.filter.movimiento,
            id_usuario_no_autorizado:paginator.filter.id_usuario_no_autorizado,
            id_sucursal:paginator.filter.id_sucursal
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('IngresosCajaChicaPaginador', function ($resource) {
    return $resource(restServer + "caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion");
})

.factory('IngresosCajaPaginador', ['IngresosCajaChicaPaginador', '$q', function (IngresosCajaChicaPaginador, $q) {
    var res = function (paginator)//idEmpresa, xxx
    {        
        var delay = $q.defer();
        IngresosCajaChicaPaginador.get({
            id_empresa: paginator.filter.empresa,
            pagina: paginator.currentPage,
            items_pagina: paginator.itemsPerPage,
            texto_busqueda: paginator.search,
            columna: paginator.column,
            direccion: paginator.direction,
            id_sucursal:paginator.filter.id_sucursal   
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('DatosGuardarCajaChica', function ($resource) {
    return $resource(restServer + "caja-chica/:id_empresa", null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('GuardarCajaChica', ['DatosGuardarCajaChica', '$q', function (DatosGuardarCajaChica, $q) {
    var res = function (cajachica,idEmpresa)//idEmpresa, xxx
    {
        var delay = $q.defer();
        DatosGuardarCajaChica.save({id_empresa:idEmpresa},cajachica, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('DatosCierreCaja', function ($resource) {
    return $resource(restServer + "caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/fecha/:fecha/saldoInicial/:saldo", null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('ObtenerDatosCierreCaja', ['DatosCierreCaja', '$q', function (DatosCierreCaja, $q) {
    var res = function (idEmpleado,fecha,saldo,idSucursal)//idEmpresa, xxx
    {
        var delay = $q.defer();
        DatosCierreCaja.get({
            id_empresa: idEmpleado,fecha:fecha,saldo:saldo,id_sucursal:idSucursal
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('CierreCajaChicaPaginador', function ($resource) {
    return $resource(restServer + "cierre-caja-chica/sucursal/:id_sucursal/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion");
})

.factory('CierreCajaCPaginador', ['CierreCajaChicaPaginador', '$q', function (CierreCajaChicaPaginador, $q) {
    var res = function (paginator)//idEmpresa, xxx
    {        
        var delay = $q.defer();
        CierreCajaChicaPaginador.get({
            id_empresa: paginator.filter.empresa,
            pagina: paginator.currentPage,
            items_pagina: paginator.itemsPerPage,
            texto_busqueda: paginator.search,
            columna: paginator.column,
            direccion: paginator.direction,
            id_sucursal:paginator.filter.id_sucursal
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('AlertasCajaChica', function ($resource) {
    return $resource(restServer + "alertas-solicitud-caja-chica/empresa/:id_empresa/historico/:historico/mes/:mes/anio/:anio/verificador/:id_verificador", null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('ObtenerAlertasCajaChica', ['AlertasCajaChica', '$q', function (AlertasCajaChica, $q) {
    var res = function (filtro,idUsuario)//idEmpresa, xxx
    {
        var delay = $q.defer();
        AlertasCajaChica.query({
            id_empresa: filtro.id_empresa,
            historico:(filtro.historico)?1:0,
            mes:(filtro.mes=="")?0:filtro.mes,
            anio:(filtro.anio=="")?0:filtro.anio,
            id_verificador:idUsuario
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('VerificacionCajaChica', function ($resource) {
    return $resource(restServer + "verificar-solicitudes-caja-chica", null,
        {
            'update': { method: 'PUT' }
        });
})

.factory('GuardarVerificadorSolicitud', ['VerificacionCajaChica', '$q', function (VerificacionCajaChica, $q) {
    var res = function (idEmpleado,datos)//idEmpresa, xxx
    {
        var delay = $q.defer();
        VerificacionCajaChica.update({},datos, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

