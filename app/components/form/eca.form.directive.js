(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .directive('ecaForm', directive);

    /* @ngInject */
    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'assets/views/form/form.html',
            scope: {
              meta: '=',
              form: '=?ngModel',
              options: '=?'
            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = ['$scope', '_'];

    /* @ngInject */
    function Controller($scope, _) {
        var vm = this;

        activate();

        function activate() {
          vm.action = !vm.form.hasOwnProperty('id') ? vm.meta.handlers[0] : vm.meta.handlers[1];
        }


        $scope.$watch('vm.options', function(c,o) {
          vm.action = !vm.form.hasOwnProperty('id') ? vm.meta.handlers[0] : vm.meta.handlers[1];
        }, true);
    }
})();
