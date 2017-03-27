(function(){
    
    function headerListviewDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-headeroflistview.html",
            controller:"headerListviewController",
            controllerAs:"headeroflist",
            bindToController: true,
            scope: {
                listTitle: "@",
                switchListStyle:"&",
                bulkEdit:"&",
                isTile:"<"
            },
        };
        return ddo;
    };
    
    function headerListviewController(){
        var header = this;
        header.$onInit = function(){
        };
    };
    
    angular
        .module("app")
        .directive("headerListview",headerListviewDirective)
        .controller("headerListviewController",headerListviewController)
    
})();