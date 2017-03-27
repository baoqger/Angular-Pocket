(function(){
    favoriteCtrl.$inject = ['currentfavorite','$scope','localStorageHandling','changeListStyle','currentstyle','bulkedithandling','$rootScope'];
    function favoriteCtrl(currentfavorite,$scope,localStorageHandling,changeListStyle,currentstyle,bulkedithandling,$rootScope){
        var favorite = this;
        
        favorite.isTileStyle = currentstyle; 
        
        favorite.articlelist = currentfavorite; //get resolved currentlist
        
        favorite.isBulkPanelOn = false; // the initial status of showbulkpanel property
        
        favorite.bulkEditList = []; //the article list for storaging the selected article in bulk edit mode
        
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
        //listen to the delete event message to update the list view 
        $scope.$on('delete',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the archivelist
        }); 
        //listen to the add tag event message to update the list view 
        $scope.$on('addtag',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
        });       
        //listen to the remove tag event message to update the list view 
        $scope.$on('removetag',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
        }); 
        //listen to the close search panel and update event
        $rootScope.$on('closesearchpanelandupdate',function(event, data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
        });        
        //call back function for ng-click on swtich list style button
        favorite.changeListStyle = function(status){
            changeListStyle.changeStyle(status);
            favorite.isTileStyle = changeListStyle.getCurrentStyle();
            $rootScope.$broadcast("changeliststyle",{currentStatus: status});
        }; 
        //call back function for ng-click on open bulk panel button
        favorite.openBulkEditPanel = function(){ 
            favorite.bulkEditList.length = 0;
            favorite.isBulkPanelOn = true;
        };        
        //call back function for ng-click on close bulk panel button
        favorite.closeBulkEditPanel = function(){
            favorite.isBulkPanelOn = false;
            favorite.bulkEditList.length = 0;
        };  
        //call back function for addtoBulkEditList function for each article item object
        favorite.addRemoveBulkEdit = function(article, index, view){
            console.log("inside list controller...")
            var obj = {
                article: article,
                index: index,
                view: view
            };
            //call buldedithandling service to update list
            favorite.bulkEditList = bulkedithandling.updateBulkList(favorite.bulkEditList, obj);
        };
        //callback function for archive button on the bulkedit panel
        favorite.bulkArchive = function(){
            bulkedithandling.archive(favorite.bulkEditList);//call the bulkedithanlding service function
            favorite.isBulkPanelOn = false; // update the status of showbulkpanel property
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: favorite.bulkEditList.length + " Item Archived"});            
        };
        //callback function for favorite button on the bulkedit panel
        favorite.bulkUnfavorite = function(){
            bulkedithandling.favorite(favorite.bulkEditList);
            favorite.isBulkPanelOn = false; // update the status of showbulkpanel property
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: favorite.bulkEditList.length + " Item Unfavorited"});             
        }; 
        //callback function for delete button on the bulkedit panel
        favorite.bulkDelete = function(){
            bulkedithandling.Delete(favorite.bulkEditList);
            favorite.isBulkPanelOn = false; // update the status of showbulkpanel property
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist 
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: favorite.bulkEditList.length + " Item Deleted"});            
        };
        //callback function for bulk addtag button on the bulkedit panel
        favorite.bulkAddTag = function(taginput){
            bulkedithandling.AddTag(favorite.bulkEditList,taginput);
            favorite.isBulkPanelOn = false; // update the status of showbulkpanel property
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist    
        };        
    };
    angular
        .module("app")
        .controller("favoriteCtrl",favoriteCtrl);
})();