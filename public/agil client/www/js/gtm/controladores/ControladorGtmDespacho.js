angular.module('agil.controladores')

    .controller('ControladorGtmDespacho', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmDespachos, GtmDetalleDespacho, GetGtmDetalleDespachoHijos, ImprimirPdfDespachos, ExportarExelDespachos, ListaDetalleKardexFactura, GtmDetalleDespachoKardex,
        VerificarUsuarioEmpresa, CrearDespachoResivo, ClasesTipo, ListaBancos, ClasesTipoEmpresa) {

        blockUI.start();


        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalAsignacionFactura = 'modal-asignacion-factura';
        $scope.idModalVentaKardexFactura = 'modal-venta-kardex-factura';
        $scope.idModalAsignacionFacturaKardex = "modal-asignacion-factura-kardex"
        $scope.idModalDetalleKardex = "modal-detalle-kardex"
        $scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';
        $scope.IdModalCobros = 'modal-cobros';
        $scope.IdModalHistorialCobros = 'modal-historial-cobros'
        $scope.idModalConceptoEdicion = 'dialog-conceptos';
       

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptDespacho($scope.idModalAsignacionFactura, $scope.idModalVentaKardexFactura, $scope.idModalAsignacionFacturaKardex, $scope.idModalDetalleKardex,
                $scope.IdModalVerificarCuenta, $scope.IdModalCobros, $scope.IdModalHistorialCobros, $scope.idModalConceptoEdicion);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerDespachados();
            $scope.obtenerTiposPagoResivo()
            $scope.obtenerCuentasBancos()
            $scope.obtenerOtrosBancos()
            $scope.verDatosCobroDespachos = false
        }

        /*  $scope.obtenerDespachados = function () {
             var promesa = GtmDespachos($scope.usuario.id_empresa);
             promesa.then(function (despachos) {
                 $scope.despachos = despachos;
             });
         } */
        $scope.obtenerTiposPagoResivo = function () {
            blockUI.start();
            var promesa = ClasesTipo("GTM_TP");
            promesa.then(function (entidad) {
                $scope.tiposPagosResivo = entidad.clases;
                blockUI.stop();
            });
        }
        $scope.obtenerDespachados = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "id";
            $scope.paginator.direccion = "asc";

            $scope.filtro = {
                id_empresa: $scope.usuario.id_empresa, inicio: "",
                fin: "",
                transportista: "",
                tipo: "",
                grupo: "",
                estado: "",
                vendedor: ""
            }
            $scope.paginator.callBack = $scope.buscarDespachados;
            $scope.paginator.getSearch("", $scope.filtro, null);
            blockUI.stop();

        }
        $scope.buscarDespachados = function () {
            if ($scope.paginator.filter.inicio != 0) {
                if ($scope.filtro.inicio && $scope.filtro.fin) {
                    $scope.paginator.filter.inicio = new Date($scope.convertirFecha($scope.filtro.inicio))
                    $scope.paginator.filter.fin = new Date($scope.convertirFecha($scope.filtro.fin))
                } else {
                    $scope.paginator.filter.inicio = 0
                    $scope.paginator.filter.fin = 0
                }
            } else {
                var date = new Date()
                var inicio = new Date(date.getFullYear(), date.getMonth(), 1);
                var fin = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                $scope.paginator.filter.inicio = inicio
                $scope.paginator.filter.fin = fin
                $scope.filtro.inicio = $scope.fechaATexto(inicio)
                $scope.filtro.fin = $scope.fechaATexto(fin)
            }
            blockUI.start();
            var promesa = GtmDespachos($scope.paginator);
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
        $scope.imprimirPdfDespachos = function () {
            ImprimirPdfDespachos($scope.despachos, $scope.paginator.filter, $scope.usuario)
        }
        $scope.imprimirExelDespachos = function () {
            ExportarExelDespachos($scope.despachos, $scope.paginator.filter, $scope.usuario)
        }
        $scope.imprimir = function (gtm_despacho) {

            blockUI.start();
            var sumaDespachados = 0
            var promesa = GetGtmDetalleDespachoHijos(gtm_despacho)
            promesa.then(function (dato) {
                if (dato.detallesDespacho.length > 0) {
                    dato.detallesDespacho.forEach(function (detalle, index, array) {
                        sumaDespachados += detalle.cantidad_despacho
                        if (index == (array.length - 1)) {
                            var importeTotal = 0
                            var cantidadTotal = 0
                            var doc = new PDFDocument({ compress: false, size: [612, 792], margin: 10 });
                            var stream = doc.pipe(blobStream());

                            var fechaActual = new Date();
                            var x = 80
                            doc.font('Helvetica', 8);
                            var y = 115 + 80
                            var a = 0
                            $scope.dibujarCabeceraPDFImpresion(doc, gtm_despacho, 0);
                            doc.font('Helvetica', 8);
                            doc.text(1, 55, y);
                            doc.text(gtm_despacho.producto.codigo, 100, y);
                            doc.text(gtm_despacho.producto.nombre.toUpperCase(), 180, y);
                            doc.text(gtm_despacho.cantidad, 380, y);
                            doc.text(gtm_despacho.precio_unitario, 450, y);
                            doc.text(gtm_despacho.importe, 520, y);
                            /*  doc.rect(40, x + 80 ,540, y - 70).stroke();*/
                            doc.rect(40, y + 10, 540, 0).stroke();
                            doc.rect(40, y - 10, 0, 40).stroke();
                            doc.rect(580, y - 10, 0, 60).stroke();
                            doc.rect(80, y - 35, 0, 65).stroke();
                            doc.rect(160, y - 35, 0, 85).stroke();
                            doc.rect(425, y - 35, 0, 65).stroke();
                            doc.rect(370, y - 35, 0, 125).stroke();
                            doc.rect(425, y + 50, 0, 40).stroke();
                            doc.rect(495, y + 50, 0, 20).stroke();
                            doc.rect(580, y + 50, 0, 20).stroke();
                            /*  doc.rect(425, y - 35, 0, 105).stroke(); */
                            doc.rect(495, y - 35, 0, 85).stroke();
                            doc.rect(160, y + 50, 420, 0).stroke();
                            doc.rect(370, y + 70, 55, 0).stroke();
                            doc.rect(495, y + 70, 85, 0).stroke();
                            doc.rect(370, y + 90, 55, 0).stroke();
                            y = y + 20;
                            // doc.text(2, 55, y);
                            doc.text(gtm_despacho.producto.codigo, 100, y);
                            var texto = gtm_despacho.producto.nombre.toUpperCase() + ' (DESPACHADO)'
                            if (texto.length > 37) {
                                a = -6;
                            }
                            doc.text(texto, 180, y + a, { width: 180 });
                            doc.text(gtm_despacho.cantidad_despacho, 380, y);
                            //doc.rect(40, x + 80 ,540, y - 70).stroke();
                            doc.text('SERVICIO DE TRANSPORTE', 180, y + 20);
                            doc.text(gtm_despacho.servicio_transporte, 520, y + 20);
                            doc.text(gtm_despacho.importe + gtm_despacho.servicio_transporte, 520, y + 40);
                            doc.rect(40, y + 10, 540, 0).stroke();
                            doc.font('Helvetica-Bold', 8);
                            doc.text('Total', x + 250, y + 40)
                            doc.text('Saldo', x + 250, y + 60)
                            doc.rect(60, y + 105, 90, 0, { align: "left" }).stroke();
                            doc.text('DESPACHO', 60, y + 110, { align: "left" })
                            doc.text($scope.usuario.persona.nombre_completo, 60, y + 120, { align: "left" })
                            /* doc.text('HORA DESP.: ', 60, y + 130, { align: "left" }) */
                            var hora = new Date().getHours()
                            var min = new Date().getMinutes()
                            min = (min < 10) ? min = "0" + min : min;
                            hora = (hora < 10) ? hora = "0" + hora : hora;
                            doc.text('HORA DESP.: ' + hora + ':' + min, 60, y + 130, { align: "left" })
                            doc.rect(255, y + 105, 90, 0, { align: "center" }).stroke();
                            doc.text('FIRMA CONDUCTOR', -10, y + 110, { align: "center" })
                            doc.text('NOMBRE: ', -50, y + 120, { align: "center" })
                            doc.rect(440, y + 105, 90, 0, { align: "right" }).stroke();
                            doc.text('FIRMA CLIENTE', 350, y + 110, { align: "center" })
                            doc.text('NOMBRE: ', 330, y + 120, { align: "center" })
                            doc.text('HORA RECEP.: ', 350, y + 130, { align: "center" })
                            doc.font('Helvetica', 8);
                            doc.text((sumaDespachados) + gtm_despacho.cantidad_despacho, x + 300, y + 40)
                            doc.text((gtm_despacho.cantidad - (sumaDespachados + gtm_despacho.cantidad_despacho)), x + 300, y + 60)
                            var x = 80
                            doc.font('Helvetica', 8);
                            var y = 600
                            $scope.dibujarCabeceraPDFImpresion(doc, gtm_despacho, 405);
                            doc.font('Helvetica', 8);
                            doc.text(1, 55, y);
                            doc.text(gtm_despacho.producto.codigo, 100, y);
                            doc.text(gtm_despacho.producto.nombre.toUpperCase(), 180, y);
                            doc.text(gtm_despacho.cantidad, 380, y);
                            doc.text(gtm_despacho.precio_unitario, 450, y);
                            doc.text(gtm_despacho.importe, 520, y);
                            /*  doc.rect(40, x + 80 ,540, y - 70).stroke();*/
                            doc.rect(40, y + 10, 540, 0).stroke();
                            doc.rect(40, y - 10, 0, 40).stroke();
                            doc.rect(580, y - 10, 0, 60).stroke();
                            doc.rect(80, y - 35, 0, 65).stroke();
                            doc.rect(160, y - 35, 0, 85).stroke();
                            doc.rect(425, y - 35, 0, 65).stroke();
                            doc.rect(370, y - 35, 0, 65).stroke();
                            doc.rect(425, y + 50, 0, 40).stroke();
                            doc.rect(370, y + 50, 0, 40).stroke();
                            doc.rect(495, y + 50, 0, 20).stroke();
                            doc.rect(580, y + 50, 0, 20).stroke();
                            doc.rect(495, y + 70, 85, 0).stroke();
                            /*  doc.rect(425, y - 35, 0, 105).stroke(); */
                            doc.rect(495, y - 35, 0, 85).stroke();
                            doc.rect(160, y + 50, 420, 0).stroke();
                            doc.rect(370, y + 70, 55, 0).stroke();
                            doc.rect(370, y + 90, 55, 0).stroke();
                            y = y + 20;
                            var a = 0
                            // doc.text(2, 55, y);
                            doc.text(gtm_despacho.producto.codigo, 100, y);
                            var texto = gtm_despacho.producto.nombre.toUpperCase() + ' (DESPACHADO)'
                            if (texto.length > 37) {
                                a = -6;
                            }
                            doc.text(texto, 180, y + a, { width: 180 });
                            doc.text(gtm_despacho.cantidad_despacho, 380, y);
                            //doc.rect(40, x + 80 ,540, y - 70).stroke();
                            doc.text('SERVICIO DE TRANSPORTE', 180, y + 20);
                            doc.text(gtm_despacho.servicio_transporte, 520, y + 20);
                            doc.text(gtm_despacho.importe + gtm_despacho.servicio_transporte, 520, y + 40);
                            doc.rect(40, y + 10, 540, 0).stroke();
                            doc.font('Helvetica-Bold', 8);
                            doc.text('Total', x + 250, y + 40)
                            doc.text('Saldo', x + 250, y + 60)
                            doc.rect(60, y + 105, 90, 0, { align: "left" }).stroke();
                            doc.text('DESPACHO', 60, y + 110, { align: "left" })
                            doc.text($scope.usuario.persona.nombre_completo, 60, y + 120, { align: "left" })
                            /* doc.text('HORA DESP.: ', 60, y + 130, { align: "left" }) */
                            var hora = new Date().getHours()
                            var min = new Date().getMinutes()
                            min = (min < 10) ? min = "0" + min : min;
                            hora = (hora < 10) ? hora = "0" + hora : hora;
                            doc.text('HORA DESP.: ' + hora + ':' + min, 60, y + 130, { align: "left" })
                            doc.rect(255, y + 105, 90, 0, { align: "center" }).stroke();
                            doc.text('FIRMA CONDUCTOR', -10, y + 110, { align: "center" })
                            doc.text('NOMBRE: ', -50, y + 120, { align: "center" })
                            doc.rect(440, y + 105, 90, 0, { align: "right" }).stroke();
                            doc.text('FIRMA CLIENTE', 350, y + 110, { align: "center" })
                            doc.text('NOMBRE: ', 330, y + 120, { align: "center" })
                            doc.text('HORA RECEP.: ', 350, y + 130, { align: "center" })
                            doc.font('Helvetica', 8);
                            doc.text((sumaDespachados + gtm_despacho.cantidad_despacho), x + 300, y + 40)
                            doc.text((gtm_despacho.cantidad - (sumaDespachados + gtm_despacho.cantidad_despacho)), x + 300, y + 60)
                            doc.end();
                            stream.on('finish', function () {
                                var fileURL = stream.toBlobURL('application/pdf');
                                window.open(fileURL, '_blank', 'location=no');
                            });
                            blockUI.stop();
                        }
                    });
                } else {
                    sumaDespachados = gtm_despacho.cantidad_despacho

                    var importeTotal = 0
                    var cantidadTotal = 0
                    var doc = new PDFDocument({ compress: false, size: [612, 792], margin: 10 });
                    var stream = doc.pipe(blobStream());

                    var fechaActual = new Date();
                    var x = 80
                    doc.font('Helvetica', 8);
                    var y = 115 + 80
                    $scope.dibujarCabeceraPDFImpresion(doc, gtm_despacho, 0);
                    doc.font('Helvetica', 8);
                    doc.text(1, 55, y);
                    doc.text(gtm_despacho.producto.codigo, 100, y);
                    doc.text(gtm_despacho.producto.nombre.toUpperCase(), 180, y, { width: 180 });
                    doc.text(gtm_despacho.cantidad, 380, y);
                    doc.text(gtm_despacho.precio_unitario, 450, y);
                    doc.text(gtm_despacho.importe, 520, y);
                    /*  doc.rect(40, x + 80 ,540, y - 70).stroke();*/
                    doc.rect(40, y + 10, 540, 0).stroke();
                    doc.rect(40, y - 10, 0, 40).stroke();
                    doc.rect(580, y - 10, 0, 60).stroke();
                    doc.rect(80, y - 35, 0, 65).stroke();
                    doc.rect(160, y - 35, 0, 85).stroke();
                    doc.rect(425, y - 35, 0, 65).stroke();
                    doc.rect(370, y - 35, 0, 65).stroke();
                    doc.rect(425, y + 50, 0, 40).stroke();
                    doc.rect(370, y + 50, 0, 40).stroke();
                    doc.rect(495, y + 50, 0, 20).stroke();
                    doc.rect(580, y + 50, 0, 20).stroke();
                    doc.rect(495, y + 70, 85, 0).stroke();
                    /*  doc.rect(425, y - 35, 0, 105).stroke(); */
                    doc.rect(495, y - 35, 0, 85).stroke();
                    doc.rect(160, y + 50, 420, 0).stroke();
                    doc.rect(370, y + 70, 55, 0).stroke();
                    doc.rect(370, y + 90, 55, 0).stroke();
                    y = y + 20;
                    // doc.text(2, 55, y);
                    var a = 0;
                    doc.text(gtm_despacho.producto.codigo, 100, y);
                    var texto = gtm_despacho.producto.nombre.toUpperCase() + ' (DESPACHADO)'
                    if (texto.length > 37) {
                        a = -6;
                    }
                    doc.text(texto, 180, y + a, { width: 180 });
                    doc.text(gtm_despacho.cantidad_despacho, 380, y);
                    //doc.rect(40, x + 80 ,540, y - 70).stroke();
                    doc.text('SERVICIO DE TRANSPORTE', 180, y + 20);
                    doc.text(gtm_despacho.servicio_transporte, 520, y + 20);
                    doc.text(gtm_despacho.importe + gtm_despacho.servicio_transporte, 520, y + 40);
                    doc.rect(40, y + 10, 540, 0).stroke();
                    doc.font('Helvetica-Bold', 8);
                    doc.text('Total', x + 250, y + 40)
                    doc.text('Saldo', x + 250, y + 60)
                    doc.rect(60, y + 105, 90, 0, { align: "left" }).stroke();
                    doc.text('DESPACHO', 60, y + 110, { align: "left" })
                    doc.text($scope.usuario.persona.nombre_completo, 60, y + 120, { align: "left" })
                    /* doc.text('HORA DESP.: ', 60, y + 130, { align: "left" }) */
                    var hora = new Date(gtm_despacho.fecha).getHours()
                    var min = new Date(gtm_despacho.fecha).getMinutes()
                    min = (min < 10) ? min = "0" + min : min;
                    hora = (hora < 10) ? hora = "0" + hora : hora;
                    doc.text('HORA DESP.: ' + hora + ':' + min, 60, y + 130, { align: "left" })
                    doc.rect(255, y + 105, 90, 0, { align: "center" }).stroke();
                    doc.text('FIRMA CONDUCTOR', -10, y + 110, { align: "center" })
                    doc.text('NOMBRE: ', -50, y + 120, { align: "center" })
                    doc.rect(440, y + 105, 90, 0, { align: "right" }).stroke();
                    doc.text('FIRMA CLIENTE', 350, y + 110, { align: "center" })
                    doc.text('NOMBRE: ', 330, y + 120, { align: "center" })
                    doc.text('HORA RECEP.: ', 350, y + 130, { align: "center" })
                    doc.font('Helvetica', 8);
                    doc.text((sumaDespachados), x + 300, y + 40)
                    doc.text((gtm_despacho.cantidad - sumaDespachados), x + 300, y + 60)
                    var x = 80
                    doc.font('Helvetica', 8);
                    var y = 600
                    $scope.dibujarCabeceraPDFImpresion(doc, gtm_despacho, 405);
                    doc.font('Helvetica', 8);
                    doc.text(1, 55, y);
                    doc.text(gtm_despacho.producto.codigo, 100, y);
                    doc.text(gtm_despacho.producto.nombre.toUpperCase(), 180, y);
                    doc.text(gtm_despacho.cantidad, 380, y);
                    doc.text(gtm_despacho.precio_unitario, 450, y);
                    doc.text(gtm_despacho.importe, 520, y);
                    /*  doc.rect(40, x + 80 ,540, y - 70).stroke();*/
                    doc.rect(40, y + 10, 540, 0).stroke();
                    doc.rect(40, y - 10, 0, 40).stroke();
                    doc.rect(580, y - 10, 0, 60).stroke();
                    doc.rect(80, y - 35, 0, 65).stroke();
                    doc.rect(160, y - 35, 0, 85).stroke();
                    doc.rect(425, y - 35, 0, 65).stroke();
                    doc.rect(370, y - 35, 0, 65).stroke();
                    doc.rect(425, y + 50, 0, 40).stroke();
                    doc.rect(370, y + 50, 0, 40).stroke();
                    doc.rect(495, y + 50, 0, 20).stroke();
                    doc.rect(580, y + 50, 0, 20).stroke();

                    /*  doc.rect(425, y - 35, 0, 105).stroke(); */
                    doc.rect(495, y - 35, 0, 85).stroke();
                    doc.rect(160, y + 50, 420, 0).stroke();
                    doc.rect(370, y + 70, 55, 0).stroke();
                    doc.rect(370, y + 90, 55, 0).stroke();
                    doc.rect(495, y + 70, 85, 0).stroke();
                    y = y + 20;
                    // doc.text(2, 55, y);
                    doc.text(gtm_despacho.producto.codigo, 100, y);
                    var texto = gtm_despacho.producto.nombre.toUpperCase() + ' (DESPACHADO)'
                    if (texto.length > 37) {
                        a = -6;
                    }
                    doc.text(texto, 180, y + a, { width: 180 });
                    doc.text(gtm_despacho.cantidad_despacho, 380, y);
                    //doc.rect(40, x + 80 ,540, y - 70).stroke();
                    doc.text('SERVICIO DE TRANSPORTE', 180, y + 20);
                    doc.text(gtm_despacho.servicio_transporte, 520, y + 20);
                    doc.text(gtm_despacho.importe + gtm_despacho.servicio_transporte, 520, y + 40);
                    doc.rect(40, y + 10, 540, 0).stroke();
                    doc.font('Helvetica-Bold', 8);
                    doc.text('Total', x + 250, y + 40)
                    doc.text('Saldo', x + 250, y + 60)
                    doc.rect(60, y + 105, 90, 0, { align: "left" }).stroke();
                    doc.text('DESPACHO', 60, y + 110, { align: "left" })
                    doc.text($scope.usuario.persona.nombre_completo, 60, y + 120, { align: "left" })
                    /* doc.text('HORA DESP.: ', 60, y + 130, { align: "left" }) */
                    var hora = new Date(gtm_despacho.fecha).getHours()
                    var min = new Date(gtm_despacho.fecha).getMinutes()
                    min = (min < 10) ? min = "0" + min : min;
                    hora = (hora < 10) ? hora = "0" + hora : hora;
                    doc.text('HORA DESP.: ' + hora + ':' + min, 60, y + 130, { align: "left" })
                    doc.rect(255, y + 105, 90, 0, { align: "center" }).stroke();
                    doc.text('FIRMA CONDUCTOR', -10, y + 110, { align: "center" })
                    doc.text('NOMBRE: ', -50, y + 120, { align: "center" })
                    doc.rect(440, y + 105, 90, 0, { align: "right" }).stroke();
                    doc.text('FIRMA CLIENTE', 350, y + 110, { align: "center" })
                    doc.text('NOMBRE: ', 330, y + 120, { align: "center" })
                    doc.text('HORA RECEP.: ', 350, y + 130, { align: "center" })
                    doc.font('Helvetica', 8);
                    doc.text((sumaDespachados), x + 300, y + 40)
                    doc.text((gtm_despacho.cantidad - sumaDespachados), x + 300, y + 60)
                    doc.end();
                    stream.on('finish', function () {
                        var fileURL = stream.toBlobURL('application/pdf');
                        window.open(fileURL, '_blank', 'location=no');
                    });
                    blockUI.stop();

                }
            })
        }

        $scope.dibujarCabeceraPDFImpresion = function (doc, gtm_despacho, y) {
            var yCabecera = y + 80;
            var yEspacio = 10;
            var fecha = new Date()
            var fecha = $scope.fechaATexto(fecha)
            doc.rect(40, y + 80 + 80, 540, 25).fillAndStroke("silver", "#000");
            doc.font('Helvetica-Bold', 12)
                .fill('black')
            doc.text("DESPACHO DE PRODUCTOS", 0, y + 25, { align: "center" });
            doc.font('Helvetica-Bold', 8);
            // doc.text("SUCURSAL : ", -40, 50, { align: "center" });
            doc.font('Helvetica', 8);
            doc.font('Helvetica-Bold', 8);
            doc.text("FECHA: ", 505, y + 60, { width: 40 });
            doc.text("Cliente: ", 465, y + 80);
            doc.text("Cod. SAP: ", 465, y + 90);
            doc.font('Helvetica', 8);
            doc.text($scope.fechaATexto(gtm_despacho.fecha), 540, y + 60, { width: 45 });
            doc.text(gtm_despacho.despacho.cliente.codigo, 510, y + 80);
            var textoSap = ""
            doc.text(gtm_despacho.despacho.cliente.razon_social, 80, y + 90);

            var ydesc = y + 90;

            doc.font('Helvetica-Bold', 8);
            doc.text("Cod. Vend: ", 465, ydesc + 10);
            doc.font('Helvetica', 8);
            doc.text(gtm_despacho.despacho.cliente.texto2, 510, ydesc + 10);

            doc.font('Helvetica-Bold', 14);
            doc.text("N°", 380, y + 25, { align: "center" });
            doc.text(gtm_despacho.numero_correlativo, 510, y + 25);

            doc.rect(40, y + 80 + 80, 540, 25).stroke()
                .fill('silver')
            doc.rect(0, 0, 0, 0).stroke()
                .fill('black')
            doc.font('Helvetica-Bold', 8);
            doc.text("Nº", 55, 90 + yCabecera);

            doc.text("Código", 100, 90 + yCabecera);

            doc.text("Detalle", 180, 90 + yCabecera);
            doc.text("Cantidad", 380, 90 + yCabecera);
            doc.text("Precio", 450, 90 + yCabecera);
            doc.text("Importe", 520, 90 + yCabecera);
            doc.text("Clientes:", 40, y + 90);
            doc.text("Destino Mercaderia:", 40, y + 100);
            var texto = gtm_despacho.despacho.destino.destino
            var a = 0;
            if (texto.length > 61) {
                a = 10;
            }
            doc.text("Nombre Fact:", 40, y + 110 + a);
            doc.font('Helvetica', 8);
            if (gtm_despacho.despacho.cliente_razon !== null && gtm_despacho.despacho.cliente_razon !== undefined) {
                textoSap = gtm_despacho.despacho.cliente_razon.codigo_sap
                doc.text(gtm_despacho.despacho.cliente_razon.razon_social, 100, y + 110 + a);
            }
            doc.text(textoSap, 510, y + 90, { width: 80 })
            doc.font('Helvetica-Bold', 8);
            doc.text("CI/NIT:", 40, y + 120 + a);
            doc.text("Teléfono:", 200, y + 120 + a);
            doc.text("Dirección:", 40, y + 130 + a);

            doc.font('Helvetica', 8);
            doc.text(gtm_despacho.despacho.cliente_razon.nit, 80, y + 120 + a);
            if (gtm_despacho.despacho.cliente.telefono1) doc.text(gtm_despacho.despacho.cliente.telefono1, 240, y + 120 + a);
            doc.text(gtm_despacho.despacho.destino.direccion, 80, y + 130 + a);

            if (gtm_despacho.despacho.destino !== null && gtm_despacho.despacho.destino !== undefined) {
                doc.text(texto, 120, y + 100, { width: 320 });
            } else {
                doc.text("" + " " + "", 120, y + 100);
            }
        }

        $scope.abrirModalAsignacionFactura = function (detalle_despacho) {
            $scope.abrirPopup($scope.idModalAsignacionFactura);
            $scope.detalle_despacho = detalle_despacho;
            if ($scope.detalle_despacho.fecha_factura) {
                $scope.detalle_despacho.fecha_factura = $scope.fechaATexto($scope.detalle_despacho.fecha_factura)
            }
        }

        $scope.cerrarAsignacionFactura = function () {
            $scope.cerrarPopup($scope.idModalAsignacionFactura);
        }
        $scope.abrirModalVentaKardexFactura = function () {
            var filtro = { pendiente: true }
            $scope.filtroVentaKardex = { pendiente: true }
            $scope.obtenerVentaKardexFactura(filtro)
            $scope.abrirPopup($scope.idModalVentaKardexFactura);
        }

        $scope.cerrarVentaKardexFactura = function () {
            $scope.cerrarPopup($scope.idModalVentaKardexFactura);
        }
        $scope.abrirModalAsignacionFacturaKardex = function (detalle) {
            $scope.detalle_kardex = detalle
            $scope.abrirPopup($scope.idModalAsignacionFacturaKardex);
        }

        $scope.cerrarAsignacionFacturaKardex = function () {
            $scope.cerrarPopup($scope.idModalAsignacionFacturaKardex);
        }
        $scope.abrirModalDetalleKardex = function (kardex) {
            $scope.kardex = kardex
            $scope.abrirPopup($scope.idModalDetalleKardex);
        }

        $scope.cerrarDetalleKardex = function () {
            $scope.cerrarPopup($scope.idModalDetalleKardex);
        }

        $scope.establecerFactura = function (detalle_despacho) {

            detalle_despacho.fecha_factura = (detalle_despacho.fecha_factura) ? new Date($scope.convertirFecha(detalle_despacho.fecha_factura)) : null
            GtmDetalleDespacho.update({ id_detalle_despacho: detalle_despacho.id }, detalle_despacho, function (res) {
                $scope.cerrarAsignacionFactura();
                $scope.mostrarMensaje(res.mensaje);
            });
        }
        $scope.establecerFacturaKardex = function (detalle_kardex) {
            GtmDetalleDespachoKardex.update({ id_detalle_kardex: detalle_kardex.id }, detalle_kardex, function (res) {

                $scope.obtenerVentaKardexFactura($scope.filtroVentaKardex)
                $scope.cerrarAsignacionFacturaKardex();
                $scope.mostrarMensaje(res.mensaje);
            });
        }
        $scope.removerDetalleDespacho = function (detalle_despacho) {
            detalle_despacho = new GtmDetalleDespacho(detalle_despacho);
            detalle_despacho.$delete(function (res) {
                $scope.obtenerDespachados();
                $scope.mostrarMensaje(res.mensaje);
            });
        }
        $scope.obtenerVentaKardexFactura = function (filtro) {
            if (filtro.inicio) {
                filtro.inicio = new Date($scope.convertirFecha(filtro.inicio))
                filtro.fin = new Date($scope.convertirFecha(filtro.fin))
            } else {
                filtro.inicio = 0
                filtro.fin = 0
            }
            var promesa = ListaDetalleKardexFactura($scope.usuario.id_empresa, filtro)
            promesa.then(function (dato) {
                if ($scope.filtroVentaKardex.inicio instanceof Date) {
                    $scope.filtroVentaKardex.inicio = $scope.fechaATexto($scope.filtroVentaKardex.inicio)
                    $scope.filtroVentaKardex.fin = $scope.fechaATexto($scope.filtroVentaKardex.fin)
                }
                $scope.detalleKardexFactura = dato
            })
        }
        $scope.CalcularMontoEnDolar = function (detalle_despacho) {
            if (detalle_despacho.resivo.tipo_moneda) {
                detalle_despacho.resivo.monto = detalle_despacho.resivo.monto_dolar
            } else {
                detalle_despacho.resivo.maxmonto_dolar = detalle_despacho.saldo_pago_ac / detalle_despacho.resivo.cambio_moneda
                detalle_despacho.resivo.monto = detalle_despacho.resivo.monto_dolar * detalle_despacho.resivo.cambio_moneda
            }
        }
        $scope.montoDolar = function (detalle_despacho) {
            detalle_despacho.resivo.monto_dolar = detalle_despacho.resivo.monto
        }
        $scope.abrirModalCobros = function (detalle_despacho) {
            $scope.detalle_despacho = detalle_despacho
            var factura = ($scope.detalle_despacho.factura) ? $scope.detalle_despacho.factura : ""
            $scope.detalle_despacho.resivo = {
                sucursal: $scope.sucursales[0],
                tipo_moneda: true,
                monto_dolar: 0,
                cambio_moneda: 6.9,
                fecha: $scope.fechaATexto(new Date()),
                tipoPago: $scope.tiposPagosResivo[0],
                eliminado: false,
                concepto: "Pago total de " + $scope.detalle_despacho.cantidad_despacho + " " + $scope.detalle_despacho.producto.unidad_medida + " de " + $scope.detalle_despacho.producto.nombre + " y servicio de distribución s/g factura nro. " + factura
            }

            $scope.abrirPopup($scope.IdModalCobros);
        }
        $scope.cerrarModalCobros = function () {
            if ($scope.detalle_despacho.resivo.edit) {
                $scope.obtenerDespachados()
            }
            $scope.cerrarPopup($scope.IdModalCobros);
        }
        $scope.abrirModalHistorialCobros = function () {
            $scope.detalle_despacho.recivos = $scope.detalle_despacho.recivos.sort(function (a, b) {
                return a.id - b.id;
            });
            $scope.abrirPopup($scope.IdModalHistorialCobros);
        }
        $scope.cerrarModalHistorialCobros = function () {
            $scope.cerrarPopup($scope.IdModalHistorialCobros);
        }



        $scope.abrirModalVerificarCuenta = function (dato, tipo) {
            $scope.dato = dato
            $scope.tipoDatosPermiso = tipo
            $scope.cuenta = {}
            $scope.abrirPopup($scope.IdModalVerificarCuenta);
        }
        $scope.cerrarModalVerificarCuenta = function () {
            $scope.cerrarPopup($scope.IdModalVerificarCuenta);
        }
        $scope.verificarCuentaAdmin = function (cuenta) {
            VerificarUsuarioEmpresa.save({ id_empresa: $scope.usuario.id_empresa }, cuenta, function (dato) {
                if (dato.type) {
                    $scope.mostrarMensaje(dato.message)
                    /*  cuenta.abierto= cuenta.abierto; */
                    if ($scope.tipoDatosPermiso == "despacho") {
                        $scope.abrirModalAsignacionFactura($scope.dato)
                    }
                    if ($scope.tipoDatosPermiso == "despachoKardex") {
                        $scope.abrirModalAsignacionFacturaKardex($scope.dato)
                    }
                    if ($scope.tipoDatosPermiso == "EditarDespachoResivo") {
                        $scope.detalle_despacho.resivo = $scope.dato
                        $scope.detalle_despacho.resivo.edit = true
                        $scope.detalle_despacho.saldo_pago_ac = $scope.detalle_despacho.saldo_pago_ac + $scope.detalle_despacho.resivo.monto
                        $scope.detalle_despacho.pago_ac = $scope.detalle_despacho.pago_ac - $scope.detalle_despacho.resivo.monto
                        $scope.tiposPagosResivo.forEach(function (dato, index, array) {
                            if ($scope.dato.tipoPago.id == dato.id) {
                                $scope.detalle_despacho.resivo.tipoPago = dato
                            }
                        })

                        $scope.detalle_despacho.resivo.fecha = $scope.fechaATexto($scope.detalle_despacho.resivo.fecha)
                        $scope.cerrarModalHistorialCobros()
                    }
                    if ($scope.tipoDatosPermiso == "EliminarDespachoResivo") {
                        $scope.dato.eliminado = true
                        $scope.dato.pago_ac = $scope.detalle_despacho.pago_ac - $scope.dato.monto
                        $scope.dato.saldo_pago_ac = $scope.detalle_despacho.total - $scope.dato.pago_ac
                        $scope.crearDespachoResivo($scope.dato)
                        $scope.cerrarModalHistorialCobros()

                    }

                    $scope.cerrarModalVerificarCuenta(dato);
                } else {
                    $scope.mostrarMensaje(dato.message)
                }
            })
        }

        $scope.crearDespachoResivo = function (dato) {
            dato.fecha = new Date($scope.convertirFecha(dato.fecha))
            if (dato.eliminado == false) {
                dato.pago_ac = $scope.detalle_despacho.pago_ac + dato.monto
                dato.saldo_pago_ac = $scope.detalle_despacho.total - dato.pago_ac
            }
            var promesa = CrearDespachoResivo($scope.detalle_despacho.id, dato)
            promesa.then(function (dato) {
                $scope.mostrarMensaje(dato.mensaje)
                if (dato.recivo.eliminado == false) {
                    $scope.imprimirResivo(dato.recivo)
                }
                $scope.cerrarModalCobros()
                if ($scope.paginator.search) {
                    $scope.paginator.getSearch($scope.paginator.search, $scope.paginator.filter, null);
                } else {
                    $scope.paginator.getSearch("", $scope.paginator.filter, null);
                }
            })
        }
        $scope.obtenerCuentasBancos = function () {
            blockUI.start();
            var promesa = ListaBancos($scope.usuario.id_empresa);
            promesa.then(function (bancos) {
                $scope.cuentasBancos = bancos;
                blockUI.stop();
            });
        }
        $scope.obtenerOtrosBancos = function () {
            blockUI.start();
            var promesa = ClasesTipoEmpresa("RRHH_BAN", $scope.usuario.id_empresa);
            promesa.then(function (entidad) {
                $scope.otrosBancos = entidad
                blockUI.stop();
            });
        }
        $scope.abrirDialogConceptoEdicion = function (tipo) {
            $scope.tipo_edicion = tipo;
            $scope.clase = {};
            $scope.abrirPopup($scope.idModalConceptoEdicion);
        }
        $scope.cerrarDialogConceptoEdicion = function () {
            $scope.cerrarPopup($scope.idModalConceptoEdicion);
        }
        $scope.verDatosCobros = function () {
            $scope.verDatosCobroDespachos = ($scope.verDatosCobroDespachos) ? false : true
        }

        $scope.imprimirResivo = function (recivo) {

            convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
                var doc = new PDFDocument({ compress: false, size: 'letter', margin: 10 });
                var stream = doc.pipe(blobStream());
                var fechaActual = new Date(recivo.fecha);
                $scope.dibujarCabeceraPDFImpresionRecivo(doc, recivo, imagenEmpresa, 30);
                if (recivo.tipo_moneda) {
                    doc.text(recivo.monto + " .-", 485, 20);
                    doc.text("----", 485, 45);
                    doc.text("----", 485, 70);

                } else {
                    doc.text("----", 485, 20);
                    doc.text(recivo.monto + " .-", 485, 45);
                    doc.text(recivo.cambio_moneda + " .-", 485, 70);

                }
                doc.text($scope.detalle_despacho.despacho.cliente.razon_social, 100, 110);
                if (recivo.tipo_moneda) {
                    doc.text("                          " + ConvertirALiteral(recivo.monto.toFixed(2)), 40, 130, { width: 550, lineGap: 6 });
                } else {
                    doc.text("                          " + ConvertirALiteral(recivo.monto.toFixed(2), "DÓLARES"), 40, 130, { width: 550, lineGap: 6 });
                }
                doc.text("                               " + recivo.concepto, 40, 170, { width: 550, lineGap: 6 });
                doc.text($scope.detalle_despacho.despacho.cliente_razon.razon_social + "-" + $scope.detalle_despacho.despacho.cliente_razon.nit, 165, 210);
                doc.text(($scope.detalle_despacho.factura) ? $scope.detalle_despacho.factura : "", 465, 210);
                if (recivo.tipoPago.nombre == "CHEQUE") {
                    doc.text(recivo.numero_cuenta, 270, 230);
                    doc.text(recivo.otroBanco.nombre, 470, 230)
                } else if (recivo.tipoPago.nombre == "DEPOSITO") {

                    doc.text(recivo.banco.nombre, 470, 230)
                } else {
                    doc.moveTo(103, 240)
                        .lineTo(105, 245)
                        .dash(0, { space: 0 })

                        .lineTo(115, 230)
                        .stroke()
                    doc.text("----", 270, 230);
                    doc.text("----", 475, 230)
                }

                var dato = recivo.sucursal.departamento.nombre_corto.split("-")[0]
                doc.text((fechaActual.getDate() >= 10) ? dato + "  " + fechaActual.getDate() : dato + "  " + "0" + fechaActual.getDate(), 160, 260);
                doc.text(((fechaActual.getMonth() + 1) >= 10) ? (fechaActual.getMonth() + 1) : "0" + (fechaActual.getMonth() + 1), 310, 260);
                var anio = fechaActual.getFullYear()
                var cadena = anio.toString();
                anio = cadena.substr(-2)
                doc.text(anio, 440, 260);
                var currentDate = new Date()

                doc.font('Helvetica', 5);
                doc.text("EMISIÓN: " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear(), 200, 375);
                doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 260, 375);
                doc.text("USUARIO: " + $scope.usuario.persona.nombre_completo, 40, 375);
                doc.font('Helvetica', 8);
                doc.rect(3, 400, 600, 0).dash(1, { space: 5 }).stroke();
                $scope.dibujarCabeceraPDFImpresionRecivo(doc, recivo, imagenEmpresa, 430);
                if (recivo.tipo_moneda) {
                    doc.text(recivo.monto + " .-", 485, 420);
                    doc.text("----", 485, 445);
                    doc.text("----", 485, 470);

                } else {
                    doc.text("----", 485, 420);
                    doc.text(recivo.monto + " .-", 485, 445);
                    doc.text(recivo.cambio_moneda + " .-", 485, 470);

                }
                doc.text($scope.detalle_despacho.despacho.cliente.razon_social, 100, 510);
                if (recivo.tipo_moneda) {
                    doc.text("                          " + ConvertirALiteral(recivo.monto.toFixed(2)), 40, 530, { width: 550, lineGap: 6 });
                } else {
                    doc.text("                          " + ConvertirALiteral(recivo.monto.toFixed(2), "DÓLARES"), 40, 530, { width: 550, lineGap: 6 });
                }
                doc.text("-                               " + recivo.concepto, 40, 570, { width: 550, lineGap: 6 });
                doc.text($scope.detalle_despacho.despacho.cliente_razon.razon_social + "-" + $scope.detalle_despacho.despacho.cliente_razon.nit, 165, 610);
                doc.text(($scope.detalle_despacho.factura) ? $scope.detalle_despacho.factura : "", 465, 610);
                if (recivo.tipoPago.nombre == "CHEQUE") {
                    doc.text(recivo.numero_cuenta, 270, 630);
                    doc.text(recivo.otroBanco.nombre, 470, 630)
                } else if (recivo.tipoPago.nombre == "DEPOSITO") {

                    doc.text(recivo.banco.nombre, 470, 630)
                } else {
                    doc.moveTo(103, 640)
                        .lineTo(105, 645)
                        .dash(0, { space: 0 })

                        .lineTo(115, 630)
                        .stroke()
                    doc.text("----", 270, 630);
                    doc.text("----", 475, 630)
                }

                var dato = recivo.sucursal.departamento.nombre_corto.split("-")[0]
                doc.text((fechaActual.getDate() >= 10) ? dato + "  " + fechaActual.getDate() : dato + "  " + "0" + fechaActual.getDate(), 160, 660);
                doc.text(((fechaActual.getMonth() + 1) >= 10) ? (fechaActual.getMonth() + 1) : "0" + (fechaActual.getMonth() + 1), 310, 660);
                var anio = fechaActual.getFullYear()
                var cadena = anio.toString();
                anio = cadena.substr(-2)
                doc.text(anio, 440, 660);
                doc.font('Helvetica', 5);
                doc.text("EMISIÓN: " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear(), 200, 775);
                doc.text("IMPRESIÓN: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(), 260, 775);
                doc.text("USUARIO: " + $scope.usuario.persona.nombre_completo, 40, 775);
                doc.end();
                stream.on('finish', function () {
                    var fileURL = stream.toBlobURL('application/pdf');
                    window.open(fileURL, '_blank', 'location=no');
                });

            });
        }

        $scope.dibujarCabeceraPDFImpresionRecivo = function (doc, recivo, imagenEmpresa, y) {
            doc.font('Helvetica-Bold', 16);
            //cabecera
            doc.text("RECIBO DE INGRESO", 0, y, { align: "center" });
            doc.text(recivo.sucursal.nombre, 0, y + 20, { align: "center" });
            doc.text("N° " + recivo.numero_correlativo, 0, y + 35, { align: "center" });
            doc.image(imagenEmpresa, 40, y - 20, { fit: [80, 80] });
            doc.rect(450, y - 15, 140, 20).dash(0, { space: 0 }).stroke();
            doc.rect(450, y + 10, 140, 20).dash(0, { space: 0 }).stroke();
            doc.rect(450, y + 35, 140, 20).dash(0, { space: 0 }).stroke();
            doc.font('Helvetica-Bold', 12);
            doc.text("Bs.", 455, y - 10);
            doc.text("$us.", 455, y + 15);
            doc.text("T./C.", 455, y + 40);
            //cuerpo
            doc.font('Helvetica', 12);
            doc.text("Recibí de:", 40, y + 80);
            doc.rect(100, y + 90, 490, 0).dash(1, { space: 5 }).stroke();
            doc.text("El importe de:", 40, y + 100);
            doc.rect(130, y + 110, 460, 0).stroke();
            doc.rect(40, y + 130, 550, 0).stroke();
            doc.text("Por concepto de:", 40, y + 140);
            doc.rect(140, y + 150, 450, 0).stroke();
            doc.rect(40, y + 170, 550, 0).stroke();
            doc.text("Factura a Nombre de:", 40, y + 180);
            doc.rect(165, y + 190, 280, 0).stroke();
            doc.text("N°", 450, y + 180);
            doc.rect(465, y + 190, 120, 0).stroke();
            doc.text("Efectivo", 40, y + 200);
            doc.rect(90, y + 195, 30, 25).dash(0, { space: 0 }).stroke();
            if (recivo.tipoPago.nombre == "DEPOSITO") {
                doc.text("Deposito N°", 200, y + 200);
            } else {
                doc.text("Cheque N°", 200, y + 200);
            }

            doc.rect(260, y + 210, 130, 0).dash(1, { space: 5 }).stroke();
            doc.text("Banco", 430, y + 200)
            doc.rect(465, y + 210, 120, 0).stroke();
            doc.rect(140, y + 240, 100, 0).stroke();
            doc.text("de", 240, y + 230);
            doc.rect(260, y + 240, 135, 0).stroke();
            doc.text("de 20", 400, y + 230);
            doc.rect(440, y + 240, 40, 0).stroke();
            doc.text("Recibí conforme", 80, y + 300);
            doc.rect(40, y + 290, 180, 0).stroke();
            doc.text("Nombre:", 40, y + 315);
            doc.rect(85, y + 325, 120, 0).stroke();
            doc.text("C.I:", 40, y + 330);
            doc.rect(60, y + 340, 145, 0).stroke();
            doc.text("Entregué conforme", 440, y + 300);
            doc.rect(405, y + 290, 180, 0).stroke();
            doc.text("Nombre:", 405, y + 315);
            doc.rect(455, y + 325, 130, 0).stroke();
            doc.text("C.I:", 405, y + 330);
            doc.rect(422, y + 340, 162, 0).stroke();


        }

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalAsignacionFactura);
            $scope.eliminarPopup($scope.idModalVentaKardexFactura);
            $scope.eliminarPopup($scope.idModalAsignacionFacturaKardex)
            $scope.eliminarPopup($scope.idModalDetalleKardex)
            $scope.eliminarPopup($scope.IdModalVerificarCuenta)
            $scope.eliminarPopup($scope.IdModalCobros)
            $scope.eliminarPopup($scope.IdModalHistorialCobros)
            $scope.eliminarPopup($scope.idModalConceptoEdicion)
        });

        $scope.inicio();
    });



