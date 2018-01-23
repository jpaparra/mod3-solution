(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com');

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var controller = this;

        var promise = MenuSearchService.getMatchedMenuItems();
        controller.searchTerm = '';
        controller.found = [];

        promise.then(function (result) {
            controller.found = result.data['menu_items'];
        });

        controller.narrowIt = function () {
            controller.found = controller.found.filter(function(item) {
                return item.description.indexOf(controller.searchTerm) > -1;
            });
        }

        controller.removeFound = function (index) {
            controller.found.splice(index, 1);
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function () {
            return $http({
                method: 'GET',
                url: ApiBasePath + '/menu_items.json'
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'controller',
            bindToController: true
        };

        return ddo;
    }

    function MenuItem(id, description, large_portion_name, name, price_large, price_small, short_name, small_portion_name) {
        this.id = id;
        this.description = description;
        this.largePortionName = largePortionName;
        this.name = name;
        this.priceLarge = price_large;
        this.priceSmall = price_small;
        this.shortName = short_name;
        this.smallPortionName = small_portion_name;
    }

})();