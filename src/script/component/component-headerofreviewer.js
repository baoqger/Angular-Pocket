(function(){
    reviewerHeaderDirective.$inject = ['$window'];
    function reviewerHeaderDirective($window){
        var ddo = {
            templateUrl: "view/component-template/component-headerofreviewer.html",
            controller: "reviewerHeaderController",
            controllerAs:"reviewerheader",
            bindToController: true,
            link: function(scope,element,attrs){
                element.on("click",function(){
                    $window.history.back(); //history API of build in $window service
                })
            }
        };
        return ddo;
    };
    
    function reviewerHeaderController(){
        var reviewerheader = this;
    };
    angular
        .module("app")
        .directive("reviewerHeader",reviewerHeaderDirective)
        .controller("reviewerHeaderController",reviewerHeaderController);
})();