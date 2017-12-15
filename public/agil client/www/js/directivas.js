angular.module('agil.directivas', [])

.directive('ngUpdateHidden', function ($timeout) {
    return {
        restrict: 'AE', //attribute or element
        scope: {},
        replace: true,
        require: 'ngModel',
        link: function ($scope, elem, attr, ngModel) {
            $scope.$watch(ngModel, function (nv) {
                if(nv!=undefined)
				{	
					elem.val(nv);
				}
            });
            $(elem).change(function () { //bind the change event to hidden input with jquery
				$timeout(function() {
				  $scope.$apply(function () {
                    ngModel.$setViewValue(elem.val());
				  });
				})
            });
        }
    };
})

.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if(inputValue == undefined) inputValue = '';
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
})

.directive('customOnFileChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnFileChange);
      element.bind('change', onChangeHandler);
    }
  };
})

.directive('preventEnterFireing', function() {
  return {
		link: function(scope, element, attrs) {
			element.keypress(function(e) {
				if (e.keyCode == 13) {
					e.preventDefault();
					return;
				}
			});
		}
	};
})

.directive('eDisabled', function() {
    return {
        compile: function(tElement, tAttrs, transclude) {
            //Disable ngClick
            tAttrs["ngClick"] = "!("+tAttrs["eDisabled"]+") && ("+tAttrs["ngClick"]+")";

            //Toggle "disabled" to class when aDisabled becomes true
            return function (scope, iElement, iAttrs) {
                scope.$watch(iAttrs["eDisabled"], function(newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });

                //Disable href on click
                $(iElement).click( function(e) {
                    if (scope.$eval(iAttrs["eDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
});