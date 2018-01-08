angular.module('agil.servicios')
.factory('ClienteVencimientoCredito', function($resource) {
		return $resource(restServer+"cliente-vencimiento-credito/:id",{id: '@id'},
		{
			'update': { method:'PUT' }
		});
})
.factory('ClientesEmpresaPaginador', function($resource) {
		return $resource(restServer+"cliente/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda");
})

.factory('ClientesPaginador', ['ClientesEmpresaPaginador','$q',function(ClientesEmpresaPaginador, $q) 
  {
	var res = function(idEmpresa,pagina,itemsPagina,texto) 
	{
		var delay = $q.defer();
		ClientesEmpresaPaginador.get({id_empresa:idEmpresa,pagina:pagina,items_pagina:itemsPagina,texto_busqueda:texto},function(entidades) 
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
.factory('Cliente', function($resource) {
		return $resource(restServer+"clientes/:idCliente", { idCliente: '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('ClientesEmpresa', function($resource) {
		return $resource(restServer+"clientes/empresa/:idEmpresa");
})

.factory('Clientes', ['ClientesEmpresa','$q',function(ClientesEmpresa, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		ClientesEmpresa.query({idEmpresa:idEmpresa},function(entidades) 
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
  
.factory('BusquedaClientesNit', function($resource) {
		return $resource(restServer+"clientes/empresa/:idEmpresa/texto/:texto");
})

.factory('ClientesNit', ['BusquedaClientesNit','$q',function(BusquedaClientesNit, $q) 
  {
	var res = function(idEmpresa,texto) 
	{
		var delay = $q.defer();
		BusquedaClientesNit.query({idEmpresa:idEmpresa,texto:texto},function(entidades) 
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
	
	.factory('CodigoSiguienteClienteEmpresa', function($resource) {
		return $resource(restServer+"cliente/empresa/:id_empresa/siguiente-codigo");
})

.factory('DatoCodigoSiguienteClienteEmpresa', ['CodigoSiguienteClienteEmpresa','$q',function(CodigoSiguienteClienteEmpresa, $q) 
  {
	var res = function(id_empresa) 
	{
		var delay = $q.defer();
		CodigoSiguienteClienteEmpresa.get({id_empresa:id_empresa},function(entities) 
		{        
			delay.resolve(entities);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
	}])
	
.factory('DestinoEmpresa', function($resource) {
		return $resource(restServer+"gtm-destinos/empresa/:id_empresa");
})
	
.factory('DestinosCliente', ['DestinoEmpresa','$q',function(DestinoEmpresa, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		DestinoEmpresa.query({id_empresa:idEmpresa},function(entidades) 
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