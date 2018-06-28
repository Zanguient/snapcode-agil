var mainUrl="http://127.0.0.1:8083/";
var restServer=mainUrl+"agil/";
angular.module('agil.servicios', ['ngResource'])

.factory('socket', function (socketFactory) {
  return socketFactory();
});