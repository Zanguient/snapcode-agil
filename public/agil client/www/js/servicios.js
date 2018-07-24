var mainUrl="http://agislof.net/";
var restServer=mainUrl+"agil/";
angular.module('agil.servicios', ['ngResource'])

.factory('socket', function (socketFactory) {
  return socketFactory();
});