angular.module('agil.controladores')

.controller('ControladorCodigoControl', function($scope,$localStorage,$location,$templateCache,$route,blockUI,CodigoControl){
	blockUI.start();
	
	$scope.usuario=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		$scope.descargarPruebasExcel=restServer+'/downloadReport/PRUEBAS-CODIGO-CONTROL.xlsx'
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		$scope.buscarAplicacion($scope.usuario.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.subirExcelPruebasDosificaciones=function(event){
		var files = event.target.files;
		var i,f;
		for (i = 0, f = files[i]; i != files.length; ++i) {
			var reader = new FileReader();
			var name = f.name;
			reader.onload = function(e) {
				blockUI.start();
			  var data = e.target.result;

			  var workbook = XLSX.read(data, {type: 'binary'});
				var first_sheet_name = workbook.SheetNames[0];
				var row=2,i=0;
				var worksheet = workbook.Sheets[first_sheet_name];
				var pruebas=[];
				do {
					var prueba={};
					prueba.autorizacion=worksheet['B'+row]!=undefined && worksheet['B'+row]!=""?worksheet['B'+row].v.toString():null;
					prueba.factura=worksheet['C'+row]!=undefined && worksheet['C'+row]!=""?worksheet['C'+row].v.toString():null;
					prueba.nit=worksheet['D'+row]!=undefined && worksheet['D'+row]!=""?worksheet['D'+row].v.toString():null;
					prueba.fecha=worksheet['E'+row]!=undefined && worksheet['E'+row]!=""?$scope.formatearFecha(worksheet['E'+row].v.toString()):null;
					prueba.monto=worksheet['F'+row]!=undefined && worksheet['F'+row]!=""?worksheet['F'+row].v.toString():null;
					prueba.llave_digital=worksheet['G'+row]!=undefined && worksheet['G'+row]!=""?worksheet['G'+row].v.toString():null;
					prueba.codigo_control_esperado=worksheet['H'+row]!=undefined && worksheet['H'+row]!=""?worksheet['H'+row].v.toString():null;
					pruebas.push(prueba);
					row++;	
					i++;				
				} while (worksheet['A'+row]!=undefined);
				$scope.generarPruebas(pruebas);
				blockUI.stop();
			};
			reader.readAsBinaryString(f);
	    }  
	}
	
	$scope.formatearFecha=function(fecha){
		var fechaArreglo=fecha.split('/');
		var fechaFormateada=fechaArreglo[0]+fechaArreglo[1]+fechaArreglo[2];
		return fechaFormateada;
	}
	
	$scope.generarPruebas=function(pruebas){
		var pruebas=new CodigoControl({pruebas:pruebas});
		pruebas.$save(function(e){
			$scope.pruebasCodigoControl=e.resultados;
			$scope.aplicarTabla('tabla-pruebas-codigo-control',8);
			blockUI.stop();
			$scope.mostrarMensaje('Pruebas generadas Exitosamente!');
		},function(error) {
			blockUI.stop();
			$scope.mostrarMensaje('Ocurrio un problema al momento de generar las pruebas!');
		});
	}
	
	$scope.inicio();
	
});



