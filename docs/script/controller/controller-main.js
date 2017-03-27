(function(){
    mainCtrl.$inject = ['$scope'];
    
    function mainCtrl($scope){
        //listen to the addNewURL event
        //$scope.$on('addNewURL',function(event,data){
           //console.log(data) 
        //});
    };
    
    angular
        .module("app")
        .controller("mainCtrl",mainCtrl);
})();