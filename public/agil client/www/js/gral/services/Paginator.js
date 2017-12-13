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
			callBack:null,
			setPages:function(numberOfPages){
				this.pages=[];
				for(var i=1;i<=numberOfPages;i++){
					this.pages.push(i);
				}
			},
			getSearch:function(search,filter,event){
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
							}
						}
					}
					this.getFirstPage();
				}
			},
			getFirstPage:function(){
				this.currentPage=1;
				this.callBack();
			},
			getPreviousPage:function(){
				this.currentPage=this.currentPage-1;
				this.callBack();
			},
			getPage:function(page){
				this.currentPage=page;
				this.callBack();
			},
			getNextPage:function(){
				this.currentPage=this.currentPage+1;
				this.callBack();
			},
			getLastPage:function(){
				this.currentPage=this.pages.length;
				this.callBack();
			},
			sortColumn : function (column) {
				if (this.column == column) {
					$("#" + column).removeClass("fa-sort");
					if (this.direction == "asc") {
						this.direction = "desc";
						$("#" + column).removeClass("fa-caret-up");
						$("#" + column).addClass("fa-caret-down");
					} else {
						this.direction = "asc";
						$("#" + column).removeClass("fa-caret-down");
						$("#" + column).addClass("fa-caret-up");
					}
				} else {
					this.direction = "asc";
					$(".sort").removeClass("fa-caret-up");
					$(".sort").removeClass("fa-caret-down");
					$(".sort").addClass("fa-sort");
					$("#" + column).addClass("fa-caret-up");
					$("#" + column).removeClass("fa-sort");
				}
				this.column = column;
				this.callBack();
			}
		}
		return paginator;
	};
    return res;
  }]);