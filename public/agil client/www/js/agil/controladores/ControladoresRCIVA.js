angular.module('agil.controladores')

.controller('ControladoresRCIVA', function($scope,$localStorage,$location,$templateCache,$route,blockUI, RecursosHumanosEmpleados, RecursosHumanosEmpleadosHorasExtras, ClasesTipo, Parametros, ObtenerCambioMoneda){
	$scope.$on('$viewContentLoaded', function () {
        
        $scope.idModalNuevoPlanillaRCIVA = 'dialog-nueva-planilla-rc-iva';
        $scope.idModalFormulario110 = 'dialog-formulario-110';
        $scope.idModalFormularioGeneral110 = 'dialog-formulario-general-110';
        $scope.idModalArchivosTXT = 'dialog-archivos-txt';
        
        ejecutarScriptsPlanillaRCIVA($scope.idModalNuevoPlanillaRCIVA, $scope.idModalFormulario110, $scope.idModalFormularioGeneral110, 
            $scope.idModalArchivosTXT);
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalNuevoPlanillaRCIVA, $scope.idModalFormulario110,$scope.idModalFormularioGeneral110, 
            $scope.idModalArchivosTXT);
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

    $scope.abrirDialogNuevoPlanillaRCIVA= function () {
        $scope.abrirPopup($scope.idModalNuevoPlanillaRCIVA);
    }
    $scope.cerrarDialogNuevoPlanillaRCIVA=function () {
        $scope.cerrarPopup($scope.idModalNuevoPlanillaRCIVA); 
    }

    $scope.filtrarSueldos=function(planilla){
        console.log('cabezera', planilla);
        // $scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]
        var promesa = RecursosHumanosEmpleados($scope.usuario.id_empresa);
        promesa.then(function (dato) {
            console.log('empleadossssstt ', dato);
            planilla.RecursosHumanosEmpleados = dato.empleados;
            // $scope.RecursosHumanosEmpleados.fecha_nacimiento_texto = $scope.fechaATexto($scope.RecursosHumanosEmpleados.persona.fecha_nacimiento);

            planilla.RecursosHumanosEmpleados.forEach(function (empleado) {
                empleado.sueldoBasico = empleado.empleadosFichas[0].haber_basico;
                $scope.horasExtras = 8; // == sacar horas extras ==================
                $scope.antiguedad = calcAge(empleado.empleadosFichas[0].fecha_inicio); // == sacar años de antiguedad ==================
                $scope.bonoFrontera = 0; // == sacar bono frontera ==================
                $scope.otrosBonos = 0; // == sacar otros bonos ==================
                console.log('los ides de empleados ==== ', empleado.id);
                promesa = RecursosHumanosEmpleadosHorasExtras(empleado.id, planilla.gestion, planilla.mes.split("-")[0]);
                promesa.then(function (dato) {
                    // console.log('los datos del horas :  ', dato.horasExtra);
                    // $scope.horasExtras = 10;
                    // var totalHoras = "";
                    // var timeHoras = 0;
                    // var timeMinutos = 0;
                    // if (dato.horasExtra.length > 0) {
                    //     for (var i = 0; i < dato.horasExtra.length; i++) {
                    //         var minutos = dato.horasExtra[i].tiempo.split(':')[1];
                    //         var horas = dato.horasExtra[i].tiempo.split(':')[0];

                    //         timeHoras = timeHoras + parseInt(horas);
                    //         timeMinutos = timeMinutos + parseInt(minutos);
                    //         if (timeMinutos >= 60) {
                    //             timeMinutos = timeMinutos - 60;
                    //             timeHoras = timeHoras + 1;
                    //         }
                    //         // totalHoras = String("0" + timeHoras).slice(-2) + ':' + String("0" + timeMinutos).slice(-2);
                    //         totalHoras = timeHoras;
                    //     }
                    // }else{
                    //     totalHoras = 0;
                    // }
                    
                    empleado.horasExtras = dato.totalHoras;
                    empleado.totalHorasExtras = round((empleado.sueldoBasico/30/8*empleado.horasExtras)*2, 2);
                    empleado.recargoNocturno= round((empleado.sueldoBasico/30/8*empleado.horasExtras)*1.5, 2);
                    empleado.bonoAntiguedad = $scope.calcularBonoAntiguedad($scope.antiguedad);
                    empleado.bonoFrontera = $scope.bonoFrontera;
                    empleado.otrosBonos = $scope.otrosBonos;
                    empleado.totalGanado = empleado.sueldoBasico+empleado.totalHorasExtras+empleado.recargoNocturno+empleado.bonoAntiguedad+empleado.bonoFrontera+empleado.otrosBonos;
                    empleado.afp = round(empleado.totalGanado * 12.71/100, 2);
                    empleado.netoImponible = empleado.totalGanado - empleado.afp;
                    empleado.dos_SMN = $scope.parametros.salario_minimo * 2;

                    empleado.diferencia = 0;
                    if (empleado.netoImponible > empleado.dos_SMN) {
                        empleado.diferencia = round(empleado.netoImponible - empleado.dos_SMN, 2);
                    }

                    empleado.rcIva13 = round(empleado.diferencia * 0.13, 2);
                    empleado.dos_SMN13 = ($scope.parametros.salario_minimo * 2)*0.13;
                    empleado.f110 = 0;
                    var calculo = empleado.rcIva13 - empleado.dos_SMN13;
                    var calculo2 = calculo-empleado.f110;

                    empleado.rcIvaFisico = 0;
                    if (calculo2>=0) {
                        empleado.rcIvaFisico = round(calculo2, 2);
                    }

                    if (calculo2>=0) {
                        empleado.saldoDependiente = 0;
                    }else{
                        empleado.saldoDependiente = empleado.f110-calculo;
                    }
                    // ==== obtener de la casilla nuevo saldo del mes anterior)
                    empleado.saldoAnterior = 0;
                    
                    empleado.rc_iva = 0; // sacar de planilla rc-iva
                    empleado.anticipos = 0; // sacar de planilla anticipos 
                    empleado.prestamos = round(dato.totalCuotas, 2); // sacar de recursos humanos 
                    empleado.totalDescuento = round(empleado.afp+empleado.rc_iva+empleado.anticipos+empleado.prestamos, 2);
                    empleado.liquidoPagable = round(empleado.totalGanado - empleado.totalDescuento, 2);
                    $scope.sumarTotales(planilla);

                });

                // empleado.horasExtras = $scope.horasExtras;        

            });
            
            
            blockUI.stop();
        });
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
        $scope.totalSueldoBasico=0;
        $scope.sumaHorasExtras=0;
        $scope.sumaTotalHorasExtras=0;
        $scope.sumaRecargoNocturno=0;
        $scope.sumaBonoAntiguedad=0;
        $scope.sumaBonoFrontera=0;
        $scope.sumaOtrosBonos=0;
        $scope.sumaTotalGanado=0;
        $scope.sumaAFP=0;
        $scope.sumaRCIVA=0;
        $scope.sumaAniticipos=0;
        $scope.sumaPrestamos=0;
        $scope.sumaTotalDescuento=0;
        $scope.sumaLiquidoPagable=0;
        var totalEmpleados = 0;
        if (planilla.RecursosHumanosEmpleados != undefined) {
            for(var i=0;i<planilla.RecursosHumanosEmpleados.length;i++){
                totalEmpleados = totalEmpleados + 1;
                $scope.totalSueldoBasico=$scope.totalSueldoBasico+planilla.RecursosHumanosEmpleados[i].sueldoBasico;
                $scope.sumaHorasExtras=$scope.sumaHorasExtras+planilla.RecursosHumanosEmpleados[i].horasExtras;
                $scope.sumaTotalHorasExtras=$scope.sumaTotalHorasExtras+planilla.RecursosHumanosEmpleados[i].totalHorasExtras;
                $scope.sumaRecargoNocturno=$scope.sumaRecargoNocturno+planilla.RecursosHumanosEmpleados[i].recargoNocturno;
                $scope.sumaBonoAntiguedad=$scope.sumaBonoAntiguedad+planilla.RecursosHumanosEmpleados[i].bonoAntiguedad;
                $scope.sumaBonoFrontera=$scope.sumaBonoFrontera+planilla.RecursosHumanosEmpleados[i].bonoFrontera;
                $scope.sumaOtrosBonos=$scope.sumaOtrosBonos+planilla.RecursosHumanosEmpleados[i].otrosBonos;
                $scope.sumaTotalGanado=round($scope.sumaTotalGanado+planilla.RecursosHumanosEmpleados[i].totalGanado, 2);
                $scope.sumaAFP=round($scope.sumaAFP+planilla.RecursosHumanosEmpleados[i].afp, 2);
                $scope.sumaRCIVA=round($scope.sumaRCIVA+planilla.RecursosHumanosEmpleados[i].rc_iva, 2);
                $scope.sumaAniticipos=round($scope.sumaAniticipos+planilla.RecursosHumanosEmpleados[i].anticipos, 2);
                $scope.sumaPrestamos=round($scope.sumaPrestamos+planilla.RecursosHumanosEmpleados[i].prestamos, 2);
                $scope.sumaTotalDescuento=round($scope.sumaTotalDescuento+planilla.RecursosHumanosEmpleados[i].totalDescuento, 2);
                $scope.sumaLiquidoPagable=round($scope.sumaLiquidoPagable+planilla.RecursosHumanosEmpleados[i].liquidoPagable, 2);
            }
        }   
        planilla.totalEmpleados = totalEmpleados;
        planilla.importeSueldoBasico = $scope.totalSueldoBasico;
        planilla.totalHorasExtras = $scope.sumaHorasExtras;
        planilla.importeHorasExtras = $scope.sumaTotalHorasExtras;
        planilla.importeRecargoNocturno = $scope.sumaRecargoNocturno;
        planilla.importeBonoAntiguedad = $scope.sumaBonoAntiguedad;
        planilla.importeBonoFrontera = $scope.sumaBonoFrontera;
        planilla.importeOtrosBonos = $scope.sumaOtrosBonos;
        planilla.importeAFP = $scope.sumaAFP;
        planilla.importeRCIVA = $scope.sumaRCIVA; 
        planilla.importeAniticipos = $scope.sumaAniticipos;
        planilla.importePrestamos = $scope.sumaPrestamos;
        planilla.importeTotalDescuento = $scope.sumaTotalDescuento;
        planilla.importeTotalGanado = $scope.sumaTotalGanado;    
        planilla.importeLiquidoPagable = $scope.sumaLiquidoPagable;
        
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



    $scope.abrirDialogFormulario110= function () {
        $scope.abrirPopup($scope.idModalFormulario110);
    }
    $scope.cerrarDialogFormulario110=function () {
        $scope.cerrarPopup($scope.idModalFormulario110); 
    }
    $scope.abrirDialogFormularioGeneral110= function () {
        $scope.abrirPopup($scope.idModalFormularioGeneral110);
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
    

});