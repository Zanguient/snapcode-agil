angular.module('agil.controladores')

.controller('ControladorCierresCaja', function($scope,$localStorage,$location,$templateCache,$route,blockUI,
											ClasesTipo,Clases,CierreCaja,ListaCierresCaja,CierreCajaDatos,
											VentasContado,VentasCredito,PagosVenta,ConfiguracionImpresionEmpresaDato,
											ListaBancos,PagosCompra,ComprasContado,ComprasCredito,CierresCajaPendiente){
	blockUI.start();
	
	$scope.idModalWizardCierreEdicion='modal-wizard-cierre';
	$scope.idModalDeposito='modal-deposito';
	$scope.idModalWizardCierreVista='modal-wizard-cierre-vista';
	$scope.idModalEliminarCierre='dialog-eliminar-cierre';
	$scope.idModalContenedorCierreEdicion='modal-wizard-container-cierre-edicion';
	$scope.idModalContenedorCierreVista='modal-wizard-container-cierre-vista';
	$scope.idModalDatosAdicionalesReporte='dialog-datos-adicionales-reporte-cierre';
	
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		$scope.obtenerCierres($scope.usuario.id_empresa);
		$scope.obtenerBancos($scope.usuario.id_empresa);
		$scope.sucursalesUsuario="";
		for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
			$scope.sucursalesUsuario=$scope.sucursalesUsuario+$scope.usuario.sucursalesUsuario[i].sucursal.id;
			if(i+1!=$scope.usuario.sucursalesUsuario.length){
				$scope.sucursalesUsuario=$scope.sucursalesUsuario+',';
			}
		}

		var promesa=ClasesTipo("DC");
		promesa.then(function(entidad){
			$scope.destinos=entidad.clases;
			blockUI.stop();
		});

		setTimeout(function() {
			ejecutarScriptsTabla('tabla-cierres',9);
		},2000);
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsCierre($scope.idModalWizardCierreEdicion,
							   $scope.idModalContenedorCierreEdicion,
							   $scope.idModalWizardCierreVista,
							   $scope.idModalContenedorCierreVista,
							   $scope.idModalEliminarCierre,
							   $scope.idModalDeposito,
							   $scope.idModalDatosAdicionalesReporte);
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		/*var promesa=ClasesTipo("TCB");
		promesa.then(function(entidad){
			$scope.tiposCuenta=entidad.clases;
			blockUI.stop();
		});
		promesa=ClasesTipo("TM");
		promesa.then(function(entidad){
			$scope.tiposMoneda=entidad.clases;
			blockUI.stop();
		});*/
	});

	$scope.seleccionarCierresPendientes=function(cierresPendientes){
		for(var i=0;i<$scope.sucursales.length;i++){
			for(var j=0;j<sucursalesUsuario.length;j++){
				if($scope.sucursales[i].id==sucursalesUsuario[j].id){
					$scope.sucursales[i].ticked=true;
				}
			}			
		}
	}

	$scope.llenarCierresPendientes=function(nuevoCierrePendiente,cierresPendientes){
		nuevoCierrePendiente.cierresPendientesOpciones=[];
		for(var i=0;i<cierresPendientes.length;i++){
			var cierrePendiente={
				name:cierresPendientes[i].cierreCaja.usuario.nombre_usuario+" - "+cierresPendientes[i].cierreCaja.importe,
				maker: "",
				ticked:false,
				id:cierresPendientes[i].id,
				importe:cierresPendientes[i].cierreCaja.importe,
				usuario:cierresPendientes[i].cierreCaja.usuario.nombre_usuario
			}
			nuevoCierrePendiente.cierresPendientesOpciones.push(cierrePendiente);
		}
	}

	$scope.cambiarCierrePendiente=function(nuevoCierreCaja){
		console.log(nuevoCierreCaja);
	}
	
	$scope.crearNuevoCierre=function(){
		var inicio=new Date();
		var fin=new Date();
		var promesa=VentasContado($scope.sucursalesUsuario,inicio,fin,$scope.usuario.id,0);
		promesa.then(function(ventasContado){
			promesa=VentasCredito($scope.sucursalesUsuario,inicio,fin,$scope.usuario.id,0);
			promesa.then(function(ventasCredito){
				promesa=PagosVenta($scope.sucursalesUsuario,inicio,fin,$scope.usuario.id,0);
				promesa.then(function(pagos){
					promesa=PagosCompra($scope.sucursalesUsuario,inicio,fin,$scope.usuario.id,0);
					promesa.then(function(pagosCompra){
						promesa=ComprasContado($scope.sucursalesUsuario,inicio,fin,$scope.usuario.id,0);
						promesa.then(function(comprasContado){
							promesa=ComprasCredito($scope.sucursalesUsuario,inicio,fin,$scope.usuario.id,0);
							promesa.then(function(comprasCredito){
								promesa=CierresCajaPendiente($scope.sucursalesUsuario);
								promesa.then(function(cierresPendientes){
									var generado=false;
									$scope.nuevosCierresCaja=[];
									for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
										$scope.cierreCaja=new CierreCaja({id_empresa:$scope.usuario.id_empresa,id_usuario:$scope.usuario.id,saldo_inicial:0,gastos:0});
										$scope.cierreCaja.ventasContado=$.grep(ventasContado, function(e){return e.almacen.id_sucursal == $scope.usuario.sucursalesUsuario[i].sucursal.id;});
										$scope.cierreCaja.ventasCredito=$.grep(ventasCredito, function(e){return e.almacen.id_sucursal == $scope.usuario.sucursalesUsuario[i].sucursal.id;});
										$scope.cierreCaja.pagosVenta=$.grep(pagos, function(e){return e.venta.almacen.id_sucursal == $scope.usuario.sucursalesUsuario[i].sucursal.id;});
										$scope.cierreCaja.pagosCompra=$.grep(pagosCompra, function(e){return e.compra.almacen.id_sucursal == $scope.usuario.sucursalesUsuario[i].sucursal.id;});
										$scope.cierreCaja.comprasContado=$.grep(comprasContado, function(e){return e.almacen.id_sucursal == $scope.usuario.sucursalesUsuario[i].sucursal.id;});
										$scope.cierreCaja.comprasCredito=$.grep(comprasCredito, function(e){return e.almacen.id_sucursal == $scope.usuario.sucursalesUsuario[i].sucursal.id;});
										$scope.cierreCaja.cierresPendientesLeidos=$.grep(cierresPendientes, function(e){return e.id_sucursal == $scope.usuario.sucursalesUsuario[i].sucursal.id;});
										$scope.cierreCaja.sucursal=$scope.usuario.sucursalesUsuario[i].sucursal;
										$scope.cierreCaja.id_sucursal=$scope.usuario.sucursalesUsuario[i].sucursal.id;
										if($scope.cierreCaja.ventasContado.length>0 ||
											$scope.cierreCaja.ventasCredito.length>0 ||
											$scope.cierreCaja.pagosVenta.length>0 ||
											$scope.cierreCaja.pagosCompra.length>0 ||
											$scope.cierreCaja.comprasContado.length>0 ||
											$scope.cierreCaja.comprasCredito.length>0 ||
											$scope.cierreCaja.cierresPendientesLeidos.length>0){
											generado=true;
											$scope.cierreCaja.cierresPendientes=[];
											if($scope.cierreCaja.cierresPendientesLeidos.length>0){
												$scope.llenarCierresPendientes($scope.cierreCaja,$scope.cierreCaja.cierresPendientesLeidos);
											}
											$scope.nuevosCierresCaja.push($scope.cierreCaja);
										}
									}
									blockUI.stop();
									if(!generado){
										$scope.cerrarPopPupEdicion();
										$scope.mostrarMensaje("No existen Movimientos!");
									}else{
										$scope.abrirPopup($scope.idModalWizardCierreEdicion);
									}
								});
							});
						});
					});
				});
			});
		});
	}

	$scope.calcularImporteCierre=function(cierreCaja){
		var importeCierresPendientes=0;
		for(var i=0;i<cierreCaja.cierresPendientes.length;i++){
			importeCierresPendientes=importeCierresPendientes+cierreCaja.cierresPendientes[i].importe;
		}
		cierreCaja.importe=(Math.round((importeCierresPendientes+cierreCaja.saldo_inicial+
										$scope.sumarVentasContado(cierreCaja.ventasContado)+
										$scope.sumarVentasCredito(cierreCaja.ventasCredito)-
										$scope.sumarComprasContado(cierreCaja.comprasContado)-
										$scope.sumarComprasCredito(cierreCaja.comprasCredito)+
										$scope.sumarPagosVenta(cierreCaja.pagosVenta)-
										$scope.sumarPagosCompra(cierreCaja.pagosCompra)-cierreCaja.gastos)*100)/100);
		return cierreCaja.importe;
	}
	
	$scope.cerrarPopPupNuevoCierre=function(){
		$scope.cerrarPopup($scope.idModalWizardCierreEdicion);
	}

	$scope.cerrarPopPupDeposito=function(){
		$scope.cerrarPopup($scope.idModalDeposito);	
	}
	
	$scope.verCierreCaja=function(cierreCaja){
		$scope.cierreCaja=cierreCaja;
		$scope.abrirPopup($scope.idModalWizardCierreVista);
	}
	
	$scope.cerrarPopPupVista=function(){
		$scope.cerrarPopup($scope.idModalWizardCierreVista);
	}
	
	$scope.cerrarPopPupEdicion=function(){
		$scope.cerrarPopup($scope.idModalWizardCierreEdicion);
	}
	
	$scope.modificarCierre=function(cierreCaja){
		$scope.cierreCaja=cierreCaja;
		$scope.abrirPopup($scope.idModalWizardCierreEdicion);
	}
	
	$scope.mostrarConfirmacionEliminacion=function(cierreCaja){
		$scope.cierreCaja=new CierreCaja(cierreCaja);
		$scope.abrirPopup($scope.idModalEliminarCierre);
	}
	
	$scope.cerrarConfirmacionEliminacion=function(){
		$scope.cerrarPopup($scope.idModalEliminarCierre);
	};
	
	$scope.eliminarCierre=function(cierreCaja){
		blockUI.start();
		$scope.cerrarConfirmacionEliminacion();
		banco.$delete();
		$scope.mostrarMensaje('Eliminado exitosamente!');
		$scope.recargarItemsTabla();
		blockUI.stop();
	}

	$scope.cerrarCaja=function(cierresCaja){
		var button=$('#siguiente').text().trim();console.log(button);
		if(button!="Siguiente"){
			blockUI.start();
			for(var i=0;i<cierresCaja.length;i++){
				$scope.guardarCierreCaja(cierresCaja[i]);
				$scope.generarReporteCierreCaja(cierresCaja[i].sucursal,cierresCaja[i],cierresCaja[i].ventasContado,
					cierresCaja[i].ventasCredito,
					cierresCaja[i].pagosVenta,
					cierresCaja[i].pagosCompra,
					cierresCaja[i].comprasContado,
					cierresCaja[i].comprasCredito,
					cierresCaja[i].cierresPendientes);
			}
			$scope.cerrarPopPupNuevoCierre();
			$scope.recargarItemsTabla();
			$scope.mostrarMensaje('Guardado Exitosamente!');
		}
	}

	$scope.mostrarDatosAdicionalesReporte=function(cierreCaja){
		$scope.cierreCajaImpresion=cierreCaja;
		$scope.abrirPopup($scope.idModalDatosAdicionalesReporte);
	}

	$scope.cerrarPopupDatosAdicionalesReporte=function(){
		$scope.cerrarPopup($scope.idModalDatosAdicionalesReporte);	
	}

	$scope.imprimirCierreCaja=function(cierreCaja){
		$scope.cerrarPopup($scope.idModalDatosAdicionalesReporte);
		var inicio=new Date();
		var fin=new Date();
		var promesa=VentasContado($scope.sucursalesUsuario,inicio,fin,cierreCaja.id_usuario,cierreCaja.id);
		promesa.then(function(ventasContado){
			promesa=VentasCredito($scope.sucursalesUsuario,inicio,fin,cierreCaja.id_usuario,cierreCaja.id);
			promesa.then(function(ventasCredito){
				promesa=PagosVenta($scope.sucursalesUsuario,inicio,fin,cierreCaja.id_usuario,cierreCaja.id);
				promesa.then(function(pagosVenta){
					promesa=PagosCompra($scope.sucursalesUsuario,inicio,fin,cierreCaja.id_usuario,cierreCaja.id);
					promesa.then(function(pagosCompra){
						promesa=ComprasContado($scope.sucursalesUsuario,inicio,fin,cierreCaja.id_usuario,cierreCaja.id);
						promesa.then(function(comprasContado){
							promesa=ComprasCredito($scope.sucursalesUsuario,inicio,fin,cierreCaja.id_usuario,cierreCaja.id);
							promesa.then(function(comprasCredito){
								$scope.generarReporteCierreCaja(cierreCaja.sucursal,cierreCaja,ventasContado,
																ventasCredito,
																pagosVenta,
																pagosCompra,
																comprasContado,
																comprasCredito,
																cierreCaja.cajasSiguienteTurnoCerradas);
							});
						});
					});
				});
			});
		});
	}
	
	$scope.generarReporteCierreCaja=function(sucursal,cierre,ventas,ventasCredito,pagos,pagosCompra,comprasContado,comprasCredito,cierresPendientes){
		var promesa=ConfiguracionImpresionEmpresaDato($scope.usuario.id_empresa,0);console.log(cierre);
		promesa.then(function(configuracion){
			var papel=[612,792];
			if(configuracion.usar){
				if(configuracion.tamanoPapelCierreCaja.nombre_corto==$scope.diccionario.FACT_PAPEL_OFICIO){
					papel=[612,936];
					$scope.imprimirReporteCierreCajaCartaOficio(sucursal,papel,cierre,ventas,ventasCredito,pagos,pagosCompra,comprasContado,comprasCredito,cierresPendientes);
				}else if(configuracion.tamanoPapelCierreCaja.nombre_corto==$scope.diccionario.FACT_PAPEL_CARTA){
					papel=[612,792];
					$scope.imprimirReporteCierreCajaCartaOficio(sucursal,papel,cierre,ventas,ventasCredito,pagos,pagosCompra,comprasContado,comprasCredito,cierresPendientes);
				}else if(configuracion.tamanoPapelCierreCaja.nombre_corto==$scope.diccionario.FACT_PAPEL_MEDIOOFICIO){
					papel=[612,468];
					$scope.imprimirReporteCierreCajaCartaOficio(sucursal,papel,cierre,ventas,ventasCredito,pagos,pagosCompra,comprasContado,comprasCredito,cierresPendientes);
				}else if(configuracion.tamanoPapelCierreCaja.nombre_corto==$scope.diccionario.FACT_PAPEL_ROLLO){
					var alto,totalItems=ventas.length+ventasCredito.length+pagos.length+pagosCompra.length+comprasContado.length+comprasCredito.length+cierresPendientes.length;
					if (cierre.conMovimientoProductos) {
						for(var i=0;i<ventas.length;i++){
							totalItems=totalItems+(ventas[i].detallesVenta.length);
						}
						for(var i=0;i<ventasCredito.length;i++){
							totalItems=totalItems+(ventasCredito[i].detallesVenta.length);
						}
						for(var i=0;i<comprasContado.length;i++){
							totalItems=totalItems+(comprasContado[i].detallesCompra.length);
						}
						for(var i=0;i<comprasCredito.length;i++){
							totalItems=totalItems+(comprasCredito[i].detallesCompra.length);
						}
					}
					if (cierre.conSaldoProductos) {
						for(var i=0;i<ventas.length;i++){
							totalItems=totalItems+(ventas[i].detallesVenta.length);
						}
						for(var i=0;i<ventasCredito.length;i++){
							totalItems=totalItems+(ventasCredito[i].detallesVenta.length);
						}
						for(var i=0;i<comprasContado.length;i++){
							totalItems=totalItems+(comprasContado[i].detallesCompra.length);
						}
						for(var i=0;i<comprasCredito.length;i++){
							totalItems=totalItems+(comprasCredito[i].detallesCompra.length);
						}
					}
					if(totalItems<=2){
						alto=470;
					}else{
						alto=470+(20*(totalItems-2))
					}console.log(totalItems);
					papel=[227,alto];
					$scope.imprimirReporteCierreCajaRollo(sucursal,papel,cierre,ventas,ventasCredito,pagos,pagosCompra,comprasContado,comprasCredito,cierresPendientes);
				}
			}else{
				var alto,totalItems=ventas.length+ventasCredito.length+pagos.length+pagosCompra.length+comprasContado.length+comprasCredito.length+cierresPendientes.length;
				if (cierre.conMovimientoProductos) {
					for(var i=0;i<ventas.length;i++){
						totalItems=totalItems+(ventas[i].detallesVenta.length);
					}
					for(var i=0;i<ventasCredito.length;i++){
						totalItems=totalItems+(ventasCredito[i].detallesVenta.length);
					}
					for(var i=0;i<comprasContado.length;i++){
						totalItems=totalItems+(comprasContado[i].detallesCompra.length);
					}
					for(var i=0;i<comprasCredito.length;i++){
						totalItems=totalItems+(comprasCredito[i].detallesCompra.length);
					}
				}
				if (cierre.conSaldoProductos) {
						for(var i=0;i<ventas.length;i++){
							totalItems=totalItems+(ventas[i].detallesVenta.length);
						}
						for(var i=0;i<ventasCredito.length;i++){
							totalItems=totalItems+(ventasCredito[i].detallesVenta.length);
						}
						for(var i=0;i<comprasContado.length;i++){
							totalItems=totalItems+(comprasContado[i].detallesCompra.length);
						}
						for(var i=0;i<comprasCredito.length;i++){
							totalItems=totalItems+(comprasCredito[i].detallesCompra.length);
						}
					}
				if(totalItems<=2){
					alto=470;
				}else{
					alto=470+(20*(totalItems-2))
				}console.log(totalItems);
				papel=[227,alto];
				$scope.imprimirReporteCierreCajaRollo(sucursal,papel,cierre,ventas,ventasCredito,pagos,pagosCompra,comprasContado,comprasCredito,cierresPendientes);				
			}
		});
	}

	$scope.imprimirReporteCierreCajaCartaOficio=function(sucursal,papel,cierre,ventas,ventasCredito,pagos,pagosCompra,comprasContado,comprasCredito,cierresPendientes){
		var doc = new PDFDocument({size:papel,margin:0});
		var stream = doc.pipe(blobStream());
		doc.font('Helvetica-Bold',15);
		doc.text("CIERRE DE CAJA",55,50);
		doc.text("SUCURSAL: "+sucursal.nombre,200,50);
		doc.font('Helvetica-Bold',8);
		doc.text("SALDO INICIAL: ",55,80);
		doc.text(cierre.saldo_inicial,350,80);
		doc.font('Helvetica-Bold',8);
		doc.text("VENTAS AL CONTADO: ",55,100);
		doc.font('Helvetica',8);
		var y=100,suma=0,sumaPago=0,sumaCobro=0;
		for(var i=0;i<ventas.length;i++){
			doc.text("No. "+ventas[i].factura,55,y+20);
			doc.text(ventas[i].cliente.razon_social,100,y+20);
			doc.text(ventas[i].total,300,y+20);
			suma=suma+ventas[i].total;
			y=y+20;
		}
		doc.font('Helvetica-Bold',8);
		doc.text(suma,350,100);
		
		doc.font('Helvetica-Bold',8);
		doc.text("VENTAS AL CREDITO: ",55,y+20);
		doc.font('Helvetica',8);
		var creditoY=y+20;
		y=y+20; var sumaCredito=0;
		for(var i=0;i<ventasCredito.length;i++){
			if(ventasCredito[i].pagosVenta.length>0){
				if(ventasCredito[i].pagosVenta[0].a_cuenta_anterior>0){
					doc.text("No. "+ventasCredito[i].factura,55,y+20);
					doc.text(ventasCredito[i].cliente.razon_social,100,y+20);
					doc.text(ventasCredito[i].pagosVenta[0].a_cuenta_anterior,300,y+20);
					sumaCredito=sumaCredito+ventasCredito[i].pagosVenta[0].a_cuenta_anterior;
					y=y+20;
				}
			}else{
				if(ventasCredito[i].a_cuenta){
					doc.text("No. "+ventasCredito[i].factura,55,y+20);
					doc.text(ventasCredito[i].cliente.razon_social,100,y+20);
					doc.text(ventasCredito[i].a_cuenta,300,y+20);
					sumaCredito=sumaCredito+ventasCredito[i].a_cuenta;
					y=y+20;
				}
			}
		}
		doc.font('Helvetica-Bold',8);
		doc.text(sumaCredito,350,creditoY);


		doc.font('Helvetica-Bold',8);
		doc.text("COMPRAS AL CONTADO: ",55,y+20);
		doc.font('Helvetica',8);
		var compraContadoY=y+20;
		y=y+20; var sumaCompraContado=0;
		for(var i=0;i<comprasContado.length;i++){
			doc.text("No. "+comprasContado[i].factura,55,y+20);
			doc.text(comprasContado[i].proveedor.razon_social,100,y+20);
			doc.text(comprasContado[i].total,300,y+20);
			sumaCompraContado=sumaCompraContado+comprasContado[i].total;
			y=y+20;
		}
		doc.font('Helvetica-Bold',8);
		doc.text(sumaCompraContado,350,compraContadoY);

		doc.text("COMPRAS AL CREDITO: ",55,y+20);
		doc.font('Helvetica',8);
		var comprasCreditoY=y+20;
		y=y+20; var sumaComprasCredito=0;
		for(var i=0;i<comprasCredito.length;i++){
			if(comprasCredito[i].pagosCompra.length>0){
				if(comprasCredito[i].pagosCompra[0].a_cuenta_anterior>0){
					doc.text("No. "+comprasCredito[i].factura,55,y+20);
					doc.text(comprasCredito[i].proveedor.razon_social,100,y+20);
					doc.text(comprasCredito[i].pagosCompra[0].a_cuenta_anterior,300,y+20);
					sumaComprasCredito=sumaComprasCredito+comprasCredito[i].pagosCompra[0].a_cuenta_anterior;
					y=y+20;
				}
			}else{
				if(comprasCredito[i].a_cuenta){
					doc.text("No. "+comprasCredito[i].factura,55,y+20);
					doc.text(comprasCredito[i].proveedor.razon_social,100,y+20);
					doc.text(comprasCredito[i].a_cuenta,300,y+20);
					sumaComprasCredito=sumaComprasCredito+comprasCredito[i].a_cuenta;
					y=y+20;
				}
			}
		}
		doc.font('Helvetica-Bold',8);
		doc.text(sumaComprasCredito,350,comprasCreditoY);


		var cobroY=y+20;
		doc.text("COBROS REALIZADOS: ",55,y+20);
		doc.font('Helvetica',8);
		y=y+20;
		for(var i=0;i<pagos.length;i++){
			doc.text("No. "+pagos[i].venta.factura,55,y+20);
			doc.text(pagos[i].venta.cliente.razon_social,100,y+20);
			doc.text(pagos[i].monto_pagado,300,y+20);
			sumaPago=sumaPago+pagos[i].monto_pagado;
			y=y+20;
		}
		doc.text(sumaPago,350,cobroY);
		doc.font('Helvetica-Bold',8);

		var pagoY=y+20;
		
		doc.text("PAGOS REALIZADOS: ",55,y+20);
		doc.font('Helvetica',8);
		y=y+20;
		for(var i=0;i<pagosCompra.length;i++){
			doc.text("No. "+pagosCompra[i].compra.factura,55,y+20);
			doc.text(pagosCompra[i].compra.proveedor.razon_social,100,y+20);
			doc.text(pagosCompra[i].monto_pagado,300,y+20);
			sumaCobro=sumaCobro+pagosCompra[i].monto_pagado;
			y=y+20;
		}
		doc.text(sumaCobro,350,pagoY);
		doc.font('Helvetica-Bold',8);


		doc.text("GASTOS: ",55,y+40);
		doc.text(cierre.gastos,350,y+40);
		doc.text("SALDO FINAL CAJA: ",55,y+60);
		doc.text(cierre.importe,350,y+60);
		doc.text("---------------------------------------------                       ---------------------------------------------",0,y+100,{align:'center'});
		doc.text("ENTREGUE CONFORME                                     RECIBI CONFORME",0,y+130,{align:'center'});
		
		doc.end();
		stream.on('finish', function() {
			var fileURL = stream.toBlobURL('application/pdf');
			window.open(fileURL,'_blank','location=no');
		});
		blockUI.stop();
	}

	$scope.imprimirReporteCierreCajaRollo=function(sucursal,papel,cierre,ventas,ventasCredito,pagos,pagosCompra,comprasContado,comprasCredito,cierresPendientes){
		var doc = new PDFDocument({size:papel,margins:{top:10,bottom:10,left:10,right:20}});
		var stream = doc.pipe(blobStream());
		cierre.fecha=new Date(cierre.fecha);
		doc.moveDown(2);
		doc.font('Helvetica-Bold',8);
		doc.text("CIERRE DE CAJA",{align:'center'});
		doc.text("SUCURSAL: "+sucursal.nombre,{align:'center'});
		doc.text("DEL: "+cierre.fecha.getDate()+"/"+(cierre.fecha.getMonth()+1)+"/"+cierre.fecha.getFullYear(),{align:'center'});

		if(cierresPendientes.length>0){
			doc.moveDown(0.4);
			var saldoTurnoY=doc.y;
			doc.text("SALDO ANTERIORES TURNOS: ",{align:'left'});
			doc.font('Helvetica',8);
			doc.moveDown(0.4);
			var y=doc.y; var sumaSaldoAnterioresTurnos=0;
			for(var i=0;i<cierresPendientes.length;i++){
				doc.text((cierresPendientes[i].cierreCaja?cierresPendientes[i].cierreCaja.usuario.nombre_usuario:cierresPendientes[i].usuario),60,y,{width:90});
				doc.text((cierresPendientes[i].cierreCaja?cierresPendientes[i].cierreCaja.importe:cierresPendientes[i].importe),150,y);
				sumaSaldoAnterioresTurnos=sumaSaldoAnterioresTurnos+(cierresPendientes[i].cierreCaja?cierresPendientes[i].cierreCaja.importe:cierresPendientes[i].importe);
				y=y+20;
			}
			doc.font('Helvetica-Bold',8);
			doc.text(sumaSaldoAnterioresTurnos,0,saldoTurnoY,{align:'right'});
			doc.y=y;
			doc.moveDown(0.4);
			doc.x=10;
		}

		doc.moveDown(0.4);
		doc.font('Helvetica-Bold',8);
		var currentY=doc.y;
		doc.text("SALDO INICIAL: ",{align:'left',width:100});
		doc.text(cierre.saldo_inicial,0,currentY,{align:'right'});
		doc.x=10;
		doc.moveDown(0.8);
		doc.font('Helvetica-Bold',8);
		var yContado=doc.y;
		doc.text("VENTAS AL CONTADO: ",{align:'left'});
		doc.font('Helvetica',8);
		doc.moveDown(0.4);
		y=doc.y,suma=0,sumaPago=0,sumaCobro=0;
		for(var i=0;i<ventas.length;i++){
			doc.text("No. "+ventas[i].factura,20,y);
			doc.text(ventas[i].cliente.razon_social,60,y,{width:90});
			doc.text(ventas[i].total,150,y);
			suma=suma+ventas[i].total;
			y=y+20;
		}
		doc.font('Helvetica-Bold',8);
		doc.text(suma,0,yContado,{align:'right'});
		doc.y=y;
		doc.moveDown(0.4);
		doc.x=10;
		doc.font('Helvetica-Bold',8);
		var creditoY=doc.y;
		doc.text("VENTAS AL CREDITO: ",{align:'left'});
		doc.font('Helvetica',8);
		doc.moveDown(0.4);
		y=doc.y; var sumaCredito=0;
		for(var i=0;i<ventasCredito.length;i++){
			if(ventasCredito[i].pagosVenta.length>0){
				if(ventasCredito[i].pagosVenta[0].a_cuenta_anterior>0){
					doc.text("No. "+ventasCredito[i].factura,20,y);
					doc.text(ventasCredito[i].cliente.razon_social,60,y,{width:90});
					doc.text(ventasCredito[i].pagosVenta[0].a_cuenta_anterior,150,y);
					sumaCredito=sumaCredito+ventasCredito[i].pagosVenta[0].a_cuenta_anterior;
					y=y+20;
				}
			}else{
				doc.text("No. "+ventasCredito[i].factura,20,y);
				doc.text(ventasCredito[i].cliente.razon_social,60,y,{width:90});
				doc.text(ventasCredito[i].a_cuenta,150,y);
				sumaCredito=sumaCredito+ventasCredito[i].a_cuenta;
				y=y+20;
			}
		}
		doc.font('Helvetica-Bold',8);
		doc.text(sumaCredito,0,creditoY,{align:'right'});
		doc.y=y;
		doc.moveDown(0.4);
		doc.x=10;

		doc.font('Helvetica-Bold',8);
		var compraContadoY=doc.y;
		doc.text("COMPRAS AL CONTADO: ",{align:'left'});
		doc.font('Helvetica',8);
		doc.moveDown(0.4);
		y=doc.y; var sumaCompraContado=0;
		for(var i=0;i<comprasContado.length;i++){
			doc.text("No. "+comprasContado[i].factura,20,y);
			doc.text(comprasContado[i].proveedor.razon_social,60,y,{width:90});
			doc.text(comprasContado[i].total,150,y);
			sumaCompraContado=sumaCompraContado+comprasContado[i].total;
			y=y+20;
		}
		doc.font('Helvetica-Bold',8);
		doc.text(sumaCompraContado,0,compraContadoY,{align:'right'});
		doc.y=y;
		doc.moveDown(0.4);
		doc.x=10;

		var comprasCreditoY=doc.y;
		doc.text("COMPRAS AL CREDITO: ",{align:'left'});
		doc.font('Helvetica',8);
		y=doc.y; var sumaComprasCredito=0;
		for(var i=0;i<comprasCredito.length;i++){
			if(comprasCredito[i].pagosCompra.length>0){
				if(comprasCredito[i].pagosCompra[0].a_cuenta_anterior>0){
					doc.text("No. "+comprasCredito[i].factura,20,y);
					doc.text(comprasCredito[i].proveedor.razon_social,60,y);
					doc.text(comprasCredito[i].pagosCompra[0].a_cuenta_anterior,150,y);
					sumaComprasCredito=sumaComprasCredito+comprasCredito[i].pagosCompra[0].a_cuenta_anterior;
					y=y+20;
				}
			}else{
				if(comprasCredito[i].a_cuenta){
					doc.text("No. "+comprasCredito[i].factura,20,y);
					doc.text(comprasCredito[i].proveedor.razon_social,60,y);
					doc.text(comprasCredito[i].a_cuenta,150,y);
					sumaComprasCredito=sumaComprasCredito+comprasCredito[i].a_cuenta;
					y=y+20;
				}
			}
		}
		doc.font('Helvetica-Bold',8);
		doc.text(sumaComprasCredito,0,comprasCreditoY,{align:'right'});
		doc.y=y;
		doc.moveDown(0.4);
		doc.x=10;

		var cobroY=doc.y;
		doc.text("COBROS REALIZADOS: ",{align:'left'});
		doc.font('Helvetica',8);
		doc.moveDown(0.4);
		y=doc.y;
		for(var i=0;i<pagos.length;i++){
			doc.text("No. "+pagos[i].venta.factura,20,y);
			doc.text(pagos[i].venta.cliente.razon_social,60,y,{width:90});
			doc.text(pagos[i].monto_pagado,150,y);
			sumaPago=sumaPago+pagos[i].monto_pagado;
			y=y+20;
		}
		doc.font('Helvetica-Bold',8);
		doc.text(sumaPago,0,cobroY,{align:'right'});

		doc.y=y;
		doc.moveDown(0.4);
		doc.x=10;
		var pagoY=doc.y;
		doc.text("PAGOS REALIZADOS: ",{align:'left'});
		doc.font('Helvetica',8);
		doc.moveDown(0.4);
		y=doc.y;
		for(var i=0;i<pagosCompra.length;i++){
			doc.text("No. "+pagosCompra[i].compra.factura,20,y);
			doc.text(pagosCompra[i].compra.proveedor.razon_social,60,y,{width:90});
			doc.text(pagosCompra[i].monto_pagado,150,y);
			sumaCobro=sumaCobro+pagosCompra[i].monto_pagado;
			y=y+20;
		}
		doc.font('Helvetica-Bold',8);
		doc.text(sumaCobro,0,pagoY,{align:'right'});


		doc.y=y;
		doc.moveDown(0.4);
		doc.x=10;
		doc.font('Helvetica-Bold',8);
		currentY=doc.y;
		doc.text("GASTOS: ",{align:'left'});
		doc.text(cierre.gastos,0,currentY,{align:'right'});
		doc.x=10;
		doc.moveDown(0.4);
		currentY=doc.y;
		doc.text("SALDO FINAL CAJA: ",{align:'left'});
		doc.text(cierre.importe,0,currentY,{align:'right'});
		
		doc.moveDown(1.6);
		doc.x=10;

		if(cierre.conMovimientoProductos){
			doc.font('Helvetica-Bold',8);
			doc.text("RESUMEN MOVIMIENTOS VENTA PRODUCTOS: ",{align:'center'});
			doc.font('Helvetica',8);
			doc.moveDown(0.4);
			y=doc.y;
			for(var i=0;i<ventas.length;i++){
				for(var j=0;j<ventas[i].detallesVenta.length;j++){
					doc.text(ventas[i].detallesVenta[j].cantidad,20,y);
					doc.text(ventas[i].detallesVenta[j].producto.nombre,50,y,{width:100});
					doc.text(ventas[i].detallesVenta[j].total,160,y);
					y=y+20;
				}
			}
			for(var i=0;i<ventasCredito.length;i++){
				for(var j=0;j<ventasCredito[i].detallesVenta.length;j++){
					doc.text(ventasCredito[i].detallesVenta[j].cantidad,20,y);
					doc.text(ventasCredito[i].detallesVenta[j].producto.nombre,50,y,{width:100});
					doc.text(ventasCredito[i].detallesVenta[j].total,160,y);
					y=y+20;
				}
			}
			doc.y=y;
			doc.moveDown(0.4);
			doc.x=10;

			doc.font('Helvetica-Bold',8);
			doc.text("RESUMEN MOVIMIENTOS COMPRA PRODUCTOS: ",{align:'center'});
			doc.font('Helvetica',8);
			doc.moveDown(0.4);
			y=doc.y;
			for(var i=0;i<comprasContado.length;i++){
				for(var j=0;j<comprasContado[i].detallesCompra.length;j++){
					doc.text(comprasContado[i].detallesCompra[j].cantidad,20,y);
					doc.text(comprasContado[i].detallesCompra[j].producto.nombre,50,y,{width:100});
					doc.text(comprasContado[i].detallesCompra[j].total,160,y);
					y=y+20;
				}
			}
			for(var i=0;i<comprasCredito.length;i++){
				for(var j=0;j<comprasCredito[i].detallesCompra.length;j++){
					doc.text(comprasCredito[i].detallesCompra[j].cantidad,20,y);
					doc.text(comprasCredito[i].detallesCompra[j].producto.nombre,50,y,{width:100});
					doc.text(comprasCredito[i].detallesCompra[j].total,160,y);
					y=y+20;
				}
			}
			doc.y=y;
			doc.moveDown(0.4);
			doc.x=10;
		}

		if(cierre.conSaldoProductos){
			doc.font('Helvetica-Bold',8);
			doc.text("RESUMEN SALDOS DE VENTA PRODUCTOS: ",{align:'center'});
			doc.font('Helvetica',8);
			doc.moveDown(0.4);
			y=doc.y;
			for(var i=0;i<ventas.length;i++){
				for(var j=0;j<ventas[i].detallesVenta.length;j++){
					doc.text(ventas[i].detallesVenta[j].producto.nombre,50,y,{width:100});
					var saldoInventario=0;
					for(var k=0;k<ventas[i].detallesVenta[j].producto.inventarios.length;k++){
						if(ventas[i].detallesVenta[j].producto.inventarios[k].almacen.id_sucursal==sucursal.id){
							saldoInventario=saldoInventario+ventas[i].detallesVenta[j].producto.inventarios[k].cantidad;
						}
					}
					doc.text(saldoInventario+" Und.",160,y);
					y=y+20;
				}
			}
			for(var i=0;i<ventasCredito.length;i++){
				for(var j=0;j<ventasCredito[i].detallesVenta.length;j++){
					doc.text(ventasCredito[i].detallesVenta[j].producto.nombre,50,y,{width:100});
					var saldoInventario=0;
					for(var k=0;k<ventasCredito[i].detallesVenta[j].producto.inventarios.length;k++){
						if(ventasCredito[i].detallesVenta[j].producto.inventarios[k].almacen.id_sucursal==sucursal.id){
							saldoInventario=saldoInventario+ventasCredito[i].detallesVenta[j].producto.inventarios[k].cantidad;
						}
					}
					doc.text(saldoInventario+" Und.",160,y);
					y=y+20;
				}
			}
			doc.y=y;
			doc.moveDown(0.4);
			doc.x=10;

			doc.font('Helvetica-Bold',8);
			doc.text("RESUMEN SALDOS DE COMPRA PRODUCTOS: ",{align:'center'});
			doc.font('Helvetica',8);
			doc.moveDown(0.4);
			y=doc.y;
			for(var i=0;i<comprasContado.length;i++){
				for(var j=0;j<comprasContado[i].detallesCompra.length;j++){
					doc.text(comprasContado[i].detallesCompra[j].producto.nombre,50,y,{width:100});
					var saldoInventario=0;
					for(var k=0;k<comprasContado[i].detallesCompra[j].producto.inventarios.length;k++){
						if(comprasContado[i].detallesCompra[j].producto.inventarios[k].almacen.id_sucursal==sucursal.id){
							saldoInventario=saldoInventario+comprasContado[i].detallesCompra[j].producto.inventarios[k].cantidad;
						}
					}
					doc.text(saldoInventario+" Und.",160,y);
					y=y+20;
				}
			}
			for(var i=0;i<comprasCredito.length;i++){
				for(var j=0;j<comprasCredito[i].detallesCompra.length;j++){
					doc.text(comprasCredito[i].detallesCompra[j].producto.nombre,50,y,{width:100});
					var saldoInventario=0;
					for(var k=0;k<comprasCredito[i].detallesCompra[j].producto.inventarios.length;k++){
						if(comprasCredito[i].detallesCompra[j].producto.inventarios[k].almacen.id_sucursal==sucursal.id){
							saldoInventario=saldoInventario+comprasCredito[i].detallesCompra[j].producto.inventarios[k].cantidad;
						}
					}
					doc.text(saldoInventario+" Und.",160,y);
					y=y+20;
				}
			}
			doc.y=y;
			doc.moveDown(0.4);
			doc.x=10;
		}

		doc.font('Helvetica-Bold',8);
		doc.x=10;
		doc.text("-----------------------------      -----------------------------",0,y+100,{align:'center'});
		doc.text("ENTREGUE CONFORME   RECIBI CONFORME",{align:'center'});

		doc.moveDown(0.4);
		doc.font('Helvetica',8);
		var currentDate=new Date();
		doc.text("Usuario: "+$scope.usuario.nombre_usuario+" "+currentDate.getDate()+"/"+(currentDate.getMonth()+1)+"/"+currentDate.getFullYear()+" "+currentDate.getHours()+":"+currentDate.getMinutes(),{align:'center'});
		
		doc.end();
		stream.on('finish', function() {
			var fileURL = stream.toBlobURL('application/pdf');
			window.open(fileURL,'_blank','location=no');
		});
		blockUI.stop();
	}

	$scope.sumarVentasContado=function(ventas){
		var suma=0;
		for(var i=0;i<ventas.length;i++){
			suma=suma+ventas[i].total;
		}
		return suma;
	}

	$scope.sumarVentasCredito=function(ventasCredito){
		var sumaCredito=0;
		for(var i=0;i<ventasCredito.length;i++){
			if(ventasCredito[i].pagosVenta.length>0){
				if(ventasCredito[i].pagosVenta[0].a_cuenta_anterior>0){
					sumaCredito=sumaCredito+ventasCredito[i].pagosVenta[0].a_cuenta_anterior;
				}
			}else{
				sumaCredito=sumaCredito+ventasCredito[i].a_cuenta;
			}
		}
		return sumaCredito;
	}

	$scope.sumarComprasContado=function(comprasContado){
		var sumaComprasContado=0;
		for(var i=0;i<comprasContado.length;i++){
			sumaComprasContado=sumaComprasContado+comprasContado[i].total;
		}
		return sumaComprasContado;
	}

	$scope.sumarComprasCredito=function(comprasCredito){
		var sumaComprasCredito=0;
		for(var i=0;i<comprasCredito.length;i++){
			if(comprasCredito[i].pagosCompra.length>0){
				if(comprasCredito[i].pagosCompra[0].a_cuenta_anterior>0){
					sumaComprasCredito=sumaComprasCredito+comprasCredito[i].pagosCompra[0].a_cuenta_anterior;
				}
			}else{
				if(comprasCredito[i].a_cuenta){
					sumaComprasCredito=sumaComprasCredito+comprasCredito[i].a_cuenta;
				}
			}
		}
		return sumaComprasCredito;
	}

	$scope.sumarPagosVenta=function(pagos){
		var sumaPago=0;
		for(var i=0;i<pagos.length;i++){
			sumaPago=sumaPago+pagos[i].monto_pagado;
		}
		return sumaPago;
	}

	$scope.sumarPagosCompra=function(pagosCompra){
		var sumaCobro=0;
		for(var i=0;i<pagosCompra.length;i++){
			sumaCobro=sumaCobro+pagosCompra[i].monto_pagado;
		}
		return sumaCobro;
	}
	
	$scope.guardarCierreCaja=function(cierreCaja){
		blockUI.start();
		cierreCaja.$save(function(res){
			blockUI.stop();
			//$scope.cierreCaja=new CierreCaja();
		},function(error) {
			blockUI.stop();
			$scope.cerrarPopPupNuevoCierre();
			$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
			$scope.recargarItemsTabla();
		});
	}

	$scope.guardarDeposito=function(cierreCaja){
		blockUI.start();
		cierreCaja.fecha_entrega=new Date($scope.convertirFecha(cierreCaja.fechaEntregaTexto));
		CierreCajaDatos.update({id_cierre_caja:cierreCaja.id},cierreCaja,function(res){
			blockUI.stop();
			$scope.cerrarPopPupDeposito();
			$scope.mostrarMensaje('Guardado Exitosamente!');
			$scope.recargarItemsTabla();
		});
	}
	
	$scope.obtenerCierres=function(idEmpresa){
		blockUI.start();
		var usuario;
		var roles=$.grep($scope.usuario.rolesUsuario, function(e){return e.rol.nombre == $scope.diccionario.ROL_ADMINISTRADOR;});
		usuario=roles.length>0?0:$scope.usuario.id;
		var promesa=ListaCierresCaja(idEmpresa,usuario);
		promesa.then(function(cierresCaja){
			$scope.cierresCaja=cierresCaja;
			blockUI.stop();
		});
	}

	$scope.abrirPopupDeposito=function(cierreCaja){
		$scope.cierreCaja=cierreCaja;
		$scope.abrirPopup($scope.idModalDeposito);
	}

	$scope.obtenerBancos=function(idEmpresa){
		blockUI.start();
		var promesa=ListaBancos(idEmpresa);
		promesa.then(function(bancos){
			$scope.bancos=bancos;
			blockUI.stop();
		});
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
		$scope.eliminarPopup($scope.idModalWizardCierreEdicion);
		$scope.eliminarPopup($scope.idModalWizardCierreVista);
		$scope.eliminarPopup($scope.idModalEliminarCierre);
		$scope.eliminarPopup($scope.idModalDeposito);
		$scope.eliminarPopup($scope.idModalDatosAdicionalesReporte);
	});
	
	$scope.inicio();
});



