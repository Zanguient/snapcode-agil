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

        $scope.imprimir = function (gtm_despacho) {
            blockUI.start();
            var importeTotal = 0
            var cantidadTotal = 0
            var doc = new PDFDocument({ size: [612, 792], margin: 10 });
            // if ($scope.usuario.empresa.imagen.length > 100) {
			// 	doc.image($scope.usuario.empresa.imagen, 20, 50, { width: 50, height: 50 });
			// } else {
			// 	doc.image($scope.usuario.empresa.imagen, 20, 50);
			// }
            var stream = doc.pipe(blobStream());
            var fechaActual = new Date();
            var x = 80
            doc.font('Helvetica', 8);
            var y = 115 + 80, itemsPorPagina = 15, items = 0, pagina = 1, totalPaginas = Math.ceil(1 / itemsPorPagina);
            $scope.dibujarCabeceraPDFImpresion(doc, pagina, totalPaginas,gtm_despacho);

            for (var i = 0; i < 2 && items <= itemsPorPagina; i++) {

                doc.font('Helvetica', 8);
                doc.text((i%2===1)?'':i + 1, 55, y);
                doc.text((i%2===1)?'':gtm_despacho.producto.codigo, 100, y);
                doc.text(((i%2===1)?gtm_despacho.producto.nombre.toUpperCase()+ ' (DESPACHADO)':gtm_despacho.producto.nombre.toUpperCase()), 180, y);
                doc.text(gtm_despacho.cantidad, 380, y);
                doc.text((i%2===1)?'':gtm_despacho.precio_unitario, 450, y);
                doc.text((i%2===1)?'':gtm_despacho.importe, 520, y);
                //doc.rect(40, x + 80 ,540, y - 70).stroke();
                doc.rect(40, y + 10, 540, 0).stroke();
                y = y + 20;
                importeTotal += (i===1)?gtm_despacho.importe:0
                cantidadTotal += (i===1)?gtm_despacho.cantidad:0
                items++;

                if (items > itemsPorPagina) {

                    doc.rect(40, 105 + 80, 540, y - 115 - 80).stroke();
                    doc.rect(x, x + 80, 0, y - 90 - 80).stroke();
                    doc.rect(x + 80, x + 80, 0, y - 90 - 80).stroke();
                    doc.rect(x + 290, x + 80, 0, y - 90 - 80).stroke();
                    doc.rect(x + 350, x + 80, 0, y - 90 - 80).stroke();
                    doc.rect(x + 410, x + 80, 0, y - 90 - 80).stroke();

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

            doc.rect(60, y + 85, 90, 0,{ align: "left" }).stroke();
            doc.text('DESPACHO', 60, y + 90,{ align: "left" })
            doc.text($scope.usuario.persona.nombre_completo , 60, y + 100,{ align: "left" })
            doc.text('HORA DESP.: ', 60, y + 110,{ align: "left" })
            var hora = new Date().getHours()
            var min = new Date().getMinutes()
            doc.text('HORA DESP.: '+hora+':'+min, 60, y + 110,{ align: "left" })
            doc.rect(255, y + 85, 90, 0,{ align: "center" }).stroke();
            doc.text('FIRMA CONDUCTOR', -10, y + 90,{ align: "center" })
            doc.text('NOMBRE: ', -50, y + 100,{ align: "center" })

            doc.rect(440, y + 85, 90, 0,{ align: "right" }).stroke();
            doc.text('FIRMA CLIENTE', 350, y + 90,{ align: "center" })
            doc.text('NOMBRE: ', 330, y + 100,{ align: "center" })
            doc.text('HORA RECEP.: ', 350, y + 110,{ align: "center" })

            doc.font('Helvetica', 8);
            
            doc.text(cantidadTotal, x + 300, y)
            doc.text((gtm_despacho.cantidad - cantidadTotal), x + 300, y + 20)
            doc.text(importeTotal, 520, y)
            
            doc.end();
            stream.on('finish', function () {
                var fileURL = stream.toBlobURL('application/pdf');
                window.open(fileURL, '_blank', 'location=no');
            });
            blockUI.stop();
        }

        $scope.dibujarCabeceraPDFImpresion = function (doc, pagina, totalPaginas,gtm_despacho) {
            var yCabecera = 80;
            var yEspacio = 10;
            var fecha = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()
            // if ($scope.usuario.empresa.imagen.length > 100) {
            // 	doc.image($scope.usuario.empresa.imagen, 20, yCuerpo - yCabecera, { width: 50, height: 50 });
            // } else {
            // 	doc.image($scope.usuario.empresa.imagen, 20, yCuerpo - yCabecera);
            // }
            doc.rect(40, 80 + 80, 540, 25).fillAndStroke("silver", "#000");
            doc.font('Helvetica-Bold', 12)
            .fill('black')
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
            doc.text("", 490, 90);
            doc.text("", 510, 100);
            doc.text("Cod. Vend X ", 510, 110);

            doc.font('Helvetica-Bold', 14);
            doc.text("N°", 380, 25, { align: "center" });
            doc.text(gtm_despacho.id, 510, 25);

            doc.rect(40, 80 + 80, 540, 25).stroke()
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
            doc.text("Clientes:", 40, 90);
            doc.text("Destino Mercaderia:", 40, 100);
            doc.text("Nombre Fact:", 40, 110);
            doc.text("CI/NIT:", 40, 120);
            doc.text("Teléfono:",200, 120);
            doc.text("Dirección:", 40, 130);

            doc.font('Helvetica', 8);
            doc.text(gtm_despacho.despacho.cliente.contacto, 80, 90);
            doc.text(" ", 120, 100);
            doc.text(gtm_despacho.despacho.cliente.razon_social, 100, 110);
            doc.text(gtm_despacho.despacho.cliente.nit, 80, 120);
            doc.text(gtm_despacho.despacho.cliente.telefono1, 240, 120);
            doc.text(gtm_despacho.despacho.cliente.direccion, 80, 130);
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



