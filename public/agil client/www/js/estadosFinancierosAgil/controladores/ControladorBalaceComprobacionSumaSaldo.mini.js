angular.module("agil.controladores").controller("ControladorBalaceComprobacionSumaSaldo",function(o,e,n,r,i,a,c,t,s,u,p,m,f,g,l){o.usuario=JSON.parse(e.usuario),o.inicio=function(){o.obtenerTiposPeriodos(),o.obtenerGestiones(),o.obtenerTiposCuenta(),o.obtenerConfiguracionImpresion(),o.obtenerGestionesImpresion()},o.$on("$viewContentLoaded",function(){resaltarPestaña(n.path().substring(1)),o.buscarAplicacion(o.usuario.aplicacionesUsuario,n.path().substring(1)),c.stop()}),o.obtenerTiposPeriodos=function(){c.start(),s("EEFF_TP").then(function(e){o.TiposPeriodos=e,o.TiposPeriodos.clases.forEach(function(e,n,r){"COMPARATIVO"===e.nombre&&o.TiposPeriodos.clases.splice(n,1)}),c.stop()})},o.obtenerGestiones=function(){c.start(),s("GTN").then(function(e){o.gestiones=e.clases,c.stop()})},o.obtenerConfiguracionImpresion=function(){u(o.usuario.id_empresa).then(function(e){o.configuracionImpresion=e,o.configuracionImpresion.bimonetario=!0,o.configuracionImpresion.tioPeriodo="",o.configuracionImpresion.gestion="",o.configuracionImpresion.gestion_fin="",o.configuracionImpresion.mes="",o.configuracionImpresion.fecha_inicio=null,o.configuracionImpresion.fecha_fin=null,c.stop()})},o.cargarFechasFiltro=function(o){"FECHAS"==o&&setTimeout(function(){aplicarDatePickers()},300)},o.obtenerTiposCuenta=function(){c.start(),s("TCC").then(function(e){o.cuentaTipos=[{id:0,nombre:"PREESTABLECIDO"}],o.cuentaTipos=o.cuentaTipos.concat(e.clases),c.stop()})},o.obtenerGestionesImpresion=function(){c.start(),o.gestionesEF=[],m(o.usuario.id_empresa).then(function(e){c.stop(),e.forEach(function(e){e.habilitado&&(o.fechasImpresion=e)})})},o.generarPdfBalanceComprobacionSS=function(){o.configuracionImpresion.fecha_inicio&&(o.configuracionImpresion.inicio2=new Date(o.convertirFecha(o.configuracionImpresion.fecha_inicio)),o.configuracionImpresion.fin2=new Date(o.convertirFecha(o.configuracionImpresion.fecha_fin))),o.configuracionImpresion.fechasImpresion=o.fechasImpresion,l(o.configuracionImpresion,o.usuario.id_empresa).then(function(e){console.log("los datos para PDF yeeeee ",e);var n=o.configuracionImpresion.bimonetario?400:530;o.generarPdfApropiacion(e,n),c.stop()})},o.generarExelBalanceGeneral=function(){c.start(),o.configuracionImpresion.fecha_inicio&&(o.configuracionImpresion.inicio2=new Date(o.convertirFecha(o.configuracionImpresion.fecha_inicio)),o.configuracionImpresion.fin2=new Date(o.convertirFecha(o.configuracionImpresion.fecha_fin))),o.configuracionImpresion.fechasImpresion=o.fechasImpresion,p(o.configuracionImpresion,o.usuario.id_empresa).then(function(e){e.monedaCambio?o.moneda=e.monedaCambio:o.moneda={ufv:"--",dolar:"--"},e.arregloActivos=[],e.arregloActivosFijos=[],e.arregloPasivos=[],e.arregloPatrimonio=[],e.arregloIngreso=[],e.arregloEgreso=[],e.arregleCostos=[];if("COMPARATIVO"!=o.configuracionImpresion.tipoPeriodo.nombre){e.arregloPasivos=e.arregloPasivos.concat(e.arregloPatrimonio);var n=o.configuracionImpresion.bimonetario?400:530;"PREESTABLECIDO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarExelAPreestablecido(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion):"GENERICA"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarExelAPreestablecido(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion):"GRUPO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarExelGrupo(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion):"SUB GRUPO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarExelSubGrupo(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion):"APROPIACION"==o.configuracionImpresion.tipo_cuenta.nombre&&o.generarExelApropiacion(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion)}else{var r=[],i=[],a=[],t=[],s=[],u=[],p=[];e.primero.cuentasGrupo.forEach(function(o,n,i){var a={};a.primerAno=o,r.push(a),n===i.length-1&&e.segundo.cuentasGrupo.forEach(function(o,e,n){for(var i=0;i<r.length;i++){var a=r[i];a.primerAno.id==o.id&&(a.segundoAno=o)}})}),e.primero.cuentasSubGrupo.forEach(function(o,n,r){var a={};a.primerAno=o,i.push(a),n===r.length-1&&e.segundo.cuentasSubGrupo.forEach(function(o,e,n){for(var r=0;r<i.length;r++){var a=i[r];a.primerAno.id==o.id&&(a.segundoAno=o)}})}),e.primero.cuentasGenericas.forEach(function(o,n,r){var i={};i.primerAno=o,a.push(i),n===r.length-1&&e.segundo.cuentasGenericas.forEach(function(o,e,n){for(var r=0;r<a.length;r++){var i=a[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})}),e.primero.cuentasApropiacion.forEach(function(o,n,r){var i={};i.primerAno=o,t.push(i),n===r.length-1&&e.segundo.cuentasApropiacion.forEach(function(o,e,n){for(var r=0;r<t.length;r++){var i=t[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})}),e.primero.cuentasSubGrupoFijo.forEach(function(o,n,r){var i={};i.primerAno=o,s.push(i),n===r.length-1&&e.segundo.cuentasSubGrupoFijo.forEach(function(o,e,n){for(var r=0;r<s.length;r++){var i=s[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})}),e.primero.cuentasGenericasFijo.forEach(function(o,n,r){var i={};i.primerAno=o,u.push(i),n===r.length-1&&e.segundo.cuentasGenericasFijo.forEach(function(o,e,n){for(var r=0;r<u.length;r++){var i=u[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})}),e.primero.cuentasApropiacionFijo.forEach(function(o,n,r){var i={};i.primerAno=o,p.push(i),n===r.length-1&&e.segundo.cuentasApropiacionFijo.forEach(function(o,e,n){for(var r=0;r<p.length;r++){var i=p[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})});n=o.configuracionImpresion.bimonetario?290:310;"PREESTABLECIDO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarExelComprobantePreestablecido(e,n,r,i,a,t,s,u,p):"GENERICA"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarExelComprobantePreestablecido(e,n,r,i,a,cuentasApropiacioncuentasSubGrupoFijo,u,p):"GRUPO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarExelComparativoGrupo(e,n,r,i,a,cuentasApropiacioncuentasSubGrupoFijo,u,p):"SUB GRUPO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarExelComparativosubGrupo(e,n,r,i,a,cuentasApropiacioncuentasSubGrupoFijo,u,p):"APROPIACION"==o.configuracionImpresion.tipo_cuenta.nombre&&o.generarExelComparativoApropiacion(e,n,r,i,a,cuentasApropiacioncuentasSubGrupoFijo,u,p),c.stop()}})},o.generarWordBalanceGeneral=function(){c.start(),o.configuracionImpresion.fecha_inicio&&(o.configuracionImpresion.inicio2=new Date(o.convertirFecha(o.configuracionImpresion.fecha_inicio)),o.configuracionImpresion.fin2=new Date(o.convertirFecha(o.configuracionImpresion.fecha_fin))),o.configuracionImpresion.fechasImpresion=o.fechasImpresion,p(o.configuracionImpresion,o.usuario.id_empresa).then(function(e){if(e.monedaCambio?o.moneda=e.monedaCambio:o.moneda={ufv:"--",dolar:"--"},"COMPARATIVO"!=o.configuracionImpresion.tipoPeriodo.nombre){var n=o.configuracionImpresion.bimonetario?400:530;"PREESTABLECIDO"==o.configuracionImpresion.tipo_cuenta.nombre?o.descargarArchivo(o.generarWordPreestablecido(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion),"reporte-balance-general.doc"):"GENERICA"==o.configuracionImpresion.tipo_cuenta.nombre?o.descargarArchivo(o.generarWordPreestablecido(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion),"reporte-balance-general.doc"):"GRUPO"==o.configuracionImpresion.tipo_cuenta.nombre?o.descargarArchivo(o.generarWordGrupo(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion),"reporte-balance-general.doc"):"SUB GRUPO"==o.configuracionImpresion.tipo_cuenta.nombre?o.descargarArchivo(o.generarWordSubGrupo(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion),"reporte-balance-general.doc"):"APROPIACION"==o.configuracionImpresion.tipo_cuenta.nombre&&o.descargarArchivo(o.generarWordApropiacion(e,n,e.cuentasGrupo,e.cuentasSubGrupo,e.cuentasGenericas,e.cuentasApropiacion),"reporte-balance-general.doc")}else{var r=[],i=[],a=[],t=[],s=[],u=[],p=[];e.primero.cuentasGrupo.forEach(function(o,n,i){var a={};a.primerAno=o,r.push(a),n===i.length-1&&e.segundo.cuentasGrupo.forEach(function(o,e,n){for(var i=0;i<r.length;i++){var a=r[i];a.primerAno.id==o.id&&(a.segundoAno=o)}})}),e.primero.cuentasSubGrupo.forEach(function(o,n,r){var a={};a.primerAno=o,i.push(a),n===r.length-1&&e.segundo.cuentasSubGrupo.forEach(function(o,e,n){for(var r=0;r<i.length;r++){var a=i[r];a.primerAno.id==o.id&&(a.segundoAno=o)}})}),e.primero.cuentasGenericas.forEach(function(o,n,r){var i={};i.primerAno=o,a.push(i),n===r.length-1&&e.segundo.cuentasGenericas.forEach(function(o,e,n){for(var r=0;r<a.length;r++){var i=a[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})}),e.primero.cuentasApropiacion.forEach(function(o,n,r){var i={};i.primerAno=o,t.push(i),n===r.length-1&&e.segundo.cuentasApropiacion.forEach(function(o,e,n){for(var r=0;r<t.length;r++){var i=t[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})}),e.primero.cuentasSubGrupoFijo.forEach(function(o,n,r){var i={};i.primerAno=o,s.push(i),n===r.length-1&&e.segundo.cuentasSubGrupoFijo.forEach(function(o,e,n){for(var r=0;r<s.length;r++){var i=s[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})}),e.primero.cuentasGenericasFijo.forEach(function(o,n,r){var i={};i.primerAno=o,u.push(i),n===r.length-1&&e.segundo.cuentasGenericasFijo.forEach(function(o,e,n){for(var r=0;r<u.length;r++){var i=u[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})}),e.primero.cuentasApropiacionFijo.forEach(function(o,n,r){var i={};i.primerAno=o,p.push(i),n===r.length-1&&e.segundo.cuentasApropiacionFijo.forEach(function(o,e,n){for(var r=0;r<p.length;r++){var i=p[r];i.primerAno.id==o.id&&(i.segundoAno=o)}})});n=o.configuracionImpresion.bimonetario?290:310;"PREESTABLECIDO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarWordComprobantePreestablecido(e,n,r,i,a,t,s,u,p):"GENERICA"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarWordComprobantePreestablecido(e,n,r,i,a,cuentasApropiacioncuentasSubGrupoFijo,u,p):"GRUPO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarWordComparativoGrupo(e,n,r,i,a,cuentasApropiacioncuentasSubGrupoFijo,u,p):"SUB GRUPO"==o.configuracionImpresion.tipo_cuenta.nombre?o.generarWordComparativosubGrupo(e,n,r,i,a,cuentasApropiacioncuentasSubGrupoFijo,u,p):"APROPIACION"==o.configuracionImpresion.tipo_cuenta.nombre&&o.generarWordComparativoApropiacion(e,n,r,i,a,cuentasApropiacioncuentasSubGrupoFijo,u,p),c.stop()}})},o.generarPdfApropiacion=function(e,n){var r=new PDFDocument({size:"letter",margin:10}),i=r.pipe(blobStream()),a=e.cuentas.length,t=130,s=0,u=o.configuracionImpresion.usar_empesar_numeracion?o.configuracionImpresion.empesar_numeracion:1,p=o.configuracionImpresion.usar_empesar_numeracion?o.configuracionImpresion.empesar_numeracion-1+Math.ceil(a/28):Math.ceil(a/28),m=0;o.dibujarCabeceraPDFBalanceGeneral(r,u,p,"ACTIVO"),r.font("Helvetica",8);for(var f=0;f<e.cuentas.length;f++){if(r.text(e.cuentas[f].cuenta.nombre,60,t),r.text(e.cuentas[f].debe_bs,300,t),r.text(e.cuentas[f].haber_bs,370,t),e.cuentas[f].debe_bs>e.cuentas[f].haber_bs){var g=e.cuentas[f].debe_bs-e.cuentas[f].haber_bs;r.text(g.toFixed(2),440,t)}else{g=e.cuentas[f].haber_bs-e.cuentas[f].debe_bs;r.text(g.toFixed(2),510,t)}r.rect(50,t-7,0,20).stroke(),r.rect(285,t-7,0,20).stroke(),r.rect(50,t-7,235,20).dash(1,{space:10}).stroke(),r.rect(365,t-7,0,20).dash(1,{space:0}).stroke(),r.rect(435,t-7,0,20).stroke(),r.rect(505,t-7,0,20).stroke(),r.rect(570,t-7,0,20).stroke(),20,t+=20,28==(s+=1)&&(r.rect(50,t-7,520,0).stroke(),r.addPage({margin:0,bufferPages:!0}),t=130,0,s=0,u+=1,o.dibujarCabeceraPDFBalanceGeneral(r,u,p,"ACTIVO"),r.font("Helvetica",8)),m+=1,p==u&&e.cuentas.length==m&&r.rect(50,t-7,520,0).stroke()}o.configuracionImpresion.usar_firma_uno&&(r.text(o.configuracionImpresion.firma_uno,170,720),r.text(o.configuracionImpresion.cargo_uno,170,730)),o.configuracionImpresion.usar_firma_dos&&(r.text(o.configuracionImpresion.firma_dos,370,720),r.text(o.configuracionImpresion.cargo_dos,370,730)),r.end(),i.on("finish",function(){var o=i.toBlobURL("application/pdf");window.open(o,"_blank","location=no")}),c.stop()},o.dibujarCabeceraPDFBalanceGeneral=function(e,n,r,i){if(e.font("Helvetica-Bold",8),e.text(o.usuario.empresa.razon_social,40,30,{width:220}),e.text("DE : ",40,40),e.text("NIT : ",40,50),e.text(o.usuario.empresa.direccion,40,60,{width:220}),e.text(o.usuario.empresa.nit,55,50),e.font("Helvetica-Bold",12),e.text("BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS",0,75,{align:"center"}),e.font("Helvetica-Bold",8),"GES"==o.configuracionImpresion.tipoPeriodo.nombre_corto){var a=(new Date).getFullYear(),c=(new Date).getMonth(),t=new Date(a,c-1,0).getDate();o.configuracionImpresion.gestion.nombre<a?e.text("Al 31 de Diciembre de "+o.configuracionImpresion.gestion.nombre,0,85,{align:"center"}):e.text("Al "+t+" de "+o.meses[c].nombre+" de "+o.configuracionImpresion.gestion.nombre,0,85,{align:"center"})}else if("MES"==o.configuracionImpresion.tipoPeriodo.nombre_corto)e.text(o.configuracionImpresion.mes.nombre+" de "+o.configuracionImpresion.gestion.nombre,0,85,{align:"center"});else if("FECHAS"==o.configuracionImpresion.tipoPeriodo.nombre_corto){var s=new Date(o.convertirFecha(o.configuracionImpresion.fecha_inicio)),u=new Date(o.convertirFecha(o.configuracionImpresion.fecha_fin));e.text("Desde el "+s.getDate()+" de "+o.meses[s.getMonth()].nombre+" "+s.getFullYear()+" al "+u.getDate()+" de "+o.meses[u.getMonth()].nombre+" de "+u.getFullYear(),0,85,{align:"center"})}else"COMP"==o.configuracionImpresion.tipoPeriodo.nombre_corto&&e.text("Gestión "+o.configuracionImpresion.gestion.nombre+"- Gestión "+o.configuracionImpresion.gestion_fin.nombre,0,85,{align:"center"});e.text("Expresado en Bolivianos",0,95,{align:"center"}),e.rect(50,103,520,20).stroke(),e.text("DEBE",300,115),e.text("HABER",370,115),e.text("DEUDOR",440,115),e.text("ACREEDOR",510,115),"SAD"==o.configuracionImpresion.tipoNumeracion.nombre_corto?e.text("PÁGINA "+n,540,740):"SAI"==o.configuracionImpresion.tipoNumeracion.nombre_corto?e.text("PÁGINA "+n,0,740,{align:"center"}):"SSD"==o.configuracionImpresion.tipoNumeracion.nombre_corto?e.text("PÁGINA "+n,540,20):"PPD"==o.configuracionImpresion.tipoNumeracion.nombre_corto?e.text("PÁGINA "+n+" DE "+r,520,740):"PPC"==o.configuracionImpresion.tipoNumeracion.nombre_corto?e.text("PÁGINA "+n+" DE "+r,0,740,{align:"center"}):"PPSD"==o.configuracionImpresion.tipoNumeracion.nombre_corto&&e.text("PÁGINA "+n+" DE "+r,520,20),e.font("Helvetica",5),e.text(o.configuracionImpresion.usar_frase_pie_pagina?o.configuracionImpresion.frase_pie_pagina+", ":"",40,740),e.text((o.configuracionImpresion.usar_lugar_emision?o.configuracionImpresion.lugar_emision+", ":"")+(o.configuracionImpresion.usar_fecha_emision?o.fechaATexto(o.configuracionImpresion.fecha_emision):""),40,750)},o.generarExcelBalanceGeneral=function(e){p(o.configuracionImpresion,o.usuario.id_empresa).then(function(e){o.Cuentas=e.cuentas;for(var n=[["","","ESTADO CUENTAS PROVEEDOR"],["Deudor :"+proveedor.razon_social],["Fecha","N Recibo","Descripción","monto","total","total General"]],r=0,i=0;i<proveedor.compras.length;i++){var a=[];r+=proveedor.compras[i].saldo,proveedor.compras[i].fecha=new Date(proveedor.compras[i].fecha),a.push(proveedor.compras[i].fecha.getDate()+"/"+(proveedor.compras[i].fecha.getMonth()+1)+"/"+proveedor.compras[i].fecha.getFullYear()),a.push(proveedor.compras[i].id_movimiento),null==proveedor.compras[i].factura?a.push("PROFORMA"):a.push("factura : "+proveedor.compras[i].factura),a.push(proveedor.compras[i].saldo),a.push(r),a.push(r),n.push(a)}var t="SheetJS",s=new Workbook,u=sheet_from_array_of_arrays(n);s.SheetNames.push(t),s.Sheets[t]=u;var p=XLSX.write(s,{bookType:"xlsx",bookSST:!0,type:"binary"});saveAs(new Blob([s2ab(p)],{type:"application/octet-stream"}),"REPORTE-ESTADO-CUENTA-PROVEEDOR.xlsx"),c.stop()})},o.dibujarCabeceraExelBalanceGeneral=function(){var e="",n="";if("GES"==o.configuracionImpresion.tipoPeriodo.nombre_corto){var r=(new Date).getFullYear(),i=(new Date).getMonth(),a=new Date(r,i-1,0).getDate();e=o.configuracionImpresion.gestion.nombre<r?"Al 31 de Diciembre de "+o.configuracionImpresion.gestion.nombre:"Al "+a+" de "+o.meses[i].nombre+" de "+o.configuracionImpresion.gestion.nombre}else if("MES"==o.configuracionImpresion.tipoPeriodo.nombre_corto)e=o.configuracionImpresion.mes.nombre+" de "+o.configuracionImpresion.gestion.nombre;else if("FECHAS"==o.configuracionImpresion.tipoPeriodo.nombre_corto){var c=new Date(o.convertirFecha(o.configuracionImpresion.fecha_inicio)),t=new Date(o.convertirFecha(o.configuracionImpresion.fecha_fin));e="Desde el "+c.getDate()+" de "+o.meses[c.getMonth()].nombre+" "+c.getFullYear()+" al "+t.getDate()+" de "+o.meses[t.getMonth()].nombre+" de "+t.getFullYear()}else"COMP"==o.configuracionImpresion.tipoPeriodo.nombre_corto&&(e="Gestión "+o.configuracionImpresion.gestion.nombre+"- Gestión "+o.configuracionImpresion.gestion_fin.nombre);if(o.configuracionImpresion.bimonetario){n="Expresado en Bolivianos y Dólares";var s=["GRUPO","SUB GRUPO","GENERICO","APROPIACION","","BOLIVIANOS","","DOLARES"]}else{s=["GRUPO","SUB GRUPO","GENERICO","APROPIACION","","BOLIVIANOS"];n="Expresado en Bolivianos"}return[["","","","BALANCE GENERAL"],["","","",e],["","","",n],s]},o.generarExelApropiacion=function(e,n,r,i,a,t){for(var s=o.dibujarCabeceraExelBalanceGeneral(),u=0;u<i.length;u++){var p=[];if(cuenta=i[u],cuenta.total=0,"Activo"===cuenta.clasificacion.nombre){p.push(""),p.push(cuenta.nombre),s.push(p);for(var m=0;m<a.length;m++){p=[],cuenta3=a[m];var f=String(cuenta3.codigo).substr(0,3);if(cuenta.codigo==f&&t.some(function(o){var e=String(o.codigo).substr(0,5);return cuenta3.codigo==e})){p.push(""),p.push(""),p.push(cuenta3.nombre),s.push(p);for(var g=0;g<t.length;g++){p=[],cuenta2=t[g];f=String(cuenta2.codigo).substr(0,5);if(cuenta3.codigo==f){p.push(""),p.push(""),p.push(""),p.push(cuenta2.nombre),p.push(""),p.push(number_format(cuenta2.saldo,2));var l=cuenta2.saldo/o.moneda.dolar;o.configuracionImpresion.bimonetario&&p.push(""),p.push(number_format(l,2)),cuenta.total+=cuenta2.saldo,cuenta2.saldo,s.push(p)}}}}p=[],i.length}else i.length}o.configuracionImpresion.usar_firma_uno,o.configuracionImpresion.usar_firma_dos;var d="SheetJS",h=new Workbook,b=sheet_from_array_of_arrays(s);h.SheetNames.push(d),h.Sheets[d]=b;var I=XLSX.write(h,{bookType:"xlsx",bookSST:!0,type:"binary"});saveAs(new Blob([s2ab(I)],{type:"application/octet-stream"}),"REPORTE-BALANCE-GENERAL.xlsx"),c.stop()},o.descargarArchivo=function(o,e){var n=new FileReader;n.onload=function(o){var n=document.createElement("a");n.href=o.target.result,n.target="_blank",n.download=e||"archivo.dat";var r=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0});n.dispatchEvent(r),(window.URL||window.webkitURL).revokeObjectURL(n.href)},n.readAsDataURL(o)},o.dibujarCabeceraWordBalanceGeneral=function(){var e="",n="";if("GES"==o.configuracionImpresion.tipoPeriodo.nombre_corto){var r=(new Date).getFullYear(),i=(new Date).getMonth(),a=new Date(r,i-1,0).getDate();e=o.configuracionImpresion.gestion.nombre<r?"Al 31 de Diciembre de "+o.configuracionImpresion.gestion.nombre:"Al "+a+" de "+o.meses[i].nombre+" de "+o.configuracionImpresion.gestion.nombre}else if("MES"==o.configuracionImpresion.tipoPeriodo.nombre_corto)e=o.configuracionImpresion.mes.nombre+" de "+o.configuracionImpresion.gestion.nombre;else if("FECHAS"==o.configuracionImpresion.tipoPeriodo.nombre_corto){var c=new Date(o.convertirFecha(o.configuracionImpresion.fecha_inicio)),t=new Date(o.convertirFecha(o.configuracionImpresion.fecha_fin));e="Desde el "+c.getDate()+" de "+o.meses[c.getMonth()].nombre+" "+c.getFullYear()+" al "+t.getDate()+" de "+o.meses[t.getMonth()].nombre+" de "+t.getFullYear()}else"COMP"==o.configuracionImpresion.tipoPeriodo.nombre_corto&&(e="Gestión "+o.configuracionImpresion.gestion.nombre+"- Gestión "+o.configuracionImpresion.gestion_fin.nombre);if(o.configuracionImpresion.bimonetario){n="Expresado en Bolivianos y Dólares"}else{n="Expresado en Bolivianos"}return"\t\t\t\t\tBALANCE GENERAL\r\n\t\t\t\t\t"+e+"\r\n\t\t\t\t"+n+"\r\n"},o.generarWordApropiacion=function(e,n,r,i,a,t){var s=o.dibujarCabeceraWordBalanceGeneral(),u=[];u.push(s);o.dibujarCabeceraExelBalanceGeneral();for(var p=i.length+a.length+t.length,m=0,f=(o.configuracionImpresion.usar_empesar_numeracion&&o.configuracionImpresion.empesar_numeracion,o.configuracionImpresion.usar_empesar_numeracion?(o.configuracionImpresion.empesar_numeracion,Math.ceil(p/51)):Math.ceil(p/51),0);f<i.length&&m<=51;f++)if(cuenta=i[f],cuenta.total=0,"Activo"===cuenta.clasificacion.nombre){51==m&&(m=0,1,u.push(s)),u.push(cuenta.nombre+"\r\n"),m++;for(var g=0;g<a.length&&m<=51;g++){cuenta3=a[g];var l=String(cuenta3.codigo).substr(0,3);if(cuenta.codigo==l&&t.some(function(o){var e=String(o.codigo).substr(0,5);return cuenta3.codigo==e})){u.push("\t"),u.push(cuenta3.nombre+"\r\n"),51==++m&&(m=0,1,u.push(s));for(var d=0;d<t.length&&m<=51;d++){cuenta2=t[d];l=String(cuenta2.codigo).substr(0,5);if(cuenta3.codigo==l){u.push("\t\t"),cuenta2.nombre.length>22?(text1=String(cuenta2.nombre).substr(0,22),text2=String(cuenta2.nombre).substr(22),u.push(text1),u.push("\n\r\t\t"),m++,u.push(text2),u.push("\t")):(u.push(cuenta2.nombre),u.push("\t")),u.push(number_format(cuenta2.saldo,2));var h=cuenta2.saldo/o.moneda.dolar;o.configuracionImpresion.bimonetario&&u.push("\t\t"+number_format(h,2)),cuenta.total+=cuenta2.saldo,cuenta2.saldo,u.push("\r\n"),51==++m&&(m=0,1,u.push(s))}}}}u.push("\t"),u.push("TOTAL "+cuenta.nombre),u.push("\t\t\t\t"),u.push(number_format(cuenta.total,2));var b=cuenta.total/o.moneda.dolar;o.configuracionImpresion.bimonetario&&u.push("\t\t\t\t"),u.push(number_format(b,2)),i.length}else i.length;return o.configuracionImpresion.usar_firma_uno,o.configuracionImpresion.usar_firma_dos,c.stop(),new Blob(u,{type:"text/plain"})},o.$on("$routeChangeStart",function(o,e){}),o.inicio()});