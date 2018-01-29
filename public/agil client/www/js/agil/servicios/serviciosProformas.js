angular.module('agil.servicios')

.factory('Proformas', function ($resource) {
    return $resource(restServer + "proformas/empresa/:id_empresa/mes/:mes/anio/:anio/suc/:sucursal/act/:actividad/ser/:servicio/monto/:monto/razon/:razon/usuario/:usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/num/:numero", {},
        {
            'update': { method: 'PUT' }
        });
})

.factory('FiltroProformas', ['Proformas', '$q', function (Proformas, $q) {
    // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
    var res = function (filtro) {
        var delay = $q.defer();
        Proformas.get({id_empresa: filtro.filter.empresa, usuario:filtro.filter.usuario, mes:filtro.filter.mes.id!==undefined?filtro.filter.mes.id:filtro.filter.mes,
            anio:filtro.filter.anio.id!==undefined?filtro.filter.anio.id:filtro.filter.anio, sucursal:filtro.filter.sucursal.id!==undefined?filtro.filter.sucursal.id:0, actividad:filtro.filter.actividadEconomica!==undefined?filtro.filter.actividadEconomica.id!==undefined?filtro.filter.actividadEconomica.id:0:0,monto:filtro.filter.monto, razon:filtro.filter.razon,
            servicio:filtro.filter.servicio.id!==undefined?filtro.filter.servicio.id:0, pagina:filtro.currentPage, items_pagina:filtro.itemsPerPage, busqueda:filtro.search,numero:filtro.filter.numero!==undefined?filtro.filter.numero:0}, function (entidades) {
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
    return $resource(restServer + "actividades/servicios/empresa/:id_empresa/:id_actividad", {},
        {
            'update': { method: 'PUT' }
        });
})

.factory('ServiciosEmpresa', ['ActividadServicio', '$q', function (ActividadServicio, $q) {
    // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
    var res = function (idEmpresa,actividad) {
        var delay = $q.defer();
        ActividadServicio.get({id_empresa: idEmpresa,id_actividad:actividad}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('Proforma', function ($resource) {
    return $resource(restServer + "proforma/:id", {},
        {
            'update': { method: 'PUT' }
        });
})

.factory('ProformaInfo', ['Proforma', '$q', function (Proforma, $q) {
    var res = function (idProforma) {
        var delay = $q.defer();
        Proforma.get({id: idProforma}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('fechasProforma', function ($resource) {
    return $resource(restServer + "fechas/proforma/:id", {},
        {
            'update': { method: 'PUT' }
        });
})

.factory('eliminarProforma', function ($resource) {
    return $resource(restServer + "eliminar/proforma/:id", {},
        {
            'update': { method: 'PUT' }
        });
})