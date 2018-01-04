angular.module('agil.servicios')

.factory('SolicitudReposicion', function ($resource) {
    return $resource(restServer + "operaciones/empresa/:id_empresa/vintage/:id_usuario/capo/:rol/desde/:desde/hasta/:hasta/suc/:sucursal/alm/:almacen/mov/:movimiento/est/:estado/val/:valuado/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda", {},
        {
            'update': { method: 'PUT' }
        });
})

.factory('SolicitudesReposicion', ['SolicitudReposicion', '$q', function (SolicitudReposicion, $q) {
    // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
    var res = function (filtro) {
        var delay = $q.defer();
        SolicitudReposicion.get({id_empresa: filtro.empresa, id_usuario:filtro.id, rol:filtro.rol, desde:filtro.desde,
            hasta:filtro.hasta, sucursal:filtro.sucursal, almacen:(filtro.almacen!==undefined)?(filtro.almacen.id!==undefined&&filtro.almacen.id>=0)?filtro.almacen.id:0:0, movimiento:filtro.movimiento, estado:filtro.estado,
            valuado:filtro.valuado, pagina:filtro.pagina, items_pagina:filtro.items_pagina, busqueda:filtro.busqueda}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('Ingrediente', function ($resource) {
    return $resource(restServer + "operaciones/producto/:id_producto", null,
        {
            'update': { method: 'PUT' }
        });
})

.factory('SolicitudesFormulacionProducto', ['Ingrediente', '$q', function (Ingrediente, $q) {
    var res = function (idProducto) {
        var delay = $q.defer();
        Ingrediente.get({id_producto:idProducto}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])




.factory('EliminarSolicitudReposicion', function ($resource) {
    return $resource(restServer + "operaciones/eliminar/:id_solicitud", null,
        {
            'update': { method: 'PUT' }
        });
})

// .factory('EliminarSolicitudesReposicion', ['EliminarSolicitudReposicion', '$q', function (Eliminar, $q) {
//     var res = function (idSolicitud) {
//         var delay = $q.defer();
//         Eliminar.get({id_solicitud:idSolicitud}, function (entidades) {
//             delay.resolve(entidades);
//         }, function (error) {
//             delay.reject(error);
//         });
//         return delay.promise;
//     };
//     return res;
// }])
