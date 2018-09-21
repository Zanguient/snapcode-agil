angular.module('agil.servicios')

.factory('ConfiguracionApp',  ['$resource',function ($resource) {
		return $resource(restServer+"configuraciones-app/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('ConfiguracionAppVendedor',  ['$resource',function ($resource) {
		return $resource(restServer+"configuraciones-app/:id_configuracion", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('ConfiguracionesApp', ['ConfiguracionApp','$q',function(ConfiguracionApp, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		ConfiguracionApp.query({id_empresa:idEmpresa},function(entidades) 
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
  
.factory('ConfiguracionGeneralApp',  ['$resource',function ($resource) {
		return $resource(restServer+"configuracion-general-app/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('ConfiguracionAppEmpresa',  ['$resource',function ($resource) {
		return $resource(restServer+"configuracion-general-app/:id_configuracion", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('ConfiguracionGeneralAppDato', ['ConfiguracionGeneralApp','$q',function(ConfiguracionGeneralApp, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		ConfiguracionGeneralApp.get({id_empresa:idEmpresa},function(entidad) 
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