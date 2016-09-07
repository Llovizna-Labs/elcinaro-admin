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
      getClientToken: getClientToken,
      createCampaign: createCampaign,
      getCampaigns: getCampaigns
    }

    return dataService;

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

    function getClientToken() {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: baseApi + '/commerce/clientToken/'
      }).success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).error(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }


    function createCampaign(payload) {
      var deferred = $q.defer();
      $http.post('http://localhost:1338/campaign/create/', payload)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }


    function getCampaigns() {
      var deferred = $q.defer();
      $http.get(baseApi + '/campaign/all/')
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
