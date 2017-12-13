angular.module('agil.servicios')

.factory('Empresa', function($resource) {
		return $resource(restServer+"empresas/:idEmpresa", { idEmpresa: '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('Empresas', ['Empresa','$q',function(Empresa, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		Empresa.query({idEmpresa:idEmpresa},function(empresas) 
		{        
			delay.resolve(empresas);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }]);