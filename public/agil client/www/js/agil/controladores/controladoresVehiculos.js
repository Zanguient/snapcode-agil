angular.module('agil.controladores')
	.controller('ControladorVehiculos', function ($scope, blockUI, $localStorage, $location, $templateCache, $route, $timeout, Diccionario, ClasesTipo, $window, Paginator, VehiculosPaginador, FieldViewer,
		ListaMantenimientoVehiculo, ClasesTipo, ListaMantenimientoEncargado, ProductosPanel, ListaProductosEmpresa, ListaInventariosProducto, GuardarNuevaOrdendeTrabajo, ActualizarOrdendeTrabajo, DatosFechasVehiculos,
		ObtenerDatosVehiculo) {

		$scope.usuario = JSON.parse($localStorage.usuario);
		$scope.modalNuevoMantenimiento = 'dialog-iniciar-mantenimiento';
		$scope.modalReportarIncidente = 'modal-reportar-incidente';
		$scope.modalCheckListDiario = 'modal-checklist-diario';
		$scope.modalCheckListMensual = 'modal-checklist-mensual';
		$scope.modalEditarHistorico = 'dialog-editar-historico';
		$scope.modalOTEdicionCorrectivo = 'dialog-edicion-correctivo';
		$scope.modalMantenimientoCorrectivo = 'dialog-mantenimiento-correctivo';
		$scope.modalBusquedaProducto = 'dialog-busqueda-producto';
		$scope.modalBusquedaEncargado = 'dialog-busqueda-encargado';
		$scope.modalLogin = 'dialog-login';
		$scope.modalNuevoMantenimientoMaquinaria = 'dialog-iniciar-mantenimiento-maquinaria';
		$scope.modalCheckListMensualMaquinaria = 'modal-checklist-mensual-maquinaria';
		$scope.modalEditarItemList = 'dialog-editar-item-list';
		$scope.modalProxMantenimientoMaquinaria = 'dialog-prox-mantenimiento-maquinaria';
		$scope.modalProxMantenimientoVehiculo = 'dialog-prox-mantenimiento-vehiculo';
		$scope.modalCalendar = 'dialog-calendar';
		$scope.modalFichaVehiculo = 'dialog-ficha-vehiculo';
		$scope.modalEditarCheckList = 'modal-editar-checklist';
		$scope.modalBuscarMaquinaria = 'dialog-buscar-maquinaria';
		$scope.modalReportarIncidenteMaquinaria = 'modal-reportar-incidente-maquinaria';
		$scope.idModalInicioMantenimiento = 'dialog-iniciar-mantenimiento';
		$scope.idModalOTNuevo = 'dialog-ot-nuevo';
		$scope.idModalFacturaServicioExterno = 'dialog-factura-servicioExterno';
		$scope.idModaRepuestosOT = 'panel-repuestos-ot';
		$scope.idModalwizardContainerOTNuevo = 'modal-wizard-ot-nuevo-container';
		$scope.idModalEventoCalendario = 'dialog-evento-calendario'
		$scope.idModalEditarEventoCalendario = 'dialog-editar-evento-calendario'
		console.log($location.path())

		// 20
		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsVehiculos($scope.modalNuevoMantenimiento, $scope.modalReportarIncidente, $scope.modalCheckListDiario, $scope.modalCheckListMensual, $scope.modalEditarHistorico,
				$scope.modalOTEdicionCorrectivo, $scope.modalMantenimientoCorrectivo, $scope.modalBusquedaProducto, $scope.modalBusquedaEncargado, $scope.modalLogin,
				$scope.modalNuevoMantenimientoMaquinaria, $scope.modalCheckListMensualMaquinaria, $scope.modalEditarItemList, $scope.modalProxMantenimientoMaquinaria,
				$scope.modalProxMantenimientoVehiculo, $scope.modalCalendar, $scope.modalFichaVehiculo, $scope.modalEditarCheckList, $scope.modalBuscarMaquinaria, $scope.modalReportarIncidenteMaquinaria,
				$scope.idModalInicioMantenimiento, $scope.idModalOTNuevo, $scope.idModalwizardContainerOTNuevo, $scope.idModalFacturaServicioExterno, $scope.idModaRepuestosOT, $scope.idModalEventoCalendario, $scope.idModalEditarEventoCalendario);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			$scope.obtenerColumnasAplicacion()

		});

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.modalNuevoMantenimiento);
			$scope.eliminarPopup($scope.modalReportarIncidente);
			$scope.eliminarPopup($scope.modalCheckListDiario);
			$scope.eliminarPopup($scope.modalCheckListMensual);
			$scope.eliminarPopup($scope.modalEditarHistorico);
			$scope.eliminarPopup($scope.modalMantenimientoCorrectivo);
			$scope.eliminarPopup($scope.modalOTEdicionCorrectivo);
			$scope.eliminarPopup($scope.modalBusquedaProducto);
			$scope.eliminarPopup($scope.modalBusquedaEncargado);
			$scope.eliminarPopup($scope.modalLogin);
			$scope.eliminarPopup($scope.modalNuevoMantenimientoMaquinaria);
			$scope.eliminarPopup($scope.modalCheckListMensualMaquinaria);
			$scope.eliminarPopup($scope.modalEditarItemList);
			$scope.eliminarPopup($scope.modalProxMantenimientoMaquinaria);
			$scope.eliminarPopup($scope.modalProxMantenimientoVehiculo);
			$scope.eliminarPopup($scope.modalCalendar);
			$scope.eliminarPopup($scope.modalFichaVehiculo);
			$scope.eliminarPopup($scope.modalEditarCheckList);
			$scope.eliminarPopup($scope.modalBuscarMaquinaria);
			$scope.eliminarPopup($scope.modalReportarIncidenteMaquinaria);
			$scope.eliminarPopup($scope.idModalOTNuevo);
			$scope.eliminarPopup($scope.idModalEventoCalendario);
			$scope.eliminarPopup($scope.idModalEditarEventoCalendario);
			$scope.eliminarPopup($scope.idModaRepuestosOT);
			// $scope.eliminarPopup($scope.idModalInicioMantenimiento, $scope.idModalOTNuevo, $scope.idModalFacturaServicioExterno, $scope.idModaRepuestosOT);
		});

		$scope.inicio = function () {
			$scope.ObteneVehiculos()
			$scope.obtenerTiposMantenimiento()
			$scope.obtenerTiposSistemasOrdenTrabajo()
			$scope.obtenerTiposPrioridad()
			$scope.obtenerTiposEspecialidad()
			$scope.aplicarCalendario()
			$scope.sucursales = $scope.obtenerSucursales();			
		}

		$scope.abrirReportarIncidenteMaquinaria = function () {
			abrirPopup($scope.modalReportarIncidenteMaquinaria)
		}

		$scope.abrirEventoCalendario = function () {
			abrirPopup($scope.idModalEventoCalendario)
		}
		$scope.abrirEditarEventoCalendario = function () {
			abrirPopup($scope.idModalEditarEventoCalendario)
		}
		$scope.abrirBuscarMaquinaria = function () {
			abrirPopup($scope.modalBuscarMaquinaria)
		}
		$scope.abrirEditarCheckList = function () {
			abrirPopup($scope.modalEditarCheckList)
		}

		$scope.abrirFichaVehiculo = function () {
			abrirPopup($scope.modalFichaVehiculo)
		}

		$scope.abrirOTCalendar = function () {
			$scope.calendario = { id_empresa: $scope.usuario.id_empresa, correctivo: false, preventivo: false, rutina: false, entrega: false }
			abrirPopup($scope.modalCalendar)

		}

		$scope.abrirProxMantenimientoVehiculos = function () {
			abrirPopup($scope.modalProxMantenimientoVehiculo)
		}

		$scope.abrirProxMantenimientoMaquinaria = function () {
			abrirPopup($scope.modalProxMantenimientoMaquinaria)
		}

		$scope.abrirEditarItemList = function () {
			abrirPopup($scope.modalEditarItemList)
		}

		$scope.abrirCheckListMensualMaquinaria = function () {
			abrirPopup($scope.modalCheckListMensualMaquinaria)
		}

		$scope.abrirNuevoMantenimientoMaquinaria = function () {
			abrirPopup($scope.modalNuevoMantenimientoMaquinaria)
		}

		$scope.abrirModalLogin = function () {
			abrirPopup($scope.modalLogin)
		}

		$scope.abrirBusquedaEncargado = function () {
			abrirPopup($scope.modalBusquedaEncargado)
		}

		$scope.abrirBusquedaProducto = function () {
			abrirPopup($scope.modalBusquedaProducto)
		}

		$scope.abrirMantenimientoCorrectivo = function () {
			abrirPopup($scope.modalMantenimientoCorrectivo)
		}

		$scope.abrirOTEdicionCorrectivo = function (vehiculo) {
			promesa = ObtenerDatosVehiculo($scope.usuario.id_empresa, vehiculo.id)
			promesa.then(function (datos) {
				$scope.editOt = true
				$scope.vehiculo = datos.mantenimiento
				$scope.vehiculo.fecha_hora_inicio = moment(vehiculo.fecha_hora_inicio).format('MM/DD/YYYY h:mm A')
				$scope.vehiculo.fecha_hora_fin = moment(vehiculo.fecha_hora_inicio).format('MM/DD/YYYY h:mm A')
				$scope.vehiculo.fecha_hora_aviso = moment(vehiculo.fecha_hora_inicio).format('MM/DD/YYYY h:mm A')
				$scope.vehiculo.manosDeObra.forEach(function (manoDeObra) {
					manoDeObra.horas = ($scope.diferenciaEntreDiasEnDias(new Date(manoDeObra.fecha_inicio), new Date(manoDeObra.fecha_fin)) * 24)
				}, this);
				console.log($scope.vehiculo)
				abrirPopup($scope.modalOTEdicionCorrectivo)
			})
		}

		$scope.abrirEditarHistorico = function () {
			abrirPopup($scope.modalEditarHistorico)
		}

		$scope.abrirCheckListMensual = function () {
			abrirPopup($scope.modalCheckListMensual)
		}

		$scope.abrirCheckListDiario = function () {
			abrirPopup($scope.modalCheckListDiario)
		}

		$scope.abrirReportarIncidente = function () {
			abrirPopup($scope.modalReportarIncidente)
		}

		$scope.abrirNuevoMantenimiento = function () {
			abrirPopup($scope.modalNuevoMantenimiento)
		}

		$scope.abrirPopup = function (idPopup) {
			abrirPopup(idPopup);
		}

		$scope.cerrarPopup = function (idPopup) {
			ocultarPopup(idPopup);
		}
		$scope.cerrarEventoCalendario = function () {
			$scope.cerrarPopup($scope.idModalEventoCalendario)
		}
		$scope.cerrarEditarEventoCalendario = function () {
			$scope.cerrarPopup($scope.idModalEditarEventoCalendario)
		}
		$scope.cerrarReportarIncidenteMaquinaria = function () {
			$scope.cerrarPopup($scope.modalReportarIncidenteMaquinaria)
		}

		$scope.cerrarBuscarMaquinaria = function () {
			$scope.cerrarPopup($scope.modalBuscarMaquinaria)
		}
		$scope.cerrarEditarCheckList = function () {
			$scope.cerrarPopup($scope.modalEditarCheckList)
		}

		$scope.cerrarFichaVehiculo = function () {
			$scope.cerrarPopup($scope.modalFichaVehiculo)
		}

		$scope.cerrarOTCalendar = function () {
			$scope.cerrarPopup($scope.modalCalendar)
		}

		$scope.cerrarProxMantenimientoVehiculos = function () {
			$scope.cerrarPopup($scope.modalProxMantenimientoVehiculo)
		}

		$scope.cerrarProxMantenimientoMaquinaria = function () {
			$scope.cerrarPopup($scope.modalProxMantenimientoMaquinaria)
		}

		$scope.cerrarEditarItemList = function () {
			$scope.cerrarPopup($scope.modalEditarItemList)
		}

		$scope.cerrarCheckListMensualMaquinaria = function () {
			$scope.cerrarPopup($scope.modalCheckListMensualMaquinaria)
		}

		$scope.cerrarNuevoMantenimientoMaquinaria = function () {
			$scope.cerrarPopup($scope.modalNuevoMantenimientoMaquinaria)
		}

		$scope.cerrarModalLogin = function () {
			$scope.cerrarPopup($scope.modalLogin)
		}

		$scope.cerrarBusquedaEncargado = function () {
			$scope.cerrarPopup($scope.modalBusquedaEncargado)
		}

		$scope.cerrarBusquedaProducto = function () {
			$scope.cerrarPopup($scope.modalBusquedaProducto)
		}

		$scope.cerrarMantenimientoCorrectivo = function () {
			$scope.cerrarPopup($scope.modalMantenimientoCorrectivo)
		}

		$scope.cerrarOTEdicionCorrectivo = function () {
			$scope.editOt = false
			$scope.cerrarPopup($scope.modalOTEdicionCorrectivo)
		}

		$scope.cerrarEditarHistorico = function () {
			$scope.cerrarPopup($scope.modalEditarHistorico)
		}

		$scope.cerrarCheckListMensual = function () {
			$scope.cerrarPopup($scope.modalCheckListMensual)
		}

		$scope.cerrarCheckListDiario = function () {
			$scope.cerrarPopup($scope.modalCheckListDiario)
		}

		$scope.cerrarReportarIncidente = function () {
			$scope.cerrarPopup($scope.modalReportarIncidente)
		}

		$scope.cerrarNuevoMantenimiento = function () {
			$scope.cerrarPopup($scope.modalNuevoMantenimiento)
		}

		$scope.eliminarPopup = function (idPopup) {
			eliminarPopup(idPopup);
		}
		$scope.enfocar = function (elemento) {
			$timeout(function () {
				$("#" + elemento).focus();
			}, 0);
		}

		$scope.abrirDialogInicioMantenimiento = function () {
			$scope.nuevoOt = { tipo_mantenimiento: "", ordenTrabajoManoObra: [], servicioExterno: [] }
			$scope.abrirPopup($scope.idModalInicioMantenimiento);
		}
		$scope.cerrarPopUpInicioMantenimiento = function () {
			$scope.cerrarPopup($scope.idModalInicioMantenimiento);
		}
		$scope.abrirDialogOTnuevo = function (valido) {

			if (valido) {
				$scope.ordenTrabajoManoObra = { edit: false }
				console.log($scope.ordenTrabajoManoObra)
				$scope.cerrarPopUpInicioMantenimiento()

				$scope.abrirPopup($scope.idModalOTNuevo);
			}
		}
		$scope.cerrarOTnuevo = function () {
			$scope.cerrarPopup($scope.idModalOTNuevo);
		}
		$scope.abrirDialogFacturaServicioExterno = function () {
			$scope.abrirPopup($scope.idModalFacturaServicioExterno);
		}
		$scope.cerrarDialogFacturaServicioExterno = function () {
			$scope.cerrarPopup($scope.idModalFacturaServicioExterno);
		}
		$scope.abrirDialogRepuestosOT = function () {
			$scope.venta = {

				detallesVenta: []
			}
			$scope.abrirPopup($scope.idModaRepuestosOT);
		}
		$scope.cerrarDialogRepuestosOT = function () {
			$scope.cerrarPopup($scope.idModaRepuestosOT);
		}


		$scope.interceptarTecla = function (keyEvent, elemento, esEnfocar) {
			if (keyEvent.which === 13) {
				if (esEnfocar) {
					$scope.enfocar(elemento)
				} else {
					$timeout(function () {
						$('#' + elemento).trigger('click');
					}, 0);
				}
			}
		}


		//funciones PAGINADOR
		$scope.obtenerListaVehiculos = function () {
			blockUI.start();

			if ($scope.paginator.filter.inicio != 0 && $scope.paginator.filter.inicio != null) {
				var fechainico = $scope.paginator.filter.inicio;
				var fechafin = $scope.paginator.filter.fin;
				$scope.paginator.filter.inicio = new Date($scope.convertirFecha($scope.paginator.filter.inicio));
				$scope.paginator.filter.fin = new Date($scope.convertirFecha($scope.paginator.filter.fin));
			} else {
				$scope.paginator.filter.inicio = 0
				$scope.paginator.filter.fin = 0
			}
			var promise = VehiculosPaginador($scope.paginator);
			$scope.totalImporte = 0;
			promise.then(function (data) {
				$scope.paginator.setPages(data.paginas);
				$scope.vehiculos = data.vehiculos;
				//$scope.columns = Object.keys($scope.vehiculos[0]);

				$scope.filtro = {
					empresa: $scope.usuario.id_empresa, inicio: "", fin: "", tipo_activo: "",
					placa: "",
					marca: "",
					modelo: "",
					anio: "",
					tipo_mantenimiento: "",
					numero_ot: "",
					estado_ot: "",
					campamento: ""
				};
				$scope.paginator.filter.inicio = fechainico
				$scope.paginator.filter.fin = fechafin
				blockUI.stop();
			});
		}
		$scope.ObteneVehiculos = function () {
			$scope.paginator = Paginator();
			$scope.paginator.column = "diagnostico";
			$scope.paginator.callBack = $scope.obtenerListaVehiculos;
			$scope.filtro = {
				empresa: $scope.usuario.id_empresa, inicio: "", fin: "", tipo_activo: "",
				placa: "",
				marca: "",
				modelo: "",
				anio: "",
				tipo_mantenimiento: "",
				numero_ot: "",
				estado_ot: "",
				campamento: ""
			};
			if ($scope.filtro.inicio != null) {
				$scope.paginator.getSearch("", $scope.filtro);
			}
		}

		$scope.obtenerColumnasAplicacion = function () {
			$scope.fieldViewer = FieldViewer({
				crear: true,
				id_empresa: $scope.usuario.id_empresa,
				configuracion: {
					cod_usuario: { value: "Cod-Usuario", show: true },
					fecha: { value: "Fecha.", show: true },
					anio: { value: "año", show: true },
					imagen: { value: "Imagen", show: true },
					ot: { value: "OT", show: true },
					estado_OT: { value: "Estado-OT", show: true },
					Tipo_de_activo: { value: "Tipo-de-activo", show: true },
					km: { value: "Km", show: true },
					usuario: { value: "Usuario", show: true },
					marca: { value: "Marca", show: true },
					modelo: { value: "Modelo", show: true },
					mantenimiento: { value: "Manteniminto", show: true },
					campamento: { value: "Campamento", show: true }
				},
			},$scope.aplicacion.aplicacion.id);
			$scope.fieldViewer.updateObject();
		}
		//FUNCONES MODAL NUEVO OT
		$scope.establecervehiculo = function (producto) {
			$scope.nuevoOt.vehiculo = producto;
		}
		$scope.establecerEncargado = function (producto) {
			$scope.ordenTrabajoManoObra.encargado = producto;
		}
		//autocompletar
		$scope.buscarVehiculos = function (query) {

			if (query != "" && query != undefined) {
				var promesa = ListaMantenimientoVehiculo($scope.usuario.id_empresa, query);

				return promesa;
			}
		}
		$scope.buscarEncargado = function (query) {

			if (query != "" && query != undefined) {
				var promesa = ListaMantenimientoEncargado($scope.usuario.id_empresa, query);

				return promesa;
			}
		}
		$scope.buscarProducto = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ListaProductosEmpresa($scope.usuario.id_empresa, query);
				return promesa;
			}

		}
		//fin autocompletar
		//funciones modal solicitudes de respuesta e insumos
		$scope.establecerProducto = function (producto) {
			producto.tipoProducto = producto['tipoProducto'] == null ? { id: producto['tipoProducto.id'], nombre: producto['tipoProducto.nombre'], nombre_corto: producto['tipoProducto.nombre_corto'] } : producto.tipoProducto;
			$scope.editar_precio = false;
			var promesa = ListaInventariosProducto(producto.id, $scope.venta.almacen.id);
			promesa.then(function (inventarios) {
				producto.inventarios = inventarios;
				for (var i = 0; i < producto.inventarios.length; i++) {
					producto.inventarios[i].fecha_vencimiento = (producto.inventarios[i].fecha_vencimiento ? new Date(producto.inventarios[i].fecha_vencimiento) : null);
					producto.inventarios[i].fechaVencimientoTexto = (producto.inventarios[i].fecha_vencimiento ? producto.inventarios[i].fecha_vencimiento.getDate() + "/" + (producto.inventarios[i].fecha_vencimiento.getMonth() + 1) + "/" + producto.inventarios[i].fecha_vencimiento.getFullYear() : "");
					producto.inventarios[i].detallesMovimiento[0].movimiento.fecha = new Date(producto.inventarios[i].detallesMovimiento[0].movimiento.fecha);
					producto.inventarios[i].detallesMovimiento[0].movimiento.fechaTexto = producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getDate() + "/" + (producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getMonth() + 1) + "/" + producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getFullYear();
				}
				$scope.inventariosDisponibleProducto = [];
				$scope.inventariosDisponibleProducto.push({ id: 0, fecha_vencimiento: "TODOS", fechaVencimientoTexto: "TODOS" });
				$scope.inventariosDisponibleProducto = $scope.inventariosDisponibleProducto.concat(producto.inventarios);
				var inventarioDisponible = $scope.obtenerInventarioTotal(producto);
				$scope.detalleVenta = {
					producto: producto, precio_unitario: producto.precio_unitario, inventarioProducto: $scope.inventariosDisponibleProducto[0],
					inventario_disponible: inventarioDisponible, costos: producto.activar_inventario ? producto.inventarios : [],
					cantidad: 1, descuento: producto.descuento, recargo: 0, ice: 0, excento: 0, tipo_descuento: (producto.descuento > 0 ? true : false), tipo_recargo: false
				};
				$scope.colorearInventarioDisponible(inventarioDisponible, producto);
				$scope.calcularImporte();
				$scope.cerrarPopup($scope.idModalInventario);
				$scope.enfocar('cantidad');
			});
		}
		$scope.obtenerInventarioTotalPorFechaVencimiento = function (detalleVenta) {
			var cantidadTotal = detalleVenta.inventarioProducto.cantidad;
			for (var j = 0; j < $scope.venta.detallesVenta.length; j++) {
				if ($scope.venta.detallesVenta[j].producto.id == detalleVenta.producto.id && $scope.venta.detallesVenta[j].costos[0].id == detalleVenta.inventarioProducto.id) {
					cantidadTotal = cantidadTotal - $scope.venta.detallesVenta[j].cantidad;
				}
			}
			return cantidadTotal;
		}
		$scope.sumarTotal = function () {
			var sumaTotal = 0;
			for (var i = 0; i < $scope.venta.detallesVenta.length; i++) {
				sumaTotal = sumaTotal + $scope.venta.detallesVenta[i].total;
			}
			$scope.venta.total = Math.round((sumaTotal) * 1000) / 1000;
		}
		$scope.calcularSaldo = function () {
			$scope.venta.saldo = $scope.venta.total - $scope.venta.a_cuenta;
		}
		$scope.calcularCambio = function () {
			if ($scope.esContado) {
				$scope.venta.cambio = Math.round(($scope.venta.pagado - $scope.venta.total) * 100) / 100;
				$scope.pagoMinimo = $scope.venta.total;
			} else {
				$scope.venta.cambio = 0;
				$scope.pagoMinimo = 0;
			}
		}

		$scope.GuardarDetalleMateriales = function (detalle) {
			if (!$scope.editOt) {
				$scope.nuevoOt.materiales = detalle

				$scope.nuevoOt.totalMaterial = $scope.venta.total;
				$scope.cerrarDialogRepuestosOT()
			} else {
				detalle.forEach(function (element) {
					$scope.vehiculo.materiales.push(element)

				}, this);

				//vehiculo.materiales.totalMaterial = $scope.venta.total;
				$scope.cerrarDialogRepuestosOT()
			}
		}
		$scope.eliminarDetalleVenta = function (detalleVenta) {
			$scope.venta.detallesVenta.splice($scope.venta.detallesVenta.indexOf(detalleVenta), 1);
			$scope.sumarTotal();
			$scope.sumarTotalImporte();
			$scope.calcularSaldo();
			$scope.calcularCambio();

		}
		$scope.sumarTotalImporte = function () {
			var sumaImporte = 0;
			for (var i = 0; i < $scope.venta.detallesVenta.length; i++) {
				sumaImporte = sumaImporte + $scope.venta.detallesVenta[i].importe;
			}
			$scope.venta.importe = Math.round((sumaImporte) * 1000) / 1000;
		}

		$scope.agregarDetalleVenta = function (detalleVenta) {
			if (detalleVenta.producto.activar_inventario) {
				if (detalleVenta.costos.length > 1) {
					var cantidadTotal = detalleVenta.cantidad, i = 0, detalleVentaOriginal = JSON.parse(JSON.stringify(detalleVenta));
					while (i < detalleVenta.costos.length && cantidadTotal > 0) {
						detalleVenta.inventarioProducto = detalleVenta.costos[i];
						var cantidadDisponible = $scope.obtenerInventarioTotalPorFechaVencimiento(detalleVenta);
						if (cantidadDisponible > 0) {
							var nuevoDetalleVenta = JSON.parse(JSON.stringify(detalleVentaOriginal));
							var cantidadParcial;
							if (i > 0) {
								nuevoDetalleVenta.descuento = 0;
								nuevoDetalleVenta.recargo = 0;
								nuevoDetalleVenta.ice = 0;
								nuevoDetalleVenta.excento = 0;
							}
							$scope.detalleVenta = nuevoDetalleVenta;
							if (cantidadTotal > cantidadDisponible) {
								cantidadParcial = cantidadDisponible;
								cantidadTotal = cantidadTotal - cantidadDisponible
							} else {
								cantidadParcial = cantidadTotal;
								cantidadTotal = 0;
							}
							nuevoDetalleVenta.cantidad = cantidadParcial;
							nuevoDetalleVenta.fecha_vencimiento = detalleVenta.costos[i].fecha_vencimiento;
							nuevoDetalleVenta.lote = detalleVenta.costos[i].lote;
							nuevoDetalleVenta.costos = [];
							nuevoDetalleVenta.costos.push(detalleVenta.costos[i]);
							nuevoDetalleVenta.inventario = detalleVenta.costos[i];
							$scope.calcularImporte();
							$scope.venta.detallesVenta.push(nuevoDetalleVenta);
						}
						i++;
					}
				} else {
					detalleVenta.fecha_vencimiento = detalleVenta.costos[0].fecha_vencimiento;
					detalleVenta.lote = detalleVenta.costos[0].lote;
					detalleVenta.inventario = detalleVenta.costos[0];
					$scope.venta.detallesVenta.push(detalleVenta);
				}
			} else {
				$scope.venta.detallesVenta.push(detalleVenta);
			}
			$scope.inventariosDisponibleProducto = [];
			$scope.sumarTotal();
			$scope.sumarTotalImporte();
			$scope.calcularSaldo();
			$scope.calcularCambio();
			$scope.detalleVenta = { producto: { activar_inventario: true }, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
			$scope.enfocar('id_producto');
		}
		$scope.calcularImporte = function () {
			$scope.detalleVenta.importe = Math.round(($scope.detalleVenta.cantidad * $scope.detalleVenta.precio_unitario) * 1000) / 1000;
			var descuento, recargo;
			if ($scope.detalleVenta.tipo_descuento) {
				descuento = $scope.detalleVenta.importe * ($scope.detalleVenta.descuento / 100);
			} else {
				descuento = $scope.detalleVenta.descuento;
			}
			if ($scope.detalleVenta.tipo_recargo) {
				recargo = $scope.detalleVenta.importe * ($scope.detalleVenta.recargo / 100);
			} else {
				recargo = $scope.detalleVenta.recargo;
			}
			$scope.detalleVenta.total = Math.round(($scope.detalleVenta.importe - descuento + recargo - $scope.detalleVenta.ice - $scope.detalleVenta.excento) * 1000) / 1000;
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
		$scope.obtenerInventarioTotal = function (producto) {
			var cantidadTotal = 0;
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					cantidadTotal += (producto.inventarios[i].cantidad);
				}
				for (var j = 0; j < $scope.venta.detallesVenta.length; j++) {
					if ($scope.venta.detallesVenta[j].producto.id == producto.id) {
						cantidadTotal = cantidadTotal - $scope.venta.detallesVenta[j].cantidad;
					}
				}
			} else {
				cantidadTotal = 500000;
			}
			return cantidadTotal;
		}
		//fin funciones modal solicitudes de respuesta e insumos

		//OPTENER TIPOS
		$scope.obtenerTiposMantenimiento = function () {
			blockUI.start();
			var promesa = ClasesTipo("MTM");
			promesa.then(function (entidad) {
				$scope.tiposMantenimiento = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerTiposSistemasOrdenTrabajo = function () {
			blockUI.start();
			var promesa = ClasesTipo("SOT");
			promesa.then(function (entidad) {
				$scope.tiposSistemas = entidad.clases;
				blockUI.stop();
			});
		}
		$scope.obtenerTiposPrioridad = function () {
			blockUI.start();
			var promesa = ClasesTipo("TPM");
			promesa.then(function (entidad) {
				$scope.tiposPrioridad = entidad.clases;
				blockUI.stop();
			});
		}
		$scope.obtenerTiposEspecialidad = function () {
			blockUI.start();
			var promesa = ClasesTipo("TEM");
			promesa.then(function (entidad) {
				$scope.tiposEspecialidad = entidad.clases;
				blockUI.stop();
			});
		}


		//FIN TIPOS
		$scope.obtenerSucursales = function () {
			var sucursales = [];
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			}
			return sucursales;
		}
		$scope.obtenerAlmacenesActividades = function (idSucursal) {
			$scope.obtenerAlmacenes(idSucursal);
			$scope.obtenerActividades(idSucursal);
		}

		$scope.obtenerAlmacenes = function (idSucursal) {
			$scope.almacenes = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
			$scope.almacenes = sucursal.almacenes;
			$scope.venta.almacen = $scope.almacenes.length == 1 ? $scope.almacenes[0] : null;
			if ($scope.venta.almacen) {
				$scope.cargarProductos();
			}
		}

		$scope.obtenerActividades = function (idSucursal) {
			$scope.actividades = [];
			var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
			$scope.actividadesDosificaciones = sucursal.actividadesDosificaciones;
			$scope.actividades = [];
			for (var i = 0; i < $scope.actividadesDosificaciones.length; i++) {
				$scope.actividades.push($scope.actividadesDosificaciones[i].actividad);
			}
			$scope.venta.actividad = $scope.actividades.length == 1 ? $scope.actividades[0] : null;
		}
		$scope.cargarProductos = function () {
			var promesa = ProductosPanel($scope.usuario.id_empresa, $scope.venta.almacen.id);
			promesa.then(function (productos) {
				for (var i = 0; i < productos.length; i++) {
					if (productos[i].activar_inventario) {
						productos[i].inventario_disponible = $scope.obtenerInventarioTotal(productos[i]);
					}
				}
				$scope.productos = productos;

				// ======= save localstorage ====
				if (angular.isDefined($localStorage.productosProcesados)) {

					// ===== conbinar array productos con storage ====
					$scope.productosProcesados = productos;

					for (var i = 0; i < $localStorage.productosProcesados.length; i++) {
						for (var j = 0; j < $scope.productosProcesados.length; j++) {
							if ($localStorage.productosProcesados[i].id == $scope.productosProcesados[j].id) {
								$scope.productosProcesados[j].rankin = $localStorage.productosProcesados[i].rankin;
							}
						}
					}



				} else {
					$scope.productosProcesados = productos;
				}
				// ===== Fin save localstorage ====

				setTimeout(function () {
					aplicarSwiper(4, 3, true, 2);
				}, 1000);
			});
		}
		$scope.obtenerInventarioTotal = function (producto) {
			var cantidadTotal = 0;
			if (producto.activar_inventario) {
				for (var i = 0; i < producto.inventarios.length; i++) {
					cantidadTotal += (producto.inventarios[i].cantidad);
				}
				for (var j = 0; j < $scope.venta.detallesVenta.length; j++) {
					if ($scope.venta.detallesVenta[j].producto.id == producto.id) {
						cantidadTotal = cantidadTotal - $scope.venta.detallesVenta[j].cantidad;
					}
				}
			} else {
				cantidadTotal = 500000;
			}
			return cantidadTotal;
		}
		$scope.diferenciaEntreDiasEnDias = function (a, b) {
			var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
			var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

			return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
		}
		$scope.agregarManoDeObra = function (manoDeObra) {
			manoDeObra.horas = ($scope.diferenciaEntreDiasEnDias(new Date(manoDeObra.fecha_inicio), new Date(manoDeObra.fecha_fin)) * 24)
			manoDeObra.eliminado = false
			$scope.nuevoOt.ordenTrabajoManoObra.push(manoDeObra)
			$scope.ordenTrabajoManoObra = { edit: false }
		}
		$scope.agregarManoDeObraVehiculo = function (manoDeObra) {
			manoDeObra.horas = ($scope.diferenciaEntreDiasEnDias(new Date(manoDeObra.fecha_inicio), new Date(manoDeObra.fecha_fin)) * 24)
			manoDeObra.eliminado = false
			$scope.vehiculo.manosDeObra.push(manoDeObra)
			$scope.ordenTrabajoManoObra = { edit: false }
		}
		$scope.agregarServicioExterno = function (servicioExterno) {
			servicioExterno.eliminado = false
			$scope.nuevoOt.servicioExterno.push(servicioExterno)
			$scope.servicioExterno = {}
		}
		$scope.agregarServicioExternoVehiculo = function (servicioExterno) {
			servicioExterno.eliminado = false
			$scope.vehiculo.serviciosExternos.push(servicioExterno)
			$scope.servicioExterno = {}
		}
		$scope.eliminarProductoVehiculo = function (dato) {
			$scope.vehiculo.materiales.splice($scope.vehiculo.materiales.indexOf(dato), 1);
		}
		$scope.eliminarManoDeObra = function (dato) {
			$scope.nuevoOt.ordenTrabajoManoObra.splice($scope.nuevoOt.ordenTrabajoManoObra.indexOf(dato), 1);
		}
		$scope.eliminarManoDeObraVehiculo = function (dato) {
			$scope.vehiculo.manosDeObra.splice($scope.vehiculo.manosDeObra.indexOf(dato), 1);
		}
		$scope.eliminarServicioExterno = function (dato) {
			$scope.nuevoOt.servicioExterno.splice($scope.nuevoOt.ordenTrabajoManoObra.indexOf(dato), 1);
		}
		$scope.eliminarServicioExternoVehiculo = function (dato) {
			$scope.vehiculo.serviciosExternos.splice($scope.vehiculo.serviciosExternos.indexOf(dato), 1);
		}
		$scope.saveFormNuevoOt = function () {

			var button = $('#siguiente').text().trim();
			console.log($scope.paciente)
			if (button != "Siguiente") {
				promesa = GuardarNuevaOrdendeTrabajo($scope.nuevoOt)
				promesa.then(function (dato) {
					$scope.cerrarOTnuevo();
					$scope.mostrarMensaje(dato.message)
					$scope.recargarItemsTabla();
				})

			}
		}
		$scope.GuardarOtActializado = function () {
			promesa = ActualizarOrdendeTrabajo($scope.vehiculo)
			promesa.then(function (dato) {
				$scope.cerrarOTEdicionCorrectivo();

				$scope.mostrarMensaje(dato.message)
				$scope.recargarItemsTabla()

			})

		}






		$scope.editarManoObra = function (dato, index) {
			$scope.ordenTrabajoManoObra = dato
			$scope.ordenTrabajoManoObra.especialidad = dato.especialidad
			$scope.ordenTrabajoManoObra.fecha_inicio = moment(dato.fecha_inicio).format('MM/DD/YYYY h:mm A')
			$scope.ordenTrabajoManoObra.fecha_fin = moment(dato.fecha_fin).format('MM/DD/YYYY h:mm A')
			$scope.ordenTrabajoManoObra.edit = true
			$scope.ordenTrabajoManoObra.index = index
			console.log($scope.ordenTrabajoManoObra)
		}
		$scope.guardarManoObraEditada = function (dato) {
			$scope.nuevoOt.ordenTrabajoManoObra[dato.index] = dato
			$scope.ordenTrabajoManoObra = { edit: false }
		}
		$scope.guardarManoObraEditadaVehiculo = function (dato) {
			$scope.vehiculo.manosDeObra[dato.index] = dato
			$scope.vehiculo.manosDeObra[dato.index].horas = ($scope.diferenciaEntreDiasEnDias(new Date($scope.vehiculo.manosDeObra[dato.index].fecha_inicio), new Date($scope.vehiculo.manosDeObra[dato.index].fecha_fin)) * 24)
			$scope.ordenTrabajoManoObra = { edit: false }
		}
		$scope.editarServicioExterno = function (dato, index) {
			$scope.servicioExterno = dato
			$scope.servicioExterno.fecha_inicio = moment($scope.servicioExterno.fecha_inicio).format('MM/DD/YYYY h:mm A')
			$scope.servicioExterno.fecha_fin = moment($scope.servicioExterno.fecha_fin).format('MM/DD/YYYY h:mm A')
			$scope.servicioExterno.edit = true
			$scope.servicioExterno.index = index
			//console.log($scope.ordenTrabajoManoObra)
		}
		$scope.guardarServicioExternoEditado = function (dato) {
			$scope.nuevoOt.servicioExterno[dato.index] = dato
			$scope.servicioExterno = { edit: false }
		}
		//FIN FUNCIONES MODAL NUEVO OT
		$scope.obtenerFechasCalendario = function () {

			promesa = DatosFechasVehiculos($scope.calendario)
			promesa.then(function (dato) {
				$scope.FechasCalendario = dato;
				console.log(dato)

			})
		}
		$scope.obtenerFechasCalendarioS = function (CAL) {
			$('#calendar').fullCalendar('removeEvents');

			promesa = DatosFechasVehiculos(CAL)
			promesa.then(function (dato) {
				$scope.FechasCalendario = dato;
				console.log(dato)
				var datos = []

				dato.forEach(function (element, index, array) {
					var a = { id: element.id, title: element.observacion, start: element.fecha_hora_inicio, end: element.fecha_hora_fin }
					datos.push(a)
					if (index === (array.length - 1)) {
						$scope.cal(datos);
					}
				}, this);
			})
		}
		$scope.EditEventoCalendario = function () {
			console.log($scope.evento)
			$scope.calendar.fullCalendar('updateEvent', $scope.evento);
			$scope.cerrarEditarEventoCalendario()
		}
		$scope.DeleteEventoCalendario = function () {

			$scope.calendar.fullCalendar('removeEvents', function (ev) {
				return (ev._id == $scope.evento._id);
			})
			$scope.cerrarEditarEventoCalendario()
		}
		//calendario
		$scope.cal = function (datos) {

			$scope.calendar.fullCalendar('addEventSource', datos)
		}
		$scope.GuardarEventoCalendario = function (valid) {
			if (valid) {

				$scope.calendar.fullCalendar('renderEvent', $scope.evento,
					true // make the event "stick"					
				);
				$scope.evento = { title: null, start: null, end: null, allDay: null, className: 'label-info' }
				$scope.cerrarEventoCalendario()

			}
		}

		$scope.aplicarCalendario = function () {
			var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();
			$scope.calendar = $('#calendar').fullCalendar({
				//isRTL: true,
				//firstDay: 1,// >> change first day of week 

				buttonHtml: {
					prev: '<i class="ace-icon fa fa-chevron-left"></i>',
					next: '<i class="ace-icon fa fa-chevron-right"></i>'
				},

				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},

				events: [],

				editable: true,
				droppable: true, // this allows things to be dropped onto the calendar !!!
				drop: function (date) { // this function is called when something is dropped

					// retrieve the dropped element's stored Event Object
					var originalEventObject = $(this).data('eventObject');
					var $extraEventClass = $(this).attr('data-class');


					// we need to copy it, so that multiple events don't have a reference to the same object
					var copiedEventObject = $.extend({}, originalEventObject);

					// assign it the date that was reported
					copiedEventObject.start = date;
					copiedEventObject.allDay = false;
					if ($extraEventClass) copiedEventObject['className'] = [$extraEventClass];

					// render the event on the calendar
					// the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
					$scope.calendar.fullCalendar('renderEvent', copiedEventObject, true);

					// is the "remove after drop" checkbox checked?
					if ($('#drop-remove').is(':checked')) {
						// if so, remove the element from the "Draggable Events" list
						$(this).remove();
					}

				},
				selectable: true,
				selectHelper: true,
				select: function (start, end, allDay) {

					$scope.evento = { title: "", start: start, end: end, allDay: allDay, className: 'label-info' }
					$scope.abrirEventoCalendario()
					$scope.calendar.fullCalendar('unselect');
				},
				eventClick: function (calEvent, jsEvent, view) {
					$scope.evento = calEvent
					$scope.abrirEditarEventoCalendario()
					
				}
			});
		}
		$scope.inicio();
	})