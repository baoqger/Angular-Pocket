(function(){
    
    headerListviewDirective.$inject = ['$window']
    function headerListviewDirective($window){
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
            link:function(scope,element,attrs){
                angular.element($window).bind("resize",function(){
                    if ($window.innerWidth <= 700) {
                        scope.$apply(function(){
                            scope.headeroflist.switchListStyle({status:false});
                        });
                    }
                })
            }
        };
        return ddo;
    };
    
    function headerListviewController(){
        var header = this;
        header.$onInit = function(){
            header.clickChangeStyle = function(){
                console.log(header.isTile)
                if (header.isTile) {
                    header.switchListStyle({status:false});
                } else {
                    header.switchListStyle({status:true});
                }
            }
        };
    };
    
    angular
        .module("app")
        .directive("headerListview",headerListviewDirective)
        .controller("headerListviewController",headerListviewController)
    
})();