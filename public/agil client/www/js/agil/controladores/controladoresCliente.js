angular.module('agil.controladores')

	.controller('ControladorClientes',['$scope', '$window', '$localStorage', '$location', '$templateCache', '$route', 'blockUI', '$timeout',
		'ClientesPaginador', 'Cliente', 'Clientes', 'Empresas', 'ClientesEmpresa', 'uiGmapGoogleMapApi', '$cordovaGeolocation',
		'DatoCodigoSiguienteClienteEmpresa', 'DestinosCliente', 'RazonesSocialesCliente', 'ClasesTipoEmpresa', 'Diccionario', 'Tipos', 'ClasesTipo',
		'VerificarUsuarioEmpresa', function ($scope, $window, $localStorage, $location, $templateCache, $route, blockUI, $timeout,
		ClientesPaginador, Cliente, Clientes, Empresas, ClientesEmpresa, uiGmapGoogleMapApi, $cordovaGeolocation,
		DatoCodigoSiguienteClienteEmpresa, DestinosCliente, RazonesSocialesCliente, ClasesTipoEmpresa, Diccionario, Tipos, ClasesTipo,
		VerificarUsuarioEmpresa) {
		blockUI.start();

		$scope.usuario = JSON.parse($localStorage.usuario);
		$scope.idModalConceptoEdicionCorrelativos = 'dialog-conceptos-correlativos';
		$scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';
		$scope.inicio = function () {
			$scope.diccionario = Diccionario
			$scope.obtenerEmpresas();
			$scope.obtenerClientes();
			$scope.obtenerDestinos();
			$scope.obtenerTiposPrecio()
			/*setTimeout(function() {
				ejecutarScriptsTabla('tabla-clientes',10);
			},2000);*/
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
			ejecutarScriptsCliente('modal-wizard-cliente', 'modal-wizard-cliente-vista', 'dialog-eliminar-cliente', 'modal-wizard-container-cliente-edicion', 'modal-wizard-container-cliente-vista', $scope.idModalConceptoEdicionCorrelativos, $scope.IdModalVerificarCuenta);
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});
		$scope.obtenerCorrelativoCliente = function () {
			blockUI.start();
			var promesa = ClasesTipoEmpresa("correlativo_clientes", $scope.usuario.id_empresa);
			promesa.then(function (entidad) {
				if (entidad.clases.length > 1) {
					entidad.clases.sort(function (a, b) {
						a.correlativo = a.nombre_corto.split('-')[0]
						a.correlativo_maximo = a.nombre_corto.split('-')[1]
						b.correlativo = b.nombre_corto.split('-')[0]
						b.correlativo_maximo = b.nombre_corto.split('-')[1]
						return a.correlativo - b.correlativo
					})
				} else if (entidad.clases.length == 1) {
					entidad.clases[0].correlativo = entidad.clases[0].nombre_corto.split('-')[0]
					entidad.clases[0].correlativo_maximo = entidad.clases[0].nombre_corto.split('-')[1]
				}

				$scope.correlativosClientes = entidad

				blockUI.stop();
			});
		}
		$scope.cargarCodigo = function (cliente) {
			cliente.codigo = cliente.correlativo.correlativo
		}
		$scope.obtenerClientes = function () {
			$scope.abs = $window.Math.abs;
			$scope.itemsPorPagina = 10;
			$scope.buscarClientes(1, $scope.itemsPorPagina, "");
		}

		$scope.verificarPulso = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				$scope.buscarClientes(1, $scope.itemsPorPagina, textoBusqueda);
			}
		}
		$scope.buscarClientes = function (pagina, itemsPagina, texto) {
			blockUI.start();
			$scope.itemsPorPagina = itemsPagina;
			if (texto == "" || texto == null) {
				texto = 0;
			} else {
				$scope.textoBusqueda = texto;
			}
			$scope.paginaActual = pagina;
			var promesa = ClientesPaginador($scope.usuario.id_empresa, pagina, itemsPagina, texto);
			promesa.then(function (dato) {
				$scope.paginas = [];
				for (var i = 1; i <= dato.paginas; i++) {
					$scope.paginas.push(i);
				}
				$scope.clientes = dato.clientes;
				blockUI.stop();
			});
		}

		$scope.abrirPopupCliente = function (cliente) {
			$scope.mostrarMap = false;
			$scope.cliente = cliente;
			$scope.map = {
				center: { latitude: $scope.cliente.latitud, longitude: $scope.cliente.longitud }, zoom: 17, bounds: {
					northeast: {
						latitude: $scope.cliente.latitud,
						longitude: $scope.cliente.longitud
					}
				}
			};
			$scope.options = { scrollwheel: false, mapTypeId: google.maps.MapTypeId.SATELLITE };
			$scope.coordsUpdates = 0;
			$scope.dynamicMoveCtr = 0;
			$scope.marker = {
				id: 0,
				coords: {
					latitude: $scope.cliente.latitud,
					longitude: $scope.cliente.longitud
				},
				options: { draggable: true },
				events: {
					dragend: function (marker, eventName, args) {
						$scope.cliente.latitud = marker.getPosition().lat();
						$scope.cliente.longitud = marker.getPosition().lng();
						$scope.marker.options = {
							draggable: true,
							labelAnchor: "100 0",
							labelClass: "marker-labels"
						};
					}
				}
			}
			$scope.abrirPopup('modal-wizard-cliente');
		}

		$scope.mostrarMapa = function () {
			$scope.mostrarMap = true;
			$timeout(function () {
				$scope.$apply(function () {
					google.maps.event.trigger($scope.map, 'resize');
				});
			}, 2000);
		}

		$scope.crearNuevoCliente = function () {
			$scope.obtenerCorrelativoCliente()
			$scope.steps = [{ cabeza: "cabeza-datos-cli", cuerpo: "cuerpo-datos-cli" },
			{ cabeza: "cabeza-datos-adicionales", cuerpo: "cuerpo-datos-adicionales" }]
			console.log($scope.steps)
			var promesa = DatoCodigoSiguienteClienteEmpresa($scope.usuario.id_empresa);
			promesa.then(function (dato) {
				$scope.ultimo_codigo = dato.ultimo_codigo ? "CLI" + dato.ultimo_codigo : 0;
				var usuario = JSON.parse($localStorage.usuario);
				var cliente = new Cliente({ id_empresa: usuario.id_empresa, latitud: -17.403800007775388, longitud: -66.11349012184144, clientes_razon: [], cliente_destinos: [] });
				cliente.codigo = "CLI" + ((dato.ultimo_codigo ? dato.ultimo_codigo : 0) + 1);
				$scope.abrirPopupCliente(cliente);
				/*var posOptions = {timeout: 10000, enableHighAccuracy: false};
				  $cordovaGeolocation
					.getCurrentPosition(posOptions)
					.then(function (position) {
						$timeout(function(){
							$scope.$apply(function(){
								$scope.cliente=new Cliente({id_empresa:usuario.id_empresa,latitud:position.coords.latitude,longitud:position.coords.longitude});
								$scope.abrirPopup('modal-wizard-cliente');
							});
						});
						
					}, function(err) {
					  // error
					});*/
			});
		}

		$scope.verCliente = function (cliente) {
			$scope.cliente = cliente;
			cliente.fecha1 = new Date(cliente.fecha1);
			cliente.fecha2 = new Date(cliente.fecha2);
			$scope.cliente.fechatexto1 = cliente.fecha1.getDate() + "/" + (cliente.fecha1.getMonth() + 1) + "/" + cliente.fecha1.getFullYear();
			$scope.cliente.fechatexto2 = cliente.fecha2.getDate() + "/" + (cliente.fecha2.getMonth() + 1) + "/" + cliente.fecha2.getFullYear();
			$scope.abrirPopup('modal-wizard-cliente-vista');
		}

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup('modal-wizard-cliente-vista');
		}

		$scope.cerrarPopPupNuevoCliente = function () {
			$scope.cerrarPopup('modal-wizard-cliente');
		}

		$scope.modificarCliente = function (cliente) {
			if (cliente.fecha1) {
				cliente.fecha1 = new Date(cliente.fecha1);
				cliente.fechatexto1 = cliente.fecha1.getDate() + "/" + (cliente.fecha1.getMonth() + 1) + "/" + cliente.fecha1.getFullYear();
			}
			if (cliente.fecha2) {
				cliente.fecha2 = new Date(cliente.fecha2);
				cliente.fechatexto2 = cliente.fecha2.getDate() + "/" + (cliente.fecha2.getMonth() + 1) + "/" + cliente.fecha2.getFullYear();
			}
			$scope.abrirPopupCliente(cliente);
		}

		$scope.verCliente = function (cliente) {
			$scope.cliente = cliente;
			cliente.fecha1 = new Date(cliente.fecha1);
			cliente.fecha2 = new Date(cliente.fecha2);
			$scope.cliente.fechatexto1 = cliente.fecha1.getDate() + "/" + (cliente.fecha1.getMonth() + 1) + "/" + cliente.fecha1.getFullYear();
			$scope.cliente.fechatexto2 = cliente.fecha2.getDate() + "/" + (cliente.fecha2.getMonth() + 1) + "/" + cliente.fecha2.getFullYear();
			$scope.abrirPopup('modal-wizard-cliente-vista');
		}

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup('modal-wizard-cliente-vista');
		}


		$scope.cerrarPopPupNuevoCliente = function () {
			$scope.cerrarPopup('modal-wizard-cliente');
		}

		$scope.modificarCliente = function (cliente) {
			if (cliente.fecha1) {
				cliente.fecha1 = new Date(cliente.fecha1);
				cliente.fechatexto1 = cliente.fecha1.getDate() + "/" + (cliente.fecha1.getMonth() + 1) + "/" + cliente.fecha1.getFullYear();
			}
			if (cliente.fecha2) {
				cliente.fecha2 = new Date(cliente.fecha2);
				cliente.fechatexto2 = cliente.fecha2.getDate() + "/" + (cliente.fecha2.getMonth() + 1) + "/" + cliente.fecha2.getFullYear();
			}
			$scope.abrirPopupCliente(cliente);
		}

		$scope.mostrarConfirmacionEliminacion = function (cliente) {
			$scope.cliente = new Cliente(cliente);
			$scope.abrirPopup("dialog-eliminar-cliente");
		}

		$scope.cerrarConfirmacionEliminacion = function () {
			$scope.cerrarPopup('dialog-eliminar-cliente');
		};

		$scope.eliminarCliente = function (cliente) {
			blockUI.start();
			$scope.cerrarConfirmacionEliminacion();
			cliente.$delete();
			$scope.mostrarMensaje('Eliminado exitosamente!');
			$scope.recargarItemsTabla();
			blockUI.stop();
		}

		$scope.saveForm = function (cliente, form) {


			var button = $('#siguiente').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				var f = document.getElementById('doc-nit').files[0]
				var f1 = document.getElementById('doc-funda').files[0]
				var f2 = document.getElementById('doc-licencia').files[0]
				var f3 = document.getElementById('doc-ci').files[0]
				var f4 = document.getElementById('doc-seguro-social').files[0]
				var documentos = [f, f1, f2, f3, f4]
				var documentosFinal = []
				documentos.forEach(function (documento2, index, array) {
					if (documento2) {
						documentosFinal.push(documento2)
					}
					if (index == array.length - 1) {
						if (documentosFinal.length > 0) {
							documentosFinal.forEach(function (documento, index, array) {
								r = new FileReader();
								if (documento) {
									r.onloadend = function (e) {
										documento.nombre = documento.name
										documento.data = e.target.result

										//send your binary data via $http or $resource or do anything else with it
										if (index === array.length - 1) {
											cliente.fecha1 = null;
											if (cliente.fechatexto1) {
												cliente.fecha1 = new Date($scope.convertirFecha(cliente.fechatexto1));
											}
											cliente.fecha2 = null;
											if (cliente.fechatexto2) {
												cliente.fecha2 = new Date($scope.convertirFecha(cliente.fechatexto2));
											}
											if (cliente.id) {
												Cliente.update({ idCliente: cliente.id }, cliente, function (res) {
													blockUI.stop();
													$scope.cerrarPopPupNuevoCliente();
													$scope.mostrarMensaje(res.mensaje);
													$scope.recargarItemsTabla();
												});
											} else {
												cliente.$save(function (res) {
													blockUI.stop();
													$scope.cliente = new Cliente({});
													$scope.cerrarPopPupNuevoCliente();
													$scope.mostrarMensaje(res.mensaje);
													$scope.recargarItemsTabla();
												}, function (error) {
													blockUI.stop();
													$scope.cerrarPopPupNuevoCliente();
													$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
													$scope.recargarItemsTabla();
												});
											}
										}
									}
									r.readAsBinaryString(documento);

								} else {
									if (index === array.length - 1) {
										cliente.fecha1 = null;
										if (cliente.fechatexto1) {
											cliente.fecha1 = new Date($scope.convertirFecha(cliente.fechatexto1));
										}
										cliente.fecha2 = null;
										if (cliente.fechatexto2) {
											cliente.fecha2 = new Date($scope.convertirFecha(cliente.fechatexto2));
										}
										if (cliente.id) {
											Cliente.update({ idCliente: cliente.id }, cliente, function (res) {
												blockUI.stop();
												$scope.cerrarPopPupNuevoCliente();
												$scope.mostrarMensaje(res.mensaje);
												$scope.recargarItemsTabla();
											});
										} else {
											cliente.$save(function (res) {
												blockUI.stop();
												$scope.cliente = new Cliente({});
												$scope.cerrarPopPupNuevoCliente();
												$scope.mostrarMensaje(res.mensaje);
												$scope.recargarItemsTabla();
											}, function (error) {
												blockUI.stop();
												$scope.cerrarPopPupNuevoCliente();
												$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
												$scope.recargarItemsTabla();
											});
										}
									}
								}
							});
						} else {
							cliente.fecha1 = null;
							if (cliente.fechatexto1) {
								cliente.fecha1 = new Date($scope.convertirFecha(cliente.fechatexto1));
							}
							cliente.fecha2 = null;
							if (cliente.fechatexto2) {
								cliente.fecha2 = new Date($scope.convertirFecha(cliente.fechatexto2));
							}
							if (cliente.id) {
								Cliente.update({ idCliente: cliente.id }, cliente, function (res) {
									blockUI.stop();
									$scope.cerrarPopPupNuevoCliente();
									$scope.mostrarMensaje(res.mensaje);
									$scope.recargarItemsTabla();
								});
							} else {
								cliente.$save(function (res) {
									blockUI.stop();
									$scope.cliente = new Cliente({});
									$scope.cerrarPopPupNuevoCliente();
									$scope.mostrarMensaje(res.mensaje);
									$scope.recargarItemsTabla();
								}, function (error) {
									blockUI.stop();
									$scope.cerrarPopPupNuevoCliente();
									$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
									$scope.recargarItemsTabla();
								});
							}
						}
					}
				});
			}
			if (!$scope.usuario.usar_creditos) {
				var step = $('#credito').attr('class');
				console.log(step)
				if (step == "ng-hide active") {
					$('#siguiente').click();
				}
			}
			if (!$scope.usuario.usar_razon_social) {
				var step = $('#razonsocial').attr('class');
				console.log(step)
				if (step == "ng-hide active") {
					$('#siguiente').click();
				}
			}
			if (!$scope.usuario.destinos) {
				var step = $('#destinos').attr('class');
				console.log(step)
				if (step == "ng-hide active") {
					$('#siguiente').click();
				}
			}
		}
		$scope.regresarwizard = function () {
			if (!$scope.usuario.destinos) {
				var step = $('#destinos').attr('class');
				console.log(step)
				if (step == "ng-hide complete") {
					$('#anterior').click();
				}
			}
			if (!$scope.usuario.usar_razon_social) {
				var step = $('#razonsocial').attr('class');
				console.log(step)
				if (step == "ng-hide complete") {
					$('#anterior').click();
				}
			}
			if (!$scope.usuario.usar_creditos) {
				var step = $('#credito').attr('class');
				console.log(step)
				if (step == "ng-hide complete") {
					$('#anterior').click();
				}
			}
		}
		$scope.obtenerEmpresas = function () {
			blockUI.start();
			var promesa = Empresas();
			promesa.then(function (empresas) {
				$scope.empresas = empresas;
				blockUI.stop();
			});
		}

		// $scope.obtenerClientes=function(){
		// 	blockUI.start();
		// 	var promesa=Clientes($scope.usuario.id_empresa);
		// 	promesa.then(function(clientes){
		// 		$scope.clientes=clientes;
		// 		blockUI.stop();
		// 	});
		// }

		$scope.agregarClienteRazon = function (clienteRazon) {
			if (clienteRazon.nit && clienteRazon.razon_social) {

				if ($scope.cliente.clientes_razon.indexOf(clienteRazon) == -1) {
					$scope.cliente.clientes_razon.push(clienteRazon);
				}
				$scope.cliente_razon = {}
			}
		}

		$scope.modificarClienteRazon = function (clienteRazon) {
			$scope.cliente_razon = clienteRazon;
		}

		$scope.removerClienteRazon = function (clienteRazon) {
			clienteRazon.eliminado = true;
		}

		$scope.obtenerDestinos = function () {
			var promesa = DestinosCliente($scope.usuario.id_empresa);
			promesa.then(function (destinos) {
				$scope.destinos = destinos;
			})
		}

		$scope.agregarDestino = function (destino) {
			if (destino.id) {
				var clienteDestino = { id_destino: destino.id, destino: destino };
				if ($scope.cliente.cliente_destinos.indexOf(clienteDestino) == -1) {
					$scope.cliente.cliente_destinos.push(clienteDestino);
				}
				$scope.dato_destino = {}

			}

		}

		$scope.removerDestino = function (destino) {
			destino.eliminado = true;
		}

		$scope.generarExcelComprobacionDatosClientes = function (clientes, configuracion) {
			$scope.obtenerClientes()
			var data = [["N°", "CODIGO", "CLIENTE", "NIT PRINCIPAL", "RAZÓN SOCIAL PRINCIPAL", "DIRECCION", "TELEFONO UNO", "TELEFONO DOS", "TELEFONO TRES", "UBIC. GEO.", "RUBRO", "CATEGORIA", "FECHA IMP. 1", "FECHA IMP. 2", "TEXTO 1", "TEXTO 2", "RAZONES CLIENTE", "NIT -RAZON", "CODIGO SAP", "DESTINOS", "DIRECCION DESTINO"]]
			var iu = []
			for (var i = 0; i < $scope.clientes.length; i++) {
				var columns = [];

				if ($scope.clientes[i].clientes_razon.length > 0) {
					$scope.clientes[i].clientes_razon.map(function (razon, dex) {
						if ($scope.clientes[i].cliente_destinos.length > 0) {
							$scope.clientes[i].cliente_destinos.map(function (destino) {
								columns = [];
								columns.push((i + 1));
								columns.push($scope.clientes[i].codigo);
								columns.push($scope.clientes[i].contacto);
								columns.push($scope.clientes[i].nit);
								columns.push($scope.clientes[i].razon_social);
								columns.push($scope.clientes[i].direccion);
								columns.push($scope.clientes[i].telefono1);
								columns.push($scope.clientes[i].telefono2);
								columns.push($scope.clientes[i].telefono3);
								columns.push($scope.clientes[i].ubicacion_geografica)
								columns.push($scope.clientes[i].rubro)
								columns.push($scope.clientes[i].categoria)
								columns.push($scope.fechaATexto($scope.clientes[i].fecha1))
								columns.push($scope.fechaATexto($scope.clientes[i].fecha2))
								columns.push($scope.clientes[i].texto2)
								columns.push($scope.clientes[i].texto2)
								columns.push(razon.razon_social);
								columns.push(razon.nit);
								columns.push(razon.codigo_sap);
								columns.push(destino.destino.destino);
								columns.push(destino.destino.direccion);
								data.push(columns);
							})
						} else {
							columns = [];
							columns.push((i + 1));
							columns.push($scope.clientes[i].codigo);
							columns.push($scope.clientes[i].contacto);
							columns.push($scope.clientes[i].nit);
							columns.push($scope.clientes[i].razon_social);
							columns.push($scope.clientes[i].direccion);
							columns.push($scope.clientes[i].telefono1);
							columns.push($scope.clientes[i].telefono2);
							columns.push($scope.clientes[i].telefono3);
							columns.push($scope.clientes[i].ubicacion_geografica)
							columns.push($scope.clientes[i].rubro)
							columns.push($scope.clientes[i].categoria)
							columns.push($scope.fechaATexto($scope.clientes[i].fecha1))
							columns.push($scope.fechaATexto($scope.clientes[i].fecha2))
							columns.push($scope.clientes[i].texto2)
							columns.push($scope.clientes[i].texto2)
							columns.push(razon.razon_social);
							columns.push(razon.nit);
							columns.push(razon.codigo_sap);
							columns.push("sin dato");
							columns.push("sin dato");
							data.push(columns);
						}
					})
				} else {

					if ($scope.clientes[i].cliente_destinos.length > 0) {
						$scope.clientes[i].cliente_destinos.map(function (destino) {
							columns = [];
							columns.push((i + 1));
							columns.push($scope.clientes[i].codigo);
							columns.push($scope.clientes[i].contacto);
							columns.push($scope.clientes[i].nit);
							columns.push($scope.clientes[i].razon_social);
							columns.push($scope.clientes[i].direccion);
							columns.push($scope.clientes[i].telefono1);
							columns.push($scope.clientes[i].telefono2);
							columns.push($scope.clientes[i].telefono3);
							columns.push($scope.clientes[i].ubicacion_geografica)
							columns.push($scope.clientes[i].rubro)
							columns.push($scope.clientes[i].categoria)
							columns.push($scope.fechaATexto($scope.clientes[i].fecha1))
							columns.push($scope.fechaATexto($scope.clientes[i].fecha2))
							columns.push($scope.clientes[i].texto2)
							columns.push($scope.clientes[i].texto2)
							columns.push("sin dato");
							columns.push("sin dato");
							columns.push("sin dato");
							columns.push(destino.destino.destino);
							columns.push(destino.destino.direccion);
							data.push(columns);
						})
					} else {
						columns = [];
						columns.push((i + 1));
						columns.push($scope.clientes[i].codigo);
						columns.push($scope.clientes[i].contacto);
						columns.push($scope.clientes[i].nit);
						columns.push($scope.clientes[i].razon_social);
						columns.push($scope.clientes[i].direccion);
						columns.push($scope.clientes[i].telefono1);
						columns.push($scope.clientes[i].telefono2);
						columns.push($scope.clientes[i].telefono3);
						columns.push($scope.clientes[i].ubicacion_geografica)
						columns.push($scope.clientes[i].rubro)
						columns.push($scope.clientes[i].categoria)
						columns.push($scope.fechaATexto($scope.clientes[i].fecha1))
						columns.push($scope.fechaATexto($scope.clientes[i].fecha2))
						columns.push($scope.clientes[i].texto2)
						columns.push($scope.clientes[i].texto2)
						columns.push("sin dato");
						columns.push("sin dato");
						columns.push("sin dato");
						columns.push("sin dato");
						columns.push("sin dato");
						data.push(columns);
					}
				}
				// data.push(columns);
			}

			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "COMPROBACION DATOS CLIENTES RAZONES DESTINOS.xlsx");
			blockUI.stop();

		}

		$scope.subirExcelClientes = function (event) {
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
					var clientes = [];
					do {
						var cliente = {};
						cliente.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
						cliente.razon_social = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
						cliente.nit = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
						cliente.direccion = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
						cliente.telefono1 = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
						cliente.telefono2 = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
						cliente.telefono3 = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
						cliente.contacto = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? worksheet['H' + row].v.toString() : null;
						cliente.ubicacion_geografica = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? worksheet['I' + row].v.toString() : null;
						cliente.rubro = worksheet['J' + row] != undefined && worksheet['J' + row] != "" ? worksheet['J' + row].v.toString() : null;
						cliente.categoria = worksheet['K' + row] != undefined && worksheet['K' + row] != "" ? worksheet['K' + row].v.toString() : null;
						cliente.fecha1 = worksheet['L' + row] != undefined && worksheet['L' + row] != "" ? new Date($scope.convertirFecha(worksheet['L' + row].v.toString())) : null;
						cliente.fecha2 = worksheet['M' + row] != undefined && worksheet['M' + row] != "" ? new Date($scope.convertirFecha(worksheet['M' + row].v.toString())) : null;
						cliente.texto1 = worksheet['N' + row] != undefined && worksheet['N' + row] != "" ? worksheet['N' + row].v.toString() : null;
						cliente.texto2 = worksheet['O' + row] != undefined && worksheet['O' + row] != "" ? worksheet['O' + row].v.toString() : null;
						cliente.tipoPrecioVenta = worksheet['P' + row] != undefined && worksheet['P' + row] != "" ? worksheet['P' + row].v.toString() : null;
						if (cliente.tipoPrecioVenta != null) {
							cliente.tipoPrecioVenta = $scope.tiposPrecios.clases.find(function (tipo) {
								return cliente.tipoPrecioVenta.toUpperCase() === tipo.nombre									
							})
						}
						clientes.push(cliente);
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
					$scope.guardarClientes(clientes);
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
		}
		$scope.subirExcelRazonesSocialesCliente = function (event) {
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
					var clientes = [];
					do {
						var cliente = {};
						cliente.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
						cliente.razon_social = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
						cliente.nit = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
						cliente.codigo_sap = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
						clientes.push(cliente);
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
					$scope.guardarRazonesSocialesClientes(clientes);
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
		}
		$scope.guardarRazonesSocialesClientes = function (clientes) {
			var promesa = RazonesSocialesCliente(clientes, $scope.usuario.id_empresa);
			promesa.then(function (res) {
				blockUI.stop();
				$scope.mostrarMensaje(res.mensaje);
				$scope.recargarItemsTabla()
			})
		}
		$scope.guardarClientes = function (clientes) {
			var clientesEmpresa = new ClientesEmpresa({ clientes: clientes, id_empresa: $scope.usuario.id_empresa });
			clientesEmpresa.$save(function (res) {
				blockUI.stop();
				$scope.mostrarMensaje(res.mensaje);
				$scope.recargarItemsTabla();
			}, function (error) {
				blockUI.stop();
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				$scope.recargarItemsTabla();
			});
		}

		$scope.abrirModalConceptoEdicionCorrelativos = function (Tipo) {
			blockUI.start();
			var promesa = ClasesTipoEmpresa("correlativo_clientes", $scope.usuario.id_empresa);
			promesa.then(function (entidad) {
				//$scope.correlativosClientes = entidad
				if (entidad.clases.length > 1) {
					entidad.clases.sort(function (a, b) {
						a.correlativo = a.nombre_corto.split('-')[0]
						a.correlativo_maximo = a.nombre_corto.split('-')[1]
						b.correlativo = b.nombre_corto.split('-')[0]
						b.correlativo_maximo = b.nombre_corto.split('-')[1]
						return a.correlativo - b.correlativo
					})
					$scope.minimo = parseInt(entidad.clases[entidad.clases.length - 1].correlativo_maximo) + 1

				} else if (entidad.clases.length == 1) {
					entidad.clases[0].correlativo = entidad.clases[0].nombre_corto.split('-')[0]
					entidad.clases[0].correlativo_maximo = entidad.clases[0].nombre_corto.split('-')[1]
					$scope.minimo = parseInt(entidad.clases[0].correlativo_maximo) + 1
				}
				$scope.tipo_edicion = entidad;
				$scope.clase = {};
				$scope.abrirPopup($scope.idModalConceptoEdicionCorrelativos);
				blockUI.stop();
			});

		}
		$scope.cerrarModalConceptoEdicionCorrelativos = function () {
			$scope.cerrarPopup($scope.idModalConceptoEdicionCorrelativos);
		}
		$scope.agregarConceptoEdicion = function (clase) {
			clase.nombre_corto = clase.correlativo + "-" + clase.correlativo_maximo

			if ($scope.tipo_edicion.clases.indexOf(clase) == -1) {
				if ($scope.tipo_edicion.clases.length > 0) {
					/* if (clase.correlativo > $scope.tipo_edicion.clases[$scope.tipo_edicion.clases.length - 1].correlativo_maximo) { */
					$scope.tipo_edicion.clases.push(clase);
					$scope.minimo = clase.correlativo_maximo + 1
					/* } else {
						$scope.mostrarMensaje("El valor de correlativo debe ser mayor al valor maximo del ultimo correlativo")
					} */
				} else {
					$scope.tipo_edicion.clases.push(clase);
					$scope.minimo = clase.correlativo_maximo + 1
				}

			}
			$scope.clase = {}

		}
		$scope.modificarConceptoEdicion = function (clase) {
			clase.correlativo = parseInt(clase.correlativo)
			clase.correlativo_maximo = parseInt(clase.correlativo_maximo)
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
					$scope.cerrarModalConceptoEdicionCorrelativos();
					$scope.mostrarMensaje('Guardado Exitosamente!');
				});
			});
		}

		$scope.abrirModalVerificarCuenta = function (dato, tipo) {
			$scope.dato = dato
			$scope.tipoDatosPermiso = tipo
			$scope.abrirPopup($scope.IdModalVerificarCuenta);
		}
		$scope.cerrarModalVerificarCuenta = function () {
			$scope.cerrarPopup($scope.IdModalVerificarCuenta);
		}
		$scope.verificarCuentaAdmin = function (cuenta) {
			VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {

				if (dato.type) {
					$scope.mostrarMensaje(dato.message)
					/*  cuenta.abierto= cuenta.abierto; */
					if ($scope.tipoDatosPermiso == "correlativo") {
						$scope.modificarConceptoEdicion($scope.dato)
					}
					$scope.cerrarModalVerificarCuenta();
				} else {
					$scope.mostrarMensaje(dato.message)
				}
			})
		}
		$scope.obtenerTiposPrecio = function () {
			blockUI.start();
			var promesa = ClasesTipoEmpresa("T_PAGO_PRODUCTO", $scope.usuario.id_empresa);
			promesa.then(function (entidad) {
				$scope.tiposPrecios = entidad
				blockUI.stop();
			});
		}
		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup('modal-wizard-cliente');
			$scope.eliminarPopup('modal-wizard-cliente-vista');
			$scope.eliminarPopup('dialog-eliminar-cliente');
			$scope.eliminarPopup($scope.idModalConceptoEdicionCorrelativos);
			$scope.eliminarPopup($scope.IdModalVerificarCuenta);
		});

		$scope.inicio();
	}]);



