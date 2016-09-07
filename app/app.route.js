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
        authenticate: true
      })
      .state('dashboard.profile', {
        url: '/profile',
        views: {
          'dashboard': {
            controller: 'ProfileController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/profile.html'
          }
        },
        authenticate: true
      })
      .state('dashboard.campaigns', {
        url: '/campaigns/:id',
        views: {
          'dashboard': {
            controller: 'CampaignController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/campaigns.html'
          }
        },
        authenticate: true
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
