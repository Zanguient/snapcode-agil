angular.module('agil.servicios')

.factory('Sesion', ['$http','$window', '$localStorage', function($http,$window, $localStorage){
        var baseUrl = restServer;
        function changeUser(user) {
            angular.extend(currentUser, user);
        }
 
        function urlBase64Decode(str) {
			if(str)
			{
				var output = str.replace('-', '+').replace('_', '/');
				switch (output.length % 4) {
					case 0:
						break;
					case 2:
						output += '==';
						break;
					case 3:
						output += '=';
						break;
					default:
						throw 'Illegal base64url string!';
				}
				return window.atob(output);
			}
        }
 
        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = urlBase64Decode(encoded)?JSON.parse(urlBase64Decode(encoded)):"";
            }
            return user;
        }
 
        var currentUser = getUserFromToken();
 
        return {
            save: function(data, success, error) {
                $http.post(baseUrl + 'register', data).success(success).error(error)
            },
            iniciarSesion: function(data, success,error) {
                $http.post(baseUrl + 'autenticar', data).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + 'me').success(success).error(error)
            },
            cerrarSesion: function(success) {
                changeUser({});
				$window.localStorage.clear();
                success();
            }
        };
    }
])

.factory('Usuario', function($resource) {
		return $resource(restServer+"usuarios/:id_usuario", { id_usuario: '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('Usuarios', ['Usuario','$q',function(Usuario, $q) 
  {
	var res = function() 
	{
		var delay = $q.defer();
		Usuario.query(function(entidades) 
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
  
.factory('UsuarioEmpresa', function($resource) {
		return $resource(restServer+"usuarios/empresa/:id_empresa");
})
  
.factory('UsuariosEmpresa', ['UsuarioEmpresa','$q',function(UsuarioEmpresa, $q) 
  {
	var res = function(id_empresa) 
	{
		if(id_empresa==null){
			id_empresa=0;
		}
		var delay = $q.defer();
		UsuarioEmpresa.query({id_empresa:id_empresa},function(entidades) 
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