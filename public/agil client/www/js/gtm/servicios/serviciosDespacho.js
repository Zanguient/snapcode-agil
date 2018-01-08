angular.module('agil.servicios')

.factory('GtmTransportista', function($resource) {
		return $resource(restServer+"gtm-transportistas/empresa/:id_empresa");
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
  }]);