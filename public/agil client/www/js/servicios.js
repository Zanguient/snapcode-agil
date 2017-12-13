var mainUrl="http://192.168.100.45:8083/";
var restServer=mainUrl+"agil/";
angular.module('agil.servicios', ['ngResource'])

.factory('socket', function (socketFactory) {
  return socketFactory();
});