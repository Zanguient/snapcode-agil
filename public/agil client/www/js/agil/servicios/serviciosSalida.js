angular.module('agil.servicios')

.factory('BusquedaProductosEmpresa', function($resource) {
		return $resource(restServer+"productos/empresa/:idEmpresa/texto/:texto");
})

.factory('ListaProductosEmpresa', ['BusquedaProductosEmpresa','$q',function(BusquedaProductosEmpresa, $q) 
  {
	var res = function(idEmpresa,texto) 
	{
		var delay = $q.defer();
		BusquedaProductosEmpresa.query({idEmpresa:idEmpresa,texto:texto},function(entidades) 
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
	
	.factory('BusquedaProductosEmpresaUsuario', function($resource) {
		return $resource(restServer+"productos/empresa/:idEmpresa/texto/:texto/user/:id_usuario");
})

.factory('ListaProductosEmpresaUsuario', ['BusquedaProductosEmpresaUsuario','$q',function(BusquedaProductosEmpresaUsuario, $q) 
  {
	var res = function(idEmpresa,texto, id_usuario) 
	{
		var delay = $q.defer();
		BusquedaProductosEmpresaUsuario.query({idEmpresa:idEmpresa,texto:texto, id_usuario: id_usuario},function(entidades) 
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
  
.factory('InventariosProducto', function($resource) {
		return $resource(restServer+"inventarios/producto/:id_producto/almacen/:id_almacen");
})

.factory('ListaInventariosProducto', ['InventariosProducto','$q',function(InventariosProducto, $q) 
  {
	var res = function(id_producto,id_almacen) 
	{
		var delay = $q.defer();
		InventariosProducto.query({id_producto:id_producto,id_almacen:id_almacen},function(entidades) 
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
  
  
.factory('ConfiguracionVentaVista', function($resource) {
		return $resource(restServer+"empresas/:id_empresa/configuracion-venta-vista", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ConfiguracionVentaVistaDatos', ['ConfiguracionVentaVista','$q',function(ConfiguracionVentaVista, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		ConfiguracionVentaVista.get({id_empresa:id_empresa},function(entidades) 
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
  
.factory('ConfiguracionCompraVista', function($resource) {
		return $resource(restServer+"empresas/:id_empresa/configuracion-compra-vista", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ConfiguracionCompraVistaDatos', ['ConfiguracionCompraVista','$q',function(ConfiguracionCompraVista, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		ConfiguracionCompraVista.get({id_empresa:id_empresa},function(entidades) 
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

.factory('GruposProductoEmpresa', function($resource) {
		return $resource(restServer+"grupos/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ListaGruposProductoEmpresa', ['GruposProductoEmpresa','$q',function(GruposProductoEmpresa, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		GruposProductoEmpresa.query({id_empresa:id_empresa},function(entidades) 
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

	.factory('GruposProductoUsuario', function($resource) {
		return $resource(restServer+"grupos/empresa/:id_empresa/user/:id_usuario", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ListaGruposProductoUsuario', ['GruposProductoUsuario','$q',function(GruposProductoUsuario, $q) 
  {
	var res = function(id_empresa, id_usuario) 
	{
		var delay = $q.defer();
		GruposProductoUsuario.query({id_empresa:id_empresa, id_usuario: id_usuario},function(entidades) 
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
	
.factory('VendedorVenta', function($resource) {
		return $resource(restServer+"vendedor-venta/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ListaVendedorVenta', ['VendedorVenta','$q',function(VendedorVenta, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		VendedorVenta.query({id_empresa:id_empresa},function(entidades) 
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
	
	.factory('VendedorVentaActualizacion', function($resource) {
		return $resource(restServer+"vendedor-venta/:id_vendedor", { id_vendedor:  '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('SubGruposProductoEmpresa', function($resource) {
	return $resource(restServer+"subgrupos/empresa/:id_empresa", null,
	{
		'update': { method:'PUT' }
	});
})

.factory('ListaSubGruposProductoEmpresa', ['SubGruposProductoEmpresa','$q',function(SubGruposProductoEmpresa, $q) 
{
var res = function(id_empresa) 
{
	var delay = $q.defer();
	SubGruposProductoEmpresa.query({id_empresa:id_empresa},function(entidades) 
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