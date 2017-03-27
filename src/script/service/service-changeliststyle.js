(function(){
    
    changeListStyle.$inject = ['localStorageService'];

    function changeListStyle(localStorageService){
        var style = this;
        style.changeStyle = function(status){
            localStorageService.set("isTileStyle",status);
        };
        style.getCurrentStyle = function(){
            if (localStorageService.get("isTileStyle") == null){
                localStorageService.set("isTileStyle",true);
            }            
            return localStorageService.get("isTileStyle");
        };
        
    };
    
    angular
        .module("app")
        .service("changeListStyle",changeListStyle);
})();