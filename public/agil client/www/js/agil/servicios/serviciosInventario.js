angular.module('agil.servicios')


	.factory('Compra', function ($resource) {
		return $resource(restServer + "compras/:id", null,
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('ActualizarDetalleMovimiento', function ($resource) {
		return $resource(restServer + "actualizar-movimiento-detalle/:id", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('CompraDatos', ['Compra', '$q', function (Compra, $q) {
		var res = function (id_compra) {
			var delay = $q.defer();
			Compra.get({ id: id_compra }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('SaveCompra', ['Compra', '$q', function (Compra, $q) {
		var res = function (datos) {
			var delay = $q.defer();
			Compra.save({}, datos, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])


	.factory('Venta', function ($resource) {
		return $resource(restServer + "ventas/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})
	
	.factory('EliminarVentaServicio', ['Venta', '$q', function (Venta, $q) {
		var res = function (venta) {
			var delay = $q.defer();
			Venta.save({ id: venta.id},venta, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('ModificarVenta', ['Venta', '$q', function (Venta, $q) {
		var res = function (venta) {
			var delay = $q.defer();
			Venta.update({ id: venta.id},venta, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('CompraEmpresaDatos', function ($resource) {
		return $resource(restServer + "compras/:id/empresa/:id_empresa", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('DatosCompra', ['CompraEmpresaDatos', '$q', function (CompraEmpresaDatos, $q) {
		var res = function (id_compra, id_empresa) {
			var delay = $q.defer();
			CompraEmpresaDatos.get({ id: id_compra, id_empresa: id_empresa }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('CompraFiltro', function ($resource) {
		return $resource(restServer + "compras/:idsSucursales/inicio/:inicio/fin/:fin/razon-social/:razon_social/nit/:nit/monto/:monto/tipo-compra/:tipo_compra/sucursal/:sucursal/usuario/:usuario/user/:id_usuario/tipo/:tipo", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('Compras', ['CompraFiltro', '$q', function (CompraFiltro, $q) {
		var res = function (sucursales, inicio, fin, razon_social, nit, monto, tipo_pago, sucursal, usuario, id_usuario, tipo) {
			var delay = $q.defer();
			CompraFiltro.query({ idsSucursales: sucursales, inicio: inicio, fin: fin, razon_social: razon_social, nit: nit, monto: monto, tipo_compra: tipo_pago, sucursal: sucursal, usuario: usuario, id_usuario: id_usuario, tipo: tipo }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('InventarioEmpresaPaginador', function ($resource) {
		return $resource(restServer + "inventarios/empresa/:id_empresa/almacen/:id_almacen/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion/cantidad/:cantidad/grupo/:id_grupo/user/:id_usuario");
	})

	.factory('InventarioPaginador', ['InventarioEmpresaPaginador', '$q', function (InventarioEmpresaPaginador, $q) {
		var res = function (idEmpresa, idAlmacen, pagina, itemsPagina, texto, columna, direccion, cantidad, grupo, id_usuario) {
			var delay = $q.defer();
			InventarioEmpresaPaginador.get({ id_empresa: idEmpresa, id_almacen: idAlmacen, pagina: pagina, items_pagina: itemsPagina, texto_busqueda: texto, columna: columna, direccion: direccion, cantidad: cantidad, id_grupo: (grupo !== undefined && grupo !== null && grupo !== "") ? grupo : 0, id_usuario: id_usuario }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('Inventario', function ($resource) {
		return $resource(restServer + "inventarios/:id_empresa", null,
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('InventariosIncial', function ($resource) {
		return $resource(restServer + "inventarios", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('Inventarios', ['Inventario', '$q', function (Inventario, $q) {
		var res = function (id_empresa) {
			var delay = $q.defer();
			Inventario.query({ id_empresa: id_empresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('InventarioInicial', ['InventariosIncial', '$q', function (InventariosIncial, $q) {
		var res = function (producto) {
			var delay = $q.defer();
			InventariosIncial.save(producto, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('Venta', function ($resource) {
		return $resource(restServer + "ventas/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})

	/*.factory('ActualizarVenta', ['Venta', '$q', function (Venta, $q) {
		var res = function (venta) {
			var delay = $q.defer();
			Venta.update({ id: venta.id}, venta, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])*/
	.factory('VentaEmpresaDatos', function ($resource) {
		return $resource(restServer + "ventas/:id/empresa/:id_empresa", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('DatosVenta', ['VentaEmpresaDatos', '$q', function (VentaEmpresaDatos, $q) {
		var res = function (id_venta, id_empresa) {
			var delay = $q.defer();
			VentaEmpresaDatos.get({ id: id_venta, id_empresa: id_empresa }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('VentaFiltro', function ($resource) {
		return $resource(restServer + "ventas/:idsSucursales/inicio/:inicio/fin/:fin/razon-social/:razon_social/nit/:nit/monto/:monto/tipo-venta/:tipo_venta/sucursal/:sucursal/transaccion/:transaccion/usuario/:usuario/estado/:estado", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('Ventas', ['VentaFiltro', '$q', function (VentaFiltro, $q) {
		var res = function (sucursales, inicio, fin, razon_social, nit, monto, tipo_pago, sucursal, transaccion, usuario, estado) {
			var delay = $q.defer();
			VentaFiltro.query({ idsSucursales: sucursales, inicio: inicio, fin: fin, razon_social: razon_social, nit: nit, monto: monto, tipo_venta: tipo_pago, sucursal: sucursal, transaccion: transaccion, usuario: usuario, estado: estado }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('VentaFiltroProducto', function ($resource) {
		return $resource(restServer + "ventasProductos/:idsSucursales/inicio/:inicio/fin/:fin/sucursal/:sucursal/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('VentasProductos', ['VentaFiltroProducto', '$q', function (VentaFiltro, $q) {
		var res = function (paginador) {
			var delay = $q.defer();
			VentaFiltro.get({ idsSucursales: paginador.filter.sucursalUsuario,
				 inicio: paginador.filter.inicio,
				  fin: paginador.filter.fin, 				 
				  pagina: paginador.currentPage,
				  items_pagina: paginador.itemsPerPage,
				  texto_busqueda: paginador.search,
				  columna: paginador.column,
				  direccion: paginador.direction,
				  sucursal: paginador.filter.sucursal
				}, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('detalleVentaEmpresa', function($resource) {
		return $resource(restServer + "ventasDetalleEmpresa/:idsSucursales/inicio/:inicio/fin/:fin/sucursal/:sucursal/idEmpresa/:idEmpresa/pagina/:pagina/items-pagina/:items_pagina/busqueda/:texto_busqueda/columna/:columna/direccion/:direccion", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ventasDetalleEmpresa',['detalleVentaEmpresa','$q',function(detalleEmpresa, $q){
		var res = function(paginador){
			var delay = $q.defer();
				detalleEmpresa.get({ 
					idsSucursales:paginador.filter.idsSucursales,
					inicio: paginador.filter.inicio, 
					fin: paginador.filter.fin, 	
					sucursal:paginador.filter.sucursal,
					idEmpresa:paginador.filter.idEmpresa,				 
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

	
	.factory('detalleProductos', function ($resource) {
		return $resource(restServer + "detalle/:inicio/:fin/:idEmpresa/:id", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('detalle', ['detalleProductos', '$q', function (detalle, $q) {
		var res = function (inicio, fin,idEmpresa, id) {
			var delay = $q.defer();
			detalle.query({ inicio: inicio, fin: fin,idEmpresa:idEmpresa, id: id }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('VentaContado', function ($resource) {
		return $resource(restServer + "ventas-contado/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('VentasContado', ['VentaContado', '$q', function (VentaContado, $q) {
		var res = function (sucursales, inicio, fin, id_usuario, id_cierre_caja) {
			var delay = $q.defer();
			VentaContado.query({ idsSucursales: sucursales, inicio: inicio, fin: fin, id_usuario: id_usuario, id_cierre_caja: id_cierre_caja }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('VentaCredito', function ($resource) {
		return $resource(restServer + "ventas-credito/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('VentasCredito', ['VentaCredito', '$q', function (VentaCredito, $q) {
		var res = function (sucursales, inicio, fin, id_usuario, id_cierre_caja) {
			var delay = $q.defer();
			VentaCredito.query({ idsSucursales: sucursales, inicio: inicio, fin: fin, id_usuario: id_usuario, id_cierre_caja: id_cierre_caja }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('PagoVenta', function ($resource) {
		return $resource(restServer + "pagos-venta/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('PagosVenta', ['PagoVenta', '$q', function (PagoVenta, $q) {
		var res = function (sucursales, inicio, fin, id_usuario, id_cierre_caja) {
			var delay = $q.defer();
			PagoVenta.query({ idsSucursales: sucursales, inicio: inicio, fin: fin, id_usuario: id_usuario, id_cierre_caja: id_cierre_caja }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('PagoCompra', function ($resource) {
		return $resource(restServer + "pagos-compra/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('PagosCompra', ['PagoCompra', '$q', function (PagoCompra, $q) {
		var res = function (sucursales, inicio, fin, id_usuario, id_cierre_caja) {
			var delay = $q.defer();
			PagoCompra.query({ idsSucursales: sucursales, inicio: inicio, fin: fin, id_usuario: id_usuario, id_cierre_caja: id_cierre_caja }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('VentaEmpresa', function ($resource) {
		return $resource(restServer + "ventas/:id_empresa/inicio/:inicio/fin/:fin", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('VentasEmpresa', ['VentaEmpresa', '$q', function (VentaEmpresa, $q) {
		var res = function (idEmpresa, inicio, fin) {
			var delay = $q.defer();
			VentaEmpresa.query({ id_empresa: idEmpresa, inicio: inicio, fin: fin }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('GastosVarios', function ($resource) {
		return $resource(restServer + "detalles_compra/:id_empresa/inicio/:inicio/fin/:fin", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('GastosVariosLista', ['GastosVarios', '$q', function (GastosVarios, $q) {
		var res = function (idEmpresa, inicio, fin) {
			var delay = $q.defer();
			GastosVarios.query({ id_empresa: idEmpresa, inicio: inicio, fin: fin }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('IngresosPorInventario', function ($resource) {
		return $resource(restServer + "ingreso-por-inventario/:id_empresa", { id_empresa: '@idEmpresa' },
			{
				get: { method: 'GET', isArray: true }
			});
	})
	.factory('IngPorInventario', ['IngresosPorInventario','$q',function(IngresosPorInventario, $q) 
		{
		var res = function(idEmpresa) 
		{
			var delay = $q.defer();
			IngresosPorInventario.get({id_empresa:idEmpresa},function(entidades) 
			{        
				delay.resolve(entidades);
			}, function(error) 
				{
					delay.reject(error);
				});
			return delay.promise;
		};
			return res;
		}])
	/*.factory('IngPorInventario', function($resource) {
			return $resource(restServer+"ingreso-por-inventario/:id_empresa", null,
			{
				'update': { method:'PUT' }
			});
	})
	
	.factory('IngresosPorInventario', ['IngPorInventario','$q',function(IngPorInventario, $q) 
		{
		var res = function(idEmpresa) 
		{
			var delay = $q.defer();
			IngPorInventario.query({id_empresa:idEmpresa},function(entidades) 
			{        
				delay.resolve(entidades);
			}, function(error) 
				{
					delay.reject(error);
				});
			return delay.promise;
		};
			return res;
		}])*/
	.factory('ActualizacionInventario', function ($resource) {
		return $resource(restServer + "inventario/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('CompraContado', function ($resource) {
		return $resource(restServer + "compras-contado/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ComprasContado', ['CompraContado', '$q', function (CompraContado, $q) {
		var res = function (sucursales, inicio, fin, id_usuario, id_cierre_caja) {
			var delay = $q.defer();
			CompraContado.query({ idsSucursales: sucursales, inicio: inicio, fin: fin, id_usuario: id_usuario, id_cierre_caja: id_cierre_caja }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('CompraCredito', function ($resource) {
		return $resource(restServer + "compras-credito/:idsSucursales/inicio/:inicio/fin/:fin/usuario/:id_usuario/cierre-caja/:id_cierre_caja", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ComprasCredito', ['CompraCredito', '$q', function (CompraCredito, $q) {
		var res = function (sucursales, inicio, fin, id_usuario, id_cierre_caja) {
			var delay = $q.defer();
			CompraCredito.query({ idsSucursales: sucursales, inicio: inicio, fin: fin, id_usuario: id_usuario, id_cierre_caja: id_cierre_caja }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])

	.factory('VerificarExesoCredito', function ($resource) {
		return $resource(restServer + "cliente/verificar-credito/:id_cliente/tipo/:id_tipo", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('VerificarLimiteCredito', ['VerificarExesoCredito', '$q', function (VerificarExesoCredito, $q) {
		var res = function (venta) {
			var delay = $q.defer();
			VerificarExesoCredito.get({ id_cliente: venta.cliente.id, id_tipo: venta.tipoPago.id }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('CompraPedidosEmpresa', function ($resource) {
		return $resource(restServer + "compra/pedido/empresa/:id_empresa", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ListaCompraPedidosEmpresa', ['CompraPedidosEmpresa', '$q', function (CompraPedidosEmpresa, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			CompraPedidosEmpresa.get({ id_empresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('ServiciosVentas', function ($resource) {
		return $resource(restServer + "servicios-venta/empresa/:id_empresa", null,
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ListaServiciosVentas', ['ServiciosVentas', '$q', function (ServiciosVentas, $q) {
		var res = function (idEmpresa) {
			var delay = $q.defer();
			ServiciosVentas.get({ id_empresa: idEmpresa }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('GuardarListaServiciosVentas', ['ServiciosVentas', '$q', function (ServiciosVentas, $q) {
		var res = function (idEmpresa,datos) {
			var delay = $q.defer();
			ServiciosVentas.save({ id_empresa: idEmpresa },datos, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}])
	.factory('VentasServicioImportados', function ($resource) {
		return $resource(restServer + "importacion-ventas-servicio", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('GuardarVentasImportados', ['VentasServicioImportados', '$q', function (VentasServicioImportados, $q) {
		var res = function (ventas,arregloServicios,arregloClientes) {
			var delay = $q.defer();
			VentasServicioImportados.save(null,{ventas:ventas,arregloServicios:arregloServicios,arregloClientes:arregloClientes}, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}]);
	/* .factory('VentaServico', function ($resource) {
		return $resource(restServer + "venta/servicios/:id", { id: '@id' },
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('DatosCompra', ['VentaServico', '$q', function (VentaServico, $q) {
		var res = function (id_compra, id_empresa) {
			var delay = $q.defer();
			VentaServico.get({ id: id_compra, id_empresa: id_empresa }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
					delay.reject(error);
				});
			return delay.promise;
		};
		return res;
	}]);
 */