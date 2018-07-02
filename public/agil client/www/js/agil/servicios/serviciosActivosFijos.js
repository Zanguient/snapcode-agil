angular.module('agil.servicios')
    .factory('ActivosPaginador', function ($resource) {
        return $resource(restServer + "activos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/mes/:mes/year/:anio/codigo/:codigo/estado/:estado/vida/:vida_util");
    })

    .factory('ActivosFijosEmpresa', ['ActivosPaginador', '$q', function (ActivosPaginador, $q) {
        var res = function (idEmpresa, paginador) {
            var delay = $q.defer();
            ActivosPaginador.get({
                id_empresa: idEmpresa,
                pagina: paginador.currentPage,
                items_pagina: paginador.itemsPerPage,
                texto_busqueda: paginador.search,
                mes: paginador.filter.mes,
                anio: paginador.filter.anio,
                subGrupo: paginador.filter.subGrupo,
                codigo: paginador.filter.codigo,
                estado: paginador.filter.estado,
                vida_util: paginador.filter.vida_util
            }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ConfiguracionActivos', function ($resource) {
        return $resource(restServer + "activos/configuracion/empresa/:id_empresa/:id_usuario");
    })

    .factory('GuardarConfiguracionActivosFijos', ['ConfiguracionActivos', '$q', function (ConfiguracionActivos, $q) {
        var res = function (idEmpresa, usuario, configuracion) {
            var delay = $q.defer();
            ConfiguracionActivos.save({ id_empresa: idEmpresa, id_usuario: usuario }, configuracion, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ObtenerConfiguracionActivosFijos', ['ConfiguracionActivos', '$q', function (ConfiguracionActivos, $q) {
        var res = function (idEmpresa, usuario) {
            var delay = $q.defer();
            ConfiguracionActivos.get({ id_empresa: idEmpresa, id_usuario: usuario }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('Revaluacion', function ($resource) {
        return $resource(restServer + "activos/revaluacion/:id_empresa/user/:id_usuario", null,
        {
			'update': { method: 'PUT' }
		});
    })

    .factory('RevaluarActivo', ['Revaluacion', '$q', function (Revaluacion, $q) {
        var res = function (activo, idEmpresa, usuario) {
            var delay = $q.defer();
            Revaluacion.update({ id_empresa: idEmpresa, id_usuario: usuario }, activo, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])