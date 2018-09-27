angular.module("agil.controladores").controller("ControladorEmpresas",["$scope","$localStorage","$location","$templateCache","$route","blockUI","ClasesTipo","Clases","Empresa","Empresas","ListaAplicacionesSistema",function(a,e,i,r,o,n,s,t,p,c,m){n.start(),a.idModalWizardEmpresaEdicion="modal-wizard-empresa",a.idModalWizardEmpresaVista="modal-wizard-empresa-vista",a.idModalEliminarEmpresa="dialog-eliminar-empresa",a.idModalContenedorEmpresaEdicion="modal-wizard-container-empresa-edicion",a.idModalContenedorEmpresaVista="modal-wizard-container-empresa-vista",a.idImagenEmpresa="imagen-empresa",a.usuario=JSON.parse(e.usuario),a.inicio=function(){a.obtenerEmpresas(a.usuario.id_empresa),a.obtenerAplicaciones(),setTimeout(function(){ejecutarScriptsTabla("tabla-empresas",11)},2e3)},a.$on("$viewContentLoaded",function(){resaltarPestaña(i.path().substring(1)),ejecutarScriptsEmpresa(a.idModalWizardEmpresaEdicion,a.idImagenEmpresa,a.idModalContenedorEmpresaEdicion,a.idModalWizardEmpresaVista,a.idModalContenedorEmpresaVista,a.idModalEliminarEmpresa),a.buscarAplicacion(a.usuario.aplicacionesUsuario,i.path().substring(1)),n.stop(),s("DEP").then(function(e){a.departamentos=e.clases})}),a.crearNuevaEmpresa=function(){a.esNuevo=!0,a.empresa=new p({sucursal:{},imagen:"img/icon-user-default.png",aplicaciones:[]}),a.abrirPopup(a.idModalWizardEmpresaEdicion)},a.cerrarPopPupNuevaEmpresa=function(){a.cerrarPopup(a.idModalWizardEmpresaEdicion)},a.verEmpresa=function(e){a.empresa=e,a.abrirPopup(a.idModalWizardEmpresaVista)},a.cerrarPopPupVista=function(){a.cerrarPopup(a.idModalWizardEmpresaVista)},a.cerrarPopPupEdicion=function(){a.cerrarPopup(a.idModalWizardEmpresaEdicion)},a.modificarEmpresa=function(e){e.aplicaciones=[],a.esNuevo=!1,a.empresa=e,e.departamento&&a.buscarMunicipios(e.id_departamento+"-"+e.departamento.nombre_corto),a.seleccionarAplicaciones(e.aplicacionesEmpresa),a.abrirPopup(a.idModalWizardEmpresaEdicion)},a.mostrarConfirmacionEliminacion=function(e){a.empresa=new p(e),a.abrirPopup(a.idModalEliminarEmpresa)},a.cerrarConfirmacionEliminacion=function(){a.cerrarPopup(a.idModalEliminarEmpresa)},a.eliminarEmpresa=function(e){n.start(),a.cerrarConfirmacionEliminacion(),e.$delete(),a.mostrarMensaje("Eliminado exitosamente!"),a.recargarItemsTabla(),n.stop()},a.buscarMunicipios=function(e){var i=e.split("-")[1];t(i+"M").then(function(e){a.municipios=e})},a.saveForm=function(e){var i=$("#siguiente").text().trim();if(console.log(i),"Siguiente"!=i){n.start();var r=e.imagen;"string"==typeof e.id_departamento&&(e.id_departamento=e.id_departamento.split("-")[0]),a.esNuevo&&"string"==typeof e.sucursal.id_departamento&&(e.sucursal.id_departamento=e.sucursal.id_departamento.split("-")[0]),e.id?p.update({idEmpresa:e.id},e,function(e){if(null==e.signedRequest)n.stop(),a.cerrarPopPupNuevaEmpresa(),a.mostrarMensaje("Actualizado Exitosamente!"),a.recargarItemsTabla();else{var i=new XMLHttpRequest;i.open("PUT",e.signedRequest),i.onreadystatechange=function(){4===i.readyState&&(200===i.status?(n.stop(),a.cerrarPopPupNuevaEmpresa(),a.mostrarMensaje("Actualizado Exitosamente!"),a.recargarItemsTabla()):alert("Could not upload file."))};for(var o=atob(r.split(",")[1]),s=[],t=0;t<o.length;t++)s.push(o.charCodeAt(t));var p=new Blob([new Uint8Array(s)],{type:"image/jpeg"}),c=new File([p],e.image_name,{type:"image/jpeg"});console.log(c),i.send(c)}}):e.$save(function(e){if(null==e.signedRequest)n.stop(),a.empresa=new p({sucursal:{},imagen:"img/icon-user-default.png"}),a.cerrarPopPupNuevaEmpresa(),a.mostrarMensaje("Guardado Exitosamente!"),a.recargarItemsTabla();else{var i=new XMLHttpRequest;i.open("PUT",e.signedRequest),i.onreadystatechange=function(){4===i.readyState&&(200===i.status?(n.stop(),a.empresa=new p({sucursal:{},imagen:"img/icon-user-default.png"}),a.cerrarPopPupNuevaEmpresa(),a.mostrarMensaje("Guardado Exitosamente!"),a.recargarItemsTabla()):alert("Could not upload file."))};for(var o=atob(r.split(",")[1]),s=[],t=0;t<o.length;t++)s.push(o.charCodeAt(t));var c=new Blob([new Uint8Array(s)],{type:"image/jpeg"}),m=new File([c],e.image_name,{type:"image/jpeg"});i.send(m)}},function(e){n.stop(),a.cerrarPopPupNuevaEmpresa(),a.mostrarMensaje("Ocurrio un problema al momento de guardar!"),a.recargarItemsTabla()})}},a.obtenerEmpresas=function(e){n.start(),null==e&&(e=0),c(e).then(function(e){a.empresas=e,n.stop()})},a.obtenerAplicaciones=function(){var e="";if(a.usuario.empresa)e=a.usuario.empresa.aplicacionesEmpresa.map(function(a){return a.id_aplicacion}).join(",");m(e).then(function(e){a.llenarAplicaciones(e)})},a.llenarAplicaciones=function(e){a.aplicacionesSistema=[];for(var i=0;i<e.length;i++){var r={name:e[i].titulo,maker:"",ticked:!1,id:e[i].id};a.aplicacionesSistema.push(r)}},a.seleccionarAplicaciones=function(e){for(var i=0;i<a.aplicacionesSistema.length;i++)for(var r=0;r<e.length;r++)a.aplicacionesSistema[i].id==e[r].id_aplicacion&&(a.aplicacionesSistema[i].ticked=!0)},a.$on("$routeChangeStart",function(e,i){a.eliminarPopup(a.idModalWizardEmpresaEdicion),a.eliminarPopup(a.idModalWizardEmpresaVista),a.eliminarPopup(a.idModalEliminarEmpresa)}),a.inicio()}]);