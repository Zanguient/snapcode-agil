angular.module('agil.servicios')

.factory('Tipo', function($resource) {
		return $resource(restServer+"tipos/:nombre_corto");
})

.factory('ClasesTipo', ['Tipo','$q',function(Tipo, $q) 
  {
	var res = function(nombre_corto) 
	{
		var delay = $q.defer();
		Tipo.get({nombre_corto:nombre_corto},function(entidad) 
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
  
.factory('Clase', function($resource) {
		return $resource(restServer+"clases/:nombre_corto");
})

.factory('Clases', ['Clase','$q',function(Clase, $q) 
  {
	var res = function(nombre_corto) 
	{
		var delay = $q.defer();
		Clase.query({nombre_corto:nombre_corto},function(entidad) 
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
  
.factory('Tipos', function($resource) {
		return $resource(restServer+"tipos/:id_tipo", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ListaTipos', ['Tipos','$q',function(Tipos, $q) 
  {
	var res = function() 
	{
		var delay = $q.defer();
		Tipos.query(function(entities) 
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
  
.factory('TiposEmpresa', function($resource) {
		return $resource(restServer+"tipos/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ListaTiposEmpresa', ['TiposEmpresa','$q',function(TiposEmpresa, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		TiposEmpresa.query({id_empresa:id_empresa},function(entities) 
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
  
  
.factory('VencimientoCreditoEmpresa', function($resource) {
		return $resource(restServer+"vencimientos-creditos/:id_empresa");
})

.factory('VencimientosCreditosEmpresa', ['VencimientoCreditoEmpresa','$q',function(VencimientoCreditoEmpresa, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		VencimientoCreditoEmpresa.query({id_empresa:id_empresa},function(entities) 
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
	
.factory('VentasComprobantes', function($resource) {
		return $resource(restServer+"ventas/empresa/:id_empresa");
})
	.factory('VentasComprobantesEmpresa', ['VentasComprobantes','$q',function(VentasComprobantes, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		VentasComprobantes.get({id_empresa:id_empresa},function(entities) 
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
	.factory('ComprasComprobantes', function($resource) {
		return $resource(restServer+"compras/empresa/:id_empresa");
})
	.factory('ComprasComprobantesEmpresa', ['ComprasComprobantes','$q',function(ComprasComprobantes, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		ComprasComprobantes.get({id_empresa:id_empresa},function(entities) 
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
	
.factory('VencimientoDeudaEmpresa', function($resource) {
		return $resource(restServer+"vencimientos-deudas/:id_empresa");
})

.factory('VencimientosDeudasEmpresa', ['VencimientoDeudaEmpresa','$q',function(VencimientoDeudaEmpresa, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		VencimientoDeudaEmpresa.query({id_empresa:id_empresa},function(entities) 
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