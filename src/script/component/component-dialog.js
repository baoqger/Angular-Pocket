(function(){
    function myDialogDirective(){
        var ddo = {
                templateUrl:"view/component-template/component-mydialog.html",
                scope:{
                    show: "=", 
                },
                controller: 'myDialogController',
                controllerAs: "dialog",
                bindToController: true,
                transclude: true,
                link: function(scope, element, attrs){
                    scope.dialog.dialogStyle = {};
                    if (attrs.boxWidth) {
                        scope.dialog.dialogStyle.width = attrs.boxWidth;
                    }
                    if (attrs.boxHeight) {
                        scope.dialog.dialogStyle.height = attrs.boxHeight;
                    }
                    scope.dialog.hideModal = function(){
                        scope.dialog.show = false;
                    }
                }
            }
        return ddo;
        
    }
    
    function myDialogController (){
        
    }
    
    angular
        .module("app")
        .directive("myDialog", myDialogDirective)
        .controller("myDialogController",myDialogController);
})();