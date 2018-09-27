angular.module("agil.controladores").controller("ControladoresRCIVA",["$scope","$localStorage","$location","$templateCache","$route","blockUI","RecursosHumanosEmpleados","RecursosHumanosEmpleadosHorasExtras","ClasesTipo","Parametros","ObtenerCambioMoneda","RecursosHumanosPlanillaRCIVA","RRHHlistaPlanillaRCIVA","ListaRRHHPlanillaRCIVA",function(a,o,e,l,s,t,i,n,r,u,d,c,m,p){function v(a,o){return Number(Math.round(a+"e"+o)+"e-"+o)}a.$on("$viewContentLoaded",function(){a.idModalNuevoPlanillaRCIVA="dialog-nueva-planilla-rc-iva",a.idModalFormulario110="dialog-formulario-110",a.idModalFormularioGeneral110="dialog-formulario-general-110",a.idModalArchivosTXT="dialog-archivos-txt",a.idModalEditarPlanillaRCIVA="dialog-editar-planilla-rc-iva",ejecutarScriptsPlanillaRCIVA(a.idModalNuevoPlanillaRCIVA,a.idModalFormulario110,a.idModalFormularioGeneral110,a.idModalArchivosTXT,a.idModalEditarPlanillaRCIVA)}),a.$on("$routeChangeStart",function(o,e){a.eliminarPopup(a.idModalNuevoPlanillaRCIVA,a.idModalFormulario110,a.idModalFormularioGeneral110,a.idModalArchivosTXT,a.idModalEditarPlanillaRCIVA)}),a.usuario=JSON.parse(o.usuario),a.fechaATexto=function(a){return fech=new Date(a),a=fech.getDate()+"/"+(fech.getMonth()+1)+"/"+fech.getFullYear()},a.obtenerGestiones=function(){t.start(),r("GTN").then(function(o){a.gestiones=o.clases,t.stop()})},a.obtenerGestiones(),a.obtenerPlanillaRcIva=function(o){console.log("la cabezeraaa ",o),p(a.usuario.id_empresa,o.gestion,o.mes).then(function(o){console.log("la cabezeraaa ",o),a.planillasRcIva=o.planillas,a.sumarTotalesPlanillaRcIva(a.planillasRcIva)})},a.sumarTotalesPlanillaRcIva=function(o){if(a.sumaNetoImponible=0,a.sumaDosSmn=0,a.sumaDiferencia=0,a.sumaRcIva=0,a.sumaDosSmn13=0,a.sumaF110=0,a.sumaRcIvaFisico=0,a.sumaSaldoDependiente=0,a.sumaSaldoAnterior=0,a.sumaActualizacion=0,a.sumaSaldoActualizado=0,a.sumaSaldoTotal=0,a.sumaSaldoUtilizado=0,a.sumaRcIvaMes=0,a.sumaNuevoSaldo=0,void 0!=o)for(var e=0;e<o.length;e++)a.sumaNetoImponible=a.sumaNetoImponible+o[e].neto_imponible,a.sumaDosSmn=a.sumaDosSmn+o[e].dos_smn,a.sumaDiferencia=a.sumaDiferencia+o[e].diferencia,a.sumaRcIva=a.sumaRcIva+o[e].rc_iva,a.sumaDosSmn13=a.sumaDosSmn13+o[e].dos_smn13,a.sumaF110=a.sumaF110+o[e].f110,a.sumaRcIvaFisico=a.sumaRcIvaFisico+o[e].rc_iva_fisico,a.sumaSaldoDependiente=v(a.sumaSaldoDependiente+o[e].saldo_dependiente,2),a.sumaSaldoAnterior=v(a.sumaSaldoAnterior+o[e].saldo_anterior,2),a.sumaActualizacion=v(a.sumaActualizacion+o[e].actualizacion,2),a.sumaSaldoActualizado=v(a.sumaSaldoActualizado+o[e].saldo_actualizado,2),a.sumaSaldoTotal=v(a.sumaSaldoTotal+o[e].saldo_total,2),a.sumaSaldoUtilizado=v(a.sumaSaldoUtilizado+o[e].saldo_utilizado,2),a.sumaRcIvaMes=v(a.sumaRcIvaMes+o[e].rc_iva_mes,2),a.sumaNuevoSaldo=v(a.sumaNuevoSaldo+o[e].nuevo_saldo,2);a.planillaRcIva.sumaNetoImponible=a.sumaNetoImponible,a.planillaRcIva.sumaRcIva=a.sumaRcIva,a.planillaRcIva.sumaDosSmn=a.sumaDosSmn,a.planillaRcIva.sumaDiferencia=a.sumaDiferencia,a.planillaRcIva.sumaDosSmn13=a.sumaDosSmn13,a.planillaRcIva.sumaF110=a.sumaF110,a.planillaRcIva.sumaRcIvaFisico=a.sumaRcIvaFisico,a.planillaRcIva.sumaSaldoDependiente=a.sumaSaldoDependiente,a.planillaRcIva.sumaSaldoAnterior=a.sumaSaldoAnterior,a.planillaRcIva.sumaActualizacion=a.sumaActualizacion,a.planillaRcIva.sumaSaldoActualizado=a.sumaSaldoActualizado,a.planillaRcIva.sumaSaldoTotal=a.sumaSaldoTotal,a.planillaRcIva.sumaSaldoUtilizado=a.sumaSaldoUtilizado,a.planillaRcIva.sumaRcIvaMes=a.sumaRcIvaMes,a.planillaRcIva.sumaNuevoSaldo=a.sumaNuevoSaldo},a.EditarRciva=function(o){console.log("llego a editar ",o),a.planillaEdit=o,a.abrirPopup(a.idModalEditarPlanillaRCIVA)},a.cerrarDialogEditarPlanillaRCIVA=function(){a.cerrarPopup(a.idModalEditarPlanillaRCIVA)},a.nuevaPlanillaRcIva=function(){a.planilla=new c({id_empresa:a.usuario.id_empresa}),a.sumarTotales(a.planilla)},a.abrirDialogNuevoPlanillaRCIVA=function(){a.nuevaPlanillaRcIva(),a.abrirPopup(a.idModalNuevoPlanillaRCIVA)},a.cerrarDialogNuevoPlanillaRCIVA=function(){a.cerrarPopup(a.idModalNuevoPlanillaRCIVA)},a.generarPdfPLanillaRCIVA=function(o){t.start(),p(a.usuario.id_empresa,o.gestion,o.mes).then(function(e){var l=e.planillas,s=new PDFDocument({compress:!1,margin:10,size:"A4",layout:"landscape"}),i=s.pipe(blobStream());a.dibujarCabeceraPDFPlanillaRCIVA(s,a.usuario,o,1),s.font("Helvetica",8);for(var n=150,r=0,u=1,d=0,c=0,m=0,p=0,v=0,f=0,h=0,_=0,I=0,S=0,A=0,R=0,M=0,g=0,F=0,x=0,b=0,D=0,E=0,z=0,N=0,C=0,T=0,H=0,P=0,w=0,V=0,B=0,O=0,U=0;U<l.length&&r<=12;U++)s.rect(40,n-10,760,30).stroke(),s.text(U+1,45,n),s.text(l[U].anio,60,n),s.text(l[U].mes.split("-")[1],90,n),s.text(l[U].neto_imponible,140,n),s.text(l[U].dos_smn,190,n),s.text(l[U].diferencia,230,n),s.text(l[U].rc_iva,283,n),s.text(l[U].dos_smn13,325,n),s.text(l[U].f110,365,n),s.text(l[U].rc_iva_fisico,400,n),s.text(l[U].saldo_dependiente,440,n),s.text(l[U].saldo_anterior,490,n),s.text(l[U].actualizacion,530,n),s.text(l[U].saldo_actualizado,580,n),s.text(l[U].saldo_total,625,n),s.text(l[U].saldo_utilizado,665,n),s.text(l[U].rc_iva_mes,705,n),s.text(l[U].nuevo_saldo,740,n),n+=30,E+=l[U].neto_imponible,b+=l[U].dos_smn,D+=l[U].diferencia,c+=l[U].rc_iva,z+=l[U].dos_smn13,N+=l[U].f110,C+=l[U].rc_iva_fisico,T+=l[U].saldo_dependiente,x+=l[U].saldo_anterior,H+=l[U].actualizacion,P+=l[U].saldo_actualizado,w+=l[U].saldo_total,V+=l[U].saldo_utilizado,B+=l[U].rc_iva_mes,O+=l[U].nuevo_saldo,d+=l[U].neto_imponible,m+=l[U].dos_smn,p+=l[U].diferencia,v+=l[U].dos_smn13,f+=l[U].f110,h+=l[U].rc_iva_fisico,_+=l[U].saldo_dependiente,I+=l[U].saldo_anterior,S+=l[U].actualizacion,A+=l[U].saldo_actualizado,R+=l[U].saldo_total,M+=l[U].saldo_utilizado,g+=l[U].rc_iva_mes,F+=l[U].nuevo_saldo,12!=++r&&U+1!=l.length||(s.font("Helvetica-Bold",8),s.text("SUBTOTALES",75,n),s.text(Math.round(100*E)/100,140,n),s.text(Math.round(100*b)/100,190,n),s.text(Math.round(100*D)/100,230,n),s.text(Math.round(100*c)/100,283,n),s.text(Math.round(100*z)/100,325,n),s.text(Math.round(100*N)/100,365,n),s.text(Math.round(100*C)/100,400,n),s.text(Math.round(100*T)/100,440,n),s.text(Math.round(100*x)/100,490,n),s.text(Math.round(100*H)/100,530,n),s.text(Math.round(100*P)/100,580,n),s.text(Math.round(100*w)/100,625,n),s.text(Math.round(100*V)/100,665,n),s.text(Math.round(100*B)/100,705,n),s.text(Math.round(100*O)/100,740,n),s.rect(40,n-10,760,30).stroke(),s.font("Helvetica",8),U+1==l.length?(s.font("Helvetica-Bold",8),s.text("TOTALES",75,n+30),s.text(Math.round(100*d)/100,140,n+30),s.text(Math.round(100*m)/100,190,n+30),s.text(Math.round(100*p)/100,230,n+30),s.text(Math.round(100*c)/100,283,n+30),s.text(Math.round(100*v)/100,325,n+30),s.text(Math.round(100*f)/100,365,n+30),s.text(Math.round(100*h)/100,400,n+30),s.text(Math.round(100*_)/100,440,n+30),s.text(Math.round(100*I)/100,490,n+30),s.text(Math.round(100*S)/100,530,n+30),s.text(Math.round(100*A)/100,580,n+30),s.text(Math.round(100*R)/100,625,n+30),s.text(Math.round(100*M)/100,665,n+30),s.text(Math.round(100*g)/100,705,n+30),s.text(Math.round(100*F)/100,740,n+30),s.rect(40,n-10+30,760,30).stroke(),s.font("Helvetica",8)):(s.addPage({margin:0,bufferPages:!0,layout:"landscape"}),n=170,r=0,u+=1,a.dibujarCabeceraPDFLibroVentas(s,e,reporte,u),s.font("Helvetica",8)));s.end(),i.on("finish",function(){var a=i.toBlobURL("application/pdf");window.open(a,"_blank","location=no")}),t.stop()})},a.dibujarCabeceraPDFPlanillaRCIVA=function(a,o,e,l){a.font("Helvetica-Bold",12),a.text("PLANILLAS RC-IVA",0,25,{align:"center"}),a.font("Helvetica-Bold",8),a.text("FOLIO "+l,760,25),a.rect(40,60,760,40).stroke(),a.text("PERIÓDO FISCAL : ",65,70),a.text("NOMBRE O RAZÓN SOCIAL : ",65,85),a.text("NIT : ",440,85),a.font("Helvetica",8),a.text("AÑO "+e.gestion,140,70);var s=e.mes.split("-")[1];"TODOS"==e.mes&&(s=e.mes),a.text("MES "+s,200,70),a.text(o.empresa.razon_social,195,85),a.text(o.empresa.nit,460,85),a.rect(40,100,760,40).stroke(),a.font("Helvetica-Bold",8),a.text("Nº",45,110),a.text("Año",60,110,{width:20}),a.text("Mes",90,110,{width:50}),a.text("Neto Imponible",140,110,{width:50}),a.text("2 SMN",190,110,{width:35}),a.text("Diferencia",230,110,{width:50}),a.text("RC-IVA 13%",280,110,{width:35}),a.text("13% de 2 SMN",325,110,{width:35}),a.text("F-110",365,110,{width:35}),a.text("RC-IVA Fisco",400,110,{width:42}),a.text("Saldo Dependiente",440,110,{width:42}),a.text("Saldo Anterior",490,110,{width:40}),a.text("Actualización",530,110,{width:37}),a.text("Saldo Actualizado",580,110,{width:35}),a.text("Saldo Total",625,110,{width:35}),a.text("Saldo Utilizado",665,110,{width:35}),a.text("RC-IVA Mes",705,110,{width:35}),a.text("Saldo Nuevo",740,110)},a.generarExcelPlanillaRcIva=function(o){t.start(),p(a.usuario.id_empresa,o.gestion,o.mes).then(function(a){for(var o=a.planillas,e=[["N°","Año","Mes","Neto Imponible","2 SMN","Diferencia","RC-IVA 13%","13% de 2 SMN","F-110","RC-IVA Fisco","Saldo Dependiente","Saldo Anterior","Actualización","Saldo Actualizado","Saldo Total","Saldo Utilizado","RC-IVA Mes","Saldo Nuevo"]],l=0,s=0,i=0,n=0,r=0,u=0,d=0,c=0,m=0,p=0,v=0,f=0,h=0,_=0,I=0;I<o.length;I++){var S=[];S.push(I+1),S.push(o[I].anio),S.push(o[I].mes.split("-")[1]),S.push(o[I].neto_imponible),S.push(o[I].dos_smn),S.push(o[I].diferencia),S.push(o[I].rc_iva),S.push(o[I].dos_smn13),S.push(o[I].f110),S.push(o[I].rc_iva_fisico),S.push(o[I].saldo_dependiente),S.push(o[I].saldo_anterior),S.push(o[I].actualizacion),S.push(o[I].saldo_actualizado),S.push(o[I].saldo_total),S.push(o[I].saldo_utilizado),S.push(o[I].rc_iva_mes),S.push(o[I].nuevo_saldo),l+=o[I].neto_imponible,s+=o[I].dos_smn,i+=o[I].diferencia,n+=o[I].dos_smn13,r+=o[I].f110,u+=o[I].rc_iva_fisico,d+=o[I].saldo_dependiente,c+=o[I].saldo_anterior,m+=o[I].actualizacion,p+=o[I].saldo_actualizado,v+=o[I].saldo_total,f+=o[I].saldo_utilizado,h+=o[I].rc_iva_mes,_+=o[I].nuevo_saldo,e.push(S),I+1==o.length&&((S=[]).push(""),S.push(""),S.push("TOTALES"),S.push(Math.round(100*l)/100),S.push(Math.round(100*s)/100),S.push(Math.round(100*i)/100),S.push(Math.round(0)/100),S.push(Math.round(100*n)/100),S.push(Math.round(100*r)/100),S.push(Math.round(100*u)/100),S.push(Math.round(100*d)/100),S.push(Math.round(100*c)/100),S.push(Math.round(100*m)/100),S.push(Math.round(100*p)/100),S.push(Math.round(100*v)/100),S.push(Math.round(100*f)/100),S.push(Math.round(100*h)/100),S.push(Math.round(100*_)/100),e.push(S))}var A="SheetJS",R=new Workbook,M=sheet_from_array_of_arrays(e);R.SheetNames.push(A),R.Sheets[A]=M;var g=XLSX.write(R,{bookType:"xlsx",bookSST:!0,type:"binary"});saveAs(new Blob([s2ab(g)],{type:"application/octet-stream"}),"PLANILLA-RCIVA.xlsx"),t.stop()})},a.filtrarSueldos=function(o){console.log("cabezera",o);var e=new Date(o.gestion,parseInt(o.mes)-1,0),l=new Date(o.gestion,parseInt(o.mes),0);console.log("fechaUFVAnterior ===========",e),console.log("fechaUFVActual ===========",l),Promise.all([d(l),d(e),m(a.usuario.id_empresa,o.gestion,o.mes)]).then(function(e){console.log("del mel planillaaaaaaaaaaaasss ",e[2].planillas.length),a.ufvActual=null==e[0].monedaCambio?0:e[0].monedaCambio.ufv,console.log("$scope.ufvActual ==== ",a.ufvActual),a.ufvAnterior=null==e[1].monedaCambio?0:e[1].monedaCambio.ufv;if(0==e[2].planillas.length)if(a.ufvActual>0&&a.ufvAnterior>0){var l=i(a.usuario.id_empresa);l.then(function(e){o.RecursosHumanosEmpleados=e.empleados,o.RecursosHumanosEmpleados.forEach(function(e){(l=n(e.id_ficha,o.gestion,o.mes.split("-")[0],e.id)).then(function(l){var s,t;e.sueldoBasico=e.haber_basico,a.antiguedad=(s=e.fecha_inicio,t=+new Date(s),~~((Date.now()-t)/315576e5)),a.bonoFrontera=0,a.otrosBonos=0,e.horasExtras=l.totalHoras,e.totalHorasExtras=v(e.sueldoBasico/30/8*e.horasExtras*2,2),e.recargoNocturno=v(e.sueldoBasico/30/8*e.horasExtras*1.5,2),e.bonoAntiguedad=a.calcularBonoAntiguedad(a.antiguedad),e.bonoFrontera=a.bonoFrontera,e.otrosBonos=a.otrosBonos,e.totalGanado=e.sueldoBasico+e.totalHorasExtras+e.recargoNocturno+e.bonoAntiguedad+e.bonoFrontera+e.otrosBonos,e.afp=v(12.71*e.totalGanado/100,2),e.montoDeclarado=0,e.muneroFacturas=0,e.ivaCF=0,e.netoImponible=v(e.totalGanado-e.afp,2),e.dos_SMN=2*a.parametros.salario_minimo,e.diferencia=0,e.netoImponible>e.dos_SMN&&(e.diferencia=v(e.netoImponible-e.dos_SMN,2)),e.rcIva13=v(.13*e.diferencia,2),e.dos_SMN13=2*a.parametros.salario_minimo*.13,e.f110=e.ivaCF;var i=e.rcIva13-e.dos_SMN13,n=i-e.f110;e.rcIvaFisco=0,n>=0&&(e.rcIvaFisco=v(n,2)),e.saldoDependiente=n>=0?0:v(e.f110-i,2),null==e.nuevo_saldo&&(e.nuevo_saldo=0),e.saldoAnterior=e.nuevo_saldo,e.actualizacion=v(e.saldoAnterior/a.ufvAnterior*a.ufvActual-e.saldoAnterior,2),e.saldoActualizado=e.saldoAnterior+e.actualizacion,e.saldoTotal=v(e.saldoDependiente+e.saldoActualizado,2);var r=e.rcIvaFisco-e.saldoActualizado;e.saldoUtilizado=r>0?v(e.rcIvaFisco-r,2):e.rcIvaFisco,e.rcIvaMes=0,e.rcIvaFisco>e.saldoTotal&&(e.rcIvaMes=v(e.rcIvaFisco-e.saldoTotal,2)),e.rcIvaMes>0?e.saldoNuevo=0:e.saldoNuevo=e.saldoTotal-e.rcIvaFisco,a.sumarTotales(o)})})})}else a.$apply(function(){a.message="Falta las UFVs para poder crear nuevas planillas",a.mostrarMensaje(a.message)});else a.$apply(function(){a.message="Ya se creo planilla para este periodo '"+o.mes.split("-")[1]+"-"+o.gestion+"'",a.mostrarMensaje(a.message)});t.stop()})},a.calcularRCIVA=function(){var o=13*a.sueldo.montoDeclarado/100;a.valido=!1,o!=a.sueldo.ivaCF&&(a.mensage="ddfsfsdfsdf",a.valido=!0),a.sueldo.f110=a.sueldo.ivaCF;var e=a.sueldo.rcIva13-a.sueldo.dos_SMN13,l=e-a.sueldo.f110;a.sueldo.rcIvaFisco=0,l>=0&&(a.sueldo.rcIvaFisco=v(l,2)),a.sueldo.saldoDependiente=l>=0?0:v(a.sueldo.f110-e,2),a.sueldo.saldoAnterior=10,a.sueldo.actualizacion=v(a.sueldo.saldoAnterior/a.ufvAnterior*a.ufvActual-a.sueldo.saldoAnterior,2),a.sueldo.saldoActualizado=a.sueldo.saldoAnterior+a.sueldo.actualizacion,a.sueldo.saldoTotal=v(a.sueldo.saldoDependiente+a.sueldo.saldoActualizado,2);var s=a.sueldo.rcIvaFisco-a.sueldo.saldoActualizado;a.sueldo.saldoUtilizado=s>0?v(a.sueldo.rcIvaFisco-s,2):a.sueldo.rcIvaFisco,a.sueldo.rcIvaMes=0,a.sueldo.rcIvaFisco>a.sueldo.saldoTotal&&(a.sueldo.rcIvaMes=v(a.sueldo.rcIvaFisco-a.sueldo.saldoTotal,2)),a.sueldo.rcIvaMes>0?a.sueldo.saldoNuevo=0:a.sueldo.saldoNuevo=a.sueldo.saldoTotal-a.sueldo.rcIvaFisco},a.calcularRCIVA2=function(o,e){o.f110=e.ivaCF;var l=o.rcIva13-o.dos_SMN13,s=l-o.f110;o.rcIvaFisco=0,s>=0&&(o.rcIvaFisco=v(s,2)),o.saldoDependiente=s>=0?0:v(o.f110-l,2),o.saldoAnterior=10,o.actualizacion=v(o.saldoAnterior/a.ufvAnterior*a.ufvActual-o.saldoAnterior,2),o.saldoActualizado=o.saldoAnterior+o.actualizacion,o.saldoTotal=v(o.saldoDependiente+o.saldoActualizado,2);var t=o.rcIvaFisco-o.saldoActualizado;o.saldoUtilizado=t>0?v(o.rcIvaFisco-t,2):o.rcIvaFisco,o.rcIvaMes=0,o.rcIvaFisco>o.saldoTotal&&(o.rcIvaMes=v(o.rcIvaFisco-o.saldoTotal,2)),o.rcIvaMes>0?o.saldoNuevo=0:o.saldoNuevo=o.saldoTotal-o.rcIvaFisco},a.sumarTotales=function(o){a.netoImponible=0,a.sumaDos_SMN=0,a.sumaDiferencia=0,a.sumarcIva13=0,a.sumaDos_SMN13=0,a.sumaF110=0,a.sumaRcIvaFisco=0,a.sumaSaldoDependiente=0,a.sumaSaldoAnterior=0,a.sumaActualizacion=0,a.sumaSaldoActualizado=0,a.sumaSaldoTotal=0,a.sumaSaldoUtilizado=0,a.sumaRcIvaMes=0,a.sumaSaldoNuevo=0;var e=0;if(void 0!=o.RecursosHumanosEmpleados)for(var l=0;l<o.RecursosHumanosEmpleados.length;l++)e+=1,a.netoImponible=a.netoImponible+o.RecursosHumanosEmpleados[l].netoImponible,a.sumaDos_SMN=a.sumaDos_SMN+o.RecursosHumanosEmpleados[l].dos_SMN,a.sumaDiferencia=a.sumaDiferencia+o.RecursosHumanosEmpleados[l].diferencia,a.sumarcIva13=a.sumarcIva13+o.RecursosHumanosEmpleados[l].rcIva13,a.sumaDos_SMN13=a.sumaDos_SMN13+o.RecursosHumanosEmpleados[l].dos_SMN13,a.sumaF110=a.sumaF110+o.RecursosHumanosEmpleados[l].f110,a.sumaRcIvaFisco=a.sumaRcIvaFisco+o.RecursosHumanosEmpleados[l].rcIvaFisco,a.sumaSaldoDependiente=v(a.sumaSaldoDependiente+o.RecursosHumanosEmpleados[l].saldoDependiente,2),a.sumaSaldoAnterior=v(a.sumaSaldoAnterior+o.RecursosHumanosEmpleados[l].saldoAnterior,2),a.sumaActualizacion=v(a.sumaActualizacion+o.RecursosHumanosEmpleados[l].actualizacion,2),a.sumaSaldoActualizado=v(a.sumaSaldoActualizado+o.RecursosHumanosEmpleados[l].saldoActualizado,2),a.sumaSaldoTotal=v(a.sumaSaldoTotal+o.RecursosHumanosEmpleados[l].saldoTotal,2),a.sumaSaldoUtilizado=v(a.sumaSaldoUtilizado+o.RecursosHumanosEmpleados[l].saldoUtilizado,2),a.sumaRcIvaMes=v(a.sumaRcIvaMes+o.RecursosHumanosEmpleados[l].rcIvaMes,2),a.sumaSaldoNuevo=v(a.sumaSaldoNuevo+o.RecursosHumanosEmpleados[l].saldoNuevo,2);o.totalEmpleados=e,o.netoImponible=a.netoImponible,o.sumaDos_SMN=a.sumaDos_SMN,o.sumaDiferencia=a.sumaDiferencia,o.sumarcIva13=a.sumarcIva13,o.sumaDos_SMN13=a.sumaDos_SMN13,o.sumaF110=a.sumaF110,o.sumaRcIvaFisco=a.sumaRcIvaFisco,o.sumaSaldoDependiente=a.sumaSaldoDependiente,o.sumaSaldoAnterior=a.sumaSaldoAnterior,o.sumaActualizacion=a.sumaActualizacion,o.sumaSaldoActualizado=a.sumaSaldoActualizado,o.sumaSaldoTotal=a.sumaSaldoTotal,o.sumaSaldoUtilizado=a.sumaSaldoUtilizado,o.sumaRcIvaMes=a.sumaRcIvaMes,o.sumaSaldoNuevo=a.sumaSaldoNuevo},a.obtenerParametros=function(o){t.start(),null==o&&(o=0),u(o).then(function(o){a.parametros=o,t.stop()})},a.calcularBonoAntiguedad=function(o){return o>=0&&o<=2?3*a.parametros.salario_base_antiguedad*a.parametros.antiguedad_cero_dos/100:o>2&&o<=5?3*a.parametros.salario_base_antiguedad*a.parametros.antiguedad_dos_cinco/100:o>5&&o<=8?3*a.parametros.salario_base_antiguedad*a.parametros.antiguedad_cinco_ocho/100:o>8&&o<=11?3*a.parametros.salario_base_antiguedad*a.parametros.antiguedad_ocho_once/100:o>11&&o<=15?3*a.parametros.salario_base_antiguedad*a.parametros.antiguedad_once_quince/100:o>15&&o<=20?3*a.parametros.salario_base_antiguedad*a.parametros.antiguedad_quice_veinte/100:o>20&&o<=25?3*a.parametros.salario_base_antiguedad*a.parametros.antiguedad_veinte_veinticinco/100:o>25?3*a.parametros.salario_base_antiguedad*a.parametros.antiguedad_mas_veinticinco/100:void 0},a.calculoR=function(){a.sueldo.f110=a.sueldo.ivaCF},a.modificarFormulario110=function(o){a.empleado=angular.extend(a.empleado,o),a.sumarTotales(a.planilla),a.cerrarDialogFormulario110(),console.log("el empleadofff ===== ",o)},a.EmpleadosSeleccionados=[],a.checkEmpleado=function(o,e,l){var s=a.EmpleadosSeleccionados.indexOf(e);console.log("idx ===========",s),a.selectAll=!1,s>=0&&!l&&a.EmpleadosSeleccionados.splice(s,1),s<0&&!l&&a.EmpleadosSeleccionados.splice(o,1),s<0&&l&&a.EmpleadosSeleccionados.push(e),console.log("los seleccionadossssss ===== ",a.EmpleadosSeleccionados)},a.checkAll=function(o,e){a.EmpleadosSeleccionados=e?angular.copy(o):[],angular.forEach(o,function(a){a.checked=e})},a.abrirDialogFormulario110=function(o){a.empleado=o,a.sueldo=angular.copy(o),console.log("$scope.sueldo ==== ",a.sueldo),a.abrirPopup(a.idModalFormulario110)},a.generarExcelFormulario110=function(a){var o=[["CODIGO","NOMBRE COMPLETO","MONTO DECLARADO","IVA CF","NUMERO DE FACTURAS"]];if(a)for(var e=0;e<a.RecursosHumanosEmpleados.length;e++){var l=[];l.push(a.RecursosHumanosEmpleados[e].codigo),l.push(a.RecursosHumanosEmpleados[e].nombre_completo),l.push(0),l.push(0),l.push(0),o.push(l)}var s="SheetJS",i=new Workbook,n=sheet_from_array_of_arrays(o);n["!cols"]=[{wch:12},{wch:25},{wch:17},{wch:10},{wch:20}],i.SheetNames.push(s),i.Sheets[s]=n;var r=XLSX.write(i,{bookType:"xlsx",bookSST:!0,type:"binary"});saveAs(new Blob([s2ab(r)],{type:"application/octet-stream"}),"datos_formulario11o.xlsx"),t.stop()},a.subirExcelFormulario110=function(o){var e,l,s=o.target.files;for(l=s[e=0];e!=s.length;++e){var i=new FileReader;l.name;i.onload=function(o){t.start();var e=o.target.result,l=XLSX.read(e,{type:"binary"}),s=l.SheetNames[0],i=2,n=l.Sheets[s];a.selectEdit=function(o){var e=function(o){for(var e=0;e<a.planilla.RecursosHumanosEmpleados.length;e++)if(a.planilla.RecursosHumanosEmpleados[e].codigo==o)return e;return-1}(o.codigo);a.planilla.RecursosHumanosEmpleados[e].ivaCF=o.ivaCF,a.planilla.RecursosHumanosEmpleados[e].montoDeclarado=o.montoDeclarado,a.planilla.RecursosHumanosEmpleados[e].muneroFacturas=o.muneroFacturas,a.calcularRCIVA2(a.planilla.RecursosHumanosEmpleados[e],o)};do{var r={};r.codigo=void 0!=n["A"+i]&&""!=n["A"+i]?n["A"+i].v.toString():null,r.nombre_completo=void 0!=n["B"+i]&&""!=n["B"+i]?n["B"+i].v.toString():null,r.montoDeclarado=void 0!=n["C"+i]&&""!=n["C"+i]?Number(n["C"+i].v):null,r.ivaCF=void 0!=n["D"+i]&&""!=n["D"+i]?Number(n["D"+i].v):null,r.muneroFacturas=void 0!=n["E"+i]&&""!=n["E"+i]?Number(n["E"+i].v):null,a.selectEdit(r),i++,0}while(void 0!=n["A"+i]);a.sumarTotales(a.planilla),a.cerrarDialogFormularioGeneral110(),t.stop()},i.readAsBinaryString(l)}},a.cerrarDialogFormulario110=function(){a.cerrarPopup(a.idModalFormulario110)},a.abrirDialogFormularioGeneral110=function(){a.abrirPopup(a.idModalFormularioGeneral110)},a.modificarFormularioGeneral110=function(o){a.selectEdit=function(o){var e=function(o){for(var e=0;e<a.planilla.RecursosHumanosEmpleados.length;e++)if(a.planilla.RecursosHumanosEmpleados[e].id==o)return e;return-1}(o.id);console.log("index empleado",e),a.planilla.RecursosHumanosEmpleados[e].ivaCF=o.ivaCF,a.planilla.RecursosHumanosEmpleados[e].montoDeclarado=o.montoDeclarado,a.planilla.RecursosHumanosEmpleados[e].muneroFacturas=o.muneroFacturas,a.calcularRCIVA2(a.planilla.RecursosHumanosEmpleados[e],o)},o.forEach(function(o){a.selectEdit(o)}),console.log("empleado generalllllllll ====== ",a.planilla.RecursosHumanosEmpleados),a.sumarTotales(a.planilla),a.cerrarDialogFormularioGeneral110()},a.generar=function(o){o.$save(function(o){a.nuevaPlanillaRcIva(),t.stop(),a.mostrarMensaje("Planilla registrada exitosamente!")},function(a){t.stop(),console.log("fallo ",a)}),console.log("los datos  de planilla rc ivaaa ",o)},a.cerrarDialogFormularioGeneral110=function(){a.cerrarPopup(a.idModalFormularioGeneral110)},a.abrirDialogArchivosTXT=function(){a.abrirPopup(a.idModalArchivosTXT)},a.cerrarDialogArchivosTXT=function(){a.cerrarPopup(a.idModalArchivosTXT)},a.obtenerParametros(a.usuario.id_empresa)}]);