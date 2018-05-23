angular.module('agil.servicios')
.factory('PedidosEmpresa', function ($resource) {
    return $resource(restServer + "bancos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda");
})

.factory('PedidosFiltro', ['PedidosEmpresa', '$q', function (PedidosEmpresa, $q) {
    var res = function (idEmpresa, pagina, itemsPagina, texto) {
        var delay = $q.defer();
        PedidosEmpresa.get({ id_empresa: idEmpresa, pagina: pagina, items_pagina: itemsPagina, texto_busqueda: texto }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])