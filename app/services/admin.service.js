(function() {
    'use strict';

    angular
        .module('ElCinaroAdmin')
        .factory('$admin', factory);

    factory.$inject = ['baseApi','$http', '$q'];

    /* @ngInject */
    function factory(baseApi, $http, $q) {
        var service = {
            getUsers: getUsers
        };

        return service;

        function getUsers(query) {
          var deferred = $q.defer();

          $http.get(baseApi + '/users/', {
              params: {
                page: query.page || 1,
                page_size: query.limit || 100,
                format: 'json',
                ordering: query.order || '-id',
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
    }
})();
