angular.module("agil.servicios").factory("Dosificacion",["$resource",function(i){return i(restServer+"dosificaciones/:idDosificacion",{idDosificacion:"@id"},{update:{method:"PUT"}})}]).factory("DosificacionesEmpresa",["$resource",function(i){return i(restServer+"dosificaciones/empresa/:idEmpresa")}]).factory("Dosificaciones",["DosificacionesEmpresa","$q",function(i,e){return function(r){var o=e.defer();return i.query({idEmpresa:r},function(i){o.resolve(i)},function(i){o.reject(i)}),o.promise}}]).factory("DosificacionesDisponiblesEmpresa",["$resource",function(i){return i(restServer+"dosificaciones-disponibles/empresa/:idEmpresa")}]).factory("DosificacionesDisponibles",["DosificacionesDisponiblesEmpresa","$q",function(i,e){return function(r){var o=e.defer();return i.query({idEmpresa:r},function(i){o.resolve(i)},function(i){o.reject(i)}),o.promise}}]).factory("VerificarDosificacionesExpiradas",["$resource",function(i){return i(restServer+"actualizacion-dosificaciones-expiradas/:id_empresa")}]).factory("VencimientoDosificaciones",["VerificarDosificacionesExpiradas","$q",function(i,e){return function(r){var o=e.defer();return i.get({id_empresa:r},function(i){o.resolve(i)},function(i){o.reject(i)}),o.promise}}]);