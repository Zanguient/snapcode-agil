angular.module('agil.servicios')

.factory('SolicitudReposicion', function ($resource) {
    return $resource(restServer + "operaciones/empresa/:id_empresa", null,
        {
            'update': { method: 'PUT' }
        });
})

.factory('SolicitudesReposicion', ['SolicitudReposicion', '$q', function (SolicitudReposicion, $q) {
    var res = function (idEmpresa) {
        var delay = $q.defer();
        SolicitudReposicion.get({id_empresa:idEmpresa}, function (entidades) {
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

