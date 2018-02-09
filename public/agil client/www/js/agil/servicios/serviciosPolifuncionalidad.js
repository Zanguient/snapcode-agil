angular.module('agil.servicios')

// .factory('Polifunionalidad', function ($resource) {
//     return $resource(restServer + "polifunionalidad/empresa/:id_empresa/mes/:mes/anio/:anio/suc/:sucursal/act/:actividad/ser/:servicio/monto/:monto/razon/:razon/usuario/:usuario/pagina/:pagina/items-pagina/:items_pagina/busqueda/:busqueda/num/:numero", {},
//         {
//             'update': { method: 'PUT' }
//         });
// })

// .factory('FiltroPolifuncionalidad', ['Polifunionalidad', '$q', function (Polifunionalidad, $q) {
//     var res = function (filtro) {
//         var delay = $q.defer();
//         Polifunionalidad.get({id_empresa: filtro.filter.empresa, usuario:filtro.filter.usuario, mes:filtro.filter.mes.id!==undefined?filtro.filter.mes.id:filtro.filter.mes,
//             anio:filtro.filter.anio.id!==undefined?filtro.filter.anio.id:filtro.filter.anio, sucursal:filtro.filter.sucursal.id!==undefined?filtro.filter.sucursal.id:0, actividad:filtro.filter.actividadEconomica!==undefined?filtro.filter.actividadEconomica.id!==undefined?filtro.filter.actividadEconomica.id:0:0,monto:filtro.filter.monto, razon:filtro.filter.razon,
//             servicio:filtro.filter.servicio.id!==undefined?filtro.filter.servicio.id:0, pagina:filtro.currentPage, items_pagina:filtro.itemsPerPage, busqueda:filtro.search,numero:filtro.filter.numero!==undefined?filtro.filter.numero:0}, function (entidades) {
//             delay.resolve(entidades);
//         }, function (error) {
//             delay.reject(error);
//         });
//         return delay.promise;
//     };
//     return res;
// }])