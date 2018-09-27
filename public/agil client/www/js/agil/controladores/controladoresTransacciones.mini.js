angular.module("agil.controladores").controller("controladorTransacciones",["$scope","$localStorage","$location","$templateCache","$route","blockUI","ObtenerTodoPersonal","TransaccionBancoPaginador","$timeout","Paginator","ListaBancos","ClasesTipo","TransaccionIngresoBanco","FieldViewer","TransaccionEgresoBanco","TransaccionSeguimientoBanco","TransaccionSeguimientoEstado","TransaccionRevisionEstado","SaldoCuenta","SaldoDisponibleCuenta","SaldoProformas",function(e,o,a,n,i,t,r,s,c,l,u,d,m,g,f,v,p,h,b,D,_){e.modalNuevoIngreso="modal-wizard-nuevo-ingreso",e.modalNuevoEgreso="modal-wizard-nuevo-egreso",e.modalSeguimiento="modal-wizard-seguimiento",e.modalRevision="modal-wizard-revision",e.modalVencimientoCreditos="tabla-vencimiento-creditos-transaciones",e.modalVerIngreso="modal-wizard-ver-ingreso",e.modalVerEgreso="modal-wizard-ver-egreso",e.$on("$viewContentLoaded",function(){resaltarPestaña(a.path().substring(1)),ejecutarScriptsTransacciones(e.modalNuevoIngreso,e.modalNuevoEgreso,e.modalSeguimiento,e.modalRevision,e.modalVencimientoCreditos,e.modalVerIngreso,e.modalVerEgreso),e.buscarAplicacion(e.usuario.aplicacionesUsuario,a.path().substring(1)),e.obtenerColumnasAplicacion()}),e.$on("$routeChangeStart",function(o,a){e.eliminarPopup(e.modalNuevoIngreso),e.eliminarPopup(e.modalNuevoEgreso),e.eliminarPopup(e.modalSeguimiento),e.eliminarPopup(e.modalRevision),e.eliminarPopup(e.modalVencimientoCreditos)}),e.inicio=function(){var o=new Date;e.filtro={empresa:e.usuario.empresa.id,desde:o.setDate(o.getDate()-7),hasta:(new Date).toLocaleDateString(),cuenta:0,nombre:0,concepto:0,ref_doc:0,tipo_doc:0,estado:0},e.filtro.desde=new Date(e.filtro.desde).toLocaleDateString(),e.obtenerCuentas(),e.obtenerConceptosTransaccion(),e.obtenerTiposDocumentos(),e.obtenerEstadosTransaccion(),c(function(){e.obtenerVencimientos()},5e3),e.fondosDisponibles=0,e.ingresosEnTransito=0,e.egresosEnTransito=0,e.saldoInicial=0,e.saldoFinal=0,e.saldoPignorado=0,e.fecha_hoy=(new Date).toLocaleDateString(),r(e.usuario.id_empresa).then(function(o){e.empleados=o.personal,e.obtenerTransacciones()}).catch(function(o){var a=void 0!==o.stack&&null!==o.stack?o.stack:void 0!==o.message&&null!==o.message?o.message:"Se perdió la conexión.";e.mostrarMensaje(a)})},e.obtenerConceptosTransaccion=function(){t.start(),d("CONTRAN").then(function(o){e.conceptosTransaccion=o.clases,e.conceptosTransaccion.forEach(function(o){"CTRANS"===o.nombre_corto&&(e.TRAN_COBRO=o),"PTRANS"===o.nombre_corto&&(e.TRAN_PAGO=o),"SAL_INICIAL"==o.nombre_corto&&(e.SALDO_INICIAL=o)}),t.stop()})},e.obtenerVencimientos=function(){e.vencimientosCobros=[],e.verificarVencimientosCreditos(e.usuario.id_empresa),_(e.usuario.id_empresa).then(function(o){var a=[];o.hasErr?e.mostrarMensaje(o.mensaje):(o.proformas.forEach(function(e){var o={id:e.id,factura:e.factura,total:e.monto,cliente:{razon_social:e.razon_social},a_cuenta:e.a_cuenta,saldo:e.saldo,es_proforma:!0};a.push(o)}),Array.prototype.push.apply(e.vencimientosCobros,a)),Array.prototype.push.apply(e.vencimientosCobros,e.vencimientosCreditos)}).catch(function(e){}),console.log(e.vencimientosCobros)},e.obtenerTiposDocumentos=function(){t.start(),d("TDC").then(function(o){e.tiposDocumentos=o.clases,t.stop()})},e.obtenerSaldoInicial=function(){e.saldoInicial=0,b(e.usuario.id_empresa,e.cuentaSeleccionada.id,e.filtro.desde,e.filtro.hasta).then(function(o){void 0!==o.cuenta?e.saldoInicial=o.cuenta.length?o.cuenta[0].saldo:0:e.mostrarMensaje("La cuenta Nro. "+e.cuentaSeleccionada.numero+" de "+e.cuentaSeleccionada.nombre+" no cuenta con un ingreso de apertura")}).catch(function(o){var a=void 0!==o.data&&null!==o.data?o.data:void 0!==o.message&&null!==o.message?o.message:"Se perdió la conexión.";e.mostrarMensaje(a)})},e.showSelecccionCliente=function(o){return void 0===o||null===o||(void 0===o.concepto||null===o.concepto||(void 0!==o.concepto.id?o.concepto.id!==e.SALDO_INICIAL.id:o.concepto!==e.SALDO_INICIAL.id))},e.obtenerEstadosTransaccion=function(){t.start(),d("ESTRANS").then(function(o){e.estadosTransaccion=o.clases,o.clases.map(function(o){"CONFIRMADO"==o.nombre_corto&&(e.CONFIRMADO=o),"EN_TRANSITO"==o.nombre_corto&&(e.EN_TRANSITO=o)}),t.stop()})},e.seleccionarCuenta=function(o){e.cuentaSeleccionada=void 0,e.bancos.forEach(function(a){a.id===o.id&&(e.cuentaSeleccionada=a,e.filtro.cuenta=e.cuentaSeleccionada)})},e.obtenerCuentas=function(){u(e.usuario.id_empresa).then(function(o){e.bancos=o,e.cuentaSeleccionada=e.bancos[0],e.filtro.cuenta=e.cuentaSeleccionada})},e.calcularIngresosTransito=function(){e.ingresosEnTransito=0,e.transacciones.forEach(function(o){null!==o.haber&&o.id_estado===e.EN_TRANSITO.id&&(e.ingresosEnTransito+=o.haber)})},e.calcularEgresosTransito=function(){e.egresosEnTransito=0,e.transacciones.forEach(function(o){null!==o.debe&&o.id_estado===e.EN_TRANSITO.id&&(e.egresosEnTransito+=o.debe)})},e.calcularFondosDisponibles=function(){e.fondosDisponibles=0,D(e.usuario.id_empresa,e.cuentaSeleccionada.id,0,0).then(function(o){o.hasErr&&e.mostrarMensaje(o.mensaje),e.fondosDisponibles=o.saldo,e.calcularIngresosTransito(),e.calcularEgresosTransito(),e.calcularSaldoPignorado(),e.calcularSaldoFinal(),b(e.usuario.id_empresa,e.cuentaSeleccionada.id,e.filtro.desde,e.filtro.hasta).then(function(o){e.saldoInicial=o.cuenta.length?o.cuenta[0].saldo:0})}).catch(function(o){var a=void 0!==o.stack&&null!==o.stack?o.stack:void 0!==o.message&&null!==o.message?o.message:null!==o.data&&void 0!==o.data?o.data:"Se perdió la conexión.";e.mostrarMensaje(a),t.stop()})},e.calcularSaldoFinal=function(){e.saldoFinal=e.fondosDisponibles+e.ingresosEnTransito-e.egresosEnTransito},e.calcularSaldoPignorado=function(){e.saldoPignorado=0,e.transacciones.forEach(function(o){null!==o.debe&&o.id_estado===e.EN_TRANSITO.id&&(e.saldoPignorado-=o.debe),null!==o.haber&&o.id_estado===e.EN_TRANSITO.id&&(e.saldoPignorado+=o.haber)})},e.obtenerColumnasAplicacion=function(){t.start(),e.fieldViewer=g({crear:!0,id_empresa:e.usuario.id_empresa,configuracion:{numero:{value:"N°",show:!0},fecha:{value:"Fecha",show:!0},banco:{value:"Banco",show:!0},detalle:{value:"Detalle",show:!0},nombre:{value:"Nombre completo",show:!0},concepto:{value:"Concepto",show:!0},observaciones:{value:"Observaciones",show:!0},ref_doc:{value:"Ref./Doc.",show:!0},tipo_doc:{value:"tipo Documento",show:!0},debe:{value:"Debe",show:!0},haber:{value:"Haber",show:!0},saldo:{value:"Saldo",show:!0},estado:{value:"estado",show:!0}}},e.aplicacion.aplicacion.id),e.fieldViewer.updateObject(),t.stop()},e.obtenerSaldoCuenta=function(){var o=!1;b(e.usuario.id_empresa,e.filtro.cuenta,new Date).then(function(a){o=!0,e.saldoInicial=a.transaccion.saldo}),c(function(){o?t.stop():(t.stop(),e.mostrarMensaje("La respuesta esta tardando mas de lo normal"))},5e3)},e.filtrarTransacciones=function(o,a,n){if(void 0!==n)for(var i in o)0==o[i]&&(o[i]="");else for(var i in o)""!==o[i]&&null!==o[i]&&void 0!==o[i]||(o[i]=0);if(void 0!==a&&a)return o;e.buscarTransacciones()},e.obtenerTransacciones=function(){e.paginator=l(),e.paginator.column="fecha",e.paginator.direccion="asc",e.paginator.callBack=e.buscarTransacciones,e.paginator.getSearch("")},e.buscarTransacciones=function(){t.start(),0===e.filtro.cuenta&&(e.filtro.cuenta=e.cuentaSeleccionada),e.filtro=e.filtrarTransacciones(e.filtro,!0),e.paginator.filter=e.filtro,s(e.usuario.id_empresa,e.paginator).then(function(o){o.hasErr?e.mostrarMensaje(o.mensaje):(e.transacciones=o.transacciones,e.transacciones.forEach(function(o){e.verificarSeguimiento(o)}),e.paginator.setPages(o.paginas),e.calcularFondosDisponibles(),e.obtenerSaldoInicial(),e.obtenerVencimientos()),t.stop()}),e.filtro=e.filtrarTransacciones(e.filtro,!0,!0)},e.usuario=JSON.parse(o.usuario),e.crearNuevoIngreso=function(){e.abrirModalNuevoIngreso()},e.crearNuevoEgreso=function(){e.abrirModalNuevoEgreso()},e.seguimiento=function(o){e.transaccion=o,e.abrirModalSeguimiento()},e.guardarSeguimiento=function(o){if(t.start(),null!==o.seguimientos[0].id_entregado){if(o.seguimientos[0].id_entregado!==o.seguimientos[0].entregado_por.id)return e.mostrarMensaje("No se permiten cambios!"),void t.stop();if(null===o.seguimientos[0].id_devuelto||o.seguimientos[0].proveedor)null!==o.seguimientos[0].fecha_devolucion||o.seguimientos[0].proveedor||0===o.seguimientos[0].devuelto_a||void 0===o.seguimientos[0].devuelto_a||null===o.seguimientos[0].devuelto_a||(o.seguimientos[0].fecha_devolucion=new Date,o.seguimientos[0].id_devuelto=o.seguimientos[0].devuelto_a.id);else if(o.seguimientos[0].id_devuelto!==o.seguimientos[0].devuelto_a.id)return e.mostrarMensaje("No se permiten cambios!"),void t.stop()}else null===o.seguimientos[0].fecha_entrega&&(o.seguimientos[0].fecha_entrega=new Date,o.seguimientos[0].id_entregado=o.seguimientos[0].entregado_por.id);v(e.usuario.id_empresa,o.seguimientos[0],e.usuario.id).then(function(a){a.hasErr?e.mostrarMensaje(a.mensaje):(e.mostrarMensaje(a.mensaje),e.cerrarModalSeguimiento(),e.verificarSeguimiento(o)),t.stop()}).catch(function(o){var a=void 0!==o.stack&&null!==o.stack?o.stack:void 0!==o.message&&null!==o.message?o.message:null!==o.data&&void 0!==o.data?o.data:"Se perdió la conexión.";e.mostrarMensaje(a),t.stop()})},e.verificarSeguimiento=function(e){e.seguimientos.length>0&&(null!==e.seguimientos[0].entregado_por||null!==e.seguimientos[0].devuelto_a||e.seguimientos[0].proveedor||(e.seguimientos[0].black=!0,e.seguimientos[0].yellow=void 0,e.seguimientos[0].green=void 0),null===e.seguimientos[0].entregado_por||null!==e.seguimientos[0].devuelto_a||e.seguimientos[0].proveedor||(e.seguimientos[0].black=void 0,e.seguimientos[0].yellow=!0,e.seguimientos[0].green=void 0),null===e.seguimientos[0].entregado_por||null===e.seguimientos[0].devuelto_a||e.seguimientos[0].proveedor||(e.seguimientos[0].black=void 0,e.seguimientos[0].yellow=void 0,e.seguimientos[0].green=!0),null===e.seguimientos[0].entregado_por&&null===e.seguimientos[0].devuelto_a&&e.seguimientos[0].proveedor&&(e.seguimientos[0].black=!0,e.seguimientos[0].yellow=void 0,e.seguimientos[0].green=void 0),null!==e.seguimientos[0].entregado_por&&null===e.seguimientos[0].devuelto_a&&e.seguimientos[0].proveedor&&(e.seguimientos[0].black=void 0,e.seguimientos[0].yellow=void 0,e.seguimientos[0].green=!0))},e.calcularSaldo=function(){},e.verificarConcepto=function(o){e.SALDO_INICIAL.id===o.concepto&&(o.venta=void 0,o.detalle="Ingreso apertura.")},e.guardarRevision=function(){t.start(),e.transaccion.cerrado=!0,h(e.usuario.id_empresa,e.usuario.id,e.transaccion.id).then(function(o){t.stop(),e.mostrarMensaje(o.mensaje),e.cerrarModalRevision()}).catch(function(o){var a=void 0!==o.stack&&null!==o.stack?o.stack:void 0!==o.message&&null!==o.message?o.message:null!==o.data&&void 0!==o.data?o.data:"Se perdió la conexión.";e.mostrarMensaje(a),t.stop()})},e.guardarIngreso=function(o){t.start(),o.fecha=new Date(e.convertirFecha(o.fecha)),m(e.usuario.id_empresa,o,e.usuario.id).then(function(a){if(a.hasErr)o.fecha=new Date(o.fecha).toLocaleDateString(),e.mostrarMensaje(a.mensaje);else{if(e.mostrarMensaje(a.mensaje),o.venta.saldo-=o.haber,o.venta.es_proforma){if(o.concepto!==e.SALDO_INICIAL.id){var n={pago:ConvertirALiteral(o.haber.toFixed(2))};e.imprimirReciboVencimientoCreditoProforma(n,a.venta,o.haber)}}else if(o.concepto!==e.SALDO_INICIAL.id){n={pago:ConvertirALiteral(o.haber.toFixed(2))};e.imprimirReciboVencimientoCredito(n,a.venta,o.haber,!0)}e.verificarVencimientosCreditos(e.usuario.id_empresa),e.filtrarTransacciones(e.filtro),e.cerrarModalNuevoIngreso(),e.obtenerVencimientos()}t.stop()}).catch(function(a){var n=void 0!==a.stack&&null!==a.stack?a.stack:void 0!==a.message&&null!==a.message?a.message:null!==a.data&&void 0!==a.data?a.data:"Se perdió la conexión.";e.mostrarMensaje(n),o.fecha=new Date(o.fecha).toLocaleDateString(),t.stop()})},e.guardarEgreso=function(o){t.start(),o.fecha=new Date(e.convertirFecha(o.fecha)),f(e.usuario.id_empresa,o,e.usuario.id).then(function(a){a.hasErr?(e.mostrarMensaje(a.mensaje),o.fecha=o.fecha.toLocaleDateString()):(e.mostrarMensaje(a.mensaje),e.verificarVencimientosDeudas(e.usuario.id_empresa),e.filtrarTransacciones(e.filtro),e.cerrarModalNuevoEgreso()),t.stop()}).catch(function(a){var n=void 0!==a.stack&&null!==a.stack?a.stack:void 0!==a.message&&null!==a.message?a.message:null!==a.data&&void 0!==a.data?a.data:"Se perdió la conexión.";e.mostrarMensaje(n),o.fecha=o.fecha.toLocaleDateString(),t.stop()})},e.imprimirReciboVencimientoCreditoProforma=function(o,a,n){t.start();var i=new PDFDocument({size:[227,353],margin:10}),r=i.pipe(blobStream());i.moveDown(2),i.font("Helvetica-Bold",8),i.text(e.usuario.empresa.razon_social.toUpperCase(),{align:"center"}),i.moveDown(.4),i.font("Helvetica",7),i.text(a.sucursal.nombre.toUpperCase(),{align:"center"}),i.moveDown(.4),i.text(a.sucursal.direccion.toUpperCase(),{align:"center"}),i.moveDown(.4);var s=(null!=a.sucursal.telefono1?a.sucursal.telefono1:"")+(null!=a.sucursal.telefono2?"-"+a.sucursal.telefono2:"")+(null!=a.sucursal.telefono3?"-"+a.sucursal.telefono3:"");i.text("TELF.: "+s,{align:"center"}),i.moveDown(.4),i.text("COCHABAMBA - BOLIVIA",{align:"center"}),i.moveDown(.5),i.font("Helvetica-Bold",8),i.text("RECIBO",{align:"center"}),i.font("Helvetica",7),i.moveDown(.4),i.text("------------------------------------",{align:"center"}),i.moveDown(.4),i.text(a.sucursal.nota_recibo_correlativo,{align:"center"}),i.moveDown(.4),i.moveDown(.4),i.text("------------------------------------",{align:"center"}),i.moveDown(.4),i.moveDown(.6);var c=new Date;i.text("FECHA : "+c.getDate()+"/"+(c.getMonth()+1)+"/"+c.getFullYear(),{align:"left"}),i.moveDown(.4),i.text("He recibido de : "+a.cliente.razon_social,{align:"left"}),i.moveDown(.4),i.text("---------------------------------------------------------------------------------",{align:"center"}),i.moveDown(.2),i.text("                                        CONCEPTO                                   ",{align:"left"}),i.moveDown(.2),i.text("---------------------------------------------------------------------------------",{align:"center"}),i.moveDown(.4),a.fecha=new Date(a.fecha),i.text("Fecha: "+a.fecha.getDate()+"/"+(a.fecha.getMonth()+1)+"/"+a.fecha.getFullYear(),15,210);var l=a.factura;i.text(l,105,210,{width:100}),i.text("Saldo Bs "+(a.saldo-n)+".-",105,220,{width:100}),i.text("Bs "+n+".-",170,210,{width:100}),i.text("--------------",10,230,{align:"right"}),i.moveDown(.3),i.text("TOTAL Bs.              "+n.toFixed(2),{align:"right"}),i.moveDown(.4),i.moveDown(.4),i.text("SON: "+o.pago,{align:"left"}),i.moveDown(.6),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.moveDown(.4),i.text("-------------------------                       -------------------------",{align:"center"}),i.text("ENTREGUE CONFORME            RECIBI CONFORME",{align:"center"}),i.end(),r.on("finish",function(){var e=r.toBlobURL("application/pdf");window.open(e,"_blank","location=no")}),t.stop()},e.estadoConfirmado=function(o){t.start();var a=!0;if(null!==o.seguimientos[0].id_entregado&&(null!==o.seguimientos[0].id_devuelto&&!o.seguimientos[0].proveedor||null===o.seguimientos[0].id_devuelto&&o.seguimientos[0].proveedor)){if(e.estadosTransaccion.map(function(e,n){"CONFIRMADO"==e.nombre&&(o.estado=e,a=!1)}),a)return t.stop(),void e.mostrarMensaje("Hubo un error al confirmar el estado");p(e.usuario.id_empresa,o.estado.id,e.usuario.id,o.id).then(function(a){a.hasErr?e.mostrarMensaje(a.mensaje):(o.estado.confirmado=!0,e.filtrarTransacciones(e.filtro),e.mostrarMensaje(a.mensaje)),t.stop()}).catch(function(o){t.stop();var a=void 0!==o.stack&&null!==o.stack?o.stack:void 0!==o.message&&null!==o.message?o.message:"Se perdió la conexión.";e.mostrarMensaje(a)})}else t.stop(),e.mostrarMensaje("No se puede confirmar el estado de la transacción, no existe información de seguimiento o esta inclompleta.")},e.abrirModalNuevoIngreso=function(){e.verificarVencimientosCreditos(e.usuario.id_empresa),e.ingreso={},e.ingreso.fecha=(new Date).toLocaleDateString(),e.abrirPopup(e.modalNuevoIngreso)},e.abrirModalVerIngreso=function(o){e.ingreso=o,e.ingreso.fecha=new Date(e.ingreso.fecha).toLocaleDateString(),e.abrirPopup(e.modalVerIngreso)},e.cerrarModalNuevoIngreso=function(){e.ingreso=void 0,e.cerrarPopup(e.modalNuevoIngreso)},e.cerrarModalVerIngreso=function(){e.ingreso=void 0,e.cerrarPopup(e.modalVerIngreso)},e.abrirModalNuevoEgreso=function(){e.egreso={},e.egreso.fecha=(new Date).toLocaleDateString(),e.abrirPopup(e.modalNuevoEgreso)},e.cerrarModalNuevoEgreso=function(){e.egreso=void 0,e.cerrarPopup(e.modalNuevoEgreso)},e.abrirModalVerEgreso=function(o){e.egreso=o,e.egreso.fecha=(new Date).toLocaleDateString(),e.abrirPopup(e.modalVerEgreso)},e.cerrarModalVerEgreso=function(){e.egreso=void 0,e.cerrarPopup(e.modalVerEgreso)},e.abrirModalSeguimiento=function(){e.abrirPopup(e.modalSeguimiento)},e.cerrarModalSeguimiento=function(){e.transaccion=void 0,e.cerrarPopup(e.modalSeguimiento)},e.obtenerSaldoDiaAnterior=function(){new Date;obtenerSaldoCuenta(e.usuario.id_empresa).then(function(o){o.hasErr&&e.mostrarMensaje(o.mensaje)})},e.abrirModalRevision=function(o){var a=!0;d("ESTRANS").then(function(n){n.clases.map(function(i,t){o.id_estado==i.id&&"CONFIRMADO"===i.nombre&&(a=!1),t===n.clases.length-1&&(a?e.mostrarMensaje("La transaccion no se puede cerrar, aún no ha sido confirmada."):(e.transaccion=o,e.abrirPopup(e.modalRevision)))})}).catch(function(o){var a=void 0!==o.stack&&null!==o.stack?o.stack:void 0!==o.message&&null!==o.message?o.message:"Se perdió la conexión.";e.mostrarMensaje(a)})},e.cerrarModalRevision=function(){e.transaccion=void 0,e.cerrarPopup(e.modalRevision)},e.abrirModalVencimientoCreditos=function(){e.abrirPopup(e.modalVencimientoCreditos)},e.establecerConceptoIngreso=function(e){e.detalle="Cobro Factura N° "+e.venta.factura,e.factura=e.venta.factura,e.haber=e.venta.saldo},e.establecerConceptoEgreso=function(e){e.detalle="Pago Factura N° "+e.compra.factura,e.factura=e.compra.factura,e.debe=e.compra.saldo},e.cerrarModalVencimientoCreditos=function(){e.transaccion=void 0,e.cerrarPopup(e.modalVencimientoCreditos)},e.inicio()}]);