angular.module('agil.servicios')

.factory('Parametro',  ['$resource',function ($resource) {
		return $resource(restServer+"rrhh-parametros/:idEmpresa", { idEmpresa: '@id' },
		{
			'update': { method:'PUT' }
		});
}])

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

.factory('RecursosHumanosFichasEmpleados',  ['$resource',function ($resource) {
    return $resource(restServer + "recursos-humanos-fichas/empleados/:idEmpresa", { idEmpresa: '@id' });
}])

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

.factory('RecursosHumanosHorasEmpleados',  ['$resource',function ($resource) {
    return $resource(restServer + "recursos-humanos/horas-extra/empleado-sueldo/:id_ficha/gestion/:gestion/mes/:mes/empleado/:id_empleado");
}])

.factory('RecursosHumanosEmpleadosHorasExtras', ['RecursosHumanosHorasEmpleados', '$q', function (RecursosHumanosHorasEmpleados, $q) {
    var res = function(idFicha, gestion, mes, idEmpleado) 
	{
		var delay = $q.defer();
		RecursosHumanosHorasEmpleados.get({id_ficha:idFicha, gestion:gestion, mes:mes, id_empleado: idEmpleado},function(parametros) 
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

.factory('RecursosHumanosPlanillaSueldos',  ['$resource',function ($resource) {
		return $resource(restServer+"rrhh-planilla-sueldos/:id_empresa", { id_empresa: '@id_empresa' },{
			'update': { method:'PUT' }
		});
}])

.factory('RRHHPlanillaSueldos',  ['$resource',function ($resource) {
		return $resource(restServer+"rrhh-planilla-sueldos/:id_empresa/gestion/:gestion/mes/:mes");
}])

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

.factory('RecursosHumanosPlanillaRCIVA',  ['$resource',function ($resource) {
		return $resource(restServer+"rrhh-planilla-rc-iva/:id_empresa", { id_empresa: '@id_empresa' },{
			'update': { method:'PUT' }
		});
}])

.factory('RRHHPlanillaRCIVARuta',  ['$resource',function ($resource) {
		return $resource(restServer+"rrhh-planilla-rc-iva/valid/:id_empresa/gestion/:gestion/mes/:mes");
}])

.factory('RRHHlistaPlanillaRCIVA', ['RRHHPlanillaRCIVARuta', '$q', function (RRHHPlanillaRCIVARuta, $q) {
    var res = function(id_empresa, gestion, mes) 
	{
		var delay = $q.defer();
		RRHHPlanillaRCIVARuta.get({id_empresa:id_empresa, gestion:gestion, mes:mes},function(planillas) 
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

.factory('RutaRRHHPlanillaRCIVA',  ['$resource',function ($resource) {
		return $resource(restServer+"rrhh-planilla-rc-iva/:id_empresa/gestion/:gestion/mes/:mes");
}])

.factory('ListaRRHHPlanillaRCIVA', ['RutaRRHHPlanillaRCIVA', '$q', function (RutaRRHHPlanillaRCIVA, $q) {
    var res = function(id_empresa, gestion, mes) 
	{
		var delay = $q.defer();
		RutaRRHHPlanillaRCIVA.get({id_empresa:id_empresa, gestion:gestion, mes:mes},function(planillas) 
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
