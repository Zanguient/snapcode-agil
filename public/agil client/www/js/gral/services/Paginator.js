// angular.module('school.services')
angular.module('agil.servicios')
 .factory('Paginator', [function() 
  {
	var res = function() {
		var paginator={
			column:"",
			direction:"asc",
			currentPage:1,
			itemsPerPage:10,
			search:0,
			filter:null,
			pages:[],
			selectedItems:[],
			allItemsSelected:false,
			callBack:null,
			setPages:function(numberOfPages){
				this.pages=[];
				for(var i=1;i<=numberOfPages;i++){
					this.pages.push(i);
				}
			},
			getSearch:function(search,filter,event){
				this.selectedItems=[];
				this.allItemsSelected=false;
				if(event==null || event==undefined || event.keyCode===13){ //enter pressed
					//search processing
					if(search=="" || search==null){
						this.search=0;
					}else{
						this.search=search;
					}
					//filter processing
					if(filter!=null){
						this.filter=JSON.parse(JSON.stringify(filter));
						var keys=Object.keys(this.filter);
						for (var index = 0; index < keys.length; index++) {
							var key = keys[index];
							if(this.filter[key] == null || this.filter[key] == undefined || this.filter[key] == ""){
								this.filter[key]=0;
							}else if(this.filter[key]==true){
								this.filter[key]=1;
							}
						}
					}
					this.getFirstPage();
				}
			},
			getFirstPage:function(){
				this.selectedItems=[];
				this.allItemsSelected=false;
				this.currentPage=1;
				this.callBack();
			},
			getPreviousPage:function(){
				this.selectedItems=[];
				this.allItemsSelected=false;
				this.currentPage=this.currentPage-1;
				this.callBack();
			},
			getPage:function(page){
				this.selectedItems=[];
				this.allItemsSelected=false;
				this.currentPage=page;
				this.callBack();
			},
			getNextPage:function(){
				this.selectedItems=[];
				this.allItemsSelected=false;
				this.currentPage=this.currentPage+1;
				this.callBack();
			},
			getLastPage:function(){
				this.selectedItems=[];
				this.allItemsSelected=false;
				this.currentPage=this.pages.length;
				this.callBack();
			},
			sortColumn : function (column) {
				this.selectedItems=[];
				this.allItemsSelected=false;
				var columnIdentifier=column.replace(".", "\\.");
				var element=$("#" + columnIdentifier);
				if (this.column == column) {
					element.removeClass("fa-sort");
					if (this.direction == "asc") {
						this.direction = "desc";
						element.removeClass("fa-caret-up");
						element.addClass("fa-caret-down");
					} else {
						this.direction = "asc";
						element.removeClass("fa-caret-down");
						element.addClass("fa-caret-up");
					}
				} else {
					this.direction = "asc";
					$(".sort").removeClass("fa-caret-up");
					$(".sort").removeClass("fa-caret-down");
					$(".sort").addClass("fa-sort");
					element.addClass("fa-caret-up");
					element.removeClass("fa-sort");
				}
				this.column = column;
				this.callBack();
			},
			addItemToSelected:function(item){
				if(item.selected){
					this.selectedItems.push(item);
				}else{
					this.selectedItems.splice(selectedItems.indexOf(item), 1);
				}
			},
			checkItem:function(item){
				var found=false,i=0;
				while(!found && i<this.selectedItems.length){
					if(this.selectedItems[i].id==item.id){
						found=true;
					}
					i++;
				}
				return found;
			},
			selectAllItems:function(items){
				this.selectedItems=[];
				if(this.allItemsSelected){
					for(var i=0;i<items.length;i++){
						items[i].selected=true;
						this.selectedItems.push(items[i]);
					}
				}
			}
		}
		return paginator;
	};
    return res;
  }]);