(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .service('DataService', dataService);

  dataService.$inject = ['$http', '$q', 'baseApi'];

  /* @ngInject */
  function dataService($http, $q, baseApi) {
    var dataService = {
      getOptions: getOptions,
      getClientToken : getClientToken
    }

    return dataService;

    function getOptions() {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: baseApi + '/advertisment/options/'
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }

    function getClientToken() {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: 'http://localhost:1338/commerce/clientToken/'
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }


  }
})();
