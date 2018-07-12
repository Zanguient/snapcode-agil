angular.module('agil.controladores')

    .controller('ControladorActivosFijos', function ($scope, $timeout, Paginator, $localStorage, $location, blockUI, ListaSubGruposProductoEmpresa, FieldViewer, GuardarConfiguracionActivosFijos, ObtenerConfiguracionActivosFijos,
        ActivosFijosEmpresa, RevaluarActivo) {

        $scope.idModalconfiguracionActivos = 'modal-configuracion-activos';
        $scope.idModalRevaluarActivo = 'modal-revaluar-activos';
        $scope.usuarioSesion = JSON.parse($localStorage.usuario);

        $scope.$on('$viewContentLoaded', function () {
            resaltarPestaña($location.path().substring(1));
            ejecutarScriptsActivos($scope.idModalconfiguracionActivos, $scope.idModalRevaluarActivo);
            $scope.buscarAplicacion($scope.usuarioSesion.aplicacionesUsuario, $location.path().substring(1));
            $scope.obtenerColumnasAplicacion();
        });

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.eliminarPopup($scope.idModalconfiguracionActivos);
            $scope.eliminarPopup($scope.idModalRevaluarActivo);
        });

        // $scope.mesesVidaUtil = Array.apply(null, new Array(12)).map(function (_, i) {
        //     return { id: i + 1 }
        // })

        $scope.calcularTotales = function () {
            $scope.totalesActivosFijos = {
                totalValores: 0,
                totalActualizacion: 0,
                totalActualizado: 0,
                totalDepreciacionAcumulada: 0,
                totalActualizacionDepreciacionAcumulada: 0,
                totalDepreciacionActualizada: 0,
                totalDepreciacionMensual: 0,
                totalDepreciacion: 0,
                totalNeto: 0
            };
            $scope.activosFijos.forEach(function (activo) {
                $scope.totalesActivosFijos.totalValores += activo.valores[0].valor
                $scope.totalesActivosFijos.totalActualizacion += activo.valores[0].incremento_actualizacion
                $scope.totalesActivosFijos.totalActualizado += activo.valores[0].valor_actualizado
                $scope.totalesActivosFijos.totalDepreciacionAcumulada += activo.valores[0].depreciacion_acumulada
                $scope.totalesActivosFijos.totalActualizacionDepreciacionAcumulada += activo.valores[0].incremento_actualizacion_depreciacion_acumulada
                $scope.totalesActivosFijos.totalDepreciacionActualizada += activo.valores[0].depreciacion_acumulada_actualizada
                $scope.totalesActivosFijos.totalDepreciacionMensual += activo.valores[0].depreciacion
                $scope.totalesActivosFijos.totalDepreciacion += activo.valores[0].total_depreciacion_acumulada
                $scope.totalesActivosFijos.totalNeto += activo.valores[0].valor_neto
            })
        }

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
            $scope.configuracionActivosFijos = []
            $scope.obtenerConfiguracionActivos()
            $scope.filtro = { mes: { id: new Date().getMonth() + 1 }, anio: { id: new Date().getFullYear() }, subgrupo: 0, codigo: 0, activo: 0, vida_util: 0 }
            $scope.obtenerSubGruposProductosEmpresaUsuario();
            $scope.obtenerPaginadorActivos();
            $scope.listaEstados = [
                { id: 1, nombre: 'Activo' },
                { id: 2, nombre: 'Inactivo' }];
            $scope.ConteoBusqueda = 0;
        }

        $scope.agregarDetalleConfiguracion = function (detalle) {
            if (!$scope.configuracionActivosFijos.some(function (det) {
                return det.subgrupo.id === detalle.subgrupo.id
            })) {
                var detalleConfiguracion = {
                    subgrupo: detalle.subgrupo,
                    vida_util: detalle.vida_util,
                    factor: detalle.factor
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
                    numero: { value: "Número", show: true },
                    activo: { value: "Activo", show: true },
                    codigo: { value: "Código", show: true },
                    cantidad: { value: "Cantidad", show: true },
                    mes: { value: "Mes", show: true },
                    anio: { value: "Año", show: true },
                    fecha_ingreso: { value: "Fecha ingreso", show: true },
                    valor: { value: "Valor", show: true },
                    actualizacion: { value: "Actualización", show: true },
                    valor_actualizado: { value: "Valor actualizado", show: true },
                    depreciacion_acumulada: { value: "Depreciación acumulada", show: true },
                    actualizacion_depreciacion_acumulada: { value: "Actualización de la depreciación acumulada", show: true },
                    depreciacion_acumulada_actualizada: { value: "Depreciación acumulada actualizada", show: true },
                    depreciacion_mes: { value: "Depreciación mensual", show: true },
                    total_depreciacion: { value: "Total depreciación", show: true },
                    valor_neto: { value: "Valor neto", show: true },
                    vida_util: { value: "Vida útil", show: true },
                    vida_restante: { value: "Vida restante (Meses)", show: true },
                    revaluado: { value: "Revaluado", show: true }
                }
            }, $scope.aplicacion.aplicacion.id);
            $scope.fieldViewer.updateObject();
            blockUI.stop();
        }

        $scope.obtenerSubGruposProductosEmpresaUsuario = function () {
            blockUI.start();
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
            $scope.paginator = Paginator();
            $scope.paginator.column = "nombre";
            $scope.paginator.direccion = "asc"
            $scope.paginator.callBack = $scope.buscarActivos;
            $scope.paginator.getSearch("", null, null);
        };

        $scope.filtrarFiltro = function (filtro, _, __) {
            if (__ !== undefined) {
                for (var key in filtro) {
                    if (filtro[key] == 0) {
                        filtro[key] = ""
                    }
                }
            } else {
                for (var key in filtro) {
                    if (filtro[key] === "" || filtro[key] === null || filtro[key] === undefined) {
                        filtro[key] = 0
                    }
                }
            }
            // for (var key in filtro) {
            //     if (filtro[key] === "" || filtro[key] === null) {
            //         filtro[key] = 0
            //     }
            // }
            if (_ === undefined || !_) {
                $scope.buscarActivos()
                // $scope.recargarItemsTabla()
            } else {
                return filtro
            }
        }

        $scope.buscarActivos = function () {
            blockUI.start()
            $scope.filtro = $scope.filtrarFiltro($scope.filtro, true)
            $scope.paginator.filter = $scope.filtro
            var prom = ActivosFijosEmpresa($scope.usuarioSesion.id_empresa, $scope.paginator)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje);
                } else {
                    if (res.activos.length > 0) {
                        $scope.activosFijos = res.activos;
                        $scope.paginator.setPages(res.paginas)
                        var indx = -1
                        if ($scope.configuracionActivosFijos.length > 0) {
                            $scope.activosFijos.forEach(function (activo, i) {
                                if ($scope.configuracionActivosFijos.some(function (config, j) {
                                    indx = j
                                    return config.subgrupo.id == activo.activo.subgrupo.id
                                })) {
                                    var diff = new Date().getMonth() - new Date(activo.fecha_ingreso).getMonth() + (12 * (new Date().getFullYear() - new Date(activo.fecha_ingreso).getFullYear()));
                                    // var diff = new Date().getTime() - new Date(activo.fecha_ingreso).getMonth() 
                                    $scope.activosFijos[i].vida_util = $scope.configuracionActivosFijos[indx].vida_util
                                    $scope.activosFijos[i].vida_restante = $scope.configuracionActivosFijos[indx].vida_util - diff
                                }
                            })
                            // if ($scope.filtro.vida_util != 0) {
                            //     $scope.activosFijos = 
                            // }
                        }
                        $scope.calcularTotales()
                    } else {
                        if ($scope.ConteoBusqueda < 1) {
                            $scope.ConteoBusqueda += 1
                            $timeout(function () {
                                $scope.buscarActivos()
                            }, 5000)
                            return
                        } else {
                            $scope.activosFijos = res.activos;
                            $scope.totalesActivosFijos = {
                                totalValores: 0,
                                totalActualizacion: 0,
                                totalActualizado: 0,
                                totalDepreciacionAcumulada: 0,
                                totalActualizacionDepreciacionAcumulada: 0,
                                totalDepreciacionActualizada: 0,
                                totalDepreciacionMensual: 0,
                                totalDepreciacion: 0,
                                totalNeto: 0
                            };
                        }
                    }
                    blockUI.stop()
                }
                blockUI.stop()
                $scope.filtrarFiltro($scope.filtro, true, true)
            }).catch(function (err) {
                blockUI.stop();
                var memo = (err.stack !== undefined && err.stack !== null && err.stack !== "") ? err.stack : (err.data !== null && err.data !== undefined & err.data !== "") ? err.data : "Error: se perdio la conexión con el servidor.";
                $scope.mostrarMensaje(memo);
            })
        }

        $scope.revaluarActivo = function () {
            blockUI.start()
            var prom = RevaluarActivo($scope.activo, $scope.usuarioSesion.id_empresa, $scope.usuarioSesion.id)
            prom.then(function (res) {
                if (res.hasErr) {
                    $scope.mostrarMensaje(res.mensaje);
                } else {
                    $scope.cerrarDialogRevaluarActivo()
                }
                blockUI.stop();
            }).catch(function (err) {
                blockUI.stop();
                var msg = (err.stack !== undefined && err.stack !== null) ? err.stack : (err.message !== undefined && err.message !== null) ? err.message : 'Se perdió la conexión.'
                $scope.mostrarMensaje(msg)
            });
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
        $scope.abrirDialogRevaluarActivo = function (activo) {
            if (activo !== undefined && activo !== null) {
                $scope.activo = activo
                $scope.abrirPopup($scope.idModalRevaluarActivo);
            } else {
                $scope.mostrarMensaje('La información del activo es incorrecta.')
            }
        }

        $scope.cerrarDialogRevaluarActivo = function () {
            $scope.activo = {}
            $scope.cerrarPopup($scope.idModalRevaluarActivo);
        }
        $scope.inicio();
    });
