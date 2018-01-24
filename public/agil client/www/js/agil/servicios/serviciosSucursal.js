angular.module('agil.servicios')

.factory('Sucursal', function($resource) {
		return $resource(restServer+"sucursales/:idSucursal", { idSucursal: '@id' },
		{
			'update': { method:'PUT' }
		});
})
.factory('Sucursalupdate', function($resource) {
	return $resource(restServer+"configuracion/factura/sucursal/:idSucursal", { idSucursal: '@id' },
	{
		'update': { method:'PUT' }
	});
})
.factory('ConfiguracionFacturaSucursal', function($resource) {
	return $resource(restServer+"sucursal/:idSucursal", { idSucursal: '@id' },
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
  }])
  .factory('Sucursalesupdate', function($resource) {
	return $resource(restServer+"configuracion/factura/sucursales/empresa/:id_empresa", { id_empresa: '@id_empresa' },
	{
		'update': { method:'PUT' }
	});
})

  .factory('VerificarCorrelativosSucursale', ['Sucursalesupdate','$q',function(Sucursalesupdate, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		Sucursalesupdate.query({id_empresa:idEmpresa},function(entidades) 
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
  .factory('ReiniciarCorrelativo', function($resource) {
	return $resource(restServer+"reiniciar-correlativo/sucursales",null,
	{
		'update': { method:'PUT' }
	});
})

  .factory('ReiniciarCorrelativoSucursales', ['ReiniciarCorrelativo','$q',function(ReiniciarCorrelativo, $q) 
  {
	var res = function(datos) 
	{	
		var delay = $q.defer();
		ReiniciarCorrelativo.update(datos,function(entidades) 
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