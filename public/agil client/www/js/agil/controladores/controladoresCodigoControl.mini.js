angular.module("agil.controladores").controller("ControladorCodigoControl",["$scope","$localStorage","$location","$templateCache","$route","blockUI","CodigoControl",function(e,a,o,r,t,n,i){n.start(),e.usuario=JSON.parse(a.usuario),e.inicio=function(){e.descargarPruebasExcel=restServer+"/downloadReport/PRUEBAS-CODIGO-CONTROL.xlsx"},e.$on("$viewContentLoaded",function(){resaltarPestaña(o.path().substring(1)),e.buscarAplicacion(e.usuario.aplicacionesUsuario,o.path().substring(1)),n.stop()}),e.subirExcelPruebasDosificaciones=function(a){var o,r,t=a.target.files;for(r=t[o=0];o!=t.length;++o){var i=new FileReader;r.name;i.onload=function(a){n.start();var o=a.target.result,r=XLSX.read(o,{type:"binary"}),t=r.SheetNames[0],i=2,l=r.Sheets[t],s=[];do{var u={};u.autorizacion=void 0!=l["B"+i]&&""!=l["B"+i]?l["B"+i].v.toString():null,u.factura=void 0!=l["C"+i]&&""!=l["C"+i]?l["C"+i].v.toString():null,u.nit=void 0!=l["D"+i]&&""!=l["D"+i]?l["D"+i].v.toString():null,u.fecha=void 0!=l["E"+i]&&""!=l["E"+i]?e.formatearFecha(l["E"+i].v.toString()):null,u.monto=void 0!=l["F"+i]&&""!=l["F"+i]?l["F"+i].v.toString():null,u.llave_digital=void 0!=l["G"+i]&&""!=l["G"+i]?l["G"+i].v.toString():null,u.codigo_control_esperado=void 0!=l["H"+i]&&""!=l["H"+i]?l["H"+i].v.toString():null,s.push(u),i++,0}while(void 0!=l["A"+i]);e.generarPruebas(s),n.stop()},i.readAsBinaryString(r)}},e.formatearFecha=function(a){if(3==(r=a.split("/")).length)if(r[0].length>2)var o=r[0]+r[1]+r[2];else o=r[2]+r[1]+r[0];else{var r;o=(r=(a=e.fechaATexto(new Date(e.fecha_excel_angular(a)))).split("/"))[2]+r[1]+r[0]}return o},e.fecha_excel_angular=function(e){var a=new Date(1/1970),o=e-25568;return a.setTime(a.getTime()+864e5*o)},e.generarPruebas=function(a){(a=new i({pruebas:a})).$save(function(a){e.pruebasCodigoControl=a.resultados,e.aplicarTabla("tabla-pruebas-codigo-control",8),n.stop(),e.mostrarMensaje("Pruebas generadas Exitosamente!")},function(a){n.stop(),e.mostrarMensaje("Ocurrio un problema al momento de generar las pruebas!")})},e.inicio()}]);