/**
 * @ngdoc service
 * @name userservice
 * @requires $http, $q
 * @description 
 * 
 * Este servicio es usado para manejar las sesiones de usuario.
 * 
 */

(function() {
  'use strict';

  angular
    .module('devion-stack-angular')
    .factory('userService', userService);

  userService.$inject = ['API_URL', '$http', '$q'];

  /* @ngInject */
  function userService(API_URL, $http, $q) {
    var service = {
      isLoggedIn: isLoggedIn,
      login: login
    };
    return service;

    ////////////////

    /**
     * Verifica si el usuario está autenticado.
     * @return {Boolean} True Cuando hay un usuario autenticado.
     */
    function isLoggedIn() {
      var user = $rootScope.currentUser;
      return !!user;
    }

    /**
     * Valida las credenciales del usuario con el servidor.
     * @param  {Object}  params Credenciales.
     * @return {Promise}        Promesa de la solicitud.
     */
    function login(params) {
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: API_URL + 'login',
        data: params
      }).success(function(resp) {
        $rootScope.currentUser = resp.user;
        deferred.resolve(resp);
      }).error(function(err) {
        deferred.reject(err);
      });
      
      return deferred.promise;
    }

  }
})();