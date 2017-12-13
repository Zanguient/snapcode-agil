angular.module('agil.servicios')

.factory('Sucursal', function($resource) {
		return $resource(restServer+"sucursales/:idSucursal", { idSucursal: '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('SucursalesEmpresa', function($resource) {
		return $resource(restServer+"sucursales/empresa/:idEmpresa");
})

.factory('Sucursales', ['SucursalesEmpresa','$q',function(SucursalesEmpresa, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		SucursalesEmpresa.query({idEmpresa:idEmpresa},function(entidades) 
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