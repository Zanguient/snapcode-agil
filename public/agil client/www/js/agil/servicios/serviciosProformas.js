angular.module('agil.servicios')

.factory('Proformas', function ($resource) {
    return $resource(restServer + "proformas/empresa/:id_empresa/mes/:mes/anio/:anio/suc/:sucursal/act/:actividad/ser/:servicio/monto/:monto/razon/:razon/usuario/:usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda", {},
        {
            'update': { method: 'PUT' }
        });
})

.factory('FiltroProformas', ['Proformas', '$q', function (Proformas, $q) {
    // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
    var res = function (filtro) {
        var delay = $q.defer();
        Proformas.get({id_empresa: filtro.filter.empresa, id_usuario:filtro.filter.id, rol:filtro.filter.rol, desde:filtro.filter.desde,
            hasta:filtro.filter.hasta, sucursal:filtro.filter.sucursal, almacen:(filtro.filter.almacen!==undefined)?(filtro.filter.almacen.id!==undefined&&filtro.filter.almacen.id>=0)?filtro.filter.almacen.id:0:0, movimiento:filtro.filter.movimiento, estado:filtro.filter.estado,
            valuado:filtro.filter.valuado, pagina:filtro.currentPage, items_pagina:filtro.itemsPerPage, busqueda:filtro.search}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ActividadEmpresa', function ($resource) {
    return $resource(restServer + "actividades/empresa/:id_empresa", {},
        {
            'update': { method: 'PUT' }
        });
})

.factory('ActividadesEmpresa', ['ActividadEmpresa', '$q', function (ActividadEmpresa, $q) {
    // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
    var res = function (idEmpresa) {
        var delay = $q.defer();
        ActividadEmpresa.get({id_empresa: idEmpresa}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ActividadServicio', function ($resource) {
    return $resource(restServer + "actividades/servicios/empresa/:id_empresa", {},
        {
            'update': { method: 'PUT' }
        });
})