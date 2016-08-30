(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .service('dataService', dataService);

  dataService.$inject = ['$http', '$q', 'baseApi'];

  /* @ngInject */
  function dataService($http, $q, baseApi) {
    var dataService = {
      getInfo: getInfo
    }

    return dataService;

    function getInfo() {
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: baseApi + '/advertisment/options/'
      }).then(function successCallback(response) {
        deferred.resolve(response);
      }, function errorCallback(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }
  }
})();
