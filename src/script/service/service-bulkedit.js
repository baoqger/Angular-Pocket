(function(){
    bulkedithandling.$inject = ['localStorageHandling'];
    
    function bulkedithandling(localStorageHandling){
        
        var bulk = this;
        bulk.updateBulkList = function(bulklist, obj) {
            var index = bulk.checkExist(bulklist, obj)
            if (index === -1) {
                bulklist.push(obj);
            } else {
               bulklist.splice(index,1);
            }
            return bulklist;
        };
        
        bulk.checkExist = function(bulklist, obj){
            for (var i = 0 ; i < bulklist.length; i++){
                if (bulklist[i].article.url === obj.article.url) {
                    return i;
                }
            }
            return -1;
        };
        
        bulk.archive = function(bulklist){
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});
            //loop through the  list and archive each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.archive(eacharticle.index,eacharticle.view,eacharticle.article);
            });
        };
        bulk.favorite = function(bulklist){
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});
            //loop through the  list and favorite each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.toggleFavorite(eacharticle.index,eacharticle.view,eacharticle.article)
            });
            
        };
        bulk.reAdd = function(bulklist){
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});  
            //loop through the  list and favorite each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.backToList(eacharticle.index,eacharticle.view,eacharticle.article)
            });
        };
        bulk.Delete = function(bulklist) {
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});
            //loop through the  list and delete each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.deleteArticle(eacharticle.index,eacharticle.view,eacharticle.article)
            });            
        };
        bulk.AddTag = function(bulklist,taginput){
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});  
            //loop through the  list and add tag each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.addTag(eacharticle.index,eacharticle.view,eacharticle.article,taginput)
            });             
        };
    }
    
    angular
        .module("app")
        .service("bulkedithandling",bulkedithandling);
})();