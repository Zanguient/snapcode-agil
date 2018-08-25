angular.module('agil.filtros', [])
    .filter('orderRankin', function () {
        return function (item) {

            // var filtered = [];
            angular.forEach(item, function (it) {
                if (it.rankin == undefined) {
                    it.rankin = 0;
                    // filtered.push(it);
                }

            });

            return item;

        }
    })
    .filter('filtroIngresos', function () {
        return function (input) {
            var salida = [];
            angular.forEach(input, function (movimiento) {
                if (movimiento.concepto.nombre === 'INGRESO') {
                    salida.push(movimiento)
                }
            })
            return salida;
        }
    })
    .filter('filtroEgresos', function () {
        return function (input) {
            var salida = [];
            angular.forEach(input, function (movimiento) {
                if (movimiento.concepto.nombre === 'GASTO') {
                    salida.push(movimiento)
                }
            })
            return salida;
        }
    })
    .filter('filtroAnticipos', function () {
        return function (input) {
            var salida = [];
            angular.forEach(input, function (movimiento) {
                if (movimiento.concepto.nombre === 'ANTICIPO') {
                    salida.push(movimiento)
                }
            })
            return salida;
        }
    })
    .filter('filtroMovVenta', function () {
        return function (input) {
            var salida = [];
            angular.forEach(input, function (movimiento) {
                if (movimiento.nombre != 'SERVICIO') {
                    salida.push(movimiento)
                }
            })
            return salida;
        }
    })
    .filter('filtroMovLibroVenta', function () {
        return function (input) {
            var salida = [];
            angular.forEach(input, function (movimiento) {
                if (movimiento.nombre_corto == 'SERV' || movimiento.nombre_corto == 'FACT') {
                    salida.push(movimiento)
                }
            })
            return salida;
        }
    })
    .filter('filtroSolicitud', function () {
        return function (input) {
            var salida = [];
            angular.forEach(input, function (movimiento) {
                if (movimiento.concepto.nombre === 'ANTICIPO' || movimiento.concepto.nombre === 'GASTO' || movimiento.concepto.nombre === 'KARDEX') {
                    salida.push(movimiento)
                }
            })
            return salida;
        }
    })
    .filter('filtroKardex', function () {

        // In the return function, we must pass in a single parameter which will be the data we will work on.
        // We have the ability to support multiple other parameters that can be passed into the filter optionally
        return function (input, optional1, optional2) {
            var datos = []
            if (optional1.lote != "" && optional1.lote != undefined) {
                if (optional1.datos) {
                    optional1.datos.forEach(function (dato, index, array) {
                        if (dato.lote == optional1.lote) {
                            datos.push(dato)
                        }

                    })
                    var output = datos;
                } else {
                    var output = input
                }
            } else {
                var output = optional1.datos;
            }

            // Do filter work here

            return output;

        }

    })
    .filter('groupBy',
        function () {
            return function (collection, key) {
                if (collection === null || collection === undefined) return;
                return uniqueItems(collection, key);
            };
        })

    .filter('dateRange', function () {
        return function (items, fromDate, toDate) {
            var filtered = [];
            //here you will have your desired input
            console.log(fromDate, toDate);
            if (fromDate && toDate) {
                var from_date = Date.parse(fromDate);
                var to_date = Date.parse(toDate);
                angular.forEach(items, function (item) {
                    var date = Date.parse(fechaATexto(item.despacho.fecha));
                    if (date >= from_date && date <= to_date) {
                        filtered.push(item);
                    }
                });

                return filtered;
            } else {
                return items;
            }
        };
    })
    .filter('orderObjectBy', function () {
        return function (items, field, reverse, tipo) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function /* (a, b) { */
                (a, b) {
                if (tipo == "cliente") {
                    return (reverse) ? (a.despacho.cliente[field] > b.despacho.cliente[field]) ? 1 : (a.despacho.cliente[field] < b.despacho.cliente[field]) ? -1 : 0 : (a.despacho.cliente[field] > b.despacho.cliente[field]) ? -1 : (a.despacho.cliente[field] < b.despacho.cliente[field]) ? 1 : 0
                } else if (tipo == "vendedor") {
                    return (reverse) ? (a.despacho.usuario.persona[field] > b.despacho.usuario.persona[field]) ? 1 : (a.despacho.usuario.persona[field] < b.despacho.usuario.persona[field]) ? -1 : 0 : (a.despacho.usuario.persona[field] > b.despacho.usuario.persona[field]) ? -1 : (a.despacho.usuario.persona[field] < b.despacho.usuario.persona[field]) ? 1 : 0
                } else if (tipo == "destino") {
                    return (reverse) ? (a.despacho.destino[field] > b.despacho.destino[field]) ? 1 : (a.despacho.destino[field] < b.despacho.destino[field]) ? -1 : 0 : (a.despacho.destino[field] > b.despacho.destino[field]) ? -1 : (a.despacho.destino[field] < b.despacho.destino[field]) ? 1 : 0
                } else if (tipo == "fecha") {
                    return (reverse) ? (a.despacho[field] > b.despacho[field]) ? 1 : (a.despacho[field] < b.despacho[field]) ? -1 : 0 : (a.despacho[field] > b.despacho[field]) ? -1 : (a.despacho[field] < b.despacho[field]) ? 1 : 0
                } else if (tipo == "producto") {
                    return (reverse) ? (a.producto[field] > b.producto[field]) ? 1 : (a.producto[field] < b.producto[field]) ? -1 : 0 : (a.producto[field] > b.producto[field]) ? -1 : (a.producto[field] < b.producto[field]) ? 1 : 0
                } else {
                    return 0;
                }

                /* } */
                /*  return (a[field] > b[field] ? -1 : 1); */
            });
            /* items.sort(function (a, b) {
              return a.localeCompare(b);
            }); */
            //if(reverse) filtered.reverse();
            return filtered;
        };
    });
var uniqueItems = function (data, key) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var value = data[i][key];
        if (result.indexOf(value) == -1) {
            result.push(value);
        }
    }
    return result;
}

