angular.module('agil.servicios')

.factory('datosVehiculo', function ($resource) {
		return $resource(restServer + "mantenimiento-vehiculo/empresa/:id_empresa/Mantenimiento/:id_mantenimiento", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ObtenerDatosVehiculo', ['datosVehiculo', '$q', function (datosVehiculo, $q) {
		var res = function (idEmpresa,idMantenimiento) {
			var delay = $q.defer();
			datosVehiculo.get({id_empresa:idEmpresa,id_mantenimiento:idMantenimiento}, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('NuevaOrdenDeTrabajo', function ($resource) {
		return $resource(restServer + "orden-de-trabajo/empresa", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('GuardarNuevaOrdendeTrabajo', ['NuevaOrdenDeTrabajo', '$q', function (NuevaOrdenDeTrabajo, $q) {
		var res = function (ordentrabajo) {
			var delay = $q.defer();
			NuevaOrdenDeTrabajo.save(ordentrabajo, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('ActualizarOrdendeTrabajo', ['NuevaOrdenDeTrabajo', '$q', function (NuevaOrdenDeTrabajo, $q) {
		var res = function (ordentrabajo) {
			var delay = $q.defer();
			NuevaOrdenDeTrabajo.update(ordentrabajo, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('Vehiculos', function ($resource) {
		return $resource(restServer + "vehiculos/empresa/:id_empresa", { id_empresa: '@id_empresa' },
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('ListaFechasVehiculos', function ($resource) {
		return $resource(restServer + "orden-de-trabajo/empresa/:id_empresa/correctivo/:correctivo/preventivo/:preventivo/rutina/:rutina/entrega/:entrega", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('DatosFechasVehiculos', ['ListaFechasVehiculos', '$q', function (ListaFechasVehiculos, $q) {
		var res = function (dato) {
			var delay = $q.defer();
			ListaFechasVehiculos.query({
				id_empresa: dato.id_empresa,
				correctivo: dato.correctivo,
				preventivo: dato.preventivo,
				rutina: dato.rutina,
				entrega: dato.entrega,
			}, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	//paginador

	.factory('VehiculosEmpresaPaginador', function ($resource) {
		return $resource(restServer + "mantenimiento/vehiculo/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/inicio/:inicio/fin/:fin/tipo_activo/:tipo_activo/placa/:placa/marca/:marca/modelo/:modelo/anio/:anio/tipo_mantenimiento/:tipo_mantenimiento/numero_ot/:numero_ot/estado_ot/:estado_ot/campamento/:campamento", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('VehiculosPaginador', ['VehiculosEmpresaPaginador', '$q', function (ProductosEmpresaPaginador, $q) {
		var res = function (paginator) {
			var delay = $q.defer();
			ProductosEmpresaPaginador.get({
				id_empresa: paginator.filter.empresa,
				pagina: paginator.currentPage,
				items_pagina: paginator.itemsPerPage,
				texto_busqueda: paginator.search,
				columna: paginator.column,
				direccion: paginator.direction,
				inicio: paginator.filter.inicio,
				fin: paginator.filter.fin,
				tipo_activo: paginator.filter.tipo_activo,
				placa:paginator.filter.placa,
				marca: paginator.filter.marca,
				modelo: paginator.filter.modelo,
				anio: paginator.filter.anio,
				tipo_mantenimiento: paginator.filter.tipo_mantenimiento,
				numero_ot:paginator.filter.numero_ot,
				estado_ot:paginator.filter.estado_ot,
				campamento:paginator.filter.campamento 
			}, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	// autocompletar numero placa
	.factory('MantenimientoVehiculo', function ($resource) {
		return $resource(restServer + "mantenimiento-vehiculo/empresa/:id_empresa/busqueda/:buscar", { id_empresa: '@id_empresa', buscar: '@buscar' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ListaMantenimientoVehiculo', ['MantenimientoVehiculo', '$q', function (MantenimientoVehiculo, $q) {
		var res = function (id_empresa, buscar) {
			var delay = $q.defer();
			MantenimientoVehiculo.query({ id_empresa: id_empresa, buscar: buscar }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	// autocompletar encargado
	.factory('MantenimientoEncargado', function ($resource) {
		return $resource(restServer + "mantenimiento-encargado/empresa/:id_empresa/busqueda/:buscar", { id_empresa: '@id_empresa', buscar: '@buscar' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ListaMantenimientoEncargado', ['MantenimientoEncargado', '$q', function (MantenimientoEncargado, $q) {
		var res = function (id_empresa, buscar) {
			var delay = $q.defer();
			MantenimientoEncargado.query({ id_empresa: id_empresa, buscar: buscar }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
//guardar nuevoOt
