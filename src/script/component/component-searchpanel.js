(function(){
    
    function searchpaneldirective(){
        var ddo = {
            templateUrl: "view/component-template/component-searchpanel.html",
            scope: {
                closeSearchPanel: "&",
            },
            controller: "searchpanelcontroller",
            controllerAs: "search",
            bindToController: true,
        };
        return ddo;
    };
    
    searchpanelcontroller.$inject = ['searchhandling','$rootScope','changeListStyle','$scope'];
    
    function searchpanelcontroller(searchhandling,$rootScope,changeListStyle,$scope){
        var search = this; 
        search.currentView = 'My List'; // set the initial value for property currentView to mylist
        search.viewName = 'mylist';
        search.filterFavoriteOn = false; // set the initial value for the property of filterFavoriteon
        search.isTileStyle = changeListStyle.getCurrentStyle(); // the initial value for this property
        search.articlelist = [];
        search.$onInit = function(){
            search.searchResult = function(){
                search.articlelist = searchhandling.searchArticle(search.currentView,search.filterFavoriteOn,search.searchkeyword);
            };
            search.updateSearch = function(){
                search.articlelist = searchhandling.searchArticle(search.currentView,search.filterFavoriteOn,search.searchkeyword);
            };
            search.removeFavoriteFilter = function(){
                search.filterFavoriteOn = false; 
                search.updateSearch();
            };
            search.closeClick = function(){
                search.closeSearchPanel();
                search.searchkeyword = "";
                search.articlelist.length = 0;
                $rootScope.$broadcast("closesearchpanelandupdate",{});
            };
            search.getIndexInOriginalList = function(article){
                return searchhandling.getOriginalIndex(search.viewName,article);
            };
        };
        //listen to the router event to get current viewname 
        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
            var result = searchhandling.filterViewName(toState.name);
            search.currentView = result[0];
            search.viewName = result[1];
            search.filterFavoriteOn = result[2];
            
        });
        //listen to event of changeliststyle 
        $rootScope.$on('changeliststyle',function(event,data){
            search.isTileStyle = data.currentStatus;
        });
        //listen to the backtolist event message to update the archive view
        $scope.$on('backtolist',function(event,data){
            search.updateSearch(); //update the articlelist
        });
        //listen to the archive event message to update the list view
        $scope.$on('archive',function(event,data){
            search.updateSearch(); //update the articlelist; 
        });    
        //listen to the togglefavorite event message to update the list view
        $scope.$on('togglefavorite',function(event,data){
            search.updateSearch(); //update the articlelist; 
        });         
    };
    
    angular
        .module("app")
        .directive("searchPanel",searchpaneldirective)
        .controller("searchpanelcontroller",searchpanelcontroller);
})();