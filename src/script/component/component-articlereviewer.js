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