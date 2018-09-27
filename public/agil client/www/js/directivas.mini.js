angular.module("agil.directivas",[]).directive("filesInput",function(){return{require:"ngModel",link:function(e,n,t,i){n.on("change",function(e){var t=n[0].files;i.$setViewValue(t)})}}}).directive("custPopover",function(e){return{scope:{items:"=newvar"},restrict:"A",template:'<i class="ace-icon fa fa-search-plus bigger-130"></i>',link:function(n,t,i){n.label=i.popoverLabel;var o=e(' <table id="dynamic-table" class="table table-striped table-bordered table-hover nowrap dataTable no-footer">            <thead>                <tr>                    <th>Examenes</th>                    <th>Resultado</th>                    <th ng-if="items[0].diagnosticoExamen">Estado</th></tr></thead>            <tbody>                <tr ng-repeat="examen in items">                    <td ng-if="examen.laboratorioExamen">{{examen.laboratorioExamen.examen}}</td>                    <td ng-if="examen.diagnosticoExamen">{{examen.diagnosticoExamen.examen}}</td>                    <td>{{examen.resultado}}</td>                    <td ng-if="examen.diagnosticoExamen">{{examen.estado}}</td></tr>            </tbody>        </table>')(n);console.log(n),$(t).popover({trigger:"click",html:!0,content:o,placement:i.popoverPlacement})}}}).directive("ngUpdateHidden",function(e){return{restrict:"AE",scope:{},replace:!0,require:"ngModel",link:function(n,t,i,o){n.$watch(o,function(e){void 0!=e&&t.val(e)}),$(t).change(function(){e(function(){n.$apply(function(){o.$setViewValue(t.val())})})})}}}).directive("capitalize",function(){return{require:"ngModel",link:function(e,n,t,i){var o=function(e){void 0==e&&(e="");var t=e.toUpperCase();if(t!==e){var o=n[0].selectionStart;i.$setViewValue(t),i.$render(),n[0].selectionStart=o,n[0].selectionEnd=o}return t};i.$parsers.push(o),o(e[t.ngModel])}}}).directive("customOnFileChange",function(){return{restrict:"A",link:function(e,n,t){var i=e.$eval(t.customOnFileChange);n.bind("change",i)}}}).directive("preventEnterFireing",function(){return{link:function(e,n,t){n.keypress(function(e){13!=e.keyCode||e.preventDefault()})}}}).directive("eDisabled",function(){return{compile:function(e,n,t){return n.ngClick="!("+n.eDisabled+") && ("+n.ngClick+")",function(e,n,t){e.$watch(t.eDisabled,function(e){void 0!==e&&n.toggleClass("disabled",e)}),$(n).click(function(n){e.$eval(t.eDisabled)&&n.preventDefault()})}}}}).directive("fixHead",function(e,n){return{compile:function(t){var i={clone:t.parent().clone().empty(),original:t.parent()},o={clone:t.clone(),original:t};return o.clone.removeAttr("fix-head").removeAttr("ng-if"),i.clone.css({display:"block",overflow:"hidden"}).addClass("clone"),o.clone.css("display","block"),o.original.css("visibility","hidden"),function(t){var r=i.original.parent();function a(e){return Array.prototype.map.call(e.find("th"),function(e){return n=e,angular.element(n);var n})}o.original.after(o.clone),e(i.clone)(t),e(o.clone)(t),r.parent()[0].insertBefore(i.clone.append(o.clone)[0],r[0]),r.on("scroll",function(){o.clone.css("transform","translate3d("+-r.prop("scrollLeft")+"px, 0, 0)")}),t.$watch(function(){return o.clone.find("th").length},function(){var e={clone:a(o.clone),original:a(o.original)};e.clone.forEach(function(r,a){if(!r.data("isClone")){r.data("isClone",!0);var c=e.original[a],l=n.getComputedStyle(c[0]),s=function(){var e;e=o.original.prop("clientHeight"),i.original.css("marginTop","-"+e+"px"),r.css({minWidth:l.width,maxWidth:l.width})},u=t.$watch(function(){return l.width},s);n.addEventListener("resize",s),r.on("$destroy",function(){u(),n.removeEventListener("resize",s)}),c.on("$destroy",function(){r.remove()})}})}),o.original.on("$destroy",function(){o.clone.remove()})}}}}).directive("enter",function(){return function(e,n,t){n.bind("keydown keypress",function(e){if(13===e.which){e.preventDefault();var n=$(this).parents("form:eq(0),body").find("input, textarea, select"),t=n.index(this);t>-1&&t+1<n.length&&("upload"!=n[t+1].className?n.eq(t+1).focus().select():n.eq(t+2).focus().select())}})}}).directive("ngEnter",function(){return function(e,n,t){n.bind("keydown keypress",function(n){13===n.which&&(e.$apply(function(){e.$eval(t.ngEnter)}),n.preventDefault())})}}).directive("barcodeScanner",function(){return{restrict:"A",scope:{callback:"=barcodeScanner"},link:function(e,n,t){var i=!1,o=[],r=!1;jQuery(document).keypress(function(n){0===o.length?(new Date).getTime():(new Date).getTime(),n.which>=48&&n.which<=57&&o.push(String.fromCharCode(n.which)),r=13===n.which,0==i&&setTimeout(function(){if(o.length>=3&&r){var n=o.join("");angular.isFunction(e.callback)&&e.$apply(function(){e.callback(n)})}o=[],i=!1},200),i=!0})}}});