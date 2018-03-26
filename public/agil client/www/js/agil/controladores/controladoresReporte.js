angular.module('agil.controladores')
	.controller('ControladorEstadoCuentasProveedores', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, $timeout,
		uiGmapGoogleMapApi, $cordovaGeolocation, ReportEstadoCuentasProveedoresDatos, InventariosCosto) {
		blockUI.start();


		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.proveedores = ReportEstadoCuentasProveedoresDatos.show({ id_empresa: $scope.usuario.id_empresa });
			console.log($scope.proveedores);
			setTimeout(function () {
				ejecutarScriptsTabla('tabla-estadoCuentaProveedores', 10);
			}, 2000);
			uiGmapGoogleMapApi.then(function (maps) {
				console.log(maps);//google.maps.event.trigger(maps[0].map, 'resize');
				$scope.map = {
					center: { latitude: -17.403800007775388, longitude: -66.11349012184144 }, zoom: 17, bounds: {
						northeast: {
							latitude: -17.403800007775388,
							longitude: -66.11349012184144
						}
					}
				};
				$scope.options = {
					scrollwheel: false,
					mapTypeId: google.maps.MapTypeId.SATELLITE
				};
			});
		}

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsProveedor('modal-wizard-proveedor', 'modal-wizard-proveedor-vista', 'dialog-eliminar-proveedor', 'modal-wizard-container-proveedor-edicion', 'modal-wizard-container-proveedor-vista');
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});

		$scope.generarPdfEstadoCuentasProveedor = function (proveedor) {
			blockUI.start();


			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var y = 120, itemsPorPagina = 33, items = 0, pagina = 1, totalPaginas = Math.ceil(proveedor.compras.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFEstadoCuentasProveedor(doc, 1, totalPaginas, proveedor);
			doc.font('Helvetica', 8);
			for (var i = 0; i < proveedor.compras.length && items <= itemsPorPagina; i++) {

				doc.rect(30, y - 10, 555, 20).stroke();
				proveedor.compras[i].fecha = new Date(proveedor.compras[i].fecha);
				doc.text(proveedor.compras[i].fecha.getDate() + "/" + (proveedor.compras[i].fecha.getMonth() + 1) + "/" + proveedor.compras[i].fecha.getFullYear(), 45, y);
				doc.text(proveedor.compras[i].id_movimiento, 170, y, { width: 45, align: "right" });

				if (proveedor.compras[i].factura == null) {
					doc.text('PROFORMA', 240, y);
				} else {
					doc.text('Factura nro. ' + proveedor.compras[i].factura, 240, y);
				}
				doc.text(proveedor.compras[i].saldo, 445, y, { width: 50, align: "right" });
				totalCosto = totalCosto + proveedor.compras[i].saldo;
				doc.text(totalCosto, 500, y, { width: 50, align: "right" });
				y = y + 20;
				items++;

				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 120;
					items = 0;
					pagina = pagina + 1;
					$scope.dibujarCabeceraPDFEstadoCuentasProveedor(doc, pagina, totalPaginas, Proveedor);
					doc.font('Helvetica', 8);
				}
			}
			doc.rect(30, y - 10, 555, 20).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Total General", 350, y);
			doc.text(totalCosto, 446, y, { width: 50, align: "right" });
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}
		$scope.generarExcelEstadoCuentasProveedor = function (proveedor) {
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

		$scope.dibujarCabeceraPDFEstadoCuentasProveedor = function (doc, pagina, totalPaginas, proveedor) {
			doc.font('Helvetica-Bold', 12);
			doc.text("ESTADO DE CUENTAS", 0, 25, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			doc.rect(30, 50, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Acreedor : ", 45, 60);
			doc.font('Helvetica', 8);
			doc.text(proveedor.razon_social, 140, 60);
			doc.rect(30, 80, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Fecha", 45, 90);
			doc.text("Nro. Recibo", 170, 90, { width: 50 });
			doc.text("Descripción", 240, 90, { width: 60 });
			doc.text("Monto", 470, 90, { width: 50 });
			doc.text("Total", 530, 90, { width: 50 });
			doc.font('Helvetica', 8);
		}




		$scope.inicio();
	})
	.controller('ControladorEstadoCuentasClientes', function ($scope, $window, $localStorage, $location,
		$templateCache, $route, blockUI, $timeout, Paginator,
		uiGmapGoogleMapApi, $cordovaGeolocation, ReportEstadoCuentasClientesDatos, InventariosCosto, ReporteClientesPaginador) {
		blockUI.start();
		$scope.idModalTablaEstadoCuenta = "tabla-estado-cuenta";
		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerClientes();
			console.log($scope.clientes);
			uiGmapGoogleMapApi.then(function (maps) {
				console.log(maps);//google.maps.event.trigger(maps[0].map, 'resize');
				$scope.map = {
					center: { latitude: -17.403800007775388, longitude: -66.11349012184144 }, zoom: 17, bounds: {
						northeast: {
							latitude: -17.403800007775388,
							longitude: -66.11349012184144
						}
					}
				};
				$scope.options = {
					scrollwheel: false,
					mapTypeId: google.maps.MapTypeId.SATELLITE
				};
			});

		}

		$scope.$on('$viewContentLoaded', function () {
			ejecutarScriptsCliente($scope.idModalTablaEstadoCuenta);
			blockUI.stop();
		});

		$scope.obtenerClientes = function () {
			$scope.paginator = Paginator();
			$scope.paginator.column = "codigo";
			$scope.paginator.callBack = $scope.obtenerLista;
			$scope.filtro = { empresa: $scope.usuario.id_empresa, cuentas_liquidadas: 0 };
			$scope.paginator.getSearch("", $scope.filtro, null);
		}

		$scope.obtenerLista = function () {
			blockUI.start();
			var promesa = ReporteClientesPaginador($scope.paginator);
			promesa.then(function (dato) {
				$scope.paginator.setPages(dato.paginas);
				$scope.clientes = dato.clientes;
				blockUI.stop();
			})
		}

		$scope.generarExcelEstadoCuentasClientesSeleccionados = function (clientesSeleccionados) {
			var data = [];
			for (var i = 0; i < clientesSeleccionados.length; i++) {
				data = data.concat($scope.generarExcelCliente(clientesSeleccionados[i], 0));
				data.push([]);
			}
			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-ESTADO-CUENTA-CLIENTES.xlsx");
			blockUI.stop();
		}

		$scope.generarExcelCliente = function (cliente, tipoImprecion) {
			var data = [["", "", "ESTADO CUENTAS CLIENTE"], ["Deudor :" + cliente.razon_social], ["Fecha", "N Recibo", "Descripción", "monto", "total", "total General"]]
			var totalCosto = 0;

			for (var i = 0; i < cliente.ventas.length; i++) {
				var columns = [];

				totalCosto = totalCosto + cliente.ventas[i].saldo;
				cliente.ventas[i].fecha = new Date(cliente.ventas[i].fecha);
				columns.push(cliente.ventas[i].fecha.getDate() + "/" + (cliente.ventas[i].fecha.getMonth() + 1) + "/" + cliente.ventas[i].fecha.getFullYear());
				columns.push(cliente.ventas[i].id_movimiento);

				if (cliente.ventas[i].movimiento.clase.nombre_corto != "FACT") {
					columns.push("PROFORMA :" + cliente.ventas[i].factura);
				} else {
					columns.push('Factura : ' + cliente.ventas[i].factura);
				}
				columns.push(cliente.ventas[i].saldo);
				columns.push(totalCosto);
				columns.push(totalCosto);
				data.push(columns);
				if (tipoImprecion != 0 && cliente.ventas[i].pagosVenta.length != 0) {
					for (var j = 0; j < cliente.ventas[i].pagosVenta.length; j++) {
						var columns2 = [];
						date = new Date(cliente.ventas[i].pagosVenta[j].createdAt);
						columns2.push("");
						columns2.push(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear());
						columns2.push(cliente.ventas[i].pagosVenta[j].numero_documento);
						columns2.push("Pago a/c Factura nro.  " + cliente.ventas[i].factura + "(" + cliente.ventas[i].pagosVenta[j].total + " -)");
						columns2.push(cliente.ventas[i].pagosVenta[j].total);
						data.push(columns2);
					}
				}

			}
			return data;
		}

		/*$scope.obtenerClientes=function(){
			$scope.abs = $window.Math.abs;
			$scope.itemsPorPagina=10;
			$scope.buscarClientes(1,$scope.itemsPorPagina,"",0);
		}*/

		$scope.verificarPulso = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				$scope.buscarClientes(1, $scope.itemsPorPagina, textoBusqueda);
			}
		}

		$scope.generarPdfEstadoCuentasCliente = function (cliente, tipoImprecion) {
			blockUI.start();
			console.log($scope.usuario.empresa)

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;

			var y = 120, itemsPorPagina = 33, items = 0, pagina = 1, totalPaginas = Math.ceil(cliente.ventas.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFEstadoCuentasCliente(doc, 1, totalPaginas, cliente);
			doc.font('Helvetica', 8);
			for (var i = 0; i < cliente.ventas.length && items <= itemsPorPagina; i++) {
				console.log(cliente.ventas[i].factura);
				doc.rect(30, y - 10, 555, 20).stroke();
				cliente.ventas[i].fecha = new Date(cliente.ventas[i].fecha);
				doc.text(cliente.ventas[i].fecha.getDate() + "/" + (cliente.ventas[i].fecha.getMonth() + 1) + "/" + cliente.ventas[i].fecha.getFullYear(), 45, y);
				doc.text(cliente.ventas[i].id_movimiento, 170, y, { width: 45, align: "right" });

				if (cliente.ventas[i].movimiento.clase.nombre_corto != "FACT") {
					doc.text('PROFORMA nro. ' + cliente.ventas[i].factura + "  (Bs. " + cliente.ventas[i].total + ")", 240, y);
				} else {
					doc.text('Factura nro. ' + cliente.ventas[i].factura + " (Bs. " + cliente.ventas[i].total + ")", 240, y);
				}
				doc.text(cliente.ventas[i].saldo, 475, y, { width: 50, align: "right" });
				doc.text(cliente.ventas[i].fecha_vencimiento.getDate() + "/" + (cliente.ventas[i].fecha_vencimiento.getMonth() + 1) + "/" + cliente.ventas[i].fecha_vencimiento.getFullYear(), 425, y, { width: 50, align: "right" });
				totalCosto = totalCosto + cliente.ventas[i].saldo;
				doc.text(totalCosto, 530, y, { width: 50, align: "right" });
				if (tipoImprecion != 0 && cliente.ventas[i].pagosVenta.length != 0) {
					for (var j = 0; j < cliente.ventas[i].pagosVenta.length; j++) {
						y = y + 20;
						doc.rect(30, y - 10, 0, 20).stroke();
						doc.rect(585, y - 10, 0, 20).stroke();
						date = new Date(cliente.ventas[i].pagosVenta[j].createdAt);
						doc.text(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), 100, y, { width: 50, align: "right" });
						doc.text(cliente.ventas[i].pagosVenta[j].numero_documento, 170, y, { width: 50, align: "right" });
						if (cliente.ventas[i].movimiento.clase.nombre_corto != "FACT") {
							doc.text("Pago a/c Proforma nro.  " + cliente.ventas[i].factura + " (" + cliente.ventas[i].pagosVenta[j].total + " -)" + "  (Bs. " + cliente.ventas[i].pagosVenta[j].monto_pagado + ")", 240, y);
						} else {
							doc.text("Pago a/c Factura nro.  " + cliente.ventas[i].factura + " (" + cliente.ventas[i].pagosVenta[j].total + " -)" + "  (Bs. " + cliente.ventas[i].pagosVenta[j].monto_pagado + ")", 240, y);
						}
						doc.text(cliente.ventas[i].pagosVenta[j].total, 475, y, { width: 50, align: "right" });

					};
				}
				y = y + 20;
				items++;

				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 120;
					items = 0;
					pagina = pagina + 1;
					$scope.dibujarCabeceraPDFEstadoCuentasCliente(doc, pagina, totalPaginas, cliente);
					doc.font('Helvetica', 8);
				}
			}
			doc.rect(30, y - 10, 555, 20).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Total General", 380, y);
			doc.text(totalCosto, 475, y, { width: 50, align: "right" });
			var currentDate = new Date();
			doc.font('Helvetica', 6);
			doc.text("EMISIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 180, y + 15);
			doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 240, y + 15);
			doc.text("USUARIO: " + $scope.usuario.persona.nombre_completo, 35, y + 15);
			if (pagina > totalPaginas) {

			} else {
				doc.text(pagina + " de " + totalPaginas, 560, y + 15);
			}


			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}

		$scope.generarExcelEstadoCuentasCliente = function (cliente, tipoImprecion) {
			var data = $scope.generarExcelCliente(cliente, tipoImprecion);
			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-ESTADO-CUENTA-CLIENTES.xlsx");
			blockUI.stop();
		}
		$scope.click = function () {
			setTimeout(function () {
				var element = angular.element(document.getElementsByClassName('verDetallePago'));
				element.triggerHandler('click');

			}, 0);
		};
		$scope.dibujarCabeceraPDFEstadoCuentasCliente = function (doc, pagina, totalPaginas, cliente) {
			doc.font('Helvetica-Bold', 8);
			doc.text($scope.usuario.empresa.razon_social, 35, 10);
			doc.font('Helvetica', 8);

			doc.text($scope.usuario.empresa.direccion, 35, 20);
			var telefono = ($scope.usuario.empresa.telefono1 != null ? $scope.usuario.empresa.telefono1 : "") +
				($scope.usuario.empresa.telefono2 != null ? "-" + $scope.usuario.empresa.telefono2 : "") +
				($scope.usuario.empresa.telefono3 != null ? "-" + $scope.usuario.empresa.telefono3 : "");
			doc.text("TELF. :" + telefono, 35, 30);
			doc.text("COCHABAMBA - BOLIVIA ", 35, 40);
			doc.font('Helvetica', 8);
			doc.font('Helvetica-Bold', 12);
			doc.text("ESTADO DE CUENTAS", 0, 25, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			doc.rect(30, 50, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Deudor : ", 45, 60);
			doc.font('Helvetica', 8);
			doc.text(cliente.razon_social, 140, 60);
			doc.rect(30, 80, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Fecha", 45, 90);
			doc.text("Nro. Recibo", 170, 90, { width: 50 });
			doc.text("Descripción", 240, 90, { width: 60 });
			doc.text("F.Venc", 440, 90, { width: 50 });
			doc.text("Saldo", 500, 90, { width: 50 });
			doc.text("Total", 560, 90, { width: 50 });
			doc.font('Helvetica', 8);
		}
		$scope.abrirEstadoCuentaCliente = function (cliente) {
			console.log(cliente)
			$scope.totalPagado = 0;

			for (var i = 0; i < cliente.ventas.length; i++) {
				var fecha = new Date(cliente.ventas[i].fecha)
				cliente.ventas[i].totalgeneral = 0;
				cliente.ventas[i].totalPago = 0;
				if (i == 0) {
					cliente.ventas[i].totalgeneral = cliente.ventas[i].totalgeneral + cliente.ventas[i].saldo;
				} else {
					cliente.ventas[i].totalgeneral = cliente.ventas[i - 1].totalgeneral + cliente.ventas[i].saldo;
				}
				for (var f = 0; f < cliente.ventas[i].pagosVenta.length; f++) {
					cliente.ventas[i].pagosVenta[f].total = cliente.ventas[i].pagosVenta[f].saldo_anterior - cliente.ventas[i].pagosVenta[f].monto_pagado;

					cliente.ventas[i].totalPago = cliente.ventas[i].totalPago + cliente.ventas[i].pagosVenta[f].monto_pagado;
				}
				cliente.ventas[i].fecha_vencimiento = $scope.sumaFecha(cliente.ventas[i].dias_credito, fecha);
				console.log(cliente.ventas[i].tipoPago.nombre)
			}
			console.log($scope.totalPagado)

			var i = cliente.ventas.length - 1;
			$scope.totalgeneral = 0;
			$scope.totalgeneral = cliente.ventas[i].totalgeneral;
			$scope.clienteVentas = cliente;
			$scope.abrirPopup($scope.idModalTablaEstadoCuenta);
		}
		$scope.verDetallePagos = function (venta) {

			var style = $("#" + venta.id_movimiento).css("display");
			if (style == "none") {
				$("#" + venta.id_movimiento).css("display", "");
			} else {
				$("#" + venta.id_movimiento).css("display", "none");
			}
		}
		$scope.cerrarEstadoCuentaCliente = function () {
			$scope.cerrarPopup($scope.idModalTablaEstadoCuenta);
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
		$scope.imprimirRecibo = function (pagosVenta, venta) {
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
			doc.text(pagosVenta.numero_documento, { align: 'center' });
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
			doc.text("He recibido de : " + $scope.clienteVentas.razon_social, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.2);
			doc.text("CONCEPTO", { align: 'left' });
			doc.moveDown(0.2);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			venta.fecha = new Date(venta.fecha);
			doc.text("Fecha: " + venta.fecha.getDate() + "/" + (venta.fecha.getMonth() + 1) + "/" + venta.fecha.getFullYear(), 15, 210);
			var textoFact = venta.movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ? "Factura nro. " + venta.factura : "Proforma nro. " + venta.factura;
			doc.text(textoFact, 105, 210, { width: 100 });
			doc.text("Saldo Bs " + (pagosVenta.saldo_anterior) + ".-", 105, 220, { width: 100 });
			doc.text("Bs " + pagosVenta.monto_pagado + ".-", 170, 210, { width: 100 });

			doc.text("--------------", 10, 230, { align: 'right' });
			//oc.text("--------------------",{align:'right'});
			doc.moveDown(0.3);
			doc.text("TOTAL Bs.              " + pagosVenta.monto_pagado, { align: 'right' });
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			//doc.text("SON: "+data.pago,{align:'left'});
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
		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalTablaEstadoCuenta);
		});
		$scope.inicio();
	})

	.controller('ControladorLibroVentas', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipo, ReporteLibroVentasDatos) {

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerGestiones();
		}

		$scope.obtenerGestiones = function () {
			blockUI.start();
			var promesa = ClasesTipo("GTN");
			promesa.then(function (entidad) {
				$scope.gestiones = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.generarTXTLibroVentas = function (reporte) {
			blockUI.start();
			var promesa = ReporteLibroVentasDatos($scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]);
			promesa.then(function (datos) {
				var ventas = datos.ventas;
				var linea = "";
				for (var i = 0; i < ventas.length; i++) {
					ventas[i].fecha = new Date(ventas[i].fecha);
					linea = linea + ventas[i].fecha.getDate() + "/" + (ventas[i].fecha.getMonth() + 1) + "/" + ventas[i].fecha.getFullYear() + "\|";
					linea = linea + ventas[i].factura + "|";
					linea = linea + ventas[i].autorizacion + "|";
					linea = linea + (ventas[i].activa ? "V" : "A") + "|";
					linea = linea + ventas[i].cliente.nit + "|";
					linea = linea + ventas[i].cliente.razon_social + "|";
					linea = linea + ventas[i].importe + "|";
					linea = linea + 0 + "|";
					linea = linea + 0 + "|";
					linea = linea + 0 + "|";
					linea = linea + ventas[i].importe + "|";
					linea = linea + 0 + "|";
					linea = linea + ventas[i].total + "|";
					linea = linea + (Math.round((ventas[i].total * 0.13) * 100) / 100) + "|";
					linea = linea + ventas[i].codigo_control;
					linea = linea + "\n"
				}
				var file = new Blob([linea.replace(/\n/g, "\r\n")], { type: 'text/plain' });
				saveAs(file, "ventas_" + reporte.mes.split("-")[0] + reporte.gestion + "_" + datos.empresa.nit + ".txt");
				blockUI.stop();
			});
		}

		$scope.generarExcelLibroVentas = function (reporte) {
			blockUI.start();
			var promesa = ReporteLibroVentasDatos($scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]);
			promesa.then(function (datos) {
				var ventas = datos.ventas;
				var data = [["N°", "FECHA DE LA FACTURA", "N° DE LA FACTURA", "N° DE AUTORIZACION", "ESTADO", "NIT/CI CLIENTE", "NOMBRE O RAZON SOCIAL", "IMPORTE TOTAL DE LA VENTA", "IMPORTE ICE/IEHD/TASAS", "EXPORTACIONES Y OPERACIONES EXENTAS", "VENTAS GRAVADAS A TASA CERO", "SUBTOTAL", "DESCUENTOS, BONIFICACIONES Y REBAJAS OBTENIDAS", "IMPORTE BASE PARA DEBITO FISCAL", "DEBITO FISCAL", "CODIGO DE CONTROL"]]
				var sumaImporte = 0, sumaImporteIce = 0, sumaImporteExp = 0, sumaImporteGrab = 0, sumaTotal = 0, sumaDescuentos = 0, sumaImporteBase = 0, sumaCredito = 0;
				for (var i = 0; i < ventas.length; i++) {
					var columns = [];
					ventas[i].fecha = new Date(ventas[i].fecha);
					columns.push(i + 1);
					columns.push(ventas[i].fecha.getDate() + "/" + (ventas[i].fecha.getMonth() + 1) + "/" + ventas[i].fecha.getFullYear());
					columns.push(ventas[i].factura);
					columns.push(ventas[i].autorizacion);
					columns.push((ventas[i].activa ? "V" : "A"));
					columns.push(ventas[i].cliente.nit);
					columns.push(ventas[i].cliente.razon_social);
					columns.push(ventas[i].importe);
					columns.push(0);
					columns.push(0);
					columns.push(0);
					columns.push(ventas[i].importe);
					columns.push(0);
					columns.push(ventas[i].total);
					columns.push(Math.round((ventas[i].total * 0.13) * 100) / 100);
					columns.push(ventas[i].codigo_control);
					sumaImporte = sumaImporte + ventas[i].importe;
					sumaImporteIce = 0;
					sumaImporteExp = 0;
					sumaImporteGrab = 0;
					sumaTotal = sumaTotal + ventas[i].importe;
					sumaDescuentos = sumaDescuentos + 0;
					sumaImporteBase = sumaImporteBase + ventas[i].total;
					sumaCredito = sumaCredito + (Math.round((ventas[i].total * 0.13) * 100) / 100);
					data.push(columns);
					if (i + 1 == ventas.length) {
						columns = [];
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("TOTALES");
						columns.push(Math.round((sumaImporte) * 100) / 100);
						columns.push(Math.round((sumaImporteIce) * 100) / 100);
						columns.push(Math.round((sumaImporteExp) * 100) / 100);
						columns.push(Math.round((sumaImporteGrab) * 100) / 100);
						columns.push(Math.round((sumaTotal) * 100) / 100);
						columns.push(Math.round((sumaDescuentos) * 100) / 100);
						columns.push(Math.round((sumaImporteBase) * 100) / 100);
						columns.push(Math.round((sumaCredito) * 100) / 100);
						data.push(columns);
					}
				}

				var ws_name = "SheetJS";
				var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
				/* add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "LIBRO-VENTAS.xlsx");
				blockUI.stop();
			});
		}

		$scope.generarPdfLibroVentas = function (reporte) {
			blockUI.start();
			var promesa = ReporteLibroVentasDatos($scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]);
			promesa.then(function (datos) {
				var ventas = datos.ventas;
				var doc = new PDFDocument({compress: false, margin: 10, layout: 'landscape' });
				var stream = doc.pipe(blobStream());
				// draw some text
				$scope.dibujarCabeceraPDFLibroVentas(doc, datos, reporte, 1);
				doc.font('Helvetica', 8);
				var y = 170, itemsPorPagina = 12, items = 0, pagina = 1;
				var sumaImporte = 0, sumaImporteIce = 0, sumaImporteExp = 0, sumaImporteGrab = 0, sumaTotal = 0, sumaDescuentos = 0, sumaImporteBase = 0, sumaCredito = 0;
				var sumaSubImporte = 0, sumaSubImporteIce = 0, sumaSubImporteExp = 0, sumaSubImporteGrab = 0, sumaSubTotal = 0, sumaSubDescuentos = 0, sumaSubImporteBase = 0, sumaSubCredito = 0;
				for (var i = 0; i < ventas.length && items <= itemsPorPagina; i++) {
					doc.rect(40, y - 10, 720, 30).stroke();
					ventas[i].fecha = new Date(ventas[i].fecha);
					doc.text(i + 1, 45, y);
					doc.text(ventas[i].fecha.getDate() + "/" + (ventas[i].fecha.getMonth() + 1) + "/" + ventas[i].fecha.getFullYear(), 65, y);
					doc.text(ventas[i].factura, 110, y);
					doc.text(ventas[i].autorizacion, 145, y);
					doc.text((ventas[i].activa ? "V" : "A"), 210, y);
					doc.text(ventas[i].cliente.nit, 235, y);
					doc.text(ventas[i].cliente.razon_social, 283, y - 6, { width: 100 });
					doc.text(ventas[i].importe, 385, y);
					doc.text(0, 430, y);
					doc.text(0, 465, y);
					doc.text(0, 507, y);
					doc.text(ventas[i].importe, 540, y);
					doc.text(0, 580, y);
					doc.text(ventas[i].total, 615, y);
					doc.text(Math.round((ventas[i].total * 0.13) * 100) / 100, 650, y);
					doc.text(ventas[i].codigo_control, 685, y);
					y = y + 30;
					sumaSubImporte = sumaSubImporte + ventas[i].importe;
					sumaSubImporteIce = 0;
					sumaSubImporteExp = 0;
					sumaSubImporteGrab = 0;
					sumaSubTotal = sumaSubTotal + ventas[i].importe;
					sumaSubDescuentos = sumaSubDescuentos + 0;
					sumaSubImporteBase = sumaSubImporteBase + ventas[i].total;
					sumaSubCredito = sumaSubCredito + (Math.round((ventas[i].total * 0.13) * 100) / 100);
					sumaImporte = sumaImporte + ventas[i].importe;
					sumaImporteIce = 0;
					sumaImporteExp = 0;
					sumaImporteGrab = 0;
					sumaTotal = sumaTotal + ventas[i].importe;
					sumaDescuentos = sumaDescuentos + 0;
					sumaImporteBase = sumaImporteBase + ventas[i].total;
					sumaCredito = sumaCredito + (Math.round((ventas[i].total * 0.13) * 100) / 100);
					items++;

					if (items == itemsPorPagina || i + 1 == ventas.length) {
						doc.font('Helvetica-Bold', 8);
						doc.text("SUBTOTALES", 283, y);
						doc.text(Math.round((sumaSubImporte) * 100) / 100, 385, y);
						doc.text(Math.round((sumaSubImporteIce) * 100) / 100, 430, y);
						doc.text(Math.round((sumaSubImporteExp) * 100) / 100, 465, y);
						doc.text(Math.round((sumaSubImporteGrab) * 100) / 100, 507, y);
						doc.text(Math.round((sumaSubTotal) * 100) / 100, 540, y);
						doc.text(Math.round((sumaSubDescuentos) * 100) / 100, 580, y);
						doc.text(Math.round((sumaSubImporteBase) * 100) / 100, 615, y);
						doc.text(Math.round((sumaSubCredito) * 100) / 100, 650, y);
						doc.rect(40, y - 10, 720, 30).stroke();
						doc.font('Helvetica', 8);
						sumaSubImporte = 0; sumaSubImporteNo = 0; sumaSubTotal = 0; sumaSubDescuentos = 0; sumaSubImporteBase = 0; sumaSubCredito = 0;

						if (i + 1 == ventas.length) {
							doc.font('Helvetica-Bold', 8);
							doc.text("TOTALES", 283, y + 30);
							doc.text(Math.round((sumaImporte) * 100) / 100, 385, y + 30);
							doc.text(Math.round((sumaImporteIce) * 100) / 100, 430, y + 30);
							doc.text(Math.round((sumaImporteExp) * 100) / 100, 465, y + 30);
							doc.text(Math.round((sumaImporteGrab) * 100) / 100, 507, y + 30);
							doc.text(Math.round((sumaTotal) * 100) / 100, 540, y + 30);
							doc.text(Math.round((sumaDescuentos) * 100) / 100, 580, y + 30);
							doc.text(Math.round((sumaImporteBase) * 100) / 100, 615, y + 30);
							doc.text(Math.round((sumaCredito) * 100) / 100, 650, y + 30);
							doc.rect(40, y - 10 + 30, 720, 30).stroke();
							doc.font('Helvetica', 8);
						} else {
							doc.addPage({ margin: 0, bufferPages: true, layout: 'landscape' });
							y = 170;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFLibroVentas(doc, datos, reporte, pagina);
							doc.font('Helvetica', 8);
						}
					}
				}
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			});
		}

		$scope.dibujarCabeceraPDFLibroVentas = function (doc, datos, reporte, pagina) {
			doc.font('Helvetica-Bold', 12);
			doc.text("LIBRO DE VENTAS IVA ESTÁNDAR", 0, 25, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("FOLIO " + pagina, 720, 25);
			doc.rect(40, 60, 720, 40).stroke();
			doc.text("PERIÓDO FISCAL : ", 65, 70);
			doc.text("NOMBRE O RAZÓN SOCIAL : ", 65, 85);
			doc.text("NIT : ", 440, 85);
			doc.font('Helvetica', 8);
			doc.text("AÑO " + reporte.gestion, 140, 70);
			doc.text("MES " + reporte.mes.split("-")[1], 200, 70);
			doc.text(datos.empresa.razon_social, 195, 85);
			doc.text(datos.empresa.nit, 460, 85);

			doc.rect(40, 100, 720, 60).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Nº", 45, 110);
			doc.text("Fecha de la Factura", 65, 110, { width: 40 });
			doc.text("Nº de la Factura", 110, 110, { width: 50 });
			doc.text("Nº de Autorización", 145, 110, { width: 50 });
			doc.text("Estado", 205, 110, { width: 35 });
			doc.text("NIT / CI Cliente", 235, 110, { width: 50 });
			doc.text("Nombre o Razón Social", 280, 110);
			doc.text("Importe Total de la Venta", 385, 110, { width: 35 });
			doc.text("Importe ICE IE HD/T", 425, 110, { width: 35 });
			doc.text("Exp. y Op. exentas", 460, 110, { width: 42 });
			doc.text("Ventas grabadas a Tasa Cero", 502, 110, { width: 42 });
			doc.text("Subtotal", 540, 110, { width: 40 });
			doc.text("Desc., Bonif. y Rebajas", 575, 110, { width: 42 });
			doc.text("Importe Base para Débito Fiscal", 615, 110, { width: 35 });
			doc.text("Débito Fiscal I.V.A.", 650, 110, { width: 35 });
			doc.text("Código de Control", 685, 110);
		}

		$scope.inicio();


	})

	.controller('ControladorLibroCompras', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipo, ReporteLibroComprasDatos) {


		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerGestiones();
		}

		$scope.obtenerGestiones = function () {
			blockUI.start();
			var promesa = ClasesTipo("GTN");
			promesa.then(function (entidad) {
				$scope.gestiones = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.generarTXTLibroCompras = function (reporte) {
			blockUI.start();
			var promesa = ReporteLibroComprasDatos($scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]);
			promesa.then(function (datos) {
				var compras = datos.compras;
				var linea = "";
				for (var i = 0; i < compras.length; i++) {
					compras[i].fecha = new Date(compras[i].fecha);
					linea = linea + "1|";
					linea = linea + (i + 1) + "|";
					var fecha = (compras[i].fecha.getDate() < 10) ? "0" + compras[i].fecha.getDate() : compras[i].fecha.getDate();
					var mes = ((compras[i].fecha.getMonth() + 1) < 10) ? "0" + (compras[i].fecha.getMonth() + 1) : (compras[i].fecha.getMonth() + 1);
					linea = linea + fecha + "/" + mes + "/" + compras[i].fecha.getFullYear() + "\|";
					linea = linea + compras[i].proveedor.nit + "|";
					linea = linea + compras[i].proveedor.razon_social + "|";
					linea = linea + compras[i].factura + "|";
					linea = linea + "0" + "|";
					linea = linea + compras[i].autorizacion + "|";
					linea = linea + compras[i].importe + "|";
					linea = linea + 0 + "|";
					linea = linea + compras[i].importe + "|";
					var descuento = compras[i].descuento - compras[i].recargo + compras[i].ice + compras[i].excento;
					linea = linea + descuento + "|";
					linea = linea + compras[i].total + "|";
					linea = linea + (Math.round((compras[i].total * 0.13) * 100) / 100) + "|";
					linea = linea + compras[i].codigo_control + "|";
					linea = linea + "1" + "\n"
				}
				var file = new Blob([linea.replace(/\n/g, "\r\n")], { type: 'text/plain' });
				saveAs(file, "compras_" + reporte.mes.split("-")[0] + reporte.gestion + "_" + datos.empresa.nit + ".txt");
				blockUI.stop();
			});
		}

		$scope.generarExcelLibroCompras = function (reporte) {
			blockUI.start();
			var promesa = ReporteLibroComprasDatos($scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]);
			promesa.then(function (datos) {
				var compras = datos.compras;
				var data = [["N°", "FECHA DE LA FACTURA O DUI", "NIT PROVEEDOR", "NOMBRE Y APELLIDOS/RAZON SOCIAL", "N° DE LA FACTURA", "N° DE DUI", "N° DE AUTORIZACION", "IMPORTE TOTAL DE LA COMPRA", "IMPORTE NO SUJETO A CREDITO FISCAL", "SUBTOTAL", "DESCUENTOS, BONIFICACIONES Y REBAJAS OBTENIDAS", "IMPORTE BASE PARA CREDITO FISCAL", "CREDITO FISCAL", "CODIGO DE CONTROL", "TIPO DE COMPRA"]]
				var sumaImporte = 0, sumaImporteNo = 0, sumaTotal = 0, sumaDescuentos = 0, sumaImporteBase = 0, sumaCredito = 0;
				for (var i = 0; i < compras.length; i++) {
					var columns = [];
					compras[i].fecha = new Date(compras[i].fecha);
					columns.push(i + 1);
					columns.push(compras[i].fecha.getDate() + "/" + (compras[i].fecha.getMonth() + 1) + "/" + compras[i].fecha.getFullYear());
					columns.push(compras[i].proveedor.nit);
					columns.push(compras[i].proveedor.razon_social);
					columns.push(compras[i].factura);
					columns.push(0);
					columns.push(compras[i].autorizacion);
					columns.push(compras[i].importe);
					columns.push(0);
					columns.push(compras[i].importe);
					var descuento = compras[i].descuento - compras[i].recargo + compras[i].ice + compras[i].excento;
					columns.push(descuento);
					columns.push(compras[i].total);
					columns.push(Math.round((compras[i].total * 0.13) * 100) / 100);
					columns.push(compras[i].codigo_control);
					columns.push(1);
					sumaImporte = sumaImporte + compras[i].importe;
					sumaImporteNo = 0;
					sumaTotal = sumaTotal + compras[i].importe;
					sumaDescuentos = sumaDescuentos + descuento;
					sumaImporteBase = sumaImporteBase + compras[i].total;
					sumaCredito = sumaCredito + (Math.round((compras[i].total * 0.13) * 100) / 100);
					data.push(columns);
					if (i + 1 == compras.length) {
						columns = [];
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("");
						columns.push("TOTALES");
						columns.push(Math.round((sumaImporte) * 100) / 100);
						columns.push(Math.round((sumaImporteNo) * 100) / 100);
						columns.push(Math.round((sumaTotal) * 100) / 100);
						columns.push(Math.round((sumaDescuentos) * 100) / 100);
						columns.push(Math.round((sumaImporteBase) * 100) / 100);
						columns.push(Math.round((sumaCredito) * 100) / 100);
						data.push(columns);
					}
				}

				var ws_name = "SheetJS";
				var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
				/* add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "LIBRO-COMPRAS.xlsx");
				blockUI.stop();
			});
		}

		$scope.generarPdfLibroCompras = function (reporte) {
			blockUI.start();
			var promesa = ReporteLibroComprasDatos($scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]);
			promesa.then(function (datos) {
				var compras = datos.compras;
				var doc = new PDFDocument({ margin: 10, layout: 'landscape' });
				var stream = doc.pipe(blobStream());
				// draw some text
				$scope.dibujarCabeceraPDFLibroCompras(doc, datos, reporte, 1);
				doc.font('Helvetica', 8);
				var y = 170, itemsPorPagina = 12, items = 0, pagina = 1;
				var sumaImporte = 0, sumaImporteNo = 0, sumaTotal = 0, sumaDescuentos = 0, sumaImporteBase = 0, sumaCredito = 0;
				var sumaSubImporte = 0, sumaSubImporteNo = 0, sumaSubTotal = 0, sumaSubDescuentos = 0, sumaSubImporteBase = 0, sumaSubCredito = 0;
				for (var i = 0; i < compras.length && items <= itemsPorPagina; i++) {
					doc.rect(40, y - 10, 720, 30).stroke();
					compras[i].fecha = new Date(compras[i].fecha);
					doc.text(i + 1, 45, y);
					doc.text(compras[i].fecha.getDate() + "/" + (compras[i].fecha.getMonth() + 1) + "/" + compras[i].fecha.getFullYear(), 65, y);
					doc.text(compras[i].proveedor.nit, 110, y);
					doc.text(compras[i].proveedor.razon_social, 165, y - 6, { width: 100 });
					doc.text(compras[i].factura, 275, y);
					doc.text(0, 320, y);
					doc.text(compras[i].autorizacion, 335, y);
					doc.text(compras[i].importe, 410, y);
					doc.text(0, 450, y);
					doc.text(compras[i].importe, 480, y);
					var descuento = compras[i].descuento - compras[i].recargo + compras[i].ice + compras[i].excento;
					doc.text(descuento, 520, y);
					doc.text(compras[i].total, 565, y);
					doc.text(Math.round((compras[i].total * 0.13) * 100) / 100, 605, y);
					doc.text(compras[i].codigo_control, 640, y);
					doc.text(1, 740, y);
					y = y + 30;
					sumaSubImporte = sumaSubImporte + compras[i].importe;
					sumaSubImporteNo = 0;
					sumaSubTotal = sumaSubTotal + compras[i].importe;
					sumaSubDescuentos = sumaSubDescuentos + descuento;
					sumaSubImporteBase = sumaSubImporteBase + compras[i].total;
					sumaSubCredito = sumaSubCredito + (Math.round((compras[i].total * 0.13) * 100) / 100);
					sumaImporte = sumaImporte + compras[i].importe;
					sumaImporteNo = 0;
					sumaTotal = sumaTotal + compras[i].importe;
					sumaDescuentos = sumaDescuentos + descuento;
					sumaImporteBase = sumaImporteBase + compras[i].total;
					sumaCredito = sumaCredito + (Math.round((compras[i].total * 0.13) * 100) / 100);
					items++;

					if (items == itemsPorPagina || i + 1 == compras.length) {
						doc.font('Helvetica-Bold', 8);
						doc.text("SUBTOTALES", 320, y);
						doc.text(Math.round((sumaSubImporte) * 100) / 100, 400, y);
						doc.text(Math.round((sumaSubImporteNo) * 100) / 100, 450, y);
						doc.text(Math.round((sumaSubTotal) * 100) / 100, 480, y);
						doc.text(Math.round((sumaSubDescuentos) * 100) / 100, 520, y);
						doc.text(Math.round((sumaSubImporteBase) * 100) / 100, 565, y);
						doc.text(Math.round((sumaSubCredito) * 100) / 100, 605, y);
						doc.rect(40, y - 10, 720, 30).stroke();
						doc.font('Helvetica', 8);
						sumaSubImporte = 0; sumaSubImporteNo = 0; sumaSubTotal = 0; sumaSubDescuentos = 0; sumaSubImporteBase = 0; sumaSubCredito = 0;

						if (i + 1 == compras.length) {
							doc.font('Helvetica-Bold', 8);
							doc.text("TOTALES", 320, y + 30);
							doc.text(Math.round((sumaImporte) * 100) / 100, 400, y + 30);
							doc.text(Math.round((sumaImporteNo) * 100) / 100, 450, y + 30);
							doc.text(Math.round((sumaTotal) * 100) / 100, 480, y + 30);
							doc.text(Math.round((sumaDescuentos) * 100) / 100, 520, y + 30);
							doc.text(Math.round((sumaImporteBase) * 100) / 100, 565, y + 30);
							doc.text(Math.round((sumaCredito) * 100) / 100, 605, y + 30);
							doc.rect(40, y - 10 + 30, 720, 30).stroke();
							doc.font('Helvetica', 8);
						} else {
							doc.addPage({ margin: 0, bufferPages: true, layout: 'landscape' });
							y = 170;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFLibroCompras(doc, datos, reporte, pagina);
							doc.font('Helvetica', 8);
						}
					}
				}
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();





				blockUI.stop();
			});
		}

		$scope.dibujarCabeceraPDFLibroCompras = function (doc, datos, reporte, pagina) {
			doc.font('Helvetica-Bold', 12);
			doc.text("LIBRO DE COMPRAS IVA ESTÁNDAR", 0, 25, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("FOLIO " + pagina, 720, 25);
			doc.rect(40, 60, 720, 40).stroke();
			doc.text("PERIÓDO FISCAL : ", 65, 70);
			doc.text("NOMBRE O RAZÓN SOCIAL : ", 65, 85);
			doc.text("NIT : ", 440, 85);
			doc.font('Helvetica', 8);
			doc.text("AÑO " + reporte.gestion, 140, 70);
			doc.text("MES " + reporte.mes.split("-")[1], 200, 70);
			doc.text(datos.empresa.razon_social, 195, 85);
			doc.text(datos.empresa.nit, 460, 85);

			doc.rect(40, 100, 720, 60).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Nº", 45, 110);
			doc.text("Fecha de la Factura o DUI", 65, 110, { width: 40 });
			doc.text("NIT Proveedor", 110, 110, { width: 50 });
			doc.text("Nombre o Razón Social", 165, 110);
			doc.text("Nº de la Factura", 275, 110, { width: 50 });
			doc.text("Nº de DUI", 320, 110, { width: 30 });
			doc.text("Nº de Autorización", 345, 110, { width: 50 });
			doc.text("Importe Total de la Compra", 400, 110, { width: 35 });
			doc.text("Importe No Sujeto a Crédito Fiscal", 440, 110, { width: 35 });
			doc.text("Subtotal", 480, 110);
			doc.text("Descuentos, Bonificaciones y Rebajas", 520, 110, { width: 40 });
			doc.text("Importe Base para Crédito Fiscal", 565, 110, { width: 35 });
			doc.text("Crédito Fiscal I.V.A.", 605, 110, { width: 35 });
			doc.text("Código de Control", 640, 110);
			doc.text("Tipo de Compra", 720, 110, { width: 35 });
		}

		$scope.inicio();
	})

	.controller('ControladorReporteAlmacenes', function ($scope, $window, $localStorage, $location, $templateCache, $route, blockUI,
		InventariosCosto, InventarioPaginadorAlmacen) {

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.sucursales = $scope.obtenerSucursales();
			$scope.reporte = {};
			
			$scope.reporte.sucursal = ($scope.sucursales.length ==1) ? $scope.sucursales[0] : null;
			if($scope.sucursales.length==1){
				$scope.obtenerAlmacenes($scope.sucursales[0].id)
				$scope.reporte.almacen = ($scope.almacenes.length ==2) ? $scope.almacenes[1] : null;
				
			}
			$scope.obtenerInventarios();
		}

		$scope.obtenerAlmacenes = function (idSucursal) {
			$scope.almacenes = [];
			$scope.almacenes.push({ id: 0, nombre: "TODOS" });			
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
			$scope.almacenes = $scope.almacenes.concat(sucursal.almacenes);
		}

		$scope.obtenerSucursales = function () {
			var sucursales = [];
			if ($scope.usuario.sucursalesUsuario.length > 1) {
				sucursales.push({ id: 0, nombre: "TODOS" });
			
			}
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			}
			return sucursales;
		}
		$scope.establecerAlmacenBusqueda = function (reporte) {
			console.log(almacen.id);
			$scope.almacenBusqueda = reporte.almacen;
			$scope.sucursalBusqueda = reporte.sucursal;
		}
		$scope.obtenerInventarios = function () {
			$scope.abs = $window.Math.abs;
			$scope.itemsPorPagina = 10;
			$scope.paginaActual = 1;
			$scope.columna = "cantidad";
			$scope.direccion = "asc";
			$scope.textoBusqueda = "";
			if ($scope.sucursales.length == 1) {
				$scope.sucursalBusqueda = $scope.sucursales[0];
				$scope.almacenes = $scope.sucursalBusqueda.almacenes;
				if ($scope.almacenes.length == 1) {
					$scope.almacenBusqueda = $scope.sucursalBusqueda.almacenes[0];
					$scope.buscarInventarios($scope.sucursalBusqueda.id, $scope.almacenBusqueda.id, $scope.paginaActual, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion);
				}
			}
		}
		$scope.clasificarColumna = function (columna) {
			console.log(columna);
			if ($scope.columna == columna) {
				if ($scope.direccion == "asc") {
					$scope.direccion = "desc";
					$("#" + columna).removeClass("fa-caret-up");
					$("#" + columna).addClass("fa-caret-down");
				} else {
					$scope.direccion = "asc";
					$("#" + columna).removeClass("fa-caret-down");
					$("#" + columna).addClass("fa-caret-up");
				}
			} else {
				$scope.direccion = "asc";
				$(".sort").removeClass("fa-caret-up");
				$(".sort").removeClass("fa-caret-down");
				$(".sort").addClass("fa-sort");
				$("#" + columna).addClass("fa-caret-up");
				$("#" + columna).removeClass("fa-sort");
			}
			$scope.columna = columna;
			$scope.buscarInventarios($scope.sucursalBusqueda.id, $scope.almacenBusqueda.id, $scope.paginaActual, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion);
		}

		$scope.buscarInventarios = function (idSucursal, idAlmacen, pagina, itemsPagina, texto, columna, direccion) {
			blockUI.start();
			$scope.itemsPorPagina = itemsPagina;

			if (texto == "" || texto == null) {
				texto = 0;
			} else {
				$scope.textoBusqueda = texto;
			}
			if (itemsPagina == "todos") {
				itemsPagina = $scope.inventarios.length * $scope.inventarios.paginas;
			}
			$scope.paginaActual = pagina;
			var promesa = InventarioPaginadorAlmacen($scope.usuario.id_empresa, idSucursal, idAlmacen, pagina, itemsPagina, texto, columna, direccion);
			promesa.then(function (inventarios) {
				console.log(inventarios)
				var inventario = inventarios.inventario;
				$scope.paginas = [];
				for (var i = 1; i <= inventarios.paginas; i++) {
					$scope.paginas.push(i);
				}

				$scope.inventarios = inventario;
				$scope.inventarios.paginas = inventarios.paginas;
				console.log($scope.inventarios)

				blockUI.stop();
			});
		}

		$scope.generarPdfAlmacenes = function () {
			blockUI.start();
			var inventarios = $scope.inventarios;
			var doc = new PDFDocument({ margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var y = 90, itemsPorPagina = 33, items = 0, pagina = 1, totalPaginas = Math.ceil(inventarios.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFAlmacenes(doc, 1, totalPaginas);
			doc.font('Helvetica', 7);
			for (var i = 0; i < inventarios.length && items <= itemsPorPagina; i++) {
				doc.rect(30, y - 10, 555, 20).stroke();
				doc.text(inventarios[i].codigo, 35, y);
				doc.text(inventarios[i].cantidad, 110, y);
				doc.text(inventarios[i].unidad_medida, 160, y);
				if ($scope.usuario.empresa.usar_vencimientos) {
					if (inventarios[i].nombre.length > 35) {
						doc.text(inventarios[i].nombre, 210, y - 6, { width: 170 });
					} else {
						doc.text(inventarios[i].nombre, 210, y, { width: 170 });
					}
					inventarios[i].fecha_vencimiento = new Date(inventarios[i].fecha_vencimiento);
					doc.text(inventarios[i].fecha_vencimiento.getDate() + "/" + (inventarios[i].fecha_vencimiento.getMonth() + 1) + "/" + inventarios[i].fecha_vencimiento.getFullYear(), 380, y);
					doc.text(inventarios[i].lote, 430, y);
				} else {
					doc.text(inventarios[i].nombre, 210, y);
				}
				doc.text(inventarios[i].costo_unitario.toFixed(2), 470, y);
				doc.text(inventarios[i].costo_total.toFixed(2), 530, y);
				y = y + 20;
				items++;
				totalCosto = totalCosto + inventarios[i].costo_total;
				if (items == itemsPorPagina) {
					var fechaActual = new Date();
					var min = fechaActual.getMinutes();
					if (min < 10) {
						min = "0" + min;
					}
					doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 45, y);
					doc.text("EMISIÓN : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 450, y);
					doc.addPage({ margin: 0, bufferPages: true });
					y = 90;
					items = 0;
					pagina = pagina + 1;
					$scope.dibujarCabeceraPDFAlmacenes(doc, pagina, totalPaginas);
					doc.font('Helvetica', 7);
				}
			}
			doc.rect(30, y - 10, 555, 20).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Total General", 400, y);
			doc.text(Math.round(totalCosto * 100) / 100, 530, y);
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.font('Helvetica', 7);
			doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 45, y + 20);
			doc.text("EMISIÓN : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 450, y + 20);
			doc.end();
			stream.on('finish', function () {
				var fileURL = stream.toBlobURL('application/pdf');
				window.open(fileURL, '_blank', 'location=no');
			});
			blockUI.stop();

		}

		$scope.generarExcelAlmacenes = function (reporte) {
			blockUI.start();
			var inventarios = $scope.inventarios;
			var data = [["Código", "Nombre", "Unidad de Medida", "Precio Unitario", "Descripción", "Inventario Mínimo",
				"Grupo", "Sub-Grupo", "Carac. Esp. 1", "Carac. Esp. 2", "Codigo de fabrica", "Cant.", "Costo Unitario",
				"Total General", "Fecha Vencimiento", "Lote", "Sucursal", "Almacen"]]
			for (var i = 0; i < inventarios.length; i++) {
				inventarios[i].fecha_vencimiento = (inventarios[i].fecha_vencimiento ? new Date(inventarios[i].fecha_vencimiento) : null);
				//inventarios[i].fechaVentimientoTexto = (inventarios[i].fecha_vencimiento ? inventarios[i].fecha_vencimiento.getDate() + "/" + (inventarios[i].fecha_vencimiento.getMonth() + 1) + "/" + inventarios[i].fecha_vencimiento.getFullYear() : "");
				var columns = [];
				columns.push(inventarios[i].codigo);
				columns.push(inventarios[i].nombre);
				columns.push(inventarios[i].unidad_medida);
				columns.push(inventarios[i].precio_unitario);
				columns.push(inventarios[i].descripcion);
				columns.push(inventarios[i].inventario_minimo);
				columns.push(inventarios[i].grupo);
				columns.push(inventarios[i].subgrupo);
				columns.push(inventarios[i].caracteristica_especial1);
				columns.push(inventarios[i].caracteristica_especial2);
				columns.push(inventarios[i].codigo_fabrica);
				columns.push(inventarios[i].cantidad);
				columns.push(inventarios[i].costo_unitario);
				columns.push(inventarios[i].costo_total);
				columns.push(inventarios[i].fecha_vencimiento);
				columns.push(inventarios[i].lote);
				columns.push(inventarios[i].nombre_sucursal);
				columns.push(inventarios[i].nombre_almacen);
				data.push(columns);
			}

			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-ALMACENES.xlsx");
			blockUI.stop();

		}

		$scope.dibujarCabeceraPDFAlmacenes = function (doc, pagina, totalPaginas) {
			doc.font('Helvetica-Bold', 12);
			doc.text("REPORTE ALMACENES", 0, 25, { align: "center" });
			doc.font('Helvetica-Bold', 10);
			doc.text("SUCURSAL:" + $scope.reporte.sucursal.nombre + " - ALMACEN:" + $scope.reporte.almacen.nombre, 0, 38, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 750, { align: "center" });

			doc.rect(30, 50, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Código", 45, 60);
			doc.text("Cant.", 110, 60, { width: 50 });
			doc.text("Unid.", 160, 60, { width: 50 });
			doc.text("Descripción", 210, 60, { width: 170 });
			if ($scope.usuario.empresa.usar_vencimientos) {
				doc.text("Venc.", 380, 60);
				doc.text("Lote", 430, 60);
			}
			doc.text("Costo Unitario", 470, 60, { width: 50 });
			doc.text("Total General", 530, 60, { width: 50 });
		}

		$scope.inicio();


	})

	.controller('ControladorVentasMensuales', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipo, ReporteVentasMensualesDatos) {

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			
			$scope.obtenerGestiones();
			$scope.sucursales = $scope.obtenerSucursales();		
			$scope.reporte={}
			$scope.reporte.sucursal = ($scope.sucursales.length ==1) ? $scope.sucursales[0] : null;
			ejecutarScriptsVentasMensuales();
		}

		$scope.obtenerSucursales = function () {
			var sucursales = [];
			if ($scope.usuario.sucursalesUsuario.length > 1) {
				sucursales.push({ id: 0, nombre: "TODOS" });
			}
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			}
			return sucursales;
		}

		$scope.obtenerGestiones = function () {
			blockUI.start();
			var promesa = ClasesTipo("GTN");
			promesa.then(function (entidad) {
				$scope.gestiones = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.generarExcelVentasMensuales = function (reporte) {
			blockUI.start();
			inicio = new Date($scope.convertirFecha(reporte.fechaInicioTexto));
			fin = new Date($scope.convertirFecha(reporte.fechaFinTexto));
			var promesa = ReporteVentasMensualesDatos($scope.usuario.id_empresa, reporte.sucursal.id, inicio, fin);
			promesa.then(function (datos) {
				var detallesVenta = JSON.parse(datos.detallesVenta);
				var data = [["FECHA DE LA FACTURA", "N° DE LA FACTURA", "N° DE AUTORIZACION", "NIT/CI CLIENTE", "NOMBRE O RAZON SOCIAL", "UBICACION CLIENTE",
					"CODIGO", "DETALLE", "UNIDAD", "GRUPO", "CANTIDAD", "PU", "TOTAL", "IMPORTE ICE/IEHD/TASAS", "EXPORTACIONES Y OPERACIONES EXENTAS",
					"VENTAS GRAVADAS A TASA CERO", "SUBTOTAL", "DESCUENTOS, BONIFICACIONES Y REBAJAS OBTENIDAS",
					"IMPORTE BASE PARA DEBITO FISCAL", "DEBITO FISCAL", "SUCURSAL", "USUARIO"]]
				if ($scope.usuario.empresa.usar_vencimientos) {
					data[0].push('FECHA VENCIMIENTO');
					data[0].push('LOTE');
				}
				data[0].push('VENDEDOR');
				for (var i = 0; i < detallesVenta.length; i++) {
					var columns = [];
					detallesVenta[i].venta.fecha = new Date(detallesVenta[i].venta.fecha);
					columns.push(detallesVenta[i].venta.fecha);
					columns.push(detallesVenta[i].venta.factura);
					columns.push(detallesVenta[i].venta.autorizacion);
					columns.push(detallesVenta[i].venta.cliente.nit);
					columns.push(detallesVenta[i].venta.cliente.razon_social);
					columns.push(detallesVenta[i].venta.cliente.ubicacion_geografica);
					columns.push(detallesVenta[i].producto.codigo);
					columns.push(detallesVenta[i].producto.nombre);
					columns.push(detallesVenta[i].producto.unidad_medida);
					if(detallesVenta[i].producto.grupo){
						columns.push(detallesVenta[i].producto.grupo.nombre);
					}else{
						columns.push("");
					}
					columns.push(detallesVenta[i].cantidad);
					columns.push(detallesVenta[i].precio_unitario);
					columns.push(detallesVenta[i].importe);
					columns.push(detallesVenta[i].ice);
					columns.push(0);
					columns.push(0);
					columns.push(detallesVenta[i].importe - detallesVenta[i].ice);
					var descuento = detallesVenta[i].importe - detallesVenta[i].ice - detallesVenta[i].excento + detallesVenta[i].recargo;
					columns.push(descuento);
					columns.push(detallesVenta[i].total);
					columns.push(Math.round((detallesVenta[i].total * 0.13) * 100) / 100);
					columns.push(detallesVenta[i].venta.almacen.sucursal.nombre);
					columns.push(detallesVenta[i].venta.usuario.nombre_usuario);

					if ($scope.usuario.empresa.usar_vencimientos) {
						if (detallesVenta[i].inventario) {
							detallesVenta[i].inventario.fecha_vencimiento = new Date(detallesVenta[i].inventario.fecha_vencimiento);
							columns.push(detallesVenta[i].inventario.fecha_vencimiento);
							columns.push(detallesVenta[i].inventario.lote);
						} else if (detallesVenta[i].lote != null) {
							detallesVenta[i].fecha_vencimiento = new Date(detallesVenta[i].fecha_vencimiento);
							columns.push(detallesVenta[i].fecha_vencimiento);
							columns.push(detallesVenta[i].lote);
						} else {
							columns.push("");
							columns.push("");
						}
					}

					columns.push((detallesVenta[i].venta.vendedor ? detallesVenta[i].venta.vendedor.persona.nombre_completo : ""));

					data.push(columns);
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

		$scope.generarPdfVentasMensuales = function (reporte) {
			blockUI.start();
			inicio = new Date($scope.convertirFecha(reporte.fechaInicioTexto));
			fin = new Date($scope.convertirFecha(reporte.fechaFinTexto));
			var promesa = ReporteVentasMensualesDatos($scope.usuario.id_empresa, reporte.sucursal.id, inicio, fin);
			promesa.then(function (datos) {

				var detallesVenta = JSON.parse(datos.detallesVenta);
				console.log(detallesVenta)
				var doc = new PDFDocument({compress: false, margin: 10 });
				var stream = doc.pipe(blobStream());
				// draw some text

				doc.font('Helvetica', 8);
				var y = 150, itemsPorPagina = 15, items = 0, pagina = 1;
				$scope.dibujarCabeceraPDFVentasMensuales(doc, datos, reporte, pagina);
				var sumaImporte = 0, sumaImporteIce = 0, sumaImporteExp = 0, sumaImporteGrab = 0, sumaTotal = 0, sumaDescuentos = 0, sumaImporteBase = 0, sumaCredito = 0;
				var sumaSubImporte = 0, sumaSubImporteIce = 0, sumaSubImporteExp = 0, sumaSubImporteGrab = 0, sumaSubTotal = 0, sumaSubDescuentos = 0, sumaSubImporteBase = 0, sumaSubCredito = 0;
				for (var i = 0; i < detallesVenta.length && items <= itemsPorPagina; i++) {
					doc.rect(40, y - 10, 540, 40).stroke();
					doc.font('Helvetica', 8);
					detallesVenta[i].venta.fecha = new Date(detallesVenta[i].venta.fecha); console.log(new Date().getFullYear().toString().substr(-2));
					doc.text(detallesVenta[i].venta.fecha.getDate() + "/" + (detallesVenta[i].venta.fecha.getMonth() + 1) + "/" + detallesVenta[i].venta.fecha.getFullYear().toString().substr(-2), 45, y);
					doc.text((detallesVenta[i].venta.factura ? detallesVenta[i].venta.factura : ""), 80, y);
					doc.font('Helvetica', 7);
					doc.text(detallesVenta[i].venta.cliente.razon_social, 115, y - 2, { width: 80 });
					doc.text(detallesVenta[i].producto.nombre, 205, y - 2, { width: 80 });
					doc.font('Helvetica', 8);
					doc.text(detallesVenta[i].cantidad, 300, y, { width: 50 });
					doc.text(detallesVenta[i].producto.unidad_medida, 330, y, { width: 50 });
					if ($scope.usuario.empresa.usar_vencimientos) {
						if (detallesVenta[i].inventario) {
							detallesVenta[i].inventario.fecha_vencimiento = new Date(detallesVenta[i].inventario.fecha_vencimiento);
							doc.text(detallesVenta[i].inventario.fecha_vencimiento.getDate() + "/" + (detallesVenta[i].inventario.fecha_vencimiento.getMonth() + 1) + "/" + detallesVenta[i].inventario.fecha_vencimiento.getFullYear().toString().substr(-2), 385, y);
							//var descuento=detallesVenta[i].importe-detallesVenta[i].ice-detallesVenta[i].excento+detallesVenta[i].recargo;
							doc.text(detallesVenta[i].inventario.lote, 435, y);
						}
					}
					doc.text(detallesVenta[i].descuento, 475, y);
					doc.text(detallesVenta[i].recargo, 505, y);
					doc.text(detallesVenta[i].total, 535, y);
					//doc.text(detallesVenta[i].total,705,y);
					y = y + 40;
					items++;

					if (items == itemsPorPagina || i + 1 == detallesVenta.length) {
						if (i + 1 == detallesVenta.length) {

						} else {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 150;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFVentasMensuales(doc, datos, reporte, pagina);
							doc.font('Helvetica', 8);
						}
					}
				}
				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 45, y);
				doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, y);
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			});
		}

		$scope.dibujarCabeceraPDFVentasMensuales = function (doc, datos, reporte, pagina) {
			doc.font('Helvetica-Bold', 12);
			doc.text("REPORTE DE VENTAS", 0, 25, { align: "center" });
			doc.font('Helvetica', 8);
			doc.text("Desde  " + reporte.fechaInicioTexto, -70, 40, { align: "center" });
			doc.text("Hasta " + reporte.fechaFinTexto, 70, 40, { align: "center" });
			doc.text("FOLIO " + pagina, 550, 25);
			doc.rect(40, 60, 540, 40).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("NOMBRE O RAZÓN SOCIAL : ", 65, 75);
			doc.text("NIT : ", 440, 75);
			doc.font('Helvetica', 8);
			doc.text(datos.empresa.razon_social, 195, 75);
			doc.text(datos.empresa.nit, 460, 75);
			doc.rect(40, 100, 540, 40).stroke();
			doc.font('Helvetica-Bold', 8);
			//doc.text("Nº",45,110);
			doc.text("Fecha", 45, 110, { width: 40 });
			doc.text("Nº De Nota", 80, 110, { width: 30 });
			doc.text("Cliente", 115, 110);
			doc.text("Producto", 205, 110);
			doc.text("Cant.", 290, 110);
			doc.text("Unidad", 330, 110);
			doc.text("Fecha Venc", 385, 110, { width: 30 });
			doc.text("Lote", 435, 110, { width: 35 });
			doc.text("Desc.", 470, 110);
			doc.text("Rec.", 500, 110);
			doc.text("Total", 535, 110);

		}

		$scope.inicio();


	})

	.controller('ControladorEstadoResultadosNoContable', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		GastosVariosLista, ReporteEstadoResultadosNoContableDatos) {

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.idModalGastos = "dialog-gastos";

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsEstadoResultadosNoContable($scope.idModalGastos);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});

		$scope.abrirPopupGastos = function () {
			$scope.gasto = null;
			$scope.abrirPopup($scope.idModalGastos);
		}

		$scope.cerrarPopupGastos = function () {
			$scope.cerrarPopup($scope.idModalGastos);
		}

		$scope.inicio = function () {

		}

		$scope.generarEstadoResultadosNoContable = function (gasto, inicio, fin) {
			$scope.cerrarPopupGastos();
			blockUI.start();
			inicio = new Date($scope.convertirFecha(inicio));
			fin = new Date($scope.convertirFecha(fin));
			var promesa = ReporteEstadoResultadosNoContableDatos($scope.usuario.id_empresa, inicio, fin);
			promesa.then(function (ventasEmpresa) {
				promesa = GastosVariosLista($scope.usuario.id_empresa, inicio, fin);
				promesa.then(function (gastosVariosEmpresa) {
					var sumaVentasCredito = 0, sumaVentasContado = 0, sumaVentasTotal = 0, costoVentas = 0, sumaVentasFacturacion = 0, sumaVentasProforma = 0;
					for (var i = 0; i < ventasEmpresa.length; i++) {
						if (ventasEmpresa[i].movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ||
							ventasEmpresa[i].movimiento.clase.nombre_corto == $scope.diccionario.EGRE_PROFORMA) {

							if (ventasEmpresa[i].movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION) {
								sumaVentasTotal = sumaVentasTotal + (ventasEmpresa[i].total * 0.87);

								if (ventasEmpresa[i].tipoPago != null) {
									if (ventasEmpresa[i].tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
										sumaVentasCredito = sumaVentasCredito + (ventasEmpresa[i].total * 0.87);
									} else if (ventasEmpresa[i].tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CONTADO) {
										sumaVentasContado = sumaVentasContado + (ventasEmpresa[i].total * 0.87);
									}
								}

							} else {
								sumaVentasTotal = sumaVentasTotal + (ventasEmpresa[i].total);

								if (ventasEmpresa[i].tipoPago != null) {
									if (ventasEmpresa[i].tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
										sumaVentasCredito = sumaVentasCredito + ventasEmpresa[i].total;
									} else if (ventasEmpresa[i].tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CONTADO) {
										sumaVentasContado = sumaVentasContado + ventasEmpresa[i].total;
									}
								}
							}

							for (var j = 0; j < ventasEmpresa[i].movimiento.detallesMovimiento.length; j++) {
								costoVentas = costoVentas + ventasEmpresa[i].movimiento.detallesMovimiento[j].total;
							}
						}

					}
					sumaVentasTotal = Math.round((sumaVentasTotal) * 100) / 100;
					costoVentas = Math.round((costoVentas) * 100) / 100;
					var utilidadVentas = Math.round((sumaVentasTotal - costoVentas) * 100) / 100;
					var sumaGastos = 0;
					for (var i = 0; i < gastosVariosEmpresa.length; i++) {
						for (var j = 0; j < gastosVariosEmpresa[i].detallesCompra.length; j++) {
							sumaGastos = sumaGastos + gastosVariosEmpresa[i].detallesCompra[j].total;
						}
					}
					sumaGastos = (Math.round((sumaGastos - (sumaGastos * 0.13)) * 100) / 100) + gasto;
					var utilidadPeriodo = utilidadVentas - sumaGastos;


					var doc = new PDFDocument({ margin: 10 });
					var stream = doc.pipe(blobStream());
					// draw some text
					doc.font('Helvetica-Bold', 16);
					doc.text("ESTADO DE RESULTADOS NO CONTABLE", 0, 60, { align: "center" });
					doc.font('Helvetica-Bold', 8);
					doc.text("VENTAS", 100, 100);
					doc.text(sumaVentasTotal, 300, 100);
					doc.text("COSTO DE VENTAS", 100, 200);
					doc.text(costoVentas, 300, 200);
					doc.text("UTILIDAD BRUTA EN VENTAS", 100, 250);
					doc.text(utilidadVentas, 300, 250);
					doc.text("GASTOS", 100, 300);
					doc.text(sumaGastos, 300, 300);
					doc.font('Helvetica', 8);
					doc.text("VENTAS CONTADO", 150, 130);
					doc.text(Math.round(sumaVentasContado * 100) / 100, 250, 130);
					doc.text("VENTAS CREDITO", 150, 160);
					doc.text(Math.round(sumaVentasCredito * 100) / 100, 250, 160);

					var y = 330, totalGasto = 0;
					for (var i = 0; i < gastosVariosEmpresa.length; i++) {
						doc.text(gastosVariosEmpresa[i].nombre, 130, y);
						totalGasto = 0;
						for (var j = 0; j < gastosVariosEmpresa[i].detallesCompra.length; j++) {
							totalGasto = totalGasto + gastosVariosEmpresa[i].detallesCompra[j].total;
						}
						doc.text(Math.round((totalGasto - (totalGasto * 0.13)) * 100) / 100, 280, y);
						y = y + 25;
					}
					doc.text("OTROS GASTOS", 130, y);
					doc.text(gasto, 280, y);
					doc.font('Helvetica-Bold', 8);
					var textoUtilidad = ((utilidadPeriodo >= 0) ? "UTILIDAD DEL PERIODO" : "PÉRDIDA DEL PERIODO")
					doc.text(textoUtilidad, 100, y + 25);
					doc.text(utilidadPeriodo, 300, y + 25);

					doc.end();
					stream.on('finish', function () {
						var fileURL = stream.toBlobURL('application/pdf');
						window.open(fileURL, '_blank', 'location=no');
					});
					blockUI.stop();
				});
			});
		}

		$scope.generarExcelAlmacenes = function () {
			blockUI.start();
			var promesa = InventariosCosto($scope.usuario.id_empresa);
			promesa.then(function (inventarios) {
				var data = [["Código", "Cant.", "Unid.", "Descripción", "Costo Unitario", "Total General"]]
				for (var i = 0; i < inventarios.length; i++) {
					var columns = [];
					columns.push(inventarios[i].producto.codigo);
					columns.push(inventarios[i].cantidad);
					columns.push(inventarios[i].producto.unidad_medida);
					columns.push(inventarios[i].producto.nombre);
					columns.push(inventarios[i].costo_unitario);
					columns.push(inventarios[i].costo_total);
					data.push(columns);
				}

				var ws_name = "SheetJS";
				var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
				/* add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-ALMACENES.xlsx");
				blockUI.stop();
			});
		}

		$scope.dibujarCabeceraPDFAlmacenes = function (doc, pagina, totalPaginas) {
			doc.font('Helvetica-Bold', 12);
			doc.text("REPORTE ALMACENES", 0, 25, { align: "center" });
			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 750, { align: "center" });

			doc.rect(30, 50, 555, 30).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("Código", 45, 60);
			doc.text("Cant.", 110, 60, { width: 50 });
			doc.text("Unid.", 160, 60, { width: 50 });
			doc.text("Descripción", 210, 60, { width: 300 });
			doc.text("Costo Unitario", 470, 60, { width: 50 });
			doc.text("Total General", 530, 60, { width: 50 });
		}

		$scope.inicio();


	})

	.controller('ControladorComprasMensuales', function ($scope, $localStorage, $location, $templateCache, $route, blockUI,
		ClasesTipo, ReporteComprasMensualesDatos) {

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerGestiones();
			$scope.sucursales = $scope.obtenerSucursales();
			$scope.reporte={}
			$scope.reporte.sucursal = ($scope.sucursales.length ==1) ? $scope.sucursales[0] : null;
			ejecutarScriptsVentasMensuales();
		}
		$scope.obtenerSucursales = function () {
			var sucursales = [];
			
			if ($scope.usuario.sucursalesUsuario.length > 1) {
				sucursales.push({ id: 0, nombre: "TODOS" });
			}
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			}
			return sucursales;
		}
		$scope.obtenerGestiones = function () {
			blockUI.start();
			var promesa = ClasesTipo("GTN");
			promesa.then(function (entidad) {
				$scope.gestiones = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.generarExcelComprasMensuales = function (reporte) {
			blockUI.start();
			inicio = new Date($scope.convertirFecha(reporte.fechaInicioTexto));
			fin = new Date($scope.convertirFecha(reporte.fechaFinTexto));
			var promesa = ReporteComprasMensualesDatos($scope.usuario.id_empresa, reporte.sucursal.id, inicio, fin);
			promesa.then(function (datos) {
				var detallesCompra = datos.detallesCompra;
				var data = [["FECHA DE LA FACTURA", "N° DE LA FACTURA", "N° DE AUTORIZACION", "NIT/CI CLIENTE", "NOMBRE O RAZON SOCIAL",
					"CODIGO", "DETALLE","UNIDAD", "GRUPO", "CANTIDAD", "PU", "TOTAL", "IMPORTE ICE/IEHD/TASAS", "EXENTOS",
					"SUBTOTAL", "DESCUENTOS, BONIFICACIONES Y REBAJAS OBTENIDAS",
					"IMPORTE BASE PARA DEBITO FISCAL", "CREDITO FISCAL", "FECHA DE VENCIMIENTO", "LOTE", "SUCURSAL", "USUARIO", "CENTRO DE COSTOS"]]
				for (var i = 0; i < detallesCompra.length; i++) {
					var columns = [];
					detallesCompra[i].compra.fecha = new Date(detallesCompra[i].compra.fecha);
					columns.push(detallesCompra[i].compra.fecha);
					columns.push(detallesCompra[i].compra.factura);
					columns.push(detallesCompra[i].compra.autorizacion);
					columns.push(detallesCompra[i].compra.proveedor.nit);
					columns.push(detallesCompra[i].compra.proveedor.razon_social);
					columns.push(detallesCompra[i].producto.codigo);
					columns.push(detallesCompra[i].producto.nombre);
					
					columns.push(detallesCompra[i].producto.unidad_medida);
					if (detallesCompra[i].producto.grupo) {
						columns.push(detallesCompra[i].producto.grupo.nombre);						
					} else {
						columns.push("");

					}
					columns.push(detallesCompra[i].cantidad);				
					columns.push(detallesCompra[i].costo_unitario);
					columns.push(detallesCompra[i].importe);
					columns.push(detallesCompra[i].ice);
					columns.push(detallesCompra[i].excento);
					columns.push(detallesCompra[i].importe - detallesCompra[i].ice);
					var descuento = detallesCompra[i].importe - detallesCompra[i].ice - detallesCompra[i].excento + detallesCompra[i].recargo;
					columns.push(descuento);
					columns.push(detallesCompra[i].total);
					columns.push(Math.round((detallesCompra[i].total * 0.13) * 100) / 100);

					if (detallesCompra[i].inventario) {
						columns.push(new Date(detallesCompra[i].inventario.fecha_vencimiento));
						columns.push(detallesCompra[i].inventario.lote);
					} else {
						columns.push("");
						columns.push("");
					}

					//columns.push(0);
					//columns.push(0);
					columns.push(detallesCompra[i].compra.almacen.sucursal.nombre);
					columns.push($scope.usuario.nombre_usuario);
					columns.push(detallesCompra[i].centroCosto.nombre_corto);
					
					data.push(columns);
				}

				var ws_name = "SheetJS";
				var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
				/* add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "COMPRAS-MENSUALES.xlsx");
				blockUI.stop();
			});
		}

		$scope.generarPdfComprasMensuales = function (reporte) {
			blockUI.start();
			inicio = new Date($scope.convertirFecha(reporte.fechaInicioTexto));
			fin = new Date($scope.convertirFecha(reporte.fechaFinTexto));
			var promesa = ReporteComprasMensualesDatos($scope.usuario.id_empresa, reporte.sucursal.id, inicio, fin);
			promesa.then(function (datos) {

				var detallesCompra = datos.detallesCompra;
				var doc = new PDFDocument({ margin: 10 });
				var stream = doc.pipe(blobStream());
				// draw some text

				doc.font('Helvetica', 8);
				var y = 150, itemsPorPagina = 15, items = 0, pagina = 1;
				$scope.dibujarCabeceraPDFcomprasMensuales(doc, datos, reporte, pagina);
				var sumaImporte = 0, sumaImporteIce = 0, sumaImporteExp = 0, sumaImporteGrab = 0, sumaTotal = 0, sumaDescuentos = 0, sumaImporteBase = 0, sumaCredito = 0;
				var sumaSubImporte = 0, sumaSubImporteIce = 0, sumaSubImporteExp = 0, sumaSubImporteGrab = 0, sumaSubTotal = 0, sumaSubDescuentos = 0, sumaSubImporteBase = 0, sumaSubCredito = 0;
				for (var i = 0; i < detallesCompra.length && items <= itemsPorPagina; i++) {
					doc.rect(40, y - 10, 540, 40).stroke();
					detallesCompra[i].compra.fecha = new Date(detallesCompra[i].compra.fecha);
					doc.text(detallesCompra[i].compra.fecha.getDate() + "/" + (detallesCompra[i].compra.fecha.getMonth() + 1) + "/" + detallesCompra[i].compra.fecha.getFullYear(), 45, y);
					doc.text((detallesCompra[i].compra.factura ? detallesCompra[i].compra.factura : ""), 90, y);
					doc.text(detallesCompra[i].compra.proveedor.razon_social, 135, y - 6, { width: 80 });
					doc.text(detallesCompra[i].producto.nombre, 225, y - 6, { width: 80 });
					doc.text(detallesCompra[i].producto.unidad_medida, 300, y, { width: 50 });
					if (detallesCompra[i].inventario) {
						detallesCompra[i].inventario.fecha_vencimiento = new Date(detallesCompra[i].inventario.fecha_vencimiento);
						doc.text(detallesCompra[i].inventario.fecha_vencimiento.getDate() + "/" + (detallesCompra[i].inventario.fecha_vencimiento.getMonth() + 1) + "/" + detallesCompra[i].inventario.fecha_vencimiento.getFullYear(), 345, y);
						doc.text(detallesCompra[i].inventario.lote, 405, y);
					}
					//var descuento=detallesCompra[i].importe-detallesCompra[i].ice-detallesCompra[i].excento+detallesCompra[i].recargo;
					doc.text(detallesCompra[i].descuento, 445, y);
					doc.text(detallesCompra[i].recargo, 495, y);
					doc.text(detallesCompra[i].total, 535, y);
					//doc.text(detallesCompra[i].total,705,y);
					y = y + 40;
					items++;

					if (items == itemsPorPagina || i + 1 == detallesCompra.length) {
						if (i + 1 == detallesCompra.length) {

						} else {
							doc.addPage({ margin: 0, bufferPages: true });
							y = 150;
							items = 0;
							pagina = pagina + 1;
							$scope.dibujarCabeceraPDFcomprasMensuales(doc, datos, reporte, pagina);
							doc.font('Helvetica', 8);
						}
					}
				}
				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 45, y);
				doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, y);
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			});
		}
		$scope.dibujarCabeceraPDFcomprasMensuales = function (doc, datos, reporte, pagina) {
			doc.font('Helvetica-Bold', 12);
			doc.text("REPORTE DE COMPRAS", 0, 25, { align: "center" });
			doc.font('Helvetica', 8);
			doc.text("Desde  " + reporte.fechaInicioTexto, -70, 40, { align: "center" });
			doc.text("Hasta " + reporte.fechaFinTexto, 70, 40, { align: "center" });
			doc.text("FOLIO " + pagina, 550, 25);
			doc.rect(40, 60, 540, 40).stroke();
			doc.font('Helvetica-Bold', 8);
			doc.text("NOMBRE O RAZÓN SOCIAL : ", 65, 75);
			doc.text("NIT : ", 440, 75);
			doc.font('Helvetica', 8);
			doc.text(datos.empresa.razon_social, 195, 75);
			doc.text(datos.empresa.nit, 460, 75);
			doc.rect(40, 100, 540, 40).stroke();
			doc.font('Helvetica-Bold', 8);
			//doc.text("Nº",45,110);
			doc.text("Fecha", 45, 110, { width: 40 });
			doc.text("Nº De Nota", 80, 110);
			doc.text("Proveedor", 135, 110);
			doc.text("Producto", 225, 110);
			doc.text("Unidad", 300, 110);
			doc.text("Fecha Venc", 345, 110);
			doc.text("Lote", 405, 110, { width: 35 });
			doc.text("Descuento", 440, 110);

			doc.text("Recargo", 490, 110);
			doc.text("Total", 535, 110);
			doc.font('Helvetica', 8);
		}

		/*$scope.dibujarCabeceraPDFcomprasMensuales=function(doc,datos,reporte,pagina){
			doc.font('Helvetica-Bold',12);
			doc.text("REPORTE DE COMPRAS",0,25,{align:"center"});
			doc.font('Helvetica-Bold',8);
			doc.text("Desde  "+reporte.fechaInicioTexto,-70,40,{align:"center"});
			doc.text("Hasta "+reporte.fechaFinTexto,70,40,{align:"center"});
			doc.text("FOLIO "+pagina,720,25);
			doc.rect(40,60,720,40).stroke();		
			doc.text("NOMBRE O RAZÓN SOCIAL : ",65,75);
			doc.text("NIT : ",440,75);
			doc.font('Helvetica',8);		
			doc.text(datos.empresa.razon_social,195,75);
			doc.text(datos.empresa.nit,460,75);		
			doc.rect(40,100,720,60).stroke();
			doc.font('Helvetica-Bold',8);
			//doc.text("Nº",45,110);
			doc.text("Fecha",50,110,{width:40});
			doc.text("Nº De Nota",105,110,);
			doc.text("Proveedor",190,110,);
			doc.text("Producto",265,110,);
			doc.text("Unidad",325,110,);
			doc.text("Fecha Vencimiento",385,110);
			doc.text("Lote",495,110,{width:35});
			doc.text("Descuento",555,110,);
			doc.text("Recargo",655,110);
			doc.text("Total",720,110);		
		}
		*/
		$scope.inicio();


	})
