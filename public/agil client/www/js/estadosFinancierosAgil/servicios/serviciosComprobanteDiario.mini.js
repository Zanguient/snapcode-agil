angular.module("agil.servicios").factory("TodoComprobanteContabilidad",function(o){return o(restServer+"comprobante-contabilidad/empresa/:empresa/inicio/:inicio/fin/:fin",{update:{method:"PUT"}})}).factory("TodosComprobante",["TodoComprobanteContabilidad","$q",function(o,e){return function(i,n,r){var t=e.defer();return o.get({empresa:i,inicio:n,fin:r},function(o){t.resolve(o)},function(o){t.reject(o)}),t.promise}}]);