angular.module('agil.servicios')

    .factory('Proformas', function ($resource) {
        return $resource(restServer + "proformas/empresa/:id_empresa/mes/:mes/anio/:anio/suc/:sucursal/act/:actividad/ser/:servicio/monto/:monto/razon/:razon/usuario/:usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/num/:numero/facturas/:id_opcion", {},
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('GenerarProformas', function ($resource) {
        return $resource(restServer + "guardar/proforma/:id_empresa/:usuario",
            {
                'update': { method: 'PUT' }
            });
    })
    

    .factory('FiltroProformas', ['Proformas', '$q', function (Proformas, $q) {
        // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
        var res = function (filtro) {
            var delay = $q.defer();
            Proformas.get({
                id_empresa: filtro.filter.empresa, usuario: filtro.filter.usuario, mes: filtro.filter.mes !== 0 && filtro.filter.mes !== undefined? filtro.filter.mes.id !== undefined ? filtro.filter.mes.id : filtro.filter.mes:0,
                anio: filtro.filter.anio !== 0 && filtro.filter.anio !== undefined ? filtro.filter.anio.id !== undefined ? filtro.filter.anio.id : filtro.filter.anio : 0, sucursal: filtro.filter.sucursal.id !== undefined ? filtro.filter.sucursal.id : 0, actividad: filtro.filter.actividadEconomica !== undefined ? filtro.filter.actividadEconomica.id_actividad !== undefined ? filtro.filter.actividadEconomica.id_actividad : 0 : 0, monto: filtro.filter.monto, razon: filtro.filter.razon,
                servicio: filtro.filter.servicio.id !== undefined ? filtro.filter.servicio.id : 0, pagina: filtro.currentPage, items_pagina: filtro.itemsPerPage, busqueda: filtro.search, numero: filtro.filter.numero !== undefined ? filtro.filter.numero : 0, id_opcion: filtro.filter.proformaFacturadas !== undefined ? filtro.filter.proformaFacturadas.id ? filtro.filter.proformaFacturadas.id : 0  : 0
            }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('GuardarProformas', ['GenerarProformas', '$q', function (GenerarProformas, $q) {
        // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
        var res = function (id_empresa, usuario, proforma) {
            var delay = $q.defer();
            GenerarProformas.save({
                id_empresa: id_empresa, usuario: usuario}, proforma, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ActividadEmpresa', function ($resource) {
        return $resource(restServer + "actividades/empresa/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ActividadesEmpresa', ['ActividadEmpresa', '$q', function (ActividadEmpresa, $q) {
        // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
        var res = function (idEmpresa) {
            var delay = $q.defer();
            ActividadEmpresa.get({ id_empresa: idEmpresa }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('GuardarActividadesEmpresa', ['ActividadEmpresa', '$q', function (ActividadEmpresa, $q) {
        // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
        var res = function (idEmpresa, nuevasActividades) {
            var delay = $q.defer();
            ActividadEmpresa.save({ id_empresa: idEmpresa }, nuevasActividades, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ActividadServicio', function ($resource) {
        return $resource(restServer + "actividades/servicios/empresa/:id_empresa/:id_actividad", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ServiciosEmpresa', ['ActividadServicio', '$q', function (ActividadServicio, $q) {
        // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
        var res = function (idEmpresa, actividad) {
            var delay = $q.defer();
            ActividadServicio.get({ id_empresa: idEmpresa, id_actividad: actividad }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
    .factory('GuardarActividadServicio', ['ActividadServicio', '$q', function (ActividadServicio, $q) {
        // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
        var res = function (idEmpresa, actividad) {
            var delay = $q.defer();
            ActividadServicio.save({ id_empresa: idEmpresa, id_actividad: actividad }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('Proforma', function ($resource) {
        return $resource(restServer + "proforma/:id", {},
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('ProformasDetail', function ($resource) {
        return $resource(restServer + "proformas/:ids", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ActualizarProforma', ['Proforma', '$q', function (Proforma, $q) {
        var res = function (id, proforma) {
            var delay = $q.defer();
            Proforma.update({ id: id }, proforma, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ProformasInfo', ['ProformasDetail', '$q', function (ProformasDetail, $q) {
        var res = function (idProforma) {
            var delay = $q.defer();
            ProformasDetail.get({ ids: idProforma}, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('ProformaInfo', ['Proforma', '$q', function (Proforma, $q) {
        var res = function (idProforma) {
            var delay = $q.defer();
            Proforma.get({ id: idProforma}, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('fechasProforma', function ($resource) {
        return $resource(restServer + "fechas/proforma/:id", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('eliminarProforma', function ($resource) {
        return $resource(restServer + "eliminar/proforma/:id", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ProformaEliminar', ['eliminarProforma', '$q', function (eliminarProforma, $q) {
        var res = function (proforma) {
            var delay = $q.defer();
            eliminarProforma.save({ id: proforma.id }, proforma, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('alertasProformasLista', ['alertas', '$q', function (alertas, $q) {
        var res = function (idEmpresa) {
            var delay = $q.defer();
            alertas.get({ id_empresa: (idEmpresa !== null && idEmpresa !== undefined && idEmpresa !== "") ? idEmpresa : 0 }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('alertas', function ($resource) {
        return $resource(restServer + "alertas/proformas/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('alertasProformasLista', ['alertas', '$q', function (alertas, $q) {
        var res = function (idEmpresa) {
            var delay = $q.defer();
            alertas.get({ id_empresa: (idEmpresa !== null && idEmpresa !== undefined && idEmpresa !== "") ? idEmpresa : 0 }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('FacturarProformas', function ($resource) {
        return $resource(restServer + "proforma/facturar/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    // .factory('FacturarProformas', function ($resource) {
    //     return $resource(restServer + "ventas/factura/proformas", {},
    //         {
    //             'update': { method: 'PUT' }
    //         });
    // })

    .factory('FacturaProforma', ['FacturarProformas', '$q', function (FacturarProformas, $q) {
        var res = function (idEmpresa, proformas) {
            var delay = $q.defer();
            FacturarProformas.save({id_empresa: idEmpresa}, proformas, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('DetallesProformasAFacturar', function ($resource) {
        return $resource(restServer + "detalles/proforma/facturar/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ListaDetallesProformasAFacturar', ['DetallesProformasAFacturar', '$q', function (DetallesProformasAFacturar, $q) {
        var res = function (idEmpresa, idproformas) {
            var delay = $q.defer();
            DetallesProformasAFacturar.get({ id_empresa: idEmpresa }, idproformas, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('listaProformasFacturadas', function ($resource) {
        return $resource(restServer + "factura/:id_factura/proforma/facturada/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ProformasFacturadas', ['listaProformasFacturadas', '$q', function (listaProformasFacturadas, $q) {
        var res = function (idEmpresa, id_factura) {
            var delay = $q.defer();
            listaProformasFacturadas.get({ id_empresa: idEmpresa, id_factura }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('configuracionFacturaEmpresa', function ($resource) {
        return $resource(restServer + "configuracion/proforma/facturar/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ConfiguracionesFacturasProformas', ['configuracionFacturaEmpresa', '$q', function (configuracionFacturaEmpresa, $q) {
        var res = function (idEmpresa) {
            var delay = $q.defer();
            configuracionFacturaEmpresa.get({ id_empresa: idEmpresa }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    // sucursales/empresa/:id_empresa

    .factory('sucursalesEmpresa', function ($resource) {
        return $resource(restServer + "sucursales/empresa/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ListaSucursalesEmpresa', ['sucursalesEmpresa', '$q', function (sucursalesEmpresa, $q) {
        var res = function (idEmpresa, idproformas) {
            var delay = $q.defer();
            sucursalesEmpresa.get({ id_empresa: idEmpresa }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])


    .factory('ActividadesServiciosEmpresa', function ($resource) {
        return $resource(restServer + "actividades/servicios/:id_empresa", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ListaSucursalesActividadesDosificacionEmpresa', ['ActividadesServiciosEmpresa', '$q', function (ActividadesServiciosEmpresa, $q) {
        var res = function (idEmpresa, idproformas) {
            var delay = $q.defer();
            ActividadesServiciosEmpresa.get({ id_empresa: idEmpresa }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])


    .factory('proformaSucursalesUsuario', function ($resource) {
        return $resource(restServer + "proforma-sucursales/:id_usuario", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ListaSucursalesUsuario', ['proformaSucursalesUsuario', '$q', function (proformaSucursalesUsuario, $q) {
        var res = function (id_usuario) {
            var delay = $q.defer();
            proformaSucursalesUsuario.get({ id_usuario: id_usuario }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('actividadesHistorial', function ($resource) {
        return $resource(restServer + "actividades/historial/:id/:id_sucursal", {},
            {
                'update': { method: 'PUT' }
            });
    })

    .factory('ListaHistorialActividad', ['actividadesHistorial', '$q', function (actividadesHistorial, $q) {
        var res = function (id, id_sucursal) {
            var delay = $q.defer();
            actividadesHistorial.get({ id: id, id_sucursal: id_sucursal }, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])

    .factory('asignacionCentroCostosCliente', function ($resource) {
        return $resource(restServer + "clientes/centroCostos/:id_cliente",
            {
                'update': { method: 'PUT' }
            });
    })
    .factory('obtenerAsignacionCentroCosto', ['asignacionCentroCostosCliente', '$q', function (asignacionCentroCostosCliente, $q) {
        // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
        var res = function (clienteId) {
            var delay = $q.defer();
            asignacionCentroCostosCliente.get({
                id_cliente: clienteId}, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }]).factory('GuardarAsignacionCentroCosto', ['asignacionCentroCostosCliente', '$q', function (asignacionCentroCostosCliente, $q) {
        // :desde/:hasta/:sucursal/:almacen/:movimimento/:estado/:valuado
        var res = function (clienteId, listaAsignacion) {
            var delay = $q.defer();
            asignacionCentroCostosCliente.save({
                id_cliente: clienteId}, listaAsignacion, function (entidades) {
                delay.resolve(entidades);
            }, function (error) {
                delay.reject(error);
            });
            return delay.promise;
        };
        return res;
    }])
