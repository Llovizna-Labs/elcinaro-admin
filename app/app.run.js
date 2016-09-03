(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .run(runProvider);

  runProvider.$inject = ['$rootScope', 'Auth'];

  function runProvider($rootScope, Auth) {

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      /**
       * if the state does not requires authentication and the
       * user is logged in, redirect to the dashboard page.
       */
      if (!toState.authenticate && Auth.isAuthenticated()) {
        event.preventDefault();
        $state.transitionTo('dashboard');
      }

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
