angular.module('agil.controladores')

.controller('ControladorUsuarios', function($scope,$location,$localStorage,$templateCache,$route,blockUI,Usuario,Empresas,Roles,UsuariosEmpresa){
	
	blockUI.start();
	
	$scope.idModalWizardUsuarioEdicion='modal-wizard-usuario';
	$scope.idModalWizardUsuarioVista='modal-wizard-usuario-vista';
	$scope.idModalEliminarUsuario='dialog-eliminar-usuario';
	$scope.idModalContenedorUsuarioEdicion='modal-wizard-container-usuario-edicion';
	$scope.idModalContenedorUsuarioVista='modal-wizard-container-usuario-vista';
	$scope.idImagenUsuario='imagen-persona';
	
	$scope.usuarioSesion=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		$scope.obtenerEmpresas();
		$scope.obtenerRoles();
		$scope.obtenerUsuarios();
		setTimeout(function() {
			ejecutarScriptsTabla('tabla-usuarios',9);
		},2000);
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsUsuario($scope.idModalWizardUsuarioEdicion,
							   $scope.idImagenUsuario,
							   $scope.idModalContenedorUsuarioEdicion,
							   $scope.idModalWizardUsuarioVista,
							   $scope.idModalContenedorUsuarioVista,
							   $scope.idModalEliminarUsuario);
		$scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.crearNuevoUsuario=function(){
		if($scope.usuarioSesion.id_empresa){
			$scope.usuario=new Usuario({persona:{imagen:"img/icon-user-default.png"},sucursales:[],id_empresa:$scope.usuarioSesion.id_empresa});
			$scope.sucursales=$scope.usuarioSesion.empresa.sucursales;
		}else{
			$scope.usuario=new Usuario({persona:{imagen:"img/icon-user-default.png"},sucursales:[]});
			$scope.sucursales=[];
		}
		$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
	}
	
	$scope.verUsuario=function(usuario){
		$scope.usuario=usuario;
		$scope.rol=usuario.rolesUsuario[0].rol;
		$scope.usuario.sucursales=[];
		$scope.sucursales=usuario.empresa.sucursales;
		for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
			$scope.usuario.sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
		}
		$scope.abrirPopup($scope.idModalWizardUsuarioVista);
	}
	
	$scope.modificarUsuario=function(usuario){
		$scope.usuario=usuario;
		$scope.rol=usuario.rolesUsuario[0].rol;
		$scope.usuario.sucursales=[];
		$scope.sucursales=usuario.empresa.sucursales;
		for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
			$scope.usuario.sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
		}
		$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
	}
	
	$scope.cerrarPopPupNuevo=function(){
		$scope.cerrarPopup($scope.idModalWizardUsuarioEdicion);
	}
	
	$scope.cerrarPopPupVista=function(){
		$scope.cerrarPopup($scope.idModalWizardUsuarioVista);
	}
	
	$scope.mostrarConfirmacionEliminacion=function(usuario){
		$scope.usuario=new Usuario(usuario);
		$scope.abrirPopup($scope.idModalEliminarUsuario);
	}
	
	$scope.cerrarConfirmacionEliminacion=function(){
		$scope.cerrarPopup($scope.idModalEliminarUsuario);
	};
	
	$scope.eliminarUsuario=function(usuario){
		blockUI.start();
		$scope.cerrarConfirmacionEliminacion();
		usuario.$delete();
		$scope.mostrarMensaje('Eliminado exitosamente!');
		$scope.recargarItemsTabla();
		blockUI.stop();
	}
	
	$scope.buscarSucursales=function(idEmpresa){
		var empresas=$.grep($scope.empresas, function(e){return e.id == idEmpresa;});
		$scope.sucursales=empresas[0].sucursales;
	}
	
	$scope.buscarRol=function(idRol){
		var roles=$.grep($scope.roles, function(e){return e.id == idRol;});
		$scope.rol=roles[0];
		$scope.usuario.aplicacionesUsuario=[];
		for(var i=0;i<$scope.rol.aplicacionesRol.length;i++){
			$scope.usuario.aplicacionesUsuario.push({id_aplicacion:$scope.rol.aplicacionesRol[i].aplicacion.id,
													 aplicacion:$scope.rol.aplicacionesRol[i].aplicacion,
													 puede_crear:true,
													 puede_ver:true,
													 puede_modificar:true,
													 puede_eliminar:true});
		}
	}
	
	$scope.saveForm=function(usuario){
		var button=$('#siguiente').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			if(usuario.id){
				Usuario.update({ id_usuario:usuario.id }, usuario,function(res){
					blockUI.stop();
					$scope.cerrarPopPupNuevo();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.recargarItemsTabla();
				});
			}else{
				usuario.$save(function(student){
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
	
	$scope.obtenerEmpresas=function(){
		blockUI.start();
		var promesa=Empresas();
		promesa.then(function(empresas){
			$scope.empresas=empresas;
			blockUI.stop();
		});
	}
	
	$scope.obtenerRoles=function(){
		blockUI.start();
		var promesa=Roles();
		promesa.then(function(roles){
			$scope.roles=roles;
			blockUI.stop();
		});
	}
	
	$scope.obtenerUsuarios=function(){
		blockUI.start();
		var promesa=UsuariosEmpresa($scope.usuarioSesion.id_empresa);
		promesa.then(function(usuarios){
			$scope.usuarios=usuarios;
			blockUI.stop();
		});
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalWizardUsuarioEdicion);
	   $scope.eliminarPopup($scope.idModalWizardUsuarioVista);
	   $scope.eliminarPopup($scope.idModalEliminarUsuario);
	});
	
	$scope.inicio();
});



