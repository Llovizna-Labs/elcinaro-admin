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
              angular.copy(data.results, service.insumos);
              deferred.resolve(data);
            })
            .error(function(err) {
              deferred.reject(err);
            });
          return deferred.promise;
        }
    }
})();
