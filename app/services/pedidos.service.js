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
    }
})();
