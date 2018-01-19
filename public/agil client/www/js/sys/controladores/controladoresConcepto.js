angular.module('agil.controladores')

.controller('ControladorConceptos', function($scope,$location,$localStorage,$templateCache,$route,blockUI,Tipos,TiposEmpresa,ListaTiposEmpresa,Sucursales){
	
	blockUI.start();
	
	$scope.usuarioSesion=JSON.parse($localStorage.usuario);
	$scope.idModalWizardConceptoEdicion='modal-wizard-concepto-edicion';
	$scope.idModalContenedorConceptoEdicion='modal-wizard-container-concepto-edicion';
	
	
	$scope.inicio=function(){
		$scope.obtenerTipos();
		
		setTimeout(function() {
			ejecutarScriptsTabla('tabla-conceptos',2);
		},2000);
	}
	
	$scope.obtenerTipos=function(){
		blockUI.start();
		var idEmpresa=$scope.usuarioSesion.id_empresa?$scope.usuarioSesion.id_empresa:0;
		var promesa=ListaTiposEmpresa(idEmpresa);
		promesa.then(function(tipos){
			$scope.tipos=tipos;
			blockUI.stop();
		});
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsConcepto($scope.idModalWizardConceptoEdicion,$scope.idModalContenedorConceptoEdicion);
		//$scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.crearNuevoConcepto=function(){
		$scope.tipo=new TiposEmpresa({clases:[]});
		$scope.abrirPopup($scope.idModalWizardConceptoEdicion);
	}
	
	$scope.cerrarPopPupNuevo=function(){
		$scope.cerrarPopup($scope.idModalWizardConceptoEdicion);
	}
	
	$scope.agregarClase=function(clase){
		if(clase.nombre && clase.nombre_corto){
			if(!clase.id){
				$scope.tipo.clases.push(clase);
			}
			$scope.clase={}
		}
	}
	$scope.editarClase=function (clase) {
		clase.edit=false
		$scope.clase={}
	}
	$scope.modificarClase=function(clase){
		$scope.clase=clase;
		$scope.clase.edit=true
	}
	
	$scope.removerClase=function(clase){
		clase.eliminado=true;
	}
	
	$scope.modificarConcepto=function(tipo){
		$scope.tipo=tipo;
		$scope.abrirPopup($scope.idModalWizardConceptoEdicion);
	}
	
	$scope.saveForm=function(tipo){
		var button=$('#siguiente').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			if($scope.usuario.id_empresa){
				tipo.id_empresa=$scope.usuario.id_empresa
			}
			if(tipo.id){
				Tipos.update({ id_tipo:tipo.id }, tipo,function(res){
					blockUI.stop();
					$scope.cerrarPopPupNuevo();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.recargarItemsTabla();
				});
			}else{
				tipo.$save(function(tipo){
					blockUI.stop();
					$scope.cerrarPopPupNuevo();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.recargarItemsTabla();
				},function(error) {
					blockUI.stop();
					$scope.cerrarPopPupNuevo();
					$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
					$scope.recargarItemsTabla();
				});
			}
		}
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalWizardConceptoEdicion);
	});
	$scope.importarSucursales=function (clases) {
		var promesa = Sucursales($scope.usuario.id_empresa)
		promesa.then(function (dato) {
			$scope.sucursales=dato
			/* $scope.sucursales.forEach(function(sucursal,index,array){
				
			}); */
			var encontrado=false
			for (let i = 0; i < dato.length; i++) {
				var element = dato[i];
				for (let j = 0; j < clases.length; j++) {
					var element2 = clases[j];
					if(element.nombre==element2.nombre){
						encontrado=true;
					}

				}
				if(!encontrado){
					var clase={nombre:element.nombre,nombre_corto:element.nombre}
					clases.push(clase)
				}
			}
		})
	}
	$scope.inicio();
});



