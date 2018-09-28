angular.module("agil.controladores").controller("ControladorContabilidadCuenta",["$scope","blockUI","$localStorage","$location","$templateCache","$window","CuentasPaginador","ContabilidadCuenta","CuentasClasificaciones","ClasesTipo","lasClasificaciones","losSaldos","losMovimientos","losTiposDeCuentas","lasOperacionesCalculos","CuentaContabilidad","Paginator","CuentasEmpresaCreacion","ClientesNit","ProveedoresNit","$timeout","Tipos","ConfiguracionCuentaEmpresa","ListaContabilidadCuentas","ListaCuentasComprobanteContabilidad","ConfiguracionCuentas","CuentasClasificacionesEdicion","Diccionario","VistaColumnasAplicacion","FieldViewer","ValidarCodigoCuenta","ClaseTexto","ClasesTipoEmpresa",function(a,e,i,n,r,o,t,s,c,l,u,d,p,C,f,g,m,v,b,P,I,E,B,_,T,M,G,h,j,z,A,N,S){a.usuario=JSON.parse(i.usuario),a.idModalWizardCuentaEdicion="modal-wizard-cuenta-edicion",a.idModalWizardContainerCuentaEdicion="modal-wizard-container-cuenta-edicion",a.idModalWizardCuentaVer="modal-wizard-cuenta-ver",a.idModalWizardContainerCuentaVer="modal-wizard-container-cuenta-ver",a.idModalWizardClasificacionNueva="modal-wizard-agregar-clasificacion-cuenta",a.idModalWizardClasificacionVer="modal-wizard-ver-clasificacion",a.idModalWizardContainerClasificacionNueva="modal-wizard-container-agregar-clasificacion",a.idModalEliminarCuenta="dialog-eliminar-cuenta",a.idModalWizardPlantillaIngreso="modal-wizard-plantilla-ingreso",a.idModalWizardConceptoEdicion="modal-wizard-concepto-edicion",a.idModalWizardClasificacionEdicion="modal-wizard-clasificacion-edicion",a.$on("$viewContentLoaded",function(){resaltarPestaña(n.path().substring(1)),ejecutarScriptsContabilidadCuentas(a.idModalWizardCuentaEdicion,a.idModalWizardContainerCuentaEdicion,a.idModalWizardClasificacionNueva,a.idModalWizardContainerClasificacionNueva,a.idModalWizardClasificacionVer,a.idModalWizardCuentaVer,a.idModalWizardContainerCuentaVer,a.idModalEliminarCuenta,a.idModalWizardPlantillaIngreso,a.idModalWizardConceptoEdicion,a.idModalWizardClasificacionEdicion),a.buscarAplicacion(a.usuario.aplicacionesUsuario,n.path().substring(1)),a.obtenerColumnasAplicacion(),e.stop()}),a.inicio=function(){a.obtenerCuentas(),a.obtenerTiposCuenta(),a.obtenerTiposCuentasAuxilires(),a.obtenerClasificacionCuenta(),a.obtenerClasificacionSaldos(),a.obtenerClasificacionTipos(),a.obtenerClasificacionMovimientos(),a.obtenerOperacionesCalculo(),a.obtenerTotalesGeneral(),a.sucursalesUsuario="";for(var e=0;e<a.usuario.sucursalesUsuario.length;e++)a.sucursalesUsuario=a.sucursalesUsuario+a.usuario.sucursalesUsuario[e].sucursal.id,e+1!=a.usuario.sucursalesUsuario.length&&(a.sucursalesUsuario=a.sucursalesUsuario+",")},a.agregarTipoCuenta=function(){e.start(),S("TCC",a.usuario.id_empresa).then(function(i){a.tipo=i,e.stop()}),a.abrirPopup(a.idModalWizardConceptoEdicion)},a.obtenerColumnasAplicacion=function(){a.fieldViewer=z({crear:!0,id_empresa:a.usuario.id_empresa,configuracion:{codigo:{value:"Codigo",show:!0},nombre:{value:"Nombre",show:!0},debe:{value:"Debe",show:!0},haber:{value:"Haber",show:!0},saldo:{value:"Saldo",show:!0},clasificacion:{value:"Clasificacion",show:!0},tipo_cuenta:{value:"Tipo Cuenta",show:!0}}},a.aplicacion.aplicacion.id),a.fieldViewer.updateObject()},a.adicionarTipoCuenta=function(e){e.nombre&&e.nombre_corto&&(e.id||a.tipo.clases.push(e),a.clase={})},a.adicionarClasificacionCuenta=function(e){e.nombre&&e.saldo.id&&e.movimiento.id&&(e.id||a.cuentaClasificaciones.push(e),a.clasificacionEdicion={})},a.modificarClasificacionEdicionCuenta=function(e){a.clasificacionEdicion=e},a.guardarTipoCuenta=function(i,n){i&&(e.start(),E.update({id_tipo:n.id},n,function(i){e.stop(),a.cerrarPopPupTipoCuenta(),a.mostrarMensaje("Guardado Exitosamente!"),a.obtenerTiposCuenta()}))},a.guardarClasificacionCuenta=function(i,n){i&&(e.start(),G.update({id_empresa:a.usuario.id_empresa},n,function(i){e.stop(),a.cerrarPopPupCalsificacionEdicionCuenta(),a.mostrarMensaje("Guardado Exitosamente!"),a.obtenerClasificacionCuenta()}))},a.modificarTipoCuenta=function(e){a.clase=e},a.removerTipoCuenta=function(a){a.eliminado=!0},a.removerClasificacionCuenta=function(a){a.eliminado=!0},a.cerrarPopPupTipoCuenta=function(){a.cerrarPopup(a.idModalWizardConceptoEdicion)},a.cerrarPopPupCalsificacionEdicionCuenta=function(){a.cerrarPopup(a.idModalWizardClasificacionEdicion)},a.guardarPlantillaIngreso=function(e,i){a.visible.verPlantillaIngreso=!0,a.visible.verPlantillaEgreso=!0,a.visible.verPlantillarRetencionBien=!0,a.visible.verPlantillarRetencionBienGasto=!0,i.ingreso.ivadf.cuenta&&i.ingreso.ivadf.cuenta.id?(a.verPlantillaIngreso=!1,a.errorIvadf=null,e.asignarCuentaIvaDf&&(e.asignarCuentaIvaDf.$error.cuenta=!1)):(a.visible.verPlantillaIngreso=!0,a.errorIvadf="sdf",e.asignarCuentaIvaDf&&(e.asignarCuentaIvaDf.$error.cuenta=!1)),i.ingreso.it.cuenta&&i.ingreso.it.cuenta.id?(a.verPlantillaIngreso=!1,a.errorIT=null,e.asignarCuentaIt&&(e.asignarCuentaIt.$error.cuenta=!1)):(a.visible.verPlantillaIngreso=!0,a.errorIT="sdf",e.asignarCuentaIt&&(e.asignarCuentaIt.$error.cuenta=!1)),i.ingreso.itPorPagar.cuenta&&i.ingreso.itPorPagar.cuenta.id?(a.verPlantillaIngreso=!1,a.errorItPorPagar=null,e.asignarCuentaItPorPagar&&(e.asignarCuentaItPorPagar.$error.cuenta=!1)):(a.visible.verPlantillaIngreso=!0,a.errorItPorPagar="sdf",e.asignarCuentaItPorPagar&&(e.asignarCuentaItPorPagar.$error.cuenta=!1)),i.ingreso.cajaBanco.cuenta&&i.ingreso.cajaBanco.cuenta.id?(a.verPlantillaIngreso=!1,a.errorIngresoCaja=null,e.asignarCuentaIngresoCaja&&(e.asignarCuentaIngresoCaja.$error.cuenta=!1)):(a.visible.verPlantillaIngreso=!0,a.errorIngresoCaja="sdf",e.asignarCuentaIngresoCaja&&(e.asignarCuentaIngresoCaja.$error.cuenta=!1)),i.egreso.ivacf.cuenta&&i.egreso.ivacf.cuenta.id?(a.verPlantillaEgreso=!1,a.errorIvacf=null,e.asignarCuentaIvaCf&&(e.asignarCuentaIvaCf.$error.cuenta=!1)):(a.visible.verPlantillaEgreso=!0,a.errorIvacf="sdf",e.asignarCuentaIvaCf&&(e.asignarCuentaIvaCf.$error.cuenta=!1)),i.egreso.cajaBanco.cuenta&&i.egreso.cajaBanco.cuenta.id?(a.verPlantillaEgreso=!1,a.errorEgresoCaja=null,e.asignarCuentaEgresoCaja&&(e.asignarCuentaEgresoCaja.$error.cuenta=!1)):(a.visible.verPlantillaEgreso=!0,a.errorEgresoCaja="sdf",e.asignarCuentaEgresoCaja&&(e.asignarCuentaEgresoCaja.$error.cuenta=!1)),a.usuario.empresa.usar_funciones_erp?(i.retencionBienes.almacen.cuenta&&i.retencionBienes.almacen.cuenta.id?(a.verPlantillarRetencionBien=!1,a.errorEgresoBienAlmacen=null,e.asignarAlmacenBienes&&(e.asignarAlmacenBienes.$error.cuenta=!1)):(a.visible.verPlantillarRetencionBien=!0,a.errorEgresoBienAlmacen="sdf",e.asignarAlmacenBienes&&(e.asignarAlmacenBienes.$error.cuenta=!1)),i.retencionBienes.it.cuenta&&i.retencionBienes.it.cuenta.id?(a.verPlantillarRetencionBien=!1,a.errorEgresoBienIt=null,e.asignarItBienes&&(e.asignarItBienes.$error.cuenta=!1)):(a.visible.verPlantillarRetencionBien=!0,a.errorEgresoBienIt="sdf",e.asignarItBienes&&(e.asignarItBienes.$error.cuenta=!1)),i.retencionBienes.iue.cuenta&&i.retencionBienes.iue.cuenta.id?(a.verPlantillarRetencionBien=!1,a.errorEgresoBienIue=null,e.asignarIueBienes&&(e.asignarIueBienes.$error.cuenta=!1)):(a.visible.verPlantillarRetencionBien=!0,a.errorEgresoBienIue="sdf",e.asignarIueBienes&&(e.asignarIueBienes.$error.cuenta=!1)),i.retencionBienesGasto.gasto.cuenta&&i.retencionBienesGasto.gasto.cuenta.id?(a.verPlantillarRetencionBienGasto=!1,a.errorEgresoBienGasto=null,e.asignarGastoBienes&&(e.asignarGastoBienes.$error.cuenta=!1)):(a.visible.verPlantillarRetencionBienGasto=!0,a.errorEgresoBienGasto="sdf",e.asignarGastoBienes&&(e.asignarGastoBienes.$error.cuenta=!1)),i.retencionBienesGasto.it.cuenta&&i.retencionBienesGasto.it.cuenta.id?(a.verPlantillarRetencionBienGasto=!1,a.errorEgresoBienGastoIt=null,e.asignarGastoItBienes&&(e.asignarGastoItBienes.$error.cuenta=!1)):(a.visible.verPlantillarRetencionBienGasto=!0,a.errorEgresoBienGastoIt="sdf",e.asignarGastoItBienes&&(e.asignarGastoItBienes.$error.cuenta=!1)),i.retencionBienesGasto.iue.cuenta&&i.retencionBienesGasto.iue.cuenta.id?(a.verPlantillarRetencionBienGasto=!1,a.errorEgresoBienGastoIue=null,e.asignarGastoIueBienes&&(e.asignarGastoIueBienes.$error.cuenta=!1)):(a.visible.verPlantillarRetencionBienGasto=!0,a.errorEgresoBienGastoIue="sdf",e.asignarGastoIueBienes&&(e.asignarGastoIueBienes.$error.cuenta=!1))):(a.errorEgresoBienAlmacen=null,a.errorEgresoBienIt=null,a.errorEgresoBienIue=null,a.errorEgresoBienGasto=null,a.errorEgresoBienGastoIt=null,a.errorEgresoBienGastoIue=null),null==a.errorEgresoBienGasto&&null==a.errorEgresoBienGastoIt&&null==a.errorEgresoBienGastoIue&&null==a.errorEgresoBienIue&&null==a.errorEgresoBienIt&&null==a.errorEgresoBienAlmacen&&null==a.errorIvacf&&null==a.errorEgresoCaja&&null==a.errorIvadf&&null==a.errorIT&&null==a.errorItPorPagar&&(i.usar_funciones_erp=a.usuario.empresa.usar_funciones_erp,M.update({id_empresa:a.usuario.id_empresa},i,function(e){a.mostrarMensaje(e.menssage),a.cerrarPlantillaIngreso()}))},a.BoscarOcrearPlantillaIngreso=function(){a.plantilla={retencionServicios:{it:{},iue:{},servicio:{}},retencionBienesGasto:{it:{},iue:{},gasto:{}},retencionBienes:{it:{},iue:{},almacen:{}},egreso:{ivacf:{},cajaBanco:{}},ingreso:{ivadf:{},it:{},itPorPagar:{},cajaBanco:{}}},B(a.usuario.id_empresa).then(function(i){console.log(i.lista),i.lista.forEach(function(e){h.IVA_DF==e.nombre&&(a.plantilla.ingreso.ivadf={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IT==e.nombre&&(a.plantilla.ingreso.it={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IT_POR_PAGAR==e.nombre&&(a.plantilla.ingreso.itPorPagar={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.CAJA_BANCOS==e.nombre&&(a.plantilla.ingreso.cajaBanco={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IVA_CF==e.nombre&&(a.plantilla.egreso.ivacf={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.CAJA_BANCOS==e.nombre&&(a.plantilla.egreso.cajaBanco={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IT_RETENCION_BIEN==e.nombre&&(a.plantilla.retencionBienes.it={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IUE_RETENCION_BIEN==e.nombre&&(a.plantilla.retencionBienes.iue={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.CUENTA_ALMACEN_RETENCION_BIEN==e.nombre&&(a.plantilla.retencionBienes.almacen={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IT_RETENCION_BIEN_GASTO==e.nombre&&(a.plantilla.retencionBienesGasto.it={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IUE_RETENCION_BIEN_GASTO==e.nombre&&(a.plantilla.retencionBienesGasto.iue={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.CUENTA_GASTO_RETENCION_BIEN==e.nombre&&(a.plantilla.retencionBienesGasto.gasto={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IT_RETENCION_SERVICIO==e.nombre&&(a.plantilla.retencionServicios.it={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.IUE_RETENCION_SERVICIO==e.nombre&&(a.plantilla.retencionServicios.iue={porsentaje:parseFloat(e.valor),cuenta:e.cuenta}),h.CUENTA_RETENCION_SERVICIO==e.nombre&&(a.plantilla.retencionServicios.servicio={porsentaje:parseFloat(e.valor),cuenta:e.cuenta})},this),e.stop()})},a.buscarCuentas=function(e){if(""!=e&&void 0!=e){var i=T(a.usuario.id_empresa,e);return console.log(i),i}},a.obtenerConfigCuentas=function(){_(a.usuario.id_empresa).then(function(i){a.ListaCuentas=i,console.log(a.ListaCuentas),e.stop()})},a.updateFiltro=function(e){a.filtro=e},a.abrirPlantillaIngreso=function(){a.visible={},a.visible.verPlantillaIngreso=!0,a.visible.verPlantillaEgreso=!0,a.visible.verPlantillarRetencionBien=!0,a.visible.verPlantillarRetencionBienGasto=!0,a.visible.verPlantillarRetencionServicio=!0,a.BoscarOcrearPlantillaIngreso(),a.obtenerConfigCuentas(),a.abrirPopup(a.idModalWizardPlantillaIngreso)},a.cerrarPlantillaIngreso=function(){a.cerrarPopup(a.idModalWizardPlantillaIngreso)},a.agregarClasificacionCuenta=function(){a.clasificacion=new c({saldo:{},movimiento:{}}),a.abrirPopup(a.idModalWizardClasificacionNueva)},a.modificarClasificacionCuenta=function(e){a.clasificacion=e,a.abrirPopup(a.idModalWizardClasificacionNueva)},a.guardarClasificacion=function(i,n){i&&(a.ocultarMensajesValidacion(),e.start(),n.id?c.update({id:n.id},n,function(i){e.stop(),a.cerrarPopPupAgregarClasificacion(),a.obtenerClasificacionCuenta(),a.mostrarMensaje("Actualizado exitosamente!")}):(n.id_empresa=a.usuario.id_empresa,n.$save(function(i){e.stop(),a.mostrarMensaje("Clasificacion registrada exitosamente!",i),a.cerrarPopPupAgregarClasificacion(),a.obtenerClasificacionCuenta()},function(i){e.stop(),a.mostrarMensaje("Ocurrio un problema al momento de guardar!"),a.obtenerClasificacionCuenta()})))},a.mostrarConfirmacionEliminacion=function(e){a.cuenta=new s({id_empresa:a.usuario.id_empresa,id_usuario:a.usuario.id,tipoCuenta:{},clasificacion:{},eliminado:!1,bimonetaria:!1,aplicar_calculo:!1}),a.cuenta=e,a.abrirPopup(a.idModalEliminarCuenta)},a.cerrarPopPupConfirmacionEliminacion=function(){a.cerrarPopup(a.idModalEliminarCuenta)},a.eliminarCuenta=function(i){i.eliminado=!0,a.cuenta=i,a.cuenta.eliminado=!0,s.update({id:i.id,eliminado:!0},i,function(i){e.stop(),a.cerrarPopPupConfirmacionEliminacion(),a.recargarItemsTabla(),a.mostrarMensaje("Borrado exitosamente!")},function(i){e.stop(),a.mostrarMensaje("Ocurrio un problema al momento de guardar!"),a.recargarItemsTabla()})},a.crearNuevaCuenta=function(){a.cuenta=new s({id_empresa:a.usuario.id_empresa,id_usuario:a.usuario.id,tipoCuenta:{},clasificacion:{},eliminado:!1,bimonetaria:!1,especifica_texto1:"",especifica_texto2:"",especifica_texto3:""});var e=new Date;a.cuenta.fechaTexto=e.getDate()+"/"+(e.getMonth()+1)+"/"+e.getFullYear(),a.abrirPopup(a.idModalWizardCuentaEdicion)},a.optenerCfDf=function(e,i){i?e?(N("CF_TEXTO_1").then(function(e){a.cuenta.especifica_texto1=e.clase}),N("CF_TEXTO_2").then(function(e){a.cuenta.especifica_texto2=e.clase}),N("CF_TEXTO_3").then(function(e){a.cuenta.especifica_texto3=e.clase})):(N("DF_TEXTO_1").then(function(e){a.cuenta.especifica_texto1=e.clase}),N("DF_TEXTO_2").then(function(e){a.cuenta.especifica_texto2=e.clase}),N("DF_TEXTO_3").then(function(e){a.cuenta.especifica_texto3=e.clase})):(a.cuenta.tipo_especifica=!1,a.cuenta.especifica_texto1="",a.cuenta.especifica_texto2="",a.cuenta.especifica_texto3="")},a.modificarCuenta=function(e){a.cuenta=e,e.especifica&&a.optenerCfDf(e.tipo_especifica,e.especifica),a.abrirPopup(a.idModalWizardCuentaEdicion)},a.modificarClasificacionesCuenta=function(){a.abrirPopup(a.idModalWizardClasificacionEdicion)},a.verCuenta=function(e){a.cuenta=e,a.abrirPopup(a.idModalWizardCuentaVer)},a.validarCodigoCuenta=function(e){""!=e&&I(function(){a.validar=new A,a.validar.codigo=e,a.validar.$save(function(e){a.data=e})},1500)},a.guardarCuenta=function(i,n){i&&("Siguiente"!=$("#siguienteCuenta").text().trim()&&(a.ocultarMensajesValidacion(),e.start(),n.id?s.update({id:n.id},n,function(i){e.stop(),a.cerrarPopPupEdicion(),a.recargarItemsTabla(),a.mostrarMensaje("Actualizado exitosamente!")}):n.$save(function(i){e.stop(),a.mostrarMensaje("Cuenta registrada exitosamente!",i),a.cerrarPopPupEdicion(),a.recargarItemsTabla()},function(i){e.stop(),a.mostrarMensaje("Ocurrio un problema al momento de guardar!"),a.recargarItemsTabla()})))},a.obtenerCuentas=function(){a.paginator=m(),a.paginator.column="codigo",a.paginator.callBack=a.obtenerLista,a.filtro={empresa:a.usuario.id_empresa,clasificacion:"",tipo_cuenta:"",monto:""},a.paginator.getSearch("",a.filtro,null)},a.cerrarPopPupCuentaVer=function(){a.cerrarPopup(a.idModalWizardCuentaVer)},a.cerrarPopPupEdicion=function(){a.obtenerCuentas(),a.cerrarPopup(a.idModalWizardCuentaEdicion)},a.cerrarPopPupVerClasificacion=function(){a.cerrarPopup(a.idModalWizardClasificacionVer)},a.cerrarPopPupAgregarClasificacion=function(){a.cerrarPopup(a.idModalWizardClasificacionNueva)},a.obtenerClasificacionCuenta=function(){e.start(),u(a.usuario.id_empresa).then(function(i){a.cuentaClasificaciones=i.clasificaciones,e.stop()})},a.obtenerClasificacionSaldos=function(){e.start(),l("CONTCLSSAL").then(function(i){a.cuentaSaldos=i.clases,e.stop()})},a.obtenerClasificacionTipos=function(){e.start(),l("TIPOS_CLAS_CUENTA").then(function(i){a.tiposClasificaciones=i.clases,e.stop()})},a.obtenerClasificacionMovimientos=function(){e.start(),l("CONTCLSMOV").then(function(i){a.cuentaMovimientos=i.clases,e.stop()})},a.obtenerTiposCuenta=function(){e.start(),S("TCC",a.usuario.id_empresa).then(function(i){a.cuentaTipos=[{id:0,nombre:"TODOS"}],a.cuentaTipos=a.cuentaTipos.concat(i.clases),e.stop()})},a.obtenerTiposCuentasAuxilires=function(){e.start(),l("AUXCU").then(function(i){console.log(i),a.tiposCuentasAuxiliares=i.clases,e.stop()})},a.obtenerOperacionesCalculo=function(){e.start(),l("OPE").then(function(i){a.operacionesCalculo=i.clases,e.stop()})},a.obtenerLista=function(){e.start(),a.sumaTotales={debe:0,haber:0,saldo:0},g(a.paginator).then(function(i){a.paginator.setPages(i.paginas),i.cuentas.forEach(function(e,i,n){a.sumaTotales.debe+=e.debe,a.sumaTotales.haber+=e.haber,a.sumaTotales.saldo+=e.saldo}),e.stop(),a.Cuentas=i.cuentas})},a.obtenerTotalesGeneral=function(){a.sumaTotalesGenerales={debe:0,haber:0,saldo:0};var i={filter:{empresa:a.usuario.id_empresa,clasificacion:0,tipo_cuenta:0,monto:0},currentPage:1,itemsPerPage:0,search:0,column:"codigo",direction:"asc"};g(i).then(function(i){i.cuentas.forEach(function(i,n,r){a.sumaTotalesGenerales.debe+=i.debe,a.sumaTotalesGenerales.haber+=i.haber,a.sumaTotalesGenerales.saldo+=i.saldo,e.stop()})})},a.subirExcelCuentas=function(i){var n,r,o=i.target.files;for(r=o[n=0];n!=o.length;++n){var t=new FileReader;r.name;t.onload=function(i){e.start();var n=i.target.result,r=XLSX.read(n,{type:"binary"}),o=r.SheetNames[0],t=2,s=r.Sheets[o],c=[];do{var l={clasificacion:{},tipoCuenta:{}};l.codigo=void 0!=s["A"+t]&&""!=s["A"+t]?s["A"+t].v.toString():null,l.nombre=void 0!=s["B"+t]&&""!=s["B"+t]?s["B"+t].v.toString():null,l.descripcion=void 0!=s["C"+t]&&""!=s["C"+t]?s["C"+t].v.toString():null,l.clasificacion.nombre=void 0!=s["D"+t]&&""!=s["D"+t]?s["D"+t].v.toString():null,l.tipoCuenta.nombre=void 0!=s["E"+t]&&""!=s["E"+t]?s["E"+t].v.toString():null,l.debe=void 0!=s["F"+t]&&""!=s["F"+t]?parseFloat(s["F"+t].v.toString()):null,l.haber=void 0!=s["G"+t]&&""!=s["G"+t]?parseFloat(s["G"+t].v.toString()):null,l.saldo=void 0!=s["H"+t]&&""!=s["H"+t]?parseFloat(s["H"+t].v.toString()):null,l.bimonetaria=void 0!=s["I"+t]&&""!=s["I"+t]?s["I"+t].v.toString():null,"SI"!=l.bimonetaria?l.bimonetaria=0:l.bimonetaria=1,c.push(l),t++,0}while(void 0!=s["A"+t]);a.guardarCuentas(c),console.log(c),e.stop()},t.readAsBinaryString(r)}},a.guardarCuentas=function(i){new v({cuentas:i,id_empresa:a.usuario.id_empresa}).$save(function(i){e.stop(),a.mostrarMensaje("Guardado Exitosamente!"),a.recargarItemsTabla()},function(i){e.stop(),a.mostrarMensaje("Ocurrio un problema al momento de guardar!"),a.recargarItemsTabla()})},a.establecerCliente=function(e){a.cuenta.cliente=e},a.interceptarTecla=function(e,i,n){13===e.which&&(n?a.enfocar(i):I(function(){$("#"+i).trigger("click")},0))},a.buscarCliente=function(e){if(""!=e&&void 0!=e)return b(a.usuario.id_empresa,e)},a.establecerProveedor=function(e){a.cuenta.proveedor=e},a.buscarProveedor=function(e){if(""!=e&&void 0!=e)return P(a.usuario.id_empresa,e)},a.$on("$routeChangeStart",function(e,i){a.eliminarPopup(a.idModalWizardCuentaEdicion),a.eliminarPopup(a.idModalWizardClasificacionNueva),a.eliminarPopup(a.idModalWizardCuentaVer),a.eliminarPopup(a.idModalEliminarCuenta),a.eliminarPopup(a.idModalWizardPlantillaIngreso),a.eliminarPopup(a.idModalWizardClasificacionEdicion),a.eliminarPopup(a.idModalWizardConceptoEdicion)}),a.inicio()}]);