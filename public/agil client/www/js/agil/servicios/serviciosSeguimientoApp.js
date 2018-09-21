angular.module('agil.servicios')
.factory('UsuariosRutas',  ['$resource',function ($resource) {
		return $resource(restServer+"usuarios-rutas/empresa/:id_empresa/inicio/:inicio/fin/:fin/usuario/:usuario/ruta/:ruta");
}])

.factory('UsuariosRutasLista', ['UsuariosRutas','$q',function(UsuariosRutas, $q) 
  {
	var res = function(id_empresa,inicio,fin,usuario,ruta) 
	{
		var delay = $q.defer();
		UsuariosRutas.query({id_empresa:id_empresa,inicio:inicio,fin:fin,usuario:usuario,ruta:ruta},function(entidades) 
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