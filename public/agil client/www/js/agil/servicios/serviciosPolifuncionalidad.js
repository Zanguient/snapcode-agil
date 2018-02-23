angular.module('agil.servicios')

    .factory('obtenerPersonal', function ($resource) {
        return $resource(restServer + "todo/personal/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ObtenerTodoPersonal', ['obtenerPersonal', '$q', function (obtenerPersonal, $q) {
        var res = function (id_empresa) {
            var delay = $q.defer();
            obtenerPersonal.get({ id_empresa: id_empresa }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('filtroEvaluaciones', function ($resource) {
        return $resource(restServer + "personal/filtro/:id_empresa/:mes/:anio/:desempenio/:mas_campo/:campo/:cargo/:estado/:codigo/:nombre/:apellido/:pagina/:items_pagina/:columna/:direccion/fiu", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ObtenerEvaluaciones', ['filtroEvaluaciones', '$q', function (filtroEvaluaciones, $q) {
        var res = function (paginador) {
            var delay = $q.defer();
            var params = {
                id_empresa: paginador.filter.id_empresa,
                mes: paginador.filter.mes,
                anio: paginador.filter.anio,
                desempenio: paginador.filter.desempenio,
                mas_campo: paginador.filter.mas_campo,
                campo: paginador.filter.campo,
                cargo: paginador.filter.cargo,
                estado: paginador.filter.estado,
                codigo: paginador.filter.codigo,
                nombre: paginador.filter.nombre,
                apellido: paginador.filter.apellido,
                pagina: paginador.currentPage,
                items_pagina: paginador.itemsPerPage,
                columna: paginador.column,
                direccion: paginador.direction
            }
            filtroEvaluaciones.get(params, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('EvaluacionPersonal', function ($resource) {
        return $resource(restServer + "evaluacion/personal/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('GuardarEvaluacionPersonal', ['EvaluacionPersonal', '$q', function (EvaluacionPersonal, $q) {
        var res = function (id_empresa, evaluacion) {
            var delay = $q.defer();
            // var params = {
            //     id_empresa: paginador.filter.id_empresa, 
            //     mes:paginador.filter.mes, 
            //     anio: paginador.filter.anio, 
            //     desempenio: paginador.filter.desempenio, 
            //     mas_campo: paginador.filter.mas_campo,
            //     campo: paginador.filter.campo,
            //     cargo: paginador.filter.cargo,
            //     estado: paginador.filter.estado,
            //     codigo: paginador.filter.codigo,
            //     nombre: paginador.filter.nombre,
            //     apellido: paginador.filter.apellido,
            //     pagina: paginador.currentPage,
            //     items_pagina: paginador.itemsPerPage,
            //     columna: paginador.column,
            //     direccion: paginador.direction
            // }
            EvaluacionPersonal.save({ id_empresa: id_empresa }, evaluacion, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ReporteMeses', function ($resource) {
        return $resource(restServer + "reportes/:desde_mes/:desde_anio/:hasta_mes/:hasta_anio", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ObtenerReportePorMeses', ['ReporteMeses', '$q', function (ReporteMeses, $q) {
        var res = function (fromMonth, fromYear, untilMonth, untilYear) {
            var delay = $q.defer();
            ReporteMeses.get({ desde_mes: fromMonth.id, desde_anio: fromYear.id, hasta_mes: untilMonth.id, hasta_anio: untilYear.id }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ReporteAnual', function ($resource) {
        return $resource(restServer + "reportes/anual/:anio/campos", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ObtenerReportePorAnio', ['ReporteAnual', '$q', function (ReporteAnual, $q) {
        var res = function (year) {
            var delay = $q.defer();
            ReporteAnual.get({ anio: year}, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])