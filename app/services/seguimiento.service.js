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
      $http.post(baseApi + '/actividades/', payload)
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
