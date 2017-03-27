(function(){
    angular
        .module('app',['ui.router','LocalStorageModule'])
        .constant('MercuryAPIPath',"https://mercury.postlight.com/parser?url=")
        .config(config);
    
    config.$inject = ['$httpProvider'];
    function config($httpProvider){
        $httpProvider.interceptors.push('loadingHttpInterceptor');
    }
})();