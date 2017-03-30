(function(){
    
    function articleItemDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-articleitem.html",
            scope:{
                myArticle:"=",
                view:"@",
                index: "@",
                isBulkEdit: "=",
                addToBulkEditList: "&",
            },
            controller:"articleItemController",
            controllerAs: "articleitem",
            bindToController: true,
            link: function(scope,element,attrs){
                element.on("click",function(){
                    if (scope.articleitem.isBulkEdit) { //toggleclass only when bulkedit panel is on
                       element.toggleClass("bulk-edit"); 
                    }
                });
                scope.$watch("articleitem.isBulkEdit",function(newvalue,oldvalue){//watch the property of isBlukedit on or off
                    if (newvalue === oldvalue) { return;}
                    if (!newvalue) { //if bulkedit panel is turned off, remove the highlight bg color for each object
                        element.removeClass("bulk-edit");
                    }
                });
            }
            
        };
        return ddo;
    } 
    
    articleItemController.$inject = ['localStorageHandling','$scope','$rootScope','$state'];
    
    function articleItemController(localStorageHandling,$scope,$rootScope,$state){
        var articleitem = this;
        
        articleitem.showactionlist = false; //the property to control the show/hide of actionlist 
        
        articleitem.deletedialogShown = false; // the initial status of delete dialog
        
        articleitem.tagdialogShown = false; //the initial status of tag dialog
        
        articleitem.$onInit = function(){
            
            articleitem.showActionList = function(){ //show the actionlist
                articleitem.showactionlist = true;
            };
            articleitem.hideActionList = function(){ //hide the actionlist
                articleitem.showactionlist = false;
            };
            articleitem.click = function(){
                if (articleitem.isBulkEdit){ //in bulkedit mode
                    articleitem.addToBulkEditList({article:articleitem.myArticle, index:articleitem.index, view:articleitem.view});
                } else { //not in bulkedit mode, go to read state with specific params
                    $state.go('read',{id:articleitem.index,view:articleitem.view,article:articleitem.myArticle});
                }
                
            };
            //call back function of open delete dialog for ng-click event on the delete button in the actionlist
            articleitem.openDeleteDialog = function(){
                articleitem.deletedialogShown = true;
                
            };
            //call back function of close delete dialog for ng-click event on the cancel button in the delete dialog
            articleitem.closeDeleteDialog = function(){
                articleitem.deletedialogShown = !articleitem.deletedialogShown;
            };
            //call back funtion of delete button on the delete dialog
            articleitem.deleteArticle = function(){
                localStorageHandling.deleteArticle(articleitem.index,articleitem.view,articleitem.myArticle);
                articleitem.deletedialogShown = !articleitem.deletedialogShown;
                //emit the delete event message to upper level
                $scope.$emit("delete",{});
                //broadcase the toastmessage
                $rootScope.$broadcast("toastmessage",{message:"Item deleted"});                
            };
            //call back function of open tag dialog for ng-click event on the tag button in the actionlist
            articleitem.openTagDialog = function(){
                articleitem.tagdialogShown = true; 
                
            };            
            //add new tag to the article
            articleitem.addNewTag = function(){
                localStorageHandling.addTag(articleitem.index,articleitem.view,articleitem.myArticle,articleitem.taginput);
                articleitem.tagdialogShown = false; 
                articleitem.taginput = "";
                //emit the delete event message to upper level
                $scope.$emit("addtag",{});
            };
            //remove tag from the article
            articleitem.removeTag = function(tagindex){
                localStorageHandling.removeTag(articleitem.index,articleitem.view,articleitem.myArticle,tagindex);
                $scope.$emit("removetag",{});
            };

        };
    };
    angular
        .module("app")
        .directive("articleItem",articleItemDirective)
        .controller("articleItemController",articleItemController);
})();