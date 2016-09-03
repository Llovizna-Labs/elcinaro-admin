(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .config(routerProvider);

  routerProvider.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function routerProvider($stateProvider, $urlRouterProvider, $locationProvider) {
    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: false
    // });
    //
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
      })
      .state('dashboard', {
        url: '/dashboard',
        views: {
          'main': {
            controller: 'DashboardController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard.html'
          }
        },
        authenticate: false
      })
      .state('orders', {
        url: '/orders',
        views: {
          'main': {
            controller: 'OrdersController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/orders.html'
          }
        },
        authenticate: false
      });

    $urlRouterProvider.otherwise('/');
  }

})();
