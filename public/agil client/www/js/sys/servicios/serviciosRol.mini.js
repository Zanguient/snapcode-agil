angular.module("agil.servicios").factory("Rol",["$resource",function(r){return r(restServer+"roles")}]).factory("Roles",["Rol","$q",function(r,e){return function(){var o=e.defer();return r.query(function(r){o.resolve(r)},function(r){o.reject(r)}),o.promise}}]);