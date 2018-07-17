angular.module('agil.servicios')

    .factory('GestionesEEFF', function ($resource) {
        return $resource(restServer + "gestiones/:id_empresa'", null, {
            'update': { method: 'PUT' }
        });
    })

    .factory('ObtenerGestionesEEFF', ['GestionesEEFF', '$q', function (GestionesEEFF, $q) {
        var res = function (idEmpresa) {
            var delay = $q.defer();
            GestionesEEFF.query({id_empresa:idEmpresa},function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                    delay.reject(error);
                });
            return delay.promise;
        };
        return res;
    }])
    .factory('GuardarGestionesEEFF', ['GestionesEEFF', '$q', function (GestionesEEFF, $q) {
        var res = function (idEmpresa,datos) {
            var delay = $q.defer();
            GestionesEEFF.save({id_empresa:idEmpresa},datos,function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                    delay.reject(error);
                });
            return delay.promise;
        };
        return res;
    }]);