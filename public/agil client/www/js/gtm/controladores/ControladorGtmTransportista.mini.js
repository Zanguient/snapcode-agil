angular.module("agil.controladores").controller("ControladorGtmTransportista",["$scope","$localStorage","$location","$templateCache","$route","blockUI","Paginator","FieldViewer","GtmTransportista","GtmTransportistas","GtmTransportistaItem","GtmTransportistasEmpresa",function(a,r,t,o,i,n,s,e,d,p,u,c){n.start(),a.usuario=JSON.parse(r.usuario),a.idModalWizardTransportistaEdicion="modal-wizard-transportista-edicion",a.idModalContenedorWizard="modal-wizard-container-transportista-edicion",a.usuario=JSON.parse(r.usuario),a.$on("$viewContentLoaded",function(){resaltarPestaña(t.path().substring(1)),ejecutarScriptTransportista(a.idModalWizardTransportistaEdicion,a.idModalContenedorWizard),a.buscarAplicacion(a.usuario.aplicacionesUsuario,t.path().substring(1))}),a.inicio=function(){a.obtenerTransportistas()},a.obtenerTransportistas=function(){p(a.usuario.id_empresa).then(function(r){a.transportistas=r})},a.crearNuevoTransportista=function(){a.transportista=new d({id_empresa:a.usuario.id_empresa,persona:{}}),a.abrirPopup(a.idModalWizardTransportistaEdicion)},a.cerrarPopPupEdicion=function(){a.cerrarPopup(a.idModalWizardTransportistaEdicion)},a.modificarTransportista=function(r){a.transportista=r,a.abrirPopup(a.idModalWizardTransportistaEdicion)},a.removerTransportista=function(r){r.eliminado=!0,u.update({id_transportista:r.id},r,function(r){a.obtenerTransportistas(),n.stop(),a.mostrarMensaje(r.mensaje)})},a.guardarEstadoTransportista=function(r){u.update({id_transportista:r.id},r,function(r){a.obtenerTransportistas(),n.stop(),a.mostrarMensaje(r.mensaje),a.recargarItemsTabla()})},a.guardarTransportista=function(r){"Siguiente"!=$("#siguiente").text().trim()&&(n.start(),r.id?u.update({id_transportista:r.id},r,function(r){a.obtenerTransportistas(),n.stop(),a.cerrarPopPupEdicion(),a.mostrarMensaje(r.mensaje),a.recargarItemsTabla()}):r.$save(function(r){a.obtenerTransportistas(),n.stop(),a.cerrarPopPupEdicion(),a.mostrarMensaje("Transportista creado satisfactoriamente!"),a.recargarItemsTabla()},function(r){n.stop(),a.cerrarPopPupEdicion(),a.mostrarMensaje("Ocurrio un problema al momento de guardar!")}))},a.subirExcelTransportista=function(r){var t,o,i=r.target.files;for(o=i[t=0];t!=i.length;++t){var s=new FileReader;o.name;s.onload=function(r){n.start();var t=r.target.result,o=XLSX.read(t,{type:"binary"}),i=o.SheetNames[0],s=2,e=o.Sheets[i],d=[];do{var p={};p.codigo=void 0!=e["A"+s]&&""!=e["A"+s]?e["A"+s].v.toString():null,p.costo_transporte=void 0!=e["B"+s]&&""!=e["B"+s]?parseFloat(e["B"+s].v.toString()):null,p.nombre_completo=void 0!=e["C"+s]&&""!=e["C"+s]?e["C"+s].v.toString():null,p.vehiculo=void 0!=e["D"+s]&&""!=e["D"+s]?e["D"+s].v.toString():null,p.capacidad=void 0!=e["E"+s]&&""!=e["E"+s]?parseFloat(e["E"+s].v.toString()):null,p.direccion=void 0!=e["F"+s]&&""!=e["F"+s]?e["F"+s].v.toString():null,p.telefono=void 0!=e["G"+s]&&""!=e["G"+s]?e["G"+s].v.toString():null,p.observacion=void 0!=e["H"+s]&&""!=e["H"+s]?e["H"+s].v.toString():null,p.nit=void 0!=e["I"+s]&&""!=e["I"+s]?parseFloat(e["I"+s].v.toString()):null,d.push(p),s++,0}while(void 0!=e["A"+s]);a.guardarTransportistas(d),n.stop()},s.readAsBinaryString(o)}},a.guardarTransportistas=function(r){c(a.usuario.id_empresa,r).then(function(r){n.stop(),a.mostrarMensaje(r.mensaje),a.recargarItemsTabla()})},a.$on("$routeChangeStart",function(r,t){a.eliminarPopup(a.idModalWizardTransportistaEdicion)}),a.inicio()}]);