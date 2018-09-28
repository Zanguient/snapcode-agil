angular.module("agil.controladores").controller("ControladorBancos",["$scope","$localStorage","$location","$templateCache","$route","blockUI","ClasesTipo","Clases","Banco","ListaBancos","BancoDatos","BancoPaginador","$window",function(a,o,i,n,r,c,e,t,d,s,u,l,p){c.start(),a.idModalWizardBancoEdicion="modal-wizard-banco",a.idModalWizardBancoVista="modal-wizard-banco-vista",a.idModalEliminarBanco="dialog-eliminar-banco",a.idModalContenedorBancoEdicion="modal-wizard-container-banco-edicion",a.idModalContenedorBancoVista="modal-wizard-container-banco-vista",a.usuario=JSON.parse(o.usuario),a.inicio=function(){a.paginadorBancos(a.usuario.id_empresa)},a.$on("$viewContentLoaded",function(){resaltarPestaña(i.path().substring(1)),ejecutarScriptsBanco(a.idModalWizardBancoEdicion,a.idModalContenedorBancoEdicion,a.idModalWizardBancoVista,a.idModalContenedorBancoVista,a.idModalEliminarBanco),a.buscarAplicacion(a.usuario.aplicacionesUsuario,i.path().substring(1));var o=e("TCB");o.then(function(o){a.tiposCuenta=o.clases,c.stop()}),(o=e("TM")).then(function(o){a.tiposMoneda=o.clases,c.stop()})}),a.crearNuevoBanco=function(){a.esNuevo=!0,a.banco=new d({id_empresa:a.usuario.id_empresa}),a.abrirPopup(a.idModalWizardBancoEdicion)},a.cerrarPopPupNuevoBanco=function(){a.cerrarPopup(a.idModalWizardBancoEdicion)},a.verBanco=function(o){a.banco=o,a.abrirPopup(a.idModalWizardBancoVista)},a.cerrarPopPupVista=function(){a.cerrarPopup(a.idModalWizardBancoVista)},a.cerrarPopPupEdicion=function(){a.cerrarPopup(a.idModalWizardBancoEdicion)},a.modificarBanco=function(o){a.banco=o,a.abrirPopup(a.idModalWizardBancoEdicion)},a.mostrarConfirmacionEliminacion=function(o){a.banco=new d(o),a.abrirPopup(a.idModalEliminarBanco)},a.cerrarConfirmacionEliminacion=function(){a.cerrarPopup(a.idModalEliminarBanco)},a.eliminarBanco=function(o){c.start(),a.cerrarConfirmacionEliminacion(),o.$delete(),a.mostrarMensaje("Eliminado exitosamente!"),a.recargarItemsTabla(),c.stop()},a.saveForm=function(o){var i=$("#siguiente").text().trim();console.log(i),"Siguiente"!=i&&(c.start(),o.id?u.update({id_banco:o.id},o,function(o){a.cerrarPopPupNuevoBanco(),a.mostrarMensaje("Actualizado Exitosamente!"),a.recargarItemsTabla()}):o.$save(function(o){c.stop(),a.banco=new d,a.cerrarPopPupNuevoBanco(),a.mostrarMensaje("Guardado Exitosamente!"),a.recargarItemsTabla()},function(o){c.stop(),a.cerrarPopPupNuevoBanco(),a.mostrarMensaje("Ocurrio un problema al momento de guardar!"),a.recargarItemsTabla()}))},a.obtenerBancos=function(o){c.start(),s(o).then(function(o){a.bancos=o,c.stop()})},a.$on("$routeChangeStart",function(o,i){a.eliminarPopup(a.idModalWizardBancoEdicion),a.eliminarPopup(a.idModalWizardBancoVista),a.eliminarPopup(a.idModalEliminarBanco)}),a.paginadorBancos=function(){a.abs=p.Math.abs,a.itemsPorPagina=10,a.buscarBancos(1,a.itemsPorPagina,"")},a.verificarPulso=function(o,i){13===o.keyCode&&a.buscarBancos(1,a.itemsPorPagina,i)},a.buscarBanco=function(o){if(""!=o&&void 0!=o)return l(a.usuario.id_empresa,o)},a.buscarBancos=function(o,i,n){c.start(),a.itemsPorPagina=i,""==n||null==n?n=0:a.textoBusqueda=n,a.paginaActual=o,l(a.usuario.id_empresa,o,i,n).then(function(o){a.paginas=[];for(var i=1;i<=o.paginas;i++)a.paginas.push(i);a.bancos=o.bancos,c.stop()})},a.inicio()}]);