angular.module('agil.filtros', [])
.filter('orderRankin', function(){
    return function (item) {

        // var filtered = [];
        angular.forEach(item, function(it) {
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
                    if (collection === null || collection===undefined) return;
                    return uniqueItems(collection, key);
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
};
