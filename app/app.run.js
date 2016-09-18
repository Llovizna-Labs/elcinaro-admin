(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .run(runProvider);

  runProvider.$inject = ['$rootScope', '$state', 'Auth'];

  function runProvider($rootScope, $state, Auth) {
    $rootScope.$state = $state;
    // if (Auth.isAuthenticated()) $rootScope.user = Auth.getUser();
    //
    // $rootScope.$on('$stateChangeStart', function(event, toState) {
    //   $rootScope.fill = ['login'].indexOf(toState.name) !== -1;
    //   $rootScope.fixed = ['dashboard', 'dashboard.campaigns', 'dashboard.profile'].indexOf(toState.name) !== -1;
    //
    //   /**
    //    * if the state requires authentication and the
    //    * user is not logged in, redirect to the login page.
    //    */
    //   if (toState.authenticate && !Auth.isAuthenticated()) {
    //     event.preventDefault();
    //     $state.transitionTo('login');
    //   }
    //
    // });
  }
})();
