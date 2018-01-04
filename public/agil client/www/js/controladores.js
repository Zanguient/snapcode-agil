angular.module('agil.controladores', ['agil.servicios', 'blockUI'])

	.controller('ControladorPrincipal', function ($scope, $rootScope, $route, $templateCache, $location, $window, $localStorage, Sesion,
		blockUI, UsuarioSucursalesAutenticacion, VencimientosProductosEmpresa, VencimientosCreditosEmpresa,
		VencimientosDeudasEmpresa, VentaEmpresaDatos, ClienteVencimientoCredito, socket, $http, Tipos,
		ProveedorVencimientoCredito, Venta, ClasesTipo, Compra, Producto, DatosVenta, DatosCompra,
		ImprimirSalida, Diccionario, VentasComprobantesEmpresa, ComprasComprobantesEmpresa, LibroMayorCuenta, Paginator, ComprobanteRevisarPaginador, AsignarComprobanteFavorito, ListaCuentasComprobanteContabilidad, NuevoComprobanteContabilidad, NuevoComprobante, ComprasComprobante,
		ConfiguracionesCuentasEmpresa, ContabilidadCambioMoneda, ObtenerCambioMoneda, AsignarCuentaCiente, AsignarCuentaProveedor) {

		$scope.idModalTablaVencimientoProductos = "tabla-vencimiento-productos";
		$scope.idModalTablaDespachos = "tabla-gtm-despachos";
		$scope.idModalTablaVencimientoCreditos = "tabla-vencimiento-creditos";
		$scope.idModalTablaVencimientoDeudas = "tabla-vencimiento-deudas";
		$scope.idModalTablaVentasPendientes = "tabla-ventas-pendientes";
		$scope.idModalTablaComprasPendientes = "tabla-compras-pendientes";
		$scope.idModalTablaBancosPendientes = "tabla-bancos-pendientes";
		$scope.idModalTablaOtrosPendientes = "tabla-otros-pendientes";
		$scope.idModalPagoP = 'dialog-pago-credito';
		$scope.idModalPagoDeuda = 'dialog-pago-deuda';
		$scope.idmodalActualizarCreditoCliente = "dialog-actualizar-credito";
		$scope.idmodalActualizarCreditoDeuda = "dialog-actualizar-deudas";
		$scope.idModalDescuento = "dialog-edicion-descuento";
		$scope.idModalInicioSesion = "popup-inicio-sesion";
		$scope.idModalConceptoEdicion = 'dialog-conceptos';
		//nuevo comprobante
		$scope.idModalWizardComprobanteEdicion = 'modal-wizard-comprobante-edicion';
		$scope.idPopupQr = 'modal-wizard-comprobante-edicions';
		$scope.IdModalOpcionesQr = 'modal-opciones-qr';
		$scope.IdModalRegistrarComprobante = 'modal-registrar';
		$scope.IdModalRevisarComprobante = 'modal-revisar';
		$scope.IdModalLibroMayor = 'modal-libro-contable';
		$scope.IdModalAsignarCuenta = 'dialog-asignar-cuenta';
		//fin nuevo comprobante
		$scope.diccionario = Diccionario;

		$scope.$on('$viewContentLoaded', function () {
			ejecutarScriptsInicio($scope.idModalTablaVencimientoProductos, $scope.idModalTablaVencimientoCreditos, $scope.idModalTablaVencimientoDeudas, $scope.idModalPagoP,
				$scope.idmodalActualizarCreditoCliente, $scope.idmodalActualizarCreditoDeuda, $scope.idModalPagoDeuda, $scope.idModalDescuento, $scope.idModalTablaVentasPendientes,
				$scope.idModalTablaComprasPendientes, $scope.idModalTablaBancosPendientes, $scope.idModalTablaOtrosPendientes, $scope.idModalInicioSesion,
				$scope.idModalWizardComprobanteEdicion, $scope.IdModalOpcionesQr, $scope.IdModalRegistrarComprobante, $scope.IdModalRevisarComprobante, $scope.IdModalLibroMayor, $scope.IdModalAsignarCuenta,
				$scope.idModalTablaDespachos);

			$scope.inicio();
			blockUI.stop();
		});
		//modal comprobante nuevo
		$scope.$on('$routeChangeStart', function (next, current) {
			/* $scope.eliminarPopup($scope.idPopupQr);
			 $scope.eliminarPopup($scope.IdModalRegistrarComprobante);
			 $scope.eliminarPopup($scope.IdModalRevisarComprobante);
			 $scope.eliminarPopup($scope.idModalWizardComprobanteEdicion);
			 $scope.eliminarPopup($scope.IdModalLibroMayor);
			 $scope.eliminarPopup($scope.IdModalOpcionesQr);
			 $scope.eliminarPopup($scope.IdModalAsignarCuenta); */
		});
		$scope.obtenerSucursales = function () {
			var sucursales = [];
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			}
			return sucursales;
		}

		//modal nuevo comprobante

		$scope.AgregarComprobante = function (form, nuevoComprobante) {
			if (!nuevoComprobante.fecha) {
				form.fecha.$error.required = true
			} else {
				form.fecha.$error.required = false
			}
			if (!nuevoComprobante.gloza) {
				form.gloza.$error.required = true
			} else {
				form.gloza.$error.required = false
			}
			if (nuevoComprobante.asientosContables.length <= 0) {
				form.asientos.$error.detalleAsiento = true
			} else {
				form.asientos.$error.detalleAsiento = false
			}
			if (!form.asientos.$error.detalleAsiento && !form.gloza.$error.required && !form.fecha.$error.required) {

				NuevoComprobante($scope.mostrarMensaje, null, null, $scope.usuario, null, null, null, $scope.convertirFecha, $scope.cerrarNuevoComprobante, $scope.nuevoComprobante, null, $scope.verificarVentasComprobantes, $scope.verificarComprasComprobantes, $scope.recargarItemsTabla)
			}

		}
		$scope.obtenerCambioMoneda = function (fechaCambio) {
			var fecha = ""
			if (fechaCambio) {
				fecha = new Date($scope.convertirFecha(fechaCambio))
			} else {
				fecha = new Date()
			}

			var promesa = ObtenerCambioMoneda(fecha)
			promesa.then(function (dato) {
				console.log(dato)
				if (dato.monedaCambio) {
					$scope.moneda = dato.monedaCambio;

				}
			})
		}
		$scope.crearNuevoComprobante = function (venta, compra, comprobante, view) {
			$scope.alertasComprobantes = $scope.ventasComprobantes.length + $scope.comprasComprobantes.length
			var fecha = $scope.fechaATexto(new Date())
			if ($scope.moneda.dolar) {
				console.log($scope.ventas)
				$scope.nuevoComprobante = { fecha: fecha, id_usuario: $scope.usuario.id, asientosContables: [], eliminado: 0, abierto: 0, importe: 0, id_venta: "", id_compra: "", id_sucursal: $scope.sucursales[0], tipoComprobante: $scope.tiposComprobantes[0], tipoCambio: $scope.moneda };
				$scope.cuentaActual = {}
				$scope.ObtenerPlantillaIngresoEgreso(venta, compra, comprobante, view);

				$scope.obtenerGestiones()
				if (venta == null && compra == null && comprobante == null) {
					$scope.verComprobante = false
					$scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
				}
				//$scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
			} else {
				$scope.mostrarMensaje("cargar cambio de ivb y dolar")
			}
		}

		$scope.subirExcelUfvDolar = function (event) {
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
					var mes = [];
					do {
						var dia = {};
						var fecha_vencimiento = null;
						if (worksheet['A' + row] != undefined && worksheet['A' + row] != "") {
							if (typeof worksheet['A' + row].v === 'number') {
								if (worksheet['A' + row].v % 1 === 0) {
									fecha_vencimiento = new Date((worksheet['A' + row].v - (25567 + 1)) * 86400 * 1000);
								}
							} else {
								fecha_vencimiento = new Date($scope.convertirFecha(worksheet['A' + row].v));
							}
						}
						dia.ufb = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
						dia.dolar = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
						dia.fecha = fecha_vencimiento;
						mes.push(dia);
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
					console.log(mes)
					$scope.guardarCambioMoneda(mes);
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
		}
		$scope.guardarCambioMoneda = function (mes) {
			ContabilidadCambioMoneda.save(mes, function (dato) {
				$scope.mostrarMensaje(dato.message)
			})
		}
		$scope.opcionBimonetario = false;
		$scope.VerBimonetario = function (asientos) {
			for (var i = 0; i < asientos.length; i++) {
				var element = asientos[i];
				if (element.debe_bs) {
					$scope.ComvertirDebeEnDolar(element, false)
				} else {
					$scope.ComvertirHaberEnDolar(element, false)
				}
			}
			console.log($scope.opcionBimonetario)
			if ($scope.opcionBimonetario != true) {
				$scope.opcionBimonetario = false;
			} else {
				$scope.opcionBimonetario = true;
			}
		}

		$scope.cal = function (asientos) {
			$scope.totales = { debe_bs: 0, debe_sus: 0, haber_bs: 0, haber_sus: 0 }
			asientos.forEach(function (asiento, index, array) {
				if (asiento.debe_bs != "") {
					$scope.totales.debe_bs = $scope.totales.debe_bs + asiento.debe_bs
				} else {
					asiento.debe_bs = 0;
					$scope.totales.debe_bs = $scope.totales.debe_bs + asiento.debe_bs
				}
				if (asiento.debe_sus != "") {
					$scope.totales.debe_sus = $scope.totales.debe_sus + asiento.debe_sus
				} else {
					asiento.debe_sus = 0;
					$scope.totales.debe_sus = $scope.totales.debe_sus + asiento.debe_sus
				}
				if (asiento.haber_bs != "") {
					$scope.totales.haber_bs = $scope.totales.haber_bs + asiento.haber_bs
				} else {
					asiento.haber_bs = 0
					$scope.totales.haber_bs = $scope.totales.haber_bs + asiento.haber_bs
				}
				if (asiento.haber_sus != "") {
					$scope.totales.haber_sus = $scope.totales.haber_sus + asiento.haber_sus
				} else {
					asiento.haber_sus = 0
					$scope.totales.haber_sus = $scope.totales.haber_sus + asiento.haber_sus
				}
				if (index === array.length - 1) {
					$scope.totales.haber_bs = Math.round($scope.totales.haber_bs * 10000) / 10000
					$scope.totales.debe_sus = Math.round($scope.totales.debe_sus * 1000) / 1000
					$scope.totales.debe_bs = Math.round($scope.totales.debe_bs * 10000) / 10000
					$scope.totales.haber_sus = Math.round($scope.totales.haber_sus * 1000) / 1000
				}
			}, this);
		}
		$scope.ObtenerPlantillaIngresoEgreso = function (venta, compra, comprobante, view) {
			$scope.verComprobante = false
			var promesa = ConfiguracionesCuentasEmpresa($scope.usuario.id_empresa);
			var a = false;
			promesa.then(function (entidad) {
				$scope.ListaConfiguaracionCuenta = entidad.lista;
				console.log(entidad.lista)
				if (venta instanceof Array) {
					venta.forEach(function (venta2, index, array) {
						if (venta2.check) {
							if (venta2.cliente.clienteCuenta != null) {
								$scope.nuevoComprobante.id_venta = venta2.id
								var cuenta = venta2.cliente.clienteCuenta.cuenta
								console.log(venta2)
								console.log($scope.ListaConfiguaracionCuenta)
								$scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta) {
									if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_ING) {
										if (configuracionCuenta.nombre == "IT" || configuracionCuenta.nombre == "CAJA/BANCOS") {
											var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: venta2.total * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((venta2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
											$scope.nuevoComprobante.asientosContables.push(asiento);
										} else {
											var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: venta2.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((venta2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
											$scope.nuevoComprobante.asientosContables.push(asiento);
										}
										if ($scope.nuevoComprobante.asientosContables.length == 2) {
											var asiento = { cuenta: cuenta, debe_bs: "", haber_bs: venta2.total * (87 / 100), debe_sus: "", haber_sus: Math.round(((venta2.total * 87 / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
											$scope.nuevoComprobante.asientosContables.push(asiento);
										}
									}
								}, this);

							} else {
								a = true
								index = array.length - 1
								if (index === array.length - 1) {
									$scope.mostrarMensaje("asignar Cuenta")
								}
							}
						}
						if (index === array.length - 1) {
							if (a != true) {
								$scope.cal($scope.nuevoComprobante.asientosContables)
								$scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
							}
						}
					}, this);
					console.log(venta)
				} else if (venta != null) {
					if (venta.cliente.clienteCuenta != null) {
						$scope.nuevoComprobante.id_venta = venta.id
						var cuenta = venta.cliente.clienteCuenta.cuenta
						console.log(venta)
						console.log($scope.ListaConfiguaracionCuenta)
						$scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta, index, array) {
							if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_ING) {
								if (configuracionCuenta.nombre == "IT" || configuracionCuenta.nombre == "CAJA/BANCOS") {
									var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: venta.total * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((venta.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								} else {
									var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: venta.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((venta.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								}
								if ($scope.nuevoComprobante.asientosContables.length == 2) {
									var asiento = { cuenta: cuenta, debe_bs: "", haber_bs: venta.total * (87 / 100), debe_sus: "", haber_sus: Math.round(((venta.total * 87 / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								}
							}
							if (index === array.length - 1) {
								$scope.cal($scope.nuevoComprobante.asientosContables)
								$scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
							}
						}, this);

					} else {
						$scope.abrirCuentaClienteProvedor(venta.cliente, null);
						$scope.mostrarMensaje("asignar Cuenta")

					}

				}
				if (compra instanceof Array) {
					compra.forEach(function (compra2, index, array) {
						if (compra2.check) {
							$scope.nuevoComprobante.id_compra = compra2.id
							if (compra2.proveedor.proveedorCuenta != null) {
								var cuenta = compra2.proveedor.proveedorCuenta.cuenta
								var asiento = { cuenta: cuenta, debe_bs: compra2.total * (87 / 100), haber_bs: "", debe_sus: Math.round(((compra2.total * (87 / 100)) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
								var asiento2 = {}
								$scope.nuevoComprobante.asientosContables.push(asiento);
								$scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta) {
									if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_EGR) {
										if (configuracionCuenta.nombre == "CAJA/BANCOS") {
											asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra2.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
										} else {
											var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: compra2.total * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((compra2.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
											$scope.nuevoComprobante.asientosContables.push(asiento);
										}
										if ($scope.nuevoComprobante.asientosContables.length == 2) { $scope.nuevoComprobante.asientosContables.push(asiento2); }
									}

								}, this);
							} else {
								a = true
								index = array.length - 1
								if (index === array.length - 1) {
									$scope.mostrarMensaje("asignar Cuenta")
								}
							}
						}
						if (index === array.length - 1) {
							if (a != true) {

								$scope.cal($scope.nuevoComprobante.asientosContables)

								$scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
							}
						}
					}, this);
					console.log(venta)
				} else if (compra != null) {
					if (compra.proveedor.proveedorCuenta != null) {
						$scope.nuevoComprobante.id_compra = compra.id
						var cuenta = compra.proveedor.proveedorCuenta.cuenta
						var asiento = { cuenta: cuenta, debe_bs: compra.total * (87 / 100), haber_bs: "", debe_sus: Math.round(((compra.total * (87 / 100)) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
						var asiento2 = {}
						$scope.nuevoComprobante.asientosContables.push(asiento);
						$scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta, index, array) {
							if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_EGR) {
								if (configuracionCuenta.nombre == "CAJA/BANCOS") {
									asiento2 = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: compra.total * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((compra.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
								} else {
									var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: compra.total * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((compra.total * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								}
								if ($scope.nuevoComprobante.asientosContables.length == 2) { $scope.nuevoComprobante.asientosContables.push(asiento2); }
							}
							if (index === array.length - 1) {
								$scope.cal($scope.nuevoComprobante.asientosContables)
								$scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
							}
						}, this);
					} else {
						$scope.mostrarMensaje("asignar Cuenta")
						$scope.abrirCuentaClienteProvedor(null, compra.proveedor);
					}

				}
				if (comprobante != null) {
					$scope.nuevoComprobante = comprobante;
					$scope.nuevoComprobante.id_sucursal = comprobante.sucursal
					var fecha = new Date(comprobante.fecha)
					$scope.nuevoComprobante.fecha = fecha.getDay() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
					$scope.totales = { debe_bs: 0, debe_sus: 0, haber_bs: 0, haber_sus: 0 }
					$scope.nuevoComprobante.asientosContables.forEach(function (asiento, index, array) {
						$scope.totales.debe_bs += asiento.debe_bs
						$scope.totales.haber_bs += asiento.haber_bs
						$scope.totales.debe_sus += asiento.debe_sus
						$scope.totales.haber_sus += asiento.haber_sus
						if (index === (array.length - 1)) {
							$scope.totales.haber_bs = Math.round($scope.totales.haber_bs * 10000) / 10000
							$scope.totales.debe_sus = Math.round($scope.totales.debe_sus * 1000) / 1000
							$scope.totales.debe_bs = Math.round($scope.totales.debe_bs * 10000) / 10000
							$scope.totales.haber_sus = Math.round($scope.totales.haber_sus * 1000) / 1000

						}
					}, this);
					if (view) {
						$scope.verComprobante = true
					}
					$scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
					/* comprobante.comprobante.forEach(function (comprobante2) {
						var cuenta = comprobante2.cuentas
						var asiento = { id: cuenta.id, cuenta: cuenta, debe_bs: cuenta.debe * 87 / 100, haber_bs: "", debe_sus: Math.round(((cuenta.debe * 87 / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
						$scope.nuevoComprobante.asientosContables.push(asiento);
						$scope.ListaConfiguaracionCuenta.forEach(function (configuracionCuenta) {
							if (configuracionCuenta.tipo.nombre_corto == Diccionario.MOV_EGR) {
								if (configuracionCuenta.nombre == "CAJA/BANCOS") {
									var asiento = { id: cuenta.id, cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: cuenta.debe * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((cuenta.debe * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								} else {
									var asiento = { id: cuenta.id, cuenta: configuracionCuenta.cuenta, debe_bs: cuenta.debe * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((cuenta.debe * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								}
							}else{
								if (configuracionCuenta.nombre == "IT" || configuracionCuenta.nombre == "CAJA/BANCOS") {
									var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: cuenta.debe * configuracionCuenta.valor / 100, haber_bs: "", debe_sus: Math.round(((cuenta.debe * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, haber_sus: "", eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								} else {
									var asiento = { cuenta: configuracionCuenta.cuenta, debe_bs: "", haber_bs: cuenta.debe * configuracionCuenta.valor / 100, debe_sus: "", haber_sus: Math.round(((cuenta.debe * configuracionCuenta.valor / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								}
								if ($scope.nuevoComprobante.asientosContables.length == 2) {
									var asiento = { cuenta: cuenta, debe_bs: "", haber_bs: cuenta.debe * (87 / 100), debe_sus: "", haber_sus: Math.round(((cuenta.debe * 87 / 100) / $scope.moneda.dolar) * 10000) / 10000, eliminado: 0, activo: true }
									$scope.nuevoComprobante.asientosContables.push(asiento);
								}
							}
						}, this); 
						$scope.nuevoComprobante.AsientosActuales = $scope.nuevoComprobante.asientosContables.length;
					}, this); */
				}

				blockUI.stop();
			});
		}

		$scope.ComvertirDebeEnDolar = function (asiento, dato) {
			asiento.debe_sus = Math.round((asiento.debe_bs / $scope.moneda.dolar) * 10000) / 10000;
		}
		$scope.ComvertirHaberEnDolar = function (asiento) {
			asiento.haber_sus = Math.round((asiento.haber_bs / $scope.moneda.dolar) * 10000) / 10000;
		}
		$scope.ComvertirDebeEnBolivianos = function (asiento) {
			asiento.debe_bs = Math.round((asiento.debe_sus * $scope.moneda.dolar) * 10000) / 10000;
		}
		$scope.ComvertirHaberEnBolivianos = function (asiento) {
			asiento.haber_bs = Math.round((asiento.haber_sus * $scope.moneda.dolar) * 10000) / 10000;
		}
		$scope.obtenerTiposComprobante = function () {
			blockUI.start();
			var promesa = ClasesTipo("TCMC");
			promesa.then(function (entidad) {
				$scope.tiposComprobantes = entidad.clases;
				blockUI.stop();
			});
		}
		$scope.guardarComprasComprobante = function () {
			$scope.ocultarMensajesValidacion();
			$scope.DatosCodigoQr.forEach(function (element) {
				element.fecha = new Date($scope.convertirFecha(element.fecha));
			}, this);
			blockUI.start();
			ComprasComprobante.save($scope.DatosCodigoQr, function (dato) {
				blockUI.stop();
				$scope.mostrarMensaje(dato.mensaje);
				$scope.DatosCodigoQr = [];
			}, function (error) {
				blockUI.stop();
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');

			});

		}
		$scope.verificarCuenta = function (formularioAsignarCuenta, cuenta) {
			if (cuenta.id) {
				formularioAsignarCuenta.asignarCuenta.$error.cuenta = false
				$scope.error = null
			} else {
				formularioAsignarCuenta.asignarCuenta.$error.cuenta = true
				$scope.error = "asd"
			}
		}
		$scope.AsignarCuentaClienteProvedor = function (formularioAsignarCuenta) {
			if ($scope.datos.cuenta.id) {
				formularioAsignarCuenta.asignarCuenta.$error.cuenta = false
				$scope.datos.$save(function (data) {
					$scope.mostrarMensaje(data.menssage)
					$scope.cerrarCuentaClienteProvedor()
					$scope.verificarVentasComprobantes($scope.usuario.id_empresa)
					$scope.verificarComprasComprobantes($scope.usuario.id_empresa)
				})
			} else {

				formularioAsignarCuenta.asignarCuenta.$error.cuenta = true
				$scope.error = "asd"
			}
		}
		$scope.cerrarNuevoComprobante = function () {
			$scope.cerrarPopup($scope.idModalWizardComprobanteEdicion);
		};
		//modal qr
		$scope.abrirModalOpcionesQr = function () {
			$scope.abrirPopup($scope.IdModalOpcionesQr);
		}
		$scope.cerrarModalOpcionesQr = function () {
			$scope.cerrarPopup($scope.IdModalOpcionesQr);
		}
		//modal asignar cuenta
		$scope.abrirCuentaClienteProvedor = function (cliente, proveedor) {
			if (cliente) {
				$scope.datos = new AsignarCuentaCiente({ id_cliente: cliente.id, cuenta: "" })
			} else {
				$scope.datos = new AsignarCuentaProveedor({ id_proveedor: proveedor.id, cuenta: "" })
			}
			$scope.abrirPopup($scope.IdModalAsignarCuenta);
		}
		$scope.cerrarCuentaClienteProvedor = function () {
			$scope.cuenta = ""
			$scope.cerrarPopup($scope.IdModalAsignarCuenta);
		}
		//modal registrar
		$scope.abrirModalRegistrarComprobante = function () {
			$scope.abrirPopup($scope.IdModalRegistrarComprobante)
		}
		$scope.cerrarModalRegComprobante = function () {
			$scope.cerrarPopup($scope.IdModalRegistrarComprobante);
		}

		//modal revisar
		$scope.abrirModalRevisarComprobante = function () {

			$scope.ObtenerComprobantesRevision()
			$scope.abrirPopup($scope.IdModalRevisarComprobante)
		}
		$scope.ObtenerComprobantesRevision = function () {
			$scope.paginatorPrincipal = $scope.paginator;
			$scope.paginator = Paginator();
			$scope.paginator.column = "numero";
			$scope.paginator.callBack = $scope.obtenerListaRevision;
			$scope.filtro = { empresa: $scope.usuario.id_empresa, inicio: 0, fin: 0, texto_busqueda: 0 };
			if ($scope.filtro.inicio != null) {
				$scope.paginator.getSearch("", $scope.filtro);
				$scope.filtro.inicio = ""
				$scope.filtro.fin = ""
			}
		}

		$scope.asignarComprobanteFavorito = function (idComprobante) {
			NuevoComprobante($scope.mostrarMensaje, $scope.paginator, $scope.filtro, null, idComprobante)
		}

		$scope.obtenerListaRevision = function () {
			blockUI.start();
			var promise = NuevoComprobante(null, $scope.paginator, $scope.filtro, null, null, null, true, $scope.convertirFecha)
			promise.then(function (data) {
				$scope.paginator.setPages(data.paginas);
				$scope.comprobantesRevision = data.comprobantes;
				blockUI.stop();
			});
		}

		$scope.BuscarPorFechaLibrosMayores = function (asiento, inicio, fin) {
			var datosLibro = { asiento: asiento, fechaInicio: new Date($scope.convertirFecha(inicio)), fechaFin: new Date($scope.convertirFecha(fin)) }
			var promesa = NuevoComprobante(null, null, null, null, null, datosLibro)
			promesa.then(function (entidad) {
				$scope.DatosLibroMayor = entidad;
			});
		}
		$scope.cerrarModalLibrosMayores = function () {
			$scope.cerrarPopup($scope.IdModalLibroMayor);
		}
		$scope.cerrarModalRevisarComprobante = function () {
			if ($scope.paginatorPrincipal != null) {
				$scope.paginator = Paginator()
				$scope.paginator = $scope.paginatorPrincipal;
				$scope.paginator.column = "numero";
				$scope.paginator.callBack = $scope.obtenerLista;
			}
			$scope.cerrarPopup($scope.IdModalRevisarComprobante);
		}

		//modal Libros mayores
		$scope.abrirModalLibrosMayores = function (asiento) {
			$scope.asiento=asiento
			var asientos = asiento;
			if (asiento.cuenta) {
				asientos = asiento.cuenta

			} else {
				asientos = asiento
			}
			var datosLibro = { asiento: asientos, fechaInicio: 0, fechaFin: 0 }
			var promesa = NuevoComprobante(null, null, null, null, null, datosLibro)
			promesa.then(function (entidad) {
				$scope.DatosLibroMayor = entidad;
				$scope.abrirPopup($scope.IdModalLibroMayor)
			});
		}
		$scope.obtenerGestiones = function () {
			blockUI.start();
			var promesa = ClasesTipo("GTN");
			promesa.then(function (entidad) {
				$scope.gestiones = entidad.clases;
				blockUI.stop();
			});
		}
		$scope.buscarCuentas = function (query) {

			return NuevoComprobante($scope.mostrarMensaje, null, null, $scope.usuario, null, null, null, null, null, null, query)
		}
		$scope.eliminarDatosQr = function (dato) {
			$scope.DatosCodigoQr[dato].eliminado = true;
		}

		$scope.DatosCodigoQr = [];
		$scope.cont2 = 1
		$scope.disparo = true;
		$scope.verificarFechaQr = function (DatoQr, index) {
			var data = new Date();
			var data2 = new Date($scope.convertirFecha(DatoQr.fecha))
			var valido = ""
			if (data.getTime() < data2.getTime()) {
				valido = true
			} else {
				valido = false
			}
			$scope.DatosCodigoQr[index].valido = valido;
		}
		$scope.eliminarAsiento = function (asiento) {
			asiento.activo = false
		}
		$scope.establecerCuentaActual = function (cuenta) {
			var debe = 0, haber = 0;
			/* 	if (cuenta.cuenta.length > 0) {
					cuenta.cuenta.forEach(function (cuenta) {
						debe += cuenta.debe_bs
						haber += cuenta.haber_bs
					});
				} */
			$scope.cuentaActual = { id: cuenta.id, nombre: cuenta.nombre, debe: cuenta.debe, haber: cuenta.haber };

		}
		$scope.agregarDatosQr = function (evento, Dato) {
			if (evento.which === 13) {
				$scope.cont2++;
				datos = Dato;//$scope.cont2+"|999999999|9999999999999|17/10/2017|90|90|43|19999|0|0|0|0"
				var DatosCodigoQr = datos.split(' ');
				var data = new Date();
				var data2 = new Date($scope.convertirFecha(DatosCodigoQr[3]))
				var valido = ""
				if (data.getTime() < data2.getTime()) {
					valido = true
				} else {
					valido = false
				}

				var DatosRecopiladosCodigoQr = { nit: DatosCodigoQr[0], id_usuario: $scope.usuario.id, id_tipo_pago: null, tipoPago: null, detallesCompra: [], descuento_general: false, factura: DatosCodigoQr[1], autorizacion: DatosCodigoQr[2], fecha: DatosCodigoQr[3], total: DatosCodigoQr[4], total2: DatosCodigoQr[5], codigo_control: DatosCodigoQr[6], cliente_nit: DatosCodigoQr[7], ice: DatosCodigoQr[8], numero_grav: 0, sujeto_cf: 0, tipo_recargo: false, descuento: 0, recargo: 0, ice: 0, excento: 0, eliminado: false, valido: valido, lector: true }
				$scope.DatosCodigoQr.push(DatosRecopiladosCodigoQr)
				console.log($scope.DatosCodigoQr)
				var DatosRecopiladosCodigoQr = null;
				Dato = "";
			}
		}

		$scope.agregarAsientoANuevoComprobante = function (datos) {
			/* 	for (var index = 0; index < datos.asientosContables.length; index++) {
					var asiento = { cuenta: datos.asientosContables[index].cuentas, debe_bs: datos.asientosContables[index].debe_bs, haber_bs: datos.asientosContables[index].haber_bs, debe_sus: datos.asientosContables[index].debe_sus, haber_sus: datos.asientosContables[index].haber_sus, eliminado: 0, activo: true } */
			$scope.nuevoComprobante.asientosContables = datos.asientosContables
			$scope.nuevoComprobante.tipoComprobante = datos.tipoComprobante
			$scope.mostrarMensaje("datos copiados correctamente")
			/* if (index === datos.comprobante.length - 1) { */
			$scope.cal($scope.nuevoComprobante.asientosContables)
			/* } */

			/* } */
		}
		$scope.agregarAsiento = function () {
			var asiento = { glosa: "", cuenta: "", debe_bs: "", haber_bs: "", debe_sus: "", haber_sus: "", eliminado: 0, activo: true }
			$scope.nuevoComprobante.asientosContables.push(asiento)

		}
		$scope.agregarPrimerAsiento = function (comprobante) {
			if (comprobante.gloza) {
				if (comprobante.asientosContables.length == 0) {
					var asiento = { glosa: "", cuenta: "", debe_bs: "", haber_bs: "", debe_sus: "", haber_sus: "", eliminado: 0, activo: true }
					$scope.nuevoComprobante.asientosContables.push(asiento)
					console.log(comprobante.asientosContables)
				}
			} else {
				if (comprobante.asientosContables.length == 1) {
					$scope.nuevoComprobante.asientosContables.splice(0)
					console.log(comprobante.asientosContables)
				}
			}

		}
		$scope.agregarNuevoAsiento = function (asiento, index) {
			if (asiento.glosa) {
				if (asiento.glosa.length == 1) {
					if ($scope.nuevoComprobante.asientosContables[index + 1]) {

					} else {
						var asiento = { glosa: "", cuenta: "", debe_bs: "", haber_bs: "", debe_sus: "", haber_sus: "", eliminado: 0, activo: true }
						$scope.nuevoComprobante.asientosContables.push(asiento)
						console.log(comprobante.asientosContables)
					}
				}
			} else {
				if ($scope.nuevoComprobante.asientosContables[index + 1].cuenta) {

				} else {
					$scope.nuevoComprobante.asientosContables.splice(index + 1)
					console.log(comprobante.asientosContables)
				}

			}

		}

		$scope.agregarNuevoItem = function () {
			var DatosRecopiladosCodigoQr = { nit: "", factura: "", autorizacion: "", fecha: "", total: "", total2: "", codigo_control: "", cliente: "", ice: "", numero_grav: "", sujeto_cf: "", desc: "", eliminado: false, valido: null, lector: false }
			$scope.DatosCodigoQr.push(DatosRecopiladosCodigoQr)

		}
		//fin modal comprobante nuevo
		$scope.ocultarFormularioInicioSesion = function () {
			$scope.cerrarPopup($scope.idModalInicioSesion);
		}

		$scope.buscarAplicacion = function (aplicaciones, url) {
			var aplicaciones = $.grep(aplicaciones, function (e) { return e.aplicacion.url == url; });
			$scope.aplicacion = aplicaciones[0];
		}

		$scope.recargarItemsTabla = function () {
			var currentPageTemplate = $route.current.templateUrl;
			$templateCache.remove(currentPageTemplate);
			$route.reload();
		}

		$scope.cargarPagina = function () {
			$scope.generarMenus($scope.usuario);
			$scope.vencimientoTotal = 0;
			$scope.obtenerMovimientoEgresoBaja();
			$scope.obtenerTiposComprobante();
			$scope.sucursales = $scope.obtenerSucursales();
			if ($scope.usuario.empresa) {
				if ($scope.usuario.empresa.usar_vencimientos) {
					$scope.verificarVencimientosProductos($scope.usuario.id_empresa);
					$scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
					$scope.verificarVencimientosDeudas($scope.usuario.id_empresa);
				}
				if ($scope.usuario.empresa.usar_contabilidad) {
					$scope.verificarVentasComprobantes($scope.usuario.id_empresa)
					$scope.verificarComprasComprobantes($scope.usuario.id_empresa)
				}
			}

			$scope.ocultarFormularioInicioSesion();
			$scope.obtenerCambioMoneda();
		}

		$scope.iniciarSesion = function (usuario) {
			blockUI.start();
			/*var captchResponse = $('#g-recaptcha-response').val();
			if(captchResponse.length == 0 ){
				$scope.error='Utiliza el Captcha del sitio!';
				blockUI.stop();
			}else{*/
			Sesion.iniciarSesion(usuario, function (res) {
				if (res.type == false) {
					$scope.error = res.data;
				} else {
					var promesa = UsuarioSucursalesAutenticacion(res.data.id);
					promesa.then(function (usuarioSucursales) {
						res.data.sucursalesUsuario = usuarioSucursales;
						$localStorage.token = res.data.token;
						$localStorage.usuario = JSON.stringify(res.data);
						$scope.token = $localStorage.token;
						usuario = res.data;
						$scope.usuario = usuario;
						document.title = 'AGIL - ' + $scope.usuario.nombre_usuario;
						$scope.cargarPagina();
					});
				}
				blockUI.stop();
			}, function (data, status, headers, config) {

			});
			//}
		};

		$scope.generarMenus = function (usuario) {
			$scope.aplicaciones = [];
			for (var i = 0; i < usuario.rolesUsuario.length; i++) {
				for (var j = 0; j < usuario.rolesUsuario[i].rol.aplicacionesRol.length; j++) {
					usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion.url = usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion.url.replace("?", usuario.persona.id + "");
					if (usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion.id_padre == null) {
						var app = usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion;
						app.subaplicaciones = [];
						$scope.aplicaciones.push(app);
					}
				}
			}

			for (var i = 0; i < usuario.rolesUsuario.length; i++) {
				for (var j = 0; j < usuario.rolesUsuario[i].rol.aplicacionesRol.length; j++) {
					for (var z = 0; z < $scope.aplicaciones.length; z++) {
						if (usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion.id_padre == $scope.aplicaciones[z].id) {
							$scope.aplicaciones[z].subaplicaciones.push(usuario.rolesUsuario[i].rol.aplicacionesRol[j].aplicacion);
						}
					}
				}
			}
		}

		$scope.abrirm = function () {
			$('#modal-wizard-comprobante-edicion').modal('show');
		}

		$scope.verificarComprasComprobantes = function (idEmpresa) {
			var promesa = ComprasComprobantesEmpresa(idEmpresa);
			promesa.then(function (dato) {
				$scope.comprasComprobantes = dato.compras;
				$scope.vencimientoTotal = $scope.vencimientoTotal + $scope.comprasComprobantes.length;
			});
		}

		$scope.verificarVentasComprobantes = function (idEmpresa) {
			var promesa = VentasComprobantesEmpresa(idEmpresa);
			promesa.then(function (dato) {
				$scope.ventasComprobantes = dato.ventas;
				$scope.vencimientoTotal = $scope.vencimientoTotal + $scope.ventasComprobantes.length;
				console.log(dato.ventas)
			});
		}

		$scope.verificarVencimientosProductos = function (idEmpresa) {
			//blockUI.start();
			var promesa = VencimientosProductosEmpresa(idEmpresa);
			promesa.then(function (vencimientosProductos) {
				$scope.vencimientoTotal = $scope.vencimientoTotal + vencimientosProductos.length;
				$scope.vencimientosProductos = vencimientosProductos;
				//blockUI.stop();
			});
		}
		$scope.verificarVencimientosProductos = function (idEmpresa) {
			//blockUI.start();
			var promesa = VencimientosProductosEmpresa(idEmpresa);
			promesa.then(function (vencimientosProductos) {
				$scope.vencimientoTotal = $scope.vencimientoTotal + vencimientosProductos.length;
				$scope.vencimientosProductos = vencimientosProductos;
				//blockUI.stop();
			});
		}

		$scope.verificarVencimientosCreditos = function (idEmpresa) {
			//blockUI.start();
			var promesa = VencimientosCreditosEmpresa(idEmpresa);
			promesa.then(function (vencimientosCreditos) {

				for (var i = 0; i < vencimientosCreditos.length; i++) {
					var fecha = new Date(vencimientosCreditos[i].fecha);
					vencimientosCreditos[i].fecha_vencimiento = $scope.sumaFecha(vencimientosCreditos[i].dias_credito, fecha);
					for (var j = 0; j < vencimientosCreditos[i].ventaReprogramacionPagos.length; j++) {
						if (vencimientosCreditos[i].ventaReprogramacionPagos[j].activo) {
							vencimientosCreditos[i].fecha_anterior = vencimientosCreditos[i].ventaReprogramacionPagos[j].fecha_anterior
						}
					}

				}
				$scope.vencimientoTotal = $scope.vencimientoTotal + vencimientosCreditos.length;
				$scope.vencimientosCreditos = vencimientosCreditos;
				//blockUI.stop();
			});
		}


		$scope.verificarVencimientosDeudas = function (idEmpresa) {
			//blockUI.start();
			var promesa = VencimientosDeudasEmpresa(idEmpresa);
			promesa.then(function (vencimientosDeudas) {
				for (var i = 0; i < vencimientosDeudas.length; i++) {
					var fecha = new Date(vencimientosDeudas[i].fecha);
					vencimientosDeudas[i].fecha_vencimiento = $scope.sumaFecha(vencimientosDeudas[i].dias_credito, fecha);
					for (var j = 0; j < vencimientosDeudas[i].compraReprogramacionPagos.length; j++) {
						if (vencimientosDeudas[i].compraReprogramacionPagos[j].activo) {
							vencimientosDeudas[i].fecha_anterior = vencimientosDeudas[i].compraReprogramacionPagos[j].fecha_anterior
						}
					}
				}
				$scope.vencimientoTotal = $scope.vencimientoTotal + vencimientosDeudas.length;
				$scope.vencimientosDeudas = vencimientosDeudas;
				//blockUI.stop();
			});
		}

		$scope.ActualizarFechaCreditosCliente = function (venta, fechaCredito) {

			venta.fecha = new Date(venta.fecha)
			console.log("fecha anterior " + venta.fecha)
			console.log("fecha reprogramada " + fechaCredito)
			var datos = {}
			fechaReprogramacion = new Date($scope.convertirFecha(fechaCredito)).getTime();
			fechaInicioVenta = new Date($scope.convertirFecha(venta.fecha.getDate() + "/" + (venta.fecha.getMonth() + 1) + "/" + venta.fecha.getFullYear())).getTime();
			var diff = fechaReprogramacion - fechaInicioVenta;
			var diferencia = diff / (1000 * 60 * 60 * 24);
			console.log(diferencia)
			datos.dias_credito = diferencia
			datos.fecha_reprogramacion = new Date($scope.convertirFecha(fechaCredito));
			datos.fecha_anterior = new Date($scope.convertirFecha(venta.fecha_vencimiento.getDate() + "/" + (venta.fecha_vencimiento.getMonth() + 1) + "/" + venta.fecha_vencimiento.getFullYear()));
			console.log(datos)
			ClienteVencimientoCredito.update({ id: venta.id }, datos, function (res) {
				$scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosCreditos.length;
				$scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
				$scope.cerrarActualizarFechaCreditos();
				$scope.mostrarMensaje("¡Actualizado Satisfactoriamente!");
			});
		}

		$scope.ActualizarFechaCreditosDeudas = function (compra, fechaDeuda) {
			compra.fecha = new Date(compra.fecha)
			console.log("fecha anterior " + compra.fecha)
			console.log("fecha reprogramada " + fechaDeuda)
			var datos = {}
			fechaReprogramacion = new Date($scope.convertirFecha(fechaDeuda)).getTime();
			fechaInicioCompra = new Date($scope.convertirFecha(compra.fecha.getDate() + "/" + (compra.fecha.getMonth() + 1) + "/" + compra.fecha.getFullYear())).getTime();
			var diff = fechaReprogramacion - fechaInicioCompra;
			var diferencia = diff / (1000 * 60 * 60 * 24);
			console.log(diferencia)
			datos.dias_credito = diferencia
			datos.fecha_reprogramacion = new Date($scope.convertirFecha(fechaDeuda));
			datos.fecha_anterior = new Date($scope.convertirFecha(compra.fecha_vencimiento.getDate() + "/" + (compra.fecha_vencimiento.getMonth() + 1) + "/" + compra.fecha_vencimiento.getFullYear()));
			console.log(datos)
			ProveedorVencimientoCredito.update({ id: compra.id }, datos, function (res) {
				$scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosDeudas.length;
				$scope.verificarVencimientosDeudas($scope.usuario.id_empresa);
				$scope.cerrarActualizarFechaDeudas();
				$scope.mostrarMensaje("¡Actualizado Satisfactoriamente!");
			});
		}
		$scope.obtenerMovimientoEgresoBaja = function () {
			blockUI.start();
			var promesa = ClasesTipo("MOVEGR");
			promesa.then(function (entidad) {
				$scope.movimientoEgresoBaja = $.grep(entidad.clases, function (e) { return e.nombre_corto == $scope.diccionario.EGRE_BAJA; })[0];
				blockUI.stop();
			});
		}

		$scope.abrirVentanaBaja = function (inventario) {
			var inventarios = []; inventarios.push(inventario);
			$scope.bajaInventario = new Venta({
				id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id,
				detallesVenta: [], detallesVentaNoConsolidadas: [],
				importe: (inventario.producto.precio_unitario * inventario.cantidad),
				total: (inventario.producto.precio_unitario * inventario.cantidad)
			});
			$scope.bajaInventario.sucursal = inventario.almacen.sucursal;
			$scope.bajaInventario.almacen = inventario.almacen;
			$scope.bajaInventario.movimiento = $scope.movimientoEgresoBaja;
			var fechaActual = new Date();
			$scope.bajaInventario.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
			$scope.bajaInventario.detallesVenta.push({
				producto: inventario.producto, cantidad: inventario.cantidad,
				importe: (inventario.producto.precio_unitario * inventario.cantidad),
				total: (inventario.producto.precio_unitario * inventario.cantidad),
				costos: inventarios, inventario: inventario,
				descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false
			});
		}

		$scope.cerrarVentanaBajaProducto = function () {
			$scope.bajaInventario = null;
		}

		$scope.abrirListaDespachos = function () {
			$scope.abrirPopup($scope.idModalTablaDespachos);
		}

		$scope.abrirListaVencimientoProductos = function () {
			$scope.abrirPopup($scope.idModalTablaVencimientoProductos);
		}

		$scope.cerrarListaDespachos = function () {
			$scope.cerrarPopup($scope.idModalTablaDespachos);
		}

		$scope.cerrarListaVencimientoProductos = function () {
			$scope.cerrarPopup($scope.idModalTablaVencimientoProductos);
		}
		//modal compras pendientes
		$scope.abrirModalComprasPendientes = function () {
			$scope.abrirPopup($scope.idModalTablaComprasPendientes)
		}
		$scope.cerrarModalComprasPendientes = function () {
			$scope.cerrarPopup($scope.idModalTablaComprasPendientes);
		}
		//modal bancos pendientes
		$scope.abrirModalBancosPendientes = function () {
			$scope.abrirPopup($scope.idModalTablaBancosPendientes)
		}
		$scope.cerrarModalBancosPendientes = function () {
			$scope.cerrarPopup($scope.idModalTablaBancosPendientes);
		}
		//modal otros pendientes
		$scope.abrirModalBancosPendientes = function () {
			$scope.abrirPopup($scope.idModalTablaOtrosPendientes)
		}
		$scope.cerrarModalBancosPendientes = function () {
			$scope.cerrarPopup($scope.idModalTablaOtrosPendientes);
		}
		$scope.abrirListaVencimientoCreditos = function () {

			$scope.abrirPopup($scope.idModalTablaVencimientoCreditos);
		}

		$scope.cerrarListaVencimientoCreditos = function () {
			$scope.cerrarPopup($scope.idModalTablaVencimientoCreditos);
		}
		$scope.abrirActualizarFechaCreditos = function (venta) {
			$scope.venta = venta;
			$scope.abrirPopup($scope.idmodalActualizarCreditoCliente);
		}
		$scope.cerrarActualizarFechaCreditos = function () {
			$scope.cerrarPopup($scope.idmodalActualizarCreditoCliente);
		}
		$scope.abrirActualizarFechaDeudas = function (compra) {
			$scope.compra = compra;
			$scope.abrirPopup($scope.idmodalActualizarCreditoDeuda);
		}
		$scope.cerrarActualizarFechaDeudas = function () {
			$scope.cerrarPopup($scope.idmodalActualizarCreditoDeuda);
		}
		$scope.abrirListaVencimientoDeudas = function () {
			$scope.abrirPopup($scope.idModalTablaVencimientoDeudas);
		}

		$scope.cerrarListaVencimientoDeudas = function () {
			$scope.cerrarPopup($scope.idModalTablaVencimientoDeudas);
		}
		$scope.abrirListaVentasPendientes = function () {
			$scope.abrirPopup($scope.idModalTablaVentasPendientes);
		}

		$scope.cerrarListaVentasPendientes = function () {
			$scope.cerrarPopup($scope.idModalTablaVentasPendientes);
		}
		$scope.imprimirListaVencimientoProductos = function (vencimientosProductos) {
			blockUI.start();
			console.log(vencimientosProductos);
			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var saldoFisico = 0;
			var saldoValuado = 0;

			var y = 140, itemsPorPagina = 30, items = 0, pagina = 1, totalPaginas = Math.ceil(vencimientosProductos.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFVencimientoProductos(doc, 1, totalPaginas, vencimientosProductos);
			for (var i = 0; i < vencimientosProductos.length && items <= itemsPorPagina; i++) {

				doc.rect(30, y - 10, 555, 20).stroke();
				doc.font('Helvetica', 7);
				if (vencimientosProductos[i].producto.codigo == null) {
					doc.text("", 40, y);
				} else {
					doc.text(vencimientosProductos[i].producto.codigo, 40, y);
				}
				//
				doc.text(vencimientosProductos[i].producto.nombre, 120, y - 6, { width: 140 });
				vencimientosProductos[i].fecha_vencimiento = new Date(vencimientosProductos[i].fecha_vencimiento);
				doc.text(vencimientosProductos[i].producto.unidad_medida, 260, y, { width: 50 });
				doc.text(vencimientosProductos[i].almacen.sucursal.nombre, 305, y - 6, { width: 60 });
				doc.text(vencimientosProductos[i].almacen.nombre, 375, y - 6, { width: 60 });
				doc.text(vencimientosProductos[i].fecha_vencimiento.getDate() + "/" + (vencimientosProductos[i].fecha_vencimiento.getMonth() + 1) + "/" + vencimientosProductos[i].fecha_vencimiento.getFullYear(), 445, y, { width: 50 });
				doc.text(vencimientosProductos[i].lote, 490, y, { width: 50 });
				doc.text(vencimientosProductos[i].cantidad, 540, y, { width: 50 });
				doc.text(vencimientosProductos[i].producto.descuento + "%", 560, y, { width: 50 });
				y = y + 20;
				items++;

				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 140;
					items = 0;
					pagina = pagina + 1;

					$scope.dibujarCabeceraPDFVencimientoProductos(doc, pagina, totalPaginas, vencimientosProductos);

					doc.font('Helvetica', 7);
				}
			}
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}

		$scope.dibujarCabeceraPDFVencimientoProductos = function (doc, pagina, totalPaginas, vencimientosProductos) {
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.font('Helvetica-Bold', 10);
			doc.text($scope.usuario.empresa.razon_social, 0, 35, { align: "center" });
			doc.font('Helvetica', 8);
			doc.text("COCHABAMBA - BOLIVIA", 0, 50, { align: "center" });
			doc.font('Helvetica-Bold', 10);
			doc.text("LISTA DE VENCIMIENTOS PRODUCTOS", 0, 65, { align: "center" });
			doc.rect(210, 75, 180, 0);
			doc.font('Helvetica-Bold', 7);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			doc.rect(30, 100, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Codigo", 45, 110);
			doc.text("Productos", 120, 110, { width: 50 });
			doc.text("Unid. de Medida", 260, 110, { width: 40 });
			doc.text("Sucursal", 310, 110, { width: 60 });
			doc.text("Almacen", 370, 110, { width: 60 });
			doc.text("Venc.", 440, 110, { width: 60 });
			doc.text("Lote", 490, 110, { width: 50 });
			doc.text("Cant.", 530, 110, { width: 50 });
			doc.text("Desc.", 550, 110, { width: 50 });
			doc.font('Helvetica', 7);
			doc.text("usuario : " + $scope.usuario.nombre_usuario, 475, 740);
			doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 475, 750);
		}
		$scope.imprimirListaVencimientoCreditos = function (vencimientosCreditos) {
			blockUI.start();

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var saldoFisico = 0;
			var saldoValuado = 0;

			var y = 140, itemsPorPagina = 30, items = 0, pagina = 1, totalPaginas = Math.ceil(vencimientosCreditos.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFVencimientoCreditos(doc, 1, totalPaginas, vencimientosCreditos);
			for (var i = 0; i < vencimientosCreditos.length && items <= itemsPorPagina; i++) {

				doc.rect(30, y - 10, 555, 20).stroke();
				doc.font('Helvetica', 8);
				if (vencimientosCreditos[i].cliente.codigo == null) {
					doc.text("", 45, y, { width: 50 });
				} else {
					doc.text(vencimientosCreditos[i].cliente.codigo, 45, y, { width: 50 });
				}
				doc.text(vencimientosCreditos[i].cliente.razon_social, 100, y);
				if (vencimientosCreditos[i].factura == null) {
					doc.text("Proforma", 280, y);
				} else {
					doc.text("Factura Nro. " + vencimientosCreditos[i].factura, 280, y);
				}
				vencimientosCreditos[i].fecha = new Date(vencimientosCreditos[i].fecha);
				doc.text(vencimientosCreditos[i].fecha.getDate() + "/" + (vencimientosCreditos[i].fecha.getMonth() + 1) + "/" + vencimientosCreditos[i].fecha.getFullYear(), 400, y, { width: 50 });
				doc.text(vencimientosCreditos[i].saldo, 500, y, { width: 50, align: "right" });
				y = y + 20;
				items++;

				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 140;
					items = 0;
					pagina = pagina + 1;

					$scope.dibujarCabeceraPDFVencimientoCreditos(doc, pagina, totalPaginas, vencimientosCreditos);

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

		$scope.dibujarCabeceraPDFVencimientoCreditos = function (doc, pagina, totalPaginas, vencimientosCreditos) {
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.font('Helvetica-Bold', 10);
			doc.text($scope.usuario.empresa.razon_social, 0, 35, { align: "center" });
			doc.font('Helvetica', 8);
			doc.text("COCHABAMBA - BOLIVIA", 0, 50, { align: "center" });
			doc.font('Helvetica-Bold', 10);
			doc.text("LISTA DE VENCIMIENTOS CLIENTE", 0, 65, { align: "center" });
			doc.rect(210, 75, 180, 0);
			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			doc.rect(30, 100, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Codigo", 45, 110);
			doc.text("Cliente", 100, 110, { width: 50 });
			doc.text("Detalle", 280, 110, { width: 60 });
			doc.text("Vencimiento", 400, 110, { width: 50 });
			doc.text("monto", 525, 110, { width: 50 });
			doc.font('Helvetica', 7);
			doc.text("usuario : " + $scope.usuario.nombre_usuario, 475, 740);
			doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 475, 750);
		}
		$scope.imprimirListaVencimientoDeudas = function (vencimientosDeudas) {
			blockUI.start();

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var saldoFisico = 0;
			var saldoValuado = 0;

			var y = 140, itemsPorPagina = 30, items = 0, pagina = 1, totalPaginas = Math.ceil(vencimientosDeudas.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFVencimientoDeudas(doc, 1, totalPaginas, vencimientosDeudas);
			for (var i = 0; i < vencimientosDeudas.length && items <= itemsPorPagina; i++) {
				doc.rect(30, y - 10, 555, 20).stroke();
				doc.font('Helvetica', 8);
				if (vencimientosDeudas[i].proveedor.codigo == null) {
					doc.text("", 45, y, { width: 50 });
				} else {
					doc.text(vencimientosDeudas[i].proveedor.codigo, 45, y, { width: 50 });
				}
				doc.text(vencimientosDeudas[i].proveedor.razon_social, 100, y);
				if (vencimientosDeudas[i].factura == null) {
					doc.text("Proforma", 280, y);
				} else {
					doc.text("Factura Nro. " + vencimientosDeudas[i].factura, 280, y);
				}
				vencimientosDeudas[i].fecha = new Date(vencimientosDeudas[i].fecha);
				doc.text(vencimientosDeudas[i].fecha.getDate() + "/" + (vencimientosDeudas[i].fecha.getMonth() + 1) + "/" + vencimientosDeudas[i].fecha.getFullYear(), 400, y, { width: 50 });
				doc.text(vencimientosDeudas[i].saldo, 500, y, { width: 50, align: "right" });
				y = y + 20;
				items++;

				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 140;
					items = 0;
					pagina = pagina + 1;

					$scope.dibujarCabeceraPDFVencimientoDeudas(doc, pagina, totalPaginas, vencimientosDeudas);

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
		$scope.dibujarCabeceraPDFVencimientoDeudas = function (doc, pagina, totalPaginas, vencimientosDeudas) {
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.font('Helvetica-Bold', 10);
			doc.text($scope.usuario.empresa.razon_social, 0, 35, { align: "center" });
			doc.font('Helvetica', 8);
			doc.text("COCHABAMBA - BOLIVIA", 0, 50, { align: "center" });
			doc.font('Helvetica-Bold', 10);
			doc.text("LISTA DE VENCIMIENTOS PROVEEDORES", 0, 65, { align: "center" });
			doc.rect(210, 75, 180, 0);
			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			doc.rect(30, 100, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Codigo", 45, 110);
			doc.text("Proveedor", 100, 110, { width: 50 });
			doc.text("Detalle", 280, 110, { width: 60 });
			doc.text("Vencimiento", 400, 110, { width: 50 });
			doc.text("monto", 525, 110, { width: 50 });
			doc.font('Helvetica', 7);
			doc.text("usuario : " + $scope.usuario.nombre_usuario, 475, 740);
			doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 475, 750);
		}

		$scope.abrirPopupPagoCreditos = function (venta) {
			$scope.venta = venta;

			$scope.pago = null;
			$scope.abrirPopup($scope.idModalPagoP);
		}

		$scope.cerrarPopupPagoCredito = function () {
			$scope.cerrarPopup($scope.idModalPagoP);
		}

		$scope.abrirPopupPagoDeudas = function (compra) {
			$scope.compra = compra;
			$scope.pago = null;
			$scope.abrirPopup($scope.idModalPagoDeuda);
		}

		$scope.cerrarPopupPagoDeuda = function () {
			$scope.cerrarPopup($scope.idModalPagoDeuda);
		}

		$scope.efectuarPagoVencimientoCredito = function (pago) {
			blockUI.start();
			VentaEmpresaDatos.update({ id: $scope.venta.id, id_empresa: $scope.usuario.id_empresa }, { pago: pago, id_usuario_cajero: $scope.usuario.id }, function (data) {
				$scope.mostrarMensaje(data.mensaje);
				$scope.cerrarPopup($scope.idModalPagoP);
				$scope.imprimirReciboVencimientoCredito(data, data.venta, pago);
				$scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosCreditos.length;
				$scope.verificarVencimientosCreditos($scope.usuario.id_empresa);
				blockUI.stop();
			}, function (error) {
				$scope.mostrarMensaje(error);
				$scope.cerrarPopup($scope.idModalPagoP);
				$scope.obtenerVentas();
				blockUI.stop();
			});
		}

		$scope.efectuarPagoVencimientoDeuda = function (pago) {
			blockUI.start();
			Compra.update({ id: $scope.compra.id }, { pago: pago, id_usuario_cajero: $scope.usuario.id }, function (data) {
				$scope.mostrarMensaje(data.mensaje);
				$scope.cerrarPopup($scope.idModalPagoDeuda);
				$scope.imprimirReciboVencimientoDeuda(data, data.compra, pago);
				$scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosDeudas.length;
				$scope.verificarVencimientosDeudas($scope.usuario.id_empresa);
				blockUI.stop();
			}, function (error) {
				$scope.mostrarMensaje(error);
				$scope.cerrarPopup($scope.idModalPagoDeuda);
				$scope.obtenerCompras();
				blockUI.stop();
			});
		}

		$scope.imprimirReciboVencimientoCredito = function (data, venta, pago) {
			blockUI.start();
			var doc = new PDFDocument({ size: [227, 353], margin: 10 });
			var stream = doc.pipe(blobStream());
			doc.moveDown(2);
			doc.font('Helvetica-Bold', 8);
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.font('Helvetica', 7);
			doc.text(venta.almacen.sucursal.nombre.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.text(venta.almacen.sucursal.direccion.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			var telefono = (venta.almacen.sucursal.telefono1 != null ? venta.almacen.sucursal.telefono1 : "") +
				(venta.almacen.sucursal.telefono2 != null ? "-" + venta.almacen.sucursal.telefono2 : "") +
				(venta.almacen.sucursal.telefono3 != null ? "-" + venta.almacen.sucursal.telefono3 : "");
			doc.text("TELF.: " + telefono, { align: 'center' });
			doc.moveDown(0.4);
			doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
			doc.moveDown(0.5);
			doc.font('Helvetica-Bold', 8);
			doc.text("RECIBO", { align: 'center' });
			doc.font('Helvetica', 7);
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			doc.text(venta.almacen.sucursal.nota_recibo_correlativo, { align: 'center' });
			//doc.text("NIT: "+$scope.usuario.empresa.nit,{align:'center'});

			//doc.text("FACTURA No: "+venta.factura,{align:'center'});
			doc.moveDown(0.4);
			//doc.text("AUTORIZACIÓN No: "+venta.autorizacion,{align:'center'});
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			//doc.text(venta.actividad.nombre,{align:'center'});
			doc.moveDown(0.6);
			var date = new Date();
			doc.text("FECHA : " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), { align: 'left' });
			doc.moveDown(0.4);
			doc.text("He recibido de : " + $scope.venta.cliente.razon_social, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.2);
			doc.text("       CONCEPTO                                   ", { align: 'left' });
			doc.moveDown(0.2);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			venta.fecha = new Date(venta.fecha);
			doc.text("Fecha: " + venta.fecha.getDate() + "/" + (venta.fecha.getMonth() + 1) + "/" + venta.fecha.getFullYear(), 15, 210);
			var textoFact = $scope.venta.movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ? "Factura nro. " + $scope.venta.factura : "Proforma nro. " + $scope.venta.factura;
			doc.text(textoFact, 105, 210, { width: 100 });
			doc.text("Saldo Bs " + (venta.saldo - pago) + ".-", 105, 220, { width: 100 });
			doc.text("Bs " + pago + ".-", 170, 210, { width: 100 });

			doc.text("--------------", 10, 230, { align: 'right' });
			//oc.text("--------------------",{align:'right'});
			doc.moveDown(0.3);
			doc.text("TOTAL Bs.              " + pago.toFixed(2), { align: 'right' });
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.text("SON: " + data.pago, { align: 'left' });
			doc.moveDown(0.6);

			doc.moveDown(0.4);

			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);

			doc.text("-------------------------                       -------------------------", { align: 'center' });
			doc.text("ENTREGUE CONFORME            RECIBI CONFORME", { align: 'center' });
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		$scope.imprimirReciboVencimientoDeuda = function (data, compra, pago) {
			blockUI.start();
			var doc = new PDFDocument({ size: [227, 353], margin: 10 });
			var stream = doc.pipe(blobStream());
			doc.moveDown(2);
			doc.font('Helvetica-Bold', 8);
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.font('Helvetica', 7);
			doc.text(compra.almacen.sucursal.nombre.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.text(compra.almacen.sucursal.direccion.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			var telefono = (compra.almacen.sucursal.telefono1 != null ? compra.almacen.sucursal.telefono1 : "") +
				(compra.almacen.sucursal.telefono2 != null ? "-" + compra.almacen.sucursal.telefono2 : "") +
				(compra.almacen.sucursal.telefono3 != null ? "-" + compra.almacen.sucursal.telefono3 : "");
			doc.text("TELF.: " + telefono, { align: 'center' });
			doc.moveDown(0.4);
			doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
			doc.moveDown(0.5);
			doc.font('Helvetica-Bold', 8);
			doc.text("PAGO", { align: 'center' });
			doc.font('Helvetica', 7);
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			//doc.text("NIT: "+$scope.usuario.empresa.nit,{align:'center'});
			doc.moveDown(0.4);
			doc.text(compra.almacen.sucursal.nota_recibo_correlativo, { align: 'center' });
			doc.moveDown(0.4);
			//doc.text("AUTORIZACIÓN No: "+venta.autorizacion,{align:'center'});
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			//doc.text(venta.actividad.nombre,{align:'center'});
			doc.moveDown(0.6);
			var date = new Date();
			doc.text("FECHA : " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), { align: 'left' });
			doc.moveDown(0.4);
			doc.text("Pagado a : " + $scope.compra.proveedor.razon_social, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.2);
			doc.text("       CONCEPTO                                   ", { align: 'left' });
			doc.moveDown(0.2);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			compra.fecha = new Date(compra.fecha);
			doc.text("Fecha: " + compra.fecha.getDate() + "/" + (compra.fecha.getMonth() + 1) + "/" + compra.fecha.getFullYear(), 15, 210);
			var textoFact = $scope.compra.factura;
			doc.text(textoFact, 105, 210, { width: 100 });
			doc.text("Bs " + pago + ".-", 170, 210, { width: 100 });

			doc.text("--------------", 10, 230, { align: 'right' });
			//oc.text("--------------------",{align:'right'});
			doc.moveDown(0.3);
			doc.text("TOTAL Bs.              " + pago.toFixed(2), { align: 'right' });
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.text("SON: " + data.pago, { align: 'left' });
			doc.moveDown(0.6);

			doc.moveDown(0.4);

			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);

			doc.text("-------------------------                       -------------------------", { align: 'center' });
			doc.text("ENTREGUE CONFORME            RECIBI CONFORME", { align: 'center' });
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		$scope.abrirVentanaDescuento = function (inventario) {
			$scope.productoVenc = inventario.producto;
			$scope.abrirPopup($scope.idModalDescuento);
		}

		$scope.guardarDecuento = function (productoVenc) {
			Producto.update({ idProducto: productoVenc.id }, productoVenc, function (res) {
				$scope.cerrarVentanaDescuento();
				$scope.mostrarMensaje('Actualizado Exitosamente!');
			});
		}

		$scope.cerrarVentanaDescuento = function () {
			$scope.cerrarPopup($scope.idModalDescuento);
		}

		$scope.guardarBaja = function (bajaInventario) {
			bajaInventario.fecha = new Date($scope.convertirFecha(bajaInventario.fechaTexto));
			blockUI.start();
			var movimiento = bajaInventario.movimiento.nombre_corto;
			bajaInventario.$save(function (res) {
				$scope.vencimientoTotal = $scope.vencimientoTotal - $scope.vencimientosProductos.length;
				$scope.verificarVencimientosProductos($scope.usuario.id_empresa);
				blockUI.stop();
				$scope.bajaInventario = null;
				$scope.mostrarMensaje('Baja registrada exitosamente!');
				ImprimirSalida(movimiento, bajaInventario, true, $scope.usuario);
			}, function (error) {
				blockUI.stop();
				$scope.bajaInventario = null;
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
			});
		}

		$scope.mostrarMensaje = function (mensaje) {
			$scope.mensaje = mensaje;
			var dialog = $("#mensaje").removeClass('hide').dialog({
				modal: true,
				title_html: true,
				width: "40%",
				height: 190
			});
		}

		$scope.cerrarConfirmacion = function () {
			$("#mensaje").dialog('close');
		}

		$scope.abrirPopupConfirmacionEliminacion = function (funcionEliminacion, dataParam) {
			var dialog = $("#confirmacion-eliminacion").removeClass('hide').dialog({
				modal: true,
				title_html: true,
				width: "40%",
				height: 190
			});
			$scope.funcionEliminacion = funcionEliminacion;
			$scope.dataParam = dataParam;
		}

		$scope.cerrarConfirmacionEliminacion = function () {
			$("#confirmacion-eliminacion").dialog('close');
		}

		$scope.accionarEliminacion = function () {
			$scope.funcionEliminacion($scope.dataParam);
		}

		$scope.cerrarSesion = function () {
			Sesion.cerrarSesion(function () {
				$scope.user = {};
				$location.path("/");
				$window.location.reload();
				$scope.token = $localStorage.token;
				$scope.usuario = $localStorage.usuario;
				$scope.abrirPopup($scope.idModalInicioSesion);
			}, function () {
				alert("Failed to logout!");
			});
		}

		$scope.crearPopup = function (idPopup, idImagen) {
			crearPopup(idPopup, idImagen);
		}

		$scope.abrirPopup = function (idPopup) {
			abrirPopup(idPopup);
		}

		$scope.cerrarPopup = function (idPopup) {
			ocultarPopup(idPopup);
		}

		$scope.eliminarPopup = function (idPopup) {
			eliminarPopup(idPopup);
		}

		$scope.convertirFecha = function (fecha) {
			return convertirFecha(fecha);
		}
		$scope.sumaFecha = function (dias, fecha) {
			return sumaFecha(dias, fecha);
		}

		$scope.aplicarTabla = function (idTabla, columnas) {
			setTimeout(function () {
				ejecutarScriptsTabla(idTabla, columnas);
			}, 2000);
		}

		$scope.ocultarMensajesValidacion = function () {
			$(".ketchup-error").css('display', 'none');
		}

		$scope.obtenerDiaActual = function () {
			var diaActual = new Date().getDay();
			var res;
			if (diaActual == 0) {
				res = $scope.diccionario.DIA_DOMINGO;
			} else if (diaActual == 1) {
				res = $scope.diccionario.DIA_LUNES;
			} else if (diaActual == 2) {
				res = $scope.diccionario.DIA_MARTES;
			} else if (diaActual == 3) {
				res = $scope.diccionario.DIA_MIERCOLES;
			} else if (diaActual == 4) {
				res = $scope.diccionario.DIA_JUEVES;
			} else if (diaActual == 5) {
				res = $scope.diccionario.DIA_VIERNES;
			} else if (diaActual == 6) {
				res = $scope.diccionario.DIA_SABADO;
			}
			return res;
		}
		$scope.verificarDescuentos = function (detalles) {
			var existe = false;
			for (var i = 0; i < detalles.length; i++) {
				if (detalles[i].descuento > 0 || detalles[i].recargo > 0 || detalles[i].ice > 0 || detalles[i].excento > 0) {
					existe = true;
				}
			}
			return existe;
		}

		$scope.imprimirVenta = function (venta) {
			var promesa = DatosVenta(venta.id, $scope.usuario.id_empresa);
			promesa.then(function (datos) {
				var ventaConsultada = datos.venta;
				ventaConsultada.configuracion = datos.configuracion;
				ventaConsultada.sucursal = datos.sucursal;
				ventaConsultada.numero_literal = datos.numero_literal;
				var fecha = new Date(ventaConsultada.fecha);
				ventaConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
				ImprimirSalida(ventaConsultada.movimiento.clase.nombre_corto, ventaConsultada, false, $scope.usuario);
			});
		}

		$scope.imprimirCompra = function (compra) {
			var promesa = DatosCompra(compra.id, $scope.usuario.id_empresa);
			promesa.then(function (datos) {
				var compraConsultada = datos.compra;
				compraConsultada.configuracion = datos.configuracion;
				compraConsultada.sucursal = datos.sucursal;
				compraConsultada.numero_literal = datos.numero_literal;
				var fecha = new Date(compraConsultada.fecha);
				compraConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();


				$scope.imprimirFacturaRolloCompra(compraConsultada);

			});
		}

		$scope.loadData = function () {
			$http.get('recursos/data.json').success(function (data) {
				$scope.menu_items = data.menu_items;
				$scope.skin = data.skin;
				$scope.app_name = data.app_name;
				$scope.paragrahp_1 = data.paragrahp_1;
				$scope.paragrahp_2 = data.paragrahp_2;
				$scope.username_label = data.username_label;
				$scope.password_label = data.password_label;
				$scope.missing_password_label = data.missing_password_label;
			});
		}


		$scope.imprimirFacturaRolloCompra = function (compra) {
			var alto;
			if (compra.detallesCompra.length <= 2) {
				alto = 570;
			} else {
				alto = 570 + (20 * (compra.detallesCompra.length - 2))
			}
			papel = [227, alto];
			var doc = new PDFDocument({ size: papel, margin: 10 });
			var stream = doc.pipe(blobStream());


			doc.moveDown(2);
			doc.font('Helvetica-Bold', 8);
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.font('Helvetica', 7);
			doc.text(compra.almacen.sucursal.nombre.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.text(compra.almacen.sucursal.direccion.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			var telefono = (compra.almacen.sucursal.telefono1 != null ? compra.almacen.sucursal.telefono1 : "") +
				(compra.almacen.sucursal.telefono2 != null ? "-" + compra.almacen.sucursal.telefono2 : "") +
				(compra.almacen.sucursal.telefono3 != null ? "-" + compra.almacen.sucursal.telefono3 : "");
			doc.text("TELF.: " + telefono, { align: 'center' });
			doc.moveDown(0.4);
			doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
			doc.moveDown(0.5);
			doc.font('Helvetica-Bold', 8);
			doc.text("NORMAL", { align: 'center' });
			doc.font('Helvetica', 7);
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			doc.text("Nro.  " + compra.factura, { align: 'center' });
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			doc.text(compra.tipoPago.nombre_corto, { align: 'center' });
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.6);
			doc.text("FECHA : " + compra.fechaTexto, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("SEÑOR(ES) : " + compra.proveedor.razon_social, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("NIT/CI : " + compra.proveedor.nit, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.2);
			doc.text("CANT   CONCEPTO                                   P. UNIT.    SUBTOTAL", { align: 'left' });
			doc.moveDown(0.2);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			var y = doc.y, sumaDescuento = 0, sumaRecargo = 0, sumaIce = 0, sumaExcento = 0;
			for (var i = 0; i < compra.detallesCompra.length; i++) {
				doc.text(compra.detallesCompra[i].cantidad, 15, y);
				doc.text(compra.detallesCompra[i].producto.nombre, 35, y, { width: 100 });

				doc.text(compra.detallesCompra[i].costo_unitario.toFixed(2), 145, y);
				doc.text(compra.detallesCompra[i].importe.toFixed(2), 180, y);
				sumaDescuento = sumaDescuento + (compra.detallesCompra[i].tipo_descuento ? (compra.detallesCompra[i].importe * (compra.detallesCompra[i].descuento / 100)) : compra.detallesCompra[i].descuento);
				sumaRecargo = sumaRecargo + (compra.detallesCompra[i].tipo_recargo ? (compra.detallesCompra[i].importe * (compra.detallesCompra[i].recargo / 100)) : compra.detallesCompra[i].recargo);
				sumaIce = sumaIce + compra.detallesCompra[i].ice;
				sumaExcento = sumaExcento + compra.detallesCompra[i].excento;
				y = y + 20;
			}
			doc.text("--------------", 10, y, { align: 'right' });
			//oc.text("--------------------",{align:'right'});
			doc.moveDown(0.4);
			doc.text("IMPORTE TOTAL Bs.              " + compra.importe.toFixed(2), { align: 'right' });
			doc.moveDown(0.3);
			if (sumaDescuento > 0) {
				doc.text("DESCUENTO Bs.              " + sumaDescuento.toFixed(2), { align: 'right' });
			}
			doc.moveDown(0.3);
			if (sumaRecargo > 0) {
				doc.text("RECARGO Bs.              " + sumaRecargo.toFixed(2), { align: 'right' });
			}
			doc.moveDown(0.3);
			if (sumaIce > 0) {
				doc.text("ICE Bs.              " + sumaIce.toFixed(2), { align: 'right' });
			}
			doc.moveDown(0.3);
			if (sumaExcento > 0) {
				doc.text("EXCENTO Bs.              " + sumaExcento.toFixed(2), { align: 'right' });
			}
			doc.moveDown(0.3);
			doc.text("TOTAL Bs.              " + compra.total.toFixed(2), { align: 'right' });
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.text("SON: " + compra.numero_literal, { align: 'left' });
			doc.moveDown(0.6);
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.text("usuario : " + $scope.usuario.nombre_usuario, 0, y + 205, { align: 'right' });
			doc.moveDown(0.4);
			doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 10, y + 215, { align: 'right' });
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();
		}

		$scope.abrirDialogConceptoEdicion = function (tipo) {
			$scope.tipo_edicion = tipo;
			$scope.clase = {};
			$scope.abrirPopup($scope.idModalConceptoEdicion);
		}
		$scope.cerrarDialogConceptoEdicion = function () {
			$scope.cerrarPopup($scope.idModalConceptoEdicion);
		}

		$scope.agregarConceptoEdicion = function (clase) {
			if (clase.nombre && clase.nombre_corto) {
				if ($scope.tipo_edicion.clases.indexOf(clase) == -1) {
					$scope.tipo_edicion.clases.push(clase);
				}
				$scope.clase = {}
			}
		}

		$scope.modificarConceptoEdicion = function (clase) {
			$scope.clase = clase;
		}

		$scope.removerConceptoEdicion = function (clase) {
			clase.eliminado = true;
		}

		$scope.guardarConceptoEdicion = function (tipo) {
			blockUI.start();
			Tipos.update({ id_tipo: tipo.id }, tipo, function (res) {
				var promesa = ClasesTipo(tipo.nombre_corto);
				promesa.then(function (entidad) {
					tipo = entidad
					blockUI.stop();
					$scope.cerrarDialogConceptoEdicion();
					$scope.mostrarMensaje('Guardado Exitosamente!');
				});
			});
		}

		$scope.inicio = function () {
			$scope.loadData();
			$rootScope.abs = $window.Math.abs;
			if ($localStorage.usuario) {
				$scope.usuario = JSON.parse($localStorage.usuario);
				if (!$scope.aplicaciones) {
					$scope.cargarPagina();
				}
			} else {
				$scope.abrirPopup($scope.idModalInicioSesion);
			}
		}
		$scope.fechaATexto = function (fecha) {
			fech = new Date(fecha)
			fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
			return fecha
			// $scope.fechaAplicacionVacuna = new Date(convertirFecha(fecha))
		}

	});