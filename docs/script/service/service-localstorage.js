(function(){
    
    localStorageHandling.$inject = ['localStorageService','$rootScope'];
    function localStorageHandling(localStorageService,$rootScope){
        var local = this;
        
        local.removeFromLocalStorage = function(key,index){
            if (!localStorageService.get(key)){ //judge the key exist or not
                localStorageService.set(key,[]);
            }
            var currentlocal = localStorageService.get(key);
            var removed = currentlocal.splice(index,1); 
            localStorageService.set(key,currentlocal);  
            return removed;
        };
        
        local.addToLocalStorage = function(key,obj){
            if (!localStorageService.get(key)){ //judge the key exist or not
                localStorageService.set(key,[]);
            }
            var currentlocal = localStorageService.get(key);
            if (getArticleIndex(currentlocal,obj.url) === -1 ) {// the obj doesn't exsit yet
                currentlocal.push(obj);
                localStorageService.set(key,currentlocal);                 
            } else {
                $rootScope.$broadcast('toastmessage',{message:'The article already exsit'});
            }
           
        }; 
        //callback function for add new article by url
        local.addtoLocalList = function(newarticle){
            local.addToLocalStorage('locallist',newarticle);
        };
        
        local.getCurrentList = function(){
            return localStorageService.get('locallist');
        };
        
        local.archive = function(index,view,article){
            if (view === "favorites"){ //when click in the favorite view
                //change the isArchive property for the article obj in favorite list
                local.changeObjArchiveStatusInList('localfavorite',index);
                //need to get the corresponding article index in mylist to remove
                var indexInList = getArticleIndex(localStorageService.get('locallist'),article.url);
                index = indexInList;
                
            } else if (view === "mylist") {//when click in mylist view
                //change the isArchive property for the article obj in 
                if (!localStorageService.get('localfavorite')) {localStorageService.set('localfavorite',[])}
                var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                if ( indexInFavorite >=0 ) {local.changeObjArchiveStatusInList('localfavorite',indexInFavorite);}
            }
            var archivearticle = local.removeFromLocalStorage('locallist',index);
            local.addToLocalStorage('localarchive',local.changeArchiveStatus(archivearticle[0]));
        };
        
        local.getCurrentArchive = function(){
            return localStorageService.get('localarchive');
        };
        
        
        local.changeObjArchiveStatusInList = function(key,index){
            var currentobj = localStorageService.get(key);
            currentobj[index] = local.changeArchiveStatus(currentobj[index])
            localStorageService.set(key,currentobj);
        }
        
        //change isArchive property for target article obj
        local.changeArchiveStatus = function(obj){
            obj.isArchive = !obj.isArchive;
            return obj;
        };
        
        local.backToList = function(index,view,article){
            if (view === "favorites"){ //when click in the favorite view
                //change the isArchive property for the article obj in favorite list 
                local.changeObjArchiveStatusInList('localfavorite',index);
                //need to get the corresponding article index in archive list
                var indexInArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);
                index = indexInArchive;
            } else if (view === "archive") {
                var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);   
                if ( indexInFavorite >=0 ) {local.changeObjArchiveStatusInList('localfavorite',indexInFavorite);}
            }
            
            var targetarticle = local.removeFromLocalStorage('localarchive',index);
            //local.addtoLocalList(targetarticle[0]);
            local.addtoLocalList( local.changeArchiveStatus(targetarticle[0]) );
        };
        
        local.toggleFavorite = function(index,view,article){ //callback function for favorite button's ng-click event
            if (article.isFavorite) { //already favorited, need to unfavorite 
				if ( view === "mylist" || view === "archive"){ //the article is from mylist or archive view
					local.changeFavoriteStatus(index,view);
					var indexInFavorite =  getArticleIndex(localStorageService.get('localfavorite'),article.url);
					if (indexInFavorite >= 0){
					   local.removeFromLocalStorage('localfavorite',indexInFavorite); 
					}				
				} else if (view === "favorites"){ //the article is from favorite view
					local.removeFromLocalStorage('localfavorite',index); //remove from localstorage
					var originalview = "";
					var indexInListorArchive = -1;
					if (article.isArchive){ //the original article is in archive view
						originalview = "archive";
						indexInListorArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);
					} else { //the original article is in list view
						originalview = "mylist";
						indexInListorArchive = getArticleIndex(localStorageService.get('locallist'),article.url);
					}
					if (indexInListorArchive >= 0 ){
						local.changeFavoriteStatus(indexInListorArchive,originalview);
					}
					
				}
            } else { //not favorited yet, need to favorite
                var revisedArticle = local.changeFavoriteStatus(index,view);
                local.addToLocalStorage('localfavorite',revisedArticle);
                
            }
        };
         
        //change the article object's isFavorite property in list or archive view
        local.changeFavoriteStatus = function(index,view){ 
            var key = "";
            if ( view === "mylist"){
                key = "locallist";
            } else if (view === "archive") {
                key = "localarchive";
            }
            var currentlocal = localStorageService.get(key);
            currentlocal[index]['isFavorite'] = !currentlocal[index]['isFavorite'];
            localStorageService.set(key,currentlocal);
            return currentlocal[index];
        };
        
        local.getCurrentFavorite = function(){
            return localStorageService.get('localfavorite');
        }; 
        
        local.deleteArticle = function(index,view,article){
            
            if ( view === "mylist" ){ //delete from mylist view
                local.removeFromLocalStorage("locallist",index);
                if (article.isFavorite){// this article is favorited one
                    var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                    if (indexInFavorite >= 0) {local.removeFromLocalStorage("localfavorite",indexInFavorite);}
                }
            } else if (view === "archive" ) { //delete from archive view
                local.removeFromLocalStorage("localarchive",index);
                if (article.isFavorite){// this article is favorited one
                    var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                    if (indexInFavorite >= 0) {local.removeFromLocalStorage("localfavorite",indexInFavorite);}
                }                
            } else { //delete from favorite view
                local.removeFromLocalStorage("localfavorite",index);
                var indexInListorArchive = -1;
                var keyname = "";
                if (article.isArchive){ //this article is in archive list
                    keyname = "localarchive";
                    indexInListorArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);
                } else { // this article is in mylist 
                    keyname = "locallist";
                    indexInListorArchive = getArticleIndex(localStorageService.get('locallist'),article.url);
                }
                if (indexInListorArchive >= 0){local.removeFromLocalStorage(keyname,indexInListorArchive);};
            }
            
            
        };
        
        local.addTag = function(index,view,article,tag){
            if (view === "favorites") { //add tag to article in favorite view
                local.addTagtoLocalObj('localfavorite',index,tag);
                var indexInListorArchive = -1;
                var keyname = "";                
                if (article.isArchive) {
                    keyname = "localarchive";
                    indexInListorArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);
                } else {
                    keyname = "locallist";
                    indexInListorArchive = getArticleIndex(localStorageService.get('locallist'),article.url);                    
                }
                local.addTagtoLocalObj(keyname,indexInListorArchive,tag);
                
            } else { 
                if (view === "mylist"){ //add tag to article in mylist view
                    local.addTagtoLocalObj('locallist',index,tag);
                } else { //add tag to article in archive view
                   local.addTagtoLocalObj('localarchive',index,tag);
                }
                //handle the corresponding favorite one if exist
                if (article.isFavorite) {
                    var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                    local.addTagtoLocalObj('localfavorite',indexInFavorite,tag);
                }
            }
        };
        local.addTagtoLocalObj = function(key,index,tag){
            var currentobj = localStorageService.get(key);
            currentobj[index]['tags'].push(tag);
            localStorageService.set(key,currentobj);            
        };
        local.removeTagfromLocalObj = function(key,index,tagindex){
            var currentobj = localStorageService.get(key);
            currentobj[index]['tags'].splice(tagindex,1);
            localStorageService.set(key,currentobj);            
        };
        local.removeTag = function(index,view,article,tagindex){
            if (view === "favorites") {
                local.removeTagfromLocalObj('localfavorite',index,tagindex);
                var indexInListorArchive = -1;
                var keyname = "";                 
                if (article.isArchive) {
                    keyname = "localarchive";
                    indexInListorArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);                   
                } else {
                    keyname = "locallist";
                    indexInListorArchive = getArticleIndex(localStorageService.get('locallist'),article.url);                    
                }
                local.removeTagfromLocalObj(keyname,indexInListorArchive,tagindex);
            } else {
                var key = "";
                if (view === "mylist"){ 
                    key = "locallist";
                } else {
                    key = "localarchive";
                }
                local.removeTagfromLocalObj(key,index,tagindex);
                //handle the corresponding favorite one if exist
                if (article.isFavorite) {
                    var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                    local.removeTagfromLocalObj('localfavorite',indexInFavorite,tagindex);
                }
            }
        };
        
    };
    
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
        .service("localStorageHandling",localStorageHandling);
})();