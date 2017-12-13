angular.module('agil.servicios')
.factory('ValidarCodigoCuenta', function($resource) {
	return $resource(restServer+"/validar-codigo",
	{
		'update': { method:'PUT' }
	});
})
	.factory('ConfigCuentas', function ($resource) {
		return $resource(restServer + "configuracion-cuentas/:id_empresa", { id_empresa: '@id_empresa' },
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('AsignarCuentaCiente', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/asignar-cuenta-cliente",
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('AsignarCuentaProveedor', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/asignar-cuenta-proveedor",
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('ConfiguracionesCuentasEmpresa', ['ConfigCuentas', '$q', function (ConfigCuentas, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			ConfigCuentas.get({ id_empresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('ConfiguracionCuentas', function ($resource) {
		return $resource(restServer + "configuracion-cuentas/empresa/:id_empresa", { id_empresa: '@id_empresa' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ConfiguracionCuentaEmpresa', ['ConfiguracionCuentas', '$q', function (ConfiguracionCuentas, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			ConfiguracionCuentas.get({ id_empresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('ContabilidadCuentas', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/empresa/:id_empresa", { id_empresa: '@id_empresa' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ListaContabilidadCuentas', ['ContabilidadCuentas', '$q', function (ContabilidadCuentas, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			ContabilidadCuentas.query({ id_empresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('ContabilidadCuenta', function ($resource) {
		return $resource(restServer + "contabilidad-cuenta/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('CuentaContabilidadFiltro', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/empresa/:id_empresa/clasificacion/:id_clasificacion/tipo/:id_tipo/monto/:monto/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/columna/:columna/direccion/:direccion", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('CuentaContabilidad', ['CuentaContabilidadFiltro', '$q', function (CuentaContabilidadFiltro, $q) {
		var res = function (paginator) {
			var delay = $q.defer();
			CuentaContabilidadFiltro.get({
				id_empresa: paginator.filter.empresa,
				id_clasificacion: paginator.filter.clasificacion,
				id_tipo: paginator.filter.tipo_cuenta,
				monto: paginator.filter.monto,
				pagina: paginator.currentPage,
				items_pagina: paginator.itemsPerPage,
				busqueda: paginator.search,
				columna: paginator.column,
				direccion: paginator.direction
			}, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('CuentasEmpresaPaginador', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda");
	})

	.factory('CuentasClasificaciones', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/clasificaciones/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('CuentasClasificacionesEdicion', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/clasificaciones/edicion", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('lasClasificaciones', ['CuentasClasificaciones', '$q', function (CuentasClasificaciones, $q) {
		var res = function () {
			var delay = $q.defer();
			CuentasClasificaciones.get(function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('TiposDeCuentas', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/tipos-cuenta/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('losTiposDeCuentas', ['TiposDeCuentas', '$q', function (TiposDeCuentas, $q) {
		var res = function () {
			var delay = $q.defer();
			TiposDeCuentas.get(function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('operaciones', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/calculos/operaciones/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('lasOperacionesCalculos', ['operaciones', '$q', function (operaciones, $q) {
		var res = function () {
			var delay = $q.defer();
			operaciones.get(function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('saldosClasificaciones', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/clasificaciones/saldos");
	})

	.factory('losSaldos', ['saldosClasificaciones', '$q', function (saldosClasificaciones, $q) {
		var res = function () {
			var delay = $q.defer();
			saldosClasificaciones.get(function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('movimientosClasificaciones', function ($resource) {
		return $resource(restServer + "contabilidad-cuentas/clasificaciones/movimientos");
	})

	.factory('losMovimientos', ['movimientosClasificaciones', '$q', function (movimientosClasificaciones, $q) {
		var res = function () {
			var delay = $q.defer();
			movimientosClasificaciones.get(function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('CuentasPaginador', ['CuentasEmpresaPaginador', '$q', function (CuentasEmpresaPaginador, $q) {
		var res = function (idEmpresa, pagina, itemsPagina, texto) {
			var delay = $q.defer();
			CuentasEmpresaPaginador.get({ id_empresa: idEmpresa, pagina: pagina, items_pagina: itemsPagina, texto_busqueda: texto }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('CuentasEmpresaCreacion', function ($resource) {
		return $resource(restServer + "cuentas/empresa");
	})
