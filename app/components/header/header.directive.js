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

  headerController.$inject = ['Auth', '$scope','$rootScope'];

  /* @ngInject */
  function headerController(Auth, $scope, $rootScope) {
    var vm = this;

    ////////////////

    vm.logout = function() {
      console.log('LOGOUT');
      Auth.logout();
    };


    $rootScope.$on('login', function(event, user) {
      if(!$rootScope.user) {
        angular.copy(user, $rootScope.user)
      }
      console.log('login', $rootScope.user);
    });
  }
})();
