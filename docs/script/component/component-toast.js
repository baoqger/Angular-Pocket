(function(){

    toastMessageDirective.$inject = ['$rootScope','$timeout'];
    function toastMessageDirective($rootScope,$timeout){
        var ddo = {
            templateUrl: "view/component-template/component-toast.html",
            scope:{},
            controller: "toastMessageController",
            controllerAs: "toast",
            bindToController: true,
            link: function(scope,element){
                $rootScope.$on("toastmessage",function(event,data){
                    scope.toast.toastShown = true;
                    scope.toast.message = data.message;
                    element.find("#toast").addClass("show");
                    $timeout(function(){
                        scope.toast.toastShown = false;
                        element.find("#toast").removeClass("show");
                    },2900)
                })               
            }
            
        };
        return ddo;
    };
    
    //toastMessageController.$inject = ['$rootScope']
    function toastMessageController($rootScope){
        var toast = this;
        
        toast.$onInit = function(){
            
            toast.toastShown = false;

            toast.message = "";  
            
        };
    }
    
    
    angular
        .module("app")
        .directive("toastMessage",toastMessageDirective)
        .controller("toastMessageController",toastMessageController);
})();