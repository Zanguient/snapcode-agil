angular.module('agil.servicios')
.factory('Cotizaciones',  ['$resource',function ($resource) {
		return $resource(restServer+"cotizaciones/empresa/:id_empresa",{id_empresa:'@id_empresa'},
		{
			'update': { method:'PUT' }
		});
}])
.factory('ListaCotizacion', ['Cotizaciones','$q',function(Cotizaciones, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		Cotizaciones.query({id_empresa:idEmpresa},function(entidades) 
		{        
			delay.resolve(entidades);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }])
.factory('Cotizacion',  ['$resource',function ($resource) {
		return $resource(restServer+"cotizacion/:id",  { id: '@id' },
		{
			'update': { method:'PUT' }
		});
}])

// .factory('Roles',  ['$resource',function ($resource) {
// 	return $resource(restServer+"cotizaciones/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion");
// })

// .factory('RolesList', ['Roles','$q',function(Roles, $q) 
// {
// var res = function(paginator) 
// {
// 	var delay = $q.defer();
// 	Roles.get({pagina:paginator.currentPage,items_pagina:paginator.itemsPerPage,texto_busqueda:paginator.search,columna:paginator.column,direccion:paginator.direction},function(entities) 
// 	{        
// 		delay.resolve(entities);
// 	}, function(error) 
// 		{
// 			delay.reject(error);				
// 		});
// 	return delay.promise;
// };
// 	return res;
// }])

.factory('FiltroCotizacionEmpresaPaginador',  ['$resource',function ($resource) {
	return $resource(restServer+"cotizaciones/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion");
}])

.factory('FiltroCotizacionPaginador', ['FiltroCotizacionEmpresaPaginador','$q',function(CotizacionEmpresaPaginador, $q) 
{
var res = function(idEmpresa,paginator,inicio,fin) 
{
	var delay = $q.defer();
	CotizacionEmpresaPaginador.get({id_empresa:idEmpresa,pagina:paginator.currentPage,items_pagina:paginator.itemsPerPage,texto_busqueda:paginator.search,inicio:inicio,fin:fin,columna:paginator.column,direccion:paginator.direction},function(entidades) 
	{        
		delay.resolve(entidades);
	}, function(error) 
		{
			delay.reject(error);
		});
	return delay.promise;
};
	return res;
}])


///////
.factory('CotizacionesFiltro',  ['$resource',function ($resource) {
	return $resource(restServer + "cotizaciones/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/importe/:importe/busqueda/:busqueda/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion/estado/:estado/sucursal/:sucursal/usuario/:usuario/razon-social/:razon_social/nit/:nit", null,
		{
			'update': { method: 'PUT' }
		});
}])

.factory('filtroCotizaciones', ['CotizacionesFiltro', '$q', function (CotizacionesFiltro, $q) {
	var res = function (paginator) {
		var delay = $q.defer();
		CotizacionesFiltro.get({ id_empresa: paginator.filter.empresa, 
									pagina: paginator.currentPage, 
									items_pagina: paginator.itemsPerPage,
									importe: paginator.filter.importe, 
									busqueda:paginator.search,
									estado: paginator.filter.estado, 
									inicio: paginator.filter.fecha_inicio,
									fin: paginator.filter.fecha_fin,
									columna:paginator.column,
									sucursal: paginator.filter.sucursal,
									usuario: paginator.filter.usuario,
									razon_social: paginator.filter.razon_social,
									nit: paginator.filter.nit,
								direccion:paginator.direction }, function (entidades) {
			delay.resolve(entidades);
		}, function (error) {
				delay.reject(error);
			});
		return delay.promise;
	};
	return res;
}])

.factory('CotizacionesPendientesFiltro',  ['$resource',function ($resource) {
	return $resource(restServer + "cotizaciones-pendientes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/importe/:importe/busqueda/:busqueda/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion", null,
		{
			'update': { method: 'PUT' }
		});
}])

.factory('filtroCotizacionesPendientes', ['CotizacionesPendientesFiltro', '$q', function (CotizacionesPendientesFiltro, $q) {
	var res = function (paginator) {
		var delay = $q.defer();
		CotizacionesPendientesFiltro.get({ id_empresa: paginator.filter.empresa, 
									pagina: paginator.currentPage, 
									items_pagina: paginator.itemsPerPage,
									importe: paginator.filter.importe, 
									busqueda:paginator.search,
									inicio: paginator.filter.fecha_inicio,
									fin: paginator.filter.fecha_fin,
									columna:paginator.column,
								direccion:paginator.direction }, function (entidades) {
			delay.resolve(entidades);
		}, function (error) {
				delay.reject(error);
			});
		return delay.promise;
	};
	return res;
}])

// .factory('CotizacionEmpresaPaginador',  ['$resource',function ($resource) {
// 	return $resource(restServer+"cotizaciones/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion");
// })

// .factory('CotizacionPaginador', ['CotizacionEmpresaPaginador','$q',function(CotizacionEmpresaPaginador, $q) 
// {
// var res = function(idEmpresa,paginator,inicio,fin) 
// {
// 	var delay = $q.defer();
// 	CotizacionEmpresaPaginador.get({id_empresa:idEmpresa,pagina:paginator.currentPage,items_pagina:paginator.itemsPerPage,texto_busqueda:paginator.search,inicio:inicio,fin:fin,columna:paginator.column,direccion:paginator.direction},function(entidades) 
// 	{        
// 		delay.resolve(entidades);
// 	}, function(error) 
// 		{
// 			delay.reject(error);
// 		});
// 	return delay.promise;
// };
// 	return res;
// }])

.factory('ConfiguracionCotizacionVista',  ['$resource',function ($resource) {
		return $resource(restServer+"empresas/:id_empresa/configuracion-cotizacion-vista", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('ConfiguracionCotizacionVistaDatos', ['ConfiguracionCotizacionVista','$q',function(ConfiguracionCotizacionVista, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		ConfiguracionCotizacionVista.get({id_empresa:id_empresa},function(entidades) 
		{        
			delay.resolve(entidades);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }])
  	.factory('DatosConfiguracionCotizacion',  ['$resource',function ($resource) {
		return $resource(restServer+"cotizacion/:id/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
	}])
	.factory('DatosImpresionCotizacion', ['DatosConfiguracionCotizacion','$q',function(DatosConfiguracionCotizacion, $q) 
		{
		var res = function(id_cotizacion,id_empresa) 
		{
			var delay = $q.defer();
			DatosConfiguracionCotizacion.get({id:id_cotizacion,id_empresa:id_empresa},function(entidad) 
			{        
				delay.resolve(entidad);
			}, function(error) 
				{
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	
	.factory('lastIdCotizacion',  ['$resource',function ($resource) {
		return $resource(restServer+"cotizacion/ultima",
		{
			'update': { method:'PUT' }
		});
	}])
	.factory('ultimaCotizacion', ['lastIdCotizacion','$q',function(lastIdCotizacion, $q) 
		{
		var res = function() 
		{
			var delay = $q.defer();
			lastIdCotizacion.get(function(entidad) 
			{        
				delay.resolve(entidad);
			}, function(error) 
				{
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('CotizacionRechazo',  ['$resource',function ($resource) {
        return $resource(restServer + "cotizacion-rechazo/:id_cotizacion", { id_cotizacion: '@id_cotizacion' },
            {
                'update': { method: 'PUT' }
            });
    }])