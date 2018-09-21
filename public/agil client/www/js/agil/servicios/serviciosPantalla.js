angular.module('agil.servicios')

.factory('VentasNoDespachadas',  ['$resource',function ($resource) {
		return $resource(restServer+"ventas-no-despachadas/sucursal/:id_sucursal");
}])

.factory('VentasNoDespachadasLista', ['VentasNoDespachadas','$q',function(VentasNoDespachadas, $q) 
  {
	var res = function(id_sucursal) 
	{
		var delay = $q.defer();
		VentasNoDespachadas.query({id_sucursal:id_sucursal},function(entidades) 
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
  
.factory('DespachoVenta',  ['$resource',function ($resource) {
		return $resource(restServer+"venta/:id_venta/despachar", null,
		{
			'update': { method:'PUT' }
		});
}]);