(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .run(runProvider);

  runProvider.$inject = ['$rootScope', '$state', 'Auth'];

  function runProvider($rootScope, $state, Auth) {
    $rootScope.$state = $state;
    $rootScope.user = Auth.getUser();

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      $rootScope.fill = ['login', 'dashboard', 'dashboard.campaigns'].indexOf(toState.name) !== -1;

      /**
       * if the state requires authentication and the
       * user is not logged in, redirect to the login page.
       */
      if (toState.authenticate && !Auth.isAuthenticated()) {
        event.preventDefault();
        $state.transitionTo('login');
      }

    });
  }
})();
