angular.module('agil.servicios')
.factory('PedidosEmpresa', function ($resource) {
    return $resource(restServer + "pedidos/empresa/:id_empresa/desde/:desde/hasta/:hasta/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/tipo_pedido/:id_tipo/proveedor/:id_proveedor/nit/:nit/sucursal/:id_sucursal/estado/:estado/usuario/:usuario");
})

.factory('PedidosFiltro', ['PedidosEmpresa', '$q', function (PedidosEmpresa, $q) {
    var res = function (idEmpresa, paginador) {
        var delay = $q.defer();
        PedidosEmpresa.get({
            desde: paginador.filter.desde,
            hasta: paginador.filter.hasta, 
            id_empresa: idEmpresa, 
            pagina: paginador.currentPage, 
            items_pagina: paginador.itemsPerPage, 
            texto_busqueda: paginador.search,
            id_tipo: paginador.filter.tipo,
            id_proveedor: paginador.filter.proveedor,
            nit: paginador.filter.nit,
            id_sucursal: paginador.filter.sucursal,
            estado: paginador.filter.estado,
            usuario: paginador.filter.usuario
        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('Pedido', function ($resource) {
    return $resource(restServer + "pedidos/:id_empresa/:id_usuario");
})

.factory('GuardarPedido', ['Pedido', '$q', function (Pedido, $q) {
    var res = function (idEmpresa, pedido, usuario) {
        var delay = $q.defer();
        Pedido.save({ id_empresa: idEmpresa, id_usuario: usuario }, pedido, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ProveedoresOperaciones', function ($resource) {
    return $resource(restServer + "proveedores/:id_empresa");
})

.factory('ListaProveedores', ['ProveedoresOperaciones', '$q', function (ProveedoresOperaciones, $q) {
    var res = function (idEmpresa) {
        var delay = $q.defer();
        ProveedoresOperaciones.get({ id_empresa: idEmpresa}, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])