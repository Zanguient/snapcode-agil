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
    return $resource(restServer + "recursos-humanos-fichas/empleados/:idEmpresa", { idEmpresa: '@id' });
})

.factory('RecursosHumanosEmpleados', ['RecursosHumanosFichasEmpleados', '$q', function (RecursosHumanosFichasEmpleados, $q) {
    var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		RecursosHumanosFichasEmpleados.get({idEmpresa:idEmpresa},function(parametros) 
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

.factory('RecursosHumanosHorasEmpleados', function ($resource) {
    return $resource(restServer + "recursos-humanos/horas-extra/empleado-sueldo/:id_empleado/gestion/:gestion/mes/:mes");
})

.factory('RecursosHumanosEmpleadosHorasExtras', ['RecursosHumanosHorasEmpleados', '$q', function (RecursosHumanosHorasEmpleados, $q) {
    var res = function(idEmpleado, gestion, mes) 
	{
		var delay = $q.defer();
		RecursosHumanosHorasEmpleados.get({id_empleado:idEmpleado, gestion:gestion, mes:mes},function(parametros) 
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

.factory('RecursosHumanosPlanillaSueldos', function($resource) {
		return $resource(restServer+"rrhh-planilla-sueldos/:id_empresa", { id_empresa: '@id_empresa' },{
			'update': { method:'PUT' }
		});
})

.factory('RRHHPlanillaSueldos', function($resource) {
		return $resource(restServer+"rrhh-planilla-sueldos/:id_empresa/gestion/:gestion/mes/:mes");
})

.factory('RRHHlistaPlanillaSueldos', ['RRHHPlanillaSueldos', '$q', function (RRHHPlanillaSueldos, $q) {
    var res = function(id_empresa, gestion, mes) 
	{
		var delay = $q.defer();
		RRHHPlanillaSueldos.get({id_empresa:id_empresa, gestion:gestion, mes:mes},function(planillas) 
		{        
			delay.resolve(planillas);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
}])
