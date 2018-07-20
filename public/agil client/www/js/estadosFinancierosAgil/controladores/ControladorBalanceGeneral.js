angular.module('agil.controladores')

	.controller('ControladorBalanceGeneral', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipoEmpresa, ClasesTipo, ObtenerConfiguracionImpresion) {


		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerTiposPeriodos()
			$scope.obtenerGestiones()
			$scope.obtenerTiposCuenta()
			$scope.obtenerConfiguracionImpresion()
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
				$scope.configuracionImpresion.fecha_inicio = ""
				$scope.configuracionImpresion.fecha_fin = ""
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
				$scope.cuentaTipos = [{ id: 0, nombre: "TODOS" }]
				$scope.cuentaTipos = $scope.cuentaTipos.concat(entidad.clases);
				blockUI.stop();
			});
		}

		$scope.generarPdfBalanceGeneral = function () {
			blockUI.start();
			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var datos = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
			var datosPasivo = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
			var y = 120, itemsPorPagina = 33, items = 0, pagina = ($scope.configuracionImpresion.usar_empesar_numeracion)?$scope.configuracionImpresion.empesar_numeracion:1, totalPaginas = ($scope.configuracionImpresion.usar_empesar_numeracion)?($scope.configuracionImpresion.empesar_numeracion-1)+Math.ceil((datos.length + datosPasivo.length) / itemsPorPagina):Math.ceil((datos.length + datosPasivo.length) / itemsPorPagina);
			$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
			doc.font('Helvetica', 8);
			for (var i = 0; i < datos.length && items <= itemsPorPagina; i++) {
				y = y + 20;
				items++;

				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 120;
					items = 0;
					pagina = pagina + 1;
					$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "ACTIVO");
					doc.font('Helvetica', 8);
				}
				if (i === (datos.length - 1)) {
					doc.font('Helvetica-Bold', 8);
					doc.text("TOTAL ACTIVOS", 30, y);
					doc.text("PASIVO Y PATRIMONIO", 0, y + 10, { align: "center" });
					for (var j = 0; j < datosPasivo.length && items <= itemsPorPagina; j++) {
						y = y + 20;
						items++;
						if (j === (datosPasivo.length - 1)) {
							doc.font('Helvetica-Bold', 8);
							doc.text("TOTAL PASIVO", 30, y)
						}
						if (items == itemsPorPagina) {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 120;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFBalanceGeneral(doc, pagina, totalPaginas, "PASIVO Y PATRIMONIO");
							doc.font('Helvetica', 8);
						}
					}
				}
			}

			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}
		$scope.generarExcelBalanceGeneral = function (configuracionImpresion) {
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
			} else {
				doc.text("Expresado en Bolivianos", 0, 95, { align: "center" });
			}
			doc.text(nombreTipo, 0, 105, { align: "center" });
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			doc.font('Helvetica', 5);
			doc.text($scope.configuracionImpresion.frase_pie_pagina, 40, 740);
			doc.text((($scope.configuracionImpresion.usar_lugar_emision)?$scope.configuracionImpresion.lugar_emision+", ":"")+(($scope.configuracionImpresion.usar_fecha_emision)?$scope.fechaATexto($scope.configuracionImpresion.fecha_emision):""), 40, 750);
			
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup();

		});

		$scope.inicio();
	});



