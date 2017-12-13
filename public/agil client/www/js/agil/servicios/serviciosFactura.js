angular.module('agil.servicios')

.factory('ConfiguracionFactura', function($resource) {
		return $resource(restServer+"configuraciones-factura/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ConfiguracionFacturaSucursal', function($resource) {
		return $resource(restServer+"configuraciones-factura/:id_configuracion", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ConfiguracionesFactura', ['ConfiguracionFactura','$q',function(ConfiguracionFactura, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		ConfiguracionFactura.query({id_empresa:idEmpresa},function(entidades) 
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
  
.factory('ConfiguracionGeneralFactura', function($resource) {
		return $resource(restServer+"configuracion-general-factura/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ConfiguracionFacturaEmpresa', function($resource) {
		return $resource(restServer+"configuracion-general-factura/:id_configuracion", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ConfiguracionGeneralFacturaDato', ['ConfiguracionGeneralFactura','$q',function(ConfiguracionGeneralFactura, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		ConfiguracionGeneralFactura.get({id_empresa:idEmpresa},function(entidad) 
		{        
			delay.resolve(entidad);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }])

.factory('ConfiguracionImpresionEmpresa', function($resource) {
		return $resource(restServer+"configuracion-impresion/empresa/:id_empresa/sucursal/:id_sucursal", null,
		{
			'update': { method:'PUT' }
		});
})

.factory('ConfiguracionImpresionEmpresaDato', ['ConfiguracionImpresionEmpresa','$q',function(ConfiguracionImpresionEmpresa, $q) 
  {
	var res = function(idEmpresa,idSucursal) 
	{
		var delay = $q.defer();
		ConfiguracionImpresionEmpresa.get({id_empresa:idEmpresa,id_sucursal:idSucursal},function(entidad) 
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