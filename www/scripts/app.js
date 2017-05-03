/**
 * @ngdoc overview
 * @name ElCinaroAdmin
 * @requires ui.router
 * @description
 *
 * AngularJS basic app template
 *
 */
(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin', [
      'ui.router',
      'ngMaterial',
      'uiGmapgoogle-maps',
      'md.data.table',
      'angularMoment',
      'moment-picker',
      'angular-loading-bar'
    ]);

})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .constant('_', window._)
    .constant('jQuery', window.jQuery)
    .constant('Dropzone', window.Dropzone)
    .constant('braintree', window.braintree)
    .constant('moment', window.moment)
    //.constant('baseApi', 'http://localhost:8000');
    .constant('baseApi', 'https://elcinaro-backend.herokuapp.com');
})();

(function() {
  'use strict';
  angular
    .module('ElCinaroAdmin')
    .config(config)
    .config(corsProvider)
    .config(iconProvider)
    .config(mapsProvider)
    .config(dateProvider)
    .config(configHTTPResponses);

  corsProvider.$inject = ['$httpProvider'];

  function corsProvider($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
  }


  mapsProvider.$inject = ['uiGmapGoogleMapApiProvider'];

  function mapsProvider(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyAonFuCDb7HjXUz0uocKbEGUJz91IL9EVs', //adb-site-0 key
      // key: 'AIzaSyAlW6hun7VwpFPv0fx_KOUh52l08BRpjYM',
      libraries: 'places'
    });
  }

  iconProvider.$inject = ['$mdIconProvider'];

  function iconProvider($mdIconProvider) {
    // Configure URLs for icons specified by [set:]id.
    $mdIconProvider
      .fontSet('farm', 'farm-icons') // This sets our default fontset className.
      .icon('compost', 'assets/images/icons/icon-compost.svg') // Register a specific icon (by name)
      .icon('spade', 'assets/images/icons/icon-spade.svg'); // Register icon in a specific set
  }

  dateProvider.$inject = ['$mdDateLocaleProvider']

  function dateProvider($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date)
        .format('YYYY-MM-DD');
    };

    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'DD-MM-YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  }


  function config($mdThemingProvider, $locationProvider) {
    $mdThemingProvider.definePalette('primary', {
      '50': '#3ea34c',
      '100': '#379143',
      '200': '#307e3b',
      '300': '#296c32',
      '400': '#22592a',
      '500': '1B4721',
      '600': '#143518',
      '700': '#0d2210',
      '800': '#061007',
      '900': '#000000',
      'A100': '#45b655',
      'A200': '#56bf64',
      'A400': '#68c675',
      'A700': '#000000',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 A100 A200'
    });
    $mdThemingProvider.definePalette('accent', {
      '50': '#1c3216',
      '100': '#25441d',
      '200': '#2f5625',
      '300': '#39682d',
      '400': '#427935',
      '500': '#4c8b3c',
      '600': '#60af4c',
      '700': '#6eb85c',
      '800': '#7ec06d',
      '900': '#8ec87f',
      'A100': '#60af4c',
      'A200': '569D44',
      'A400': '#4c8b3c',
      'A700': '#9ecf91',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200'
    });
    $mdThemingProvider.definePalette('warn', {
      '50': '#fbcba3',
      '100': '#fabd8b',
      '200': '#f9af72',
      '300': '#f8a15a',
      '400': '#f79341',
      '500': 'F68529',
      '600': '#f57711',
      '700': '#e26b0a',
      '800': '#ca5f09',
      '900': '#b25407',
      'A100': '#fcd9bc',
      'A200': '#fde7d4',
      'A400': '#fef5ed',
      'A700': '#994806',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': '50 100 200 300 A100 A200'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('primary')
      .accentPalette('accent')
      .warnPalette('warn');
  }

  // Configure the $httpProvider by adding our date transformer

  function configHTTPResponses($httpProvider) {

    function convertDateStringsToDates(input) {
      // Ignore things that aren't objects.
      if (typeof input !== "object") return input;

      var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

      for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
          // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
          var milliseconds = Date.parse(match[0]);
          if (!isNaN(milliseconds)) {
            input[key] = new Date(milliseconds);
          }
        } else if (typeof value === "object") {
          // Recurse into object
          convertDateStringsToDates(value);
        }
      }
    }
    
    $httpProvider.defaults.transformResponse.push(function(responseData) {
      convertDateStringsToDates(responseData);
      return responseData;
    });
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .run(runProvider);

  runProvider.$inject = ['$rootScope', '$state', 'Auth' ,'amMoment'];

  function runProvider($rootScope, $state, Auth, amMoment) {
    $rootScope.$state = $state;

    amMoment.changeLocale('es');
    
    console.log('is authenticated', Auth.isAuthenticated());

    if (Auth.isAuthenticated()) $rootScope.user = Auth.getUser();

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      $rootScope.fill = ['login'].indexOf(toState.name) !== -1;
      $rootScope.fixed = ['dashboard', 'dashboard.profile'].indexOf(toState.name) !== -1;

      /**
       * if the state requires authentication and the
       * user is not logged in, redirect to the login page.
       */
      if (toState.authenticate && !Auth.isAuthenticated()) {
        event.preventDefault();
        $state.transitionTo('login');
      }

      /**
       * if the state doesnt require authentication and the user is
       * logged in, redirect to dashboard
       */

      if(!toState.authenticate && Auth.isAuthenticated()) {
        event.preventDefault();
        $state.transitionTo('dashboard');
      }

    });
  }
})();

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
            templateUrl: 'home.html'
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
            templateUrl: 'dashboard.html'
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
            templateUrl: 'profile.html'
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
            templateUrl: 'home.html'
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
            templateUrl: 'actividad.tmpl.html'
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
            templateUrl: 'cultivos.html'
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
            templateUrl: 'semillas.html'
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
            templateUrl: 'suelos.html'
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
            templateUrl: 'clientes.html'
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
            templateUrl: 'admin.html'
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
            templateUrl: 'proovedores.html'
          }
        },
        authenticate: true
      })
      .state('dashboard.insumos', {
        url: '/insumos/:id',
        views: {
          'dashboard': {
            controller: 'InsumosController',
            controllerAs: 'vm',
            templateUrl: 'insumos.html'
          }
        },
        authenticate: true
      })
      .state('dashboard.plagas', {
        url: '/plagas/:id',
        views: {
          'dashboard': {
            controller: 'PlagasController',
            controllerAs: 'vm',
            templateUrl: 'plagas.html'
          }
        },
        authenticate: true
      })
      .state('dashboard.cosechas', {
        url: '/cosechas/:id',
        views: {
          'dashboard': {
            controller: 'CosechasController',
            controllerAs: 'vm',
            templateUrl: 'cosechas.html'
          }
        },
        authenticate: true
      })
      .state('dashboard.rubros', {
        url: '/rubros/:id',
        views: {
          'dashboard': {
            controller: 'RubrosController',
            controllerAs: 'vm',
            templateUrl: 'rubros.html'
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
            templateUrl: 'login.html'
          }
        },
        authenticate: false
      });

    $urlRouterProvider.otherwise('/login');
  }

})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ActividadController', Controller);

  Controller.$inject = ['$http', '$q', '$scope','$siembras'];

  /* @ngInject */
  function Controller($http, $q, $scope, $siembras) {
    var vm = this;

    vm.listReady = false;
    vm.list = [];

    vm.categories = [];
    vm.query = {
      page: 1,
      limit: 100,
      order: '',
      filter: ''
    }

    vm.data = {
      cultivos: {},
      rubros: []
    }

    vm.map = {
      name: 'nombre',
      image: '',
    };


    activate();

    function activate() {
      console.log('Actividad Controller');
      getData();
    }

    function getData() {
      $siembras.getRubros(vm.query).then(function(resp) {
        vm.categories = resp.results;
      }).catch(function(err) {
        console.log(err);
      }).finally(function() {
        vm.listReady = true;
        console.log(vm.categories);
      })
    }
    vm.cancel = function() {
      $mdDialog.$hide();
    }

    $scope.$watch('vm.categories', function (c,o) {
      console.log(c);
    })
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('AdminController', Controller);

  Controller.$inject = ['moment', '$scope', '$http', '$q', '$timeout', '$mdDialog', '$admin', '$pedidos'];

  /* @ngInject */
  function Controller(moment, $scope, $http, $q, $timeout, $mdDialog, $admin, $pedidos) {
    var vm = this;
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.item = [];

    vm.table = {
      title: 'Usuarios',
      search: {
        placeholder: 'nombre, apellido'
      },
      detail: {
        title: function(data) {
          return 'Usuario: ' + data.join(' ');
        }
      }
    }
    vm.query = {
      order: 'id',
      limit: 10,
      page: 1,
      filter: ''
    };


    var fieldsMeta = [{
      name: 'first_name',
      type: 'text',
      icon: 'info'
    }, {
      name: 'last_name',
      type: 'text',
      icon: 'info'
    }, {
      name: 'username',
      type: 'text',
      icon: 'info'
    }, {
      name: 'email',
      type: 'email',
      icon: 'email'
    }, {
      name: 'password',
      type: 'password',
      icon: 'info'
    }, {
      name: 'confirm_password',
      type: 'password',
      icon: 'info'
    }];


    var clientObject = {
      username: '',
      first_name: '',
      last_name: '',
      password: '',
      is_staff: true,
      email: '',
    }


    activate();

    function activate() {
      console.log('Admin  Controller');
      getData();
    }

    vm.resetTable = function() {
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    function success(data) {
      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.item = [];
      vm.promise = $admin.getUsers(vm.query)
        .then(success);
    }


    vm.spawnModal = function(ev, isNew) {

      $mdDialog.show({
          controller: 'ModalController',
          templateUrl: 'assets/views/modals/updateClientModal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          locals: {
            payload: {
              type: 'admin',
              handler: isNew ? 'createUser' : 'updateUser',
              title: isNew ? 'Registrar Usuario' : 'Actualizar Datos Usuario',
              data: !_.isEmpty(vm.item) ? _.mapValues(_.head(vm.item), function(i) {
                return i.hasOwnProperty('id') ? i.id : i;
              }) : clientObject,
              fields: fieldsMeta,
              options: {

              }
            }
          }
        })
        .then(function(answer) {
          if (!answer) return;
          vm.query.order = isNew ? '-created' : '-updated';
          getData();
        }, function() {
          console.log('cancelled');
        });
    }


    vm.spawnDeleteModal = function(ev, id) {

      var confirm = $mdDialog.confirm()
        .title('Esta seguro de eliminar esta informacion?')
        .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
        .ariaLabel('Confirm Dialog')
        .targetEvent(ev)
        .ok('Eliminar')
        .cancel('Cancelar');

      $mdDialog.show(confirm)
        .then(function() {
          return $admin['deleteUsers'](id)
            .then(function(resp) {
              getData();
            })
            .catch(function(err) {
              console.log(err);
            });
        }, function() {
          console.log('cancel');
        });
    }


    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });


    $scope.$watchCollection('vm.item', function(c, o) {
      if (_.isEmpty(c)) return;
    });
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ClientesController', Controller);

  Controller.$inject = ['_', '$pedidos', '$mdDialog'];

  /* @ngInject */
  function Controller(_, $pedidos, $mdDialog) {
    var vm = this;

    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.selected = [];
    vm.item = [];
    vm.table = {
      title: 'Listado de Clientes',
      search: {
        placeholder: 'Nombre, Apellido, etc..'
      }
    }

    vm.query = {
      order: '',
      limit: 10,
      page: 1,
      filter: ''
    };

    var fieldsMeta = [{
      name: 'nombre',
      type: 'text',
      icon: 'perm_identity'
    }, {
      name: 'apellido',
      type: 'text',
      icon: 'perm_identity'
    }, {
      name: 'email',
      type: 'text',
      icon: 'email'
    }, {
      name: 'identification',
      type: 'text',
      icon: 'perm_identity'
    }, {
      name: 'telefono',
      type: 'text',
      icon: 'phone'
    }, {
      name: 'direccion',
      type: 'text',
      icon: 'place'
    }];


    var clientObject = {
      nombre: '',
      apellido: '',
      email: '',
      identification: '',
      direccion: '',
      telefono: '',
    }

    activate();


    function activate() {
      console.log('ClientesController');
      getData();
    }


    vm.logItem = function() {
      console.log(vm.item);
    }

    vm.spawnModal = function(ev, isNew) {
      $mdDialog.show({
          controller: 'ModalController',
          templateUrl: 'assets/views/modals/updateClientModal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          locals: {
            payload: {
              type: 'clientes',
              handler: isNew ? 'createCliente' : 'updateCliente',
              title: isNew ? 'Registrar Cliente' :'Actualizar Datos Cliente',
              data: !_.isEmpty(vm.item) ? _.head(vm.item) : clientObject,
              fields: fieldsMeta
            }
          }
        })
        .then(function(answer) {
          console.log(answer);
          if (!answer) return;
          vm.query.order = isNew ? '-created' : '-updated';
          getData();
        }, function() {
          console.log('cancelled');
        });
    }


    vm.spawnDeleteModal = function(ev, id) {

      var confirm = $mdDialog.confirm()
        .title('Esta seguro de eliminar esta informacion?')
        .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
        .ariaLabel('Confirm Dialog')
        .targetEvent(ev)
        .ok('Eliminar')
        .cancel('Cancelar');

      $mdDialog.show(confirm)
        .then(function() {
          return $pedidos['deleteCliente'](id)
            .then(function(resp) {
              getData();
            })
            .catch(function(err) {
              console.log(err);
            });
        }, function() {
          console.log('cancel');
        });
    }

    function getData() {
      vm.item = [];
      vm.promise = $pedidos.getClientes(vm.query)
        .then(function(resp) {
          vm.data = resp;
        });
    }


  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('CosechasController', Controller);

  Controller.$inject = ['$scope', '$http', '$mdDialog', '$util', '$siembras'];

  /* @ngInject */
  function Controller($scope, $http, $mdDialog, $util, $siembras) {
    var vm = this;

    vm.title = 'Cosechas';

    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.item = [];

    vm.table = {
      title: 'Inventario de Cosechas',
      search: {
        placeholder: 'Nombre'
      },
      detail: {
        title: function(data) {
          return 'Cosecha: ' + data.join(' ');
        }
      }
    }

    vm.query = {
      order: '-updated',
      limit: 10,
      page: 1,
      filter: ''
    };

    var clientObject = {
      fecha_cosecha: new Date(),
      cantidad: '',
      cultivo: '',
      medida: ''
    }

    var fieldsMeta = [{
      placeholder: 'Fecha Cosecha',
      name: 'fecha_cosecha',
      type: 'date',
      icon: 'perm_identity'
    }, {
      name: 'cantidad',
      type: 'number',
      icon: 'perm_identity'
    }, {
      name: 'medida',
      type: 'select',
      icon: 'perm_identity',
      placeholder: 'Medida',
      handler: 'getMedidas',
    }, {
      name: 'cultivo',
      type: 'select',
      icon: 'perm_identity',
      handler: 'getCultivos',
      placeholder: 'Cultivo',

    }];


    activate();

    function activate() {
      console.log('CosechasController');
      getData();
    }



    vm.resetTable = function() {
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    function success(data) {

      _.mapValues(data.results, function(item) {
        item.cultivo = {
          id: item.cultivo,
          nombre: item.cultivo_cosecha
        }

        item.medida = _.find($util.getUnidades(), function(i) {
          return i.id === item.medida;
        })
      });

      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.item = [];
      vm.promise = $siembras.getCosechas(vm.query)
        .then(success);
    }


    vm.spawnModal = function(ev, isNew) {

      $mdDialog.show({
          controller: 'ModalController',
          templateUrl: 'assets/views/modals/updateClientModal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          locals: {
            payload: {
              type: 'cosechas',
              handler: isNew ? 'createCosecha' : 'updateCosecha',
              title: isNew ? 'Registrar Cosecha' : 'Actualizar Datos Cosecha',
              data: !_.isEmpty(vm.item) ? _.mapValues(_.head(vm.item), function(i) {
                return (moment(i, 'YYYY-MM-DD', true)
                  .isValid() ? new Date(i) : i) || (i.hasOwnProperty('id') ? i.id : i);
              }) : clientObject,
              fields: fieldsMeta,
              options: {

              }
            }
          }
        })
        .then(function(answer) {
          if (!answer) return;
          vm.query.order = isNew ? '-created' : '-updated';
          getData();
        }, function() {
          console.log('cancelled');
        });
    }


    vm.spawnDeleteModal = function(ev, id) {

      var confirm = $mdDialog.confirm()
        .title('Esta seguro de eliminar esta informacion?')
        .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
        .ariaLabel('Confirm Dialog')
        .targetEvent(ev)
        .ok('Eliminar')
        .cancel('Cancelar');

      $mdDialog.show(confirm)
        .then(function() {
          return $siembras['deleteCosecha'](vm.item[0])
            .then(function(resp) {
              getData();
            })
            .catch(function(err) {
              console.log(err);
            });
        }, function() {
          console.log('cancel');
        });
    }


    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });


    $scope.$watchCollection('vm.item', function(c, o) {
      if (_.isEmpty(c)) return;
      console.log(c);
    });
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('CultivosController', Controller);

  Controller.$inject = ['_', '$scope', '$http', '$q', '$timeout', '$mdDialog', '$mdBottomSheet', '$mdToast', '$suelos', '$siembras', '$stateParams'];

  /* @ngInject */
  function Controller(_, $scope, $http, $q, $timeout, $mdDialog, $mdBottomSheet,  $mdToast, $suelos, $siembras, $stateParams) {
    var vm = this;
    vm.detail = $stateParams.id ? true : false;
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.selected = [];
    vm.item = [];

    vm.currentTab = 0;

    vm.table = {
      title: 'Listado de Cultivos',
      search: {
        placeholder: 'Rubro, Semilla'
      },
      detail: {
        title: function(data) {
          return 'Cultivo: ' + data.join(' ');
        }
      }
    }
    vm.query = {
      order: 'lote__id',
      limit: 10,
      page: 1,
      filter: ''
    };

    vm.data = {};

    vm.meta = {
      searchForm: {},
      fields: [{
        name: 'lote',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getLotesSiembra',
        placeholder: 'Lote de Siembra',
        mapper: function(item) {
          return item.semilla_lote.map(function(item) {
            return {
              id: item.id,
              nombre: item.display,
              display: item.display
            }
          })
        }
      }, {
        name: 'area_siembra',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getAreasSiembra',
        placeholder: 'Area de Siembra',
        mapper: function(item) {
          return {
            id: item.id,
            nombre: item.nombre,
            type: item.hasOwnProperty('capacidad') ? 'invernadero' : 'parcela'
          }
        },
        checkings: [{
          type: 'required',
          message: 'Debes seleccionar un Area de Siembra'
        }]
      }]
    };

    vm.tabOptions = [{
      title: 'Agregar',
      submitButton: 'Registrar',
      handler: 'createCultivo'
    }, {
      title: 'Detalle',
      submitButton: 'Actualizar',
      handler: 'updateCultivo'
    }];


    //Service binding
    vm.lotes = [];
    vm.areasSiembra = [];
    //

    //Directives Binding
    vm.lotesMeta = {
      placeholder: 'Selecciona un lote de siembra'
    };

    vm.areasMeta = {
      placeholder: 'Seleccione un area de siembra'
    };


    //form binding

    var formTemplate =  {
      lote: null,
      cantidad_plantulas: 0,
      densidad_siembra: 0,
      codigo: '',
      area_siembra: null,
      fecha_siembra: new Date()
    }

    activate();

    function activate() {
      console.log('Cultivos Controller');
      vm.detail ? getItem() : getData();
      vm.detailTab = !vm.detail ? vm.tabOptions[0] : vm.tabOptions[1];

      angular.copy(formTemplate, vm.form);

      // controller meta data
      $q.all([
          $siembras.getLotes({}),
          $suelos.getAreasSiembra({}),
        ])
        .then(function(results) {

          console.log(results);

          vm.lotes = results[0]['results'].map(function(lote) {
            return lote.semilla_lote.map(function(item) {
              return _.merge({ value: item.display.toLowerCase() }, item);
            });
          }).reduce(function(acc, item) {
            return acc.concat(item);
          }, []);
          console.log('lotes resolved', vm.lotes);

          vm.areasSiembra = results[1]['results'].filter(function(item) {
            return item.type === 'invernadero' || item.cultivos_count === 0;
          }).map(function(item) {
            return _.merge({ display: item.nombre, value: item.nombre.toLowerCase() }, item);
          });

          console.log('areasSiembra resolved', vm.areasSiembra);
        });

    }

    function getItem() {
      if (!vm.item) {
        console.log('have to get item');
        return;
      } else {
        vm.item = _.filter($siembras.cultivos, function(item) {
          return item.id === parseInt($stateParams.id);
        });
      }
    }

    vm.resetTable = function() {
      vm.detail = false;
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }


    vm.formIsValid = function() {
      return !_.isEmpty(_.pickBy(vm.form, _.isNull));
    }

    vm.switchTab = function() {
      var data = _.head(vm.item);
      vm.currentTab = 1;

      vm.detailTab = vm.tabOptions[1];
      data.lote = {
        id: data.cultivo_lote.id,
        nombre: data.cultivo_lote.nombre
      };

      angular.copy(data, vm.form);
    }

    vm.showGridBottomSheet = function() {
      $mdBottomSheet.show({
          templateUrl: 'assets/views/bottom-action-bar/bottom-action-bar.html',
          controller: 'ListBottomSheetController',
          clickOutsideToClose: false,
          locals: {
            items: [{
              id: 'add',
              name: 'agregar'
            }, {
              id: 'edit',
              name: 'editar'
            }, {
              id: 'view',
              name: 'ver detalle'
            }]
          }
        })
        .then(function(clickedItem) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('clicked!')
            .position('top right')
            .hideDelay(1500)
          );
        });
    };

    vm.handleForm = function(handler) {

      if (_.isEmpty(vm.form)) return;

      console.log(vm.form);

      var payload = {
        id: vm.form.id || null,
        codigo: vm.form.codigo,
        densidad_siembra: vm.form.densidad_siembra,
        cantidad_plantulas: vm.form.cantidad_plantulas,
        lote: vm.form.cultivo_lote.id,
        fecha_siembra: moment(vm.form.fecha_siembra).format('YYYY-MM-DD'),
        parcela: vm.form.area_siembra.type === 'parcela' ?  vm.form.area_siembra.id :null,
        invernadero: vm.form.area_siembra.type === 'invernadero' ?  vm.form.area_siembra.id :null,
      };

      $siembras[handler](payload)
        .then(function(resp) {
          console.log(resp);
        })
        .catch(function(err) {
          console.log(err);
        })
    }

    vm.spawnDeleteModal = function(ev) {

      if (_.isEmpty(vm.item)) return;

      if (vm.item[0].cosecha_cultivo.length) {
        alertDialog(ev);
      } else {
        confirmDialog(ev);
      }
      //Can delete item, but has to be confirmed
      function confirmDialog(ev) {
        var confirm = $mdDialog.confirm()
          .title('Esta seguro de eliminar esta informacion?')
          .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
          .ariaLabel('Confirm Dialog')
          .targetEvent(ev)
          .ok('Eliminar')
          .cancel('Cancelar');
        $mdDialog.show(confirm)
          .then(function() {
            return $siembras['deleteCultivo'](vm.item[0])
              .then(function(resp) {
                getData();
                vm.item = [];
              })
              .catch(function(err) {
                console.log(err);
              });
          }, function() {
            console.log('cancel');
          });

      }

      //Cannot delete item, has associates.
      function alertDialog(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Este elemento no puede ser eliminado')
          .textContent('Este Lote de siembra posee ' + vm.item[0].cosecha_cultivo.length + ' cosechas asociadas.')
          .ariaLabel('Alert Dialog')
          .ok('Ok')
          .targetEvent(ev)
        );
      }
    }

    function success(data) {
      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.promise = $siembras.getCultivos(vm.query)
        .then(success);
    };

    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;
      if (vm.timeout) $timeout.cancel(vm.timeout);
      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });

    $scope.$watchCollection('vm.item', function(current, original) {
      if (!current) return;
      console.log(current);
    });

    $scope.$watch('vm.currentTab', function(current, original) {
      console.log('currentTab', current);
      if (!current) getData();

      if (!current && !vm.detail) {
        vm.item = [];
        angular.copy(formTemplate, vm.form);
        return;
      }
    });
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('DashboardController', Controller);

  function Controller(_, $http, $q) {
    var vm = this;

    ////////////////
    ///
    ///
    ///
    vm.routes = getNavigationRoutes()

    activate();

    function activate() {
      console.log('DashboardController');
    }


    function getNavigationRoutes() {
      return _.orderBy([{
        link: 'dashboard.home',
        icon: 'grade',
        title: 'Home'
      }, {
        link: 'dashboard.cultivos',
        icon: 'grade',
        title: 'Cultivos'
      }, {
        link: 'dashboard.semillas',
        title: 'Semillas',
        icon: 'grade'
      }, {
        link: 'dashboard.lotes',
        title: 'Lotes de Siembra',
        icon: 'grade'
      }, {
        link: 'dashboard.plagas',
        title: 'Plagas',
        icon: 'grade'
      }, {
        link: 'dashboard.clientes',
        title: 'Clientes',
        icon: 'person_pin'
      }, {
        link: 'dashboard.insumos',
        title: 'Insumos',
        icon: 'grade'
      }, {
        link: 'dashboard.proovedores',
        title: 'Proovedores',
        icon: 'grade'
      }, {
        link: 'dashboard.users',
        title: 'Usuarios',
        icon: 'grade'
      }, {
        link: 'dashboard.suelos',
        title: 'Areas de Siembra',
        icon: 'grade'
      }, {
        link: 'dashboard.rubros',
        title: 'Rubros',
        icon: 'grade'
      },
      {
        link: 'dashboard.cosechas',
        title: 'Cosechas',
        icon: 'grade'
      }], ['title'], ['asc']);
    }

  }

})();

/**
 * @ngdoc controller
 * @name HomeController
 * @requires $rootScope
 * @description
 *
 * Maneja el comportamiento de la vista principal
 *
 */

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('HomeDashboardController', HomeController);

  HomeController.$inject = ['_', '$scope', '$rootScope', '$mdDialog', 'jQuery', '$siembras', '$insumos', '$seguimiento', '$util'];

  /* @ngInject */
  function HomeController(_, $scope, $rootScope, $mdDialog, jQuery, $siembras, $insumos, $seguimiento, $util) {
    var vm = this;

    vm.actions = $util.getActions();

    vm.title = 'HomeDashboardController';
    vm.data = [];
    vm.all = false;
    vm.addActivity = true;
    //chips
    vm.querySearch = querySearch;
    vm.selectedItem = null;
    vm.searchText = null;
    vm.selectedRubros = [];
    vm.selectedActions = [];
    vm.selectedCultivos = [];
    vm.rubros = [];
    vm.cultivos = [];
    vm.insumos = [];
    vm.observations = [];
    vm.toggle = toggle;
    vm.selectCultivo = selectCultivo;
    vm.detailItem = detailItem;
    vm.removeItem = removeItem;
    vm.removeRubro = removeRubro;
    vm.removeAction = removeAction;
    vm.submit = submit;

    vm.query = {
      page: 1,
      limit: 10,
      order: '-fecha_realizacion',
      filter: ''
    }
    activate();

    ////////////////

    function activate() {
      console.log('HomeController');
      getActividades();
      getRubros();
      getInsumos();
    }

    function removeRubro(item) {
      console.log('should remove crops of', item);
    }

    function removeAction(item) {
      console.log('should remove actions', item);

      var filteredResults = _.filter(vm.observations, function(obv) {
        return obv.action != item.name;
      });

      vm.observations = angular.copy(filteredResults);
    }

    function submit() {
      // console.log(vm.observations);
      // console.log(vm.selectedCultivos);
      //var bulk = _.merge(vm.selectedCultivos, _.keyBy(vm.observations, 'selector'));

      var payload = angular.copy(vm.observations);

      var data = _.map(payload, function(i) {
        var item = i;
        item.cultivo = i.cultivo.id;
        if (item.hasOwnProperty('fecha_aplicacion')) {
          item.fecha_aplicacion = moment(i.fecha_aplicacion, 'DD-MM-YYYY HH:mm A', true);
        }
        return item;
      });

      $seguimiento.createActividades(_.groupBy(data, 'selector'))
        .then(function(resp) {
          console.log(resp);
        })
        .catch(function(err) {
          console.log(err);
        })
    }

    function getActividades() {
      $seguimiento.getActividades(vm.query)
        .then(function(resp) {
          console.log(resp);
          vm.data = resp;
        })
        .catch(function(err) {
          console.log(err);
        })
    }

    function getInsumos() {
      $insumos.getInsumos({})
        .then(function(resp) {
          vm.insumos = _.map(resp.results, function(i) {
            return {
              name: i.nombre,
              id: i.id,
              _lowername: _.lowerCase(i.nombre)
            }
          })
        })
        .catch(function(err) {
          console.log(err);
        })
        .finally(function() {

        })
    }

    function getRubros() {
      $siembras.getRubros({
          page: 1,
          limit: 500,
          order: '-nombre',
          filter: ''
        })
        .then(function(resp) {
          vm.rubros = _.map(resp.results, function(i) {
            return {
              name: i.nombre,
              id: i.id,
              _lowername: _.lowerCase(i.nombre)
            }
          })
        })
        .catch(function(err) {

        })
        .finally(function() {

        })
    }

    function getCultivos(query) {
      $siembras.getCultivos(query)
        .then(function(resp) {
          vm.cultivos = _.map(resp.results, function(i) {
            return {
              name: i.codigo,
              description: i.nombre,
              id: i.id,
              _lowername: _.lowerCase(i.nombre),
              selected: false,
              plaguicida: {},
              fertilizacion: {},
              riego: {},
              observaciones: {
                text: 'Observaciones'
              }
            }
          })
        })
        .catch(function(err) {

        })
        .finally(function() {

        })
    }


    function selectCultivo(index, item) {
      vm.cultivos[index].selected = !item.selected;

      var index = _.findIndex(vm.selectedCultivos, function(i) {
        return i.id === item.id;
      });

      if (!item.selected && vm.selectedCultivos[index]) {
        vm.selectedCultivos = vm.selectedCultivos.splice(index, 1);
        console.log('should remove this crops from the list', vm.selectedCultivos[index]);
      } else {
        vm.selectedCultivos.push(item);
      }
    }

    function detailItem(ev, item) {
      if (!_.includes([3, 4, 6], item.type)) return;

      angular.copy(item, $util.item);
      $mdDialog.show({
          controller: 'ActionController',
          controllerAs: 'vm',
          templateUrl: 'assets/views/seguimiento/' + item.template,
          clickOutsideToClose: true,
          fullscreen: true
        })
        .then(function(answer) {

        }, function() {
          console.log('cancelled');
        });
    };

    function removeItem(event, index) {
      console.log(index);
      index--;
      if (index === -1) {
        return vm.observations.shift();
      } else {
        return vm.observations.splice(index, 1);
      }
    }

    function toggle(value) {
      if (!value) {
        _.map(vm.cultivos, function(item, index) {
          item.selected = false;
        });
        vm.selectedCultivos = [];
        return;
      }
      _.map(vm.cultivos, function(item, index) {
        selectCultivo(index, item);
      });
    }

    /**
     * Search utils.
     */
    function querySearch(data, query) {
      var results = query ? data.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item._lowername.indexOf(lowercaseQuery) === 0);
      };

    }


    $scope.$watch('vm.data', function(current, original) {
      if (!current) return;
      var temp = _.groupBy(vm.data.results, function(o) {
        return moment(moment(o.fecha_realizacion)
            .startOf('day'))
          .format();
      });
      vm.formattedData = temp;
    });

    function draftObservation(cultivo, action) {
      var options = {
        riego: 'Se aplico riego rutinario',
        desmalezamiento: 'se aplicado desmalezamiento en el area',
        fertilizacion: 'Se aplico fertilizacion en el cultivo',
        plaguicida: 'Se aplico plaguicida en el cultivo',
        limpieza: 'Se aplico limpieza en el area'
      }

      console.log(vm.observations, vm.selectedActions, vm.selectedCultivos);


      var actions = action ? action: vm.selectedActions;
      var cultivos = cultivo ? cultivo: vm.selectedCultivos;
      var content = _.map(actions, function(action, index) {
        return _.map(cultivos, function(item) {
          return {
            text: item.description,
            content: options[angular.lowercase(action.name)],
            type: action.id,
            template: action.template,
            selector: angular.lowercase(action.name),
            cultivo: item,
            action: action.name,
            actividad: action.id
          };
        });
      });

      console.log(content);

      vm.observations = [].concat.apply(vm.observations, content );
    }

    $scope.$watchCollection('vm.selectedRubros', function(current, original) {
      if (!current.length) return;

      var query = _.map(current, function(i) {
          return i.name;
        })
        .join(',');

      getCultivos({
        page: 1,
        limit: 10,
        order: 'fecha_siembra',
        filter: query
      });
    });

    $scope.$watchCollection('vm.selectedActions', function(current, original) {
      if (!current.length || current.length === original.length || current.length < original.length) return;
      console.log('action added', current);
      draftObservation(null, current.slice(current.length - 1));
    });

    $scope.$watchCollection('vm.selectedCultivos', function(current, original) {
      if (!current.length || current.length === original.length || current.length < original.length) return;
      draftObservation(current.slice(current.length - 1), null);
    });

    $scope.$watchCollection('vm.observations', function(current, original) {
      console.log( 'observations', current);
    }, true);

    $scope.$watchCollection('vm.info', function(current, original) {
      console.log(current);
    }, true);
  }
})();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('InsumosController', Controller);

    Controller.$inject = ['$scope','$http', '$mdDialog', '$insumos'];

    /* @ngInject */
    function Controller($scope, $http, $mdDialog, $insumos) {
        var vm = this;

        vm.title = 'Insumos';

        vm.getData = getData;
        vm.toggleSearch = false;
        vm.timeout = false;
        vm.item = [];

        vm.table = {
          title: 'Inventario de Insumos',
          search: {
            placeholder: 'Nombre'
          },
          detail: {
            title: function(data) {
              return 'Insumo: ' + data.join(' ');
            }
          }
        }

        vm.query = {
          order: '-updated',
          limit: 10,
          page: 1,
          filter: ''
        };

        var clientObject = {
          nombre: '',
          codigo: '',
          cantidad: '',
          proovedor: '',
          medida: ''
        }

        var fieldsMeta = [{
          name: 'nombre',
          type: 'text',
          icon: 'perm_identity'
        },
        {
          name: 'codigo',
          type: 'text',
          icon: 'perm_identity'
        },
        {
          name: 'cantidad',
          type: 'number',
          icon: 'perm_identity'
        },
        {
          name: 'medida',
          type: 'select',
          icon: 'perm_identity',
          placeholder: 'Medida',
          handler: 'getMedidas',
        },
        {
         name: 'proovedor',
         type: 'select',
         icon: 'perm_identity',
         handler: 'getProovedores',
         placeholder: 'Proovedor'
       }];


        activate();

        function activate() {
          console.log('InsumosController');
          getData();
        }



        vm.resetTable = function() {
          vm.toggleSearch = false;
          vm.query.filter = '';
          getData();
        }

        function success(data) {
          console.log(data);
          vm.data = data;
        }

        function getData() {
          vm.item = [];
          vm.promise = $insumos.getInsumos(vm.query)
            .then(success);
        }


        vm.spawnModal = function(ev, isNew) {

          $mdDialog.show({
              controller: 'ModalController',
              templateUrl: 'assets/views/modals/updateClientModal.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false,
              fullscreen: true,
              locals: {
                payload: {
                  type: 'insumos',
                  handler: isNew ? 'createInsumos' : 'updateInsumos',
                  title: isNew ? 'Registrar Insumo' : 'Actualizar Datos Insumo',
                  data: !_.isEmpty(vm.item) ? _.mapValues(_.head(vm.item), function(i) {
                    return i.hasOwnProperty('id') ? i.id : i;
                  }) : clientObject,
                  fields: fieldsMeta,
                  options: {

                  }
                }
              }
            })
            .then(function(answer) {
              if (!answer) return;
              vm.query.order = isNew ? '-created' : '-updated';
              getData();
            }, function() {
              console.log('cancelled');
            });
        }


        vm.spawnDeleteModal = function(ev, id) {

          var confirm = $mdDialog.confirm()
            .title('Esta seguro de eliminar esta informacion?')
            .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
            .ariaLabel('Confirm Dialog')
            .targetEvent(ev)
            .ok('Eliminar')
            .cancel('Cancelar');

          $mdDialog.show(confirm)
            .then(function() {
              return $insumos['deleteInsumos'](id)
                .then(function(resp) {
                  getData();
                })
                .catch(function(err) {
                  console.log(err);
                });
            }, function() {
              console.log('cancel');
            });
        }


        $scope.$watch('vm.query.filter', function(current, original) {
          if (!current) return;

          if (vm.timeout) $timeout.cancel(vm.timeout);

          vm.timeout = $timeout(function() {
            getData();
          }, 500); // delay 500 ms
        });


        $scope.$watchCollection('vm.item', function(c, o) {
          if (_.isEmpty(c)) return;
        });
    }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('LotesController', Controller);

  Controller.$inject = ['_', '$scope', '$http', '$q', '$timeout', '$siembras', '$stateParams', '$mdDialog'];

  /* @ngInject */
  function Controller(_, $scope, $http, $q, $timeout, $siembras, $stateParams, $mdDialog) {
    var vm = this;
    vm.detail = $stateParams.id ? true : false;

    //Service binding
    vm.semillas = [];
    vm.rubros = [];
    vm.proveedores = [];
    //

    //Directives Binding
    vm.semillasMeta = {
      placeholder: 'Selecciona semilla'
    };

    vm.rubrosMeta = {
      placeholder: 'Seleccione un rubro'
    };

    vm.proveedorMeta = {
      placeholder: 'Seleccione un proveedor'
    };
    //
    //Local Binding
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.selected = [];
    vm.item = [];
    vm.table = {
      title: 'Listado',
      search: {
        placeholder: 'Rubro, Semilla'
      },
      detail: {
        title: function(data) {
          return 'Lote Siembra: ' + data.join(' ');
        }
      }
    }
    vm.query = {
      order: '-fecha_enviado',
      limit: 10,
      page: 1,
      filter: ''
    };

    var loteDetailObject = {
      fecha_enviado: moment().format('YYYY-MM-DD'),
      fecha_recibido: moment().format('YYYY-MM-DD'),
      cantidad_semillas_enviadas: 0,
      cantidad_plantulas_recibidas: 0,
      semilla_utilizada: null,
      germinado: true
    }

    var formTemplate =  {
      lote: {
        codigo: '',
        rubro: null,
        fecha_enviado: new Date()
      },
      dataset: [{
        cantidad_semillas_enviadas: 0,
        cantidad_plantulas_recibidas: 0
      }]
    };

    var fieldsMeta = [{
      placeholder: 'Fecha Enviado',
      name: 'fecha_enviado',
      type: 'date',
    }, {
      placeholder: 'Fecha Recibido',
      name: 'fecha_recibido',
      type: 'date',
    }, {
      name: 'cantidad_semillas_enviadas',
      type: 'number',
      icon: 'perm_identity',
      placeholder: 'Cantidad Semillas Enviadas'
    }, {
      name: 'cantidad_semillas_recibidas',
      type: 'number',
      icon: 'perm_identity',
      placeholder: 'Cantidad Semillas Recibidas'
    }, {
      name: 'semilla_utilizada',
      type: 'select',
      icon: 'perm_identity',
      handler: 'getSemillas',
      placeholder: 'Semilla'
    }, {
      name: 'proovedor',
      type: 'select',
      icon: 'perm_identity',
      handler: 'getProovedores',
      placeholder: 'Proovedor'
    }, {
      name: 'germinado',
      type: 'switch',
      placeholder: 'Germinado'
    }];

    vm.currentTab = 0;

    vm.tabOptions = [{
      title: 'Agregar',
      submitButton: 'Registrar',
      rubro: 'Registrar rubro',
      handler: 'createLoteSiembra'
    }, {
      title: 'Detalle',
      submitButton: 'Actualizar',
      handler: 'updateLoteSiembra'
    }];

    vm.form = {
      fecha_enviado: new Date(),
      fecha_recibido: new Date(),
      germinado: true,
      cantidad_plantulas_recibidas: 0,
      cantidad_semillas_enviadas: 0
    }

    vm.multiform = {};

    activate();

    function activate() {
      console.log('Lotes Controller');
      vm.detail ? getItem() : getData();
      vm.detailTab = !vm.detail ? vm.tabOptions[0] : vm.tabOptions[1];


      // controller meta data
      $q.all([
          $siembras.getSemillas({}),
          $siembras.getRubros({}),
          $siembras.getProovedores({ categoria: 'germinador' })
        ])
        .then(function(results) {
          console.log('semillas resolved');
          vm.semillas = results[0]['results'].map(function(semilla) {
            return _.merge({ display: semilla.nombre, value: semilla.nombre.toLowerCase() }, semilla);
          });

          console.log('rubros resolved');
          vm.rubros = results[1]['results'].map(function(rubro) {
            return _.merge({ display: rubro.nombre, value: rubro.nombre.toLowerCase() }, rubro);
          });

          console.log('proveedores resolved');
          vm.proveedores = results[2]['results'].map(function(prov) {
            return _.merge({ display: prov.nombre, value: prov.nombre.toLowerCase() }, prov);
          });
        })
    }


    vm.resetTable = function() {
      vm.detail = false;
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    vm.switchTab = function() {
      console.log('switching tab', vm.item);
      vm.currentTab = 1;
      var lote = _.head(vm.item);

      var incomingData = {
        lote: _.merge(lote, {
          rubro: {
            id: lote.rubro,
            display: lote.rubro_lote || ''
          },
          proveedor: {
            id: lote.proveedor || 5,
            display: lote.proveedor_lote || ''
          }
        }),
        dataset: lote.semilla_lote
      }

      angular.copy(incomingData, vm.multiform);

      vm.detailTab = vm.tabOptions[1];

    }

    vm.attachLote = function() {
      vm.multiform.dataset.push({
        cantidad_semillas_enviadas: 0,
        cantidad_plantulas_recibidas: 0
      });
    }

    vm.sendForm = function() {
      console.log(vm.multiform);

      //FORMATTING
      var payload = {
        id: vm.multiform.lote.id || null,
        codigo: vm.multiform.lote.codigo,
        rubro: vm.multiform.lote.rubro.id,
        proovedor: vm.multiform.lote.proveedor.id,
        fecha_enviado: moment(vm.multiform.lote.fecha_enviado).format('YYYY-MM-DD'),
        semilla_lote: vm.multiform.dataset.map(function(item) {
          return _.merge(item, { semilla_utilizada: item.semilla.id });
        })
      };

      console.log(payload);
      var method = payload.id ? 'updateLoteSiembra': 'createLoteSiembra';
      $siembras[method](payload).then(function(resp) {
        console.log(resp);
      }).catch(function(err) {
        console.log(err)
      })
    }

    function handleForm(meta, form) {

      form['fecha_enviado'] = moment(form['fecha_enviado'])
        .format('YYYY-MM-DD');

      form['fecha_recibido'] = moment(form['fecha_enviado'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(form, function(o) {
        return _.isObject(o) && !moment(o, 'YYYY-MM-DD')
          .isValid() ? o.id : o;
      });


      $siembras[meta.handler](query)
        .then(function(resp) {
          console.log(resp);
        })
        .catch(function(err) {
          console.log(err);
        })
    }



    vm.spawnDeleteModal = function(ev) {

      if (_.isEmpty(vm.item)) return;

      if (vm.item[0].cultivos_count) {
        alertDialog(ev);
      } else {
        confirmDialog(ev);
      }
      //Can delete item, but has to be confirmed
      function confirmDialog(ev) {
        var confirm = $mdDialog.confirm()
          .title('Esta seguro de eliminar esta informacion?')
          .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
          .ariaLabel('Confirm Dialog')
          .targetEvent(ev)
          .ok('Eliminar')
          .cancel('Cancelar');
        $mdDialog.show(confirm)
          .then(function() {
            return $siembras['deleteLoteSiembra'](vm.item[0])
              .then(function(resp) {
                getData();
              })
              .catch(function(err) {
                console.log(err);
              });
          }, function() {
            console.log('cancel');
          });

      }

      //Cannot delete item, has associates.
      function alertDialog(ev) {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Este elemento no puede ser eliminado')
          .textContent('Este Lote de siembra posee ' + vm.item[0].cultivos_count + ' cultivos asociados.')
          .ariaLabel('Alert Dialog')
          .ok('Ok')
          .targetEvent(ev)
        );
      }
    }

    function success(data) {
      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.promise = $siembras.getLotes(vm.query)
        .then(success);
    };

    function validateFunc() {
      return true;
    }

    function getItem() {
      if (!vm.item) {
        console.log('have to get item');
        return;
      } else {
        vm.item = _.filter($siembras.cultivos, function(item) {
          return item.id === parseInt($stateParams.id);
        });
      }
    }


    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });


    $scope.$watch('vm.currentTab', function(c, o) {
      //vm.detailTab = !vm.form.hasOwnProperty('id') ? vm.tabOptions[0] : vm.tabOptions[1];
      console.log('current tab', c);
      if (!c) getData();
      if (c && !vm.item.length) angular.copy(formTemplate, vm.multiform);
      if (c) vm.item = [];
    });
  }
})();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('PlagasController', Controller);

    Controller.$inject = ['$scope','$http', '$mdDialog', '$plagas'];

    /* @ngInject */
    function Controller($scope, $http, $mdDialog, $plagas) {
        var vm = this;

        vm.title = 'Plagas';

        vm.getData = getData;
        vm.toggleSearch = false;
        vm.timeout = false;
        vm.item = [];

        vm.table = {
          title: 'Inventario de Plagas',
          search: {
            placeholder: 'Nombre'
          },
          detail: {
            title: function(data) {
              return 'Plaga: ' + data.join(' ');
            }
          }
        }

        vm.query = {
          order: '-updated',
          limit: 10,
          page: 1,
          filter: ''
        };

        var clientObject = {
          nombre: '',
          codigo: '',
          cantidad: '',
          proovedor: '',
          medida: ''
        }

        var fieldsMeta = [{
          name: 'nombre',
          type: 'text',
          icon: 'perm_identity'
        },
        {
          name: 'descripcion',
          type: 'text',
          icon: 'perm_identity'
        }];


        activate();

        function activate() {
          console.log('PlagasController');
          getData();
        }



        vm.resetTable = function() {
          vm.toggleSearch = false;
          vm.query.filter = '';
          getData();
        }

        function success(data) {
          console.log(data);
          vm.data = data;
        }

        function getData() {
          vm.item = [];
          vm.promise = $plagas.getPlagas(vm.query)
            .then(success);
        }


        vm.spawnModal = function(ev, isNew) {

          $mdDialog.show({
              controller: 'ModalController',
              templateUrl: 'assets/views/modals/updateClientModal.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false,
              fullscreen: true,
              locals: {
                payload: {
                  type: 'plagas',
                  handler: isNew ? 'createPlagas' : 'updatePlagas',
                  title: isNew ? 'Registrar Plaga' : 'Actualizar Datos Plaga',
                  data: !_.isEmpty(vm.item) ? _.mapValues(_.head(vm.item), function(i) {
                    return i.hasOwnProperty('id') ? i.id : i;
                  }) : clientObject,
                  fields: fieldsMeta,
                  options: {

                  }
                }
              }
            })
            .then(function(answer) {
              if (!answer) return;
              vm.query.order = isNew ? '-created' : '-updated';
              getData();
            }, function() {
              console.log('cancelled');
            });
        }


        vm.spawnDeleteModal = function(ev, id) {

          var confirm = $mdDialog.confirm()
            .title('Esta seguro de eliminar esta informacion?')
            .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
            .ariaLabel('Confirm Dialog')
            .targetEvent(ev)
            .ok('Eliminar')
            .cancel('Cancelar');

          $mdDialog.show(confirm)
            .then(function() {
              return $plagas['deletePlagas'](id)
                .then(function(resp) {
                  getData();
                })
                .catch(function(err) {
                  console.log(err);
                });
            }, function() {
              console.log('cancel');
            });
        }


        $scope.$watch('vm.query.filter', function(current, original) {
          if (!current) return;

          if (vm.timeout) $timeout.cancel(vm.timeout);

          vm.timeout = $timeout(function() {
            getData();
          }, 500); // delay 500 ms
        });


        $scope.$watchCollection('vm.item', function(c, o) {
          if (_.isEmpty(c)) return;
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('ProovedoresController', Controller);

    Controller.$inject = ['$scope','$http', '$mdDialog', '$siembras', '$proovedores'];

    /* @ngInject */
    function Controller($scope, $http, $mdDialog, $siembras, $proovedores) {
        var vm = this;

        vm.title = 'Proovedores';

        vm.getData = getData;
        vm.toggleSearch = false;
        vm.timeout = false;
        vm.item = [];

        vm.table = {
          title: 'Inventario de Proovedores',
          search: {
            placeholder: 'Nombre'
          },
          detail: {
            title: function(data) {
              return 'Proovedor: ' + data.join(' ');
            }
          }
        }

        vm.query = {
          order: '-updated',
          limit: 10,
          page: 1,
          filter: ''
        };

        var clientObject = {
          nombre: '',
          descripcion: '',
          categoria: '',
          direccion: '',
          telefono: '',
        }

        var fieldsMeta = [{
          name: 'nombre',
          type: 'text',
          icon: 'perm_identity'
        }, {
          name: 'descripcion',
          type: 'text',
          icon: 'perm_identity'
        }, {
          name: 'categoria',
          type: 'select',
          icon: 'perm_identity',
          handler: 'getProovedorCategoria',
          placeholder: 'Categoria'
        }, {
          name: 'telefono',
          type: 'text',
          icon: 'phone'
        }, {
          name: 'direccion',
          type: 'text',
          icon: 'place'
        }];


        activate();

        function activate() {
          console.log('ProovedoresController');
          getData();
        }



        vm.resetTable = function() {
          vm.toggleSearch = false;
          vm.query.filter = '';
          getData();
        }

        function success(data) {
          console.log(data);
          vm.data = data;
        }

        function getData() {
          vm.item = [];
          vm.promise = $siembras.getProovedores(vm.query)
            .then(success);
        }


        vm.spawnModal = function(ev, isNew) {

          $mdDialog.show({
              controller: 'ModalController',
              templateUrl: 'assets/views/modals/updateClientModal.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false,
              fullscreen: true,
              locals: {
                payload: {
                  type: 'proovedores',
                  handler: isNew ? 'createProovedor' : 'updateProovedor',
                  title: isNew ? 'Registrar Proovedor' : 'Actualizar Datos Proovedor',
                  data: !_.isEmpty(vm.item) ? _.mapValues(_.head(vm.item), function(i) {
                    return i.hasOwnProperty('id') ? i.id : i;
                  }) : clientObject,
                  fields: fieldsMeta,
                  options: {

                  }
                }
              }
            })
            .then(function(answer) {
              if (!answer) return;
              vm.query.order = isNew ? '-created' : '-updated';
              getData();
            }, function() {
              console.log('cancelled');
            });
        }


        vm.spawnDeleteModal = function(ev, id) {

          var confirm = $mdDialog.confirm()
            .title('Esta seguro de eliminar esta informacion?')
            .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
            .ariaLabel('Confirm Dialog')
            .targetEvent(ev)
            .ok('Eliminar')
            .cancel('Cancelar');

          $mdDialog.show(confirm)
            .then(function() {
              return $proovedores['deleteProovedor'](id)
                .then(function(resp) {
                  getData();
                })
                .catch(function(err) {
                  console.log(err);
                });
            }, function() {
              console.log('cancel');
            });
        }


        $scope.$watch('vm.query.filter', function(current, original) {
          if (!current) return;

          if (vm.timeout) $timeout.cancel(vm.timeout);

          vm.timeout = $timeout(function() {
            getData();
          }, 500); // delay 500 ms
        });


        $scope.$watchCollection('vm.item', function(c, o) {
          if (_.isEmpty(c)) return;
        });
    }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('RubrosController', Controller);

  Controller.$inject = ['$scope', '$http', '$mdDialog', '$siembras'];

  /* @ngInject */
  function Controller($scope, $http, $mdDialog, $siembras) {
    var vm = this;

    vm.title = 'Rubros';

    vm.getData = getData;
    vm.toggleSearch = false;
    vm.timeout = false;
    vm.item = [];

    vm.table = {
      title: 'Rubros',
      search: {
        placeholder: 'Nombre'
      },
      detail: {
        title: function(data) {
          return 'Rubros: ' + data.join(' ');
        }
      }
    }

    vm.query = {
      order: '-updated',
      limit: 10,
      page: 1,
      filter: ''
    };

    var clientObject = {
      nombre: '',
    }

    var fieldsMeta = [{
      name: 'nombre',
      type: 'text',
      icon: 'perm_identity'
    }];


    activate();

    function activate() {
      console.log('RubrosController');
      getData();
    }



    vm.resetTable = function() {
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    function success(data) {
      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.item = [];
      vm.promise = $siembras.getRubros(vm.query)
        .then(success);
    }


    vm.spawnModal = function(ev, isNew) {

      $mdDialog.show({
          controller: 'ModalController',
          templateUrl: 'assets/views/modals/updateClientModal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          locals: {
            payload: {
              type: 'rubros',
              handler: isNew ? 'createRubro' : 'updateRubro',
              title: isNew ? 'Registrar Rubro' : 'Actualizar Datos Rubro',
              data: !_.isEmpty(vm.item) ? _.mapValues(_.head(vm.item), function(i) {
                return i.hasOwnProperty('id') ? i.id : i;
              }) : clientObject,
              fields: fieldsMeta,
              options: {

              }
            }
          }
        })
        .then(function(answer) {
          if (!answer) return;
          vm.query.order = isNew ? '-created' : '-updated';
          getData();
        }, function() {
          console.log('cancelled');
        });
    }


    vm.spawnDeleteModal = function(ev, id) {

      if (_.isEmpty(vm.item)) return;

      if (vm.item[0].cultivos_count) {
        alertDialog(ev, id);
      } else {
        confirmDialog(ev);
      }
      //Can delete item, but has to be confirmed
      function confirmDialog(ev, id) {
        var confirm = $mdDialog.confirm()
          .title('Esta seguro de eliminar esta informacion?')
          .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
          .ariaLabel('Confirm Dialog')
          .targetEvent(ev)
          .ok('Eliminar')
          .cancel('Cancelar');

        $mdDialog.show(confirm)
          .then(function() {
            return $siembras['deleteRubro'](vm.item[0])
              .then(function(resp) {
                getData();
              })
              .catch(function(err) {
                console.log(err);
              });
          }, function() {
            console.log('cancel');
          });

      }

      //Cannot delete item, has associates.
      function alertDialog(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Este elemento no puede ser eliminado')
          .textContent('Esta area de siembra posee ' + vm.item[0].cultivos_count + ' cultivos asociados.')
          .ariaLabel('Alert Dialog')
          .ok('Ok')
          .targetEvent(ev)
        );
      }
    }


    // $scope.$watch('vm.query.filter', function(current, original) {
    //   if (!current) return;
    //
    //   if (vm.timeout) $timeout.cancel(vm.timeout);
    //
    //   vm.timeout = $timeout(function() {
    //     getData();
    //   }, 500); // delay 500 ms
    // });
    //
    //
    // $scope.$watchCollection('vm.item', function(c, o) {
    //   if (_.isEmpty(c)) return;
    // });
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('SemillasController', Controller);

  Controller.$inject = ['_','moment', '$scope', '$http', '$q', '$timeout', '$mdDialog','$util', '$siembras'];

  /* @ngInject */
  function Controller(_, moment, $scope, $http, $q, $timeout, $mdDialog, $util, $siembras) {
    var vm = this;
    vm.getData = getData;
    vm.toggleSearch = false;
    vm.isUpdating = false;
    vm.timeout = false;
    vm.item = [];

    vm.table = {
      title: 'Inventario de Semillas',
      search: {
        placeholder: 'Rubro, proovedor, descripcion'
      },
      detail: {
        title: function(data) {
          return 'Semilla: ' + data.join(' ');
        }
      }
    }
    vm.query = {
      order: 'nivel_germinacion',
      limit: 10,
      page: 1,
      filter: ''
    };


    var fieldsMeta = [{
      name: 'descripcion',
      type: 'text',
      icon: 'description'
    }, {
      name: 'fecha_compra',
      type: 'date',
      icon: 'today',
      placeholder: 'Fecha Compra'
    }, {
      name: 'precio_compra',
      type: 'number',
      icon: 'attach_money'
    }, {
      name: 'cantidad',
      type: 'number',
      icon: 'info'
    }, {
      name: 'unidad',
      type: 'select',
      icon: 'info',
      handler: 'getUnidades',
      placeholder: 'Unidad'
    }, {
      name: 'familia',
      type: 'select',
      icon: 'text_fields',
      handler: 'getRubros',
      placeholder: 'Rubro',
      map: {
        id: 'id',
        name: 'nombre'
      }
    }, {
      name: 'proovedor',
      type: 'select',
      icon: 'perm_identity',
      handler: 'getProovedores',
      placeholder: 'Proovedor'
    }, {
      name: 'nivel_germinacion',
      type: 'text',
      icon: 'info'
    }];

    vm.meta = {
      searchForm: {},
      fields: [{
        name: 'familia',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getRubros',
        placeholder: 'Seleccione un Rubro',
        repeat: true,
        required: true,
        hasError: false
      },
      {
        name: 'proovedor',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getProovedores',
        placeholder: 'Seleccione un Proovedor',
        repeat: true,
        required: true,
        hasError: false
      },
      {
        name: 'unidad',
        type: 'select',
        icon: 'perm_identity',
        handler: 'getUnidades',
        placeholder: 'Unidad',
        repeat: false,
        hasError: false,
        required: true
      }]
    };

    vm.errors = null;


    //Selector
    vm.metaFieldsByname = _.keyBy(vm.meta.fields, 'name')

    var formTemplate = {
      nivel_germinacion: 0.0,
      cantidad: 0.0,
      precio_compra: 0.0,
      codigo: null,
      fecha_compra: new Date(),
      descripcion: null,
      familia: null,
      proovedor: null,
      unidad: null
    }


    //activate();

    function activate() {
      console.log('Semillas Controller');
      
      vm.item.pop();
      vm.form = formTemplate;
      vm.isUpdating = false;
      getData();

      console.log(vm.metaFieldsByname)
    }

    vm.resetTable = function() {
      vm.toggleSearch = false;
      vm.query.filter = '';
      getData();
    }

    function success(data) {
      console.log(data);
      vm.data = data;
    }

    function getData() {
      vm.promise = $siembras.getSemillas(vm.query)
        .then(success);
    }

    vm.formIsValid = function() {
      return true;
    }


    vm.handleForm = function() {
      console.log(vm.form);
      vm.errors = null;
      vm.loading = true;
      
      var handler = vm.isUpdating ? 'updateSemilla' : 'createSemilla';

      $siembras[handler](vm.form)
        .then(function(resp) {
          console.log(resp);
          vm.item[0] = resp;
        })
        .catch(function(err) {
          console.log(err);
          vm.errors = err;
        }).finally(function(){
          vm.loading = false;
        });
    }

    vm.editItem = function editItem() {
      vm.currentTab = 1;
      vm.isUpdating = true;
      vm.form = _.assign(vm.item[0], {
        familia: {
          id: vm.item[0].familia,
          nombre: vm.item[0].semilla_familia.nombre
        },
        proovedor: {
          id: vm.item[0].proovedor,
          nombre: vm.item[0].semilla_proovedor.nombre
        },
      })
    }

    vm.spawnDeleteModal = function(ev, id) {

      var confirm = $mdDialog.confirm()
        .title('Esta seguro de eliminar esta informacion?')
        .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
        .ariaLabel('Confirm Dialog')
        .targetEvent(ev)
        .ok('Eliminar')
        .cancel('Cancelar');

      $mdDialog.show(confirm)
        .then(function() {
          return $siembras['deleteSemilla']({id: id})
            .then(function(resp) {
              getData();
            })
            .catch(function(err) {
              console.log(err);
          
            }).finally(function(){
              vm.item = [];
            });
        }, function() {
          console.log('cancel');
        });
    }

    $scope.$watch('vm.query.filter', function(current, original) {
      if (!current) return;

      if (vm.timeout) $timeout.cancel(vm.timeout);

      vm.timeout = $timeout(function() {
        getData();
      }, 500); // delay 500 ms
    });

    $scope.$watchCollection('vm.item', function(c, o) {
      if (_.isEmpty(c)) {
        vm.isUpdating = false;
        return;
      }
      vm.isUpdating = true;
    });

    $scope.$watch('vm.form.fecha_compra', function(c, o) {
      if (_.isEmpty(c)) return;
      vm.form['fecha_compra'] = new Date(c);
    });

    $scope.$watch('vm.form', function(c,o) {
      
    }, true);

    $scope.$watch('vm.currentTab', function(c, o) {
      console.log('current tab', c);
      if (c == o) return;
      if (!c) activate();
    });
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('SuelosController', Controller);

  Controller.$inject = ['_', '$http', '$q', '$mdDialog', '$suelos'];

  /* @ngInject */
  function Controller(_, $http, $q, $mdDialog, $suelos) {
    var vm = this;

    vm.query = {
      order: '-id',
      limit: 10,
      page: 1,
      filter: ''
    };

    vm.item = null;

    vm.data = {
      suelos: [],
      invernaderos: [],
    };

    vm.toolbar = {
      title: function(title) {
        return _.join(title, ' ');
      }
    }

    var fieldsMeta = [{
      name: 'codigo',
      type: 'text',
      icon: 'description'
    }, {
      name: 'ubicacion',
      type: 'text',
      icon: 'info'
    }, {
      name: 'ancho_medida',
      type: 'number',
      icon: 'info'
    }, {
      name: 'largo_medida',
      type: 'number',
      icon: 'info'
    }];
    //, {
    //   name: 'tipo',
    //   type: 'select',
    //   icon: 'info',
    //   handler: 'getTipoParcela',
    //   placeholder: 'Tipo'
    // }];

    var invernaderoFieldsMeta = [{
      name: 'nombre',
      type: 'text',
      icon: 'description'
    }, {
      name: 'codigo',
      type: 'text',
      icon: 'description'
    }, {
      name: 'ubicacion',
      type: 'text',
      icon: 'info'
    }, {
      name: 'capacidad',
      type: 'number',
      icon: 'info'
    }];

    var parcelaObject = {
      codigo: '',
      tipo: 3,
      ubicacion: 'El Cinaro',
      largo_medida: 1.0,
      ancho_medida: 2.0,
      capacidad: 0,
    }


    var invernaderoObject = {
      nombre: '',
      codigo: '',
      ubicacion: 'El Cinaro',
      capacidad: 0,
    }

    activate();

    function activate() {
      console.log('Suelos Controller');
      getData();
    }

    function getData() {
      vm.item = null;
      $q.all([$suelos.getParcelas(vm.query), $suelos.getInvernaderos(vm.query)])
        .then(function(response) {
          vm.data.suelos = response[0];
          vm.data.invernaderos = response[1];
        });
    }

    vm.detail = function(detail, handler) {
      vm.item = detail;
      vm.item.handler = handler;
    }

    vm.spawnModal = function(ev, isNew, type) {

      var metaValues = fieldsMeta;
      var plainObj = parcelaObject;

      var options = {
        handler: isNew ? 'createParcela' : 'updateParcela',
        title: isNew ? 'Registrar Parcela' : 'Actualizar Datos Parcela',
      };

      if ((vm.item && vm.item.handler === 'invernaderos') || type === 'invernaderos') {
        options = {
          handler: isNew ? 'createInvernadero' : 'updateInvernadero',
          title: isNew ? 'Registrar Invernadero / Terraza' : 'Actualizar Datos Invernadero / Terraza',
        };
        metaValues = invernaderoFieldsMeta;
        plainObj = invernaderoObject;
      }

      $mdDialog.show({
          controller: 'ModalController',
          templateUrl: 'assets/views/modals/updateClientModal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: true,
          locals: {
            payload: _.merge({
              type: 'suelos'
            }, options, {
              data: !_.isEmpty(vm.item) ? _.mapValues(vm.item, function(i) {
                return i.hasOwnProperty('id') ? i.id : i;
              }) : plainObj,
              fields: metaValues,
              options: {

              }
            })
          }
        })
        .then(function(answer) {
          if (!answer) return;
          vm.query.order = isNew ? '-created' : '-updated';
          getData();
        }, function() {
          console.log('cancelled');
        });
    }


    vm.spawnDeleteModal = function(ev) {

      if (!vm.item) return;

      if (vm.item.cultivos_count) {
        alertDialog(ev);
      } else {
        confirmDialog(ev);
      }
      //Can delete item, but has to be confirmed
      function confirmDialog(ev) {
        var confirm = $mdDialog.confirm()
          .title('Esta seguro de eliminar esta informacion?')
          .textContent('La informacion sera eliminada de la base de datos y no podra ser recuperada')
          .ariaLabel('Confirm Dialog')
          .targetEvent(ev)
          .ok('Eliminar')
          .cancel('Cancelar');

        var handler = vm.item.handler === 'parcelas' ? 'deleteParcela' : 'deleteInvernadero';

        $mdDialog.show(confirm)
          .then(function() {
            return $suelos[handler](vm.item.id)
              .then(function(resp) {
                getData();
              })
              .catch(function(err) {
                console.log(err);
              });
          }, function() {
            console.log('cancel');
          });

      }

      //Cannot delete item, has associates.
      function alertDialog(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Este elemento no puede ser eliminado')
          .textContent('Esta area de siembra posee ' + vm.item.cultivos_count + ' cultivos asociados.')
          .ariaLabel('Alert Dialog')
          .ok('Ok')
          .targetEvent(ev)
        );
      }
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .filter('formatter', filter);

  function filter() {
    return filterFilter

    function filterFilter(params) {
      var opciones = {
        1: 'Desmalezamiento',
        2: 'Riego',
        3: 'Observaciones',
        4: 'Limpieza',
        5: 'Plaguicida',
        6: 'Fertilizacion',
        7: 'Cosecha',
        'crecimientocultivo': 'Crecimiento',
        'insumocultivo': 'Insumo'
      }
      return opciones[params];
    }
  }
})();

/**
 * @ngdoc controller
 * @name HomeController
 * @requires $rootScope
 * @description
 *
 * Maneja el comportamiento de la vista principal
 *
 */

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', 'jQuery', ];

  /* @ngInject */
  function HomeController($rootScope, jQuery) {
    var vm = this;
    vm.title = 'Home Controller';
    vm.scrollTo = scrollTo;
    vm.actividades = [];

    activate();

    ////////////////

    function activate() {
      console.log('HomeController');
    }


    function scrollTo(element) {
      jQuery('html, body').animate({
        scrollTop: jQuery(element).offset().top
      }, 1000);
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$state', 'Auth'];

  function LoginController($state, Auth) {
    var vm = this;
    vm.loading = false;

    ////////////////

    vm.auth = function() {
    	console.log('LOGIN', vm.user);
      vm.loading = true;
      Auth.login(vm.user).then(function(res) {
        console.log(res);
          $state.go('dashboard');
      }).catch(function(err) {
        console.log(err);
      }).finally(function() {
        vm.loading = false;
      });
    };

  }

})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['$rootScope', '$mdDialog', '$scope', 'Auth', '$util'];

  function SignupController($rootScope, $mdDialog, $scope, Auth, $util) {
    var vm = this;
    vm.data = {
      country: null
    };

    vm.loading = false;
    vm.isConfirm = true;
    vm.availability = true;
    vm.countries = $util.getCountries();

    ////////////////

    activate();


    function activate() {
      console.log('signup controller');
    }

    vm.autocompleteCountry = function(query) {
      return autocompleteCountry(query);
    };

    function autocompleteCountry(query) {
      var results = query ? vm.countries.filter(createFilterFor(query)) : vm.countries;
      return results;
    }

    function createFilterFor(query) {
      var capitalizeQuery = _.capitalize(query);
      return function filterFn(country) {
        return (country.name.indexOf(capitalizeQuery) === 0);
      };
    }

    vm.signupAttempt = function() {
      vm.loading = true;
      var country = vm.data.country;
      vm.data.country = country.id;
      Auth.register(vm.data).then(function(res) {
        Auth.setCredentials(res);
        $mdDialog.hide();
      }, function(err) {
        console.log(err);
        vm.error = true;
      }).finally(function() {
        vm.loading = false;
      });
    };


    vm.checkCredentailsAvailability = function(credential) {
      var query = {};
      vm.availability = true;

      if (!vm.data[credential]) return;

      vm.loading = true;
      query[credential] = vm.data[credential];
      Auth.credentialAvaliability(query).then(function(res) {
        vm.availability = res.availability;
        vm.loading = false;
      }, function(err) {
        vm.error = true;
        vm.loading = false;
      });
    };

    vm.compare = function() {
      vm.isConfirm = vm.data.confirmPassword == vm.data.password;
    };


    vm.close = function() {
      $mdDialog.cancel();
    };

    $scope.$watch('vm.data', function(c, o) {
      console.log(c);
    }, true)
  }

})();

(function() {
  'use strict';
  angular
    .module('ElCinaroAdmin')
    .service('CategoryService', CategoryService);

  CategoryService.$inject = ['$http', '$q', 'baseApi'];

  function CategoryService($http, $q, baseApi) {
    var service = {
      categories: [],
      getCategories: getCategories
    };

    return service;

    function getCategories(parent, options) {
      var deferred = $q.defer();

      $http.get(baseApi + '/campaign/categories/', {
          params: {
            country: options.country
          }
        })
        .success(function(res) {
          deferred.resolve(res);
          console.log(res.length);
          angular.copy(res, service.categories);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$admin', factory);

  factory.$inject = ['baseApi', '$http', '$q'];

  /* @ngInject */
  function factory(baseApi, $http, $q) {
    var service = {
      getUsers: getUsers,
      createUser: createUser,
      updateUser: updateUser,
      deleteUsers: deleteUsers
    };

    return service;

    function getUsers(query) {
      var deferred = $q.defer();

      $http.get(baseApi + '/users/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateUser(query) {
      var deferred = $q.defer();
      $http.put(baseApi + '/users/' + query.id + '/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createUser(payload) {
      var deferred = $q.defer();
      $http.post(baseApi + '/users/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteUsers(id) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/users/' + id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('Auth', Auth)
    .factory('AuthInterceptor', AuthInterceptor)
    .config(function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
      $httpProvider.defaults.withCredentials = false;
    });

  Auth.$inject = [
    '_',
    'baseApi',
    '$window',
    '$http',
    '$q',
    '$state',
    '$rootScope',
    '$localstorage'
  ];

  function Auth(_, baseApi, $window, $http, $q, $state, $rootScope, $localstorage) {

    var Auth = {
      getUser: getUser,
      validate: validate,
      isAuthenticated: isAuthenticated,
      login: login,
      logout: logout,
      register: register,
      forgot: forgot,
      reset: reset,
      setCredentials: setCredentials,
      credentialAvaliability: credentialAvaliability
    };

    return Auth;

    ////////////////

    function getUser() {
      return $localstorage.getObject('user', null) || $localstorage.get('access_token', null);
    }

    function validate(token) {
      var deferred = $q.defer();
      $http.post(baseApi + '/auth/validate/' + token)
        .success(function(resp) {
          deferred.resolve(resp);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    /**
     * [login description]
     * @method login
     * @return {[type]} [description]
     */
    function login(credentials) {
      var deferred = $q.defer();

      $http.post(baseApi + '/rest-auth/login/', credentials)
        .success(function(data, status, headers, config) {
          deferred.resolve(data);

          if (data.hasOwnProperty('token')) {

            $rootScope.user = angular.copy(data.user);
            $rootScope.$emit('login', data.user);
            $localstorage.set('access_token', data.token);
            $localstorage.setObject('user', data.user);
          }

          if (data.hasOwnProperty('key')) {
            $localstorage.set('access_token', data.key);
          }
        })
        .error(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    /**
     * [register description]
     * @method register
     * @return {[type]} [description]
     */
    function register(payload) {

      var deferred = $q.defer();

      $http.post(baseApi + '/auth/register', payload)
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    /**
     * [register description]
     * @method reset
     * @return {[type]} [description]
     */
    function reset(token, params) {
      var deferred = $q.defer();

      $http.post(baseApi + '/auth/resetpassword/' + token, params)
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    /**
     * [register description]
     * @method forgot
     * @return {[type]} [description]
     */
    function forgot(payload) {
      var deferred = $q.defer();

      $http.post(baseApi + '/auth/resetPasswordRequest', payload)
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    /**
     * [logout description]
     * @method logout
     * @return {[type]} [description]
     */
    function logout() {
      $localstorage.remove('user');
      $localstorage.remove('access_token');
      $localstorage.remove('original_user');

      $rootScope.isAuthenticated = false;
      $rootScope.user = null;
      $rootScope.view = 'auth';
      $rootScope.currentState = 'login';
      $window.location.reload();
    }

    /**
     * [setCredentials description]
     * @method authenticate
     * @param  {[type]}     user [description]
     * @return {[type]}          [description]
     */
    function setCredentials(data, force) {
      if (data.hasOwnProperty('token')) {
        if (force || !$localstorage.get('access_token')) {
          $localstorage.set('access_token', data.token);
        }
        $rootScope.user = data.user;
        $localstorage.setObject('user', data.user);
      } else {
        console.log('Bad Date', data);
      }
    }


    /**
     * [isAuthenticated description]
     * @method isAuthenticated
     * @return {Boolean}       [description]
     */
    function isAuthenticated() {
      return $localstorage.get('access_token');
    }


    /**
     * [credentialAvaliability description]
     * @method credentialAvaliability
     * @return {[type]}               [description]
     */
    function credentialAvaliability(payload) {
      var deferred = $q.defer();

      $http.get(baseApi + '/user/availability/', {
          params: payload
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }


  /**
   * [AuthInterceptor description]
   * @method AuthInterceptor
   */
  function AuthInterceptor($q, $localstorage, $injector) {

    var AuthInterceptor = {
      request: request,
      responseError: responseError,
      response: response
    };

    return AuthInterceptor;

    function request(config) {
      var token;
      if ($localstorage.get('access_token')) {
        token = $localstorage.get('access_token');
      }
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }

      var actions = ['POST', 'PUT', 'DELETE'];

      if(_.includes(actions, config.method)) {
        console.log('should refactor request', config);
        _.mapValues(config.data, function(item) {
            //if is date
            if(moment(item, 'YYYY-MM-DD', true).isValid()) {
              return moment(item).format('YYYY-MM-DD');
            }

            //if is a object
            if (_.isObject(item) &&  !_.isArray(item)) {
              return _.get(item, 'id', null);
            }

            //otherwise
            return item;
        });

      }
      return config;
    }

    function response(response) {


      var url = _.words(_.get(response, 'config.url', null), /[^/ ]+/g);


      var methodes = {
        'PUT': 'Actualizado',
        'POST': 'Creado',
        'DELETE': 'Eliminado'
      }

      var actions = ['POST', 'PUT', 'DELETE'];
      var responses = ['200', '201', '204'];

      var message = function(action) {
        return 'Registro ' + action + ' exitosamente';
      };

      if (
        _.includes(responses, String(response.status)) &&
        _.includes(actions, response.config.method) &&
        !_.includes(url, 'rest-auth')
      ) {

        $injector.get('$util')
          .showSimpleToast(message(methodes[response.config.method]));
      }

      return response;
    }

    function responseError(response) {
      var options = {
        '400': 'Solicitud Invalida',
        '500': 'Ocurrió un Error en el servidor',
        '502': 'Ocurrió un Error en el servidor',
      }

      if (options.hasOwnProperty(String(response.status))) {
        $injector.get('$util').showSimpleToast(options[String(response.status)]);
      }

      if (response.status === 401 || response.status === 403) {
        $localstorage.remove('access_token');
        $injector.get('$state').go('login');
      }
      return $q.reject(response);
    }

  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .service('DropzoneService', DropzoneService);

  var TYPES = {
    mobile: {
      width: 750,
      height: 100
    },
    desktop: {
      width: 880,
      height: 1156
    }
  };

  function DropzoneService() {
    var service = {
      create: create,
      createMultiple: createMultiple
    };

    return service;

    function create(type, success, sending, removedfile) {
      return {
        options: {
          url: 'https://api.cloudinary.com/v1_1/cloud9/image/upload',
          uploadMultiple: false,
          maxFiles: 1,
          acceptedFiles: 'image/*',
          dictDefaultMessage: 'Drop file or click here to upload',
          addRemoveLinks: true,
          init: function() {
            this.on('thumbnail', function(file) {
              if (file.width !== TYPES[type].width || file.height !== TYPES[type].height) {
                file.rejectDimensions()
              } else {
                file.acceptDimensions();
              }
            });
          },
          accept: function(file, done) {
            file.acceptDimensions = done;
            file.rejectDimensions = function() { done('Invalid dimension.'); };
          }
        },
        eventHandlers: {
          sending: function(file, xhr, formData) {
            formData.append('api_key', 839988333153567);
            formData.append('timestamp', Date.now() / 1000 | 0);
            formData.append('upload_preset', 'sm2ev4nu');
            if (sending) sending();
          },
          success: success,
          removedfile: removedfile
        }
      };
    }

    function createMultiple(maxFiles, success, sending) {
      return {
        options: {
          url: 'https://api.cloudinary.com/v1_1/cloud9/image/upload',
          maxFiles: maxFiles,
          acceptedFiles: 'image/*',
          dictDefaultMessage: 'Drop files or click here to upload'
        },
        eventHandlers: {
          sending: function(file, xhr, formData) {
            formData.append('api_key', 839988333153567);
            formData.append('timestamp', Date.now() / 1000 | 0);
            formData.append('upload_preset', 'sm2ev4nu');
            if (sending) sending();
          },
          success: success
        }
      };
    }
  }

})();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .factory('$insumos', factory);

    factory.$inject = ['baseApi', '$http', '$q'];

    /* @ngInject */
    function factory(baseApi, $http, $q) {
        var service = {
            getInsumos: getInsumos,
            deleteInsumos: deleteInsumos,
            updateInsumos: updateInsumos,
            createInsumos: createInsumos,
            insumos: []
        };

        return service;

        function getInsumos(query) {
          var deferred = $q.defer();
          $http.get(baseApi + '/insumos/', {
              params: {
                page: query.page || 1,
                page_size: query.limit || 50,
                format: 'json',
                ordering: query.order || 'id',
                search: query.filter || ''
              }
            })
            .success(function(data) {
              deferred.resolve(data);
            })
            .error(function(err) {
              deferred.reject(err);
            });
          return deferred.promise;
        }

        function updateInsumos(query) {
          var deferred = $q.defer();
          $http.put(baseApi + '/insumos/' + query.id + '/', query)
            .success(function(data) {
              deferred.resolve(data);
            })
            .error(function(err) {
              deferred.reject(err);
            });
          return deferred.promise;
        }


        function createInsumos(payload) {
          var deferred = $q.defer();
          var query = _.mapValues(payload, function(o) {
            return _.isObject(o) ? o.id : o;
          });
          $http.post(baseApi + '/insumos/', query)
            .success(function(data) {
              deferred.resolve(data);
            })
            .error(function(err) {
              deferred.reject(err);
            });
          return deferred.promise;
        }

        function deleteInsumos(id) {
          var deferred = $q.defer();
          $http.delete(baseApi + '/insumos/' + id + '/' )
            .success(function(data) {
              deferred.resolve(data);
            })
            .error(function(err) {
              deferred.reject(err);
            });
          return deferred.promise;
        }
    }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$localstorage', $localstorage);

  $localstorage.$inject = ['$window'];

  function $localstorage($window) {
    var service = {
      set: set,
      get: get,
      setObject: setObject,
      getObject: getObject,
      remove: remove
    };

    return service;

    //////////

    function set(key, value) {
      $window.localStorage[key] = value;
    }

    function get(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    }

    function setObject(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    }

    function getObject(key, defaultValue) {
      return JSON.parse($window.localStorage[key] || (defaultValue !== undefined ? defaultValue : '{}'));
    }

    function remove(key) {
      return $window.localStorage.removeItem(key);
    }
  }
})();

(function() {
    'use strict';

    angular
      .module('ElCinaroAdmin')
      .factory('$pedidos', factory);

    factory.$inject = ['baseApi', '$http', '$q'];

    /* @ngInject */
    function factory(baseApi, $http, $q) {
      var service = {
        getClientes: getClientes,
        deleteCliente: deleteCliente,
        updateCliente: updateCliente,
        createCliente: createCliente,
        deleteCliente: deleteCliente,
        clientes: []
      };

      return service;

      function getClientes(query) {
        var deferred = $q.defer();
        $http.get(baseApi + '/clientes/', {
            params: {
              page: query.page || 1,
              page_size: query.limit || 10,
              format: 'json',
              ordering: query.order || '',
              search: query.filter || ''
            }
          })
          .success(function(data) {
            angular.copy(data.results, service.clientes);
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }


      function updateCliente(query) {
        var deferred = $q.defer();
        $http.put(baseApi + '/clientes/' + query.id + '/', query)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }

      function createCliente(payload) {
        var deferred = $q.defer();
        $http.post(baseApi + '/clientes/', payload)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }

      function deleteCliente(id) {
        var deferred = $q.defer();
        $http.delete(baseApi + '/clientes/' + id + '/' )
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }
    }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$plagas', factory);

  factory.$inject = ['$http', '$q', 'baseApi'];

  /* @ngInject */
  function factory($http, $q, baseApi) {
    var service = {
      getPlagas: getPlagas,
      createPlagas: createPlagas,
      updatePlagas: updatePlagas,
      deletePlagas: deletePlagas
    };

    return service;


    function getPlagas(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/plagas/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 50,
            format: 'json',
            ordering: query.order || 'id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updatePlagas(query) {
      var deferred = $q.defer();
      $http.put(baseApi + '/plagas/' + query.id + '/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function createPlagas(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.post(baseApi + '/plagas/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deletePlagas(id) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/plagas/' + id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$proovedores', factory);

  factory.$inject = ['_', '$http', '$q', 'baseApi'];

  /* @ngInject */
  function factory(_, $http, $q, baseApi) {
    var service = {
      createProovedor: createProovedor,
      updateProovedor: updateProovedor,
      deleteProovedor: deleteProovedor
    };

    return service;

    function updateProovedor(query) {
      var deferred = $q.defer();
      $http.put(baseApi + '/proovedores/' + query.id + '/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createProovedor(payload) {
      var deferred = $q.defer();

      console.log(payload);

      var params = _.mapValues(payload, function(item) {
        return _.isObject(item) ? item.id : item;
      });

      console.log(params);
      $http.post(baseApi + '/proovedores/', params)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteProovedor(id) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/proovedores/' + id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();
(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$seguimiento', factory);

  factory.$inject = ['baseApi', '$http', '$q'];

  /* @ngInject */
  function factory(baseApi, $http, $q) {
    var service = {
      getActividades: getActividades,
      createActividades: createActividades,
      actividades: []
    };

    return service;

    function getActividades(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/actividades/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
          }
        })
        .success(function(data) {
          angular.copy(data.results, service.semillas);
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createActividades(payload) {
      var deferred = $q.defer();
      $http.post(baseApi + '/seguimiento/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$siembras', factory);

  factory.$inject = ['$http', '$q', '$timeout', 'baseApi', 'moment'];

  /* @ngInject */
  function factory($http, $q, $timeout, baseApi, moment) {
    var service = {
      getSemillas: getSemillas,
      getCultivos: getCultivos,
      createCultivo: createCultivo,
      updateCultivo: updateCultivo,
      deleteCultivo: deleteCultivo,
      getRubros: getRubros,
      getLotes: getLotes,
      createLoteSiembra: createLoteSiembra,
      updateLoteSiembra: updateLoteSiembra,
      deleteLoteSiembra: deleteLoteSiembra,
      getProovedores: getProovedores,
      getProovedorCategoria: getProovedorCategoria,
      getUnidades: getUnidades,
      getMedidas: getMedidas,
      createSemilla: createSemilla,
      deleteSemilla: deleteSemilla,
      updateSemilla: updateSemilla,
      createRubro: createRubro,
      updateRubro: updateRubro,
      deleteRubro: deleteRubro,
      getCosechas: getCosechas,
      createCosecha: createCosecha,
      updateCosecha: updateCosecha,
      deleteCosecha: deleteCosecha,
      cultivos: [],
      semillas: [],
      lotes: [],
      rubros: []
    };

    return service;

    function getSemillas(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/semillas/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          angular.copy(data.results, service.semillas);
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function createSemilla(payload) {
      var deferred = $q.defer();

      //field formatting
      payload['fecha_compra'] = moment(payload['fecha_compra'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });

      console.log(query);

      $http.post(baseApi + '/semillas/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateSemilla(payload) {
      var deferred = $q.defer();
      //fieldFormatting
      payload['fecha_compra'] = moment(payload['fecha_compra'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });

      $http.put(baseApi + '/semillas/' + payload.id + '/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function createCultivo(payload) {
      var deferred = $q.defer();
      $http.post(baseApi + '/cultivos/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateCultivo(payload) {
      var deferred = $q.defer();
      $http.put(baseApi + '/cultivos/' + payload.id + '/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getCultivos(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/cultivos/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
          }
        })
        .success(function(data) {
          angular.copy(data.results, service.cultivos);
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function deleteSemilla(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/semillas/' + payload.id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteCultivo(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/cultivos/' + payload.id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getLotes(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/lotes/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          angular.copy(data.results, service.lotes);
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function createLoteSiembra(payload) {
      var deferred = $q.defer();
      //fieldFormatting

      $http.post(baseApi + '/lotes/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateLoteSiembra(payload) {
      var deferred = $q.defer();
      //fieldFormatting
      //
      var query = _.mapValues(payload, function(o) {
          return _.isObject(o) && !moment(o, 'YYYY-MM-DD')
            .isValid() && !_.isArray(o) ? o.id : o;
      });

      $http.put(baseApi + '/lotes/' + payload.id + '/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }



    function getRubros(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/rubros/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
          angular.copy(data.results, service.semillas);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getAreasSiembra(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/rubros/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getUnidades() {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.resolve({
          results: [{
            id: 1,
            nombre: 'gramos'
          }, {
            id: 2,
            nombre: 'unidades'
          }]
        });
      }, Math.random() * 1000, false);

      return deferred.promise;
    }

    function getMedidas() {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.resolve({
          results: [{
            id: 1,
            nombre: 'Centimetros(cm)'
          }, {
            id: 2,
            nombre: 'Milimetros (mm)'
          }, {
            id: 3,
            nombre: 'Mililitros(cm)'
          }, {
            id: 4,
            nombre: 'Litro (l)'
          }, {
            id: 5,
            nombre: 'Kilogramo(kg)'
          }, {
            id: 6,
            nombre: 'Miligramos (mg)'
          }]
        });
      }, Math.random() * 1000, false);

      return deferred.promise;
    }

    function getProovedorCategoria(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/categorias/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getProovedores(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/proovedores/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function getCosechas(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/cosechas/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createCosecha(payload) {
      var deferred = $q.defer();
      //fieldFormatting
      payload['fecha_cosecha'] = moment(payload['fecha_compra'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) && !moment(o, 'YYYY-MM-DD', true)
          .isValid() ? o.id : o;
      });

      $http.post(baseApi + '/cosechas/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateCosecha(payload) {
      var deferred = $q.defer();
      //fieldFormatting
      payload['fecha_cosecha'] = moment(payload['fecha_cosecha'])
        .format('YYYY-MM-DD');

      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) && !moment(o, 'YYYY-MM-DD')
          .isValid() ? o.id : o;
      });

      $http.put(baseApi + '/cosechas/' + payload.id + '/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteCosecha(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/cosechas/' + payload.id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createRubro(query) {
      var deferred = $q.defer();
      $http.post(baseApi + '/rubros/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateRubro(payload) {
      var deferred = $q.defer();
      $http.put(baseApi + '/rubros/' + payload.id + '/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteRubro(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/rubros/' + payload.id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteLoteSiembra(payload) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/lotes/' + payload.id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$suelos', factory);

  factory.$inject = ['_', '$http', '$q', 'baseApi'];

  /* @ngInject */
  function factory(_, $http, $q, baseApi) {
    var service = {
      getInvernaderos: getInvernaderos,
      getParcelas: getParcelas,
      createParcela: createParcela,
      updateParcela: updateParcela,
      createInvernadero: createInvernadero,
      updateInvernadero: updateInvernadero,
      getTipoParcela: getTipoParcela,
      deleteParcela: deleteParcela,
      deleteInvernadero: deleteInvernadero,
      getAreasSiembra: getAreasSiembra
    };

    return service;

    function getInvernaderos(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/invernaderos/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getParcelas(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/parcelas/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function getTipoParcela(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/tipo-parcelas/', {
          params: {
            page: query.page || 1,
            page_size: query.limit || 100,
            format: 'json',
            ordering: query.order || '-id',
            search: query.filter || ''
          }
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function createInvernadero(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.post(baseApi + '/invernaderos/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function updateParcela(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.put(baseApi + '/parcelas/' + payload.id + '/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function updateInvernadero(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.put(baseApi + '/invernaderos/' + payload.id + '/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function createParcela(payload) {
      var deferred = $q.defer();
      var query = _.mapValues(payload, function(o) {
        return _.isObject(o) ? o.id : o;
      });
      $http.post(baseApi + '/parcelas/', query)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteParcela(id) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/parcelas/' + id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function deleteInvernadero(id) {
      var deferred = $q.defer();
      $http.delete(baseApi + '/invernaderos/' + id + '/')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function getAreasSiembra(query) {
      var deferred = $q.defer();
      $q.all([getInvernaderos(query), getParcelas(query)])
        .then(function(resp) {
          console.log('areas de siembra',resp);
          deferred.resolve({results: resp.reduce(function(acc,item) {
            return acc.concat(item.results);
          }, [])});
        })
        .catch(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .service('UserService', factory);

  factory.$inject = ['$http', '$q', '$localstorage', '$rootScope', 'baseApi'];

  /* @ngInject */
  function factory($http, $q, $localstorage, $rootScope, baseApi) {
    var service = {
      getOptions: getOptions,
      getClientToken: getClientToken,
      update: update
    }

    return service;

    function getOptions() {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: baseApi + '/campaign/options/'
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }

    function update(userId, payload) {
      var deferred = $q.defer();
      var url = baseApi + '/user/' + userId;
      $http.put(url, payload)
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
          angular.copy(data, $rootScope.user);
          $localstorage.setObject('user', data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }

  function getClientToken() {
    return {};
  }

})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$util', factory);

  function factory($mdToast) {
    var service = {
      getCountries: getCountries,
      getActions: getActions,
      getMedidas: getMedidas,
      getUnidades: getUnidades,
      convertDateStringsToDates: convertDateStringsToDates,
      showSimpleToast: showSimpleToast,
      item: {}
    };

    return service;

    function showSimpleToast(message) {
         $mdToast.showSimple(message);
    }

    function convertDateStringsToDates(input) {
      // Ignore things that aren't objects.
      if (typeof input !== "object") return input;

      var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

      for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
          // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
          var milliseconds = Date.parse(match[0]);
          if (!isNaN(milliseconds)) {
            input[key] = new Date(milliseconds);
          }
        } else if (typeof value === "object") {
          // Recurse into object
          convertDateStringsToDates(value);
        }
      }
    }


    function getUnidades() {
      return [{
        id: 1,
        nombre: 'Centimetros(cm)'
      }, {
        id: 2,
        nombre: 'Milimetros (mm)'
      }, {
        id: 3,
        nombre: 'Mililitros(cm)'
      }, {
        id: 4,
        nombre: 'Litro (l)'
      }, {
        id: 5,
        nombre: 'Kilogramo(kg)'
      }, {
        id: 6,
        nombre: 'Miligramos (mg)'
      }];
    }

    function getMedidas() {
      return [{
        id: 1,
        nombre: 'L.'
      }, {
        id: 2,
        nombre: 'mL.'
      }, {
        id: 3,
        nombre: 'g.'
      }, {
        id: 4,
        nombre: 'Kg.'
      }]
    }

    function getActions() {
      return [{
        name: 'Desmalezamiento',
        _lowername: 'desmalezamiento',
        id: 1
      }, {
        template: 'riego.tmpl.html',
        name: 'Riego',
        _lowername: 'riego',
        id: 2
      }, {
        name: 'Fertilizacion',
        _lowername: 'fertilizacion',
        id: 6,
        template: 'fertilizacion.tmpl.html'
      }, {
        name: 'Plaguicida',
        _lowername: 'plagicida',
        id: 5,
        template: 'plaguicida.tmpl.html'
      }, {
        name: 'Limpieza',
        _lowername: 'limpieza',
        id: 4
      }, {
        name: 'Observaciones',
        _lowername: 'observaciones',
        id: 3,
        template: 'observaciones.tmpl.html'
      }];
    }

    function getCountries() {
      return [{
        name: 'Afghanistan',
        id: 'AF'
      }, {
        name: 'Åland Islands',
        id: 'AX'
      }, {
        name: 'Albania',
        id: 'AL'
      }, {
        name: 'Algeria',
        id: 'DZ'
      }, {
        name: 'American Samoa',
        id: 'AS'
      }, {
        name: 'AndorrA',
        id: 'AD'
      }, {
        name: 'Angola',
        id: 'AO'
      }, {
        name: 'Anguilla',
        id: 'AI'
      }, {
        name: 'Antarctica',
        id: 'AQ'
      }, {
        name: 'Antigua and Barbuda',
        id: 'AG'
      }, {
        name: 'Argentina',
        id: 'AR'
      }, {
        name: 'Armenia',
        id: 'AM'
      }, {
        name: 'Aruba',
        id: 'AW'
      }, {
        name: 'Australia',
        id: 'AU'
      }, {
        name: 'Austria',
        id: 'AT'
      }, {
        name: 'Azerbaijan',
        id: 'AZ'
      }, {
        name: 'Bahamas',
        id: 'BS'
      }, {
        name: 'Bahrain',
        id: 'BH'
      }, {
        name: 'Bangladesh',
        id: 'BD'
      }, {
        name: 'Barbados',
        id: 'BB'
      }, {
        name: 'Belarus',
        id: 'BY'
      }, {
        name: 'Belgium',
        id: 'BE'
      }, {
        name: 'Belize',
        id: 'BZ'
      }, {
        name: 'Benin',
        id: 'BJ'
      }, {
        name: 'Bermuda',
        id: 'BM'
      }, {
        name: 'Bhutan',
        id: 'BT'
      }, {
        name: 'Bolivia',
        id: 'BO'
      }, {
        name: 'Bosnia and Herzegovina',
        id: 'BA'
      }, {
        name: 'Botswana',
        id: 'BW'
      }, {
        name: 'Bouvet Island',
        id: 'BV'
      }, {
        name: 'Brazil',
        id: 'BR'
      }, {
        name: 'British Indian Ocean Territory',
        id: 'IO'
      }, {
        name: 'Brunei Darussalam',
        id: 'BN'
      }, {
        name: 'Bulgaria',
        id: 'BG'
      }, {
        name: 'Burkina Faso',
        id: 'BF'
      }, {
        name: 'Burundi',
        id: 'BI'
      }, {
        name: 'Cambodia',
        id: 'KH'
      }, {
        name: 'Cameroon',
        id: 'CM'
      }, {
        name: 'Canada',
        id: 'CA'
      }, {
        name: 'Cape Verde',
        id: 'CV'
      }, {
        name: 'Cayman Islands',
        id: 'KY'
      }, {
        name: 'Central African Republic',
        id: 'CF'
      }, {
        name: 'Chad',
        id: 'TD'
      }, {
        name: 'Chile',
        id: 'CL'
      }, {
        name: 'China',
        id: 'CN'
      }, {
        name: 'Christmas Island',
        id: 'CX'
      }, {
        name: 'Cocos (Keeling) Islands',
        id: 'CC'
      }, {
        name: 'Colombia',
        id: 'CO'
      }, {
        name: 'Comoros',
        id: 'KM'
      }, {
        name: 'Congo',
        id: 'CG'
      }, {
        name: 'Congo, The Democratic Republic of the',
        id: 'CD'
      }, {
        name: 'Cook Islands',
        id: 'CK'
      }, {
        name: 'Costa Rica',
        id: 'CR'
      }, {
        name: 'Cote D\'Ivoire',
        id: 'CI'
      }, {
        name: 'Croatia',
        id: 'HR'
      }, {
        name: 'Cuba',
        id: 'CU'
      }, {
        name: 'Cyprus',
        id: 'CY'
      }, {
        name: 'Czech Republic',
        id: 'CZ'
      }, {
        name: 'Denmark',
        id: 'DK'
      }, {
        name: 'Djibouti',
        id: 'DJ'
      }, {
        name: 'Dominica',
        id: 'DM'
      }, {
        name: 'Dominican Republic',
        id: 'DO'
      }, {
        name: 'Ecuador',
        id: 'EC'
      }, {
        name: 'Egypt',
        id: 'EG'
      }, {
        name: 'El Salvador',
        id: 'SV'
      }, {
        name: 'Equatorial Guinea',
        id: 'GQ'
      }, {
        name: 'Eritrea',
        id: 'ER'
      }, {
        name: 'Estonia',
        id: 'EE'
      }, {
        name: 'Ethiopia',
        id: 'ET'
      }, {
        name: 'Falkland Islands (Malvinas)',
        id: 'FK'
      }, {
        name: 'Faroe Islands',
        id: 'FO'
      }, {
        name: 'Fiji',
        id: 'FJ'
      }, {
        name: 'Finland',
        id: 'FI'
      }, {
        name: 'France',
        id: 'FR'
      }, {
        name: 'French Guiana',
        id: 'GF'
      }, {
        name: 'French Polynesia',
        id: 'PF'
      }, {
        name: 'French Southern Territories',
        id: 'TF'
      }, {
        name: 'Gabon',
        id: 'GA'
      }, {
        name: 'Gambia',
        id: 'GM'
      }, {
        name: 'Georgia',
        id: 'GE'
      }, {
        name: 'Germany',
        id: 'DE'
      }, {
        name: 'Ghana',
        id: 'GH'
      }, {
        name: 'Gibraltar',
        id: 'GI'
      }, {
        name: 'Greece',
        id: 'GR'
      }, {
        name: 'Greenland',
        id: 'GL'
      }, {
        name: 'Grenada',
        id: 'GD'
      }, {
        name: 'Guadeloupe',
        id: 'GP'
      }, {
        name: 'Guam',
        id: 'GU'
      }, {
        name: 'Guatemala',
        id: 'GT'
      }, {
        name: 'Guernsey',
        id: 'GG'
      }, {
        name: 'Guinea',
        id: 'GN'
      }, {
        name: 'Guinea-Bissau',
        id: 'GW'
      }, {
        name: 'Guyana',
        id: 'GY'
      }, {
        name: 'Haiti',
        id: 'HT'
      }, {
        name: 'Heard Island and Mcdonald Islands',
        id: 'HM'
      }, {
        name: 'Holy See (Vatican City State)',
        id: 'VA'
      }, {
        name: 'Honduras',
        id: 'HN'
      }, {
        name: 'Hong Kong',
        id: 'HK'
      }, {
        name: 'Hungary',
        id: 'HU'
      }, {
        name: 'Iceland',
        id: 'IS'
      }, {
        name: 'India',
        id: 'IN'
      }, {
        name: 'Indonesia',
        id: 'ID'
      }, {
        name: 'Iran, Islamic Republic Of',
        id: 'IR'
      }, {
        name: 'Iraq',
        id: 'IQ'
      }, {
        name: 'Ireland',
        id: 'IE'
      }, {
        name: 'Isle of Man',
        id: 'IM'
      }, {
        name: 'Israel',
        id: 'IL'
      }, {
        name: 'Italy',
        id: 'IT'
      }, {
        name: 'Jamaica',
        id: 'JM'
      }, {
        name: 'Japan',
        id: 'JP'
      }, {
        name: 'Jersey',
        id: 'JE'
      }, {
        name: 'Jordan',
        id: 'JO'
      }, {
        name: 'Kazakhstan',
        id: 'KZ'
      }, {
        name: 'Kenya',
        id: 'KE'
      }, {
        name: 'Kiribati',
        id: 'KI'
      }, {
        name: 'Korea, Democratic People\'S Republic of',
        id: 'KP'
      }, {
        name: 'Korea, Republic of',
        id: 'KR'
      }, {
        name: 'Kuwait',
        id: 'KW'
      }, {
        name: 'Kyrgyzstan',
        id: 'KG'
      }, {
        name: 'Lao People\'S Democratic Republic',
        id: 'LA'
      }, {
        name: 'Latvia',
        id: 'LV'
      }, {
        name: 'Lebanon',
        id: 'LB'
      }, {
        name: 'Lesotho',
        id: 'LS'
      }, {
        name: 'Liberia',
        id: 'LR'
      }, {
        name: 'Libyan Arab Jamahiriya',
        id: 'LY'
      }, {
        name: 'Liechtenstein',
        id: 'LI'
      }, {
        name: 'Lithuania',
        id: 'LT'
      }, {
        name: 'Luxembourg',
        id: 'LU'
      }, {
        name: 'Macao',
        id: 'MO'
      }, {
        name: 'Macedonia, The Former Yugoslav Republic of',
        id: 'MK'
      }, {
        name: 'Madagascar',
        id: 'MG'
      }, {
        name: 'Malawi',
        id: 'MW'
      }, {
        name: 'Malaysia',
        id: 'MY'
      }, {
        name: 'Maldives',
        id: 'MV'
      }, {
        name: 'Mali',
        id: 'ML'
      }, {
        name: 'Malta',
        id: 'MT'
      }, {
        name: 'Marshall Islands',
        id: 'MH'
      }, {
        name: 'Martinique',
        id: 'MQ'
      }, {
        name: 'Mauritania',
        id: 'MR'
      }, {
        name: 'Mauritius',
        id: 'MU'
      }, {
        name: 'Mayotte',
        id: 'YT'
      }, {
        name: 'Mexico',
        id: 'MX'
      }, {
        name: 'Micronesia, Federated States of',
        id: 'FM'
      }, {
        name: 'Moldova, Republic of',
        id: 'MD'
      }, {
        name: 'Monaco',
        id: 'MC'
      }, {
        name: 'Mongolia',
        id: 'MN'
      }, {
        name: 'Montserrat',
        id: 'MS'
      }, {
        name: 'Morocco',
        id: 'MA'
      }, {
        name: 'Mozambique',
        id: 'MZ'
      }, {
        name: 'Myanmar',
        id: 'MM'
      }, {
        name: 'Namibia',
        id: 'NA'
      }, {
        name: 'Nauru',
        id: 'NR'
      }, {
        name: 'Nepal',
        id: 'NP'
      }, {
        name: 'Netherlands',
        id: 'NL'
      }, {
        name: 'Netherlands Antilles',
        id: 'AN'
      }, {
        name: 'New Caledonia',
        id: 'NC'
      }, {
        name: 'New Zealand',
        id: 'NZ'
      }, {
        name: 'Nicaragua',
        id: 'NI'
      }, {
        name: 'Niger',
        id: 'NE'
      }, {
        name: 'Nigeria',
        id: 'NG'
      }, {
        name: 'Niue',
        id: 'NU'
      }, {
        name: 'Norfolk Island',
        id: 'NF'
      }, {
        name: 'Northern Mariana Islands',
        id: 'MP'
      }, {
        name: 'Norway',
        id: 'NO'
      }, {
        name: 'Oman',
        id: 'OM'
      }, {
        name: 'Pakistan',
        id: 'PK'
      }, {
        name: 'Palau',
        id: 'PW'
      }, {
        name: 'Palestinian Territory, Occupied',
        id: 'PS'
      }, {
        name: 'Panama',
        id: 'PA'
      }, {
        name: 'Papua New Guinea',
        id: 'PG'
      }, {
        name: 'Paraguay',
        id: 'PY'
      }, {
        name: 'Peru',
        id: 'PE'
      }, {
        name: 'Philippines',
        id: 'PH'
      }, {
        name: 'Pitcairn',
        id: 'PN'
      }, {
        name: 'Poland',
        id: 'PL'
      }, {
        name: 'Portugal',
        id: 'PT'
      }, {
        name: 'Puerto Rico',
        id: 'PR'
      }, {
        name: 'Qatar',
        id: 'QA'
      }, {
        name: 'Reunion',
        id: 'RE'
      }, {
        name: 'Romania',
        id: 'RO'
      }, {
        name: 'Russian Federation',
        id: 'RU'
      }, {
        name: 'RWANDA',
        id: 'RW'
      }, {
        name: 'Saint Helena',
        id: 'SH'
      }, {
        name: 'Saint Kitts and Nevis',
        id: 'KN'
      }, {
        name: 'Saint Lucia',
        id: 'LC'
      }, {
        name: 'Saint Pierre and Miquelon',
        id: 'PM'
      }, {
        name: 'Saint Vincent and the Grenadines',
        id: 'VC'
      }, {
        name: 'Samoa',
        id: 'WS'
      }, {
        name: 'San Marino',
        id: 'SM'
      }, {
        name: 'Sao Tome and Principe',
        id: 'ST'
      }, {
        name: 'Saudi Arabia',
        id: 'SA'
      }, {
        name: 'Senegal',
        id: 'SN'
      }, {
        name: 'Serbia and Montenegro',
        id: 'CS'
      }, {
        name: 'Seychelles',
        id: 'SC'
      }, {
        name: 'Sierra Leone',
        id: 'SL'
      }, {
        name: 'Singapore',
        id: 'SG'
      }, {
        name: 'Slovakia',
        id: 'SK'
      }, {
        name: 'Slovenia',
        id: 'SI'
      }, {
        name: 'Solomon Islands',
        id: 'SB'
      }, {
        name: 'Somalia',
        id: 'SO'
      }, {
        name: 'South Africa',
        id: 'ZA'
      }, {
        name: 'South Georgia and the South Sandwich Islands',
        id: 'GS'
      }, {
        name: 'Spain',
        id: 'ES'
      }, {
        name: 'Sri Lanka',
        id: 'LK'
      }, {
        name: 'Sudan',
        id: 'SD'
      }, {
        name: 'Suriname',
        id: 'SR'
      }, {
        name: 'Svalbard and Jan Mayen',
        id: 'SJ'
      }, {
        name: 'Swaziland',
        id: 'SZ'
      }, {
        name: 'Sweden',
        id: 'SE'
      }, {
        name: 'Switzerland',
        id: 'CH'
      }, {
        name: 'Syrian Arab Republic',
        id: 'SY'
      }, {
        name: 'Taiwan, Province of China',
        id: 'TW'
      }, {
        name: 'Tajikistan',
        id: 'TJ'
      }, {
        name: 'Tanzania, United Republic of',
        id: 'TZ'
      }, {
        name: 'Thailand',
        id: 'TH'
      }, {
        name: 'Timor-Leste',
        id: 'TL'
      }, {
        name: 'Togo',
        id: 'TG'
      }, {
        name: 'Tokelau',
        id: 'TK'
      }, {
        name: 'Tonga',
        id: 'TO'
      }, {
        name: 'Trinidad and Tobago',
        id: 'TT'
      }, {
        name: 'Tunisia',
        id: 'TN'
      }, {
        name: 'Turkey',
        id: 'TR'
      }, {
        name: 'Turkmenistan',
        id: 'TM'
      }, {
        name: 'Turks and Caicos Islands',
        id: 'TC'
      }, {
        name: 'Tuvalu',
        id: 'TV'
      }, {
        name: 'Uganda',
        id: 'UG'
      }, {
        name: 'Ukraine',
        id: 'UA'
      }, {
        name: 'United Arab Emirates',
        id: 'AE'
      }, {
        name: 'United Kingdom',
        id: 'GB'
      }, {
        name: 'United States',
        id: 'US'
      }, {
        name: 'United States Minor Outlying Islands',
        id: 'UM'
      }, {
        name: 'Uruguay',
        id: 'UY'
      }, {
        name: 'Uzbekistan',
        id: 'UZ'
      }, {
        name: 'Vanuatu',
        id: 'VU'
      }, {
        name: 'Venezuela',
        id: 'VE'
      }, {
        name: 'Viet Nam',
        id: 'VN'
      }, {
        name: 'Virgin Islands, British',
        id: 'VG'
      }, {
        name: 'Virgin Islands, U.S.',
        id: 'VI'
      }, {
        name: 'Wallis and Futuna',
        id: 'WF'
      }, {
        name: 'Western Sahara',
        id: 'EH'
      }, {
        name: 'Yemen',
        id: 'YE'
      }, {
        name: 'Zambia',
        id: 'ZM'
      }, {
        name: 'Zimbabwe',
        id: 'ZW'
      }];
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('dropzone', dropzone);

  dropzone.$inject = ['Dropzone'];

  function dropzone(Dropzone) {
    var directive = {
      link: link,
      restrict: 'EA',
      scope: {
        dropzone: '=dropzone',
        reset: '@reset'
      }
    };
    return directive;

    function link(scope, element, attrs) {
      var config, zone;

      config = scope.dropzone;
      zone = new Dropzone(element[0], config.options);

      if (scope.reset) {
        zone.on('complete', function(file) {
          zone.removeFile(file);
        });
      }

      angular.forEach(config.eventHandlers, function(handler, event) {
        zone.on(event, handler);
      });
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('autoComplete', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/autocomplete/autocomplete.html',
      scope: {
        meta: '=',
        item: '=?ngModel'
      },
      link: linkFunc,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

    }
  }

  Controller.$inject = ['_', '$scope', '$log', '$siembras', '$suelos'];

  /* @ngInject */
  function Controller(_, $scope, $log, $siembras, $suelos) {
    var vm = this;

    vm.simulateQuery = false;
    vm.isDisabled = false;
    vm.validation = true;
    vm.touched = false;
    vm.form = {};

    // list of `state` value/display objects
    vm.querySearch = querySearch;


    activate();

    function activate() {
      console.log('autocomplete directive');
      console.log(vm.meta);
      console.log(vm.item);

      //if (vm.item) vm.searchText = vm.item;
    }


    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(q) {
      console.log('doing query with', q);

      var query = {
        page: 1,
        limit: 100,
        filter: '',
        order: '-id',
        filter: q
      }

      var handlers = {
        getRubros: function() {
          return $siembras.getRubros(query);
        },
        getCultivos: function() {
          return $siembras.getCultivos(query);
        },
        getProovedores: function() {
          return $siembras.getProovedores(query);
        },
        getUnidades: function() {
          return $siembras.getUnidades(query);
        },
        getMedidas: function() {
          return $siembras.getMedidas(query);
        },
        getProovedorCategoria: function() {
          return $siembras.getProovedorCategoria(query);
        },
        getTipoParcela: function() {
          return $suelos.getTipoParcela(query);
        },
        getSemillas: function() {
          return $siembras.getSemillas(query);
        },
        getAreasSiembra: function() {
          return $suelos.getAreasSiembra(query);
        },
        getLotesSiembra: function() {
          return $siembras.getLotes(query);
        }
      }

      var mapper = function(item) {
        return {
          id: item.id,
          nombre: item.nombre
        }
      };

      return handlers[vm.meta.handler]()
        .then(function(resp) {
          return _.map(resp.results, vm.meta.mapper || mapper);
        });

    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }


    $scope.$watch('vm.item', function(c, o) {
      if(!c) return;
      console.log(c);
      vm.touched = true;

    });

    $scope.$watch('vm.form', function(c,o) {
      console.log(c, o);
    })

  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('autoCompleteStatic', directive);

  /* @ngInject */
  function directive() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/views/autocomplete-static/autocomplete-static.html',
      scope: {
        meta: '=',
        data: '=',
        item: '=?ngModel'
      },
      link: linkFunc,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true,
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

    }
  }

  Controller.$inject = ['_', '$scope', '$log'];

  /* @ngInject */
  function Controller(_, $scope, $log) {
    var vm = this;

    vm.simulateQuery = false;
    vm.isDisabled = false;
    vm.validation = true;
    vm.touched = false;
    vm.form = {};

    // list of `state` value/display objects
    vm.querySearch = querySearch;


    activate();

    function activate() {
      console.log('autocomplete-static directive');
      console.log(vm.meta);
      console.log(vm.item);
      //if (vm.item) vm.searchText = vm.item;
    }


    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
      var results = query ? vm.data.filter(createFilterFor(query)) : vm.data;
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }

    $scope.$watch('vm.searchText', function(c, o) {
      console.log(c);
    });

  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ListBottomSheetController', Controller);

  Controller.$inject = ['$scope', 'items'];

  /* @ngInject */
  function Controller($scope, items) {
    var vm = this;

    activate();

    function activate() {
      angular.copy(items, $scope.items)
      console.log('bottom action bar');
    }

    $scope.listItemClick = function($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };
  }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .directive('adbChips', adbChips);

  function adbChips() {
    var directive = {
      restrict: 'EA',
      controllerAs: 'vm',
      controller: Controller,
      bindToController: true,
      templateUrl: 'assets/views/chips/adbChips.html',
      scope: {
        'map': '=?',
        'max': '@?',
        'list': '=',
        'label': '@?',
        'click': '=?',
        'create': '=?',
        'filter': '=?',
        'id': '@?adbId',
        'disabled': '=',
        'editable': '=',
        'hideList': '=?',
        'listClass': '@?',
        'showCount': '=?',
        'placeholder': '@?',
        'model': '=?ngModel'
      }
    };
    return directive;
  }

  Controller.$inject = ['_', 'jQuery', '$scope', '$timeout', '$mdConstant', '$mdDialog'];

  function Controller(_, jQuery, $scope, $timeout, $mdConstant, $mdDialog) {
    var vm = this;
    vm.queryGiven = '';
    vm.input = '#chips-' + (vm.id || Date.now()) + ' md-autocomplete-wrap input';
    activate();

    ////////////////

    function activate() {
      if (!vm.map) vm.map = { name: 'name', image: 'image', type: 'chip' };
      if (!vm.placeholder) vm.placeholder = 'Type here to filter';
      if (vm.listClass === undefined) vm.listClass = 'fixed-rows';
      if (vm.showCount === undefined) vm.showCount = true;
      if (vm.create) jQuery(document).keydown(detectKey);
      if (vm.filter === undefined) vm.filter = {};
      if (_.isUndefined(vm.model)) vm.model = [];
    }

    vm.querySearch = function(query) {
      vm.queryGiven = query;
      var results = query && vm.list.length ? vm.list.filter(createFilterFor(query)) : [];

      if (vm.create) create(results, query);

      return results;
    };

    vm.selectItem = function(item) {
      console.log(vm.model);
      if (vm.editable) vm.model.push(item);
      if (_.isFunction(vm.click)) vm.click(item);
    };

    vm.exists = function(item) {
      return _.findIndex(vm.model, function(o) {
        return o[vm.map.name] == item[vm.map.name];
      }) >= 0;
    };

    vm.stopPropagation = function(e) {
      e.stopPropagation();
    };

    function createFilterFor(query) {
      return function filterFn(item) {
        if (vm.exists(item)) return false;
        return (item[vm.map.name].toLowerCase().indexOf(query.toLowerCase()) != -1);
      };
    }

    function create(results, query) {
      if (!results.length && query.indexOf(',') != -1) {
        var objects = vm.create(query.split(',').filter(function(e) {
          return e && e.length;
        }));
        console.log(objects);
        angular.forEach(objects, function(o) {
          vm.selectItem(o);
        });

        jQuery(vm.input).val('');
      }
    }

    function detectKey(e) {
      e.stopPropagation();

      if (jQuery(vm.input).is(':focus') && e.which == 13) {
        $scope.$apply(function() {
          var results = (vm.queryGiven && vm.list.length)? vm.list.filter(createFilterFor(vm.queryGiven)) : [];
          create(results, vm.queryGiven + ',');
        });
      }
    }

    $scope.$watch('vm.list', function(c, o) {
      console.log(c);

    })
  }
})();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .directive('ecaAction', directive);

    /* @ngInject */
    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'assets/views/eca-action/eca-action.html',
            scope: {
              meta: '=',
              item: '=?ngModel'
            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = ['_', '$scope', '$http', '$insumos', '$util'];

    /* @ngInject */
    function Controller(_, $scope, $http, $insumos, $util) {
        var vm = this;
        vm._ = _;

        vm.insumos = [];

        vm.medidas = $util.getUnidades();

        vm.query = {
          order: '-id',
          limit: 100,
          page: 1,
          filter: ''
        };

        activate();

        function activate() {
          // console.log('eca-action');
          // console.log(vm.meta);
          // console.log(vm.data);
          getInsumos();
        }

        function getInsumos() {
          $insumos.getInsumos(vm.query).then(function(resp) {
            vm.insumos = resp.results;
          })
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .directive('footerDirective', footerDirective);

    /* @ngInject */
    function footerDirective() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'assets/views/footer/footer.html',
            controller: footerController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    footerController.$inject = [];

    /* @ngInject */
    function footerController() {
        var vm = this;

        activate();

        function activate() {
          console.log('footer Activated');
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .directive('ecaForm', directive);

    /* @ngInject */
    function directive() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'assets/views/form/form.html',
            scope: {
              meta: '=',
              form: '=?ngModel',
              options: '=?'
            },
            link: linkFunc,
            controller: Controller,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }

    Controller.$inject = ['$scope', '_'];

    /* @ngInject */
    function Controller($scope, _) {
        var vm = this;

        activate();

        function activate() {
          vm.action = !vm.form.hasOwnProperty('id') ? vm.meta.handlers[0] : vm.meta.handlers[1];
        }


        $scope.$watch('vm.options', function(c,o) {
          vm.action = !vm.form.hasOwnProperty('id') ? vm.meta.handlers[0] : vm.meta.handlers[1];
        }, true);
    }
})();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
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

    function activate() {
      console.log('header directive');
    }

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

// (function() {
//   'use strict';
//   angular.module('m.utc')
//     .directive('utcParser', function() {
//
//       function link(scope, element, attrs, ngModel) {
//         var parser = function(val) {
//           val = moment.utc(val)
//             .format();
//           return val;
//         };
//
//         var formatter = function(val) {
//           if (!val) {
//             return val;
//           }
//           val = moment(val)
//             .toDate();
//           return val;
//         };
//
//         ngModel.$parsers.unshift(parser);
//         ngModel.$formatters.unshift(formatter);
//       }
//
//       return {
//         require: 'ngModel',
//         link: link,
//         restrict: 'A'
//       }
//     });
// })();

(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .controller('ModalController', Controller);

  Controller.$inject = ['_', '$scope', '$q', '$http', '$timeout', '$mdDialog', '$admin', '$insumos', '$plagas', '$pedidos', '$siembras', '$proovedores', '$suelos', 'payload'];

  /* @ngInject */
  function Controller(_, $scope, $q, $http, $timeout, $mdDialog, $admin, $insumos, $plagas, $pedidos, $siembras, $proovedores, $suelos, payload) {
    var vm = this;


    $scope.meta = {
      options: {}
    };


    activate();

    function activate() {
      console.log('modal controller');
      $scope.meta = angular.copy(payload);
    }

    $scope.close = function() {
      $mdDialog.hide();
    }

    $scope.handle = function(cancel) {
      console.log(cancel);

      if (cancel) {
        $mdDialog.cancel();
      }

      
      handle(payload.type, payload.handler, $scope.meta.data)
        .then(function(resp) {
          $mdDialog.hide(resp);
        })
        .catch(function(err) {
          console.log(err);
        });
    }


    $scope.selectHandler = function(name, type, map) {
      console.log(name, type);

      var query = {
        page: 1,
        limit: 100,
        filter: '',
        order: '-id'
      }

      if ($scope.meta['options'][name]) return;

      var handlers = {
        getRubros: function() {
          return $siembras.getRubros(query);
        },
        getCultivos: function() {
          return $siembras.getCultivos(query);
        },
        getProovedores: function() {
          return $siembras.getProovedores(query);
        },
        getUnidades: function() {
          return $siembras.getUnidades(query);
        },
        getProovedorCategoria: function() {
          return $siembras.getProovedorCategoria(query);
        },
        getTipoParcela: function() {
          return $suelos.getTipoParcela(query);
        },
        getSemillas: function() {
          return $siembras.getSemillas(query);
        }
      }

      if (!handlers.hasOwnProperty(type)) return;

      return handlers[type]()
        .then(function(resp) {

          $scope.meta['options'][name] = _.map(resp.results, function(i) {
            return {
              id: i.id,
              name: i.nombre
            }
          });

        })
        .catch(function(err) {
          console.log(err);
        })
    }


    $scope.isInput = function(item) {
      return _.includes(['email', 'text', 'password'], item.type);
    }

    $scope.$watch('meta', function(o, c) {
      console.log(o, c);
    });


    function handle(type, handler, data) {
      switch (type) {
        case 'clientes':
          return $pedidos[handler](data);
          break;
        case 'semillas':
          return $siembras[handler](data);
          break;
        case 'proovedores':
          return $proovedores[handler](data);
          break;
        case 'admin':
          return $admin[handler](data);
          break;
        case 'insumos':
          return $insumos[handler](data);
          break;
        case 'rubros':
          return $siembras[handler](data);
          break;
        case 'plagas':
          return $plagas[handler](data);
          break;
        case 'suelos':
          return $suelos[handler](data);
          break;
        case 'cosechas':
          return $siembras[handler](data);
          break;
        default:
          return fake(data);
      }
    }

    function fake(data) {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.resolve(data);
      }, Math.random() * 1000, false);

      return deferred.results;
    }
  }
})();

// (function() {
//     'use strict';
//
//     angular
//         .module('ElCinaroAdmin')
//         .directive('updateModalDialog', directive);
//
//     /* @ngInject */
//     function directive() {
//         var directive = {
//             restrict: 'EA',
//             templateUrl: 'templateUrl',
//             scope: {
//             },
//             link: linkFunc,
//             controller: Controller,
//             controllerAs: 'vm',
//             bindToController: true
//         };
//
//         return directive;
//
//         function linkFunc(scope, el, attr, ctrl) {
//
//         }
//     }
//
//     Controller.$inject = ['dependencies'];
//
//     /* @ngInject */
//     function Controller(dependencies) {
//         var vm = this;
//
//         activate();
//
//         function activate() {
//
//         }
//     }
// })();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('ActionController', Controller);

    Controller.$inject = ['_', '$scope', '$http', '$q', '$mdDialog',  '$util', '$insumos'];

    /* @ngInject */
    function Controller(_, $scope, $http, $q, $mdDialog, $util, $insumos) {
        var vm = this;

        vm.item = {};
        vm.data = {};
        vm.insumos = $insumos.insumos;
        vm.medidas = $util.getMedidas();
        activate();

        function activate() {
          console.log('action controller');
          angular.copy($util.item, vm.item);
        }

        vm.close = function() {
          vm.item.touched = true;
          $mdDialog.hide(vm.data);
        }

        vm.response = function() {
          vm.item.touched = true;
          $mdDialog.hide(vm.data);
        }

        vm.title = function() {
          return _.join([_.capitalize(vm.item.selector), vm.item.cultivo.description],': ');
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .controller('ActividadController', Controller);

    Controller.$inject = ['$http', '$q'];

    /* @ngInject */
    function Controller($http, $q) {
        var vm = this;

        activate();

        function activate() {

        }
    }
})();
