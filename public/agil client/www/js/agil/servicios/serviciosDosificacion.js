angular.module('agil.servicios')

.factory('Dosificacion', function($resource) {
		return $resource(restServer+"dosificaciones/:idDosificacion", { idDosificacion: '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('DosificacionesEmpresa', function($resource) {
		return $resource(restServer+"dosificaciones/empresa/:idEmpresa");
})

.factory('Dosificaciones', ['DosificacionesEmpresa','$q',function(DosificacionesEmpresa, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		DosificacionesEmpresa.query({idEmpresa:idEmpresa},function(entidades) 
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
  
.factory('DosificacionesDisponiblesEmpresa', function($resource) {
		return $resource(restServer+"dosificaciones-disponibles/empresa/:idEmpresa");
})

.factory('DosificacionesDisponibles', ['DosificacionesDisponiblesEmpresa','$q',function(DosificacionesDisponiblesEmpresa, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		DosificacionesDisponiblesEmpresa.query({idEmpresa:idEmpresa},function(entidades) 
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