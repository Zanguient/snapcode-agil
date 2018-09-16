angular.module('agil.servicios')

    .factory('CuentasParaReporte', function ($resource) {
        return $resource(restServer + "reporte/patrimonio/empresa/:id_empresa/clasificacion/:id_clasificacion/tipo/:id_tipo");
    })


    .factory('ObtenerCuentrasReporte', ['CuentasParaReporte', '$q', function (CuentasParaReporte, $q) {
        var res = function (idEmpresa, clasificacion) {
            var delay = $q.defer();
            CuentasParaReporte.get({ id_empresa: idEmpresa, id_clasificacion: 0, id_tipo: clasificacion.id }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])