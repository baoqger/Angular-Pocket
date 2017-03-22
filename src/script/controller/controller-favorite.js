(function(){
    favoriteCtrl.$inject = ['currentfavorite','$scope','localStorageHandling'];
    function favoriteCtrl(currentfavorite,$scope,localStorageHandling){
        var favorite = this;
        
        favorite.articlelist = currentfavorite; //get resolved currentlist
        
        //listen to the togglefavorite event message to update the favorite view
        $scope.$on('togglefavorite',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the archivelist
        });          

        $scope.$on('archive',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the archivelist
        });
        
        $scope.$on('backtolist',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the archivelist
        }); 
    };
    angular
        .module("app")
        .controller("favoriteCtrl",favoriteCtrl);
})();