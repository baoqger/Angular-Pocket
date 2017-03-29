(function(){
    
    hamburgerMenuDirective.$inject = ['$rootScope'];
    function hamburgerMenuDirective($rootScope){
        var ddo = {
            templateUrl: "view/component-template/component-hamburgermenu.html",
            controller:"hamburgerMenuController",
            controllerAs: "hamburger",
            bindToControler: true,
            link:function(scope,element,attrs){
                $rootScope.$on("openslidingbar",function(event,data){
                    element.find(".sliding-bar").addClass("sliding-bar-in");
                    element.find(".sliding-bar-cover").addClass("sliding-bar-cover-in");
                });                
                element.find(".close-sliding").on("click",function(){
                    closeSlidingBar();
                });
                element.find(".sliding-bar-cover").on("click",function(){
                    closeSlidingBar();
                });
                $rootScope.$on("$stateChangeStart",function(){
                    closeSlidingBar();
                });
                function closeSlidingBar(){
                    element.find(".sliding-bar").removeClass("sliding-bar-in");
                    element.find(".sliding-bar-cover").removeClass("sliding-bar-cover-in");                    
                };
            }
        }; 
        return ddo;
    };
    
    function hamburgerMenuController(){
        var hamburger = this;
        
        hamburger.$onInit = function(){
//            hamburger.shownSlidingBar = false;
//            hamburger.buttonClick = function(){
//                console.log("debugging button click")
//                hamburger.shownSlidingBar = true;
//            };
//            hamburger.closeSlidingBar = function(){
//                hamburger.shownSlidingBar = false;
//            };
        };
        
    };
    
    angular
        .module("app")
        .directive("hamburgerMenu",hamburgerMenuDirective)
        .controller("hamburgerMenuController",hamburgerMenuController);
})();