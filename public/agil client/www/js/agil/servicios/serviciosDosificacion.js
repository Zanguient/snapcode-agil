angular.module('agil.servicios')

.factory('Dosificacion',  ['$resource',function ($resource) {
		return $resource(restServer+"dosificaciones/:idDosificacion", { idDosificacion: '@id' },
		{
			'update': { method:'PUT' }
		});
}])

.factory('DosificacionesEmpresa',  ['$resource',function ($resource) {
		return $resource(restServer+"dosificaciones/empresa/:idEmpresa");
}])

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
  
.factory('DosificacionesDisponiblesEmpresa',  ['$resource',function ($resource) {
		return $resource(restServer+"dosificaciones-disponibles/empresa/:idEmpresa");
}])

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
	}])
	
	.factory('VerificarDosificacionesExpiradas',  ['$resource',function ($resource) {
		return $resource(restServer+"actualizacion-dosificaciones-expiradas/:id_empresa");
}])

.factory('VencimientoDosificaciones', ['VerificarDosificacionesExpiradas','$q',function(VerificarDosificacionesExpiradas, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		VerificarDosificacionesExpiradas.get({id_empresa:idEmpresa},function(entidades) 
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
