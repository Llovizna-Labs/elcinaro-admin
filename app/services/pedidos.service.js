(function() {
    'use strict';

    angular
      .module('ElCinaroAdmin')
      .factory('$pedidos', factory);

    factory.$inject = ['baseApi', '$http', '$q'];

    /* @ngInject */
    function factory(baseApi, $http, $q) {
      var service = {
        getClientes: getClientes,
        updateCliente: updateCliente,
        createCliente: createCliente,
        deleteCliente: deleteCliente,
        clientes: []
      };

      return service;

      function getClientes(query) {
        var deferred = $q.defer();
        $http.get(baseApi + '/clientes/', {
            params: {
              page: query.page || 1,
              page_size: query.limit || 10,
              format: 'json',
              ordering: query.order || '',
              search: query.filter || ''
            }
          })
          .success(function(data) {
            angular.copy(data.results, service.clientes);
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }


      function updateCliente(query) {
        var deferred = $q.defer();
        $http.put(baseApi + '/clientes/' + query.id + '/', query)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }

      function createCliente(payload) {
        var deferred = $q.defer();
        $http.post(baseApi + '/clientes/', payload)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }

      function deleteCliente(id) {
        var deferred = $q.defer();
        $http.delete(baseApi + '/clientes/' + id + '/' )
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
