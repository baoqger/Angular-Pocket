(function(){
    
    webScraper.$inject =["$http","MercuryAPIPath","localStorageHandling","localStorageService"];
    
    function webScraper($http,MercuryAPIPath,localStorageHandling,localStorageService){
        var webscraper = this;
        var articlelist = [];
        
        webscraper.addNewArticle = function(url){
            var newurl = MercuryAPIPath + url;
            return $http.get(newurl , {
                headers: {"x-api-key": "M1USTPmJMiRjtbjFNkNap9Z8M5XBb1aEQVXoxS5I"} 
            }).then(function(response){
                var newArticle = response.data;
                console.log(newArticle);
                newArticle.isArchive = false; //add isArchive property to article obj
                newArticle.isFavorite = false; //add isFavorite property to article obj
                newArticle.tags = [];// add tags property to article obj
                articlelist.push(newArticle)
                //add to local storage
                localStorageHandling.addtoLocalList(newArticle);                   

            },function(error){
                alert("Can't Fetch the HTML Data based on the URL. " + " response status: " + error.status);
            });
        };
        
    };
    angular
        .module("app")
        .service("webScraper",webScraper);
})();