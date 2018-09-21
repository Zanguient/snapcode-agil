angular.module('agil.servicios')

.factory('CodigoControl',  ['$resource',function ($resource) {
		return $resource(restServer+"pruebas-codigo-control");
}]);