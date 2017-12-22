angular.module('agil.servicios')

.factory('UsuarioRhOtroSeguro', function ($resource) {
    return $resource(restServer + "recursos-humanos-seguro/:id_seguro", {id_seguro:'@id_seguro'},
        {
            'update': { method: 'PUT' }
        });
})
.factory('EliminarOtroSeguroRh', ['UsuarioRhOtroSeguro', '$q', function (UsuarioRhOtroSeguro, $q) {
    var res = function (seguro)//idEmpresa, xxx
    {
        var delay = $q.defer();
        UsuarioRhOtroSeguro.update({
            id_seguro: seguro.id
                  },function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('UsuarioRhfamiliar', function ($resource) {
    return $resource(restServer + "recursos-humanos-familiar/:id_persona/familiar-relacion/:id_familiar",{id_persona:'@id_persona',id_familiar:"@id_familiar"},
        {
            'update': { method: 'PUT' }
        });
})
.factory('EliminarFamiliarRh', ['UsuarioRhfamiliar', '$q', function (UsuarioRhfamiliar, $q) {
    var res = function (familiar)//idEmpresa, xxx
    {
        var delay = $q.defer();
        UsuarioRhfamiliar.update({
            id_persona: familiar.persona.id,id_familiar:familiar.id,
                  },function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('RecursosHumanosEmpresaPaginador', function ($resource) {
    return $resource(restServer + "recursos-humanos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado");
})

.factory('RecursosHumanosPaginador', ['RecursosHumanosEmpresaPaginador', '$q', function (RecursosHumanosEmpresaPaginador, $q) {
    var res = function (paginator)//idEmpresa, xxx
    {
        var delay = $q.defer();
        RecursosHumanosEmpresaPaginador.get({
            id_empresa: paginator.filter.empresa,
            pagina: paginator.currentPage,
            items_pagina: paginator.itemsPerPage,
            texto_busqueda: paginator.search,
            columna: paginator.column,
            direccion: paginator.direction,
            codigo: paginator.filter.codigo,
            nombres: paginator.filter.nombres,
            ci: paginator.filter.ci,
            campo: paginator.filter.campo,
            cargo: paginator.filter.cargo,
            busquedaEmpresa: paginator.filter.busquedaEmpresa,
            estado: paginator.filter.estado,
            grupo_sanguineo: paginator.filter.grupo_sanguineo


        }, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('NuevoRecursoHumano', function ($resource) {
    return $resource(restServer + "recursos-humanos/:id_usuario", { id_usuario: '@id_usuario' },
        {
            'update': { method: 'PUT' }
        });
})
.factory('UsuarioRhActivo', function ($resource) {
    return $resource(restServer + "usuario-recurso-humano/:id_persona", null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('UsuarioRecursosHUmanosActivo', ['UsuarioRhActivo', '$q', function (UsuarioRhActivo, $q) {
    var res = function (empleado)//idEmpresa, xxx
    {
        var delay = $q.defer();
        UsuarioRhActivo.update({
            id_persona: empleado.id_persona
                  },empleado,function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('obtenerEmpleadoRh', ['NuevoRecursoHumano', '$q', function (NuevoRecursoHumano, $q) {
    var res = function (idEmpleado) {
        var delay = $q.defer();
        NuevoRecursoHumano.get({ id_usuario: idEmpleado}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])   
.factory('UsuarioRhFicha', function ($resource) {
    return $resource(restServer + "usuario-recurso-humano-ficha/empleado/:id_empleado", null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('UsuarioRecursosHumanosFicha', ['UsuarioRhFicha', '$q', function (UsuarioRhFicha, $q) {
    var res = function (idEmpleado)//idEmpresa, xxx
    {
        var delay = $q.defer();
        UsuarioRhFicha.get({
            id_empleado: idEmpleado
                  },function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('CrearEmpleadoFicha', ['UsuarioRhFicha', '$q', function (UsuarioRhFicha, $q) {
    var res = function (ficha) {
        var delay = $q.defer();
        UsuarioRhFicha.save({ id_empleado: 0 }, ficha, function (entidades) {
            delay.resolve(entidades);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])