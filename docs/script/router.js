(function(){
    angular
        .module('app')
        .config(RouterConfig);
    RouterConfig.$inject = ['$stateProvider','$urlRouterProvider'];
    function RouterConfig($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('main/list');//set default state and URL
        
        $stateProvider.state("main",{
            url: '/main',
            templateUrl: "view/view-main.html",
            controller: "mainCtrl as main"
            
        }).state("recommend",{
            url:'/recommend',
            templateUrl: 'view/view-recommend.html',
            //controller:"recommendCtrl as recommend"
        }).state("main.mylist",{
            url:"/list",
            templateUrl: 'view/view-list.html',
            controller: "listCtrl as list",
            resolve: {
                currentlist: function(localStorageHandling){
                    return localStorageHandling.getCurrentList();
                },
                currentstyle: function(changeListStyle){
                    return changeListStyle.getCurrentStyle();
                }
            }
        }).state("main.favorite",{
            url:"/favorite",
            templateUrl: 'view/view-favorite.html',
            controller: "favoriteCtrl as favorite",
            resolve: {
                currentfavorite: function(localStorageHandling){
                    return localStorageHandling.getCurrentFavorite();
                },
                currentstyle: function(changeListStyle){
                    return changeListStyle.getCurrentStyle();
                }                
            }
        }).state("main.archive",{
            url:"/archive",
            templateUrl: 'view/view-archive.html',
            controller:"archiveCtrl as archive", 
            resolve:{
                currentarchive: function(localStorageHandling){
                    return localStorageHandling.getCurrentArchive();
                },
                currentstyle: function(changeListStyle){
                    return changeListStyle.getCurrentStyle();
                }
            }
        })
    }
})();