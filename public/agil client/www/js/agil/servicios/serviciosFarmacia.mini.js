angular.module("agil.servicios").factory("BusquedaPacientesNit",["$resource",function(e){return e(restServer+"pacientes/empresa/:id_empresa/texto/:texto")}]).factory("PacientesNit",["BusquedaPacientesNit","$q",function(e,t){return function(a,o){var n=t.defer();return e.query({id_empresa:a,texto:o},function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise}}]).factory("ImprimirSalidaFarmacia",["Diccionario","ImprimirProformaFarmacia",function(e,t){return function(a,o,n,i){a==e.EGRE_PROFORMA?t(o,n,i):a==e.EGRE_PRE_FACTURACION&&t(o,n,i)}}]).factory("ImprimirIndicacionesFarmacia",[function(){return function(e,t,a,o,n,i){for(var r=0;r<e.sucursal.copias_impresion_pedido;r++){0!=r&&a.addPage({size:[227,n],margins:{top:10,bottom:10,left:20,right:20}}),a.font("Helvetica-Bold",14),a.text("Indicaciones",{align:"center"}),a.font("Helvetica",12),a.moveDown(.4),a.text("Paciente : "+e.farmacia.paciente.persona.nombre_completo,{align:"left"}),a.moveDown(.4),a.text("Empresa : "+e.farmacia.paciente.designacion_empresa,{align:"left"}),a.moveDown(.4),a.moveDown(.2),a.text("---------------------------------------------",{align:"center"}),a.moveDown(.4),a.y,a.fontSize(10);for(var c=0;c<e.detallesVenta.length;c++)e.detallesVenta[c].producto.nombre.length>40&&a.fontSize(9),a.font("Helvetica-Bold",9).text(e.detallesVenta[c].producto.nombre+" ",{continued:!0}),a.font("Helvetica",9).text(e.detallesVenta[c].observaciones),a.moveDown(.2);a.moveDown(4),a.x=0;var m=new Date,s=m.getMinutes();s<10&&(s="0"+s),a.fontSize(7),a.text("  Usuario : "+i.nombre_usuario+" -- Fecha : "+m.getDate()+"/"+(m.getMonth()+1)+"/"+m.getFullYear()+"  "+m.getHours()+":"+s+"  ",{align:"center"})}}}]).factory("ImprimirProformaFarmacia",["Diccionario","ImprimirIndicacionesFarmacia","ImprimirProformaRolloFarmacia","$timeout",function(e,t,a,o){return function(n,i,r){var c,m,s;if(n.configuracion.tamanoPapelNotaVenta.nombre_corto==e.FACT_PAPEL_ROLLO){if(c=[227,n.detallesVenta.length<=2?400:400+20*(n.detallesVenta.length-2)],i&&!n.configuracion.imprimir_al_guardar){if(r.empresa.usar_pedidos){var l=230+20*n.detallesVenta.length;m=new PDFDocument({size:[227,l],margins:{top:10,bottom:10,left:20,right:20}}),s=m.pipe(blobStream()),t(n,i,m,s,l,r)}}else m=new PDFDocument({compress:!1,size:c,margins:{top:0,bottom:0,left:20,right:20}}),s=m.pipe(blobStream()),a(n,c,m,s,r),r.empresa.usar_pedidos&&(l=230+20*n.detallesVenta.length,m.addPage({size:[227,l],margins:{top:10,bottom:10,left:20,right:20}}),t(n,i,m,s,l,r));m&&s&&(m.end(),s.on("finish",function(){var e=s.toBlobURL("application/pdf"),t=window.open(e,"_blank","location=no");o(function(){t.print()},500)}))}}}]).factory("ImprimirProformaRolloFarmacia",["blockUI",function(e){return function(e,t,a,o,n){a.moveDown(1),n.empresa.imagen.length>100&&a.image(n.empresa.imagen,15,a.y,{align:"right",width:80,height:50}),a.y=40,a.moveDown(2),a.font("Helvetica-Bold",8),a.text("ATENCIÓN MÉDICA",70,30,{align:"center"}),a.moveDown(.4),a.font("Helvetica",7),a.text("Nº "+e.farmacia.numero_receta,70,40,{align:"center"}),a.moveDown(.4),a.text(e.fechaTexto,70,50,{align:"center"}),a.moveDown(.4),a.moveDown(.4),a.text("Paciente : "+e.farmacia.paciente.persona.nombre_completo,20,70,{align:"left"}),a.moveDown(.4),a.text("Empresa : "+e.farmacia.paciente.designacion_empresa),a.moveDown(.4),a.text("Campamento : "+e.farmacia.paciente.campo),a.moveDown(.4);for(var i=[],r=0;r<e.farmacia.paciente.empleadosFichas[e.farmacia.paciente.empleadosFichas.length-1].cargos.length;r++)i.push(e.farmacia.paciente.empleadosFichas[e.farmacia.paciente.empleadosFichas.length-1].cargos[r].cargo.nombre);a.text("Cargos : "+i.toString()),a.moveDown(.4),null!==e.farmacia.diagnostico&&void 0!==e.farmacia.diagnostico||(e.farmacia.diagnostico=""),null!==e.farmacia.observaciones&&void 0!==e.farmacia.observaciones||(e.farmacia.observaciones=""),a.text("Diagnostico : "+e.farmacia.diagnostico),a.moveDown(.4),a.text("Observación : "+e.farmacia.observaciones),a.moveDown(.4),a.text("--------------------------------------------------------------------------------",{align:"center"}),a.moveDown(.2),a.text("CANT   Farmaco                                P. UNIT.    SUBTOTAL",{align:"left"}),a.moveDown(.2),a.text("--------------------------------------------------------------------------------",{align:"center"}),a.moveDown(.4);for(var c=a.y,m=0,s=0,l=0,d=0,u=0;u<e.detallesVenta.length;u++)a.text(e.detallesVenta[u].cantidad,20,c),e.detallesVenta[u].producto.nombre.length>40&&a.fontSize(6),a.text(e.detallesVenta[u].producto.nombre,35,c,{width:100}),a.fontSize(7),a.text(e.detallesVenta[u].precio_unitario.toFixed(2),145,c),a.text(e.detallesVenta[u].importe.toFixed(2),180,c),m+=e.detallesVenta[u].tipo_descuento?e.detallesVenta[u].importe*(e.detallesVenta[u].descuento/100):e.detallesVenta[u].descuento,s+=e.detallesVenta[u].tipo_recargo?e.detallesVenta[u].importe*(e.detallesVenta[u].recargo/100):e.detallesVenta[u].recargo,l+=e.detallesVenta[u].ice,d+=e.detallesVenta[u].excento,c+=20;a.text("--------------",10,c,{align:"right"}),a.moveDown(.4),a.text("IMPORTE TOTAL Bs.              "+e.importe.toFixed(2),{align:"right"}),a.moveDown(.3),m>0&&a.text("DESCUENTO Bs.              "+m.toFixed(2),{align:"right"}),a.moveDown(.3),s>0&&a.text("RECARGO Bs.              "+s.toFixed(2),{align:"right"}),a.moveDown(.3),l>0&&a.text("ICE Bs.              "+l.toFixed(2),{align:"right"}),a.moveDown(.3),d>0&&a.text("EXCENTO Bs.              "+d.toFixed(2),{align:"right"}),a.moveDown(.3),a.text("TOTAL Bs.              "+e.total.toFixed(2),{align:"right"}),a.moveDown(.4),a.moveDown(.6),a.moveDown(.4),a.moveDown(.4),a.moveDown(.4),a.moveDown(.4),a.text("------------------------     ----------------          -------------------------",20,a.y,{align:"center"}),a.moveDown(.2),a.text("Médico de turno        Supervisor             Recibí Conforme",{align:"center"}),a.moveDown(.4);var f=new Date,p=f.getMinutes();p<10&&(p="0"+p),a.text("  Usuario : "+n.nombre_usuario+" -- Fecha : "+f.getDate()+"/"+(f.getMonth()+1)+"/"+f.getFullYear()+"  "+f.getHours()+":"+p+"  ",{align:"center"})}}]).factory("VentaFarmaciaFiltro",["$resource",function(e){return e(restServer+"ventas-farmacia/:idsSucursales/inicio/:inicio/fin/:fin/codigo/:codigo/nombreCompleto/:nombreCompleto/ci/:ci/tipo-venta/:tipo_venta/campo/:campo/cargo/:cargo/empresa/:empresa/numero_receta/:numero_receta",null,{update:{method:"PUT"}})}]).factory("VentasFarmacia",["VentaFarmaciaFiltro","$q",function(e,t){return function(a,o,n,i,r,c,m,s,l,d,u){var f=t.defer();return e.query({idsSucursales:a,inicio:o,fin:n,codigo:i,nombreCompleto:r,ci:c,tipo_venta:m,campo:s,cargo:l,empresa:d,numero_receta:u},function(e){f.resolve(e)},function(e){f.reject(e)}),f.promise}}]).factory("VentaFarmacia",["$resource",function(e){return e(restServer+"ventas-farmacia/:id",{id:"@id"},{update:{method:"PUT"}})}]).factory("VentaEmpresaDatosFarmacia",["$resource",function(e){return e(restServer+"ventas-farmacia/:id/empresa/:id_empresa",null,{update:{method:"PUT"}})}]).factory("DatosVentaFarmacia",["VentaEmpresaDatosFarmacia","$q",function(e,t){return function(a,o){var n=t.defer();return e.get({id:a,id_empresa:o},function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise}}]);