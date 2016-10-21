(function() {
  'use strict';

  angular
    .module('ElCinaroAdmin')
    .factory('$siembras', factory);

  factory.$inject = ['$http', '$q', 'baseApi'];

  /* @ngInject */
  function factory($http, $q, baseApi) {
    var service = {
      getSemillas: getSemillas,
      getCultivos: getCultivos,
      getRubros: getRubros,
      getLotes: getLotes,
      cultivos: [],
      semillas: [],
      lotes: []
    };

    return service;

    function getSemillas(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/semillas/', {
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

    function getLotes(query) {
      var deferred = $q.defer();
      $http.get(baseApi + '/lotes/', {
          params: {
            page: query.page,
            page_size: query.limit,
            format: 'json',
            ordering: query.order,
            search: query.filter
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

    function getRubros(query) {
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
          angular.copy(data.results, service.lotes);
          deferred.resolve(data);
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
          angular.copy(data.results, service.lotes);
          deferred.resolve(data);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  }
})();
