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
    .filter('orderObjectBy', function() {
        return function(items, field,reverse,tipo) {
          var filtered = [];
          angular.forEach(items, function(item) {
            filtered.push(item);
          });
          filtered.sort(function /* (a, b) { */
            (a, b) {
                if(tipo=="cliente"){
                    return (reverse)?(a.despacho.cliente[field] > b.despacho.cliente[field])? 1:(a.despacho.cliente[field] < b.despacho.cliente[field])?-1 :0:(a.despacho.cliente[field] > b.despacho.cliente[field])? -1:(a.despacho.cliente[field] < b.despacho.cliente[field])?1 :0
                }else if(tipo=="vendedor"){
                    return (reverse)?(a.despacho.usuario.persona[field] > b.despacho.usuario.persona[field])? 1:(a.despacho.usuario.persona[field] < b.despacho.usuario.persona[field])?-1 :0:(a.despacho.usuario.persona[field] > b.despacho.usuario.persona[field])? -1:(a.despacho.usuario.persona[field] < b.despacho.usuario.persona[field])?1 :0
                }else if(tipo=="destino"){
                    return (reverse)?(a.despacho.destino[field] > b.despacho.destino[field])? 1:(a.despacho.destino[field] < b.despacho.destino[field])?-1 :0:(a.despacho.destino[field] > b.despacho.destino[field])? -1:(a.despacho.destino[field] < b.despacho.destino[field])?1 :0
                }else if(tipo=="fecha"){
                    return (reverse)?(a.despacho[field] > b.despacho[field])? 1:(a.despacho[field] < b.despacho[field])?-1 :0:(a.despacho[field] > b.despacho[field])? -1:(a.despacho[field] < b.despacho[field])?1 :0
                }else if(tipo=="producto"){
                    return (reverse)?(a.producto[field] > b.producto[field])? 1:(a.producto[field] < b.producto[field])?-1 :0:(a.producto[field] > b.producto[field])? -1:(a.producto[field] < b.producto[field])?1 :0
                }else{
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

  