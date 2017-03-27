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