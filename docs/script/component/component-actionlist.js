(function(){
    
    function actionListDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-actionlist.html",
            scope: {
                show:"<",
                currentArticle: "<",
                view:"@",
                index:"@",
                showDeleteDialog: "&",
                showTagDialog:"&"
            },
            controller:"actionListController",
            controllerAs: "actionlist",
            bindToController: true,
        };
        return ddo;
    }
    
    
    actionListController.$inject = ['localStorageHandling','$scope','$rootScope'];
    function actionListController(localStorageHandling,$scope,$rootScope){
        var action = this;
        action.$onInit = function(){
            //callback function for archive button 
            action.archive = function(){
                localStorageHandling.archive(action.index,action.view,action.currentArticle);
                //emit message to view list controller 
                $scope.$emit("archive",{});
                //broadcase message to toast directive 
                $rootScope.$broadcast("toastmessage",{message:"Item archived"});
            };
            action.addBacktoList = function(){
                localStorageHandling.backToList(action.index,action.view,action.currentArticle);
                 //emit message to view list controller 
                $scope.$emit("backtolist",{});
                //broadcase message to toast directive 
                $rootScope.$broadcast("toastmessage",{message:"Added to List"});                
            };
            action.toggleFavorite = function(){
                console.log(action.index)
                localStorageHandling.toggleFavorite(action.index,action.view,action.currentArticle);
                $scope.$emit("togglefavorite",{});
            }
        };
    }
    
    angular
        .module("app")
        .directive("actionList",actionListDirective)
        .controller("actionListController",actionListController);
})();