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
