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
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

  Controller.$inject = ['$http', '$q', '$rootScope', '$mdDialog', 'Auth'];

  /* @ngInject */
  function Controller($http, $q, $rootScope, $mdDialog, Auth) {
    var vm = this;
    vm.nextTab = nextTab;

    function nextTab() {
      vm.control.tabs[3].valid = true;
      vm.control.selectedTab += 1;
    }

    vm.auth = function() {
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

    vm.signup = function() {
      $mdDialog.show({
        fullscreen: true,
        controllerAs: 'vm',
        controller: 'SignupController',
        templateUrl: 'assets/views/modal/signup.html',
      }).then(function () {
        nextTab();
      });
    };

  }
})();
