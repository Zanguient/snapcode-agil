angular.module('agil.servicios')

	.factory('Producto', function ($resource) {
		return $resource(restServer + "productos/:idProducto", { idProducto: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('DatosProducto', ['Producto', '$q', function (Producto, $q) {
		var res = function (idProducto) {
			var delay = $q.defer();
			Producto.get({ idProducto: idProducto }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('ListaProductosKardex', function ($resource) {
		return $resource(restServer + "productos/kardex/empresa/:id_empresa/almacen/:id_almacen/grupo/:grupo");
	})

	.factory('ReporteProductosKardex', ['ListaProductosKardex', '$q', function (ListaProductosKardex, $q) {
		var res = function (idEmpresa, filtro) {
			var delay = $q.defer();
			ListaProductosKardex.query({ id_empresa: idEmpresa, id_almacen: filtro.almacen, grupo: filtro.grupo }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	
	.factory('ProductosKardex', function ($resource) {
		return $resource(restServer + "productos/kardex/:id_producto/almacen/:id_almacen/fecha-inicial/:fecha_inicio/fecha-final/:fecha_fin/lote/:lote/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion",null,
		{
			'update': { method: 'PUT' }
		});
	})

	.factory('ProductoKardex', ['ProductosKardex', '$q', function (ProductosKardex, $q) {
		/*var res = function (idProducto, idAlmacen, fechaInicio, fechaFin, lote) {
			var delay = $q.defer();
			ProductosKardex.query({ id_producto: idProducto, id_almacen: idAlmacen, fecha_inicio: fechaInicio, fecha_fin: fechaFin, lote: lote }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};*/
		var res = function(paginador){
			var delay = $q.defer();
			ProductosKardex.get({ 
					id_producto:paginador.filter.id_producto,
					id_almacen: paginador.filter.id_almacen, 
					fecha_inicio: paginador.filter.fecha_inicio, 	
					fecha_fin:paginador.filter.fecha_fin,
					lote:paginador.filter.lote,				 
					pagina: paginador.currentPage,
					items_pagina: paginador.itemsPerPage,
					texto_busqueda: paginador.search,
					columna: paginador.column,
					direccion: paginador.direction,

				}, function (entidades) {
					delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('ProductosEmpresaCreacion', function ($resource) {
		return $resource(restServer + "productos/empresa");
	})

	.factory('ProductosEmpresa', function ($resource) {
		return $resource(restServer + "productos/empresa/:idEmpresa");
	})

	.factory('ProductosEmpresaUsuario', function ($resource) {
		return $resource(restServer + "productos/empresa/:idEmpresa/user/:id_usuario");
	})

	.factory('Productos', ['ProductosEmpresa', '$q', function (ProveedoresEmpresa, $q) {
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
	.factory('ProductosUsuario', ['ProductosEmpresaUsuario', '$q', function (ProductosEmpresaUsuario, $q) {
		var res = function (idEmpresa, id_usuario) {
			var delay = $q.defer();
			ProductosEmpresaUsuario.query({ idEmpresa: idEmpresa, id_usuario: id_usuario }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('ProductosEmpresaPaginador', function ($resource) {
		return $resource(restServer + "productos/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/grupo/:id_grupo/user/:id_usuario");
	})

	.factory('ProductosPaginador', ['ProductosEmpresaPaginador', '$q', function (ProductosEmpresaPaginador, $q) {
		var res = function (idEmpresa, paginator, id_usuario) {
			var delay = $q.defer();
			ProductosEmpresaPaginador.get({
				id_empresa: idEmpresa,
				pagina: paginator.currentPage,
				items_pagina: paginator.itemsPerPage,
				texto_busqueda: paginator.search,
				columna: paginator.column,
				direccion: paginator.direction,
				id_grupo: paginator.filter.id,
				id_usuario: id_usuario
			}, function (entidades) {
					delay.resolve(entidades);
				}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('BusquedaProductos', function ($resource) {
		return $resource(restServer + "productos/empresa/:idEmpresa/almacen/:idAlmacen/texto/:texto");
	})

	.factory('ProductosNombre', ['BusquedaProductos', '$q', function (BusquedaProductos, $q) {
		var res = function (idEmpresa, idAlmacen, texto) {
			var delay = $q.defer();
			BusquedaProductos.query({ idEmpresa: idEmpresa, idAlmacen: idAlmacen, texto: texto }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('BusquedaProductosPanel', function ($resource) {
		return $resource(restServer + "productos-panel/empresa/:idEmpresa/almacen/:idAlmacen/user/:id_usuario");
	})

	.factory('ProductosPanel', ['BusquedaProductosPanel', '$q', function (BusquedaProductosPanel, $q) {
		var res = function (idEmpresa, idAlmacen, id_usuario) {
			var delay = $q.defer();
			BusquedaProductosPanel.query({ idEmpresa: idEmpresa, idAlmacen: idAlmacen, id_usuario: id_usuario }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('VencimientoProductoEmpresa', function ($resource) {
		return $resource(restServer + "vencimientos-productos/:id_empresa");
	})

	.factory('VencimientosProductosEmpresa', ['VencimientoProductoEmpresa', '$q', function (VencimientoProductoEmpresa, $q) {
		var res = function (id_empresa) {
			var delay = $q.defer();
			VencimientoProductoEmpresa.query({ id_empresa: id_empresa }, function (entities) {
				delay.resolve(entities);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('CodigoSiguienteProductoEmpresa', function ($resource) {
		return $resource(restServer + "producto/empresa/:id_empresa/siguiente-codigo");
	})

	.factory('DatoCodigoSiguienteProductoEmpresa', ['CodigoSiguienteProductoEmpresa', '$q', function (CodigoSiguienteProductoEmpresa, $q) {
		var res = function (id_empresa) {
			var delay = $q.defer();
			CodigoSiguienteProductoEmpresa.get({ id_empresa: id_empresa }, function (entities) {
				delay.resolve(entities);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('CatalogoProductosEmpresa', function ($resource) {
		return $resource(restServer + "catalogo-productos/empresa/:id_empresa/grupo/:id_grupo/user/:id_usuario");
	})

	.factory('CatalogoProductos', ['CatalogoProductosEmpresa', '$q', function (CatalogoProductosEmpresa, $q) {
		var res = function (idEmpresa, grupo, id_usuario) {
			var delay = $q.defer();
			CatalogoProductosEmpresa.get({
				id_empresa: idEmpresa,
				id_grupo: grupo.id,
				id_usuario: id_usuario
			}, function (entidades) {
					delay.resolve(entidades);
				}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])


	///busqueda por subgrupos de producto.
	.factory('ProductosEmpresaPaginadorSubgrupos', function ($resource) {
		return $resource(restServer + "productos/asignacion/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/subgrupo/:id_subgrupo/user/:id_usuario");
	})

	.factory('ProductosPaginadorSubgrupos', ['ProductosEmpresaPaginadorSubgrupos', '$q', function (ProductosEmpresaPaginadorSubgrupos, $q) {
		var res = function (idEmpresa, paginator, id_usuario) {
			var delay = $q.defer();
			ProductosEmpresaPaginadorSubgrupos.get({
				id_empresa: idEmpresa,
				pagina: paginator.currentPage,
				items_pagina: paginator.itemsPerPage,
				texto_busqueda: paginator.search,
				columna: paginator.column,
				direccion: paginator.direction,
				id_subgrupo: paginator.filter.id,
				id_usuario: id_usuario
			}, function (entidades) {
					delay.resolve(entidades);
				}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('ProductosAsignadosPaginadorProveedor', function ($resource) {
		return $resource(restServer + "productos/asignados/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/subgrupo/:id_subgrupo/user/:id_usuario/:ids");
	})

	.factory('ProductosPaginadorAsignados', ['ProductosAsignadosPaginadorProveedor', '$q', function (ProductosAsignadosPaginadorProveedor, $q) {
		var res = function (idEmpresa, paginator, id_usuario, proveedorIds, todos) {
			var delay = $q.defer();
			ProductosAsignadosPaginadorProveedor.get({
				id_empresa: idEmpresa,
				pagina: paginator.currentPage,
				items_pagina: todos ? 0 : paginator.itemsPerPage,
				texto_busqueda: paginator.search,
				columna: paginator.column,
				direccion: paginator.direction,
				id_subgrupo: paginator.filter.id,
				id_usuario: id_usuario,
				ids: proveedorIds
			}, function (entidades) {
					delay.resolve(entidades);
				}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	// .factory('ProductosAsignadosPaginadorProveedor', function ($resource) {
	// 	return $resource(restServer + "productos/asignados/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/subgrupo/:id_subgrupo/user/:id_usuario");
	// })

	// .factory('ProductosPaginadorSubgrupos', ['ProductosAsignadosPaginadorProveedor', '$q', function (ProductosAsignadosPaginadorProveedor, $q) {
	// 	var res = function (idEmpresa, paginator, id_usuario) {
	// 		var delay = $q.defer();
	// 		ProductosAsignadosPaginadorProveedor.get({
	// 			id_empresa: idEmpresa,
	// 			pagina: paginator.currentPage,
	// 			items_pagina: paginator.itemsPerPage,
	// 			texto_busqueda: paginator.search,
	// 			columna: paginator.column,
	// 			direccion: paginator.direction,
	// 			id_subgrupo: paginator.filter.id,
	// 			id_usuario: id_usuario
	// 		}, function (entidades) {
	// 				delay.resolve(entidades);
	// 			}, function (error) {
	// 				delay.reject(error);
	// 			});
	// 		return delay.promise;
	// 	};
	// 	return res;
	// }])
