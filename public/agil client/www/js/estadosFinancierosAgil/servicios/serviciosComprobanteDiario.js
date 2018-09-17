angular.module('agil.servicios')

.factory('TodoComprobanteContabilidad', function ($resource) {
    return $resource(restServer + "comprobante-contabilidad/empresa/:empresa/inicio/:inicio/fin/:fin",
        {
            'update': { method: 'PUT' }
        });
})

.factory('TodosComprobante', ['TodoComprobanteContabilidad', '$q', function (TodoComprobanteContabilidad, $q) {
    var res = function (empresa,inicio,fin) {
        var delay = $q.defer();
        TodoComprobanteContabilidad.get({empresa:empresa,inicio:inicio,fin:fin }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])