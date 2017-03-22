(function(){
    archiveCtrl.$inject = ['currentarchive','$scope','localStorageHandling'];
    
    function archiveCtrl(currentarchive,$scope,localStorageHandling){
        var archive = this;
        
        archive.articlelist = currentarchive; //get resolved currentarchive
        
        //listen to the backtolist event message to update the archive view
        $scope.$on('backtolist',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });
        //listen to the togglefavorite event message to update the archive view
        $scope.$on('togglefavorite',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });  
    };
    
    angular
        .module("app")
        .controller("archiveCtrl",archiveCtrl);
})();