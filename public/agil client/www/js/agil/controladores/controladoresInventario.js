angular.module('agil.controladores')

	.controller('ControladorInventarios', ['$scope', '$timeout', '$filter', '$window', '$localStorage', '$location', '$templateCache', '$route', 'blockUI', 'ListaInventariosProducto',
		'Inventario', 'InventarioPaginador', 'Productos', 'ActualizacionInventario', 'ListaProductosEmpresa', 'IngresosPorInventario', 'ActualizarDetalleMovimiento', 'ListaGruposProductoUsuario',
		'ProductosUsuario','IngPorInventario', 'InventarioInicial',function ($scope, $timeout, $filter, $window, $localStorage, $location, $templateCache, $route, blockUI, ListaInventariosProducto,
		Inventario, InventarioPaginador, Productos, ActualizacionInventario, ListaProductosEmpresa, IngresosPorInventario, ActualizarDetalleMovimiento, ListaGruposProductoUsuario,
		ProductosUsuario,IngPorInventario, InventarioInicial) {
		blockUI.start();

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.idModalActualizacionInventario = 'dialog-actualizacion-inventario';
		$scope.idModalIngresosPorInventario = 'dialog-ingreso-por-inventario';
		$scope.idModalCreacionInventario = 'dialog-creacion-inventario-inicial';

		$scope.inicio = function () {
			$scope.seleccionGrupo = {}
			$scope.obtenerSucursales();
			$scope.obtenerInventarios();
			$scope.compraIngresosPorInventario();
			$scope.obtenerGruposProductosEmpresaUsuario()
			$scope.obtenerFormatoFactura()
			//$scope.aplicarTabla('tabla-inventarios',4);
		}

		$scope.obtenerFormatoFactura = function () {
			blockUI.start();
			var promesa = ClasesTipo("FORM_IMP_FAC");
			promesa.then(function (entidad) {
				$scope.formatosFactura = entidad.clases;
				blockUI.stop();
			});
		}
		$scope.establecerCantidad = function (model) {
			$scope.cantidadInventario = model
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

		$scope.establecerAlmacenBusqueda = function (almacen) {
			console.log(almacen.id);
			$scope.almacenBusqueda = almacen;
		}

		$scope.obtenerInventarios = function () {
			$scope.abs = $window.Math.abs;
			$scope.itemsPorPagina = 10;
			$scope.paginaActual = 1;
			$scope.columna = "nombre";
			$scope.direccion = "asc";
			$scope.textoBusqueda = "";
			$scope.cantidadInventario = "0"
			/* $scope.cantidadInventario = "0"; */
			if ($scope.sucursales.length == 1) {
				$scope.sucursalBusqueda = $scope.sucursales[0];
				$scope.almacenes = $scope.sucursalBusqueda.almacenes;
				if ($scope.almacenes.length == 1) {
					$scope.almacenBusqueda = $scope.sucursalBusqueda.almacenes[0];
					$scope.buscarInventarios($scope.almacenBusqueda.id, $scope.paginaActual, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion, 0);
				}
			}
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
				blockUI.stop()
				$scope.gruposProducto = []
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null && err.data !== "") ? err.data : 'Error: Se perdio la conexión.'
				$scope.mostrarMensaje(mensaje)
			})
		}

		$scope.verificarPulso = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				$scope.textoBusqueda = textoBusqueda;
				if ($scope.almacenBusqueda) {
					$scope.buscarInventarios($scope.almacenBusqueda.id, 1, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion, $scope.cantidadInventario);
				}
			}
		}

		$scope.verDetalleInventario = function (producto) {
			var promesa = ListaInventariosProducto(producto.id, $scope.almacenBusqueda.id);
			promesa.then(function (inventarios) {
				producto.inventarios = inventarios
			});
			var style = $("#" + producto.id).css("display");
			if (style == "none") {
				$("#" + producto.id).css("display", "");
			} else {
				$("#" + producto.id).css("display", "none");
			}
		}
		function compare(a, b) {
			if ($scope.direccion == "asc") {
				return a.cantidad_total - b.cantidad_total
			} else {
				return b.cantidad_total - a.cantidad_total
			}
		}
		$scope.clasificarColumna = function (columna) {
			if (columna == "cantidad") {
				if ($scope.direccion == "asc") {
					$scope.direccion = "desc";
				} else {
					$scope.direccion = "asc";
				}
				$scope.productos.sort(compare)
			} else {
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
				$scope.buscarInventarios($scope.almacenBusqueda.id, $scope.paginaActual, $scope.itemsPorPagina, $scope.textoBusqueda, $scope.columna, $scope.direccion, $scope.cantidadInventario, $scope.seleccionGrupo.id);
			}
		}

		$scope.buscarInventarios = function (idAlmacen, pagina, itemsPagina, texto, columna, direccion, cantidad, grupo) {
			blockUI.start();
			$scope.itemsPorPagina = itemsPagina;
			if (texto == "" || texto == null) {
				texto = 0;
			} else {
				$scope.textoBusqueda = texto;
			}
			$scope.paginaActual = pagina;
			var promesa = InventarioPaginador($scope.usuario.id_empresa, idAlmacen, pagina, itemsPagina, texto, columna, direccion, cantidad, grupo, $scope.usuario.id);
			promesa.then(function (dato) {
				var productos = dato.productos;
				var mproductos = [];

				for (var i = 0; i < productos.length; i++) {
					var inventarios = [], cantidadTotal = 0;
					/*for(var j=0;j<productos[i].inventarios.length;j++){
						inventarios.push({id:productos[i].inventarios[j].id,sucursal:productos[i].inventarios[j].almacen.sucursal.nombre,
										  almacen:productos[i].inventarios[j].almacen.nombre,
										  cantidad:productos[i].inventarios[j].cantidad,
										  costo_unitario:productos[i].inventarios[j].costo_unitario,
										  costo_total:productos[i].inventarios[j].costo_total,
										  fecha_vencimiento:new Date(productos[i].inventarios[j].fecha_vencimiento),
										  lote:productos[i].inventarios[j].lote});
						cantidadTotal=cantidadTotal+productos[i].inventarios[j].cantidad;
					}*/
					$scope.colorearInventarioDisponible(productos[i].cantidad, productos[i]);
					mproductos.push({
						id: productos[i].id, nombre: productos[i].nombre, descripcion: productos[i].descripcion, codigo: productos[i].codigo, grupo: productos[i].grupo, subgrupo: productos[i].subgrupo,
						inventarios: inventarios, cantidad_total: productos[i].cantidad, fecha_vencimiento: new Date(productos[i].fecha_vencimiento), precio_unitario: productos[i].precio_unitario,
						porcentaje: $scope.porcentaje, color: $scope.color, unidad_medida: productos[i].unidad_medida
					});
				}
				$scope.paginas = [];
				for (var i = 1; i <= dato.paginas; i++) {
					$scope.paginas.push(i);
				}

				$scope.productos = mproductos;

				blockUI.stop();
			}).catch(function (err) {
				blockUI.stop()
				$scope.Productos = []
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null && err.data !== "") ? err.data : 'Error: Se perdio la conexión.'
				$scope.mostrarMensaje(mensaje)
			})
		}

		$scope.colorearInventarioDisponible = function (inventarioDisponible, producto) {
			if (inventarioDisponible == 0) {
				$scope.porcentaje = "100";
				$scope.color = "red";
			} else if (inventarioDisponible > ((producto.inventario_minimo * 3) + 1)) {
				$scope.porcentaje = "100";
				$scope.color = "green";
			} else if (inventarioDisponible > ((producto.inventario_minimo * 2) + 1)) {
				$scope.porcentaje = "75";
				$scope.color = "green";
			} else if (inventarioDisponible > ((producto.inventario_minimo * 1.5) + 1)) {
				$scope.porcentaje = "50";
				$scope.color = "green"
			} else if (inventarioDisponible == (producto.inventario_minimo + 1)) {
				$scope.porcentaje = "38";
				$scope.color = "yellow";
			} else if (inventarioDisponible == producto.inventario_minimo) {
				$scope.porcentaje = "25";
				$scope.color = "red";
			} else if (inventarioDisponible < producto.inventario_minimo && inventarioDisponible > 0) {
				$scope.porcentaje = "12";
				$scope.color = "red";
			}
		}

		$scope.abrirPopupActualizacionInventario = function (inventario) {
			$scope.inventario = inventario;
			$scope.abrirPopup($scope.idModalActualizacionInventario);
		}

		$scope.modificarCantidadInventario = function (inventario) {
			ActualizacionInventario.update({ id: inventario.id }, inventario, function (data) {
				$scope.cerrarPopupActualizacionInventario();
				$scope.mostrarMensaje(data.message);
				$scope.obtenerInventarios();
			}, function (error) {
				$scope.cerrarPopupActualizacionInventario();
				$scope.mostrarMensaje(error);
			});
		}
		$scope.editing = false;
		$scope.editDesalleMovimiento = function (producto) {
			console.log($scope.editing)


			console.log($scope.editing)
			if ($scope.display) {
				if ($scope.editing) {
					$scope.editing = false;
				} else {
					$scope.editing = true;
				}
			} else {
				if ($scope.editing) {
					$scope.editing = false;
				} else {
					$scope.editing = true;
				}
				var style = $("#" + producto.id).css("display");
				if (style == "none") {
					$("#" + producto.id).css("display", "");
				} else {
					$scope.display = false
					$("#" + producto.id).css("display", "none");
				}
			}
		}
		$scope.verDetalleMovimiento = function (compra) {
			console.log(compra)

			$scope.editing = false;
			var style = $("#" + compra.id).css("display");
			if (style == "none") {
				$("#" + compra.id).css("display", "");
				$scope.display = true;
			} else {
				$scope.display = false
				$scope.editing = false;
				$("#" + compra.id).css("display", "none");
			}
		}
		$scope.generarPdfIngresosPorInventario = function (compra) {
			blockUI.start();


			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;
			var y = 205, itemsPorPagina = 17, items = 0, pagina = 1, totalPaginas = Math.ceil(compra.detallesMovimiento.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFIngresosPorInventario(doc, compra, 1, totalPaginas);
			doc.font('Helvetica', 8);
			for (var i = 0; i < compra.detallesMovimiento.length && items <= itemsPorPagina; i++) {

				doc.rect(50, y, 540, 30).stroke();

				if ($scope.usuario.empresa.usar_vencimientos) {
					doc.text(compra.detallesMovimiento[i].producto.codigo, 60, y + 10, { width: 50 });
					doc.text(compra.detallesMovimiento[i].cantidad, 120, y + 10);
					doc.text(compra.detallesMovimiento[i].producto.unidad_medida, 150, y + 10, { width: 50 });
					doc.text(compra.detallesMovimiento[i].producto.nombre, 190, y + 10, { width: 180 });
					doc.text(compra.detallesMovimiento[i].inventario.lote, 380, y + 10);
					var fechaV = new Date(compra.detallesMovimiento[i].inventario.fecha_vencimiento)
					doc.text(fechaV.getDate() + "/" + (fechaV.getMonth() + 1) + "/" + fechaV.getFullYear(), 420, y + 10);
				} else {
					doc.text(compra.detallesMovimiento[i].producto.codigo, 70, y + 10);
					doc.text(compra.detallesMovimiento[i].cantidad, 145, y + 10);
					doc.text(compra.detallesMovimiento[i].producto.unidad_medida, 200, y + 10, { width: 50 });
					doc.text(compra.detallesMovimiento[i].producto.nombre, 270, y + 10, { width: 200 });
				}
				doc.text(compra.detallesMovimiento[i].producto.precio_unitario, 470, y + 10);
				doc.text(compra.detallesMovimiento[i].total, 530, y + 10);

				y = y + 30;
				items++;

				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 205;
					items = 0;
					pagina = pagina + 1;
					$scope.dibujarCabeceraPDFIngresosPorInventario(doc, compra, pagina, totalPaginas);
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
		$scope.dibujarCabeceraPDFIngresosPorInventario = function (doc, compra, pagina, totalPaginas) {

			if ($scope.usuario.empresa.imagen.length > 100) { doc.image($scope.usuario.empresa.imagen, 60, 50, { width: 50, height: 50 }); }
			doc.font('Helvetica-Bold', 8);
			doc.text($scope.usuario.empresa.razon_social.toUpperCase(), 60, 105);
			doc.font('Helvetica', 7);
			doc.text(compra.almacen.sucursal.nombre.toUpperCase(), 60, 113);
			doc.text(compra.almacen.sucursal.direccion.toUpperCase(), 60, 121);
			var telefono = (compra.almacen.sucursal.telefono1 != null ? compra.almacen.sucursal.telefono1 : "") +
				(compra.almacen.sucursal.telefono2 != null ? "-" + compra.almacen.sucursal.telefono2 : "") +
				(compra.almacen.sucursal.telefono3 != null ? "-" + compra.almacen.sucursal.telefono3 : "");
			doc.text("TELF.: " + telefono, 60, 129);
			doc.text("COCHABAMBA - BOLIVIA", 60, 137);

			doc.font('Helvetica-Bold', 16);
			doc.text("NOTA DE INGRESO", 150, 50);
			doc.font('Helvetica-Bold', 8);
			//doc.text(compra.actividad.nombre,380,105,{width:200});

			doc.rect(380, 50, 190, 50).stroke();
			doc.text("NIT : ", 390, 60);
			/*doc.text("FACTURA No : ",390,70);
			doc.text("AUTORIZACIÓN No : ",390,80);*/
			doc.text($scope.usuario.empresa.nit, 500, 60);
			doc.rect(50, 150, 540, 30).stroke();
			doc.text("FECHA : ", 60, 165);
			doc.font('Helvetica-Bold', 14);
			doc.text("Inventario Inicial", 360, 165);
			doc.font('Helvetica-Bold', 8);
			doc.rect(50, 180, 540, 25).stroke();
			doc.rect(50, 205, 540, 510).stroke();
			if ($scope.usuario.empresa.usar_vencimientos) {
				doc.text("CODIGO", 60, 195);
				doc.text("CANT.", 115, 195);
				doc.text("UNID.", 150, 195);
				doc.text("DETALLE", 185, 195);
				doc.text("Lote", 380, 195);
				doc.text("Venc.", 420, 195);
			} else {
				doc.text("CODIGO", 70, 195);
				doc.text("CANT.", 140, 195);
				doc.text("UNID.", 200, 195);
				doc.text("DETALLE", 270, 195);
			}
			doc.text("P. UNIT.", 470, 195);
			doc.text("TOTAL", 530, 195);
			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.font('Helvetica', 7);
			doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 55, 740);
			doc.text("EMISIÓN : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 490, 740);
			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
		}

		$scope.compraIngresosPorInventario = function () {
			var ptom = IngPorInventario($scope.usuario.id_empresa)
			ptom.then(function (res) {
				if (res.hasErr) {
					$scope.mostrarMensaje(res.mensaje)
					$scope.ingPorInventario=[]	
				} else {
					$scope.ingPorInventario=res;
				}
			})
			// IngresosPorInventario.get({ id_empresa: $scope.usuario.id_empresa }, function (dato) {
			// 	console.log(dato)
			// 	for (var i = 0; i < dato.length; i++) {
			// 		for (var j = 0; j < dato[i].detallesMovimiento.length; j++) {
			// 			dato[i].detallesMovimiento[j].inventario.fecha_vencimiento = new Date(dato[i].detallesMovimiento[j].inventario.fecha_vencimiento);
			// 			dato[i].detallesMovimiento[j].inventario.fecha_vencimientoTexto = dato[i].detallesMovimiento[j].inventario.fecha_vencimiento.getDate() + "/" + (dato[i].detallesMovimiento[j].inventario.fecha_vencimiento.getMonth() + 1) + "/" + dato[i].detallesMovimiento[j].inventario.fecha_vencimiento.getFullYear();
			// 		}

			// 	}
			// 	console.log(dato)
			// 	$scope.ingPorInventario = dato;


			// });


		}
		$scope.excelIngPorInventario = function () {
			var data = [["Compra", "Fecha",'Sucursal', "Código", "Cantidad", "Unidad", "Detalle", "Lote", "Vencimiento", "Costo Unitario", "Total"]]			
			for (var i = 0; i < $scope.ingPorInventario.length; i++) {		
			
				for (var index = 0; index < $scope.ingPorInventario[i].detallesMovimiento.length; index++) {
					var columns = [];		
					columns.push($scope.ingPorInventario[i].id);
					columns.push($scope.ingPorInventario[i].fecha.split("T")[0].split('-').reverse().join("/"));
					columns.push($scope.ingPorInventario[i].almacen.sucursal.nombre);
					columns.push($scope.ingPorInventario[i].detallesMovimiento[index].producto.codigo);
					columns.push($scope.ingPorInventario[i].detallesMovimiento[index].cantidad);
					columns.push($scope.ingPorInventario[i].detallesMovimiento[index].producto.unidad_medida);
					columns.push($scope.ingPorInventario[i].detallesMovimiento[index].producto.nombre);
					columns.push($scope.ingPorInventario[i].detallesMovimiento[index].inventario.lote);
					columns.push($scope.ingPorInventario[i].detallesMovimiento[index].inventario.fecha_vencimientoTexto ? $scope.ingPorInventario[i].detallesMovimiento[index].inventario.fecha_vencimientoTexto : "" );
					columns.push($scope.ingPorInventario[i].detallesMovimiento[index].costo_unitario);
					columns.push($scope.ingPorInventario[i].detallesMovimiento[index].total);
					data.push(columns);
				}
			}
			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "INGRESOS POR INVENTARIO.xlsx");
		}
		$scope.cerrarPopupActualizacionInventario = function () {
			$scope.cerrarPopup($scope.idModalActualizacionInventario);
		}
		$scope.abrirPopupIngresosPorInventario = function (inventario) {
			$scope.inventario = inventario;
			$scope.abrirPopup($scope.idModalIngresosPorInventario);
		}
		$scope.cerrarPopupIngresosPorInventario = function () {
			$scope.cerrarPopup($scope.idModalIngresosPorInventario);
		}

		$scope.crearNuevoInventario = function () {
			$scope.abrirPopup($scope.idModalCreacionInventario);
		}

		$scope.buscarProducto = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ListaProductosEmpresa($scope.usuario.id_empresa, query);
				return promesa;
			}

		}

		$scope.cerrarPopupInvInicial = function () {
			$scope.cerrarPopup($scope.idModalCreacionInventario);
		}

		/*$scope.obtenerInventarios=function(){
			blockUI.start();
			var promesa=Inventarios($scope.usuario.id_empresa);
			promesa.then(function(productos){
				var mproductos=[];
				for(var i=0;i<productos.length;i++){
					var inventarios=[],cantidadTotal=0;
					for(var j=0;j<productos[i].inventarios.length;j++){
						inventarios.push({ sucursal:productos[i].inventarios[j].almacen.sucursal.nombre,
										  almacen:productos[i].inventarios[j].almacen.nombre,
										  cantidad:productos[i].inventarios[j].cantidad,
										  costo_unitario:productos[i].inventarios[j].costo_unitario,
										  costo_total:productos[i].inventarios[j].costo_total});
						cantidadTotal=cantidadTotal+productos[i].inventarios[j].cantidad;
					}
					mproductos.push({nombre:productos[i].nombre,codigo:productos[i].codigo,inventarios:inventarios,cantidad_total:cantidadTotal});
				}
				$scope.productos=mproductos;
				blockUI.stop();
			});
		}*/

		$scope.sumarCantidadAlmacen = function (inventarios, sucursal, almacen) {
			inventarios = $filter('filter')(inventarios, sucursal);
			inventarios = $filter('filter')(inventarios, almacen);
			var suma = 0;
			for (var i = 0; i < inventarios.length; i++) {
				suma = suma + inventarios[i].cantidad;
			}
			return suma;
		}

		$scope.sumarCostoTotalAlmacen = function (inventarios, sucursal, almacen) {
			inventarios = $filter('filter')(inventarios, sucursal);
			inventarios = $filter('filter')(inventarios, almacen);
			var suma = 0;
			for (var i = 0; i < inventarios.length; i++) {
				suma = suma + inventarios[i].costo_total;
			}
			return suma;
		}

		$scope.sumarCantidadSucursal = function (inventarios, sucursal) {
			inventarios = $filter('filter')(inventarios, sucursal);
			var suma = 0;
			for (var i = 0; i < inventarios.length; i++) {
				suma = suma + inventarios[i].cantidad;
			}
			return suma;
		}

		$scope.sumarCostoTotalSucursal = function (inventarios, sucursal) {
			inventarios = $filter('filter')(inventarios, sucursal);
			var suma = 0;
			for (var i = 0; i < inventarios.length; i++) {
				suma = suma + inventarios[i].costo_total;
			}
			return suma;
		}

		$scope.bajarExcelInventarios = function () {
			var promesa = ProductosUsuario($scope.usuario.id_empresa, $scope.usuario.id);
			promesa.then(function (productos) {
				var data = [["Codigo", "Nombre o Descripción", "Unidad de medida", "Costo Unitario", "Cantidad a ingresar",
					"Fecha de vencimiento (dia/mes/año)", "Lote"]]
				var totalCosto = 0;
				for (var i = 0; i < productos.length; i++) {
					var columns = [];
					columns.push(productos[i].codigo);
					columns.push(productos[i].nombre);
					columns.push(productos[i].unidad_medida);
					data.push(columns);
				}

				var ws_name = "INVENTARIO";
				var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
				/* add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "EJEMPLO-DATOS-INVENTARIOS.xlsx");
				blockUI.stop();
			});
		}

		$scope.guardarInventarioInicial = function (producto, id_almacen) {
			if (producto.fechaVencimientoTexto) {
				producto.fecha_vencimiento = new Date($scope.convertirFecha(producto.fechaVencimientoTexto));
			}
			var productos = [];
			productos.push(producto);
			var productosEmpresa = new Inventario({ productos: productos, id_empresa: $scope.usuario.id_empresa, id_almacen: $scope.id_almacen });
			var obj = { productos: productos, id_empresa: $scope.usuario.id_empresa, id_almacen: $scope.id_almacen }
			var prom = InventarioInicial(obj)
			prom.then(function (res) {
				if (res.hasErr) {
					$scope.mostrarMensaje(res.message)
				} else {
					$scope.mostrarMensaje(res.message)
					$scope.cerrarPopupInvInicial();
					$scope.recargarItemsTabla();
				}
			}).catch(function (err) {
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null && err.data !== "") ? err.data : 'Error: Se perdio la conexión.';
				$scope.mostrarMensaje(mensaje);
				blockUI.stop();
			});
			// productosEmpresa.$save(function (res) {
			// 	blockUI.stop();
			// 	$scope.cerrarPopupInvInicial();
			// 	$scope.mostrarMensaje(res.message);
			// 	$scope.recargarItemsTabla();
			// }, function (error) {
			// 	blockUI.stop();
			// 	$scope.cerrarPopupInvInicial();
			// 	$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
			// 	$scope.recargarItemsTabla();
			// });
		}

		$scope.subirExcelInventarios = function (event, id_almacen) {
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
						producto.costo_unitario = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? parseFloat(worksheet['D' + row].v.toString()) : null;
						producto.cantidad = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? parseFloat(worksheet['E' + row].v.toString()) : null;
						var fecha_vencimiento = null;
						if (worksheet['F' + row] != undefined && worksheet['F' + row] != "") {
							if (typeof worksheet['F' + row].v === 'number') {
								if (worksheet['F' + row].v % 1 === 0) {
									fecha_vencimiento = new Date((worksheet['F' + row].v - (25567 + 1)) * 86400 * 1000);
								}
							} else {
								fecha_vencimiento = new Date($scope.convertirFecha(worksheet['F' + row].v));
							}
						}
						producto.fecha_vencimiento = fecha_vencimiento;
						producto.lote = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
						productos.push(producto);
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
					$scope.guardarInventario(productos, id_almacen);
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
		}

		$scope.guardarInventario = function (productos, id_almacen) {
			var productosEmpresa = new Inventario({ productos: productos, id_empresa: $scope.usuario.id_empresa, id_almacen: $scope.id_almacen });
			productosEmpresa.$save(function (res) {
				blockUI.stop();
				$scope.mostrarMensaje(res.message);
				$scope.recargarItemsTabla();
			}, function (error) {
				blockUI.stop();
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				$scope.recargarItemsTabla();
			});
		}
		$scope.animate = false;
		$scope.editMovientoDetalle = function (detallesMovimiento) {
			detallesMovimiento.inventario.fecha_vencimiento = new Date($scope.convertirFecha(detallesMovimiento.inventario.fecha_vencimientoTexto));
			detallesMovimiento.total = detallesMovimiento.cantidad * detallesMovimiento.costo_unitario - detallesMovimiento.descuento + detallesMovimiento.recargo - detallesMovimiento.ice - detallesMovimiento.excento
			console.log(detallesMovimiento)
			ActualizarDetalleMovimiento.update({ id: detallesMovimiento.id }, detallesMovimiento, function (data) {
				$timeout(function () {
					$scope.animate = true;
					$timeout(function () {
						$scope.animate = false;
					}, 1000);
				}, 1000);

			}, function (error) {
				$scope.mostrarMensaje(error);
			});

		}
		$scope.editItem = function (item) {
			item.editing = true;
		}

		$scope.doneEditing = function (item) {
			item.editing = false;
			//dong some background ajax calling for persistence...
		};
		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			ejecutarScriptsInventario($scope.idModalActualizacionInventario, $scope.idModalCreacionInventario, $scope.idModalIngresosPorInventario);
			blockUI.stop();
		});

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalActualizacionInventario);
			$scope.eliminarPopup($scope.idModalCreacionInventario);
			$scope.eliminarPopup($scope.idModalIngresosPorInventario);
		});



		$scope.inicio();
	}]);