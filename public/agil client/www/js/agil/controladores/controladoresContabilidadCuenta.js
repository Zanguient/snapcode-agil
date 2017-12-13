angular.module('agil.controladores')
.controller('ControladorContabilidadCuenta', function ($scope, blockUI, $localStorage, 
		$location, $templateCache, $window, CuentasPaginador, ContabilidadCuenta, 
		CuentasClasificaciones, ClasesTipo, lasClasificaciones, losSaldos, losMovimientos, 
		losTiposDeCuentas, lasOperacionesCalculos, CuentaContabilidad,Paginator,CuentasEmpresaCreacion,
		ClientesNit,ProveedoresNit,$timeout,Tipos,ConfiguracionCuentaEmpresa,ListaContabilidadCuentas,ListaCuentasComprobanteContabilidad,ConfiguracionCuentas,
	CuentasClasificacionesEdicion, Diccionario,VistaColumnasAplicacion,FieldViewer,ValidarCodigoCuenta) {
	

		$scope.usuario = JSON.parse($localStorage.usuario);
		$scope.idModalWizardCuentaEdicion = "modal-wizard-cuenta-edicion"
		$scope.idModalWizardContainerCuentaEdicion = "modal-wizard-container-cuenta-edicion"
		$scope.idModalWizardCuentaVer = "modal-wizard-cuenta-ver"
		$scope.idModalWizardContainerCuentaVer = "modal-wizard-container-cuenta-ver"
		$scope.idModalWizardClasificacionNueva = "modal-wizard-agregar-clasificacion-cuenta"
		$scope.idModalWizardClasificacionVer = "modal-wizard-ver-clasificacion"
		$scope.idModalWizardContainerClasificacionNueva = "modal-wizard-container-agregar-clasificacion"
		$scope.idModalEliminarCuenta = "dialog-eliminar-cuenta"
		$scope.idModalWizardPlantillaIngreso = "modal-wizard-plantilla-ingreso";
		$scope.idModalWizardConceptoEdicion = 'modal-wizard-concepto-edicion';
		$scope.idModalWizardClasificacionEdicion = 'modal-wizard-clasificacion-edicion';

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsContabilidadCuentas($scope.idModalWizardCuentaEdicion,
				$scope.idModalWizardContainerCuentaEdicion,
				$scope.idModalWizardClasificacionNueva,
				$scope.idModalWizardContainerClasificacionNueva,
				$scope.idModalWizardClasificacionVer,
				$scope.idModalWizardCuentaVer,
				$scope.idModalWizardContainerCuentaVer,
				$scope.idModalEliminarCuenta,
				$scope.idModalWizardPlantillaIngreso,
				$scope.idModalWizardConceptoEdicion,
				$scope.idModalWizardClasificacionEdicion
			);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			$scope.obtenerColumnasAplicacion();
			blockUI.stop();
		});

		$scope.inicio = function () {
			$scope.obtenerCuentas();
			$scope.obtenerTiposCuenta();
			$scope.obtenerClasificacionCuenta();
			$scope.obtenerClasificacionSaldos();
			$scope.obtenerClasificacionMovimientos();
			$scope.obtenerOperacionesCalculo();
			$scope.sucursalesUsuario = "";
			for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
				$scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
				if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
					$scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
				}
			}
		}

		

		$scope.agregarTipoCuenta=function(){

			blockUI.start();
			var promesa = ClasesTipo("TCC");
			promesa.then(function (entidad) {
				$scope.tipo = entidad;
				blockUI.stop();
			});
			$scope.abrirPopup($scope.idModalWizardConceptoEdicion);
		}

		$scope.obtenerColumnasAplicacion=function(){
			$scope.fieldViewer=FieldViewer({
				crear:true,
				id_empresa:$scope.usuario.id_empresa,
				configuracion:{codigo:{value:"Codigo",show:true},
							   nombre:{value:"Nombre",show:true},
							   debe:{value:"Debe",show:true},
							   haber:{value:"Haber",show:true},
							   saldo:{value:"Saldo",show:true},
							   clasificacion:{value:"Clasificacion",show:true},
						       tipo_cuenta:{value:"Tipo Cuenta",show:true}}
			},$scope.aplicacion.aplicacion.id);
			$scope.fieldViewer.updateObject();
		}

		$scope.adicionarTipoCuenta = function (clase) {
			if (clase.nombre && clase.nombre_corto) {
				if (!clase.id) {
					$scope.tipo.clases.push(clase);
				}
				$scope.clase = {}
			}
		}

		$scope.adicionarClasificacionCuenta = function (clasificacion) {
			if (clasificacion.nombre && clasificacion.saldo.id && clasificacion.movimiento.id) {
				if (!clasificacion.id) {
					$scope.cuentaClasificaciones.push(clasificacion);
				}
				$scope.clasificacionEdicion = {}
			}
		}

		$scope.modificarClasificacionEdicionCuenta = function (clasificacion) {
			$scope.clasificacionEdicion = clasificacion;
		}

		$scope.guardarTipoCuenta = function (valido, tipo) {
			if (valido) {
				blockUI.start();
				Tipos.update({ id_tipo: tipo.id }, tipo, function (res) {
					blockUI.stop();
					$scope.cerrarPopPupTipoCuenta();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.obtenerTiposCuenta();
				});
			}
		}

		$scope.guardarClasificacionCuenta = function (valido, clasificaciones) {
			if (valido) {
				blockUI.start();
				CuentasClasificacionesEdicion.update({ id: 0 }, clasificaciones, function (res) {
					blockUI.stop();
					$scope.cerrarPopPupCalsificacionEdicionCuenta();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.obtenerClasificacionCuenta();
				});
			}
		}

		$scope.modificarTipoCuenta = function (clase) {
			$scope.clase = clase;
		}

		$scope.removerTipoCuenta = function (clase) {
			clase.eliminado = true;
		}

		$scope.removerClasificacionCuenta = function (clasificacion) {
			clasificacion.eliminado = true;
		}

		$scope.cerrarPopPupTipoCuenta = function () {
			$scope.cerrarPopup($scope.idModalWizardConceptoEdicion);
		}

		$scope.cerrarPopPupCalsificacionEdicionCuenta = function () {
			$scope.cerrarPopup($scope.idModalWizardClasificacionEdicion);
		}

		$scope.guardarPlantillaIngreso = function (form,plantilla) {
			if(!plantilla.ingreso.ivadf.cuenta.id){
				$scope.errorIvadf="sdf"
				form.asignarCuentaIvaDf.$error.cuenta= true;
			}else{
				$scope.errorIvadf=null
				form.asignarCuentaIvaDf.$error.cuenta= false;
			}
			if(!plantilla.ingreso.it.cuenta.id){
				$scope.errorIT="sdf"
				form.asignarCuentaIt.$error.cuenta= true;
			}else{
				$scope.errorIT=null
				form.asignarCuentaIt.$error.cuenta= false;
			}
			
			if(!plantilla.ingreso.itPorPagar.cuenta.id){
				$scope.errorItPorPagar="sdf"
				form.asignarCuentaItPorPagar.$error.cuenta= true;
			}else{
				$scope.errorItPorPagar=null
				form.asignarCuentaItPorPagar.$error.cuenta= false;
			}
			if(!plantilla.ingreso.cajaBanco.cuenta.id){
				$scope.errorIngresoCaja="sdf"
				form.asignarCuentaIngresoCaja.$error.cuenta= true;
			}else{
				$scope.errorIngresoCaja=null
				form.asignarCuentaIngresoCaja.$error.cuenta= false;
			}
			if(!plantilla.egreso.ivacf.cuenta.id){
				$scope.errorIvacf="sdf"
				form.asignarCuentaIvaCf.$error.cuenta= true;
			}else{
				$scope.errorIvacf=null
				form.asignarCuentaIvaCf.$error.cuenta= false;
			}
			if(!plantilla.egreso.cajaBanco.cuenta.id){
				$scope.errorEgresoCaja="sdf"
				form.asignarCuentaEgresoCaja.$error.cuenta= true;
			}else{
				$scope.errorEgresoCaja=null
				form.asignarCuentaEgresoCaja.$error.cuenta= false;
			}
			if($scope.errorIvacf==null&& $scope.errorEgresoCaja==null&&$scope.errorIvadf==null && $scope.errorIT==null && $scope.errorItPorPagar==null){
				ConfiguracionCuentas.update({ id_empresa: $scope.usuario.id_empresa }, plantilla, function (dato) {				
					$scope.mostrarMensaje(dato.menssage)
					$scope.cerrarPlantillaIngreso()
				})
			}

		}
		$scope.BoscarOcrearPlantillaIngreso = function () {
			$scope.plantilla = { egreso: { ivacf: {}, cajaBanco: {} }, ingreso: { ivadf: {}, it: {}, itPorPagar: {}, cajaBanco: {} } }
			var promesa = ConfiguracionCuentaEmpresa($scope.usuario.id_empresa);
			promesa.then(function (entidad) {
				console.log(entidad.lista)
				entidad.lista.forEach(function (lista) {
					if (Diccionario.IVA_DF == lista.nombre) {
						$scope.plantilla.ingreso.ivadf = { porsentaje: parseInt(lista.valor), cuenta: lista.cuenta }
					}
					if (Diccionario.IT == lista.nombre) {
						$scope.plantilla.ingreso.it = { porsentaje: parseInt(lista.valor), cuenta: lista.cuenta }
					}
					if (Diccionario.IT_POR_PAGAR == lista.nombre) {
						$scope.plantilla.ingreso.itPorPagar = { porsentaje: parseInt(lista.valor), cuenta: lista.cuenta }
					}
					if (Diccionario.CAJA_BANCOS == lista.nombre) {
						$scope.plantilla.ingreso.cajaBanco = { porsentaje: parseInt(lista.valor), cuenta: lista.cuenta }
					}
					if (Diccionario.IVA_CF == lista.nombre) {
						$scope.plantilla.egreso.ivacf = { porsentaje: parseInt(lista.valor), cuenta: lista.cuenta }
					}
					if (Diccionario.CAJA_BANCOS == lista.nombre) {
						$scope.plantilla.egreso.cajaBanco = { porsentaje: parseInt(lista.valor), cuenta: lista.cuenta }
					}
				}, this);

				blockUI.stop();
			});
		}
		$scope.buscarCuentas = function (query) {
			if (query != "" && query != undefined) {
				// console.log(query)
				var promesa = ListaCuentasComprobanteContabilidad($scope.usuario.id_empresa, query);
				console.log(promesa)
				return promesa;
			}
		}
		$scope.obtenerConfigCuentas = function () {
			var promesa = ListaContabilidadCuentas($scope.usuario.id_empresa);
			promesa.then(function (entidad) {
				$scope.ListaCuentas = entidad;
				console.log($scope.ListaCuentas)
				blockUI.stop();
			});
		}
		$scope.updateFiltro = function (filtro) {
			$scope.filtro = filtro
		}
		$scope.abrirPlantillaIngreso = function () {
			$scope.BoscarOcrearPlantillaIngreso();
			$scope.obtenerConfigCuentas()

			$scope.abrirPopup($scope.idModalWizardPlantillaIngreso);
		}
		$scope.cerrarPlantillaIngreso = function () {
			$scope.cerrarPopup($scope.idModalWizardPlantillaIngreso);
		}
		$scope.agregarClasificacionCuenta = function () {
			$scope.clasificacion = new CuentasClasificaciones({ saldo: {}, movimiento: {} })
			$scope.abrirPopup($scope.idModalWizardClasificacionNueva);
		}

		$scope.modificarClasificacionCuenta = function (clasificacion) {
			$scope.clasificacion = clasificacion
			$scope.abrirPopup($scope.idModalWizardClasificacionNueva);
		}

		$scope.guardarClasificacion = function (valido, clasificacion) {
			if (valido) {
				$scope.ocultarMensajesValidacion();
				// var tiempoActual = new Date();
				// cotizacion.fecha = new Date($scope.convertirFecha(cotizacion.fechaTexto));
				blockUI.start();
				if (clasificacion.id) {
					CuentasClasificaciones.update({ id: clasificacion.id }, clasificacion, function (res) {
						blockUI.stop();
						$scope.cerrarPopPupAgregarClasificacion();
						$scope.obtenerClasificacionCuenta();
						$scope.mostrarMensaje('Actualizado exitosamente!');
					});
				} else {
					clasificacion.$save(function (res) {
						blockUI.stop();
						$scope.mostrarMensaje('Clasificacion registrada exitosamente!', res);
						$scope.cerrarPopPupAgregarClasificacion();
						$scope.obtenerClasificacionCuenta();
					}, function (error) {
						blockUI.stop();
						$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
						$scope.obtenerClasificacionCuenta();
					});
				}
			}
		}

		$scope.mostrarConfirmacionEliminacion = function (cuenta) {
			$scope.cuenta = new ContabilidadCuenta({
				id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, tipoCuenta: {}, clasificacion: {}, eliminado: false, bimonetaria: false, aplicar_calculo: false
			});
			$scope.cuenta = cuenta
			$scope.abrirPopup($scope.idModalEliminarCuenta);
		}

		$scope.cerrarPopPupConfirmacionEliminacion = function () {
			$scope.cerrarPopup($scope.idModalEliminarCuenta);
		}

		$scope.eliminarCuenta = function (cuenta) {
			// console.log(cuenta)
			cuenta.eliminado = true
			$scope.cuenta = cuenta
			$scope.cuenta.eliminado = true
			ContabilidadCuenta.update({ id: cuenta.id, eliminado: true }, cuenta, function (res) {
				blockUI.stop();
				$scope.cerrarPopPupConfirmacionEliminacion();
				$scope.recargarItemsTabla();
				$scope.mostrarMensaje('Borrado exitosamente!');
			}, function (error) {
				blockUI.stop();
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				$scope.recargarItemsTabla();
			});

		}



		$scope.crearNuevaCuenta = function () {
			$scope.cuenta = new ContabilidadCuenta({
				id_empresa: $scope.usuario.id_empresa, id_usuario: $scope.usuario.id, tipoCuenta: {}, clasificacion: {}, eliminado: false, bimonetaria: false
			});
			var fechaActual = new Date();
			$scope.cuenta.fechaTexto = fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear();
			$scope.abrirPopup($scope.idModalWizardCuentaEdicion);
		}

		$scope.modificarCuenta = function (cuenta) {
			$scope.cuenta = cuenta
			$scope.abrirPopup($scope.idModalWizardCuentaEdicion);
		}

		$scope.modificarClasificacionesCuenta = function () {
			$scope.abrirPopup($scope.idModalWizardClasificacionEdicion);
		}

		$scope.verCuenta = function (cuenta) {
			$scope.cuenta = cuenta
			$scope.abrirPopup($scope.idModalWizardCuentaVer);
		}
		$scope.validarCodigoCuenta = function(CodigoCuenta) {
			var codigo= CodigoCuenta;
			if(codigo!=''){
				$timeout(function(){
				$scope.validar = new ValidarCodigoCuenta();
			
				$scope.validar.codigo=CodigoCuenta;
			
				$scope.validar.$save(function(data){
				$scope.data=data;
				})
			},1500);
			}		
		};
		$scope.guardarCuenta = function (valido, cuenta) {
			// console.log(cuenta)
			if (valido) {
				var button = $('#siguiente').text().trim();
				if (button != "Siguiente") {
					$scope.ocultarMensajesValidacion();
					blockUI.start();
					if (cuenta.id) {
						ContabilidadCuenta.update({ id: cuenta.id }, cuenta, function (res) {
							blockUI.stop();
							$scope.cerrarPopPupEdicion();
							$scope.recargarItemsTabla();
							$scope.mostrarMensaje('Actualizado exitosamente!');
						});
					} else {
						cuenta.$save(function (res) {
							blockUI.stop();
							$scope.mostrarMensaje('Cuenta registrada exitosamente!', res);
							$scope.cerrarPopPupEdicion();
							$scope.recargarItemsTabla();

						}, function (error) {
							blockUI.stop();
							$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
							$scope.recargarItemsTabla();
						});
					}
				}
			}
		}

		$scope.obtenerCuentas = function () {
			$scope.paginator = Paginator();
			$scope.paginator.column = "codigo";
			$scope.paginator.callBack = $scope.obtenerLista;
			$scope.filtro = { empresa: $scope.usuario.id_empresa, clasificacion: "", tipo_cuenta: "", monto: "" };
			$scope.paginator.getSearch("", $scope.filtro, null);
		}

		$scope.cerrarPopPupCuentaVer = function () {
			$scope.cerrarPopup($scope.idModalWizardCuentaVer);
		}

		$scope.cerrarPopPupEdicion = function () {
			$scope.cerrarPopup($scope.idModalWizardCuentaEdicion);
		}

		$scope.cerrarPopPupVerClasificacion = function () {
			$scope.cerrarPopup($scope.idModalWizardClasificacionVer);
		}

		$scope.cerrarPopPupAgregarClasificacion = function () {
			$scope.cerrarPopup($scope.idModalWizardClasificacionNueva);
		}

		$scope.obtenerClasificacionCuenta = function () {
			blockUI.start();
			// var promesa = ClasesTipo("SCC");
			var promesa = lasClasificaciones();
			promesa.then(function (entidad) {
				$scope.cuentaClasificaciones=[{id:0,nombre:"TODOS"}]
				$scope.cuentaClasificaciones = $scope.cuentaClasificaciones.concat(entidad.clasificaciones);
				blockUI.stop();
			});
		}

		$scope.obtenerClasificacionSaldos = function () {
			blockUI.start();
			var promesa = ClasesTipo("CONTCLSSAL");
			// console.log(promesa)
			promesa.then(function (entidad) {
				$scope.cuentaSaldos = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerClasificacionMovimientos = function () {
			blockUI.start();
			var promesa = ClasesTipo("CONTCLSMOV");
			// console.log(promesa)
			promesa.then(function (entidad) {
				$scope.cuentaMovimientos = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerTiposCuenta = function () {
			blockUI.start();
			var promesa = ClasesTipo("TCC");
			promesa.then(function (entidad) {
				$scope.cuentaTipos=[{id:0,nombre:"TODOS"}]
				$scope.cuentaTipos = $scope.cuentaTipos.concat(entidad.clases);
				blockUI.stop();
			});
		}

		$scope.obtenerOperacionesCalculo = function () {
			blockUI.start();
			var promesa = ClasesTipo("OPE");
			// var promesa = lasOperacionesCalculos();
			promesa.then(function (entidad) {
				// console.log(entidad)
				$scope.operacionesCalculo = entidad.clases;
				blockUI.stop();
			});
		}

		$scope.obtenerLista = function () {
			blockUI.start();
			var promesa = CuentaContabilidad($scope.paginator);
			promesa.then(function (dato) {
				$scope.paginator.setPages(dato.paginas);
				$scope.Cuentas = dato.cuentas;
				blockUI.stop();
			})
		}

		$scope.subirExcelCuentas = function (event) {
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
					var cuentas = [];
					do {
						var cuenta = { clasificacion: {}, tipoCuenta: {} };
						cuenta.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
						cuenta.nombre = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
						cuenta.descripcion = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
						cuenta.clasificacion.nombre = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
						cuenta.tipoCuenta.nombre = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
						cuenta.debe = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? parseInt(worksheet['F' + row].v.toString()) : null;
						cuenta.haber = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? parseInt(worksheet['G' + row].v.toString()) : null;
						cuenta.saldo = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? parseInt(worksheet['H' + row].v.toString()) : null;
						cuenta.bimonetaria = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? worksheet['I' + row].v.toString() : null;
						if (cuenta.bimonetaria != "SI") {
							cuenta.bimonetaria = 0;
						} else {
							cuenta.bimonetaria = 1;
						}
						cuentas.push(cuenta);
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
					$scope.guardarCuentas(cuentas);
					console.log(cuentas)
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
		}
		$scope.guardarCuentas = function (cuentas) {
			var cuentasEmpresa = new CuentasEmpresaCreacion({ cuentas: cuentas, id_empresa: $scope.usuario.id_empresa });
			cuentasEmpresa.$save(function (cuenta) {
				blockUI.stop();
				$scope.mostrarMensaje('Guardado Exitosamente!');
				$scope.recargarItemsTabla();
			}, function (error) {
				blockUI.stop();
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				$scope.recargarItemsTabla();
			});
		}
		//completar razon social provedor y cliente
		$scope.establecerCliente = function (cliente) {
			$scope.cuenta.cliente = cliente;

		}
		$scope.interceptarTecla = function (keyEvent, elemento, esEnfocar) {
			if (keyEvent.which === 13) {
				if (esEnfocar) {
					$scope.enfocar(elemento);
				} else {
					$timeout(function () {
						$('#' + elemento).trigger('click');
					}, 0);
				}
			}
		}
		$scope.buscarCliente = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ClientesNit($scope.usuario.id_empresa, query);
				return promesa;
			}
		};

		$scope.establecerProveedor = function (proveedor) {
			$scope.cuenta.proveedor = proveedor;
		}
		$scope.buscarProveedor = function (query) {
			if (query != "" && query != undefined) {
				var promesa = ProveedoresNit($scope.usuario.id_empresa, query);
				return promesa;
			}
		};
		//fin comprobar
		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardCuentaEdicion);
			$scope.eliminarPopup($scope.idModalWizardClasificacionNueva);
			//$scope.eliminarPopup($scope.idModalWizardClasificacionVer);
			$scope.eliminarPopup($scope.idModalWizardCuentaVer);
			$scope.eliminarPopup($scope.idModalEliminarCuenta);
			$scope.eliminarPopup($scope.idModalWizardPlantillaIngreso);
			$scope.eliminarPopup($scope.idModalWizardClasificacionEdicion);
			$scope.eliminarPopup($scope.idModalWizardConceptoEdicion);
		});
		$scope.inicio();
	});