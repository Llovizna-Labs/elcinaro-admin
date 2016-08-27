(function() {
    'use strict';

    angular
        .module('AnyDayBuddyAds')
        .directive('headerDirective', headerDirective);

    /* @ngInject */
    function headerDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'assets/views/header/header.html',
            controller: headerController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    headerController.$inject = [];

    /* @ngInject */
    function headerController() {
        var vm = this;

        activate();

        function activate() {
          console.log('header Activated');
        }
    }
})();
