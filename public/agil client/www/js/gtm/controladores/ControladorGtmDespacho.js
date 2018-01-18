angular.module('agil.controladores')

    .controller('ControladorGtmDespacho', function ($scope, $localStorage, $location, $templateCache, $route, blockUI, Paginator, FieldViewer,
        GtmDespachos) {

        blockUI.start();

        $scope.usuario = JSON.parse($localStorage.usuario);
        $scope.idModalAsignacionFactura = 'modal-asignacion-factura';

        $scope.usuario = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptDespacho($scope.idModalAsignacionFactura);
            $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });


        $scope.inicio = function () {
            $scope.obtenerDespachados();
        }

        $scope.obtenerDespachados = function () {
            var promesa = GtmDespachos($scope.usuario.id_empresa);
            promesa.then(function (despachos) {
                $scope.despachos = despachos;
            });
        }

        $scope.imprimir = function () {
            blockUI.start();
            var doc = new PDFDocument({ size: [612, 792], margin: 10 });
            var stream = doc.pipe(blobStream());
            var fechaActual = new Date();
            var x = 80
            doc.font('Helvetica', 8);
            var y = 115 + 80, itemsPorPagina = 15, items = 0, pagina = 1, totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas);

            for (var i = 0; i < 20 && items <= itemsPorPagina; i++) {

                doc.font('Helvetica', 8);
                doc.text(i + 1, 55, y);
                doc.text('Codigo', 100, y);
                doc.text('Detalle', 180, y);
                doc.text('Cantidad', 380, y);
                doc.text('Precio', 450, y);
                doc.text('Importe', 520, y);
                //doc.rect(40, x + 80 ,540, y - 70).stroke(); ///////////////////
                doc.rect(40, y + 10, 540, 0).stroke();
                y = y + 20;
                items++;

                if (items > itemsPorPagina) {
                    // doc.rect(40, 105 + 80, 540, y - 115).stroke();
                    doc.rect(40, 105 + 80, 540, y - 115 - 80).stroke();
                    doc.rect(x, x + 80, 0, y - 90 - 80).stroke();
                    doc.rect(x + 80, x + 80, 0, y - 90 - 80).stroke();
                    doc.rect(x + 290, x + 80, 0, y - 90 - 80).stroke();
                    doc.rect(x + 350, x + 80, 0, y - 90 - 80).stroke();
                    doc.rect(x + 410, x + 80, 0, y - 90 - 80).stroke();
                    // doc.text(pagina + "/" + totalPaginas, 570, y + 15);
                    // doc.font('Helvetica', 6);
                    // doc.text("RESPONSABLE: " + $scope.usuario.nombre_usuario, 45, y + 10);
                    // doc.text("SOLICITANTE: " + $scope.totalViveresSolicitados.usuario.persona.nombre_completo, 345, y + 10);
                    // doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, y + 10);
                    doc.addPage({ size: [612, 792], margin: 10 });
                    y = 115 + 80;
                    items = 0;
                    pagina = pagina + 1;
                    $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas);
                }

            }
            doc.rect(40, 105 + 80, 540, y - 115 - 80).stroke();
            doc.rect(x, x + 80, 0, y - 90 - 80).stroke();
            doc.rect(x + 80, x + 80, 0, y - 90 - 80).stroke();
            doc.rect(x + 290, x + 80, 0, y - 90 - 80).stroke();
            doc.rect(x + 350, x + 80, 0, y - 90 - 80).stroke();
            doc.rect(x + 410, x + 80, 0, y - 90 - 80).stroke();
            doc.rect(490, y - 10, 90,20).stroke();
            doc.rect(370, y - 10, 60,20).stroke();
            doc.rect(370, y+10, 60,20).stroke();
            doc.font('Helvetica-Bold', 8);
            doc.text('Total', x + 250, y)
            doc.text('Saldo', x + 250, y + 20)
            doc.font('Helvetica', 8);
            doc.text('Ntotal', x + 300, y)
            doc.text('Nsaldo', x + 300, y + 20)
            doc.text('Nimporte', 520, y)
            

            // doc.rect(x + 450, x, 0, y - 90).stroke();
            // var fechaActual = new Date();
            // var min = fechaActual.getMinutes();
            // if (min < 10) {
            //     min = "0" + min;
            // }
            // doc.text(pagina + "/" + totalPaginas, 570, y + 15);
            // doc.font('Helvetica', 6);
            // doc.text("RESPONSABLE: " + $scope.usuario.nombre_usuario, 45, y + 5);
            // doc.text("SOLICITANTE: " + $scope.totalViveresSolicitados.usuario.persona.nombre_completo, 345, y + 5);
            // doc.text("IMPRESION : " + fechaActual.getDate() + "/" + (fechaActual.getMonth() + 1) + "/" + fechaActual.getFullYear() + " Hr. " + fechaActual.getHours() + ":" + min, 175, y + 5);
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();
        }

        $scope.dibujarCabeceraPDFImpresion = function (doc, pagina, totalPaginas) {
            var yCabecera = 80;
            var yEspacio = 10;
            var fecha = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            // if ($scope.usuario.empresa.imagen.length > 100) {
            // 	doc.image($scope.usuario.empresa.imagen, 20, yCuerpo - yCabecera, { width: 50, height: 50 });
            // } else {
            // 	doc.image($scope.usuario.empresa.imagen, 20, yCuerpo - yCabecera);
            // }

            doc.font('Helvetica-Bold', 12);
            doc.text("DESPACHO DE PRODUCTOS", 0, 25, { align: "center" });
            doc.font('Helvetica-Bold', 8);
            // doc.text("SUCURSAL : ", -40, 50, { align: "center" });
            doc.font('Helvetica', 8);
            doc.font('Helvetica-Bold', 8);
            doc.text("FECHA: ", 510, 60, { width: 40 });
            doc.text("Cod. Interno: ", 465, 80);
            doc.text("Zona:", 465, 90);
            doc.text("Cod. SAP: ", 465, 100);
            doc.text("Cod. Vend: ", 465, 110);
           
            doc.font('Helvetica', 8);
            doc.text(fecha, 545, 60, { width: 40 });
            doc.text("Codigo interno", 530, 80);
            doc.text("Zona X ", 490, 90);
            doc.text("Cod. SAP X ", 510, 100);
            doc.text("Cod. Vend X ", 510, 110);

            doc.font('Helvetica-Bold', 14);
            doc.text("N°", 380, 25, { align: "center" });
            doc.text('correlativo', 510, 25);

            doc.rect(40, 80 + 80, 540, 25).stroke();//////cabecera

            doc.font('Helvetica-Bold', 8);
            doc.text("Nº", 55, 90 + yCabecera);

            doc.text("Código", 100, 90 + yCabecera);

            doc.text("Detalle", 180, 90 + yCabecera);
            doc.text("Cantidad", 380, 90 + yCabecera);
            doc.text("Precio", 450, 90 + yCabecera);
            doc.text("Importe", 520, 90 + yCabecera);
            doc.text("Clientes:", 40, 90);
            doc.text("Destino Mercaderia:", 40, 100);
            doc.text("Nombre Fact:", 40, 110);
            doc.text("CI/NIT:", 40, 120);
            doc.text("Teléfono:",200, 120);
            doc.text("Dirección:", 40, 130);

            doc.font('Helvetica', 8);
            doc.text("Cliente", 80, 90);
            doc.text("Destino ", 120, 100);
            doc.text("Nombre", 100, 110);
            doc.text("CI", 80, 120);
            doc.text("646465464", 240, 120);
            doc.text("Dirección", 80, 130);
        }

        $scope.abrirModalAsignacionFactura=function(detalle_despacho){
            $scope.abrirPopup($scope.idModalAsignacionFactura);
            $scope.detalle_despacho=detalle_despacho;
        }

        $scope.cerrarAsignacionFactura=function(){
            $scope.cerrarPopup($scope.idModalAsignacionFactura);
        }

        $scope.establecerFactura=function(detalle_despacho){
            
            $scope.cerrarAsignacionFactura();
        }

        $scope.$on('$routeChangeStart', function (next, current) {
			$scope.eliminarPopup($scope.idModalWizardEstibajeEdicion);
		});
        $scope.inicio();
    });



