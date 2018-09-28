angular.module("agil.controladores").controller("ControladorVehiculos",["$scope","blockUI","$localStorage","$location","$templateCache","$route","$timeout","Diccionario","ClasesTipo","$window","Paginator","VehiculosPaginador","FieldViewer","ListaMantenimientoVehiculo","ClasesTipo","ListaMantenimientoEncargado","ProductosPanel","ListaProductosEmpresa","ListaInventariosProducto","GuardarNuevaOrdendeTrabajo","ActualizarOrdendeTrabajo","DatosFechasVehiculos","ObtenerDatosVehiculo",function(a,e,o,i,n,r,t,c,l,d,u,s,m,p,l,v,f,h,M,b,g,P,E){a.usuario=JSON.parse(o.usuario),a.modalNuevoMantenimiento="dialog-iniciar-mantenimiento",a.modalReportarIncidente="modal-reportar-incidente",a.modalCheckListDiario="modal-checklist-diario",a.modalCheckListMensual="modal-checklist-mensual",a.modalEditarHistorico="dialog-editar-historico",a.modalOTEdicionCorrectivo="dialog-edicion-correctivo",a.modalMantenimientoCorrectivo="dialog-mantenimiento-correctivo",a.modalBusquedaProducto="dialog-busqueda-producto",a.modalBusquedaEncargado="dialog-busqueda-encargado",a.modalLogin="dialog-login",a.modalNuevoMantenimientoMaquinaria="dialog-iniciar-mantenimiento-maquinaria",a.modalCheckListMensualMaquinaria="modal-checklist-mensual-maquinaria",a.modalEditarItemList="dialog-editar-item-list",a.modalProxMantenimientoMaquinaria="dialog-prox-mantenimiento-maquinaria",a.modalProxMantenimientoVehiculo="dialog-prox-mantenimiento-vehiculo",a.modalCalendar="dialog-calendar",a.modalFichaVehiculo="dialog-ficha-vehiculo",a.modalEditarCheckList="modal-editar-checklist",a.modalBuscarMaquinaria="dialog-buscar-maquinaria",a.modalReportarIncidenteMaquinaria="modal-reportar-incidente-maquinaria",a.idModalInicioMantenimiento="dialog-iniciar-mantenimiento",a.idModalOTNuevo="dialog-ot-nuevo",a.idModalFacturaServicioExterno="dialog-factura-servicioExterno",a.idModaRepuestosOT="panel-repuestos-ot",a.idModalwizardContainerOTNuevo="modal-wizard-ot-nuevo-container",a.idModalEventoCalendario="dialog-evento-calendario",a.idModalEditarEventoCalendario="dialog-editar-evento-calendario",console.log(i.path()),a.$on("$viewContentLoaded",function(){resaltarPestaña(i.path().substring(1)),ejecutarScriptsVehiculos(a.modalNuevoMantenimiento,a.modalReportarIncidente,a.modalCheckListDiario,a.modalCheckListMensual,a.modalEditarHistorico,a.modalOTEdicionCorrectivo,a.modalMantenimientoCorrectivo,a.modalBusquedaProducto,a.modalBusquedaEncargado,a.modalLogin,a.modalNuevoMantenimientoMaquinaria,a.modalCheckListMensualMaquinaria,a.modalEditarItemList,a.modalProxMantenimientoMaquinaria,a.modalProxMantenimientoVehiculo,a.modalCalendar,a.modalFichaVehiculo,a.modalEditarCheckList,a.modalBuscarMaquinaria,a.modalReportarIncidenteMaquinaria,a.idModalInicioMantenimiento,a.idModalOTNuevo,a.idModalwizardContainerOTNuevo,a.idModalFacturaServicioExterno,a.idModaRepuestosOT,a.idModalEventoCalendario,a.idModalEditarEventoCalendario),a.buscarAplicacion(a.usuario.aplicacionesUsuario,i.path().substring(1)),a.obtenerColumnasAplicacion()}),a.$on("$routeChangeStart",function(e,o){a.eliminarPopup(a.modalNuevoMantenimiento),a.eliminarPopup(a.modalReportarIncidente),a.eliminarPopup(a.modalCheckListDiario),a.eliminarPopup(a.modalCheckListMensual),a.eliminarPopup(a.modalEditarHistorico),a.eliminarPopup(a.modalMantenimientoCorrectivo),a.eliminarPopup(a.modalOTEdicionCorrectivo),a.eliminarPopup(a.modalBusquedaProducto),a.eliminarPopup(a.modalBusquedaEncargado),a.eliminarPopup(a.modalLogin),a.eliminarPopup(a.modalNuevoMantenimientoMaquinaria),a.eliminarPopup(a.modalCheckListMensualMaquinaria),a.eliminarPopup(a.modalEditarItemList),a.eliminarPopup(a.modalProxMantenimientoMaquinaria),a.eliminarPopup(a.modalProxMantenimientoVehiculo),a.eliminarPopup(a.modalCalendar),a.eliminarPopup(a.modalFichaVehiculo),a.eliminarPopup(a.modalEditarCheckList),a.eliminarPopup(a.modalBuscarMaquinaria),a.eliminarPopup(a.modalReportarIncidenteMaquinaria),a.eliminarPopup(a.idModalOTNuevo),a.eliminarPopup(a.idModalEventoCalendario),a.eliminarPopup(a.idModalEditarEventoCalendario),a.eliminarPopup(a.idModaRepuestosOT)}),a.inicio=function(){a.ObteneVehiculos(),a.obtenerTiposMantenimiento(),a.obtenerTiposSistemasOrdenTrabajo(),a.obtenerTiposPrioridad(),a.obtenerTiposEspecialidad(),a.aplicarCalendario(),a.sucursales=a.obtenerSucursales()},a.abrirReportarIncidenteMaquinaria=function(){abrirPopup(a.modalReportarIncidenteMaquinaria)},a.abrirEventoCalendario=function(){abrirPopup(a.idModalEventoCalendario)},a.abrirEditarEventoCalendario=function(){abrirPopup(a.idModalEditarEventoCalendario)},a.abrirBuscarMaquinaria=function(){abrirPopup(a.modalBuscarMaquinaria)},a.abrirEditarCheckList=function(){abrirPopup(a.modalEditarCheckList)},a.abrirFichaVehiculo=function(){abrirPopup(a.modalFichaVehiculo)},a.abrirOTCalendar=function(){a.calendario={id_empresa:a.usuario.id_empresa,correctivo:!1,preventivo:!1,rutina:!1,entrega:!1},abrirPopup(a.modalCalendar)},a.abrirProxMantenimientoVehiculos=function(){abrirPopup(a.modalProxMantenimientoVehiculo)},a.abrirProxMantenimientoMaquinaria=function(){abrirPopup(a.modalProxMantenimientoMaquinaria)},a.abrirEditarItemList=function(){abrirPopup(a.modalEditarItemList)},a.abrirCheckListMensualMaquinaria=function(){abrirPopup(a.modalCheckListMensualMaquinaria)},a.abrirNuevoMantenimientoMaquinaria=function(){abrirPopup(a.modalNuevoMantenimientoMaquinaria)},a.abrirModalLogin=function(){abrirPopup(a.modalLogin)},a.abrirBusquedaEncargado=function(){abrirPopup(a.modalBusquedaEncargado)},a.abrirBusquedaProducto=function(){abrirPopup(a.modalBusquedaProducto)},a.abrirMantenimientoCorrectivo=function(){abrirPopup(a.modalMantenimientoCorrectivo)},a.abrirOTEdicionCorrectivo=function(e){promesa=E(a.usuario.id_empresa,e.id),promesa.then(function(o){a.editOt=!0,a.vehiculo=o.mantenimiento,a.vehiculo.fecha_hora_inicio=moment(e.fecha_hora_inicio).format("MM/DD/YYYY h:mm A"),a.vehiculo.fecha_hora_fin=moment(e.fecha_hora_inicio).format("MM/DD/YYYY h:mm A"),a.vehiculo.fecha_hora_aviso=moment(e.fecha_hora_inicio).format("MM/DD/YYYY h:mm A"),a.vehiculo.manosDeObra.forEach(function(e){e.horas=24*a.diferenciaEntreDiasEnDias(new Date(e.fecha_inicio),new Date(e.fecha_fin))},this),console.log(a.vehiculo),abrirPopup(a.modalOTEdicionCorrectivo)})},a.abrirEditarHistorico=function(){abrirPopup(a.modalEditarHistorico)},a.abrirCheckListMensual=function(){abrirPopup(a.modalCheckListMensual)},a.abrirCheckListDiario=function(){abrirPopup(a.modalCheckListDiario)},a.abrirReportarIncidente=function(){abrirPopup(a.modalReportarIncidente)},a.abrirNuevoMantenimiento=function(){abrirPopup(a.modalNuevoMantenimiento)},a.abrirPopup=function(a){abrirPopup(a)},a.cerrarPopup=function(a){ocultarPopup(a)},a.cerrarEventoCalendario=function(){a.cerrarPopup(a.idModalEventoCalendario)},a.cerrarEditarEventoCalendario=function(){a.cerrarPopup(a.idModalEditarEventoCalendario)},a.cerrarReportarIncidenteMaquinaria=function(){a.cerrarPopup(a.modalReportarIncidenteMaquinaria)},a.cerrarBuscarMaquinaria=function(){a.cerrarPopup(a.modalBuscarMaquinaria)},a.cerrarEditarCheckList=function(){a.cerrarPopup(a.modalEditarCheckList)},a.cerrarFichaVehiculo=function(){a.cerrarPopup(a.modalFichaVehiculo)},a.cerrarOTCalendar=function(){a.cerrarPopup(a.modalCalendar)},a.cerrarProxMantenimientoVehiculos=function(){a.cerrarPopup(a.modalProxMantenimientoVehiculo)},a.cerrarProxMantenimientoMaquinaria=function(){a.cerrarPopup(a.modalProxMantenimientoMaquinaria)},a.cerrarEditarItemList=function(){a.cerrarPopup(a.modalEditarItemList)},a.cerrarCheckListMensualMaquinaria=function(){a.cerrarPopup(a.modalCheckListMensualMaquinaria)},a.cerrarNuevoMantenimientoMaquinaria=function(){a.cerrarPopup(a.modalNuevoMantenimientoMaquinaria)},a.cerrarModalLogin=function(){a.cerrarPopup(a.modalLogin)},a.cerrarBusquedaEncargado=function(){a.cerrarPopup(a.modalBusquedaEncargado)},a.cerrarBusquedaProducto=function(){a.cerrarPopup(a.modalBusquedaProducto)},a.cerrarMantenimientoCorrectivo=function(){a.cerrarPopup(a.modalMantenimientoCorrectivo)},a.cerrarOTEdicionCorrectivo=function(){a.editOt=!1,a.cerrarPopup(a.modalOTEdicionCorrectivo)},a.cerrarEditarHistorico=function(){a.cerrarPopup(a.modalEditarHistorico)},a.cerrarCheckListMensual=function(){a.cerrarPopup(a.modalCheckListMensual)},a.cerrarCheckListDiario=function(){a.cerrarPopup(a.modalCheckListDiario)},a.cerrarReportarIncidente=function(){a.cerrarPopup(a.modalReportarIncidente)},a.cerrarNuevoMantenimiento=function(){a.cerrarPopup(a.modalNuevoMantenimiento)},a.eliminarPopup=function(a){eliminarPopup(a)},a.enfocar=function(a){t(function(){$("#"+a).focus()},0)},a.abrirDialogInicioMantenimiento=function(){a.nuevoOt={tipo_mantenimiento:"",ordenTrabajoManoObra:[],servicioExterno:[]},a.abrirPopup(a.idModalInicioMantenimiento)},a.cerrarPopUpInicioMantenimiento=function(){a.cerrarPopup(a.idModalInicioMantenimiento)},a.abrirDialogOTnuevo=function(e){e&&(a.ordenTrabajoManoObra={edit:!1},console.log(a.ordenTrabajoManoObra),a.cerrarPopUpInicioMantenimiento(),a.abrirPopup(a.idModalOTNuevo))},a.cerrarOTnuevo=function(){a.cerrarPopup(a.idModalOTNuevo)},a.abrirDialogFacturaServicioExterno=function(){a.abrirPopup(a.idModalFacturaServicioExterno)},a.cerrarDialogFacturaServicioExterno=function(){a.cerrarPopup(a.idModalFacturaServicioExterno)},a.abrirDialogRepuestosOT=function(){a.venta={detallesVenta:[]},a.abrirPopup(a.idModaRepuestosOT)},a.cerrarDialogRepuestosOT=function(){a.cerrarPopup(a.idModaRepuestosOT)},a.interceptarTecla=function(e,o,i){13===e.which&&(i?a.enfocar(o):t(function(){$("#"+o).trigger("click")},0))},a.obtenerListaVehiculos=function(){if(e.start(),0!=a.paginator.filter.inicio&&null!=a.paginator.filter.inicio){var o=a.paginator.filter.inicio,i=a.paginator.filter.fin;a.paginator.filter.inicio=new Date(a.convertirFecha(a.paginator.filter.inicio)),a.paginator.filter.fin=new Date(a.convertirFecha(a.paginator.filter.fin))}else a.paginator.filter.inicio=0,a.paginator.filter.fin=0;var n=s(a.paginator);a.totalImporte=0,n.then(function(n){a.paginator.setPages(n.paginas),a.vehiculos=n.vehiculos,a.filtro={empresa:a.usuario.id_empresa,inicio:"",fin:"",tipo_activo:"",placa:"",marca:"",modelo:"",anio:"",tipo_mantenimiento:"",numero_ot:"",estado_ot:"",campamento:""},a.paginator.filter.inicio=o,a.paginator.filter.fin=i,e.stop()})},a.ObteneVehiculos=function(){a.paginator=u(),a.paginator.column="diagnostico",a.paginator.callBack=a.obtenerListaVehiculos,a.filtro={empresa:a.usuario.id_empresa,inicio:"",fin:"",tipo_activo:"",placa:"",marca:"",modelo:"",anio:"",tipo_mantenimiento:"",numero_ot:"",estado_ot:"",campamento:""},null!=a.filtro.inicio&&a.paginator.getSearch("",a.filtro)},a.obtenerColumnasAplicacion=function(){a.fieldViewer=m({crear:!0,id_empresa:a.usuario.id_empresa,configuracion:{cod_usuario:{value:"Cod-Usuario",show:!0},fecha:{value:"Fecha.",show:!0},anio:{value:"año",show:!0},imagen:{value:"Imagen",show:!0},ot:{value:"OT",show:!0},estado_OT:{value:"Estado-OT",show:!0},Tipo_de_activo:{value:"Tipo-de-activo",show:!0},km:{value:"Km",show:!0},usuario:{value:"Usuario",show:!0},marca:{value:"Marca",show:!0},modelo:{value:"Modelo",show:!0},mantenimiento:{value:"Manteniminto",show:!0},campamento:{value:"Campamento",show:!0}}},a.aplicacion.aplicacion.id),a.fieldViewer.updateObject()},a.establecervehiculo=function(e){a.nuevoOt.vehiculo=e},a.establecerEncargado=function(e){a.ordenTrabajoManoObra.encargado=e},a.buscarVehiculos=function(e){if(""!=e&&void 0!=e)return p(a.usuario.id_empresa,e)},a.buscarEncargado=function(e){if(""!=e&&void 0!=e)return v(a.usuario.id_empresa,e)},a.buscarProducto=function(e){if(""!=e&&void 0!=e)return h(a.usuario.id_empresa,e)},a.establecerProducto=function(e){e.tipoProducto=null==e.tipoProducto?{id:e["tipoProducto.id"],nombre:e["tipoProducto.nombre"],nombre_corto:e["tipoProducto.nombre_corto"]}:e.tipoProducto,a.editar_precio=!1,M(e.id,a.venta.almacen.id).then(function(o){e.inventarios=o;for(var i=0;i<e.inventarios.length;i++)e.inventarios[i].fecha_vencimiento=e.inventarios[i].fecha_vencimiento?new Date(e.inventarios[i].fecha_vencimiento):null,e.inventarios[i].fechaVencimientoTexto=e.inventarios[i].fecha_vencimiento?e.inventarios[i].fecha_vencimiento.getDate()+"/"+(e.inventarios[i].fecha_vencimiento.getMonth()+1)+"/"+e.inventarios[i].fecha_vencimiento.getFullYear():"",e.inventarios[i].detallesMovimiento[0].movimiento.fecha=new Date(e.inventarios[i].detallesMovimiento[0].movimiento.fecha),e.inventarios[i].detallesMovimiento[0].movimiento.fechaTexto=e.inventarios[i].detallesMovimiento[0].movimiento.fecha.getDate()+"/"+(e.inventarios[i].detallesMovimiento[0].movimiento.fecha.getMonth()+1)+"/"+e.inventarios[i].detallesMovimiento[0].movimiento.fecha.getFullYear();a.inventariosDisponibleProducto=[],a.inventariosDisponibleProducto.push({id:0,fecha_vencimiento:"TODOS",fechaVencimientoTexto:"TODOS"}),a.inventariosDisponibleProducto=a.inventariosDisponibleProducto.concat(e.inventarios);var n=a.obtenerInventarioTotal(e);a.detalleVenta={producto:e,precio_unitario:e.precio_unitario,inventarioProducto:a.inventariosDisponibleProducto[0],inventario_disponible:n,costos:e.activar_inventario?e.inventarios:[],cantidad:1,descuento:e.descuento,recargo:0,ice:0,excento:0,tipo_descuento:e.descuento>0,tipo_recargo:!1},a.colorearInventarioDisponible(n,e),a.calcularImporte(),a.cerrarPopup(a.idModalInventario),a.enfocar("cantidad")})},a.obtenerInventarioTotalPorFechaVencimiento=function(e){for(var o=e.inventarioProducto.cantidad,i=0;i<a.venta.detallesVenta.length;i++)a.venta.detallesVenta[i].producto.id==e.producto.id&&a.venta.detallesVenta[i].costos[0].id==e.inventarioProducto.id&&(o-=a.venta.detallesVenta[i].cantidad);return o},a.sumarTotal=function(){for(var e=0,o=0;o<a.venta.detallesVenta.length;o++)e+=a.venta.detallesVenta[o].total;a.venta.total=Math.round(1e3*e)/1e3},a.calcularSaldo=function(){a.venta.saldo=a.venta.total-a.venta.a_cuenta},a.calcularCambio=function(){a.esContado?(a.venta.cambio=Math.round(100*(a.venta.pagado-a.venta.total))/100,a.pagoMinimo=a.venta.total):(a.venta.cambio=0,a.pagoMinimo=0)},a.GuardarDetalleMateriales=function(e){a.editOt?(e.forEach(function(e){a.vehiculo.materiales.push(e)},this),a.cerrarDialogRepuestosOT()):(a.nuevoOt.materiales=e,a.nuevoOt.totalMaterial=a.venta.total,a.cerrarDialogRepuestosOT())},a.eliminarDetalleVenta=function(e){a.venta.detallesVenta.splice(a.venta.detallesVenta.indexOf(e),1),a.sumarTotal(),a.sumarTotalImporte(),a.calcularSaldo(),a.calcularCambio()},a.sumarTotalImporte=function(){for(var e=0,o=0;o<a.venta.detallesVenta.length;o++)e+=a.venta.detallesVenta[o].importe;a.venta.importe=Math.round(1e3*e)/1e3},a.agregarDetalleVenta=function(e){if(e.producto.activar_inventario)if(e.costos.length>1)for(var o=e.cantidad,i=0,n=JSON.parse(JSON.stringify(e));i<e.costos.length&&o>0;){e.inventarioProducto=e.costos[i];var r=a.obtenerInventarioTotalPorFechaVencimiento(e);if(r>0){var t,c=JSON.parse(JSON.stringify(n));i>0&&(c.descuento=0,c.recargo=0,c.ice=0,c.excento=0),a.detalleVenta=c,o>r?(t=r,o-=r):(t=o,o=0),c.cantidad=t,c.fecha_vencimiento=e.costos[i].fecha_vencimiento,c.lote=e.costos[i].lote,c.costos=[],c.costos.push(e.costos[i]),c.inventario=e.costos[i],a.calcularImporte(),a.venta.detallesVenta.push(c)}i++}else e.fecha_vencimiento=e.costos[0].fecha_vencimiento,e.lote=e.costos[0].lote,e.inventario=e.costos[0],a.venta.detallesVenta.push(e);else a.venta.detallesVenta.push(e);a.inventariosDisponibleProducto=[],a.sumarTotal(),a.sumarTotalImporte(),a.calcularSaldo(),a.calcularCambio(),a.detalleVenta={producto:{activar_inventario:!0},cantidad:1,descuento:0,recargo:0,ice:0,excento:0,tipo_descuento:!1,tipo_recargo:!1},a.enfocar("id_producto")},a.calcularImporte=function(){var e,o;a.detalleVenta.importe=Math.round(a.detalleVenta.cantidad*a.detalleVenta.precio_unitario*1e3)/1e3,e=a.detalleVenta.tipo_descuento?a.detalleVenta.importe*(a.detalleVenta.descuento/100):a.detalleVenta.descuento,o=a.detalleVenta.tipo_recargo?a.detalleVenta.importe*(a.detalleVenta.recargo/100):a.detalleVenta.recargo,a.detalleVenta.total=Math.round(1e3*(a.detalleVenta.importe-e+o-a.detalleVenta.ice-a.detalleVenta.excento))/1e3},a.colorearInventarioDisponible=function(e,o){0==e?(a.porcentaje="100",a.color="red"):e>3*o.inventario_minimo+1?(a.porcentaje="100",a.color="green"):e>2*o.inventario_minimo+1?(a.porcentaje="75",a.color="green"):e>1.5*o.inventario_minimo+1?(a.porcentaje="50",a.color="green"):e==o.inventario_minimo+1?(a.porcentaje="38",a.color="yellow"):e==o.inventario_minimo?(a.porcentaje="25",a.color="red"):e<o.inventario_minimo&&e>0&&(a.porcentaje="12",a.color="red")},a.obtenerInventarioTotal=function(e){var o=0;if(e.activar_inventario){for(var i=0;i<e.inventarios.length;i++)o+=e.inventarios[i].cantidad;for(var n=0;n<a.venta.detallesVenta.length;n++)a.venta.detallesVenta[n].producto.id==e.id&&(o-=a.venta.detallesVenta[n].cantidad)}else o=5e5;return o},a.obtenerTiposMantenimiento=function(){e.start(),l("MTM").then(function(o){a.tiposMantenimiento=o.clases,e.stop()})},a.obtenerTiposSistemasOrdenTrabajo=function(){e.start(),l("SOT").then(function(o){a.tiposSistemas=o.clases,e.stop()})},a.obtenerTiposPrioridad=function(){e.start(),l("TPM").then(function(o){a.tiposPrioridad=o.clases,e.stop()})},a.obtenerTiposEspecialidad=function(){e.start(),l("TEM").then(function(o){a.tiposEspecialidad=o.clases,e.stop()})},a.obtenerSucursales=function(){for(var e=[],o=0;o<a.usuario.sucursalesUsuario.length;o++)e.push(a.usuario.sucursalesUsuario[o].sucursal);return e},a.obtenerAlmacenesActividades=function(e){a.obtenerAlmacenes(e),a.obtenerActividades(e)},a.obtenerAlmacenes=function(e){a.almacenes=[];var o=$.grep(a.sucursales,function(a){return a.id==e})[0];a.almacenes=o.almacenes,a.venta.almacen=1==a.almacenes.length?a.almacenes[0]:null,a.venta.almacen&&a.cargarProductos()},a.obtenerActividades=function(e){a.actividades=[];var o=$.grep(a.sucursales,function(a){return a.id==e})[0];a.actividadesDosificaciones=o.actividadesDosificaciones,a.actividades=[];for(var i=0;i<a.actividadesDosificaciones.length;i++)a.actividades.push(a.actividadesDosificaciones[i].actividad);a.venta.actividad=1==a.actividades.length?a.actividades[0]:null},a.cargarProductos=function(){f(a.usuario.id_empresa,a.venta.almacen.id).then(function(e){for(var i=0;i<e.length;i++)e[i].activar_inventario&&(e[i].inventario_disponible=a.obtenerInventarioTotal(e[i]));if(a.productos=e,angular.isDefined(o.productosProcesados)){a.productosProcesados=e;for(i=0;i<o.productosProcesados.length;i++)for(var n=0;n<a.productosProcesados.length;n++)o.productosProcesados[i].id==a.productosProcesados[n].id&&(a.productosProcesados[n].rankin=o.productosProcesados[i].rankin)}else a.productosProcesados=e;setTimeout(function(){aplicarSwiper(4,3,!0,2)},1e3)})},a.obtenerInventarioTotal=function(e){var o=0;if(e.activar_inventario){for(var i=0;i<e.inventarios.length;i++)o+=e.inventarios[i].cantidad;for(var n=0;n<a.venta.detallesVenta.length;n++)a.venta.detallesVenta[n].producto.id==e.id&&(o-=a.venta.detallesVenta[n].cantidad)}else o=5e5;return o},a.diferenciaEntreDiasEnDias=function(a,e){var o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()),i=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.floor((i-o)/864e5)},a.agregarManoDeObra=function(e){e.horas=24*a.diferenciaEntreDiasEnDias(new Date(e.fecha_inicio),new Date(e.fecha_fin)),e.eliminado=!1,a.nuevoOt.ordenTrabajoManoObra.push(e),a.ordenTrabajoManoObra={edit:!1}},a.agregarManoDeObraVehiculo=function(e){e.horas=24*a.diferenciaEntreDiasEnDias(new Date(e.fecha_inicio),new Date(e.fecha_fin)),e.eliminado=!1,a.vehiculo.manosDeObra.push(e),a.ordenTrabajoManoObra={edit:!1}},a.agregarServicioExterno=function(e){e.eliminado=!1,a.nuevoOt.servicioExterno.push(e),a.servicioExterno={}},a.agregarServicioExternoVehiculo=function(e){e.eliminado=!1,a.vehiculo.serviciosExternos.push(e),a.servicioExterno={}},a.eliminarProductoVehiculo=function(e){a.vehiculo.materiales.splice(a.vehiculo.materiales.indexOf(e),1)},a.eliminarManoDeObra=function(e){a.nuevoOt.ordenTrabajoManoObra.splice(a.nuevoOt.ordenTrabajoManoObra.indexOf(e),1)},a.eliminarManoDeObraVehiculo=function(e){a.vehiculo.manosDeObra.splice(a.vehiculo.manosDeObra.indexOf(e),1)},a.eliminarServicioExterno=function(e){a.nuevoOt.servicioExterno.splice(a.nuevoOt.ordenTrabajoManoObra.indexOf(e),1)},a.eliminarServicioExternoVehiculo=function(e){a.vehiculo.serviciosExternos.splice(a.vehiculo.serviciosExternos.indexOf(e),1)},a.saveFormNuevoOt=function(){var e=$("#siguiente").text().trim();console.log(a.paciente),"Siguiente"!=e&&(promesa=b(a.nuevoOt),promesa.then(function(e){a.cerrarOTnuevo(),a.mostrarMensaje(e.message),a.recargarItemsTabla()}))},a.GuardarOtActializado=function(){promesa=g(a.vehiculo),promesa.then(function(e){a.cerrarOTEdicionCorrectivo(),a.mostrarMensaje(e.message),a.recargarItemsTabla()})},a.editarManoObra=function(e,o){a.ordenTrabajoManoObra=e,a.ordenTrabajoManoObra.especialidad=e.especialidad,a.ordenTrabajoManoObra.fecha_inicio=moment(e.fecha_inicio).format("MM/DD/YYYY h:mm A"),a.ordenTrabajoManoObra.fecha_fin=moment(e.fecha_fin).format("MM/DD/YYYY h:mm A"),a.ordenTrabajoManoObra.edit=!0,a.ordenTrabajoManoObra.index=o,console.log(a.ordenTrabajoManoObra)},a.guardarManoObraEditada=function(e){a.nuevoOt.ordenTrabajoManoObra[e.index]=e,a.ordenTrabajoManoObra={edit:!1}},a.guardarManoObraEditadaVehiculo=function(e){a.vehiculo.manosDeObra[e.index]=e,a.vehiculo.manosDeObra[e.index].horas=24*a.diferenciaEntreDiasEnDias(new Date(a.vehiculo.manosDeObra[e.index].fecha_inicio),new Date(a.vehiculo.manosDeObra[e.index].fecha_fin)),a.ordenTrabajoManoObra={edit:!1}},a.editarServicioExterno=function(e,o){a.servicioExterno=e,a.servicioExterno.fecha_inicio=moment(a.servicioExterno.fecha_inicio).format("MM/DD/YYYY h:mm A"),a.servicioExterno.fecha_fin=moment(a.servicioExterno.fecha_fin).format("MM/DD/YYYY h:mm A"),a.servicioExterno.edit=!0,a.servicioExterno.index=o},a.guardarServicioExternoEditado=function(e){a.nuevoOt.servicioExterno[e.index]=e,a.servicioExterno={edit:!1}},a.obtenerFechasCalendario=function(){promesa=P(a.calendario),promesa.then(function(e){a.FechasCalendario=e,console.log(e)})},a.obtenerFechasCalendarioS=function(e){$("#calendar").fullCalendar("removeEvents"),promesa=P(e),promesa.then(function(e){a.FechasCalendario=e,console.log(e);var o=[];e.forEach(function(e,i,n){var r={id:e.id,title:e.observacion,start:e.fecha_hora_inicio,end:e.fecha_hora_fin};o.push(r),i===n.length-1&&a.cal(o)},this)})},a.EditEventoCalendario=function(){console.log(a.evento),a.calendar.fullCalendar("updateEvent",a.evento),a.cerrarEditarEventoCalendario()},a.DeleteEventoCalendario=function(){a.calendar.fullCalendar("removeEvents",function(e){return e._id==a.evento._id}),a.cerrarEditarEventoCalendario()},a.cal=function(e){a.calendar.fullCalendar("addEventSource",e)},a.GuardarEventoCalendario=function(e){e&&(a.calendar.fullCalendar("renderEvent",a.evento,!0),a.evento={title:null,start:null,end:null,allDay:null,className:"label-info"},a.cerrarEventoCalendario())},a.aplicarCalendario=function(){var e=new Date;e.getDate(),e.getMonth(),e.getFullYear();a.calendar=$("#calendar").fullCalendar({buttonHtml:{prev:'<i class="ace-icon fa fa-chevron-left"></i>',next:'<i class="ace-icon fa fa-chevron-right"></i>'},header:{left:"prev,next today",center:"title",right:"month,agendaWeek,agendaDay"},events:[],editable:!0,droppable:!0,drop:function(e){var o=$(this).data("eventObject"),i=$(this).attr("data-class"),n=$.extend({},o);n.start=e,n.allDay=!1,i&&(n.className=[i]),a.calendar.fullCalendar("renderEvent",n,!0),$("#drop-remove").is(":checked")&&$(this).remove()},selectable:!0,selectHelper:!0,select:function(e,o,i){a.evento={title:"",start:e,end:o,allDay:i,className:"label-info"},a.abrirEventoCalendario(),a.calendar.fullCalendar("unselect")},eventClick:function(e,o,i){a.evento=e,a.abrirEditarEventoCalendario()}})},a.inicio()}]);