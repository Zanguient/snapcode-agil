angular.module('agil.controladores')

.controller('ControladorUsuarios', function($scope,$location,$window,$localStorage,$templateCache,$route,blockUI,Usuario,Empresas,Roles,$timeout,
											UsuariosEmpresa,Rutas,UsuarioRutas,UsuarioComision,UsuarioComisiones,Sucursales,UsuariosEmpresaPaginador,validarUsuario,Paginator){
	
	$scope.idModalWizardUsuarioEdicion='modal-wizard-usuario';
	$scope.idModalWizardUsuarioVista='modal-wizard-usuario-vista';
	$scope.idModalEliminarUsuario='dialog-eliminar-usuario';
	$scope.idModalContenedorUsuarioEdicion='modal-wizard-container-usuario-edicion';
	$scope.idModalContenedorUsuarioVista='modal-wizard-container-usuario-vista';
	$scope.idImagenUsuario='imagen-persona';
	$scope.idModalWizardUsuarioRutas='modal-wizard-usuario-rutas';
	$scope.idModalContenedorUsuarioRutas='modal-wizard-container-usuario-rutas';
	$scope.idModalWizardUsuarioComisiones='modal-wizard-usuario-comisiones';
	$scope.idModalContenedorUsuarioComisiones='modal-wizard-container-usuario-comisiones';
	
	$scope.usuarioSesion=JSON.parse($localStorage.usuario);
	
	$scope.inicio=function(){
		
		$scope.obtenerEmpresas();
		$scope.obtenerRoles();
		$scope.obtenerUsuarios();
		if($scope.usuarioSesion.empresa){
			$scope.obtenerRutas();
		}
		var sucursales=($scope.usuarioSesion.empresa)?$scope.usuarioSesion.empresa.sucursales:[];
		$scope.llenarSucursales(sucursales);
		/* setTimeout(function() {
			ejecutarScriptsTabla('tabla-usuarios',9);
		},2000); */
	}
	
	$scope.$on('$viewContentLoaded', function(){
		resaltarPestaña($location.path().substring(1));
		ejecutarScriptsUsuario($scope.idModalWizardUsuarioEdicion,
							   $scope.idImagenUsuario,
							   $scope.idModalContenedorUsuarioEdicion,
							   $scope.idModalWizardUsuarioVista,
							   $scope.idModalContenedorUsuarioVista,
							   $scope.idModalEliminarUsuario,
							   $scope.idModalWizardUsuarioRutas,
							   $scope.idModalContenedorUsuarioRutas,
							   $scope.idModalWizardUsuarioComisiones,
							   $scope.idModalContenedorUsuarioComisiones);
		$scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario,$location.path().substring(1));
		blockUI.stop();
	});
	
	$scope.crearNuevoUsuario=function(){
		if($scope.usuarioSesion.id_empresa){
			$scope.usuario=new Usuario({persona:{imagen:"img/icon-user-default.png"},sucursales:[],id_empresa:$scope.usuarioSesion.id_empresa});
			//$scope.sucursales=$scope.usuarioSesion.empresa.sucursales;
			$scope.seleccionarSucursales([]);
		}else{
			$scope.usuario=new Usuario({persona:{imagen:"img/icon-user-default.png"},sucursales:[]});
			$scope.sucursales=[];
		}
		$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
	}
	
	$scope.verUsuario=function(usuario){
		console.log(usuario);
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
		//$scope.sucursales=usuario.empresa.sucursales;
		for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
			$scope.usuario.sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
		}
		var sucursales;
		if($scope.usuarioSesion.empresa){
			sucursales=$scope.usuarioSesion.empresa.sucursales;
			$scope.llenarSucursales(sucursales);
			$scope.seleccionarSucursales($scope.usuario.sucursales);
			$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
		}else{
			var promesa=Sucursales(usuario.id_empresa);
			promesa.then(function(datos){
				sucursales=datos;
				$scope.llenarSucursales(sucursales);
				$scope.seleccionarSucursales($scope.usuario.sucursales);
				$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
			});
		}
	}

	$scope.validarUsuario = function(usuarioNombre) {
		var nombre= usuarioNombre;
		if(nombre!=''){
			$timeout(function(){
			$scope.validar = new validarUsuario();
		
			$scope.validar.nombre_usuario=usuarioNombre;
		
			$scope.validar.$save(function(data){
			$scope.data=data;
			})
		},1500);
		}		
	};

	$scope.seleccionarSucursales=function(sucursalesUsuario){
		for(var i=0;i<$scope.sucursales.length;i++){
			for(var j=0;j<sucursalesUsuario.length;j++){
				if($scope.sucursales[i].id==sucursalesUsuario[j].id){
					$scope.sucursales[i].ticked=true;
				}
			}			
		}
	}
	
	$scope.llenarSucursales=function(datosSucursales){
		$scope.sucursales=[];
		for(var i=0;i<datosSucursales.length;i++){
			var sucursal={
				name:datosSucursales[i].nombre,
				maker: "",
				ticked:false,
				id:datosSucursales[i].id
			}
			$scope.sucursales.push(sucursal);
		}
	}
	
	$scope.cerrarPopPupNuevo=function(){
		$scope.cerrarPopup($scope.idModalWizardUsuarioEdicion);
	}
	
	$scope.cerrarPopPupVista=function(){
		$scope.cerrarPopup($scope.idModalWizardUsuarioVista);
	}
	
	$scope.cerrarPopPupRutas=function(){
		$scope.cerrarPopup($scope.idModalWizardUsuarioRutas);
	}
	
	$scope.cerrarPopPupComisiones=function(){
		$scope.cerrarPopup($scope.idModalWizardUsuarioComisiones);
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
		var promesa=Sucursales(idEmpresa);
		promesa.then(function(datos){
			sucursales=datos;
			$scope.llenarSucursales(sucursales);
			$scope.seleccionarSucursales($scope.usuario.sucursales);
			
		});
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
	
	$scope.modificarRutas=function(usuario){
		$scope.usuario=usuario;
		$scope.abrirPopup($scope.idModalWizardUsuarioRutas);
	}
	
	$scope.asignarRutaUsuario=function(ruta){
		var rutaUsuario={nuevo:true,id_usuario:$scope.usuario.id,id_ruta:ruta.id,activo:true,usuario:{nombre_usuario:$scope.usuario.nombre_usuario},ruta:{nombre:ruta.nombre}};
		if(ruta.elegida){
			ruta.usuarios.push(rutaUsuario);
			$scope.usuario.rutas.push(rutaUsuario);
		}else{
			ruta.usuarios.splice(ruta.usuarios.indexOf(rutaUsuario),1);
			$scope.usuario.rutas.splice(ruta.usuarios.indexOf(rutaUsuario),1);
		}
	}
	
	$scope.guardarRutas=function(usuario){
		var button=$('#siguiente-rutas').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			UsuarioRutas.update({ id_usuario:usuario.id }, usuario,function(res){
				blockUI.stop();
				$scope.cerrarPopPupRutas();
				$scope.mostrarMensaje('Guardado Exitosamente!');
				$scope.recargarItemsTabla();
			});
		}
	}	
	
	$scope.veirificarUsuarioRuta=function(ruta,usuario){
		var i=0,encontrado=false;
		while(i<ruta.usuarios.length && !encontrado){
			if(ruta.usuarios[i].usuario.nombre_usuario==usuario.nombre_usuario){
				encontrado=true;
			}
			i++;
		}
		return encontrado;
	}
	
	$scope.existenNuevosUsuariosRuta=function(ruta,usuario){
		var i=0,encontrado=false;
		while(i<ruta.usuarios.length && !encontrado){
			if(ruta.usuarios[i].nuevo){
				encontrado=true;
			}
			i++;
		}
		return encontrado;
	}
	
	$scope.modificarComisiones=function(usuario){
		$scope.usuario=usuario;
		var promise=UsuarioComisiones(usuario.id,$scope.usuarioSesion.id_empresa);
		promise.then(function(productos){
			$scope.productos=productos;
			$scope.abrirPopup($scope.idModalWizardUsuarioComisiones);
		});
	}
	
	$scope.guardarComisiones=function(usuario){
		var button=$('#siguiente-comisiones').text().trim();
		if(button!="Siguiente"){
			blockUI.start();
			usuario.productos=$scope.productos;
			UsuarioComision.update({ id_usuario:usuario.id,id_empresa:$scope.usuarioSesion.id_empresa }, usuario,function(res){
				blockUI.stop();
				$scope.cerrarPopPupComisiones();
				$scope.mostrarMensaje('Guardado Exitosamente!');
				$scope.recargarItemsTabla();
			});
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
	
	/*$scope.obtenerUsuarios=function(){
		$scope.abs = $window.Math.abs;
		$scope.itemsPorPagina=10;
		$scope.buscarUsuarios(1,$scope.itemsPorPagina,"");
	}
	
	$scope.verificarPulso=function(evento,textoBusqueda){
		if(evento.keyCode===13){ //enter pressed
		   $scope.buscarUsuarios(1,$scope.itemsPorPagina,textoBusqueda);
	   }
	}
	
	$scope.buscarUsuarios=function(pagina,itemsPagina,texto){
		blockUI.start();
		$scope.itemsPorPagina=itemsPagina;
		if(texto=="" || texto==null){
			texto=0;
		}else{
			$scope.textoBusqueda=texto;
		}
		$scope.paginaActual=pagina;
		var promesa=UsuariosEmpresaPaginador($scope.usuarioSesion.id_empresa,pagina,itemsPagina,texto);
		promesa.then(function(dato){
			$scope.paginas=[];
			for(var i=1;i<=dato.paginas;i++){
				$scope.paginas.push(i);
			}
			$scope.usuarios=dato.usuarios;
			blockUI.stop();
		});
	}*/

	$scope.obtenerUsuarios = function () {
		blockUI.start();
		$scope.paginator = Paginator();
		$scope.paginator.column = "id";
		$scope.paginator.direccion = "asc";
		$scope.filtro = { empresa: $scope.usuarioSesion.id_empresa};
		$scope.paginator.callBack = $scope.buscarUsuarios;
		$scope.paginator.getSearch("", $scope.filtro, null);
		blockUI.stop();

	}

	$scope.buscarUsuarios = function () {
		blockUI.start();
		var promesa = UsuariosEmpresaPaginador($scope.paginator);
		promesa.then(function (dato) {
			$scope.usuarios=dato.usuarios;
			console.log(dato.usuarios)
			$scope.paginator.setPages(dato.paginas);
			blockUI.stop();
		});
	}
	/* $scope.obtenerUsuarios=function(){
		blockUI.start();
		var promesa=UsuariosEmpresa($scope.usuarioSesion.id_empresa);
		promesa.then(function(usuarios){
			$scope.usuarios=usuarios;
			blockUI.stop();
		});
	}
	 */
	$scope.obtenerRutas=function(){
		blockUI.start();
		var promesa=Rutas($scope.usuarioSesion.id_empresa);
		promesa.then(function(rutas){
			$scope.rutas=rutas;
			blockUI.stop();
		});
	}
	
	$scope.subirExcelProductosComisiones=function(event){
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
				var productos=[];
				do {
					var producto={};
					producto.codigo=worksheet['A'+row]!=undefined && worksheet['A'+row]!=""?worksheet['A'+row].v.toString():null;
					producto.nombre=worksheet['B'+row]!=undefined && worksheet['B'+row]!=""?worksheet['B'+row].v.toString():null;
					producto.comision=worksheet['C'+row]!=undefined && worksheet['C'+row]!=""?worksheet['C'+row].v.toString():null;
					var productoEncontrado=$.grep($scope.productos, function(e){return e.codigo == producto.codigo;})[0];
					if(productoEncontrado){
						productoEncontrado.comisionesVendedores[0].comision=parseInt(producto.comision);
					}
					row++;	
					i++;				
				} while (worksheet['A'+row]!=undefined);
				blockUI.stop();
			};
			reader.readAsBinaryString(f);
	    }  
	}
	
	$scope.$on('$routeChangeStart', function(next, current) { 
	   $scope.eliminarPopup($scope.idModalWizardUsuarioEdicion);
	   $scope.eliminarPopup($scope.idModalWizardUsuarioVista);
	   $scope.eliminarPopup($scope.idModalEliminarUsuario);
	   $scope.eliminarPopup($scope.idModalWizardUsuarioRutas);
	   $scope.eliminarPopup($scope.idModalWizardUsuarioComisiones);
	});
	
	$scope.inicio();
});



