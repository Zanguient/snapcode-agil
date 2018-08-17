angular.module('agil.servicios')

.factory('Alias', function ($resource) {
    return $resource(restServer + "cliente/empresa/alias/:id_empresa/:id_usuario");
})

.factory('Gerencia', function ($resource) {
    return $resource(restServer + "cliente/empresa/gerencias/:id_empresa/:id_usuario");
})

.factory('Comensal', function ($resource) {
    return $resource(restServer + "cliente/empresa/comensales/:id_empresa/:id_usuario");
})

.factory('Comida', function ($resource) {
    return $resource(restServer + "cliente/empresa/horarios/comida/:id_empresa/:id_usuario/:id_cliente");
})

.factory('PrecioComida', function ($resource) {
    return $resource(restServer + "cliente/empresa/precio/comida/:id_empresa/:id_usuario/:id_cliente");
})
.factory('GuardarAlias', ['Alias', '$q', function (Alias, $q) {
    var res = function (idEmpresa, alias, usuario) {
        var delay = $q.defer();
        Alias.save({ id_empresa: idEmpresa, id_usuario: usuario }, alias, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ObtenerAlias', ['Alias', '$q', function (Alias, $q) {
    var res = function (idEmpresa, usuario) {
        var delay = $q.defer();
        Alias.get({ id_empresa: idEmpresa, id_usuario: usuario}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarGerencias', ['Gerencia', '$q', function (Gerencia, $q) {
    var res = function (idEmpresa, comensal, usuario) {
        var delay = $q.defer();
        Gerencia.save({ id_empresa: idEmpresa, id_usuario: usuario }, comensal, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ObtenerGerencias', ['Gerencia', '$q', function (Gerencia, $q) {
    var res = function (idEmpresa, usuario) {
        var delay = $q.defer();
        Gerencia.get({ id_empresa: idEmpresa, id_usuario: usuario}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarComensales', ['Comensal', '$q', function (Comensal, $q) {
    var res = function (idEmpresa, gerencia, usuario) {
        var delay = $q.defer();
        Comensal.save({ id_empresa: idEmpresa, id_usuario: usuario }, gerencia, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ObtenerComensales', ['Comensal', '$q', function (Comensal, $q) {
    var res = function (idEmpresa, usuario) {
        var delay = $q.defer();
        Comensal.get({ id_empresa: idEmpresa, id_usuario: usuario}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarComidas', ['Comida', '$q', function (Comida, $q) {
    var res = function (idEmpresa, comida, usuario, cliente) {
        var delay = $q.defer();
        Comida.save({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente }, comida, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ObtenerComidas', ['Comida', '$q', function (Comida, $q) {
    var res = function (idEmpresa, usuario, cliente) {
        var delay = $q.defer();
        Comida.get({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarPrecioComidas', ['PrecioComida', '$q', function (PrecioComida, $q) {
    var res = function (idEmpresa, precioComida, usuario, cliente) {
        var delay = $q.defer();
        PrecioComida.save({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente }, precioComida, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ObtenerPrecioComidas', ['PrecioComida', '$q', function (PrecioComida, $q) {
    var res = function (idEmpresa, usuario, cliente) {
        var delay = $q.defer();
        PrecioComida.get({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
