(function(){
    angular
        .module('app',['ui.router','LocalStorageModule'])
        .constant('MercuryAPIPath',"https://mercury.postlight.com/parser?url=");
})();
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
                }
            }
        }).state("main.favorite",{
            url:"/favorite",
            templateUrl: 'view/view-favorite.html',
            controller: "favoriteCtrl as favorite",
            resolve: {
                currentfavorite: function(localStorageHandling){
                    return localStorageHandling.getCurrentFavorite();
                }
            }
        }).state("main.archive",{
            url:"/archive",
            templateUrl: 'view/view-archive.html',
            controller:"archiveCtrl as archive", 
            resolve:{
                currentarchive: function(localStorageHandling){
                    return localStorageHandling.getCurrentArchive();
                }
            }
        })
    }
})();
(function(){
    
    function actionListDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-actionlist.html",
            scope: {
                show:"<",
                currentArticle: "<",
                view:"@",
                index:"@"
            },
            controller:"actionListController",
            controllerAs: "actionlist",
            bindToController: true,
        };
        return ddo;
    }
    
    
    actionListController.$inject = ['localStorageHandling','$scope'];
    function actionListController(localStorageHandling,$scope){
        var action = this;
        action.$onInit = function(){
            //callback function for archive button 
            action.archive = function(){
                localStorageHandling.archive(action.index,action.view,action.currentArticle);
                //emit message to view list controller 
                $scope.$emit("archive",{});
            };
            action.addBacktoList = function(){
                localStorageHandling.backToList(action.index,action.view,action.currentArticle);
                 //emit message to view list controller 
                $scope.$emit("backtolist",{});               
            };
            action.toggleFavorite = function(){
                console.log(action.index)
                localStorageHandling.toggleFavorite(action.index,action.view,action.currentArticle);
                $scope.$emit("togglefavorite",{});
            }
        };
    }
    
    angular
        .module("app")
        .directive("actionList",actionListDirective)
        .controller("actionListController",actionListController);
})();
(function(){
    
    function articleItemDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-articleitem.html",
            scope:{
                myArticle:"=",
                view:"@",
                index: "@"
            },
            controller:"articleItemController",
            controllerAs: "articleitem",
            bindToController: true,
            
        };
        return ddo;
    } 
    
    function articleItemController(){
        var articleitem = this;
        
        articleitem.showactionlist = false; //the property to control the show/hide of actionlist 
        articleitem.$onInit = function(){
            console.log("debugging...");
            
            articleitem.showActionList = function(){ //show the actionlist
                articleitem.showactionlist = true;
            };
            articleitem.hideActionList = function(){ //hide the actionlist
                articleitem.showactionlist = false;
            };

        };
    };
    angular
        .module("app")
        .directive("articleItem",articleItemDirective)
        .controller("articleItemController",articleItemController);
})();
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
(function(){
    angular
        .module("app")
        .component("leftSidebar",{
            templateUrl:"view/component-template/component-leftsidebar.html"
        })
})();
(function(){
    
    localStorageHandling.$inject = ['localStorageService'];
    function localStorageHandling(localStorageService){
        var local = this;
        
        local.removeFromLocalStorage = function(key,index){
            if (!localStorageService.get(key)){ //judge the key exist or not
                localStorageService.set(key,[]);
            }
            var currentlocal = localStorageService.get(key);
            var removed = currentlocal.splice(index,1); 
            localStorageService.set(key,currentlocal);  
            return removed;
        };
        
        local.addToLocalStorage = function(key,obj){
            if (!localStorageService.get(key)){ //judge the key exist or not
                localStorageService.set(key,[]);
            }
            var currentlocal = localStorageService.get(key);
            currentlocal.push(obj);
            localStorageService.set(key,currentlocal);            
        }; 
        //callback function for add new article by url
        local.addtoLocalList = function(newarticle){
            local.addToLocalStorage('locallist',newarticle);
        };
        
        local.getCurrentList = function(){
            return localStorageService.get('locallist');
        };
        
        local.archive = function(index,view,article){
            if (view === "favorites"){ //when click in the favorite view
                //change the isArchive property for the article obj in favorite list
                local.changeObjArchiveStatusInList('localfavorite',index);
                //need to get the corresponding article index in mylist to remove
                var indexInList = getArticleIndex(localStorageService.get('locallist'),article.url);
                index = indexInList;
                
            } else if (view === "mylist") {//when click in mylist view
                //change the isArchive property for the article obj in 
                var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                if ( indexInFavorite >=0 ) {local.changeObjArchiveStatusInList('localfavorite',indexInFavorite);}
            }
            var archivearticle = local.removeFromLocalStorage('locallist',index);
            local.addToLocalStorage('localarchive',local.changeArchiveStatus(archivearticle[0]));
        };
        
        local.getCurrentArchive = function(){
            return localStorageService.get('localarchive');
        };
        
        
        local.changeObjArchiveStatusInList = function(key,index){
            var currentobj = localStorageService.get(key);
            currentobj[index] = local.changeArchiveStatus(currentobj[index])
            localStorageService.set(key,currentobj);
        }
        
        //change isArchive property for target article obj
        local.changeArchiveStatus = function(obj){
            obj.isArchive = !obj.isArchive;
            return obj;
        };
        
        local.backToList = function(index,view,article){
            if (view === "favorites"){ //when click in the favorite view
                //change the isArchive property for the article obj in favorite list 
                local.changeObjArchiveStatusInList('localfavorite',index);
                //need to get the corresponding article index in archive list
                var indexInArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);
                index = indexInArchive;
            } else if (view === "archive") {
                var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);   
                if ( indexInFavorite >=0 ) {local.changeObjArchiveStatusInList('localfavorite',indexInFavorite);}
            }
            
            var targetarticle = local.removeFromLocalStorage('localarchive',index);
            //local.addtoLocalList(targetarticle[0]);
            local.addtoLocalList( local.changeArchiveStatus(targetarticle[0]) );
        };
        
        local.toggleFavorite = function(index,view,article){ //callback function for favorite button's ng-click event
            if (article.isFavorite) { //already favorited, need to unfavorite 
				if ( view === "mylist" || view === "archive"){ //the article is from mylist or archive view
					local.changeFavoriteStatus(index,view);
					var indexInFavorite =  getArticleIndex(localStorageService.get('localfavorite'),article.url);
					if (indexInFavorite >= 0){
					   local.removeFromLocalStorage('localfavorite',indexInFavorite); 
					}				
				} else if (view === "favorites"){ //the article is from favorite view
					local.removeFromLocalStorage('localfavorite',index); //remove from localstorage
					var originalview = "";
					var indexInListorArchive = -1;
					if (article.isArchive){ //the original article is in archive view
						originalview = "archive";
						indexInListorArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);
					} else { //the original article is in list view
						originalview = "mylist";
						indexInListorArchive = getArticleIndex(localStorageService.get('locallist'),article.url);
					}
					if (indexInListorArchive >= 0 ){
						local.changeFavoriteStatus(indexInListorArchive,originalview);
					}
					
				}
            } else { //not favorited yet, need to favorite
                var revisedArticle = local.changeFavoriteStatus(index,view);
                local.addToLocalStorage('localfavorite',revisedArticle);
                
            }
        };
         
        //change the article object's isFavorite property in list or archive view
        local.changeFavoriteStatus = function(index,view){ 
            var key = "";
            if ( view === "mylist"){
                key = "locallist";
            } else if (view === "archive") {
                key = "localarchive";
            }
            var currentlocal = localStorageService.get(key);
            currentlocal[index]['isFavorite'] = !currentlocal[index]['isFavorite'];
            localStorageService.set(key,currentlocal);
            return currentlocal[index];
        };
        
        local.getCurrentFavorite = function(){
            return localStorageService.get('localfavorite');
        };      
        
    };
    
    function getArticleIndex(artilelist,targeturl){ //helper function to return the index of target obj in a list
        for(var i = 0; i < artilelist.length ; i++){
            if (artilelist[i].url === targeturl) {
                return i;
            }
        }
        return -1;
    };
    
    angular
        .module("app")
        .service("localStorageHandling",localStorageHandling);
})();
(function(){
    
    webScraper.$inject =["$http","MercuryAPIPath","localStorageHandling"];
    
    function webScraper($http,MercuryAPIPath,localStorageHandling){
        var webscraper = this;
        var articlelist = [];
        
        webscraper.addNewArticle = function(url){
            var newurl = MercuryAPIPath + url;
            return $http.get(newurl , {
                headers: {"x-api-key": "M1USTPmJMiRjtbjFNkNap9Z8M5XBb1aEQVXoxS5I"} 
            }).then(function(response){
                var newArticle = response.data;
                newArticle.isArchive = false; //add isArchive property to article obj
                newArticle.isFavorite = false; //add isFavorite property to article obj
                articlelist.push(newArticle)
                
                //add to local storage
                localStorageHandling.addtoLocalList(newArticle);
            },function(error){
                alert("Can't Fetch the HTML Data based on the URL. " + " response status: " + error.status);
            });
        };
        
        webscraper.getArticles = function(){
            return articlelist;
        };
    };
    angular
        .module("app")
        .service("webScraper",webScraper);
})();
(function(){
    archiveCtrl.$inject = ['currentarchive','$scope','localStorageHandling'];
    
    function archiveCtrl(currentarchive,$scope,localStorageHandling){
        var archive = this;
        
        archive.articlelist = currentarchive; //get resolved currentarchive
        
        //listen to the backtolist event message to update the archive view
        $scope.$on('backtolist',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });
        //listen to the togglefavorite event message to update the archive view
        $scope.$on('togglefavorite',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });  
    };
    
    angular
        .module("app")
        .controller("archiveCtrl",archiveCtrl);
})();
(function(){
    favoriteCtrl.$inject = ['currentfavorite','$scope','localStorageHandling'];
    function favoriteCtrl(currentfavorite,$scope,localStorageHandling){
        var favorite = this;
        
        favorite.articlelist = currentfavorite; //get resolved currentlist
        
        //listen to the togglefavorite event message to update the favorite view
        $scope.$on('togglefavorite',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the archivelist
        });          

        $scope.$on('archive',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the archivelist
        });
        
        $scope.$on('backtolist',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the archivelist
        }); 
    };
    angular
        .module("app")
        .controller("favoriteCtrl",favoriteCtrl);
})();
(function(){
    listCtrl.$inject = ['$scope','webScraper','currentlist','localStorageHandling']
    
    function listCtrl($scope,webScraper,currentlist,localStorageHandling){
        
        var list = this;
        
        list.articlelist = currentlist; //get resolved currentlist
        
        //listen to the addNewURL event
        $scope.$on('addNewURL',function(event,data){
           //webScraper.addNewArticle(data.url);
           webScraper.addNewArticle(data.url).then(function(){
               list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
           });
        });
        //listen to the archive event message to update the list view
        $scope.$on('archive',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });
        //listen to the togglefavorite event message to update the list view
        $scope.$on('togglefavorite',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });        
        
    };
        
    angular
        .module("app")
        .controller("listCtrl",listCtrl);
})();
(function(){
    mainCtrl.$inject = ['$scope'];
    
    function mainCtrl($scope){
        //listen to the addNewURL event
        //$scope.$on('addNewURL',function(event,data){
           //console.log(data) 
        //});
    };
    
    angular
        .module("app")
        .controller("mainCtrl",mainCtrl);
})();
(function(){
    
    topCtrl.$inject = ['$scope'];
    
    function topCtrl($scope){
        var top = this;
        top.dialogShown = false;
        top.toggleDialog = function(){
            top.dialogShown = !top.dialogShown;
        };
        top.addNewURL = function(){
            top.dialogShown = !top.dialogShown;
            //broadcase the addNewURL event to the sublevel main controller
            $scope.$broadcast('addNewURL',{
                url:top.newURL
            })
            top.newURL = "";
        };
    }
    
    angular
        .module("app")
        .controller("topCtrl",topCtrl);
})();