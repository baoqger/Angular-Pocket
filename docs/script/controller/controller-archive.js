(function(){
    archiveCtrl.$inject = ['currentarchive','$scope','localStorageHandling','changeListStyle','currentstyle','bulkedithandling','$rootScope'];
    
    function archiveCtrl(currentarchive,$scope,localStorageHandling,changeListStyle,currentstyle,bulkedithandling,$rootScope){
        var archive = this;
        
        archive.isTileStyle = currentstyle; 
        
        archive.articlelist = currentarchive; //get resolved currentarchive
        
        archive.isBulkPanelOn = false; // the initial status of showbulkpanel property
        
        archive.bulkEditList = []; //the article list for storaging the selected article in bulk edit mode
        
        //listen to the backtolist event message to update the archive view
        $scope.$on('backtolist',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });
        //listen to the togglefavorite event message to update the archive view
        $scope.$on('togglefavorite',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });  
        //listen to the delete event message to update the list view 
        $scope.$on('delete',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });
        //listen to the add tag event message to update the list view 
        $scope.$on('addtag',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
        });       
        //listen to the remove tag event message to update the list view 
        $scope.$on('removetag',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
        });  
        //listen to the close search panel and update event
        $rootScope.$on('closesearchpanelandupdate',function(event, data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
        });
        //call back function for ng-click on swtich list style button
        archive.changeListStyle = function(status){
            changeListStyle.changeStyle(status);
            archive.isTileStyle = changeListStyle.getCurrentStyle();
            $rootScope.$broadcast("changeliststyle",{currentStatus: status});
        };          
        //call back function for ng-click on open bulk panel button
        archive.openBulkEditPanel = function(){ 
            archive.bulkEditList.length = 0;
            archive.isBulkPanelOn = true;
        };        
        //call back function for ng-click on close bulk panel button
        archive.closeBulkEditPanel = function(){
            archive.isBulkPanelOn = false;
            archive.bulkEditList.length = 0;
        };  
        //call back function for addtoBulkEditList function for each article item object
        archive.addRemoveBulkEdit = function(article, index, view){
            console.log("inside list controller...")
            var obj = {
                article: article,
                index: index,
                view: view
            };
            //call buldedithandling service to update list
            archive.bulkEditList = bulkedithandling.updateBulkList(archive.bulkEditList, obj);
        };    
        //callback function for archive button on the bulkedit panel
        archive.bulkReadd = function(){
            bulkedithandling.reAdd(archive.bulkEditList);//call the bulkedithanlding service function
            archive.isBulkPanelOn = false; // update the status of showbulkpanel property
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: archive.bulkEditList.length + " Item Added to List"});             
        };
        //callback function for favorite button on the bulkedit panel
        archive.bulkFavorite = function(){
            bulkedithandling.favorite(archive.bulkEditList);
            archive.isBulkPanelOn = false; // update the status of showbulkpanel property
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: archive.bulkEditList.length + " Item Favorited"});             
        };
        //callback function for delete button on the bulkedit panel
        archive.bulkDelete = function(){
            bulkedithandling.Delete(archive.bulkEditList);
            archive.isBulkPanelOn = false; // update the status of showbulkpanel property
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist  
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: archive.bulkEditList.length + " Item Deleted"});              
        };
        //callback function for bulk addtag button on the bulkedit panel
        archive.bulkAddTag = function(taginput){
            bulkedithandling.AddTag(archive.bulkEditList,taginput);
            archive.isBulkPanelOn = false; // update the status of showbulkpanel property
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist    
        };          
    };
    
    angular
        .module("app")
        .controller("archiveCtrl",archiveCtrl);
})();