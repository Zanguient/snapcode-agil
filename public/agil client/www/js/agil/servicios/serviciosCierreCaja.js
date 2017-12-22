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

.factory('CierreCajaPaginador', function($resource) {
	return $resource(restServer+"cierres-caja/empresa/:idEmpresa/:idUsuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/columna/:columna/direccion/:direccion",{id: '@idEmpresa'},
	{
		'update': { method:'PUT' }
	});
})

.factory('CierreCajaDatosItem', ['CierreCajaDatos','$q',function(CierreCajaDatos, $q) 
{
var res = function(id_cierre) 
{
	var delay = $q.defer();
	CierreCajaDatos.get({
		id_cierre_caja:id_cierre},function(entidades) 
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


.factory('ListaCierresCaja', ['CierreCajaPaginador','$q',function(CierreCajaPaginador, $q) 
  {
	var res = function(paginator) 
	{
		var delay = $q.defer();
		CierreCajaPaginador.get({
			idEmpresa:paginator.filter.empresa,
			idUsuario:paginator.filter.usuario,
		  pagina: paginator.currentPage,
			items_pagina: paginator.itemsPerPage,
			busqueda: paginator.search,
			columna: paginator.column,
			direccion: paginator.direction},function(entidades) 
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