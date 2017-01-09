(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .factory('$proovedores', factory);

    factory.$inject = ['$http', '$q', 'baseApi'];

    /* @ngInject */
    function factory($http, $q, baseApi) {
        var service = {
            createProovedor: createProovedor,
            updateProovedor: updateProovedor,
            deleteProovedor: deleteProovedor
        };

        return service;

        function updateProovedor(query) {
          var deferred = $q.defer();
          $http.put(baseApi + '/proovedores/' + query.id + '/', query)
            .success(function(data) {
              deferred.resolve(data);
            })
            .error(function(err) {
              deferred.reject(err);
            });
          return deferred.promise;
        }

        function createProovedor(payload) {
          var deferred = $q.defer();
          $http.post(baseApi + '/proovedores/', payload)
            .success(function(data) {
              deferred.resolve(data);
            })
            .error(function(err) {
              deferred.reject(err);
            });
          return deferred.promise;
        }

        function deleteProovedor(id) {
          var deferred = $q.defer();
          $http.delete(baseApi + '/proovedores/' + id + '/' )
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
