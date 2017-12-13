angular.module('agil.servicios')

.factory('CodigoControl', function($resource) {
		return $resource(restServer+"pruebas-codigo-control");
});