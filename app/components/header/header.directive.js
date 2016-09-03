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
      bindToController: true,
      scope: {}
    };

    return directive;
  }

  headerController.$inject = ['Auth'];

  /* @ngInject */
  function headerController(Auth) {
    console.log('PRUEBA');
    var vm = this;

    ////////////////

    vm.logout = function() {
        console.log('LOGOUT');
        Auth.logout();
    };

  }
})();
