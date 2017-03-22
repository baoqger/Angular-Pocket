(function(){
    angular
        .module("app")
        .component("appHeader",{
            templateUrl:"view/component-template/component-header.html",
            bindings: {
                toggleUrldialog: "&",
            }
        });
})();