angular.module('agil.servicios')

	.factory('Empresa',  ['$resource',function ($resource) {
		return $resource(restServer + "empresas/:idEmpresa", { idEmpresa: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('Empresas', ['Empresa', '$q', function (Empresa, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			Empresa.query({ idEmpresa: idEmpresa }, function (empresas) {
				delay.resolve(empresas);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('EmpresaDatosInicio', ['Empresa', '$q', function (Empresa, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			Empresa.query({ idEmpresa: idEmpresa }, function (empresas) {
				delay.resolve(empresas);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('AplicacionesSistema',  ['$resource',function ($resource) {
		return $resource(restServer + "sistema/aplicaciones", null,
			{
				'update': { method: 'PUT' }
			});
	}])
	.factory('ListaAplicacionesSistema', ['AplicacionesSistema', '$q', function (AplicacionesSistema, $q) {
		var res = function (app) {
			var delay = $q.defer();
			AplicacionesSistema.query({ app: app }, function (empresas) {
				delay.resolve(empresas);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('AplicacionesSistemaEmpresa',  ['$resource',function ($resource) {
		return $resource(restServer + "sistema/aplicaciones/empresa/:id_empresa", null,
			{
				'update': { method: 'PUT' }
			});
	}])
	.factory('ListaAplicacionesSistemaEmpresa', ['AplicacionesSistemaEmpresa', '$q', function (AplicacionesSistemaEmpresa, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			AplicacionesSistemaEmpresa.query({ id_empresa: idEmpresa }, function (empresas) {
				delay.resolve(empresas);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])