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
				dato.arregloPasivos = []
				dato.arregloPatrimonio = []
				dato.arregloIngreso = []
				dato.arregloEgreso = []
				dato.arregleCostos = []
				var totalActivos = 0
				if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
					if (dato.cuentas.length > 0) {
						dato.cuentas.forEach(function (cuenta, index, array) {
							if (cuenta.clasificacion != null) {
								if (cuenta.clasificacion.nombre == 'Activo') {
									cuenta.total = 0
									dato.arregloActivos.push(cuenta)
								} else if (cuenta.clasificacion.nombre == 'Pasivo') {
									cuenta.total = 0
									dato.arregloPasivos.push(cuenta)
								} else if (cuenta.clasificacion.nombre == 'Capital') {
									cuenta.total = 0
									dato.arregloPatrimonio.push(cuenta)
								} else if (cuenta.clasificacion.nombre == 'Ingreso') {
									cuenta.total = 0
									dato.arregloIngreso.push(cuenta)
								} else if (cuenta.clasificacion.nombre == 'Egreso') {
									cuenta.total = 0
									dato.arregloEgreso.push(cuenta)
								} else if (cuenta.clasificacion.nombre == 'Costos') {
									cuenta.total = 0
									dato.arregleCostos.push(cuenta)
								}
							}

							if (index === (array.length - 1)) {
								dato.arregloPasivos = dato.arregloPasivos.concat(dato.arregloPatrimonio);
								var x = ($scope.configuracionImpresion.bimonetario) ? 400 : 530
								if ($scope.configuracionImpresion.tipo_cuenta.nombre == "PREESTABLECIDO") {
									$scope.generarPdfPreestablecido(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
								} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
									$scope.generarPdfPreestablecido(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
								} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
									$scope.generarPdfGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
								} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
									$scope.generarPdfsubGrupo(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
								} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
									$scope.generarPdfApropiacion(dato, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
								}
							}
						})
					}
				} else {
					/* var datos = {} */
					datos.arregloActivos = []
					datos.arregloPasivos = []
					datos.arregloPatrimonio = []
					datos.arregloIngreso = []
					datos.arregloEgreso = []
					datos.arregleCostos = []
					/* datos.cuentas = [] */
					dato.cuentas.forEach(function (cuenta, index, array) {
						var datos = {}
						if (cuenta.clasificacion != null) {
							datos.primerAno = cuenta
							datos.cuentas.push(datos)
						}

						if (index === (array.length - 1)) {
							dato.cuentas2.forEach(function (cuenta, index, array) {
								var datos = {}
								if (cuenta.clasificacion != null) {
									for (var i = 0; i < datos.cuentas.length; i++) {
										var element = datos.cuentas[i];
										if (element.primerAno.id == cuenta.id) {
											element.segundoAno = cuenta
										}
									}
								}

								if (index === (array.length - 1)) {
									datos.cuentas.forEach(function (cuenta, index, array) {
										if (cuenta.primerAno.clasificacion != null) {
											cuenta.primerAno.total = 0
											cuenta.segundoAno.total = 0
											if (cuenta.primerAno.clasificacion.nombre == 'Activo') {
												datos.arregloActivos.push(cuenta)
											} else if (cuenta.primerAno.clasificacion.nombre == 'Pasivo') {
												datos.arregloPasivos.push(cuenta)
											} else if (cuenta.primerAno.clasificacion.nombre == 'Capital') {
												datos.arregloPatrimonio.push(cuenta)
											} else if (cuenta.primerAno.clasificacion.nombre == 'Ingreso') {
												datos.arregloIngreso.push(cuenta)
											} else if (cuenta.primerAno.clasificacion.nombre == 'Egreso') {
												datos.arregloEgreso.push(cuenta)
											} else if (cuenta.primerAno.clasificacion.nombre == 'Costos') {
												datos.arregleCostos.push(cuenta)
											}
										}

										if (index === (array.length - 1)) {
											var x = ($scope.configuracionImpresion.bimonetario) ? 360 : 430
											if ($scope.configuracionImpresion.tipo_cuenta.nombre == "PREESTABLECIDO") {
												$scope.generarPdfPreestablecido(datos, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
											} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GENERICA") {
												$scope.generarPdfPreestablecido(datos, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
											} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "GRUPO") {
												$scope.generarPdfGrupo(datos, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
											} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "SUB GRUPO") {
												$scope.generarPdfsubGrupo(datos, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
											} else if ($scope.configuracionImpresion.tipo_cuenta.nombre == "APROPIACION") {
												$scope.generarPdfApropiacion(datos, x, dato.cuentasGrupo, dato.cuentasSubGrupo, dato.cuentasGenericas)
											}
										}
									})
								}
							})
						}
					})
					blockUI.stop();
				}
			})
		}
		$scope.generarPdfApropiacion = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas) {
			if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
				var doc = new PDFDocument({ size: 'letter', margin: 10 });
				var stream = doc.pipe(blobStream());
				// draw some text
				var totalCosto = 0;
				var datos = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
				var datosPasivo = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
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
							y = 130;
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
									if (dato.arregloActivos.some(function (cuenta2) {
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


										for (var p = 0; p < dato.arregloActivos.length && items <= itemsPorPagina; p++) {
											cuenta2 = dato.arregloActivos[p]
											if (cuenta2.tipoCuenta.nombre_corto === "4") {
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
														y = 130;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												} else {
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 130;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 130;
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
										y = 130;
										items = 0;
										pagina = pagina + 1;
										$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
										doc.font('Helvetica', 8);
									}
								}
							} else {
								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 130;
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
							$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (cuentasSubGrupo.length - 1)) {
							$scope.dibujarPatrimonio(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

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
							y = 130;
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
									if (dato.arregloPasivos.some(function (cuenta2) {
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
										for (var p = 0; p < dato.arregloPasivos.length && items <= itemsPorPagina; p++) {
											var cuenta2 = dato.arregloPasivos[p]
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
														y = 130;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
														doc.font('Helvetica', 8);
													}
												} else {
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 130;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
														doc.font('Helvetica', 8);
													}
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 130;
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
										y = 130;
										items = 0;
										pagina = pagina + 1;
										$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
										doc.font('Helvetica', 8);
									}
								}
							} else {

								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 130;
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
		$scope.dibujarPatrimonioPredefinido = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
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
					doc.font('Helvetica', 8);
					var cuenta = dato.cuentasSubGrupo[j]
					if (cuenta.clasificacion.nombre === "Pasivo") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 130;
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
									if (dato.arregloPasivos.some(function (cuenta2) {
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
										for (var p = 0; p < dato.arregloPasivos.length && items <= itemsPorPagina; p++) {
											var cuenta2 = dato.arregloPasivos[p]
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
														y = 130;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
														doc.font('Helvetica', 8);
													}
												} else {
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 130;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
														doc.font('Helvetica', 8);
													}
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 130;
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
										y = 130;
										items = 0;
										pagina = pagina + 1;
										$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
										doc.font('Helvetica', 8);
									}
								}
							} else {

								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 130;
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
		$scope.dibujarPatrimonioSubGrupo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
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
					doc.font('Helvetica', 8);
					var cuenta = dato.cuentasSubGrupo[j]
					if (cuenta.clasificacion.nombre === "Pasivo") {
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 130;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
							doc.font('Helvetica', 8);
						}
						doc.text(cuenta.nombre, 30, y)
						cuenta.total = 0
						cuenta.totalSus=0
						/* y = y + 20;
						items++; */
						for (var L = 0; L < dato.cuentasGenericas.length && items <= itemsPorPagina; L++) {
							var cuenta4 = dato.cuentasGenericas[L]
							if (cuenta4.tipoCuenta.nombre_corto === "3") {
								var cod = String(cuenta4.codigo).substr(0, 3)
								if (cuenta.codigo == cod) {
									if (dato.arregloPasivos.some(function (cuenta2) {
										var cod = String(cuenta2.codigo).substr(0, 5)
										if (cuenta4.codigo == cod) {
											return true
										} else {
											return false
										}
									})) {

										for (var p = 0; p < dato.arregloPasivos.length && items <= itemsPorPagina; p++) {
											var cuenta2 = dato.arregloPasivos[p]
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
		$scope.generarPdfPreComparativo = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {

		}
		$scope.generarPdfGrupo = function (dato, x) {
			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var datos = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
			var datosPasivo = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
			var y = 120, itemsPorPagina = 33, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion) ? $scope.configuracionImpresion.empesar_numeracion : 1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion) ? ($scope.configuracionImpresion.empesar_numeracion - 1) + Math.ceil((datos.length + datosPasivo.length) / itemsPorPagina) : Math.ceil((datos.length + datosPasivo.length) / itemsPorPagina);
			var totalActivos = 0
			var totalPasivo = 0
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < dato.arregloActivos.length && items <= itemsPorPagina; i++) {
				cuenta = dato.arregloActivos[i]
				if ($scope.configuracionImpresion.tipoPeriodo.nombre != 'COMPARATIVO') {
					if (cuenta.tipoCuenta.nombre_corto === "1") {
						doc.text(cuenta.nombre, 30, y)
						y = y + 20;
						items++;
						for (var p = 0; p < dato.arregloActivos.length && items <= itemsPorPagina; p++) {
							cuenta2 = dato.arregloActivos[p]
							if (cuenta2.tipoCuenta.nombre_corto === "2") {
								var cod = String(cuenta2.codigo).substr(0, 1)
								if (cuenta.codigo == cod) {
									for (var L = 0; L < dato.arregloActivos.length && items <= itemsPorPagina; L++) {
										cuenta3 = dato.arregloActivos[L]
										if (cuenta3.tipoCuenta.nombre_corto === "3") {
											var cod = String(cuenta3.codigo).substr(0, 3)
											if (cuenta2.codigo == cod) {
												cuenta.total += cuenta3.saldo
												totalActivos += cuenta3.saldo
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
						if (i === (dato.arregloActivos.length - 1)) {
							$scope.dibujarGrupos(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (dato.arregloActivos.length - 1)) {
							$scope.dibujarGrupos(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
					}
				} else {
					$scope.generarPdfGrupoComparativo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)
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
		$scope.dibujarGrupos = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			var totalPasivo = 0
			doc.font('Helvetica-Bold', 8);
			doc.text("TOTAL ACTIVOS  ", 30, y);
			doc.text(number_format(totalActivos, 2), x, y);
			var cuentatotalSus = totalActivos / $scope.moneda.dolar
			if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
			y += 20
			doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
			y += 20
			for (var j = 0; j < dato.arregloPasivos.length && items <= itemsPorPagina; j++) {
				var cuenta = dato.arregloPasivos[j]
				if (cuenta.tipoCuenta.nombre_corto === "1") {
					doc.text(cuenta.nombre, 30, y)
					/*doc.text(number_format(cuenta.saldo,2), 530, y); */
					/* total+=cuenta.saldo */
					y = y + 20;
					items++;
					for (var p = 0; p < dato.arregloPasivos.length && items <= itemsPorPagina; p++) {
						cuenta2 = dato.arregloPasivos[p]
						if (cuenta2.tipoCuenta.nombre_corto === "2") {
							var cod = String(cuenta2.codigo).substr(0, 1)
							if (cuenta.codigo == cod) {

								for (var L = 0; L < dato.arregloPasivos.length && items <= itemsPorPagina; L++) {
									cuenta4 = dato.arregloPasivos[L]
									if (cuenta4.tipoCuenta.nombre_corto === "3") {
										var cod = String(cuenta4.codigo).substr(0, 3)
										if (cuenta2.codigo == cod) {

											cuenta.total += cuenta4.saldo
											totalPasivo += cuenta4.saldo


										}
									}
								}
							}
						}
					}
					doc.text("TOTAL " + cuenta2.nombre, 90, y);
					doc.text(number_format(cuenta2.total, 2), x, y);
					var saldoSus = Math.round((cuenta2.total / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
					y = y + 20;
					items++;
				}
				if (j === (dato.arregloPasivos.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL PASIVO:  ", 30, y)
					doc.text(number_format(totalPasivo, 2), x, y)
					var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
				}
			}
		}
		$scope.generarPdfsubGrupo = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas) {
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
							y = 130;
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
									if (dato.arregloActivos.some(function (cuenta2) {
										var cod = String(cuenta2.codigo).substr(0, 5)
										if (cuenta3.codigo == cod) {
											return true
										} else {
											return false
										}
									})) {
										for (var p = 0; p < dato.arregloActivos.length && items <= itemsPorPagina; p++) {
											cuenta2 = dato.arregloActivos[p]
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
							$scope.dibujarPatrimonioSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (cuentasSubGrupo.length - 1)) {
							$scope.dibujarPatrimonioSubGrupo(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

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
		$scope.dibujarSubGrupos = function (dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x) {
			var totalPasivo = 0
			doc.font('Helvetica-Bold', 8);
			doc.text("TOTAL ACTIVOS  ", 30, y);
			doc.text(number_format(totalActivos, 2), x, y);
			var cuentatotalSus = totalActivos / $scope.moneda.dolar
			if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(cuentatotalSus, 2), x + 130, y);
			y += 20
			doc.text("PASIVO Y PATRIMONIO", 0, y, { align: "center" });
			y += 20
			for (var j = 0; j < dato.arregloPasivos.length && items <= itemsPorPagina; j++) {
				var cuenta = dato.arregloPasivos[j]
				if (cuenta.tipoCuenta.nombre_corto === "2") {
					doc.text(cuenta.nombre, 30, y)
					/*doc.text(number_format(cuenta.saldo,2), 530, y); */
					/* total+=cuenta.saldo */
					y = y + 20;
					items++;
					for (var p = 0; p < dato.arregloPasivos.length && items <= itemsPorPagina; p++) {
						cuenta2 = dato.arregloPasivos[p]
						if (cuenta2.tipoCuenta.nombre_corto === "3") {
							var cod = String(cuenta2.codigo).substr(0, 3)
							if (cuenta.codigo == cod) {
								cuenta.total += cuenta2.saldo
								totalPasivo += cuenta2.saldo

							}
						}
					}
					doc.text("TOTAL " + cuenta2.nombre, 90, y);
					doc.text(number_format(cuenta2.total, 2), x, y);
					var saldoSus = Math.round((cuenta2.total / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
					y = y + 20;
					items++;
				}
				if (j === (dato.arregloPasivos.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL PASIVO:  ", 30, y)
					doc.text(number_format(totalPasivo, 2), x, y)
					var saldoSus = Math.round((totalPasivo / $scope.moneda.dolar) * 10000) / 10000;
					if ($scope.configuracionImpresion.bimonetario) doc.text(number_format(saldoSus, 2), x + 130, y);
				}
			}
		}
		$scope.generarPdfPreestablecido = function (dato, x, cuentasGrupo, cuentasSubGrupo, cuentasGenericas) {
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
							y = 130;
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
									if (dato.arregloActivos.some(function (cuenta2) {
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


										for (var p = 0; p < dato.arregloActivos.length && items <= itemsPorPagina; p++) {
											cuenta2 = dato.arregloActivos[p]
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
														y = 130;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												} else {
													if (items == itemsPorPagina) {
														doc.addPage({ margin: 0, bufferPages: true });
														y = 130;
														items = 0;
														pagina = pagina + 1;
														$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
														doc.font('Helvetica', 8);
													}
												}
											} else {
												if (items == itemsPorPagina) {
													doc.addPage({ margin: 0, bufferPages: true });
													y = 130;
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
										y = 130;
										items = 0;
										pagina = pagina + 1;
										$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
										doc.font('Helvetica', 8);
									}
								}
							} else {
								if (items == itemsPorPagina) {
									doc.addPage({ margin: 0, bufferPages: true });
									y = 130;
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
							$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

						}
						/* 	y = y + 20;
							items++; */
					} else {
						if (i === (cuentasSubGrupo.length - 1)) {
							$scope.dibujarPatrimonioPredefinido(dato, totalActivos, doc, y, items, pagina, totalPaginas, itemsPorPagina, x)

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
				doc.text('Bolivianos', 400, 115);
				doc.text('Dolares', 520, 115);

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

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup();

		});

		$scope.inicio();
	});



