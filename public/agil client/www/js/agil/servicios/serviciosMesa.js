angular.module('agil.servicios')

.factory('Sala',  ['$resource',function ($resource) {
		return $resource(restServer+"sala/sucursal/:id_sucursal",null);
}])

.factory('ListaSalas', ['Sala','$q',function(Sala, $q) 
  {
	var res = function(idSucursal) 
	{
		var delay = $q.defer();
		Sala.query({id_sucursal:idSucursal},function(entidades) 
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
	
.factory('Mesa',  ['$resource',function ($resource) {
		return $resource(restServer+"mesa/sala/:id_sala",null);
}])

.factory('MesaActualizacion',  ['$resource',function ($resource) {
		return $resource(restServer+"mesa/:id_mesa", null,
		{
			'update': { method:'PUT' }
		});
}])
	
.factory('PedidoRestaurante',  ['$resource',function ($resource) {
		return $resource(restServer+"pedido-restaurante/mesa/:id_mesa/almacen/:id_almacen",null);
}])

.factory('PedidoRestauranteActualizacion',  ['$resource',function ($resource) {
		return $resource(restServer+"pedido-restaurante/:id_pedido_restaurante", null,
		{
			'update': { method:'PUT' }
		});
}])
	
.factory('MesaPedidoRestaurante', ['PedidoRestaurante','$q',function(PedidoRestaurante, $q) 
  {
	var res = function(id_mesa,id_almacen) 
	{
		var delay = $q.defer();
		PedidoRestaurante.get({id_mesa:id_mesa,id_almacen:id_almacen},function(entidades) 
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

.factory('InactivarPedido',  ['$resource',function ($resource) {
		return $resource(restServer+"inactivacion-pedido-restaurante/:id", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('CrearGarzon',  ['$resource',function ($resource) {
		return $resource(restServer+"sala/garzon", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('Garzon',  ['$resource',function ($resource) {
		return $resource(restServer+"garzon/:id_empresa",null,
		{
			'update': { method:'PUT' }
		});
}])
.factory('ActualizarGarzon',  ['$resource',function ($resource) {
		return $resource(restServer+"garzon/:id_garzon",{
			id_garzon:'@id'
		},
		{
			'update': { method:'PUT' }
		});
}])
.factory('ListaGarzones', ['Garzon','$q',function(Garzon, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		Garzon.query({id_empresa:idEmpresa},function(entidades) 
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

.factory('EliminacionMesaPedidoRestaurante',  ['$resource',function ($resource) {
		return $resource(restServer+"mesa-pedido-restaurante/:id",{
			id:'@id'
		},
		{
			'update': { method:'PUT' }
		});
}]);
