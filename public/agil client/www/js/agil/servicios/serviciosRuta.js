angular.module('agil.servicios')

.factory('Ruta',  ['$resource',function ($resource) {
		return $resource(restServer+"rutas/:idRuta", { idRuta: '@id' },
		{
			'update': { method:'PUT' }
		});
}])

.factory('RutasEmpresa',  ['$resource',function ($resource) {
		return $resource(restServer+"rutas/empresa/:idEmpresa");
}])

.factory('Rutas', ['RutasEmpresa','$q',function(RutasEmpresa, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		RutasEmpresa.query({idEmpresa:idEmpresa},function(entidades) 
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