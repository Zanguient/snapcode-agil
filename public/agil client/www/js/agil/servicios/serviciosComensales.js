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

.factory('HistorialExcel', function ($resource) {
    return $resource(restServer + "cliente/empresa/excel/historial/:id_empresa/:id_usuario/:id_cliente");
})

.factory('Historial', function ($resource) {
    return $resource(restServer + "cliente/empresa/historial/:id_empresa/:id_usuario/:id_cliente/:desde/:hasta/:periodoMes/:periodoAnio/:empresaCliente/:gerencia/:empleado/:comida/:estado/:pagina/:items_pagina");
})

.factory('ComensalesExcel', function ($resource) {
    return $resource(restServer + "cliente/empresa/excel/comensal/:id_empresa/:id_usuario");
})

.factory('AliasExcel', function ($resource) {
    return $resource(restServer + "cliente/empresa/excel/alias/:id_empresa/:id_usuario/:id_cliente/:desde/:hasta");
})

.factory('GerenciasExcel', function ($resource) {
    return $resource(restServer + "cliente/empresa/excel/gerencias/:id_empresa/:id_usuario/:id_cliente");
})

.factory('ComidasExcel', function ($resource) {
    return $resource(restServer + "cliente/empresa/excel/comidas/:id_empresa/:id_usuario/:id_cliente");
})

.factory('PreciosExcel', function ($resource) {
    return $resource(restServer + "cliente/empresa/excel/precios/:id_empresa/:id_usuario/:id_cliente");
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

.factory('ObtenerHistorial', ['Historial', '$q', function (Historial, $q) {
    var res = function (idEmpresa, usuario, cliente, filtro) {
        var delay = $q.defer();
        Historial.get({ 
            id_empresa: idEmpresa, 
            id_usuario: usuario, 
            id_cliente: cliente, 
            desde: filtro.filter.desde ? filtro.filter.desde !== "" ? filtro.filter.desde : 0 : 0, 
            hasta: filtro.filter.hasta ? filtro.filter.hasta !== "" ? filtro.filter.hasta : 0 : 0, 
            periodoMes: 0, 
            periodoAnio: 0,
            empresaCliente: 0, 
            gerencia: 0, 
            empleado: 0, 
            comida: 0, 
            estado: 0,
            pagina: filtro.currentPage,
            items_pagina: filtro.itemsPerPage
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarHistorialExcel', ['HistorialExcel', '$q', function (HistorialExcel, $q) {
    var res = function (idEmpresa, lista, usuario, cliente) {
        var delay = $q.defer();
        HistorialExcel.save({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente }, lista, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;

}])
.factory('GuardarComensalesExcel', ['ComensalesExcel', '$q', function (ComensalesExcel, $q) {
    var res = function (idEmpresa, lista, usuario, cliente) {
        var delay = $q.defer();
        ComensalesExcel.save({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente}, lista, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarEmpresasExcel', ['AliasExcel', '$q', function (AliasExcel, $q) {
    var res = function (idEmpresa, lista, usuario, cliente) {
        var delay = $q.defer();
        AliasExcel.save({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente}, lista, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarGerenciasExcel', ['GerenciasExcel', '$q', function (GerenciasExcel, $q) {
    var res = function (idEmpresa, lista, usuario, cliente) {
        var delay = $q.defer();
        GerenciasExcel.save({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente}, lista, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarComidasExcel', ['ComidasExcel', '$q', function (ComidasExcel, $q) {
    var res = function (idEmpresa, lista, usuario, cliente) {
        var delay = $q.defer();
        ComidasExcel.save({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente}, lista, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('GuardarPreciosExcel', ['PreciosExcel', '$q', function (PreciosExcel, $q) {
    var res = function (idEmpresa, lista, usuario, cliente) {
        var delay = $q.defer();
        PreciosExcel.save({ id_empresa: idEmpresa, id_usuario: usuario, id_cliente: cliente}, lista, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])