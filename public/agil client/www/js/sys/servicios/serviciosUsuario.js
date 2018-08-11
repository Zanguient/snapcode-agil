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


.factory('validarUsuario', function($resource) {
		return $resource(restServer+"/validar",
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
 .factory('UsuarioEmpresaPaginador', function($resource) {
		return $resource(restServer+"usuario/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion");
})
  
.factory('UsuariosEmpresaPaginador', ['UsuarioEmpresaPaginador','$q',function(UsuarioEmpresaPaginador, $q) 
  {
	var res = function(paginador) 
	{
		var idEmpresa=0;
		if(paginador.filter.empresa!=null){		
			idEmpresa=paginador.filter.empresa;
		}
		var delay = $q.defer();
		UsuarioEmpresaPaginador.get({id_empresa:idEmpresa,pagina:paginador.currentPage,items_pagina:paginador.itemsPerPage,texto_busqueda:paginador.search,columna:paginador.column,direccion:paginador.direction},function(entidades) 
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
  }])
  
.factory('UsuarioRutas', function($resource) {
		return $resource(restServer+"usuarios-rutas/:id_usuario", { id_usuario: '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('UsuarioComision', function($resource) {
		return $resource(restServer+"comision-productos-vendedor/empresa/:id_empresa/usuario/:id_usuario", { id_usuario: '@id_usuario', id_usuario: '@id_empresa'},
		{
			'update': { method:'PUT' }
		});
})
  
.factory('UsuarioComisiones', ['UsuarioComision','$q',function(UsuarioComision, $q) 
  {
	var res = function(id_usuario,id_empresa) 
	{
		if(id_empresa==null){
			id_empresa=0;
		}
		var delay = $q.defer();
		UsuarioComision.query({id_empresa:id_empresa,id_usuario:id_usuario},function(entidades) 
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
  
.factory('UsuarioSucursalAutenticacion', function($resource) {
		return $resource(restServer+"autenticar-sucursales/:id_usuario");
})
  
.factory('UsuarioSucursalesAutenticacion', ['UsuarioSucursalAutenticacion','$q',function(UsuarioSucursalAutenticacion, $q) 
  {
	var res = function(id_usuario) 
	{
		var delay = $q.defer();
		UsuarioSucursalAutenticacion.query({id_usuario:id_usuario},function(entidades) 
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
  
.factory('UsuarioRutaSeguimiento', function($resource) {
		return $resource(restServer+"rutas/seguimiento/usuario/:id_usuario/dia/:dia");
})
  
.factory('UsuarioRutasSeguimiento', ['UsuarioRutaSeguimiento','$q',function(UsuarioRutaSeguimiento, $q) 
  {
	var res = function(id_usuario,dia) 
	{
		var delay = $q.defer();
		UsuarioRutaSeguimiento.query({id_usuario:id_usuario,dia:dia},function(entidades) 
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
  
.factory('UsuarioRutaReporte', function($resource) {
		return $resource(restServer+"rutas/reporte/usuario/:id_usuario/ruta/:id_ruta/inicio/:inicio/fin/:fin/detalles-venta/:tipo");
})
  
.factory('UsuarioRutaReporteDatos', ['UsuarioRutaReporte','$q',function(UsuarioRutaReporte, $q) 
  {
	var res = function(id_usuario,inicio,fin,tipo,id_ruta) 
	{
		var delay = $q.defer();
		UsuarioRutaReporte.query({id_usuario:id_usuario,inicio:inicio,fin:fin,tipo:tipo,id_ruta:id_ruta},function(entidades) 
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
  
.factory('UsuarioRutaGrafico', function($resource) {
		return $resource(restServer+"rutas/grafico/usuario/:id_usuario/ruta/:id_ruta/inicio/:inicio/fin/:fin");
})
  
.factory('UsuarioRutaGraficoDatos', ['UsuarioRutaGrafico','$q',function(UsuarioRutaGrafico, $q) 
  {
	var res = function(id_usuario,inicio,fin,id_ruta) 
	{
		var delay = $q.defer();
		UsuarioRutaGrafico.query({id_usuario:id_usuario,inicio:inicio,fin:fin,id_ruta:id_ruta},function(entidades) 
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
  
.factory('UsuarioComisionReporte', function($resource) {
		return $resource(restServer+"usuarios-comisiones-reporte/empresa/:id_empresa/inicio/:inicio/fin/:fin");
})
  
.factory('UsuariosComisionesReporte', ['UsuarioComisionReporte','$q',function(UsuarioComisionReporte, $q) 
  {
	var res = function(id_empresa,inicio,fin) 
	{
		var delay = $q.defer();
		UsuarioComisionReporte.query({id_empresa:id_empresa,inicio:inicio,fin:fin},function(entidades) 
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
  
.factory('CierreCajaRutaUsuario', function($resource) {
		return $resource(restServer+"cierre-usuario-ruta/usuario/:id_usuario/dia/:dia");
})
  
.factory('CierreCajaRutaUsuarioDatos', ['CierreCajaRutaUsuario','$q',function(CierreCajaRutaUsuario, $q) 
  {
	var res = function(id_usuario,dia) 
	{
		var delay = $q.defer();
		CierreCajaRutaUsuario.query({id_usuario:id_usuario,dia:dia},function(entidades) 
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
	
.factory('VistaColumnasAplicacion', function($resource) {
		return $resource(restServer+"columnnas-aplicacion/aplicacion/:id_aplicacion", { id_aplicacion: '@id' },
		{
			'update': { method:'PUT' }
		});
})
.factory('VerificarUsuarioEmpresa', function($resource) {
		return $resource(restServer+"verificar/usuarios/empresa/:id_empresa", { id_empresa: '@id_empresa' },
		{
			'update': { method:'PUT' }
		});
})
.factory('VerificarAutorizacionUsuarioEmpresa', function($resource) {
	return $resource(restServer+"verificar-autorizacion/usuarios/empresa/:id_empresa", { id_empresa: '@id_empresa' },
	{
		'update': { method:'PUT' }
	});
})
	.factory('VerificarUsuarioEmpresaCaja', ['VerificarAutorizacionUsuarioEmpresa','$q',function(VerificarAutorizacionUsuarioEmpresa, $q) 
  {
	var res = function(id_empresa,usuario) 
	{
		if(id_empresa==null){
			id_empresa=0;
		}
		var delay = $q.defer();
		VerificarAutorizacionUsuarioEmpresa.save({id_empresa:id_empresa},usuario,function(entidades) 
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
  
	.factory('UsarLectorDeBarra', function($resource) {
		return $resource(restServer+"usar-lector-de-barra/usuario",null,
		{
			'update': { method:'PUT' }
		});
})
	.factory('GuardarUsuarLectorDeBarra', ['UsarLectorDeBarra','$q',function(UsarLectorDeBarra, $q) 
  {
	var res = function(usuario) 
	{	
		var delay = $q.defer();
		UsarLectorDeBarra.update(usuario,function(entidades) 
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
	
	.factory('UsuarioSeleccionado', function($resource) {
		return $resource(restServer+"usuario/:id_usuario", { id_usuario: '@id' },
		{
			'update': { method:'PUT' }
		});
})

.factory('ObtenerUsuario', ['UsuarioSeleccionado','$q',function(UsuarioSeleccionado, $q) 
  {
	var res = function(id_usuario) 
	{
		var delay = $q.defer();
		UsuarioSeleccionado.get({id_usuario: id_usuario},function(entidades) 
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
	.factory('EliminarUsuario', ['Usuario','$q',function(Usuario, $q) 
  {
	var res = function(id_usuario) 
	{
		var delay = $q.defer();
		Usuario.delete({id_usuario: id_usuario},function(entidades) 
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
	