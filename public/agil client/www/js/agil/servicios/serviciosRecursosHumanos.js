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
        
        var grupo_sanguineo = (paginator.filter.grupo_sanguineo==undefined) ?  paginator.filter.grupo_sanguineo=0 :  paginator.filter.grupo_sanguineo
       var cargo = (paginator.filter.cargo==undefined) ?  paginator.filter.cargo=0 :  paginator.filter.cargo
        var estado = (paginator.filter.estado==undefined) ?  paginator.filter.estado=0 :  paginator.filter.estado
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
            cargo: cargo,
            busquedaEmpresa: paginator.filter.busquedaEmpresa,
            estado: estado,
            grupo_sanguineo: grupo_sanguineo


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
    return $resource(restServer + "usuario-recurso-humano/:id_empleado", null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('UsuarioRecursosHUmanosActivo', ['UsuarioRhActivo', '$q', function (UsuarioRhActivo, $q) {
    var res = function (empleado)//idEmpresa, xxx
    {
        var delay = $q.defer();
        UsuarioRhActivo.update({
            id_empleado: empleado.id
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
.factory('HistorialFicha', function ($resource) {
    return $resource(restServer + "usuario-ficha/:id_empleado",{ id_empleado: '@id_empleado' },
        {
            'update': { method: 'PUT' }
        });
})
.factory('UsuarioRhHistorialFicha', ['HistorialFicha', '$q', function (HistorialFicha, $q) {
    var res = function (idEmpleado)//idEmpresa, xxx
    {
        var delay = $q.defer();
        HistorialFicha.query({
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
.factory('UsuarioHojaVida', function ($resource) {
    return $resource(restServer + "usuario-hoja-vida/:id_empleado",{ id_empleado: '@id_empleado' },
        {
            'update': { method: 'PUT' }
        });
})
.factory('ObtenerEmpleadoHojaVida', ['UsuarioHojaVida', '$q', function (UsuarioHojaVida, $q) {
    var res = function (idEmpleado) {
        var delay = $q.defer();
        UsuarioHojaVida.get({ id_empleado: idEmpleado}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])   
.factory('GuardarEmpleadoHojaVida', ['UsuarioHojaVida', '$q', function (UsuarioHojaVida, $q) {
    var res = function (idEmpleado,hojaVida) {
        var delay = $q.defer();
        UsuarioHojaVida.save({ id_empleado: idEmpleado},hojaVida,function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}]) 
.factory('Prestamo', function ($resource) {
    return $resource(restServer + "recursos-humanos/prestamo/empleado/:id_empleado",{ id_empleado: '@id_empleado' },
        {
            'update': { method: 'PUT' }
        });
})
.factory('CrearPrestamo', ['Prestamo', '$q', function (Prestamo, $q) {
    var res = function (idEmpleado,prestamo) {
       
        var delay = $q.defer();
        Prestamo.save({ id_empleado: idEmpleado},prestamo, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}]) 
.factory('HistorialPrestamos', function ($resource) {
    return $resource(restServer + "recursos-humanos/prestamos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/plazo/:plazo/inicio/:inicio/fin/:fin/nombre/:nombre",
        {
            'update': { method: 'PUT' }
        });
})
.factory('ObtenerListaPrestamo', ['HistorialPrestamos', '$q', function (HistorialPrestamos, $q) {
    var res = function (paginator) {
        var delay = $q.defer();
        HistorialPrestamos.get({ id_empresa: paginator.filter.empresa,pagina:paginator.currentPage,items_pagina:paginator.itemsPerPage,texto_busqueda:paginator.search,columna:paginator.column,direccion:paginator.direction,plazo:paginator.filter.plazo,inicio:paginator.filter.inicio,fin:paginator.filter.fin,nombre:paginator.filter.nombre}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('RolTurno', function ($resource) {
    return $resource(restServer + "recursos-humanos/rolTurno/empleado/:id_empleado",{ id_empleado: '@id_empleado' },
        {
            'update': { method: 'PUT' }
        });
})
.factory('CrearRolTurno', ['RolTurno', '$q', function (RolTurno, $q) {
    var res = function (idEmpleado,rolTurno) {
        var delay = $q.defer();
        RolTurno.save({ id_empleado: idEmpleado},rolTurno, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('PagoPrestamo', function ($resource) {
    return $resource(restServer + "recursos-humanos/pago-prestamo/:id_prestamo/usuario/:id_usuario",{ id_prestamo: '@id_prestamo',id_usuario:'@id_usuario' },
        {
            'update': { method: 'PUT' }
        });
})
.factory('CrearPagoPrestamo', ['PagoPrestamo', '$q', function (PagoPrestamo, $q) {
    var res = function (idUsuario,idPrestamo,pago) {
        var delay = $q.defer();
        PagoPrestamo.save({ id_prestamo: idPrestamo,id_usuario:idUsuario},pago, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}]) 
.factory('EditPrestamo', function ($resource) {
    return $resource(restServer + "recursos-humanos/prestamo/:id_prestamo",{ id_prestamo: '@id_prestamo'},
        {
            'update': { method: 'PUT' }
        });
})
.factory('EditarPrestamo', ['EditPrestamo', '$q', function (EditPrestamo, $q) {
    var res = function (prestamo) {
        var delay = $q.defer();
        EditPrestamo.update({ id_prestamo: prestamo.id},prestamo, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}]) 
.factory('ListEmpleados', function ($resource) {
    return $resource(restServer + "recursos-humanos/empleados/:id_empresa",{ id_empresa: '@id_empresa'},
        {
            'update': { method: 'PUT' }
        });
})
.factory('ListaEmpleadosRrhh', ['ListEmpleados', '$q', function (ListEmpleados, $q) {
    var res = function (idEmpresa) {
        var delay = $q.defer();
        ListEmpleados.get({ id_empresa: idEmpresa}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}]) 
.factory('EmpleadoEmpresa', function ($resource) {
    return $resource(restServer + "empleados/empresa/excel/upload")
})

.factory('HorasExtra', function ($resource) {
    return $resource(restServer + "recursos-humanos/horas-extra/empleado/:id_empleado",{ id_empleado: '@id_empleado' },
        {
            'update': { method: 'PUT' }
        });
})
.factory('CrearHorasExtra', ['HorasExtra', '$q', function (HorasExtra, $q) {
    var res = function (idEmpleado,horasExtra) {
        var delay = $q.defer();
        HorasExtra.save({ id_empleado: idEmpleado},horasExtra, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('EmpleadoHorasExtra', function ($resource) {
    return $resource(restServer + "recursos-humanos/horas-extra/empleado/:id_empleado/inicio/:inicio/fin/:fin",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('HistorialHorasExtra', ['EmpleadoHorasExtra', '$q', function (EmpleadoHorasExtra, $q) {
    var res = function (idEmpleado,filtro) {
        var delay = $q.defer();
        EmpleadoHorasExtra.query({id_empleado: idEmpleado,inicio:filtro.inicio,fin:filtro.fin}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
