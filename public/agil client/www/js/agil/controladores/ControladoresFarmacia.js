angular.module('agil.controladores')

.controller('ControladoresFarmacia', function($scope,$localStorage,$location,$templateCache,$route, $filter,$window, $timeout, blockUI, ClasesTipo, ConfiguracionVentaVistaDatos, ProductosPanel, InventarioPaginador, ListaInventariosProducto, ListaProductosEmpresa, Venta, PacientesNit, ImprimirSalidaFarmacia, Ventas){
	
    $scope.usuario=JSON.parse($localStorage.usuario);
    convertUrlToBase64Image($scope.usuario.empresa.imagen,function(imagenEmpresa){
        $scope.usuario.empresa.imagen=imagenEmpresa;
    });

    $scope.idModalWizardFarmaciaEdicion='modal-wizard-farmacia-edicion';
    $scope.idModalInventario="dialog-productos-venta";

    $scope.$on('$viewContentLoaded', function () {    
        ejecutarScriptsFarmacia($scope.idModalWizardFarmaciaEdicion, $scope.idModalInventario);
    });

    $scope.inicio=function(){
        $scope.ordenProductos=true;
        $scope.esContado=true;
        //$scope.obtenerClientes();
        $scope.obtenerTiposDePago();
        $scope.obtenerConfiguracionVentaVista();
        $scope.sucursales=$scope.obtenerSucursales();
        
        $scope.sucursalesUsuario="";
        for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
            $scope.sucursalesUsuario=$scope.sucursalesUsuario+$scope.usuario.sucursalesUsuario[i].sucursal.id;
            if(i+1!=$scope.usuario.sucursalesUsuario.length){
                $scope.sucursalesUsuario=$scope.sucursalesUsuario+',';
            }
        }
        
        //$scope.obtenerVentas();
        $scope.obtenerMovimientosEgreso();

        // $scope.obtenerVendedores();
        
        $scope.detalleVenta={producto:{},centroCosto:{},cantidad:1,descuento:0,recargo:0,ice:0,excento:0,tipo_descuento:false,tipo_recargo:false}
    }

    $scope.obtenerTiposDePago=function(){
        blockUI.start();
        var promesa=ClasesTipo("TIPA");
        promesa.then(function(entidad){
            $scope.tiposPago=entidad.clases;
            blockUI.stop();
        });
    }

    $scope.obtenerConfiguracionVentaVista=function(){
        blockUI.start();
        var promise=ConfiguracionVentaVistaDatos($scope.usuario.id_empresa);
        promise.then(function(configuracion){
            $scope.configuracionVentaVista=configuracion;
            blockUI.stop();
        });
    }

    $scope.obtenerSucursales=function(){
        var sucursales=[];
        for(var i=0;i<$scope.usuario.sucursalesUsuario.length;i++){
            sucursales.push($scope.usuario.sucursalesUsuario[i].sucursal);
        }
        return sucursales;
    }

    $scope.obtenerMovimientosEgreso=function(){
        blockUI.start();
        var promesa=ClasesTipo("MOVEGR");
        promesa.then(function(entidad){
            console.log('la entidada es  ', entidad.clases);
            $scope.movimientosEgreso=$filter('filter')(entidad.clases, function(mov) {
                return mov.nombre == 'PROFORMA' || mov.nombre == 'PRE_FACTURACION' || mov.nombre == 'PLANILLA_ANTICIPOS';
            });
            blockUI.stop();
        });
    }

    $scope.obtenerTipoEgreso=function(movimiento){
        var nombre_corto=movimiento.nombre_corto;
        $scope.tipoEgreso=nombre_corto;
    }

    $scope.obtenerAlmacenesActividades=function(idSucursal){
        $scope.obtenerAlmacenes(idSucursal);
        $scope.obtenerActividades(idSucursal);
    }

    $scope.obtenerAlmacenes=function(idSucursal){
        $scope.almacenes=[];
        var sucursal=$.grep($scope.sucursales, function(e){return e.id == idSucursal;})[0];
        $scope.almacenes=sucursal.almacenes;
        $scope.venta.almacen=$scope.almacenes.length==1?$scope.almacenes[0]:null;
        if($scope.venta.almacen){
            $scope.cargarProductos();
        }
    }

    $scope.cargarProductos=function(){
        var promesa=ProductosPanel($scope.usuario.id_empresa,$scope.venta.almacen.id);
        promesa.then(function(productos){
            for(var i=0;i<productos.length;i++){
                if(productos[i].activar_inventario){
                    productos[i].inventario_disponible=$scope.obtenerInventarioTotal(productos[i]);
                }
            }
            $scope.productos=productos;
            
            // ======= save localstorage ====
            if ( angular.isDefined($localStorage.productosProcesados) ) {
             
                // ===== conbinar array productos con storage ====
                $scope.productosProcesados=productos;

                for (var i = 0; i < $localStorage.productosProcesados.length; i++) {
                    for (var j = 0; j < $scope.productosProcesados.length; j++) {
                        if ($localStorage.productosProcesados[i].id == $scope.productosProcesados[j].id) {
                          $scope.productosProcesados[j].rankin = $localStorage.productosProcesados[i].rankin;
                        }
                    }
                }
                


            } else {
                $scope.productosProcesados=productos;
            }
            // ===== Fin save localstorage ====

            setTimeout(function(){
                aplicarSwiper(4,3,true,2);
            },1000);
        });
    }
    
    $scope.obtenerActividades=function(idSucursal){
        $scope.actividades=[];
        var sucursal=$.grep($scope.sucursales, function(e){return e.id == idSucursal;})[0];
        $scope.actividadesDosificaciones=sucursal.actividadesDosificaciones;
        $scope.actividades=[];
        for(var i=0;i<$scope.actividadesDosificaciones.length;i++){
            $scope.actividades.push($scope.actividadesDosificaciones[i].actividad);
        }
        $scope.venta.actividad=$scope.actividades.length==1?$scope.actividades[0]:null;
    }

    $scope.buscarInventarios=function(idAlmacen,pagina,itemsPagina,texto,columna,direccion){
        blockUI.start();
        $scope.itemsPorPagina=itemsPagina;
        if(texto=="" || texto==null){
            texto=0;
        }else{
            $scope.textoBusqueda=texto;
        }
        $scope.paginaActual=pagina;
        var promesa=InventarioPaginador($scope.usuario.id_empresa,idAlmacen,pagina,itemsPagina,texto,columna,direccion);
        promesa.then(function(dato){
            var productos = dato.productos;
            //var mproductos=[];
            for(var i=0;i<productos.length;i++){
                var inventarios=[],cantidadTotal=0;
                productos[i].fecha_vencimiento=new Date(productos[i].fecha_vencimiento);
                productos[i].cantidad_total=productos[i].cantidad;
                /*mproductos.push({id:productos[i].id,descuento:productos[i].descuento,descuento_fijo:productos[i].descuento_fijo,
                                nombre:productos[i].nombre,codigo:productos[i].codigo,grupo:productos[i].grupo,subgrupo:productos[i].subgrupo,
                                inventarios:inventarios,cantidad_total:productos[i].cantidad,fecha_vencimiento:new Date(productos[i].fecha_vencimiento),precio_unitario:productos[i].precio_unitario,
                                porcentaje:$scope.porcentaje,color:$scope.color});*/
            }
            $scope.paginas=[];
            for(var i=1;i<=dato.paginas;i++){
                $scope.paginas.push(i);
            }

            $scope.productos=productos;

            blockUI.stop();
        });
    }

    $scope.buscarProducto=function(query) {
        if(query!="" && query!=undefined){
            var promesa=ListaProductosEmpresa($scope.usuario.id_empresa,query);
            return promesa;
        }
        
    }
    
    $scope.establecerProducto=function(producto){
        producto.tipoProducto=producto['tipoProducto']==null?{id:producto['tipoProducto.id'],nombre:producto['tipoProducto.nombre'],nombre_corto:producto['tipoProducto.nombre_corto']}:producto.tipoProducto;
        $scope.editar_precio=false;
        var promesa=ListaInventariosProducto(producto.id,$scope.venta.almacen.id);
        promesa.then(function(inventarios){
            producto.inventarios=inventarios;
            for(var i=0;i<producto.inventarios.length;i++){
                producto.inventarios[i].fecha_vencimiento=(producto.inventarios[i].fecha_vencimiento?new Date(producto.inventarios[i].fecha_vencimiento):null);
                producto.inventarios[i].fechaVencimientoTexto=(producto.inventarios[i].fecha_vencimiento?producto.inventarios[i].fecha_vencimiento.getDate()+"/"+(producto.inventarios[i].fecha_vencimiento.getMonth()+1)+"/"+producto.inventarios[i].fecha_vencimiento.getFullYear():"");
                producto.inventarios[i].detallesMovimiento[0].movimiento.fecha=new Date(producto.inventarios[i].detallesMovimiento[0].movimiento.fecha);
                producto.inventarios[i].detallesMovimiento[0].movimiento.fechaTexto=producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getDate()+"/"+(producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getMonth()+1)+"/"+producto.inventarios[i].detallesMovimiento[0].movimiento.fecha.getFullYear();
            }
            $scope.inventariosDisponibleProducto=[];
            $scope.inventariosDisponibleProducto.push({id:0,fecha_vencimiento:"TODOS",fechaVencimientoTexto:"TODOS"});
            $scope.inventariosDisponibleProducto=$scope.inventariosDisponibleProducto.concat(producto.inventarios);
            var inventarioDisponible=$scope.obtenerInventarioTotal(producto);
            $scope.detalleVenta={producto:producto,precio_unitario:producto.precio_unitario,inventarioProducto:$scope.inventariosDisponibleProducto[0],
                                inventario_disponible:inventarioDisponible,costos:producto.activar_inventario?producto.inventarios:[],
                                cantidad:1,descuento:producto.descuento,recargo:0,ice:0,excento:0,tipo_descuento:(producto.descuento>0?true:false),tipo_recargo:false};
            $scope.colorearInventarioDisponible(inventarioDisponible,producto);
            $scope.calcularImporte();
            $scope.cerrarPopup($scope.idModalInventario);
            $scope.enfocar('cantidad');
        });
    }

    $scope.obtenerInventarioTotal=function(producto){
        var cantidadTotal = 0;
        if(producto.activar_inventario){
            for(var i = 0; i < producto.inventarios.length; i++){
                cantidadTotal += (producto.inventarios[i].cantidad);
            }
            for(var j=0;j<$scope.venta.detallesVenta.length;j++){
                if($scope.venta.detallesVenta[j].producto.id==producto.id){
                    cantidadTotal=cantidadTotal-$scope.venta.detallesVenta[j].cantidad;
                }
            }
        }else{
            cantidadTotal=500000;
        }
        return cantidadTotal;
    }

    $scope.colorearInventarioDisponible=function(inventarioDisponible,producto){
        if(inventarioDisponible==0){
            $scope.porcentaje="100";
            $scope.color="red";
        }else if(inventarioDisponible>((producto.inventario_minimo*3)+1)){
            $scope.porcentaje="100";
            $scope.color="green";
        }else if(inventarioDisponible>((producto.inventario_minimo*2)+1)){
            $scope.porcentaje="75";
            $scope.color="green";
        }else if(inventarioDisponible>((producto.inventario_minimo*1.5)+1)){
            $scope.porcentaje="50";
            $scope.color="green"
        }else if(inventarioDisponible==(producto.inventario_minimo+1)){
            $scope.porcentaje="38";
            $scope.color="yellow";
        }else if(inventarioDisponible==producto.inventario_minimo){
            $scope.porcentaje="25";
            $scope.color="red";
        }else if(inventarioDisponible<producto.inventario_minimo && inventarioDisponible>0){
            $scope.porcentaje="12";
            $scope.color="red";
        }
    }
    
    $scope.actualizarInventarioDisponibleFechaVencimiento=function(detalleVenta){
        if(detalleVenta.inventarioProducto.id!=0){
            detalleVenta.costos=[];
            detalleVenta.costos.push(detalleVenta.inventarioProducto);
            detalleVenta.inventario_disponible=$scope.obtenerInventarioTotalPorFechaVencimiento(detalleVenta);
            detalleVenta.lote=detalleVenta.inventarioProducto.lote;
        }else{
            detalleVenta.inventario_disponible=$scope.obtenerInventarioTotal(detalleVenta.producto);
            detalleVenta.costos=detalleVenta.producto.inventarios;
            detalleVenta.lote="";
        }
        $scope.colorearInventarioDisponible(detalleVenta.inventario_disponible,detalleVenta.producto);
        $scope.calcularImporte();
    }

    $scope.enfocar=function(elemento){
        $timeout(function() {
            $("#"+elemento).focus();
        },0);
    }

    $scope.interceptarTecla=function(keyEvent,elemento,esEnfocar){
        if (keyEvent.which === 13){
            if(esEnfocar){
                $scope.enfocar(elemento);
            }else{
                $timeout(function() {
                    $('#'+elemento).trigger('click');
                }, 0);
            }
        }
    }
    
    $scope.establecerCliente=function(cliente, $model, $label){
        console.log('el clientes es ::::: ', cliente);
        $scope.$model = $model;
        $scope.$label = $label;
        
        $scope.venta.cliente.razon_social=cliente.persona.nombre_completo;
        $scope.venta.cliente.nit=parseInt(cliente.persona.ci);
        $scope.venta.cliente.campo=cliente.campo;
        $scope.venta.cliente.cargos=cliente.cargos;
        $scope.venta.cliente.designacion_empresa=cliente.designacion_empresa;
        $scope.enfocar('razon_social');
        $scope.$apply();
    }

    $scope.obtenerInventarioTotalPorFechaVencimiento=function(detalleVenta){
        var cantidadTotal = detalleVenta.inventarioProducto.cantidad;
        for(var j=0;j<$scope.venta.detallesVenta.length;j++){
            if($scope.venta.detallesVenta[j].producto.id==detalleVenta.producto.id && $scope.venta.detallesVenta[j].costos[0].id==detalleVenta.inventarioProducto.id){
                cantidadTotal=cantidadTotal-$scope.venta.detallesVenta[j].cantidad;
            }
        }
        return cantidadTotal;
    }
    
    $scope.agregarDetalleVenta=function(detalleVenta){
        if(detalleVenta.producto.activar_inventario){
            if(detalleVenta.costos.length>1){
                var cantidadTotal=detalleVenta.cantidad,i=0,detalleVentaOriginal=JSON.parse(JSON.stringify(detalleVenta));
                while(i<detalleVenta.costos.length && cantidadTotal>0){
                    detalleVenta.inventarioProducto=detalleVenta.costos[i];
                    var cantidadDisponible=$scope.obtenerInventarioTotalPorFechaVencimiento(detalleVenta);
                    if(cantidadDisponible>0){
                        var nuevoDetalleVenta = JSON.parse(JSON.stringify(detalleVentaOriginal));
                        var cantidadParcial;
                        if(i>0){
                            nuevoDetalleVenta.descuento=0;
                            nuevoDetalleVenta.recargo=0;
                            nuevoDetalleVenta.ice=0;
                            nuevoDetalleVenta.excento=0;
                        }
                        $scope.detalleVenta=nuevoDetalleVenta;
                        if(cantidadTotal>cantidadDisponible){
                            cantidadParcial=cantidadDisponible;
                            cantidadTotal=cantidadTotal-cantidadDisponible
                        }else{
                            cantidadParcial=cantidadTotal;
                            cantidadTotal=0;
                        }
                        nuevoDetalleVenta.cantidad=cantidadParcial;
                        nuevoDetalleVenta.fecha_vencimiento=detalleVenta.costos[i].fecha_vencimiento;
                        nuevoDetalleVenta.lote=detalleVenta.costos[i].lote;
                        nuevoDetalleVenta.costos=[];
                        nuevoDetalleVenta.costos.push(detalleVenta.costos[i]);
                        nuevoDetalleVenta.inventario=detalleVenta.costos[i];
                        $scope.calcularImporte();
                        $scope.venta.detallesVenta.push(nuevoDetalleVenta); 
                    }
                    i++;
                }
            }else{
                detalleVenta.fecha_vencimiento=detalleVenta.costos[0].fecha_vencimiento;
                detalleVenta.lote=detalleVenta.costos[0].lote;
                detalleVenta.inventario=detalleVenta.costos[0];
                $scope.venta.detallesVenta.push(detalleVenta);
            }
        }else{
            $scope.venta.detallesVenta.push(detalleVenta);
        }
        $scope.inventariosDisponibleProducto=[];
        $scope.sumarTotal();
        $scope.sumarTotalImporte();
        $scope.calcularSaldo();
        $scope.calcularCambio();
        $scope.detalleVenta={producto:{activar_inventario:true},cantidad:1,descuento:0,recargo:0,ice:0,excento:0,tipo_descuento:false,tipo_recargo:false}
        $scope.enfocar('id_producto');
    }

    $scope.eliminarDetalleVenta=function(detalleVenta){
        $scope.venta.detallesVenta.splice($scope.venta.detallesVenta.indexOf(detalleVenta),1);
        $scope.sumarTotal();
        $scope.sumarTotalImporte();
        $scope.calcularSaldo();
        $scope.calcularCambio();
        $scope.capturarInteraccion();
    }
    
    $scope.cambiarTipoPago=function(tipoPagoO){
        var tipoPago=$.grep($scope.tiposPago, function(e){return e.id == tipoPagoO.id;})[0];
        $scope.esContado=tipoPago.nombre_corto=='CONT'?true:false;
        $scope.calcularCambio();
    }
    
    $scope.recalcular=function(){
        $scope.calcularImporte();
    }

    $scope.calcularCambio=function(){
        if($scope.esContado){
            $scope.venta.cambio=Math.round(($scope.venta.pagado-$scope.venta.total)*100)/100;
            $scope.pagoMinimo=$scope.venta.total;
        }else{
            $scope.venta.cambio=0;
            $scope.pagoMinimo=0;
        }
    }

    $scope.calcularImporte=function(){
        $scope.detalleVenta.importe=Math.round(($scope.detalleVenta.cantidad*$scope.detalleVenta.precio_unitario)*1000)/1000;
        var descuento,recargo;
        if($scope.detalleVenta.tipo_descuento){
            descuento=$scope.detalleVenta.importe*($scope.detalleVenta.descuento/100);
        }else{
            descuento=$scope.detalleVenta.descuento;
        }
        if($scope.detalleVenta.tipo_recargo){
            recargo=$scope.detalleVenta.importe*($scope.detalleVenta.recargo/100);
        }else{
            recargo=$scope.detalleVenta.recargo;
        }
        $scope.detalleVenta.total=Math.round(($scope.detalleVenta.importe-descuento+recargo-$scope.detalleVenta.ice-$scope.detalleVenta.excento)*1000)/1000;
    }

    $scope.sumarTotalImporte=function(){
        var sumaImporte=0;
        for(var i=0;i<$scope.venta.detallesVenta.length;i++){
            sumaImporte=sumaImporte+$scope.venta.detallesVenta[i].importe;
        }       
        $scope.venta.importe=Math.round((sumaImporte)*1000)/1000;
    }
    
    $scope.sumarTotal=function(){
        var sumaTotal=0;
        for(var i=0;i<$scope.venta.detallesVenta.length;i++){
            sumaTotal=sumaTotal+$scope.venta.detallesVenta[i].total;
        }       
        $scope.venta.total=Math.round((sumaTotal)*1000)/1000;
        $scope.venta.pagado = $scope.venta.total;

    }

    $scope.calcularSaldo=function(){
        $scope.venta.saldo=$scope.venta.total-$scope.venta.a_cuenta;
    }

    $scope.modificarPrecio=function(){
        $scope.editar_precio=true;
    }

    $scope.establecerPrecio=function(){
        $scope.editar_precio=false;
    }

    $scope.crearNuevaVenta=function(){
        $scope.venta=new Venta({id_empresa:$scope.usuario.id_empresa,id_usuario:$scope.usuario.id,cliente:{},
                                detallesVenta:[],detallesVentaNoConsolidadas:[],pagado:0,cambio:0,despachado:false,vendedor:null});
        $scope.venta.sucursal=$scope.sucursales.length==1?$scope.sucursales[0]:null;
        if($scope.venta.sucursal){
            $scope.obtenerAlmacenesActividades($scope.venta.sucursal.id);
        }
        $scope.venta.movimiento=$scope.movimientosEgreso[0];
        $scope.obtenerTipoEgreso($scope.venta.movimiento);
        var fechaActual=new Date();
        $scope.venta.fechaTexto=fechaActual.getDate()+"/"+(fechaActual.getMonth()+1)+"/"+fechaActual.getFullYear();
        $scope.venta.tipoPago=$scope.tiposPago[0];
        $scope.cambiarTipoPago($scope.venta.tipoPago);
        $scope.editar_precio=false;
        $scope.detalleVenta={producto:{activar_inventario:true},cantidad:1,descuento:0,recargo:0,ice:0,excento:0,tipo_descuento:false,tipo_recargo:false}
        $scope.abrirPopup($scope.idModalWizardFarmaciaEdicion);
        $scope.enfocar('nit');
    }

    $scope.buscarCliente=function(query) {      
        if(query!="" && query!=undefined){
            var promesa=PacientesNit($scope.usuario.id_empresa,query);
            return promesa;
        }
    };
    
    $scope.cerrarPopupFarmaciaEdicion=function(){
        $scope.cerrarPopup($scope.idModalWizardFarmaciaEdicion);
    }

    $scope.abrirPopupInventario=function(){
        $scope.abs = $window.Math.abs;
        $scope.itemsPorPagina=10;
        $scope.paginaActual=1;
        $scope.columna="nombre";
        $scope.direccion="asc";
        $scope.textoBusqueda="";
        if($scope.venta.almacen){
            $scope.almacenBusqueda=$scope.venta.almacen;
            $scope.buscarInventarios($scope.almacenBusqueda.id,$scope.paginaActual,$scope.itemsPorPagina,$scope.textoBusqueda,$scope.columna,$scope.direccion);
        }
        $scope.abrirPopup($scope.idModalInventario);
    }


    $scope.filtrarVentas=function(sucursalesUsuario,inicio,fin,razon_social,nit,monto,tipo_pago,sucursal,transaccion,usuario){
        razon_social=(razon_social==""||razon_social==undefined)?0:razon_social;
        nit=(nit==null||nit==undefined)?0:nit;
        monto=(monto==null||monto==undefined)?0:monto;
        tipo_pago=(tipo_pago==undefined)?0:tipo_pago;
        sucursal=(sucursal==null||sucursal==undefined)?0:sucursal;
        transaccion=(transaccion==null||transaccion==undefined)?0:transaccion;
        var roles=$.grep($scope.usuario.rolesUsuario, function(e){return e.rol.nombre == $scope.diccionario.ROL_ADMINISTRADOR;});
        usuario=roles.length>0?((usuario==""||usuario==undefined)?0:usuario):$scope.usuario.nombre_usuario;
        blockUI.start();
        
        $scope.razon_sociald=razon_social;
        $scope.nitd=nit;
        $scope.montod=monto;
        $scope.usuariod=usuario;
        
        if(transaccion!=0)$scope.transacciond=$.grep($scope.movimientosEgreso, function(e){return e.id == transaccion;}).length>0?$.grep($scope.movimientosEgreso, function(e){return e.id == transaccion;})[0].nombre:"todos";
        if(sucursal!=0)$scope.sucursald=$.grep($scope.sucursales, function(e){return e.id == sucursal;}).length>0?$.grep($scope.sucursales, function(e){return e.id == sucursal;})[0].nombre:"todos";
        if(tipo_pago!=0)$scope.tipoPagod=$.grep($scope.tiposPago, function(e){return e.id == tipo_pago;}).length>0?$.grep($scope.tiposPago, function(e){return e.id == tipo_pago;})[0].nombre:"todos";
        
        
        inicio=new Date($scope.convertirFecha(inicio));
        fin=new Date($scope.convertirFecha(fin));
        var promesa=Ventas(sucursalesUsuario,inicio,fin,razon_social,nit,monto,tipo_pago,sucursal,transaccion,usuario);
        promesa.then(function(ventas){
            $scope.ventas=ventas;
            console.log(ventas);
            blockUI.stop();
            
            //$scope.aplicarTabla('tabla-ventas',6);
        });
    }

    $scope.mostrarDescuentos=function(){
        var style=$(".des-datos").css("display");
        if(style=="none"){
            $(".des-datos").css("display","");
        }else{
            $(".des-datos").css("display","none");
        }
    }

    $scope.guardarVenta=function(valido,venta){
        if(valido){
            $scope.ocultarMensajesValidacion();
            var tiempoActual=new Date();
            venta.fecha=new Date($scope.convertirFecha(venta.fechaTexto));
            venta.fecha.setHours(tiempoActual.getHours());
            venta.fecha.setMinutes(tiempoActual.getMinutes());
            venta.farmacia = true;
            //venta.receptor=(venta.receptor!=undefined && venta.receptor!=null)?venta.receptor:((venta.receptor==undefined || venta.receptor==null)?(venta.textoVendedor!=""?{nombre_completo:venta.textoVendedor}:null):venta.receptor);
            blockUI.start();
            if(venta.id){
                    Venta.update({ idCompra:compra.id }, compra,function(res){
                        blockUI.stop();
                        $scope.cerrarPopupFarmaciaEdicion();
                        $scope.mostrarMensaje('Actualizado Exitosamente!');
                        $scope.recargarItemsTabla();
                    });
            }else{
                var movimiento=venta.movimiento.nombre_corto;
                venta.$save(function(res){
                    if(res.hasError){
                        blockUI.stop();
                        $scope.crearNuevaVenta();
                        $scope.mostrarMensaje(res.message);
                    }else{
                        blockUI.stop();
                        $scope.cerrarPopupFarmaciaEdicion();
                        console.log('el resultado guardado===== ', res);
                        // var promesa = VentaFarmacia(ficha);
                        // promesa.then(function (dato) {
                        //     $scope.mostrarMensaje(dato.message)
                        // });
                        ImprimirSalidaFarmacia(movimiento,res,true,$scope.usuario);
                        $scope.crearNuevaVenta();
                        $scope.ocultarMensajesValidacion();
                        $scope.mostrarMensaje('Venta registrada exitosamente!');
                    }
                },function(error) {
                    blockUI.stop();
                    $scope.cerrarPopupFarmaciaEdicion();
                    $scope.mostrarMensaje('Ocurrio un problema al momento de guardar!');
                    $scope.recargarItemsTabla();
                });
            }
        }
    }

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalWizardFarmaciaEdicion);
        $scope.eliminarPopup($scope.idModalInventario);
    });

    $scope.inicio();


    
    

});