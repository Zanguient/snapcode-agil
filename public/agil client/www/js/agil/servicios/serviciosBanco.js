angular.module('agil.servicios')
	.factory('Banco', function ($resource) {
		return $resource(restServer + "bancos/empresa/:idEmpresa", { id: '@idEmpresa' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('BancoDatos', function ($resource) {
		return $resource(restServer + "bancos/:id_banco", { id: '@id_banco' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ListaBancos', ['Banco', '$q', function (Banco, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			Banco.query({ idEmpresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('BancoEmpresaPaginador', function ($resource) {
		return $resource(restServer + "bancos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda");
	})

	.factory('BancoPaginador', ['BancoEmpresaPaginador', '$q', function (BancoEmpresaPaginador, $q) {
		var res = function (idEmpresa, pagina, itemsPagina, texto) {
			var delay = $q.defer();
			BancoEmpresaPaginador.get({ id_empresa: idEmpresa, pagina: pagina, items_pagina: itemsPagina, texto_busqueda: texto }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('TransaccionBancoEmpresaPaginador', function ($resource) {
		return $resource(restServer + "transacciones/bancos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/nombre/:texto_nombre/cta/:id_cuenta/desde/:desde/hasta/:hasta/concepto/:concepto/ref_doc/:ref_doc/tipo_doc/:tipo_doc/estado/:estado");
	})

	.factory('TransaccionBancoPaginador', ['TransaccionBancoEmpresaPaginador', '$q', function (TransaccionBancoEmpresaPaginador, $q) {
		var res = function (idEmpresa, filtro) {
			var delay = $q.defer();
			TransaccionBancoEmpresaPaginador.get(
				{ id_empresa: idEmpresa,
					pagina: filtro.currentPage,
					items_pagina: filtro.itemsPerPage,
					texto_nombre: filtro.filter.nombre,
					id_cuenta: (filtro.filter.cuenta.id!== undefined)? filtro.filter.cuenta.id: 0,
					desde: filtro.filter.desde,
					hasta: filtro.filter.hasta,
					concepto: filtro.filter.concepto,
					ref_doc: filtro.filter.ref_doc,
					tipo_doc: filtro.filter.tipo_doc,
					estado: filtro.filter.estado
				}, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('TransaccionIngresoBancoEmpresa', function ($resource) {
		return $resource(restServer + "transacciones/ingreso/bancos/empresa/:id_empresa/:id_ususario");
	})

	.factory('TransaccionIngresoBanco', ['TransaccionIngresoBancoEmpresa', '$q', function (TransaccionIngresoBancoEmpresa, $q) {
		var res = function (idEmpresa, transaccion, id_ususario) {
			var delay = $q.defer();
			TransaccionIngresoBancoEmpresa.save({ id_empresa: idEmpresa, id_ususario: id_ususario }, transaccion, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('TransaccionEgresoBancoEmpresa', function ($resource) {
		return $resource(restServer + "transacciones/egreso/bancos/empresa/:id_empresa/:id_ususario");
	})

	.factory('TransaccionEgresoBanco', ['TransaccionEgresoBancoEmpresa', '$q', function (TransaccionEgresoBancoEmpresa, $q) {
		var res = function (idEmpresa, transaccion, id_ususario) {
			var delay = $q.defer();
			TransaccionEgresoBancoEmpresa.save({ id_empresa: idEmpresa, id_ususario: id_ususario }, transaccion, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('TransaccionSeguimientoBancoEmpresa', function ($resource) {
		return $resource(restServer + "transacciones/seguimiento/bancos/empresa/:id_empresa/:id_usuario");
	})

	.factory('TransaccionSeguimientoBanco', ['TransaccionSeguimientoBancoEmpresa', '$q', function (TransaccionSeguimientoBancoEmpresa, $q) {
		var res = function (idEmpresa, seguimiento, id_usuario) {
			var delay = $q.defer();
			TransaccionSeguimientoBancoEmpresa.save({ id_empresa: idEmpresa, id_usuario: id_usuario }, seguimiento, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('TransaccionSeguimientoEstadoEmpresa', function ($resource) {
		return $resource(restServer + "transacciones/seguimiento/Estados/empresa", null, ///:id_empresa/:id_usuario/:id_estado
		{
			'update': { method: 'PUT' }
		})
	})

	.factory('TransaccionSeguimientoEstado', ['TransaccionSeguimientoEstadoEmpresa', '$q', function (TransaccionSeguimientoEstadoEmpresa, $q) {
		var res = function (idEmpresa, id_estado, id_usuario, id_trans) {
			var delay = $q.defer();
			TransaccionSeguimientoEstadoEmpresa.update(null, {id: id_trans, id_empresa: idEmpresa, id_usuario: id_usuario, id_estado: id_estado}, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('TransaccionRevisionEstadoEmpresa', function ($resource) {
		return $resource(restServer + "transacciones/revision/Estados/empresa", null, ///:id_empresa/:id_usuario/:id_trans
		{
			'update': { method: 'PUT' }
		})
	})

	.factory('TransaccionRevisionEstado', ['TransaccionRevisionEstadoEmpresa', '$q', function (TransaccionRevisionEstadoEmpresa, $q) {
		var res = function (idEmpresa, id_usuario, id_trans) {
			var delay = $q.defer();
			TransaccionRevisionEstadoEmpresa.update(null,{ id_empresa: idEmpresa, id_usuario: id_usuario, id_trans: id_trans }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('SaldoCuentaEmpresa', function ($resource) {
		return $resource(restServer + "transacciones/saldo/cuenta/empresa/:id_empresa/:id_cuenta/:fecha_desde/:fecha_hasta", null, ///:id_empresa/:id_usuario/:id_trans
		{
			'update': { method: 'PUT' }
		})
	})

	.factory('SaldoCuenta', ['SaldoCuentaEmpresa', '$q', function (SaldoCuentaEmpresa, $q) {
		var res = function (idEmpresa, cuenta, desde, hasta) {
			var delay = $q.defer();
			SaldoCuentaEmpresa.get({ id_empresa: idEmpresa, id_cuenta: cuenta, fecha_desde:desde, fecha_hasta: hasta },null , function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('SaldoDisponibleCuentaEmpresa', function ($resource) {
		return $resource(restServer + "transacciones/saldo/disponible/empresa/:id_empresa/:id_cuenta/:fecha_desde/:fecha_hasta", null, ///:id_empresa/:id_usuario/:id_trans
		{
			'update': { method: 'PUT' }
		})
	})

	.factory('SaldoDisponibleCuenta', ['SaldoDisponibleCuentaEmpresa', '$q', function (SaldoDisponibleCuentaEmpresa, $q) {
		var res = function (idEmpresa, cuenta, desde, hasta) {
			var delay = $q.defer();
			SaldoDisponibleCuentaEmpresa.get({ id_empresa: idEmpresa, id_cuenta: cuenta, fecha_desde: desde, fecha_hasta: hasta },null , function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('SaldoProformasEmpresa', function ($resource) {
		return $resource(restServer + "transacciones/saldo/proformas/empresa/:id_empresa", null, ///:id_empresa/:id_usuario/:id_trans
		{
			'update': { method: 'PUT' }
		})
	})

	.factory('SaldoProformas', ['SaldoProformasEmpresa', '$q', function (SaldoProformasEmpresa, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			SaldoProformasEmpresa.get({ id_empresa: idEmpresa},null , function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])