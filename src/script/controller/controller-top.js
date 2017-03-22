(function(){
    
    topCtrl.$inject = ['$scope'];
    
    function topCtrl($scope){
        var top = this;
        top.dialogShown = false;
        top.toggleDialog = function(){
            top.dialogShown = !top.dialogShown;
        };
        top.addNewURL = function(){
            top.dialogShown = !top.dialogShown;
            //broadcase the addNewURL event to the sublevel main controller
            $scope.$broadcast('addNewURL',{
                url:top.newURL
            })
            top.newURL = "";
        };
    }
    
    angular
        .module("app")
        .controller("topCtrl",topCtrl);
})();