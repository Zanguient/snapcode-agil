angular.module('agil.servicios')
	.factory('ContabilidadCambioMoneda', function ($resource) {
		return $resource(restServer + "comprobante-contabilidad/monedaCambio", {},
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('CambioMoneda', function ($resource) {
		return $resource(restServer + "comprobante-contabilidad/monedaCambio/:fecha", { fecha: "@fecha" },
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('ObtenerCambioMoneda', ['CambioMoneda', '$q', function (CambioMoneda, $q) {
		var res = function (fecha) {
			var delay = $q.defer();
			CambioMoneda.get({ fecha: fecha }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('CambioMonedas', function ($resource) {
		return $resource(restServer + "comprobante-contabilidad/monedaCambio/mes/:mes/anio/:anio");
	})

	.factory('ListaCambioMoneda', ['CambioMonedas', '$q', function (CambioMonedas, $q) {
		var res = function (filtro) {
			var delay = $q.defer();
			CambioMonedas.query({ mes: filtro.mes, anio: filtro.anio }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	
	.factory('ActualizarCambio', function ($resource) {
		return $resource(restServer + "comprobante-contabilidad/monedaCambio/:id_moneda", { id_moneda: "@id_moneda" },
		{
			'update': { method: 'PUT' }
		});
	})

	.factory('ActualizarCambioMoneda', ['ActualizarCambio', '$q', function (ActualizarCambio, $q) {
		var res = function (moneda) {
			var delay = $q.defer();
			ActualizarCambio.update({ id_moneda: moneda.id },moneda, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('UltimaFechaTipoComp', function ($resource) {
		return $resource(restServer + "ultima-fecha-comprobante/empresa/:id_empresa/tipo/:id_tipo", { id_moneda: "@id_moneda" },
		{
			'update': { method: 'PUT' }
		});
	})

	.factory('UltimaFechaTipoComprobante', ['UltimaFechaTipoComp', '$q', function (UltimaFechaTipoComp, $q) {
		var res = function (idEmpresa,idTipo) {
			var delay = $q.defer();
			var delay = $q.defer();
			UltimaFechaTipoComp.get({ id_empresa: idEmpresa,id_tipo:idTipo }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('ImportarComprobantes', function ($resource) {
		return $resource(restServer + "importar-comprobantes/usuario/:id_usuario/empresa/:id_empresa", null,
		{
			'update': { method: 'PUT' }
		});
	})

	.factory('GuardarComprobantesImportados', ['ImportarComprobantes', '$q', function (ImportarComprobantes, $q) {
		var res = function (comprobantes,idusuario,idEmpresa) {
			var delay = $q.defer();
			var delay = $q.defer();
			ImportarComprobantes.save({id_empresa:idEmpresa, id_usuario: idusuario },comprobantes, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	