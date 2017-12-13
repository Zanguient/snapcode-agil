angular.module('agil.servicios')
.factory('CierreCaja', function($resource) {
		return $resource(restServer+"cierres-caja/empresa/:idEmpresa/:idUsuario",{id: '@idEmpresa'},
		{
			'update': { method:'PUT' }
		});
})

.factory('CierreCajaDatos', function($resource) {
		return $resource(restServer+"cierres-caja/:id_cierre_caja",{id: '@id_cierre_caja'},
		{
			'update': { method:'PUT' }
		});
})

.factory('ListaCierresCaja', ['CierreCaja','$q',function(CierreCaja, $q) 
  {
	var res = function(idEmpresa,idUsuario) 
	{
		var delay = $q.defer();
		CierreCaja.query({idEmpresa:idEmpresa,idUsuario:idUsuario},function(entidades) 
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

.factory('CierreCajaPendiente', function($resource) {
		return $resource(restServer+"cierre-caja-pendiente/:idsSucursales");
})

.factory('CierresCajaPendiente', ['CierreCajaPendiente','$q',function(CierreCajaPendiente, $q) 
  {
	var res = function(idsSucursales) 
	{
		var delay = $q.defer();
		CierreCajaPendiente.query({idsSucursales:idsSucursales},function(entidades) 
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