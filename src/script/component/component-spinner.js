(function(){
    
    angular
        .module('app')
        .component('loadingSpinner',{
            templateUrl: "view/component-template/component-spinner.html",
            controller: SpinnerController
        });
    
    SpinnerController.$inject = ['$rootScope']
    
    function SpinnerController($rootScope){
        var spinner = this;
        spinner.$onInit = function(){
            spinner.spinnerShown = false;
        }
        var cancel = $rootScope.$on('spinner:activate',function(event,data){
            if (data.on){
                spinner.spinnerShown = true;
            } else {
                spinner.spinnerShown = false;
            }
        });
        
        spinner.$onDestroy = function(){
            cancel();
        }
    }
    
})();