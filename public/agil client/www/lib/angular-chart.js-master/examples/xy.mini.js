angular.module("app",["chart.js"]).controller("LineCtrl",["$scope",function(e){"use strict";e.series=["Series A","Series B"],e.data=[[{x:0,y:10},{x:0,y:1},{x:1,y:6},{x:4,y:2}],[{x:0,y:2},{x:5,y:7},{x:4,y:2},{x:2,y:9}]],e.options={scales:{xAxes:[{type:"linear",position:"bottom"}]}}}]);