angular.module('agil.controladores')

	.controller('ControladorUsuarios', function ($scope, $location, $window, $localStorage, $templateCache, $route, blockUI, Usuario, Empresas, Roles, $timeout,
		UsuariosEmpresa, Rutas, UsuarioRutas, Diccionario, UsuarioComision, UsuarioComisiones, Sucursales, UsuariosEmpresaPaginador, validarUsuario, Paginator, ListaGruposProductoEmpresa, ObtenerUsuario, ListaAplicacionesSistemaEmpresa) {

		$scope.idModalWizardUsuarioEdicion = 'modal-wizard-usuario';
		$scope.idModalWizardUsuarioVista = 'modal-wizard-usuario-vista';
		$scope.idModalEliminarUsuario = 'dialog-eliminar-usuario';
		$scope.idModalContenedorUsuarioEdicion = 'modal-wizard-container-usuario-edicion';
		$scope.idModalContenedorUsuarioVista = 'modal-wizard-container-usuario-vista';
		$scope.idImagenUsuario = 'imagen-persona';
		$scope.idModalWizardUsuarioRutas = 'modal-wizard-usuario-rutas';
		$scope.idModalContenedorUsuarioRutas = 'modal-wizard-container-usuario-rutas';
		$scope.idModalWizardUsuarioComisiones = 'modal-wizard-usuario-comisiones';
		$scope.idModalContenedorUsuarioComisiones = 'modal-wizard-container-usuario-comisiones';

		$scope.usuarioSesion = JSON.parse($localStorage.usuario);
		$scope.obtenerGruposProductoEmpresa = function (id_empresa) {
			var promesa = ListaGruposProductoEmpresa((id_empresa !== undefined) ? id_empresa : $scope.usuarioSesion.id_empresa);
			promesa.then(function (grupos) {
				$scope.gruposProducto = grupos
				$scope.llenarGrupos(grupos);
				// if ($scope.usuario.grupos) {
				// 	$scope.seleccionarGrupos($scope.usuario.grupos)
				// }

			})
		}
		$scope.inicio = function () {
			$scope.gruposUsuario = []
			$scope.obtenerEmpresas();

			$scope.obtenerRoles();
			$scope.obtenerUsuarios();
			if ($scope.usuarioSesion.empresa) {
				$scope.obtenerRutas();
				$scope.obtenerAplicacionesEmpresas($scope.usuarioSesion.id_empresa)
			}
			$scope.obtenerGruposProductoEmpresa()
			/* var sucursales=($scope.usuarioSesion.empresa)?$scope.usuarioSesion.empresa.sucursales:[];
			$scope.llenarSucursales(sucursales); */
			$scope.buscarSucursales($scope.usuarioSesion.id_empresa)
			/* setTimeout(function() {
				ejecutarScriptsTabla('tabla-usuarios',9);
			},2000); */
		}

		$scope.$on('$viewContentLoaded', function () {
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
			$scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario, $location.path().substring(1));
			console.log($scope.aplicacion)
			blockUI.stop();
		});

		$scope.crearNuevoUsuario = function () {
			if ($scope.usuarioSesion.id_empresa) {
				$scope.usuario = new Usuario({ persona: { imagen: "img/icon-user-default.png" }, sucursales: [], id_empresa: $scope.usuarioSesion.id_empresa });
				//$scope.sucursales=$scope.usuarioSesion.empresa.sucursales;
				$scope.seleccionarSucursales([]);

			} else {

				$scope.usuario = new Usuario({ persona: { imagen: "img/icon-user-default.png" }, sucursales: [] });
				$scope.sucursales = [];
			}
			$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
		}

		$scope.verUsuario = function (usuario) {
			blockUI.start()
			var prom = ObtenerUsuario(usuario.id)
			prom.then(function (res) {
				if (res.mensaje == undefined) {
					$scope.usuario = res.usuario;
					$scope.rol = res.usuario.rolesUsuario[0].rol;
					$scope.usuario.sucursales = [];
					// 					$scope.sucursales = res.usuario.empresa.sucursales;
					for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
						$scope.usuario.sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
					}
					blockUI.stop()
					$scope.abrirPopup($scope.idModalWizardUsuarioVista);
				} else {
					blockUI.stop()
					$scope.mostrarMensaje(res.mensaje)
				}
			}).catch(function (err) {
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null) ? err.data : 'Error: no hubo respuesta del servidor o hubo un cambio de red. -- controlador usuarios LN 78.'
				$scope.mostrarMensaje(mensaje)
				blockUI.stop()
			})

			//old: change at 06/04/2018
			// //console.log(usuario);
			// $scope.usuario = usuario;
			// $scope.rol = usuario.rolesUsuario[0].rol;
			// $scope.usuario.sucursales = [];
			// $scope.sucursales = usuario.empresa.sucursales;
			// for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
			// 	$scope.usuario.sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			// }
			// $scope.abrirPopup($scope.idModalWizardUsuarioVista);
		}

		$scope.modificarUsuario = function (usuario) {

			blockUI.start()
			var prom = ObtenerUsuario(usuario.id)
			prom.then(function (res) {
				if (res.mensaje == undefined) {
					if ($scope.usuarioSesion.id_empresa == null) {
						var promesa = ListaGruposProductoEmpresa(usuario.id_empresa);
						promesa.then(function (grupos) {
							$scope.gruposProducto = grupos
							$scope.llenarGrupos(grupos);
							$scope.llenarGrupos($scope.gruposProducto)
							$scope.usuario = res.usuario;
							// $scope.seleccionarGrupos($scope.usuario.grupos);
							$scope.rol = res.usuario.rolesUsuario[0].rol;
							$scope.usuario.sucursales = [];
							// $scope.sucursales = res.usuario.empresa.sucursales;
							for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
								$scope.usuario.sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
							}
							var sucursales;
							//subido
							$scope.selectRol=JSON.stringify(usuario.rolesUsuario[0]);
							$scope.aplicacionesEmpresa=$scope.usuario.empresa.aplicacionesEmpresa
							$scope.usuario.aplicacionesUsuario = $scope.verificarAplicacionesUsuario()
							$scope.seleccionarGrupos($scope.usuario.grupos);
							// //$scope.obtenerGruposProductoEmpresa()
							if ($scope.usuarioSesion.empresa) {
								sucursales = $scope.usuarioSesion.empresa.sucursales;
								$scope.llenarSucursales(sucursales);
								$scope.seleccionarSucursales($scope.usuario.sucursales);
								// //$scope.seleccionarGrupos($scope.usuario.grupos);

								$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
							} else {
								var promesa = Sucursales(res.usuario.id_empresa);
								promesa.then(function (datos) {
									sucursales = datos;
									$scope.llenarSucursales(sucursales);
									$scope.seleccionarSucursales($scope.usuario.sucursales);
									// //$scope.seleccionarGrupos($scope.usuario.grupos);
									$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
								});
							}
							blockUI.stop()

						})
					} else {
						var indexAplicacion=[]
						$scope.llenarGrupos($scope.gruposProducto)
						$scope.usuario = res.usuario;
						$scope.usuario.aplicacionesUsuario = $scope.verificarAplicacionesUsuario()
						// $scope.seleccionarGrupos($scope.usuario.grupos);
						$scope.rol = res.usuario.rolesUsuario[0].rol;
						$scope.usuario.sucursales = [];
						// $scope.sucursales = res.usuario.empresa.sucursales;
						for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
							$scope.usuario.sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
						}
						var sucursales;
						$scope.seleccionarGrupos($scope.usuario.grupos);
						// //$scope.obtenerGruposProductoEmpresa()
						if ($scope.usuarioSesion.empresa) {
							sucursales = $scope.usuarioSesion.empresa.sucursales;
							$scope.llenarSucursales(sucursales);
							$scope.seleccionarSucursales($scope.usuario.sucursales);
							// //$scope.seleccionarGrupos($scope.usuario.grupos);

							$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
						} else {
							var promesa = Sucursales(res.usuario.id_empresa);
							promesa.then(function (datos) {
								sucursales = datos;
								$scope.llenarSucursales(sucursales);
								$scope.seleccionarSucursales($scope.usuario.sucursales);
								// //$scope.seleccionarGrupos($scope.usuario.grupos);
								$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
							});
						}
						blockUI.stop()
					}
				} else {
					blockUI.stop()
					$scope.mostrarMensaje(res.mensaje)
				}
			}).catch(function (err) {
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null) ? err.data : 'Error: no hubo respuesta del servidor o hubo un cambio de red. -- controlador usuarios LN 78.'
				$scope.mostrarMensaje(mensaje)
				blockUI.stop()
			})

			//old: change at 06/04/2018
			// $scope.usuario = usuario;
			// // //$scope.obtenerGruposProductoEmpresa()
			// $scope.seleccionarGrupos($scope.usuario.grupos);
			// $scope.rol = usuario.rolesUsuario[0].rol;
			// $scope.usuario.sucursales = [];
			// // //$scope.sucursales=usuario.empresa.sucursales;
			// for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
			// 	$scope.usuario.sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
			// }
			// var sucursales;
			// // //$scope.obtenerGruposProductoEmpresa()
			// if ($scope.usuarioSesion.empresa) {
			// 	sucursales = $scope.usuarioSesion.empresa.sucursales;
			// 	// /* $scope.llenarSucursales(sucursales); */
			// 	$scope.seleccionarSucursales($scope.usuario.sucursales);
			// 	// //$scope.seleccionarGrupos($scope.usuario.grupos);
			// 	$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
			// } else {
			// 	var promesa = Sucursales(usuario.id_empresa);
			// 	promesa.then(function (datos) {
			// 		sucursales = datos;
			// 		$scope.llenarSucursales(sucursales);
			// 		$scope.seleccionarSucursales($scope.usuario.sucursales);
			// 		// //$scope.seleccionarGrupos($scope.usuario.grupos);
			// 		$scope.abrirPopup($scope.idModalWizardUsuarioEdicion);
			// 	});
			// }
		}
		$scope.verificarAplicacionesUsuario=function () {
			var indexAplicacion=[]
			$scope.usuario.aplicacionesUsuario.map(function (app,index,array) {
				if (app.puede_ver == true) {
					app.editable = true
				} else {
					app.editable = false
				}
				if (app.aplicacion.titulo == Diccionario.MENU_REPORTE || app.aplicacion.titulo == Diccionario.MENU_APPMOVIL || app.aplicacion.titulo == Diccionario.MENU_LIBRO_COMPRA || app.aplicacion.titulo == Diccionario.MENU_LIBRO_VENTAS
					|| app.aplicacion.titulo == Diccionario.MENU_REPORTE_VENTAS || app.aplicacion.titulo == Diccionario.MENU_REPORTE_COMPRAS || app.aplicacion.titulo == Diccionario.MENU_ESTADO_RESULTADOS || app.aplicacion.titulo == Diccionario.MENU_ALMACEN ||
					app.aplicacion.titulo == Diccionario.MENU_CERT_COD_CONTROL || app.aplicacion.titulo == Diccionario.MENU_ESTADO_CUENTAS_CLIENTES || app.aplicacion.titulo == Diccionario.MENU_ESTADO_CUENTAS_PROVEEDORES ||
					app.aplicacion.titulo == Diccionario.MENU_SEGUIMIENTOAPP || app.aplicacion.titulo == Diccionario.MENU_PANTALLA || app.aplicacion.titulo == Diccionario.MENU_PANTALLACLIENTE || app.aplicacion.titulo == Diccionario.MENU_PANTALLADESPACHO ||
					app.aplicacion.titulo == Diccionario.MENU_DESPACHO) {
					var bandera = false
					for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
						var element = $scope.aplicacionesEmpresa[k];
						if (element.id_aplicacion == app.aplicacion.id) {
							bandera = true
						}
					}
					if (bandera) {
						app.ver_puede_crear = false
						app.ver_puede_modificar = false
						app.ver_puede_eliminar = false
					}
					else {
						indexAplicacion.push(index)
						app.puede_ver = false
						app.editable = false
						app.puede_crear = false
						app.puede_modificar = false
						app.puede_eliminar = false

					}
				} else if (app.aplicacion.titulo == Diccionario.MENU_EMPRESA) {
					var bandera = false
					for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
						var element = $scope.aplicacionesEmpresa[k];
						if (element.id_aplicacion == app.aplicacion.id) {
							bandera = true
						}
					}
					if (bandera) {
						app.ver_puede_crear = false
						app.ver_puede_modificar = true
						app.ver_puede_eliminar = false
					}
					else {
						indexAplicacion.push(index)
						app.puede_ver = false
						app.editable = false
						app.puede_crear = false
						app.puede_modificar = false
						app.puede_eliminar = false

					}

				} else if (app.aplicacion.titulo == Diccionario.MENU_MESAS) {
					var bandera = false
					for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
						var element = $scope.aplicacionesEmpresa[k];
						if (element.id_aplicacion == app.aplicacion.id) {
							bandera = true
						}
					}
					if (bandera) {
						app.ver_puede_crear = true
						app.ver_puede_modificar = false
						app.ver_puede_eliminar = false
					}
					else {
						indexAplicacion.push(index)
						app.puede_ver = false
						app.editable = false
						app.puede_crear = false
						app.puede_modificar = false
						app.puede_eliminar = false

					}

				} else if (app.aplicacion.titulo == Diccionario.MENU_VENTA) {
					var bandera = false
					for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
						var element = $scope.aplicacionesEmpresa[k];
						if (element.id_aplicacion == app.aplicacion.id) {
							bandera = true
						}
					}
					if (bandera) {
						app.ver_puede_crear = true
						app.ver_puede_modificar = false
						app.ver_puede_eliminar = true
					}
					else {
						indexAplicacion.push(index)
						app.puede_ver = false
						app.editable = false
						app.puede_crear = false
						app.puede_modificar = false
						app.puede_eliminar = false

					}

				} else if (app.aplicacion.titulo == Diccionario.MENU_CONFIGURACION) {
					var bandera = false
					for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
						var element = $scope.aplicacionesEmpresa[k];
						if (element.id_aplicacion == app.aplicacion.id) {
							bandera = true
						}
					}
					if (bandera) {
						app.ver_puede_crear = true
						app.ver_puede_modificar = true
						app.ver_puede_eliminar = false
					}
					else {
						indexAplicacion.push(index)
						app.puede_ver = false
						app.editable = false
						app.puede_crear = false
						app.puede_modificar = false
						app.puede_eliminar = false

					}

				} else if (app.aplicacion.titulo == Diccionario.MENU_CONCEPTO) {
					var bandera = false
					for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
						var element = $scope.aplicacionesEmpresa[k];
						if (element.id_aplicacion == app.aplicacion.id) {
							bandera = true
						}
					}
					if (bandera) {
						app.ver_puede_crear = true
						app.ver_puede_modificar = false
						app.ver_puede_eliminar = true
					}
					else {
						indexAplicacion.push(index)
						app.puede_ver = false
						app.editable = false
						app.puede_crear = false
						app.puede_modificar = false
						app.puede_eliminar = false

					}

				} else if (app.aplicacion.titulo == Diccionario.MENU_DOSIFICACION) {
					var bandera = false
					for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
						var element = $scope.aplicacionesEmpresa[k];
						if (element.id_aplicacion == app.aplicacion.id) {
							bandera = true
						}
					}
					if (bandera) {
						app.ver_puede_crear = true
						app.ver_puede_modificar = false
						app.ver_puede_eliminar = true
					}
					else {
						indexAplicacion.push(index)
						app.puede_ver = false
						app.editable = false
						app.puede_crear = false
						app.puede_modificar = false
						app.puede_eliminar = false

					}
				} else {
					var bandera = false
					for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
						var element = $scope.aplicacionesEmpresa[k];
						if (element.id_aplicacion == app.aplicacion.id) {
							bandera = true
						}
					}
					if (bandera) {
						app.ver_puede_crear = true
						app.ver_puede_modificar = true
						app.ver_puede_eliminar = true
					}
					else {
						indexAplicacion.push(index)
						app.puede_ver = false
						app.editable = false
						app.puede_crear = false
						app.puede_modificar = false
						app.puede_eliminar = false

					}
				}
				return app
			})
			indexAplicacion.reverse().forEach(function(dato,index,array){
				$scope.usuario.aplicacionesUsuario.splice(dato,1)
			})
			return $scope.usuario.aplicacionesUsuario
			
		}
		$scope.validarUsuario = function (usuarioNombre) {
			var nombre = usuarioNombre;
			if (nombre != '') {
				$timeout(function () {
					$scope.validar = new validarUsuario();

					$scope.validar.nombre_usuario = usuarioNombre;

					$scope.validar.$save(function (data) {
						$scope.data = data;
					})
				}, 1500);
			}
		};

		$scope.seleccionarSucursales = function (sucursalesUsuario) {
			for (var i = 0; i < $scope.sucursales.length; i++) {
				for (var j = 0; j < sucursalesUsuario.length; j++) {
					if ($scope.sucursales[i].id == sucursalesUsuario[j].id) {
						$scope.sucursales[i].ticked = true;
					}
				}
			}
		}

		$scope.seleccionarGrupos = function (gruposUsuario) {
			for (var i = 0; i < $scope.gruposUsuario.length; i++) {
				for (var j = 0; j < gruposUsuario.length; j++) {
					if ($scope.gruposUsuario[i].id == gruposUsuario[j].id_grupo) {
						$scope.gruposUsuario[i].ticked = true;
					}
				}
			}
		}

		$scope.llenarGrupos = function (datosGrupos) {

			// if ($scope.usuario.grupos) {
			// 	$scope.seleccionargrupos($scope.usuario.grupos)
			// }else{
			// 	$scope.usuario.grupos= []
			// 	$scope.seleccionargrupos($scope.usuario.grupos)
			// }
			$scope.gruposUsuario = []
			for (var i = 0; i < datosGrupos.length; i++) {
				var grupo = {
					name: datosGrupos[i].nombre,
					maker: "",
					ticked: false,
					id: datosGrupos[i].id
				}
				$scope.gruposUsuario.push(grupo);
			}
		}
		$scope.llenarSucursales = function (datosSucursales) {
			$scope.sucursales = [];
			for (var i = 0; i < datosSucursales.length; i++) {
				var sucursal = {
					name: datosSucursales[i].nombre,
					maker: "",
					ticked: false,
					id: datosSucursales[i].id
				}
				$scope.sucursales.push(sucursal);
			}
		}

		$scope.cerrarPopPupNuevo = function () {
			$scope.cerrarPopup($scope.idModalWizardUsuarioEdicion);
		}

		$scope.cerrarPopPupVista = function () {
			$scope.cerrarPopup($scope.idModalWizardUsuarioVista);
		}

		$scope.cerrarPopPupRutas = function () {
			$scope.cerrarPopup($scope.idModalWizardUsuarioRutas);
		}

		$scope.cerrarPopPupComisiones = function () {
			$scope.cerrarPopup($scope.idModalWizardUsuarioComisiones);
		}

		$scope.mostrarConfirmacionEliminacion = function (usuario) {
			$scope.usuario = new Usuario(usuario);
			$scope.abrirPopup($scope.idModalEliminarUsuario);
		}

		$scope.cerrarConfirmacionEliminacion = function () {
			$scope.cerrarPopup($scope.idModalEliminarUsuario);
		};

		$scope.eliminarUsuario = function (usuario) {
			blockUI.start();
			$scope.cerrarConfirmacionEliminacion();
			usuario.$delete();
			$scope.mostrarMensaje('Eliminado exitosamente!');
			$scope.recargarItemsTabla();
			blockUI.stop();
		}

		$scope.buscarSucursales = function (idEmpresa) {
			/* var empresas=$.grep($scope.empresas, function(e){return e.id == idEmpresa;}); */
			/* 	$scope.sucursales=empresas[0].sucursales; */
			var promesa = Sucursales(idEmpresa);
			promesa.then(function (datos) {
				sucursales = datos;
				$scope.llenarSucursales(sucursales);
				$scope.seleccionarSucursales($scope.usuario.sucursales);

			});
		}
		$scope.verificarSelecionado = function (aplicacion) {
			if (aplicacion.puede_ver) {
				aplicacion.puede_crear = true
				aplicacion.puede_modificar = true
				aplicacion.puede_eliminar = true
				aplicacion.editable = true
				$scope.usuario.aplicacionesUsuario.forEach(function (apli) {
					if (aplicacion.id_aplicacion == apli.aplicacion.id_padre) {
						apli.puede_crear = true
						apli.puede_ver = true
						apli.puede_modificar = true
						apli.puede_eliminar = true
						apli.editable = true
					}
				});
			} else {
				aplicacion.puede_crear = false
				aplicacion.puede_modificar = false
				aplicacion.puede_eliminar = false
				aplicacion.editable = false
				$scope.usuario.aplicacionesUsuario.forEach(function (apli) {
					if (aplicacion.id_aplicacion == apli.aplicacion.id_padre) {
						apli.puede_crear = false
						apli.puede_ver = false
						apli.puede_modificar = false
						apli.puede_eliminar = false
						apli.editable = false
					}
				});
			}

		}
		$scope.CargarAplicacion = function (i, bandera, crear, modificar, eliminar) {
			var modelo = {
				id_aplicacion: $scope.rol.aplicacionesRol[i].aplicacion.id,
				aplicacion: $scope.rol.aplicacionesRol[i].aplicacion,
				puede_crear: bandera,
				puede_ver: bandera,
				puede_modificar: bandera,
				puede_eliminar: bandera,
				editable: bandera,
				ver_puede_crear: crear,
				ver_puede_modificar: modificar,
				ver_puede_eliminar: eliminar
			}
			return modelo
		}
		$scope.buscarRol = function (idRol) {
		/* 	var datosRol = JSON.parse(rol);
			var idRol = datosRol.id
			var rol = JSON.parse($scope.usuario.rol)
			$scope.usuario.id_rol = rol.id */
			var roles = $.grep($scope.roles, function (e) { return e.id == idRol; });
			$scope.rol = roles[0];
			$scope.usuario.aplicacionesUsuario = [];
			for (var i = 0; i < $scope.rol.aplicacionesRol.length; i++) {
				if ($scope.rol.nombre == Diccionario.ROL_ADMINISTRADOR) {
					if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_APPMOVIL || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_LIBRO_COMPRA || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_LIBRO_VENTAS
						|| $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE_VENTAS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE_COMPRAS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_RESULTADOS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ALMACEN ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CERT_COD_CONTROL || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_CUENTAS_CLIENTES || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_CUENTAS_PROVEEDORES ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_SEGUIMIENTOAPP || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_PANTALLA || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_PANTALLACLIENTE || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_PANTALLADESPACHO ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_DESPACHO) {

						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, false, false, false));
							}
						}

					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_EMPRESA) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, false, true, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_MESAS) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, false, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_VENTA) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, false, true));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CONFIGURACION) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, true, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CONCEPTO) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, false, true));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_DOSIFICACION) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, false, true));
							}
						}
					} else {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, true, true));
							}
						}
					}
				} else if ($scope.rol.nombre == Diccionario.ROL_OPERADOR) {
					if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_APPMOVIL || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_LIBRO_COMPRA || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_LIBRO_VENTAS
						|| $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE_VENTAS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE_COMPRAS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_RESULTADOS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ALMACEN ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CERT_COD_CONTROL || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_CUENTAS_CLIENTES || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_CUENTAS_PROVEEDORES ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_SEGUIMIENTOAPP || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_PANTALLA || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_PANTALLACLIENTE || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_PANTALLADESPACHO ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_DESPACHO) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, false, false, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_EMPRESA) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, false, true, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_MESAS) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, false, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_VENTA) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, false, true));
							}
						}
					}else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_COMPRA) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, true, true));
							}
						}
					}  else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CONFIGURACION) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, true, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CONCEPTO) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, false, true));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_DOSIFICACION) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, false, true));
							}
						}
					} else {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, true, true));
							}
						}
					}
				} else if ($scope.rol.nombre == Diccionario.ROL_VENDEDOR) {
					if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_APPMOVIL || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_LIBRO_COMPRA || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_LIBRO_VENTAS
						|| $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE_VENTAS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_REPORTE_COMPRAS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_RESULTADOS || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ALMACEN ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CERT_COD_CONTROL || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_CUENTAS_CLIENTES || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_ESTADO_CUENTAS_PROVEEDORES ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_SEGUIMIENTOAPP || $scope.rol.aplicacionesRol[i].aplicacion.titulo === Diccionario.MENU_PANTALLA || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_PANTALLACLIENTE || $scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_PANTALLADESPACHO ||
						$scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_DESPACHO) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, false, false, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_EMPRESA) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, false, true, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_MESAS) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, false, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_VENTA) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, false, true));
							}
						}
					}else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_COMPRA) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, true, true, true, true));
							}
						}
					}  else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CONFIGURACION) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, true, false));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_CONCEPTO) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, false, true));
							}
						}
					} else if ($scope.rol.aplicacionesRol[i].aplicacion.titulo == Diccionario.MENU_DOSIFICACION) {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, false, true));
							}
						}
					} else {
						for (var k = 0; k < $scope.aplicacionesEmpresa.length; k++) {
							var element = $scope.aplicacionesEmpresa[k];
							if (element.id_aplicacion == $scope.rol.aplicacionesRol[i].aplicacion.id) {
								$scope.usuario.aplicacionesUsuario.push($scope.CargarAplicacion(i, false, true, true, true));
							}
						}
					}
				}

			}
		}

		$scope.modificarRutas = function (usuario) {
			$scope.usuario = usuario;
			$scope.abrirPopup($scope.idModalWizardUsuarioRutas);
		}

		$scope.asignarRutaUsuario = function (ruta) {
			var rutaUsuario = { nuevo: true, id_usuario: $scope.usuario.id, id_ruta: ruta.id, activo: true, usuario: { nombre_usuario: $scope.usuario.nombre_usuario }, ruta: { nombre: ruta.nombre } };
			if (ruta.elegida) {
				ruta.usuarios.push(rutaUsuario);
				$scope.usuario.rutas.push(rutaUsuario);
			} else {
				ruta.usuarios.splice(ruta.usuarios.indexOf(rutaUsuario), 1);
				$scope.usuario.rutas.splice(ruta.usuarios.indexOf(rutaUsuario), 1);
			}
		}

		$scope.guardarRutas = function (usuario) {
			var button = $('#siguiente-rutas').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				UsuarioRutas.update({ id_usuario: usuario.id }, usuario, function (res) {
					blockUI.stop();
					$scope.cerrarPopPupRutas();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.recargarItemsTabla();
				});
			}
		}

		$scope.veirificarUsuarioRuta = function (ruta, usuario) {
			var i = 0, encontrado = false;
			while (i < ruta.usuarios.length && !encontrado) {
				if (ruta.usuarios[i].usuario) {
					if (ruta.usuarios[i].usuario.nombre_usuario == usuario.nombre_usuario) {
						encontrado = true;
					}
				}
				i++;
			}
			return encontrado;
		}

		$scope.existenNuevosUsuariosRuta = function (ruta, usuario) {
			var i = 0, encontrado = false;
			while (i < ruta.usuarios.length && !encontrado) {
				if (ruta.usuarios[i].nuevo) {
					encontrado = true;
				}
				i++;
			}
			return encontrado;
		}

		$scope.modificarComisiones = function (usuario) {
			blockUI.start()
			$scope.usuario = usuario;
			var promise = UsuarioComisiones(usuario.id, $scope.usuarioSesion.id_empresa);
			promise.then(function (productos) {
				if (productos[0].mensaje !== undefined) {
					$scope.mostrarMensaje(productos[0].mensaje)
				} else {
					$scope.productos = productos;
					$scope.abrirPopup($scope.idModalWizardUsuarioComisiones);
				}
				blockUI.stop()
			}).catch(function (err) {
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null) ? err.data : 'Error: no hubo respuesta del servidor o hubo un cambio de red. -- controlador usuarios LN 78.'
				$scope.mostrarMensaje(mensaje)
				blockUI.stop()
			})
		}

		$scope.guardarComisiones = function (usuario) {
			var button = $('#siguiente-comisiones').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				usuario.productos = $scope.productos;
				UsuarioComision.update({ id_usuario: usuario.id, id_empresa: $scope.usuarioSesion.id_empresa }, usuario, function (res) {
					blockUI.stop();
					$scope.cerrarPopPupComisiones();
					$scope.mostrarMensaje('Guardado Exitosamente!');
					$scope.recargarItemsTabla();
				});
			}
		}

		$scope.saveForm = function (usuario) {
			var button = $('#siguiente').text().trim();
			if (button != "Siguiente") {
				blockUI.start();
				if (usuario.id) {
					Usuario.update({ id_usuario: usuario.id }, usuario, function (res) {
						blockUI.stop();
						$scope.cerrarPopPupNuevo();
						$scope.mostrarMensaje('Guardado Exitosamente!');
						$scope.recargarItemsTabla();
					});
				} else {
					usuario.$save(function (student) {
						blockUI.stop();
						$scope.cerrarPopPupNuevo();
						$scope.mostrarMensaje('Guardado Exitosamente!');
						$scope.recargarItemsTabla();
					}, function (error) {
						blockUI.stop();
						$scope.cerrarPopPupNuevo();
						$scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
						$scope.recargarItemsTabla();
					});
				}
			}
		}

		$scope.obtenerEmpresas = function () {
			blockUI.start();
			var promesa = Empresas();
			promesa.then(function (empresas) {
				$scope.empresas = empresas;
				blockUI.stop();
			});
		}
		$scope.obtenerAplicacionesEmpresas = function (idEmpresa) {
			blockUI.start();
			var promesa = ListaAplicacionesSistemaEmpresa(idEmpresa);
			promesa.then(function (datos) {
				$scope.aplicacionesEmpresa = datos;
				blockUI.stop();
			});
		}
		$scope.obtenerRoles = function () {
			blockUI.start();
			var promesa = Roles();
			promesa.then(function (roles) {
				$scope.roles = roles;
				$scope.roles.forEach(function(rol,index,array){
					if(rol.nombre==="SUPER-ADMINISTRADOR"){
						$scope.roles.splice(index,1)
					}
				})
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
			$scope.filtro = { empresa: $scope.usuarioSesion.id_empresa };
			$scope.paginator.callBack = $scope.buscarUsuarios;
			$scope.paginator.getSearch("", $scope.filtro, null);
			blockUI.stop();

		}

		$scope.buscarUsuarios = function () {
			blockUI.start();
			var promesa = UsuariosEmpresaPaginador($scope.paginator);
			promesa.then(function (dato) {
				if (dato.mensaje == undefined) {
					$scope.usuarios = dato.usuarios;
					// console.log(dato.usuarios)
					$scope.paginator.setPages(dato.paginas);
					blockUI.stop();
				} else {
					blockUI.stop();
					$scope.mostrarMensaje(dato.mensaje)
				}
			}).catch(function (err) {
				var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null) ? err.data : 'Error: no hubo respuesta del servidor o hubo un cambio de red. -- controlador usuarios LN 78.'
				$scope.mostrarMensaje(mensaje)
				blockUI.stop()
			})
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
		$scope.obtenerRutas = function () {
			blockUI.start();
			var promesa = Rutas($scope.usuarioSesion.id_empresa);
			promesa.then(function (rutas) {
				$scope.rutas = rutas;
				blockUI.stop();
			});
		}

		$scope.subirExcelProductosComisiones = function (event) {
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
					var productos = [];
					do {
						var producto = {};
						producto.codigo = worksheet['A' + row] != undefined && worksheet['A' + row] != "" ? worksheet['A' + row].v.toString() : null;
						producto.nombre = worksheet['B' + row] != undefined && worksheet['B' + row] != "" ? worksheet['B' + row].v.toString() : null;
						producto.comision = worksheet['C' + row] != undefined && worksheet['C' + row] != "" ? worksheet['C' + row].v.toString() : null;
						var productoEncontrado = $.grep($scope.productos, function (e) { return e.codigo == producto.codigo; })[0];
						if (productoEncontrado) {
							productoEncontrado.comisionesVendedores[0].comision = parseInt(producto.comision);
						}
						row++;
						i++;
					} while (worksheet['A' + row] != undefined);
					blockUI.stop();
				};
				reader.readAsBinaryString(f);
			}
		}

		$scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardUsuarioEdicion);
			$scope.eliminarPopup($scope.idModalWizardUsuarioVista);
			$scope.eliminarPopup($scope.idModalEliminarUsuario);
			$scope.eliminarPopup($scope.idModalWizardUsuarioRutas);
			$scope.eliminarPopup($scope.idModalWizardUsuarioComisiones);
		});

		$scope.inicio();
	});



