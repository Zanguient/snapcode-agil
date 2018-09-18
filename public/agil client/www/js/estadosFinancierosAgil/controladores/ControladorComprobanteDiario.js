angular.module('agil.controladores')

	.controller('ControladorComprobanteDiario', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipoEmpresa, ClasesTipo, ObtenerConfiguracionImpresion, CuentasContabilidadEEFF, ObtenerGestionesEEFF,
		TodosComprobante) {


		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerTiposPeriodos()
			$scope.obtenerGestiones()
			$scope.obtenerTiposCuenta()
			$scope.obtenerConfiguracionImpresion()
			$scope.obtenerGestionesImpresion();
			$scope.bimonetario = false;
		}


		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));

			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});

		$scope.obtenerTiposPeriodos = function () {
			blockUI.start();
			var promesa = ClasesTipo("EEFF_TP");
			promesa.then(function (entidad) {
				$scope.TiposPeriodos = entidad
				blockUI.stop();
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
		$scope.obtenerConfiguracionImpresion = function () {
			var promesa = ObtenerConfiguracionImpresion($scope.usuario.id_empresa)
			promesa.then(function (dato) {
				$scope.configuracionImpresion = dato
				$scope.configuracionImpresion.bimonetario = true
				$scope.configuracionImpresion.tioPeriodo = ""
				$scope.configuracionImpresion.gestion = ""
				$scope.configuracionImpresion.gestion_fin = ""
				$scope.configuracionImpresion.mes = ""
				$scope.configuracionImpresion.fecha_inicio = null
				$scope.configuracionImpresion.fecha_fin = null
				blockUI.stop()
			})
		}
		$scope.cargarFechasFiltro = function (filtro) {
			if (filtro == 'FECHAS') {
				setTimeout(function () {
					aplicarDatePickers();
				}, 300);
			}
		}
		$scope.obtenerTiposCuenta = function () {
			blockUI.start();
			var promesa = ClasesTipo("TCC");
			promesa.then(function (entidad) {
				$scope.cuentaTipos = [{ id: 0, nombre: "PREESTABLECIDO" }]
				$scope.cuentaTipos = $scope.cuentaTipos.concat(entidad.clases);
				blockUI.stop();
			});
		}
		$scope.obtenerGestionesImpresion = function () {
			blockUI.start()
			$scope.gestionesEF = []
			var promesa = ObtenerGestionesEEFF($scope.usuario.id_empresa)
			promesa.then(function (datos) {
				blockUI.stop();
				datos.forEach(function (dato) {
					if (dato.habilitado) {
						$scope.fechasImpresion = dato
					}
				})

			})
		}
		$scope.generarPdfBalanceGeneral = function () {
			blockUI.start();
			if ($scope.configuracionImpresion.fecha_inicio) {
				$scope.configuracionImpresion.inicio2 = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio))
				$scope.configuracionImpresion.fin2 = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin))
			}
			$scope.configuracionImpresion.fechasImpresion = $scope.fechasImpresion
			var promesa = CuentasContabilidadEEFF($scope.configuracionImpresion, $scope.usuario.id_empresa);
			promesa.then(function (dato) {
				if (dato.monedaCambio) {
					$scope.moneda = dato.monedaCambio;

				} else {
					$scope.moneda = { ufv: "--", dolar: "--" }
				}
				dato.arregloActivos = []
				dato.arregloActivosFijos = []
				dato.arregloPasivos = []
				dato.arregloPatrimonio = []
				dato.arregloIngreso = []
				dato.arregloEgreso = []
				dato.arregleCostos = []
				var totalActivos = 0
				if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
					dato.arregloPasivos = dato.arregloPasivos.concat(dato.arregloPatrimonio);
					var x = ($scope.configuracionImpresion.bimonetario) ? 400 : 530
					if ($scope.configuracionImpresion.tipo_cuenta.nombre == "PREESTABLECIDO") {
						$scope.generarPdfPreestablecido(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
						$scope.generarPdfPreestablecido(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
						$scope.generarPdfGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
						$scope.generarPdfsubGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
						$scope.generarPdfApropiacion(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					}
				} else {
					var cuentasGrupo = []
					var cuentasSubGrupo = [],
						cuentasGenericas = [],
						cuentasApropiacion = [],
						cuentasSubGrupoFijo = [],
						cuentasGenericasFijo = [],
						cuentasApropiacionFijo = [];
					dato.primero.cuentasGrupo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGrupo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGrupo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGrupo.length; i++) {
									var element = cuentasGrupo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasSubGrupo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasSubGrupo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasSubGrupo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasSubGrupo.length; i++) {
									var element = cuentasSubGrupo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasGenericas.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGenericas.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGenericas.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGenericas.length; i++) {
									var element = cuentasGenericas[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasApropiacion.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasApropiacion.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasApropiacion.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasApropiacion.length; i++) {
									var element = cuentasApropiacion[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasSubGrupoFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasSubGrupoFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasSubGrupoFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasSubGrupoFijo.length; i++) {
									var element = cuentasSubGrupoFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasGenericasFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGenericasFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGenericasFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGenericasFijo.length; i++) {
									var element = cuentasGenericasFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasApropiacionFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasApropiacionFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasApropiacionFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasApropiacionFijo.length; i++) {
									var element = cuentasApropiacionFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					var x = ($scope.configuracionImpresion.bimonetario) ? 290 : 310
					if ($scope.configuracionImpresion.tipo_cuenta.nombre == "PREESTABLECIDO") {
						$scope.generarPdfComprobantePreestablecido(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion, cuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
						$scope.generarPdfComprobantePreestablecido(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
						$scope.generarPdfComparativoGrupo(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
						$scope.generarPdfComparativosubGrupo(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
						$scope.generarPdfComparativoApropiacion(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					}
					blockUI.stop();
				}
			})
		}
		$scope.generarExelBalanceGeneral = function () {
			blockUI.start();
			if ($scope.configuracionImpresion.fecha_inicio) {
				$scope.configuracionImpresion.inicio2 = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio))
				$scope.configuracionImpresion.fin2 = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin))
			}
			$scope.configuracionImpresion.fechasImpresion = $scope.fechasImpresion
			var promesa = CuentasContabilidadEEFF($scope.configuracionImpresion, $scope.usuario.id_empresa);
			promesa.then(function (dato) {
				if (dato.monedaCambio) {
					$scope.moneda = dato.monedaCambio;

				} else {
					$scope.moneda = { ufv: "--", dolar: "--" }
				}
				dato.arregloActivos = []
				dato.arregloActivosFijos = []
				dato.arregloPasivos = []
				dato.arregloPatrimonio = []
				dato.arregloIngreso = []
				dato.arregloEgreso = []
				dato.arregleCostos = []
				var totalActivos = 0
				if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
					dato.arregloPasivos = dato.arregloPasivos.concat(dato.arregloPatrimonio);
					var x = ($scope.configuracionImpresion.bimonetario) ? 400 : 530
					if ($scope.configuracionImpresion.tipo_cuenta.nombre == "PREESTABLECIDO") {
						$scope.generarExelAPreestablecido(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
						$scope.generarExelAPreestablecido(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
						$scope.generarExelGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
						$scope.generarExelSubGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
						$scope.generarExelApropiacion(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					}
				} else {
					var cuentasGrupo = []
					var cuentasSubGrupo = [],
						cuentasGenericas = [],
						cuentasApropiacion = [],
						cuentasSubGrupoFijo = [],
						cuentasGenericasFijo = [],
						cuentasApropiacionFijo = [];
					dato.primero.cuentasGrupo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGrupo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGrupo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGrupo.length; i++) {
									var element = cuentasGrupo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasSubGrupo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasSubGrupo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasSubGrupo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasSubGrupo.length; i++) {
									var element = cuentasSubGrupo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasGenericas.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGenericas.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGenericas.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGenericas.length; i++) {
									var element = cuentasGenericas[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasApropiacion.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasApropiacion.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasApropiacion.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasApropiacion.length; i++) {
									var element = cuentasApropiacion[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasSubGrupoFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasSubGrupoFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasSubGrupoFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasSubGrupoFijo.length; i++) {
									var element = cuentasSubGrupoFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasGenericasFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGenericasFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGenericasFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGenericasFijo.length; i++) {
									var element = cuentasGenericasFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasApropiacionFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasApropiacionFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasApropiacionFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasApropiacionFijo.length; i++) {
									var element = cuentasApropiacionFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					var x = ($scope.configuracionImpresion.bimonetario) ? 290 : 310
					if ($scope.configuracionImpresion.tipo_cuenta.nombre == "PREESTABLECIDO") {
						$scope.generarExelComprobantePreestablecido(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion, cuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
						$scope.generarExelComprobantePreestablecido(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
						$scope.generarExelComparativoGrupo(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
						$scope.generarExelComparativosubGrupo(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
						$scope.generarExelComparativoApropiacion(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					}
					blockUI.stop();
				}
			})
		}
		$scope.generarWordBalanceGeneral = function () {
			blockUI.start();
			if ($scope.configuracionImpresion.fecha_inicio) {
				$scope.configuracionImpresion.inicio2 = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio))
				$scope.configuracionImpresion.fin2 = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin))
			}
			$scope.configuracionImpresion.fechasImpresion = $scope.fechasImpresion
			var promesa = CuentasContabilidadEEFF($scope.configuracionImpresion, $scope.usuario.id_empresa);
			promesa.then(function (dato) {
				if (dato.monedaCambio) {
					$scope.moneda = dato.monedaCambio;

				} else {
					$scope.moneda = { ufv: "--", dolar: "--" }
				}
				if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
					var x = ($scope.configuracionImpresion.bimonetario) ? 400 : 530
					if ($scope.configuracionImpresion.tipo_cuenta.nombre == "PREESTABLECIDO") {
						$scope.descargarArchivo($scope.generarWordPreestablecido(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion), "reporte-balance-general.doc");
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
						$scope.descargarArchivo($scope.generarWordPreestablecido(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion), "reporte-balance-general.doc");
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
						$scope.descargarArchivo($scope.generarWordGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion), "reporte-balance-general.doc");
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
						$scope.descargarArchivo($scope.generarWordSubGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion), "reporte-balance-general.doc");
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
						$scope.descargarArchivo($scope.generarWordApropiacion(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion), "reporte-balance-general.doc");
					}
				} else {
					var cuentasGrupo = []
					var cuentasSubGrupo = [],
						cuentasGenericas = [],
						cuentasApropiacion = [],
						cuentasSubGrupoFijo = [],
						cuentasGenericasFijo = [],
						cuentasApropiacionFijo = [];
					dato.primero.cuentasGrupo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGrupo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGrupo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGrupo.length; i++) {
									var element = cuentasGrupo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasSubGrupo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasSubGrupo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasSubGrupo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasSubGrupo.length; i++) {
									var element = cuentasSubGrupo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasGenericas.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGenericas.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGenericas.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGenericas.length; i++) {
									var element = cuentasGenericas[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasApropiacion.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasApropiacion.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasApropiacion.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasApropiacion.length; i++) {
									var element = cuentasApropiacion[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasSubGrupoFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasSubGrupoFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasSubGrupoFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasSubGrupoFijo.length; i++) {
									var element = cuentasSubGrupoFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasGenericasFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasGenericasFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasGenericasFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasGenericasFijo.length; i++) {
									var element = cuentasGenericasFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					dato.primero.cuentasApropiacionFijo.forEach(function (cuenta, index, array) {
						var datos2 = {}
						datos2.primerAno = cuenta
						cuentasApropiacionFijo.push(datos2)
						if (index === (array.length - 1)) {
							dato.segundo.cuentasApropiacionFijo.forEach(function (cuenta, index, array) {
								for (var i = 0; i < cuentasApropiacionFijo.length; i++) {
									var element = cuentasApropiacionFijo[i];
									if (element.primerAno.id == cuenta.id) {
										element.segundoAno = cuenta
									}
								}
							})
						}
					})
					var x = ($scope.configuracionImpresion.bimonetario) ? 290 : 310
					if ($scope.configuracionImpresion.tipo_cuenta.nombre == "PREESTABLECIDO") {
						$scope.generarWordComprobantePreestablecido(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion, cuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
						$scope.generarWordComprobantePreestablecido(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
						$scope.generarWordComparativoGrupo(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
						$scope.generarWordComparativosubGrupo(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
						$scope.generarWordComparativoApropiacion(dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacioncuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
					}
					blockUI.stop();
				}
			})
		}
		$scope.generarPdfApropiacion = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion) {

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var datos = cuentasSubGrupo.length + cuentasGenericas.length + cuentasApropiacion.length
			var datosPasivo = []
			var y = 130, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			var totalActivos = 0
			var totalPasivo = 0
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < cuentasSubGrupo.length && items <= itemsPorPagina; i++) {
				cuenta = cuentasSubGrupo[i]
				cuenta.total = 0

				if (cuenta.clasificacion.nombre === "Activo") {
					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 140;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
						doc.font('Helvetica', 8);
					}
					doc.text(cuenta.nombre, 30, y)
					/*doc.text(number_format(cuenta.saldo,2), 530, y); */
					/* total+=cuenta.saldo */
					y = y + 20;
					items++;

					for (var L = 0; L < cuentasGenericas.length && items <= itemsPorPagina; L++) {
						cuenta3 = cuentasGenericas[L]

						var cod = String(cuenta3.codigo).substr(0, 3)
						if (cuenta.codigo == cod) {
							if (cuentasApropiacion.some(function (cuenta2) {
								var cod = String(cuenta2.codigo).substr(0, 5)
								if (cuenta3.codigo == cod) {
									return true
								} else {
									return false
								}
							})) {
								doc.text(cuenta3.nombre, 40, y)
								y = y + 20;
								items++;


								for (var p = 0; p < cuentasApropiacion.length && items <= itemsPorPagina; p++) {
									cuenta2 = cuentasApropiacion[p]

									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta3.codigo == cod) {
										doc.text(cuenta2.nombre, 60, y)
										doc.text(number_format(cuenta2.saldo, 2), x, y);
										var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
										if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
										cuenta.total += cuenta2.saldo
										totalActivos += cuenta2.saldo
										y = y + 20;
										items++;
										if (items == itemsPorPagina) {
											doc.addPage({ margin: 0, bufferPages: true });
											y = 140;
											items = 0;
											pagina = pagina + 1;
											$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
											doc.font('Helvetica', 8);
										}
									} else {
										if (items == itemsPorPagina) {
											doc.addPage({ margin: 0, bufferPages: true });
											y = 140;
											items = 0;
											pagina = pagina + 1;
											$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
											doc.font('Helvetica', 8);
										}
									}


								}
							}
						} else {
							if (items == itemsPorPagina) {
								doc.addPage({ margin: 0, bufferPages: true });
								y = 140;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
								doc.font('Helvetica', 8);
							}
						}



					}
					doc.text("TOTAL " + cuenta.nombre, 90, y);
					doc.text(number_format(cuenta.total, 2), x, y);
					var cuentatotalSus = cuenta.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
					y = y + 20;
					items++;
					if (i === (cuentasSubGrupo.length - 1)) {
						$scope.DibujarFijoApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
						//$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
					/* 	y = y + 20;
						items++; */
				} else {
					if (i === (cuentasSubGrupo.length - 1)) {
						$scope.DibujarFijoApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
						//$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
				}

			}
			if ($scope.configuracionImpresion.usar_firma_uno) {
				doc.text($scope.configuracionImpresion.firma_uno, 170, 720);
				doc.text($scope.configuracionImpresion.cargo_uno, 170, 730);
			}
			if ($scope.configuracionImpresion.usar_firma_dos) {
				doc.text($scope.configuracionImpresion.firma_dos, 370, 720);
				doc.text($scope.configuracionImpresion.cargo_dos, 370, 730);
			}

			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}
		$scope.DibujarFijoApropiacion = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {

				doc.font('Helvetica', 8);
				for (var i = 0; i < dato.cuentasSubGrupoFijo.length && items <= itemsPorPagina; i++) {
					cuenta = dato.cuentasSubGrupoFijo[i]
					cuenta.total = 0

					if (cuenta.clasificacion.nombre === "Activo") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
							doc.font('Helvetica', 8);
						}
						doc.text(cuenta.nombre, 30, y)
						/*doc.text(number_format(cuenta.saldo,2), 530, y); */
						/* total+=cuenta.saldo */
						y = y + 20;
						items++;

						for (var L = 0; L < dato.cuentasGenericasFijo.length && items <= itemsPorPagina; L++) {
							cuenta3 = dato.cuentasGenericasFijo[L]
							if (cuenta3.tipoCuenta.nombre_corto === "3") {
								var cod = String(cuenta3.codigo).substr(0, 3)
								if (cuenta.codigo == cod) {
									if (dato.cuentasApropiacionFijo.some(function (cuenta2) {
										var cod = String(cuenta2.codigo).substr(0, 5)
										if (cuenta3.codigo == cod) {
											return true
										} else {
											return false
										}
									})) {
										doc.text(cuenta3.nombre, 40, y)
										y = y + 20;
										items++;


										for (var p = 0; p < dato.cuentasApropiacionFijo.length && items <= itemsPorPagina; p++) {
											cuenta2 = dato.cuentasApropiacionFijo[p]
											if (cuenta2.tipoCuenta.nombre_corto === "4") {
												var cod = String(cuenta2.codigo).substr(0, 5)
												if (cuenta3.codigo == cod) {
													doc.text(cuenta2.nombre, 60, y)
													doc.text(number_format(cuenta2.saldo, 2), x - 80, y);
													var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
													if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 65, y);
													/* cuenta.total += cuenta2.saldo
													totalActivos += cuenta2.saldo */
													y = y + 20;
													items++;
													for (var S = 0; S < dato.cuentasApropiacionFijo.length && items <= itemsPorPagina; S++) {
														cuenta5 = dato.cuentasApropiacionFijo[S]
														if (cuenta5.tipoCuenta.nombre_corto === "4") {
															var cod = String(cuenta5.codigo).substr(4)
															var codDos = String(cuenta2.codigo).substr(4)
															if (codDos == cod && cuenta5.clasificacion.nombre === "Pasivo") {
																doc.text(cuenta5.nombre, 60, y)
																doc.text("(" + number_format(cuenta5.saldo, 2) + ")", x - 80, y);
																var totalSumado = cuenta2.saldo - cuenta5.saldo
																doc.text(number_format((totalSumado), 2), x, y);
																var saldoSus = cuenta5.saldo / $scope.moneda.dolar;
																var saldoSusTotal = totalSumado / $scope.moneda.dolar;
																if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 65, y);
																if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSusTotal, 2), x + 130, y);
																cuenta.total += totalSumado
																totalActivos += totalSumado
																y = y + 20;
																items++;
																if (items == itemsPorPagina) {
																	doc.addPage({ margin: 0, bufferPages: true });
																	y = 140;
																	items = 0;
																	pagina = pagina + 1;
																	$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																	doc.font('Helvetica', 8);
																}
															} else {
																if (items == itemsPorPagina) {
																	doc.addPage({ margin: 0, bufferPages: true });
																	y = 140;
																	items = 0;
																	pagina = pagina + 1;
																	$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																	doc.font('Helvetica', 8);
																}
															}
														} else {
															if (items == itemsPorPagina) {
																doc.addPage({ margin: 0, bufferPages: true });
																y = 140;
																items = 0;
																pagina = pagina + 1;
																$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																doc.font('Helvetica', 8);
															}
														}


													}
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 140;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												} else {
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 140;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
													doc.font('Helvetica', 8);
												}
											}


										}
									}
								} else {
									if (items == itemsPorPagina) {
										doc.addPage({ margin: 0, bufferPages: true });
										y = 140;
										items = 0;
										pagina = pagina + 1;
										$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
										doc.font('Helvetica', 8);
									}
								}
							} else {
								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 140;
									items = 0;
									pagina = pagina + 1;
									$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
									doc.font('Helvetica', 8);
								}
							}


						}
						doc.text("TOTAL " + cuenta.nombre, 90, y);
						doc.text(number_format(cuenta.total, 2), x, y);
						var cuentatotalSus = cuenta.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						y = y + 20;
						items++;
						if (i === (dato.cuentasSubGrupoFijo.length - 1)) {
							$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (dato.cuentasSubGrupoFijo.length - 1)) {
							$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
					}

				}
			} else {

			}
		}
		$scope.DibujarFijoPreestablecido = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {


			doc.font('Helvetica', 8);
			for (var i = 0; i < dato.cuentasSubGrupoFijo.length && items <= itemsPorPagina; i++) {
				cuenta = dato.cuentasSubGrupoFijo[i]
				cuenta.total = 0

				if (cuenta.clasificacion.nombre === "Activo") {
					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 140;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
						doc.font('Helvetica', 8);
					}
					doc.text(cuenta.nombre, 30, y)
					/*doc.text(number_format(cuenta.saldo,2), 530, y); */
					/* total+=cuenta.saldo */
					y = y + 20;
					items++;

					for (var L = 0; L < dato.cuentasGenericasFijo.length && items <= itemsPorPagina; L++) {
						cuenta3 = dato.cuentasGenericasFijo[L]
						cuenta3.total = 0
						if (cuenta3.tipoCuenta.nombre_corto === "3") {
							var cod = String(cuenta3.codigo).substr(0, 3)
							if (cuenta.codigo == cod) {
								if (dato.cuentasApropiacionFijo.some(function (cuenta2) {
									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta3.codigo == cod) {
										return true
									} else {
										return false
									}
								})) {
									doc.text(cuenta3.nombre, 40, y)
									y = y + 20;
									items++;
									for (var s = 0; s < dato.cuentasGenericasFijo.length && items <= itemsPorPagina; s++) {
										cuenta6 = dato.cuentasGenericasFijo[s]
										cuenta6.total = 0
										var cod = String(cuenta6.codigo).substr(3)
										var codDos = String(cuenta3.codigo).substr(3)
										if (codDos == cod && cuenta6.clasificacion.nombre === "Pasivo") {
											doc.text(cuenta6.nombre, 40, y)
											y = y + 20;
											items++;
										}
										if (s == (dato.cuentasGenericasFijo.length - 1)) {
											for (var p = 0; p < dato.cuentasApropiacionFijo.length && items <= itemsPorPagina; p++) {
												cuenta2 = dato.cuentasApropiacionFijo[p]
												if (cuenta2.tipoCuenta.nombre_corto === "4") {
													var cod = String(cuenta2.codigo).substr(0, 5)
													if (cuenta3.codigo == cod) {
														/* 	doc.text(cuenta2.nombre, 60, y) */
														cuenta3.total += cuenta2.saldo
														//doc.text(number_format(cuenta2.saldo, 2), x - 80, y-20);
														var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
														//if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x +65, y-20);

														/* y = y + 20;
														items++; */
														for (var S = 0; S < dato.cuentasApropiacionFijo.length && items <= itemsPorPagina; S++) {
															cuenta5 = dato.cuentasApropiacionFijo[S]
															if (cuenta5.tipoCuenta.nombre_corto === "4") {
																var cod = String(cuenta5.codigo).substr(4)
																var codDos = String(cuenta2.codigo).substr(4)
																if (codDos == cod && cuenta5.clasificacion.nombre === "Pasivo") {
																	/* doc.text(cuenta5.nombre, 60, y) */
																	/* doc.text("("+number_format(cuenta5.saldo, 2)+")", x - 80, y-20); */
																	cuenta6.total += cuenta5.saldo
																	var totalSumado = cuenta2.saldo - cuenta5.saldo
																	/* 	doc.text(number_format((totalSumado), 2), x, y-20); */
																	var saldoSus = cuenta5.saldo / $scope.moneda.dolar;
																	var saldoSusTotal = totalSumado / $scope.moneda.dolar;
																	/* 	if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 65, y-20);
																		if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSusTotal, 2), x + 130, y-20); */
																	cuenta.total += totalSumado
																	totalActivos += totalSumado
																	/* 	y = y + 20;
																		items++; */
																	if (items == itemsPorPagina) {
																		doc.addPage({ margin: 0, bufferPages: true });
																		y = 140;
																		items = 0;
																		pagina = pagina + 1;
																		$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																		doc.font('Helvetica', 8);
																	}
																} else {
																	if (items == itemsPorPagina) {
																		doc.addPage({ margin: 0, bufferPages: true });
																		y = 140;
																		items = 0;
																		pagina = pagina + 1;
																		$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																		doc.font('Helvetica', 8);
																	}
																}
															} else {
																if (items == itemsPorPagina) {
																	doc.addPage({ margin: 0, bufferPages: true });
																	y = 140;
																	items = 0;
																	pagina = pagina + 1;
																	$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																	doc.font('Helvetica', 8);
																}
															}


														}
														if (items == itemsPorPagina) {
															doc.addPage({ margin: 0, bufferPages: true });
															y = 140;
															items = 0;
															pagina = pagina + 1;
															$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
															doc.font('Helvetica', 8);
														}
													} else {
														if (items == itemsPorPagina) {
															doc.addPage({ margin: 0, bufferPages: true });
															y = 140;
															items = 0;
															pagina = pagina + 1;
															$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
															doc.font('Helvetica', 8);
														}
													}
												} else {
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 140;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												}


											}

											doc.text(number_format(cuenta3.total, 2), x - 80, y - 40);
											var saldoSus = cuenta3.total / $scope.moneda.dolar;
											if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 65, y - 40);
											doc.text("(" + number_format(cuenta6.total, 2) + ")", x - 80, y - 20);
											var saldoSus = cuenta6.total / $scope.moneda.dolar;
											if ($scope.configuracionImpresion.bimonetario) doc.text("(" + number_format(saldoSus, 2) + ")", x + 65, y - 20);
											var totalFijos = cuenta3.total - cuenta6.total
											var totalFijosSus = totalFijos / $scope.moneda.dolar;
											doc.text(number_format(totalFijos, 2), x, y - 20);
											if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(totalFijosSus, 2), x + 130, y - 20);
										}

									}

								}
							} else {
								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 140;
									items = 0;
									pagina = pagina + 1;
									$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
									doc.font('Helvetica', 8);
								}
							}
						} else {
							if (items == itemsPorPagina) {
								doc.addPage({ margin: 0, bufferPages: true });
								y = 140;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
								doc.font('Helvetica', 8);
							}
						}


					}
					doc.text("TOTAL " + cuenta.nombre, 90, y);
					doc.text(number_format(cuenta.total, 2), x, y);
					var cuentatotalSus = cuenta.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
					y = y + 20;
					items++;
					if (i === (dato.cuentasSubGrupoFijo.length - 1)) {
						$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
					/* 	y = y + 20;
						items++; */
				} else {
					if (i === (dato.cuentasSubGrupoFijo.length - 1)) {
						$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
				}

			}


		}
		$scope.DibujarFijoComparativoPreestablecido = function (dato, totalesActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion, cuentasSubGrupoFijo,
			cuentasGenericasFijo,
			cuentasApropiacionFijo) {
			doc.font('Helvetica', 8);
			for (var i = 0; i < cuentasSubGrupoFijo.length && items <= itemsPorPagina; i++) {
				cuenta = cuentasSubGrupoFijo[i]
				cuenta.primerAno.total = 0
				cuenta.segundoAno.total = 0

				if (cuenta.primerAno.clasificacion.nombre === "Activo") {
					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 140;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
						doc.font('Helvetica', 8);
					}
					doc.text(cuenta.primerAno.nombre, 30, y)
					/*doc.text(number_format(cuenta.saldo,2), 530, y); */
					/* total+=cuenta.saldo */
					y = y + 20;
					items++;

					for (var L = 0; L < cuentasGenericasFijo.length && items <= itemsPorPagina; L++) {
						cuenta3 = cuentasGenericasFijo[L]
						cuenta3.primerAno.total = 0
						cuenta3.segundoAno.total = 0
						var cod = String(cuenta3.primerAno.codigo).substr(0, 3)
						if (cuenta.primerAno.codigo == cod) {
							if (cuentasApropiacionFijo.some(function (cuenta2) {
								var cod = String(cuenta2.primerAno.codigo).substr(0, 5)
								if (cuenta3.primerAno.codigo == cod) {
									return true
								} else {
									return false
								}
							})) {
								doc.text(cuenta3.primerAno.nombre, 40, y)
								y = y + 20;
								items++;
								for (var s = 0; s < cuentasGenericasFijo.length && items <= itemsPorPagina; s++) {
									cuenta6 = cuentasGenericasFijo[s]
									cuenta6.primerAno.total = 0
									cuenta6.segundoAno.total = 0
									var cod = String(cuenta6.primerAno.codigo).substr(3)
									var codDos = String(cuenta3.primerAno.codigo).substr(3)
									if (codDos == cod && cuenta6.primerAno.clasificacion.nombre === "Pasivo") {
										doc.text(cuenta6.primerAno.nombre, 40, y)
										y = y + 20;
										items++;
									}
									if (s == (cuentasGenericasFijo.length - 1)) {
										for (var p = 0; p < cuentasApropiacionFijo.length && items <= itemsPorPagina; p++) {
											cuenta2 = cuentasApropiacionFijo[p]
											if (cuenta2.primerAno.tipoCuenta.nombre_corto === "4") {
												var cod = String(cuenta2.primerAno.codigo).substr(0, 5)
												if (cuenta3.primerAno.codigo == cod) {
													/* 	doc.text(cuenta2.nombre, 60, y) */
													cuenta3.primerAno.total += cuenta2.primerAno.saldo
													cuenta3.segundoAno.total += cuenta2.segundoAno.saldo
													//doc.text(number_format(cuenta2.saldo, 2), x - 80, y-20);
													//var saldoSus = cuenta2.primerAno.saldo / $scope.moneda.dolar;
													//if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x +65, y-20);

													/* y = y + 20;
													items++; */
													for (var S = 0; S < cuentasApropiacionFijo.length && items <= itemsPorPagina; S++) {
														cuenta5 = cuentasApropiacionFijo[S]
														if (cuenta5.primerAno.tipoCuenta.nombre_corto === "4") {
															var cod = String(cuenta5.primerAno.codigo).substr(4)
															var codDos = String(cuenta2.primerAno.codigo).substr(4)
															if (codDos == cod && cuenta5.primerAno.clasificacion.nombre === "Pasivo") {
																/* doc.text(cuenta5.nombre, 60, y) */
																/* doc.text("("+number_format(cuenta5.saldo, 2)+")", x - 80, y-20); */
																cuenta6.primerAno.total += cuenta5.primerAno.saldo
																cuenta6.segundoAno.total += cuenta5.segundoAno.saldo
																var totalSumado = cuenta2.primerAno.saldo - cuenta5.primerAno.saldo
																var totalSumado2 = cuenta2.segundoAno.saldo - cuenta5.segundoAno.saldo
																/* 	doc.text(number_format((totalSumado), 2), x, y-20); */
																/* var saldoSus = cuenta5.primerAno.saldo / $scope.moneda.dolar;
																var saldoSusTotal = totalSumado / $scope.moneda.dolar; */
																/* 	if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 65, y-20);
																	if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSusTotal, 2), x + 130, y-20); */
																cuenta.primerAno.total += totalSumado
																totalesActivos.totalActivosPrimerAnio += totalSumado
																cuenta.segundoAno.total += totalSumado2
																totalesActivos.totalActivosSegundoAnio += totalSumado2
																/* 	y = y + 20;
																	items++; */
																if (items == itemsPorPagina) {
																	doc.addPage({ margin: 0, bufferPages: true });
																	y = 140;
																	items = 0;
																	pagina = pagina + 1;
																	$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																	doc.font('Helvetica', 8);
																}
															} else {
																if (items == itemsPorPagina) {
																	doc.addPage({ margin: 0, bufferPages: true });
																	y = 140;
																	items = 0;
																	pagina = pagina + 1;
																	$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																	doc.font('Helvetica', 8);
																}
															}
														} else {
															if (items == itemsPorPagina) {
																doc.addPage({ margin: 0, bufferPages: true });
																y = 140;
																items = 0;
																pagina = pagina + 1;
																$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
																doc.font('Helvetica', 8);
															}
														}


													}
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 140;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												} else {
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 140;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
													doc.font('Helvetica', 8);
												}
											}


										}

										doc.text(cuenta3.primerAno.total.toFixed(2), x - 80, y - 40);
										doc.text(cuenta3.segundoAno.total.toFixed(2), x + 130, y - 40);
										var saldoSus = cuenta3.primerAno.total / $scope.moneda.dolar;
										//if ($scope.configuracionImpresion.bimonetario) doc.text(saldoSus, 2), x + 65, y - 40);
										doc.text("(" + cuenta6.primerAno.total.toFixed(2) + ")", x - 80, y - 20);
										doc.text("(" + cuenta6.segundoAno.total.toFixed(2) + ")", x + 130, y - 20);
										var saldoSus = cuenta6.primerAno.total / $scope.moneda.dolar;
										//if ($scope.configuracionImpresion.bimonetario) doc.text("(" + number_format(saldoSus, 2) + ")", x + 65, y - 20);
										var totalFijos = cuenta3.primerAno.total - cuenta6.primerAno.total
										var totalFijosSus = totalFijos / $scope.moneda.dolar;
										doc.text(number_format(totalFijos, 2), x, y - 20);

										if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(totalFijosSus, 2), x + 80, y - 20);
										var totalFijos = cuenta3.segundoAno.total - cuenta6.segundoAno.total
										var totalFijosSus = totalFijos / $scope.moneda.dolar;
										doc.text(number_format(totalFijos, 2), x + 180, y - 20);
										if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(totalFijosSus, 2), x + 260, y - 20);
									}

								}

							}
						} else {
							if (items == itemsPorPagina) {
								doc.addPage({ margin: 0, bufferPages: true });
								y = 140;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
								doc.font('Helvetica', 8);
							}
						}



					}
					doc.text("TOTAL " + cuenta.primerAno.nombre, 90, y);
					doc.text(number_format(cuenta.primerAno.total, 2), x, y);
					var cuentatotalSus = cuenta.primerAno.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 80, y);
					doc.text(number_format(cuenta.segundoAno.total, 2), x + 180, y);
					var cuentatotalSus = cuenta.segundoAno.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 260, y);
					y = y + 20;
					items++;
					if (i === (cuentasSubGrupoFijo.length - 1)) {
						$scope.dibujarPatrimonioComparativoPredefinido(dato, totalesActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion)

					}
					/* 	y = y + 20;
						items++; */
				} else {
					if (i === (cuentasSubGrupoFijo.length - 1)) {
						$scope.dibujarPatrimonioComparativoPredefinido(dato, totalesActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion)

					}
				}

			}
		}
		$scope.DibujarFijoSubGrupo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {

				doc.font('Helvetica', 8);
				for (var i = 0; i < dato.cuentasSubGrupoFijo.length && items <= itemsPorPagina; i++) {
					cuenta = dato.cuentasSubGrupoFijo[i]
					cuenta.total = 0

					if (cuenta.clasificacion.nombre === "Activo") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
							doc.font('Helvetica', 8);
						}
						doc.text(cuenta.nombre, 30, y)

						y = y + 20;
						items++;

						for (var L = 0; L < dato.cuentasGenericasFijo.length && items <= itemsPorPagina; L++) {
							cuenta3 = dato.cuentasGenericasFijo[L]
							cuenta3.total = 0

							var cod = String(cuenta3.codigo).substr(0, 3)
							if (cuenta.codigo == cod) {
								if (dato.cuentasApropiacionFijo.some(function (cuenta2) {
									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta3.codigo == cod) {
										return true
									} else {
										return false
									}
								})) {

									for (var s = 0; s < dato.cuentasGenericasFijo.length && items <= itemsPorPagina; s++) {
										cuenta6 = dato.cuentasGenericasFijo[s]
										cuenta6.total = 0
										var cod = String(cuenta6.codigo).substr(3)
										var codDos = String(cuenta3.codigo).substr(3)

										if (s == (dato.cuentasGenericasFijo.length - 1)) {
											for (var p = 0; p < dato.cuentasApropiacionFijo.length && items <= itemsPorPagina; p++) {
												cuenta2 = dato.cuentasApropiacionFijo[p]
												var cod = String(cuenta2.codigo).substr(0, 5)
												if (cuenta3.codigo == cod) {
													cuenta3.total += cuenta2.saldo
													for (var S = 0; S < dato.cuentasApropiacionFijo.length && items <= itemsPorPagina; S++) {
														cuenta5 = dato.cuentasApropiacionFijo[S]
														var cod = String(cuenta5.codigo).substr(4)
														var codDos = String(cuenta2.codigo).substr(4)
														if (codDos == cod && cuenta5.clasificacion.nombre === "Pasivo") {
															cuenta6.total += cuenta5.saldo
															var totalSumado = cuenta2.saldo - cuenta5.saldo
															cuenta.total += totalSumado
															totalActivos += totalSumado
														}
													}
												}
											}
										}

									}

								}

							} else {
								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 140;
									items = 0;
									pagina = pagina + 1;
									$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
									doc.font('Helvetica', 8);
								}
							}

						}
						doc.text("TOTAL " + cuenta.nombre, 90, y);
						doc.text(number_format(cuenta.total, 2), x, y);
						var cuentatotalSus = cuenta.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						y = y + 20;
						items++;
						if (i === (dato.cuentasSubGrupoFijo.length - 1)) {
							$scope.dibujarPatrimonioSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (dato.cuentasSubGrupoFijo.length - 1)) {
							$scope.dibujarPatrimonioSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
					}

				}
			} else {

			}
		}
		$scope.DibujarFijoGrupo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {

				doc.font('Helvetica', 8);
				for (var i = 0; i < dato.cuentasSubGrupoFijo.length && items <= itemsPorPagina; i++) {
					cuenta = dato.cuentasSubGrupoFijo[i]
					cuenta.total = 0

					if (cuenta.clasificacion.nombre === "Activo") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
							doc.font('Helvetica', 8);
						}
						/* doc.text(cuenta.nombre, 30, y) */
						/*doc.text(number_format(cuenta.saldo,2), 530, y); */
						/* total+=cuenta.saldo */
						/* y = y + 20;
						items++; */

						for (var L = 0; L < dato.cuentasGenericasFijo.length && items <= itemsPorPagina; L++) {
							cuenta3 = dato.cuentasGenericasFijo[L]
							cuenta3.total = 0
							var cod = String(cuenta3.codigo).substr(0, 3)
							if (cuenta.codigo == cod) {
								if (dato.cuentasApropiacionFijo.some(function (cuenta2) {
									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta3.codigo == cod) {
										return true
									} else {
										return false
									}
								})) {
									/* doc.text(cuenta3.nombre, 40, y)
									y = y + 20;
									items++; */
									for (var s = 0; s < dato.cuentasGenericasFijo.length && items <= itemsPorPagina; s++) {
										cuenta6 = dato.cuentasGenericasFijo[s]
										cuenta6.total = 0
										var cod = String(cuenta6.codigo).substr(3)
										var codDos = String(cuenta3.codigo).substr(3)
										if (codDos == cod && cuenta6.clasificacion.nombre === "Pasivo") {
											/* doc.text(cuenta6.nombre, 40, y)
											y = y + 20;
											items++; */
										}
										if (s == (dato.cuentasGenericasFijo.length - 1)) {
											for (var p = 0; p < dato.cuentasApropiacionFijo.length && items <= itemsPorPagina; p++) {
												cuenta2 = dato.cuentasApropiacionFijo[p]
												var cod = String(cuenta2.codigo).substr(0, 5)
												if (cuenta3.codigo == cod) {
													/* 	doc.text(cuenta2.nombre, 60, y) */
													cuenta3.total += cuenta2.saldo
													//doc.text(number_format(cuenta2.saldo, 2), x - 80, y-20);
													var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
													//if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x +65, y-20);

													/* y = y + 20;
													items++; */
													for (var S = 0; S < dato.cuentasApropiacionFijo.length && items <= itemsPorPagina; S++) {
														cuenta5 = dato.cuentasApropiacionFijo[S]

														var cod = String(cuenta5.codigo).substr(4)
														var codDos = String(cuenta2.codigo).substr(4)
														if (codDos == cod && cuenta5.clasificacion.nombre === "Pasivo") {
															cuenta6.total += cuenta5.saldo
															var totalSumado = cuenta2.saldo - cuenta5.saldo

															cuenta.total += totalSumado
															totalActivos += totalSumado

														}



													}
												}



											}
										}

									}

								}
							}
						}
						doc.text("TOTAL " + cuenta.nombre, 90, y);
						doc.text(number_format(cuenta.total, 2), x, y);
						var cuentatotalSus = cuenta.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						y = y + 20;
						items++;
						if (i === (dato.cuentasSubGrupoFijo.length - 1)) {
							$scope.dibujarPatrimonioGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (dato.cuentasSubGrupoFijo.length - 1)) {
							$scope.dibujarPatrimonioGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
					}

				}
			} else {

			}
		}
		$scope.dibujarPatrimonio = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
				var totalPasivo = 0
				doc.font('Helvetica-Bold', 8);
				doc.text("TOTAL ACTIVOS  ", 30, y);
				doc.text(number_format(totalActivos, 2), x, y);
				var cuentatotalSus = totalActivos / $scope.moneda.dolar
				if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
				y += 20
				doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
				y += 20
				for (var j = 0; j < dato.cuentasSubGrupo.length && items <= itemsPorPagina; j++) {
					var cuenta = dato.cuentasSubGrupo[j]
					if (cuenta.clasificacion.nombre === "Pasivo") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
							doc.font('Helvetica', 8);
						}
						doc.text(cuenta.nombre, 30, y)
						cuenta.total = 0
						y = y + 20;
						items++;
						for (var L = 0; L < dato.cuentasGenericas.length && items <= itemsPorPagina; L++) {
							var cuenta4 = dato.cuentasGenericas[L]
							if (cuenta4.tipoCuenta.nombre_corto === "3") {
								var cod = String(cuenta4.codigo).substr(0, 3)
								if (cuenta.codigo == cod) {
									if (dato.cuentasApropiacion.some(function (cuenta2) {
										var cod = String(cuenta2.codigo).substr(0, 5)
										if (cuenta4.codigo == cod) {
											return true
										} else {
											return false
										}
									})) {
										doc.text(cuenta4.nombre, 40, y)
										y = y + 20;
										items++;
										for (var p = 0; p < dato.cuentasApropiacion.length && items <= itemsPorPagina; p++) {
											var cuenta2 = dato.cuentasApropiacion[p]
											if (cuenta2.tipoCuenta.nombre_corto === "4") {
												var cod = String(cuenta2.codigo).substr(0, 5)
												if (cuenta4.codigo == cod) {
													doc.text(cuenta2.nombre, 60, y)
													doc.text(number_format(cuenta2.saldo, 2), x, y);
													var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
													if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
													cuenta.total += cuenta2.saldo
													totalPasivo += cuenta2.saldo
													y = y + 20;
													items++;
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 140;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
														doc.font('Helvetica', 8);
													}
												} else {
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 140;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
														doc.font('Helvetica', 8);
													}
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
													doc.font('Helvetica', 8);
												}
											}


										}
									}
								} else {
									if (items == itemsPorPagina) {
										doc.addPage({ margin: 0, bufferPages: true });
										y = 140;
										items = 0;
										pagina = pagina + 1;
										$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
										doc.font('Helvetica', 8);
									}
								}
							} else {

								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 140;
									items = 0;
									pagina = pagina + 1;
									$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
									doc.font('Helvetica', 8);
								}
							}


						}
						doc.text("TOTAL " + cuenta.nombre, 90, y);
						doc.text(number_format(cuenta.total, 2), x, y);
						var saldoSus = Math.round((cuenta.total / $scope.moneda.dolar) * 10000) / 10000;
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
						y = y + 20;
						items++;
					}
					if (j === (dato.cuentasSubGrupo.length - 1)) {
						doc.font('Helvetica-Bold', 8);
						doc.text("TOTAL PASIVO:  ", 30, y)
						doc.text(number_format(totalPasivo, 2), x, y)
						var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
					}
				}
			} else {

			}
		}
		$scope.dibujarPatrimonioComparativoPredefinido = function (dato, totalesActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion) {

			var totalesPasivo = { totalPasivoPrimerAnio: 0, totalPasivoSegundoAnio: 0 }
			doc.font('Helvetica-Bold', 8);
			doc.text("TOTAL ACTIVOS  ", 30, y);
			doc.text(number_format(totalesActivos.totalActivosPrimerAnio, 2), x, y);

			var cuentatotalSus = totalesActivos.totalActivosPrimerAnio / $scope.moneda.dolar
			if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
			y += 20
			items++;
			doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
			items++;
			y += 20
			for (var j = 0; j < cuentasSubGrupo.length && items <= itemsPorPagina; j++) {
				doc.font('Helvetica', 8);
				var cuenta = cuentasSubGrupo[j]
				if (cuenta.primerAno.clasificacion.nombre === "Pasivo" || cuenta.primerAno.clasificacion.nombre == 'Capital') {
					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 140;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
						doc.font('Helvetica', 8);
					}
					doc.text(cuenta.primerAno.nombre, 30, y)
					cuenta.primerAno.total = 0
					cuenta.segundoAno.total = 0
					y = y + 20;
					items++;
					for (var L = 0; L < cuentasGenericas.length && items <= itemsPorPagina; L++) {
						var cuenta4 = cuentasGenericas[L]

						var cod = String(cuenta4.primerAno.codigo).substr(0, 3)
						if (cuenta.primerAno.codigo == cod) {
							if (cuentasApropiacion.some(function (cuenta2) {
								var cod = String(cuenta2.primerAno.codigo).substr(0, 5)
								if (cuenta4.primerAno.codigo == cod) {
									return true
								} else {
									return false
								}
							})) {
								doc.text(cuenta4.primerAno.nombre, 40, y)
								cuenta4.primerAno.total = 0
								cuenta4.primerAno.totalSus = 0
								cuenta4.segundoAno.total = 0
								cuenta4.segundoAno.totalSus = 0
								/* y = y + 20;
								items++; */
								for (var p = 0; p < cuentasApropiacion.length && items <= itemsPorPagina; p++) {
									var cuenta2 = cuentasApropiacion[p]
									if (cuenta2.primerAno.tipoCuenta.nombre_corto === "4") {
										var cod = String(cuenta2.primerAno.codigo).substr(0, 5)
										if (cuenta4.primerAno.codigo == cod) {
											/* doc.text(cuenta2.nombre, 60, y)
											doc.text(number_format(cuenta2.saldo, 2), x, y);
											var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
											if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y); */
											cuenta4.primerAno.total += cuenta2.primerAno.saldo
											cuenta4.primerAno.totalSus += cuenta2.primerAno.saldo / $scope.moneda.dolar;
											cuenta.primerAno.total += cuenta2.primerAno.saldo
											cuenta4.segundoAno.total += cuenta2.segundoAno.saldo
											cuenta4.segundoAno.totalSus += cuenta2.segundoAno.saldo / $scope.moneda.dolar;
											cuenta.segundoAno.total += cuenta2.segundoAno.saldo
											totalesPasivo.totalPasivoPrimerAnio += cuenta2.primerAno.saldo
											totalesPasivo.totalPasivoSegundoAnio += cuenta2.segundoAno.saldo
											if (items == itemsPorPagina) {
												doc.addPage({ margin: 0, bufferPages: true });
												y = 140;
												items = 0;
												pagina = pagina + 1;
												$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
												doc.font('Helvetica', 8);
											}
										} else {
											if (items == itemsPorPagina) {
												doc.addPage({ margin: 0, bufferPages: true });
												y = 140;
												items = 0;
												pagina = pagina + 1;
												$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
												doc.font('Helvetica', 8);
											}
										}
									} else {
										if (items == itemsPorPagina) {
											doc.addPage({ margin: 0, bufferPages: true });
											y = 140;
											items = 0;
											pagina = pagina + 1;
											$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
											doc.font('Helvetica', 8);
										}
									}


								}
								doc.text(cuenta4.primerAno.total, x, y)
								if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta4.primerAno.totalSus, 2), x + 80, y);
								doc.text(cuenta4.segundoAno.total, x + 180, y)
								if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta4.segundoAno.totalSus, 2), x + 260, y);
								y = y + 20;
								items++;
							}
						} else {
							if (items == itemsPorPagina) {
								doc.addPage({ margin: 0, bufferPages: true });
								y = 140;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
								doc.font('Helvetica', 8);
							}
						}



					}
					doc.text("TOTAL " + cuenta.primerAno.nombre, 90, y);
					doc.text(number_format(cuenta.primerAno.total, 2), x, y);
					doc.text(number_format(cuenta.segundoAno.total, 2), x + 180, y);
					var saldoSus = Math.round((cuenta.primerAno.total / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 80, y);
					var saldoSus = Math.round((cuenta.segundoAno.total / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 260, y);
					y = y + 20;
					items++;
				}
				if (j === (cuentasSubGrupo.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL PASIVO:  ", 30, y)
					doc.text(number_format(totalesPasivo.totalPasivoPrimerAnio, 2), x, y)
					var saldoSus = Math.round((totalesPasivo.totalPasivoPrimerAnio / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 80, y);
					doc.text(number_format(totalesPasivo.totalPasivoSegundoAnio, 2), x + 180, y)
					var saldoSus = Math.round((totalesPasivo.totalPasivoSegundoAnio / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 260, y);
				}
			}

		}
		$scope.dibujarPatrimonioPredefinido = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {

			var totalPasivo = 0
			doc.font('Helvetica-Bold', 8);
			doc.text("TOTAL ACTIVOS  ", 30, y);
			doc.text(number_format(totalActivos, 2), x, y);

			var cuentatotalSus = totalActivos / $scope.moneda.dolar
			if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
			y += 20
			items++;
			doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
			y += 20
			items++;
			for (var j = 0; j < dato.cuentasSubGrupo.length && items <= itemsPorPagina; j++) {
				doc.font('Helvetica', 8);
				var cuenta = dato.cuentasSubGrupo[j]
				if (cuenta.clasificacion.nombre === "Pasivo" || cuenta.clasificacion.nombre == 'Capital') {
					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 140;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
						doc.font('Helvetica', 8);
					}
					doc.text(cuenta.nombre, 30, y)
					cuenta.total = 0
					y = y + 20;
					items++;
					for (var L = 0; L < dato.cuentasGenericas.length && items <= itemsPorPagina; L++) {
						var cuenta4 = dato.cuentasGenericas[L]
						if (cuenta4.tipoCuenta.nombre_corto === "3") {
							var cod = String(cuenta4.codigo).substr(0, 3)
							if (cuenta.codigo == cod) {
								if (dato.cuentasApropiacion.some(function (cuenta2) {
									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta4.codigo == cod) {
										return true
									} else {
										return false
									}
								})) {
									doc.text(cuenta4.nombre, 40, y)
									cuenta4.total = 0
									cuenta4.totalSus = 0
									/* y = y + 20;
									items++; */
									for (var p = 0; p < dato.cuentasApropiacion.length && items <= itemsPorPagina; p++) {
										var cuenta2 = dato.cuentasApropiacion[p]
										if (cuenta2.tipoCuenta.nombre_corto === "4") {
											var cod = String(cuenta2.codigo).substr(0, 5)
											if (cuenta4.codigo == cod) {
												/* doc.text(cuenta2.nombre, 60, y)
												doc.text(number_format(cuenta2.saldo, 2), x, y);
												var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
												if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y); */
												cuenta4.total += cuenta2.saldo
												cuenta4.totalSus += cuenta2.saldo / $scope.moneda.dolar;
												cuenta.total += cuenta2.saldo
												totalPasivo += cuenta2.saldo

												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
													doc.font('Helvetica', 8);
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
													doc.font('Helvetica', 8);
												}
											}
										} else {
											if (items == itemsPorPagina) {
												doc.addPage({ margin: 0, bufferPages: true });
												y = 140;
												items = 0;
												pagina = pagina + 1;
												$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
												doc.font('Helvetica', 8);
											}
										}


									}
									doc.text(cuenta4.total, x, y)
									if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta4.totalSus, 2), x + 130, y);
									y = y + 20;
									items++;
								}
							} else {
								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 140;
									items = 0;
									pagina = pagina + 1;
									$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
									doc.font('Helvetica', 8);
								}
							}
						} else {

							if (items == itemsPorPagina) {
								doc.addPage({ margin: 0, bufferPages: true });
								y = 140;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
								doc.font('Helvetica', 8);
							}
						}


					}
					doc.text("TOTAL " + cuenta.nombre, 90, y);
					doc.text(number_format(cuenta.total, 2), x, y);
					var saldoSus = Math.round((cuenta.total / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
					y = y + 20;
					items++;
				}
				if (j === (dato.cuentasSubGrupo.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL PASIVO:  ", 30, y)
					doc.text(number_format(totalPasivo, 2), x, y)
					var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
				}
			}

		}
		$scope.dibujarPatrimonioSubGrupo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
				var totalPasivo = 0
				doc.font('Helvetica-Bold', 8);
				doc.text("TOTAL ACTIVOS  ", 30, y);
				doc.text(number_format(totalActivos, 2), x, y);

				var cuentatotalSus = totalActivos / $scope.moneda.dolar
				if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
				y += 20
				items++;
				doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
				y += 20
				items++;
				for (var j = 0; j < dato.cuentasSubGrupo.length && items <= itemsPorPagina; j++) {
					doc.font('Helvetica', 8);
					var cuenta = dato.cuentasSubGrupo[j]
					if (cuenta.clasificacion.nombre === "Pasivo" || cuenta.clasificacion.nombre == 'Capital') {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
							doc.font('Helvetica', 8);
						}
						doc.text(cuenta.nombre, 30, y)
						cuenta.total = 0
						cuenta.totalSus = 0
						/* y = y + 20;
						items++; */
						for (var L = 0; L < dato.cuentasGenericas.length && items <= itemsPorPagina; L++) {
							var cuenta4 = dato.cuentasGenericas[L]
							if (cuenta4.tipoCuenta.nombre_corto === "3") {
								var cod = String(cuenta4.codigo).substr(0, 3)
								if (cuenta.codigo == cod) {
									if (dato.cuentasApropiacion.some(function (cuenta2) {
										var cod = String(cuenta2.codigo).substr(0, 5)
										if (cuenta4.codigo == cod) {
											return true
										} else {
											return false
										}
									})) {

										for (var p = 0; p < dato.cuentasApropiacion.length && items <= itemsPorPagina; p++) {
											var cuenta2 = dato.cuentasApropiacion[p]
											if (cuenta2.tipoCuenta.nombre_corto === "4") {
												var cod = String(cuenta2.codigo).substr(0, 5)
												if (cuenta4.codigo == cod) {
													cuenta.totalSus += cuenta2.saldo / $scope.moneda.dolar;
													cuenta.total += cuenta2.saldo
													totalPasivo += cuenta2.saldo
												}
											}
										}
									}
								}
							}
						}
						doc.text(cuenta.total, x, y)
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta.totalSus, 2), x + 130, y);
						y = y + 20;
						items++;
						doc.text("TOTAL " + cuenta.nombre, 90, y);
						doc.text(number_format(cuenta.total, 2), x, y);
						var saldoSus = Math.round((cuenta.total / $scope.moneda.dolar) * 10000) / 10000;
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
						y = y + 20;
						items++;
					}
					if (j === (dato.cuentasSubGrupo.length - 1)) {
						doc.font('Helvetica-Bold', 8);
						doc.text("TOTAL PASIVO:  ", 30, y)
						doc.text(number_format(totalPasivo, 2), x, y)
						var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
					}
				}
			} else {

			}
		}
		$scope.dibujarPatrimonioGrupo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
				var totalPasivo = 0
				doc.font('Helvetica-Bold', 8);
				doc.text("TOTAL ACTIVOS  ", 30, y);
				doc.text(number_format(totalActivos, 2), x, y);

				var cuentatotalSus = totalActivos / $scope.moneda.dolar
				if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
				y += 20
				items++;
				doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
				y += 20
				items++;
				for (var i = 0; i < dato.cuentasGrupo.length && items <= itemsPorPagina; i++) {
					cuenta = dato.cuentasGrupo[i]
					cuenta.total = 0
					cuenta.totalSus = 0
					if (cuenta.clasificacion.nombre === "Pasivo" || cuenta.clasificacion.nombre === "Capital") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
							doc.font('Helvetica', 8);
						}
						doc.text(cuenta.nombre, 30, y)
						for (var r = 0; r < dato.cuentasSubGrupo.length && items <= itemsPorPagina; r++) {
							cuenta4 = dato.cuentasSubGrupo[r]
							if (cuenta4.tipoCuenta.nombre_corto === "2") {
								var cod = String(cuenta4.codigo).substr(0, 1)
								if (cuenta.codigo == cod) {

									for (var L = 0; L < dato.cuentasGenericas.length && items <= itemsPorPagina; L++) {
										cuenta3 = dato.cuentasGenericas[L]
										if (cuenta3.tipoCuenta.nombre_corto === "3") {
											var cod = String(cuenta3.codigo).substr(0, 3)
											if (cuenta4.codigo == cod) {
												if (dato.cuentasApropiacion.some(function (cuenta2) {
													var cod = String(cuenta2.codigo).substr(0, 5)
													if (cuenta3.codigo == cod) {
														return true
													} else {
														return false
													}
												})) {
													for (var p = 0; p < dato.cuentasApropiacion.length && items <= itemsPorPagina; p++) {
														cuenta2 = dato.cuentasApropiacion[p]
														if (cuenta2.tipoCuenta.nombre_corto === "4") {
															var cod = String(cuenta2.codigo).substr(0, 5)
															if (cuenta3.codigo == cod) {
																cuenta.total += cuenta2.saldo
																cuenta.totalSus += cuenta2.saldo
																totalPasivo += cuenta2.saldo
															}
														}
													}

												}
											}
										}

									}
								}
							}
						}

						doc.text(cuenta.total, x, y)
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta.totalSus, 2), x + 130, y);
						y = y + 20;
						items++;
						doc.text("TOTAL " + cuenta.nombre, 90, y);
						doc.text(number_format(cuenta.total, 2), x, y);
						var saldoSus = Math.round((cuenta.total / $scope.moneda.dolar) * 10000) / 10000;
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
						y = y + 20;
						items++;
					}
					if (i === (dato.cuentasGrupo.length - 1)) {
						doc.font('Helvetica-Bold', 8);
						doc.text("TOTAL PASIVO:  ", 30, y)
						doc.text(number_format(totalPasivo, 2), x, y)
						var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
					}
				}
			} else {

			}
		}
		$scope.generarPdfPreComparativo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {

		}
		$scope.generarPdfGrupo = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
				var doc = new PDFDocument({ size: 'letter', margin: 10 });
				var stream = doc.pipe(blobStream());
				// draw some text
				var totalCosto = 0;
				var datos = []
				var datosPasivo = []
				var y = 130, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos.length + datosPasivo.length) / itemsPorPagina) : Math.ceil((datos.length + datosPasivo.length) / itemsPorPagina);
				var totalActivos = 0
				var totalPasivo = 0
				$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
				doc.font('Helvetica', 8);
				for (var i = 0; i < cuentasGrupo.length && items <= itemsPorPagina; i++) {
					cuenta = cuentasGrupo[i]
					cuenta.total = 0
					cuenta.totalSus = 0
					if (cuenta.clasificacion.nombre === "Activo") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
							doc.font('Helvetica', 8);
						}
						doc.text(cuenta.nombre, 30, y)
						for (var r = 0; r < cuentasSubGrupo.length && items <= itemsPorPagina; r++) {
							cuenta4 = cuentasSubGrupo[r]
							if (cuenta4.tipoCuenta.nombre_corto === "2") {
								var cod = String(cuenta4.codigo).substr(0, 1)
								if (cuenta.codigo == cod) {

									for (var L = 0; L < cuentasGenericas.length && items <= itemsPorPagina; L++) {
										cuenta3 = cuentasGenericas[L]
										if (cuenta3.tipoCuenta.nombre_corto === "3") {
											var cod = String(cuenta3.codigo).substr(0, 3)
											if (cuenta4.codigo == cod) {
												if (cuentasApropiacion.some(function (cuenta2) {
													var cod = String(cuenta2.codigo).substr(0, 5)
													if (cuenta3.codigo == cod) {
														return true
													} else {
														return false
													}
												})) {
													for (var p = 0; p < cuentasApropiacion.length && items <= itemsPorPagina; p++) {
														cuenta2 = cuentasApropiacion[p]
														if (cuenta2.tipoCuenta.nombre_corto === "4") {
															var cod = String(cuenta2.codigo).substr(0, 5)
															if (cuenta3.codigo == cod) {
																cuenta.total += cuenta2.saldo
																cuenta.totalSus += cuenta2.saldo
																totalActivos += cuenta2.saldo
															}
														}
													}

												}
											}
										}

									}
								}
							}
						}
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta.totalSus, 2), x + 130, y);
						doc.text(number_format(cuenta.total, 2), x, y)
						y = y + 20;
						items++;
						doc.text("TOTAL " + cuenta.nombre, 90, y);
						doc.text(number_format(cuenta.total, 2), x, y);
						var cuentatotalSus = cuenta.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						y = y + 20;
						items++;
						if (i === (cuentasGrupo.length - 1)) {
							$scope.DibujarFijoGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (cuentasGrupo.length - 1)) {
							$scope.DibujarFijoGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
					}

				}
				if ($scope.configuracionImpresion.usar_firma_uno) {
					doc.text($scope.configuracionImpresion.firma_uno, 170, 720);
					doc.text($scope.configuracionImpresion.cargo_uno, 170, 730);
				}
				if ($scope.configuracionImpresion.usar_firma_dos) {
					doc.text($scope.configuracionImpresion.firma_dos, 370, 720);
					doc.text($scope.configuracionImpresion.cargo_dos, 370, 730);
				}

				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			} else {

			}
		}

		$scope.generarPdfsubGrupo = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
				var doc = new PDFDocument({ size: 'letter', margin: 10 });
				var stream = doc.pipe(blobStream());
				// draw some text
				var totalCosto = 0;
				var datos = []
				var datosPasivo = []
				var y = 130, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos.length + datosPasivo.length) / itemsPorPagina) : Math.ceil((datos.length + datosPasivo.length) / itemsPorPagina);
				var totalActivos = 0
				var totalPasivo = 0
				$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
				doc.font('Helvetica', 8);
				for (var i = 0; i < cuentasSubGrupo.length && items <= itemsPorPagina; i++) {
					cuenta = cuentasSubGrupo[i]
					cuenta.total = 0

					if (cuenta.clasificacion.nombre === "Activo") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
							doc.font('Helvetica', 8);
						}
						doc.text(cuenta.nombre, 30, y)
						for (var L = 0; L < cuentasGenericas.length && items <= itemsPorPagina; L++) {
							cuenta3 = cuentasGenericas[L]
							if (cuenta3.tipoCuenta.nombre_corto === "3") {
								var cod = String(cuenta3.codigo).substr(0, 3)
								if (cuenta.codigo == cod) {
									if (cuentasApropiacion.some(function (cuenta2) {
										var cod = String(cuenta2.codigo).substr(0, 5)
										if (cuenta3.codigo == cod) {
											return true
										} else {
											return false
										}
									})) {
										for (var p = 0; p < cuentasApropiacion.length && items <= itemsPorPagina; p++) {
											cuenta2 = cuentasApropiacion[p]
											if (cuenta2.tipoCuenta.nombre_corto === "4") {
												var cod = String(cuenta2.codigo).substr(0, 5)
												if (cuenta3.codigo == cod) {
													cuenta.total += cuenta2.saldo
													cuenta.totalSus += cuenta2.saldo
													totalActivos += cuenta2.saldo
												}
											}
										}

									}
								}
							}

						}
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta.totalSus, 2), x + 130, y);
						doc.text(number_format(cuenta.total, 2), x, y)
						y = y + 20;
						items++;
						doc.text("TOTAL " + cuenta.nombre, 90, y);
						doc.text(number_format(cuenta.total, 2), x, y);
						var cuentatotalSus = cuenta.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						y = y + 20;
						items++;
						if (i === (cuentasSubGrupo.length - 1)) {
							$scope.DibujarFijoSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (cuentasSubGrupo.length - 1)) {
							$scope.DibujarFijoSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
					}

				}
				if ($scope.configuracionImpresion.usar_firma_uno) {
					doc.text($scope.configuracionImpresion.firma_uno, 170, 720);
					doc.text($scope.configuracionImpresion.cargo_uno, 170, 730);
				}
				if ($scope.configuracionImpresion.usar_firma_dos) {
					doc.text($scope.configuracionImpresion.firma_dos, 370, 720);
					doc.text($scope.configuracionImpresion.cargo_dos, 370, 730);
				}

				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			} else {

			}
		}

		$scope.generarPdfPreestablecido = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion) {

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var datos = cuentasSubGrupo.length + cuentasGenericas.length
			/* var datosPasivo = [] */
			var y = 130, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			var totalActivos = 0
			var totalPasivo = 0
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < cuentasSubGrupo.length && items <= itemsPorPagina; i++) {
				cuenta = cuentasSubGrupo[i]
				cuenta.total = 0

				if (cuenta.clasificacion.nombre === "Activo") {
					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 140;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
						doc.font('Helvetica', 8);
					}
					doc.text(cuenta.nombre, 30, y)
					/*doc.text(number_format(cuenta.saldo,2), 530, y); */
					/* total+=cuenta.saldo */
					y = y + 20;
					items++;

					for (var L = 0; L < cuentasGenericas.length && items <= itemsPorPagina; L++) {
						cuenta3 = cuentasGenericas[L]
						if (cuenta3.tipoCuenta.nombre_corto === "3") {
							var cod = String(cuenta3.codigo).substr(0, 3)
							if (cuenta.codigo == cod) {
								if (cuentasApropiacion.some(function (cuenta2) {
									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta3.codigo == cod) {
										return true
									} else {
										return false
									}
								})) {
									doc.text(cuenta3.nombre, 40, y)
									cuenta3.total = 0
									cuenta3.totalSus = 0
									/* y = y + 20;
									items++; */


									for (var p = 0; p < cuentasApropiacion.length && items <= itemsPorPagina; p++) {
										cuenta2 = cuentasApropiacion[p]
										if (cuenta2.tipoCuenta.nombre_corto === "4") {
											var cod = String(cuenta2.codigo).substr(0, 5)
											if (cuenta3.codigo == cod) {
												/* doc.text(cuenta2.nombre, 60, y) */
												/* doc.text(number_format(cuenta2.saldo, 2), x, y); */
												cuenta3.totalSus += cuenta2.saldo / $scope.moneda.dolar;
												//if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
												cuenta3.total += cuenta2.saldo
												cuenta.total += cuenta2.saldo
												totalActivos += cuenta2.saldo

												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
													doc.font('Helvetica', 8);
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
													doc.font('Helvetica', 8);
												}
											}
										} else {
											if (items == itemsPorPagina) {
												doc.addPage({ margin: 0, bufferPages: true });
												y = 140;
												items = 0;
												pagina = pagina + 1;
												$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
												doc.font('Helvetica', 8);
											}
										}


									}
									if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta3.totalSus, 2), x + 130, y);
									doc.text(number_format(cuenta3.total, 2), x, y)
									y = y + 20;
									items++;
								}
							} else {
								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 140;
									items = 0;
									pagina = pagina + 1;
									$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
									doc.font('Helvetica', 8);
								}
							}
						} else {
							if (items == itemsPorPagina) {
								doc.addPage({ margin: 0, bufferPages: true });
								y = 140;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
								doc.font('Helvetica', 8);
							}
						}


					}
					doc.text("TOTAL " + cuenta.nombre, 90, y);
					doc.text(number_format(cuenta.total, 2), x, y);
					var cuentatotalSus = cuenta.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
					y = y + 20;
					items++;
					if (i === (cuentasSubGrupo.length - 1)) {
						$scope.DibujarFijoPreestablecido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
						//$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
					/* 	y = y + 20;
						items++; */
				} else {
					if (i === (cuentasSubGrupo.length - 1)) {
						$scope.DibujarFijoPreestablecido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
						//$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
				}

			}
			if ($scope.configuracionImpresion.usar_firma_uno) {
				doc.text($scope.configuracionImpresion.firma_uno, 170, 720);
				doc.text($scope.configuracionImpresion.cargo_uno, 170, 730);
			}
			if ($scope.configuracionImpresion.usar_firma_dos) {
				doc.text($scope.configuracionImpresion.firma_dos, 370, 720);
				doc.text($scope.configuracionImpresion.cargo_dos, 370, 730);
			}

			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}
		$scope.generarPdfComprobantePreestablecido = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion, cuentasSubGrupoFijo,
			cuentasGenericasFijo,
			cuentasApropiacionFijo) {

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var datos = cuentasSubGrupo.length + cuentasGenericas.length
			var datosPasivo = []
			var y = 130, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			var totalesActivos = { totalActivosPrimerAnio: 0, totalActivosSegundoAnio: 0 }
			var totalesPasivos = { totalPasivosPrimerAnio: 0, totalPasivosSegundoAnio: 0 }
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < cuentasSubGrupo.length && items <= itemsPorPagina; i++) {
				cuenta = cuentasSubGrupo[i]
				cuenta.total = 0

				if (cuenta.primerAno.clasificacion.nombre === "Activo") {
					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 140;
						items = 0;
						pagina = pagina + 1;
						$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
						doc.font('Helvetica', 8);
					}
					doc.text(cuenta.primerAno.nombre, 30, y)
					/*doc.text(number_format(cuenta.saldo,2), 530, y); */
					/* total+=cuenta.saldo */
					cuenta.primerAno.total = 0
					cuenta.primerAno.totalSus = 0
					cuenta.segundoAno.total = 0
					cuenta.segundoAno.totalSus = 0
					y = y + 20;
					items++;

					for (var L = 0; L < cuentasGenericas.length && items <= itemsPorPagina; L++) {
						cuenta3 = cuentasGenericas[L]
						if (cuenta3.primerAno.tipoCuenta.nombre_corto === "3") {
							var cod = String(cuenta3.primerAno.codigo).substr(0, 3)
							if (cuenta.primerAno.codigo == cod) {
								if (cuentasApropiacion.some(function (cuenta2) {
									var cod = String(cuenta2.primerAno.codigo).substr(0, 5)
									if (cuenta3.primerAno.codigo == cod) {
										return true
									} else {
										return false
									}
								})) {
									doc.text(cuenta3.primerAno.nombre, 40, y)
									cuenta3.primerAno.total = 0
									cuenta3.primerAno.totalSus = 0
									cuenta3.segundoAno.total = 0
									cuenta3.segundoAno.totalSus = 0
									/*  y = y + 20;
									items++; */


									for (var p = 0; p < cuentasApropiacion.length && items <= itemsPorPagina; p++) {
										cuenta2 = cuentasApropiacion[p]
										if (cuenta2.primerAno.tipoCuenta.nombre_corto === "4") {
											var cod = String(cuenta2.primerAno.codigo).substr(0, 5)
											if (cuenta3.primerAno.codigo == cod) {
												/* doc.text(cuenta2.nombre, 60, y) */
												/* doc.text(number_format(cuenta2.saldo, 2), x, y); */
												cuenta3.primerAno.totalSus += cuenta2.primerAno.saldo / $scope.moneda.dolar;
												cuenta3.segundoAno.totalSus += cuenta2.segundoAno.saldo / $scope.moneda.dolar;
												//if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
												cuenta3.primerAno.total += cuenta2.primerAno.saldo
												cuenta.primerAno.total += cuenta2.primerAno.saldo
												cuenta3.segundoAno.total += cuenta2.segundoAno.saldo
												cuenta.segundoAno.total += cuenta2.segundoAno.saldo
												totalesActivos.totalActivosPrimerAnio += cuenta2.primerAno.saldo
												totalesActivos.totalActivosSegundoAnio += cuenta2.segundoAno.saldo
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
													doc.font('Helvetica', 8);
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 140;
													items = 0;
													pagina = pagina + 1;
													$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
													doc.font('Helvetica', 8);
												}
											}
										} else {
											if (items == itemsPorPagina) {
												doc.addPage({ margin: 0, bufferPages: true });
												y = 140;
												items = 0;
												pagina = pagina + 1;
												$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
												doc.font('Helvetica', 8);
											}
										}


									}
									if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta3.primerAno.totalSus, 2), x + 80, y);
									doc.text(number_format(cuenta3.primerAno.total, 2), x + 180, y)
									if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuenta3.segundoAno.totalSus, 2), x + 260, y);
									doc.text(number_format(cuenta3.segundoAno.total, 2), x, y)
									y = y + 20;
									items++;
								}
							} else {
								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 140;
									items = 0;
									pagina = pagina + 1;
									$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
									doc.font('Helvetica', 8);
								}
							}
						} else {
							if (items == itemsPorPagina) {
								doc.addPage({ margin: 0, bufferPages: true });
								y = 140;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
								doc.font('Helvetica', 8);
							}
						}


					}
					doc.text("TOTAL " + cuenta.primerAno.nombre, 90, y);
					doc.text(number_format(cuenta.primerAno.total, 2), x, y);
					doc.text(number_format(cuenta.segundoAno.total, 2), x + 180, y);
					var cuentatotalSus = cuenta.primerAno.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 80, y);
					var cuentatotalSus = cuenta.segundoAno.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 260, y);
					y = y + 20;
					items++;
					if (i === (cuentasSubGrupo.length - 1)) {
						$scope.DibujarFijoComparativoPreestablecido(dato, totalesActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion, cuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
						//$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
					/* 	y = y + 20;
						items++; */
				} else {
					if (i === (cuentasSubGrupo.length - 1)) {
						$scope.DibujarFijoComparativoPreestablecido(dato, totalesActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion, cuentasSubGrupoFijo,
							cuentasGenericasFijo,
							cuentasApropiacionFijo)
						//$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
				}

			}
			if ($scope.configuracionImpresion.usar_firma_uno) {
				doc.text($scope.configuracionImpresion.firma_uno, 170, 720);
				doc.text($scope.configuracionImpresion.cargo_uno, 170, 730);
			}
			if ($scope.configuracionImpresion.usar_firma_dos) {
				doc.text($scope.configuracionImpresion.firma_dos, 370, 720);
				doc.text($scope.configuracionImpresion.cargo_dos, 370, 730);
			}

			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}


		$scope.dibujarCabeceraPDFBalanceGeneral = function (doc, pagina, totalPaginas, nombreTipo) {

			doc.font('Helvetica-Bold', 8);
			/* doc.rect(30, 20, 200, 60).stroke(); */
			doc.text($scope.usuario.empresa.razon_social, 40, 30, { width: 220 });
			doc.text("DE : ", 40, 40);
			doc.text("NIT : ", 40, 50);
			doc.text($scope.usuario.empresa.direccion, 40, 60, { width: 220 });
			doc.text($scope.usuario.empresa.nit, 55, 50);
			doc.font('Helvetica-Bold', 12);
			doc.text("BALANCE GENERAL", 0, 75, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'GES') {
				var anioActual = new Date().getFullYear()
				var mesActual = new Date().getMonth()
				var ultimoDiaMes = new Date(anioActual, mesActual - 1, 0).getDate();
				if ($scope.configuracionImpresion.gestion.nombre < anioActual) {
					doc.text("Al 31 de Diciembre de " + $scope.configuracionImpresion.gestion.nombre, 0, 85, { align: "center" });
				} else {
					doc.text("Al " + ultimoDiaMes + " de " + $scope.meses[mesActual].nombre + " de " + $scope.configuracionImpresion.gestion.nombre, 0, 85, { align: "center" });
				}

			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'MES') {
				doc.text($scope.configuracionImpresion.mes.nombre + " de " + $scope.configuracionImpresion.gestion.nombre, 0, 85, { align: "center" });
			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'FECHAS') {
				var fechaInicio = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio))
				var FechaFin = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin))
				doc.text("Desde el " + fechaInicio.getDate() + " de " + $scope.meses[fechaInicio.getMonth()].nombre + " " + fechaInicio.getFullYear() + " al " + FechaFin.getDate() + " de " + $scope.meses[FechaFin.getMonth()].nombre + " de " + FechaFin.getFullYear(), 0, 85, { align: "center" });
			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'COMP') {
				doc.text("Gestión " + $scope.configuracionImpresion.gestion.nombre + "- Gestión " + $scope.configuracionImpresion.gestion_fin.nombre, 0, 85, { align: "center" });
			}
			if ($scope.configuracionImpresion.bimonetario) {
				doc.text("Expresado en Bolivianos y Dólares", 0, 95, { align: "center" });
				if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
					doc.text('Bolivianos', 400, 115);
					doc.text('Dolares', 520, 115);
				} else {
					doc.text($scope.configuracionImpresion.gestion.nombre, 340, 115);
					doc.text('Bolivianos', 290, 125);
					doc.text('Dolares', 370, 125);
					doc.text($scope.configuracionImpresion.gestion_fin.nombre, 525, 115);
					doc.text('Bolivianos', 473, 125);
					doc.text('Dolares', 553, 125);
				}
			} else {
				doc.text("Expresado en Bolivianos", 0, 95, { align: "center" });
			}
			doc.text(nombreTipo, 0, 105, { align: "center" });
			if ($scope.configuracionImpresion.tipoNumeracion.nombre_corto == 'SAD') {
				doc.text("PÁGINA " + pagina, 540, 740);
			} else if ($scope.configuracionImpresion.tipoNumeracion.nombre_corto == 'SAI') {
				doc.text("PÁGINA " + pagina, 0, 740, { align: "center" });
			} else if ($scope.configuracionImpresion.tipoNumeracion.nombre_corto == 'SSD') {
				doc.text("PÁGINA " + pagina, 540, 20);
			} else if ($scope.configuracionImpresion.tipoNumeracion.nombre_corto == 'PPD') {
				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 520, 740);
			} else if ($scope.configuracionImpresion.tipoNumeracion.nombre_corto == 'PPC') {
				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			} else if ($scope.configuracionImpresion.tipoNumeracion.nombre_corto == 'PPSD') {
				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 520, 20);
			}

			doc.font('Helvetica', 5);
			doc.text(($scope.configuracionImpresion.usar_frase_pie_pagina) ? $scope.configuracionImpresion.frase_pie_pagina + ", " : "", 40, 740);
			doc.text((($scope.configuracionImpresion.usar_lugar_emision) ? $scope.configuracionImpresion.lugar_emision + ", " : "") + (($scope.configuracionImpresion.usar_fecha_emision) ? $scope.fechaATexto($scope.configuracionImpresion.fecha_emision) : ""), 40, 750);

		}


		///impresion exel
		$scope.generarExcelBalanceGeneral = function (configuracionImpresion) {
			var promesa = CuentasContabilidadEEFF($scope.configuracionImpresion, $scope.usuario.id_empresa);
			promesa.then(function (dato) {
				$scope.Cuentas = dato.cuentas;


				var data = [["", "", "ESTADO CUENTAS PROVEEDOR"], ["Deudor :" + proveedor.razon_social], ["Fecha", "N Recibo", "Descripción", "monto", "total", "total General"]]
				var totalCosto = 0;
				for (var i = 0; i < proveedor.compras.length; i++) {
					var columns = [];
					totalCosto = totalCosto + proveedor.compras[i].saldo;
					proveedor.compras[i].fecha = new Date(proveedor.compras[i].fecha);
					columns.push(proveedor.compras[i].fecha.getDate() + "/" + (proveedor.compras[i].fecha.getMonth() + 1) + "/" + proveedor.compras[i].fecha.getFullYear());
					columns.push(proveedor.compras[i].id_movimiento);
					if (proveedor.compras[i].factura == null) {
						columns.push('PROFORMA');
					} else {
						columns.push('factura : ' + proveedor.compras[i].factura);
					}
					columns.push(proveedor.compras[i].saldo);
					columns.push(totalCosto);
					columns.push(totalCosto);
					data.push(columns);
				}

				var ws_name = "SheetJS";
				var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
				/* add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-ESTADO-CUENTA-PROVEEDOR.xlsx");
				blockUI.stop();
			})
		}
		$scope.dibujarCabeceraExelBalanceGeneral = function () {
			var textoTipoFiltro = ""
			var textoExpresado = ""
			if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'GES') {
				var anioActual = new Date().getFullYear()
				var mesActual = new Date().getMonth()
				var ultimoDiaMes = new Date(anioActual, mesActual - 1, 0).getDate();
				if ($scope.configuracionImpresion.gestion.nombre < anioActual) {
					textoTipoFiltro = "Al 31 de Diciembre de " + $scope.configuracionImpresion.gestion.nombre;
				} else {
					textoTipoFiltro = "Al " + ultimoDiaMes + " de " + $scope.meses[mesActual].nombre + " de " + $scope.configuracionImpresion.gestion.nombre;
				}

			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'MES') {
				textoTipoFiltro = $scope.configuracionImpresion.mes.nombre + " de " + $scope.configuracionImpresion.gestion.nombre;
			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'FECHAS') {
				var fechaInicio = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio))
				var FechaFin = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin))
				textoTipoFiltro = "Desde el " + fechaInicio.getDate() + " de " + $scope.meses[fechaInicio.getMonth()].nombre + " " + fechaInicio.getFullYear() + " al " + FechaFin.getDate() + " de " + $scope.meses[FechaFin.getMonth()].nombre + " de " + FechaFin.getFullYear();
			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'COMP') {
				textoTipoFiltro = "Gestión " + $scope.configuracionImpresion.gestion.nombre + "- Gestión " + $scope.configuracionImpresion.gestion_fin.nombre;
			}
			if ($scope.configuracionImpresion.bimonetario) {
				textoExpresado = "Expresado en Bolivianos y Dólares";

				var arregloDatos = ["GRUPO", "SUB GRUPO", "GENERICO", "APROPIACION", "", 'BOLIVIANOS', "", 'DOLARES']
			} else {
				var arregloDatos = ["GRUPO", "SUB GRUPO", "GENERICO", "APROPIACION", "", 'BOLIVIANOS']
				textoExpresado = "Expresado en Bolivianos";
			}

			var arregloCabezera = [["", "", "", "BALANCE GENERAL"], ["", "", "", textoTipoFiltro], ["", "", "", textoExpresado], arregloDatos]
			return arregloCabezera
		}

		$scope.generarExelApropiacion = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion) {
			var totalActivos = 0;
			var data = $scope.dibujarCabeceraExelBalanceGeneral()

			for (var i = 0; i < cuentasSubGrupo.length; i++) {
				var columns = [];
				cuenta = cuentasSubGrupo[i]
				cuenta.total = 0

				if (cuenta.clasificacion.nombre === "Activo") {
					columns.push("")
					columns.push(cuenta.nombre)
					data.push(columns);

					for (var L = 0; L < cuentasGenericas.length; L++) {
						columns = []
						cuenta3 = cuentasGenericas[L]

						var cod = String(cuenta3.codigo).substr(0, 3)
						if (cuenta.codigo == cod) {
							if (cuentasApropiacion.some(function (cuenta2) {
								var cod = String(cuenta2.codigo).substr(0, 5)
								if (cuenta3.codigo == cod) {
									return true
								} else {
									return false
								}
							})) {
								columns.push("")
								columns.push("")
								columns.push(cuenta3.nombre)
								data.push(columns);

								for (var p = 0; p < cuentasApropiacion.length; p++) {
									columns = []
									cuenta2 = cuentasApropiacion[p]

									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta3.codigo == cod) {
										columns.push("")
										columns.push("")
										columns.push("")
										columns.push(cuenta2.nombre)
										columns.push("")
										columns.push(number_format(cuenta2.saldo, 2));
										var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
										if ($scope.configuracionImpresion.bimonetario) columns.push(""); columns.push(number_format(saldoSus, 2));
										cuenta.total += cuenta2.saldo
										totalActivos += cuenta2.saldo
										data.push(columns);
									}

								}
							}
						}
					}

					columns = []
					/* columns.push("")
					columns.push("")
					columns.push("")
					data.push("TOTAL " + cuenta.nombre);
					data.push(number_format(cuenta.total, 2));
					columns.push("")
					var cuentatotalSus = cuenta.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) columns.push(""); data.push(number_format(cuentatotalSus, 2)); */
					if (i === (cuentasSubGrupo.length - 1)) {
						//$scope.DibujarFijoApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
						//$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
					/* 	y = y + 20;
						items++; */
				} else {
					if (i === (cuentasSubGrupo.length - 1)) {
						//	$scope.DibujarFijoApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
						//$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
				}

			}
			if ($scope.configuracionImpresion.usar_firma_uno) {
				//doc.text($scope.configuracionImpresion.firma_uno, 170, 720);
				//doc.text($scope.configuracionImpresion.cargo_uno, 170, 730);
			}
			if ($scope.configuracionImpresion.usar_firma_dos) {
				//doc.text($scope.configuracionImpresion.firma_dos, 370, 720);
				//doc.text($scope.configuracionImpresion.cargo_dos, 370, 730);
			}

			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-BALANCE-GENERAL.xlsx");

			blockUI.stop();

		}


		//impresion en word
		$scope.descargarArchivo = function (contenidoEnBlob, nombreArchivo) {
			var reader = new FileReader();
			reader.onload = function (event) {
				var save = document.createElement('a');
				save.href = event.target.result;
				save.target = '_blank';
				save.download = nombreArchivo || 'archivo.dat';
				var clicEvent = new MouseEvent('click', {
					'view': window,
					'bubbles': true,
					'cancelable': true
				});
				save.dispatchEvent(clicEvent);
				(window.URL || window.webkitURL).revokeObjectURL(save.href);
			};
			reader.readAsDataURL(contenidoEnBlob);
		};
		$scope.dibujarCabeceraWordBalanceGeneral = function () {
			var textoTipoFiltro = ""
			var textoExpresado = ""
			if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'GES') {
				var anioActual = new Date().getFullYear()
				var mesActual = new Date().getMonth()
				var ultimoDiaMes = new Date(anioActual, mesActual - 1, 0).getDate();
				if ($scope.configuracionImpresion.gestion.nombre < anioActual) {
					textoTipoFiltro = "Al 31 de Diciembre de " + $scope.configuracionImpresion.gestion.nombre;
				} else {
					textoTipoFiltro = "Al " + ultimoDiaMes + " de " + $scope.meses[mesActual].nombre + " de " + $scope.configuracionImpresion.gestion.nombre;
				}

			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'MES') {
				textoTipoFiltro = $scope.configuracionImpresion.mes.nombre + " de " + $scope.configuracionImpresion.gestion.nombre;
			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'FECHAS') {
				var fechaInicio = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio))
				var FechaFin = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin))
				textoTipoFiltro = "Desde el " + fechaInicio.getDate() + " de " + $scope.meses[fechaInicio.getMonth()].nombre + " " + fechaInicio.getFullYear() + " al " + FechaFin.getDate() + " de " + $scope.meses[FechaFin.getMonth()].nombre + " de " + FechaFin.getFullYear();
			} else if ($scope.configuracionImpresion.tipoPeriodo.nombre_corto == 'COMP') {
				textoTipoFiltro = "Gestión " + $scope.configuracionImpresion.gestion.nombre + "- Gestión " + $scope.configuracionImpresion.gestion_fin.nombre;
			}
			if ($scope.configuracionImpresion.bimonetario) {
				textoExpresado = "Expresado en Bolivianos y Dólares";

				var arregloDatos = ["GRUPO", "SUB GRUPO", "GENERICO", "APROPIACION", "", 'BOLIVIANOS', "", 'DOLARES']
			} else {
				var arregloDatos = ["GRUPO", "SUB GRUPO", "GENERICO", "APROPIACION", "", 'BOLIVIANOS']
				textoExpresado = "Expresado en Bolivianos";
			}

			var arregloCabezera = "\t\t\t\t\tBALANCE GENERAL\r\n" + "\t\t\t\t\t" + textoTipoFiltro + "\r\n" + "\t\t\t\t" + textoExpresado + "\r\n"
			return arregloCabezera
		}
		$scope.generarWordApropiacion = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas, cuentasApropiacion) {
			var cabezera = $scope.dibujarCabeceraWordBalanceGeneral()

			var texto = []

			texto.push(cabezera)

			var totalActivos = 0;
			var data = $scope.dibujarCabeceraExelBalanceGeneral()
			var datos = cuentasSubGrupo.length + cuentasGenericas.length + cuentasApropiacion.length
			var datosPasivo = []
			var y = 130, itemsPorPagina = 51, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			for (var i = 0; i < cuentasSubGrupo.length && items <= itemsPorPagina; i++) {

				cuenta = cuentasSubGrupo[i]
				cuenta.total = 0

				if (cuenta.clasificacion.nombre === "Activo") {
					if (items == itemsPorPagina) {
						items = 0;
						pagina = pagina + 1;
						texto.push(cabezera)

					}
					texto.push(cuenta.nombre + "\r\n")
					items++

					for (var L = 0; L < cuentasGenericas.length && items <= itemsPorPagina; L++) {

						cuenta3 = cuentasGenericas[L]

						var cod = String(cuenta3.codigo).substr(0, 3)
						if (cuenta.codigo == cod) {
							if (cuentasApropiacion.some(function (cuenta2) {
								var cod = String(cuenta2.codigo).substr(0, 5)
								if (cuenta3.codigo == cod) {
									return true
								} else {
									return false
								}
							})) {
								texto.push("\t")
								texto.push(cuenta3.nombre + "\r\n")
								items++
								if (items == itemsPorPagina) {
									items = 0;
									pagina = pagina + 1;
									texto.push(cabezera)

								}
								for (var p = 0; p < cuentasApropiacion.length && items <= itemsPorPagina; p++) {

									cuenta2 = cuentasApropiacion[p]

									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta3.codigo == cod) {
										texto.push("\t\t")
										if (cuenta2.nombre.length > 22) {
											text1 = String(cuenta2.nombre).substr(0, 22)
											text2 = String(cuenta2.nombre).substr(22)
											texto.push(text1)
											texto.push("\n\r\t\t");	items++
											texto.push(text2)
											texto.push("\t")
										} else {
											texto.push(cuenta2.nombre)
											texto.push("\t")
										}
										/* texto.push(cuenta2.nombre)
										texto.push("\t") */
										texto.push(number_format(cuenta2.saldo, 2));
										var saldoSus = cuenta2.saldo / $scope.moneda.dolar;
										if ($scope.configuracionImpresion.bimonetario) texto.push("\t\t" + number_format(saldoSus, 2));
										cuenta.total += cuenta2.saldo
										totalActivos += cuenta2.saldo
										texto.push("\r\n")
										items++
										if (items == itemsPorPagina) {
											items = 0;
											pagina = pagina + 1;
											texto.push(cabezera)

										}
									}

								}
							}
						}
					}


					texto.push("\t")
					texto.push("TOTAL " + cuenta.nombre);
					texto.push("\t\t\t\t")
					texto.push(number_format(cuenta.total, 2));

					var cuentatotalSus = cuenta.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) texto.push("\t\t\t\t"); texto.push(number_format(cuentatotalSus, 2));
					if (i === (cuentasSubGrupo.length - 1)) {
						//$scope.DibujarFijoApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
						//$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
					/* 	y = y + 20;
						items++; */
				} else {
					if (i === (cuentasSubGrupo.length - 1)) {
						//	$scope.DibujarFijoApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
						//$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

					}
				}

			}
			if ($scope.configuracionImpresion.usar_firma_uno) {
				//doc.text($scope.configuracionImpresion.firma_uno, 170, 720);
				//doc.text($scope.configuracionImpresion.cargo_uno, 170, 730);
			}
			if ($scope.configuracionImpresion.usar_firma_dos) {
				//doc.text($scope.configuracionImpresion.firma_dos, 370, 720);
				//doc.text($scope.configuracionImpresion.cargo_dos, 370, 730);
			}

			blockUI.stop();
			return new Blob(texto, {
				type: 'text/plain'
			});
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			/* 	$scope.eliminarPopup(); */

		});

		$scope.generarPdfComprobanteDiario =function(){

			$scope.periodo = $scope.configuracionImpresion.tipoPeriodo.nombre;
			$scope.cuenta = $scope.configuracionImpresion.tipo_cuenta.nombre;
			var meses = new Array(["Enero",1],["Febrero",2],["Marzo",3],["Abril",4],["Mayo",5],["Junio",6]
			,["Julio",7],["Agosto",8],["Septiembre",9],["Octubre",10],["Noviembre",11],
				["Diciembre",12]);

			if($scope.bimonetario == false){
				if($scope.cuenta === "PREESTABLECIDO"){
					if ($scope.periodo === "GESTIÓN" ) {
						var inicio = $scope.fechasImpresion.inicio;
						var fin = $scope.fechasImpresion.fin;
						var anio =  $scope.configuracionImpresion.gestion.nombre;
						var fechaInicio = new Date($scope.convertirFecha(inicio+"/"+anio));
						var fechaFin = new Date($scope.convertirFecha(fin+"/"+anio));

						var message = "DEBITO-RETENCION JUDICIAL, Gobierno Municipal de Cochabamba. Motivo (Impuestos de vehiculos realizados en cbba)";
						console.log(message.length);

					}else if($scope.periodo === "MES"){
						var anio = $scope.configuracionImpresion.gestion.nombre;
						var mes = $scope.configuracionImpresion.mes.nombre;
						for(var i = 0; i < meses.length;i++){
							if (mes === meses[i][0]) {
								mes = meses[i][1]; 
							}
						}
						var fechaInicio = mes+"/"+"01"+"/"+anio;
								
						var date = new Date(fechaInicio);
						var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);				
						var ultimoDia = new Date(date.getFullYear(), (date.getMonth() + 1), 0);
						var finDia = ultimoDia.getDate();
						var fechaFin = mes+"/"+finDia+"/"+anio;
						$scope.imprimirReportePDF(primerDia,ultimoDia);
						
					}else if ($scope.periodo === "FECHAS") {
						var primerDia = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio));
						var ultimoDia = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin)); 
						$scope.imprimirReportePDF(primerDia,ultimoDia);

					}else if ($scope.periodo === "COMPARATIVO") {
						$scope.mostrarMensaje("No es aplicable esta funcion.!");
					}
				}else{
					$scope.mostrarMensaje("No se aplica a esta funcion")
				}
			}else{
				$scope.mostrarMensaje("No se aplica la funcion bimonetaria al libro diario")
			}	
		}

		$scope.imprimirReportePDF = function(inicio,fin){
			blockUI.start();	
			var id_empresa = $scope.usuario.empresa.id;	
			var promesa = TodosComprobante(id_empresa,inicio,fin);
			var empresa = {};

            promesa.then(function(datos){                  
				$scope.datosReporte = datos.comprobantes;
				
				var razon_social=$scope.datosReporte[0].sucursal.empresa.razon_social;
				var nit = $scope.datosReporte[0].sucursal.empresa.nit;
				var direccion = $scope.datosReporte[0].sucursal.empresa.direccion;
				empresa = {razon_social,nit,direccion};

				var doc = new PDFDocument({ compress: false, margin: 10 });
				var stream = doc.pipe(blobStream());
				doc.font('Helvetica', 8);
				var y = 180, itemsPorPagina = 22, items = 0, pagina = 1;
				var cant = 0;
				for (let i = 0; i < $scope.datosReporte.length; i++) {				
					cant += $scope.datosReporte[i].asientosContables.length;										
				}
				var totalPaginas = Math.ceil(cant / itemsPorPagina);
				$scope.dibujarCabeceraPDFReporteGestion(doc, empresa, pagina, totalPaginas);

				var indice = 1;
				for (var i = 0; i < $scope.datosReporte.length && items <= itemsPorPagina; i++) {
					$scope.comprobante = $scope.datosReporte[i];

					var myDate = new Date($scope.comprobante.fecha);
					var fecha = myDate.getFullYear()+"/"+(myDate.getMonth() + 1)+"/"+myDate.getDate();
					doc.text(fecha,45,y);
					y = y + 10;
					doc.text("- "+(indice++)+" -",350,y);
					for(var j = 0;j< $scope.comprobante.asientosContables.length && items <= itemsPorPagina;j++){
						$scope.asientoContable = $scope.comprobante.asientosContables[j];

						doc.text($scope.asientoContable.glosa,100,y,{width:220});
						if ($scope.asientoContable.glosa.length >= 100) {
							doc.text("",100,y);
							if($scope.asientoContable.debe_bs != 0){
								doc.text($scope.asientoContable.debe_bs,440,y);
							}else{
								doc.text(" ",440,y);
							}
							if($scope.asientoContable.haber_bs != 0){
								doc.text($scope.asientoContable.haber_bs,530,y);
							}else{
								doc.text(" ",530,y);
							}
							y = y + 10
						}else if ($scope.asientoContable.glosa.length >= 45) {

							doc.text("",100,y);
							if($scope.asientoContable.debe_bs != 0){
								doc.text($scope.asientoContable.debe_bs,440,y);
							}else{
								doc.text(" ",440,y);
							}
							if($scope.asientoContable.haber_bs != 0){
								doc.text($scope.asientoContable.haber_bs,530,y);
							}else{
								doc.text(" ",530,y);
							}
							y = y + 5
						}else{
							
							if($scope.asientoContable.debe_bs != 0){
								doc.text($scope.asientoContable.debe_bs,440,y);
							}else{
								doc.text(" ",440,y);
							}
							if($scope.asientoContable.haber_bs != 0){
								doc.text($scope.asientoContable.haber_bs,530,y);
							}else{
								doc.text(" ",530,y);
							}
						}
						

						y = y + 17;
						items++;

						if (items == itemsPorPagina || i + 1 == $scope.datosReporte.length) {
							if (i + 1 == $scope.datosReporte.length) {

							} else {
								doc.addPage({ margin: 0, bufferPages: true });
								y = 180;
								items = 0;
								pagina = pagina + 1;
								$scope.dibujarCabeceraPDFReporteGestion(doc, empresa, pagina, totalPaginas);
								doc.font('Helvetica', 8);
							}
						}
					}
				}

				/*var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 45, 750);
				doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, 750);
*/
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});

				blockUI.stop();
            })
		}

		$scope.dibujarCabeceraPDFReporteGestion = function (doc, datos, pagina, totalPaginas) {
			doc.font('Helvetica-Bold', 10);
			doc.text(datos.razon_social,45,70);
			doc.font('Helvetica-Bold', 10);
			doc.text("NIT: "+datos.nit,45,80);
			doc.font('Helvetica-Bold', 10);
			doc.text("Calle: "+datos.direccion,45,90,{width: 350});
			if (datos.direccion.length > 57) {
				doc.font('Helvetica-Bold', 10);
				doc.text("Cochabamba - Bolivia",45,109);
			}else{
				doc.font('Helvetica-Bold', 10);
				doc.text("Cochabamba - Bolivia",45,100);
			}
			doc.rect(43, 67, 400, 47).stroke();
			doc.font("Helvetica-Bold",17);
			doc.text("LÍBRO DIARIO",0,125,{ align: "center" });
			doc.font("Helvetica-Bold",10);

			doc.font("Helvetica-Bold",10);
			doc.text("FECHA",45,150);

			doc.font("Helvetica-Bold",10);
			doc.text("TÍTULO DE LAS CUENTAS ",280,150);
			
			doc.font("Helvetica-Bold",10);
			doc.text("DEBE",430,150);

			doc.font("Helvetica-Bold",10);
			doc.text("HABER",520,150);


			doc.font('Helvetica', 8);
			doc.text("Pagina " + pagina + " de " + totalPaginas, 500, 750);
		}


		$scope.generarExcelComprobanteDiario =function(){
			$scope.periodo = $scope.configuracionImpresion.tipoPeriodo.nombre;
			$scope.cuenta = $scope.configuracionImpresion.tipo_cuenta.nombre;
			var meses = new Array(["Enero",1],["Febrero",2],["Marzo",3],["Abril",4],["Mayo",5],["Junio",6]
			,["Julio",7],["Agosto",8],["Septiembre",9],["Octubre",10],["Noviembre",11],
				["Diciembre",12]);

			if($scope.bimonetario == false){
				if($scope.cuenta === "PREESTABLECIDO"){	
					if ($scope.periodo === "GESTIÓN" ) {
						var inicio = $scope.fechasImpresion.inicio;
						var fin = $scope.fechasImpresion.fin;
						var anio =  $scope.configuracionImpresion.gestion.nombre;
						var fechaInicio = inicio+"/"+anio;
						var fechaFin = fin+"/"+anio;

						$scope.imprimirReporteExcel(fechaInicio,fechaFin);

					}else if($scope.periodo === "MES"){
						var anio = $scope.configuracionImpresion.gestion.nombre;
						var mes = $scope.configuracionImpresion.mes.nombre;
						for(var i = 0; i < meses.length;i++){
							if (mes === meses[i][0]) {
								mes = meses[i][1]; 
							}
						}
						var fechaInicio = mes+"/"+"01"+"/"+anio;
								
						var date = new Date(fechaInicio);
						var primerDia = new Date(date.getFullYear(), date.getMonth(), 1);				
						var ultimoDia = new Date(date.getFullYear(), (date.getMonth() + 1), 0);
						var finDia = ultimoDia.getDate();
						var fechaFin = mes+"/"+finDia+"/"+anio;
						$scope.imprimirReporteExcel(primerDia,ultimoDia);
						
					}else if ($scope.periodo === "FECHAS") {
						var primerDia = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio));
						var ultimoDia = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin)); 
						$scope.imprimirReporteExcel(primerDia,ultimoDia);
						
					}else if ($scope.periodo === "COMPARATIVO") {
						$scope.mostrarMensaje("No es aplicable esta funcion.!");
					}
				}else{
					$scope.mostrarMensaje("No se aplica a esta funcion")
				}
			}else{
				$scope.mostrarMensaje("No se aplica la funcion bimonetaria al libro diario")
			}	
		}

	$scope.imprimirReporteExcel = function(inicio,fin){
			
		blockUI.start();
		var id_empresa = $scope.usuario.empresa.id;	

		var promesa = TodosComprobante(id_empresa, inicio, fin);
		promesa.then(function (datos) {
			var datosComprobante = datos.comprobantes;
			var data = []
			var cabecera = ["N° CUENTA","FECHA","TITULO DE LA CUENTA","DEBE","HABER"];
			data.push(cabecera);
			var index = 0;
			for (var i = 0; i < datosComprobante.length; i++) {		
				$scope.comprobante = datosComprobante[i];
				index = index + 1;
				for (let j = 0; j < $scope.comprobante.asientosContables.length; j++) {
					$scope.asientoContable = $scope.comprobante.asientosContables[j]
					var columns = [];

					columns.push(index);
					var myDate = new Date($scope.comprobante.fecha);
					var fecha = myDate.getFullYear()+"/"+(myDate.getMonth() + 1)+"/"+myDate.getDate();
					columns.push(fecha);
					columns.push($scope.asientoContable.glosa);					
					columns.push($scope.asientoContable.debe_bs);
					columns.push($scope.asientoContable.haber_bs);


					data.push(columns);
				}
				
			}

			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "VENTAS-MENSUALES.xlsx");
			blockUI.stop();
		});

	}

		$scope.inicio();
	});



