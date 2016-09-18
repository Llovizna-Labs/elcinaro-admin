(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .directive('footerDirective', footerDirective);

    /* @ngInject */
    function footerDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'assets/views/footer/footer.html',
            controller: footerController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    footerController.$inject = [];

    /* @ngInject */
    function footerController() {
        var vm = this;

        activate();

        function activate() {
          console.log('footer Activated');
        }
    }
})();
