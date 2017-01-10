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
          $http.post(baseApi + '/insumos/', payload)
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
