(function(){
    listCtrl.$inject = ['$scope','webScraper','currentlist','localStorageHandling']
    
    function listCtrl($scope,webScraper,currentlist,localStorageHandling){
        
        var list = this;
        
        list.articlelist = currentlist; //get resolved currentlist
        
        //listen to the addNewURL event
        $scope.$on('addNewURL',function(event,data){
           //webScraper.addNewArticle(data.url);
           webScraper.addNewArticle(data.url).then(function(){
               list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
           });
        });
        //listen to the archive event message to update the list view
        $scope.$on('archive',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });
        //listen to the togglefavorite event message to update the list view
        $scope.$on('togglefavorite',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });        
        
    };
        
    angular
        .module("app")
        .controller("listCtrl",listCtrl);
})();