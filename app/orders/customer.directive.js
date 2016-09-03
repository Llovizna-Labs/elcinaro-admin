(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .directive('adbOrdersCustomer', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/orders/orders.customer.html',
      scope: {
        options: '=',
        form: '=',
        total: '=',
        control: '='
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

  Controller.$inject = ['$http', '$q'];

  /* @ngInject */
  function Controller($http, $q) {
    var vm = this;

    activate();

    function activate() {

    }

    vm.nextTab = function() {
      vm.control.selectedTab += 1;
    }
  }
})();
