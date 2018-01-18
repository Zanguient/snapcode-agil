angular.module('agil.controladores')
    .controller('controladorProformas', function ($scope, $filter, $rootScope, $route, $templateCache, $location, $window, $localStorage, Paginator, $timeout,
        blockUI, ClasesTipo, socket, ObtenerCambioMoneda, ClientesNit, Proformas, FiltroProformas, ActividadEmpresa, ActividadServicio, ActividadesEmpresa) {

        $scope.usuario = JSON.parse($localStorage.usuario);
        convertUrlToBase64Image($scope.usuario.empresa.imagen, function (imagenEmpresa) {
            $scope.usuario.empresa.imagen = imagenEmpresa;
        });
        $scope.modalConfiguracionActividadesServicios = 'modalConfiguracionActividadesServicios'
        $scope.wizardConfiguracionActividadesServicios = 'modal-wizard-panel-container'
        $scope.modalConfiguracionActividades = 'modalConfiguracionActividades'
        $scope.wizardConfiguracionActividades = 'modal-wizard-panel-container-actividad'
        $scope.dialogProformaEdicion = 'proforma-edicion'
        $scope.dialogClientesProforma = 'dialog-cliente-proforma'
        $scope.$on('$viewContentLoaded', function () {
            // resaltarPestaña($location.path().substring(1));
            ejecutarScriptsProformas($scope.modalConfiguracionActividadesServicios, $scope.wizardConfiguracionActividadesServicios, $scope.dialogProformaEdicion, $scope.dialogClientesProforma, $scope.modalConfiguracionActividades, $scope.wizardConfiguracionActividades);
            // $scope.buscarAplicacion($scope.usuario.aplicacionesUsuario, $location.path().substring(1));
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.modalConfiguracionActividadesServicios);
            $scope.eliminarPopup($scope.dialogProformaEdicion);
            $scope.eliminarPopup($scope.dialogClientesProforma);
        })
        $scope.eliminarDetalleActividadEmpresa = function (actividad) {
            if (actividad.id !== undefined) {
                actividad.eliminado = true
            } else {
                $scope.actividadesEmpresa.splice($scope.actividadesEmpresa.indexOf(actividad), 1)
            }
        }
        $scope.getFecha = function () {
            if ($scope.proforma !== undefined) {
                return new Date($scope.proforma.fecha)
            } else {
                return new Date()
            }
        }

        $scope.actualizarPeriodo = function (date) {
            var fecha = new Date($scope.convertirFecha(date))
            $scope.obtenerCambioMonedaProforma(fecha)
            $scope.proforma.periodo.mes.id = fecha.getMonth()
            $scope.proforma.periodo.anio.id = fecha.getFullYear()
        }
        $scope.buscarCliente = function (query) {
            if (query != "" && query != undefined) {
                var promesa = ClientesNit($scope.usuario.id_empresa, query);
                return promesa;
            }
        };
        $scope.establecerCliente = function (cliente) {
            $scope.proforma.cliente = cliente;
            /*   $scope.enfocar('razon_social');
              $scope.capturarInteraccion(); */
        }
        $scope.enfocar = function (elemento) {
            $timeout(function () {
                $("#" + elemento).focus();
            }, 0);
        }
        $scope.inicio = function () {
            $scope.actividadesEmpresa = []
            $scope.nActividad = {}
            $scope.proforma = {}
            $scope.configuracionActividadServicio = []
            $scope.servicios = [{ actividad: { id: 13, id_tipo: 3, nombre: "DESARROLLO DE SOFTWARE", nombre_corto: "DSW", habilitado: true }, codigo: "6rg345", nombre: "serv wertwgdvf", precio: "236234", $$hashKey: "object:820" }]
            $scope.detalleProforma = {}
            $scope.detallesProforma = []

            $scope.meses = [{ id: 0, nombre: "Enero" }, { id: 1, nombre: "Febrero" }, { id: 2, nombre: "Marzo" }, { id: 3, nombre: "Abril" }, { id: 4, nombre: "Mayo" }, { id: 5, nombre: "Junio" }, { id: 6, nombre: "Julio" }, { id: 7, nombre: "Agosto" },
            { id: 8, nombre: "Septiembre" }, { id: 9, nombre: "Octubre" }, { id: 10, nombre: "Noviembre" }, { id: 11, nombre: "Diciembre" }];

            var actual_year_diference = (new Date().getFullYear() - 1980)
            $scope.anios = Array.apply(null, Array(actual_year_diference + 1)).map(function (_, i) {
                var start_year = 1980
                var year = { id: start_year + i, nombre: start_year + i }
                return year
            })

            $scope.proformas = Array.apply(null, Array(5)).map(function (_, i) {
                var proforma = { prof: "Prof_" + i, cliente: { id: i, nombre: "Cliente_" + i }, periodo: { mes: "enero", anio: "201" + i }, sucursal: { id: i, nombre: "Sucursal_" + i }, actividad: { id: i, nombre: "Actividad_" + i }, servicio: { id: i, nombre: "servicio_" + i }, usuario: $scope.usuario, monto: i * i, fecha_recepcion: new Date(), fecha_proforma: new Date(), fechaproformaOK: new Date(), fecha_factura: new Date(), fecha_cobro: new Date() }
                return proforma
            })
            $scope.sucursalesUsuario = "";
            for (var i = 0; i < $scope.usuario.sucursalesUsuario.length; i++) {
                $scope.sucursalesUsuario = $scope.sucursalesUsuario + $scope.usuario.sucursalesUsuario[i].sucursal.id;
                if (i + 1 != $scope.usuario.sucursalesUsuario.length) {
                    $scope.sucursalesUsuario = $scope.sucursalesUsuario + ',';
                }
            }
            $scope.detalleVenta = { producto: {}, centroCosto: {}, cantidad: 1, descuento: 0, recargo: 0, ice: 0, excento: 0, tipo_descuento: false, tipo_recargo: false }
            $scope.solicitud = { solicitudesProductos: [] }
            $scope.obtenerPaginador()
            $scope.obtenerCentroCosto()
        }

        $scope.sinFuncionalidad = function () {
            $scope.mostrarMensaje('Sin funcionalidad')
        }

        $scope.agregardetalleProforma = function (detalleProforma) {
            $scope.proforma.totalImporteBs = 0
            $scope.proforma.totalImporteSus = 0
            $scope.detallesProforma.push(detalleProforma)
            $scope.detalleProforma = {}
            $scope.detallesProforma.forEach(function (proforma) {
                $scope.proforma.totalImporteBs += proforma.importeBs
                $scope.proforma.totalImporteSus += proforma.importeSus
            });
            if ($scope.detalleProforma.length > 0) {

            }
        }

        $scope.obtenerCambioMonedaProforma = function (fechaMoneda) {
            // var fecha = new Date(convertirFecha(fechaMoneda))
            var promesa = ObtenerCambioMoneda(fechaMoneda)
            promesa.then(function (dato) {
                console.log(dato)
                if (dato.monedaCambio) {
                    $scope.moneda = dato.monedaCambio;
                } else {
                    $scope.moneda = { ufv: "--", dolar: "--" }
                }
            })
        }

        $scope.obtenerCentroCosto = function () {
            var promesa = ClasesTipo('CENCOS')
            promesa.then(function (dato) {
                $scope.centroCostos = dato.clases
            })
        }

        $scope.obtenerActividadesSucursal = function (idSucursal) {
            $scope.actividadesSucursal = [];
            // var promesa = ClasesTipo('ACTCOM')
            var sucursal = $.grep($scope.sucursales, function (e) { return e.id == idSucursal; })[0];
            $scope.actividadesDosificaciones = sucursal.actividadesDosificaciones;
            // $scope.actividades=[];
            for (var i = 0; i < $scope.actividadesDosificaciones.length; i++) {
                $scope.actividadesSucursal.push($scope.actividadesDosificaciones[i].actividad);
            }
            // $scope.filtro.actividad = $scope.actividades.length == 1 ? $scope.actividades[0] : null;
        }

        $scope.obtenerActividades = function () {
            $scope.actividades = [];
            var promesa = ClasesTipo('ACTCOM')
            promesa.then(function (actividades) {
                $scope.actividades = actividades.clases
            })
            // var sucursal=$.grep($scope.sucursales, function(e){return e.id == idSucursal;})[0];
            // $scope.actividadesDosificaciones=sucursal.actividadesDosificaciones;
            // $scope.actividades=[];
            // for(var i=0;i<$scope.actividadesDosificaciones.length;i++){
            //     $scope.actividades.push($scope.actividadesDosificaciones[i].actividad);
            // }
            // $scope.filtro.actividad=$scope.actividades.length==1?$scope.actividades[0]:null;
        }

        $scope.obtenerPaginador = function () {
            blockUI.start();
            $scope.paginator = Paginator();
            $scope.paginator.column = "fecha";
            $scope.paginator.direccion = "asc";
            $scope.filtro = { empresa: $scope.usuario.id_empresa, rol: $scope.usuario.rolesUsuario[0].rol.nombre, id: $scope.usuario.id, desde: 0, hasta: 0, sucursal: 0, almacen: 0, movimiento: 0, estado: 0, valuado: 0, pagina: 1, items_pagina: 10, busqueda: "" };
            $scope.paginator.callBack = $scope.obtenerProformas;
            $scope.paginator.getSearch("", $scope.filtro, null);
            blockUI.stop();
        }

        $scope.guardarConfiguracionActividadServicios = function (actividadServicios) {
            var button = $('#siguiente').text().trim();
            if (button != "Siguiente") {
                $scope.nActividad = {}
                actividadServicios.map(function (ser) {
                    $scope.servicios.push(ser)
                })
                // var ser = {actividad:nActividad.actividadEconomica,nombre:nActividad.servicio.nombre,precio: nActividad.servicio.precio}
                // $scope.servicios.push(nActividad.servicio)
                $scope.mostrarMensaje('Servicios creados satisfactoriamente!')
                $scope.cerrarConfiguracionActividadesServicios()
            }
        }

        $scope.buscarservicio = function (query) {
            if (query != "" && query != undefined) {
                var promesa = $filter('filter')($scope.servicios, query);
                return promesa;
            }
        }
        $scope.establecerservicio = function (servico) {
            $scope.detalleProforma = { cantidad: 1, nombre: servico.nombre, codigo: servico.codigo, precio: servico.precio, actividad_id: servico.actividad.id, actividad: servico.actividad }
            $scope.detalleProforma.precioSus = $scope.detalleProforma.precio / $scope.moneda.dolar
            $scope.detalleProforma.importeBs = $scope.detalleProforma.precio * $scope.detalleProforma.cantidad
            $scope.detalleProforma.importeSus = $scope.detalleProforma.precio / $scope.moneda.dolar * $scope.detalleProforma.cantidad
            $scope.enfocar('cantidad');
        }
        $scope.calcularImporte = function () {
            $scope.detalleProforma.importeBs = $scope.detalleProforma.precio * $scope.detalleProforma.cantidad
            $scope.detalleProforma.importeSus = $scope.detalleProforma.precio / $scope.moneda.dolar * $scope.detalleProforma.cantidad
        }
        $scope.agregarDetalleActividadServicio = function (actividadServicio) {
            var check = $scope.buscarservicio(actividadServicio.servicio, actividadServicio.servicio.nombre)
            if (check !== null && check !== undefined) {
                var service = { actividad: actividadServicio.actividadEconomica, codigo: actividadServicio.servicio.codigo, nombre: actividadServicio.servicio.nombre, precio: actividadServicio.servicio.precio }
                $scope.configuracionActividadServicio.push(service)
            } else {
                $scope.mostrarMensaje('El servicio ya fue asignado a esta actividad')
            }

        }

        $scope.guardarConfiguracionActividadEconomicas = function () {
            blockUI.start()
            if ($scope.actividadesEmpresa.length > 0) {
                var nuevasActividades = $scope.actividadesEmpresa.map(function (_) {
                    if (_.id === undefined) {
                        return _
                    }
                })
                ActividadEmpresa.save({id_empresa:$scope.usuario.empresa.id}, nuevasActividades, function (res) {
                    $scope.mostrarMensaje(res.mensaje)
                    var prom = ActividadesEmpresa($scope.usuario.empresa.id)
                    prom.then(function (activities) {
                        $scope.actividadesEmpresa = activities.actividades
                        if (activities.mensaje !== undefined) {
                            $scope.mostrarMensaje(activities.mensaje)
                        }
                        blockUI.stop()
                    }).catch(function (err) {
                        $scope.mostrarMensaje(err.data)
                        blockUI.stop()
                    })
                    
                },function (err) {
                    blockUI.stop()
                    $scope.mostrarMensaje(err.data)
                })
            } else {
                blockUI.stop()
                $scope.mostrarMensaje('Ingrese al menos 1 actividad para guardar.')
            }
        }

        $scope.agregarDetalleActividadEmpresa = function (actividad) {
            var act = { nombre: actividad.nombre, id_clase_actividad: actividad.id, id_empresa: $scope.usuario.empresa.id }
            $scope.actividadesEmpresa.push(act)
        }

        $scope.eliminarDetalleConfiguracion = function (actividad) {
            var indx = $scope.configuracionActividadServicio.indexOf(actividad)
            $scope.configuracionActividadServicio.splice(indx, 1)
            $scope.cerrarConfirmacionEliminacion();
        }

        $scope.buscarCliente = function (query) {
            if (query != "" && query != undefined) {
                var promesa = ClientesNit($scope.usuario.id_empresa, query);
                return promesa;
            }
        }

        $scope.obtenerProformas = function () {
            blockUI.start()
            $scope.filtro.busqueda = $scope.paginator.search
            $scope.filtro.desde = ($scope.filtro.fechaInicioTexto !== undefined) ? ($scope.filtro.fechaInicioTexto !== "") ? $scope.convertirFecha($scope.filtro.fechaInicioTexto) : 0 : 0
            $scope.filtro.hasta = ($scope.filtro.fechaFinTexto !== undefined) ? ($scope.filtro.fechaFinTexto !== "") ? $scope.convertirFecha($scope.filtro.fechaFinTexto) : 0 : 0
            $scope.filtro.estado = ($scope.filtro.estado !== null) ? ($scope.filtro.estado.id !== undefined) ? $scope.filtro.estado.id : 0 : 0
            $scope.paginator.filter = $scope.filtro
            blockUI.stop()
            // var promesa = SolicitudesReposicion($scope.paginator)
            // promesa.then(function (solicitudes) {
            // 	$scope.paginator.setPages(solicitudes.paginas);
            // 	$scope.solicitudesOperaciones = solicitudes.solicitudes
            // 	$scope.solicitudesOperaciones
            // 	blockUI.stop()
            // }, function (error) {
            // 	$scope.mostrarMensaje(error.data)
            // 	blockUI.stop()
            // })
        }
        $scope.guardarProforma = function (valid, proforma) {
            if (valid) {
                proforma.detallesProforma = $scope.detallesProforma
                proforma.usuario = $scope.usuario
                $scope.proformas.push(proforma)
            } else {
                $scope.mostrarMensaje('Faltan Campos')
            }

        }
        $scope.fechaATexto = function (fecha) {
            fech = new Date(fecha)
            fecha = fech.getDate() + "/" + (fech.getMonth() + 1) + "/" + fech.getFullYear();
            return fecha
        }

        $scope.abrirdialogProformaEdicion = function (proforma) {
            $scope.obtenerCambioMonedaProforma(new Date())
            if (proforma !== undefined) {
                $scope.proforma = proforma
                $scope.proforma.fecha_proforma = $scope.fechaATexto(new Date(proforma.fecha_proforma))
                $scope.proforma.fecha_proforma = new Date(proforma.fecha).toLocaleDateString()
            } else {
                $scope.proforma = { sucursal: $scope.sucursales[0], fecha_proforma: new Date(), periodo: { mes: { id: new Date().getMonth() }, anio: { id: new Date().getFullYear() } } }
                $scope.proforma.fecha_proforma = new Date().toLocaleDateString()
                // $scope.proforma.
            }
            // $scope
            $scope.obtenerActividadesSucursal($scope.proforma.sucursal.id)
            $scope.abrirPopup($scope.dialogProformaEdicion);
        }

        $scope.cerrardialogProformaEdicion = function () {
            // $scope.nActividad = {}
            // $scope.configuracionActividadServicio = []
            $scope.cerrarPopup($scope.dialogProformaEdicion);
        }

        $scope.abrirConfiguracionActividadesServicios = function () {
            // $scope.obtenerActividades()
            $scope.abrirPopup($scope.modalConfiguracionActividadesServicios);
        }

        $scope.abrirdialogClientesProforma = function () {
            // $scope.obtenerActividades()
            $scope.abrirPopup($scope.dialogClientesProforma);
        }

        $scope.cerrardialogClientesProforma = function () {
            // $scope.nActividad = {}
            // $scope.configuracionActividadServicio = []
            $scope.cerrarPopup($scope.dialogClientesProforma);
        }

        $scope.obtenerActividadesEmpresa = function (idEmpresa) {

        }

        $scope.abrirConfiguracionActividades = function () {
            $scope.obtenerActividades()
            $scope.obtenerActividadesEmpresa($scope.usuario.empresa.id)
            $scope.abrirPopup($scope.modalConfiguracionActividades);
        }

        $scope.cerrarConfiguracionActividades = function () {
            // $scope.nActividad = {}
            // $scope.configuracionActividadServicio = []
            $scope.cerrarPopup($scope.modalConfiguracionActividades);
        }

        $scope.cerrarConfiguracionActividadesServicios = function () {
            $scope.nActividad = {}
            $scope.configuracionActividadServicio = []
            $scope.cerrarPopup($scope.modalConfiguracionActividadesServicios);
        }
        $scope.PopoverConfiguracionActividad = {
            templateUrl: 'PopoverConfiguracionActividad.html',
            title: 'Cuentas Axiliares',
            isOpen: false
        };
        $scope.inicio()
    })