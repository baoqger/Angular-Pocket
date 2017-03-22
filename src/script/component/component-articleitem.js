(function(){
    
    function articleItemDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-articleitem.html",
            scope:{
                myArticle:"=",
                view:"@",
                index: "@"
            },
            controller:"articleItemController",
            controllerAs: "articleitem",
            bindToController: true,
            
        };
        return ddo;
    } 
    
    function articleItemController(){
        var articleitem = this;
        
        articleitem.showactionlist = false; //the property to control the show/hide of actionlist 
        articleitem.$onInit = function(){
            console.log("debugging...");
            
            articleitem.showActionList = function(){ //show the actionlist
                articleitem.showactionlist = true;
            };
            articleitem.hideActionList = function(){ //hide the actionlist
                articleitem.showactionlist = false;
            };

        };
    };
    angular
        .module("app")
        .directive("articleItem",articleItemDirective)
        .controller("articleItemController",articleItemController);
})();