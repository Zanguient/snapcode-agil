angular.module('agil.servicios')

	.factory('Diccionario', [function () {
		return {
			MOV_ING: "MOVING",
			MOV_EGR: "MOVEGR",
			ING_INV_INICIAL: "III",
			EGRE_FACTURACION: "FACT",
			EGRE_BAJA: "BAJA",
			EGRE_PROFORMA: "PFR",
			EGRE_TRASPASO: "TRAS",
			EGRE_AJUSTE: "AJU",
			EGRE_COTIZACION: "COT",
			FACT_IMPRESION_VACIA: "VAC",
			FACT_IMPRESION_COMPLETA: "COMPL",
			FACT_IMPRESION_SEMICOMPLETA: "SEMICOMPL",
			FACT_PAPEL_OFICIO: "OFICIO",
			FACT_PAPEL_CARTA: "CARTA",
			FACT_PAPEL_MEDIOOFICIO: "MEDOFI",
			FACT_PAPEL_ROLLO: "ROLLO",
			FACT_PAPEL_CUARTOCARTA: "CARTACUARTO",
			TIPO_PAGO_CREDITO: "CREDITO",
			TIPO_PAGO_CONTADO: "CONTADO",
			CENTRO_COSTO_ALMACEN: "ALMACEN",
			ROL_ADMINISTRADOR: "ADMINISTRADOR",
			ROL_VENDEDOR: "VENDEDOR",
			DIA_LUNES: "LUN19",
			DIA_MARTES: "MAR19",
			DIA_MIERCOLES: "MIE19",
			DIA_JUEVES: "JUE19",
			DIA_VIERNES: "VIE19",
			DIA_SABADO: "SAB19",
			DIA_DOMINGO: "DOM19",
			USUARIO_SUPERADMIN: "SUPER-ADMINISTRADOR",
			MENU_RUTAS: "RUTAS",
			MENU_SEGUIMIENTOAPP: "SEGUIMIENTO APP",
			MENU_APPMOVIL: "APP MOVIL",
			MENU_PANTALLACLIENTE: "PANTALLA CLIENTE",
			MENU_PANTALLADESPACHO: "PANTALLA DESPACHO",
			TIPO_PRODUCTO_BASE: "PBASE",
			TIPO_PRODUCTO_INTER: "PINTER",
			TIPO_PRODUCTO_FINAL: "PFINAL",
			DESTINO_CIERRE_BANCO: "DBANCO",
			DESTINO_CIERRE_CAJA: "CAJA",
			DESTINO_CIERRE_SIGUIENTETURNO: "SIGUIENTETURNO",
			ESTADO_MESA_OCUPADO: 'OCU',
			ESTADO_MESA_DISPONIBLE: 'DIS',
			ESTADO_MESA_RESERVADO: 'RE',
			MENU_MESAS: "MESAS",
			MENU_PLAN_CUENTAS: "PLAN CUENTAS",
			MENU_COMPROBANTES: "COMPROBANTES",
			MENU_MEDICO: "PACIENTES",
			IVA_DF: "IVA DF",
			IVA_CF: "IVA CF",
			IT: "IT",
			IT_POR_PAGAR: "IT POR PAGAR",
			CAJA_BANCOS: "CAJA/BANCOS"
		}
	}])

	.factory('VerificarDescuentos', [function () {
		var res = function (detalles) {
			var existe = false;
			for (var i = 0; i < detalles.length; i++) {
				if (detalles[i].descuento > 0 || detalles[i].recargo > 0 || detalles[i].ice > 0 || detalles[i].excento > 0) {
					existe = true;
				}
			}
			return existe;
		};
		return res;
	}])
	//factory para nuevos comprobantes
	.factory('NuevoComprobante', ["blockUI","AsignarComprobanteFavorito", "LibroMayorCuenta", "ComprobanteRevisarPaginador", "NuevoComprobanteContabilidad", "ListaCuentasComprobanteContabilidad", "ActualizarComprobanteContabilidad", "ImprimirComprobante","DatosComprobante", 
	function (blockUI,AsignarComprobanteFavorito, LibroMayorCuenta, ComprobanteRevisarPaginador, NuevoComprobanteContabilidad, ListaCuentasComprobanteContabilidad, ActualizarComprobanteContabilidad, ImprimirComprobante,DatosComprobante) {
		var res = function (mostrarMensaje, paginator, filtro, usuario, idComprobante, datoslibroMayor, revisar, convertirFecha, cerrarModal, nuevoComprobante,
			buscarCuentaQuery, verificarVentasComprobantes, verificarComprasComprobantes, recargarItemsTabla) {
			if (idComprobante) {
				var promesa = AsignarComprobanteFavorito(idComprobante)
				promesa.then(function (entidad) {
					mostrarMensaje(entidad.mensaje)
					paginator.getSearch("", filtro);
				})
			}
			if (datoslibroMayor) {
				if (datoslibroMayor.asiento.id) {
					var promesa = LibroMayorCuenta(datoslibroMayor.asiento.id, datoslibroMayor.fechaInicio, datoslibroMayor.fechaFin)
					return promesa;
				}
			}
			if (revisar) {
				var fechainico = paginator.filter.inicio;
				var fechafin = paginator.filter.fin;
				if (paginator.filter.inicio == null) {
					paginator.filter.inicio = 0
					paginator.filter.fin = 0
				}
				if (paginator.filter.inicio != 0) {
					paginator.filter.inicio = new Date(convertirFecha(filtro.inicio));
					paginator.filter.fin = new Date(convertirFecha(filtro.fin));
				} else {
					fechainico = ""
					fechafin = ""
				}
				var promesa = ComprobanteRevisarPaginador(paginator)
				return promesa;
			}
			if (nuevoComprobante) {
				if (!nuevoComprobante.id) {
					for (var index = 0; index < nuevoComprobante.asientosContables.length; index++) {
						var element = nuevoComprobante.asientosContables[index];
						if (element.activo != false && element.debe_bs != "") {
							nuevoComprobante.importe = Math.round((nuevoComprobante.importe + element.debe_bs) * 10000) / 10000
						}
					}
					
					nuevoComprobante.fecha = new Date(convertirFecha(nuevoComprobante.fecha))
					NuevoComprobanteContabilidad.save(nuevoComprobante, function (dato) {
						verificarVentasComprobantes(usuario.id_empresa)
						verificarComprasComprobantes(usuario.id_empresa)
						mostrarMensaje(dato.mensaje);
						
						var promesa = DatosComprobante(dato.comprobante.id)
						promesa.then(function (datosComprobante) {
							datosComprobante.comprobante.importe_literal = datosComprobante.importeLiteral
							ImprimirComprobante(datosComprobante.comprobante, false, usuario)
						})						
						recargarItemsTabla()
						cerrarModal();
					})

				} else {
					for (var index = 0; index < nuevoComprobante.asientosContables.length; index++) {
						var element = nuevoComprobante.asientosContables[index];
						if (element.activo != false && element.debe_bs != "") {
							nuevoComprobante.importe = Math.round((nuevoComprobante.importe + element.debe_bs) * 10000) / 10000
						}
					}
					nuevoComprobante.fecha = new Date(convertirFecha(nuevoComprobante.fecha))
					ActualizarComprobanteContabilidad.update({ id_comprobante: nuevoComprobante.id }, nuevoComprobante, function (dato) {
						verificarVentasComprobantes(usuario.id_empresa)
						verificarComprasComprobantes(usuario.id_empresa)
						mostrarMensaje(dato.mensaje);
						cerrarModal();
					})
					console.log("falta agregar el put para guardar")
				}
			}
			if (buscarCuentaQuery)
				if (buscarCuentaQuery != "" && buscarCuentaQuery != undefined) {
					// console.log(query)
					var promesa = ListaCuentasComprobanteContabilidad(usuario.id_empresa, buscarCuentaQuery);
					console.log(promesa)
					return promesa;
				}
		};
		return res;
	}])
	.factory('ImprimirComprobante', ['blockUI', 'DibujarCabeceraComprobante', 'Diccionario', 'DibujarCabeceraFacturaNVCartaOficio', 'DibujarCabeceraFacturaNVmedioOficio', '$timeout',
		function (blockUI, DibujarCabeceraComprobante, Diccionario, DibujarCabeceraFacturaNVCartaOficio, DibujarCabeceraFacturaNVmedioOficio, $timeout) {			
			var res = function (comprobante, bimonetario, usuario) {					
				var doc = new PDFDocument({ size: [612, 792], margin: 10 });
				var stream = doc.pipe(blobStream());
				doc.font('Helvetica', 8);
				var itemsPorPagina = 18;
				var y = 170, items = 0, pagina = 1, totalPaginas = Math.ceil(comprobante.asientosContables.length / itemsPorPagina);
				var sumaDebeBs=0,sumaHaberBs=0,sumaDebeSus=0,sumaHaberSus=0;
				var fecha = new Date()
				if (bimonetario) {
					DibujarCabeceraComprobante(doc, bimonetario, usuario, comprobante,pagina,totalPaginas);
					for (var i = 0; i < comprobante.asientosContables.length && items <= itemsPorPagina; i++) {
						
						var asiento = comprobante.asientosContables[i]
						doc.rect(370, y, 0, 30).stroke();
						doc.rect(420, y, 0, 30).stroke();
						doc.rect(470, y, 0, 30).stroke();
						doc.rect(520, y, 0, 30).stroke();
						doc.font('Helvetica', 8);
						doc.text(asiento.cuenta.codigo, 58, y+5)
						doc.font('Helvetica-Bold', 8);
						doc.text(asiento.cuenta.nombre, 140, y+5, { width: 165 ,underline: true})
						doc.font('Helvetica', 8);
						doc.text(asiento.glosa, 145, y+13, { width: 165 })
						doc.text("", 310, y+5)
						doc.text("", 350, y+5)

						doc.text(asiento.debe_bs.toFixed(2), 375, y+5)
						doc.text(asiento.haber_bs.toFixed(2), 425, y+5)

						doc.text(asiento.debe_sus.toFixed(2), 480, y+5)
						doc.text(asiento.haber_sus.toFixed(2), 525, y+5)
						sumaDebeBs +=0+asiento.debe_bs
						sumaHaberBs+=0+asiento.haber_bs
						sumaDebeSus+=0+asiento.debe_sus
						sumaHaberSus+=0+asiento.haber_sus
						y = y + 30;
						items++;

						if (items > itemsPorPagina) {
							doc.addPage({ size: [612, 792], margin: 10 });
							y = 170;
							items = 0;
							pagina = pagina + 1;
							DibujarCabeceraComprobante(doc, bimonetario, usuario, comprobante,pagina,totalPaginas);
						}
					}
					doc.font('Helvetica-Bold', 8);
					doc.text("SUMA TOTAL:", 310, y+5)
					doc.text(sumaDebeBs.toFixed(2), 375, y+5)
					doc.text(sumaHaberBs.toFixed(2), 425, y+5)

					doc.text(sumaDebeSus.toFixed(2), 480, y+5)
					doc.text(sumaHaberSus.toFixed(2), 520, y+5)
					doc.rect(50, y, 520, 0).stroke();
					doc.rect(50, y+20, 520, 0).stroke();
					doc.text("Son:", 58, y+25)
					doc.text(comprobante.importe_literal, 80, y+25)
					doc.rect(50, y+40, 520, 0).stroke();
					doc.rect(370, y, 0, 20).stroke();
					doc.rect(420, y, 0, 20).stroke();
					doc.rect(470, y, 0, 20).stroke();
					doc.rect(520, y, 0, 20).stroke();
					doc.rect(50, 700, 520, 0).stroke();
					doc.font('Helvetica-Bold', 8);
					doc.text("Preparado por:", 58, 705)					
					doc.font('Helvetica', 8);
					doc.text(usuario.persona.nombre_completo, 58, 715)
					doc.rect(200, 700, 0, 40).stroke();
					doc.text(fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"         "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds(), 58, 732)
					doc.text("Revisado", 240, 732)
					doc.text("Autorizado", 350, 732)
					doc.text("Recibio conforme:", 425, 720)
					doc.text("CI:", 425, 732)
					doc.rect(320, 700, 0, 40).stroke();
					doc.rect(420, 700, 0, 40).stroke();
					doc.rect(50, 730, 520, 0).stroke();
					doc.end();
					stream.on('finish', function () {
						var fileURL = stream.toBlobURL('application/pdf');
						var w = window.open(fileURL, '_blank', 'location=no');
						$timeout(function () {
							w.print();
						}, 500);
					});
					blockUI.stop();
				} else {
					DibujarCabeceraComprobante(doc, bimonetario, usuario, comprobante,pagina,totalPaginas);
					for (var i = 0; i < comprobante.asientosContables.length && items <= itemsPorPagina; i++) {
						var asiento = comprobante.asientosContables[i]
						doc.rect(420, y, 0, 30).stroke();
						doc.rect(490, y, 0, 30).stroke();
						doc.font('Helvetica', 8);
						doc.text(asiento.cuenta.codigo, 70, y+5)
						doc.font('Helvetica-Bold', 8);
						doc.text(asiento.cuenta.nombre, 150, y+5, { width: 180 ,underline: true})
						doc.font('Helvetica', 8);
						doc.text(asiento.glosa, 155, y+13, { width: 180 })
						doc.text("", 330, y+5)
						doc.text("", 380, y+5)
						doc.text(asiento.debe_bs.toFixed(2), 440, y+5)
						doc.text(asiento.haber_bs.toFixed(2), 510, y+5)
						sumaDebeBs +=0+asiento.debe_bs
						sumaHaberBs+=0+asiento.haber_bs
						y = y + 30;
						items++;

						if (items > itemsPorPagina) {
							doc.addPage({ size: [612, 792], margin: 10 });
							y = 170;
							items = 0;
							pagina = pagina + 1;
							DibujarCabeceraComprobante(doc, bimonetario, usuario, comprobante,pagina,totalPaginas);
						}
					}
					doc.font('Helvetica-Bold', 8);
					doc.text("SUMA TOTAL:", 360, y+5)
					doc.font('Helvetica', 8);
					doc.text(sumaDebeBs.toFixed(2), 440, y+5)
					doc.text(sumaHaberBs.toFixed(2), 510, y+5)
					doc.rect(50, y, 520, 0).stroke();
					doc.rect(50, y+20, 520, 0).stroke();
					doc.font('Helvetica-Bold', 8);
					doc.text("Son:", 58, y+25)
					doc.font('Helvetica', 8);
					doc.text(comprobante.importe_literal, 80, y+25)
					doc.rect(50, y+40, 520, 0).stroke();
					doc.rect(420, y, 0, 20).stroke();
					doc.rect(490, y, 0, 20).stroke();
					doc.rect(50, 700, 520, 0).stroke();
					doc.font('Helvetica-Bold', 8);
					doc.text("Preparado por:", 58, 705)
					doc.font('Helvetica', 8);
					doc.text(usuario.persona.nombre_completo, 58, 715)
					doc.rect(200, 700, 0, 40).stroke();
					doc.text(fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+"         "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds(), 58, 732)
					doc.text("Revisado", 240, 732)
					doc.text("Autorizado", 350, 732)
					doc.text("Recibio conforme:", 425, 720)
					doc.text("CI:", 425, 732)
					doc.rect(320, 700, 0, 40).stroke();
					doc.rect(420, 700, 0, 40).stroke();
					doc.rect(50, 730, 520, 0).stroke();
					doc.end();
					
					stream.on('finish', function () {
						var fileURL = stream.toBlobURL('application/pdf');
						var w = window.open(fileURL, '_blank', 'location=no');
						$timeout(function () {
							w.print();
						}, 500);
					});
					blockUI.stop();
				}

			};
			return res;
		}])
	.factory('DibujarCabeceraComprobante', [function () {
		var res = function (doc, bimonetario, usuario, comprobante,pagina,totalPaginas) {
			var fecha = new Date()
			if (bimonetario) {
				doc.rect(50, 40, 520, 700).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social, 55, 45)
				doc.text("SISTEMA DE CONTABILIDAD.", 55, 60)
				doc.text("NIT: ", 55, 75)
				doc.font('Helvetica', 8);
				doc.text(usuario.empresa.nit + ".", 70, 75)
				doc.font('Helvetica-Bold', 14);
				doc.text("COMPROBANTE DE "+comprobante.tipoComprobante.nombre, 0, 85, { align: 'center' })
				doc.font('Helvetica', 8);
				doc.text(pagina+' de: '+totalPaginas, 525, 45)
				doc.font('Helvetica-Bold', 8);
				doc.text("Gestión: " + fecha.getFullYear(), 505, 60)
				doc.text("N°: "+comprobante.numero, 505, 75)
				doc.rect(50, 100, 520, 0).stroke();
				doc.font('Helvetica', 8);
				doc.text(comprobante.gloza, 58, 115)
				doc.font('Helvetica-Bold', 8);
				doc.text("Fecha: " + fecha.getDate() + "/" + (fecha.getMonth()) + "/" + fecha.getFullYear(), 490, 105)
				doc.text("T. Cambio: ", 490, 115)
				doc.text(comprobante.tipoCambio.dolar, 535, 115)
				doc.rect(50, 140, 520, 0).stroke();
				doc.text("Cuenta", 65, 155)
				doc.text("Descripcion/Glosa", 140, 155)
				doc.text("C.Costo", 310, 155)
				doc.text("ref", 350, 155)
				doc.rect(50, 170, 520, 0).stroke();
				doc.rect(370, 140, 0, 30).stroke();
				doc.rect(420, 155, 0, 15).stroke();
				doc.rect(370, 155, 200, 0).stroke();
				doc.text("BOLIVIANOS", 395, 147)
				doc.text("Debe", 385, 160)
				doc.text("Haber", 435, 160)
				doc.rect(470, 140, 0, 30).stroke();
				doc.rect(520, 155, 0, 15).stroke();
				doc.text("DOLARES", 500, 147)
				doc.text("Debe", 490, 160)
				doc.text("Haber", 530, 160)
				/* doc.rect(50, 700, 520, 0).stroke();
				doc.rect(200, 700, 0, 40).stroke();
				doc.rect(320, 700, 0, 40).stroke();
				doc.rect(420, 700, 0, 40).stroke();
				doc.rect(50, 730, 520, 0).stroke(); */
			} else {
				doc.rect(50, 40, 520, 700).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social, 55, 45)
				doc.text("SISTEMA DE CONTABILIDAD.", 55, 60)
				doc.text("NIT: ", 55, 75)
				doc.font('Helvetica', 8);
				doc.text(usuario.empresa.nit + ".", 70, 75)
				doc.font('Helvetica-Bold', 14);
				doc.text("COMPROBANTE DE "+comprobante.tipoComprobante.nombre, 0, 85, { align: 'center' })
				doc.font('Helvetica', 8);
				doc.text(pagina+' de: '+totalPaginas, 525, 45)
				doc.font('Helvetica-Bold', 8);
				doc.text("Gestión: " + fecha.getFullYear(), 505, 60)
				doc.text("N°: "+comprobante.numero, 505, 75)
				doc.rect(50, 100, 520, 0).stroke();
				doc.font('Helvetica', 8);
				doc.text(comprobante.gloza, 58, 115)
				doc.font('Helvetica-Bold', 8);
				doc.text("Fecha: " + fecha.getDate() + "/" + (fecha.getMonth()) + "/" + fecha.getFullYear(), 490, 105)
				doc.text("T. Cambio: ", 490, 115)
				doc.text(comprobante.tipoCambio.dolar, 535, 115)
				doc.rect(50, 140, 520, 0).stroke();
				doc.text("Cuenta", 70, 155)
				doc.text("Descripcion/Glosa", 150, 155)
				doc.text("C.Costo", 330, 155)
				doc.text("ref", 380, 155)
				doc.text("BOLIVIANOS", 470, 145)
				doc.rect(420, 155, 150, 0).stroke();
				doc.rect(50, 170, 520, 0).stroke();
				doc.rect(420, 140, 0, 30).stroke();
				doc.rect(490, 155, 0, 15).stroke();
				doc.text("Debe", 445, 160)
				doc.text("Haber", 515, 160)
				/* doc.rect(50, 700, 520, 0).stroke();
				doc.rect(200, 700, 0, 40).stroke();
				doc.rect(320, 700, 0, 40).stroke();
				doc.rect(420, 700, 0, 40).stroke();
				doc.rect(50, 730, 520, 0).stroke(); */


			}


		}
		return res;
	}])
	.factory('ComprasComprobante', function ($resource) {
		return $resource(restServer + "comprasComprobante");
	})
	.factory('ComprobanteRevisarDatosPaginador', function ($resource) {
		return $resource(restServer + "comprobantes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion/busqueda/:texto_busqueda");
	})

	.factory('ComprobanteRevisarPaginador', ['ComprobanteRevisarDatosPaginador', '$q', function (ComprobanteRevisarDatosPaginador, $q) {
		var res = function (paginator) {
			var delay = $q.defer();
			ComprobanteRevisarDatosPaginador.get({ id_empresa: paginator.filter.empresa, pagina: paginator.currentPage, items_pagina: paginator.itemsPerPage, inicio: paginator.filter.inicio, fin: paginator.filter.fin, columna: paginator.column, direccion: paginator.direction, texto_busqueda: paginator.search }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('CuentasComprobanteContabilidad', function ($resource) {
		return $resource(restServer + "comprobante-cuenta/empresa/:id_empresa/busqueda/:buscar", { id_empresa: '@id_empresa', buscar: '@buscar' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ListaCuentasComprobanteContabilidad', ['CuentasComprobanteContabilidad', '$q', function (CuentasComprobanteContabilidad, $q) {
		var res = function (id_empresa, buscar) {
			var delay = $q.defer();
			CuentasComprobanteContabilidad.query({ id_empresa: id_empresa, buscar: buscar }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('ComprobanteEmpresaPaginador', function ($resource) {
		return $resource(restServer + "comprobantes/empresa/:id_empresa/pagina/:pagina/items-pagina/:items_pagina/fecha-inicio/:inicio/fecha-fin/:fin/columna/:columna/direccion/:direccion/monto/:monto/tipo-comprobante/:tipo_comprobante/sucursal/:sucursal/usuario/:usuario/numero/:numero/busqueda/:busqueda");
	})

	.factory('ComprobantePaginador', ['ComprobanteEmpresaPaginador', '$q', function (ComprobanteEmpresaPaginador, $q) {
		var res = function (paginator) {

			if (paginator.filter.monto == null) {
				paginator.filter.monto = 0
			}
			if (paginator.filter.tipo_comprobante == null) {
				paginator.filter.tipo_comprobante = 0;
			}
			if (paginator.filter.sucursal == null) {
				paginator.filter.sucursal = 0;
			}
			if (paginator.filter.usuario == null) {
				paginator.filter.usuario = 0;
			}
			if (paginator.filter.numero == null) {
				paginator.filter.numero = 0;
			}
			var delay = $q.defer();
			ComprobanteEmpresaPaginador.get({ id_empresa: paginator.filter.empresa, pagina: paginator.currentPage, items_pagina: paginator.itemsPerPage, inicio: paginator.filter.inicio, fin: paginator.filter.fin, columna: paginator.column, direccion: paginator.direction, monto: paginator.filter.monto, tipo_comprobante: paginator.filter.tipo_comprobante, sucursal: paginator.filter.sucursal, usuario: paginator.filter.usuario, numero: paginator.filter.numero, busqueda: paginator.search }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('LibroMayor', function ($resource) {
		return $resource(restServer + "/comprobante-cuenta/:id_cuenta/periodo/:inicio/:fin");
	})

	.factory('LibroMayorCuenta', ['LibroMayor', '$q', function (LibroMayor, $q) {
		var res = function (idcuenta, Inicio, Fin) {
			var delay = $q.defer();
			LibroMayor.get({ id_cuenta: idcuenta, inicio: Inicio, fin: Fin }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('ComprobanteFavorito', function ($resource) {
		return $resource(restServer + "comprobante-contabilidad/favorito/:id_comprobante", { id_comprobante: '@id_comprobante' },
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('AsignarComprobanteFavorito', ['ComprobanteFavorito', '$q', function (ComprobanteFavorito, $q) {
		var res = function (idComprobante) {
			var delay = $q.defer();
			ComprobanteFavorito.update({ id_comprobante: idComprobante }, function (entidad) {
				delay.resolve(entidad);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])


	.factory('AsientosComprobanteContabilidad', function ($resource) {
		return $resource(restServer + "comprobante-cuenta/asientos/:id_cuenta", { id_cuenta: '@id_cuenta' },
			{
				'update': { method: 'PUT' }
			});
	})

	.factory('ListaAsientosComprobanteContabilidad', ['AsientosComprobanteContabilidad', '$q', function (AsientosComprobanteContabilidad, $q) {
		var res = function (id_cuenta) {
			var delay = $q.defer();
			AsientosComprobanteContabilidad.query({ id_cuenta: id_cuenta }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	.factory('NuevoComprobanteContabilidad', function ($resource) {
		return $resource(restServer + "comprobante-contabolidad",
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('ActualizarComprobanteContabilidad', function ($resource) {
		return $resource(restServer + "comprobante-contabolidad/:id_comprobante", { id_comprobante: '@id_comprobante' },
			{
				'update': { method: 'PUT' }
			});
	})
	.factory('DatosComprobante', ['ActualizarComprobanteContabilidad', '$q', function (ActualizarComprobanteContabilidad, $q) {
		var res = function (id_comprobante) {
			var delay = $q.defer();
			ActualizarComprobanteContabilidad.get({ id_comprobante: id_comprobante }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	//fin factory para nuevos comprobantes

	.factory('ImprimirSalida', ['Diccionario', 'ImprimirFactura', 'ImprimirProforma', 'ImprimirNotaBaja', 'ImprimirNotaTraspaso',
		function (Diccionario, ImprimirFactura, ImprimirProforma, ImprimirNotaBaja, ImprimirNotaTraspaso) {
			var res = function (movimiento, salida, esAccionGuardar, usuario) {
				if (movimiento == Diccionario.EGRE_FACTURACION) {
					ImprimirFactura(salida, esAccionGuardar, usuario);
				} else if (movimiento == Diccionario.EGRE_PROFORMA) {
					ImprimirProforma(salida, esAccionGuardar, usuario);
				}
				else if (movimiento == Diccionario.EGRE_BAJA) {
					ImprimirNotaBaja(salida, usuario);
				}
				else if (movimiento == Diccionario.EGRE_TRASPASO) {
					ImprimirNotaTraspaso(salida, usuario);
				}
			};
			return res;
		}])

	.factory('ImprimirFactura', ['Diccionario', 'ImprimirFacturaCartaOficio', 'ImprimirPedido', 'ImprimirFacturaRollo', '$timeout',
		function (Diccionario, ImprimirFacturaCartaOficio, ImprimirPedido, ImprimirFacturaRollo, $timeout) {
			var res = function (salida, esAccionGuardar, usuario) {
				var papel, doc, stream;
				if (salida.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
					papel = [612, 936];
					if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_VACIA) {
						ImprimirFacturaCartaOficio(salida, papel, true, false, false, usuario);
					} else if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_COMPLETA) {
						ImprimirFacturaCartaOficio(salida, papel, false, true, false, usuario);
					} else if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_SEMICOMPLETA) {
						ImprimirFacturaCartaOficio(salida, papel, false, false, true), usuario;
					}
				} else if (salida.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
					papel = [612, 792];
					if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_VACIA) {
						ImprimirFacturaCartaOficio(salida, papel, true, false, false, usuario);
					} else if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_COMPLETA) {
						ImprimirFacturaCartaOficio(salida, papel, false, true, false, usuario);
					} else if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_SEMICOMPLETA) {
						ImprimirFacturaCartaOficio(salida, papel, false, false, true, usuario);
					}
				} else if (salida.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
					papel = [612, 468];
					if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_VACIA) {
						ImprimirFacturaCartaOficio(salida, papel, true, false, false, usuario);
					} else if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_COMPLETA) {
						ImprimirFacturaCartaOficio(salida, papel, false, true, false, usuario);
					} else if (salida.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_SEMICOMPLETA) {
						ImprimirFacturaCartaOficio(salida, papel, false, false, true, usuario);
					}
				} else if (salida.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_ROLLO) {
					var alto;
					if (salida.detallesVenta.length <= 2) {
						alto = 610;
					} else {
						alto = 610 + (20 * (salida.detallesVenta.length - 2))
					}
					papel = [227, alto];

					if (esAccionGuardar && !salida.configuracion.imprimir_al_guardar) {
						if (usuario.empresa.usar_pedidos) {
							var sizeY = 230 + (20 * salida.detallesVenta.length);
							doc = new PDFDocument({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							stream = doc.pipe(blobStream());
							ImprimirPedido(salida, esAccionGuardar, doc, stream, sizeY);
						}
					} else {
						doc = new PDFDocument({ size: papel, margins: { top: 0, bottom: 0, left: 20, right: 20 } });
						stream = doc.pipe(blobStream());
						ImprimirFacturaRollo(salida, papel, doc, stream, usuario);
						if (usuario.empresa.usar_pedidos) {
							var sizeY = 230 + (20 * salida.detallesVenta.length);
							doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							ImprimirPedido(salida, esAccionGuardar, doc, stream, sizeY);
						}
					}

					if (doc && stream) {
						doc.end();
						stream.on('finish', function () {
							var fileURL = stream.toBlobURL('application/pdf');
							var w = window.open(fileURL, '_blank', 'location=no');
							$timeout(function () {
								w.print();
							}, 500);
						});
					}
				}
			};
			return res;
		}])

	.factory('ImprimirFacturaCartaOficio', ['blockUI', 'VerificarDescuentos', 'Diccionario', 'DibujarCabeceraFacturaNVCartaOficio', 'DibujarCabeceraFacturaNVmedioOficio', '$timeout',
		function (blockUI, VerificarDescuentos, Diccionario, DibujarCabeceraFacturaNVCartaOficio, DibujarCabeceraFacturaNVmedioOficio, $timeout) {
			var res = function (venta, papel, vacia, completa, semicompleta, usuario) {
				var doc = new PDFDocument({ size: papel, margin: 10 });
				var stream = doc.pipe(blobStream());

				if (venta.configuracion.usar_pf) {
					var itemsPorPagina = 0;
					if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
						itemsPorPagina = 19;
					} else if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
						itemsPorPagina = 16;
					} else if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
						itemsPorPagina = 3;
					}
					var y = 240, items = 0, pagina = 1, totalPaginas = Math.ceil(venta.detallesVenta.length / itemsPorPagina);
					DibujarCabeceraFacturaNVCartaOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario);
					for (var i = 0; i < venta.detallesVenta.length && items <= itemsPorPagina; i++) {
						doc.font('Helvetica', 8);
						venta.detallesVenta[i].fecha_vencimiento = new Date(venta.detallesVenta[i].fecha_vencimiento);
						var fechaVencimientoTexto = venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear().toString().substring(2);
						doc.text(venta.detallesVenta[i].producto.codigo, 55, y, { width: 70 });
						doc.text(venta.detallesVenta[i].cantidad, 130, y);
						doc.text(venta.detallesVenta[i].producto.unidad_medida, 155, y - 3, { width: 43 });
						var longitudCaracteres = venta.detallesVenta[i].producto.nombre.length;
						var yDesc = (longitudCaracteres <= 24) ? y : ((longitudCaracteres > 24 && longitudCaracteres <= 60) ? y - 4 : y - 11);
						doc.text(venta.detallesVenta[i].producto.nombre, 198, yDesc, { width: 130 });
						doc.text(fechaVencimientoTexto, 340, y);
						doc.text(venta.detallesVenta[i].lote, 380, y);
						doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 410, y);
						doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
						doc.text(venta.detallesVenta[i].descuento.toFixed(2), 490, y);
						doc.text(venta.detallesVenta[i].total.toFixed(2), 530, y);
						if (completa || vacia) {
							doc.rect(50, y - 15, 520, 30).stroke();
						}
						y = y + 30;

						items++;

						if (items == itemsPorPagina) {
							doc.addPage({ size: papel, margin: 10 });
							y = 240;
							items = 0;
							pagina = pagina + 1;
							DibujarCabeceraFacturaNVCartaOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario);
						}
					}
					if (completa || vacia) {
						doc.font('Helvetica-Bold', 8);
						doc.text("TOTAL", 455, y);
					}
					doc.font('Helvetica', 8);
					doc.text(venta.total.toFixed(2), 520, y);

					doc.text("SON : " + venta.numero_literal, 55, y);

					if (completa || vacia) {
						doc.rect(50, y - 15, 520, 30).stroke();
					}
					var fechaActual = new Date();
					var min = fechaActual.getMinutes();
					if (min < 10) {
						min = "0" + min;
					}

					doc.text("usuario : " + usuario.nombre_usuario, 55, y + 20);
					doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 180, y + 20);

				} else {
					var canvas = document.getElementById('qr-code');
					// draw some text
					var existenDescuentos = VerificarDescuentos(venta.detallesVenta);

					doc.font('Helvetica', 8);
					var itemsPorPagina = 0;
					if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
						itemsPorPagina = 19;
					} else if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
						itemsPorPagina = 16;
					} else if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
						itemsPorPagina = 3;
					}
					var y = 240, items = 0, pagina = 1, totalPaginas = Math.ceil(venta.detallesVenta.length / itemsPorPagina);
					DibujarCabeceraFacturaNVmedioOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario);
					for (var i = 0; i < venta.detallesVenta.length && items <= itemsPorPagina; i++) {
						doc.font('Helvetica', 8);
						if (existenDescuentos) {
							doc.text(venta.detallesVenta[i].producto.codigo, 55, y);
							doc.text(venta.detallesVenta[i].cantidad, 115, y);
							doc.text(venta.detallesVenta[i].producto.unidad_medida, 140, y);
							doc.text(venta.detallesVenta[i].producto.nombre, 180, y - 6, { width: 120 });
							doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 300, y);
							doc.text(venta.detallesVenta[i].importe.toFixed(2), 335, y);
							doc.text(venta.detallesVenta[i].tipo_descuento ? "%" : "Bs", 385, y - 10);
							doc.text(venta.detallesVenta[i].descuento.toFixed(2), 385, y);
							doc.text(venta.detallesVenta[i].tipo_recargo ? "%" : "Bs", 420, y - 10);
							doc.text(venta.detallesVenta[i].recargo.toFixed(2), 420, y);
							doc.text(venta.detallesVenta[i].ice.toFixed(2), 455, y);
							doc.text(venta.detallesVenta[i].excento.toFixed(2), 490, y);
							doc.text(venta.detallesVenta[i].total.toFixed(2), 520, y);
						} else {
							doc.text(venta.detallesVenta[i].producto.codigo, 55, y);
							doc.text(venta.detallesVenta[i].cantidad, 110, y);
							doc.text(venta.detallesVenta[i].producto.unidad_medida, 165, y);
							var longitudCaracteres = venta.detallesVenta[i].producto.nombre.length;
							var yDesc = (longitudCaracteres <= 45) ? y : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? y - 4 : y - 11);
							doc.text(venta.detallesVenta[i].producto.nombre, 220, yDesc, { width: 225 });
							doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 450, y);
							doc.text(venta.detallesVenta[i].total.toFixed(2), 520, y);
						}
						if (completa || vacia) {
							doc.rect(50, y - 15, 520, 30).stroke();
						}
						y = y + 30;
						items++;

						if (items > itemsPorPagina) {
							doc.addPage({ size: papel, margin: 10 });
							y = 240;
							items = 0;
							pagina = pagina + 1;
							DibujarCabeceraFacturaNVmedioOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario);
						}
					}
					if (completa || vacia) {
						doc.font('Helvetica-Bold', 8);
						doc.text("TOTAL", 455, y);
					}
					doc.font('Helvetica', 8);
					doc.text(venta.total.toFixed(2), 520, y);

					doc.text("SON : " + venta.numero_literal, 55, y);


					doc.text("CÓDIGO DE CONTROL : " + venta.codigo_control, 55, y + 30);
					venta.fecha_limite_emision = new Date(venta.fecha_limite_emision);
					doc.text("FECHA LÍMITE DE EMISIÓN: " + venta.fecha_limite_emision.getDate() + "/" + (venta.fecha_limite_emision.getMonth() + 1) + "/" + venta.fecha_limite_emision.getFullYear(), 55, y + 60);

					if (completa || vacia) {
						doc.rect(50, y - 15, 520, 30).stroke();
						doc.rect(50, y + 25, 400, 20).stroke();
						doc.rect(50, y + 55, 400, 20).stroke();
					}

					qr.canvas({
						canvas: canvas,
						value: usuario.empresa.nit + "|" + venta.factura + "|" + venta.autorizacion + "|" + venta.fechaTexto + "|" + venta.total.toFixed(2) + "|" + venta.total.toFixed(2) + "|" + venta.codigo_control + "|" + venta.cliente.nit + "|" + "0" + "|" + "0" + "|" + "0" + "|" + "0"
					}, function () { });
					var qrImage = canvas.toDataURL('image/png');
					doc.image(qrImage, 470, y + 20, { width: 70, height: 70 });
					if (completa || vacia) {
						doc.text(venta.pieFactura.nombre, 50, papel[1] - 60);
						doc.text("\"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS. EL USO ILICITO DE ESTA SERA SANCIONADO DE ACUERDO A LEY\"", 50, papel[1] - 40);
					}
				}

				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					var w = window.open(fileURL, '_blank', 'location=no');
					$timeout(function () {
						w.print();
					}, 500);
				});
				blockUI.stop();
			};
			return res;
		}])

	.factory('DibujarCabeceraFacturaNVCartaOficio', [function () {
		var res = function (doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario) {
			if (vacia) {
				if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 50, { width: 50, height: 50 }); }
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social.toUpperCase(), 60, 105);
				doc.font('Helvetica', 7);
				doc.text(venta.sucursal.nombre.toUpperCase(), 60, 113);
				doc.text(venta.sucursal.direccion.toUpperCase(), 60, 121);
				var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
					(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
					(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
				doc.text("TELF.: " + telefono, 60, 129);
				doc.text("COCHABAMBA - BOLIVIA", 60, 137);
			}
			doc.font('Helvetica-Bold', 16);
			doc.text("PROFORMA NV", 250, 100);
			doc.font('Helvetica-Bold', 8);

			if (completa || vacia) {

				doc.text("Nro. ", 480, 60);

			}
			doc.text(venta.factura, 500, 60);
			doc.text(venta.tipoPago.nombre_corto, 485, 70);

			if (completa || vacia) {
				doc.rect(50, 150, 520, 50).stroke();
				doc.text("FECHA : ", 60, 165);
				doc.text("SEÑOR(ES) : ", 60, 175);
				doc.text("NIT : ", 360, 165);
			}
			doc.text(venta.fechaTexto, 120, 165);
			doc.text(venta.cliente.razon_social, 120, 175);
			doc.text(venta.cliente.nit, 400, 165);

			if (completa || vacia) {
				doc.rect(50, 200, 520, 25).stroke();
				//doc.rect(50,225,520,papel[1]-175-225).stroke();
				doc.text("CODIGO", 55, 210, { width: 70 });
				doc.text("CANT.", 125, 210);
				doc.text("UNID.", 160, 210, { width: 43 });
				doc.text("DETALLE", 198, 210);
				doc.text("VENC.", 340, 210);
				doc.text("LOTE", 380, 210);
				doc.text("P.UNIT.", 410, 210);
				doc.text("IMP.", 450, 210);
				doc.text("DESC.", 490, 210);
				doc.text("TOTAL", 530, 210);
			}
			doc.font('Helvetica', 7);

			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 500, papel[1] - 60);
		};
		return res;
	}])

	.factory('DibujarCabeceraFacturaNVmedioOficio', ['VerificarDescuentos', function (VerificarDescuentos) {
		var res = function (doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario) {
			if (vacia) {
				if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 50, { width: 50, height: 50 }); }
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social.toUpperCase(), 60, 105);
				doc.font('Helvetica', 7);
				doc.text(venta.sucursal.nombre.toUpperCase(), 60, 113);
				doc.text(venta.sucursal.direccion.toUpperCase(), 60, 121);
				var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
					(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
					(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
				doc.text("TELF.: " + telefono, 60, 129);
				doc.text("COCHABAMBA - BOLIVIA", 60, 137);
			}
			doc.font('Helvetica-Bold', 16);
			doc.text(venta.configuracion.tituloFactura.nombre.toUpperCase(), 250, 100);
			doc.font('Helvetica-Bold', 8);
			doc.text(venta.actividad.nombre, 380, 105, { width: 200 });
			if (completa || vacia) {
				doc.rect(380, 50, 190, 50).stroke();
				doc.text("NIT : ", 390, 60);
				doc.text("FACTURA No : ", 390, 70);
				doc.text("AUTORIZACIÓN No : ", 390, 80);
			}
			doc.text(usuario.empresa.nit, 500, 60);
			doc.text(venta.factura, 500, 70);
			doc.text(venta.autorizacion, 500, 80);
			if (completa || vacia) {
				doc.rect(50, 150, 520, 50).stroke();
				doc.text("FECHA : ", 60, 165);
				doc.text("SEÑOR(ES) : ", 60, 175);
				doc.text("NIT : ", 360, 165);
			}
			doc.text(venta.fechaTexto, 120, 165);
			doc.text(venta.cliente.razon_social, 120, 175);
			doc.text(venta.cliente.nit, 400, 165);
			if (completa || vacia) {
				doc.rect(50, 200, 520, 25).stroke();
				//doc.rect(50,225,520,papel[1]-175-225).stroke();
				var existenDescuentos = VerificarDescuentos(venta.detallesVenta);
				if (existenDescuentos) {
					doc.text("CODIGO", 55, 210);
					doc.text("CANT.", 110, 210);
					doc.text("UNID.", 140, 210);
					doc.text("DETALLE", 180, 210);
					doc.text("P. UNIT.", 300, 210);
					doc.text("IMPORTE", 335, 210);
					doc.text("DESC.", 385, 210);
					doc.text("REC.", 420, 210);
					doc.text("ICE", 455, 210);
					doc.text("EXC.", 490, 210);
					doc.text("TOTAL", 520, 210);
				} else {
					doc.text("CODIGO", 55, 210);
					doc.text("CANTIDAD", 110, 210);
					doc.text("UNIDAD", 165, 210);
					doc.text("DETALLE", 220, 210);
					doc.text("P.UNIT.", 450, 210);
					doc.text("TOTAL", 520, 210);
				}
			}
		};
		return res;
	}])

	.factory('ImprimirPedido', [function () {
		var res = function (venta, esAccionGuardar, doc, stream, sizeY) {


			for (var j = 0; j < venta.sucursal.copias_impresion_pedido; j++) {
				if (j != 0) {
					doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
				}
				doc.font('Helvetica-Bold', 14);
				doc.text("Nro. Pedido : " + venta.pedido + "", { align: 'left' });
				doc.font('Helvetica', 12);
				doc.text(venta.sucursal.frase_pedido + " : " + venta.factura, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("Cliente : " + venta.cliente.razon_social, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("NIT/CI : " + venta.cliente.nit, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("Total Transacción : " + venta.total.toFixed(2), { align: 'left' });

				doc.moveDown(0.2);
				doc.text("---------------------------------------------", { align: 'center' });
				doc.moveDown(0.2);
				doc.text("Cant.   Producto         Subtotal", { align: 'left' });
				doc.moveDown(0.2);
				doc.text("---------------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				var y = doc.y, sumaDescuento = 0, sumaRecargo = 0, sumaIce = 0, sumaExcento = 0;
				doc.fontSize(10);
				for (var i = 0; i < venta.detallesVenta.length; i++) {
					doc.text(venta.detallesVenta[i].cantidad, 20, y);
					if (venta.detallesVenta[i].producto.nombre.length > 40) {
						doc.fontSize(9);
					}
					doc.text(venta.detallesVenta[i].producto.nombre, 70, y, { width: 100 });
					doc.text(venta.detallesVenta[i].total.toFixed(2), 150, y);
					doc.fontSize(10);
					y = y + 20;
				}
				doc.moveDown(4);
				doc.x = 0;
				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.text(" Fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min + "  ", { align: 'center' });
			}
			if (venta.sucursal.imprimir_pedido_corto) {
				doc.addPage({ size: [227, 250], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
				doc.font('Helvetica-Bold', 14);
				doc.text("Nro. Pedido : " + venta.pedido + "", { align: 'left' });
				doc.font('Helvetica', 12);
				doc.text(venta.sucursal.frase_pedido + " : " + venta.factura, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("Cliente : " + venta.cliente.razon_social, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("NIT/CI : " + venta.cliente.nit, { align: 'left' });
			}
		}
		return res;
	}])

	.factory('ImprimirFacturaRollo', ['blockUI', function (blockUI) {
		var res = function (venta, papel, doc, stream, usuario) {
			if (venta.configuracion.usar_pf) {
				var canvas = document.getElementById('qr-code');
				doc.moveDown(2);
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.font('Helvetica', 7);
				doc.text(venta.sucursal.nombre.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.text(venta.sucursal.direccion.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
					(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
					(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.textlefono3 : "");
				doc.text("TELF.: " + telefono, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
				doc.moveDown(0.5);
				doc.font('Helvetica-Bold', 8);
				doc.text("PROFORMA NV", { align: 'center' });
				doc.font('Helvetica', 7);
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				doc.text("Nro.  " + venta.factura, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				doc.text(venta.tipoPago.nombre_corto, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.6);
				doc.text("FECHA : " + venta.fechaTexto, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("SEÑOR(ES) : " + venta.cliente.razon_social, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("NIT/CI : " + venta.cliente.nit, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("---------------------------------------------------------------------------------", { align: 'center' });
				doc.moveDown(0.2);
				doc.text("CANT   CONCEPTO                                   P. UNIT.    SUBTOTAL", { align: 'left' });
				doc.moveDown(0.2);
				doc.text("---------------------------------------------------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				var y = doc.y, sumaDescuento = 0, sumaRecargo = 0, sumaIce = 0, sumaExcento = 0;
				for (var i = 0; i < venta.detallesVenta.length; i++) {
					doc.text(venta.detallesVenta[i].cantidad, 15, y);
					if (venta.detallesVenta[i].producto.nombre.length > 40) {
						doc.fontSize(6);
					}
					doc.text(venta.detallesVenta[i].producto.nombre, 35, y, { width: 100 });
					doc.fontSize(7);
					doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 145, y);
					doc.text(venta.detallesVenta[i].importe.toFixed(2), 180, y);
					sumaDescuento = sumaDescuento + (venta.detallesVenta[i].tipo_descuento ? (venta.detallesVenta[i].importe * (venta.detallesVenta[i].descuento / 100)) : venta.detallesVenta[i].descuento);
					sumaRecargo = sumaRecargo + (venta.detallesVenta[i].tipo_recargo ? (venta.detallesVenta[i].importe * (venta.detallesVenta[i].recargo / 100)) : venta.detallesVenta[i].recargo);
					sumaIce = sumaIce + venta.detallesVenta[i].ice;
					sumaExcento = sumaExcento + venta.detallesVenta[i].excento;
					y = y + 20;
				}
				doc.text("--------------", 10, y, { align: 'right' });
				//oc.text("--------------------",{align:'right'});
				doc.moveDown(0.4);
				doc.text("IMPORTE TOTAL Bs.              " + venta.importe.toFixed(2), { align: 'right' });
				doc.moveDown(0.3);
				if (sumaDescuento > 0) {
					doc.text("DESCUENTO Bs.              " + sumaDescuento.toFixed(2), { align: 'right' });
				}
				doc.moveDown(0.3);
				if (sumaRecargo > 0) {
					doc.text("RECARGO Bs.              " + sumaRecargo.toFixed(2), { align: 'right' });
				}
				doc.moveDown(0.3);
				if (sumaIce > 0) {
					doc.text("ICE Bs.              " + sumaIce.toFixed(2), { align: 'right' });
				}
				doc.moveDown(0.3);
				if (sumaExcento > 0) {
					doc.text("EXCENTO Bs.              " + sumaExcento.toFixed(2), { align: 'right' });
				}
				doc.moveDown(0.3);
				doc.text("TOTAL Bs.              " + venta.total.toFixed(2), { align: 'right' });
				doc.moveDown(0.4);
				doc.moveDown(0.4);
				doc.text("SON: " + venta.numero_literal, { align: 'left' });
				doc.moveDown(0.6);
				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.text("usuario : " + usuario.nombre_usuario, 0, y + 205, { align: 'right' });
				doc.moveDown(0.4);
				doc.text("fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min, 10, y + 215, { align: 'right' });

			} else {
				var canvas = document.getElementById('qr-code');
				// draw some text
				doc.moveDown(1);
				if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 75, doc.y, { align: 'center', width: 80, height: 50 }); }
				doc.y = 40;
				doc.moveDown(2);
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social.toUpperCase(), 35, doc.y, { align: 'center', width: 150 });
				//doc.text($scope.usuario.empresa.razon_social.toUpperCase(),{align:'center'});		
				doc.moveDown(0.4);
				doc.font('Helvetica', 7);
				doc.text(venta.sucursal.nombre.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.text(venta.sucursal.direccion.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
					(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
					(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
				doc.text("TELF.: " + telefono, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
				doc.moveDown(0.5);
				doc.font('Helvetica-Bold', 8);
				doc.text(venta.configuracion.tituloFactura.nombre.toUpperCase(), { align: 'center' });
				doc.font('Helvetica', 7);
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				doc.text("NIT: " + usuario.empresa.nit, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("FACTURA No: " + venta.factura, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("AUTORIZACIÓN No: " + venta.autorizacion, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				doc.text(venta.actividad.nombre, { align: 'center', width: 150 });
				doc.x = 20;
				doc.moveDown(0.6);
				doc.text("FECHA : " + venta.fechaTexto, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("SEÑOR(ES) : " + venta.cliente.razon_social, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("NIT/CI : " + venta.cliente.nit, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("--------------------------------------------------------------------------------", { align: 'center' });
				doc.moveDown(0.2);
				doc.text("CANT   CONCEPTO                    P. UNIT.    SUBTOTAL", { align: 'left' });
				doc.moveDown(0.2);
				doc.text("--------------------------------------------------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				var y = doc.y, sumaDescuento = 0, sumaRecargo = 0, sumaIce = 0, sumaExcento = 0;
				for (var i = 0; i < venta.detallesVenta.length; i++) {
					doc.text(venta.detallesVenta[i].cantidad, 20, y);
					if (venta.detallesVenta[i].producto.nombre.length > 40) {
						doc.fontSize(6);
					}
					doc.text(venta.detallesVenta[i].producto.nombre, 40, y, { width: 100 });
					doc.fontSize(7);
					doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 150, y);
					doc.text(venta.detallesVenta[i].importe.toFixed(2), 175, y);
					sumaDescuento = sumaDescuento + (venta.detallesVenta[i].tipo_descuento ? (venta.detallesVenta[i].importe * (venta.detallesVenta[i].descuento / 100)) : venta.detallesVenta[i].descuento);
					sumaRecargo = sumaRecargo + (venta.detallesVenta[i].tipo_recargo ? (venta.detallesVenta[i].importe * (venta.detallesVenta[i].recargo / 100)) : venta.detallesVenta[i].recargo);
					sumaIce = sumaIce + venta.detallesVenta[i].ice;
					sumaExcento = sumaExcento + venta.detallesVenta[i].excento;
					y = y + 20;
				}
				doc.x = 20;
				doc.text("--------------", { align: 'right' });
				doc.moveDown(0.4);
				doc.text("IMPORTE TOTAL Bs.         " + venta.importe.toFixed(2), 90, doc.y/*,{align:'right'}*/);
				doc.moveDown(0.3);
				if (sumaDescuento > 0) {
					doc.text("DESCUENTO Bs.              " + sumaDescuento.toFixed(2), 97, doc.y);
				}
				doc.moveDown(0.3);
				if (sumaRecargo > 0) {
					doc.text("RECARGO Bs.              " + sumaRecargo.toFixed(2), 105, doc.y);
				}
				doc.moveDown(0.3);
				if (sumaIce > 0) {
					doc.text("ICE Bs.              " + sumaIce.toFixed(2), 128, doc.y);
				}
				doc.moveDown(0.3);
				if (sumaExcento > 0) {
					doc.text("EXCENTO Bs.              " + sumaExcento.toFixed(2), 107, doc.y);
				}
				doc.moveDown(0.3);
				doc.text("TOTAL Bs.         " + venta.total.toFixed(2), 124, doc.y/*,{align:'right'}*/);
				doc.x = 20;
				doc.moveDown(0.4);
				doc.moveDown(0.4);
				doc.text("SON: " + venta.numero_literal, { align: 'left' });
				doc.moveDown(0.6);
				doc.text("CÓDIGO DE CONTROL: " + venta.codigo_control, { align: 'center' });
				doc.moveDown(0.4);
				venta.fecha_limite_emision = new Date(venta.fecha_limite_emision);
				doc.text("FECHA LÍMITE DE EMISIÓN: " + venta.fecha_limite_emision.getDate() + "/" + (venta.fecha_limite_emision.getMonth() + 1) + "/" + venta.fecha_limite_emision.getFullYear(), { align: 'center' });
				doc.moveDown(0.4);
				qr.canvas({
					canvas: canvas,
					value: usuario.empresa.nit + "|" + venta.factura + "|" + venta.autorizacion + "|" + venta.fechaTexto + "|" + venta.total.toFixed(2) + "|" + venta.total.toFixed(2) + "|" + venta.codigo_control + "|" + venta.cliente.nit + "|" + "0" + "|" + "0" + "|" + "0" + "|" + "0"
				}, function () { });
				var qrImage = canvas.toDataURL('image/png');
				doc.image(qrImage, 70, doc.y/*y+110*/, { width: 85, height: 85 });
				doc.moveDown(0.4);
				doc.text(venta.pieFactura.nombre/*,0,doc.y*/, { align: 'center', width: 150 });
				doc.moveDown(0.6);
				doc.text("\"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS. EL USO ILICITO DE ESTA SERA SANCIONADO DE ACUERDO A LEY\"", { align: 'center', width: 150 });
				doc.moveDown(0.4);
				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.text("  Usuario : " + usuario.nombre_usuario + " -- Fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min + "  ", { align: 'center' });
			}
			blockUI.stop();
		}
		return res;
	}])

	.factory('ImprimirProforma', ['Diccionario', 'ImprimirProformaCartaOficio', 'ImprimirPedido', 'ImprimirProformaRollo', '$timeout',
		function (Diccionario, ImprimirProformaCartaOficio, ImprimirPedido, ImprimirProformaRollo, $timeout) {
			var res = function (venta, esAccionGuardar, usuario) {
				var papel, doc, stream;
				if (venta.configuracion.tamanoPapelNotaVenta.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
					papel = [612, 936];
					if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_VACIA) {
						ImprimirProformaCartaOficio(venta, papel, true, false, false, usuario);
					} else if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_COMPLETA) {
						ImprimirProformaCartaOficio(venta, papel, false, true, false, usuario);
					} else if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_SEMICOMPLETA) {
						ImprimirProformaCartaOficio(venta, papel, false, false, true, usuario);
					}
				} else if (venta.configuracion.tamanoPapelNotaVenta.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
					papel = [612, 792];
					if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_VACIA) {
						ImprimirProformaCartaOficio(venta, papel, true, false, false, usuario);
					} else if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_COMPLETA) {
						ImprimirProformaCartaOficio(venta, papel, false, true, false, usuario);
					} else if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_SEMICOMPLETA) {
						ImprimirProformaCartaOficio(venta, papel, false, false, true, usuario);
					}
				} else if (venta.configuracion.tamanoPapelNotaVenta.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
					papel = [612, 468];
					if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_VACIA) {
						ImprimirProformaCartaOficio(venta, papel, true, false, false, usuario);
					} else if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_COMPLETA) {
						ImprimirProformaCartaOficio(venta, papel, false, true, false, usuario);
					} else if (venta.configuracion.impresionFactura.nombre_corto == Diccionario.FACT_IMPRESION_SEMICOMPLETA) {
						ImprimirProformaCartaOficio(venta, papel, false, false, true, usuario);
					}
				} else if (venta.configuracion.tamanoPapelNotaVenta.nombre_corto == Diccionario.FACT_PAPEL_ROLLO) {
					var alto;
					if (venta.detallesVenta.length <= 2) {
						alto = 400;
					} else {
						alto = 400 + (20 * (venta.detallesVenta.length - 2))
					}
					papel = [227, alto];

					if (esAccionGuardar && !venta.configuracion.imprimir_al_guardar) {
						if (usuario.empresa.usar_pedidos) {
							var sizeY = 230 + (20 * venta.detallesVenta.length);
							doc = new PDFDocument({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							stream = doc.pipe(blobStream());
							ImprimirPedido(venta, esAccionGuardar, doc, stream, sizeY);
						}
					} else {
						doc = new PDFDocument({ size: papel, margins: { top: 0, bottom: 0, left: 20, right: 20 } });
						stream = doc.pipe(blobStream());
						ImprimirProformaRollo(venta, papel, doc, stream, usuario);
						if (usuario.empresa.usar_pedidos) {
							var sizeY = 230 + (20 * venta.detallesVenta.length);
							doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							ImprimirPedido(venta, esAccionGuardar, doc, stream, sizeY);
						}
					}

					if (doc && stream) {
						doc.end();
						stream.on('finish', function () {
							var fileURL = stream.toBlobURL('application/pdf');
							var w = window.open(fileURL, '_blank', 'location=no');
							$timeout(function () {
								w.print();
							}, 500);
						});
					}
				}
			}
			return res;
		}])

	.factory('ImprimirProformaCartaOficio', ['Diccionario', '$timeout', 'blockUI', 'VerificarDescuentos', 'DibujarCabeceraProformaNVmedioOficio',
		function (Diccionario, $timeout, blockUI, VerificarDescuentos, DibujarCabeceraProformaNVmedioOficio) {
			var res = function (venta, papel, vacia, completa, semicompleta, usuario) {
				var doc = new PDFDocument({ size: papel, margin: 10 });
				var stream = doc.pipe(blobStream());
				//var canvas=document.getElementById('qr-code');
				// draw some text
				var existenDescuentos = VerificarDescuentos(venta.detallesVenta);

				doc.font('Helvetica', 8);
				var itemsPorPagina = 0;
				if (venta.configuracion.tamanoPapelNotaVenta.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
					itemsPorPagina = 19;
				} else if (venta.configuracion.tamanoPapelNotaVenta.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
					itemsPorPagina = 16;
				} else if (venta.configuracion.tamanoPapelNotaVenta.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
					itemsPorPagina = 3;
				}
				var y = 240, items = 0, pagina = 1, totalPaginas = Math.ceil(venta.detallesVenta.length / itemsPorPagina);
				DibujarCabeceraProformaNVmedioOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario);
				doc.font('Helvetica', 7);

				for (var i = 0; i < venta.detallesVenta.length && items <= itemsPorPagina; i++) {
					venta.detallesVenta[i].fecha_vencimiento = new Date(venta.detallesVenta[i].fecha_vencimiento)
					if (existenDescuentos) {
						doc.text(venta.detallesVenta[i].producto.codigo, 55, y, { width: 50 });
						doc.text(venta.detallesVenta[i].cantidad, 105, y);
						doc.text(venta.detallesVenta[i].producto.unidad_medida, 120, y, { width: 40 });
						doc.text(venta.detallesVenta[i].producto.nombre, 160, y - 9, { width: 80 });
						if (usuario.empresa.usar_vencimientos) {
							doc.text(venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear(), 245, y);
							doc.text(venta.detallesVenta[i].lote, 285, y);
						}
						doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 310, y);
						doc.text(venta.detallesVenta[i].importe.toFixed(2), 345, y);
						doc.text(venta.detallesVenta[i].descuento.toFixed(2), 395, y);
						doc.text(venta.detallesVenta[i].recargo.toFixed(2), 430, y);
						doc.text(venta.detallesVenta[i].ice.toFixed(2), 465, y);
						doc.text(venta.detallesVenta[i].excento.toFixed(2), 500, y);
						doc.text(venta.detallesVenta[i].total.toFixed(2), 530, y);
					} else {
						doc.text(venta.detallesVenta[i].producto.codigo, 55, y);
						doc.text(venta.detallesVenta[i].cantidad, 130, y);
						doc.text(venta.detallesVenta[i].producto.unidad_medida, 160, y);
						doc.text(venta.detallesVenta[i].producto.nombre, 200, y - 9, { width: 150 });
						if (usuario.empresa.usar_vencimientos) {
							doc.text(venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear(), 360, y);
							doc.text(venta.detallesVenta[i].lote, 415, y);
						}
						doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 460, y);
						doc.text(venta.detallesVenta[i].total.toFixed(2), 520, y);
					}
					if (completa || vacia) {
						doc.rect(50, y - 15, 520, 30).stroke();
					}
					y = y + 30;
					items++;

					if (items == itemsPorPagina) {
						doc.addPage({ size: papel, margin: 10 });
						y = 240;
						items = 0;
						pagina = pagina + 1;
						DibujarCabeceraProformaNVmedioOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario)
					}
				}
				if (completa || vacia) {
					doc.font('Helvetica-Bold', 7);
					doc.text("TOTAL", 455, y - 5);
				}
				doc.font('Helvetica', 7);
				doc.text(venta.total.toFixed(2), 520, y - 5);

				doc.text("SON : " + venta.numero_literal, 55, y - 5);

				if (completa || vacia) {
					doc.rect(50, y - 15, 520, 20).stroke();
				}

				if (completa || vacia) {
					//doc.text(venta.configuracion.pieFactura.nombre,50,y+100);
					//doc.text("\"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAIS. EL USO ILICITO DE ESTA SERA SANCIONADO DE ACUERDO A LEY\"",50,y+110);
				}
				doc.moveDown(2);
				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.text("  Usuario : " + usuario.nombre_usuario + " -- Fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min + "  ", { align: 'center' });

				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					var w = window.open(fileURL, '_blank', 'location=no');
					$timeout(function () {
						w.print();
					}, 500);
				});
				blockUI.stop();
			}
			return res;
		}])

	.factory('DibujarCabeceraProformaNVmedioOficio', ['VerificarDescuentos',
		function (VerificarDescuentos) {
			var res = function (doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario) {
				if (vacia) {
					if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 50, { width: 50, height: 50 }); }
					doc.font('Helvetica-Bold', 8);
					doc.text(usuario.empresa.razon_social.toUpperCase(), 120, 60);
					doc.font('Helvetica', 7);
					doc.text(venta.sucursal.nombre.toUpperCase(), 120, 70);
					doc.text(venta.sucursal.direccion.toUpperCase(), 120, 80);
					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
					doc.text("TELF.: " + telefono, 120, 90);
					doc.text("COCHABAMBA - BOLIVIA", 120, 100);
				}
				doc.font('Helvetica-Bold', 16);
				doc.text('PROFORMA Nº ' + venta.factura, 200, 125);
				doc.font('Helvetica-Bold', 8);
				if (completa || vacia) {

				}
				if (completa || vacia) {
					doc.rect(50, 150, 520, 50).stroke();
					doc.text("FECHA : ", 60, 165);
					doc.text("SEÑOR(ES) : ", 60, 175);
					doc.text("NIT : ", 360, 165);
				}
				doc.font('Helvetica', 8);
				doc.text(venta.fechaTexto, 120, 165);
				doc.text(venta.cliente.razon_social, 120, 175);
				doc.text(venta.cliente.nit, 400, 165);
				doc.font('Helvetica-Bold', 7);
				if (completa || vacia) {
					doc.rect(50, 200, 520, 25).stroke();
					var existenDescuentos = VerificarDescuentos(venta.detallesVenta);
					if (existenDescuentos) {
						doc.text("CODIGO", 55, 210);
						doc.text("CANT.", 100, 210);
						doc.text("UNID.", 130, 210);
						doc.text("DETALLE", 160, 210);
						if (usuario.empresa.usar_vencimientos) {
							doc.text("VENC.", 245, 210)
							doc.text("LOTE.", 280, 210)
						}
						doc.text("P. UNIT.", 310, 210);
						doc.text("IMPORTE", 345, 210);
						doc.text("DESC.", 395, 210);
						doc.text("REC.", 430, 210);
						doc.text("ICE", 465, 210);
						doc.text("EXC.", 500, 210);
						doc.text("TOTAL", 530, 210);
					} else {
						doc.text("CODIGO", 55, 210);
						doc.text("CANTIDAD", 120, 210);
						doc.text("UNIDAD", 165, 210);
						doc.text("DETALLE", 200, 210);
						if (usuario.empresa.usar_vencimientos) {
							doc.text("VENC.", 360, 210)
							doc.text("LOTE.", 415, 210)
						}
						doc.text("P.UNIT.", 460, 210);
						doc.text("TOTAL", 520, 210);
					}
				}
			}
			return res;
		}])

	.factory('ImprimirProformaRollo', ['blockUI', function (blockUI) {
		var res = function (venta, papel, doc, stream, usuario) {
			doc.moveDown(2);
			doc.font('Helvetica-Bold', 8);
			doc.text(usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.font('Helvetica', 7);
			doc.text(venta.sucursal.nombre.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			doc.text(venta.sucursal.direccion.toUpperCase(), { align: 'center' });
			doc.moveDown(0.4);
			var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
				(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
				(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
			doc.text("TELF.: " + telefono, { align: 'center' });
			doc.moveDown(0.4);
			doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
			doc.moveDown(0.5);
			doc.font('Helvetica-Bold', 8);
			doc.text("PROFORMA Nº " + venta.factura, { align: 'center' });
			doc.font('Helvetica', 7);
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.text("------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			doc.moveDown(0.6);
			doc.text("FECHA : " + venta.fechaTexto, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("SEÑOR(ES) : " + venta.cliente.razon_social, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("NIT/CI : " + venta.cliente.nit, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.2);
			doc.text("CANT   CONCEPTO                                   P. UNIT.    SUBTOTAL", { align: 'left' });
			doc.moveDown(0.2);
			doc.text("---------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
			var y = doc.y, sumaDescuento = 0, sumaRecargo = 0, sumaIce = 0, sumaExcento = 0;
			for (var i = 0; i < venta.detallesVenta.length; i++) {
				doc.text(venta.detallesVenta[i].cantidad, 15, y);
				if (venta.detallesVenta[i].producto.nombre.length > 40) {
					doc.fontSize(6);
				}
				doc.text(venta.detallesVenta[i].producto.nombre, 35, y, { width: 100 });
				doc.fontSize(7);
				doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 145, y);
				doc.text(venta.detallesVenta[i].importe.toFixed(2), 180, y);
				sumaDescuento = sumaDescuento + (venta.detallesVenta[i].tipo_descuento ? (venta.detallesVenta[i].importe * (venta.detallesVenta[i].descuento / 100)) : venta.detallesVenta[i].descuento);
				sumaRecargo = sumaRecargo + (venta.detallesVenta[i].tipo_recargo ? (venta.detallesVenta[i].importe * (venta.detallesVenta[i].recargo / 100)) : venta.detallesVenta[i].recargo);
				sumaIce = sumaIce + venta.detallesVenta[i].ice;
				sumaExcento = sumaExcento + venta.detallesVenta[i].excento;
				y = y + 20;
			}
			doc.text("--------------", 10, y, { align: 'right' });
			//oc.text("--------------------",{align:'right'});
			doc.moveDown(0.4);
			doc.text("IMPORTE TOTAL Bs.              " + venta.importe.toFixed(2), { align: 'right' });
			doc.moveDown(0.3);
			if (sumaDescuento > 0) {
				doc.text("DESCUENTO Bs.              " + sumaDescuento.toFixed(2), { align: 'right' });
			}
			doc.moveDown(0.3);
			if (sumaRecargo > 0) {
				doc.text("RECARGO Bs.              " + sumaRecargo.toFixed(2), { align: 'right' });
			}
			doc.moveDown(0.3);
			if (sumaIce > 0) {
				doc.text("ICE Bs.              " + sumaIce.toFixed(2), { align: 'right' });
			}
			doc.moveDown(0.3);
			if (sumaExcento > 0) {
				doc.text("EXCENTO Bs.              " + sumaExcento.toFixed(2), { align: 'right' });
			}
			doc.moveDown(0.3);
			doc.text("TOTAL Bs.              " + venta.total.toFixed(2), { align: 'right' });
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.text("SON: " + venta.numero_literal, { align: 'left' });
			doc.moveDown(0.6);

			doc.moveDown(0.4);

			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);

			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.text("  Usuario : " + usuario.nombre_usuario + " -- Fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min + "  ", { align: 'center' });
			blockUI.stop();
		}
		return res;
	}])

	.factory('ImprimirNotaBaja', ['blockUI', 'Diccionario', 'ImprimirNotaBajaCartaOficio', 'ImprimirNotaBajaRollo',
		function (blockUI, Diccionario, ImprimirNotaBajaCartaOficio, ImprimirNotaBajaRollo) {
			var res = function (baja, usuario) {
				blockUI.start();
				var itemsPorPagina;
				if (baja.configuracion.tamanoPapelNotaBaja.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
					papel = [612, 936];
					itemsPorPagina = 23;
					ImprimirNotaBajaCartaOficio(baja, papel, itemsPorPagina, usuario);
				} else if (baja.configuracion.tamanoPapelNotaBaja.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
					papel = [612, 792];
					itemsPorPagina = 20;
					ImprimirNotaBajaCartaOficio(baja, papel, itemsPorPagina, usuario);
				} else if (baja.configuracion.tamanoPapelNotaBaja.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
					papel = [612, 468];
					itemsPorPagina = 10;
					ImprimirNotaBajaCartaOficio(baja, papel, itemsPorPagina, usuario);
				} else if (baja.configuracion.tamanoPapelNotaBaja.nombre_corto == Diccionario.FACT_PAPEL_ROLLO) {
					var alto, totalItems = baja.detallesVenta.length;
					if (totalItems <= 2) {
						alto = 440;
					} else {
						alto = 440 + (30 * (totalItems - 2))
					}
					papel = [227, alto];
					ImprimirNotaBajaRollo(baja, papel, usuario);
				}
			}
			return res;
		}])

	.factory('ImprimirNotaBajaCartaOficio', ['blockUI', 'VerificarDescuentos', 'DibujarCabeceraPDFBaja',
		function (blockUI, VerificarDescuentos, DibujarCabeceraPDFBaja) {
			var res = function (baja, papel, itemsPorPagina, usuario) {
				
				var doc = new PDFDocument({ size: papel, margin: 0 });
				var stream = doc.pipe(blobStream());
				var existenDescuentos = VerificarDescuentos(baja.detallesVenta);
				doc.font('Helvetica', 7);
				var totalAray = 0;
				var y = 140, items = 0, pagina = 1, totalPaginas = Math.ceil(baja.detallesVenta.length / itemsPorPagina);
				DibujarCabeceraPDFBaja(doc, 1, totalPaginas, baja, existenDescuentos, usuario);
				for (var i = 0; i < baja.detallesVenta.length && items <= itemsPorPagina; i++) {
					if (existenDescuentos) {
						doc.text(baja.detallesVenta[i].producto.codigo, 55, y);
						doc.text(baja.detallesVenta[i].cantidad, 110);
						doc.text(baja.detallesVenta[i].producto.unidad_medida, 135, y);
						doc.text(baja.detallesVenta[i].producto.nombre, 170, y - 6, { width: 120 });
						doc.text(baja.detallesVenta[i].producto.precio_unitario.toFixed(2), 300, y);
						doc.text(baja.detallesVenta[i].importe.toFixed(2), 335, y);
						doc.text(baja.detallesVenta[i].descuento.toFixed(2), 385, y);
						doc.text(baja.detallesVenta[i].recargo.toFixed(2), 420, y);
						doc.text(baja.detallesVenta[i].ice.toFixed(2), 455, y);
						doc.text(baja.detallesVenta[i].excento.toFixed(2), 490, y);
						doc.text(baja.detallesVenta[i].total.toFixed(2), 520, y);
					} else {
						doc.text(baja.detallesVenta[i].producto.codigo, 55, y, { width: 60 });
						doc.text(baja.detallesVenta[i].cantidad, 130, y, { width: 70 });
						doc.text(baja.detallesVenta[i].producto.unidad_medida, 153, y);

						var longitudCaracteres = baja.detallesVenta[i].producto.nombre.length;
						var yDesc = (longitudCaracteres <= 30) ? y : ((longitudCaracteres > 40 && longitudCaracteres <= 75) ? y : y - 7);
						if (usuario.empresa.usar_vencimientos) {
							doc.font('Helvetica', 6);
							doc.text(baja.detallesVenta[i].producto.nombre, 205, yDesc, { width: 160 });
							var fecha_vencimiento = new Date(baja.detallesVenta[i].inventario.fecha_vencimiento);
							doc.font('Helvetica', 7);
							doc.text(fecha_vencimiento.getDate() + "/" + (fecha_vencimiento.getMonth() + 1) + "/" + fecha_vencimiento.getFullYear(), 375, y);
							doc.text(baja.detallesVenta[i].inventario.lote, 435, y);
						} else {
							doc.text(baja.detallesVenta[i].producto.nombre, 210, yDesc, { width: 250 });
						}
						doc.text(baja.detallesVenta[i].producto.precio_unitario.toFixed(2), 470, y);
						doc.text(baja.detallesVenta[i].total.toFixed(2), 520, y);
					}
					doc.rect(50, y - 15, 520, 30).stroke();
					y = y + 30;
					items++;

					if (items == itemsPorPagina) {
						totalAray = totalAray + items;
						if (totalAray != baja.detallesVenta.length) {
							var currentDate = new Date();
							baja.fecha = new Date(baja.fecha);
							doc.font('Helvetica', 5);
							doc.text("EMISIÓN: " + baja.fecha.getDate() + "/" + (baja.fecha.getMonth() + 1) + "/" + baja.fecha.getFullYear(), 200, y);
							doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 260, y);
							doc.text("USUARIO: " + usuario.persona.nombre_completo, 55, y);

							doc.text(pagina + " de " + totalPaginas, 540, y - 10);
							doc.addPage({ margin: 0, bufferPages: true });

							y = 140;
							items = 0;
							pagina = pagina + 1;
							DibujarCabeceraPDFBaja(doc, 1, totalPaginas, baja, existenDescuentos, usuario);
						}
					}
				}
				doc.font('Helvetica-Bold', 7);
				doc.text("TOTAL", 465, y - 5);
				doc.font('Helvetica', 7);
				doc.text(baja.total.toFixed(2), 520, y - 5);
				doc.rect(50, y - 15, 520, 20).stroke();
				var currentDate = new Date();
				baja.fecha = new Date(baja.fecha);
				doc.font('Helvetica', 5);
				doc.text("EMISIÓN: " + baja.fecha.getDate() + "/" + (baja.fecha.getMonth() + 1) + "/" + baja.fecha.getFullYear(), 200, y + 10);
				doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 260, y + 10);
				doc.text("USUARIO: " + usuario.persona.nombre_completo, 55, y + 10);

				if (pagina > totalPaginas) {

				} else {
					doc.text(pagina + " de " + totalPaginas, 540, y + 10);
				}

				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			}
			return res;
		}])

	.factory('DibujarCabeceraPDFBaja', [function () {
		var res = function (doc, pagina, totalPaginas, baja, existenDescuentos, usuario) {
			doc.font('Helvetica-Bold', 7);
			doc.text(usuario.empresa.razon_social, 55, 55);
			doc.text("SUCURSAL: ", 55, 65);
			doc.text("DIRECCIÓN: ", 55, 75);

			var telefono = (baja.sucursal.telefono1 != null ? baja.sucursal.telefono1 : "") +
				(baja.sucursal.telefono2 != null ? "-" + baja.sucursal.telefono2 : "") +
				(baja.sucursal.telefono3 != null ? "-" + baja.sucursal.telefono3 : "");
			doc.text("TELF.: ", 55, 85);
			doc.font('Helvetica', 7);
			doc.text(baja.sucursal.nombre, 105, 65);
			doc.text(baja.sucursal.direccion, 105, 75);
			doc.text(telefono, 85, 85);
			doc.font('Helvetica-Bold', 15);
			doc.text("NOTA DE BAJA", 0, 65, { align: 'center' });
			doc.font('Helvetica-Bold', 7);
			baja.fecha = new Date(baja.fecha);
			doc.font('Helvetica', 11);
			doc.text("Fecha: " + baja.fecha.getDate() + "/" + (baja.fecha.getMonth() + 1) + "/" + baja.fecha.getFullYear(), 0, 85, { align: 'center' });
			doc.font('Helvetica-Bold', 7)
			doc.text("NRO. : " + baja.factura, 450, 75);
			doc.rect(50, 40, 520, 60).stroke();
			doc.rect(50, 100, 520, 25).stroke();
			if (existenDescuentos) {
				doc.text("CODIGO", 55, 110);
				doc.text("CANT.", 105, 110);
				doc.text("UNID.", 135, 110);
				doc.text("DETALLE", 170, 110);
				doc.text("P. UNIT.", 300, 110);
				doc.text("IMPORTE", 335, 110);
				doc.text("DESC.", 385, 110);
				doc.text("REC.", 420, 110);
				doc.text("ICE", 455, 110);
				doc.text("EXC.", 490, 110);
				doc.text("TOTAL", 520, 110);
			} else {
				doc.text("CODIGO", 55, 110);
				doc.text("CANTIDAD", 115, 110);
				doc.text("UNIDAD", 160, 110);

				if (usuario.empresa.usar_vencimientos) {
					doc.text("DETALLE", 210, 110);
					doc.text("FECHA VENC.", 370, 110);
					doc.text("LOTE", 430, 110);
				} else {
					doc.text("DETALLE", 210, 110);
				}
				doc.text("P.UNIT.", 470, 110);
				doc.text("TOTAL", 520, 110);
			}
		}
		return res;
	}])

	.factory('ImprimirNotaBajaRollo', ['blockUI', 'VerificarDescuentos',
		function (blockUI, VerificarDescuentos) {
			var res = function (baja, papel, usuario) {
				var doc = new PDFDocument({ size: papel, margins: { top: 10, bottom: 10, left: 10, right: 20 } });
				var stream = doc.pipe(blobStream());
				var existenDescuentos = VerificarDescuentos(baja.detallesVenta);
				doc.moveDown(2);
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.font('Helvetica', 7);
				doc.text(baja.sucursal.nombre.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.text(baja.sucursal.direccion.toUpperCase(), { align: 'center' });
				var telefono = (baja.sucursal.telefono1 != null ? baja.sucursal.telefono1 : "") +
					(baja.sucursal.telefono2 != null ? "-" + baja.sucursal.telefono2 : "") +
					(baja.sucursal.telefono3 != null ? "-" + baja.sucursal.telefono3 : "");
				doc.moveDown(0.4);
				doc.text("TELF.: " + telefono, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
				doc.moveDown(0.5);
				doc.font('Helvetica-Bold', 8);
				doc.text("NOTA DE BAJA", { align: 'center' });
				baja.fecha = new Date(baja.fecha);
				doc.font('Helvetica', 8);
				doc.text("Fecha: " + baja.fecha.getDate() + "/" + (baja.fecha.getMonth() + 1) + "/" + baja.fecha.getFullYear(), { align: 'center' });
				doc.font('Helvetica-Bold', 8);
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				doc.font('Helvetica-Bold', 7);
				var y = 165, items = 0;
				var longitudCaracteres;
				var yDesc;
				doc.moveDown(0.4);
				doc.text("COD.", 10, 145);
				doc.text("CANT.", 35, 145);
				doc.text("DETALL.", 60, 145);
				doc.text("F. VENC.", 128, 145);
				doc.text("LOTE", 162, 145);
				doc.text("TOTAL", 183, 145);
				doc.moveDown(0.4);
				for (var i = 0; i < baja.detallesVenta.length; i++) {
					doc.font('Helvetica', 7);
					doc.moveDown(0.4);
					doc.text(baja.detallesVenta[i].producto.codigo, 10, y, { width: 25 });
					doc.text(baja.detallesVenta[i].cantidad, 38, y);
					doc.text(baja.detallesVenta[i].producto.nombre, 57, y, { width: 70 });
					var fecha_vencimiento = new Date(baja.detallesVenta[i].inventario.fecha_vencimiento); console.log(new Date().getFullYear().toString().substr(-2));
					doc.text(fecha_vencimiento.getDate() + "/" + (fecha_vencimiento.getMonth() + 1) + "/" + fecha_vencimiento.getFullYear().toString().substr(-2), 128, y);
					doc.text(baja.detallesVenta[i].inventario.lote, 164, y);
					doc.text(baja.detallesVenta[i].total.toFixed(2), 187, y, { width: 100 });
					y = y + 30;
					items++;
				}
				var currentDate = new Date();
				baja.fecha = new Date(baja.fecha);
				doc.moveDown(0.4);
				doc.font('Helvetica', 6);
				doc.text("EMISIÓN: " + baja.fecha.getDate() + "/" + (baja.fecha.getMonth() + 1) + "/" + baja.fecha.getFullYear(), 150, y + 190);
				doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 15, y + 200);
				doc.text("USUARIO: " + usuario.persona.nombre_completo, 15, y + 190);
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			}
			return res;
		}])

	.factory('ImprimirNotaTraspaso', ['Diccionario', 'blockUI', 'ImprimirNotaTraspasoCartaOficio', 'ImprimirNotaTraspasoRollo',
		function (Diccionario, blockUI, ImprimirNotaTraspasoCartaOficio, ImprimirNotaTraspasoRollo) {
			var res = function (traspaso, usuario) {
				blockUI.start();
				if (traspaso.configuracion.tamanoPapelNotaTraspaso.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
					papel = [612, 936];
					itemsPorPagina = 19;
					ImprimirNotaTraspasoCartaOficio(traspaso, papel, itemsPorPagina, usuario);
				} else if (traspaso.configuracion.tamanoPapelNotaTraspaso.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
					papel = [612, 792];
					itemsPorPagina = 16;
					ImprimirNotaTraspasoCartaOficio(traspaso, papel, itemsPorPagina, usuario);
				} else if (traspaso.configuracion.tamanoPapelNotaTraspaso.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
					papel = [612, 468];
					itemsPorPagina = 9;
					ImprimirNotaTraspasoCartaOficio(traspaso, papel, itemsPorPagina, usuario);
				} else if (traspaso.configuracion.tamanoPapelNotaTraspaso.nombre_corto == Diccionario.FACT_PAPEL_ROLLO) {
					var alto, totalItems = traspaso.detallesVenta.length;
					if (totalItems <= 2) {
						alto = 440;
					} else {
						alto = 440 + (30 * (totalItems - 2))
					}
					papel = [227, alto];
					ImprimirNotaTraspasoRollo(traspaso, papel, usuario);
				}
			}
			return res;
		}])

	.factory('ImprimirNotaTraspasoCartaOficio', ['blockUI', 'VerificarDescuentos', 'DibujarCabeceraPDFTraspaso',
		function (blockUI, VerificarDescuentos, DibujarCabeceraPDFTraspaso) {
			var res = function (traspaso, papel, itemsPorPagina, usuario) {
				var doc = new PDFDocument({ size: papel, margin: 0 });
				var stream = doc.pipe(blobStream());
				var existenDescuentos = VerificarDescuentos(traspaso.detallesVenta);
				doc.font('Helvetica', 8);
				var y = 150, items = 0, pagina = 1, totalPaginas = Math.ceil(traspaso.detallesVenta.length / itemsPorPagina);
				var longitudCaracteres;
				var yDesc, totalAray = 0;
				DibujarCabeceraPDFTraspaso(doc, 1, totalPaginas, traspaso, existenDescuentos, usuario);
				for (var i = 0; i < traspaso.detallesVenta.length && items <= itemsPorPagina; i++) {
					if (existenDescuentos) {
						doc.font('Helvetica', 7);
						longitudCaracteres = traspaso.detallesVenta[i].producto.codigo.length;
						yDesc = (longitudCaracteres <= 15) ? y : ((longitudCaracteres > 15 && longitudCaracteres <= 15) ? y - 4 : y - 11);
						doc.text(traspaso.detallesVenta[i].producto.codigo, 55, yDesc, { width: 40 });
						doc.text(traspaso.detallesVenta[i].cantidad, 110, y);
						doc.text(traspaso.detallesVenta[i].producto.unidad_medida, 135, y);
						doc.text(traspaso.detallesVenta[i].producto.nombre, 170, y - 6, { width: 130 });
						doc.text(traspaso.detallesVenta[i].producto.precio_unitario.toFixed(2), 300, y);
						doc.text(traspaso.detallesVenta[i].importe.toFixed(2), 335, y);
						doc.text(traspaso.detallesVenta[i].descuento.toFixed(2), 385, y);
						doc.text(traspaso.detallesVenta[i].recargo.toFixed(2), 420, y);
						doc.text(traspaso.detallesVenta[i].ice.toFixed(2), 455, y);
						doc.text(traspaso.detallesVenta[i].excento.toFixed(2), 490, y);
						doc.text(traspaso.detallesVenta[i].total.toFixed(2), 520, y);
					} else {
						doc.font('Helvetica', 7);
						longitudCaracteres = traspaso.detallesVenta[i].producto.codigo.length;
						yDesc = (longitudCaracteres <= 15) ? y : ((longitudCaracteres > 15 && longitudCaracteres <= 15) ? y - 4 : y - 11);
						doc.font('Helvetica', 6);
						doc.text(traspaso.detallesVenta[i].producto.codigo, 55, yDesc, { width: 70 });
						doc.font('Helvetica', 7);
						doc.text(traspaso.detallesVenta[i].cantidad, 135, y);
						doc.text(traspaso.detallesVenta[i].producto.unidad_medida, 160, y);
						longitudCaracteres = traspaso.detallesVenta[i].producto.nombre.length;
						yDesc = (longitudCaracteres <= 25) ? y : ((longitudCaracteres > 25 && longitudCaracteres <= 40) ? y - 4 : y - 11);
						if (usuario.empresa.usar_vencimientos) {
							doc.font('Helvetica', 6);
							doc.text(traspaso.detallesVenta[i].producto.nombre, 210, yDesc, { width: 175 });
							doc.font('Helvetica', 7);
							var fecha_vencimiento = new Date(traspaso.detallesVenta[i].inventario.fecha_vencimiento);
							doc.text(fecha_vencimiento.getDate() + "/" + (fecha_vencimiento.getMonth() + 1) + "/" + fecha_vencimiento.getFullYear(), 390, y);
							doc.text(traspaso.detallesVenta[i].inventario.lote, 455, y);
						} else {
							doc.text(traspaso.detallesVenta[i].producto.nombre, 210, yDesc, { width: 250 });
						}
						doc.text(traspaso.detallesVenta[i].producto.precio_unitario.toFixed(2), 490, y);
						doc.text(traspaso.detallesVenta[i].total.toFixed(2), 530, y);
					}
					doc.rect(50, y - 15, 520, 30).stroke();
					y = y + 30;
					items++;
					if (items == itemsPorPagina) {
						totalAray = totalAray + items;
						if (totalAray != traspaso.detallesVenta.length) {
							var currentDate = new Date();
							traspaso.fecha = new Date(traspaso.fecha);
							doc.font('Helvetica', 6);
							doc.text("EMISIÓN: " + traspaso.fecha.getDate() + "/" + (traspaso.fecha.getMonth() + 1) + "/" + traspaso.fecha.getFullYear(), 200, y - 10);
							doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 260, y - 10);
							doc.text("USUARIO: " + usuario.persona.nombre_completo, 55, y - 10);

							doc.text(pagina + " de " + totalPaginas, 540, y - 10);

							doc.addPage({ margin: 0, bufferPages: true });
							y = 140;
							items = 0;
							pagina = pagina + 1;
							DibujarCabeceraPDFTraspaso(doc, pagina, totalPaginas, traspaso, existenDescuentos, usuario);
							doc.font('Helvetica', 8);
						}
					}
				}
				doc.font('Helvetica-Bold', 8);
				doc.text("TOTAL", 465, y - 5);
				doc.font('Helvetica', 8);
				doc.text(traspaso.total.toFixed(2), 520, y - 5);
				doc.rect(50, y - 15, 520, 20).stroke();
				doc.text("------------------------------------------", 180, y + 80);
				doc.text("------------------------------------------", 340, y + 80);
				doc.text("ENTREGA CONFORME", 190, y + 90);
				doc.text("RECIBO CONFORME", 350, y + 90);
				var currentDate = new Date();
				traspaso.fecha = new Date(traspaso.fecha);
				doc.font('Helvetica', 6);
				doc.text("EMISIÓN: " + traspaso.fecha.getDate() + "/" + (traspaso.fecha.getMonth() + 1) + "/" + traspaso.fecha.getFullYear(), 200, y + 10);
				doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 260, y + 10);
				doc.text("USUARIO: " + usuario.persona.nombre_completo, 55, y + 10);
				if (pagina > totalPaginas) {

				} else {
					doc.text(pagina + " de " + totalPaginas, 540, y + 10);
				}
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			}
			return res;
		}])

	.factory('DibujarCabeceraPDFTraspaso', [function () {
		var res = function (doc, pagina, totalPaginas, traspaso, existenDescuentos, usuario) {
			doc.rect(50, 40, 520, 70).stroke();
			doc.rect(50, 110, 520, 25).stroke();
			doc.font('Helvetica-Bold', 7);
			doc.text(usuario.empresa.razon_social, 55, 55);
			doc.text("SUCURSAL: ", 55, 65);
			doc.text("DIRECCIÓN: ", 55, 75);

			var telefono = (traspaso.sucursal.telefono1 != null ? traspaso.sucursal.telefono1 : "") +
				(traspaso.sucursal.telefono2 != null ? "-" + traspaso.sucursal.telefono2 : "") +
				(traspaso.sucursal.telefono3 != null ? "-" + traspaso.sucursal.telefono3 : "");
			doc.text("TELF.: ", 55, 95);
			doc.font('Helvetica', 8);
			doc.text(traspaso.sucursal.nombre, 105, 65);
			doc.text(traspaso.sucursal.direccion, 105, 75, { width: 120 });
			doc.text(telefono, 85, 95);
			doc.font('Helvetica-Bold', 15);
			doc.text("NOTA DE TRASPASO", 0, 60, { align: 'center' });
			doc.font('Helvetica-Bold', 7);
			doc.text("DE SUCURSAL: " + traspaso.sucursal.nombre + " A " + traspaso.sucursalDestino.nombre, 0, 78, { align: 'center' });

			doc.text("NRO. : " + traspaso.factura, 450, 75);
			if (existenDescuentos) {
				doc.text("CODIGO", 55, 120);
				doc.text("CANT.", 105, 120);
				doc.text("UNID.", 135, 120);
				doc.text("DETALLE", 170, 120);
				doc.text("P. UNIT.", 300, 120);
				doc.text("IMPORTE", 335, 120);
				doc.text("DESC.", 385, 120);
				doc.text("REC.", 420, 120);
				doc.text("ICE", 455, 120);
				doc.text("EXC.", 490, 120);
				doc.text("TOTAL", 520, 120);
			} else {
				doc.text("CODIGO", 55, 120);
				doc.text("CANT.", 128, 120);
				doc.text("UNID.", 165, 120);
				if (usuario.empresa.usar_vencimientos) {
					doc.text("DETALLE", 210, 120, { width: 110 });
					doc.text("FECHA VENC.", 380, 120);
					doc.text("LOTE", 450, 120);
				} else {
					doc.text("DETALLE", 190, 120, { width: 250 });
				}
				doc.text("P.UNIT.", 490, 120);
				doc.text("TOTAL", 530, 120);
			}
		}
		return res;
	}])

	.factory('ImprimirNotaTraspasoRollo', ['blockUI', 'VerificarDescuentos',
		function (blockUI, VerificarDescuentos) {
			var res = function (traspaso, papel, usuario) {
				var doc = new PDFDocument({ size: papel, margins: { top: 10, bottom: 10, left: 10, right: 20 } });
				var stream = doc.pipe(blobStream());
				var existenDescuentos = VerificarDescuentos(traspaso.detallesVenta);
				doc.moveDown(2);
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.font('Helvetica', 7);
				doc.text(traspaso.sucursal.nombre.toUpperCase(), { align: 'center' });
				doc.moveDown(0.4);
				doc.text(traspaso.sucursal.direccion.toUpperCase(), { align: 'center' });
				var telefono = (traspaso.sucursal.telefono1 != null ? traspaso.sucursal.telefono1 : "") +
					(traspaso.sucursal.telefono2 != null ? "-" + traspaso.sucursal.telefono2 : "") +
					(traspaso.sucursal.telefono3 != null ? "-" + traspaso.sucursal.telefono3 : "");
				doc.moveDown(0.4);
				doc.text("TELF.: " + telefono, { align: 'center' });
				doc.moveDown(0.4);
				doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
				doc.moveDown(0.5);
				doc.font('Helvetica-Bold', 8);
				doc.text("NOTA DE TRASPASO ", { align: 'center' });
				doc.text("DE SUCURSAL: " + traspaso.sucursal.nombre + " A " + traspaso.sucursalDestino.nombre, { align: 'center' });
				doc.font('Helvetica-Bold', 8);
				doc.moveDown(0.4);
				doc.text("------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				doc.font('Helvetica-Bold', 7);
				var y = 160, items = 0;
				var longitudCaracteres;
				var yDesc;
				doc.moveDown(0.4);
				doc.text("COD.", 10, 145);
				doc.text("CANT.", 35, 145);
				doc.text("DETALL.", 60, 145);
				doc.text("F. VENC.", 128, 145);
				doc.text("LOTE", 162, 145);
				doc.text("TOTAL", 183, 145);
				doc.moveDown(0.4);
				for (var i = 0; i < traspaso.detallesVenta.length; i++) {
					doc.font('Helvetica', 7);
					longitudCaracteres = traspaso.detallesVenta[i].producto.codigo.length;
					yDesc = (longitudCaracteres <= 15) ? y : ((longitudCaracteres > 15 && longitudCaracteres <= 15) ? y - 4 : y - 11);
					doc.moveDown(0.4);
					doc.text(traspaso.detallesVenta[i].producto.codigo, 10, yDesc, { width: 25 });
					doc.text(traspaso.detallesVenta[i].cantidad, 38, y);
					doc.text(traspaso.detallesVenta[i].producto.nombre, 57, y, { width: 70 });
					var fecha_vencimiento = new Date(traspaso.detallesVenta[i].inventario.fecha_vencimiento); console.log(new Date().getFullYear().toString().substr(-2));
					doc.text(fecha_vencimiento.getDate() + "/" + (fecha_vencimiento.getMonth() + 1) + "/" + fecha_vencimiento.getFullYear().toString().substr(-2), 128, y);
					doc.text(traspaso.detallesVenta[i].inventario.lote, 164, y);
					doc.text(traspaso.detallesVenta[i].total.toFixed(2), 187, y, { width: 100 });
					y = y + 30;
					items++;
				}
				var currentDate = new Date();
				traspaso.fecha = new Date(traspaso.fecha);
				doc.font('Helvetica-Bold', 8);
				doc.x = 10;
				doc.text("   -----------------------------                 --------------------------", 0, y + 130, { align: 'center' });
				doc.text("   ENTREGUE CONFORME          RECIBI CONFORME", { align: 'center' });
				doc.moveDown(0.4);
				doc.font('Helvetica', 6);
				doc.text("EMISIÓN: " + traspaso.fecha.getDate() + "/" + (traspaso.fecha.getMonth() + 1) + "/" + traspaso.fecha.getFullYear(), 150, y + 190);
				doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 15, y + 200);
				doc.text("USUARIO: " + usuario.persona.nombre_completo, 15, y + 190);
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();
			}
			return res;
		}]);

