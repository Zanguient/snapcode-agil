angular.module('agil.servicios')

	.factory('GtmTransportista', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-transportistas/empresa/:id_empresa");
	}])

	.factory('GtmTransportistaItem', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-transportistas/:id_transportista", { id_transportista: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('GtmTransportistas', ['GtmTransportista', '$q', function (GtmTransportista, $q) {
		var res = function (id_empresa) {
			var delay = $q.defer();
			GtmTransportista.query({ id_empresa: id_empresa }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('GtmEstibaje', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-estibajes/empresa/:id_empresa");
	}])

	.factory('GtmEstibajeItem', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-estibajes/:id_estibaje", { id_estibaje: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('GtmEstibajes', ['GtmEstibaje', '$q', function (GtmEstibaje, $q) {
		var res = function (id_empresa) {
			var delay = $q.defer();
			GtmEstibaje.query({ id_empresa: id_empresa }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('GtmGrupoEstibaje', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-grupo-estibajes/empresa/:id_empresa");
	}])

	.factory('GtmGrupoEstibajeItem', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-grupo-estibajes/:id_grupo_estibaje", { id_grupo_estibaje: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('GtmGrupoEstibajes', ['GtmGrupoEstibaje', '$q', function (GtmGrupoEstibaje, $q) {
		var res = function (id_empresa) {
			var delay = $q.defer();
			GtmGrupoEstibaje.query({ id_empresa: id_empresa }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('GtmDestino', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-destinos/empresa/:id_empresa");
	}])

	.factory('GtmDestinoItem', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-destinos/:id_destino", { id_destino: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('GtmDestinos', ['GtmDestino', '$q', function (GtmDestino, $q) {
		var res = function (id_empresa) {
			var delay = $q.defer();
			GtmDestino.query({ id_empresa: id_empresa }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('GtmDetalleDespachoAlerta', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-despacho/empresa/:id_empresa/inicio/:inicio/fin/:fin/empleado/:empleado/cliente/:cliente", { id_empresa: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])
	.factory('GtmDetallesDespachoAlerta', ['GtmDetalleDespachoAlerta', '$q', function (GtmDetalleDespachoAlerta, $q) {
		var res = function (id_empresa,filtro) {
			var filtro2={}
			filtro2.inicio2=(filtro.inicio2=="")?0:filtro.inicio2
			filtro2.fin2=(filtro.fin2=="")?0:filtro.fin2
			filtro2.empleado=(filtro.empleado=="")?0:filtro.empleado
			filtro2.razon_social=(filtro.razon_social=="")?0:filtro.razon_social
			var delay = $q.defer();
			GtmDetalleDespachoAlerta.query({
				id_empresa: id_empresa,
				inicio:filtro2.inicio2,
				fin:filtro2.fin2,
				empleado:filtro2.empleado,
				cliente:filtro2.razon_social
			}, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('GuardarGtmDetalleDespachoAlerta', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-despacho/empresa/:id_empresa/fecha/:fecha", { id_empresa: '@id',fecha:'@fecha' },
			{
				'update': { method: 'PUT' }
			});
	}])
	
	.factory('GtmDespacho', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-despacho-despachado/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/inicio/:inicio/fin/:fin/transportista/:transportista/tipo/:tipo/grupo/:grupo/estado/:estado/vendedor/:vendedor/admin/:admin", null,
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('GtmDespachos', ['GtmDespacho', '$q', function (GtmDespacho, $q) {
		var res = function (paginator) {
			var delay = $q.defer();
			GtmDespacho.get({
				id_empresa: paginator.filter.id_empresa,
				pagina: paginator.currentPage,
				items_pagina: paginator.itemsPerPage,
				texto_busqueda: paginator.search,
				columna: paginator.column,
				direccion: paginator.direction,
				inicio: paginator.filter.inicio,
				fin: paginator.filter.fin,
				transportista: paginator.filter.transportista,
				tipo: paginator.filter.tipo,
				grupo: paginator.filter.grupo,
				estado: paginator.filter.estado,
				vendedor: paginator.filter.vendedor,
				admin:paginator.filter.admin
			}, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('GtmDetalleDespacho', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-despacho/:id_detalle_despacho", { id_detalle_despacho: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])
	.factory('GtmDetalleDespachoKardex', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-kardex/:id_detalle_kardex", { id_detalle_kardex: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])
	
	.factory('GtmDestinosEmpresa', ['GtmDestino', '$q', function (GtmDestino, $q) {
		var res = function (id_empresa, destinos) {
			var delay = $q.defer();
			GtmDestino.save({ id_empresa: id_empresa }, destinos, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])


	.factory('GtmTransportistasEmpresa', ['GtmTransportista', '$q', function (GtmTransportista, $q) {
		var res = function (id_empresa, transportistas) {
			var delay = $q.defer();
			GtmTransportista.save({ id_empresa: id_empresa }, transportistas, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('GtmDetalleDespachoHijos', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-despacho/:id_detalle_despacho/padre/:id_padre", { id_detalle_despacho: '@id' },
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('GetGtmDetalleDespachoHijos', ['GtmDetalleDespachoHijos', '$q', function (GtmDetalleDespachoHijos, $q) {
		var res = function (DetalleDespacho) {
			var delay = $q.defer();
			GtmDetalleDespachoHijos.get({id_detalle_despacho:DetalleDespacho.id, id_padre: DetalleDespacho.id_padre }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('GtmDetalleKardexFactura', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-despacho-kardex-factura/empresa/:id_empresa/inicio/:inicio/fin/:fin/pendiente/:pendiente", null,
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('ListaDetalleKardexFactura', ['GtmDetalleKardexFactura', '$q', function (GtmDetalleKardexFactura, $q) {
		var res = function (idEmpresa,filtro) {
			var delay = $q.defer();
			GtmDetalleKardexFactura.query({id_empresa:idEmpresa,inicio:filtro.inicio,fin:filtro.fin,pendiente:filtro.pendiente}, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('GtmDespachoResivo', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-despacho-detalle-resivo/:id_despacho", null,
			{
				'update': { method: 'PUT' }
			});
	}]).factory('CrearDespachoResivo', ['GtmDespachoResivo', '$q', function (GtmDespachoResivo, $q) {
		var res = function (idDespacho, datos) {
			var delay = $q.defer();
			GtmDespachoResivo.save({ id_despacho: idDespacho }, datos, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('GtmDespachoUbicacion', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-despacho-ubicacion/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/inicio/:inicio/fin/:fin/cliente/:cliente/vendedor/:vendedor", null,
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('GtmDespachosUbicacion', ['GtmDespachoUbicacion', '$q', function (GtmDespachoUbicacion, $q) {
		var res = function (paginator) {
			var delay = $q.defer();
			GtmDespachoUbicacion.get({
				id_empresa: paginator.filter.id_empresa,
				pagina: paginator.currentPage,
				items_pagina: paginator.itemsPerPage,
				texto_busqueda: paginator.search,
				columna: paginator.column,
				direccion: paginator.direction,
				inicio: paginator.filter.inicio,
				fin: paginator.filter.fin,
				cliente: paginator.filter.cliente,			
				vendedor: paginator.filter.vendedor
			}, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('DespachosVendedor', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-despacho-ubicacion/vendedor/:id_vendedor/fecha/:fecha", null,
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('BuscarDespachosVendedor', ['DespachosVendedor', '$q', function (DespachosVendedor, $q) {
		var res = function (filtro) {
			var delay = $q.defer();
			DespachosVendedor.get({
				id_vendedor: filtro.vendedor.id,
				fecha: filtro.fechaBusqueda,
			}, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('FiltrarVendedor', ['$resource',function ($resource) {
		return $resource(restServer + "gtm-detalle-despacho-ubicacion/empresa/:id_empresa/vendedor/:nombre", null,
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('FiltrarVendedorEmpresa', ['FiltrarVendedor', '$q', function (FiltrarVendedor, $q) {
		var res = function (idEmpresa,texto) {
			var delay = $q.defer();
			FiltrarVendedor.query({
				id_empresa: idEmpresa,
				nombre: texto,
			}, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])

	.factory('Pedidos', ['$resource',function ($resource) {
		return $resource(restServer + "/gtm-despacho/empresa/:id_empresa", { id_empresa: '@id_empresa' },
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('ClientePedido', ['$resource',function ($resource) {
		return $resource(restServer + "clientes-pedido/:id_empresa", { id_empresa: '@id_empresa' },
		{
			'update': { method: 'PUT' }
		});
	}])

	.factory('ClientePedidoRazonSocial', ['$resource',function ($resource) {
		return $resource(restServer + "clientes-razon/:id_cliente", { id_cliente: '@id_cliente' },
		{
			'update': { method: 'PUT' }
		});
	}])

	.factory('ClientePedidoDestino', ['$resource',function ($resource) {
		return $resource(restServer + "clientes-destino/:id_cliente", { id_cliente: '@id_cliente' },
		{
			'update': { method: 'PUT' }
		});
	}])

	.factory('ModificarDatosDespachoDetalle', ['$resource',function ($resource) {
		return $resource(restServer + "actualizar-gtm-detalle-despacho/despacho/:id_despacho", null,
			{
				'update': { method: 'PUT' }
			});
	}])

	.factory('ActualizarDatosDespachoDetalle', ['ModificarDatosDespachoDetalle', '$q', function (ModificarDatosDespachoDetalle, $q) {
		var res = function (datos) {
			var delay = $q.defer();
			ModificarDatosDespachoDetalle.update({
				id_despacho: datos.id,				
			},datos, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	
	