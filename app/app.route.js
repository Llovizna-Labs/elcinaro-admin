(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .config(routerProvider);

  routerProvider.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function routerProvider($stateProvider, $urlRouterProvider, $locationProvider) {
    // $locationProvider.html5Mode({
    //   enabled: false,
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
      .state('dashboard.profile', {
        url: '/profile',
        views: {
          'dashboard': {
            controller: 'ProfileController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/profile.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.home', {
        url: '/home/',
        views: {
          'dashboard': {
            controller: 'HomeDashboardController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/home.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.actividades', {
        url: '/actividades/',
        views: {
          'dashboard': {
            controller: 'ActividadController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/seguimiento/actividad.tmpl.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.rubros', {
        url: '/rubros/:id',
        views: {
          'dashboard': {
            controller: 'SemillasController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/rubros.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.cultivos', {
        url: '/cultivos/:id',
        views: {
          'dashboard': {
            controller: 'CultivosController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/cultivos.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.semillas', {
        url: '/semillas/:id',
        views: {
          'dashboard': {
            controller: 'SemillasController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/semillas.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.lotes', {
        url: '/lotes/:id',
        views: {
          'dashboard': {
            controller: 'LotesController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/lotes.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.suelos', {
        url: '/suelos/:id',
        views: {
          'dashboard': {
            controller: 'SuelosController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/suelos.html'
          }
        },
        authenticate: false
      })
      .state('dashboard.clientes', {
        url: '/clientes/:id',
        views: {
          'dashboard': {
            controller: 'ClientesController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/clientes.html'
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
