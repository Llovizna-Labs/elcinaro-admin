(function() {
  'use strict';

  angular
    .module('devion-stack-angular')
    .config(routerProvider);

  routerProvider.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function routerProvider($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/',
        views: {
          'main': {
            controller: 'HomeController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/home.html'
          }
        },
        authenticate: false
      });

    $urlRouterProvider.otherwise('/');
  }

})();
