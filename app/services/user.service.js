(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
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
