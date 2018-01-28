angular.module('agil.controladores')

.controller('ControladorPlanillaSueldos', function($scope,$localStorage,$location,$templateCache,$route,blockUI, Parametro, Parametros, RecursosHumanosEmpleados, ClasesTipo){
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

    

    $scope.abrirDialogNuevaPlanillaSueldos= function () {
        $scope.abrirPopup($scope.idModalNuevaPlanillaSueldos);
        var promesa = RecursosHumanosEmpleados();
        promesa.then(function (dato) {
            $scope.RecursosHumanosEmpleados = dato.empleados;
            // $scope.RecursosHumanosEmpleados.fecha_nacimiento_texto = $scope.fechaATexto($scope.RecursosHumanosEmpleados.persona.fecha_nacimiento);

            $scope.RecursosHumanosEmpleados.forEach(function (empleado) {
                empleado.sueldoBasico = empleado.empleadosFichas[0].haber_basico;
                $scope.horasExtras = 8; // == sacar horas extras ==================
                $scope.antiguedad = calcAge(empleado.empleadosFichas[0].fecha_inicio); // == sacar años de antiguedad ==================
                $scope.bonoFrontera = 0; // == sacar bono frontera ==================
                $scope.otrosBonos = 0; // == sacar otros bonos ==================
                empleado.horasExtras = $scope.horasExtras;
                empleado.totalHorasExtras = round((empleado.sueldoBasico/30/8*$scope.horasExtras)*2, 2);
                empleado.recargoNocturno= round((empleado.sueldoBasico/30/8*$scope.horasExtras)*1.5, 2);
                empleado.bonoAntiguedad = $scope.calcularBonoAntiguedad($scope.antiguedad);
                empleado.bonoFrontera = $scope.bonoFrontera;
                empleado.otrosBonos = $scope.otrosBonos;
                empleado.totalGanado = empleado.sueldoBasico+empleado.totalHorasExtras+empleado.recargoNocturno+empleado.bonoAntiguedad+empleado.bonoFrontera+empleado.otrosBonos;
                empleado.afp = round(empleado.totalGanado * 12.71/100, 2);
                empleado.rc_iva = 0; // sacar de planilla rc-iva
                empleado.anticipos = 0; // sacar de planilla anticipos 
                empleado.prestamos = 0; // sacar de recursos humanos 
                empleado.totalDescuento = empleado.afp+empleado.rc_iva+empleado.anticipos+empleado.prestamos;
                empleado.liquidoPagable = round(empleado.totalGanado - empleado.totalDescuento, 2);

            });
            console.log('empleadosssss ', $scope.RecursosHumanosEmpleados);
            $scope.sumarTotales();
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

    $scope.sumarTotales=function(){
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
        for(var i=0;i<$scope.RecursosHumanosEmpleados.length;i++){
            $scope.totalSueldoBasico=$scope.totalSueldoBasico+$scope.RecursosHumanosEmpleados[i].sueldoBasico;
            $scope.sumaHorasExtras=$scope.sumaHorasExtras+$scope.RecursosHumanosEmpleados[i].horasExtras;
            $scope.sumaTotalHorasExtras=$scope.sumaTotalHorasExtras+$scope.RecursosHumanosEmpleados[i].totalHorasExtras;
            $scope.sumaRecargoNocturno=$scope.sumaRecargoNocturno+$scope.RecursosHumanosEmpleados[i].recargoNocturno;
            $scope.sumaBonoAntiguedad=$scope.sumaBonoAntiguedad+$scope.RecursosHumanosEmpleados[i].bonoAntiguedad;
            $scope.sumaBonoFrontera=$scope.sumaBonoFrontera+$scope.RecursosHumanosEmpleados[i].bonoFrontera;
            $scope.sumaOtrosBonos=$scope.sumaOtrosBonos+$scope.RecursosHumanosEmpleados[i].otrosBonos;
            $scope.sumaTotalGanado=round($scope.sumaTotalGanado+$scope.RecursosHumanosEmpleados[i].totalGanado, 2);
            $scope.sumaAFP=round($scope.sumaAFP+$scope.RecursosHumanosEmpleados[i].afp, 2);
            $scope.sumaRCIVA=round($scope.sumaRCIVA+$scope.RecursosHumanosEmpleados[i].rc_iva, 2);
            $scope.sumaAniticipos=round($scope.sumaAniticipos+$scope.RecursosHumanosEmpleados[i].anticipos, 2);
            $scope.sumaPrestamos=round($scope.sumaPrestamos+$scope.RecursosHumanosEmpleados[i].prestamos, 2);
            $scope.sumaTotalDescuento=round($scope.sumaTotalDescuento+$scope.RecursosHumanosEmpleados[i].totalDescuento, 2);
            $scope.sumaLiquidoPagable=round($scope.sumaLiquidoPagable+$scope.RecursosHumanosEmpleados[i].liquidoPagable, 2);
        }       
        
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
       $scope.sumarTotales();
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
        $scope.RecursosHumanosEmpleados.splice(index, 1);
        $scope.sumarTotales();
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