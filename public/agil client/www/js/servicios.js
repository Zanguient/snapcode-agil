var mainUrl="http://138.197.35.199:8083/"
var restServer=mainUrl+"agil/";
angular.module('agil.servicios', ['ngResource'])

.factory('socket', function (socketFactory) {
  return socketFactory();
});