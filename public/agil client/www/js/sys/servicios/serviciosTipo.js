angular.module('agil.servicios')

.factory('Tipo', ['$resource',function($resource) {
		return $resource(restServer+"tipos/:nombre_corto");
}])

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
	.factory('ClaseNombre', ['$resource',function($resource) {
		return $resource(restServer+"clase/:nombre");
}])

.factory('ClaseTexto', ['ClaseNombre','$q',function(ClaseNombre, $q) 
  {
	var res = function(nombre) 
	{
		var delay = $q.defer();
		ClaseNombre.get({nombre:nombre},function(entidad) 
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
  
.factory('Clase', ['$resource',function($resource) {
		return $resource(restServer+"clases/:nombre_corto");
}])

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
	.factory('ClaseEmpresa', ['$resource',function($resource) {
		return $resource(restServer+"clases/:nombre_corto/:id_empresa");
}])
	.factory('ClasesEmpresa', ['ClaseEmpresa','$q',function(ClaseEmpresa, $q) 
  {
	var res = function(nombre_corto,id_empresa) 
	{
		var delay = $q.defer();
		ClaseEmpresa.query({nombre_corto:nombre_corto,id_empresa:id_empresa},function(entidad) 
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
	.factory('Pais', ['$resource',function($resource) {
		return $resource(restServer+"paises/:nombre_corto");
}])

.factory('Paises', ['Pais','$q',function(Pais, $q) 
  {
	var res = function(nombre_corto) 
	{
		var delay = $q.defer();
		Pais.query({nombre_corto:nombre_corto},function(entidad) 
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
	
.factory('Tipos', ['$resource',function($resource) {
		return $resource(restServer+"tipos/:id_tipo", null,
		{
			'update': { method:'PUT' }
		});
}])

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
  
.factory('TiposEmpresa', ['$resource',function($resource) {
		return $resource(restServer+"tipos/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
}])

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
  
  
.factory('VencimientoCreditoEmpresa', ['$resource',function($resource) {
		return $resource(restServer+"vencimientos-creditos/:id_empresa");
}])

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
	
.factory('VentasComprobantes', ['$resource',function($resource) {
		return $resource(restServer+"ventas/empresa/:id_empresa");
}])
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
	.factory('ComprasComprobantes', ['$resource',function($resource) {
		return $resource(restServer+"compras/empresa/:id_empresa");
}])
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
	
.factory('VencimientoDeudaEmpresa', ['$resource',function($resource) {
		return $resource(restServer+"vencimientos-deudas/:id_empresa");
}])

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
	}])
	

.factory('TipoEmpresa', ['$resource',function($resource) {
	return $resource(restServer+"tipos/:nombre_corto/empresa/:id_empresa");
}])

.factory('ClasesTipoEmpresa', ['TipoEmpresa','$q',function(TipoEmpresa, $q) 
{
var res = function(nombre_corto,idEmpresa) 
{
	var delay = $q.defer();
	TipoEmpresa.get({nombre_corto:nombre_corto,id_empresa:idEmpresa},function(entidad) 
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