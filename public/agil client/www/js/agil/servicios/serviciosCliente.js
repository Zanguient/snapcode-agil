angular.module('agil.servicios')
	.factory('ClienteVencimientoCredito', ['$resource', function ($resource) {
		return $resource(restServer + "cliente-vencimiento-credito/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])
	.factory('ClientesEmpresaPaginador', ['$resource', function ($resource) {
		return $resource(restServer + "cliente/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda");
	}])

	.factory('ClientesPaginador', ['ClientesEmpresaPaginador', '$q', function (ClientesEmpresaPaginador, $q) {
		var res = function (idEmpresa, pagina, itemsPagina, texto) {
			var delay = $q.defer();
			ClientesEmpresaPaginador.get({ id_empresa: idEmpresa, pagina: pagina, items_pagina: itemsPagina, texto_busqueda: texto }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('Cliente', ['$resource', function ($resource) {
		return $resource(restServer + "clientes/:idCliente", { idCliente: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('GetCliente', ['Cliente', '$q', function (Cliente, $q) {
		var res = function (idCliente) {
			var delay = $q.defer();
			Cliente.get({ idCliente: idCliente }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])



	.factory('ClientesEmpresa', ['$resource', function ($resource) {
		return $resource(restServer + "clientes/empresa/:idEmpresa");
	}])

	.factory('Clientes', ['ClientesEmpresa', '$q', function (ClientesEmpresa, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			ClientesEmpresa.query({ idEmpresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('RazonSocialClientesEmpresa', ['$resource', function ($resource) {
		return $resource(restServer + "clientes-upload-razonsocial/empresa/:idEmpresa", {},
			{
				'update': { method: 'PUT' }
			});
	}])
	.factory('RazonesSocialesCliente', ['RazonSocialClientesEmpresa', '$q', function (RazonSocialClientesEmpresa, $q) {
		var res = function (clientes, idEmpresa) {
			var delay = $q.defer();
			RazonSocialClientesEmpresa.save({ idEmpresa: idEmpresa }, clientes, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])


	.factory('BusquedaClientesNit', ['$resource', function ($resource) {
		return $resource(restServer + "clientes/empresa/:idEmpresa/texto/:texto");
	}])

	.factory('ClientesNit', ['BusquedaClientesNit', '$q', function (BusquedaClientesNit, $q) {
		var res = function (idEmpresa, texto) {
			var delay = $q.defer();
			BusquedaClientesNit.query({ idEmpresa: idEmpresa, texto: texto }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('CodigoSiguienteClienteEmpresa', ['$resource', function ($resource) {
		return $resource(restServer + "cliente/empresa/:id_empresa/siguiente-codigo");
	}])

	.factory('DatoCodigoSiguienteClienteEmpresa', ['CodigoSiguienteClienteEmpresa', '$q', function (CodigoSiguienteClienteEmpresa, $q) {
		var res = function (id_empresa) {
			var delay = $q.defer();
			CodigoSiguienteClienteEmpresa.get({ id_empresa: id_empresa }, function (entities) {
				delay.resolve(entities);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('DestinoEmpresa', ['$resource', function ($resource) {
		return $resource(restServer + "gtm-destinos/empresa/:id_empresa");
	}])

	.factory('DestinosCliente', ['DestinoEmpresa', '$q', function (DestinoEmpresa, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			DestinoEmpresa.query({ id_empresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('AnticipoCliente', ['$resource', function ($resource) {
		return $resource(restServer + "anticipo-cliente/cliente/:id_cliente");
	}])

	.factory('ObtenerAnticiposCliente', ['AnticipoCliente', '$q', function (AnticipoCliente, $q) {
		var res = function (idCliente) {
			var delay = $q.defer();
			AnticipoCliente.query({ id_cliente: idCliente }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('GuardarAnticipoCliente', ['AnticipoCliente', '$q', function (AnticipoCliente, $q) {
		var res = function (idCliente, datos) {
			var delay = $q.defer();
			AnticipoCliente.save({ id_cliente: idCliente }, datos, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}]);