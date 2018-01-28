angular.module('agil.servicios')

.factory('Parametro', function($resource) {
		return $resource(restServer+"rrhh-parametros/:idEmpresa", { idEmpresa: '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('Parametros', ['Parametro','$q',function(Parametro, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		Parametro.get({idEmpresa:idEmpresa},function(parametros) 
		{        
			delay.resolve(parametros);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }])

.factory('RecursosHumanosFichasEmpleados', function ($resource) {
    return $resource(restServer + "recursos-humanos-fichas/empleados");
})

.factory('RecursosHumanosEmpleados', ['RecursosHumanosFichasEmpleados', '$q', function (RecursosHumanosFichasEmpleados, $q) {
    var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		RecursosHumanosFichasEmpleados.get({},function(parametros) 
		{        
			delay.resolve(parametros);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
}])

 