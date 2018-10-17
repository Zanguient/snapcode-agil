angular.module('agil.controladores')

	.controller('ControladorBalanceGeneral', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipoEmpresa, ClasesTipo, ObtenerConfiguracionImpresion, CuentasContabilidadEEFF, ObtenerGestionesEEFF) {


		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerTiposPeriodos()
			$scope.obtenerGestiones()
			$scope.obtenerTiposCuenta()
			$scope.obtenerConfiguracionImpresion()
			$scope.obtenerGestionesImpresion()
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
						$scope.generarPdfPreestablecido(dato, x)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
						$scope.generarPdfPreestablecido(dato, x)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
						$scope.generarPdfGrupo(dato, x)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
						$scope.generarPdfsubGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas, dato.cuentasApropiacion)
					} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
						$scope.generarPdfApropiacion(dato, x)
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
		$scope.generarPdfApropiacion = function (dato, x) {

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;

			var datos = 2000
			/* var datosPasivo = [] */
			var y = 130, itemsPorPagina = 25, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			var totalActivos = 0
			var totalPasivo = 0
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < dato.cuentasActivos.length && items <= itemsPorPagina; i++) {
				cuentaGrupo = dato.cuentasActivos[i]
				if (cuentaGrupo.hijos.length > 0) {
					for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
						cuentaSubGrupo = cuentaGrupo.hijos[j]
						cuentaSubGrupo.total = 0
						doc.text(cuentaSubGrupo.nombre, 30, y)
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
						for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
							cuentaGenerica = cuentaSubGrupo.hijos[k]
							cuentaGenerica.total = 0
							doc.text(cuentaGenerica.nombre, 40, y)
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
							for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
								cuentasApropiacion = cuentaGenerica.hijos[l]
								cuentaGenerica.total += cuentasApropiacion.saldo
								cuentaSubGrupo.total += cuentasApropiacion.saldo
								totalActivos += cuentasApropiacion.saldo
								doc.text(cuentasApropiacion.nombre, 50, y)
								doc.text(number_format(cuentasApropiacion.saldo, 2), x, y)
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
							}
							doc.text("TOTAL " + cuentaGenerica.nombre, 90, y);
							var cuentatotalSus = cuentaGenerica.total / $scope.moneda.dolar
							if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
							doc.text(number_format(cuentaGenerica.total, 2), x, y)
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
						}

						doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
						var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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
						if (j === (cuentaGrupo.hijos.length - 1)) {
							$scope.DibujarFijoApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
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
			doc.font('Helvetica', 8);
			if (dato.cuentasFijos.length > 0) {
				for (var i = 0; i < dato.cuentasFijos.length && items <= itemsPorPagina; i++) {
					cuentaGrupo = dato.cuentasFijos[i]
					if (cuentaGrupo.hijos.length > 0) {
						for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
							cuentaSubGrupo = cuentaGrupo.hijos[j]
							cuentaSubGrupo.total = 0
							doc.text(cuentaSubGrupo.nombre, 30, y)
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
							for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
								cuentaGenerica = cuentaSubGrupo.hijos[k]
								cuentaGenerica.total = 0
								doc.text(cuentaGenerica.nombre, 40, y)
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
								for (var d = 0; d < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; d++) {
									cuentaGenericaDepre = cuentaSubGrupo.hijos[d]
									var cod = String(cuentaGenericaDepre.codigo).substr(2)
									var codDos = String(cuentaGenerica.codigo).substr(2)
									if (codDos == cod) {
										if (cuentaGenerica.id != cuentaGenericaDepre.id) {
											doc.text(cuentaGenericaDepre.nombre, 40, y)
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
										}
									}
									if (d == (cuentaSubGrupo.hijos.length - 1)) {
										for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
											cuentasApropiacion = cuentaGenerica.hijos[l]
											cuentaGenerica.total += cuentasApropiacion.saldo
											cuentaSubGrupo.total += cuentasApropiacion.saldo
											totalActivos += cuentasApropiacion.saldo
											doc.text(cuentasApropiacion.nombre, 50, y)
											doc.text(cuentasApropiacion.saldo, x, y)
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
										}
									}
								}
								doc.text("TOTAL " + cuentaGenerica.nombre, 90, y);
								var cuentatotalSus = cuentaGenerica.total / $scope.moneda.dolar
								if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
								doc.text(number_format(cuentaGenerica.total, 2), x, y)
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
							}

							doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
							var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
							if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
							doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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

						}
					}
					if (i === (dato.cuentasFijos.length - 1)) {
						$scope.dibujarPatrimonioApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
					}
				}
			} else {
				$scope.dibujarPatrimonioApropiacion(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
			}

		}
		$scope.DibujarFijoPreestablecido = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			doc.font('Helvetica', 8);
			if (dato.cuentasFijos.length > 0) {
				for (var i = 0; i < dato.cuentasFijos.length && items <= itemsPorPagina; i++) {
					cuentaGrupo = dato.cuentasFijos[i]
					if (cuentaGrupo.hijos.length > 0) {
						for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
							cuentaSubGrupo = cuentaGrupo.hijos[j]
							cuentaSubGrupo.total = 0
							doc.text(cuentaSubGrupo.nombre, 30, y)
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
							for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
								cuentaGenerica = cuentaSubGrupo.hijos[k]
								cuentaGenerica.total = 0
								doc.text(cuentaGenerica.nombre, 40, y)
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
								for (var d = 0; d < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; d++) {
									cuentaGenericaDepre = cuentaSubGrupo.hijos[d]

									var cod = String(cuentaGenericaDepre.codigo).substr(2)
									var codDos = String(cuentaGenerica.codigo).substr(2)
									if (codDos == cod) {
										doc.font('Helvetica', 8);
										if (cuentaGenerica.id != cuentaGenericaDepre.id) {
											doc.text(cuentaGenericaDepre.nombre, 40, y)
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
										}
									}
									if (d == (cuentaSubGrupo.hijos.length - 1)) {
										for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
											cuentasApropiacion = cuentaGenerica.hijos[l]
											cuentaGenerica.total += cuentasApropiacion.saldo
											cuentaSubGrupo.total += cuentasApropiacion.saldo
											totalActivos += cuentasApropiacion.saldo
										}
									}

								}
								doc.text(number_format(cuentaGenerica.total, 2), x, y - 20)

							}

							doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
							var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
							if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
							doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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

						}
					}
					if (i === (dato.cuentasFijos.length - 1)) {
						$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
					}
				}
			} else {
				$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
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
			doc.font('Helvetica', 8);
			if (dato.cuentasFijos.length > 0) {
				for (var i = 0; i < dato.cuentasFijos.length && items <= itemsPorPagina; i++) {
					cuentaGrupo = dato.cuentasFijos[i]
					if (cuentaGrupo.hijos.length > 0) {
						for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
							cuentaSubGrupo = cuentaGrupo.hijos[j]
							cuentaSubGrupo.total = 0
							doc.text(cuentaSubGrupo.nombre, 30, y)

							for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
								cuentaGenerica = cuentaSubGrupo.hijos[k]
								cuentaGenerica.total = 0
								for (var d = 0; d < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; d++) {
									cuentaGenericaDepre = cuentaSubGrupo.hijos[d]


									if (d == (cuentaSubGrupo.hijos.length - 1)) {
										for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
											cuentasApropiacion = cuentaGenerica.hijos[l]
											cuentaGenerica.total += cuentasApropiacion.saldo
											cuentaSubGrupo.total += cuentasApropiacion.saldo
											totalActivos += cuentasApropiacion.saldo
										}
									}

								}
								//doc.text(number_format(cuentaGenerica.total, 2), x, y - 20)

							}
							doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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
							doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
							var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
							if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
							doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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

						}
					}
					if (i === (dato.cuentasFijos.length - 1)) {
						$scope.dibujarPatrimonioSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
					}
				}
			} else {
				$scope.dibujarPatrimonioSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
			}

		}
		$scope.DibujarFijoGrupo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			doc.font('Helvetica', 8);
			if (dato.cuentasFijos.length > 0) {
				for (var i = 0; i < dato.cuentasFijos.length && items <= itemsPorPagina; i++) {
					cuentaGrupo = dato.cuentasFijos[i]
					cuentaGrupo.total = 0
					if (cuentaGrupo.hijos.length > 0) {
						for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
							cuentaSubGrupo = cuentaGrupo.hijos[j]
							for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
								cuentaGenerica = cuentaSubGrupo.hijos[k]
								cuentaGenerica.total = 0
								for (var d = 0; d < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; d++) {
									cuentaGenericaDepre = cuentaSubGrupo.hijos[d]
									if (d == (cuentaSubGrupo.hijos.length - 1)) {
										for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
											cuentasApropiacion = cuentaGenerica.hijos[l]
											cuentaGenerica.total += cuentasApropiacion.saldo
											cuentaGrupo.total += cuentasApropiacion.saldo
											totalActivos += cuentasApropiacion.saldo
										}
									}

								}
							}
						}
					}
					if (i === (dato.cuentasFijos.length - 1)) {
						$scope.dibujarPatrimonioGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
					}
				}
			} else {
				$scope.dibujarPatrimonioGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
			}

		}
		$scope.dibujarPatrimonioApropiacion = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {

			var totalPasivo = 0
			doc.font('Helvetica-Bold', 8);
			doc.text("TOTAL ACTIVOS  ", 30, y);
			doc.text(number_format(totalActivos, 2), x, y);

			var cuentatotalSus = totalActivos / $scope.moneda.dolar
			if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
			y += 20
			items++;
			doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
			doc.font('Helvetica', 8);
			y += 20
			items++;
			for (var i = 0; i < dato.cuentasPasivosPatrimonios.length && items <= itemsPorPagina; i++) {
				cuentaGrupo = dato.cuentasPasivosPatrimonios[i]
				if (cuentaGrupo.hijos.length > 0) {
					for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
						cuentaSubGrupo = cuentaGrupo.hijos[j]
						cuentaSubGrupo.total = 0
						doc.text(cuentaSubGrupo.nombre, 30, y)
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
						for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
							cuentaGenerica = cuentaSubGrupo.hijos[k]
							cuentaGenerica.total = 0
							doc.text(cuentaGenerica.nombre, 40, y)
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
							for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
								cuentasApropiacion = cuentaGenerica.hijos[l]
								cuentaGenerica.total += cuentasApropiacion.saldo
								cuentaSubGrupo.total += cuentasApropiacion.saldo
								totalPasivo += cuentasApropiacion.saldo
								doc.text(cuentasApropiacion.nombre, 50, y)
								doc.text(cuentasApropiacion.saldo, x, y)
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
							}
							doc.text("TOTAL " + cuentaGenerica.nombre, 90, y);
							var cuentatotalSus = cuentaGenerica.total / $scope.moneda.dolar
							if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
							doc.text(number_format(cuentaGenerica.total, 2), x, y)
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
						}

						doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
						var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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

					}
				}
				if (i === (dato.cuentasPasivosPatrimonios.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL PASIVO Y PATRIMONIO:  ", 30, y)
					doc.text(number_format(totalPasivo, 2), x, y)
					var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
				}
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
									cuenta2.saldo=(cuenta2.debe>cuenta2.haber)?cuenta2.saldo:-(cuenta.saldo)
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
					doc.text("TOTAL PASIVO Y PATRIMONIO:  ", 30, y)
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
			doc.font('Helvetica', 8);
			y += 20
			items++;
			for (var i = 0; i < dato.cuentasPasivosPatrimonios.length && items <= itemsPorPagina; i++) {
				cuentaGrupo = dato.cuentasPasivosPatrimonios[i]
				if (cuentaGrupo.hijos.length > 0) {
					for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
						cuentaSubGrupo = cuentaGrupo.hijos[j]
						cuentaSubGrupo.total = 0
						doc.text(cuentaSubGrupo.nombre, 30, y)
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
						for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
							cuentaGenerica = cuentaSubGrupo.hijos[k]
							cuentaGenerica.total = 0
							doc.text(cuentaGenerica.nombre, 40, y)
							for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
								cuentasApropiacion = cuentaGenerica.hijos[l]
								cuentaGenerica.total += cuentasApropiacion.saldo
								cuentaSubGrupo.total += cuentasApropiacion.saldo
								totalPasivo += cuentasApropiacion.saldo
							}
							doc.text(number_format(cuentaGenerica.total, 2), x, y)
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
						}

						doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
						var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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

					}
				}
				if (i === (dato.cuentasPasivosPatrimonios.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL PASIVO Y PATRIMONIO:  ", 30, y)
					doc.text(number_format(totalPasivo, 2), x, y)
					var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
				}
			}
		}
		$scope.dibujarPatrimonioSubGrupo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {

			var totalPasivo = 0
			doc.font('Helvetica-Bold', 8);
			doc.text("TOTAL ACTIVOS  ", 30, y);
			doc.text(number_format(totalActivos, 2), x, y);

			var cuentatotalSus = totalActivos / $scope.moneda.dolar
			if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
			y += 20
			items++;
			doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
			doc.font('Helvetica', 8);
			y += 20
			items++;
			for (var i = 0; i < dato.cuentasPasivosPatrimonios.length && items <= itemsPorPagina; i++) {
				cuentaGrupo = dato.cuentasPasivosPatrimonios[i]
				if (cuentaGrupo.hijos.length > 0) {
					for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
						cuentaSubGrupo = cuentaGrupo.hijos[j]
						cuentaSubGrupo.total = 0
						doc.text(cuentaSubGrupo.nombre, 30, y)

						for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
							cuentaGenerica = cuentaSubGrupo.hijos[k]
							cuentaGenerica.total = 0

							for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
								cuentasApropiacion = cuentaGenerica.hijos[l]
								cuentaGenerica.total += cuentasApropiacion.saldo
								cuentaSubGrupo.total += cuentasApropiacion.saldo
								totalPasivo += cuentasApropiacion.saldo
							}

						}
						doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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
						doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
						var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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

					}
				}
				if (i === (dato.cuentasPasivosPatrimonios.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL PASIVO Y PATRIMONIO:  ", 30, y)
					doc.text(number_format(totalPasivo, 2), x, y)
					var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
				}
			}
		}
		$scope.dibujarPatrimonioGrupo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {

			var totalPasivo = 0
			doc.font('Helvetica-Bold', 8);
			doc.text("TOTAL ACTIVOS  ", 30, y);
			doc.text(number_format(totalActivos, 2), x, y);
			var cuentatotalSus = totalActivos / $scope.moneda.dolar
			if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
			y += 20
			items++;
			doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
			doc.font('Helvetica', 8);
			y += 20
			items++;
			for (var i = 0; i < dato.cuentasPasivosPatrimonios.length && items <= itemsPorPagina; i++) {
				cuentaGrupo = dato.cuentasPasivosPatrimonios[i]
				cuentaGrupo.total = 0
				doc.text(cuentaGrupo.nombre, 30, y)

				if (cuentaGrupo.hijos.length > 0) {
					for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
						cuentaSubGrupo = cuentaGrupo.hijos[j]
						for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
							cuentaGenerica = cuentaSubGrupo.hijos[k]
							cuentaGenerica.total = 0
							for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
								cuentasApropiacion = cuentaGenerica.hijos[l]
								cuentaGenerica.total += cuentasApropiacion.saldo
								cuentaGrupo.total += cuentasApropiacion.saldo
								totalPasivo += cuentasApropiacion.saldo
							}
						}
					}
					doc.text(number_format(cuentaGrupo.total, 2), x, y)
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
					doc.text("TOTAL " + cuentaGrupo.nombre, 90, y);
					var cuentatotalSus = cuentaGrupo.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
					doc.text(number_format(cuentaGrupo.total, 2), x, y)
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
				}
				if (i === (dato.cuentasPasivosPatrimonios.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL PASIVO Y PATRIMONIO:  ", 30, y)
					doc.text(number_format(totalPasivo, 2), x, y)
					var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
				}
			}
		}
		$scope.generarPdfPreComparativo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {

		}
		$scope.generarPdfGrupo = function (dato, x) {

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var datos = 2000
			/* var datosPasivo = [] */
			var y = 130, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			var totalActivos = 0
			var totalPasivo = 0
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < dato.cuentasActivos.length && items <= itemsPorPagina; i++) {
				cuentaGrupo = dato.cuentasActivos[i]
				cuentaGrupo.total = 0
				doc.text(cuentaGrupo.nombre, 30, y)
				if (cuentaGrupo.hijos.length > 0) {
					for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
						cuentaSubGrupo = cuentaGrupo.hijos[j]
						for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
							cuentaGenerica = cuentaSubGrupo.hijos[k]
							cuentaGenerica.total = 0

							for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
								cuentasApropiacion = cuentaGenerica.hijos[l]
								cuentaGrupo.total += cuentasApropiacion.saldo
								totalActivos += cuentasApropiacion.saldo
							}
						}

					}
					doc.text(number_format(cuentaGrupo.total, 2), x, y)
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
					doc.text("TOTAL " + cuentaGrupo.nombre, 90, y);
					var cuentatotalSus = cuentaGrupo.total / $scope.moneda.dolar
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
					doc.text(number_format(cuentaGrupo.total, 2), x, y)
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

				}
				if (i === (dato.cuentasActivos.length - 1)) {
					$scope.DibujarFijoGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

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
		$scope.obtenercodigoCuenta = function (codigo) {
			var checkOK = "123456789";
			var checkStr = codigo;
			var allValid = true;
			var decPoints = 0;
			var nuevoString = "";
			for (i = 0; i < checkStr.length; i++) {
				ch = checkStr.charAt(i);
				for (j = 0; j < checkOK.length; j++) {
					if (ch == checkOK.charAt(j)) {
						nuevoString = nuevoString + ch;
					}
				}
			}
			return nuevoString;
		}
		$scope.generarPdfsubGrupo = function (dato, x) {

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var datos = 2000
			/* var datosPasivo = [] */
			var y = 130, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			var totalActivos = 0
			var totalPasivo = 0
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < dato.cuentasActivos.length && items <= itemsPorPagina; i++) {
				cuentaGrupo = dato.cuentasActivos[i]
				if (cuentaGrupo.hijos.length > 0) {
					for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
						cuentaSubGrupo = cuentaGrupo.hijos[j]
						cuentaSubGrupo.total = 0
						doc.text(cuentaSubGrupo.nombre, 30, y)

						for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
							cuentaGenerica = cuentaSubGrupo.hijos[k]
							cuentaGenerica.total = 0

							for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
								cuentasApropiacion = cuentaGenerica.hijos[l]
								cuentaSubGrupo.total += cuentasApropiacion.saldo
								totalActivos += cuentasApropiacion.saldo
							}
						}
						doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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
						doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
						var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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
						if (j === (cuentaGrupo.hijos.length - 1)) {
							$scope.DibujarFijoSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
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
		$scope.generarPdfPreestablecido = function (dato, x) {

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var datos = 2000
			/* var datosPasivo = [] */
			var y = 130, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			var totalActivos = 0
			var totalPasivo = 0
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < dato.cuentasActivos.length && items <= itemsPorPagina; i++) {
				cuentaGrupo = dato.cuentasActivos[i]
				if (cuentaGrupo.hijos.length > 0) {
					for (var j = 0; j < cuentaGrupo.hijos.length && items <= itemsPorPagina; j++) {
						cuentaSubGrupo = cuentaGrupo.hijos[j]
						cuentaSubGrupo.total = 0
						doc.text(cuentaSubGrupo.nombre, 30, y)
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
						for (var k = 0; k < cuentaSubGrupo.hijos.length && items <= itemsPorPagina; k++) {
							cuentaGenerica = cuentaSubGrupo.hijos[k]
							cuentaGenerica.total = 0
							doc.text(cuentaGenerica.nombre, 40, y)
							for (var l = 0; l < cuentaGenerica.hijos.length && items <= itemsPorPagina; l++) {
								cuentasApropiacion = cuentaGenerica.hijos[l]
								cuentaGenerica.total += cuentasApropiacion.saldo
								cuentaSubGrupo.total += cuentasApropiacion.saldo
								totalActivos += cuentasApropiacion.saldo
							}
							doc.text(number_format(cuentaGenerica.total, 2), x, y)
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
						}

						doc.text("TOTAL " + cuentaSubGrupo.nombre, 90, y);
						var cuentatotalSus = cuentaSubGrupo.total / $scope.moneda.dolar
						if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
						doc.text(number_format(cuentaSubGrupo.total, 2), x, y)
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
						if (j === (cuentaGrupo.hijos.length - 1)) {
							$scope.DibujarFijoPreestablecido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
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
										cuenta2.saldo=(cuenta2.debe>cuenta2.haber)?cuenta2.saldo:-(cuenta.saldo)										
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

				if (cuenta.clasificacionTipoClasificacionNombre === "ACTIVO") {
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

				if (cuenta.clasificacionTipoClasificacionNombre === "ACTIVO") {
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
									cuenta2.saldo=(cuenta2.debe>cuenta2.haber)?cuenta2.saldo:-(cuenta.saldo)
									var cod = String(cuenta2.codigo).substr(0, 5)
									if (cuenta3.codigo == cod) {
										texto.push("\t\t")
										if (cuenta2.nombre.length > 22) {
											text1 = String(cuenta2.nombre).substr(0, 22)
											text2 = String(cuenta2.nombre).substr(22)
											texto.push(text1)
											texto.push("\n\r\t\t"); items++
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

		$scope.inicio();
	});



