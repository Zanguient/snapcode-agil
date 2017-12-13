angular.module('agil.controladores')

    .controller('ControladorComprobantes', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, CodigoControl, Paginator, ComprobantePaginador, ClasesTipo, ListaCuentasComprobanteContabilidad, ListaAsientosComprobanteContabilidad, NuevoComprobanteContabilidad, ClasesTipo, LibroMayorCuenta, ComprobanteRevisarPaginador,
        AsignarComprobanteFavorito, ComprasComprobante, VerificarUsuarioEmpresa,FieldViewer) {

        blockUI.start();
        $scope.asientoNuevo = false
        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';
        /* $scope.idModalWizardComprobanteEdicion='modal-wizard-comprobante-edicion';
        $scope.idPopupQr='modal-wizard-comprobante-edicions';  
        $scope.IdModalOpcionesQr='modal-opciones-qr';
        $scope.IdModalRegistrarComprobante='modal-registrar';
        $scope.IdModalRevisarComprobante='modal-revisar';
        $scope.IdModalLibroMayor='modal-libro-contable'; */
        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsComprobante($scope.IdModalVerificarCuenta);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion();
        });


        $scope.inicio = function () {
            $scope.detalleComprobante = {}
            $scope.obtenerTiposComprobante();
            $scope.asientos = []
            $scope.cuenta = {}
            $scope.comprobante = { asientos: [] }
            $scope.sucursales = $scope.obtenerSucursales();

            $scope.ObtenerComprobantes();
            $scope.obtenerGestiones();
        }

        $scope.obtenerColumnasAplicacion=function(){
			$scope.fieldViewer=FieldViewer({
				crear:true,
				id_empresa:$scope.usuario.id_empresa,
				configuracion:{abierto:{value:"Abierto",show:true},
							   comprobante:{value:"Comp.",show:true},
							   numero:{value:"Nro",show:true},
							   fecha:{value:"Fecha",show:true},
							   sucursal:{value:"Sucursal",show:true},
							   gloza:{value:"Gloza",show:true},
                               hora_fecha:{value:"Hora-Fecha",show:true},
                               importe:{value:"Importe",show:true},
                            usuario:{value:"Usuario",show:true}}
			},$scope.aplicacion.aplicacion.id);
			$scope.fieldViewer.updateObject();
		}

        $scope.obtenerSucursales = function () {
            var sucursales = [];
            for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
                sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
            }
            return sucursales;
        }

        /* $scope.guardarComprasComprobante=function(){
                        $scope.ocultarMensajesValidacion();
                        $scope.DatosCodigoQr.forEach(function(element) {
                    element.fecha=new Date($scope.convertirFecha(element.fecha));
                }, this);			
                blockUI.start();			
                    ComprasComprobante.save($scope.DatosCodigoQr,function(dato){
                        blockUI.stop();					
                        $scope.mostrarMensaje(dato.mensaje);
                         $scope.DatosCodigoQr=[];	
                    },function(error) {
                        blockUI.stop();					
                        $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                    	
                    });			
        	
        } */

        $scope.ObtenerComprobantes = function () {
            $scope.paginator = Paginator();
            $scope.paginator.column = "numero";
            $scope.paginator.callBack = $scope.obtenerLista;
            $scope.filtro = { empresa: $scope.usuario.id_empresa, clasificacion: "", tipo_comprobante: "", monto: "" };
            if ($scope.filtro.inicio != null) {
                $scope.paginator.getSearch("", $scope.filtro);
            }
        }
        /*  $scope.ObtenerComprobantesRevision = function () {    
             $scope.paginatorPrincipal=$scope.paginator;
                 $scope.paginator = Paginator();			
                 $scope.paginator.column="numero";
                  $scope.paginator.callBack=$scope.obtenerListaRevision;					
                 $scope.filtro={ empresa: $scope.usuario.id_empresa,inicio:0,fin:0,texto_busqueda:0};               
                 if($scope.filtro.inicio!=null){
                     $scope.paginator.getSearch("",$scope.filtro);
                 }
             }        */
        /*   $scope.asignarComprobanteFavorito = function (idComprobante) {
              AsignarComprobanteFavorito.update({id_comprobante:idComprobante},function (dato) {
                  $scope.mostrarMensaje(dato.mensaje);
                  $scope.paginator.getSearch("",$scope.filtro);
              })
          } */
        /*  $scope.obtenerListaRevision = function () {
                blockUI.start();
                // var inicio = (inicio == null || inicio == undefined) ? 0 : new Date($scope.convertirFecha(inicio));
                // var fin = (fin == null || fin == undefined) ? 0 : new Date($scope.convertirFecha(fin));
                // var promise=RolesList($scope.paginator);
                var fechainico=$scope.paginator.filter.inicio;
                var fechafin=$scope.paginator.filter.fin;
                if($scope.paginator.filter.inicio==null){
                    $scope.paginator.filter.inicio=0
                     $scope.paginator.filter.fin=0
                }
                if($scope.paginator.filter.inicio!=0){
                $scope.paginator.filter.inicio=new Date($scope.convertirFecha($scope.paginator.filter.inicio));
                $scope.paginator.filter.fin=new Date($scope.convertirFecha($scope.paginator.filter.fin));
                }else{
                    fechainico=""
                    fechafin=""
                }
                var promise = ComprobanteRevisarPaginador($scope.paginator);            
                promise.then(function (data) {
                    $scope.paginator.setPages(data.paginas);
                    $scope.comprobantesRevision = data.comprobantes;              
                    $scope.filtro={ empresa: $scope.usuario.id_empresa,inicio:fechainico,fin:fechafin,texto_busqueda:""};               
                    $scope.paginator.filter.inicio=fechainico
                    $scope.paginator.filter.fin=fechafin
                    blockUI.stop();
                });
            } */
        $scope.obtenerLista = function () {

            blockUI.start();
            // var inicio = (inicio == null || inicio == undefined) ? 0 : new Date($scope.convertirFecha(inicio));
            // var fin = (fin == null || fin == undefined) ? 0 : new Date($scope.convertirFecha(fin));
            // var promise=RolesList($scope.paginator);
            var fechainico = $scope.paginator.filter.inicio;
            var fechafin = $scope.paginator.filter.fin;
            $scope.paginator.filter.inicio = new Date($scope.convertirFecha($scope.paginator.filter.inicio));
            $scope.paginator.filter.fin = new Date($scope.convertirFecha($scope.paginator.filter.fin));
            var promise = ComprobantePaginador($scope.paginator);
            $scope.totalImporte = 0;
            promise.then(function (data) {
                $scope.paginator.setPages(data.paginas);
                $scope.comprobantes = data.comprobantes;
                $scope.comprobantes.forEach(function (comprobante) {
                    $scope.totalImporte = $scope.totalImporte + comprobante.importe;
                }, this);
                $scope.filtro = { empresa: $scope.usuario.id_empresa, inicio: fechainico, fin: fechafin, clasificacion: "", tipo_comprobante: "", monto: "" };
                $scope.paginator.filter.inicio = fechainico
                $scope.paginator.filter.fin = fechafin
                blockUI.stop();
            });
        }

        $scope.formatearFecha = function (fecha) {
            var fechaArreglo = fecha.split('/');
            var fechaFormateada = fechaArreglo[0] + fechaArreglo[1] + fechaArreglo[2];
            return fechaFormateada;
        }
        /* //modal nuevo comprobante
            $scope.crearNuevoComprobante=function(){
                $scope.nuevoComprobante={id_usuario:$scope.usuario.id,asientosContables:[],eliminado:0,abierto:0,importe:0};
                $scope.abrirPopup($scope.idModalWizardComprobanteEdicion);
          }
          $scope.cerrarNuevoComprobante=function(){
                $scope.cerrarPopup($scope.idModalWizardComprobanteEdicion);
          };
        //modal qr
          $scope.abrirModalOpcionesQr=function(){
                $scope.abrirPopup($scope.IdModalOpcionesQr);
            }
                $scope.cerrarModalOpcionesQr=function(){
                $scope.cerrarPopup($scope.IdModalOpcionesQr);
            }
        //modal registrar
            $scope.abrirModalRegistrarComprobante=function(){
                $scope.abrirPopup($scope.IdModalRegistrarComprobante)
            }
            $scope.cerrarModalRegComprobante=function(){
                $scope.cerrarPopup($scope.IdModalRegistrarComprobante);
            }
        
        //modal revisar
            $scope.abrirModalRevisarComprobante=function(){
                $scope.ObtenerComprobantesRevision()
                $scope.abrirPopup($scope.IdModalRevisarComprobante)
            }
            $scope.cerrarModalRevisarComprobante=function(){
                if($scope.paginatorPrincipal.filter!=null){
                $scope.paginator = Paginator()
                $scope.paginator =$scope.paginatorPrincipal;
                $scope.paginator.column="numero";    
                $scope.paginator.callBack=$scope.obtenerLista;        
                }
                $scope.cerrarPopup($scope.IdModalRevisarComprobante);
            }
        
            //modal Libros mayores
            $scope.abrirModalLibrosMayores=function(asiento){
                if(asiento.cuenta.id!=null){
                    promesa = LibroMayorCuenta(asiento.cuenta.id,0,0)
                    promesa.then(function (entidad) {
                        $scope.DatosLibroMayor = entidad;
                        blockUI.stop();
                        $scope.abrirPopup($scope.IdModalLibroMayor)
                    });        
                }
            } */
        /*   $scope.BuscarPorFechaLibrosMayores=function(asiento,inicio,fin){
              var inicio1 = new Date($scope.convertirFecha(inicio))
              var fin1 = new Date($scope.convertirFecha(fin))
             if(asiento.id!=null){
                 promesa = LibroMayorCuenta(asiento.id,inicio1,fin1)
                 promesa.then(function (entidad) {
                     $scope.DatosLibroMayor = entidad;
                     blockUI.stop();
                     $scope.abrirPopup($scope.IdModalLibroMayor)
                 });        
             }
         } */
        $scope.cerrarModalLibrosMayores = function () {
            $scope.cerrarPopup($scope.IdModalLibroMayor);
        }

        $scope.obtenerTiposComprobante = function () {
            blockUI.start();
            var promesa = ClasesTipo("TCMC");
            promesa.then(function (entidad) {
                $scope.tiposComprobantes = entidad.clases;
                blockUI.stop();
            });
        }

        $scope.obtenerGestiones = function () {
            blockUI.start();
            var promesa = ClasesTipo("GTN");
            promesa.then(function (entidad) {
                $scope.gestiones = entidad.clases;
                blockUI.stop();
            });
        }
        $scope.buscarCuentas = function (query) {
            if (query != "" && query != undefined) {
                // console.log(query)
                var promesa = ListaCuentasComprobanteContabilidad($scope.usuario.id_empresa, query);
                console.log(promesa)
                return promesa;
            }
        }
        /*   $scope.eliminarDatosQr = function (dato) {
             $scope.DatosCodigoQr[dato].eliminado=true;
         }  */
        $scope.DatosCodigoQr = [];
        $scope.cont2 = 1
        $scope.disparo = true;

        /*  $scope.compra=new Compra({id_empresa:$scope.usuario.id_empresa,id_usuario:$scope.usuario.id,proveedor:{},id_tipo_pago:$scope.tiposPago[0].id,tipoPago:$scope.tiposPago[0],
                                         detallesCompra:[],descuento_general:false,tipo_descuento:false,codigo_control:0,autorizacion:0,
                                         tipo_recargo:false,descuento:0,recargo:0,ice:0,excento:0}); */
        /* $scope.agregarDatosQr = function (evento,Dato) {  
            if (evento.which === 13){
                $scope.cont2++;
                datos=Dato;//$scope.cont2+"|999999999|9999999999999|17/10/2017|90|90|43|19999|0|0|0|0"
                var DatosCodigoQr=datos.split('|');        
                var data = new Date();
                var data2 = new Date($scope.convertirFecha(DatosCodigoQr[3]))
                var valido =""
                if(data.getTime()<data2.getTime()){
                    valido = true
                }else{
                    valido = false
                }
                
                var DatosRecopiladosCodigoQr={nit:DatosCodigoQr[0],id_usuario:$scope.usuario.id,id_tipo_pago:null,tipoPago:null,detallesCompra:[],descuento_general:false,factura:DatosCodigoQr[1],autorizacion:DatosCodigoQr[2],fecha:DatosCodigoQr[3],total:DatosCodigoQr[4],total2:DatosCodigoQr[5],codigo_control:DatosCodigoQr[6],cliente_nit:DatosCodigoQr[7],ice:DatosCodigoQr[8],numero_grav:0,sujeto_cf:0,tipo_recargo:false,descuento:0,recargo:0,ice:0,excento:0,eliminado:false,valido:valido,lector:true}
                $scope.DatosCodigoQr.push(DatosRecopiladosCodigoQr)
                console.log($scope.DatosCodigoQr)
                var DatosRecopiladosCodigoQr=null;
                Dato="";
            }      
        } */


        $scope.AgregarComprobante = function () {
            if ($scope.nuevoComprobante.tipo_comprobante != null && $scope.nuevoComprobante.id_sucursal != null && $scope.nuevoComprobante.fecha != null) {
                for (var index = 0; index < $scope.nuevoComprobante.asientosContables.length; index++) {

                    var element = $scope.nuevoComprobante.asientosContables[index];
                    if (element.activo != false && element.debe_bs != "") {
                        $scope.nuevoComprobante.importe = Math.round(($scope.nuevoComprobante.importe + element.debe_bs) * 10000) / 10000
                    }
                }
                $scope.nuevoComprobante.fecha = new Date($scope.convertirFecha($scope.nuevoComprobante.fecha))
                NuevoComprobanteContabilidad.save($scope.nuevoComprobante, function (dato) {
                    $scope.mostrarMensaje(dato.mensaje);
                    $scope.cerrarNuevoComprobante();


                })
            } else {

            }
        }
        /* $scope.verificarFechaQr=function (DatoQr,index) {
            var data = new Date();
            var data2 = new Date($scope.convertirFecha(DatoQr.fecha))
            var valido =""
            if(data.getTime()<data2.getTime()){
                valido = true
            }else{
                valido = false
            }
            $scope.DatosCodigoQr[index].valido=valido;
        }
         $scope.agregarAsientoANuevoComprobante=function (datos) {
            for (var index = 0; index < datos.comprobante.length; index++) {          
                var asiento = {cuenta:datos.comprobante[index].cuentas,debe_bs:datos.comprobante[index].debe_bs,haber_bs:datos.comprobante[index].haber_bs,debe_sus:datos.comprobante[index].debe_sus,haber_sus:datos.comprobante[index].haber_sus, eliminado:0,activo:true}
                $scope.nuevoComprobante.asientosContables.push(asiento)
            }
            
            
        } */
        /*  $scope.agregarAsiento = function () {      
                 var asiento = {cuenta:"",debe_bs:"",haber_bs:"",debe_sus:"",haber_sus:"", eliminado:0,activo:true}
                 $scope.nuevoComprobante.asientosContables.push(asiento)
            
         }
         $scope.agregarNuevoItem = function () {      
                 var DatosRecopiladosCodigoQr={nit:"",factura:"",autorizacion:"",fecha:"",total:"",total2:"",codigo_control:"",cliente:"",ice:"",numero_grav:"",sujeto_cf:"",desc:"",eliminado:false,valido:null,lector:false}
                $scope.DatosCodigoQr.push(DatosRecopiladosCodigoQr)
            
         } */
        $scope.verComprobante = function (comprobante) {
            if (comprobante.abierto) {
                $scope.crearNuevoComprobante(null, null, comprobante)
            }
        }

        $scope.ComvertirDebeEnDolar = function (asiento) {
            asiento.debe_sus = Math.round((asiento.debe_bs / $scope.valorDolar) * 10000) / 10000;
        }
        $scope.ComvertirHaberEnDolar = function (asiento) {
            asiento.haber_sus = Math.round((asiento.haber_bs / $scope.valorDolar) * 10000) / 10000;
        }
        $scope.ComvertirDebeEnBolivianos = function (asiento) {
            asiento.debe_bs = Math.round((asiento.debe_sus * $scope.valorDolar) * 10000) / 10000;
        }
        $scope.ComvertirHaberEnBolivianos = function (asiento) {
            asiento.haber_bs = Math.round((asiento.haber_sus * $scope.valorDolar) * 10000) / 10000;
        }
        $scope.$on('$routeChangeStart', function (next, current) {

            /* $scope.eliminarPopup($scope.idPopupQr);  
            
            $scope.eliminarPopup($scope.IdModalRegistrarComprobante);
            $scope.eliminarPopup($scope.IdModalRevisarComprobante);
            
            $scope.eliminarPopup($scope.idModalWizardComprobanteEdicion);
            $scope.eliminarPopup($scope.IdModalLibroMayor);
            $scope.eliminarPopup($scope.IdModalOpcionesQr); */

        });
        $scope.verificarCuentaAdmin = function (cuenta) {
            if (!$scope.dato.abierto) {
                cuenta.abierto = true
            } else {
                cuenta.abierto = false
            }
            cuenta.id_comprobante = $scope.dato.id
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {
                console.log(dato)
                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    $scope.dato.abierto = cuenta.abierto;
                    $scope.cerrarModalVerificarCuenta();
                } else {
                    $scope.mostrarMensaje(dato.message)
                }
            })




        }

        $scope.abrirModalVerificarCuenta = function (comprobante) {
            $scope.dato = comprobante
            $scope.abrirPopup($scope.IdModalVerificarCuenta);
        }
        $scope.cerrarModalVerificarCuenta = function () {

            $scope.cerrarPopup($scope.IdModalVerificarCuenta);
        }
        $scope.opcionBimonetario = true;
        $scope.VerBimonetario = function () {
            console.log($scope.opcionBimonetario)
            if ($scope.opcionBimonetario != true) {
                $scope.opcionBimonetario = false;
            } else {
                $scope.opcionBimonetario = true;
            }
        }
        $scope.inicio();
    });



