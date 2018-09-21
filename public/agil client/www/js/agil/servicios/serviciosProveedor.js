angular.module('agil.servicios')
	.factory('ProveedorVencimientoCredito',  ['$resource',function ($resource) {
		return $resource(restServer + "proveedor-vencimiento-Deudas/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])
	.factory('Proveedor',  ['$resource',function ($resource) {
		return $resource(restServer + "proveedores/:idProveedor", { idProveedor: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])
	.factory('EliminarProveedor', ['Proveedor', '$q', function (Proveedor, $q) {
		var res = function (proveedor) {
			var delay = $q.defer();
			Proveedor.delete({ idProveedor: proveedor}, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('ProveedoresEmpresaPaginador',  ['$resource',function ($resource) {
		return $resource(restServer + "proveedor/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda");
	}])

	.factory('ProveedoresPaginador', ['ProveedoresEmpresaPaginador', '$q', function (ProveedoresEmpresaPaginador, $q) {
		var res = function (idEmpresa, pagina, itemsPagina, texto) {
			var delay = $q.defer();
			ProveedoresEmpresaPaginador.get({ id_empresa: idEmpresa, pagina: pagina, items_pagina: itemsPagina, texto_busqueda: texto }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('ProveedoresEmpresa',  ['$resource',function ($resource) {
		return $resource(restServer + "proveedores/empresa/:idEmpresa");
	}])

	.factory('Proveedores', ['ProveedoresEmpresa', '$q', function (ProveedoresEmpresa, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			ProveedoresEmpresa.query({ idEmpresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('BusquedaProveedoresNit',  ['$resource',function ($resource) {
		return $resource(restServer + "proveedores/empresa/:idEmpresa/texto/:texto");
	}])

	.factory('ProveedoresNit', ['BusquedaProveedoresNit', '$q', function (BusquedaProveedoresNit, $q) {
		var res = function (idEmpresa, texto) {
			var delay = $q.defer();
			BusquedaProveedoresNit.query({ idEmpresa: idEmpresa, texto: texto }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('ObtenerProductosProveedor',  ['$resource',function ($resource) {
		return $resource(restServer + "proveedores/productos/empresa/:id_empresa/:id_proveedor", null)
	}])

	.factory('ListaProductosProveedores', ['ObtenerProductosProveedor', '$q', function (ObtenerProductosProveedor, $q) {
		var res = function (idEmpresa, proveedor) {
			var delay = $q.defer();
			ObtenerProductosProveedor.get({ id_empresa: idEmpresa, id_proveedor: proveedor.id }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('AsignarProductosProveedor',  ['$resource',function ($resource) {
		return $resource(restServer + "proveedores/productos/empresa/:id_empresa", null)
	}])

	.factory('ActualizarProductosProveedor', ['AsignarProductosProveedor', '$q', function (AsignarProductosProveedor, $q) {
		var res = function (idEmpresa, info, proveedor) {
			var delay = $q.defer();
			AsignarProductosProveedor.save({ id_empresa: idEmpresa }, { id_proveedor: proveedor.id, productos: info }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}]);