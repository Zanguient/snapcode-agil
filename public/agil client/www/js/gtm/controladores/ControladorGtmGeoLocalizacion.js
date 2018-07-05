angular.module('agil.controladores')

    .controller('ControladorGtmGeoLocalizacion', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
       ClasesTipo,ClasesTipoEmpresa,GtmDespachosUbicacion,uiGmapGoogleMapApi,$timeout,BuscarDespachosVendedor,FiltrarVendedorEmpresa) {

        blockUI.start();


        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.ModalVendedorMapa='dialog-vendedor-mapa'
        $scope.ModalFiltroMapa='dialog-mapa-despachos'

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptGeoLocalizacion($scope.ModalVendedorMapa,$scope.ModalFiltroMapa)
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerDespachados()
            $scope.map = {
                center: { latitude: -17.40380000777538, longitude: -66.1134901218414 }, zoom: 10, bounds: {
                    northeast: {
                        latitude: -17.403800007775388,
                        longitude: -66.11349012184144
                    }
                }
            };
            $scope.options = {
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.SATELLITE
            };
            
        }
        $scope.abrirDialogVendedorMapa = function(){
            $timeout(function () {
				$scope.$apply(function () {
					google.maps.event.trigger($scope.map, 'resize');
                });
			}, 2000);
            $scope.abrirPopup($scope.ModalVendedorMapa)
        }
       
        $scope.cerrarDialogVendedorMapa = function(){
            $scope.cerrarPopup($scope.ModalVendedorMapa)
        }
        $scope.abrirDialogFiltroMapa = function(){
            $scope.abrirPopup($scope.ModalFiltroMapa)
        }
       
        $scope.cerrarDialogFiltroMapa = function(){
            $scope.cerrarPopup($scope.ModalFiltroMapa)
        }
       
         $scope.obtenerDespachados = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "id";
            $scope.paginator.direccion = "asc";

          var  filtro = {
                id_empresa: $scope.usuario.id_empresa, inicio: 0,
                fin: 0,              
                cliente: 0,
                vendedor: 0
            }
            $scope.paginator.callBack = $scope.buscarDespachados;
            $scope.paginator.getSearch("",filtro, null);
            blockUI.stop();

        }
        $scope.buscarDespachados = function () {         
            blockUI.start();
            var promesa = GtmDespachosUbicacion($scope.paginator);
            promesa.then(function (dato) {
                $scope.paginator.setPages(dato.paginas);
                $scope.despachos = dato.detallesDespacho;
                $scope.totalesDespachos = { producto: 0, servicio_transporte: 0, total: 0 }
                $scope.despachos.forEach(function (despacho, index, array) {
                    $scope.totalesDespachos.producto += despacho.precio_unitario * despacho.cantidad_despacho
                    $scope.totalesDespachos.servicio_transporte += despacho.servicio_transporte
                    if (index === (array.length - 1)) {
                        $scope.totalesDespachos.total = $scope.totalesDespachos.producto + $scope.totalesDespachos.servicio_transporte
                    }

                })
                blockUI.stop();
            });
        }
        $scope.interceptarTecla = function (keyEvent, elemento, esEnfocar) {
			if (keyEvent.which === 13) {
				if (esEnfocar) {
					$scope.enfocar(elemento)
				} else {
					$timeout(function () {
						$('#' + elemento).trigger('click');
					}, 0);
				}
			}
		}
        $scope.buscarVendedor = function (query) {

			if (query != "" && query != undefined) {
				var promesa = FiltrarVendedorEmpresa($scope.usuario.id_empresa, query);

				return promesa;
			}
        }       
       
        $scope.GenerarMapaDespachosVendedor=function(filtro){
            $scope.markers = []; 
            filtro.fechaBusqueda=new Date($scope.convertirFecha(filtro.fecha))
            var promesa = BuscarDespachosVendedor(filtro)
            promesa.then(function(datos){
                var Marker={}
                   
                datos.detallesDespacho.forEach(function(detalleDespacho,index,array){
                    Marker=
                    {
                      "id": index,
                      "coords": {
                        "latitude": detalleDespacho.latitud,
                        "longitude": detalleDespacho.longitud
                      },
                      "window": {
                        "title": detalleDespacho.despacho.cliente.razon_social
                      }
                    }
                    $scope.markers.push(Marker)
                    if(index===(array.length-1)){
                        $scope.map = {
                            center: { latitude: datos.detallesDespacho[0].latitud, longitude: datos.detallesDespacho[0].longitud }, zoom: 13, bounds: {
                                northeast: {
                                    latitude: datos.detallesDespacho[0].latitud,
                                    longitude: datos.detallesDespacho[0].longitud
                                }
                            }
                        }
                        $scope.abrirDialogVendedorMapa()
                        $scope.cerrarDialogFiltroMapa()
                    }
                })
                
            })
        }
        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.ModalVendedorMapa);
            scope.eliminarPopup($scope.ModalFiltroMapa);
            
        });

        $scope.inicio();
    });



