angular.module('agil.servicios')
.factory('ActivosPaginador', function ($resource) {
    return $resource(restServer + "activos/empresa/:id_empresa/desde/:desde/hasta/:hasta/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/usuario/:usuario");
})

.factory('ActivosFijosEmpresa', ['ActivosPaginador', '$q', function (ActivosPaginador, $q) {
    var res = function (idEmpresa, paginador) {
        var delay = $q.defer();
        ActivosPaginador.get({
            desde: paginador.filter.desde,
            hasta: paginador.filter.hasta, 
            id_empresa: idEmpresa, 
            pagina: paginador.currentPage, 
            items_pagina: paginador.itemsPerPage, 
            texto_busqueda: paginador.search,
            id_tipo: paginador.filter.tipo,
            id_proveedor: paginador.filter.proveedor,
            nit: paginador.filter.nit,
            id_sucursal: paginador.filter.sucursal,
            estado: paginador.filter.estado,
            usuario: paginador.filter.usuario
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ConfiguracionActivos', function ($resource) {
    return $resource(restServer + "activos/configuracion/empresa/:id_empresa/:id_usuario");
})

.factory('GuardarConfiguracionActivosFijos', ['ConfiguracionActivos', '$q', function (ConfiguracionActivos, $q) {
    var res = function (idEmpresa, usuario, configuracion) {
        var delay = $q.defer();
        ConfiguracionActivos.save({ id_empresa: idEmpresa, id_usuario: usuario }, configuracion, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ObtenerConfiguracionActivosFijos', ['ConfiguracionActivos', '$q', function (ConfiguracionActivos, $q) {
    var res = function (idEmpresa, usuario, configuracion) {
        var delay = $q.defer();
        ConfiguracionActivos.get({ id_empresa: idEmpresa, id_usuario: 0}, configuracion, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ProveedoresOperaciones', function ($resource) {
    return $resource(restServer + "proveedores/:id_empresa");
})

.factory('ListaProveedores', ['ProveedoresOperaciones', '$q', function (ProveedoresOperaciones, $q) {
    var res = function (idEmpresa) {
        var delay = $q.defer();
        ProveedoresOperaciones.get({ id_empresa: idEmpresa}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])