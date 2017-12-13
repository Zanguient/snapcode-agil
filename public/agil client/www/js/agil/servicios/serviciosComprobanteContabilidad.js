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
	/* .factory('ComprobanteEmpresaPaginador', function ($resource) {
		return $resource(restServer + "comprobantes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion/monto/:monto/tipo-comprobante/:tipo_comprobante/sucursal/:sucursal/usuario/:usuario/numero/:numero/busqueda/:busqueda");
	})

	.factory('ComprobantePaginador', ['ComprobanteEmpresaPaginador', '$q', function (ComprobanteEmpresaPaginador, $q) {
		var res = function (paginator) {

			if (paginator.filter.monto == null) {
				paginator.filter.monto = 0
			}
			if (paginator.filter.tipo_comprobante == null) {
				paginator.filter.tipo_comprobante = 0;
			}
			if (paginator.filter.sucursal == null) {
				paginator.filter.sucursal = 0;
			}
			if (paginator.filter.usuario == null) {
				paginator.filter.usuario = 0;
			}
			if (paginator.filter.numero == null) {
				paginator.filter.numero = 0;
			}
			var delay = $q.defer();
			ComprobanteEmpresaPaginador.get({ id_empresa: paginator.filter.empresa, pagina: paginator.currentPage, items_pagina: paginator.itemsPerPage, inicio: paginator.filter.inicio, fin: paginator.filter.fin, columna: paginator.column, direccion: paginator.direction, monto: paginator.filter.monto, tipo_comprobante: paginator.filter.tipo_comprobante, sucursal: paginator.filter.sucursal, usuario: paginator.filter.usuario, numero: paginator.filter.numero,busqueda:paginator.search }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}]) */



