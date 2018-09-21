angular.module('agil.servicios')
.factory('BusquedaPacientesNit',  ['$resource',function ($resource) {
		return $resource(restServer+"pacientes/empresa/:id_empresa/texto/:texto");
}])

.factory('PacientesNit', ['BusquedaPacientesNit','$q',function(BusquedaPacientesNit, $q) 
  {
	var res = function(idEmpresa,texto) 
	{
		var delay = $q.defer();
		BusquedaPacientesNit.query({id_empresa:idEmpresa,texto:texto},function(entidades) 
		{        
			delay.resolve(entidades);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }])

.factory('ImprimirSalidaFarmacia', ['Diccionario', 'ImprimirProformaFarmacia',
	function (Diccionario, ImprimirProformaFarmacia) {
		var res = function (movimiento, salida, esAccionGuardar, usuario) {
			if (movimiento == Diccionario.EGRE_PROFORMA) {
				ImprimirProformaFarmacia(salida, esAccionGuardar, usuario);
			}else if(movimiento == Diccionario.EGRE_PRE_FACTURACION) {
				ImprimirProformaFarmacia(salida, esAccionGuardar, usuario);
			}
		};
		return res;
	}])

.factory('ImprimirIndicacionesFarmacia', [function () {
		var res = function (venta, esAccionGuardar, doc, stream, sizeY, usuario) {


			for (var j = 0; j < venta.sucursal.copias_impresion_pedido; j++) {
				if (j != 0) {
					doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
				}
				doc.font('Helvetica-Bold', 14);
				doc.text("Indicaciones", { align: 'center' });
				doc.font('Helvetica', 12);
				doc.moveDown(0.4);
				doc.text("Paciente : " + venta.farmacia.paciente.persona.nombre_completo, { align: 'left' });
				doc.moveDown(0.4);
				doc.text("Empresa : " + venta.farmacia.paciente.designacion_empresa, { align: 'left' });
				doc.moveDown(0.4);

				doc.moveDown(0.2);
				doc.text("---------------------------------------------", { align: 'center' });
				doc.moveDown(0.4);
				var y = doc.y, sumaDescuento = 0, sumaRecargo = 0, sumaIce = 0, sumaExcento = 0;
				doc.fontSize(10);
				for (var i = 0; i < venta.detallesVenta.length; i++) {
					
					if (venta.detallesVenta[i].producto.nombre.length > 40) {
						doc.fontSize(9);
					}

					doc.font('Helvetica-Bold', 9)
				    .text(venta.detallesVenta[i].producto.nombre+" ", {
				     	continued: true
				    })
				    doc.font('Helvetica', 9)
				    .text(venta.detallesVenta[i].observaciones);

					// doc.text(venta.detallesVenta[i].producto.nombre, 20, y, { width: 100 });
					// doc.text(venta.detallesVenta[i].observaciones, 150, y);
					doc.moveDown(0.2);
					y = y + 20;
				}
				doc.moveDown(4);
				doc.x = 0;
				var fechaActual = new Date();
				var min = fechaActual.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				doc.fontSize(7);
			    doc.text("  Usuario : " + usuario.nombre_usuario + " -- Fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min + "  ", { align: 'center' });
				
			}
		}
		return res;
	}])

.factory('ImprimirProformaFarmacia', ['Diccionario', 'ImprimirIndicacionesFarmacia', 'ImprimirProformaRolloFarmacia', '$timeout',
	function (Diccionario, ImprimirIndicacionesFarmacia, ImprimirProformaRolloFarmacia, $timeout) {
		var res = function (venta, esAccionGuardar, usuario) {
			var papel, doc, stream;
			if (venta.configuracion.tamanoPapelNotaVenta.nombre_corto == Diccionario.FACT_PAPEL_ROLLO) {
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
						ImprimirIndicacionesFarmacia(venta, esAccionGuardar, doc, stream, sizeY, usuario);
					}
				} else {
					doc = new PDFDocument({compress: false, size: papel, margins: { top: 0, bottom: 0, left: 20, right: 20 } });
					stream = doc.pipe(blobStream());
					ImprimirProformaRolloFarmacia(venta, papel, doc, stream, usuario);
					if (usuario.empresa.usar_pedidos) {
						var sizeY = 230 + (20 * venta.detallesVenta.length);
						doc.addPage({ size: [227, sizeY], margins: { top: 10, bottom: 10, left: 20, right: 20 } });
						ImprimirIndicacionesFarmacia(venta, esAccionGuardar, doc, stream, sizeY, usuario);
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



.factory('ImprimirProformaRolloFarmacia', ['blockUI', function (blockUI) {
		var res = function (venta, papel, doc, stream, usuario) {
			
			doc.moveDown(1);
			if (usuario.empresa.imagen.length > 100) { 
				doc.image(usuario.empresa.imagen, 15, doc.y, { align: 'right', width: 80, height: 50 }); 
			}
			doc.y = 40;
			doc.moveDown(2);
			
			doc.font('Helvetica-Bold', 8);
			doc.text('ATENCIÓN MÉDICA', 70, 30, { align: 'center' });
			doc.moveDown(0.4);
			doc.font('Helvetica', 7);
			doc.text("Nº "+ venta.farmacia.numero_receta, 70, 40, { align: 'center' });
			doc.moveDown(0.4);
			doc.text(venta.fechaTexto, 70, 50, { align: 'center' });
	
			doc.moveDown(0.4);
			
			
			doc.moveDown(0.4);
			doc.text("Paciente : " + venta.farmacia.paciente.persona.nombre_completo, 20, 70, { align: 'left' });
			doc.moveDown(0.4);
			doc.text("Empresa : " + venta.farmacia.paciente.designacion_empresa);
			doc.moveDown(0.4);
			doc.text("Campamento : " + venta.farmacia.paciente.campo);
			doc.moveDown(0.4);
			var cargos = [];

			for (var j = 0; j < venta.farmacia.paciente.empleadosFichas[(venta.farmacia.paciente.empleadosFichas.length-1)].cargos.length; j++) {
				cargos.push(venta.farmacia.paciente.empleadosFichas[(venta.farmacia.paciente.empleadosFichas.length-1)].cargos[j].cargo.nombre);
			}

			doc.text("Cargos : "  + cargos.toString());
			doc.moveDown(0.4);
			if (venta.farmacia.diagnostico === null || venta.farmacia.diagnostico === undefined) {
				venta.farmacia.diagnostico = "";
			}
			if (venta.farmacia.observaciones === null || venta.farmacia.observaciones === undefined) {
				venta.farmacia.observaciones = "";
			}
			doc.text("Diagnostico : "  + venta.farmacia.diagnostico);
			doc.moveDown(0.4);
			doc.text("Observación : "  + venta.farmacia.observaciones);
			doc.moveDown(0.4);

			doc.text("--------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.2);
			doc.text("CANT   Farmaco                                P. UNIT.    SUBTOTAL", { align: 'left' });
			doc.moveDown(0.2);
			doc.text("--------------------------------------------------------------------------------", { align: 'center' });
			doc.moveDown(0.4);
		
			
			

			var y = doc.y, sumaDescuento = 0, sumaRecargo = 0, sumaIce = 0, sumaExcento = 0;
			for (var i = 0; i < venta.detallesVenta.length; i++) {
				doc.text(venta.detallesVenta[i].cantidad, 20, y);
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
			
			doc.moveDown(0.6);

			doc.moveDown(0.4);

			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.moveDown(0.4);
			doc.text("------------------------     ----------------          -------------------------", 20, doc.y, { align: 'center' });
			doc.moveDown(0.2);
			doc.text("Médico de turno        Supervisor             Recibí Conforme", { align: 'center' });
			doc.moveDown(0.4);

			var fechaActual = new Date();
			var min = fechaActual.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			doc.text("  Usuario : " + usuario.nombre_usuario + " -- Fecha : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + "  " + fechaActual.getHours() + ":" + min + "  ", { align: 'center' });
			// blockUI.stop();
		}
		return res;
	}])
.factory('VentaFarmaciaFiltro',  ['$resource',function ($resource) {
		return $resource(restServer+"ventas-farmacia/:idsSucursales/inicio/:inicio/fin/:fin/codigo/:codigo/nombreCompleto/:nombreCompleto/ci/:ci/tipo-venta/:tipo_venta/campo/:campo/cargo/:cargo/empresa/:empresa/numero_receta/:numero_receta", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('VentasFarmacia', ['VentaFarmaciaFiltro','$q',function(VentaFiltro, $q) 
  {
	var res = function(sucursales,inicio,fin,codigo,nombreCompleto,ci,tipo_pago,campo,cargo,empresa,numero_receta) 
	{
		var delay = $q.defer();
		VentaFiltro.query({idsSucursales:sucursales,inicio:inicio,fin:fin,codigo:codigo,nombreCompleto:nombreCompleto,ci:ci,tipo_venta:tipo_pago,campo:campo,cargo:cargo,empresa:empresa,numero_receta:numero_receta},function(entidades) 
		{        
			delay.resolve(entidades);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
    return res;
  }])

.factory('VentaFarmacia',  ['$resource',function ($resource) {
		return $resource(restServer+"ventas-farmacia/:id",  { id: '@id' },
		{
			'update': { method:'PUT' }
		});
}])

.factory('VentaEmpresaDatosFarmacia',  ['$resource',function ($resource) {
		return $resource(restServer+"ventas-farmacia/:id/empresa/:id_empresa", null,
		{
			'update': { method:'PUT' }
		});
}])

.factory('DatosVentaFarmacia', ['VentaEmpresaDatosFarmacia','$q',function(VentaEmpresaDatosFarmacia, $q) 
	{
	var res = function(id_venta,id_empresa) 
	{
		var delay = $q.defer();
		VentaEmpresaDatosFarmacia.get({id:id_venta,id_empresa:id_empresa},function(entidad) 
		{        
			delay.resolve(entidad);
		}, function(error) 
			{
				delay.reject(error);
			});
		return delay.promise;
	};
	return res;
	}]);
