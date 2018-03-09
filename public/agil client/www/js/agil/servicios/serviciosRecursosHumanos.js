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
    return $resource(restServer + "recursos-humanos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/codigo/:codigo/nombres/:nombres/ci/:ci/campo/:campo/cargo/:cargo/busquedaEmpresa/:busquedaEmpresa/grupo/:grupo_sanguineo/estado/:estado/apellido/:apellido");
})

.factory('RecursosHumanosPaginador', ['RecursosHumanosEmpresaPaginador', '$q', function (RecursosHumanosEmpresaPaginador, $q) {
    var res = function (paginator)//idEmpresa, xxx
    {
        
        var grupo_sanguineo = (paginator.filter.grupo_sanguineo==undefined) ?  paginator.filter.grupo_sanguineo=0 :  paginator.filter.grupo_sanguineo
       var cargo = (paginator.filter.cargo==undefined) ?  paginator.filter.cargo=0 :  paginator.filter.cargo
        var estado = (paginator.filter.estado==undefined) ?  paginator.filter.estado=0 :  paginator.filter.estado
        var apellido = (paginator.filter.apellido==undefined) ?  paginator.filter.apellido=0 :  paginator.filter.apellido
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
            grupo_sanguineo: grupo_sanguineo,
            apellido:apellido

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
    return $resource(restServer + "recursos-humanos/prestamos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/plazo/:plazo/inicio/:inicio/fin/:fin/nombre/:nombre/cuenta-liquida/:cuentas_liquidas",
        {
            'update': { method: 'PUT' }
        });
})
.factory('ObtenerListaPrestamo', ['HistorialPrestamos', '$q', function (HistorialPrestamos, $q) {
    var res = function (paginator) {
        var delay = $q.defer();
        HistorialPrestamos.get({ id_empresa: paginator.filter.empresa,pagina:paginator.currentPage,items_pagina:paginator.itemsPerPage,texto_busqueda:paginator.search,columna:paginator.column,direccion:paginator.direction,plazo:paginator.filter.plazo,inicio:paginator.filter.inicio,fin:paginator.filter.fin,nombre:paginator.filter.nombre,cuentas_liquidas:paginator.filter.cuentas_liquidas}, function (entidad) {
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
.factory('ListRolTurnoEmpleados', function ($resource) {
    return $resource(restServer + "recursos-humanos/empresa/:id_empresa/rolTurno/empleado/:id_empleado",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('ListaRolTurnos', ['ListRolTurnoEmpleados', '$q', function (ListRolTurnoEmpleados, $q) {
    var res = function (idEmpresa,idEmpleado) {
        var delay = $q.defer();
        ListRolTurnoEmpleados.get({ id_empresa: idEmpresa,id_empleado:idEmpleado}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}]) 
.factory('ValidarCodigoCuentaEmpleado', function($resource) {
	return $resource(restServer+"validar-codigo-empleado",
	{
		'update': { method:'PUT' }
	});
})
.factory('CapacidadesEmpleado', function ($resource) {
    return $resource(restServer + "recurso-humanos/capacidades/hoja-vida/:id_hoja_vida/inicio/:inicio/fin/:fin/tipo/:tipo",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('DatosCapacidadesImpresion', ['CapacidadesEmpleado', '$q', function (CapacidadesEmpleado, $q) {
    var res = function (filtro,idhojaVida) {
        var delay = $q.defer();
        CapacidadesEmpleado.get({id_hoja_vida:idhojaVida,inicio:filtro.inicio,fin:filtro.fin,tipo:filtro.tipo}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}]) 
.factory('ConfiguracionVacaciones', function ($resource) {
    return $resource(restServer + "recursos-humanos/configuracion/vacacion",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('ConfiguracionesVacacion', ['ConfiguracionVacaciones', '$q', function (ConfiguracionVacaciones, $q) {
    var res = function () {
        var delay = $q.defer();
        ConfiguracionVacaciones.query( function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}]).factory('HistorialGestionVacacion', function ($resource) {
    return $resource(restServer + "recursos-humanos/historial/gestion/vacacion/empleado/:id",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('HistorialGestionesVacacion', ['HistorialGestionVacacion', '$q', function (HistorialGestionVacacion, $q) {
    var res = function (idEmpleado) {
        var delay = $q.defer();
        HistorialGestionVacacion.query({id:idEmpleado}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('EmpleadoAnticipo', function ($resource) {
    return $resource(restServer + "recursos-humanos/anticipos/empleado/:id_empleado",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('NuevoAnticipoEmpleado', ['EmpleadoAnticipo', '$q', function (EmpleadoAnticipo, $q) {
    var res = function (idEmpleado,datos) {
        var delay = $q.defer();
        EmpleadoAnticipo.save({id_empleado:idEmpleado},datos, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('ActualizarAnticipoEmpleado', ['EmpleadoAnticipo', '$q', function (EmpleadoAnticipo, $q) {
    var res = function (idEmpleado,datos) {
        var delay = $q.defer();
        EmpleadoAnticipo.update({id_empleado:idEmpleado},datos, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('CrearEmpleadosAnticipos', function ($resource) {
    return $resource(restServer + "recursos-humanoss/anticipos/empleados",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('CrearNuevosAnticiposEmpleados', ['CrearEmpleadosAnticipos', '$q', function (CrearEmpleadosAnticipos, $q) {
    var res = function (datos) {
        var delay = $q.defer();
        CrearEmpleadosAnticipos.save(null,datos, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('EmpleadosAnticipos', function ($resource) {
    return $resource(restServer + "recursos-humanos/anticipos/empleado/:id_empleado/inicio/:inicio/fin/:fin/empresa/:id_empresa",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('ListaAnticiposEmpleado', ['EmpleadosAnticipos', '$q', function (EmpleadosAnticipos, $q) {
    var res = function (filtro,idEmpleado) {
        var delay = $q.defer();
        EmpleadosAnticipos.get({id_empleado:idEmpleado,inicio:filtro.inicio,fin:filtro.fin,id_empresa:filtro.id_empresa}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('EmpleadoAusencia', function ($resource) {
    return $resource(restServer + "recursos-humanos/ausencia/empleado/:id_empleado",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('NuevaAusenciaEmpleado', ['EmpleadoAusencia', '$q', function (EmpleadoAusencia, $q) {
    var res = function (idEmpleado,datos) {
        var delay = $q.defer();
        EmpleadoAusencia.save({id_empleado:idEmpleado},datos, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('EmpleadoListaAusencias', function ($resource) {
    return $resource(restServer + "recursos-humanos/ausencias/empleado/:id_empleado/inicio/:inicio/fin/:fin/tipo-ausencia/:tipo_ausencia/tipo/:tipo",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('HistorialEmpleadoAusencias', ['EmpleadoListaAusencias', '$q', function (EmpleadoListaAusencias, $q) {
    var res = function (idEmpleado,filtro,tipo) {
        var delay = $q.defer();
        EmpleadoListaAusencias.query({id_empleado: idEmpleado,inicio:filtro.inicio,fin:filtro.fin,tipo_ausencia:filtro.tipo_ausencia,tipo:tipo}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('EmpresaListaAusencias', function ($resource) {
    return $resource(restServer + "recursos-humanos/ausencias/empresa/:id_empresa/inicio/:inicio/fin/:fin/tipo-ausencia/:tipo_ausencia/tipo/:tipo",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('HistorialEmpresaEmpleadosAusencias', ['EmpresaListaAusencias', '$q', function (EmpresaListaAusencias, $q) {
    var res = function (idEmpresa,filtro,tipo) {
        var delay = $q.defer();
        EmpresaListaAusencias.query({id_empresa: idEmpresa,inicio:filtro.inicio,fin:filtro.fin,tipo_ausencia:filtro.tipo_ausencia,tipo:tipo}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
//vacaciones

.factory('EmpleadoVacacion', function ($resource) {
    return $resource(restServer + "recursos-humanos/vacacion/empleado/:id_empleado",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('NuevaVacacionEmpleado', ['EmpleadoVacacion', '$q', function (EmpleadoVacacion, $q) {
    var res = function (idEmpleado,datos) {
        var delay = $q.defer();
        EmpleadoVacacion.save({id_empleado:idEmpleado},datos, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('EmpleadoListaVacaciones', function ($resource) {
    return $resource(restServer + "recursos-humanos/vacacion/empleado/:id_empleado/inicio/:inicio/fin/:fin",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('HistorialEmpleadoVacaciones', ['EmpleadoListaVacaciones', '$q', function (EmpleadoListaVacaciones, $q) {
    var res = function (idEmpleado,filtro) {
        var delay = $q.defer();
        EmpleadoListaVacaciones.query({id_empleado: idEmpleado,inicio:filtro.inicio,fin:filtro.fin}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('EmpresaListaVacaciones', function ($resource) {
    return $resource(restServer + "recursos-humanos/vacacion/empresa/:id_empresa/inicio/:inicio/fin/:fin",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('HistorialEmpresaVacaciones', ['EmpresaListaVacaciones', '$q', function (EmpresaListaVacaciones, $q) {
    var res = function (idEmpresa,filtro) {
        var delay = $q.defer();
        EmpresaListaVacaciones.query({id_empresa: idEmpresa,inicio:filtro.inicio,fin:filtro.fin}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('EmpresaFeriados', function ($resource) {
    return $resource(restServer + "recursos-humanos/vacacion/feriados/empresa/:id_empresa",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('NuevoFeriado', ['EmpresaFeriados', '$q', function (EmpresaFeriados, $q) {
    var res = function (idEmpresa,datos,feriadosEliminados) {
        var delay = $q.defer();
        EmpresaFeriados.save({id_empresa:idEmpresa},{feriados:datos,feriadosEliminados:feriadosEliminados}, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])

.factory('ListaFeriados', ['EmpresaFeriados', '$q', function (EmpresaFeriados, $q) {
    var res = function (idEmpresa) {
        var delay = $q.defer();
        EmpresaFeriados.query({id_empresa:idEmpresa},function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('ClasesAusencias', function ($resource) {
    return $resource(restServer + "recursos-humanos/ausencia/clases/tipo/:tipo",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('GuardarClasesAusencias', ['ClasesAusencias', '$q', function (ClasesAusencias, $q) {
    var res = function (datos,tipo) {
        var delay = $q.defer();
        ClasesAusencias.save({tipo:tipo},datos, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('Tr3', function ($resource) {
    return $resource(restServer + "recursos-humanos/tr3/empresa/:id_empresa",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('GuardarTr3', ['Tr3', '$q', function (Tr3, $q) {
    var res = function (datos,id_empresa) {
        var delay = $q.defer();
        Tr3.save({id_empresa:id_empresa},datos, function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
.factory('ListaTr3', function ($resource) {
    return $resource(restServer + "recursos-humanos/tr3/empresa/:id_empresa/banco/:nombre",null,
        {
            'update': { method: 'PUT' }
        });
})
.factory('ListaTr3Empresa', ['ListaTr3', '$q', function (ListaTr3, $q) {
    var res = function (id_empresa,nombre) {
        var delay = $q.defer();
        ListaTr3.query({id_empresa:id_empresa,nombre:nombre},function (entidad) {
            delay.resolve(entidad);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    return res;
}])
