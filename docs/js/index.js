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
        }).state("read",{
            url:"/read/:view/:id",
            templateUrl: "view/view-read.html",
            controller: "readCtrl as read",
            params: {
                view:null,
                id:null,
                article:null
            },
//            resolve: {
//                content: function($stateParams){
//                    return $stateParams.content;
//                }
//            },
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
                index:"@",
                showDeleteDialog: "&",
                showTagDialog:"&"
            },
            controller:"actionListController",
            controllerAs: "actionlist",
            bindToController: true,
        };
        return ddo;
    }
    
    
    actionListController.$inject = ['localStorageHandling','$scope','$rootScope'];
    function actionListController(localStorageHandling,$scope,$rootScope){
        var action = this;
        action.$onInit = function(){
            //callback function for archive button 
            action.archive = function(){
                localStorageHandling.archive(action.index,action.view,action.currentArticle);
                //emit message to view list controller 
                $scope.$emit("archive",{});
                //broadcase message to toast directive 
                $rootScope.$broadcast("toastmessage",{message:"Item archived"});
            };
            action.addBacktoList = function(){
                localStorageHandling.backToList(action.index,action.view,action.currentArticle);
                 //emit message to view list controller 
                $scope.$emit("backtolist",{});
                //broadcase message to toast directive 
                $rootScope.$broadcast("toastmessage",{message:"Added to List"});                
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
                index: "@",
                isBulkEdit: "=",
                addToBulkEditList: "&",
            },
            controller:"articleItemController",
            controllerAs: "articleitem",
            bindToController: true,
            link: function(scope,element,attrs){
                element.on("click",function(){
                    if (scope.articleitem.isBulkEdit) { //toggleclass only when bulkedit panel is on
                       element.toggleClass("bulk-edit"); 
                    }
                });
                scope.$watch("articleitem.isBulkEdit",function(newvalue,oldvalue){//watch the property of isBlukedit on or off
                    if (newvalue === oldvalue) { return;}
                    if (!newvalue) { //if bulkedit panel is turned off, remove the highlight bg color for each object
                        element.removeClass("bulk-edit");
                    }
                });
            }
            
        };
        return ddo;
    } 
    
    articleItemController.$inject = ['localStorageHandling','$scope','$rootScope','$state'];
    
    function articleItemController(localStorageHandling,$scope,$rootScope,$state){
        var articleitem = this;
        
        articleitem.showactionlist = false; //the property to control the show/hide of actionlist 
        
        articleitem.deletedialogShown = false; // the initial status of delete dialog
        
        articleitem.tagdialogShown = false; //the initial status of tag dialog
        
        articleitem.$onInit = function(){
            
            articleitem.showActionList = function(){ //show the actionlist
                articleitem.showactionlist = true;
            };
            articleitem.hideActionList = function(){ //hide the actionlist
                articleitem.showactionlist = false;
            };
            articleitem.click = function(){
                if (articleitem.isBulkEdit){ //in bulkedit mode
                    articleitem.addToBulkEditList({article:articleitem.myArticle, index:articleitem.index, view:articleitem.view});
                } else { //not in bulkedit mode, go to read state with specific params
                    $state.go('read',{id:articleitem.index,view:articleitem.view,article:articleitem.myArticle});
                }
                
            };
            //call back function of open delete dialog for ng-click event on the delete button in the actionlist
            articleitem.openDeleteDialog = function(){
                articleitem.deletedialogShown = true;
                
            };
            //call back function of close delete dialog for ng-click event on the cancel button in the delete dialog
            articleitem.closeDeleteDialog = function(){
                articleitem.deletedialogShown = !articleitem.deletedialogShown;
            };
            //call back funtion of delete button on the delete dialog
            articleitem.deleteArticle = function(){
                localStorageHandling.deleteArticle(articleitem.index,articleitem.view,articleitem.myArticle);
                articleitem.deletedialogShown = !articleitem.deletedialogShown;
                //emit the delete event message to upper level
                $scope.$emit("delete",{});
                //broadcase the toastmessage
                $rootScope.$broadcast("toastmessage",{message:"Item deleted"});                
            };
            //call back function of open tag dialog for ng-click event on the tag button in the actionlist
            articleitem.openTagDialog = function(){
                articleitem.tagdialogShown = true; 
                
            };            
            //add new tag to the article
            articleitem.addNewTag = function(){
                localStorageHandling.addTag(articleitem.index,articleitem.view,articleitem.myArticle,articleitem.taginput);
                articleitem.tagdialogShown = false; 
                articleitem.taginput = "";
                //emit the delete event message to upper level
                $scope.$emit("addtag",{});
            };
            //remove tag from the article
            articleitem.removeTag = function(tagindex){
                localStorageHandling.removeTag(articleitem.index,articleitem.view,articleitem.myArticle,tagindex);
                $scope.$emit("removetag",{});
            };

        };
    };
    angular
        .module("app")
        .directive("articleItem",articleItemDirective)
        .controller("articleItemController",articleItemController);
})();
(function() {
    
    function articleItemListDirective() {
        var ddo = {
            templateUrl: "view/component-template/component-articleitemlist.html",
            scope:{
                myArticle:"=",
                view:"@",
                index: "@",
                isBulkEdit: "=",
                addToBulkEditList: "&"
            },
            controller:"articleItemListController",
            controllerAs: "articleitemlist",
            bindToController: true,
            link: function(scope,element,attrs){
                element.on("click",function(){
                    if (scope.articleitemlist.isBulkEdit) { //toggleclass only when bulkedit panel is on
                       element.find(".item-content-list").toggleClass("bulk-edit"); 
                    }
                });
                scope.$watch("articleitemlist.isBulkEdit",function(newvalue,oldvalue){//watch the property of isBlukedit on or off
                    if (newvalue === oldvalue) { return;}
                    if (!newvalue) { //if bulkedit panel is turned off, remove the highlight bg color for each object
                        element.find(".item-content-list").removeClass("bulk-edit");
                    }
                });
            }            
        };
        return ddo;
    };
    
    articleItemListController.$inject = ['localStorageHandling','$scope','$state'];
    
    function articleItemListController(localStorageHandling,$scope,$state) {
        var articleitemlist = this;
        
        articleitemlist.showactionlist = false; //the property to control the show/hide of actionlist 
        
        articleitemlist.deletedialogShown = false; // the initial status of delete dialog
        
        articleitemlist.tagdialogShown = false; //the initial status of tag dialog
        
        articleitemlist.$onInit = function(){
            console.log("debugging...");
            
            articleitemlist.showActionList = function(){ //show the actionlist
                articleitemlist.showactionlist = true;
            };
            articleitemlist.hideActionList = function(){ //hide the actionlist
                articleitemlist.showactionlist = false;
            };
            articleitemlist.click = function(){
                if (articleitemlist.isBulkEdit){ //in bulkedit mode
                    articleitemlist.addToBulkEditList({article:articleitemlist.myArticle, index:articleitemlist.index, view:articleitemlist.view});
                } else {//not in bulkedit mode, go to read state with specific params
                    $state.go('read',{id:articleitemlist.index,view:articleitemlist.view,article:articleitemlist.myArticle});
                }
                
            };
            //call back function of open delete dialog for ng-click event on the delete button in the actionlist
            articleitemlist.openDeleteDialog = function(){
                articleitemlist.deletedialogShown = true; 
            };
            //call back function of close delete dialog for ng-click event on the cancel button in the delete dialog
            articleitemlist.closeDeleteDialog = function(){
                articleitemlist.deletedialogShown = !articleitemlist.deletedialogShown;
            };
            //call back funtion of delete button on the delete dialog
            articleitemlist.deleteArticle = function(){
                localStorageHandling.deleteArticle(articleitemlist.index,articleitemlist.view,articleitemlist.myArticle);
                articleitemlist.deletedialogShown = !articleitemlist.deletedialogShown;
                //emit the delete event message to upper level
                $scope.$emit("delete",{});
            };            
            //call back function of open tag dialog for ng-click event on the tag button in the actionlist
            articleitemlist.openTagDialog = function(){
                articleitemlist.tagdialogShown = true; 
                
            };            
            //add new tag to the article
            articleitemlist.addNewTag = function(){
                localStorageHandling.addTag(articleitemlist.index,articleitemlist.view,articleitemlist.myArticle,articleitemlist.taginput);
                articleitemlist.tagdialogShown = false; 
                articleitemlist.taginput = "";
                //emit the delete event message to upper level
                $scope.$emit("addtag",{});
            };
            //remove tag from the article
            articleitemlist.removeTag = function(tagindex){
                localStorageHandling.removeTag(articleitemlist.index,articleitemlist.view,articleitemlist.myArticle,tagindex);
                $scope.$emit("removetag",{});
            };
        };        
    };
    
    angular
        .module("app")
        .directive("articleItemList",articleItemListDirective)
        .controller("articleItemListController",articleItemListController);
    
})();
(function(){
    
    function articleReviewerDirective(){
        var ddo = {
//            template: function(){
//                console.log("debugging template function...")
//                return '<h2>try template</2>';
//            },
            scope:{
                article:"<"
            },
            controller: "articleReviewerController",
            controllerAs: "reviewer",
            bindToController: true,
            link: function(scope,element,attrs){
                if (scope.reviewer.article){
                     element.html('<div class="article-container"></div>'); //set the container div element for the whole page
                    //var articleObj = JSON.parse(scope.reviewer.article);
                    var header = angular.element('<div class="read-header"></div>');//set up the read-header div
                    var h1 = angular.element('<h1></h1>').html(scope.reviewer.article.title);//set up the h1 element
                    var author = angular.element('<span></span>').html(scope.reviewer.article.author).addClass("author");
                    var date = angular.element('<span></span>').html(scope.reviewer.article.date_published).addClass("date");
                    header.append(h1,author,date);
                    var textbody = angular.element(scope.reviewer.article.content).addClass("read-body");//set up the read-body element

                    element.find(".article-container").append(header).append(textbody);//append the read-header and read-body to parent element                   
                }    
            },
        };
        return ddo;
    };
    
    function articleReviewerController(){
        var reviewer = this;
        reviewer.$onInit = function(){
            console.log("debugging reviewer...")            
        };
    };
    
    angular
        .module("app")
        .directive("articleReviewer",articleReviewerDirective)
        .controller("articleReviewerController",articleReviewerController);
})();
(function(){
    
    function bulkEditPanelDirective(){
        var ddo = {
            templateUrl: "view/component-template/component-bulkeditpanel.html",
            scope: {
                hideBulkPanel:"&",
                view: "@",
                itemNumber:"@",
                bulkArchive:"&",
                bulkFavorite:"&",
                bulkUnfavorite:"&",
                bulkReadd:"&",
                bulkDelete:"&",
                bulkAddTag:"&",
            },
            controller: "bulkEditPanelController",
            controllerAs: "bulk",
            bindToController: true,
        };
        return ddo;
    };
    
    function bulkEditPanelController(){
        var bulk = this;
        bulk.$onInit = function(){
            bulk.bulktagdialogShown = false; //set the initial status of bulk tag panel
            bulk.bulkdeletedialogShown = false; //set the initial status of bulk delete panel
            
            bulk.openBulkTag = function(){
                bulk.bulktagdialogShown = true;
            };
            bulk.click = function(){
                bulk.bulktagdialogShown = false;
                bulk.bulkAddTag({taginput: bulk.taginput});
                bulk.taginput = "";
            };
            bulk.openBulkDelete = function(){
                bulk.bulkdeletedialogShown = true;
            };
            bulk.deleteClick = function(){
                bulk.bulkdeletedialogShown = false;
                bulk.bulkDelete();
            };
            bulk.cancelDelete = function(){
                bulk.bulkdeletedialogShown = false;
            };
        }; 
    };
    angular
        .module("app")
        .directive("bulkEditPanel",bulkEditPanelDirective)
        .controller("bulkEditPanelController",bulkEditPanelController);
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
                    element.find(".tag-container").on("click",function(){
                        element.find(".tag-input").focus();
                    })
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
    
    hamburgerMenuDirective.$inject = ['$rootScope'];
    function hamburgerMenuDirective($rootScope){
        var ddo = {
            templateUrl: "view/component-template/component-hamburgermenu.html",
            controller:"hamburgerMenuController",
            controllerAs: "hamburger",
            bindToControler: true,
            link:function(scope,element,attrs){
                $rootScope.$on("openslidingbar",function(event,data){
                    element.find(".sliding-bar").addClass("sliding-bar-in");
                    element.find(".sliding-bar-cover").addClass("sliding-bar-cover-in");
                });                
                element.find(".close-sliding").on("click",function(){
                    closeSlidingBar();
                });
                element.find(".sliding-bar-cover").on("click",function(){
                    closeSlidingBar();
                });
                $rootScope.$on("$stateChangeStart",function(){
                    closeSlidingBar();
                });
                function closeSlidingBar(){
                    element.find(".sliding-bar").removeClass("sliding-bar-in");
                    element.find(".sliding-bar-cover").removeClass("sliding-bar-cover-in");                    
                };
            }
        }; 
        return ddo;
    };
    
    function hamburgerMenuController(){
        var hamburger = this;
        
        hamburger.$onInit = function(){
//            hamburger.shownSlidingBar = false;
//            hamburger.buttonClick = function(){
//                console.log("debugging button click")
//                hamburger.shownSlidingBar = true;
//            };
//            hamburger.closeSlidingBar = function(){
//                hamburger.shownSlidingBar = false;
//            };
        };
        
    };
    
    angular
        .module("app")
        .directive("hamburgerMenu",hamburgerMenuDirective)
        .controller("hamburgerMenuController",hamburgerMenuController);
})();
(function(){
    
    function appHeaderDirective(){
        var ddo = {
            templateUrl:"view/component-template/component-header.html",
            scope : {
                toggleUrldialog: "&",
                openSearchPanel:"&"                
            },
            controller: "appHeaderController",
            controllerAs: "$ctrl",
            bindToController: true
        };
        return ddo;
    };
    
    appHeaderController.$inject = ['$rootScope'];
    function appHeaderController($rootScope){
        var appheader = this;
        appheader.$onInit = function(){
            //call back function on the hamberger button
            appheader.openSlidingBar = function(){
                //broadcast the openslidingbar event to slidingbar component
                $rootScope.$broadcast("openslidingbar",{});
            };            
        };
        //listen to the event for the state change to get the current view name
        $rootScope.$on("$stateChangeSuccess",function(event, toState, toParams, fromState, fromParams, options){
            if (toState.name.split(".").length > 1){
                appheader.viewname =  toState.name.split(".")[1].charAt(0).toUpperCase() + toState.name.split(".")[1].slice(1);
            }
        });
    };
    
    angular
        .module("app")
        .directive("appHeader",appHeaderDirective)
        .controller("appHeaderController",appHeaderController);
    
})();
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
        };
    };
    
    angular
        .module("app")
        .directive("headerListview",headerListviewDirective)
        .controller("headerListviewController",headerListviewController)
    
})();
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
(function(){
    angular
        .module("app")
        .component("leftSidebar",{
            templateUrl:"view/component-template/component-leftsidebar.html"
        })
})();
(function(){
    
    function searchpaneldirective(){
        var ddo = {
            templateUrl: "view/component-template/component-searchpanel.html",
            scope: {
                closeSearchPanel: "&",
            },
            controller: "searchpanelcontroller",
            controllerAs: "search",
            bindToController: true,
        };
        return ddo;
    };
    
    searchpanelcontroller.$inject = ['searchhandling','$rootScope','changeListStyle','$scope'];
    
    function searchpanelcontroller(searchhandling,$rootScope,changeListStyle,$scope){
        var search = this; 
        search.currentView = 'My List'; // set the initial value for property currentView to mylist
        search.viewName = 'mylist';
        search.filterFavoriteOn = false; // set the initial value for the property of filterFavoriteon
        search.isTileStyle = changeListStyle.getCurrentStyle(); // the initial value for this property
        search.articlelist = [];
        search.$onInit = function(){
            search.searchResult = function(){
                search.articlelist = searchhandling.searchArticle(search.currentView,search.filterFavoriteOn,search.searchkeyword);
            };
            search.updateSearch = function(){
                search.articlelist = searchhandling.searchArticle(search.currentView,search.filterFavoriteOn,search.searchkeyword);
            };
            search.removeFavoriteFilter = function(){
                search.filterFavoriteOn = false; 
                search.updateSearch();
            };
            search.closeClick = function(){
                search.closeSearchPanel();
                search.searchkeyword = "";
                search.articlelist.length = 0;
                $rootScope.$broadcast("closesearchpanelandupdate",{});
            };
            search.getIndexInOriginalList = function(article){
                return searchhandling.getOriginalIndex(search.viewName,article);
            };
        };
        //listen to the router event to get current viewname 
        $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
            var result = searchhandling.filterViewName(toState.name);
            search.currentView = result[0];
            search.viewName = result[1];
            search.filterFavoriteOn = result[2];
            
        });
        //listen to event of changeliststyle 
        $rootScope.$on('changeliststyle',function(event,data){
            search.isTileStyle = data.currentStatus;
        });
        //listen to the backtolist event message to update the archive view
        $scope.$on('backtolist',function(event,data){
            search.updateSearch(); //update the articlelist
        });
        //listen to the archive event message to update the list view
        $scope.$on('archive',function(event,data){
            search.updateSearch(); //update the articlelist; 
        });    
        //listen to the togglefavorite event message to update the list view
        $scope.$on('togglefavorite',function(event,data){
            search.updateSearch(); //update the articlelist; 
        });         
    };
    
    angular
        .module("app")
        .directive("searchPanel",searchpaneldirective)
        .controller("searchpanelcontroller",searchpanelcontroller);
})();
(function(){
    
    angular
        .module('app')
        .component('loadingSpinner',{
            templateUrl: "view/component-template/component-spinner.html",
            controller: SpinnerController
        });
    
    SpinnerController.$inject = ['$rootScope']
    
    function SpinnerController($rootScope){
        var spinner = this;
        spinner.$onInit = function(){
            spinner.spinnerShown = false;
        }
        var cancel = $rootScope.$on('spinner:activate',function(event,data){
            if (data.on){
                spinner.spinnerShown = true;
            } else {
                spinner.spinnerShown = false;
            }
        });
        
        spinner.$onDestroy = function(){
            cancel();
        }
    }
    
})();
(function(){

    toastMessageDirective.$inject = ['$rootScope','$timeout'];
    function toastMessageDirective($rootScope,$timeout){
        var ddo = {
            templateUrl: "view/component-template/component-toast.html",
            scope:{},
            controller: "toastMessageController",
            controllerAs: "toast",
            bindToController: true,
            link: function(scope,element){
                $rootScope.$on("toastmessage",function(event,data){
                    scope.toast.toastShown = true;
                    scope.toast.message = data.message;
                    element.find("#toast").addClass("show");
                    $timeout(function(){
                        scope.toast.toastShown = false;
                        element.find("#toast").removeClass("show");
                    },2900)
                })               
            }
            
        };
        return ddo;
    };
    
    //toastMessageController.$inject = ['$rootScope']
    function toastMessageController($rootScope){
        var toast = this;
        
        toast.$onInit = function(){
            
            toast.toastShown = false;

            toast.message = "";  
            
        };
    }
    
    
    angular
        .module("app")
        .directive("toastMessage",toastMessageDirective)
        .controller("toastMessageController",toastMessageController);
})();
(function(){
    archiveCtrl.$inject = ['currentarchive','$scope','localStorageHandling','changeListStyle','currentstyle','bulkedithandling','$rootScope'];
    
    function archiveCtrl(currentarchive,$scope,localStorageHandling,changeListStyle,currentstyle,bulkedithandling,$rootScope){
        var archive = this;
        
        archive.isTileStyle = currentstyle; 
        
        archive.articlelist = currentarchive; //get resolved currentarchive
        
        archive.isBulkPanelOn = false; // the initial status of showbulkpanel property
        
        archive.bulkEditList = []; //the article list for storaging the selected article in bulk edit mode
        
        //listen to the backtolist event message to update the archive view
        $scope.$on('backtolist',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });
        //listen to the togglefavorite event message to update the archive view
        $scope.$on('togglefavorite',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });  
        //listen to the delete event message to update the list view 
        $scope.$on('delete',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the archivelist
        });
        //listen to the add tag event message to update the list view 
        $scope.$on('addtag',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
        });       
        //listen to the remove tag event message to update the list view 
        $scope.$on('removetag',function(event,data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
        });  
        //listen to the close search panel and update event
        $rootScope.$on('closesearchpanelandupdate',function(event, data){
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
        });
        //call back function for ng-click on swtich list style button
        archive.changeListStyle = function(status){
            changeListStyle.changeStyle(status);
            archive.isTileStyle = changeListStyle.getCurrentStyle();
            $rootScope.$broadcast("changeliststyle",{currentStatus: status});
        };          
        //call back function for ng-click on open bulk panel button
        archive.openBulkEditPanel = function(){ 
            archive.bulkEditList.length = 0;
            archive.isBulkPanelOn = true;
        };        
        //call back function for ng-click on close bulk panel button
        archive.closeBulkEditPanel = function(){
            archive.isBulkPanelOn = false;
            archive.bulkEditList.length = 0;
        };  
        //call back function for addtoBulkEditList function for each article item object
        archive.addRemoveBulkEdit = function(article, index, view){
            console.log("inside list controller...")
            var obj = {
                article: article,
                index: index,
                view: view
            };
            //call buldedithandling service to update list
            archive.bulkEditList = bulkedithandling.updateBulkList(archive.bulkEditList, obj);
        };    
        //callback function for archive button on the bulkedit panel
        archive.bulkReadd = function(){
            bulkedithandling.reAdd(archive.bulkEditList);//call the bulkedithanlding service function
            archive.isBulkPanelOn = false; // update the status of showbulkpanel property
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: archive.bulkEditList.length + " Item Added to List"});             
        };
        //callback function for favorite button on the bulkedit panel
        archive.bulkFavorite = function(){
            bulkedithandling.favorite(archive.bulkEditList);
            archive.isBulkPanelOn = false; // update the status of showbulkpanel property
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: archive.bulkEditList.length + " Item Favorited"});             
        };
        //callback function for delete button on the bulkedit panel
        archive.bulkDelete = function(){
            bulkedithandling.Delete(archive.bulkEditList);
            archive.isBulkPanelOn = false; // update the status of showbulkpanel property
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist  
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: archive.bulkEditList.length + " Item Deleted"});              
        };
        //callback function for bulk addtag button on the bulkedit panel
        archive.bulkAddTag = function(taginput){
            bulkedithandling.AddTag(archive.bulkEditList,taginput);
            archive.isBulkPanelOn = false; // update the status of showbulkpanel property
            archive.articlelist = localStorageHandling.getCurrentArchive(); //update the currentlist    
        };          
    };
    
    angular
        .module("app")
        .controller("archiveCtrl",archiveCtrl);
})();
(function(){
    favoriteCtrl.$inject = ['currentfavorite','$scope','localStorageHandling','changeListStyle','currentstyle','bulkedithandling','$rootScope'];
    function favoriteCtrl(currentfavorite,$scope,localStorageHandling,changeListStyle,currentstyle,bulkedithandling,$rootScope){
        var favorite = this;
        
        favorite.isTileStyle = currentstyle; 
        
        favorite.articlelist = currentfavorite; //get resolved currentlist
        
        favorite.isBulkPanelOn = false; // the initial status of showbulkpanel property
        
        favorite.bulkEditList = []; //the article list for storaging the selected article in bulk edit mode
        
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
        //listen to the delete event message to update the list view 
        $scope.$on('delete',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the archivelist
        }); 
        //listen to the add tag event message to update the list view 
        $scope.$on('addtag',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
        });       
        //listen to the remove tag event message to update the list view 
        $scope.$on('removetag',function(event,data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
        }); 
        //listen to the close search panel and update event
        $rootScope.$on('closesearchpanelandupdate',function(event, data){
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
        });        
        //call back function for ng-click on swtich list style button
        favorite.changeListStyle = function(status){
            changeListStyle.changeStyle(status);
            favorite.isTileStyle = changeListStyle.getCurrentStyle();
            $rootScope.$broadcast("changeliststyle",{currentStatus: status});
        }; 
        //call back function for ng-click on open bulk panel button
        favorite.openBulkEditPanel = function(){ 
            favorite.bulkEditList.length = 0;
            favorite.isBulkPanelOn = true;
        };        
        //call back function for ng-click on close bulk panel button
        favorite.closeBulkEditPanel = function(){
            favorite.isBulkPanelOn = false;
            favorite.bulkEditList.length = 0;
        };  
        //call back function for addtoBulkEditList function for each article item object
        favorite.addRemoveBulkEdit = function(article, index, view){
            console.log("inside list controller...")
            var obj = {
                article: article,
                index: index,
                view: view
            };
            //call buldedithandling service to update list
            favorite.bulkEditList = bulkedithandling.updateBulkList(favorite.bulkEditList, obj);
        };
        //callback function for archive button on the bulkedit panel
        favorite.bulkArchive = function(){
            bulkedithandling.archive(favorite.bulkEditList);//call the bulkedithanlding service function
            favorite.isBulkPanelOn = false; // update the status of showbulkpanel property
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: favorite.bulkEditList.length + " Item Archived"});            
        };
        //callback function for favorite button on the bulkedit panel
        favorite.bulkUnfavorite = function(){
            bulkedithandling.favorite(favorite.bulkEditList);
            favorite.isBulkPanelOn = false; // update the status of showbulkpanel property
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: favorite.bulkEditList.length + " Item Unfavorited"});             
        }; 
        //callback function for delete button on the bulkedit panel
        favorite.bulkDelete = function(){
            bulkedithandling.Delete(favorite.bulkEditList);
            favorite.isBulkPanelOn = false; // update the status of showbulkpanel property
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist 
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: favorite.bulkEditList.length + " Item Deleted"});            
        };
        //callback function for bulk addtag button on the bulkedit panel
        favorite.bulkAddTag = function(taginput){
            bulkedithandling.AddTag(favorite.bulkEditList,taginput);
            favorite.isBulkPanelOn = false; // update the status of showbulkpanel property
            favorite.articlelist = localStorageHandling.getCurrentFavorite(); //update the currentlist    
        };        
    };
    angular
        .module("app")
        .controller("favoriteCtrl",favoriteCtrl);
})();
(function(){
    listCtrl.$inject = ['$scope','webScraper','currentlist','localStorageHandling','changeListStyle','currentstyle','bulkedithandling','$rootScope'];
    
    function listCtrl($scope,webScraper,currentlist,localStorageHandling,changeListStyle,currentstyle,bulkedithandling,$rootScope){
        
        var list = this;
        
        list.isTileStyle = currentstyle; // get resolved currentstyle
        
        list.articlelist = currentlist; //get resolved currentlist
        
        list.isBulkPanelOn = false; // the initial status of showbulkpanel property
        
        list.bulkEditList = []; //the article list for storaging the selected article in bulk edit mode
        
        //listen to the addNewURL event
        $rootScope.$on('addNewURL',function(event,data){
            //webScraper.addNewArticle(data.url);
            webScraper.addNewArticle(data.url).then(function(){
                var lengthbeforeadd = list.articlelist?list.articlelist.length:0;
                list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
                //broadcase the toastmessage
                var lengthafteradd = list.articlelist.length;
                if (lengthafteradd > lengthbeforeadd) {
                    $rootScope.$broadcast("toastmessage",{message:"Added to List"}); 
                }
                  
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
        //listen to the delete event message to update the list view 
        $scope.$on('delete',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });
        //listen to the add tag event message to update the list view 
        $scope.$on('addtag',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });       
        //listen to the remove tag event message to update the list view 
        $scope.$on('removetag',function(event,data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });    
        //listen to the close search panel and update event
        $rootScope.$on('closesearchpanelandupdate',function(event, data){
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
        });
        //call back function for ng-click on swtich list style button
        list.changeListStyle = function(status){
            //list.isTileStyle = status;
            console.log("debugging firfox...")
            changeListStyle.changeStyle(status);//call the service method
            list.isTileStyle = changeListStyle.getCurrentStyle();
            $rootScope.$broadcast("changeliststyle",{currentStatus: status});//broadcast the event message to archive and favorite
            
        };
        //call back function for ng-click on open bulk panel button
        list.openBulkEditPanel = function(){
            console.log("debugging firfox...");
            list.bulkEditList.length = 0;
            list.isBulkPanelOn = true;
        };
        //call back function for ng-click on close bulk panel button
        list.closeBulkEditPanel = function(){
            list.isBulkPanelOn = false;
            list.bulkEditList.length = 0;
        };
        //call back function for addtoBulkEditList function for each article item object
        list.addRemoveBulkEdit = function(article, index, view){
            var obj = {
                article: article,
                index: index,
                view: view
            };
            //call buldedithandling service to update list
            list.bulkEditList = bulkedithandling.updateBulkList(list.bulkEditList, obj);
        };
        //callback function for archive button on the bulkedit panel
        list.bulkArchive = function(){
            bulkedithandling.archive(list.bulkEditList);//call the bulkedithanlding service function
            list.isBulkPanelOn = false; // update the status of showbulkpanel property
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: list.bulkEditList.length + " Item Archived"});             
            
        };
        //callback function for favorite button on the bulkedit panel
        list.bulkFavorite = function(){
            bulkedithandling.favorite(list.bulkEditList);
            list.isBulkPanelOn = false; // update the status of showbulkpanel property
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: list.bulkEditList.length + " Item Favorited"});            
        };
        //callback function for delete button on the bulkedit panel
        list.bulkDelete = function(){
            bulkedithandling.Delete(list.bulkEditList);
            list.isBulkPanelOn = false; // update the status of showbulkpanel property
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist 
            //broadcase the toastmessage
            $rootScope.$broadcast("toastmessage",{message: list.bulkEditList.length + " Item Deleted"});            
        };
        //callback function for bulk addtag button on the bulkedit panel
        list.bulkAddTag = function(taginput){
            bulkedithandling.AddTag(list.bulkEditList,taginput);
            list.isBulkPanelOn = false; // update the status of showbulkpanel property
            list.articlelist = localStorageHandling.getCurrentList(); //update the currentlist    
        };
        
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
    readCtrl.$inject = ['$stateParams'];
    function readCtrl($stateParams){
        var read = this;
        read.article = $stateParams.article;
    };
    
    angular
        .module("app")
        .controller("readCtrl",readCtrl);
})();
(function(){
    
    topCtrl.$inject = ['$scope','$rootScope'];
    
    function topCtrl($scope,$rootScope){
        var top = this;
        top.dialogShown = false; //inital status of the newURL dialog
        top.searchShown = false; //inital status of the search panel
        
        //the callback function on clicking on the add icon on the header component
        top.toggleDialog = function(){
            top.dialogShown = !top.dialogShown;
        };
        //call back function by clicking the save button on the dialog
        top.addNewURL = function(){
            top.dialogShown = !top.dialogShown;
            //broadcase the addNewURL event to the sublevel main controller
            $rootScope.$broadcast('addNewURL',{
                url:top.newURL
            });         
            top.newURL = "";
        };
        //the callback function on clicking on the search icon on the header component
        top.openSearchPanel = function(){
            top.searchShown = true;
        };
        //the callback function on clicking on the close button on the search panel
        top.closeSearchPanel = function(){
            top.searchShown = false;
        };
    }
    
    angular
        .module("app")
        .controller("topCtrl",topCtrl);
})();
(function(){
    
    loadingHttpInterceptor.$inject = ['$rootScope','$q']
    
    function loadingHttpInterceptor($rootScope,$q){
        var loadingCount = 0;
        var loadingEventName = 'spinner:activate';
        
        return {
            request: function(config){
                if (++loadingCount === 1) {
                    $rootScope.$broadcast(loadingEventName, {on: true});
                }
                return config;
            },
            
            response: function(response) {
                if (--loadingCount === 0){
                    $rootScope.$broadcast(loadingEventName, {on: false});
                }
                return response
            },
            
            responseError: function(response){
                if (--loadingCount === 0){ 
                    $rootScope.$broadcast(loadingEventName, {on: false});
                }
                return $q.reject(response);
            }
        };
    }
    
    angular
        .module("app")
        .factory('loadingHttpInterceptor',loadingHttpInterceptor);
})();
(function(){
    bulkedithandling.$inject = ['localStorageHandling'];
    
    function bulkedithandling(localStorageHandling){
        
        var bulk = this;
        bulk.updateBulkList = function(bulklist, obj) {
            var index = bulk.checkExist(bulklist, obj)
            if (index === -1) {
                bulklist.push(obj);
            } else {
               bulklist.splice(index,1);
            }
            return bulklist;
        };
        
        bulk.checkExist = function(bulklist, obj){
            for (var i = 0 ; i < bulklist.length; i++){
                if (bulklist[i].article.url === obj.article.url) {
                    return i;
                }
            }
            return -1;
        };
        
        bulk.archive = function(bulklist){
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});
            //loop through the  list and archive each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.archive(eacharticle.index,eacharticle.view,eacharticle.article);
            });
        };
        bulk.favorite = function(bulklist){
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});
            //loop through the  list and favorite each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.toggleFavorite(eacharticle.index,eacharticle.view,eacharticle.article)
            });
            
        };
        bulk.reAdd = function(bulklist){
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});  
            //loop through the  list and favorite each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.backToList(eacharticle.index,eacharticle.view,eacharticle.article)
            });
        };
        bulk.Delete = function(bulklist) {
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});
            //loop through the  list and delete each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.deleteArticle(eacharticle.index,eacharticle.view,eacharticle.article)
            });            
        };
        bulk.AddTag = function(bulklist,taginput){
            //sort the bulklist by the index in reverse order
            bulklist.sort(function(a,b){return b.index - a.index});  
            //loop through the  list and add tag each of them by calling the localstoragehandling service
            bulklist.forEach(function(eacharticle){
                localStorageHandling.addTag(eacharticle.index,eacharticle.view,eacharticle.article,taginput)
            });             
        };
    }
    
    angular
        .module("app")
        .service("bulkedithandling",bulkedithandling);
})();
(function(){
    
    changeListStyle.$inject = ['localStorageService'];

    function changeListStyle(localStorageService){
        var style = this;
        style.changeStyle = function(status){
            localStorageService.set("isTileStyle",status);
        };
        style.getCurrentStyle = function(){
            if (localStorageService.get("isTileStyle") == null){
                localStorageService.set("isTileStyle",true);
            }            
            return localStorageService.get("isTileStyle");
        };
        
    };
    
    angular
        .module("app")
        .service("changeListStyle",changeListStyle);
})();
(function(){
    
    localStorageHandling.$inject = ['localStorageService','$rootScope'];
    function localStorageHandling(localStorageService,$rootScope){
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
            if (getArticleIndex(currentlocal,obj.url) === -1 ) {// the obj doesn't exsit yet
                currentlocal.push(obj);
                localStorageService.set(key,currentlocal);                 
            } else {
                $rootScope.$broadcast('toastmessage',{message:'The article already exsit'});
            }
           
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
                if (!localStorageService.get('localfavorite')) {localStorageService.set('localfavorite',[])}
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
        
        local.deleteArticle = function(index,view,article){
            
            if ( view === "mylist" ){ //delete from mylist view
                local.removeFromLocalStorage("locallist",index);
                if (article.isFavorite){// this article is favorited one
                    var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                    if (indexInFavorite >= 0) {local.removeFromLocalStorage("localfavorite",indexInFavorite);}
                }
            } else if (view === "archive" ) { //delete from archive view
                local.removeFromLocalStorage("localarchive",index);
                if (article.isFavorite){// this article is favorited one
                    var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                    if (indexInFavorite >= 0) {local.removeFromLocalStorage("localfavorite",indexInFavorite);}
                }                
            } else { //delete from favorite view
                local.removeFromLocalStorage("localfavorite",index);
                var indexInListorArchive = -1;
                var keyname = "";
                if (article.isArchive){ //this article is in archive list
                    keyname = "localarchive";
                    indexInListorArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);
                } else { // this article is in mylist 
                    keyname = "locallist";
                    indexInListorArchive = getArticleIndex(localStorageService.get('locallist'),article.url);
                }
                if (indexInListorArchive >= 0){local.removeFromLocalStorage(keyname,indexInListorArchive);};
            }
            
            
        };
        
        local.addTag = function(index,view,article,tag){
            if (view === "favorites") { //add tag to article in favorite view
                local.addTagtoLocalObj('localfavorite',index,tag);
                var indexInListorArchive = -1;
                var keyname = "";                
                if (article.isArchive) {
                    keyname = "localarchive";
                    indexInListorArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);
                } else {
                    keyname = "locallist";
                    indexInListorArchive = getArticleIndex(localStorageService.get('locallist'),article.url);                    
                }
                local.addTagtoLocalObj(keyname,indexInListorArchive,tag);
                
            } else { 
                if (view === "mylist"){ //add tag to article in mylist view
                    local.addTagtoLocalObj('locallist',index,tag);
                } else { //add tag to article in archive view
                   local.addTagtoLocalObj('localarchive',index,tag);
                }
                //handle the corresponding favorite one if exist
                if (article.isFavorite) {
                    var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                    local.addTagtoLocalObj('localfavorite',indexInFavorite,tag);
                }
            }
        };
        local.addTagtoLocalObj = function(key,index,tag){
            var currentobj = localStorageService.get(key);
            currentobj[index]['tags'].push(tag);
            localStorageService.set(key,currentobj);            
        };
        local.removeTagfromLocalObj = function(key,index,tagindex){
            var currentobj = localStorageService.get(key);
            currentobj[index]['tags'].splice(tagindex,1);
            localStorageService.set(key,currentobj);            
        };
        local.removeTag = function(index,view,article,tagindex){
            if (view === "favorites") {
                local.removeTagfromLocalObj('localfavorite',index,tagindex);
                var indexInListorArchive = -1;
                var keyname = "";                 
                if (article.isArchive) {
                    keyname = "localarchive";
                    indexInListorArchive = getArticleIndex(localStorageService.get('localarchive'),article.url);                   
                } else {
                    keyname = "locallist";
                    indexInListorArchive = getArticleIndex(localStorageService.get('locallist'),article.url);                    
                }
                local.removeTagfromLocalObj(keyname,indexInListorArchive,tagindex);
            } else {
                var key = "";
                if (view === "mylist"){ 
                    key = "locallist";
                } else {
                    key = "localarchive";
                }
                local.removeTagfromLocalObj(key,index,tagindex);
                //handle the corresponding favorite one if exist
                if (article.isFavorite) {
                    var indexInFavorite = getArticleIndex(localStorageService.get('localfavorite'),article.url);
                    local.removeTagfromLocalObj('localfavorite',indexInFavorite,tagindex);
                }
            }
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
    searchhandling.$inject = ['localStorageService'];
    
    function searchhandling(localStorageService){
        var search = this;
        
        search.searchArticle = function(view,filterFavorite,keyword){
            console.log("debugging in the search service...")
            var key = "";
            if (view === "My List") {
                key = "locallist";
            } else if (view === "Archive"){
                key = "localarchive";
            } 
            var result = search.searchInLocal(key,filterFavorite,keyword);
            return result;
        };
        search.searchInLocal = function(key,filterFavorite,keyword){
            var matchlist = [];
            var totallist = localStorageService.get(key);
            if (keyword !== "") {
                totallist.forEach(function(each){
                    if (each.title.toLowerCase().search(keyword) >=0) {
                        matchlist.push(each);
                    }                        

                });   
                if (filterFavorite) { // filter favorite one
                    matchlist = matchlist.filter(function(each){
                        return each.isFavorite;
                    });
                }    
            };

            return matchlist;
        };
        search.filterViewName = function(name){
            var result = "";
            var filterFavoriteOn = false;
            var viewname = "";
            if (name === "main.mylist") {
                result = "My List";
                viewname = "mylist";
            } else if (name === "main.archive"){
                result = "Archive";
                viewname = "archive";
            } else if (name === "main.favorite"){
                result = "My List";
                viewname = "mylist";
                filterFavoriteOn = true;
            }
            return [result,viewname,filterFavoriteOn];
        };
        search.getOriginalIndex = function(key,article){
            var keyname = "";
            if (key === 'mylist') {
                keyname = 'locallist';
            } else {
                keyname = 'localarchive';
            }
            return getArticleIndex(localStorageService.get(keyname),article.url);
        };
    }
    
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
        .service("searchhandling",searchhandling);
})();
(function(){
    
    webScraper.$inject =["$http","MercuryAPIPath","localStorageHandling","localStorageService"];
    
    function webScraper($http,MercuryAPIPath,localStorageHandling,localStorageService){
        var webscraper = this;
        var articlelist = [];
        
        webscraper.addNewArticle = function(url){
            var newurl = MercuryAPIPath + url;
            return $http.get(newurl , {
                headers: {"x-api-key": "M1USTPmJMiRjtbjFNkNap9Z8M5XBb1aEQVXoxS5I"} 
            }).then(function(response){
                var newArticle = response.data;
                console.log(newArticle);
                newArticle.isArchive = false; //add isArchive property to article obj
                newArticle.isFavorite = false; //add isFavorite property to article obj
                newArticle.tags = [];// add tags property to article obj
                articlelist.push(newArticle)
                //add to local storage
                localStorageHandling.addtoLocalList(newArticle);                   

            },function(error){
                alert("Can't Fetch the HTML Data based on the URL. " + " response status: " + error.status);
            });
        };
        
    };
    angular
        .module("app")
        .service("webScraper",webScraper);
})();