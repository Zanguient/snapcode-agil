angular.module('agil.servicios')

.factory('GtmTransportista', function($resource) {
		return $resource(restServer+"gtm-transportistas/empresa/:id_empresa");
})

.factory('GtmTransportistaItem', function($resource) {
	return $resource(restServer+"gtm-transportistas/:id_transportista", { id_transportista: '@id' },
	{
		'update': { method:'PUT' }
	});
})

.factory('GtmTransportistas', ['GtmTransportista','$q',function(GtmTransportista, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		GtmTransportista.query({id_empresa:id_empresa},function(entidad) 
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
	
.factory('GtmEstibaje', function($resource) {
		return $resource(restServer+"gtm-estibajes/empresa/:id_empresa");
})

.factory('GtmEstibajeItem', function($resource) {
	return $resource(restServer+"gtm-estibajes/:id_estibaje", { id_estibaje: '@id' },
	{
		'update': { method:'PUT' }
	});
})

.factory('GtmEstibajes', ['GtmEstibaje','$q',function(GtmEstibaje, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		GtmEstibaje.query({id_empresa:id_empresa},function(entidad) 
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
	
.factory('GtmGrupoEstibaje', function($resource) {
		return $resource(restServer+"gtm-grupo-estibajes/empresa/:id_empresa");
})

.factory('GtmGrupoEstibajeItem', function($resource) {
	return $resource(restServer+"gtm-grupo-estibajes/:id_grupo_estibaje", { id_grupo_estibaje: '@id' },
	{
		'update': { method:'PUT' }
	});
})

.factory('GtmGrupoEstibajes', ['GtmGrupoEstibaje','$q',function(GtmGrupoEstibaje, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		GtmGrupoEstibaje.query({id_empresa:id_empresa},function(entidad) 
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
	
.factory('GtmDestino', function($resource) {
		return $resource(restServer+"gtm-destinos/empresa/:id_empresa");
})

.factory('GtmDestinoItem', function($resource) {
	return $resource(restServer+"gtm-destinos/:id_destino", { id_destino: '@id' },
	{
		'update': { method:'PUT' }
	});
})

.factory('GtmDestinos', ['GtmDestino','$q',function(GtmDestino, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		GtmDestino.query({id_empresa:id_empresa},function(entidad) 
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
  
.factory('GtmDetalleDespachoAlerta', function($resource) {
	return $resource(restServer+"gtm-detalle-despacho/empresa/:id_empresa", { id_empresa: '@id' },
	{
		'update': { method:'PUT' }
	});
})
.factory('GtmDetallesDespachoAlerta', ['GtmDetalleDespachoAlerta','$q',function(GtmDetalleDespachoAlerta, $q) 
{
  var res = function(id_empresa) 
  {
	  var delay = $q.defer();
	  GtmDetalleDespachoAlerta.query({id_empresa:id_empresa},function(entidad) 
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

.factory('GtmDespacho', function($resource) {
	return $resource(restServer+"gtm-detalle-despacho-despachado/empresa/:id_empresa", { id_empresa: '@id' },
	{
		'update': { method:'PUT' }
	});
})

.factory('GtmDespachos', ['GtmDespacho','$q',function(GtmDespacho, $q) 
{
  var res = function(id_empresa) 
  {
	  var delay = $q.defer();
	  GtmDespacho.query({id_empresa:id_empresa},function(entidad) 
	  {        
		  delay.resolve(entidad);
	  }, function(error) 
		  {
			  delay.reject(error);
		  });
	  return delay.promise;
  };
  return res;
}]);