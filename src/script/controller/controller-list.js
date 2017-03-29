(function(){
    listCtrl.$inject = ['$scope','webScraper','currentlist','localStorageHandling','changeListStyle','currentstyle','bulkedithandling','$rootScope'];
    
    function listCtrl($scope,webScraper,currentlist,localStorageHandling,changeListStyle,currentstyle,bulkedithandling,$rootScope){
        
        var list = this;
        
        list.isTileStyle = currentstyle; // get resolved currentstyle
        
        list.articlelist = currentlist; //get resolved currentlist
        
        list.isBulkPanelOn = false; // the initial status of showbulkpanel property
        
        list.bulkEditList = []; //the article list for storaging the selected article in bulk edit mode
        
        //listen to the addNewURL event
        $rootScope.$on('addNewURL',function(event,data){
            //webScraper.addNewArticle(data.url);
            webScraper.addNewArticle(data.url).then(function(){
                var lengthbeforeadd = list.articlelist.length;
                list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
                //broadcase the toastmessage
                var lengthafteradd = list.articlelist.length;
                if (lengthafteradd > lengthbeforeadd) {
                    $rootScope.$broadcast("toastmessage",{message:"Added to List"}); 
                }
                  
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
        //listen to the delete event message to update the list view 
        $scope.$on('delete',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });
        //listen to the add tag event message to update the list view 
        $scope.$on('addtag',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });       
        //listen to the remove tag event message to update the list view 
        $scope.$on('removetag',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });    
        //listen to the close search panel and update event
        $rootScope.$on('closesearchpanelandupdate',function(event, data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });
        //call back function for ng-click on swtich list style button
        list.changeListStyle = function(status){
            //list.isTileStyle = status;
            changeListStyle.changeStyle(status);//call the service method
            list.isTileStyle = changeListStyle.getCurrentStyle();
            $rootScope.$broadcast("changeliststyle",{currentStatus: status});//broadcast the event message to archive and favorite
            
        };
        //call back function for ng-click on open bulk panel button
        list.openBulkEditPanel = function(){
            list.bulkEditList.length = 0;
            list.isBulkPanelOn = true;
        };
        //call back function for ng-click on close bulk panel button
        list.closeBulkEditPanel = function(){
            list.isBulkPanelOn = false;
            list.bulkEditList.length = 0;
        };
        //call back function for addtoBulkEditList function for each article item object
        list.addRemoveBulkEdit = function(article, index, view){
            var obj = {
                article: article,
                index: index,
                view: view
            };
            //call buldedithandling service to update list
            list.bulkEditList = bulkedithandling.updateBulkList(list.bulkEditList, obj);
        };
        //callback function for archive button on the bulkedit panel
        list.bulkArchive = function(){
            bulkedithandling.archive(list.bulkEditList);//call the bulkedithanlding service function
            list.isBulkPanelOn = false; // update the status of showbulkpanel property
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: list.bulkEditList.length + " Item Archived"});             
            
        };
        //callback function for favorite button on the bulkedit panel
        list.bulkFavorite = function(){
            bulkedithandling.favorite(list.bulkEditList);
            list.isBulkPanelOn = false; // update the status of showbulkpanel property
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: list.bulkEditList.length + " Item Favorited"});            
        };
        //callback function for delete button on the bulkedit panel
        list.bulkDelete = function(){
            bulkedithandling.Delete(list.bulkEditList);
            list.isBulkPanelOn = false; // update the status of showbulkpanel property
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist 
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: list.bulkEditList.length + " Item Deleted"});            
        };
        //callback function for bulk addtag button on the bulkedit panel
        list.bulkAddTag = function(taginput){
            bulkedithandling.AddTag(list.bulkEditList,taginput);
            list.isBulkPanelOn = false; // update the status of showbulkpanel property
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist    
        };
        
    };
        
    angular
        .module("app")
        .controller("listCtrl",listCtrl);
})();