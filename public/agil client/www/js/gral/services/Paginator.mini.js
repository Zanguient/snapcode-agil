angular.module("agil.servicios").factory("Paginator",[function(){return function(){return{column:"",direction:"asc",currentPage:1,itemsPerPage:10,search:0,filter:null,pages:[],selectedItems:[],allItemsSelected:!1,callBack:null,setPages:function(e){this.pages=[];for(var t=1;t<=e;t++)this.pages.push(t)},getSearch:function(e,t,s){if(this.selectedItems=[],this.allItemsSelected=!1,null==s||void 0==s||13===s.keyCode){if(this.search=""==e||null==e?0:e,null!=t){this.filter=JSON.parse(JSON.stringify(t));for(var l=Object.keys(this.filter),i=0;i<l.length;i++){var a=l[i];null==this.filter[a]||void 0==this.filter[a]||""==this.filter[a]?this.filter[a]=0:1==this.filter[a]&&(this.filter[a]=1)}}this.getFirstPage()}},getFirstPage:function(){this.selectedItems=[],this.allItemsSelected=!1,this.currentPage=1,this.callBack()},getPreviousPage:function(){this.selectedItems=[],this.allItemsSelected=!1,this.currentPage=this.currentPage-1,this.callBack()},getPage:function(e){this.selectedItems=[],this.allItemsSelected=!1,this.currentPage=e,this.callBack()},getNextPage:function(){this.selectedItems=[],this.allItemsSelected=!1,this.currentPage=this.currentPage+1,this.callBack()},getLastPage:function(){this.selectedItems=[],this.allItemsSelected=!1,this.currentPage=this.pages.length,this.callBack()},sortColumn:function(e){this.selectedItems=[],this.allItemsSelected=!1;var t=e.replace(".","\\."),s=$("#"+t);this.column==e?(s.removeClass("fa-sort"),"asc"==this.direction?(this.direction="desc",s.removeClass("fa-caret-up"),s.addClass("fa-caret-down")):(this.direction="asc",s.removeClass("fa-caret-down"),s.addClass("fa-caret-up"))):(this.direction="asc",$(".sort").removeClass("fa-caret-up"),$(".sort").removeClass("fa-caret-down"),$(".sort").addClass("fa-sort"),s.addClass("fa-caret-up"),s.removeClass("fa-sort")),this.column=e,this.callBack()},addItemToSelected:function(e){e.selected?this.selectedItems.push(e):this.selectedItems.splice(selectedItems.indexOf(e),1)},checkItem:function(e){for(var t=!1,s=0;!t&&s<this.selectedItems.length;)this.selectedItems[s].id==e.id&&(t=!0),s++;return t},selectAllItems:function(e){if(this.selectedItems=[],this.allItemsSelected)for(var t=0;t<e.length;t++)e[t].selected=!0,this.selectedItems.push(e[t])}}}}]);