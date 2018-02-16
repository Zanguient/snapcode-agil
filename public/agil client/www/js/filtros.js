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