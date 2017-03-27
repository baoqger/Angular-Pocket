(function(){
    
    topCtrl.$inject = ['$scope','$rootScope'];
    
    function topCtrl($scope,$rootScope){
        var top = this;
        top.dialogShown = false; //inital status of the newURL dialog
        top.searchShown = false; //inital status of the search panel
        
        //the callback function on clicking on the add icon on the header component
        top.toggleDialog = function(){
            top.dialogShown = !top.dialogShown;
        };
        //call back function by clicking the save button on the dialog
        top.addNewURL = function(){
            top.dialogShown = !top.dialogShown;
            //broadcase the addNewURL event to the sublevel main controller
            $rootScope.$broadcast('addNewURL',{
                url:top.newURL
            });         
            top.newURL = "";
        };
        //the callback function on clicking on the search icon on the header component
        top.openSearchPanel = function(){
            top.searchShown = true;
        };
        //the callback function on clicking on the close button on the search panel
        top.closeSearchPanel = function(){
            top.searchShown = false;
        };
    }
    
    angular
        .module("app")
        .controller("topCtrl",topCtrl);
})();