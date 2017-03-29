(function(){
    
    function appHeaderDirective(){
        var ddo = {
            templateUrl:"view/component-template/component-header.html",
            scope : {
                toggleUrldialog: "&",
                openSearchPanel:"&"                
            },
            controller: "appHeaderController",
            controllerAs: "$ctrl",
            bindToController: true
        };
        return ddo;
    };
    
    appHeaderController.$inject = ['$rootScope'];
    function appHeaderController($rootScope){
        var appheader = this;
        appheader.$onInit = function(){
            //call back function on the hamberger button
            appheader.openSlidingBar = function(){
                //broadcast the openslidingbar event to slidingbar component
                $rootScope.$broadcast("openslidingbar",{});
            };            
        };
        //listen to the event for the state change to get the current view name
        $rootScope.$on("$stateChangeSuccess",function(event, toState, toParams, fromState, fromParams, options){
            appheader.viewname =  toState.name.split(".")[1].charAt(0).toUpperCase() + toState.name.split(".")[1].slice(1);
        });
    };
    
    angular
        .module("app")
//        .component("appHeader",{
//            templateUrl:"view/component-template/component-header.html",
//            bindings: {
//                toggleUrldialog: "&",
//                openSearchPanel:"&"
//            }
//        })
        .directive("appHeader",appHeaderDirective)
        .controller("appHeaderController",appHeaderController);
    
})();