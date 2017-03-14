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

  function Auth(_,baseApi, $window, $http, $q, $state, $rootScope, $localstorage) {

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
      return $localstorage.getObject('user', null) || $localstorage.get('access_token', null) ;
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
      return config;
    }

    function response(response) {
        
        console.log(response);

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

        if(
          _.includes(responses, String(response.status)) && 
          _.includes(actions, response.config.method)
          ) {

          $injector.get('$util')
            .showSimpleToast(message(methodes[response.config.method]));
        }
        
        return response;
    }

    function responseError(response) {
      var options = {
          '400': 'Solicitud Invalido',
          '500': 'Ocurrió un Error en el servidor',
          '502': 'Ocurrió un Error en el servidor',
        }

      if(options.hasOwnProperty(String(response.status))) {
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
