angular.module('agil.servicios')

	.factory('Diccionario', [function () {
		return {
			MOV_ING: "MOVING",
			MOV_EGR: "MOVEGR",
			ING_INV_INICIAL: "III",
			EGRE_FACTURACION: "FACT",
			EGRE_PRE_FACTURACION: "PREFACT",
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
			ROL_OPERADOR: "OPERADOR",
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
			CAJA_BANCOS: "CAJA/BANCOS",
			COMPROBANTE_INGRESO: "INGRESO",
			COMPROBANTE_EGRESO: "EGRESO",
			COMPROBANTE_TRASPASO: "TRASPASO",
			COMPROBANTE_CAJA_CHICA: "CAJA CHICA",
			MENU_VEHICULOS: "VEHICULOS",
			MENU_PROFORMAS: "PROFORMAS",
			MENU_USUARIO: "USUARIOS",
			MENU_EMPRESA: "EMPRESAS",
			MENU_VENTA: "VENTAS",
			MENU_COMPRA: "COMPRAS",
			MENU_CONFIGURACION: "CONFIGURACIONES",
			MENU_REPORTE: "REPORTES",
			MENU_LIBRO_COMPRA: "LIBRO DE COMPRAS",
			MENU_LIBRO_VENTAS: "LIBRO DE VENTAS",
			MENU_REPORTE_VENTAS: "REPORTE DE VENTAS",
			MENU_REPORTE_COMPRAS: "REPORTE DE COMPRAS",
			MENU_ESTADO_RESULTADOS: "ESTADO DE RESULTADOS NO CONTABLE",
			MENU_ALMACEN: "ALMACENES",
			MENU_CERT_COD_CONTROL: "CERT. COD. DE CONTROL",
			MENU_ESTADO_CUENTAS_CLIENTES: "ESTADO DE CUENTAS CLIENTES",
			MENU_ESTADO_CUENTAS_PROVEEDORES: "ESTADO DE CUENTAS PROVEEDORES",
			MENU_PANTALLA: "PANTALLAS",
			MENU_DESPACHO: "DESPACHOS",
			MENU_CONCEPTO: "CONCEPTOS",
			MENU_DOSIFICACION: "DOSIFICACIONES",
			TIPO_CORRELATIVO_CLIENTES: "CORRELATIVO CLIENTES",
			TIPO_CORRELATIVO_DESTINOS: "CORRELATIVO DESTINOS",
			MOVING_INVENTARIO_INICIAL: "INGRESO POR INVENTARIO INICIAL",
			MOVING_POR_TRASPASO: "INGRESO POR TRASPASO",
			MOVING_POR_DEVOLUCION: "INGRESO POR DEVOLUCIÓN",
			MOVING_DIARIO: "INGRESO DIARIO",
			MOVING_POR_AJUSTE: "INGRESO POR AJUSTE",
			MOVING_POR_IMPORTACION: "INGRESO POR IMPORTACIÓN",
			MOVING_POR_RETENCION_SERVICIOS: "INGRESO POR RETENCIONES DE SERVICIOS",
			MOVING_POR_RETENCION_BIENES: "INGRESO POR RETENCIONES DE BIENES",
			MOVING_POR_COMPRA_SIN_FACTURA: "INGRESO POR COMPRA S/F",
			IT_RETENCION_BIEN: "IT RETENCION BIEN ALMACEN",
			IUE_RETENCION_BIEN: "IUE RETENCION BIEN ALMACEN",
			CUENTA_ALMACEN_RETENCION_BIEN: "CUENTA ALMACEN RETENCION BIEN",
			CUENTA_GASTO_RETENCION_BIEN: "CUENTA GASTO RETENCION BIEN",
			IT_RETENCION_BIEN_GASTO: "IT RETENCION BIEN GASTO",
			IUE_RETENCION_BIEN_GASTO: "IUE RETENCION BIEN GASTO",
			CUENTA_RETENCION_SERVICIO: "CUENTA RETENCION SERVICIO",
			IT_RETENCION_SERVICIO: "IT RETENCION SERVICIO",
			IUE_RETENCION_SERVICIO: "IUE RETENCION SERVICIO",
			CC_ESTADO_PROCESADO: "PROCESADO",
			CC_ESTADO_DESEMBOLSADO: "DESEMBOLSADO",
			CC_ESTADO_VERIFICADO: "VERIFICADO",
			CC_ESTADO_PENDIENTE: "PENDIENTE",
			CC_ESTADO_AUTORIZADO: "AUTORIZADO",
			CC_ESTADO_ANULADO: "ANULADO",
			CC_MOV_ANTICIPO: "ANTICIPO",
			EGRE_SERVICIO: "SERV"
		}
	}])

	.factory('VerificarDescuentos', [function () {
		var res = function (detalles) {
			var existe = false;
			if (detalles !== undefined) {
				for (var i = 0; i < detalles.length; i++) {
					if (detalles[i].descuento > 0 || detalles[i].recargo > 0 || detalles[i].ice > 0 || detalles[i].excento > 0) {
						existe = true;
					}
				}
			}
			return existe;
		};
		return res;
	}])
	//factory para nuevos comprobantes
	.factory('NuevoComprobante', ["blockUI", "AsignarComprobanteFavorito", "LibroMayorCuenta", "ComprobanteRevisarPaginador", "NuevoComprobanteContabilidad", "ListaCuentasComprobanteContabilidad", "ActualizarComprobanteContabilidad", "ImprimirComprobante", "DatosComprobante",
		function (blockUI, AsignarComprobanteFavorito, LibroMayorCuenta, ComprobanteRevisarPaginador, NuevoComprobanteContabilidad, ListaCuentasComprobanteContabilidad, ActualizarComprobanteContabilidad, ImprimirComprobante, DatosComprobante) {
			var res = function (mostrarMensaje, paginator, filtro, usuario, idComprobante, datoslibroMayor, revisar, convertirFecha, cerrarModal, nuevoComprobante,
				buscarCuentaQuery, verificarVentasComprobantes, verificarComprasComprobantes, recargarItemsTabla, number_format) {
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
					var fecha = new Date()
					nuevoComprobante.fechaActual = new Date()

					if (!nuevoComprobante.id) {
						for (var index = 0; index < nuevoComprobante.asientosContables.length; index++) {
							var element = nuevoComprobante.asientosContables[index];
							if (element.activo != false && element.debe_bs != "") {
								nuevoComprobante.importe = Math.round((nuevoComprobante.importe + element.debe_bs) * 10000) / 10000
							}
						}

						nuevoComprobante.fecha = new Date(convertirFecha(nuevoComprobante.fecha))
						nuevoComprobante.fecha.setHours(fecha.getHours())
						nuevoComprobante.fecha.setMinutes(fecha.getMinutes())
						NuevoComprobanteContabilidad.save(nuevoComprobante, function (dato) {
							verificarVentasComprobantes(usuario.id_empresa)
							verificarComprasComprobantes(usuario.id_empresa)
							mostrarMensaje(dato.mensaje);

							var promesa = DatosComprobante(dato.comprobante.id)
							promesa.then(function (datosComprobante) {
								datosComprobante.comprobante.importe_literal = datosComprobante.importeLiteral
								ImprimirComprobante(datosComprobante.comprobante, false, usuario, number_format)
							})
							recargarItemsTabla()
							cerrarModal();
						})

					} else {
						nuevoComprobante.importe = 0;
						nuevoComprobante.abierto = false
						for (var index = 0; index < nuevoComprobante.asientosContables.length; index++) {
							var element = nuevoComprobante.asientosContables[index];
							if (element.activo != false && element.debe_bs != "") {
								nuevoComprobante.importe = Math.round((nuevoComprobante.importe + element.debe_bs) * 10000) / 10000
							}
						}
						nuevoComprobante.fecha = new Date(convertirFecha(nuevoComprobante.fecha))
						nuevoComprobante.fecha.setHours(fecha.getHours())
						nuevoComprobante.fecha.setMinutes(fecha.getMinutes())
						ActualizarComprobanteContabilidad.update({ id_comprobante: nuevoComprobante.id }, nuevoComprobante, function (dato) {
							verificarVentasComprobantes(usuario.id_empresa)
							verificarComprasComprobantes(usuario.id_empresa)
							mostrarMensaje(dato.mensaje);
							cerrarModal();
							recargarItemsTabla()
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
			var res = function (comprobante, bimonetario, usuario, number_format) {
				var arregloDebe = [], arregloHaber = [], datosDF = { calculo: 0, monto: 0, texto1: "", texto2: "", texto3: "", cant: 0 }, datosCF = { calculo: 0, monto: 0, texto1: "", texto2: "", texto3: "", cant: 0 };
				comprobante.asientosContables.forEach(function (asiento, index, array) {
					if (asiento.debe_bs != 0) {
						arregloDebe.push(asiento)
					} else {
						arregloHaber.push(asiento)
					}
					if (asiento.cuenta.especifica) {
						if (asiento.cuenta.tipo_especifica) {
							datosCF.monto += asiento.debe_bs
							datosCF.texto1 = asiento.cuenta.especificaTexto1.nombre_corto
							datosCF.texto2 = asiento.cuenta.especificaTexto2.nombre_corto
							datosCF.texto3 = asiento.cuenta.especificaTexto3.nombre_corto
							datosCF.cant++
							datosCF.calculo = (datosCF.monto * 100) / 13
							datosCF.calculo = number_format(datosCF.calculo, 2)
						} else {
							datosDF.monto += asiento.haber_bs
							datosDF.texto1 = asiento.cuenta.especificaTexto1.nombre_corto
							datosDF.texto2 = asiento.cuenta.especificaTexto2.nombre_corto
							datosDF.texto3 = asiento.cuenta.especificaTexto3.nombre_corto
							datosDF.cant++
							datosDF.calculo = (datosDF.monto * 100) / 13
							datosDF.calculo = number_format(datosDF.calculo, 2)
						}

					}
					if (index === (array.length - 1)) {

						var asientosContables = arregloDebe.concat(arregloHaber);
						var doc = new PDFDocument({ compress: false, size: [612, 792], margin: 10 });
						var stream = doc.pipe(blobStream());
						doc.font('Helvetica', 8);
						var itemsPorPagina = 19;
						var y = 160, items = 0, pagina = 1, totalPaginas = Math.ceil(asientosContables.length / itemsPorPagina);
						var sumaDebeBs = 0, sumaHaberBs = 0, sumaDebeSus = 0, sumaHaberSus = 0;
						var fecha = new Date()
						if (bimonetario) {
							DibujarCabeceraComprobante(doc, bimonetario, usuario, comprobante, pagina, totalPaginas, datosCF, datosDF);
							for (var i = 0; i < asientosContables.length && items <= itemsPorPagina; i++) {
								var asiento = asientosContables[i]
								doc.rect(390, y, 0, 30).stroke();
								doc.rect(440, y, 0, 30).stroke();
								doc.rect(490, y, 0, 30).stroke();
								doc.rect(540, y, 0, 30).stroke();
								doc.font('Helvetica', 7);
								doc.text(asiento.cuenta.codigo, 28, y + 5)
								doc.font('Helvetica-Bold', 7);
								if (asiento.cuenta.tipoAuxiliar) doc.text(asiento.cuentaAux.nombre, 28, y + 13, { width: 80 })
								doc.font('Helvetica-Bold', 7);
								doc.text(asiento.cuenta.nombre, 120, y + 5, { width: 190, underline: true })
								doc.font('Helvetica', 7);
								doc.text(asiento.glosa, 125, y + 13, { width: 190 })
								if (asiento.centroCosto) doc.text(asiento.centroCosto.nombre, 310, y + 5)
								doc.text("", 350, y + 5)
								var debe_bs = number_format(asiento.debe_bs, 2)
								var haber_bs = number_format(asiento.haber_bs, 2)
								if (debe_bs != "0.00") doc.text(debe_bs, 395, y + 5)
								if (haber_bs != "0.00") doc.text(haber_bs, 445, y + 5)
								var debe_sus = number_format(asiento.debe_sus, 2)
								var haber_sus = number_format(asiento.haber_sus, 2)
								if (debe_sus != "0.00") doc.text(debe_sus, 500, y + 5)
								if (haber_bs != "0.00") doc.text(haber_sus, 545, y + 5)
								sumaDebeBs += 0 + asiento.debe_bs
								sumaHaberBs += 0 + asiento.haber_bs
								sumaDebeSus += 0 + asiento.debe_sus
								sumaHaberSus += 0 + asiento.haber_sus
								y = y + 30;
								items++;
								if (items > itemsPorPagina) {
									doc.addPage({ size: [612, 792], margin: 10 });
									y = 160;
									items = 0;
									pagina = pagina + 1;
									DibujarCabeceraComprobante(doc, bimonetario, usuario, comprobante, pagina, totalPaginas, datosCF, datosDF);
								}
							}
							doc.font('Helvetica-Bold', 7);
							doc.text("SUMA TOTAL:", 330, y + 5)
							sumaDebeBs = number_format(sumaDebeBs, 2)
							sumaHaberBs = number_format(sumaHaberBs, 2)
							doc.text(sumaDebeBs, 395, y + 5)
							doc.text(sumaHaberBs, 445, y + 5)
							sumaHaberSus = number_format(sumaHaberSus, 2)
							sumaDebeSus = number_format(sumaDebeSus, 2)
							doc.text(sumaDebeSus, 500, y + 5)
							doc.text(sumaHaberSus, 545, y + 5)
							doc.rect(20, y, 571, 0).stroke();
							doc.rect(20, y + 20, 571, 0).stroke();
							doc.rect(390, y, 0, 20).stroke();
							doc.rect(440, y, 0, 20).stroke();
							doc.rect(490, y, 0, 20).stroke();
							doc.rect(540, y, 0, 20).stroke();
						} else {
							DibujarCabeceraComprobante(doc, bimonetario, usuario, comprobante, pagina, totalPaginas, datosCF, datosDF);
							for (var i = 0; i < asientosContables.length && items <= itemsPorPagina; i++) {
								var asiento = asientosContables[i]
								doc.rect(450, y, 0, 30).stroke();
								doc.rect(520, y, 0, 30).stroke();
								doc.font('Helvetica', 7);
								doc.text(asiento.cuenta.codigo, 38, y + 5)
								doc.font('Helvetica-Bold', 7);
								if (asiento.cuenta.tipoAuxiliar) { if (asiento.cuentaAux) doc.text(asiento.cuentaAux.nombre, 38, y + 13, { width: 80 }) }
								doc.font('Helvetica-Bold', 7);
								doc.text(asiento.cuenta.nombre, 130, y + 5, { width: 190, underline: true })
								doc.font('Helvetica', 7);
								doc.text(asiento.glosa, 135, y + 13, { width: 190 })
								if (asiento.centroCosto) doc.text(asiento.centroCosto.nombre, 340, y + 5)
								doc.text("", 380, y + 5)
								var debe_bs = number_format(asiento.debe_bs, 2)
								var haber_bs = number_format(asiento.haber_bs, 2)
								if (debe_bs != "0.00") doc.text(debe_bs, 470, y + 5)
								if (haber_bs != "0.00") doc.text(haber_bs, 540, y + 5)
								sumaDebeBs += 0 + asiento.debe_bs
								sumaHaberBs += 0 + asiento.haber_bs
								y = y + 30;
								items++;
								if (items > itemsPorPagina) {
									doc.rect(450, y, 0, 2).stroke();
									doc.rect(520, y, 0, 2).stroke();
									doc.addPage({ size: [612, 792], margin: 10 });
									y = 160;
									items = 0;
									pagina = pagina + 1;
									DibujarCabeceraComprobante(doc, bimonetario, usuario, comprobante, pagina, totalPaginas, datosCF, datosDF);
								}
							}
							doc.font('Helvetica-Bold', 7);
							doc.text("SUMA TOTAL:", 390, y + 5)
							doc.font('Helvetica', 7);
							sumaDebeBs = number_format(sumaDebeBs, 2)
							sumaHaberBs = number_format(sumaHaberBs, 2)
							doc.text(sumaDebeBs, 470, y + 5)
							doc.text(sumaHaberBs, 540, y + 5)
							doc.rect(20, y, 571, 0).stroke();
							doc.rect(20, y + 20, 571, 0).stroke();
							doc.font('Helvetica-Bold', 7);
							doc.rect(450, y, 0, 20).stroke();
							doc.rect(520, y, 0, 20).stroke();
						}
						doc.text("Son:", 38, y + 25)
						doc.font('Helvetica', 7);
						doc.text(comprobante.importe_literal, 60, y + 25)

						doc.rect(20, y + 40, 571, 0).stroke();
						if (comprobante.tipoComprobante.nombre == "TRASPASO") {
							doc.rect(20, 720, 571, 0).stroke();
							doc.font('Helvetica-Bold', 7);
							doc.text("Preparado por:", 38, 725)
							doc.font('Helvetica', 7);
							doc.text(usuario.persona.nombre_completo, 38, 735)
							doc.rect(200, 720, 0, 42).stroke();
							var fechaActual = new Date(comprobante.fecha_creacion)
							var mont = fechaActual.getMonth() + 1
							var min = fechaActual.getMinutes()
							if (min < 10) { min = "0" + fechaActual.getMinutes() }
							var hora = fechaActual.getHours()
							if (hora < 10) { hora = "0" + fechaActual.getHours() }
							var sec = fechaActual.getSeconds()
							if (sec < 10) { sec = "0" + fechaActual.getSeconds() }
							if (mont < 10) {
								doc.text(+fechaActual.getDate() + "/0" + mont + "/" + fechaActual.getFullYear() + "         " + hora + ":" + min + ":" + sec, 58, 752)
							} else {
								doc.text(+fechaActual.getDate() + "/" + mont + "/" + fechaActual.getFullYear() + "         " + hora + ":" + min + ":" + sec, 58, 752)
							}
							var mont2 = fecha.getMonth() + 1
							var min2 = fecha.getMinutes()
							if (min2 < 10) { min2 = "0" + fecha.getMinutes() }
							var hora2 = fecha.getHours()
							if (hora2 < 10) { hora2 = "0" + fecha.getHours() }
							var sec2 = fecha.getSeconds()
							if (sec2 < 10) { sec2 = "0" + fecha.getSeconds() }
							if (mont2 < 10) {
								doc.text("IMP.:" + fecha.getDate() + "/0" + mont2 + "/" + fecha.getFullYear() + "         " + hora2 + ":" + min2 + ":" + sec2, 38, 765)
							} else {
								doc.text("IMP.:" + fecha.getDate() + "/" + mont2 + "/" + fecha.getFullYear() + "         " + hora2 + ":" + min2 + ":" + sec2, 38, 765)
							}
							doc.text("Revisado", 290, 752)
							doc.text("Autorizado", 480, 752)

							doc.rect(410, 720, 0, 42).stroke();
							doc.rect(20, 750, 571, 0).stroke();
						} else {
							doc.rect(20, 720, 571, 0).stroke();
							doc.font('Helvetica-Bold', 7);
							doc.text("Preparado por:", 38, 725)
							doc.font('Helvetica', 7);
							doc.text(usuario.persona.nombre_completo, 38, 735)
							doc.rect(200, 720, 0, 42).stroke();
							var fechaActual = new Date(comprobante.fecha_creacion)
							var mont = fechaActual.getMonth() + 1
							var min = fechaActual.getMinutes()
							if (min < 10) { min = "0" + fechaActual.getMinutes() }
							var hora = fechaActual.getHours()
							if (hora < 10) { hora = "0" + fechaActual.getHours() }
							var sec = fechaActual.getSeconds()
							if (sec < 10) { sec = "0" + fechaActual.getSeconds() }
							if (mont < 10) {
								doc.text(+fechaActual.getDate() + "/0" + mont + "/" + fechaActual.getFullYear() + "         " + hora + ":" + min + ":" + sec, 58, 752)
							} else {
								doc.text(+fechaActual.getDate() + "/" + mont + "/" + fechaActual.getFullYear() + "         " + hora + ":" + min + ":" + sec, 58, 752)
							}
							var mont2 = fecha.getMonth() + 1
							var min2 = fecha.getMinutes()
							if (min2 < 10) { min2 = "0" + fecha.getMinutes() }
							var hora2 = fecha.getHours()
							if (hora2 < 10) { hora2 = "0" + fecha.getHours() }
							var sec2 = fecha.getSeconds()
							if (sec2 < 10) { sec2 = "0" + fecha.getSeconds() }
							if (mont2 < 10) {
								doc.text("IMP.:" + fecha.getDate() + "/0" + mont2 + "/" + fecha.getFullYear() + "         " + hora2 + ":" + min2 + ":" + sec2, 38, 765)
							} else {
								doc.text("IMP.:" + fecha.getDate() + "/" + mont2 + "/" + fecha.getFullYear() + "         " + hora2 + ":" + min2 + ":" + sec2, 38, 765)
							}
							doc.text("Revisado", 240, 752)
							doc.text("Autorizado", 350, 752)
							doc.text("Recibio conforme:", 425, 740)
							doc.text("CI:", 425, 752)
							doc.rect(310, 720, 0, 42).stroke();
							doc.rect(420, 720, 0, 42).stroke();
							doc.rect(20, 750, 571, 0).stroke();
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
					}

				});



			};
			return res;
		}])
	.factory('DibujarCabeceraComprobante', [function () {
		var res = function (doc, bimonetario, usuario, comprobante, pagina, totalPaginas, datosCF, datosDF) {
			var fecha = new Date(comprobante.fecha)
			console.log(usuario)
			if (bimonetario) {
				doc.rect(20, 30, 571, 732).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social, 25, 35)
				doc.text("SISTEMA DE CONTABILIDAD.", 25, 50)
				doc.text("NIT: ", 25, 65)
				doc.font('Helvetica', 8);
				doc.text(usuario.empresa.nit + ".", 50, 65)
				doc.font('Helvetica-Bold', 14);
				doc.text("COMPROBANTE DE " + comprobante.tipoComprobante.nombre, 0, 75, { align: 'center' })
				doc.font('Helvetica', 8);
				doc.text(pagina + ' de: ' + totalPaginas, 545, 35)
				doc.font('Helvetica-Bold', 8);
				doc.text("Gestión: " + fecha.getFullYear(), 515, 50)
				/* if (comprobante.tipoComprobante.nombre == "INGRESO") {
					doc.font('Helvetica-Bold', 12);
					doc.text("N°: ",535, 65)
					doc.font('Helvetica', 12);
					doc.text(comprobante.sucursal.comprobante_ingreso_correlativo, 555, 65)
				}				
				if (comprobante.tipoComprobante.nombre == "EGRESO") {
					doc.font('Helvetica-Bold', 12);
					doc.text("N°: " , 535, 65)
					doc.font('Helvetica', 12);
					doc.text(comprobante.sucursal.comprobante_egreso_correlativo, 555, 65)
				}				
				if (comprobante.tipoComprobante.nombre == "TRASPASO") {
					doc.font('Helvetica-Bold', 12);
					doc.text("N°: ", 535, 65)
					doc.font('Helvetica', 12);
					doc.text(comprobante.sucursal.comprobante_traspaso_correlativo, 555, 65)
				}				
				if (comprobante.tipoComprobante.nombre == "CAJA CHICA"){
					doc.font('Helvetica-Bold', 12);
					doc.text("N°: ", 535, 65)
					doc.font('Helvetica', 12);
					doc.text(comprobante.sucursal.comprobante_caja_chica_correlativo, 555, 65)
				}	 */
				doc.font('Helvetica-Bold', 12);
				doc.text("N°: ", 535, 65)
				doc.font('Helvetica', 12);
				doc.text(comprobante.numero, 555, 65)
				doc.rect(20, 90, 571, 0).stroke();
				doc.font('Helvetica', 8);
				doc.text(comprobante.gloza, 68, 105)
				doc.font('Helvetica-Bold', 8);
				var mont = fecha.getMonth() + 1
				if (mont < 10) {
					doc.text("Fecha: " + fecha.getDate() + "/0" + mont + "/" + fecha.getFullYear(), 500, 95)
				} else {
					doc.text("Fecha: " + fecha.getDate() + "/" + mont + "/" + fecha.getFullYear(), 500, 95)
				}
				doc.text("T. Cambio: ", 500, 105)
				doc.font('Helvetica', 8);
				doc.text(comprobante.tipoCambio.dolar, 545, 105)
				if (datosCF.cant > 0 && datosDF.cant == 0) doc.text(datosCF.texto1 + " " + datosCF.monto + "    " + datosCF.texto2 + " " + datosCF.calculo + "    " + datosCF.texto3 + " " + datosCF.cant, 400, 120)
				if (datosDF.cant > 0 && datosCF.cant == 0) doc.text(datosDF.texto1 + " " + datosDF.monto + "    " + datosDF.texto2 + " " + datosDF.calculo + "    " + datosDF.texto3 + " " + datosDF.cant, 400, 120)
				if (datosDF.cant > 0 && datosCF.cant > 0) doc.text(datosDF.texto1 + " " + datosDF.monto + "    " + datosDF.texto2 + " " + datosDF.calculo + "    " + datosDF.texto3 + " " + datosDF.cant + "     " + datosCF.texto1 + " " + datosCF.monto + "    " + datosCF.texto2 + " " + datosCF.calculo + "    " + datosCF.texto3 + " " + datosCF.cant, 350, 120)
				doc.font('Helvetica-Bold', 8);
				doc.rect(20, 130, 571, 0).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text("Cuenta", 45, 145)
				doc.text("Descripcion/Glosa", 140, 145)
				doc.text("C.Costo", 310, 145)
				doc.text("ref", 350, 145)
				doc.rect(20, 160, 571, 0).stroke();
				doc.rect(390, 130, 0, 30).stroke();
				doc.rect(440, 145, 0, 15).stroke();
				doc.rect(390, 145, 200, 0).stroke();
				doc.text("BOLIVIANOS", 415, 137)
				doc.text("Debe", 405, 150)
				doc.text("Haber", 455, 150)
				doc.rect(490, 130, 0, 30).stroke();
				doc.rect(540, 145, 0, 15).stroke();
				doc.text("DOLARES", 520, 137)
				doc.text("Debe", 505, 150)
				doc.text("Haber", 550, 150)
				/* doc.rect(50, 700, 520, 0).stroke();
				doc.rect(200, 700, 0, 40).stroke();
				doc.rect(320, 700, 0, 40).stroke();
				doc.rect(420, 700, 0, 40).stroke();
				doc.rect(50, 730, 520, 0).stroke(); */
			} else {
				doc.rect(20, 30, 571, 732).stroke();
				doc.font('Helvetica-Bold', 8);
				doc.text(usuario.empresa.razon_social, 25, 35)
				doc.text("SISTEMA DE CONTABILIDAD.", 25, 50)
				doc.text("NIT: ", 25, 65)
				doc.font('Helvetica', 8);
				doc.text(usuario.empresa.nit + ".", 50, 65)
				doc.font('Helvetica-Bold', 14);
				doc.text("COMPROBANTE DE " + comprobante.tipoComprobante.nombre, 0, 75, { align: 'center' })
				doc.font('Helvetica', 8);
				doc.text(pagina + ' de: ' + totalPaginas, 545, 35)
				doc.font('Helvetica-Bold', 8);
				doc.text("Gestión: " + fecha.getFullYear(), 515, 50)
				/* if (comprobante.tipoComprobante.nombre == "INGRESO") {
					doc.font('Helvetica-Bold', 12);
					doc.text("N°: ", 535, 65)
					doc.font('Helvetica', 12);
					doc.text(comprobante.sucursal.comprobante_ingreso_correlativo, 555, 65)
				}
				if (comprobante.tipoComprobante.nombre == "EGRESO") {
					doc.font('Helvetica-Bold', 12);
					doc.text("N°: ", 535, 65)
					doc.font('Helvetica', 12);
					doc.text(comprobante.sucursal.comprobante_egreso_correlativo, 555, 65)
				}
				if (comprobante.tipoComprobante.nombre == "TRASPASO") {
					doc.font('Helvetica-Bold', 12);
					doc.text("N°: ", 535, 65)
					doc.font('Helvetica', 12);
					doc.text(comprobante.sucursal.comprobante_traspaso_correlativo, 555, 65)
				}
				if (comprobante.tipoComprobante.nombre == "CAJA CHICA") {
					doc.font('Helvetica-Bold', 12);
					doc.text("N°: ", 535, 65)
					doc.font('Helvetica', 12);
					doc.text(comprobante.sucursal.comprobante_caja_chica_correlativo, 555, 65)
				} */
				doc.font('Helvetica-Bold', 12);
				doc.text("N°: ", 535, 65)
				doc.font('Helvetica', 12);
				doc.text(comprobante.numero, 555, 65)
				doc.rect(20, 90, 571, 0).stroke();
				doc.font('Helvetica', 8);
				doc.text(comprobante.gloza, 38, 105)
				doc.font('Helvetica-Bold', 8);
				var mont = fecha.getMonth() + 1
				if (mont < 10) {
					doc.text("Fecha: " + fecha.getDate() + "/0" + mont + "/" + fecha.getFullYear(), 500, 95)
				} else {
					doc.text("Fecha: " + fecha.getDate() + "/" + mont + "/" + fecha.getFullYear(), 500, 95)
				}
				doc.text("T. Cambio: ", 500, 105)
				doc.font('Helvetica', 8);
				doc.text(comprobante.tipoCambio.dolar, 545, 105)
				if (datosCF.cant > 0 && datosDF.cant == 0) doc.text(datosCF.texto1 + " " + datosCF.monto + "    " + datosCF.texto2 + " " + datosCF.calculo + "    " + datosCF.texto3 + " " + datosCF.cant, 400, 120)
				if (datosDF.cant > 0 && datosCF.cant == 0) doc.text(datosDF.texto1 + " " + datosDF.monto + "    " + datosDF.texto2 + " " + datosDF.calculo + "    " + datosDF.texto3 + " " + datosDF.cant, 400, 120)
				if (datosDF.cant > 0 && datosCF.cant > 0) doc.text(datosDF.texto1 + " " + datosDF.monto + "    " + datosDF.texto2 + " " + datosDF.calculo + "    " + datosDF.texto3 + " " + datosDF.cant + "     " + datosCF.texto1 + " " + datosCF.monto + "    " + datosCF.texto2 + " " + datosCF.calculo + "    " + datosCF.texto3 + " " + datosCF.cant, 350, 120)
				doc.font('Helvetica-Bold', 8);
				doc.rect(20, 130, 571, 0).stroke();
				doc.text("Cuenta", 50, 145)
				doc.text("Descripcion/Glosa", 150, 145)
				doc.text("C.Costo", 340, 145)
				doc.text("ref", 405, 145)
				doc.text("BOLIVIANOS", 500, 135)
				doc.rect(450, 145, 140, 0).stroke();
				doc.rect(20, 160, 571, 0).stroke();
				doc.rect(450, 130, 0, 30).stroke();
				doc.rect(520, 145, 0, 15).stroke();
				doc.text("Debe", 475, 150)
				doc.text("Haber", 545, 150)
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
	.factory('CuentasAuxiliares', function ($resource) {
		return $resource(restServer + "cuentas-auxiliares/empresa/:id_empresa/tipo/:tipo");
	})
	.factory('ListasCuentasAuxiliares', ['CuentasAuxiliares', '$q', function (CuentasAuxiliares, $q) {
		var res = function (idEmpresa, Tipo) {
			var delay = $q.defer();
			CuentasAuxiliares.query({ id_empresa: idEmpresa, tipo: Tipo }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
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
	.factory('FormatoImpresion', function ($resource) {
		return $resource(restServer + "tipos/:nombre_corto", { nombre_corto: '@nombre_corto' },
			{
				'update': { method: 'PUT' }
			});
	}).factory('IdsFormatoImpresion', ['FormatoImpresion', '$q', function (FormatoImpresion, $q) {
		var res = function () {
			var delay = $q.defer();
			FormatoImpresion.get({ nombre_corto: 'FORM_IMP_FAC' }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
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
	.factory('EliminarComprobante', ['ActualizarComprobanteContabilidad', '$q', function (ActualizarComprobanteContabilidad, $q) {
		var res = function (id_comprobante) {
			var delay = $q.defer();
			ActualizarComprobanteContabilidad.save({ id_comprobante: id_comprobante }, function (entidades) {
				delay.resolve(entidades);
			}, function (error) {
				delay.reject(error);
			});
			return delay.promise;
		};
		return res;
	}])
	//fin factory para nuevos comprobantes

	.factory('ImprimirSalida', ['Diccionario', 'ImprimirFactura', 'ImprimirProforma', 'ImprimirNotaBaja', 'ImprimirNotaTraspaso', 'IdsFormatoImpresion', 'ImprimirServicio',
		function (Diccionario, ImprimirFactura, ImprimirProforma, ImprimirNotaBaja, ImprimirNotaTraspaso, IdsFormatoImpresion, ImprimirServicio) {
			var res = function (movimiento, salida, esAccionGuardar, usuario, llevar) {
				var prom = IdsFormatoImpresion()
				var formatos
				prom.then(function (res) {
					formatos = res.clases
					if (movimiento == Diccionario.EGRE_FACTURACION) {
						ImprimirFactura(salida, esAccionGuardar, usuario, formatos);
					} else if (movimiento == Diccionario.EGRE_PROFORMA) {
						ImprimirProforma(salida, esAccionGuardar, usuario, llevar);
					}
					else if (movimiento == Diccionario.EGRE_BAJA) {
						ImprimirNotaBaja(salida, usuario);
					}
					else if (movimiento == Diccionario.EGRE_TRASPASO) {
						ImprimirNotaTraspaso(salida, usuario);
					} else if (movimiento == Diccionario.EGRE_SERVICIO) {
						ImprimirServicio(salida, esAccionGuardar, usuario, formatos);
					}
				})
			};
			return res;
		}])


	.factory('ImprimirFactura', ['Diccionario', 'ImprimirFacturaCartaOficio', 'ImprimirFacturaCartaOficioSinFormato', 'ImprimirPedido', 'ImprimirFacturaRollo', '$timeout',
		function (Diccionario, ImprimirFacturaCartaOficio, ImprimirFacturaCartaOficioSinFormato, ImprimirPedido, ImprimirFacturaRollo, $timeout) {
			var res = function (salida, esAccionGuardar, usuario, idFormatoImpresion) {
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
						//var formatoConMargen = idFormatoImpresion.filter(elem => id)
						//var formatoSinMargen = $filter('id')(idFormatoImpresion,'FORMATO SIN MARGEN');
						//var idConf = idFormatoImpresion[0].id; 
						if (idFormatoImpresion[0].nombre_corto === 'FORM_C_MAR') {
							var idConFormato = idFormatoImpresion[0].id;
						}
						if (idFormatoImpresion[1].nombre_corto === 'FORM_S_MAR') {
							var idSinFormato = idFormatoImpresion[1].id;
						}

						if (salida.configuracion.id_formato_papel_factura === idConFormato) {
							ImprimirFacturaCartaOficio(salida, papel, true, false, false, usuario);
						} else if (salida.configuracion.id_formato_papel_factura === idSinFormato) {
							ImprimirFacturaCartaOficioSinFormato(salida, papel, true, false, false, usuario);
						}

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
							doc = new PDFDocument({ compress: false, size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							stream = doc.pipe(blobStream());
							ImprimirPedido(salida, esAccionGuardar, doc, stream, sizeY, usuario, false);
						}
					} else {
						doc = new PDFDocument({ compress: false, size: papel, margins: { top: 0, bottom: 0, left: 20, right: 20 } });
						stream = doc.pipe(blobStream());
						ImprimirFacturaRollo(salida, papel, doc, stream, usuario);
						if (usuario.empresa.usar_pedidos) {
							var sizeY = 230 + (20 * salida.detallesVenta.length);
							doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							ImprimirPedido(salida, esAccionGuardar, doc, stream, sizeY, usuario, false);
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
	//imprimir servicio
	.factory('ImprimirServicio', ['Diccionario', 'ImprimirFacturaCartaOficio', 'ImprimirFacturaCartaOficioSinFormato', 'ImprimirPedido', 'ImprimirFacturaRollo', '$timeout',
		function (Diccionario, ImprimirFacturaCartaOficio, ImprimirFacturaCartaOficioSinFormato, ImprimirPedido, ImprimirFacturaRollo, $timeout) {
			var res = function (salida, esAccionGuardar, usuario, idFormatoImpresion) {
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
						//var formatoConMargen = idFormatoImpresion.filter(elem => id)
						//var formatoSinMargen = $filter('id')(idFormatoImpresion,'FORMATO SIN MARGEN');
						//var idConf = idFormatoImpresion[0].id; 
						if (idFormatoImpresion[0].nombre_corto === 'FORM_C_MAR') {
							var idConFormato = idFormatoImpresion[0].id;
						}
						if (idFormatoImpresion[1].nombre_corto === 'FORM_S_MAR') {
							var idSinFormato = idFormatoImpresion[1].id;
						}

						if (salida.configuracion.id_formato_papel_factura === idConFormato) {
							ImprimirFacturaCartaOficio(salida, papel, true, false, false, usuario);
						} else if (salida.configuracion.id_formato_papel_factura === idSinFormato) {
							ImprimirFacturaCartaOficioSinFormato(salida, papel, true, false, false, usuario);
						}

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
							doc = new PDFDocument({ compress: false, size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							stream = doc.pipe(blobStream());
							ImprimirPedido(salida, esAccionGuardar, doc, stream, sizeY, usuario, false);
						}
					} else {
						doc = new PDFDocument({ compress: false, size: papel, margins: { top: 0, bottom: 0, left: 20, right: 20 } });
						stream = doc.pipe(blobStream());
						ImprimirFacturaRollo(salida, papel, doc, stream, usuario);
						if (usuario.empresa.usar_pedidos) {
							var sizeY = 230 + (20 * salida.detallesVenta.length);
							doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							ImprimirPedido(salida, esAccionGuardar, doc, stream, sizeY, usuario, false);
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

	//Imprimir Factura con formato de margen
	.factory('ImprimirFacturaCartaOficio', ['blockUI', 'VerificarDescuentos', 'Diccionario', 'DibujarCabeceraFacturaNVCartaOficio', 'DibujarCabeceraFacturaNVmedioOficio', '$timeout',
		function (blockUI, VerificarDescuentos, Diccionario, DibujarCabeceraFacturaNVCartaOficio, DibujarCabeceraFacturaNVmedioOficio, $timeout) {
			var res = function (venta, papel, vacia, completa, semicompleta, usuario) {
				var doc = new PDFDocument({ compress: false, size: papel, margin: 10 });
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
						if (venta.detallesVenta[i].producto) {
							venta.detallesVenta[i].fecha_vencimiento = new Date(venta.detallesVenta[i].fecha_vencimiento);
							var fechaVencimientoTexto = venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear().toString().substring(2);

							doc.text(venta.detallesVenta[i].producto.codigo, 55, y, { width: 70 });
							doc.text(venta.detallesVenta[i].cantidad, 135, y);
							doc.text(venta.detallesVenta[i].producto.unidad_medida, 160, y - 3, { width: 43 });
							var longitudCaracteres = venta.detallesVenta[i].producto.nombre.length;
							var yDesc = (longitudCaracteres <= 24) ? y : ((longitudCaracteres > 24 && longitudCaracteres <= 60) ? y - 4 : y - 11);
							doc.text(venta.detallesVenta[i].producto.nombre, 198, yDesc, { width: 130 });

							if (venta.con_vencimiento) {
								doc.text(fechaVencimientoTexto, 340, y);
								doc.text(venta.detallesVenta[i].lote, 380, y);
							}

							doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 410, y);
							//doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
							//doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : "0.00"), 490, y);
							doc.text(venta.detallesVenta[i].total.toFixed(2), 530, y);
							if (completa || vacia) {
								doc.rect(50, y - 15, 520, 30).stroke();
							}
						} else {
							venta.detallesVenta[i].fecha_vencimiento = new Date(venta.detallesVenta[i].fecha_vencimiento);
							var fechaVencimientoTexto = venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear().toString().substring(2);

							doc.text(venta.detallesVenta[i].servicio.codigo, 55, y, { width: 70 });
							doc.text(venta.detallesVenta[i].cantidad, 130, y);
							// 							doc.text(venta.detallesVenta[i].servicio.unidad_medida, 155, y - 3, { width: 43 });
							var longitudCaracteres = venta.detallesVenta[i].servicio.nombre.length;
							var yDesc = (longitudCaracteres <= 24) ? y : ((longitudCaracteres > 24 && longitudCaracteres <= 60) ? y - 4 : y - 11);
							doc.text(venta.detallesVenta[i].servicio.nombre, 198, yDesc, { width: 130 });

							if (venta.con_vencimiento) {
								doc.text(fechaVencimientoTexto, 340, y);
								doc.text(venta.detallesVenta[i].lote, 380, y);
							}

							// doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 410, y);
							doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
							// doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : "0.00"), 490, y);
							doc.text(venta.detallesVenta[i].total.toFixed(2), 530, y);
							if (completa || vacia) {
								doc.rect(50, y - 15, 520, 30).stroke();
							}
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
						doc.text("TOTAL", 485, y);
					}
					doc.font('Helvetica', 8);
					doc.text(venta.total.toFixed(2), 530, y);

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
					var detalles = venta.detallesVenta !== undefined ? venta.detallesVenta : venta.detallesProformas
					var y = 240, items = 0, pagina = 1, totalPaginas = Math.ceil(venta.detallesVenta.length / itemsPorPagina);
					DibujarCabeceraFacturaNVmedioOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario, Diccionario);
					for (var i = 0; i < venta.detallesVenta.length && items <= itemsPorPagina; i++) {
						doc.font('Helvetica', 8);
						if (venta.detallesVenta[i].producto) {
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
						} else {
							if (venta.movimiento) {
								venta.movimientoServicio = venta.movimiento.nombre_corto == Diccionario.EGRE_SERVICIO ? venta.movimiento : null
							}
							if (venta.movimientoServicio) {
								venta.detallesVenta[i].fecha_vencimiento = new Date(venta.detallesVenta[i].fecha_vencimiento);
								var fechaVencimientoTexto = venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear().toString().substring(2);

								if (existenDescuentos) {
									var longitudCaracteres = venta.detallesVenta[i].observaciones.length;
									var yDesc = (longitudCaracteres <= 24) ? y : ((longitudCaracteres > 24 && longitudCaracteres <= 60) ? y - 4 : y - 11);
									doc.text(venta.detallesVenta[i].observaciones, 55, yDesc, { width: 200 });
									//doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 300, y);
									doc.text(venta.detallesVenta[i].importe.toFixed(2), 335, y);
									doc.text(venta.detallesVenta[i].descuento.toFixed(2), 385, y);
									doc.text(venta.detallesVenta[i].recargo.toFixed(2), 420, y);
									doc.text(venta.detallesVenta[i].ice.toFixed(2), 455, y);
									doc.text(venta.detallesVenta[i].excento.toFixed(2), 490, y);
									//doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
									//doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : "0.00"), 490, y);
									doc.text(venta.detallesVenta[i].total.toFixed(2), 530, y);
									if (completa || vacia) {
										doc.rect(50, y - 15, 520, 30).stroke();
									}
								} else {
									var longitudCaracteres = venta.detallesVenta[i].observaciones.length;
									var yDesc = (longitudCaracteres <= 24) ? y : ((longitudCaracteres > 24 && longitudCaracteres <= 60) ? y - 4 : y - 11);
									doc.text(venta.detallesVenta[i].observaciones, 55, yDesc, { width: 130 });
									doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
									//doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : "0.00"), 490, y);
									doc.text(venta.detallesVenta[i].total.toFixed(2), 530, y);
									if (completa || vacia) {
										doc.rect(50, y - 15, 520, 30).stroke();
									}
								}
							} else {
								if (existenDescuentos) {
									doc.text(venta.detallesVenta[i].servicio.codigo, 55, y);
									doc.text(venta.detallesVenta[i].cantidad, 115, y);
									// doc.text(venta.detallesVenta[i].servicio.unidad_medida, 140, y);
									doc.text(venta.detallesVenta[i].observaciones, 180, y - 6, { width: 120 });
									doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 300, y);
									doc.text(venta.detallesVenta[i].importe.toFixed(2), 335, y);
									// doc.text(venta.detallesVenta[i].tipo_descuento ? "%" : "Bs", 385, y - 10);
									// doc.text(venta.detallesVenta[i].descuento.toFixed(2), 385, y);
									// doc.text(venta.detallesVenta[i].tipo_recargo ? "%" : "Bs", 420, y - 10);
									// doc.text(venta.detallesVenta[i].recargo.toFixed(2), 420, y);
									// doc.text(venta.detallesVenta[i].ice.toFixed(2), 455, y);
									// doc.text(venta.detallesVenta[i].excento.toFixed(2), 490, y);
									doc.text(venta.detallesVenta[i].total.toFixed(2), 520, y);
								} else {
									doc.text(venta.detallesVenta[i].servicio.codigo, 55, y);
									doc.text(venta.detallesVenta[i].cantidad, 110, y);
									// doc.text(venta.detallesVenta[i].servicio.unidad_medida, 165, y);
									var longitudCaracteres = venta.detallesVenta[i].servicio.nombre.length;
									var yDesc = (longitudCaracteres <= 45) ? y : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? y - 4 : y - 11);
									doc.text(venta.detallesVenta[i].observaciones, 220, yDesc, { width: 225 });
									doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 450, y);
									doc.text(venta.detallesVenta[i].total.toFixed(2), 520, y);
								}
							}
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
							DibujarCabeceraFacturaNVmedioOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario, Diccionario);
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
						doc.text(venta.pieFactura !== undefined && venta.pieFactura !== null ? venta.pieFactura.nombre : "", 50, papel[1] - 60);
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
			if (venta.configuracion.usar_pf) {
				if (vacia) {
					if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 40, { fit: [65, 65] }); } //{ width: 50, height: 50 }
					doc.font('Helvetica-Bold', 8);
					doc.text(usuario.empresa.razon_social.toUpperCase(), 60, 105);
					doc.font('Helvetica', 7);
					doc.text(venta.sucursal.nombre.toUpperCase(), 60, 113);
					var longitudCaracteres = venta.sucursal.direccion.length;
					var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
					doc.text(venta.sucursal.direccion.toUpperCase(), 60, 121);
					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
					doc.text("TELF.: " + telefono, 60, yDesc);
					doc.text("COCHABAMBA - BOLIVIA", 60, yDesc + 8);
				}
				doc.font('Helvetica-Bold', 16);
				doc.text(venta.configuracion.tituloFactura.nombre.toUpperCase(), 250, 90);
				doc.font('Helvetica-Bold', 8);
				if (completa || vacia) {
					doc.rect(380, 40, 190, 50).stroke();
					doc.text("NIT : ", 400, 50);
					doc.text("Nota No : ", 400, 60);
				}
				doc.text(usuario.empresa.nit, 500, 50);
				doc.text(venta.factura, 500, 60);
				if (completa || vacia) {
					doc.rect(50, 160, 520, 40).stroke();
					doc.text("FECHA : ", 60, 165);
					doc.text("SEÑOR(ES) : ", 60, 175);
					doc.text("NIT : ", 360, 165);
				}
				doc.text(venta.fecha_factura ? venta.fecha_factura : venta.fechaTexto, 120, 165);
				doc.text(venta.cliente.razon_social, 120, 175);
				doc.text(venta.cliente.nit, 400, 165);

				if (completa || vacia) {
					doc.rect(50, 200, 520, 25).stroke();
					//doc.rect(50,225,520,papel[1]-175-225).stroke();
					doc.text("CODIGO", 55, 210, { width: 70 });
					doc.text("CANT.", 125, 210);
					if (venta.detallesVenta[0].producto) {
						doc.text("UNIDAD", 155, 210);
					}
					doc.text("DETALLE", 198, 210);

					if (venta.con_vencimiento) {
						doc.text("VENC.", 340, 210);
						doc.text("LOTE", 380, 210);
					}
					if (venta.detallesVenta[0].producto) {
						doc.text("P.UNIT.", 410, 210);
					}
					/*doc.text("IMP.", 450, 210);
					if (venta.detallesVenta[0].producto) {
						doc.text("DESC.", 490, 210);
					}*/
					doc.text("TOTAL", 530, 210);
				}
				doc.font('Helvetica', 7);

				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 500, papel[1] - 60);

			} else {
				if (vacia) {
					if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 40, { fit: [65, 65] }); } //{ width: 50, height: 50 }
					doc.font('Helvetica-Bold', 8);
					doc.text(usuario.empresa.razon_social.toUpperCase(), 60, 105);
					doc.font('Helvetica', 7);
					doc.text(venta.sucursal.nombre.toUpperCase(), 60, 113);
					var longitudCaracteres = venta.sucursal.direccion.length;
					var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
					doc.text(venta.sucursal.direccion.toUpperCase(), 60, 121);
					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
					doc.text("TELF.: " + telefono, 60, yDesc);
					doc.text("COCHABAMBA - BOLIVIA", 60, yDesc + 8);
				}
				doc.font('Helvetica-Bold', 16);
				doc.text(venta.configuracion.tituloFactura.nombre.toUpperCase(), 250, 90);
				doc.font('Helvetica-Bold', 8);
				doc.text(venta.actividad.nombre, 380, 95, { width: 200 });


				if (completa || vacia) {
					doc.rect(380, 40, 190, 50).stroke();
					doc.text("NIT : ", 390, 50);
					doc.text("FACTURA No : ", 390, 60);
					doc.text("AUTORIZACIÓN No : ", 390, 70);
				}
				doc.text(usuario.empresa.nit, 500, 50);
				doc.text(venta.factura, 500, 60);
				doc.text(venta.autorizacion, 500, 70);

				if (completa || vacia) {
					doc.rect(50, 160, 520, 40).stroke();
					doc.text("FECHA : ", 60, 165);
					doc.text("SEÑOR(ES) : ", 60, 175);
					doc.text("NIT : ", 360, 165);
				}
				doc.text(venta.fecha_factura ? venta.fecha_factura : venta.fechaTexto, 120, 165);
				doc.text(venta.cliente.razon_social, 120, 175);
				doc.text(venta.cliente.nit, 400, 165);

				if (completa || vacia) {
					doc.rect(50, 200, 520, 25).stroke();
					//doc.rect(50,225,520,papel[1]-175-225).stroke();
					doc.text("CODIGO", 55, 210, { width: 70 });
					doc.text("CANT.", 125, 210);
					if (venta.detallesVenta[0].producto) {
						doc.text("UNIDAD", 155, 210);
					}
					doc.text("DETALLE", 198, 210);

					if (venta.con_vencimiento) {
						doc.text("VENC.", 340, 210);
						doc.text("LOTE", 380, 210);
					}
					if (venta.detallesVenta[0].producto) {
						doc.text("P.UNIT.", 410, 210);
					}
					doc.text("IMP.", 450, 210);
					if (venta.detallesVenta[0].producto) {
						doc.text("DESC.", 490, 210);
					}
					doc.text("TOTAL", 530, 210);
				}
				doc.font('Helvetica', 7);

				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 500, papel[1] - 60);
			}
		};
		return res;
	}])

	//Imprimir formato Sin Formato del margen
	.factory('ImprimirFacturaCartaOficioSinFormato', ['blockUI', 'VerificarDescuentos', 'Diccionario', 'DibujarCabeceraFacturaNVCartaOficioSinFormato', 'DibujarCabeceraFacturaNVmedioOficio', '$timeout',
		function (blockUI, VerificarDescuentos, Diccionario, DibujarCabeceraFacturaNVCartaOficioSinFormato, DibujarCabeceraFacturaNVmedioOficio, $timeout) {
			var res = function (venta, papel, vacia, completa, semicompleta, usuario) {
				var doc = new PDFDocument({ compress: false, size: papel, margin: 10 });
				var stream = doc.pipe(blobStream());

				if (venta.configuracion.usar_pf) {
					var itemsPorPagina = 0;
					if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_OFICIO) {
						itemsPorPagina = 19;
					} else if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_CARTA) {
						itemsPorPagina = 32;
					} else if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
						itemsPorPagina = 3;
					}
					var y = 240, items = 0, pagina = 1, totalPaginas = Math.ceil(venta.detallesVenta.length / itemsPorPagina);
					DibujarCabeceraFacturaNVCartaOficioSinFormato(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario);
					for (var i = 0; i < venta.detallesVenta.length && items <= itemsPorPagina; i++) {
						doc.font('Helvetica', 8);
						if (venta.detallesVenta[i].producto) {
							venta.detallesVenta[i].fecha_vencimiento = new Date(venta.detallesVenta[i].fecha_vencimiento);
							var fechaVencimientoTexto = venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear().toString().substring(2);

							doc.text(venta.detallesVenta[i].producto.codigo, 55, y, { width: 70 });
							doc.text(venta.detallesVenta[i].cantidad, 135, y);
							doc.text(venta.detallesVenta[i].producto.unidad_medida, 180, y - 3, { width: 43 });
							var longitudCaracteres = venta.detallesVenta[i].producto.nombre.length;
							var yDesc = (longitudCaracteres <= 27) ? y : ((longitudCaracteres > 27 && longitudCaracteres <= 63) ? y - 4 : y - 11);
							doc.text(venta.detallesVenta[i].producto.nombre, 240, yDesc, { width: 250 });

							if (venta.con_vencimiento) {
								doc.text(fechaVencimientoTexto, 340, y);
								doc.text(venta.detallesVenta[i].lote, 380, y);
							}

							doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 505, y);
							//doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
							//doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : "0.00"), 490, y);
							doc.text(venta.detallesVenta[i].total.toFixed(2), 560, y);
							if (completa || vacia) {
								//doc.rect(50, y - 15, 520, 30).stroke();
							}
						} else {
							venta.detallesVenta[i].fecha_vencimiento = new Date(venta.detallesVenta[i].fecha_vencimiento);
							var fechaVencimientoTexto = venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear().toString().substring(2);

							doc.text(venta.detallesVenta[i].servicio.codigo, 55, y, { width: 70 });
							doc.text(venta.detallesVenta[i].cantidad, 130, y);
							// 							doc.text(venta.detallesVenta[i].servicio.unidad_medida, 155, y - 3, { width: 43 });
							var longitudCaracteres = venta.detallesVenta[i].observaciones.length;
							var yDesc = (longitudCaracteres <= 24) ? y : ((longitudCaracteres > 24 && longitudCaracteres <= 60) ? y - 4 : y - 11);
							doc.text(venta.detallesVenta[i].observaciones, 198, yDesc, { width: 130 });

							if (venta.con_vencimiento) {
								doc.text(fechaVencimientoTexto, 340, y);
								doc.text(venta.detallesVenta[i].lote, 380, y);
							}

							// doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 410, y);
							doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
							// doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : "0.00"), 490, y);
							doc.text(venta.detallesVenta[i].total.toFixed(2), 580, y);
							/*if (completa || vacia) {
								doc.rect(50, y - 15, 520, 30).stroke();
							}*/
						}
						y = y + 15;
						items++;
						if (items == itemsPorPagina) {
							doc.addPage({ size: papel, margin: 10 });
							y = 240;
							items = 0;
							pagina = pagina + 1;
							DibujarCabeceraFacturaNVCartaOficioSinFormato(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario);
						}
					}
					if (completa || vacia) {
						doc.font('Helvetica-Bold', 8);
						doc.text("TOTAL", 500, y);
					}
					doc.font('Helvetica', 8);
					doc.text(venta.total.toFixed(2), 560, y);

					doc.text("SON : " + venta.numero_literal, 55, y);

					if (completa || vacia) {
						doc.rect(50, y - 5, 545, 15).stroke();
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
						itemsPorPagina = 32;
					} else if (venta.configuracion.tamanoPapelFactura.nombre_corto == Diccionario.FACT_PAPEL_MEDIOOFICIO) {
						itemsPorPagina = 3;
					}
					var detalles = venta.detallesVenta !== undefined ? venta.detallesVenta : venta.detallesProformas
					var y = 240, items = 0, pagina = 1, totalPaginas = Math.ceil(venta.detallesVenta.length / itemsPorPagina);
					DibujarCabeceraFacturaNVmedioOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario, Diccionario);
					for (var i = 0; i < venta.detallesVenta.length && items <= itemsPorPagina; i++) {
						doc.font('Helvetica', 8);
						if (venta.detallesVenta[i].producto) {
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
						} else {
							if (venta.movimiento) {
								venta.movimientoServicio = venta.movimiento.nombre_corto == Diccionario.EGRE_SERVICIO ? venta.movimiento : null
							}
							if (venta.movimientoServicio) {
								venta.detallesVenta[i].fecha_vencimiento = new Date(venta.detallesVenta[i].fecha_vencimiento);
								var fechaVencimientoTexto = venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear().toString().substring(2);

								if (existenDescuentos) {
									var longitudCaracteres = venta.detallesVenta[i].observaciones.length;
									var yDesc = (longitudCaracteres <= 24) ? y : ((longitudCaracteres > 24 && longitudCaracteres <= 60) ? y - 4 : y - 11);
									doc.text(venta.detallesVenta[i].observaciones, 55, yDesc, { width: 200 });
									//doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 300, y);
									doc.text(venta.detallesVenta[i].importe.toFixed(2), 335, y);
									doc.text(venta.detallesVenta[i].descuento.toFixed(2), 385, y);
									doc.text(venta.detallesVenta[i].recargo.toFixed(2), 420, y);
									doc.text(venta.detallesVenta[i].ice.toFixed(2), 455, y);
									doc.text(venta.detallesVenta[i].excento.toFixed(2), 490, y);
									//doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
									//doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : "0.00"), 490, y);
									doc.text(venta.detallesVenta[i].total.toFixed(2), 530, y);
									if (completa || vacia) {
										doc.rect(50, y - 15, 520, 30).stroke();
									}
								} else {
									var longitudCaracteres = venta.detallesVenta[i].observaciones.length;
									var yDesc = (longitudCaracteres <= 24) ? y : ((longitudCaracteres > 24 && longitudCaracteres <= 60) ? y - 4 : y - 11);
									doc.text(venta.detallesVenta[i].observaciones, 55, yDesc, { width: 130 });
									doc.text(venta.detallesVenta[i].importe.toFixed(2), 450, y);
									//doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : "0.00"), 490, y);
									doc.text(venta.detallesVenta[i].total.toFixed(2), 530, y);
									if (completa || vacia) {
										doc.rect(50, y - 15, 520, 30).stroke();
									}
								}
							} else {
								if (existenDescuentos) {
									doc.text(venta.detallesVenta[i].servicio.codigo, 55, y);
									doc.text(venta.detallesVenta[i].cantidad, 115, y);
									// doc.text(venta.detallesVenta[i].servicio.unidad_medida, 140, y);
									doc.text(venta.detallesVenta[i].observaciones, 180, y - 6, { width: 120 });
									doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 300, y);
									doc.text(venta.detallesVenta[i].importe.toFixed(2), 335, y);
									// doc.text(venta.detallesVenta[i].tipo_descuento ? "%" : "Bs", 385, y - 10);
									// doc.text(venta.detallesVenta[i].descuento.toFixed(2), 385, y);
									// doc.text(venta.detallesVenta[i].tipo_recargo ? "%" : "Bs", 420, y - 10);
									// doc.text(venta.detallesVenta[i].recargo.toFixed(2), 420, y);
									// doc.text(venta.detallesVenta[i].ice.toFixed(2), 455, y);
									// doc.text(venta.detallesVenta[i].excento.toFixed(2), 490, y);
									doc.text(venta.detallesVenta[i].total.toFixed(2), 520, y);
								} else {
									doc.text(venta.detallesVenta[i].servicio.codigo, 55, y);
									doc.text(venta.detallesVenta[i].cantidad, 110, y);
									// doc.text(venta.detallesVenta[i].servicio.unidad_medida, 165, y);
									var longitudCaracteres = venta.detallesVenta[i].observaciones.length;
									var yDesc = (longitudCaracteres <= 45) ? y : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? y - 4 : y - 11);
									doc.text(venta.detallesVenta[i].observaciones, 220, yDesc, { width: 225 });
									doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 450, y);
									doc.text(venta.detallesVenta[i].total.toFixed(2), 520, y);
								}
							}
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
							DibujarCabeceraFacturaNVmedioOficio(doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario, Diccionario);
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
						doc.text(venta.pieFactura !== undefined && venta.pieFactura !== null ? venta.pieFactura.nombre : "", 50, papel[1] - 60);
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

	.factory('DibujarCabeceraFacturaNVCartaOficioSinFormato', [function () {
		var res = function (doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario) {
			if (venta.configuracion.usar_pf) {
				if (vacia) {
					if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 40, { fit: [65, 65] }); } //{ width: 50, height: 50 }
					doc.font('Helvetica-Bold', 8);
					doc.text(usuario.empresa.razon_social.toUpperCase(), 60, 105);
					doc.font('Helvetica', 7);
					doc.text(venta.sucursal.nombre.toUpperCase(), 60, 113);
					//var longitudCaracteres = venta.sucursal.direccion.length;
					//var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
					//doc.text(venta.sucursal.direccion.toUpperCase(), 60, 121);
					var longitudCaracteres = venta.sucursal.direccion.length;
					var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
					doc.text(venta.sucursal.direccion.toUpperCase(), 60, 120, { width: 150 });
					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");

					doc.text("TELF.: " + telefono, 60, yDesc);
					yDesc += 11
					doc.font('Helvetica-Bold').text("COCHABAMBA - BOLIVIA", 60, yDesc);
				}
				doc.font('Helvetica-Bold', 16);
				doc.text(venta.configuracion.tituloFactura.nombre.toUpperCase(), 250, 90);
				doc.font('Helvetica-Bold', 10);
				if (completa || vacia) {
					//doc.rect(380, 40, 190, 50).stroke();
					doc.text("NIT : ", 410, 50);
					doc.text("Nota No : ", 410, 60);
				}

				doc.text(usuario.empresa.nit, 500, 50);
				doc.font('Helvetica-Bold', 13);
				doc.text(venta.factura, 500, 60);
				doc.font('Helvetica-Bold', 10);
				if (completa || vacia) {
					//doc.rect(50, 160, 520, 40).stroke();
					doc.text("FECHA : ", 60, 165);
					doc.text("SEÑOR(ES) : ", 60, 175);
					doc.text("NIT : ", 470, 165);
				}
				doc.text(venta.fecha_factura ? venta.fecha_factura : venta.fechaTexto, 120, 165);
				doc.text(venta.cliente.razon_social, 130, 175);
				doc.text(venta.cliente.nit, 530, 165);

				if (completa || vacia) {
					doc.rect(50, 200, 545, 25).stroke();
					//doc.rect(50,225,520,papel[1]-175-225).stroke();
					doc.text("CODIGO", 55, 210, { width: 70 });
					doc.text("CANT.", 125, 210);
					if (venta.detallesVenta[0].producto) {
						doc.text("UNIDAD", 175, 210);
					}
					doc.text("DETALLE", 250, 210);

					if (venta.con_vencimiento) {
						doc.text("VENC.", 340, 210);
						doc.text("LOTE", 380, 210);
					}
					if (venta.detallesVenta[0].producto) {
						doc.text("P.UNIT.", 500, 210);
					}
					/*doc.text("IMP.", 450, 210);
					if (venta.detallesVenta[0].producto) {
						doc.text("DESC.", 490, 210);
					}*/
					doc.text("TOTAL", 555, 210);
				}
				doc.font('Helvetica', 7);

				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 500, papel[1] - 60);

			} else {
				if (vacia) {
					if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 40, { fit: [65, 65] }); } //{ width: 50, height: 50 }
					doc.font('Helvetica-Bold', 8);
					doc.text(usuario.empresa.razon_social.toUpperCase(), 60, 105);
					doc.font('Helvetica', 7);
					doc.text(venta.sucursal.nombre.toUpperCase(), 60, 113);
					/*var longitudCaracteres = venta.sucursal.direccion.length;
					var yDesc = (longitudCaracteres <= 24) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
					doc.text(venta.sucursal.direccion.toUpperCase(), 60, yDesc,{width: 150});

					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
					doc.text("TELF.: " + telefono, 60, yDesc);
					doc.text("COCHABAMBA - BOLIVIA", 60, yDesc + 8);*/
					var longitudCaracteres = venta.sucursal.direccion.length;
					var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
					doc.text(venta.sucursal.direccion.toUpperCase(), 60, 120, { width: 150 });
					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");

					doc.text("TELF.: " + telefono, 60, yDesc);
					yDesc += 11
					doc.font('Helvetica-Bold').text("COCHABAMBA - BOLIVIA", 60, yDesc);
				}
				doc.font('Helvetica-Bold', 16);
				doc.text(venta.configuracion.tituloFactura.nombre.toUpperCase(), 250, 90);
				doc.font('Helvetica-Bold', 8);
				doc.text(venta.actividad.nombre, 380, 95, { width: 200 });


				if (completa || vacia) {
					//doc.rect(380, 40, 190, 50).stroke();
					doc.text("NIT : ", 390, 50);
					doc.text("FACTURA No : ", 390, 60);
					doc.text("AUTORIZACIÓN No : ", 390, 70);
				}
				doc.text(usuario.empresa.nit, 500, 50);
				doc.text(venta.factura, 500, 60);
				doc.text(venta.autorizacion, 500, 70);

				if (completa || vacia) {
					//doc.rect(50, 160, 520, 40).stroke();
					doc.text("FECHA : ", 60, 165);
					doc.text("SEÑOR(ES) : ", 60, 175);
					doc.text("NIT : ", 360, 165);
				}
				doc.text(venta.fecha_factura ? venta.fecha_factura : venta.fechaTexto, 120, 165);
				doc.text(venta.cliente.razon_social, 130, 175);
				doc.text(venta.cliente.nit, 410, 165);

				if (completa || vacia) {
					//doc.rect(50, 200, 520, 25).stroke();
					//doc.rect(50,225,520,papel[1]-175-225).stroke();
					doc.text("CODIGO", 55, 210, { width: 70 });
					doc.text("CANT.", 125, 210);
					if (venta.detallesVenta[0].producto) {
						doc.text("UNIDAD", 155, 210);
					}
					doc.text("DETALLE", 198, 210);

					if (venta.con_vencimiento) {
						doc.text("VENC.", 340, 210);
						doc.text("LOTE", 380, 210);
					}
					if (venta.detallesVenta[0].producto) {
						doc.text("P.UNIT.", 410, 210);
					}
					/*doc.text("IMP.", 450, 210);
					if (venta.detallesVenta[0].producto) {
						doc.text("DESC.", 490, 210);
					}*/
					doc.text("TOTAL", 530, 210);
				}
				doc.font('Helvetica', 7);

				doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 500, papel[1] - 60);
			}
		};
		return res;
	}])

	.factory('DibujarCabeceraFacturaNVmedioOficio', ['VerificarDescuentos', function (VerificarDescuentos) {
		var res = function (doc, vacia, completa, venta, papel, pagina, totalPaginas, usuario, Diccionario) {
			if (venta.configuracion.usar_pf) {
				if (vacia) {
					if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 40, { fit: [65, 65] }); } //width: 50, height: 50
					doc.font('Helvetica-Bold', 8);
					doc.text(usuario.empresa.razon_social.toUpperCase(), 60, 105);
					doc.font('Helvetica', 7);
					doc.text(venta.sucursal.nombre.toUpperCase(), 60, 113);
					var longitudCaracteres = venta.sucursal.direccion.length;
					var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
					doc.text(venta.sucursal.direccion.toUpperCase(), 60, 121, { width: 200 });
					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
					doc.text("TELF.: " + telefono, 60, yDesc);
					doc.text("COCHABAMBA - BOLIVIA", 60, yDesc + 8);
				}
				doc.font('Helvetica-Bold', 16);
				doc.text(venta.configuracion.tituloFactura.nombre.toUpperCase(), 250, 100);
				doc.font('Helvetica-Bold', 8);


				if (completa || vacia) {
					doc.rect(380, 40, 190, 50).stroke();
					doc.text("NIT : ", 390, 50);
					doc.text("NOTA No : ", 390, 60);

				}
				doc.text(usuario.empresa.nit, 500, 50);
				doc.text(venta.factura, 500, 60);
				doc.text(venta.autorizacion, 500, 70);
				if (completa || vacia) {
					doc.rect(50, 160, 520, 40).stroke();
					doc.text("FECHA : ", 60, 165);
					doc.text("SEÑOR(ES) : ", 60, 175);
					doc.text("NIT : ", 360, 165);
				}
				doc.text(venta.fecha_factura ? venta.fecha_factura : venta.fechaTexto, 120, 165);
				doc.text(venta.cliente.razon_social, 120, 175);
				doc.text(venta.cliente.nit, 400, 165);
				if (completa || vacia) {
					doc.rect(50, 200, 520, 25).stroke();
					//doc.rect(50,225,520,papel[1]-175-225).stroke();
					var existenDescuentos = VerificarDescuentos(venta.detallesVenta);
					if (existenDescuentos) {
						doc.text("CODIGO", 55, 210);
						doc.text("CANT.", 110, 210);
						doc.text("DETALLE", 160, 210);
						doc.text("P. UNIT.", 300, 210);
						doc.text("IMPORTE", 335, 210);
						if (venta.detallesVenta[0].producto) {
							doc.text("UNID.", 140, 210);
							doc.text("DESC.", 385, 210);
							doc.text("REC.", 420, 210);
							doc.text("ICE", 455, 210);
							doc.text("EXC.", 490, 210);
						}
						doc.text("TOTAL", 520, 210);
					} else {
						doc.text("CODIGO", 55, 210);
						doc.text("CANTIDAD", 110, 210);
						if (venta.detallesVenta[0].producto) {
							doc.text("UNIDAD", 165, 210);
						}
						doc.text("DETALLE", 220, 210);
						doc.text("P.UNIT.", 450, 210);
						doc.text("TOTAL", 520, 210);
					}
				}
			} else {
				if (vacia) {
					if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 40, { fit: [65, 65] }); } //width: 50, height: 50
					doc.font('Helvetica-Bold', 8);
					doc.text(usuario.empresa.razon_social.toUpperCase(), 60, 105);
					doc.font('Helvetica', 7);
					doc.text(venta.sucursal.nombre.toUpperCase(), 60, 113);
					var longitudCaracteres = venta.sucursal.direccion.length;
					var yDesc = (longitudCaracteres <= 45) ? 129 : ((longitudCaracteres > 45 && longitudCaracteres <= 90) ? 139 : 145);
					doc.text(venta.sucursal.direccion.toUpperCase(), 60, 121, { width: 200 });
					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
					doc.text("TELF.: " + telefono, 60, yDesc);
					doc.text("COCHABAMBA - BOLIVIA", 60, yDesc + 8);
				}
				doc.font('Helvetica-Bold', 16);
				doc.text(venta.configuracion.tituloFactura.nombre.toUpperCase(), 250, 100);
				doc.font('Helvetica-Bold', 8);
				doc.text(venta.actividad.nombre, 380, 105, { width: 200 });

				if (completa || vacia) {
					doc.rect(380, 40, 190, 50).stroke();
					doc.text("NIT : ", 390, 50);
					doc.text("FACTURA No : ", 390, 60);
					doc.text("AUTORIZACIÓN No : ", 390, 70);
				}
				doc.text(usuario.empresa.nit, 500, 50);
				doc.text(venta.factura, 500, 60);
				doc.text(venta.autorizacion, 500, 70);
				if (completa || vacia) {
					doc.rect(50, 160, 520, 40).stroke();
					doc.text("FECHA : ", 60, 165);
					doc.text("SEÑOR(ES) : ", 60, 175);
					doc.text("NIT : ", 360, 165);
				}
				doc.text(venta.fecha_factura ? venta.fecha_factura : venta.fechaTexto, 120, 165);
				doc.text(venta.cliente.razon_social, 120, 175);
				doc.text(venta.cliente.nit, 400, 165);
				if (completa || vacia) {
					doc.rect(50, 200, 520, 25).stroke();
					//doc.rect(50,225,520,papel[1]-175-225).stroke();
					var existenDescuentos = VerificarDescuentos(venta.detallesVenta);
					if (venta.movimiento) {
						venta.movimientoServicio = venta.movimiento.nombre_corto == Diccionario.EGRE_SERVICIO ? venta.movimiento : null
					}
					if (venta.movimientoServicio) {
						if (existenDescuentos) {
							doc.text("DETALLE", 55, 210);
							doc.text("IMPORTE", 335, 210);
							doc.text("DESC.", 385, 210);
							doc.text("REC.", 420, 210);
							doc.text("ICE", 455, 210);
							doc.text("EXC.", 490, 210);

							doc.text("TOTAL", 520, 210);
						} else {
							doc.text("DETALLE", 55, 210);
							doc.text("IMPORTE", 450, 210);
							doc.text("TOTAL", 520, 210);
						}
					} else {
						if (existenDescuentos) {
							doc.text("CODIGO", 55, 210);
							doc.text("CANT.", 110, 210);
							doc.text("DETALLE", 160, 210);
							doc.text("P. UNIT.", 300, 210);
							doc.text("IMPORTE", 335, 210);
							if (venta.detallesVenta[0].producto) {
								doc.text("UNID.", 140, 210);
								doc.text("DESC.", 385, 210);
								doc.text("REC.", 420, 210);
								doc.text("ICE", 455, 210);
								doc.text("EXC.", 490, 210);
							}
							doc.text("TOTAL", 520, 210);
						} else {
							doc.text("CODIGO", 55, 210);
							doc.text("CANTIDAD", 110, 210);
							if (venta.detallesVenta[0].producto) {
								doc.text("UNIDAD", 165, 210);
							}
							doc.text("DETALLE", 220, 210);
							doc.text("P.UNIT.", 450, 210);
							doc.text("TOTAL", 520, 210);
						}
					}
				}
			}

		};
		return res;
	}])

	.factory('ImprimirPedido', [function () {
		var res = function (venta, esAccionGuardar, doc, stream, sizeY, usuario, llevar) {


			for (var j = 0; j < venta.sucursal.copias_impresion_pedido; j++) {
				if (j != 0) {
					doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
				}
				doc.font('Helvetica-Bold', 12);
				if (llevar) {
					doc.text("PARA LLEVAR¡¡¡", { align: 'center' })
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
					if (venta.detallesVenta[i].producto) {
						if (venta.detallesVenta[i].producto.nombre.length > 40) {
							doc.fontSize(9);
						}
						doc.text(venta.detallesVenta[i].producto.nombre, 50, y, { width: 90 });
						doc.text(venta.detallesVenta[i].total.toFixed(2), 150, y);
						doc.fontSize(10);
					} else {
						if (venta.detallesVenta[i].servicio.nombre.length > 40) {
							doc.fontSize(9);
						}
						doc.text(venta.detallesVenta[i].servicio.nombre, 50, y, { width: 90 });
						doc.text((venta.detallesVenta[i].total ? venta.detallesVenta[i].total.toFixed(2) : venta.detallesVenta[i].importe.toFixed(2)), 150, y);
						doc.fontSize(10);
					}

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
				doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
				doc.font('Helvetica-Bold', 12);
				if (llevar) {
					doc.text("PARA LLEVAR¡¡¡", { align: 'center' })
				}
				doc.font('Helvetica-Bold', 14);
				doc.text(usuario.empresa.razon_social, { align: 'left' });
				var x = doc.x
				var y = doc.y;
				doc.text("Nro. Pedido : ", 20, y, { align: 'left' });
				doc.font('Helvetica-Bold', 22);
				doc.text(venta.pedido, 120, y - 5);
				/* doc.text(venta.sucursal.frase_pedido + " : " + venta.factura, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("Cliente : " + venta.cliente.razon_social, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("NIT/CI : " + venta.cliente.nit, { align: 'left' }); */
				doc.font('Helvetica', 12);
				doc.x = 20
				y = doc.y;
				doc.text("Cant.   Producto         Subtotal", { align: 'left' });
				/* x=20 */
				y = doc.y;
				doc.fontSize(10);
				for (var i = 0; i < venta.detallesVenta.length; i++) {
					doc.text(venta.detallesVenta[i].cantidad, 20, y);
					if (venta.detallesVenta[i].producto) {
						if (venta.detallesVenta[i].producto.nombre.length > 40) {
							doc.fontSize(9);
						}
						doc.text(venta.detallesVenta[i].producto.nombre, 50, y, { width: 90 });
						doc.text(venta.detallesVenta[i].total.toFixed(2), 150, y);
						doc.fontSize(10);
					} else {
						if (venta.detallesVenta[i].servicio.nombre.length > 40) {
							doc.fontSize(9);
						}
						doc.text(venta.detallesVenta[i].servicio.nombre, 50, y, { width: 90 });
						doc.text((venta.detallesVenta[i].total ? venta.detallesVenta[i].total.toFixed(2) : venta.detallesVenta[i].importe.toFixed(2)), 150, y);
						doc.fontSize(10);
					}
					y = y + 20;
				}
				doc.moveDown(4);
				doc.x = 0;
				doc.text("Gracias por su preferencia", { align: 'center' });
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
					if (venta.detallesVenta[i].producto) {
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
					} else {
						if (venta.detallesVenta[i].servicio.nombre.length > 40) {
							doc.fontSize(6);
						}
						doc.text(venta.detallesVenta[i].servicio.nombre, 35, y, { width: 100 });
						doc.fontSize(7);
						doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 145, y);
						doc.text(venta.detallesVenta[i].importe.toFixed(2), 180, y);
						sumaDescuento = sumaDescuento + (venta.detallesVenta[i].tipo_descuento ? (venta.detallesVenta[i].importe * (venta.detallesVenta[i].descuento / 100)) : venta.detallesVenta[i].descuento);
						sumaRecargo = sumaRecargo + (venta.detallesVenta[i].tipo_recargo ? (venta.detallesVenta[i].importe * (venta.detallesVenta[i].recargo / 100)) : venta.detallesVenta[i].recargo);
						sumaIce = sumaIce + venta.detallesVenta[i].ice;
						sumaExcento = sumaExcento + venta.detallesVenta[i].excento;
					}

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
				if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 75, doc.y, { align: 'center', fit: [75, 75] }); }  //{ width: 80, height: 50 }
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
					if (venta.detallesVenta[i].producto) {
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
					} else {
						if (venta.detallesVenta[i].servicio.nombre.length > 40) {
							doc.fontSize(6);
						}
						doc.text(venta.detallesVenta[i].servicio.nombre, 40, y, { width: 100 });
						doc.fontSize(7);
						doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 150, y);
						doc.text(venta.detallesVenta[i].importe.toFixed(2), 175, y);
					}

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
				doc.text((venta.pieFactura) ? venta.pieFactura.nombre : ""/*,0,doc.y*/, { align: 'center', width: 150 });
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
			var res = function (venta, esAccionGuardar, usuario, llevar) {
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
							doc = new PDFDocument({ compress: false, size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							stream = doc.pipe(blobStream());
							ImprimirPedido(venta, esAccionGuardar, doc, stream, sizeY, usuario, llevar);
						}
					} else {
						doc = new PDFDocument({ compress: false, size: papel, margins: { top: 0, bottom: 0, left: 20, right: 20 } });
						stream = doc.pipe(blobStream());
						ImprimirProformaRollo(venta, papel, doc, stream, usuario);
						if (usuario.empresa.usar_pedidos) {
							var sizeY = 230 + (20 * venta.detallesVenta.length);
							doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
							ImprimirPedido(venta, esAccionGuardar, doc, stream, sizeY, usuario, llevar);
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
				var doc = new PDFDocument({ compress: false, size: papel, margin: 10 });
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
							if (venta.con_vencimiento) {
								doc.text(venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear(), 245, y);
								doc.text(venta.detallesVenta[i].lote, 285, y);
							}
						}
						doc.text(venta.detallesVenta[i].precio_unitario.toFixed(2), 310, y);
						doc.text(venta.detallesVenta[i].importe.toFixed(2), 345, y);
						doc.text((venta.detallesVenta[i].descuento ? venta.detallesVenta[i].descuento.toFixed(2) : 0), 395, y);
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
							if (venta.con_vencimiento) {
								doc.text(venta.detallesVenta[i].fecha_vencimiento.getDate() + "/" + (venta.detallesVenta[i].fecha_vencimiento.getMonth() + 1) + "/" + venta.detallesVenta[i].fecha_vencimiento.getFullYear(), 360, y);
								doc.text(venta.detallesVenta[i].lote, 415, y);
							}
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
					if (usuario.empresa.imagen.length > 100) { doc.image(usuario.empresa.imagen, 60, 50, { fit: [75, 75] }); } //{ width: 50, height: 50 }
					doc.font('Helvetica-Bold', 8);
					doc.text(usuario.empresa.razon_social.toUpperCase(), 150, 60);
					doc.font('Helvetica', 7);
					doc.text(venta.sucursal.nombre.toUpperCase(), 150, 70);
					doc.text(venta.sucursal.direccion.toUpperCase(), 150, 80);
					var telefono = (venta.sucursal.telefono1 != null ? venta.sucursal.telefono1 : "") +
						(venta.sucursal.telefono2 != null ? "-" + venta.sucursal.telefono2 : "") +
						(venta.sucursal.telefono3 != null ? "-" + venta.sucursal.telefono3 : "");
					doc.text("TELF.: " + telefono, 150, 90);
					doc.text("COCHABAMBA - BOLIVIA", 150, 100);
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
				doc.text(venta.fecha_factura ? venta.fecha_factura : venta.fechaTexto, 120, 165);
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
							if (venta.con_vencimiento) {
								doc.text("VENC.", 245, 210)
								doc.text("LOTE.", 280, 210)
							}
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
							if (venta.con_vencimiento) {
								doc.text("VENC.", 360, 210)
								doc.text("LOTE.", 415, 210)
							}
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

				var doc = new PDFDocument({ compress: false, size: papel, margin: 0 });
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
				var doc = new PDFDocument({ compress: false, size: papel, margins: { top: 10, bottom: 10, left: 10, right: 20 } });
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
				var doc = new PDFDocument({ compress: false, size: papel, margin: 0 });
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
							if (traspaso.detallesVenta[i].inventario) {
								var fecha_vencimiento = new Date(traspaso.detallesVenta[i].inventario.fecha_vencimiento);
								doc.text(fecha_vencimiento.getDate() + "/" + (fecha_vencimiento.getMonth() + 1) + "/" + fecha_vencimiento.getFullYear(), 390, y);

								doc.text(traspaso.detallesVenta[i].inventario.lote, 455, y);
							}
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
				var doc = new PDFDocument({ compress: false, size: papel, margins: { top: 10, bottom: 10, left: 10, right: 20 } });
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
					if (traspaso.detallesVenta[i].inventario) {
						var fecha_vencimiento = new Date(traspaso.detallesVenta[i].inventario.fecha_vencimiento); console.log(new Date().getFullYear().toString().substr(-2));
						doc.text(fecha_vencimiento.getDate() + "/" + (fecha_vencimiento.getMonth() + 1) + "/" + fecha_vencimiento.getFullYear().toString().substr(-2), 128, y);
						doc.text(traspaso.detallesVenta[i].inventario.lote, 164, y);
					}
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
		}])

	.factory('ImprimirPdfAlertaDespacho', ['blockUI', 'DibujarCabeceraPDFAlertaDespacho',
		function (blockUI, DibujarCabeceraPDFAlertaDespacho) {
			var res = function (despachos, filtro, usuario, convertirFecha) {
				blockUI.start();
				var doc = new PDFDocument({ compress: false, size: 'letter', margin: 10 });
				var stream = doc.pipe(blobStream());
				// draw some text
				var totalCosto = 0;
				var y = 130, itemsPorPagina = 24, items = 0, pagina = 1, totalPaginas = Math.ceil(despachos.length / itemsPorPagina);
				DibujarCabeceraPDFAlertaDespacho(doc, 1, totalPaginas, despachos, filtro, usuario, convertirFecha);
				doc.font('Helvetica', 8);
				for (var i = 0; i < despachos.length && items <= itemsPorPagina; i++) {
					var detalle_despacho = despachos[i]
					/* doc.rect(30, y - 10, 555, 20).stroke(); */
					doc.text(i + 1, 45, y);
					doc.text(detalle_despacho.despacho.usuario.persona.nombre_completo, 70, y, { width: 100 });
					doc.text(detalle_despacho.despacho.cliente.razon_social, 190, y, { width: 100 });
					doc.text(detalle_despacho.producto.nombre, 300, y, { width: 110 });
					doc.text(detalle_despacho.cantidad, 420, y, { width: 50 });
					doc.text(detalle_despacho.cantidad_despacho, 460, y, { width: 50 });
					doc.text(detalle_despacho.cantidad - detalle_despacho.cantidad_despacho, 500, y, { width: 50 });
					doc.text("Bs. " + detalle_despacho.servicio_transporte + ".-", 545, y, { width: 80 });
					y = y + 25;
					items++;

					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 130;
						items = 0;
						pagina = pagina + 1;
						DibujarCabeceraPDFAlertaDespacho(doc, pagina, totalPaginas, despachos, filtro, usuario, convertirFecha);
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
			return res;
		}])
	.factory('ImprimirPdfDespachos', ['blockUI', 'DibujarCabeceraPDFDespacho',
		function (blockUI, DibujarCabeceraPDFDespacho) {
			var res = function (despachos, filtro, usuario) {
				blockUI.start();
				var doc = new PDFDocument({ compress: false, size: 'letter', margin: 10 });
				var stream = doc.pipe(blobStream());
				// draw some text
				var totalCosto = 0, totalTransporte = 0;
				var y = 130, itemsPorPagina = 24, items = 0, pagina = 1, totalPaginas = Math.ceil(despachos.length / itemsPorPagina);
				DibujarCabeceraPDFDespacho(doc, 1, totalPaginas, despachos, filtro, usuario);
				doc.font('Helvetica', 8);
				for (var i = 0; i < despachos.length && items <= itemsPorPagina; i++) {
					var detalle_despacho = despachos[i]
					/* doc.rect(30, y - 10, 555, 20).stroke(); */
					doc.text(i + 1, 45, y);
					doc.text(detalle_despacho.despacho.usuario.persona.nombre_completo, 70, y, { width: 100 });
					doc.text(detalle_despacho.despacho.cliente.razon_social, 190, y, { width: 100 });
					doc.text(detalle_despacho.producto.nombre, 320, y, { width: 110 });
					doc.text(detalle_despacho.cantidad, 440, y, { width: 50 });
					doc.text("Bs. " + detalle_despacho.servicio_transporte + ".-", 500, y, { width: 80 });
					y = y + 25;
					items++;

					if (items == itemsPorPagina) {
						doc.addPage({ margin: 0, bufferPages: true });
						y = 130;
						items = 0;
						pagina = pagina + 1;
						DibujarCabeceraPDFDespacho(doc, pagina, totalPaginas, despachos, filtro, usuario);
						doc.font('Helvetica', 8);
					}
					totalCosto += detalle_despacho.cantidad
					totalTransporte += detalle_despacho.servicio_transporte
				}
				doc.font('Helvetica-Bold', 8);
				doc.text("TOTALES:", 350, y, { width: 80 });
				doc.text(totalCosto, 440, y, { width: 80 });
				doc.text("Bs. " + totalTransporte + ".-", 500, y, { width: 80 });
				doc.end();
				stream.on('finish', function () {
					var fileURL = stream.toBlobURL('application/pdf');
					window.open(fileURL, '_blank', 'location=no');
				});
				blockUI.stop();

			}
			return res;
		}])

	.factory('ExportarExelAlarmasDespachos', ['blockUI',
		function (blockUI) {
			res = function (despachos, filtro, usuario) {
				var vendedor = "Todos"
				var cliente = "Todos"
				if (filtro.empleado != "") {
					vendedor = despachos[0].despacho.usuario.persona.nombre_completo
				}
				if (filtro.razon_social != "") {
					cliente = despachos[0].despacho.cliente.razon_social
				}
				var data = [["", "", "REPORTE DE PEDIDOS "], ["Vendedor :" + vendedor], ["Cliente :" + cliente], ["Nro", "Vendedor", "Cliente", "Direccion", "Razón social", "Fecha", "Producto", "Cant.", "Desp.", "Saldo", "S. Transp."]]
				var totalCosto = 0;
				for (var i = 0; i < despachos.length; i++) {
					var detalle_despacho = despachos[i]
					detalle_despacho.despacho.usuario.persona.nombre_completo
					var columns = [];
					columns.push(i + 1)
					columns.push(detalle_despacho.despacho.usuario.persona.nombre_completo)
					columns.push(detalle_despacho.despacho.cliente.razon_social)
					columns.push(detalle_despacho.despacho.destino.direccion)
					columns.push(detalle_despacho.despacho.cliente_razon.razon_social)
					var fecha = new Date(detalle_despacho.despacho.fecha)
					var dia = ((fecha.getDate()) >= 10) ? fecha.getDate() : "0" + fecha.getDate()
					var mes = ((fecha.getMonth()) >= 10) ? (fecha.getMonth() + 1) : "0" + (fecha.getMonth() + 1)
					columns.push(dia + "/" + mes + "/" + fecha.getFullYear())
					columns.push(detalle_despacho.producto.nombre)
					columns.push(detalle_despacho.cantidad)
					columns.push(detalle_despacho.cantidad_despacho)
					var desp = detalle_despacho.cantidad - detalle_despacho.cantidad_despacho
					columns.push(desp)
					columns.push(detalle_despacho.servicio_transporte)
					data.push(columns);
				}

				var ws_name = "SheetJS";
				var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-PEDIDOS.xlsx");
				blockUI.stop();

			}
			return res;
		}])
	.factory('ExportarExelDespachos', ['blockUI',
		function (blockUI) {
			res = function (despachos, filtro, usuario) {
				var vendedor = "Todos"
				var cliente = "Todos"
				/* if (filtro.empleado != "") {
					vendedor = despachos[0].despacho.usuario.persona.nombre_completo
				}
				if (filtro.razon_social != "") {
					cliente = despachos[0].despacho.cliente.razon_social
				} */
				var data = [["", "", "REPORTE DE DESPACHOS "]/*,  ["Vendedor :" +vendedor], ["Cliente :" + cliente] */, ["cod. dest", "Destino", "Direccion", "Cod Cliente", "Cliente", "cod dest.factura", "Razón social", "NIT", "Vendedor", "Nro. pedido", "F. Pedido", "Factura SAP", "fecha fact.", "No. Despacho", "fecha desp.", "Transportista", "doc. Cobranza", "Fecha Pago", "Cod. prodcuto", "Producto", "cant. pedido", "cant. Despacho", "P/U", "Total", "Costo Transportista", "Grupo de Estibaje", "Tipo de Estibaje", "Costo Estibaje", "Precio Transporte", "Total Pedido"]]
				var totalCosto = 0;
				for (var i = 0; i < despachos.length; i++) {
					var detalle_despacho = despachos[i]
					var columns = [];
					columns.push(detalle_despacho.despacho.destino != undefined ? detalle_despacho.despacho.destino.codigo : "")
					columns.push(detalle_despacho.despacho.destino != undefined ? detalle_despacho.despacho.destino.destino : "Sin destino")
					columns.push(detalle_despacho.despacho.destino != undefined ? detalle_despacho.despacho.destino.direccion : "Sin direccion")
					columns.push(detalle_despacho.despacho.cliente.codigo)
					columns.push(detalle_despacho.despacho.cliente.razon_social)
					columns.push(detalle_despacho.despacho.cliente_razon != undefined ? detalle_despacho.despacho.cliente_razon.codigo_sap : "")
					columns.push(detalle_despacho.despacho.cliente_razon != undefined ? detalle_despacho.despacho.cliente_razon.razon_social : "")
					columns.push(detalle_despacho.despacho.cliente_razon != undefined ? detalle_despacho.despacho.cliente_razon.nit : "")
					columns.push(detalle_despacho.despacho.usuario.persona.nombre_completo)
					var fecha = new Date(detalle_despacho.despacho.fecha)
					var dia = ((fecha.getDate()) >= 10) ? fecha.getDate() : "0" + fecha.getDate()
					var mes = ((fecha.getMonth()) >= 10) ? (fecha.getMonth() + 1) : "0" + (fecha.getMonth() + 1)
					columns.push(detalle_despacho.despacho.id)
					columns.push(new Date(detalle_despacho.despacho.fecha))


					columns.push(detalle_despacho.factura)
					columns.push(new Date(detalle_despacho.fecha_factura))
					columns.push(detalle_despacho.numero_correlativo)
					var fechaPedido = new Date(detalle_despacho.fecha)
					var dia2 = ((fechaPedido.getDate()) >= 10) ? fechaPedido.getDate() : "0" + fechaPedido.getDate()
					var mes2 = ((fechaPedido.getMonth() + 1) >= 10) ? (fechaPedido.getMonth() + 1) : "0" + (fechaPedido.getMonth() + 1)
					columns.push(new Date(detalle_despacho.fecha))
					columns.push(detalle_despacho.transportista.persona.nombre_completo)
					columns.push("")
					columns.push("")
					columns.push(detalle_despacho.producto.codigo)
					columns.push(detalle_despacho.producto.nombre)
					columns.push(detalle_despacho.cantidad)
					columns.push(detalle_despacho.cantidad_despacho)
					columns.push(detalle_despacho.precio_unitario)
					var total = detalle_despacho.precio_unitario * detalle_despacho.cantidad_despacho
					columns.push(total)

					var costo = detalle_despacho.transportista.costo_transporte * detalle_despacho.cantidad_despacho
					columns.push(costo)
					columns.push(detalle_despacho.grupo_estibaje.nombre)
					columns.push(detalle_despacho.estibaje.nombre)
					var costoEstibaje = detalle_despacho.estibaje.costo * detalle_despacho.cantidad_despacho
					columns.push(costoEstibaje)
					columns.push(detalle_despacho.servicio_transporte)
					var TotalPedido = detalle_despacho.servicio_transporte + total
					columns.push(TotalPedido)

					columns.push(detalle_despacho.despacho.cliente_razon != undefined ? detalle_despacho.despacho.cliente_razon.codigo_sap : "")
					data.push(columns);
				}
				var ws_name = "SheetJS";
				var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
				saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-DESPACHOS.xlsx");
				blockUI.stop();

			}
			return res;
		}])
	.factory('DibujarCabeceraPDFAlertaDespacho', [function () {
		res = function (doc, pagina, totalPaginas, despachos, filtro2, usuario, convertirFecha) {
			var filtro = { inicio: filtro2.inicio, fin: filtro2.fin }
			doc.font('Helvetica-Bold', 12);
			doc.text("REPORTE DE PEDIDOS", 0, 25, { align: "center" });
			doc.font('Helvetica', 12);
			if (filtro.inicio && filtro.fin) {
				filtro.inicio = new Date(convertirFecha(filtro.inicio))
				filtro.fin = new Date(convertirFecha(filtro.fin))
				var mes = ((filtro.inicio.getMonth() + 1) < 10) ? "0" + (filtro.inicio.getMonth() + 1) : (filtro.inicio.getMonth() + 1);
				var dia = ((filtro.inicio.getDate()) < 10) ? "0" + filtro.inicio.getDate() : filtro.inicio.getDate();
				var mes2 = ((filtro.fin.getMonth() + 1) < 10) ? "0" + (filtro.fin.getMonth() + 1) : (filtro.fin.getMonth() + 1);
				var dia2 = ((filtro.fin.getDate()) < 10) ? "0" + filtro.fin.getDate() : filtro.fin.getDate();
				doc.text(dia + "/" + mes + "/" + filtro.inicio.getFullYear() + " AL " + dia2 + "/" + mes2 + "/" + filtro.fin.getFullYear(), 0, 45, { align: "center" });
			}

			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			/* doc.rect(30, 70, 555, 30).stroke(); */
			var vendedor = "Todos"
			var cliente = "Todos"
			if (filtro.empleado != "") {
				vendedor = despachos[0].despacho.usuario.persona.nombre_completo
			}
			if (filtro.razon_social != "") {
				cliente = despachos[0].despacho.cliente.razon_social
			}
			doc.font('Helvetica-Bold', 8);
			doc.text("Vendedor : " + vendedor, 45, 80);
			doc.text("Cliente : " + cliente, 245, 80);
			doc.font('Helvetica', 8);
			//doc.text(despachos.razon_social, 140, 60);
			/* doc.rect(30, 100, 555, 30).stroke(); */
			doc.font('Helvetica-Bold', 8);
			doc.text("Nro.", 45, 110);
			doc.text("Vendedor", 80, 110, { width: 50 });
			doc.text("Cliente", 200, 110, { width: 60 });
			doc.text("Producto", 300, 110, { width: 50 });
			doc.text("Cant.", 420, 110, { width: 50 });
			doc.text("desp.", 460, 110, { width: 50 });
			doc.text("saldo", 500, 110, { width: 50 });
			doc.text("S. Transp.", 545, 110, { width: 80 });
			doc.font('Helvetica', 8);
			var currentDate = new Date();
			doc.text("USUARIO: " + usuario.persona.nombre_completo + " fecha " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "Hrs." + currentDate.getHours() + ":" + currentDate.getMinutes(), 15, 765);

		}
		return res;
	}])
	.factory('DibujarCabeceraPDFDespacho', [function () {
		res = function (doc, pagina, totalPaginas, despachos, filtro, usuario) {
			doc.font('Helvetica-Bold', 12);
			doc.text("REPORTE DE PEDIDOS", 0, 25, { align: "center" });
			doc.font('Helvetica', 12);
			if (filtro.inicio && filtro.fin) {
				var mes = ((filtro.inicio.getMonth() + 1) < 10) ? "0" + (filtro.inicio.getMonth() + 1) : (filtro.inicio.getMonth() + 1);
				var dia = ((filtro.inicio.getDate()) < 10) ? "0" + filtro.inicio.getDate() : filtro.inicio.getDate();
				var mes2 = ((filtro.fin.getMonth() + 1) < 10) ? "0" + (filtro.fin.getMonth() + 1) : (filtro.fin.getMonth() + 1);
				var dia2 = ((filtro.fin.getDate()) < 10) ? "0" + filtro.fin.getDate() : filtro.fin.getDate();

				doc.text(dia + "/" + mes + "/" + filtro.inicio.getFullYear() + " AL " + dia2 + "/" + mes2 + "/" + filtro.fin.getFullYear(), 0, 45, { align: "center" });
			}
			doc.font('Helvetica-Bold', 8);
			doc.text("PÁGINA " + pagina + " DE " + totalPaginas, 0, 740, { align: "center" });
			/* doc.rect(30, 70, 555, 30).stroke(); */
			var vendedor = "Todos"
			var cliente = "Todos"
			/* 	if (filtro.empleado != "") {
					vendedor = despachos[0].despacho.usuario.persona.nombre_completo
				}
				if (filtro.razon_social != "") {
					cliente = despachos[0].despacho.cliente.razon_social
				} */
			doc.font('Helvetica-Bold', 8);
			doc.text("Vendedor : " + vendedor, 45, 80);
			doc.text("Cliente : " + cliente, 245, 80);
			doc.font('Helvetica', 8);
			//doc.text(despachos.razon_social, 140, 60);
			/* doc.rect(30, 100, 555, 30).stroke(); */
			doc.font('Helvetica-Bold', 8);
			doc.text("Nro.", 45, 110);
			doc.text("Vendedor", 80, 110, { width: 50 });
			doc.text("Cliente", 200, 110, { width: 60 });
			doc.text("Producto", 320, 110, { width: 50 });
			doc.text("Cant.", 440, 110, { width: 50 });
			doc.text("S. Transp.", 500, 110, { width: 80 });
			doc.font('Helvetica', 8);
			var currentDate = new Date();
			doc.text("USUARIO: " + usuario.persona.nombre_completo + " fecha " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "Hrs." + currentDate.getHours() + ":" + currentDate.getMinutes(), 15, 765);

		}
		return res;
	}])