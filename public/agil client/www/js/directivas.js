angular.module('agil.directivas', [])
.directive('custPopover', function ($compile) {
    return {
        scope : {
            items : '=newvar'  
        }, 
        restrict: 'A',
        
        template: '<i class="ace-icon fa fa-search-plus bigger-130"></i>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            var temp = ' <table id="dynamic-table" class="table table-striped table-bordered table-hover nowrap dataTable no-footer">\
            <thead>\
                <tr>\
                    <th>Examenes</th>\
                    <th>Resultado</th></tr></thead>\
            <tbody>\
                <tr ng-repeat="examen in items">\
                    <td>{{examen.laboratorioExamen.examen}}</td>\
                    <td>{{examen.resultado}}</td></tr>\
            </tbody>\
        </table>';
            var contents = $compile(temp)(scope);
            console.log(scope);
            $(el).popover({
                trigger: 'click',
                html: true,
                content:  contents,
                placement: attrs.popoverPlacement
            });
        }
    };
})
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