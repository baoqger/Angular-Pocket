(function(){
    readCtrl.$inject = ['$stateParams'];
    function readCtrl($stateParams){
        var read = this;
        read.article = $stateParams.article;
    };
    
    angular
        .module("app")
        .controller("readCtrl",readCtrl);
})();