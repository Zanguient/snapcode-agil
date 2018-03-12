angular.module('agil.directivas', [])
.directive("filesInput", function() {
    return {
      require: "ngModel",
      link: function postLink(scope,elem,attrs,ngModel) {
        elem.on("change", function(e) {
          var files = elem[0].files;
          ngModel.$setViewValue(files);
        })
      }
    }
  })
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
                    <th>Resultado</th>\
                    <th ng-if="items[0].diagnosticoExamen">Estado</th></tr></thead>\
            <tbody>\
                <tr ng-repeat="examen in items">\
                    <td ng-if="examen.laboratorioExamen">{{examen.laboratorioExamen.examen}}</td>\
                    <td ng-if="examen.diagnosticoExamen">{{examen.diagnosticoExamen.examen}}</td>\
                    <td>{{examen.resultado}}</td>\
                    <td ng-if="examen.diagnosticoExamen">{{examen.estado}}</td></tr>\
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
.directive('disabledclick', function () {
  return {
    restrict: 'A',
    priority: 1,
    terminal: true, // this will prevent default ng-click behaviour
    link: function (scope, element, attr) {
      var clickAction = attr.ngClick; // get the current ngclick value
      var binding = element.bind('click',function () {
        if (attr.disabled==true) {//check if the tag is available to be clicked
          scope.$eval(clickAction) // call the event
        }
      });
      scope.$on('$destroy', function(){
        if(binding instanceof function(){}){
        binding(); // destroy the bind we created, preventing a memory leak.
      }
      })
    }
  };
})

.directive('capitalize', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      var capitalize = function(inputValue) {
        if (inputValue == undefined) inputValue = '';
        var capitalized = inputValue.toUpperCase();
        if (capitalized !== inputValue) {
          // see where the cursor is before the update so that we can set it back
          var selection = element[0].selectionStart;
          modelCtrl.$setViewValue(capitalized);
          modelCtrl.$render();
          // set back the cursor after rendering
          element[0].selectionStart = selection;
          element[0].selectionEnd = selection;
        }
        return capitalized;
      }
      modelCtrl.$parsers.push(capitalize);
      capitalize(scope[attrs.ngModel]); // capitalize initial value
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
})
.directive('fixHead', function ($compile, $window) {
  
  function compile(tElement) {
    var table = {
      clone: tElement.parent().clone().empty(),
      original: tElement.parent()
    };
    
    var header = {
      clone: tElement.clone(),
      original: tElement
    };
    
    // prevent recursive compilation
    header.clone.removeAttr('fix-head').removeAttr('ng-if');
    
    table.clone.css({display: 'block', overflow: 'hidden'}).addClass('clone');
    header.clone.css('display', 'block');
    header.original.css('visibility', 'hidden');
    
    return function postLink(scope) {
      var scrollContainer = table.original.parent();
      
      // insert the element so when it is compiled it will link
      // with the correct scope and controllers
      header.original.after(header.clone);
      
      $compile(table.clone)(scope);
      $compile(header.clone)(scope);
      
      scrollContainer.parent()[0].insertBefore(table.clone.append(header.clone)[0], scrollContainer[0]);
      
      scrollContainer.on('scroll', function () {
        // use CSS transforms to move the cloned header when the table is scrolled horizontally
        header.clone.css('transform', 'translate3d(' + -(scrollContainer.prop('scrollLeft')) + 'px, 0, 0)');
      });
      
      function cells() {
        return header.clone.find('th').length;
      }
      
      function getCells(node) {
        return Array.prototype.map.call(node.find('th'), function (cell) {
          return jQLite(cell);
        });
      }
      
      function height() {
        return header.original.prop('clientHeight');
      }
      
      function jQLite(node) {
        return angular.element(node);
      }
      
      function marginTop(height) {
        table.original.css('marginTop', '-' + height + 'px');
      }
      
      function updateCells() {
        var cells = {
          clone: getCells(header.clone),
          original: getCells(header.original)
        };
        
        cells.clone.forEach(function (clone, index) {
          if(clone.data('isClone')) {
            return;
          }
          
          // prevent duplicating watch listeners
          clone.data('isClone', true);
          
          var cell = cells.original[index];
          var style = $window.getComputedStyle(cell[0]);
          
          var getWidth = function () {
            return style.width;
          };
          
          var setWidth = function () {
            marginTop(height());
            clone.css({minWidth: style.width, maxWidth: style.width});
          };
          
          var listener = scope.$watch(getWidth, setWidth);
          
          $window.addEventListener('resize', setWidth);
          
          clone.on('$destroy', function () {
            listener();
            $window.removeEventListener('resize', setWidth);
          });
          
          cell.on('$destroy', function () {
            clone.remove();
          });
        });
      }
      
      scope.$watch(cells, updateCells);
      
      header.original.on('$destroy', function () {
        header.clone.remove();
      });
    };
  }
  
  return {
    compile: compile
  };
})

.directive('enter',function(){
  return function(scope,element,attrs){
    element.bind("keydown keypress",function(event){
      if(event.which===13){
        event.preventDefault();
        var fields=$(this).parents('form:eq(0),body').find('input, textarea, select');
        var index=fields.index(this);
        if(index> -1&&(index+1)<fields.length)
        if(fields[index+1].className!="upload"){
          fields.eq(index+1).focus().select();
        }else{
          fields.eq(index+2).focus().select();
        }
      }
    });
  };
})
.directive('ngEnter', function () {
  return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
          if(event.which === 13) {
              scope.$apply(function (){
                  scope.$eval(attrs.ngEnter);
              });

              event.preventDefault();
          }
      });
  };
})
.directive('barcodeScanner', function() {
  return {
    restrict: 'A',    
    scope: {
        callback: '=barcodeScanner',        
      },      
    link:    function postLink(scope, iElement, iAttrs){       
        // Settings
        var zeroCode = 48;
        var nineCode = 57;
        var enterCode = 13;    
        var minLength = 3;
        var delay = 200; // ms
        
        // Variables
        var pressed = false; 
        var chars = []; 
        var enterPressedLast = false;
        
        // Timing
        var startTime = undefined;
        var endTime = undefined;


        
        jQuery(document).keypress(function(e) {            
            if (chars.length === 0) {
                startTime = new Date().getTime();
            } else {
                endTime = new Date().getTime();
            }

            // Register characters and enter key
            if (e.which >= zeroCode && e.which <= nineCode) {
                chars.push(String.fromCharCode(e.which));
            }
            
            enterPressedLast = (e.which === enterCode);
            
            if (pressed == false) {
                setTimeout(function(){
                    if (chars.length >= minLength && enterPressedLast) {
                        var barcode = chars.join('');                                                
                        //console.log('barcode : ' + barcode + ', scan time (ms): ' + (endTime - startTime));
                                                
                        if (angular.isFunction(scope.callback)) {
                            scope.$apply(function() {
                                scope.callback(barcode);    
                            });
                        }
                    }
                    chars = [];
                    pressed = false;
                },delay);
            }
            pressed = true;  
        });
    }
  };
});