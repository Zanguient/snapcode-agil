angular.module('agil.controladores')

.controller('ControladoresFarmacia', function($scope,$localStorage,$location,$templateCache,$route, $filter,$window, $timeout, blockUI, ClasesTipo, ConfiguracionVentaVistaDatos, ProductosPanel, InventarioPaginador, ListaInventariosProducto, ListaProductosEmpresa, Venta, PacientesNit, ImprimirSalidaFarmacia, Ventas, VentasFarmacia, DatosVentaFarmacia, VentaEmpresaDatos, VentaFarmacia){
	
    $scope.usuario=JSON.parse($localStorage.usuario);
    convertUrlToBase64Image($scope.usuario.empresa.imagen,function(imagenEmpresa){
        $scope.usuario.empresa.imagen=imagenEmpresa;
    });

    $scope.idModalWizardFarmaciaEdicion='modal-wizard-farmacia-edicion';
    $scope.idModalInventario="dialog-productos-venta";
    $scope.idModalWizardVentaVista = 'modal-wizard-venta-vista';
    $scope.idModalPago = 'dialog-pago';

    $scope.$on('$viewContentLoaded', function () {    
        ejecutarScriptsFarmacia($scope.idModalWizardFarmaciaEdicion, $scope.idModalInventario, $scope.idModalWizardVentaVista, $scope.idModalPago);
    });

    $scope.inicio=function(){
        $scope.ordenProductos=true;
        $scope.esContado=true;
        //$scope.obtenerClientes();
        $scope.obtenerCargos();
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

    $scope.buscarInventarios=function(idAlmacen,pagina,itemsPagina,texto,columna,direccion, cantidad){
        blockUI.start();
        $scope.itemsPorPagina=itemsPagina;
        if(texto=="" || texto==null){
            texto=0;
        }else{
            $scope.textoBusqueda=texto;
        }
        $scope.paginaActual=pagina;
        var promesa=InventarioPaginador($scope.usuario.id_empresa,idAlmacen,pagina,itemsPagina,texto,columna,direccion,cantidad);
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

        $scope.venta.cliente.id=cliente.id;
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
        $scope.venta=new VentaFarmacia({id_empresa:$scope.usuario.id_empresa,id_usuario:$scope.usuario.id,cliente:{},
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
        $scope.cantidadInv = "0";
        $scope.textoBusqueda="";
        if($scope.venta.almacen){
            $scope.almacenBusqueda=$scope.venta.almacen;
            $scope.buscarInventarios($scope.almacenBusqueda.id,$scope.paginaActual,$scope.itemsPorPagina,$scope.textoBusqueda,$scope.columna,$scope.direccion,$scope.cantidadInv);
        }
        $scope.abrirPopup($scope.idModalInventario);
    }

    $scope.obtenerCargos = function () {
        blockUI.start();
        var promesa = ClasesTipo("RRHH_CARGO");
        promesa.then(function (entidad) {
            var cargos = entidad.clases
            $scope.llenarCargos(cargos)
            blockUI.stop();
        });
    }

    $scope.llenarCargos = function (cargos) {
        $scope.nuevoRH = ""
        $scope.cargos = [];          
        for (var i = 0; i < cargos.length; i++) {
            var cargo = {
                nombre: cargos[i].nombre,
                maker: "",
                ticked: false,
                id: cargos[i].id
            }
            $scope.cargos.push(cargo);
        }           
    }

    $scope.obtenerVentas = function () {
        var currentDate = new Date();
        var currentDateString = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();
        $scope.filtrarVentas($scope.sucursalesUsuario, currentDateString, currentDateString);
    }


    $scope.filtrarVentas=function(sucursalesUsuario,inicio,fin,codigo,nombreCompleto,ci,tipo_pago,campo,cargo,empresa, numero_receta){
        codigo=(codigo==""||codigo==undefined)?0:codigo;
        nombreCompleto=(nombreCompleto==""||nombreCompleto==undefined)?0:nombreCompleto;
        ci=(ci==null||ci==undefined)?0:ci;
        tipo_pago=(tipo_pago==undefined)?0:tipo_pago;
        campo=(campo==""||campo==undefined)?0:campo;
        cargo=(cargo==null||cargo==undefined)?0:cargo;
        empresa=(empresa==""||empresa==undefined)?0:empresa;
        numero_receta=(numero_receta==""||numero_receta==null||numero_receta==undefined)?0:numero_receta;
        
        blockUI.start();
        
        if(tipo_pago!=0)$scope.tipoPagod=$.grep($scope.tiposPago, function(e){return e.id == tipo_pago;}).length>0?$.grep($scope.tiposPago, function(e){return e.id == tipo_pago;})[0].nombre:"todos";
        
        
        inicio=new Date($scope.convertirFecha(inicio));
        fin=new Date($scope.convertirFecha(fin));
        var promesa=VentasFarmacia(sucursalesUsuario,inicio,fin,codigo,nombreCompleto,ci,tipo_pago,campo,cargo,empresa,numero_receta);
        promesa.then(function(ventas){
            $scope.ventas=ventas;
            // rehacer modelo paciente en inventario farmacia =========

            blockUI.stop();
            
            //$scope.aplicarTabla('tabla-ventas',6);
        });
    }

    $scope.verVenta = function (venta) {
        $scope.venta = venta;
        $scope.abrirPopup($scope.idModalWizardVentaVista);
    }

    $scope.cerrarPopupVista = function () {
        $scope.cerrarPopup($scope.idModalWizardVentaVista);
    }

    $scope.imprimirVenta = function (venta) {
        var promesa = DatosVentaFarmacia(venta.id, $scope.usuario.id_empresa);
        promesa.then(function (datos) {
            var ventaConsultada = datos.venta;
            ventaConsultada.configuracion = datos.configuracion;
            ventaConsultada.sucursal = datos.sucursal;
            ventaConsultada.numero_literal = datos.numero_literal;
            ventaConsultada.pieFactura = datos.pieFactura;
            ventaConsultada.sucursalDestino = datos.sucursalDestino;
            var fecha = new Date(ventaConsultada.fecha);
            ventaConsultada.fechaTexto = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
            ImprimirSalidaFarmacia(ventaConsultada.movimiento.clase.nombre_corto, ventaConsultada, false, $scope.usuario);
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
            venta.esFarmacia = true;
            console.log('las ventas son ==== ', venta);
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
                        // ImprimirSalidaFarmacia(movimiento,res,true,$scope.usuario);
                        //  ==== corrgir para imprima la proforma =====================================
                        $scope.imprimirVenta(res);
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

    $scope.sumarMonto = function () {
        var suma = 0;
        for (var i = 0; i < $scope.ventas.length; i++) {
            if (($scope.ventas[i].movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ||
                $scope.ventas[i].movimiento.clase.nombre_corto == $scope.diccionario.EGRE_PROFORMA) && $scope.ventas[i].activa) {
                suma = suma + $scope.ventas[i].total;
            }
        }
        return Math.round(suma * 100) / 100;
    }

    $scope.trueDetalle = true;
    $scope.verDetalle = function () {
        if ($scope.trueDetalle) {
            $scope.trueDetalle = false;
        } else {
            $scope.trueDetalle = true;
        }
    }

    $scope.imprimirFiltroCajaCartaOficio = function (ventas, fechaInicio, fechaFin) {
        var doc = new PDFDocument({compress: false, size: [612, 792], margin: 0 });
        var stream = doc.pipe(blobStream());
        var itemsPorPagina = 20;
        if ($scope.trueDetalle) {
            var c = ventas.length * 2;
            for (var i = 0; i < ventas.length; i++) {
                c = c + ventas[i].detallesVenta.length;
            }
            var totalPaginas = Math.ceil(c / (itemsPorPagina));
        } else {
            var itemsPorPagina = 20;
            var totalPaginas = Math.ceil(ventas.length / itemsPorPagina);
        }
        var y = 100, items = 0, pagina = 1;
        $scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, ventas, fechaInicio, fechaFin);

        doc.font('Helvetica', 7);

        for (var i = 0; i < ventas.length; i++) {
            doc.font('Helvetica', 7);
            doc.rect(50, y + 9, 520, 0).stroke();

            doc.text(i + 1, 55, y + 20);
            doc.font('Helvetica', 6);
            ventas[i].fecha = new Date(ventas[i].fecha);
            doc.text(ventas[i].fecha.getDate() + "/" + (ventas[i].fecha.getMonth() + 1) + "/" + ventas[i].fecha.getFullYear(), 65, y + 20);
            doc.text(ventas[i].factura, 120, y + 20, { width: 60 });
            doc.font('Helvetica', 6);
            doc.text(ventas[i].farmacia.paciente.persona.nombre_completo, 170, y + 15, { width: 75 });
            doc.font('Helvetica', 7);
            doc.text(ventas[i].farmacia.paciente.designacion_empresa, 245, y + 20);       
            doc.text(ventas[i].farmacia.paciente.codigo, 305, y + 20);
            doc.text(ventas[i].farmacia.paciente.campo, 345, y + 20);
            var cargos = [];

            for (var k = 0; k < ventas[i].farmacia.paciente.cargos.length; k++) {
                cargos.push(ventas[i].farmacia.paciente.cargos[k].cargo.nombre);
            }

            doc.text(cargos.toString(), 385, y + 20, { width: 50 });
            
            doc.text(ventas[i].total, 425, y + 20);
            if (ventas[i].tipoPago) {
                doc.text(ventas[i].tipoPago.nombre, 455, y + 20);
                if (ventas[i].tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
                    doc.font('Helvetica', 6);
                    doc.text("Plazo: " + ventas[i].dias_credito + " A cuenta: Bs " + ventas[i].a_cuenta + " Saldo: Bs " + ventas[i].saldo, 510, y + 16, { width: 55 });
                }
            } else {
                doc.text("", 455, y + 20);
                doc.text("", 520, y + 16, { width: 65 });
            }

            if ($scope.trueDetalle) {
                doc.rect(50, y + 34, 520, 0).stroke();
                doc.font('Helvetica', 7);
                y = y + 50;

                doc.text("N°", 105, y);
                doc.text("Nombre", 115, y);
                doc.text("Codigo Item", 170, y);
                doc.text("Unidad de Med", 230, y);
                doc.text("Cantidad", 295, y);
                doc.text("Importe", 355, y);
                items++;
                for (var j = 0; j < ventas[i].detallesVenta.length; j++) {
                    doc.font('Helvetica', 7);

                    doc.text(j + 1, 105, y + 20);
                    doc.text(ventas[i].detallesVenta[j].producto.nombre, 115, y + 20, { width: 55 });
                    doc.text(ventas[i].detallesVenta[j].producto.id, 170, y + 20);
                    doc.text(ventas[i].detallesVenta[j].producto.unidad_medida, 230, y + 20);
                    doc.text(ventas[i].detallesVenta[j].cantidad, 295, y + 20);
                    doc.text(ventas[i].detallesVenta[j].importe, 355, y + 20);

                    y = y + 24
                    items++;
                    if (items + 1 > itemsPorPagina - 1) {
                        y = y + 10;

                        doc.text(pagina + " de " + totalPaginas, 520, 705);
                        var currentDate = new Date();
                        doc.text("FECHA : " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 55, 705);
                        doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 150, 705);

                        doc.addPage({ size: [612, 792], margin: 10 });
                        y = 100;
                        items = 0;
                        pagina = pagina + 1;
                        $scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, ventas, fechaInicio, fechaFin);
                    }
                }

                doc.font('Helvetica', 7);
                y = y + 4;
                items++;

                if (items > itemsPorPagina) {
                    y = y + 10;
                    doc.text(pagina + " de " + totalPaginas, 520, 705);
                    var currentDate = new Date();
                    //doc.rect(50,y+6,520,0).stroke();
                    doc.text("FECHA : " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 55, 705);
                    doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 150, 705);

                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 100;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, ventas, fechaInicio, fechaFin);
                }
            } else {

                doc.font('Helvetica', 7);
                y = y + 30;
                items++;

                if (items == itemsPorPagina) {
                    doc.text(pagina + " de " + totalPaginas, 520, 705);
                    var currentDate = new Date();
                    doc.text("FECHA : " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 55, 705);
                    doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 150, 705);

                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 100;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.imprimirCabeceraFiltroCajaCartaOficio(doc, 1, totalPaginas, ventas, fechaInicio, fechaFin);
                }

            }
        }
        doc.font('Helvetica', 7);
        doc.text(pagina + " de " + totalPaginas, 520, 705);
        var currentDate = new Date();
        doc.text("FECHA : " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + "   " + "Hr:" + currentDate.getHours() + ":" + currentDate.getMinutes(), 55, 705);
        doc.text("USUARIO: " + $scope.usuario.nombre_usuario, 150, 705);
        doc.end();
        stream.on('finish', function () {
            var fileURL = stream.toBlobURL('application/pdf');
            window.open(fileURL, '_blank', 'location=no');
        });
        blockUI.stop();
    }
    $scope.imprimirCabeceraFiltroCajaCartaOficio = function (doc, pagina, totalPaginas, ventas, fechaInicio, fechaFin) {

        doc.font('Helvetica-Bold', 16);
        doc.text('REPORTE', 0, 40, { align: 'center' });
        doc.font('Helvetica-Bold', 8);
        doc.rect(50, 80, 520, 620).stroke();

        doc.text("Desde: " + fechaInicio + " Hasta: " + fechaFin, 0, 55, { align: 'center' });

        var filtrod = [$scope.razon_sociald, $scope.nitd, $scope.montod, $scope.usuariod, $scope.transacciond, $scope.sucursald, $scope.tipoPagod];
        var x = 85, c = 0, cadena = "";
        doc.text("Filtro: ", 55, 65);
        for (var i = 0; i < filtrod.length; i++) {
            if (filtrod[i] != 0 && filtrod[i] != undefined) {
                //doc.text(filtrod[i]+", ",x,65);
                cadena = cadena + filtrod[i] + ", ";
                x = x + 65;

            } else {
                c = c + 1;
                if (c == 7) doc.text("GENERAL", 85, 65);
            }
        }

        doc.text(cadena, 85, 65);
        doc.font('Helvetica-Bold', 7);
        //doc.rect(50,80,520,25).stroke();


        doc.font('Helvetica-Bold', 8);

        doc.text("N°", 55, 90);
        doc.text("Fecha", 65, 90);
        doc.text("Receta", 120, 90, { width: 43 });
        doc.text("Nombre Completo", 170, 90);
        doc.text("Empresa", 245, 90, { width: 43 });
        doc.text("Código", 305, 90);
        doc.text("Campo", 345, 90, { width: 43 });
        doc.text("Cargo", 385, 90, { width: 43 });
        doc.text("Monto", 420, 90);
        doc.text("Tipo de Pago", 455, 90);
        doc.text("Pago", 520, 90);
    }

    $scope.imprimirFiltroExcelCajaCartaOficio = function (ventas) {
        blockUI.start();

        var data = [["N°", "Fecha", "Receta", "Nombre Completo", "Empresa", "Código", "Campo", "Cargo", "Monto", "Tipo de Pago", "Pago"]]
        /*var sumaImporte=0,sumaImporteNo=0,sumaTotal=0,sumaDescuentos=0,sumaImporteBase=0,sumaCredito=0;*/
        for (var i = 0; i < ventas.length; i++) {
            var columns = [];
            ventas[i].fecha = new Date(ventas[i].fecha);
            columns.push(i + 1);
            columns.push(ventas[i].fecha.getDate() + "/" + (ventas[i].fecha.getMonth() + 1) + "/" + ventas[i].fecha.getFullYear());
            columns.push(ventas[i].factura);
            columns.push(ventas[i].farmacia.paciente.persona.nombre_completo);
            columns.push(ventas[i].farmacia.paciente.designacion_empresa);
            columns.push(ventas[i].farmacia.paciente.codigo);
            
            columns.push(ventas[i].farmacia.paciente.campo);
            var cargos = [];

            for (var j = 0; j < ventas[i].farmacia.paciente.cargos.length; j++) {
                cargos.push(ventas[i].farmacia.paciente.cargos[j].cargo.nombre);
            }

            columns.push(cargos.toString());
            columns.push(ventas[i].total);
            if (ventas[i].tipoPago) {
                columns.push(ventas[i].tipoPago.nombre);

                if (ventas[i].tipoPago.nombre == $scope.diccionario.TIPO_PAGO_CREDITO) {
                    columns.push("Plazo: " + ventas[i].dias_credito + " A cuenta: Bs " + ventas[i].a_cuenta + " Saldo: Bs " + ventas[i].saldo);
                }
            } else {
                columns.push("");
            }
            if (ventas[i].movimiento.clase.nombre == "TRASPASO") {
                columns.push("");

                columns.push(ventas[i].almacenTraspaso.sucursal.nombre);
            }

            data.push(columns);
            if ($scope.trueDetalle) {
                data.push(["", "", "", "", "N°", "Nombre", "Codigo Item", "Unidad de Med", "Cantidad", "Importe"]);
                for (var j = 0; j < ventas[i].detallesVenta.length; j++) {
                    columns = [];
                    columns.push("");
                    columns.push("");
                    columns.push("");
                    columns.push("");
                    columns.push(j + 1);
                    columns.push(ventas[i].detallesVenta[j].producto.nombre);
                    columns.push(ventas[i].detallesVenta[j].producto.id);
                    columns.push(ventas[i].detallesVenta[j].producto.unidad_medida);
                    columns.push(ventas[i].detallesVenta[j].cantidad);
                    columns.push(ventas[i].detallesVenta[j].importe);

                    data.push(columns);
                }
            }
            if (i + 1 == ventas.length) {
                columns = [];
                columns.push("");
                columns.push("");
                columns.push("");
                columns.push("");
                columns.push("");
                columns.push("");
                columns.push("");
                columns.push("");
                columns.push("");
                columns.push("");
                columns.push("");

                data.push(columns);
            }

        }

        var ws_name = "SheetJS";
        var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
        /* add worksheet to workbook */
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "Reporte-ventas-farmacia.xlsx");
        blockUI.stop();

    }

    $scope.abrirPopupPago = function (venta) {
        $scope.venta = venta;
        $scope.pago = null;
        $scope.abrirPopup($scope.idModalPago);
    }

    $scope.cerrarPopupPago = function () {
        $scope.cerrarPopup($scope.idModalPago);
    }

    $scope.efectuarPago = function (pago) {
        blockUI.start();
        VentaEmpresaDatos.update({ id: $scope.venta.id, id_empresa: $scope.usuario.id_empresa }, { pago: pago, id_usuario_cajero: $scope.usuario.id }, function (data) {
            $scope.mostrarMensaje(data.mensaje);
            $scope.cerrarPopup($scope.idModalPago);
            $scope.obtenerVentas();
            $scope.imprimirRecibo(data, data.venta, pago);
            blockUI.stop();
        }, function (error) {
            $scope.mostrarMensaje(error);
            $scope.cerrarPopup($scope.idModalPago);
            $scope.obtenerVentas();
            blockUI.stop();
        });
    }

    $scope.imprimirRecibo = function (data, venta, pago) {
        blockUI.start();
        var doc = new PDFDocument({compress: false, size: [227, 353], margin: 10 });
        var stream = doc.pipe(blobStream());
        doc.moveDown(2);
        doc.font('Helvetica-Bold', 8);
        doc.text($scope.usuario.empresa.razon_social.toUpperCase(), { align: 'center' });
        doc.moveDown(0.4);
        doc.font('Helvetica', 7);
        doc.text(venta.almacen.sucursal.nombre.toUpperCase(), { align: 'center' });
        doc.moveDown(0.4);
        doc.text(venta.almacen.sucursal.direccion.toUpperCase(), { align: 'center' });
        doc.moveDown(0.4);
        var telefono = (venta.almacen.sucursal.telefono1 != null ? venta.almacen.sucursal.telefono1 : "") +
            (venta.almacen.sucursal.telefono2 != null ? "-" + venta.almacen.sucursal.telefono2 : "") +
            (venta.almacen.sucursal.telefono3 != null ? "-" + venta.almacen.sucursal.telefono3 : "");
        doc.text("TELF.: " + telefono, { align: 'center' });
        doc.moveDown(0.4);
        doc.text("COCHABAMBA - BOLIVIA", { align: 'center' });
        doc.moveDown(0.5);
        doc.font('Helvetica-Bold', 8);
        doc.text("RECIBO", { align: 'center' });
        doc.font('Helvetica', 7);
        doc.moveDown(0.4);
        doc.text("------------------------------------", { align: 'center' });
        doc.moveDown(0.4);
        doc.text(venta.almacen.sucursal.nota_recibo_correlativo, { align: 'center' });
        //doc.text("NIT: "+$scope.usuario.empresa.nit,{align:'center'});

        //doc.text("FACTURA No: "+venta.factura,{align:'center'});
        doc.moveDown(0.4);
        //doc.text("AUTORIZACIÓN No: "+venta.autorizacion,{align:'center'});
        doc.moveDown(0.4);
        doc.text("------------------------------------", { align: 'center' });
        doc.moveDown(0.4);
        //doc.text(venta.actividad.nombre,{align:'center'});
        doc.moveDown(0.6);
        var date = new Date();
        doc.text("FECHA : " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(), { align: 'left' });
        doc.moveDown(0.4);
        doc.text("He recibido de : " + $scope.venta.farmacia.paciente.persona.nombre_completo, { align: 'left' });
        doc.moveDown(0.4);
        doc.text("---------------------------------------------------------------------------------", { align: 'center' });
        doc.moveDown(0.2);
        doc.text("       CONCEPTO                                   ", { align: 'left' });
        doc.moveDown(0.2);
        doc.text("---------------------------------------------------------------------------------", { align: 'center' });
        doc.moveDown(0.4);
        venta.fecha = new Date(venta.fecha);
        doc.text("Fecha: " + venta.fecha.getDate() + "/" + (venta.fecha.getMonth() + 1) + "/" + venta.fecha.getFullYear(), 15, 210);
        var textoFact = $scope.venta.movimiento.clase.nombre_corto == $scope.diccionario.EGRE_FACTURACION ? "Factura nro. " + $scope.venta.factura : "Proforma nro. " + $scope.venta.factura;
        doc.text(textoFact, 105, 210, { width: 100 });
        doc.text("Saldo Bs " + (venta.saldo - pago) + ".-", 105, 220, { width: 100 });
        doc.text("Bs " + pago + ".-", 170, 210, { width: 100 });

        doc.text("--------------", 10, 230, { align: 'right' });
        //oc.text("--------------------",{align:'right'});
        doc.moveDown(0.3);
        doc.text("TOTAL Bs.              " + pago.toFixed(2), { align: 'right' });
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.text("SON: " + data.pago, { align: 'left' });
        doc.moveDown(0.6);

        doc.moveDown(0.4);

        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);
        doc.moveDown(0.4);

        doc.text("-------------------------                       -------------------------", { align: 'center' });
        doc.text("ENTREGUE CONFORME            RECIBI CONFORME", { align: 'center' });
        doc.end();
        stream.on('finish', function () {
            var fileURL = stream.toBlobURL('application/pdf');
            window.open(fileURL, '_blank', 'location=no');
        });
        blockUI.stop();
    }

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.eliminarPopup($scope.idModalWizardFarmaciaEdicion);
        $scope.eliminarPopup($scope.idModalInventario);
        $scope.eliminarPopup($scope.idModalWizardVentaVista);
        $scope.eliminarPopup($scope.idModalPago);

    });

    $scope.inicio();


    
    

});