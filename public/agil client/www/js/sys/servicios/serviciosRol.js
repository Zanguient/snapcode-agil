angular.module('agil.servicios')

.factory('Rol', ['$resource',function($resource) {
		return $resource(restServer+"roles");
}])

.factory('Roles', ['Rol','$q',function(Rol, $q) 
  {
	var res = function() 
	{
		var delay = $q.defer();
		Rol.query(function(entidades) 
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