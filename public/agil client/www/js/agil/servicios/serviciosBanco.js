angular.module('agil.servicios')
.factory('Banco', function($resource) {
		return $resource(restServer+"bancos/empresa/:idEmpresa",{id: '@idEmpresa'},
		{
			'update': { method:'PUT' }
		});
})

.factory('BancoDatos', function($resource) {
		return $resource(restServer+"bancos/:id_banco",{id: '@id_banco'},
		{
			'update': { method:'PUT' }
		});
})

.factory('ListaBancos', ['Banco','$q',function(Banco, $q) 
  {
	var res = function(idEmpresa) 
	{
		var delay = $q.defer();
		Banco.query({idEmpresa:idEmpresa},function(entidades) 
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

.factory('BancoEmpresaPaginador', function($resource) {
		return $resource(restServer+"bancos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda");
})

.factory('BancoPaginador', ['BancoEmpresaPaginador','$q',function(BancoEmpresaPaginador, $q) 
  {
	var res = function(idEmpresa,pagina,itemsPagina,texto) 
	{
		var delay = $q.defer();
		BancoEmpresaPaginador.get({id_empresa:idEmpresa,pagina:pagina,items_pagina:itemsPagina,texto_busqueda:texto},function(entidades) 
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