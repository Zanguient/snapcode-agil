angular.module('agil.servicios')
.factory('ReportEstadoCuentasProveedoresDatos', function($resource) {
		return $resource(restServer+"reportes/estado-cuentas-proveedores/:id_empresa", {}, {
        show: { method: 'GET', isArray: true }       
    })
})

.factory('ReportEstadoCuentasClientesDatos', function($resource) {
		return $resource(restServer+"reportes/estado-cuentas-clientes/:id_empresa", {}, {
        show: { method: 'GET', isArray: true }       
    })
})
.factory('ReportEstadoCuentasClientesPaginador', function($resource) {
		return $resource(restServer+"reportes/estado-cuentas-clientes/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/cuentas-liquidadas/:cuentas_liquidadas");
})
.factory('ReporteClientesPaginador', ['ReportEstadoCuentasClientesPaginador','$q',function(ReportEstadoCuentasClientesPaginador, $q) 
  {
	var res = function(paginator) 
	{
		var delay = $q.defer();
		ReportEstadoCuentasClientesPaginador.get({
			id_empresa:paginator.filter.empresa,
			pagina: paginator.currentPage,
			items_pagina: paginator.itemsPerPage,
			texto_busqueda: paginator.search,
			cuentas_liquidadas:paginator.filter.cuentas_liquidadas},function(entidades) 
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

.factory('ReporteLibroCompras', function($resource) {
		return $resource(restServer+"reportes/libro-compras/:id_empresa/gestion/:gestion/mes/:mes");
})

.factory('ReporteLibroComprasDatos', ['ReporteLibroCompras','$q',function(ReporteLibroCompras, $q) 
  {
	var res = function(id_empresa,gestion,mes) 
	{
		var delay = $q.defer();
		ReporteLibroCompras.get({id_empresa:id_empresa,gestion:gestion,mes:mes},function(entidades) 
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
  
.factory('ReporteLibroVentas', function($resource) {
		return $resource(restServer+"reportes/libro-ventas/:id_empresa/gestion/:gestion/mes/:mes/movimiento/:id_movimiento");
})

.factory('ReporteLibroVentasDatos', ['ReporteLibroVentas','$q',function(ReporteLibroVentas, $q) 
  {
	var res = function(id_empresa,gestion,mes,idMov) 
	{
		if(!idMov){
			idMov=0
		}
		var delay = $q.defer();
		ReporteLibroVentas.get({id_empresa:id_empresa,gestion:gestion,mes:mes,id_movimiento:idMov},function(entidades) 
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
  
.factory('InventarioCosto', function($resource) {
		return $resource(restServer+"reportes/inventario/empresa/:id_empresa/sucursal/:id_sucursal/almacen/:id_almacen", null,
		{

			'update': { method:'PUT' }
		});
})

.factory('InventariosCosto', ['InventarioCosto','$q',function(InventarioCosto, $q) 
  {
	var res = function(id_empresa,id_sucursal,id_almacen) 
	{
		var delay = $q.defer();
		InventarioCosto.query({id_empresa:id_empresa,id_sucursal:id_sucursal,id_almacen:id_almacen},function(entidades) 
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

.factory('InventarioAlmacenPaginador', function($resource) {
		return $resource(restServer+"reportes/empresa/:id_empresa/sucursal/:id_sucursal/almacen/:id_almacen/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/user/:id_usuario");
})

.factory('InventarioPaginadorAlmacen', ['InventarioAlmacenPaginador','$q',function(InventarioAlmacenPaginador, $q) 
  {
	var res = function(idEmpresa,idSucursal,idAlmacen,pagina,itemsPagina,texto,columna,direccion, id_usuario) 
	{
		var delay = $q.defer();
		InventarioAlmacenPaginador.get({id_empresa:idEmpresa,id_sucursal:idSucursal,id_almacen:idAlmacen,pagina:pagina,items_pagina:itemsPagina,texto_busqueda:texto,columna:columna,direccion:direccion, id_usuario: id_usuario},function(entidades) 
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

.factory('InventarioAlmacenReporte', function($resource) {
	return $resource(restServer+"reportes/empresa/:id_empresa/sucursal/:id_sucursal/almacen/:id_almacen/user/:id_usuario");
})

.factory('InventarioReporteAlmacen', ['InventarioAlmacenReporte','$q',function(InventarioAlmacenReporte, $q) 
{
var res = function(idEmpresa,idSucursal,idAlmacen, id_usuario) 
{
	var delay = $q.defer();
	InventarioAlmacenReporte.get({id_empresa:idEmpresa,id_sucursal:idSucursal,id_almacen:idAlmacen, id_usuario: id_usuario},function(entidades) 
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

.factory('ReporteVentasMensuales', function($resource) {
		return $resource(restServer+"reportes/ventas-mensuales/:id_empresa/sucursal/:id_sucursal/inicio/:inicio/fin/:fin");
})

.factory('ReporteVentasMensualesDatos', ['ReporteVentasMensuales','$q',function(ReporteVentasMensuales, $q) 
  {
	var res = function(id_empresa,id_sucursal,inicio,fin) 
	{
		var delay = $q.defer();
		ReporteVentasMensuales.get({id_empresa:id_empresa,id_sucursal:id_sucursal,inicio:inicio,fin:fin},function(entidades) 
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

.factory('ReporteComprasMensuales', function($resource) {
		return $resource(restServer+"reportes/compras-mensuales/:id_empresa/sucursal/:id_sucursal/inicio/:inicio/fin/:fin");
})

.factory('ReporteComprasMensualesDatos', ['ReporteComprasMensuales','$q',function(ReporteComprasMensuales, $q) 
  {
	var res = function(id_empresa,id_sucursal,inicio,fin) 
	{
		var delay = $q.defer();
		ReporteComprasMensuales.get({id_empresa:id_empresa,id_sucursal:id_sucursal,inicio:inicio,fin:fin},function(entidades) 
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
  
.factory('ReporteEstadoResultadosNoContable', function($resource) {
		return $resource(restServer+"ventas/:id_empresa/inicio/:inicio/fin/:fin", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ReporteEstadoResultadosNoContableDatos', ['ReporteEstadoResultadosNoContable','$q',function(ReporteEstadoResultadosNoContable, $q) 
  {
	var res = function(idEmpresa,inicio,fin) 
	{
		var delay = $q.defer();
		ReporteEstadoResultadosNoContable.query({id_empresa:idEmpresa,inicio:inicio,fin:fin},function(entidades) 
		{        
			delay.resolve(entidades);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }]);
