(function(){
    
    function actionListDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-actionlist.html",
            scope: {
                show:"<",
                currentArticle: "<",
                view:"@",
                index:"@"
            },
            controller:"actionListController",
            controllerAs: "actionlist",
            bindToController: true,
        };
        return ddo;
    }
    
    
    actionListController.$inject = ['localStorageHandling','$scope'];
    function actionListController(localStorageHandling,$scope){
        var action = this;
        action.$onInit = function(){
            //callback function for archive button 
            action.archive = function(){
                localStorageHandling.archive(action.index,action.view,action.currentArticle);
                //emit message to view list controller 
                $scope.$emit("archive",{});
            };
            action.addBacktoList = function(){
                localStorageHandling.backToList(action.index,action.view,action.currentArticle);
                 //emit message to view list controller 
                $scope.$emit("backtolist",{});               
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