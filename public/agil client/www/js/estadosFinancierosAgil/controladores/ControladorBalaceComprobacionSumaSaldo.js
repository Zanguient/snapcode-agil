angular.module('agil.controladores')

	.controller('ControladorBalaceComprobacionSumaSaldo', function ($scope, $localStorage, $location, $filter, $templateCache, $route, blockUI,
		ClasesTipoEmpresa, ClasesTipo, ObtenerConfiguracionImpresion, CuentasContabilidadEEFF, ObtenerGestionesEEFF, Paginator, CuentaContabilidad, BalanceComprobacionSS) {


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
                $scope.TiposPeriodos = entidad;
                
                $scope.TiposPeriodos.clases.forEach(function(element, index, array){
                    if(element.nombre === 'COMPARATIVO'){
                        $scope.TiposPeriodos.clases.splice(index, 1);    
                    }
                });
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
        
        
		$scope.generarPdfBalanceComprobacionSS = function () {
			// blockUI.start();
			if ($scope.configuracionImpresion.fecha_inicio) {
				$scope.configuracionImpresion.inicio2 = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_inicio))
				$scope.configuracionImpresion.fin2 = new Date($scope.convertirFecha($scope.configuracionImpresion.fecha_fin))
			}
			$scope.configuracionImpresion.fechasImpresion = $scope.fechasImpresion
			var promesa = BalanceComprobacionSS($scope.configuracionImpresion, $scope.usuario.id_empresa);
			promesa.then(function (dato) {
                console.log("los datos para PDF yeeeee ", dato);
				// if (dato.monedaCambio) {
				// 	$scope.moneda = dato.monedaCambio;

				// } else {
				// 	$scope.moneda = { ufv: "--", dolar: "--" }
				// }
				var totalActivos = 0
                var x = ($scope.configuracionImpresion.bimonetario) ? 400 : 530
                $scope.generarPdfApropiacion(dato, x)
                
                blockUI.stop();
				
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
			var datos = dato.length
			var datosPasivo = []
			var y = 130, altura=0, itemsPorPagina = 28, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos) / itemsPorPagina) : Math.ceil((datos) / itemsPorPagina);
			var totalActivos = 0
			var totalPasivo = 0
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
            doc.font('Helvetica', 8);
            
			for (var i = 0; i < dato.cuentas.length; i++) {
                
                doc.text(dato.cuentas[i].cuenta.nombre, 60, y)
                doc.text(dato.cuentas[i].debe_bs, 300, y)
                doc.text(dato.cuentas[i].haber_bs, 370, y)
                
                if (dato.cuentas[i].debe_bs > dato.cuentas[i].haber_bs) {
                    var duedor = dato.cuentas[i].debe_bs -  dato.cuentas[i].haber_bs;
                    doc.text(duedor.toFixed(2), 440, y)
                }else{
                    var duedor = dato.cuentas[i].haber_bs -  dato.cuentas[i].debe_bs;
                    doc.text(duedor.toFixed(2), 510, y)
                }
                /*doc.text(number_format(cuenta.saldo,2), 530, y); */
                /* total+=cuenta.saldo */
                // doc.rect(50, 103, 520, 20).stroke();
                doc.rect(50, y - 7, 230, 20).stroke();
                // doc.rect(365, y - 7, 0, 20).stroke();
                // doc.rect(435, y - 7, 0, 20).stroke();
                // doc.rect(505, y - 7, 0, 20).stroke();
                // doc.rect(570, y - 7, 0, 20).stroke();
                altura = altura+20;
                y = y + 20;
                items = items + 1;

                if (items == itemsPorPagina) {
                    doc.rect(295, 123, 70, altura).stroke();
                    doc.rect(365, 123, 70, altura).stroke();
                    doc.rect(435, 123, 70, altura).stroke();
                    doc.rect(505, 123, 65, altura).stroke();
                    // doc.rect(50, y-7, 520, 0).stroke();
                    doc.addPage({ margin: 0, bufferPages: true });
                    y = 130;
                    altura = 7;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
                    doc.font('Helvetica', 8);
                }

                // doc.text("TOTAL " + cuenta.nombre, 90, y);
                // doc.text(number_format(cuenta.total, 2), x, y);
                // var cuentatotalSus = cuenta.total / $scope.moneda.dolar
                // if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
                // y = y + 20;
                // items++;
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
			doc.text("BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS", 0, 75, { align: "center" });
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
            //====== para bimonetariooooooo ==========
			// if ($scope.configuracionImpresion.bimonetario) {
			// 	doc.text("Expresado en Bolivianos y Dólares", 0, 95, { align: "center" });
            //     doc.text('Bolivianos', 400, 115);
            //     doc.text('Dolares', 520, 115);
			// } else {
			// 	doc.text("Expresado en Bolivianos", 0, 95, { align: "center" });
            // }
            
            doc.text("Expresado en Bolivianos", 0, 95, { align: "center" });

            // doc.text('SUMAS', 300, 110, { align: "center" });
            // doc.text('SALDOS', 370, 110, { align: "center" });
            
            doc.rect(50, 103, 520, 20).stroke();
            doc.text('DEBE', 300, 115);
            doc.text('HABER', 370, 115);
            doc.text('DEUDOR', 440, 115);
            doc.text('ACREEDOR', 510, 115);

		
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

		$scope.inicio();
	});



