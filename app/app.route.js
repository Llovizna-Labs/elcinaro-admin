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
        authenticate: true
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
        authenticate: true
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
        authenticate: true
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
        authenticate: true
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
        authenticate: true
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
        authenticate: true
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
        authenticate: true
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
        authenticate: true
      })
      .state('dashboard.users', {
        url: '/users/:id',
        views: {
          'dashboard': {
            controller: 'AdminController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/admin.html'
          }
        },
        authenticate: true
      })
      .state('dashboard.proovedores', {
        url: '/proovedores/:id',
        views: {
          'dashboard': {
            controller: 'ProovedoresController',
            controllerAs: 'vm',
            templateUrl: 'assets/views/dashboard/proovedores.html'
          }
        },
        authenticate: true
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

    $urlRouterProvider.otherwise('/login');
  }

})();
