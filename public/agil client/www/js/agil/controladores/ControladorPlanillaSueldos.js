angular.module('agil.controladores')

.controller('ControladorPlanillaSueldos', function($scope,$localStorage,$location,$templateCache,$route,blockUI, Parametro, Parametros, RecursosHumanosEmpleados, ClasesTipo, RecursosHumanosEmpleadosHorasExtras, RecursosHumanosPlanillaSueldos, RRHHlistaPlanillaSueldos){
    $scope.$on('$viewContentLoaded', function () {
        // resaltarPestaña($location.path().substring(1));
        $scope.idModalNuevaPlanillaSueldos = 'dialog-nueva-planilla-sueldos';
        $scope.idModalEditarPlanillaSueldo = 'dialog-editar-planilla-sueldo';
        $scope.idModalParametros = 'dialog-parametros';
        $scope.idModalTR3 = 'dialog-tr3';
        $scope.idModalHistorialTR3 = 'dialog-historial-tr3';
        $scope.idEliminarSueldoEmpleado = 'dialog-eliminar-salario-empleado';
        
        ejecutarScriptsPlanillaSueldos($scope.idModalNuevaPlanillaSueldos, $scope.idModalEditarPlanillaSueldo, $scope.idModalParametros, 
            $scope.idModalTR3, $scope.idModalHistorialTR3, $scope.idEliminarSueldoEmpleado);
    });

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalNuevaPlanillaSueldos, $scope.idModalEditarPlanillaSueldo, $scope.idModalParametros, 
            $scope.idModalTR3, $scope.idModalHistorialTR3, $scope.idEliminarSueldoEmpleado);
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

    // $scope.years = [];
    // var max = new Date().getFullYear();
    // for (var i = max; i>=2013; i--){
    //     $scope.years.push(i);
    // }
    // $scope.planilla={};
    // $scope.planilla.gestion = 2018;

    $scope.nuevaPlanillaSueldos = function () {
        $scope.planilla=new RecursosHumanosPlanillaSueldos({id_empresa:$scope.usuario.id_empresa});
        $scope.sumarTotales($scope.planilla);
    }

    $scope.abrirDialogNuevaPlanillaSueldos= function () {
        $scope.nuevaPlanillaSueldos();
        $scope.abrirPopup($scope.idModalNuevaPlanillaSueldos);
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
                
                console.log('los ides de empleados ==== ', empleado);
                promesa = RecursosHumanosEmpleadosHorasExtras(empleado.id_ficha, planilla.gestion, planilla.mes.split("-")[0], empleado.id);
                promesa.then(function (dato) {
                    console.log("los datos de  los empleados ", dato);
                    empleado.sueldoBasico = empleado.haber_basico;
                    $scope.horasExtras = 8; // == sacar horas extras ==================
                    console.log('ficha fecha inicio ==== ', empleado.fecha_inicio);
                    $scope.antiguedad = calcAge(empleado.fecha_inicio); // == sacar años de antiguedad ==================
                    console.log("$scope.antiguedad", $scope.antiguedad);
                    
                    $scope.bonoFrontera = 0; // == sacar bono frontera ==================
                    $scope.otrosBonos = 0; // == sacar otros bonos ==================
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
                    empleado.totalGanado = round(empleado.sueldoBasico+empleado.totalHorasExtras+empleado.recargoNocturno+empleado.bonoAntiguedad+empleado.bonoFrontera+empleado.otrosBonos, 2);
                    empleado.afp = round(empleado.totalGanado * 12.71/100, 2);
                    if (empleado.rc_iva_mes == null) {
                        empleado.rc_iva_mes = 0;
                    }
                    empleado.rc_iva = empleado.rc_iva_mes; // sacar de planilla rc-iva
                    // ==== falta rescatar planilla anticipos =================================================0
                    empleado.anticipos = round(dato.totalAnticipo, 2); // sacar de planilla anticipos 
                    // =========================================================================================
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

    $scope.generar=function(planilla){
        planilla.$save(function(dato){
            $scope.nuevaPlanillaSueldos();
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
        console.log('los datos  de planilla ', planilla);
    }

    // funcion para convertir las horas en minutos
    function HMToDecimal(hora, minuto) {
        var d1 = hora;
        var m1 = minuto;
        var d = eval(d1);
        var m = eval(m1);

        var dH = Math.abs(d) + (m / 60);
        console.log('en decimal es ', round(dH, 2));
        return round(dH, 2);
        
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
                $scope.totalSueldoBasico=round($scope.totalSueldoBasico+planilla.RecursosHumanosEmpleados[i].sueldoBasico, 2);
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

    $scope.cerrarDialogNuevaPlanillaSueldos=function () {
        $scope.cerrarPopup($scope.idModalNuevaPlanillaSueldos); 
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

    $scope.abrirDialogEditarPlanillaSueldo= function (empleado) {
        $scope.empleado = empleado;
        $scope.sueldo = angular.copy(empleado);
        $scope.abrirPopup($scope.idModalEditarPlanillaSueldo);
    }

    $scope.modificarSueldo= function (sueldo) {
       $scope.empleado = angular.extend($scope.empleado, sueldo);
       $scope.sumarTotales($scope.planilla);
       $scope.cerrarDialogEditarPlanillaSueldo();
    }

    $scope.cerrarDialogEditarPlanillaSueldo=function () {
        $scope.cerrarPopup($scope.idModalEditarPlanillaSueldo);
    }

    $scope.cerrarDialogEliminarSueldoEmpleado = function () {
        $scope.cerrarPopup($scope.idEliminarSueldoEmpleado);
    }

    $scope.abrirDialogEliminarSueldoEmpleado = function ($index, empleado) {
        $scope.empleado = empleado;
        $scope.index = $index;
        $scope.abrirPopup($scope.idEliminarSueldoEmpleado);
    }

    // ========= solucionar eliminar sueldo no sta eliminando correctamente ==================
    $scope.eliminarSueldoEmpleado = function (index, empleado) {
        $scope.planilla.RecursosHumanosEmpleados.splice(index, 1);
        $scope.sumarTotales($scope.planilla);
        $scope.empleado = null;
        $scope.cerrarDialogEliminarSueldoEmpleado();
        $scope.mostrarMensaje("el sueldo se elimino");
    }

    $scope.calcularTotalEditados=function(){
        $scope.sueldo.totalHorasExtras = round(($scope.sueldo.sueldoBasico/30/8*$scope.horasExtras)*2, 2);
        $scope.sueldo.recargoNocturno= Math.round(($scope.sueldo.sueldoBasico/30/8*$scope.sueldo.horasExtras)*1.5);
        $scope.sueldo.totalGanado = $scope.sueldo.sueldoBasico+$scope.sueldo.totalHorasExtras+$scope.sueldo.recargoNocturno+$scope.sueldo.bonoAntiguedad+$scope.sueldo.bonoFrontera+$scope.sueldo.otrosBonos;
        $scope.sueldo.afp = round($scope.sueldo.totalGanado * 12.71/100, 2);
        $scope.sueldo.totalDescuento = $scope.sueldo.afp+$scope.sueldo.rc_iva+$scope.sueldo.anticipos+$scope.sueldo.prestamos;
        $scope.sueldo.liquidoPagable = round($scope.sueldo.totalGanado - $scope.sueldo.totalDescuento, 2);    
    }

    $scope.filtrarListaPlanillaSueldos=function(planilla){
        console.log('cabezera generalllllll ', planilla);
        // $scope.usuario.id_empresa, reporte.gestion, reporte.mes.split("-")[0]
        var promesa = RRHHlistaPlanillaSueldos($scope.usuario.id_empresa, planilla.gestion, planilla.mes);
        promesa.then(function (dato) {
            console.log('empleadossssstt ', dato);
            planilla.planillas = dato.planillas;
            
            blockUI.stop();
        });
    }


    $scope.abrirDialogParametros= function () {
        $scope.abrirPopup($scope.idModalParametros);
    }

    $scope.cerrarDialogParametros=function () {
        $scope.cerrarPopup($scope.idModalParametros); 
    }

    $scope.editarParametros = function (parametro) {
        blockUI.start();
        $scope.parametros = parametro;
        Parametro.update({ idEmpresa: $scope.usuario.id_empresa }, parametro, function (res) {
            console.log('el mensaje es----', res.mensaje);
            $scope.mostrarMensaje(res.mensaje);
        }, function (error) {
            $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
        })
    
        blockUI.stop();
        $scope.cerrarDialogParametros();
    }

    $scope.abrirDialogTR3= function () {
        $scope.abrirPopup($scope.idModalTR3);
    }
    $scope.cerrarDialogTR3=function () {
        $scope.cerrarPopup($scope.idModalTR3); 
    }
    $scope.abrirDialogHistorialTR3= function () {
        $scope.abrirPopup($scope.idModalHistorialTR3);
    }
    $scope.cerrarDialogHistorialTR3=function () {
        $scope.cerrarPopup($scope.idModalHistorialTR3); 
    }

    $scope.obtenerParametros($scope.usuario.id_empresa);

});