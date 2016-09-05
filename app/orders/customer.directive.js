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

  Controller.$inject = ['$http', '$q', '$rootScope', 'Auth'];

  /* @ngInject */
  function Controller($http, $q, $rootScope, Auth) {
    var vm = this;
    vm.nextTab =  nextTab;
    activate();

    function activate() {

    }

     function nextTab() {
      vm.control.tabs[3].valid = true;   
      vm.control.selectedTab += 1;
    }

    vm.auth = function() {
      console.log('LOGIN', vm.form.auth);
      vm.loading = true;
      Auth.login(vm.form.auth).then(function(res) {
        console.log(res);
        nextTab();
      }).catch(function(err) {
        console.log(err);
      }).finally(function() {
        vm.loading = false;
      });
    };
  }
})();
