angular.module('agil.servicios')

.factory('Producto', function($resource) {
		return $resource(restServer+"productos/:idProducto", { idProducto: '@id' },
		{
			'update': { method:'PUT' }
		});
})
/*.factory('ProductoKardex', function($resource) {
		return $resource(restServer+"productos/kardex/:id_producto",{id_producto:'@id'},
		{
			'get': { method: 'GET'} 
		});
})*/
.factory('ProductosKardex', function($resource) {
		return $resource(restServer+"productos/kardex/:id_producto/almacen/:id_almacen/fecha-inicial/:fecha_inicio/fecha-final/:fecha_fin/lote/:lote");
})

.factory('ProductoKardex', ['ProductosKardex','$q',function(ProductosKardex, $q) 
  {
	var res = function(idProducto,idAlmacen,fechaInicio,fechaFin,lote) 
	{
		var delay = $q.defer();
		ProductosKardex.query({id_producto:idProducto,id_almacen:idAlmacen,fecha_inicio:fechaInicio,fecha_fin:fechaFin,lote:lote},function(entidades) 
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
.factory('ProductosEmpresaCreacion', function($resource) {
		return $resource(restServer+"productos/empresa");
})

.factory('ProductosEmpresa', function($resource) {
		return $resource(restServer+"productos/empresa/:idEmpresa");
})

.factory('Productos', ['ProductosEmpresa','$q',function(ProveedoresEmpresa, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		ProveedoresEmpresa.query({idEmpresa:idEmpresa},function(entidades) 
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
.factory('ProductosEmpresaPaginador', function($resource) {
		return $resource(restServer+"productos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion");
})

.factory('ProductosPaginador', ['ProductosEmpresaPaginador','$q',function(ProductosEmpresaPaginador, $q) 
  {
	var res = function(idEmpresa,paginator) 
	{
		var delay = $q.defer();
		ProductosEmpresaPaginador.get({id_empresa:idEmpresa,
																	pagina:paginator.currentPage, 
																	items_pagina:paginator.itemsPerPage,
																	texto_busqueda:paginator.search,
																	columna:paginator.column,
																	direccion:paginator.direction},function(entidades) 
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
  
.factory('BusquedaProductos', function($resource) {
		return $resource(restServer+"productos/empresa/:idEmpresa/almacen/:idAlmacen/texto/:texto");
})

.factory('ProductosNombre', ['BusquedaProductos','$q',function(BusquedaProductos, $q) 
  {
	var res = function(idEmpresa,idAlmacen,texto) 
	{
		var delay = $q.defer();
		BusquedaProductos.query({idEmpresa:idEmpresa,idAlmacen:idAlmacen,texto:texto},function(entidades) 
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
  
.factory('BusquedaProductosPanel', function($resource) {
		return $resource(restServer+"productos-panel/empresa/:idEmpresa/almacen/:idAlmacen");
})

.factory('ProductosPanel', ['BusquedaProductosPanel','$q',function(BusquedaProductosPanel, $q) 
  {
	var res = function(idEmpresa,idAlmacen) 
	{
		var delay = $q.defer();
		BusquedaProductosPanel.query({idEmpresa:idEmpresa,idAlmacen:idAlmacen},function(entidades) 
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
  
.factory('VencimientoProductoEmpresa', function($resource) {
		return $resource(restServer+"vencimientos-productos/:id_empresa");
})

.factory('VencimientosProductosEmpresa', ['VencimientoProductoEmpresa','$q',function(VencimientoProductoEmpresa, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		VencimientoProductoEmpresa.query({id_empresa:id_empresa},function(entities) 
		{        
			delay.resolve(entities);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }])
  
.factory('CodigoSiguienteProductoEmpresa', function($resource) {
		return $resource(restServer+"producto/empresa/:id_empresa/siguiente-codigo");
})

.factory('DatoCodigoSiguienteProductoEmpresa', ['CodigoSiguienteProductoEmpresa','$q',function(CodigoSiguienteProductoEmpresa, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		CodigoSiguienteProductoEmpresa.get({id_empresa:id_empresa},function(entities) 
		{        
			delay.resolve(entities);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }]);