(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .directive('ecaAction', directive);

    /* @ngInject */
    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'assets/views/eca-action/eca-action.html',
            scope: {
              meta: '=',
              data: '='
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

    Controller.$inject = ['_','$http', '$insumos', '$util'];

    /* @ngInject */
    function Controller(_,$http, $insumos, $util) {
        var vm = this;
        vm._ = _;
        
        vm.insumos = [];

        vm.medidas = $util.getUnidades();

        vm.query = {
          order: '-id',
          limit: 100,
          page: 1,
          filter: ''
        };

        activate();

        function activate() {
          console.log('eca-action');
          console.log(vm.meta);

          getInsumos();
        }

        function getInsumos() {
          $insumos.getInsumos(vm.query).then(function(resp) {
            vm.insumos = resp.results;
          })
        }
    }
})();
