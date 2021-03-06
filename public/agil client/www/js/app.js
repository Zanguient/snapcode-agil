angular.module('agil', ['oc.lazyLoad','ngRoute', 'agil.controladores',
    'agil.servicios', 'agil.directivas', 'agil.filtros', 'checklist-model',
    'blockUI', 'ngStorage', 'ui.bootstrap', 'uiGmapgoogle-maps', 'isteven-multi-select',
    'chart.js', 'btford.socket-io','ngMessages','colorpicker','angular-table'])

    .config(['$routeProvider', 'uiGmapGoogleMapApiProvider', '$httpProvider', 'ChartJsProvider', '$ocLazyLoadProvider',function ($routeProvider, uiGmapGoogleMapApiProvider, $httpProvider, ChartJsProvider, $ocLazyLoadProvider) {

        uiGmapGoogleMapApiProvider.configure({
            libraries: 'geometry,visualization'
        })
    

        ChartJsProvider.setOptions({
            chartColors: ['#FF5252', '#FF8A80'],
            colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
            responsive: true
        });
        // Configure all line charts
        ChartJsProvider.setOptions('line', {
            showLines: true
        });

        //Config For ocLazyLoading
        $ocLazyLoadProvider.config({
            'debug': true, // For debugging 'true/false'
            'events': true, // For Event 'true/false'
            // 'modules': [
            //     { // Set modules initially
            //         name : 'usuarios', // State1 module
            //         files: ['js/sys/controladores/controladoresUsuario.js']
            //     }
            // ]
        });

        $routeProvider
            .when('/', {
                controller: 'ControladorPrincipal',
                templateUrl: 'templates/inicio.html'
            })
            .when('/empresas', {
                controller: 'ControladorEmpresas',
                templateUrl: 'templates/agil/empresas.html'
            })

            .when('/usuarios', {
                controller: 'ControladorUsuarios',
                templateUrl: 'templates/sys/usuarios.html',
                resolve: {
                    loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('js/sys/servicios/serviciosUsuario.js');
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('js/sys/controladores/controladoresUsuario.js'); 
                    }]
                }
            })
            .when('/clientes', {
                controller: 'ControladorClientes',
                templateUrl: 'templates/agil/clientes.html',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('js/agil/controladores/controladoresCliente.js'); 
                    }]
                }
            })
            .when('/proveedores', {
                controller: 'ControladorProveedores',
                templateUrl: 'templates/agil/proveedores.html',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('js/agil/controladores/controladoresProveedor.js'); 
                    }]
                }
            })
            .when('/productos', {
                controller: 'ControladorProductos',
                templateUrl: 'templates/agil/productos.html',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('js/agil/controladores/controladoresProducto.js'); 
                    }]
                }
            })
            .when('/conceptos', {
                controller: 'ControladorConceptos',
                templateUrl: 'templates/sys/conceptos.html',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('js/sys/controladores/controladoresConcepto.js'); 
                    }]
                }
            })
            .when('/sucursales', {
                controller: 'ControladorSucursales',
                templateUrl: 'templates/agil/sucursales.html',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('js/agil/controladores/controladoresSucursal.js'); 
                    }]
                }
            })
            .when('/dosificaciones', {
                controller: 'ControladorDosificaciones',
                templateUrl: 'templates/agil/dosificaciones.html',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('js/agil/controladores/controladoresDosificacion.js'); 
                    }]
                }
            })
            .when('/codigo-control', {
                controller: 'ControladorCodigoControl',
                templateUrl: 'templates/agil/codigo-control.html'
            })
            .when('/compras', {
                controller: 'ControladorCompras',
                templateUrl: 'templates/agil/compras.html'
            })
            .when('/inventario', {
                controller: 'ControladorInventarios',
                templateUrl: 'templates/agil/inventarios.html'
            })
            .when('/ventas', {
                controller: 'ControladorVentas',
                templateUrl: 'templates/agil/ventas.html'
            })
            .when('/facturas', {
                controller: 'ControladorFacturas',
                templateUrl: 'templates/agil/configuraciones-factura.html'
            })
            .when('/libro-compras', {
                controller: 'ControladorLibroCompras',
                templateUrl: 'templates/agil/libro-compras.html'
            })
            .when('/libro-ventas', {
                controller: 'ControladorLibroVentas',
                templateUrl: 'templates/agil/libro-ventas.html'
            })
            .when('/reporte-almacenes', {
                controller: 'ControladorReporteAlmacenes',
                templateUrl: 'templates/agil/reporte-almacenes.html'
            })
            .when('/ventas-mensuales', {
                controller: 'ControladorVentasMensuales',
                templateUrl: 'templates/agil/ventas-mensuales.html'
            })
            .when('/compras-mensuales', {
                controller: 'ControladorComprasMensuales',
                templateUrl: 'templates/agil/compras-mensuales.html'
            })
            .when('/estado-resultados-no-contable', {
                controller: 'ControladorEstadoResultadosNoContable',
                templateUrl: 'templates/agil/estado-resultados-no-contable.html'
            })
            .when('/configuraciones-app', {
                controller: 'ControladorConfiguracionesApp',
                templateUrl: 'templates/agil/configuraciones-app.html'
            })
            .when('/rutas', {
                controller: 'ControladorRutas',
                templateUrl: 'templates/agil/rutas.html'
            })
            .when('/estado-cuentas-cliente', {
                controller: 'ControladorEstadoCuentasClientes',
                templateUrl: 'templates/agil/estado-cuentas-cliente.html'
            })
            .when('/estado-cuentas-proveedor', {
                controller: 'ControladorEstadoCuentasProveedores',
                templateUrl: 'templates/agil/estado-cuentas-proveedor.html'
            })
            .when('/seguimiento-app', {
                controller: 'ControladorSeguimientoApp',
                templateUrl: 'templates/agil/seguimiento-app.html'
            })
            .when('/pantalla-cliente', {
                controller: 'ControladorPantallaCliente',
                templateUrl: 'templates/agil/pantalla-cliente.html'
            })
            .when('/pantalla-despacho', {
                controller: 'ControladorPantallaDespacho',
                templateUrl: 'templates/agil/pantalla-despacho.html'
            })
            .when('/bancos', {
                controller: 'ControladorBancos',
                templateUrl: 'templates/agil/bancos.html'
            })
            .when('/cierres-caja', {
                controller: 'ControladorCierresCaja',
                templateUrl: 'templates/agil/cierres-caja.html'
            })
            .when('/mesa', {
                controller: 'ControladorMesa',
                templateUrl: 'templates/agil/mesa.html'
            })
            .when('/cotizacion', {
                controller: 'ControladorCotizacion',
                templateUrl: 'templates/agil/cotizacion.html'
            })
            .when('/contabilidad-cuenta', {
                controller: 'ControladorContabilidadCuenta',
                templateUrl: 'templates/agil/contabilidad-cuenta.html'
            })          
            .when('/comprobantes', {
                controller:'ControladorComprobantes',
                templateUrl:'templates/agil/comprobantes.html'
            })
            .when('/pacientes', {
                controller:'ControladorPacientes',
                templateUrl:'templates/agil/pacientes.html'
            })
            .when('/vehiculos', {
                controller:'ControladorVehiculos',
                templateUrl:'templates/agil/vehiculos.html'
            })
            .when('/mantenimientos', {
                controller:'ControladorMantenimientos',
                templateUrl:'templates/agil/mantenimientos.html'
            })
            .when('/rrhh', {
                controller:'ControladorRecursosHumanos',
                templateUrl:'templates/agil/rrhh.html'
            })
            .when('/planilla-sueldos', {
                controller:'ControladorPlanillaSueldos',
                templateUrl:'templates/agil/planilla-sueldos.html'
            })
            .when('/incremento-salarial', {
                controller:'ControladorIncrementoSalarial',
                templateUrl:'templates/agil/incremento-salarial.html'
            })
            .when('/planilla-rc-iva', {
                controller:'ControladoresRCIVA',
                templateUrl:'templates/agil/planilla-rc-iva.html'
            })
            .when('/planilla-retroactivos', {
                controller:'ControladoresPlanillaRetroactivos',
                templateUrl:'templates/agil/planilla-retroactivos.html'
            })
            .when('/operaciones', {
                controller:'ControladorOperaciones',
                templateUrl:'templates/agil/operaciones.html'
            })   
            .when('/gtm-estibaje', {
                controller:'ControladorGtmEstibaje',
                templateUrl:'templates/gtm/estibaje.html'
            }) 
            .when('/gtm-transportista', {
                controller:'ControladorGtmTransportista',
                templateUrl:'templates/gtm/transportista.html'
            }) 
            .when('/gtm-grupo-estibaje', {
                controller:'ControladorGtmGrupoEstibaje',
                templateUrl:'templates/gtm/grupo-estibaje.html'
            })
            .when('/proformas', {
                controller:'controladorProformas',
                templateUrl:'templates/agil/proformas.html'
            })  
            .when('/gtm-destino', {
                controller:'ControladorGtmDestino',
                templateUrl:'templates/gtm/destino.html'
            })  
            .when('/gtm-despachos', {
                controller:'ControladorGtmDespacho',
                templateUrl:'templates/gtm/despacho.html'
            })
            .when('/farmacia', {
                controller:'ControladoresFarmacia',
                templateUrl:'templates/agil/farmacia.html'
            })
            .when('/polifuncionalidad', {
                controller:'controladorPolifuncionalidad',
                templateUrl:'templates/agil/polifuncionalidad.html'
            })
            .when('/transacciones', {
                controller:'controladorTransacciones',
                templateUrl:'templates/agil/transacciones.html'
            })
            .when('/pedidos', {
                controller:'ControladorPedidos',
                templateUrl:'templates/agil/pedidos.html'
            })
            .when('/activos-fijos', {
                controller:'ControladorActivosFijos',
                templateUrl:'templates/agil/activosFijos.html'
            })
            .when('/geo-localizacion', {
                controller:'ControladorGtmGeoLocalizacion',
                templateUrl:'templates/agil/geoLocalizacion.html'
            })
            .when('/configuraciones-estados-financieros', {
                controller:'ControladorConfiguracionesEstadosFinancieros',
                templateUrl:'templates/estadosFinancierosAgil/configuraciones-estados-financieros.html'
            })
            .when('/balance-general', {
                controller:'ControladorBalanceGeneral',
                templateUrl:'templates/estadosFinancierosAgil/balance-general.html'
            })
            .when('/caja-chica', {
                controller:'ControladorCajaChica',
                templateUrl:'templates/agil/caja-chica.html'
            })
            .when('/solicitud-caja-chica', {
                controller:'ControladorSolicitudCajaChica',
                templateUrl:'templates/agil/solicitud-caja-chica.html'
            })
            .when('/comensales', {
                controller:'controladorComensalesEmpresa',
                templateUrl:'templates/agil/comensalesEmpresaExterna.html'
            })
            .when('/balance-comprobacion-suma-saldo', {
                controller:'ControladorBalaceComprobacionSumaSaldo',
                templateUrl:'templates/estadosFinancierosAgil/balanceComprobacionSumaSaldo.html'
            })
            .when('/estado-resultado', {
                controller:'ControladorEstadoResultados',
                templateUrl:'templates/estadosFinancierosAgil/estadoRultado-EEFF.html'
            })
            .when('/comprobante-diario', {
                controller:'ControladorComprobanteDiario',
                templateUrl:'templates/estadosFinancierosAgil/comprobanteDiario.html'
            })
            .when('/estado-evolucion-patrimonio', {
                controller:'controladoEvolucionPatrimonioNeto',
                templateUrl:'templates/estadosFinancierosAgil/estado-evolucion-patrimonio-neto.html'
            })
        .otherwise({
          redirectTo:'/'
        });

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token && $localStorage.usuario) {
                        var usuario = JSON.parse($localStorage.usuario);
                        if (usuario.rolesUsuario.length > 0 && usuario.rolesUsuario[0].rol) {
                            config.headers.Authorization = 'Bearer ' + $localStorage.token + ' ' + usuario.rolesUsuario[0].rol.nombre;
                        } else {
                            config.headers.Authorization = 'Bearer ' + $localStorage.token + ' ' + 'NONE';
                        }
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/');
                    }
                    return $q.reject(response);
                },
                'response': function (response) {
                    if (!$localStorage.token) {
                        $location.path('/');
                        //return $q.reject(response);
                    } else {
                        //return response;
                    }
                    return response;
                }
            };
        }]);


    }]);