(function() {
    
    function articleItemListDirective() {
        var ddo = {
            templateUrl: "view/component-template/component-articleitemlist.html",
            scope:{
                myArticle:"=",
                view:"@",
                index: "@",
                isBulkEdit: "=",
                addToBulkEditList: "&"
            },
            controller:"articleItemListController",
            controllerAs: "articleitemlist",
            bindToController: true,
            link: function(scope,element,attrs){
                element.on("click",function(){
                    if (scope.articleitemlist.isBulkEdit) { //toggleclass only when bulkedit panel is on
                       element.find(".item-content-list").toggleClass("bulk-edit"); 
                    }
                });
                scope.$watch("articleitemlist.isBulkEdit",function(newvalue,oldvalue){//watch the property of isBlukedit on or off
                    if (newvalue === oldvalue) { return;}
                    if (!newvalue) { //if bulkedit panel is turned off, remove the highlight bg color for each object
                        element.find(".item-content-list").removeClass("bulk-edit");
                    }
                });
            }            
        };
        return ddo;
    };
    
    articleItemListController.$inject = ['localStorageHandling','$scope'];
    
    function articleItemListController(localStorageHandling,$scope) {
        var articleitemlist = this;
        
        articleitemlist.showactionlist = false; //the property to control the show/hide of actionlist 
        
        articleitemlist.deletedialogShown = false; // the initial status of delete dialog
        
        articleitemlist.tagdialogShown = false; //the initial status of tag dialog
        
        articleitemlist.$onInit = function(){
            console.log("debugging...");
            
            articleitemlist.showActionList = function(){ //show the actionlist
                articleitemlist.showactionlist = true;
            };
            articleitemlist.hideActionList = function(){ //hide the actionlist
                articleitemlist.showactionlist = false;
            };
            articleitemlist.click = function(){
                if (articleitemlist.isBulkEdit){
                    articleitemlist.addToBulkEditList({article:articleitemlist.myArticle, index:articleitemlist.index, view:articleitemlist.view});
                }
                
            };
            //call back function of open delete dialog for ng-click event on the delete button in the actionlist
            articleitemlist.openDeleteDialog = function(){
                articleitemlist.deletedialogShown = true; 
            };
            //call back function of close delete dialog for ng-click event on the cancel button in the delete dialog
            articleitemlist.closeDeleteDialog = function(){
                articleitemlist.deletedialogShown = !articleitemlist.deletedialogShown;
            };
            //call back funtion of delete button on the delete dialog
            articleitemlist.deleteArticle = function(){
                localStorageHandling.deleteArticle(articleitemlist.index,articleitemlist.view,articleitemlist.myArticle);
                articleitemlist.deletedialogShown = !articleitemlist.deletedialogShown;
                //emit the delete event message to upper level
                $scope.$emit("delete",{});
            };            
            //call back function of open tag dialog for ng-click event on the tag button in the actionlist
            articleitemlist.openTagDialog = function(){
                articleitemlist.tagdialogShown = true; 
                
            };            
            //add new tag to the article
            articleitemlist.addNewTag = function(){
                localStorageHandling.addTag(articleitemlist.index,articleitemlist.view,articleitemlist.myArticle,articleitemlist.taginput);
                articleitemlist.tagdialogShown = false; 
                articleitemlist.taginput = "";
                //emit the delete event message to upper level
                $scope.$emit("addtag",{});
            };
            //remove tag from the article
            articleitemlist.removeTag = function(tagindex){
                localStorageHandling.removeTag(articleitemlist.index,articleitemlist.view,articleitemlist.myArticle,tagindex);
                $scope.$emit("removetag",{});
            };
        };        
    };
    
    angular
        .module("app")
        .directive("articleItemList",articleItemListDirective)
        .controller("articleItemListController",articleItemListController);
    
})();