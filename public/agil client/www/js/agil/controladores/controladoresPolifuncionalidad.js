angular.module('agil.controladores')
     .controller('controladorPolifuncionalidad', function($scope,$location,$localStorage,$templateCache,$route,blockUI,FieldViewer,$filter,ClasesTipo){
        
        blockUI.start();
        
        $scope.usuarioSesion=JSON.parse($localStorage.usuario);
        $scope.idModalWizardPolifuncionalEdicion='modal-wizard-polifuncional-edicion';
        $scope.idModalContenedorPolifuncionalEdicion='modal-wizard-container-polifuncional-edicion';
        $scope.idModalWizardConceptoEdicion2='modal-wizard-polifuncional-ac-edicion';
        $scope.idModalContenedorConceptoEdicion2='modal-wizard-container-polifuncional-ac-edicion';
        $scope.modalBusquedaPersonal = 'dialog-Busqueda-personal-polifuncional'
        $scope.idModalReportes = 'dialog-reportes-polifuncional'

        $scope.inicio=function(){
            $scope.obtenerCargos()
            $scope.obtenerCentroCosto()
        }
        
        $scope.$on('$viewContentLoaded', function(){
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsPolifuncionalidad($scope.idModalWizardPolifuncionalEdicion,$scope.idModalContenedorPolifuncionalEdicion,$scope.modalBusquedaPersonal,
                $scope.idModalWizardConceptoEdicion2,$scope.idModalContenedorConceptoEdicion2,$scope.idModalReportes);
            $scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario,$location.path().substring(1));
            $scope.obtenerColumnasAplicacion()
            blockUI.stop();
        });
        
        $scope.generarExcelEstadoCuentasProveedor = function (proveedor) {
			var data = [["", "", "ESTADO CUENTAS PROVEEDOR"], ["Deudor :" + proveedor.razon_social], ["Fecha", "N Recibo", "Descripción", "monto", "total", "total General"]]
			var totalCosto = 0;
			for (var i = 0; i < proveedor.compras.length; i++) {
				var columns = [];
				totalCosto = totalCosto + proveedor.compras[i].saldo;
				proveedor.compras[i].fecha = new Date(proveedor.compras[i].fecha);
				columns.push(proveedor.compras[i].fecha.getDate() + "/" + (proveedor.compras[i].fecha.getMonth() + 1) + "/" + proveedor.compras[i].fecha.getFullYear());
				columns.push(proveedor.compras[i].id_movimiento);
				if (proveedor.compras[i].factura == null) {
					columns.push('PROFORMA');
				} else {
					columns.push('factura : ' + proveedor.compras[i].factura);
				}
				columns.push(proveedor.compras[i].saldo);
				columns.push(totalCosto);
				columns.push(totalCosto);
				data.push(columns);
			}

			var ws_name = "SheetJS";
			var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
			/* add worksheet to workbook */
			wb.SheetNames.push(ws_name);
			wb.Sheets[ws_name] = ws;
			var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
			saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "REPORTE-ESTADO-CUENTA-PROVEEDOR.xlsx");
			blockUI.stop();

		}

        $scope.obtenerColumnasAplicacion = function () {
            blockUI.start();
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuario.id_empresa,
                configuracion: {
                    anio: { value: "Año", show: true },
                    mes: { value: "Mes", show: true },
                    estado: { value: "Estado", show: true },
                    codigo: { value: "Código", show: true },
                    nombre: { value: "Nombre completo", show: true },
                    campo: { value: "Campo", show: true },
                    cargo: { value: "Cargo", show: true },
                    asis_capacitacion: { value: "Asistencia Capacitación", show: true },
                    doc_actualizados: { value: "Documentos Actualizados", show: true },
                    trab_equipo: { value: "Trabajo en equipo", show: true },
                    funciones_puntualidad: { value: "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo", show: true },
                    higiene: { value: "Higiene personal", show: true },
                    puntualidad_asistencia_campo: { value: "Puntualidad a la asistencia de reunión de 5 minutos en campo", show: true },
                    ingreso_campo: { value: "Cumplimiento de ingreso a campo", show: true },
                    llenado_correcto_sig: { value: "Aplicación y llenado correcto de los formularios del SIG", show: true },
                    nota_total: { value: "Nota total", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
            blockUI.stop();
        }

        $scope.obtenerCargos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_CARGO");
            promesa.then(function (entidad) {
                $scope.cargos = entidad.clases
                blockUI.stop();
            }, function (err) {
                $scope.mostrarMensaje('Se produjo un error : ' + err.message !== undefined ? err.message : err.data)
                blockUI.stop();
            })
        }

        $scope.obtenerCentroCosto = function () {
            blockUI.start();
            var promesa = ClasesTipo('CENCOS')
            promesa.then(function (dato) {
                $scope.centrosCostos = dato.clases
                blockUI.stop();
            }, function (err) {
                $scope.mostrarMensaje('Se produjo un error : ' + err.message !== undefined ? err.message : err.data)
                blockUI.stop();
            })
        }

        $scope.filtrarPersonal = function (query) {
            $scope.personalProcesado = $filter('filter')($scope.clientes, query);
        }

        $scope.establecerPersonal = function (personal, modal) {
            $scope.evaluacion.personal = personal
            if (modal !== undefined) {
                $scope.cerrarmodalBusquedaPersonal()
            }
        }

        $scope.abriridModalReportes=function(){
            $scope.abrirPopup($scope.idModalReportes);
        }
        
        $scope.cerraridModalReportes=function(){
            $scope.cerrarPopup($scope.idModalReportes);
        }

        $scope.abrirNuevoEvaluacionPolifuncional=function(){
            $scope.abrirPopup($scope.idModalWizardPolifuncionalEdicion);
        }
        
        $scope.cerrarPopPupNuevoPolifuncional=function(){
            $scope.cerrarPopup($scope.idModalWizardPolifuncionalEdicion);
        }
    
        $scope.abrirmodalParametrosPolifuncionalidad=function(){
            $scope.abrirPopup($scope.idModalWizardConceptoEdicion2);
        }
        
        $scope.cerrarmodalParametrosPolifuncionalidad=function(){
            $scope.cerrarPopup($scope.idModalWizardConceptoEdicion2);
        }

        $scope.abrirmodalBusquedaPersonal = function () {
            $scope.abrirPopup($scope.modalBusquedaPersonal);
        }

        $scope.cerrarmodalBusquedaPersonal = function () {
            $scope.cerrarPopup($scope.modalBusquedaPersonal);
        }

        $scope.saveForm=function(tipo){
            var button=$('#siguiente').text().trim();
            if(button!="Siguiente"){
                
            }
        }

        $scope.saveForm2=function(tipo){
            var button=$('#siguiente-f').text().trim();
            if(button!="Siguiente"){
                
            }
        }
        $scope.$on('$routeChangeStart', function(next, current) { 
           $scope.eliminarPopup($scope.idModalWizardPolifuncionalEdicion);
           $scope.eliminarPopup($scope.idModalWizardConceptoEdicion2);
           $scope.eliminarPopup($scope.idModalReportes);
        });
    
        $scope.inicio();
    });
    
    
    
    /*function ($scope, $localStorage, ClasesTipo,$templateCache, blockUI, FieldViewer, $location, $filter) {

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.modalNuevaEvaluacion = 'modal-Nuevo-Polifuncionalidad'
        $scope.modalNuevaEvaluacionWizard = 'modal-wizard-panel-container-evaluacion'
        $scope.modalBusquedaPersonal = 'dialog-Busqueda-personal-polifuncional'
        $scope.modalParametrosPolifuncionalidad = 'modal-Parametros-Polifuncionalidad'
        $scope.modalParametrosPolifuncionalidadWizard = 'modal-wizard-panel-container-parametros'

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsPolifuncionalidad($scope.modalNuevaEvaluacion, $scope.modalNuevaEvaluacionWizard, $scope.modalBusquedaPersonal, $scope.modalParametrosPolifuncionalidad, $scope.modalParametrosPolifuncionalidadWizard);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion()
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.modalNuevaEvaluacion);
            $scope.eliminarPopup($scope.modalBusquedaPersonal);
            $scope.eliminarPopup($scope.modalParametrosPolifuncionalidad);
        })

        

        $scope.inicio = function () {
            $scope.obtenerCentroCosto()
            $scope.obtenerCargos()
            $scope.evaluacion = {}
        }

        $scope.sinFuncionalidad = function () {
            $scope.mostrarMensaje('sin Funcionalidad')
        }

        $scope.guardarEvaluacion = function (valid, evaluacion) {
            var button = $('#siguiente').text().trim();
            if (button != "Siguiente") {  }

        }

        $scope.obtenerColumnasAplicacion = function () {
            blockUI.start();
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuario.id_empresa,
                configuracion: {
                    anio: { value: "Año", show: true },
                    mes: { value: "Mes", show: true },
                    estado: { value: "Estado", show: true },
                    codigo: { value: "Código", show: true },
                    nombre: { value: "Nombre completo", show: true },
                    campo: { value: "Campo", show: true },
                    cargo: { value: "Cargo", show: true },
                    asis_capacitacion: { value: "Asistencia Capacitación", show: true },
                    doc_actualizados: { value: "Documentos Actualizados", show: true },
                    trab_equipo: { value: "Trabajo en equipo", show: true },
                    funciones_puntualidad: { value: "Cumplimiento de las funciones asignadas y puntualidad en el horario de trabajo", show: true },
                    higiene: { value: "Higiene personal", show: true },
                    puntualidad_asistencia_campo: { value: "Puntualidad a la asistencia de reunión de 5 minutos en campo", show: true },
                    ingreso_campo: { value: "Cumplimiento de ingreso a campo", show: true },
                    llenado_correcto_sig: { value: "Aplicación y llenado correcto de los formularios del SIG", show: true },
                    nota_total: { value: "Nota total", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
            blockUI.stop();
        }

        $scope.obtenerCargos = function () {
            blockUI.start();
            var promesa = ClasesTipo("RRHH_CARGO");
            promesa.then(function (entidad) {
                $scope.cargos = entidad.clases
                blockUI.stop();
            }, function (err) {
                $scope.mostrarMensaje('Se produjo un error : ' + err.message !== undefined ? err.message : err.data)
                blockUI.stop();
            })
        }

        $scope.obtenerCentroCosto = function () {
            blockUI.start();
            var promesa = ClasesTipo('CENCOS')
            promesa.then(function (dato) {
                $scope.centrosCostos = dato.clases
                blockUI.stop();
            }, function (err) {
                $scope.mostrarMensaje('Se produjo un error : ' + err.message !== undefined ? err.message : err.data)
                blockUI.stop();
            })
        }

        $scope.filtrarPersonal = function (query) {
            $scope.personalProcesado = $filter('filter')($scope.clientes, query);
        }

        $scope.establecerPersonal = function (personal, modal) {
            $scope.evaluacion.personal = personal
            if (modal !== undefined) {
                $scope.cerrarmodalBusquedaPersonal()
            }
        }

        $scope.abrirModalNuevaEvaluacion = function () {
            $scope.abrirPopup($scope.modalNuevaEvaluacion);
        }

        $scope.cerrarModalNuevaEvaluacion = function () {
            $scope.cerrarPopup($scope.modalNuevaEvaluacion);
        }

        $scope.abrirmodalBusquedaPersonal = function () {
            $scope.abrirPopup($scope.modalBusquedaPersonal);
        }

        $scope.cerrarmodalBusquedaPersonal = function () {
            $scope.cerrarPopup($scope.modalBusquedaPersonal);
        }

        $scope.abrirmodalParametrosPolifuncionalidad = function () {
            $scope.abrirPopup($scope.modalParametrosPolifuncionalidad);
        }

        $scope.cerrarmodalParametrosPolifuncionalidad = function () {
            $scope.cerrarPopup($scope.modalParametrosPolifuncionalidad);
        }

        $scope.inicio()
    })*/