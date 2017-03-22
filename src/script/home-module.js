(function(){
    angular
        .module('app',['ui.router','LocalStorageModule'])
        .constant('MercuryAPIPath',"https://mercury.postlight.com/parser?url=");
})();