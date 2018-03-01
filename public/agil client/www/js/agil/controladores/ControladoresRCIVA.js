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
        Promise.all([ObtenerCambioMoneda(fechaUFVActual), ObtenerCambioMoneda(fechaUFVAnterior)]).then( function(dato) {
            // $scope.ufvs.ufvActual = (data[0].monedaCambio==null)?0:data[0].monedaCambio.ufv; 
            // $scope.ufvs.ufvAnterior =  (data[1].monedaCambio==null)?0:data[1].monedaCambio.ufv; 
            
            $scope.ufvActual = (dato[0].monedaCambio==null)?0:dato[0].monedaCambio.ufv;
            console.log("$scope.ufvActual ==== ", $scope.ufvActual);
            $scope.ufvAnterior = (dato[1].monedaCambio==null)?0:dato[1].monedaCambio.ufv; 
            var msg = 'Venta registrada exitosamente!';

            if ($scope.ufvActual > 0 && $scope.ufvAnterior > 0) {
                var promesa = RecursosHumanosEmpleados($scope.usuario.id_empresa);
                promesa.then(function (dato) {
                    planilla.RecursosHumanosEmpleados = dato.empleados;
                    
                    planilla.RecursosHumanosEmpleados.forEach(function (empleado) {
                        
                        promesa = RecursosHumanosEmpleadosHorasExtras(empleado.id, planilla.gestion, planilla.mes.split("-")[0]);
                        promesa.then(function (dato) {
                            empleado.sueldoBasico = empleado.empleadosFichas[0].haber_basico;
                            $scope.antiguedad = calcAge(empleado.empleadosFichas[0].fecha_inicio); // == sacar años de antiguedad ==================
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

                            empleado.netoImponible = empleado.totalGanado - empleado.afp;
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
        // planilla.totalEmpleados = totalEmpleados;
        // planilla.importeSueldoBasico = $scope.totalSueldoBasico;
        // planilla.totalHorasExtras = $scope.sumaHorasExtras;
        // planilla.importeHorasExtras = $scope.sumaTotalHorasExtras;
        // planilla.importeRecargoNocturno = $scope.sumaRecargoNocturno;
        // planilla.importeBonoAntiguedad = $scope.sumaBonoAntiguedad;
        // planilla.importeBonoFrontera = $scope.sumaBonoFrontera;
        // planilla.importeOtrosBonos = $scope.sumaOtrosBonos;
        // planilla.importeAFP = $scope.sumaAFP;
        // planilla.importeRCIVA = $scope.sumaRCIVA; 
        // planilla.importeAniticipos = $scope.sumaAniticipos;
        // planilla.importePrestamos = $scope.sumaPrestamos;
        // planilla.importeTotalDescuento = $scope.sumaTotalDescuento;
        // planilla.importeTotalGanado = $scope.sumaTotalGanado;    
        // planilla.importeLiquidoPagable = $scope.sumaLiquidoPagable;
        
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