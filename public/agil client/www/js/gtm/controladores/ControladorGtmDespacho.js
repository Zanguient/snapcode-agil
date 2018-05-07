angular.module('agil.controladores')

    .controller('ControladorGtmDespacho', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmDespachos, GtmDetalleDespacho, GetGtmDetalleDespachoHijos, ImprimirPdfDespachos, ExportarExelDespachos, ListaDetalleKardexFactura, GtmDetalleDespachoKardex,
        VerificarUsuarioEmpresa) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalAsignacionFactura = 'modal-asignacion-factura';
        $scope.idModalVentaKardexFactura = 'modal-venta-kardex-factura';
        $scope.idModalAsignacionFacturaKardex = "modal-asignacion-factura-kardex"
        $scope.idModalDetalleKardex = "modal-detalle-kardex"
        $scope.IdModalVerificarCuenta = 'modal-verificar-cuenta';
        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptDespacho($scope.idModalAsignacionFactura, $scope.idModalVentaKardexFactura, $scope.idModalAsignacionFacturaKardex, $scope.idModalDetalleKardex,
                $scope.IdModalVerificarCuenta);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerDespachados();
        }

        /*  $scope.obtenerDespachados = function () {
             var promesa = GtmDespachos($scope.usuario.id_empresa);
             promesa.then(function (despachos) {
                 $scope.despachos = despachos;
             });
         } */

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
            if ($scope.paginator.filter.inicio) {
                if ($scope.paginator.filter.inicio instanceof Date) { } else {
                    $scope.paginator.filter.inicio = new Date($scope.convertirFecha($scope.paginator.filter.inicio))
                    $scope.paginator.filter.fin = new Date($scope.convertirFecha($scope.paginator.filter.fin))
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
            doc.text(fecha, 540, y + 60, { width: 45 });
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
            var texto = gtm_despacho.despacho.destino.direccion + " " + gtm_despacho.despacho.destino.destino
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
            doc.text(gtm_despacho.despacho.cliente.nit, 80, y + 120 + a);
            if (gtm_despacho.despacho.cliente.telefono1) doc.text(gtm_despacho.despacho.cliente.telefono1, 240, y + 120 + a);
            doc.text(gtm_despacho.despacho.cliente.direccion, 80, y + 130 + a);

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

        $scope.abrirModalVerificarCuenta = function (dato, tipo) {
            $scope.dato = dato
            $scope.tipoDatosPermiso = tipo
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
                    $scope.cerrarModalVerificarCuenta();
                } else {
                    $scope.mostrarMensaje(dato.message)
                }
            })
        }
        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalAsignacionFactura);
            $scope.eliminarPopup($scope.idModalVentaKardexFactura);
            $scope.eliminarPopup($scope.idModalAsignacionFacturaKardex)
            $scope.eliminarPopup($scope.idModalDetalleKardex)
            $scope.eliminarPopup($scope.IdModalVerificarCuenta)
        });

        $scope.inicio();
    });



