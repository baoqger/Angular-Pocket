(function(){
    searchhandling.$inject = ['localStorageService'];
    
    function searchhandling(localStorageService){
        var search = this;
        
        search.searchArticle = function(view,filterFavorite,keyword){
            console.log("debugging in the search service...")
            var key = "";
            if (view === "My List") {
                key = "locallist";
            } else if (view === "Archive"){
                key = "localarchive";
            } 
            var result = search.searchInLocal(key,filterFavorite,keyword);
            return result;
        };
        search.searchInLocal = function(key,filterFavorite,keyword){
            var matchlist = [];
            var totallist = localStorageService.get(key);
            if (keyword !== "") {
                totallist.forEach(function(each){
                    if (each.title.toLowerCase().search(keyword) >=0) {
                        matchlist.push(each);
                    }                        

                });   
                if (filterFavorite) { // filter favorite one
                    matchlist = matchlist.filter(function(each){
                        return each.isFavorite;
                    });
                }    
            };

            return matchlist;
        };
        search.filterViewName = function(name){
            var result = "";
            var filterFavoriteOn = false;
            var viewname = "";
            if (name === "main.mylist") {
                result = "My List";
                viewname = "mylist";
            } else if (name === "main.archive"){
                result = "Archive";
                viewname = "archive";
            } else if (name === "main.favorite"){
                result = "My List";
                viewname = "mylist";
                filterFavoriteOn = true;
            }
            return [result,viewname,filterFavoriteOn];
        };
        search.getOriginalIndex = function(key,article){
            var keyname = "";
            if (key === 'mylist') {
                keyname = 'locallist';
            } else {
                keyname = 'localarchive';
            }
            return getArticleIndex(localStorageService.get(keyname),article.url);
        };
    }
    
    function getArticleIndex(artilelist,targeturl){ //helper function to return the index of target obj in a list
        for(var i = 0; i < artilelist.length ; i++){
            if (artilelist[i].url === targeturl) {
                return i;
            }
        }
        return -1;
    };
    
    angular
        .module("app")
        .service("searchhandling",searchhandling);
})();