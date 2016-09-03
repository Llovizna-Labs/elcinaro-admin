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
            templateUrl: 'assets/views/dashboard/index.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.content', {
        url: '/content',
        views: {
          'dashboard': {
            controller: 'DashboardController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/content.html'
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
      })
      .state('login', {
        url: '/login',
        views: {
          'main': {
            controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/login.html'
          }
        },
        authenticate: false
      });

    $urlRouterProvider.otherwise('/');
  }

})();
