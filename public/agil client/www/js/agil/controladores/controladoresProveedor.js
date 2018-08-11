angular.module('agil.controladores')

	.controller('ControladorProveedores', function ($scope, $window, $localStorage, $location, $templateCache, $route, blockUI, Proveedor, Proveedores, Empresas, ProveedoresEmpresa, ProveedoresPaginador, EliminarProveedor) {
		blockUI.start();

		$scope.usuario = JSON.parse($localStorage.usuario);

		$scope.inicio = function () {
			$scope.obtenerEmpresas();
			$scope.obtenerProveedores();
			$scope.buscarTodosProveedores();
			/*setTimeout(function() {
				ejecutarScriptsTabla('tabla-proveedores',10);
			},2000);*/
		}

		$scope.$on('$viewContentLoaded', function () {
			resaltarPestaña($location.path().substring(1));
			ejecutarScriptsProveedor('modal-wizard-proveedor', 'modal-wizard-proveedor-vista', 'dialog-eliminar-proveedor', 'modal-wizard-container-proveedor-edicion', 'modal-wizard-container-proveedor-vista');
			$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
			blockUI.stop();
		});

		$scope.crearNuevoProveedor = function () {
			var usuario = JSON.parse($localStorage.usuario);
			$scope.proveedor = new Proveedor({ id_empresa: usuario.id_empresa });
			$scope.abrirPopup('modal-wizard-proveedor');
		}

		$scope.verProveedor = function (proveedor) {
			$scope.proveedor = proveedor;
			proveedor.fecha1 = new Date(proveedor.fecha1);
			proveedor.fecha2 = new Date(proveedor.fecha2);
			$scope.proveedor.fechatexto1 = proveedor.fecha1.getDate() + "/" + (proveedor.fecha1.getMonth() + 1) + "/" + proveedor.fecha1.getFullYear();
			$scope.proveedor.fechatexto2 = proveedor.fecha2.getDate() + "/" + (proveedor.fecha2.getMonth() + 1) + "/" + proveedor.fecha2.getFullYear();
			$scope.abrirPopup('modal-wizard-proveedor-vista');
		}

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup('modal-wizard-proveedor-vista');
		}

		$scope.cerrarPopPupNuevoProveedor = function () {
			$scope.cerrarPopup('modal-wizard-proveedor');
		}

		$scope.modificarProveedor = function (proveedor) {
			$scope.proveedor = proveedor;
			if (proveedor.fecha1) {
				proveedor.fecha1 = new Date(proveedor.fecha1);
				$scope.proveedor.fechatexto1 = proveedor.fecha1.getDate() + "/" + (proveedor.fecha1.getMonth() + 1) + "/" + proveedor.fecha1.getFullYear();
			}
			if (proveedor.fecha2) {
				proveedor.fecha2 = new Date(proveedor.fecha2);
				$scope.proveedor.fechatexto2 = proveedor.fecha2.getDate() + "/" + (proveedor.fecha2.getMonth() + 1) + "/" + proveedor.fecha2.getFullYear();
			}
			$scope.abrirPopup('modal-wizard-proveedor');
		}

		$scope.mostrarConfirmacionEliminacion = function (proveedor) {
			$scope.proveedor = new Proveedor(proveedor);
			$scope.abrirPopup("dialog-eliminar-proveedor");
		}

		$scope.cerrarConfirmacionEliminacion = function () {
			$scope.cerrarPopup('dialog-eliminar-proveedor');
		};

		$scope.eliminarProveedor = function (proveedor) {
			blockUI.start();
			$scope.cerrarConfirmacionEliminacion();
			/* proveedor.$delete(); */
			var promesa = EliminarProveedor(proveedor.id)
			promesa.then(function (dato) {
				$scope.mostrarMensaje(dato.mensaje);
			})

			$scope.recargarItemsTabla();
			blockUI.stop();
		}

		$scope.saveForm = function (proveedor) {
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
											proveedor.fecha1 = null;
											if (proveedor.fechatexto1) {
												proveedor.fecha1 = new Date($scope.convertirFecha(proveedor.fechatexto1));
											}
											proveedor.fecha2 = null;
											if (proveedor.fechatexto2) {
												proveedor.fecha2 = new Date($scope.convertirFecha(proveedor.fechatexto2));
											}
											if (proveedor.id) {
												Proveedor.update({ idProveedor: proveedor.id }, proveedor, function (res) {
													blockUI.stop();
													$scope.cerrarPopPupNuevoProveedor();
													$scope.mostrarMensaje('Actualizado Exitosamente!');
													$scope.recargarItemsTabla();
												});
											} else {
												proveedor.$save(function (proveedor) {
													blockUI.stop();
													$scope.proveedor = new Proveedor({});
													$scope.cerrarPopPupNuevoProveedor();
													$scope.mostrarMensaje('Guardado Exitosamente!');
													$scope.recargarItemsTabla();
												}, function (error) {
													blockUI.stop();
													$scope.cerrarPopPupNuevoProveedor();
													$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
													$scope.recargarItemsTabla();
												});
											}
										}
									}
									r.readAsBinaryString(documento);
								} else {
									if (index === array.length - 1) {
										proveedor.fecha1 = null;
										if (proveedor.fechatexto1) {
											proveedor.fecha1 = new Date($scope.convertirFecha(proveedor.fechatexto1));
										}
										proveedor.fecha2 = null;
										if (proveedor.fechatexto2) {
											proveedor.fecha2 = new Date($scope.convertirFecha(proveedor.fechatexto2));
										}
										if (proveedor.id) {
											Proveedor.update({ idProveedor: proveedor.id }, proveedor, function (res) {
												blockUI.stop();
												$scope.cerrarPopPupNuevoProveedor();
												$scope.mostrarMensaje('Actualizado Exitosamente!');
												$scope.recargarItemsTabla();
											});
										} else {
											proveedor.$save(function (proveedor) {
												blockUI.stop();
												$scope.proveedor = new Proveedor({});
												$scope.cerrarPopPupNuevoProveedor();
												$scope.mostrarMensaje('Guardado Exitosamente!');
												$scope.recargarItemsTabla();
											}, function (error) {
												blockUI.stop();
												$scope.cerrarPopPupNuevoProveedor();
												$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
												$scope.recargarItemsTabla();
											});
										}
									}
								}

							})
						} else {
							proveedor.fecha1 = null;
							if (proveedor.fechatexto1) {
								proveedor.fecha1 = new Date($scope.convertirFecha(proveedor.fechatexto1));
							}
							proveedor.fecha2 = null;
							if (proveedor.fechatexto2) {
								proveedor.fecha2 = new Date($scope.convertirFecha(proveedor.fechatexto2));
							}
							if (proveedor.id) {
								Proveedor.update({ idProveedor: proveedor.id }, proveedor, function (res) {
									blockUI.stop();
									$scope.cerrarPopPupNuevoProveedor();
									$scope.mostrarMensaje('Actualizado Exitosamente!');
									$scope.recargarItemsTabla();
								});
							} else {
								proveedor.$save(function (proveedor) {
									blockUI.stop();
									$scope.proveedor = new Proveedor({});
									$scope.cerrarPopPupNuevoProveedor();
									$scope.mostrarMensaje('Guardado Exitosamente!');
									$scope.recargarItemsTabla();
								}, function (error) {
									blockUI.stop();
									$scope.cerrarPopPupNuevoProveedor();
									$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
									$scope.recargarItemsTabla();
								});
							}
						}
					}

				})
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

		$scope.obtenerProveedores = function () {
			$scope.abs = $window.Math.abs;
			$scope.itemsPorPagina = 10;
			$scope.buscarProveedores(1, $scope.itemsPorPagina, "");
		}

		$scope.verificarPulso = function (evento, textoBusqueda) {
			if (evento.keyCode === 13) { //enter pressed
				$scope.buscarProveedores(1, $scope.itemsPorPagina, textoBusqueda);
			}
		}

		$scope.buscarProveedores = function (pagina, itemsPagina, texto) {
			blockUI.start();
			$scope.itemsPorPagina = itemsPagina;
			if (texto == "" || texto == null) {
				texto = 0;
			} else {
				$scope.textoBusqueda = texto;
			}
			$scope.paginaActual = pagina;
			var promesa = ProveedoresPaginador($scope.usuario.id_empresa, pagina, itemsPagina, texto);
			promesa.then(function (dato) {
				$scope.paginas = [];
				for (var i = 1; i <= dato.paginas; i++) {
					$scope.paginas.push(i);
				}
				$scope.proveedores = dato.proveedores;
				blockUI.stop();
			});
		}

		$scope.buscarTodosProveedores = function () {
			var promesa = Proveedores($scope.usuario.id_empresa);
			promesa.then(function (dato){
				$scope.TodoProveedores = dato;
			})
			blockUI.stop();
		}

		$scope.reporteExcel = function(){
			//console.log("Reporte Excel "+ $scope.proveedores);
			
			//var proveedores = $scope.proveedores;
			var todosProveedores = $scope.TodoProveedores;
			blockUI.start()

			var cabecera = ["Codigo","Razón Social","Nit","Direccion","Telefono1","Telefono2","Contacto","Ubicacion Geo.","Rubro","Categoria","Fecha Imp.1","Fecha Imp.2","Texto1","Texto2"];
			var data = [];
			data.push(cabecera);

			for (var i = 0; i < todosProveedores.length; i++){
				columns = [];
				columns.push(todosProveedores[i].codigo);
				columns.push(todosProveedores[i].razon_social);
				columns.push(todosProveedores[i].nit);
				columns.push(todosProveedores[i].direccion);
				columns.push(todosProveedores[i].telefono1);
				columns.push(todosProveedores[i].telefono2);
				columns.push(todosProveedores[i].contacto);
				if(todosProveedores[i].ubicacion_geografica){
					columns.push(todosProveedores[i].ubicacion_geografica);
				}else{
					columns.push(" ")
				}
				columns.push(todosProveedores[i].rubro);
				
				if (todosProveedores[i].categoria) {
					columns.push(todosProveedores[i].categoria);	
				}else{
					columns.push(" ");
				}
				if(todosProveedores[i].fecha1){	
					columns.push(new Date(todosProveedores[i].fecha1));
				}else{
					columns.push(" ")
				}
				if(todosProveedores[i].fecha2){
					columns.push(new Date(todosProveedores[i].fecha2));
				}else{
					columns.push(" ")
				}
				if(todosProveedores[i].texto1){
					columns.push(todosProveedores[i].texto1);
				}else{
					columns.push(" ")
				}
				if(todosProveedores[i].texto2){
					columns.push(todosProveedores[i].texto2);
				}else{
					columns.push(" ")
				}
				data.push(columns);
			}
			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-USUARIOS.xlsx");
			blockUI.stop();
		}

		$scope.dibujarCabeceraPDFProveedores = function (doc, pagina, totalPaginas, cliente){
			var date = new Date().toLocaleDateString();		
			doc.fontSize(23).text("REPORTE DE PROVEEDORES",0,80,{ align: "center" });			
			doc.rect(133, 100, 335, 0).stroke();			
			doc.font('Helvetica-Bold',10);		
			doc.text("Fecha: ",30,140);			
			doc.font('Helvetica',10).text(date ,63,140);		
			doc.font('Helvetica-Bold',10).text('N°',30,160);			
			doc.font('Helvetica-Bold',10).text('Código',52,160);			
			doc.font('Helvetica-Bold',10).text('Razón Social',100,160);			
			doc.font('Helvetica-Bold',10).text('Nit',230,160);			
			doc.font('Helvetica-Bold',10).text('Direccion',300,160);			
			doc.font('Helvetica-Bold',10).text('Telefono',390,160);
			doc.font('Helvetica-Bold',10).text('Rubro',470,160);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
		}
		$scope.reportePdf = function(){
			var todosProveedores = /*$scope.proveedores;*/$scope.TodoProveedores;
			blockUI.start();
			//console.log($scope.usuario.empresa)

			var doc = new PDFDocument({ size: 'letter', margin: 10 });
			var stream = doc.pipe(blobStream());
			// draw some text
			var totalCosto = 0;

			var y = 200, itemsPorPagina = 15, items = 0, pagina = 1, totalPaginas = Math.ceil(todosProveedores.length / itemsPorPagina);
			$scope.dibujarCabeceraPDFProveedores(doc, 1, totalPaginas, todosProveedores);
			doc.font('Helvetica', 8);
			var tam = todosProveedores.length - 1;
			for (var i = 0; i < tam && items <= itemsPorPagina; i++) {
				var indice = i + 1;
				doc.font('Helvetica',9).text(indice,30,y);
				if (todosProveedores[i].codigo) {
					doc.font('Helvetica',9).text(todosProveedores[i].codigo,52,y);
				}else{
					doc.font('Helvetica',9).text("null",52,y);
				}
				if (todosProveedores[i].razon_social) {
					doc.font('Helvetica',9).text(todosProveedores[i].razon_social,100,y,{width:130});				
				}else{
					doc.font('Helvetica',9).text("null",100,y);
				}

				if (todosProveedores[i].nit) {		
					doc.font('Helvetica',9).text(todosProveedores[i].nit,230,y);			
				}else{
					doc.font('Helvetica',9).text("null",230,y);
				}

				if (todosProveedores[i].direccion) {			
					doc.font('Helvetica',9).text(todosProveedores[i].direccion,300,y,{width:80} );
					console.log(todosProveedores[i].direccion.length);
				}else{
					doc.font('Helvetica',9).text("null",300,y);					
				}

				if (todosProveedores[i].telefono1) {			
					doc.font('Helvetica',9).text(todosProveedores[i].telefono1,390,y);
				}else{
					doc.font('Helvetica',9).text("null",390,y);					
				}

				if (todosProveedores[i].rubro) {			
					doc.font('Helvetica',9).text(todosProveedores[i].rubro,470,y);
				}else{
					doc.font('Helvetica',9).text("null",470,y);					
				}
				
				y = y + 33;

				items++;
				if (items == itemsPorPagina) {
					doc.addPage({ margin: 0, bufferPages: true });
					y = 200;
					items = 0;
					pagina = pagina + 1;
					$scope.dibujarCabeceraPDFProveedores(doc, pagina, totalPaginas, todosProveedores);
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

		$scope.subirExcelProveedores = function (event) {
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
					var proveedores = [];
					do {
						var proveedor = {};
						proveedor.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
						proveedor.razon_social = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
						proveedor.nit = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
						proveedor.direccion = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? worksheet['D' + row].v.toString() : null;
						proveedor.telefono1 = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? worksheet['E' + row].v.toString() : null;
						proveedor.telefono2 = worksheet['F' + row] != undefined && worksheet['F' + row] != "" ? worksheet['F' + row].v.toString() : null;
						proveedor.telefono3 = worksheet['G' + row] != undefined && worksheet['G' + row] != "" ? worksheet['G' + row].v.toString() : null;
						proveedor.contacto = worksheet['H' + row] != undefined && worksheet['H' + row] != "" ? worksheet['H' + row].v.toString() : null;
						proveedor.ubicacion_geografica = worksheet['I' + row] != undefined && worksheet['I' + row] != "" ? worksheet['I' + row].v.toString() : null;
						proveedor.rubro = worksheet['J' + row] != undefined && worksheet['J' + row] != "" ? worksheet['J' + row].v.toString() : null;
						proveedor.categoria = worksheet['K' + row] != undefined && worksheet['K' + row] != "" ? worksheet['K' + row].v.toString() : null;
						proveedor.fecha1 = worksheet['L' + row] != undefined && worksheet['L' + row] != "" ? new Date($scope.convertirFecha(worksheet['L' + row].v.toString())) : null;
						proveedor.fecha2 = worksheet['M' + row] != undefined && worksheet['M' + row] != "" ? new Date($scope.convertirFecha(worksheet['M' + row].v.toString())) : null;
						proveedor.texto1 = worksheet['N' + row] != undefined && worksheet['N' + row] != "" ? worksheet['N' + row].v.toString() : null;
						proveedor.texto2 = worksheet['O' + row] != undefined && worksheet['O' + row] != "" ? worksheet['O' + row].v.toString() : null;
						proveedores.push(proveedor);
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
					$scope.guardarProveedores(proveedores);
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
		}

		$scope.guardarProveedores = function (proveedores) {
			var proveedoresEmpresa = new ProveedoresEmpresa({ proveedores: proveedores, id_empresa: $scope.usuario.id_empresa });
			proveedoresEmpresa.$save(function (proveedor) {
				blockUI.stop();
				$scope.mostrarMensaje('Guardado Exitosamente!');
				$scope.recargarItemsTabla();
			}, function (error) {
				blockUI.stop();
				$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
				$scope.recargarItemsTabla();
			});
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup('modal-wizard-proveedor');
			$scope.eliminarPopup('modal-wizard-proveedor-vista');
			$scope.eliminarPopup('dialog-eliminar-proveedor');
		});

		$scope.inicio();
	});



