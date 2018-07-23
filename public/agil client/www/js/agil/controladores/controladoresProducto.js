angular.module('agil.controladores')

	.controller('ControladorProductos', function ($scope, $timeout, $filter, $window, $localStorage, $location, $templateCache,
		$route, blockUI, Producto, Productos, ProductosPaginador, ProductosEmpresa,
		ClasesTipo, Clases, ProductoKardex, ProductosEmpresaCreacion, DatoCodigoSiguienteProductoEmpresa, ListaProductosEmpresa,
		Paginator, ListaCuentasComprobanteContabilidad, DatosProducto, CatalogoProductos,
		ListaGruposProductoEmpresa, ListaSubGruposProductoEmpresa, ListaGruposProductoUsuario, ReporteProductosKardex) {
		blockUI.start();
		$scope.idModalWizardProductoKardex = 'modal-wizard-producto-kardex';
		$scope.idModalWizardProductoEdicion = 'modal-wizard-producto-edicion';
		$scope.idModalWizardProductoVista = 'modal-wizard-producto-vista';
		$scope.idModalEliminarProducto = 'dialog-eliminar-producto';
		$scope.idModalContenedorProductoEdicion = 'modal-wizard-container-producto-edicion';
		$scope.idModalContenedorProductoVista = 'modal-wizard-container-producto-vista';
		$scope.idModalContenedorProductoKardex = 'modal-wizard-container-producto-kardex';
		$scope.idImagenProducto = 'imagen-producto';
		$scope.idModalReporteProductosKardex = "dialog-reporte-productos-kardex"
		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerTipoProducto();
			$scope.obtenerProductos();
			$scope.obtenerSucursales();
			$scope.obtenerGruposProductosEmpresaUsuario();
			$scope.obtenerSubGruposProductosEmpresa();
			$scope.usarValuado = true
		}

		$scope.obtenerGruposProductosEmpresaUsuario = function () {
			blockUI.start()
			var promesa = ListaGruposProductoUsuario($scope.usuario.id_empresa, $scope.usuario.id);
			promesa.then(function (grupos) {
				blockUI.stop()
				if (grupos.length > 0) {
					$scope.gruposProducto = grupos;
				} else {
					$scope.gruposProducto = []
					$scope.mostrarMensaje('Parece que el usuario actual no cuenta con grupos de productos.')
				}
			}).catch(function (err) {

				$scope.gruposProducto = []
			})
		}

		$scope.reporteProductosKardex = function (filtro) {
			blockUI.start()
			if (filtro.grupo == undefined) {
				filtro.grupo = 0
			}
			var promesa = ReporteProductosKardex($scope.usuario.id_empresa, filtro)
			promesa.then(function (datos) {
				//$scope.datosReporteProductoKardex=datos
				if (datos.length == 0) {
					$scope.mostrarMensaje('No existen datos')
					blockUI.stop()
					z
				} else {
					for (var i = 0; i < datos.length; i++) {
						datos[i] = $scope.generarKardexProductoReporte(datos[i])
						if (i === (datos.length - 1)) {
							var report = []
							var cabecera = [
								"Código",
								"Nombre",
								"Unidad Medida",
								"Saldo Fisico",
								"Saldo Valuado"]
							var wscols = [
								{ wch: 15 },
								{ wch: 20 },
								{ wch: 15 },
								{ wch: 15 },
							];
							report.push(cabecera)
							for (var i = 0; i < datos.length; i++) {
								var columns = [];
								columns.push(datos[i].codigo);
								columns.push(datos[i].nombre);
								columns.push(datos[i].unidad_medida);
								columns.push(datos[i].detallesMovimiento[datos[i].detallesMovimiento.length - 1].saldoFisico)
								columns.push(datos[i].detallesMovimiento[datos[i].detallesMovimiento.length - 1].saldoV);
								report.push(columns);
							}

							var ws_name = "SheetJS";
							var wb = new Workbook(), ws = sheet_from_array_of_arrays(report);
							ws['!cols'] = wscols;
							/* add worksheet to workbook */
							wb.SheetNames.push(ws_name);
							wb.Sheets[ws_name] = ws;
							var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true });
							saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "Catálogo productos.xlsx");
							blockUI.stop();
						}
					}

				}



			})
		}
		$scope.generarKardexProductoReporte = function (datos) {
			var dato = datos;
			$scope.Math = Math;
			dato.detallesMovimiento.sort(function (a, b) {
				return a.id - b.id
			})
			for (var i = 0; i < dato.detallesMovimiento.length; i++) {
				dato.detallesMovimiento[i].costo_unitario = Math.round((dato.detallesMovimiento[i].costo_unitario * 0.87) * 100) / 100;
				if (i == 0 && dato.detallesMovimiento[i].tipo == "SALDO ANTERIOR") {
					dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].saldoFisico;
					dato.detallesMovimiento[i].saldoValuado = dato.detallesMovimiento[i].saldoValuado;
					dato.detallesMovimiento[i].costo_unitario = Math.round((dato.detallesMovimiento[i].costo_unitario * 100 / 87) * 100) / 100;
				} else if (i == 0 && dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING && dato.detallesMovimiento[i].movimiento.clase.nombre_corto == $scope.diccionario.ING_INV_INICIAL) {
					dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
					dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i].saldoFisico * dato.detallesMovimiento[i].costo_unitario) * 100) / 100;
					dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
				} else if (i == 0 && dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING) {
					dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
					dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i].saldoFisico * dato.detallesMovimiento[i].costo_unitario) * 100) / 100;
					dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
				} else if (i == 0 && dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_EGR) {
					dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
					dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i].saldoFisico * dato.detallesMovimiento[i].costo_unitario) * 100) / 100;
					dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
				}
				else {
					if (dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING) {
						dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico + dato.detallesMovimiento[i].cantidad;
						dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado + (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
						dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
					} else {
						if (dato.detallesMovimiento[i].movimiento.venta) {
							//dato.detallesMovimiento[i].costo_unitario=dato.detallesMovimiento[i].costo_unitario*0.87;
							dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico - dato.detallesMovimiento[i].cantidad;
							dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado - (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
							dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre + " Nro. " + dato.detallesMovimiento[i].movimiento.venta.factura;
						} else {
							dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico - dato.detallesMovimiento[i].cantidad;
							dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado - (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
							dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
						}
					}

				}
				dato.detallesMovimiento[i].saldoV = dato.detallesMovimiento[i].saldoValuado.toFixed(2);
			}
			return dato;
		}
		$scope.obtenerSubGruposProductosEmpresa = function () {
			var promesa = ListaSubGruposProductoEmpresa($scope.usuario.id_empresa);
			promesa.then(function (subgrupos) {
				$scope.subgruposProducto = subgrupos;
			});
		}

		$scope.activoFijoAplicarDatePicker = function () {
			if ($scope.producto.activo_fijo) {
				$timeout(function () {
					aplicarDatePickers();
				}, 400);

			}
		}

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsProducto($scope.idModalWizardProductoEdicion,
				$scope.idModalWizardProductoVista,
				$scope.idModalWizardProductoKardex,
				$scope.idModalEliminarProducto,
				$scope.idModalContenedorProductoEdicion,
				$scope.idModalContenedorProductoVista,
				$scope.idModalContenedorProductoKardex,
				$scope.idImagenProducto,
				$scope.idModalReporteProductosKardex);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});

		$scope.crearNuevoProducto = function () {
			$scope.steps = [{ cabeza: "cabeza-datos-producto", cuerpo: "cuerpo-datos-producto" },
			{ cabeza: "cabeza-datos-adicionales", cuerpo: "cuerpo-datos-adicionales" },
			{ cabeza: "cabeza-tipo-producto", cuerpo: "cuerpo-tipo-producto" }]
			var promesa = DatoCodigoSiguienteProductoEmpresa($scope.usuario.id_empresa);
			promesa.then(function (dato) {
				$scope.ultimo_codigo = "FC" + dato.ultimo_codigo;
				$scope.producto = new Producto({ productosBase: [], id_empresa: $scope.usuario.id_empresa, imagen: './img/icon-producto-default.png' });
				if (!$scope.usuario.empresa.usar_consumos) {
					$scope.producto.tipoProducto = $.grep($scope.tipoProductos, function (e) { return e.nombre_corto == $scope.diccionario.TIPO_PRODUCTO_BASE; })[0];
				}
				$scope.producto.codigo = "FC" + (dato.ultimo_codigo + 1);
				$scope.productoBaseSeleccion = {};
				$scope.abrirPopup($scope.idModalWizardProductoEdicion);
			});
		}

		$scope.verProducto = function (producto) {
			$scope.producto = producto;

			$scope.abrirPopup($scope.idModalWizardProductoVista);
		}

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup($scope.idModalWizardProductoVista);
		}

		$scope.cerrarPopPupEdicion = function () {
			$scope.cerrarPopup($scope.idModalWizardProductoEdicion);
		}
		$scope.cerrarPopPupKardex = function () {
			$scope.cerrarPopup($scope.idModalWizardProductoKardex);
			$scope.search.inventario.lote = "";
		}
		$scope.abrirModalReporteProductosKardex = function () {
			$scope.imp = {}
			$scope.abrirPopup($scope.idModalReporteProductosKardex);
		}

		$scope.cerrarModalReporteProductosKardex = function () {
			$scope.imp = {}
			$scope.cerrarPopup($scope.idModalReporteProductosKardex);
		}

		$scope.kardexProducto = function (producto) {

			$scope.producto = producto;
			$scope.kardexproduto = null;
			$scope.filtro = {};
			$scope.imp = {};
			$scope.imp.sucursal = $scope.sucursales.length == 1 ? $scope.sucursales[0] : null;
			if ($scope.imp.sucursal) {
				$scope.obtenerAlmacenes($scope.imp.sucursal.id);
				$scope.imp.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : null;
			}
			$scope.abrirPopup($scope.idModalWizardProductoKardex);

		}

		$scope.buscarKardexProducto = function (idProducto, almacen, filtro) {
			blockUI.start();
			var fechaInicio = filtro.fechaInicioTexto == "" || filtro.fechaInicioTexto == undefined ? 0 : new Date($scope.convertirFecha(filtro.fechaInicioTexto));
			var fechaFin = filtro.fechaFinTexto == "" || filtro.fechaFinTexto == undefined ? 0 : new Date($scope.convertirFecha(filtro.fechaFinTexto));
			var lote = filtro.lote == "" || filtro.lote == undefined ? 0 : filtro.lote;
			$scope.idProducto = idProducto;
			$scope.idAlmacen = almacen.id;
			$scope.kardexproduto = null;

			if (fechaInicio != 0) {
				var promesa = ProductoKardex(idProducto, almacen.id, 0, fechaInicio, lote);
				promesa.then(function (detMovsSaldo) {
					var detalleMovimientoSaldoAnterior = $scope.obtenerSaldo(detMovsSaldo);
					promesa = ProductoKardex($scope.idProducto, $scope.idAlmacen, fechaInicio, fechaFin, lote);
					promesa.then(function (detMovs) {
						if (detalleMovimientoSaldoAnterior != 0) {
							detMovs.unshift(detalleMovimientoSaldoAnterior);
						}
						$scope.generarKardexProducto(detMovs);
						blockUI.stop();
					});
				})
			} else {
				var promesa = ProductoKardex($scope.idProducto, $scope.idAlmacen, fechaInicio, fechaFin, lote);
				promesa.then(function (detMovs) {
					$scope.generarKardexProducto(detMovs);
					blockUI.stop();
				})
			}
		}

		$scope.generarKardexProducto = function (detMovs) {
			var dato = $scope.producto;
			dato.detallesMovimiento = detMovs;
			$scope.Math = Math;
			for (var i = 0; i < dato.detallesMovimiento.length; i++) {
				if (dato.detallesMovimiento[i].movimiento) {
					dato.detallesMovimiento[i].costo_unitario = Math.round((dato.detallesMovimiento[i].costo_unitario * 0.87) * 100) / 100;
					if (i == 0 && dato.detallesMovimiento[i].tipo == "SALDO ANTERIOR") {
						dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].saldoFisico;
						dato.detallesMovimiento[i].saldoValuado = dato.detallesMovimiento[i].saldoValuado;
						dato.detallesMovimiento[i].costo_unitario = Math.round((dato.detallesMovimiento[i].costo_unitario * 100 / 87) * 100) / 100;
					} else if (i == 0 && dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING && dato.detallesMovimiento[i].movimiento.clase.nombre_corto == $scope.diccionario.ING_INV_INICIAL) {
						dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
						dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i].saldoFisico * dato.detallesMovimiento[i].costo_unitario) * 100) / 100;
						if (dato.detallesMovimiento[i].movimiento.compra != null) {
							dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre + " Nro. " + dato.detallesMovimiento[i].movimiento.compra.factura;
						} else {
							dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
						}
					} else if (i == 0 && dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING) {
						dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
						dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i].saldoFisico * dato.detallesMovimiento[i].costo_unitario) * 100) / 100;
						if (dato.detallesMovimiento[i].movimiento.compra != null) {
							dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre + " Nro. " + dato.detallesMovimiento[i].movimiento.compra.factura;
						} else {
							dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
						}
					}
					else {
						if (dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING) {
							if (i > 0) {
								dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico + dato.detallesMovimiento[i].cantidad;
								dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado + (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
								dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre
							} else {
								dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
								dato.detallesMovimiento[i].saldoValuado = Math.round(((dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
								dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre
							}
						} else {
							if (dato.detallesMovimiento[i].movimiento.venta) {
								//dato.detallesMovimiento[i].costo_unitario=dato.detallesMovimiento[i].costo_unitario*0.87;
								if (i > 0) {
									dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico - dato.detallesMovimiento[i].cantidad;
									dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado - (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
									dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre + " Nro. " + dato.detallesMovimiento[i].movimiento.venta.factura;
								} else {
									dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
									dato.detallesMovimiento[i].saldoValuado = Math.round(((dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
									dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre + " Nro. " + dato.detallesMovimiento[i].movimiento.venta.factura;
								}
							} else {
								if (i > 0) {
									dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico - dato.detallesMovimiento[i].cantidad;
									dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado - (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
									dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre
								} else {
									dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
									dato.detallesMovimiento[i].saldoValuado = Math.round(((dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
									dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre
								}
							}
						}

					}
			
				dato.detallesMovimiento[i].saldoV = dato.detallesMovimiento[i].saldoValuado.toFixed(2);
					} else {
					console.log(dato.detallesMovimiento[i])
				}
			}
			$scope.kardexproduto = dato;
		}
		$scope.verificarLote = function (filtro, alma) {
			if (filtro.lote == "") {
				$scope.buscarKardexProducto($scope.producto.id, alma, filtro)
			}
		}
		$scope.obtenerSaldo = function (detMovs) {
			var dato = {};
			dato.detallesMovimiento = detMovs;
			for (var i = 0; i < dato.detallesMovimiento.length; i++) {
				dato.detallesMovimiento[i].costo_unitario = Math.round((dato.detallesMovimiento[i].costo_unitario * 0.87) * 100) / 100;
				if (i == 0 && dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING && dato.detallesMovimiento[i].movimiento.clase.nombre_corto == $scope.diccionario.ING_INV_INICIAL) {
					dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
					dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i].saldoFisico * dato.detallesMovimiento[i].costo_unitario) * 100) / 100;
					dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
				} else if (i == 0 && dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING) {
					dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
					dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i].saldoFisico * dato.detallesMovimiento[i].costo_unitario) * 100) / 100;
					dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
				}
				else {
					if (dato.detallesMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING) {
						if (i > 0) {
							dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico + dato.detallesMovimiento[i].cantidad;
							dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado + (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
							dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
						} else {
							dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
							dato.detallesMovimiento[i].saldoValuado = Math.round(((dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
							dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
						}
					} else {
						if (dato.detallesMovimiento[i].movimiento.venta) {
							//dato.detallesMovimiento[i].costo_unitario=dato.detallesMovimiento[i].costo_unitario*0.87;
							if (i > 0) {
								dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico - dato.detallesMovimiento[i].cantidad;
								dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado - (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
								dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre + " Nro. " + dato.detallesMovimiento[i].movimiento.venta.factura;
							} else {
								dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
								dato.detallesMovimiento[i].saldoValuado = Math.round(((dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
								dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre + " Nro. " + dato.detallesMovimiento[i].movimiento.venta.factura;
							}
						} else {
							if (i > 0) {
								dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i - 1].saldoFisico - dato.detallesMovimiento[i].cantidad;
								dato.detallesMovimiento[i].saldoValuado = Math.round((dato.detallesMovimiento[i - 1].saldoValuado - (dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
								dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
							} else {
								dato.detallesMovimiento[i].saldoFisico = dato.detallesMovimiento[i].cantidad;
								dato.detallesMovimiento[i].saldoValuado = Math.round(((dato.detallesMovimiento[i].cantidad * dato.detallesMovimiento[i].costo_unitario)) * 100) / 100;
								dato.detallesMovimiento[i].tipo = dato.detallesMovimiento[i].movimiento.clase.nombre;
							}
						}
					}

				}
				dato.detallesMovimiento[i].saldoV = dato.detallesMovimiento[i].saldoValuado.toFixed(2);
			}

			if (dato.detallesMovimiento.length > 0) {
				dato.detallesMovimiento[dato.detallesMovimiento.length - 1].tipo = "SALDO ANTERIOR";
				dato.detallesMovimiento[dato.detallesMovimiento.length - 1].movimiento.compra = null;
				dato.detallesMovimiento[dato.detallesMovimiento.length - 1].movimiento.venta = null;
				return dato.detallesMovimiento[dato.detallesMovimiento.length - 1];
			} else {
				return 0;
			}
		}

		$scope.generarPdfKardexProducto = function (kardexproduto, tipo) {
			blockUI.start();
			var detalleMovimiento = kardexproduto.detallesMovimiento;


			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var saldoFisico = 0;
			var saldoValuado = 0;

			var y = 200, itemsPorPagina = 17, items = 0, pagina = 1, totalPaginas = Math.ceil(detalleMovimiento.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFKardexProducto(doc, 1, totalPaginas, kardexproduto, tipo);
			for (var i = 0; i < detalleMovimiento.length && items <= itemsPorPagina; i++) {

				doc.rect(30, y - 10, 555, 30).stroke();
				detalleMovimiento[i].movimiento.fecha = new Date(detalleMovimiento[i].movimiento.fecha);
				doc.text(detalleMovimiento[i].movimiento.fecha.getDate() + "/" + (detalleMovimiento[i].movimiento.fecha.getMonth() + 1) + "/" + detalleMovimiento[i].movimiento.fecha.getFullYear(), 40, y - 2);
				if (i == 0) {
					doc.text(detalleMovimiento[i].tipo, 90, y - 2);
					doc.text(detalleMovimiento[i].costo_unitario, 210, y - 2, { width: 50, align: "right" });
					doc.text(detalleMovimiento[i].cantidad, 265, y - 2, { width: 50, align: "right" });
					saldoFisico = saldoFisico + detalleMovimiento[i].cantidad;
					doc.text(detalleMovimiento[i].saldoFisico, 360, y - 2, { width: 50, align: "right" });
					if (tipo) {
						doc.text(Math.round((detalleMovimiento[i].cantidad * detalleMovimiento[i].costo_unitario) * 100) / 100, 420, y - 2, { width: 50, align: "right" });
						dsaldoValuado = saldoValuado + saldoFisico * detalleMovimiento[i].costo_unitario;
						doc.text(detalleMovimiento[i].saldoV, 510, y - 2, { width: 50, align: "right" });
					}
				}
				else {
					doc.text(detalleMovimiento[i].tipo, 90, y - 6);
					if (detalleMovimiento[i].movimiento.tipo.nombre_corto == $scope.diccionario.MOV_ING) {
						if (detalleMovimiento[i].movimiento.compra) {
							doc.text(detalleMovimiento[i].movimiento.compra.proveedor.razon_social, 90, y + 2, { width: 150 })
						}
						doc.text(detalleMovimiento[i].costo_unitario, 210, y - 2, { width: 50, align: "right" });
						doc.text(detalleMovimiento[i].cantidad, 265, y - 2, { width: 50, align: "right" });
						saldoFisico = saldoFisico + detalleMovimiento[i].cantidad;
						doc.text(detalleMovimiento[i].saldoFisico, 360, y - 2, { width: 50, align: "right" });
						if (tipo) {
							doc.text(Math.round((detalleMovimiento[i].cantidad * detalleMovimiento[i].costo_unitario) * 100) / 100, 420, y - 2, { width: 50, align: "right" });
							saldoValuado = saldoValuado + saldoFisico * detalleMovimiento[i].costo_unitario;
							doc.text(detalleMovimiento[i].saldoV, 510, y - 2, { width: 50, align: "right" });
						}
					} else {
						if (detalleMovimiento[i].movimiento.venta.cliente) {
							doc.text(detalleMovimiento[i].movimiento.venta.cliente.razon_social, 90, y + 2, { width: 150 })
						}
						doc.text(detalleMovimiento[i].costo_unitario, 210, y - 2, { width: 50, align: "right" });
						doc.text(detalleMovimiento[i].cantidad, 310, y - 2, { width: 50, align: "right" });
						saldoFisico = saldoFisico - detalleMovimiento[i].cantidad;
						doc.text(detalleMovimiento[i].saldoFisico, 360, y - 2, { width: 50, align: "right" });
						if (tipo) {
							doc.text(detalleMovimiento[i].total, 460, y - 2, { width: 50, align: "right" });
							saldoValuado = Math.round((saldoValuado + saldoFisico * detalleMovimiento[i].costo_unitario) * 100) / 100;

							doc.text(detalleMovimiento[i].saldoV, 510, y - 2, { width: 50, align: "right" });
						}
					}

				}

				y = y + 30;
				items++;

				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 200;
					items = 0;
					pagina = pagina + 1;

					$scope.dibujarCabeceraPDFKardexProducto(doc, pagina, totalPaginas, kardexproduto, tipo);

					doc.font('Helvetica', 8);
				}
			}
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}
		$scope.usarValuadoKardex = function () {
			$scope.usarValuado = ($scope.usarValuado) ? false : true
		}
		$scope.dibujarCabeceraPDFKardexProducto = function (doc, pagina, totalPaginas, kardexproduto, tipo) {

			doc.font('Helvetica-Bold', 8);
			doc.text($scope.usuario.empresa.razon_social, 30, 15);
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			if (tipo == true) {
				doc.font('Helvetica-Bold', 10);
				doc.text(kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.nombre, 30, 25, { align: "left" });
				doc.text("KARDEX PRODUCTO", 0, 65, { align: "center" });
				doc.font('Helvetica', 10);
				doc.text(kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.direccion, 30, 35, { align: "left" });
				doc.text("TELF.: " + kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.telefono1 + "-" + kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.telefono2 + "-" + kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.telefono3, 30, 45, { align: "left" });
				doc.font('Helvetica-Bold', 8);
				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
				doc.rect(30, 90, 555, 70).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text("Producto : ", 45, 100);
				doc.text("Descripcion : ", 45, 120);
				doc.text("Unidad de Medida : ", 45, 140);
				doc.font('Helvetica', 7);
				doc.text("Sucursal : " + kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.nombre, 475, 100);
				doc.text("Almacen : " + kardexproduto.detallesMovimiento[0].movimiento.almacen.nombre, 475, 110);
				doc.font('Helvetica-Bold', 12);
				doc.text("Codigo : " + kardexproduto.codigo, 475, 120);				
				doc.font('Helvetica-Bold', 10);
				doc.text(kardexproduto.nombre, 120, 100);
				doc.text(kardexproduto.descripcion, 120, 120);
				doc.text(kardexproduto.unidad_medida, 120, 140);
				doc.rect(30, 160, 555, 30).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text("Fecha", 45, 170);
				doc.text("Detalle", 100, 170, { width: 50 });
				doc.text("c/u", 250, 170, { width: 60 });
				doc.rect(275, 160, 150, 30).stroke();
				doc.text("Fisico", 340, 165, { width: 50 });
				doc.text("Valuado", 485, 165, { width: 50 });
				doc.rect(275, 160, 150, 15).stroke();
				doc.text("Ingreso", 290, 180, { width: 50 });
				doc.text("Salida", 340, 180, { width: 50 });
				doc.text("Saldo", 390, 180, { width: 50 });
				doc.rect(425, 160, 160, 15).stroke();
				doc.text("Ingreso", 440, 180, { width: 50 });
				doc.text("salida", 490, 180, { width: 50 });
				doc.text("Saldo", 540, 180, { width: 50 });

			} else {
				doc.font('Helvetica-Bold', 10);
				doc.text(kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.nombre, 30, 25, { align: "left" });
				doc.text("KARDEX PRODUCTO", 0, 65, { align: "center" });
				doc.font('Helvetica', 10);
				doc.text(kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.direccion, 30, 35, { align: "left" });
				doc.text("TELF.: " + kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.telefono1 + "-" + kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.telefono2 + "-" + kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.telefono3, 30, 45, { align: "left" });
				doc.font('Helvetica-Bold', 8);
				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
				doc.rect(30, 90, 555, 70).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text("Producto : ", 45, 100);
				doc.text("Descripcion : ", 45, 120);
				doc.text("Unidad de Medida : ", 45, 140);
				doc.font('Helvetica', 7);
				doc.text("Sucursal : " + kardexproduto.detallesMovimiento[0].movimiento.almacen.sucursal.nombre, 475, 100);
				doc.text("Almacen : " + kardexproduto.detallesMovimiento[0].movimiento.almacen.nombre, 475, 110);
				doc.text(kardexproduto.nombre, 120, 100);
				doc.text(kardexproduto.descripcion, 120, 120);
				doc.text(kardexproduto.unidad_medida, 120, 140);
				doc.rect(30, 160, 555, 30).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text("Fecha", 45, 170);
				doc.text("Detalle", 100, 170, { width: 50 });
				doc.text("c/u", 250, 170, { width: 60 });
				doc.rect(275, 160, 150, 30).stroke();
				doc.text("Fisico", 340, 165, { width: 50 });

				doc.rect(275, 160, 150, 15).stroke();
				doc.text("Ingreso", 290, 180, { width: 50 });
				doc.text("Salida", 340, 180, { width: 50 });
				doc.text("Saldo", 390, 180, { width: 50 });

			}
			doc.font('Helvetica', 7);
			doc.text("usuario : " + $scope.usuario.nombre_usuario, 475, 740);
			doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 475, 750);
		}

		$scope.modificarProducto = function (producto) {
			$scope.steps = [{ cabeza: "cabeza-datos-producto", cuerpo: "cuerpo-datos-producto" },
			{ cabeza: "cabeza-datos-adicionales", cuerpo: "cuerpo-datos-adicionales" },
			{ cabeza: "cabeza-tipo-producto", cuerpo: "cuerpo-tipo-producto" }]
			var promesa = DatosProducto(producto.id);
			promesa.then(function (datosProducto) {
				$scope.producto = datosProducto;
				$scope.producto.publicar_panel = $scope.producto.publicar_panel == 1 ? true : false;
				$scope.producto.activar_inventario = $scope.producto.activar_inventario == 1 ? true : false;

				$scope.producto.totalBase = 0;
				for (var i = 0; i < $scope.producto.productosBase.length; i++) {
					$scope.producto.totalBase = $scope.producto.totalBase + ($scope.producto.productosBase[i].productoBase.precio_unitario * $scope.producto.productosBase[i].formulacion);


				}
				$scope.productoBaseSeleccion = {};

				if ($scope.producto.almacenErp) {
					$scope.producto.sucursal_erp = $scope.producto.almacenErp.sucursal;
					$scope.obtenerAlmacenes($scope.producto.sucursal_erp.id);
				}
				$scope.abrirPopup($scope.idModalWizardProductoEdicion);
			});
		}

		$scope.mostrarConfirmacionEliminacion = function (producto) {
			$scope.producto = new Producto(producto);
			$scope.abrirPopup($scope.idModalEliminarProducto);
			console.log(producto)
		}

		$scope.cerrarConfirmacionEliminacion = function () {
			$scope.cerrarPopup($scope.idModalEliminarProducto);
		};

		$scope.eliminarProducto = function (producto) {

			blockUI.start();
			$scope.cerrarConfirmacionEliminacion();
			producto.$delete().then(function (dato) {
				console.log(dato)
				$scope.mostrarMensaje(dato.message);
			})

			$scope.recargarItemsTabla();
			blockUI.stop();
		}
		$scope.obtenerSucursales = function () {
			var sucursales = [];
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			}
			$scope.sucursales = sucursales;
		}
		$scope.obtenerAlmacenes = function (idSucursal) {
			$scope.almacenes = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
			$scope.almacenes = sucursal.almacenes;
		}

		$scope.establecerAlmacen = function (id_almacen) {
			$scope.id_almacen = id_almacen;
		}

		$scope.saveForm = function (valido, producto) {
			if (valido) {
				var button = $('#siguiente').text().trim();
				if (button != "Siguiente") {
					$scope.guardarProducto(producto, true);
				}
			}
		}

		$scope.establecerProductoBase = function (productoConsultado) {
			$scope.productoBase = { id: productoConsultado.id, nombre: productoConsultado.nombre, formulacion: 0, unidad_medida: productoConsultado.unidad_medida };
		}

		$scope.actualizarProducto = function (producto) {
			var promesa = DatosProducto(producto.id);
			promesa.then(function (datosProducto) {
				datosProducto.publicar_panel = producto.publicar_panel;
				datosProducto.activar_inventario = producto.activar_inventario;
				$scope.guardarProducto(datosProducto, false);
			});
		}

		$scope.guardarProducto = function (producto, recargarItemsTabla) {
			blockUI.start();
			var imagenProducto = producto.imagen;
			producto.usuario = $scope.usuario.id
			if (producto.id) {
				Producto.update({ idProducto: producto.id }, producto, function (res) {
					if (res.signedRequest == null) {
						blockUI.stop();
						$scope.cerrarPopPupEdicion();
						$scope.mostrarMensaje('Actualizado Exitosamente!');
						if (recargarItemsTabla) {
							$scope.recargarItemsTabla();
						}
					} else {
						var xhr = new XMLHttpRequest();
						xhr.open('PUT', res.signedRequest);
						xhr.onreadystatechange = () => {
							if (xhr.readyState === 4) {
								if (xhr.status === 200) {
									blockUI.stop();
									$scope.cerrarPopPupEdicion();
									$scope.mostrarMensaje('Actualizado Exitosamente!');
									if (recargarItemsTabla) {
										$scope.recargarItemsTabla();
									}
								}
								else {
									alert('Could not upload file.');
								}
							}
						};

						var binary = atob(imagenProducto.split(',')[1]);
						var data = [];
						for (var i = 0; i < binary.length; i++) {
							data.push(binary.charCodeAt(i));
						}
						var blob = new Blob([new Uint8Array(data)], { type: 'image/jpeg' });
						var file = new File([blob], res.image_name, { type: "image/jpeg" });
						console.log(file);
						xhr.send(file);
					}
				});
			} else {
				producto.$save(function (res) {
					if (res.signedRequest == null) {
						blockUI.stop();
						$scope.producto = new Producto({});
						$scope.cerrarPopPupEdicion();
						$scope.mostrarMensaje('Guardado Exitosamente!');
						if (recargarItemsTabla) {
							$scope.recargarItemsTabla();
						}
					} else {
						var xhr = new XMLHttpRequest();
						xhr.open('PUT', res.signedRequest);
						xhr.onreadystatechange = () => {
							if (xhr.readyState === 4) {
								if (xhr.status === 200) {
									blockUI.stop();
									$scope.producto = new Producto({});
									$scope.cerrarPopPupEdicion();
									$scope.mostrarMensaje('Guardado Exitosamente!');
									if (recargarItemsTabla) {
										$scope.recargarItemsTabla();
									}
								}
								else {
									alert('Could not upload file.');
								}
							}
						};

						var binary = atob(imagenProducto.split(',')[1]);
						var data = [];
						for (var i = 0; i < binary.length; i++) {
							data.push(binary.charCodeAt(i));
						}
						var blob = new Blob([new Uint8Array(data)], { type: 'image/jpeg' });
						var file = new File([blob], res.image_name, { type: "image/jpeg" });
						xhr.send(file);
					}
				}, function (error) {
					blockUI.stop();
					$scope.cerrarPopPupEdicion();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					if (recargarItemsTabla) {
						$scope.recargarItemsTabla();
					}
				});
			}
		}


		$scope.obtenerTipoProducto = function () {
			blockUI.start();
			var promesa = ClasesTipo("TPS");
			promesa.then(function (entidad) {
				$scope.tipoProductos = entidad.clases;
				blockUI.stop();
			});
		}
		$scope.eliminarDetalleProductosBase = function (producto) {

			producto.eliminado = true;
			$scope.producto.totalBase = $scope.producto.totalBase - producto.productoBase.precio_unitario * producto.formulacion;

		}
		$scope.agregarDetalleProductosBase = function (producto, datos) {

			datos.formulacion = producto.formulacion;
			console.log(datos);

			/*if(tipoProductos.nombre_corto==$scope.diccionario.id_tipo_Producto_inter){
				if(producto.nombre_corto==$scope.diccionario.id_tipo_Producto_base){*/
			$scope.producto.productosBase.push({ productoBase: datos, formulacion: producto.formulacion });
			$scope.productoBase = {};
			$scope.productoBaseSeleccion = {};
			$scope.producto.totalBase = 0;
			for (var i = 0; i < $scope.producto.productosBase.length; i++) {
				$scope.producto.totalBase = $scope.producto.totalBase + ($scope.producto.productosBase[i].productoBase.precio_unitario * $scope.producto.productosBase[i].formulacion);
				console.log($scope.producto.totalBase);

			}
			console.log($scope.producto.productosBase)
			/*if(tipoProductos.nombre_corto==$scope.diccionario.id_tipo_Producto_final){
				if(producto.id_tipo_Producto!=$scope.diccionario.id_tipo_Producto_final){		
					$scope.producto.productosBase.push({productoBase:producto});			
					$scope.productoBase="";
				}
			}	*/
		}
		$scope.obtenerProductos = function () {
			$scope.paginator = Paginator();
			$scope.paginator.column = "nombre";
			$scope.paginator.filter = $scope.grupo
			$scope.paginator.callBack = $scope.buscarProductos;
			$scope.paginator.getSearch("", null, null);
		}

		$scope.buscarProducto = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ListaProductosEmpresa($scope.usuario.id_empresa, query);
				return promesa;
			}

		}

		$scope.buscarProductos = function () {
			blockUI.start();
			$scope.paginator.filter = $scope.grupo !== undefined ? $scope.grupo : { id: 0 }
			var promesa = ProductosPaginador($scope.usuario.id_empresa, $scope.paginator, $scope.usuario.id);
			promesa.then(function (dato) {
				if (dato.hasErr) {
					$scope.mostrarMensaje(dato.mensaje)
				} else {
					$scope.paginator.setPages(dato.paginas);
					$scope.productos = dato.productos;
					for (var i = 0; i < $scope.productos.length; i++) {
						$scope.productos[i].publicar_panel = $scope.productos[i].publicar_panel == 1 ? true : false;
						$scope.productos[i].activar_inventario = $scope.productos[i].activar_inventario == 1 ? true : false;
					}
				}
				blockUI.stop();
			}).catch(function (err) {
				var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor."
				$scope.mostrarMensaje(memo)
				blockUI.stop();
			})
		}

		$scope.descargarCatalogo = function (pdf) {
			blockUI.start()
			if (pdf) {
				var cabecera = ["N°", "Campo", "Empleado", "C.I.", "Estado", "Cargo"]
				var report = []
			} else {
				var cabecera = [
					"Código",
					"Nombre",
					"Unidad Medida",
					"Precio Unitario",
					"Descripcion",
					"Inventario Mínimo",
					"Grupo",
					"Sub-grupo",
					"Caracteristica Especial-1",
					"Caracteristica Especial-2",
					"Código de Fabrica",
					"Comisión (%)",
					"Alerta",
					"Descuento",
					"Descuento Elección"]
				var wscols = [
					{ wch: 10 },
					{ wch: 20 },
					{ wch: 15 },
					{ wch: 15 },
					{ wch: 25 },
					{ wch: 15 },
					{ wch: 7 },
					{ wch: 9 },
					{ wch: 20 },
					{ wch: 20 },
					{ wch: 15 },
					{ wch: 10 },
					{ wch: 8 },
					{ wch: 10 },
					{ wch: 15 }
				];
				var report = []
			}
			var data = []
			var catalogo = CatalogoProductos($scope.usuario.id_empresa, $scope.grupo !== undefined ? $scope.grupo : { id: 0 }, $scope.usuario.id)
			catalogo.then(function (res) {
				if (res.catalogo.length == 0) {
					$scope.mostrarMensaje('No existen datos')
					blockUI.stop()
					return
				}
				if (res.hasErr) {
					$scope.mostrarMensaje(res.mensaje)
					return
				}
				for (var i = 0; i < res.catalogo.length; i++) {
					if (pdf) {
						var columns = [];
					} else {
						var columns = [];
					}
					// columns.push(i + 1);
					columns.push(res.catalogo[i].codigo);
					columns.push(res.catalogo[i].nombre);
					columns.push(res.catalogo[i].unidad_medida);
					columns.push(res.catalogo[i].precio_unitario);
					columns.push(res.catalogo[i].descripcion);
					columns.push(res.catalogo[i].inventario_minimo);
					columns.push((res.catalogo[i].grupo !== null && res.catalogo[i].grupo !== undefined ? res.catalogo[i].grupo.nombre : "Sin grupo"));
					columns.push((res.catalogo[i].subgrupo !== null && res.catalogo[i].subgrupo !== undefined ? res.catalogo[i].subgrupo.nombre : "Sin subgrupo"));
					columns.push(res.catalogo[i].caracteristica_especial1);
					columns.push(res.catalogo[i].caracteristica_especial2);
					columns.push(res.catalogo[i].codigo_fabrica);
					columns.push(res.catalogo[i].comision);
					columns.push(res.catalogo[i].alerta);
					columns.push(res.catalogo[i].descuento);
					columns.push(res.catalogo[i].descuento_fijo);
					data.push(columns);
				}
				report.push(cabecera)
				data.map(function (row) {
					report.push(row)
				})
				if (pdf) {
					if (grafico) {
						// blockUI.stop();
						$scope.reportePorMesGrafico(report, mesesReporte)
					} else {
						blockUI.stop();
						$scope.reportePorMesesPdf(report, fromMonth, fromYear, untilMonth, untilYear)
					}
				} else {
					var ws_name = "SheetJS";
					var wb = new Workbook(), ws = sheet_from_array_of_arrays(report);
					ws['!cols'] = wscols;
					/* add worksheet to workbook */
					wb.SheetNames.push(ws_name);
					wb.Sheets[ws_name] = ws;
					var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true });
					saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "Catálogo productos.xlsx");
					blockUI.stop();
				}

			}).catch(function (err) {
				var men = (err.data !== undefined && err.data !== null) ? err.data + (err.stack !== undefined && err.stack !== null ? " " + err.stack : "") : err.message !== undefined && err.message !== null ? err.message : "ERROR"
				$scope.mostrarMensaje('Se produjo un error! ' + men)
				blockUI.stop();
			})
		}

		$scope.subirExcelProductos = function (event) {
			var files = event.target.files;
			var i, f;
			for (i = 0, f = files[i]; i != files.length; ++i) {
				var reader = new FileReader();
				var name = f.name;
				reader.onload = function (e) {
					blockUI.start();
					var data = e.target.result;

					var workbook = XLSX.read(data, { type: 'binary' });
					var first_sheet_name = workbook.SheetNames[0];
					var row = 2, i = 0;
					var worksheet = workbook.Sheets[first_sheet_name];
					var productos = [];
					do {
						var producto = {};
						producto.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
						producto.nombre = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
						producto.unidad_medida = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
						producto.precio_unitario = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? parseFloat(worksheet['D' + row].v.toString()) : null;
						producto.descripcion = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
						producto.inventario_minimo = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? parseInt(worksheet['F' + row].v.toString()) : null;
						producto.grupo = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
						producto.subgrupo = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? worksheet['H' + row].v.toString() : null;
						producto.caracteristica_especial1 = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? worksheet['I' + row].v.toString() : null;
						producto.caracteristica_especial2 = worksheet['J' + row] != undefined && worksheet['J' + row] != "" ? worksheet['J' + row].v.toString() : null;
						producto.codigo_fabrica = worksheet['K' + row] != undefined && worksheet['K' + row] != "" ? worksheet['K' + row].v.toString() : null;
						producto.comision = worksheet['L' + row] != undefined && worksheet['L' + row] != "" ? parseFloat(worksheet['L' + row].v.toString()) : null;
						producto.alerta = worksheet['M' + row] != undefined && worksheet['M' + row] != "" ? parseFloat(worksheet['M' + row].v.toString()) : null;
						producto.descuento = worksheet['N' + row] != undefined && worksheet['N' + row] != "" ? parseFloat(worksheet['N' + row].v.toString()) : null;
						producto.descuento_fijo = worksheet['O' + row] != undefined && worksheet['N' + row] != "" ? (parseInt(worksheet['O' + row].v.toString()) == 1 ? true : false) : null;
						producto.marca = worksheet['P' + row] != undefined && worksheet['P' + row] != "" ? worksheet['P' + row].v.toString() : null;
						productos.push(producto);
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
					$scope.guardarProductos(productos);
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
		}

		$scope.guardarProductos = function (productos) {
			var productosEmpresa = new ProductosEmpresaCreacion({ productos: productos, id_empresa: $scope.usuario.id_empresa });
			productosEmpresa.$save(function (producto) {
				blockUI.stop();
				$scope.mostrarMensaje('Guardado Exitosamente!');
				$scope.recargarItemsTabla();
			}, function (error) {
				blockUI.stop();
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				$scope.recargarItemsTabla();
			});
		}

		$scope.buscarCuenta = function (buscarCuentaQuery) {
			if (buscarCuentaQuery != "" && buscarCuentaQuery != undefined) {
				var promesa = ListaCuentasComprobanteContabilidad($scope.usuario.id_empresa, buscarCuentaQuery);
				return promesa;
			}
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardProductoEdicion);
			$scope.eliminarPopup($scope.idModalWizardProductoVista);
			$scope.eliminarPopup($scope.idModalEliminarProducto);
			$scope.eliminarPopup($scope.idModalWizardProductoKardex);
			$scope.eliminarPopup($scope.idModalReporteProductosKardex);
		});

		$scope.inicio();
	});



