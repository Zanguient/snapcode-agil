angular.module('agil.controladores')

    .controller('ControladorActivosFijos', function ($scope, $localStorage, $location, blockUI, ListaSubGruposProductoEmpresa, FieldViewer, GuardarConfiguracionActivosFijos, ObtenerConfiguracionActivosFijos) {

        $scope.idModalconfiguracionActivos = 'modal-configuracion-activos';
        $scope.usuarioSesion = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsActivos($scope.idModalconfiguracionActivos);
            $scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion();
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalconfiguracionActivos);
        });

        // $scope.mesesVidaUtil = Array.apply(null, new Array(12)).map(function (_, i) {
        //     return { id: i + 1 }
        // })

        $scope.factorConfiguracion = Array.apply(null, new Array(20)).map(function (_, i) {
            return { id: (i + 1) * 5 }
        })

        $scope.abrirConfiguracionActivos = function () {
            $scope.abrirPopup($scope.idModalconfiguracionActivos);
        }

        $scope.cerrarConfiguracionActivos = function () {
            $scope.cerrarPopup($scope.idModalconfiguracionActivos);
        }

        $scope.inicio = function () {
            $scope.obtenerSubGruposProductosEmpresaUsuario();
            $scope.obtenerConfiguracionActivos()
            $scope.listaEstados = [
                { id: 1, nombre: 'Activo' },
                { id: 2, nombre: 'Inactivo' }];
        }

        $scope.agregarDetalleConfiguracion = function (detalle) {
            if (!$scope.configuracionActivosFijos.some(function (det) {
                return det.subgrupo.id === detalle.subgrupo.id
            })) {
                var detalleConfiguracion = {
                    subgrupo: detalle.subgrupo,
                    vida_util: detalle.vida_util.id,
                    factor: detalle.factor.id
                }
                $scope.configuracionActivosFijos.push(detalleConfiguracion)
            } else {
                $scope.mostrarMensaje('Ya existe en la lista de configuración.')
            }
        }

        $scope.obtenerColumnasAplicacion = function () {
            blockUI.start();
            $scope.fieldViewer = FieldViewer({
                crear: true,
                id_empresa: $scope.usuarioSesion.empresa.id,
                configuracion: {
                    numero: { value: "Número.", show: true },
                    activo: { value: "Activo.", show: true },
                    codigo: { value: "Código.", show: true },
                    cantidad: { value: "Cantidad.", show: true },
                    mes: { value: "Mes.", show: true },
                    anio: { value: "Año.", show: true },
                    fecha_ingreso: { value: "Fecha ingreso.", show: true },
                    valor: { value: "Valor.", show: true },
                    actualizacion: { value: "Actualización.", show: true },
                    valor_actualizado: { value: "Valor actualizado.", show: true },
                    depreciacion_acumulada: { value: "Depreciación acumulada.", show: true },
                    actualizacion_depreciacion_acumulada: { value: "Actualización de la depreciación acumulada.", show: true },
                    depreciacion_acumulada_actualizada: { value: "Depreciación acumulada actualizada.", show: true },
                    depreciacion_mes: { value: "Depreciación mensual.", show: true },
                    total_depreciacion: { value: "Total depreciación.", show: true },
                    valor_neto: { value: "Valor neto.", show: true },
                    vida_util: { value: "Vida útil.", show: true },
                    vida_restante: { value: "Vida restante (Meses).", show: true },
                    revaluado: { value: "Revaluado", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
            blockUI.stop();
        }

        $scope.obtenerSubGruposProductosEmpresaUsuario = function () {
            blockUI.start();
            // var promesa = ListaGruposProductoUsuario($scope.usuarioSesion.id_empresa, $scope.usuarioSesion.id);
            var promesa = ListaSubGruposProductoEmpresa($scope.usuarioSesion.id_empresa, $scope.usuarioSesion.id);
            promesa.then(function (grupos) {
                blockUI.stop();
                if (grupos.length > 0) {
                    $scope.subGruposProducto = grupos;
                } else {
                    $scope.subGruposProducto = [];
                    $scope.mostrarMensaje('Parece que el usuario actual no cuenta con grupos de productos.');
                }
            }).catch(function (err) {
                $scope.subGruposProducto = [];
                var mensaje = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.data !== undefined && err.data !== null && err.data !== "") ? err.data : 'Error: Se perdio la conexión.';
                $scope.mostrarMensaje(mensaje);
                blockUI.stop();
            });
        };

        $scope.obtenerConfiguracionActivos = function () {
            blockUI.start()
            var prom = ObtenerConfiguracionActivosFijos($scope.usuarioSesion.id_empresa, $scope.usuarioSesion.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.configuracionActivosFijos = []
                    $scope.mostrarMensaje(res.mensaje)
                } else {
                    $scope.configuracionActivosFijos = res.configuracion
                }
                blockUI.stop()
            }).catch(function (err) {
                blockUI.stop();
                var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
                $scope.mostrarMensaje(memo);
            })
        };

        $scope.obtenerPaginadorActivos = function () {
            $scope.paginatorProductosAsignados = Paginator();
            $scope.paginatorProductosAsignados.column = "nombre";
            $scope.paginatorProductosAsignados.filter = $scope.filtro;
            $scope.paginatorProductosAsignados.callBack = $scope.buscarActivos;
            $scope.paginatorProductosAsignados.getSearch("", null, null);
        };

        $scope.buscarActivos = function () {
            blockUI.start()
            var prom = ActivosFijosEmpresa($scope.usuarioSesion.id_empresa, $scope.usuarioSesion.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje);
                } else {
                    $scope.activosFijos = res.configuracion;
                }
                blockUI.stop()
            }).catch(function (err) {
                blockUI.stop();
                var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
                $scope.mostrarMensaje(memo);
            })
        }

        $scope.guardarConfiguracionActivos = function () {
            blockUI.start()
            if ($scope.configuracionActivosFijos.length > 0) {
                var prom = GuardarConfiguracionActivosFijos($scope.usuarioSesion.id_empresa, $scope.usuarioSesion.id, $scope.configuracionActivosFijos)
                prom.then(function (res) {
                    if (res.hasErr) {
                        $scope.mostrarMensaje(res.mensaje)
                    } else {
                        $scope.mostrarMensaje(res.mensaje)
                        $scope.cerrarConfiguracionActivos()
                    }
                    blockUI.stop()
                }).catch(function (err) {
                    blockUI.stop();
                    var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
                    $scope.mostrarMensaje(memo);
                })
            } else {
                $scope.mostrarMensaje('No hay cambios para guardar.')
            }

        };
        $scope.inicio();
    });
