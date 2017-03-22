(function(){
    
    function headerListviewDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-headeroflistview.html",
            controller:"headerListviewController",
            controllerAs:"headeroflist",
            bindToController: true,
            scope: {
                listTitle: "@"
            }
        };
        return ddo;
    };
    
    function headerListviewController(){
        
    };
    
    angular
        .module("app")
        .directive("headerListview",headerListviewDirective)
        .controller("headerListviewController",headerListviewController)
    
})();