angular.module('agil.controladores')

.controller('ControladoresRCIVA', ['$scope','$localStorage','$location','$templateCache','$route','blockUI', 'RecursosHumanosEmpleados', 'RecursosHumanosEmpleadosHorasExtras', 'ClasesTipo',
    'Parametros', 'ObtenerCambioMoneda', 'RecursosHumanosPlanillaRCIVA', 'RRHHlistaPlanillaRCIVA', 'ListaRRHHPlanillaRCIVA',function($scope,$localStorage,$location,$templateCache,$route,blockUI, RecursosHumanosEmpleados, RecursosHumanosEmpleadosHorasExtras, ClasesTipo,
    Parametros, ObtenerCambioMoneda, RecursosHumanosPlanillaRCIVA, RRHHlistaPlanillaRCIVA, ListaRRHHPlanillaRCIVA){
	$scope.$on('$viewContentLoaded', function () {
        
        $scope.idModalNuevoPlanillaRCIVA = 'dialog-nueva-planilla-rc-iva';
        $scope.idModalFormulario110 = 'dialog-formulario-110';
        $scope.idModalFormularioGeneral110 = 'dialog-formulario-general-110';
        $scope.idModalArchivosTXT = 'dialog-archivos-txt';
        $scope.idModalEditarPlanillaRCIVA = 'dialog-editar-planilla-rc-iva';
        
        ejecutarScriptsPlanillaRCIVA($scope.idModalNuevoPlanillaRCIVA, $scope.idModalFormulario110, $scope.idModalFormularioGeneral110, 
            $scope.idModalArchivosTXT, $scope.idModalEditarPlanillaRCIVA);
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalNuevoPlanillaRCIVA, $scope.idModalFormulario110,$scope.idModalFormularioGeneral110, 
            $scope.idModalArchivosTXT, $scope.idModalEditarPlanillaRCIVA);
    });

    $scope.usuario=JSON.parse($localStorage.usuario);

    $scope.fechaATexto = function (fecha) {
        fech = new Date(fecha)
        fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
        return fecha
    }

    $scope.obtenerGestiones=function(){
        blockUI.start();
        var promesa=ClasesTipo("GTN");
        promesa.then(function(entidad){
            $scope.gestiones=entidad.clases;
            blockUI.stop();
        });
    }

    $scope.obtenerGestiones();

    $scope.obtenerPlanillaRcIva=function(planillaRcIva) {
        console.log("la cabezeraaa ", planillaRcIva);
        var promRcIva=ListaRRHHPlanillaRCIVA($scope.usuario.id_empresa, planillaRcIva.gestion, planillaRcIva.mes);
        promRcIva.then(function(planillaR){
            console.log("la cabezeraaa ", planillaR);
       
            $scope.planillasRcIva=planillaR.planillas;
            $scope.sumarTotalesPlanillaRcIva($scope.planillasRcIva);
          
        });
    }

    $scope.sumarTotalesPlanillaRcIva=function(planilla){
        $scope.sumaNetoImponible = 0;
        $scope.sumaDosSmn = 0;
        $scope.sumaDiferencia = 0;
        $scope.sumaRcIva = 0; 
        $scope.sumaDosSmn13 = 0;
        $scope.sumaF110 = 0;
        $scope.sumaRcIvaFisico = 0;
        $scope.sumaSaldoDependiente = 0; 
        $scope.sumaSaldoAnterior = 0;
        $scope.sumaActualizacion = 0; 
        $scope.sumaSaldoActualizado = 0; 
        $scope.sumaSaldoTotal = 0;
        $scope.sumaSaldoUtilizado = 0; 
        $scope.sumaRcIvaMes = 0;
        $scope.sumaNuevoSaldo = 0; 

        if (planilla != undefined) {
            for(var i=0;i<planilla.length;i++){
                $scope.sumaNetoImponible=$scope.sumaNetoImponible+planilla[i].neto_imponible;
                $scope.sumaDosSmn=$scope.sumaDosSmn+planilla[i].dos_smn;
                $scope.sumaDiferencia=$scope.sumaDiferencia+planilla[i].diferencia;
                $scope.sumaRcIva=$scope.sumaRcIva+planilla[i].rc_iva;
                $scope.sumaDosSmn13=$scope.sumaDosSmn13+planilla[i].dos_smn13;
                $scope.sumaF110=$scope.sumaF110+planilla[i].f110;
                $scope.sumaRcIvaFisico=$scope.sumaRcIvaFisico+planilla[i].rc_iva_fisico;
                $scope.sumaSaldoDependiente=round($scope.sumaSaldoDependiente+planilla[i].saldo_dependiente, 2);
                $scope.sumaSaldoAnterior=round($scope.sumaSaldoAnterior+planilla[i].saldo_anterior, 2);
                $scope.sumaActualizacion=round($scope.sumaActualizacion+planilla[i].actualizacion, 2);
                
                $scope.sumaSaldoActualizado=round($scope.sumaSaldoActualizado+planilla[i].saldo_actualizado, 2);
                $scope.sumaSaldoTotal=round($scope.sumaSaldoTotal+planilla[i].saldo_total, 2);
                $scope.sumaSaldoUtilizado=round($scope.sumaSaldoUtilizado+planilla[i].saldo_utilizado, 2);
                $scope.sumaRcIvaMes=round($scope.sumaRcIvaMes+planilla[i].rc_iva_mes, 2);
                $scope.sumaNuevoSaldo=round($scope.sumaNuevoSaldo+planilla[i].nuevo_saldo, 2);
            }
        }

        $scope.planillaRcIva.sumaNetoImponible = $scope.sumaNetoImponible;
        $scope.planillaRcIva.sumaRcIva = $scope.sumaRcIva;
        $scope.planillaRcIva.sumaDosSmn = $scope.sumaDosSmn;
        $scope.planillaRcIva.sumaDiferencia = $scope.sumaDiferencia; 
        $scope.planillaRcIva.sumaDosSmn13 = $scope.sumaDosSmn13;
        $scope.planillaRcIva.sumaF110 = $scope.sumaF110;
        $scope.planillaRcIva.sumaRcIvaFisico = $scope.sumaRcIvaFisico;
        $scope.planillaRcIva.sumaSaldoDependiente = $scope.sumaSaldoDependiente; 
        $scope.planillaRcIva.sumaSaldoAnterior = $scope.sumaSaldoAnterior;
        $scope.planillaRcIva.sumaActualizacion = $scope.sumaActualizacion; 
        $scope.planillaRcIva.sumaSaldoActualizado = $scope.sumaSaldoActualizado; 
        $scope.planillaRcIva.sumaSaldoTotal = $scope.sumaSaldoTotal;
        $scope.planillaRcIva.sumaSaldoUtilizado = $scope.sumaSaldoUtilizado; 
        $scope.planillaRcIva.sumaRcIvaMes = $scope.sumaRcIvaMes;
        $scope.planillaRcIva.sumaNuevoSaldo = $scope.sumaNuevoSaldo;
        
    }

//  ==== para editar planilla =====================================
    $scope.EditarRciva=function(planilla){
        console.log("llego a editar ", planilla);
        $scope.planillaEdit = planilla;
        $scope.abrirPopup($scope.idModalEditarPlanillaRCIVA);
    }

    $scope.cerrarDialogEditarPlanillaRCIVA=function() {
        $scope.cerrarPopup($scope.idModalEditarPlanillaRCIVA);
    }

    $scope.nuevaPlanillaRcIva = function () {
        $scope.planilla=new RecursosHumanosPlanillaRCIVA({id_empresa:$scope.usuario.id_empresa});
        $scope.sumarTotales($scope.planilla);
    }


    $scope.abrirDialogNuevoPlanillaRCIVA= function () {
        $scope.nuevaPlanillaRcIva();
        $scope.abrirPopup($scope.idModalNuevoPlanillaRCIVA);
    }
    $scope.cerrarDialogNuevoPlanillaRCIVA=function () {
        $scope.cerrarPopup($scope.idModalNuevoPlanillaRCIVA); 
    }

    $scope.generarPdfPLanillaRCIVA = function (planillaRcIva) {
            blockUI.start();
            var promesa = ListaRRHHPlanillaRCIVA($scope.usuario.id_empresa, planillaRcIva.gestion, planillaRcIva.mes);
            promesa.then(function (datos) {
                var DetalleplanillaRcIva = datos.planillas
                var doc = new PDFDocument({ compress: false, margin: 10, size: 'A4', layout: 'landscape' });
                var stream = doc.pipe(blobStream());
                // draw some text
                $scope.dibujarCabeceraPDFPlanillaRCIVA(doc, $scope.usuario, planillaRcIva, 1);
                doc.font('Helvetica', 8);
                var y = 150, itemsPorPagina = 12, items = 0, pagina = 1;
                var sumaNetoImponible = 0, sumaSubRcIva = 0, sumaDosSmn = 0, sumaDiferencia = 0, sumaDosSmn13 = 0, sumaF110 = 0, sumaRcIvaFisico = 0, sumaSaldoDependiente = 0;
                var sumaSaldoAnterior = 0, sumaActualizacion = 0, sumaSaldoActualizado = 0, sumaSaldoTotal = 0, sumaSaldoUtilizado = 0, sumaRcIvaMes = 0, sumaNuevoSaldo = 0;
                var sumaSubSaldoAnterior = 0, sumaSubdos_smn = 0, sumaSubDiferencia = 0, sumaSubNetoImponible = 0, sumaSubDos_smn13 = 0, sumaSubF110 = 0, sumaSubRcIvaFisico = 0, sumaSubSaldoDependiente = 0;
                var sumaSubActualizacion = 0, sumaSubSaldoActualizado = 0, sumaSubSaldoTotal = 0, sumaSubSaldoUtilizado = 0, sumaSubRcIvaMes = 0, sumaSubNuevoSaldo = 0;
                for (var i = 0; i < DetalleplanillaRcIva.length && items <= itemsPorPagina; i++) {
                    doc.rect(40, y - 10, 760, 30).stroke();
                    doc.text(i + 1, 45, y);
                    doc.text(DetalleplanillaRcIva[i].anio, 60, y);
                    doc.text(DetalleplanillaRcIva[i].mes.split("-")[1], 90, y);
                    doc.text(DetalleplanillaRcIva[i].neto_imponible, 140, y);
                    doc.text((DetalleplanillaRcIva[i].dos_smn), 190, y);
                    doc.text(DetalleplanillaRcIva[i].diferencia, 230, y);
                    doc.text(DetalleplanillaRcIva[i].rc_iva, 283, y);
                    doc.text(DetalleplanillaRcIva[i].dos_smn13, 325, y);
                    doc.text(DetalleplanillaRcIva[i].f110, 365, y);
                    doc.text(DetalleplanillaRcIva[i].rc_iva_fisico, 400, y);
                    doc.text(DetalleplanillaRcIva[i].saldo_dependiente, 440, y);
                    doc.text(DetalleplanillaRcIva[i].saldo_anterior, 490, y);
                    doc.text(DetalleplanillaRcIva[i].actualizacion, 530, y);
                    doc.text(DetalleplanillaRcIva[i].saldo_actualizado, 580, y);
                    doc.text(DetalleplanillaRcIva[i].saldo_total, 625, y);
                    doc.text(DetalleplanillaRcIva[i].saldo_utilizado, 665, y);
                    doc.text(DetalleplanillaRcIva[i].rc_iva_mes, 705, y);
                    doc.text(DetalleplanillaRcIva[i].nuevo_saldo, 740, y);
                    y = y + 30;
                    sumaSubNetoImponible = sumaSubNetoImponible + DetalleplanillaRcIva[i].neto_imponible;
                    sumaSubdos_smn = sumaSubdos_smn + DetalleplanillaRcIva[i].dos_smn;
                    sumaSubDiferencia = sumaSubDiferencia + DetalleplanillaRcIva[i].diferencia;
                    sumaSubRcIva = sumaSubRcIva + DetalleplanillaRcIva[i].rc_iva;
                    sumaSubDos_smn13 = sumaSubDos_smn13 + DetalleplanillaRcIva[i].dos_smn13;
                    sumaSubF110 = sumaSubF110 + DetalleplanillaRcIva[i].f110;
                    sumaSubRcIvaFisico = sumaSubRcIvaFisico + DetalleplanillaRcIva[i].rc_iva_fisico;
                    sumaSubSaldoDependiente = sumaSubSaldoDependiente + DetalleplanillaRcIva[i].saldo_dependiente;
                    sumaSubSaldoAnterior = sumaSubSaldoAnterior + DetalleplanillaRcIva[i].saldo_anterior;
                    sumaSubActualizacion = sumaSubActualizacion + DetalleplanillaRcIva[i].actualizacion;
                    sumaSubSaldoActualizado = sumaSubSaldoActualizado + DetalleplanillaRcIva[i].saldo_actualizado;
                    sumaSubSaldoTotal = sumaSubSaldoTotal + DetalleplanillaRcIva[i].saldo_total;
                    sumaSubSaldoUtilizado = sumaSubSaldoUtilizado + DetalleplanillaRcIva[i].saldo_utilizado;
                    sumaSubRcIvaMes = sumaSubRcIvaMes + DetalleplanillaRcIva[i].rc_iva_mes;
                    sumaSubNuevoSaldo = sumaSubNuevoSaldo + DetalleplanillaRcIva[i].nuevo_saldo;

                    sumaNetoImponible = sumaNetoImponible + DetalleplanillaRcIva[i].neto_imponible;
                    sumaDosSmn = sumaDosSmn + DetalleplanillaRcIva[i].dos_smn;
                    sumaDiferencia = sumaDiferencia + DetalleplanillaRcIva[i].diferencia;
                    sumaDosSmn13 = sumaDosSmn13 + DetalleplanillaRcIva[i].dos_smn13;
                    sumaF110 = sumaF110 + DetalleplanillaRcIva[i].f110;
                    sumaRcIvaFisico = sumaRcIvaFisico + DetalleplanillaRcIva[i].rc_iva_fisico;
                    sumaSaldoDependiente = sumaSaldoDependiente + DetalleplanillaRcIva[i].saldo_dependiente;
                    sumaSaldoAnterior = sumaSaldoAnterior + DetalleplanillaRcIva[i].saldo_anterior;
                    sumaActualizacion = sumaActualizacion + DetalleplanillaRcIva[i].actualizacion;
                    sumaSaldoActualizado = sumaSaldoActualizado + DetalleplanillaRcIva[i].saldo_actualizado;
                    sumaSaldoTotal = sumaSaldoTotal + DetalleplanillaRcIva[i].saldo_total;
                    sumaSaldoUtilizado = sumaSaldoUtilizado + DetalleplanillaRcIva[i].saldo_utilizado;
                    sumaRcIvaMes = sumaRcIvaMes + DetalleplanillaRcIva[i].rc_iva_mes;
                    sumaNuevoSaldo = sumaNuevoSaldo + DetalleplanillaRcIva[i].nuevo_saldo;
          
                    items++;

                    if (items == itemsPorPagina || i + 1 == DetalleplanillaRcIva.length) {
                        doc.font('Helvetica-Bold', 8);
                        doc.text("SUBTOTALES", 75, y);
                        doc.text(Math.round((sumaSubNetoImponible) * 100) / 100, 140, y);
                        doc.text(Math.round((sumaSubdos_smn) * 100) / 100, 190, y);
                        doc.text(Math.round((sumaSubDiferencia) * 100) / 100, 230, y);
                        doc.text(Math.round((sumaSubRcIva) * 100) / 100, 283, y);
                        doc.text(Math.round((sumaSubDos_smn13) * 100) / 100, 325, y);
                        doc.text(Math.round((sumaSubF110) * 100) / 100, 365, y);
                        doc.text(Math.round((sumaSubRcIvaFisico) * 100) / 100, 400, y);
                        doc.text(Math.round((sumaSubSaldoDependiente) * 100) / 100, 440, y);
                        doc.text(Math.round((sumaSubSaldoAnterior) * 100) / 100, 490, y);
                        doc.text(Math.round((sumaSubActualizacion) * 100) / 100, 530, y);
                        doc.text(Math.round((sumaSubSaldoActualizado) * 100) / 100, 580, y);
                        doc.text(Math.round((sumaSubSaldoTotal) * 100) / 100, 625, y);
                        doc.text(Math.round((sumaSubSaldoUtilizado) * 100) / 100, 665, y);
                        doc.text(Math.round((sumaSubRcIvaMes) * 100) / 100, 705, y);
                        doc.text(Math.round((sumaSubNuevoSaldo) * 100) / 100, 740, y);
                        doc.rect(40, y - 10, 760, 30).stroke();
                        doc.font('Helvetica', 8);

                        if (i + 1 == DetalleplanillaRcIva.length) {
                            doc.font('Helvetica-Bold', 8);
                            doc.text("TOTALES", 75, y + 30);
                            doc.text(Math.round((sumaNetoImponible) * 100) / 100, 140, y + 30); 
                            doc.text(Math.round((sumaDosSmn) * 100) / 100, 190, y + 30);
                            doc.text(Math.round((sumaDiferencia) * 100) / 100, 230, y + 30);
                            doc.text(Math.round((sumaSubRcIva) * 100) / 100, 283, y + 30);
                            doc.text(Math.round((sumaDosSmn13) * 100) / 100, 325, y + 30);
                            doc.text(Math.round((sumaF110) * 100) / 100, 365, y + 30);
                            doc.text(Math.round((sumaRcIvaFisico) * 100) / 100, 400, y + 30);
                            doc.text(Math.round((sumaSaldoDependiente) * 100) / 100, 440, y + 30);
                            doc.text(Math.round((sumaSaldoAnterior) * 100) / 100, 490, y + 30);
                            doc.text(Math.round((sumaActualizacion) * 100) / 100, 530, y + 30);
                            doc.text(Math.round((sumaSaldoActualizado) * 100) / 100, 580, y + 30);
                            doc.text(Math.round((sumaSaldoTotal) * 100) / 100, 625, y + 30);
                            doc.text(Math.round((sumaSaldoUtilizado) * 100) / 100, 665, y + 30);
                            doc.text(Math.round((sumaRcIvaMes) * 100) / 100, 705, y + 30);
                            doc.text(Math.round((sumaNuevoSaldo) * 100) / 100, 740, y + 30);

                            doc.rect(40, y - 10 + 30, 760, 30).stroke();
                            doc.font('Helvetica', 8);
                        } else {
                            doc.addPage({ margin: 0, bufferPages: true, layout: 'landscape' });
                            y = 170;
                            items = 0;
                            pagina = pagina + 1;
                            $scope.dibujarCabeceraPDFLibroVentas(doc, datos, reporte, pagina);
                            doc.font('Helvetica', 8);
                        }
                    }
                }
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });
                blockUI.stop();
            });
        }

    $scope.dibujarCabeceraPDFPlanillaRCIVA = function (doc, datos, reporte, pagina) {
        doc.font('Helvetica-Bold', 12);
        doc.text("PLANILLAS RC-IVA", 0, 25, { align: "center" });
        doc.font('Helvetica-Bold', 8);
        doc.text("FOLIO " + pagina, 760, 25);
        doc.rect(40, 60, 760, 40).stroke();
        doc.text("PERIÓDO FISCAL : ", 65, 70);
        doc.text("NOMBRE O RAZÓN SOCIAL : ", 65, 85);
        doc.text("NIT : ", 440, 85);
        doc.font('Helvetica', 8);
        doc.text("AÑO " + reporte.gestion, 140, 70);

        var mesReporte = reporte.mes.split("-")[1];
        if (reporte.mes == "TODOS") {
           mesReporte = reporte.mes;
        }
        doc.text("MES " + mesReporte, 200, 70); 
        doc.text(datos.empresa.razon_social, 195, 85);
        doc.text(datos.empresa.nit, 460, 85);

        doc.rect(40, 100, 760, 40).stroke();
        doc.font('Helvetica-Bold', 8);
        doc.text("Nº", 45, 110);
        doc.text("Año", 60, 110, { width: 20 });
        doc.text("Mes", 90, 110, { width: 50 });
        doc.text("Neto Imponible", 140, 110, { width: 50 });
        doc.text("2 SMN", 190, 110, { width: 35 });
        doc.text("Diferencia", 230, 110, { width: 50 });
        doc.text("RC-IVA 13%", 280, 110, { width: 35 });
        doc.text("13% de 2 SMN", 325, 110, { width: 35 });
        doc.text("F-110", 365, 110, { width: 35 });
        doc.text("RC-IVA Fisco", 400, 110, { width: 42 });
        doc.text("Saldo Dependiente", 440, 110, { width: 42 });
        doc.text("Saldo Anterior", 490, 110, { width: 40 });
        doc.text("Actualización", 530, 110, { width: 37 });
        doc.text("Saldo Actualizado", 580, 110, { width: 35 });
        doc.text("Saldo Total", 625, 110, { width: 35 });
        doc.text("Saldo Utilizado", 665, 110, { width: 35 });
        doc.text("RC-IVA Mes", 705, 110, { width: 35 });
        doc.text("Saldo Nuevo", 740, 110);
    }


    $scope.generarExcelPlanillaRcIva = function (planillaRcIva) {
        blockUI.start();
        var promesa = ListaRRHHPlanillaRCIVA($scope.usuario.id_empresa, planillaRcIva.gestion, planillaRcIva.mes);
        promesa.then(function (datos) {
            var DetalleplanillaRcIva = datos.planillas
            var data = [["N°", "Año", "Mes", "Neto Imponible", "2 SMN", "Diferencia", "RC-IVA 13%", "13% de 2 SMN", "F-110", "RC-IVA Fisco", "Saldo Dependiente", "Saldo Anterior", "Actualización", "Saldo Actualizado", "Saldo Total", "Saldo Utilizado", "RC-IVA Mes", "Saldo Nuevo"]]
            var sumaNetoImponible = 0, sumaSubRcIva = 0, sumaDosSmn = 0, sumaDiferencia = 0, sumaDosSmn13 = 0, sumaF110 = 0, sumaRcIvaFisico = 0, sumaSaldoDependiente = 0;
            var sumaSaldoAnterior = 0, sumaActualizacion = 0, sumaSaldoActualizado = 0, sumaSaldoTotal = 0, sumaSaldoUtilizado = 0, sumaRcIvaMes = 0, sumaNuevoSaldo = 0;

            for (var i = 0; i < DetalleplanillaRcIva.length; i++) {
                var columns = [];
                columns.push(i + 1);
                columns.push(DetalleplanillaRcIva[i].anio);
                columns.push(DetalleplanillaRcIva[i].mes.split("-")[1]);
                columns.push(DetalleplanillaRcIva[i].neto_imponible);
                columns.push((DetalleplanillaRcIva[i].dos_smn));
                columns.push(DetalleplanillaRcIva[i].diferencia);
                columns.push(DetalleplanillaRcIva[i].rc_iva);
                columns.push(DetalleplanillaRcIva[i].dos_smn13);
                columns.push(DetalleplanillaRcIva[i].f110);
                columns.push(DetalleplanillaRcIva[i].rc_iva_fisico);
                columns.push(DetalleplanillaRcIva[i].saldo_dependiente);
                columns.push(DetalleplanillaRcIva[i].saldo_anterior);
                columns.push(DetalleplanillaRcIva[i].actualizacion);
                columns.push(DetalleplanillaRcIva[i].saldo_actualizado);
                columns.push(DetalleplanillaRcIva[i].saldo_total);
                columns.push(DetalleplanillaRcIva[i].saldo_utilizado);
                columns.push(DetalleplanillaRcIva[i].rc_iva_mes);
                columns.push(DetalleplanillaRcIva[i].nuevo_saldo);
                
                sumaNetoImponible = sumaNetoImponible + DetalleplanillaRcIva[i].neto_imponible;
                sumaDosSmn = sumaDosSmn + DetalleplanillaRcIva[i].dos_smn;
                sumaDiferencia = sumaDiferencia + DetalleplanillaRcIva[i].diferencia;
                sumaDosSmn13 = sumaDosSmn13 + DetalleplanillaRcIva[i].dos_smn13;
                sumaF110 = sumaF110 + DetalleplanillaRcIva[i].f110;
                sumaRcIvaFisico = sumaRcIvaFisico + DetalleplanillaRcIva[i].rc_iva_fisico;
                sumaSaldoDependiente = sumaSaldoDependiente + DetalleplanillaRcIva[i].saldo_dependiente;
                sumaSaldoAnterior = sumaSaldoAnterior + DetalleplanillaRcIva[i].saldo_anterior;
                sumaActualizacion = sumaActualizacion + DetalleplanillaRcIva[i].actualizacion;
                sumaSaldoActualizado = sumaSaldoActualizado + DetalleplanillaRcIva[i].saldo_actualizado;
                sumaSaldoTotal = sumaSaldoTotal + DetalleplanillaRcIva[i].saldo_total;
                sumaSaldoUtilizado = sumaSaldoUtilizado + DetalleplanillaRcIva[i].saldo_utilizado;
                sumaRcIvaMes = sumaRcIvaMes + DetalleplanillaRcIva[i].rc_iva_mes;
                sumaNuevoSaldo = sumaNuevoSaldo + DetalleplanillaRcIva[i].nuevo_saldo;
              
                data.push(columns);
                if (i + 1 == DetalleplanillaRcIva.length) {
                    columns = [];
                    columns.push("");
                    columns.push("");
                    columns.push("TOTALES");
                    columns.push(Math.round((sumaNetoImponible) * 100) / 100); 
                    columns.push(Math.round((sumaDosSmn) * 100) / 100);
                    columns.push(Math.round((sumaDiferencia) * 100) / 100);
                    columns.push(Math.round((sumaSubRcIva) * 100) / 100);
                    columns.push(Math.round((sumaDosSmn13) * 100) / 100);
                    columns.push(Math.round((sumaF110) * 100) / 100);
                    columns.push(Math.round((sumaRcIvaFisico) * 100) / 100);
                    columns.push(Math.round((sumaSaldoDependiente) * 100) / 100);
                    columns.push(Math.round((sumaSaldoAnterior) * 100) / 100);
                    columns.push(Math.round((sumaActualizacion) * 100) / 100);
                    columns.push(Math.round((sumaSaldoActualizado) * 100) / 100);
                    columns.push(Math.round((sumaSaldoTotal) * 100) / 100);
                    columns.push(Math.round((sumaSaldoUtilizado) * 100) / 100);
                    columns.push(Math.round((sumaRcIvaMes) * 100) / 100);
                    columns.push(Math.round((sumaNuevoSaldo) * 100) / 100);
                    data.push(columns);
                }
            }

            var ws_name = "SheetJS";
            var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
            /* add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "PLANILLA-RCIVA.xlsx");
            blockUI.stop();
        });
    }


    $scope.filtrarSueldos=function(planilla){
        console.log('cabezera', planilla);
        // $scope.mostrarMensaje('Venta registrada exitosamente!')
        // $scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]

        var fechaUFVAnterior= new Date(planilla.gestion,parseInt(planilla.mes)-1,0);
        // var fechaUFVAnterior = (mesAnterior.getDate()) + '/' + (mesAnterior.getMonth() + 1) + '/' + mesAnterior.getFullYear();

        var fechaUFVActual= new Date(planilla.gestion,parseInt(planilla.mes),0);
        // var fechaUFVActual = (mesActual.getDate()) + '/' + (mesActual.getMonth() + 1) + '/' + mesActual.getFullYear();

        console.log("fechaUFVAnterior ===========", fechaUFVAnterior);
        console.log("fechaUFVActual ===========", fechaUFVActual);

        // $scope.ufvs = {}

        // // var dat = new Date($scope.convertirFecha(fechaUFVActual));
        Promise.all([ObtenerCambioMoneda(fechaUFVActual), ObtenerCambioMoneda(fechaUFVAnterior), RRHHlistaPlanillaRCIVA($scope.usuario.id_empresa, planilla.gestion, planilla.mes)]).then( function(dato) {
            // $scope.ufvs.ufvActual = (data[0].monedaCambio==null)?0:data[0].monedaCambio.ufv; 
            // $scope.ufvs.ufvAnterior =  (data[1].monedaCambio==null)?0:data[1].monedaCambio.ufv; 
            console.log("del mel planillaaaaaaaaaaaasss ", dato[2].planillas.length);
            
            $scope.ufvActual = (dato[0].monedaCambio==null)?0:dato[0].monedaCambio.ufv;
            console.log("$scope.ufvActual ==== ", $scope.ufvActual);
            $scope.ufvAnterior = (dato[1].monedaCambio==null)?0:dato[1].monedaCambio.ufv; 
            var msg = 'Venta registrada exitosamente!';

            if (dato[2].planillas.length == 0) {

                if ($scope.ufvActual > 0 && $scope.ufvAnterior > 0) {
                    var promesa = RecursosHumanosEmpleados($scope.usuario.id_empresa);
                    promesa.then(function (dato) {
                        planilla.RecursosHumanosEmpleados = dato.empleados;
                        
                        planilla.RecursosHumanosEmpleados.forEach(function (empleado) {
                            
                            promesa = RecursosHumanosEmpleadosHorasExtras(empleado.id_ficha, planilla.gestion, planilla.mes.split("-")[0], empleado.id);
                            promesa.then(function (dato) {
                                empleado.sueldoBasico = empleado.haber_basico;
                                $scope.antiguedad = calcAge(empleado.fecha_inicio); // == sacar años de antiguedad ==================
                                $scope.bonoFrontera = 0; // == sacar bono frontera ==================
                                $scope.otrosBonos = 0; // == sacar otros bonos ==================

                                empleado.horasExtras = dato.totalHoras;
                                empleado.totalHorasExtras = round((empleado.sueldoBasico/30/8*empleado.horasExtras)*2, 2);
                                empleado.recargoNocturno= round((empleado.sueldoBasico/30/8*empleado.horasExtras)*1.5, 2);
                                empleado.bonoAntiguedad = $scope.calcularBonoAntiguedad($scope.antiguedad);
                                empleado.bonoFrontera = $scope.bonoFrontera;
                                empleado.otrosBonos = $scope.otrosBonos;
                                empleado.totalGanado = empleado.sueldoBasico+empleado.totalHorasExtras+empleado.recargoNocturno+empleado.bonoAntiguedad+empleado.bonoFrontera+empleado.otrosBonos;
                                empleado.afp = round(empleado.totalGanado * 12.71/100, 2);

                                empleado.montoDeclarado = 0;
                                empleado.muneroFacturas = 0;
                                empleado.ivaCF = 0;

                                empleado.netoImponible = round(empleado.totalGanado - empleado.afp, 2);
                                empleado.dos_SMN = $scope.parametros.salario_minimo * 2;

                                empleado.diferencia = 0;
                                if (empleado.netoImponible > empleado.dos_SMN) {
                                    empleado.diferencia = round(empleado.netoImponible - empleado.dos_SMN, 2);
                                }

                                empleado.rcIva13 = round(empleado.diferencia * 0.13, 2);
                                empleado.dos_SMN13 = ($scope.parametros.salario_minimo * 2)*0.13;
                                empleado.f110 = empleado.ivaCF;
                                var calculo = empleado.rcIva13 - empleado.dos_SMN13;
                                var calculo2 = calculo-empleado.f110;

                                empleado.rcIvaFisco = 0;
                                if (calculo2>=0) {
                                    empleado.rcIvaFisco = round(calculo2, 2);
                                }

                                if (calculo2>=0) {
                                    empleado.saldoDependiente = 0;
                                }else{
                                    empleado.saldoDependiente = round(empleado.f110-calculo, 2);
                                }
                                // ==== obtener de la casilla nuevo saldo del mes anterior de planilla rc-iva)
                                if (empleado.nuevo_saldo == null){
                                    empleado.nuevo_saldo = 0;
                                } 
                                
                                empleado.saldoAnterior = empleado.nuevo_saldo;

                                empleado.actualizacion = round((empleado.saldoAnterior/$scope.ufvAnterior*$scope.ufvActual)-empleado.saldoAnterior, 2);
                                empleado.saldoActualizado = empleado.saldoAnterior + empleado.actualizacion;
                                empleado.saldoTotal = round(empleado.saldoDependiente + empleado.saldoActualizado, 2);
                                
                                var calculo3 = empleado.rcIvaFisco-empleado.saldoActualizado;
                                if ( calculo3 > 0) {
                                    empleado.saldoUtilizado =  round(empleado.rcIvaFisco - calculo3, 2);
                                }else{
                                    empleado.saldoUtilizado =  empleado.rcIvaFisco;
                                }

                                empleado.rcIvaMes = 0;
                                if (empleado.rcIvaFisco>empleado.saldoTotal) {
                                    empleado.rcIvaMes = round(empleado.rcIvaFisco-empleado.saldoTotal, 2);
                                }

                                if (empleado.rcIvaMes>0) {
                                    empleado.saldoNuevo = 0;
                                }else{
                                     empleado.saldoNuevo = empleado.saldoTotal-empleado.rcIvaFisco;
                                }
                                $scope.sumarTotales(planilla);
                            });       

                        });
                        
                    });

                }else{
                    
                    $scope.$apply(function () {
                        $scope.message = "Falta las UFVs para poder crear nuevas planillas";
                        $scope.mostrarMensaje($scope.message);
                    });
                   
                }
            }else{
                $scope.$apply(function () {
                    $scope.message = "Ya se creo planilla para este periodo "+ "'"+planilla.mes.split("-")[1]+"-"+planilla.gestion+"'";
                    $scope.mostrarMensaje($scope.message);
                });
            }
            blockUI.stop();
            

        });
 
    }
    

    $scope.calcularRCIVA = function () {
        var validador = $scope.sueldo.montoDeclarado * 13/100;
        $scope.valido = false;
        if (validador != $scope.sueldo.ivaCF) {
            $scope.mensage = "ddfsfsdfsdf";
            $scope.valido = true;
        }

        $scope.sueldo.f110 = $scope.sueldo.ivaCF;
        var calculo = $scope.sueldo.rcIva13 - $scope.sueldo.dos_SMN13;
        var calculo2 = calculo-$scope.sueldo.f110;

        $scope.sueldo.rcIvaFisco = 0;
        if (calculo2>=0) {
            $scope.sueldo.rcIvaFisco = round(calculo2, 2);
        }

        if (calculo2>=0) {
            $scope.sueldo.saldoDependiente = 0;
        }else{
            $scope.sueldo.saldoDependiente = round($scope.sueldo.f110-calculo, 2);
        }
        // ==== obtener de la casilla nuevo saldo del mes anterior de planilla rc-iva)
        $scope.sueldo.saldoAnterior = 10;

        $scope.sueldo.actualizacion = round(($scope.sueldo.saldoAnterior/$scope.ufvAnterior*$scope.ufvActual)-$scope.sueldo.saldoAnterior, 2);
        $scope.sueldo.saldoActualizado = $scope.sueldo.saldoAnterior + $scope.sueldo.actualizacion;
        $scope.sueldo.saldoTotal = round($scope.sueldo.saldoDependiente + $scope.sueldo.saldoActualizado, 2);
        
        var calculo3 = $scope.sueldo.rcIvaFisco-$scope.sueldo.saldoActualizado;
        if ( calculo3 > 0) {
            $scope.sueldo.saldoUtilizado =  round($scope.sueldo.rcIvaFisco - calculo3, 2);
        }else{
            $scope.sueldo.saldoUtilizado =  $scope.sueldo.rcIvaFisco;
        }

        $scope.sueldo.rcIvaMes = 0;
        if ($scope.sueldo.rcIvaFisco>$scope.sueldo.saldoTotal) {
            $scope.sueldo.rcIvaMes = round($scope.sueldo.rcIvaFisco-$scope.sueldo.saldoTotal, 2);
        }

        if ($scope.sueldo.rcIvaMes>0) {
            $scope.sueldo.saldoNuevo = 0;
        }else{
             $scope.sueldo.saldoNuevo = $scope.sueldo.saldoTotal-$scope.sueldo.rcIvaFisco;
        }
    }


    $scope.calcularRCIVA2 = function (empleado, recibido) {
        
        empleado.f110 = recibido.ivaCF;
        var calculo = empleado.rcIva13 - empleado.dos_SMN13;
        var calculo2 = calculo-empleado.f110;

        empleado.rcIvaFisco = 0;
        if (calculo2>=0) {
            empleado.rcIvaFisco = round(calculo2, 2);
        }

        if (calculo2>=0) {
            empleado.saldoDependiente = 0;
        }else{
            empleado.saldoDependiente = round(empleado.f110-calculo, 2);
        }
        // ==== obtener de la casilla nuevo saldo del mes anterior de planilla rc-iva)
        empleado.saldoAnterior = 10;

        empleado.actualizacion = round((empleado.saldoAnterior/$scope.ufvAnterior*$scope.ufvActual)-empleado.saldoAnterior, 2);
        empleado.saldoActualizado = empleado.saldoAnterior + empleado.actualizacion;
        empleado.saldoTotal = round(empleado.saldoDependiente + empleado.saldoActualizado, 2);
        
        var calculo3 = empleado.rcIvaFisco-empleado.saldoActualizado;
        if ( calculo3 > 0) {
            empleado.saldoUtilizado =  round(empleado.rcIvaFisco - calculo3, 2);
        }else{
            empleado.saldoUtilizado =  empleado.rcIvaFisco;
        }

        empleado.rcIvaMes = 0;
        if (empleado.rcIvaFisco>empleado.saldoTotal) {
            empleado.rcIvaMes = round(empleado.rcIvaFisco-empleado.saldoTotal, 2);
        }

        if (empleado.rcIvaMes>0) {
            empleado.saldoNuevo = 0;
        }else{
             empleado.saldoNuevo = empleado.saldoTotal-empleado.rcIvaFisco;
        }
    }

    // funcion para calcular los años de antiguedad 
    function calcAge(dateString) {
      var birthday = +new Date(dateString);
      return ~~((Date.now() - birthday) / (31557600000));
    }

    // para redondeo de numeros
    function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    $scope.sumarTotales=function(planilla){
        $scope.netoImponible=0;
        $scope.sumaDos_SMN=0;
        $scope.sumaDiferencia=0;
        $scope.sumarcIva13=0;
        $scope.sumaDos_SMN13=0;
        $scope.sumaF110=0;
        $scope.sumaRcIvaFisco=0;
        $scope.sumaSaldoDependiente=0;
        $scope.sumaSaldoAnterior=0;
        $scope.sumaActualizacion=0;
        $scope.sumaSaldoActualizado=0;
        $scope.sumaSaldoTotal=0;
        $scope.sumaSaldoUtilizado=0;
        $scope.sumaRcIvaMes=0;
        $scope.sumaSaldoNuevo=0;
        var totalEmpleados = 0;
        if (planilla.RecursosHumanosEmpleados != undefined) {
            for(var i=0;i<planilla.RecursosHumanosEmpleados.length;i++){
                totalEmpleados = totalEmpleados + 1;
                $scope.netoImponible=$scope.netoImponible+planilla.RecursosHumanosEmpleados[i].netoImponible;
                $scope.sumaDos_SMN=$scope.sumaDos_SMN+planilla.RecursosHumanosEmpleados[i].dos_SMN;
                $scope.sumaDiferencia=$scope.sumaDiferencia+planilla.RecursosHumanosEmpleados[i].diferencia;

                $scope.sumarcIva13=$scope.sumarcIva13+planilla.RecursosHumanosEmpleados[i].rcIva13;
                $scope.sumaDos_SMN13=$scope.sumaDos_SMN13+planilla.RecursosHumanosEmpleados[i].dos_SMN13;
                $scope.sumaF110=$scope.sumaF110+planilla.RecursosHumanosEmpleados[i].f110;
                $scope.sumaRcIvaFisco=$scope.sumaRcIvaFisco+planilla.RecursosHumanosEmpleados[i].rcIvaFisco;
                $scope.sumaSaldoDependiente=round($scope.sumaSaldoDependiente+planilla.RecursosHumanosEmpleados[i].saldoDependiente, 2);
                $scope.sumaSaldoAnterior=round($scope.sumaSaldoAnterior+planilla.RecursosHumanosEmpleados[i].saldoAnterior, 2);
                $scope.sumaActualizacion=round($scope.sumaActualizacion+planilla.RecursosHumanosEmpleados[i].actualizacion, 2);
                $scope.sumaSaldoActualizado=round($scope.sumaSaldoActualizado+planilla.RecursosHumanosEmpleados[i].saldoActualizado, 2);
                $scope.sumaSaldoTotal=round($scope.sumaSaldoTotal+planilla.RecursosHumanosEmpleados[i].saldoTotal, 2);
                $scope.sumaSaldoUtilizado=round($scope.sumaSaldoUtilizado+planilla.RecursosHumanosEmpleados[i].saldoUtilizado, 2);
                $scope.sumaRcIvaMes=round($scope.sumaRcIvaMes+planilla.RecursosHumanosEmpleados[i].rcIvaMes, 2);
                $scope.sumaSaldoNuevo=round($scope.sumaSaldoNuevo+planilla.RecursosHumanosEmpleados[i].saldoNuevo, 2);
            }
        }   
        planilla.totalEmpleados = totalEmpleados;
        planilla.netoImponible = $scope.netoImponible;
        planilla.sumaDos_SMN = $scope.sumaDos_SMN;
        planilla.sumaDiferencia = $scope.sumaDiferencia;
        planilla.sumarcIva13 = $scope.sumarcIva13;
        planilla.sumaDos_SMN13 = $scope.sumaDos_SMN13;
        planilla.sumaF110 = $scope.sumaF110;
        planilla.sumaRcIvaFisco = $scope.sumaRcIvaFisco;
        planilla.sumaSaldoDependiente = $scope.sumaSaldoDependiente;
        planilla.sumaSaldoAnterior = $scope.sumaSaldoAnterior; 
        planilla.sumaActualizacion = $scope.sumaActualizacion;
        planilla.sumaSaldoActualizado = $scope.sumaSaldoActualizado;
        planilla.sumaSaldoTotal = $scope.sumaSaldoTotal;
        planilla.sumaSaldoUtilizado = $scope.sumaSaldoUtilizado;    
        planilla.sumaRcIvaMes = $scope.sumaRcIvaMes;
        planilla.sumaSaldoNuevo = $scope.sumaSaldoNuevo;
        
    }

    $scope.obtenerParametros=function(idEmpresa){
        blockUI.start();
        if(idEmpresa==null){
            idEmpresa=0;
        }
        var promesa=Parametros(idEmpresa);
        promesa.then(function(parametros){
            $scope.parametros=parametros;
            blockUI.stop();
        });
    }

    $scope.calcularBonoAntiguedad=function(antiguedad){
        if (antiguedad >= 0 && antiguedad <= 2) {
            // "es de 0 a 2"
            return 3 * $scope.parametros.salario_base_antiguedad * $scope.parametros.antiguedad_cero_dos/100;
        }
        if (antiguedad > 2 && antiguedad <= 5) {
            // "es de 2 a 5"
            return 3 * $scope.parametros.salario_base_antiguedad * $scope.parametros.antiguedad_dos_cinco/100;
        }
        if (antiguedad > 5 && antiguedad <= 8) {
            // "es de 5 a 8"
            return 3 * $scope.parametros.salario_base_antiguedad * $scope.parametros.antiguedad_cinco_ocho/100;
        }
        if (antiguedad > 8 && antiguedad <= 11) {
            // "es de 8 a 11"
            return 3 * $scope.parametros.salario_base_antiguedad * $scope.parametros.antiguedad_ocho_once/100;
        }
        if (antiguedad > 11 && antiguedad <= 15) {
            // "es de 11 a 15"
            return 3 * $scope.parametros.salario_base_antiguedad * $scope.parametros.antiguedad_once_quince/100;
        }
        if (antiguedad > 15 && antiguedad <= 20) {
            // "es de 15 a 20"
            return 3 * $scope.parametros.salario_base_antiguedad * $scope.parametros.antiguedad_quice_veinte/100;
        }
        if (antiguedad > 20 && antiguedad <= 25) {
            // "es de 20 a 25"
            return 3 * $scope.parametros.salario_base_antiguedad * $scope.parametros.antiguedad_veinte_veinticinco/100;
        }
        if (antiguedad > 25) {
            // "es de mayor a 25"
            return 3 * $scope.parametros.salario_base_antiguedad * $scope.parametros.antiguedad_mas_veinticinco/100;
        }
    }

    $scope.calculoR = function() {
        $scope.sueldo.f110 = $scope.sueldo.ivaCF;
    }
   
    
    $scope.modificarFormulario110= function (sueldo) {
       $scope.empleado = angular.extend($scope.empleado, sueldo);
       $scope.sumarTotales($scope.planilla);
       $scope.cerrarDialogFormulario110();
       console.log('el empleadofff ===== ', sueldo);
    }

    $scope.EmpleadosSeleccionados = [];
    $scope.checkEmpleado = function(index, value, checked) {
        var idx = $scope.EmpleadosSeleccionados.indexOf(value);
        console.log("idx ===========", idx);
        $scope.selectAll = false;
        if (idx >= 0 && !checked) {
          $scope.EmpleadosSeleccionados.splice(idx, 1);
        }
        if (idx < 0 && !checked) {
          $scope.EmpleadosSeleccionados.splice(index, 1);
        }
        if (idx < 0 && checked) {
          $scope.EmpleadosSeleccionados.push(value);
        }
        console.log('los seleccionadossssss ===== ', $scope.EmpleadosSeleccionados);
    }

    $scope.checkAll = function(planilla, selectAll) {
        
        if (!selectAll) {
            $scope.EmpleadosSeleccionados = [];
        }else{
            $scope.EmpleadosSeleccionados = angular.copy(planilla);
        }
        angular.forEach(planilla, function(user) {
          user.checked = selectAll;
        });
    };


    // === validar el iva cf que se el 13% de el monto declarado ===============
    $scope.abrirDialogFormulario110= function (empleado) {
        $scope.empleado = empleado;
        $scope.sueldo = angular.copy(empleado);
        console.log("$scope.sueldo ==== ", $scope.sueldo);
        $scope.abrirPopup($scope.idModalFormulario110);
    }

    $scope.generarExcelFormulario110 = function (planillas) {
        var data = [["CODIGO", "NOMBRE COMPLETO", "MONTO DECLARADO", "IVA CF", "NUMERO DE FACTURAS"]];
        if (planillas) {
            for (var i = 0; i < planillas.RecursosHumanosEmpleados.length; i++) {
                var columns = [];
                columns.push(planillas.RecursosHumanosEmpleados[i].codigo);
                columns.push(planillas.RecursosHumanosEmpleados[i].nombre_completo);
                columns.push(0);
                columns.push(0);
                columns.push(0);
                data.push(columns);
            }
        }

        var ws_name = "SheetJS";
        var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
        // ancho de las columnas
        var wscols = [
            {wch:12},
            {wch:25},
            {wch:17},
            {wch:10},
            {wch:20}
        ];

        ws['!cols'] = wscols;
        /* add worksheet to workbook */
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "datos_formulario11o.xlsx");
        blockUI.stop();

    }

    $scope.subirExcelFormulario110 = function (event) {
        var files = event.target.files;
        var i, f;
        for (i = 0, f = files[i]; i != files.length; ++i) {
            var reader = new FileReader();
            var name = f.name;
            reader.onload = function (e) {
                blockUI.start();
                var data = e.target.result;

                var workbook = XLSX.read(data, { type: 'binary' });
                var first_sheet_name = workbook.SheetNames[0];
                var row = 2, i = 0;
                var worksheet = workbook.Sheets[first_sheet_name];

                function getSelectedIndex(codigo){
                    for(var i=0; i<$scope.planilla.RecursosHumanosEmpleados.length; i++)
                        if($scope.planilla.RecursosHumanosEmpleados[i].codigo==codigo)
                            return i;
                        return -1;  
                };

                $scope.selectEdit = function(empleado){
                    var index = getSelectedIndex(empleado.codigo);
                    $scope.planilla.RecursosHumanosEmpleados[index].ivaCF = empleado.ivaCF;
                    $scope.planilla.RecursosHumanosEmpleados[index].montoDeclarado = empleado.montoDeclarado;
                    $scope.planilla.RecursosHumanosEmpleados[index].muneroFacturas = empleado.muneroFacturas;
                    // $scope.planilla.RecursosHumanosEmpleados[index].f110 = empleado.ivaCF;

                    $scope.calcularRCIVA2($scope.planilla.RecursosHumanosEmpleados[index], empleado);
                };
                
                // para modificar las columnas de los empleados en su planilla ================
                do {
                    var empleado = {};
                    empleado.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
                    empleado.nombre_completo = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
                    empleado.montoDeclarado = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? Number(worksheet['C' + row].v) : null;
                    empleado.ivaCF = worksheet['D' + row] != undefined && worksheet['D' + row] != "" ? Number(worksheet['D' + row].v) : null;
                    empleado.muneroFacturas = worksheet['E' + row] != undefined && worksheet['E' + row] != "" ? Number(worksheet['E' + row].v) : null;
       
                    $scope.selectEdit(empleado);

                    row++;
                    i++;
                } while (worksheet['A' + row] != undefined);
                
                $scope.sumarTotales($scope.planilla);
                $scope.cerrarDialogFormularioGeneral110();
                blockUI.stop();
            };
            reader.readAsBinaryString(f);
        }
    }

    $scope.cerrarDialogFormulario110=function () {
        $scope.cerrarPopup($scope.idModalFormulario110); 
    }
    $scope.abrirDialogFormularioGeneral110= function () {
        $scope.abrirPopup($scope.idModalFormularioGeneral110);
    }

    $scope.modificarFormularioGeneral110= function (empleados) {
        
        function getSelectedIndex(id){
            for(var i=0; i<$scope.planilla.RecursosHumanosEmpleados.length; i++)
                if($scope.planilla.RecursosHumanosEmpleados[i].id==id)
                    return i;
                return -1;  
        };

        $scope.selectEdit = function(empleado){
            var index = getSelectedIndex(empleado.id);
            console.log("index empleado", index);
            $scope.planilla.RecursosHumanosEmpleados[index].ivaCF = empleado.ivaCF;
            $scope.planilla.RecursosHumanosEmpleados[index].montoDeclarado = empleado.montoDeclarado;
            $scope.planilla.RecursosHumanosEmpleados[index].muneroFacturas = empleado.muneroFacturas;
            // $scope.planilla.RecursosHumanosEmpleados[index].f110 = empleado.ivaCF;

            $scope.calcularRCIVA2($scope.planilla.RecursosHumanosEmpleados[index], empleado);
        };
        // $scope.planilla.RecursosHumanosEmpleados = angular.extend($scope.planilla.RecursosHumanosEmpleados, empleados);

        empleados.forEach(function (empleado) {
            $scope.selectEdit(empleado);
          // $scope.empleado = angular.extend($scope.empleado, empleado);
        });
        console.log("empleado generalllllllll ====== ", $scope.planilla.RecursosHumanosEmpleados);
        
        $scope.sumarTotales($scope.planilla);
        $scope.cerrarDialogFormularioGeneral110();
       
    }

    $scope.generar=function(planilla){
        planilla.$save(function(dato){
            $scope.nuevaPlanillaRcIva();
            blockUI.stop();
            // console.log('llego ', dato);
            // $scope.cerrarPopPupEdicion();
            $scope.mostrarMensaje('Planilla registrada exitosamente!');
            // $scope.recargarItemsTabla();
            // $scope.imprimirCompra(compra);
        },function(error) {
            
            blockUI.stop();
            console.log('fallo ', error);
            // $scope.cerrarPopPupEdicion();
            // $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
            // $scope.recargarItemsTabla();
        });
        console.log('los datos  de planilla rc ivaaa ', planilla);
    }

    $scope.cerrarDialogFormularioGeneral110=function () {
        $scope.cerrarPopup($scope.idModalFormularioGeneral110); 
    }
    $scope.abrirDialogArchivosTXT= function () {
        $scope.abrirPopup($scope.idModalArchivosTXT);
    }
    $scope.cerrarDialogArchivosTXT=function () {
        $scope.cerrarPopup($scope.idModalArchivosTXT); 
    }
    $scope.obtenerParametros($scope.usuario.id_empresa);
    

}]);